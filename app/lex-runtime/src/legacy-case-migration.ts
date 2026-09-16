import {
  createHash
} from "node:crypto";
import {
  access,
  readFile,
  readdir,
  rm,
  rmdir,
  stat
} from "node:fs/promises";
import type {
  Dirent
} from "node:fs";
import os from "node:os";
import path from "node:path";
import type {
  StoredUpload
} from "./case-file-store.js";
import type {
  SecureCaseUploadStore
} from "./case-secure-store.js";

export type LegacyStorageMigrationReport = {
  caseId: string;
  migratedUploads: string[];
  removedLegacyDirectories: string[];
  alreadySecureUploads: string[];
  blockedEntries: string[];
  remainingLegacyPlaintext: boolean;
};

export type LegacyCaseStorageMigratorOptions = {
  rootDir?: string;
  manifestMaxBytes?: number;
  uploadMaxBytes?: number;
};

function defaultRootDir(): string {
  return path.resolve(
    process.env.LEX_DATA_DIR ??
      path.join(
        os.homedir(),
        ".lex-machina",
        "data"
      )
  );
}

function validCaseId(
  value: string
): boolean {
  return /^case_[a-f0-9]{32}$/
    .test(value);
}

function validUploadId(
  value: string
): boolean {
  return /^upload_[a-f0-9]{32}$/
    .test(value);
}

function validSha256(
  value: string
): boolean {
  return /^[a-f0-9]{64}$/
    .test(value);
}

function safeLegacyFilename(
  value: string
): boolean {
  return (
    value.length > 0 &&
    value.length <= 180 &&
    value !== "." &&
    value !== ".." &&
    !value.includes("/") &&
    !value.includes("\\") &&
    !/[\x00-\x1f\x7f]/
      .test(value)
  );
}

