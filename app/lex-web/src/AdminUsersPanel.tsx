import {
  useEffect,
  useState
} from "react";
import {
  ApiError,
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  setAdminUserStatus,
  type AuthenticatedUser
} from "./api.js";

function errorMessage(
  failure: unknown
): string {
  if (!(failure instanceof ApiError)) {
    return failure instanceof Error
      ? failure.message
      : String(failure);
  }
  if (
    failure.code ===
      "USER_DELETE_REQUIRES_DISABLE"
  ) {
    return "Najpierw dezaktywuj konto.";
  }
  if (
    failure.code ===
      "USER_DELETE_REQUIRES_CASE_CLEANUP"
  ) {
    return "Konto ma powiązania ze sprawami. Najpierw usuń lub przenieś jego uprawnienia i wykonaj wymagane rotacje kluczy.";
  }
  if (
    failure.code ===
      "ACCOUNT_LOGIN_EXISTS"
  ) {
    return "Taki login już istnieje.";
  }
  if (
    failure.code ===
      "INVALID_USER_REQUEST"
  ) {
    return "Sprawdź login, nazwę i hasło. Hasło musi spełniać politykę bezpieczeństwa.";
  }
  if (
    failure.code ===
      "SELF_ADMIN_MUTATION_DENIED"
  ) {
    return "Nie można wyłączyć ani usunąć własnego konta administracyjnego.";
  }
  return failure.code;
}

export function AdminUsersPanel({
  currentUserId
}: {
  currentUserId: string;
}) {
  const [users, setUsers] =
    useState<AuthenticatedUser[]>([]);
  const [loginName, setLoginName] =
    useState("");
  const [displayName, setDisplayName] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [busy, setBusy] =
    useState(false);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");

  async function refresh():
    Promise<void> {
    const result =
      await listAdminUsers();
    setUsers(result.users);
  }

  useEffect(() => {
    void refresh()
      .catch((failure) => {
        setError(
          errorMessage(failure)
        );
      });
  }, []);

  async function createUser():
    Promise<void> {
    if (
      !loginName.trim() ||
      !displayName.trim() ||
      !password
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await createAdminUser({
        loginName,
        displayName,
        password
      });
      setLoginName("");
      setDisplayName("");
      setPassword("");
      await refresh();
      setMessage(
        "Użytkownik został utworzony."
      );
    } catch (failure) {
      setError(
        errorMessage(failure)
      );
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(
    user: AuthenticatedUser
  ): Promise<void> {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const status =
        user.status === "ACTIVE"
          ? "DISABLED"
          : "ACTIVE";
      await setAdminUserStatus(
        user.userId,
        status
      );
      await refresh();
      setMessage(
        status === "DISABLED"
          ? "Konto zostało dezaktywowane, a jego aktywne sesje unieważnione."
          : "Konto zostało ponownie aktywowane."
      );
    } catch (failure) {
      setError(
        errorMessage(failure)
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeUser(
    user: AuthenticatedUser
  ): Promise<void> {
    if (
      !window.confirm(
        `Trwale usunąć konto @${user.loginName}? Operacja jest możliwa tylko dla dezaktywowanego konta bez powiązań ze sprawami.`
      )
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await deleteAdminUser(
        user.userId
      );
      await refresh();
      setMessage(
        "Konto zostało trwale usunięte."
      );
    } catch (failure) {
      setError(
        errorMessage(failure)
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-users-panel">
      <div>
        <p className="eyebrow">
          Administracja
        </p>
        <h3>Użytkownicy</h3>
        <p className="field-help">
          Dezaktywacja natychmiast unieważnia sesje. Trwałe usunięcie jest dozwolone dopiero po dezaktywacji i tylko bez powiązań ze sprawami.
        </p>
      </div>

      <div className="admin-user-create">
        <label>
          Login
          <input
            value={loginName}
            maxLength={64}
            autoComplete="off"
            onChange={(event) =>
              setLoginName(
                event.target.value
              )
            }
          />
        </label>
        <label>
          Nazwa użytkownika
          <input
            value={displayName}
            maxLength={160}
            autoComplete="off"
            onChange={(event) =>
              setDisplayName(
                event.target.value
              )
            }
          />
        </label>
        <label>
          Hasło początkowe
          <input
            type="password"
            value={password}
            maxLength={128}
            autoComplete="new-password"
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
          />
        </label>
        <button
          type="button"
          disabled={
            busy ||
            !loginName.trim() ||
            !displayName.trim() ||
            !password
          }
          onClick={() => {
            void createUser();
          }}
        >
          Dodaj użytkownika
        </button>
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

      <div className="admin-users-list">
        {users.map((user) => (
          <article
            key={user.userId}
            className="admin-user-row"
          >
            <div>
              <strong>
                {user.displayName}
              </strong>
              <span>
                @{user.loginName} · {user.appRole} · {user.status}
              </span>
            </div>
            {user.userId !==
              currentUserId &&
              user.appRole ===
                "USER" && (
                <div className="admin-user-actions">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      void changeStatus(
                        user
                      );
                    }}
                  >
                    {user.status ===
                    "ACTIVE"
                      ? "Dezaktywuj"
                      : "Aktywuj"}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    disabled={
                      busy ||
                      user.status !==
                        "DISABLED"
                    }
                    onClick={() => {
                      void removeUser(
                        user
                      );
                    }}
                  >
                    Usuń
                  </button>
                </div>
              )}
          </article>
        ))}
      </div>
    </section>
  );
}
