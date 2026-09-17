param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [switch]$StopAfterPythonValidation
)

$ErrorActionPreference = "Stop"
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"

$pythonBootstrap = Join-Path $PSScriptRoot "windows-online-python-embedded.ps1"
$runtimeBootstrap = Join-Path $PSScriptRoot "windows-online-bootstrap.ps1"
foreach ($required in @($pythonBootstrap, $runtimeBootstrap)) {
  if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
    throw "ONLINE_BOOTSTRAP_ENTRY_REQUIRED_SCRIPT_MISSING:$required"
  }
}

& $pythonBootstrap -RuntimeRoot $RuntimeRoot
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

if ($StopAfterPythonValidation) {
  & $runtimeBootstrap -RuntimeRoot $RuntimeRoot -StopAfterPythonValidation
} else {
  & $runtimeBootstrap -RuntimeRoot $RuntimeRoot
}
$code = $LASTEXITCODE
if ($null -eq $code) { $code = 0 }
exit $code
