import {
  access,
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

export type StoredCaseArtifact = {
  schemaVersion: 1;
  caseId: string;
  artifactId: string;
  filename: string;
  mediaType: string;
  sha256: string;
  bytes: number;
  createdAt: string;
  createdByUserId?: string;
  sensitivity:
    | "PROTECTED"
    | "CLEAR_PII";
  storage:
    "ENCRYPTED_LME1";
};

export type SecureCaseArtifactStoreOptions = {
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

function validArtifactId(
  value: string
): boolean {
  return /^artifact_[a-f0-9]{32}$/
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
    "artifact.bin";
  if (
    candidate === "." ||
    candidate === ".." ||
    candidate.length > 180
  ) {
    return "artifact.bin";
  }
  return candidate;
}

function manifestIdentity(
  caseId: string,
  artifactId: string,
  keyVersion: number
): CaseBlobIdentity {
  return {
    caseId,
    objectId:
      artifactId,
    purpose:
      "artifact-manifest",
    keyVersion
  };
}

function payloadIdentity(
  caseId: string,
  artifactId: string,
  keyVersion: number
): CaseBlobIdentity {
  return {
    caseId,
    objectId:
      artifactId,
    purpose:
      "artifact-payload",
    keyVersion
  };
}

export class SecureCaseArtifactStore {
  readonly rootDir: string;
  private readonly manifestMaxBytes:
    number;

  constructor(
    options:
      SecureCaseArtifactStoreOptions = {}
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

  private artifactsDir(
    caseId: string
  ): string {
    return path.join(
      this.caseDir(caseId),
      "secure",
      "artifacts"
    );
  }

  private artifactDir(
    caseId: string,
    artifactId: string
  ): string {
    if (
      !validArtifactId(
        artifactId
      )
    ) {
      throw new Error(
        "INVALID_ARTIFACT_ID"
      );
    }
    const base =
      path.resolve(
        this.artifactsDir(
          caseId
        )
      );
    const target =
      path.resolve(
        base,
        artifactId
      );
    if (
      !target.startsWith(
        base + path.sep
      )
    ) {
      throw new Error(
        "ARTIFACT_PATH_ESCAPE"
      );
    }
    return target;
  }

  private async assertCaseKeyVersion(
    caseId: string,
    keyVersion: number
  ): Promise<void> {
    const metadataPath =
      path.join(
        this.caseDir(caseId),
        "case.json"
      );
    await access(
      metadataPath
    );
    const raw =
      JSON.parse(
        await readFile(
          metadataPath,
          "utf8"
        )
      ) as Record<
        string,
        unknown
      >;
    if (
      raw.caseId !==
        caseId ||
      raw.keyVersion !==
        keyVersion ||
      typeof raw
        .createdByUserId !==
        "string"
    ) {
      throw new Error(
        "CASE_KEY_VERSION_MISMATCH"
      );
    }
  }

  async saveArtifact(args: {
    caseId: string;
    filename: string;
    mediaType: string;
    data: Uint8Array;
    caseDataKey: Buffer;
    keyVersion: number;
    sensitivity:
      | "PROTECTED"
      | "CLEAR_PII";
    createdByUserId?: string;
  }): Promise<
    StoredCaseArtifact
  > {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );

    const artifactId =
      "artifact_" +
      randomBytes(16)
        .toString("hex");
    const dir =
      this.artifactDir(
        args.caseId,
        artifactId
      );
    const digest =
      createHash("sha256")
        .update(args.data)
        .digest("hex");
    const manifest:
      StoredCaseArtifact = {
        schemaVersion: 1,
        caseId:
          args.caseId,
        artifactId,
        filename:
          safeFilename(
            args.filename
          ),
        mediaType:
          args.mediaType,
        sha256:
          digest,
        bytes:
          args.data.byteLength,
        createdAt:
          new Date()
            .toISOString(),
        ...(args.createdByUserId
          ? {
              createdByUserId:
                args.createdByUserId
            }
          : {}),
        sensitivity:
          args.sensitivity,
        storage:
          "ENCRYPTED_LME1"
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
            artifactId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        data:
          args.data,
        expectedSha256:
          digest
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
              artifactId,
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

  async listArtifacts(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<
    StoredCaseArtifact[]
  > {
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
          this.artifactsDir(
            args.caseId
          ),
          {
            withFileTypes:
              true
          }
        );
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code ===
          "ENOENT"
      ) {
        return [];
      }
      throw error;
    }

    const result:
      StoredCaseArtifact[] = [];
    for (
      const entry
      of entries
    ) {
      if (
        !entry.isDirectory() ||
        !validArtifactId(
          entry.name
        )
      ) {
        continue;
      }
      try {
        const bytes =
          await readCaseBlob({
            targetFile:
              path.join(
                this.artifactDir(
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
              this.manifestMaxBytes
          });
        try {
          const parsed =
            JSON.parse(
              bytes.toString(
                "utf8"
              )
            ) as
              StoredCaseArtifact;
          if (
            parsed.schemaVersion !==
              1 ||
            parsed.caseId !==
              args.caseId ||
            parsed.artifactId !==
              entry.name ||
            !/^[a-f0-9]{64}$/
              .test(
                parsed.sha256
              ) ||
            parsed.storage !==
              "ENCRYPTED_LME1" ||
            ![
              "PROTECTED",
              "CLEAR_PII"
            ].includes(
              parsed.sensitivity
            )
          ) {
            throw new Error(
              "SECURE_ARTIFACT_MANIFEST_INVALID"
            );
          }
          result.push(
            parsed
          );
        } finally {
          bytes.fill(0);
        }
      } catch {
        // Invalid artifacts are omitted rather than exposing corrupt metadata.
      }
    }

    return result.sort(
      (a, b) =>
        b.createdAt
          .localeCompare(
            a.createdAt
          )
    );
  }

  async readArtifact(args: {
    caseId: string;
    artifactId: string;
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
          this.artifactDir(
            args.caseId,
            args.artifactId
          ),
          "payload.lme"
        ),
      identity:
        payloadIdentity(
          args.caseId,
          args.artifactId,
          args.keyVersion
        ),
      caseDataKey:
        args.caseDataKey,
      maxBytes:
        args.maxBytes
    });
  }

  async deleteArtifact(args: {
    caseId: string;
    artifactId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<void> {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );

    const dir =
      this.artifactDir(
        args.caseId,
        args.artifactId
      );

    // Resolve/validate the artifact path before removal. The case data key
    // requirement keeps deletion behind the same case-access boundary as
    // reads/writes, even though recursive removal itself does not decrypt.
    if (
      !Buffer.isBuffer(
        args.caseDataKey
      ) ||
      args.caseDataKey.length < 16
    ) {
      throw new Error(
        "CASE_DATA_KEY_INVALID"
      );
    }

    await rm(
      dir,
      {
        recursive: true,
        force: true
      }
    );
  }

  async rekeyCaseArtifacts(args: {
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
          this.artifactsDir(
            args.caseId
          ),
          {
            withFileTypes:
              true
          }
        );
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code ===
          "ENOENT"
      ) {
        return false;
      }
      throw error;
    }

    const descriptors:
      Array<{
        targetFile: string;
        oldIdentity:
          CaseBlobIdentity;
        newIdentity:
          CaseBlobIdentity;
      }> = [];

    for (
      const entry
      of entries
    ) {
      if (
        !entry.isDirectory() ||
        !validArtifactId(
          entry.name
        )
      ) {
        continue;
      }
      const dir =
        this.artifactDir(
          args.caseId,
          entry.name
        );
      descriptors.push(
        {
          targetFile:
            path.join(
              dir,
              "payload.lme"
            ),
          oldIdentity:
            payloadIdentity(
              args.caseId,
              entry.name,
              args.oldKeyVersion
            ),
          newIdentity:
            payloadIdentity(
              args.caseId,
              entry.name,
              args.newKeyVersion
            )
        },
        {
          targetFile:
            path.join(
              dir,
              "manifest.lme"
            ),
          oldIdentity:
            manifestIdentity(
              args.caseId,
              entry.name,
              args.oldKeyVersion
            ),
          newIdentity:
            manifestIdentity(
              args.caseId,
              entry.name,
              args.newKeyVersion
            )
        }
      );
    }

    const completed:
      typeof descriptors = [];
    try {
      for (
        const descriptor
        of descriptors
      ) {
        await rekeyCaseBlob({
          targetFile:
            descriptor.targetFile,
          oldIdentity:
            descriptor
              .oldIdentity,
          newIdentity:
            descriptor
              .newIdentity,
          oldCaseDataKey:
            args.oldCaseDataKey,
          newCaseDataKey:
            args.newCaseDataKey
        });
        completed.push(
          descriptor
        );
      }
      return (
        descriptors.length > 0
      );
    } catch (error) {
      try {
        for (
          const descriptor
          of [...completed]
            .reverse()
        ) {
          await rekeyCaseBlob({
            targetFile:
              descriptor.targetFile,
            oldIdentity:
              descriptor
                .newIdentity,
            newIdentity:
              descriptor
                .oldIdentity,
            oldCaseDataKey:
              args.newCaseDataKey,
            newCaseDataKey:
              args.oldCaseDataKey
          });
        }
      } catch {
        throw new Error(
          "SECURE_ARTIFACT_REKEY_ROLLBACK_FAILED"
        );
      }
      throw error;
    }
  }
}
