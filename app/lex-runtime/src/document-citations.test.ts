import { describe, expect, it } from "vitest";
import {
  processDocumentCitationMarkers
} from "./document-citations.js";

const attachments = [
  {
    caseId: "case_" + "a".repeat(32),
    documentId: "document_" + "b".repeat(32),
    sourceScope: "MANUAL" as const,
    chunks: [
      {
        index: 1,
        pageStart: 3,
        pageEnd: 3,
        text: "[STRONA 3 · DIGITAL]\nPozwany zobowiązał się zapłacić kwotę 10 000 zł do dnia 15 maja 2026 r. Pozostała część dokumentu."
      }
    ]
  }
];

describe("local document citations", () => {
  it("creates an in-chat reference and exact highlight only for a real attached chunk", () => {
    const result = processDocumentCitationMarkers(
      `Z dokumentu wynika: „Pozwany zobowiązał się zapłacić kwotę 10 000 zł do dnia 15 maja 2026 r.”[[LEXDOC:${attachments[0]!.documentId}:1]]`,
      attachments
    );

    expect(result.rejectedMarkers).toBe(0);
    expect(result.text).toContain("[[LEXDOCREF:docref_1]]");
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]?.pageStart).toBe(3);
    expect(result.citations[0]?.highlightStart).toBeGreaterThanOrEqual(0);
    expect(result.citations[0]?.contextText.slice(
      result.citations[0]?.highlightStart,
      result.citations[0]?.highlightEnd
    )).toContain("Pozwany zobowiązał się zapłacić");
  });

  it("drops an invented marker instead of exposing a fake deep link", () => {
    const result = processDocumentCitationMarkers(
      "Rzekomy cytat. [[LEXDOC:document_ffffffffffffffffffffffffffffffff:99]]",
      attachments
    );

    expect(result.rejectedMarkers).toBe(1);
    expect(result.citations).toEqual([]);
    expect(result.text).not.toContain("LEXDOC");
  });

  it("links a real chunk without claiming a highlight when the wording is not verbatim", () => {
    const result = processDocumentCitationMarkers(
      `Dokument wskazuje termin zapłaty.[[LEXDOC:${attachments[0]!.documentId}:1]]`,
      attachments
    );

    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]?.highlightStart).toBeUndefined();
    expect(result.citations[0]?.highlightEnd).toBeUndefined();
  });
});
