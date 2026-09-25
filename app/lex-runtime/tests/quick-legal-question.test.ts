import { describe, expect, it } from "vitest";
import { CoreLawSearchIndex } from "../src/core-law-search.js";
import { isQuickLegalQuestion } from "../src/quick-legal-question.js";

describe("quick legal question", () => {
  it("accepts one short legal question", () => {
    expect(isQuickLegalQuestion("czy kradzież 600 złotych to przestępstwo czy wykroczenie?")).toBe(true);
    expect(isQuickLegalQuestion("Jaki jest termin na apelację")).toBe(true);
    expect(isQuickLegalQuestion("Ile wynosi termin przedawnienia roszczenia o zapłatę?")).toBe(true);
  });

  it("keeps work products, documents and long facts on the full path", () => {
    expect(isQuickLegalQuestion("Napisz pozew o zapłatę 600 zł?")).toBe(false);
    expect(isQuickLegalQuestion("Przeanalizuj umowę najmu, czy jest ważna?")).toBe(false);
    expect(isQuickLegalQuestion("Czy to przestępstwo? " + "Fakty sprawy. ".repeat(40))).toBe(false);
    expect(isQuickLegalQuestion("ok")).toBe(false);
  });
});

describe("core law search", () => {
  it("finds statutory wording for everyday names of an act", () => {
    const index = new CoreLawSearchIndex([
      { eli: "KW", title: "Kodeks wykroczeń", article: "119", text: "Art. 119. § 1. Kto kradnie lub przywłaszcza sobie cudzą rzecz ruchomą" },
      { eli: "KK", title: "Kodeks karny", article: "278", text: "Art. 278. § 1. Kto zabiera w celu przywłaszczenia cudzą rzecz ruchomą" },
      { eli: "KK", title: "Kodeks karny", article: "148", text: "Art. 148. § 1. Kto zabija człowieka" }
    ]);
    const hits = index.search("czy kradzież 600 złotych to przestępstwo czy wykroczenie?").map((hit) => hit.article);
    expect(hits).toEqual(expect.arrayContaining(["119", "278"]));
    expect(hits).not.toContain("148");
  });
});

describe("matter complexity entry gate", () => {
  it("classifies trivial, simple and standard matters with reasons", async () => {
    const { assessMatterComplexity } = await import("../src/matter-complexity.js");
    expect(assessMatterComplexity({ query: "ok" }).level).toBe("TRIVIAL");
    expect(assessMatterComplexity({ query: "czy kradzież 600 zł to przestępstwo czy wykroczenie?" })).toEqual({ level: "SIMPLE", reasons: [] });
    expect(assessMatterComplexity({ query: "Jaki jest termin na apelację?", attachmentCount: 1 }).reasons).toContain("DOCUMENTS_ATTACHED");
    expect(assessMatterComplexity({ query: "Jaki jest termin na apelację?", workflowPinned: true }).reasons).toContain("WORKFLOW_PINNED");
    expect(assessMatterComplexity({ query: "Jakie jest orzecznictwo SN w sprawie art. 415 KC?" }).reasons).toContain("CASE_LAW_REQUEST");
    expect(
      assessMatterComplexity({ query: "Czy pracodawca, pracownik i świadek mogą zeznawać razem?" }).reasons
    ).toContain("MANY_PARTIES");
    expect(
      assessMatterComplexity({ query: "Czy 1000 zł z 1.02.2024, 2000 zł z 3.04.2024 i 500 zł się przedawniły?" }).reasons
    ).toContain("MANY_FACTS");
    expect(assessMatterComplexity({ query: "Sąsiad zabrał mi rower z klatki schodowej." }).reasons).toContain("NOT_A_QUESTION");
  });
});

describe("quick lane source guard", () => {
  it("accepts only articles given to the model in this turn", async () => {
    const { citedArticles, sourcedArticlesFromPrompt, sourcedArticlesFromToolResult, unsourcedArticles } =
      await import("../src/quick-legal-question.js");
    expect(citedArticles("art. 119 § 1 KW oraz artykułu 278 k.k. i art. 12")).toEqual(["119", "278", "12"]);
    const sourced = new Set([
      ...sourcedArticlesFromPrompt("[DU/2025/734] Kodeks wykroczeń — art. 119\nArt. 119. § 1. Kto kradnie"),
      ...sourcedArticlesFromToolResult("read_core_law_article", JSON.stringify({ status: "OK", article: "278" })),
      ...sourcedArticlesFromToolResult("read_core_law_article", JSON.stringify({ status: "BLOCKED", error: "X" }))
    ]);
    expect([...sourced].sort()).toEqual(["119", "278"]);
    expect(unsourcedArticles("Wykroczenie z art. 119 KW; przy włamaniu art. 279 KK.", sourced)).toEqual(["279"]);
  });
});

