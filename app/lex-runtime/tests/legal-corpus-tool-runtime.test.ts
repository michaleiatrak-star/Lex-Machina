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
