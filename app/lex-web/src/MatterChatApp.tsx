import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode
} from "react";
import { CaseCollaborationPanel } from "./CaseCollaborationPanel.js";
import { DocumentCitationContent } from "./DocumentCitationContent.js";
import { DocumentPrivacyPanel } from "./DocumentPrivacyPanel.js";
import { FirmKnowledgePanel } from "./FirmKnowledgePanel.js";
import { WorkspaceManager } from "./WorkspaceManager.js";
import { ProcessPleadingWorkflowPanel } from "./ProcessPleadingWorkflowPanel.js";
import {
  ApiError,
  getSkills,
  archiveCase,
  clearClaudeOAuthToken,
  clearProviderApiKey,
  createCase,
  createDeanonymizationIntent,
  deleteCase,
  downloadGeneratedArtifact,
  downloadSensitiveArtifact,
  executeSession,
  finalizeDeanonymization,
  generateLegalDocument,
  getHealth,
  getLocalModels,
  getModels,
  getModelRoutingPreferences,
  getProviderAccountStatus,
  getProviderStatus,
  getRoutes,
  isDesktopShell,
  listCaseFiles,
  listCases,
  loginProviderAccount,
  provisionLocalModel,
  repairLocalModel,
  reauthorizeDeanonymization,
  renameCase,
  setClaudeOAuthToken,
  setModelRoutingPreferences,
  setProviderApiKey,
  startLocalModel,
  unarchiveCase,
  type AuthenticatedUser,
  type CaseListItem,
  type DocumentAttachmentSelection,
  type EvidenceItem,
  type ModelDescriptor,
  type ModelRoutingPreferences,
  type ProviderAccountSessionStatus,
  type ProviderId,
  type SessionExecutionResponse,
  type StoredUploadResponse,
  type LegalDocumentFormat,
  type LocalModelsResponse
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
  DETERMINISTIC_ACTIONS,
  DETERMINISTIC_ACTION_META_PREFIX,
  buildSkillSelectionEnvelope,
  choosePrimaryRoute,
  deterministicActionFromMeta,
  deterministicActionMeta,
  labelForSkill,
  setAllowedDomainSkills,
  setCaseTypeExecutionSkills,
  skillsForDeterministicAction,
  type DeterministicActionId,
  type PublicSkillDescriptor
} from "./chat-routing.js";
import {
  useCaseThread,
  type CaseChatMessage
} from "./case-thread.js";
import {
  conversationForProvider
} from "./conversation-context.js";
import {
  accountModelIdForPrimarySource,
  canExecutePrimaryModel,
  isAccountPrimarySource,
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

export type SettingsSection =
  | "models"
  | "users"
  | "security"
  | "maintenance";

export type SettingsRequest = {
  section: SettingsSection;
  nonce: number;
};

type SettingsPanels = {
  localAi?: ReactNode;
  users?: ReactNode;
  security?: ReactNode;
  maintenance?: ReactNode;
};

type ExtendedExecution = SessionExecutionResponse & {
  documentCitations?: WorkspaceDocumentCitation[];
  loadedSkills?: string[];
  executionSkills?: string[];
  domainSkills?: string[];
};

type ExecutionDiagnostic = {
  friendly: string;
  code: string;
  status?: number;
  reason?: string;
  description?: string;
  stage?: string;
  trace?: ApiError["trace"];
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
  accountClientLabel: string;
  accountInstallUrl: string;
}> = [
  {
    id: "openai",
    label: "OpenAI",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    accountClientLabel: "Codex CLI",
    accountInstallUrl:
      "https://developers.openai.com/codex/cli"
  },
  {
    id: "anthropic",
    label: "Anthropic / Claude",
    apiKeyUrl: "https://platform.claude.com/settings/keys",
    accountClientLabel: "Claude Code",
    accountInstallUrl:
      "https://support.claude.com/en/articles/14552382-your-first-day-in-claude-code"
  },
  {
    id: "xai",
    label: "xAI / Grok",
    apiKeyUrl: "https://console.x.ai/",
    accountClientLabel: "Grok Build",
    accountInstallUrl:
      "https://docs.x.ai/build/overview"
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
  {
    id: "openai-account",
    label: "ChatGPT · konto"
  },
  {
    id: "openai",
    label: "OpenAI · API"
  },
  {
    id: "anthropic-account",
    label: "Claude · konto / OAuth"
  },
  {
    id: "anthropic",
    label: "Anthropic · API"
  },
  {
    id: "xai-account",
    label: "Grok · konto"
  },
  {
    id: "xai",
    label: "xAI · API"
  }
];

const ACCOUNT_MODEL_LABELS: Record<
  ProviderId,
  string
> = {
  openai:
    "ChatGPT / Codex · model konta",
  anthropic:
    "Claude Code · model konta",
  xai:
    "Grok · model konta"
};

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

const FALLBACK_EXECUTION_SKILLS: PublicSkillDescriptor[] = [
  {
    name: "analiza-sadowa-v6",
    category: "execution",
    description: "Analiza sądowa i procesowa akt sprawy."
  },
  {
    name: "analizator-dowodow-v3",
    category: "execution",
    description: "Analiza materiału dowodowego, luk i ryzyk."
  },
  {
    name: "analizator-przepisow-v2",
    category: "execution",
    description: "Analiza i zestawienie przepisów istotnych dla sprawy."
  },
  {
    name: "analizator-umow-v1",
    category: "execution",
    description: "Analiza postanowień umowy, obowiązków i ryzyk."
  },
  {
    name: "chronologia-sprawy-v1",
    category: "execution",
    description: "Chronologia zdarzeń, terminów i zależności czasowych."
  },
  {
    name: "orzeczenia-sadowe-v2",
    category: "execution",
    description: "Praca z orzecznictwem i tezami judykatury."
  },
  {
    name: "pisma-procesowe-v3",
    category: "execution",
    description: "Przygotowanie pisma procesowego w checkpointowanym workflow."
  },
  {
    name: "pisma-proste-v2",
    category: "execution",
    description: "Przygotowanie prostego pisma prawnego lub procesowego."
  },
  {
    name: "przesluchanie-swiadkow-v2-min90",
    category: "execution",
    description: "Plan przesłuchania świadków i zestaw pytań."
  },
  {
    name: "przewodnik-prawny-v2",
    category: "execution",
    description: "Przewodnik po dalszych krokach i ścieżkach działania."
  },
  {
    name: "raport-klienta-v1",
    category: "execution",
    description: "Raport dla klienta."
  },
  {
    name: "raport-sytuacyjny-v2",
    category: "execution",
    description: "Raport sytuacyjny sprawy, ryzyk i kolejnych działań."
  }
];

function mergeSkillCatalog(
  ...catalogs: readonly PublicSkillDescriptor[][]
): PublicSkillDescriptor[] {
  const byName = new Map<string, PublicSkillDescriptor>();
  for (const catalog of catalogs) {
    for (const skill of catalog) {
      const existing = byName.get(skill.name);
      byName.set(
        skill.name,
        existing
          ? {
              ...existing,
              ...skill,
              category:
                skill.category ??
                existing.category
            }
          : skill
      );
    }
  }
  return [...byName.values()];
}

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

type DirectDocumentRequest = {
  format: "docx" | "odt";
  documentType:
    | "pleading"
    | "contract"
    | "opinion"
    | "letter"
    | "report"
    | "other";
};

function directDocumentRequest(
  input: string
): DirectDocumentRequest | null {
  const normalized =
    input
      .normalize("NFKC")
      .toLocaleLowerCase("pl");

  const explicitFormat =
    /\bodt\b/u.test(normalized)
      ? "odt" as const
      : /\bdocx\b|\bword\b/u.test(normalized)
        ? "docx" as const
        : null;

  const documentNoun =
    /\b(?:pismo|wezwanie|pozew|wniosek|apelacj[ęa]|sprzeciw|zażalenie|umow[ęa]|opini[ęa]|raport|oświadczenie|reklamacj[ęa]|odpowiedź na pozew|pełnomocnictwo|dokument|wzór)\b/u
      .test(normalized);
  const generationVerb =
    /\b(?:wygeneruj|przygotuj|stwórz|utwórz|sporządź|napisz|daj|opracuj)\b/u
      .test(normalized);

  if (
    !explicitFormat &&
    !(documentNoun && generationVerb)
  ) {
    return null;
  }

  const documentType =
    /\b(?:pozew|apelacj|sprzeciw|zażalen|pismo procesowe)\b/u
      .test(normalized)
      ? "pleading" as const
      : /\bumow/u.test(normalized)
        ? "contract" as const
        : /\bopini/u.test(normalized)
          ? "opinion" as const
          : /\braport/u.test(normalized)
            ? "report" as const
            : /\b(?:wezwanie|reklamacj|oświadczen|pełnomocnictw|list)\b/u
                .test(normalized)
              ? "letter" as const
              : "other" as const;

  return {
    format:
      explicitFormat ??
      "docx",
    documentType
  };
}

function downloadBlob(
  blob: Blob,
  filename: string
): void {
  const url =
    URL.createObjectURL(
      blob
    );
  try {
    const anchor =
      document.createElement(
        "a"
      );
    anchor.href = url;
    anchor.download =
      filename;
    anchor.rel =
      "noreferrer";
    document.body.appendChild(
      anchor
    );
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(
      url
    );
  }
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

function visibleMessageMeta(
  meta?: string
): string {
  if (!meta) return "";
  return meta
    .split(/\s*[|;]\s*/)
    .filter(
      (item) =>
        !item.startsWith(
          DETERMINISTIC_ACTION_META_PREFIX
        )
    )
    .join(" · ")
    .trim();
}

export function localModelFailureMessage(
  reason?: string
): string {
  switch (reason) {
    case "LOCAL_MODEL_SERVER_UNREACHABLE":
      return "Profil lokalnego modelu przeszedł przygotowanie, ale serwer llama.cpp przestał odpowiadać przed lub w trakcie generowania. Program uruchomi go ponownie przy następnej wiadomości. Kod: LOCAL_MODEL_SERVER_UNREACHABLE";
    case "LOCAL_MODEL_REQUEST_REJECTED":
      return "Połączenie z lokalnym serwerem działało, ale llama.cpp odrzucił żądanie inferencji. Kod: LOCAL_MODEL_REQUEST_REJECTED";
    case "LOCAL_MODEL_SERVER_ERROR":
      return "Połączenie z lokalnym serwerem działało, ale llama.cpp zwrócił błąd podczas generowania. Kod: LOCAL_MODEL_SERVER_ERROR";
    case "LOCAL_MODEL_CONTEXT_OVERFLOW":
      return "Lokalny model działa, ale żądanie przekroczyło dostępny kontekst. Zmniejsz zakres rozmowy lub kontekst załączników. Kod: LOCAL_MODEL_CONTEXT_OVERFLOW";
    case "LOCAL_MODEL_RESOURCE_EXHAUSTED":
      return "Lokalny model został uruchomiony, ale zabrakło pamięci RAM/VRAM podczas inferencji. Zmniejsz kontekst albo wybierz profil CPU/mniejszy model. Kod: LOCAL_MODEL_RESOURCE_EXHAUSTED";
    case "LOCAL_MODEL_INFERENCE_FAILED":
      return "Połączenie z lokalnym llama.cpp zostało wcześniej potwierdzone przez health-check, ale sama generacja odpowiedzi nie zakończyła się poprawnie. Kod: LOCAL_MODEL_INFERENCE_FAILED";
    default:
      return `Lokalny model nie mógł wykonać odpowiedzi.${reason ? ` Kod: ${reason}` : ""}`;
  }
}

function providerFailureMessage(
  provider: PrimaryModelSource,
  reason?: string
): string {
  switch (reason) {
    case "ACCOUNT_SESSION_MODEL_UNSUPPORTED":
      return "ChatGPT/Codex odrzucił model domyślny dla tej sesji. Lex Machina używa kompatybilnej listy modeli konta; jeśli błąd wraca, zaktualizuj aplikację i ponów połączenie konta.";
    case "ACCOUNT_SESSION_AUTH_EXPIRED":
      return "Sesja ChatGPT/Codex wygasła albo została odrzucona. Otwórz Ustawienia → Modele i AI i ponownie połącz konto.";
    case "ACCOUNT_SESSION_CAPACITY":
      return "ChatGPT/Codex chwilowo odrzuca wykonanie z powodu limitu lub dostępności konta. Kod: ACCOUNT_SESSION_CAPACITY";
    case "ACCOUNT_SESSION_PROMPT_REJECTED":
      return "ChatGPT/Codex odrzucił bieżące żądanie po stronie usługi. Kod: ACCOUNT_SESSION_PROMPT_REJECTED";
    case "ACCOUNT_SESSION_CLI_INCOMPATIBLE":
      return "Klient Codex jest niezgodny z kontraktem Lex Machina. Zaktualizuj Lex Machina — aplikacja korzysta z przypiętej wersji prywatnego klienta Codex.";
    case "ACCOUNT_SESSION_CLI_FAILED":
      return "Klient ChatGPT/Codex zakończył wykonanie błędem. Lex Machina 0.1.7 rozróżnia model, logowanie, limity i zgodność CLI; ponowne połączenie konta powinno zachować historię sprawy.";
    default:
      return `Provider odrzucił lub przerwał wykonanie${reason ? ` (kod: ${reason})` : ""}.`;
  }
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
    const verificationDegraded =
      execution.finalization !== "PASS" ||
      execution.gateI?.result === "BLOCKED";
    const verificationWarning =
      verificationDegraded
        ? "⚠️ Weryfikacja źródeł lub śladu Gate I nie jest kompletna. Odpowiedź jest prezentowana roboczo i może wymagać potwierdzenia w źródłach.\n\n"
        : "";

    return {
      id: messageId(),
      role: "assistant",
      content:
        verificationWarning +
        execution.answer,
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
        ` · SUPPORTED ${execution.verification.supported}` +
        (verificationDegraded
          ? ` · WERYFIKACJA NIEPEŁNA · UNVERIFIED ${execution.verification.unverified}`
          : "")
    };
  }

  return {
    id: messageId(),
    role: "system",
    content:
      "Nie udało się zaprezentować odpowiedzi z powodu blokady wykonania lub wymaganego workflow. Sama niepełna weryfikacja źródeł nie blokuje już odpowiedzi.",
    evidence: execution.evidence,
    meta:
      `routing: ${labelForSkill(execution.primarySkill || route)}` +
      ` · finalization ${execution.finalization}` +
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
  user,
  settingsPanels,
  settingsRequest,
  onLock,
  onLogout
}: {
  user: AuthenticatedUser;
  settingsPanels?: SettingsPanels;
  settingsRequest?: SettingsRequest | null;
  onLock?: () => void;
  onLogout?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [settingsSection, setSettingsSection] =
    useState<SettingsSection>("models");
  const [runtimeOnline, setRuntimeOnline] = useState(false);
  const [runtimeError, setRuntimeError] = useState("");

  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [caseId, setCaseId] = useState("");
  const [caseSearch, setCaseSearch] = useState("");
  const [newCaseName, setNewCaseName] = useState("");
  const [caseNameDraft, setCaseNameDraft] = useState("");
  const [caseBusy, setCaseBusy] = useState(false);
  const [caseError, setCaseError] = useState("");
  const [deletePhrase, setDeletePhrase] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [workspaceRefresh, setWorkspaceRefresh] = useState(0);
  const [caseFiles, setCaseFiles] =
    useState<StoredUploadResponse[]>([]);
  const [caseFilePickerOpen, setCaseFilePickerOpen] =
    useState(false);
  const [caseFilePickerError, setCaseFilePickerError] =
    useState("");
  const [generatedDocumentMessage, setGeneratedDocumentMessage] =
    useState("");
  const [pendingFinalDocument, setPendingFinalDocument] =
    useState<{
      caseId: string;
      artifactId: string;
      format: LegalDocumentFormat;
    } | null>(null);
  const [finalDocumentPassword, setFinalDocumentPassword] =
    useState("");
  const [finalDocumentBusy, setFinalDocumentBusy] =
    useState(false);

  const [provider, setProvider] =
    useState<PrimaryModelSource>("local");
  const [providerConfiguration, setProviderConfiguration] = useState<
    Record<ProviderId, boolean | undefined>
  >({ openai: undefined, anthropic: undefined, xai: undefined });
  const [providerAccounts, setProviderAccounts] = useState<
    Record<
      ProviderId,
      ProviderAccountSessionStatus | undefined
    >
  >({
    openai: undefined,
    anthropic: undefined,
    xai: undefined
  });
  const [providerAccountBusy, setProviderAccountBusy] =
    useState(false);
  const [localStartBusy, setLocalStartBusy] =
    useState(false);
  const [localStartMessage, setLocalStartMessage] =
    useState("");
  const [providerAccountMessage, setProviderAccountMessage] =
    useState("");
  const [claudeOAuthToken, setClaudeOAuthTokenInput] =
    useState("");
  const [claudeOAuthBusy, setClaudeOAuthBusy] =
    useState(false);
  const [claudeOAuthMessage, setClaudeOAuthMessage] =
    useState("");
  const [providerApiKey, setProviderApiKeyInput] = useState("");
  const [providerKeyBusy, setProviderKeyBusy] = useState(false);
  const [providerKeyMessage, setProviderKeyMessage] = useState("");
  const [models, setModels] = useState<ModelDescriptor[]>([]);
  const [model, setModel] = useState("");
  const [modelError, setModelError] = useState("");
  const [
    modelCatalogLoading,
    setModelCatalogLoading
  ] = useState(false);
  const [
    localModelsRefreshToken,
    setLocalModelsRefreshToken
  ] = useState(0);
  const [
    localRuntimeStatus,
    setLocalRuntimeStatus
  ] = useState<
    LocalModelsResponse["runtime"] | null
  >(null);
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
  const [skills, setSkills] = useState<PublicSkillDescriptor[]>(
    FALLBACK_EXECUTION_SKILLS
  );
  // null = every optional execution skill is selected. This mirrors the DR
  // domain selector and makes newly discovered execution skills selected by
  // default without a second initialization race.
  const [manualSkills, setManualSkills] =
    useState<string[] | null>(null);
  const [
    deterministicAction,
    setDeterministicAction
  ] = useState<DeterministicActionId | "">("");
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
  const [executionDiagnostic, setExecutionDiagnostic] =
    useState<ExecutionDiagnostic | null>(null);
  const [executionStage, setExecutionStage] =
    useState("Przygotowanie sesji");
  const [executionElapsedSeconds, setExecutionElapsedSeconds] =
    useState(0);
  const [runtimePulse, setRuntimePulse] =
    useState<"CHECKING" | "OK" | "LOST">("CHECKING");
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
  const activeCaseIdRef =
    useRef(caseId);

  const matterCases = useMemo(
    () => cases.filter((item) => item.caseKind === "MATTER"),
    [cases]
  );
  const filteredMatterCases = useMemo(() => {
    const query =
      caseSearch
        .trim()
        .toLocaleLowerCase("pl");
    if (!query) {
      return matterCases;
    }
    const matches =
      matterCases.filter(
        (item) =>
          (
            item.displayName ||
            "Sprawa bez nazwy"
          )
            .toLocaleLowerCase("pl")
            .includes(query) ||
          item.caseId
            .toLocaleLowerCase("pl")
            .includes(query)
      );
    const selected =
      matterCases.find(
        (item) =>
          item.caseId ===
          caseId
      );
    if (
      selected &&
      !matches.some(
        (item) =>
          item.caseId ===
          selected.caseId
      )
    ) {
      return [
        selected,
        ...matches
      ];
    }
    return matches;
  }, [
    matterCases,
    caseSearch,
    caseId
  ]);
  const selectedCase = useMemo(
    () => matterCases.find((item) => item.caseId === caseId),
    [matterCases, caseId]
  );
  const runtimeProvider =
    runtimeProviderForPrimarySource(provider);
  const providerDefinition =
    PROVIDERS.find(
      (item) =>
        item.id ===
        runtimeProvider
    );
  const providerConfigured =
    providerConfiguration[runtimeProvider];
  const accountSession =
    providerAccounts[runtimeProvider];
  const accountAuthenticated =
    isAccountPrimarySource(provider) &&
    accountSession?.authenticated === true;
  const selectedModel = models.find((item) => item.id === model);
  const localModelReady =
    provider === "local" &&
    localRuntimeStatus?.state ===
      "READY" &&
    localRuntimeStatus
      .activeModelId === model;
  const localModelStarting =
    provider === "local" &&
    (
      localRuntimeStatus?.state ===
        "STARTING" ||
      localRuntimeStatus?.state ===
        "PROVISIONING"
    );
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
  const availableActions = useMemo(
    () =>
      DETERMINISTIC_ACTIONS.filter(
        (action) =>
          action.skills.every(
            (name) =>
              skills.some(
                (skill) =>
                  skill.name === name
              )
          )
      ),
    [skills]
  );
  const selectedDeterministicAction =
    useMemo(
      () =>
        DETERMINISTIC_ACTIONS.find(
          (action) =>
            action.id ===
            deterministicAction
        ) ?? null,
      [deterministicAction]
    );
  const selectableExecutionSkills = useMemo(
    () =>
      executionSkills.filter(
        (item) =>
          !MANDATORY_SKILLS.includes(
            item.name as (typeof MANDATORY_SKILLS)[number]
          ) &&
          item.name !== "prawo-polskie-v2"
      ),
    [executionSkills]
  );
  const manualSkillSelection = useMemo(
    () =>
      manualSkills ??
      selectableExecutionSkills.map(
        (item) => item.name
      ),
    [
      manualSkills,
      selectableExecutionSkills
    ]
  );
  const filteredSkills = useMemo(() => {
    const needle = skillFilter.trim().toLowerCase();
    return selectableExecutionSkills.filter(
      (item) =>
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.description?.toLowerCase().includes(needle)
    );
  }, [
    selectableExecutionSkills,
    skillFilter
  ]);
  useEffect(() => {
    setCaseTypeExecutionSkills(caseTypeSkills);
    return () => setCaseTypeExecutionSkills([]);
  }, [caseTypeSkills]);

  useEffect(() => {
    setDeterministicAction("");
    setCaseTypeSkills([]);
    setManualSkills(null);
    setAllowedDomains(null);
    setAutomaticSkills(true);
  }, [caseId]);

  useEffect(() => {
    if (threadLoading) {
      return;
    }
    const firstUser =
      messages.find(
        (message) =>
          message.role === "user"
      );
    if (!firstUser) {
      return;
    }
    const restored =
      deterministicActionFromMeta(
        firstUser.meta
      );
    setDeterministicAction(
      restored
    );
    setCaseTypeSkills(
      skillsForDeterministicAction(
        restored
      )
    );
    setAutomaticSkills(
      restored === ""
    );
  }, [
    messages,
    threadLoading
  ]);

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
      getProviderAccountStatus(),
      listCases(),
      getModelRoutingPreferences()
    ])
      .then(([
        health,
        routeList,
        providerStatus,
        accountStatus,
        caseList,
        routingPreferences
      ]) => {
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
        setProviderAccounts(
          Object.fromEntries(
            accountStatus.providers.map(
              (item) => [
                item.provider,
                item
              ]
            )
          ) as Record<
            ProviderId,
            ProviderAccountSessionStatus
          >
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

    void getSkills()
      .then((payload) => {
        if (
          !cancelled &&
          Array.isArray(payload.skills)
        ) {
          setSkills((current) =>
            mergeSkillCatalog(
              FALLBACK_EXECUTION_SKILLS,
              current,
              payload.skills
            )
          );
        }
      })
      .catch(() => {
        // The built-in execution catalog stays visible even when the runtime
        // skill registry is temporarily unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (routes.length === 0) {
      return;
    }
    setSkills((current) =>
      mergeSkillCatalog(
        FALLBACK_EXECUTION_SKILLS,
        current,
        routes.map((name) => ({
          name,
          category: "domain"
        }))
      )
    );
  }, [routes]);

  useEffect(() => {
    const refreshLocalModels = () => {
      setLocalModelsRefreshToken(
        (value) => value + 1
      );
    };
    window.addEventListener(
      "lex-local-models-changed",
      refreshLocalModels
    );
    return () => {
      window.removeEventListener(
        "lex-local-models-changed",
        refreshLocalModels
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setModels([]);
    setModel("");
    setModelError("");
    setModelCatalogLoading(true);

    if (
      isAccountPrimarySource(
        provider
      )
    ) {
      const accountModelId =
        accountModelIdForPrimarySource(
          provider
        );
      if (accountModelId) {
        const authenticated =
          accountSession
            ?.authenticated === true;
        setModels([
          {
            provider:
              runtimeProvider,
            id:
              accountModelId,
            displayName:
              ACCOUNT_MODEL_LABELS[
                runtimeProvider
              ],
            selectable:
              authenticated,
            ownedBy:
              "account-session",
            capabilities: [
              "account-session",
              "lex-runtime-tools"
            ]
          }
        ]);
        setModel(
          accountModelId
        );
        if (
          accountSession &&
          !accountSession.installed
        ) {
          setModelError(
            "ACCOUNT_SESSION_CLI_NOT_INSTALLED"
          );
        } else if (
          !authenticated
        ) {
          setModelError(
            "ACCOUNT_SESSION_NOT_AUTHENTICATED"
          );
        }
      }
      setModelCatalogLoading(false);
      return () => {
        cancelled = true;
      };
    }

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
      setModelCatalogLoading(false);
      return () => {
        cancelled = true;
      };
    }
    const loadModels =
      provider === "local"
        ? getLocalModels().then(
            (response) => {
              if (!cancelled) {
                setLocalRuntimeStatus(
                  response.runtime
                );
              }
              return {
              models:
                response.models
                  .filter(
                    (item) =>
                      item.installed
                  )
                  .map<ModelDescriptor>(
                    (item) => ({
                      provider:
                        "openai",
                      id:
                        item.id,
                      displayName:
                        `Lokalny · ${item.displayName}`,
                      selectable:
                        true,
                      contextWindow:
                        item.configuredContextWindow ??
                        item.contextWindow,
                      nativeContextWindow:
                        item.nativeContextWindow,
                      contextMode:
                        item.contextMode,
                      ownedBy:
                        "local",
                      inputModalities:
                        ["text"],
                      outputModalities:
                        ["text"],
                      capabilities: [
                        "local-only",
                        "offline-inference",
                        item.configuredContextWindow !==
                          undefined
                          ? "qualified-profile"
                          : "installed-profile-recovery"
                      ]
                    })
                  )
              };
            }
          )
        : getModels(
            runtimeProvider
          );

    void loadModels
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
        setModelCatalogLoading(false);
      })
      .catch((error) => {
        if (!cancelled) {
          setModelError(error instanceof Error ? error.message : String(error));
          setModelCatalogLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [
    provider,
    providerConfigured,
    runtimeProvider,
    accountSession,
    localModelsRefreshToken
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
    providerConfiguration,
    localModelsRefreshToken
  ]);

  useEffect(() => {
    setDocumentDropQueue(createDocumentDropQueueState());
    setDocumentAttachments([]);
    setIncludeCaseKnowledge(false);
    setCaseNameDraft(selectedCase?.displayName ?? "");
    setDeletePhrase("");
    setDeletePassword("");
    setPendingFinalDocument(null);
    setFinalDocumentPassword("");
    setProcessWorkflowVisible(false);
    setProcessWorkflowRefresh((value) => value + 1);
  }, [caseId, selectedCase?.displayName]);

  useEffect(() => {
    activeCaseIdRef.current =
      caseId;
  }, [caseId]);

  useEffect(() => {
    let cancelled = false;
    setCaseFilePickerOpen(false);
    setCaseFilePickerError("");
    if (!caseId) {
      setCaseFiles([]);
      return;
    }

    void listCaseFiles(caseId)
      .then((result) => {
        if (!cancelled) {
          setCaseFiles(
            result.uploads
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setCaseFiles([]);
          setCaseFilePickerError(
            error instanceof Error
              ? error.message
              : String(error)
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [caseId, workspaceRefresh]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, executing]);

  useEffect(() => {
    if (!settingsRequest) {
      return;
    }
    setActiveTab("settings");
    setSettingsSection(
      settingsRequest.section
    );
  }, [
    settingsRequest?.nonce,
    settingsRequest?.section
  ]);

  useEffect(() => {
    if (!executing) {
      setExecutionElapsedSeconds(0);
      setRuntimePulse("CHECKING");
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();

    const tick = () => {
      if (!cancelled) {
        setExecutionElapsedSeconds(
          Math.max(
            0,
            Math.floor(
              (Date.now() - startedAt) /
                1000
            )
          )
        );
      }
    };

    const probeRuntime = async () => {
      try {
        await getHealth();
        if (!cancelled) {
          setRuntimePulse("OK");
        }
      } catch {
        if (!cancelled) {
          setRuntimePulse("LOST");
        }
      }
    };

    tick();
    void probeRuntime();
    const clock = window.setInterval(
      tick,
      1000
    );
    const heartbeat =
      window.setInterval(
        () => {
          void probeRuntime();
        },
        4000
      );

    return () => {
      cancelled = true;
      window.clearInterval(clock);
      window.clearInterval(
        heartbeat
      );
    };
  }, [executing]);

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

  function switchToCase(
    nextCaseId: string
  ): void {
    if (
      caseBusy ||
      !nextCaseId ||
      nextCaseId === caseId
    ) {
      return;
    }
    setPendingFirstMessage(null);
    setExecutionError("");
    setGeneratedDocumentMessage("");
    setPendingFinalDocument(null);
    setFinalDocumentPassword("");
    setCaseFilePickerOpen(false);
    setCaseId(nextCaseId);
    setActiveTab("chat");
  }

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
    setManualSkills((current) => {
      const selected =
        current ??
        selectableExecutionSkills.map(
          (item) => item.name
        );
      return selected.includes(name)
        ? selected.filter(
            (item) => item !== name
          )
        : [
            ...selected,
            name
          ];
    });
  }

  function selectAllManualSkills(): void {
    setManualSkills(null);
  }

  function clearManualSkills(): void {
    setManualSkills([]);
  }

  function selectAllDomainSkills(): void {
    setAllowedDomains(null);
  }

  function clearDomainSkills(): void {
    setAllowedDomains([]);
  }

  function selectAllSkills(): void {
    selectAllDomainSkills();
    selectAllManualSkills();
  }

  function clearAllSkills(): void {
    clearDomainSkills();
    clearManualSkills();
  }

  function toggleDomainSkill(name: string): void {
    setAllowedDomains((current) => {
      const selected = current ?? routes;
      return selected.includes(name)
        ? selected.filter((item) => item !== name)
        : [...selected, name];
    });
  }

  function selectDeterministicAction(
    actionId:
      DeterministicActionId | ""
  ): void {
    const mappedSkills =
      skillsForDeterministicAction(
        actionId
      );
    setDeterministicAction(
      actionId
    );
    setCaseTypeSkills(
      mappedSkills
    );
    // Keep the non-React routing bridge in sync immediately. This prevents a
    // click+send race on the first turn before useEffect has a chance to run.
    setCaseTypeExecutionSkills(
      mappedSkills
    );
    // No action = full router-controlled AUTO. A selected action pins the
    // execution pipeline programmatically; the router still selects DR domains.
    setAutomaticSkills(
      actionId === ""
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

  async function refreshProviderAccountStatus(): Promise<void> {
    const result =
      await getProviderAccountStatus();
    setProviderAccounts(
      Object.fromEntries(
        result.providers.map(
          (item) => [
            item.provider,
            item
          ]
        )
      ) as Record<
        ProviderId,
        ProviderAccountSessionStatus
      >
    );
  }

  function switchAccountToApi(): void {
    setProvider(
      runtimeProvider
    );
    setProviderApiKeyInput("");
    setProviderKeyMessage("");
    setProviderAccountMessage(
      "Przełączono na kanał API. Wklej klucz dostawcy; w aplikacji desktopowej możesz zapisać go w systemowym magazynie poświadczeń."
    );
    setActiveTab("settings");
    setSettingsSection("models");
  }

  async function openAccountClientSetup(): Promise<void> {
    if (
      !providerDefinition
    ) {
      return;
    }
    try {
      await openExternalUrl(
        providerDefinition
          .accountInstallUrl
      );
    } catch (error) {
      setProviderAccountMessage(
        error instanceof Error
          ? error.message
          : String(error)
      );
    }
  }

  async function connectProviderAccount(): Promise<boolean> {
    if (
      !isAccountPrimarySource(
        provider
      ) ||
      user.appRole !== "ADMIN" ||
      providerAccountBusy
    ) {
      return false;
    }
    setProviderAccountBusy(true);
    setProviderAccountMessage(
      isDesktopShell()
        ? "Otwieram widoczne okno oficjalnego logowania dostawcy. Dokończ logowanie w tym oknie lub w uruchomionej przez nie przeglądarce…"
        : "Otwieram oficjalne logowanie dostawcy…"
    );
    try {
      const status =
        await loginProviderAccount(
          runtimeProvider
        );
      setProviderAccounts(
        (current) => ({
          ...current,
          [runtimeProvider]:
            status
        })
      );
      setProviderAccountMessage(
        status.authenticated
          ? "Konto połączone. Lex Machina automatycznie wznowi zapamiętaną lub ostatnią sesję hosta; jeśli jej nie ma, utworzy nową."
          : "Logowanie zakończone, ale klient nie potwierdził aktywnej sesji."
      );
      return status.authenticated;
    } catch (error) {
      const code =
        error instanceof ApiError
          ? error.code
          : error instanceof Error
            ? error.message
            : String(error);
      setProviderAccountMessage(
        code ===
          "ACCOUNT_SESSION_SUBSCRIPTION_LOGIN_REQUIRED"
          ? "Claude Code nie potwierdził aktywnego logowania do subskrypcji Claude. Program używa wyłącznie sesji Claude.ai/Pro/Max i nie przełącza tego kanału na rozliczane API."
          : code ===
              "ACCOUNT_SESSION_CLI_NOT_INSTALLED"
            ? "Nie znaleziono oficjalnego klienta tego dostawcy. Zainstaluj klienta z oficjalnej instrukcji albo przełącz źródło na API."
            : code
      );
      await refreshProviderAccountStatus()
        .catch(() => {});
      return false;
    } finally {
      setProviderAccountBusy(false);
    }
  }

  async function saveClaudeOAuthToken(): Promise<void> {
    if (
      provider !==
        "anthropic-account" ||
      user.appRole !==
        "ADMIN" ||
      !claudeOAuthToken.trim()
    ) {
      return;
    }
    setClaudeOAuthBusy(true);
    setClaudeOAuthMessage("");
    try {
      await setClaudeOAuthToken(
        claudeOAuthToken,
        isDesktopShell()
          ? "OS_KEYRING"
          : "PROCESS_MEMORY"
      );
      setClaudeOAuthTokenInput("");
      await refreshProviderAccountStatus();
      setClaudeOAuthMessage(
        isDesktopShell()
          ? "Token OAuth Claude zapisano w systemowym magazynie poświadczeń."
          : "Token OAuth Claude jest aktywny w pamięci procesu."
      );
    } catch (error) {
      setClaudeOAuthMessage(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setClaudeOAuthBusy(false);
    }
  }

  async function removeClaudeOAuthToken(): Promise<void> {
    if (
      user.appRole !==
        "ADMIN"
    ) {
      return;
    }
    setClaudeOAuthBusy(true);
    setClaudeOAuthMessage("");
    try {
      await clearClaudeOAuthToken();
      await refreshProviderAccountStatus();
      setClaudeOAuthMessage(
        "Token OAuth Claude został usunięty."
      );
    } catch (error) {
      setClaudeOAuthMessage(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setClaudeOAuthBusy(false);
    }
  }

  async function saveApiKey(): Promise<void> {
    if (
      provider === "local" ||
      isAccountPrimarySource(
        provider
      ) ||
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
      isAccountPrimarySource(
        provider
      ) ||
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

  async function prepareLocalPrimaryModel():
    Promise<string | null> {
    if (
      provider !== "local" ||
      !model.startsWith("local/")
    ) {
      return null;
    }

    const codeOf = (
      error: unknown
    ): string =>
      error instanceof ApiError
        ? error.code
        : error instanceof Error
          ? error.message
          : String(error);

    try {
      const started =
        await startLocalModel(
          model
        );
      setLocalRuntimeStatus(
        started.runtime
      );
      setModelError("");
      return null;
    } catch (initialError) {
      if (
        user.appRole !==
          "ADMIN"
      ) {
        return (
          "Lokalny model wymaga naprawy profilu. " +
          "Poproś administratora aplikacji o uruchomienie naprawy lokalnej AI. " +
          `Kod: ${codeOf(initialError)}`
        );
      }

      setModelError(
        "Przygotowuję i weryfikuję lokalny model…"
      );

      try {
        let snapshot =
          await getLocalModels();
        let local =
          snapshot.models.find(
            (item) =>
              item.id === model
          );
        if (!local) {
          throw new Error(
            "LOCAL_MODEL_NOT_FOUND"
          );
        }

        const preferredContext =
          local
            .configuredContextWindow ??
          local.contextWindow;

        if (
          snapshot.runtime
            .configured &&
          snapshot.runtime
            .selectedModelId ===
            model
        ) {
          try {
            await repairLocalModel();
          } catch {
            await provisionLocalModel(
              model,
              preferredContext
            );
          }
        } else {
          await provisionLocalModel(
            model,
            preferredContext
          );
        }

        try {
          const started =
            await startLocalModel(
              model
            );
          setLocalRuntimeStatus(
            started.runtime
          );
        } catch (startError) {
          snapshot =
            await getLocalModels();
          local =
            snapshot.models.find(
              (item) =>
                item.id === model
            );
          if (!local) {
            throw startError;
          }

          const activeContext =
            local
              .configuredContextWindow ??
            local.contextWindow;
          const fallbackContext =
            local
              .minimumContextWindow;

          if (
            fallbackContext >=
              activeContext
          ) {
            throw startError;
          }

          // 128k remains the preferred default. This fallback is used only
          // after the qualified profile cannot start on the current machine.
          await provisionLocalModel(
            model,
            fallbackContext
          );
          const started =
            await startLocalModel(
              model
            );
          setLocalRuntimeStatus(
            started.runtime
          );
        }

        setLocalModelsRefreshToken(
          (value) => value + 1
        );
        setModelError("");
        return null;
      } catch (recoveryError) {
        const code =
          codeOf(
            recoveryError
          );
        setModelError(code);
        return (
          "Nie udało się uruchomić lokalnego modelu nawet po automatycznej naprawie profilu. " +
          `Kod: ${code}`
        );
      }
    }
  }

  async function startSelectedLocalModel():
    Promise<void> {
    if (
      provider !== "local" ||
      !model.startsWith("local/") ||
      localStartBusy ||
      executing
    ) {
      return;
    }
    setLocalStartBusy(true);
    setLocalStartMessage(
      "Uruchamiam lokalny model…"
    );
    try {
      const failure =
        await prepareLocalPrimaryModel();
      if (failure) {
        setLocalStartMessage(
          failure
        );
        return;
      }
      const snapshot =
        await getLocalModels();
      setLocalRuntimeStatus(
        snapshot.runtime
      );
      setLocalStartMessage(
        snapshot.runtime.state ===
            "READY" &&
          snapshot.runtime
            .activeModelId === model
          ? "Lokalny model działa."
          : "Runtime odpowiedział, ale model nie osiągnął stanu READY."
      );
    } catch (error) {
      setLocalStartMessage(
        error instanceof Error
          ? error.message
          : String(error)
      );
    } finally {
      setLocalStartBusy(false);
    }
  }

  async function executeMessage(plain: string): Promise<void> {
    const trimmed =
      plain.trim();
    if (
      executing ||
      !trimmed ||
      !caseId ||
      selectedCase?.archivedAt ||
      !runtimeOnline ||
      !model
    ) return;

    const route =
      automaticSkills
        ? "AUTO"
        : choosePrimaryRoute(
            trimmed,
            routes,
            skills,
            []
          );
    if (!route) {
      setExecutionError(
        "Nie udało się wybrać dziedziny głównej dla tej wiadomości."
      );
      return;
    }

    const priorMessages =
      messages;
    const userMessage:
      CaseChatMessage = {
        id: messageId(),
        role: "user",
        content: trimmed,
        ...(conversationIsNew
          ? {
              meta:
                deterministicActionMeta(
                  deterministicAction
                )
            }
          : {})
      };

    // Optimistic UI: move the message into the thread immediately. Provider
    // login/model startup/repair happens only after the user sees what was sent.
    setMessages((current) => [
      ...current,
      userMessage
    ]);
    const executionCaseId =
      caseId;

    setQuery("");
    setExecuting(true);
    setExecutionStage(
      "Przygotowanie sesji"
    );
    setExecutionError("");
    setExecutionDiagnostic(null);
    setGeneratedDocumentMessage("");

    try {
      let readyAccount =
        accountAuthenticated;
      if (
        isAccountPrimarySource(
          provider
        ) &&
        !readyAccount
      ) {
        setExecutionStage(
          "Łączenie konta modelu"
        );
        const connected =
          await connectProviderAccount();
        if (!connected) {
          throw new Error(
            accountSession?.installed ===
              false
              ? "ACCOUNT_SESSION_CLI_NOT_INSTALLED"
              : user.appRole === "ADMIN"
                ? "ACCOUNT_SESSION_LOGIN_NOT_CONFIRMED"
                : "ACCOUNT_SESSION_LOGIN_ADMIN_REQUIRED"
          );
        }
        readyAccount = true;
      }

      if (
        !canExecutePrimaryModel(
          providerConfigured,
          model,
          readyAccount
        )
      ) {
        throw new Error(
          "PRIMARY_MODEL_NOT_READY"
        );
      }

      setExecutionStage(
        provider === "local"
          ? "Przygotowanie modelu lokalnego"
          : "Sprawdzanie gotowości modelu"
      );
      const localPreparationError =
        await prepareLocalPrimaryModel();
      if (localPreparationError) {
        throw new Error(
          localPreparationError
        );
      }

      const documentRequest =
        directDocumentRequest(
          trimmed
        );
      if (
        documentRequest &&
        caseId
      ) {
        setExecutionStage(
          "Tworzenie dokumentu i weryfikacja źródeł"
        );
        const generated =
          await generateLegalDocument(
            executionCaseId,
            {
              query:
                buildSkillSelectionEnvelope(
                  conversationForProvider(
                    priorMessages,
                    trimmed
                  ),
                  automaticSkills,
                  [],
                  manualSkills === null
                    ? null
                    : manualSkillSelection
                ),
              provider:
                runtimeProvider,
              model,
              primarySkill:
                route,
              mode:
                "PRAWNIK",
              format:
                documentRequest
                  .format,
              documentType:
                documentRequest
                  .documentType,
              styleProfile:
                "lex-classic-clean-v1",
              attachments:
                documentAttachments,
              filename:
                (
                  documentRequest.documentType ===
                    "letter"
                    ? "LexMachina-pismo"
                    : documentRequest.documentType ===
                        "pleading"
                      ? "LexMachina-pismo-procesowe"
                      : documentRequest.documentType ===
                          "contract"
                        ? "LexMachina-umowa"
                        : documentRequest.documentType ===
                            "opinion"
                          ? "LexMachina-opinia"
                          : documentRequest.documentType ===
                              "report"
                            ? "LexMachina-raport"
                            : "LexMachina-dokument"
                ) +
                "." +
                documentRequest.format
            }
          );

        const downloadedFinal =
          generated
            .readyForDownload ===
            true;

        if (downloadedFinal) {
          const blob =
            await downloadGeneratedArtifact(
              executionCaseId,
              generated
                .artifact
                .artifactId
            );
          downloadBlob(
            blob,
            generated
              .artifact
              .filename
          );
        }

        if (
          activeCaseIdRef.current ===
            executionCaseId
        ) {
          setPendingFinalDocument(
            downloadedFinal
              ? null
              : {
                  caseId:
                    executionCaseId,
                  artifactId:
                    generated
                      .artifact
                      .artifactId,
                  format:
                    generated
                      .format
                }
          );
          setFinalDocumentPassword("");
          setMessages(
            (
              current
            ) => [
              ...current,
              {
                id:
                  messageId(),
                role:
                  "assistant",
                content:
                  downloadedFinal
                    ? "Gotowy dokument został przygotowany w profesjonalnym układzie i pobrany jako " +
                      documentRequest
                        .format
                        .toUpperCase() +
                      "."
                    : "Dokument został przygotowany jako bezpieczna wersja tokenizowana " +
                      documentRequest
                        .format
                        .toUpperCase() +
                      ". Aby utworzyć finalny plik, użyj poniżej jednorazowej reautoryzacji. Lex Machina odwróci wyłącznie aliasy z vaultów dokumentów użytych do tego pisma.",
                meta:
                  "dokument: " +
                  generated
                    .artifact
                    .filename
              }
            ]
          );
          setGeneratedDocumentMessage(
            downloadedFinal
              ? "Dokument gotowy i pobrany."
              : "Wersja tokenizowana jest zapisana w aktach. Finalizacja czeka na jednorazową reautoryzację."
          );
          setWorkspaceRefresh(
            (value) =>
              value + 1
          );
        }
        return;
      }

      setExecutionStage(
        "Analiza prawna, routing i weryfikacja źródeł"
      );
      const result = await executeSession({
        query: buildSkillSelectionEnvelope(
          conversationForProvider(
            priorMessages,
            trimmed
          ),
          automaticSkills,
          [],
          manualSkills === null
            ? null
            : manualSkillSelection
        ),
        provider: runtimeProvider,
        model,
        auxiliaryText:
          trimmed,
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

      setExecutionStage(
        "Finalizacja odpowiedzi"
      );
      if (result.processWorkflow) {
        setProcessWorkflowVisible(true);
        setProcessWorkflowRefresh(
          (value) => value + 1
        );
      }
      if (
        activeCaseIdRef.current ===
          executionCaseId
      ) {
        setMessages((current) => [
          ...current,
          executionMessage(
            result,
            route
          )
        ]);
      }
    } catch (error) {
      const code =
        error instanceof ApiError
          ? error.code
          : error instanceof Error
            ? error.message
            : String(error);
      const reason =
        error instanceof ApiError
          ? error.reason
          : undefined;
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
        code ===
          "ACCOUNT_SESSION_CLI_NOT_INSTALLED"
          ? "Tryb konta wymaga oficjalnego klienta dostawcy zainstalowanego osobno. Otwórz Ustawienia → Modele i AI, zainstaluj klienta albo przełącz źródło na API."
        : code ===
            "ACCOUNT_SESSION_LOGIN_NOT_CONFIRMED"
          ? "Nie udało się potwierdzić logowania do wybranego konta. Zakończ oficjalne logowanie w widocznym terminalu lub przeglądarce i spróbuj ponownie."
        : code ===
            "ACCOUNT_SESSION_LOGIN_ADMIN_REQUIRED"
          ? "Wybrane konto dostawcy nie jest zalogowane. Połączenie konta wymaga administratora aplikacji."
        : code ===
            "PRIMARY_MODEL_NOT_READY"
          ? "Wybrany model nie jest jeszcze gotowy do użycia."
        : code === "PROVIDER_NOT_CONFIGURED"
          ? "Brak lokalnego klucza API dla wybranego dostawcy."
          : code === "CHAT_PRIVACY_GATE_FAILED"
            ? "Lokalna pseudonimizacja nie mogła się wykonać, więc zapytanie zostało zatrzymane przed wysłaniem do modelu. Sprawdź lokalny runtime prywatności w panelu Utrzymanie."
          : code === "LOCAL_MODEL_EXECUTION_FAILED"
            ? localModelFailureMessage(
                reason
              )
          : code === "PROVIDER_EXECUTION_FAILED"
            ? provider === "local"
              ? localModelFailureMessage(
                  reason
                )
              : providerFailureMessage(
                  provider,
                  reason
                )
          : code ===
              "AUTO_ROUTING_FAILED"
            ? `Model nie zwrócił poprawnego wyboru domeny i skilli w trybie AUTO${reason ? ` (kod: ${reason})` : ""}. Lex Machina nie zgaduje routingu zastępczego.`
          : code ===
              "LEGAL_WORKFLOW_EXECUTION_FAILED"
            ? `Deterministyczny workflow prawny zatrzymał wykonanie${
                reason
                  ? ` na etapie: ${reason}`
                  : ""
              }.`
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
                                : code.startsWith(
                                    "Nie udało się uruchomić lokalnego modelu"
                                  ) ||
                                  code.startsWith(
                                    "Lokalny model wymaga naprawy profilu"
                                  )
                                  ? code
                                  : `Nie udało się wykonać sesji: ${code}`;
      setExecutionError(friendly);
      setExecutionDiagnostic({
        friendly,
        code,
        ...(error instanceof ApiError
          ? {
              status:
                error.status,
              ...(error.reason
                ? {
                    reason:
                      error.reason
                  }
                : {}),
              ...(error.description
                ? {
                    description:
                      error.description
                  }
                : {}),
              ...(error.stage
                ? {
                    stage:
                      error.stage
                  }
                : {}),
              ...(error.trace
                ? {
                    trace:
                      error.trace
                  }
                : {})
            }
          : {
              description:
                error instanceof Error
                  ? `${error.name}: ${error.message}`
                  : String(error)
            })
      });
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "system",
          content:
            friendly
        }
      ]);
    } finally {
      // Restore the persistent DR bridge after a zero-selection turn.
      if (
        allowedDomains !== null &&
        allowedDomains.length === 0
      ) {
        setAllowedDomainSkills([]);
      }
      setExecuting(false);
    }
  }

  async function finalizePendingDocument(): Promise<void> {
    if (
      !pendingFinalDocument ||
      finalDocumentBusy ||
      !finalDocumentPassword
        .trim()
    ) {
      return;
    }

    setFinalDocumentBusy(true);
    setExecutionError("");
    try {
      const intent =
        await createDeanonymizationIntent(
          pendingFinalDocument
            .caseId,
          pendingFinalDocument
            .artifactId
        );
      const authorized =
        await reauthorizeDeanonymization(
          intent.intent
            .intentId,
          finalDocumentPassword
        );
      const final =
        await finalizeDeanonymization(
          authorized.grant
            .grantId,
          "LexMachina-final." +
            pendingFinalDocument
              .format
        );
      if (
        !final.downloadTicket
      ) {
        throw new Error(
          "SENSITIVE_DOWNLOAD_TICKET_MISSING"
        );
      }
      const blob =
        await downloadSensitiveArtifact(
          final.downloadTicket
            .ticketId
        );
      downloadBlob(
        blob,
        final.artifact
          .filename
      );
      setPendingFinalDocument(
        null
      );
      setFinalDocumentPassword(
        ""
      );
      setGeneratedDocumentMessage(
        "Finalny dokument z przywróconymi danymi został utworzony i pobrany."
      );
      setWorkspaceRefresh(
        (value) =>
          value + 1
      );
    } catch (error) {
      setExecutionError(
        error instanceof Error
          ? "Nie udało się przywrócić danych do finalnego dokumentu: " +
            error.message
          : "Nie udało się przywrócić danych do finalnego dokumentu."
      );
    } finally {
      setFinalDocumentBusy(
        false
      );
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

  const accountCanLoginInline =
    isAccountPrimarySource(
      provider
    ) &&
    user.appRole === "ADMIN" &&
    accountSession?.installed !== false;

  const canSend =
    runtimeOnline &&
    (
      canExecutePrimaryModel(
        providerConfigured,
        model,
        accountAuthenticated
      ) ||
      accountCanLoginInline
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
            <strong>Sprawy</strong>
            <button
              type="button"
              disabled={caseBusy}
              onClick={() => void createLocalCase(newCaseName.trim() || "Nowa sprawa")}
            >
              + Nowa sprawa
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
                disabled={caseBusy}
                className={item.caseId === caseId ? "matter-thread active" : "matter-thread"}
                onClick={() => {
                  setPendingFirstMessage(null);
                  setExecutionError("");
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
            ["settings", "Ustawienia"]
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
          <span>
            {selectedDeterministicAction
              ? selectedDeterministicAction.label
              : AUTO_CASE_TYPE}
          </span>
        </div>

        <div className="chat-account-card">
          <div className="chat-account-identity">
            <strong>
              {user.displayName}
            </strong>
            <small>
              @{user.loginName} · {user.appRole}
            </small>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab("settings");
              setSettingsSection(
                "security"
              );
            }}
          >
            Ustawienia
          </button>
          <div className="chat-account-actions">
            <button
              type="button"
              onClick={onLock}
              disabled={!onLock}
            >
              Zablokuj
            </button>
            <button
              type="button"
              onClick={onLogout}
              disabled={!onLogout}
            >
              Wyloguj
            </button>
          </div>
        </div>
      </aside>

      <main className="chat-main">
        {activeTab === "chat" ? (
          <section
            className="chat-model-dock"
            aria-label="Aktywny model rozmowy"
          >
            <div className="chat-model-dock-status">
              <span
                className={
                  provider === "local"
                    ? localModelReady
                      ? "chat-dot online"
                      : localModelStarting
                        ? "chat-dot starting"
                        : "chat-dot offline"
                    : runtimeOnline
                      ? "chat-dot online"
                      : "chat-dot offline"
                }
              />
              <div>
                <strong>
                  {selectedModel?.displayName ??
                    (provider === "local"
                      ? "Model lokalny"
                      : "Wybierz model")}
                </strong>
                <small>
                  {provider === "local"
                    ? localModelReady
                      ? "lokalny model · działa"
                      : localModelStarting
                        ? "lokalny model · uruchamianie"
                        : localRuntimeStatus
                          ? "lokalny model · zatrzymany"
                          : "lokalny model · sprawdzanie stanu"
                    : PRIMARY_MODEL_SOURCES.find(
                        (item) =>
                          item.id ===
                          provider
                      )?.label ??
                      provider}
                </small>
              </div>
            </div>
            <div className="chat-model-dock-controls">
              <select
                aria-label="Źródło modelu głównego"
                value={provider}
                disabled={executing}
                onChange={(event) => {
                  setProvider(
                    event.target.value as PrimaryModelSource
                  );
                  setProviderApiKeyInput("");
                  setProviderKeyMessage("");
                  setProviderAccountMessage("");
                  setLocalStartMessage("");
                }}
              >
                {PRIMARY_MODEL_SOURCES.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
              <select
                aria-label="Model główny"
                value={model}
                disabled={
                  executing ||
                  modelCatalogLoading ||
                  models.length === 0
                }
                onChange={(event) => {
                  setModel(
                    event.target.value
                  );
                  setLocalStartMessage("");
                }}
              >
                {modelCatalogLoading ? (
                  <option value="">
                    Odświeżam modele…
                  </option>
                ) : models.length === 0 ? (
                  <option value="">
                    {provider === "local"
                      ? "Brak zainstalowanego modelu"
                      : "Brak modeli"}
                  </option>
                ) : null}
                {models.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    disabled={
                      !item.selectable
                    }
                  >
                    {item.displayName}
                  </option>
                ))}
              </select>
              {provider === "local" ? (
                <button
                  type="button"
                  className="chat-primary-action chat-model-start"
                  disabled={
                    executing ||
                    localStartBusy ||
                    localModelReady ||
                    !model.startsWith(
                      "local/"
                    )
                  }
                  onClick={() =>
                    void startSelectedLocalModel()
                  }
                >
                  {localStartBusy ||
                  localModelStarting
                    ? "Uruchamianie…"
                    : localModelReady
                      ? "Model uruchomiony"
                      : "Uruchom lokalny model"}
                </button>
              ) : isAccountPrimarySource(
                  provider
                ) &&
                !accountAuthenticated ? (
                <button
                  type="button"
                  className="chat-secondary-action"
                  disabled={
                    executing ||
                    providerAccountBusy ||
                    user.appRole !==
                      "ADMIN"
                  }
                  onClick={() =>
                    accountSession
                      ?.installed ===
                    false
                      ? void openAccountClientSetup()
                      : void connectProviderAccount()
                  }
                >
                  {providerAccountBusy
                    ? "Logowanie…"
                    : accountSession
                        ?.installed ===
                      false
                      ? "Zainstaluj klienta ↗"
                      : "Połącz konto"}
                </button>
              ) : null}
              <button
                type="button"
                className="chat-secondary-action"
                onClick={() => {
                  setActiveTab(
                    "settings"
                  );
                  setSettingsSection(
                    "models"
                  );
                }}
              >
                Zarządzaj modelami
              </button>
            </div>
            {localStartMessage ? (
              <small
                className={
                  localStartMessage ===
                  "Lokalny model działa."
                    ? "chat-model-dock-message ready"
                    : "chat-model-dock-message"
                }
              >
                {localStartMessage}
              </small>
            ) : null}
          </section>
        ) : null}
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
                        : "Ustawienia"}
            </h1>
          </div>
          <div className="chat-header-actions">
            <div className="chat-case-switcher">
              <label className="chat-case-search">
                <span>Szukaj spraw</span>
                <input
                  type="search"
                  value={caseSearch}
                  placeholder="Nazwa lub ID sprawy"
                  aria-label="Szukaj spraw"
                  onChange={(event) =>
                    setCaseSearch(
                      event.target.value
                    )
                  }
                />
              </label>
              <label>
                <span>Sprawa</span>
                <select
                  aria-label="Wybierz sprawę"
                  value={caseId}
                  disabled={
                    caseBusy
                  }
                  onChange={(event) =>
                    switchToCase(
                      event.target
                        .value
                    )
                  }
                >
                  {filteredMatterCases.map(
                    (item) => (
                      <option
                        key={
                          item.caseId
                        }
                        value={
                          item.caseId
                        }
                      >
                        {item.displayName ||
                          "Sprawa bez nazwy"}
                        {item.archivedAt
                          ? " · archiwalna"
                          : ""}
                      </option>
                    )
                  )}
                </select>
                {caseSearch.trim() ? (
                  <small className="chat-case-search-count">
                    {Math.max(
                      0,
                      filteredMatterCases.length -
                        (
                          filteredMatterCases.some(
                            (item) =>
                              item.caseId ===
                                caseId &&
                              !(item.displayName ||
                                "Sprawa bez nazwy")
                                .toLocaleLowerCase(
                                  "pl"
                                )
                                .includes(
                                  caseSearch
                                    .trim()
                                    .toLocaleLowerCase(
                                      "pl"
                                    )
                                )
                          )
                            ? 1
                            : 0
                        )
                    )} wyników
                  </small>
                ) : null}
              </label>
              <button
                type="button"
                className="chat-secondary-action"
                disabled={
                  caseBusy
                }
                onClick={() =>
                  void createLocalCase(
                    newCaseName
                      .trim() ||
                      "Nowa sprawa"
                  )
                }
              >
                + Nowa sprawa
              </button>
            </div>
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

        {Array.from(
          new Set(
            [runtimeError, caseError, threadError]
              .filter(Boolean)
          )
        ).map((error) => (
          <div key={error} className="chat-alert chat-alert-error">
            {error === "CASE_ACCESS_DENIED"
              ? "Nie udało się otworzyć tej sprawy w bieżącej sesji. Wybierz inną sprawę albo utwórz nową."
              : error}
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
            {conversationIsNew && availableActions.length > 0 ? (
              <section
                className="chat-pipeline-picker"
                aria-label="Typ działania dla pierwszej wiadomości"
              >
                <div>
                  <p className="eyebrow">Typ działania</p>
                  <h3>
                    {selectedDeterministicAction
                      ? selectedDeterministicAction.label
                      : "Automatycznie — prawny router"}
                  </h3>
                  <p>
                    Brak wyboru oznacza pełny tryb automatyczny: prawny-router-v3
                    dobiera dziedziny DR i skille wykonawcze z treści wiadomości.
                    Wybranie działania uruchamia stałe, programistyczne mapowanie
                    na właściwy pipeline wykonawczy. Po wysłaniu pierwszej
                    wiadomości ten wybór znika i zostaje przypięty do wątku.
                  </p>
                </div>
                <div className="chat-pipeline-options">
                  {availableActions.map((action) => {
                    const checked =
                      deterministicAction ===
                      action.id;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        className={
                          checked
                            ? "chat-pipeline-option selected"
                            : "chat-pipeline-option"
                        }
                        aria-pressed={checked}
                        onClick={() =>
                          selectDeterministicAction(
                            checked
                              ? ""
                              : action.id
                          )
                        }
                      >
                        <strong>
                          {action.label}
                        </strong>
                        <small>
                          {action.description}
                        </small>
                      </button>
                    );
                  })}
                  {deterministicAction ? (
                    <button
                      type="button"
                      className="chat-pipeline-option reset"
                      onClick={() =>
                        selectDeterministicAction("")
                      }
                    >
                      Bez wyboru · AUTO
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
                    onOpenUrl={openExternalUrl}
                  />
                  {visibleMessageMeta(message.meta) ? (
                    <small className="chat-message-meta">
                      {visibleMessageMeta(message.meta)}
                    </small>
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
                              <a
                                className="source-inline-link"
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) => {
                                  event.preventDefault();
                                  void openExternalUrl(item.sourceUrl!);
                                }}
                              >
                                Otwórz źródło w przeglądarce ↗
                              </a>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </article>
              ))}
              {executing ? (
                <article
                  className="chat-message chat-message-assistant chat-thinking chat-working-status"
                  role="status"
                  aria-live="polite"
                >
                  <div className="chat-message-role">
                    Lex Machina
                  </div>
                  <div className="chat-working-head">
                    <span
                      className="chat-working-spinner"
                      aria-hidden="true"
                    />
                    <strong>Pracuję</strong>
                    <span>
                      {executionElapsedSeconds}s
                    </span>
                  </div>
                  <div className="chat-message-content">
                    {executionStage}
                  </div>
                  <div className="chat-working-meta">
                    <span>
                      {runtimePulse === "OK"
                        ? "Runtime odpowiada"
                        : runtimePulse === "LOST"
                          ? "Brak odpowiedzi z runtime — operacja nadal oczekuje"
                          : "Sprawdzam runtime…"}
                    </span>
                    <span>
                      To okno aktualizuje się podczas oczekiwania na model i źródła.
                    </span>
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
                <span>
                  Działanie: {selectedDeterministicAction
                    ? selectedDeterministicAction.label
                    : "AUTO · prawny router"}
                </span>
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
                  aria-expanded={
                    caseFilePickerOpen
                  }
                  onClick={() =>
                    setCaseFilePickerOpen(
                      (value) =>
                        !value
                    )
                  }
                >
                  🗂 Akta
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
              {caseFilePickerOpen ? (
                <div
                  className="chat-case-file-picker"
                  aria-label="Dokumenty sprawy do dołączenia"
                >
                  <div className="chat-case-file-picker-head">
                    <strong>
                      Dokumenty sprawy
                    </strong>
                    <small>
                      Zaznacz dowolną liczbę gotowych plików. Status OCR pokazuje, które strony wymagały rozpoznawania tekstu.
                    </small>
                  </div>
                  {caseFilePickerError ? (
                    <p className="chat-inline-error">
                      Nie udało się odczytać dokumentów sprawy: {caseFilePickerError}
                    </p>
                  ) : null}
                  {caseFiles.length === 0 ? (
                    <small>
                      Brak zapisanych plików w tej sprawie.
                    </small>
                  ) : (
                    <ul className="chat-case-file-picker-list">
                      {caseFiles.map(
                        (item) => {
                          const ready =
                            Boolean(
                              item.processing &&
                              item.processing.chunkIndices.length > 0
                            );
                          const selected =
                            Boolean(
                              item.processing &&
                              documentAttachments.some(
                                (attachment) =>
                                  attachment.documentId ===
                                    item.processing!.documentId
                              )
                            );
                          return (
                            <li
                              key={
                                item.uploadId
                              }
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  disabled={
                                    !ready
                                  }
                                  checked={
                                    selected
                                  }
                                  onChange={(
                                    event
                                  ) => {
                                    const processing =
                                      item.processing;
                                    if (
                                      !processing
                                    ) {
                                      return;
                                    }
                                    if (
                                      event
                                        .target
                                        .checked
                                    ) {
                                      setDocumentAttachments(
                                        (
                                          current
                                        ) =>
                                          upsertAttachment(
                                            current,
                                            {
                                              caseId,
                                              documentId:
                                                processing.documentId,
                                              chunkIndices:
                                                processing.chunkIndices
                                            }
                                          )
                                      );
                                    } else {
                                      setDocumentAttachments(
                                        (
                                          current
                                        ) =>
                                          current.filter(
                                            (
                                              attachment
                                            ) =>
                                              attachment.documentId !==
                                                processing.documentId
                                          )
                                      );
                                    }
                                  }}
                                />
                                <span>
                                  <strong>
                                    {item.filename}
                                  </strong>
                                  <small>
                                    {item.processing
                                      ? item.processing.ocrPages > 0
                                        ? `OCR ✓ · ${item.processing.ocrPages}/${item.processing.totalPages} stron`
                                        : `Tekst cyfrowy ✓ · OCR niewymagany · ${item.processing.totalPages} stron`
                                      : "Nieprzetworzony · uruchom OCR/prywatność w zakładce Pliki"}
                                  </small>
                                </span>
                              </label>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </div>
              ) : null}
              {pendingFinalDocument ? (
                <div className="chat-final-document">
                  <div>
                    <strong>Finalny dokument z przywróconymi danymi</strong>
                    <small>
                      Każdy dokument źródłowy ma własny vault. Alias D01/D02/… jest odwracany wyłącznie przez deanonimizator przypisany do tego dokumentu.
                    </small>
                  </div>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={finalDocumentPassword}
                    disabled={finalDocumentBusy}
                    placeholder="Bieżące hasło — jednorazowa reautoryzacja"
                    onChange={(event) =>
                      setFinalDocumentPassword(
                        event.target
                          .value
                      )
                    }
                  />
                  <div className="chat-form-row compact">
                    <button
                      type="button"
                      className="chat-primary-action"
                      disabled={
                        finalDocumentBusy ||
                        !finalDocumentPassword
                          .trim()
                      }
                      onClick={() =>
                        void finalizePendingDocument()
                      }
                    >
                      {finalDocumentBusy
                        ? "Przywracam dane…"
                        : "Przywróć dane i pobierz finalny plik"}
                    </button>
                    <button
                      type="button"
                      className="chat-secondary-action"
                      disabled={finalDocumentBusy}
                      onClick={async () => {
                        try {
                          const blob =
                            await downloadGeneratedArtifact(
                              pendingFinalDocument.caseId,
                              pendingFinalDocument.artifactId
                            );
                          downloadBlob(
                            blob,
                            "LexMachina-tokenized." +
                              pendingFinalDocument.format
                          );
                        } catch (error) {
                          setExecutionError(
                            error instanceof Error
                              ? error.message
                              : String(error)
                          );
                        }
                      }}
                    >
                      Pobierz wersję tokenizowaną
                    </button>
                  </div>
                </div>
              ) : null}
              {generatedDocumentMessage ? (
                <p className="chat-inline-success">
                  {generatedDocumentMessage}
                </p>
              ) : null}
              {executionError ? (
                <div className="chat-error-diagnostic">
                  <p className="chat-inline-error">
                    {executionError}
                  </p>
                  {executionDiagnostic ? (
                    <details>
                      <summary>
                        Pełne informacje diagnostyczne
                      </summary>
                      <dl>
                        <div>
                          <dt>Kod</dt>
                          <dd>
                            <code>
                              {executionDiagnostic.code}
                            </code>
                          </dd>
                        </div>
                        {executionDiagnostic.status !== undefined ? (
                          <div>
                            <dt>HTTP</dt>
                            <dd>
                              {executionDiagnostic.status}
                            </dd>
                          </div>
                        ) : null}
                        {executionDiagnostic.stage ? (
                          <div>
                            <dt>Etap</dt>
                            <dd>
                              <code>
                                {executionDiagnostic.stage}
                              </code>
                            </dd>
                          </div>
                        ) : null}
                        {executionDiagnostic.reason ? (
                          <div>
                            <dt>Powód</dt>
                            <dd>
                              <code>
                                {executionDiagnostic.reason}
                              </code>
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                      {executionDiagnostic.description ? (
                        <pre>
                          {executionDiagnostic.description}
                        </pre>
                      ) : null}
                      {executionDiagnostic.trace &&
                      executionDiagnostic.trace.length > 0 ? (
                        <ol className="chat-error-trace">
                          {executionDiagnostic.trace.map(
                            (event, index) => (
                              <li
                                key={
                                  String(
                                    event.sequence ??
                                      index
                                  ) +
                                  ":" +
                                  String(
                                    event.target ??
                                      ""
                                  )
                                }
                              >
                                <code>
                                  {event.sequence ??
                                    index + 1}
                                  {" · "}
                                  {event.type ??
                                    "event"}
                                  {" · "}
                                  {event.target ??
                                    "unknown"}
                                  {" · "}
                                  {event.status ??
                                    "?"}
                                </code>
                                {event.detail ? (
                                  <span>
                                    {event.detail}
                                  </span>
                                ) : null}
                              </li>
                            )
                          )}
                        </ol>
                      ) : null}
                    </details>
                  ) : null}
                </div>
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
              <p className="eyebrow">Sterowanie wykonaniem</p>
              <h2>
                {selectedDeterministicAction
                  ? selectedDeterministicAction.label
                  : "AUTO · prawny-router-v3"}
              </h2>
              <p>
                Typ działania wybiera się wyłącznie nad polem pierwszej wiadomości.
                Brak wyboru oznacza pełne AUTO: prawny-router-v3 sam dobiera dziedziny
                DR i skille wykonawcze. Po pierwszej wiadomości tryb jest przypięty do
                wątku i selektor w czacie znika.
              </p>
              <div className="chat-model-select-row">
                <button
                  type="button"
                  className="chat-secondary-action"
                  disabled={
                    domainSelection.length === routes.length &&
                    manualSkillSelection.length ===
                      selectableExecutionSkills.length
                  }
                  onClick={
                    selectAllSkills
                  }
                >
                  Zaznacz wszystkie skille
                </button>
                <button
                  type="button"
                  className="chat-secondary-action"
                  disabled={
                    domainSelection.length === 0 &&
                    manualSkillSelection.length === 0
                  }
                  onClick={
                    clearAllSkills
                  }
                >
                  Odznacz wszystkie opcjonalne
                </button>
              </div>
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
                <div>
                  <strong>✓ prawo-polskie-v2</strong>
                  <small>zawsze aktywny dla zapytań prawnych PL</small>
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
                <div className="chat-model-select-row">
                  <button
                    type="button"
                    className="chat-secondary-action"
                    disabled={
                      domainSelection.length ===
                      routes.length
                    }
                    onClick={
                      selectAllDomainSkills
                    }
                  >
                    Zaznacz wszystkie
                  </button>
                  <button
                    type="button"
                    className="chat-secondary-action"
                    disabled={
                      domainSelection.length === 0
                    }
                    onClick={
                      clearDomainSkills
                    }
                  >
                    Odznacz wszystkie
                  </button>
                </div>
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
                  <p className="eyebrow">Skille wykonawcze</p>
                  <h2>
                    Dodatkowe skille wykonawcze · {manualSkillSelection.length} z {selectableExecutionSkills.length} zaznaczonych
                  </h2>
                  <p>
                    Wszystkie dostępne skille wykonawcze są zaznaczone domyślnie.
                    Ta lista nie zawiera modułów DR; dziedziny prawa są kontrolowane
                    w sekcji powyżej.
                  </p>
                </div>
                <div className="chat-model-select-row">
                  <button
                    type="button"
                    className="chat-secondary-action"
                    disabled={
                      manualSkillSelection.length ===
                      selectableExecutionSkills.length
                    }
                    onClick={
                      selectAllManualSkills
                    }
                  >
                    Zaznacz wszystkie
                  </button>
                  <button
                    type="button"
                    className="chat-secondary-action"
                    disabled={
                      manualSkillSelection.length === 0
                    }
                    onClick={
                      clearManualSkills
                    }
                  >
                    Odznacz wszystkie
                  </button>
                  <input
                    className="chat-search"
                    value={skillFilter}
                    placeholder="Filtruj skille…"
                    onChange={(event) =>
                      setSkillFilter(
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="chat-skill-grid">
                {filteredSkills.map((skill) => {
                  const checked =
                    manualSkillSelection.includes(
                      skill.name
                    );
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
          <section className="chat-settings-hub">
            <nav
              className="chat-settings-nav"
              aria-label="Sekcje ustawień"
            >
              {([
                ["models", "Modele i AI"],
                ["users", "Użytkownicy i uprawnienia"],
                ["security", "Hasło i bezpieczeństwo"],
                ["maintenance", "Aplikacja i utrzymanie"]
              ] as Array<
                [SettingsSection, string]
              >)
                .map(
                  ([section, label]) => (
                    <button
                      key={section}
                      type="button"
                      className={
                        settingsSection ===
                        section
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setSettingsSection(
                          section
                        )
                      }
                    >
                      {label}
                    </button>
                  )
                )}
            </nav>
            <div className="chat-settings-content">
              {settingsSection === "models" ? (
                <div className="chat-settings-grid">
            <article className="chat-card chat-settings-primary">
              <p className="eyebrow">Model główny</p>
              <h2>
                {selectedModel?.displayName ??
                  (provider === "local"
                    ? "Lokalny model główny"
                    : "Wybierz źródło i model")}
              </h2>
              <div className="chat-settings-field-grid">
              <label>
                Źródło
                <select
                  value={provider}
                  onChange={(event) => {
                    setProvider(
                      event.target.value as PrimaryModelSource
                    );
                    setProviderApiKeyInput("");
                    setProviderKeyMessage("");
                    setProviderAccountMessage("");
                  }}
                >
                  {PRIMARY_MODEL_SOURCES.map((item) => {
                    const accountSource =
                      isAccountPrimarySource(
                        item.id
                      );
                    const itemProvider =
                      runtimeProviderForPrimarySource(
                        item.id
                      );
                    const account =
                      accountSource
                        ? providerAccounts[
                            itemProvider
                          ]
                        : undefined;
                    const apiReady =
                      !accountSource &&
                      item.id !== "local"
                        ? providerConfiguration[
                            itemProvider
                          ]
                        : undefined;
                    const suffix =
                      item.id === "local"
                        ? " · bez klucza API"
                        : accountSource
                          ? account?.authenticated
                            ? " · połączone"
                            : account?.installed === false
                              ? " · brak CLI"
                              : account
                                ? " · niezalogowane"
                                : " · sprawdzanie"
                          : apiReady === true
                            ? " · API gotowe"
                            : apiReady === false
                              ? " · brak klucza"
                              : " · sprawdzanie";
                    return (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.label}{suffix}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label>
                Model
                <select
                  value={model}
                  disabled={
                    modelCatalogLoading ||
                    models.length === 0
                  }
                  onChange={(event) =>
                    setModel(
                      event.target.value
                    )
                  }
                >
                  {modelCatalogLoading ? (
                    <option value="">
                      Odświeżam listę modeli…
                    </option>
                  ) : models.length === 0 ? (
                    <option value="">
                      {provider === "local"
                        ? "Brak zainstalowanych modeli lokalnych"
                        : "Brak dostępnych modeli"}
                    </option>
                  ) : null}
                  {models.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={!item.selectable}
                    >
                      {item.displayName}
                      {!item.selectable
                        ? isAccountPrimarySource(provider)
                          ? " · wymaga logowania"
                          : " · nieobsługiwany"
                        : ""}
                    </option>
                  ))}
                </select>
              </label>
              </div>
              {provider === "local" ? (
                <div className="chat-settings-status-row">
                  <span className="chat-settings-status ready">
                    {modelCatalogLoading
                      ? "Odświeżam lokalny katalog…"
                      : `Wykryto modeli lokalnych: ${models.length}`}
                  </span>
                </div>
              ) : isAccountPrimarySource(provider) ? (
                <div className="chat-settings-status-row">
                  <span
                    className={
                      accountAuthenticated
                        ? "chat-settings-status ready"
                        : "chat-settings-status"
                    }
                  >
                    {accountAuthenticated
                      ? "Konto połączone"
                      : "Konto wymaga połączenia"}
                  </span>
                </div>
              ) : (
                <div className="chat-settings-status-row">
                  <span
                    className={
                      providerConfigured
                        ? "chat-settings-status ready"
                        : "chat-settings-status"
                    }
                  >
                    {providerConfigured
                      ? "Klucz API aktywny"
                      : "Brak aktywnego klucza API"}
                  </span>
                </div>
              )}
              {modelError ? (
                <p className="chat-inline-error">
                  {modelError === "PROVIDER_NOT_CONFIGURED"
                    ? "Najpierw dodaj klucz API dla tego dostawcy."
                    : modelError === "ACCOUNT_SESSION_CLI_NOT_INSTALLED"
                      ? "Nie znaleziono oficjalnego klienta tego dostawcy. Zainstaluj go z instrukcji poniżej albo wybierz kanał API."
                      : modelError === "ACCOUNT_SESSION_NOT_AUTHENTICATED"
                        ? "Najpierw połącz konto użytkownika."
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
              {providerDefinition &&
              !model.startsWith("local/") &&
              !isAccountPrimarySource(provider) ? (
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

            <article className="chat-card chat-settings-advanced">
              <p className="eyebrow">Ustawienie zaawansowane</p>
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

            <article className="chat-card chat-settings-auth">
              <p className="eyebrow">
                {provider === "local"
                  ? "Lokalne AI"
                  : isAccountPrimarySource(provider)
                    ? "Konto użytkownika"
                    : "Klucz API"}
              </p>
              <h2>
                {provider === "local"
                  ? "Konfiguracja lokalna"
                  : isAccountPrimarySource(provider)
                    ? "Połączenie z kontem"
                    : "Konfiguracja API"}
              </h2>
              {provider === "local" ? (
                <>
                  <p>
                    Modele lokalne działają przez llama.cpp i nie wymagają klucza API
                    ani logowania do zewnętrznego konta.
                  </p>
                  <div className="chat-local-inventory">
                    <strong>
                      {modelCatalogLoading
                        ? "Odświeżam lokalny katalog…"
                        : `Zainstalowane modele: ${models.length}`}
                    </strong>
                    {models.length > 0 ? (
                      <div className="chat-model-chip-list">
                        {models.map((item) => (
                          <span key={item.id} className="chat-model-chip">
                            {item.displayName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <small>
                        Nie wykryto zainstalowanego GGUF. Po instalacji modelu lista
                        odświeży się automatycznie; można też wymusić odczyt poniżej.
                      </small>
                    )}
                    <button
                      type="button"
                      className="chat-secondary-action"
                      disabled={modelCatalogLoading}
                      onClick={() =>
                        setLocalModelsRefreshToken(
                          (value) => value + 1
                        )
                      }
                    >
                      {modelCatalogLoading
                        ? "Odświeżanie…"
                        : "Odśwież modele lokalne"}
                    </button>
                  </div>
                </>
              ) : isAccountPrimarySource(provider) ? (
                <>
                  <p>
                    Kanał konta jest opcjonalną integracją z oficjalnym klientem
                    {runtimeProvider === "openai"
                      ? " Codex CLI"
                      : runtimeProvider === "anthropic"
                        ? " Claude Code"
                        : " Grok Build"}.
                    Na Windows Lex Machina otwiera widoczny terminal, a klient prowadzi
                    dalej przez swój oficjalny login w przeglądarce lub flow kodu urządzenia.
                    Token OAuth pozostaje po stronie klienta i nie jest kopiowany do UI Lex Machina.
                  </p>
                  {runtimeProvider === "anthropic" ? (
                    <>
                      <p>
                        Claude Code wspiera również oficjalny tryb automatyzacji:
                        uruchom <code>claude setup-token</code>. Otrzymany
                        długowieczny token OAuth możesz wkleić poniżej; Lex Machina
                        przekaże go do Claude Code jako
                        <code> CLAUDE_CODE_OAUTH_TOKEN</code>. W aplikacji desktopowej
                        token jest przechowywany w systemowym magazynie poświadczeń.
                      </p>
                      <small>
                        {accountSession?.oauthTokenConfigured
                          ? "OAuth setup-token: skonfigurowany"
                          : "OAuth setup-token: nie skonfigurowany"}
                      </small>
                      {user.appRole === "ADMIN" ? (
                        <>
                          <input
                            type="password"
                            autoComplete="off"
                            value={claudeOAuthToken}
                            placeholder="Wklej token z: claude setup-token"
                            onChange={(event) =>
                              setClaudeOAuthTokenInput(
                                event.target.value
                              )
                            }
                          />
                          <div className="chat-form-row compact">
                            <button
                              type="button"
                              className="chat-primary-action"
                              disabled={
                                claudeOAuthBusy ||
                                !claudeOAuthToken.trim()
                              }
                              onClick={() =>
                                void saveClaudeOAuthToken()
                              }
                            >
                              {claudeOAuthBusy
                                ? "Zapisywanie…"
                                : isDesktopShell()
                                  ? "Zapisz token w systemie"
                                  : "Użyj tokenu w sesji"}
                            </button>
                            <button
                              type="button"
                              className="chat-secondary-action"
                              disabled={claudeOAuthBusy}
                              onClick={() =>
                                void removeClaudeOAuthToken()
                              }
                            >
                              Usuń token OAuth
                            </button>
                          </div>
                          {claudeOAuthMessage ? (
                            <small>
                              {claudeOAuthMessage}
                            </small>
                          ) : null}
                        </>
                      ) : null}
                      <p>
                        Alternatywnie możesz użyć provisionowanego
                        <code> CLAUDE_CODE_OAUTH_REFRESH_TOKEN</code> wraz z
                        <code> CLAUDE_CODE_OAUTH_SCOPES</code> w środowisku
                        zarządzanym.
                      </p>
                    </>
                  ) : null}
                  <p>
                    Do zwykłej integracji Lex Machina z zewnętrznym modelem możesz
                    zamiast tego wybrać kanał API — nie wymaga instalowania klienta CLI,
                    udostępnia katalog modeli providera, a w aplikacji desktopowej klucz
                    może być zapisany w systemowym magazynie poświadczeń.
                  </p>
                  <small>
                    {accountSession
                      ? accountSession.installed
                        ? accountSession.authenticated
                          ? "Status: połączone · " + accountSession.command
                          : "Status: klient zainstalowany, brak aktywnej sesji · " + accountSession.command
                        : "Status: brak klienta · " + accountSession.command + ". " + accountSession.installHint
                      : "Sprawdzanie klienta i sesji…"}
                  </small>
                  {user.appRole === "ADMIN" ? (
                    <div className="chat-form-row compact">
                      {accountSession?.installed === false ? (
                        <button
                          type="button"
                          className="chat-primary-action"
                          onClick={() =>
                            void openAccountClientSetup()
                          }
                        >
                          Instalacja {providerDefinition?.accountClientLabel ?? "klienta"} ↗
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="chat-primary-action"
                          disabled={
                            providerAccountBusy ||
                            accountSession?.authenticated === true
                          }
                          onClick={() =>
                            void connectProviderAccount()
                          }
                        >
                          {providerAccountBusy
                            ? "Logowanie…"
                            : accountSession?.authenticated
                              ? "Połączone"
                              : "Połącz konto"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="chat-secondary-action"
                        disabled={providerAccountBusy}
                        onClick={() =>
                          void refreshProviderAccountStatus()
                        }
                      >
                        Sprawdź ponownie
                      </button>
                      <button
                        type="button"
                        className="chat-secondary-action"
                        disabled={providerAccountBusy}
                        onClick={switchAccountToApi}
                      >
                        Przejdź na API
                      </button>
                    </div>
                  ) : (
                    <p>
                      Konto dostawcy może połączyć administrator aplikacji.
                    </p>
                  )}
                  {accountSession?.authenticated ? (
                    <small>
                      Aby zmienić konto, wyloguj lub przełącz konto w oficjalnym
                      kliencie dostawcy, a następnie kliknij „Sprawdź ponownie”.
                    </small>
                  ) : null}
                  {providerAccountMessage ? (
                    <small>{providerAccountMessage}</small>
                  ) : null}
                </>
              ) : user.appRole === "ADMIN" ? (
                <>
                  {runtimeProvider === "anthropic" ? (
                    <p className="chat-inline-warning">
                      Ten kanał używa oficjalnego Anthropic API i klucza API.
                      Jeżeli chcesz użyć uwierzytelnienia Claude Code/OAuth,
                      wybierz „Claude · konto / OAuth”.
                    </p>
                  ) : null}
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
                {settingsPanels?.localAi ? (
                  <div className="chat-settings-embedded-wide">
                    {settingsPanels.localAi}
                  </div>
                ) : null}
                </div>
              ) : settingsSection === "users" ? (
                <div className="chat-settings-section-stack">
                  {user.appRole === "ADMIN"
                    ? settingsPanels?.users
                    : (
                      <article className="chat-card">
                        <p className="eyebrow">
                          Konto aplikacji
                        </p>
                        <h2>
                          Użytkownicy globalni
                        </h2>
                        <p>
                          Tworzenie, wyłączanie i usuwanie kont aplikacji jest dostępne dla administratora. Uprawnienia do bieżącej sprawy są zarządzane poniżej zgodnie z rolą w tej sprawie.
                        </p>
                      </article>
                    )}
                  {caseId ? (
                    <article className="chat-card chat-settings-case-access">
                      <p className="eyebrow">
                        Bieżąca sprawa
                      </p>
                      <h2>
                        Uprawnienia do sprawy
                      </h2>
                      <p>
                        Role OWNER, EDITOR, ANALYST i VIEWER dotyczą wyłącznie wybranej sprawy.
                      </p>
                      <CaseCollaborationPanel
                        caseId={caseId}
                        caseRole={
                          selectedCase?.role
                        }
                      />
                    </article>
                  ) : null}
                </div>
              ) : settingsSection === "security" ? (
                <div className="chat-settings-section-stack">
                  {settingsPanels?.security}
                </div>
              ) : (
                <div className="chat-settings-section-stack">
                  {settingsPanels?.maintenance}
                </div>
              )}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
