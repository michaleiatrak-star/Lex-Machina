import { afterEach, describe, expect, it } from "vitest";
import {
  AUTO_CASE_TYPE,
  SKILL_SELECTION_ENVELOPE_PREFIX,
  buildSkillSelectionEnvelope,
  choosePrimaryRoute,
  getCaseTypeExecutionSkills,
  setCaseTypeExecutionSkills
} from "./chat-routing.js";

afterEach(() => {
  setCaseTypeExecutionSkills([]);
});

describe("chat routing", () => {
  const routes = [
    "dr-01-prawo-pracy",
    "dr-02-prawo-cywilne"
  ];
  const skills = [
    {
      name: "dr-01-prawo-pracy",
      description: "pracownik pracodawca wypowiedzenie umowy o pracę"
    },
    {
      name: "dr-02-prawo-cywilne",
      description: "umowa cywilna zobowiązania odszkodowanie"
    }
  ];

  it("selects a DR route from the query", () => {
    expect(
      choosePrimaryRoute(
        "Pracownik dostał wypowiedzenie umowy o pracę.",
        routes,
        skills,
        []
      )
    ).toBe("dr-01-prawo-pracy");
  });

  it("lets a manually selected DR route take precedence", () => {
    expect(
      choosePrimaryRoute(
        "Umowa i szkoda",
        routes,
        skills,
        ["dr-02-prawo-cywilne"]
      )
    ).toBe("dr-02-prawo-cywilne");
  });

  it("keeps mandatory skills out of the manual envelope", () => {
    const encoded = buildSkillSelectionEnvelope(
      "Pytanie",
      true,
      [
        "prawny-router-v3",
        "shared",
        "prawo-polskie-v2",
        "terminy-procesowe"
      ]
    );

    expect(encoded.startsWith(SKILL_SELECTION_ENVELOPE_PREFIX)).toBe(true);
    expect(encoded).toContain("terminy-procesowe");
    expect(encoded).not.toContain('\"shared\"');
    expect(encoded).toContain(`\"caseType\":\"${AUTO_CASE_TYPE}\"`);
    expect(encoded).toContain('\"workflowMode\":\"SKILL_AUTO\"');
    expect(encoded).toContain('\"workflowSkill\":null');
    expect(encoded.endsWith("\nPytanie")).toBe(true);
  });

  it("forces automatic selection when no execution case type is prioritized", () => {
    setCaseTypeExecutionSkills([]);
    const encoded = buildSkillSelectionEnvelope(
      "Pytanie",
      false,
      []
    );

    expect(getCaseTypeExecutionSkills()).toEqual([]);
    expect(encoded).toContain('\"auto\":true');
    expect(encoded).toContain('\"caseType\":\"AUTO\"');
    expect(encoded).toContain('\"workflowMode\":\"SKILL_AUTO\"');
    expect(encoded).toContain('\"workflowSkill\":null');
  });

  it("keeps exactly one deterministic workflow skill", () => {
    setCaseTypeExecutionSkills([
      "analiza-sadowa-v6",
      "chronologia-sprawy-v1",
      "raport-klienta-v1"
    ]);
    const encoded = buildSkillSelectionEnvelope(
      "Przeanalizuj sprawę i przygotuj raport",
      true,
      []
    );

    expect(getCaseTypeExecutionSkills()).toEqual([
      "analiza-sadowa-v6"
    ]);
    expect(encoded).toContain('\"auto\":true');
    expect(encoded).toContain(
      '\"caseType\":[\"analiza-sadowa-v6\"]'
    );
    expect(encoded).toContain('\"workflowMode\":\"DETERMINISTIC\"');
    expect(encoded).toContain('\"workflowSkill\":\"analiza-sadowa-v6\"');
    expect(encoded).not.toContain("chronologia-sprawy-v1");
    expect(encoded).not.toContain("raport-klienta-v1");
  });

  it("allows one deterministic workflow plus manual domain skills in one turn", () => {
    setCaseTypeExecutionSkills([
      "analiza-sadowa-v6"
    ]);
    const encoded = buildSkillSelectionEnvelope(
      "Sprawa z pogranicza prawa pracy i cywilnego",
      true,
      ["dr-01-prawo-pracy", "dr-02-prawo-cywilne"]
    );

    expect(encoded).toContain("dr-01-prawo-pracy");
    expect(encoded).toContain("dr-02-prawo-cywilne");
    expect(encoded).toContain("analiza-sadowa-v6");
    expect(encoded).toContain('\"workflowMode\":\"DETERMINISTIC\"');
    expect(encoded).toContain('\"workflowSkill\":\"analiza-sadowa-v6\"');
  });
});
