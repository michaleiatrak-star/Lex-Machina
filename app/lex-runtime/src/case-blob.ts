import {
  createCipheriv,
  createDecipheriv,
  createHash,
  hkdfSync,
  randomBytes
} from "node:crypto";
import {
  mkdir,
  open,
  rename,
  rm,
  type FileHandle
} from "node:fs/promises";
import path from "node:path";

const MAGIC =
  Buffer.from("LME1", "ascii");
const SCHEMA_VERSION = 1;
const CIPHER_SUITE = 1;
const NONCE_BYTES = 12;
const TAG_BYTES = 16;
const HEADER_BYTES =
  4 + 2 + 2 + 4 + 2 + 4 + 8;
const CHUNK_BYTES =
  1024 * 1024;

export type CaseBlobPurpose =
  | "incoming-manifest"
  | "incoming-payload"
  | "extracted-manifest"
  | "extracted-payload"
  | "document-source"
  | "protected-document"
  | "artifact"
  | "artifact-manifest"
  | "artifact-payload";

export type CaseBlobIdentity = {
  caseId: string;
  objectId: string;
  purpose: CaseBlobPurpose;
  keyVersion: number;
};

type ParsedEnvelope = {
  plaintextLength: number;
  nonce: Buffer;
  aad: Buffer;
  ciphertextOffset: number;
  tagOffset: number;
};

function validCaseId(
  value: string
): boolean {
  return /^case_[a-f0-9]{32}$/
    .test(value);
}

function validObjectId(
  value: string
): boolean {
  return (
    /^[a-z][a-z0-9-]*_[a-f0-9]{32}$/
      .test(value) &&
    value.length <= 128
  );
}

function validateIdentity(
  value: CaseBlobIdentity
): void {
  if (
    !validCaseId(
      value.caseId
    ) ||
    !validObjectId(
      value.objectId
    ) ||
    !Number.isInteger(
      value.keyVersion
    ) ||
    value.keyVersion < 1
  ) {
    throw new Error(
      "INVALID_CASE_BLOB_IDENTITY"
    );
  }
}

function deriveBlobKey(
  caseDataKey: Buffer,
  identity:
    CaseBlobIdentity
): Buffer {
  if (
    caseDataKey.byteLength !==
      32
  ) {
    throw new Error(
      "INVALID_CASE_DATA_KEY"
    );
  }
  return Buffer.from(
    hkdfSync(
      "sha256",
      caseDataKey,
      Buffer.from(
        identity.caseId,
        "utf8"
      ),
      Buffer.from(
        `lex/case-blob/${identity.purpose}/v1`,
        "utf8"
      ),
      32
    )
  );
}

function aadFor(
  identity:
    CaseBlobIdentity
): Buffer {
  validateIdentity(identity);
  return Buffer.from(
    JSON.stringify({
      schemaVersion:
        SCHEMA_VERSION,
      caseId:
        identity.caseId,
      objectId:
        identity.objectId,
      purpose:
        identity.purpose,
      keyVersion:
        identity.keyVersion
    }),
    "utf8"
  );
}

function headerFor(args: {
  keyVersion: number;
  aadLength: number;
  plaintextLength: number;
}): Buffer {
  if (
    !Number.isSafeInteger(
      args.plaintextLength
    ) ||
    args.plaintextLength < 0
  ) {
    throw new Error(
      "CASE_BLOB_LENGTH_INVALID"
    );
  }
  const header =
    Buffer.alloc(
      HEADER_BYTES
    );
  let offset = 0;
  MAGIC.copy(
    header,
    offset
  );
  offset += 4;
  header.writeUInt16BE(
    SCHEMA_VERSION,
    offset
  );
  offset += 2;
  header.writeUInt16BE(
    CIPHER_SUITE,
    offset
  );
  offset += 2;
  header.writeUInt32BE(
    args.keyVersion,
    offset
  );
  offset += 4;
  header.writeUInt16BE(
    NONCE_BYTES,
    offset
  );
  offset += 2;
  header.writeUInt32BE(
    args.aadLength,
    offset
  );
  offset += 4;
  header.writeBigUInt64BE(
    BigInt(
      args.plaintextLength
    ),
    offset
  );
  return header;
}

