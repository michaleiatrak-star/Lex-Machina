import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
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

const ACCOUNT_SESSION_RESUME_MODE = "LAST_OR_NEW" as const;

export function accountSessionResumeMode(): typeof ACCOUNT_SESSION_RESUME_MODE {
  return ACCOUNT_SESSION_RESUME_MODE;
}

export function isMissingResumableSessionMessage(
  value: string
): boolean {
  const normalized = value
    .toLocaleLowerCase("en")
    .replace(/[\r\n]+/g, " ");
  return [
    "no session",
    "no saved session",
    "no previous session",
    "no resumable session",
    "no conversation",
    "no previous conversation",
    "unknown session",
    "session not found",
    "session does not exist",
    "no matching session",
    "conversation not found"
  ].some((needle) =>
    normalized.includes(needle)
  );
}

function accountSessionStateRoot(): string {
  const configured =
    process.env
      .LEX_ACCOUNT_SESSION_STATE_ROOT
      ?.trim();
  return configured
    ? path.resolve(configured)
    : path.resolve(
        os.homedir(),
        ".lex-machina",
        "account-sessions"
      );
}

function claudeSessionsRoot(): string {
  const configured =
    process.env
      .LEX_CLAUDE_SESSIONS_ROOT
      ?.trim();
  return configured
    ? path.resolve(configured)
    : path.resolve(
        os.homedir(),
        ".claude",
        "projects"
      );
}

export async function discoverLatestClaudeSessionId(): Promise<string | null> {
  let projects: Dirent[];
  try {
    projects =
      await fsp.readdir(
        claudeSessionsRoot(),
        {
          withFileTypes: true
        }
      );
  } catch {
    return null;
  }

  let best:
    | {
        id: string;
        mtimeMs: number;
      }
    | null = null;

  for (
    const project
    of projects
      .filter(
        (entry) =>
          entry.isDirectory()
      )
      .slice(0, 2_000)
  ) {
    const projectRoot =
      path.join(
        claudeSessionsRoot(),
        project.name
      );
    let entries: Dirent[];
    try {
      entries =
        await fsp.readdir(
          projectRoot,
          {
            withFileTypes: true
          }
        );
    } catch {
      continue;
    }

    for (
      const entry
      of entries.slice(0, 10_000)
    ) {
      if (
        !entry.isFile() ||
        !entry.name.endsWith(
          ".jsonl"
        )
      ) {
        continue;
      }
      const id =
        entry.name.slice(
          0,
          -".jsonl".length
        );
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id
        )
      ) {
        continue;
      }
      try {
        const stat =
          await fsp.stat(
            path.join(
              projectRoot,
              entry.name
            )
          );
        if (
          !best ||
          stat.mtimeMs >
            best.mtimeMs
        ) {
          best = {
            id,
            mtimeMs:
              stat.mtimeMs
          };
        }
      } catch {
        // A session may disappear during cleanup; skip it.
      }
    }
  }
  return best?.id ?? null;
}

function grokSessionsRoot(): string {
  const configured =
    process.env
      .LEX_GROK_SESSIONS_ROOT
      ?.trim();
  if (configured) {
    return path.resolve(
      configured
    );
  }
  const grokHome =
    process.env
      .GROK_HOME
      ?.trim();
  return grokHome
    ? path.resolve(
        grokHome,
        "sessions"
      )
    : path.resolve(
        os.homedir(),
        ".grok",
        "sessions"
      );
}

function uuidFromName(
  value: string
): string | null {
  const match =
    value.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    );
  return match?.[0] ?? null;
}

export async function discoverLatestGrokSessionId(): Promise<string | null> {
  const root =
    grokSessionsRoot();
  let best:
    | {
        id: string;
        mtimeMs: number;
      }
    | null = null;
  let visited = 0;

  const walk = async (
    current: string,
    depth: number
  ): Promise<void> => {
    if (
      depth > 4 ||
      visited >= 20_000
    ) {
      return;
    }
    let entries: Dirent[];
    try {
      entries =
        await fsp.readdir(
          current,
          {
            withFileTypes: true
          }
        );
    } catch {
      return;
    }

    for (
      const entry
      of entries
    ) {
      if (
        visited >= 20_000
      ) {
        return;
      }
      visited += 1;
      const fullPath =
        path.join(
          current,
          entry.name
        );
      const id =
        uuidFromName(
          entry.name
        );
      if (id) {
        try {
          const stat =
            await fsp.stat(
              fullPath
            );
          if (
            !best ||
            stat.mtimeMs >
              best.mtimeMs
          ) {
            best = {
              id,
              mtimeMs:
                stat.mtimeMs
            };
          }
        } catch {
          // Session entry can disappear during cleanup.
        }
      }
      if (
        entry.isDirectory()
      ) {
        await walk(
          fullPath,
          depth + 1
        );
      }
    }
  };

  await walk(
    root,
    0
  );
  const resolved =
    best as
      | {
          id: string;
          mtimeMs: number;
        }
      | null;
  return resolved?.id ?? null;
}

