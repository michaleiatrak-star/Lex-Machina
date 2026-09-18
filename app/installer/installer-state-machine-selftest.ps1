param()

$ErrorActionPreference = "Stop"
$probe = Join-Path $PSScriptRoot "get-install-state.ps1"
if (-not (Test-Path -LiteralPath $probe -PathType Leaf)) {
  throw "INSTALL_STATE_SELFTEST_PROBE_MISSING"
}

$hooks = Join-Path $PSScriptRoot "..\lex-desktop\src-tauri\windows\hooks.nsh"
if (-not (Test-Path -LiteralPath $hooks -PathType Leaf)) {
  throw "INSTALL_STATE_SELFTEST_NSIS_HOOKS_MISSING"
}
$hookText = Get-Content -Raw -LiteralPath $hooks
foreach ($required in @(
  'File "/oname=prefetch-release-models.py"',
  'CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\prefetch-release-models.py" "$INSTDIR\runtime\bootstrap\prefetch-release-models.py"'
)) {
  if (-not $hookText.Contains($required)) {
    throw "INSTALL_STATE_SELFTEST_BOOTSTRAP_EMBED_CONTRACT_MISSING:$required"
  }
}

$powershell = Join-Path $PSHOME "powershell.exe"
if (-not (Test-Path -LiteralPath $powershell -PathType Leaf)) {
  $command = Get-Command powershell.exe -ErrorAction SilentlyContinue
  if (-not $command) { throw "INSTALL_STATE_SELFTEST_POWERSHELL_MISSING" }
  $powershell = $command.Source
}

