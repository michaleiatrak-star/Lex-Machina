import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildCoreLegalResourcePrompt,
  isLocalLightweightConversation,
  latestUserTurn,
  LexExecutionEngine
} from "../src/execution-engine.js";
import { LexSkillRegistry } from "../src/registry.js";
import { ProviderGateway, ProviderRegistry } from "../src/providers/gateway.js";
import { ScriptedProviderAdapter } from "../src/providers/scripted-provider.js";
import type {
  ProviderAdapter,
  ProviderStreamParams,
  ProviderStreamResult
} from "../src/providers/types.js";

const roots: string[] = [];
const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

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

function fixture(options?: {
  omitRoutingMap?: boolean;
  omitDrFromRoutingMap?: boolean;
}): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-engine-"));
  roots.push(root);

  createSkill(root, "shared");
  createSkill(root, "prawny-router-v3");
  createSkill(root, "prawo-polskie-v2");
  createSkill(root, DR02);

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
      options?.omitDrFromRoutingMap
        ? "# routing without selected DR\n"
        : `# routing\n- ${DR02}\n`
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

describe("local core resource prompt", () => {
  it("keeps runtime-enforced local hard gates compact", () => {
    const huge =
      "x".repeat(
        60_000
      );
    const resources =
      new Map([
        [
          "shared/PRAWO-HARDGATE.md",
          huge
        ],
        [
          "references/KROK0A-anonimizer.md",
          huge
        ],
        [
          "references/KROK1-detekcja.md",
          huge
        ]
      ]);

    const local =
      buildCoreLegalResourcePrompt(
        resources,
        true
      );
    const cloud =
      buildCoreLegalResourcePrompt(
        resources,
        false
      );

    expect(
      local.length
    ).toBeLessThan(
      2_000
    );
    expect(
      local
    ).not.toContain(
      huge
    );
    expect(
      cloud.length
    ).toBeGreaterThan(
      180_000
    );
  });
});

