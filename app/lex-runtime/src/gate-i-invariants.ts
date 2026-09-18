import {
  CORE_LEGAL_RESOURCES
} from "./legal-session.js";
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

export type GateICheckId =
  | "ROUTER_FIRST"
  | "CORE_RESOURCES"
  | "WORKFLOW_RESOURCES"
  | "SOURCE_PROVENANCE"
  | "LEGAL_CITATIONS"
  | "CASE_SIGNATURES"
  | "FINALIZATION";

export type GateICheck = {
  id: GateICheckId;
  result: "PASS" | "BLOCKED";
  detail: string;
};

export type GateIInvariantReport = {
  gate: "G39I_COMMON_LEGAL_INVARIANTS";
  result: "PASS" | "BLOCKED";
  checks: GateICheck[];
  verifiedOrSupportedRecords: number;
  legalReferences: number;
  caseReferences: number;
};

function routerFirst(
  events: readonly ExecutionEvent[]
): GateICheck {
  const firstSkill =
    events.find(
      (event) =>
        event.type ===
        "skill_read"
    );
  const pass =
    firstSkill?.target ===
      "prawny-router-v3" &&
    firstSkill.status === "OK";
  return {
    id: "ROUTER_FIRST",
    result:
      pass ? "PASS" : "BLOCKED",
    detail:
      firstSkill
        ? `firstSkill=${firstSkill.target};status=${firstSkill.status}`
        : "firstSkill=missing"
  };
}

function coreResources(
  events: readonly ExecutionEvent[]
): GateICheck {
  const observed =
    new Set(
      events
        .filter(
          (event) =>
            event.type ===
              "resource_read" &&
            event.status === "OK"
        )
        .map(
          (event) =>
            event.target
        )
    );
  const missing =
    CORE_LEGAL_RESOURCES
      .filter(
        (resource) =>
          !observed.has(
            resource
          )
      );
  return {
    id: "CORE_RESOURCES",
    result:
      missing.length === 0
        ? "PASS"
        : "BLOCKED",
    detail:
      missing.length === 0
        ? `loaded=${CORE_LEGAL_RESOURCES.length}`
        : `missing=${missing.join(",")}`
  };
}

function workflowResources(
  report:
    DeterministicWorkflowReadReport
): GateICheck {
  return {
    id:
      "WORKFLOW_RESOURCES",
    result:
      report.result,
    detail:
      report.result === "PASS"
        ? `required=${report.required.length};observed=${report.observed.length}`
        : `missing=${report.missing.join(",")}`
  };
}

function provenance(
  records:
    readonly VerificationRecord[]
): GateICheck {
  const verified =
    records.filter(
      (record) =>
        record.status ===
          "VERIFIED" ||
        record.status ===
          "SUPPORTED"
    );

  const invalid =
    verified.filter(
      (record) => {
        if (
          !record.sourceUrl?.trim() ||
          !record.fetchedAt?.trim() ||
          !record.verificationMethod
        ) {
          return true;
        }
        if (
          (
            record.kind ===
              "statute" ||
            record.kind ===
              "journal"
          ) &&
          !record.sourceTier
        ) {
          return true;
        }
        if (
          record.kind ===
            "case" &&
          !record
            .caseSignature
            ?.trim()
        ) {
          return true;
        }
        if (
          record.status ===
            "SUPPORTED" &&
          (
            record.kind !==
              "case" ||
            record.caseScope !==
              "PROPOSITION_SUPPORT" ||
            !record
              .evidenceHash
              ?.trim() ||
            !record
              .supportQuoteHash
              ?.trim() ||
            !record
              .supportQuote
              ?.trim()
          )
        ) {
          return true;
        }
        return false;
      }
    );

  return {
    id:
      "SOURCE_PROVENANCE",
    result:
      invalid.length === 0
        ? "PASS"
        : "BLOCKED",
    detail:
      invalid.length === 0
        ? `records=${verified.length}`
        : `invalid=${invalid.length}`
  };
}

function citations(
  finalization:
    FinalizationReport
): GateICheck {
  const invalid =
    finalization.findings
      .filter(
        (finding) =>
          finding.status !==
            "VERIFIED"
      );
  return {
    id:
      "LEGAL_CITATIONS",
    result:
      invalid.length === 0
        ? "PASS"
        : "BLOCKED",
    detail:
      invalid.length === 0
        ? `references=${finalization.references.length}`
        : `invalid=${invalid.length}`
  };
}

function caseSignatures(
  finalization:
    FinalizationReport
): GateICheck {
  const cases =
    finalization.references
      .filter(
        (reference) =>
          reference.kind ===
            "case"
      );
  const invalidRefs =
    finalization.findings
      .filter(
        (finding) =>
          finding.reference
            .kind ===
              "case" &&
          finding.status !==
            "VERIFIED"
      );
  const invalidQuotes =
    finalization
      .caseQuoteFindings
      .filter(
        (finding) =>
          finding.status !==
            "VERIFIED"
      );
  const invalidSupport =
    finalization
      .caseSupportFindings
      .filter(
        (finding) =>
          finding.status !==
            "SUPPORTED"
      );

  const invalid =
    invalidRefs.length +
    invalidQuotes.length +
    invalidSupport.length;

  return {
    id:
      "CASE_SIGNATURES",
    result:
      invalid === 0
        ? "PASS"
        : "BLOCKED",
    detail:
      invalid === 0
        ? `references=${cases.length};quotes=${finalization.caseQuoteFindings.length};support=${finalization.caseSupportFindings.length}`
        : `invalid=${invalid}`
  };
}

export function evaluateGateIInvariants(
  args: {
    events:
      readonly ExecutionEvent[];
    workflowReads:
      DeterministicWorkflowReadReport;
    verificationRecords:
      readonly VerificationRecord[];
    finalization:
      FinalizationReport;
  }
): GateIInvariantReport {
  const checks:
    GateICheck[] = [
      routerFirst(args.events),
      coreResources(args.events),
      workflowResources(
        args.workflowReads
      ),
      provenance(
        args.verificationRecords
      ),
      citations(
        args.finalization
      ),
      caseSignatures(
        args.finalization
      ),
      {
        id:
          "FINALIZATION",
        result:
          args.finalization
            .result === "PASS"
            ? "PASS"
            : "BLOCKED",
        detail:
          `result=${args.finalization.result}`
      }
    ];

  return {
    gate:
      "G39I_COMMON_LEGAL_INVARIANTS",
    result:
      checks.every(
        (check) =>
          check.result ===
            "PASS"
      )
        ? "PASS"
        : "BLOCKED",
    checks,
    verifiedOrSupportedRecords:
      args.verificationRecords
        .filter(
          (record) =>
            record.status ===
              "VERIFIED" ||
            record.status ===
              "SUPPORTED"
        ).length,
    legalReferences:
      args.finalization
        .references.length,
    caseReferences:
      args.finalization
        .references
        .filter(
          (reference) =>
            reference.kind ===
              "case"
        ).length
  };
}
