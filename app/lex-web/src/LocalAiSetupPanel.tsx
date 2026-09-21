import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  apiBase,
  authorizationHeaders,
  isDesktopShell,
  type AuthenticatedUser
} from "./api.js";
import {
  useFloatingPanelDrag
} from "./use-floating-panel.js";
import "./local-ai.css";

type LocalModel = {
  provider: "local";
  id: string;
  displayName: string;
  selectable: true;
  contextWindow: number;
  nativeContextWindow: number;
  minimumContextWindow: number;
  maximumContextWindow: number;
  configuredContextWindow?: number;
  contextMode: "NATIVE_OR_REDUCED" | "YARN_EXTENDED";
  quantization: string;
  license: string;
  source: string;
  localOnly: true;
  installed: boolean;
};

type BackendPreference =
  | "AUTO"
  | "VULKAN_X64"
  | "CPU_X64_PORTABLE";

type BackendPolicy = {
  allowed:
    BackendPreference[];
  default:
    BackendPreference;
};

type ContextPolicy = {
  minimum: number;
  maximum: number;
  step: number;
  recommendedProfiles: number[];
  default: number;
};

type LocalRuntimeStatus = {
  configured: boolean;
  provisioning: boolean;
  configPath: string;
  enginePresent: boolean;
  modelsPresent: Record<string, boolean>;
  selectedModelId: string | null;
  configuredContextTokens: number | null;
  activeModelId: string | null;
  state: "STOPPED" | "PROVISIONING" | "STARTING" | "READY";
  endpoint: string;
  contextPolicy: ContextPolicy;
  backendPolicy: BackendPolicy;
  qualification: {
    schemaVersion: 1;
    result: "PASS";
    modelId: string;
    contextTokens: number;
    contextMode:
      | "NATIVE_OR_REDUCED"
      | "YARN_EXTENDED";
    engine: "llama.cpp";
    backend?:
      | "VULKAN_X64"
      | "CPU_X64_PORTABLE";
    startupMs: number;
    validatedAt: string;
  } | null;
  progress: {
    phase:
      | "STARTING"
      | "DOWNLOAD"
      | "CACHE_HIT"
      | "VERIFIED"
      | "VALIDATING_RUNTIME"
      | "READY"
      | "FAILED";
    label: string;
    bytesDownloaded: number;
    bytesTotal: number | null;
    percent: number | null;
    updatedAt: string;
  } | null;
  hardware: {
    platform: string;
    arch: string;
    totalMemoryBytes: number;
    logicalCpuCount: number;
    cpuModel: string | null;
    accelerators: Array<{
      name: string;
      driverVersion?: string;
    }>;
    packagedBackend: string;
    configuredBackend:
      | "VULKAN_X64"
      | "CPU_X64_PORTABLE"
      | null;
    backendSelectionMode:
      BackendPreference | null;
    gpuCandidateDetected: boolean;
    gpuOffloadEnabled: boolean;
    detectedAt: string;
  };
};

type LocalModelsResponse = {
  provider: "local";
  models: LocalModel[];
  runtime: LocalRuntimeStatus;
};

type LocalProvisionResponse = {
  model: LocalModel;
  contextTokens: number;
  configPath: string;
  runtime: LocalRuntimeStatus;
};

type ModelPackUpdateStatus = {
  status:
    | "NOT_CONFIGURED"
    | "UP_TO_DATE"
    | "AVAILABLE"
    | "UNAVAILABLE"
    | "BLOCKED";
  checkedAt: string;
  modelId?: string;
  modelFamily?: "BIELIK" | "MISTRAL";
  currentSha256?: string;
  latestPackVersion?: string;
  targetModelId?: string;
  targetDisplayName?: string;
  targetBytes?: number;
  targetSha256?: string;
  verificationReady: boolean;
  signatureMode:
    | "SIGNED_REQUIRED"
    | "UNSIGNED_ALLOWED";
  signerKeyId?: string;
  blockedReason?:
    | "SIGNED_INDEX_MISSING"
    | "SIGNER_POLICY_MISSING"
    | "APP_INCOMPATIBLE"
    | "MODEL_NOT_IN_INDEX"
    | "PACK_VERSION_ROLLBACK"
    | "PACK_VERSION_HASH_CONFLICT"
    | "INDEX_INVALID";
};

