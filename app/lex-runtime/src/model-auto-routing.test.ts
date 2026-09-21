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
  ModelAutoRouter
} from "./model-auto-routing.js";
import {
  LexSkillRegistry
} from "./registry.js";
import {
  ProviderGateway,
  ProviderRegistry
} from "./providers/gateway.js";
import type {
  ProviderAdapter,
  ProviderStreamParams,
  ProviderStreamResult
} from "./providers/types.js";
import {
  parseSkillSelectionEnvelope,
  SKILL_SELECTION_ENVELOPE_PREFIX
} from "./skill-selection.js";

const roots: string[] = [];

const DR01 =
  "dr-01-ustroj-konstytucyjny-i-zrodla-prawa";
const DR03 =
  "dr-03-prawo-karne-wykroczenia-egzekucja";

function skill(
  root: string,
  name: string,
  type: string,
  description: string
): void {
  const directory =
    path.join(
      root,
      name
    );
  fs.mkdirSync(
    directory,
    {
      recursive: true
    }
  );
  fs.writeFileSync(
    path.join(
      directory,
      "SKILL.md"
    ),
    [
      "---",
      `name: ${name}`,
      `type: ${type}`,
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
        "lex-model-auto-router-"
      )
    );
  roots.push(root);

  skill(
    root,
    "prawny-router-v3",
    "router",
    "centralny router"
  );
  skill(
    root,
    "prawo-polskie-v2",
    "domain-router",
    "router prawa polskiego"
  );
  skill(
    root,
    "shared",
    "shared",
    "wspólne zasady"
  );
  skill(
    root,
    DR01,
    "domain",
    "ustrój konstytucyjny źródła prawa"
  );
  skill(
    root,
    DR03,
    "domain",
    "prawo karne kodeks karny wykroczenia"
  );
  skill(
    root,
    "analizator-przepisow-v2",
    "executive-analiza",
    "analiza konkretnego przepisu"
  );
  skill(
    root,
    "analiza-sadowa-v6",
    "executive-sadowa",
    "pełna analiza sprawy sądowej"
  );

  fs.writeFileSync(
    path.join(
      root,
      "prawo-polskie-v2",
      "ROUTING-MAP.md"
    ),
    [
      "# routing",
      `- ${DR01}`,
      `- ${DR03}`
    ].join("\n")
  );

  const registry =
    new LexSkillRegistry(
      root
    );
  expect(
    registry.scan()
  ).toEqual([]);
  return registry;
}

class QueueAdapter
  implements ProviderAdapter {
  readonly id =
    "openai" as const;
  readonly label =
    "queue";
  readonly capabilities = {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };
  readonly calls:
    ProviderStreamParams[] = [];

  constructor(
    private readonly outputs:
      string[]
  ) {}

  async stream(
    params:
      ProviderStreamParams
  ): Promise<
    ProviderStreamResult
  > {
    this.calls.push(
      params
    );
    const output =
      this.outputs.shift();
    if (
      output === undefined
    ) {
      throw new Error(
        "NO_SCRIPTED_ROUTER_OUTPUT"
      );
    }
    return {
      fullText:
        output
    };
  }
}

function router(
  registry:
    LexSkillRegistry,
  outputs: string[]
): {
  router: ModelAutoRouter;
  adapter: QueueAdapter;
} {
  const providerRegistry =
    new ProviderRegistry();
  const adapter =
    new QueueAdapter(
      outputs
    );
  providerRegistry.register(
    adapter
  );
  return {
    router:
      new ModelAutoRouter(
        registry,
        new ProviderGateway(
          providerRegistry
        )
      ),
    adapter
  };
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
  "ModelAutoRouter",
  () => {
    it(
      "uses the model decision as the AUTO route and exact skill selection",
      async () => {
        const registry =
          fixture();
        const setup =
          router(
            registry,
            [
              JSON.stringify({
                primarySkill:
                  DR03,
                domainSkills: [
                  DR03
                ],
                executionSkills: [
                  "analizator-przepisow-v2"
                ],
                workflowExecutionSkill:
                  "analizator-przepisow-v2"
              })
            ]
          );

        const result =
          await setup.router
            .resolve({
              query:
                `${SKILL_SELECTION_ENVELOPE_PREFIX} {"auto":true,"manual":[]}\nJaka jest odpowiedzialność karna z art. 276 k.k.?`,
              provider:
                "openai",
              model:
                "account/openai/default"
            });

        expect(
          result.decision
        ).toEqual({
          primarySkill:
            DR03,
          domainSkills: [
            DR03
          ],
          executionSkills: [
            "analizator-przepisow-v2"
          ],
          workflowExecutionSkill:
            "analizator-przepisow-v2"
        });

        const envelope =
          parseSkillSelectionEnvelope(
            result.query
          );
        expect(
          envelope.automatic
        ).toBe(false);
        expect(
          envelope.modelRouted
        ).toBe(true);
        expect(
          envelope.manualSkills
        ).toEqual([
          "analizator-przepisow-v2"
        ]);
        expect(
          envelope
            .workflowExecutionSkill
        ).toBe(
          "analizator-przepisow-v2"
        );
      }
    );

    it(
      "does not semantically override a valid model choice with regex or token scoring",
      async () => {
        const registry =
          fixture();
        const setup =
          router(
            registry,
            [
              JSON.stringify({
                primarySkill:
                  DR01,
                domainSkills: [
                  DR01
                ],
                executionSkills:
                  [],
                workflowExecutionSkill:
                  null
              })
            ]
          );

        const result =
          await setup.router
            .resolve({
              query:
                "Jaka jest odpowiedzialność karna z art. 276 k.k.?",
              provider:
                "openai",
              model:
                "router-model"
            });

        // This is deliberately semantically wrong. The runtime validates only
        // catalog membership in AUTO; it does not secretly replace the model's
        // decision with a deterministic rule.
        expect(
          result.decision
            .primarySkill
        ).toBe(
          DR01
        );
        expect(
          setup.adapter.calls
        ).toHaveLength(1);
      }
    );

    it(
      "retries model routing once instead of using a deterministic fallback",
      async () => {
        const registry =
          fixture();
        const setup =
          router(
            registry,
            [
              "niepoprawny wynik",
              JSON.stringify({
                primarySkill:
                  DR03,
                domainSkills: [
                  DR03
                ],
                executionSkills:
                  [],
                workflowExecutionSkill:
                  null
              })
            ]
          );

        const result =
          await setup.router
            .resolve({
              query:
                "Pytanie prawne",
              provider:
                "openai",
              model:
                "router-model"
            });

        expect(
          result.decision
            .primarySkill
        ).toBe(
          DR03
        );
        expect(
          setup.adapter.calls
        ).toHaveLength(2);
      }
    );

    it(
      "fails closed when the model selects an unchecked execution skill",
      async () => {
        const registry =
          fixture();
        const invalid =
          JSON.stringify({
            primarySkill:
              DR03,
            domainSkills: [
              DR03
            ],
            executionSkills: [
              "analiza-sadowa-v6"
            ],
            workflowExecutionSkill:
              "analiza-sadowa-v6"
          });
        const setup =
          router(
            registry,
            [
              invalid,
              invalid
            ]
          );

        await expect(
          setup.router.resolve({
            query:
              `${SKILL_SELECTION_ENVELOPE_PREFIX} {"auto":true,"manual":[],"execution":["analizator-przepisow-v2"]}\nPytanie`,
            provider:
              "openai",
            model:
              "router-model"
          })
        ).rejects.toThrow(
          "AUTO_ROUTING_INVALID_MODEL_OUTPUT"
        );
      }
    );
  }
);
