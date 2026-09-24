import { describe, expect, it } from "vitest";
import { PseudonymizationVault } from "../src/privacy/pseudonymizer.js";
import { PERSON_CASES, type PersonEntity } from "../src/privacy/person-morphology.js";
import { placeholderGrammar, placeholderKeyPrompt } from "../src/privacy/token-legend.js";
import { restoreWithReport } from "../src/privacy/restoration-report.js";
import { buildGenerationAliases } from "../src/generation-aliases.js";

function person(nom: string, gender: PersonEntity["gender"], status: PersonEntity["status"] = "ok"): PersonEntity {
  return {
    canonical: nom,
    gender,
    genderAlternatives: [],
    status,
    forms: Object.fromEntries(
      PERSON_CASES.map((personCase) => [personCase, { text: nom, source: "sgjp", confidence: 1 }])
    ) as PersonEntity["forms"],
    warnings: []
  };
}

describe("placeholder key for models", () => {
  const vault = new PseudonymizationVault();
  const anna = vault.getOrCreate("PERSON", "Anna Nowak", person("Anna Nowak", "f"));
  const jan = vault.getOrCreate("PERSON", "Jan Kowalski", person("Jan Kowalski", "m1"));
  const kim = vault.getOrCreate("PERSON", "Kim Lee", person("Kim Lee", "f", "gender_ambiguous"));
  const pesel = vault.getOrCreate("PESEL", "90010112345");

  it("lists persons with gender and addresses, never names or other identifiers", () => {
    const entries = placeholderGrammar(
      `${anna} pozwała ${jan.slice(0, -1)}|ACC], świadek ${kim}, PESEL ${pesel}, ${anna.slice(0, -1)}|GEN] [PII:ADDRESS:0007|LOC]`,
      vault
    );
    expect(entries).toEqual([
      { token: anna, kind: "PERSON", gender: "f" },
      { token: jan, kind: "PERSON", gender: "m" },
      { token: kim, kind: "PERSON", gender: "unknown" },
      { token: "[PII:ADDRESS:0007]", kind: "ADDRESS" }
    ]);
    const prompt = placeholderKeyPrompt(entries)!;
    expect(prompt).toContain("HARD GATE");
    expect(prompt).toContain(`${anna}: osoba, rodzaj żeński`);
    expect(prompt).toContain(`${jan}: osoba, rodzaj męski`);
    expect(prompt).toContain(`${kim}: osoba, rodzaj nieustalony`);
    expect(prompt).not.toMatch(/Anna|Nowak|Kowalski|Kim Lee|90010112345/);
    expect(placeholderKeyPrompt([])).toBeNull();
  });

  it("flags a person token the model wrote without a case", () => {
    const result = restoreWithReport(`Pozew wniosła ${anna} przeciwko ${jan.slice(0, -1)}|DAT].`, vault);
    expect(result.restorations.map((item) => item.status)).toEqual(["needs_review", "ok"]);
  });

  it("gives generation aliases the gender of persons only", () => {
    const manifest = buildGenerationAliases([{ documentId: "doc_000000000000000000000001", vault }]);
    const byToken = new Map(manifest.entries.map((entry) => [entry.sourceToken, entry]));
    expect(byToken.get(anna)?.gender).toBe("f");
    expect(byToken.get(jan)?.gender).toBe("m");
    expect(byToken.get(pesel)?.gender).toBeUndefined();
  });
});