$temp = Join-Path $env:TEMP ("lex-install-state-selftest-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $temp | Out-Null

function Write-Utf8([string]$Path, [string]$Content) {
  $parent = Split-Path -Parent $Path
  if ($parent) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  [IO.File]::WriteAllText($Path, $Content, [Text.UTF8Encoding]::new($false))
}

function Write-InstalledManifest([string]$Runtime, [string]$Version) {
  $manifest = [ordered]@{
    schemaVersion = 4
    applicationVersion = $Version
    localAi = [ordered]@{
      delivery = "USER_INITIATED_AFTER_INSTALL"
    }
  } | ConvertTo-Json -Depth 8
  Write-Utf8 (Join-Path $Runtime "release-source.json") $manifest
}

function Invoke-Probe(
  [string]$Runtime,
  [string]$Target,
  [switch]$FailOnDowngrade,
  [switch]$DiscoverRegisteredInstall,
  [switch]$FailOnInstallRootMismatch,
  [string]$ProductName = "Lex Machina"
) {
  $args = @(
    "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass",
    "-File", $probe,
    "-RuntimeRoot", $Runtime,
    "-TargetManifestPath", $Target,
    "-ProductName", $ProductName
  )
  if ($DiscoverRegisteredInstall) { $args += "-DiscoverRegisteredInstall" }
  if ($FailOnInstallRootMismatch) { $args += "-FailOnInstallRootMismatch" }
  if ($FailOnDowngrade) { $args += "-FailOnDowngrade" }
  $lines = & $powershell @args
  $exit = $LASTEXITCODE
  $jsonLine = @($lines | Where-Object { $_ -and $_.Trim().StartsWith("{") } | Select-Object -Last 1)
  if ($jsonLine.Count -ne 1) {
    throw "INSTALL_STATE_SELFTEST_JSON_MISSING:exit=$exit output=$($lines -join ' | ')"
  }
  [pscustomobject]@{
    ExitCode = $exit
    Result = ($jsonLine[0] | ConvertFrom-Json)
  }
}

function Assert-State([string]$Expected, [object]$Actual, [string]$Label) {
  if ($Actual.Result.state -ne $Expected) {
    throw "INSTALL_STATE_SELFTEST_STATE_FAILED:${Label}:expected=$Expected actual=$($Actual.Result.state)"
  }
  if ($Actual.ExitCode -ne 0) {
    throw "INSTALL_STATE_SELFTEST_EXIT_FAILED:${Label}:$($Actual.ExitCode)"
  }
}

try {
  $target = Join-Path $temp "target-release-source.json"
  $targetManifest = [ordered]@{
    schemaVersion = 4
    applicationVersion = "0.1.3"
    localAi = [ordered]@{
      delivery = "USER_INITIATED_AFTER_INSTALL"
    }
  } | ConvertTo-Json -Depth 8
  Write-Utf8 $target $targetManifest

  $freshRuntime = Join-Path $temp "fresh"
  Assert-State "FRESH" (Invoke-Probe $freshRuntime $target) "fresh"

  $repairRuntime = Join-Path $temp "repair"
  New-Item -ItemType Directory -Path $repairRuntime | Out-Null
  Write-Utf8 (Join-Path $repairRuntime "orphan.txt") "orphan"
  Assert-State "REPAIR" (Invoke-Probe $repairRuntime $target) "repair-missing-manifest"

  $upgradeRuntime = Join-Path $temp "upgrade"
  New-Item -ItemType Directory -Path $upgradeRuntime | Out-Null
  Write-InstalledManifest $upgradeRuntime "0.1.2"
  Assert-State "UPGRADE" (Invoke-Probe $upgradeRuntime $target) "upgrade"

  $downgradeRuntime = Join-Path $temp "downgrade"
  New-Item -ItemType Directory -Path $downgradeRuntime | Out-Null
  Write-InstalledManifest $downgradeRuntime "0.1.4"
  Assert-State "DOWNGRADE_BLOCKED" (Invoke-Probe $downgradeRuntime $target) "downgrade-classification"
  $blocked = Invoke-Probe $downgradeRuntime $target -FailOnDowngrade
  if ($blocked.Result.state -ne "DOWNGRADE_BLOCKED" -or $blocked.ExitCode -ne 23) {
    throw "INSTALL_STATE_SELFTEST_DOWNGRADE_EXIT_FAILED:state=$($blocked.Result.state) exit=$($blocked.ExitCode)"
  }

  $registryProduct = "Lex Machina G39 Selftest " + [Guid]::NewGuid().ToString("N")
  $registryKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$registryProduct"
  $registeredInstallRoot = Join-Path $temp "registered-custom-location"
  $registeredRuntime = Join-Path $registeredInstallRoot "runtime"
  New-Item -ItemType Directory -Force -Path $registeredRuntime | Out-Null
  Write-InstalledManifest $registeredRuntime "0.1.2"
  New-Item -Path $registryKey -Force | Out-Null
  Set-ItemProperty -LiteralPath $registryKey -Name "InstallLocation" -Value $registeredInstallRoot
  Set-ItemProperty -LiteralPath $registryKey -Name "DisplayVersion" -Value "0.1.2"
  Set-ItemProperty -LiteralPath $registryKey -Name "UninstallString" -Value ('"' + (Join-Path $registeredInstallRoot "uninstall.exe") + '"')

  $discovered = Invoke-Probe (Join-Path $temp "default-other-location\runtime") $target -DiscoverRegisteredInstall -ProductName $registryProduct
  Assert-State "UPGRADE" $discovered "upgrade-registered-custom-location"
  if (
    $discovered.Result.discoverySource -ne "HKCU_UNINSTALL_INSTALLLOCATION" -or
    [IO.Path]::GetFullPath([string]$discovered.Result.registeredInstallRoot) -ne [IO.Path]::GetFullPath($registeredInstallRoot) -or
    [IO.Path]::GetFullPath([string]$discovered.Result.runtimeRoot) -ne [IO.Path]::GetFullPath($registeredRuntime)
  ) {
    throw "INSTALL_STATE_SELFTEST_REGISTERED_DISCOVERY_FAILED"
  }

  $hydrated = Invoke-Probe $registeredRuntime $target -DiscoverRegisteredInstall -FailOnInstallRootMismatch -ProductName $registryProduct
  Assert-State "UPGRADE" $hydrated "upgrade-hydrated-registered-location"
  if ($hydrated.Result.installRootMismatch -ne $false) {
    throw "INSTALL_STATE_SELFTEST_HYDRATED_ROOT_MISMATCH"
  }

  $mismatch = Invoke-Probe (Join-Path $temp "different-target\runtime") $target -DiscoverRegisteredInstall -FailOnInstallRootMismatch -ProductName $registryProduct
  if (
    $mismatch.Result.state -ne "INSTALL_ROOT_MISMATCH" -or
    $mismatch.ExitCode -ne 24
  ) {
    throw "INSTALL_STATE_SELFTEST_ROOT_MISMATCH_GATE_FAILED:state=$($mismatch.Result.state) exit=$($mismatch.ExitCode)"
  }
  $currentRuntime = Join-Path $temp "current"
  New-Item -ItemType Directory -Path $currentRuntime | Out-Null
  Write-InstalledManifest $currentRuntime "0.1.3"
  foreach ($relative in @(
    "lex-runtime-sidecar.exe",
    "node\node.exe",
    "python\python.exe"
  )) {
    Write-Utf8 (Join-Path $currentRuntime $relative) "fixture"
  }
  $lock = [ordered]@{
    schemaVersion = 4
    applicationVersion = "0.1.3"
    runtimeNetworkRequiredAfterBootstrap = $false
    optionalNetworkActionsAfterInstall = @("LOCAL_AI_PROVISIONING")
    expectedUserActionAfterInstall = "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP"
    localAi = [ordered]@{
      requiredForApplicationHealth = $false
      delivery = "USER_INITIATED_AFTER_INSTALL"
    }
  } | ConvertTo-Json -Depth 6
  Write-Utf8 (Join-Path $currentRuntime "component-lock.json") $lock
  $current = Invoke-Probe $currentRuntime $target
  Assert-State "CURRENT" $current "current-without-local-ai"
  if ($current.Result.localAiConfigured -ne $false) {
    throw "INSTALL_STATE_SELFTEST_LOCAL_AI_OPTIONAL_FAILED"
  }

  Remove-Item -LiteralPath (Join-Path $currentRuntime "python\python.exe") -Force
  Assert-State "REPAIR" (Invoke-Probe $currentRuntime $target) "repair-corrupt-core-runtime"

  Write-Host "G39G_INSTALL_STATE_SELFTEST_PASS"
} finally {
  if ($registryKey) {
    Remove-Item -LiteralPath $registryKey -Recurse -Force -ErrorAction SilentlyContinue
  }
  Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
}
