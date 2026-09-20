$ErrorActionPreference = "Stop"

$bootstrapPath = Join-Path $PSScriptRoot "windows-online-bootstrap.ps1"
$prefetchPath = Join-Path $PSScriptRoot "prefetch-release-models.py"
$ocrWorkerPath = Join-Path (Split-Path -Parent $PSScriptRoot) "ocr\paddle_worker.py"

$manifestPath = Join-Path $PSScriptRoot "windows-release-source.json"
$bootstrap = Get-Content -Raw -LiteralPath $bootstrapPath
$prefetch = Get-Content -Raw -LiteralPath $prefetchPath
$ocrWorker = Get-Content -Raw -LiteralPath $ocrWorkerPath
$manifest = Get-Content -Raw -LiteralPath $manifestPath

$checks = [ordered]@{
  pythonAppLocalEmbedded = (
    $bootstrap.Contains('EMBEDDABLE_APP_LOCAL') -and
    $bootstrap.Contains('python*._pth') -and
    $bootstrap.Contains('Lib\site-packages') -and
    $bootstrap.Contains('$pipWheelEntry = "pip-bootstrap.whl"') -and
    $bootstrap.Contains('Copy-Item -LiteralPath $pipWheel -Destination $privatePipWheel -Force') -and
    $bootstrap.Contains('zipimport can load pip from the wheel itself') -and
    -not $bootstrap.Contains('[IO.Compression.ZipFile]::ExtractToDirectory($pipWheel, $sitePackages)') -and
    -not $bootstrap.Contains('Start-Process -FilePath $pythonInstaller')
  )
  pythonPinnedEmbeddedManifest = (
    $manifest.Contains('"delivery": "EMBEDDABLE_APP_LOCAL"') -and
    $manifest.Contains('python-3.13.15-embed-amd64.zip') -and
    $manifest.Contains('d1f04d990aee1253d8569e8e5104e30fa9f5fa830899f14843448872d936a2cf') -and
    $manifest.Contains('"version": "26.2.1"') -and
    $manifest.Contains('71138adf1f4ca900cdb7d289c21b7494329f2332b6d85f0e1c42108c0384ed3e')
  )
  pythonVersionDiagnostics = (
    $bootstrap.Contains("BOOTSTRAP_PYTHON_VERSION_INVALID expected=")
  )
  pipNativeStderrSafe = (
    $bootstrap.Contains('$pipVersionOutput = @(& $pythonExe -m pip --version 2>&1)') -and
    $bootstrap.Contains('$ErrorActionPreference = "Continue"') -and
    $bootstrap.Contains('BOOTSTRAP_PIP_VERSION_INVALID expected=') -and
    $bootstrap.Contains('BOOTSTRAP_PYTHON_PACKAGES_FAILED:$pipInstallExit')
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
