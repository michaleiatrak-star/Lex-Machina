param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$TargetManifestPath,
  [string]$OutputPath,
  [switch]$FailOnDowngrade
)

$ErrorActionPreference = "Stop"
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$targetManifestFile = [IO.Path]::GetFullPath($TargetManifestPath)

function Get-StrictVersion([object]$Value, [string]$Label) {
  if ($null -eq $Value) { throw "INSTALL_STATE_VERSION_MISSING:$Label" }
  $text = $Value.ToString().Trim()
  if ($text -notmatch '^\d+\.\d+\.\d+$') {
    throw "INSTALL_STATE_VERSION_INVALID:${Label}:$text"
  }
  try { return [Version]$text }
  catch { throw "INSTALL_STATE_VERSION_INVALID:${Label}:$text" }
}

function Read-JsonFile([string]$Path, [string]$ErrorCode) {
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    throw "$ErrorCode`_MISSING:$Path"
  }
  try { return Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json }
  catch { throw "$ErrorCode`_INVALID:$Path" }
}

function Write-Result([hashtable]$Data) {
  $json = $Data | ConvertTo-Json -Depth 8 -Compress
  if ($OutputPath) {
    $destination = [IO.Path]::GetFullPath($OutputPath)
    $parent = Split-Path -Parent $destination
    if ($parent) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
    [IO.File]::WriteAllText($destination, $json + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
  }
  Write-Output $json
}

$targetManifest = Read-JsonFile $targetManifestFile "INSTALL_STATE_TARGET_MANIFEST"
$targetVersionObject = Get-StrictVersion $targetManifest.applicationVersion "target"
$targetVersion = $targetVersionObject.ToString()
$checkedAt = (Get-Date).ToUniversalTime().ToString("o")
$base = @{
  schemaVersion = 1
  runtimeRoot = $runtime
  targetVersion = $targetVersion
  checkedAt = $checkedAt
}

if (-not (Test-Path -LiteralPath $runtime -PathType Container)) {
  $base.state = "FRESH"
  $base.installedVersion = $null
  $base.reasons = @("RUNTIME_ROOT_ABSENT")
  Write-Result $base
  exit 0
}

$firstEntry = Get-ChildItem -LiteralPath $runtime -Force -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $firstEntry) {
  $base.state = "FRESH"
  $base.installedVersion = $null
  $base.reasons = @("RUNTIME_ROOT_EMPTY")
  Write-Result $base
  exit 0
}

$installedManifestPath = Join-Path $runtime "release-source.json"
if (-not (Test-Path -LiteralPath $installedManifestPath -PathType Leaf)) {
  $base.state = "REPAIR"
  $base.installedVersion = $null
  $base.reasons = @("INSTALLED_MANIFEST_MISSING")
  Write-Result $base
  exit 0
}

try {
  $installedManifest = Get-Content -Raw -LiteralPath $installedManifestPath | ConvertFrom-Json
  $installedVersionObject = Get-StrictVersion $installedManifest.applicationVersion "installed"
} catch {
  $base.state = "REPAIR"
  $base.installedVersion = $null
  $base.reasons = @("INSTALLED_MANIFEST_INVALID")
  Write-Result $base
  exit 0
}
$installedVersion = $installedVersionObject.ToString()
$base.installedVersion = $installedVersion

if ($installedVersionObject -gt $targetVersionObject) {
  $base.state = "DOWNGRADE_BLOCKED"
  $base.reasons = @("INSTALLED_VERSION_NEWER_THAN_TARGET")
  Write-Result $base
  if ($FailOnDowngrade) { exit 23 }
  exit 0
}

if ($installedVersionObject -lt $targetVersionObject) {
  $base.state = "UPGRADE"
  $base.reasons = @("TARGET_VERSION_NEWER_THAN_INSTALLED")
  Write-Result $base
  exit 0
}

$reasons = [Collections.Generic.List[string]]::new()
$requiredFiles = [Collections.Generic.List[string]]::new()
foreach ($relative in @(
  "component-lock.json",
  "lex-runtime-sidecar.exe",
  "node\node.exe",
  "python\python.exe",
  "llm\llama\llama-server.exe"
)) {
  $requiredFiles.Add($relative)
}

foreach ($model in @($targetManifest.models.localLlm)) {
  if ($null -eq $model -or -not $model.filename) {
    $reasons.Add("TARGET_LOCAL_LLM_MANIFEST_INVALID")
    continue
  }
  $requiredFiles.Add(("llm\models\" + $model.filename))
}

foreach ($relative in $requiredFiles) {
  $path = Join-Path $runtime $relative
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    $reasons.Add("REQUIRED_FILE_MISSING:$relative")
  } elseif ((Get-Item -LiteralPath $path).Length -le 0) {
    $reasons.Add("REQUIRED_FILE_EMPTY:$relative")
  }
}

$lockPath = Join-Path $runtime "component-lock.json"
if (Test-Path -LiteralPath $lockPath -PathType Leaf) {
  try {
    $lock = Get-Content -Raw -LiteralPath $lockPath | ConvertFrom-Json
    if ($lock.applicationVersion -ne $installedVersion) {
      $reasons.Add("COMPONENT_LOCK_VERSION_MISMATCH")
    }
    if ($lock.runtimeNetworkRequiredAfterBootstrap -ne $false) {
      $reasons.Add("COMPONENT_LOCK_RUNTIME_NETWORK_POLICY_INVALID")
    }
    if ($lock.expectedUserActionAfterInstall -ne "PROVIDER_API_KEY_OR_LOCAL_MODEL") {
      $reasons.Add("COMPONENT_LOCK_USER_ACTION_POLICY_INVALID")
    }
  } catch {
    $reasons.Add("COMPONENT_LOCK_INVALID")
  }
}

if ($reasons.Count -gt 0) {
  $base.state = "REPAIR"
  $base.reasons = @($reasons)
} else {
  $base.state = "CURRENT"
  $base.reasons = @("INSTALLATION_CONTRACT_HEALTHY")
}
Write-Result $base
