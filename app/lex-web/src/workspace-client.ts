import {
  apiBase,
  authorizationHeaders,
  isDesktopShell
} from "./api.js";

export type WorkspaceFolder = {
  folderId: string;
  parentId: string | null;
  name: string;
  createdAt: string;
};

export type WorkspaceItem = {
  kind: "UPLOAD" | "TEMPLATE";
  itemId: string;
  filename: string;
  mediaType: string;
  bytes: number;
  createdAt: string;
  archive: boolean;
};

export type WorkspaceDocumentCitation = {
  citationId: string;
  marker: string;
  label: string;
  caseId?: string;
  documentId: string;
  chunkIndex: number;
  pageStart: number;
  pageEnd: number;
  contextText: string;
  quote?: string;
  highlightStart?: number;
  highlightEnd?: number;
};

export type WorkspaceThreadMessage = {
  messageId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  meta?: string;
  documentCitations?: WorkspaceDocumentCitation[];
  restorations?: RestorationMark[];
};

/** A value put back into model output locally (never sent to the model). */
export type RestorationMark = {
  start: number;
  end: number;
  token: string;
  kind: string;
  case?: string;
  source: string;
  confidence: number;
  status: string;
  canonical?: string;
  gender?: "m1" | "f";
};

export type WorkspaceResponse = {
  caseId: string;
  caseKind: "MATTER" | "FIRM_KNOWLEDGE";
  caseDisplayName: string;
  folders: WorkspaceFolder[];
  itemLocations: Record<string, string | null>;
  items: WorkspaceItem[];
};

async function workspaceJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...authorizationHeaders(),
      ...init?.headers
    },
    cache: "no-store"
  });
  if (!response.ok) {
    let code = `HTTP_${response.status}`;
    try {
      const body = await response.json() as { error?: string };
      code = body.error || code;
    } catch {
      // Preserve the HTTP code for non-JSON failures.
    }
    throw new Error(code);
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

export function getWorkspace(caseId: string): Promise<WorkspaceResponse> {
  return workspaceJson(`/api/cases/${caseId}/workspace`);
}

export function createWorkspaceFolder(
  caseId: string,
  name: string,
  parentId: string | null
): Promise<{ folder: WorkspaceFolder }> {
  return workspaceJson(`/api/cases/${caseId}/workspace/folders`, {
    method: "POST",
    body: JSON.stringify({ name, parentId })
  });
}

export function deleteWorkspaceFolder(
  caseId: string,
  folderId: string
): Promise<void> {
  return workspaceJson(`/api/cases/${caseId}/workspace/folders/${folderId}`, {
    method: "DELETE"
  });
}

export function moveWorkspaceItem(
  caseId: string,
  itemId: string,
  folderId: string | null
): Promise<{ itemId: string; folderId: string | null }> {
  return workspaceJson(`/api/cases/${caseId}/workspace/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ folderId })
  });
}

export function deleteWorkspaceItem(
  caseId: string,
  itemId: string
): Promise<void> {
  return workspaceJson(`/api/cases/${caseId}/workspace/items/${itemId}`, {
    method: "DELETE"
  });
}

export async function previewWorkspaceItem(
  caseId: string,
  itemId: string
): Promise<{ blob: Blob; mediaType: string }> {
  const response = await fetch(
    `${apiBase()}/api/cases/${caseId}/workspace/items/${itemId}/preview`,
    {
      cache: "no-store",
      headers: {
        ...authorizationHeaders()
      }
    }
  );
  if (!response.ok) {
    throw new Error(`WORKSPACE_PREVIEW_HTTP_${response.status}`);
  }
  return {
    blob: await response.blob(),
    mediaType: response.headers.get("content-type") || "application/octet-stream"
  };
}

export async function openWorkspaceItemInSystem(
  caseId: string,
  itemId: string
): Promise<void> {
  if (!isDesktopShell()) {
    throw new Error("SYSTEM_OPEN_DESKTOP_ONLY");
  }
  const staged = await workspaceJson<{
    token: string;
    filename: string;
    expiresAt: string;
  }>(`/api/cases/${caseId}/workspace/items/${itemId}/open`, {
    method: "POST"
  });
  const internals = (
    window as Window & {
      __TAURI_INTERNALS__?: {
        invoke?: (command: string, args?: Record<string, unknown>) => Promise<unknown>;
      };
    }
  ).__TAURI_INTERNALS__;
  if (!internals?.invoke) throw new Error("TAURI_INVOKE_UNAVAILABLE");
  await internals.invoke("open_workspace_file", { token: staged.token });
}

export function getCaseThread(
  caseId: string
): Promise<{ caseId: string; messages: WorkspaceThreadMessage[] }> {
  return workspaceJson(`/api/cases/${caseId}/workspace/thread`);
}

export function appendCaseThreadMessage(
  caseId: string,
  message: WorkspaceThreadMessage
): Promise<{ message: WorkspaceThreadMessage }> {
  return workspaceJson(`/api/cases/${caseId}/workspace/thread/messages`, {
    method: "POST",
    body: JSON.stringify(message)
  });
}

export type EditableRun = { text: string; b: boolean; i: boolean; u: boolean };
export type EditableBlock =
  | { type: "heading"; level: number; runs: EditableRun[] }
  | { type: "paragraph"; runs: EditableRun[] }
  | { type: "list"; ordered: boolean; items: EditableRun[][] }
  | { type: "table"; rows: string[][] };
export type EditableDocument = { kind: "document"; blocks: EditableBlock[] };
export type EditableSheets = {
  kind: "sheet";
  sheets: Array<{ name: string; rows: string[][] }>;
  truncated: boolean;
  delimiter?: string;
};
export type EditableModel = EditableDocument | EditableSheets;
export type EditableFormat = "docx" | "odt" | "xlsx" | "csv" | "tsv";

export function getEditableItem(
  caseId: string,
  itemId: string
): Promise<{ filename: string; mediaType: string; model: EditableModel }> {
  return workspaceJson(`/api/cases/${caseId}/workspace/items/${itemId}/editable`);
}

/** Renders an edited model to file bytes; the caller stores them as a new case file. */
export async function renderEditable(
  caseId: string,
  request: { format: EditableFormat; model: EditableModel; delimiter?: string }
): Promise<Blob> {
  const response = await fetch(`${apiBase()}/api/cases/${caseId}/workspace/render`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...authorizationHeaders()
    },
    body: JSON.stringify(request)
  });
  if (!response.ok) {
    let code = `HTTP_${response.status}`;
    try {
      const body = await response.json() as { error?: string; detail?: string };
      code = body.detail || body.error || code;
    } catch {
      // Keep the HTTP code.
    }
    throw new Error(code);
  }
  return await response.blob();
}
