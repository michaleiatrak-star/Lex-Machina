import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  LocalPolishPseudonymizer,
  PseudonymizationVault,
  type NamedEntityRecognizer
} from "../src/privacy/pseudonymizer.js";
import {
  LocalPersonMorphology,
  PERSON_CASES,
  type PersonEntity,
  type PersonMorphology
} from "../src/privacy/person-morphology.js";
import { resolveGenerationAliases } from "../src/generation-aliases.js";

function janKowalski(): PersonEntity {
  const forms: Record<string, string> = {
    NOM: "Jan Kowalski",
    GEN: "Jana Kowalskiego",
    DAT: "Janowi Kowalskiemu",
    ACC: "Jana Kowalskiego",
    INS: "Janem Kowalskim",
    LOC: "Janie Kowalskim",
    VOC: "Janie Kowalski"
  };
  return {
    canonical: "Jan Kowalski",
    gender: "m1",
    genderAlternatives: [],
    status: "ok",
    forms: Object.fromEntries(
      PERSON_CASES.map((personCase) => [
        personCase,
        { text: forms[personCase]!, source: "sgjp", confidence: 1 }
      ])
    ) as PersonEntity["forms"],
    warnings: []
  };
}

const fakeMorphology: PersonMorphology = {
  analyze: async (surfaces) =>
    surfaces.map((surface) =>
      /Kowalsk/.test(surface) ? janKowalski() : null
    )
};

const personRecognizer: NamedEntityRecognizer = {
  recognize: async (text) =>
    [...text.matchAll(/(Jan|Jana|Janem) Kowalsk(iego|im|i)/g)].map((match) => ({
      start: match.index!,
      end: match.index! + match[0].length,
      kind: "PERSON" as const,
      value: match[0]
    }))
};

describe("person entities in the privacy vault", () => {
  it("gives every inflected mention of one person the same token", async () => {
    const vault = new PseudonymizationVault();
    const result = await new LocalPolishPseudonymizer(vault, personRecognizer, fakeMorphology)
      .pseudonymize("Pozew Jana Kowalskiego. Rozmowa z Janem Kowalskim. Jan Kowalski podpisał.");
    expect(result.text).toBe(
      "Pozew [PII:PERSON:0001]. Rozmowa z [PII:PERSON:0001]. [PII:PERSON:0001] podpisał."
    );
  });

  it("protects every later mention of a known person, in any case", async () => {
    const vault = new PseudonymizationVault();
    await new LocalPolishPseudonymizer(vault, personRecognizer, fakeMorphology)
      .pseudonymize("Powód: Jan Kowalski.");
    const blind: NamedEntityRecognizer = { recognize: async () => [] };
    const second = await new LocalPolishPseudonymizer(vault, blind, fakeMorphology)
      .pseudonymize("Doręczono Janowi Kowalskiemu. Jan Kowalskiewicz to inna osoba.");
    expect(second.text).toBe(
      "Doręczono [PII:PERSON:0001]. Jan Kowalskiewicz to inna osoba."
    );
    const kept = await new LocalPolishPseudonymizer(vault, blind, fakeMorphology)
      .pseudonymize("Jan Kowalski", [{ start: 0, end: 12, action: "KEEP" }]);
    expect(kept.text).toBe("Jan Kowalski");
  });

  it("keeps exact-surface identity when no morphology engine is available", async () => {
    const vault = new PseudonymizationVault();
    const result = await new LocalPolishPseudonymizer(vault, personRecognizer)
      .pseudonymize("Pozew Jana Kowalskiego. Jan Kowalski podpisał.");
    expect(result.text).toBe("Pozew [PII:PERSON:0002]. [PII:PERSON:0001] podpisał.");
  });

  it("restores the case the model asked for and fails closed on the rest", () => {
    const vault = new PseudonymizationVault();
    const token = vault.getOrCreate("PERSON", "Jana Kowalskiego", janKowalski());
    expect(
      vault.deanonymize(`Sąd wezwał ${token.slice(0, -1)}|ACC], doręczył ${token.slice(0, -1)}|DAT] i rozmawiał z ${token.slice(0, -1)}|INS].`)
    ).toBe("Sąd wezwał Jana Kowalskiego, doręczył Janowi Kowalskiemu i rozmawiał z Janem Kowalskim.");
    // A bare token in new text is the nominative, not the document's genitive.
    expect(vault.deanonymize(`${token} podpisał.`)).toBe("Jan Kowalski podpisał.");
    expect(vault.restore(token, "INSTRUMENTAL")).toMatchObject({
      text: "Jan Kowalski",
      status: "invalid_case"
    });
    expect(() => vault.deanonymize("[PII:PERSON:0099|INS]")).toThrow("Unknown pseudonymization token");
  });

  it("keeps the person paradigm through a vault snapshot", () => {
    const vault = new PseudonymizationVault();
    const token = vault.getOrCreate("PERSON", "Jana Kowalskiego", janKowalski());
    const restored = new PseudonymizationVault(vault.snapshot());
    expect(restored.restore(token, "LOC").text).toBe("Janie Kowalskim");
    expect(restored.getOrCreate("PERSON", "Janem Kowalskim", janKowalski())).toBe(token);
  });

  it("offers every case of a person alias to the document renderer", () => {
    const vault = new PseudonymizationVault();
    const token = vault.getOrCreate("PERSON", "Jana Kowalskiego", janKowalski());
    const replacements = resolveGenerationAliases(
      {
        schemaVersion: 1,
        entries: [{
          alias: "[LMPII:D01:PERSON:0001]",
          documentId: "doc_000000000000000000000001",
          sourceToken: token,
          kind: "PERSON"
        }]
      },
      new Map([["doc_000000000000000000000001", vault]])
    );
    expect(replacements.get("[LMPII:D01:PERSON:0001]")).toBe("Jan Kowalski");
    expect(replacements.get("[LMPII:D01:PERSON:0001|GEN]")).toBe("Jana Kowalskiego");
    expect(replacements.get("[LMPII:D01:PERSON:0001|INS]")).toBe("Janem Kowalskim");
  });
});

