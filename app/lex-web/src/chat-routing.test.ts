import { describe, expect, it } from "vitest";
import {
  SKILL_SELECTION_ENVELOPE_PREFIX,
  buildSkillSelectionEnvelope,
  choosePrimaryRoute
} from "./chat-routing.js";

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
    expect(encoded).not.toContain('"shared"');
    expect(encoded.endsWith("\nPytanie")).toBe(true);
  });
});
