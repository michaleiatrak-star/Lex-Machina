import { spawn } from "node:child_process";
import type { Dirent } from "node:fs";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type CaseFileStoreOptions = {
  rootDir?: string;
  python?: string;
  zipWorkerPath?: string;
  zipTimeoutMs?: number;
};

export type StoredArchiveEntry = {
  fileId?: string;
  relativePath: string;
  compressedBytes: number;
  uncompressedBytes: number;
  sha256: string;
  mediaType: string | null;
  processable: boolean;
};

export type StoredCaseMetadata = {
  caseId: string;
  createdAt: string;
  caseKind?: "MATTER" | "FIRM_KNOWLEDGE";
  updatedAt?: string;
  displayName?: string;
  archivedAt?: string;
  createdByUserId?: string;
  keyVersion?: number;
};

export type StoredUpload = {
  caseId: string;
  uploadId: string;
  filename: string;
  mediaType: string;
  sha256: string;
  bytes: number;
  storedAt: string;
  archive: boolean;
  extracted: StoredArchiveEntry[];
  storage?:
    | "LEGACY_PLAINTEXT"
    | "ENCRYPTED_LME1";
  archiveExtractionStatus?:
    | "COMPLETE"
    | "DEFERRED_G34H2";
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

function defaultZipWorkerPath(): string {
  const here = path.dirname(
    fileURLToPath(import.meta.url)
  );
  return path.resolve(
    here,
    "../../storage/zip_extract_worker.py"
  );
}

function validCaseId(value: string): boolean {
  return /^case_[a-f0-9]{32}$/.test(value);
}

function safeFilename(value: string): string {
  const normalized = value
    .normalize("NFKC")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[\\/]/g, "_")
    .trim();

  const fallback = "upload.bin";
  const candidate = normalized || fallback;
  if (
    candidate === "." ||
    candidate === ".." ||
    candidate.length > 180
  ) {
    return fallback;
  }
  return candidate;
}

function sha256(data: Uint8Array): string {
  return createHash("sha256")
    .update(data)
    .digest("hex");
}

export class LocalCaseFileStore {
  readonly rootDir: string;
  private readonly python: string;
  private readonly zipWorkerPath: string;
  private readonly zipTimeoutMs: number;

  constructor(
    options: CaseFileStoreOptions = {}
  ) {
    this.rootDir = path.resolve(
      options.rootDir ?? defaultRootDir()
    );
    this.python =
      options.python ??
      process.env.LEX_STORAGE_PYTHON ??
      "python3";
    this.zipWorkerPath =
      options.zipWorkerPath ??
      process.env.LEX_ZIP_WORKER ??
      defaultZipWorkerPath();
    this.zipTimeoutMs =
      options.zipTimeoutMs ??
      10 * 60 * 1000;
  }

  private caseDir(caseId: string): string {
    if (!validCaseId(caseId)) {
      throw new Error("INVALID_CASE_ID");
    }
    const target = path.resolve(
      this.rootDir,
      "cases",
      caseId
    );
    const base = path.resolve(
      this.rootDir,
      "cases"
    ) + path.sep;
    if (!target.startsWith(base)) {
      throw new Error("CASE_PATH_ESCAPE");
    }
    return target;
  }