async function writeAll(
  handle: FileHandle,
  data: Buffer
): Promise<void> {
  let offset = 0;
  while (
    offset < data.byteLength
  ) {
    const result =
      await handle.write(
        data,
        offset,
        data.byteLength -
          offset,
        null
      );
    if (
      result.bytesWritten <=
      0
    ) {
      throw new Error(
        "CASE_BLOB_WRITE_FAILED"
      );
    }
    offset +=
      result.bytesWritten;
  }
}

async function readExact(
  handle: FileHandle,
  length: number,
  position: number
): Promise<Buffer> {
  const result =
    Buffer.alloc(length);
  let offset = 0;
  while (offset < length) {
    const read =
      await handle.read(
        result,
        offset,
        length - offset,
        position + offset
      );
    if (read.bytesRead <= 0) {
      throw new Error(
        "CASE_BLOB_TRUNCATED"
      );
    }
    offset +=
      read.bytesRead;
  }
  return result;
}

async function parseEnvelope(
  handle: FileHandle,
  identity:
    CaseBlobIdentity
): Promise<ParsedEnvelope> {
  validateIdentity(identity);
  const stat =
    await handle.stat();
  if (
    stat.size <
      HEADER_BYTES +
      NONCE_BYTES +
      TAG_BYTES
  ) {
    throw new Error(
      "CASE_BLOB_TRUNCATED"
    );
  }

  const header =
    await readExact(
      handle,
      HEADER_BYTES,
      0
    );
  if (
    !header.subarray(
      0,
      4
    ).equals(MAGIC)
  ) {
    throw new Error(
      "CASE_BLOB_MAGIC_INVALID"
    );
  }

  let offset = 4;
  const schema =
    header.readUInt16BE(
      offset
    );
  offset += 2;
  const suite =
    header.readUInt16BE(
      offset
    );
  offset += 2;
  const keyVersion =
    header.readUInt32BE(
      offset
    );
  offset += 4;
  const nonceLength =
    header.readUInt16BE(
      offset
    );
  offset += 2;
  const aadLength =
    header.readUInt32BE(
      offset
    );
  offset += 4;
  const plaintextBig =
    header.readBigUInt64BE(
      offset
    );

  if (
    schema !==
      SCHEMA_VERSION ||
    suite !==
      CIPHER_SUITE ||
    keyVersion !==
      identity.keyVersion ||
    nonceLength !==
      NONCE_BYTES ||
    plaintextBig >
      BigInt(
        Number.MAX_SAFE_INTEGER
      )
  ) {
    throw new Error(
      "CASE_BLOB_HEADER_INVALID"
    );
  }

  const plaintextLength =
    Number(
      plaintextBig
    );
  const expectedSize =
    HEADER_BYTES +
    nonceLength +
    aadLength +
    plaintextLength +
    TAG_BYTES;
  if (
    stat.size !==
      expectedSize
  ) {
    throw new Error(
      "CASE_BLOB_LENGTH_INVALID"
    );
  }

  const nonce =
    await readExact(
      handle,
      nonceLength,
      HEADER_BYTES
    );
  const aad =
    await readExact(
      handle,
      aadLength,
      HEADER_BYTES +
        nonceLength
    );
  const expectedAad =
    aadFor(identity);
  if (
    !aad.equals(
      expectedAad
    )
  ) {
    throw new Error(
      "CASE_BLOB_AAD_INVALID"
    );
  }

  return {
    plaintextLength,
    nonce,
    aad,
    ciphertextOffset:
      HEADER_BYTES +
      nonceLength +
      aadLength,
    tagOffset:
      HEADER_BYTES +
      nonceLength +
      aadLength +
      plaintextLength
  };
}

