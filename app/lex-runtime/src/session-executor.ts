import { AuditTrail } from "./audit-trail.js";
import { AuditedFinalizer } from "./audited-finalizer.js";
import {
  LexExecutionEngine,
  type ExecutionEvent
} from "./execution-engine.js";
import { ProviderGateway } from "./providers/gateway.js";
import type { ProviderId } from "./providers/types.js";
import { LexSkillRegistry } from "./registry.js";
import { VerificationLedger } from "./verification-ledger.js";

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

export type SessionExecutionResponse = {
  sessionId: string;
  status: "DRAFT_PRESENTABLE" | "BLOCKED";
  provider: ProviderId;
  model: string;
  primarySkill: string;
  answer?: string;
  finalization: "PASS" | "DEGRADED" | "BLOCKED";
  blockedReferences: PublicBlockedReference[];
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
    private readonly finalizer = new AuditedFinalizer()
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

    const execution = await this.engine.executePolishLegalQuery({
      query: request.query,
      provider: request.provider,
      model: request.model,
      route: {
        jurisdiction: "PL",
        primarySkill: request.primarySkill,
        mode: request.mode
      }
    });

    transferExecutionEvents(execution.events, audit);

    const ledger = new VerificationLedger();
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

    const completeness = audit.validateCompletion();
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
      audit: {
        result: completeness.result,
        eventCount: completeness.eventCount,
        closed: audit.isClosed
      }
    };
  }
}
