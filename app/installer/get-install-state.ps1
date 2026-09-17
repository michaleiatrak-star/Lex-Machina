param(
  [string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$TargetManifestPath,
  [string]$OutputPath,
  [string]$ProductName = "Lex Machina",
  [switch]$DiscoverRegisteredInstall,
  [switch]$FailOnInstallRootMismatch,
  [switch]$FailOnDowngrade
)

$ErrorActionPreference = "Stop"
$preferredRuntime = if ([string]::IsNullOrWhiteSpace($RuntimeRoot)) {
  $null
} else {
  [IO.Path]::GetFullPath($RuntimeRoot)
}
$targetManifestFile = [IO.Path]::GetFullPath($TargetManifestPath)

function Normalize-InstallRoot([object]$Value) {
  if ($null -eq $Value) { return $null }
  $text = $Value.ToString().Trim().Trim('"')
  if ([string]::IsNullOrWhiteSpace($text)) { return $null }
  try { return [IO.Path]::GetFullPath($text) }
  catch { return $null }
}

function Get-RegisteredInstallRoot([string]$Name) {
  if (-not $DiscoverRegisteredInstall) { return $null }
  if ([string]::IsNullOrWhiteSpace($Name) -or $Name.Length -gt 160) {
    throw "INSTALL_STATE_PRODUCT_NAME_INVALID"
  }

  $key = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$Name"
  try {
    $item = Get-ItemProperty -LiteralPath $key -ErrorAction Stop
    $location = Normalize-InstallRoot $item.InstallLocation
    if ($location) {
      return [pscustomobject]@{
        Root = $location
        Source = "HKCU_UNINSTALL_INSTALLLOCATION"
        RegistryKey = $key
      }
    }

    $uninstall = [string]$item.UninstallString
    if ($uninstall -match '^"([^"]+)\\uninstall\.exe"') {
      $root = Normalize-InstallRoot ([IO.Path]::GetDirectoryName($matches[1]))
      if ($root) {
        return [pscustomobject]@{
          Root = $root
          Source = "HKCU_UNINSTALL_UNINSTALLSTRING"
          RegistryKey = $key
        }
      }
    }
  } catch {
    return $null
  }
  return $null
}

$registered = Get-RegisteredInstallRoot $ProductName
$registeredInstallRoot = if ($registered) { $registered.Root } else { $null }
$registeredRuntime = if ($registeredInstallRoot) {
  [IO.Path]::GetFullPath((Join-Path $registeredInstallRoot "runtime"))
} else {
  $null
}

$runtime = if (
  $registeredRuntime -and
  (
    -not $preferredRuntime -or
    -not (Test-Path -LiteralPath $preferredRuntime -PathType Container)
  )
) {
  $registeredRuntime
} elseif ($preferredRuntime) {
  $preferredRuntime
} elseif ($registeredRuntime) {
  $registeredRuntime
} else {
  throw "INSTALL_STATE_RUNTIME_ROOT_MISSING"
}

$preferredInstallRoot = if ($preferredRuntime) {
  [IO.Path]::GetDirectoryName($preferredRuntime)
} else {
  $null
}
$installRootMismatch = [bool](
  $registeredInstallRoot -and
  $preferredInstallRoot -and
  -not [string]::Equals(
    $registeredInstallRoot.TrimEnd('\'),
    $preferredInstallRoot.TrimEnd('\'),
    [StringComparison]::OrdinalIgnoreCase
  )
)

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
$localAiConfig = if ($env:LOCALAPPDATA) {
  Join-Path $env:LOCALAPPDATA "LexMachina\local-ai\config.json"
} else { $null }
$base = @{
  schemaVersion = 3
  runtimeRoot = $runtime
  preferredRuntimeRoot = $preferredRuntime
  preferredInstallRoot = $preferredInstallRoot
  registeredInstallRoot = $registeredInstallRoot
  discoverySource = if ($registered) { $registered.Source } elseif ($preferredRuntime) { "PREFERRED_RUNTIME_ROOT" } else { "NONE" }
  installRootMismatch = $installRootMismatch
  targetVersion = $targetVersion
  checkedAt = $checkedAt
  localAiConfigured = [bool]($localAiConfig -and (Test-Path -LiteralPath $localAiConfig -PathType Leaf))
}

if ($installRootMismatch -and $FailOnInstallRootMismatch) {
  $base.state = "INSTALL_ROOT_MISMATCH"
  $base.installedVersion = $null
  $base.reasons = @(
    "REGISTERED_INSTALL_ROOT_DIFFERS_FROM_INSTALLER_TARGET",
    "REGISTERED:$registeredInstallRoot",
    "TARGET:$preferredInstallRoot"
  )
  Write-Result $base
  exit 24
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
$requiredFiles = @(
  "component-lock.json",
  "lex-runtime-sidecar.exe",
  "node\node.exe",
  "python\python.exe"
)

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
    if ($lock.expectedUserActionAfterInstall -ne "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP") {
      $reasons.Add("COMPONENT_LOCK_USER_ACTION_POLICY_INVALID")
    }
    if ($null -eq $lock.localAi -or $lock.localAi.requiredForApplicationHealth -ne $false) {
      $reasons.Add("COMPONENT_LOCK_LOCAL_AI_POLICY_INVALID")
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
