param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot
)

$ErrorActionPreference = "Stop"
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$manifestPath = Join-Path $runtime "release-source.json"
$requirements = Join-Path $runtime "release-requirements.txt"
$bootstrapRoot = Join-Path $runtime "bootstrap"
$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$cache = Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache"
New-Item -ItemType Directory -Force -Path $cache | Out-Null

# NSIS invokes Windows PowerShell directly. On some clean-machine/CI hosts its
# inherited module path does not expose the built-in Get-FileHash cmdlet.
# Provide a SHA-256-compatible fallback so this bootstrap and the child
# component-lock/self-test scripts remain independent of module auto-loading.
if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
  function Get-FileHash {
    param(
      [string]$Path,
      [string]$LiteralPath,
      [string]$Algorithm = "SHA256"
    )
    if ($Algorithm.ToUpperInvariant() -ne "SHA256") {
      throw "BOOTSTRAP_HASH_ALGORITHM_UNSUPPORTED:$Algorithm"
    }
    $target = if ($LiteralPath) { $LiteralPath } else { $Path }
    if (-not $target) { throw "BOOTSTRAP_HASH_PATH_MISSING" }
    $stream = [IO.File]::OpenRead($target)
    try {
      $sha = [Security.Cryptography.SHA256]::Create()
      try {
        $bytes = $sha.ComputeHash($stream)
      } finally {
        $sha.Dispose()
      }
    } finally {
      $stream.Dispose()
    }
    [pscustomobject]@{
      Algorithm = "SHA256"
      Hash = ([BitConverter]::ToString($bytes) -replace '-','')
      Path = [IO.Path]::GetFullPath($target)
    }
  }
}

function Test-IsAdministrator {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = [Security.Principal.WindowsPrincipal]::new($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-VerifiedDownload(
  [string]$Url,
  [string]$ExpectedSha256,
  [string]$Destination,
  [string]$Label
) {
  if ($ExpectedSha256 -notmatch '^[a-fA-F0-9]{64}$') {
    throw "BOOTSTRAP_HASH_INVALID:$Label"
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
    throw "BOOTSTRAP_HASH_MISMATCH:$Label expected=$ExpectedSha256 actual=$actual"
  }
}

function Test-CommandVersion(
  [string]$Executable,
  [string[]]$Arguments,
  [string]$Expected
) {
  if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) { return $false }
  try {
    $value = (& $Executable @Arguments 2>&1 | Select-Object -First 1).ToString().Trim()
    return $value -eq $Expected
  } catch {
    return $false
  }
}

function Ensure-VisualCppRuntime {
  $vcInstalled = $false
  $vc = $manifest.systemPrerequisites.visualCppRuntime
  try {
    $installedFlag = Get-ItemPropertyValue -Path "HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" -Name Installed -ErrorAction Stop
    $installedVersionText = (Get-ItemPropertyValue -Path "HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" -Name Version -ErrorAction Stop).ToString().TrimStart("v")
    $vcInstalled = (
      $installedFlag -eq 1 -and
      ([Version]$installedVersionText) -ge ([Version]$vc.version)
    )
  } catch {
    $vcInstalled = $false
  }
  $forceAcceptanceVc = ($env:CI -eq "true" -and $env:LEX_INSTALLER_ACCEPTANCE_FORCE_VC_RUNTIME -eq "1")
  if (-not $vcInstalled -or $forceAcceptanceVc) {
    $bundledVc = Join-Path $runtime "prerequisites\vc_redist.x64.exe"
    if (Test-Path -LiteralPath $bundledVc -PathType Leaf) {
      $bundledHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $bundledVc).Hash.ToLowerInvariant()
      if ($bundledHash -ne $vc.sha256.ToLowerInvariant()) {
        throw "BOOTSTRAP_HASH_MISMATCH:visual-cpp-runtime-bundled expected=$($vc.sha256) actual=$bundledHash"
      }
      Write-Host "Using verified bundled visual-cpp-runtime"
      $vcInstaller = $bundledVc
    } else {
      $vcInstaller = Join-Path $cache "vc_redist.x64-$($vc.version).exe"
      Get-VerifiedDownload $vc.url $vc.sha256 $vcInstaller "visual-cpp-runtime"
    }
    $startArgs = @{
      FilePath = $vcInstaller
      ArgumentList = @("/install", "/quiet", "/norestart")
      Wait = $true
      PassThru = $true
    }
    if (-not (Test-IsAdministrator)) {
      $startArgs.Verb = "RunAs"
    }
    $vcInstall = Start-Process @startArgs
    if ($vcInstall.ExitCode -notin @(0, 1638, 3010)) {
      throw "BOOTSTRAP_VC_RUNTIME_FAILED:$($vcInstall.ExitCode)"
    }
  }
}

Write-Host "[1/6] Private Node"
$nodeDir = Join-Path $runtime "node"
$nodeExe = Join-Path $nodeDir "node.exe"
$nodeExpected = "v$($manifest.runtime.node.version)"
if (-not (Test-CommandVersion $nodeExe @("--version") $nodeExpected)) {
  Remove-Item $nodeDir -Recurse -Force -ErrorAction SilentlyContinue
  $nodeZip = Join-Path $cache "node-$($manifest.runtime.node.version)-win-x64.zip"
  Get-VerifiedDownload $manifest.runtime.node.url $manifest.runtime.node.sha256 $nodeZip "node-runtime"
  $extract = Join-Path $cache "node-extract-$($manifest.runtime.node.version)"
  Remove-Item $extract -Recurse -Force -ErrorAction SilentlyContinue
  Expand-Archive -LiteralPath $nodeZip -DestinationPath $extract -Force
  $source = Get-ChildItem $extract -Directory | Select-Object -First 1
  if (-not $source) { throw "BOOTSTRAP_NODE_ARCHIVE_LAYOUT_INVALID" }
  New-Item -ItemType Directory -Force -Path $nodeDir | Out-Null
  Copy-Item (Join-Path $source.FullName "*") $nodeDir -Recurse -Force
}
if (-not (Test-CommandVersion $nodeExe @("--version") $nodeExpected)) {
  throw "BOOTSTRAP_NODE_VERSION_INVALID"
}

