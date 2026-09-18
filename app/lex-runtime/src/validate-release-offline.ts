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
const onlineBuild =
  read(
    "app/installer/build-windows-online.ps1"
  );
const standaloneBuild =
  read(
    "app/installer/build-offline-standalone.ps1"
  );
const selfExtractor =
  read(
    "app/installer/offline-selfextract/OfflineSelfExtractor.cs"
  );
const acceptance =
  read(
    "app/installer/windows-installer-acceptance.ps1"
  );
const bootstrap =
  read(
    "app/installer/windows-online-bootstrap.ps1"
  );
const offlineBundleInstall =
  read(
    "app/installer/windows-offline-bundle-install.ps1"
  );
const hooks =
  read(
    "app/lex-desktop/src-tauri/windows/hooks.nsh"
  );
const componentLock =
  read(
    "app/installer/generate-component-lock.ps1"
  );

const checks = {
  pullRequestGate:
    workflow.includes("pull_request:") &&
    workflow.includes(
      "Build and accept standalone offline Windows EXE"
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
  externalizedRuntimeAvoidsNsisLimit:
    workflow.includes(
      "Stage external offline runtime bundle"
    ) &&
    workflow.includes(
      "Rebuild thin installer payload"
    ) &&
    workflow.includes(
      "LexMachina-Offline-Runtime.zip"
    ) &&
    workflow.includes(
      "tar.exe -a -c -f"
    ) &&
    workflow.includes(
      "Build standalone offline EXE"
    ) &&
    workflow.includes(
      "build-offline-standalone.ps1"
    ),
  standaloneSelfExtractorIntegrity:
    standaloneBuild.includes(
      "LEXOFF01"
    ) &&
    standaloneBuild.includes(
      "Get-FileHash -Algorithm SHA256"
    ) &&
    selfExtractor.includes(
      'FooterMagic = "LEXOFF01"'
    ) &&
    selfExtractor.includes(
      "SHA256.Create()"
    ) &&
    selfExtractor.includes(
      "OFFLINE_WRAPPER_PAYLOAD_HASH_MISMATCH"
    ) &&
    selfExtractor.includes(
      "LexMachina-Offline-Runtime.zip"
    ),
  offlineComponentPolicy:
    componentLock.includes(
      "[bool]$NetworkRequiredAtInstall = $false"
    ) &&
    componentLock.includes(
      "runtimeNetworkRequiredAfterBootstrap = $false"
    ),
  offlineBundleIntegrity:
    workflow.includes(
      "offline-runtime.json"
    ) &&
    offlineBundleInstall.includes(
      "OFFLINE_BUNDLE_HASH_MISMATCH"
    ) &&
    offlineBundleInstall.includes(
      "OFFLINE_BUNDLE_LOCK_HASH_MISMATCH"
    ) &&
    hooks.includes(
      "windows-offline-bundle-install.ps1"
    ) &&
    onlineBuild.includes(
      "windows-offline-bundle-install.ps1"
    ),
  bundledVisualCppFallback:
    build.includes(
      'Copy-Item $vcRedist (Join-Path $prerequisites "vc_redist.x64.exe")'
    ) &&
    bootstrap.includes(
      'Join-Path $runtime "prerequisites\\vc_redist.x64.exe"'
    ) &&
    offlineBundleInstall.includes(
      'Join-Path $runtime "prerequisites\\vc_redist.x64.exe"'
    ),
  installedCopyAcceptance:
    workflow.includes(
      "Offline clean-machine standalone EXE acceptance"
    ) &&
    workflow.includes(
      "ExpectedNetworkRequiredAtInstall = $false"
    ) &&
    workflow.includes(
      "BlockNetworkDuringInstall = $true"
    ) &&
    workflow.includes(
      "ForceVisualCppRuntimeInstall = $true"
    ) &&
    workflow.includes(
      "StandaloneOfflineExe = $true"
    ) &&
    acceptance.includes(
      "StandaloneOfflineExe"
    ) &&
    acceptance.includes(
      "INSTALLER_ACCEPTANCE_STANDALONE_HAS_ADJACENT_RUNTIME_BUNDLE"
    ) &&
    acceptance.includes(
      "New-NetFirewallRule"
    ) &&
    acceptance.includes(
      "LEX_FORCE_VC_RUNTIME_INSTALL"
    ) &&
    offlineBundleInstall.includes(
      "Forcing bundled Visual C++ runtime fallback for acceptance coverage"
    ) &&
    acceptance.includes(
      "INSTALLER_ACCEPTANCE_INSTALL_TIMEOUT"
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
      '"sha256=$standaloneHash"'
    ) &&
    workflow.includes(
      "runtime_bundle_sha256"
    ) &&
    workflow.includes(
      "standalone/LexMachina-Offline-Setup.exe"
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
