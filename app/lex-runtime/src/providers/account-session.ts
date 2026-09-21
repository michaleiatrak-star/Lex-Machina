import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import type {
  NormalizedToolCall,
  ProviderId,
  ProviderStreamParams,
  ProviderStreamResult
} from "./types.js";

const COMMAND_TIMEOUT_MS = 20 * 60 * 1000;
const AUTH_TIMEOUT_MS = 5 * 60 * 1000;
const STATUS_TIMEOUT_MS = 15_000;
const MAX_CAPTURE_BYTES = 8 * 1024 * 1024;
const TOOL_SENTINEL = "LEX_TOOL_CALLS_JSON:";

const ACCOUNT_MODEL_IDS: Record<ProviderId, string> = {
  openai: "account/openai/default",
  anthropic: "account/anthropic/default",
  xai: "account/xai/default"
};

const CLI_NAMES: Record<ProviderId, string> = {
  openai: "codex",
  anthropic: "claude",
  xai: "grok"
};

export type ProviderAccountSessionTakeoverMode =
  | "LAST"
  | "EXPLICIT";

export type ProviderAccountSessionStatus = {
  provider: ProviderId;
  command: string;
  installed: boolean;
  authenticated: boolean;
  installHint: string;
  takeoverSupported: boolean;
  takeoverActive: boolean;
  takeoverMode?: ProviderAccountSessionTakeoverMode;
  takeoverReference?: string;
  takeoverHint: string;
};

type AccountSessionTakeover = {
  reference: string;
  displayReference: string;
  mode: ProviderAccountSessionTakeoverMode;
};

type RunResult = {
  code: number;
  stdout: string;
  stderr: string;
};

function accountEnvironment(provider: ProviderId): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env
  };
  if (provider === "openai") {
    delete env.OPENAI_API_KEY;
  } else if (provider === "anthropic") {
    delete env.ANTHROPIC_API_KEY;
    delete env.ANTHROPIC_AUTH_TOKEN;
  } else {
    delete env.XAI_API_KEY;
  }
  return env;
}

function installHint(provider: ProviderId): string {
  if (provider === "openai") {
    return "Zainstaluj Codex CLI i wykonaj: codex login";
  }
  if (provider === "anthropic") {
    return "Zainstaluj Claude Code i wykonaj: claude auth login";
  }
  return "Zainstaluj Grok Build CLI i wykonaj: grok login";
}

function takeoverHint(provider: ProviderId): string {
  if (provider === "openai") {
    return "Puste pole przejmuje ostatnią sesję Codex; można też podać ID sesji.";
  }
  if (provider === "anthropic") {
    return "Puste pole przejmuje najnowszą lokalną sesję Claude Code; można też podać ID, nazwę lub ścieżkę transkryptu .jsonl.";
  }
  return "Dla Grok/ACP podaj ID istniejącej sesji.";
}

function normalizeTakeoverReference(
  value: string | undefined
): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  if (
    trimmed.length > 4096 ||
    trimmed.includes("\0")
  ) {
    throw new Error(
      "ACCOUNT_SESSION_REFERENCE_INVALID"
    );
  }
  return trimmed;
}

async function latestClaudeTranscript(): Promise<string | null> {
  const configured =
    process.env.CLAUDE_CONFIG_DIR?.trim();
  const root = configured
    ? path.join(
        path.resolve(configured),
        "projects"
      )
    : path.join(
        os.homedir(),
        ".claude",
        "projects"
      );

  let entriesSeen = 0;
  let latest:
    | {
        file: string;
        mtimeMs: number;
      }
    | null = null;
  const pending = [root];

  while (
    pending.length > 0 &&
    entriesSeen < 20_000
  ) {
    const current =
      pending.pop()!;
    let entries:
      Awaited<
        ReturnType<
          typeof fsp.readdir
        >
      >;
    try {
      entries =
        await fsp.readdir(
          current,
          {
            withFileTypes:
              true
          }
        );
    } catch {
      continue;
    }

    for (const entry of entries) {
      entriesSeen += 1;
      if (entriesSeen >= 20_000) {
        break;
      }
      const full =
        path.join(
          current,
          entry.name
        );
      if (entry.isDirectory()) {
        pending.push(full);
        continue;
      }
      if (
        !entry.isFile() ||
        !entry.name
          .toLowerCase()
          .endsWith(".jsonl")
      ) {
        continue;
      }
      try {
        const stat =
          await fsp.stat(full);
        if (
          !latest ||
          stat.mtimeMs >
            latest.mtimeMs
        ) {
          latest = {
            file: full,
            mtimeMs:
              stat.mtimeMs
          };
        }
      } catch {
        // A session may disappear while Claude Code rotates local state.
      }
    }
  }

  return latest?.file ?? null;
}

