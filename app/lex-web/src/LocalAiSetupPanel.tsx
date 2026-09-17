import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  apiBase,
  isDesktopShell,
  type AuthenticatedUser
} from "./api.js";
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
  qualification: {
    schemaVersion: 1;
    result: "PASS";
    modelId: string;
    contextTokens: number;
    contextMode:
      | "NATIVE_OR_REDUCED"
      | "YARN_EXTENDED";
    engine: "llama.cpp";
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
    gpuOffloadEnabled: false;
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

async function request<T>(
  pathname: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBase()}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
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

function contextLabel(
  tokens: number,
  nativeContext: number
): string {
  return tokens > nativeContext
    ? `${formatTokens(tokens)} · rozszerzony YaRN`
    : `${formatTokens(tokens)} · w granicach natywnych`;
}

export function LocalAiSetupPanel({
  user
}: {
  user: AuthenticatedUser;
}) {
  const [data, setData] = useState<LocalModelsResponse | null>(null);
  const [modelId, setModelId] = useState("");
  const [contextTokens, setContextTokens] = useState(64_000);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      const next = await request<LocalModelsResponse>("/api/local-models");
      setData(next);
      const preferred =
        next.runtime.selectedModelId ??
        next.models[0]?.id ??
        "";
      setModelId((current) =>
        current && next.models.some((item) => item.id === current)
          ? current
          : preferred
      );
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
      setError("");
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    }
  }

  useEffect(() => {
    void refresh();
  }, [available]);

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
  }, [selected?.id]);

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
            contextTokens
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

  return (
    <details className="local-ai-setup" open={!configured}>
      <summary>
        <span>
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
                    Backend inference: {data.runtime.hardware.packagedBackend}
                    {data.runtime.hardware.accelerators.length > 0
                      ? ` · GPU wykryte: ${data.runtime.hardware.accelerators.map((item) => item.name).join(", ")}`
                      : " · brak wykrytego GPU"}
                    {!data.runtime.hardware.gpuOffloadEnabled &&
                    data.runtime.hardware.accelerators.length > 0
                      ? " · GPU nie jest używane przez obecny pakiet"
                      : ""}
                  </span>
                  {data.runtime.qualification &&
                  data.runtime.qualification.modelId === selected.id ? (
                    <span>
                      Walidacja sprzętowa: PASS · {formatTokens(data.runtime.qualification.contextTokens)} tokenów
                      {" · "}start {data.runtime.qualification.startupMs.toLocaleString("pl-PL")} ms
                      {" · "}{new Date(data.runtime.qualification.validatedAt).toLocaleString("pl-PL")}
                    </span>
                  ) : (
                    <span>Walidacja sprzętowa: brak potwierdzonego profilu dla tego modelu.</span>
                  )}
                </div>

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
                      ? "Zmień model / kontekst"
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
