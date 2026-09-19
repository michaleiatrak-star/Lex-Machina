$ErrorActionPreference = "Stop"

$bootstrapPath = Join-Path $PSScriptRoot "windows-online-bootstrap.ps1"
$prefetchPath = Join-Path $PSScriptRoot "prefetch-release-models.py"
$ocrWorkerPath = Join-Path (Split-Path -Parent $PSScriptRoot) "ocr\paddle_worker.py"
$releasePath = Join-Path $PSScriptRoot "windows-release-source.json"

$bootstrap = Get-Content -Raw -LiteralPath $bootstrapPath
$prefetch = Get-Content -Raw -LiteralPath $prefetchPath
$ocrWorker = Get-Content -Raw -LiteralPath $ocrWorkerPath
$release = Get-Content -Raw -LiteralPath $releasePath | ConvertFrom-Json

$checks = [ordered]@{
  pythonNugetSideBySide = (
    $release.runtime.python.distribution -eq "NUGET_SIDE_BY_SIDE" -and
    $release.runtime.python.url -match "api\.nuget\.org/.+/python\.3\.13\.15\.nupkg$" -and
    $bootstrap.Contains("BOOTSTRAP_PYTHON_NUGET_LAYOUT_INVALID") -and
    $bootstrap.Contains('Join-Path $extract "tools"')
  )
  pythonDoesNotUseRegisteredInstaller = (
    -not $bootstrap.Contains("TargetDir=") -and
    -not $bootstrap.Contains("Start-Process -FilePath $pythonInstaller")
  )
  pythonPrivatePipGate = (
    $bootstrap.Contains("BOOTSTRAP_PYTHON_PIP_UNAVAILABLE") -and
    $bootstrap.Contains("-m ensurepip --upgrade --default-pip")
  )
  pythonVersionDiagnostics = (
    $bootstrap.Contains("BOOTSTRAP_PYTHON_VERSION_INVALID expected=")
  )
  officialSourceFallbackOrder = (
    $bootstrap.Contains('$modelSources = @("bos", "huggingface", "modelscope", "aistudio")')
  )
  freshProcessPerSource = (
    $bootstrap.Contains('$env:PADDLE_PDX_MODEL_SOURCE = $source') -and
    $bootstrap.Contains('Start-Process -FilePath $pythonExe') -and
    $bootstrap.Contains('-RedirectStandardOutput $prefetchStdout') -and
    $bootstrap.Contains('-RedirectStandardError $prefetchStderr') -and
    $bootstrap.Contains('$prefetchProcess.ExitCode')
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
  unicodeSafePrefetchPath = (
    $prefetch.Contains("GetShortPathNameW") -and
    $prefetch.Contains('["subst", drive, resolved]') -and
    $prefetch.Contains("PADDLE_ASCII_PATH_UNAVAILABLE") -and
    $prefetch.Contains("paddle_native_root")
  )
  unicodeSafeRuntimeOcrPath = (
    $ocrWorker.Contains("GetShortPathNameW") -and
    $ocrWorker.Contains('["subst", drive, resolved]') -and
    $ocrWorker.Contains("PADDLE_ASCII_PATH_UNAVAILABLE") -and
    $ocrWorker.Contains("native_model_root = Path(paddle_native_path(model_root))")
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
