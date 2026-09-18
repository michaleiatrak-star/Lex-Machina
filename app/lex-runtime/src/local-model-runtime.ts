import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import type {
  ModelPackEntry
} from "./model-pack-verifier.js";
import {
  compareVersions
} from "./update-discovery.js";

export type LocalModelId = string;

export type LocalBackendId =
  | "CPU_X64_PORTABLE"
  | "VULKAN_X64";

export type LocalBackendPreference =
  | "AUTO"
  | LocalBackendId;

export type LocalModelDescriptor = {
  provider: "local";
  id: LocalModelId;
  displayName: string;
  selectable: true;
  contextWindow: number;
  nativeContextWindow: number;
  minimumContextWindow: number;
  maximumContextWindow: number;
  configuredContextWindow?: number;
  contextMode: "NATIVE_OR_REDUCED" | "YARN_EXTENDED";
  quantization: string;
  license: string;
  source: string;
  localOnly: true;
  installed: boolean;
};

type ReleaseLocalModel = {
  id: string;
  displayName: string;
  sourceModel?: string;
  filename: string;
  sha256: string;
  quantization: string;
  nativeContext: number;
  minimumContext?: number;
  maximumRuntimeContext?: number;
  license?: string;
};

type ReleaseManifest = {
  applicationVersion?: string;
  runtime?: {
    llamaCpp?: {
      version?: string;
      backend?: string;
      backendPolicy?: string;
      backends?: Array<{
        id?: string;
        url?: string;
        sha256?: string;
        bytes?: number;
        gpuOffload?: boolean;
      }>;
    };
  };
  models?: {
    localLlm?: ReleaseLocalModel[];
  };
  localAi?: {
    contextSelection?: {
      minimum?: number;
      maximum?: number;
      step?: number;
      recommendedProfiles?: number[];
      default?: number;
    };
    backendSelection?: {
      allowed?: string[];
      default?: string;
      autoPolicy?: string;
      validation?: string;
    };
  };
};

export type LocalTokenizerCalibration = {
  endpoint: "/tokenize";
  sampleCount: number;
  observedMinCharsPerToken: number;
  conservativeCharsPerToken: number;
  calibratedAt: string;
};

export type LocalContextQualification = {
  schemaVersion: 1;
  result: "PASS";
  modelId: LocalModelId;
  contextTokens: number;
  contextMode:
    | "NATIVE_OR_REDUCED"
    | "YARN_EXTENDED";
  engine: "llama.cpp";
  backend?: LocalBackendId;
  startupMs: number;
  tokenizerCalibration?:
    LocalTokenizerCalibration;
  validatedAt: string;
};

export type LocalProvisioningProgress = {
  phase:
    | "STARTING"
    | "DOWNLOAD"
    | "CACHE_HIT"
    | "VERIFIED"
    | "VALIDATING_RUNTIME"
    | "READY"
    | "FAILED";
  label: string;
  bytesDownloaded: number;
  bytesTotal: number | null;
  percent: number | null;
  updatedAt: string;
};

export type LocalModelPackReceipt = {
  schemaVersion: 1;
  kind: "LEX_MACHINA_MODEL_PACK_INSTALL";
  packVersion: string;
  signerKeyId: string;
  indexSha256: string;
  modelId: string;
  modelSha256: string;
  installedAt: string;
};

type LocalProvisionTransaction = {
  schemaVersion: 1;
  modelFilename: string;
  hadPreviousModel: boolean;
  hadPreviousConfig: boolean;
  hadPreviousQualification: boolean;
  hadPreviousModelPackReceipt: boolean;
  startedAt: string;
};

export type LocalHardwareProfile = {
  platform: NodeJS.Platform;
  arch: string;
  totalMemoryBytes: number;
  logicalCpuCount: number;
  cpuModel: string | null;
  accelerators: Array<{
    name: string;
    driverVersion?: string;
  }>;
  packagedBackend: string;
  configuredBackend:
    LocalBackendId | null;
  backendSelectionMode:
    LocalBackendPreference | null;
  gpuCandidateDetected: boolean;
  gpuOffloadEnabled: boolean;
  detectedAt: string;
};

const PROGRESS_PREFIX =
  "LEX_LOCAL_AI_PROGRESS:";

export function parseLocalAiProgressLine(
  line: string
): LocalProvisioningProgress | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith(PROGRESS_PREFIX)) {
    return null;
  }

  let value: unknown;
  try {
    value = JSON.parse(
      trimmed.slice(
        PROGRESS_PREFIX.length
      )
    );
  } catch {
    return null;
  }
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  const record =
    value as Record<string, unknown>;
  const phase = record.phase;
  const label = record.label;
  const bytesDownloaded =
    record.bytesDownloaded;
  const bytesTotal =
    record.bytesTotal;
  const percent =
    record.percent;

  if (
    ![
      "DOWNLOAD",
      "CACHE_HIT",
      "VERIFIED"
    ].includes(
      String(phase)
    ) ||
    typeof label !== "string" ||
    label.length < 1 ||
    label.length > 200 ||
    typeof bytesDownloaded !==
      "number" ||
    !Number.isSafeInteger(
      bytesDownloaded
    ) ||
    bytesDownloaded < 0 ||
    !(
      bytesTotal === null ||
      (
        typeof bytesTotal ===
          "number" &&
        Number.isSafeInteger(
          bytesTotal
        ) &&
        bytesTotal >= 0
      )
    ) ||
    !(
      percent === null ||
      (
        typeof percent ===
          "number" &&
        Number.isInteger(percent) &&
        percent >= 0 &&
        percent <= 100
      )
    )
  ) {
    return null;
  }

  if (
    bytesTotal !== null &&
    bytesDownloaded >
      bytesTotal
  ) {
    return null;
  }

  return {
    phase: phase as
      LocalProvisioningProgress["phase"],
    label,
    bytesDownloaded,
    bytesTotal,
    percent,
    updatedAt:
      new Date().toISOString()
  };
}

type LocalAiConfig = {
  schemaVersion: number;
  configuredAt: string;
  applicationVersion?: string;
  model: {
    id: string;
    displayName?: string;
    filename: string;
    path: string;
    sha256: string;
    quantization?: string;
    nativeContext: number;
  };
  context: {
    requestedTokens: number;
    mode: "NATIVE_OR_REDUCED" | "YARN_EXTENDED";
    extendedBeyondNative: boolean;
    ropeScale: number;
  };
  engine: {
    type: "llama.cpp";
    version?: string;
    backend?: LocalBackendId;
    selectionMode?:
      LocalBackendPreference;
    gpuOffload?: boolean;
    executable: string;
    fallbackBackend?:
      LocalBackendId | null;
    fallbackExecutable?:
      string | null;
    bind: "127.0.0.1";
  };
  network: {
    requiredForProvisioning: true;
    requiredForInference: false;
  };
};

const LEGACY_MODEL_ALIASES: Readonly<Record<string, string>> = {
  "local/bielik-11b-v3-q4km-64k-yarn": "local/bielik-11b-v3-q4km"
};

const FALLBACK_MODELS: readonly ReleaseLocalModel[] = [
  {
    id: "local/mistral-nemo-12b-q4km",
    displayName: "Mistral NeMo 12B Instruct Q4_K_M",
    sourceModel: "mistralai/Mistral-Nemo-Instruct-2407",
    filename: "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf",
    sha256: "",
    quantization: "Q4_K_M",
    nativeContext: 131_072,
    minimumContext: 64_000,
    maximumRuntimeContext: 200_000,
    license: "Apache-2.0"
  },
  {
    id: "local/bielik-11b-v3-q4km",
    displayName: "Bielik 11B v3 Instruct Q4_K_M",
    sourceModel: "speakleash/Bielik-11B-v3.0-Instruct",
    filename: "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
    sha256: "",
    quantization: "Q4_K_M",
    nativeContext: 32_768,
    minimumContext: 64_000,
    maximumRuntimeContext: 200_000,
    license: "Apache-2.0"
  }
] as const;