describe("local lightweight conversation", () => {
  it("bypasses the heavy legal prompt only for explicit trivial local chat", () => {
    expect(
      isLocalLightweightConversation(
        "local/mistral-nemo-12b-q4km",
        "napisz ok",
        false
      )
    ).toBe(true);
    expect(
      isLocalLightweightConversation(
        "local/bielik-11b-v3-q4km",
        "Cześć!",
        false
      )
    ).toBe(true);
    expect(
      isLocalLightweightConversation(
        "local/mistral-nemo-12b-q4km",
        "przeanalizuj art. 471 k.c.",
        false
      )
    ).toBe(false);
    expect(
      isLocalLightweightConversation(
        "local/mistral-nemo-12b-q4km",
        "napisz ok",
        true
      )
    ).toBe(true);
    // Earlier turns of the conversation must not hide a trivial command.
    expect(
      isLocalLightweightConversation(
        "local/bielik-11b-v3-q4km",
        "Użytkownik: napisz ok\n\nAsystent: Nie udało się.\n\nUżytkownik: Napisz ok",
        false
      )
    ).toBe(true);
    expect(
      isLocalLightweightConversation(
        "local/bielik-11b-v3-q4km",
        "Użytkownik: napisz ok\n\nAsystent: ok\n\nUżytkownik: przeanalizuj art. 471 k.c.",
        false
      )
    ).toBe(false);
    expect(
      latestUserTurn(
        "Użytkownik: a\n\nAsystent: b\n\nUżytkownik: c"
      )
    ).toBe("c");
    expect(
      isLocalLightweightConversation(
        "gpt-5.6-luna",
        "napisz ok",
        false
      )
    ).toBe(false);
  });
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
        primarySkill: DR02,
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
    expect(orderedTargets.indexOf(DR02)).toBeGreaterThan(
      orderedTargets.indexOf("prawo-polskie-v2/ROUTING-MAP.md")
    );
    expect(orderedTargets.indexOf("openai")).toBeGreaterThan(
      orderedTargets.indexOf(DR02)
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
        primarySkill: DR02,
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
          primarySkill: DR02,
          mode: "PRAWNIK"
        }
      })
    ).rejects.toMatchObject({
      target: "prawo-polskie-v2/ROUTING-MAP.md"
    });
  });

  it("fails closed when the selected DR is absent from ROUTING-MAP", async () => {
    const registry = fixture({ omitDrFromRoutingMap: true });

    await expect(
      engine(registry).executePolishLegalQuery({
        query: "Umowa.",
        provider: "openai",
        model: "test",
        route: {
          jurisdiction: "PL",
          primarySkill: DR02,
          mode: "PRAWNIK"
        }
      })
    ).rejects.toMatchObject({
      target: DR02
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


const DR03 = "dr-03-prawo-karne-wykroczenia-egzekucja";

class CapturingAdapter implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly label = "capture";
  readonly capabilities = {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };
  readonly calls: ProviderStreamParams[] = [];

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    this.calls.push(params);
    return { fullText: "Odpowiedź." };
  }
}

function capturingEngine(
  registry: LexSkillRegistry
): { engine: LexExecutionEngine; adapter: CapturingAdapter } {
  const providers = new ProviderRegistry();
  const adapter = new CapturingAdapter();
  providers.register(adapter);
  return {
    engine: new LexExecutionEngine(registry, new ProviderGateway(providers)),
    adapter
  };
}

function criminalFixture(withQualifier: boolean): LexSkillRegistry {
  const registry = fixture();
  const root = path.dirname(registry.get("shared")!.directory);
  createSkill(root, DR03);
  fs.appendFileSync(
    path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"),
    `- ${DR03}\n`
  );
  if (withQualifier) {
    fs.mkdirSync(path.join(root, DR03, "modules"), { recursive: true });
    fs.writeFileSync(
      path.join(root, DR03, "modules", "mod-KK-kwalifikator-karnomaterialny.md"),
      "# KWALIFIKATOR INDEX\n"
    );
  }
  const rescanned = new LexSkillRegistry(root);
  rescanned.scan();
  return rescanned;
}

describe("legal skill loading scope", () => {
  it("answers a router-classified non-legal message without loading legal skills", async () => {
    const { engine: lex, adapter } = capturingEngine(fixture());
    const result = await lex.executePolishLegalQuery({
      query: "Cześć, jak się masz?",
      conversationalOnly: true,
      provider: "openai",
      model: "account/openai/default",
      route: { jurisdiction: "PL", primarySkill: DR02, mode: "LAIK" }
    });

    expect(adapter.calls).toHaveLength(1);
    expect(adapter.calls[0]?.systemPrompt).toContain("niezwiązaną z prawem");
    expect(adapter.calls[0]?.systemPrompt).not.toContain("# SKILL:");
    expect(adapter.calls[0]?.tools ?? []).toEqual([]);
    expect(result.domainSkills).toEqual([]);
    expect(result.executionSkills).toEqual([]);
    expect(result.events.at(-1)).toMatchObject({
      target: "G7_VERTICAL_SLICE",
      detail: "conversational-non-legal"
    });
  });

  it("keeps the full legal path when documents are attached", async () => {
    const { engine: lex, adapter } = capturingEngine(fixture());
    await lex.executePolishLegalQuery({
      query: "Co o tym sądzisz?",
      documentContext: "[DOCUMENT doc-1] umowa najmu",
      conversationalOnly: true,
      provider: "openai",
      model: "account/openai/default",
      route: { jurisdiction: "PL", primarySkill: DR02, mode: "LAIK" }
    });

    expect(adapter.calls[0]?.systemPrompt).toContain("# SKILL:");
    expect(adapter.calls[0]?.systemPrompt).not.toContain("niezwiązaną z prawem");
  });

  it("preloads the criminal qualifier index for every DR-03 matter", async () => {
    const { engine: lex, adapter } = capturingEngine(criminalFixture(true));
    const result = await lex.executePolishLegalQuery({
      query: "Kolega zabrał mi telefon.",
      provider: "openai",
      model: "account/openai/default",
      route: { jurisdiction: "PL", primarySkill: DR03, mode: "LAIK" }
    });

    expect(adapter.calls[0]?.systemPrompt).toContain("# KWALIFIKATOR INDEX");
    expect(
      result.events.some(
        (event) =>
          event.type === "resource_read" &&
          event.target ===
            `${DR03}/modules/mod-KK-kwalifikator-karnomaterialny.md` &&
          event.status === "OK"
      )
    ).toBe(true);
  });

  it("fails closed when the criminal qualifier module is missing", async () => {
    const { engine: lex } = capturingEngine(criminalFixture(false));
    await expect(
      lex.executePolishLegalQuery({
        query: "Kolega zabrał mi telefon.",
        provider: "openai",
        model: "account/openai/default",
        route: { jurisdiction: "PL", primarySkill: DR03, mode: "LAIK" }
      })
    ).rejects.toThrow("criminal-law qualifier");
  });
});

describe("local legal prompt size", () => {
  it("gives local models a digest of long skills and a pointer to the full text", async () => {
    const { localSkillDigest } = await import("../src/execution-engine.js");
    const body = [
      "# DR-02",
      "Wstęp ".repeat(4000),
      "## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI",
      "Zwykły akapit bez reguł.",
      "NIGDY nie podawaj artykułu wyłącznie z pamięci."
    ].join("\n");
    const digest = localSkillDigest("dr-02-x", "Opis domeny.", body);
    expect(digest.length).toBeLessThan(3_200);
    expect(digest).toContain("HARD GATE");
    expect(digest).toContain("NIGDY nie podawaj");
    expect(digest).not.toContain("Zwykły akapit");
    expect(digest).toContain('read_legal_resource "dr-02-x/SKILL.md"');
  });

  it("uses the digest for local models and the full body for cloud models", async () => {
    const registry = fixture();
    const root = path.dirname(registry.get("shared")!.directory);
    fs.writeFileSync(
      path.join(root, DR02, "SKILL.md"),
      `---\nname: ${DR02}\ndescription: Prawo cywilne.\n---\n# DR02\n${"Treść ".repeat(3000)}\n`
    );
    const rescanned = new LexSkillRegistry(root);
    rescanned.scan();
    const local = capturingEngine(rescanned);
    await local.engine.executePolishLegalQuery({
      query: "Spór o zapłatę faktury.",
      provider: "openai",
      model: "local/bielik-11b-v3-q4km",
      route: { jurisdiction: "PL", primarySkill: DR02, mode: "LAIK" }
    });
    const cloud = capturingEngine(rescanned);
    await cloud.engine.executePolishLegalQuery({
      query: "Spór o zapłatę faktury.",
      provider: "openai",
      model: "account/openai/default",
      route: { jurisdiction: "PL", primarySkill: DR02, mode: "LAIK" }
    });
    expect(local.adapter.calls[0]?.systemPrompt).toContain(`# SKILL (DIGEST): ${DR02}`);
    expect(cloud.adapter.calls[0]?.systemPrompt).toContain(`# SKILL: ${DR02}`);
    expect(
      local.adapter.calls[0]!.systemPrompt!.length
    ).toBeLessThan(cloud.adapter.calls[0]!.systemPrompt!.length / 2);
  });

  it("forwards live draft callbacks to the provider", async () => {
    const { engine: lex, adapter } = capturingEngine(fixture());
    const deltas: string[] = [];
    await lex.executePolishLegalQuery({
      query: "Spór o zapłatę faktury.",
      provider: "openai",
      model: "account/openai/default",
      route: { jurisdiction: "PL", primarySkill: DR02, mode: "LAIK" },
      draftCallbacks: { onContentDelta: (text: string) => deltas.push(text) }
    });
    adapter.calls[0]?.callbacks?.onContentDelta?.("abc");
    expect(deltas).toEqual(["abc"]);
  });
});

describe("local quick legal lane", () => {
  function quickFixture(): LexSkillRegistry {
    const registry = criminalFixture(true);
    const root = path.dirname(registry.get("shared")!.directory);
    fs.writeFileSync(
      path.join(root, DR03, "modules", "mod-KK-kwalifikator-karnomaterialny.md"),
      "# KWALIFIKATOR INDEX\n\n## ZASADA NACZELNA\n\n> Nigdy nie kwalifikuj czynu bez przejścia przez drzewo.\n\n---\n\n## TABELA NAWIGACYJNA\n" +
        "| A | kradzieże | `part-01.md` |\n".repeat(200)
    );
    const parts = path.join(root, DR03, "modules", "kwalifikator-karnomaterialny");
    fs.mkdirSync(parts, { recursive: true });
    fs.writeFileSync(
      path.join(parts, "part-01-mienie.md"),
      [
        "# część 1",
        "### WĘZEŁ WARTOŚCI [A.1-W] — Kradzież bez przemocy",
        "JAKA JEST WARTOŚĆ SKRADZIONEGO MIENIA? próg → wykroczenie kradzieży albo przestępstwo kradzieży, zależnie od wartości mienia.",
        "### DRZEWO L.1 — USZKODZENIE MIENIA",
        "Czy rzecz zniszczono lub uszkodzono? Wtedy blok L, nie kradzież; ocena według rozmiaru szkody i zamiaru sprawcy."
      ].join("\n")
    );
    const rescanned = new LexSkillRegistry(root);
    rescanned.scan();
    return rescanned;
  }

  const tools = ["read_legal_resource", "search_core_law", "read_core_law_article", "web_search"].map((name) => ({
    type: "function" as const,
    function: { name, description: name, parameters: { type: "object", properties: {} } }
  }));

  it("answers a short criminal question from the matching qualifier nodes and core-law texts", async () => {
    const { engine: lex, adapter } = capturingEngine(quickFixture());
    const result = await lex.executePolishLegalQuery({
      query: "czy kradzież 600 złotych to przestępstwo czy wykroczenie?",
      provider: "openai",
      model: "local/mistral-nemo-12b-q4km",
      route: { jurisdiction: "PL", primarySkill: DR03, mode: "LAIK" },
      tools: tools as never,
      runTools: async () => [],
      toolSystemPromptAppendix: "# FULL TOOL APPENDIX",
      quickLocalLegal: { toolPrompt: "# LOKALNE TEKSTY USTAW\n[DU/2025/734] art. 119" }
    });
    const call = adapter.calls[0]!;
    expect(call.systemPrompt).toContain("SZYBKA ODPOWIEDŹ PRAWNA");
    expect(call.systemPrompt).toContain("WĘZEŁ WARTOŚCI [A.1-W]");
    expect(call.systemPrompt).toContain("Nigdy nie kwalifikuj czynu");
    expect(call.systemPrompt).toContain("[DU/2025/734] art. 119");
    // Neither the qualifier's navigation table, the unrelated node nor the
    // full tool appendix is read by the local model.
    expect(call.systemPrompt).not.toContain("TABELA NAWIGACYJNA");
    expect(call.systemPrompt).not.toContain("USZKODZENIE MIENIA");
    expect(call.systemPrompt).not.toContain("# FULL TOOL APPENDIX");
    expect(call.tools?.map((tool) => tool.function.name)).toEqual(["search_core_law", "read_core_law_article"]);
    expect(call.maxIterations).toBe(3);
    expect(call.localMaxOutputTokens).toBe(900);
    expect(result.events.some((event) => event.target === "LOCAL_QUICK_LEGAL" && event.status === "OK")).toBe(true);
    expect(
      result.events.some((event) =>
        event.type === "resource_read" &&
        event.target.endsWith("kwalifikator-karnomaterialny/part-01-mienie.md")
      )
    ).toBe(true);
  });

  it("keeps the full legal path for drafting, cloud models and missing core-law texts", async () => {
    for (const variant of [
      { query: "Napisz zawiadomienie o kradzieży 600 zł.", model: "local/mistral-nemo-12b-q4km", quick: true },
      { query: "czy kradzież 600 złotych to przestępstwo?", model: "account/openai/default", quick: true },
      { query: "czy kradzież 600 złotych to przestępstwo?", model: "local/mistral-nemo-12b-q4km", quick: false }
    ]) {
      const { engine: lex, adapter } = capturingEngine(quickFixture());
      await lex.executePolishLegalQuery({
        query: variant.query,
        provider: "openai",
        model: variant.model,
        route: { jurisdiction: "PL", primarySkill: DR03, mode: "LAIK" },
        ...(variant.quick ? { quickLocalLegal: { toolPrompt: "# LOKALNE TEKSTY" } } : {})
      });
      expect(adapter.calls[0]?.systemPrompt).not.toContain("SZYBKA ODPOWIEDŹ PRAWNA");
    }
  });
});
