$ErrorActionPreference = "Stop"

$desktopRoot = Join-Path $PSScriptRoot "..\lex-desktop\src-tauri"
$baseConfigPath = Join-Path $desktopRoot "tauri.conf.json"
$offlineConfigPath = Join-Path $desktopRoot "tauri.offline.conf.json"

foreach ($requiredFile in @($baseConfigPath, $offlineConfigPath)) {
  if (-not (Test-Path -LiteralPath $requiredFile -PathType Leaf)) {
    throw "POLISH_NSIS_CONFIG_MISSING:$requiredFile"
  }
}

$base = Get-Content -Raw -LiteralPath $baseConfigPath | ConvertFrom-Json
$offline = Get-Content -Raw -LiteralPath $offlineConfigPath | ConvertFrom-Json

$languages = @($base.bundle.windows.nsis.languages)
if ($languages -notcontains "Polish") {
  throw "POLISH_NSIS_LANGUAGE_NOT_ENABLED"
}

$customPath = [string]$base.bundle.windows.nsis.customLanguageFiles.Polish
if ([string]::IsNullOrWhiteSpace($customPath)) {
  throw "POLISH_NSIS_CUSTOM_FILE_NOT_CONFIGURED"
}

$resolved = [IO.Path]::GetFullPath(
  (Join-Path $desktopRoot ($customPath -replace '^\.\\', ''))
)
if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
  throw "POLISH_NSIS_CUSTOM_FILE_MISSING:$resolved"
}

# The offline config is an overlay; if it starts overriding NSIS settings,
# it may not remove the Polish contract inherited from tauri.conf.json.
if ($null -ne $offline.bundle.windows.nsis) {
  $offlineLanguages = @($offline.bundle.windows.nsis.languages)
  if (
    $offlineLanguages.Count -gt 0 -and
    $offlineLanguages -notcontains "Polish"
  ) {
    throw "POLISH_NSIS_OFFLINE_LANGUAGE_OVERRIDE_INVALID"
  }

  if ($offline.bundle.windows.nsis.customLanguageFiles) {
    $offlineCustom = [string]$offline.bundle.windows.nsis.customLanguageFiles.Polish
    if ([string]::IsNullOrWhiteSpace($offlineCustom)) {
      throw "POLISH_NSIS_OFFLINE_CUSTOM_FILE_OVERRIDE_INVALID"
    }
  }
}

# Exact Tauri 2.11.5 custom LangString contract.
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

$lines = Get-Content -LiteralPath $resolved -Encoding UTF8
$actual = @()
$values = @{}

foreach ($line in $lines) {
  if ($line -match '^\s*LangString\s+([A-Za-z0-9_]+)\s+\$\{LANG_POLISH\}\s+"(.+)"\s*$') {
    $name = $matches[1]
    $value = $matches[2].Trim()
    if ([string]::IsNullOrWhiteSpace($value)) {
      throw "POLISH_NSIS_EMPTY_VALUE:$name"
    }
    if ($values.ContainsKey($name)) {
      throw "POLISH_NSIS_DUPLICATE_STRINGS:$name"
    }
    $actual += $name
    $values[$name] = $value
  }
}

$missing = @($expected | Where-Object { $_ -notin $actual })
$unexpected = @($actual | Where-Object { $_ -notin $expected })

if ($missing.Count -gt 0) {
  throw "POLISH_NSIS_MISSING_STRINGS:$($missing -join ',')"
}
if ($unexpected.Count -gt 0) {
  throw "POLISH_NSIS_UNEXPECTED_STRINGS:$($unexpected -join ',')"
}

# Maintenance copy must describe the actual operation rather than the
# misleading generic Tauri labels ("do not uninstall").
$semanticChecks = @{
  "addOrReinstall" = @("Napraw", "ponownie")
  "chooseMaintenanceOption" = @("aktual", "napraw")
  "dontUninstall" = @("Aktualizuj", "zachowaj", "katalog")
  "olderOrUnknownVersionInstalled" = @("zaktualiz", "istniejącym katalogu")
  "newerVersionInstalled" = @("Downgrade", "zablokowany")
}

foreach ($entry in $semanticChecks.GetEnumerator()) {
  $value = [string]$values[$entry.Key]
  foreach ($fragment in $entry.Value) {
    if ($value.IndexOf($fragment, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
      throw "POLISH_NSIS_MAINTENANCE_COPY_MISSING:$($entry.Key):$fragment"
    }
  }
}

Write-Host "Polish NSIS maintenance language contract: PASS"
Write-Host "Custom file: $resolved"
Write-Host "LangStrings checked: $($expected.Count)"
