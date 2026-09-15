import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  executeSession,
  getHealth,
  getModels,
  getRoutes,
  validateRoute,
  type ModelDescriptor,
  type ProviderId,
  type SessionExecutionResponse
} from "./api.js";

const PROVIDERS: Array<{
  id: ProviderId;
  label: string;
}> = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic / Claude" },
  { id: "xai", label: "xAI / Grok" }
];

function labelForDr(value: string): string {
  return value
    .replace(/^dr-(\d{2})-/, "DR-$1 · ")
    .replaceAll("-", " ");
}

export default function App() {
  const [runtimeOnline, setRuntimeOnline] = useState(false);
  const [runtimeError, setRuntimeError] = useState("");
  const [provider, setProvider] = useState<ProviderId>("openai");
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

  useEffect(() => {
    let cancelled = false;

    Promise.all([getHealth(), getRoutes()])
      .then(([health, routeList]) => {
        if (cancelled) return;
        setRuntimeOnline(
          health.status === "ok" && health.localOnly === true
        );
        setRoutes(routeList.primarySkills);
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

  useEffect(() => {
    let cancelled = false;
    setModels([]);
    setModel("");
    setModelError("");
    setExecution(null);
    setExecutionError("");

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
  }, [provider]);

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
        mode: "PRAWNIK"
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
            <small>127.0.0.1:4317</small>
          </div>
        </div>

        <div className="privacy-note">
          <strong>Klucze API pozostają lokalnie.</strong>
          <span>
            Przeglądarka nie otrzymuje sekretów ani treści SKILL.md.
          </span>
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

        <section className="config-grid">
          <article className="config-card">
            <span className="step">01</span>
            <label htmlFor="provider">Dostawca modelu</label>
            <select
              id="provider"
              value={provider}
              onChange={(event) =>
                setProvider(event.target.value as ProviderId)
              }
            >
              {PROVIDERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="field-help">
              Lista modeli jest pobierana z API providera przez lokalny
              backend.
            </p>
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

          <article className="config-card config-card-wide">
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
            <p className="field-help">
              Treść zostanie przesłana do wybranego providera dopiero po
              uruchomieniu analizy. Wynik z niezweryfikowanym powołaniem
              prawnym zostanie zatrzymany przez HARD GATE.
            </p>
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
          </dl>
          <button
            type="button"
            className="primary-button"
            onClick={runAnalysis}
            disabled={
              executing ||
              !runtimeOnline ||
              !model ||
              routeStatus !== "valid" ||
              !query.trim()
            }
          >
            {executing ? "Analizuję…" : "Uruchom analizę"}
          </button>
        </section>

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
            <footer className="result-meta">
              Sesja {execution.sessionId} · audit {execution.audit.result} ·
              {execution.audit.eventCount} zdarzeń
            </footer>
          </section>
        )}
      </main>
    </div>
  );
}
