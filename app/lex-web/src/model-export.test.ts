import { describe, expect, it } from "vitest";
import { modelExportFilename, modelExportText } from "./model-export.js";

describe("anonymized document for an external model", () => {
  it("puts the legend and key first, then the pages", () => {
    const text = modelExportText({
      filename: "umowa.pdf",
      modelKey: "# LEGENDA: JAK ODPOWIADAĆ\n# KLUCZ SYMBOLI ZASTĘPCZYCH (HARD GATE)\n- [PII:PERSON:0001]: osoba, rodzaj żeński",
      totalPages: 2,
      chunks: [
        { pageStart: 1, pageEnd: 1, text: "Najemca [PII:PERSON:0001] płaci czynsz." },
        { pageStart: 2, pageEnd: 2, text: "Koniec." }
      ]
    });
    expect(text.indexOf("# LEGENDA")).toBe(0);
    expect(text.indexOf("KLUCZ SYMBOLI")).toBeLessThan(text.indexOf("=== STRONA 1/2 ==="));
    expect(text).toContain("=== STRONA 2/2 ===\nKoniec.");
    expect(modelExportFilename("umowa.pdf")).toBe("umowa-dla-modelu.txt");
  });
});
