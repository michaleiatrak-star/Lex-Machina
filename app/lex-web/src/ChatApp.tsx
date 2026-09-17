import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent
} from "react";
import { CaseWorkspacePanel } from "./CaseWorkspacePanel.js";
import { CaseCollaborationPanel } from "./CaseCollaborationPanel.js";
import { DocumentAuthoringPanel } from "./DocumentAuthoringPanel.js";
import { DocumentPrivacyPanel } from "./DocumentPrivacyPanel.js";
import { FirmKnowledgePanel } from "./FirmKnowledgePanel.js";
import {
  DOCUMENT_FILE_ACCEPT,
  MAX_DOCUMENT_DROP_QUEUE,
  consumeDocumentDropFile,
  createDocumentDropQueueState,
  describeDocumentFile,
  enqueueDocumentDropFiles
} from "./document-drop-queue.js";
import {
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
  validateRoute,
  type AuthenticatedUser,
  type CaseListItem,
  type DocumentAttachmentSelection,
  type ModelDescriptor,
  type ProviderId,
  type SessionExecutionResponse
} from "./api.js";
import {
  MANDATORY_SKILLS,
  OPTIONAL_EXECUTION_SKILLS,
  chooseAutomaticExtraSkills,
  choosePrimaryRoute,
  encodeExtraSkills,
  labelForSkill
} from "./skill-routing.js";
import "./chat.css";

type WorkspaceTab =
  | "chat"
  | "files"
  | "skills"
  | "case"
  | "settings";

type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
  route?: string;
  skills?: string[];
  blocked?: boolean;
  evidence?: number;
};

const PROVIDERS: Array<{
  id: ProviderId;
  label: string;
}> = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic / Claude" },
  { id: "xai", label: "xAI / Grok" }
];

const TABS: Array<{
  id: WorkspaceTab;
  label: string;
  hint: string;
}> = [
  { id: "chat", label: "Czat", hint: "rozmowa i analiza" },
  { id: "files", label: "Pliki", hint: "dodawanie i prywatność" },
  { id: "skills", label: "Skille", hint: "routing automatyczny / ręczny" },
  { id: "case", label: "Sprawa", hint: "akta i wiedza" },
  { id: "settings", label: "Ustawienia", hint: "model i API" }
];

function uniqueSelections(
  current: DocumentAttachmentSelection[],
  incoming: DocumentAttachmentSelection
): DocumentAttachmentSelection[] {
  const index = current.findIndex(
    (item) =>
      item.caseId === incoming.caseId &&
      item.documentId === incoming.documentId
  );
  if (index < 0) {
    return current.length >= 4
      ? current
      : [...current, incoming];
  }
  return current.map((item, itemIndex) =>
    itemIndex === index
      ? {
          ...item,
          chunkIndices: [
            ...new Set([
              ...item.chunkIndices,
              ...incoming.chunkIndices
            ])
          ]
            .sort((left, right) => left - right)
            .slice(0, 32)
        }
      : item
  );
}

function chatId(): string {
  return `msg_${Date.now()}_${Math.random()
    .toString(16)
    .slice(2)}`;
}

function executionText(
  execution: SessionExecutionResponse
): string {
  if (
    execution.status === "DRAFT_PRESENTABLE" &&
    execution.answer
  ) {
    return execution.answer;
  }
  const blocked =
    execution.blockedReferences
      .slice(0, 6)
      .map((item) => item.claim)
      .filter(Boolean);
  return blocked.length > 0
    ? `HARD GATE zatrzymał odpowiedź, ponieważ część powołań nie przeszła weryfikacji. Wymagają sprawdzenia: ${blocked.join("; ")}`
    : "HARD GATE zatrzymał odpowiedź przed prezentacją. Weryfikacja źródeł nie została zakończona z wynikiem pozwalającym pokazać treść.";
}

