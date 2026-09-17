param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$BundlePath
)

$ErrorActionPreference = "Stop"
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$bundle = (Resolve-Path -LiteralPath $BundlePath).Path
$receiptPath = Join-Path $runtime "offline-runtime.json"

# NSIS invokes Windows PowerShell directly. On some clean-machine/CI hosts its
# inherited module path does not expose the built-in Get-FileHash cmdlet.
# Provide a SHA-256-compatible fallback so this installer and child self-tests
# stay independent of PowerShell module auto-loading.
if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
  function Get-FileHash {
    param(
      [string]$Path,
      [string]$LiteralPath,
      [string]$Algorithm = "SHA256"
    )
    if ($Algorithm.ToUpperInvariant() -ne "SHA256") {
      throw "OFFLINE_HASH_ALGORITHM_UNSUPPORTED:$Algorithm"
    }
    $target = if ($LiteralPath) { $LiteralPath } else { $Path }
    if (-not $target) { throw "OFFLINE_HASH_PATH_MISSING" }
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

# Keep the extraction leaf deliberately short. Windows PowerShell 5.1 and some
# archive/file APIs still encounter MAX_PATH behavior when the user's TEMP path
# is already long and the Python package tree contains deep __pycache__ paths.
$stage = Join-Path $env:TEMP ("LMO-" + [Guid]::NewGuid().ToString("N").Substring(0, 12))
New-Item -ItemType Directory -Path $stage | Out-Null
$vcFirewallRule = $null

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

  $transientEntries = @($lock.files | Where-Object {
    $_.path -match '(^|/)__pycache__(/|$)' -or $_.path -match '\.py[co]$'
  })
  if ($transientEntries.Count -ne 0) {
    throw "OFFLINE_BUNDLE_LOCK_TRANSIENT_FILE_INVALID:$($transientEntries[0].path)"
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

  $forceVcInstall = $env:LEX_FORCE_VC_RUNTIME_INSTALL -eq "1"
  if ($forceVcInstall) {
    Write-Host "Forcing bundled Visual C++ runtime fallback for acceptance coverage"
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

    if ($env:LEX_ACCEPTANCE_BLOCK_NETWORK -eq "1") {
      if (-not (Test-IsAdministrator)) {
        throw "OFFLINE_BUNDLE_VC_FIREWALL_REQUIRES_ELEVATION"
      }
      $vcFirewallRule = "LexMachina-Acceptance-vc-redist-$([Guid]::NewGuid().ToString('N'))"
      New-NetFirewallRule `
        -DisplayName $vcFirewallRule `
        -Direction Outbound `
        -Action Block `
        -Program $vcInstaller `
        -Profile Any | Out-Null
      Write-Host "Acceptance firewall: outbound blocked for bundled VC++ installer"
    }

    Write-Host "Installing verified bundled Visual C++ runtime"
    $startArgs = @{
      FilePath = $vcInstaller
      ArgumentList = @("/install", "/quiet", "/norestart")
      PassThru = $true
    }
    if (-not (Test-IsAdministrator)) {
      $startArgs.Verb = "RunAs"
    }
    $vcProcess = Start-Process @startArgs
    if (-not $vcProcess.WaitForExit(600000)) {
      Stop-Process -Id $vcProcess.Id -Force -ErrorAction SilentlyContinue
      throw "OFFLINE_BUNDLE_VC_RUNTIME_TIMEOUT"
    }
    $vcProcess.Refresh()
    if ($vcProcess.ExitCode -notin @(0, 1638, 3010)) {
      throw "OFFLINE_BUNDLE_VC_RUNTIME_FAILED:$($vcProcess.ExitCode)"
    }
    Write-Host "Bundled Visual C++ runtime fallback exercised; exit=$($vcProcess.ExitCode)"
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
  if ($vcFirewallRule) {
    Remove-NetFirewallRule -DisplayName $vcFirewallRule -ErrorAction SilentlyContinue
  }
  Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
}
