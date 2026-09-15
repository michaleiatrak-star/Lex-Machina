import { AuditTrail } from "./audit-trail.js";
import { AuditedFinalizer } from "./audited-finalizer.js";
import {
  LexExecutionEngine,
  type ExecutionEvent
} from "./execution-engine.js";
import { ProviderGateway } from "./providers/gateway.js";
import type { ProviderId } from "./providers/types.js";
import { LexSkillRegistry } from "./registry.js";
import {
  VerificationLedger,
  type VerificationRecord
} from "./verification-ledger.js";
import type {
  LegalVerificationToolFactory
} from "./verification-tool-runtime.js";

export type SessionExecutionRequest = {
  query: string;
  provider: ProviderId;
  model: string;
  primarySkill: string;
  mode: "LAIK" | "PRAWNIK";
};

export type PublicBlockedReference = {
  claim: string;
  kind: "statute" | "journal" | "case";
  line: number;
  status: string;
};

export type PublicEvidenceItem = {
  claim: string;
  kind: VerificationRecord["kind"];
  status: VerificationRecord["status"];
  sourceUrl?: string;
  sourceTier?: VerificationRecord["sourceTier"];
  fetchedAt: string;
  verificationMethod?: VerificationRecord["verificationMethod"];
  temporalMode?: VerificationRecord["temporalMode"];
  asOf?: string;
  sourceFormat?: VerificationRecord["sourceFormat"];
  caseScope?: VerificationRecord["caseScope"];
  caseSignature?: string;
  evidenceHash?: string;
  supportQuoteHash?: string;
};

export function publicEvidenceBundle(
  records: VerificationRecord[]
): PublicEvidenceItem[] {
  return records.map((record) => ({
    claim: record.claim,
    kind: record.kind,
    status: record.status,
    ...(record.sourceUrl
      ? { sourceUrl: record.sourceUrl }
      : {}),
    ...(record.sourceTier
      ? { sourceTier: record.sourceTier }
      : {}),
    fetchedAt: record.fetchedAt,
    ...(record.verificationMethod
      ? {
          verificationMethod:
            record.verificationMethod
        }
      : {}),
    ...(record.temporalMode
      ? {
          temporalMode:
            record.temporalMode
        }
      : {}),
    ...(record.asOf
      ? { asOf: record.asOf }
      : {}),
    ...(record.sourceFormat
      ? {
          sourceFormat:
            record.sourceFormat
        }
      : {}),
    ...(record.caseScope
      ? {
          caseScope:
            record.caseScope
        }
      : {}),
    ...(record.caseSignature
      ? {
          caseSignature:
            record.caseSignature
        }
      : {}),
    ...(record.evidenceHash
      ? {
          evidenceHash:
            record.evidenceHash
        }
      : {}),
    ...(record.supportQuoteHash
      ? {
          supportQuoteHash:
            record.supportQuoteHash
        }
      : {})
  }));
}

export type SessionExecutionResponse = {
  sessionId: string;
  status: "DRAFT_PRESENTABLE" | "BLOCKED";
  provider: ProviderId;
  model: string;
  primarySkill: string;
  answer?: string;
  finalization: "PASS" | "DEGRADED" | "BLOCKED";
  blockedReferences: PublicBlockedReference[];
  verification: {
    records: number;
    verified: number;
    supported: number;
    unverified: number;
  };
  evidence: PublicEvidenceItem[];
  audit: {
    result: "PASS" | "BLOCKED";
    eventCount: number;
    closed: boolean;
  };
};

function transferExecutionEvents(
  events: ExecutionEvent[],
  audit: AuditTrail
): void {
  for (const event of events) {
    if (
      event.type === "skill_read" ||
      event.type === "resource_read" ||
      event.type === "route" ||
      event.type === "provider_start" ||
      event.type === "provider_end" ||
      event.type === "gate"
    ) {
      audit.record(
        event.type,
        event.target,
        event.status === "BLOCKED" ? "BLOCKED" : "OK",
        event.detail ? { detail: event.detail } : undefined
      );
    }
  }
}

