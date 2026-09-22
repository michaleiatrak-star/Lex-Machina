import {
  describe,
  expect,
  it
} from "vitest";
import {
  accountLoginArgs,
  accountLoginFallbackArgs,
  accountSessionResumeMode,
  codexExecArgs,
  openAiChatGptAuthenticated
} from "../src/providers/account-session.js";

describe(
  "account session continuity",
  () => {
    it(
      "keeps host-session continuity enabled for subscription providers",
      () => {
        expect(
          accountSessionResumeMode(
            "openai"
          )
        ).toBe(
          "LAST_OR_NEW"
        );
        expect(
          accountSessionResumeMode(
            "anthropic"
          )
        ).toBe(
          "LAST_OR_NEW"
        );
      }
    );

    it(
      "keeps the proven RC14 browser login contracts for ChatGPT and Claude",
      () => {
        expect(
          accountLoginArgs(
            "openai"
          )
        ).toEqual([
          "login"
        ]);
        expect(
          accountLoginFallbackArgs(
            "openai"
          )
        ).toEqual([
          "login",
          "--device-auth"
        ]);
        expect(
          openAiChatGptAuthenticated({
            code: 0,
            stdout:
              "Using ChatGPT",
            stderr: ""
          })
        ).toBe(true);
        expect(
          openAiChatGptAuthenticated({
            code: 0,
            stdout:
              "Logged in using ChatGPT",
            stderr: ""
          })
        ).toBe(true);
        expect(
          openAiChatGptAuthenticated({
            code: 0,
            stdout:
              "Authenticated with API key",
            stderr: ""
          })
        ).toBe(false);
        expect(
          accountLoginArgs(
            "anthropic"
          )
        ).toEqual([
          "auth",
          "login",
          "--claudeai"
        ]);
        expect(
          accountLoginFallbackArgs(
            "anthropic"
          )
        ).toBeNull();
      }
    );

    it(
      "builds a persistent, sandboxed Codex resume invocation",
      () => {
        const args =
          codexExecArgs(
            "C:\\lex-work",
            "C:\\lex-work\\last-message.txt",
            "gpt-5.6-luna",
            [
              "resume",
              "0199-session-id",
              "-"
            ]
          );

        expect(args)
          .not.toContain(
            "--ephemeral"
          );
        expect(args)
          .toContain(
            "--ignore-user-config"
          );
        expect(args)
          .toContain(
            "--ignore-rules"
          );
        expect(args)
          .toContain(
            "mcp_servers={}"
          );
        expect(args)
          .toContain(
            "read-only"
          );
        expect(
          args.slice(-3)
        ).toEqual([
          "resume",
          "0199-session-id",
          "-"
        ]);
      }
    );
  }
);