function localAppDataRoot(): string {
  const configured = process.env.LEX_LOCAL_LLM_ROOT?.trim();
  if (configured) return path.resolve(configured);
  const local = process.env.LOCALAPPDATA?.trim();
  if (local) return path.resolve(local, "LexMachina", "local-ai");
  return path.resolve(os.homedir(), ".lex-machina", "local-ai");
}

function packagedRuntimeRoot(): string {
  const configured = process.env.LEX_RUNTIME_ROOT?.trim();
  if (configured) return path.resolve(configured);
  return path.resolve(process.cwd(), "..");
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

function finiteInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isBackendId(
  value: unknown
): value is LocalBackendId {
  return (
    value ===
      "CPU_X64_PORTABLE" ||
    value === "VULKAN_X64"
  );
}

function isBackendPreference(
  value: unknown
): value is
  LocalBackendPreference {
  return (
    value === "AUTO" ||
    isBackendId(value)
  );
}

function configBackend(
  config: LocalAiConfig | null
): LocalBackendId | null {
  if (!config) return null;
  return isBackendId(
    config.engine.backend
  )
    ? config.engine.backend
    : "CPU_X64_PORTABLE";
}

function configSelectionMode(
  config: LocalAiConfig | null
): LocalBackendPreference | null {
  if (!config) return null;
  return isBackendPreference(
    config.engine.selectionMode
  )
    ? config.engine.selectionMode
    : configBackend(config);
}

function usableAcceleratorName(
  name: string
): boolean {
  return ![
    "microsoft basic display",
    "remote display",
    "indirect display",
    "virtual display"
  ].some(
    (needle) =>
      name
        .toLocaleLowerCase(
          "en"
        )
        .includes(needle)
  );
}

function normalizeModelId(id: string): string {
  return LEGACY_MODEL_ALIASES[id] ?? id;
}

export class LocalModelRuntime {
  readonly rootDir: string;
  readonly runtimeRoot: string;
  readonly host = "127.0.0.1";
  readonly port: number;

  private child: ChildProcess | null = null;
  private activeModelId: LocalModelId | null = null;
  private startup: Promise<void> | null = null;
  private provisioning: Promise<void> | null = null;
  private provisioningProgress:
    LocalProvisioningProgress | null = null;
  private hardwareCache:
    | {
        value:
          LocalHardwareProfile;
        expiresAt: number;
      }
    | null = null;

  constructor(options?: {
    rootDir?: string;
    runtimeRoot?: string;
    port?: number;
  }) {
    this.rootDir = path.resolve(options?.rootDir ?? localAppDataRoot());
    this.runtimeRoot = path.resolve(options?.runtimeRoot ?? packagedRuntimeRoot());
    this.port = options?.port ?? Number(process.env.LEX_LOCAL_LLM_PORT ?? 4318);
    if (!Number.isInteger(this.port) || this.port < 1024 || this.port > 65535) {
      throw new Error("LOCAL_MODEL_PORT_INVALID");
    }
    this.recoverInterruptedProvision();
  }

  listModels(): LocalModelDescriptor[] {
    const configured = this.readConfig();
    return this.models().map((model) => this.publicDescriptor(model, configured));
  }

  configuredModelId(): LocalModelId | null {
    const config = this.readConfig();
    return config
      ? normalizeModelId(
          config.model.id
        )
      : null;
  }

  requiresSignedModelPackRepair(): boolean {
    const config = this.readConfig();
    if (!config) return false;
    const canonical =
      normalizeModelId(
        config.model.id
      );
    const trusted =
      this.modelSpec(canonical);
    if (
      !trusted ||
      !trusted.sha256 ||
      !/^[a-f0-9]{64}$/i.test(
        trusted.sha256
      )
    ) {
      return false;
    }
    return (
      config.model.sha256
        .toLowerCase() !==
      trusted.sha256
        .toLowerCase()
    );
  }

  installedModelUpdateIdentity(): {
    modelId: LocalModelId;
    sha256: string;
    contextTokens: number;
    packVersion?: string;
    signerKeyId?: string;
  } | null {
    const config = this.readConfig();
    if (
      !config ||
      !/^[a-f0-9]{64}$/i.test(
        config.model.sha256
      )
    ) {
      return null;
    }
    const modelId =
      normalizeModelId(
        config.model.id
      );
    const spec =
      this.modelSpec(modelId);
    if (
      !spec ||
      !fs.existsSync(
        config.model.path
      )
    ) {
      return null;
    }
    const receipt =
      this.readModelPackReceipt();
    if (
      receipt &&
      (
        normalizeModelId(
          receipt.modelId
        ) !== modelId ||
        receipt.modelSha256
          .toLowerCase() !==
          config.model.sha256
            .toLowerCase()
      )
    ) {
      throw new Error(
        "MODEL_PACK_RECEIPT_STATE_MISMATCH"
      );
    }

    return {
      modelId,
      sha256:
        config.model.sha256
          .toLowerCase(),
      contextTokens:
        config.context
          .requestedTokens,
      ...(receipt
        ? {
            packVersion:
              receipt.packVersion,
            signerKeyId:
              receipt.signerKeyId
          }
        : {})
    };
  }

  hardwareProfile(): LocalHardwareProfile {
    const now = Date.now();
    if (
      this.hardwareCache &&
      this.hardwareCache.expiresAt >
        now
    ) {
      return {
        ...this.hardwareCache.value,
        accelerators:
          this.hardwareCache.value
            .accelerators.map(
              (item) => ({
                ...item
              })
            )
      };
    }

    const cpus = os.cpus();
    const accelerators: LocalHardwareProfile["accelerators"] =
      [];

    if (
      process.platform ===
        "win32"
    ) {
      const powershell =
        process.env.SystemRoot
          ? path.join(
              process.env.SystemRoot,
              "System32",
              "WindowsPowerShell",
              "v1.0",
              "powershell.exe"
            )
          : "powershell.exe";
      const command = [
        "$ErrorActionPreference='SilentlyContinue'",
        "$items=@(Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion)",
        "$items | ConvertTo-Json -Compress"
      ].join("; ");
      const result =
        spawnSync(
          powershell,
          [
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            command
          ],
          {
            encoding: "utf8",
            windowsHide: true,
            timeout: 5_000
          }
        );
      if (
        result.status === 0 &&
        result.stdout.trim()
      ) {
        try {
          const parsed =
            JSON.parse(
              result.stdout.trim()
            ) as unknown;
          const items =
            Array.isArray(parsed)
              ? parsed
              : [parsed];
          for (
            const value
            of items.slice(0, 8)
          ) {
            if (
              !value ||
              typeof value !==
                "object" ||
              Array.isArray(value)
            ) {
              continue;
            }
            const record =
              value as Record<
                string,
                unknown
              >;
            if (
              typeof record.Name !==
                "string" ||
              !record.Name.trim()
            ) {
              continue;
            }
            accelerators.push({
              name:
                record.Name
                  .trim()
                  .slice(0, 200),
              ...(typeof record.DriverVersion ===
                "string" &&
              record.DriverVersion.trim()
                ? {
                    driverVersion:
                      record.DriverVersion
                        .trim()
                        .slice(
                          0,
                          100
                        )
                  }
                : {})
            });
          }
        } catch {
          // Accelerator discovery is informational only.
        }
      }
    }

    const config =
      this.readConfig();
    const qualification =
      this.readQualification();
    const configuredBackend =
      configBackend(config);
    const selectionMode =
      configSelectionMode(
        config
      );
    const gpuCandidateDetected =
      accelerators.some(
        (item) =>
          usableAcceleratorName(
            item.name
          )
      );
    const gpuOffloadEnabled =
      Boolean(
        config &&
        configuredBackend ===
          "VULKAN_X64" &&
        config.engine.gpuOffload ===
          true &&
        qualification &&
        normalizeModelId(
          qualification.modelId
        ) ===
          normalizeModelId(
            config.model.id
          ) &&
        qualification
          .contextTokens ===
          config.context
            .requestedTokens &&
        (
          qualification.backend ??
          configuredBackend
        ) ===
          configuredBackend
      );

    const value: LocalHardwareProfile = {
      platform:
        process.platform,
      arch:
        process.arch,
      totalMemoryBytes:
        os.totalmem(),
      logicalCpuCount:
        cpus.length,
      cpuModel:
        cpus[0]?.model?.trim() ||
        null,
      accelerators,
      packagedBackend:
        this.manifest()
          .runtime
          ?.llamaCpp
          ?.backend ??
        "UNKNOWN",
      configuredBackend,
      backendSelectionMode:
        selectionMode,
      gpuCandidateDetected,
      gpuOffloadEnabled,
      detectedAt:
        new Date().toISOString()
    };
    this.hardwareCache = {
      value,
      expiresAt:
        now + 60_000
    };
    return {
      ...value,
      accelerators:
        value.accelerators.map(
          (item) => ({
            ...item
          })
        )
    };
  }

  contextPolicy(): {
    minimum: number;
    maximum: number;
    step: number;
    recommendedProfiles: number[];
    default: number;
  } {
    const policy = this.manifest().localAi?.contextSelection;
    const minimum = finiteInteger(policy?.minimum) ? policy.minimum : 64_000;
    const maximum = finiteInteger(policy?.maximum) ? policy.maximum : 200_000;
    const step = finiteInteger(policy?.step) ? policy.step : 1_000;
    const recommendedProfiles = Array.isArray(policy?.recommendedProfiles)
      ? policy.recommendedProfiles.filter(finiteInteger)
      : [64_000, 96_000, 128_000, 160_000, 200_000];
    const defaultContext = finiteInteger(policy?.default)
      ? policy.default
      : minimum;
    return {
      minimum,
      maximum,
      step,
      recommendedProfiles,
      default: defaultContext
    };
  }

  status(): {
    configured: boolean;
    provisioning: boolean;
    configPath: string;
    enginePresent: boolean;
    modelsPresent: Record<LocalModelId, boolean>;
    selectedModelId: LocalModelId | null;
    configuredContextTokens: number | null;
    activeModelId: LocalModelId | null;
    state: "STOPPED" | "PROVISIONING" | "STARTING" | "READY";
    endpoint: string;
    contextPolicy: ReturnType<LocalModelRuntime["contextPolicy"]>;
    qualification: LocalContextQualification | null;
    progress: LocalProvisioningProgress | null;
    hardware: LocalHardwareProfile;
  } {
    const config = this.readConfig();
    const enginePresent = Boolean(config && fs.existsSync(config.engine.executable));
    const modelsPresent = Object.fromEntries(
      this.models().map((model) => [
        model.id,
        fs.existsSync(path.join(this.rootDir, "models", model.filename))
      ])
    ) as Record<LocalModelId, boolean>;
    const selectedModelId = config ? normalizeModelId(config.model.id) : null;
    const selectedPresent = selectedModelId
      ? Boolean(modelsPresent[selectedModelId])
      : false;
    const configured = Boolean(config && enginePresent && selectedPresent);
    return {
      configured,
      provisioning: Boolean(this.provisioning),
      configPath: this.configPath(),
      enginePresent,
      modelsPresent,
      selectedModelId,
      configuredContextTokens: config?.context.requestedTokens ?? null,
      activeModelId: this.activeModelId,
      state: this.provisioning
        ? "PROVISIONING"
        : this.startup
          ? "STARTING"
          : this.child && this.activeModelId
            ? "READY"
            : "STOPPED",
      endpoint: `http://${this.host}:${this.port}/v1`,
      contextPolicy: this.contextPolicy(),
      qualification: this.readQualification(),
      progress: this.provisioningProgress
        ? { ...this.provisioningProgress }
        : null,
      hardware: this.hardwareProfile()
    };
  }

  async provision(
    modelId: string,
    contextTokens: number,
    sourceOverride?: {
      model: ReleaseLocalModel;
      manifestPath: string;
      beforeCommit?: () =>
        Promise<void> | void;
    }
  ): Promise<{
    model: LocalModelDescriptor;
    contextTokens: number;
    configPath: string;
  }> {
    if (process.platform !== "win32") {
      throw new Error("LOCAL_MODEL_PROVISIONING_PLATFORM_UNSUPPORTED");
    }
    if (this.provisioning) {
      throw new Error("LOCAL_MODEL_PROVISIONING_IN_PROGRESS");
    }
    const canonical = normalizeModelId(modelId);
    const model =
      sourceOverride?.model ??
      this.modelSpec(canonical);
    if (
      !model ||
      normalizeModelId(model.id) !==
        canonical
    ) {
      throw new Error("LOCAL_MODEL_UNKNOWN");
    }
    this.validateContext(model, contextTokens);

    await this.stop();
    this.recoverInterruptedProvision();
    fs.mkdirSync(this.rootDir, { recursive: true });
    const configPath = this.configPath();
    const previousConfigObject =
      this.readConfig();
    const previousConfig = fs.existsSync(configPath)
      ? fs.readFileSync(configPath)
      : null;
    const qualificationPath =
      this.qualificationPath();
    const previousQualification =
      fs.existsSync(
        qualificationPath
      )
        ? fs.readFileSync(
            qualificationPath
          )
        : null;
    const modelPackReceiptPath =
      this.modelPackReceiptPath();
    const previousModelPackReceipt =
      fs.existsSync(
        modelPackReceiptPath
      )
        ? fs.readFileSync(
            modelPackReceiptPath
          )
        : null;
    const targetModelPath =
      path.join(
        this.rootDir,
        "models",
        model.filename
      );
    const rollbackModelPath =
      `${targetModelPath}.lex-rollback`;
    const previousTargetWasActive =
      Boolean(
        previousConfigObject &&
        path.resolve(
          previousConfigObject
            .model.path
        ) ===
          path.resolve(
            targetModelPath
          ) &&
        fs.existsSync(
          targetModelPath
        )
      );

    this.writeProvisionTransaction(
      {
        schemaVersion: 1,
        modelFilename:
          model.filename,
        hadPreviousModel:
          previousTargetWasActive,
        hadPreviousConfig:
          previousConfig !== null,
        hadPreviousQualification:
          previousQualification !==
            null,
        hadPreviousModelPackReceipt:
          previousModelPackReceipt !==
            null,
        startedAt:
          new Date().toISOString()
      },
      previousConfig,
      previousQualification,
      previousModelPackReceipt
    );

    if (previousTargetWasActive) {
      fs.rmSync(
        rollbackModelPath,
        { force: true }
      );
      fs.renameSync(
        targetModelPath,
        rollbackModelPath
      );
    }

    const restoreModelFile = () => {
      if (
        previousTargetWasActive &&
        fs.existsSync(
          rollbackModelPath
        )
      ) {
        fs.rmSync(
          targetModelPath,
          { force: true }
        );
        fs.renameSync(
          rollbackModelPath,
          targetModelPath
        );
      }
    };
    const commitModelFile = () => {
      fs.rmSync(
        rollbackModelPath,
        { force: true }
      );
    };

    const restorePreviousConfig = () => {
      if (previousConfig) {
        fs.writeFileSync(configPath, previousConfig);
      } else {
        fs.rmSync(configPath, { force: true });
      }
    };

    this.provisioningProgress = {
      phase: "STARTING",
      label: canonical,
      bytesDownloaded: 0,
      bytesTotal: null,
      percent: null,
      updatedAt:
        new Date().toISOString()
    };
    const task = this.runProvisioner(
      canonical,
      contextTokens,
      sourceOverride?.manifestPath
    );
    this.provisioning = task;
    try {
      await task;

      const config = this.readConfig();
      if (!config || normalizeModelId(config.model.id) !== canonical) {
        throw new Error("LOCAL_MODEL_PROVISIONING_CONFIG_MISSING");
      }
      this.assertConfiguredComponents(config);
      this.provisioningProgress = {
        phase:
          "VALIDATING_RUNTIME",
        label: canonical,
        bytesDownloaded:
          this.provisioningProgress
            ?.bytesDownloaded ?? 0,
        bytesTotal:
          this.provisioningProgress
            ?.bytesTotal ?? null,
        percent: 100,
        updatedAt:
          new Date().toISOString()
      };

      try {
        const startupStartedAt = Date.now();
        await this.ensureRunning(canonical);
        const tokenizerCalibration =
          await this
            .calibrateTokenizer();
        this.writeQualification({
          schemaVersion: 1,
          result: "PASS",
          modelId: canonical,
          contextTokens:
            config.context.requestedTokens,
          contextMode:
            config.context.mode,
          engine: "llama.cpp",
          startupMs:
            Math.max(
              0,
              Date.now() -
                startupStartedAt
            ),
          tokenizerCalibration,
          validatedAt:
            new Date().toISOString()
        });
        this.provisioningProgress = {
          phase: "READY",
          label: canonical,
          bytesDownloaded:
            this.provisioningProgress
              ?.bytesDownloaded ?? 0,
          bytesTotal:
            this.provisioningProgress
              ?.bytesTotal ?? null,
          percent: 100,
          updatedAt:
            new Date().toISOString()
        };
      } catch (error) {
        restorePreviousConfig();
        const detail =
          error instanceof Error
            ? error.message
            : String(error);
        throw new Error(
          `LOCAL_MODEL_RESOURCE_VALIDATION_FAILED:${detail}`
        );
      } finally {
        await this.stop();
      }

      if (
        sourceOverride?.beforeCommit
      ) {
        await sourceOverride
          .beforeCommit();
      }

      commitModelFile();
      this.clearProvisionTransaction();
      return {
        model: this.publicDescriptor(model, config),
        contextTokens: config.context.requestedTokens,
        configPath
      };
    } catch (error) {
      restoreModelFile();
      restorePreviousConfig();
      if (previousQualification) {
        fs.writeFileSync(
          qualificationPath,
          previousQualification
        );
      } else {
        fs.rmSync(
          qualificationPath,
          { force: true }
        );
      }
      if (previousModelPackReceipt) {
        fs.writeFileSync(
          modelPackReceiptPath,
          previousModelPackReceipt
        );
      } else {
        fs.rmSync(
          modelPackReceiptPath,
          { force: true }
        );
      }
      this.clearProvisionTransaction();
      this.provisioningProgress = {
        phase: "FAILED",
        label: canonical,
        bytesDownloaded:
          this.provisioningProgress
            ?.bytesDownloaded ?? 0,
        bytesTotal:
          this.provisioningProgress
            ?.bytesTotal ?? null,
        percent:
          this.provisioningProgress
            ?.percent ?? null,
        updatedAt:
          new Date().toISOString()
      };
      throw error;
    } finally {
      this.provisioning = null;
    }
  }

  async reconfigureContext(
    modelId: string,
    contextTokens: number
  ): Promise<{
    model: LocalModelDescriptor;
    contextTokens: number;
    configPath: string;
  }> {
    if (this.provisioning) {
      throw new Error(
        "LOCAL_MODEL_PROVISIONING_IN_PROGRESS"
      );
    }
    const config =
      this.readConfig();
    if (!config) {
      throw new Error(
        "LOCAL_MODEL_NOT_CONFIGURED"
      );
    }
    const canonical =
      normalizeModelId(
        modelId
      );
    if (
      normalizeModelId(
        config.model.id
      ) !== canonical
    ) {
      throw new Error(
        "LOCAL_MODEL_RECONFIGURE_MODEL_MISMATCH"
      );
    }
    const model =
      this.modelSpec(canonical);
    if (!model) {
      throw new Error(
        "LOCAL_MODEL_UNKNOWN"
      );
    }
    this.validateContext(
      model,
      contextTokens
    );
    this.assertConfiguredComponents(
      config
    );

    await this.stop();
    const configPath =
      this.configPath();
    const previousConfig =
      fs.readFileSync(
        configPath
      );
    const updated:
      LocalAiConfig = {
        ...config,
        configuredAt:
          new Date()
            .toISOString(),
        context: {
          requestedTokens:
            contextTokens,
          mode:
            contextTokens >
              config.model
                .nativeContext
              ? "YARN_EXTENDED"
              : "NATIVE_OR_REDUCED",
          extendedBeyondNative:
            contextTokens >
              config.model
                .nativeContext,
          ropeScale:
            Math.max(
              1,
              contextTokens /
                config.model
                  .nativeContext
            )
        }
      };

    const temporary =
      `${configPath}.tmp`;
    fs.writeFileSync(
      temporary,
      `${JSON.stringify(
        updated,
        null,
        2
      )}\n`,
      "utf8"
    );
    fs.renameSync(
      temporary,
      configPath
    );

    this.provisioningProgress = {
      phase:
        "VALIDATING_RUNTIME",
      label: canonical,
      bytesDownloaded: 0,
      bytesTotal: 0,
      percent: 100,
      updatedAt:
        new Date().toISOString()
    };

    try {
      const startedAt =
        Date.now();
      await this.ensureRunning(
        canonical
      );
      const tokenizerCalibration =
        await this
          .calibrateTokenizer();
      this.writeQualification({
        schemaVersion: 1,
        result: "PASS",
        modelId: canonical,
        contextTokens,
        contextMode:
          updated.context.mode,
        engine: "llama.cpp",
        startupMs:
          Math.max(
            0,
            Date.now() -
              startedAt
          ),
        tokenizerCalibration,
        validatedAt:
          new Date()
            .toISOString()
      });
      this.provisioningProgress = {
        phase: "READY",
        label: canonical,
        bytesDownloaded: 0,
        bytesTotal: 0,
        percent: 100,
        updatedAt:
          new Date().toISOString()
      };
      return {
        model:
          this.publicDescriptor(
            model,
            updated
          ),
        contextTokens,
        configPath
      };
    } catch (error) {
      fs.writeFileSync(
        configPath,
        previousConfig
      );
      this.provisioningProgress = {
        phase: "FAILED",
        label: canonical,
        bytesDownloaded: 0,
        bytesTotal: 0,
        percent: null,
        updatedAt:
          new Date().toISOString()
      };
      const detail =
        error instanceof Error
          ? error.message
          : String(error);
      throw new Error(
        `LOCAL_MODEL_CONTEXT_RECONFIGURATION_FAILED:${detail}`
      );
    } finally {
      await this.stop();
    }
  }

  async applyVerifiedModelPack(args: {
    target: {
      packVersion: string;
      signerKeyId: string;
      indexSha256: string;
      model: ModelPackEntry;
    };
    contextTokens: number;
    force?: boolean;
  }): Promise<{
    model: LocalModelDescriptor;
    contextTokens: number;
    configPath: string;
    receipt: LocalModelPackReceipt;
  }> {
    const entry =
      args.target.model;
    const canonical =
      normalizeModelId(
        entry.id
      );
    const installed =
      this.installedModelUpdateIdentity();
    if (
      !installed ||
      installed.modelId !==
        canonical
    ) {
      throw new Error(
        "MODEL_PACK_UPDATE_MODEL_NOT_INSTALLED"
      );
    }
    if (
      installed.packVersion
    ) {
      const versionComparison =
        compareVersions(
          args.target.packVersion,
          installed.packVersion
        );
      if (
        versionComparison < 0
      ) {
        throw new Error(
          "MODEL_PACK_UPDATE_ROLLBACK_BLOCKED"
        );
      }
      if (
        versionComparison === 0 &&
        installed.sha256 !==
          entry.sha256
            .toLowerCase()
      ) {
        throw new Error(
          "MODEL_PACK_UPDATE_VERSION_HASH_CONFLICT"
        );
      }
    }

    if (
      !args.force &&
      installed.sha256 ===
        entry.sha256
          .toLowerCase()
    ) {
      throw new Error(
        "MODEL_PACK_UPDATE_NOT_AVAILABLE"
      );
    }

    const trustedModel =
      this.modelSpec(canonical);
    if (!trustedModel) {
      throw new Error(
        "MODEL_PACK_UPDATE_MODEL_UNKNOWN"
      );
    }

    if (
      trustedModel.filename !==
        entry.filename ||
      trustedModel.quantization !==
        entry.quantization ||
      trustedModel.nativeContext !==
        entry.nativeContext ||
      (
        trustedModel.minimumContext ??
          this.contextPolicy()
            .minimum
      ) !==
        entry.minimumContext ||
      (
        trustedModel
          .maximumRuntimeContext ??
          trustedModel
            .nativeContext
      ) !==
        entry.maximumRuntimeContext ||
      (
        trustedModel.license ??
          ""
      ) !== entry.license
    ) {
      throw new Error(
        "MODEL_PACK_UPDATE_METADATA_CHANGE_REQUIRES_APP_UPDATE"
      );
    }

    this.validateContext(
      trustedModel,
      args.contextTokens
    );

    const rawManifest =
      JSON.parse(
        fs.readFileSync(
          this.manifestPath(),
          "utf8"
        )
      ) as Record<
        string,
        unknown
      >;
    const rawModels =
      (
        rawManifest.models &&
        typeof rawManifest.models ===
          "object" &&
        !Array.isArray(
          rawManifest.models
        )
      )
        ? rawManifest.models as
            Record<string, unknown>
        : null;
    const localLlm =
      Array.isArray(
        rawModels?.localLlm
      )
        ? rawModels!.localLlm as
            Array<
              Record<
                string,
                unknown
              >
            >
        : [];
    const trustedRaw =
      localLlm.find(
        (value) =>
          value.id === canonical
      );
    if (!trustedRaw) {
      throw new Error(
        "MODEL_PACK_UPDATE_TRUSTED_MODEL_MISSING"
      );
    }

    const stagingRoot =
      path.join(
        this.rootDir,
        "staging"
      );
    fs.mkdirSync(
      stagingRoot,
      { recursive: true }
    );
    const nonce =
      `${Date.now()}-${process.pid}`;
    const manifestPath =
      path.join(
        stagingRoot,
        `model-pack-${nonce}.json`
      );
    const stagedManifest = {
      ...rawManifest,
      models: {
        ...rawModels,
        localLlm: [
          {
            ...trustedRaw,
            url:
              entry.url,
            sha256:
              entry.sha256
                .toLowerCase()
          }
        ]
      }
    };

    fs.writeFileSync(
      manifestPath,
      `${JSON.stringify(
        stagedManifest,
        null,
        2
      )}\n`,
      {
        encoding: "utf8",
        flag: "wx"
      }
    );

    let committedReceipt:
      LocalModelPackReceipt | null =
        null;
    try {
      const result =
        await this.provision(
          canonical,
          args.contextTokens,
          {
            model:
              trustedModel,
            manifestPath,
            beforeCommit: () => {
              const config =
                this.readConfig();
              if (
                !config ||
                config.model.sha256
                  .toLowerCase() !==
                  entry.sha256
                    .toLowerCase()
              ) {
                throw new Error(
                  "MODEL_PACK_UPDATE_CONFIG_HASH_MISMATCH"
                );
              }

              const receipt:
                LocalModelPackReceipt = {
                  schemaVersion: 1,
                  kind:
                    "LEX_MACHINA_MODEL_PACK_INSTALL",
                  packVersion:
                    args.target
                      .packVersion,
                  signerKeyId:
                    args.target
                      .signerKeyId,
                  indexSha256:
                    args.target
                      .indexSha256,
                  modelId:
                    canonical,
                  modelSha256:
                    entry.sha256
                      .toLowerCase(),
                  installedAt:
                    new Date()
                      .toISOString()
                };
              this.writeModelPackReceipt(
                receipt
              );
              committedReceipt =
                receipt;
            }
          }
        );

      if (!committedReceipt) {
        throw new Error(
          "MODEL_PACK_UPDATE_RECEIPT_MISSING"
        );
      }

      return {
        ...result,
        receipt:
          committedReceipt
      };
    } finally {
      fs.rmSync(
        manifestPath,
        { force: true }
      );
    }
  }

  async repair(): Promise<{
    model: LocalModelDescriptor;
    contextTokens: number;
    configPath: string;
  }> {
    const config = this.readConfig();
    if (!config) {
      throw new Error("LOCAL_MODEL_NOT_CONFIGURED");
    }
    return await this.provision(
      normalizeModelId(config.model.id),
      config.context.requestedTokens
    );
  }

  async remove(modelId: string): Promise<{
    removedModelId: LocalModelId;
    configRemoved: boolean;
  }> {
    if (this.provisioning) {
      throw new Error("LOCAL_MODEL_PROVISIONING_IN_PROGRESS");
    }
    const canonical = normalizeModelId(modelId);
    const model = this.modelSpec(canonical);
    if (!model) {
      throw new Error("LOCAL_MODEL_UNKNOWN");
    }
    if (
      path.basename(model.filename) !== model.filename ||
      model.filename.includes("..")
    ) {
      throw new Error("LOCAL_MODEL_FILENAME_INVALID");
    }

    await this.stop();
    const target = path.join(
      this.rootDir,
      "models",
      model.filename
    );
    fs.rmSync(target, { force: true });

    const config = this.readConfig();
    const configRemoved = Boolean(
      config &&
      normalizeModelId(config.model.id) === canonical
    );
    if (configRemoved) {
      fs.rmSync(this.configPath(), { force: true });
      fs.rmSync(
        this.modelPackReceiptPath(),
        { force: true }
      );
    }
    const qualification =
      this.readQualification();
    if (
      qualification?.modelId ===
        canonical
    ) {
      fs.rmSync(
        this.qualificationPath(),
        { force: true }
      );
    }

    return {
      removedModelId: canonical,
      configRemoved
    };
  }

  async ensureRunning(id: string): Promise<LocalModelDescriptor> {
    const canonical = normalizeModelId(id);
    const spec = this.modelSpec(canonical);
    if (!spec) throw new Error("LOCAL_MODEL_UNKNOWN");
    const config = this.readConfig();
    if (!config || normalizeModelId(config.model.id) !== canonical) {
      throw new Error(`LOCAL_MODEL_NOT_CONFIGURED:${canonical}`);
    }

    if (
      this.child &&
      this.activeModelId === canonical &&
      !this.startup &&
      await this.isHealthy()
    ) {
      return this.publicDescriptor(spec, config);
    }

    if (this.startup && this.activeModelId === canonical) {
      await this.startup;
      return this.publicDescriptor(spec, config);
    }

    await this.stop();
    this.assertConfiguredComponents(config);
    this.activeModelId = canonical;
    this.startup = this.launch(config);
    try {
      await this.startup;
      return this.publicDescriptor(spec, config);
    } catch (error) {
      await this.stop();
      throw error;
    } finally {
      this.startup = null;
    }
  }

  async stop(): Promise<void> {
    const child = this.child;
    this.child = null;
    this.startup = null;
    this.activeModelId = null;
    if (!child || child.killed) return;
    child.kill();
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(resolve, 2_000);
      child.once("exit", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  private manifestPath(): string {
    return path.join(this.runtimeRoot, "release-source.json");
  }

  private provisionerPath(): string {
    return path.join(this.runtimeRoot, "bootstrap", "install-local-llm.ps1");
  }

  private configPath(): string {
    return path.join(this.rootDir, "config.json");
  }

  private provisionTransactionPath(): string {
    return path.join(
      this.rootDir,
      "provision-transaction.json"
    );
  }

  private configRollbackPath(): string {
    return `${this.configPath()}.lex-rollback`;
  }

  private qualificationRollbackPath(): string {
    return `${this.qualificationPath()}.lex-rollback`;
  }

  private modelPackReceiptRollbackPath(): string {
    return `${this.modelPackReceiptPath()}.lex-rollback`;
  }

  private writeProvisionTransaction(
    transaction: LocalProvisionTransaction,
    previousConfig: Buffer | null,
    previousQualification: Buffer | null,
    previousModelPackReceipt: Buffer | null
  ): void {
    fs.mkdirSync(
      this.rootDir,
      { recursive: true }
    );
    const configBackup =
      this.configRollbackPath();
    const qualificationBackup =
      this.qualificationRollbackPath();
    const modelPackReceiptBackup =
      this.modelPackReceiptRollbackPath();
    const marker =
      this.provisionTransactionPath();

    fs.rmSync(
      configBackup,
      { force: true }
    );
    fs.rmSync(
      qualificationBackup,
      { force: true }
    );
    fs.rmSync(
      modelPackReceiptBackup,
      { force: true }
    );
    fs.rmSync(
      marker,
      { force: true }
    );

    if (previousConfig) {
      fs.writeFileSync(
        configBackup,
        previousConfig,
        { flag: "wx" }
      );
    }
    if (previousQualification) {
      fs.writeFileSync(
        qualificationBackup,
        previousQualification,
        { flag: "wx" }
      );
    }
    if (previousModelPackReceipt) {
      fs.writeFileSync(
        modelPackReceiptBackup,
        previousModelPackReceipt,
        { flag: "wx" }
      );
    }

    const temporary =
      `${marker}.tmp`;
    fs.writeFileSync(
      temporary,
      `${JSON.stringify(
        transaction,
        null,
        2
      )}\n`,
      {
        encoding: "utf8",
        flag: "wx"
      }
    );
    fs.renameSync(
      temporary,
      marker
    );
  }

  private clearProvisionTransaction(): void {
    fs.rmSync(
      this.configRollbackPath(),
      { force: true }
    );
    fs.rmSync(
      this.qualificationRollbackPath(),
      { force: true }
    );
    fs.rmSync(
      this.modelPackReceiptRollbackPath(),
      { force: true }
    );
    fs.rmSync(
      this.provisionTransactionPath(),
      { force: true }
    );
  }

  private recoverInterruptedProvision(): void {
    const marker =
      this.provisionTransactionPath();
    if (
      !fs.existsSync(
        marker
      )
    ) {
      return;
    }

    let transaction:
      LocalProvisionTransaction;
    try {
      transaction =
        JSON.parse(
          fs.readFileSync(
            marker,
            "utf8"
          )
        ) as LocalProvisionTransaction;
    } catch {
      throw new Error(
        "LOCAL_MODEL_RECOVERY_MARKER_INVALID"
      );
    }

    if (
      transaction.schemaVersion !== 1 ||
      typeof transaction.modelFilename !==
        "string" ||
      transaction.modelFilename !==
        path.basename(
          transaction.modelFilename
        ) ||
      !/^[A-Za-z0-9._-]+\.gguf$/i.test(
        transaction.modelFilename
      ) ||
      typeof transaction.hadPreviousModel !==
        "boolean" ||
      typeof transaction.hadPreviousConfig !==
        "boolean" ||
      typeof transaction.hadPreviousQualification !==
        "boolean" ||
      typeof transaction.hadPreviousModelPackReceipt !==
        "boolean"
    ) {
      throw new Error(
        "LOCAL_MODEL_RECOVERY_MARKER_INVALID"
      );
    }

    const target =
      path.join(
        this.rootDir,
        "models",
        transaction.modelFilename
      );
    const rollback =
      `${target}.lex-rollback`;
    const configBackup =
      this.configRollbackPath();
    const qualificationBackup =
      this.qualificationRollbackPath();
    const modelPackReceiptBackup =
      this.modelPackReceiptRollbackPath();

    try {
      if (
        transaction.hadPreviousModel
      ) {
        if (
          fs.existsSync(
            rollback
          )
        ) {
          fs.rmSync(
            target,
            { force: true }
          );
          fs.renameSync(
            rollback,
            target
          );
        } else if (
          !fs.existsSync(
            target
          )
        ) {
          throw new Error(
            "LOCAL_MODEL_RECOVERY_MODEL_BACKUP_MISSING"
          );
        }
      } else {
        fs.rmSync(
          target,
          { force: true }
        );
        fs.rmSync(
          rollback,
          { force: true }
        );
      }

      if (
        transaction.hadPreviousConfig
      ) {
        if (
          !fs.existsSync(
            configBackup
          )
        ) {
          throw new Error(
            "LOCAL_MODEL_RECOVERY_CONFIG_BACKUP_MISSING"
          );
        }
        fs.copyFileSync(
          configBackup,
          this.configPath()
        );
      } else {
        fs.rmSync(
          this.configPath(),
          { force: true }
        );
      }

      if (
        transaction.hadPreviousQualification
      ) {
        if (
          !fs.existsSync(
            qualificationBackup
          )
        ) {
          throw new Error(
            "LOCAL_MODEL_RECOVERY_QUALIFICATION_BACKUP_MISSING"
          );
        }
        fs.copyFileSync(
          qualificationBackup,
          this.qualificationPath()
        );
      } else {
        fs.rmSync(
          this.qualificationPath(),
          { force: true }
        );
      }

      if (
        transaction.hadPreviousModelPackReceipt
      ) {
        if (
          !fs.existsSync(
            modelPackReceiptBackup
          )
        ) {
          throw new Error(
            "LOCAL_MODEL_RECOVERY_MODEL_PACK_RECEIPT_BACKUP_MISSING"
          );
        }
        fs.copyFileSync(
          modelPackReceiptBackup,
          this.modelPackReceiptPath()
        );
      } else {
        fs.rmSync(
          this.modelPackReceiptPath(),
          { force: true }
        );
      }

      this.clearProvisionTransaction();
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : String(error);
      throw new Error(
        `LOCAL_MODEL_RECOVERY_FAILED:${detail}`
      );
    }
  }

  private modelPackReceiptPath(): string {
    return path.join(
      this.rootDir,
      "model-pack-install.json"
    );
  }

  private readModelPackReceipt():
    LocalModelPackReceipt | null {
    const target =
      this.modelPackReceiptPath();
    if (
      !fs.existsSync(target)
    ) {
      return null;
    }

    const receipt =
      readJson<LocalModelPackReceipt>(
        target
      );
    if (
      !receipt ||
      receipt.schemaVersion !== 1 ||
      receipt.kind !==
        "LEX_MACHINA_MODEL_PACK_INSTALL" ||
      typeof receipt.packVersion !==
        "string" ||
      !/^\d+\.\d+\.\d+$/.test(
        receipt.packVersion
      ) ||
      typeof receipt.signerKeyId !==
        "string" ||
      !/^[A-Za-z0-9._-]{3,96}$/.test(
        receipt.signerKeyId
      ) ||
      typeof receipt.indexSha256 !==
        "string" ||
      !/^[a-f0-9]{64}$/i.test(
        receipt.indexSha256
      ) ||
      typeof receipt.modelId !==
        "string" ||
      receipt.modelId.length < 3 ||
      receipt.modelId.length > 160 ||
      typeof receipt.modelSha256 !==
        "string" ||
      !/^[a-f0-9]{64}$/i.test(
        receipt.modelSha256
      ) ||
      typeof receipt.installedAt !==
        "string" ||
      Number.isNaN(
        Date.parse(
          receipt.installedAt
        )
      )
    ) {
      throw new Error(
        "MODEL_PACK_RECEIPT_INVALID"
      );
    }

    return {
      ...receipt,
      modelId:
        normalizeModelId(
          receipt.modelId
        ),
      indexSha256:
        receipt.indexSha256
          .toLowerCase(),
      modelSha256:
        receipt.modelSha256
          .toLowerCase()
    };
  }

  private writeModelPackReceipt(
    receipt: LocalModelPackReceipt
  ): void {
    const target =
      this.modelPackReceiptPath();
    const temporary =
      `${target}.tmp`;
    fs.writeFileSync(
      temporary,
      `${JSON.stringify(
        receipt,
        null,
        2
      )}\n`,
      {
        encoding: "utf8",
        flag: "w"
      }
    );
    fs.renameSync(
      temporary,
      target
    );
  }

  private qualificationPath(): string {
    return path.join(
      this.rootDir,
      "context-qualification.json"
    );
  }

  private readQualification():
    LocalContextQualification | null {
    const receipt =
      readJson<LocalContextQualification>(
        this.qualificationPath()
      );
    if (
      !receipt ||
      receipt.schemaVersion !== 1 ||
      receipt.result !== "PASS" ||
      typeof receipt.modelId !== "string" ||
      !finiteInteger(
        receipt.contextTokens
      ) ||
      ![
        "NATIVE_OR_REDUCED",
        "YARN_EXTENDED"
      ].includes(
        receipt.contextMode
      ) ||
      receipt.engine !==
        "llama.cpp" ||
      !Number.isFinite(
        receipt.startupMs
      ) ||
      receipt.startupMs < 0 ||
      (
        !receipt.tokenizerCalibration ||
        (
          receipt
            .tokenizerCalibration
            .endpoint !==
              "/tokenize" ||
          !finiteInteger(
            receipt
              .tokenizerCalibration
              .sampleCount
          ) ||
          receipt
            .tokenizerCalibration
            .sampleCount < 1 ||
          !Number.isFinite(
            receipt
              .tokenizerCalibration
              .observedMinCharsPerToken
          ) ||
          receipt
            .tokenizerCalibration
            .observedMinCharsPerToken <= 0 ||
          !Number.isFinite(
            receipt
              .tokenizerCalibration
              .conservativeCharsPerToken
          ) ||
          receipt
            .tokenizerCalibration
            .conservativeCharsPerToken < 1 ||
          receipt
            .tokenizerCalibration
            .conservativeCharsPerToken > 3 ||
          typeof receipt
            .tokenizerCalibration
            .calibratedAt !==
              "string" ||
          Number.isNaN(
            Date.parse(
              receipt
                .tokenizerCalibration
                .calibratedAt
            )
          )
        )
      ) ||
      typeof receipt.validatedAt !==
        "string" ||
      Number.isNaN(
        Date.parse(
          receipt.validatedAt
        )
      )
    ) {
      return null;
    }
    return {
      ...receipt,
      modelId:
        normalizeModelId(
          receipt.modelId
        )
    };
  }

  private writeQualification(
    receipt: LocalContextQualification
  ): void {
    fs.mkdirSync(
      this.rootDir,
      { recursive: true }
    );
    const target =
      this.qualificationPath();
    const temporary =
      `${target}.tmp`;
    fs.writeFileSync(
      temporary,
      `${JSON.stringify(
        receipt,
        null,
        2
      )}\n`,
      "utf8"
    );
    fs.renameSync(
      temporary,
      target
    );
  }

  private manifest(): ReleaseManifest {
    return readJson<ReleaseManifest>(this.manifestPath()) ?? {};
  }

  private models(): readonly ReleaseLocalModel[] {
    const models = this.manifest().models?.localLlm;
    return Array.isArray(models) && models.length > 0
      ? models
      : FALLBACK_MODELS;
  }

  private modelSpec(id: string): ReleaseLocalModel | undefined {
    return this.models().find((item) => normalizeModelId(item.id) === id);
  }

  private readConfig(): LocalAiConfig | null {
    const config = readJson<LocalAiConfig>(this.configPath());
    if (!config || config.schemaVersion !== 1) return null;
    if (!finiteInteger(config.context?.requestedTokens)) return null;
    if (!finiteInteger(config.model?.nativeContext)) return null;
    if (typeof config.model?.id !== "string") return null;
    if (typeof config.model?.path !== "string") return null;
    if (typeof config.engine?.executable !== "string") return null;
    return config;
  }

  private publicDescriptor(
    model: ReleaseLocalModel,
    config: LocalAiConfig | null
  ): LocalModelDescriptor {
    const canonical = normalizeModelId(model.id);
    const selected = config && normalizeModelId(config.model.id) === canonical
      ? config
      : null;
    const minimum = model.minimumContext ?? this.contextPolicy().minimum;
    const maximum = model.maximumRuntimeContext ?? model.nativeContext;
    const contextWindow = selected?.context.requestedTokens ?? Math.max(minimum, model.nativeContext);
    return {
      provider: "local",
      id: canonical,
      displayName: model.displayName,
      selectable: true,
      contextWindow,
      nativeContextWindow: model.nativeContext,
      minimumContextWindow: minimum,
      maximumContextWindow: maximum,
      ...(selected ? { configuredContextWindow: selected.context.requestedTokens } : {}),
      contextMode: selected?.context.mode ?? (
        contextWindow > model.nativeContext ? "YARN_EXTENDED" : "NATIVE_OR_REDUCED"
      ),
      quantization: model.quantization,
      license: model.license ?? "UNKNOWN",
      source: model.sourceModel ?? model.id,
      localOnly: true,
      installed: fs.existsSync(path.join(this.rootDir, "models", model.filename))
    };
  }

  private validateContext(model: ReleaseLocalModel, contextTokens: number): void {
    if (!finiteInteger(contextTokens)) {
      throw new Error("LOCAL_MODEL_CONTEXT_INVALID");
    }
    const policy = this.contextPolicy();
    const minimum = Math.max(
      policy.minimum,
      model.minimumContext ??
        policy.minimum
    );
    const maximum = Math.min(
      policy.maximum,
      model.maximumRuntimeContext ??
        model.nativeContext
    );
    if (contextTokens < minimum || contextTokens > maximum) {
      throw new Error(
        `LOCAL_MODEL_CONTEXT_UNSUPPORTED:${contextTokens}:${minimum}:${maximum}`
      );
    }
    if ((contextTokens - policy.minimum) % policy.step !== 0) {
      throw new Error(`LOCAL_MODEL_CONTEXT_STEP_INVALID:${policy.step}`);
    }
  }

  private async runProvisioner(
    modelId: string,
    contextTokens: number,
    manifestOverride?: string
  ): Promise<void> {
    const script = this.provisionerPath();
    const manifest =
      manifestOverride
        ? path.resolve(
            manifestOverride
          )
        : this.manifestPath();
    if (!fs.existsSync(script)) {
      throw new Error("LOCAL_MODEL_PROVISIONER_MISSING");
    }
    if (!fs.existsSync(manifest)) {
      throw new Error("LOCAL_MODEL_RELEASE_MANIFEST_MISSING");
    }

    const powershell = process.env.SystemRoot
      ? path.join(
          process.env.SystemRoot,
          "System32",
          "WindowsPowerShell",
          "v1.0",
          "powershell.exe"
        )
      : "powershell.exe";
    const args = [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      script,
      "-RuntimeRoot",
      this.runtimeRoot,
      "-ManifestPath",
      manifest,
      "-ModelId",
      modelId,
      "-ContextTokens",
      String(contextTokens),
      "-LocalAiRoot",
      this.rootDir
    ];

    await new Promise<void>((resolve, reject) => {
      const child = spawn(powershell, args, {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"]
      });
      let stdout = "";
      let stderr = "";
      let stdoutLineBuffer = "";
      const consumeStdoutLine = (
        line: string
      ) => {
        const progress =
          parseLocalAiProgressLine(
            line
          );
        if (progress) {
          this.provisioningProgress =
            progress;
        }
      };
      const timeout = setTimeout(() => {
        child.kill();
        reject(new Error("LOCAL_MODEL_PROVISIONING_TIMEOUT"));
      }, 2 * 60 * 60_000);
      child.stdout?.setEncoding("utf8");
      child.stderr?.setEncoding("utf8");
      child.stdout?.on(
        "data",
        (
          chunk:
            string | Buffer
        ) => {
          const text =
            chunk.toString();
          stdout =
            `${stdout}${text}`
              .slice(-16_000);
          stdoutLineBuffer +=
            text;
          let newline =
            stdoutLineBuffer
              .indexOf("\n");
          while (newline >= 0) {
            const line =
              stdoutLineBuffer
                .slice(
                  0,
                  newline
                )
                .replace(
                  /\r$/,
                  ""
                );
            stdoutLineBuffer =
              stdoutLineBuffer.slice(
                newline + 1
              );
            consumeStdoutLine(
              line
            );
            newline =
              stdoutLineBuffer
                .indexOf("\n");
          }
        }
      );
      child.stderr?.on("data", (chunk: string | Buffer) => {
        stderr = `${stderr}${chunk.toString()}`.slice(-16_000);
      });
      child.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.once("exit", (code) => {
        clearTimeout(timeout);
        if (
          stdoutLineBuffer.trim()
        ) {
          consumeStdoutLine(
            stdoutLineBuffer
          );
        }
        if (code === 0) resolve();
        else reject(
          new Error(
            `LOCAL_MODEL_PROVISIONING_FAILED:${code ?? "signal"}:${stderr || stdout}`
          )
        );
      });
    });
  }

  private assertConfiguredComponents(config: LocalAiConfig): void {
    if (!fs.existsSync(config.engine.executable)) {
      throw new Error("LOCAL_MODEL_ENGINE_MISSING");
    }
    if (!fs.existsSync(config.model.path)) {
      throw new Error(`LOCAL_MODEL_FILE_MISSING:${config.model.id}`);
    }
  }

  private async launch(config: LocalAiConfig): Promise<void> {
    const canonical = normalizeModelId(config.model.id);
    const args = [
      "--model",
      config.model.path,
      "--alias",
      canonical,
      "--host",
      this.host,
      "--port",
      String(this.port),
      "--ctx-size",
      String(config.context.requestedTokens),
      "--parallel",
      "1",
      "--jinja",
      "--flash-attn",
      "auto",
      "--cache-type-k",
      "q8_0",
      "--cache-type-v",
      "q8_0"
    ];
    if (config.context.extendedBeyondNative) {
      args.push(
        "--rope-scaling",
        "yarn",
        "--rope-scale",
        String(config.context.ropeScale),
        "--yarn-orig-ctx",
        String(config.model.nativeContext)
      );
    }

    const child = spawn(config.engine.executable, args, {
      cwd: this.rootDir,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });
    this.child = child;

    let stderrTail = "";
    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", (chunk: string | Buffer) => {
      stderrTail = `${stderrTail}${chunk.toString()}`.slice(-8_000);
    });

    const exited = new Promise<never>((_resolve, reject) => {
      child.once("error", reject);
      child.once("exit", (code) => {
        reject(
          new Error(
            `LOCAL_MODEL_SERVER_EXIT:${code ?? "signal"}:${stderrTail.slice(-1200)}`
          )
        );
      });
    });

    const deadline = Date.now() + 180_000;
    while (Date.now() < deadline) {
      if (await this.isHealthy()) return;
      await Promise.race([
        new Promise<void>((resolve) => setTimeout(resolve, 500)),
        exited
      ]);
    }
    throw new Error("LOCAL_MODEL_START_TIMEOUT");
  }

  private async calibrateTokenizer():
    Promise<LocalTokenizerCalibration> {
    const samples = [
      "Powód wnosi o zasądzenie kwoty 12 345,67 zł wraz z odsetkami ustawowymi za opóźnienie od dnia 18 września 2026 r.",
      "§ 4. Wykonawca zobowiązuje się wykonać przedmiot umowy w terminie 14 dni od doręczenia kompletnej dokumentacji.",
      "Sygn. III CZP 25/11; art. 6 KC; faktura VAT nr FV/09/2026; termin płatności: 30 dni."
    ];

    const ratios:
      number[] = [];

    for (
      const sample
      of samples
    ) {
      let response: Response;
      try {
        response =
          await fetch(
            `http://${this.host}:${this.port}/tokenize`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json"
              },
              body:
                JSON.stringify({
                  content:
                    sample,
                  add_special:
                    false,
                  parse_special:
                    true,
                  with_pieces:
                    false
                }),
              signal:
                AbortSignal.timeout(
                  2_500
                )
            }
          );
      } catch (error) {
        throw new Error(
          `LOCAL_TOKENIZER_CALIBRATION_FAILED:NETWORK:${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }

      if (!response.ok) {
        throw new Error(
          `LOCAL_TOKENIZER_CALIBRATION_FAILED:HTTP_${response.status}`
        );
      }

      let payload:
        {
          tokens?: unknown;
        };
      try {
        payload =
          await response.json() as {
            tokens?: unknown;
          };
      } catch {
        throw new Error(
          "LOCAL_TOKENIZER_CALIBRATION_FAILED:INVALID_JSON"
        );
      }

      if (
        !Array.isArray(
          payload.tokens
        ) ||
        payload.tokens.length <
          1 ||
        payload.tokens.length >
          sample.length * 4
      ) {
        throw new Error(
          "LOCAL_TOKENIZER_CALIBRATION_FAILED:TOKENS_INVALID"
        );
      }

      const ratio =
        sample.length /
        payload.tokens.length;
      if (
        !Number.isFinite(
          ratio
        ) ||
        ratio < 0.5 ||
        ratio > 16
      ) {
        throw new Error(
          "LOCAL_TOKENIZER_CALIBRATION_FAILED:RATIO_INVALID"
        );
      }
      ratios.push(
        ratio
      );
    }

    if (
      ratios.length !==
        samples.length
    ) {
      throw new Error(
        "LOCAL_TOKENIZER_CALIBRATION_FAILED:INCOMPLETE"
      );
    }

    const observedMin =
      Math.min(...ratios);
    const conservative =
      Math.max(
        1,
        Math.min(
          3,
          observedMin * 0.9
        )
      );

    return {
      endpoint: "/tokenize",
      sampleCount:
        samples.length,
      observedMinCharsPerToken:
        Number(
          observedMin.toFixed(4)
        ),
      conservativeCharsPerToken:
        Number(
          conservative.toFixed(4)
        ),
      calibratedAt:
        new Date().toISOString()
    };
  }

  private async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`http://${this.host}:${this.port}/health`, {
        signal: AbortSignal.timeout(1_500)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
