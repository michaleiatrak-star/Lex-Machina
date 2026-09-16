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
import {
  LegalCorpusToolRuntime
} from "./legal-corpus-tool-runtime.js";

export type SessionDocumentAttachment = {
  documentId: string;
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

function buildDocumentContext(
  attachments: SessionDocumentAttachment[]
): string {
  if (attachments.length > 4) {
    throw new Error("TOO_MANY_DOCUMENT_ATTACHMENTS");
  }

  let totalChars = 0;
  const sections = attachments.map((attachment) => {
    const chunks = attachment.chunks.map((chunk) => {
      totalChars += chunk.text.length;
      return [
        `[DOCUMENT ${attachment.documentId} · CHUNK ${chunk.index} · PAGES ${chunk.pageStart}-${chunk.pageEnd}]`,
        chunk.text
      ].join("\n");
    });
    return chunks.join("\n\n");
  });

  if (totalChars > 160_000) {
    throw new Error("DOCUMENT_ATTACHMENT_CONTEXT_TOO_LARGE");
  }

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
  execute(
    request: SessionExecutionRequest
  ): Promise<SessionExecutionResponse>;
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
    const verificationTools =
      this.verificationToolFactory?.(ledger);
    const corpusTools =
      new LegalCorpusToolRuntime(
        this.registry
      );

    const attachments =
      request.documentAttachments ?? [];
    const documentContext =
      attachments.length > 0
        ? buildDocumentContext(attachments)
        : undefined;

    for (const attachment of attachments) {
      audit.record(
        "resource_read",
        `local-document:${attachment.documentId}`,
        "OK",
        {
          chunks: attachment.chunks.map(
            (chunk) => chunk.index
          ),
          protectedOnly: true
        }
      );
    }

    const toolSchemas = [
      ...corpusTools.schemas(),
      ...(verificationTools
        ? verificationTools.schemas()
        : [])
    ];
    const toolPrompt = [
      corpusTools.systemPromptAppendix(),
      ...(verificationTools
        ? [
            verificationTools
              .systemPromptAppendix()
          ]
        : [])
    ].join("\n\n");

    const execution =
      await this.engine.executePolishLegalQuery({
        query: request.query,
        ...(documentContext
          ? { documentContext }
          : {}),
        provider: request.provider,
        model: request.model,
        route: {
          jurisdiction: "PL",
          primarySkill:
            request.primarySkill,
          mode: request.mode
        },
        tools: toolSchemas,
        toolSystemPromptAppendix:
          toolPrompt,
        runTools: async (calls) => {
          const corpusCalls =
            calls.filter((call) =>
              corpusTools.handles(
                call.name
              )
            );
          const verificationCalls =
            calls.filter((call) =>
              !corpusTools.handles(
                call.name
              )
            );

          const corpusResults =
            corpusCalls.length > 0
              ? await corpusTools
                  .runTools(
                    corpusCalls
                  )
              : [];
          const verificationResults =
            verificationCalls.length > 0 &&
            verificationTools
              ? await verificationTools
                  .runTools(
                    verificationCalls
                  )
              : [];

          const byId = new Map(
            [
              ...corpusResults,
              ...verificationResults
            ].map((result) => [
              result.tool_use_id,
              result
            ])
          );

          return calls.map(
            (call) =>
              byId.get(call.id) ?? {
                tool_use_id:
                  call.id,
                content:
                  JSON.stringify({
                    status:
                      "BLOCKED",
                    error:
                      "UNKNOWN_RUNTIME_TOOL"
                  })
              }
          );
        }
      });

    transferExecutionEvents(execution.events, audit);

    const corpusAudit =
      corpusTools.auditEvents();
    for (
      const event
      of corpusAudit
    ) {
      audit.record(
        event.tool ===
          "read_legal_resource"
          ? "resource_read"
          : "tool_decision",
        event.target,
        event.decision ===
          "ALLOW"
          ? "OK"
          : "BLOCKED",
        {
          tool: event.tool,
          ...(event.detail
            ? event.detail
            : {})
        }
      );
    }

    const corpusBlocked =
      corpusAudit.some(
        (event) =>
          event.decision ===
            "BLOCK"
      );
    audit.record(
      "gate",
      "G36_LEGAL_CORPUS_RUNTIME",
      corpusBlocked
        ? "BLOCKED"
        : "OK",
      {
        toolEvents:
          corpusAudit.length
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
    const finalization = this.finalizer.finalize({
      text: execution.output,
      ledger,
      audit,
      closeSession: false
    });

    const safeToPresent =
      finalization.result === "PASS" &&
      !corpusBlocked;
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
      finalization: safeToPresent
        ? finalization.result
        : "BLOCKED",
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