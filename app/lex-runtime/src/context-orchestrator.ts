import type {
  SessionDocumentAttachment
} from "./session-executor.js";

export type ContextBudgetReport = {
  strategy: "MODEL_CONTEXT_WINDOW" | "LEGACY_CHAR_CAP";
  modelContextTokens?: number;
  reservedOutputTokens?: number;
  reservedSystemTokens?: number;
  documentBudgetTokens?: number;
  tokenEstimation:
    | "CONSERVATIVE_CHAR_HEURISTIC"
    | "CALIBRATED_LOCAL_TOKENIZER";
  charsPerTokenEstimate: number;
  estimatedDocumentTokens: number;
  selectedChunks: number;
  compressedChunks: number;
  backlinkedChunks: number;
  compressionSavedTokens: number;
  omittedChunks: number;
  selectedDocuments: number;
  omittedDocuments: number;
  // What reached the model, per document (shown to the user after sending).
  documents?: DocumentDelivery[];
};

export type DocumentDelivery = {
  documentId: string;
  title?: string;
  sourceScope?: SessionDocumentAttachment["sourceScope"];
  chunks: number;
  fullChunks: number;
  digestChunks: number;
  status: "FULL" | "PARTIAL" | "DIGEST" | "OMITTED";
};

/** User-selected documents do not fit the model window; nothing is truncated. */
export class ContextBudgetError extends Error {
  constructor(
    code: string,
    readonly details: { budgetTokens: number; neededTokens: number; documents: number }
  ) {
    super(code);
  }
}

function delivery(
  attachment: SessionDocumentAttachment,
  sent: SessionDocumentAttachment["chunks"]
): DocumentDelivery {
  const digestChunks = sent.filter((chunk) => chunk.representation === "EXTRACTIVE_DIGEST").length;
  const fullChunks = sent.length - digestChunks;
  const chunks = attachment.chunks.length;
  return {
    documentId: attachment.documentId,
    ...(attachment.title ? { title: attachment.title } : {}),
    ...(attachment.sourceScope ? { sourceScope: attachment.sourceScope } : {}),
    chunks,
    fullChunks,
    digestChunks,
    status:
      sent.length === 0
        ? "OMITTED"
        : fullChunks === chunks
          ? "FULL"
          : digestChunks > 0 && fullChunks === 0 && sent.length === chunks
            ? "DIGEST"
            : "PARTIAL"
  };
}

export type OrchestratedDocumentContext = {
  attachments: SessionDocumentAttachment[];
  citationSources: SessionDocumentAttachment[];
  report: ContextBudgetReport;
};

// Documents in one message; the context window decides how much of them fits.
export const MAX_DOCUMENT_ATTACHMENTS = 20;
// A local model gets fewer: long prompts make it slow and unreliable.
export const LOCAL_MAX_DOCUMENT_ATTACHMENTS = 4;
// Hosted APIs do not report their window; a conservative one per provider.
export const HOSTED_CONTEXT_TOKENS: Record<string, number> = {
  anthropic: 200_000,
  openai: 128_000,
  xai: 128_000
};
const LEGACY_CHAR_CAP = 160_000;
const MIN_CONTEXT_WINDOW = 8_192;
const MAX_CONTEXT_WINDOW = 262_144;
const DIGEST_MIN_TOKENS = 96;
const DIGEST_MAX_TOKENS = 1_024;
const DIGEST_SEPARATOR = "\n[…]\n";

const QUERY_STOP_WORDS =
  new Set([
    "oraz",
    "jest",
    "dla",
    "nie",
    "sie",
    "czy",
    "jak",
    "lub",
    "ale",
    "przez",
    "przy",
    "ten",
    "ta",
    "to",
    "te",
    "tych",
    "tym",
    "ktory",
    "ktora",
    "ktore",
    "jako",
    "jego",
    "jej",
    "ich"
  ]);

function estimateTokens(
  text: string,
  charsPerToken: number
): number {
  return Math.max(
    1,
    Math.ceil(
      text.length /
        charsPerToken
    )
  );
}
function normalizedText(
  value: string
): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function queryTerms(
  value: string
): string[] {
  return [
    ...new Set(
      (
        normalizedText(value)
          .match(/[\p{L}\p{N}]+/gu) ??
        []
      ).filter(
        (term) =>
          term.length >= 3 &&
          !QUERY_STOP_WORDS.has(
            term
          )
      )
    )
  ].slice(0, 32);
}

