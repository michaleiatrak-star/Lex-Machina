param(
  [string]$Configuration = "release"
)

$ErrorActionPreference = "Stop"
$installer = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = (Resolve-Path (Join-Path $installer "..\..")).Path
$desktop = Join-Path $repo "app\lex-desktop"
$tauri = Join-Path $desktop "src-tauri"
$payload = Join-Path $tauri "runtime"

if ($env:OS -ne "Windows_NT") { throw "Windows online bootstrap payload must be built on Windows." }

Remove-Item $payload -Recurse -Force -ErrorAction SilentlyContinue
New-Item $payload -ItemType Directory | Out-Null

Write-Host "[1/4] Build runtime JS"
Push-Location (Join-Path $repo "app\lex-runtime")
try {
  npm install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { throw "npm install runtime failed" }
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "runtime build failed" }
} finally { Pop-Location }

$appStage = Join-Path $payload "app"
New-Item $appStage -ItemType Directory | Out-Null
Copy-Item (Join-Path $repo "app\lex-runtime\dist") $appStage -Recurse
Copy-Item (Join-Path $repo "app\lex-runtime\package.json") $appStage
Push-Location $appStage
try {
  npm install --omit=dev --ignore-scripts --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { throw "production runtime dependencies failed" }
  npm ls --omit=dev --all --json |
    Out-File -FilePath (Join-Path $payload "npm-dependency-tree.json") -Encoding utf8
  if ($LASTEXITCODE -ne 0) { throw "runtime production dependency provenance failed" }
} finally { Pop-Location }

Write-Host "[2/4] Copy workers, corpus, manifest and bootstrap"
Copy-Item (Join-Path $repo "app\ocr") (Join-Path $payload "ocr") -Recurse
Copy-Item (Join-Path $repo "app\privacy") (Join-Path $payload "privacy") -Recurse
Copy-Item (Join-Path $repo "app\storage") (Join-Path $payload "storage") -Recurse
Copy-Item (Join-Path $repo "Wersja rozwojowa rozpakowana") (Join-Path $payload "corpus") -Recurse
Copy-Item (Join-Path $installer "windows-release-source.json") (Join-Path $payload "release-source.json")
Copy-Item (Join-Path $installer "windows-release-requirements.txt") (Join-Path $payload "release-requirements.txt")

$bootstrap = Join-Path $payload "bootstrap"
New-Item $bootstrap -ItemType Directory | Out-Null
foreach ($file in @(
  "windows-online-bootstrap-entry.ps1",
  "windows-online-python-embedded.ps1",
  "windows-online-bootstrap.ps1",
  "windows-offline-bundle-install.ps1",
  "prefetch-release-models.py",
  "verify-python-package-set.py",
  "generate-component-lock.ps1",
  "windows-payload-selftest.ps1",
  "windows-payload-python-selftest.py"
)) {
  Copy-Item (Join-Path $installer $file) (Join-Path $bootstrap $file)
}

Write-Host "[3/4] Build native runtime sidecar"
Push-Location $desktop
try {
  cargo build --release --bin lex-runtime-sidecar --manifest-path src-tauri/Cargo.toml
  if ($LASTEXITCODE -ne 0) { throw "Runtime sidecar build failed" }
} finally { Pop-Location }
$sidecar = Join-Path $tauri "target\release\lex-runtime-sidecar.exe"
if (-not (Test-Path $sidecar)) { throw "Built runtime sidecar not found" }
Copy-Item $sidecar (Join-Path $payload "lex-runtime-sidecar.exe")

Write-Host "[4/4] Thin payload contract"
foreach ($required in @(
  "app\dist\http\server.js",
  "lex-runtime-sidecar.exe",
  "release-source.json",
  "release-requirements.txt",
  "bootstrap\windows-online-bootstrap-entry.ps1",
  "bootstrap\windows-online-python-embedded.ps1",
  "bootstrap\windows-online-bootstrap.ps1",
  "bootstrap\windows-offline-bundle-install.ps1",
  "bootstrap\verify-python-package-set.py",
  "bootstrap\windows-payload-selftest.ps1",
  "bootstrap\windows-payload-python-selftest.py"
)) {
  if (-not (Test-Path -LiteralPath (Join-Path $payload $required) -PathType Leaf)) {
    throw "ONLINE_PAYLOAD_REQUIRED_FILE_MISSING:$required"
  }
}

Write-Host "G33_ONLINE_BOOTSTRAP_PAYLOAD_READY:$payload"
