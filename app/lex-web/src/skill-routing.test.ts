import { describe, expect, it } from "vitest";
import {
  chooseAutomaticExtraSkills,
  choosePrimaryRoute,
  encodeExtraSkills
} from "./skill-routing.js";

const routes = [
  "dr-02-prawo-cywilne-rodzinne-gospodarcze",
  "dr-03-prawo-karne-wykroczenia-egzekucja",
  "dr-04-prawo-pracy-zus-swiadczenia",
  "dr-05-prawo-administracyjne-sadowoadministracyjne",
  "dr-11-cyfrowe-cyber-ai-dane-ip",
  "dr-16-pisma-strategia-dowody-orzecznictwo"
];

describe("chat legal skill routing", () => {
  it("selects the criminal DR from a criminal-law question", () => {
    expect(
      choosePrimaryRoute(
        "Mam zarzut w sprawie karnej i chcę przeanalizować akt oskarżenia.",
        routes
      )
    ).toBe("dr-03-prawo-karne-wykroczenia-egzekucja");
  });

  it("selects employment/social-insurance DR for ZUS", () => {
    expect(
      choosePrimaryRoute(
        "ZUS odmówił mi świadczenia i chcę złożyć odwołanie.",
        routes
      )
    ).toBe("dr-04-prawo-pracy-zus-swiadczenia");
  });

  it("suggests execution skills from the user's task", () => {
    const skills = chooseAutomaticExtraSkills(
      "Przeanalizuj umowę i przygotuj wezwanie, uwzględniając dowody."
    );
    expect(skills).toContain("analizator-umow-v1");
    expect(skills).toContain("analizator-dowodow-v3");
    expect(skills).toContain("pisma-proste-v2");
  });

  it("never serializes mandatory router/shared as optional skills", () => {
    expect(
      encodeExtraSkills(
        "Pytanie",
        [
          "prawny-router-v3",
          "shared",
          "analizator-umow-v1"
        ]
      )
    ).toBe(
      "[LEX_EXTRA_SKILLS:analizator-umow-v1]\nPytanie"
    );
  });
});
