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
};

export type OrchestratedDocumentContext = {
  attachments: SessionDocumentAttachment[];
  citationSources: SessionDocumentAttachment[];
  report: ContextBudgetReport;
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

  if (attachments.length > 4) {
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
        omittedDocumentIds.size
    }
  };
}
