$ErrorActionPreference = "Stop"

$bootstrapPath = Join-Path $PSScriptRoot "windows-online-bootstrap.ps1"
$prefetchPath = Join-Path $PSScriptRoot "prefetch-release-models.py"

$bootstrap = Get-Content -Raw -LiteralPath $bootstrapPath
$prefetch = Get-Content -Raw -LiteralPath $prefetchPath

$checks = [ordered]@{
  pythonTargetDirQuoted = (
    $bootstrap.Contains('TargetDir="{0}"') -and
    $bootstrap.Contains('$pythonInstallArguments')
  )
  pythonVersionDiagnostics = (
    $bootstrap.Contains("BOOTSTRAP_PYTHON_VERSION_INVALID expected=")
  )
  officialSourceFallbackOrder = (
    $bootstrap.Contains('$modelSources = @("bos", "huggingface", "modelscope", "aistudio")')
  )
  freshProcessPerSource = (
    $bootstrap.Contains('$env:PADDLE_PDX_MODEL_SOURCE = $source') -and
    $bootstrap.Contains('& $pythonExe $prefetchScript $modelRoot | Out-Host')
  )
  failedPartialCachePurged = (
    $bootstrap.Contains('Remove-Item -LiteralPath $candidate -Recurse -Force')
  )
  failClosedAfterAllSources = (
    $bootstrap.Contains("BOOTSTRAP_MODEL_PREFETCH_FAILED_ALL_OFFICIAL_SOURCES")
  )
  explicitBosDefault = (
    $prefetch.Contains('PADDLE_PDX_MODEL_SOURCE", "bos"')
  )
  allowedOfficialSources = (
    $prefetch.Contains('{"bos", "huggingface", "modelscope", "aistudio"}')
  )
  sourceRecordedInResult = (
    $prefetch.Contains('"source": model_source')
  )
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value } |
    ForEach-Object { $_.Key }
)

if ($failed.Count -gt 0) {
  throw "ONLINE_BOOTSTRAP_CONTRACT_FAILED:$($failed -join ',')"
}

Write-Host "ONLINE_BOOTSTRAP_CONTRACT_PASS"
$checks.GetEnumerator() | ForEach-Object {
  Write-Host "$($_.Key)=PASS"
}