function continuityFingerprint(
  continuityKey: string
): string {
  return createHash("sha256")
    .update(
      continuityKey,
      "utf8"
    )
    .digest("hex")
    .slice(0, 24);
}

function accountSessionStatePath(
  provider: ProviderId,
  continuityKey?: string
): string {
  const suffix =
    continuityKey
      ? "-" +
        continuityFingerprint(
          continuityKey
        )
      : "";
  return path.join(
    accountSessionStateRoot(),
    provider +
      suffix +
      ".json"
  );
}

async function hasPinnedAccountSession(
  provider: ProviderId
): Promise<boolean> {
  try {
    const entries =
      await fsp.readdir(
        accountSessionStateRoot(),
        {
          withFileTypes: true
        }
      );
    return entries.some(
      (entry) =>
        entry.isFile() &&
        entry.name.startsWith(
          provider + "-"
        ) &&
        entry.name.endsWith(
          ".json"
        )
    );
  } catch {
    return false;
  }
}

async function readAccountSessionId(
  provider: ProviderId,
  continuityKey?: string
): Promise<string | null> {
  try {
    const raw =
      await fsp.readFile(
        accountSessionStatePath(
          provider,
          continuityKey
        ),
        "utf8"
      );
    const parsed =
      JSON.parse(raw) as {
        sessionId?: unknown;
      };
    if (
      typeof parsed.sessionId ===
        "string" &&
      /^[A-Za-z0-9_.:-]{8,256}$/.test(
        parsed.sessionId
      )
    ) {
      return parsed.sessionId;
    }
  } catch {
    // Missing or stale local continuity metadata is equivalent to no session.
  }
  return null;
}

async function writeAccountSessionId(
  provider: ProviderId,
  sessionId: string,
  continuityKey?: string
): Promise<void> {
  if (
    !/^[A-Za-z0-9_.:-]{8,256}$/.test(
      sessionId
    )
  ) {
    return;
  }
  const root =
    accountSessionStateRoot();
  await fsp.mkdir(
    root,
    {
      recursive: true
    }
  );
  await fsp.writeFile(
    accountSessionStatePath(
      provider,
      continuityKey
    ),
    JSON.stringify(
      {
        schemaVersion: 2,
        provider,
        sessionId,
        ...(continuityKey
          ? {
              continuityHash:
                continuityFingerprint(
                  continuityKey
                )
            }
          : {}),
        updatedAt:
          new Date().toISOString()
      },
      null,
      2
    ) + "\n",
    {
      encoding: "utf8",
      mode: 0o600
    }
  );
}

async function clearAccountSessionId(
  provider: ProviderId,
  continuityKey?: string
): Promise<void> {
  await fsp.rm(
    accountSessionStatePath(
      provider,
      continuityKey
    ),
    {
      force: true
    }
  ).catch(() => {});
}

function parseCodexThreadId(
  stdout: string
): string | null {
  for (
    const line
    of stdout.split(/\r?\n/)
  ) {
    try {
      const event =
        JSON.parse(line) as {
          type?: unknown;
          thread_id?: unknown;
        };
      if (
        event.type ===
          "thread.started" &&
        typeof event.thread_id ===
          "string" &&
        event.thread_id
      ) {
        return event.thread_id;
      }
    } catch {
      // Non-JSON lines are ignored.
    }
  }
  return null;
}