  async createCase(
    input?:
      | string
      | {
          caseId?: string;
          displayName?: string;
          createdByUserId?: string;
          keyVersion?: number;
          caseKind?:
            | "MATTER"
            | "FIRM_KNOWLEDGE";
        }
  ): Promise<StoredCaseMetadata> {
    const requestedCaseId =
      typeof input === "object" &&
      input
        ? input.caseId
        : undefined;
    const caseId =
      requestedCaseId ??
      (
        "case_" +
        randomBytes(16)
          .toString("hex")
      );
    if (!validCaseId(caseId)) {
      throw new Error(
        "INVALID_CASE_ID"
      );
    }

    const displayName =
      typeof input === "string"
        ? input
        : input?.displayName;
    const createdByUserId =
      typeof input === "object" &&
      input
        ? input.createdByUserId
        : undefined;
    const keyVersion =
      typeof input === "object" &&
      input
        ? input.keyVersion
        : undefined;
    const caseKind =
      typeof input === "object" &&
      input
        ? input.caseKind ??
          "MATTER"
        : "MATTER";

    if (
      ![
        "MATTER",
        "FIRM_KNOWLEDGE"
      ].includes(caseKind)
    ) {
      throw new Error(
        "INVALID_CASE_KIND"
      );
    }
    if (
      createdByUserId !== undefined &&
      !/^user_[a-f0-9]{32}$/
        .test(createdByUserId)
    ) {
      throw new Error(
        "INVALID_CASE_OWNER_ID"
      );
    }
    if (
      keyVersion !== undefined &&
      (
        !Number.isInteger(
          keyVersion
        ) ||
        keyVersion < 1
      )
    ) {
      throw new Error(
        "INVALID_CASE_KEY_VERSION"
      );
    }

    const createdAt =
      new Date().toISOString();
    const dir = this.caseDir(caseId);

    await mkdir(
      path.join(dir, "incoming"),
      { recursive: true }
    );
    await mkdir(
      path.join(dir, "documents"),
      { recursive: true }
    );
    await mkdir(
      path.join(dir, "artifacts"),
      { recursive: true }
    );
    await mkdir(
      path.join(dir, "audit"),
      { recursive: true }
    );

    const trimmed =
      displayName
        ?.trim()
        .slice(0, 160);
    const metadata:
      StoredCaseMetadata = {
        caseId,
        createdAt,
        updatedAt: createdAt,
        caseKind,
        ...(trimmed
          ? {
              displayName:
                trimmed
            }
          : {}),
        ...(createdByUserId
          ? { createdByUserId }
          : {}),
        ...(keyVersion !== undefined
          ? { keyVersion }
          : {})
      };
    await writeFile(
      path.join(dir, "case.json"),
      JSON.stringify(
        metadata,
        null,
        2
      ),
      {
        encoding: "utf8",
        flag: "wx"
      }
    );
    return metadata;
  }

  async readCaseMetadata(
    caseId: string
  ): Promise<StoredCaseMetadata> {
    const raw = JSON.parse(
      await readFile(
        path.join(
          this.caseDir(caseId),
          "case.json"
        ),
        "utf8"
      )
    ) as Record<string, unknown>;

    if (
      raw.caseId !== caseId ||
      typeof raw.createdAt !==
        "string"
    ) {
      throw new Error(
        "CASE_METADATA_INVALID"
      );
    }
    return {
      caseId,
      createdAt: raw.createdAt,
      caseKind:
        raw.caseKind ===
          "FIRM_KNOWLEDGE"
          ? "FIRM_KNOWLEDGE"
          : "MATTER",
      ...(typeof raw.updatedAt ===
        "string"
        ? {
            updatedAt:
              raw.updatedAt
          }
        : {}),
      ...(typeof raw.displayName ===
        "string"
        ? {
            displayName:
              raw.displayName
          }
        : {}),
      ...(typeof raw.archivedAt ===
        "string"
        ? {
            archivedAt:
              raw.archivedAt
          }
        : {}),
      ...(typeof raw.createdByUserId ===
        "string"
        ? {
            createdByUserId:
              raw.createdByUserId
          }
        : {}),
      ...(typeof raw.keyVersion ===
          "number" &&
        Number.isInteger(
          raw.keyVersion
        )
        ? {
            keyVersion:
              raw.keyVersion
          }
        : {})
    };
  }