async function directoryEntries(
  directory: string
): Promise<Dirent[]> {
  try {
    return await readdir(
      directory,
      {
        withFileTypes: true
      }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
}

export class LegacyCaseStorageMigrator {
  readonly rootDir: string;
  private readonly manifestMaxBytes:
    number;
  private readonly uploadMaxBytes:
    number;

  constructor(
    private readonly secureUploads:
      Pick<
        SecureCaseUploadStore,
        | "saveUpload"
        | "listUploads"
        | "readUploadPayload"
      >,
    options:
      LegacyCaseStorageMigratorOptions = {}
  ) {
    this.rootDir =
      path.resolve(
        options.rootDir ??
          defaultRootDir()
      );
    this.manifestMaxBytes =
      options.manifestMaxBytes ??
      512 * 1024;
    this.uploadMaxBytes =
      options.uploadMaxBytes ??
      512 * 1024 * 1024;
  }

  private caseDir(
    caseId: string
  ): string {
    if (!validCaseId(caseId)) {
      throw new Error(
        "INVALID_CASE_ID"
      );
    }
    const base = path.resolve(
      this.rootDir,
      "cases"
    );
    const target = path.resolve(
      base,
      caseId
    );
    if (
      !target.startsWith(
        base + path.sep
      )
    ) {
      throw new Error(
        "CASE_PATH_ESCAPE"
      );
    }
    return target;
  }

  private legacyUploadDir(
    caseId: string,
    uploadId: string
  ): string {
    if (!validUploadId(uploadId)) {
      throw new Error(
        "INVALID_UPLOAD_ID"
      );
    }
    const base = path.resolve(
      this.caseDir(caseId),
      "incoming"
    );
    const target = path.resolve(
      base,
      uploadId
    );
    if (
      !target.startsWith(
        base + path.sep
      )
    ) {
      throw new Error(
        "LEGACY_UPLOAD_PATH_ESCAPE"
      );
    }
    return target;
  }

  private async readLegacyManifest(
    caseId: string,
    uploadId: string
  ): Promise<StoredUpload> {
    const manifestPath = path.join(
      this.legacyUploadDir(
        caseId,
        uploadId
      ),
      "manifest.json"
    );
    const manifestStat =
      await stat(manifestPath);
    if (
      !manifestStat.isFile() ||
      manifestStat.size < 2 ||
      manifestStat.size >
        this.manifestMaxBytes
    ) {
      throw new Error(
        "LEGACY_MANIFEST_INVALID"
      );
    }
    const parsed = JSON.parse(
      await readFile(
        manifestPath,
        "utf8"
      )
    ) as StoredUpload;
    if (
      parsed.caseId !== caseId ||
      parsed.uploadId !== uploadId ||
      !safeLegacyFilename(
        parsed.filename
      ) ||
      typeof parsed.mediaType !==
        "string" ||
      !validSha256(parsed.sha256) ||
      !Number.isSafeInteger(
        parsed.bytes
      ) ||
      parsed.bytes < 0 ||
      parsed.bytes >
        this.uploadMaxBytes ||
      typeof parsed.storedAt !==
        "string" ||
      typeof parsed.archive !==
        "boolean" ||
      !Array.isArray(
        parsed.extracted
      )
    ) {
      throw new Error(
        "LEGACY_MANIFEST_INVALID"
      );
    }
    return parsed;
  }

  private async readLegacyPayload(
    caseId: string,
    uploadId: string,
    manifest: StoredUpload
  ): Promise<Buffer> {
    const originalDir = path.join(
      this.legacyUploadDir(
        caseId,
        uploadId
      ),
      "original"
    );
    const entries =
      await directoryEntries(
        originalDir
      );
    if (
      entries.length !== 1 ||
      !entries[0]!.isFile() ||
      entries[0]!.name !==
        manifest.filename
    ) {
      throw new Error(
        "LEGACY_ORIGINAL_LAYOUT_INVALID"
      );
    }
    const target = path.join(
      originalDir,
      manifest.filename
    );
    const info = await stat(target);
    if (
      !info.isFile() ||
      info.size !== manifest.bytes ||
      info.size > this.uploadMaxBytes
    ) {
      throw new Error(
        "LEGACY_ORIGINAL_SIZE_MISMATCH"
      );
    }
    const data = await readFile(target);
    const digest = createHash("sha256")
      .update(data)
      .digest("hex");
    if (digest !== manifest.sha256) {
      data.fill(0);
      throw new Error(
        "LEGACY_ORIGINAL_HASH_MISMATCH"
      );
    }
    return data;
  }

  private async verifySecureUpload(
    args: {
      caseId: string;
      uploadId: string;
      expected: StoredUpload;
      caseDataKey: Buffer;
      keyVersion: number;
    }
  ): Promise<boolean> {
    const secure =
      await this.secureUploads
        .listUploads({
          caseId: args.caseId,
          caseDataKey:
            args.caseDataKey,
          keyVersion:
            args.keyVersion
        });
    const match = secure.find(
      (item) =>
        item.uploadId ===
          args.uploadId
    );
    if (!match) return false;
    if (
      match.sha256 !==
        args.expected.sha256 ||
      match.bytes !==
        args.expected.bytes ||
      match.filename !==
        args.expected.filename ||
      match.mediaType !==
        args.expected.mediaType
    ) {
      throw new Error(
        "LEGACY_SECURE_COPY_MISMATCH"
      );
    }
    const payload =
      await this.secureUploads
        .readUploadPayload({
          caseId: args.caseId,
          uploadId:
            args.uploadId,
          caseDataKey:
            args.caseDataKey,
          keyVersion:
            args.keyVersion,
          maxBytes:
            this.uploadMaxBytes
        });
    try {
      const digest =
        createHash("sha256")
          .update(payload)
          .digest("hex");
      if (
        payload.byteLength !==
          args.expected.bytes ||
        digest !==
          args.expected.sha256
      ) {
        throw new Error(
          "LEGACY_SECURE_PAYLOAD_VERIFY_FAILED"
        );
      }
    } finally {
      payload.fill(0);
    }
    return true;
  }

  private async scanUnknownLegacy(
    caseId: string
  ): Promise<string[]> {
    const blocked: string[] = [];
    for (
      const name
      of [
        "documents",
        "artifacts",
        "audit"
      ]
    ) {
      const base = path.join(
        this.caseDir(caseId),
        name
      );
      const entries =
        await directoryEntries(base);
      if (entries.length > 0) {
        blocked.push(
          `${name}:NONEMPTY_LEGACY_DIRECTORY`
        );
      }
    }
    return blocked;
  }

  async migrate(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<LegacyStorageMigrationReport> {
    await access(
      path.join(
        this.caseDir(
          args.caseId
        ),
        "case.json"
      )
    );

    const blockedEntries =
      await this.scanUnknownLegacy(
        args.caseId
      );
    const incoming = path.join(
      this.caseDir(args.caseId),
      "incoming"
    );
    const incomingEntries =
      await directoryEntries(
        incoming
      );

    for (
      const entry
      of incomingEntries
    ) {
      if (
        !entry.isDirectory() ||
        !validUploadId(
          entry.name
        )
      ) {
        blockedEntries.push(
          `incoming/${entry.name}:UNKNOWN_LEGACY_ENTRY`
        );
      }
    }

    if (
      blockedEntries.length > 0
    ) {
      return {
        caseId: args.caseId,
        migratedUploads: [],
        removedLegacyDirectories: [],
        alreadySecureUploads: [],
        blockedEntries,
        remainingLegacyPlaintext: true
      };
    }

    const migratedUploads:
      string[] = [];
    const alreadySecureUploads:
      string[] = [];

    for (
      const entry
      of incomingEntries
    ) {
      const uploadId = entry.name;
      const manifest =
        await this.readLegacyManifest(
          args.caseId,
          uploadId
        );

      const alreadySecure =
        await this.verifySecureUpload({
          caseId: args.caseId,
          uploadId,
          expected: manifest,
          caseDataKey:
            args.caseDataKey,
          keyVersion:
            args.keyVersion
        });

      if (!alreadySecure) {
        const data =
          await this.readLegacyPayload(
            args.caseId,
            uploadId,
            manifest
          );
        try {
          await this.secureUploads
            .saveUpload({
              caseId: args.caseId,
              uploadId,
              filename:
                manifest.filename,
              mediaType:
                manifest.mediaType,
              data,
              caseDataKey:
                args.caseDataKey,
              keyVersion:
                args.keyVersion
            });
        } finally {
          data.fill(0);
        }
        await this.verifySecureUpload({
          caseId: args.caseId,
          uploadId,
          expected: manifest,
          caseDataKey:
            args.caseDataKey,
          keyVersion:
            args.keyVersion
        });
        migratedUploads.push(
          uploadId
        );
      } else {
        alreadySecureUploads.push(
          uploadId
        );
      }

      await rm(
        this.legacyUploadDir(
          args.caseId,
          uploadId
        ),
        {
          recursive: true,
          force: true
        }
      );
    }

    const removedLegacyDirectories:
      string[] = [];
    for (
      const name
      of [
        "incoming",
        "documents",
        "artifacts",
        "audit"
      ]
    ) {
      const directory = path.join(
        this.caseDir(args.caseId),
        name
      );
      const entries =
        await directoryEntries(
          directory
        );
      if (entries.length === 0) {
        try {
          await rmdir(directory);
          removedLegacyDirectories.push(
            name
          );
        } catch {
          // If the directory changed concurrently it remains visible
          // to the final rescan and migration does not claim success.
        }
      }
    }

    const finalBlocked =
      await this.scanUnknownLegacy(
        args.caseId
      );
    const remainingIncoming =
      await directoryEntries(
        path.join(
          this.caseDir(args.caseId),
          "incoming"
        )
      );
    for (
      const entry
      of remainingIncoming
    ) {
      finalBlocked.push(
        `incoming/${entry.name}:REMAINING_LEGACY_ENTRY`
      );
    }

    return {
      caseId: args.caseId,
      migratedUploads,
      removedLegacyDirectories,
      alreadySecureUploads,
      blockedEntries:
        finalBlocked,
      remainingLegacyPlaintext:
        finalBlocked.length > 0
    };
  }
}