function cmdQuote(value: string): string {
  const escaped = value
    .replace(/%/g, "%%")
    .replace(/"/g, '""');
  return `"${escaped}"`;
}

async function resolveCommand(command: string): Promise<string | null> {
  const probe = process.platform === "win32" ? "where.exe" : "which";
  const result = await runDirect(
    probe,
    [command],
    undefined,
    process.env,
    5_000
  ).catch(() => null);
  if (!result || result.code !== 0) return null;
  const candidate = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
  return candidate || null;
}

function spawnResolved(
  executable: string,
  args: string[],
  cwd: string | undefined,
  env: NodeJS.ProcessEnv
): ChildProcessWithoutNullStreams {
  if (
    process.platform === "win32" &&
    /\.(cmd|bat)$/i.test(executable)
  ) {
    const comspec = process.env.ComSpec || "cmd.exe";
    const commandLine = [
      cmdQuote(executable),
      ...args.map(cmdQuote)
    ].join(" ");
    return spawn(
      comspec,
      ["/d", "/s", "/c", commandLine],
      {
        cwd,
        env,
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
      }
    );
  }

  return spawn(
    executable,
    args,
    {
      cwd,
      env,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"]
    }
  );
}

function appendCapture(
  current: string,
  chunk: Buffer | string
): string {
  const next = current + chunk.toString();
  if (Buffer.byteLength(next, "utf8") <= MAX_CAPTURE_BYTES) {
    return next;
  }
  return next.slice(-MAX_CAPTURE_BYTES);
}

function runDirect(
  executable: string,
  args: string[],
  stdinText: string | undefined,
  env: NodeJS.ProcessEnv,
  timeoutMs: number,
  cwd?: string,
  abortSignal?: AbortSignal
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawnResolved(executable, args, cwd, env);
    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (
      callback: () => void
    ) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      abortSignal?.removeEventListener("abort", onAbort);
      callback();
    };

    const onAbort = () => {
      child.kill();
      finish(() => {
        const error = new Error("ACCOUNT_SESSION_ABORTED");
        error.name = "AbortError";
        reject(error);
      });
    };

    const timer = setTimeout(() => {
      child.kill();
      finish(() =>
        reject(new Error("ACCOUNT_SESSION_COMMAND_TIMEOUT"))
      );
    }, timeoutMs);

    abortSignal?.addEventListener("abort", onAbort, { once: true });

    child.stdout.on("data", (chunk) => {
      stdout = appendCapture(stdout, chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr = appendCapture(stderr, chunk);
    });
    child.once("error", (error) => {
      finish(() => reject(error));
    });
    child.once("exit", (code) => {
      finish(() =>
        resolve({
          code: code ?? 1,
          stdout,
          stderr
        })
      );
    });

    if (stdinText !== undefined) {
      child.stdin.end(stdinText);
    } else {
      child.stdin.end();
    }
  });
}

async function runCli(
  provider: ProviderId,
  args: string[],
  stdinText: string | undefined,
  timeoutMs: number,
  cwd?: string,
  abortSignal?: AbortSignal
): Promise<RunResult> {
  const command = CLI_NAMES[provider];
  const executable = await resolveCommand(command);
  if (!executable) {
    throw new Error(`ACCOUNT_SESSION_CLI_NOT_INSTALLED:${provider}`);
  }
  return runDirect(
    executable,
    args,
    stdinText,
    accountEnvironment(provider),
    timeoutMs,
    cwd,
    abortSignal
  );
}

