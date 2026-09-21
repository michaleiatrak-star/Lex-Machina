export type ProviderId = "openai" | "anthropic" | "xai";

export type AuthStatusResponse = {
  initialized: boolean;
  requiresBootstrap: boolean;
};

export type AuthenticatedUser = {
  userId: string;
  loginName: string;
  displayName: string;
  appRole: "ADMIN" | "USER";
  status: "ACTIVE" | "DISABLED";
  passwordSetupPending?: boolean;
  createdAt: string;
  lastLoginAt?: string;
};

export type AdminUsersResponse = {
  users: AuthenticatedUser[];
};

export type DeletedUserResponse = {
  userId: string;
  deletedAt: string;
};

export type AuthSessionInfo = {
  sessionId: string;
  userId: string;
  createdAt: string;
  lastActivityAt: string;
  lastFullAuthenticationAt: string;
  idleExpiresAt: string;
  overallExpiresAt: string;
};

export type AuthSuccessResponse = {
  user: AuthenticatedUser;
  session: AuthSessionInfo;
  sessionToken?: string;
  recoveryCode?: string;
};

export type AuthMeResponse = {
  user: AuthenticatedUser;
  session: AuthSessionInfo;
};

export type SupportCapability =
  | "DIAGNOSTICS"
  | "ACCOUNT_READ"
  | "UPDATE_READ";

export type SupportSessionInfo = {
  sessionId: string;
  role: "SERVICE";
  installationId: string;
  capabilities: SupportCapability[];
  ticket: string;
  approvedByUserId: string;
  activatedAt: string;
  expiresAt: string;
};

export type SupportStatusResponse = {
  installationId: string;
  roleModel:
    ["SERVICE", "ADMIN", "USER"];
  configured: boolean;
  nativeIdentityReady: boolean;
  vendorKeyId?: string;
  activeSessions: number;
};

export type SupportChallengeResponse = {
  installationId: string;
  challengePublicKey: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
  challengeSignature: string;
  challengeProofAlgorithm?: "Ed25519";
};

export type SignedSupportEntitlement = {
  keyId: string;
  entitlement: {
    version: 1;
    installationId: string;
    challengePublicKey: string;
    nonce: string;
    challengeSignature: string;
    capabilities:
      SupportCapability[];
    issuedAt: string;
    expiresAt: string;
    ticket: string;
  };
  signature: string;
};

export type RecoveryCodeResponse = {
  recoveryCode: string;
  createdAt: string;
};

export type AuthRecoveryResponse =
  AuthSuccessResponse & {
    recoveryCode: string;
  };

export type PiiKind =
  | "PESEL"
  | "NIP"
  | "REGON"
  | "IBAN"
  | "EMAIL"
  | "PHONE"
  | "PERSON"
  | "ADDRESS"
  | "CUSTOM";

export type PrivacyAction =
  | "PSEUDONYMIZE"
  | "KEEP"
  | "LABEL";

export type PagePrivacyDirective = {
  page: number;
  start: number;
  end: number;
  action: PrivacyAction;
  kind?: PiiKind;
  label?: string;
};

export type CaseRole =
  | "OWNER"
  | "EDITOR"
  | "ANALYST"
  | "VIEWER";

export type CaseKind =
  | "MATTER"
  | "FIRM_KNOWLEDGE";

export type CaseResponse = {
  caseId: string;
  caseKind: CaseKind;
  displayName?: string;
  createdAt: string;
  updatedAt?: string;
  createdByUserId?: string;
  keyVersion?: number;
  role?: CaseRole;
  canReidentify?: boolean;
  archivedAt?: string;
};

export type CaseListItem = {
  caseId: string;
  caseKind: CaseKind;
  displayName?: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  keyVersion: number;
  role: CaseRole;
  canReidentify: boolean;
  archivedAt?: string;
};

export type CaseListResponse = {
  cases: CaseListItem[];
};

export type CaseAccessEntry = {
  user: AuthenticatedUser;
  role: CaseRole;
  canReidentify: boolean;
  grantedByUserId: string;
  grantedAt: string;
  keyVersion: number;
};

export type CaseAccessResponse = {
  access: CaseAccessEntry[];
};

export type CaseAccessCandidatesResponse = {
  users: AuthenticatedUser[];
};

export type FirmKnowledgeWorkspaceResponse = {
  workspace: CaseListItem | null;
};

export type CaseKnowledgeHit = {
  documentId: string;
  chunkIndex: number;
  pageStart: number;
  pageEnd: number;
  score: number;
  text: string;
};

export type CaseKnowledgeSearchResponse = {
  caseId: string;
  caseKind: CaseKind;
  hits: CaseKnowledgeHit[];
};

export type StoredArchiveEntry = {
  relativePath: string;
  compressedBytes: number;
  uncompressedBytes: number;
  sha256: string;
  mediaType: string | null;
  processable: boolean;
};

export type StoredUploadResponse = {
  caseId: string;
  uploadId: string;
  filename: string;
  mediaType: string;
  sha256: string;
  bytes: number;
  storedAt: string;
  archive: boolean;
  extracted: StoredArchiveEntry[];
};

export type CaseFilesResponse = {
  caseId: string;
  uploads: StoredUploadResponse[];
};

export type SharedTemplateManifest = {
  templateId: string;
  scope: "FIRM_SHARED";
  filename: string;
  mediaType:
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.oasis.opendocument.text";
  sha256: string;
  bytes: number;
  createdAt: string;
  createdByUserId: string;
  generationReady: false;
};

export type SharedTemplateListResponse = {
  templates: SharedTemplateManifest[];
};

export type LegalDocumentFormat =
  | "docx"
  | "odt";

export type LegalDocumentType =
  | "pleading"
  | "contract"
  | "opinion"
  | "letter"
  | "report"
  | "other";

export type LegalStyleProfile =
  | "lex-classic-clean-v1"
  | "lex-light-legal-design-v1"
  | "lex-classic-tnr-v1";

