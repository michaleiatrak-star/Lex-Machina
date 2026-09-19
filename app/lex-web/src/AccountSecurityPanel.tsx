import {
  useState
} from "react";
import {
  ApiError,
  changePassword,
  createRecoveryCode,
  type AuthMeResponse,
  type AuthenticatedUser
} from "./api.js";

export function AccountSecurityPanel({
  user,
  onAuthUpdated
}: {
  user: AuthenticatedUser;
  onAuthUpdated: (
    value: AuthMeResponse
  ) => void;
}) {
  const [setupPassword, setSetupPassword] =
    useState("");
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [recoveryCode, setRecoveryCode] =
    useState("");
  const [message, setMessage] =
    useState("");
  const [error, setError] =
    useState("");
  const [busy, setBusy] =
    useState(false);

  async function createCode():
    Promise<void> {
    if (!setupPassword || busy) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result =
        await createRecoveryCode(
          setupPassword
        );
      setSetupPassword("");
      setRecoveryCode(
        result.recoveryCode
      );
      setMessage(
        "Nowy kod recovery został utworzony. Poprzedni kod recovery, jeśli istniał, został unieważniony."
      );
    } catch (failure) {
      setSetupPassword("");
      setError(
        failure instanceof ApiError &&
        failure.code ===
          "INVALID_CREDENTIALS"
          ? "Bieżące hasło jest nieprawidłowe."
          : "Nie udało się utworzyć kodu recovery."
      );
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword():
    Promise<void> {
    if (
      !currentPassword ||
      !newPassword ||
      busy
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result =
        await changePassword({
          currentPassword,
          newPassword
        });
      setCurrentPassword("");
      setNewPassword("");
      onAuthUpdated({
        user: result.user,
        session:
          result.session
      });
      if (result.recoveryCode) {
        setRecoveryCode(
          result.recoveryCode
        );
      }
      setMessage(
        user.passwordSetupPending
          ? "Hasło zostało zmienione. Początkowe hasło admin przestało działać, a nowy kod recovery został wygenerowany."
          : "Hasło zostało zmienione. Pozostałe sesje zostały unieważnione; sprawy zachowały te same klucze danych."
      );
    } catch (failure) {
      setCurrentPassword("");
      setNewPassword("");
      if (
        failure instanceof ApiError &&
        failure.code ===
          "INVALID_PASSWORD_CHANGE"
      ) {
        setError(
          "Nowe hasło nie spełnia polityki: co najmniej 10 znaków, maksymalnie 128."
        );
      } else if (
        failure instanceof ApiError &&
        failure.code ===
          "INVALID_CREDENTIALS"
      ) {
        setError(
          "Bieżące hasło jest nieprawidłowe."
        );
      } else {
        setError(
          "Nie udało się zmienić hasła."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="account-security-panel">
      <div>
        <p className="eyebrow">
          Bezpieczeństwo konta
        </p>
        <h3>
          {user.passwordSetupPending
            ? "Zmień początkowe hasło"
            : "Hasło i odzyskiwanie"}
        </h3>
        {user.passwordSetupPending && (
          <div className="alert">
            Początkowe dane logowania to admin / admin. Hasło admin jest tymczasowe i musi zostać zmienione przed użyciem aplikacji. Nowe hasło musi mieć co najmniej 10 znaków.
          </div>
        )}
        <p className="field-help">
          Kod recovery odblokowuje ten sam lokalny klucz użytkownika. Nie przechowuj go razem z komputerem.
        </p>
      </div>

      <div className="account-security-grid">
        {!user.passwordSetupPending && (
        <div>
          <h4>Kod recovery</h4>
          <label>
            Potwierdź bieżące hasło
            <input
              type="password"
              autoComplete="current-password"
              value={
                setupPassword
              }
              maxLength={128}
              onChange={(event) =>
                setSetupPassword(
                  event.target.value
                )
              }
            />
          </label>
          <button
            type="button"
            className="secondary-button"
            disabled={
              busy ||
              !setupPassword
            }
            onClick={() => {
              void createCode();
            }}
          >
            Wygeneruj nowy kod recovery
          </button>

          {recoveryCode && (
            <div className="recovery-code-box">
              <strong>
                Zapisz ten kod teraz
              </strong>
              <code>
                {recoveryCode}
              </code>
              <p>
                Kod jest pokazany tylko w pamięci tej sesji UI. Wygenerowanie kolejnego kodu unieważni ten.
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setRecoveryCode("")
                }
              >
                Ukryj kod
              </button>
            </div>
          )}
        </div>
        )}

        <div>
          <h4>
            {user.passwordSetupPending
              ? "Ustaw hasło"
              : "Zmiana hasła"}
          </h4>
          <label>
            {user.passwordSetupPending
              ? "Początkowe hasło"
              : "Bieżące hasło"}
            <input
              type="password"
              autoComplete="current-password"
              value={
                currentPassword
              }
              maxLength={128}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
            />
          </label>
          <label>
            Nowe hasło
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              maxLength={128}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
            />
          </label>
          <button
            type="button"
            className="primary-button"
            disabled={
              busy ||
              !currentPassword ||
              !newPassword
            }
            onClick={() => {
              void updatePassword();
            }}
          >
            Zmień hasło
          </button>
        </div>
      </div>

      {message && (
        <div className="alert account-security-message">
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
    </section>
  );
}
