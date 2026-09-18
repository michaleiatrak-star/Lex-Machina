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
  ProviderGateway,
  ProviderRegistry
} from "../src/providers/gateway.js";
import type {
  ProviderAdapter
} from "../src/providers/types.js";
import {
  LexSkillRegistry
} from "../src/registry.js";
import {
  SafeSessionExecutor,
  SESSION_EXECUTION_INTERNAL
} from "../src/session-executor.js";

const roots: string[] = [];
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function write(
  root: string,
  relative: string,
  content = "# fixture\n"
): void {
  const target =
    path.join(
      root,
      ...relative.split("/")
    );
  fs.mkdirSync(
    path.dirname(target),
    { recursive: true }
  );
  fs.writeFileSync(
    target,
    content,
    "utf8"
  );
}

function skill(
  root: string,
  name: string,
  description = "fixture"
): void {
  write(
    root,
    `${name}/SKILL.md`,
    [
      "---",
      `name: ${name}`,
      'version: "1.0"',
      'type: "executive-pisma"',
      `description: "${description}"`,
      "---",
      `# ${name}`
    ].join("\n")
  );
}

function fixture():
  LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-simple-output-"
      )
    );
  roots.push(root);

  skill(
    root,
    "prawny-router-v3",
    "router"
  );
  skill(
    root,
    "prawo-polskie-v2",
    "prawo polskie"
  );
  skill(
    root,
    DR,
    "prawo cywilne"
  );
  skill(
    root,
    "pisma-proste-v2",
    "wezwanie do zapłaty pismo proste"
  );

  write(
    root,
    "shared/PRAWO-HARDGATE.md"
  );
  write(
    root,
    "prawny-router-v3/references/KROK0A-anonimizer.md"
  );
  write(
    root,
    "prawny-router-v3/references/KROK1-detekcja.md"
  );
  write(
    root,
    "prawo-polskie-v2/ROUTING-MAP.md",
    `${DR}\n`
  );

  for (
    const resource
    of [
      "shared/NAZEWNICTWO-STRON.md",
      "pisma-proste-v2/references/M1-zasady.md",
      "pisma-proste-v2/references/M2-intake.md",
      "pisma-proste-v2/references/M4-struktura.md",
      "pisma-proste-v2/references/M8-checklista.md",
      "shared/HYBRID-VALIDATION.md",
      "pisma-proste-v2/references/M9-format.md"
    ]
  ) {
    write(
      root,
      resource
    );
  }

  const registry =
    new LexSkillRegistry(root);
  expect(
    registry.scan()
  ).toEqual([]);
  return registry;
}

afterEach(() => {
  for (
    const root
    of roots.splice(0)
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

describe(
  "SIMPLE_LETTER_V1 output gate integration",
  () => {
    it(
      "records a blocked output gate when a purported ready letter violates M9",
      async () => {
        const adapter:
          ProviderAdapter = {
            id: "openai",
            label:
              "invalid-simple-letter",
            capabilities: {
              streaming: true,
              tools: true,
              reasoning: true,
              modelDiscovery: false
            },
            async stream() {
              return {
                fullText:
                  "WEZWANIE DO ZAPŁATY\nProszę zapłacić należność."
              };
            }
          };

        const providers =
          new ProviderRegistry();
        providers.register(
          adapter
        );

        const executor =
          new SafeSessionExecutor(
            fixture(),
            new ProviderGateway(
              providers
            )
          );

        const result =
          await executor.execute({
            query:
              "Przygotuj wezwanie do zapłaty.",
            provider: "openai",
            model: "test",
            primarySkill: DR,
            mode: "PRAWNIK"
          });

        expect(
          result.workflow?.id
        ).toBe(
          "SIMPLE_LETTER_V1"
        );
        expect(result.status)
          .toBe("BLOCKED");

        const internal =
          (result as any)[
            SESSION_EXECUTION_INTERNAL
          ] as {
            auditEvents: Array<{
              target: string;
              status: string;
              detail?: {
                missing?: string[];
                orderValid?: boolean;
              };
            }>;
          };

        const gate =
          internal.auditEvents
            .find(
              (event) =>
                event.target ===
                  "G39H_WORKFLOW_OUTPUT"
            );

        expect(gate)
          .toMatchObject({
            status: "BLOCKED"
          });
        expect(
          gate?.detail?.missing
        ).toEqual(
          expect.arrayContaining([
            "TREŚĆ PISMA",
            "UWAGI PRAKTYCZNE",
            "CO DALEJ",
            "HYBRID-VALIDATION"
          ])
        );
      }
    );
  }
);