export type StoredCaseArtifact = {
  schemaVersion: 1;
  caseId: string;
  artifactId: string;
  filename: string;
  mediaType: string;
  sha256: string;
  bytes: number;
  createdAt: string;
  createdByUserId?: string;
  sensitivity:
    | "PROTECTED"
    | "CLEAR_PII";
  storage:
    "ENCRYPTED_LME1";
};

export type GeneratedDocumentResponse = {
  sessionId: string;
  artifact:
    StoredCaseArtifact;
  format:
    LegalDocumentFormat;
  tokenizedSha256: string;
  vaultGeneration: number;
  aliasesUsed: string[];
  templateProfile?: {
    templateId: string;
    sourceFormat:
      LegalDocumentFormat;
    styleProfile:
      LegalStyleProfile;
    sourceSha256: string;
  };
};

export type DeanonymizationIntentResponse = {
  intent: {
    intentId: string;
    caseId: string;
    artifactId: string;
    artifactFormat:
      LegalDocumentFormat;
    expiresAt: string;
    status:
      | "PENDING"
      | "AUTHORIZED"
      | "CONSUMED"
      | "REVOKED"
      | "EXPIRED";
  };
};

export type DeanonymizationReauthorizationResponse = {
  grant: {
    grantId: string;
    intentId: string;
    caseId: string;
    artifactId: string;
    artifactFormat:
      LegalDocumentFormat;
    expiresAt: string;
  };
  session:
    AuthSessionInfo;
};

export type FinalizedDocumentResponse = {
  artifact:
    StoredCaseArtifact;
  format:
    LegalDocumentFormat;
  sha256: string;
  replacements: number;
  downloadTicket?: {
    ticketId: string;
    caseId: string;
    artifactId: string;
    finalSha256: string;
    expiresAt: string;
    remainingUses:
      0 | 1;
  };
};

export type CaseTemplateListResponse = {
  caseId: string;
  scope: "FIRM_SHARED";
  templates: SharedTemplateManifest[];
};

export type DocumentReviewResponse = {
  documentId: string;
  mediaType:
    | "application/pdf"
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/tiff"
    | "text/plain"
    | "text/markdown"
    | "text/csv"
    | "text/tab-separated-values"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.oasis.opendocument.text"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.ms-excel.sheet.macroenabled.12";
  complete: true;
  totalPages: number;
  pages: Array<{
    page: number;
    text: string;
    source: "DIGITAL" | "OCR" | "BLANK";
    confidence?: number;
    engine?: string;
  }>;
  suggestions: Array<{
    page: number;
    start: number;
    end: number;
    kind: PiiKind;
  }>;
};

export type DocumentAttachmentSelection = {
  caseId: string;
  documentId: string;
  chunkIndices: number[];
};

export type DocumentIngestionResponse = {
  documentId: string;
  mediaType: DocumentReviewResponse["mediaType"];
  complete: true;
  totalPages: number;
  digitalPages: number;
  ocrPages: number;
  blankPages: number;
  sourceChars: number;
  pseudonymizedChars: number;
  chunks: Array<{
    index: number;
    pageStart: number;
    pageEnd: number;
    text: string;
  }>;
  privacy: {
    findings: number;
    counts: Partial<Record<PiiKind, number>>;
    manualPseudonymizations: number;
    keptRanges: number;
    annotations: Array<{
      page: number;
      start: number;
      end: number;
      label: string;
    }>;
    reversibleLocally: true;
  };
};

export type HealthResponse = {
  status: "ok";
  service: string;
  localOnly: boolean;
};

export type RouteListResponse = {
  jurisdiction: "PL";
  primarySkills: string[];
};

export type RouteValidationResponse = {
  valid: boolean;
  primarySkill: string;
  reason?: string;
};

export type ModelDescriptor = {
  provider: ProviderId;
  id: string;
  displayName: string;
  selectable: boolean;
  compatibilityReason?: string;
  createdAt?: string;
  ownedBy?: string;
  contextWindow?: number;
  nativeContextWindow?: number;
  contextMode?:
    | "NATIVE_OR_REDUCED"
    | "YARN_EXTENDED";
  inputModalities?: string[];
  outputModalities?: string[];
  capabilities?: string[];
};

export type ModelsResponse = {
  provider: ProviderId;
  models: ModelDescriptor[];
};

export type LocalModelDescriptor = {
  provider: "local";
  id: string;
  displayName: string;
  selectable: true;
  contextWindow: number;
  nativeContextWindow: number;
  minimumContextWindow: number;
  maximumContextWindow: number;
  configuredContextWindow?: number;
  contextMode:
    | "NATIVE_OR_REDUCED"
    | "YARN_EXTENDED";
  quantization: string;
  license: string;
  source: string;
  localOnly: true;
  installed: boolean;
};

export type LocalModelsResponse = {
  provider: "local";
  models: LocalModelDescriptor[];
  runtime: {
    configured: boolean;
    selectedModelId: string | null;
    activeModelId: string | null;
    state:
      | "STOPPED"
      | "PROVISIONING"
      | "STARTING"
      | "READY";
  };
};

export type ProviderConfigurationStatus = {
  provider: ProviderId;
  configured: boolean;
};

export type ProviderCredentialPersistence =
  | "PROCESS_MEMORY"
  | "OS_KEYRING";

export type ProviderCredentialMutationResponse = {
  provider: ProviderId;
  storage: "PROCESS_MEMORY";
  configured?: boolean;
  cleared?: boolean;
};

export type ProviderStatusResponse = {
  providers: ProviderConfigurationStatus[];
};

export type ProviderAccountSessionStatus = {
  provider: ProviderId;
  command: string;
  installed: boolean;
  authenticated: boolean;
  installHint: string;
  resumeMode: "LAST_OR_NEW";
};

export type ProviderAccountStatusResponse = {
  providers: ProviderAccountSessionStatus[];
};

export type ModelRoutingPreferences = {
  auxiliaryEnabled: boolean;
  auxiliaryProvider: ProviderId;
  auxiliaryModel: string;
  updatedAt?: string;
};

