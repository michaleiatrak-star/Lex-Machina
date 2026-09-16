import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { DocumentPrivacyPanel } from "./DocumentPrivacyPanel.js";
import { CaseWorkspacePanel } from "./CaseWorkspacePanel.js";
import { CaseCollaborationPanel } from "./CaseCollaborationPanel.js";
import { FirmKnowledgePanel } from "./FirmKnowledgePanel.js";
import { DocumentAuthoringPanel } from "./DocumentAuthoringPanel.js";
import {
  DOCUMENT_FILE_ACCEPT,
  MAX_DOCUMENT_DROP_QUEUE,
  consumeDocumentDropFile,
  createDocumentDropQueueState,
  describeDocumentFile,
  enqueueDocumentDropFiles
} from "./document-drop-queue.js";
import {
  archiveCase,
  createCase,
  deleteCase,
  executeSession,
  getHealth,
  getModels,
  listCases,
  renameCase,
  unarchiveCase,
  getProviderStatus,
  getUpdateStatus,
  isDesktopShell,
  setProviderApiKey,
  clearProviderApiKey,
  getRoutes,
  validateRoute,
  type AuthenticatedUser,
  type CaseListItem,
  type DocumentAttachmentSelection,
  type EvidenceItem,
  type ModelDescriptor,
  type ProviderId,
  type SessionExecutionResponse,
  type UpdateStatusResponse
} from "./api.js";

const PROVIDERS: Array<{
  id: ProviderId;
  label: string;
  apiKeyUrl: string;
}> = [
  {
    id: "openai",
    label: "OpenAI",
    apiKeyUrl:
      "https://platform.openai.com/api-keys"
  },
  {
    id: "anthropic",
    label: "Anthropic / Claude",
    apiKeyUrl:
      "https://platform.claude.com/settings/keys"
  },
  {
    id: "xai",
    label: "xAI / Grok",
    apiKeyUrl:
      "https://console.x.ai/"
  }
];

function labelForDr(value: string): string {
  return value
    .replace(/^dr-(\d{2})-/, "DR-$1 · ")
    .replaceAll("-", " ");
}

function evidenceStatusLabel(
  status: EvidenceItem["status"]
): string {
  return status === "VERIFIED"
    ? "VERIFIED"
    : status === "SUPPORTED"
      ? "SUPPORTED · evidence-linked"
      : "UNVERIFIED";
}

