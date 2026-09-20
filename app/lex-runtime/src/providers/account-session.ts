import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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

export type ProviderAccountSessionStatus = {
  provider: ProviderId;
  command: string;
  installed: boolean;
  authenticated: boolean;
  installHint: string;
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
  async status(
    provider: ProviderId
  ): Promise<ProviderAccountSessionStatus> {
    const command = CLI_NAMES[provider];
    const executable = await resolveCommand(command);
    if (!executable) {
      return {
        provider,
        command,
        installed: false,
        authenticated: false,
        installHint: installHint(provider)
      };
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
        result = await runCli(
          provider,
          ["models"],
          undefined,
          STATUS_TIMEOUT_MS
        );
      }
    } catch {
      result = {
        code: 1,
        stdout: "",
        stderr: ""
      };
    }

    return {
      provider,
      command,
      installed: true,
      authenticated: result.code === 0,
      installHint: installHint(provider)
    };
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
      if (provider === "openai") {
        const outputPath =
          path.join(workDir, "last-message.txt");
        result = await runCli(
          provider,
          [
            "exec",
            "--ephemeral",
            "--ignore-user-config",
            "--sandbox",
            "read-only",
            "--skip-git-repo-check",
            "--cd",
            workDir,
            "--output-last-message",
            outputPath,
            "-"
          ],
          prompt,
          COMMAND_TIMEOUT_MS,
          workDir,
          abortSignal
        );
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
        result = await runCli(
          provider,
          [
            "-p",
            fixedQuery,
            "--output-format",
            "text",
            "--bare",
            "--disallowedTools",
            "*",
            "--no-session-persistence"
          ],
          prompt,
          COMMAND_TIMEOUT_MS,
          workDir,
          abortSignal
        );
        if (result.code !== 0) {
          throw normalizeCliFailure(provider, result);
        }
      } else {
        result = await runCli(
          provider,
          [
            "--no-auto-update",
            "-p",
            prompt,
            "--output-format",
            "plain",
            "--cwd",
            workDir,
            "--permission-mode",
            "dontAsk",
            "--disallowed-tools",
            "*",
            "--sandbox",
            "strict",
            "--no-subagents",
            "--no-memory",
            "--disable-web-search"
          ],
          undefined,
          COMMAND_TIMEOUT_MS,
          workDir,
          abortSignal
        );
        if (result.code !== 0) {
          throw normalizeCliFailure(provider, result);
        }
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