export type GuideSessionState = {
  schemaVersion: 1;
  sessionId: string;
  revision: number;
  audience: "LAIK" | "PRAWNIK";
  interactionMode:
    | "PROWADZENIE"
    | "QA"
    | "MENU";
  rawAnalysis: boolean;
  step:
    | "FAZA0"
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "M"
    | "Q";
  guidedQuestionIndex:
    0 | 1 | 2 | 3;
  pendingIrreversibleAction:
    | {
        actionId: string;
        warningAcknowledged:
          boolean;
      }
    | null;
  createdAt: string;
  updatedAt: string;
};

export type GuideTransition =
  | {
      type: "SET_AUDIENCE";
      audience:
        "LAIK" | "PRAWNIK";
    }
  | {
      type:
        "SET_INTERACTION_MODE";
      mode:
        | "PROWADZENIE"
        | "QA"
        | "MENU";
    }
  | {
      type:
        "SET_RAW_ANALYSIS";
      enabled: boolean;
    }
  | {
      type: "MOVE_STEP";
      step:
        GuideSessionState["step"];
    }
  | {
      type:
        "ADVANCE_GUIDED_QUESTION";
    }
  | {
      type:
        | "BEGIN_IRREVERSIBLE_ACTION"
        | "ACKNOWLEDGE_IRREVERSIBLE_WARNING"
        | "CLEAR_IRREVERSIBLE_ACTION";
      actionId: string;
    };

export type UpdateStatusResponse = {
  currentVersion: string;
  status:
    | "NO_RELEASE"
    | "UP_TO_DATE"
    | "AVAILABLE"
    | "UNAVAILABLE";
  checkedAt: string;
  latestVersion?: string;
  releaseUrl?: string;
  releaseName?: string;
  publishedAt?: string;
};

export type ApplicationUpdateDownloadResponse = {
  version: string;
  token: string;
  receiptToken: string;
  filename: string;
  sha256: string;
  bytes: number;
  stagedAt: string;
  publisher:
    | {
        verification: "AUTHENTICODE";
        subject: string;
        thumbprint: string;
        productVersion: string;
      }
    | {
        verification: "UNSIGNED_ALLOWED";
        subject: null;
        thumbprint: null;
        productVersion: string;
        warning:
          "TEMPORARY_UNSIGNED_UPDATE_ALLOWED";
      };
};

export type SkillUpdateStatusResponse = {
  currentVersion: string;
  status: "UP_TO_DATE" | "AVAILABLE" | "UNAVAILABLE";
  latestVersion?: string;
  checkedAt: string;
  bundleReady: boolean;
  verificationReady: boolean;
  signatureMode:
    | "SIGNED_REQUIRED"
    | "UNSIGNED_ALLOWED";
  blockedReason?:
    | "INDEX_MISSING"
    | "SIGNED_INDEX_MISSING"
    | "SIGNER_POLICY_MISSING";
};

export type SkillUpdateApplyResponse = {
  previousVersion: string;
  installedVersion: string;
  installedAt: string;
  restartRequired: true;
  skillRoot: string;
};



export type BlockedReference = {
  claim: string;
  kind: "statute" | "journal" | "case";
  line: number;
  status: string;
};

export type EvidenceItem = {
  claim: string;
  kind: "statute" | "journal" | "case" | "deadline" | "amount";
  status: "VERIFIED" | "SUPPORTED" | "UNVERIFIED";
  sourceUrl?: string;
  sourceTier?: "R1" | "R2A" | "R2B" | "R3";
  fetchedAt: string;
  verificationMethod?:
    | "web_fetch"
    | "web_fetch_pdf"
    | "web_search"
    | "mcp_call"
    | "provider_tool"
    | "file_read";
  temporalMode?: "CURRENT" | "HISTORICAL";
  asOf?: string;
  sourceFormat?: "TEXT" | "PDF";
  caseScope?:
    | "FULL_TEXT"
    | "EXACT_QUOTE"
    | "PROPOSITION_SUPPORT";
  caseSignature?: string;
  evidenceHash?: string;
  supportQuoteHash?: string;
};

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
    auxiliary?: {
      enabled: boolean;
      provider: ProviderId;
      model: string;
      status:
        | "DISABLED"
        | "SKIPPED_NO_ELIGIBLE_TASK"
        | "SKIPPED_SAME_AS_PRIMARY"
        | "PASS"
        | "FAILED";
      tasks: Array<
        "LEGAL_REFERENCE_PREFLIGHT"
      >;
      extractedCandidates: number;
      deterministicVerifications: number;
      cachedVerifierReuses: number;
      latencyMs: number;
      error?: string;
    };
  };
  primarySkill: string;
  answer?: string;
  documentCitationFreshness?: {
    result: "PASS";
    checked: number;
  };
  context?: {
    strategy:
      | "MODEL_CONTEXT_WINDOW"
      | "LEGACY_CHAR_CAP";
    modelContextTokens?: number;
    reservedOutputTokens?: number;
    reservedSystemTokens?: number;
    documentBudgetTokens?: number;
    estimatedDocumentTokens: number;
    selectedChunks: number;
    omittedChunks: number;
    selectedDocuments: number;
    omittedDocuments: number;
  };
  finalization: "PASS" | "DEGRADED" | "BLOCKED";
  blockedReferences: BlockedReference[];
  verification: {
    records: number;
    verified: number;
    supported: number;
    unverified: number;
  };
  evidence: EvidenceItem[];
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
  gateI?: {
    gate: string;
    result: "PASS" | "BLOCKED";
    verifiedOrSupportedRecords?: number;
    legalReferences?: number;
    caseReferences?: number;
  };
  processAuto?: {
    maxSteps: number;
    stopped:
      | "FINAL"
      | "LIMIT_REACHED"
      | "NODE_BLOCKED";
    limitReached: boolean;
    steps: Array<{
      stage:
        Exclude<
          ProcessPleadingStage,
          "CG_ACCEPTANCE" | "FINAL"
        >;
      checkpoint:
        ProcessPleadingCheckpoint;
      revisionAfter: number;
      status:
        | "DRAFT_PRESENTABLE"
        | "BLOCKED";
      answer?: string;
    }>;
  };
  processWorkflow?: ProcessPleadingWorkflowView;
  courtWorkflow?: CourtAnalysisWorkflowView;
};

