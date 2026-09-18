import {
  useEffect,
  useState
} from "react";
import {
  activateSupport,
  deactivateSupport,
  getSupportDiagnostics,
  getSupportSession,
  getSupportStatus,
  issueSupportChallenge,
  type SignedSupportEntitlement,
  type SupportChallengeResponse,
  type SupportSessionInfo,
  type SupportStatusResponse
} from "./api.js";

function failureText(
  error: unknown
): string {
  return error instanceof Error
    ? error.message
    : String(error);
}

export function AdminSupportPanel() {
  const [status, setStatus] =
    useState<
      SupportStatusResponse |
      null
    >(null);
  const [
    challenge,
    setChallenge
  ] = useState<
    SupportChallengeResponse |
    null
  >(null);
  const [
    entitlementText,
    setEntitlementText
  ] = useState("");
  const [
    serviceSession,
    setServiceSession
  ] = useState<
    SupportSessionInfo |
    null
  >(null);
  const [busy, setBusy] =
    useState(false);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");

  async function refresh():
    Promise<void> {
    const next =
      await getSupportStatus();
    setStatus(next);
    try {
      const active =
        await getSupportSession();
      setServiceSession(
        active.session
      );
    } catch {
      setServiceSession(null);
    }
  }

  useEffect(() => {
    void refresh().catch(
      (failure) => {
        setError(
          failureText(failure)
        );
      }
    );
  }, []);

  async function createChallenge():
    Promise<void> {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next =
        await issueSupportChallenge();
      if (
        !next.challengeSignature
      ) {
        throw new Error(
          "SUPPORT_NATIVE_CHALLENGE_PROOF_MISSING"
        );
      }
      setChallenge(next);
      setMessage(
        "Challenge urządzenia został utworzony. Przekaż cały JSON autoryzowanemu wsparciu; nie zawiera klucza prywatnego."
      );
    } catch (failure) {
      setError(
        failureText(failure)
      );
    } finally {
      setBusy(false);
    }
  }

  async function activate():
    Promise<void> {
    if (
      busy ||
      !entitlementText.trim()
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const parsed =
        JSON.parse(
          entitlementText
        ) as
          SignedSupportEntitlement;
      const activated =
        await activateSupport(
          parsed
        );
      setServiceSession(
        activated.session
      );
      setEntitlementText("");
      setChallenge(null);
      await getSupportDiagnostics();
      await refresh();
      setMessage(
        "Sesja SERVICE została aktywowana lokalnie. Token pozostaje po stronie natywnego bridge’a; sama sesja nie daje dostępu do treści spraw ani reidentyfikacji."
      );
    } catch (failure) {
      setError(
        failureText(failure)
      );
    } finally {
      setBusy(false);
    }
  }

  async function deactivate():
    Promise<void> {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await deactivateSupport();
      setServiceSession(null);
      await refresh();
      setMessage(
        "Sesja SERVICE została zakończona."
      );
    } catch (failure) {
      setError(
        failureText(failure)
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-users-panel">
      <div>
        <p className="eyebrow">
          Wsparcie serwisowe
        </p>
        <h3>
          Tymczasowa sesja SERVICE
        </h3>
        <p className="field-help">
          Aktywacja wymaga podpisanego uprawnienia powiązanego z tą instalacją i jawnej zgody lokalnego ADMIN. Nie istnieje wspólne hasło serwisowe.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {message && (
        <div className="alert">
          {message}
        </div>
      )}

      {status && (
        <div className="field-help">
          Instalacja:{" "}
          <code>
            {status.installationId}
          </code>
          {" · "}
          klucz dostawcy:{" "}
          {status.configured
            ? status.vendorKeyId ??
              "skonfigurowany"
            : "brak — aktywacja zablokowana"}
          {" · "}
          tożsamość urządzenia:{" "}
          {status.nativeIdentityReady
            ? "gotowa"
            : "niedostępna"}
        </div>
      )}

      {serviceSession ? (
        <div>
          <p>
            <strong>
              SERVICE aktywny
            </strong>
            {" · "}
            {serviceSession.ticket}
            {" · wygasa "}
            {new Date(
              serviceSession.expiresAt
            ).toLocaleString(
              "pl-PL"
            )}
          </p>
          <p className="field-help">
            Uprawnienia:{" "}
            {serviceSession
              .capabilities
              .join(", ")}
          </p>
          <button
            type="button"
            className="danger-button"
            disabled={busy}
            onClick={() => {
              void deactivate();
            }}
          >
            Zakończ SERVICE
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            disabled={
              busy ||
              !status?.configured ||
              !status
                ?.nativeIdentityReady
            }
            onClick={() => {
              void createChallenge();
            }}
          >
            Utwórz challenge
          </button>

          {challenge && (
            <label>
              Challenge dla wsparcia
              <textarea
                readOnly
                rows={10}
                value={JSON.stringify(
                  challenge,
                  null,
                  2
                )}
              />
            </label>
          )}

          <label>
            Podpisane uprawnienie SERVICE
            <textarea
              rows={12}
              value={
                entitlementText
              }
              placeholder="Wklej JSON otrzymany od autoryzowanego wsparcia"
              onChange={(event) =>
                setEntitlementText(
                  event.target.value
                )
              }
            />
          </label>
          <button
            type="button"
            disabled={
              busy ||
              !status?.configured ||
              !status
                ?.nativeIdentityReady ||
              !entitlementText.trim()
            }
            onClick={() => {
              void activate();
            }}
          >
            Zatwierdź i aktywuj SERVICE
          </button>
        </>
      )}
    </section>
  );
}
