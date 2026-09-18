import {
  AuditTrail,
  type AuditEvent
} from "./audit-trail.js";
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
import {
  LegalCorpusToolRuntime
} from "./legal-corpus-tool-runtime.js";
import {
  evaluateDeterministicWorkflowReads,
  type DeterministicWorkflowReadReport
} from "./deterministic-workflow.js";
import {
  documentCitationSystemPrompt,
  processDocumentCitationMarkers,
  type PublicDocumentCitation
} from "./document-citations.js";
import type {
  ProcessPleadingCheckpoint,
  ProcessPleadingCheckpointStatus,
  ProcessPleadingMode,
  ProcessPleadingStage
} from "./process-pleading-state.js";
import type {
  CourtAnalysisCheckpoint,
  CourtAnalysisStage
} from "./court-analysis-state.js";
import type {
  ChronologyCheckpoint,
  ChronologyStage
} from "./chronology-state.js";
import type {
  ContractCheckpoint,
  ContractStage,
  ContractWorkflowMode
} from "./contract-analysis-state.js";
import {
  orchestrateDocumentContext,
  type ContextBudgetReport
} from "./context-orchestrator.js";

export type SessionDocumentAttachment = {
  documentId: string;
  caseId?: string;
  sourceScope?:
    | "MANUAL"
    | "CASE_KNOWLEDGE"
    | "FIRM_KNOWLEDGE";
  chunks: Array<{
    index: number;
    pageStart: number;
    pageEnd: number;
    text: string;
  }>;
};

export type SessionExecutionRequest = {
  query: string;
  documentAttachments?: SessionDocumentAttachment[];
  provider: ProviderId;
  model: string;
  primarySkill: string;
  mode: "LAIK" | "PRAWNIK";
  modelContextTokens?: number;
  processWorkflowContext?: {
    stage: ProcessPleadingStage;
    checkpoint: ProcessPleadingCheckpoint;
    mode: ProcessPleadingMode;
  };
  courtWorkflowContext?: {
    stage: Exclude<
      CourtAnalysisStage,
      "COMPLETE"
    >;
    checkpoint:
      CourtAnalysisCheckpoint;
  };
  chronologyWorkflowContext?: {
    stage: Exclude<
      ChronologyStage,
      "COMPLETE"
    >;
    checkpoint:
      ChronologyCheckpoint;
    temporalGateRequired: boolean;
  };
  contractWorkflowContext?: {
    mode: ContractWorkflowMode;
    stage: Exclude<
      ContractStage,
      "COMPLETE"
    >;
    checkpoint:
      ContractCheckpoint;
  };
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
    ...(record.sourceUrl ? { sourceUrl: record.sourceUrl } : {}),
    ...(record.sourceTier ? { sourceTier: record.sourceTier } : {}),
    fetchedAt: record.fetchedAt,
    ...(record.verificationMethod
      ? { verificationMethod: record.verificationMethod }
      : {}),
    ...(record.temporalMode ? { temporalMode: record.temporalMode } : {}),
    ...(record.asOf ? { asOf: record.asOf } : {}),
    ...(record.sourceFormat ? { sourceFormat: record.sourceFormat } : {}),
    ...(record.caseScope ? { caseScope: record.caseScope } : {}),
    ...(record.caseSignature ? { caseSignature: record.caseSignature } : {}),
    ...(record.evidenceHash ? { evidenceHash: record.evidenceHash } : {}),
    ...(record.supportQuoteHash
      ? { supportQuoteHash: record.supportQuoteHash }
      : {})
  }));
}

export type SessionExecutionInternalState = {
  verificationRecords: VerificationRecord[];
  auditEvents: AuditEvent[];
};

export const SESSION_EXECUTION_INTERNAL =
  Symbol("LEX_SESSION_EXECUTION_INTERNAL");

