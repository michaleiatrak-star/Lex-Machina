$ErrorActionPreference = "Stop"

$hooks = Join-Path $PSScriptRoot "..\lex-desktop\src-tauri\windows\hooks.nsh"
$hooks = [IO.Path]::GetFullPath($hooks)
if (-not (Test-Path -LiteralPath $hooks -PathType Leaf)) {
  throw "NSIS_HOOK_CONTRACT_FILE_MISSING"
}

$content = Get-Content -Raw -LiteralPath $hooks
$match = [regex]::Match(
  $content,
  '(?s)!macro NSIS_HOOK_PREINSTALL(?<body>.*?)!macroend'
)
if (-not $match.Success) {
  throw "NSIS_HOOK_CONTRACT_PREINSTALL_MISSING"
}

$body = $match.Groups["body"].Value
if ($body -notmatch 'SetOutPath\s+"\$PLUGINSDIR"') {
  throw "NSIS_HOOK_CONTRACT_PLUGIN_STAGING_MISSING"
}

$pluginIndex = $body.LastIndexOf('SetOutPath "$PLUGINSDIR"')
$installIndex = $body.LastIndexOf('SetOutPath "$INSTDIR"')
if (
  $pluginIndex -lt 0 -or
  $installIndex -lt 0 -or
  $installIndex -le $pluginIndex
) {
  throw "NSIS_HOOK_CONTRACT_INSTALLDIR_NOT_RESTORED"
}

Write-Host "NSIS PREINSTALL output-directory contract: PASS"
