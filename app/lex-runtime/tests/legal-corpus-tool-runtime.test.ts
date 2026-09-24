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
  LegalCorpusToolRuntime
} from "../src/legal-corpus-tool-runtime.js";
import {
  LexSkillRegistry
} from "../src/registry.js";

const roots: string[] = [];
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function fixture():
  LexSkillRegistry {
  const root = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "lex-g36-corpus-"
    )
  );
  roots.push(root);

  for (
    const [name, body]
    of [
      ["shared", "# shared\n"],
      ["prawny-router-v3", "# router\n"],
      ["prawo-polskie-v2", "# prawo\n"],
      [DR, "# dr\n"]
    ] as const
  ) {
    const dir =
      path.join(root, name);
    fs.mkdirSync(
      dir,
      { recursive: true }
    );
    fs.writeFileSync(
      path.join(
        dir,
        "SKILL.md"
      ),
      `---\nname: ${name}\nversion: "1.0"\n---\n${body}`
    );
  }

  fs.writeFileSync(
    path.join(
      root,
      "shared",
      "PRAWO-HARDGATE.md"
    ),
    "# hard gate\n"
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
    "A".repeat(50_000) +
      "\nKONIEC\n"
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

afterEach(() => {
  while (roots.length) {
    fs.rmSync(
      roots.pop()!,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe("G36 legal corpus runtime", () => {
  it("lists skills/resources and reads the full module by pagination", async () => {
    const runtime =
      new LegalCorpusToolRuntime(
        fixture()
      );

    const listedSkills =
      await runtime.runTools([
        {
          id: "1",
          name:
            "list_legal_skills",
          input: {}
        }
      ]);
    expect(
      listedSkills[0]
        ?.content
    ).toContain(DR);

    const listedResources =
      await runtime.runTools([
        {
          id: "2",
          name:
            "list_legal_resources",
          input: {
            skill: DR,
            prefix:
              "modules/"
          }
        }
      ]);
    expect(
      listedResources[0]
        ?.content
    ).toContain(
      "modules/mod-KC.md"
    );

    const first =
      JSON.parse(
        (
          await runtime
            .runTools([
              {
                id: "3",
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
        content: string;
        nextOffset:
          number | null;
      };
    expect(
      first.content.length
    ).toBe(40_000);
    expect(
      first.nextOffset
    ).toBe(40_000);

    const second =
      JSON.parse(
        (
          await runtime
            .runTools([
              {
                id: "4",
                name:
                  "read_legal_resource",
                input: {
                  skill: DR,
                  path:
                    "modules/mod-KC.md",
                  offset:
                    first.nextOffset,
                  maxChars:
                    40_000
                }
              }
            ])
        )[0]!.content
      ) as {
        content: string;
        nextOffset:
          number | null;
      };
    expect(
      second.content
    ).toContain(
      "KONIEC"
    );
    expect(
      second.nextOffset
    ).toBeNull();
  });

  it("allows canonical shared reads but blocks filesystem traversal", async () => {
    const runtime =
      new LegalCorpusToolRuntime(
        fixture()
      );

    const shared =
      await runtime.runTools([
        {
          id: "1",
          name:
            "read_legal_resource",
          input: {
            skill: DR,
            path:
              "shared/PRAWO-HARDGATE.md"
          }
        }
      ]);
    expect(
      shared[0]?.content
    ).toContain(
      "# hard gate"
    );

    const blocked =
      await runtime.runTools([
        {
          id: "2",
          name:
            "read_legal_resource",
          input: {
            skill: DR,
            path:
              "../../etc/passwd"
          }
        }
      ]);
    expect(
      blocked[0]?.content
    ).toContain(
      '"status":"BLOCKED"'
    );
    expect(
      runtime.auditEvents()
        .at(-1)
    ).toMatchObject({
      decision: "BLOCK"
    });
  });
});

describe("model skill selection mode", () => {
  function withCriminalDomain(): LexSkillRegistry {
    const registry = fixture();
    const dir = path.join(registry.root, "dr-03-prawo-karne");
    fs.mkdirSync(path.join(dir, "modules"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "SKILL.md"),
      "---\nname: dr-03-prawo-karne\nversion: \"1.0\"\n---\n# karne\n"
    );
    fs.writeFileSync(
      path.join(dir, "modules", "mod-KK-kwalifikator-karnomaterialny.md"),
      "# kwalifikator\n"
    );
    registry.scan();
    return registry;
  }

  const read = (skill: string, file: string, id = skill + file) => ({
    id,
    name: "read_legal_resource",
    input: { skill, path: file }
  });

  it("requires prawny-router-v3 before any other legal resource", async () => {
    const runtime = new LegalCorpusToolRuntime(fixture(), { modelSelectsSkills: true });
    const [blocked] = await runtime.runTools([read(DR, "SKILL.md")]);
    expect(JSON.parse(blocked!.content)).toMatchObject({
      status: "BLOCKED",
      error: expect.stringMatching(/^ROUTER_V3_REQUIRED_FIRST/)
    });

    const results = await runtime.runTools([
      read("prawny-router-v3", "SKILL.md"),
      read(DR, "SKILL.md")
    ]);
    expect(results.map((item) => JSON.parse(item.content).status)).toEqual(["OK", "OK"]);
    expect(runtime.modelSkillSelection()).toEqual({
      primarySkill: DR,
      loadedSkills: ["prawny-router-v3", DR],
      domainSkills: [DR],
      executionSkills: []
    });
  });

  it("delivers the criminal qualifier with the first DR-03 skill entry", async () => {
    const runtime = new LegalCorpusToolRuntime(withCriminalDomain(), { modelSelectsSkills: true });
    await runtime.runTools([read("prawny-router-v3", "SKILL.md")]);
    const [first] = await runtime.runTools([read("dr-03-prawo-karne", "SKILL.md")]);
    expect(JSON.parse(first!.content).requiredModule).toMatchObject({
      path: "dr-03-prawo-karne/modules/mod-KK-kwalifikator-karnomaterialny.md",
      content: "# kwalifikator\n"
    });
    const [again] = await runtime.runTools([read("dr-03-prawo-karne", "SKILL.md", "again")]);
    expect(JSON.parse(again!.content).requiredModule).toBeUndefined();
  });

  it("keeps the preloaded router path unchanged outside model selection", async () => {
    const runtime = new LegalCorpusToolRuntime(fixture());
    const [result] = await runtime.runTools([read(DR, "SKILL.md")]);
    expect(JSON.parse(result!.content).status).toBe("OK");
  });
});
