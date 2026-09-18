param(
  [Parameter(Mandatory=$true)][string]$ManifestPath,
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [string]$CacheRoot
)

$ErrorActionPreference = "Stop"
# Canonical rule: never install or register Python system-wide.
# Lex Machina owns an app-local, hash-pinned runtime under runtime\\python.
# This helper is the only supported private-Python provisioning path.
$manifestFile = (Resolve-Path -LiteralPath $ManifestPath).Path
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$manifest = Get-Content -Raw -LiteralPath $manifestFile | ConvertFrom-Json
$pythonSource = $manifest.runtime.python
if ($pythonSource.delivery -ne "APP_LOCAL_ZIP") {
  throw "PRIVATE_PYTHON_DELIVERY_POLICY_INVALID:$($pythonSource.delivery)"
}
if ($pythonSource.url -notmatch 'python-[0-9.]+-amd64\.zip$') {
  throw "PRIVATE_PYTHON_SOURCE_NOT_APP_LOCAL_ZIP:$($pythonSource.url)"
}
if ($pythonSource.sha256 -notmatch '^[a-fA-F0-9]{64}$') {
  throw "PRIVATE_PYTHON_SOURCE_HASH_INVALID"
}
if (-not $CacheRoot) {
  $CacheRoot = Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache"
}
$cache = [IO.Path]::GetFullPath($CacheRoot)
New-Item -ItemType Directory -Force -Path $cache | Out-Null

function Get-Sha256Hex([string]$Path) {
  $stream = [IO.File]::OpenRead($Path)
  try {
    $sha = [Security.Cryptography.SHA256]::Create()
    try {
      return ([BitConverter]::ToString($sha.ComputeHash($stream))).Replace("-", "").ToLowerInvariant()
    } finally {
      $sha.Dispose()
    }
  } finally {
    $stream.Dispose()
  }
}

$archive = Join-Path $cache ("python-" + $pythonSource.version + "-amd64.zip")
if (Test-Path -LiteralPath $archive -PathType Leaf) {
  $cachedHash = Get-Sha256Hex $archive
  if ($cachedHash -ne $pythonSource.sha256.ToLowerInvariant()) {
    Remove-Item -LiteralPath $archive -Force
  } else {
    Write-Host "Using verified cache for python-runtime-zip"
  }
}
if (-not (Test-Path -LiteralPath $archive -PathType Leaf)) {
  Write-Host "Downloading app-local Python $($pythonSource.version)"
  Invoke-WebRequest -UseBasicParsing -Uri $pythonSource.url -OutFile $archive
}
$actualHash = Get-Sha256Hex $archive
if ($actualHash -ne $pythonSource.sha256.ToLowerInvariant()) {
  Remove-Item -LiteralPath $archive -Force -ErrorAction SilentlyContinue
  throw "PRIVATE_PYTHON_SOURCE_HASH_MISMATCH expected=$($pythonSource.sha256) actual=$actualHash"
}

$pythonDir = Join-Path $runtime "python"
$pythonExe = Join-Path $pythonDir "python.exe"
$expectedVersion = "Python $($pythonSource.version)"
if (Test-Path -LiteralPath $pythonExe -PathType Leaf) {
  try {
    $existing = (& $pythonExe --version 2>&1 | Select-Object -First 1).ToString().Trim()
    if ($LASTEXITCODE -eq 0 -and $existing -eq $expectedVersion) {
      & $pythonExe -m pip --version | Out-Null
      if ($LASTEXITCODE -eq 0) {
        Write-Host "PRIVATE_PYTHON_READY:$pythonExe"
        Write-Host "PRIVATE_PYTHON_VERSION:$existing"
        return
      }
    }
  } catch {}
}

Remove-Item -LiteralPath $pythonDir -Recurse -Force -ErrorAction SilentlyContinue
$stage = Join-Path $cache ("python-stage-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $stage | Out-Null
try {
  Expand-Archive -LiteralPath $archive -DestinationPath $stage -Force
  $candidates = @(Get-ChildItem -LiteralPath $stage -Recurse -File -Filter "python.exe")
  if ($candidates.Count -ne 1) {
    throw "PRIVATE_PYTHON_ARCHIVE_LAYOUT_INVALID:candidates=$($candidates.Count)"
  }
  $sourceRoot = Split-Path -Parent $candidates[0].FullName
  New-Item -ItemType Directory -Force -Path $pythonDir | Out-Null
  Get-ChildItem -LiteralPath $sourceRoot -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $pythonDir -Recurse -Force
  }
} finally {
  Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
}

if (-not (Test-Path -LiteralPath $pythonExe -PathType Leaf)) {
  throw "PRIVATE_PYTHON_MISSING:$pythonExe"
}
$actualVersion = (& $pythonExe --version 2>&1 | Select-Object -First 1).ToString().Trim()
if ($LASTEXITCODE -ne 0 -or $actualVersion -ne $expectedVersion) {
  throw "PRIVATE_PYTHON_VERSION_INVALID expected=$expectedVersion actual=$actualVersion"
}
& $pythonExe -m pip --version | Out-Host
if ($LASTEXITCODE -ne 0) {
  throw "PRIVATE_PYTHON_PIP_MISSING"
}
Write-Host "PRIVATE_PYTHON_READY:$pythonExe"
Write-Host "PRIVATE_PYTHON_VERSION:$actualVersion"