function normalizeCliFailure(
  provider: ProviderId,
  result: RunResult
): Error {
  const detail = (result.stderr || result.stdout)
    .trim()
    .slice(-1200)
    .replace(/[\r\n]+/g, " ");
  return new Error(
    `ACCOUNT_SESSION_CLI_FAILED:${provider}:${result.code}${detail ? `:${detail}` : ""}`
  );
}

function openAiChatGptAuthenticated(
  result: RunResult
): boolean {
  if (result.code !== 0) {
    return false;
  }
  const status =
    (result.stdout + "\n" + result.stderr)
      .toLowerCase();
  return status.includes(
    "logged in using chatgpt"
  ) || status.includes(
    "using chatgpt"
  );
}

function claudeSubscriptionAuthenticated(
  result: RunResult
): boolean {
  if (result.code !== 0) {
    return false;
  }
  try {
    const payload =
      JSON.parse(
        result.stdout
      ) as {
        loggedIn?: unknown;
        authMethod?: unknown;
        apiProvider?: unknown;
      };
    return (
      payload.loggedIn === true &&
      payload.apiProvider ===
        "firstParty" &&
      (
        payload.authMethod ===
          "claude.ai" ||
        payload.authMethod ===
          "oauth_token"
      )
    );
  } catch {
    return false;
  }
}

async function assertSubscriptionAccount(
  provider: "openai" | "anthropic",
  abortSignal?: AbortSignal
): Promise<void> {
  const result =
    provider === "openai"
      ? await runCli(
          provider,
          [
            "login",
            "status"
          ],
          undefined,
          STATUS_TIMEOUT_MS,
          undefined,
          abortSignal
        )
      : await runCli(
          provider,
          [
            "auth",
            "status"
          ],
          undefined,
          STATUS_TIMEOUT_MS,
          undefined,
          abortSignal
        );
  const authenticated =
    provider === "openai"
      ? openAiChatGptAuthenticated(
          result
        )
      : claudeSubscriptionAuthenticated(
          result
        );
  if (!authenticated) {
    throw new Error(
      `ACCOUNT_SESSION_NOT_SUBSCRIPTION_AUTH:${provider}`
    );
  }
}

