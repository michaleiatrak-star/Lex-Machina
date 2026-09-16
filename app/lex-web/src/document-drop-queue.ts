export const MAX_DOCUMENT_DROP_QUEUE = 20;

export const DOCUMENT_FILE_ACCEPT =
  ".pdf,.docx,.odt,.xlsx,.xlsm,.csv,.tsv,.txt,.md,.zip,application/pdf,application/zip,text/plain,text/markdown,text/csv,text/tab-separated-values,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12,image/jpeg,image/png,image/webp,image/tiff";

export type DocumentDropQueueState = {
  files: File[];
  total: number;
  completed: number;
  rejected: number;
};

export function createDocumentDropQueueState():
  DocumentDropQueueState {
  return {
    files: [],
    total: 0,
    completed: 0,
    rejected: 0
  };
}

export function enqueueDocumentDropFiles(
  state: DocumentDropQueueState,
  incoming: readonly File[]
): DocumentDropQueueState {
  const finished =
    state.files.length === 0 &&
    state.total > 0 &&
    state.completed >= state.total;
  const base = finished
    ? createDocumentDropQueueState()
    : state;
  const nonEmpty =
    incoming.filter(
      (file) =>
        Number.isFinite(file.size) &&
        file.size > 0
    );
  const invalid =
    incoming.length - nonEmpty.length;
  const room =
    Math.max(
      0,
      MAX_DOCUMENT_DROP_QUEUE -
        base.files.length
    );
  const accepted =
    nonEmpty.slice(0, room);
  const rejected =
    invalid +
    Math.max(
      0,
      nonEmpty.length - accepted.length
    );

  if (
    accepted.length === 0 &&
    rejected === 0
  ) {
    return base;
  }

  return {
    files: [
      ...base.files,
      ...accepted
    ],
    total:
      base.total +
      accepted.length,
    completed:
      base.completed,
    rejected:
      base.rejected +
      rejected
  };
}

export function consumeDocumentDropFile(
  state: DocumentDropQueueState
): DocumentDropQueueState {
  if (state.files.length === 0) {
    return state;
  }
  return {
    ...state,
    files:
      state.files.slice(1),
    completed:
      Math.min(
        state.total,
        state.completed + 1
      )
  };
}

function formatBytes(
  bytes: number
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }
  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function fallbackType(
  file: File
): string {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.trim()
      .toLowerCase();
  return extension
    ? `.${extension}`
    : "typ nieznany";
}

export function describeDocumentFile(
  file: File
): string {
  const type =
    file.type.trim() ||
    fallbackType(file);
  return `${formatBytes(
    file.size
  )} · ${type}`;
}