function extractiveDigest(
  text: string,
  query: string,
  maxTokens: number,
  charsPerToken: number
): string | null {
  if (
    maxTokens <
      DIGEST_MIN_TOKENS
  ) {
    return null;
  }

  const maxChars =
    Math.max(
      1,
      Math.floor(
        maxTokens *
          charsPerToken
      )
    );
  const terms =
    queryTerms(query);
  const candidates:
    Array<{
      index: number;
      text: string;
      score: number;
    }> = [];

  const pattern =
    /[^\n.!?]+(?:[.!?]+|(?=\n)|$)/gu;
  let match:
    RegExpExecArray | null;
  let sequence = 0;
  while (
    (
      match =
        pattern.exec(text)
    ) !== null
  ) {
    const exact =
      match[0]
        ?.trim();
    if (!exact) {
      continue;
    }
    const normalized =
      normalizedText(exact);
    let score = 0;
    for (
      const term of terms
    ) {
      let cursor = 0;
      while (
        (
          cursor =
            normalized.indexOf(
              term,
              cursor
            )
        ) >= 0
      ) {
        score += 1;
        cursor +=
          term.length;
      }
    }
    candidates.push({
      index:
        sequence,
      text:
        exact,
      score
    });
    sequence += 1;
  }

  if (
    candidates.length === 0
  ) {
    const fallback =
      text
        .slice(
          0,
          maxChars
        )
        .trim();
    return fallback ||
      null;
  }

  const ranked =
    [...candidates]
      .sort(
        (left, right) =>
          right.score -
            left.score ||
          left.index -
            right.index
      );

  const chosen:
    typeof candidates = [];
  let usedChars = 0;
  for (
    const candidate
    of ranked
  ) {
    const separatorChars =
      chosen.length > 0
        ? DIGEST_SEPARATOR
            .length
        : 0;
    const remaining =
      maxChars -
      usedChars -
      separatorChars;
    if (
      remaining <= 0
    ) {
      break;
    }

    const excerpt =
      candidate.text.length <=
        remaining
        ? candidate.text
        : candidate.text
            .slice(
              0,
              remaining
            )
            .trimEnd();
    if (!excerpt) {
      continue;
    }
    chosen.push({
      ...candidate,
      text:
        excerpt
    });
    usedChars +=
      separatorChars +
      excerpt.length;
    if (
      usedChars >=
        maxChars
    ) {
      break;
    }
  }

  return chosen
    .sort(
      (left, right) =>
        left.index -
        right.index
    )
    .map(
      (candidate) =>
        candidate.text
    )
    .join(
      DIGEST_SEPARATOR
    ) || null;
}

function metadataTokens(
  attachment: SessionDocumentAttachment,
  chunk: SessionDocumentAttachment["chunks"][number],
  charsPerToken: number
): number {
  const scope =
    attachment.sourceScope ?? "MANUAL";
  const representation =
    chunk.representation ===
      "EXTRACTIVE_DIGEST"
      ? " EXTRACTIVE_DIGEST BACKLINK ORIGINAL_CHUNK"
      : "";
  return estimateTokens(
    `[${scope} ${attachment.documentId} CHUNK ${chunk.index} PAGES ${chunk.pageStart}-${chunk.pageEnd}${representation}]`,
    charsPerToken
  ) + 8;
}

