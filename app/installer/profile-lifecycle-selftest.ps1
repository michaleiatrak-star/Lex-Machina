$ErrorActionPreference = "Stop"

$installer = $PSScriptRoot
$repo = (Resolve-Path (Join-Path $installer "..\..")).Path
$purge = Join-Path $installer "purge-windows-user-state.ps1"
$hooks = Join-Path $repo "app\lex-desktop\src-tauri\windows\hooks.nsh"
$trustBoundary = Join-Path $repo "app\lex-desktop\src-tauri\src\trust_boundary.rs"
$httpApp = Join-Path $repo "app\lex-runtime\src\http\app.ts"

foreach ($required in @($purge, $hooks, $trustBoundary, $httpApp)) {
  if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
    throw "PROFILE_LIFECYCLE_REQUIRED_FILE_MISSING:$required"
  }
}

$hooksContent = Get-Content -Raw -LiteralPath $hooks
$purgeContent = Get-Content -Raw -LiteralPath $purge
$trustContent = Get-Content -Raw -LiteralPath $trustBoundary
$appContent = Get-Content -Raw -LiteralPath $httpApp

$checks = [ordered]@{
  installerOffersCleanProfile =
    $hooksContent.Contains("LEX_INSTALL_CLEAN_PROFILE") -and
    $hooksContent.Contains("NOWY CZYSTY profil administratora") -and
    $hooksContent.Contains("-Mode Probe") -and
    $hooksContent.Contains("-Mode Purge")
  uninstallPurgesAllState =
    $hooksContent.Contains("NSIS_HOOK_PREUNINSTALL") -and
    $hooksContent.Contains("usuwa CAŁOŚĆ danych") -and
    $hooksContent.Contains("lex-purge-user-state.ps1")
  credentialManagerPurge =
    $purgeContent.Contains("CredEnumerateW") -and
    $purgeContent.Contains("CredDeleteW") -and
    $purgeContent.Contains(".LexMachina/")
  dataRootsPurged =
    $purgeContent.Contains(".lex-machina") -and
    $purgeContent.Contains("LexMachina") -and
    $purgeContent.Contains("pl.lexmachina.desktop")
  managedAdminBootstrap =
    $appContent.Contains('"local-admin"') -and
    $appContent.Contains('"Administrator lokalny"') -and
    $appContent.Contains("passwordSetupPending:") -and
    $appContent.Contains("true")
  managedAdminSecretRotates =
    $trustContent.Contains("random_secret()") -and
    $trustContent.Contains("MANAGED_KEYRING_SERVICE") -and
    $trustContent.Contains("ensure_managed_identity")
}

$root = Join-Path $env:TEMP ("LexMachina-ProfileLifecycle-" + [Guid]::NewGuid().ToString("N"))
$dataRoot = Join-Path $root "data"
$localRoot = Join-Path $root "local"
$roamingRoot = Join-Path $root "roaming"

try {
  foreach ($dir in @($dataRoot, $localRoot, $roamingRoot)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Set-Content -LiteralPath (Join-Path $dir "sensitive-test.txt") -Value "must-be-deleted" -NoNewline
  }

  $probeArgs = @{
    Mode = "Probe"
    DataRootOverride = $dataRoot
    LocalAppRootOverride = $localRoot
    RoamingAppRootOverride = $roamingRoot
    SkipCredentialManager = $true
    SkipProcessStop = $true
  }
  & $purge @probeArgs
  if ($LASTEXITCODE -ne 10) {
    throw "PROFILE_LIFECYCLE_PROBE_FAILED:$LASTEXITCODE"
  }

  $purgeArgs = @{
    Mode = "Purge"
    DataRootOverride = $dataRoot
    LocalAppRootOverride = $localRoot
    RoamingAppRootOverride = $roamingRoot
    SkipCredentialManager = $true
    SkipProcessStop = $true
  }
  & $purge @purgeArgs
  if ($LASTEXITCODE -ne 0) {
    throw "PROFILE_LIFECYCLE_PURGE_FAILED:$LASTEXITCODE"
  }

  foreach ($dir in @($dataRoot, $localRoot, $roamingRoot)) {
    if (Test-Path -LiteralPath $dir) {
      throw "PROFILE_LIFECYCLE_DATA_LEFT_BEHIND:$dir"
    }
  }
} finally {
  Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value } |
    ForEach-Object { $_.Key }
)
if ($failed.Count -gt 0) {
  throw "PROFILE_LIFECYCLE_CONTRACT_FAILED:$($failed -join ',')"
}

Write-Host ($checks | ConvertTo-Json -Compress)
Write-Host "PROFILE_LIFECYCLE_SELFTEST_PASS"
