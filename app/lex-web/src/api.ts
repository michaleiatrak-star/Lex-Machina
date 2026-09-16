export type ProviderId = "openai" | "anthropic" | "xai";

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

export type CaseResponse = {
  caseId: string;
  displayName?: string;
  createdAt: string;
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

export type ProviderStatusResponse = {
  providers: ProviderConfigurationStatus[];
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
};

const DEFAULT_API_BASE = "http://127.0.0.1:4317";

export function apiBase(): string {
  const configured = import.meta.env.VITE_LEX_API_BASE;
  return typeof configured === "string" && configured.trim()
    ? configured.trim().replace(/\/$/, "")
    : DEFAULT_API_BASE;
}

async function json<T>(
  pathname: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBase()}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    }
  });

  const payload = await response.json() as T | ApiFailure;
  if (!response.ok) {
    const failure = payload as ApiFailure;
    throw new Error(failure.error || `HTTP_${response.status}`);
  }
  return payload as T;
}

export function getHealth(): Promise<HealthResponse> {
  return json<HealthResponse>("/health");
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

export function getRoutes(): Promise<RouteListResponse> {
  return json<RouteListResponse>("/api/routes");
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
  documentId: string,
  directives: PagePrivacyDirective[]
): Promise<DocumentIngestionResponse> {
  return json<DocumentIngestionResponse>(
    `/api/documents/${documentId}/finalize`,
    {
      method: "POST",
      body: JSON.stringify({
        directives
      })
    }
  );
}
