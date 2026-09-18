param()

$ErrorActionPreference = "Stop"

$desktopRoot = Join-Path $PSScriptRoot "..\lex-desktop\src-tauri"
$baseConfigPath = Join-Path $desktopRoot "tauri.conf.json"
$offlineConfigPath = Join-Path $desktopRoot "tauri.offline.conf.json"

foreach ($requiredFile in @($baseConfigPath, $offlineConfigPath)) {
  if (-not (Test-Path -LiteralPath $requiredFile -PathType Leaf)) {
    throw "NSIS_POLISH_SELFTEST_CONFIG_MISSING:$requiredFile"
  }
}

$base = Get-Content -Raw -LiteralPath $baseConfigPath | ConvertFrom-Json
$offline = Get-Content -Raw -LiteralPath $offlineConfigPath | ConvertFrom-Json

$languages = @($base.bundle.windows.nsis.languages)
if ($languages -notcontains "Polish") {
  throw "NSIS_POLISH_SELFTEST_LANGUAGE_NOT_ENABLED"
}

$customPath = [string]$base.bundle.windows.nsis.customLanguageFiles.Polish
if ([string]::IsNullOrWhiteSpace($customPath)) {
  throw "NSIS_POLISH_SELFTEST_CUSTOM_FILE_NOT_CONFIGURED"
}

# Resolve relative to src-tauri, matching Tauri config semantics.
$polishPath = [IO.Path]::GetFullPath(
  (Join-Path $desktopRoot ($customPath -replace '^\.\\', ''))
)
if (-not (Test-Path -LiteralPath $polishPath -PathType Leaf)) {
  throw "NSIS_POLISH_SELFTEST_CUSTOM_FILE_MISSING:$polishPath"
}

# The offline config is an overlay. It must not replace the NSIS language
# configuration with an incomplete one.
if ($null -ne $offline.bundle.windows.nsis) {
  $offlineLanguages = @($offline.bundle.windows.nsis.languages)
  if (
    $offlineLanguages.Count -gt 0 -and
    $offlineLanguages -notcontains "Polish"
  ) {
    throw "NSIS_POLISH_SELFTEST_OFFLINE_LANGUAGE_OVERRIDE_INVALID"
  }

  $offlineCustom = [string]$offline.bundle.windows.nsis.customLanguageFiles.Polish
  if (
    $offline.bundle.windows.nsis.customLanguageFiles -and
    [string]::IsNullOrWhiteSpace($offlineCustom)
  ) {
    throw "NSIS_POLISH_SELFTEST_OFFLINE_CUSTOM_FILE_OVERRIDE_INVALID"
  }
}

# Exact custom LangString contract used by Tauri 2.11.5.
$requiredKeys = @(
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

$text = Get-Content -Raw -LiteralPath $polishPath
$seen = @{}

foreach ($line in ($text -split "\r?\n")) {
  if ($line -match '^\s*LangString\s+([A-Za-z0-9_]+)\s+\$\{LANG_POLISH\}\s+"(.+)"\s*$') {
    $key = $matches[1]
    $value = $matches[2].Trim()
    if ([string]::IsNullOrWhiteSpace($value)) {
      throw "NSIS_POLISH_SELFTEST_EMPTY_VALUE:$key"
    }
    if ($seen.ContainsKey($key)) {
      throw "NSIS_POLISH_SELFTEST_DUPLICATE_KEY:$key"
    }
    $seen[$key] = $value
  }
}

foreach ($key in $requiredKeys) {
  if (-not $seen.ContainsKey($key)) {
    throw "NSIS_POLISH_SELFTEST_REQUIRED_KEY_MISSING:$key"
  }
}

# These strings are especially important for the maintenance/update path.
$semanticChecks = @{
  "chooseMaintenanceOption" = @("aktual", "napraw")
  "dontUninstall" = @("Aktualizuj", "zachowaj")
  "olderOrUnknownVersionInstalled" = @("zaktualiz", "istniejącym katalogu")
  "newerVersionInstalled" = @("Downgrade", "zablokowany")
  "addOrReinstall" = @("Napraw", "ponownie")
}

foreach ($entry in $semanticChecks.GetEnumerator()) {
  $value = [string]$seen[$entry.Key]
  foreach ($fragment in $entry.Value) {
    if ($value.IndexOf($fragment, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
      throw "NSIS_POLISH_SELFTEST_SEMANTIC_TEXT_MISSING:$($entry.Key):$fragment"
    }
  }
}

Write-Host "NSIS_POLISH_LANGUAGE_SELFTEST_PASS"
Write-Host "Custom file: $polishPath"
Write-Host "Validated Tauri custom strings: $($requiredKeys.Count)"
