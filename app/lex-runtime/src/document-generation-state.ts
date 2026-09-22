import {
  mkdir,
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type {
  DeanonymizationTargetResolver,
  DeanonymizationTargetState
} from "./auth/reauthorization.js";
import {
  readCaseBlob,
  writeCaseBlob
} from "./case-blob.js";
import type {
  GenerationAliasManifest
} from "./generation-aliases.js";
import type {
  DocumentGenerationValidationContext
} from "./document-generation-validation.js";

export type StoredDocumentGenerationState = {
  schemaVersion: 1;
  caseId: string;
  artifactId: string;
  format: "docx" | "odt";
  state:
    | "TOKENIZED_VALIDATED"
    | "FINALIZED";
  tokenizedSha256: string;
  vaultGeneration: number;
  caseKeyVersion: number;
  deanonymizationKeyBinding?: string;
  workflowRequirement?:
    | "PROCESS_PLEADING_FINAL";
  createdAt: string;
  finalizedAt?: string;
  finalArtifactId?: string;
  finalSha256?: string;
};

export type DocumentGenerationStateStoreOptions = {
  rootDir?: string;
};

function defaultRootDir():
  string {
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

function validSha(
  value: string
): boolean {
  return /^[a-f0-9]{64}$/
    .test(value);
}

export class DocumentGenerationStateStore
implements DeanonymizationTargetResolver {
  readonly rootDir:
    string;

  constructor(
    options:
      DocumentGenerationStateStoreOptions = {}
  ) {
    this.rootDir =
      path.resolve(
        options.rootDir ??
          defaultRootDir()
      );
  }

  private generationDir(
    caseId: string,
    artifactId: string
  ): string {
    if (
      !validCaseId(caseId) ||
      !validArtifactId(
        artifactId
      )
    ) {
      throw new Error(
        "GENERATION_STATE_ID_INVALID"
      );
    }
    const base =
      path.resolve(
        this.rootDir,
        "cases",
        caseId,
        "secure",
        "generations"
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
        "GENERATION_STATE_PATH_ESCAPE"
      );
    }
    return target;
  }

  private statePath(
    caseId: string,
    artifactId: string
  ): string {
    return path.join(
      this.generationDir(
        caseId,
        artifactId
      ),
      "state.json"
    );
  }

  private aliasesPath(
    caseId: string,
    artifactId: string
  ): string {
    return path.join(
      this.generationDir(
        caseId,
        artifactId
      ),
      "aliases.lme"
    );
  }

  private validationPath(
    caseId: string,
    artifactId: string
  ): string {
    return path.join(
      this.generationDir(
        caseId,
        artifactId
      ),
      "validation.lme"
    );
  }

  private validateState(
    raw: unknown
  ): StoredDocumentGenerationState {
    if (
      !raw ||
      typeof raw !==
        "object" ||
      Array.isArray(raw)
    ) {
      throw new Error(
        "GENERATION_STATE_INVALID"
      );
    }
    const value =
      raw as
        Record<
          string,
          unknown
        >;
    if (
      value.schemaVersion !== 1 ||
      typeof value.caseId !==
        "string" ||
      !validCaseId(
        value.caseId
      ) ||
      typeof value.artifactId !==
        "string" ||
      !validArtifactId(
        value.artifactId
      ) ||
      (
        value.format !==
          "docx" &&
        value.format !==
          "odt"
      ) ||
      (
        value.state !==
          "TOKENIZED_VALIDATED" &&
        value.state !==
          "FINALIZED"
      ) ||
      typeof value
        .tokenizedSha256 !==
        "string" ||
      !validSha(
        value.tokenizedSha256
      ) ||
      !Number.isInteger(
        value.vaultGeneration
      ) ||
      Number(
        value.vaultGeneration
      ) < 1 ||
      !Number.isInteger(
        value.caseKeyVersion
      ) ||
      Number(
        value.caseKeyVersion
      ) < 1 ||
      (
        value.deanonymizationKeyBinding !==
          undefined &&
        (
          typeof value
            .deanonymizationKeyBinding !==
            "string" ||
          !validSha(
            value
              .deanonymizationKeyBinding
          )
        )
      ) ||
      (
        value.workflowRequirement !==
          undefined &&
        value.workflowRequirement !==
          "PROCESS_PLEADING_FINAL"
      ) ||
      typeof value.createdAt !==
        "string"
    ) {
      throw new Error(
        "GENERATION_STATE_INVALID"
      );
    }
    return value as
      StoredDocumentGenerationState;
  }

  async saveTokenized(args: {
    state:
      StoredDocumentGenerationState;
    aliases:
      GenerationAliasManifest;
    validation:
      DocumentGenerationValidationContext;
    caseDataKey:
      Buffer;
  }): Promise<void> {
    if (
      args.state.state !==
        "TOKENIZED_VALIDATED" ||
      args.aliases.schemaVersion !==
        1 ||
      args.validation.schemaVersion !==
        1
    ) {
      throw new Error(
        "GENERATION_STATE_INVALID"
      );
    }
    this.validateState(
      args.state
    );
    const dir =
      this.generationDir(
        args.state.caseId,
        args.state
          .artifactId
      );
    await mkdir(
      dir,
      {
        recursive: true,
        mode: 0o700
      }
    );

    const aliasBytes =
      Buffer.from(
        JSON.stringify(
          args.aliases
        ),
        "utf8"
      );
    try {
      await writeCaseBlob({
        targetFile:
          this.aliasesPath(
            args.state.caseId,
            args.state
              .artifactId
          ),
        identity: {
          caseId:
            args.state.caseId,
          objectId:
            args.state
              .artifactId,
          purpose:
            "generation-aliases",
          keyVersion:
            args.state
              .caseKeyVersion
        },
        caseDataKey:
          args.caseDataKey,
        data:
          aliasBytes
      });
    } finally {
      aliasBytes.fill(0);
    }

    const validationBytes =
      Buffer.from(
        JSON.stringify(
          args.validation
        ),
        "utf8"
      );
    try {
      await writeCaseBlob({
        targetFile:
          this.validationPath(
            args.state.caseId,
            args.state
              .artifactId
          ),
        identity: {
          caseId:
            args.state.caseId,
          objectId:
            args.state
              .artifactId,
          purpose:
            "generation-validation",
          keyVersion:
            args.state
              .caseKeyVersion
        },
        caseDataKey:
          args.caseDataKey,
        data:
          validationBytes
      });
    } finally {
      validationBytes.fill(0);
    }

    const statePath =
      this.statePath(
        args.state.caseId,
        args.state
          .artifactId
      );
    const partial =
      statePath +
      ".partial";
    await rm(
      partial,
      { force: true }
    );
    await writeFile(
      partial,
      JSON.stringify(
        args.state,
        null,
        2
      ),
      {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx"
      }
    );
    await rename(
      partial,
      statePath
    );
  }

  async readState(
    caseId: string,
    artifactId: string
  ): Promise<
    StoredDocumentGenerationState | null
  > {
    try {
      const raw =
        JSON.parse(
          await readFile(
            this.statePath(
              caseId,
              artifactId
            ),
            "utf8"
          )
        );
      const state =
        this.validateState(
          raw
        );
      if (
        state.caseId !==
          caseId ||
        state.artifactId !==
          artifactId
      ) {
        throw new Error(
          "GENERATION_STATE_BINDING_MISMATCH"
        );
      }
      return state;
    } catch (error) {
      if (
        error instanceof
          Error &&
        "code" in error &&
        error.code ===
          "ENOENT"
      ) {
        return null;
      }
      throw error;
    }
  }

  async resolve(
    caseId: string,
    artifactId: string
  ): Promise<
    DeanonymizationTargetState | null
  > {
    const state =
      await this.readState(
        caseId,
        artifactId
      );
    if (
      !state ||
      state.state !==
        "TOKENIZED_VALIDATED"
    ) {
      return null;
    }
    return {
      caseId,
      artifactId,
      artifactFormat:
        state.format,
      state:
        "TOKENIZED_VALIDATED",
      tokenizedSha256:
        state.tokenizedSha256,
      vaultGeneration:
        state.vaultGeneration,
      caseKeyVersion:
        state.caseKeyVersion,
      ...(state
        .deanonymizationKeyBinding
        ? {
            deanonymizationKeyBinding:
              state
                .deanonymizationKeyBinding
          }
        : {})
    };
  }

  async loadAliases(args: {
    caseId: string;
    artifactId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<
    GenerationAliasManifest
  > {
    const state =
      await this.readState(
        args.caseId,
        args.artifactId
      );
    if (
      !state ||
      state.caseKeyVersion !==
        args.keyVersion
    ) {
      throw new Error(
        "GENERATION_STATE_KEY_VERSION_MISMATCH"
      );
    }
    const bytes =
      await readCaseBlob({
        targetFile:
          this.aliasesPath(
            args.caseId,
            args.artifactId
          ),
        identity: {
          caseId:
            args.caseId,
          objectId:
            args.artifactId,
          purpose:
            "generation-aliases",
          keyVersion:
            args.keyVersion
        },
        caseDataKey:
          args.caseDataKey,
        maxBytes:
          8 * 1024 * 1024
      });
    try {
      const parsed =
        JSON.parse(
          bytes.toString(
            "utf8"
          )
        ) as
          GenerationAliasManifest;
      if (
        parsed.schemaVersion !==
          1 ||
        !Array.isArray(
          parsed.entries
        )
      ) {
        throw new Error(
          "GENERATION_ALIAS_STATE_INVALID"
        );
      }
      return parsed;
    } finally {
      bytes.fill(0);
    }
  }

  async loadValidationContext(args: {
    caseId: string;
    artifactId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<
    DocumentGenerationValidationContext
  > {
    const state =
      await this.readState(
        args.caseId,
        args.artifactId
      );
    if (
      !state ||
      state.caseKeyVersion !==
        args.keyVersion
    ) {
      throw new Error(
        "GENERATION_STATE_KEY_VERSION_MISMATCH"
      );
    }

    const bytes =
      await readCaseBlob({
        targetFile:
          this.validationPath(
            args.caseId,
            args.artifactId
          ),
        identity: {
          caseId:
            args.caseId,
          objectId:
            args.artifactId,
          purpose:
            "generation-validation",
          keyVersion:
            args.keyVersion
        },
        caseDataKey:
          args.caseDataKey,
        maxBytes:
          16 * 1024 * 1024
      });
    try {
      const parsed =
        JSON.parse(
          bytes.toString(
            "utf8"
          )
        ) as
          DocumentGenerationValidationContext;
      if (
        parsed.schemaVersion !==
          1 ||
        typeof parsed
          .sourceSessionId !==
          "string" ||
        typeof parsed
          .primarySkill !==
          "string" ||
        typeof parsed.model !==
          "string" ||
        typeof parsed
          .usedDocumentContext !==
          "boolean" ||
        !Array.isArray(
          parsed.verificationRecords
        ) ||
        !Array.isArray(
          parsed.auditEvents
        )
      ) {
        throw new Error(
          "GENERATION_VALIDATION_STATE_INVALID"
        );
      }
      return parsed;
    } finally {
      bytes.fill(0);
    }
  }

  async markFinalized(args: {
    caseId: string;
    artifactId: string;
    finalArtifactId: string;
    finalSha256: string;
  }): Promise<
    StoredDocumentGenerationState
  > {
    if (
      !validArtifactId(
        args.finalArtifactId
      ) ||
      !validSha(
        args.finalSha256
      )
    ) {
      throw new Error(
        "GENERATION_FINAL_STATE_INVALID"
      );
    }
    const state =
      await this.readState(
        args.caseId,
        args.artifactId
      );
    if (
      !state ||
      state.state !==
        "TOKENIZED_VALIDATED"
    ) {
      throw new Error(
        "GENERATION_NOT_TOKENIZED"
      );
    }
    const next:
      StoredDocumentGenerationState = {
        ...state,
        state: "FINALIZED",
        finalizedAt:
          new Date()
            .toISOString(),
        finalArtifactId:
          args.finalArtifactId,
        finalSha256:
          args.finalSha256
      };
    const statePath =
      this.statePath(
        args.caseId,
        args.artifactId
      );
    const partial =
      statePath +
      ".partial";
    await rm(
      partial,
      { force: true }
    );
    await writeFile(
      partial,
      JSON.stringify(
        next,
        null,
        2
      ),
      {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx"
      }
    );
    await rename(
      partial,
      statePath
    );
    return next;
  }
}
