import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PseudonymizationVault } from "../src/privacy/pseudonymizer.js";
import {
  PERSON_CASES,
  saveNameFormCorrection,
  type PersonEntity
} from "../src/privacy/person-morphology.js";
import { needsReview, restoreWithReport } from "../src/privacy/restoration-report.js";
import {
  applyRestorationOverrides,
  describeGenerationAliases,
  renderRestorationPreview,
  resolveGenerationAliases
} from "../src/generation-aliases.js";

function entity(forms: Record<string, [string, string, number]>, status: PersonEntity["status"] = "ok"): PersonEntity {
  return {
    canonical: forms.NOM![0],
    gender: "m1",
    genderAlternatives: [],
    status,
    forms: Object.fromEntries(
      PERSON_CASES.map((personCase) => {
        const [text, source, confidence] = forms[personCase] ?? forms.NOM!;
        return [personCase, { text, source, confidence }];
      })
    ) as PersonEntity["forms"],
    warnings: []
  };
}

const kowalski = entity({
  NOM: ["Jan Kowalski", "sgjp", 1],
  GEN: ["Jana Kowalskiego", "sgjp", 1],
  DAT: ["Janowi Kowalskiemu", "sgjp", 1]
});
const dubois = entity(
  { NOM: ["Pierre Dubois", "sgjp+rule", 0.75], DAT: ["Pierre'owi Dubois", "sgjp+rule", 0.75] },
  "needs_review"
);

describe("restoration report", () => {
  it("marks every restored value with its position, source and confidence", () => {
    const vault = new PseudonymizationVault();
    const jan = vault.getOrCreate("PERSON", "Jana Kowalskiego", kowalski);
    const pierre = vault.getOrCreate("PERSON", "Pierre Dubois", dubois);
    const pesel = vault.getOrCreate("PESEL", "90010112345");
    const result = restoreWithReport(
      `Doręczono ${jan.slice(0, -1)}|DAT] i ${pierre.slice(0, -1)}|DAT], PESEL ${pesel}. [PII:PERSON:0099|GEN]`,
      vault
    );
    expect(result.text).toBe(
      "Doręczono Janowi Kowalskiemu i Pierre'owi Dubois, PESEL 90010112345. [PII:PERSON:0099|GEN]"
    );
    expect(result.unresolved).toEqual(["[PII:PERSON:0099|GEN]"]);
    const [first, second, third] = result.restorations;
    expect(result.text.slice(first!.start, first!.end)).toBe("Janowi Kowalskiemu");
    expect(first).toMatchObject({ case: "DAT", source: "sgjp", status: "ok", canonical: "Jan Kowalski" });
    expect(needsReview(first!)).toBe(false);
    expect(second).toMatchObject({ status: "needs_review", confidence: 0.75 });
    expect(needsReview(second!)).toBe(true);
    expect(third).toMatchObject({ kind: "PESEL", source: "vault", text: "90010112345" });
  });
});

describe("document restoration review", () => {
  const documentId = "doc_000000000000000000000001";
  function setup() {
    const vault = new PseudonymizationVault();
    const token = vault.getOrCreate("PERSON", "Pierre Dubois", dubois);
    const manifest = {
      schemaVersion: 1 as const,
      entries: [{ alias: "[LMPII:D01:PERSON:0001]", documentId, sourceToken: token, kind: "PERSON" as const }]
    };
    const vaults = new Map([[documentId, vault]]);
    return { manifest, vaults };
  }

  it("previews the restored document with every alias marked", () => {
    const { manifest, vaults } = setup();
    const tokenized = "Wzywam [LMPII:D01:PERSON:0001|DAT] do zapłaty. Podpis: [LMPII:D01:PERSON:0001]";
    const restorations = describeGenerationAliases(tokenized, manifest, vaults);
    expect(restorations).toEqual([
      expect.objectContaining({ alias: "[LMPII:D01:PERSON:0001|DAT]", text: "Pierre'owi Dubois", status: "needs_review", occurrences: 1 }),
      expect.objectContaining({ alias: "[LMPII:D01:PERSON:0001]", case: "NOM", text: "Pierre Dubois" })
    ]);
    const preview = renderRestorationPreview(tokenized, restorations);
    expect(preview.text).toBe("Wzywam Pierre'owi Dubois do zapłaty. Podpis: Pierre Dubois");
    expect(preview.marks.map((mark) => preview.text.slice(mark.start, mark.end))).toEqual([
      "Pierre'owi Dubois",
      "Pierre Dubois"
    ]);
  });

  it("applies user corrections only to aliases the document uses", () => {
    const { manifest, vaults } = setup();
    const restorations = describeGenerationAliases("[LMPII:D01:PERSON:0001|DAT]", manifest, vaults);
    const replacements = resolveGenerationAliases(manifest, vaults);
    applyRestorationOverrides(replacements, restorations, { "[LMPII:D01:PERSON:0001|DAT]": "Pierre’owi Dubois" });
    expect(replacements.get("[LMPII:D01:PERSON:0001|DAT]")).toBe("Pierre’owi Dubois");
    expect(() =>
      applyRestorationOverrides(replacements, restorations, { "[LMPII:D01:PERSON:0001|GEN]": "x" })
    ).toThrow("DEANONYMIZATION_OVERRIDE_INVALID");
    expect(() =>
      applyRestorationOverrides(replacements, restorations, { "[LMPII:D01:PERSON:0001|DAT]": "[LMPII:D02:PERSON:0001]" })
    ).toThrow("DEANONYMIZATION_OVERRIDE_INVALID");
  });
});

describe("saved name forms", () => {
  it("stores corrected forms per word for the morphology engine", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lex-name-forms-"));
    const file = path.join(dir, "privacy", "name-forms.json");
    try {
      await saveNameFormCorrection(file, { canonical: "Pierre Dubois", gender: "m1", case: "DAT", text: "Pierre’owi Dubois" });
      await saveNameFormCorrection(file, { canonical: "Pierre Dubois", gender: "m1", case: "INS", text: "Pierre’em Dubois" });
      expect(JSON.parse(fs.readFileSync(file, "utf8"))).toEqual({
        Pierre: { m1: { nom: "Pierre", dat: "Pierre’owi", inst: "Pierre’em" } },
        Dubois: { m1: { nom: "Dubois", dat: "Dubois", inst: "Dubois" } }
      });
      await expect(
        saveNameFormCorrection(file, { canonical: "Pierre Dubois", gender: "m1", case: "DAT", text: "Duboisowi" })
      ).rejects.toThrow("NAME_FORM_WORDS_MISMATCH");
      await expect(
        saveNameFormCorrection(file, { canonical: "Pierre Dubois", gender: "m1", case: "DAT", text: "<script>" })
      ).rejects.toThrow("NAME_FORM_INVALID");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
