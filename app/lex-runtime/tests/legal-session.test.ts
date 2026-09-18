import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LexSkillRegistry } from "../src/registry.js";
import {
  CORE_LEGAL_RESOURCES,
  LegalSession,
  LegalSessionBootstrapError
} from "../src/legal-session.js";

const roots: string[] = [];

function makeCorpus(options?: { omit?: string }): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-session-"));
  roots.push(root);

  const router = path.join(root, "prawny-router-v3");
  fs.mkdirSync(path.join(router, "references"), { recursive: true });
  fs.mkdirSync(path.join(root, "shared"), { recursive: true });

  fs.writeFileSync(
    path.join(router, "SKILL.md"),
    `---
name: prawny-router-v3
dependencies:
  requires:
    - shared
required_modules:
  - shared/PRAWO-HARDGATE.md
  - references/KROK0A-anonimizer.md
  - references/KROK1-detekcja.md
---
# Router
`
  );

  const resources: Record<string, string> = {
    "shared/PRAWO-HARDGATE.md": path.join(root, "shared", "PRAWO-HARDGATE.md"),
    "references/KROK0A-anonimizer.md": path.join(
      router,
      "references",
      "KROK0A-anonimizer.md"
    ),
    "references/KROK1-detekcja.md": path.join(
      router,
      "references",
      "KROK1-detekcja.md"
    )
  };

  for (const [semantic, file] of Object.entries(resources)) {
    if (options?.omit === semantic) continue;
    fs.writeFileSync(file, `# ${semantic}\n`);
  }

  return root;
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("LegalSession", () => {
  it("loads the legal router before every mandatory resource", () => {
    const root = makeCorpus();
    const registry = new LexSkillRegistry(root);
    expect(registry.scan()).toEqual([]);

    const session = new LegalSession(registry);
    const events = session.initializeLegalQuery();

    const skillReads = events.filter((event) => event.type === "skill_read");
    expect(skillReads).toHaveLength(1);
    expect(skillReads[0]?.target).toBe("prawny-router-v3");

    const routerSequence = events.find(
      (event) =>
        event.type === "skill_read" && event.target === "prawny-router-v3"
    )!.sequence;

    for (const resource of CORE_LEGAL_RESOURCES) {
      const read = events.find(
        (event) => event.type === "resource_read" && event.target === resource
      );
      expect(read).toBeDefined();
      expect(read!.sequence).toBeGreaterThan(routerSequence);
      expect(read!.status).toBe("OK");
    }

    expect(session.state).toBe("EXECUTION_READY");
    expect(events.at(-1)).toMatchObject({
      type: "gate",
      target: "G3_ROUTER_FIRST_BOOTSTRAP",
      status: "OK"
    });
  });

  it("fails closed when a mandatory core resource is missing", () => {
    const missing = "shared/PRAWO-HARDGATE.md";
    const root = makeCorpus({ omit: missing });
    const registry = new LexSkillRegistry(root);
    registry.scan();

    const session = new LegalSession(registry);

    expect(() => session.initializeLegalQuery()).toThrow(
      LegalSessionBootstrapError
    );
    expect(session.state).toBe("BLOCKED");
    expect(session.events).toContainEqual(
      expect.objectContaining({
        type: "resource_read",
        target: missing,
        status: "BLOCKED"
      })
    );
  });

  it("fails closed when the legal router is missing", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-session-"));
    roots.push(root);
    fs.mkdirSync(path.join(root, "shared"), { recursive: true });

    const registry = new LexSkillRegistry(root);
    registry.scan();
    const session = new LegalSession(registry);

    expect(() => session.initializeLegalQuery()).toThrow(
      LegalSessionBootstrapError
    );
    expect(session.state).toBe("BLOCKED");
    expect(session.events.at(-1)).toMatchObject({
      type: "skill_read",
      target: "prawny-router-v3",
      status: "BLOCKED"
    });
  });
});
