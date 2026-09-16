import type {
  AuthenticatedContext
} from "./auth/types.js";
import type {
  CaseKind
} from "./case-access-types.js";
import type {
  LocalCaseAccessService
} from "./case-access.js";
import type {
  SecureCaseDocumentStore
} from "./case-document-store.js";

export type KnowledgeSearchScope =
  | "ALL_ACCESSIBLE"
  | "CURRENT_CASE"
  | "FIRM_KNOWLEDGE";

export type KnowledgeSearchHit = {
  caseId: string;
  caseKind: CaseKind;
  caseDisplayName?: string;
  documentId: string;
  chunkIndex: number;
  pageStart: number;
  pageEnd: number;
  score: number;
  excerpt: string;
};

export type KnowledgeSearchResult = {
  query: string;
  scope: KnowledgeSearchScope;
  searchedCases: number;
  searchedDocuments: number;
  searchedChunks: number;
  hits: KnowledgeSearchHit[];
};

const STOP_WORDS =
  new Set([
    "a",
    "aby",
    "albo",
    "ale",
    "bez",
    "by",
    "być",
    "co",
    "czy",
    "dla",
    "do",
    "i",
    "jak",
    "jest",
    "na",
    "nie",
    "o",
    "od",
    "oraz",
    "po",
    "przez",
    "się",
    "to",
    "w",
    "we",
    "z",
    "za",
    "że"
  ]);

function normalizedTokens(
  value: string
): string[] {
  return [
    ...new Set(
      value
        .normalize("NFKC")
        .toLocaleLowerCase(
          "pl-PL"
        )
        .split(
          /[^\p{L}\p{N}]+/u
        )
        .map(
          (token) =>
            token.trim()
        )
        .filter(
          (token) =>
            token.length >= 2 &&
            token.length <= 64 &&
            !STOP_WORDS.has(
              token
            )
        )
    )
  ].slice(0, 24);
}

function scoreText(
  text: string,
  query: string,
  tokens: string[]
): number {
  const normalized =
    text
      .normalize("NFKC")
      .toLocaleLowerCase(
        "pl-PL"
      );
  let score = 0;

  const phrase =
    query
      .normalize("NFKC")
      .trim()
      .toLocaleLowerCase(
        "pl-PL"
      );
  if (
    phrase.length >= 4 &&
    normalized.includes(
      phrase
    )
  ) {
    score += 12;
  }

  for (
    const token
    of tokens
  ) {
    let cursor = 0;
    let occurrences = 0;
    while (
      occurrences < 12
    ) {
      const index =
        normalized.indexOf(
          token,
          cursor
        );
      if (index < 0) {
        break;
      }
      occurrences += 1;
      cursor =
        index +
        token.length;
    }
    if (occurrences > 0) {
      score +=
        2 +
        Math.min(
          occurrences,
          5
        );
    }
  }

  if (
    tokens.length > 1 &&
    tokens.every(
      (token) =>
        normalized.includes(
          token
        )
    )
  ) {
    score += 6;
  }

  return score;
}

function excerptFor(
  text: string,
  tokens: string[]
): string {
  const compact =
    text
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  if (
    compact.length <= 620
  ) {
    return compact;
  }

  const lower =
    compact
      .toLocaleLowerCase(
        "pl-PL"
      );
  const positions =
    tokens
      .map(
        (token) =>
          lower.indexOf(
            token
          )
      )
      .filter(
        (index) =>
          index >= 0
      );
  const first =
    positions.length > 0
      ? Math.min(
          ...positions
        )
      : 0;
  const start =
    Math.max(
      0,
      first - 180
    );
  const end =
    Math.min(
      compact.length,
      start + 620
    );
  return (
    (start > 0
      ? "…"
      : "") +
    compact.slice(
      start,
      end
    ) +
    (end <
    compact.length
      ? "…"
      : "")
  );
}

export class LocalKnowledgeSearchService {
  constructor(
    private readonly cases:
      Pick<
        LocalCaseAccessService,
        | "listCases"
        | "openCase"
        | "withCaseDataKey"
      >,
    private readonly documents:
      Pick<
        SecureCaseDocumentStore,
        "listProtectedDocuments"
      >
  ) {}

  async search(
    context:
      AuthenticatedContext,
    input: {
      query: string;
      scope:
        KnowledgeSearchScope;
      currentCaseId?: string;
      limit?: number;
    }
  ): Promise<
    KnowledgeSearchResult
  > {
    const query =
      input.query
        .normalize("NFKC")
        .trim()
        .slice(0, 500);
    const tokens =
      normalizedTokens(
        query
      );
    if (
      query.length < 2 ||
      tokens.length === 0
    ) {
      throw new Error(
        "KNOWLEDGE_SEARCH_QUERY_INVALID"
      );
    }

    const limit =
      Math.max(
        1,
        Math.min(
          input.limit ?? 12,
          40
        )
      );
    const accessible =
      this.cases
        .listCases(context);

    const selected =
      accessible.filter(
        (item) => {
          if (
            input.scope ===
              "FIRM_KNOWLEDGE"
          ) {
            return (
              item.caseKind ===
                "FIRM_KNOWLEDGE"
            );
          }
          if (
            input.scope ===
              "CURRENT_CASE"
          ) {
            return (
              Boolean(
                input.currentCaseId
              ) &&
              item.caseId ===
                input.currentCaseId
            );
          }
          return true;
        }
      );

    if (
      input.scope ===
        "CURRENT_CASE" &&
      selected.length === 0
    ) {
      throw new Error(
        "KNOWLEDGE_SEARCH_CASE_UNAVAILABLE"
      );
    }

    let searchedDocuments = 0;
    let searchedChunks = 0;
    const hits:
      KnowledgeSearchHit[] =
        [];

    for (
      const item
      of selected
    ) {
      const view =
        this.cases.openCase(
          context,
          item.caseId
        );
      const protectedDocuments =
        await this.cases
          .withCaseDataKey(
            context,
            item.caseId,
            "READ",
            async (
              caseDataKey
            ) =>
              await this.documents
                .listProtectedDocuments({
                  caseId:
                    item.caseId,
                  caseDataKey,
                  keyVersion:
                    view.keyVersion
                })
          );

      searchedDocuments +=
        protectedDocuments.length;

      for (
        const document
        of protectedDocuments
      ) {
        for (
          const chunk
          of document.chunks
        ) {
          searchedChunks += 1;
          const score =
            scoreText(
              chunk.text,
              query,
              tokens
            );
          if (
            score <= 0
          ) {
            continue;
          }
          hits.push({
            caseId:
              item.caseId,
            caseKind:
              item.caseKind,
            ...(item.displayName
              ? {
                  caseDisplayName:
                    item.displayName
                }
              : {}),
            documentId:
              document.documentId,
            chunkIndex:
              chunk.index,
            pageStart:
              chunk.pageStart,
            pageEnd:
              chunk.pageEnd,
            score,
            excerpt:
              excerptFor(
                chunk.text,
                tokens
              )
          });
        }
      }
    }

    hits.sort(
      (a, b) =>
        b.score -
          a.score ||
        a.caseId.localeCompare(
          b.caseId
        ) ||
        a.documentId.localeCompare(
          b.documentId
        ) ||
        a.chunkIndex -
          b.chunkIndex
    );

    return {
      query,
      scope:
        input.scope,
      searchedCases:
        selected.length,
      searchedDocuments,
      searchedChunks,
      hits:
        hits.slice(
          0,
          limit
        )
    };
  }
}
