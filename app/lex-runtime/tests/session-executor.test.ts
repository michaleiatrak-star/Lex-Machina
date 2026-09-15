import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  ProviderGateway,
  ProviderRegistry
} from "../src/providers/gateway.js";
import { ScriptedProviderAdapter } from "../src/providers/scripted-provider.js";
import type { ProviderAdapter } from "../src/providers/types.js";
import { LexSkillRegistry } from "../src/registry.js";
import { SafeSessionExecutor } from "../src/session-executor.js";

const roots: string[] = [];
const DR = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function skill(root: string, name: string): void {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "SKILL.md"),
    `---\nname: ${name}\nversion: "1.0"\ndescription: "test"\n---\n# ${name}\n`
  );
}

function fixture(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-session-"));
  roots.push(root);

  skill(root, "prawny-router-v3");
  skill(root, "prawo-polskie-v2");
  skill(root, DR);

  fs.mkdirSync(path.join(root, "shared"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "shared", "PRAWO-HARDGATE.md"),
    "# hard gate\n"
  );

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
  fs.writeFileSync(
    path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"),
    DR + "\n"
  );

  const registry = new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("SafeSessionExecutor", () => {
  it("returns a draft only after a passing finalization gate", async () => {
    const providers = new ProviderRegistry();
    providers.register(new ScriptedProviderAdapter({ id: "openai" }));

    const executor = new SafeSessionExecutor(
      fixture(),
      new ProviderGateway(providers)
    );

    const result = await executor.execute({
      query: "Techniczny test.",
      provider: "openai",
      model: "test",
      primarySkill: DR,
      mode: "PRAWNIK"
    });

    expect(result.status).toBe("DRAFT_PRESENTABLE");
    expect(result.finalization).toBe("PASS");
    expect(result.answer).toContain("provider:openai:ok");
    expect(result.audit).toMatchObject({
      result: "PASS",
      closed: true
    });
  });

  it("withholds provider output when a legal reference lacks verification", async () => {
    const unsafe: ProviderAdapter = {
      id: "anthropic",
      label: "unsafe-test",
      capabilities: {
        streaming: true,
        tools: true,
        reasoning: true,
        modelDiscovery: false
      },
      async stream() {
        return {
          fullText: "Zastosowanie ma art. 1234 KC."
        };
      }
    };

    const providers = new ProviderRegistry();
    providers.register(unsafe);

    const executor = new SafeSessionExecutor(
      fixture(),
      new ProviderGateway(providers)
    );

    const result = await executor.execute({
      query: "Techniczny test.",
      provider: "anthropic",
      model: "test",
      primarySkill: DR,
      mode: "PRAWNIK"
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.finalization).toBe("BLOCKED");
    expect(result.answer).toBeUndefined();
    expect(JSON.stringify(result)).not.toContain(
      "Zastosowanie ma art. 1234 KC."
    );
    expect(result.blockedReferences).toContainEqual(
      expect.objectContaining({
        claim: "art. 1234 KC",
        status: "MISSING_LEDGER_RECORD"
      })
    );
    expect(result.audit).toMatchObject({
      result: "BLOCKED",
      closed: true
    });
  });
});