async function verifyCaseBlob(args: {
  targetFile: string;
  identity:
    CaseBlobIdentity;
  caseDataKey: Buffer;
  expectedSha256?: string;
}): Promise<string> {
  const handle =
    await open(
      args.targetFile,
      "r"
    );
  let key:
    Buffer | undefined;
  try {
    const parsed =
      await parseEnvelope(
        handle,
        args.identity
      );
    const tag =
      await readExact(
        handle,
        TAG_BYTES,
        parsed.tagOffset
      );
    key =
      deriveBlobKey(
        args.caseDataKey,
        args.identity
      );
    const decipher =
      createDecipheriv(
        "aes-256-gcm",
        key,
        parsed.nonce
      );
    decipher.setAAD(
      parsed.aad,
      {
        plaintextLength:
          parsed.plaintextLength
      }
    );
    decipher.setAuthTag(tag);

    const hash =
      createHash("sha256");
    let position =
      parsed.ciphertextOffset;
    let remaining =
      parsed.plaintextLength;

    while (remaining > 0) {
      const length =
        Math.min(
          CHUNK_BYTES,
          remaining
        );
      const encrypted =
        await readExact(
          handle,
          length,
          position
        );
      const plain =
        decipher.update(
          encrypted
        );
      hash.update(plain);
      plain.fill(0);
      position += length;
      remaining -= length;
    }

    const final =
      decipher.final();
    if (
      final.byteLength > 0
    ) {
      hash.update(final);
      final.fill(0);
    }
    const digest =
      hash.digest("hex");
    if (
      args.expectedSha256 &&
      digest !==
        args.expectedSha256
    ) {
      throw new Error(
        "CASE_BLOB_PLAINTEXT_HASH_MISMATCH"
      );
    }
    return digest;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith(
        "CASE_BLOB_"
      )
    ) {
      throw error;
    }
    throw new Error(
      "CASE_BLOB_AUTHENTICATION_FAILED"
    );
  } finally {
    key?.fill(0);
    await handle.close();
  }
}

export async function writeCaseBlob(
  args: {
    targetFile: string;
    identity:
      CaseBlobIdentity;
    caseDataKey: Buffer;
    data: Uint8Array;
    expectedSha256?: string;
  }
): Promise<void> {
  validateIdentity(
    args.identity
  );
  const plaintextLength =
    args.data.byteLength;
  const expectedSha256 =
    args.expectedSha256 ??
    createHash("sha256")
      .update(args.data)
      .digest("hex");
  const aad =
    aadFor(
      args.identity
    );
  const nonce =
    randomBytes(
      NONCE_BYTES
    );
  const header =
    headerFor({
      keyVersion:
        args.identity
          .keyVersion,
      aadLength:
        aad.byteLength,
      plaintextLength
    });
  const key =
    deriveBlobKey(
      args.caseDataKey,
      args.identity
    );
  const cipher =
    createCipheriv(
      "aes-256-gcm",
      key,
      nonce
    );
  cipher.setAAD(
    aad,
    {
      plaintextLength
    }
  );

  const targetFile =
    path.resolve(
      args.targetFile
    );
  await mkdir(
    path.dirname(
      targetFile
    ),
    {
      recursive: true,
      mode: 0o700
    }
  );
  const partial =
    targetFile +
    ".partial";
  await rm(
    partial,
    { force: true }
  );

  const handle =
    await open(
      partial,
      "wx",
      0o600
    );
  try {
    await writeAll(
      handle,
      header
    );
    await writeAll(
      handle,
      nonce
    );
    await writeAll(
      handle,
      aad
    );

    for (
      let offset = 0;
      offset <
        plaintextLength;
      offset +=
        CHUNK_BYTES
    ) {
      const length =
        Math.min(
          CHUNK_BYTES,
          plaintextLength -
            offset
        );
      const chunk =
        Buffer.from(
          args.data.buffer,
          args.data.byteOffset +
            offset,
          length
        );
      const encrypted =
        cipher.update(
          chunk
        );
      await writeAll(
        handle,
        encrypted
      );
    }
    const final =
      cipher.final();
    if (
      final.byteLength > 0
    ) {
      await writeAll(
        handle,
        final
      );
    }
    await writeAll(
      handle,
      cipher.getAuthTag()
    );
    await handle.sync();
  } finally {
    key.fill(0);
    await handle.close();
  }

  try {
    await verifyCaseBlob({
      targetFile:
        partial,
      identity:
        args.identity,
      caseDataKey:
        args.caseDataKey,
      expectedSha256
    });
    await rename(
      partial,
      targetFile
    );
  } catch (error) {
    await rm(
      partial,
      { force: true }
    );
    throw error;
  }
}

