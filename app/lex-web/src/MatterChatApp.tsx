import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent
} from "react";
import { CaseCollaborationPanel } from "./CaseCollaborationPanel.js";
import { DocumentCitationContent } from "./DocumentCitationContent.js";
import { DocumentPrivacyPanel } from "./DocumentPrivacyPanel.js";
import { FirmKnowledgePanel } from "./FirmKnowledgePanel.js";
import { WorkspaceManager } from "./WorkspaceManager.js";
import { ProcessPleadingWorkflowPanel } from "./ProcessPleadingWorkflowPanel.js";
import {
  ApiError,
  apiBase,
  archiveCase,
  clearProviderApiKey,
  createCase,
  deleteCase,
  executeSession,
  getHealth,
  getModels,
  getModelRoutingPreferences,
  getProviderStatus,
  getRoutes,
  isDesktopShell,
  listCases,
  renameCase,
  setModelRoutingPreferences,
  setProviderApiKey,
  unarchiveCase,
  type AuthenticatedUser,
  type CaseListItem,
  type DocumentAttachmentSelection,
  type EvidenceItem,
  type ModelDescriptor,
  type ModelRoutingPreferences,
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
  AUTO_CASE_TYPE,
  DETERMINISTIC_PIPELINE_SKILLS,
  buildSkillSelectionEnvelope,
  choosePrimaryRoute,
  labelForSkill,
  setAllowedDomainSkills,
  setCaseTypeExecutionSkills,
  type PublicSkillDescriptor
} from "./chat-routing.js";
import {
  useCaseThread,
  type CaseChatMessage
} from "./case-thread.js";
import {
  canExecutePrimaryModel,
  modelsForPrimarySource,
  runtimeProviderForPrimarySource,
  shouldLoadPrimaryModelCatalog,
  type PrimaryModelSource
} from "./primary-model-policy.js";
import type {
  WorkspaceDocumentCitation
} from "./workspace-client.js";
import "./chat.css";
import "./workspace.css";

type TabId =
  | "chat"
  | "files"
  | "skills"
  | "case"
  | "firm"
  | "settings";

type ExtendedExecution = SessionExecutionResponse & {
  documentCitations?: WorkspaceDocumentCitation[];
  loadedSkills?: string[];
  executionSkills?: string[];
  domainSkills?: string[];
};

const WELCOME: CaseChatMessage = {
  id: "welcome",
  role: "system",
  content:
    "Ten wątek jest przypisany do jednej sprawy. Opisz zadanie, a Lex Machina dobierze potrzebne dziedziny prawa i współpracujące skille wykonawcze."
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

const PRIMARY_MODEL_SOURCES: Array<{
  id: PrimaryModelSource;
  label: string;
}> = [
  {
    id: "local",
    label: "Lokalne"
  },
  ...PROVIDERS.map(({ id, label }) => ({
    id,
    label
  }))
];

const MANDATORY_SKILLS = ["prawny-router-v3", "shared"] as const;
const KNOWN_EXECUTION_SKILLS = new Set([
  "analiza-sadowa-v6",
  "analizator-dowodow-v3",
  "analizator-przepisow-v2",
  "analizator-umow-v1",
  "chronologia-sprawy-v1",
  "orzeczenia-sadowe-v2",
  "pisma-procesowe-v3",
  "pisma-proste-v2",
  "przesluchanie-swiadkow-v2-min90",
  "przewodnik-prawny-v2",
  "raport-klienta-v1",
  "raport-sytuacyjny-v2"
]);

function messageId(): string {
  const random = globalThis.crypto?.randomUUID?.().replaceAll("-", "") ??
    `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`
      .replace(/[^a-f0-9]/g, "")
      .padEnd(32, "0")
      .slice(0, 32);
  return `message_${random}`;
}

function suggestedCaseName(input: string): string {
  const clean = input
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 72);
  return clean.length >= 8 ? clean : "Nowa sprawa";
}

