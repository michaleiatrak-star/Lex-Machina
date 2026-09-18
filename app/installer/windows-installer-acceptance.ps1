param(
  [Parameter(Mandatory=$true)][string]$InstallerPath,
  [string]$InstallRoot,
  [bool]$ExpectedNetworkRequiredAtInstall = $true,
  [switch]$BlockNetworkDuringInstall,
  [switch]$ForceVisualCppRuntimeInstall,
  [switch]$StandaloneOfflineExe,
  [switch]$RequireAuthenticode,
  [string]$SigningManifestPath,
  [int]$InstallTimeoutSeconds = 3600
)

$ErrorActionPreference = "Stop"
$installer = (Resolve-Path -LiteralPath $InstallerPath).Path
$installerInfo = Get-Item -LiteralPath $installer
$trustedSignerThumbprints = @()

function Normalize-Thumbprint([string]$Value) {
  return (($Value -replace "\s+", "").ToUpperInvariant())
}

function Assert-PinnedAuthenticode(
  [string]$Path,
  [string]$Label
) {
  if (-not $RequireAuthenticode) {
    return
  }
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    throw "INSTALLER_ACCEPTANCE_SIGNATURE_TARGET_MISSING:${Label}:${Path}"
  }

  $signature = Get-AuthenticodeSignature -LiteralPath $Path
  if (
    $signature.Status -ne "Valid" -or
    $null -eq $signature.SignerCertificate
  ) {
    throw "INSTALLER_ACCEPTANCE_AUTHENTICODE_INVALID:${Label}:$($signature.Status)"
  }

  $thumbprint = Normalize-Thumbprint $signature.SignerCertificate.Thumbprint
  if ($trustedSignerThumbprints -notcontains $thumbprint) {
    throw "INSTALLER_ACCEPTANCE_AUTHENTICODE_SIGNER_NOT_PINNED:${Label}:${thumbprint}"
  }
  if ($null -eq $signature.TimeStamperCertificate) {
    throw "INSTALLER_ACCEPTANCE_AUTHENTICODE_TIMESTAMP_MISSING:${Label}"
  }

  Write-Host "Authenticode PASS: $Label signer=$thumbprint timestamp=$($signature.TimeStamperCertificate.Subject)"
}

if ($RequireAuthenticode) {
  if ([string]::IsNullOrWhiteSpace($SigningManifestPath)) {
    throw "INSTALLER_ACCEPTANCE_SIGNING_MANIFEST_REQUIRED"
  }
  $signingManifest = (Resolve-Path -LiteralPath $SigningManifestPath).Path
  $release = Get-Content -Raw -LiteralPath $signingManifest | ConvertFrom-Json
  $trustedSignerThumbprints = @(
    $release.applicationUpdate.trustedSignerThumbprints |
      ForEach-Object {
        if ($_ -is [string]) {
          Normalize-Thumbprint $_
        }
      } |
      Where-Object {
        $_ -match "^[A-F0-9]{40}$"
      } |
      Select-Object -Unique
  )
  if ($trustedSignerThumbprints.Count -lt 1) {
    throw "INSTALLER_ACCEPTANCE_SIGNER_POLICY_MISSING"
  }
  Assert-PinnedAuthenticode $installer "installer"
}

if ($StandaloneOfflineExe) {
  if ($ExpectedNetworkRequiredAtInstall) {
    throw "INSTALLER_ACCEPTANCE_STANDALONE_OFFLINE_NETWORK_POLICY_INVALID"
  }
  Write-Host "Acceptance: single-file offline wrapper mode ($($installerInfo.Length) bytes)"
} elseif ($installerInfo.Length -gt 1GB) {
  throw "INSTALLER_ACCEPTANCE_MONOLITHIC_BUNDLE_TOO_LARGE:$($installerInfo.Length)"
}
if (-not $InstallRoot) {
  $InstallRoot = Join-Path $env:RUNNER_TEMP ("Lex Machina Installed " + [Guid]::NewGuid().ToString("N"))
}
$InstallRoot = [IO.Path]::GetFullPath($InstallRoot)
Remove-Item $InstallRoot -Recurse -Force -ErrorAction SilentlyContinue

