import { describe, expect, it } from "vitest";
import { LegalDocumentAstGenerator } from "../src/legal-document-ast-generator.js";
import {
  SESSION_EXECUTION_INTERNAL,
  type SessionExecutor
} from "../src/session-executor.js";

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
          audit: { result: "PASS", eventCount: 4, closed: true },
          [SESSION_EXECUTION_INTERNAL]: {
            verificationRecords: [],
            auditEvents: [
              {
                sequence: 1,
                timestamp: "2026-09-16T10:00:00.000Z",
                type: "session_started",
                target: "session_test",
                status: "OK"
              },
              {
                sequence: 2,
                timestamp: "2026-09-16T10:00:01.000Z",
                type: "skill_read",
                target: "prawny-router-v3",
                status: "OK"
              },
              {
                sequence: 3,
                timestamp: "2026-09-16T10:00:02.000Z",
                type: "provider_start",
                target: "openai",
                status: "OK"
              },
              {
                sequence: 4,
                timestamp: "2026-09-16T10:00:03.000Z",
                type: "provider_end",
                target: "openai",
                status: "OK"
              }
            ]
          }
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
        audit: { result: "PASS", eventCount: 4, closed: true },
        [SESSION_EXECUTION_INTERNAL]: {
          verificationRecords: [],
          auditEvents: [
            {
              sequence: 1,
              timestamp: "2026-09-16T10:00:00.000Z",
              type: "session_started",
              target: "session_test",
              status: "OK"
            },
            {
              sequence: 2,
              timestamp: "2026-09-16T10:00:01.000Z",
              type: "skill_read",
              target: "prawny-router-v3",
              status: "OK"
            },
            {
              sequence: 3,
              timestamp: "2026-09-16T10:00:02.000Z",
              type: "provider_start",
              target: "openai",
              status: "OK"
            },
            {
              sequence: 4,
              timestamp: "2026-09-16T10:00:03.000Z",
              type: "provider_end",
              target: "openai",
              status: "OK"
            }
          ]
        }
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
