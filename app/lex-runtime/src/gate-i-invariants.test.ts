import {
  describe,
  expect,
  it
} from "vitest";
import {
  evaluateGateIInvariants
} from "./gate-i-invariants.js";
import type {
  ExecutionEvent
} from "./execution-engine.js";
import type {
  FinalizationReport
} from "./finalization-gate.js";
import type {
  DeterministicWorkflowReadReport
} from "./deterministic-workflow.js";
import type {
  VerificationRecord
} from "./verification-ledger.js";

function baseEvents(): ExecutionEvent[] {
  return [
    {
      sequence: 1,
      type: "session",
      target: "legal-query",
      status: "OK"
    },
    {
      sequence: 2,
      type: "skill_read",
      target: "prawny-router-v3",
      status: "OK"
    },
    {
      sequence: 3,
      type: "resource_read",
      target: "shared/PRAWO-HARDGATE.md",
      status: "OK"
    },
    {
      sequence: 4,
      type: "resource_read",
      target: "references/KROK0A-anonimizer.md",
      status: "OK"
    },
    {
      sequence: 5,
      type: "resource_read",
      target: "references/KROK1-detekcja.md",
      status: "OK"
    }
  ];
}

function reads(): DeterministicWorkflowReadReport {
  return {
    workflow: "LEGAL_QUERY_V1",
    required: [],
    observed: [],
    missing: [],
    result: "PASS"
  };
}

function finalization(): FinalizationReport {
  return {
    gate: "G8_HARD_GATE_FINALIZATION",
    result: "PASS",
    references: [],
    findings: [],
    caseQuoteFindings: [],
    caseSupportFindings: []
  };
}

describe(
  "Gate I common legal invariants",
  () => {
    it(
      "passes a source-free legal chat only when router/core/finalization invariants are present",
      () => {
        const report =
          evaluateGateIInvariants({
            events: baseEvents(),
            workflowReads:
              reads(),
            verificationRecords: [],
            finalization:
              finalization()
          });

        expect(report.result)
          .toBe("PASS");
        expect(
          report.checks
            .map(
              (check) =>
                check.result
            )
        ).not.toContain(
          "BLOCKED"
        );
      }
    );

    it(
      "blocks verified statutory evidence without full provenance",
      () => {
        const records:
          VerificationRecord[] = [
            {
              claim: "art. 5 KC",
              kind: "statute",
              status: "VERIFIED",
              sourceUrl:
                "https://eli.gov.pl/",
              fetchedAt:
                "2026-09-18T10:00:00.000Z",
              verificationMethod:
                "web_fetch"
            }
          ];
        const report =
          evaluateGateIInvariants({
            events: baseEvents(),
            workflowReads:
              reads(),
            verificationRecords:
              records,
            finalization:
              finalization()
          });

        expect(
          report.checks.find(
            (check) =>
              check.id ===
                "SOURCE_PROVENANCE"
          )?.result
        ).toBe("BLOCKED");
      }
    );

    it(
      "blocks a case citation if finalization reports a missing signature verification marker",
      () => {
        const final =
          finalization();
        final.result =
          "BLOCKED";
        final.references = [
          {
            claim:
              "sygn. III CZP 25/11",
            kind: "case",
            line: 1,
            lineText:
              "sygn. III CZP 25/11"
          }
        ];
        final.findings = [
          {
            reference:
              final.references[0]!,
            status:
              "MISSING_LEDGER_RECORD"
          }
        ];

        const report =
          evaluateGateIInvariants({
            events: baseEvents(),
            workflowReads:
              reads(),
            verificationRecords: [],
            finalization:
              final
          });

        expect(report.result)
          .toBe("BLOCKED");
        expect(
          report.checks.find(
            (check) =>
              check.id ===
                "CASE_SIGNATURES"
          )?.result
        ).toBe("BLOCKED");
      }
    );

    it(
      "blocks when router is not the first skill read",
      () => {
        const events =
          baseEvents();
        events.splice(
          1,
          0,
          {
            sequence: 2,
            type: "skill_read",
            target:
              "analizator-przepisow-v2",
            status: "OK"
          }
        );

        const report =
          evaluateGateIInvariants({
            events,
            workflowReads:
              reads(),
            verificationRecords: [],
            finalization:
              finalization()
          });

        expect(
          report.checks.find(
            (check) =>
              check.id ===
                "ROUTER_FIRST"
          )?.result
        ).toBe("BLOCKED");
      }
    );
  }
);
