import { MAX_DOCUMENT_DROP_QUEUE } from "./document-drop-queue.js";
import {
  DEFAULT_DOCUMENT_PROCESSING_MODE,
  type DocumentProcessingMode
} from "./document-processing-mode.js";

/**
 * Files added in the chat wait for the user's decision, one by one: process
 * now (OCR and privacy review), save to the case without processing (the
 * case documents list can process them later), or remove. Nothing starts OCR
 * on its own.
 */

export type StagedDocument = {
  id: string;
  file: File;
  mode: DocumentProcessingMode;
  status: "PENDING" | "SAVING" | "FAILED";
  error?: string;
};

export type DocumentStagingState = {
  items: StagedDocument[];
  rejected: number;
};

export function createDocumentStagingState(): DocumentStagingState {
  return { items: [], rejected: 0 };
}

let sequence = 0;

export function stageDocuments(
  state: DocumentStagingState,
  incoming: readonly File[],
  limit = MAX_DOCUMENT_DROP_QUEUE
): DocumentStagingState {
  const nonEmpty = incoming.filter(
    (file) => Number.isFinite(file.size) && file.size > 0
  );
  const room = Math.max(0, limit - state.items.length);
  const accepted = nonEmpty.slice(0, room);
  return {
    items: [
      ...state.items,
      ...accepted.map((file) => ({
        id: `staged-${Date.now().toString(36)}-${(sequence += 1)}`,
        file,
        mode: DEFAULT_DOCUMENT_PROCESSING_MODE,
        status: "PENDING" as const
      }))
    ],
    rejected:
      state.rejected +
      (incoming.length - nonEmpty.length) +
      (nonEmpty.length - accepted.length)
  };
}

export function updateStagedDocument(
  state: DocumentStagingState,
  id: string,
  change: Pick<StagedDocument, "status"> & { error?: string }
): DocumentStagingState {
  return {
    ...state,
    items: state.items.map((item) => {
      if (item.id !== id) return item;
      const { error: _previous, ...rest } = item;
      return change.error
        ? { ...rest, status: change.status, error: change.error }
        : { ...rest, status: change.status };
    })
  };
}

/** Removes the given items (or all when ids is omitted) and returns them. */
export function takeStagedDocuments(
  state: DocumentStagingState,
  ids?: readonly string[]
): { files: File[]; items: StagedDocument[]; state: DocumentStagingState } {
  const taken = state.items.filter(
    (item) => item.status !== "SAVING" && (!ids || ids.includes(item.id))
  );
  const takenIds = new Set(taken.map((item) => item.id));
  const rest = state.items.filter((item) => !takenIds.has(item.id));
  return {
    files: taken.map((item) => item.file),
    items: taken,
    state: { items: rest, rejected: rest.length === 0 ? 0 : state.rejected }
  };
}

export function setStagedDocumentMode(
  state: DocumentStagingState,
  id: string,
  mode: DocumentProcessingMode
): DocumentStagingState {
  return {
    ...state,
    items: state.items.map((item) => (item.id === id ? { ...item, mode } : item))
  };
}
