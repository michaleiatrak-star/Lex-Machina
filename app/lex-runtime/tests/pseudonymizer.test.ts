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

  it("supports explicit user pseudonymize, keep and label selections", async () => {
    const vault = new PseudonymizationVault();
    const service =
      new LocalPolishPseudonymizer(vault);
    const text =
      "Jan Kowalski PESEL 44051401458 kontakt jan@example.pl.";

    const janStart = text.indexOf("Jan Kowalski");
    const peselStart = text.indexOf("44051401458");
    const emailStart = text.indexOf("jan@example.pl");

    const result = await service.pseudonymize(
      text,
      [
        {
          start: janStart,
          end: janStart + "Jan Kowalski".length,
          action: "PSEUDONYMIZE",
          kind: "PERSON",
          label: "świadek"
        },
        {
          start: peselStart,
          end: peselStart + 11,
          action: "KEEP"
        },
        {
          start: emailStart,
          end: emailStart + "jan@example.pl".length,
          action: "LABEL",
          label: "kontakt służbowy"
        }
      ]
    );

    expect(result.text)
      .toContain("[PII:PERSON:0001]");
    expect(result.text)
      .toContain("44051401458");
    expect(result.text)
      .not.toContain("[PII:PESEL:");
    expect(result.text)
      .toContain("jan@example.pl");
    expect(result.annotations).toEqual([
      {
        start: emailStart,
        end: emailStart + "jan@example.pl".length,
        label: "kontakt służbowy"
      }
    ]);
    expect(result.keptRanges).toEqual([
      {
        start: peselStart,
        end: peselStart + 11
      }
    ]);
    expect(result.findings[0]?.source)
      .toBe("USER");
  });

  it("rejects overlapping manual selections instead of guessing priority", async () => {
    const service =
      new LocalPolishPseudonymizer(
        new PseudonymizationVault()
      );

    await expect(
      service.pseudonymize(
        "Jan Kowalski",
        [
          {
            start: 0,
            end: 3,
            action: "KEEP"
          },
          {
            start: 0,
            end: 12,
            action: "PSEUDONYMIZE",
            kind: "PERSON"
          }
        ]
      )
    ).rejects.toThrow(
      "OVERLAPPING_PRIVACY_DIRECTIVES"
    );
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
