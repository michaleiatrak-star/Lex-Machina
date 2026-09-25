import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  firmContext,
  LocalPolishPseudonymizer,
  organizationEntity,
  PseudonymizationVault,
  type NamedEntityRecognizer
} from "../src/privacy/pseudonymizer.js";
import { LocalPersonMorphology, PERSON_CASES, type PersonEntity, type PersonMorphology } from "../src/privacy/person-morphology.js";
import { partyGroups, placeholderGrammar, placeholderKeyPrompt } from "../src/privacy/token-legend.js";
import { agreementIssues, restoreWithReport } from "../src/privacy/restoration-report.js";

function entity(
  canonical: string,
  gender: PersonEntity["gender"],
  extra: Partial<PersonEntity> = {},
  forms: Partial<Record<(typeof PERSON_CASES)[number], string>> = {}
): PersonEntity {
  return {
    canonical,
    gender,
    genderAlternatives: [],
    status: "ok",
    forms: Object.fromEntries(
      PERSON_CASES.map((personCase) => [personCase, { text: forms[personCase] ?? canonical, source: "sgjp", confidence: 1 }])
    ) as PersonEntity["forms"],
    warnings: [],
    ...extra
  };
}

describe("parties of several persons, families and firms", () => {
  it("recognizes a firm named after a person only around firm words", () => {
    const at = (text: string, name: string) => {
      const start = text.indexOf(name);
      return firmContext(text, start, start + name.length);
    };
    expect(at("PHU Jan Kowalski wystawił fakturę.", "Jan Kowalski")).toEqual({});
    expect(at("działa pod firmą „Jan Kowalski Usługi”.", "Jan Kowalski")).toEqual({});
    expect(at("Pozwana Nowak sp. z o.o. wniosła sprzeciw.", "Nowak")).toEqual({ legalForm: "sp. z o.o." });
    expect(at("Umowę zawarła Kowalski i Wspólnicy sp.k. w Krakowie.", "Kowalski")).toEqual({ legalForm: "sp.k." });
    expect(at("Kancelaria Adwokacka Jan Kowalski", "Jan Kowalski")).toEqual({});
    // Lowercase words between: a person, not a firm name.
    expect(at("Biuro rachunkowe prowadzone przez Jana Kowalskiego.", "Jana Kowalskiego")).toBeNull();
    expect(at("Jan Kowalski wniósł pozew.", "Jan Kowalski")).toBeNull();
    // The legal form of the next sentence is not this firm's.
    expect(at("PHU Jan Kowalski. Umowę zawarła X sp.k.", "Jan Kowalski")).toEqual({});
  });

  it("keeps a firm and a person with the same name as two tokens, also through a snapshot", () => {
    const vault = new PseudonymizationVault();
    const person = vault.getOrCreate("PERSON", "Jan Kowalski", entity("Jan Kowalski", "m1", {}, { GEN: "Jana Kowalskiego" }));
    const firm = vault.getOrCreate("PERSON", "Jan Kowalski", organizationEntity("Jan Kowalski"));
    expect(firm).not.toBe(person);
    expect(vault.restore(firm, "GEN").text).toBe("Jan Kowalski");
    expect(vault.restore(person, "GEN").text).toBe("Jana Kowalskiego");
    const copy = new PseudonymizationVault(vault.snapshot());
    expect(copy.entity(firm)?.type).toBe("organization");
    expect(copy.getOrCreate("PERSON", "Jan Kowalski", organizationEntity("Jan Kowalski"))).toBe(firm);
  });

  it("switches a token between person, family and firm without losing it", () => {
    const vault = new PseudonymizationVault();
    const token = vault.getOrCreate("PERSON", "Nowak", entity("Nowak", "m1", { status: "gender_ambiguous" }));
    vault.setEntity(token, organizationEntity("Nowak", "sp. z o.o."));
    expect(vault.getOrCreate("PERSON", "Nowak", organizationEntity("Nowak"))).toBe(token);
    vault.setEntity(token, entity("Nowakowie", "m1", { number: "pl" }, { GEN: "Nowaków" }));
    expect(vault.getOrCreate("PERSON", "Nowak")).toBe(token);
    expect(vault.restore(token, "GEN").text).toBe("Nowaków");
  });

  it("tells the model about families, firms and parties of several persons - never the names", () => {
    const vault = new PseudonymizationVault();
    const jan = vault.getOrCreate("PERSON", "Jan Kowalski", entity("Jan Kowalski", "m1"));
    const anna = vault.getOrCreate("PERSON", "Anna Kowalska", entity("Anna Kowalska", "f"));
    const ewa = vault.getOrCreate("PERSON", "Ewa Nowak", entity("Ewa Nowak", "f"));
    const ola = vault.getOrCreate("PERSON", "Ola Lis", entity("Ola Lis", "f"));
    const family = vault.getOrCreate("PERSON", "Wiśniewscy", entity("Wiśniewscy", "m1", { number: "pl" }));
    const firm = vault.getOrCreate("PERSON", "Jan Kowalski", organizationEntity("Jan Kowalski", "sp. z o.o."));
    const text =
      `Powodowie ${jan} i ${anna} wnieśli pozew. Pozwane ${ewa} oraz ${ola} nie stawiły się. ` +
      `Państwo ${family} byli świadkami. Pozwana ${firm} sp. z o.o. wniosła sprzeciw.`;
    const grammar = placeholderGrammar(text, vault);
    expect(grammar.find((entry) => entry.token === family)).toMatchObject({ entity: "group", gender: "m" });
    expect(grammar.find((entry) => entry.token === firm)).toMatchObject({ entity: "organization", legalForm: "sp. z o.o.", owner: jan });
    const parties = partyGroups([text], (word) => ["powodowie", "pozwane"].includes(word));
    expect(parties).toEqual([
      { role: "powodowie", tokens: [jan, anna] },
      { role: "pozwane", tokens: [ewa, ola] }
    ]);
    const prompt = placeholderKeyPrompt(grammar, parties)!;
    expect(prompt).toContain(`${family}: kilka osób o wspólnym nazwisku`);
    expect(prompt).toContain(`${firm}: firma, której nazwa zawiera imię lub nazwisko osoby ${jan}`);
    expect(prompt).toMatch(/powodowie: .* rodzaj męskoosobowy/);
    expect(prompt).toMatch(/pozwane: .* same kobiety, rodzaj niemęskoosobowy/);
    expect(prompt).toContain("solidarne");
    expect(prompt).not.toMatch(/Kowalsk|Nowak|Wiśniew|Lis\b/);
  });

  it("flags a verb or role word that disagrees with the key for review", () => {
    const vault = new PseudonymizationVault();
    const anna = vault.getOrCreate("PERSON", "Anna Kowalska", entity("Anna Kowalska", "f"));
    const family = vault.getOrCreate("PERSON", "Nowakowie", entity("Nowakowie", "m1", { number: "pl" }));
    const firm = vault.getOrCreate("PERSON", "Nowak", organizationEntity("Nowak", "sp. z o.o."));
    const at = (token: string, suffix = "|NOM") => token.replace(/\]$/, `${suffix}]`);
    const text =
      `${at(anna)} wniósł pozew. ${at(family)} wniosła sprzeciw. Pozwany ${at(anna)} milczy. ` +
      `${at(firm)} wniosła odpowiedź. ${at(anna)} i ${at(family)} wnieśli apelację. Wezwano ${at(anna, "|ACC")} wczoraj.`;
    const issues = [...agreementIssues(text, (token) => vault.entity(token)).values()];
    expect(issues).toEqual([
      "„wniósł” nie zgadza się z kluczem (rodzaj żeński)",
      "„wniosła” nie zgadza się z kluczem (liczba mnoga męskoosobowa)",
      "„pozwany” nie zgadza się z kluczem (rodzaj żeński)"
    ]);
    const report = restoreWithReport(`${at(anna)} wniósł pozew.`, vault);
    expect(report.restorations[0]).toMatchObject({ status: "needs_review", agreement: issues[0] });
    expect(restoreWithReport(`${at(anna)} wniosła pozew.`, vault).restorations[0]?.status).toBe("ok");
  });

  it("reads a given name before a shared plural surname as its own person", async () => {
    const asked: string[] = [];
    const morphology: PersonMorphology = {
      analyze: async (surfaces) =>
        surfaces.map((surface) => {
          asked.push(surface);
          if (surface === "Marii Nowakom") return entity("Maria Nowak", "f", { warnings: ["SHARED_SURNAME"] });
          if (surface === "Piotrowi Nowakom") return entity("Piotr Nowak", "m1", { warnings: ["SHARED_SURNAME"] }, { DAT: "Piotrowi Nowakowi" });
          return null;
        })
    };
    const recognizer: NamedEntityRecognizer = {
      recognize: async (text) =>
        ["Piotrowi", "Marii Nowakom"].map((value) => ({
          start: text.indexOf(value),
          end: text.indexOf(value) + value.length,
          kind: "PERSON" as const,
          value
        }))
    };
    const vault = new PseudonymizationVault();
    const result = await new LocalPolishPseudonymizer(vault, recognizer, morphology).pseudonymize(
      "Pozew przeciwko Piotrowi i Marii Nowakom."
    );
    expect(asked).toContain("Piotrowi Nowakom");
    const [piotr, maria] = [...result.text.matchAll(/\[PII:PERSON:\d{4}\]/g)].map((match) => match[0]);
    expect(vault.entity(piotr!)?.canonical).toBe("Piotr Nowak");
    expect(vault.entity(maria!)?.canonical).toBe("Maria Nowak");
    expect(vault.restore(piotr!, "DAT").text).toBe("Piotrowi Nowakowi");
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

describe.skipIf(!python)("Morfeusz2: families and shared surnames", () => {
  it("inflects families in the plural and gives each family member the singular surname", async () => {
    const engine = new LocalPersonMorphology({
      python: python!,
      workerPath: path.resolve(__dirname, "../../privacy/polish_person_morphology.py")
    });
    const [kowalscy, nowakom, maria, anna, lone, asFamily, one] = await engine.analyze(
      ["Kowalscy", "Nowakom", "Marii Nowakom", "Annie Kowalskim", "Kowalskim", "Kowalskim", "Kowalscy"],
      [undefined, undefined, undefined, undefined, undefined, { numberHint: "pl" }, { numberHint: "sg", genderHint: "f" }]
    );
    expect(kowalscy).toMatchObject({ canonical: "Kowalscy", gender: "m1", number: "pl" });
    expect(kowalscy!.forms.GEN.text).toBe("Kowalskich");
    expect(nowakom).toMatchObject({ canonical: "Nowakowie", number: "pl" });
    expect(nowakom!.forms.DAT.text).toBe("Nowakom");
    expect(maria).toMatchObject({ canonical: "Maria Nowak", gender: "f" });
    expect(maria!.forms.GEN.text).toBe("Marii Nowak");
    expect(anna).toMatchObject({ canonical: "Anna Kowalska", gender: "f" });
    // Ambiguous alone: one man; with "państwo" before it: the family.
    expect(lone).toMatchObject({ canonical: "Kowalski" });
    expect(lone!.number).toBeUndefined();
    expect(asFamily).toMatchObject({ canonical: "Kowalscy", number: "pl" });
    expect(one).toMatchObject({ canonical: "Kowalska", gender: "f" });
  });

  it("protects families and given names the recognizer misses, and restores their forms", async () => {
    const { LocalGazetteerRecognizer } = await import("../src/privacy/gazetteer-ner.js");
    const vault = new PseudonymizationVault();
    const result = await new LocalPolishPseudonymizer(
      vault,
      new LocalGazetteerRecognizer({ python: python!, workerPath: path.resolve(__dirname, "../../privacy/polish_pii_gazetteer.py") }),
      new LocalPersonMorphology({ python: python!, workerPath: path.resolve(__dirname, "../../privacy/polish_person_morphology.py") })
    ).pseudonymize(
      "Pozew przeciwko Piotrowi i Marii Nowakom. Małżonkowie Kowalscy zeznali. Pismo złożyła Nowak sp. z o.o. " +
        "Czynsz zapłacono najemcy Kowalskiemu. Jan, Ewa i Anna Wiśniewscy byli obecni."
    );
    expect(result.text).not.toMatch(/Piotr|Mari|Nowak|Kowalsk|Wiśniew|\bJan\b|\bEwa\b|Anna/);
    const byValue = (value: string) => vault.snapshot().tokens.find((item) => item.value === value)!;
    expect(byValue("Piotrowi").entity?.canonical).toBe("Piotr Nowak");
    expect(byValue("Kowalscy").entity?.number).toBe("pl");
    expect(byValue("Kowalskiemu").entity).toMatchObject({ canonical: "Kowalski" });
    expect(byValue("Kowalskiemu").entity?.number).toBeUndefined();
    expect(byValue("Nowak").entity?.type).toBe("organization");
    expect(byValue("Ewa").entity?.canonical).toBe("Ewa Wiśniewska");
    expect(vault.restore(byValue("Kowalscy").token, "GEN").text).toBe("Kowalskich");
  });
});