export type ProcessPleadingCheckpoint =
  | "CP-1a"
  | "CP-1b"
  | "CP-1c-skan"
  | "CP-PD"
  | "CP-FSL-D"
  | "CP-1c-macierz"
  | "CP-1c-lancuch"
  | "CP-1d-anomalie"
  | "CP-1d"
  | "CP-W1"
  | "CP-PRE-W2"
  | "CP-ATAK"
  | "CP-PODMIOT"
  | "CP-QUALITY"
  | "CP-AUDYT"
  | "CP-PEER";

export type ProcessPleadingCheckpointStatus =
  | "OPEN"
  | "PENDING_CONFIRMATION"
  | "CLOSED"
  | "NA";

export type ProcessPleadingStage =
  | "CG_ACCEPTANCE"
  | "W1"
  | "PRE_W2"
  | "W2"
  | "W3"
  | "FINAL";

export type ProcessPleadingWorkflowView = {
  caseId: string;
  mode: "CHECKPOINT" | "AUTO";
  revision: number;
  stage: ProcessPleadingStage;
  documentStatus: "DRAFT" | "FINAL";
  pendingCheckpoint: ProcessPleadingCheckpoint | null;
  checkpoints: Record<
    ProcessPleadingCheckpoint,
    ProcessPleadingCheckpointStatus
  >;
};

export type ProcessPleadingWorkflowState =
  ProcessPleadingWorkflowView & {
    schemaVersion: 1;
    workflowId: "PROCESS_PLEADING_V1";
    startAccepted: boolean;
    history: Array<{
      sequence: number;
      at: string;
      type: string;
      checkpoint?: ProcessPleadingCheckpoint;
      fromStage?: ProcessPleadingStage;
      toStage?: ProcessPleadingStage;
    }>;
    createdAt: string;
    updatedAt: string;
  };

export type ProcessPleadingWorkflowResponse = {
  caseId: string;
  state: ProcessPleadingWorkflowState | null;
};

export type CourtAnalysisCheckpoint =
  | "SD_VER_COMPLETE"
  | "PASS_I_ISOLATION_CLEAN"
  | "PASS_II_SOURCES_VERIFIED"
  | "FIRST_VERIFICATION_COMPLETE"
  | "FINAL_VERIFICATION_COMPLETE"
  | "FINAL_GATE_APPROVED"
  | "FINAL_REPORT_PRESENTED"
  | "SITUATIONAL_REPORT_PRESENTED"
  | "PROCESS_PLEADING_OFFER_PRESENTED";

export type CourtAnalysisStage =
  | "EVIDENCE_SCAN"
  | "PASS_I_FACTS"
  | "PASS_II_LAW"
  | "PASS_III_ADVERSARIAL"
  | "PASS_IV_FINAL_VERIFICATION"
  | "FINAL_REPORT"
  | "SITUATIONAL_REPORT"
  | "PROCESS_PLEADING_OFFER"
  | "COMPLETE";

export type CourtAnalysisWorkflowView = {
  caseId: string;
  revision: number;
  stage:
    CourtAnalysisStage;
  nextCheckpoint:
    CourtAnalysisCheckpoint | null;
  closedCheckpoints:
    CourtAnalysisCheckpoint[];
};

export type ApiFailure = {
  error: string;
  provider?: ProviderId;
  reason?: string;
  retryAfter?: string;
};

export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly retryAfter?: string
  ) {
    super(code);
    this.name = "ApiError";
  }
}

const DEFAULT_API_BASE = "http://127.0.0.1:4317";
const DESKTOP_API_BASE = "http://lex-api.localhost";

export function isDesktopShell(): boolean {
  if (
    typeof window ===
      "undefined"
  ) {
    return false;
  }
  return Boolean(
    (
      window as Window & {
        __TAURI_INTERNALS__?:
          unknown;
      }
    ).__TAURI_INTERNALS__
  );
}

let inMemorySessionToken: string | null = null;
let authenticationFailureHandler:
  (() => void) | null = null;

export function setAuthenticationFailureHandler(
  handler: (() => void) | null
): void {
  authenticationFailureHandler = handler;
}

export function clearAuthSession(): void {
  inMemorySessionToken = null;
}

function setAuthSessionToken(
  token: string | undefined
): void {
  if (isDesktopShell()) {
    inMemorySessionToken = null;
    return;
  }
  inMemorySessionToken =
    token ?? null;
}

function authorizationHeaders():
  Record<string, string> {
  if (isDesktopShell()) {
    return {};
  }
  return inMemorySessionToken
    ? {
        Authorization:
          `Bearer ${inMemorySessionToken}`
      }
    : {};
}

export function apiBase(): string {
  if (isDesktopShell()) {
    return DESKTOP_API_BASE;
  }
  const configured = import.meta.env.VITE_LEX_API_BASE;
  return typeof configured === "string" && configured.trim()
    ? configured.trim().replace(/\/$/, "")
    : DEFAULT_API_BASE;
}

async function json<T>(
  pathname: string,
  init?: RequestInit,
  options?: {
    authenticated?: boolean;
  }
): Promise<T> {
  const authenticated =
    options?.authenticated !== false;
  const response = await fetch(
    `${apiBase()}${pathname}`,
    {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body
          ? {
              "Content-Type":
                "application/json"
            }
          : {}),
        ...(authenticated
          ? authorizationHeaders()
          : {}),
        ...init?.headers
      }
    }
  );

  const payload =
    await response.json() as
      | T
      | ApiFailure;
  if (!response.ok) {
    const failure =
      payload as ApiFailure;
    if (
      authenticated &&
      response.status === 401
    ) {
      clearAuthSession();
      authenticationFailureHandler?.();
    }
    throw new ApiError(
      failure.error ||
        `HTTP_${response.status}`,
      response.status,
      failure.retryAfter
    );
  }
  return payload as T;
}

export function getHealth(): Promise<HealthResponse> {
  return json<HealthResponse>(
    "/health",
    undefined,
    { authenticated: false }
  );
}

