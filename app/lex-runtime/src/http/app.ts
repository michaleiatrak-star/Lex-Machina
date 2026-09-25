import type { EvidencePolicy } from "../document-evidence.js";
import {
  PERSON_CASES,
  type NameFormCorrection,
  type PersonCase,
  type PersonMorphology
} from "../privacy/person-morphology.js";
import type { PiiKind } from "../privacy/pseudonymizer.js";
import { LocalOfficeEditor, editableMediaType } from "../office-edit.js";
import { deanonymizeModel } from "../deanonymize-file.js";
import { decodePlainText } from "../document-service.js";
import {
  ProcessingProgressRegistry,
  progressIdFrom
} from "../processing-progress.js";
import { createHash } from "node:crypto";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response
} from "express";
import helmet from "helmet";
import { LexSkillRegistry } from "../registry.js";
import {
  DynamicModelCatalog,
  type ModelDescriptor
} from "../providers/model-catalog.js";
import {
  MissingProviderCredentialError,
  providerConfigurationStatus,
  type ProviderCredentialResolver,
  type ProviderCredentialManager
} from "../providers/credentials.js";
import {
  ProviderGatewayError
} from "../providers/gateway.js";
import type { ProviderId } from "../providers/types.js";
import type {
  AccountSessionManager
} from "../providers/account-session.js";
import type {
  UpdateDiscovery
} from "../update-discovery.js";
import {
  SESSION_EXECUTION_INTERNAL,
  type SessionDocumentAttachment,
  type SessionExecutor,
  type SessionExecutionRequest,
  type SessionExecutionResponse
} from "../session-executor.js";
import type {
  DocumentChunkSelection,
  DocumentSecurityContext,
  DocumentService,
  KeyGrammar,
  ResolvedDocumentAttachment,
  PagePrivacyDirective,
  SupportedDocumentMediaType
} from "../document-service.js";
import { RoutingCatalog } from "./routing-catalog.js";
import {
  decodeUploadFilename,
  type LocalCaseFileStore
} from "../case-file-store.js";
import {
  AuthError,
  type AuthService
} from "../auth/service.js";
import {
  SupportError,
  type LocalSupportService,
  type SupportSessionView
} from "../support-service.js";
import type {
  AuthenticatedContext,
  CaseRole
} from "../auth/types.js";
import {
  parseGuideTransition,
  type GuideSessionStateStore
} from "../guide-session-state.js";
import {
  CaseAccessError,
  type LocalCaseAccessService
} from "../case-access.js";
import {
  ReauthorizationError,
  type DeanonymizationReauthorizationManager
} from "../auth/reauthorization.js";
import type {
  LocalDocumentAuthoringService
} from "../document-authoring-service.js";
import type {
  LegalDocumentAstGenerator
} from "../legal-document-ast-generator.js";
import type {
  LocalTemplateProfileService
} from "../template-profile-service.js";
import type {
  LocalCaseKnowledgeSearch
} from "../case-knowledge-search.js";
import type {
  LocalSharedTemplateStore
} from "../shared-template-store.js";
import { ExecutionSteps } from "../execution-steps.js";
import {
  ContextBudgetError,
  estimateDocumentFit,
  HOSTED_CONTEXT_TOKENS,
  LOCAL_MAX_DOCUMENT_ATTACHMENTS,
  MAX_DOCUMENT_ATTACHMENTS
} from "../context-orchestrator.js";
import {
  MAX_FIRM_TEMPLATES,
  templateChunks,
  templateText
} from "../firm-template-text.js";
import type {
  SecureCaseUploadStore
} from "../case-secure-store.js";
import type {
  SecureCaseArtifactStore
} from "../case-artifact-store.js";
import type {
  SensitiveDownloadTicketManager
} from "../sensitive-download-ticket.js";
import type {
  StoredUpload
} from "../case-file-store.js";
import {
  assertStoredDocumentSignature,
  storedDocumentMediaType
} from "../stored-document-source.js";
import type {
  EncryptedCaseWorkspaceStore
} from "../case-workspace-store.js";
import type {
  DocumentGenerationStateStore
} from "../document-generation-state.js";
import {
  parseSkillSelectionEnvelope,
  resolveAdditionalSkills,
  SKILL_SELECTION_ENVELOPE_PREFIX
} from "../skill-selection.js";
import { isTrivialChatCommand } from "../execution-engine.js";
import {
  assessMatterComplexity,
  describeMatterComplexity
} from "../matter-complexity.js";
import {
  createDeterministicWorkflowPlan
} from "../deterministic-workflow.js";
import type {
  ProcessPleadingState
} from "../process-pleading-state.js";
import {
  completeProcessExecution,
  requireProcessExecutionPermit,
  type ProcessExecutionPermit
} from "../process-pleading-execution-gate.js";
import {
  PROCESS_AUTO_MAX_STEPS,
  runBoundedProcessAutoSequence
} from "../process-pleading-auto-runner.js";
import {
  applyDeterministicProcessApplicability,
  evidenceInventoryFromUploads,
  type ProcessEvidenceInventory
} from "../process-pleading-applicability.js";
import {
  createCourtAnalysisState,
  nextCourtAnalysisCheckpoint,
  type CourtAnalysisState
} from "../court-analysis-state.js";
import {
  completeCourtAnalysisExecution,
  requireCourtAnalysisExecutionPermit,
  type CourtAnalysisExecutionPermit
} from "../court-analysis-execution-gate.js";
import {
  createChronologyState,
  nextChronologyCheckpoint,
  requireChronologyTemporalGate,
  type ChronologyState
} from "../chronology-state.js";
import {
  completeChronologyExecution,
  requireChronologyExecutionPermit,
  type ChronologyExecutionPermit
} from "../chronology-execution-gate.js";
import {
  chronologyTemporalGateRequired
} from "../chronology-date-trigger.js";
import {
  nextContractCheckpoint,
  type ContractAnalysisState
} from "../contract-analysis-state.js";
import {
  completeContractExecution,
  requireContractExecutionPermit,
  type ContractExecutionPermit
} from "../contract-analysis-execution-gate.js";
import {
  buildWorkflowAuditArtifact,
  parseWorkflowAuditArtifact,
  type StatefulWorkflowAuditId
} from "../workflow-audit-artifact.js";
import {
  completeOrderedCaseExecution,
  createOrderedCaseWorkflowState,
  nextOrderedCaseCheckpoint,
  requireOrderedCaseExecutionPermit,
  type OrderedCaseExecutionPermit,
  type OrderedCaseWorkflowId,
  type OrderedCaseWorkflowState
} from "../ordered-case-workflow-state.js";

const PROVIDERS = new Set<ProviderId>([
  "openai",
  "anthropic",
  "xai"
]);

function isProviderId(value: string): value is ProviderId {
  return PROVIDERS.has(value as ProviderId);
}

const DOCUMENT_MEDIA_TYPES =
  new Set<SupportedDocumentMediaType>([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
    "text/plain",
    "text/markdown",
    "text/csv",
    "text/tab-separated-values",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroenabled.12"
  ]);

type ImageDocumentMediaType =
  Parameters<
    DocumentService[
      "ingestImage"
    ]
  >[1];

function isImageDocumentMediaType(
  value:
    SupportedDocumentMediaType
): value is
  ImageDocumentMediaType {
  return [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff"
  ].includes(value);
}

async function ingestDocumentMedia(
  service:
    DocumentService,
  data:
    Uint8Array,
  mediaType:
    SupportedDocumentMediaType,
  security?:
    Parameters<
      DocumentService[
        "review"
      ]
    >[2]
) {
  if (
    mediaType ===
      "application/pdf"
  ) {
    return await service
      .ingestPdf(
        data,
        security
      );
  }
  if (
    isImageDocumentMediaType(
      mediaType
    )
  ) {
    return await service
      .ingestImage(
        data,
        mediaType,
        security
      );
  }
  const review =
    await service.review(
      data,
      mediaType,
      security
    );
  return await service
    .finalizeReview(
      review.documentId,
      [],
      security
    );
}

function requestDocumentMediaType(
  req: Request
): SupportedDocumentMediaType | null {
  const raw = req.get("content-type")
    ?.split(";", 1)[0]
    ?.trim()
    .toLowerCase();
  return raw &&
    DOCUMENT_MEDIA_TYPES.has(
      raw as SupportedDocumentMediaType
    )
    ? raw as SupportedDocumentMediaType
    : null;
}

const PRIVACY_KINDS = new Set([
  "PESEL",
  "NIP",
  "REGON",
  "IBAN",
  "EMAIL",
  "PHONE",
  "PERSON",
  "ADDRESS",
  "ID_CARD",
  "PASSPORT",
  "KRS",
  "LAND_REGISTRY",
  "BIRTH_DATE",
  "VEHICLE_PLATE",
  "PAYMENT_CARD",
  "CUSTOM"
] as const);

function parsePrivacyDirectives(
  value: unknown
): PagePrivacyDirective[] | null {
  if (!Array.isArray(value)) return null;

  const directives: PagePrivacyDirective[] = [];
  for (const item of value) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return null;
    }
    const record = item as Record<string, unknown>;
    const action = record.action;
    if (
      !Number.isInteger(record.page) ||
      !Number.isInteger(record.start) ||
      !Number.isInteger(record.end) ||
      !["PSEUDONYMIZE", "KEEP", "LABEL"]
        .includes(String(action))
    ) {
      return null;
    }

    const rawKind =
      typeof record.kind === "string"
        ? record.kind
        : undefined;
    if (
      rawKind !== undefined &&
      !PRIVACY_KINDS.has(
        rawKind as
          typeof PRIVACY_KINDS extends Set<infer T>
            ? T
            : never
      )
    ) {
      return null;
    }

    const kind = rawKind as
      | NonNullable<PagePrivacyDirective["kind"]>
      | undefined;

    directives.push({
      page: Number(record.page),
      start: Number(record.start),
      end: Number(record.end),
      action: action as PagePrivacyDirective["action"],
      ...(kind !== undefined
        ? { kind }
        : {}),
      ...(typeof record.label === "string"
        ? { label: record.label }
        : {})
    });
  }
  return directives;
}

function isLoopbackOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname === "::1" ||
        url.hostname === "[::1]"
      )
    );
  } catch {
    return false;
  }
}

function loopbackOriginGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.get("origin");
  if (!origin || isLoopbackOrigin(origin)) {
    next();
    return;
  }

  res.status(403).json({
    error: "ORIGIN_NOT_ALLOWED"
  });
}

export type LexHttpAppOptions = {
  registry: LexSkillRegistry;
  // Receives word forms the user corrected in a restored answer or document.
  personMorphology?: Pick<PersonMorphology, "saveCorrection">;
  modelCatalog:
    Pick<DynamicModelCatalog, "list"> &
    Partial<
      Pick<
        DynamicModelCatalog,
        | "localContextWindow"
        | "localTokenCharsPerToken"
      >
    >;
  credentialResolver?: ProviderCredentialResolver;
  credentialManager?: ProviderCredentialManager;
  accountSessions?: Pick<
    AccountSessionManager,
    | "statusAll"
    | "login"
    | "setAnthropicOAuthToken"
    | "clearAnthropicOAuthToken"
  >;
  updateDiscovery?: UpdateDiscovery;
  sessionExecutor?: SessionExecutor;
  guideSessionStore?: Pick<
    GuideSessionStateStore,
    | "get"
    | "initialize"
    | "transition"
    | "revoke"
  >;
  processWorkflowStore?: Pick<
    EncryptedCaseWorkspaceStore,
    | "getProcessPleadingState"
    | "saveProcessPleadingState"
  >;
  courtAnalysisWorkflowStore?: Pick<
    EncryptedCaseWorkspaceStore,
    | "getCourtAnalysisState"
    | "saveCourtAnalysisState"
  >;
  chronologyWorkflowStore?: Pick<
    EncryptedCaseWorkspaceStore,
    | "getChronologyState"
    | "saveChronologyState"
  >;
  contractWorkflowStore?: Pick<
    EncryptedCaseWorkspaceStore,
    | "getContractAnalysisState"
    | "saveContractAnalysisState"
  >;
  orderedCaseWorkflowStore?: Pick<
    EncryptedCaseWorkspaceStore,
    | "getOrderedCaseWorkflowState"
    | "saveOrderedCaseWorkflowState"
  >;
  documentGenerationState?: Pick<
    DocumentGenerationStateStore,
    "readState"
  >;
  documentService?: DocumentService;
  caseFileStore?:
    Pick<
      LocalCaseFileStore,
      | "createCase"
      | "saveUpload"
      | "assertCase"
    > &
    Partial<
      Pick<
        LocalCaseFileStore,
        "listUploads"
      >
    >;
  secureCaseUploadStore?: Pick<
    SecureCaseUploadStore,
    | "saveUpload"
    | "listUploads"
    | "readUploadPayload"
    | "readExtractedPayload"
  >;
  authService?: AuthService;
  supportService?: Pick<
    LocalSupportService,
    | "status"
    | "issueChallenge"
    | "activate"
    | "authenticateAuthorization"
    | "assertCapability"
    | "recordOperation"
    | "deactivateAuthorization"
  >;
  sharedTemplateStore?: Pick<
    LocalSharedTemplateStore,
    | "saveTemplate"
    | "listTemplates"
  > &
    Partial<Pick<LocalSharedTemplateStore, "readTemplate">>;
  // Reads firm templates (DOCX/ODT) as text for the model.
  officeEditor?: Pick<LocalOfficeEditor, "read">;
  caseKnowledgeSearch?: Pick<
    LocalCaseKnowledgeSearch,
    "search"
  >;
  documentAuthoringService?: Pick<
    LocalDocumentAuthoringService,
    | "aliasManifest"
    | "createTokenized"
    | "createReady"
    | "deanonymizeConsumed"
  > &
    Partial<
      Pick<
        LocalDocumentAuthoringService,
        "previewDeanonymization"
      >
    >;
  documentAstGenerator?: Pick<
    LegalDocumentAstGenerator,
    "generate"
  >;
  templateProfileService?: Pick<
    LocalTemplateProfileService,
    "resolve"
  >;
  reauthorizationManager?: Pick<
    DeanonymizationReauthorizationManager,
    | "createIntent"
    | "authorizeIntent"
    | "consumeGrant"
  > &
    Partial<
      Pick<
        DeanonymizationReauthorizationManager,
        "previewGrant"
      >
    >;
  sensitiveDownloadTickets?: Pick<
    SensitiveDownloadTicketManager,
    | "issue"
    | "consume"
  >;
  secureCaseArtifactStore?: Pick<
    SecureCaseArtifactStore,
    | "saveArtifact"
    | "listArtifacts"
    | "readArtifact"
    | "deleteArtifact"
  >;
  caseAccessService?: Pick<
    LocalCaseAccessService,
    | "createCase"
    | "createFirmKnowledgeWorkspace"
    | "getFirmKnowledgeWorkspace"
    | "listCases"
    | "openCase"
    | "renameCase"
    | "setCaseArchived"
    | "deleteCase"
    | "listLegacyCases"
    | "importLegacyCase"
    | "assertAccess"
    | "listAccess"
    | "listAccessCandidates"
    | "grantAccess"
    | "transferOwnership"
    | "revokeAccess"
    | "rotateCaseKey"
    | "withCaseDataKey"
  >;
  caseScheduleService?: Pick<
    LocalCaseAccessService,
    | "listCaseSchedule"
    | "addCaseScheduleEvent"
    | "deleteCaseScheduleEvent"
  >;
};

async function persistWorkflowAuditArtifact(
  args: {
    store: Pick<
      SecureCaseArtifactStore,
      | "saveArtifact"
      | "deleteArtifact"
    >;
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    createdByUserId: string;
    workflowId:
      StatefulWorkflowAuditId;
    checkpoint: string;
    result:
      SessionExecutionResponse;
  }
): Promise<{
  artifactId: string;
  auditRef: string;
  sha256: string;
  bytes: number;
}> {
  const payload =
    buildWorkflowAuditArtifact({
      caseId:
        args.caseId,
      workflowId:
        args.workflowId,
      checkpoint:
        args.checkpoint,
      result:
        args.result
    });

  try {
    const artifact =
      await args.store
        .saveArtifact({
          caseId:
            args.caseId,
          filename:
            [
              "workflow-audit",
              args.workflowId
                .toLowerCase(),
              args.checkpoint
                .toLowerCase(),
              args.result
                .sessionId
            ].join("-") +
            ".json",
          mediaType:
            "application/vnd.lexmachina.workflow-audit+json",
          data:
            payload,
          caseDataKey:
            args.caseDataKey,
          keyVersion:
            args.keyVersion,
          sensitivity:
            "PROTECTED",
          createdByUserId:
            args.createdByUserId
        });

    return {
      artifactId:
        artifact.artifactId,
      auditRef:
        "artifact://" +
        artifact.artifactId,
      sha256:
        artifact.sha256,
      bytes:
        artifact.bytes
    };
  } finally {
    payload.fill(0);
  }
}


function safeDiagnosticText(
  value: unknown
): string {
  const raw =
    value instanceof Error
      ? `${value.name}: ${value.message}`
      : String(value);
  return raw
    .replace(
      /Bearer\s+[A-Za-z0-9._~+\/-]+=*/gi,
      "Bearer [REDACTED]"
    )
    .replace(
      /\bsk-[A-Za-z0-9_-]{8,}\b/g,
      "sk-[REDACTED]"
    )
    .replace(
      /(api[_-]?key\s*[:=]\s*)[^\s,;]+/gi,
      "$1[REDACTED]"
    )
    .slice(0, 2000);
}

function sendReauthorizationError(
  res: Response,
  error: unknown
): boolean {
  if (
    !(error instanceof
      ReauthorizationError)
  ) {
    return false;
  }
  const status =
    error.code ===
      "REAUTH_INTENT_NOT_FOUND" ||
    error.code ===
      "REAUTH_GRANT_NOT_FOUND"
      ? 404
      : error.code ===
          "REAUTH_SESSION_MISMATCH"
        ? 403
        : 409;
  res.status(status).json({
    error: error.code
  });
  return true;
}

function sendProcessWorkflowError(
  res: Response,
  error: unknown
): boolean {
  if (
    !(error instanceof Error) ||
    !error.message.startsWith(
      "PROCESS_PLEADING_"
    )
  ) {
    return false;
  }

  res.status(409).json({
    error:
      error.message
        .split(":", 1)[0]
  });
  return true;
}

function sendCourtWorkflowError(
  res: Response,
  error: unknown
): boolean {
  if (
    !(error instanceof Error) ||
    !error.message.startsWith(
      "COURT_ANALYSIS_"
    )
  ) {
    return false;
  }

  res.status(409).json({
    error:
      error.message
        .split(":", 1)[0]
  });
  return true;
}

function sendChronologyWorkflowError(
  res: Response,
  error: unknown
): boolean {
  if (
    !(error instanceof Error) ||
    !error.message.startsWith(
      "CHRONOLOGY_"
    )
  ) {
    return false;
  }

  res.status(409).json({
    error:
      error.message
        .split(":", 1)[0]
  });
  return true;
}

function sendContractWorkflowError(
  res: Response,
  error: unknown
): boolean {
  if (
    !(error instanceof Error) ||
    !error.message.startsWith(
      "CONTRACT_"
    )
  ) {
    return false;
  }

  res.status(409).json({
    error:
      error.message
        .split(":", 1)[0]
  });
  return true;
}

function sendSupportError(
  res: Response,
  error: unknown
): boolean {
  if (!(error instanceof SupportError)) {
    return false;
  }
  res.status(error.httpStatus).json({
    error: error.code
  });
  return true;
}

function sendAuthError(
  res: Response,
  error: unknown
): boolean {
  if (!(error instanceof AuthError)) {
    return false;
  }
  res.status(error.httpStatus).json({
    error: error.code,
    ...(error.retryAfter
      ? { retryAfter: error.retryAfter }
      : {})
  });
  return true;
}

function sendCaseAccessError(
  res: Response,
  error: unknown
): boolean {
  if (
    !(error instanceof
      CaseAccessError)
  ) {
    return false;
  }
  res.status(
    error.httpStatus
  ).json({
    error: error.code
  });
  return true;
}

const EXECUTION_ID_PATTERN =
  /^[A-Za-z0-9-]{16,64}$/;
const EXECUTION_DRAFT_TTL_MS =
  15 * 60_000;
const EXECUTION_DRAFT_MAX_ENTRIES = 64;
const EXECUTION_DRAFT_MAX_CHARS = 200_000;
// While a request is still running, refresh the idle deadline this often.
const IN_FLIGHT_ACTIVITY_INTERVAL_MS = 60_000;

function responseAuthContext(
  res: Response
): AuthenticatedContext {
  const context =
    res.locals.lexAuth as
      | AuthenticatedContext
      | undefined;
  if (!context) {
    throw new Error(
      "AUTH_CONTEXT_MISSING"
    );
  }
  return context;
}

function responseSupportContext(
  res: Response
): SupportSessionView {
  const context =
    res.locals.lexSupport as
      | SupportSessionView
      | undefined;
  if (!context) {
    throw new Error(
      "SUPPORT_CONTEXT_MISSING"
    );
  }
  return context;
}

function publicSkill(skill: {
  name: string;
  frontmatter: Record<string, unknown>;
}): Record<string, unknown> {
  const fm = skill.frontmatter;
  return {
    name: skill.name,
    ...(typeof fm.version === "string" ? { version: fm.version } : {}),
    ...(typeof fm.type === "string" ? { type: fm.type } : {}),
    ...(typeof fm.status === "string" ? { status: fm.status } : {}),
    ...(typeof fm.description === "string"
      ? { description: fm.description }
      : {}),
    category: /^dr-\d{2}-/.test(skill.name)
      ? "domain"
      : "execution"
  };
}

function sanitizeModels(models: ModelDescriptor[]): ModelDescriptor[] {
  return models.map((model) => ({ ...model }));
}

function parseDocumentAttachments(
  value: unknown
): Array<
  DocumentChunkSelection & {
    caseId?: string;
  }
> | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_DOCUMENT_ATTACHMENTS) {
    return null;
  }

  const selections: Array<
    DocumentChunkSelection & {
      caseId?: string;
    }
  > = [];
  for (const item of value) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return null;
    }
    const record = item as Record<string, unknown>;
    const caseId =
      typeof record.caseId === "string"
        ? record.caseId.trim()
        : "";
    const documentId =
      typeof record.documentId === "string"
        ? record.documentId.trim()
        : "";
    const chunkIndices =
      Array.isArray(record.chunkIndices)
        ? record.chunkIndices
        : null;

    if (
      (
        caseId &&
        !/^case_[a-f0-9]{32}$/.test(caseId)
      ) ||
      !/^doc_[a-f0-9]{24}$/.test(documentId) ||
      !chunkIndices ||
      chunkIndices.length < 1 ||
      chunkIndices.length > 32 ||
      chunkIndices.some(
        (index) =>
          !Number.isInteger(index) ||
          Number(index) < 1
      )
    ) {
      return null;
    }

    selections.push({
      ...(caseId
        ? { caseId }
        : {}),
      documentId,
      chunkIndices:
        [...new Set(
          chunkIndices.map(Number)
        )]
    });
  }

  return selections;
}

function isFirmScope(scope: SessionDocumentAttachment["sourceScope"]): boolean {
  return scope === "FIRM_KNOWLEDGE" || scope === "FIRM_TEMPLATE";
}

/** Firm templates (DOCX/ODT from the firm workspace) sent with a message. */
/**
 * Page images a chat message sends as evidence: photos by default, pages
 * with text too when the user ticks it ("all"), none when switched off.
 * Local models read text only, so they get no images.
 */
function evidencePolicyFor(value: unknown, model: string): EvidencePolicy | undefined {
  if (model.startsWith("local/") || value === false || value === "none") return undefined;
  return value === "all" ? "all" : "photos";
}

