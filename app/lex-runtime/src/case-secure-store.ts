import {
  access,
  mkdir,
  readFile,
  readdir,
  rm
} from "node:fs/promises";
import type {
  Dirent
} from "node:fs";
import {
  createHash,
  randomBytes
} from "node:crypto";
import os from "node:os";
import path from "node:path";
import {
  readCaseBlob,
  rekeyCaseBlob,
  writeCaseBlob,
  type CaseBlobIdentity
} from "./case-blob.js";
import type {
  StoredUpload
} from "./case-file-store.js";

export type SecureCaseUploadStoreOptions = {
  rootDir?: string;
  manifestMaxBytes?: number;
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

function safeFilename(
  value: string
): string {
  const normalized =
    value
      .normalize("NFKC")
      .replace(
        /[\x00-\x1f\x7f]/g,
        ""
      )
      .replace(
        /[\\/]/g,
        "_"
      )
      .trim();
  const candidate =
    normalized ||
    "upload.bin";
  if (
    candidate === "." ||
    candidate === ".." ||
    candidate.length > 180
  ) {
    return "upload.bin";
  }
  return candidate;
}

function sha256(
  data: Uint8Array
): string {
  return createHash(
    "sha256"
  )
    .update(data)
    .digest("hex");
}

function manifestIdentity(
  caseId: string,
  uploadId: string,
  keyVersion: number
): CaseBlobIdentity {
  return {
    caseId,
    objectId: uploadId,
    purpose:
      "incoming-manifest",
    keyVersion
  };
}

function payloadIdentity(
  caseId: string,
  uploadId: string,
  keyVersion: number
): CaseBlobIdentity {
  return {
    caseId,
    objectId: uploadId,
    purpose:
      "incoming-payload",
    keyVersion
  };
}

export class SecureCaseUploadStore {
  readonly rootDir: string;
  private readonly manifestMaxBytes:
    number;

  constructor(
    options:
      SecureCaseUploadStoreOptions = {}
  ) {
    this.rootDir =
      path.resolve(
        options.rootDir ??
          defaultRootDir()
      );
    this.manifestMaxBytes =
      options.manifestMaxBytes ??
      512 * 1024;
  }

  private caseDir(
    caseId: string
  ): string {
    if (
      !validCaseId(
        caseId
      )
    ) {
      throw new Error(
        "INVALID_CASE_ID"
      );
    }
    const target =
      path.resolve(
        this.rootDir,
        "cases",
        caseId
      );
    const base =
      path.resolve(
        this.rootDir,
        "cases"
      ) + path.sep;
    if (
      !target.startsWith(
        base
      )
    ) {
      throw new Error(
        "CASE_PATH_ESCAPE"
      );
    }
    return target;
  }

  private incomingDir(
    caseId: string
  ): string {
    return path.join(
      this.caseDir(caseId),
      "secure",
      "incoming"
    );
  }

  private uploadDir(
    caseId: string,
    uploadId: string
  ): string {
    if (
      !validUploadId(
        uploadId
      )
    ) {
      throw new Error(
        "INVALID_UPLOAD_ID"
      );
    }
    const base =
      path.resolve(
        this.incomingDir(
          caseId
        )
      );
    const target =
      path.resolve(
        base,
        uploadId
      );
    if (
      !target.startsWith(
        base + path.sep
      )
    ) {
      throw new Error(
        "SECURE_UPLOAD_PATH_ESCAPE"
      );
    }
    return target;
  }

  private async assertCaseKeyVersion(
    caseId: string,
    keyVersion: number
  ): Promise<void> {
    await access(
      path.join(
        this.caseDir(caseId),
        "case.json"
      )
    );
    const parsed =
      JSON.parse(
        await readFile(
          path.join(
            this.caseDir(
              caseId
            ),
            "case.json"
          ),
          "utf8"
        )
      ) as Record<
        string,
        unknown
      >;
    if (
      parsed.caseId !==
        caseId ||
      parsed.keyVersion !==
        keyVersion ||
      typeof parsed
        .createdByUserId !==
        "string"
    ) {
      throw new Error(
        "CASE_KEY_VERSION_MISMATCH"
      );
    }
  }

  async saveUpload(args: {
    caseId: string;
    filename: string;
    mediaType: string;
    data: Uint8Array;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<StoredUpload> {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );

    const uploadId =
      "upload_" +
      randomBytes(16)
        .toString("hex");
    const dir =
      this.uploadDir(
        args.caseId,
        uploadId
      );
    await mkdir(
      dir,
      {
        recursive: true,
        mode: 0o700
      }
    );

    const filename =
      safeFilename(
        args.filename
      );
    const isZip =
      args.mediaType ===
        "application/zip" ||
      filename
        .toLowerCase()
        .endsWith(".zip");
    const manifest:
      StoredUpload = {
        caseId:
          args.caseId,
        uploadId,
        filename,
        mediaType:
          args.mediaType,
        sha256:
          sha256(
            args.data
          ),
        bytes:
          args.data.byteLength,
        storedAt:
          new Date()
            .toISOString(),
        archive:
          isZip,
        extracted: [],
        storage:
          "ENCRYPTED_LME1",
        ...(isZip
          ? {
              archiveExtractionStatus:
                "DEFERRED_G34H2"
            }
          : {})
      };

    try {
      await writeCaseBlob({
        targetFile:
          path.join(
            dir,
            "payload.lme"
          ),
        identity:
          payloadIdentity(
            args.caseId,
            uploadId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        data:
          args.data,
        expectedSha256:
          manifest.sha256
      });

      const manifestBytes =
        Buffer.from(
          JSON.stringify(
            manifest
          ),
          "utf8"
        );
      try {
        await writeCaseBlob({
          targetFile:
            path.join(
              dir,
              "manifest.lme"
            ),
          identity:
            manifestIdentity(
              args.caseId,
              uploadId,
              args.keyVersion
            ),
          caseDataKey:
            args.caseDataKey,
          data:
            manifestBytes
        });
      } finally {
        manifestBytes.fill(0);
      }

      return {
        ...manifest
      };
    } catch (error) {
      await rm(
        dir,
        {
          recursive: true,
          force: true
        }
      );
      throw error;
    }
  }

  async listUploads(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<StoredUpload[]> {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );
    let entries:
      Dirent[];
    try {
      entries =
        await readdir(
          this.incomingDir(
            args.caseId
          ),
          {
            withFileTypes:
              true
          }
        );
    } catch (error) {
      if (
        error instanceof
          Error &&
        "code" in error &&
        error.code ===
          "ENOENT"
      ) {
        return [];
      }
      throw error;
    }

    const result:
      StoredUpload[] = [];
    for (
      const entry of entries
    ) {
      if (
        !entry.isDirectory() ||
        !validUploadId(
          entry.name
        )
      ) {
        continue;
      }
      try {
        const data =
          await readCaseBlob({
            targetFile:
              path.join(
                this.uploadDir(
                  args.caseId,
                  entry.name
                ),
                "manifest.lme"
              ),
            identity:
              manifestIdentity(
                args.caseId,
                entry.name,
                args.keyVersion
              ),
            caseDataKey:
              args.caseDataKey,
            maxBytes:
              this
                .manifestMaxBytes
          });
        try {
          const parsed =
            JSON.parse(
              data.toString(
                "utf8"
              )
            ) as StoredUpload;
          if (
            parsed.caseId !==
              args.caseId ||
            parsed.uploadId !==
              entry.name ||
            typeof parsed
              .filename !==
              "string" ||
            typeof parsed
              .mediaType !==
              "string" ||
            !/^[a-f0-9]{64}$/
              .test(
                parsed.sha256
              ) ||
            typeof parsed
              .bytes !==
              "number" ||
            typeof parsed
              .storedAt !==
              "string" ||
            typeof parsed
              .archive !==
              "boolean" ||
            !Array.isArray(
              parsed.extracted
            ) ||
            parsed.storage !==
              "ENCRYPTED_LME1"
          ) {
            throw new Error(
              "SECURE_UPLOAD_MANIFEST_INVALID"
            );
          }
          result.push(
            parsed
          );
        } finally {
          data.fill(0);
        }
      } catch {
        // Fail closed for the invalid entry, but keep unrelated
        // valid uploads browsable.
      }
    }

    return result.sort(
      (a, b) =>
        b.storedAt
          .localeCompare(
            a.storedAt
          )
    );
  }

  async readUploadPayload(args: {
    caseId: string;
    uploadId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    maxBytes: number;
  }): Promise<Buffer> {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );
    return await readCaseBlob({
      targetFile:
        path.join(
          this.uploadDir(
            args.caseId,
            args.uploadId
          ),
          "payload.lme"
        ),
      identity:
        payloadIdentity(
          args.caseId,
          args.uploadId,
          args.keyVersion
        ),
      caseDataKey:
        args.caseDataKey,
      maxBytes:
        args.maxBytes
    });
  }

  async rekeyCaseIncoming(args: {
    caseId: string;
    oldCaseDataKey: Buffer;
    oldKeyVersion: number;
    newCaseDataKey: Buffer;
    newKeyVersion: number;
  }): Promise<boolean> {
    let entries:
      Dirent[];
    try {
      entries =
        await readdir(
          this.incomingDir(
            args.caseId
          ),
          {
            withFileTypes:
              true
          }
        );
    } catch (error) {
      if (
        error instanceof
          Error &&
        "code" in error &&
        error.code ===
          "ENOENT"
      ) {
        return false;
      }
      throw error;
    }

    const uploadIds =
      entries
        .filter(
          (entry) =>
            entry
              .isDirectory() &&
            validUploadId(
              entry.name
            )
        )
        .map(
          (entry) =>
            entry.name
        )
        .sort();

    const completed:
      string[] = [];

    const rekeyOne =
      async (
        uploadId: string,
        reverse = false
      ): Promise<void> => {
        const fromKey =
          reverse
            ? args
                .newCaseDataKey
            : args
                .oldCaseDataKey;
        const toKey =
          reverse
            ? args
                .oldCaseDataKey
            : args
                .newCaseDataKey;
        const fromVersion =
          reverse
            ? args
                .newKeyVersion
            : args
                .oldKeyVersion;
        const toVersion =
          reverse
            ? args
                .oldKeyVersion
            : args
                .newKeyVersion;
        const dir =
          this.uploadDir(
            args.caseId,
            uploadId
          );

        await rekeyCaseBlob({
          targetFile:
            path.join(
              dir,
              "payload.lme"
            ),
          oldIdentity:
            payloadIdentity(
              args.caseId,
              uploadId,
              fromVersion
            ),
          newIdentity:
            payloadIdentity(
              args.caseId,
              uploadId,
              toVersion
            ),
          oldCaseDataKey:
            fromKey,
          newCaseDataKey:
            toKey
        });

        try {
          await rekeyCaseBlob({
            targetFile:
              path.join(
                dir,
                "manifest.lme"
              ),
            oldIdentity:
              manifestIdentity(
                args.caseId,
                uploadId,
                fromVersion
              ),
            newIdentity:
              manifestIdentity(
                args.caseId,
                uploadId,
                toVersion
              ),
            oldCaseDataKey:
              fromKey,
            newCaseDataKey:
              toKey
          });
        } catch (error) {
          await rekeyCaseBlob({
            targetFile:
              path.join(
                dir,
                "payload.lme"
              ),
            oldIdentity:
              payloadIdentity(
                args.caseId,
                uploadId,
                toVersion
              ),
            newIdentity:
              payloadIdentity(
                args.caseId,
                uploadId,
                fromVersion
              ),
            oldCaseDataKey:
              toKey,
            newCaseDataKey:
              fromKey
          });
          throw error;
        }
      };

    try {
      for (
        const uploadId
        of uploadIds
      ) {
        await rekeyOne(
          uploadId
        );
        completed.push(
          uploadId
        );
      }
      return (
        uploadIds.length > 0
      );
    } catch (error) {
      try {
        for (
          const uploadId
          of [...completed]
            .reverse()
        ) {
          await rekeyOne(
            uploadId,
            true
          );
        }
      } catch {
        throw new Error(
          "SECURE_CASE_REKEY_ROLLBACK_FAILED"
        );
      }
      throw error;
    }
  }
}