if (
  [string]::IsNullOrWhiteSpace($env:USERPROFILE) -or
  [string]::IsNullOrWhiteSpace($env:LOCALAPPDATA) -or
  [string]::IsNullOrWhiteSpace($env:APPDATA)
) {
  throw "INSTALLER_ACCEPTANCE_USER_DATA_ENV_MISSING"
}

$profileRoot = Join-Path $env:USERPROFILE ".lex-machina"
$localDataRoot = Join-Path $env:LOCALAPPDATA "LexMachina"
$roamingShellRoot = Join-Path $env:APPDATA "pl.lexmachina.desktop"
$staleProfileSentinel = Join-Path $profileRoot "data\stale-profile-sentinel.txt"
$staleLocalSentinel = Join-Path $localDataRoot "stale-local-sentinel.txt"
$staleRoamingSentinel = Join-Path $roamingShellRoot "stale-roaming-sentinel.txt"

foreach ($sentinel in @(
  $staleProfileSentinel,
  $staleLocalSentinel,
  $staleRoamingSentinel
)) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $sentinel) | Out-Null
  Set-Content -LiteralPath $sentinel -Value "must-be-removed-by-fresh-install" -Encoding ascii
}

if (-not $ExpectedNetworkRequiredAtInstall) {
  $offlineBundle = Join-Path $installerInfo.Directory.FullName "LexMachina-Offline-Runtime.zip"
  if ($StandaloneOfflineExe) {
    if (Test-Path -LiteralPath $offlineBundle -PathType Leaf) {
      throw "INSTALLER_ACCEPTANCE_STANDALONE_HAS_ADJACENT_RUNTIME_BUNDLE"
    }
  } elseif (-not (Test-Path -LiteralPath $offlineBundle -PathType Leaf)) {
    throw "INSTALLER_ACCEPTANCE_OFFLINE_BUNDLE_MISSING"
  }
}

