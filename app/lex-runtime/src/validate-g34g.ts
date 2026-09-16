import fs from "node:fs";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";

const here =
  path.dirname(
    fileURLToPath(
      import.meta.url
    )
  );
const repoRoot =
  path.resolve(
    here,
    "../../.."
  );

function read(
  relative: string
): string {
  return fs.readFileSync(
    path.join(
      repoRoot,
      relative
    ),
    "utf8"
  );
}

const trust =
  read(
    "app/lex-desktop/src-tauri/src/trust_boundary.rs"
  );
const desktopLib =
  read(
    "app/lex-desktop/src-tauri/src/lib.rs"
  );
const tauriConfig =
  JSON.parse(
    read(
      "app/lex-desktop/src-tauri/tauri.conf.json"
    )
  ) as
    Record<string, any>;
const webApi =
  read(
    "app/lex-web/src/api.ts"
  );
const runtimeServer =
  read(
    "app/lex-runtime/src/http/server.ts"
  );

const checks = {
  customProtocol:
    desktopLib.includes(
      'register_asynchronous_uri_scheme_protocol('
    ) &&
    desktopLib.includes(
      '"lex-api"'
    ),
  nativeSessionState:
    trust.includes(
      "session_token: Option<String>"
    ) &&
    trust.includes(
      "extract_and_strip_session_token"
    ),
  jsAuthorizationIgnored:
    trust.includes(
      'lower != "x-lex-desktop-bootstrap"'
    ) &&
    !trust.includes(
      'lower == "authorization"'
    ),
  routeAllowlist:
    trust.includes(
      "fn route_allowed"
    ) &&
    trust.includes(
      '"/api/sessions/execute"'
    ) &&
    trust.includes(
      '"/api/sensitive-download/"'
    ),
  loopbackOnly:
    trust.includes(
      "address.ip().is_loopback()"
    ),
  sidecarLifecycle:
    trust.includes(
      "child.kill()"
    ) &&
    trust.includes(
      "LEX_PORT"
    ) &&
    trust.includes(
      '"0"'
    ),
  bootstrapSecret:
    runtimeServer.includes(
      "LEX_DESKTOP_BOOTSTRAP_TOKEN"
    ) &&
    runtimeServer.includes(
      "timingSafeEqual"
    ) &&
    trust.includes(
      "X-Lex-Desktop-Bootstrap"
    ),
  reactNoDesktopBearer:
    webApi.includes(
      "isDesktopShell()"
    ) &&
    webApi.includes(
      'const DESKTOP_API_BASE = "http://lex-api.localhost"'
    ) &&
    webApi.includes(
      "if (isDesktopShell()) {\n    return {};"
    ),
  osCredentialVault:
    trust.includes(
      "MANAGED_KEYRING_SERVICE"
    ) &&
    trust.includes(
      "PROVIDER_KEYRING_SERVICE"
    ) &&
    trust.includes(
      "restore_provider_credentials"
    ),
  noShellPlugin:
    !JSON.stringify(
      tauriConfig
    ).includes(
      "shell:"
    ) &&
    !read(
      "app/lex-desktop/src-tauri/capabilities/default.json"
    ).includes(
      "shell:"
    ),
  currentUserInstaller:
    tauriConfig?.bundle?.windows
      ?.nsis?.installMode ===
      "currentUser",
  offlineWebView2:
    tauriConfig?.bundle?.windows
      ?.webviewInstallMode
      ?.type ===
      "offlineInstaller"
};

const pass =
  Object.values(
    checks
  ).every(Boolean);

process.stdout.write(
  JSON.stringify(
    {
      gate:
        "G34G_TAURI_TRUST_BOUNDARY",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      checks
    },
    null,
    2
  ) + "\n"
);

if (!pass) {
  process.exitCode = 1;
}