async function runGrokAcp(
  prompt: string | null,
  cwd: string,
  abortSignal?: AbortSignal,
  sessionRef?: string
): Promise<{
  authenticated: boolean;
  text?: string;
}> {
  const executable =
    await resolveCommand(
      CLI_NAMES.xai
    );
  if (!executable) {
    throw new Error(
      "ACCOUNT_SESSION_CLI_NOT_INSTALLED:xai"
    );
  }

  return new Promise((resolve, reject) => {
    const proc = spawnResolved(
      executable,
      [
        "--no-auto-update",
        "--permission-mode",
        "dontAsk",
        "--disallowed-tools",
        "*",
        "--sandbox",
        "strict",
        "--no-subagents",
        "--no-memory",
        "--disable-web-search",
        "agent",
        "stdio"
      ],
      cwd,
      accountEnvironment(
        "xai"
      )
    );
    const rl =
      readline.createInterface({
        input: proc.stdout
      });
    let nextId = 1;
    let text = "";
    let stderr = "";
    let settled = false;
    const pending =
      new Map<
        number,
        {
          resolve: (
            value: Record<string, unknown>
          ) => void;
          reject: (
            error: Error
          ) => void;
          timer: NodeJS.Timeout;
        }
      >();

    const cleanup = () => {
      rl.close();
      proc.kill();
      abortSignal
        ?.removeEventListener(
          "abort",
          onAbort
        );
      for (
        const item
        of pending.values()
      ) {
        clearTimeout(
          item.timer
        );
      }
      pending.clear();
    };

    const finishReject = (
      error: Error
    ) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    const finishResolve = (
      value: {
        authenticated: boolean;
        text?: string;
      }
    ) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    };

    const onAbort = () => {
      const error =
        new Error(
          "ACCOUNT_SESSION_ABORTED"
        );
      error.name = "AbortError";
      finishReject(error);
    };

    const request = (
      method: string,
      params: Record<
        string,
        unknown
      >,
      timeoutMs =
        STATUS_TIMEOUT_MS
    ): Promise<
      Record<string, unknown>
    > => {
      const id =
        nextId++;
      return new Promise(
        (
          requestResolve,
          requestReject
        ) => {
          const timer =
            setTimeout(
              () => {
                pending.delete(
                  id
                );
                requestReject(
                  new Error(
                    `ACCOUNT_SESSION_ACP_TIMEOUT:${method}`
                  )
                );
              },
              timeoutMs
            );
          pending.set(
            id,
            {
              resolve:
                requestResolve,
              reject:
                requestReject,
              timer
            }
          );
          proc.stdin.write(
            JSON.stringify({
              jsonrpc:
                "2.0",
              id,
              method,
              params
            }) + "\n"
          );
        }
      );
    };

    abortSignal
      ?.addEventListener(
        "abort",
        onAbort,
        {
          once: true
        }
      );

    proc.stderr.on(
      "data",
      (chunk) => {
        stderr =
          appendCapture(
            stderr,
            chunk
          );
      }
    );
    proc.once(
      "error",
      (error) =>
        finishReject(
          error instanceof Error
            ? error
            : new Error(
                String(
                  error
                )
              )
        )
    );
    proc.once(
      "exit",
      (code) => {
        if (!settled) {
          finishReject(
            new Error(
              `ACCOUNT_SESSION_CLI_FAILED:xai:${code ?? "signal"}:${stderr
                .trim()
                .slice(-800)
                .replace(/[\r\n]+/g, " ")}`
            )
          );
        }
      }
    );

    rl.on(
      "line",
      (line) => {
        let message:
          Record<
            string,
            unknown
          >;
        try {
          message =
            JSON.parse(
              line
            ) as Record<
              string,
              unknown
            >;
        } catch {
          return;
        }

        if (
          message.method ===
            "session/update"
        ) {
          const params =
            message.params &&
            typeof message.params ===
              "object"
              ? message.params as
                  Record<
                    string,
                    unknown
                  >
              : null;
          const update =
            params?.update &&
            typeof params.update ===
              "object"
              ? params.update as
                  Record<
                    string,
                    unknown
                  >
              : null;
          const content =
            update?.content &&
            typeof update.content ===
              "object"
              ? update.content as
                  Record<
                    string,
                    unknown
                  >
              : null;
          if (
            update
              ?.sessionUpdate ===
              "agent_message_chunk" &&
            typeof content?.text ===
              "string"
          ) {
            text +=
              content.text;
          }
          return;
        }

        const id =
          typeof message.id ===
            "number"
            ? message.id
            : null;
        if (id === null) {
          return;
        }
        const pendingRequest =
          pending.get(id);
        if (!pendingRequest) {
          return;
        }
        pending.delete(id);
        clearTimeout(
          pendingRequest.timer
        );
        if (
          message.error &&
          typeof message.error ===
            "object"
        ) {
          const error =
            message.error as
              Record<
                string,
                unknown
              >;
          pendingRequest.reject(
            new Error(
              typeof error.message ===
                "string"
                ? error.message
                : "ACCOUNT_SESSION_ACP_ERROR"
            )
          );
        } else {
          pendingRequest.resolve(
            message.result &&
            typeof message.result ===
              "object"
              ? message.result as
                  Record<
                    string,
                    unknown
                  >
              : {}
          );
        }
      }
    );

    void (async () => {
      try {
      const init =
        await request(
          "initialize",
          {
            protocolVersion:
              1,
            clientCapabilities:
              {}
          }
        );
      const authMethods =
        Array.isArray(
          init.authMethods
        )
          ? init.authMethods
          : [];
      const hasCachedToken =
        authMethods.some(
          (item) =>
            item &&
            typeof item ===
              "object" &&
            (
              item as Record<
                string,
                unknown
              >
            ).id ===
              "cached_token"
        );

      if (!hasCachedToken) {
        finishResolve({
          authenticated:
            false
        });
        return;
      }

      await request(
        "authenticate",
        {
          methodId:
            "cached_token",
          _meta: {
            headless:
              true
          }
        },
        STATUS_TIMEOUT_MS
      );

      if (prompt === null) {
        finishResolve({
          authenticated:
            true
        });
        return;
      }

      let sessionId = "";
      if (sessionRef) {
        const capabilities =
          init.agentCapabilities &&
          typeof init.agentCapabilities ===
            "object"
            ? init.agentCapabilities as
                Record<
                  string,
                  unknown
                >
            : null;
        const loadSession =
          capabilities?.loadSession;
        if (
          !(
            loadSession === true ||
            (
              loadSession &&
              typeof loadSession ===
                "object"
            )
          )
        ) {
          throw new Error(
            "ACCOUNT_SESSION_TAKEOVER_UNSUPPORTED:xai"
          );
        }
        await request(
          "session/load",
          {
            sessionId:
              sessionRef,
            cwd,
            mcpServers:
              []
          }
        );
        sessionId =
          sessionRef;
      } else {
        const session =
          await request(
            "session/new",
            {
              cwd,
              mcpServers:
                []
            }
          );
        sessionId =
          typeof session.sessionId ===
            "string"
            ? session.sessionId
            : "";
        if (!sessionId) {
          throw new Error(
            "ACCOUNT_SESSION_ACP_SESSION_INVALID"
          );
        }
      }

      await request(
        "session/prompt",
        {
          sessionId,
          prompt: [
            {
              type:
                "text",
              text:
                prompt
            }
          ]
        },
        COMMAND_TIMEOUT_MS
      );

      let lastLength = -1;
      let stableChecks = 0;
      while (
        stableChecks < 2
      ) {
        await new Promise<void>(
          (waitResolve) =>
            setTimeout(
              waitResolve,
              150
            )
        );
        if (
          text.length ===
            lastLength
        ) {
          stableChecks += 1;
        } else {
          lastLength =
            text.length;
          stableChecks = 0;
        }
      }

      const finalText =
        text.trim();
      if (!finalText) {
        throw new Error(
          "ACCOUNT_SESSION_EMPTY_RESPONSE:xai"
        );
      }
      finishResolve({
        authenticated:
          true,
        text:
          finalText
      });
      } catch (error) {
        finishReject(
          error instanceof Error
            ? error
            : new Error(
                String(error)
              )
        );
      }
    })();
  });
}