function parseCodexFinalText(
  stdout: string
): string | null {
  let finalText = "";
  for (
    const line
    of stdout.split(/\r?\n/)
  ) {
    try {
      const event =
        JSON.parse(line) as {
          type?: unknown;
          item?: unknown;
        };
      if (
        event.type !==
          "item.completed" ||
        !event.item ||
        typeof event.item !==
          "object" ||
        Array.isArray(event.item)
      ) {
        continue;
      }
      const item =
        event.item as
          Record<string, unknown>;
      if (
        item.type ===
          "agent_message" &&
        typeof item.text ===
          "string" &&
        item.text.trim()
      ) {
        finalText =
          item.text.trim();
      }
    } catch {
      // Non-JSON lines are ignored.
    }
  }
  return finalText || null;
}

function parseClaudeResult(
  stdout: string
): {
  text: string;
  sessionId: string | null;
} | null {
  try {
    const payload =
      JSON.parse(stdout) as {
        result?: unknown;
        session_id?: unknown;
      };
    const text =
      typeof payload.result ===
        "string"
        ? payload.result.trim()
        : "";
    if (!text) return null;
    const sessionId =
      typeof payload.session_id ===
        "string" &&
      payload.session_id
        ? payload.session_id
        : null;
    return {
      text,
      sessionId
    };
  } catch {
    return null;
  }
}

