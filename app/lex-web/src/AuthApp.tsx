import {
  useEffect,
  useMemo,
  useState
} from "react";
import App from "./App.js";
import { AccountSecurityPanel } from "./AccountSecurityPanel.js";
import { AdminUsersPanel } from "./AdminUsersPanel.js";
import { RecoveryAuthPanel } from "./RecoveryAuthPanel.js";
import {
  ApiError,
  bootstrapAdmin,
  clearAuthSession,
  getAuthMe,
  getAuthStatus,
  getHealth,
  lockAuth,
  login,
  logoutAuth,
  isDesktopShell,
  setAuthenticationFailureHandler,
  type AuthMeResponse
} from "./api.js";

type AuthPhase =
  | "checking"
  | "bootstrap"
  | "login"
  | "recover"
  | "authenticated"
  | "locked";

function AuthPanel({
  phase,
  lastUser,
  onAuthenticated,
  onChangeUser,
  onRecover
}: {
  phase: "bootstrap" | "login" | "locked";
  lastUser?: AuthMeResponse["user"];
  onAuthenticated: (
    value: AuthMeResponse
  ) => void;
  onChangeUser: () => void;
  onRecover: () => void;
}) {
  const [loginName, setLoginName] =
    useState(
      phase === "locked"
        ? lastUser?.loginName ?? ""
        : ""
    );
  const [displayName, setDisplayName] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] =
    useState("");
  const [retryAfter, setRetryAfter] =
    useState<string | undefined>();
  const [submitting, setSubmitting] =
    useState(false);
  const nativeUnlock =
    isDesktopShell() &&
    phase !== "bootstrap" &&
    lastUser?.loginName ===
      "local-admin";

  const retryLabel = useMemo(() => {
    if (!retryAfter) return "";
    const timestamp =
      Date.parse(retryAfter);
    if (!Number.isFinite(timestamp)) {
      return "";
    }
    return new Date(
      timestamp
    ).toLocaleTimeString(
      "pl-PL"
    );
  }, [retryAfter]);

  async function submit(): Promise<void> {
    if (
      !loginName.trim() ||
      (
        !nativeUnlock &&
        !password
      ) ||
      (
        phase === "bootstrap" &&
        !displayName.trim()
      )
    ) {
      return;
    }

    setSubmitting(true);
    setError("");
    setRetryAfter(undefined);

    try {
      const result =
        phase === "bootstrap"
          ? await bootstrapAdmin({
              loginName,
              displayName,
              password
            })
          : await login({
              loginName,
              password:
                nativeUnlock
                  ? "__LEX_NATIVE_LOGIN__"
                  : password
            });

      setPassword("");
      onAuthenticated({
        user: result.user,
        session: result.session
      });
    } catch (failure) {
      setPassword("");
      if (
        failure instanceof ApiError &&
        failure.code ===
          "AUTH_BACKOFF_ACTIVE"
      ) {
        setError(
          "Zbyt wiele nieudanych prób. Logowanie jest chwilowo wstrzymane."
        );
        setRetryAfter(
          failure.retryAfter
        );
      } else if (
        failure instanceof ApiError &&
        failure.code ===
          "INVALID_BOOTSTRAP_REQUEST"
      ) {
        setError(
          "Sprawdź login, nazwę użytkownika i hasło. Nowe hasło musi mieć co najmniej 15 znaków."
        );
      } else {
        setError(
          phase === "bootstrap"
            ? "Nie udało się utworzyć konta właściciela."
            : "Nieprawidłowa nazwa użytkownika lub hasło."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark auth-brand">
          LM
        </div>
        <p className="eyebrow">
          Lex Machina · lokalnie
        </p>
        <h1>
          {phase === "bootstrap"
            ? "Utwórz konto właściciela"
            : phase === "locked"
              ? "Lex Machina jest zablokowana"
              : "Zaloguj się"}
        </h1>
        <p className="auth-copy">
          {phase === "bootstrap"
            ? "Pierwsze konto administruje aplikacją. Dostęp do poszczególnych spraw będzie nadawany osobno w kolejnym etapie."
            : "Sesja oraz odblokowane klucze istnieją wyłącznie w pamięci lokalnego runtime."}
        </p>

        {phase === "bootstrap" && (
          <label>
            Nazwa wyświetlana
            <input
              value={displayName}
              autoComplete="name"
              maxLength={120}
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
            />
          </label>
        )}

        <label>
          Login
          <input
            value={loginName}
            autoComplete="username"
            maxLength={64}
            disabled={
              phase === "locked" &&
              Boolean(lastUser)
            }
            onChange={(event) =>
              setLoginName(
                event.target.value
              )
            }
          />
        </label>

        {nativeUnlock ? (
          <p className="auth-copy">
            To konto jest chronione przez magazyn poświadczeń Windows. Odblokowanie nie wymaga wpisywania hasła aplikacji.
          </p>
        ) : (
          <label>
            Hasło
            <input
              type="password"
              value={password}
              autoComplete={
                phase === "bootstrap"
                  ? "new-password"
                  : "current-password"
              }
              maxLength={128}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void submit();
                }
              }}
            />
          </label>
        )}

        {error && (
          <div className="alert alert-error auth-alert">
            {error}
            {retryLabel
              ? ` Ponowna próba po ${retryLabel}.`
              : ""}
          </div>
        )}

        <button
          type="button"
          className="primary-button auth-submit"
          disabled={
            submitting ||
            !loginName.trim() ||
            (
              !nativeUnlock &&
              !password
            ) ||
            (
              phase === "bootstrap" &&
              !displayName.trim()
            )
          }
          onClick={() => {
            void submit();
          }}
        >
          {submitting
            ? "Weryfikuję…"
            : phase === "bootstrap"
              ? "Utwórz konto"
              : "Zaloguj"}
        </button>

        {phase !== "bootstrap" && (
          <button
            type="button"
            className="secondary-button auth-change-user"
            onClick={onRecover}
          >
            Odzyskaj konto kodem recovery
          </button>
        )}

        {phase === "locked" && (
          <button
            type="button"
            className="secondary-button auth-change-user"
            onClick={onChangeUser}
          >
            Zmień użytkownika
          </button>
        )}

        <p className="auth-footnote">
          Hasło nie jest zapisywane. Zamknięcie procesu aplikacji unieważnia wszystkie sesje.
        </p>
      </section>
    </main>
  );
}