export function accountSessionModelId(
  provider: ProviderId
): string {
  return ACCOUNT_MODEL_IDS[provider];
}

export function isAccountSessionModel(
  provider: ProviderId,
  model: string
): boolean {
  return model === ACCOUNT_MODEL_IDS[provider];
}

function parseToolCalls(text: string): NormalizedToolCall[] | null {
  let normalized = text.trim();
  if (
    normalized.startsWith("```") &&
    normalized.endsWith("```")
  ) {
    normalized = normalized
      .replace(/^\`\`\`(?:json)?\s*/i, "")
      .replace(/\s*\`\`\`$/, "")
      .trim();
  }
  if (!normalized.startsWith(TOOL_SENTINEL)) {
    return null;
  }

  const payload = normalized
    .slice(TOOL_SENTINEL.length)
    .trim();
  const parsed = JSON.parse(payload) as {
    calls?: unknown;
  };
  if (!Array.isArray(parsed.calls)) {
    throw new Error("ACCOUNT_SESSION_TOOL_PROTOCOL_INVALID");
  }

  return parsed.calls.map((item, index) => {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error("ACCOUNT_SESSION_TOOL_PROTOCOL_INVALID");
    }
    const record = item as Record<string, unknown>;
    const name =
      typeof record.name === "string"
        ? record.name
        : "";
    const id =
      typeof record.id === "string" &&
      record.id
        ? record.id
        : `account_tool_${index + 1}`;
    const input =
      record.input &&
      typeof record.input === "object" &&
      !Array.isArray(record.input)
        ? record.input as Record<string, unknown>
        : {};
    if (!name) {
      throw new Error("ACCOUNT_SESSION_TOOL_PROTOCOL_INVALID");
    }
    return {
      id,
      name,
      input
    };
  });
}

function buildAccountPrompt(
  params: ProviderStreamParams,
  toolTranscript: string[]
): string {
  const messages = params.messages
    .map((message) =>
      `${message.role.toUpperCase()}:\n${message.content}`
    )
    .join("\n\n");

  const toolSchemas =
    params.tools?.length
      ? JSON.stringify(
          params.tools.map((tool) => ({
            name: tool.function.name,
            description: tool.function.description,
            parameters: tool.function.parameters
          }))
        )
      : "[]";

  const toolProtocol = params.tools?.length
    ? [
        "Lex Machina runtime tools are available only through the protocol below.",
        "Do not use any local CLI, filesystem, shell, browser, web-search, plugin or MCP tools.",
        "If a Lex runtime tool is required, output ONLY one line beginning with:",
        `${TOOL_SENTINEL}{"calls":[{"id":"call_1","name":"tool_name","input":{}}]}`,
        "Use only tool names listed in LEX_RUNTIME_TOOLS.",
        "After tool results are supplied, continue the task. When no more tools are needed, return the final answer normally.",
        `LEX_RUNTIME_TOOLS=${toolSchemas}`
      ].join("\n")
    : [
        "No Lex runtime tools are available for this turn.",
        "Do not use any local CLI, filesystem, shell, browser, web-search, plugin or MCP tools."
      ].join("\n");

  return [
    "You are the semantic model inside Lex Machina.",
    "The application, not this CLI, owns privacy gates, legal-source verification and tool execution.",
    toolProtocol,
    "",
    "SYSTEM:",
    params.systemPrompt,
    "",
    "CONVERSATION:",
    messages,
    ...(toolTranscript.length
      ? [
          "",
          "LEX_RUNTIME_TOOL_TRANSCRIPT:",
          toolTranscript.join("\n\n")
        ]
      : []),
    "",
    "Continue the conversation now."
  ].join("\n");
}

export class AccountSessionManager {
  private readonly takeovers =
    new Map<
      ProviderId,
      AccountSessionTakeover
    >();

  private withTakeover(
    status: Omit<
      ProviderAccountSessionStatus,
      | "takeoverSupported"
      | "takeoverActive"
      | "takeoverMode"
      | "takeoverReference"
      | "takeoverHint"
    >
  ): ProviderAccountSessionStatus {
    const takeover =
      this.takeovers.get(
        status.provider
      );
    return {
      ...status,
      takeoverSupported:
        true,
      takeoverActive:
        status.authenticated &&
        Boolean(takeover),
      ...(status.authenticated &&
      takeover
        ? {
            takeoverMode:
              takeover.mode,
            takeoverReference:
              takeover.displayReference
          }
        : {}),
      takeoverHint:
        takeoverHint(
          status.provider
        )
    };
  }

  async status(
    provider: ProviderId
  ): Promise<ProviderAccountSessionStatus> {
    const command = CLI_NAMES[provider];
    const executable = await resolveCommand(command);
    if (!executable) {
      return this.withTakeover({
        provider,
        command,
        installed: false,
        authenticated: false,
        installHint: installHint(provider)
      });
    }

    let result: RunResult;
    try {
      if (provider === "openai") {
        result = await runCli(
          provider,
          ["login", "status"],
          undefined,
          STATUS_TIMEOUT_MS
        );
      } else if (provider === "anthropic") {
        result = await runCli(
          provider,
          ["auth", "status"],
          undefined,
          STATUS_TIMEOUT_MS
        );
      } else {
        const workDir =
          await fsp.mkdtemp(
            path.join(
              os.tmpdir(),
              "lex-grok-auth-"
            )
          );
        try {
          const probe =
            await runGrokAcp(
              null,
              workDir
            );
          result = {
            code:
              probe.authenticated
                ? 0
                : 1,
            stdout:
              "",
            stderr:
              ""
          };
        } finally {
          await fsp.rm(
            workDir,
            {
              recursive:
                true,
              force:
                true
            }
          ).catch(
            () => {}
          );
        }
      }
    } catch {
      result = {
        code: 1,
        stdout: "",
        stderr: ""
      };
    }

    const authenticated =
      provider === "openai"
        ? openAiChatGptAuthenticated(
            result
          )
        : provider ===
            "anthropic"
          ? claudeSubscriptionAuthenticated(
              result
            )
          : result.code === 0;

    return this.withTakeover({
      provider,
      command,
      installed: true,
      authenticated,
      installHint: installHint(provider)
    });
  }

  async statusAll(): Promise<ProviderAccountSessionStatus[]> {
    return Promise.all(
      (["openai", "anthropic", "xai"] as const)
        .map((provider) => this.status(provider))
    );
  }

  async login(
    provider: ProviderId
  ): Promise<ProviderAccountSessionStatus> {
    this.takeovers.delete(
      provider
    );
    const args =
      provider === "openai"
        ? ["login"]
        : provider === "anthropic"
          ? ["auth", "login"]
          : ["login"];
    const result = await runCli(
      provider,
      args,
      undefined,
      AUTH_TIMEOUT_MS
    );
    if (result.code !== 0) {
      throw normalizeCliFailure(provider, result);
    }
    return this.status(provider);
  }

  async takeover(
    provider: ProviderId,
    sessionRef?: string
  ): Promise<ProviderAccountSessionStatus> {
    const status =
      await this.status(
        provider
      );
    if (!status.installed) {
      throw new Error(
        `ACCOUNT_SESSION_CLI_NOT_INSTALLED:${provider}`
      );
    }
    if (!status.authenticated) {
      throw new Error(
        `ACCOUNT_SESSION_NOT_AUTHENTICATED:${provider}`
      );
    }

    const requested =
      normalizeTakeoverReference(
        sessionRef
      );
    let reference:
      string;
    let displayReference:
      string;
    let mode:
      ProviderAccountSessionTakeoverMode;

    if (requested) {
      reference =
        requested;
      displayReference =
        requested.length > 96
          ? requested.slice(
              0,
              93
            ) + "..."
          : requested;
      mode =
        "EXPLICIT";
    } else if (
      provider ===
        "openai"
    ) {
      reference =
        "__LAST__";
      displayReference =
        "ostatnia sesja Codex";
      mode =
        "LAST";
    } else if (
      provider ===
        "anthropic"
    ) {
      const latest =
        await latestClaudeTranscript();
      if (!latest) {
        throw new Error(
          "ACCOUNT_SESSION_NO_RESUMABLE_SESSION:anthropic"
        );
      }
      reference =
        latest;
      displayReference =
        "najnowsza sesja Claude Code";
      mode =
        "LAST";
    } else {
      throw new Error(
        "ACCOUNT_SESSION_REFERENCE_REQUIRED:xai"
      );
    }

    this.takeovers.set(
      provider,
      {
        reference,
        displayReference,
        mode
      }
    );
    return this.status(
      provider
    );
  }

  async releaseTakeover(
    provider: ProviderId
  ): Promise<ProviderAccountSessionStatus> {
    this.takeovers.delete(
      provider
    );
    return this.status(
      provider
    );
  }

  async runText(
    provider: ProviderId,
    prompt: string,
    abortSignal?: AbortSignal
  ): Promise<string> {
    const workDir = await fsp.mkdtemp(
      path.join(os.tmpdir(), "lex-account-session-")
    );
    try {
      let result: RunResult;
      if (
        provider === "openai" ||
        provider === "anthropic"
      ) {
        await assertSubscriptionAccount(
          provider,
          abortSignal
        );
      }

      const takeover =
        this.takeovers.get(
          provider
        );

      if (provider === "openai") {
        const outputPath =
          path.join(workDir, "last-message.txt");
        const baseArgs = [
          "exec",
          "--ignore-user-config",
          "--sandbox",
          "read-only",
          "--skip-git-repo-check",
          "--cd",
          workDir,
          "--output-last-message",
          outputPath
        ];
        const takeoverArgs =
          takeover
            ? [
                ...baseArgs,
                "resume",
                ...(takeover.reference ===
                "__LAST__"
                  ? ["--last"]
                  : [
                      takeover.reference
                    ]),
                "-"
              ]
            : [
                ...baseArgs,
                "--ephemeral",
                "-"
              ];

        result = await runCli(
          provider,
          takeoverArgs,
          prompt,
          COMMAND_TIMEOUT_MS,
          workDir,
          abortSignal
        );

        if (
          result.code !== 0 &&
          takeover?.mode ===
            "LAST"
        ) {
          this.takeovers.delete(
            provider
          );
          result =
            await runCli(
              provider,
              [
                ...baseArgs,
                "--ephemeral",
                "-"
              ],
              prompt,
              COMMAND_TIMEOUT_MS,
              workDir,
              abortSignal
            );
        }

        if (result.code !== 0) {
          throw normalizeCliFailure(provider, result);
        }
        try {
          const finalText =
            await fsp.readFile(outputPath, "utf8");
          if (finalText.trim()) {
            return finalText.trim();
          }
        } catch {
          // Fall back to stdout below.
        }
      } else if (provider === "anthropic") {
        const fixedQuery =
          "Treat all piped stdin content as the complete Lex Machina request. Follow that request and return only the requested response. Do not access local files or use local tools.";
        const freshArgs = [
          "-p",
          fixedQuery,
          "--output-format",
          "text",
          "--bare",
          "--disallowedTools",
          "*",
          "--no-session-persistence"
        ];
        const takeoverArgs =
          takeover
            ? [
                "--resume",
                takeover.reference,
                "-p",
                fixedQuery,
                "--output-format",
                "text",
                "--bare",
                "--disallowedTools",
                "*"
              ]
            : freshArgs;

        result = await runCli(
          provider,
          takeoverArgs,
          prompt,
          COMMAND_TIMEOUT_MS,
          workDir,
          abortSignal
        );

        if (
          result.code !== 0 &&
          takeover?.mode ===
            "LAST"
        ) {
          this.takeovers.delete(
            provider
          );
          result =
            await runCli(
              provider,
              freshArgs,
              prompt,
              COMMAND_TIMEOUT_MS,
              workDir,
              abortSignal
            );
        }

        if (result.code !== 0) {
          throw normalizeCliFailure(provider, result);
        }
      } else {
        const grok =
          await runGrokAcp(
            prompt,
            workDir,
            abortSignal,
            takeover?.reference
          );
        if (
          !grok.authenticated
        ) {
          throw new Error(
            "ACCOUNT_SESSION_NOT_AUTHENTICATED:xai"
          );
        }
        if (
          !grok.text
        ) {
          throw new Error(
            "ACCOUNT_SESSION_EMPTY_RESPONSE:xai"
          );
        }
        return grok.text;
      }

      const text = result.stdout.trim();
      if (!text) {
        throw new Error(
          `ACCOUNT_SESSION_EMPTY_RESPONSE:${provider}`
        );
      }
      return text;
    } finally {
      await fsp.rm(
        workDir,
        {
          recursive: true,
          force: true
        }
      ).catch(() => {});
    }
  }
}

export async function streamAccountSession(
  manager: AccountSessionManager,
  provider: ProviderId,
  params: ProviderStreamParams
): Promise<ProviderStreamResult> {
  const allowedTools = new Set(
    (params.tools ?? [])
      .map((tool) => tool.function.name)
  );
  const toolTranscript: string[] = [];
  const maxIterations =
    Math.max(
      1,
      Math.min(
        params.maxIterations ?? 10,
        12
      )
    );

  for (
    let iteration = 0;
    iteration < maxIterations;
    iteration += 1
  ) {
    const output = await manager.runText(
      provider,
      buildAccountPrompt(
        params,
        toolTranscript
      ),
      params.abortSignal
    );
    const calls =
      parseToolCalls(output);

    if (!calls) {
      params.callbacks?.onContentDelta?.(
        output
      );
      return {
        fullText: output
      };
    }

    if (
      calls.length === 0 ||
      !params.runTools
    ) {
      throw new Error(
        "ACCOUNT_SESSION_TOOL_PROTOCOL_UNAVAILABLE"
      );
    }
    for (const call of calls) {
      if (!allowedTools.has(call.name)) {
        throw new Error(
          `ACCOUNT_SESSION_UNKNOWN_TOOL:${call.name}`
        );
      }
      params.callbacks?.onToolCallStart?.(
        call
      );
    }

    const results =
      await params.runTools(calls);
    for (const call of calls) {
      const result =
        results.find(
          (item) =>
            item.tool_use_id ===
            call.id
        );
      if (!result) {
        throw new Error(
          `ACCOUNT_SESSION_TOOL_RESULT_MISSING:${call.id}`
        );
      }
      toolTranscript.push(
        [
          `TOOL_CALL ${call.id} ${call.name}`,
          JSON.stringify(call.input),
          `TOOL_RESULT ${call.id}`,
          result.content
        ].join("\n")
      );
    }
  }

  throw new Error(
    "ACCOUNT_SESSION_MAX_TOOL_ITERATIONS"
  );
}
