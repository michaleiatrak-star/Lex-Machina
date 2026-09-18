import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LexSkillRegistry } from "./registry.js";
import {
  SKILL_SELECTION_ENVELOPE_PREFIX,
  parseSkillSelectionEnvelope,
  resolveAdditionalSkills
} from "./skill-selection.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function registryWithSkills(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-skill-selection-"));
  roots.push(root);
  const skills = [
    {
      name: "prawny-router-v3",
      description: "router prawny",
      type: "router"
    },
    {
      name: "prawo-polskie-v2",
      description: "prawo polskie",
      type: "domain-router"
    },
    {
      name: "dr-01-prawo-pracy",
      description: "umowa o pracę pracownik pracodawca wypowiedzenie",
      type: "domain"
    },
    {
      name: "dr-02-prawo-cywilne",
      description: "umowy cywilne odszkodowanie zobowiązania",
      type: "domain"
    },
    {
      name: "dr-03-prawo-procesowe",
      description: "pozew apelacja zażalenie postępowanie sądowe terminy procesowe",
      type: "domain"
    },
    {
      name: "terminy-procesowe",
      description: "obliczanie terminów procesowych i doręczeń",
      type: "helper"
    },
    {
      name: "analiza-sadowa-v6",
      description: "analiza sprawy sądowej strategia procesowa ryzyka i dowody",
      type: "executive-sadowa"
    },
    {
      name: "chronologia-sprawy-v1",
      description: "oś czasu zdarzeń dokumentów i terminów",
      type: "executive-chronologia"
    },
    {
      name: "raport-klienta-v1",
      description: "podsumowanie dla klienta rekomendacje ryzyka i działania",
      type: "ux-raport"
    },
    {
      name: "raport-sytuacyjny-v2",
      description: "raport sytuacyjny status sprawy ryzyka terminy priorytety",
      type: "executive-raport"
    },
    {
      name: "orzeczenia-sadowe-v2",
      description: "research orzecznictwa sygnatury linia orzecznicza wyroki",
      type: "executive-analiza"
    },
    {
      name: "przesluchanie-swiadkow-v2-min90",
      description: "przesłuchanie świadka pytania kontrolne sprzeczności dowody",
      type: "legal-skill"
    },
    {
      name: "analizator-umow-v1",
      description: "analiza redakcja negocjacje ryzyka klauzul umów i kontraktów",
      type: "executive-umowy"
    },
    {
      name: "pisma-procesowe-v3",
      description: "pozew apelacja zażalenie odpowiedź na pozew pismo procesowe",
      type: "executive-pisma"
    },
    {
      name: "pisma-proste-v2",
      description: "wezwanie do zapłaty wgląd uzasadnienie sprzeciw klauzula",
      type: "executive-pisma"
    },
    {
      name: "przewodnik-prawny-v2",
      description: "ogólna analiza prawna i dobór dalszych działań",
      type: "executive-guide"
    },
    {
      name: "analizator-dowodow-v3",
      description: "analiza dowodów dokumentów nagrań sms maili sprzeczności",
      type: "executive-analiza"
    },
    {
      name: "analizator-przepisow-v2",
      description: "analiza przepisu wykładnia przesłanki stan prawny nowelizacje",
      type: "executive-analiza"
    }
  ];
  const crossSkillBodies: Record<string, string> = {
    "analiza-sadowa-v6": [
      "Integracje między-skillowe:",
      "- chronologia-sprawy-v1",
      "- raport-klienta-v1"
    ].join("\n")
  };

  for (const skill of skills) {
    const directory = path.join(root, skill.name);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(
      path.join(directory, "SKILL.md"),
      [
        "---",
        `name: ${skill.name}`,
        `type: ${skill.type}`,
        `description: \"${skill.description}\"`,
        "---",
        `# ${skill.name}`,
        crossSkillBodies[skill.name] ?? ""
      ].join("\n")
    );
  }

  fs.mkdirSync(path.join(root, "shared"), { recursive: true });
  const registry = new LexSkillRegistry(root);
  expect(registry.scan()).toEqual([]);
  return registry;
}