export type SessionExecutionResponse = {
  sessionId: string;
  status: "DRAFT_PRESENTABLE" | "BLOCKED";
  provider: ProviderId;
  model: string;
  primarySkill: string;
  loadedSkills?: string[];
  executionSkills?: string[];
  domainSkills?: string[];
  answer?: string;
  documentCitations?: PublicDocumentCitation[];
  documentCitationFreshness?: {
    result: "PASS";
    checked: number;
  };
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
    missing?: string[];
    violations?: string[];
  };
  workflow?: {
    id: string;
    result: "PASS" | "BLOCKED";
    requiredResources: string[];
    missingResources: string[];
  };
  context?: ContextBudgetReport;
  courtWorkflow?: {
    caseId: string;
    revision: number;
    stage:
      CourtAnalysisStage;
    nextCheckpoint:
      CourtAnalysisCheckpoint | null;
    closedCheckpoints:
      CourtAnalysisCheckpoint[];
  };
  chronologyWorkflow?: {
    caseId: string;
    revision: number;
    stage: ChronologyStage;
    temporalGateRequired: boolean;
    nextCheckpoint:
      ChronologyCheckpoint | null;
    closedCheckpoints:
      ChronologyCheckpoint[];
  };
  contractWorkflow?: {
    caseId: string;
    revision: number;
    mode: ContractWorkflowMode;
    stage: ContractStage;
    nextCheckpoint:
      ContractCheckpoint | null;
    closedCheckpoints:
      ContractCheckpoint[];
  };
  processAuto?: {
    maxSteps: number;
    stopped:
      | "FINAL"
      | "LIMIT_REACHED"
      | "NODE_BLOCKED";
    limitReached: boolean;
    steps: Array<{
      stage: Exclude<
        ProcessPleadingStage,
        "CG_ACCEPTANCE" | "FINAL"
      >;
      checkpoint:
        ProcessPleadingCheckpoint;
      revisionAfter: number;
      status:
        "DRAFT_PRESENTABLE" | "BLOCKED";
      answer?: string;
    }>;
  };
  processWorkflow?: {
    caseId: string;
    mode: ProcessPleadingMode;
    revision: number;
    stage: ProcessPleadingStage;
    documentStatus: "DRAFT" | "FINAL";
    pendingCheckpoint: ProcessPleadingCheckpoint | null;
    checkpoints: Record<
      ProcessPleadingCheckpoint,
      ProcessPleadingCheckpointStatus
    >;
  };
  [SESSION_EXECUTION_INTERNAL]?: SessionExecutionInternalState;
};

function buildDocumentContext(
  attachments: SessionDocumentAttachment[]
): string {
  const sections = attachments.map((attachment) => {
    const chunks = attachment.chunks.map((chunk) => {
      const sourceLabel =
        attachment.sourceScope === "FIRM_KNOWLEDGE"
          ? "FIRM KNOWLEDGE"
          : attachment.sourceScope === "CASE_KNOWLEDGE"
            ? "CASE KNOWLEDGE"
            : "DOCUMENT";
      return [
        `[${sourceLabel} ${attachment.documentId} · CHUNK ${chunk.index} · PAGES ${chunk.pageStart}-${chunk.pageEnd}]`,
        chunk.text
      ].join("\n");
    });
    return chunks.join("\n\n");
  });

  return sections.join("\n\n---\n\n");
}

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
  execute(request: SessionExecutionRequest): Promise<SessionExecutionResponse>;
}

export class SafeSessionExecutor implements SessionExecutor {
  private readonly engine: LexExecutionEngine;

