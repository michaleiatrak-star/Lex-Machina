import {
  useState
} from "react";
import {
  ApiError,
  recoverAccount,
  type AuthMeResponse
} from "./api.js";

export function RecoveryAuthPanel({
  initialLoginName = "",
  onAuthenticated,
  onCancel
}: {
  initialLoginName?: string;
  onAuthenticated: (
    value: AuthMeResponse
  ) => void;
  onCancel: () => void;
}) {
  const [loginName, setLoginName] =
    useState(
      initialLoginName
    );
  const [recoveryCode, setRecoveryCode] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [replacementCode, setReplacementCode] =
    useState("");
  const [pendingAuth, setPendingAuth] =
    useState<AuthMeResponse | null>(
      null
    );
  const [error, setError] =
    useState("");
  const [busy, setBusy] =
    useState(false);

  async function recover():
    Promise<void> {
    if (
      !loginName.trim() ||
      !recoveryCode ||
      !newPassword ||
      busy
    ) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result =
        await recoverAccount({
          loginName,
          recoveryCode,
          newPassword
        });
      setRecoveryCode("");
      setNewPassword("");
      setReplacementCode(
        result.recoveryCode
      );
      setPendingAuth({
        user: result.user,
        session:
          result.session
      });
    } catch (failure) {
      setRecoveryCode("");
      setNewPassword("");
      if (
        failure instanceof ApiError &&
        failure.code ===
          "INVALID_RECOVERY_REQUEST"
      ) {
        setError(
          "Sprawdź login oraz nowe hasło. Nowe hasło musi mieć co najmniej 15 znaków."
        );
      } else {
        setError(
          "Nieprawidłowy login lub kod recovery."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  if (
    pendingAuth &&
    replacementCode
  ) {
    return (
      <main className="auth-shell">
        <section className="auth-card recovery-confirm-card">
          <p className="eyebrow">
            Recovery zakończone
          </p>
          <h1>
            Zapisz nowy kod recovery
          </h1>
          <p className="auth-copy">
            Poprzedni kod został unieważniony. Ten kod jest nową drogą odzyskania tego samego lokalnego klucza użytkownika.
          </p>
          <div className="recovery-code-box">
            <code>
              {replacementCode}
            </code>
            <p>
              Przechowuj go poza tym komputerem. Po przejściu dalej aplikacja nie będzie mogła ponownie go wyświetlić.
            </p>
          </div>
          <button
            type="button"
            className="primary-button auth-submit"
            onClick={() =>
              onAuthenticated(
                pendingAuth
              )
            }
          >
            Zapisałem kod — przejdź do aplikacji
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark auth-brand">
          LM
        </div>
        <p className="eyebrow">
          Odzyskiwanie lokalnego konta
        </p>
        <h1>
          Użyj kodu recovery
        </h1>
        <p className="auth-copy">
          Recovery odblokuje ten sam UMK i istniejące sprawy, a następnie ustawi nowe hasło i obróci kod recovery.
        </p>

        <label>
          Login
          <input
            value={loginName}
            autoComplete="username"
            maxLength={64}
            onChange={(event) =>
              setLoginName(
                event.target.value
              )
            }
          />
        </label>

        <label>
          Kod recovery
          <input
            type="password"
            value={recoveryCode}
            autoComplete="off"
            onChange={(event) =>
              setRecoveryCode(
                event.target.value
              )
            }
          />
        </label>

        <label>
          Nowe hasło
          <input
            type="password"
            value={newPassword}
            autoComplete="new-password"
            maxLength={128}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
          />
        </label>

        {error && (
          <div className="alert alert-error auth-alert">
            {error}
          </div>
        )}

        <button
          type="button"
          className="primary-button auth-submit"
          disabled={
            busy ||
            !loginName.trim() ||
            !recoveryCode ||
            !newPassword
          }
          onClick={() => {
            void recover();
          }}
        >
          {busy
            ? "Odzyskuję…"
            : "Odzyskaj konto"}
        </button>

        <button
          type="button"
          className="secondary-button auth-change-user"
          disabled={busy}
          onClick={onCancel}
        >
          Wróć do logowania
        </button>
      </section>
    </main>
  );
}