function conversationForProvider(
  messages: CaseChatMessage[],
  next: string
): string {
  const history = messages
    .filter((item) => item.role !== "system")
    .slice(-10)
    .map((item) =>
      `${item.role === "user" ? "Użytkownik" : "Asystent"}: ${item.content}`
    )
    .join("\n\n");
  const combined = history
    ? `${history}\n\nUżytkownik: ${next}`
    : next;
  return combined.length > 32_000
    ? combined.slice(-32_000)
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

function isExecutionSkill(skill: PublicSkillDescriptor): boolean {
  return (
    skill.category === "execution" ||
    skill.type?.toLowerCase().startsWith("executive-") === true ||
    KNOWN_EXECUTION_SKILLS.has(skill.name)
  );
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
    if (!internals?.invoke) {
      throw new Error("TAURI_INVOKE_UNAVAILABLE");
    }
    await internals.invoke("open_external_url", { url });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function executionMessage(
  execution: ExtendedExecution,
  route: string
): CaseChatMessage {
  if (
    execution.status === "DRAFT_PRESENTABLE" &&
    execution.answer
  ) {
    const skillMeta = execution.executionSkills?.length
      ? ` · skille: ${execution.executionSkills.map(labelForSkill).join(", ")}`
      : "";
    const domainMeta = execution.domainSkills?.length
      ? ` · domeny: ${execution.domainSkills.map(labelForSkill).join(", ")}`
      : "";
    const contextMeta =
      execution.context?.modelContextTokens
        ? ` · runtime ${execution.context.modelContextTokens.toLocaleString("pl-PL")} tok. · dokumenty ~${execution.context.estimatedDocumentTokens.toLocaleString("pl-PL")} tok.${execution.context.omittedChunks > 0 ? ` · pominięte chunki: ${execution.context.omittedChunks}` : ""}`
        : execution.context
          ? ` · dokumenty ~${execution.context.estimatedDocumentTokens.toLocaleString("pl-PL")} tok.`
          : "";
    const citationMeta =
      execution.documentCitationFreshness
        ? ` · cytaty odświeżone: ${execution.documentCitationFreshness.checked}`
        : "";
    const workflowMeta =
      execution.processAuto
        ? ` · AUTO: ${execution.processAuto.steps.length}/${execution.processAuto.maxSteps} kroków · ${execution.processAuto.stopped}`
        : execution.processWorkflow
          ? ` · proces: ${execution.processWorkflow.stage}${execution.processWorkflow.pendingCheckpoint ? ` · czeka: ${execution.processWorkflow.pendingCheckpoint}` : ""}`
          : execution.courtWorkflow
            ? ` · analiza sądowa: ${execution.courtWorkflow.stage}${execution.courtWorkflow.nextCheckpoint ? ` · następny: ${execution.courtWorkflow.nextCheckpoint}` : ""}`
            : "";
    const modelRoutingMeta =
      execution.modelRouting?.auxiliary
        ? ` · główny: ${execution.modelRouting.primary.model} · pomocniczy: ${execution.modelRouting.auxiliary.model} [${execution.modelRouting.auxiliary.status}] · helper ${execution.modelRouting.auxiliary.latencyMs} ms${execution.modelRouting.auxiliary.deterministicVerifications > 0 ? ` · preflight verify: ${execution.modelRouting.auxiliary.deterministicVerifications}` : ""}${execution.modelRouting.auxiliary.cachedVerifierReuses > 0 ? ` · cache reuse: ${execution.modelRouting.auxiliary.cachedVerifierReuses}` : ""}`
        : ` · główny: ${execution.model}`;
    return {
      id: messageId(),
      role: "assistant",
      content: execution.answer,
      evidence: execution.evidence,
      documentCitations: execution.documentCitations,
      meta:
        `routing: ${labelForSkill(execution.primarySkill || route)}` +
        skillMeta +
        domainMeta +
        contextMeta +
        citationMeta +
        workflowMeta +
        modelRoutingMeta +
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

function canWriteCase(item: CaseListItem | undefined): boolean {
  return Boolean(
    item &&
    !item.archivedAt &&
    (item.role === "OWNER" || item.role === "EDITOR")
  );
}

export default function MatterChatApp({
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
  const [caseNameDraft, setCaseNameDraft] = useState("");
  const [caseBusy, setCaseBusy] = useState(false);
  const [caseError, setCaseError] = useState("");
  const [deletePhrase, setDeletePhrase] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [workspaceRefresh, setWorkspaceRefresh] = useState(0);

  const [provider, setProvider] =
    useState<PrimaryModelSource>("local");
  const [providerConfiguration, setProviderConfiguration] = useState<
    Record<ProviderId, boolean | undefined>
  >({ openai: undefined, anthropic: undefined, xai: undefined });
  const [providerApiKey, setProviderApiKeyInput] = useState("");
  const [providerKeyBusy, setProviderKeyBusy] = useState(false);
  const [providerKeyMessage, setProviderKeyMessage] = useState("");
  const [models, setModels] = useState<ModelDescriptor[]>([]);
  const [model, setModel] = useState("");
  const [modelError, setModelError] = useState("");
  const [modelRouting, setModelRouting] =
    useState<ModelRoutingPreferences>({
      auxiliaryEnabled: false,
      auxiliaryProvider: "openai",
      auxiliaryModel:
        "local/bielik-11b-v3-q4km"
    });
  const [auxiliaryModels, setAuxiliaryModels] =
    useState<ModelDescriptor[]>([]);
  const [modelRoutingBusy, setModelRoutingBusy] =
    useState(false);
  const [modelRoutingMessage, setModelRoutingMessage] =
    useState("");

  const [routes, setRoutes] = useState<string[]>([]);
  const [skills, setSkills] = useState<PublicSkillDescriptor[]>([]);
  const [manualSkills, setManualSkills] = useState<string[]>([]);
  const [caseTypeSkills, setCaseTypeSkills] = useState<string[]>([]);
  // null = every DR module is selected. Kept as null rather than a filled list
  // so the default sends no restriction at all and routing stays unchanged
  // until the user actually narrows it.
  const [allowedDomains, setAllowedDomains] =
    useState<string[] | null>(null);
  const [automaticSkills, setAutomaticSkills] = useState(true);
  const [skillFilter, setSkillFilter] = useState("");

  const [query, setQuery] = useState("");
  const [pendingFirstMessage, setPendingFirstMessage] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [executionError, setExecutionError] = useState("");
  const [processWorkflowVisible, setProcessWorkflowVisible] =
    useState(false);
  const [processWorkflowRefresh, setProcessWorkflowRefresh] =
    useState(0);
  const {
    messages,
    setMessages,
    loading: threadLoading,
    error: threadError
  } = useCaseThread(caseId, WELCOME);

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
    () => cases.filter((item) => item.caseKind === "MATTER"),
    [cases]
  );
  const selectedCase = useMemo(
    () => matterCases.find((item) => item.caseId === caseId),
    [matterCases, caseId]
  );
  const providerDefinition = PROVIDERS.find((item) => item.id === provider);
  const runtimeProvider =
    runtimeProviderForPrimarySource(provider);
  const providerConfigured =
    providerConfiguration[runtimeProvider];
  const selectedModel = models.find((item) => item.id === model);
  const selectedAuxiliaryModel =
    auxiliaryModels.find(
      (item) =>
        item.id ===
          modelRouting.auxiliaryModel
    );
  const executionSkills = useMemo(
    () => skills
      .filter(isExecutionSkill)
      .sort((a, b) =>
        labelForSkill(a.name).localeCompare(labelForSkill(b.name), "pl")
      ),
    [skills]
  );
  const domainSelection = allowedDomains ?? routes;
  const conversationIsNew = useMemo(
    () =>
      messages.every(
        (message) => message.role === "system"
      ),
    [messages]
  );
  const availablePipelines = useMemo(
    () =>
      DETERMINISTIC_PIPELINE_SKILLS.filter((name) =>
        skills.some((skill) => skill.name === name)
      ),
    [skills]
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
  const currentPrimaryRoute = useMemo(
    () => choosePrimaryRoute(query, routes, skills, manualSkills),
    [query, routes, skills, manualSkills]
  );

  useEffect(() => {
    setCaseTypeExecutionSkills(caseTypeSkills);
    return () => setCaseTypeExecutionSkills([]);
  }, [caseTypeSkills]);

  useEffect(() => {
    const restricted =
      allowedDomains !== null &&
      allowedDomains.length < routes.length;
    setAllowedDomainSkills(
      restricted ? allowedDomains : []
    );
    return () => setAllowedDomainSkills([]);
  }, [allowedDomains, routes.length]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      getHealth(),
      getRoutes(),
      getProviderStatus(),
      listCases(),
      getModelRoutingPreferences()
    ])
      .then(([health, routeList, providerStatus, caseList, routingPreferences]) => {
        if (cancelled) return;
        setRuntimeOnline(health.status === "ok" && health.localOnly === true);
        setRoutes(routeList.primarySkills);
        setCases(caseList.cases);
        const matters = caseList.cases.filter((item) => item.caseKind === "MATTER");
        setCaseId(
          matters.find((item) => !item.archivedAt)?.caseId ??
          matters[0]?.caseId ??
          ""
        );
        setProviderConfiguration(
          Object.fromEntries(
            providerStatus.providers.map((item) => [item.provider, item.configured])
          ) as Record<ProviderId, boolean>
        );
        setModelRouting(
          routingPreferences
        );
      })
      .catch((error) => {
        if (cancelled) return;
        setRuntimeOnline(false);
        setRuntimeError(error instanceof Error ? error.message : String(error));
      });

    void fetch(`${apiBase()}/api/skills`, {
      headers: { Accept: "application/json" }
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP_${response.status}`);
        return await response.json() as { skills?: PublicSkillDescriptor[] };
      })
      .then((payload) => {
        if (!cancelled && Array.isArray(payload.skills)) setSkills(payload.skills);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skills.length === 0 && routes.length > 0) {
      setSkills(routes.map((name) => ({ name, category: "domain" })));
    }
  }, [routes, skills.length]);

  useEffect(() => {
    let cancelled = false;
    setModels([]);
    setModel("");
    setModelError("");
    if (
      !shouldLoadPrimaryModelCatalog(
        provider,
        providerConfigured
      )
    ) {
      if (
        providerConfigured === false &&
        provider !== "local"
      ) {
        setModelError("PROVIDER_NOT_CONFIGURED");
      }
      return () => {
        cancelled = true;
      };
    }
    void getModels(runtimeProvider)
      .then((response) => {
        if (cancelled) return;
        const sourceModels =
          modelsForPrimarySource(
            provider,
            response.models
          );
        setModels(sourceModels);
        setModel(
          sourceModels.find(
            (item) => item.selectable
          )?.id ?? ""
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setModelError(error instanceof Error ? error.message : String(error));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [
    provider,
    providerConfigured,
    runtimeProvider
  ]);

  useEffect(() => {
    let cancelled = false;
    setAuxiliaryModels([]);

    const configured =
      providerConfiguration[
        modelRouting.auxiliaryProvider
      ];
    if (
      configured !== true &&
      !modelRouting.auxiliaryModel
        .startsWith("local/")
    ) {
      return () => {
        cancelled = true;
      };
    }

    void getModels(
      modelRouting.auxiliaryProvider
    )
      .then((response) => {
        if (!cancelled) {
          setAuxiliaryModels(
            response.models.filter(
              (item) =>
                item.selectable
            )
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuxiliaryModels([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    modelRouting.auxiliaryProvider,
    modelRouting.auxiliaryModel,
    providerConfiguration
  ]);

  useEffect(() => {
    setDocumentDropQueue(createDocumentDropQueueState());
    setDocumentAttachments([]);
    setIncludeCaseKnowledge(false);
    setCaseNameDraft(selectedCase?.displayName ?? "");
    setDeletePhrase("");
    setDeletePassword("");
    setProcessWorkflowVisible(false);
    setProcessWorkflowRefresh((value) => value + 1);
  }, [caseId, selectedCase?.displayName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, executing]);

  useEffect(() => {
    if (
      pendingFirstMessage &&
      caseId &&
      !threadLoading &&
      !executing
    ) {
      const pending = pendingFirstMessage;
      setPendingFirstMessage(null);
      void executeMessage(pending);
    }
  }, [pendingFirstMessage, caseId, threadLoading, executing]);

  async function refreshCases(preferredCaseId?: string): Promise<void> {
    const response = await listCases();
    setCases(response.cases);
    const matters = response.cases.filter((item) => item.caseKind === "MATTER");
    const next =
      matters.find((item) => item.caseId === preferredCaseId) ??
      matters.find((item) => !item.archivedAt) ??
      matters[0];
    setCaseId(next?.caseId ?? "");
  }

  async function createLocalCase(displayName?: string): Promise<string> {
    setCaseBusy(true);
    setCaseError("");
    try {
      const created = await createCase(displayName?.trim() || undefined);
      await refreshCases(created.caseId);
      setNewCaseName("");
      setActiveTab("chat");
      return created.caseId;
    } catch (error) {
      setCaseError(error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      setCaseBusy(false);
    }
  }

  async function acceptFiles(files: readonly File[] | FileList): Promise<void> {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;
    try {
      if (!selectedCase || selectedCase.archivedAt) {
        await createLocalCase(newCaseName.trim() || "Nowa sprawa");
      }
      setDocumentDropQueue((current) =>
        enqueueDocumentDropFiles(current, incoming)
      );
      setActiveTab("chat");
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
    ) return;
    setManualSkills((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name].slice(-16)
    );
  }

  function toggleDomainSkill(name: string): void {
    setAllowedDomains((current) => {
      const selected = current ?? routes;
      return selected.includes(name)
        ? selected.filter((item) => item !== name)
        : [...selected, name];
    });
  }

  function toggleCaseTypeSkill(name: string): void {
    setCaseTypeSkills((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name].slice(-8)
    );
  }

  async function refreshProviderStatus(): Promise<void> {
    const result = await getProviderStatus();
    setProviderConfiguration(
      Object.fromEntries(
        result.providers.map((item) => [item.provider, item.configured])
      ) as Record<ProviderId, boolean>
    );
  }

  async function saveApiKey(): Promise<void> {
    if (
      provider === "local" ||
      user.appRole !== "ADMIN" ||
      !providerApiKey.trim()
    ) return;
    setProviderKeyBusy(true);
    setProviderKeyMessage("");
    try {
      await setProviderApiKey(
        provider,
        providerApiKey,
        isDesktopShell() ? "OS_KEYRING" : "PROCESS_MEMORY"
      );
      setProviderApiKeyInput("");
      await refreshProviderStatus();
      setProviderKeyMessage(
        isDesktopShell()
          ? "Klucz zapisano w systemowym magazynie poświadczeń."
          : "Klucz jest aktywny w pamięci procesu."
      );
    } catch (error) {
      setProviderKeyMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setProviderKeyBusy(false);
    }
  }

  async function removeApiKey(): Promise<void> {
    if (
      provider === "local" ||
      user.appRole !== "ADMIN"
    ) return;
    setProviderKeyBusy(true);
    try {
      await clearProviderApiKey(provider);
      await refreshProviderStatus();
      setProviderKeyMessage("Klucz został usunięty.");
    } catch (error) {
      setProviderKeyMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setProviderKeyBusy(false);
    }
  }

  async function saveModelRouting(): Promise<void> {
    if (modelRoutingBusy) return;
    setModelRoutingBusy(true);
    setModelRoutingMessage("");
    try {
      const saved =
        await setModelRoutingPreferences(
          modelRouting
        );
      setModelRouting(saved);
      setModelRoutingMessage(
        saved.auxiliaryEnabled
          ? "Model pomocniczy aktywny. Program użyje go tylko dla dozwolonych zadań pomocniczych."
          : "Model pomocniczy wyłączony."
      );
    } catch (error) {
      setModelRoutingMessage(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setModelRoutingBusy(false);
    }
  }

  async function executeMessage(plain: string): Promise<void> {
    if (
      executing ||
      !plain.trim() ||
      !caseId ||
      selectedCase?.archivedAt ||
      !runtimeOnline ||
      !canExecutePrimaryModel(
        providerConfigured,
        model
      ) ||
      !model
    ) return;

    const route = choosePrimaryRoute(plain, routes, skills, manualSkills);
    if (!route) return;

    const userMessage: CaseChatMessage = {
      id: messageId(),
      role: "user",
      content: plain.trim()
    };
    setMessages((current) => [...current, userMessage]);
    setQuery("");
    setExecuting(true);
    setExecutionError("");

    try {
      const result = await executeSession({
        query: buildSkillSelectionEnvelope(
          conversationForProvider(messages, plain.trim()),
          automaticSkills,
          manualSkills
        ),
        provider: runtimeProvider,
        model,
        auxiliaryText:
          plain.trim(),
        primarySkill: route,
        mode: "PRAWNIK",
        ...(documentAttachments.length > 0
          ? { attachments: documentAttachments }
          : {}),
        knowledge: {
          caseId,
          includeCase: includeCaseKnowledge,
          includeFirm: includeFirmKnowledge,
          limit: 8
        }
      }) as ExtendedExecution;

      if (result.processWorkflow) {
        setProcessWorkflowVisible(true);
        setProcessWorkflowRefresh(
          (value) => value + 1
        );
      }
      setMessages((current) => [
        ...current,
        executionMessage(result, route)
      ]);
    } catch (error) {
      const code =
        error instanceof ApiError
          ? error.code
          : error instanceof Error
            ? error.message
            : String(error);
      if (
        code.startsWith(
          "PROCESS_PLEADING_"
        )
      ) {
        setProcessWorkflowVisible(true);
        setProcessWorkflowRefresh(
          (value) => value + 1
        );
      }
      const friendly =
        code === "PROVIDER_NOT_CONFIGURED"
          ? "Brak lokalnego klucza API dla wybranego dostawcy."
          : code === "CHAT_PRIVACY_GATE_FAILED"
            ? "Lokalna pseudonimizacja nie mogła się wykonać, więc zapytanie zostało zatrzymane przed wysłaniem do modelu. Sprawdź lokalny runtime prywatności w panelu Utrzymanie."
          : code === "PROVIDER_EXECUTION_FAILED"
            ? "Provider odrzucił lub przerwał wykonanie."
            : code === "DOCUMENT_ATTACHMENT_RESOLUTION_FAILED"
              ? "Nie udało się bezpiecznie dołączyć wybranych fragmentów dokumentu."
              : code === "PROCESS_PLEADING_STATE_REQUIRED"
                ? "To zadanie wymaga deterministycznego pipeline pisma procesowego. Uruchom go w panelu procesu i zaakceptuj start."
                : code === "PROCESS_PLEADING_START_ACCEPTANCE_REQUIRED"
                  ? "Pipeline pisma procesowego czeka na Twoją akceptację startu."
                  : code === "PROCESS_PLEADING_CONFIRMATION_REQUIRED"
                    ? "Pipeline czeka na potwierdzenie bieżącego checkpointu."
                    : code === "PROCESS_PLEADING_CASE_REQUIRED"
                      ? "Pismo procesowe musi być powiązane z aktywną sprawą."
                      : code === "PROCESS_PLEADING_ALREADY_FINAL"
                        ? "Pipeline tej sprawy ma już status FINAL."
                        : code.startsWith("PROCESS_PLEADING_")
                          ? `Pipeline pisma procesowego zablokował wykonanie: ${code}`
                          : code === "COURT_ANALYSIS_CASE_REQUIRED"
                            ? "Analiza sądowa musi być powiązana z aktywną sprawą."
                            : code === "COURT_ANALYSIS_ALREADY_COMPLETE"
                              ? "Deterministyczna analiza sądowa tej sprawy została już zakończona."
                              : code.startsWith("COURT_ANALYSIS_")
                                ? `Pipeline analizy sądowej zablokował wykonanie: ${code}`
                                : `Nie udało się wykonać sesji: ${code}`;
      setExecutionError(friendly);
      setMessages((current) => [
        ...current,
        { id: messageId(), role: "system", content: friendly }
      ]);
    } finally {
      setExecuting(false);
    }
  }

  async function sendMessage(): Promise<void> {
    const plain = query.trim();
    if (!plain || executing || caseBusy) return;
    if (!caseId || !selectedCase || selectedCase.archivedAt) {
      setQuery("");
      setPendingFirstMessage(plain);
      await createLocalCase(newCaseName.trim() || suggestedCaseName(plain));
      return;
    }
    await executeMessage(plain);
  }

  async function saveCaseName(): Promise<void> {
    if (!selectedCase || !caseNameDraft.trim()) return;
    setCaseBusy(true);
    setCaseError("");
    try {
      await renameCase(selectedCase.caseId, caseNameDraft.trim());
      await refreshCases(selectedCase.caseId);
    } catch (error) {
      setCaseError(error instanceof Error ? error.message : String(error));
    } finally {
      setCaseBusy(false);
    }
  }

  async function toggleArchive(): Promise<void> {
    if (!selectedCase) return;
    setCaseBusy(true);
    setCaseError("");
    try {
      if (selectedCase.archivedAt) {
        await unarchiveCase(selectedCase.caseId);
      } else {
        await archiveCase(selectedCase.caseId);
      }
      await refreshCases(selectedCase.caseId);
    } catch (error) {
      setCaseError(error instanceof Error ? error.message : String(error));
    } finally {
      setCaseBusy(false);
    }
  }

  async function permanentlyDeleteCase(): Promise<void> {
    if (
      !selectedCase ||
      deletePhrase !== "USUŃ" ||
      !deletePassword
    ) return;
    setCaseBusy(true);
    setCaseError("");
    try {
      await deleteCase(selectedCase.caseId, deletePassword);
      setDeletePhrase("");
      setDeletePassword("");
      await refreshCases();
    } catch (error) {
      setCaseError(error instanceof Error ? error.message : String(error));
    } finally {
      setCaseBusy(false);
    }
  }

  const canSend =
    runtimeOnline &&
    canExecutePrimaryModel(
      providerConfigured,
      model
    ) &&
    Boolean(model) &&
    Boolean(query.trim()) &&
    !executing &&
    !caseBusy &&
    !selectedCase?.archivedAt;

  return (
    <div className="chat-app-shell matter-chat-app">
      <aside className="chat-sidebar">
        <div className="chat-brand">
          <span className="chat-brand-mark">LM</span>
          <div>
            <strong>Lex Machina</strong>
            <small>1 wątek = 1 sprawa</small>
          </div>
        </div>

        <div className="matter-thread-list" aria-label="Wątki spraw">
          <div className="matter-thread-heading">
            <strong>Wątki / sprawy</strong>
            <button
              type="button"
              disabled={caseBusy || executing}
              onClick={() => void createLocalCase(newCaseName.trim() || "Nowa sprawa")}
            >
              +
            </button>
          </div>
          <input
            value={newCaseName}
            maxLength={160}
            placeholder="Nazwa nowej sprawy"
            onChange={(event) => setNewCaseName(event.target.value)}
          />
          <div className="matter-thread-items">
            {matterCases.map((item) => (
              <button
                key={item.caseId}
                type="button"
                disabled={executing}
                className={item.caseId === caseId ? "matter-thread active" : "matter-thread"}
                onClick={() => {
                  setCaseId(item.caseId);
                  setActiveTab("chat");
                }}
              >
                <strong>{item.displayName || "Sprawa bez nazwy"}</strong>
                <small>
                  {item.archivedAt ? "archiwalna" : item.role.toLowerCase()}
                </small>
              </button>
            ))}
          </div>
        </div>

        <nav className="chat-tabs" aria-label="Sekcje aplikacji">
          {([
            ["chat", "Czat"],
            ["files", "Akta"],
            ["skills", "Skille"],
            ["case", "Sprawa"],
            ["firm", "Kancelaria"],
            ["settings", "Model i API"]
          ] as Array<[TabId, string]>).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={activeTab === id ? "chat-tab chat-tab-active" : "chat-tab"}
              onClick={() => setActiveTab(id)}
            >
              {label}
              {id === "files" && documentDropQueue.total > 0 ? (
                <span>{documentDropQueue.total}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="chat-sidebar-card">
          <div className="chat-status-line">
            <span className={runtimeOnline ? "chat-dot online" : "chat-dot offline"} />
            <strong>{runtimeOnline ? "Runtime aktywny" : "Runtime offline"}</strong>
          </div>
          <small>
            {selectedCase?.displayName || "Nowy wątek utworzy własną sprawę"}
          </small>
        </div>

        <div className="chat-sidebar-foot">
          <span>prawny-router-v3 ✓</span>
          <span>shared ✓</span>
          <span>{caseTypeSkills.length === 0 ? AUTO_CASE_TYPE : `${caseTypeSkills.length} typów priorytetowych`}</span>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-page-header">
          <div>
            <p className="eyebrow">
              {selectedCase ? selectedCase.displayName || "Sprawa bez nazwy" : "Nowa sprawa"}
            </p>
            <h1>
              {activeTab === "chat"
                ? "Czat sprawy"
                : activeTab === "files"
                  ? "Akta i foldery sprawy"
                  : activeTab === "skills"
                    ? "Routing i skille"
                    : activeTab === "case"
                      ? "Dane sprawy"
                      : activeTab === "firm"
                        ? "Know-how i wzory kancelarii"
                        : "Model i klucz API"}
            </h1>
          </div>
          <div className="chat-header-actions">
            {activeTab === "chat" ? (
              <div className="chat-model-lanes">
                <label>
                  <span>Model główny</span>
                  <div className="chat-model-select-row">
                    <select
                      aria-label="Provider modelu głównego"
                      value={provider}
                      disabled={executing}
                      onChange={(event) => {
                        setProvider(
                          event.target.value as PrimaryModelSource
                        );
                        setProviderApiKeyInput("");
                        setProviderKeyMessage("");
                      }}
                    >
                      {PRIMARY_MODEL_SOURCES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Model główny"
                      value={model}
                      disabled={executing || models.length === 0}
                      onChange={(event) => setModel(event.target.value)}
                    >
                      {models.length === 0 ? (
                        <option value="">
                          {provider === "local"
                            ? "Brak zainstalowanych modeli lokalnych"
                            : "Brak modeli"}
                        </option>
                      ) : null}
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
                  </div>
                </label>
                <div className="chat-aux-model-chip">
                  <span>Pomocniczy</span>
                  <strong>
                    {modelRouting.auxiliaryEnabled
                      ? selectedAuxiliaryModel?.displayName ??
                        modelRouting.auxiliaryModel
                      : "wyłączony"}
                  </strong>
                  {modelRouting.auxiliaryEnabled ? (
                    <small>{modelRouting.auxiliaryProvider}</small>
                  ) : null}
                </div>
              </div>
            ) : null}
            <button
              type="button"
              className="chat-secondary-action"
              disabled={Boolean(selectedCase?.archivedAt)}
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
                if (event.target.files) void acceptFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </div>
        </header>

        {[runtimeError, caseError, threadError].filter(Boolean).map((error, index) => (
          <div key={`${error}-${index}`} className="chat-alert chat-alert-error">
            {error}
          </div>
        ))}

        {documentDropQueue.total > 0 ? (
          <section className="chat-card-stack chat-document-flow" aria-label="OCR i prywatność plików">
            <article className="chat-card">
              <p className="eyebrow">OCR w czacie · plik po pliku</p>
              <h2>
                {documentDropQueue.completed}/{documentDropQueue.total} zakończono
              </h2>
              <p>
                Każdy plik przechodzi osobno: wykrycie skanu → lokalny OCR → decyzja o anonimizacji →
                osobny zaszyfrowany vault. Następny plik nie rozpocznie decyzji prywatności, dopóki
                bieżący nie zostanie zakończony lub pominięty.
              </p>
              {documentDropQueue.rejected > 0 ? (
                <p className="chat-inline-error">
                  Pominięto {documentDropQueue.rejected} plików.
                </p>
              ) : null}
              <ul className="chat-file-list">
                {documentDropQueue.files.slice(0, 12).map((file, index) => (
                  <li key={`${file.name}-${file.lastModified}-${index}`}>
                    <strong>{file.name}</strong>
                    <small>
                      {index === 0 ? "OCR / decyzja prywatności" : "Oczekuje"} · {describeDocumentFile(file)}
                    </small>
                  </li>
                ))}
              </ul>
              <small>limit kolejki {MAX_DOCUMENT_DROP_QUEUE}</small>
            </article>

            <DocumentPrivacyPanel
              caseId={caseId}
              incomingFile={documentDropQueue.files[0] ?? null}
              onIncomingFileConsumed={() =>
                setDocumentDropQueue((current) => consumeDocumentDropFile(current))
              }
              onCaseFilesChange={() =>
                setWorkspaceRefresh((value) => value + 1)
              }
              onAttachmentSelectionChange={(selection) => {
                if (!selection) return;
                setDocumentAttachments((current) => upsertAttachment(current, selection));
              }}
            />
          </section>
        ) : null}

        {activeTab === "chat" ? (
          <section
            className={dropActive ? "chat-panel chat-drop-active" : "chat-panel"}
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
              dragDepth.current = Math.max(0, dragDepth.current - 1);
              if (dragDepth.current === 0) setDropActive(false);
            }}
            onDrop={handleDrop}
          >
            <ProcessPleadingWorkflowPanel
              caseId={caseId}
              forceVisible={processWorkflowVisible}
              refreshToken={processWorkflowRefresh}
              canWrite={Boolean(
                selectedCase &&
                !selectedCase.archivedAt &&
                canWriteCase(selectedCase)
              )}
              busy={executing || caseBusy}
              onContinue={() => {
                void executeMessage(
                  "Kontynuuj pipeline pisma procesowego zgodnie z aktywnym checkpointem."
                );
              }}
            />
            {conversationIsNew && availablePipelines.length > 0 ? (
              <section
                className="chat-pipeline-picker"
                aria-label="Pipeline deterministyczny dla nowej rozmowy"
              >
                <div>
                  <p className="eyebrow">Nowa rozmowa</p>
                  <h3>
                    {caseTypeSkills.length === 0
                      ? "Tryb automatyczny — router dobierze wykonanie"
                      : `${caseTypeSkills.length} wybranych pipeline'ów`}
                  </h3>
                  <p>
                    Możesz od razu wskazać pipeline deterministyczny zamiast
                    polegać na tym, że Auto rozpozna go z treści pytania.
                    Wybór nie wyłącza Auto — router nadal może dobrać
                    współpracujące skille i dziedziny.
                  </p>
                </div>
                <div className="chat-pipeline-options">
                  {availablePipelines.map((name) => {
                    const checked =
                      caseTypeSkills.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        className={
                          checked
                            ? "chat-pipeline-option selected"
                            : "chat-pipeline-option"
                        }
                        aria-pressed={checked}
                        onClick={() => toggleCaseTypeSkill(name)}
                      >
                        {labelForSkill(name)}
                      </button>
                    );
                  })}
                  {caseTypeSkills.length > 0 ? (
                    <button
                      type="button"
                      className="chat-pipeline-option reset"
                      onClick={() => setCaseTypeSkills([])}
                    >
                      Wróć do Auto
                    </button>
                  ) : null}
                </div>
              </section>
            ) : null}

            <div className="chat-message-list" aria-live="polite">
              {threadLoading ? (
                <article className="chat-message chat-message-system">
                  Ładowanie zaszyfrowanego wątku sprawy…
                </article>
              ) : null}
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
                  <DocumentCitationContent
                    content={message.content}
                    citations={message.documentCitations}
                  />
                  {message.meta ? (
                    <small className="chat-message-meta">{message.meta}</small>
                  ) : null}
                  {message.evidence?.length ? (
                    <details className="chat-evidence">
                      <summary>Źródła i weryfikacja ({message.evidence.length})</summary>
                      <ul>
                        {message.evidence.map((item: EvidenceItem, index: number) => (
                          <li key={`${item.claim}-${index}`}>
                            <span>{item.status} · {item.kind}</span>
                            <strong>{item.claim}</strong>
                            {item.sourceUrl ? (
                              <button
                                type="button"
                                onClick={() => void openExternalUrl(item.sourceUrl!)}
                              >
                                Otwórz źródło w przeglądarce ↗
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
                    Analizuję, dobieram dziedziny i skille oraz waliduję cytowania…
                  </div>
                </article>
              ) : null}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-composer">
              {dropActive ? (
                <div className="chat-drop-overlay">
                  Upuść pliki, aby dodać je do tej sprawy
                </div>
              ) : null}
              <div className="chat-composer-meta">
                <span>Sprawa: {selectedCase?.displayName || "utworzy się przy pierwszej wiadomości"}</span>
                <span>Auto skille: {automaticSkills ? "włączone" : "wyłączone"}</span>
                <span>Priorytety: {caseTypeSkills.length || "auto"}</span>
                <span>Załączniki: {documentAttachments.length}</span>
              </div>
              <textarea
                value={query}
                maxLength={20_000}
                disabled={Boolean(selectedCase?.archivedAt)}
                placeholder={
                  selectedCase?.archivedAt
                    ? "Sprawa archiwalna jest tylko do odczytu."
                    : "Napisz wiadomość. Jeśli nie ma sprawy, pierwszy wpis utworzy dla niego osobny katalog i wątek…"
                }
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (canSend) void sendMessage();
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
                </button>
                <span className="chat-composer-spacer" />
                <button
                  type="button"
                  className="chat-primary-action"
                  disabled={!canSend}
                  onClick={() => void sendMessage()}
                >
                  {executing || pendingFirstMessage ? "Wysyłanie…" : "Wyślij"}
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
                <p className="eyebrow">Dodawanie do akt</p>
                <h2>Kliknij lub przeciągnij pliki</h2>
                <p>
                  Pliki trafiają do zaszyfrowanego magazynu bieżącej sprawy.
                  OCR i pytanie o prywatność są prowadzone w czacie plik po pliku;
                  tutaj zarządzasz już zapisanymi aktami i strukturą folderów.
                </p>
              </div>
              <button
                type="button"
                className="chat-primary-action"
                disabled={Boolean(selectedCase?.archivedAt)}
                onClick={() => fileInputRef.current?.click()}
              >
                Otwórz eksplorator
              </button>
            </article>

            <WorkspaceManager
              caseId={caseId}
              title={`Akta sprawy${selectedCase?.displayName ? ` — ${selectedCase.displayName}` : ""}`}
              canWrite={canWriteCase(selectedCase)}
              refreshToken={workspaceRefresh}
            />
          </section>
        ) : null}

        {activeTab === "skills" ? (
          <section className="chat-card-stack">
            <article className="chat-card">
              <div className="chat-card-heading">
                <div>
                  <p className="eyebrow">Typ sprawy / wykonanie</p>
                  <h2>
                    {caseTypeSkills.length === 0
                      ? "Automatyczny — dobierz skille wykonawcze"
                      : `${caseTypeSkills.length} priorytetowych skilli wykonawczych`}
                  </h2>
                  <p>
                    Możesz zaznaczyć kilka skilli jednocześnie. Analiza sądowa może
                    współpracować np. z chronologią, analizą dowodów i raportem klienta.
                    System może równolegle dobrać kilka dziedzin prawa.
                  </p>
                </div>
                <label className="chat-switch">
                  <input
                    type="checkbox"
                    checked={automaticSkills}
                    onChange={(event) => setAutomaticSkills(event.target.checked)}
                  />
                  <span>Auto dobór dodatkowych</span>
                </label>
              </div>
              <div className="chat-skill-grid">
                {executionSkills.map((skill) => {
                  const checked = caseTypeSkills.includes(skill.name);
                  return (
                    <label
                      key={skill.name}
                      className={checked ? "chat-skill-card selected" : "chat-skill-card"}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCaseTypeSkill(skill.name)}
                      />
                      <span>
                        <strong>{labelForSkill(skill.name)}</strong>
                        <small>{skill.description || skill.type || "skill wykonawczy"}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
              {caseTypeSkills.length > 0 ? (
                <button
                  type="button"
                  className="chat-secondary-action"
                  onClick={() => setCaseTypeSkills([])}
                >
                  Wróć do typu Automatyczny
                </button>
              ) : null}
            </article>

            <article className="chat-card">
              <p className="eyebrow">Obowiązkowy rdzeń</p>
              <div className="chat-mandatory-grid">
                <div>
                  <strong>✓ prawny-router-v3</strong>
                  <small>zawsze aktywny</small>
                </div>
                <div>
                  <strong>✓ shared</strong>
                  <small>zawsze aktywny</small>
                </div>
              </div>
            </article>

            <article className="chat-card">
              <div className="chat-card-heading">
                <div>
                  <p className="eyebrow">Dziedziny prawa</p>
                  <h2>
                    {domainSelection.length === routes.length
                      ? `Wszystkie moduły DR (${routes.length})`
                      : `${domainSelection.length} z ${routes.length} modułów DR`}
                  </h2>
                  <p>
                    Wszystkie moduły DR są zaznaczone na start. Odznaczenie
                    ogranicza dziedziny, z których router może korzystać w tej
                    rozmowie; pełny zestaw nie nakłada żadnego ograniczenia.
                  </p>
                </div>
                {domainSelection.length < routes.length ? (
                  <button
                    type="button"
                    className="chat-secondary-action"
                    onClick={() => setAllowedDomains(null)}
                  >
                    Zaznacz wszystkie
                  </button>
                ) : null}
              </div>
              <div className="chat-skill-grid">
                {routes.map((name) => {
                  const checked =
                    domainSelection.includes(name);
                  return (
                    <label
                      key={name}
                      className={checked ? "chat-skill-card selected" : "chat-skill-card"}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDomainSkill(name)}
                      />
                      <span>
                        <strong>{labelForSkill(name)}</strong>
                        <small>dziedzina prawa</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </article>

            <article className="chat-card">
              <div className="chat-card-heading">
                <div>
                  <p className="eyebrow">Ręczny dobór</p>
                  <h2>Dodatkowe skille i dziedziny</h2>
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
                      className={checked ? "chat-skill-card selected" : "chat-skill-card"}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleManualSkill(skill.name)}
                      />
                      <span>
                        <strong>{labelForSkill(skill.name)}</strong>
                        <small>{skill.description || skill.type || "skill"}</small>
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
              <p className="eyebrow">Wątek = sprawa</p>
              <h2>Nazwa sprawy</h2>
              <p>
                Sygnatura nie jest wymagana przy zakładaniu sprawy. Nazwa jest niezależna
                od sygnatury i może być dowolnie nadana oraz później zmieniona przez użytkownika.
              </p>
              <div className="chat-form-row">
                <input
                  value={caseNameDraft}
                  maxLength={160}
                  disabled={!selectedCase || caseBusy}
                  placeholder="np. Kowalski przeciwko ABC — odszkodowanie"
                  onChange={(event) => setCaseNameDraft(event.target.value)}
                />
                <button
                  type="button"
                  className="chat-primary-action"
                  disabled={!selectedCase || caseBusy || !caseNameDraft.trim()}
                  onClick={() => void saveCaseName()}
                >
                  Zapisz nazwę
                </button>
              </div>
              {selectedCase ? (
                <div className="matter-case-meta">
                  <span>ID katalogu: {selectedCase.caseId}</span>
                  <span>Rola: {selectedCase.role}</span>
                  <span>{selectedCase.archivedAt ? "ARCHIWALNA (tylko odczyt)" : "AKTYWNA"}</span>
                </div>
              ) : null}
            </article>

            <article className="chat-card">
              <p className="eyebrow">Wiedza w sesji</p>
              <div className="chat-check-row">
                <label>
                  <input
                    type="checkbox"
                    checked={includeCaseKnowledge}
                    disabled={!selectedCase || Boolean(selectedCase.archivedAt)}
                    onChange={(event) => setIncludeCaseKnowledge(event.target.checked)}
                  />
                  Przeszukuj dokumenty bieżącej sprawy
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={includeFirmKnowledge}
                    disabled={!firmKnowledgeWorkspace}
                    onChange={(event) => setIncludeFirmKnowledge(event.target.checked)}
                  />
                  Przeszukuj know-how kancelarii
                </label>
              </div>
            </article>

            <CaseCollaborationPanel
              caseId={caseId}
              caseRole={selectedCase?.role}
            />

            {selectedCase ? (
              <article className="chat-card">
                <p className="eyebrow">Cykl życia</p>
                <h2>Zarządzanie sprawą</h2>
                <button
                  type="button"
                  className="chat-secondary-action"
                  disabled={caseBusy}
                  onClick={() => void toggleArchive()}
                >
                  {selectedCase.archivedAt ? "Przywróć z archiwum" : "Archiwizuj sprawę"}
                </button>

                {selectedCase.role === "OWNER" && user.appRole === "ADMIN" ? (
                  <details className="matter-danger-zone">
                    <summary>Trwałe usunięcie sprawy</summary>
                    <p>Wpisz USUŃ i podaj aktualne hasło.</p>
                    <div className="chat-form-row">
                      <input
                        value={deletePhrase}
                        placeholder="Wpisz USUŃ"
                        onChange={(event) => setDeletePhrase(event.target.value)}
                      />
                      <input
                        type="password"
                        value={deletePassword}
                        autoComplete="current-password"
                        placeholder="Aktualne hasło"
                        onChange={(event) => setDeletePassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className="workspace-delete"
                        disabled={
                          caseBusy ||
                          deletePhrase !== "USUŃ" ||
                          !deletePassword
                        }
                        onClick={() => void permanentlyDeleteCase()}
                      >
                        Usuń sprawę trwale
                      </button>
                    </div>
                  </details>
                ) : null}
              </article>
            ) : null}
          </section>
        ) : null}

        {activeTab === "firm" ? (
          <section className="chat-card-stack">
            <FirmKnowledgePanel
              user={user}
              currentCase={selectedCase}
              onUseHit={(selection) =>
                setDocumentAttachments((current) => upsertAttachment(current, selection))
              }
              onWorkspaceChange={setFirmKnowledgeWorkspace}
            />
            {firmKnowledgeWorkspace ? (
              <WorkspaceManager
                caseId={firmKnowledgeWorkspace.caseId}
                title="Know-how i wzory kancelarii"
                canWrite={
                  user.appRole === "ADMIN" &&
                  !firmKnowledgeWorkspace.archivedAt
                }
                refreshToken={workspaceRefresh}
              />
            ) : null}
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
                    setProvider(
                      event.target.value as PrimaryModelSource
                    );
                    setProviderApiKeyInput("");
                    setProviderKeyMessage("");
                  }}
                >
                  {PRIMARY_MODEL_SOURCES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                      {item.id === "local"
                        ? " · bez klucza API"
                        : providerConfiguration[item.id] === true
                          ? " · API gotowe"
                          : providerConfiguration[item.id] === false
                            ? " · brak klucza"
                            : " · sprawdzanie"}
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
                    <option value="">
                      {provider === "local"
                        ? "Brak zainstalowanych modeli lokalnych"
                        : "Brak dostępnych modeli"}
                    </option>
                  ) : null}
                  {models.map((item) => (
                    <option key={item.id} value={item.id} disabled={!item.selectable}>
                      {item.displayName}{!item.selectable ? " · nieobsługiwany" : ""}
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
                  Aktywne okno runtime: {selectedModel.contextWindow.toLocaleString("pl-PL")} tokenów
                  {selectedModel.nativeContextWindow
                    ? ` · natywne: ${selectedModel.nativeContextWindow.toLocaleString("pl-PL")}`
                    : ""}
                  {selectedModel.contextMode === "YARN_EXTENDED"
                    ? " · rozszerzone YaRN"
                    : ""}
                </small>
              ) : null}
              {model.startsWith("local/") ? (
                <small>
                  Model lokalny jest dostępny jako model główny przez llama.cpp i nie wymaga klucza OpenAI.
                </small>
              ) : null}
              {providerDefinition && !model.startsWith("local/") ? (
                <button
                  type="button"
                  className="chat-link-action"
                  onClick={() => void openExternalUrl(providerDefinition.apiKeyUrl)}
                >
                  {model
                    ? `Klucz API dla ${providerDefinition.label} — otwórz w przeglądarce ↗`
                    : `Utwórz / pobierz klucz ${providerDefinition.label} — otwórz w przeglądarce ↗`}
                </button>
              ) : null}
            </article>

            <article className="chat-card">
              <p className="eyebrow">Rozdział pracy modeli</p>
              <h2>Model pomocniczy</h2>
              <label className="chat-toggle-row">
                <input
                  type="checkbox"
                  checked={modelRouting.auxiliaryEnabled}
                  onChange={(event) =>
                    setModelRouting((current) => ({
                      ...current,
                      auxiliaryEnabled: event.target.checked
                    }))
                  }
                />
                <span>
                  Aktywuj programistyczny lane pomocniczy
                </span>
              </label>
              <p>
                Helper nie odpowiada na całe pytanie. Program może przekazać mu wyłącznie
                zamknięte zadania pomocnicze, np. wyłuskanie jawnych referencji do przepisów,
                Dz.U. lub sygnatur. Weryfikację wykonuje następnie deterministyczny runtime.
              </p>
              <label>
                Provider pomocniczy
                <select
                  value={modelRouting.auxiliaryProvider}
                  onChange={(event) => {
                    const next = event.target.value as ProviderId;
                    setModelRouting((current) => ({
                      ...current,
                      auxiliaryProvider: next,
                      auxiliaryModel:
                        next === "openai"
                          ? "local/bielik-11b-v3-q4km"
                          : ""
                    }));
                    setModelRoutingMessage("");
                  }}
                >
                  {PROVIDERS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Model pomocniczy
                <select
                  value={modelRouting.auxiliaryModel}
                  disabled={modelRoutingBusy}
                  onChange={(event) =>
                    setModelRouting((current) => ({
                      ...current,
                      auxiliaryModel: event.target.value
                    }))
                  }
                >
                  {!auxiliaryModels.some(
                    (item) => item.id === modelRouting.auxiliaryModel
                  ) && modelRouting.auxiliaryModel ? (
                    <option value={modelRouting.auxiliaryModel}>
                      {modelRouting.auxiliaryModel ===
                      "local/bielik-11b-v3-q4km"
                        ? "Bielik 11B v3 · domyślny"
                        : modelRouting.auxiliaryModel}
                    </option>
                  ) : null}
                  {auxiliaryModels.length === 0 &&
                  !modelRouting.auxiliaryModel ? (
                    <option value="">Brak dostępnych modeli</option>
                  ) : null}
                  {auxiliaryModels.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.displayName}
                    </option>
                  ))}
                </select>
              </label>
              <small>
                Domyślny helper: Bielik. Jeżeli nie jest zainstalowany, aktywne
                zadanie pomocnicze zostanie oznaczone jako FAILED/DEGRADED,
                ale model główny nadal może wykonać odpowiedź.
              </small>
              {modelRouting.auxiliaryEnabled &&
              !modelRouting.auxiliaryModel.startsWith("local/") ? (
                <p className="chat-inline-warning">
                  Uwaga: pomocniczy model nie jest lokalny. Program może wysłać
                  do wskazanego providera wyłącznie bieżącą wypowiedź użytkownika
                  potrzebną do dozwolonego zadania pomocniczego.
                </p>
              ) : null}
              <button
                type="button"
                className="chat-primary-action"
                disabled={
                  modelRoutingBusy ||
                  !modelRouting.auxiliaryModel.trim()
                }
                onClick={() => void saveModelRouting()}
              >
                {modelRoutingBusy
                  ? "Zapisywanie…"
                  : "Zapisz rozdział modeli"}
              </button>
              {modelRoutingMessage ? (
                <small>{modelRoutingMessage}</small>
              ) : null}
            </article>

            <article className="chat-card">
              <p className="eyebrow">Klucz API</p>
              <h2>Konfiguracja lokalna</h2>
              {provider === "local" ? (
                <p>
                  Modele lokalne działają przez llama.cpp i nie wymagają klucza API.
                </p>
              ) : user.appRole === "ADMIN" ? (
                <>
                  <input
                    type="password"
                    autoComplete="off"
                    value={providerApiKey}
                    placeholder="Wklej klucz API"
                    onChange={(event) => setProviderApiKeyInput(event.target.value)}
                  />
                  <div className="chat-form-row compact">
                    <button
                      type="button"
                      className="chat-primary-action"
                      disabled={providerKeyBusy || !providerApiKey.trim()}
                      onClick={() => void saveApiKey()}
                    >
                      {isDesktopShell() ? "Zapisz w systemie" : "Użyj w sesji"}
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
                  {providerKeyMessage ? <small>{providerKeyMessage}</small> : null}
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
