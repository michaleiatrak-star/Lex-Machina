import {
  mkdir,
  readFile,
  readdir,
  rename,
  writeFile
} from "node:fs/promises";
import type { Dirent } from "node:fs";
import {
  createHash,
  randomBytes
} from "node:crypto";
import os from "node:os";
import path from "node:path";

export const DOCX_MEDIA_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const ODT_MEDIA_TYPE =
  "application/vnd.oasis.opendocument.text";

export type SharedTemplateMediaType =
  | typeof DOCX_MEDIA_TYPE
  | typeof ODT_MEDIA_TYPE;

export type SharedTemplateManifest = {
  templateId: string;
  scope: "FIRM_SHARED";
  filename: string;
  mediaType:
    SharedTemplateMediaType;
  sha256: string;
  bytes: number;
  createdAt: string;
  createdByUserId: string;
  generationReady: false;
};

export type SharedTemplateStoreOptions = {
  rootDir?: string;
  maxBytes?: number;
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

function safeFilename(
  value: string
): string {
  const normalized = value
    .normalize("NFKC")
    .replace(
      /[\x00-\x1f\x7f]/g,
      ""
    )
    .replace(/[\\/]/g, "_")
    .trim();

  const fallback =
    "template.bin";
  const candidate =
    normalized || fallback;
  if (
    candidate === "." ||
    candidate === ".." ||
    candidate.length > 180
  ) {
    return fallback;
  }
  return candidate;
}

function validTemplateId(
  value: string
): boolean {
  return /^template_[a-f0-9]{32}$/
    .test(value);
}

function validateMediaType(
  mediaType: string,
  filename: string
): SharedTemplateMediaType {
  const lower =
    filename.toLowerCase();

  if (
    mediaType === DOCX_MEDIA_TYPE ||
    (
      mediaType ===
        "application/octet-stream" &&
      lower.endsWith(".docx")
    )
  ) {
    return DOCX_MEDIA_TYPE;
  }
  if (
    mediaType === ODT_MEDIA_TYPE ||
    (
      mediaType ===
        "application/octet-stream" &&
      lower.endsWith(".odt")
    )
  ) {
    return ODT_MEDIA_TYPE;
  }
  throw new Error(
    "UNSUPPORTED_TEMPLATE_MEDIA_TYPE"
  );
}

export class LocalSharedTemplateStore {
  readonly rootDir: string;
  readonly templatesDir: string;
  private readonly maxBytes:
    number;

  constructor(
    options:
      SharedTemplateStoreOptions = {}
  ) {
    this.rootDir = path.resolve(
      options.rootDir ??
        defaultRootDir()
    );
    this.templatesDir =
      path.join(
        this.rootDir,
        "shared",
        "templates"
      );
    this.maxBytes =
      options.maxBytes ??
      64 * 1024 * 1024;
  }

  private templateDir(
    templateId: string
  ): string {
    if (
      !validTemplateId(
        templateId
      )
    ) {
      throw new Error(
        "INVALID_TEMPLATE_ID"
      );
    }
    const target = path.resolve(
      this.templatesDir,
      templateId
    );
    const base =
      path.resolve(
        this.templatesDir
      ) + path.sep;
    if (
      !target.startsWith(base)
    ) {
      throw new Error(
        "TEMPLATE_PATH_ESCAPE"
      );
    }
    return target;
  }

  async saveTemplate(args: {
    filename: string;
    mediaType: string;
    data: Uint8Array;
    createdByUserId: string;
  }): Promise<
    SharedTemplateManifest
  > {
    if (
      !/^user_[a-f0-9]{32}$/
        .test(
          args.createdByUserId
        )
    ) {
      throw new Error(
        "INVALID_TEMPLATE_CREATOR"
      );
    }
    if (
      args.data.byteLength < 1 ||
      args.data.byteLength >
        this.maxBytes
    ) {
      throw new Error(
        "TEMPLATE_SIZE_INVALID"
      );
    }

    const filename =
      safeFilename(args.filename);
    const mediaType =
      validateMediaType(
        args.mediaType,
        filename
      );
    const templateId =
      "template_" +
      randomBytes(16)
        .toString("hex");
    const createdAt =
      new Date().toISOString();
    const dir =
      this.templateDir(
        templateId
      );
    const originalDir =
      path.join(
        dir,
        "original"
      );

    await mkdir(
      originalDir,
      {
        recursive: true,
        mode: 0o700
      }
    );

    const finalPath =
      path.join(
        originalDir,
        filename
      );
    const partialPath =
      finalPath + ".partial";
    await writeFile(
      partialPath,
      args.data,
      {
        flag: "wx",
        mode: 0o600
      }
    );
    await rename(
      partialPath,
      finalPath
    );

    const manifest:
      SharedTemplateManifest = {
        templateId,
        scope: "FIRM_SHARED",
        filename,
        mediaType,
        sha256:
          createHash("sha256")
            .update(args.data)
            .digest("hex"),
        bytes:
          args.data.byteLength,
        createdAt,
        createdByUserId:
          args.createdByUserId,
        generationReady: false
      };

    await writeFile(
      path.join(
        dir,
        "manifest.json"
      ),
      JSON.stringify(
        manifest,
        null,
        2
      ),
      {
        encoding: "utf8",
        flag: "wx",
        mode: 0o600
      }
    );
    return manifest;
  }

  async listTemplates():
    Promise<
      SharedTemplateManifest[]
    > {
    let entries: Dirent[];
    try {
      entries = await readdir(
        this.templatesDir,
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
      SharedTemplateManifest[] = [];
    for (
      const entry of entries
    ) {
      if (
        !entry.isDirectory() ||
        !validTemplateId(
          entry.name
        )
      ) {
        continue;
      }
      try {
        const manifest =
          JSON.parse(
            await readFile(
              path.join(
                this.templateDir(
                  entry.name
                ),
                "manifest.json"
              ),
              "utf8"
            )
          ) as
            SharedTemplateManifest;
        if (
          manifest.templateId !==
            entry.name ||
          manifest.scope !==
            "FIRM_SHARED" ||
          typeof manifest.filename !==
            "string" ||
          ![
            DOCX_MEDIA_TYPE,
            ODT_MEDIA_TYPE
          ].includes(
            manifest.mediaType
          ) ||
          typeof manifest.sha256 !==
            "string" ||
          typeof manifest.bytes !==
            "number" ||
          typeof manifest.createdAt !==
            "string" ||
          typeof manifest
            .createdByUserId !==
            "string" ||
          manifest.generationReady !==
            false
        ) {
          continue;
        }
        result.push(
          manifest
        );
      } catch {
        // Ignore incomplete or corrupt template entries.
      }
    }

    return result.sort((a, b) =>
      b.createdAt.localeCompare(
        a.createdAt
      )
    );
  }
}