function EvidencePanel({
  evidence
}: {
  evidence: EvidenceItem[];
}) {
  if (evidence.length === 0) {
    return null;
  }

  return (
    <section
      className="evidence-panel"
      aria-label="Dowody weryfikacji"
    >
      <div className="evidence-heading">
        <div>
          <p className="eyebrow">Evidence bundle</p>
          <h4>Ślad źródłowy runtime</h4>
        </div>
        <span className="evidence-count">
          {evidence.length} rekordów
        </span>
      </div>

      <div className="evidence-grid">
        {evidence.map((item, index) => (
          <article
            className={"evidence-card evidence-" + item.status.toLowerCase()}
            key={
              item.evidenceHash ??
              item.claim + "-" + index
            }
          >
            <div className="evidence-card-head">
              <span className="evidence-status">
                {evidenceStatusLabel(item.status)}
              </span>
              <span className="evidence-kind">
                {item.kind}
              </span>
            </div>

            <strong className="evidence-claim">
              {item.claim}
            </strong>

            <dl className="evidence-meta">
              {item.temporalMode === "HISTORICAL" && item.asOf && (
                <div>
                  <dt>Stan prawny</dt>
                  <dd>{item.asOf}</dd>
                </div>
              )}
              {item.sourceFormat && (
                <div>
                  <dt>Format</dt>
                  <dd>{item.sourceFormat}</dd>
                </div>
              )}
              {item.caseScope && (
                <div>
                  <dt>Zakres</dt>
                  <dd>{item.caseScope}</dd>
                </div>
              )}
              {item.caseSignature && (
                <div>
                  <dt>Sygnatura</dt>
                  <dd>{item.caseSignature}</dd>
                </div>
              )}
              {item.sourceTier && (
                <div>
                  <dt>Źródło</dt>
                  <dd>{item.sourceTier}</dd>
                </div>
              )}
              <div>
                <dt>Pobrano</dt>
                <dd>
                  {item.fetchedAt.slice(0, 10)}
                </dd>
              </div>
            </dl>

            {item.status === "SUPPORTED" && (
              <p className="evidence-caution">
                Powiązano z dokładnym dowodem. Runtime nie oznacza tej parafrazy jako semantycznie VERIFIED.
              </p>
            )}

            {item.sourceUrl && (
              <a
                className="evidence-link"
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Otwórz urzędowe źródło ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App({
  user
}: {
  user: AuthenticatedUser;
}) {
  const [runtimeOnline, setRuntimeOnline] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [cases, setCases] =
    useState<CaseListItem[]>([]);
  const [newCaseName, setNewCaseName] =
    useState("");
  const matterCases =
    useMemo(
      () =>
        cases.filter(
          (item) =>
            item.caseKind !==
              "FIRM_KNOWLEDGE"
        ),
      [cases]
    );
  const [caseBusy, setCaseBusy] =
    useState(false);
  const [caseError, setCaseError] =
    useState("");
  const [caseRenameName, setCaseRenameName] =
    useState("");
  const [caseDeletePassword, setCaseDeletePassword] =
    useState("");
  const [caseDeleteConfirmation, setCaseDeleteConfirmation] =
    useState("");
  const [runtimeError, setRuntimeError] = useState("");
  const [provider, setProvider] = useState<ProviderId>("openai");
  const [providerConfiguration, setProviderConfiguration] = useState<
    Record<ProviderId, boolean | undefined>
  >({
    openai: undefined,
    anthropic: undefined,
    xai: undefined
  });
  const [providerApiKey, setProviderApiKeyInput] =
    useState("");
  const [providerKeyBusy, setProviderKeyBusy] =
    useState(false);
  const [providerKeyMessage, setProviderKeyMessage] =
    useState("");
  const [providerKeyError, setProviderKeyError] =
    useState("");

  const [models, setModels] = useState<ModelDescriptor[]>([]);
  const [model, setModel] = useState("");
  const [modelError, setModelError] = useState("");
  const [routes, setRoutes] = useState<string[]>([]);
  const [route, setRoute] = useState("");
  const [routeStatus, setRouteStatus] = useState<
    "idle" | "valid" | "invalid"
  >("idle");
  const [routeReason, setRouteReason] = useState("");
  const [query, setQuery] = useState("");
  const [executing, setExecuting] = useState(false);
  const [execution, setExecution] =
    useState<SessionExecutionResponse | null>(null);
  const [executionError, setExecutionError] = useState("");
  const [documentAttachments, setDocumentAttachments] =
    useState<DocumentAttachmentSelection[]>([]);
  const [
    includeCaseKnowledge,
    setIncludeCaseKnowledge
  ] = useState(false);
  const [
    includeFirmKnowledge,
    setIncludeFirmKnowledge
  ] = useState(false);
  const [
    firmKnowledgeWorkspace,
    setFirmKnowledgeWorkspace
  ] = useState<
    CaseListItem | null
  >(null);
  const [updateStatus, setUpdateStatus] =
    useState<UpdateStatusResponse | null>(
      null
    );
  const [updateBusy, setUpdateBusy] =
    useState(false);

  const [workspaceRefresh, setWorkspaceRefresh] =
    useState(0);
  const [
    documentDropQueue,
    setDocumentDropQueue
  ] = useState(
    createDocumentDropQueueState
  );
  const [queryDropActive, setQueryDropActive] =
    useState(false);
  const queryDragDepth = useRef(0);

  useEffect(() => {
    setDocumentDropQueue(
      createDocumentDropQueueState()
    );
    queryDragDepth.current = 0;
    setQueryDropActive(false);
  }, [caseId]);

  useEffect(() => {
    let cancelled = false;
    void getUpdateStatus()
      .then((result) => {
        if (!cancelled) {
          setUpdateStatus(
            result
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUpdateStatus(
            null
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getHealth(),
      getRoutes(),
      getProviderStatus(),
      listCases()
    ])
      .then(([health, routeList, providerStatus, caseList]) => {
        if (cancelled) return;
        setRuntimeOnline(
          health.status === "ok" && health.localOnly === true
        );
        setRoutes(routeList.primarySkills);
        setCases(caseList.cases);
        const matters =
          caseList.cases.filter(
            (item) =>
              item.caseKind !==
                "FIRM_KNOWLEDGE"
          );
        setCaseId(
          matters.find(
            (item) => !item.archivedAt
          )?.caseId ??
          matters[0]?.caseId ??
          ""
        );
        setProviderConfiguration(
          Object.fromEntries(
            providerStatus.providers.map((item) => [
              item.provider,
              item.configured
            ])
          ) as Record<ProviderId, boolean>
        );
        if (routeList.primarySkills[0]) {
          setRoute(routeList.primarySkills[0]);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setRuntimeOnline(false);
        setRuntimeError(
          error instanceof Error ? error.message : String(error)
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function createLocalCase():
    Promise<void> {
    if (caseBusy) return;
    setCaseBusy(true);
    setCaseError("");
    try {
      const created =
        await createCase(
          newCaseName.trim() ||
            undefined
        );
      const refreshed =
        await listCases();
      setCases(
        refreshed.cases
      );
      setCaseId(
        created.caseId
      );
      setNewCaseName("");
      setDocumentAttachments([]);
      setExecution(null);
      setExecutionError("");
    } catch (error) {
      setCaseError(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setCaseBusy(false);
    }
  }

  const selectedCase = useMemo(
    () =>
      cases.find(
        (item) =>
          item.caseId ===
            caseId
      ),
    [cases, caseId]
  );

  useEffect(() => {
    setCaseRenameName(
      selectedCase?.displayName ??
        ""
    );
    setCaseDeletePassword("");
    setCaseDeleteConfirmation("");
  }, [
    caseId,
    selectedCase?.displayName
  ]);

  async function refreshCaseList(
    preferredCaseId?: string
  ): Promise<void> {
    const refreshed =
      await listCases();
    setCases(refreshed.cases);
    const matters =
      refreshed.cases.filter(
        (item) =>
          item.caseKind !==
            "FIRM_KNOWLEDGE"
      );
    const preferred =
      preferredCaseId
        ? matters.find(
            (item) =>
              item.caseId ===
                preferredCaseId
          )
        : undefined;
    const next =
      preferred ??
      matters.find(
        (item) =>
          !item.archivedAt
      ) ??
      matters[0];
    setCaseId(
      next?.caseId ?? ""
    );
  }

  async function renameSelectedCase():
    Promise<void> {
    if (
      caseBusy ||
      !selectedCase ||
      selectedCase.role !== "OWNER" ||
      !caseRenameName.trim()
    ) {
      return;
    }
    setCaseBusy(true);
    setCaseError("");
    try {
      await renameCase(
        selectedCase.caseId,
        caseRenameName.trim()
      );
      await refreshCaseList(
        selectedCase.caseId
      );
    } catch (error) {
      setCaseError(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setCaseBusy(false);
    }
  }

  async function toggleSelectedCaseArchive():
    Promise<void> {
    if (
      caseBusy ||
      !selectedCase ||
      selectedCase.role !== "OWNER"
    ) {
      return;
    }
    setCaseBusy(true);
    setCaseError("");
    try {
      if (selectedCase.archivedAt) {
        await unarchiveCase(
          selectedCase.caseId
        );
      } else {
        await archiveCase(
          selectedCase.caseId
        );
        setDocumentAttachments([]);
        setExecution(null);
        setExecutionError("");
      }
      await refreshCaseList(
        selectedCase.caseId
      );
    } catch (error) {
      setCaseError(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setCaseBusy(false);
    }
  }

  async function deleteSelectedCase():
    Promise<void> {
    if (
      caseBusy ||
      !selectedCase ||
      selectedCase.role !== "OWNER" ||
      caseDeleteConfirmation !==
        "USUŃ" ||
      !caseDeletePassword
    ) {
      return;
    }
    setCaseBusy(true);
    setCaseError("");
    try {
      await deleteCase(
        selectedCase.caseId,
        caseDeletePassword
      );
      setDocumentAttachments([]);
      setExecution(null);
      setExecutionError("");
      setCaseDeletePassword("");
      setCaseDeleteConfirmation("");
      await refreshCaseList();
    } catch (error) {
      setCaseError(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setCaseBusy(false);
    }
  }

  function addKnowledgeAttachment(
    selection:
      DocumentAttachmentSelection
  ): void {
    setDocumentAttachments(
      (current) => {
        const existingIndex =
          current.findIndex(
            (item) =>
              item.caseId ===
                selection.caseId &&
              item.documentId ===
                selection.documentId
          );
        if (
          existingIndex >= 0
        ) {
          const existing =
            current[
              existingIndex
            ]!;
          const chunkIndices =
            [
              ...new Set([
                ...existing
                  .chunkIndices,
                ...selection
                  .chunkIndices
              ])
            ]
              .sort(
                (a, b) =>
                  a - b
              )
              .slice(0, 32);
          return current.map(
            (item, index) =>
              index ===
                existingIndex
                ? {
                    ...item,
                    chunkIndices
                  }
                : item
          );
        }
        if (
          current.length >= 4
        ) {
          setExecutionError(
            "Do jednej analizy można dołączyć maksymalnie 4 dokumenty. Usuń jedno z bieżących źródeł przed dodaniem kolejnego."
          );
          return current;
        }
        setExecutionError("");
        return [
          ...current,
          selection
        ];
      }
    );
  }

  function enqueueDocumentFiles(
    files: FileList | readonly File[]
  ): void {
    if (
      !caseId ||
      selectedCase?.archivedAt
    ) {
      return;
    }
    const incoming =
      Array.from(files);
    if (incoming.length === 0) {
      return;
    }
    setDocumentDropQueue(
      (current) =>
        enqueueDocumentDropFiles(
          current,
          incoming
        )
    );
  }

  function consumeQueuedDocumentFile():
    void {
    setDocumentDropQueue(
      (current) =>
        consumeDocumentDropFile(
          current
        )
    );
  }

  const providerDefinition =
    PROVIDERS.find(
      (item) =>
        item.id === provider
    );

  const providerConfigured = providerConfiguration[provider];

  useEffect(() => {
    let cancelled = false;
    setModels([]);
    setModel("");
    setModelError("");
    setExecution(null);
    setExecutionError("");

    if (providerConfigured !== true) {
      if (providerConfigured === false) {
        setModelError("PROVIDER_NOT_CONFIGURED");
      }
      return () => {
        cancelled = true;
      };
    }

    getModels(provider)
      .then((response) => {
        if (cancelled) return;
        const selectable = response.models.filter(
          (item) => item.selectable
        );
        setModels(response.models);
        if (selectable[0]) setModel(selectable[0].id);
      })
      .catch((error) => {
        if (cancelled) return;
        setModelError(
          error instanceof Error ? error.message : String(error)
        );
      });

    return () => {
      cancelled = true;
    };
  }, [provider, providerConfigured]);

  async function refreshUpdateStatus():
    Promise<void> {
    setUpdateBusy(true);
    try {
      setUpdateStatus(
        await getUpdateStatus()
      );
    } catch {
      setUpdateStatus(
        null
      );
    } finally {
      setUpdateBusy(false);
    }
  }

  async function refreshProviderStatus():
    Promise<void> {
    const result =
      await getProviderStatus();
    setProviderConfiguration(
      Object.fromEntries(
        result.providers.map(
          (item) => [
            item.provider,
            item.configured
          ]
        )
      ) as Record<
        ProviderId,
        boolean
      >
    );
  }

  async function saveProviderApiKey(
    persistence:
      "PROCESS_MEMORY" |
      "OS_KEYRING"
  ): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      !providerApiKey.trim()
    ) {
      return;
    }
    setProviderKeyBusy(true);
    setProviderKeyError("");
    setProviderKeyMessage("");
    try {
      await setProviderApiKey(
        provider,
        providerApiKey,
        persistence
      );
      setProviderApiKeyInput("");
      await refreshProviderStatus();
      setProviderKeyMessage(
        persistence ===
          "OS_KEYRING"
          ? "Klucz jest aktywny i został zapisany w systemowym magazynie poświadczeń. Przeglądarka nie przechowuje jego wartości."
          : "Klucz jest aktywny tylko w pamięci procesu. Ewentualny wcześniejszy wpis w systemowym magazynie poświadczeń został usunięty."
      );
    } catch (error) {
      setProviderKeyError(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setProviderKeyBusy(false);
    }
  }

  async function removeProviderApiKey():
    Promise<void> {
    if (
      user.appRole !== "ADMIN"
    ) {
      return;
    }
    setProviderKeyBusy(true);
    setProviderKeyError("");
    setProviderKeyMessage("");
    try {
      await clearProviderApiKey(
        provider
      );
      setProviderApiKeyInput("");
      await refreshProviderStatus();
      setProviderKeyMessage(
        "Ulotny klucz usunięto. Jeśli provider nadal jest skonfigurowany, działa klucz przekazany przez środowisko procesu."
      );
    } catch (error) {
      setProviderKeyError(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setProviderKeyBusy(false);
    }
  }

  const selectedModel = useMemo(
    () => models.find((item) => item.id === model),
    [models, model]
  );

  async function checkRoute(): Promise<void> {
    if (!route) return;
    setRouteStatus("idle");
    setRouteReason("");

    try {
      const result = await validateRoute(route);
      setRouteStatus(result.valid ? "valid" : "invalid");
      setRouteReason(result.reason ?? "");
    } catch (error) {
      setRouteStatus("invalid");
      setRouteReason(
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async function runAnalysis(): Promise<void> {
    if (
      !runtimeOnline ||
      !model ||
      !route ||
      routeStatus !== "valid" ||
      !query.trim()
    ) {
      return;
    }

    setExecuting(true);
    setExecution(null);
    setExecutionError("");

    try {
      const result = await executeSession({
        query: query.trim(),
        provider,
        model,
        primarySkill: route,
        mode: "PRAWNIK",
        ...(documentAttachments.length > 0
          ? { attachments: documentAttachments }
          : {}),
        ...(
          includeCaseKnowledge ||
          includeFirmKnowledge
            ? {
                knowledge: {
                  ...(includeCaseKnowledge &&
                  selectedCase
                    ? {
                        caseId:
                          selectedCase.caseId,
                        includeCase:
                          true
                      }
                    : {
                        includeCase:
                          false
                      }),
                  includeFirm:
                    includeFirmKnowledge,
                  limit: 8
                }
              }
            : {}
        )
      });
      setExecution(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      setExecutionError(
        message === "PROVIDER_NOT_CONFIGURED"
          ? "Brak lokalnego klucza API dla wybranego dostawcy."
          : message === "PROVIDER_EXECUTION_FAILED"
            ? "Provider odrzucił lub przerwał wykonanie."
            : message ===
                "DOCUMENT_ATTACHMENT_RESOLUTION_FAILED"
              ? "Nie udało się bezpiecznie dołączyć wybranych chunków dokumentu."
              : "Nie udało się wykonać sesji."
      );
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">LM</div>
          <h1>Lex Machina</h1>
          <p className="sidebar-copy">
            Lokalny runtime dla polskiego legal AI.
          </p>
        </div>

        <div className="runtime-card">
          <span
            className={
              runtimeOnline
                ? "status-dot status-online"
                : "status-dot status-offline"
            }
          />
          <div>
            <strong>
              {runtimeOnline ? "Runtime aktywny" : "Runtime offline"}
            </strong>
            <small>
              127.0.0.1:4317
              {caseId ? ` · ${caseId.slice(0, 13)}…` : ""}
            </small>
          </div>
        </div>

        <div className="privacy-note">
          <strong>Klucze API pozostają lokalnie.</strong>
          <span>
            Przeglądarka nie otrzymuje sekretów ani treści SKILL.md.
          </span>
        </div>

        <div className="privacy-note update-note">
          <strong>
            Wersja {updateStatus?.currentVersion ?? "0.1.0"}
          </strong>
          <span>
            {updateStatus?.status ===
            "AVAILABLE"
              ? `Dostępna nowsza wersja ${updateStatus.latestVersion ?? ""}.`
              : updateStatus?.status ===
                  "UP_TO_DATE"
                ? "Masz najnowsze opublikowane wydanie."
                : updateStatus?.status ===
                    "NO_RELEASE"
                  ? "Brak opublikowanego wydania aktualizacyjnego."
                  : updateStatus?.status ===
                      "UNAVAILABLE"
                    ? "Nie udało się sprawdzić wydań."
                    : "Sprawdzanie wydań GitHub…"}
          </span>
          {updateStatus?.status ===
            "AVAILABLE" &&
            updateStatus.releaseUrl && (
            <a
              className="provider-key-link"
              href={
                updateStatus.releaseUrl
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              Otwórz nowe wydanie
            </a>
          )}
          <button
            type="button"
            disabled={updateBusy}
            onClick={() => {
              void refreshUpdateStatus();
            }}
          >
            {updateBusy
              ? "Sprawdzanie…"
              : "Sprawdź aktualizacje"}
          </button>
          <small>
            Ten etap wykrywa wydania. Automatyczna instalacja po akceptacji zostanie włączona dopiero z podpisanym updaterem desktopowym.
          </small>
        </div>


      </aside>

      <main className="main-panel">
        <header className="page-header">
          <div>
            <p className="eyebrow">Nowa analiza</p>
            <h2>Konfiguracja sesji prawnej</h2>
            <p>
              Wybierz dostawcę, model dostępny dla Twojego API oraz
              domenę prawa.
            </p>
          </div>
          <div className="security-pill">LOCAL-FIRST</div>
        </header>

        {runtimeError && (
          <div className="alert alert-error">
            Backend lokalny jest niedostępny: {runtimeError}
          </div>
        )}

        <section className="case-selector">
          <div className="case-selector-head">
            <div>
              <p className="eyebrow">Sprawa</p>
              <h3>Wybierz sprawę</h3>
              <p>
                Aplikacja nie tworzy już spraw automatycznie po zalogowaniu. Widzisz wyłącznie sprawy dostępne w Twoim ACL.
              </p>
            </div>
            {caseId && (
              <span className="security-pill">
                {cases.find((item) => item.caseId === caseId)?.role ?? "—"}
              </span>
            )}
          </div>

          <div className="case-selector-controls">
            <label>
              Dostępne sprawy
              <select
                value={caseId}
                onChange={(event) => {
                  setCaseId(event.target.value);
                  setDocumentAttachments([]);
                  setExecution(null);
                  setExecutionError("");
                  setCaseError("");
                  setCaseDeletePassword("");
                  setCaseDeleteConfirmation("");
                }}
              >
                <option value="">
                  — wybierz sprawę —
                </option>
                {matterCases.map((item) => (
                  <option key={item.caseId} value={item.caseId}>
                    {item.displayName || item.caseId.slice(0, 18)}
                    {" · "}
                    {item.role}
                    {item.archivedAt
                      ? " · ARCHIWALNA"
                      : ""}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Nowa sprawa
              <input
                value={newCaseName}
                maxLength={160}
                placeholder="Opcjonalna nazwa sprawy"
                onChange={(event) =>
                  setNewCaseName(event.target.value)
                }
              />
            </label>

            <button
              type="button"
              className="primary-button"
              disabled={caseBusy}
              onClick={() => void createLocalCase()}
            >
              {caseBusy ? "Tworzę…" : "Utwórz sprawę"}
            </button>
          </div>

          {caseId ? (
            <p className="case-selector-meta">
              {(() => {
                const selected =
                  cases.find((item) => item.caseId === caseId);
                return selected
                  ? `Rola: ${selected.role} · reidentyfikacja: ${selected.canReidentify ? "dozwolona przez ACL" : "niedozwolona"} · klucz v${selected.keyVersion}${selected.archivedAt ? " · ARCHIWALNA (tylko odczyt)" : ""}`
                  : "";
              })()}
            </p>
          ) : (
            <p className="case-selector-meta">
              Wybierz istniejącą sprawę albo utwórz nową przed pracą z dokumentami.
            </p>
          )}

          {selectedCase?.role === "OWNER" && (
            <div className="case-lifecycle-panel">
              <div className="case-lifecycle-row">
                <label>
                  Nazwa sprawy
                  <input
                    value={caseRenameName}
                    maxLength={160}
                    disabled={caseBusy}
                    onChange={(event) =>
                      setCaseRenameName(
                        event.target.value
                      )
                    }
                  />
                </label>
                <button
                  type="button"
                  className="primary-button"
                  disabled={
                    caseBusy ||
                    !caseRenameName.trim()
                  }
                  onClick={() =>
                    void renameSelectedCase()
                  }
                >
                  Zmień nazwę
                </button>
                <button
                  type="button"
                  disabled={caseBusy}
                  onClick={() =>
                    void toggleSelectedCaseArchive()
                  }
                >
                  {selectedCase.archivedAt
                    ? "Przywróć z archiwum"
                    : "Archiwizuj sprawę"}
                </button>
              </div>

              <details className="case-delete-panel">
                <summary>Trwałe usunięcie sprawy</summary>
                <p className="field-help">
                  Operacja wymaga ponownego podania hasła. Usunięcie plików nie jest przedstawiane jako gwarantowane secure erase nośnika SSD/flash.
                </p>
                <div className="case-lifecycle-row">
                  <label>
                    Potwierdzenie
                    <input
                      value={caseDeleteConfirmation}
                      placeholder="Wpisz USUŃ"
                      autoComplete="off"
                      disabled={caseBusy}
                      onChange={(event) =>
                        setCaseDeleteConfirmation(
                          event.target.value
                        )
                      }
                    />
                  </label>
                  <label>
                    Bieżące hasło
                    <input
                      type="password"
                      value={caseDeletePassword}
                      autoComplete="current-password"
                      disabled={caseBusy}
                      onChange={(event) =>
                        setCaseDeletePassword(
                          event.target.value
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="danger-button"
                    disabled={
                      caseBusy ||
                      caseDeleteConfirmation !==
                        "USUŃ" ||
                      !caseDeletePassword
                    }
                    onClick={() =>
                      void deleteSelectedCase()
                    }
                  >
                    Usuń sprawę trwale
                  </button>
                </div>
              </details>
            </div>
          )}

          {caseError && (
            <div className="alert alert-error">
              Operacja na sprawie nie powiodła się: {caseError}
            </div>
          )}
        </section>

        <CaseWorkspacePanel
          caseId={caseId}
          isAdmin={user.appRole === "ADMIN"}
          refreshToken={workspaceRefresh}
        />

        <CaseCollaborationPanel
          caseId={caseId}
          caseRole={
            selectedCase?.role
          }
        />

        <FirmKnowledgePanel
          user={user}
          currentCase={
            selectedCase
          }
          onUseHit={
            addKnowledgeAttachment
          }
          onWorkspaceChange={
            setFirmKnowledgeWorkspace
          }
        />

        {selectedCase?.archivedAt ? (
          <section className="alert">
            Sprawa jest zarchiwizowana. Akta pozostają dostępne do odczytu, ale upload, analiza dokumentów i reidentyfikacja są zablokowane do czasu przywrócenia sprawy.
          </section>
        ) : (
          <>
            {documentDropQueue.total > 0 && (
              <section
                className="document-drop-queue"
                aria-live="polite"
                aria-label="Kolejka dokumentów"
              >
                <div className="document-drop-queue-head">
                  <strong>
                    {documentDropQueue.files.length > 0
                      ? `Przetwarzanie ${Math.min(
                          documentDropQueue.completed + 1,
                          documentDropQueue.total
                        )}/${documentDropQueue.total}`
                      : `Kolejka zakończona ${documentDropQueue.completed}/${documentDropQueue.total}`}
                  </strong>
                  <span>
                    Maksymalnie {MAX_DOCUMENT_DROP_QUEUE} plików w kolejce
                  </span>
                </div>
                {documentDropQueue.rejected > 0 && (
                  <p className="document-drop-rejected">
                    Pominięto {documentDropQueue.rejected} plików: pustych albo ponad limit kolejki.
                  </p>
                )}
                {documentDropQueue.files.length > 0 && (
                  <ul className="document-drop-file-list">
                    {documentDropQueue.files
                      .slice(0, 8)
                      .map((file, index) => (
                        <li
                          key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                        >
                          <span>
                            {index === 0
                              ? "Przetwarzanie"
                              : "Oczekuje"}
                          </span>
                          <strong>{file.name}</strong>
                          <small>
                            {describeDocumentFile(file)}
                          </small>
                        </li>
                      ))}
                  </ul>
                )}
              </section>
            )}
            <DocumentPrivacyPanel
            caseId={caseId}
            incomingFile={
              documentDropQueue.files[0] ??
              null
            }
            onIncomingFileConsumed={
              consumeQueuedDocumentFile
            }
            onCaseFilesChange={() =>
              setWorkspaceRefresh(
                (value) => value + 1
              )
            }
            onAttachmentSelectionChange={(selection) => {
              setDocumentAttachments(
                selection ? [selection] : []
              );
              setExecution(null);
              setExecutionError("");
            }}
          />
          </>
        )}

        <section className="config-grid">
          <article className="config-card">
            <span className="step">01</span>
            <label htmlFor="provider">Dostawca modelu</label>
            <select
              id="provider"
              value={provider}
              onChange={(event) => {
                setProvider(
                  event.target.value as ProviderId
                );
                setProviderApiKeyInput("");
                setProviderKeyMessage("");
                setProviderKeyError("");
              }}
            >
              {PROVIDERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                  {providerConfiguration[item.id] === true
                    ? " — API gotowe"
                    : providerConfiguration[item.id] === false
                      ? " — brak klucza"
                      : " — sprawdzanie"}
                </option>
              ))}
            </select>
            <p className="field-help">
              Konfiguracja API: {providerConfigured === true
                ? "skonfigurowana lokalnie"
                : providerConfigured === false
                  ? "brak lokalnego klucza"
                  : "sprawdzanie"}. Wartość klucza nigdy nie trafia do przeglądarki.
            </p>
            {providerDefinition && (
              <a
                className="provider-key-link"
                href={
                  providerDefinition
                    .apiKeyUrl
                }
                target="_blank"
                rel="noreferrer noopener"
              >
                {providerConfigured ===
                true
                  ? "Zarządzaj kluczem API"
                  : "Utwórz / pobierz klucz API"}
              </a>
            )}

            {user.appRole ===
              "ADMIN" && (
              <div className="provider-key-editor">
                <label>
                  Klucz API
                  <input
                    type="password"
                    autoComplete="off"
                    value={
                      providerApiKey
                    }
                    disabled={
                      providerKeyBusy
                    }
                    onChange={(event) =>
                      setProviderApiKeyInput(
                        event.target
                          .value
                      )
                    }
                    placeholder="Wklej klucz; nie zostanie zapisany na dysku"
                  />
                </label>
                <div className="provider-key-actions">
                  <button
                    type="button"
                    disabled={
                      providerKeyBusy ||
                      !providerApiKey
                        .trim()
                    }
                    onClick={() => {
                      void saveProviderApiKey(
                        "PROCESS_MEMORY"
                      );
                    }}
                  >
                    Użyj tylko w tej sesji
                  </button>
                  {isDesktopShell() && (
                    <button
                      type="button"
                      disabled={
                        providerKeyBusy ||
                        !providerApiKey
                          .trim()
                      }
                      onClick={() => {
                        void saveProviderApiKey(
                          "OS_KEYRING"
                        );
                      }}
                    >
                      Zapisz w systemowym magazynie
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={
                      providerKeyBusy
                    }
                    onClick={() => {
                      void removeProviderApiKey();
                    }}
                  >
                    Usuń klucz
                  </button>
                </div>
                <p className="field-help">
                  {isDesktopShell()
                    ? "Wersja desktopowa pozwala jawnie wybrać pamięć procesu albo systemowy magazyn poświadczeń. Zapis trwały nie jest wykonywany bez wybrania tej opcji."
                    : "W wersji przeglądarkowej klucz pozostaje wyłącznie w pamięci lokalnego procesu backendu."}
                </p>
                {providerKeyMessage && (
                  <p className="field-help">
                    {providerKeyMessage}
                  </p>
                )}
                {providerKeyError && (
                  <p className="field-error">
                    {providerKeyError}
                  </p>
                )}
              </div>
            )}
          </article>

          <article className="config-card">
            <span className="step">02</span>
            <label htmlFor="model">Model</label>
            <select
              id="model"
              value={model}
              disabled={models.length === 0}
              onChange={(event) => setModel(event.target.value)}
            >
              {models.length === 0 && (
                <option value="">Brak dostępnych modeli</option>
              )}
              {models.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  disabled={!item.selectable}
                >
                  {item.displayName}
                  {!item.selectable ? " — nieobsługiwany" : ""}
                </option>
              ))}
            </select>

            {modelError ? (
              <p className="field-error">
                {modelError === "PROVIDER_NOT_CONFIGURED"
                  ? "Brak lokalnej konfiguracji API dla tego dostawcy."
                  : "Nie udało się pobrać listy modeli."}
              </p>
            ) : (
              <p className="field-help">
                {selectedModel?.contextWindow
                  ? `Kontekst: ${selectedModel.contextWindow.toLocaleString(
                      "pl-PL"
                    )} tokenów`
                  : "Wyświetlane są modele zwrócone przez konto API."}
              </p>
            )}
          </article>

          <article className="config-card config-card-wide">
            <span className="step">03</span>
            <label htmlFor="route">Dziedzina prawa</label>
            <select
              id="route"
              value={route}
              disabled={routes.length === 0}
              onChange={(event) => {
                setRoute(event.target.value);
                setRouteStatus("idle");
                setRouteReason("");
                setExecution(null);
              }}
            >
              {routes.map((item) => (
                <option key={item} value={item}>
                  {labelForDr(item)}
                </option>
              ))}
            </select>

            <div className="route-actions">
              <button
                type="button"
                className="primary-button"
                onClick={checkRoute}
                disabled={!route || !runtimeOnline}
              >
                Sprawdź routing
              </button>

              {routeStatus === "valid" && (
                <span className="validation validation-ok">
                  ✓ Routing zgodny z Lex
                </span>
              )}
              {routeStatus === "invalid" && (
                <span className="validation validation-error">
                  Routing zablokowany
                  {routeReason ? ` · ${routeReason}` : ""}
                </span>
              )}
            </div>
          </article>

          <article
            className={
              `config-card config-card-wide conversation-drop-zone${queryDropActive ? " conversation-drop-active" : ""}`
            }
            onDragEnter={(event) => {
              if (
                event.dataTransfer.types
                  .includes("Files")
              ) {
                event.preventDefault();
                queryDragDepth.current += 1;
                setQueryDropActive(
                  true
                );
              }
            }}
            onDragOver={(event) => {
              if (
                event.dataTransfer.types
                  .includes("Files")
              ) {
                event.preventDefault();
                event.dataTransfer.dropEffect =
                  "copy";
                setQueryDropActive(
                  true
                );
              }
            }}
            onDragLeave={() => {
              queryDragDepth.current =
                Math.max(
                  0,
                  queryDragDepth.current - 1
                );
              if (
                queryDragDepth.current === 0
              ) {
                setQueryDropActive(
                  false
                );
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              queryDragDepth.current = 0;
              setQueryDropActive(
                false
              );
              enqueueDocumentFiles(
                event.dataTransfer.files
              );
            }}
          >
            <span className="step">04</span>
            <label htmlFor="query">Pytanie / zadanie</label>
            <textarea
              id="query"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setExecution(null);
                setExecutionError("");
              }}
              maxLength={30000}
              placeholder="Opisz problem prawny, stan faktyczny albo zadanie analityczne..."
            />
            <div className="document-drop-actions">
              <label className="queue-file-button">
                Dodaj wiele plików
                <input
                  type="file"
                  multiple
                  accept={DOCUMENT_FILE_ACCEPT}
                  disabled={
                    !caseId ||
                    Boolean(
                      selectedCase?.archivedAt
                    )
                  }
                  onChange={(event) => {
                    if (
                      event.target.files
                    ) {
                      enqueueDocumentFiles(
                        event.target.files
                      );
                    }
                    event.currentTarget.value =
                      "";
                  }}
                />
              </label>
              <small>
                Przeciągnij pliki albo użyj przycisku. Każdy plik przechodzi przez ten sam lokalny pipeline prywatności; kolejka jest przetwarzana sekwencyjnie.
              </small>
            </div>
            <p className="field-help">
              Treść zostanie przesłana do wybranego providera dopiero po
              uruchomieniu analizy. Wynik z niezweryfikowanym powołaniem
              prawnym zostanie zatrzymany przez HARD GATE. Możesz też przeciągnąć wiele obsługiwanych plików bezpośrednio na to pole — każdy przejdzie sekwencyjnie przez lokalną ścieżkę prywatności przed użyciem w analizie.
            </p>
            <div className="knowledge-execution-controls">
              <label>
                <input
                  type="checkbox"
                  checked={
                    includeCaseKnowledge
                  }
                  disabled={
                    !selectedCase ||
                    Boolean(
                      selectedCase
                        .archivedAt
                    ) ||
                    selectedCase.role ===
                      "VIEWER"
                  }
                  onChange={(event) =>
                    setIncludeCaseKnowledge(
                      event.target
                        .checked
                    )
                  }
                />
                Przeszukaj chronione dokumenty bieżącej sprawy
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={
                    includeFirmKnowledge
                  }
                  disabled={
                    !firmKnowledgeWorkspace ||
                    firmKnowledgeWorkspace.role ===
                      "VIEWER"
                  }
                  onChange={(event) =>
                    setIncludeFirmKnowledge(
                      event.target
                        .checked
                    )
                  }
                />
                Przeszukaj know-how kancelarii
              </label>
              <small>
                Retrieval odbywa się lokalnie. Do providera trafiają wyłącznie najwyżej ocenione, pseudonimizowane chunki wybranych zasobów.
              </small>
            </div>
          </article>
        </section>

        <section className="session-preview">
          <div>
            <p className="eyebrow">Sesja</p>
            <h3>Gotowość do wykonania</h3>
          </div>
          <dl>
            <div>
              <dt>Provider</dt>
              <dd>{provider}</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>{model || "—"}</dd>
            </div>
            <div>
              <dt>Routing</dt>
              <dd>{routeStatus === "valid" ? "zweryfikowany" : "do sprawdzenia"}</dd>
            </div>
            <div>
              <dt>Dokument</dt>
              <dd>
                {documentAttachments.length > 0
                  ? `${documentAttachments[0]?.chunkIndices.length ?? 0} chronionych chunków`
                  : "bez załącznika"}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            className="primary-button"
            onClick={runAnalysis}
            disabled={
              executing ||
              !runtimeOnline ||
              providerConfigured !== true ||
              !model ||
              routeStatus !== "valid" ||
              !query.trim()
            }
          >
            {executing ? "Analizuję…" : "Uruchom analizę"}
          </button>
        </section>

        <DocumentAuthoringPanel
          currentCase={
            selectedCase
          }
          provider={
            provider
          }
          providerConfigured={
            providerConfigured ===
              true
          }
          model={
            model
          }
          primarySkill={
            route
          }
          routeValid={
            routeStatus ===
              "valid"
          }
          query={
            query
          }
          attachments={
            documentAttachments
          }
        />

        {executionError && (
          <section className="execution-result execution-error">
            <p className="eyebrow">Błąd wykonania</p>
            <h3>{executionError}</h3>
          </section>
        )}

        {execution?.status === "BLOCKED" && (
          <section className="execution-result execution-blocked">
            <p className="eyebrow">HARD GATE</p>
            <h3>Odpowiedź została zatrzymana przed prezentacją.</h3>
            <p>
              Model zwrócił powołania prawne bez wymaganego śladu
              weryfikacji. Surowa odpowiedź nie została przekazana do
              przeglądarki.
            </p>
            <p className="result-note">
              Rekordy weryfikacji: {execution.verification.verified} VERIFIED ·
              {" "}{execution.verification.supported} SUPPORTED ·
              {" "}{execution.verification.unverified} UNVERIFIED.
            </p>
            <EvidencePanel evidence={execution.evidence} />
            {execution.blockedReferences.length > 0 && (
              <ul className="blocked-list">
                {execution.blockedReferences.map((reference, index) => (
                  <li key={`${reference.claim}-${index}`}>
                    <strong>{reference.claim}</strong>
                    <span>{reference.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {execution?.status === "DRAFT_PRESENTABLE" && execution.answer && (
          <section className="execution-result execution-ok">
            <p className="eyebrow">Szkic odpowiedzi</p>
            <h3>Wynik przeszedł aktualną bramkę prezentacji.</h3>
            <p className="result-note">
              To wynik sesji roboczej, nie eksport końcowego pisma.
              Eksport dokumentów nadal podlega G10.
            </p>
            <div className="answer-text">{execution.answer}</div>
            <EvidencePanel evidence={execution.evidence} />
            <footer className="result-meta">
              Sesja {execution.sessionId} · audit {execution.audit.result} ·
              {execution.audit.eventCount} zdarzeń · VERIFIED:
              {" "}{execution.verification.verified} · SUPPORTED:
              {" "}{execution.verification.supported} · wszystkie:
              {" "}{execution.verification.records}
            </footer>
          </section>
        )}
      </main>
    </div>
  );
}