export type ProviderId = "openai" | "anthropic" | "xai";

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

export type SessionExecutionRequest = {
  query: string;
  provider: ProviderId;
  model: string;
  primarySkill: string;
  mode: "LAIK" | "PRAWNIK";
};

export type BlockedReference = {
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
  blockedReferences: BlockedReference[];
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

export function getRoutes(): Promise<RouteListResponse> {
  return json<RouteListResponse>("/api/routes");
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

export function executeSession(
  request: SessionExecutionRequest
): Promise<SessionExecutionResponse> {
  return json<SessionExecutionResponse>("/api/sessions/execute", {
    method: "POST",
    body: JSON.stringify(request)
  });
}
