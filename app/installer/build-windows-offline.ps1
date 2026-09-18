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

function Assert-Sha256([string]$Path, [string]$Expected, [string]$Label) {
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { throw "SOURCE_FILE_MISSING:${Label}:$Path" }
  if ($Expected -notmatch '^[a-fA-F0-9]{64}$') { throw "SOURCE_HASH_INVALID:$Label" }
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $Path).Hash.ToLowerInvariant()
  if ($actual -ne $Expected.ToLowerInvariant()) { throw "SOURCE_HASH_MISMATCH:$Label expected=$Expected actual=$actual" }
  Write-Host "Verified $Label SHA-256: $actual"
}

if ($env:OS -ne "Windows_NT") { throw "Windows offline payload must be built on Windows." }

Write-Host "[brand] Materialize canonical Lex Machina Windows icon"
& (Join-Path $installer "materialize-brand-icon.ps1")
$brandIcon = Join-Path $tauri "icons\\icon.ico"
if (-not (Test-Path -LiteralPath $brandIcon -PathType Leaf)) { throw "LEX_BRAND_ICON_MATERIALIZATION_FAILED" }

Write-Host "[0/10] Installer state machine self-test"
& (Join-Path $installer "installer-state-machine-selftest.ps1")
if ($LASTEXITCODE -ne 0) { throw "Installer state machine self-test failed" }

Write-Host "[profile] Clean admin / destructive uninstall lifecycle self-test"
& (Join-Path $installer "profile-lifecycle-selftest.ps1")
if ($LASTEXITCODE -ne 0) { throw "Profile lifecycle self-test failed" }

Remove-Item $payload -Recurse -Force -ErrorAction SilentlyContinue
New-Item $payload -ItemType Directory | Out-Null
$cache = Join-Path $installer ".cache"
New-Item $cache -ItemType Directory -Force | Out-Null

Write-Host "[1/10] Build runtime JS"
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
Copy-Item (Join-Path $installer "windows-release-source.json") (Join-Path $payload "release-source.json")
Copy-Item (Join-Path $installer "windows-release-requirements.txt") (Join-Path $payload "release-requirements.txt")
Push-Location $appStage
try {
  npm install --omit=dev --ignore-scripts --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { throw "production runtime dependencies failed" }
  npm ls --omit=dev --all --json | Out-File -FilePath (Join-Path $payload "npm-dependency-tree.json") -Encoding utf8
  if ($LASTEXITCODE -ne 0) { throw "runtime production dependency provenance failed" }
} finally { Pop-Location }

Write-Host "[2/10] Copy workers, corpus and bootstrap"
Copy-Item (Join-Path $repo "app\ocr") (Join-Path $payload "ocr") -Recurse
Copy-Item (Join-Path $repo "app\privacy") (Join-Path $payload "privacy") -Recurse
Copy-Item (Join-Path $repo "app\storage") (Join-Path $payload "storage") -Recurse
Copy-Item (Join-Path $repo "Wersja rozwojowa rozpakowana") (Join-Path $payload "corpus") -Recurse
$bootstrap = Join-Path $payload "bootstrap"
New-Item $bootstrap -ItemType Directory | Out-Null
foreach ($file in @(
  "windows-online-bootstrap.ps1",
  "windows-offline-bundle-install.ps1",
  "install-private-python.ps1",
  "app-update-transaction.ps1",
  "app-update-verification.ps1",
  "install-local-llm.ps1",
  "get-install-state.ps1",
  "installer-state-machine-selftest.ps1",
  "prefetch-release-models.py",
  "verify-python-package-set.py",
  "generate-component-lock.ps1",
  "windows-payload-selftest.ps1",
  "windows-payload-python-selftest.py"
)) {
  Copy-Item (Join-Path $installer $file) (Join-Path $bootstrap $file)
}

Write-Host "[3/10] Private Node"
$nodeZip = Join-Path $cache "node-$($sourceLock.runtime.node.version)-win-x64.zip"
Invoke-WebRequest -UseBasicParsing -Uri $sourceLock.runtime.node.url -OutFile $nodeZip
Assert-Sha256 $nodeZip $sourceLock.runtime.node.sha256 "node-runtime-source"
$nodeExtract = Join-Path $cache "node-extract"
Remove-Item $nodeExtract -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive -Path $nodeZip -DestinationPath $nodeExtract -Force
$nodeDir = Get-ChildItem $nodeExtract -Directory | Select-Object -First 1
if (-not $nodeDir) { throw "NODE_ARCHIVE_LAYOUT_INVALID" }
Copy-Item $nodeDir.FullName (Join-Path $payload "node") -Recurse

