import {
  access,
  readFile,
  readdir
} from "node:fs/promises";
import type {
  Dirent
} from "node:fs";
import {
  createHash
} from "node:crypto";
import path from "node:path";
import type {
  DocumentIngestionResult
} from "./document-ingestion.js";
import type {
  PublicDocumentIngestion,
  SupportedDocumentMediaType
} from "./document-service.js";
import {
  readCaseBlob,
  rekeyCaseBlob,
  writeCaseBlob,
  type CaseBlobIdentity
} from "./case-blob.js";

type StoredDocumentSourceV1 = {
  schemaVersion: 1;
  caseId: string;
  documentId: string;
  mediaType:
    SupportedDocumentMediaType;
  source:
    DocumentIngestionResult;
};

type StoredProtectedDocumentV1 = {
  schemaVersion: 1;
  caseId: string;
  documentId: string;
  ingestion:
    PublicDocumentIngestion;
};

export type SecureCaseDocumentStoreOptions = {
  rootDir?: string;
  maxSourceBytes?: number;
  maxProtectedBytes?: number;
};

function defaultRootDir(): string {
  return path.resolve(
    process.env.LEX_DATA_DIR ??
      path.join(
        process.env.HOME ??
          process.cwd(),
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

function validDocumentId(
  value: string
): boolean {
  return /^doc_[a-f0-9]{24}$/
    .test(value);
}

function storageObjectId(
  documentId: string
): string {
  if (
    !validDocumentId(
      documentId
    )
  ) {
    throw new Error(
      "INVALID_DOCUMENT_ID"
    );
  }
  return (
    "docblob_" +
    createHash("sha256")
      .update(
        documentId,
        "utf8"
      )
      .digest("hex")
      .slice(0, 32)
  );
}

function sourceIdentity(
  caseId: string,
  documentId: string,
  keyVersion: number
): CaseBlobIdentity {
  return {
    caseId,
    objectId:
      storageObjectId(
        documentId
      ),
    purpose:
      "document-source",
    keyVersion
  };
}

function protectedIdentity(
  caseId: string,
  documentId: string,
  keyVersion: number
): CaseBlobIdentity {
  return {
    caseId,
    objectId:
      storageObjectId(
        documentId
      ),
    purpose:
      "protected-document",
    keyVersion
  };
}

function parseJson<T>(
  value: Buffer,
  errorCode: string
): T {
  try {
    return JSON.parse(
      value.toString("utf8")
    ) as T;
  } catch {
    throw new Error(
      errorCode
    );
  }
}

export class SecureCaseDocumentStore {
  readonly rootDir: string;
  private readonly maxSourceBytes:
    number;
  private readonly maxProtectedBytes:
    number;

  constructor(
    options:
      SecureCaseDocumentStoreOptions = {}
  ) {
    this.rootDir =
      path.resolve(
        options.rootDir ??
          defaultRootDir()
      );
    this.maxSourceBytes =
      options.maxSourceBytes ??
      256 * 1024 * 1024;
    this.maxProtectedBytes =
      options.maxProtectedBytes ??
      256 * 1024 * 1024;
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
      !target.startsWith(base)
    ) {
      throw new Error(
        "CASE_PATH_ESCAPE"
      );
    }
    return target;
  }

  private documentsDir(
    caseId: string
  ): string {
    return path.join(
      this.caseDir(caseId),
      "secure",
      "documents"
    );
  }

  private documentDir(
    caseId: string,
    documentId: string
  ): string {
    if (
      !validDocumentId(
        documentId
      )
    ) {
      throw new Error(
        "INVALID_DOCUMENT_ID"
      );
    }
    const base =
      path.resolve(
        this.documentsDir(
          caseId
        )
      );
    const target =
      path.resolve(
        base,
        documentId
      );
    if (
      !target.startsWith(
        base + path.sep
      )
    ) {
      throw new Error(
        "DOCUMENT_PATH_ESCAPE"
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

  async saveSource(args: {
    caseId: string;
    documentId: string;
    mediaType:
      SupportedDocumentMediaType;
    source:
      DocumentIngestionResult;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<void> {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );
    const payload:
      StoredDocumentSourceV1 = {
        schemaVersion: 1,
        caseId:
          args.caseId,
        documentId:
          args.documentId,
        mediaType:
          args.mediaType,
        source:
          args.source
      };
    const bytes =
      Buffer.from(
        JSON.stringify(
          payload
        ),
        "utf8"
      );
    try {
      if (
        bytes.byteLength >
          this.maxSourceBytes
      ) {
        throw new Error(
          "DOCUMENT_SOURCE_STORE_LIMIT_EXCEEDED"
        );
      }
      await writeCaseBlob({
        targetFile:
          path.join(
            this.documentDir(
              args.caseId,
              args.documentId
            ),
            "source.lme"
          ),
        identity:
          sourceIdentity(
            args.caseId,
            args.documentId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        data: bytes
      });
    } finally {
      bytes.fill(0);
    }
  }

  async saveProtected(args: {
    caseId: string;
    documentId: string;
    ingestion:
      PublicDocumentIngestion;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<void> {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );
    const payload:
      StoredProtectedDocumentV1 = {
        schemaVersion: 1,
        caseId:
          args.caseId,
        documentId:
          args.documentId,
        ingestion:
          args.ingestion
      };
    const bytes =
      Buffer.from(
        JSON.stringify(
          payload
        ),
        "utf8"
      );
    try {
      if (
        bytes.byteLength >
          this.maxProtectedBytes
      ) {
        throw new Error(
          "PROTECTED_DOCUMENT_STORE_LIMIT_EXCEEDED"
        );
      }
      await writeCaseBlob({
        targetFile:
          path.join(
            this.documentDir(
              args.caseId,
              args.documentId
            ),
            "protected.lme"
          ),
        identity:
          protectedIdentity(
            args.caseId,
            args.documentId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        data: bytes
      });
    } finally {
      bytes.fill(0);
    }
  }

  async loadSource(args: {
    caseId: string;
    documentId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<{
    mediaType:
      SupportedDocumentMediaType;
    source:
      DocumentIngestionResult;
  }> {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );
    const bytes =
      await readCaseBlob({
        targetFile:
          path.join(
            this.documentDir(
              args.caseId,
              args.documentId
            ),
            "source.lme"
          ),
        identity:
          sourceIdentity(
            args.caseId,
            args.documentId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        maxBytes:
          this.maxSourceBytes
      });
    try {
      const parsed =
        parseJson<
          StoredDocumentSourceV1
        >(
          bytes,
          "DOCUMENT_SOURCE_STORE_INVALID"
        );
      if (
        parsed.schemaVersion !==
          1 ||
        parsed.caseId !==
          args.caseId ||
        parsed.documentId !==
          args.documentId ||
        !parsed.source ||
        parsed.source.complete !==
          true ||
        !Array.isArray(
          parsed.source.pages
        ) ||
        !Array.isArray(
          parsed.source.chunks
        )
      ) {
        throw new Error(
          "DOCUMENT_SOURCE_STORE_INVALID"
        );
      }
      return {
        mediaType:
          parsed.mediaType,
        source:
          parsed.source
      };
    } finally {
      bytes.fill(0);
    }
  }

  async loadProtected(args: {
    caseId: string;
    documentId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<
    PublicDocumentIngestion
  > {
    await this
      .assertCaseKeyVersion(
        args.caseId,
        args.keyVersion
      );
    const bytes =
      await readCaseBlob({
        targetFile:
          path.join(
            this.documentDir(
              args.caseId,
              args.documentId
            ),
            "protected.lme"
          ),
        identity:
          protectedIdentity(
            args.caseId,
            args.documentId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        maxBytes:
          this.maxProtectedBytes
      });
    try {
      const parsed =
        parseJson<
          StoredProtectedDocumentV1
        >(
          bytes,
          "PROTECTED_DOCUMENT_STORE_INVALID"
        );
      if (
        parsed.schemaVersion !==
          1 ||
        parsed.caseId !==
          args.caseId ||
        parsed.documentId !==
          args.documentId ||
        !parsed.ingestion ||
        parsed.ingestion
          .documentId !==
          args.documentId ||
        !Array.isArray(
          parsed.ingestion.chunks
        )
      ) {
        throw new Error(
          "PROTECTED_DOCUMENT_STORE_INVALID"
        );
      }
      return parsed.ingestion;
    } finally {
      bytes.fill(0);
    }
  }

  async rekeyCaseDocuments(args: {
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
          this.documentsDir(
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
        !validDocumentId(
          entry.name
        )
      ) {
        continue;
      }
      const dir =
        this.documentDir(
          args.caseId,
          entry.name
        );
      for (
        const kind
        of [
          "source",
          "protected"
        ] as const
      ) {
        const targetFile =
          path.join(
            dir,
            kind === "source"
              ? "source.lme"
              : "protected.lme"
          );
        try {
          await access(
            targetFile
          );
        } catch {
          continue;
        }
        descriptors.push({
          targetFile,
          oldIdentity:
            kind === "source"
              ? sourceIdentity(
                  args.caseId,
                  entry.name,
                  args.oldKeyVersion
                )
              : protectedIdentity(
                  args.caseId,
                  entry.name,
                  args.oldKeyVersion
                ),
          newIdentity:
            kind === "source"
              ? sourceIdentity(
                  args.caseId,
                  entry.name,
                  args.newKeyVersion
                )
              : protectedIdentity(
                  args.caseId,
                  entry.name,
                  args.newKeyVersion
                )
        });
      }
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
          "SECURE_DOCUMENT_REKEY_ROLLBACK_FAILED"
        );
      }
      throw error;
    }
  }
}