function Test-IsAdministrator {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = [Security.Principal.WindowsPrincipal]::new($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

$firewallRules = [Collections.Generic.List[string]]::new()
function Add-AcceptanceFirewallBlock([string]$Program, [string]$Label) {
  if (-not (Test-Path -LiteralPath $Program -PathType Leaf)) {
    throw "INSTALLER_ACCEPTANCE_FIREWALL_PROGRAM_MISSING:${Label}:${Program}"
  }
  $ruleName = "LexMachina-Acceptance-$Label-$([Guid]::NewGuid().ToString('N'))"
  New-NetFirewallRule `
    -DisplayName $ruleName `
    -Direction Outbound `
    -Action Block `
    -Program $Program `
    -Profile Any | Out-Null
  $firewallRules.Add($ruleName)
  Write-Host "Acceptance firewall: outbound blocked for $Label ($Program)"
}

$oldPath = $env:PATH
$oldHttpProxy = $env:HTTP_PROXY
$oldHttpsProxy = $env:HTTPS_PROXY
$oldAllProxy = $env:ALL_PROXY
$oldNoProxy = $env:NO_PROXY
$oldAcceptanceBlockNetwork = $env:LEX_ACCEPTANCE_BLOCK_NETWORK
$oldForceVcRuntime = $env:LEX_FORCE_VC_RUNTIME_INSTALL

try {
  if ($BlockNetworkDuringInstall) {
    if (-not (Test-IsAdministrator)) {
      throw "INSTALLER_ACCEPTANCE_FIREWALL_REQUIRES_ELEVATION"
    }
    if (-not (Get-Command New-NetFirewallRule -ErrorAction SilentlyContinue)) {
      throw "INSTALLER_ACCEPTANCE_FIREWALL_CMDLET_MISSING"
    }
    $env:HTTP_PROXY = "http://127.0.0.1:9"
    $env:HTTPS_PROXY = "http://127.0.0.1:9"
    $env:ALL_PROXY = "http://127.0.0.1:9"
    $env:NO_PROXY = "127.0.0.1,localhost"
    $env:LEX_ACCEPTANCE_BLOCK_NETWORK = "1"

    Add-AcceptanceFirewallBlock $installer "installer"
    Add-AcceptanceFirewallBlock `
      (Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe") `
      "bootstrap-powershell"
  }

  if ($ForceVisualCppRuntimeInstall) {
    $env:LEX_FORCE_VC_RUNTIME_INSTALL = "1"
    Write-Host "Acceptance: forcing verified bundled VC++ fallback branch"
  }

  $preinstallDiagnostic = Join-Path $env:TEMP "LexMachinaPreinstall-error.log"
  Remove-Item -LiteralPath $preinstallDiagnostic -Force -ErrorAction SilentlyContinue
  Write-Host "G33D: silent install to $InstallRoot"
  $arguments = @("/S", "/D=$InstallRoot")
  $process = Start-Process -FilePath $installer -ArgumentList $arguments -PassThru
  if (-not $process.WaitForExit($InstallTimeoutSeconds * 1000)) {
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    throw "INSTALLER_ACCEPTANCE_INSTALL_TIMEOUT:$InstallTimeoutSeconds"
  }
  $process.Refresh()
  if ($process.ExitCode -ne 0) {
    $diagnosticLog = Join-Path $InstallRoot "runtime\bootstrap-install-error.log"
    if (Test-Path -LiteralPath $preinstallDiagnostic -PathType Leaf) {
      Write-Host "Installer preinstall diagnostic follows:"
      Get-Content -LiteralPath $preinstallDiagnostic | Out-Host
    }
    if (Test-Path -LiteralPath $diagnosticLog -PathType Leaf) {
      Write-Host "Installer bootstrap diagnostic follows:"
      Get-Content -LiteralPath $diagnosticLog | Out-Host
    } else {
      $wrapperDiagnostic = Join-Path $env:TEMP "LexMachinaOfflineSelfExtract-error.log"
      if ($StandaloneOfflineExe -and (Test-Path -LiteralPath $wrapperDiagnostic -PathType Leaf)) {
        Write-Host "Standalone wrapper diagnostic follows:"
        Get-Content -LiteralPath $wrapperDiagnostic | Out-Host
      } else {
        Write-Host "Installer bootstrap diagnostic file not found: $diagnosticLog"
      }
    }
    throw "INSTALLER_ACCEPTANCE_INSTALL_FAILED:$($process.ExitCode)"
  }

  foreach ($sentinel in @(
    $staleProfileSentinel,
    $staleLocalSentinel,
    $staleRoamingSentinel
  )) {
    if (Test-Path -LiteralPath $sentinel) {
      throw "INSTALLER_ACCEPTANCE_FRESH_PROFILE_PURGE_FAILED:$sentinel"
    }
  }

  # The desktop trust boundary resolves the runtime from resource_dir\runtime.
  # Validate that exact installed-copy contract rather than whichever duplicate
  # sidecar Get-ChildItem happens to return first.
  $runtimeRoot = Join-Path $InstallRoot "runtime"
  $sidecarPath = Join-Path $runtimeRoot "lex-runtime-sidecar.exe"
  if (-not (Test-Path -LiteralPath $sidecarPath -PathType Leaf)) {
    $sidecarCandidates = @(
      Get-ChildItem -Path $InstallRoot -File -Recurse -Filter "lex-runtime-sidecar.exe" |
        ForEach-Object { $_.FullName }
    )
    if ($sidecarCandidates.Count -gt 0) {
      Write-Host "Installed sidecar candidates outside the required runtime root:"
      $sidecarCandidates | ForEach-Object { Write-Host " - $_" }
    }
    throw "INSTALLER_ACCEPTANCE_SIDECAR_MISSING:$sidecarPath"
  }
  $sidecar = Get-Item -LiteralPath $sidecarPath
  Assert-PinnedAuthenticode $sidecar.FullName "runtime-sidecar"
  $componentLock = Join-Path $runtimeRoot "component-lock.json"
  $privateNode = Join-Path $runtimeRoot "node\node.exe"
  $privatePython = Join-Path $runtimeRoot "python\python.exe"
  foreach ($required in @(
    $componentLock,
    $privateNode,
    $privatePython
  )) {
    if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
      throw "INSTALLER_ACCEPTANCE_PRIVATE_RUNTIME_MISSING:$required"
    }
  }

  if ($BlockNetworkDuringInstall) {
    Add-AcceptanceFirewallBlock $sidecar.FullName "runtime-sidecar"
    Add-AcceptanceFirewallBlock $privateNode "private-node"
    Add-AcceptanceFirewallBlock $privatePython "private-python"
  }

  $lock = Get-Content -Raw -LiteralPath $componentLock | ConvertFrom-Json
  if ($lock.networkRequiredAtInstall -ne $ExpectedNetworkRequiredAtInstall) {
    throw "INSTALLER_ACCEPTANCE_INSTALL_NETWORK_POLICY_INVALID"
  }
  if ($lock.runtimeNetworkRequiredAfterBootstrap -ne $false) {
    throw "INSTALLER_ACCEPTANCE_RUNTIME_NETWORK_POLICY_INVALID"
  }
  if ($lock.expectedUserActionAfterInstall -ne "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP") {
    throw "INSTALLER_ACCEPTANCE_USER_ACTION_POLICY_INVALID"
  }
  if ($lock.localAi.requiredForApplicationHealth -ne $false) {
    throw "INSTALLER_ACCEPTANCE_LOCAL_AI_OPTIONAL_POLICY_INVALID"
  }
  if ($lock.localAi.delivery -ne "USER_INITIATED_AFTER_INSTALL") {
    throw "INSTALLER_ACCEPTANCE_LOCAL_AI_DELIVERY_POLICY_INVALID"
  }

  # Do not let the acceptance test accidentally use runner Node/Python.
  $env:PATH = "$env:SystemRoot\System32;$env:SystemRoot"
  $env:HTTP_PROXY = "http://127.0.0.1:9"
  $env:HTTPS_PROXY = "http://127.0.0.1:9"
  $env:ALL_PROXY = "http://127.0.0.1:9"
  $env:NO_PROXY = "127.0.0.1,localhost"

  Write-Host "G33D: installed private runtime self-test"
  & $sidecar.FullName --self-test | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "INSTALLER_ACCEPTANCE_INSTALLED_SELFTEST_FAILED"
  }

  $nodeVersion = & $privateNode --version
  if ($LASTEXITCODE -ne 0 -or -not $nodeVersion) {
    throw "INSTALLER_ACCEPTANCE_PRIVATE_NODE_FAILED"
  }
  $pythonVersion = (& $privatePython --version 2>&1 | Select-Object -First 1).ToString().Trim()
  $releaseSource = Get-Content -Raw -LiteralPath (Join-Path $runtimeRoot "release-source.json") | ConvertFrom-Json
  $expectedPythonVersion = "Python $($releaseSource.runtime.python.version)"
  if ($LASTEXITCODE -ne 0 -or $pythonVersion -ne $expectedPythonVersion) {
    throw "INSTALLER_ACCEPTANCE_PRIVATE_PYTHON_FAILED expected=$expectedPythonVersion actual=$pythonVersion"
  }

  $uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Lex Machina"
  $registered = Get-ItemProperty -LiteralPath $uninstallKey -ErrorAction SilentlyContinue
  if (-not $registered) {
    throw "INSTALLER_ACCEPTANCE_UNINSTALL_REGISTRY_MISSING"
  }

  $registeredInstallRoot = ([string]$registered.InstallLocation).Trim().Trim('"')
  if ([string]::IsNullOrWhiteSpace($registeredInstallRoot)) {
    throw "INSTALLER_ACCEPTANCE_INSTALLLOCATION_MISSING"
  }
  $registeredInstallRoot = [IO.Path]::GetFullPath($registeredInstallRoot)

  if (
    -not [string]::Equals(
      $registeredInstallRoot.TrimEnd('\'),
      $InstallRoot.TrimEnd('\'),
      [StringComparison]::OrdinalIgnoreCase
    )
  ) {
    throw "INSTALLER_ACCEPTANCE_REGISTERED_ROOT_MISMATCH:expected=$InstallRoot actual=$registeredInstallRoot"
  }

  $registeredMainBinary = ([string]$registered.MainBinaryName).Trim().Trim('"')
  if ([string]::IsNullOrWhiteSpace($registeredMainBinary)) {
    throw "INSTALLER_ACCEPTANCE_MAINBINARYNAME_MISSING"
  }
  if (
    [IO.Path]::GetFileName($registeredMainBinary) -ne $registeredMainBinary -or
    [IO.Path]::GetExtension($registeredMainBinary) -ne ".exe"
  ) {
    throw "INSTALLER_ACCEPTANCE_MAINBINARYNAME_INVALID:$registeredMainBinary"
  }

  $appPath = Join-Path $registeredInstallRoot $registeredMainBinary
  if (-not (Test-Path -LiteralPath $appPath -PathType Leaf)) {
    Write-Host "Installed root top-level files:"
    Get-ChildItem -LiteralPath $registeredInstallRoot -File -Force -ErrorAction SilentlyContinue |
      Sort-Object Name |
      ForEach-Object { Write-Host " - $($_.Name)" }
    throw "INSTALLER_ACCEPTANCE_DESKTOP_EXE_MISSING:$appPath"
  }

  $app = Get-Item -LiteralPath $appPath
  Assert-PinnedAuthenticode $app.FullName "desktop-exe"

  $uninstaller = Join-Path $registeredInstallRoot "uninstall.exe"
  if (-not (Test-Path -LiteralPath $uninstaller -PathType Leaf)) {
    throw "INSTALLER_ACCEPTANCE_UNINSTALLER_MISSING:$uninstaller"
  }
  Assert-PinnedAuthenticode $uninstaller "uninstaller"

  if ($BlockNetworkDuringInstall) {
    Add-AcceptanceFirewallBlock $app.FullName "desktop"
  }

  Write-Host "G33D: first desktop startup without provider key"
  $desktop = Start-Process -FilePath $app.FullName -PassThru
  try {
    Start-Sleep -Seconds 12
    if ($desktop.HasExited) {
      throw "INSTALLER_ACCEPTANCE_DESKTOP_EARLY_EXIT:$($desktop.ExitCode)"
    }
    $authDb = Join-Path $profileRoot "data\auth\auth.sqlite"
    if (-not (Test-Path -LiteralPath $authDb -PathType Leaf)) {
      throw "INSTALLER_ACCEPTANCE_CLEAN_ADMIN_NOT_BOOTSTRAPPED:$authDb"
    }

    $adminProbe = @'
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync(process.argv[1], { readOnly: true });
try {
  const rows = db.prepare(
    "SELECT login_name, app_role, status, password_setup_pending FROM users ORDER BY created_at, user_id"
  ).all();
  if (
    rows.length !== 1 ||
    rows[0].login_name !== "local-admin" ||
    rows[0].app_role !== "ADMIN" ||
    rows[0].status !== "ACTIVE" ||
    rows[0].password_setup_pending !== 1
  ) {
    process.stderr.write("CLEAN_ADMIN_INVALID:" + JSON.stringify(rows));
    process.exit(2);
  }
  process.stdout.write("CLEAN_ADMIN_PASS");
} finally {
  db.close();
}
'@
    & $privateNode -e $adminProbe $authDb | Out-Host
    if ($LASTEXITCODE -ne 0) {
      throw "INSTALLER_ACCEPTANCE_CLEAN_ADMIN_INVALID"
    }
  } finally {
    if ($desktop -and -not $desktop.HasExited) {
      Stop-Process -Id $desktop.Id -Force -ErrorAction SilentlyContinue
      $desktop.WaitForExit(10000) | Out-Null
    }
    Get-Process -Name "lex-runtime-sidecar" -ErrorAction SilentlyContinue |
      Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name "node" -ErrorAction SilentlyContinue |
      Where-Object { $_.Path -like "$runtimeRoot*" } |
      Stop-Process -Force -ErrorAction SilentlyContinue
  }

  Write-Host "G33D: full uninstall profile/password purge acceptance"
  $uninstallProcess = Start-Process -FilePath $uninstaller -ArgumentList @("/S") -PassThru
  if (-not $uninstallProcess.WaitForExit(600000)) {
    Stop-Process -Id $uninstallProcess.Id -Force -ErrorAction SilentlyContinue
    throw "INSTALLER_ACCEPTANCE_UNINSTALL_TIMEOUT"
  }
  $uninstallProcess.Refresh()
  if ($uninstallProcess.ExitCode -ne 0) {
    throw "INSTALLER_ACCEPTANCE_UNINSTALL_FAILED:$($uninstallProcess.ExitCode)"
  }
  # NSIS may launch the final self-delete/registry cleanup from a temporary
  # process after the original uninstaller process exits. Require the registry
  # entry to disappear, but allow that documented hand-off to finish.
  $uninstallCleanupDeadline = (Get-Date).AddSeconds(60)
  do {
    $registeredAfterUninstall = Get-ItemProperty -LiteralPath $uninstallKey -ErrorAction SilentlyContinue
    if (-not $registeredAfterUninstall) {
      break
    }
    Start-Sleep -Milliseconds 500
  } while ((Get-Date) -lt $uninstallCleanupDeadline)

  if ($registeredAfterUninstall) {
    throw "INSTALLER_ACCEPTANCE_UNINSTALL_REGISTRY_REMAINS"
  }

  & (Join-Path $PSScriptRoot "purge-user-data.ps1") -Mode VerifyPurged -InstallRoot $InstallRoot
  if ($LASTEXITCODE -ne 0) {
    throw "INSTALLER_ACCEPTANCE_PROFILE_PURGE_VERIFY_FAILED"
  }
  if (Test-Path -LiteralPath $InstallRoot) {
    $remaining = @(
      Get-ChildItem -LiteralPath $InstallRoot -Force -ErrorAction SilentlyContinue |
        ForEach-Object { $_.Name }
    )
    if ($remaining.Count -gt 0) {
      throw "INSTALLER_ACCEPTANCE_INSTALL_ROOT_REMAINS:$($remaining -join ',')"
    }
  }

  Write-Host "G33D_INSTALLER_ACCEPTANCE_PASS"
  Write-Host "Fresh install: clean local-admin bootstrap PASS"
  Write-Host "Uninstall: profiles, cases, Local AI and OS-keyring credentials purge PASS"
} finally {
  foreach ($ruleName in $firewallRules) {
    Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
  }
  $env:PATH = $oldPath
  foreach ($pair in @(
    @{ Name = "HTTP_PROXY"; Value = $oldHttpProxy },
    @{ Name = "HTTPS_PROXY"; Value = $oldHttpsProxy },
    @{ Name = "ALL_PROXY"; Value = $oldAllProxy },
    @{ Name = "NO_PROXY"; Value = $oldNoProxy },
    @{ Name = "LEX_ACCEPTANCE_BLOCK_NETWORK"; Value = $oldAcceptanceBlockNetwork },
    @{ Name = "LEX_FORCE_VC_RUNTIME_INSTALL"; Value = $oldForceVcRuntime }
  )) {
    if ($null -eq $pair.Value) {
      Remove-Item -Path ("Env:" + $pair.Name) -ErrorAction SilentlyContinue
    } else {
      Set-Item -Path ("Env:" + $pair.Name) -Value $pair.Value
    }
  }
}
