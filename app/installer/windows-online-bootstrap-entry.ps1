param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [switch]$StopAfterPythonValidation
)

$ErrorActionPreference = "Stop"
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"

$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$logPath = Join-Path $runtime "bootstrap-install.log"
$transcriptStarted = $false
try {
  Start-Transcript -LiteralPath $logPath -Force | Out-Null
  $transcriptStarted = $true
} catch {
  Write-Host "BOOTSTRAP_TRANSCRIPT_UNAVAILABLE:$($_.Exception.Message)"
}

try {
  $pythonBootstrap = Join-Path $PSScriptRoot "windows-online-python-embedded.ps1"
  $runtimeBootstrap = Join-Path $PSScriptRoot "windows-online-bootstrap.ps1"
  foreach ($required in @($pythonBootstrap, $runtimeBootstrap)) {
    if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
      throw "ONLINE_BOOTSTRAP_ENTRY_REQUIRED_SCRIPT_MISSING:$required"
    }
  }

  Write-Host "[bootstrap 1/2] Przygotowanie prywatnego Pythona. Instalator pracuje..."
  & $pythonBootstrap -RuntimeRoot $RuntimeRoot
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
  Write-Host "[bootstrap 1/2] Prywatny Python gotowy."

  if ($StopAfterPythonValidation) {
    Write-Host "[bootstrap 2/2] Walidacja sciezki Python..."
    & $runtimeBootstrap -RuntimeRoot $RuntimeRoot -StopAfterPythonValidation
  } else {
    Write-Host "[bootstrap 2/2] Konfiguracja Node, pakietow Python, modeli OCR/NER i skladnikow systemowych."
    Write-Host "[bootstrap 2/2] Ten etap moze trwac kilka minut; kolejne komunikaty oznaczaja aktywna prace instalatora."
    & $runtimeBootstrap -RuntimeRoot $RuntimeRoot
  }
  $code = $LASTEXITCODE
  if ($null -eq $code) { $code = 0 }
  if ($code -eq 0) {
    Write-Host "LEX_ONLINE_BOOTSTRAP_ENTRY_PASS"
  }
  exit $code
} catch {
  Write-Host "LEX_ONLINE_BOOTSTRAP_ENTRY_FAILED:$($_.Exception.Message)"
  throw
} finally {
  if ($transcriptStarted) {
    try { Stop-Transcript | Out-Null } catch {}
  }
}
