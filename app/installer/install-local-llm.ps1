param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$ManifestPath,
  [string]$CacheRoot
)

$ErrorActionPreference = "Stop"
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$manifestFile = [IO.Path]::GetFullPath($ManifestPath)
$manifest = Get-Content -Raw -LiteralPath $manifestFile | ConvertFrom-Json
$cache = if ($CacheRoot) {
  [IO.Path]::GetFullPath($CacheRoot)
} else {
  Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache\local-llm"
}
New-Item -ItemType Directory -Force -Path $cache | Out-Null

if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
  function Get-FileHash {
    param(
      [string]$Path,
      [string]$LiteralPath,
      [string]$Algorithm = "SHA256"
    )
    if ($Algorithm.ToUpperInvariant() -ne "SHA256") {
      throw "LOCAL_LLM_HASH_ALGORITHM_UNSUPPORTED:$Algorithm"
    }
    $target = if ($LiteralPath) { $LiteralPath } else { $Path }
    if (-not $target) { throw "LOCAL_LLM_HASH_PATH_MISSING" }
    $stream = [IO.File]::OpenRead($target)
    try {
      $sha = [Security.Cryptography.SHA256]::Create()
      try { $bytes = $sha.ComputeHash($stream) }
      finally { $sha.Dispose() }
    } finally { $stream.Dispose() }
    [pscustomobject]@{
      Algorithm = "SHA256"
      Hash = ([BitConverter]::ToString($bytes) -replace '-','')
      Path = [IO.Path]::GetFullPath($target)
    }
  }
}

function Get-VerifiedDownload(
  [string]$Url,
  [string]$ExpectedSha256,
  [string]$Destination,
  [string]$Label
) {
  if ($ExpectedSha256 -notmatch '^[a-fA-F0-9]{64}$') {
    throw "LOCAL_LLM_HASH_INVALID:$Label"
  }
  if (Test-Path -LiteralPath $Destination -PathType Leaf) {
    $cached = (Get-FileHash -Algorithm SHA256 -LiteralPath $Destination).Hash.ToLowerInvariant()
    if ($cached -eq $ExpectedSha256.ToLowerInvariant()) {
      Write-Host "Using verified cache for $Label"
      return
    }
    Remove-Item -LiteralPath $Destination -Force
  }
  Write-Host "Downloading $Label"
  Invoke-WebRequest -UseBasicParsing -Uri $Url -OutFile $Destination
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $Destination).Hash.ToLowerInvariant()
  if ($actual -ne $ExpectedSha256.ToLowerInvariant()) {
    Remove-Item -LiteralPath $Destination -Force -ErrorAction SilentlyContinue
    throw "LOCAL_LLM_HASH_MISMATCH:$Label expected=$ExpectedSha256 actual=$actual"
  }
}

if ($null -eq $manifest.runtime.llamaCpp) {
  throw "LOCAL_LLM_ENGINE_MANIFEST_MISSING"
}
if ($null -eq $manifest.models.localLlm -or @($manifest.models.localLlm).Count -lt 2) {
  throw "LOCAL_LLM_MODEL_MANIFEST_MISSING"
}

$llmRoot = Join-Path $runtime "llm"
$engineDir = Join-Path $llmRoot "llama"
$modelDir = Join-Path $llmRoot "models"
New-Item -ItemType Directory -Force -Path $llmRoot | Out-Null
New-Item -ItemType Directory -Force -Path $modelDir | Out-Null

$engine = $manifest.runtime.llamaCpp
$engineZip = Join-Path $cache ("llama-" + $engine.version + "-win-cpu-x64.zip")
Get-VerifiedDownload $engine.url $engine.sha256 $engineZip "llama.cpp"
if (-not (Test-Path -LiteralPath (Join-Path $engineDir "llama-server.exe") -PathType Leaf)) {
  $extract = Join-Path $cache ("llama-extract-" + $engine.version)
  Remove-Item $extract -Recurse -Force -ErrorAction SilentlyContinue
  Expand-Archive -LiteralPath $engineZip -DestinationPath $extract -Force
  Remove-Item $engineDir -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Force -Path $engineDir | Out-Null
  $server = Get-ChildItem -Path $extract -Recurse -File -Filter "llama-server.exe" | Select-Object -First 1
  if (-not $server) { throw "LOCAL_LLM_ENGINE_ARCHIVE_LAYOUT_INVALID" }
  $sourceDir = Split-Path -Parent $server.FullName
  Copy-Item (Join-Path $sourceDir "*") $engineDir -Recurse -Force
}
if (-not (Test-Path -LiteralPath (Join-Path $engineDir "llama-server.exe") -PathType Leaf)) {
  throw "LOCAL_LLM_SERVER_MISSING"
}

foreach ($model in @($manifest.models.localLlm)) {
  if (-not $model.filename -or -not $model.url -or -not $model.sha256) {
    throw "LOCAL_LLM_MODEL_MANIFEST_INVALID"
  }
  $cachedModel = Join-Path $cache $model.filename
  Get-VerifiedDownload $model.url $model.sha256 $cachedModel ("model:" + $model.id)
  $target = Join-Path $modelDir $model.filename
  $copyRequired = $true
  if (Test-Path -LiteralPath $target -PathType Leaf) {
    $targetHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash.ToLowerInvariant()
    $copyRequired = $targetHash -ne $model.sha256.ToLowerInvariant()
  }
  if ($copyRequired) {
    $temporary = $target + ".tmp"
    Remove-Item -LiteralPath $temporary -Force -ErrorAction SilentlyContinue
    Copy-Item -LiteralPath $cachedModel -Destination $temporary -Force
    $temporaryHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $temporary).Hash.ToLowerInvariant()
    if ($temporaryHash -ne $model.sha256.ToLowerInvariant()) {
      Remove-Item -LiteralPath $temporary -Force -ErrorAction SilentlyContinue
      throw "LOCAL_LLM_STAGED_HASH_MISMATCH:$($model.id)"
    }
    Move-Item -LiteralPath $temporary -Destination $target -Force
  }
}

$required = @(
  "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf",
  "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf"
)
foreach ($name in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $modelDir $name) -PathType Leaf)) {
    throw "LOCAL_LLM_REQUIRED_MODEL_MISSING:$name"
  }
}

Write-Host "LEX_LOCAL_LLM_INSTALL_PASS:$llmRoot"
