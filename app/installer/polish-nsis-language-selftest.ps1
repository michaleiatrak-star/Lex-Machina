$ErrorActionPreference = "Stop"

$path = Join-Path $PSScriptRoot "..\lex-desktop\src-tauri\windows\Polish.nsh"
$resolved = (Resolve-Path -LiteralPath $path).Path
$lines = Get-Content -LiteralPath $resolved -Encoding UTF8

$expected = @(
  "addOrReinstall",
  "alreadyInstalled",
  "alreadyInstalledLong",
  "appRunning",
  "appRunningOkKill",
  "chooseMaintenanceOption",
  "choowHowToInstall",
  "createDesktop",
  "dontUninstall",
  "dontUninstallDowngrade",
  "failedToKillApp",
  "installingWebview2",
  "newerVersionInstalled",
  "older",
  "olderOrUnknownVersionInstalled",
  "silentDowngrades",
  "unableToUninstall",
  "uninstallApp",
  "uninstallBeforeInstalling",
  "unknown",
  "webview2AbortError",
  "webview2DownloadError",
  "webview2DownloadSuccess",
  "webview2Downloading",
  "webview2InstallError",
  "webview2InstallSuccess",
  "deleteAppData"
)

$actual = @()
foreach ($line in $lines) {
  if ($line -match '^LangString\s+([A-Za-z0-9_]+)\s+\$\{LANG_POLISH\}\s+"(.+)"\s*$') {
    $name = $matches[1]
    $value = $matches[2]
    if ([string]::IsNullOrWhiteSpace($value)) {
      throw "POLISH_NSIS_EMPTY_VALUE:$name"
    }
    $actual += $name
  }
}

$missing = @($expected | Where-Object { $_ -notin $actual })
$duplicates = @(
  $actual |
    Group-Object |
    Where-Object Count -gt 1 |
    ForEach-Object Name
)
$unexpected = @($actual | Where-Object { $_ -notin $expected })

if ($missing.Count -gt 0) {
  throw "POLISH_NSIS_MISSING_STRINGS:$($missing -join ',')"
}
if ($duplicates.Count -gt 0) {
  throw "POLISH_NSIS_DUPLICATE_STRINGS:$($duplicates -join ',')"
}
if ($unexpected.Count -gt 0) {
  throw "POLISH_NSIS_UNEXPECTED_STRINGS:$($unexpected -join ',')"
}

$maintenanceText = Get-Content -Raw -LiteralPath $resolved -Encoding UTF8
foreach ($requiredPhrase in @(
  "Napraw / zainstaluj ponownie składniki",
  "Aktualizuj w miejscu",
  "Wykryto istniejącą instalację"
)) {
  if ($maintenanceText -notmatch [regex]::Escape($requiredPhrase)) {
    throw "POLISH_NSIS_MAINTENANCE_COPY_MISSING:$requiredPhrase"
  }
}

Write-Host "Polish NSIS maintenance language contract: PASS"
Write-Host "LangStrings checked: $($expected.Count)"