  constructor(
    private readonly registry: LexSkillRegistry,
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
    const verificationTools = this.verificationToolFactory?.(ledger);
    const corpusTools = new LegalCorpusToolRuntime(this.registry);

    const contextSelection =
      orchestrateDocumentContext({
        attachments:
          request.documentAttachments ?? [],
        query: request.query,
        ...(request.modelContextTokens
          ? {
              modelContextTokens:
                request.modelContextTokens
            }
          : {})
      });
    const attachments =
      contextSelection.attachments;
    const documentContext =
      attachments.length > 0
        ? buildDocumentContext(
            attachments
          )
        : undefined;

    audit.record(
      "gate",
      "G39C_CONTEXT_BUDGET",
      "OK",
      {
        ...contextSelection.report
      }
    );

    for (const attachment of attachments) {
      audit.record(
        "resource_read",
        `local-document:${attachment.documentId}`,
        "OK",
        {
          chunks: attachment.chunks.map((chunk) => chunk.index),
          protectedOnly: true,
          ...(attachment.caseId ? { caseId: attachment.caseId } : {}),
          ...(attachment.sourceScope ? { sourceScope: attachment.sourceScope } : {})
        }
      );
    }

    const toolSchemas = [
      ...corpusTools.schemas(),
      ...(verificationTools ? verificationTools.schemas() : [])
    ];
    const toolPrompt = [
      corpusTools.systemPromptAppendix(),
      ...(verificationTools
        ? [verificationTools.systemPromptAppendix()]
        : []),
      ...(attachments.length > 0
        ? [documentCitationSystemPrompt(attachments)]
        : [])
    ].join("\n\n");

    const execution = await this.engine.executePolishLegalQuery({
      query: request.query,
      ...(documentContext ? { documentContext } : {}),
      provider: request.provider,
      model: request.model,
      route: {
        jurisdiction: "PL",
        primarySkill: request.primarySkill,
        mode: request.mode
      },
      ...(request.processWorkflowContext
        ? {
            processWorkflowContext:
              request.processWorkflowContext
          }
        : {}),
      ...(request.courtWorkflowContext
        ? {
            courtWorkflowContext:
              request.courtWorkflowContext
          }
        : {}),
      ...(request.chronologyWorkflowContext
        ? {
            chronologyWorkflowContext:
              request.chronologyWorkflowContext
          }
        : {}),
      ...(request.contractWorkflowContext
        ? {
            contractWorkflowContext:
              request.contractWorkflowContext
          }
        : {}),
      tools: toolSchemas,
      toolSystemPromptAppendix: toolPrompt,
      runTools: async (calls) => {
        const corpusCalls = calls.filter((call) => corpusTools.handles(call.name));
        const verificationCalls = calls.filter((call) => !corpusTools.handles(call.name));

        const corpusResults = corpusCalls.length > 0
          ? await corpusTools.runTools(corpusCalls)
          : [];
        const verificationResults = verificationCalls.length > 0 && verificationTools
          ? await verificationTools.runTools(verificationCalls)
          : [];

        const byId = new Map(
          [...corpusResults, ...verificationResults].map((result) => [
            result.tool_use_id,
            result
          ])
        );

        return calls.map((call) =>
          byId.get(call.id) ?? {
            tool_use_id: call.id,
            content: JSON.stringify({
              status: "BLOCKED",
              error: "UNKNOWN_RUNTIME_TOOL"
            })
          }
        );
      }
    });

    transferExecutionEvents(execution.events, audit);

    const corpusAudit = corpusTools.auditEvents();
    for (const event of corpusAudit) {
      audit.record(
        event.tool === "read_legal_resource"
          ? "resource_read"
          : "tool_decision",
        event.target,
        event.decision === "ALLOW" ? "OK" : "BLOCKED",
        {
          tool: event.tool,
          ...(event.detail ? event.detail : {})
        }
      );
    }

    const corpusBlocked = corpusAudit.some((event) => event.decision === "BLOCK");
    audit.record(
      "gate",
      "G36_LEGAL_CORPUS_RUNTIME",
      corpusBlocked ? "BLOCKED" : "OK",
      { toolEvents: corpusAudit.length }
    );

    const workflowReads: DeterministicWorkflowReadReport =
      evaluateDeterministicWorkflowReads(
        execution.workflowPlan,
        corpusAudit
      );
    const workflowResourcesBlocked =
      workflowReads.result === "BLOCKED";
    audit.record(
      "gate",
      "G39H_WORKFLOW_RESOURCE_READS",
      workflowResourcesBlocked ? "BLOCKED" : "OK",
      {
        workflow: workflowReads.workflow,
        required: workflowReads.required,
        observed: workflowReads.observed,
        missing: workflowReads.missing
      }
    );

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

    const processedDocumentCitations =
      processDocumentCitationMarkers(execution.output, attachments);
    audit.record(
      "gate",
      "LOCAL_DOCUMENT_DEEP_LINKS",
      "OK",
      {
        accepted: processedDocumentCitations.citations.length,
        rejected: processedDocumentCitations.rejectedMarkers,
        exactHighlights: processedDocumentCitations.citations.filter(
          (item) => item.highlightStart !== undefined && item.highlightEnd !== undefined
        ).length
      }
    );

    const finalization = this.finalizer.finalize({
      text: processedDocumentCitations.text,
      ledger,
      audit,
      closeSession: false
    });

    const workflowFinalizationBlocked =
      finalization.result !== "PASS" ||
      corpusBlocked ||
      workflowResourcesBlocked;
    audit.record(
      "gate",
      "G39H_WORKFLOW_FINALIZATION",
      workflowFinalizationBlocked ? "BLOCKED" : "OK",
      {
        workflow: execution.workflowPlan.id,
        finalization: finalization.result,
        corpusBlocked,
        workflowResourcesBlocked
      }
    );

    const safeToPresent =
      finalization.result === "PASS" &&
      !corpusBlocked &&
      !workflowResourcesBlocked;
    audit.record(
      "gate",
      "G15_SAFE_SESSION_EXECUTION",
      safeToPresent ? "OK" : "BLOCKED",
      { finalization: finalization.result }
    );
    audit.close(
      safeToPresent ? "OK" : "BLOCKED",
      { finalization: finalization.result }
    );

    const verificationRecords = ledger.all();
    const completeness = audit.validateCompletion({
      requireVerification: finalization.references.length > 0,
      requireToolActivity:
        finalization.references.length > 0 && Boolean(verificationTools),
      requireDeterministicWorkflow: true
    });
    const blockedReferences = finalization.findings
      .filter((finding) => finding.status !== "VERIFIED")
      .map((finding) => ({
        claim: finding.reference.claim,
        kind: finding.reference.kind,
        line: finding.reference.line,
        status: finding.status
      }));

    const response: SessionExecutionResponse = {
      sessionId: audit.sessionId,
      status: safeToPresent ? "DRAFT_PRESENTABLE" : "BLOCKED",
      provider: request.provider,
      model: request.model,
      primarySkill: request.primarySkill,
      loadedSkills: execution.loadedSkills,
      executionSkills: execution.executionSkills,
      domainSkills: execution.domainSkills,
      ...(safeToPresent
        ? {
            answer: processedDocumentCitations.text,
            documentCitations: processedDocumentCitations.citations
          }
        : {}),
      finalization: finalization.result,
      blockedReferences,
      verification: {
        records: verificationRecords.length,
        verified: verificationRecords.filter((record) => record.status === "VERIFIED").length,
        supported: verificationRecords.filter((record) => record.status === "SUPPORTED").length,
        unverified: verificationRecords.filter((record) => record.status === "UNVERIFIED").length
      },
      evidence: publicEvidenceBundle(verificationRecords),
      context: {
        ...contextSelection.report
      },
      audit: {
        result: completeness.result,
        eventCount: completeness.eventCount,
        closed: audit.isClosed,
        missing: [...completeness.missing],
        violations: [...completeness.violations]
      },
      workflow: {
        id: execution.workflowPlan.id,
        result:
          workflowResourcesBlocked || finalization.result !== "PASS"
            ? "BLOCKED"
            : "PASS",
        requiredResources: workflowReads.required,
        missingResources: workflowReads.missing
      }
    };

    Object.defineProperty(
      response,
      SESSION_EXECUTION_INTERNAL,
      {
        value: {
          verificationRecords: verificationRecords.map((record) => ({ ...record })),
          auditEvents: audit.events.map((event) => ({
            ...event,
            ...(event.detail ? { detail: { ...event.detail } } : {})
          }))
        } satisfies SessionExecutionInternalState,
        enumerable: false,
        configurable: false,
        writable: false
      }
    );

    return response;
  }
}