export type ProviderAccountSessionStatus = {
  provider: ProviderId;
  command: string;
  installed: boolean;
  authenticated: boolean;
  installHint: string;
  resumeMode: typeof ACCOUNT_SESSION_RESUME_MODE;
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

export function mergeWindowsCommandPath(
  currentPath: string | undefined,
  machinePath: string | undefined,
  userPath: string | undefined
): string {
  const seen =
    new Set<string>();
  const parts: string[] = [];
  for (
    const raw
    of [
      currentPath,
      machinePath,
      userPath
    ]
  ) {
    for (
      const item
      of (raw ?? "")
        .split(";")
        .map(
          (value) =>
            value.trim()
        )
        .filter(Boolean)
    ) {
      const key =
        item.toLocaleLowerCase(
          "en"
        );
      if (
        seen.has(key)
      ) {
        continue;
      }
      seen.add(key);
      parts.push(item);
    }
  }
  return parts.join(";");
}

async function commandLookupEnvironment():
  Promise<NodeJS.ProcessEnv> {
  if (
    process.platform !==
      "win32"
  ) {
    return process.env;
  }

  const command = [
    "$machine=[Environment]::GetEnvironmentVariable('Path','Machine')",
    "$user=[Environment]::GetEnvironmentVariable('Path','User')",
    "[Console]::Out.Write(($machine + [Environment]::NewLine + $user))"
  ].join(";");

  const result =
    await runDirect(
      "powershell.exe",
      [
        "-NoLogo",
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        command
      ],
      undefined,
      process.env,
      5_000
    ).catch(
      () => null
    );
  if (
    !result ||
    result.code !== 0
  ) {
    return process.env;
  }

  const [
    machinePath = "",
    userPath = ""
  ] =
    result.stdout.split(
      /\r?\n/,
      2
    );
  const pathKey =
    Object.keys(
      process.env
    ).find(
      (key) =>
        key.toLocaleLowerCase(
          "en"
        ) === "path"
    ) ?? "Path";
  const refreshedPath =
    mergeWindowsCommandPath(
      process.env[pathKey],
      machinePath,
      userPath
    );

  return {
    ...process.env,
    [pathKey]:
      refreshedPath
  };
}

async function resolveCommand(command: string): Promise<string | null> {
  const probe = process.platform === "win32" ? "where.exe" : "which";
  const env =
    await commandLookupEnvironment();
  const result = await runDirect(
    probe,
    [command],
    undefined,
    env,
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

export function accountLoginLaunchMode(
  provider: ProviderId,
  platform = process.platform
): "CAPTURED" | "VISIBLE_TERMINAL" {
  return platform === "win32"
    ? "VISIBLE_TERMINAL"
    : "CAPTURED";
}

export function accountLoginArgs(
  provider: ProviderId
): string[] {
  if (provider === "openai") {
    return ["login"];
  }
  if (provider === "anthropic") {
    // Current Claude Code treats the default auth login as the subscription
    // lane. --console is the explicit API-billing opt-in. Avoid relying on
    // historical --claudeai flag availability across client versions.
    return [
      "auth",
      "login"
    ];
  }
  return ["login"];
}

export function visibleWindowsLoginLauncher(
  scriptPath: string
): string {
  const escapedScriptPath =
    scriptPath.replace(
      /'/g,
      "''"
    );
  return [
    "$ErrorActionPreference = 'Stop'",
    "$cmd = $env:ComSpec",
    `$script = '${escapedScriptPath}'`,
    "$argLine = '/d /s /c ' + [char]34 + $script + [char]34",
    "$process = Start-Process -FilePath $cmd -ArgumentList $argLine -WindowStyle Normal -PassThru -Wait",
    "exit $process.ExitCode"
  ].join("\r\n");
}

async function runVisibleWindowsLogin(
  provider: ProviderId,
  args: string[],
  timeoutMs: number
): Promise<RunResult> {
  const command =
    CLI_NAMES[provider];
  const executable =
    await resolveCommand(
      command
    );
  if (!executable) {
    throw new Error(
      `ACCOUNT_SESSION_CLI_NOT_INSTALLED:${provider}`
    );
  }

  const root =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "lex-account-login-"
      )
    );
  const scriptPath =
    path.join(
      root,
      "login.cmd"
    );
  const argumentLine =
    args
      .map(cmdQuote)
      .join(" ");
  const loginLabel =
    provider === "openai"
      ? "Codex / ChatGPT"
      : provider === "anthropic"
        ? "Claude Code"
        : "Grok Build";
  const loginCommand =
    /\.(cmd|bat)$/i.test(
      executable
    )
      ? `call ${cmdQuote(executable)} ${argumentLine}`
      : `${cmdQuote(executable)} ${argumentLine}`;

  await fsp.writeFile(
    scriptPath,
    [
      "@echo off",
      "setlocal",
      `title Lex Machina - ${loginLabel} login`,
      `echo Lex Machina otworzy logowanie: ${loginLabel}.`,
      "echo Dokoncz oficjalne logowanie w przegladarce i wroc do tego okna, jesli klient poprosi o kod.",
      "echo.",
      loginCommand,
      "set \"LEX_EXIT=%ERRORLEVEL%\"",
      "echo.",
      `if not "%LEX_EXIT%"=="0" echo Logowanie ${loginLabel} nie powiodlo sie. Kod: %LEX_EXIT%`,
      "exit /b %LEX_EXIT%"
    ].join("\r\n"),
    "utf8"
  );

  const launcherPath =
    path.join(
      root,
      "launcher.ps1"
    );
  await fsp.writeFile(
    launcherPath,
    visibleWindowsLoginLauncher(
      scriptPath
    ),
    "utf8"
  );

  try {
    return await runDirect(
      "powershell.exe",
      [
        "-NoLogo",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        launcherPath
      ],
      undefined,
      accountEnvironment(
        provider
      ),
      timeoutMs
    );
  } finally {
    await fsp.rm(
      root,
      {
        recursive: true,
        force: true
      }
    ).catch(() => {});
  }
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

export function claudeSubscriptionAuthenticated(
  result: RunResult
): boolean {
  if (result.code !== 0) {
    return false;
  }

  const combined =
    (result.stdout + "\n" + result.stderr)
      .trim();
  const lower =
    combined.toLowerCase();

  // Never treat Console/API, credentials-file or cloud-provider auth as the
  // subscription lane. The account transport must not silently become API
  // billing just because Claude Code can execute a prompt.
  const explicitlyNonSubscription =
    [
      "credentials-file",
      "anthropic console",
      "api key",
      "api_key",
      "bedrock",
      "vertex",
      "foundry"
    ].some((needle) =>
      lower.includes(needle)
    );
  if (explicitlyNonSubscription) {
    return false;
  }

  const jsonStart =
    combined.indexOf("{");
  const jsonEnd =
    combined.lastIndexOf("}");
  if (
    jsonStart >= 0 &&
    jsonEnd > jsonStart
  ) {
    try {
      const payload =
        JSON.parse(
          combined.slice(
            jsonStart,
            jsonEnd + 1
          )
        ) as {
          loggedIn?: unknown;
          authMethod?: unknown;
          apiProvider?: unknown;
          apiKeySource?: unknown;
          subscriptionType?: unknown;
        };
      if (payload.loggedIn !== true) {
        return false;
      }

      const provider =
        typeof payload.apiProvider ===
          "string"
          ? payload.apiProvider
              .toLowerCase()
          : "";
      const method =
        typeof payload.authMethod ===
          "string"
          ? payload.authMethod
              .toLowerCase()
          : "";
      const keySource =
        typeof payload.apiKeySource ===
          "string"
          ? payload.apiKeySource
              .toLowerCase()
          : "";
      const subscription =
        typeof payload.subscriptionType ===
          "string"
          ? payload.subscriptionType
              .toLowerCase()
          : "";

      if (
        provider &&
        provider !== "firstparty" &&
        provider !== "first_party"
      ) {
        return false;
      }
      if (
        [
          "api_key",
          "api-key",
          "bedrock",
          "vertex",
          "foundry"
        ].includes(method)
      ) {
        return false;
      }

      return (
        method === "claude.ai" ||
        method === "oauth_token" ||
        method === "oauth" ||
        method === "subscription" ||
        keySource.includes(
          "/login managed key"
        ) ||
        subscription === "pro" ||
        subscription === "max" ||
        subscription.includes(
          "claude"
        )
      );
    } catch {
      // Some Claude Code versions use human-readable output. Fall through to
      // the conservative text parser below.
    }
  }

  return (
    lower.includes(
      "login method: claude max account"
    ) ||
    lower.includes(
      "login method: claude pro account"
    ) ||
    lower.includes(
      "login method: claude.ai"
    ) ||
    (
      lower.includes(
        "logged in"
      ) &&
      (
        lower.includes(
          "claude.ai"
        ) ||
        lower.includes(
          "oauth_token"
        ) ||
        lower.includes(
          "oauth token"
        )
      )
    )
  );
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

  let authenticated =
    provider === "openai"
      ? openAiChatGptAuthenticated(
          result
        )
      : claudeSubscriptionAuthenticated(
          result
        );

  if (
    provider === "anthropic" &&
    !authenticated
  ) {
    const textStatus =
      await runCli(
        provider,
        [
          "auth",
          "status",
          "--text"
        ],
        undefined,
        STATUS_TIMEOUT_MS,
        undefined,
        abortSignal
      );
    authenticated =
      claudeSubscriptionAuthenticated(
        textStatus
      );
  }

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
  resumeSessionId?: string | null
): Promise<{
  authenticated: boolean;
  text?: string;
  sessionId?: string;
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
        "--system-prompt-override",
        "You are the semantic model inside Lex Machina. Lex Machina owns privacy gates, legal-source verification and all tool execution. Current Lex Machina instructions override prior host-session instructions. Do not access local files, external services or host tools.",
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
        sessionId?: string;
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

      const agentCapabilities =
        init.agentCapabilities &&
        typeof init.agentCapabilities ===
          "object" &&
        !Array.isArray(
          init.agentCapabilities
        )
          ? init.agentCapabilities as
              Record<string, unknown>
          : null;
      const supportsSessionLoad =
        agentCapabilities
          ?.loadSession === true;

      let sessionId = "";
      if (
        resumeSessionId &&
        supportsSessionLoad
      ) {
        try {
          await request(
            "session/load",
            {
              sessionId:
                resumeSessionId,
              cwd,
              mcpServers:
                []
            },
            STATUS_TIMEOUT_MS
          );
          sessionId =
            resumeSessionId;
          text = "";
        } catch {
          // Older ACP builds or stale IDs fall back to a fresh session.
          sessionId = "";
        }
      }

      if (!sessionId) {
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
      }
      if (!sessionId) {
        throw new Error(
          "ACCOUNT_SESSION_ACP_SESSION_INVALID"
        );
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
          finalText,
        sessionId
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
    "A resumed host session is continuity context only. Never reuse, reveal or infer facts from earlier host-session turns unless those facts are also present in the current Lex Machina request.",
    "Current Lex Machina system instructions and conversation override any earlier host-session instructions.",
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
        installHint: installHint(provider),
        resumeMode: accountSessionResumeMode()
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
        if (
          !claudeSubscriptionAuthenticated(
            result
          )
        ) {
          const textStatus =
            await runCli(
              provider,
              [
                "auth",
                "status",
                "--text"
              ],
              undefined,
              STATUS_TIMEOUT_MS
            );
          if (
            claudeSubscriptionAuthenticated(
              textStatus
            )
          ) {
            result =
              textStatus;
          }
        }
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

    return {
      provider,
      command,
      installed: true,
      authenticated,
      installHint: installHint(provider),
      resumeMode: accountSessionResumeMode()
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
    const current =
      await this.status(
        provider
      );
    if (
      current.installed &&
      current.authenticated
    ) {
      return current;
    }

    const args =
      accountLoginArgs(
        provider
      );
    const result =
      accountLoginLaunchMode(
        provider
      ) ===
        "VISIBLE_TERMINAL"
        ? await runVisibleWindowsLogin(
            provider,
            args,
            AUTH_TIMEOUT_MS
          )
        : await runCli(
            provider,
            args,
            undefined,
            AUTH_TIMEOUT_MS
          );
    if (result.code !== 0) {
      throw normalizeCliFailure(provider, result);
    }
    const status =
      await this.status(
        provider
      );
    if (!status.authenticated) {
      throw new Error(
        `ACCOUNT_SESSION_NOT_SUBSCRIPTION_AUTH:${provider}`
      );
    }
    return status;
  }

  async runText(
    provider: ProviderId,
    prompt: string,
    abortSignal?: AbortSignal,
    continuityKey?: string
  ): Promise<string> {
    const workDir = await fsp.mkdtemp(
      path.join(os.tmpdir(), "lex-account-session-")
    );
    const allowExternalTakeover =
      !continuityKey ||
      !await hasPinnedAccountSession(
        provider
      );
    try {
      if (
        provider === "openai" ||
        provider === "anthropic"
      ) {
        await assertSubscriptionAccount(
          provider,
          abortSignal
        );
      }

      if (provider === "openai") {
        const outputPath =
          path.join(
            workDir,
            "last-message.txt"
          );
        const commonArgs = [
          "exec",
          "--ignore-user-config",
          "--ignore-rules",
          "--config",
          "mcp_servers={}",
          "--config",
          "features.plugins=false",
          "--config",
          "features.shell_tool=false",
          "--config",
          "features.unified_exec=false",
          "--config",
          "features.multi_agent=false",
          "--config",
          "features.apps=false",
          "--config",
          "features.hooks=false",
          "--config",
          "features.remote_plugin=false",
          "--config",
          "web_search=\"disabled\"",
          "--config",
          "tools.view_image=false",
          "--sandbox",
          "read-only",
          "--skip-git-repo-check",
          "--cd",
          workDir,
          "--json",
          "--output-last-message",
          outputPath
        ];
        const runCodex = (
          tail: string[]
        ) =>
          runCli(
            provider,
            [
              ...commonArgs,
              ...tail
            ],
            prompt,
            COMMAND_TIMEOUT_MS,
            workDir,
            abortSignal
          );

        let result:
          RunResult | null = null;
        const savedSessionId =
          await readAccountSessionId(
            provider,
            continuityKey
          );
        if (savedSessionId) {
          result =
            await runCodex([
              "resume",
              savedSessionId,
              "-"
            ]);
          if (
            result.code !== 0
          ) {
            const detail =
              result.stderr +
              "\n" +
              result.stdout;
            if (
              isMissingResumableSessionMessage(
                detail
              )
            ) {
              await clearAccountSessionId(
                provider,
                continuityKey
              );
              result = null;
            } else {
              throw normalizeCliFailure(
                provider,
                result
              );
            }
          }
        }

        if (
          !result &&
          allowExternalTakeover
        ) {
          const last =
            await runCodex([
              "resume",
              "--last",
              "--all",
              "-"
            ]);
          if (
            last.code === 0
          ) {
            result = last;
          } else {
            const detail =
              last.stderr +
              "\n" +
              last.stdout;
            if (
              !isMissingResumableSessionMessage(
                detail
              )
            ) {
              throw normalizeCliFailure(
                provider,
                last
              );
            }
          }
        }
        if (!result) {
          result =
            await runCodex([
              "-"
            ]);
        }

        if (result.code !== 0) {
          throw normalizeCliFailure(
            provider,
            result
          );
        }
        const threadId =
          parseCodexThreadId(
            result.stdout
          );
        if (threadId) {
          await writeAccountSessionId(
            provider,
            threadId,
            continuityKey
          );
        }

        try {
          const finalText =
            await fsp.readFile(
              outputPath,
              "utf8"
            );
          if (finalText.trim()) {
            return finalText.trim();
          }
        } catch {
          // Fall through to JSONL parsing.
        }
        const finalText =
          parseCodexFinalText(
            result.stdout
          );
        if (finalText) {
          return finalText;
        }
        throw new Error(
          "ACCOUNT_SESSION_EMPTY_RESPONSE:openai"
        );
      }

      if (
        provider ===
          "anthropic"
      ) {
        const fixedQuery =
          "Treat all piped stdin content as the complete Lex Machina request and return only the requested response.";
        const lexSystemPrompt =
          "You are the semantic model inside Lex Machina. Lex Machina owns privacy gates, legal-source verification and all tool execution. Current Lex Machina instructions override prior host-session instructions. A resumed host session is continuity context only: never reuse, reveal or infer facts from earlier host turns unless those facts are also present in the current Lex Machina request. Do not access local files, external services or tools.";
        const commonArgs = [
          "-p",
          fixedQuery,
          "--output-format",
          "json",
          "--bare",
          "--restricted",
          "--tools",
          "",
          "--disallowedTools",
          "mcp__*",
          "--system-prompt",
          lexSystemPrompt,
          "--system-prompt-snapshot",
          "off"
        ];
        const hostCwd =
          process.cwd();
        const runClaude = (
          tail: string[]
        ) =>
          runCli(
            provider,
            [
              ...commonArgs,
              ...tail
            ],
            prompt,
            COMMAND_TIMEOUT_MS,
            hostCwd,
            abortSignal
          );

        let result:
          RunResult | null = null;
        const savedSessionId =
          await readAccountSessionId(
            provider,
            continuityKey
          );
        if (savedSessionId) {
          result =
            await runClaude([
              "--resume",
              savedSessionId
            ]);
          if (
            result.code !== 0
          ) {
            const detail =
              result.stderr +
              "\n" +
              result.stdout;
            if (
              isMissingResumableSessionMessage(
                detail
              )
            ) {
              await clearAccountSessionId(
                provider,
                continuityKey
              );
              result = null;
            } else {
              throw normalizeCliFailure(
                provider,
                result
              );
            }
          }
        }

        if (
          !result &&
          allowExternalTakeover
        ) {
          const last =
            await runClaude([
              "--continue"
            ]);
          if (
            last.code === 0
          ) {
            result = last;
          } else {
            const detail =
              last.stderr +
              "\n" +
              last.stdout;
            if (
              !isMissingResumableSessionMessage(
                detail
              )
            ) {
              throw normalizeCliFailure(
                provider,
                last
              );
            }
            const discoveredSessionId =
              await discoverLatestClaudeSessionId();
            if (
              discoveredSessionId
            ) {
              const discovered =
                await runClaude([
                  "--resume",
                  discoveredSessionId
                ]);
              if (
                discovered.code === 0
              ) {
                result =
                  discovered;
              } else {
                const discoveredDetail =
                  discovered.stderr +
                  "\n" +
                  discovered.stdout;
                if (
                  !isMissingResumableSessionMessage(
                    discoveredDetail
                  )
                ) {
                  throw normalizeCliFailure(
                    provider,
                    discovered
                  );
                }
              }
            }
          }
        }
        if (!result) {
          result =
            await runClaude([]);
        }

        if (result.code !== 0) {
          throw normalizeCliFailure(
            provider,
            result
          );
        }
        const parsed =
          parseClaudeResult(
            result.stdout
          );
        if (!parsed) {
          throw new Error(
            "ACCOUNT_SESSION_EMPTY_RESPONSE:anthropic"
          );
        }
        if (parsed.sessionId) {
          await writeAccountSessionId(
            provider,
            parsed.sessionId,
            continuityKey
          );
        }
        return parsed.text;
      }

      const savedSessionId =
        await readAccountSessionId(
          provider,
          continuityKey
        );
      const resumeSessionId =
        savedSessionId ??
        (
          allowExternalTakeover
            ? await discoverLatestGrokSessionId()
            : null
        );
      const grok =
        await runGrokAcp(
          prompt,
          workDir,
          abortSignal,
          resumeSessionId
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
      if (grok.sessionId) {
        await writeAccountSessionId(
          provider,
          grok.sessionId,
          continuityKey
        );
      }
      return grok.text;
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
      params.abortSignal,
      params.continuityKey
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
