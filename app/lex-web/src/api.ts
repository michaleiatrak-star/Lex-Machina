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
  sessionToken: string;
};

export type AuthMeResponse = {
  user: AuthenticatedUser;
  session: AuthSessionInfo;
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
  caseKind?: CaseKind;
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
    | "image/tiff";
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
  inputModalities?: string[];
  outputModalities?: string[];
  capabilities?: string[];
};

export type ModelsResponse = {
  provider: ProviderId;
  models: ModelDescriptor[];
};

export type ProviderConfigurationStatus = {
  provider: ProviderId;
  configured: boolean;
};

export type ProviderCredentialMutationResponse = {
  provider: ProviderId;
  storage: "PROCESS_MEMORY";
  configured?: boolean;
  cleared?: boolean;
};

export type ProviderStatusResponse = {
  providers: ProviderConfigurationStatus[];
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
  primarySkill: string;
  answer?: string;
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
  };
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

function setAuthSessionToken(token: string): void {
  inMemorySessionToken = token;
}

function authorizationHeaders():
  Record<string, string> {
  return inMemorySessionToken
    ? {
        Authorization:
          `Bearer ${inMemorySessionToken}`
      }
    : {};
}

export function apiBase(): string {
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
  const result =
    await json<AuthSuccessResponse>(
      "/api/auth/login",
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

export function getRoutes(): Promise<RouteListResponse> {
  return json<RouteListResponse>("/api/routes");
}

export function setProviderApiKey(
  provider: ProviderId,
  apiKey: string
): Promise<ProviderCredentialMutationResponse> {
  return json<ProviderCredentialMutationResponse>(
    `/api/admin/providers/${provider}/credential`,
    {
      method: "PUT",
      body: JSON.stringify({
        apiKey
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

export function getUpdateStatus():
  Promise<UpdateStatusResponse> {
  return json<UpdateStatusResponse>(
    "/api/update/status"
  );
}

export function getProviderStatus(): Promise<ProviderStatusResponse> {
  return json<ProviderStatusResponse>("/api/providers");
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

export function executeSession(input: {
  query: string;
  provider: ProviderId;
  model: string;
  primarySkill: string;
  mode?: "LAIK" | "PRAWNIK";
  attachments?: DocumentAttachmentSelection[];
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
  if (file.name.toLowerCase().endsWith(".zip")) {
    return "application/zip";
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
