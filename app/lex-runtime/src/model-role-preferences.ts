import {
  createHash
} from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type {
  ProviderId
} from "./providers/types.js";

export type AuxiliaryFallbackPolicy =
  "PRIMARY_ON_FAILURE";

export type ModelRolePreferences = {
  schemaVersion: 1;
  auxiliary: {
    enabled: boolean;
    provider: ProviderId;
    model: string;
    fallback:
      AuxiliaryFallbackPolicy;
  };
  updatedAt: string;
};

const DEFAULT_AUXILIARY_MODEL =
  "local/bielik-11b-v3-q4km";

function defaultRoot(): string {
  const configured =
    process.env
      .LEX_MODEL_ROLE_PREFERENCES_ROOT
      ?.trim();
  if (configured) {
    return path.resolve(
      configured
    );
  }
  const local =
    process.env
      .LOCALAPPDATA
      ?.trim();
  if (local) {
    return path.join(
      local,
      "LexMachina",
      "preferences",
      "model-roles"
    );
  }
  return path.join(
    os.homedir(),
    ".lex-machina",
    "preferences",
    "model-roles"
  );
}

function providerId(
  value: unknown
): ProviderId | null {
  return value === "openai" ||
    value === "anthropic" ||
    value === "xai"
    ? value
    : null;
}

function modelId(
  value: unknown
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }
  const normalized =
    value.trim();
  if (
    normalized.length < 1 ||
    normalized.length > 256 ||
    /[\x00-\x1f\x7f]/.test(
      normalized
    )
  ) {
    return null;
  }
  return normalized;
}

export class ModelRolePreferencesService {
  constructor(
    private readonly rootDir:
      string = defaultRoot()
  ) {}

  get(
    userId: string
  ): ModelRolePreferences {
    const target =
      this.pathForUser(
        userId
      );
    if (
      !fs.existsSync(target)
    ) {
      return this.defaults();
    }

    let value: unknown;
    try {
      value = JSON.parse(
        fs.readFileSync(
          target,
          "utf8"
        )
      );
    } catch {
      throw new Error(
        "MODEL_ROLE_PREFERENCES_INVALID"
      );
    }

    if (
      !value ||
      typeof value !==
        "object" ||
      Array.isArray(value)
    ) {
      throw new Error(
        "MODEL_ROLE_PREFERENCES_INVALID"
      );
    }
    const record =
      value as Record<
        string,
        unknown
      >;
    const auxiliary =
      record.auxiliary &&
      typeof record.auxiliary ===
        "object" &&
      !Array.isArray(
        record.auxiliary
      )
        ? record.auxiliary as
            Record<
              string,
              unknown
            >
        : null;
    const provider =
      providerId(
        auxiliary?.provider
      );
    const model =
      modelId(
        auxiliary?.model
      );

    if (
      record.schemaVersion !==
        1 ||
      !auxiliary ||
      typeof auxiliary.enabled !==
        "boolean" ||
      !provider ||
      !model ||
      auxiliary.fallback !==
        "PRIMARY_ON_FAILURE" ||
      typeof record.updatedAt !==
        "string" ||
      Number.isNaN(
        Date.parse(
          record.updatedAt
        )
      )
    ) {
      throw new Error(
        "MODEL_ROLE_PREFERENCES_INVALID"
      );
    }

    return {
      schemaVersion: 1,
      auxiliary: {
        enabled:
          auxiliary.enabled,
        provider,
        model,
        fallback:
          "PRIMARY_ON_FAILURE"
      },
      updatedAt:
        record.updatedAt
    };
  }

  update(
    userId: string,
    input: {
      enabled: boolean;
      provider: string;
      model: string;
    }
  ): ModelRolePreferences {
    const provider =
      providerId(
        input.provider
      );
    const model =
      modelId(
        input.model
      );
    if (
      typeof input.enabled !==
        "boolean" ||
      !provider ||
      !model
    ) {
      throw new Error(
        "MODEL_ROLE_PREFERENCES_INVALID"
      );
    }

    const value:
      ModelRolePreferences = {
        schemaVersion: 1,
        auxiliary: {
          enabled:
            input.enabled,
          provider,
          model,
          fallback:
            "PRIMARY_ON_FAILURE"
        },
        updatedAt:
          new Date()
            .toISOString()
      };

    const target =
      this.pathForUser(
        userId
      );
    fs.mkdirSync(
      path.dirname(target),
      { recursive: true }
    );
    const temporary =
      `${target}.tmp`;
    fs.writeFileSync(
      temporary,
      `${JSON.stringify(
        value,
        null,
        2
      )}\n`,
      "utf8"
    );
    fs.renameSync(
      temporary,
      target
    );
    return value;
  }

  private defaults():
    ModelRolePreferences {
    return {
      schemaVersion: 1,
      auxiliary: {
        enabled: false,
        provider: "openai",
        model:
          DEFAULT_AUXILIARY_MODEL,
        fallback:
          "PRIMARY_ON_FAILURE"
      },
      updatedAt:
        new Date(0)
          .toISOString()
    };
  }

  private pathForUser(
    userId: string
  ): string {
    if (
      typeof userId !==
        "string" ||
      userId.length < 1 ||
      userId.length > 256
    ) {
      throw new Error(
        "MODEL_ROLE_USER_ID_INVALID"
      );
    }
    const digest =
      createHash("sha256")
        .update(
          userId,
          "utf8"
        )
        .digest("hex");
    return path.join(
      this.rootDir,
      `${digest}.json`
    );
  }
}
