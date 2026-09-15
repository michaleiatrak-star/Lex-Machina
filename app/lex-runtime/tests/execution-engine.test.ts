import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LexExecutionEngine } from "../src/execution-engine.js";
import { LexSkillRegistry } from "../src/registry.js";
import { ProviderGateway, ProviderRegistry } from "../src/providers/gateway.js";
import { ScriptedProviderAdapter } from "../src/providers/scripted-provider.js";

const roots: string[] = [];

function createSkill(
  root: string,
  name: string,
  body = `# ${name}\n`
): void {
  const directory = path.join(root, name);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, "SKILL.md"),
    `---\nname: ${name}\n---\n${body}`
  );
}

function fixture(options?: { omitRoutingMap?: boolean }): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-engine-"));
  roots.push(root);

  createSkill(root, "shared");
  createSkill(root, "prawny-router-v3");
  createSkill(root, "prawo-polskie-v2");
  createSkill(root, "dr-02-prawo-cywilne-rodzinne-gospodarcze");

  fs.mkdirSync(path.join(root, "shared"), { recursive: true });
  fs.writeFileSync(path.join(root, "shared", "PRAWO-HARDGATE.md"), "# hard gate\n");

  const router = path.join(root, "prawny-router-v3");
  fs.mkdirSync(path.join(router, "references"), { recursive: true });
  fs.writeFileSync(
    path.join(router, "references", "KROK0A-anonimizer.md"),
    "# anon\n"
  );
  fs.writeFileSync(
    path.join(router, "references", "KROK1-detekcja.md"),
    "# detect\n"
  );

  if (!options?.omitRoutingMap) {
    fs.writeFileSync(
      path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"),
      "# routing\n"
    );
  }

  const registry = new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

function engine(registry: LexSkillRegistry): LexExecutionEngine {
  const providers = new ProviderRegistry();
  providers.register(new ScriptedProviderAdapter({ id: "openai" }));
  providers.register(new ScriptedProviderAdapter({ id: "anthropic" }));
  providers.register(new ScriptedProviderAdapter({ id: "xai" }));
  return new LexExecutionEngine(registry, new ProviderGateway(providers));
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("LexExecutionEngine", () => {
  it("enforces router → prawo-polskie → routing map → one DR → provider", async () => {
    const registry = fixture();
    const result = await engine(registry).executePolishLegalQuery({
      query: "Spór o wykonanie umowy.",
      provider: "openai",
      model: "test-model",
      route: {
        jurisdiction: "PL",
        primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
        mode: "PRAWNIK"
      }
    });

    const orderedTargets = result.events
      .filter((event) =>
        ["skill_read", "resource_read", "route", "provider_start"].includes(
          event.type
        )
      )
      .map((event) => event.target);

    expect(orderedTargets.indexOf("prawny-router-v3")).toBeGreaterThanOrEqual(0);
    expect(orderedTargets.indexOf("prawo-polskie-v2")).toBeGreaterThan(
      orderedTargets.indexOf("prawny-router-v3")
    );
    expect(
      orderedTargets.indexOf("prawo-polskie-v2/ROUTING-MAP.md")
    ).toBeGreaterThan(orderedTargets.indexOf("prawo-polskie-v2"));
    expect(
      orderedTargets.indexOf("dr-02-prawo-cywilne-rodzinne-gospodarcze")
    ).toBeGreaterThan(
      orderedTargets.indexOf("prawo-polskie-v2/ROUTING-MAP.md")
    );
    expect(orderedTargets.indexOf("openai")).toBeGreaterThan(
      orderedTargets.indexOf("dr-02-prawo-cywilne-rodzinne-gospodarcze")
    );

    expect(result.events.at(-1)).toMatchObject({
      type: "gate",
      target: "G7_VERTICAL_SLICE",
      status: "OK"
    });
  });

  it("runs the same orchestration contract for xAI", async () => {
    const registry = fixture();
    const result = await engine(registry).executePolishLegalQuery({
      query: "Umowa.",
      provider: "xai",
      model: "grok-test",
      route: {
        jurisdiction: "PL",
        primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
        mode: "LAIK"
      }
    });

    expect(result.provider).toBe("xai");
    expect(result.output).toContain("xai");
  });

  it("fails closed when ROUTING-MAP is missing", async () => {
    const registry = fixture({ omitRoutingMap: true });

    await expect(
      engine(registry).executePolishLegalQuery({
        query: "Umowa.",
        provider: "anthropic",
        model: "claude-test",
        route: {
          jurisdiction: "PL",
          primarySkill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
          mode: "PRAWNIK"
        }
      })
    ).rejects.toMatchObject({
      target: "prawo-polskie-v2/ROUTING-MAP.md"
    });
  });

  it("rejects a non-DR primary skill", async () => {
    const registry = fixture();

    await expect(
      engine(registry).executePolishLegalQuery({
        query: "Umowa.",
        provider: "openai",
        model: "test",
        route: {
          jurisdiction: "PL",
          primarySkill: "prawo-polskie-v2",
          mode: "PRAWNIK"
        }
      })
    ).rejects.toMatchObject({
      target: "prawo-polskie-v2"
    });
  });
});
