import { describe, expect, it } from "vitest";
import type { IngestedPage } from "../src/document-ingestion.js";
import { acceptableFix, candidateWord, LocalOcrCorrector, normalizeOcrLine } from "../src/ocr-correction.js";

const DICTIONARY = new Set([
  "umowa", "najmu", "lokalu", "zawarta", "dnia", "w", "Warszawie", "między", "najemca", "zapłaty", "czynszu",
  "Kowalski", "sąd", "sad", "rejonowy", "oddalił", "powództwo", "strona", "nie", "wykonała", "zobowiązania",
  "żona", "zona", "zeznała", "że", "ze", "świadek", "był", "obecny", "kwoty", "do", "zł", "firma"
]);
const known = async (words: string[]) => words.map((word) => DICTIONARY.has(word));

function scan(lines: Array<[string, number]>): IngestedPage {
  return {
    page: 1,
    text: lines.map(([text]) => text).join("\n"),
    source: "OCR",
    lines: lines.map(([text, score]) => ({ text, score, box: [0, 0, 10, 10] }))
  };
}

function corrector(answer: unknown[], asked: string[] = []) {
  return new LocalOcrCorrector(
    () => async (_system, content) => {
      asked.push(content);
      return JSON.stringify(answer);
    },
    known
  );
}

describe("OCR correction with the local model", () => {
  it("accepts small fixes, splits, merges and dropped symbols; keeps negations and capitalization", () => {
    expect(acceptableFix("urnowa", "umowa")).toBe(true);
    expect(acceptableFix("zaplaty", "zapłaty")).toBe(true);
    expect(acceptableFix("Kowalskl", "Kowalski")).toBe(true);
    expect(acceptableFix("zawartaw", "zawarta w")).toBe(true);
    expect(acceptableFix("umo wa", "umowa")).toBe(true);
    expect(acceptableFix("um|owa", "umowa")).toBe(true);
    expect(acceptableFix("najemca ~", "najemca")).toBe(true);
    expect(acceptableFix("Kowalsky", "Nowakowski")).toBe(false);
    expect(acceptableFix("urnowa", "Umowa")).toBe(false);
    expect(acceptableFix("czynszu", "opłaty")).toBe(false);
    // Negation added or removed: never.
    expect(acceptableFix("wykonała", "nie wykonała")).toBe(false);
    expect(acceptableFix("niewykonała", "wykonała")).toBe(false);
    // Symbols that mean something are not artifacts.
    expect(acceptableFix("§ 5", "5")).toBe(false);
  });

  it("never checks numbers or identifiers", () => {
    expect(candidateWord("12345")).toBe(false);
    expect(candidateWord("KW1")).toBe(false);
    expect(candidateWord("d0kument")).toBe(true);
  });

  it("cleans ligatures, invisible characters and look-alike letters without the model", () => {
    const cyrillicA = "\u0430";
    const result = normalizeOcrLine(`ﬁrma Kowalski­ego w Warsz${cyrillicA}​wie dnia`);
    expect(result.text).toBe("firma Kowalskiego w Warszawie dnia");
    expect(result.fixes).toContainEqual({ from: "ﬁ", to: "fi" });
    expect(result.fixes).toContainEqual({ from: `Warsz${cyrillicA}wie`, to: "Warszawie" });
    // A word written in Cyrillic stays as it is.
    expect(normalizeOcrLine("сок").text).toBe("сок");
  });

  it("reads whole passages and fixes words, real-word diacritics, splits, symbols and hyphenation", async () => {
    const asked: string[] = [];
    const page = scan([
      ["urnowa najmu lokalu zawartaw Warszawie", 0.7],
      ["Sad rejonowy oddalił powództwo. Świadek | zeznała, ze", 0.6],
      ["zona była obecny do zapła-", 0.6],
      ["ty kwoty 1500 zł. Kowalski najemca", 0.99]
    ]);
    const fixed = await corrector(
      [
        { line: 1, from: "urnowa", to: "umowa" },
        { line: 1, from: "zawartaw", to: "zawarta w" },
        // A dictionary word, diacritics only, badly read line: accepted.
        { line: 2, from: "ze", to: "że" },
        // A stray symbol dropped.
        { line: 2, from: "Świadek |", to: "Świadek" },
        { line: 3, from: "zona", to: "żona" },
        { line: 3, from: "zapła- ty", to: "zapłaty" },
        // Not diacritics only on a dictionary word: rejected.
        { line: 3, from: "obecny", to: "obecna" },
        // A number: rejected.
        { line: 4, from: "1500", to: "1800" },
        // A well read line is not open to fixes.
        { line: 4, from: "Kowalski", to: "Kowalska" }
      ],
      asked
    ).correct(page);

    expect(fixed.text).toBe(
      "umowa najmu lokalu zawarta w Warszawie\n" +
        "Sad rejonowy oddalił powództwo. Świadek zeznała, że\n" +
        "żona była obecny do zapłaty\n" +
        "kwoty 1500 zł. Kowalski najemca"
    );
    expect(fixed.corrections).toEqual([
      { line: 0, from: "urnowa", to: "umowa" },
      { line: 0, from: "zawartaw", to: "zawarta w" },
      { line: 1, from: "ze", to: "że" },
      { line: 1, from: "Świadek |", to: "Świadek" },
      { line: 2, from: "zona", to: "żona" },
      { line: 2, from: "zapła- / ty", to: "zapłaty" }
    ]);
    // Whole passages with line numbers, unknown words and uncertain lines marked.
    expect(asked[0]).toContain("[L1]? ⟦urnowa⟧");
    expect(asked[0]).toContain("[L4] ty kwoty");
  });

  it("leaves digital pages alone and needs a running model for OCR pages", async () => {
    const none = new LocalOcrCorrector(() => null, known);
    const digital: IngestedPage = { page: 1, text: "urnowa", source: "DIGITAL" };
    expect(await none.correct(digital)).toBe(digital);
    await expect(none.correct(scan([["urnowa", 0.5]]))).rejects.toThrow("LOCAL_PRIVACY_MODEL_NOT_READY");
  });
});
