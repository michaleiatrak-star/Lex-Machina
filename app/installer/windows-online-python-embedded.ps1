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
    param([string]$Path,[string]$LiteralPath,[string]$Algorithm = "SHA256")
    if ($Algorithm.ToUpperInvariant() -ne "SHA256") { throw "ONLINE_EMBEDDED_PYTHON_HASH_ALGORITHM_UNSUPPORTED:$Algorithm" }
    $target = if ($LiteralPath) { $LiteralPath } else { $Path }
    if (-not $target) { throw "ONLINE_EMBEDDED_PYTHON_HASH_PATH_MISSING" }
    $stream = [IO.File]::OpenRead($target)
    try {
      $sha = [Security.Cryptography.SHA256]::Create()
      try { $bytes = $sha.ComputeHash($stream) } finally { $sha.Dispose() }
    } finally { $stream.Dispose() }
    [pscustomobject]@{ Algorithm="SHA256"; Hash=([BitConverter]::ToString($bytes) -replace '-',''); Path=[IO.Path]::GetFullPath($target) }
  }
}

function Get-VerifiedDownload([string]$Url,[string]$ExpectedSha256,[string]$Destination,[string]$Label) {
  if (-not $Url -or $ExpectedSha256 -notmatch '^[a-fA-F0-9]{64}$') { throw "ONLINE_EMBEDDED_PYTHON_SOURCE_INVALID:$Label" }
  if (Test-Path -LiteralPath $Destination -PathType Leaf) {
    $cached = (Get-FileHash -Algorithm SHA256 -LiteralPath $Destination).Hash.ToLowerInvariant()
    if ($cached -eq $ExpectedSha256.ToLowerInvariant()) { Write-Host "Using verified cache for $Label"; return }
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

function Invoke-PythonLines([string]$Executable,[string[]]$Arguments) {
  $oldPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $lines = @(& $Executable -X utf8 @Arguments 2>&1 | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ })
    [pscustomobject]@{ ExitCode=$LASTEXITCODE; Lines=$lines }
  } finally {
    $ErrorActionPreference = $oldPreference
  }
}

function Get-PipMetadataVersion([string]$Executable) {
  try {
    $result = Invoke-PythonLines $Executable @("-c", "import importlib.metadata; print(importlib.metadata.version('pip'))")
    if ($result.ExitCode -ne 0 -or $result.Lines.Count -ne 1) { return $null }
    return $result.Lines[0]
  } catch { return $null }
}

function Test-PrivatePython([string]$Executable,[string]$ExpectedVersion,[string]$ExpectedPipVersion) {
  if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) { return $false }
  try {
    $version = Invoke-PythonLines $Executable @("--version")
    if ($version.ExitCode -ne 0 -or $version.Lines.Count -lt 1 -or $version.Lines[0] -ne "Python $ExpectedVersion") { return $false }
    return (Get-PipMetadataVersion $Executable) -eq $ExpectedPipVersion
  } catch { return $false }
}

function Write-PrivatePythonDiagnostics([string]$Executable) {
  if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) { Write-Host "EMBEDDED_PYTHON_DIAG executable=missing"; return }
  $version = Invoke-PythonLines $Executable @("--version")
  $pipVersionValue = Get-PipMetadataVersion $Executable
  $path = Invoke-PythonLines $Executable @("-c", "import sys; print(repr(sys.path))")
  Write-Host "EMBEDDED_PYTHON_DIAG versionExit=$($version.ExitCode) version=$($version.Lines -join ' | ')"
  Write-Host "EMBEDDED_PYTHON_DIAG pipMetadataVersion=$pipVersionValue"
  Write-Host "EMBEDDED_PYTHON_DIAG pathExit=$($path.ExitCode) path=$($path.Lines -join ' | ')"
}

$pythonDir = Join-Path $runtime "python"
$pythonExe = Join-Path $pythonDir "python.exe"
$pythonVersion = $manifest.runtime.python.version.ToString()
$pipVersion = $pipSource.version.ToString()
if (Test-PrivatePython $pythonExe $pythonVersion $pipVersion) { Write-Host "LEX_ONLINE_EMBEDDED_PYTHON_REUSE_PASS:$pythonExe"; return }

$cache = Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache"
New-Item -ItemType Directory -Force -Path $cache | Out-Null
$pythonZip = Join-Path $cache "python-$pythonVersion-embed-amd64.zip"
$pipWheel = Join-Path $cache "pip-$pipVersion-py3-none-any.whl"
Get-VerifiedDownload $pythonSource.url $pythonSource.sha256 $pythonZip "python-embeddable-runtime"
Get-VerifiedDownload $pipSource.url $pipSource.sha256 $pipWheel "pip-bootstrap-wheel"

Remove-Item -LiteralPath $pythonDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $pythonDir | Out-Null
Expand-Archive -LiteralPath $pythonZip -DestinationPath $pythonDir -Force
if (-not (Test-Path -LiteralPath $pythonExe -PathType Leaf)) { throw "ONLINE_EMBEDDED_PYTHON_EXECUTABLE_MISSING:$pythonExe" }

$pth = Get-ChildItem -LiteralPath $pythonDir -File -Filter "python*._pth" | Select-Object -First 1
if (-not $pth) { throw "ONLINE_EMBEDDED_PYTHON_PTH_MISSING" }
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
if (-not (Test-Path -LiteralPath $pipInit -PathType Leaf)) { throw "ONLINE_EMBEDDED_PIP_PACKAGE_MISSING:$pipInit" }

if (-not (Test-PrivatePython $pythonExe $pythonVersion $pipVersion)) {
  Write-PrivatePythonDiagnostics $pythonExe
  throw "ONLINE_EMBEDDED_PYTHON_VALIDATION_FAILED"
}

$isolation = Invoke-PythonLines $pythonExe @("-c", "import site,sys; u=site.getusersitepackages(); assert sys.flags.isolated == 1; assert u not in sys.path; print('PYTHON_ISOLATION_PASS')")
if ($isolation.ExitCode -ne 0 -or $isolation.Lines -notcontains "PYTHON_ISOLATION_PASS") {
  Write-PrivatePythonDiagnostics $pythonExe
  throw "ONLINE_EMBEDDED_PYTHON_ISOLATION_FAILED"
}

Write-Host "LEX_ONLINE_EMBEDDED_PYTHON_PASS:$pythonExe"
