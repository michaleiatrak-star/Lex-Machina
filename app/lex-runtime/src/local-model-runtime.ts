import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";

export type LocalModelId =
  | "local/mistral-nemo-12b-q4km"
  | "local/bielik-11b-v3-q4km-64k-yarn";

export type LocalModelDescriptor = {
  provider: "local";
  id: LocalModelId;
  displayName: string;
  selectable: true;
  contextWindow: number;
  nativeContextWindow: number;
  contextMode: "NATIVE" | "YARN_EXTENDED";
  quantization: "Q4_K_M";
  license: "Apache-2.0";
  source: string;
  localOnly: true;
};

type ModelLaunchSpec = LocalModelDescriptor & {
  filename: string;
  extraArgs: string[];
};

const LOCAL_MODEL_SPECS: readonly ModelLaunchSpec[] = [
  {
    provider: "local",
    id: "local/mistral-nemo-12b-q4km",
    displayName: "Mistral NeMo 12B Instruct · Q4_K_M · 128k",
    contextWindow: 131_072,
    nativeContextWindow: 131_072,
    contextMode: "NATIVE",
    quantization: "Q4_K_M",
    license: "Apache-2.0",
    source: "mistralai/Mistral-Nemo-Instruct-2407 (GGUF conversion pinned in release manifest)",
    localOnly: true,
    filename: "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf",
    extraArgs: []
  },
  {
    provider: "local",
    id: "local/bielik-11b-v3-q4km-64k-yarn",
    displayName: "Bielik 11B v3 Instruct · Q4_K_M · 64k YaRN",
    contextWindow: 65_536,
    nativeContextWindow: 32_768,
    contextMode: "YARN_EXTENDED",
    quantization: "Q4_K_M",
    license: "Apache-2.0",
    source: "speakleash/Bielik-11B-v3.0-Instruct-GGUF",
    localOnly: true,
    filename: "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
    extraArgs: [
      "--rope-scaling",
      "yarn",
      "--rope-scale",
      "2",
      "--yarn-orig-ctx",
      "32768"
    ]
  }
] as const;

function runtimeRoot(): string {
  const configured = process.env.LEX_LOCAL_LLM_ROOT?.trim();
  if (configured) return path.resolve(configured);
  return path.resolve(process.cwd(), "../llm");
}

function modelSpec(id: string): ModelLaunchSpec | undefined {
  return LOCAL_MODEL_SPECS.find((item) => item.id === id);
}

function publicDescriptor(spec: ModelLaunchSpec): LocalModelDescriptor {
  const { filename: _filename, extraArgs: _extraArgs, ...descriptor } = spec;
  return descriptor;
}

export class LocalModelRuntime {
  readonly rootDir: string;
  readonly host = "127.0.0.1";
  readonly port: number;

  private child: ChildProcess | null = null;
  private activeModelId: LocalModelId | null = null;
  private startup: Promise<void> | null = null;

  constructor(options?: {
    rootDir?: string;
    port?: number;
  }) {
    this.rootDir = path.resolve(options?.rootDir ?? runtimeRoot());
    this.port = options?.port ?? Number(process.env.LEX_LOCAL_LLM_PORT ?? 4318);
    if (!Number.isInteger(this.port) || this.port < 1024 || this.port > 65535) {
      throw new Error("LOCAL_MODEL_PORT_INVALID");
    }
  }

  listModels(): LocalModelDescriptor[] {
    return LOCAL_MODEL_SPECS.map(publicDescriptor);
  }

  status(): {
    configured: boolean;
    enginePresent: boolean;
    modelsPresent: Record<LocalModelId, boolean>;
    activeModelId: LocalModelId | null;
    state: "STOPPED" | "STARTING" | "READY";
    endpoint: string;
  } {
    const enginePresent = fs.existsSync(this.serverExecutable());
    const modelsPresent = Object.fromEntries(
      LOCAL_MODEL_SPECS.map((spec) => [
        spec.id,
        fs.existsSync(this.modelPath(spec))
      ])
    ) as Record<LocalModelId, boolean>;
    const configured =
      enginePresent &&
      Object.values(modelsPresent).every(Boolean);
    return {
      configured,
      enginePresent,
      modelsPresent,
      activeModelId: this.activeModelId,
      state: this.startup
        ? "STARTING"
        : this.child && this.activeModelId
          ? "READY"
          : "STOPPED",
      endpoint: `http://${this.host}:${this.port}/v1`
    };
  }

  async ensureRunning(id: string): Promise<LocalModelDescriptor> {
    const spec = modelSpec(id);
    if (!spec) throw new Error("LOCAL_MODEL_UNKNOWN");

    if (
      this.child &&
      this.activeModelId === spec.id &&
      !this.startup &&
      await this.isHealthy()
    ) {
      return publicDescriptor(spec);
    }

    if (this.startup && this.activeModelId === spec.id) {
      await this.startup;
      return publicDescriptor(spec);
    }

    await this.stop();
    this.assertComponents(spec);
    this.activeModelId = spec.id;
    this.startup = this.launch(spec);
    try {
      await this.startup;
      return publicDescriptor(spec);
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

  private serverExecutable(): string {
    return path.join(
      this.rootDir,
      "llama",
      process.platform === "win32" ? "llama-server.exe" : "llama-server"
    );
  }

  private modelPath(spec: ModelLaunchSpec): string {
    return path.join(this.rootDir, "models", spec.filename);
  }

  private assertComponents(spec: ModelLaunchSpec): void {
    if (!fs.existsSync(this.serverExecutable())) {
      throw new Error("LOCAL_MODEL_ENGINE_MISSING");
    }
    if (!fs.existsSync(this.modelPath(spec))) {
      throw new Error(`LOCAL_MODEL_FILE_MISSING:${spec.id}`);
    }
  }

  private async launch(spec: ModelLaunchSpec): Promise<void> {
    const args = [
      "--model",
      this.modelPath(spec),
      "--alias",
      spec.id,
      "--host",
      this.host,
      "--port",
      String(this.port),
      "--ctx-size",
      String(spec.contextWindow),
      "--parallel",
      "1",
      "--jinja",
      "--flash-attn",
      "auto",
      "--cache-type-k",
      "q8_0",
      "--cache-type-v",
      "q8_0",
      ...spec.extraArgs
    ];

    const child = spawn(this.serverExecutable(), args, {
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
