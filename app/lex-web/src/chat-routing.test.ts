import { afterEach, describe, expect, it } from "vitest";
import {
  AUTO_CASE_TYPE,
  DETERMINISTIC_ACTION_META_PREFIX,
  SKILL_SELECTION_ENVELOPE_PREFIX,
  buildSkillSelectionEnvelope,
  choosePrimaryRoute,
  deterministicActionFromMeta,
  deterministicActionMeta,
  getCaseTypeExecutionSkills,
  setAllowedDomainSkills,
  setCaseTypeExecutionSkills,
  skillsForDeterministicAction
} from "./chat-routing.js";

afterEach(() => {
  setCaseTypeExecutionSkills([]);
  setAllowedDomainSkills([]);
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
  });

  it("maps a deterministic action to a fixed execution skill and persists it in message metadata", () => {
    const skills =
      skillsForDeterministicAction(
        "COURT_ANALYSIS"
      );
    expect(skills).toEqual([
      "analiza-sadowa-v6"
    ]);

    const meta =
      deterministicActionMeta(
        "COURT_ANALYSIS"
      );
    expect(meta).toBe(
      `${DETERMINISTIC_ACTION_META_PREFIX}COURT_ANALYSIS`
    );
    expect(
      deterministicActionFromMeta(
        meta
      )
    ).toBe("COURT_ANALYSIS");
  });

  it("treats absent deterministic action as full router-controlled AUTO", () => {
    expect(
      skillsForDeterministicAction("")
    ).toEqual([]);
    expect(
      deterministicActionMeta("")
    ).toBe(
      `${DETERMINISTIC_ACTION_META_PREFIX}AUTO`
    );
    expect(
      deterministicActionFromMeta(
        deterministicActionMeta("")
      )
    ).toBe("");
  });

  it("adds several prioritized execution case types to the envelope", () => {
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
      "analiza-sadowa-v6",
      "chronologia-sprawy-v1",
      "raport-klienta-v1"
    ]);
    expect(encoded).toContain('\"auto\":true');
    expect(encoded).toContain("analiza-sadowa-v6");
    expect(encoded).toContain("chronologia-sprawy-v1");
    expect(encoded).toContain("raport-klienta-v1");
    expect(encoded).toContain(
      '\"caseType\":[\"analiza-sadowa-v6\",\"chronologia-sprawy-v1\",\"raport-klienta-v1\"]'
    );
  });

  it("allows manual domain skills and prioritized execution skills in one turn", () => {
    setCaseTypeExecutionSkills([
      "analiza-sadowa-v6",
      "chronologia-sprawy-v1"
    ]);
    const encoded = buildSkillSelectionEnvelope(
      "Sprawa z pogranicza prawa pracy i cywilnego",
      true,
      ["dr-01-prawo-pracy", "dr-02-prawo-cywilne"]
    );

    expect(encoded).toContain("dr-01-prawo-pracy");
    expect(encoded).toContain("dr-02-prawo-cywilne");
    expect(encoded).toContain("analiza-sadowa-v6");
    expect(encoded).toContain("chronologia-sprawy-v1");
  });

  it("sends no domain restriction when every DR module stays selected", () => {
    setAllowedDomainSkills([]);
    setCaseTypeExecutionSkills([
      "analiza-sadowa-v6"
    ]);

    const envelope = buildSkillSelectionEnvelope(
      "Pytanie",
      true,
      []
    );
    const decoded = JSON.parse(
      envelope
        .split("\n")[0]!
        .slice(
          SKILL_SELECTION_ENVELOPE_PREFIX.length
        )
        .trim()
    ) as Record<string, unknown>;

    expect(decoded.domains).toBeUndefined();
  });

  it("keeps a restricted DR selection out of the manual skill budget", () => {
    setAllowedDomainSkills([
      "dr-01-prawo-pracy"
    ]);
    setCaseTypeExecutionSkills([
      "analiza-sadowa-v6",
      "chronologia-sprawy-v1"
    ]);

    const envelope = buildSkillSelectionEnvelope(
      "Pytanie",
      true,
      []
    );
    const decoded = JSON.parse(
      envelope
        .split("\n")[0]!
        .slice(
          SKILL_SELECTION_ENVELOPE_PREFIX.length
        )
        .trim()
    ) as {
      manual: string[];
      domains: string[];
    };

    // Domains travel in their own field, so the execution skills keep the
    // whole manual budget for themselves.
    expect(decoded.domains).toEqual([
      "dr-01-prawo-pracy"
    ]);
    expect(decoded.manual).toEqual([
      "analiza-sadowa-v6",
      "chronologia-sprawy-v1"
    ]);
  });
});
