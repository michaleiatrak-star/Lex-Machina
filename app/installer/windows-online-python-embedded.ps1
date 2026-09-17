param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot
)

$ErrorActionPreference = "Stop"
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$manifestPath = Join-Path $runtime "release-source.json"
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  throw "ONLINE_EMBEDDED_PYTHON_MANIFEST_MISSING:$manifestPath"
}
$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$pythonSource = $manifest.runtime.python.onlineEmbeddable
$pipSource = $manifest.runtime.python.pipBootstrap
if (-not $pythonSource -or -not $pipSource) {
  throw "ONLINE_EMBEDDED_PYTHON_SOURCE_MANIFEST_INVALID"
}

if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
  function Get-FileHash {
    param(
      [string]$Path,
      [string]$LiteralPath,
      [string]$Algorithm = "SHA256"
    )
    if ($Algorithm.ToUpperInvariant() -ne "SHA256") {
      throw "ONLINE_EMBEDDED_PYTHON_HASH_ALGORITHM_UNSUPPORTED:$Algorithm"
    }
    $target = if ($LiteralPath) { $LiteralPath } else { $Path }
    if (-not $target) { throw "ONLINE_EMBEDDED_PYTHON_HASH_PATH_MISSING" }
    $stream = [IO.File]::OpenRead($target)
    try {
      $sha = [Security.Cryptography.SHA256]::Create()
      try { $bytes = $sha.ComputeHash($stream) } finally { $sha.Dispose() }
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
  if (-not $Url -or $ExpectedSha256 -notmatch '^[a-fA-F0-9]{64}$') {
    throw "ONLINE_EMBEDDED_PYTHON_SOURCE_INVALID:$Label"
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
    throw "ONLINE_EMBEDDED_PYTHON_HASH_MISMATCH:$Label expected=$ExpectedSha256 actual=$actual"
  }
}

function Test-PrivatePython([string]$Executable, [string]$ExpectedVersion, [string]$ExpectedPipVersion) {
  if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) { return $false }
  $oldPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $pythonVersion = @(& $Executable --version 2>&1 | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ }) | Select-Object -First 1
    $pythonExit = $LASTEXITCODE
    if ($pythonExit -ne 0 -or $pythonVersion -ne "Python $ExpectedVersion") { return $false }
    $pipVersionLine = @(& $Executable -m pip --version 2>&1 | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ }) | Select-Object -First 1
    $pipExit = $LASTEXITCODE
    if ($pipExit -ne 0 -or $pipVersionLine -notmatch ('^pip\s+' + [regex]::Escape($ExpectedPipVersion) + '\s+')) { return $false }
    return $true
  } catch {
    return $false
  } finally {
    $ErrorActionPreference = $oldPreference
  }
}

function Write-PrivatePythonDiagnostics([string]$Executable) {
  if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) {
    Write-Host "EMBEDDED_PYTHON_DIAG executable=missing"
    return
  }
  $oldPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $versionOutput = @(& $Executable --version 2>&1 | ForEach-Object { $_.ToString() }) -join " | "
    $versionExit = $LASTEXITCODE
    $pipOutput = @(& $Executable -m pip --version 2>&1 | ForEach-Object { $_.ToString() }) -join " | "
    $pipExit = $LASTEXITCODE
    $pathOutput = @(& $Executable -c "import sys; print(repr(sys.path))" 2>&1 | ForEach-Object { $_.ToString() }) -join " | "
    $pathExit = $LASTEXITCODE
    Write-Host "EMBEDDED_PYTHON_DIAG versionExit=$versionExit version=$versionOutput"
    Write-Host "EMBEDDED_PYTHON_DIAG pipExit=$pipExit pip=$pipOutput"
    Write-Host "EMBEDDED_PYTHON_DIAG pathExit=$pathExit path=$pathOutput"
  } finally {
    $ErrorActionPreference = $oldPreference
  }
}

$pythonDir = Join-Path $runtime "python"
$pythonExe = Join-Path $pythonDir "python.exe"
$pythonVersion = $manifest.runtime.python.version.ToString()
$pipVersion = $pipSource.version.ToString()
if (Test-PrivatePython $pythonExe $pythonVersion $pipVersion) {
  Write-Host "LEX_ONLINE_EMBEDDED_PYTHON_REUSE_PASS:$pythonExe"
  return
}

$cache = Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache"
New-Item -ItemType Directory -Force -Path $cache | Out-Null
$pythonZip = Join-Path $cache "python-$pythonVersion-embed-amd64.zip"
$pipWheel = Join-Path $cache "pip-$pipVersion-py3-none-any.whl"
Get-VerifiedDownload $pythonSource.url $pythonSource.sha256 $pythonZip "python-embeddable-runtime"
Get-VerifiedDownload $pipSource.url $pipSource.sha256 $pipWheel "pip-bootstrap-wheel"

Remove-Item -LiteralPath $pythonDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $pythonDir | Out-Null
Expand-Archive -LiteralPath $pythonZip -DestinationPath $pythonDir -Force
if (-not (Test-Path -LiteralPath $pythonExe -PathType Leaf)) {
  throw "ONLINE_EMBEDDED_PYTHON_EXECUTABLE_MISSING:$pythonExe"
}

$pth = Get-ChildItem -LiteralPath $pythonDir -File -Filter "python*._pth" | Select-Object -First 1
if (-not $pth) {
  throw "ONLINE_EMBEDDED_PYTHON_PTH_MISSING"
}
$existingPth = @(Get-Content -LiteralPath $pth.FullName)
$pathLines = [Collections.Generic.List[string]]::new()
foreach ($line in $existingPth) {
  $trimmed = $line.Trim()
  if (-not $trimmed -or $trimmed.StartsWith("#") -or $trimmed -eq "import site") { continue }
  if (-not $pathLines.Contains($trimmed)) { $pathLines.Add($trimmed) }
}
if (-not $pathLines.Contains("Lib\site-packages")) { $pathLines.Add("Lib\site-packages") }
$pathLines.Add("import site")
[IO.File]::WriteAllLines($pth.FullName, $pathLines, [Text.UTF8Encoding]::new($false))

$sitePackages = Join-Path $pythonDir "Lib\site-packages"
New-Item -ItemType Directory -Force -Path $sitePackages | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::ExtractToDirectory($pipWheel, $sitePackages)
$pipInit = Join-Path $sitePackages "pip\__init__.py"
if (-not (Test-Path -LiteralPath $pipInit -PathType Leaf)) {
  throw "ONLINE_EMBEDDED_PIP_PACKAGE_MISSING:$pipInit"
}

if (-not (Test-PrivatePython $pythonExe $pythonVersion $pipVersion)) {
  Write-PrivatePythonDiagnostics $pythonExe
  throw "ONLINE_EMBEDDED_PYTHON_VALIDATION_FAILED"
}

$oldPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
try {
  $isolation = @(& $pythonExe -c "import site,sys; assert sys.flags.isolated == 1; assert site.ENABLE_USER_SITE is False; print('PYTHON_ISOLATION_PASS')" 2>&1 | ForEach-Object { $_.ToString().Trim() })
  $isolationExit = $LASTEXITCODE
} finally {
  $ErrorActionPreference = $oldPreference
}
if ($isolationExit -ne 0 -or $isolation -notcontains "PYTHON_ISOLATION_PASS") {
  Write-PrivatePythonDiagnostics $pythonExe
  throw "ONLINE_EMBEDDED_PYTHON_ISOLATION_FAILED"
}

Write-Host "LEX_ONLINE_EMBEDDED_PYTHON_PASS:$pythonExe"
