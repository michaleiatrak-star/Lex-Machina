param(
  [Parameter(Mandatory=$true)][string]$StatePath
)

$ErrorActionPreference = "Stop"
$stateFile = (Resolve-Path -LiteralPath $StatePath).Path
$state = Get-Content -Raw -LiteralPath $stateFile | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace([string]$state.state)) {
  throw "INSTALL_STATE_VALUE_MISSING"
}
Write-Output ([string]$state.state)
