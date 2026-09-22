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

function Get-CommandVersionText(
  [string]$Executable,
  [string[]]$Arguments
) {
  if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) { return $null }
  try {
    $line = & $Executable @Arguments 2>&1 | Select-Object -First 1
    if ($null -eq $line) { return $null }
    return $line.ToString().Trim()
  } catch {
    return $null
  }
}

function Test-CommandVersion(
  [string]$Executable,
  [string[]]$Arguments,
  [string]$Expected
) {
  $value = Get-CommandVersionText $Executable $Arguments
  return ($null -ne $value -and $value -eq $Expected)
}

function Invoke-RedirectedNativeProcess(
  [string]$Executable,
  [string]$ArgumentLine,
  [string]$LogBase
) {
  $stdoutPath = "$LogBase.stdout.log"
  $stderrPath = "$LogBase.stderr.log"
  $logParent = Split-Path -Parent $LogBase
  if ($logParent) {
    New-Item -ItemType Directory -Force -Path $logParent | Out-Null
  }
  Remove-Item -LiteralPath $stdoutPath -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $stderrPath -Force -ErrorAction SilentlyContinue

  $process = Start-Process -FilePath $Executable `
    -ArgumentList $ArgumentLine `
    -Wait `
    -PassThru `
    -NoNewWindow `
    -RedirectStandardOutput $stdoutPath `
    -RedirectStandardError $stderrPath

  [pscustomobject]@{
    ExitCode = $process.ExitCode
    StdoutPath = $stdoutPath
    StderrPath = $stderrPath
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
if (-not $vcInstalled) {
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

Write-Host "[3/6] Private Python"
$pythonDir = Join-Path $runtime "python"
$pythonExe = Join-Path $pythonDir "python.exe"
$pythonExpected = "Python $($manifest.runtime.python.version)"
$pythonDelivery = $manifest.runtime.python.delivery
if (-not $pythonDelivery) {
  throw "BOOTSTRAP_PYTHON_DELIVERY_MISSING"
}
if (-not (Test-CommandVersion $pythonExe @("--version") $pythonExpected)) {
  Remove-Item $pythonDir -Recurse -Force -ErrorAction SilentlyContinue

  # The registered CPython full installer cannot safely provide an app-private
  # runtime when the same Python version is already registered on the machine.
  # In maintenance mode it may return exit code 0 while retaining the previous
  # install directory. Use CPython's official embeddable distribution instead:
  # it is application-local, registry-independent and can coexist with any
  # system/user Python installation.
  if ($pythonDelivery -ne "EMBEDDABLE_APP_LOCAL") {
    throw "BOOTSTRAP_PYTHON_DELIVERY_UNSUPPORTED:$pythonDelivery"
  }

  $embedded = $manifest.runtime.python.embeddable
  if (-not $embedded -or -not $embedded.url -or -not $embedded.sha256) {
    throw "BOOTSTRAP_PYTHON_EMBEDDED_MANIFEST_INVALID"
  }
  $pythonZip = Join-Path $cache "python-$($manifest.runtime.python.version)-embeddable-amd64.zip"
  Get-VerifiedDownload $embedded.url $embedded.sha256 $pythonZip "python-embeddable-runtime"

  New-Item -ItemType Directory -Force -Path $pythonDir | Out-Null
  Expand-Archive -LiteralPath $pythonZip -DestinationPath $pythonDir -Force

  $pth = Get-ChildItem -LiteralPath $pythonDir -Filter "python*._pth" -File |
    Select-Object -First 1
  if (-not $pth) {
    throw "BOOTSTRAP_PYTHON_EMBEDDED_PTH_MISSING"
  }

  # The embeddable distribution intentionally disables site by default.
  # Enable only the private site-packages directory used by Lex Machina.
  $pipWheelEntry = "pip-bootstrap.whl"
  $newPth = @()
  $hasSitePackages = $false
  $hasPipWheelEntry = $false
  $hasImportSite = $false
  foreach ($line in @(Get-Content -LiteralPath $pth.FullName)) {
    $trimmed = $line.Trim()
    if ($trimmed -eq "Lib\site-packages") {
      $hasSitePackages = $true
    }
    if ($trimmed -eq $pipWheelEntry) {
      $hasPipWheelEntry = $true
    }
    if ($trimmed -eq "#import site" -or $trimmed -eq "import site") {
      if (-not $hasSitePackages) {
        $newPth += "Lib\site-packages"
        $hasSitePackages = $true
      }
      if (-not $hasPipWheelEntry) {
        $newPth += $pipWheelEntry
        $hasPipWheelEntry = $true
      }
      $newPth += "import site"
      $hasImportSite = $true
      continue
    }
    $newPth += $line
  }
  if (-not $hasSitePackages) {
    $newPth += "Lib\site-packages"
  }
  if (-not $hasPipWheelEntry) {
    $newPth += $pipWheelEntry
  }
  if (-not $hasImportSite) {
    $newPth += "import site"
  }
  [IO.File]::WriteAllLines($pth.FullName, [string[]]$newPth, [Text.Encoding]::ASCII)

  $sitePackages = Join-Path $pythonDir "Lib\site-packages"
  New-Item -ItemType Directory -Force -Path $sitePackages | Out-Null

  # Bootstrap a pinned pip wheel without invoking any globally installed Python.
  # CPython's embeddable distribution runs in isolated ._pth mode. Rather than
  # relying on site-package discovery, place the verified wheel directly on the
  # explicit ._pth search path. zipimport can load pip from the wheel itself,
  # while packages installed by pip continue to land in private Lib\site-packages.
  $pipBootstrap = $manifest.runtime.python.pipBootstrap
  if (-not $pipBootstrap -or -not $pipBootstrap.url -or
      -not $pipBootstrap.sha256 -or -not $pipBootstrap.version) {
    throw "BOOTSTRAP_PIP_MANIFEST_INVALID"
  }
  $pipWheel = Join-Path $cache "pip-$($pipBootstrap.version)-py3-none-any.whl"
  Get-VerifiedDownload $pipBootstrap.url $pipBootstrap.sha256 $pipWheel "pip-bootstrap-wheel"

  $privatePipWheel = Join-Path $pythonDir $pipWheelEntry
  Copy-Item -LiteralPath $pipWheel -Destination $privatePipWheel -Force
}

$pythonActual = Get-CommandVersionText $pythonExe @("--version")
if ($pythonActual -ne $pythonExpected) {
  $pythonActualDisplay = if ($null -eq $pythonActual) { "<missing-or-unreadable>" } else { $pythonActual }
  throw "BOOTSTRAP_PYTHON_VERSION_INVALID expected=$pythonExpected actual=$pythonActualDisplay executable=$pythonExe"
}

$pipLogs = Join-Path $runtime "bootstrap-logs\pip-version"
$pipVersionProcess = Invoke-RedirectedNativeProcess `
  -Executable $pythonExe `
  -ArgumentLine "-X utf8 -m pip --version" `
  -LogBase $pipLogs
$pipVersionOutput = @()
if (Test-Path -LiteralPath $pipVersionProcess.StdoutPath -PathType Leaf) {
  $pipVersionOutput += @(Get-Content -LiteralPath $pipVersionProcess.StdoutPath)
}
if (Test-Path -LiteralPath $pipVersionProcess.StderrPath -PathType Leaf) {
  $pipVersionOutput += @(Get-Content -LiteralPath $pipVersionProcess.StderrPath)
}
$pipActual = @(
  $pipVersionOutput |
    ForEach-Object { $_.ToString().Trim() } |
    Where-Object { $_ -like "pip *" } |
    Select-Object -First 1
)
$pipActual = if ($pipActual.Count -gt 0) { $pipActual[0] } else { $null }
$pipExpectedPrefix = "pip $($manifest.runtime.python.pipBootstrap.version) "
if ($pipVersionProcess.ExitCode -ne 0 -or $null -eq $pipActual -or
    -not $pipActual.StartsWith($pipExpectedPrefix, [StringComparison]::Ordinal)) {
  $pipActualDisplay = if ($null -eq $pipActual) {
    ($pipVersionOutput | ForEach-Object { $_.ToString().Trim() }) -join " | "
  } else {
    $pipActual
  }
  if ([string]::IsNullOrWhiteSpace($pipActualDisplay)) {
    $pipActualDisplay = "<missing-or-unreadable>"
  }
  throw "BOOTSTRAP_PIP_VERSION_INVALID expected=$($manifest.runtime.python.pipBootstrap.version) exit=$($pipVersionProcess.ExitCode) actual=$pipActualDisplay executable=$pythonExe"
}

Write-Host "[4/6] Pinned Python/ML packages"
$packageVerifier = Join-Path $bootstrapRoot "verify-python-package-set.py"
if (-not (Test-Path -LiteralPath $packageVerifier -PathType Leaf)) {
  throw "BOOTSTRAP_PYTHON_PACKAGE_VERIFIER_MISSING"
}
$verifierLogBase = Join-Path $runtime "bootstrap-logs\package-verifier"
$verifierArguments = ('-X utf8 "{0}" "{1}"' -f $packageVerifier, $manifestPath)
$verifyProcess = Invoke-RedirectedNativeProcess `
  -Executable $pythonExe `
  -ArgumentLine $verifierArguments `
  -LogBase $verifierLogBase
if (Test-Path -LiteralPath $verifyProcess.StdoutPath -PathType Leaf) {
  Get-Content -LiteralPath $verifyProcess.StdoutPath | Out-Host
}
if ($verifyProcess.ExitCode -ne 0) {
  $pipInstallLogBase = Join-Path $runtime "bootstrap-logs\pip-install"
  $pipInstallArguments = ('-X utf8 -m pip install --quiet --disable-pip-version-check --no-warn-script-location --upgrade-strategy only-if-needed -r "{0}"' -f $requirements)
  $pipInstallProcess = Invoke-RedirectedNativeProcess `
    -Executable $pythonExe `
    -ArgumentLine $pipInstallArguments `
    -LogBase $pipInstallLogBase

  if (Test-Path -LiteralPath $pipInstallProcess.StdoutPath -PathType Leaf) {
    Get-Content -LiteralPath $pipInstallProcess.StdoutPath | Out-Host
  }
  if (Test-Path -LiteralPath $pipInstallProcess.StderrPath -PathType Leaf) {
    Get-Content -LiteralPath $pipInstallProcess.StderrPath | Out-Host
  }
  if ($pipInstallProcess.ExitCode -ne 0) {
    throw "BOOTSTRAP_PYTHON_PACKAGES_FAILED:$($pipInstallProcess.ExitCode)"
  }

  $verifyProcess = Invoke-RedirectedNativeProcess `
    -Executable $pythonExe `
    -ArgumentLine $verifierArguments `
    -LogBase $verifierLogBase
  if (Test-Path -LiteralPath $verifyProcess.StdoutPath -PathType Leaf) {
    Get-Content -LiteralPath $verifyProcess.StdoutPath | Out-Host
  }
  if (Test-Path -LiteralPath $verifyProcess.StderrPath -PathType Leaf) {
    Get-Content -LiteralPath $verifyProcess.StderrPath | Out-Host
  }
  if ($verifyProcess.ExitCode -ne 0) {
    throw "BOOTSTRAP_PYTHON_PACKAGE_VERSION_MISMATCH:$($verifyProcess.ExitCode)"
  }
}

$pipFreezeLogBase = Join-Path $runtime "bootstrap-logs\pip-freeze"
$pipFreezeProcess = Invoke-RedirectedNativeProcess `
  -Executable $pythonExe `
  -ArgumentLine "-X utf8 -m pip freeze --all" `
  -LogBase $pipFreezeLogBase
if ($pipFreezeProcess.ExitCode -ne 0) {
  if (Test-Path -LiteralPath $pipFreezeProcess.StderrPath -PathType Leaf) {
    Get-Content -LiteralPath $pipFreezeProcess.StderrPath | Out-Host
  }
  throw "BOOTSTRAP_PYTHON_PROVENANCE_FAILED:$($pipFreezeProcess.ExitCode)"
}
$freezeLines = @()
if (Test-Path -LiteralPath $pipFreezeProcess.StdoutPath -PathType Leaf) {
  $freezeLines = @(Get-Content -LiteralPath $pipFreezeProcess.StdoutPath)
}
$freezeLines | Sort-Object |
  Out-File -FilePath (Join-Path $runtime "python-dependency-tree.txt") -Encoding utf8

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

  # PaddleX supports several official hosters. Prefer BOS because it serves
  # the official inference tarballs directly and avoids the HuggingFace API
  # response path that can intermittently return an empty JSON document on
  # clean Windows installs. Each fallback runs in a fresh Python process so
  # PaddleX re-reads PADDLE_PDX_MODEL_SOURCE. Failed partial model directories
  # are removed before the next source to avoid treating an incomplete cache
  # as a valid installed model.
  $modelSources = @("bos", "huggingface", "modelscope", "aistudio")
  $prefetchScript = Join-Path $bootstrapRoot "prefetch-release-models.py"
  if (-not (Test-Path -LiteralPath $prefetchScript -PathType Leaf)) {
    throw "BOOTSTRAP_MODEL_PREFETCH_SCRIPT_MISSING"
  }

  $previousModelSource = $env:PADDLE_PDX_MODEL_SOURCE
  $prefetchSucceeded = $false
  try {
    foreach ($source in $modelSources) {
      $env:PADDLE_PDX_MODEL_SOURCE = $source
      Write-Host "Model prefetch attempt via official source: $source"

      # Windows PowerShell 5.1 promotes native stderr records into the
      # PowerShell error stream. With ErrorActionPreference=Stop that would
      # terminate this bootstrap before the fallback loop can inspect the
      # native exit code. Redirect both streams and treat ExitCode as the
      # authoritative success/failure signal.
      $prefetchStdout = Join-Path $modelRoot ("prefetch-" + $source + ".stdout.log")
      $prefetchStderr = Join-Path $modelRoot ("prefetch-" + $source + ".stderr.log")
      Remove-Item -LiteralPath $prefetchStdout -Force -ErrorAction SilentlyContinue
      Remove-Item -LiteralPath $prefetchStderr -Force -ErrorAction SilentlyContinue

      $prefetchArguments = ('-X utf8 "{0}" "{1}"' -f $prefetchScript, $modelRoot)
      $prefetchProcess = Start-Process -FilePath $pythonExe `
        -ArgumentList $prefetchArguments `
        -Wait `
        -PassThru `
        -NoNewWindow `
        -RedirectStandardOutput $prefetchStdout `
        -RedirectStandardError $prefetchStderr

      if (Test-Path -LiteralPath $prefetchStdout -PathType Leaf) {
        Get-Content -LiteralPath $prefetchStdout | Out-Host
      }
      if (Test-Path -LiteralPath $prefetchStderr -PathType Leaf) {
        Get-Content -LiteralPath $prefetchStderr | Out-Host
      }

      $prefetchExit = $prefetchProcess.ExitCode
      if ($prefetchExit -eq 0) {
        $prefetchSucceeded = $true
        Write-Host "Model prefetch source accepted: $source"
        break
      }

      Write-Warning "Model prefetch source failed: $source exit=$prefetchExit"
      foreach ($name in $requiredPaddle) {
        $candidate = Join-Path $paddleOfficial $name
        Remove-Item -LiteralPath $candidate -Recurse -Force -ErrorAction SilentlyContinue
      }
      Start-Sleep -Seconds 2
    }
  } finally {
    if ($null -eq $previousModelSource) {
      Remove-Item Env:PADDLE_PDX_MODEL_SOURCE -ErrorAction SilentlyContinue
    } else {
      $env:PADDLE_PDX_MODEL_SOURCE = $previousModelSource
    }
  }

  if (-not $prefetchSucceeded) {
    throw "BOOTSTRAP_MODEL_PREFETCH_FAILED_ALL_OFFICIAL_SOURCES"
  }
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

$nativeWebConfigurator = Join-Path $bootstrapRoot "configure-llama-native-web.ps1"
if (-not (Test-Path -LiteralPath $nativeWebConfigurator -PathType Leaf)) {
  throw "BOOTSTRAP_LLAMA_NATIVE_WEB_CONFIGURATOR_MISSING"
}
& $nativeWebConfigurator -RuntimeRoot $runtime | Out-Host

Write-Host "LEX_ONLINE_BOOTSTRAP_PASS:LOCAL_AI_OPTIONAL"
