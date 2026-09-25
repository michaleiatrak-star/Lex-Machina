import { describe, expect, it } from "vitest";
import { CompleteDocumentIngestor } from "../src/document-ingestion.js";
import { LocalPrivateDocumentService, replaceOutsideTokens } from "../src/document-service.js";
import { PERSON_CASES, type PersonEntity, type PersonMorphology } from "../src/privacy/person-morphology.js";

const FORMS: Record<string, string> = {
  NOM: "Adam Zieliński",
  GEN: "Adama Zielińskiego",
  DAT: "Adamowi Zielińskiemu",
  ACC: "Adama Zielińskiego",
  INS: "Adamem Zielińskim",
  LOC: "Adamie Zielińskim",
  VOC: "Adamie Zieliński"
};

const morphology: PersonMorphology = {
  async analyze(surfaces) {
    return surfaces.map((surface): PersonEntity | null =>
      Object.values(FORMS).includes(surface)
        ? {
            canonical: FORMS.NOM!,
            gender: "m1",
            genderAlternatives: [],
            status: "ok",
            forms: Object.fromEntries(
              PERSON_CASES.map((personCase) => [personCase, { text: FORMS[personCase]!, source: "sgjp", confidence: 1 }])
            ) as PersonEntity["forms"],
            warnings: []
          }
        : null
    );
  }
};

async function processed(text: string) {
  const service = new LocalPrivateDocumentService(
    new CompleteDocumentIngestor({ async extract() { return { bytes: 1, pages: [] }; } }),
    { recognize: async () => [] },
    24_000,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    morphology
  );
  const review = await service.review(Buffer.from(text), "text/plain");
  await service.finalizeReview(review.documentId, []);
  return { service, documentId: review.documentId, security: { caseId: "case_unused" } };
}

describe("editing the anonymized version and its key together", () => {
  it("adds a person in every case form, then corrects a form and takes it out again", async () => {
    const { service, documentId, security } = await processed(
      "Świadek Adam Zieliński zeznał. Pozew doręczono Adamowi Zielińskiemu, PESEL 44051401359."
    );
    const before = service.anonymizedVersion(documentId);
    expect(before.chunks[0]!.text).toContain("Adamowi Zielińskiemu");

    const added = await service.addProtection(documentId, "Adamowi Zielińskiemu", "PERSON", security);
    expect(added.replaced).toBe(2);
    expect(added.chunks[0]!.text).not.toMatch(/Zieliń/);
    const entry = added.entries.find((item) => item.token === added.token)!;
    expect(entry).toMatchObject({ kind: "PERSON", value: "Adam Zieliński", gender: "m", occurrences: 2 });

    const corrected = await service.updateKeyForms(documentId, added.token, { VOC: "Panie Adamie" }, security);
    expect(corrected.entries.find((item) => item.token === added.token)!.forms).toContainEqual({ case: "VOC", text: "Panie Adamie" });

    const removed = await service.removeProtection(documentId, added.token, security);
    expect(removed.restored).toBe(2);
    expect(removed.chunks[0]!.text).toContain("Świadek Adam Zieliński zeznał. Pozew doręczono Adam Zieliński");
    expect(removed.entries.some((item) => item.token === added.token)).toBe(false);
    expect(removed.entries.some((item) => item.kind === "PESEL")).toBe(true);
  });

  it("refuses text that does not occur and never creates an empty token", async () => {
    const { service, documentId, security } = await processed("Umowa zawarta w Krakowie.");
    await expect(service.addProtection(documentId, "Gdańsk", "CUSTOM", security)).rejects.toThrow(
      "PRIVACY_EDIT_TEXT_NOT_FOUND"
    );
    expect(service.anonymizedVersion(documentId).entries).toEqual([]);
    await expect(service.addProtection(documentId, "[PII:X]", "CUSTOM", security)).rejects.toThrow(
      "PRIVACY_EDIT_TEXT_INVALID"
    );
  });

  it("replaces whole words outside existing tokens only", () => {
    expect(
      replaceOutsideTokens("Nowak, Nowakowski i [PII:PERSON:0001] oraz NOWAK.", ["Nowak"], "[PII:CUSTOM:0001]")
    ).toEqual({ text: "[PII:CUSTOM:0001], Nowakowski i [PII:PERSON:0001] oraz [PII:CUSTOM:0001].", count: 2 });
  });
});

describe("highlighted original text", () => {
  it("shows the original inflected words where tokens stand", async () => {
    const { highlightProtected } = await import("../src/document-service.js");
    const source = "Pozew doręczono Adamowi Zielińskiemu, zam. ul. Długa 5, 00-001 Warszawa, PESEL 44051401359.";
    const protectedText =
      "[STRONA 1 · DIGITAL]\nPozew doręczono [PII:PERSON:0001], zam. [PII:ADDRESS:0001], PESEL [PII:PESEL:0001].";
    const forms: Record<string, string[]> = {
      "[PII:PERSON:0001]": ["Adam Zieliński", "Adamowi Zielińskiemu"],
      "[PII:ADDRESS:0001]": ["ul. Długa 5, 00-001 Warszawa"],
      "[PII:PESEL:0001]": ["44051401359"]
    };
    const result = highlightProtected(protectedText, source, (token) => forms[token] ?? [], (token) => token);
    expect(result.text).toBe("[STRONA 1 · DIGITAL]\n" + source);
    expect(result.marks.map((mark) => [result.text.slice(mark.start, mark.end), mark.kind])).toEqual([
      ["Adamowi Zielińskiemu", "PERSON"],
      ["ul. Długa 5, 00-001 Warszawa", "ADDRESS"],
      ["44051401359", "PESEL"]
    ]);
  });

  it("falls back to the literal anchor, then to the stored value", async () => {
    const { highlightProtected } = await import("../src/document-service.js");
    const result = highlightProtected(
      "Firma [PII:CUSTOM:0001] zapłaci. Świadek [PII:PERSON:0002].",
      "Firma ALFA sp. z o.o. zapłaci. Świadek inny tekst zmieniony",
      () => [],
      () => "Jan Nowak"
    );
    expect(result.marks.map((mark) => result.text.slice(mark.start, mark.end))).toEqual([
      "ALFA sp. z o.o.",
      "Jan Nowak"
    ]);
  });
});
