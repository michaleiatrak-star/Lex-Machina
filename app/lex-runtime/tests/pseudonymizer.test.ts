import { describe, expect, it } from "vitest";
import {
  LocalPolishPseudonymizer,
  PseudonymizationVault,
  type NamedEntityRecognizer
} from "../src/privacy/pseudonymizer.js";

describe("local Polish pseudonymizer", () => {
  it("pseudonymizes structured PII and restores it only through the local vault", async () => {
    const vault = new PseudonymizationVault();
    const ner: NamedEntityRecognizer = {
      async recognize(text) {
        const value = "Jan Kowalski";
        const start = text.indexOf(value);
        return start >= 0
          ? [{
              start,
              end: start + value.length,
              kind: "PERSON",
              value,
              confidence: 0.99
            }]
          : [];
      }
    };

    const service = new LocalPolishPseudonymizer(
      vault,
      ner
    );
    const original =
      "Jan Kowalski, PESEL 44051401458, e-mail jan@example.pl, tel. +48 600-700-800.";

    const result = await service.pseudonymize(original);

    expect(result.text).not.toContain("Jan Kowalski");
    expect(result.text).not.toContain("44051401458");
    expect(result.text).not.toContain("jan@example.pl");
    expect(result.text).toContain("[PII:PERSON:0001]");
    expect(result.text).toContain("[PII:PESEL:0001]");
    expect(result.text).toContain("[PII:EMAIL:0001]");
    expect(service.deanonymize(result.text)).toBe(original);
    expect(JSON.stringify(vault)).not.toContain("Jan Kowalski");
  });

  it("uses a stable token for the same value in one vault", async () => {
    const vault = new PseudonymizationVault();
    const service = new LocalPolishPseudonymizer(vault);
    const result = await service.pseudonymize(
      "Kontakt: a@example.pl. Ponownie: a@example.pl."
    );
    const tokens = result.text.match(
      /\[PII:EMAIL:\d{4}\]/g
    );
    expect(tokens).toEqual([
      "[PII:EMAIL:0001]",
      "[PII:EMAIL:0001]"
    ]);
  });
});
