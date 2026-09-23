import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import {
  buildOptionalLocalLaunchSpec
} from "./local-model-runtime.js";

const roots: string[] = [];

function temporaryRoot(): string {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-local-startup-"
      )
    );
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(
      root,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe(
  "local llama.cpp startup optional assets",
  () => {
    for (
      const modelId
      of [
        "local/mistral-nemo-12b-q4km",
        "local/bielik-11b-v3-q4km"
      ]
    ) {
      it(
        `does not gate ${modelId} startup when MCP, UI and template files are absent`,
        () => {
          const root =
            temporaryRoot();
          const baseArgs = [
            "--model",
            "model.gguf",
            "--port",
            "4318"
          ];
          const result =
            buildOptionalLocalLaunchSpec(
              root,
              modelId,
              baseArgs,
              {
                LLAMA_ARG_AGENT:
                  "true",
                LLAMA_ARG_MCP_SERVERS_CONFIG:
                  path.join(
                    root,
                    "missing-mcp.json"
                  ),
                LLAMA_ARG_UI_CONFIG_FILE:
                  path.join(
                    root,
                    "missing-ui.json"
                  )
              }
            );

          expect(result.args)
            .toEqual(baseArgs);
          expect(
            result.env
              .LLAMA_ARG_AGENT
          ).toBeUndefined();
          expect(
            result.env
              .LLAMA_ARG_MCP_SERVERS_CONFIG
          ).toBeUndefined();
          expect(
            result.env
              .LLAMA_ARG_UI_CONFIG_FILE
          ).toBeUndefined();
        }
      );
    }

    it(
      "uses native-agent configuration and a grounded template when all optional assets exist",
      () => {
        const root =
          temporaryRoot();
        const mcp =
          path.join(
            root,
            "mcp-servers.json"
          );
        const ui =
          path.join(
            root,
            "llama-ui-config.json"
          );
        const template =
          path.join(
            root,
            "mistral-nemo-web-grounded.jinja"
          );
        fs.writeFileSync(
          mcp,
          "{}\n"
        );
        fs.writeFileSync(
          ui,
          "{}\n"
        );
        fs.writeFileSync(
          template,
          "{{ messages }}\n"
        );

        const result =
          buildOptionalLocalLaunchSpec(
            root,
            "local/mistral-nemo-12b-q4km",
            ["--model", "model.gguf"],
            {}
          );

        expect(
          result.env
            .LLAMA_ARG_AGENT
        ).toBe("true");
        expect(
          result.env
            .LLAMA_ARG_MCP_SERVERS_CONFIG
        ).toBe(mcp);
        expect(
          result.env
            .LLAMA_ARG_UI_CONFIG_FILE
        ).toBe(ui);
        expect(result.args)
          .toContain(
            "--chat-template-file"
          );
        expect(result.args)
          .toContain(template);
      }
    );
  }
);
