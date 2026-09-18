import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent
} from "react";
import { CaseCollaborationPanel } from "./CaseCollaborationPanel.js";
import { CaseWorkspacePanel } from "./CaseWorkspacePanel.js";
import { DocumentPrivacyPanel } from "./DocumentPrivacyPanel.js";
import { FirmKnowledgePanel } from "./FirmKnowledgePanel.js";
import {
  apiBase,
  clearProviderApiKey,
  createCase,
  executeSession,
  getHealth,
  getModels,
  getProviderStatus,
  getRoutes,
  isDesktopShell,
  listCases,
  setProviderApiKey,
  type AuthenticatedUser,
  type CaseListItem,
  type DocumentAttachmentSelection,
  type EvidenceItem,
  type ModelDescriptor,
  type ProviderId,
  type SessionExecutionResponse
} from "./api.js";
import {
  DOCUMENT_FILE_ACCEPT,
  MAX_DOCUMENT_DROP_QUEUE,
  consumeDocumentDropFile,
  createDocumentDropQueueState,
  describeDocumentFile,
  enqueueDocumentDropFiles
} from "./document-drop-queue.js";
import {
  buildSkillSelectionEnvelope,
  choosePrimaryRoute,
  labelForSkill,
  type PublicSkillDescriptor
} from "./chat-routing.js";
import "./chat.css";

type TabId = "chat" | "files" | "skills" | "case" | "settings";
type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  evidence?: EvidenceItem[];
  meta?: string;
};

const PROVIDERS: Array<{
  id: ProviderId;
  label: string;
  apiKeyUrl: string;
}> = [
  {
    id: "openai",
    label: "OpenAI",
    apiKeyUrl: "https://platform.openai.com/api-keys"
  },
  {
    id: "anthropic",
    label: "Anthropic / Claude",
    apiKeyUrl: "https://platform.claude.com/settings/keys"
  },
  {
    id: "xai",
    label: "xAI / Grok",
    apiKeyUrl: "https://console.x.ai/"
  }
];

const MANDATORY_SKILLS = ["prawny-router-v3", "shared"] as const;

function messageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function conversationForProvider(
  messages: ChatMessage[],
  next: string
): string {
  const history = messages
    .filter((item) => item.role !== "system")
    .slice(-8)
    .map((item) =>
      `${item.role === "user" ? "Użytkownik" : "Asystent"}: ${item.content}`
    )
    .join("\n\n");
  const combined = history
    ? `${history}\n\nUżytkownik: ${next}`
    : next;
  return combined.length > 27_000
    ? combined.slice(-27_000)
    : combined;
}

function upsertAttachment(
  current: DocumentAttachmentSelection[],
  selection: DocumentAttachmentSelection
): DocumentAttachmentSelection[] {
  const existing = current.findIndex(
    (item) =>
      item.caseId === selection.caseId &&
      item.documentId === selection.documentId
  );
  if (existing >= 0) {
    return current.map((item, index) =>
      index === existing ? selection : item
    );
  }
  return [...current, selection].slice(-4);
}