export default function ChatApp({
  user
}: {
  user: AuthenticatedUser;
}) {
  const [activeTab, setActiveTab] =
    useState<WorkspaceTab>("chat");
  const [runtimeOnline, setRuntimeOnline] =
    useState(false);
  const [runtimeError, setRuntimeError] =
    useState("");

  const [cases, setCases] =
    useState<CaseListItem[]>([]);
  const [caseId, setCaseId] =
    useState("");
  const [newCaseName, setNewCaseName] =
    useState("");
  const [caseBusy, setCaseBusy] =
    useState(false);
  const [caseError, setCaseError] =
    useState("");

  const [provider, setProvider] =
    useState<ProviderId>("openai");
  const [providerConfiguration, setProviderConfiguration] =
    useState<Record<ProviderId, boolean | undefined>>({
      openai: undefined,
      anthropic: undefined,
      xai: undefined
    });
  const [providerApiKey, setProviderApiKeyInput] =
    useState("");
  const [providerKeyMessage, setProviderKeyMessage] =
    useState("");
  const [providerKeyBusy, setProviderKeyBusy] =
    useState(false);

  const [models, setModels] =
    useState<ModelDescriptor[]>([]);
  const [model, setModel] =
    useState("");
  const [modelError, setModelError] =
    useState("");

  const [routes, setRoutes] =
    useState<string[]>([]);
  const [autoSkills, setAutoSkills] =
    useState(true);
  const [manualRoute, setManualRoute] =
    useState("");
  const [manualSkills, setManualSkills] =
    useState<string[]>([]);
  const [activeRoute, setActiveRoute] =
    useState("");
  const [lastRouteValid, setLastRouteValid] =
    useState(false);
  const [lastQuery, setLastQuery] =
    useState("");

  const [composer, setComposer] =
    useState("");
  const [executing, setExecuting] =
    useState(false);
  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: "welcome",
        role: "assistant",
        text:
          "Opisz sprawę tak, jak w zwykłej rozmowie. Dobiorę dziedzinę prawa i potrzebne skille. Prawny router oraz warstwa shared są zawsze aktywne i nie można ich wyłączyć."
      }
    ]);

  const [documentAttachments, setDocumentAttachments] =
    useState<DocumentAttachmentSelection[]>([]);
  const [workspaceRefresh, setWorkspaceRefresh] =
    useState(0);
  const [documentDropQueue, setDocumentDropQueue] =
    useState(createDocumentDropQueueState);
  const [dropActive, setDropActive] =
    useState(false);
  const dragDepth = useRef(0);
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [includeCaseKnowledge, setIncludeCaseKnowledge] =
    useState(false);
  const [includeFirmKnowledge, setIncludeFirmKnowledge] =
    useState(false);
  const [firmKnowledgeWorkspace, setFirmKnowledgeWorkspace] =
    useState<CaseListItem | null>(null);

  const matterCases = useMemo(
    () =>
      cases.filter(
        (item) => item.caseKind !== "FIRM_KNOWLEDGE"
      ),
    [cases]
  );
  const selectedCase = useMemo(
    () =>
      cases.find((item) => item.caseId === caseId),
    [cases, caseId]
  );
  const providerConfigured =
    providerConfiguration[provider] === true;
  const selectedModel = useMemo(
    () => models.find((item) => item.id === model),
    [models, model]
  );

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
        setManualRoute(routeList.primarySkills[0] ?? "");
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
          error instanceof Error
            ? error.message
            : String(error)
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setModels([]);
    setModel("");
    setModelError("");

    if (providerConfiguration[provider] !== true) {
      if (providerConfiguration[provider] === false) {
        setModelError("PROVIDER_NOT_CONFIGURED");
      }
      return () => {
        cancelled = true;
      };
    }

    void getModels(provider)
      .then((response) => {
        if (cancelled) return;
        const selectable = response.models.filter(
          (item) => item.selectable
        );
        setModels(response.models);
        setModel(selectable[0]?.id ?? "");
      })
      .catch((error) => {
        if (cancelled) return;
        setModelError(
          error instanceof Error
            ? error.message
            : String(error)
        );
      });

    return () => {
      cancelled = true;
    };
  }, [provider, providerConfiguration[provider]]);

  useEffect(() => {
    setDocumentDropQueue(createDocumentDropQueueState());
    setDocumentAttachments([]);
    setDropActive(false);
    dragDepth.current = 0;
  }, [caseId]);

  async function refreshCases(
    preferredCaseId?: string
  ): Promise<void> {
    const result = await listCases();
    setCases(result.cases);
    const matters = result.cases.filter(
      (item) => item.caseKind !== "FIRM_KNOWLEDGE"
    );
    const preferred = preferredCaseId
      ? matters.find((item) => item.caseId === preferredCaseId)
      : undefined;
    setCaseId(
      preferred?.caseId ??
        matters.find((item) => !item.archivedAt)?.caseId ??
        matters[0]?.caseId ??
        ""
    );
  }

  async function createLocalCase(): Promise<void> {
    if (caseBusy) return;
    setCaseBusy(true);
    setCaseError("");
    try {
      const created = await createCase(
        newCaseName.trim() || undefined
      );
      await refreshCases(created.caseId);
      setNewCaseName("");
      setActiveTab("chat");
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

  function addAttachment(
    selection: DocumentAttachmentSelection
  ): void {
    setDocumentAttachments((current) =>
      uniqueSelections(current, selection)
    );
  }

  function enqueueFiles(
    files: FileList | readonly File[]
  ): void {
    if (!caseId || selectedCase?.archivedAt) {
      setCaseError(
        !caseId
          ? "Najpierw wybierz lub utwórz sprawę."
          : "Zarchiwizowana sprawa jest tylko do odczytu."
      );
      return;
    }
    const incoming = Array.from(files);
    if (incoming.length === 0) return;
    setCaseError("");
    setDocumentDropQueue((current) =>
      enqueueDocumentDropFiles(current, incoming)
    );
    setActiveTab("files");
  }

  function handleDragEnter(
    event: DragEvent<HTMLElement>
  ): void {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current += 1;
    setDropActive(true);
  }

  function handleDragOver(
    event: DragEvent<HTMLElement>
  ): void {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setDropActive(true);
  }

  function handleDragLeave(
    event: DragEvent<HTMLElement>
  ): void {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setDropActive(false);
    }
  }

  function handleDrop(
    event: DragEvent<HTMLElement>
  ): void {
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setDropActive(false);
    if (event.dataTransfer.files.length > 0) {
      enqueueFiles(event.dataTransfer.files);
    }
  }

  async function sendMessage(): Promise<void> {
    const plainQuery = composer.trim();
    if (
      executing ||
      !plainQuery ||
      !runtimeOnline ||
      !providerConfigured ||
      !model ||
      selectedCase?.archivedAt
    ) {
      return;
    }

    const primaryRoute = autoSkills
      ? choosePrimaryRoute(plainQuery, routes)
      : manualRoute;
    if (!primaryRoute) {
      setMessages((current) => [
        ...current,
        {
          id: chatId(),
          role: "system",
          text: "Nie znaleziono dostępnego modułu DR. Sprawdź instalację korpusu skilli."
        }
      ]);
      return;
    }

    const automaticExtras = autoSkills
      ? chooseAutomaticExtraSkills(plainQuery)
      : [];
    const extras = [
      ...new Set([
        ...automaticExtras,
        ...manualSkills
      ])
    ].slice(0, 8);
    const displayedSkills = [
      ...MANDATORY_SKILLS,
      "prawo-polskie-v2",
      primaryRoute,
      ...extras
    ];

    setMessages((current) => [
      ...current,
      {
        id: chatId(),
        role: "user",
        text: plainQuery,
        route: primaryRoute,
        skills: displayedSkills
      }
    ]);
    setComposer("");
    setExecuting(true);
    setLastQuery(plainQuery);
    setActiveRoute(primaryRoute);
    setLastRouteValid(false);

    try {
      const routeResult = await validateRoute(primaryRoute);
      if (!routeResult.valid) {
        throw new Error(
          routeResult.reason || "INVALID_ROUTE"
        );
      }
      setLastRouteValid(true);

      const execution = await executeSession({
        query: encodeExtraSkills(plainQuery, extras),
        provider,
        model,
        primarySkill: primaryRoute,
        mode: "PRAWNIK",
        ...(documentAttachments.length > 0
          ? { attachments: documentAttachments }
          : {}),
        ...(includeCaseKnowledge || includeFirmKnowledge
          ? {
              knowledge: {
                ...(includeCaseKnowledge && selectedCase
                  ? {
                      caseId: selectedCase.caseId,
                      includeCase: true
                    }
                  : { includeCase: false }),
                includeFirm: includeFirmKnowledge,
                limit: 8
              }
            }
          : {})
      });

      setMessages((current) => [
        ...current,
        {
          id: chatId(),
          role: "assistant",
          text: executionText(execution),
          route: primaryRoute,
          skills: displayedSkills,
          blocked: execution.status === "BLOCKED",
          evidence: execution.verification.records
        }
      ]);
    } catch (error) {
      setLastRouteValid(false);
      const message =
        error instanceof Error
          ? error.message
          : String(error);
      setMessages((current) => [
        ...current,
        {
          id: chatId(),
          role: "system",
          text:
            message === "PROVIDER_NOT_CONFIGURED"
              ? "Brak lokalnego klucza API dla wybranego dostawcy. Otwórz kartę Ustawienia."
              : `Nie udało się wykonać analizy: ${message}`
        }
      ]);
    } finally {
      setExecuting(false);
    }
  }

  function composerKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ): void {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void sendMessage();
    }
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
      const status = await getProviderStatus();
      setProviderConfiguration(
        Object.fromEntries(
          status.providers.map((item) => [
            item.provider,
            item.configured
          ])
        ) as Record<ProviderId, boolean>
      );
      setProviderApiKeyInput("");
      setProviderKeyMessage("Klucz API jest aktywny.");
    } catch (error) {
      setProviderKeyMessage(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setProviderKeyBusy(false);
    }
  }

  async function removeApiKey(): Promise<void> {
    if (user.appRole !== "ADMIN") return;
    setProviderKeyBusy(true);
    setProviderKeyMessage("");
    try {
      await clearProviderApiKey(provider);
      const status = await getProviderStatus();
      setProviderConfiguration(
        Object.fromEntries(
          status.providers.map((item) => [
            item.provider,
            item.configured
          ])
        ) as Record<ProviderId, boolean>
      );
      setProviderKeyMessage("Klucz API został usunięty.");
    } catch (error) {
      setProviderKeyMessage(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setProviderKeyBusy(false);
    }
  }

  const canSend =
    runtimeOnline &&
    providerConfigured &&
    Boolean(model) &&
    Boolean(composer.trim()) &&
    !executing &&
    !selectedCase?.archivedAt;

  return (
    <div
      className={`chat-app-shell${dropActive ? " chat-app-dropping" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        className="chat-file-input"
        type="file"
        multiple
        accept={DOCUMENT_FILE_ACCEPT}
        onChange={(event) => {
          if (event.currentTarget.files) {
            enqueueFiles(event.currentTarget.files);
          }
          event.currentTarget.value = "";
        }}
      />

      <aside className="chat-sidebar">
        <div className="chat-brand">
          <div className="brand-mark">LM</div>
          <div>
            <strong>Lex Machina</strong>
            <span>legal AI · lokalnie</span>
          </div>
        </div>

        <div className="chat-runtime-card">
          <span
            className={
              runtimeOnline
                ? "status-dot status-online"
                : "status-dot status-offline"
            }
          />
          <div>
            <strong>
              {runtimeOnline
                ? "Runtime aktywny"
                : "Runtime offline"}
            </strong>
            <span>
              {selectedCase?.displayName ||
                (caseId
                  ? `${caseId.slice(0, 14)}…`
                  : "Brak wybranej sprawy")}
            </span>
          </div>
        </div>

        <nav className="workspace-tabs" aria-label="Obszary robocze">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                activeTab === tab.id
                  ? "workspace-tab workspace-tab-active"
                  : "workspace-tab"
              }
              onClick={() => setActiveTab(tab.id)}
            >
              <strong>{tab.label}</strong>
              <span>{tab.hint}</span>
              {tab.id === "files" &&
                documentDropQueue.total > 0 && (
                  <em>{documentDropQueue.total}</em>
                )}
            </button>
          ))}
        </nav>

        <div className="mandatory-safety-card">
          <strong>Zawsze aktywne</strong>
          <span>✓ Prawny router v3</span>
          <span>✓ Shared / HARD GATE</span>
          <small>
            Tych warstw użytkownik nie może odznaczyć.
          </small>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-topbar">
          <div>
            <p className="eyebrow">Sprawa</p>
            <select
              aria-label="Bieżąca sprawa"
              value={caseId}
              onChange={(event) => {
                setCaseId(event.target.value);
                setCaseError("");
              }}
            >
              <option value="">— wybierz sprawę —</option>
              {matterCases.map((item) => (
                <option key={item.caseId} value={item.caseId}>
                  {item.displayName || item.caseId.slice(0, 18)}
                  {item.archivedAt ? " · ARCHIWALNA" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="chat-topbar-actions">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!caseId || Boolean(selectedCase?.archivedAt)}
            >
              + Dodaj pliki
            </button>
            <span className="security-pill">LOCAL-FIRST</span>
          </div>
        </header>

        {runtimeError && (
          <div className="alert alert-error">
            Backend lokalny jest niedostępny: {runtimeError}
          </div>
        )}
        {caseError && (
          <div className="alert alert-error">{caseError}</div>
        )}

        <section
          className="workspace-panel chat-panel"
          hidden={activeTab !== "chat"}
          aria-label="Czat prawny"
        >
          <div className="chat-thread">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chat-message chat-message-${message.role}${message.blocked ? " chat-message-blocked" : ""}`}
              >
                <div className="chat-message-role">
                  {message.role === "user"
                    ? "Ty"
                    : message.role === "assistant"
                      ? "Lex Machina"
                      : "System"}
                </div>
                <div className="chat-message-text">{message.text}</div>
                {message.skills && (
                  <div className="chat-skill-strip">
                    {message.skills.map((skill) => (
                      <span key={skill}>{labelForSkill(skill)}</span>
                    ))}
                  </div>
                )}
                {(message.route || message.evidence !== undefined) && (
                  <footer>
                    {message.route && (
                      <span>Routing: {labelForSkill(message.route)}</span>
                    )}
                    {message.evidence !== undefined && (
                      <span>Evidence: {message.evidence}</span>
                    )}
                  </footer>
                )}
              </article>
            ))}
            {executing && (
              <article className="chat-message chat-message-assistant chat-thinking">
                <div className="chat-message-role">Lex Machina</div>
                <div className="chat-thinking-row">
                  <span />
                  <span />
                  <span />
                  Dobieram skille, sprawdzam źródła i przygotowuję odpowiedź…
                </div>
              </article>
            )}
          </div>

          <div
            className={`chat-composer${dropActive ? " chat-composer-drop" : ""}`}
          >
            {documentAttachments.length > 0 && (
              <div className="composer-attachments">
                {documentAttachments.map((attachment) => (
                  <button
                    key={`${attachment.caseId}-${attachment.documentId}`}
                    type="button"
                    title="Usuń załącznik z następnej analizy"
                    onClick={() =>
                      setDocumentAttachments((current) =>
                        current.filter(
                          (item) =>
                            item.caseId !== attachment.caseId ||
                            item.documentId !== attachment.documentId
                        )
                      )
                    }
                  >
                    📎 {attachment.documentId.slice(0, 14)}… ×
                  </button>
                ))}
              </div>
            )}
            <textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              onKeyDown={composerKeyDown}
              maxLength={30000}
              placeholder={
                caseId
                  ? "Napisz pytanie lub opisz zadanie prawne…"
                  : "Najpierw wybierz albo utwórz sprawę…"
              }
              disabled={!caseId || Boolean(selectedCase?.archivedAt)}
            />
            <div className="chat-composer-actions">
              <div>
                <button
                  type="button"
                  className="chat-attach-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!caseId || Boolean(selectedCase?.archivedAt)}
                >
                  📎 Dodaj pliki
                </button>
                <span>
                  lub przeciągnij pliki w dowolne miejsce okna
                </span>
              </div>
              <button
                type="button"
                className="primary-button chat-send-button"
                disabled={!canSend}
                onClick={() => void sendMessage()}
              >
                {executing ? "Pracuję…" : "Wyślij"}
              </button>
            </div>
          </div>
        </section>

        <section
          className="workspace-panel"
          hidden={activeTab !== "files"}
          aria-label="Pliki sprawy"
        >
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Pliki</p>
              <h2>Dodaj dokumenty do sprawy</h2>
              <p>
                Przycisk otwiera systemowy wybór plików. Możesz też przeciągać wiele plików na całe okno aplikacji.
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!caseId || Boolean(selectedCase?.archivedAt)}
            >
              + Wybierz pliki z dysku
            </button>
          </div>

          <div
            className={`file-drop-card${dropActive ? " file-drop-card-active" : ""}`}
            onClick={() => {
              if (caseId && !selectedCase?.archivedAt) {
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <strong>Upuść tutaj pliki</strong>
            <span>
              PDF, DOCX, ODT, XLSX/XLSM, obrazy, TXT/MD/CSV/TSV i ZIP · maksymalnie {MAX_DOCUMENT_DROP_QUEUE} plików w kolejce
            </span>
          </div>

          {documentDropQueue.total > 0 && (
            <div className="file-queue-card" aria-live="polite">
              <div>
                <strong>
                  {documentDropQueue.files.length > 0
                    ? `Przetwarzanie ${Math.min(
                        documentDropQueue.completed + 1,
                        documentDropQueue.total
                      )}/${documentDropQueue.total}`
                    : `Przetworzono ${documentDropQueue.completed}/${documentDropQueue.total}`}
                </strong>
                {documentDropQueue.rejected > 0 && (
                  <span>
                    Pominięto: {documentDropQueue.rejected}
                  </span>
                )}
              </div>
              <ul>
                {documentDropQueue.files.slice(0, 12).map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                  >
                    <span>{index === 0 ? "Przetwarzanie" : "Oczekuje"}</span>
                    <strong>{file.name}</strong>
                    <small>{describeDocumentFile(file)}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedCase?.archivedAt ? (
            <div className="alert">
              Sprawa jest zarchiwizowana. Dodawanie plików jest zablokowane do czasu przywrócenia sprawy.
            </div>
          ) : (
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
                if (selection) addAttachment(selection);
              }}
            />
          )}

          <div className="selected-files-card">
            <strong>Dokumenty używane w następnej odpowiedzi</strong>
            {documentAttachments.length === 0 ? (
              <span>Brak zaznaczonych chunków dokumentów.</span>
            ) : (
              <ul>
                {documentAttachments.map((item) => (
                  <li key={`${item.caseId}-${item.documentId}`}>
                    <span>{item.documentId}</span>
                    <small>{item.chunkIndices.length} chunków</small>
                    <button
                      type="button"
                      onClick={() =>
                        setDocumentAttachments((current) =>
                          current.filter(
                            (candidate) =>
                              candidate.caseId !== item.caseId ||
                              candidate.documentId !== item.documentId
                          )
                        )
                      }
                    >
                      Usuń
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DocumentAuthoringPanel
            currentCase={selectedCase}
            provider={provider}
            providerConfigured={providerConfigured}
            model={model}
            primarySkill={activeRoute || manualRoute}
            routeValid={lastRouteValid}
            query={lastQuery}
            attachments={documentAttachments}
          />
        </section>

        <section
          className="workspace-panel"
          hidden={activeTab !== "skills"}
          aria-label="Skille"
        >
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Routing</p>
              <h2>Skille sesji</h2>
              <p>
                Domyślnie Lex Machina dobiera moduł DR i skille wykonawcze na podstawie pytania. Możesz przełączyć routing na ręczny i wskazać dodatkowe skille.
              </p>
            </div>
            <label className="skill-mode-toggle">
              <input
                type="checkbox"
                checked={autoSkills}
                onChange={(event) => setAutoSkills(event.target.checked)}
              />
              <span>Automatyczny dobór</span>
            </label>
          </div>

          <div className="skills-card-grid">
            <article className="skill-card skill-card-mandatory">
              <h3>Warstwy obowiązkowe</h3>
              <label>
                <input type="checkbox" checked disabled />
                <span>
                  <strong>Prawny router v3</strong>
                  <small>Pierwszy skill każdej sprawy prawnej.</small>
                </span>
              </label>
              <label>
                <input type="checkbox" checked disabled />
                <span>
                  <strong>Shared</strong>
                  <small>HARD GATE, anonimizacja i wspólne bramki weryfikacyjne.</small>
                </span>
              </label>
              <label>
                <input type="checkbox" checked disabled />
                <span>
                  <strong>Prawo polskie v2</strong>
                  <small>Mapa routingu dla polskiej jurysdykcji.</small>
                </span>
              </label>
            </article>

            <article className="skill-card">
              <h3>Dziedzina DR</h3>
              <p>
                {autoSkills
                  ? "W trybie automatycznym wybór następuje dla każdej wiadomości osobno."
                  : "W trybie ręcznym ten moduł jest używany jako główny DR."}
              </p>
              <select
                value={manualRoute}
                disabled={autoSkills || routes.length === 0}
                onChange={(event) => setManualRoute(event.target.value)}
              >
                {routes.map((item) => (
                  <option key={item} value={item}>
                    {labelForSkill(item)}
                  </option>
                ))}
              </select>
              {autoSkills && composer.trim() && (
                <div className="skill-preview">
                  Podgląd dla bieżącego tekstu: {labelForSkill(
                    choosePrimaryRoute(composer, routes)
                  )}
                </div>
              )}
            </article>
          </div>

          <article className="skill-card optional-skills-card">
            <div className="optional-skills-head">
              <div>
                <h3>Dodatkowe skille</h3>
                <p>
                  Zaznaczone ręcznie skille są dołączane niezależnie od automatycznej sugestii. Maksymalnie 8 dodatkowych skilli trafia do jednej sesji.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManualSkills([])}
                disabled={manualSkills.length === 0}
              >
                Wyczyść wybór
              </button>
            </div>
            <div className="skill-checkbox-grid">
              {OPTIONAL_EXECUTION_SKILLS.map((skill) => {
                const checked = manualSkills.includes(skill);
                const suggested =
                  autoSkills &&
                  composer.trim() &&
                  chooseAutomaticExtraSkills(composer).includes(skill);
                return (
                  <label
                    key={skill}
                    className={suggested ? "skill-option skill-option-suggested" : "skill-option"}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        setManualSkills((current) =>
                          event.target.checked
                            ? [...new Set([...current, skill])].slice(0, 8)
                            : current.filter((item) => item !== skill)
                        )
                      }
                    />
                    <span>
                      <strong>{labelForSkill(skill)}</strong>
                      {suggested && <small>automatycznie sugerowany</small>}
                    </span>
                  </label>
                );
              })}
            </div>
          </article>
        </section>

        <section
          className="workspace-panel"
          hidden={activeTab !== "case"}
          aria-label="Sprawa i wiedza"
        >
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Sprawa</p>
              <h2>Akta i wiedza</h2>
              <p>
                Wybierz istniejącą sprawę lub utwórz nową. Dokumenty i wiedza pozostają powiązane z ACL sprawy.
              </p>
            </div>
          </div>

          <div className="case-create-card">
            <label>
              Nowa sprawa
              <input
                value={newCaseName}
                maxLength={160}
                placeholder="Nazwa sprawy"
                onChange={(event) => setNewCaseName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void createLocalCase();
                }}
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

          <CaseWorkspacePanel
            caseId={caseId}
            isAdmin={user.appRole === "ADMIN"}
            refreshToken={workspaceRefresh}
          />
          <CaseCollaborationPanel
            caseId={caseId}
            caseRole={selectedCase?.role}
          />
          <FirmKnowledgePanel
            user={user}
            currentCase={selectedCase}
            onUseHit={addAttachment}
            onWorkspaceChange={setFirmKnowledgeWorkspace}
          />
        </section>

        <section
          className="workspace-panel"
          hidden={activeTab !== "settings"}
          aria-label="Ustawienia modelu"
        >
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Ustawienia</p>
              <h2>Model i źródła kontekstu</h2>
            </div>
          </div>

          <div className="settings-card-grid">
            <article className="settings-card">
              <label>
                Dostawca
                <select
                  value={provider}
                  onChange={(event) =>
                    setProvider(event.target.value as ProviderId)
                  }
                >
                  {PROVIDERS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                      {providerConfiguration[item.id] === true
                        ? " · gotowy"
                        : " · brak klucza"}
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
                    </option>
                  ))}
                </select>
              </label>
              {modelError && (
                <p className="field-error">
                  {modelError === "PROVIDER_NOT_CONFIGURED"
                    ? "Brak lokalnego klucza API dla tego dostawcy."
                    : modelError}
                </p>
              )}
              {selectedModel?.contextWindow && (
                <p className="field-help">
                  Kontekst: {selectedModel.contextWindow.toLocaleString("pl-PL")} tokenów
                </p>
              )}
            </article>

            <article className="settings-card">
              <h3>Kontekst lokalny</h3>
              <label className="settings-check">
                <input
                  type="checkbox"
                  checked={includeCaseKnowledge}
                  disabled={!selectedCase || selectedCase.role === "VIEWER"}
                  onChange={(event) => setIncludeCaseKnowledge(event.target.checked)}
                />
                Przeszukuj wiedzę bieżącej sprawy
              </label>
              <label className="settings-check">
                <input
                  type="checkbox"
                  checked={includeFirmKnowledge}
                  disabled={!firmKnowledgeWorkspace || firmKnowledgeWorkspace.role === "VIEWER"}
                  onChange={(event) => setIncludeFirmKnowledge(event.target.checked)}
                />
                Przeszukuj know-how kancelarii
              </label>
              <p className="field-help">
                Retrieval odbywa się lokalnie; do providera trafiają wyłącznie wybrane pseudonimizowane fragmenty.
              </p>
            </article>

            {user.appRole === "ADMIN" && (
              <article className="settings-card settings-card-wide">
                <h3>Klucz API</h3>
                <label>
                  Klucz dla {provider}
                  <input
                    type="password"
                    autoComplete="off"
                    value={providerApiKey}
                    onChange={(event) => setProviderApiKeyInput(event.target.value)}
                    placeholder="Wklej klucz API"
                  />
                </label>
                <div className="settings-actions">
                  <button
                    type="button"
                    className="primary-button"
                    disabled={providerKeyBusy || !providerApiKey.trim()}
                    onClick={() => void saveApiKey()}
                  >
                    {isDesktopShell()
                      ? "Zapisz w magazynie systemowym"
                      : "Użyj w tej sesji"}
                  </button>
                  <button
                    type="button"
                    disabled={providerKeyBusy}
                    onClick={() => void removeApiKey()}
                  >
                    Usuń klucz
                  </button>
                </div>
                {providerKeyMessage && (
                  <p className="field-help">{providerKeyMessage}</p>
                )}
              </article>
            )}
          </div>
        </section>
      </main>

      {dropActive && (
        <div className="global-drop-overlay" aria-hidden="true">
          <div>
            <strong>Upuść pliki</strong>
            <span>Zostaną dodane do bieżącej sprawy i przejdą lokalny pipeline prywatności.</span>
          </div>
        </div>
      )}
    </div>
  );
}
