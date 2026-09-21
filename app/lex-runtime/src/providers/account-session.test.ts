import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  accountLoginArgs,
  accountLoginLaunchMode,
  accountSessionModelId,
  accountSessionResumeMode,
  claudeAutomationCredentialMode,
  claudeSubscriptionAuthenticated,
  classifyAccountCliFailureDetail,
  codexExecArgs,
  discoverLatestClaudeSessionId,
  isAccountSessionModel,
  isMissingResumableSessionMessage,
  mergeWindowsCommandPath,
  visibleWindowsLoginLauncher
} from "./account-session.js";

const cleanupRoots: string[] = [];

afterEach(() => {
  delete process.env.LEX_CLAUDE_SESSIONS_ROOT;
  for (
    const root
    of cleanupRoots.splice(0)
  ) {
    fs.rmSync(
      root,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe("provider account-session transport", () => {
  it("uses isolated pseudo-model ids for each account lane", () => {
    expect(
      accountSessionModelId(
        "openai"
      )
    ).toBe(
      "account/openai/default"
    );
    expect(
      accountSessionModelId(
        "anthropic"
      )
    ).toBe(
      "account/anthropic/default"
    );
    expect(
      accountSessionModelId(
        "xai"
      )
    ).toBe(
      "account/xai/default"
    );
  });


  it("keeps Lex conversation context authoritative for every account provider", () => {
    for (
      const provider
      of [
        "openai",
        "anthropic",
        "xai"
      ] as const
    ) {
      expect(
        accountSessionResumeMode(
          provider
        )
      ).toBe(
        "LEX_CONTEXT_ONLY"
      );
    }
  });

  it("pins Codex account execution to a ChatGPT-compatible model and isolated ephemeral config", () => {
    const args =
      codexExecArgs(
        "C:\\Lex Work",
        "C:\\Lex Work\\last.txt"
      );

    expect(args).toContain(
      "--ephemeral"
    );
    expect(args).toContain(
      "gpt-5.6-luna"
    );
    expect(args).toContain(
      "--ignore-user-config"
    );
    expect(args).toContain(
      "mcp_servers={}"
    );
    expect(
      args.some(
        (value) =>
          value.startsWith(
            "features."
          )
      )
    ).toBe(false);
  });

  it("maps Codex CLI failures to actionable account-session reasons", () => {
    expect(
      classifyAccountCliFailureDetail(
        "The 'gpt-6-astra' model is not supported when using Codex with a ChatGPT account."
      )
    ).toBe(
      "ACCOUNT_SESSION_MODEL_UNSUPPORTED"
    );
    expect(
      classifyAccountCliFailureDetail(
        "HTTP 401 unauthorized; login required"
      )
    ).toBe(
      "ACCOUNT_SESSION_AUTH_EXPIRED"
    );
    expect(
      classifyAccountCliFailureDetail(
        "error: unrecognized option '--legacy-flag'"
      )
    ).toBe(
      "ACCOUNT_SESSION_CLI_INCOMPATIBLE"
    );
  });

  it("uses current interactive login commands for account providers", () => {
    expect(
      accountLoginArgs(
        "openai"
      )
    ).toEqual([
      "login"
    ]);
    expect(
      accountLoginArgs(
        "anthropic"
      )
    ).toEqual([
      "auth",
      "login"
    ]);
    expect(
      accountLoginArgs(
        "xai"
      )
    ).toEqual([
      "login"
    ]);
  });

  it("launches Claude subscription OAuth in a visible Windows terminal", () => {
    expect(
      accountLoginLaunchMode(
        "anthropic",
        "win32"
      )
    ).toBe(
      "VISIBLE_TERMINAL"
    );
    expect(
      accountLoginLaunchMode(
        "openai",
        "win32"
      )
    ).toBe(
      "VISIBLE_TERMINAL"
    );
    expect(
      accountLoginLaunchMode(
        "xai",
        "win32"
      )
    ).toBe(
      "VISIBLE_TERMINAL"
    );
    expect(
      accountLoginLaunchMode(
        "anthropic",
        "linux"
      )
    ).toBe(
      "CAPTURED"
    );
  });

  it("merges refreshed Windows PATH entries without losing the running process path", () => {
    expect(
      mergeWindowsCommandPath(
        "C:\\Lex\\Runtime;C:\\Windows\\System32",
        "C:\\Windows\\System32;C:\\Program Files\\Node",
        "C:\\Users\\Tester\\.local\\bin;C:\\Users\\Tester\\AppData\\Roaming\\npm"
      )
    ).toBe(
      "C:\\Lex\\Runtime;C:\\Windows\\System32;C:\\Program Files\\Node;C:\\Users\\Tester\\.local\\bin;C:\\Users\\Tester\\AppData\\Roaming\\npm"
    );
  });

  it("creates a normal visible Windows console for interactive account login", () => {
    const launcher =
      visibleWindowsLoginLauncher(
        "C:\\Users\\Tester\\login.cmd"
      );
    expect(
      launcher
    ).toContain(
      "Start-Process"
    );
    expect(
      launcher
    ).toContain(
      "-WindowStyle Normal"
    );
    expect(
      launcher
    ).toContain(
      "-PassThru -Wait"
    );
  });

  it("falls back to a new host session only for missing-session failures", () => {
    expect(
      isMissingResumableSessionMessage(
        "No saved session found"
      )
    ).toBe(true);
    expect(
      isMissingResumableSessionMessage(
        "conversation not found"
      )
    ).toBe(true);
    expect(
      isMissingResumableSessionMessage(
        "network connection failed"
      )
    ).toBe(false);
  });

  it("distinguishes Claude setup-token and refresh-token automation credentials from interactive login", () => {
    expect(
      claudeAutomationCredentialMode({
        CLAUDE_CODE_OAUTH_TOKEN:
          "oauth-access-token"
      })
    ).toBe(
      "ACCESS_TOKEN"
    );
    expect(
      claudeAutomationCredentialMode({
        CLAUDE_CODE_OAUTH_REFRESH_TOKEN:
          "oauth-refresh-token",
        CLAUDE_CODE_OAUTH_SCOPES:
          "user:profile user:inference user:sessions:claude_code"
      })
    ).toBe(
      "REFRESH_TOKEN"
    );
    expect(
      claudeAutomationCredentialMode({})
    ).toBe(
      "INTERACTIVE"
    );
  });

  it("recognizes Claude subscription auth across current JSON and text status formats", () => {
    expect(
      claudeSubscriptionAuthenticated({
        code: 0,
        stdout: JSON.stringify({
          loggedIn: true,
          authMethod: "oauth_token",
          apiProvider: "firstParty"
        }),
        stderr: ""
      })
    ).toBe(true);

    expect(
      claudeSubscriptionAuthenticated({
        code: 0,
        stdout:
          "Login method: Claude Max account\nOrganization: Test\n",
        stderr: ""
      })
    ).toBe(true);

    expect(
      claudeSubscriptionAuthenticated({
        code: 0,
        stdout:
          "Profile: credentials-file · user_oauth · profile default",
        stderr: ""
      })
    ).toBe(false);

    expect(
      claudeSubscriptionAuthenticated({
        code: 0,
        stdout: JSON.stringify({
          loggedIn: true,
          authMethod: "api_key",
          apiProvider: "firstParty"
        }),
        stderr: ""
      })
    ).toBe(false);
  });

  it("discovers the newest Claude Code session id without reading transcript content", async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "lex-claude-sessions-"
        )
      );
    cleanupRoots.push(root);
    process.env.LEX_CLAUDE_SESSIONS_ROOT =
      root;

    const firstProject =
      path.join(root, "project-a");
    const secondProject =
      path.join(root, "project-b");
    fs.mkdirSync(
      firstProject,
      {
        recursive: true
      }
    );
    fs.mkdirSync(
      secondProject,
      {
        recursive: true
      }
    );

    const older =
      "11111111-1111-4111-8111-111111111111";
    const newer =
      "22222222-2222-4222-8222-222222222222";
    const olderPath =
      path.join(
        firstProject,
        older + ".jsonl"
      );
    const newerPath =
      path.join(
        secondProject,
        newer + ".jsonl"
      );
    fs.writeFileSync(
      olderPath,
      "do-not-read"
    );
    fs.writeFileSync(
      newerPath,
      "do-not-read"
    );
    fs.utimesSync(
      olderPath,
      new Date(1_000),
      new Date(1_000)
    );
    fs.utimesSync(
      newerPath,
      new Date(2_000),
      new Date(2_000)
    );

    expect(
      await discoverLatestClaudeSessionId()
    ).toBe(newer);
  });

  it("does not confuse API or local models with account-session models", () => {
    expect(
      isAccountSessionModel(
        "openai",
        "account/openai/default"
      )
    ).toBe(true);
    expect(
      isAccountSessionModel(
        "openai",
        "gpt-5"
      )
    ).toBe(false);
    expect(
      isAccountSessionModel(
        "openai",
        "local/mistral-nemo-12b-q4km"
      )
    ).toBe(false);
    expect(
      isAccountSessionModel(
        "anthropic",
        "account/openai/default"
      )
    ).toBe(false);
  });
});