describe("quick lane sources: the reported Bielik answer", () => {
  const answer = [
    "**Art. 119 § 1 Kodeksu wykroczeń** (Dz.U. 2022 poz. 2151, tekst jednolity).",
    "- **Źródło**: Weryfikowane automatycznie przez `read_core_law_article` z lokalnej kopii aktu.",
    "- **ELI**: https://eli.ms.gov.pl/eli/du/2022/2151 (aktualny status: obowiązujący).",
    "- **Weryfikacja**: System potwierdza, że próg 800 zł obowiązuje od 1.10.2023 (nowelizacja Dz.U. 2023 poz. 1935)."
  ].join("\n");

  it("flags every reference the model had no source for", async () => {
    const { QuickLaneSources } = await import("../src/quick-legal-question.js");
    const sources = new QuickLaneSources();
    sources.addPrompt("[DU/2025/734] Kodeks wykroczeń — art. 119\nArt. 119. § 1. Kto kradnie");
    expect(sources.unsourced(answer)).toEqual([
      "Dz.U. 2022 poz. 2151",
      "Dz.U. 2023 poz. 1935",
      "https://eli.ms.gov.pl/eli/du/2022/2151",
      "narzędzie read_core_law_article (nie zostało użyte w tej odpowiedzi)"
    ]);
  });

  it("accepts references backed by tool results in the same turn", async () => {
    const { QuickLaneSources } = await import("../src/quick-legal-question.js");
    const sources = new QuickLaneSources();
    sources.addToolResult(
      "read_core_law_article",
      JSON.stringify({ status: "OK", eli: "DU/2025/734", article: "119", sourceUrl: "https://api.sejm.gov.pl/eli/acts/DU/2025/734/text.html", amendmentsAfter: ["DU/2025/1200"] })
    );
    expect(
      sources.unsourced(
        "Art. 119 § 1 KW (Dz.U. z 2025 r. poz. 734), https://api.sejm.gov.pl/eli/acts/DU/2025/734/text.html; zmiana Dz.U. 2025 poz. 1200; źródło: read_core_law_article."
      )
    ).toEqual([]);
  });
});

describe("local reasoning is never shown", () => {
  it("removes think blocks and leading English reasoning before a Polish answer", async () => {
    const { stripLocalReasoning } = await import("../src/providers/ai-sdk-adapter.js");
    expect(stripLocalReasoning("<think>plan</think>\nOdpowiedź: wykroczenie.")).toBe("Odpowiedź: wykroczenie.");
    expect(stripLocalReasoning("plan bez otwarcia</think>Odpowiedź.")).toBe("Odpowiedź.");
    const leaked = [
      "Got it, let's break this down. The user is asking if the information about the theft comes from the model's memory or is verified.",
      "First, I need to recall how the system works. The rules state that I must never cite laws from memory.",
      "Informacja o kwalifikacji kradzieży nie pochodzi z pamięci modelu."
    ].join("\n\n");
    expect(stripLocalReasoning(leaked)).toBe("Informacja o kwalifikacji kradzieży nie pochodzi z pamięci modelu.");
    expect(stripLocalReasoning("This whole answer is English and there is nothing else to show here at all.")).toContain("English");
  });
});

describe("HARD GATE finalization marking", () => {
  it("marks unverified statute and journal references and keeps verified ones", async () => {
    const { FinalizationGate, markUnverifiedReferences } = await import("../src/finalization-gate.js");
    const { VerificationLedger } = await import("../src/verification-ledger.js");
    const ledger = new VerificationLedger();
    const text = "Wykroczenie z art. 119 KW.\nTekst jednolity: Dz.U. 2022 poz. 2151.";
    const gate = new FinalizationGate();
    const before = gate.evaluate(text, ledger);
    expect(before.result).toBe("BLOCKED");
    const marked = markUnverifiedReferences(text, before);
    expect(marked).toBe("Wykroczenie z art. 119 KW ⚠️ [NIEWERYFIKOWANE].\nTekst jednolity: Dz.U. 2022 poz. 2151 ⚠️ [NIEWERYFIKOWANE].");
    expect(gate.evaluate(marked, ledger).result).toBe("DEGRADED");
  });
});
