import { describe, expect, it } from "vitest";
import type { IngestedPage } from "../src/document-ingestion.js";
import { acceptableFix, candidateWord, LocalOcrCorrector } from "../src/ocr-correction.js";

const DICTIONARY = new Set(["umowa", "najmu", "lokalu", "zawarta", "dnia", "w", "Warszawie", "między", "najemca", "zapłaty", "czynszu", "Kowalski"]);
const known = async (words: string[]) => words.map((word) => DICTIONARY.has(word));

function scan(lines: Array<[string, number]>): IngestedPage {
  return {
    page: 1,
    text: lines.map(([text]) => text).join("\n"),
    source: "OCR",
    lines: lines.map(([text, score]) => ({ text, score, box: [0, 0, 10, 10] }))
  };
}

describe("OCR correction with the local model", () => {
  it("accepts only small, letter-only fixes that keep capitalization", () => {
    expect(acceptableFix("urnowa", "umowa")).toBe(true);
    expect(acceptableFix("zaplaty", "zapłaty")).toBe(true);
    expect(acceptableFix("Warszawle", "Warszawie")).toBe(true);
    expect(acceptableFix("Kowalskl", "Kowalski")).toBe(true);
    expect(acceptableFix("Kowalsky", "Nowakowski")).toBe(false);
    expect(acceptableFix("urnowa", "Umowa")).toBe(false);
    expect(acceptableFix("najmu", "najmu 12")).toBe(false);
    expect(acceptableFix("czynszu", "opłaty")).toBe(false);
  });

  it("never checks numbers or identifiers", () => {
    expect(candidateWord("12345")).toBe(false);
    expect(candidateWord("KW1")).toBe(false);
    expect(candidateWord("WA1M")).toBe(false);
    expect(candidateWord("d0kument")).toBe(true);
    expect(candidateWord("najmu")).toBe(true);
  });

  it("applies validated fixes, keeps the originals and rejects the rest", async () => {
    const asked: string[] = [];
    const corrector = new LocalOcrCorrector(
      () => async (_system, content) => {
        asked.push(content);
        return JSON.stringify([
          { id: 1, from: "urnowa", to: "umowa" },
          { id: 1, from: "Warszawle", to: "Warszawie" },
          // Not a small edit: rejected.
          { id: 2, from: "zaplaty", to: "opłaty" },
          // Not in the dictionary: rejected.
          { id: 2, from: "czynsza", to: "czynszy" },
          // A number: never.
          { id: 2, from: "1500", to: "1800" }
        ]);
      },
      known
    );
    const page = scan([
      ["urnowa najmu zawarta w Warszawle", 0.7],
      ["zaplaty czynsza 1500 zł", 0.6],
      ["Kowalski najemca", 0.99]
    ]);
    const fixed = await corrector.correct(page);
    expect(fixed.text).toBe("umowa najmu zawarta w Warszawie\nzaplaty czynsza 1500 zł\nKowalski najemca");
    expect(fixed.corrections).toEqual([
      { line: 0, from: "urnowa", to: "umowa" },
      { line: 0, from: "Warszawle", to: "Warszawie" }
    ]);
    expect(fixed.lines![0]!.text).toBe("umowa najmu zawarta w Warszawie");
    // Only suspicious words are marked; the good line is not sent.
    expect(asked.join("\n")).toContain("⟦urnowa⟧");
    expect(asked.join("\n")).not.toContain("Kowalski najemca");
  });

  it("leaves digital pages alone and needs a running model for OCR pages", async () => {
    const corrector = new LocalOcrCorrector(() => null, known);
    const digital: IngestedPage = { page: 1, text: "urnowa", source: "DIGITAL" };
    expect(await corrector.correct(digital)).toBe(digital);
    await expect(corrector.correct(scan([["urnowa", 0.5]]))).rejects.toThrow("LOCAL_PRIVACY_MODEL_NOT_READY");
  });
});
