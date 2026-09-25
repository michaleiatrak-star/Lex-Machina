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
