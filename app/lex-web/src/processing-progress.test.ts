import { describe, expect, it } from "vitest";
import { progressLabel, progressPercent } from "./processing-progress.js";

describe("processing progress", () => {
  it("maps stages and page counts onto one bar", () => {
    expect(progressPercent({ stage: "READING" })).toBe(0);
    expect(progressPercent({ stage: "OCR", done: 0, total: 10 })).toBe(5);
    expect(progressPercent({ stage: "OCR", done: 5, total: 10 })).toBe(33);
    expect(progressPercent({ stage: "OCR", done: 10, total: 10 })).toBe(60);
    expect(progressPercent({ stage: "DETECTING", done: 1, total: 2 })).toBe(66);
    expect(progressPercent({ stage: "AI_CHECK", done: 1, total: 2 })).toBe(79);
    expect(progressPercent({ stage: "SAVING" })).toBe(96);
  });

  it("names the stage and page", () => {
    expect(progressLabel({ stage: "OCR", done: 3, total: 12 })).toBe("OCR: 3 z 12 stron");
    expect(progressLabel({ stage: "DETECTING", done: 0, total: 4 })).toBe("Wykrywanie danych osobowych: strona 1 z 4");
    expect(progressLabel({ stage: "SAVING" })).toBe("Zapis zaszyfrowanego klucza…");
    expect(progressLabel({ stage: "AI_CHECK", done: 2, total: 5, item: "s. 1: Bank, Rada" })).toBe(
      "Lokalne AI sprawdza w kontekście zdania: s. 1: Bank, Rada (2 z 5 sprawdzonych)"
    );
  });
});
