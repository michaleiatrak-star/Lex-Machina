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