export async function writeCaseBlobFromFile(
  args: {
    targetFile: string;
    sourceFile: string;
    identity:
      CaseBlobIdentity;
    caseDataKey: Buffer;
    expectedSha256: string;
  }
): Promise<void> {
  validateIdentity(
    args.identity
  );
  if (
    !/^[a-f0-9]{64}$/.test(
      args.expectedSha256
    )
  ) {
    throw new Error(
      "CASE_BLOB_PLAINTEXT_HASH_INVALID"
    );
  }

  const source =
    await open(
      args.sourceFile,
      "r"
    );
  const sourceStat =
    await source.stat();
  if (
    !sourceStat.isFile() ||
    !Number.isSafeInteger(
      sourceStat.size
    )
  ) {
    await source.close();
    throw new Error(
      "CASE_BLOB_SOURCE_INVALID"
    );
  }

  const plaintextLength =
    sourceStat.size;
  const aad =
    aadFor(
      args.identity
    );
  const nonce =
    randomBytes(
      NONCE_BYTES
    );
  const header =
    headerFor({
      keyVersion:
        args.identity
          .keyVersion,
      aadLength:
        aad.byteLength,
      plaintextLength
    });
  const key =
    deriveBlobKey(
      args.caseDataKey,
      args.identity
    );
  const cipher =
    createCipheriv(
      "aes-256-gcm",
      key,
      nonce
    );
  cipher.setAAD(
    aad,
    {
      plaintextLength
    }
  );

  const targetFile =
    path.resolve(
      args.targetFile
    );
  await mkdir(
    path.dirname(
      targetFile
    ),
    {
      recursive: true,
      mode: 0o700
    }
  );
  const partial =
    targetFile +
    ".partial";
  await rm(
    partial,
    { force: true }
  );
  const output =
    await open(
      partial,
      "wx",
      0o600
    );
  const hash =
    createHash("sha256");

  try {
    await writeAll(
      output,
      header
    );
    await writeAll(
      output,
      nonce
    );
    await writeAll(
      output,
      aad
    );

    let position = 0;
    let remaining =
      plaintextLength;
    while (remaining > 0) {
      const length =
        Math.min(
          CHUNK_BYTES,
          remaining
        );
      const plain =
        await readExact(
          source,
          length,
          position
        );
      hash.update(plain);
      const encrypted =
        cipher.update(
          plain
        );
      plain.fill(0);
      await writeAll(
        output,
        encrypted
      );
      position += length;
      remaining -= length;
    }

    const digest =
      hash.digest("hex");
    if (
      digest !==
        args.expectedSha256
    ) {
      throw new Error(
        "CASE_BLOB_PLAINTEXT_HASH_MISMATCH"
      );
    }

    const final =
      cipher.final();
    if (
      final.byteLength > 0
    ) {
      await writeAll(
        output,
        final
      );
    }
    await writeAll(
      output,
      cipher.getAuthTag()
    );
    await output.sync();
    await output.close();
    await source.close();
    key.fill(0);

    await verifyCaseBlob({
      targetFile:
        partial,
      identity:
        args.identity,
      caseDataKey:
        args.caseDataKey,
      expectedSha256:
        args.expectedSha256
    });
    await rename(
      partial,
      targetFile
    );
  } catch (error) {
    try {
      await output.close();
    } catch {
      // already closed
    }
    try {
      await source.close();
    } catch {
      // already closed
    }
    key.fill(0);
    await rm(
      partial,
      { force: true }
    );
    throw error;
  }
}

export async function readCaseBlob(
  args: {
    targetFile: string;
    identity:
      CaseBlobIdentity;
    caseDataKey: Buffer;
    maxBytes: number;
  }
): Promise<Buffer> {
  const handle =
    await open(
      args.targetFile,
      "r"
    );
  let key:
    Buffer | undefined;
  try {
    const parsed =
      await parseEnvelope(
        handle,
        args.identity
      );
    if (
      parsed.plaintextLength >
        args.maxBytes
    ) {
      throw new Error(
        "CASE_BLOB_READ_LIMIT_EXCEEDED"
      );
    }
    const tag =
      await readExact(
        handle,
        TAG_BYTES,
        parsed.tagOffset
      );
    key =
      deriveBlobKey(
        args.caseDataKey,
        args.identity
      );
    const decipher =
      createDecipheriv(
        "aes-256-gcm",
        key,
        parsed.nonce
      );
    decipher.setAAD(
      parsed.aad,
      {
        plaintextLength:
          parsed.plaintextLength
      }
    );
    decipher.setAuthTag(tag);

    const chunks: Buffer[] = [];
    let position =
      parsed.ciphertextOffset;
    let remaining =
      parsed.plaintextLength;
    while (remaining > 0) {
      const length =
        Math.min(
          CHUNK_BYTES,
          remaining
        );
      const encrypted =
        await readExact(
          handle,
          length,
          position
        );
      chunks.push(
        decipher.update(
          encrypted
        )
      );
      position += length;
      remaining -= length;
    }
    const final =
      decipher.final();
    if (
      final.byteLength > 0
    ) {
      chunks.push(final);
    }
    return Buffer.concat(
      chunks,
      parsed.plaintextLength
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith(
        "CASE_BLOB_"
      )
    ) {
      throw error;
    }
    throw new Error(
      "CASE_BLOB_AUTHENTICATION_FAILED"
    );
  } finally {
    key?.fill(0);
    await handle.close();
  }
}

