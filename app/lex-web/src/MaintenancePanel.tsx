import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  ApiError,
  applySkillUpdate,
  downloadApplicationUpdate,
  getSkillUpdateStatus,
  getUpdateStatus,
  installStagedApplicationUpdate,
  isDesktopShell,
  type ApplicationUpdateDownloadResponse,
  type AuthenticatedUser,
  type SkillUpdateStatusResponse,
  type UpdateStatusResponse
} from "./api.js";
import {
  useFloatingPanelDrag
} from "./use-floating-panel.js";
import "./maintenance.css";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function friendlyError(error: unknown): string {
  const code =
    error instanceof ApiError
      ? error.code
      : error instanceof Error
        ? error.message
        : String(error);

  if (
    code.includes("SIGNER_POLICY_MISSING") ||
    code.includes("SIGNER_NOT_TRUSTED") ||
    code.includes("SIGNATURE_INVALID") ||
    code.includes("NOT_VERIFIED")
  ) {
    return "Aktualizacja programu jest zablokowana przez politykę bezpieczeństwa: produkcyjny podpis Authenticode nie został jeszcze poprawnie skonfigurowany albo nie przeszedł weryfikacji.";
  }
  if (code === "APPLICATION_UPDATE_NOT_AVAILABLE") {
    return "Brak nowszej wersji programu do pobrania.";
  }
  if (code === "SKILL_UPDATE_NOT_AVAILABLE") {
    return "Brak nowszego pakietu skilli do zastosowania.";
  }
  return code;
}

