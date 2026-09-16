param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$BundlePath
)

$ErrorActionPreference = "Stop"
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$bundle = (Resolve-Path -LiteralPath $BundlePath).Path
$receiptPath = Join-Path $runtime "offline-runtime.json"

if (-not (Test-Path -LiteralPath $receiptPath -PathType Leaf)) {
  throw "OFFLINE_BUNDLE_RECEIPT_MISSING"
}
$receipt = Get-Content -Raw -LiteralPath $receiptPath | ConvertFrom-Json
if ($receipt.schemaVersion -ne 1) {
  throw "OFFLINE_BUNDLE_RECEIPT_SCHEMA_INVALID"
}
if ($receipt.bundleFile -ne (Split-Path -Leaf $bundle)) {
  throw "OFFLINE_BUNDLE_FILENAME_MISMATCH"
}
if ($receipt.sha256 -notmatch '^[a-fA-F0-9]{64}$') {
  throw "OFFLINE_BUNDLE_RECEIPT_HASH_INVALID"
}
if ([int64]$receipt.bytes -ne (Get-Item -LiteralPath $bundle).Length) {
  throw "OFFLINE_BUNDLE_SIZE_MISMATCH"
}

$actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $bundle).Hash.ToLowerInvariant()
if ($actualHash -ne $receipt.sha256.ToLowerInvariant()) {
  throw "OFFLINE_BUNDLE_HASH_MISMATCH:expected=$($receipt.sha256) actual=$actualHash"
}

$stage = Join-Path $env:TEMP ("LexMachinaOfflineRuntime-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $stage | Out-Null

try {
  Write-Host "Extracting verified offline runtime bundle"
  $tar = Get-Command tar.exe -ErrorAction SilentlyContinue
  if ($tar) {
    & $tar.Source -xf $bundle -C $stage
    if ($LASTEXITCODE -ne 0) {
      throw "OFFLINE_BUNDLE_EXTRACT_FAILED:$LASTEXITCODE"
    }
  } else {
    Expand-Archive -LiteralPath $bundle -DestinationPath $stage -Force
  }

  $lockPath = Join-Path $stage "component-lock.json"
  if (-not (Test-Path -LiteralPath $lockPath -PathType Leaf)) {
    throw "OFFLINE_BUNDLE_COMPONENT_LOCK_MISSING"
  }
  $lock = Get-Content -Raw -LiteralPath $lockPath | ConvertFrom-Json
  if ($lock.networkRequiredAtInstall -ne $false) {
    throw "OFFLINE_BUNDLE_NETWORK_POLICY_INVALID"
  }
  if ($lock.runtimeNetworkRequiredAfterBootstrap -ne $false) {
    throw "OFFLINE_BUNDLE_RUNTIME_NETWORK_POLICY_INVALID"
  }

  Write-Host "Verifying component-lock before installation"
  foreach ($entry in $lock.files) {
    $path = Join-Path $stage ($entry.path -replace '/','\')
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
      throw "OFFLINE_BUNDLE_LOCK_FILE_MISSING:$($entry.path)"
    }
    $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant()
    if ($hash -ne $entry.sha256) {
      throw "OFFLINE_BUNDLE_LOCK_HASH_MISMATCH:$($entry.path)"
    }
  }

  Write-Host "Installing verified private runtime into $runtime"
  $null = robocopy.exe $stage $runtime /E /R:1 /W:1 /NFL /NDL /NJH /NJS /NP
  $robocopyCode = $LASTEXITCODE
  if ($robocopyCode -gt 7) {
    throw "OFFLINE_BUNDLE_COPY_FAILED:$robocopyCode"
  }

  $manifestPath = Join-Path $runtime "release-source.json"
  if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    throw "OFFLINE_BUNDLE_RELEASE_SOURCE_MISSING"
  }
  $manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
  $vc = $manifest.systemPrerequisites.visualCppRuntime
  $vcInstalled = $false
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
    $vcInstaller = Join-Path $runtime "prerequisites\vc_redist.x64.exe"
    if (-not (Test-Path -LiteralPath $vcInstaller -PathType Leaf)) {
      throw "OFFLINE_BUNDLE_VC_RUNTIME_MISSING"
    }
    $vcHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $vcInstaller).Hash.ToLowerInvariant()
    if ($vcHash -ne $vc.sha256.ToLowerInvariant()) {
      throw "OFFLINE_BUNDLE_VC_RUNTIME_HASH_MISMATCH"
    }

    Write-Host "Installing verified bundled Visual C++ runtime"
    $vcProcess = Start-Process -FilePath $vcInstaller -ArgumentList @(
      "/install", "/quiet", "/norestart"
    ) -Verb RunAs -PassThru
    if (-not $vcProcess.WaitForExit(600000)) {
      Stop-Process -Id $vcProcess.Id -Force -ErrorAction SilentlyContinue
      throw "OFFLINE_BUNDLE_VC_RUNTIME_TIMEOUT"
    }
    $vcProcess.Refresh()
    if ($vcProcess.ExitCode -notin @(0, 1638, 3010)) {
      throw "OFFLINE_BUNDLE_VC_RUNTIME_FAILED:$($vcProcess.ExitCode)"
    }
  }

  $selfTest = Join-Path $runtime "bootstrap\windows-payload-selftest.ps1"
  if (-not (Test-Path -LiteralPath $selfTest -PathType Leaf)) {
    throw "OFFLINE_BUNDLE_SELFTEST_SCRIPT_MISSING"
  }
  & $selfTest -PayloadRoot $runtime
  if ($LASTEXITCODE -ne 0) {
    throw "OFFLINE_BUNDLE_SELFTEST_FAILED"
  }

  Write-Host "LEX_OFFLINE_BUNDLE_INSTALL_PASS"
} finally {
  Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
}