  async listLegacyCases():
    Promise<StoredCaseMetadata[]> {
    const base = path.join(
      this.rootDir,
      "cases"
    );
    let entries: Dirent[];
    try {
      entries = await readdir(
        base,
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

    const result:
      StoredCaseMetadata[] = [];
    for (const entry of entries) {
      if (
        !entry.isDirectory() ||
        !validCaseId(entry.name)
      ) {
        continue;
      }
      try {
        const metadata =
          await this
            .readCaseMetadata(
              entry.name
            );
        if (
          !metadata.createdByUserId ||
          !metadata.keyVersion
        ) {
          result.push(metadata);
        }
      } catch {
        // Invalid directories are not import candidates.
      }
    }
    return result.sort((a, b) =>
      a.createdAt.localeCompare(
        b.createdAt
      )
    );
  }

  async updateCaseSecurityMetadata(
    caseId: string,
    args: {
      createdByUserId: string;
      keyVersion: number;
    }
  ): Promise<void> {
    if (
      !/^user_[a-f0-9]{32}$/
        .test(
          args.createdByUserId
        ) ||
      !Number.isInteger(
        args.keyVersion
      ) ||
      args.keyVersion < 1
    ) {
      throw new Error(
        "INVALID_CASE_SECURITY_METADATA"
      );
    }
    const metadata =
      await this.readCaseMetadata(
        caseId
      );
    if (
      metadata.createdByUserId ||
      metadata.keyVersion
    ) {
      throw new Error(
        "CASE_ALREADY_SECURITY_BOUND"
      );
    }

    const target = path.join(
      this.caseDir(caseId),
      "case.json"
    );
    const temp =
      target + ".partial";
    await writeFile(
      temp,
      JSON.stringify(
        {
          ...metadata,
          createdByUserId:
            args.createdByUserId,
          keyVersion:
            args.keyVersion
        },
        null,
        2
      ),
      {
        encoding: "utf8",
        flag: "wx"
      }
    );
    await rename(
      temp,
      target
    );
  }

  async updateCaseKeyVersion(
    caseId: string,
    keyVersion: number
  ): Promise<void> {
    if (
      !Number.isInteger(
        keyVersion
      ) ||
      keyVersion < 1
    ) {
      throw new Error(
        "INVALID_CASE_KEY_VERSION"
      );
    }
    const metadata =
      await this.readCaseMetadata(
        caseId
      );
    if (
      !metadata.createdByUserId
    ) {
      throw new Error(
        "LEGACY_CASE_REQUIRES_IMPORT"
      );
    }
    const target = path.join(
      this.caseDir(caseId),
      "case.json"
    );
    const temp =
      target + ".partial";
    await writeFile(
      temp,
      JSON.stringify(
        {
          ...metadata,
          keyVersion
        },
        null,
        2
      ),
      {
        encoding: "utf8",
        flag: "wx"
      }
    );
    await rename(
      temp,
      target
    );
  }

  async updateCaseLifecycleMetadata(
    caseId: string,
    args: {
      updatedAt: string;
      displayName?:
        string | null;
      archivedAt?:
        string | null;
    }
  ): Promise<StoredCaseMetadata> {
    const metadata =
      await this.readCaseMetadata(
        caseId
      );
    const next:
      StoredCaseMetadata = {
        ...metadata,
        updatedAt:
          args.updatedAt
      };

    if (
      Object.prototype
        .hasOwnProperty.call(
          args,
          "displayName"
        )
    ) {
      const cleaned =
        args.displayName
          ?.normalize("NFKC")
          .trim()
          .slice(0, 160) ??
        "";
      if (cleaned) {
        next.displayName =
          cleaned;
      } else {
        delete next.displayName;
      }
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          args,
          "archivedAt"
        )
    ) {
      if (args.archivedAt) {
        next.archivedAt =
          args.archivedAt;
      } else {
        delete next.archivedAt;
      }
    }

    const target = path.join(
      this.caseDir(caseId),
      "case.json"
    );
    const temp =
      target +
      "." +
      randomBytes(8)
        .toString("hex") +
      ".partial";
    try {
      await writeFile(
        temp,
        JSON.stringify(
          next,
          null,
          2
        ),
        {
          encoding: "utf8",
          flag: "wx"
        }
      );
      await rename(
        temp,
        target
      );
    } finally {
      await rm(
        temp,
        { force: true }
      );
    }
    return next;
  }

  async removeCase(
    caseId: string
  ): Promise<void> {
    await rm(
      this.caseDir(caseId),
      {
        recursive: true,
        force: true
      }
    );
  }

  async assertCase(
    caseId: string
  ): Promise<void> {
    await access(
      path.join(
        this.caseDir(caseId),
        "case.json"
      )
    );
  }

  async listUploads(
    caseId: string
  ): Promise<StoredUpload[]> {
    await this.assertCase(caseId);
    const incoming = path.join(
      this.caseDir(caseId),
      "incoming"
    );

    let entries: Dirent[];
    try {
      entries = await readdir(
        incoming,
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

    const uploads:
      StoredUpload[] = [];
    for (const entry of entries) {
      if (
        !entry.isDirectory() ||
        !/^upload_[a-f0-9]{32}$/
          .test(entry.name)
      ) {
        continue;
      }
      try {
        const parsed = JSON.parse(
          await readFile(
            path.join(
              incoming,
              entry.name,
              "manifest.json"
            ),
            "utf8"
          )
        ) as StoredUpload;
        if (
          parsed.caseId !== caseId ||
          parsed.uploadId !==
            entry.name ||
          typeof parsed.filename !==
            "string" ||
          typeof parsed.mediaType !==
            "string" ||
          typeof parsed.sha256 !==
            "string" ||
          typeof parsed.bytes !==
            "number" ||
          typeof parsed.storedAt !==
            "string" ||
          typeof parsed.archive !==
            "boolean" ||
          !Array.isArray(
            parsed.extracted
          )
        ) {
          continue;
        }
        uploads.push(parsed);
      } catch {
        // Ignore incomplete/corrupt entries in the browser inventory.
      }
    }

    return uploads.sort((a, b) =>
      b.storedAt.localeCompare(
        a.storedAt
      )
    );
  }

  async saveUpload(args: {
    caseId: string;
    filename: string;
    mediaType: string;
    data: Uint8Array;
    extractArchive?: boolean;
  }): Promise<StoredUpload> {
    await this.assertCase(args.caseId);

    const uploadId =
      "upload_" +
      randomBytes(16).toString("hex");
    const uploadDir = path.join(
      this.caseDir(args.caseId),
      "incoming",
      uploadId
    );
    const originalDir =
      path.join(uploadDir, "original");
    await mkdir(originalDir, {
      recursive: true
    });

    const filename =
      safeFilename(args.filename);
    const finalPath =
      path.join(originalDir, filename);
    const tempPath =
      finalPath + ".partial";

    await writeFile(
      tempPath,
      args.data,
      { flag: "wx" }
    );
    await rename(tempPath, finalPath);

    const storedAt =
      new Date().toISOString();
    const isZip =
      args.mediaType ===
        "application/zip" ||
      filename.toLowerCase()
        .endsWith(".zip");

    try {
      let extracted:
        StoredArchiveEntry[] = [];

      if (
        isZip &&
        args.extractArchive !== false
      ) {
        extracted =
          await this.extractZip(
            finalPath,
            uploadDir
          );
      }

      const manifest: StoredUpload = {
        caseId: args.caseId,
        uploadId,
        filename,
        mediaType: args.mediaType,
        sha256: sha256(args.data),
        bytes: args.data.byteLength,
        storedAt,
        archive: isZip,
        extracted
      };

      await writeFile(
        path.join(
          uploadDir,
          "manifest.json"
        ),
        JSON.stringify(
          manifest,
          null,
          2
        ),
        {
          encoding: "utf8",
          flag: "wx"
        }
      );

      return manifest;
    } catch (error) {
      await rm(
        uploadDir,
        {
          recursive: true,
          force: true
        }
      );
      throw error;
    }
  }

  private async extractZip(
    inputPath: string,
    uploadDir: string
  ): Promise<StoredArchiveEntry[]> {
    const outputDir =
      path.join(uploadDir, "extracted");
    const workerManifest =
      path.join(
        uploadDir,
        "extracted-manifest.json"
      );

    try {
      await new Promise<void>(
        (resolve, reject) => {
          const child = spawn(
            this.python,
            [
              this.zipWorkerPath,
              "--input",
              inputPath,
              "--output-dir",
              outputDir,
              "--manifest",
              workerManifest
            ],
            {
              stdio: [
                "ignore",
                "ignore",
                "pipe"
              ],
              env: {
                ...process.env,
                PYTHONUNBUFFERED: "1"
              }
            }
          );

          let stderr = "";
          const timer = setTimeout(
            () => {
              child.kill("SIGKILL");
              reject(
                new Error(
                  "ZIP_EXTRACTION_TIMEOUT"
                )
              );
            },
            this.zipTimeoutMs
          );

          child.stderr.on(
            "data",
            (chunk: Buffer) => {
              stderr +=
                chunk.toString("utf8");
              if (
                stderr.length >
                32_000
              ) {
                stderr =
                  stderr.slice(
                    -32_000
                  );
              }
            }
          );
          child.once(
            "error",
            (error) => {
              clearTimeout(timer);
              reject(error);
            }
          );
          child.once(
            "exit",
            (code) => {
              clearTimeout(timer);
              if (code === 0) {
                resolve();
              } else {
                reject(
                  new Error(
                    "ZIP_EXTRACTION_FAILED:" +
                      stderr.trim()
                  )
                );
              }
            }
          );
        }
      );

      const parsed = JSON.parse(
        await readFile(
          workerManifest,
          "utf8"
        )
      ) as {
        entries:
          StoredArchiveEntry[];
      };

      if (
        !Array.isArray(
          parsed.entries
        )
      ) {
        throw new Error(
          "ZIP_MANIFEST_INVALID"
        );
      }
      return parsed.entries;
    } catch (error) {
      await rm(
        outputDir,
        {
          recursive: true,
          force: true
        }
      );
      await rm(
        workerManifest,
        { force: true }
      );
      throw error;
    }
  }
}

export function decodeUploadFilename(
  value: string | undefined
): string {
  if (!value) return "upload.bin";
  try {
    return decodeURIComponent(value);
  } catch {
    return "upload.bin";
  }
}