Write-Host "[2/6] System prerequisites"
Ensure-VisualCppRuntime

Write-Host "[3/6] Private Python"
$pythonDir = Join-Path $runtime "python"
$pythonExe = Join-Path $pythonDir "python.exe"
$pythonExpected = "Python $($manifest.runtime.python.version)"
if (-not (Test-CommandVersion $pythonExe @("--version") $pythonExpected)) {
  Remove-Item $pythonDir -Recurse -Force -ErrorAction SilentlyContinue
  $pythonInstaller = Join-Path $cache "python-$($manifest.runtime.python.version)-amd64.exe"
  Get-VerifiedDownload $manifest.runtime.python.url $manifest.runtime.python.sha256 $pythonInstaller "python-runtime"
  $args = @(
    "/quiet", "InstallAllUsers=0", "TargetDir=`"$pythonDir`"", "Include_launcher=0",
    "Include_test=0", "Include_doc=0", "Include_tcltk=0", "Include_tools=0",
    "Include_pip=1", "PrependPath=0", "Shortcuts=0"
  )
  $install = Start-Process -FilePath $pythonInstaller -ArgumentList $args -Wait -PassThru
  if ($install.ExitCode -ne 0) {
    throw "BOOTSTRAP_PYTHON_INSTALL_FAILED:$($install.ExitCode)"
  }
}
if (-not (Test-CommandVersion $pythonExe @("--version") $pythonExpected)) {
  $pythonVersionActual = if (Test-Path -LiteralPath $pythonExe -PathType Leaf) {
    try {
      (& $pythonExe --version 2>&1 | Select-Object -First 1).ToString().Trim()
    } catch {
      "EXECUTION_FAILED:$($_.Exception.Message)"
    }
  } else {
    "MISSING:$pythonExe"
  }
  throw "BOOTSTRAP_PYTHON_VERSION_INVALID expected=$pythonExpected actual=$pythonVersionActual"
}

Write-Host "[4/6] Pinned Python/ML packages"
$packageVerifier = Join-Path $bootstrapRoot "verify-python-package-set.py"
if (-not (Test-Path -LiteralPath $packageVerifier -PathType Leaf)) {
  throw "BOOTSTRAP_PYTHON_PACKAGE_VERIFIER_MISSING"
}
& $pythonExe $packageVerifier $manifestPath | Out-Host
if ($LASTEXITCODE -ne 0) {
  & $pythonExe -m pip install --quiet --disable-pip-version-check --no-warn-script-location --upgrade-strategy only-if-needed -r $requirements
  if ($LASTEXITCODE -ne 0) { throw "BOOTSTRAP_PYTHON_PACKAGES_FAILED" }
  & $pythonExe $packageVerifier $manifestPath | Out-Host
  if ($LASTEXITCODE -ne 0) { throw "BOOTSTRAP_PYTHON_PACKAGE_VERSION_MISMATCH" }
}
& $pythonExe -m pip freeze --all | Sort-Object |
  Out-File -FilePath (Join-Path $runtime "python-dependency-tree.txt") -Encoding utf8
if ($LASTEXITCODE -ne 0) { throw "BOOTSTRAP_PYTHON_PROVENANCE_FAILED" }

Write-Host "[5/6] OCR/NER models"
$modelRoot = Join-Path $runtime "models"
$paddleOfficial = Join-Path $modelRoot "paddle\official_models"
$stanzaPl = Join-Path $modelRoot "stanza\pl"
$requiredPaddle = @(
  "PP-LCNet_x1_0_doc_ori",
  "UVDoc",
  "PP-LCNet_x1_0_textline_ori",
  "PP-OCRv6_medium_det",
  "PP-OCRv6_medium_rec"
)
$modelsReady = (Test-Path -LiteralPath $stanzaPl -PathType Container)
foreach ($name in $requiredPaddle) {
  if (-not (Test-Path -LiteralPath (Join-Path $paddleOfficial $name) -PathType Container)) {
    $modelsReady = $false
  }
}
if (-not $modelsReady) {
  New-Item -ItemType Directory -Force -Path $modelRoot | Out-Null
  & $pythonExe (Join-Path $bootstrapRoot "prefetch-release-models.py") $modelRoot
  if ($LASTEXITCODE -ne 0) { throw "BOOTSTRAP_MODEL_PREFETCH_FAILED" }
}

Write-Host "[6/6] Integrity lock and offline acceptance"
& (Join-Path $bootstrapRoot "generate-component-lock.ps1") `
  -PayloadRoot $runtime `
  -Output (Join-Path $runtime "component-lock.json") `
  -NetworkRequiredAtInstall $true `
  -IncludeBundledVisualCppRuntime $false
if ($LASTEXITCODE -ne 0) { throw "BOOTSTRAP_COMPONENT_LOCK_FAILED" }

& (Join-Path $bootstrapRoot "windows-payload-selftest.ps1") -PayloadRoot $runtime
if ($LASTEXITCODE -ne 0) { throw "BOOTSTRAP_RUNTIME_SELFTEST_FAILED" }

Write-Host "LEX_ONLINE_BOOTSTRAP_PASS:LOCAL_AI_OPTIONAL"