export async function rekeyCaseBlob(
  args: {
    targetFile: string;
    oldIdentity:
      CaseBlobIdentity;
    newIdentity:
      CaseBlobIdentity;
    oldCaseDataKey: Buffer;
    newCaseDataKey: Buffer;
  }
): Promise<void> {
  const source =
    await open(
      args.targetFile,
      "r"
    );
  const parsed =
    await parseEnvelope(
      source,
      args.oldIdentity
    );
  const oldTag =
    await readExact(
      source,
      TAG_BYTES,
      parsed.tagOffset
    );

  const newAad =
    aadFor(
      args.newIdentity
    );
  const newNonce =
    randomBytes(
      NONCE_BYTES
    );
  const newHeader =
    headerFor({
      keyVersion:
        args.newIdentity
          .keyVersion,
      aadLength:
        newAad.byteLength,
      plaintextLength:
        parsed.plaintextLength
    });
  const oldKey =
    deriveBlobKey(
      args.oldCaseDataKey,
      args.oldIdentity
    );
  const newKey =
    deriveBlobKey(
      args.newCaseDataKey,
      args.newIdentity
    );
  const decipher =
    createDecipheriv(
      "aes-256-gcm",
      oldKey,
      parsed.nonce
    );
  decipher.setAAD(
    parsed.aad,
    {
      plaintextLength:
        parsed.plaintextLength
    }
  );
  decipher.setAuthTag(
    oldTag
  );
  const cipher =
    createCipheriv(
      "aes-256-gcm",
      newKey,
      newNonce
    );
  cipher.setAAD(
    newAad,
    {
      plaintextLength:
        parsed.plaintextLength
    }
  );

  const target =
    path.resolve(
      args.targetFile
    );
  const partial =
    target +
    ".rekey.partial";
  await rm(
    partial,
    { force: true }
  );
  const output =
    await open(
      partial,
      "wx",
      0o600
    );
  const hash =
    createHash("sha256");

  try {
    await writeAll(
      output,
      newHeader
    );
    await writeAll(
      output,
      newNonce
    );
    await writeAll(
      output,
      newAad
    );

    let position =
      parsed.ciphertextOffset;
    let remaining =
      parsed.plaintextLength;
    while (remaining > 0) {
      const length =
        Math.min(
          CHUNK_BYTES,
          remaining
        );
      const encrypted =
        await readExact(
          source,
          length,
          position
        );
      const plain =
        decipher.update(
          encrypted
        );
      hash.update(plain);
      const reencrypted =
        cipher.update(
          plain
        );
      plain.fill(0);
      await writeAll(
        output,
        reencrypted
      );
      position += length;
      remaining -= length;
    }

    const oldFinal =
      decipher.final();
    if (
      oldFinal.byteLength >
      0
    ) {
      hash.update(
        oldFinal
      );
      const extra =
        cipher.update(
          oldFinal
        );
      oldFinal.fill(0);
      await writeAll(
        output,
        extra
      );
    }
    const newFinal =
      cipher.final();
    if (
      newFinal.byteLength >
      0
    ) {
      await writeAll(
        output,
        newFinal
      );
    }
    await writeAll(
      output,
      cipher.getAuthTag()
    );
    await output.sync();
  } catch (error) {
    await output.close();
    await source.close();
    oldKey.fill(0);
    newKey.fill(0);
    await rm(
      partial,
      { force: true }
    );
    if (
      error instanceof Error &&
      error.message.startsWith(
        "CASE_BLOB_"
      )
    ) {
      throw error;
    }
    throw new Error(
      "CASE_BLOB_AUTHENTICATION_FAILED"
    );
  }

  await output.close();
  await source.close();
  oldKey.fill(0);
  newKey.fill(0);

  const digest =
    hash.digest("hex");
  try {
    await verifyCaseBlob({
      targetFile: partial,
      identity:
        args.newIdentity,
      caseDataKey:
        args.newCaseDataKey,
      expectedSha256:
        digest
    });
    await rename(
      partial,
      target
    );
  } catch (error) {
    await rm(
      partial,
      { force: true }
    );
    throw error;
  }
}
