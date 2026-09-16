import { describe, expect, it } from "vitest";
import { LegalDocumentAstGenerator } from "../src/legal-document-ast-generator.js";
import type { SessionExecutor } from "../src/session-executor.js";

describe("LegalDocumentAstGenerator", () => {
  it("accepts provider JSON and validates only declared aliases", async () => {
    let query = "";
    const sessions: Pick<SessionExecutor, "execute"> = {
      execute: async (request) => {
        query = request.query;
        return {
          sessionId: "session_test",
          status: "DRAFT_PRESENTABLE",
          provider: "openai",
          model: "test",
          primarySkill: "dr-01-prawo-cywilne",
          answer: JSON.stringify({
            schemaVersion: "1",
            documentType: "letter",
            locale: "pl-PL",
            styleProfile: "lex-classic-clean-v1",
            blocks: [{
              type: "paragraph",
              content: [
                { type: "text", text: "Klient: " },
                { type: "pii_ref", alias: "[LMPII:D01:PERSON:0001]" }
              ]
            }]
          }),
          finalization: "PASS",
          blockedReferences: [],
          verification: { records: 0, verified: 0, supported: 0, unverified: 0 },
          evidence: [],
          audit: { result: "PASS", eventCount: 1, closed: true }
        };
      }
    };

    const generator = new LegalDocumentAstGenerator(sessions);
    const result = await generator.generate({
      query: "Przygotuj pismo.",
      provider: "openai",
      model: "test",
      primarySkill: "dr-01-prawo-cywilne",
      mode: "PRAWNIK",
      documentType: "letter",
      styleProfile: "lex-classic-clean-v1",
      aliases: {
        schemaVersion: 1,
        entries: [{
          alias: "[LMPII:D01:PERSON:0001]",
          documentId: "doc_0123456789abcdef01234567",
          sourceToken: "[PII:PERSON:0001]",
          kind: "PERSON"
        }]
      }
    });

    expect(query).toContain("[PII:PERSON:0001] -> [LMPII:D01:PERSON:0001]");
    expect(query).not.toContain("Jan Kowalski");
    expect(result.aliasesUsed).toEqual(["[LMPII:D01:PERSON:0001]"]);
  });

  it("rejects an alias invented by the provider", async () => {
    const sessions: Pick<SessionExecutor, "execute"> = {
      execute: async () => ({
        sessionId: "session_test",
        status: "DRAFT_PRESENTABLE",
        provider: "openai",
        model: "test",
        primarySkill: "dr-01-prawo-cywilne",
        answer: JSON.stringify({
          schemaVersion: "1",
          documentType: "letter",
          locale: "pl-PL",
          styleProfile: "lex-classic-clean-v1",
          blocks: [{
            type: "paragraph",
            content: [{ type: "pii_ref", alias: "[LMPII:D01:PERSON:9999]" }]
          }]
        }),
        finalization: "PASS",
        blockedReferences: [],
        verification: { records: 0, verified: 0, supported: 0, unverified: 0 },
        evidence: [],
        audit: { result: "PASS", eventCount: 1, closed: true }
      })
    };
    const generator = new LegalDocumentAstGenerator(sessions);
    await expect(generator.generate({
      query: "Pismo",
      provider: "openai",
      model: "test",
      primarySkill: "dr-01-prawo-cywilne",
      mode: "PRAWNIK",
      documentType: "letter",
      styleProfile: "lex-classic-clean-v1",
      aliases: {
        schemaVersion: 1,
        entries: [{
          alias: "[LMPII:D01:PERSON:0001]",
          documentId: "doc_0123456789abcdef01234567",
          sourceToken: "[PII:PERSON:0001]",
          kind: "PERSON"
        }]
      }
    })).rejects.toThrow("AST_UNKNOWN_PII_ALIAS");
  });
});