function chunkTokens(
  attachment: SessionDocumentAttachment,
  chunk: SessionDocumentAttachment["chunks"][number],
  charsPerToken: number
): number {
  return estimateTokens(
    chunk.text,
    charsPerToken
  ) +
    metadataTokens(
      attachment,
      chunk,
      charsPerToken
    );
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
  attachment: SessionDocumentAttachment
): number {
  const scope = attachment.sourceScope;
  if (attachment.selectedByUser || scope === "MANUAL" || scope === undefined) {
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
  tokenCharsPerToken?: number;
}): OrchestratedDocumentContext {
  const attachments =
    args.attachments.map((attachment) =>
      cloneWithChunks(
        attachment,
        attachment.chunks
      )
    );

  if (
    args.tokenCharsPerToken !==
      undefined &&
    (
      !Number.isFinite(
        args.tokenCharsPerToken
      ) ||
      args.tokenCharsPerToken <
        1 ||
      args.tokenCharsPerToken >
        3
    )
  ) {
    throw new Error(
      "TOKENIZER_CALIBRATION_INVALID"
    );
  }
  const charsPerTokenEstimate =
    args.tokenCharsPerToken ??
    3;
  const tokenEstimation =
    args.tokenCharsPerToken !==
      undefined
      ? "CALIBRATED_LOCAL_TOKENIZER" as const
      : "CONSERVATIVE_CHAR_HEURISTIC" as const;

  if (attachments.length > MAX_DOCUMENT_ATTACHMENTS) {
    throw new Error(
      "TOO_MANY_DOCUMENT_ATTACHMENTS"
    );
  }

  if (attachments.length === 0) {
    return {
      attachments: [],
      citationSources: [],
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
        tokenEstimation,
        charsPerTokenEstimate,
        estimatedDocumentTokens: 0,
        selectedChunks: 0,
        compressedChunks: 0,
        backlinkedChunks: 0,
        compressionSavedTokens: 0,
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
      citationSources:
        attachments.map(
          (attachment) =>
            cloneWithChunks(
              attachment,
              attachment.chunks
            )
        ),
      report: {
        strategy: "LEGACY_CHAR_CAP",
        tokenEstimation,
        charsPerTokenEstimate,
        estimatedDocumentTokens:
          attachments.reduce(
            (sum, attachment) =>
              sum +
              attachment.chunks.reduce(
                (chunkSum, chunk) =>
                  chunkSum +
                  chunkTokens(
                    attachment,
                    chunk,
                    charsPerTokenEstimate
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
        compressedChunks: 0,
        backlinkedChunks: 0,
        compressionSavedTokens: 0,
        omittedChunks: 0,
        selectedDocuments:
          attachments.length,
        omittedDocuments: 0,
        documents: attachments.map((attachment) => delivery(attachment, attachment.chunks))
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
              args.systemPrompt,
              charsPerTokenEstimate
            ) +
              estimateTokens(
                args.query,
                charsPerTokenEstimate
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
          attachment
        ) === 0
    );
  const knowledge = attachments
    .filter(
      (attachment) =>
        sourcePriority(
          attachment
        ) > 0
    )
    .sort(
      (left, right) =>
        sourcePriority(
          left
        ) -
        sourcePriority(
          right
        )
    );

  let used = 0;
  const selected:
    SessionDocumentAttachment[] = [];
  let selectedChunks = 0;
  let compressedChunks = 0;
  let backlinkedChunks = 0;
  let compressionSavedTokens = 0;
  let omittedChunks = 0;
  const selectedChunkKeys =
    new Set<string>();
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
            chunk,
            charsPerTokenEstimate
          ),
        0
      );
    if (used + cost > documentBudget) {
      const needed = manual.reduce(
        (sum, item) =>
          sum + item.chunks.reduce((chunkSum, chunk) => chunkSum + chunkTokens(item, chunk, charsPerTokenEstimate), 0),
        0
      );
      throw new ContextBudgetError(
        "MANUAL_DOCUMENT_CONTEXT_EXCEEDS_BUDGET",
        { budgetTokens: documentBudget, neededTokens: needed, documents: manual.length }
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
    for (
      const chunk
      of attachment.chunks
    ) {
      selectedChunkKeys.add(
        `${attachment.documentId}:${chunk.index}`
      );
    }
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
          chunk,
          charsPerTokenEstimate
        );
      if (
        used + cost <=
          documentBudget
      ) {
        used += cost;
        chunks.push({
          ...chunk,
          representation:
            "FULL"
        });
        selectedChunks += 1;
        selectedChunkKeys.add(
          `${attachment.documentId}:${chunk.index}`
        );
        continue;
      }

      const remaining =
        documentBudget -
        used;
      const digestBudget =
        Math.min(
          DIGEST_MAX_TOKENS,
          Math.max(
            0,
            remaining -
              metadataTokens(
                attachment,
                {
                  ...chunk,
                  text: "",
                  representation:
                    "EXTRACTIVE_DIGEST",
                  originalChars:
                    chunk.text.length
                },
                charsPerTokenEstimate
              )
          )
        );
      const digestText =
        extractiveDigest(
          chunk.text,
          args.query,
          digestBudget,
          charsPerTokenEstimate
        );
      if (digestText) {
        const digestChunk = {
          ...chunk,
          text:
            digestText,
          representation:
            "EXTRACTIVE_DIGEST" as const,
          originalChars:
            chunk.text.length
        };
        const digestCost =
          chunkTokens(
            attachment,
            digestChunk,
            charsPerTokenEstimate
          );
        if (
          used +
            digestCost <=
          documentBudget
        ) {
          used +=
            digestCost;
          chunks.push(
            digestChunk
          );
          selectedChunks += 1;
          compressedChunks += 1;
          backlinkedChunks += 1;
          compressionSavedTokens +=
            Math.max(
              0,
              cost -
                digestCost
            );
          selectedChunkKeys.add(
            `${attachment.documentId}:${chunk.index}`
          );
          continue;
        }
      }

      omittedChunks += 1;
      omittedDocumentIds.add(
        attachment.documentId
      );
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

  const citationSources =
    attachments
      .map(
        (attachment) =>
          cloneWithChunks(
            attachment,
            attachment.chunks
              .filter(
                (chunk) =>
                  selectedChunkKeys
                    .has(
                      `${attachment.documentId}:${chunk.index}`
                    )
              )
              .map(
                (chunk) => ({
                  ...chunk,
                  representation:
                    "FULL" as const
                })
              )
          )
      )
      .filter(
        (attachment) =>
          attachment.chunks
            .length > 0
      );

  return {
    attachments: selected,
    citationSources,
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
      tokenEstimation,
      charsPerTokenEstimate,
      estimatedDocumentTokens:
        used,
      selectedChunks,
      compressedChunks,
      backlinkedChunks,
      compressionSavedTokens,
      omittedChunks,
      selectedDocuments:
        selectedIds.size,
      omittedDocuments:
        omittedDocumentIds.size,
      documents: attachments.map((attachment) =>
        delivery(
          attachment,
          selected.find((item) => item.documentId === attachment.documentId)?.chunks ?? []
        )
      )
    }
  };
}

export type DocumentFitEstimate = {
  modelContextTokens: number;
  budgetTokens: number;
  neededTokens: number;
  fits: boolean;
  documents: Array<{ documentId: string; title?: string; tokens: number }>;
};

/**
 * Whether documents picked for a message fit the model before it is sent.
 * Same token estimate as sending; the system prompt is not known yet, so
 * its reserve is taken at the upper end.
 */
export function estimateDocumentFit(args: {
  attachments: readonly SessionDocumentAttachment[];
  modelContextTokens: number;
  tokenCharsPerToken?: number;
}): DocumentFitEstimate {
  const charsPerToken = args.tokenCharsPerToken ?? 3;
  const window = Math.min(MAX_CONTEXT_WINDOW, Math.max(MIN_CONTEXT_WINDOW, args.modelContextTokens));
  const outputReserve = Math.min(16_384, Math.max(4_096, Math.floor(window * 0.12)));
  const systemReserve = Math.min(48_000, Math.max(12_000, Math.floor(window * 0.35)));
  const safetyReserve = Math.max(2_048, Math.floor(window * 0.04));
  const budgetTokens = Math.max(0, window - outputReserve - systemReserve - safetyReserve);
  const documents = args.attachments.map((attachment) => ({
    documentId: attachment.documentId,
    ...(attachment.title ? { title: attachment.title } : {}),
    tokens: attachment.chunks.reduce((sum, chunk) => sum + chunkTokens(attachment, chunk, charsPerToken), 0)
  }));
  const neededTokens = documents.reduce((sum, document) => sum + document.tokens, 0);
  return { modelContextTokens: window, budgetTokens, neededTokens, fits: neededTokens <= budgetTokens, documents };
}