function pythonWithMorfeusz(): string | null {
  const python = process.env.LEX_NER_PYTHON ?? "python3";
  try {
    execFileSync(python, ["-c", "import morfeusz2"], { stdio: "ignore" });
    return python;
  } catch {
    return null;
  }
}

const python = pythonWithMorfeusz();

describe.skipIf(!python)("Morfeusz2 person morphology worker", () => {
  it("rebuilds canonical name, gender and paradigm from one document form", async () => {
    const engine = new LocalPersonMorphology({
      python: python!,
      workerPath: path.resolve(__dirname, "../../privacy/polish_person_morphology.py")
    });
    const [jan, anna, nowak] = await engine.analyze(["Janem Kowalskim", "Annie Nowak", "Nowak"]);
    expect(jan).toMatchObject({ canonical: "Jan Kowalski", gender: "m1", status: "ok" });
    expect(jan!.forms.GEN.text).toBe("Jana Kowalskiego");
    expect(anna).toMatchObject({ canonical: "Anna Nowak", gender: "f" });
    // Feminine Nowak does not inflect.
    expect(anna!.forms.GEN.text).toBe("Anny Nowak");
    // A lone surname has no reliable gender: flagged, not guessed.
    expect(nowak!.status).toBe("gender_ambiguous");
  });
});

describe.skipIf(!python)("SGJP gazetteer and address morphology workers", () => {
  it("finds persons and addresses in a pleading and one token per entity", async () => {
    const { LocalGazetteerRecognizer } = await import("../src/privacy/gazetteer-ner.js");
    const recognizer = new LocalGazetteerRecognizer({
      python: python!,
      workerPath: path.resolve(__dirname, "../../privacy/polish_pii_gazetteer.py")
    });
    const morphology = new LocalPersonMorphology({
      python: python!,
      workerPath: path.resolve(__dirname, "../../privacy/polish_person_morphology.py")
    });
    const text =
      "Powódka Anna Nowak, zamieszkała przy ul. Długiej 5/3, 30-001 Kraków, wnosi przeciwko Janowi Kowalskiemu. " +
      "Szpital im. Jana Pawła II wystawił zaświadczenie. Adres do doręczeń: ul. Długa 5/3, 30-001 Kraków. " +
      "Kowalski nie stawił się. Sąd Rejonowy w Krakowie wezwał Annę Nowak.";
    const vault = new PseudonymizationVault();
    const result = await new LocalPolishPseudonymizer(vault, recognizer, morphology).pseudonymize(text);
    expect(result.text).toBe(
      "Powódka [PII:PERSON:0001], zamieszkała przy [PII:ADDRESS:0001], wnosi przeciwko [PII:PERSON:0003]. " +
      "Szpital im. Jana Pawła II wystawił zaświadczenie. Adres do doręczeń: [PII:ADDRESS:0001]. " +
      // The surname alone is protected too (its own token: it has no given name).
      "[PII:PERSON:0002] nie stawił się. Sąd Rejonowy w Krakowie wezwał [PII:PERSON:0001]."
    );
    expect(vault.restore("[PII:ADDRESS:0001]", "LOC").text).toBe("ul. Długiej 5/3, 30-001 Kraków");
    expect(vault.restore("[PII:ADDRESS:0001]", "NOM").text).toBe("ul. Długa 5/3, 30-001 Kraków");
    expect(vault.restore("[PII:PERSON:0003]", "NOM").text).toBe("Jan Kowalski");
  });
});
