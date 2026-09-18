param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$ManifestPath,
  [string]$LocalAiRoot,
  [string]$CacheRoot
)

$ErrorActionPreference = "Stop"

$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$manifestFile = [IO.Path]::GetFullPath($ManifestPath)
if (-not (Test-Path -LiteralPath $manifestFile -PathType Leaf)) {
  throw "LOCAL_AI_PREINSTALL_MANIFEST_MISSING"
}
$manifest = Get-Content -Raw -LiteralPath $manifestFile | ConvertFrom-Json

$localRoot = if ($LocalAiRoot) {
  [IO.Path]::GetFullPath($LocalAiRoot)
} else {
  Join-Path $env:LOCALAPPDATA "LexMachina\local-ai"
}
$cache = if ($CacheRoot) {
  [IO.Path]::GetFullPath($CacheRoot)
} else {
  Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache\local-llm"
}

New-Item -ItemType Directory -Force -Path $localRoot | Out-Null
New-Item -ItemType Directory -Force -Path $cache | Out-Null
$modelDir = Join-Path $localRoot "models"
New-Item -ItemType Directory -Force -Path $modelDir | Out-Null

if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
  function Get-FileHash {
    param(
      [string]$Path,
      [string]$LiteralPath,
      [string]$Algorithm = "SHA256"
    )
    if ($Algorithm.ToUpperInvariant() -ne "SHA256") {
      throw "LOCAL_AI_PREINSTALL_HASH_ALGORITHM_UNSUPPORTED:$Algorithm"
    }
    $target = if ($LiteralPath) { $LiteralPath } else { $Path }
    if (-not $target) { throw "LOCAL_AI_PREINSTALL_HASH_PATH_MISSING" }
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

function Write-PreinstallProgress(
  [string]$Phase,
  [string]$Label,
  [int64]$BytesDownloaded,
  $BytesTotal,
  $Percent
) {
  $payload = [ordered]@{
    phase = $Phase
    label = $Label
    bytesDownloaded = $BytesDownloaded
    bytesTotal = if ($null -eq $BytesTotal) { $null } else { [int64]$BytesTotal }
    percent = if ($null -eq $Percent) { $null } else { [int]$Percent }
  }
  Write-Host ("LEX_LOCAL_AI_PREINSTALL_PROGRESS:" + ($payload | ConvertTo-Json -Compress))
}

function Get-VerifiedDownload(
  [string]$Url,
  [string]$ExpectedSha256,
  [string]$Destination,
  [string]$Label
) {
  if ($Url -notmatch '^https://') {
    throw "LOCAL_AI_PREINSTALL_URL_INVALID:$Label"
  }
  if ($ExpectedSha256 -notmatch '^[a-fA-F0-9]{64}$') {
    throw "LOCAL_AI_PREINSTALL_HASH_INVALID:$Label"
  }

  $expected = $ExpectedSha256.ToLowerInvariant()
  if (Test-Path -LiteralPath $Destination -PathType Leaf) {
    $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $Destination).Hash.ToLowerInvariant()
    if ($actual -eq $expected) {
      $bytes = (Get-Item -LiteralPath $Destination).Length
      Write-PreinstallProgress "CACHE_HIT" $Label $bytes $bytes 100
      return
    }
    Remove-Item -LiteralPath $Destination -Force
  }

  $partial = $Destination + ".part"
  Remove-Item -LiteralPath $partial -Force -ErrorAction SilentlyContinue

  Add-Type -AssemblyName System.Net.Http
  $client = [System.Net.Http.HttpClient]::new()
  try {
    $response = $client.GetAsync(
      $Url,
      [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead
    ).GetAwaiter().GetResult()
    try {
      $response.EnsureSuccessStatusCode()
      $total = $response.Content.Headers.ContentLength
      $input = $response.Content.ReadAsStreamAsync().GetAwaiter().GetResult()
      try {
        $output = [IO.File]::Open(
          $partial,
          [IO.FileMode]::CreateNew,
          [IO.FileAccess]::Write,
          [IO.FileShare]::None
        )
        try {
          $buffer = New-Object byte[] (1024 * 1024)
          [int64]$downloaded = 0
          [int]$lastPercent = -1
          Write-PreinstallProgress "DOWNLOAD" $Label 0 $total $(if ($total) { 0 } else { $null })

          while (($read = $input.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $output.Write($buffer, 0, $read)
            $downloaded += $read
            if ($null -ne $total -and $total -gt 0) {
              $percent = [Math]::Min(
                100,
                [Math]::Floor(($downloaded * 100.0) / $total)
              )
              if ($percent -gt $lastPercent) {
                $lastPercent = [int]$percent
                Write-PreinstallProgress "DOWNLOAD" $Label $downloaded $total $lastPercent
              }
            }
          }
          $output.Flush()
        } finally {
          $output.Dispose()
        }
      } finally {
        $input.Dispose()
      }
    } finally {
      $response.Dispose()
    }
  } finally {
    $client.Dispose()
  }

  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $partial).Hash.ToLowerInvariant()
  if ($actual -ne $expected) {
    Remove-Item -LiteralPath $partial -Force -ErrorAction SilentlyContinue
    throw "LOCAL_AI_PREINSTALL_HASH_MISMATCH:$Label expected=$expected actual=$actual"
  }
  Move-Item -LiteralPath $partial -Destination $Destination -Force
  $bytes = (Get-Item -LiteralPath $Destination).Length
  Write-PreinstallProgress "VERIFIED" $Label $bytes $bytes 100
}

$models = @($manifest.models.localLlm)
if ($models.Count -lt 2) {
  throw "LOCAL_AI_PREINSTALL_MODELS_MISSING"
}
$backends = @($manifest.runtime.llamaCpp.backends)
if ($backends.Count -lt 1) {
  throw "LOCAL_AI_PREINSTALL_BACKENDS_MISSING"
}

$installedModels = @()
foreach ($model in $models) {
  if (
    -not $model.id -or
    -not $model.filename -or
    -not $model.url -or
    [string]$model.sha256 -notmatch '^[a-fA-F0-9]{64}$' -or
    [IO.Path]::GetFileName([string]$model.filename) -ne [string]$model.filename
  ) {
    throw "LOCAL_AI_PREINSTALL_MODEL_MANIFEST_INVALID"
  }

  $target = Join-Path $modelDir ([string]$model.filename)
  Get-VerifiedDownload ([string]$model.url) ([string]$model.sha256) $target ("model:" + [string]$model.id)
  $installedModels += [ordered]@{
    id = [string]$model.id
    filename = [string]$model.filename
    sha256 = ([string]$model.sha256).ToLowerInvariant()
    bytes = (Get-Item -LiteralPath $target).Length
  }
}

$cachedBackends = @()
foreach ($backend in $backends) {
  $backendId = [string]$backend.id
  if (
    $backendId -notmatch '^[A-Z0-9_]{3,64}$' -or
    -not $backend.url -or
    [string]$backend.sha256 -notmatch '^[a-fA-F0-9]{64}$'
  ) {
    throw "LOCAL_AI_PREINSTALL_BACKEND_MANIFEST_INVALID:$backendId"
  }

  $target = Join-Path $cache (
    "llama-" +
    [string]$manifest.runtime.llamaCpp.version +
    "-" +
    $backendId.ToLowerInvariant() +
    ".zip"
  )
  Get-VerifiedDownload ([string]$backend.url) ([string]$backend.sha256) $target ("llama.cpp:" + $backendId)
  $cachedBackends += [ordered]@{
    id = $backendId
    sha256 = ([string]$backend.sha256).ToLowerInvariant()
    bytes = (Get-Item -LiteralPath $target).Length
    cachePath = $target
  }
}

$receipt = [ordered]@{
  schemaVersion = 1
  kind = "LEX_MACHINA_LOCAL_AI_PREINSTALL"
  applicationVersion = [string]$manifest.applicationVersion
  installedAt = (Get-Date).ToUniversalTime().ToString("o")
  activation = "USER_SELECTS_MODEL_AFTER_INSTALL"
  configCreated = $false
  models = $installedModels
  backends = $cachedBackends
}
$receiptPath = Join-Path $localRoot "preinstall.json"
$tempReceipt = $receiptPath + ".tmp"
[IO.File]::WriteAllText(
  $tempReceipt,
  (($receipt | ConvertTo-Json -Depth 8) + [Environment]::NewLine),
  [Text.UTF8Encoding]::new($false)
)
Move-Item -LiteralPath $tempReceipt -Destination $receiptPath -Force

if (Test-Path -LiteralPath (Join-Path $localRoot "config.json") -PathType Leaf) {
  Write-Host "Existing Local AI configuration preserved."
}

Write-Host "LEX_LOCAL_AI_PREINSTALL_PASS:$localRoot"
Write-Output ($receipt | ConvertTo-Json -Depth 8 -Compress)