async function openExternalUrl(url: string): Promise<void> {
  if (isDesktopShell()) {
    const internals = (
      window as Window & {
        __TAURI_INTERNALS__?: {
          invoke?: (
            command: string,
            args?: Record<string, unknown>
          ) => Promise<unknown>;
        };
      }
    ).__TAURI_INTERNALS__;
    if (internals?.invoke) {
      await internals.invoke("open_external_url", { url });
      return;
    }
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function executionMessage(
  execution: SessionExecutionResponse,
  route: string
): ChatMessage {
  if (
    execution.status === "DRAFT_PRESENTABLE" &&
    execution.answer
  ) {
    return {
      id: messageId(),
      role: "assistant",
      content: execution.answer,
      evidence: execution.evidence,
      meta:
        `routing: ${labelForSkill(execution.primarySkill || route)}` +
        ` · VERIFIED ${execution.verification.verified}` +
        ` · SUPPORTED ${execution.verification.supported}`
    };
  }

  return {
    id: messageId(),
    role: "system",
    content:
      "HARD GATE zatrzymał odpowiedź przed prezentacją, ponieważ wymagany ślad weryfikacji nie był kompletny.",
    evidence: execution.evidence,
    meta:
      `routing: ${labelForSkill(execution.primarySkill || route)}` +
      ` · UNVERIFIED ${execution.verification.unverified}`
  };
}

export default function ChatApp({
  user
}: {
  user: AuthenticatedUser;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [runtimeOnline, setRuntimeOnline] = useState(false);
  const [runtimeError, setRuntimeError] = useState("");

  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [caseId, setCaseId] = useState("");
  const [newCaseName, setNewCaseName] = useState("");
  const [caseBusy, setCaseBusy] = useState(false);
  const [caseError, setCaseError] = useState("");
  const [workspaceRefresh, setWorkspaceRefresh] = useState(0);

  const [provider, setProvider] = useState<ProviderId>("openai");
  const [providerConfiguration, setProviderConfiguration] = useState<
    Record<ProviderId, boolean | undefined>
  >({
    openai: undefined,
    anthropic: undefined,
    xai: undefined
  });
  const [providerApiKey, setProviderApiKeyInput] = useState("");
  const [providerKeyBusy, setProviderKeyBusy] = useState(false);
  const [providerKeyMessage, setProviderKeyMessage] = useState("");
  const [models, setModels] = useState<ModelDescriptor[]>([]);
  const [model, setModel] = useState("");
  const [modelError, setModelError] = useState("");

  const [routes, setRoutes] = useState<string[]>([]);
  const [skills, setSkills] = useState<PublicSkillDescriptor[]>([]);
  const [manualSkills, setManualSkills] = useState<string[]>([]);
  const [automaticSkills, setAutomaticSkills] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Opisz sprawę albo zadanie. Lex Machina dobierze routing i potrzebne skille automatycznie. Prawny router i shared są zawsze aktywne."
    }
  ]);
  const [query, setQuery] = useState("");
  const [executing, setExecuting] = useState(false);
  const [executionError, setExecutionError] = useState("");

  const [documentAttachments, setDocumentAttachments] = useState<
    DocumentAttachmentSelection[]
  >([]);
  const [firmKnowledgeWorkspace, setFirmKnowledgeWorkspace] =
    useState<CaseListItem | null>(null);
  const [includeCaseKnowledge, setIncludeCaseKnowledge] = useState(false);
  const [includeFirmKnowledge, setIncludeFirmKnowledge] = useState(false);
  const [documentDropQueue, setDocumentDropQueue] = useState(
    createDocumentDropQueueState
  );
  const [dropActive, setDropActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragDepth = useRef(0);

  const matterCases = useMemo(
    () =>
      cases.filter((item) => item.caseKind !== "FIRM_KNOWLEDGE"),
    [cases]
  );
  const selectedCase = useMemo(
    () => cases.find((item) => item.caseId === caseId),
    [cases, caseId]
  );
  const providerDefinition = PROVIDERS.find((item) => item.id === provider);
  const providerConfigured = providerConfiguration[provider];
  const selectedModel = models.find((item) => item.id === model);
  const currentPrimaryRoute = useMemo(
    () =>
      choosePrimaryRoute(
        query,
        routes,
        skills,
        manualSkills
      ),
    [query, routes, skills, manualSkills]
  );
  const filteredSkills = useMemo(() => {
    const needle = skillFilter.trim().toLowerCase();
    return skills
      .filter(
        (item) =>
          !MANDATORY_SKILLS.includes(
            item.name as (typeof MANDATORY_SKILLS)[number]
          ) &&
          item.name !== "prawo-polskie-v2"
      )
      .filter(
        (item) =>
          !needle ||
          item.name.toLowerCase().includes(needle) ||
          item.description?.toLowerCase().includes(needle)
      );
  }, [skills, skillFilter]);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      getHealth(),
      getRoutes(),
      getProviderStatus(),
      listCases()
    ])
      .then(([health, routeList, providerStatus, caseList]) => {
        if (cancelled) return;
        setRuntimeOnline(
          health.status === "ok" &&
          health.localOnly === true
        );
        setRoutes(routeList.primarySkills);
        setCases(caseList.cases);
        const matters = caseList.cases.filter(
          (item) => item.caseKind !== "FIRM_KNOWLEDGE"
        );
        setCaseId(
          matters.find((item) => !item.archivedAt)?.caseId ??
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
      })
      .catch((error) => {
        if (cancelled) return;
        setRuntimeOnline(false);
        setRuntimeError(
          error instanceof Error ? error.message : String(error)
        );
      });

    void fetch(`${apiBase()}/api/skills`, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP_${response.status}`);
        }
        return await response.json() as {
          skills?: PublicSkillDescriptor[];
        };
      })
      .then((payload) => {
        if (
          !cancelled &&
          Array.isArray(payload.skills)
        ) {
          setSkills(payload.skills);
        }
      })
      .catch(() => {
        // /api/routes supplies a safe fallback below.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      skills.length === 0 &&
      routes.length > 0
    ) {
      setSkills(
        routes.map((name) => ({
          name,
          category: "domain"
        }))
      );
    }
  }, [routes, skills.length]);

  useEffect(() => {
    let cancelled = false;
    setModels([]);
    setModel("");
    setModelError("");

    if (providerConfigured !== true) {
      if (providerConfigured === false) {
        setModelError("PROVIDER_NOT_CONFIGURED");
      }
      return () => {
        cancelled = true;
      };
    }

    void getModels(provider)
      .then((response) => {
        if (cancelled) return;
        setModels(response.models);
        setModel(
          response.models.find((item) => item.selectable)?.id ?? ""
        );
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

  useEffect(() => {
    setDocumentDropQueue(createDocumentDropQueueState());
    setDocumentAttachments([]);
  }, [caseId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages, executing]);

  async function refreshCases(preferredCaseId?: string): Promise<void> {
    const refreshed = await listCases();
    setCases(refreshed.cases);
    const matters = refreshed.cases.filter(
      (item) => item.caseKind !== "FIRM_KNOWLEDGE"
    );
    const next =
      matters.find((item) => item.caseId === preferredCaseId) ??
      matters.find((item) => !item.archivedAt) ??
      matters[0];
    setCaseId(next?.caseId ?? "");
  }

  async function createLocalCase(
    displayName?: string
  ): Promise<string> {
    setCaseBusy(true);
    setCaseError("");
    try {
      const created = await createCase(
        displayName?.trim() || undefined
      );
      await refreshCases(created.caseId);
      setNewCaseName("");
      return created.caseId;
    } catch (error) {
      setCaseError(
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    } finally {
      setCaseBusy(false);
    }
  }

  async function ensureWritableCase(): Promise<string> {
    if (
      selectedCase &&
      !selectedCase.archivedAt
    ) {
      return selectedCase.caseId;
    }
    return await createLocalCase("Nowa sprawa");
  }

  async function acceptFiles(
    files: readonly File[] | FileList
  ): Promise<void> {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;

    try {
      await ensureWritableCase();
      setDocumentDropQueue((current) =>
        enqueueDocumentDropFiles(current, incoming)
      );
      setActiveTab("files");
    } catch {
      setExecutionError(
        "Nie udało się utworzyć aktywnej sprawy dla dodawanych plików."
      );
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>): void {
    event.preventDefault();
    dragDepth.current = 0;
    setDropActive(false);
    void acceptFiles(event.dataTransfer.files);
  }

  function toggleManualSkill(name: string): void {
    if (
      MANDATORY_SKILLS.includes(
        name as (typeof MANDATORY_SKILLS)[number]
      )
    ) {
      return;
    }
    setManualSkills((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name].slice(-16)
    );
  }

  async function refreshProviderStatus(): Promise<void> {
    const result = await getProviderStatus();
    setProviderConfiguration(
      Object.fromEntries(
        result.providers.map((item) => [
          item.provider,
          item.configured
        ])
      ) as Record<ProviderId, boolean>
    );
  }

  async function saveApiKey(): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      !providerApiKey.trim()
    ) {
      return;
    }

    setProviderKeyBusy(true);
    setProviderKeyMessage("");
    try {
      await setProviderApiKey(
        provider,
        providerApiKey,
        isDesktopShell()
          ? "OS_KEYRING"
          : "PROCESS_MEMORY"
      );
      setProviderApiKeyInput("");
      await refreshProviderStatus();
      setProviderKeyMessage(
        isDesktopShell()
          ? "Klucz zapisano w systemowym magazynie poświadczeń."
          : "Klucz jest aktywny w pamięci procesu."
      );
    } catch (error) {
      setProviderKeyMessage(
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setProviderKeyBusy(false);
    }
  }

  async function removeApiKey(): Promise<void> {
    if (user.appRole !== "ADMIN") return;
    setProviderKeyBusy(true);
    try {
      await clearProviderApiKey(provider);
      await refreshProviderStatus();
      setProviderKeyMessage("Klucz został usunięty.");
    } catch (error) {
      setProviderKeyMessage(
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setProviderKeyBusy(false);
    }
  }

  async function sendMessage(): Promise<void> {
    const plain = query.trim();
    if (
      executing ||
      !plain ||
      !runtimeOnline ||
      providerConfigured !== true ||
      !model ||
      !currentPrimaryRoute
    ) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: messageId(),
        role: "user",
        content: plain
      }
    ]);
    setQuery("");
    setExecuting(true);
    setExecutionError("");

    try {
      const result = await executeSession({
        query: buildSkillSelectionEnvelope(
          conversationForProvider(messages, plain),
          automaticSkills,
          manualSkills
        ),
        provider,
        model,
        primarySkill: currentPrimaryRoute,
        mode: "PRAWNIK",
        ...(documentAttachments.length > 0
          ? {
              attachments: documentAttachments
            }
          : {}),
        ...(includeCaseKnowledge || includeFirmKnowledge
          ? {
              knowledge: {
                ...(includeCaseKnowledge && selectedCase
                  ? {
                      caseId: selectedCase.caseId,
                      includeCase: true
                    }
                  : {
                      includeCase: false
                    }),
                includeFirm: includeFirmKnowledge,
                limit: 8
              }
            }
          : {})
      });

      setMessages((current) => [
        ...current,
        executionMessage(result, currentPrimaryRoute)
      ]);
    } catch (error) {
      const code =
        error instanceof Error ? error.message : String(error);
      const friendly =
        code === "PROVIDER_NOT_CONFIGURED"
          ? "Brak lokalnego klucza API dla wybranego dostawcy."
          : code === "PROVIDER_EXECUTION_FAILED"
            ? "Provider odrzucił lub przerwał wykonanie."
            : code === "DOCUMENT_ATTACHMENT_RESOLUTION_FAILED"
              ? "Nie udało się bezpiecznie dołączyć wybranych fragmentów dokumentu."
              : `Nie udało się wykonać sesji: ${code}`;
      setExecutionError(friendly);
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "system",
          content: friendly
        }
      ]);
    } finally {
      setExecuting(false);
    }
  }

  const canSend =
    runtimeOnline &&
    providerConfigured === true &&
    Boolean(model) &&
    Boolean(currentPrimaryRoute) &&
    Boolean(query.trim()) &&
    !executing;

  return (
    <div className="chat-app-shell">
      <aside className="chat-sidebar">
        <div className="chat-brand">
          <span className="chat-brand-mark">LM</span>
          <div>
            <strong>Lex Machina</strong>
            <small>chat prawny · local-first</small>
          </div>
        </div>

        <nav className="chat-tabs" aria-label="Sekcje aplikacji">
          {([
            ["chat", "Czat"],
            ["files", "Pliki"],
            ["skills", "Skille"],
            ["case", "Sprawa"],
            ["settings", "Model i API"]
          ] as Array<[TabId, string]>).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={
                activeTab === id
                  ? "chat-tab chat-tab-active"
                  : "chat-tab"
              }
              onClick={() => setActiveTab(id)}
            >
              {label}
              {id === "files" && documentDropQueue.total > 0 ? (
                <span>{documentDropQueue.total}</span>
              ) : null}
              {id === "skills" && manualSkills.length > 0 ? (
                <span>{manualSkills.length}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="chat-sidebar-card">
          <div className="chat-status-line">
            <span
              className={
                runtimeOnline
                  ? "chat-dot online"
                  : "chat-dot offline"
              }
            />
            <strong>
              {runtimeOnline ? "Runtime aktywny" : "Runtime offline"}
            </strong>
          </div>
          <small>
            {selectedCase?.displayName ||
              (caseId ? `${caseId.slice(0, 14)}…` : "brak aktywnej sprawy")}
          </small>
        </div>

        <div className="chat-sidebar-foot">
          <span>prawny-router-v3 ✓</span>
          <span>shared ✓</span>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-page-header">
          <div>
            <p className="eyebrow">Lex Machina</p>
            <h1>
              {activeTab === "chat"
                ? "Czat prawny"
                : activeTab === "files"
                  ? "Pliki i prywatność"
                  : activeTab === "skills"
                    ? "Skille"
                    : activeTab === "case"
                      ? "Sprawa i wiedza"
                      : "Model i klucz API"}
            </h1>
          </div>
          <div className="chat-header-actions">
            <button
              type="button"
              className="chat-secondary-action"
              onClick={() => fileInputRef.current?.click()}
            >
              + Dodaj pliki
            </button>
            <input
              ref={fileInputRef}
              className="chat-hidden-file-input"
              type="file"
              multiple
              accept={DOCUMENT_FILE_ACCEPT}
              onChange={(event) => {
                if (event.target.files) {
                  void acceptFiles(event.target.files);
                }
                event.currentTarget.value = "";
              }}
            />
          </div>
        </header>

        {runtimeError ? (
          <div className="chat-alert chat-alert-error">
            Backend lokalny jest niedostępny: {runtimeError}
          </div>
        ) : null}
        {caseError ? (
          <div className="chat-alert chat-alert-error">
            Operacja na sprawie nie powiodła się: {caseError}
          </div>
        ) : null}

        {activeTab === "chat" ? (
          <section
            className={
              dropActive
                ? "chat-panel chat-drop-active"
                : "chat-panel"
            }
            onDragEnter={(event) => {
              if (event.dataTransfer.types.includes("Files")) {
                event.preventDefault();
                dragDepth.current += 1;
                setDropActive(true);
              }
            }}
            onDragOver={(event) => {
              if (event.dataTransfer.types.includes("Files")) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                setDropActive(true);
              }
            }}
            onDragLeave={() => {
              dragDepth.current = Math.max(
                0,
                dragDepth.current - 1
              );
              if (dragDepth.current === 0) {
                setDropActive(false);
              }
            }}
            onDrop={handleDrop}
          >
            <div className="chat-message-list" aria-live="polite">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`chat-message chat-message-${message.role}`}
                >
                  <div className="chat-message-role">
                    {message.role === "user"
                      ? "Ty"
                      : message.role === "assistant"
                        ? "Lex Machina"
                        : "System"}
                  </div>
                  <div className="chat-message-content">
                    {message.content}
                  </div>
                  {message.meta ? (
                    <small className="chat-message-meta">
                      {message.meta}
                    </small>
                  ) : null}
                  {message.evidence?.length ? (
                    <details className="chat-evidence">
                      <summary>
                        Źródła i weryfikacja ({message.evidence.length})
                      </summary>
                      <ul>
                        {message.evidence.map((item, index) => (
                          <li key={`${item.claim}-${index}`}>
                            <span>
                              {item.status} · {item.kind}
                            </span>
                            <strong>{item.claim}</strong>
                            {item.sourceUrl ? (
                              <button
                                type="button"
                                onClick={() =>
                                  void openExternalUrl(item.sourceUrl!)
                                }
                              >
                                Otwórz źródło ↗
                              </button>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </article>
              ))}
              {executing ? (
                <article className="chat-message chat-message-assistant chat-thinking">
                  <div className="chat-message-role">Lex Machina</div>
                  <div className="chat-message-content">
                    Analizuję i dobieram skille…
                  </div>
                </article>
              ) : null}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-composer">
              {dropActive ? (
                <div className="chat-drop-overlay">
                  Upuść pliki, aby dodać je do sprawy
                </div>
              ) : null}
              <div className="chat-composer-meta">
                <span>
                  Auto skille: {automaticSkills ? "włączone" : "wyłączone"}
                </span>
                <span>
                  DR: {currentPrimaryRoute
                    ? labelForSkill(currentPrimaryRoute)
                    : "—"}
                </span>
                <span>Załączniki: {documentAttachments.length}</span>
              </div>
              <textarea
                value={query}
                maxLength={20_000}
                placeholder="Napisz wiadomość, opisz stan faktyczny lub zleć analizę…"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    if (canSend) {
                      void sendMessage();
                    }
                  }
                }}
              />
              <div className="chat-composer-actions">
                <button
                  type="button"
                  className="chat-secondary-action"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📎 Pliki
                </button>
                <button
                  type="button"
                  className="chat-secondary-action"
                  onClick={() => setActiveTab("skills")}
                >
                  ⚙ Skille
                  {manualSkills.length > 0
                    ? ` (${manualSkills.length})`
                    : ""}
                </button>
                <span className="chat-composer-spacer" />
                <button
                  type="button"
                  className="chat-primary-action"
                  disabled={!canSend}
                  onClick={() => void sendMessage()}
                >
                  {executing ? "Wysyłanie…" : "Wyślij"}
                </button>
              </div>
              {executionError ? (
                <p className="chat-inline-error">{executionError}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeTab === "files" ? (
          <section className="chat-card-stack">
            <article
              className="chat-card chat-file-drop-card"
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              onDrop={handleDrop}
            >
              <div>
                <p className="eyebrow">Dodawanie plików</p>
                <h2>Kliknij lub przeciągnij</h2>
                <p>
                  Przycisk otwiera systemowy eksplorator plików. Przeciągnięte
                  pliki trafiają do tej samej lokalnej kolejki prywatności.
                </p>
              </div>
              <button
                type="button"
                className="chat-primary-action"
                onClick={() => fileInputRef.current?.click()}
              >
                Otwórz eksplorator
              </button>
            </article>

            {documentDropQueue.total > 0 ? (
              <article className="chat-card">
                <div className="chat-card-heading">
                  <div>
                    <p className="eyebrow">Kolejka</p>
                    <h2>
                      {documentDropQueue.completed}/{documentDropQueue.total}
                      {" "}przetworzono
                    </h2>
                  </div>
                  <span>limit {MAX_DOCUMENT_DROP_QUEUE}</span>
                </div>
                {documentDropQueue.rejected > 0 ? (
                  <p className="chat-inline-error">
                    Pominięto {documentDropQueue.rejected} plików.
                  </p>
                ) : null}
                <ul className="chat-file-list">
                  {documentDropQueue.files
                    .slice(0, 12)
                    .map((file, index) => (
                      <li
                        key={`${file.name}-${file.lastModified}-${index}`}
                      >
                        <strong>{file.name}</strong>
                        <small>
                          {index === 0 ? "Przetwarzanie" : "Oczekuje"}
                          {" · "}{describeDocumentFile(file)}
                        </small>
                      </li>
                    ))}
                </ul>
              </article>
            ) : null}

            <DocumentPrivacyPanel
              caseId={caseId}
              incomingFile={documentDropQueue.files[0] ?? null}
              onIncomingFileConsumed={() =>
                setDocumentDropQueue((current) =>
                  consumeDocumentDropFile(current)
                )
              }
              onCaseFilesChange={() =>
                setWorkspaceRefresh((value) => value + 1)
              }
              onAttachmentSelectionChange={(selection) => {
                if (!selection) return;
                setDocumentAttachments((current) =>
                  upsertAttachment(current, selection)
                );
              }}
            />

            <CaseWorkspacePanel
              caseId={caseId}
              isAdmin={user.appRole === "ADMIN"}
              refreshToken={workspaceRefresh}
            />
          </section>
        ) : null}

        {activeTab === "skills" ? (
          <section className="chat-card-stack">
            <article className="chat-card">
              <div className="chat-card-heading">
                <div>
                  <p className="eyebrow">Routing</p>
                  <h2>Automatyczny dobór skilli</h2>
                  <p>
                    System dobiera moduły do treści każdej wiadomości.
                    Ręczny wybór jest dodatkiem do obowiązkowego rdzenia.
                  </p>
                </div>
                <label className="chat-switch">
                  <input
                    type="checkbox"
                    checked={automaticSkills}
                    onChange={(event) =>
                      setAutomaticSkills(event.target.checked)
                    }
                  />
                  <span>Auto</span>
                </label>
              </div>
              <div className="chat-mandatory-grid">
                <div>
                  <strong>✓ prawny-router-v3</strong>
                  <small>obowiązkowy · nie można odznaczyć</small>
                </div>
                <div>
                  <strong>✓ shared</strong>
                  <small>obowiązkowy · nie można odznaczyć</small>
                </div>
              </div>
            </article>

            <article className="chat-card">
              <div className="chat-card-heading">
                <div>
                  <p className="eyebrow">Ręczny wybór</p>
                  <h2>Dodatkowe skille</h2>
                </div>
                <input
                  className="chat-search"
                  value={skillFilter}
                  placeholder="Filtruj skille…"
                  onChange={(event) => setSkillFilter(event.target.value)}
                />
              </div>
              <div className="chat-skill-grid">
                {filteredSkills.map((skill) => {
                  const checked = manualSkills.includes(skill.name);
                  return (
                    <label
                      key={skill.name}
                      className={
                        checked
                          ? "chat-skill-card selected"
                          : "chat-skill-card"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleManualSkill(skill.name)}
                      />
                      <span>
                        <strong>{labelForSkill(skill.name)}</strong>
                        <small>
                          {skill.description ||
                            skill.type ||
                            "skill wykonawczy"}
                        </small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "case" ? (
          <section className="chat-card-stack">
            <article className="chat-card">
              <p className="eyebrow">Sprawa</p>
              <h2>Wybierz albo utwórz sprawę</h2>
              <div className="chat-form-row">
                <select
                  value={caseId}
                  onChange={(event) => setCaseId(event.target.value)}
                >
                  <option value="">— wybierz sprawę —</option>
                  {matterCases.map((item) => (
                    <option key={item.caseId} value={item.caseId}>
                      {item.displayName || item.caseId} · {item.role}
                      {item.archivedAt ? " · ARCHIWALNA" : ""}
                    </option>
                  ))}
                </select>
                <input
                  value={newCaseName}
                  maxLength={160}
                  placeholder="Nazwa nowej sprawy"
                  onChange={(event) => setNewCaseName(event.target.value)}
                />
                <button
                  type="button"
                  className="chat-primary-action"
                  disabled={caseBusy}
                  onClick={() => void createLocalCase(newCaseName)}
                >
                  {caseBusy ? "Tworzę…" : "Utwórz"}
                </button>
              </div>
            </article>

            <article className="chat-card">
              <p className="eyebrow">Wiedza w sesji</p>
              <div className="chat-check-row">
                <label>
                  <input
                    type="checkbox"
                    checked={includeCaseKnowledge}
                    disabled={
                      !selectedCase ||
                      Boolean(selectedCase.archivedAt) ||
                      selectedCase.role === "VIEWER"
                    }
                    onChange={(event) =>
                      setIncludeCaseKnowledge(event.target.checked)
                    }
                  />
                  Przeszukuj dokumenty bieżącej sprawy
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={includeFirmKnowledge}
                    disabled={
                      !firmKnowledgeWorkspace ||
                      firmKnowledgeWorkspace.role === "VIEWER"
                    }
                    onChange={(event) =>
                      setIncludeFirmKnowledge(event.target.checked)
                    }
                  />
                  Przeszukuj know-how kancelarii
                </label>
              </div>
            </article>

            <CaseCollaborationPanel
              caseId={caseId}
              caseRole={selectedCase?.role}
            />
            <FirmKnowledgePanel
              user={user}
              currentCase={selectedCase}
              onUseHit={(selection) =>
                setDocumentAttachments((current) =>
                  upsertAttachment(current, selection)
                )
              }
              onWorkspaceChange={setFirmKnowledgeWorkspace}
            />
          </section>
        ) : null}

        {activeTab === "settings" ? (
          <section className="chat-settings-grid">
            <article className="chat-card">
              <p className="eyebrow">Dostawca</p>
              <h2>Model</h2>
              <label>
                Provider
                <select
                  value={provider}
                  onChange={(event) => {
                    setProvider(event.target.value as ProviderId);
                    setProviderApiKeyInput("");
                    setProviderKeyMessage("");
                  }}
                >
                  {PROVIDERS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                      {" · "}
                      {providerConfiguration[item.id] === true
                        ? "API gotowe"
                        : providerConfiguration[item.id] === false
                          ? "brak klucza"
                          : "sprawdzanie"}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Model
                <select
                  value={model}
                  disabled={models.length === 0}
                  onChange={(event) => setModel(event.target.value)}
                >
                  {models.length === 0 ? (
                    <option value="">Brak dostępnych modeli</option>
                  ) : null}
                  {models.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={!item.selectable}
                    >
                      {item.displayName}
                      {!item.selectable ? " · nieobsługiwany" : ""}
                    </option>
                  ))}
                </select>
              </label>
              {modelError ? (
                <p className="chat-inline-error">
                  {modelError === "PROVIDER_NOT_CONFIGURED"
                    ? "Najpierw dodaj klucz API dla tego dostawcy."
                    : modelError}
                </p>
              ) : null}
              {selectedModel?.contextWindow ? (
                <small>
                  Kontekst: {selectedModel.contextWindow.toLocaleString("pl-PL")}
                  {" "}tokenów
                </small>
              ) : null}
              {providerDefinition ? (
                <button
                  type="button"
                  className="chat-link-action"
                  onClick={() =>
                    void openExternalUrl(providerDefinition.apiKeyUrl)
                  }
                >
                  {model
                    ? `Klucz API dla ${providerDefinition.label} ↗`
                    : `Utwórz / pobierz klucz ${providerDefinition.label} ↗`}
                </button>
              ) : null}
            </article>

            <article className="chat-card">
              <p className="eyebrow">Klucz API</p>
              <h2>Konfiguracja lokalna</h2>
              {user.appRole === "ADMIN" ? (
                <>
                  <input
                    type="password"
                    autoComplete="off"
                    value={providerApiKey}
                    placeholder="Wklej klucz API"
                    onChange={(event) =>
                      setProviderApiKeyInput(event.target.value)
                    }
                  />
                  <div className="chat-form-row compact">
                    <button
                      type="button"
                      className="chat-primary-action"
                      disabled={
                        providerKeyBusy ||
                        !providerApiKey.trim()
                      }
                      onClick={() => void saveApiKey()}
                    >
                      {isDesktopShell()
                        ? "Zapisz w systemie"
                        : "Użyj w sesji"}
                    </button>
                    <button
                      type="button"
                      className="chat-secondary-action"
                      disabled={providerKeyBusy}
                      onClick={() => void removeApiKey()}
                    >
                      Usuń klucz
                    </button>
                  </div>
                  {providerKeyMessage ? (
                    <small>{providerKeyMessage}</small>
                  ) : null}
                </>
              ) : (
                <p>Klucz API może zmieniać administrator aplikacji.</p>
              )}
            </article>
          </section>
        ) : null}
      </main>
    </div>
  );
}
