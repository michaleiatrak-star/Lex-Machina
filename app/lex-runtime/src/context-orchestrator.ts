import type {
  SessionDocumentAttachment
} from "./session-executor.js";

export type ContextBudgetReport = {
  strategy: "MODEL_CONTEXT_WINDOW" | "LEGACY_CHAR_CAP";
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

export type OrchestratedDocumentContext = {
  attachments: SessionDocumentAttachment[];
  report: ContextBudgetReport;
};

const LEGACY_CHAR_CAP = 160_000;
const MIN_CONTEXT_WINDOW = 8_192;
const MAX_CONTEXT_WINDOW = 262_144;

function estimateTokens(text: string): number {
  // Conservative for Polish/legal prose: assume at most ~3 UTF-16 chars/token.
  return Math.max(1, Math.ceil(text.length / 3));
}

function metadataTokens(
  attachment: SessionDocumentAttachment,
  chunk: SessionDocumentAttachment["chunks"][number]
): number {
  const scope =
    attachment.sourceScope ?? "MANUAL";
  return estimateTokens(
    `[${scope} ${attachment.documentId} CHUNK ${chunk.index} PAGES ${chunk.pageStart}-${chunk.pageEnd}]`
  ) + 8;
}

function chunkTokens(
  attachment: SessionDocumentAttachment,
  chunk: SessionDocumentAttachment["chunks"][number]
): number {
  return estimateTokens(chunk.text) +
    metadataTokens(attachment, chunk);
}

function cloneWithChunks(
  attachment: SessionDocumentAttachment,
  chunks: SessionDocumentAttachment["chunks"]
): SessionDocumentAttachment {
  return {
    ...attachment,
    chunks: chunks.map((chunk) => ({
      ...chunk
    }))
  };
}

function sourcePriority(
  scope: SessionDocumentAttachment["sourceScope"]
): number {
  if (scope === "MANUAL" || scope === undefined) {
    return 0;
  }
  if (scope === "CASE_KNOWLEDGE") {
    return 1;
  }
  return 2;
}

export function orchestrateDocumentContext(args: {
  attachments: readonly SessionDocumentAttachment[];
  query: string;
  systemPrompt?: string;
  modelContextTokens?: number;
}): OrchestratedDocumentContext {
  const attachments =
    args.attachments.map((attachment) =>
      cloneWithChunks(
        attachment,
        attachment.chunks
      )
    );

  if (attachments.length > 4) {
    throw new Error(
      "TOO_MANY_DOCUMENT_ATTACHMENTS"
    );
  }

  if (attachments.length === 0) {
    return {
      attachments: [],
      report: {
        strategy:
          args.modelContextTokens
            ? "MODEL_CONTEXT_WINDOW"
            : "LEGACY_CHAR_CAP",
        ...(args.modelContextTokens
          ? {
              modelContextTokens:
                args.modelContextTokens
            }
          : {}),
        estimatedDocumentTokens: 0,
        selectedChunks: 0,
        omittedChunks: 0,
        selectedDocuments: 0,
        omittedDocuments: 0
      }
    };
  }

  const modelContextTokens =
    args.modelContextTokens;
  if (
    modelContextTokens === undefined
  ) {
    let totalChars = 0;
    for (const attachment of attachments) {
      for (const chunk of attachment.chunks) {
        totalChars += chunk.text.length;
      }
    }
    if (totalChars > LEGACY_CHAR_CAP) {
      throw new Error(
        "DOCUMENT_ATTACHMENT_CONTEXT_TOO_LARGE"
      );
    }
    return {
      attachments,
      report: {
        strategy: "LEGACY_CHAR_CAP",
        estimatedDocumentTokens:
          attachments.reduce(
            (sum, attachment) =>
              sum +
              attachment.chunks.reduce(
                (chunkSum, chunk) =>
                  chunkSum +
                  chunkTokens(
                    attachment,
                    chunk
                  ),
                0
              ),
            0
          ),
        selectedChunks:
          attachments.reduce(
            (sum, attachment) =>
              sum +
              attachment.chunks.length,
            0
          ),
        omittedChunks: 0,
        selectedDocuments:
          attachments.length,
        omittedDocuments: 0
      }
    };
  }

  if (
    !Number.isInteger(modelContextTokens) ||
    modelContextTokens <
      MIN_CONTEXT_WINDOW ||
    modelContextTokens >
      MAX_CONTEXT_WINDOW
  ) {
    throw new Error(
      "MODEL_CONTEXT_WINDOW_INVALID"
    );
  }

  const outputReserve =
    Math.min(
      16_384,
      Math.max(
        4_096,
        Math.floor(
          modelContextTokens * 0.12
        )
      )
    );
  const systemReserve =
    args.systemPrompt === undefined
      ? Math.min(
          48_000,
          Math.max(
            12_000,
            Math.floor(
              modelContextTokens * 0.3
            )
          )
        )
      : Math.max(
          4_096,
          Math.min(
            48_000,
            estimateTokens(
              args.systemPrompt
            ) +
              estimateTokens(
                args.query
              ) +
              2_048
          )
        );
  const safetyReserve =
    Math.max(
      2_048,
      Math.floor(
        modelContextTokens * 0.04
      )
    );
  const documentBudget =
    modelContextTokens -
    outputReserve -
    systemReserve -
    safetyReserve;

  if (documentBudget < 4_096) {
    throw new Error(
      "MODEL_CONTEXT_BUDGET_TOO_SMALL"
    );
  }

  const manual = attachments
    .filter(
      (attachment) =>
        sourcePriority(
          attachment.sourceScope
        ) === 0
    );
  const knowledge = attachments
    .filter(
      (attachment) =>
        sourcePriority(
          attachment.sourceScope
        ) > 0
    )
    .sort(
      (left, right) =>
        sourcePriority(
          left.sourceScope
        ) -
        sourcePriority(
          right.sourceScope
        )
    );

  let used = 0;
  const selected:
    SessionDocumentAttachment[] = [];
  let selectedChunks = 0;
  let omittedChunks = 0;
  const omittedDocumentIds =
    new Set<string>();

  // User-selected/manual evidence is never silently truncated.
  for (const attachment of manual) {
    const cost =
      attachment.chunks.reduce(
        (sum, chunk) =>
          sum +
          chunkTokens(
            attachment,
            chunk
          ),
        0
      );
    if (used + cost > documentBudget) {
      throw new Error(
        "MANUAL_DOCUMENT_CONTEXT_EXCEEDS_BUDGET"
      );
    }
    used += cost;
    selectedChunks +=
      attachment.chunks.length;
    selected.push(
      cloneWithChunks(
        attachment,
        attachment.chunks
      )
    );
  }

  // Retrieved knowledge fills only the remaining budget and is cut at
  // deterministic chunk boundaries.
  for (const attachment of knowledge) {
    const chunks:
      SessionDocumentAttachment["chunks"] =
        [];
    for (const chunk of attachment.chunks) {
      const cost =
        chunkTokens(
          attachment,
          chunk
        );
      if (
        used + cost <=
          documentBudget
      ) {
        used += cost;
        chunks.push({ ...chunk });
        selectedChunks += 1;
      } else {
        omittedChunks += 1;
        omittedDocumentIds.add(
          attachment.documentId
        );
      }
    }
    if (chunks.length > 0) {
      selected.push(
        cloneWithChunks(
          attachment,
          chunks
        )
      );
    }
  }

  const allChunks =
    attachments.reduce(
      (sum, attachment) =>
        sum +
        attachment.chunks.length,
      0
    );
  omittedChunks +=
    Math.max(
      0,
      allChunks -
      selectedChunks -
      omittedChunks
    );

  const selectedIds =
    new Set(
      selected.map(
        (attachment) =>
          attachment.documentId
      )
    );
  for (const attachment of attachments) {
    if (
      !selectedIds.has(
        attachment.documentId
      )
    ) {
      omittedDocumentIds.add(
        attachment.documentId
      );
    }
  }

  return {
    attachments: selected,
    report: {
      strategy:
        "MODEL_CONTEXT_WINDOW",
      modelContextTokens,
      reservedOutputTokens:
        outputReserve,
      reservedSystemTokens:
        systemReserve +
        safetyReserve,
      documentBudgetTokens:
        documentBudget,
      estimatedDocumentTokens:
        used,
      selectedChunks,
      omittedChunks,
      selectedDocuments:
        selectedIds.size,
      omittedDocuments:
        omittedDocumentIds.size
    }
  };
}