export function MaintenancePanel({
  user
}: {
  user: AuthenticatedUser;
}) {
  const [appStatus, setAppStatus] =
    useState<UpdateStatusResponse | null>(null);
  const [skillStatus, setSkillStatus] =
    useState<SkillUpdateStatusResponse | null>(null);
  const [staged, setStaged] =
    useState<ApplicationUpdateDownloadResponse | null>(null);
  const [busy, setBusy] = useState<
    "refresh" | "app-download" | "app-install" | "skills" | null
  >(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [
    minimized,
    setMinimized
  ] = useState(true);
  const floatingDrag =
    useFloatingPanelDrag();

  const desktop = isDesktopShell();
  const appUpdateAvailable =
    appStatus?.status === "AVAILABLE";
  const skillUpdateAvailable =
    skillStatus?.status === "AVAILABLE" &&
    skillStatus.bundleReady;

  const badge = useMemo(() => {
    if (appUpdateAvailable || skillUpdateAvailable) {
      return "AKTUALIZACJA";
    }
    if (appStatus?.status === "UNAVAILABLE") {
      return "OFFLINE";
    }
    return "AKTUALNE";
  }, [
    appStatus?.status,
    appUpdateAvailable,
    skillUpdateAvailable
  ]);

  async function refresh(): Promise<void> {
    if (!desktop || busy) return;
    setBusy("refresh");
    setError("");
    try {
      const [application, skills] =
        await Promise.all([
          getUpdateStatus(),
          user.appRole === "ADMIN"
            ? getSkillUpdateStatus()
            : Promise.resolve(null)
        ]);
      setAppStatus(application);
      setSkillStatus(skills);
    } catch (problem) {
      setError(friendlyError(problem));
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    void refresh();
  }, [desktop, user.appRole]);

  async function downloadUpdate(): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      busy ||
      !appUpdateAvailable
    ) {
      return;
    }
    setBusy("app-download");
    setError("");
    setMessage(
      "Pobieram instalator do stagingu i weryfikuję SHA-256, ProductVersion oraz wymaganą politykę Authenticode."
    );
    try {
      const result =
        await downloadApplicationUpdate();
      setStaged(result);
      setMessage(
        result.publisher.verification === "AUTHENTICODE"
          ? `Zweryfikowano ${result.filename} (${formatBytes(result.bytes)}). Authenticode + ProductVersion ${result.publisher.productVersion}: PASS. Aktualizacja jest gotowa do instalacji.`
          : `Zweryfikowano ${result.filename} (${formatBytes(result.bytes)}). SHA-256 + ProductVersion ${result.publisher.productVersion}: PASS. UWAGA: aktualizacja bez podpisu jest tymczasowo dozwolona.`
      );
    } catch (problem) {
      setMessage("");
      setError(friendlyError(problem));
    } finally {
      setBusy(null);
    }
  }

  async function installUpdate(): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      busy ||
      !staged
    ) {
      return;
    }
    setBusy("app-install");
    setError("");
    setMessage(
      "Przekazuję aktualizację do zewnętrznej transakcji. Program zostanie zamknięty, zaktualizowany, sprawdzony i uruchomiony ponownie."
    );
    try {
      await installStagedApplicationUpdate(
        staged.receiptToken
      );
    } catch (problem) {
      setBusy(null);
      setMessage("");
      setError(friendlyError(problem));
    }
  }

  async function updateSkills(): Promise<void> {
    if (
      user.appRole !== "ADMIN" ||
      busy ||
      !skillUpdateAvailable
    ) {
      return;
    }
    setBusy("skills");
    setError("");
    setMessage(
      "Pobieram, waliduję i atomowo aktywuję nowy pakiet skilli."
    );
    try {
      const result = await applySkillUpdate();
      setMessage(
        `Skille zaktualizowano z ${result.previousVersion} do ${result.installedVersion}. Uruchom ponownie program, aby runtime załadował nowy pakiet.`
      );
      const next = await getSkillUpdateStatus();
      setSkillStatus(next);
    } catch (problem) {
      setMessage("");
      setError(friendlyError(problem));
    } finally {
      setBusy(null);
    }
  }

  if (!desktop) return null;

  if (minimized) {
    return (
      <div
        className="maintenance-panel maintenance-panel-minimized"
        data-floating-panel="true"
        style={
          floatingDrag.style
        }
      >
        <span
          className="floating-drag-handle"
          title="Przeciągnij panel"
          aria-label="Przeciągnij panel utrzymania"
          {...floatingDrag.handleProps}
        >
          ⋮⋮
        </span>
        <button
          type="button"
          className="floating-icon-button"
          aria-label="Rozwiń panel utrzymania"
          title={
            `Utrzymanie · ${badge.toLowerCase()}`
          }
          onClick={() =>
            setMinimized(false)
          }
        >
          🛠
        </button>
        {badge === "AKTUALIZACJA" ? (
          <span
            className="floating-update-dot"
            aria-label="Dostępna aktualizacja"
          />
        ) : null}
      </div>
    );
  }

  return (
    <details
      className="maintenance-panel"
      data-floating-panel="true"
      style={
        floatingDrag.style
      }
    >
      <summary>
        <span
          className="floating-drag-handle"
          title="Przeciągnij panel"
          aria-label="Przeciągnij panel utrzymania"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          {...floatingDrag.handleProps}
        >
          ⋮⋮
        </span>
        <span className="maintenance-title">
          <strong>Utrzymanie</strong>
          <small>
            program · skille · bezpieczne aktualizacje
          </small>
        </span>
        <span
          className={
            badge === "AKTUALIZACJA"
              ? "maintenance-badge update"
              : "maintenance-badge"
          }
        >
          {badge}
        </span>
        <button
          type="button"
          className="floating-minimize-button"
          aria-label="Zminimalizuj panel utrzymania"
          title="Zminimalizuj do ikony"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setMinimized(true);
          }}
        >
          −
        </button>
      </summary>

      <div className="maintenance-body">
        <section>
          <div className="maintenance-heading">
            <div>
              <strong>Program</strong>
              <small>
                {appStatus
                  ? `${appStatus.currentVersion} → ${appStatus.latestVersion ?? "—"}`
                  : "sprawdzanie…"}
              </small>
            </div>
            <span>{appStatus?.status ?? "—"}</span>
          </div>

          <small className="maintenance-trust-warning">
            Aktualizacja programu wymaga weryfikacji SHA-256, wersji oraz zaufanego podpisu Authenticode zgodnie z polityką runtime.
          </small>

          {user.appRole === "ADMIN" ? (
            <div className="maintenance-actions">
              <button
                type="button"
                disabled={
                  Boolean(busy) ||
                  !appUpdateAvailable
                }
                onClick={() =>
                  void downloadUpdate()
                }
              >
                {busy === "app-download"
                  ? "Pobieranie i weryfikacja…"
                  : staged
                    ? "Pobierz ponownie"
                    : "Pobierz i zweryfikuj"}
              </button>
              <button
                type="button"
                disabled={
                  Boolean(busy) ||
                  !staged
                }
                onClick={() =>
                  void installUpdate()
                }
              >
                Zainstaluj i uruchom ponownie
              </button>
            </div>
          ) : (
            <small>
              Aktualizację programu instaluje administrator.
            </small>
          )}
        </section>

        <section>
          <div className="maintenance-heading">
            <div>
              <strong>Skille</strong>
              <small>
                {skillStatus
                  ? `${skillStatus.currentVersion} → ${skillStatus.latestVersion ?? "—"}`
                  : user.appRole === "ADMIN"
                    ? "sprawdzanie…"
                    : "status dostępny administratorowi"}
              </small>
            </div>
            <span>
              {skillStatus?.status ?? "—"}
            </span>
          </div>

          {skillStatus?.signatureMode === "UNSIGNED_ALLOWED" ? (
            <small className="maintenance-trust-warning">
              Skille mogą być aktualizowane bez Ed25519 wyłącznie z oficjalnego GitHub Releases Lex Machina. Indeks JSON, zgodność wersji, SHA-256 assetu i bundla, rozmiar oraz walidacja strukturalna nadal są obowiązkowe.
            </small>
          ) : null}

          {skillStatus?.blockedReason ? (
            <small className="maintenance-trust-warning">
              {skillStatus.blockedReason === "SIGNER_POLICY_MISSING"
                ? "Aktualizacja skilli jest zablokowana przez politykę zaufania."
                : skillStatus.blockedReason === "INDEX_MISSING"
                  ? "Release nie zawiera wymaganego indeksu skilli JSON."
                  : "W trybie wymagającym podpisu release nie zawiera kompletnego indeksu .json + .sig."}
            </small>
          ) : null}

          {user.appRole === "ADMIN" ? (
            <button
              type="button"
              disabled={
                Boolean(busy) ||
                !skillUpdateAvailable
              }
              onClick={() =>
                void updateSkills()
              }
            >
              {busy === "skills"
                ? "Walidacja i aktywacja…"
                : "Zaktualizuj skille"}
            </button>
          ) : null}
        </section>

        <button
          type="button"
          className="maintenance-refresh"
          disabled={Boolean(busy)}
          onClick={() => void refresh()}
        >
          Sprawdź ponownie
        </button>

        {message ? (
          <p className="maintenance-message">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="maintenance-error">
            {error}
          </p>
        ) : null}
      </div>
    </details>
  );
}