export function getAuthStatus():
  Promise<AuthStatusResponse> {
  return json<AuthStatusResponse>(
    "/api/auth/status",
    undefined,
    { authenticated: false }
  );
}

export async function bootstrapAdmin(input: {
  loginName: string;
  displayName: string;
  password: string;
}): Promise<AuthSuccessResponse> {
  const result =
    await json<AuthSuccessResponse>(
      "/api/auth/bootstrap",
      {
        method: "POST",
        body: JSON.stringify(input)
      },
      { authenticated: false }
    );
  setAuthSessionToken(
    result.sessionToken
  );
  return result;
}

export async function login(input: {
  loginName: string;
  password: string;
}): Promise<AuthSuccessResponse> {
  const payload =
    isDesktopShell() &&
    input.loginName ===
      "local-admin" &&
    input.password ===
      "__LEX_NATIVE_LOGIN__"
      ? {
          loginName:
            input.loginName,
          password:
            "__LEX_NATIVE_LOGIN__"
        }
      : input;
  const result =
    await json<AuthSuccessResponse>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      { authenticated: false }
    );
  setAuthSessionToken(
    result.sessionToken
  );
  return result;
}

export function getSupportStatus():
  Promise<SupportStatusResponse> {
  return json<SupportStatusResponse>(
    "/api/admin/support/status"
  );
}

export function issueSupportChallenge():
  Promise<SupportChallengeResponse> {
  return json<SupportChallengeResponse>(
    "/api/admin/support/challenge",
    {
      method: "POST"
    }
  );
}

