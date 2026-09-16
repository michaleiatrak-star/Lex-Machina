import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here =
  path.dirname(
    fileURLToPath(import.meta.url)
  );
const repoRoot =
  path.resolve(
    here,
    "../../.."
  );

function read(relative: string): string {
  return fs.readFileSync(
    path.join(repoRoot, relative),
    "utf8"
  );
}

const trust =
  read(
    "app/lex-desktop/src-tauri/src/trust_boundary.rs"
  );
const webApi =
  read(
    "app/lex-web/src/api.ts"
  );
const runtimeCredentials =
  read(
    "app/lex-runtime/src/providers/credentials.ts"
  );
const desktopLib =
  read(
    "app/lex-desktop/src-tauri/src/lib.rs"
  );

const checks = {
  osKeyringService:
    trust.includes(
      'const PROVIDER_KEYRING_SERVICE: &str = "LexMachina/ProviderCredential"'
    ) &&
    trust.includes(
      "Entry::new("
    ),
  restoreOnDesktopStartup:
    desktopLib.includes(
      ".ensure_managed_identity()"
    ) &&
    trust.includes(
      "self.restore_provider_credentials()?;"
    ),
  restoreIntoMemoryOnlyRuntime:
    trust.includes(
      '"/api/admin/providers/{provider}/credential"'
    ) &&
    runtimeCredentials.includes(
      "class MemoryOverlayCredentialResolver"
    ),
  persistOnlyAfterRuntimeSuccess:
    trust.includes(
      "if status.is_success()"
    ) &&
    trust.includes(
      "self.persist_provider_credential("
    ),
  deleteFromOsKeyring:
    trust.includes(
      "fn delete_provider_credential("
    ) &&
    trust.includes(
      ".delete_credential()"
    ) &&
    trust.includes(
      "Err(KeyringError::NoEntry) => Ok(())"
    ),
  providerAllowlist:
    trust.includes(
      '"openai" | "anthropic" | "xai"'
    ),
  transientSecretZeroization:
    trust.includes(
      "unsafe_zero_string(&mut api_key);"
    ) &&
    runtimeCredentials.includes(
      "previous?.fill(0);"
    ),
  noBrowserPersistence:
    !webApi.includes(
      "localStorage"
    ) &&
    !webApi.includes(
      "sessionStorage"
    ),
  desktopDoesNotExposeSessionBearer:
    trust.includes(
      "extract_and_strip_session_token"
    ) &&
    trust.includes(
      "session_token: Option<String>"
    )
};

const pass =
  Object.values(checks)
    .every(Boolean);

console.log(
  JSON.stringify(
    {
      gate:
        "G37C2_OS_KEYRING_PROVIDER_CREDENTIALS",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      checks
    },
    null,
    2
  )
);

if (!pass) {
  process.exitCode = 1;
}
