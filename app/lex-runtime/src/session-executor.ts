import { genericWords } from "./privacy/generic-words.js";
import type { EvidenceImage } from "./document-evidence.js";
import type { PseudonymizationVaultSnapshot } from "./privacy/pseudonymizer.js";
import {
  placeholderGrammar,
  partyGroups,
  placeholderKeyPrompt,
  type PlaceholderGrammar
} from "./privacy/token-legend.js";
import { coreLawRetrievalPrompt } from "./core-law-tool-runtime.js";
import {
  restoreWithReport,
  type Restoration
} from "./privacy/restoration-report.js";
import type {
  PersonMorphology
} from "./privacy/person-morphology.js";
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
import type { ExecutionStepReporter } from "./execution-steps.js";
import type {
  NormalizedToolCall,
  NormalizedToolResult,
  ProviderId,
  StreamCallbacks
} from "./providers/types.js";
import { LexSkillRegistry } from "./registry.js";
import {
  VerificationLedger,
  type VerificationRecord
} from "./verification-ledger.js";
import type {
  LegalVerificationToolFactory
} from "./verification-tool-runtime.js";
import type {
  CoreLawIndex
} from "./core-law-index.js";
import {
  CoreLawToolRuntime
} from "./core-law-tool-runtime.js";
import {
  LegalCorpusToolRuntime
} from "./legal-corpus-tool-runtime.js";
import {
  LegalFederationToolRuntime
} from "./legal-federation-tool-runtime.js";
import type {
  LegalSourceCrossCheckStatus,
  LegalSourceTier
} from "./legal-source-policy.js";
import {
  ReportBlueprintToolRuntime,
  type AcceptedReportBlueprint,
  type ReportBlueprintKind
} from "./report-blueprint-tool-runtime.js";
import {
  evaluateDeterministicWorkflowOutput,
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
import {
  evaluateGuideOutput,
  type GuideSessionState
} from "./guide-session-state.js";
import {
  evaluateGateIInvariants,
  type GateIInvariantReport
} from "./gate-i-invariants.js";
import {
  blockGateITurn,
  createGateITurnState,
  passGateITurnPhase,
  type GateITurnState
} from "./gate-i-turn-state.js";
import {
  AuxiliaryModelScheduler,
  auxiliaryVerificationCallKey,
  type AuxiliaryRoutingConfig,
  type AuxiliaryRoutingSummary
} from "./auxiliary-model-scheduler.js";
import {
  evaluateModelTaskOwnershipGate
} from "./model-task-ownership.js";
import {
  applyAutomaticVerificationMarkers,
  detectHistoricalAsOf,
  planAutomaticLegalVerification
} from "./gate-i-auto-verification.js";
import {
  runGateIRuntimePrelude
} from "./gate-i-runtime-prelude.js";
import {
  evaluateGateIInputCompleteness,
  evaluateGateIWorkflowContract,
  gateIWorkflowContract,
  type GateIWorkflowContractReport
} from "./gate-i-contracts.js";
import type {
  OrderedCaseWorkflowId
} from "./ordered-case-workflow-state.js";
import {
  LocalPolishPseudonymizer,
  PseudonymizationVault,
  type NamedEntityRecognizer
} from "./privacy/pseudonymizer.js";
import {
  ModelAutoRouter,
  type ModelAutoRoutingResult
} from "./model-auto-routing.js";
import {
  privacyRecognizerFor
} from "./privacy/local-llm-ner.js";
import {
  parseSkillSelectionEnvelope
} from "./skill-selection.js";

export type SessionDocumentAttachment = {
  documentId: string;
  caseId?: string;
  grammar?: PlaceholderGrammar[];
  totalPages?: number;
  // Uses the case's shared key: its tokens are the chat's tokens, not namespaced.
  sharedKey?: boolean;
  sourceScope?:
    | "MANUAL"
    | "CASE_KNOWLEDGE"
    | "FIRM_KNOWLEDGE"
    | "FIRM_TEMPLATE";
  // Shown to the model for firm templates (a filename, no case data).
  title?: string;
  // Picked by the user (not retrieved): sent whole or not at all.
  selectedByUser?: boolean;
  // Page images (photos; text pages on request), personal data masked.
  images?: EvidenceImage[];
  chunks: Array<{
    index: number;
    pageStart: number;
    pageEnd: number;
    text: string;
    representation?:
      | "FULL"
      | "EXTRACTIVE_DIGEST";
    originalChars?: number;
  }>;
};

export type SessionExecutionRequest = {
  query: string;
  // The case's shared key: names in the message get the documents' symbols.
  privacySeed?: PseudonymizationVaultSnapshot;
  documentAttachments?: SessionDocumentAttachment[];
  provider: ProviderId;
  model: string;
  accountSessionKey?: string;
  modelRouting?: {
    primary: {
      provider: ProviderId;
      model: string;
    };
    auxiliary?: AuxiliaryRoutingSummary;
  };
  primarySkill: string;
  mode: "LAIK" | "PRAWNIK";
  // Set only by the AUTO router (decision.legal === false): answer without
  // loading legal skills, modules or legal tools.
  conversationalOnly?: boolean;
  // AUTO for account/API models: the model picks skills itself.
  modelSelectsSkills?: boolean;
  // Runtime-only (never parsed from HTTP): receives the live draft text of
  // the model answer with the chat pseudonyms already restored.
  onDraft?: (text: string) => void;
  // Runtime-only: the stage of the turn and what was done in it (skills, tools).
  onStep?: ExecutionStepReporter;
  modelContextTokens?: number;
  tokenCharsPerToken?: number;
  auxiliaryText?: string;
  auxiliaryRouting?: AuxiliaryRoutingConfig;
  guideContext?: Pick<
    GuideSessionState,
    | "revision"
    | "audience"
    | "interactionMode"
    | "rawAnalysis"
    | "step"
    | "guidedQuestionIndex"
    | "pendingIrreversibleAction"
  >;
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
  orderedCaseWorkflowContext?: {
    workflowId:
      OrderedCaseWorkflowId;
    checkpoint: string;
    revision: number;
  };
};

export type PublicBlockedReference = {
  claim: string;
  kind: "statute" | "journal" | "case";
  line: number;
  status: string;
};

export type PublicAuxiliarySourceItem = {
  claim?: string;
  sourceUrl: string;
  sourceTier:
    LegalSourceTier;
  classification:
    "KNOWN_DOMAIN" |
    "CONSERVATIVE_R3";
  classificationBasis:
    string;
  crossCheckStatus:
    LegalSourceCrossCheckStatus;
  crossCheckUrl?: string;
  crossCheckTier?:
    | "R1"
    | "R2A";
  publishedAt?: string;
  updatedAt?: string;
  staleOrUndatedWarning:
    boolean;
  higherTierCrossCheckSatisfied:
    boolean;
  conflict: boolean;
  instruction: string;
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

export function publicAuxiliarySourceFromToolResult(
  result:
    NormalizedToolResult
): PublicAuxiliarySourceItem | null {
  let payload:
    unknown;
  try {
    payload =
      JSON.parse(
        result.content
      );
  } catch {
    return null;
  }

  if (
    !payload ||
    typeof payload !==
      "object"
  ) {
    return null;
  }

  const value =
    payload as {
      status?: unknown;
      classification?: unknown;
      candidate?: {
        claim?: unknown;
        url?: unknown;
        tier?: unknown;
        provenance?: {
          classificationBasis?: unknown;
          publishedAt?: unknown;
          updatedAt?: unknown;
        };
        crossCheckStatus?: unknown;
        crossCheckUrl?: unknown;
        crossCheckTier?: unknown;
      };
      assessment?: {
        auxiliaryOnly?: unknown;
        staleOrUndatedWarning?: unknown;
        higherTierCrossCheckSatisfied?: unknown;
        conflict?: unknown;
        instruction?: unknown;
      };
    };

  const candidate =
    value.candidate;
  const assessment =
    value.assessment;
  const tier =
    candidate?.tier;

  if (
    value.status !== "OK" ||
    assessment
      ?.auxiliaryOnly !==
      true ||
    typeof candidate
      ?.url !== "string" ||
    (
      tier !== "R2B" &&
      tier !== "R3"
    ) ||
    (
      value.classification !==
        "KNOWN_DOMAIN" &&
      value.classification !==
        "CONSERVATIVE_R3"
    ) ||
    typeof candidate
      .provenance
      ?.classificationBasis !==
      "string" ||
    typeof candidate
      .crossCheckStatus !==
      "string" ||
    typeof assessment
      .staleOrUndatedWarning !==
      "boolean" ||
    typeof assessment
      .higherTierCrossCheckSatisfied !==
      "boolean" ||
    typeof assessment
      .conflict !==
      "boolean" ||
    typeof assessment
      .instruction !==
      "string"
  ) {
    return null;
  }

  const crossCheckStatus =
    candidate
      .crossCheckStatus;
  if (
    crossCheckStatus !==
      "NOT_REQUIRED" &&
    crossCheckStatus !==
      "PENDING" &&
    crossCheckStatus !==
      "CONFIRMED_R1_R2A" &&
    crossCheckStatus !==
      "CONFLICT" &&
    crossCheckStatus !==
      "UNAVAILABLE"
  ) {
    return null;
  }

  return {
    ...(typeof candidate
      .claim === "string" &&
    candidate.claim.trim()
      ? {
          claim:
            candidate.claim
              .trim()
        }
      : {}),
    sourceUrl:
      candidate.url,
    sourceTier:
      tier,
    classification:
      value
        .classification,
    classificationBasis:
      candidate
        .provenance
        .classificationBasis,
    crossCheckStatus,
    ...(typeof candidate
      .crossCheckUrl ===
      "string"
      ? {
          crossCheckUrl:
            candidate
              .crossCheckUrl
        }
      : {}),
    ...(candidate
      .crossCheckTier ===
        "R1" ||
    candidate
      .crossCheckTier ===
        "R2A"
      ? {
          crossCheckTier:
            candidate
              .crossCheckTier
        }
      : {}),
    ...(typeof candidate
      .provenance
      .publishedAt ===
      "string"
      ? {
          publishedAt:
            candidate
              .provenance
              .publishedAt
        }
      : {}),
    ...(typeof candidate
      .provenance
      .updatedAt ===
      "string"
      ? {
          updatedAt:
            candidate
              .provenance
              .updatedAt
        }
      : {}),
    staleOrUndatedWarning:
      assessment
        .staleOrUndatedWarning,
    higherTierCrossCheckSatisfied:
      assessment
        .higherTierCrossCheckSatisfied,
    conflict:
      assessment.conflict,
    instruction:
      assessment.instruction
  };
}

function normalizedAuxiliaryClaim(
  value: string
): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("pl")
    .replace(/\s+/gu, " ")
    .trim();
}

export function reconcileAuxiliarySourcesWithVerification(
  sources:
    PublicAuxiliarySourceItem[],
  records:
    VerificationRecord[]
): PublicAuxiliarySourceItem[] {
  return sources.map(
    (source) => {
      if (
        !source.claim ||
        source.conflict
      ) {
        return {
          ...source
        };
      }

      const claim =
        normalizedAuxiliaryClaim(
          source.claim
        );
      const verified =
        [...records]
          .reverse()
          .find(
            (record) =>
              normalizedAuxiliaryClaim(
                record.claim
              ) === claim &&
              (
                record.status ===
                  "VERIFIED" ||
                record.status ===
                  "SUPPORTED"
              ) &&
              (
                record.sourceTier ===
                  "R1" ||
                record.sourceTier ===
                  "R2A"
              ) &&
              Boolean(
                record.sourceUrl
                  ?.trim()
              )
          );

      if (
        !verified ||
        !verified.sourceUrl ||
        (
          verified.sourceTier !==
            "R1" &&
          verified.sourceTier !==
            "R2A"
        )
      ) {
        return {
          ...source,
          crossCheckStatus:
            source.crossCheckStatus ===
              "NOT_REQUIRED"
              ? "NOT_REQUIRED"
              : "PENDING",
          higherTierCrossCheckSatisfied:
            false
        };
      }

      return {
        ...source,
        crossCheckStatus:
          "CONFIRMED_R1_R2A",
        crossCheckUrl:
          verified.sourceUrl,
        crossCheckTier:
          verified.sourceTier,
        higherTierCrossCheckSatisfied:
          true
      };
    }
  );
}

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
  documentAliasDocumentIds?: string[];
};

