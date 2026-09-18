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

const service =
  read(
    "app/lex-runtime/src/auth/service.ts"
  );
const store =
  read(
    "app/lex-runtime/src/auth/store.ts"
  );
const types =
  read(
    "app/lex-runtime/src/auth/types.ts"
  );
const http =
  read(
    "app/lex-runtime/src/http/app.ts"
  );
const trust =
  read(
    "app/lex-desktop/src-tauri/src/trust_boundary.rs"
  );
const authUi =
  read(
    "app/lex-web/src/AuthApp.tsx"
  );
const securityUi =
  read(
    "app/lex-web/src/AccountSecurityPanel.tsx"
  );
const test =
  read(
    "app/lex-runtime/tests/g37b-password-setup.test.ts"
  );

const checks = {
  explicitPendingState:
    types.includes(
      "passwordSetupPending?: boolean"
    ) &&
    store.includes(
      "password_setup_pending"
    ),
  desktopOnlyManagedBootstrap:
    http.includes(
      '"/api/auth/bootstrap-managed"'
    ) &&
    http.includes(
      "LEX_DESKTOP_BOOTSTRAP_TOKEN"
    ) &&
    trust.includes(
      '"/api/auth/bootstrap-managed"'
    ),
  osVaultFailClosedFallback:
    trust.includes(
      "Err(_) => return Ok(false)"
    ) &&
    trust.includes(
      "return Ok(false);"
    ),
  nativeBootstrapSecret:
    trust.includes(
      'const MANAGED_KEYRING_SERVICE: &str = "LexMachina/Desktop"'
    ) &&
    trust.includes(
      "random_secret()?"
    ),
  setupUsesSameUmk:
    service.includes(
      "completePasswordSetupAndRotateRecovery"
    ) &&
    service.includes(
      "encryptUserMasterKey("
    ),
  recoveryRotatedOnSetup:
    service.includes(
      "password_setup_completed"
    ) &&
    service.includes(
      "encryptRecoveryUserMasterKey("
    ),
  bootstrapSecretRemoved:
    trust.includes(
      "clear_managed_identity_secret"
    ) &&
    trust.includes(
      ".delete_credential()"
    ),
  authEpochRevoked:
    service.includes(
      '"AUTH_EPOCH"'
    ) &&
    store.includes(
      "auth_epoch + 1"
    ),
  uiForcesPasswordSetup:
    authUi.includes(
      "passwordSetupPending"
    ) &&
    securityUi.includes(
      "Ustaw hasło właściciela"
    ) &&
    securityUi.includes(
      "__LEX_NATIVE_REAUTH__"
    ),
  lifecycleRegression:
    test.includes(
      "managed first-admin password setup"
    ) &&
    test.includes(
      "INVALID_CREDENTIALS"
    )
};

const pass =
  Object.values(checks)
    .every(Boolean);

console.log(
  JSON.stringify(
    {
      gate:
        "G37B_PASSWORDLESS_BOOTSTRAP_PASSWORD_SETUP",
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