export default function AuthenticatedApp() {
  const [phase, setPhase] =
    useState<AuthPhase>(
      "checking"
    );
  const [auth, setAuth] =
    useState<AuthMeResponse | null>(
      null
    );
  const [lastUser, setLastUser] =
    useState<
      AuthMeResponse["user"] | undefined
    >();
  const [now, setNow] =
    useState(() => Date.now());
  const [showSecurity, setShowSecurity] =
    useState(false);
  const [showUsers, setShowUsers] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const initialize =
      async () => {
        try {
          const [, status] =
            await Promise.all([
              getHealth(),
              getAuthStatus()
            ]);
          if (cancelled) {
            return;
          }

          if (isDesktopShell()) {
            try {
              const current =
                await getAuthMe();
              if (cancelled) {
                return;
              }
              setAuth(current);
              setLastUser(
                current.user
              );
              setNow(Date.now());
              setShowSecurity(
                current.user
                  .passwordSetupPending ===
                  true
              );
              setPhase(
                "authenticated"
              );
              return;
            } catch {
              // Native managed identity can fall back to manual multi-user login.
            }
          }

          setPhase(
            status.requiresBootstrap
              ? "bootstrap"
              : "login"
          );
        } catch {
          if (!cancelled) {
            setPhase("login");
          }
        }
      };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setAuthenticationFailureHandler(
      () => {
        clearAuthSession();
        setAuth((current) => {
          if (current) {
            setLastUser(
              current.user
            );
          }
          return null;
        });
        setPhase("locked");
      }
    );

    return () => {
      setAuthenticationFailureHandler(
        null
      );
    };
  }, []);

  useEffect(() => {
    if (
      phase !== "authenticated" ||
      !auth
    ) {
      return;
    }

    const sync = async () => {
      setNow(Date.now());
      try {
        const current =
          await getAuthMe();
        setAuth(current);
      } catch {
        // A 401 is handled by the central auth failure handler.
      }
    };

    const interval =
      window.setInterval(
        () => {
          void sync();
        },
        15_000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    phase,
    auth?.user.userId
  ]);

  const idleRemaining =
    auth
      ? Date.parse(
          auth.session
            .idleExpiresAt
        ) - now
      : Number.POSITIVE_INFINITY;

  async function lock():
    Promise<void> {
    const currentUser =
      auth?.user;
    try {
      await lockAuth();
    } finally {
      if (currentUser) {
        setLastUser(
          currentUser
        );
      }
      setAuth(null);
      setPhase("locked");
    }
  }

  async function logout():
    Promise<void> {
    try {
      await logoutAuth();
    } finally {
      setLastUser(undefined);
      setAuth(null);
      setPhase("login");
    }
  }

  if (phase === "checking") {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="eyebrow">
            Lex Machina
          </p>
          <h1>
            Uruchamianie lokalnego runtime…
          </h1>
        </section>
      </main>
    );
  }

  if (phase === "recover") {
    return (
      <RecoveryAuthPanel
        {...(lastUser
          ? {
              initialLoginName:
                lastUser.loginName
            }
          : {})}
        onCancel={() => {
          clearAuthSession();
          setPhase("login");
        }}
        onAuthenticated={(value) => {
          setAuth(value);
          setLastUser(
            value.user
          );
          setNow(Date.now());
          setShowSecurity(false);
          setPhase(
            "authenticated"
          );
        }}
      />
    );
  }

  if (
    phase !== "authenticated" ||
    !auth
  ) {
    const panelPhase:
      "bootstrap" | "login" | "locked" =
        phase === "authenticated"
          ? "login"
          : phase;
    return (
      <AuthPanel
        key={
          panelPhase +
          ":" +
          (
            lastUser?.userId ??
            "none"
          )
        }
        phase={panelPhase}
        {...(lastUser
          ? { lastUser }
          : {})}
        onChangeUser={() => {
          clearAuthSession();
          setLastUser(undefined);
          setPhase("login");
        }}
        onRecover={() => {
          clearAuthSession();
          setPhase("recover");
        }}
        onAuthenticated={(value) => {
          setAuth(value);
          setLastUser(value.user);
          setNow(Date.now());
          setShowSecurity(
            value.user
              .passwordSetupPending ===
              true
          );
          setPhase(
            "authenticated"
          );
        }}
      />
    );
  }

  return (
    <>
      <div className="auth-toolbar">
        <div>
          <strong>
            {auth.user.displayName}
          </strong>
          <span>
            @{auth.user.loginName}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            setShowSecurity(
              (value) => !value
            )
          }
        >
          {showSecurity
            ? "Ukryj bezpieczeństwo"
            : "Hasło i recovery"}
        </button>
        {auth.user.appRole ===
          "ADMIN" && (
          <button
            type="button"
            onClick={() =>
              setShowUsers(
                (value) => !value
              )
            }
          >
            {showUsers
              ? "Ukryj użytkowników"
              : "Użytkownicy"}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            void lock();
          }}
        >
          Zablokuj
        </button>
        <button
          type="button"
          onClick={() => {
            void logout();
          }}
        >
          Wyloguj
        </button>
      </div>

      {showUsers &&
        auth.user.appRole ===
          "ADMIN" && (
          <AdminUsersPanel
            currentUserId={
              auth.user.userId
            }
          />
        )}

      {showSecurity && (
        <AccountSecurityPanel
          user={auth.user}
          onAuthUpdated={(value) => {
            setAuth(value);
            setLastUser(
              value.user
            );
            setNow(Date.now());
          }}
        />
      )}

      {idleRemaining <= 120_000 && (
        <div
          className="session-warning"
          role="status"
        >
          Sesja zbliża się do blokady z powodu bezczynności. Backend pozostaje źródłem prawdy o czasie wygaśnięcia.
        </div>
      )}

      <App
        key={
          auth.session.sessionId
        }
        user={auth.user}
      />
    </>
  );
}
