import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";

export type LocalModelId = string;

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
  };
};

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
    executable: string;
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
  }

  listModels(): LocalModelDescriptor[] {
    const configured = this.readConfig();
    return this.models().map((model) => this.publicDescriptor(model, configured));
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
      contextPolicy: this.contextPolicy()
    };
  }

  async provision(modelId: string, contextTokens: number): Promise<{
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
    const model = this.modelSpec(canonical);
    if (!model) throw new Error("LOCAL_MODEL_UNKNOWN");
    this.validateContext(model, contextTokens);

    await this.stop();
    fs.mkdirSync(this.rootDir, { recursive: true });
    const configPath = this.configPath();
    const previousConfig = fs.existsSync(configPath)
      ? fs.readFileSync(configPath)
      : null;
    const restorePreviousConfig = () => {
      if (previousConfig) {
        fs.writeFileSync(configPath, previousConfig);
      } else {
        fs.rmSync(configPath, { force: true });
      }
    };

    const task = this.runProvisioner(canonical, contextTokens);
    this.provisioning = task;
    try {
      await task;

      const config = this.readConfig();
      if (!config || normalizeModelId(config.model.id) !== canonical) {
        throw new Error("LOCAL_MODEL_PROVISIONING_CONFIG_MISSING");
      }
      this.assertConfiguredComponents(config);

      try {
        await this.ensureRunning(canonical);
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

      return {
        model: this.publicDescriptor(model, config),
        contextTokens: config.context.requestedTokens,
        configPath
      };
    } catch (error) {
      restorePreviousConfig();
      throw error;
    } finally {
      this.provisioning = null;
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
    const minimum = model.minimumContext ?? policy.minimum;
    const maximum = model.maximumRuntimeContext ?? model.nativeContext;
    if (contextTokens < minimum || contextTokens > maximum) {
      throw new Error(
        `LOCAL_MODEL_CONTEXT_UNSUPPORTED:${contextTokens}:${minimum}:${maximum}`
      );
    }
    if ((contextTokens - policy.minimum) % policy.step !== 0) {
      throw new Error(`LOCAL_MODEL_CONTEXT_STEP_INVALID:${policy.step}`);
    }
  }

  private async runProvisioner(modelId: string, contextTokens: number): Promise<void> {
    const script = this.provisionerPath();
    const manifest = this.manifestPath();
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
      const timeout = setTimeout(() => {
        child.kill();
        reject(new Error("LOCAL_MODEL_PROVISIONING_TIMEOUT"));
      }, 2 * 60 * 60_000);
      child.stdout?.setEncoding("utf8");
      child.stderr?.setEncoding("utf8");
      child.stdout?.on("data", (chunk: string | Buffer) => {
        stdout = `${stdout}${chunk.toString()}`.slice(-16_000);
      });
      child.stderr?.on("data", (chunk: string | Buffer) => {
        stderr = `${stderr}${chunk.toString()}`.slice(-16_000);
      });
      child.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.once("exit", (code) => {
        clearTimeout(timeout);
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