describe("skill selection", () => {
  it("strips the internal envelope and preserves manual skill choices", () => {
    const input =
      `${SKILL_SELECTION_ENVELOPE_PREFIX} {\"auto\":false,\"manual\":[\"terminy-procesowe\"]}\n` +
      "Czy termin na apelację już upłynął?";

    expect(parseSkillSelectionEnvelope(input)).toEqual({
      query: "Czy termin na apelację już upłynął?",
      automatic: false,
      manualSkills: ["terminy-procesowe"]
    });
  });

  it("can select several cooperating execution skills automatically", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "analiza sadowa chronologia sprawy raport klienta ryzyka",
      "dr-03-prawo-procesowe",
      true,
      []
    );

    expect(selected.executionSkills).toContain("analiza-sadowa-v6");
    expect(selected.executionSkills).toContain("chronologia-sprawy-v1");
    expect(selected.executionSkills).toContain("raport-klienta-v1");
    expect(selected.additionalSkills).toEqual(
      expect.arrayContaining([
        "analiza-sadowa-v6",
        "chronologia-sprawy-v1",
        "raport-klienta-v1"
      ])
    );
  });

  it("lets an active execution skill delegate to referenced execution skills", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "analiza sadowa",
      "dr-03-prawo-procesowe",
      true,
      []
    );

    expect(selected.executionSkills).toContain("analiza-sadowa-v6");
    expect(selected.executionSkills).toContain("chronologia-sprawy-v1");
    expect(selected.executionSkills).toContain("raport-klienta-v1");
  });

  it("can add more than one legal domain to a single turn", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Pracownik pozywa pracodawcę; trzeba ocenić wypowiedzenie i przygotować pozew oraz terminy procesowe.",
      "dr-01-prawo-pracy",
      true,
      []
    );

    expect(selected.domainSkills[0]).toBe("dr-01-prawo-pracy");
    expect(selected.domainSkills).toContain("dr-03-prawo-procesowe");
  });

  it("keeps manually selected execution and domain skills while auto-routing may add more", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Przygotuj analizę umowy i raport dla klienta.",
      "dr-02-prawo-cywilne",
      true,
      ["analizator-umow-v1", "dr-03-prawo-procesowe"]
    );

    expect(selected.executionSkills).toContain("analizator-umow-v1");
    expect(selected.domainSkills).toContain("dr-03-prawo-procesowe");
    expect(selected.executionSkills.length).toBeGreaterThanOrEqual(1);
  });

  it("routes an explicit simple-letter request before semantic scoring", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Przygotuj wezwanie do zapłaty.",
      "dr-02-prawo-cywilne",
      true,
      []
    );

    expect(selected.executionSkills).toContain("pisma-proste-v2");
  });

  it("keeps process pleading priority when the query also mentions a simple pre-litigation letter", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Przygotuj pozew po bezskutecznym wezwaniu do zapłaty.",
      "dr-02-prawo-cywilne",
      true,
      []
    );

    expect(selected.executionSkills).toContain("pisma-procesowe-v3");
    expect(selected.executionSkills).not.toContain("pisma-proste-v2");
  });

  it("normalizes Polish diacritics for explicit process routing", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Trzeba przygotować zażalenie na postanowienie.",
      "dr-03-prawo-procesowe",
      true,
      []
    );

    expect(selected.executionSkills).toContain("pisma-procesowe-v3");
  });

  it.each([
    [
      "Zbuduj chronologię sprawy i oś czasu zdarzeń.",
      "chronologia-sprawy-v1"
    ],
    [
      "Przygotuj raport dla klienta z rekomendacjami.",
      "raport-klienta-v1"
    ],
    [
      "Przygotuj raport sytuacyjny ze statusem sprawy i ryzykami.",
      "raport-sytuacyjny-v2"
    ],
    [
      "Przygotuj pytania do świadka i plan przesłuchania.",
      "przesluchanie-swiadkow-v2-min90"
    ],
    [
      "Znajdź wyrok i sprawdź linię orzeczniczą.",
      "orzeczenia-sadowe-v2"
    ]
  ])(
    "routes explicit execution request %s to %s",
    (query, expectedSkill) => {
      const registry =
        registryWithSkills();
      const selected =
        resolveAdditionalSkills(
          registry,
          query,
          "dr-03-prawo-procesowe",
          true,
          []
        );

      expect(
        selected.executionSkills
      ).toContain(
        expectedSkill
      );
      expect(
        selected.workflowExecutionSkill
      ).toBe(
        expectedSkill
      );
    }
  );

  it("routes explicit evidence material to the evidence analyzer", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Przeanalizuj nagranie, SMS-y i sprzeczności między dowodami.",
      "dr-03-prawo-procesowe",
      true,
      []
    );

    expect(selected.executionSkills)
      .toContain("analizator-dowodow-v3");
    expect(selected.workflowExecutionSkill)
      .toBe("analizator-dowodow-v3");
  });

  it("routes a specific statutory interpretation request to the statute analyzer", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Zweryfikuj art. 415 KC i wyjaśnij przesłanki oraz wykładnię przepisu.",
      "dr-02-prawo-cywilne",
      true,
      []
    );

    expect(selected.executionSkills)
      .toContain("analizator-przepisow-v2");
    expect(selected.workflowExecutionSkill)
      .toBe("analizator-przepisow-v2");
  });

  it("uses the general legal guide when automatic mode has no semantic match", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "Nietypowe zagadnienie xyz bez charakterystycznych słów.",
      "dr-02-prawo-cywilne",
      true,
      []
    );

    expect(selected.executionSkills).toContain("przewodnik-prawny-v2");
  });

  it("ignores unknown manual skill names when automatic mode is disabled", () => {
    const registry = registryWithSkills();
    const selected = resolveAdditionalSkills(
      registry,
      "zwykłe pytanie",
      "dr-02-prawo-cywilne",
      false,
      ["nie-istnieje", "shared"]
    );

    expect(selected.additionalSkills).toEqual([]);
    expect(selected.executionSkills).toEqual([]);
    expect(selected.domainSkills).toEqual(["dr-02-prawo-cywilne"]);
    expect(selected.loadedSkills).toContain("shared");
  });
});
