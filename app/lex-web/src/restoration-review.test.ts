import { describe, expect, it } from "vitest";
import {
  applyRestorationCorrection,
  restorationTone,
  shiftMarks,
  unresolvedPlaceholders,
  validMarks
} from "./restoration-review.js";
import { applyAliasCorrection } from "./DeanonymizationReview.js";
import type { RestorationMark } from "./workspace-client.js";

const mark = (start: number, end: number, extra: Partial<RestorationMark> = {}): RestorationMark => ({
  start,
  end,
  token: "[PII:PERSON:0001]",
  kind: "PERSON",
  case: "DAT",
  source: "sgjp",
  confidence: 1,
  status: "ok",
  ...extra
});

describe("restoration review", () => {
  it("colours values by how sure the program is", () => {
    expect(restorationTone(mark(0, 1))).toBe("certain");
    expect(restorationTone(mark(0, 1, { source: "sgjp+rule", confidence: 0.9 }))).toBe("rule");
    expect(restorationTone(mark(0, 1, { source: "rule", confidence: 0.5 }))).toBe("review");
    expect(restorationTone(mark(0, 1, { status: "gender_ambiguous" }))).toBe("review");
    expect(restorationTone(mark(0, 1, { source: "vault", kind: "PESEL" }))).toBe("stored");
    expect(restorationTone(mark(0, 1, { source: "manual" }))).toBe("manual");
  });

  it("corrects one value and shifts the marks after it", () => {
    const content = "Doręczono Pierre'owi Dubois i Janowi Kowalskiemu.";
    const marks = [mark(10, 27, { confidence: 0.5 }), mark(30, 48)];
    const result = applyRestorationCorrection(content, marks, 0, "Pierre’owi Dubois ");
    expect(result.content).toBe("Doręczono Pierre’owi Dubois i Janowi Kowalskiemu.");
    expect(result.marks[0]).toMatchObject({ source: "manual", confidence: 1, end: 27 });
    expect(result.content.slice(result.marks[1]!.start, result.marks[1]!.end)).toBe("Janowi Kowalskiemu");
    const longer = applyRestorationCorrection(content, marks, 0, "panu Pierre’owi Dubois");
    expect(longer.content.slice(longer.marks[1]!.start, longer.marks[1]!.end)).toBe("Janowi Kowalskiemu");
  });

  it("keeps marks aligned after a message prefix and drops broken ones", () => {
    expect(shiftMarks([mark(0, 3)], 5)![0]).toMatchObject({ start: 5, end: 8 });
    expect(validMarks("abcdef", [mark(4, 9), mark(0, 2), mark(1, 3)])).toEqual([mark(0, 2)]);
  });

  it("lists placeholders the key could not resolve", () => {
    expect(unresolvedPlaceholders("A [PII:PERSON:0009|GEN] i [LMPII:D01:PESEL:0002], [PII:PERSON:0009|GEN]")).toEqual([
      "[PII:PERSON:0009|GEN]",
      "[LMPII:D01:PESEL:0002]"
    ]);
  });

  it("changes every occurrence of a document alias at once", () => {
    const preview = {
      text: "Wzywam Pierre'owi Dubois. Podpis: Pierre Dubois. Kopia: Pierre'owi Dubois.",
      marks: [
        { start: 7, end: 24, alias: "[LMPII:D01:PERSON:0001|DAT]" },
        { start: 34, end: 47, alias: "[LMPII:D01:PERSON:0001]" },
        { start: 56, end: 73, alias: "[LMPII:D01:PERSON:0001|DAT]" }
      ],
      restorations: [
        { alias: "[LMPII:D01:PERSON:0001|DAT]", kind: "PERSON", case: "DAT", text: "Pierre'owi Dubois", source: "rule", confidence: 0.5, status: "needs_review", occurrences: 2 },
        { alias: "[LMPII:D01:PERSON:0001]", kind: "PERSON", case: "NOM", text: "Pierre Dubois", source: "sgjp", confidence: 1, status: "ok", occurrences: 1 }
      ]
    };
    const next = applyAliasCorrection(preview, "[LMPII:D01:PERSON:0001|DAT]", "Pierre’owi Dubois");
    expect(next.text).toBe("Wzywam Pierre’owi Dubois. Podpis: Pierre Dubois. Kopia: Pierre’owi Dubois.");
    expect(next.marks.map((item) => next.text.slice(item.start, item.end))).toEqual([
      "Pierre’owi Dubois",
      "Pierre Dubois",
      "Pierre’owi Dubois"
    ]);
    expect(next.restorations[0]).toMatchObject({ source: "manual", status: "ok" });
  });
});

describe("substitution key", () => {
  it("groups placeholder, case and restored words and flags a missing case", async () => {
    const { substitutionKey } = await import("./restoration-review.js");
    const content = "Jan Kowalski wezwał Annę Nowak. Annę Nowak powiadomiono. Anna Nowak";
    const base = { source: "sgjp", status: "ok", confidence: 1 };
    const rows = substitutionKey(content, [
      { start: 0, end: 12, token: "[PII:PERSON:0001]", kind: "PERSON", case: "NOM", ...base },
      { start: 20, end: 30, token: "[PII:PERSON:0002]", kind: "PERSON", case: "ACC", ...base },
      { start: 32, end: 42, token: "[PII:PERSON:0002]", kind: "PERSON", case: "ACC", ...base },
      { start: 57, end: 67, token: "[PII:PERSON:0002]", kind: "PERSON", case: "NOM", caseMissing: true, ...base, status: "needs_review" }
    ]);
    expect(rows.map((row) => [row.placeholder, row.text, row.occurrences, row.caseMissing, row.tone])).toEqual([
      ["[PII:PERSON:0001|NOM]", "Jan Kowalski", 1, false, "certain"],
      ["[PII:PERSON:0002]", "Anna Nowak", 1, true, "review"],
      ["[PII:PERSON:0002|ACC]", "Annę Nowak", 2, false, "certain"]
    ]);
  });
});
