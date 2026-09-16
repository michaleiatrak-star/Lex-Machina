import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  createFirmKnowledgeWorkspace,
  getFirmKnowledgeWorkspace,
  searchCaseKnowledge,
  type AuthenticatedUser,
  type CaseKnowledgeHit,
  type CaseListItem,
  type DocumentAttachmentSelection
} from "./api.js";
import {
  CaseCollaborationPanel
} from "./CaseCollaborationPanel.js";
import {
  DocumentPrivacyPanel
} from "./DocumentPrivacyPanel.js";

type SearchScope =
  | "FIRM"
  | "CURRENT"
  | "BOTH";

type SearchHitView = {
  source:
    | "FIRM"
    | "CURRENT";
  caseId: string;
  caseName: string;
  caseRole:
    CaseListItem["role"];
  hit: CaseKnowledgeHit;
};

function canAnalyze(
  role:
    CaseListItem["role"]
): boolean {
  return (
    role === "OWNER" ||
    role === "EDITOR" ||
    role === "ANALYST"
  );
}

export function FirmKnowledgePanel({
  user,
  currentCase,
  onUseHit,
  onWorkspaceChange
}: {
  user: AuthenticatedUser;
  currentCase:
    | CaseListItem
    | undefined;
  onUseHit: (
    selection:
      DocumentAttachmentSelection
  ) => void;
  onWorkspaceChange?: (
    workspace:
      | CaseListItem
      | null
  ) => void;
}) {
  const [
    workspace,
    setWorkspace
  ] = useState<
    CaseListItem | null
  >(null);
  const [loading, setLoading] =
    useState(true);
  const [creating, setCreating] =
    useState(false);
  const [error, setError] =
    useState("");
  const [query, setQuery] =
    useState("");
  const [scope, setScope] =
    useState<SearchScope>(
      "BOTH"
    );
  const [
    searching,
    setSearching
  ] = useState(false);
  const [hits, setHits] =
    useState<
      SearchHitView[]
    >([]);
  const [
    refreshToken,
    setRefreshToken
  ] = useState(0);

  async function refreshWorkspace():
    Promise<void> {
    const result =
      await getFirmKnowledgeWorkspace();
    setWorkspace(
      result.workspace
    );
    onWorkspaceChange?.(
      result.workspace
    );
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    void getFirmKnowledgeWorkspace()
      .then((result) => {
        if (!cancelled) {
          setWorkspace(
            result.workspace
          );
          onWorkspaceChange?.(
            result.workspace
          );
        }
      })
      .catch((failure) => {
        if (!cancelled) {
          setError(
            failure instanceof Error
              ? failure.message
              : String(failure)
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const searchableTargets =
    useMemo(() => {
      const result:
        Array<{
          source:
            | "FIRM"
            | "CURRENT";
          item: CaseListItem;
        }> = [];
      if (
        workspace &&
        (
          scope === "FIRM" ||
          scope === "BOTH"
        )
      ) {
        result.push({
          source: "FIRM",
          item: workspace
        });
      }
      if (
        currentCase &&
        currentCase.caseKind ===
          "MATTER" &&
        (
          scope === "CURRENT" ||
          scope === "BOTH"
        )
      ) {
        result.push({
          source:
            "CURRENT",
          item:
            currentCase
        });
      }
      return result;
    }, [
      workspace,
      currentCase,
      scope
    ]);

  async function createWorkspace():
    Promise<void> {
    setCreating(true);
    setError("");
    try {
      const result =
        await createFirmKnowledgeWorkspace();
      setWorkspace(
        result.workspace
      );
      onWorkspaceChange?.(
        result.workspace
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : String(failure)
      );
      await refreshWorkspace()
        .catch(() => {});
    } finally {
      setCreating(false);
    }
  }

  async function search():
    Promise<void> {
    const clean =
      query.trim();
    if (
      clean.length < 2 ||
      searchableTargets
        .length === 0
    ) {
      return;
    }
    setSearching(true);
    setError("");
    try {
      const result =
        await Promise.all(
          searchableTargets.map(
            async ({
              source,
              item
            }) => ({
              source,
              item,
              result:
                await searchCaseKnowledge(
                  item.caseId,
                  clean,
                  12
                )
            })
          )
        );
      const merged =
        result.flatMap(
          ({
            source,
            item,
            result:
              searchResult
          }) =>
            searchResult.hits.map(
              (hit) => ({
                source,
                caseId:
                  item.caseId,
                caseName:
                  item.displayName ??
                  (
                    source ===
                      "FIRM"
                      ? "Wiedza kancelarii"
                      : item.caseId
                  ),
                caseRole:
                  item.role,
                hit
              })
            )
        )
        .sort(
          (a, b) =>
            b.hit.score -
              a.hit.score ||
            a.caseId.localeCompare(
              b.caseId
            ) ||
            a.hit.chunkIndex -
              b.hit.chunkIndex
        )
        .slice(0, 16);
      setHits(merged);
    } catch (failure) {
      setHits([]);
      setError(
        failure instanceof Error
          ? failure.message
          : String(failure)
      );
    } finally {
      setSearching(false);
    }
  }

  return (
    <section className="firm-knowledge-panel">
      <div className="firm-knowledge-head">
        <div>
          <p className="eyebrow">
            Know-how kancelarii
          </p>
          <h3>
            Prywatna baza wiedzy
          </h3>
          <p className="field-help">
            Dokumenty są przechowywane jak akta sprawy: zaszyfrowane, z ACL i rotacją klucza. Wyszukiwanie odbywa się lokalnie po chronionych chunkach.
          </p>
        </div>
        <span className="security-pill">
          ENCRYPTED + ACL
        </span>
      </div>

      {loading ? (
        <p className="workspace-empty">
          Sprawdzanie bazy wiedzy…
        </p>
      ) : !workspace ? (
        <div className="firm-knowledge-empty">
          <p>
            Nie masz dostępu do bazy wiedzy kancelarii albo nie została jeszcze utworzona.
          </p>
          {user.appRole ===
            "ADMIN" && (
            <button
              type="button"
              className="primary-button"
              disabled={creating}
              onClick={() => {
                void createWorkspace();
              }}
            >
              {creating
                ? "Tworzę…"
                : "Utwórz szyfrowaną bazę wiedzy"}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="firm-knowledge-meta">
            <strong>
              {workspace.displayName ??
                "Wiedza kancelarii"}
            </strong>
            <span>
              Rola: {workspace.role} · klucz v{workspace.keyVersion}
            </span>
          </div>

          {!workspace.archivedAt &&
            (
              workspace.role ===
                "OWNER" ||
              workspace.role ===
                "EDITOR"
            ) && (
            <details className="firm-knowledge-ingest">
              <summary>
                Dodaj wiedzę / dokument
              </summary>
              <DocumentPrivacyPanel
                caseId={
                  workspace.caseId
                }
                onCaseFilesChange={() =>
                  setRefreshToken(
                    (value) =>
                      value + 1
                  )
                }
              />
            </details>
          )}

          <CaseCollaborationPanel
            caseId={
              workspace.caseId
            }
            caseRole={
              workspace.role
            }
            onOwnershipTransferred={
              async () => {
                await refreshWorkspace();
              }
            }
          />
        </>
      )}

      <div className="knowledge-search-box">
        <div>
          <p className="eyebrow">
            Retrieval lokalny
          </p>
          <h4>
            Przeszukaj wiedzę i akta
          </h4>
        </div>

        <div className="knowledge-search-controls">
          <input
            value={query}
            maxLength={500}
            placeholder="np. kara umowna, cesja, przedawnienie, stanowisko klienta…"
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                  "Enter"
              ) {
                event.preventDefault();
                void search();
              }
            }}
          />
          <select
            value={scope}
            onChange={(event) =>
              setScope(
                event.target
                  .value as
                  SearchScope
              )
            }
          >
            <option value="BOTH">
              Sprawa + wiedza kancelarii
            </option>
            <option value="CURRENT">
              Tylko bieżąca sprawa
            </option>
            <option value="FIRM">
              Tylko wiedza kancelarii
            </option>
          </select>
          <button
            type="button"
            className="primary-button"
            disabled={
              searching ||
              query.trim()
                .length < 2 ||
              searchableTargets
                .length === 0
            }
            onClick={() => {
              void search();
            }}
          >
            {searching
              ? "Szukam…"
              : "Szukaj"}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {hits.length > 0 && (
          <div className="knowledge-search-results">
            {hits.map(
              (item) => (
                <article
                  key={
                    item.caseId +
                    ":" +
                    item.hit
                      .documentId +
                    ":" +
                    item.hit
                      .chunkIndex
                  }
                  className="knowledge-hit"
                >
                  <div className="knowledge-hit-head">
                    <strong>
                      {item.source ===
                      "FIRM"
                        ? "KNOW-HOW"
                        : "AKTA SPRAWY"}
                    </strong>
                    <span>
                      {item.caseName} · s. {item.hit.pageStart}
                      {item.hit.pageEnd !==
                      item.hit.pageStart
                        ? "–" + item.hit.pageEnd
                        : ""}
                    </span>
                  </div>
                  <p>
                    {item.hit.text}
                  </p>
                  <div className="knowledge-hit-actions">
                    <small>
                      trafność {item.hit.score.toFixed(2)} · chunk {item.hit.chunkIndex}
                    </small>
                    <button
                      type="button"
                      disabled={
                        !canAnalyze(
                          item.caseRole
                        )
                      }
                      onClick={() =>
                        onUseHit({
                          caseId:
                            item.caseId,
                          documentId:
                            item.hit
                              .documentId,
                          chunkIndices: [
                            item.hit
                              .chunkIndex
                          ]
                        })
                      }
                    >
                      {canAnalyze(
                        item.caseRole
                      )
                        ? "Dodaj do analizy"
                        : "Tylko odczyt"}
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}

        {refreshToken > 0 && (
          <p className="field-help">
            Baza wiedzy została zmieniona. Nowo sfinalizowane dokumenty są dostępne w wyszukiwaniu bez zewnętrznego indeksowania.
          </p>
        )}
      </div>
    </section>
  );
}