Write-Host "[4/10] Private Python"
& (Join-Path $installer "install-private-python.ps1") `
  -ManifestPath (Join-Path $installer "windows-release-source.json") `
  -RuntimeRoot $payload `
  -CacheRoot $cache
if ($LASTEXITCODE -ne 0) { throw "Private Python app-local provisioning failed" }
$python = Join-Path $payload "python\\python.exe"
if (-not (Test-Path -LiteralPath $python -PathType Leaf)) { throw "PRIVATE_PYTHON_MISSING" }
$pythonExpected = "Python $($sourceLock.runtime.python.version)"
$pythonActual = (& $python --version 2>&1 | Select-Object -First 1).ToString().Trim()
if ($LASTEXITCODE -ne 0 -or $pythonActual -ne $pythonExpected) {
  throw "PRIVATE_PYTHON_VERSION_INVALID expected=$pythonExpected actual=$pythonActual"
}
Write-Host "Verified private Python version: $pythonActual"

Write-Host "[5/10] Pinned Python/ML packages"
& $python -m pip install --disable-pip-version-check --no-warn-script-location -r (Join-Path $installer "windows-release-requirements.txt")
if ($LASTEXITCODE -ne 0) { throw "Pinned Python package install failed" }
& $python -m pip freeze --all | Sort-Object | Out-File -FilePath (Join-Path $payload "python-dependency-tree.txt") -Encoding utf8
if ($LASTEXITCODE -ne 0) { throw "Python dependency provenance failed" }

Write-Host "[6/10] Prefetch OCR/NER models"
$modelRoot = Join-Path $payload "models"
New-Item $modelRoot -ItemType Directory -Force | Out-Null
& $python (Join-Path $installer "prefetch-release-models.py") $modelRoot
if ($LASTEXITCODE -ne 0) { throw "Model prefetch failed" }

Write-Host "[7/10] Bundle Visual C++ runtime prerequisite"
$prerequisites = Join-Path $payload "prerequisites"
New-Item $prerequisites -ItemType Directory -Force | Out-Null
$vcSource = $sourceLock.systemPrerequisites.visualCppRuntime
$vcRedist = Join-Path $cache "vc_redist.x64-$($vcSource.version).exe"
Invoke-WebRequest -UseBasicParsing -Uri $vcSource.url -OutFile $vcRedist
Assert-Sha256 $vcRedist $vcSource.sha256 "visual-cpp-runtime-source"
Copy-Item $vcRedist (Join-Path $prerequisites "vc_redist.x64.exe")

Write-Host "Install bundled Visual C++ runtime prerequisite for payload self-test"
$vcInstall = Start-Process -FilePath $vcRedist -ArgumentList @(
  "/install", "/quiet", "/norestart"
) -Wait -PassThru
if ($vcInstall.ExitCode -notin @(0, 1638, 3010)) {
  throw "Visual C++ runtime prerequisite install failed: $($vcInstall.ExitCode)"
}
Write-Host "Visual C++ runtime prerequisite exit code: $($vcInstall.ExitCode)"

Write-Host "[8/10] Build native runtime sidecar"
Push-Location $desktop
try {
  cargo build --release --bin lex-runtime-sidecar --manifest-path src-tauri/Cargo.toml
  if ($LASTEXITCODE -ne 0) { throw "Runtime sidecar build failed" }
} finally { Pop-Location }
$sidecar = Join-Path $tauri "target\release\lex-runtime-sidecar.exe"
if (-not (Test-Path $sidecar)) { throw "Built runtime sidecar not found" }
Copy-Item $sidecar (Join-Path $payload "lex-runtime-sidecar.exe")

Write-Host "[9/10] Generate immutable component lock"
$lock = Join-Path $payload "component-lock.json"
& (Join-Path $installer "generate-component-lock.ps1") -PayloadRoot $payload -Output $lock
if ($LASTEXITCODE -ne 0) { throw "Component lock failed" }

Write-Host "[10/10] Offline self-test"
& (Join-Path $installer "windows-payload-selftest.ps1") -PayloadRoot $payload
if ($LASTEXITCODE -ne 0) { throw "Offline payload self-test failed" }

Write-Host "G33_PAYLOAD_READY:LOCAL_AI_OPTIONAL:$payload"
