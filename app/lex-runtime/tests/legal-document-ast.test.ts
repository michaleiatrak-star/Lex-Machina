import {
  describe,
  expect,
  it
} from "vitest";
import {
  validateLegalDocumentAst,
  legalDocumentPlainText
} from "../src/legal-document-ast.js";

const aliases = [{
  alias:
    "[LMPII:D01:PERSON:0001]",
  documentId:
    "doc_0123456789abcdef01234567",
  sourceToken:
    "[PII:PERSON:0001]",
  kind: "PERSON"
}];

describe("legal document AST", () => {
  it("validates typed PII refs and cross references", () => {
    const result =
      validateLegalDocumentAst({
        schemaVersion: "1",
        documentType:
          "pleading",
        locale: "pl-PL",
        styleProfile:
          "lex-classic-clean-v1",
        title: [{
          type: "text",
          text: "Pozew"
        }],
        blocks: [
          {
            id: "facts",
            type: "heading",
            level: 1,
            content: [{
              type: "text",
              text:
                "Stan faktyczny"
            }]
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text:
                  "Powód: "
              },
              {
                type: "pii_ref",
                alias:
                  "[LMPII:D01:PERSON:0001]"
              },
              {
                type: "text",
                text:
                  "."
              }
            ]
          },
          {
            type: "paragraph",
            content: [{
              type: "xref",
              targetId:
                "facts",
              label:
                "zob. stan faktyczny"
            }]
          }
        ]
      }, aliases);

    expect(
      result.aliasesUsed
    ).toEqual([
      "[LMPII:D01:PERSON:0001]"
    ]);
    expect(
      legalDocumentPlainText(
        result.ast
      )
    ).toContain(
      "[LMPII:D01:PERSON:0001]"
    );
  });

  it("rejects token-shaped strings in normal text nodes", () => {
    expect(() =>
      validateLegalDocumentAst({
        schemaVersion: "1",
        documentType:
          "letter",
        locale: "pl-PL",
        styleProfile:
          "lex-classic-clean-v1",
        blocks: [{
          type: "paragraph",
          content: [{
            type: "text",
            text:
              "Nielegalny [PII:PERSON:0001]"
          }]
        }]
      }, aliases)
    ).toThrow(
      "AST_TOKEN_IN_TEXT_NODE"
    );
  });

  it("rejects unknown generation aliases", () => {
    expect(() =>
      validateLegalDocumentAst({
        schemaVersion: "1",
        documentType:
          "letter",
        locale: "pl-PL",
        styleProfile:
          "lex-classic-clean-v1",
        blocks: [{
          type: "paragraph",
          content: [{
            type: "pii_ref",
            alias:
              "[LMPII:D01:PERSON:9999]"
          }]
        }]
      }, aliases)
    ).toThrow(
      "AST_UNKNOWN_PII_ALIAS"
    );
  });
});