export interface SessionExecutor {
  execute(
    request: SessionExecutionRequest
  ): Promise<SessionExecutionResponse>;
}

export class SafeSessionExecutor implements SessionExecutor {
  private readonly engine: LexExecutionEngine;

  constructor(
    registry: LexSkillRegistry,
    providers: ProviderGateway,
    private readonly finalizer = new AuditedFinalizer(),
    private readonly verificationToolFactory?: LegalVerificationToolFactory
  ) {
    this.engine = new LexExecutionEngine(registry, providers);
  }

  async execute(
    request: SessionExecutionRequest
  ): Promise<SessionExecutionResponse> {
    const audit = new AuditTrail();
    audit.start({
      provider: request.provider,
      model: request.model,
      mode: request.mode
    });

    const ledger = new VerificationLedger();
    const verificationTools =
      this.verificationToolFactory?.(ledger);

    const execution = await this.engine.executePolishLegalQuery({
      query: request.query,
      provider: request.provider,
      model: request.model,
      route: {
        jurisdiction: "PL",
        primarySkill: request.primarySkill,
        mode: request.mode
      },
      ...(verificationTools
        ? {
            tools: verificationTools.schemas(),
            toolSystemPromptAppendix:
              verificationTools.systemPromptAppendix(),
            runTools: (calls) =>
              verificationTools.runTools(calls)
          }
        : {})
    });

    transferExecutionEvents(execution.events, audit);

    if (verificationTools) {
      for (const toolEvent of verificationTools.auditEvents()) {
        audit.record(
          "tool_decision",
          toolEvent.tool,
          toolEvent.decision === "ALLOW" ? "OK" : "BLOCKED",
          {
            decision: toolEvent.decision,
            capability: toolEvent.capability ?? null,
            reason: toolEvent.reason ?? null
          }
        );
      }
    }
    const finalization = this.finalizer.finalize({
      text: execution.output,
      ledger,
      audit,
      closeSession: false
    });

    const safeToPresent = finalization.result === "PASS";
    audit.record(
      "gate",
      "G15_SAFE_SESSION_EXECUTION",
      safeToPresent ? "OK" : "BLOCKED",
      {
        finalization: finalization.result
      }
    );
    audit.close(
      safeToPresent ? "OK" : "BLOCKED",
      {
        finalization: finalization.result
      }
    );

    const verificationRecords = ledger.all();
    const completeness = audit.validateCompletion({
      requireVerification: finalization.references.length > 0,
      requireToolActivity:
        finalization.references.length > 0 &&
        Boolean(verificationTools)
    });
    const blockedReferences = finalization.findings
      .filter((finding) => finding.status !== "VERIFIED")
      .map((finding) => ({
        claim: finding.reference.claim,
        kind: finding.reference.kind,
        line: finding.reference.line,
        status: finding.status
      }));

    return {
      sessionId: audit.sessionId,
      status: safeToPresent
        ? "DRAFT_PRESENTABLE"
        : "BLOCKED",
      provider: request.provider,
      model: request.model,
      primarySkill: request.primarySkill,
      ...(safeToPresent
        ? { answer: execution.output }
        : {}),
      finalization: finalization.result,
      blockedReferences,
      verification: {
        records: verificationRecords.length,
        verified: verificationRecords.filter(
          (record) => record.status === "VERIFIED"
        ).length,
        supported: verificationRecords.filter(
          (record) => record.status === "SUPPORTED"
        ).length,
        unverified: verificationRecords.filter(
          (record) => record.status === "UNVERIFIED"
        ).length
      },
      evidence:
        publicEvidenceBundle(
          verificationRecords
        ),
      audit: {
        result: completeness.result,
        eventCount: completeness.eventCount,
        closed: audit.isClosed
      }
    };
  }
}