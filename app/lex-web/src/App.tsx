import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  getHealth,
  getModels,
  getRoutes,
  validateRoute,
  type ModelDescriptor,
  type ProviderId
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
            className="secondary-button"
            disabled
            title="Wykonanie zapytania zostanie podłączone w następnym gate"
          >
            Uruchom analizę
          </button>
        </section>
      </main>
    </div>
  );
}
