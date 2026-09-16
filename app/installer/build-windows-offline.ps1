param(
  [string]$Configuration = "release"
)

$ErrorActionPreference = "Stop"
$installer = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = (Resolve-Path (Join-Path $installer "..\..")).Path
$desktop = Join-Path $repo "app\lex-desktop"
$tauri = Join-Path $desktop "src-tauri"
$payload = Join-Path $tauri "runtime"
$sourceLock = Get-Content -Raw (Join-Path $installer "windows-release-source.json") | ConvertFrom-Json

if ($env:OS -ne "Windows_NT") {
  throw "Windows offline payload must be built on Windows."
}

Remove-Item $payload -Recurse -Force -ErrorAction SilentlyContinue
New-Item $payload -ItemType Directory | Out-Null

Write-Host "[1/9] Build runtime JS"
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
} finally { Pop-Location }

Write-Host "[2/9] Copy workers and corpus"
Copy-Item (Join-Path $repo "app\ocr") (Join-Path $payload "ocr") -Recurse
Copy-Item (Join-Path $repo "app\privacy") (Join-Path $payload "privacy") -Recurse
Copy-Item (Join-Path $repo "app\storage") (Join-Path $payload "storage") -Recurse
Copy-Item (Join-Path $repo "Wersja rozwojowa rozpakowana") (Join-Path $payload "corpus") -Recurse

Write-Host "[3/9] Private Node"
$cache = Join-Path $installer ".cache"
New-Item $cache -ItemType Directory -Force | Out-Null
$nodeZip = Join-Path $cache "node.zip"
Invoke-WebRequest -UseBasicParsing -Uri $sourceLock.runtime.node.url -OutFile $nodeZip
$nodeExtract = Join-Path $cache "node-extract"
Remove-Item $nodeExtract -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive -Path $nodeZip -DestinationPath $nodeExtract -Force
$nodeDir = Get-ChildItem $nodeExtract -Directory | Select-Object -First 1
Copy-Item $nodeDir.FullName (Join-Path $payload "node") -Recurse

Write-Host "[4/9] Private Python"
$pythonInstaller = Join-Path $cache "python.exe"
Invoke-WebRequest -UseBasicParsing -Uri $sourceLock.runtime.python.url -OutFile $pythonInstaller
$pythonDir = Join-Path $payload "python"
$args = @(
  "/quiet",
  "InstallAllUsers=0",
  "TargetDir=$pythonDir",
  "Include_launcher=0",
  "Include_test=0",
  "Include_doc=0",
  "Include_tcltk=0",
  "Include_tools=0",
  "Include_pip=1",
  "PrependPath=0",
  "Shortcuts=0"
)
$install = Start-Process -FilePath $pythonInstaller -ArgumentList $args -Wait -PassThru
if ($install.ExitCode -ne 0) { throw "Private Python install failed: $($install.ExitCode)" }
$python = Join-Path $pythonDir "python.exe"

Write-Host "[5/9] Pinned Python/ML packages"
& $python -m pip install --disable-pip-version-check --no-warn-script-location -r (Join-Path $installer "windows-release-requirements.txt")
if ($LASTEXITCODE -ne 0) { throw "Pinned Python package install failed" }

Write-Host "[6/9] Prefetch OCR/NER models"
$modelRoot = Join-Path $payload "models"
New-Item $modelRoot -ItemType Directory -Force | Out-Null
& $python (Join-Path $installer "prefetch-release-models.py") $modelRoot
if ($LASTEXITCODE -ne 0) { throw "Model prefetch failed" }

Write-Host "[7/9] Build native runtime sidecar"
Push-Location $desktop
try {
  cargo build --release --bin lex-runtime-sidecar --manifest-path src-tauri/Cargo.toml
  if ($LASTEXITCODE -ne 0) { throw "Runtime sidecar build failed" }
} finally { Pop-Location }
$sidecar = Join-Path $tauri "target\release\lex-runtime-sidecar.exe"
if (-not (Test-Path $sidecar)) { throw "Built runtime sidecar not found" }
Copy-Item $sidecar (Join-Path $payload "lex-runtime-sidecar.exe")

Write-Host "[8/9] Generate immutable component lock"
$lock = Join-Path $payload "component-lock.json"
& (Join-Path $installer "generate-component-lock.ps1") -PayloadRoot $payload -Output $lock
if ($LASTEXITCODE -ne 0) { throw "Component lock failed" }

Write-Host "[9/9] Offline self-test"
& (Join-Path $installer "windows-payload-selftest.ps1") -PayloadRoot $payload
if ($LASTEXITCODE -ne 0) { throw "Offline payload self-test failed" }

Write-Host "G33_PAYLOAD_READY:$payload"