function parseFirmTemplates(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (
    !Array.isArray(value) ||
    value.length > MAX_FIRM_TEMPLATES ||
    value.some((item) => typeof item !== "string" || !/^template_[a-f0-9]{32}$/.test(item))
  ) {
    return null;
  }
  return [...new Set(value as string[])];
}

type SessionKnowledgeRequest = {
  caseId?: string;
  includeCase: boolean;
  includeFirm: boolean;
  limit: number;
};

function parseSessionKnowledgeRequest(
  value: unknown
): SessionKnowledgeRequest | null {
  if (value === undefined) {
    return {
      includeCase: false,
      includeFirm: false,
      limit: 8
    };
  }
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  const record =
    value as
      Record<string, unknown>;
  const caseId =
    typeof record.caseId ===
      "string"
      ? record.caseId.trim()
      : undefined;
  const includeCase =
    record.includeCase ===
      true;
  const includeFirm =
    record.includeFirm ===
      true;
  const limit =
    record.limit ===
      undefined
      ? 8
      : Number(
          record.limit
        );

  if (
    (
      caseId !== undefined &&
      !/^case_[a-f0-9]{32}$/
        .test(caseId)
    ) ||
    (
      includeCase &&
      !caseId
    ) ||
    !Number.isInteger(
      limit
    ) ||
    limit < 1 ||
    limit > 12
  ) {
    return null;
  }

  return {
    ...(caseId
      ? { caseId }
      : {}),
    includeCase,
    includeFirm,
    limit
  };
}

async function assertDocumentWorkflowFinalizationAllowed(
  options: Pick<
    LexHttpAppOptions,
    | "documentGenerationState"
    | "processWorkflowStore"
  >,
  args: {
    caseId: string;
    artifactId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }
): Promise<void> {
  if (!options.documentGenerationState) {
    throw new Error(
      "DOCUMENT_GENERATION_STATE_SERVICE_UNAVAILABLE"
    );
  }
  const generation =
    await options
      .documentGenerationState
      .readState(
        args.caseId,
        args.artifactId
      );
  if (!generation) {
    throw new Error(
      "GENERATION_STATE_MISSING"
    );
  }
  if (
    generation.workflowRequirement !==
      "PROCESS_PLEADING_FINAL"
  ) {
    return;
  }
  if (!options.processWorkflowStore) {
    throw new Error(
      "PROCESS_PLEADING_STATE_SERVICE_UNAVAILABLE"
    );
  }
  const processState =
    await options
      .processWorkflowStore
      .getProcessPleadingState({
        caseId: args.caseId,
        caseDataKey:
          args.caseDataKey,
        keyVersion:
          args.keyVersion
      });
  if (
    !processState ||
    processState.stage !== "FINAL" ||
    processState.documentStatus !==
      "FINAL" ||
    processState.pendingCheckpoint !==
      null
  ) {
    throw new Error(
      "PROCESS_PLEADING_FINAL_REQUIRED"
    );
  }
}

/**
 * Legal gate for chat: a trivial command without attachments is answered in
 * the conversational lane. The work mode's pinned workflow, the router, case
 * retrieval and legal skills are not used for it.
 */
export function applyTrivialChatGate(
  registry: LexSkillRegistry,
  request: SessionExecutionRequest,
  attachmentCount: number
): boolean {
  const envelope =
    parseSkillSelectionEnvelope(request.query);
  if (
    attachmentCount > 0 ||
    !isTrivialChatCommand(envelope.query)
  ) {
    return false;
  }
  const domain =
    request.primarySkill.startsWith("dr-") &&
    registry.get(request.primarySkill)
      ? request.primarySkill
      : [...registry.skills.keys()]
          .filter((name) => name.startsWith("dr-"))
          .sort()[0];
  if (!domain) return false;
  request.primarySkill = domain;
  request.query =
    SKILL_SELECTION_ENVELOPE_PREFIX +
    " " +
    JSON.stringify({ auto: false, manual: [], workflow: null }) +
    "\n" +
    envelope.query;
  request.conversationalOnly = true;
  delete request.modelSelectsSkills;
  return true;
}

/**
 * X-Lex-Processing on a raw document upload: "local-ai" (the local model also
 * checks personal data) and "ocr-fix" (the local model corrects OCR errors),
 * comma separated; absent = plain OCR and rules-based anonymization.
 */
export function documentProcessingOptions(
  header: string | undefined
): { localAi?: true; ocrFix?: true } {
  const flags = new Set(
    (header ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );
  return {
    ...(flags.has("local-ai") ? { localAi: true as const } : {}),
    ...(flags.has("ocr-fix") ? { ocrFix: true as const } : {})
  };
}

function previewSessionWorkflow(
  registry: LexSkillRegistry,
  request: SessionExecutionRequest
) {
  const envelope =
    parseSkillSelectionEnvelope(
      request.query
    );
  const effectiveQuery =
    envelope.query.trim();
  if (!effectiveQuery) {
    throw new Error(
      "EMPTY_QUERY_AFTER_SKILL_ENVELOPE"
    );
  }
  const selection =
    resolveAdditionalSkills(
      registry,
      effectiveQuery,
      request.primarySkill,
      envelope.automatic,
      envelope.manualSkills,
      envelope.domainAllowList,
      envelope.domainRestrictionActive,
      envelope.executionAllowList,
      envelope.executionRestrictionActive,
      envelope.workflowExecutionSkill
    );
  return createDeterministicWorkflowPlan(
    registry,
    selection.workflowExecutionSkill
  );
}

function parseSessionRequest(
  body: unknown
): SessionExecutionRequest | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const value = body as Record<string, unknown>;
  const query =
    typeof value.query === "string"
      ? value.query.trim()
      : "";
  const provider =
    typeof value.provider === "string"
      ? value.provider
      : "";
  const model =
    typeof value.model === "string"
      ? value.model.trim()
      : "";
  const primarySkill =
    typeof value.primarySkill === "string"
      ? value.primarySkill.trim()
      : "";
  const mode =
    value.mode === "LAIK" || value.mode === "PRAWNIK"
      ? value.mode
      : "PRAWNIK";
  const auxiliaryText =
    typeof value.auxiliaryText ===
      "string"
      ? value.auxiliaryText
          .normalize("NFKC")
          .trim()
      : "";

  if (
    query.length < 1 ||
    query.length > 30_000 ||
    !isProviderId(provider) ||
    model.length < 1 ||
    model.length > 256 ||
    primarySkill.length < 1 ||
    primarySkill.length > 160 ||
    auxiliaryText.length > 12_000
  ) {
    return null;
  }

  return {
    query,
    provider,
    model,
    primarySkill,
    mode,
    ...(auxiliaryText
      ? { auxiliaryText }
      : {})
  };
}

function restoreSessionDocumentAliases(
  result: SessionExecutionResponse,
  documentService:
    DocumentService | undefined
): void {
  if (
    !documentService
      ?.deanonymize
  ) {
    return;
  }

  const documentIds =
    result[
      SESSION_EXECUTION_INTERNAL
    ]?.documentAliasDocumentIds ??
    [];
  if (
    documentIds.length === 0
  ) {
    return;
  }

  const restoreText = (
    text: string
  ): string =>
    text.replace(
      /\[LMPII:D(\d{2}):([A-Z_]+):(\d{4})(?:\|([A-Z]{2,4}))?\]/g,
      (
        token,
        documentNumber,
        kind,
        sequence,
        requestedCase?: string
      ) => {
        const index =
          Number(
            documentNumber
          ) - 1;
        const documentId =
          documentIds[index];
        if (!documentId) {
          return token;
        }
        // The case a model asked for travels with the token to the local vault.
        const sourceToken =
          requestedCase
            ? `[PII:${kind}:${sequence}|${requestedCase}]`
            : `[PII:${kind}:${sequence}]`;
        try {
          return documentService
            .deanonymize!(
              documentId,
              sourceToken
            );
        } catch {
          // Keep the opaque alias when the matching local vault is unavailable.
          // Never guess or substitute PII from another document.
          return token;
        }
      }
    );

  if (
    typeof result.answer ===
      "string"
  ) {
    result.answer =
      restoreText(
        result.answer
      );
  }

  if (
    result.processAuto
  ) {
    for (
      const step
      of result.processAuto.steps
    ) {
      if (
        typeof step.answer ===
          "string"
      ) {
        step.answer =
          restoreText(
            step.answer
          );
      }
    }
  }

  if (
    result.reportBlueprint
  ) {
    const visit = (
      value: unknown
    ): unknown => {
      if (
        typeof value ===
          "string"
      ) {
        return restoreText(
          value
        );
      }
      if (
        Array.isArray(value)
      ) {
        return value.map(
          visit
        );
      }
      if (
        value &&
        typeof value ===
          "object"
      ) {
        return Object.fromEntries(
          Object.entries(
            value as
              Record<
                string,
                unknown
              >
          ).map(
            ([key, item]) => [
              key,
              visit(item)
            ]
          )
        );
      }
      return value;
    };
    result.reportBlueprint =
      visit(
        result.reportBlueprint
      ) as
        typeof result.reportBlueprint;
  }
}

async function refreshDocumentCitations(args: {
  result: SessionExecutionResponse;
  documentService: DocumentService;
  caseAccessService?: Pick<
    LocalCaseAccessService,
    "assertAccess" | "openCase" | "withCaseDataKey"
  >;
  actor?: AuthenticatedContext;
}): Promise<number> {
  const citations =
    args.result.documentCitations ?? [];
  if (citations.length === 0) {
    return 0;
  }

  for (const citation of citations) {
    if (
      citation.caseId &&
      args.caseAccessService &&
      args.documentService.restoreDocument
    ) {
      if (!args.actor) {
        throw new Error(
          "DOCUMENT_CITATION_REFRESH_AUTH_REQUIRED"
        );
      }
      args.caseAccessService.assertAccess(
        args.actor,
        citation.caseId,
        "ANALYZE"
      );
      const caseView =
        args.caseAccessService.openCase(
          args.actor,
          citation.caseId
        );
      await args.caseAccessService
        .withCaseDataKey(
          args.actor,
          citation.caseId,
          "ANALYZE",
          (caseDataKey) =>
            args.documentService
              .restoreDocument!({
                caseId:
                  citation.caseId!,
                documentId:
                  citation.documentId,
                caseDataKey,
                keyVersion:
                  caseView.keyVersion
              })
        );
    }

    const refreshed =
      await args.documentService
        .resolveProtectedChunks({
          documentId:
            citation.documentId,
          chunkIndices: [
            citation.chunkIndex
          ]
        });
    const chunk =
      refreshed.chunks.find(
        (item) =>
          item.index ===
            citation.chunkIndex
      );
    if (!chunk) {
      throw new Error(
        "DOCUMENT_CITATION_SOURCE_UNAVAILABLE"
      );
    }
    if (
      chunk.pageStart !==
        citation.pageStart ||
      chunk.pageEnd !==
        citation.pageEnd ||
      chunk.text !==
        citation.contextText
    ) {
      throw new Error(
        "DOCUMENT_CITATION_SOURCE_CHANGED"
      );
    }
  }

  return citations.length;
}

