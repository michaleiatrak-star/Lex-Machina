import {
  describe,
  expect,
  it
} from "vitest";
import {
  LocalLegalDocumentRenderer
} from "../src/legal-document-renderer.js";
import type {
  LegalDocumentAst
} from "../src/legal-document-ast.js";

const ast:
  LegalDocumentAst = {
    schemaVersion: "1",
    documentType:
      "letter",
    locale: "pl-PL",
    styleProfile:
      "lex-classic-clean-v1",
    title: [{
      type: "text",
      text:
        "Pismo testowe"
    }],
    blocks: [{
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Klient: "
        },
        {
          type: "pii_ref",
          alias:
            "[LMPII:D01:PERSON:0001]"
        }
      ]
    }]
  };

describe("deterministic legal document renderer", () => {
  for (
    const format
    of ["docx", "odt"] as const
  ) {
    it(`renders and deanonymizes deterministic ${format}`, async () => {
      const renderer =
        new LocalLegalDocumentRenderer({
          timeoutMs: 10_000
        });
      const first =
        await renderer.render(
          format,
          ast
        );
      const second =
        await renderer.render(
          format,
          ast
        );
      try {
        expect(
          first.data.equals(
            second.data
          )
        ).toBe(true);
        const validation =
          await renderer.validate(
            format,
            first.data
          );
        expect(
          validation.aliases
        ).toBe(1);

        const final =
          await renderer
            .deanonymize(
              format,
              first.data,
              new Map([[
                "[LMPII:D01:PERSON:0001]",
                "Jan Kowalski"
              ]])
            );
        try {
          const checked =
            await renderer
              .validate(
                format,
                final.data
              );
          expect(
            checked.aliases
          ).toBe(0);
          expect(
            checked.text
          ).toContain(
            "Jan Kowalski"
          );
          expect(
            checked.text
          ).not.toContain(
            "LMPII"
          );
        } finally {
          final.data.fill(0);
        }
      } finally {
        first.data.fill(0);
        second.data.fill(0);
      }
    });
  }
});

describe("person case in generated documents", () => {
  for (const format of ["docx", "odt"] as const) {
    it(`inserts the inflected form a pii_ref case asks for (${format})`, async () => {
      const renderer = new LocalLegalDocumentRenderer({ timeoutMs: 10_000 });
      const cased: LegalDocumentAst = {
        ...ast,
        blocks: [{
          type: "paragraph",
          content: [
            { type: "text", text: "Wzywam " },
            { type: "pii_ref", alias: "[LMPII:D01:PERSON:0001]", case: "ACC" },
            { type: "text", text: " do zapłaty. Pismo doręczono " },
            { type: "pii_ref", alias: "[LMPII:D01:PERSON:0001]", case: "DAT" },
            { type: "text", text: "." }
          ]
        }]
      };
      const rendered = await renderer.render(format, cased);
      const final = await renderer.deanonymize(
        format,
        rendered.data,
        new Map([
          ["[LMPII:D01:PERSON:0001]", "Jan Kowalski"],
          ["[LMPII:D01:PERSON:0001|ACC]", "Jana Kowalskiego"],
          ["[LMPII:D01:PERSON:0001|DAT]", "Janowi Kowalskiemu"]
        ])
      );
      const checked = await renderer.validate(format, final.data);
      expect(checked.aliases).toBe(0);
      // DOCX text extraction puts every run on its own line.
      expect(checked.text.replace(/\s+/g, " ").replace(/ \./g, ".")).toContain("Wzywam Jana Kowalskiego do zapłaty. Pismo doręczono Janowi Kowalskiemu.");
    });
  }
});
