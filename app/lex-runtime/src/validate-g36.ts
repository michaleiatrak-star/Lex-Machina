import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  LegalCorpusToolRuntime
} from "./legal-corpus-tool-runtime.js";
import {
  LexSkillRegistry
} from "./registry.js";
import {
  ProviderGateway,
  ProviderRegistry
} from "./providers/gateway.js";
import type {
  ProviderAdapter,
  ProviderStreamParams
} from "./providers/types.js";
import {
  SafeSessionExecutor
} from "./session-executor.js";

const root =
  fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-g36-validate-"
    )
  );
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function makeSkill(
  name: string,
  body: string
): void {
  const dir =
    path.join(
      root,
      name
    );
  fs.mkdirSync(
    dir,
    { recursive: true }
  );
  fs.writeFileSync(
    path.join(
      dir,
      "SKILL.md"
    ),
    [
      "---",
      `name: ${name}`,
      'version: "1.0"',
      "---",
      body,
      ""
    ].join("\n")
  );
}

try {
  makeSkill(
    "shared",
    "# shared"
  );
  makeSkill(
    "prawny-router-v3",
    "# router\nview shared/PRAWO-HARDGATE.md"
  );
  makeSkill(
    "prawo-polskie-v2",
    "# prawo"
  );
  makeSkill(
    DR,
    "# DR\nview modules/mod-KC.md"
  );

  fs.writeFileSync(
    path.join(
      root,
      "shared",
      "PRAWO-HARDGATE.md"
    ),
    "# G36 HARD GATE CONTENT\n"
  );

  const routerRefs =
    path.join(
      root,
      "prawny-router-v3",
      "references"
    );
  fs.mkdirSync(
    routerRefs,
    { recursive: true }
  );
  fs.writeFileSync(
    path.join(
      routerRefs,
      "KROK0A-anonimizer.md"
    ),
    "# G36 ANON CONTENT\n"
  );
  fs.writeFileSync(
    path.join(
      routerRefs,
      "KROK1-detekcja.md"
    ),
    "# G36 DETECT CONTENT\n"
  );

  fs.writeFileSync(
    path.join(
      root,
      "prawo-polskie-v2",
      "ROUTING-MAP.md"
    ),
    `# routing\n${DR}\n`
  );

  const modules =
    path.join(
      root,
      DR,
      "modules"
    );
  fs.mkdirSync(
    modules,
    { recursive: true }
  );
  fs.writeFileSync(
    path.join(
      modules,
      "mod-KC.md"
    ),
    "X".repeat(45_000) +
      "\nG36_END\n"
  );

  const registry =
    new LexSkillRegistry(
      root
    );
  const scanIssues =
    registry.scan();
  const declarationIssues =
    registry
      .validateDeclarations();

  const corpus =
    new LegalCorpusToolRuntime(
      registry
    );
  const firstRead =
    JSON.parse(
      (
        await corpus.runTools([
          {
            id: "read-1",
            name:
              "read_legal_resource",
            input: {
              skill: DR,
              path:
                "modules/mod-KC.md",
              maxChars:
                40_000
            }
          }
        ])
      )[0]!.content
    ) as {
      nextOffset:
        number | null;
      content: string;
    };

  const secondRead =
    JSON.parse(
      (
        await corpus.runTools([
          {
            id: "read-2",
            name:
              "read_legal_resource",
            input: {
              skill: DR,
              path:
                "modules/mod-KC.md",
              offset:
                firstRead
                  .nextOffset,
              maxChars:
                40_000
            }
          }
        ])
      )[0]!.content
    ) as {
      nextOffset:
        number | null;
      content: string;
    };

  const traversal =
    JSON.parse(
      (
        await corpus.runTools([
          {
            id: "blocked",
            name:
              "read_legal_resource",
            input: {
              skill: DR,
              path:
                "../../etc/passwd"
            }
          }
        ])
      )[0]!.content
    ) as {
      status: string;
    };

  let captured:
    ProviderStreamParams |
    undefined;
  const adapter:
    ProviderAdapter = {
      id: "openai",
      label: "g36-capture",
      capabilities: {
        streaming: true,
        tools: true,
        reasoning: true,
        modelDiscovery: false
      },
      async stream(params) {
        captured = params;
        return {
          fullText:
            "Techniczny test korpusu."
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
      registry,
      new ProviderGateway(
        providers
      )
    );
  const result =
    await executor.execute({
      query:
        "Sprawdź dostęp do korpusu.",
      provider: "openai",
      model: "test",
      primarySkill: DR,
      mode: "PRAWNIK"
    });

  const toolNames =
    captured?.tools?.map(
      (tool) =>
        tool.function.name
    ) ?? [];
  const prompt =
    captured?.systemPrompt ??
    "";

  const pass =
    scanIssues.length === 0 &&
    declarationIssues.length === 0 &&
    firstRead
      .nextOffset ===
      40_000 &&
    secondRead
      .nextOffset ===
      null &&
    secondRead
      .content
      .includes(
        "G36_END"
      ) &&
    traversal.status ===
      "BLOCKED" &&
    result.status ===
      "DRAFT_PRESENTABLE" &&
    prompt.includes(
      "# CORE LEGAL RESOURCE: shared/PRAWO-HARDGATE.md"
    ) &&
    prompt.includes(
      "G36 HARD GATE CONTENT"
    ) &&
    prompt.includes(
      "LOCAL LEGAL CORPUS ACCESS"
    ) &&
    [
      "list_legal_skills",
      "list_legal_resources",
      "read_legal_resource"
    ].every(
      (name) =>
        toolNames.includes(
          name
        )
    );

  process.stdout.write(
    JSON.stringify({
      gate:
        "G36_LEGAL_SKILL_RUNTIME",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      actualCoreResourceContentInjected:
        prompt.includes(
          "G36 HARD GATE CONTENT"
        ),
      onDemandCorpusTools:
        toolNames.filter(
          (name) =>
            name.includes(
              "legal_"
            )
        ),
      fullResourcePagination:
        secondRead
          .content
          .includes(
            "G36_END"
          ),
      traversalBlocked:
        traversal.status ===
          "BLOCKED",
      structuralIssues:
        scanIssues.length +
        declarationIssues.length
    }, null, 2) + "\n"
  );

  if (!pass) {
    process.exitCode = 1;
  }
} finally {
  fs.rmSync(
    root,
    {
      recursive: true,
      force: true
    }
  );
}
