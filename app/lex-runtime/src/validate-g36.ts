import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";
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

const TEXT_EXTENSIONS =
  new Set([
    ".md",
    ".txt",
    ".json",
    ".yaml",
    ".yml",
    ".csv",
    ".tsv",
    ".py",
    ".js",
    ".mjs",
    ".cjs",
    ".ts",
    ".tsx",
    ".jsx",
    ".html",
    ".htm",
    ".xml",
    ".sql",
    ".toml",
    ".ini",
    ".cfg"
  ]);

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

async function listAllResources(
  runtime:
    LegalCorpusToolRuntime,
  skill: string
): Promise<string[]> {
  const resources:
    string[] = [];
  let cursor = 0;

  while (true) {
    const result =
      await runtime.runTools([
        {
          id:
            "list-" +
            skill +
            "-" +
            cursor,
          name:
            "list_legal_resources",
          input: {
            skill,
            cursor
          }
        }
      ]);
    const parsed =
      JSON.parse(
        result[0]!.content
      ) as {
        status: string;
        resources?: string[];
        nextCursor?:
          number | null;
      };

    if (
      parsed.status !== "OK" ||
      !Array.isArray(
        parsed.resources
      )
    ) {
      throw new Error(
        "G36_REAL_CORPUS_LIST_FAILED:" +
        skill
      );
    }
    resources.push(
      ...parsed.resources
    );

    if (
      parsed.nextCursor ===
        null ||
      parsed.nextCursor ===
        undefined
    ) {
      break;
    }
    cursor =
      parsed.nextCursor;
  }

  return resources;
}

async function readWholeResource(
  runtime:
    LegalCorpusToolRuntime,
  skill: string,
  resourcePath: string
): Promise<number> {
  let offset = 0;
  let total = 0;

  while (true) {
    const result =
      await runtime.runTools([
        {
          id:
            "read-" +
            skill +
            "-" +
            total,
          name:
            "read_legal_resource",
          input: {
            skill,
            path:
              resourcePath,
            offset,
            maxChars: 40_000
          }
        }
      ]);
    const parsed =
      JSON.parse(
        result[0]!.content
      ) as {
        status: string;
        returnedChars?:
          number;
        nextOffset?:
          number | null;
      };

    if (
      parsed.status !== "OK" ||
      !Number.isInteger(
        parsed.returnedChars
      )
    ) {
      throw new Error(
        "G36_REAL_CORPUS_READ_FAILED:" +
        skill +
        ":" +
        resourcePath
      );
    }

    total +=
      parsed.returnedChars!;
    if (
      parsed.nextOffset ===
        null ||
      parsed.nextOffset ===
        undefined
    ) {
      break;
    }
    if (
      parsed.nextOffset <=
        offset
    ) {
      throw new Error(
        "G36_REAL_CORPUS_PAGINATION_STALLED:" +
        skill +
        ":" +
        resourcePath
      );
    }
    offset =
      parsed.nextOffset;
  }

  return total;
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

  // Synthetic safety / integration fixture.
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

  const syntheticPass =
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

  // Full production corpus readability audit.
  const here =
    path.dirname(
      fileURLToPath(
        import.meta.url
      )
    );
  const repositoryRoot =
    path.resolve(
      here,
      "../../.."
    );
  const productionRoot =
    path.resolve(
      process.env
        .LEX_SKILLS_PATH ??
      path.join(
        repositoryRoot,
        "Wersja rozwojowa rozpakowana"
      )
    );

  const productionRegistry =
    new LexSkillRegistry(
      productionRoot
    );
  const productionIssues = [
    ...productionRegistry.scan(),
    ...productionRegistry
      .validateDeclarations()
  ];
  const productionRuntime =
    new LegalCorpusToolRuntime(
      productionRegistry
    );

  const unreadable:
    Array<{
      skill: string;
      resource: string;
      error: string;
    }> = [];
  let listedResources = 0;
  let textResources = 0;
  let binaryOrUnsupported = 0;
  let totalTextChars = 0;

  for (
    const skill
    of [
      ...productionRegistry
        .skills.keys()
    ].sort()
  ) {
    let resources:
      string[];
    try {
      resources =
        await listAllResources(
          productionRuntime,
          skill
        );
    } catch (error) {
      unreadable.push({
        skill,
        resource: "<LIST>",
        error:
          error instanceof Error
            ? error.message
            : String(error)
      });
      continue;
    }

    listedResources +=
      resources.length;

    for (
      const resourcePath
      of resources
    ) {
      const extension =
        path.extname(
          resourcePath
        ).toLowerCase();
      if (
        !TEXT_EXTENSIONS.has(
          extension
        )
      ) {
        binaryOrUnsupported += 1;
        continue;
      }

      textResources += 1;
      try {
        totalTextChars +=
          await readWholeResource(
            productionRuntime,
            skill,
            resourcePath
          );
      } catch (error) {
        unreadable.push({
          skill,
          resource:
            resourcePath,
          error:
            error instanceof Error
              ? error.message
              : String(error)
        });
      }
    }
  }

  const drCount =
    [...productionRegistry
      .skills.keys()]
      .filter(
        (name) =>
          /^dr-\d{2}-/
            .test(name)
      )
      .length;

  const productionPass =
    productionIssues.length === 0 &&
    unreadable.length === 0 &&
    productionRegistry
      .skills.size > 0 &&
    drCount === 16 &&
    textResources > 0;

  const pass =
    syntheticPass &&
    productionPass;

  process.stdout.write(
    JSON.stringify({
      gate:
        "G36_LEGAL_SKILL_RUNTIME",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      synthetic: {
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
            "BLOCKED"
      },
      productionCorpus: {
        root:
          productionRoot,
        registeredSkills:
          productionRegistry
            .skills.size,
        drSkills:
          drCount,
        listedResources,
        textResources,
        binaryOrUnsupported,
        totalTextChars,
        structuralIssues:
          productionIssues.length,
        unreadable:
          unreadable.slice(
            0,
            20
          ),
        allTextResourcesReadable:
          unreadable.length ===
            0
      },
      semanticBoundary:
        "PASS means every registered production skill and every supported textual resource is locally readable on demand; it does not preload all resources into every prompt and does not replace live legal verification."
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
