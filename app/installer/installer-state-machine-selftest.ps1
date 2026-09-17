param()

$ErrorActionPreference = "Stop"
$probe = Join-Path $PSScriptRoot "get-install-state.ps1"
if (-not (Test-Path -LiteralPath $probe -PathType Leaf)) {
  throw "INSTALL_STATE_SELFTEST_PROBE_MISSING"
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

function Invoke-Probe([string]$Runtime, [string]$Target, [switch]$FailOnDowngrade) {
  $args = @(
    "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass",
    "-File", $probe,
    "-RuntimeRoot", $Runtime,
    "-TargetManifestPath", $Target
  )
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
  Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
}