export function activateSupport(
  input: SignedSupportEntitlement
): Promise<{
  session: SupportSessionInfo;
  serviceToken?: string;
}> {
  return json<{
    session: SupportSessionInfo;
    serviceToken?: string;
  }>(
    "/api/admin/support/activate",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function getSupportSession():
  Promise<{
    session: SupportSessionInfo;
  }> {
  return json<{
    session: SupportSessionInfo;
  }>(
    "/api/support/me",
    undefined,
    {
      authenticated: false
    }
  );
}

export function getSupportDiagnostics():
  Promise<{
    service: string;
    localOnly: true;
    role: "SERVICE";
    installationId: string;
    expiresAt: string;
  }> {
  return json(
    "/api/support/diagnostics",
    undefined,
    {
      authenticated: false
    }
  );
}

export async function deactivateSupport():
  Promise<void> {
  const response = await fetch(
    `${apiBase()}/api/support/logout`,
    {
      method: "POST",
      headers: {
        Accept:
          "application/json"
      }
    }
  );
  if (!response.ok) {
    let code =
      `HTTP_${response.status}`;
    try {
      const payload =
        await response.json() as
          ApiFailure;
      code =
        payload.error || code;
    } catch {
      // Preserve generic HTTP code.
    }
    throw new ApiError(
      code,
      response.status
    );
  }
}

export function listAdminUsers():
  Promise<AdminUsersResponse> {
  return json<AdminUsersResponse>(
    "/api/admin/users"
  );
}

export function createAdminUser(input: {
  loginName: string;
  displayName: string;
  password: string;
}): Promise<{
  user: AuthenticatedUser;
}> {
  return json<{
    user: AuthenticatedUser;
  }>(
    "/api/admin/users",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export function setAdminUserStatus(
  userId: string,
  status:
    | "ACTIVE"
    | "DISABLED"
): Promise<{
  user: AuthenticatedUser;
}> {
  return json<{
    user: AuthenticatedUser;
  }>(
    `/api/admin/users/${userId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status
      })
    }
  );
}

export function deleteAdminUser(
  userId: string
): Promise<DeletedUserResponse> {
  return json<DeletedUserResponse>(
    `/api/admin/users/${userId}`,
    {
      method: "DELETE"
    }
  );
}

export async function createRecoveryCode(
  password: string
): Promise<RecoveryCodeResponse> {
  return json<RecoveryCodeResponse>(
    "/api/auth/recovery-code",
    {
      method: "POST",
      body: JSON.stringify({
        password
      })
    }
  );
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<AuthSuccessResponse> {
  const result =
    await json<AuthSuccessResponse>(
      "/api/auth/password",
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    );
  setAuthSessionToken(
    result.sessionToken
  );
  return result;
}

export async function recoverAccount(input: {
  loginName: string;
  recoveryCode: string;
  newPassword: string;
}): Promise<AuthRecoveryResponse> {
  const result =
    await json<AuthRecoveryResponse>(
      "/api/auth/recover",
      {
        method: "POST",
        body: JSON.stringify(input)
      },
      {
        authenticated: false
      }
    );
  setAuthSessionToken(
    result.sessionToken
  );
  return result;
}

export function getAuthMe():
  Promise<AuthMeResponse> {
  return json<AuthMeResponse>(
    "/api/auth/me"
  );
}

export async function lockAuth():
  Promise<void> {
  const headers =
    authorizationHeaders();
  try {
    const response = await fetch(
      `${apiBase()}/api/auth/lock`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...headers
        }
      }
    );
    if (
      !response.ok &&
      response.status !== 401
    ) {
      let code =
        `HTTP_${response.status}`;
      try {
        const body =
          await response.json() as
            ApiFailure;
        code = body.error || code;
      } catch {
        // no body
      }
      throw new ApiError(
        code,
        response.status
      );
    }
  } finally {
    clearAuthSession();
  }
}

export async function logoutAuth():
  Promise<void> {
  const headers =
    authorizationHeaders();
  try {
    const response = await fetch(
      `${apiBase()}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          Accept:
            "application/json",
          ...headers
        }
      }
    );
    if (
      !response.ok &&
      response.status !== 401
    ) {
      throw new ApiError(
        `HTTP_${response.status}`,
        response.status
      );
    }
  } finally {
    clearAuthSession();
  }
}

export function listCases():
  Promise<CaseListResponse> {
  return json<CaseListResponse>(
    "/api/cases"
  );
}

export function openCase(
  caseId: string
): Promise<CaseListItem> {
  return json<CaseListItem>(
    `/api/cases/${caseId}`
  );
}

export function createCase(
  displayName?: string
): Promise<CaseResponse> {
  return json<CaseResponse>("/api/cases", {
    method: "POST",
    body: JSON.stringify({
      ...(displayName?.trim()
        ? { displayName: displayName.trim() }
        : {})
    })
  });
}

export function renameCase(
  caseId: string,
  displayName: string
): Promise<CaseListItem> {
  return json<CaseListItem>(
    `/api/cases/${caseId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        displayName
      })
    }
  );
}

export function archiveCase(
  caseId: string
): Promise<CaseListItem> {
  return json<CaseListItem>(
    `/api/cases/${caseId}/archive`,
    { method: "POST" }
  );
}

export function unarchiveCase(
  caseId: string
): Promise<CaseListItem> {
  return json<CaseListItem>(
    `/api/cases/${caseId}/unarchive`,
    { method: "POST" }
  );
}

export function deleteCase(
  caseId: string,
  password: string
): Promise<{
  caseId: string;
  deletedAt: string;
}> {
  return json(
    `/api/cases/${caseId}`,
    {
      method: "DELETE",
      body: JSON.stringify({
        password
      })
    }
  );
}

export function getFirmKnowledgeWorkspace():
  Promise<FirmKnowledgeWorkspaceResponse> {
  return json<FirmKnowledgeWorkspaceResponse>(
    "/api/firm-knowledge"
  );
}

export function createFirmKnowledgeWorkspace():
  Promise<FirmKnowledgeWorkspaceResponse> {
  return json<FirmKnowledgeWorkspaceResponse>(
    "/api/firm-knowledge",
    {
      method: "POST"
    }
  );
}

export function searchCaseKnowledge(
  caseId: string,
  query: string,
  limit = 8
): Promise<CaseKnowledgeSearchResponse> {
  return json<CaseKnowledgeSearchResponse>(
    `/api/cases/${caseId}/knowledge/search`,
    {
      method: "POST",
      body: JSON.stringify({
        query,
        limit
      })
    }
  );
}

export const getFirmKnowledge =
  getFirmKnowledgeWorkspace;

export const createFirmKnowledge =
  createFirmKnowledgeWorkspace;

export function listCaseAccess(
  caseId: string
): Promise<CaseAccessResponse> {
  return json<CaseAccessResponse>(
    `/api/cases/${caseId}/access`
  );
}

export function listCaseAccessCandidates(
  caseId: string
): Promise<CaseAccessCandidatesResponse> {
  return json<CaseAccessCandidatesResponse>(
    `/api/cases/${caseId}/access-candidates`
  );
}

export function grantCaseAccess(
  caseId: string,
  input: {
    userId: string;
    role: Exclude<
      CaseRole,
      "OWNER"
    >;
    canReidentify: boolean;
  }
): Promise<CaseAccessEntry> {
  return json<CaseAccessEntry>(
    `/api/cases/${caseId}/access`,
    {
      method: "POST",
      body: JSON.stringify(
        input
      )
    }
  );
}

export function transferCaseOwnership(
  caseId: string,
  userId: string,
  password: string
): Promise<{
  caseId: string;
  previousOwnerUserId: string;
  newOwnerUserId: string;
  previousOwnerRole:
    "EDITOR";
  keyVersion: number;
  transferredAt: string;
}> {
  return json(
    `/api/cases/${caseId}/transfer-owner`,
    {
      method: "POST",
      body: JSON.stringify({
        userId,
        password
      })
    }
  );
}

export function revokeCaseAccess(
  caseId: string,
  userId: string
): Promise<{
  caseId: string;
  revokedUserId: string;
  keyVersion: number;
}> {
  return json(
    `/api/cases/${caseId}/access/${userId}`,
    {
      method: "DELETE"
    }
  );
}

export function listCaseFiles(
  caseId: string
): Promise<CaseFilesResponse> {
  return json<CaseFilesResponse>(
    `/api/cases/${caseId}/files`
  );
}

export function listCaseTemplates(
  caseId: string
): Promise<CaseTemplateListResponse> {
  return json<CaseTemplateListResponse>(
    `/api/cases/${caseId}/templates`
  );
}

export function listSharedTemplates():
  Promise<SharedTemplateListResponse> {
  return json<SharedTemplateListResponse>(
    "/api/shared/templates"
  );
}

export async function uploadSharedTemplate(
  file: File
): Promise<SharedTemplateManifest> {
  const lower =
    file.name.toLowerCase();
  const mediaType =
    file.type ||
    (
      lower.endsWith(".docx")
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : lower.endsWith(".odt")
          ? "application/vnd.oasis.opendocument.text"
          : "application/octet-stream"
    );

  const response = await fetch(
    `${apiBase()}/api/shared/templates`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": mediaType,
        ...authorizationHeaders(),
        "X-Lex-Filename":
          encodeURIComponent(
            file.name
          )
      },
      body: file
    }
  );
  const payload =
    await response.json() as
      | SharedTemplateManifest
      | ApiFailure;
  if (!response.ok) {
    throw new ApiError(
      (payload as ApiFailure)
        .error ||
        `HTTP_${response.status}`,
      response.status
    );
  }
  return payload as
    SharedTemplateManifest;
}

export function generateLegalDocument(
  caseId: string,
  input: {
    query: string;
    provider: ProviderId;
    model: string;
    primarySkill: string;
    mode:
      | "LAIK"
      | "PRAWNIK";
    format:
      LegalDocumentFormat;
    documentType:
      LegalDocumentType;
    styleProfile?:
      LegalStyleProfile;
    templateId?: string;
    attachments:
      DocumentAttachmentSelection[];
    filename?: string;
  }
): Promise<
  GeneratedDocumentResponse
> {
  return json<
    GeneratedDocumentResponse
  >(
    `/api/cases/${caseId}/artifacts/generate`,
    {
      method: "POST",
      body:
        JSON.stringify(
          input
        )
    }
  );
}

export function createDeanonymizationIntent(
  caseId: string,
  artifactId: string
): Promise<
  DeanonymizationIntentResponse
> {
  return json<
    DeanonymizationIntentResponse
  >(
    `/api/cases/${caseId}/artifacts/${artifactId}/deanonymization-intent`,
    {
      method: "POST"
    }
  );
}

export function reauthorizeDeanonymization(
  intentId: string,
  password: string
): Promise<
  DeanonymizationReauthorizationResponse
> {
  return json<
    DeanonymizationReauthorizationResponse
  >(
    "/api/deanonymization/reauthorize",
    {
      method: "POST",
      body:
        JSON.stringify({
          intentId,
          // The password typed by the user is always forwarded verbatim.
          // The desktop bridge still substitutes __LEX_NATIVE_REAUTH__ when a
          // managed bootstrap secret exists, but that secret is absent once the
          // runtime seeds the first admin account, so a sentinel sent from here
          // would reach the runtime literally and fail reauthorization.
          password
        })
    }
  );
}

export function finalizeDeanonymization(
  grantId: string,
  filename?: string
): Promise<
  FinalizedDocumentResponse
> {
  return json<
    FinalizedDocumentResponse
  >(
    "/api/deanonymization/finalize",
    {
      method: "POST",
      body:
        JSON.stringify({
          grantId,
          ...(filename
            ? {
                filename
              }
            : {})
        })
    }
  );
}

export async function downloadSensitiveArtifact(
  ticketId: string
): Promise<Blob> {
  const response =
    await fetch(
      `${apiBase()}/api/sensitive-download/${ticketId}`,
      {
        headers: {
          ...authorizationHeaders()
        },
        cache: "no-store"
      }
    );
  if (!response.ok) {
    let code =
      `HTTP_${response.status}`;
    try {
      const failure =
        await response
          .json() as
            ApiFailure;
      code =
        failure.error ||
        code;
    } catch {
      // no JSON body
    }
    if (
      response.status ===
        401
    ) {
      clearAuthSession();
      authenticationFailureHandler
        ?.();
    }
    throw new ApiError(
      code,
      response.status
    );
  }
  return await response.blob();
}

export function getRoutes(): Promise<RouteListResponse> {
  return json<RouteListResponse>("/api/routes");
}

export function setProviderApiKey(
  provider: ProviderId,
  apiKey: string,
  persistence:
    ProviderCredentialPersistence =
      "PROCESS_MEMORY"
): Promise<ProviderCredentialMutationResponse> {
  return json<ProviderCredentialMutationResponse>(
    `/api/admin/providers/${provider}/credential`,
    {
      method: "PUT",
      body: JSON.stringify({
        apiKey,
        persistence
      })
    }
  );
}

export function clearProviderApiKey(
  provider: ProviderId
): Promise<ProviderCredentialMutationResponse> {
  return json<ProviderCredentialMutationResponse>(
    `/api/admin/providers/${provider}/credential`,
    {
      method: "DELETE"
    }
  );
}

export function getProviderAccountStatus():
  Promise<ProviderAccountStatusResponse> {
  return json<ProviderAccountStatusResponse>(
    "/api/provider-accounts"
  );
}

export function loginProviderAccount(
  provider: ProviderId
): Promise<ProviderAccountSessionStatus> {
  return json<ProviderAccountSessionStatus>(
    `/api/provider-accounts/${provider}/login`,
    {
      method: "POST"
    }
  );
}

export function getGuideState():
  Promise<{
    state:
      GuideSessionState | null;
  }> {
  return json(
    "/api/guide/state"
  );
}

export function initializeGuideState(
  audience:
    "LAIK" | "PRAWNIK"
): Promise<{
  state:
    GuideSessionState;
}> {
  return json(
    "/api/guide/initialize",
    {
      method: "POST",
      body: JSON.stringify({
        audience
      })
    }
  );
}

export function transitionGuideState(
  expectedRevision: number,
  transition: GuideTransition
): Promise<{
  state:
    GuideSessionState;
}> {
  return json(
    "/api/guide/transition",
    {
      method: "POST",
      body: JSON.stringify({
        expectedRevision,
        transition
      })
    }
  );
}

export function getUpdateStatus():
  Promise<UpdateStatusResponse> {
  return json<UpdateStatusResponse>(
    "/api/update/status"
  );
}

export function getSkillUpdateStatus():
  Promise<SkillUpdateStatusResponse> {
  return json<SkillUpdateStatusResponse>(
    "/api/skills/update/status"
  );
}

export function applySkillUpdate():
  Promise<SkillUpdateApplyResponse> {
  return json<SkillUpdateApplyResponse>(
    "/api/skills/update/apply",
    { method: "POST" }
  );
}

export function downloadApplicationUpdate():
  Promise<ApplicationUpdateDownloadResponse> {
  return json<ApplicationUpdateDownloadResponse>(
    "/api/update/download",
    { method: "POST" }
  );
}

export async function installStagedApplicationUpdate(
  receiptToken: string
): Promise<void> {
  if (!isDesktopShell()) {
    throw new ApiError(
      "APPLICATION_UPDATE_DESKTOP_REQUIRED",
      409
    );
  }
  const internals = (
    window as Window & {
      __TAURI_INTERNALS__?: {
        invoke?: (
          command: string,
          args?: Record<string, unknown>
        ) => Promise<unknown>;
      };
    }
  ).__TAURI_INTERNALS__;
  if (!internals?.invoke) {
    throw new ApiError(
      "TAURI_INVOKE_UNAVAILABLE",
      503
    );
  }
  await internals.invoke(
    "install_application_update",
    { receiptToken }
  );
}

export function getProviderStatus(): Promise<ProviderStatusResponse> {
  return json<ProviderStatusResponse>("/api/providers");
}

export function getModelRoutingPreferences():
  Promise<ModelRoutingPreferences> {
  return json<ModelRoutingPreferences>(
    "/api/model-routing/preferences"
  );
}

export function setModelRoutingPreferences(
  input: ModelRoutingPreferences
): Promise<ModelRoutingPreferences> {
  return json<ModelRoutingPreferences>(
    "/api/model-routing/preferences",
    {
      method: "PUT",
      body: JSON.stringify({
        auxiliaryEnabled:
          input.auxiliaryEnabled,
        auxiliaryProvider:
          input.auxiliaryProvider,
        auxiliaryModel:
          input.auxiliaryModel
      })
    }
  );
}

export function validateRoute(
  primarySkill: string
): Promise<RouteValidationResponse> {
  return json<RouteValidationResponse>("/api/routes/validate", {
    method: "POST",
    body: JSON.stringify({ primarySkill })
  });
}

export function getModels(
  provider: ProviderId
): Promise<ModelsResponse> {
  return json<ModelsResponse>(`/api/models/${provider}`);
}

export function getLocalModels():
  Promise<LocalModelsResponse> {
  return json<LocalModelsResponse>(
    "/api/local-models"
  );
}

export function getProcessPleadingWorkflow(
  caseId: string
): Promise<ProcessPleadingWorkflowResponse> {
  return json<ProcessPleadingWorkflowResponse>(
    `/api/cases/${caseId}/workflow/process-pleading`
  );
}

export function initializeProcessPleadingWorkflow(
  caseId: string,
  mode: "CHECKPOINT" | "AUTO" = "CHECKPOINT"
): Promise<{
  caseId: string;
  state: ProcessPleadingWorkflowState;
}> {
  return json(
    `/api/cases/${caseId}/workflow/process-pleading/initialize`,
    {
      method: "POST",
      body: JSON.stringify({ mode })
    }
  );
}

export function acceptProcessPleadingWorkflowStart(
  caseId: string
): Promise<{
  caseId: string;
  state: ProcessPleadingWorkflowState;
}> {
  return json(
    `/api/cases/${caseId}/workflow/process-pleading/accept-start`,
    { method: "POST" }
  );
}

export function confirmProcessPleadingCheckpoint(
  caseId: string,
  checkpoint: ProcessPleadingCheckpoint
): Promise<{
  caseId: string;
  state: ProcessPleadingWorkflowState;
}> {
  return json(
    `/api/cases/${caseId}/workflow/process-pleading/confirm`,
    {
      method: "POST",
      body: JSON.stringify({
        checkpoint
      })
    }
  );
}

export function executeSession(input: {
  query: string;
  provider: ProviderId;
  model: string;
  primarySkill: string;
  auxiliaryText?: string;
  mode?: "LAIK" | "PRAWNIK";
  attachments?: DocumentAttachmentSelection[];
  knowledge?: {
    caseId?: string;
    includeCase?: boolean;
    includeFirm?: boolean;
    limit?: number;
  };
}): Promise<SessionExecutionResponse> {
  return json<SessionExecutionResponse>("/api/sessions/execute", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      mode: input.mode ?? "PRAWNIK"
    })
  });
}

function uploadMediaType(file: File): string {
  if (file.type) return file.type;
  const lower =
    file.name.toLowerCase();
  if (lower.endsWith(".zip")) {
    return "application/zip";
  }
  if (lower.endsWith(".pdf")) {
    return "application/pdf";
  }
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lower.endsWith(".odt")) {
    return "application/vnd.oasis.opendocument.text";
  }
  if (lower.endsWith(".xlsx")) {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  if (lower.endsWith(".xlsm")) {
    return "application/vnd.ms-excel.sheet.macroenabled.12";
  }
  if (lower.endsWith(".csv")) {
    return "text/csv";
  }
  if (lower.endsWith(".tsv")) {
    return "text/tab-separated-values";
  }

  if (lower.endsWith(".md")) {
    return "text/markdown";
  }
  if (lower.endsWith(".txt")) {
    return "text/plain";
  }
  return "application/octet-stream";
}

export async function uploadCaseFile(
  caseId: string,
  file: File
): Promise<StoredUploadResponse> {
  const response = await fetch(
    `${apiBase()}/api/cases/${caseId}/files`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": uploadMediaType(file),
        ...authorizationHeaders(),
        "X-Lex-Filename":
          encodeURIComponent(file.name)
      },
      body: file
    }
  );
  const payload =
    await response.json() as
      | StoredUploadResponse
      | ApiFailure;
  if (!response.ok) {
    throw new Error(
      (payload as ApiFailure).error ||
      `HTTP_${response.status}`
    );
  }
  return payload as StoredUploadResponse;
}

export async function reviewDocument(
  file: File,
  caseId: string
): Promise<DocumentReviewResponse> {
  const response = await fetch(
    `${apiBase()}/api/documents/review`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": uploadMediaType(file),
        ...authorizationHeaders(),
        "X-Lex-Case-Id": caseId,
        "X-Lex-Filename":
          encodeURIComponent(file.name)
      },
      body: file
    }
  );
  const payload =
    await response.json() as
      | DocumentReviewResponse
      | ApiFailure;
  if (!response.ok) {
    throw new Error(
      (payload as ApiFailure).error ||
      `HTTP_${response.status}`
    );
  }
  return payload as DocumentReviewResponse;
}

/**
 * Re-run OCR and the local pseudonymizer over a file that is already stored in
 * the case files. Until now this endpoint existed but nothing called it, so the
 * privacy pipeline could only ever run at upload time and a document that
 * failed or arrived before a decision could not be reprocessed.
 */
export async function processStoredCaseFile(
  caseId: string,
  uploadId: string,
  fileId?: string
): Promise<DocumentReviewResponse> {
  const path = fileId
    ? `/api/cases/${caseId}/files/${uploadId}/members/${fileId}/process`
    : `/api/cases/${caseId}/files/${uploadId}/process`;
  return json<DocumentReviewResponse>(
    path,
    { method: "POST" }
  );
}

export function finalizeDocument(
  caseId: string,
  documentId: string,
  directives: PagePrivacyDirective[]
): Promise<DocumentIngestionResponse> {
  return json<DocumentIngestionResponse>(
    `/api/documents/${documentId}/finalize`,
    {
      method: "POST",
      body: JSON.stringify({
        caseId,
        directives
      })
    }
  );
}