export function createLexHttpApp(options: LexHttpAppOptions): Express {
  const app = express();
  const routing = new RoutingCatalog(options.registry);

  // Resolves primarySkill "AUTO" for a session request. Returns false when an
  // error response has already been sent.
  async function resolveAutoPrimarySkill(
    request: SessionExecutionRequest,
    res: Response,
    attachmentCount: number,
    {
      allowModelSelection,
      allowConversational
    }: {
      allowModelSelection: boolean;
      allowConversational: boolean;
    }
  ): Promise<boolean> {
      // AUTO with an account or API model: the model picks the skills itself
      // (router-v3 first, enforced by the corpus tools) instead of a separate
      // routing pass. Local models keep the compact routing pass.
      const autoEnvelope =
        request.primarySkill === "AUTO"
          ? parseSkillSelectionEnvelope(
              request.query
            )
          : null;
      const modelSelectsSkills =
        allowModelSelection &&
        autoEnvelope !== null &&
        autoEnvelope.automatic &&
        autoEnvelope.manualSkills.length === 0 &&
        autoEnvelope.workflowExecutionSkill === null &&
        !request.model.startsWith("local/");
      if (modelSelectsSkills) {
        const placeholder =
          [...options.registry.skills.keys()]
            .filter((name) =>
              name.startsWith("dr-") &&
              (
                !autoEnvelope.domainRestrictionActive ||
                autoEnvelope.domainAllowList.includes(name)
              )
            )
            .sort()[0];
        if (!placeholder) {
          res.status(422).json({
            error:
              "AUTO_ROUTING_FAILED",
            reason:
              "AUTO_ROUTING_NO_DOMAIN_CANDIDATES"
          });
          return false;
        }
        request.primarySkill =
          placeholder;
        request.modelSelectsSkills =
          true;
      }

      if (
        request.primarySkill ===
          "AUTO"
      ) {
        const resolveAutoRouting =
          options.sessionExecutor
            ?.resolveAutoRouting
            ?.bind(
              options.sessionExecutor
            );
        if (!resolveAutoRouting) {
          res.status(503).json({
            error:
              "AUTO_ROUTING_UNAVAILABLE"
          });
          return false;
        }
        try {
          const routed =
            await resolveAutoRouting(
              request
            );
          request.primarySkill =
            routed.decision
              .primarySkill;
          request.query =
            routed.query;
          if (
            routed.decision.legal ===
              false &&
            attachmentCount === 0 &&
            allowConversational
          ) {
            request.conversationalOnly =
              true;
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              "CHAT_PRIVACY_GATE_FAILED"
          ) {
            res.status(503).json({
              error:
                "CHAT_PRIVACY_GATE_FAILED"
            });
            return false;
          }

          const localFailureMessage =
            request.model.startsWith(
              "local/"
            )
              ? (
                  error instanceof
                    ProviderGatewayError &&
                  error.causeValue instanceof
                    Error
                    ? error.causeValue
                        .message
                    : error instanceof Error
                      ? error.message
                      : ""
                )
              : "";
          const parsedLocalReason =
            localFailureMessage
              .split(
                ":",
                1
              )[0] ?? "";
          if (
            request.model.startsWith(
              "local/"
            ) &&
            /^LOCAL_MODEL_[A-Z0-9_]+$/.test(
              parsedLocalReason
            )
          ) {
            res.status(503).json({
              error:
                "LOCAL_MODEL_EXECUTION_FAILED",
              reason:
                parsedLocalReason
            });
            return false;
          }

          if (
            error instanceof
              ProviderGatewayError
          ) {
            const rawReason =
              error.causeValue instanceof
                Error
                ? error.causeValue
                    .message
                : "";
            const parsedReason =
              rawReason.split(
                ":",
                1
              )[0] ?? "";
            res.status(502).json({
              error:
                "PROVIDER_EXECUTION_FAILED",
              provider:
                error.provider,
              reason:
                /^[A-Z0-9_]+$/.test(
                  parsedReason
                )
                  ? parsedReason
                  : "PROVIDER_UNCODED_FAILURE",
              ...(rawReason
                ? {
                    description:
                      safeDiagnosticText(
                        rawReason
                      )
                  }
                : {})
            });
            return false;
          }

          const reason =
            error instanceof Error &&
            /^AUTO_ROUTING_[A-Z0-9_]+$/.test(
              error.message
            )
              ? error.message
              : "AUTO_ROUTING_FAILED";
          res.status(422).json({
            error:
              "AUTO_ROUTING_FAILED",
            reason
          });
          return false;
        }
      }
    return true;
  }

  const processingProgress =
    new ProcessingProgressRegistry();
  const documentCaseIds =
    new Map<string, string>();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(loopbackOriginGuard);
  app.use(express.json({ limit: "256kb" }));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "lex-machina-runtime",
      localOnly: true
    });
  });

  app.get(
    "/api/auth/status",
    (_req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      res.json(
        options.authService.status()
      );
    }
  );

  app.post(
    "/api/auth/bootstrap-managed",
    async (req, res) => {
      if (
        !process.env
          .LEX_DESKTOP_BOOTSTRAP_TOKEN
          ?.trim()
      ) {
        res.status(403).json({
          error:
            "DESKTOP_BOOTSTRAP_REQUIRED"
        });
        return;
      }
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";
      try {
        const result =
          await options.authService
            .bootstrap({
              loginName:
                "local-admin",
              displayName:
                "Administrator lokalny",
              password,
              passwordSetupPending:
                true
            });
        res.status(201).json(result);
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "AUTH_BOOTSTRAP_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/auth/bootstrap",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const displayName =
        typeof req.body?.displayName ===
          "string"
          ? req.body.displayName
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";

      try {
        const result =
          await options.authService
            .bootstrap({
              loginName,
              displayName,
              password
            });
        res.status(201).json(result);
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "AUTH_BOOTSTRAP_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/auth/login",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";

      try {
        res.json(
          await options.authService
            .login({
              loginName,
              password
            })
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "AUTH_LOGIN_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/auth/recover",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const recoveryCode =
        typeof req.body?.recoveryCode ===
          "string"
          ? req.body.recoveryCode
          : "";
      const newPassword =
        typeof req.body?.newPassword ===
          "string"
          ? req.body.newPassword
          : "";

      try {
        res.json(
          await options.authService
            .recoverAccount({
              loginName,
              recoveryCode,
              newPassword
            })
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "AUTH_RECOVERY_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/auth/logout",
    (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      options.authService
        .logoutAuthorization(
          req.get("authorization")
        );
      res.status(204).end();
    }
  );

  if (options.supportService) {
    app.use(
      "/api/support",
      (req, res, next) => {
        try {
          res.locals.lexSupport =
            options.supportService!
              .authenticateAuthorization(
                req.get(
                  "x-lex-service-authorization"
                )
              );
          next();
        } catch (error) {
          if (
            !sendSupportError(
              res,
              error
            )
          ) {
            res.status(401).json({
              error:
                "SUPPORT_SESSION_REQUIRED"
            });
          }
        }
      }
    );

    app.get(
      "/api/support/me",
      (_req, res) => {
        res.json({
          session:
            responseSupportContext(res)
        });
      }
    );

    app.get(
      "/api/support/diagnostics",
      (_req, res) => {
        const session =
          responseSupportContext(res);
        try {
          options.supportService!
            .assertCapability(
              session,
              "DIAGNOSTICS"
            );
          options.supportService!
            .recordOperation(
              session,
              "diagnostics_read"
            );
          res.json({
            service:
              "lex-machina-runtime",
            localOnly: true,
            role: "SERVICE",
            installationId:
              session.installationId,
            expiresAt:
              session.expiresAt
          });
        } catch (error) {
          if (
            !sendSupportError(
              res,
              error
            )
          ) {
            res.status(500).json({
              error:
                "SUPPORT_DIAGNOSTICS_FAILED"
            });
          }
        }
      }
    );

    app.post(
      "/api/support/logout",
      (req, res) => {
        options.supportService!
          .deactivateAuthorization(
            req.get(
              "x-lex-service-authorization"
            )
          );
        res.status(204).end();
      }
    );
  }

  if (options.authService) {
    app.use(
      "/api",
      (req, res, next) => {
        try {
          const context =
            options.authService!
              .authenticateAuthorization(
                req.get(
                  "authorization"
                )
              );
          res.locals.lexAuth =
            context;

          if (
            req.method !== "GET" &&
            req.path !==
              "/auth/lock"
          ) {
            const sessionId =
              context.session
                .sessionId;
            options.authService!
              .touchSession(
                sessionId
              );
            // A request the user is still waiting for (a long local-model
            // answer, OCR) is activity: keep the session from idling out
            // while it runs.
            const keepAlive =
              setInterval(
                () => {
                  options.authService!
                    .touchSession(
                      sessionId
                    );
                },
                IN_FLIGHT_ACTIVITY_INTERVAL_MS
              );
            keepAlive.unref();
            const stop = () =>
              clearInterval(
                keepAlive
              );
            res.once("finish", stop);
            res.once("close", stop);
          }
          next();
        } catch (error) {
          if (
            !sendAuthError(
              res,
              error
            )
          ) {
            res.status(401).json({
              error:
                "AUTHENTICATION_REQUIRED"
            });
          }
        }
      }
    );

    app.get(
      "/api/auth/me",
      (_req, res) => {
        res.json(
          responseAuthContext(res)
        );
      }
    );

    app.get(
      "/api/guide/state",
      (_req, res) => {
        if (
          !options.guideSessionStore
        ) {
          res.status(503).json({
            error:
              "GUIDE_SESSION_STATE_UNAVAILABLE"
          });
          return;
        }
        const actor =
          responseAuthContext(res);
        res.json({
          state:
            options.guideSessionStore
              .get(
                actor.session
                  .sessionId
              )
        });
      }
    );

    app.post(
      "/api/guide/initialize",
      (req, res) => {
        if (
          !options.guideSessionStore
        ) {
          res.status(503).json({
            error:
              "GUIDE_SESSION_STATE_UNAVAILABLE"
          });
          return;
        }
        const actor =
          responseAuthContext(res);
        const audience =
          req.body?.audience ===
            "LAIK" ||
          req.body?.audience ===
            "PRAWNIK"
            ? req.body.audience
            : null;
        if (!audience) {
          res.status(400).json({
            error:
              "GUIDE_AUDIENCE_INVALID"
          });
          return;
        }
        res.json({
          state:
            options.guideSessionStore
              .initialize(
                actor.session
                  .sessionId,
                audience
              )
        });
      }
    );

    app.post(
      "/api/guide/transition",
      (req, res) => {
        if (
          !options.guideSessionStore
        ) {
          res.status(503).json({
            error:
              "GUIDE_SESSION_STATE_UNAVAILABLE"
          });
          return;
        }
        const expectedRevision =
          Number(
            req.body
              ?.expectedRevision
          );
        const transition =
          parseGuideTransition(
            req.body?.transition
          );
        if (
          !Number.isSafeInteger(
            expectedRevision
          ) ||
          expectedRevision < 1 ||
          !transition
        ) {
          res.status(400).json({
            error:
              "GUIDE_TRANSITION_REQUEST_INVALID"
          });
          return;
        }

        try {
          const actor =
            responseAuthContext(res);
          res.json({
            state:
              options.guideSessionStore
                .transition({
                  sessionId:
                    actor.session
                      .sessionId,
                  expectedRevision,
                  transition
                })
          });
        } catch (error) {
          const code =
            error instanceof Error
              ? error.message
              : "GUIDE_TRANSITION_FAILED";
          res.status(
            code ===
              "GUIDE_SESSION_STATE_CONFLICT" ||
            code ===
              "GUIDE_IRREVERSIBLE_ACTION_PENDING"
              ? 409
              : code.includes(
                    "INVALID"
                  ) ||
                  code.includes(
                    "TRANSITION"
                  ) ||
                  code.includes(
                    "MISMATCH"
                  ) ||
                  code.includes(
                    "CONFIRMATION_REQUIRED"
                  )
                ? 422
                : code ===
                    "GUIDE_SESSION_STATE_NOT_FOUND"
                  ? 404
                  : 500
          ).json({
            error: code
          });
        }
      }
    );

    // User input in the window (typing, reading with scroll/mouse) counts as
    // activity; the authentication middleware above already refreshed the
    // idle deadline for this non-GET request.
    app.post(
      "/api/auth/activity",
      (_req, res) => {
        res.status(204).end();
      }
    );

    // "Zapisz formę": the user corrected how a restored name inflects.
    app.post(
      "/api/privacy/name-forms",
      async (req, res) => {
        const body = req.body as Partial<NameFormCorrection> | undefined;
        if (!options.personMorphology?.saveCorrection) {
          res.status(503).json({ error: "PERSON_MORPHOLOGY_UNAVAILABLE" });
          return;
        }
        try {
          await options.personMorphology.saveCorrection({
            canonical: String(body?.canonical ?? ""),
            gender: body?.gender === "f" ? "f" : "m1",
            case: String(body?.case ?? "") as NameFormCorrection["case"],
            text: String(body?.text ?? "")
          });
          res.status(204).end();
        } catch (error) {
          const code = error instanceof Error ? error.message : "NAME_FORM_INVALID";
          res.status(code.startsWith("NAME_FORM_") ? 400 : 500).json({ error: code.startsWith("NAME_FORM_") ? code : "NAME_FORM_SAVE_FAILED" });
        }
      }
    );

    app.post(
      "/api/auth/lock",
      (_req, res) => {
        const context =
          responseAuthContext(res);
        options.authService!
          .lockSession(
            context.session
              .sessionId
          );
        res.status(204).end();
      }
    );

    app.post(
      "/api/auth/recovery-code",
      async (req, res) => {
        const password =
          typeof req.body?.password ===
            "string"
            ? req.body.password
            : "";
        try {
          res.status(201).json(
            await options
              .authService!
              .createRecoveryCode(
                responseAuthContext(
                  res
                ),
                { password }
              )
          );
        } catch (error) {
          if (
            !sendAuthError(
              res,
              error
            )
          ) {
            res.status(500).json({
              error:
                "RECOVERY_CODE_CREATE_FAILED"
            });
          }
        }
      }
    );

    app.post(
      "/api/auth/password",
      async (req, res) => {
        const currentPassword =
          typeof req.body
            ?.currentPassword ===
            "string"
            ? req.body
                .currentPassword
            : "";
        const newPassword =
          typeof req.body?.newPassword ===
            "string"
            ? req.body.newPassword
            : "";
        try {
          res.json(
            await options
              .authService!
              .changePassword(
                responseAuthContext(
                  res
                ),
                {
                  currentPassword,
                  newPassword
                }
              )
          );
        } catch (error) {
          if (
            !sendAuthError(
              res,
              error
            )
          ) {
            res.status(500).json({
              error:
                "PASSWORD_CHANGE_FAILED"
            });
          }
        }
      }
    );
  }

  app.get(
    "/api/admin/support/status",
    (_req, res) => {
      if (!options.supportService) {
        res.status(503).json({
          error:
            "SUPPORT_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const actor =
        responseAuthContext(res);
      if (
        actor.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "SUPPORT_ADMIN_REQUIRED"
        });
        return;
      }
      res.json(
        options.supportService
          .status()
      );
    }
  );

  app.post(
    "/api/admin/support/challenge",
    (_req, res) => {
      if (!options.supportService) {
        res.status(503).json({
          error:
            "SUPPORT_SERVICE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.status(201).json(
          options.supportService
            .issueChallenge(
              responseAuthContext(
                res
              )
            )
        );
      } catch (error) {
        if (
          !sendSupportError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "SUPPORT_CHALLENGE_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/admin/support/activate",
    (req, res) => {
      if (!options.supportService) {
        res.status(503).json({
          error:
            "SUPPORT_SERVICE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.status(201).json(
          options.supportService
            .activate(
              responseAuthContext(
                res
              ),
              req.body
            )
        );
      } catch (error) {
        if (
          !sendSupportError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "SUPPORT_ACTIVATION_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/admin/users",
    (_req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          users:
            options.authService
              .listUsers(
                responseAuthContext(
                  res
                )
              )
        });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/admin/users",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const displayName =
        typeof req.body?.displayName ===
          "string"
          ? req.body.displayName
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";
      try {
        const user =
          await options.authService
            .createUser(
              responseAuthContext(res),
              {
                loginName,
                displayName,
                password
              }
            );
        res.status(201).json({
          user
        });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_CREATE_FAILED"
          });
        }
      }
    }
  );

  app.patch(
    "/api/admin/users/:userId/status",
    (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const userId =
        String(
          req.params.userId ?? ""
        ).trim();
      const status =
        req.body?.status ===
          "ACTIVE" ||
        req.body?.status ===
          "DISABLED"
          ? req.body.status
          : null;
      if (!status) {
        res.status(400).json({
          error:
            "INVALID_USER_REQUEST"
        });
        return;
      }
      try {
        const user =
          options.authService
            .setUserStatus(
              responseAuthContext(
                res
              ),
              userId,
              status
            );
        res.json({ user });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_STATUS_UPDATE_FAILED"
          });
        }
      }
    }
  );

  app.delete(
    "/api/admin/users/:userId",
    (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const userId =
        String(
          req.params.userId ?? ""
        ).trim();
      try {
        res.json(
          options.authService
            .deleteUser(
              responseAuthContext(
                res
              ),
              userId
            )
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_DELETE_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/shared/templates",
    async (_req, res) => {
      if (
        !options.sharedTemplateStore
      ) {
        res.status(503).json({
          error:
            "SHARED_TEMPLATE_STORE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          templates:
            await options
              .sharedTemplateStore
              .listTemplates()
        });
      } catch {
        res.status(500).json({
          error:
            "SHARED_TEMPLATE_LIST_FAILED"
        });
      }
    }
  );

  const sharedTemplateBody =
    express.raw({
      type: () => true,
      limit: "64mb"
    });

  app.post(
    "/api/shared/templates",
    sharedTemplateBody,
    async (req, res) => {
      if (
        !options.sharedTemplateStore
      ) {
        res.status(503).json({
          error:
            "SHARED_TEMPLATE_STORE_UNAVAILABLE"
        });
        return;
      }
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error:
            "TEMPLATE_BODY_REQUIRED"
        });
        return;
      }

      const mediaType =
        req.get("content-type")
          ?.split(";", 1)[0]
          ?.trim()
          .toLowerCase() ||
        "application/octet-stream";
      const filename =
        decodeUploadFilename(
          req.get("x-lex-filename")
        );

      try {
        const stored =
          await options
            .sharedTemplateStore
            .saveTemplate({
              filename,
              mediaType,
              data:
                new Uint8Array(
                  req.body
                ),
              createdByUserId:
                context.user.userId
            });
        res.status(201).json(
          stored
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "UNSUPPORTED_TEMPLATE_MEDIA_TYPE"
        ) {
          res.status(415).json({
            error:
              "UNSUPPORTED_TEMPLATE_MEDIA_TYPE"
          });
          return;
        }
        res.status(422).json({
          error:
            "SHARED_TEMPLATE_STORE_FAILED"
        });
      }
    }
  );

  app.get(
    "/api/firm-knowledge",
    (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const workspace =
          options.caseAccessService
            .getFirmKnowledgeWorkspace(
              responseAuthContext(
                res
              )
            );
        res.json({
          workspace
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "FIRM_KNOWLEDGE_STATUS_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/firm-knowledge",
    async (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const workspace =
          await options
            .caseAccessService
            .createFirmKnowledgeWorkspace(
              responseAuthContext(
                res
              )
            );
        res.status(201).json({
          workspace
        });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          ) &&
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "FIRM_KNOWLEDGE_CREATE_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases",
    (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const cases =
          options.caseAccessService
            .listCases(
              responseAuthContext(res)
            );
        res.json({
          cases
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_LIST_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/legacy",
    async (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          cases:
            await options
              .caseAccessService
              .listLegacyCases(
                responseAuthContext(
                  res
                )
              )
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "LEGACY_CASE_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/import-legacy",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const imported =
          await options
            .caseAccessService
            .importLegacyCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              )
            );
        res.status(201).json(
          imported
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "LEGACY_CASE_IMPORT_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId",
    (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          options.caseAccessService
            .openCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              )
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_OPEN_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases",
    async (req, res) => {
      if (!options.caseFileStore) {
        res.status(503).json({
          error:
            "CASE_STORAGE_UNAVAILABLE"
        });
        return;
      }

      const displayName =
        typeof req.body?.displayName ===
          "string"
          ? req.body.displayName
          : undefined;

      try {
        const created =
          options.caseAccessService
            ? await options
                .caseAccessService
                .createCase(
                  responseAuthContext(
                    res
                  ),
                  displayName
                )
            : await options
                .caseFileStore
                .createCase(
                  displayName
                );
        res.status(201).json(
          created
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_CREATE_FAILED"
          });
        }
      }
    }
  );

  app.patch(
    "/api/cases/:caseId",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const displayName =
        typeof req.body
          ?.displayName ===
          "string"
          ? req.body
              .displayName
          : "";
      try {
        res.json(
          await options
            .caseAccessService
            .renameCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              displayName
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_RENAME_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId/schedule",
    async (req, res) => {
      if (
        !options.caseScheduleService
      ) {
        res.status(503).json({
          error:
            "CASE_SCHEDULE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          events:
            await options
              .caseScheduleService
              .listCaseSchedule(
                responseAuthContext(
                  res
                ),
                String(
                  req.params.caseId ??
                    ""
                )
              )
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_SCHEDULE_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/schedule",
    async (req, res) => {
      if (
        !options.caseScheduleService
      ) {
        res.status(503).json({
          error:
            "CASE_SCHEDULE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.status(201).json(
          await options
            .caseScheduleService
            .addCaseScheduleEvent(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                  ""
              ),
              {
                kind:
                  req.body?.kind,
                title:
                  req.body?.title,
                startsAt:
                  req.body?.startsAt,
                location:
                  req.body?.location,
                notes:
                  req.body?.notes
              }
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_SCHEDULE_CREATE_FAILED"
          });
        }
      }
    }
  );

  app.delete(
    "/api/cases/:caseId/schedule/:eventId",
    async (req, res) => {
      if (
        !options.caseScheduleService
      ) {
        res.status(503).json({
          error:
            "CASE_SCHEDULE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseScheduleService
            .deleteCaseScheduleEvent(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                  ""
              ),
              String(
                req.params.eventId ??
                  ""
              )
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_SCHEDULE_DELETE_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/archive",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .setCaseArchived(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              true
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ARCHIVE_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/unarchive",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .setCaseArchived(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              false
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_UNARCHIVE_FAILED"
          });
        }
      }
    }
  );

  app.delete(
    "/api/cases/:caseId",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";
      try {
        res.json(
          await options
            .caseAccessService
            .deleteCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              password
            )
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          ) &&
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_DELETE_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/knowledge/search",
    async (req, res) => {
      if (
        !options.caseAccessService ||
        !options.caseKnowledgeSearch
      ) {
        res.status(503).json({
          error:
            "CASE_KNOWLEDGE_UNAVAILABLE"
        });
        return;
      }

      const caseId =
        String(
          req.params.caseId ?? ""
        ).trim();
      const query =
        typeof req.body?.query ===
          "string"
          ? req.body.query.trim()
          : "";
      const limit =
        req.body?.limit ===
          undefined
          ? 8
          : Number(
              req.body.limit
            );

      if (
        !/^case_[a-f0-9]{32}$/
          .test(caseId) ||
        query.length < 2 ||
        query.length > 500 ||
        !Number.isInteger(
          limit
        ) ||
        limit < 1 ||
        limit > 16
      ) {
        res.status(400).json({
          error:
            "INVALID_KNOWLEDGE_QUERY"
        });
        return;
      }

      try {
        const context =
          responseAuthContext(
            res
          );
        const caseView =
          options.caseAccessService
            .openCase(
              context,
              caseId
            );
        const hits =
          await options
            .caseAccessService
            .withCaseDataKey(
              context,
              caseId,
              "READ",
              async (
                caseDataKey
              ) =>
                await options
                  .caseKnowledgeSearch!
                  .search({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView
                        .keyVersion,
                    query,
                    limit
                  })
            );
        res.json({
          caseId,
          caseKind:
            caseView.caseKind,
          hits: hits.map(
            (hit) => ({
              documentId:
                hit.documentId,
              chunkIndex:
                hit.chunkIndex,
              pageStart:
                hit.pageStart,
              pageEnd:
                hit.pageEnd,
              score:
                hit.score,
              text:
                hit.text
            })
          )
        });
      } catch (error) {
        if (
          sendCaseAccessError(
            res,
            error
          )
        ) {
          return;
        }
        if (
          error instanceof Error &&
          [
            "INVALID_KNOWLEDGE_QUERY",
            "INVALID_KNOWLEDGE_LIMIT"
          ].includes(
            error.message
          )
        ) {
          res.status(400).json({
            error:
              error.message
          });
          return;
        }
        res.status(422).json({
          error:
            "CASE_KNOWLEDGE_SEARCH_FAILED"
        });
      }
    }
  );

  app.get(
    "/api/cases/:caseId/access-candidates",
    (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          users:
            options.caseAccessService
              .listAccessCandidates(
                responseAuthContext(
                  res
                ),
                String(
                  req.params.caseId ??
                    ""
                )
              )
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_CANDIDATES_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId/access",
    (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          access:
            options.caseAccessService
              .listAccess(
                responseAuthContext(
                  res
                ),
                String(
                  req.params.caseId ??
                  ""
                )
              )
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/access",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const role =
        typeof req.body?.role ===
          "string"
          ? req.body.role
          : "";
      if (
        ![
          "EDITOR",
          "ANALYST",
          "VIEWER"
        ].includes(role) ||
        typeof req.body
          ?.canReidentify !==
          "boolean" ||
        typeof req.body?.userId !==
          "string"
      ) {
        res.status(400).json({
          error:
            "INVALID_CASE_ACCESS_REQUEST"
        });
        return;
      }
      try {
        const granted =
          await options
            .caseAccessService
            .grantAccess(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              {
                userId:
                  req.body.userId,
                role:
                  role as Exclude<
                    CaseRole,
                    "OWNER"
                  >,
                canReidentify:
                  req.body
                    .canReidentify
              }
            );
        res.status(201).json(
          granted
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_GRANT_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/transfer-owner",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const userId =
        typeof req.body?.userId ===
          "string"
          ? req.body.userId
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";
      try {
        res.json(
          await options
            .caseAccessService
            .transferOwnership(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                  ""
              ),
              {
                userId,
                password
              }
            )
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          ) &&
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_OWNER_TRANSFER_FAILED"
          });
        }
      }
    }
  );

  app.delete(
    "/api/cases/:caseId/access/:userId",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .revokeAccess(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              String(
                req.params.userId ??
                ""
              )
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_REVOKE_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/rotate-key",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .rotateCaseKey(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              )
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_KEY_ROTATE_FAILED"
          });
        }
      }
    }
  );

  const caseUploadBody = express.raw({
    type: () => true,
    limit: "512mb"
  });

  app.get(
    "/api/cases/:caseId/files",
    async (req, res) => {
      if (
        !options.caseFileStore ||
        !options.caseFileStore
          .listUploads
      ) {
        res.status(503).json({
          error:
            "CASE_STORAGE_UNAVAILABLE"
        });
        return;
      }
      const caseId =
        String(
          req.params.caseId ??
          ""
        ).trim();
      try {
        options.caseAccessService
          ?.assertAccess(
            responseAuthContext(
              res
            ),
            caseId,
            "READ"
          );
        let uploads:
          StoredUpload[];
        if (
          options
            .secureCaseUploadStore &&
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          uploads =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "READ",
                async (
                  caseDataKey
                ) =>
                  await options
                    .secureCaseUploadStore!
                    .listUploads({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    })
              );
        } else {
          uploads =
            await options
              .caseFileStore
              .listUploads!(
                caseId
              );
        }
        let enrichedUploads:
          Array<
            StoredUpload & {
              processing?: {
                documentId: string;
                complete: true;
                totalPages: number;
                digitalPages: number;
                ocrPages: number;
                blankPages: number;
                chunkIndices: number[];
                // false: OCR/text only, sent in clear (no anonymization key).
                anonymized: boolean;
                // On the case's shared key (one symbol per entity in the case).
                sharedKey: boolean;
              };
            }
          > =
          uploads.map(
            (item) => ({
              ...item
            })
          );

        if (
          options.documentService
            ?.restoreDocument &&
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );

          enrichedUploads =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "READ",
                async (
                  caseDataKey
                ) =>
                  await Promise.all(
                    uploads.map(
                      async (
                        item
                      ) => {
                        if (
                          item.archive
                        ) {
                          return {
                            ...item
                          };
                        }

                        const documentId =
                          "doc_" +
                          item.sha256
                            .slice(
                              0,
                              24
                            );
                        try {
                          const restored =
                            await options
                              .documentService!
                              .restoreDocument!({
                                caseId,
                                documentId,
                                caseDataKey,
                                keyVersion:
                                  caseView
                                    .keyVersion
                              });
                          return {
                            ...item,
                            processing: {
                              documentId:
                                restored
                                  .documentId,
                              complete:
                                true as const,
                              totalPages:
                                restored
                                  .totalPages,
                              digitalPages:
                                restored
                                  .digitalPages,
                              ocrPages:
                                restored
                                  .ocrPages,
                              blankPages:
                                restored
                                  .blankPages,
                              chunkIndices:
                                restored
                                  .chunks
                                  .slice(0, 32)
                                  .map(
                                    (chunk) =>
                                      chunk.index
                                  ),
                              anonymized:
                                restored.privacy.findings > 0,
                              sharedKey:
                                options.documentService!.usesSharedKey?.(restored.documentId) ?? false
                            }
                          };
                        } catch {
                          return {
                            ...item
                          };
                        }
                      }
                    )
                  )
              );
        }

        res.json({
          caseId,
          uploads:
            enrichedUploads
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error:
              "CASE_FILE_LIST_FAILED"
          });
        }
      }
    }
  );

  async function processStoredCaseFile(
    req: Request,
    res: Response,
    fileId?: string
  ): Promise<void> {
    if (
      !options.documentService ||
      !options.caseAccessService ||
      !options.secureCaseUploadStore
    ) {
      res.status(503).json({
        error:
          "STORED_FILE_PROCESSING_UNAVAILABLE"
      });
      return;
    }

    const caseId =
      String(
        req.params.caseId ?? ""
      ).trim();
    const uploadId =
      String(
        req.params.uploadId ?? ""
      ).trim();
    const memberId =
      fileId?.trim();

    if (
      !/^case_[a-f0-9]{32}$/
        .test(caseId) ||
      !/^upload_[a-f0-9]{32}$/
        .test(uploadId) ||
      (
        memberId !== undefined &&
        !/^file_[a-f0-9]{32}$/
          .test(memberId)
      )
    ) {
      res.status(400).json({
        error:
          "INVALID_STORED_FILE_REQUEST"
      });
      return;
    }

    try {
      const context =
        responseAuthContext(res);
      options.caseAccessService
        .assertAccess(
          context,
          caseId,
          "WRITE"
        );
      const caseView =
        options.caseAccessService
          .openCase(
            context,
            caseId
          );

      const result =
        await options
          .caseAccessService
          .withCaseDataKey(
            context,
            caseId,
            "WRITE",
            async (caseDataKey) => {
              let data: Buffer;
              let mediaType:
                SupportedDocumentMediaType;
              let sourceFileId:
                string | undefined;

              if (memberId) {
                const restored =
                  await options
                    .secureCaseUploadStore!
                    .readExtractedPayload({
                      caseId,
                      uploadId,
                      fileId:
                        memberId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion,
                      maxBytes:
                        512 *
                        1024 *
                        1024
                    });
                if (
                  !restored
                    .manifest
                    .processable
                ) {
                  restored.data.fill(0);
                  throw new Error(
                    "STORED_FILE_NOT_PROCESSABLE"
                  );
                }
                const resolved =
                  storedDocumentMediaType(
                    restored
                      .manifest
                      .mediaType
                  );
                if (!resolved) {
                  restored.data.fill(0);
                  throw new Error(
                    "STORED_FILE_MEDIA_UNSUPPORTED"
                  );
                }
                data =
                  restored.data;
                mediaType =
                  resolved;
                sourceFileId =
                  restored
                    .manifest
                    .fileId;
              } else {
                const uploads =
                  await options
                    .secureCaseUploadStore!
                    .listUploads({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                const upload =
                  uploads.find(
                    (item) =>
                      item.uploadId ===
                        uploadId
                  );
                if (!upload) {
                  throw new Error(
                    "STORED_UPLOAD_NOT_FOUND"
                  );
                }
                if (upload.archive) {
                  throw new Error(
                    "STORED_ARCHIVE_MEMBER_REQUIRED"
                  );
                }
                const resolved =
                  storedDocumentMediaType(
                    upload.mediaType
                  );
                if (!resolved) {
                  throw new Error(
                    "STORED_FILE_MEDIA_UNSUPPORTED"
                  );
                }
                data =
                  await options
                    .secureCaseUploadStore!
                    .readUploadPayload({
                      caseId,
                      uploadId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion,
                      maxBytes:
                        512 *
                        1024 *
                        1024
                    });
                const digest =
                  createHash(
                    "sha256"
                  )
                    .update(data)
                    .digest("hex");
                if (
                  data.byteLength !==
                    upload.bytes ||
                  digest !==
                    upload.sha256
                ) {
                  data.fill(0);
                  throw new Error(
                    "STORED_UPLOAD_INTEGRITY_FAILED"
                  );
                }
                mediaType =
                  resolved;
              }

              try {
                assertStoredDocumentSignature(
                  data,
                  mediaType
                );
                const onProgress =
                  processingProgress.reporter(
                    caseId,
                    progressIdFrom(req.get("x-lex-progress"))
                  );
                return await options
                  .documentService!
                  .review(
                    data,
                    mediaType,
                    {
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion,
                      ...(onProgress ? { onProgress } : {}),
                      ...(req.body?.localAi === true ? { localAi: true } : {}),
                      ...(typeof req.body?.ocrFix === "boolean" ? { ocrFix: req.body.ocrFix } : {})
                    }
                  );
              } finally {
                data.fill(0);
              }
            }
          );

      documentCaseIds.set(
        result.documentId,
        caseId
      );
      res.status(201).json({
        ...result,
        caseId,
        uploadId,
        ...(memberId
          ? {
              fileId:
                memberId
            }
          : {})
      });
    } catch (error) {
      if (
        sendCaseAccessError(
          res,
          error
        )
      ) {
        return;
      }
      const code =
        error instanceof Error
          ? error.message
          : "";
      if (
        code ===
          "STORED_UPLOAD_NOT_FOUND" ||
        code ===
          "INVALID_FILE_ID" ||
        code ===
          "ENOENT"
      ) {
        res.status(404).json({
          error:
            "STORED_FILE_NOT_FOUND"
        });
        return;
      }
      if (
        code ===
          "STORED_FILE_MEDIA_UNSUPPORTED" ||
        code ===
          "STORED_FILE_NOT_PROCESSABLE" ||
        code ===
          "STORED_ARCHIVE_MEMBER_REQUIRED"
      ) {
        res.status(415).json({
          error: code
        });
        return;
      }
      if (
        code ===
          "STORED_DOCUMENT_SIGNATURE_MISMATCH" ||
        code ===
          "STORED_UPLOAD_INTEGRITY_FAILED" ||
        code ===
          "EXTRACTED_PAYLOAD_INTEGRITY_FAILED"
      ) {
        res.status(422).json({
          error:
            "STORED_FILE_VALIDATION_FAILED"
        });
        return;
      }
      // A coded cause (never document content) so the UI can tell an OCR
      // failure from a privacy/NER or extraction failure.
      const errorCode =
        error instanceof Error &&
        typeof (error as { code?: unknown }).code === "string"
          ? String((error as { code?: unknown }).code)
          : "";
      const errorName =
        error instanceof Error && /^[A-Za-z]{3,60}$/.test(error.name) && error.name !== "Error"
          ? error.name.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase()
          : "";
      const reason =
        /^[A-Z][A-Z0-9_]{2,80}$/.test(errorCode)
          ? errorCode
          : /^[A-Z][A-Z0-9_]{2,80}(?=$|:)/.exec(code)?.[0] ??
            (errorName ? `INTERNAL_${errorName}` : undefined);
      // Code and error type only: the message may quote document content.
      console.error(
        `STORED_FILE_PROCESSING_FAILED:${reason ?? "UNKNOWN"}`
      );
      res.status(422).json({
        error:
          "STORED_FILE_PROCESSING_FAILED",
        ...(reason
          ? {
              reason
            }
          : {})
      });
    }
  }

  // The anonymized version of a case document with its key; edits change
  // both at once (add a value to the anonymization, take one out, correct
  // case forms). Local only - nothing here goes to a model.
  async function withRestoredDocument(
    req: Request,
    res: Response,
    access: "ANALYZE" | "WRITE",
    action: (args: {
      caseId: string;
      documentId: string;
      security: DocumentSecurityContext;
    }) => Promise<unknown>
  ): Promise<void> {
    const caseId = String(req.params.caseId ?? "").trim();
    const documentId = String(req.params.documentId ?? "").trim();
    const service = options.documentService;
    if (
      !service?.restoreDocument ||
      !service.anonymizedVersion ||
      !service.addProtection ||
      !service.removeProtection ||
      !service.updateKeyForms ||
      !options.caseAccessService
    ) {
      res.status(503).json({ error: "ANONYMIZED_VERSION_UNAVAILABLE" });
      return;
    }
    if (!/^case_[a-f0-9]{32}$/.test(caseId) || !/^doc_[a-f0-9]{24}$/.test(documentId)) {
      res.status(400).json({ error: "INVALID_ANONYMIZED_VERSION_REQUEST" });
      return;
    }
    try {
      const context = responseAuthContext(res);
      options.caseAccessService.assertAccess(context, caseId, access);
      const caseView = options.caseAccessService.openCase(context, caseId);
      const result = await options.caseAccessService.withCaseDataKey(
        context,
        caseId,
        access,
        async (caseDataKey) => {
          await service.restoreDocument!({ caseId, documentId, caseDataKey, keyVersion: caseView.keyVersion });
          return await action({
            caseId,
            documentId,
            security: { caseId, caseDataKey, keyVersion: caseView.keyVersion }
          });
        }
      );
      res.setHeader("Cache-Control", "no-store");
      res.json(result);
    } catch (error) {
      if (sendCaseAccessError(res, error)) return;
      const code = error instanceof Error ? error.message : "";
      if (code === "ENOENT" || code.endsWith("NOT_FOUND") || code === "UNKNOWN_LOCAL_DOCUMENT") {
        res.status(404).json({ error: code === "ENOENT" ? "DOCUMENT_NOT_FOUND" : code });
        return;
      }
      if (code.startsWith("PRIVACY_EDIT_") || code.startsWith("PRIVACY_KEY_")) {
        res.status(422).json({ error: code });
        return;
      }
      console.error(`ANONYMIZED_VERSION_FAILED:${/^[A-Z][A-Z0-9_]{2,80}/.exec(code)?.[0] ?? "UNKNOWN"}`);
      res.status(500).json({ error: "ANONYMIZED_VERSION_FAILED" });
    }
  }

  const EDITABLE_PII_KINDS = new Set<string>([
    "PERSON", "ADDRESS", "PESEL", "NIP", "REGON", "IBAN", "EMAIL", "PHONE", "ID_CARD",
    "PASSPORT", "BIRTH_DATE", "LAND_REGISTRY", "KRS", "VEHICLE_PLATE", "PAYMENT_CARD", "CUSTOM"
  ]);

  app.get("/api/cases/:caseId/documents/:documentId/anonymized", (req, res) =>
    withRestoredDocument(req, res, "ANALYZE", async ({ documentId }) =>
      options.documentService!.anonymizedVersion!(documentId)
    )
  );

  app.post("/api/cases/:caseId/documents/:documentId/anonymized/protect", (req, res) =>
    withRestoredDocument(req, res, "WRITE", async ({ documentId, security }) => {
      const text = typeof req.body?.text === "string" ? req.body.text : "";
      const kind = String(req.body?.kind ?? "");
      if (!EDITABLE_PII_KINDS.has(kind)) throw new Error("PRIVACY_EDIT_KIND_INVALID");
      return await options.documentService!
        .addProtection!(documentId, text, kind as PiiKind, security);
    })
  );

  app.post("/api/cases/:caseId/documents/:documentId/join-shared-key", (req, res) =>
    withRestoredDocument(req, res, "WRITE", async ({ documentId, security }) => {
      if (!options.documentService!.joinSharedKey) throw new Error("SHARED_KEY_UNAVAILABLE");
      return await options.documentService!.joinSharedKey(documentId, security);
    })
  );

  app.post("/api/cases/:caseId/documents/:documentId/anonymized/unprotect", (req, res) =>
    withRestoredDocument(req, res, "WRITE", async ({ documentId, security }) =>
      await options.documentService!
        .removeProtection!(documentId, String(req.body?.token ?? ""), security)
    )
  );

  app.post("/api/cases/:caseId/documents/:documentId/anonymized/forms", (req, res) =>
    withRestoredDocument(req, res, "WRITE", async ({ documentId, security }) => {
      const raw = req.body?.forms;
      if (!raw || typeof raw !== "object") throw new Error("PRIVACY_EDIT_TEXT_INVALID");
      const forms: Partial<Record<PersonCase, string>> = {};
      for (const personCase of PERSON_CASES) {
        const value = (raw as Record<string, unknown>)[personCase];
        if (typeof value === "string") forms[personCase] = value;
      }
      return await options.documentService!
        .updateKeyForms!(documentId, String(req.body?.token ?? ""), forms, security);
    })
  );

  // What a person token is: a man, a woman, several persons, a firm.
  app.post("/api/cases/:caseId/documents/:documentId/anonymized/grammar", (req, res) =>
    withRestoredDocument(req, res, "WRITE", async ({ documentId, security }) => {
      const grammar = String(req.body?.grammar ?? "");
      if (!["m", "f", "group-m", "group-f", "organization"].includes(grammar)) throw new Error("PRIVACY_EDIT_GRAMMAR_INVALID");
      if (!options.documentService!.updateKeyGrammar) throw new Error("PRIVACY_EDIT_GRAMMAR_UNAVAILABLE");
      return await options.documentService!.updateKeyGrammar(
        documentId,
        String(req.body?.token ?? ""),
        grammar as KeyGrammar,
        security
      );
    })
  );

  // A file with placeholders (e.g. an answer from an external model) with the
  // values of one case document's key put back, saved as a new case file.
  app.post(
    "/api/cases/:caseId/files/:uploadId/deanonymize",
    async (req, res) => {
      const caseId = String(req.params.caseId ?? "").trim();
      const uploadId = String(req.params.uploadId ?? "").trim();
      const documentId = String(req.body?.documentId ?? "").trim();
      const service = options.documentService;
      if (!service?.restoreDocument || !service.restoreText || !options.caseAccessService || !options.secureCaseUploadStore) {
        res.status(503).json({ error: "FILE_DEANONYMIZATION_UNAVAILABLE" });
        return;
      }
      if (
        !/^case_[a-f0-9]{32}$/.test(caseId) ||
        !/^upload_[a-f0-9]{32}$/.test(uploadId) ||
        !/^doc_[a-f0-9]{24}$/.test(documentId)
      ) {
        res.status(400).json({ error: "INVALID_FILE_DEANONYMIZATION_REQUEST" });
        return;
      }
      try {
        const context = responseAuthContext(res);
        options.caseAccessService.assertAccess(context, caseId, "WRITE");
        const caseView = options.caseAccessService.openCase(context, caseId);
        const result = await options.caseAccessService.withCaseDataKey(
          context,
          caseId,
          "WRITE",
          async (caseDataKey) => {
            const store = options.secureCaseUploadStore!;
            const keyVersion = caseView.keyVersion;
            const upload = (await store.listUploads({ caseId, caseDataKey, keyVersion })).find(
              (item) => item.uploadId === uploadId
            );
            if (!upload) throw new Error("STORED_UPLOAD_NOT_FOUND");
            const mediaType = upload.mediaType.split(";")[0]!.trim().toLowerCase();
            await service.restoreDocument!({ caseId, documentId, caseDataKey, keyVersion });
            const restore = (text: string) => service.restoreText!(documentId, text);
            const data = await store.readUploadPayload({
              caseId,
              uploadId,
              caseDataKey,
              keyVersion,
              maxBytes: 64 * 1024 * 1024
            });
            let output: Uint8Array;
            let count: number;
            let unresolved: string[];
            try {
              const editable = editableMediaType(mediaType, upload.filename);
              if (editable && editable !== "text/csv" && editable !== "text/tab-separated-values") {
                const editor = new LocalOfficeEditor();
                const model = await editor.read(data, editable);
                const restored = deanonymizeModel(model, restore);
                const format =
                  editable.includes("opendocument") ? "odt" : editable.includes("wordprocessing") ? "docx" : "xlsx";
                output = await editor.write(format, restored.model);
                ({ count, unresolved } = restored);
              } else if (/^text\//.test(mediaType) || /\.(txt|md|markdown|csv|tsv)$/i.test(upload.filename)) {
                const restored = restore(decodePlainText(data));
                output = Buffer.from(restored.text, "utf8");
                ({ count, unresolved } = restored);
              } else {
                throw new Error("FILE_DEANONYMIZATION_MEDIA_UNSUPPORTED");
              }
            } finally {
              data.fill(0);
            }
            if (count === 0 && unresolved.length === 0) throw new Error("FILE_DEANONYMIZATION_NO_PLACEHOLDERS");
            const dot = upload.filename.lastIndexOf(".");
            const filename =
              (dot > 0 ? upload.filename.slice(0, dot) : upload.filename) +
              " (deanonimizowany)" +
              (dot > 0 ? upload.filename.slice(dot) : "");
            const outputType =
              mediaType === "text/markdown" || mediaType === "text/csv" || mediaType === "text/tab-separated-values"
                ? mediaType
                : /^text\//.test(mediaType)
                  ? "text/plain"
                  : upload.mediaType.includes("macroenabled")
                    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    : mediaType;
            const stored = await store.saveUpload({
              caseId,
              filename: outputType !== mediaType && /\.xlsm$/i.test(filename) ? filename.replace(/\.xlsm$/i, ".xlsx") : filename,
              mediaType: outputType,
              data: output,
              caseDataKey,
              keyVersion
            });
            return { upload: stored, restored: count, unresolved };
          }
        );
        res.status(201).json(result);
      } catch (error) {
        if (sendCaseAccessError(res, error)) return;
        const code = error instanceof Error ? error.message : "";
        if (code === "ENOENT" || code.endsWith("NOT_FOUND") || code === "UNKNOWN_LOCAL_DOCUMENT") {
          res.status(404).json({ error: code === "ENOENT" ? "DOCUMENT_NOT_FOUND" : code });
          return;
        }
        if (code.startsWith("FILE_DEANONYMIZATION_") || code.startsWith("OFFICE_EDIT_")) {
          res.status(422).json({ error: /^[A-Z_]+/.exec(code)![0] });
          return;
        }
        console.error(`FILE_DEANONYMIZATION_FAILED:${/^[A-Z][A-Z0-9_]{2,80}/.exec(code)?.[0] ?? "UNKNOWN"}`);
        res.status(500).json({ error: "FILE_DEANONYMIZATION_FAILED" });
      }
    }
  );

  // Stage and page counts of a running OCR/anonymization request.
  app.get(
    "/api/cases/:caseId/progress/:progressId",
    (req, res) => {
      const caseId = String(req.params.caseId ?? "").trim();
      const progressId = progressIdFrom(req.params.progressId);
      if (!options.caseAccessService || !/^case_[a-f0-9]{32}$/.test(caseId) || !progressId) {
        res.status(400).json({ error: "INVALID_PROGRESS_REQUEST" });
        return;
      }
      try {
        options.caseAccessService.assertAccess(responseAuthContext(res), caseId, "ANALYZE");
      } catch (error) {
        if (!sendCaseAccessError(res, error)) res.status(403).json({ error: "CASE_ACCESS_DENIED" });
        return;
      }
      res.setHeader("Cache-Control", "no-store");
      res.json({ progress: processingProgress.get(caseId, progressId) ?? null });
    }
  );

  // The anonymization key of one processed case document, for the user on
  // this computer only (never part of a model request).
  app.get(
    "/api/cases/:caseId/documents/:documentId/privacy-key",
    async (req, res) => {
      const caseId = String(req.params.caseId ?? "").trim();
      const documentId = String(req.params.documentId ?? "").trim();
      if (
        !options.documentService?.restoreDocument ||
        !options.documentService.privacyKey ||
        !options.caseAccessService
      ) {
        res.status(503).json({ error: "PRIVACY_KEY_UNAVAILABLE" });
        return;
      }
      if (!/^case_[a-f0-9]{32}$/.test(caseId) || !/^doc_[a-f0-9]{24}$/.test(documentId)) {
        res.status(400).json({ error: "INVALID_PRIVACY_KEY_REQUEST" });
        return;
      }
      try {
        const context = responseAuthContext(res);
        options.caseAccessService.assertAccess(context, caseId, "ANALYZE");
        const caseView = options.caseAccessService.openCase(context, caseId);
        await options.caseAccessService.withCaseDataKey(
          context,
          caseId,
          "ANALYZE",
          (caseDataKey) =>
            options.documentService!.restoreDocument!({
              caseId,
              documentId,
              caseDataKey,
              keyVersion: caseView.keyVersion
            })
        );
        res.setHeader("Cache-Control", "no-store");
        res.json({
          documentId,
          entries: options.documentService.privacyKey(documentId)
        });
      } catch (error) {
        if (sendCaseAccessError(res, error)) return;
        const code = error instanceof Error ? error.message : "";
        if (code === "ENOENT" || code.includes("NOT_FOUND") || code === "UNKNOWN_LOCAL_DOCUMENT") {
          res.status(404).json({ error: "PRIVACY_KEY_NOT_FOUND" });
          return;
        }
        console.error(`PRIVACY_KEY_FAILED:${/^[A-Z][A-Z0-9_]{2,80}/.exec(code)?.[0] ?? "UNKNOWN"}`);
        res.status(500).json({ error: "PRIVACY_KEY_FAILED" });
      }
    }
  );

  app.post(
    "/api/cases/:caseId/files/:uploadId/process",
    async (req, res) => {
      await processStoredCaseFile(
        req,
        res
      );
    }
  );

  app.post(
    "/api/cases/:caseId/files/:uploadId/members/:fileId/process",
    async (req, res) => {
      await processStoredCaseFile(
        req,
        res,
        String(
          req.params.fileId ?? ""
        )
      );
    }
  );

  app.get(
    "/api/cases/:caseId/templates",
    async (req, res) => {
      if (
        !options.caseAccessService ||
        !options.sharedTemplateStore
      ) {
        res.status(503).json({
          error:
            "CASE_TEMPLATE_LIBRARY_UNAVAILABLE"
        });
        return;
      }
      const caseId =
        String(
          req.params.caseId ??
          ""
        ).trim();
      try {
        options.caseAccessService
          .assertAccess(
            responseAuthContext(
              res
            ),
            caseId,
            "READ"
          );
        res.json({
          caseId,
          scope: "FIRM_SHARED",
          templates:
            await options
              .sharedTemplateStore
              .listTemplates()
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_TEMPLATE_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/files",
    caseUploadBody,
    async (req, res) => {
      if (!options.caseFileStore) {
        res.status(503).json({
          error:
            "CASE_STORAGE_UNAVAILABLE"
        });
        return;
      }
      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error:
            "FILE_BODY_REQUIRED"
        });
        return;
      }

      const caseId =
        String(req.params.caseId ?? "")
          .trim();
      const mediaType =
        req.get("content-type")
          ?.split(";", 1)[0]
          ?.trim()
          .toLowerCase() ||
        "application/octet-stream";
      const filename =
        decodeUploadFilename(
          req.get("x-lex-filename")
        );

      try {
        let stored:
          StoredUpload;
        if (
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          options.caseAccessService
            .assertAccess(
              context,
              caseId,
              "WRITE"
            );
          if (
            options
              .secureCaseUploadStore
          ) {
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          stored =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .secureCaseUploadStore!
                    .saveUpload({
                      caseId,
                      filename,
                      mediaType,
                      data:
                        new Uint8Array(
                          req.body
                        ),
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    })
              );
          } else {
            stored =
              await options
                .caseFileStore
                .saveUpload({
                  caseId,
                  filename,
                  mediaType,
                  data:
                    new Uint8Array(
                      req.body
                    ),
                  extractArchive: true
                });
          }
        } else {
          stored =
            await options
              .caseFileStore
              .saveUpload({
                caseId,
                filename,
                mediaType,
                data:
                  new Uint8Array(
                    req.body
                  ),
                extractArchive: true
              });
        }
        res.status(201).json(
          stored
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error:
              "CASE_FILE_STORE_FAILED"
          });
        }
      }
    }
  );

  app.get("/api/skills", (_req, res) => {
    const skills = [...options.registry.skills.values()]
      .map((skill) =>
        publicSkill({
          name: skill.name,
          frontmatter: skill.frontmatter
        })
      )
      .sort((a, b) =>
        String(a.name).localeCompare(String(b.name), "pl")
      );

    res.json({
      count: skills.length,
      skills
    });
  });

  app.get("/api/routes", (_req, res) => {
    res.json({
      jurisdiction: "PL",
      primarySkills: routing.listDrSkills()
    });
  });

  app.post("/api/routes/validate", (req, res) => {
    const primarySkill =
      typeof req.body?.primarySkill === "string"
        ? req.body.primarySkill.trim()
        : "";

    if (!primarySkill) {
      res.status(400).json({
        error: "PRIMARY_SKILL_REQUIRED"
      });
      return;
    }

    const result = routing.validate(primarySkill);
    res.status(result.valid ? 200 : 422).json(result);
  });

  app.put(
    "/api/admin/providers/:provider/credential",
    (req, res) => {
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (!options.credentialManager) {
        res.status(503).json({
          error:
            "PROVIDER_CREDENTIAL_MANAGER_UNAVAILABLE"
        });
        return;
      }
      const provider =
        String(
          req.params.provider ?? ""
        ).trim();
      if (!isProviderId(provider)) {
        res.status(404).json({
          error:
            "UNKNOWN_PROVIDER"
        });
        return;
      }
      const apiKey =
        typeof req.body?.apiKey ===
          "string"
          ? req.body.apiKey
          : "";
      try {
        options.credentialManager
          .setApiKey(
            provider,
            apiKey
          );
        res.json({
          provider,
          configured: true,
          storage:
            "PROCESS_MEMORY"
        });
      } catch {
        res.status(400).json({
          error:
            "INVALID_PROVIDER_API_KEY"
        });
      }
    }
  );

  app.delete(
    "/api/admin/providers/:provider/credential",
    (req, res) => {
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (!options.credentialManager) {
        res.status(503).json({
          error:
            "PROVIDER_CREDENTIAL_MANAGER_UNAVAILABLE"
        });
        return;
      }
      const provider =
        String(
          req.params.provider ?? ""
        ).trim();
      if (!isProviderId(provider)) {
        res.status(404).json({
          error:
            "UNKNOWN_PROVIDER"
        });
        return;
      }
      options.credentialManager
        .clearApiKey(provider);
      res.json({
        provider,
        cleared: true,
        storage:
          "PROCESS_MEMORY"
      });
    }
  );

  app.get(
    "/api/update/status",
    async (_req, res) => {
      if (!options.updateDiscovery) {
        res.status(503).json({
          error:
            "UPDATE_DISCOVERY_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .updateDiscovery
            .check()
        );
      } catch {
        res.status(503).json({
          error:
            "UPDATE_DISCOVERY_UNAVAILABLE"
        });
      }
    }
  );

  app.get(
    "/api/model-routing/preferences",
    (_req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const actor =
        responseAuthContext(res);
      res.json(
        options.authService
          .getModelRoutingPreferences(
            actor
          )
      );
    }
  );

  app.put(
    "/api/model-routing/preferences",
    (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const body =
        req.body &&
        typeof req.body ===
          "object" &&
        !Array.isArray(req.body)
          ? req.body as
              Record<
                string,
                unknown
              >
          : null;
      const provider =
        typeof body
          ?.auxiliaryProvider ===
          "string"
          ? body
              .auxiliaryProvider
          : "";
      const model =
        typeof body
          ?.auxiliaryModel ===
          "string"
          ? body
              .auxiliaryModel
              .trim()
          : "";
      const enabled =
        body?.auxiliaryEnabled;

      if (
        typeof enabled !==
          "boolean" ||
        !isProviderId(provider) ||
        model.length < 1 ||
        model.length > 256
      ) {
        res.status(400).json({
          error:
            "INVALID_MODEL_ROUTING_PREFERENCES"
        });
        return;
      }

      const actor =
        responseAuthContext(res);
      try {
        res.json(
          options.authService
            .setModelRoutingPreferences(
              actor,
              {
                auxiliaryEnabled:
                  enabled,
                auxiliaryProvider:
                  provider,
                auxiliaryModel:
                  model
              }
            )
        );
      } catch (error) {
        if (
          error instanceof
            AuthError
        ) {
          res.status(
            error.httpStatus
          ).json({
            error:
              error.code
          });
          return;
        }
        throw error;
      }
    }
  );

  app.get(
    "/api/provider-accounts",
    async (_req, res) => {
      if (!options.accountSessions) {
        res.status(503).json({
          error:
            "PROVIDER_ACCOUNT_SESSION_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          providers:
            await options
              .accountSessions
              .statusAll()
        });
      } catch {
        res.status(503).json({
          error:
            "PROVIDER_ACCOUNT_STATUS_FAILED"
        });
      }
    }
  );

  app.put(
    "/api/admin/provider-accounts/anthropic/oauth-token",
    (req, res) => {
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (!options.accountSessions) {
        res.status(503).json({
          error:
            "PROVIDER_ACCOUNT_SESSION_UNAVAILABLE"
        });
        return;
      }
      const token =
        typeof req.body?.token ===
          "string"
          ? req.body.token
          : "";
      try {
        options.accountSessions
          .setAnthropicOAuthToken(
            token
          );
        res.json({
          provider: "anthropic",
          configured: true,
          storage:
            "PROCESS_MEMORY"
        });
      } catch {
        res.status(400).json({
          error:
            "INVALID_CLAUDE_OAUTH_TOKEN"
        });
      }
    }
  );

  app.delete(
    "/api/admin/provider-accounts/anthropic/oauth-token",
    (req, res) => {
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (!options.accountSessions) {
        res.status(503).json({
          error:
            "PROVIDER_ACCOUNT_SESSION_UNAVAILABLE"
        });
        return;
      }
      options.accountSessions
        .clearAnthropicOAuthToken();
      res.json({
        provider: "anthropic",
        cleared: true,
        storage:
          "PROCESS_MEMORY"
      });
    }
  );

  app.post(
    "/api/provider-accounts/:provider/login",
    async (req, res) => {
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (!options.accountSessions) {
        res.status(503).json({
          error:
            "PROVIDER_ACCOUNT_SESSION_UNAVAILABLE"
        });
        return;
      }
      const provider =
        String(
          req.params.provider ?? ""
        ).trim();
      if (!isProviderId(provider)) {
        res.status(404).json({
          error:
            "UNKNOWN_PROVIDER"
        });
        return;
      }
      try {
        res.json(
          await options
            .accountSessions
            .login(provider)
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "";
        const code =
          message.startsWith(
            "ACCOUNT_SESSION_CLI_NOT_INSTALLED:"
          )
            ? "ACCOUNT_SESSION_CLI_NOT_INSTALLED"
            : message.startsWith(
                "ACCOUNT_SESSION_NOT_SUBSCRIPTION_AUTH:"
              )
              ? "ACCOUNT_SESSION_SUBSCRIPTION_LOGIN_REQUIRED"
              : "ACCOUNT_SESSION_LOGIN_FAILED";
        res.status(
          code ===
            "ACCOUNT_SESSION_CLI_NOT_INSTALLED"
            ? 503
            : 422
        ).json({
          error: code,
          provider
        });
      }
    }
  );

  app.get("/api/providers", async (_req, res) => {
    if (!options.credentialResolver) {
      res.status(503).json({
        error:
          "PROVIDER_CONFIGURATION_STATUS_UNAVAILABLE"
      });
      return;
    }

    const providers =
      await providerConfigurationStatus(
        options.credentialResolver
      );

    res.json({
      providers
    });
  });

  app.get("/api/models/:provider", async (req, res) => {
    const provider = String(req.params.provider ?? "");
    if (!isProviderId(provider)) {
      res.status(404).json({
        error: "UNKNOWN_PROVIDER"
      });
      return;
    }

    try {
      const models = await options.modelCatalog.list(provider);
      res.json({
        provider,
        models: sanitizeModels(models)
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(
          "PROCESS_PLEADING_"
        )
      ) {
        const code =
          error.message.split(
            ":",
            1
          )[0]!;
        res.status(
          code ===
            "PROCESS_PLEADING_CASE_REQUIRED"
            ? 422
            : 409
        ).json({
          error: code,
          ...(error.message.includes(":")
            ? {
                detail:
                  error.message.slice(
                    error.message.indexOf(
                      ":"
                    ) + 1
                  )
              }
            : {})
        });
        return;
      }

      if (error instanceof MissingProviderCredentialError) {
        res.status(503).json({
          error: "PROVIDER_NOT_CONFIGURED",
          provider
        });
        return;
      }

      res.status(502).json({
        error: "PROVIDER_MODEL_DISCOVERY_FAILED",
        provider
      });
    }
  });

  const documentBody = express.raw({
    type: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/tiff",
      "text/plain",
      "text/markdown",
      "text/csv",
      "text/tab-separated-values",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroenabled.12"
    ],
    limit: "512mb"
  });

  app.post(
    "/api/documents/ingest",
    documentBody,
    async (req, res) => {
      if (!options.documentService) {
        res.status(503).json({
          error: "DOCUMENT_INGESTION_UNAVAILABLE"
        });
        return;
      }

      const mediaType =
        requestDocumentMediaType(req);
      if (!mediaType) {
        res.status(415).json({
          error: "UNSUPPORTED_DOCUMENT_MEDIA_TYPE"
        });
        return;
      }

      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error: "DOCUMENT_BODY_REQUIRED"
        });
        return;
      }

      try {
        const data = new Uint8Array(req.body);
        let stored:
          StoredUpload | undefined;
        let caseId:
          string | undefined;

        if (options.caseFileStore) {
          caseId =
            req.get("x-lex-case-id")
              ?.trim();
          if (!caseId) {
            res.status(400).json({
              error: "CASE_ID_REQUIRED"
            });
            return;
          }
          const filename =
            decodeUploadFilename(
              req.get(
                "x-lex-filename"
              )
            );
          if (
            options.caseAccessService
          ) {
            const context =
              responseAuthContext(
                res
              );
            options.caseAccessService
              .assertAccess(
                context,
                caseId,
                "WRITE"
              );
            if (
              options
                .secureCaseUploadStore
            ) {
            const securedCaseId =
              caseId;
            const caseView =
              options.caseAccessService
                .openCase(
                  context,
                  securedCaseId
                );
            stored =
              await options
                .caseAccessService
                .withCaseDataKey(
                  context,
                  securedCaseId,
                  "WRITE",
                  async (
                    caseDataKey
                  ) =>
                    await options
                      .secureCaseUploadStore!
                      .saveUpload({
                        caseId:
                          securedCaseId,
                        filename,
                        mediaType,
                        data,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion
                      })
                );
            } else {
              stored =
                await options
                  .caseFileStore
                  .saveUpload({
                    caseId,
                    filename,
                    mediaType,
                    data,
                    extractArchive:
                      false
                  });
            }
          } else {
            stored =
              await options
                .caseFileStore
                .saveUpload({
                  caseId,
                  filename,
                  mediaType,
                  data,
                  extractArchive:
                    false
                });
          }
        }

        let result;
        if (
          caseId &&
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          result =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await ingestDocumentMedia(
                    options
                      .documentService!,
                    data,
                    mediaType,
                    {
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    }
                  )
              );
        } else {
          result =
            await ingestDocumentMedia(
              options
                .documentService,
              data,
              mediaType
            );
        }
        if (stored) {
          documentCaseIds.set(
            result.documentId,
            stored.caseId
          );
        }
        res.status(201).json({
          ...result,
          ...(stored
            ? {
                caseId: stored.caseId,
                uploadId: stored.uploadId
              }
            : {})
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error: "DOCUMENT_INGESTION_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/documents/review",
    documentBody,
    async (req, res) => {
      if (!options.documentService) {
        res.status(503).json({
          error: "DOCUMENT_INGESTION_UNAVAILABLE"
        });
        return;
      }

      const mediaType =
        requestDocumentMediaType(req);
      if (!mediaType) {
        res.status(415).json({
          error: "UNSUPPORTED_DOCUMENT_MEDIA_TYPE"
        });
        return;
      }
      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error: "DOCUMENT_BODY_REQUIRED"
        });
        return;
      }

      try {
        const data =
          new Uint8Array(req.body);
        let stored:
          StoredUpload | undefined;
        let caseId:
          string | undefined;

        if (options.caseFileStore) {
          caseId =
            req.get("x-lex-case-id")
              ?.trim();
          if (!caseId) {
            res.status(400).json({
              error: "CASE_ID_REQUIRED"
            });
            return;
          }
          const filename =
            decodeUploadFilename(
              req.get(
                "x-lex-filename"
              )
            );
          if (
            options.caseAccessService
          ) {
            const context =
              responseAuthContext(
                res
              );
            options.caseAccessService
              .assertAccess(
                context,
                caseId,
                "WRITE"
              );
            if (
              options
                .secureCaseUploadStore
            ) {
            const securedCaseId =
              caseId;
            const caseView =
              options.caseAccessService
                .openCase(
                  context,
                  securedCaseId
                );
            stored =
              await options
                .caseAccessService
                .withCaseDataKey(
                  context,
                  securedCaseId,
                  "WRITE",
                  async (
                    caseDataKey
                  ) =>
                    await options
                      .secureCaseUploadStore!
                      .saveUpload({
                        caseId:
                          securedCaseId,
                        filename,
                        mediaType,
                        data,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion
                      })
                );
            } else {
              stored =
                await options
                  .caseFileStore
                  .saveUpload({
                    caseId,
                    filename,
                    mediaType,
                    data,
                    extractArchive:
                      false
                  });
            }
          } else {
            stored =
              await options
                .caseFileStore
                .saveUpload({
                  caseId,
                  filename,
                  mediaType,
                  data,
                  extractArchive:
                    false
                });
          }
        }

        let result:
          Awaited<
            ReturnType<
              NonNullable<
                LexHttpAppOptions[
                  "documentService"
                ]
              >["review"]
            >
          >;
        if (
          caseId &&
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          result =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .documentService!
                    .review(
                      data,
                      mediaType,
                      {
                        caseId,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion,
                        ...documentProcessingOptions(
                          req.get("x-lex-processing")
                        )
                      }
                    )
              );
        } else {
          result =
            await options
              .documentService
              .review(
                data,
                mediaType,
                caseId
                  ? { caseId }
                  : undefined
              );
        }
        if (stored) {
          documentCaseIds.set(
            result.documentId,
            stored.caseId
          );
        }
        res.status(201).json({
          ...result,
          ...(stored
            ? {
                caseId: stored.caseId,
                uploadId: stored.uploadId
              }
            : {})
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error: "DOCUMENT_REVIEW_FAILED",
            description:
              safeDiagnosticText(
                error
              )
          });
        }
      }
    }
  );

  app.post(
    "/api/documents/:documentId/finalize",
    async (req, res) => {
      if (!options.documentService) {
        res.status(503).json({
          error: "DOCUMENT_INGESTION_UNAVAILABLE"
        });
        return;
      }

      const documentId =
        String(req.params.documentId ?? "")
          .trim();
      const requestedCaseId =
        typeof req.body?.caseId ===
          "string"
          ? req.body.caseId.trim()
          : "";
      const directives =
        parsePrivacyDirectives(
          req.body?.directives
        );
      if (
        !/^doc_[a-f0-9]{24}$/.test(
          documentId
        ) ||
        (
          requestedCaseId &&
          !/^case_[a-f0-9]{32}$/.test(
            requestedCaseId
          )
        ) ||
        directives === null
      ) {
        res.status(400).json({
          error: "INVALID_DOCUMENT_PRIVACY_REQUEST"
        });
        return;
      }

      try {
        let result;
        if (
          options.caseAccessService
        ) {
          const caseId =
            requestedCaseId ||
            documentCaseIds.get(
              documentId
            );
          if (!caseId) {
            throw new CaseAccessError(
              "CASE_ACCESS_DENIED",
              403
            );
          }
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          result =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .documentService!
                    .finalizeReview(
                      documentId,
                      directives,
                      {
                        caseId,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion,
                        ...(progressIdFrom(req.get("x-lex-progress"))
                          ? {
                              onProgress: processingProgress.reporter(
                                caseId,
                                progressIdFrom(req.get("x-lex-progress"))
                              )!
                            }
                          : {})
                      }
                    )
              );
        } else {
          result =
            await options
              .documentService
              .finalizeReview(
                documentId,
                directives
              );
        }
        res.json(result);
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error: "DOCUMENT_PRIVACY_FINALIZATION_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/authoring/aliases",
    async (req, res) => {
      if (
        !options.caseAccessService ||
        !options.documentAuthoringService
      ) {
        res.status(503).json({
          error:
            "DOCUMENT_AUTHORING_UNAVAILABLE"
        });
        return;
      }
      const caseId =
        String(
          req.params.caseId ??
            ""
        );
      const sourceDocumentIds =
        Array.isArray(
          req.body?.sourceDocumentIds
        )
          ? req.body.sourceDocumentIds
              .filter(
                (
                  value:
                    unknown
                ) =>
                  typeof value ===
                    "string"
              )
          : null;
      if (
        !sourceDocumentIds ||
        sourceDocumentIds.length <
          1 ||
        sourceDocumentIds.length >
          99
      ) {
        res.status(400).json({
          error:
            "INVALID_AUTHORING_REQUEST"
        });
        return;
      }

      try {
        const context =
          responseAuthContext(res);
        const view =
          options.caseAccessService
            .openCase(
              context,
              caseId
            );
        const aliases =
          await options
            .caseAccessService
            .withCaseDataKey(
              context,
              caseId,
              "ANALYZE",
              async (
                caseDataKey
              ) =>
                await options
                  .documentAuthoringService!
                  .aliasManifest({
                    caseId,
                    sourceDocumentIds,
                    caseDataKey,
                    keyVersion:
                      view.keyVersion
                  })
            );
        res.json(aliases);
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error:
              error instanceof
                Error
                ? error.message
                : "DOCUMENT_AUTHORING_ALIAS_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/artifacts/generate",
    async (req, res) => {
      if (
        !options.caseAccessService ||
        !options.documentAuthoringService ||
        !options.documentAstGenerator ||
        !options.documentService
      ) {
        res.status(503).json({
          error:
            "DOCUMENT_GENERATION_UNAVAILABLE"
        });
        return;
      }

      const caseId =
        String(
          req.params.caseId ??
            ""
        );
      const sessionRequest =
        parseSessionRequest(
          req.body
        );
      const attachments =
        parseDocumentAttachments(
          req.body?.attachments
        );
      const firmTemplates =
        parseFirmTemplates(
          req.body?.firmTemplates
        );
      // Firm templates and firm files may shape the document; they are not
      // case sources, so they get no aliases.
      const firmCaseId =
        firmTemplates?.length ||
        attachments?.some((selection) => selection.caseId && selection.caseId !== caseId)
          ? options.caseAccessService
              ?.getFirmKnowledgeWorkspace(responseAuthContext(res))
              ?.caseId
          : undefined;
      const format =
        req.body?.format;
      const documentType =
        req.body?.documentType;
      const styleProfile =
        req.body?.styleProfile;
      const templateId =
        typeof req.body
          ?.templateId ===
          "string"
          ? req.body
              .templateId
              .trim()
          : undefined;
      const requestedStyleValid =
        [
          "lex-classic-clean-v1",
          "lex-light-legal-design-v1",
          "lex-classic-tnr-v1"
        ].includes(
          String(
            styleProfile
          )
        );

      if (
        !sessionRequest ||
        attachments === null ||
        (
          format !== "docx" &&
          format !== "odt"
        ) ||
        ![
          "pleading",
          "contract",
          "opinion",
          "letter",
          "report",
          "other"
        ].includes(
          String(
            documentType
          )
        ) ||
        (
          !templateId &&
          !requestedStyleValid
        ) ||
        (
          templateId !==
            undefined &&
          !/^template_[a-f0-9]{32}$/
            .test(
              templateId
            )
        ) ||
        firmTemplates === null ||
        attachments.length + firmTemplates.length > MAX_DOCUMENT_ATTACHMENTS ||
        attachments.some(
          (selection) =>
            Boolean(
              selection.caseId
            ) &&
            selection.caseId !==
              caseId &&
            selection.caseId !==
              firmCaseId
        )
      ) {
        res.status(400).json({
          error:
            "INVALID_DOCUMENT_GENERATION_REQUEST"
        });
        return;
      }

      // A document request in AUTO mode is routed like a chat turn. The
      // document pipeline (workflow, HYBRID-VAL before the file) needs its
      // domain and workflow before it starts, so it keeps the routing pass.
      if (
        !(await resolveAutoPrimarySkill(
          sessionRequest,
          res,
          attachments.length,
          {
            allowModelSelection: false,
            allowConversational: false
          }
        ))
      ) {
        return;
      }

      const route =
        routing.validate(
          sessionRequest
            .primarySkill
        );
      if (!route.valid) {
        res.status(422).json({
          error:
            "INVALID_ROUTE",
          reason:
            route.reason
        });
        return;
      }

      try {
        const context =
          responseAuthContext(
            res
          );
        const caseView =
          options
            .caseAccessService
            .openCase(
              context,
              caseId
            );

        const resolvedAttachments:
          SessionDocumentAttachment[] =
          [];
        const firmSelections = attachments.filter(
          (selection) => firmCaseId !== undefined && selection.caseId === firmCaseId && firmCaseId !== caseId
        );
        for (
          const selection
          of attachments
        ) {
          if (firmSelections.includes(selection)) continue;
          options
            .caseAccessService
            .assertAccess(
              context,
              caseId,
              "ANALYZE"
            );

          if (
            options
              .documentService
              .restoreDocument
          ) {
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "ANALYZE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .documentService!
                    .restoreDocument!({
                      caseId,
                      documentId:
                        selection
                          .documentId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion
                    })
              );
          }

          const resolved =
            await options
              .documentService
              .resolveProtectedChunks({
                documentId:
                  selection
                    .documentId,
                chunkIndices:
                  selection
                    .chunkIndices
              });
          resolvedAttachments.push({
            caseId,
            documentId:
              resolved
                .documentId,
            sourceScope:
              "MANUAL",
            ...(resolved.grammar
              ? { grammar: resolved.grammar }
              : {}),
            ...(resolved.totalPages
              ? { totalPages: resolved.totalPages }
              : {}),
            chunks:
              resolved.chunks.map(
                (chunk) => ({
                  ...chunk
                })
              )
          });
        }

        const sourceDocumentIds =
          [
            ...new Set(
              resolvedAttachments
                .map(
                  (item) =>
                    item.documentId
                )
            )
          ];

        // Documents on the case's shared key: raw tokens in the context and
        // one alias per person (D00); the instruction is pseudonymized with
        // the same key.
        const sharedGeneration =
          sourceDocumentIds.length > 0 && options.documentService.sharedKeyState
            ? await options.caseAccessService.withCaseDataKey(
                context,
                caseId,
                "ANALYZE",
                (caseDataKey) =>
                  options.documentService!.sharedKeyState!({
                    caseId,
                    caseDataKey,
                    keyVersion: caseView.keyVersion
                  })
              )
            : null;
        if (sharedGeneration) {
          for (const attachment of resolvedAttachments) {
            if (sharedGeneration.members.has(attachment.documentId)) attachment.sharedKey = true;
          }
        }

        const aliases =
          sourceDocumentIds.length > 0
            ? await options
                .caseAccessService
                .withCaseDataKey(
                  context,
                  caseId,
                  "ANALYZE",
                  async (
                    caseDataKey
                  ) =>
                    await options
                      .documentAuthoringService!
                      .aliasManifest({
                        caseId,
                        sourceDocumentIds,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      })
                )
            : {
                schemaVersion: 1 as const,
                entries: []
              };

        // Appended after the case sources so their alias prefixes (D01…) stay the same.
        if (firmSelections.length > 0 || firmTemplates.length > 0) {
          const firmMaterial = await resolveSelectedAttachments(res, firmSelections, firmTemplates, firmCaseId);
          if (!firmMaterial) return;
          resolvedAttachments.push(...firmMaterial);
        }

        let effectiveStyleProfile =
          styleProfile as
            | "lex-classic-clean-v1"
            | "lex-light-legal-design-v1"
            | "lex-classic-tnr-v1";
        let templateProfile:
          | Awaited<
              ReturnType<
                NonNullable<
                  typeof options.templateProfileService
                >["resolve"]
              >
            >
          | undefined;

        if (templateId) {
          if (
            !options
              .templateProfileService
          ) {
            res.status(503).json({
              error:
                "TEMPLATE_PROFILE_SERVICE_UNAVAILABLE"
            });
            return;
          }
          templateProfile =
            await options
              .templateProfileService
              .resolve(
                templateId
              );
          effectiveStyleProfile =
            templateProfile
              .styleProfile;
        }

        const generated =
          await options
            .documentAstGenerator
            .generate({
              ...(sharedGeneration && sharedGeneration.members.size > 0
                ? { privacySeed: sharedGeneration.snapshot }
                : {}),
              query:
                sessionRequest
                  .query,
              provider:
                sessionRequest
                  .provider,
              model:
                sessionRequest
                  .model,
              primarySkill:
                sessionRequest
                  .primarySkill,
              mode:
                sessionRequest
                  .mode,
              documentType:
                documentType as
                  | "pleading"
                  | "contract"
                  | "opinion"
                  | "letter"
                  | "report"
                  | "other",
              styleProfile:
                effectiveStyleProfile,
              attachments:
                resolvedAttachments,
              aliases
            });

        if (
          sourceDocumentIds.length ===
            0
        ) {
          const ready =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .documentAuthoringService!
                    .createReady({
                      caseId,
                      createdByUserId:
                        context.user
                          .userId,
                      format,
                      ast:
                        generated.ast,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion,
                      validationContext:
                        generated
                          .validationContext,
                      ...(typeof req
                        .body
                        ?.filename ===
                      "string"
                        ? {
                            filename:
                              req.body
                                .filename
                          }
                        : {})
                    })
              );
          res.status(201).json({
            sessionId:
              generated
                .sessionId,
            artifact:
              ready.artifact,
            format:
              ready.format,
            sha256:
              ready.sha256,
            aliasesUsed: [],
            readyForDownload:
              true,
            ...(templateProfile
              ? {
                  templateProfile
                }
              : {})
          });
          return;
        }

        const tokenized =
          await options
            .caseAccessService
            .withCaseDataKey(
              context,
              caseId,
              "WRITE",
              async (
                caseDataKey
              ) =>
                await options
                  .documentAuthoringService!
                  .createTokenized({
                    caseId,
                    createdByUserId:
                      context.user
                        .userId,
                    format,
                    ast:
                      generated.ast,
                    sourceDocumentIds,
                    caseDataKey,
                    keyVersion:
                      caseView
                        .keyVersion,
                    validationContext:
                      generated
                        .validationContext,
                    ...(typeof req
                      .body
                      ?.filename ===
                    "string"
                      ? {
                          filename:
                            req.body
                              .filename
                        }
                      : {})
                  })
            );

        res.status(201).json({
          sessionId:
            generated
              .sessionId,
          artifact:
            tokenized
              .artifact,
          format:
            tokenized
              .format,
          tokenizedSha256:
            tokenized
              .tokenizedSha256,
          vaultGeneration:
            tokenized
              .vaultGeneration,
          aliasesUsed:
            tokenized
              .aliasesUsed,
          deanonymizationKeyBound:
            tokenized
              .deanonymizationKeyBound,
          readyForDownload:
            false,
          ...(templateProfile
            ? {
                templateProfile
              }
            : {})
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          ) &&
          !(error instanceof
            MissingProviderCredentialError)
        ) {
          res.status(422).json({
            error:
              error instanceof
                Error
                ? error.message
                : "DOCUMENT_GENERATION_FAILED"
          });
          return;
        }
        if (
          error instanceof
            MissingProviderCredentialError
        ) {
          res.status(503).json({
            error:
              "PROVIDER_NOT_CONFIGURED",
            provider:
              error.provider
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId/artifacts/:artifactId/download",
    async (req, res) => {
      if (
        !options.caseAccessService ||
        !options.secureCaseArtifactStore
      ) {
        res.status(503).json({
          error:
            "ARTIFACT_DOWNLOAD_UNAVAILABLE"
        });
        return;
      }

      try {
        const context =
          responseAuthContext(res);
        const caseId =
          String(
            req.params.caseId ??
              ""
          );
        const artifactId =
          String(
            req.params.artifactId ??
              ""
          );

        const view =
          options.caseAccessService
            .openCase(
              context,
              caseId
            );
        options
          .caseAccessService
          .assertAccess(
            context,
            caseId,
            "READ"
          );

        const result =
          await options
            .caseAccessService
            .withCaseDataKey(
              context,
              caseId,
              "ANALYZE",
              async (
                caseDataKey
              ) => {
                const artifacts =
                  await options
                    .secureCaseArtifactStore!
                    .listArtifacts({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        view.keyVersion
                    });
                const artifact =
                  artifacts.find(
                    (item) =>
                      item.artifactId ===
                        artifactId
                  );

                if (
                  !artifact ||
                  artifact.sensitivity !==
                    "PROTECTED" ||
                  (
                    !artifact.filename
                      .toLowerCase()
                      .endsWith(".docx") &&
                    !artifact.filename
                      .toLowerCase()
                      .endsWith(".odt")
                  )
                ) {
                  throw new Error(
                    "GENERATED_ARTIFACT_NOT_DOWNLOADABLE"
                  );
                }

                const data =
                  await options
                    .secureCaseArtifactStore!
                    .readArtifact({
                      caseId,
                      artifactId,
                      caseDataKey,
                      keyVersion:
                        view.keyVersion,
                      maxBytes:
                        64 *
                        1024 *
                        1024
                    });

                return {
                  artifact,
                  data
                };
              }
            );

        res.setHeader(
          "Content-Type",
          result.artifact.mediaType
        );
        res.setHeader(
          "Content-Length",
          String(
            result.data.byteLength
          )
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${result.artifact.filename.replace(/"/g, "")}"`
        );
        res.status(200).send(
          result.data
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error:
              error instanceof Error
                ? error.message
                : "ARTIFACT_DOWNLOAD_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/artifacts/:artifactId/deanonymization-intent",
    async (req, res) => {
      if (
        !options.reauthorizationManager ||
        !options.caseAccessService ||
        !options.documentGenerationState
      ) {
        res.status(503).json({
          error:
            "DEANONYMIZATION_UNAVAILABLE"
        });
        return;
      }
      try {
        const context =
          responseAuthContext(res);
        const caseId =
          String(
            req.params.caseId ??
              ""
          );
        const artifactId =
          String(
            req.params
              .artifactId ??
              ""
          );
        const caseView =
          options.caseAccessService
            .openCase(
              context,
              caseId
            );
        await options
          .caseAccessService
          .withCaseDataKey(
            context,
            caseId,
            "ANALYZE",
            async (
              caseDataKey
            ) =>
              await assertDocumentWorkflowFinalizationAllowed(
                options,
                {
                  caseId,
                  artifactId,
                  caseDataKey,
                  keyVersion:
                    caseView.keyVersion
                }
              )
          );
        const intent =
          await options
            .reauthorizationManager
            .createIntent(
              context,
              caseId,
              artifactId
            );
        res.status(201).json({
          intent: {
            intentId:
              intent.intentId,
            caseId:
              intent.caseId,
            artifactId:
              intent.artifactId,
            artifactFormat:
              intent
                .artifactFormat,
            expiresAt:
              intent.expiresAt,
            status:
              intent.status
          }
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          ) &&
          !sendReauthorizationError(
            res,
            error
          ) &&
          !sendProcessWorkflowError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "DEANONYMIZATION_INTENT_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/deanonymization/reauthorize",
    async (req, res) => {
      if (
        !options.reauthorizationManager
      ) {
        res.status(503).json({
          error:
            "DEANONYMIZATION_UNAVAILABLE"
        });
        return;
      }
      if (
        typeof req.body
          ?.intentId !==
          "string" ||
        typeof req.body
          ?.password !==
          "string"
      ) {
        res.status(400).json({
          error:
            "INVALID_REAUTHORIZATION_REQUEST"
        });
        return;
      }
      try {
        const result =
          await options
            .reauthorizationManager
            .authorizeIntent(
              responseAuthContext(
                res
              ),
              req.body.intentId,
              req.body.password
            );
        res.json({
          grant: {
            grantId:
              result.grant
                .grantId,
            intentId:
              result.grant
                .intentId,
            caseId:
              result.grant
                .caseId,
            artifactId:
              result.grant
                .artifactId,
            artifactFormat:
              result.grant
                .artifactFormat,
            expiresAt:
              result.grant
                .expiresAt
          },
          session:
            result.session
        });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          ) &&
          !sendCaseAccessError(
            res,
            error
          ) &&
          !sendReauthorizationError(
            res,
            error
          ) &&
          !sendProcessWorkflowError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "DEANONYMIZATION_REAUTH_FAILED"
          });
        }
      }
    }
  );

  // Review step: restored values with their source, before the one-time
  // final document is written. Needs the same fresh password grant.
  app.post(
    "/api/deanonymization/preview",
    async (req, res) => {
      if (
        !options.reauthorizationManager?.previewGrant ||
        !options.documentAuthoringService?.previewDeanonymization ||
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "DEANONYMIZATION_UNAVAILABLE"
        });
        return;
      }
      if (typeof req.body?.grantId !== "string") {
        res.status(400).json({
          error:
            "INVALID_DEANONYMIZATION_REQUEST"
        });
        return;
      }
      try {
        const context =
          responseAuthContext(res);
        const target =
          await options.reauthorizationManager.previewGrant(
            context,
            req.body.grantId
          );
        const preview =
          await options.caseAccessService.withCaseDataKey(
            context,
            target.caseId,
            "REIDENTIFY",
            (caseDataKey) =>
              options.documentAuthoringService!.previewDeanonymization!({
                target,
                caseDataKey,
                keyVersion:
                  target.caseKeyVersion
              })
          );
        res.setHeader("Cache-Control", "no-store");
        res.json(preview);
      } catch (error) {
        if (
          !sendCaseAccessError(res, error) &&
          !sendReauthorizationError(res, error)
        ) {
          res.status(422).json({
            error:
              error instanceof Error
                ? error.message
                : "DEANONYMIZATION_PREVIEW_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/deanonymization/finalize",
    async (req, res) => {
      if (
        !options.reauthorizationManager ||
        !options.documentAuthoringService ||
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "DEANONYMIZATION_UNAVAILABLE"
        });
        return;
      }
      if (
        typeof req.body
          ?.grantId !==
          "string"
      ) {
        res.status(400).json({
          error:
            "INVALID_DEANONYMIZATION_REQUEST"
        });
        return;
      }

      const rawOverrides =
        req.body?.overrides;
      if (
        rawOverrides !== undefined &&
        (
          !rawOverrides ||
          typeof rawOverrides !== "object" ||
          Array.isArray(rawOverrides) ||
          Object.keys(rawOverrides).length > 500 ||
          Object.values(rawOverrides).some(
            (value) => typeof value !== "string"
          )
        )
      ) {
        res.status(400).json({
          error:
            "INVALID_DEANONYMIZATION_REQUEST"
        });
        return;
      }
      const overrides =
        rawOverrides as
          | Record<string, string>
          | undefined;

      try {
        const context =
          responseAuthContext(res);
        // Consume before CDK unwrap / vault access.
        const target =
          await options
            .reauthorizationManager
            .consumeGrant(
              context,
              req.body.grantId
            );
        const final =
          await options
            .caseAccessService
            .withCaseDataKey(
              context,
              target.caseId,
              "REIDENTIFY",
              async (
                caseDataKey
              ) => {
                await assertDocumentWorkflowFinalizationAllowed(
                  options,
                  {
                    caseId:
                      target.caseId,
                    artifactId:
                      target.artifactId,
                    caseDataKey,
                    keyVersion:
                      target
                        .caseKeyVersion
                  }
                );
                return await options
                  .documentAuthoringService!
                  .deanonymizeConsumed({
                    target,
                    createdByUserId:
                      context.user
                        .userId,
                    caseDataKey,
                    keyVersion:
                      target
                        .caseKeyVersion,
                    ...(typeof req
                      .body
                      ?.filename ===
                    "string"
                      ? {
                          filename:
                            req.body
                              .filename
                        }
                      : {}),
                    ...(overrides
                      ? { overrides }
                      : {})
                  });
              }
            );
        const downloadTicket =
          options
            .sensitiveDownloadTickets
            ?.issue(
              context,
              {
                caseId:
                  target.caseId,
                artifactId:
                  final.artifact
                    .artifactId,
                finalSha256:
                  final.sha256
              }
            );
        res.status(201).json({
          artifact:
            final.artifact,
          format:
            final.format,
          sha256:
            final.sha256,
          replacements:
            final.replacements,
          deanonymizationBasis:
            final
              .deanonymizationBasis,
          ...(final.restorations
            ? { restorations: final.restorations }
            : {}),
          keyBindingVerified:
            final
              .keyBindingVerified,
          ...(downloadTicket
            ? {
                downloadTicket
              }
            : {})
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          ) &&
          !sendReauthorizationError(
            res,
            error
          ) &&
          !sendProcessWorkflowError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error:
              error instanceof
                Error
                ? error.message
                : "DEANONYMIZATION_FINALIZE_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/sensitive-download/:ticketId",
    async (req, res) => {
      if (
        !options.sensitiveDownloadTickets ||
        !options.secureCaseArtifactStore ||
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "SENSITIVE_DOWNLOAD_UNAVAILABLE"
        });
        return;
      }

      try {
        const context =
          responseAuthContext(res);
        // Consume before CDK unwrap / artifact decryption.
        const ticket =
          options
            .sensitiveDownloadTickets
            .consume(
              context,
              String(
                req.params
                  .ticketId ??
                  ""
              )
            );
        const payload =
          await options
            .caseAccessService
            .withCaseDataKey(
              context,
              ticket.caseId,
              "REIDENTIFY",
              async (
                caseDataKey
              ) => {
                const view =
                  options
                    .caseAccessService!
                    .openCase(
                      context,
                      ticket
                        .caseId
                    );
                const artifacts =
                  await options
                    .secureCaseArtifactStore!
                    .listArtifacts({
                      caseId:
                        ticket.caseId,
                      caseDataKey,
                      keyVersion:
                        view
                          .keyVersion
                    });
                const artifact =
                  artifacts.find(
                    (item) =>
                      item.artifactId ===
                        ticket
                          .artifactId
                  );
                if (
                  !artifact ||
                  artifact.sensitivity !==
                    "CLEAR_PII" ||
                  artifact.sha256 !==
                    ticket.finalSha256
                ) {
                  throw new Error(
                    "FINAL_ARTIFACT_NOT_DOWNLOADABLE"
                  );
                }
                const data =
                  await options
                    .secureCaseArtifactStore!
                    .readArtifact({
                      caseId:
                        ticket.caseId,
                      artifactId:
                        ticket
                          .artifactId,
                      caseDataKey,
                      keyVersion:
                        view
                          .keyVersion,
                      maxBytes:
                        64 *
                        1024 *
                        1024
                    });
                const sha =
                  createHash(
                    "sha256"
                  )
                    .update(data)
                    .digest("hex");
                if (
                  sha !==
                    ticket
                      .finalSha256
                ) {
                  data.fill(0);
                  throw new Error(
                    "FINAL_ARTIFACT_HASH_MISMATCH"
                  );
                }
                return {
                  artifact,
                  data
                };
              }
            );

        res.setHeader(
          "Content-Type",
          payload.artifact
            .mediaType
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename*=UTF-8''${encodeURIComponent(
            payload.artifact
              .filename
          )}`
        );
        res.setHeader(
          "Cache-Control",
          "no-store"
        );
        res.setHeader(
          "X-Content-Type-Options",
          "nosniff"
        );
        try {
          res.send(
            payload.data
          );
        } finally {
          payload.data.fill(0);
        }
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          const message =
            error instanceof
              Error
              ? error.message
              : "SENSITIVE_DOWNLOAD_FAILED";
          const status =
            message.includes(
              "TICKET"
            )
              ? 409
              : 422;
          res.status(status)
            .json({
              error:
                message
            });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId/workflow-audits/:artifactId",
    async (req, res) => {
      if (
        !options.caseAccessService ||
        !options
          .secureCaseArtifactStore
      ) {
        res.status(503).json({
          error:
            "WORKFLOW_AUDIT_UNAVAILABLE"
        });
        return;
      }

      const caseId =
        String(
          req.params.caseId ??
            ""
        );
      const artifactId =
        String(
          req.params
            .artifactId ??
            ""
        );
      if (
        !/^case_[a-f0-9]{32}$/.test(
          caseId
        ) ||
        !/^artifact_[a-f0-9]{32}$/.test(
          artifactId
        )
      ) {
        res.status(400).json({
          error:
            "WORKFLOW_AUDIT_ID_INVALID"
        });
        return;
      }

      try {
        const context =
          responseAuthContext(res);
        const view =
          options
            .caseAccessService
            .openCase(
              context,
              caseId
            );

        const result =
          await options
            .caseAccessService
            .withCaseDataKey(
              context,
              caseId,
              "ANALYZE",
              async (
                caseDataKey
              ) => {
                const artifacts =
                  await options
                    .secureCaseArtifactStore!
                    .listArtifacts({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        view.keyVersion
                    });
                const artifact =
                  artifacts.find(
                    (item) =>
                      item.artifactId ===
                        artifactId &&
                      item.sensitivity ===
                        "PROTECTED" &&
                      item.mediaType ===
                        "application/vnd.lexmachina.workflow-audit+json"
                  );
                if (!artifact) {
                  throw new Error(
                    "WORKFLOW_AUDIT_NOT_FOUND"
                  );
                }

                const data =
                  await options
                    .secureCaseArtifactStore!
                    .readArtifact({
                      caseId,
                      artifactId,
                      caseDataKey,
                      keyVersion:
                        view.keyVersion,
                      maxBytes:
                        2 *
                        1024 *
                        1024
                    });
                try {
                  const digest =
                    createHash(
                      "sha256"
                    )
                      .update(data)
                      .digest(
                        "hex"
                      );
                  if (
                    digest !==
                    artifact.sha256
                  ) {
                    throw new Error(
                      "WORKFLOW_AUDIT_HASH_MISMATCH"
                    );
                  }
                  const audit =
                    parseWorkflowAuditArtifact(
                      data
                    );
                  if (
                    audit.caseId !==
                      caseId
                  ) {
                    throw new Error(
                      "WORKFLOW_AUDIT_CASE_MISMATCH"
                    );
                  }
                  return {
                    artifactId,
                    sha256:
                      artifact.sha256,
                    createdAt:
                      artifact.createdAt,
                    audit
                  };
                } finally {
                  data.fill(0);
                }
              }
            );

        res.setHeader(
          "Cache-Control",
          "no-store"
        );
        res.json(result);
      } catch (error) {
        if (
          sendCaseAccessError(
            res,
            error
          )
        ) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "WORKFLOW_AUDIT_READ_FAILED";
        const status =
          message ===
            "WORKFLOW_AUDIT_NOT_FOUND"
            ? 404
            : message ===
                "WORKFLOW_AUDIT_HASH_MISMATCH" ||
              message ===
                "WORKFLOW_AUDIT_CASE_MISMATCH" ||
              message ===
                "WORKFLOW_AUDIT_ARTIFACT_INVALID" ||
              message ===
                "WORKFLOW_AUDIT_ARTIFACT_SIZE_INVALID"
              ? 409
              : 422;
        res.status(status).json({
          error: message
        });
      }
    }
  );

  // Live drafts of running executions, polled by the UI so the answer appears
  // while it is generated. Owner-bound, in memory only, short-lived.
  const executionDrafts =
    new Map<string, {
      owner: string;
      text: string;
      updatedAt: number;
      steps: ExecutionSteps;
    }>();
  const draftOwner = (
    res: Response
  ): string =>
    options.authService
      ? responseAuthContext(res)
          .session.sessionId
      : "local";
  const pruneExecutionDrafts = () => {
    const now = Date.now();
    for (const [id, entry] of executionDrafts) {
      if (now - entry.updatedAt > EXECUTION_DRAFT_TTL_MS) {
        executionDrafts.delete(id);
      }
    }
    while (executionDrafts.size > EXECUTION_DRAFT_MAX_ENTRIES) {
      const oldest =
        executionDrafts.keys().next().value;
      if (oldest === undefined) break;
      executionDrafts.delete(oldest);
    }
  };

  app.get(
    "/api/sessions/progress/:executionId",
    (req, res) => {
      const entry =
        executionDrafts.get(
          String(req.params.executionId ?? "")
        );
      if (
        !entry ||
        entry.owner !== draftOwner(res)
      ) {
        res.status(404).json({
          error:
            "EXECUTION_PROGRESS_NOT_FOUND"
        });
        return;
      }
      res.set("Cache-Control", "no-store");
      res.json({
        text: entry.text,
        updatedAt:
          new Date(entry.updatedAt).toISOString(),
        steps: entry.steps.snapshot()
      });
    }
  );

  // Documents the user picked for a message (case files, firm files, firm
  // templates), resolved with access checks. Used to send them and to
  // estimate whether they fit the model before sending. Null: response sent.
  const templateTextCache = new Map<string, ReturnType<typeof templateChunks>>();
  const resolveSelectedAttachments = async (
    res: express.Response,
    attachments: Array<DocumentChunkSelection & { caseId?: string }>,
    firmTemplates: string[],
    firmCaseId: string | undefined,
    evidence?: EvidencePolicy
  ): Promise<SessionDocumentAttachment[] | null> => {
    const picked: SessionDocumentAttachment[] = [];
    if (attachments.length > 0) {
      if (!options.documentService) {
        res.status(503).json({
          error:
            "DOCUMENT_ATTACHMENT_SERVICE_UNAVAILABLE"
        });
        return null;
      }

      if (
        options.caseAccessService
      ) {
        const context =
          responseAuthContext(res);
        for (
          const selection
          of attachments
        ) {
          const caseId =
            selection.caseId ||
            documentCaseIds.get(
              selection.documentId
            );
          if (!caseId) {
            throw new CaseAccessError(
              "CASE_ACCESS_DENIED",
              403
            );
          }
          options.caseAccessService
            .assertAccess(
              context,
              caseId,
              "ANALYZE"
            );

          if (
            options
              .documentService
              .restoreDocument
          ) {
            const caseView =
              options.caseAccessService
                .openCase(
                  context,
                  caseId
                );
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "ANALYZE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .documentService!
                    .restoreDocument!({
                      caseId,
                      documentId:
                        selection
                          .documentId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion
                    })
              );
          }

          const resolved =
            await options
              .documentService!
              .resolveProtectedChunks({
                documentId:
                  selection
                    .documentId,
                chunkIndices:
                  selection
                    .chunkIndices
              }, evidence ? { images: evidence } : {});
          picked.push({
            caseId,
            documentId:
              resolved.documentId,
            sourceScope:
              caseId === firmCaseId
                ? "FIRM_KNOWLEDGE"
                : "MANUAL",
            selectedByUser: true,
            ...(resolved.grammar
              ? { grammar: resolved.grammar }
              : {}),
            ...(resolved.totalPages
              ? { totalPages: resolved.totalPages }
              : {}),
            ...(resolved.images ? { images: resolved.images } : {}),
            chunks:
              resolved.chunks.map(
                (chunk) => ({
                  ...chunk
                })
              )
          });
        }
      } else {
        const resolved =
          await Promise.all(
            attachments.map(
              (selection) =>
                options
                  .documentService!
                  .resolveProtectedChunks({
                    documentId:
                      selection
                        .documentId,
                    chunkIndices:
                      selection
                        .chunkIndices
                  }, evidence ? { images: evidence } : {})
            )
          );
        picked.push(
          ...resolved.map(
            (attachment) => ({
              documentId:
                attachment.documentId,
              sourceScope:
                "MANUAL" as const,
              selectedByUser: true,
              ...(attachment.grammar
                ? { grammar: attachment.grammar }
                : {}),
              ...(attachment.totalPages
                ? { totalPages: attachment.totalPages }
                : {}),
              ...(attachment.images ? { images: attachment.images } : {}),
              chunks:
                attachment.chunks.map(
                  (chunk) => ({
                    ...chunk
                  })
                )
            })
          )
        );
      }
    }

    if (firmTemplates.length > 0) {
      if (
        !firmCaseId ||
        !options.caseAccessService ||
        !options.sharedTemplateStore?.readTemplate ||
        !options.officeEditor
      ) {
        res.status(503).json({
          error: "FIRM_TEMPLATES_UNAVAILABLE"
        });
        return null;
      }
      options.caseAccessService.assertAccess(
        responseAuthContext(res),
        firmCaseId,
        "READ"
      );
      for (const templateId of firmTemplates) {
        const template =
          await options.sharedTemplateStore.readTemplate(templateId);
        try {
          // Text of a template is read once per file version (checked while picking, then sent).
          const cacheKey = `${templateId}:${template.manifest.sha256}`;
          let chunks = templateTextCache.get(cacheKey);
          if (!chunks) {
            const model = await options.officeEditor.read(
              new Uint8Array(template.data),
              template.manifest.mediaType
            );
            chunks = templateChunks(templateText(model));
            templateTextCache.set(cacheKey, chunks);
            if (templateTextCache.size > 32) {
              templateTextCache.delete(templateTextCache.keys().next().value!);
            }
          }
          picked.push({
            caseId: firmCaseId,
            documentId: templateId,
            title: template.manifest.filename,
            sourceScope: "FIRM_TEMPLATE",
            selectedByUser: true,
            chunks: chunks.map((chunk) => ({ ...chunk }))
          });
        } finally {
          template.data.fill(0);
        }
      }
    }

    return picked;
  };

  // Checked while the user picks files: do they fit the chosen model?
  app.post("/api/sessions/document-fit", async (req, res) => {
    const attachments = parseDocumentAttachments(req.body?.attachments);
    const firmTemplates = parseFirmTemplates(req.body?.firmTemplates);
    const model = typeof req.body?.model === "string" ? req.body.model.trim() : "";
    const provider = typeof req.body?.provider === "string" ? req.body.provider : "";
    if (attachments === null || firmTemplates === null || !model || model.length > 200) {
      res.status(400).json({ error: "INVALID_DOCUMENT_FIT_REQUEST" });
      return;
    }
    const localWindow = options.modelCatalog.localContextWindow?.(model);
    const limit = localWindow !== undefined ? LOCAL_MAX_DOCUMENT_ATTACHMENTS : MAX_DOCUMENT_ATTACHMENTS;
    const count = attachments.length + firmTemplates.length;
    if (count === 0 || count > limit) {
      res.json({ limit, local: localWindow !== undefined, count, estimate: null });
      return;
    }
    try {
      const firmCaseId = options.caseAccessService
        ?.getFirmKnowledgeWorkspace(responseAuthContext(res))
        ?.caseId;
      const picked = await resolveSelectedAttachments(res, attachments, firmTemplates, firmCaseId);
      if (!picked) return;
      const charsPerToken = localWindow !== undefined
        ? options.modelCatalog.localTokenCharsPerToken?.(model)
        : undefined;
      res.json({
        limit,
        local: localWindow !== undefined,
        count,
        estimate: estimateDocumentFit({
          attachments: picked,
          modelContextTokens: localWindow ?? HOSTED_CONTEXT_TOKENS[provider] ?? 128_000,
          ...(charsPerToken ? { tokenCharsPerToken: charsPerToken } : {})
        })
      });
    } catch (error) {
      if (!sendAuthError(res, error) && !sendCaseAccessError(res, error)) {
        res.status(422).json({ error: "DOCUMENT_FIT_FAILED" });
      }
    }
  });

  app.post("/api/sessions/execute", async (req, res) => {
    if (!options.sessionExecutor) {
      res.status(503).json({
        error: "SESSION_EXECUTION_UNAVAILABLE"
      });
      return;
    }

    const request = parseSessionRequest(req.body);
    const attachments =
      parseDocumentAttachments(
        req.body?.attachments
      );
    const knowledge =
      parseSessionKnowledgeRequest(
        req.body?.knowledge
      );
    const firmTemplates =
      parseFirmTemplates(
        req.body?.firmTemplates
      );
    if (
      !request ||
      attachments === null ||
      knowledge === null ||
      firmTemplates === null
    ) {
      res.status(400).json({
        error: "INVALID_SESSION_REQUEST"
      });
      return;
    }
    const localModel =
      options.modelCatalog.localContextWindow?.(request.model) !== undefined;
    const documentLimit = localModel
      ? LOCAL_MAX_DOCUMENT_ATTACHMENTS
      : MAX_DOCUMENT_ATTACHMENTS;
    if (attachments.length + firmTemplates.length > documentLimit) {
      res.status(422).json({
        error: "TOO_MANY_DOCUMENT_ATTACHMENTS",
        limit: documentLimit
      });
      return;
    }

    if (
      knowledge.caseId
    ) {
      request.accountSessionKey =
        knowledge.caseId;
    }

    const executionId =
      String(
        req.get("x-lex-execution-id") ?? ""
      );
    if (
      EXECUTION_ID_PATTERN.test(
        executionId
      )
    ) {
      const owner =
        draftOwner(res);
      pruneExecutionDrafts();
      executionDrafts.set(
        executionId,
        {
          owner,
          text: "",
          updatedAt: Date.now(),
          steps: new ExecutionSteps()
        }
      );
      request.onStep = (phase, detail) => {
        const entry = executionDrafts.get(executionId);
        if (entry && entry.owner === owner) {
          entry.steps.report(phase, detail);
          entry.updatedAt = Date.now();
        }
      };
      request.onStep("PREPARE", "przygotowanie wiadomości");
      request.onDraft = (text) => {
        const entry =
          executionDrafts.get(
            executionId
          );
        if (entry && entry.owner === owner) {
          entry.text =
            text.slice(-EXECUTION_DRAFT_MAX_CHARS);
          entry.updatedAt = Date.now();
        }
      };
      res.on("finish", () => {
        executionDrafts.delete(
          executionId
        );
      });
    }

    const trivialChat =
      applyTrivialChatGate(
        options.registry,
        request,
        attachments.length + firmTemplates.length
      );
    // Entry gate: how much of the legal system this message needs.
    const entryEnvelope =
      parseSkillSelectionEnvelope(request.query);
    const complexity =
      assessMatterComplexity({
        query: entryEnvelope.query,
        attachmentCount:
          attachments.length + firmTemplates.length,
        workflowPinned:
          !trivialChat &&
          (
            entryEnvelope.workflowExecutionSkill !== null ||
            entryEnvelope.manualSkills.length > 0
          )
      });
    request.matterComplexity = complexity;
    const localSimple =
      complexity.level === "SIMPLE" &&
      request.model.startsWith("local/");
    if (trivialChat || localSimple) {
      // No case passages for a greeting; for a simple question on a local
      // model they would cost minutes of prompt reading (selected files
      // still make the matter STANDARD).
      knowledge.includeCase = false;
      knowledge.includeFirm = false;
    }
    request.onStep?.(
      "PREPARE",
      `ocena sprawy: ${describeMatterComplexity(complexity)}`
    );
    request.onStep?.(
      "ROUTING",
      trivialChat
        ? "krótkie polecenie: bez skilli prawnych i workflow"
        : request.primarySkill === "AUTO"
          ? "prawny-router-v3: wybór dziedziny"
          : `wybrany skill ${request.primarySkill}`
    );
    if (
      !trivialChat &&
      !(await resolveAutoPrimarySkill(
        request,
        res,
        attachments.length,
        {
          allowModelSelection: true,
          allowConversational: true
        }
      ))
    ) {
      return;
    }

    const route = routing.validate(request.primarySkill);
    if (!route.valid) {
      res.status(422).json({
        error: "INVALID_ROUTE",
        reason: route.reason
      });
      return;
    }

    if (options.authService) {
      const actor =
        responseAuthContext(res);
      const preferences =
        options.authService
          .getModelRoutingPreferences(
            actor
          );
      request.auxiliaryRouting = {
        enabled:
          preferences
            .auxiliaryEnabled,
        provider:
          preferences
            .auxiliaryProvider,
        model:
          preferences
            .auxiliaryModel
      };

      if (
        request.primarySkill ===
          "przewodnik-prawny-v2"
      ) {
        if (
          !options.guideSessionStore
        ) {
          res.status(503).json({
            error:
              "GUIDE_SESSION_STATE_UNAVAILABLE"
          });
          return;
        }
        let guide =
          options.guideSessionStore
            .get(
              actor.session
                .sessionId
            ) ??
          options.guideSessionStore
            .initialize(
              actor.session
                .sessionId,
              request.mode
            );
        if (
          guide.audience !==
            request.mode
        ) {
          guide =
            options.guideSessionStore
              .transition({
                sessionId:
                  actor.session
                    .sessionId,
                expectedRevision:
                  guide.revision,
                transition: {
                  type:
                    "SET_AUDIENCE",
                  audience:
                    request.mode
                }
              });
        }
        request.guideContext = {
          revision:
            guide.revision,
          audience:
            guide.audience,
          interactionMode:
            guide
              .interactionMode,
          rawAnalysis:
            guide.rawAnalysis,
          step: guide.step,
          guidedQuestionIndex:
            guide
              .guidedQuestionIndex,
          pendingIrreversibleAction:
            guide
              .pendingIrreversibleAction
              ? {
                  ...guide
                    .pendingIrreversibleAction
                }
              : null
        };
      }
    }

    try {
      const sessionAttachments:
        SessionDocumentAttachment[] = [];
      // The firm workspace: its documents are firm material, not case files.
      const firmCaseId =
        attachments.length > 0 || firmTemplates.length > 0
          ? options.caseAccessService
              ?.getFirmKnowledgeWorkspace(responseAuthContext(res))
              ?.caseId
          : undefined;

      const selectedAttachments =
        await resolveSelectedAttachments(
          res,
          attachments,
          firmTemplates,
          firmCaseId,
          evidencePolicyFor(req.body?.evidenceImages, request.model)
        );
      if (!selectedAttachments) return;
      sessionAttachments.push(...selectedAttachments);

      if (
        knowledge.includeCase ||
        knowledge.includeFirm
      ) {
        if (
          !options.caseAccessService ||
          !options.caseKnowledgeSearch
        ) {
          res.status(503).json({
            error:
              "CASE_KNOWLEDGE_UNAVAILABLE"
          });
          return;
        }

        const context =
          responseAuthContext(res);
        const knowledgeSources:
          Array<{
            caseId: string;
            sourceScope:
              | "CASE_KNOWLEDGE"
              | "FIRM_KNOWLEDGE";
          }> = [];

        if (
          knowledge.includeCase &&
          knowledge.caseId
        ) {
          knowledgeSources.push({
            caseId:
              knowledge.caseId,
            sourceScope:
              "CASE_KNOWLEDGE"
          });
        }

        if (
          knowledge.includeFirm
        ) {
          const firm =
            options.caseAccessService
              .getFirmKnowledgeWorkspace(
                context
              );
          if (!firm) {
            throw new CaseAccessError(
              "CASE_ACCESS_DENIED",
              403
            );
          }
          knowledgeSources.push({
            caseId:
              firm.caseId,
            sourceScope:
              "FIRM_KNOWLEDGE"
          });
        }

        const ranked:
          Array<{
            caseId: string;
            sourceScope:
              | "CASE_KNOWLEDGE"
              | "FIRM_KNOWLEDGE";
            documentId: string;
            chunkIndex: number;
            pageStart: number;
            pageEnd: number;
            score: number;
            text: string;
          }> = [];

        for (
          const source
          of knowledgeSources
        ) {
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                source.caseId
              );
          const hits =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                source.caseId,
                "ANALYZE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .caseKnowledgeSearch!
                    .search({
                      caseId:
                        source.caseId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion,
                      query:
                        request.query,
                      limit:
                        knowledge.limit
                    })
              );
          ranked.push(
            ...hits.map(
              (hit) => ({
                ...hit,
                sourceScope:
                  source.sourceScope
              })
            )
          );
        }

        ranked.sort(
          (left, right) =>
            right.score -
              left.score ||
            left.caseId
              .localeCompare(
                right.caseId
              ) ||
            left.documentId
              .localeCompare(
                right.documentId
              ) ||
            left.chunkIndex -
              right.chunkIndex
        );

        const selected =
          ranked.slice(
            0,
            knowledge.limit
          );
        const grouped =
          new Map<
            string,
            SessionDocumentAttachment
          >();

        for (
          const hit
          of selected
        ) {
          const key =
            [
              hit.sourceScope,
              hit.caseId,
              hit.documentId
            ].join(":");
          let attachment =
            grouped.get(key);
          if (!attachment) {
            if (
              sessionAttachments.length +
                grouped.size >=
              4
            ) {
              continue;
            }
            attachment = {
              caseId:
                hit.caseId,
              documentId:
                hit.documentId,
              sourceScope:
                hit.sourceScope,
              chunks: []
            };
            grouped.set(
              key,
              attachment
            );
          }
          attachment.chunks.push({
            index:
              hit.chunkIndex,
            pageStart:
              hit.pageStart,
            pageEnd:
              hit.pageEnd,
            text:
              hit.text
          });
        }

        // Retrieved passages fill what the selected documents leave free.
        sessionAttachments.push(
          ...[...grouped.values()].slice(
            0,
            Math.max(0, documentLimit - sessionAttachments.length)
          )
        );
      }

      // Documents of one case on its shared key: the message is pseudonymized
      // with the same key, so a person has one symbol in the message and in
      // every attached document.
      const attachmentCases = [
        ...new Set(
          sessionAttachments
            .map((attachment) => attachment.caseId)
            .filter((value): value is string => Boolean(value) && value !== firmCaseId)
        )
      ];
      if (
        attachmentCases.length === 1 &&
        options.caseAccessService &&
        options.documentService?.sharedKeyState
      ) {
        const sharedCaseId = attachmentCases[0]!;
        const context = responseAuthContext(res);
        const caseView = options.caseAccessService.openCase(context, sharedCaseId);
        const shared = await options.caseAccessService.withCaseDataKey(
          context,
          sharedCaseId,
          "ANALYZE",
          (caseDataKey) =>
            options.documentService!.sharedKeyState!({
              caseId: sharedCaseId,
              caseDataKey,
              keyVersion: caseView.keyVersion
            })
        );
        if (shared && shared.members.size > 0) {
          request.privacySeed = shared.snapshot;
          for (const attachment of sessionAttachments) {
            if (attachment.caseId === sharedCaseId && shared.members.has(attachment.documentId)) {
              attachment.sharedKey = true;
            }
          }
        }
      }

      if (
        sessionAttachments.length >
          0
      ) {
        request.documentAttachments =
          sessionAttachments;
      }

      const localContextWindow =
        options.modelCatalog
          .localContextWindow?.(
            request.model
          );
      if (!localContextWindow && sessionAttachments.length > 0) {
        request.modelContextTokens =
          HOSTED_CONTEXT_TOKENS[request.provider] ?? 128_000;
      }
      if (localContextWindow) {
        request.modelContextTokens =
          localContextWindow;
        const localTokenCharsPerToken =
          options.modelCatalog
            .localTokenCharsPerToken?.(
              request.model
            );
        if (
          localTokenCharsPerToken
        ) {
          request.tokenCharsPerToken =
            localTokenCharsPerToken;
        }
      }

      const previewPlan =
        previewSessionWorkflow(
          options.registry,
          request
        );
      let processContext:
        | {
            caseId: string;
            permit: ProcessExecutionPermit;
            state: ProcessPleadingState;
          }
        | null = null;

      if (
        previewPlan.id ===
          "PROCESS_PLEADING_V1"
      ) {
        if (
          !options.caseAccessService ||
          !options.processWorkflowStore
        ) {
          res.status(503).json({
            error:
              "PROCESS_PLEADING_STATE_SERVICE_UNAVAILABLE"
          });
          return;
        }

        const nonFirmCaseIds =
          new Set(
            sessionAttachments
              .filter(
                (attachment) =>
                  !isFirmScope(attachment.sourceScope)
              )
              .map(
                (attachment) =>
                  attachment.caseId
              )
              .filter(
                (caseId):
                  caseId is string =>
                    Boolean(caseId)
              )
          );
        const processCaseId =
          knowledge.caseId ??
          (
            nonFirmCaseIds.size === 1
              ? [
                  ...nonFirmCaseIds
                ][0]
              : undefined
          );
        if (!processCaseId) {
          throw new Error(
            "PROCESS_PLEADING_CASE_REQUIRED"
          );
        }

        const actor =
          responseAuthContext(res);
        options.caseAccessService
          .assertAccess(
            actor,
            processCaseId,
            "WRITE"
          );
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              processCaseId
            );
        const state =
          await options
            .caseAccessService
            .withCaseDataKey(
              actor,
              processCaseId,
              "WRITE",
              async (
                caseDataKey
              ) => {
                const current =
                  await options
                    .processWorkflowStore!
                    .getProcessPleadingState({
                      caseId:
                        processCaseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (!current) {
                  return null;
                }

                let inventory:
                  ProcessEvidenceInventory = {
                    fileCount: null,
                    complete: false,
                    source:
                      "UNAVAILABLE"
                  };

                if (
                  options
                    .secureCaseUploadStore
                ) {
                  const uploads =
                    await options
                      .secureCaseUploadStore
                      .listUploads({
                        caseId:
                          processCaseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                  inventory =
                    evidenceInventoryFromUploads(
                      uploads,
                      "ENCRYPTED_CASE_UPLOADS"
                    );
                } else if (
                  options
                    .caseFileStore
                    ?.listUploads
                ) {
                  const uploads =
                    await options
                      .caseFileStore
                      .listUploads(
                        processCaseId
                      );
                  inventory =
                    evidenceInventoryFromUploads(
                      uploads,
                      "LEGACY_CASE_UPLOADS"
                    );
                }

                const applicability =
                  applyDeterministicProcessApplicability(
                    current,
                    inventory
                  );

                if (
                  applicability.state
                    .revision ===
                  current.revision
                ) {
                  return current;
                }

                return await options
                  .processWorkflowStore!
                  .saveProcessPleadingState({
                    caseId:
                      processCaseId,
                    caseDataKey,
                    keyVersion:
                      caseView
                        .keyVersion,
                    state:
                      applicability.state,
                    expectedRevision:
                      current.revision
                  });
              }
            );
        const permit =
          requireProcessExecutionPermit(
            state
          );
        request.processWorkflowContext = {
          stage: permit.stage,
          checkpoint:
            permit.checkpoint,
          mode: permit.mode
        };
        processContext = {
          caseId:
            processCaseId,
          permit,
          state: state!
        };
      }

      let courtContext:
        | {
            caseId: string;
            permit:
              CourtAnalysisExecutionPermit;
            state:
              CourtAnalysisState;
          }
        | null = null;

      if (
        previewPlan.id ===
          "COURT_ANALYSIS_V1"
      ) {
        if (
          !options.caseAccessService ||
          !options
            .courtAnalysisWorkflowStore
        ) {
          res.status(503).json({
            error:
              "COURT_ANALYSIS_STATE_SERVICE_UNAVAILABLE"
          });
          return;
        }

        const nonFirmCaseIds =
          new Set(
            sessionAttachments
              .filter(
                (attachment) =>
                  !isFirmScope(attachment.sourceScope)
              )
              .map(
                (attachment) =>
                  attachment.caseId
              )
              .filter(
                (
                  caseId
                ): caseId is string =>
                  Boolean(caseId)
              )
          );
        const courtCaseId =
          knowledge.caseId ??
          (
            nonFirmCaseIds.size === 1
              ? [
                  ...nonFirmCaseIds
                ][0]
              : undefined
          );
        if (!courtCaseId) {
          throw new Error(
            "COURT_ANALYSIS_CASE_REQUIRED"
          );
        }

        const actor =
          responseAuthContext(res);
        options.caseAccessService
          .assertAccess(
            actor,
            courtCaseId,
            "WRITE"
          );
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              courtCaseId
            );
        const state =
          await options
            .caseAccessService
            .withCaseDataKey(
              actor,
              courtCaseId,
              "WRITE",
              async (
                caseDataKey
              ) => {
                const current =
                  await options
                    .courtAnalysisWorkflowStore!
                    .getCourtAnalysisState({
                      caseId:
                        courtCaseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (current) {
                  return current;
                }
                return await options
                  .courtAnalysisWorkflowStore!
                  .saveCourtAnalysisState({
                    caseId:
                      courtCaseId,
                    caseDataKey,
                    keyVersion:
                      caseView
                        .keyVersion,
                    state:
                      createCourtAnalysisState(
                        courtCaseId
                      )
                  });
              }
            );

        const permit =
          requireCourtAnalysisExecutionPermit(
            state
          );
        request.courtWorkflowContext = {
          stage:
            permit.stage,
          checkpoint:
            permit.checkpoint
        };
        courtContext = {
          caseId:
            courtCaseId,
          permit,
          state
        };
      }

      let chronologyContext:
        | {
            caseId: string;
            permit:
              ChronologyExecutionPermit;
            state:
              ChronologyState;
          }
        | null = null;

      if (
        previewPlan.id ===
          "CHRONOLOGY_V1"
      ) {
        if (
          !options.caseAccessService ||
          !options
            .chronologyWorkflowStore
        ) {
          res.status(503).json({
            error:
              "CHRONOLOGY_STATE_SERVICE_UNAVAILABLE"
          });
          return;
        }

        const nonFirmCaseIds =
          new Set(
            sessionAttachments
              .filter(
                (attachment) =>
                  !isFirmScope(attachment.sourceScope)
              )
              .map(
                (attachment) =>
                  attachment.caseId
              )
              .filter(
                (
                  caseId
                ): caseId is string =>
                  Boolean(caseId)
              )
          );
        const chronologyCaseId =
          knowledge.caseId ??
          (
            nonFirmCaseIds.size === 1
              ? [
                  ...nonFirmCaseIds
                ][0]
              : undefined
          );
        if (!chronologyCaseId) {
          throw new Error(
            "CHRONOLOGY_CASE_REQUIRED"
          );
        }

        const actor =
          responseAuthContext(res);
        options.caseAccessService
          .assertAccess(
            actor,
            chronologyCaseId,
            "WRITE"
          );
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              chronologyCaseId
            );

        const temporalRequired =
          chronologyTemporalGateRequired([
            request.query,
            ...sessionAttachments.flatMap(
              (attachment) =>
                attachment.chunks.map(
                  (chunk) =>
                    chunk.text
                )
            )
          ]);

        const state =
          await options
            .caseAccessService
            .withCaseDataKey(
              actor,
              chronologyCaseId,
              "WRITE",
              async (
                caseDataKey
              ) => {
                let current =
                  await options
                    .chronologyWorkflowStore!
                    .getChronologyState({
                      caseId:
                        chronologyCaseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });

                if (!current) {
                  current =
                    await options
                      .chronologyWorkflowStore!
                      .saveChronologyState({
                        caseId:
                          chronologyCaseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion,
                        state:
                          createChronologyState(
                            chronologyCaseId
                          )
                      });
                }

                if (
                  temporalRequired &&
                  !current
                    .temporalGateRequired
                ) {
                  const next =
                    requireChronologyTemporalGate(
                      current,
                      true
                    );
                  current =
                    await options
                      .chronologyWorkflowStore!
                      .saveChronologyState({
                        caseId:
                          chronologyCaseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion,
                        state: next,
                        expectedRevision:
                          current.revision
                      });
                }
                return current;
              }
            );

        const permit =
          requireChronologyExecutionPermit(
            state
          );
        request.chronologyWorkflowContext = {
          stage:
            permit.stage,
          checkpoint:
            permit.checkpoint,
          temporalGateRequired:
            state
              .temporalGateRequired
        };
        chronologyContext = {
          caseId:
            chronologyCaseId,
          permit,
          state
        };
      }

      let contractContext:
        | {
            caseId: string;
            permit:
              ContractExecutionPermit;
            state:
              ContractAnalysisState;
          }
        | null = null;

      if (
        previewPlan.id ===
          "CONTRACT_ANALYSIS_V1"
      ) {
        if (
          !options.caseAccessService ||
          !options
            .contractWorkflowStore
        ) {
          res.status(503).json({
            error:
              "CONTRACT_STATE_SERVICE_UNAVAILABLE"
          });
          return;
        }

        const nonFirmCaseIds =
          new Set(
            sessionAttachments
              .filter(
                (attachment) =>
                  !isFirmScope(attachment.sourceScope)
              )
              .map(
                (attachment) =>
                  attachment.caseId
              )
              .filter(
                (
                  caseId
                ): caseId is string =>
                  Boolean(caseId)
              )
          );
        const contractCaseId =
          knowledge.caseId ??
          (
            nonFirmCaseIds.size === 1
              ? [
                  ...nonFirmCaseIds
                ][0]
              : undefined
          );
        if (!contractCaseId) {
          throw new Error(
            "CONTRACT_CASE_REQUIRED"
          );
        }

        const actor =
          responseAuthContext(res);
        options.caseAccessService
          .assertAccess(
            actor,
            contractCaseId,
            "WRITE"
          );
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              contractCaseId
            );

        const state =
          await options
            .caseAccessService
            .withCaseDataKey(
              actor,
              contractCaseId,
              "WRITE",
              (
                caseDataKey
              ) =>
                options
                  .contractWorkflowStore!
                  .getContractAnalysisState({
                    caseId:
                      contractCaseId,
                    caseDataKey,
                    keyVersion:
                      caseView
                        .keyVersion
                  })
            );
        if (!state) {
          throw new Error(
            "CONTRACT_STATE_REQUIRED"
          );
        }

        const permit =
          requireContractExecutionPermit(
            state
          );
        request.contractWorkflowContext = {
          mode:
            permit.mode,
          stage:
            permit.stage,
          checkpoint:
            permit.checkpoint
        };
        contractContext = {
          caseId:
            contractCaseId,
          permit,
          state
        };
      }

      let orderedCaseContext:
        | {
            caseId: string;
            permit:
              OrderedCaseExecutionPermit;
            state:
              OrderedCaseWorkflowState;
          }
        | null = null;

      if (
        previewPlan.id ===
          "EVIDENCE_ANALYSIS_V1" ||
        previewPlan.id ===
          "WITNESS_QUESTIONING_V1"
      ) {
        if (
          !options.caseAccessService ||
          !options
            .orderedCaseWorkflowStore
        ) {
          res.status(503).json({
            error:
              "ORDERED_WORKFLOW_STATE_SERVICE_UNAVAILABLE"
          });
          return;
        }

        const workflowId =
          previewPlan.id as
            OrderedCaseWorkflowId;
        const nonFirmCaseIds =
          new Set(
            sessionAttachments
              .filter(
                (attachment) =>
                  !isFirmScope(attachment.sourceScope)
              )
              .map(
                (attachment) =>
                  attachment.caseId
              )
              .filter(
                (
                  caseId
                ): caseId is string =>
                  Boolean(caseId)
              )
          );
        const orderedCaseId =
          knowledge.caseId ??
          (
            nonFirmCaseIds.size === 1
              ? [
                  ...nonFirmCaseIds
                ][0]
              : undefined
          );
        if (!orderedCaseId) {
          throw new Error(
            "ORDERED_WORKFLOW_CASE_REQUIRED"
          );
        }

        const actor =
          responseAuthContext(res);
        options.caseAccessService
          .assertAccess(
            actor,
            orderedCaseId,
            "WRITE"
          );
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              orderedCaseId
            );

        const state =
          await options
            .caseAccessService
            .withCaseDataKey(
              actor,
              orderedCaseId,
              "WRITE",
              async (
                caseDataKey
              ) => {
                let current =
                  await options
                    .orderedCaseWorkflowStore!
                    .getOrderedCaseWorkflowState({
                      caseId:
                        orderedCaseId,
                      workflowId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (!current) {
                  current =
                    await options
                      .orderedCaseWorkflowStore!
                      .saveOrderedCaseWorkflowState({
                        caseId:
                          orderedCaseId,
                        workflowId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion,
                        state:
                          createOrderedCaseWorkflowState(
                            workflowId,
                            orderedCaseId
                          )
                      });
                }
                return current;
              }
            );

        const permit =
          requireOrderedCaseExecutionPermit(
            state
          );
        request
          .orderedCaseWorkflowContext = {
            workflowId,
            checkpoint:
              permit.checkpoint,
            revision:
              permit.revision
          };
        orderedCaseContext = {
          caseId:
            orderedCaseId,
          permit,
          state
        };
      }

      if (
        processContext?.permit.mode ===
          "AUTO" &&
        options.caseAccessService &&
        options.processWorkflowStore
      ) {
        const actor =
          responseAuthContext(res);
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              processContext.caseId
            );

        const refreshCitations =
          async (
            result:
              SessionExecutionResponse
          ) => {
            if (
              !result.documentCitations ||
              result.documentCitations
                .length === 0
            ) {
              return;
            }
            if (!options.documentService) {
              throw new Error(
                "DOCUMENT_CITATION_SOURCE_UNAVAILABLE"
              );
            }
            const checked =
              await refreshDocumentCitations({
                result,
                documentService:
                  options.documentService,
                caseAccessService:
                  options.caseAccessService!,
                actor
              });
            result.documentCitationFreshness = {
              result: "PASS",
              checked
            };
          };

        const auto =
          await runBoundedProcessAutoSequence<
            SessionExecutionResponse
          >({
            initialState:
              processContext.state,
            prepareState:
              async (expected) =>
                await options
                  .caseAccessService!
                  .withCaseDataKey(
                    actor,
                    processContext!
                      .caseId,
                    "WRITE",
                    async (
                      caseDataKey
                    ) => {
                      const current =
                        await options
                          .processWorkflowStore!
                          .getProcessPleadingState({
                            caseId:
                              processContext!
                                .caseId,
                            caseDataKey,
                            keyVersion:
                              caseView
                                .keyVersion
                          });
                      if (
                        !current ||
                        current.revision !==
                          expected.revision
                      ) {
                        throw new Error(
                          "PROCESS_PLEADING_STATE_CONFLICT"
                        );
                      }

                      let inventory:
                        ProcessEvidenceInventory = {
                          fileCount:
                            null,
                          complete:
                            false,
                          source:
                            "UNAVAILABLE"
                        };

                      if (
                        options
                          .secureCaseUploadStore
                      ) {
                        const uploads =
                          await options
                            .secureCaseUploadStore
                            .listUploads({
                              caseId:
                                processContext!
                                  .caseId,
                              caseDataKey,
                              keyVersion:
                                caseView
                                  .keyVersion
                            });
                        inventory =
                          evidenceInventoryFromUploads(
                            uploads,
                            "ENCRYPTED_CASE_UPLOADS"
                          );
                      } else if (
                        options
                          .caseFileStore
                          ?.listUploads
                      ) {
                        const uploads =
                          await options
                            .caseFileStore
                            .listUploads(
                              processContext!
                                .caseId
                            );
                        inventory =
                          evidenceInventoryFromUploads(
                            uploads,
                            "LEGACY_CASE_UPLOADS"
                          );
                      }

                      const applicability =
                        applyDeterministicProcessApplicability(
                          current,
                          inventory
                        );
                      if (
                        applicability.state
                          .revision ===
                        current.revision
                      ) {
                        return current;
                      }
                      return await options
                        .processWorkflowStore!
                        .saveProcessPleadingState({
                          caseId:
                            processContext!
                              .caseId,
                          caseDataKey,
                          keyVersion:
                            caseView
                              .keyVersion,
                          state:
                            applicability
                              .state,
                          expectedRevision:
                            current.revision
                        });
                    }
                  ),
            execute:
              async (
                permit
              ) => {
                const nodeRequest:
                  SessionExecutionRequest = {
                    ...request,
                    processWorkflowContext: {
                      stage:
                        permit.stage,
                      checkpoint:
                        permit.checkpoint,
                      mode:
                        permit.mode
                    }
                  };
                const nodeResult =
                  await options
                    .sessionExecutor!
                    .execute(
                      nodeRequest
                    );
                await refreshCitations(
                  nodeResult
                );
                const commit =
                  nodeResult.status ===
                    "DRAFT_PRESENTABLE" &&
                  nodeResult.workflow
                    ?.id ===
                    "PROCESS_PLEADING_V1" &&
                  nodeResult.workflow
                    .result ===
                    "PASS";
                return {
                  result:
                    nodeResult,
                  commit
                };
              },
            persist:
              async (
                previous,
                next
              ) =>
                await options
                  .caseAccessService!
                  .withCaseDataKey(
                    actor,
                    processContext!
                      .caseId,
                    "WRITE",
                    async (
                      caseDataKey
                    ) => {
                      const current =
                        await options
                          .processWorkflowStore!
                          .getProcessPleadingState({
                            caseId:
                              processContext!
                                .caseId,
                            caseDataKey,
                            keyVersion:
                              caseView
                                .keyVersion
                          });
                      if (
                        !current ||
                        current.revision !==
                          previous.revision
                      ) {
                        throw new Error(
                          "PROCESS_PLEADING_STATE_CONFLICT"
                        );
                      }
                      return await options
                        .processWorkflowStore!
                        .saveProcessPleadingState({
                          caseId:
                            processContext!
                              .caseId,
                          caseDataKey,
                          keyVersion:
                            caseView
                              .keyVersion,
                          state:
                            next,
                          expectedRevision:
                            previous
                              .revision
                        });
                    }
                  )
          });

        const lastSuccessful =
          auto.steps.at(-1)
            ?.result;
        const response =
          auto.blockedResult ??
          lastSuccessful;
        if (!response) {
          throw new Error(
            "PROCESS_PLEADING_AUTO_RESULT_MISSING"
          );
        }

        const successfulAnswers =
          auto.steps
            .filter(
              (step) =>
                typeof step.result
                  .answer ===
                  "string" &&
                step.result.answer
                  .trim()
            )
            .map(
              (step) =>
                [
                  `## ${step.permit.checkpoint}`,
                  step.result.answer!
                    .trim()
                ].join("\n\n")
            );

        if (
          response.status ===
            "DRAFT_PRESENTABLE" &&
          successfulAnswers.length > 0
        ) {
          response.answer =
            successfulAnswers.join(
              "\n\n---\n\n"
            );
        }

        response.processAuto = {
          maxSteps:
            PROCESS_AUTO_MAX_STEPS,
          stopped:
            auto.stopped,
          limitReached:
            auto.limitReached,
          steps:
            auto.steps.map(
              (step) => ({
                stage:
                  step.permit.stage,
                checkpoint:
                  step.permit
                    .checkpoint,
                revisionAfter:
                  step.revisionAfter,
                status:
                  step.result.status,
                ...(typeof step
                  .result.answer ===
                    "string"
                  ? {
                      answer:
                        step.result
                          .answer
                    }
                  : {})
              })
            )
        };
        response.processWorkflow = {
          caseId:
            processContext.caseId,
          mode:
            auto.state.mode,
          revision:
            auto.state.revision,
          stage:
            auto.state.stage,
          documentStatus:
            auto.state
              .documentStatus,
          pendingCheckpoint:
            auto.state
              .pendingCheckpoint,
          checkpoints: {
            ...auto.state
              .checkpoints
          }
        };

        restoreSessionDocumentAliases(
          response,
          options.documentService
        );
        res.json(response);
        return;
      }

      const result =
        await options
          .sessionExecutor
          .execute(request);

      if (
        result.documentCitations &&
        result.documentCitations.length > 0
      ) {
        if (!options.documentService) {
          throw new Error(
            "DOCUMENT_CITATION_SOURCE_UNAVAILABLE"
          );
        }
        const actor =
          options.caseAccessService
            ? responseAuthContext(res)
            : undefined;
        const checked =
          await refreshDocumentCitations({
            result,
            documentService:
              options.documentService,
            ...(options.caseAccessService
              ? {
                  caseAccessService:
                    options.caseAccessService
                }
              : {}),
            ...(actor
              ? { actor }
              : {})
          });
        result.documentCitationFreshness = {
          result: "PASS",
          checked
        };
      }

      if (
        orderedCaseContext &&
        options.caseAccessService &&
        options
          .orderedCaseWorkflowStore
      ) {
        const actor =
          responseAuthContext(res);
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              orderedCaseContext.caseId
            );

        let state =
          orderedCaseContext.state;
        if (
          result.status ===
            "DRAFT_PRESENTABLE" &&
          result.finalization ===
            "PASS" &&
          result.audit.result ===
            "PASS" &&
          result.audit.closed ===
            true &&
          result.workflow?.id ===
            orderedCaseContext
              .permit.workflowId &&
          result.workflow.result ===
            "PASS"
        ) {
          if (
            !options
              .secureCaseArtifactStore
          ) {
            throw new Error(
              "WORKFLOW_AUDIT_STORE_UNAVAILABLE"
            );
          }

          state =
            await options
              .caseAccessService
              .withCaseDataKey(
                actor,
                orderedCaseContext.caseId,
                "WRITE",
                async (
                  caseDataKey
                ) => {
                  const current =
                    await options
                      .orderedCaseWorkflowStore!
                      .getOrderedCaseWorkflowState({
                        caseId:
                          orderedCaseContext!
                            .caseId,
                        workflowId:
                          orderedCaseContext!
                            .permit
                            .workflowId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                  if (!current) {
                    throw new Error(
                      "ORDERED_WORKFLOW_STATE_CONFLICT"
                    );
                  }

                  const auditArtifact =
                    await persistWorkflowAuditArtifact({
                      store:
                        options
                          .secureCaseArtifactStore!,
                      caseId:
                        orderedCaseContext!
                          .caseId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion,
                      createdByUserId:
                        actor.user
                          .userId,
                      workflowId:
                        orderedCaseContext!
                          .permit
                          .workflowId,
                      checkpoint:
                        orderedCaseContext!
                          .permit
                          .checkpoint,
                      result
                    });

                  try {
                    const next =
                      completeOrderedCaseExecution(
                        current,
                        orderedCaseContext!
                          .permit,
                        [
                          auditArtifact
                            .auditRef
                        ]
                      );
                    return await options
                      .orderedCaseWorkflowStore!
                      .saveOrderedCaseWorkflowState({
                        caseId:
                          orderedCaseContext!
                            .caseId,
                        workflowId:
                          orderedCaseContext!
                            .permit
                            .workflowId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion,
                        state: next,
                        expectedRevision:
                          current.revision
                      });
                  } catch (error) {
                    await options
                      .secureCaseArtifactStore!
                      .deleteArtifact({
                        caseId:
                          orderedCaseContext!
                            .caseId,
                        artifactId:
                          auditArtifact
                            .artifactId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                    throw error;
                  }
                }
              );
        }

        result.orderedCaseWorkflow = {
          workflowId:
            state.workflowId,
          caseId:
            state.caseId,
          revision:
            state.revision,
          status:
            state.status,
          nextCheckpoint:
            nextOrderedCaseCheckpoint(
              state
            ),
          closedCheckpoints: [
            ...state
              .closedCheckpoints
          ]
        };
      }

      if (
        contractContext &&
        options.caseAccessService &&
        options
          .contractWorkflowStore
      ) {
        const actor =
          responseAuthContext(res);
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              contractContext.caseId
            );

        let state =
          contractContext.state;
        if (
          result.status ===
            "DRAFT_PRESENTABLE" &&
          result.finalization ===
            "PASS" &&
          result.audit.result ===
            "PASS" &&
          result.audit.closed ===
            true &&
          result.workflow?.id ===
            "CONTRACT_ANALYSIS_V1" &&
          result.workflow.result ===
            "PASS"
        ) {
          if (
            !options
              .secureCaseArtifactStore
          ) {
            throw new Error(
              "WORKFLOW_AUDIT_STORE_UNAVAILABLE"
            );
          }

          state =
            await options
              .caseAccessService
              .withCaseDataKey(
                actor,
                contractContext.caseId,
                "WRITE",
                async (
                  caseDataKey
                ) => {
                  const current =
                    await options
                      .contractWorkflowStore!
                      .getContractAnalysisState({
                        caseId:
                          contractContext!
                            .caseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                  if (!current) {
                    throw new Error(
                      "CONTRACT_STATE_CONFLICT"
                    );
                  }

                  const auditArtifact =
                    await persistWorkflowAuditArtifact({
                      store:
                        options
                          .secureCaseArtifactStore!,
                      caseId:
                        contractContext!
                          .caseId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion,
                      createdByUserId:
                        actor.user
                          .userId,
                      workflowId:
                        "CONTRACT_ANALYSIS_V1",
                      checkpoint:
                        contractContext!
                          .permit
                          .checkpoint,
                      result
                    });

                  try {
                    const next =
                      completeContractExecution(
                        current,
                        contractContext!
                          .permit,
                        [
                          auditArtifact
                            .auditRef
                        ]
                      );
                    return await options
                      .contractWorkflowStore!
                      .saveContractAnalysisState({
                        caseId:
                          contractContext!
                            .caseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion,
                        state: next,
                        expectedRevision:
                          current.revision
                      });
                  } catch (error) {
                    await options
                      .secureCaseArtifactStore!
                      .deleteArtifact({
                        caseId:
                          contractContext!
                            .caseId,
                        artifactId:
                          auditArtifact
                            .artifactId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                    throw error;
                  }
                }
              );
        }

        result.contractWorkflow = {
          caseId:
            contractContext.caseId,
          revision:
            state.revision,
          mode:
            state.mode,
          stage:
            state.stage,
          nextCheckpoint:
            nextContractCheckpoint(
              state
            ),
          closedCheckpoints: [
            ...state
              .closedCheckpoints
          ]
        };
      }

      if (
        chronologyContext &&
        options.caseAccessService &&
        options
          .chronologyWorkflowStore
      ) {
        const actor =
          responseAuthContext(res);
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              chronologyContext.caseId
            );

        let state =
          chronologyContext.state;
        if (
          result.status ===
            "DRAFT_PRESENTABLE" &&
          result.finalization ===
            "PASS" &&
          result.audit.result ===
            "PASS" &&
          result.audit.closed ===
            true &&
          result.workflow?.id ===
            "CHRONOLOGY_V1" &&
          result.workflow.result ===
            "PASS"
        ) {
          if (
            !options
              .secureCaseArtifactStore
          ) {
            throw new Error(
              "WORKFLOW_AUDIT_STORE_UNAVAILABLE"
            );
          }

          state =
            await options
              .caseAccessService
              .withCaseDataKey(
                actor,
                chronologyContext.caseId,
                "WRITE",
                async (
                  caseDataKey
                ) => {
                  const current =
                    await options
                      .chronologyWorkflowStore!
                      .getChronologyState({
                        caseId:
                          chronologyContext!
                            .caseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                  if (!current) {
                    throw new Error(
                      "CHRONOLOGY_STATE_CONFLICT"
                    );
                  }

                  const auditArtifact =
                    await persistWorkflowAuditArtifact({
                      store:
                        options
                          .secureCaseArtifactStore!,
                      caseId:
                        chronologyContext!
                          .caseId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion,
                      createdByUserId:
                        actor.user
                          .userId,
                      workflowId:
                        "CHRONOLOGY_V1",
                      checkpoint:
                        chronologyContext!
                          .permit
                          .checkpoint,
                      result
                    });

                  try {
                    const next =
                      completeChronologyExecution(
                        current,
                        chronologyContext!
                          .permit,
                        [
                          auditArtifact
                            .auditRef
                        ]
                      );
                    return await options
                      .chronologyWorkflowStore!
                      .saveChronologyState({
                        caseId:
                          chronologyContext!
                            .caseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion,
                        state: next,
                        expectedRevision:
                          current.revision
                      });
                  } catch (error) {
                    await options
                      .secureCaseArtifactStore!
                      .deleteArtifact({
                        caseId:
                          chronologyContext!
                            .caseId,
                        artifactId:
                          auditArtifact
                            .artifactId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                    throw error;
                  }
                }
              );
        }

        result.chronologyWorkflow = {
          caseId:
            chronologyContext.caseId,
          revision:
            state.revision,
          stage:
            state.stage,
          temporalGateRequired:
            state
              .temporalGateRequired,
          nextCheckpoint:
            nextChronologyCheckpoint(
              state
            ),
          closedCheckpoints: [
            ...state
              .closedCheckpoints
          ]
        };
      }

      if (
        courtContext &&
        options.caseAccessService &&
        options
          .courtAnalysisWorkflowStore
      ) {
        const actor =
          responseAuthContext(res);
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              courtContext.caseId
            );

        let state =
          courtContext.state;
        if (
          result.status ===
            "DRAFT_PRESENTABLE" &&
          result.finalization ===
            "PASS" &&
          result.audit.result ===
            "PASS" &&
          result.audit.closed ===
            true &&
          result.workflow?.id ===
            "COURT_ANALYSIS_V1" &&
          result.workflow.result ===
            "PASS"
        ) {
          if (
            !options
              .secureCaseArtifactStore
          ) {
            throw new Error(
              "WORKFLOW_AUDIT_STORE_UNAVAILABLE"
            );
          }

          state =
            await options
              .caseAccessService
              .withCaseDataKey(
                actor,
                courtContext.caseId,
                "WRITE",
                async (
                  caseDataKey
                ) => {
                  const current =
                    await options
                      .courtAnalysisWorkflowStore!
                      .getCourtAnalysisState({
                        caseId:
                          courtContext!
                            .caseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                  if (!current) {
                    throw new Error(
                      "COURT_ANALYSIS_STATE_CONFLICT"
                    );
                  }

                  const auditArtifact =
                    await persistWorkflowAuditArtifact({
                      store:
                        options
                          .secureCaseArtifactStore!,
                      caseId:
                        courtContext!
                          .caseId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion,
                      createdByUserId:
                        actor.user
                          .userId,
                      workflowId:
                        "COURT_ANALYSIS_V1",
                      checkpoint:
                        courtContext!
                          .permit
                          .checkpoint,
                      result
                    });

                  try {
                    const next =
                      completeCourtAnalysisExecution(
                        current,
                        courtContext!
                          .permit,
                        [
                          auditArtifact
                            .auditRef
                        ]
                      );
                    return await options
                      .courtAnalysisWorkflowStore!
                      .saveCourtAnalysisState({
                        caseId:
                          courtContext!
                            .caseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion,
                        state: next,
                        expectedRevision:
                          current.revision
                      });
                  } catch (error) {
                    await options
                      .secureCaseArtifactStore!
                      .deleteArtifact({
                        caseId:
                          courtContext!
                            .caseId,
                        artifactId:
                          auditArtifact
                            .artifactId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                    throw error;
                  }
                }
              );
        }

        result.courtWorkflow = {
          caseId:
            courtContext.caseId,
          revision:
            state.revision,
          stage:
            state.stage,
          nextCheckpoint:
            nextCourtAnalysisCheckpoint(
              state
            ),
          closedCheckpoints: [
            ...state
              .closedCheckpoints
          ]
        };
      }

      if (
        processContext &&
        options.caseAccessService &&
        options.processWorkflowStore
      ) {
        const actor =
          responseAuthContext(res);
        const caseView =
          options.caseAccessService
            .openCase(
              actor,
              processContext.caseId
            );

        let state =
          processContext.state;
        if (
          result.status ===
            "DRAFT_PRESENTABLE" &&
          result.workflow?.id ===
            "PROCESS_PLEADING_V1" &&
          result.workflow.result ===
            "PASS"
        ) {
          state =
            await options
              .caseAccessService
              .withCaseDataKey(
                actor,
                processContext.caseId,
                "WRITE",
                async (
                  caseDataKey
                ) => {
                  const current =
                    await options
                      .processWorkflowStore!
                      .getProcessPleadingState({
                        caseId:
                          processContext!
                            .caseId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      });
                  if (!current) {
                    throw new Error(
                      "PROCESS_PLEADING_STATE_CONFLICT"
                    );
                  }
                  const next =
                    completeProcessExecution(
                      current,
                      processContext!
                        .permit
                    );
                  return await options
                    .processWorkflowStore!
                    .saveProcessPleadingState({
                      caseId:
                        processContext!
                          .caseId,
                      caseDataKey,
                      keyVersion:
                        caseView
                          .keyVersion,
                      state: next,
                      expectedRevision:
                        current.revision
                    });
                }
              );
        }

        result.processWorkflow = {
          caseId:
            processContext.caseId,
          mode: state.mode,
          revision: state.revision,
          stage: state.stage,
          documentStatus:
            state.documentStatus,
          pendingCheckpoint:
            state.pendingCheckpoint,
          checkpoints: {
            ...state.checkpoints
          }
        };
      }

      restoreSessionDocumentAliases(
        result,
        options.documentService
      );
      res.json(result);
    } catch (error) {
      if (
        sendCaseAccessError(
          res,
          error
        )
      ) {
        return;
      }

      if (error instanceof MissingProviderCredentialError) {
        res.status(503).json({
          error: "PROVIDER_NOT_CONFIGURED",
          provider: error.provider
        });
        return;
      }

      if (
        sendProcessWorkflowError(
          res,
          error
        )
      ) {
        return;
      }

      if (
        sendCourtWorkflowError(
          res,
          error
        )
      ) {
        return;
      }

      if (
        sendChronologyWorkflowError(
          res,
          error
        )
      ) {
        return;
      }

      if (
        sendContractWorkflowError(
          res,
          error
        )
      ) {
        return;
      }

      if (
        error instanceof Error &&
        [
          "DOCUMENT_CITATION_SOURCE_CHANGED",
          "DOCUMENT_CITATION_SOURCE_UNAVAILABLE",
          "DOCUMENT_CITATION_REFRESH_AUTH_REQUIRED"
        ].includes(error.message)
      ) {
        res.status(409).json({
          error: error.message
        });
        return;
      }

      if (error instanceof ContextBudgetError) {
        res.status(422).json({
          error: error.message,
          ...error.details
        });
        return;
      }

      if (
        error instanceof Error &&
        [
          "UNKNOWN_LOCAL_DOCUMENT",
          "DOCUMENT_NOT_FINALIZED",
          "INVALID_DOCUMENT_CHUNK_SELECTION",
          "UNKNOWN_DOCUMENT_CHUNK",
          "DOCUMENT_ATTACHMENT_CONTEXT_TOO_LARGE",
          "TOO_MANY_DOCUMENT_ATTACHMENTS"
        ].includes(error.message)
      ) {
        res.status(422).json({
          error:
            "DOCUMENT_ATTACHMENT_RESOLUTION_FAILED"
        });
        return;
      }

      const localFailureMessage =
        request.model.startsWith(
          "local/"
        )
          ? (
              error instanceof
                ProviderGatewayError &&
              error.causeValue instanceof
                Error
                ? error.causeValue
                    .message
                : error instanceof Error
                  ? error.message
                  : ""
            )
          : "";
      const parsedLocalFailureReason =
        localFailureMessage
          .split(
            ":",
            1
          )[0] ?? "";
      const localFailureReason =
        /^LOCAL_MODEL_[A-Z0-9_]+$/.test(
          parsedLocalFailureReason
        )
          ? parsedLocalFailureReason
          : "LOCAL_MODEL_INFERENCE_FAILED";
      if (
        request.model.startsWith(
          "local/"
        )
      ) {
        res.status(503).json({
          error:
            "LOCAL_MODEL_EXECUTION_FAILED",
          reason:
            localFailureReason,
          ...(localFailureMessage
            ? {
                description:
                  safeDiagnosticText(
                    localFailureMessage
                  )
              }
            : {})
        });
        return;
      }

      if (error instanceof ProviderGatewayError) {
        const rawReason =
          error.causeValue instanceof Error
            ? error.causeValue.message
            : "";
        const parsedReason =
          rawReason.split(
            ":",
            1
          )[0] ?? "";
        res.status(502).json({
          error: "PROVIDER_EXECUTION_FAILED",
          provider: error.provider,
          reason:
            /^[A-Z0-9_]+$/.test(
              parsedReason
            )
              ? parsedReason
              : "PROVIDER_UNCODED_FAILURE",
          ...(rawReason
            ? {
                description:
                  safeDiagnosticText(
                    rawReason
                  )
              }
            : {})
        });
        return;
      }

      if (
        error instanceof Error &&
        error.name ===
          "LexExecutionError"
      ) {
        const target =
          typeof (
            error as Error & {
              target?: unknown;
            }
          ).target === "string"
            ? (
                error as Error & {
                  target: string;
                }
              ).target
            : "UNKNOWN_LEGAL_WORKFLOW_GATE";
        const executionError =
          error as Error & {
            events?: Array<{
              sequence?: number;
              type?: string;
              target?: string;
              status?: string;
              detail?: string;
            }>;
          };
        res.status(422).json({
          error:
            "LEGAL_WORKFLOW_EXECUTION_FAILED",
          reason:
            target,
          stage:
            target,
          description:
            safeDiagnosticText(
              error
            ),
          trace:
            Array.isArray(
              executionError.events
            )
              ? executionError.events
                  .slice(-24)
                  .map((event) => ({
                    sequence:
                      event.sequence,
                    type:
                      event.type,
                    target:
                      event.target,
                    status:
                      event.status,
                    ...(event.detail
                      ? {
                          detail:
                            safeDiagnosticText(
                              event.detail
                            )
                        }
                      : {})
                  }))
              : []
        });
        return;
      }

      // The chat privacy gate is fail-closed: it blocks the turn when the
      // local pseudonymization pipeline cannot run. That is a named,
      // actionable condition, not an unknown server fault, so it must not
      // reach the client as a generic SESSION_EXECUTION_FAILED.
      if (
        error instanceof Error &&
        error.message ===
          "CHAT_PRIVACY_GATE_FAILED"
      ) {
        res.status(503).json({
          error:
            "CHAT_PRIVACY_GATE_FAILED"
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "WORKFLOW_AUDIT_STORE_UNAVAILABLE"
      ) {
        res.status(503).json({
          error:
            "WORKFLOW_AUDIT_UNAVAILABLE"
        });
        return;
      }

      // Every mapped failure above returns a specific code. Reaching here
      // means an unclassified error, and the client only ever sees
      // SESSION_EXECUTION_FAILED — without this there is no diagnostic
      // anywhere for an operator to work from. Name and message only: no
      // request body, no stack, nothing that could carry a credential.
      console.error(
        "SESSION_EXECUTION_FAILED",
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error)
      );
      res.status(500).json({
        error: "SESSION_EXECUTION_FAILED",
        description:
          safeDiagnosticText(
            error
          )
      });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({
      error: "NOT_FOUND"
    });
  });

  return app;
}