export const SESSION_EXECUTION_INTERNAL =
  Symbol("LEX_SESSION_EXECUTION_INTERNAL");

export type SessionExecutionResponse = {
  sessionId: string;
  status: "DRAFT_PRESENTABLE" | "BLOCKED";
  provider: ProviderId;
  model: string;
  modelRouting?: {
    primary: {
      provider: ProviderId;
      model: string;
    };
    auxiliary?: AuxiliaryRoutingSummary;
  };
  primarySkill: string;
  loadedSkills?: string[];
  executionSkills?: string[];
  domainSkills?: string[];
  answer?: string;
  documentCitations?: PublicDocumentCitation[];
  restorations?: Restoration[];
  unresolvedTokens?: string[];
  documentCitationFreshness?: {
    result: "PASS";
    checked: number;
  };
  reportBlueprint?: AcceptedReportBlueprint;
  finalization: "PASS" | "DEGRADED" | "BLOCKED";
  blockedReferences: PublicBlockedReference[];
  verification: {
    records: number;
    verified: number;
    supported: number;
    unverified: number;
  };
  evidence: PublicEvidenceItem[];
  auxiliarySources?:
    PublicAuxiliarySourceItem[];
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
  gateI?: GateIInvariantReport;
  gateIWorkflowContract?: GateIWorkflowContractReport;
  gateITurn?: GateITurnState;
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
  orderedCaseWorkflow?: {
    workflowId:
      OrderedCaseWorkflowId;
    caseId: string;
    revision: number;
    status:
      | "ACTIVE"
      | "COMPLETE";
    nextCheckpoint:
      string | null;
    closedCheckpoints:
      string[];
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

export function namespaceDocumentAttachmentTokens(
  attachments: SessionDocumentAttachment[]
): SessionDocumentAttachment[] {
  const prefixes =
    new Map<string, string>();

  const prefixFor = (
    documentId: string
  ): string => {
    const existing =
      prefixes.get(documentId);
    if (existing) {
      return existing;
    }
    const prefix =
      "D" +
      String(
        prefixes.size + 1
      ).padStart(2, "0");
    prefixes.set(
      documentId,
      prefix
    );
    return prefix;
  };

  return attachments.map(
    (attachment) => {
      if (attachment.sharedKey) {
        return { ...attachment, chunks: attachment.chunks.map((chunk) => ({ ...chunk })) };
      }
      const prefix =
        prefixFor(
          attachment.documentId
        );
      return {
        ...attachment,
        ...(attachment.grammar
          ? {
              grammar: attachment.grammar.map((entry) => ({
                ...entry,
                token: entry.token.replace(
                  /^\[PII:/,
                  `[LMPII:${prefix}:`
                ),
                ...(entry.owner ? { owner: entry.owner.replace(/^\[PII:/, `[LMPII:${prefix}:`) } : {})
              }))
            }
          : {}),
        chunks:
          attachment.chunks.map(
            (chunk) => ({
              ...chunk,
              text:
                chunk.text.replace(
                  /\[PII:([A-Z_]+):(\d{4})\]/g,
                  (_token, kind, sequence) =>
                    `[LMPII:${prefix}:${kind}:${sequence}]`
                )
            })
          )
      };
    }
  );
}

/**
 * Stored page headers ("[STRONA 3 · CZĘŚĆ 1/2 · OCR]") as an explicit page
 * boundary with the page count, so a model knows how long the document is
 * and where each page starts.
 */
export function markPages(text: string, totalPages?: number): string {
  return text.replace(
    /^\[STRONA (\d+)(?: · CZĘŚĆ (\d+)\/(\d+))? · ([A-Z]+)\]$/gm,
    (_header, page: string, part?: string, parts?: string, source?: string) =>
      `=== STRONA ${page}${totalPages ? `/${totalPages}` : ""}` +
      (part && part !== "1" ? ` (ciąg dalszy, część ${part}/${parts})` : part ? ` (część ${part}/${parts})` : "") +
      (source === "OCR" ? " · tekst z OCR" : source === "BLANK" ? " · pusta" : "") +
      " ==="
  );
}

export type SelectedEvidenceImage = EvidenceImage & { documentId: string };

// At most this many images per message, and this much image data.
export const MAX_EVIDENCE_IMAGES = 20;
const MAX_EVIDENCE_BASE64 = 20 * 1024 * 1024;

/** Images of the pages whose chunks made it into the context, in order. */
export function selectEvidenceImages(
  requested: SessionDocumentAttachment[],
  inContext: SessionDocumentAttachment[]
): SelectedEvidenceImage[] {
  const selected: SelectedEvidenceImage[] = [];
  let size = 0;
  for (const attachment of inContext) {
    const source = requested.find((item) => item.documentId === attachment.documentId && item.images?.length);
    if (!source?.images) continue;
    for (const image of source.images) {
      const covered = attachment.chunks.some((chunk) => chunk.pageStart <= image.page && image.page <= chunk.pageEnd);
      if (!covered || selected.length >= MAX_EVIDENCE_IMAGES || size + image.data.length > MAX_EVIDENCE_BASE64) continue;
      size += image.data.length;
      selected.push({ ...image, documentId: attachment.documentId });
    }
  }
  return selected;
}

export const EVIDENCE_IMAGE_NOTE = [
  "# OBRAZY JAKO DOWÓD",
  "Do kontekstu dołączono obrazy (zdjęcia, strony) w kolejności podanej przy znacznikach [OBRAZ n].",
  "Czarne prostokąty zasłaniają dane osobowe i nieczytelne napisy: nie zgaduj, co pod nimi jest.",
  "Opisuj to, co widać (stan rzeczy, uszkodzenia, miejsce, układ, podpisy i pieczęcie jako fakt ich obecności); oddziel obserwację od wniosku i nie przypisuj osób na podstawie wyglądu.",
  "Nazwy i dane z dokumentu bierz z tekstu z symbolami [PII:...], nie z obrazu."
].join("\n");

function buildDocumentContext(
  attachments: SessionDocumentAttachment[],
  images: SelectedEvidenceImage[] = []
): string {
  const sections = attachments.map((attachment) => {
    const chunks = attachment.chunks.map((chunk) => {
      const sourceLabel =
        attachment.sourceScope === "FIRM_TEMPLATE"
          ? "WZÓR KANCELARII"
          : attachment.sourceScope === "FIRM_KNOWLEDGE"
            ? "KNOW-HOW KANCELARII"
            : attachment.sourceScope === "CASE_KNOWLEDGE"
              ? "CASE KNOWLEDGE"
              : "DOCUMENT";
      const representation =
        chunk.representation ===
          "EXTRACTIVE_DIGEST"
          ? " · EXTRACTIVE DIGEST · BACKLINK=ORIGINAL_CHUNK"
          : "";
      return [
        `[${sourceLabel} ${attachment.documentId} · CHUNK ${chunk.index} · PAGES ${chunk.pageStart}-${chunk.pageEnd}${representation}]`,
        markPages(chunk.text, attachment.totalPages)
      ].join("\n");
    });
    return [
      ...(attachment.title
        ? [`[${attachment.documentId} · PLIK: ${attachment.title}]`]
        : []),
      ...(attachment.totalPages
        ? [
            `[${attachment.documentId} · STRON: ${attachment.totalPages} · każda strona zaczyna się znacznikiem "=== STRONA n/${attachment.totalPages} ==="]`
          ]
        : []),
      ...chunks
    ].join("\n\n");
  });

  const firm = attachments.some(
    (attachment) => attachment.sourceScope === "FIRM_TEMPLATE" || attachment.sourceScope === "FIRM_KNOWLEDGE"
  );
  const imageIndex = images.length
    ? [
        EVIDENCE_IMAGE_NOTE,
        ...images.map(
          (image, index) =>
            `[OBRAZ ${index + 1}: ${image.documentId} · STRONA ${image.page} · zamaskowane obszary: ${image.masked}]`
        )
      ].join("\n")
    : null;
  return [...(firm ? [FIRM_MATERIAL_NOTE] : []), ...sections, ...(imageIndex ? [imageIndex] : [])].join("\n\n---\n\n");
}

export const buildDocumentContextForTest = buildDocumentContext;

export const FIRM_MATERIAL_NOTE = [
  "# MATERIAŁY KANCELARII",
  "Bloki oznaczone WZÓR KANCELARII i KNOW-HOW KANCELARII pochodzą z biblioteki kancelarii, nie z akt sprawy.",
  "- Wzór: przejmij jego układ, kolejność części, styl i stałe formuły; treść merytoryczną bierz z dokumentów sprawy i wiadomości użytkownika.",
  "- Nie przenoś do pisma danych przykładowych z wzoru (stron, sygnatur, kwot, dat, adresów); w miejsca bez danych wstaw neutralne pole w nawiasie kwadratowym, np. [Kwota], [Termin].",
  "- Materiały kancelarii nie są dowodami ani faktami w sprawie; nie cytuj ich jako źródła faktów."
].join("\n");

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

const DRAFT_PII_TOKEN =
  /\[PII:([A-Z_]+):(\d{4})(?:\|([A-Z]{2,4}))?\]/g;
// An incomplete token at the end of the stream is held back until complete.
const DRAFT_PARTIAL_TOKEN_TAIL =
  /\[(?:P(?:I(?:I(?::[A-Z_]*(?::\d{0,4}(?:\|[A-Z]{0,4})?)?)?)?)?)?$/;

export function createDraftCallbacks(
  vault: PseudonymizationVault,
  onDraft: (text: string) => void
): StreamCallbacks {
  let raw = "";
  const publish = () => {
    const visible =
      raw.replace(
        DRAFT_PARTIAL_TOKEN_TAIL,
        ""
      );
    onDraft(
      visible.replace(
        DRAFT_PII_TOKEN,
        (token, kind: string, sequence: string, requestedCase?: string) => {
          const base = `[PII:${kind}:${sequence}]`;
          return vault.hasToken(base)
            ? vault.restore(base, requestedCase ?? null).text
            : token;
        }
      )
    );
  };
  return {
    onContentDelta: (text: string) => {
      raw += text;
      publish();
    },
    // A tool round starts a new model turn; the previous partial text was
    // only a preamble to the tool call.
    onToolCallStart: () => {
      raw = "";
      publish();
    }
  };
}

export interface SessionExecutor {
  resolveAutoRouting?(
    request: SessionExecutionRequest
  ): Promise<ModelAutoRoutingResult>;
  execute(request: SessionExecutionRequest): Promise<SessionExecutionResponse>;
}

export class SafeSessionExecutor implements SessionExecutor {
  private readonly engine: LexExecutionEngine;
  private readonly autoRouter:
    ModelAutoRouter;
  private readonly auxiliaryScheduler:
    AuxiliaryModelScheduler;

  constructor(
    private readonly registry: LexSkillRegistry,
    private readonly providers: ProviderGateway,
    private readonly finalizer = new AuditedFinalizer(),
    private readonly verificationToolFactory?: LegalVerificationToolFactory,
    private readonly chatNamedEntityRecognizer?: NamedEntityRecognizer,
    private readonly legalFederationTools?: LegalFederationToolRuntime,
    private readonly coreLawIndex?: CoreLawIndex,
    private readonly personMorphology?: PersonMorphology
  ) {
    this.engine = new LexExecutionEngine(
      registry,
      providers
    );
    this.autoRouter =
      new ModelAutoRouter(
        registry,
        providers
      );
    this.auxiliaryScheduler =
      new AuxiliaryModelScheduler(
        providers
      );
  }

  // A local primary model keeps the text on this machine, so the chat does
  // not also wait for local-model PII detection before answering.
  private chatRecognizerFor(
    model: string
  ): NamedEntityRecognizer | undefined {
    return this.chatNamedEntityRecognizer
      ? privacyRecognizerFor(
          this.chatNamedEntityRecognizer,
          !model.startsWith("local/")
        )
      : undefined;
  }

  async resolveAutoRouting(
    request: SessionExecutionRequest
  ): Promise<ModelAutoRoutingResult> {
    const vault =
      new PseudonymizationVault(request.privacySeed);
    const pseudonymizer =
      new LocalPolishPseudonymizer(
        vault,
        this.chatRecognizerFor(
          request.model
        ),
        this.personMorphology
      );
    let protectedQuery: string;
    try {
      protectedQuery =
        (
          await pseudonymizer
            .pseudonymize(
              request.query
            )
        ).text;
    } catch {
      throw new Error(
        "CHAT_PRIVACY_GATE_FAILED"
      );
    }

    const routed =
      await this.autoRouter
        .resolve({
          query:
            protectedQuery,
          provider:
            request.provider,
          model:
            request.model
        });

    // Keep the user's original text for the actual execution. Only the
    // model-selected routing envelope is copied from the protected prepass.
    const originalEnvelope =
      parseSkillSelectionEnvelope(
        request.query
      );
    const firstBreak =
      routed.query.indexOf(
        "\n"
      );
    const routingHeader =
      firstBreak >= 0
        ? routed.query.slice(
            0,
            firstBreak
          )
        : routed.query;

    return {
      decision:
        routed.decision,
      query:
        routingHeader +
        "\n" +
        originalEnvelope.query
    };
  }

  async execute(
    request: SessionExecutionRequest
  ): Promise<SessionExecutionResponse> {
    const step: ExecutionStepReporter = request.onStep ?? (() => undefined);
    step("PREPARE", "anonimizacja wiadomości");
    if (request.documentAttachments?.length) {
      step("PREPARE", `pliki w kontekście: ${request.documentAttachments.length}`);
    }
    const audit = new AuditTrail();
    audit.start({
      provider: request.provider,
      model: request.model,
      mode: request.mode
    });

    const chatPrivacyVault =
      new PseudonymizationVault(request.privacySeed);
    const chatPseudonymizer =
      new LocalPolishPseudonymizer(
        chatPrivacyVault,
        this.chatRecognizerFor(
          request.model
        ),
        this.personMorphology
      );
    let protectedQuery:
      string;
    let protectedAuxiliaryText:
      string | undefined;
    try {
      const protectedPrimary =
        await chatPseudonymizer
          .pseudonymize(
            request.query
          );
      protectedQuery =
        protectedPrimary.text;

      if (
        request.auxiliaryText !==
          undefined &&
        request.auxiliaryText !==
          request.query
      ) {
        protectedAuxiliaryText =
          (
            await chatPseudonymizer
              .pseudonymize(
                request.auxiliaryText
              )
          ).text;
      } else if (
        request.auxiliaryText !==
          undefined
      ) {
        protectedAuxiliaryText =
          protectedQuery;
      }

      audit.record(
        "gate",
        "G39I_CHAT_PRIVACY",
        "OK",
        {
          pseudonymized:
            protectedPrimary
              .findings.length,
          kinds:
            Object.keys(
              protectedPrimary
                .counts
            ).sort(),
          vaultTokens:
            chatPrivacyVault
              .size
        }
      );
    } catch (error) {
      audit.record(
        "gate",
        "G39I_CHAT_PRIVACY",
        "BLOCKED",
        {
          error:
            error instanceof Error
              ? error.message
              : String(error)
        }
      );
      audit.close(
        "BLOCKED",
        {
          finalization:
            "PRIVACY_GATE"
        }
      );
      throw new Error(
        "CHAT_PRIVACY_GATE_FAILED"
      );
    }

    const requestedHistoricalAsOf =
      detectHistoricalAsOf(
        protectedQuery
      );

    const ledger = new VerificationLedger();
    const verificationTools = this.verificationToolFactory?.(ledger);
    const corpusTools = new LegalCorpusToolRuntime(
      this.registry,
      {
        modelSelectsSkills:
          request.modelSelectsSkills === true
      }
    );
    const reportTools = new ReportBlueprintToolRuntime();
    const federationTools =
      this.legalFederationTools;
    const auxiliarySources:
      PublicAuxiliarySourceItem[] =
      [];

    const auxiliary =
      await this.auxiliaryScheduler
        .preflight({
          config:
            request.auxiliaryRouting ?? {
              enabled: false,
              provider: "openai",
              model:
                "local/bielik-11b-v3-q4km"
            },
          primary: {
            provider:
              request.provider,
            model:
              request.model
          },
          currentUserText:
            protectedAuxiliaryText ??
            protectedQuery,
          ...(verificationTools
            ? {
                runVerificationTools:
                  (calls) =>
                    verificationTools
                      .runTools(calls)
              }
            : {})
        });

    audit.record(
      "gate",
      "G39K_AUXILIARY_MODEL_ROUTING",
      auxiliary.summary.status ===
        "FAILED"
        ? "DEGRADED"
        : "OK",
      {
        ...auxiliary.summary
      }
    );

    const modelTaskOwnership =
      evaluateModelTaskOwnershipGate(
        auxiliary.summary.ownership
      );
    audit.record(
      "gate",
      modelTaskOwnership.gate,
      modelTaskOwnership.result ===
        "PASS"
        ? "OK"
        : "BLOCKED",
      {
        registry:
          modelTaskOwnership.registry,
        resolution:
          modelTaskOwnership.resolution,
        errors:
          modelTaskOwnership.errors
      }
    );
    if (
      modelTaskOwnership.result !==
        "PASS"
    ) {
      audit.close(
        "BLOCKED",
        {
          finalization:
            "MODEL_TASK_OWNERSHIP"
        }
      );
      throw new Error(
        "MODEL_TASK_OWNERSHIP_GATE_FAILED"
      );
    }

    const gateIInput =
      evaluateGateIInputCompleteness(
        request.query,
        request.documentAttachments
          ?.length ?? 0
      );

    audit.record(
      "gate",
      "G39I_INPUT_COMPLETENESS",
      gateIInput.result ===
        "PASS"
        ? "OK"
        : "BLOCKED",
      {
        attachmentAssertion:
          gateIInput.attachmentAssertion,
        attachmentCount:
          gateIInput.attachmentCount,
        reason:
          gateIInput.reason
      }
    );

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
          : {}),
        ...(request.tokenCharsPerToken
          ? {
              tokenCharsPerToken:
                request.tokenCharsPerToken
            }
          : {})
      });
    const attachments =
      namespaceDocumentAttachmentTokens(
        contextSelection.attachments
      );
    const citationSources =
      contextSelection.citationSources;
    // Page images of the attachments in context (masked evidence), for
    // models that see images; others work from the text.
    const evidence = selectEvidenceImages(request.documentAttachments ?? [], attachments);
    const imagesDelivered =
      evidence.length > 0 && this.providers.supportsImages(request.provider, request.model);
    if (evidence.length) {
      step(
        "PREPARE",
        imagesDelivered
          ? `obrazy jako dowód: ${evidence.length} (dane osobowe zamaskowane)`
          : `obrazy pominięte: model przyjmuje tylko tekst (${evidence.length})`
      );
      audit.record("resource_read", "evidence-images", "OK", {
        delivered: imagesDelivered,
        images: evidence.map((image) => `${image.documentId}:${image.page}`),
        masked: evidence.reduce((sum, image) => sum + image.masked, 0)
      });
    }
    const documentContext =
      attachments.length > 0
        ? buildDocumentContext(
            attachments,
            imagesDelivered ? evidence : []
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
          representations:
            attachment.chunks.map(
              (chunk) =>
                chunk.representation ??
                "FULL"
            ),
          protectedOnly: true,
          ...(attachment.caseId ? { caseId: attachment.caseId } : {}),
          ...(attachment.sourceScope ? { sourceScope: attachment.sourceScope } : {})
        }
      );
    }

    const coreLawTools =
      this.coreLawIndex
        ? new CoreLawToolRuntime(
            this.coreLawIndex
          )
        : undefined;
    // Local 11-12B models call tools unreliably: they get the most relevant
    // core law articles in the prompt (retrieval, not training).
    const coreLawRag =
      this.coreLawIndex && request.model.startsWith("local/")
        ? coreLawRetrievalPrompt(this.coreLawIndex, protectedQuery)
        : null;
    // Claude account in AUTO: skills are read natively from the corpus
    // directory, so the corpus tools are not offered; the rest go over MCP.
    const nativeCorpus =
      request.modelSelectsSkills === true &&
      this.providers.nativeCorpusAccess(request.provider, request.model);
    const toolSchemas = [
      ...(nativeCorpus ? [] : corpusTools.schemas()),
      ...(coreLawTools
        ? coreLawTools.schemas()
        : []),
      ...reportTools.schemas(),
      ...(federationTools
        ? federationTools.schemas()
        : []),
      ...(verificationTools ? verificationTools.schemas() : [])
    ];
    const toolPrompt = [
      ...(nativeCorpus ? [] : [corpusTools.systemPromptAppendix()]),
      ...(coreLawTools
        ? [coreLawTools.systemPromptAppendix()]
        : []),
      reportTools.systemPromptAppendix(),
      ...(federationTools
        ? [federationTools.systemPromptAppendix()]
        : []),
      ...(verificationTools
        ? [verificationTools.systemPromptAppendix()]
        : []),
      ...(auxiliary.appendix
        ? [auxiliary.appendix]
        : []),
      ...(attachments.length > 0
        ? [documentCitationSystemPrompt(attachments)]
        : []),
      ...(coreLawRag ? [coreLawRag] : [])
    ].join("\n\n");

    // Kind and gender of every placeholder the model will see: it inflects
    // around them without ever seeing a name.
    const roles = genericWords().partyRoles;
    const placeholderKey = placeholderKeyPrompt([
      ...placeholderGrammar(
        [
          protectedQuery,
          protectedAuxiliaryText ?? "",
          // Shared-key documents use the chat's own (seeded) tokens.
          ...attachments
            .filter((attachment) => attachment.sharedKey)
            .flatMap((attachment) => attachment.chunks.map((chunk) => chunk.text))
        ].join("\n"),
        chatPrivacyVault
      ),
      ...attachments
        .filter((attachment) => !attachment.sharedKey)
        .flatMap((attachment) => attachment.grammar ?? [])
    ], partyGroups(
      // Parties of several persons named after a role word ("powodowie [..] i [..]").
      [protectedQuery, protectedAuxiliaryText ?? "", ...attachments.flatMap((attachment) => attachment.chunks.map((chunk) => chunk.text))],
      (word) => roles.has(word)
    ));

    const draftCallbacks =
      request.onDraft
        ? createDraftCallbacks(
            chatPrivacyVault,
            request.onDraft
          )
        : undefined;
    const execution = await this.engine.executePolishLegalQuery({
      ...(this.coreLawIndex
        ? {
            coreLaw: this.coreLawIndex.summaries().map((act) => ({
              eli: act.eli,
              title: act.title,
              labels: act.labels,
              domains: act.domains,
              articleCount: act.articleCount
            }))
          }
        : {}),
      onEvent: (event) => {
        if (event.status !== "OK") return;
        if (event.type === "route") step("ROUTING", event.target);
        else if (event.target === "MODEL_SKILL_SELECTION") step("ROUTING", "model dobiera skille według routera v3");
        else if (event.target === "LOCAL_QUICK_LEGAL") step("SKILLS", "szybka odpowiedź: węzły kwalifikatora i przepisy z ELI");
        else if (event.type === "skill_read") step("SKILLS", `skill ${event.target}`);
        else if (event.type === "resource_read") step("SKILLS", event.target);
        else if (event.type === "provider_start") step("MODEL", `model ${event.detail ?? event.target}`);
      },
      query: protectedQuery,
      ...(draftCallbacks
        ? {
            draftCallbacks
          }
        : {}),
      ...(documentContext ? { documentContext } : {}),
      ...(imagesDelivered
        ? { documentImages: evidence.map((image) => ({ mediaType: image.mediaType, data: image.data })) }
        : {}),
      ...(placeholderKey ? { placeholderKey } : {}),
      ...(request.conversationalOnly
        ? {
            conversationalOnly: true
          }
        : {}),
      ...(request.modelSelectsSkills
        ? {
            modelSelectsSkills: true
          }
        : {}),
      ...(nativeCorpus
        ? {
            nativeCorpus: {
              root: this.registry.root,
              onRead: (relativePath: string) => {
                corpusTools.recordNativeRead(relativePath);
                step("SKILLS", relativePath);
              },
              missingQualifier: () => corpusTools.missingCriminalQualifier()
            }
          }
        : {}),
      provider: request.provider,
      model: request.model,
      ...(request.accountSessionKey
        ? {
            continuityKey:
              request.accountSessionKey
          }
        : {}),
      route: {
        jurisdiction: "PL",
        primarySkill: request.primarySkill,
        mode: request.mode
      },
      ...(request.guideContext
        ? {
            guideContext:
              request.guideContext
          }
        : {}),
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
      ...(request.orderedCaseWorkflowContext
        ? {
            orderedCaseWorkflowContext:
              request.orderedCaseWorkflowContext
          }
        : {}),
      tools: toolSchemas,
      toolSystemPromptAppendix: toolPrompt,
      // A short question with retrieved ELI texts may take the local quick
      // lane; the engine decides from the route and the question itself.
      ...(coreLawRag && coreLawTools && attachments.length === 0
        ? {
            quickLocalLegal: {
              toolPrompt: [
                coreLawTools.systemPromptAppendix(),
                coreLawRag
              ].join("\n\n")
            }
          }
        : {}),
      runGateIRuntimePrelude:
        (workflowPlan) =>
          runGateIRuntimePrelude({
            workflow:
              workflowPlan.id,
            query:
              protectedQuery,
            ledger,
            ...(verificationTools
              ? {
                  runTools:
                    (calls) =>
                      verificationTools
                        .runTools(
                          calls
                        )
                }
              : {})
          }),
      runTools: async (calls) => {
        for (const call of calls) {
          if (corpusTools.handles(call.name)) {
            const target = [call.input.skill, call.input.path].filter((part) => typeof part === "string").join("/");
            step("SKILLS", target || call.name);
          } else {
            step("MODEL", `narzędzie ${call.name}`);
          }
        }
        const corpusCalls = calls.filter((call) => corpusTools.handles(call.name));
        const reportCalls = calls.filter((call) => reportTools.handles(call.name));
        const federationCalls = calls.filter(
          (call) =>
            federationTools?.handles(
              call.name
            ) ?? false
        );
        const coreLawCalls = calls.filter(
          (call) =>
            coreLawTools?.handles(
              call.name
            ) ?? false
        );
        const verificationCalls = calls.filter(
          (call) =>
            !(coreLawTools?.handles(call.name) ?? false) &&
            !corpusTools.handles(call.name) &&
            !reportTools.handles(call.name) &&
            !(federationTools?.handles(call.name) ?? false)
        );

        const corpusResults = corpusCalls.length > 0
          ? await corpusTools.runTools(corpusCalls)
          : [];
        const coreLawResults =
          coreLawTools &&
          coreLawCalls.length > 0
            ? await coreLawTools.runTools(
                coreLawCalls
              )
            : [];
        const reportResults = reportCalls.length > 0
          ? await reportTools.runTools(reportCalls)
          : [];
        const federationResults =
          federationTools &&
          federationCalls.length > 0
            ? await federationTools
                .runTools(
                  federationCalls
                )
            : [];

        for (
          const result
          of federationResults
        ) {
          const source =
            publicAuxiliarySourceFromToolResult(
              result
            );
          if (!source) {
            continue;
          }
          const key =
            [
              source.sourceUrl,
              source.claim ?? "",
              source.crossCheckStatus
            ].join("|");
          const exists =
            auxiliarySources.some(
              (item) =>
                [
                  item.sourceUrl,
                  item.claim ?? "",
                  item.crossCheckStatus
                ].join("|") ===
                key
            );
          if (!exists) {
            auxiliarySources.push(
              source
            );
          }
        }

        const cachedVerificationResults:
          NormalizedToolResult[] = [];
        const uncachedVerificationCalls:
          NormalizedToolCall[] = [];

        for (
          const call
          of verificationCalls
        ) {
          const cached =
            auxiliary
              .cachedVerificationResults
              .get(
                auxiliaryVerificationCallKey(
                  call
                )
              );
          if (cached) {
            auxiliary.summary
              .cachedVerifierReuses +=
                1;
            cachedVerificationResults.push({
              ...cached,
              tool_use_id:
                call.id
            });
          } else {
            uncachedVerificationCalls.push(
              call
            );
          }
        }

        const verificationResults =
          uncachedVerificationCalls.length > 0 &&
          verificationTools
            ? await verificationTools
                .runTools(
                  uncachedVerificationCalls
                )
            : [];

        const byId = new Map(
          [
            ...corpusResults,
            ...coreLawResults,
            ...reportResults,
            ...federationResults,
            ...cachedVerificationResults,
            ...verificationResults
          ].map((result) => [
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

    const modelSelectedSkills =
      execution.events.some(
        (event) =>
          event.target ===
            "MODEL_SKILL_SELECTION" &&
          event.status === "OK"
      );
    if (modelSelectedSkills) {
      // Report what the model actually loaded (audited corpus reads).
      const selection =
        corpusTools.modelSkillSelection();
      execution.loadedSkills =
        selection.loadedSkills;
      execution.domainSkills =
        selection.domainSkills;
      execution.executionSkills =
        selection.executionSkills;
      if (selection.primarySkill) {
        execution.primarySkill =
          selection.primarySkill;
      }
    }

    for (const event of coreLawTools?.auditEvents() ?? []) {
      audit.record(
        event.tool === "read_core_law_article"
          ? "resource_read"
          : "tool_decision",
        `core-law:${event.target}`,
        event.decision === "ALLOW" ? "OK" : "BLOCKED",
        {
          tool: event.tool,
          ...(event.detail ? event.detail : {})
        }
      );
    }

    const corpusAudit = corpusTools.auditEvents();
    for (const event of corpusAudit) {
      audit.record(
        event.tool === "read_legal_resource" || event.tool === "Read"
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

    // When the model picks skills itself, a refused read it can correct
    // (router-v3 not read yet, a guessed file name) is guidance, not a failed
    // turn. Path escapes and other refusals still block.
    const correctableCorpusRefusal =
      /^(ROUTER_V3_REQUIRED_FIRST|LEGAL_RESOURCE_NOT_FOUND|LEGAL_SKILL_NOT_FOUND|LEGAL_RESOURCE_NOT_FILE|INVALID_RESOURCE_OFFSET)/;
    const corpusBlocked = corpusAudit.some(
      (event) =>
        event.decision === "BLOCK" &&
        !(
          modelSelectedSkills &&
          correctableCorpusRefusal.test(
            String(event.detail?.error ?? "")
          )
        )
    );
    audit.record(
      "gate",
      "G36_LEGAL_CORPUS_RUNTIME",
      corpusBlocked ? "BLOCKED" : "OK",
      { toolEvents: corpusAudit.length }
    );

    const reportAudit =
      reportTools.auditEvents();
    for (const event of reportAudit) {
      audit.record(
        "tool_decision",
        event.target,
        event.decision === "ALLOW"
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

    if (federationTools) {
      const federationAudit =
        federationTools.auditEvents();
      for (
        const event
        of federationAudit
      ) {
        audit.record(
          "tool_decision",
          event.source
            ? "federated-legal:" +
              event.source
            : "federated-legal",
          event.decision ===
            "ALLOW"
            ? "OK"
            : "BLOCKED",
          {
            tool:
              event.tool,
            ...(event.detail
              ? event.detail
              : {})
          }
        );
      }
      audit.record(
        "gate",
        "G40_FEDERATED_LEGAL_RESEARCH",
        federationAudit.some(
          (event) =>
            event.decision ===
              "BLOCK"
        )
          ? "DEGRADED"
          : "OK",
        {
          toolEvents:
            federationAudit.length,
          verificationAuthority:
            "LEX_NATIVE_ONLY"
        }
      );
    }

    const workflowReads: DeterministicWorkflowReadReport =
      evaluateDeterministicWorkflowReads(
        execution.workflowPlan,
        corpusAudit,
        execution.events
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

    const automaticVerificationPlan =
      planAutomaticLegalVerification(
        execution.output,
        ledger,
        requestedHistoricalAsOf
      );
    let automaticVerificationExecuted = 0;

    if (
      automaticVerificationPlan.calls.length > 0 &&
      verificationTools
    ) {
      const results =
        await verificationTools.runTools(
          automaticVerificationPlan.calls
        );
      automaticVerificationExecuted =
        results.length;
    }

    const automaticVerification =
      applyAutomaticVerificationMarkers(
        execution.output,
        ledger,
        requestedHistoricalAsOf
      );

    audit.record(
      "gate",
      "G39I_AUTO_POST_DRAFT_VERIFICATION",
      automaticVerificationPlan.calls.length > 0 &&
      !verificationTools
        ? "BLOCKED"
        : "OK",
      {
        planned:
          automaticVerificationPlan.calls.length,
        executed:
          automaticVerificationExecuted,
        insertedMarkers:
          automaticVerification.inserted,
        skipped:
          automaticVerificationPlan.skipped
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
      processDocumentCitationMarkers(
        automaticVerification.text,
        citationSources
      );
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

    const workflowOutput =
      evaluateDeterministicWorkflowOutput(
        execution.workflowPlan,
        processedDocumentCitations.text,
        request.processWorkflowContext ||
        request.courtWorkflowContext ||
        request.orderedCaseWorkflowContext
          ? {
              ...(request.processWorkflowContext
                ? {
                    processCheckpoint:
                      request
                        .processWorkflowContext
                        .checkpoint
                  }
                : {}),
              ...(request.courtWorkflowContext
                ? {
                    courtCheckpoint:
                      request
                        .courtWorkflowContext
                        .checkpoint
                  }
                : {}),
              ...(request.orderedCaseWorkflowContext
                ? {
                    orderedCheckpoint:
                      request
                        .orderedCaseWorkflowContext
                        .checkpoint
                  }
                : {})
            }
          : undefined
      );
    const workflowOutputBlocked =
      workflowOutput.result ===
        "BLOCKED";
    audit.record(
      "gate",
      "G39H_WORKFLOW_OUTPUT",
      workflowOutputBlocked
        ? "BLOCKED"
        : "OK",
      {
        workflow:
          workflowOutput.workflow,
        mode:
          workflowOutput.mode,
        required:
          workflowOutput.required,
        observed:
          workflowOutput.observed,
        missing:
          workflowOutput.missing,
        orderValid:
          workflowOutput.orderValid
      }
    );

    const guideOutput =
      request.guideContext
        ? evaluateGuideOutput(
            request.guideContext,
            processedDocumentCitations.text
          )
        : null;
    const guideOutputBlocked =
      guideOutput?.result ===
        "BLOCKED";
    audit.record(
      "gate",
      "G39I_GUIDE_OUTPUT",
      guideOutputBlocked
        ? "BLOCKED"
        : "OK",
      guideOutput
        ? {
            questionCount:
              guideOutput.questionCount,
            oneQuestionRuleActive:
              guideOutput
                .oneQuestionRuleActive,
            irreversibleWarningRequired:
              guideOutput
                .irreversibleWarningRequired,
            irreversibleWarningPresent:
              guideOutput
                .irreversibleWarningPresent,
            violations:
              guideOutput.violations
          }
        : {
            active: false
          }
    );

    const requiredReportKind:
      ReportBlueprintKind | null =
        execution.workflowPlan.id ===
          "CLIENT_REPORT_V1"
          ? "CLIENT_REPORT_V1"
          : execution.workflowPlan.id ===
              "SITUATION_REPORT_V1"
            ? "SITUATION_REPORT_V1"
            : null;
    const reportBlueprint =
      requiredReportKind
        ? reportTools.acceptedFor(
            requiredReportKind
          )
        : null;
    const reportBlueprintBlocked =
      requiredReportKind !== null &&
      reportBlueprint === null;

    audit.record(
      "gate",
      "G39I_REPORT_BLUEPRINT",
      reportBlueprintBlocked
        ? "BLOCKED"
        : "OK",
      {
        required:
          requiredReportKind,
        accepted:
          reportBlueprint?.kind ??
          null,
        toolEvents:
          reportAudit.length
      }
    );

    const finalizationText =
      reportBlueprint
        ? [
            processedDocumentCitations.text,
            "[STRUCTURED_REPORT_BLUEPRINT_DATA]",
            JSON.stringify(
              reportBlueprint.blueprint
            ),
            "[/STRUCTURED_REPORT_BLUEPRINT_DATA]"
          ].join("\n")
        : processedDocumentCitations.text;

    step("VERIFY", "przepisy, orzeczenia i cytaty w odpowiedzi");
    const finalization = this.finalizer.finalize({
      text: finalizationText,
      ledger,
      audit,
      closeSession: false
    });

    const verificationRecords =
      ledger.all();
    const publicAuxiliarySources =
      reconcileAuxiliarySourcesWithVerification(
        auxiliarySources,
        verificationRecords
      );
    const gateI =
      evaluateGateIInvariants({
        events:
          execution.events,
        workflowReads,
        verificationRecords,
        finalization,
        outputValidation: {
          result:
            workflowOutputBlocked ||
            guideOutputBlocked ||
            reportBlueprintBlocked
              ? "BLOCKED"
              : "PASS",
          detail:
            [
              `workflow=${workflowOutput.result}`,
              `guide=${guideOutput?.result ?? "N/A"}`,
              `reportBlueprint=${reportBlueprintBlocked ? "BLOCKED" : "PASS"}`
            ].join(";")
        },
        documentCitations: {
          accepted:
            processedDocumentCitations
              .citations.length,
          rejected:
            processedDocumentCitations
              .rejectedMarkers,
          quotedWithoutExactHighlight:
            processedDocumentCitations
              .citations
              .filter(
                (citation) =>
                  Boolean(
                    citation.quote
                  ) &&
                  (
                    citation
                      .highlightStart ===
                      undefined ||
                    citation
                      .highlightEnd ===
                      undefined
                  )
              )
              .length
        }
      });
    const gateIBlocked =
      gateI.result ===
        "BLOCKED";

    const gateIContract =
      gateIWorkflowContract(
        execution.workflowPlan.id,
        execution.workflowPlan
          .executionSkill
      );

    const stateTransition:
      | "PASS"
      | "BLOCKED"
      | "NOT_APPLICABLE" =
      gateIContract.stateModel ===
        "DURABLE_CASE"
        ? (
            (
              execution.workflowPlan.id ===
                "PROCESS_PLEADING_V1" &&
              request
                .processWorkflowContext
            ) ||
            (
              execution.workflowPlan.id ===
                "COURT_ANALYSIS_V1" &&
              request
                .courtWorkflowContext
            ) ||
            (
              execution.workflowPlan.id ===
                "CHRONOLOGY_V1" &&
              request
                .chronologyWorkflowContext
            ) ||
            (
              execution.workflowPlan.id ===
                "CONTRACT_ANALYSIS_V1" &&
              request
                .contractWorkflowContext
            ) ||
            (
              (
                execution.workflowPlan.id ===
                  "EVIDENCE_ANALYSIS_V1" ||
                execution.workflowPlan.id ===
                  "WITNESS_QUESTIONING_V1"
              ) &&
              request
                .orderedCaseWorkflowContext
            )
          )
          ? "PASS"
          : "BLOCKED"
        : gateIContract.stateModel ===
            "DURABLE_SESSION"
          ? (
              execution.workflowPlan.id ===
                "LEGAL_GUIDE_V1" &&
              request.guideContext
            )
            ? "PASS"
            : "BLOCKED"
          : "NOT_APPLICABLE";

    const gateIWorkflowContractReport =
      evaluateGateIWorkflowContract({
        contract:
          gateIContract,
        invariants:
          gateI,
        input:
          gateIInput,
        stateTransition
      });
    const gateIWorkflowContractBlocked =
      gateIWorkflowContractReport.result ===
        "BLOCKED";

    audit.record(
      "gate",
      gateIWorkflowContractReport.gate,
      gateIWorkflowContractBlocked
        ? "BLOCKED"
        : "OK",
      {
        workflow:
          gateIWorkflowContractReport.workflow,
        stateModel:
          gateIWorkflowContractReport.stateModel,
        commonInvariants:
          gateIWorkflowContractReport.commonInvariants,
        checks:
          gateIWorkflowContractReport.checks
      }
    );

    let gateITurn =
      createGateITurnState(
        execution.workflowPlan.id
      );
    const check = (
      id:
        GateIInvariantReport["checks"][number]["id"]
    ) =>
      gateI.checks.find(
        (item) =>
          item.id === id
      );

    if (
      check("ROUTER_FIRST")
        ?.result !== "PASS"
    ) {
      gateITurn =
        blockGateITurn(
          gateITurn,
          "ROUTER_FIRST"
        );
    } else {
      gateITurn =
        passGateITurnPhase(
          gateITurn,
          "ROUTER_PREFLIGHT",
          "prawny-router-v3 first"
        );

      const workflowPreflight =
        execution.events.find(
          (event) =>
            event.type ===
              "gate" &&
            event.target ===
              "G39H_WORKFLOW_PREFLIGHT"
        );
      if (
        workflowPreflight
          ?.status !== "OK"
      ) {
        gateITurn =
          blockGateITurn(
            gateITurn,
            "SKILL_PREFLIGHT"
          );
      } else {
        gateITurn =
          passGateITurnPhase(
            gateITurn,
            "SKILL_PREFLIGHT",
            execution.workflowPlan.id
          );

        if (
          corpusBlocked ||
          check("CORE_RESOURCES")
            ?.result !==
              "PASS" ||
          check("WORKFLOW_RESOURCES")
            ?.result !==
              "PASS"
        ) {
          gateITurn =
            blockGateITurn(
              gateITurn,
              "RESOURCE_READS"
            );
        } else {
          gateITurn =
            passGateITurnPhase(
              gateITurn,
              "RESOURCE_READS",
              `workflowReads=${workflowReads.observed.length}`
            );

          const providerComplete =
            execution.events.find(
              (event) =>
                event.type ===
                  "gate" &&
                event.target ===
                  "G39H_WORKFLOW_PROVIDER_COMPLETE"
            );
          if (
            providerComplete
              ?.status !== "OK"
          ) {
            gateITurn =
              blockGateITurn(
                gateITurn,
                "SEMANTIC_EXECUTION"
              );
          } else {
            gateITurn =
              passGateITurnPhase(
                gateITurn,
                "SEMANTIC_EXECUTION"
              );

            if (
              check("SOURCE_PROVENANCE")
                ?.result !==
                  "PASS" ||
              check("SOURCE_HIERARCHY")
                ?.result !==
                  "PASS" ||
              check("TEMPORAL_FRESHNESS")
                ?.result !==
                  "PASS"
            ) {
              gateITurn =
                blockGateITurn(
                  gateITurn,
                  "SOURCE_VERIFICATION"
                );
            } else {
              gateITurn =
                passGateITurnPhase(
                  gateITurn,
                  "SOURCE_VERIFICATION",
                  `records=${gateI.verifiedOrSupportedRecords}`
                );

              if (
                check("CITATION_LEDGER")
                  ?.result !==
                    "PASS" ||
                check("LEGAL_CITATIONS")
                  ?.result !==
                    "PASS" ||
                check("CASE_SIGNATURES")
                  ?.result !==
                    "PASS" ||
                check("DOCUMENT_CITATIONS")
                  ?.result !==
                    "PASS"
              ) {
                gateITurn =
                  blockGateITurn(
                    gateITurn,
                    "CITATION_VALIDATION"
                  );
              } else {
                gateITurn =
                  passGateITurnPhase(
                    gateITurn,
                    "CITATION_VALIDATION",
                    `references=${gateI.legalReferences};cases=${gateI.caseReferences}`
                  );

                if (
                  workflowOutputBlocked ||
                  guideOutputBlocked ||
                  reportBlueprintBlocked
                ) {
                  gateITurn =
                    blockGateITurn(
                      gateITurn,
                      "OUTPUT_VALIDATION"
                    );
                } else {
                  gateITurn =
                    passGateITurnPhase(
                      gateITurn,
                      "OUTPUT_VALIDATION"
                    );

                  if (
                    check("FINALIZATION")
                      ?.result !==
                        "PASS"
                  ) {
                    gateITurn =
                      blockGateITurn(
                        gateITurn,
                        "FINALIZATION"
                      );
                  } else {
                    gateITurn =
                      passGateITurnPhase(
                        gateITurn,
                        "FINALIZATION"
                      );
                  }
                }
              }
            }
          }
        }
      }
    }

    audit.record(
      "gate",
      "G39I_TURN_STATE",
      gateITurn.result ===
        "PASS"
        ? "OK"
        : "BLOCKED",
      {
        workflow:
          gateITurn.workflowId,
        phase:
          gateITurn.phase,
        result:
          gateITurn.result,
        events:
          gateITurn.events.length
      }
    );

    audit.record(
      "gate",
      gateI.gate,
      gateIBlocked
        ? "BLOCKED"
        : "OK",
      {
        checks:
          gateI.checks,
        verifiedOrSupportedRecords:
          gateI.verifiedOrSupportedRecords,
        legalReferences:
          gateI.legalReferences,
        caseReferences:
          gateI.caseReferences
      }
    );

    const workflowFinalizationBlocked =
      finalization.result !== "PASS" ||
      corpusBlocked ||
      workflowResourcesBlocked ||
      workflowOutputBlocked ||
      guideOutputBlocked ||
      reportBlueprintBlocked ||
      gateIBlocked ||
      gateIWorkflowContractBlocked;

    const presentationCriticalGateIds =
      new Set([
        "ROUTER_FIRST",
        "CORE_RESOURCES",
        "ROUTER_REQUIRED_MODULES",
        "WORKFLOW_RESOURCES",
        "OUTPUT_CONTRACT"
      ] as const);
    const criticalGateIBlocked =
      gateI.checks.some(
        (item) =>
          presentationCriticalGateIds.has(
            item.id as
              | "ROUTER_FIRST"
              | "CORE_RESOURCES"
              | "ROUTER_REQUIRED_MODULES"
              | "WORKFLOW_RESOURCES"
              | "OUTPUT_CONTRACT"
          ) &&
          item.result === "BLOCKED"
      );
    const workflowContractExtensionBlocked =
      gateIWorkflowContractReport
        .checks
        .some(
          (item) =>
            item.result ===
              "BLOCKED"
        );
    const verificationDegraded =
      finalization.result !==
        "PASS" ||
      gateIBlocked ||
      gateITurn.result !==
        "PASS";

    const presentationBlocked =
      corpusBlocked ||
      workflowResourcesBlocked ||
      workflowOutputBlocked ||
      guideOutputBlocked ||
      reportBlueprintBlocked ||
      workflowContractExtensionBlocked;
    audit.record(
      "gate",
      "G39H_WORKFLOW_FINALIZATION",
      workflowFinalizationBlocked ? "BLOCKED" : "OK",
      {
        workflow: execution.workflowPlan.id,
        finalization: finalization.result,
        corpusBlocked,
        workflowResourcesBlocked,
        workflowOutputBlocked,
        guideOutputBlocked,
        reportBlueprintBlocked
      }
    );

    const safeToPresent =
      !presentationBlocked;
    audit.record(
      "gate",
      "G15_SAFE_SESSION_EXECUTION",
      presentationBlocked
        ? "BLOCKED"
        : verificationDegraded
          ? "DEGRADED"
          : "OK",
      {
        finalization:
          finalization.result,
        verificationDegraded,
        criticalGateIBlocked,
        workflowContractExtensionBlocked
      }
    );
    audit.close(
      presentationBlocked
        ? "BLOCKED"
        : verificationDegraded
          ? "DEGRADED"
          : "OK",
      {
        finalization:
          finalization.result,
        verificationDegraded
      }
    );

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

    step("RESTORE", "symbole zastępcze → dane z lokalnego klucza");
    // Every restored value is reported so the UI can mark it for review.
    const restoredAnswer = restoreWithReport(
      processedDocumentCitations.text,
      chatPrivacyVault
    );
    const response: SessionExecutionResponse = {
      sessionId: audit.sessionId,
      status: safeToPresent ? "DRAFT_PRESENTABLE" : "BLOCKED",
      provider: request.provider,
      model: request.model,
      modelRouting: {
        primary: {
          provider:
            request.provider,
          model:
            request.model
        },
        ...(request.auxiliaryRouting
          ? {
              auxiliary:
                auxiliary.summary
            }
          : {})
      },
      primarySkill: execution.primarySkill,
      loadedSkills: execution.loadedSkills,
      executionSkills: execution.executionSkills,
      domainSkills: execution.domainSkills,
      ...(safeToPresent
        ? {
            answer:
              restoredAnswer.text,
            ...(restoredAnswer.restorations.length > 0
              ? { restorations: restoredAnswer.restorations }
              : {}),
            ...(restoredAnswer.unresolved.length > 0
              ? { unresolvedTokens: restoredAnswer.unresolved }
              : {}),
            documentCitations: processedDocumentCitations.citations,
            ...(reportBlueprint
              ? {
                  reportBlueprint
                }
              : {})
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
      ...(publicAuxiliarySources.length > 0
        ? {
            auxiliarySources:
              publicAuxiliarySources
          }
        : {}),
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
          workflowResourcesBlocked ||
          workflowOutputBlocked ||
          guideOutputBlocked ||
          reportBlueprintBlocked ||
          finalization.result !== "PASS" ||
          gateIBlocked
            ? "BLOCKED"
            : "PASS",
        requiredResources: workflowReads.required,
        missingResources: workflowReads.missing
      },
      gateI,
      gateIWorkflowContract:
        gateIWorkflowContractReport,
      gateITurn
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
          })),
          documentAliasDocumentIds: [
            ...new Set(
              attachments.map(
                (attachment) =>
                  attachment.documentId
              )
            )
          ]
        } satisfies SessionExecutionInternalState,
        enumerable: false,
        configurable: false,
        writable: false
      }
    );

    return response;
  }
}