async function request<T>(
  pathname: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBase()}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...authorizationHeaders(),
      ...init?.headers
    }
  });
  const payload = await response.json() as T | { error?: string };
  if (!response.ok) {
    const code =
      typeof (payload as { error?: unknown }).error === "string"
        ? String((payload as { error: string }).error)
        : `HTTP_${response.status}`;
    throw new Error(code);
  }
  return payload as T;
}

function formatTokens(value: number): string {
  return value.toLocaleString("pl-PL");
}

function formatBytes(value: number): string {
  if (value >= 1024 ** 3) {
    return `${(value / (1024 ** 3)).toFixed(2)} GB`;
  }
  if (value >= 1024 ** 2) {
    return `${(value / (1024 ** 2)).toFixed(1)} MB`;
  }
  if (value >= 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${value} B`;
}

function progressLabel(
  phase: NonNullable<
    LocalRuntimeStatus["progress"]
  >["phase"]
): string {
  switch (phase) {
    case "STARTING":
      return "Przygotowanie";
    case "DOWNLOAD":
      return "Pobieranie";
    case "CACHE_HIT":
      return "Zweryfikowany cache";
    case "VERIFIED":
      return "SHA-256 zweryfikowane";
    case "VALIDATING_RUNTIME":
      return "Test uruchomienia";
    case "READY":
      return "Gotowe";
    case "FAILED":
      return "Błąd";
  }
}

function modelPackBlockLabel(
  reason:
    ModelPackUpdateStatus["blockedReason"]
): string {
  switch (reason) {
    case "SIGNED_INDEX_MISSING":
      return "brak podpisu indeksu model-pack w trybie wymagającym podpisu";
    case "SIGNER_POLICY_MISSING":
      return "brak skonfigurowanego zaufanego klucza Ed25519";
    case "APP_INCOMPATIBLE":
      return "pakiet nie jest zgodny z tą wersją aplikacji";
    case "MODEL_NOT_IN_INDEX":
      return "zainstalowanego modelu nie ma w indeksie aktualizacji";
    case "PACK_VERSION_ROLLBACK":
      return "wykryto próbę cofnięcia do starszego pakietu";
    case "PACK_VERSION_HASH_CONFLICT":
      return "ta sama wersja pakietu ma inny hash modelu";
    case "INDEX_INVALID":
    case undefined:
      return "indeks aktualizacji jest nieprawidłowy";
  }
}

function contextLabel(
  tokens: number,
  nativeContext: number
): string {
  return tokens > nativeContext
    ? `${formatTokens(tokens)} · rozszerzony YaRN`
    : `${formatTokens(tokens)} · w granicach natywnych`;
}

function backendLabel(
  value: BackendPreference
): string {
  switch (value) {
    case "AUTO":
      return "Auto · spróbuj Vulkan, w razie błędu użyj CPU";
    case "VULKAN_X64":
      return "Vulkan GPU · bez automatycznego fallbacku";
    case "CPU_X64_PORTABLE":
      return "CPU · maksymalna zgodność";
  }
}

export function LocalAiSetupPanel({
  user,
  embedded = false
}: {
  user: AuthenticatedUser;
  embedded?: boolean;
}) {
  const [data, setData] = useState<LocalModelsResponse | null>(null);
  const [modelId, setModelId] = useState("");
  const [contextTokens, setContextTokens] = useState(64_000);
  const [backendPreference, setBackendPreference] =
    useState<BackendPreference>("AUTO");
  const [busy, setBusy] = useState(false);
  const [modelUpdate, setModelUpdate] =
    useState<ModelPackUpdateStatus | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [
    minimized,
    setMinimized
  ] = useState(!embedded);
  const floatingDrag =
    useFloatingPanelDrag();

  const available = isDesktopShell();
  const selected = useMemo(
    () => data?.models.find((model) => model.id === modelId),
    [data, modelId]
  );
  const policy = data?.runtime.contextPolicy;
  const profiles = useMemo(() => {
    if (!policy || !selected) return [];
    return policy.recommendedProfiles.filter(
      (value) =>
        value >= selected.minimumContextWindow &&
        value <= selected.maximumContextWindow
    );
  }, [policy, selected]);

  async function refresh(): Promise<void> {
    if (!available) return;
    try {
      const next =
        await request<LocalModelsResponse>(
          "/api/local-models"
        );
      setData(next);
      window.dispatchEvent(
        new Event(
          "lex-local-models-changed"
        )
      );
      const preferred =
        modelId &&
        next.models.some(
          (item) =>
            item.id === modelId
        )
          ? modelId
          : next.runtime.selectedModelId ??
            next.models[0]?.id ??
            "";
      setModelId(preferred);
      if (
        user.appRole === "ADMIN" &&
        preferred
      ) {
        setModelUpdate(
          await request<ModelPackUpdateStatus>(
            `/api/local-models/update/status?modelId=${encodeURIComponent(
              preferred
            )}`
          )
        );
      } else {
        setModelUpdate(null);
      }
      const preferredModel = next.models.find((item) => item.id === preferred);
      const preferredContext =
        next.runtime.configuredContextTokens ??
        next.runtime.contextPolicy.default;
      setContextTokens(
        preferredModel
          ? Math.min(
              preferredModel.maximumContextWindow,
              Math.max(preferredModel.minimumContextWindow, preferredContext)
            )
          : preferredContext
      );
      setBackendPreference(
        next.runtime.hardware
          .backendSelectionMode ??
        next.runtime.backendPolicy
          .default
      );
      setError("");
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    }
  }

  useEffect(() => {
    void refresh();
  }, [available, user.appRole]);

  function startProvisioningPolling(): number {
    return window.setInterval(() => {
      void request<LocalModelsResponse>(
        "/api/local-models"
      )
        .then((next) => {
          setData(next);
        })
        .catch(() => {
          // The provisioning request owns user-visible errors.
        });
    }, 750);
  }

  useEffect(() => {
    if (!selected) return;
    setContextTokens((current) =>
      Math.min(
        selected.maximumContextWindow,
        Math.max(selected.minimumContextWindow, current)
      )
    );
    if (
      user.appRole === "ADMIN"
    ) {
      void request<ModelPackUpdateStatus>(
        `/api/local-models/update/status?modelId=${encodeURIComponent(
          selected.id
        )}`
      )
        .then((status) => {
          setModelUpdate(status);
        })
        .catch((problem) => {
          setModelUpdate(null);
          setError(
            problem instanceof Error
              ? problem.message
              : String(problem)
          );
        });
    }
  }, [
    selected?.id,
    user.appRole
  ]);

  if (!available) return null;

  const configured = data?.runtime.configured === true;
  const extended = Boolean(
    selected && contextTokens > selected.nativeContextWindow
  );
  const canProvision =
    user.appRole === "ADMIN" &&
    Boolean(selected) &&
    !busy &&
    !data?.runtime.provisioning &&
    contextTokens >= (selected?.minimumContextWindow ?? Number.MAX_SAFE_INTEGER) &&
    contextTokens <= (selected?.maximumContextWindow ?? 0) &&
    Boolean(policy) &&
    Boolean(
      data?.runtime
        .backendPolicy
        .allowed.includes(
          backendPreference
        )
    ) &&
    ((contextTokens - (policy?.minimum ?? 0)) % (policy?.step ?? 1) === 0);

  async function provision(): Promise<void> {
    if (!canProvision || !selected) return;
    setBusy(true);
    setError("");
    setMessage(
      "Pobieram zweryfikowany silnik i wybrany model. Aplikacja pozostaje zainstalowana niezależnie od tej operacji."
    );
    const polling =
      startProvisioningPolling();
    try {
      const result = await request<LocalProvisionResponse>(
        "/api/local-models/provision",
        {
          method: "POST",
          body: JSON.stringify({
            modelId: selected.id,
            contextTokens,
            backendPreference
          })
        }
      );
      setData((current) => current ? {
        ...current,
        runtime: result.runtime,
        models: current.models.map((item) =>
          item.id === result.model.id ? result.model : item
        )
      } : current);
      setMessage(
        `Lokalna AI gotowa: ${result.model.displayName}, kontekst ${formatTokens(result.contextTokens)}. Przeładowuję interfejs.`
      );
      window.setTimeout(() => window.location.reload(), 350);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
      setMessage("");
    } finally {
      window.clearInterval(
        polling
      );
      await refresh();
      setBusy(false);
    }
  }

  async function applyModelUpdate(): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      busy ||
      modelUpdate?.status !== "AVAILABLE" ||
      !selected ||
      modelUpdate.modelId !==
        selected.id
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage(
      modelUpdate.signatureMode === "UNSIGNED_ALLOWED"
        ? "Pobieram aktualizację modelu do stagingu. Tryb przejściowy dopuszcza brak podpisu, ale SHA-256, indeks, zgodność i rollback pozostają obowiązkowe."
        : "Pobieram podpisaną aktualizację modelu do stagingu. Stary GGUF pozostaje rollbackiem do czasu udanego testu /health."
    );
    const polling =
      startProvisioningPolling();
    try {
      const result = await request<
        LocalProvisionResponse & {
          receipt: {
            packVersion: string;
            signerKeyId: string;
            indexSha256: string;
            modelSha256: string;
          };
          update: ModelPackUpdateStatus;
        }
      >(
        "/api/local-models/update/apply",
        {
          method: "POST",
          body:
            JSON.stringify({
              modelId:
                selected.id,
              contextTokens,
              backendPreference
            })
        }
      );
      setData((current) => current ? {
        ...current,
        runtime: result.runtime,
        models: current.models.map((item) =>
          item.id === result.model.id ? result.model : item
        )
      } : current);
      setModelUpdate(result.update);
      const preservedOtherActive =
        Boolean(
          data?.runtime
            .selectedModelId &&
          data.runtime
            .selectedModelId !==
            result.model.id
        );
      setMessage(
        result.receipt.signerKeyId === "UNSIGNED_ALLOWED"
          ? `Model ${result.model.displayName} zaktualizowano z pakietu ${result.receipt.packVersion}. Tryb unsigned: SHA-256 + indeks + walidacja runtime PASS. Profil ${formatTokens(result.contextTokens)} tokenów przeszedł ponowną walidację.${preservedOtherActive ? " Poprzednio aktywny model pozostał aktywny." : ""}`
          : `Model ${result.model.displayName} zaktualizowano z podpisanego pakietu ${result.receipt.packVersion}. Podpis: ${result.receipt.signerKeyId}. Profil ${formatTokens(result.contextTokens)} tokenów przeszedł ponowną walidację.${preservedOtherActive ? " Poprzednio aktywny model pozostał aktywny." : ""}`
      );
    } catch (problem) {
      setError(
        problem instanceof Error
          ? problem.message
          : String(problem)
      );
      setMessage("");
    } finally {
      window.clearInterval(
        polling
      );
      await refresh();
      setBusy(false);
    }
  }

  async function repair(): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      busy ||
      !configured
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage(
      "Weryfikuję zapisany model, silnik i kontekst oraz wykonuję test uruchomienia."
    );
    const polling =
      startProvisioningPolling();
    try {
      const result = await request<LocalProvisionResponse>(
        "/api/local-models/repair",
        { method: "POST" }
      );
      setData((current) => current ? {
        ...current,
        runtime: result.runtime,
        models: current.models.map((item) =>
          item.id === result.model.id ? result.model : item
        )
      } : current);
      setMessage(
        `Naprawa zakończona: ${result.model.displayName}, ${formatTokens(result.contextTokens)} tokenów.`
      );
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
      setMessage("");
    } finally {
      window.clearInterval(
        polling
      );
      await refresh();
      setBusy(false);
    }
  }

  async function startLocal(): Promise<void> {
    if (!configured || busy || !data?.runtime.selectedModelId) return;
    setBusy(true);
    setError("");
    try {
      const result = await request<{
        runtime: LocalRuntimeStatus;
      }>(
        "/api/local-models/start",
        {
          method: "POST",
          body: JSON.stringify({
            modelId: data.runtime.selectedModelId
          })
        }
      );
      setData((current) => current ? {
        ...current,
        runtime: result.runtime
      } : current);
      setMessage("Lokalny model został uruchomiony.");
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setBusy(false);
    }
  }

  async function stopLocal(): Promise<void> {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await request<{
        runtime: LocalRuntimeStatus;
      }>(
        "/api/local-models/stop",
        { method: "POST" }
      );
      setData((current) => current ? {
        ...current,
        runtime: result.runtime
      } : current);
      setMessage("Lokalny model został zatrzymany.");
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setBusy(false);
    }
  }

  async function removeSelected(): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      busy ||
      !selected?.installed
    ) {
      return;
    }
    if (
      !window.confirm(
        `Usunąć lokalny plik modelu „${selected.displayName}”? Ponowne użycie będzie wymagało ponownego pobrania modelu.`
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("Usuwam wybrany lokalny model.");
    try {
      await request<{
        removedModelId: string;
        configRemoved: boolean;
        runtime: LocalRuntimeStatus;
      }>(
        "/api/local-models/remove",
        {
          method: "POST",
          body: JSON.stringify({
            modelId: selected.id
          })
        }
      );
      setMessage("Model został usunięty. Odświeżam konfigurację.");
      window.setTimeout(() => window.location.reload(), 350);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
      setMessage("");
      setBusy(false);
    }
  }

  if (minimized && !embedded) {
    return (
      <div
        className="local-ai-setup local-ai-setup-minimized"
        data-floating-panel="true"
        style={
          floatingDrag.style
        }
      >
        <span
          className="floating-drag-handle"
          title="Przeciągnij panel"
          aria-label="Przeciągnij panel lokalnej AI"
          {...floatingDrag.handleProps}
        >
          ⋮⋮
        </span>
        <button
          type="button"
          className="floating-icon-button"
          aria-label="Rozwiń panel lokalnej AI"
          title={
            configured
              ? "Lokalna AI · gotowa"
              : "Lokalna AI · konfiguracja"
          }
          onClick={() =>
            setMinimized(false)
          }
        >
          🤖
        </button>
        {configured ? (
          <span
            className="local-ai-ready-dot"
            aria-label="Lokalna AI gotowa"
          />
        ) : null}
      </div>
    );
  }

  return (
    <details
      className={
        embedded
          ? "local-ai-setup local-ai-setup-embedded"
          : "local-ai-setup"
      }
      open={
        embedded
          ? true
          : !configured
      }
      data-floating-panel={
        embedded ? undefined : "true"
      }
      style={
        embedded
          ? undefined
          : floatingDrag.style
      }
    >
      <summary>
        {!embedded ? (
          <span
            className="floating-drag-handle"
            title="Przeciągnij panel"
            aria-label="Przeciągnij panel lokalnej AI"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            {...floatingDrag.handleProps}
          >
            ⋮⋮
          </span>
        ) : null}
        <span className="local-ai-title">
          <strong>Lokalna AI</strong>
          <small>
            {configured
              ? `gotowa · ${formatTokens(data?.runtime.configuredContextTokens ?? 0)} tokenów`
              : "opcjonalna · instalowana dopiero na żądanie"}
          </small>
        </span>
        <span className={configured ? "local-ai-badge ready" : "local-ai-badge"}>
          {configured ? "GOTOWA" : "NIEZAINSTALOWANA"}
        </span>
        {!embedded ? (
          <button
            type="button"
            className="floating-minimize-button"
            aria-label="Zminimalizuj panel lokalnej AI"
            title="Zminimalizuj do ikony"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setMinimized(true);
            }}
          >
            −
          </button>
        ) : null}
      </summary>

      <div className="local-ai-body">
        <p>
          Program działa bez modelu lokalnego. Dopiero ten przycisk pobiera llama.cpp i jeden
          wybrany model do profilu użytkownika. Inferencja po instalacji działa lokalnie.
        </p>

        {data ? (
          <>
            <label>
              Model lokalny
              <select
                value={modelId}
                disabled={busy || user.appRole !== "ADMIN"}
                onChange={(event) => setModelId(event.target.value)}
              >
                {data.models.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.displayName} · {item.quantization}
                    {item.installed ? " · pobrany" : ""}
                  </option>
                ))}
              </select>
            </label>

            {selected && policy ? (
              <>
                <label>
                  Backend obliczeniowy
                  <select
                    value={backendPreference}
                    disabled={busy || user.appRole !== "ADMIN"}
                    onChange={(event) =>
                      setBackendPreference(
                        event.target.value as BackendPreference
                      )
                    }
                  >
                    {data.runtime.backendPolicy.allowed.map((value) => (
                      <option key={value} value={value}>
                        {backendLabel(value)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Kontekst
                  <select
                    value={contextTokens}
                    disabled={busy || user.appRole !== "ADMIN"}
                    onChange={(event) => setContextTokens(Number(event.target.value))}
                  >
                    {profiles.map((value) => (
                      <option key={value} value={value}>
                        {contextLabel(value, selected.nativeContextWindow)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Dokładna wartość: {formatTokens(contextTokens)} tokenów
                  <input
                    type="range"
                    min={selected.minimumContextWindow}
                    max={selected.maximumContextWindow}
                    step={policy.step}
                    value={contextTokens}
                    disabled={busy || user.appRole !== "ADMIN"}
                    onChange={(event) => setContextTokens(Number(event.target.value))}
                  />
                </label>

                <div className="local-ai-facts">
                  <span>Natywny kontekst: {formatTokens(selected.nativeContextWindow)}</span>
                  <span>Dozwolony profil: {formatTokens(selected.minimumContextWindow)}–{formatTokens(selected.maximumContextWindow)}</span>
                  <span>{extended ? "Tryb: YaRN — rozszerzenie ponad natywne okno" : "Tryb: natywny / zredukowany"}</span>
                  <span>
                    Sprzęt: {formatBytes(data.runtime.hardware.totalMemoryBytes)} RAM
                    {" · "}{data.runtime.hardware.logicalCpuCount} wątków logicznych
                    {data.runtime.hardware.cpuModel
                      ? ` · ${data.runtime.hardware.cpuModel}`
                      : ""}
                  </span>
                  <span>
                    Backend aktywny: {data.runtime.hardware.configuredBackend ?? "nie skonfigurowano"}
                    {" · "}tryb wyboru: {data.runtime.hardware.backendSelectionMode ?? backendPreference}
                    {data.runtime.hardware.accelerators.length > 0
                      ? ` · urządzenia graficzne: ${data.runtime.hardware.accelerators.map((item) => item.name).join(", ")}`
                      : " · brak wykrytego urządzenia graficznego"}
                    {data.runtime.hardware.gpuOffloadEnabled
                      ? " · GPU offload potwierdzony"
                      : data.runtime.hardware.gpuCandidateDetected
                        ? " · GPU wykryte, ale niepotwierdzone jako aktywne"
                        : ""}
                  </span>
                  {data.runtime.qualification &&
                  data.runtime.qualification.modelId === selected.id ? (
                    <span>
                      Walidacja sprzętowa: PASS · {formatTokens(data.runtime.qualification.contextTokens)} tokenów
                      {" · "}backend {data.runtime.qualification.backend ?? data.runtime.hardware.configuredBackend ?? "CPU_X64_PORTABLE"}
                      {" · "}start {data.runtime.qualification.startupMs.toLocaleString("pl-PL")} ms
                      {" · "}{new Date(data.runtime.qualification.validatedAt).toLocaleString("pl-PL")}
                    </span>
                  ) : (
                    <span>Walidacja sprzętowa: brak potwierdzonego profilu dla tego modelu.</span>
                  )}
                  {user.appRole === "ADMIN" && modelUpdate ? (
                    <span>
                      Kanał aktualizacji{" "}
                      {modelUpdate.modelFamily === "BIELIK"
                        ? "Bielik"
                        : modelUpdate.modelFamily === "MISTRAL"
                          ? "Mistral"
                          : "modelu"}:{" "}
                      {modelUpdate.status === "UP_TO_DATE"
                        ? "aktualny"
                        : modelUpdate.status === "AVAILABLE"
                          ? [
                              modelUpdate.signatureMode === "SIGNED_REQUIRED"
                                ? `dostępna podpisana paczka ${modelUpdate.latestPackVersion ?? ""}`
                                : `dostępna paczka ${modelUpdate.latestPackVersion ?? ""} · podpis tymczasowo opcjonalny`,
                              modelUpdate.targetDisplayName
                                ? `→ ${modelUpdate.targetDisplayName}`
                                : "",
                              modelUpdate.targetBytes
                                ? `(${formatBytes(modelUpdate.targetBytes)})`
                                : ""
                            ].filter(Boolean).join(" ")
                          : modelUpdate.status === "NOT_CONFIGURED"
                            ? "model nie jest jeszcze skonfigurowany"
                            : modelUpdate.status === "UNAVAILABLE"
                              ? "sprawdzenie niedostępne"
                              : `zablokowany bezpiecznie: ${modelPackBlockLabel(modelUpdate.blockedReason)}`}
                    </span>
                  ) : null}
                </div>

                {modelUpdate?.signatureMode === "UNSIGNED_ALLOWED" ? (
                  <p className="local-ai-warning">
                    Tryb przejściowy aktualizacji modeli: podpis Ed25519 indeksu jest opcjonalny.
                    Indeks JSON, HTTPS, zgodność wersji i SHA-256 modelu pozostają obowiązkowe.
                  </p>
                ) : null}

                {extended ? (
                  <p className="local-ai-warning">
                    Wybrana wartość przekracza natywne okno tego modelu. System użyje YaRN;
                    większy kontekst zwiększa zapotrzebowanie na pamięć i nie gwarantuje takiej
                    samej jakości jak natywne okno modelu.
                  </p>
                ) : null}
              </>
            ) : null}

            {data.runtime.progress ? (
              <div className="local-ai-progress">
                <div>
                  <strong>
                    {progressLabel(data.runtime.progress.phase)}
                  </strong>
                  <small>
                    {data.runtime.progress.label}
                  </small>
                </div>
                {data.runtime.progress.percent !== null ? (
                  <progress
                    max={100}
                    value={data.runtime.progress.percent}
                  />
                ) : data.runtime.provisioning ? (
                  <progress />
                ) : null}
                <small>
                  {formatBytes(data.runtime.progress.bytesDownloaded)}
                  {data.runtime.progress.bytesTotal !== null
                    ? ` / ${formatBytes(data.runtime.progress.bytesTotal)}`
                    : ""}
                  {data.runtime.progress.percent !== null
                    ? ` · ${data.runtime.progress.percent}%`
                    : ""}
                </small>
              </div>
            ) : null}

            {user.appRole === "ADMIN" ? (
              <>
                <button
                  type="button"
                  className="local-ai-primary"
                  disabled={!canProvision}
                  onClick={() => void provision()}
                >
                  {busy || data.runtime.provisioning
                    ? "Operacja w toku…"
                    : configured
                      ? "Zmień model / kontekst / backend"
                      : "Pobierz i skonfiguruj lokalną AI"}
                </button>

                {configured ? (
                  <div className="local-ai-actions">
                    <button
                      type="button"
                      disabled={busy || data.runtime.state === "READY"}
                      onClick={() => void startLocal()}
                    >
                      Uruchom
                    </button>
                    <button
                      type="button"
                      disabled={busy || data.runtime.state === "STOPPED"}
                      onClick={() => void stopLocal()}
                    >
                      Zatrzymaj
                    </button>
                    <button
                      type="button"
                      disabled={busy || data.runtime.provisioning}
                      onClick={() => void repair()}
                    >
                      Napraw
                    </button>
                    <button
                      type="button"
                      disabled={
                        busy ||
                        data.runtime.provisioning ||
                        modelUpdate?.status !== "AVAILABLE" ||
                        !selected ||
                        modelUpdate.modelId !==
                          selected.id
                      }
                      onClick={() => void applyModelUpdate()}
                    >
                      Aktualizuj model
                    </button>
                    <button
                      type="button"
                      className="local-ai-danger"
                      disabled={busy || !selected?.installed}
                      onClick={() => void removeSelected()}
                    >
                      Usuń model
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <small>Instalację, naprawę lub usunięcie modelu lokalnego może wykonać administrator aplikacji.</small>
            )}
          </>
        ) : null}

        {message ? <p className="local-ai-message">{message}</p> : null}
        {error ? <p className="local-ai-error">{error}</p> : null}
      </div>
    </details>
  );
}
