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

const workflow =
  read(
    ".github/workflows/offline-windows-installer.yml"
  );
const offlineConfig =
  JSON.parse(
    read(
      "app/lex-desktop/src-tauri/tauri.offline.conf.json"
    )
  ) as {
    bundle?: {
      windows?: {
        webviewInstallMode?: {
          type?: string;
        };
      };
    };
  };
const build =
  read(
    "app/installer/build-windows-offline.ps1"
  );
const acceptance =
  read(
    "app/installer/windows-installer-acceptance.ps1"
  );
const bootstrap =
  read(
    "app/installer/windows-online-bootstrap.ps1"
  );
const componentLock =
  read(
    "app/installer/generate-component-lock.ps1"
  );

const checks = {
  pullRequestGate:
    workflow.includes("pull_request:") &&
    workflow.includes(
      "Build and accept self-contained Windows NSIS installer"
    ),
  offlineWebView2:
    offlineConfig.bundle?.windows
      ?.webviewInstallMode?.type ===
      "offlineInstaller",
  offlineTauriConfigUsed:
    workflow.includes(
      "tauri.offline.conf.json"
    ) &&
    workflow.includes(
      "tauri build --bundles nsis"
    ),
  fullPrivateRuntimeBuilt:
    workflow.includes(
      "build-windows-offline.ps1"
    ) &&
    build.includes(
      "Private Node"
    ) &&
    build.includes(
      "Private Python"
    ) &&
    build.includes(
      "Prefetch OCR/NER models"
    ),
  offlineComponentPolicy:
    componentLock.includes(
      "[bool]$NetworkRequiredAtInstall = $false"
    ) &&
    componentLock.includes(
      "runtimeNetworkRequiredAfterBootstrap = $false"
    ),
  bundledVisualCppFallback:
    build.includes(
      'Copy-Item $vcRedist (Join-Path $prerequisites "vc_redist.x64.exe")'
    ) &&
    bootstrap.includes(
      'Join-Path $runtime "prerequisites\\vc_redist.x64.exe"'
    ) &&
    bootstrap.includes(
      "Using verified bundled visual-cpp-runtime"
    ) &&
    bootstrap.includes(
      "BOOTSTRAP_HASH_MISMATCH:visual-cpp-runtime-bundled"
    ),
  installedCopyAcceptance:
    workflow.includes(
      "Offline installed-copy acceptance"
    ) &&
    workflow.includes(
      "-ExpectedNetworkRequiredAtInstall $false"
    ) &&
    workflow.includes(
      "-BlockNetworkDuringInstall"
    ) &&
    acceptance.includes(
      "BlockNetworkDuringInstall"
    ),
  installedRuntimeIsPrivate:
    acceptance.includes(
      "lex-runtime-sidecar.exe"
    ) &&
    acceptance.includes(
      "node\\node.exe"
    ) &&
    acceptance.includes(
      "python\\python.exe"
    ) &&
    acceptance.includes(
      "--self-test"
    ),
  firstDesktopStart:
    acceptance.includes(
      "first desktop startup without provider key"
    ) &&
    acceptance.includes(
      "INSTALLER_ACCEPTANCE_DESKTOP_EARLY_EXIT"
    ),
  immutableArtifactReceipt:
    workflow.includes(
      "SHA256-OFFLINE.txt"
    ) &&
    workflow.includes(
      "Get-FileHash -Algorithm SHA256"
    ) &&
    workflow.includes(
      "LexMachina-Windows-Offline-Setup"
    )
};

const pass =
  Object.values(checks)
    .every(Boolean);

console.log(
  JSON.stringify(
    {
      gate:
        "PHASE13_WINDOWS_OFFLINE_INSTALLER_ACCEPTANCE",
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
