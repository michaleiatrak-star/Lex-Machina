param(
  [Parameter(Mandatory=$true)][string]$InstallerPath,
  [string]$InstallRoot,
  [bool]$ExpectedNetworkRequiredAtInstall = $true,
  [switch]$BlockNetworkDuringInstall,
  [switch]$ForceVisualCppRuntimeInstall,
  [int]$InstallTimeoutSeconds = 3600
)

$ErrorActionPreference = "Stop"
$installer = (Resolve-Path -LiteralPath $InstallerPath).Path
$installerInfo = Get-Item -LiteralPath $installer
if ($installerInfo.Length -gt 1GB) {
  throw "INSTALLER_ACCEPTANCE_MONOLITHIC_BUNDLE_TOO_LARGE:$($installerInfo.Length)"
}
if (-not $InstallRoot) {
  $InstallRoot = Join-Path $env:RUNNER_TEMP ("LexMachinaInstalled-" + [Guid]::NewGuid().ToString("N"))
}
$InstallRoot = [IO.Path]::GetFullPath($InstallRoot)
Remove-Item $InstallRoot -Recurse -Force -ErrorAction SilentlyContinue

if (-not $ExpectedNetworkRequiredAtInstall) {
  $offlineBundle = Join-Path $installerInfo.Directory.FullName "LexMachina-Offline-Runtime.zip"
  if (-not (Test-Path -LiteralPath $offlineBundle -PathType Leaf)) {
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
    if (Test-Path -LiteralPath $diagnosticLog -PathType Leaf) {
      Write-Host "Installer bootstrap diagnostic follows:"
      Get-Content -LiteralPath $diagnosticLog | Out-Host
    } else {
      Write-Host "Installer bootstrap diagnostic file not found: $diagnosticLog"
    }
    throw "INSTALLER_ACCEPTANCE_INSTALL_FAILED:$($process.ExitCode)"
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
  $componentLock = Join-Path $runtimeRoot "component-lock.json"
  $privateNode = Join-Path $runtimeRoot "node\node.exe"
  $privatePython = Join-Path $runtimeRoot "python\python.exe"
  foreach ($required in @($componentLock, $privateNode, $privatePython)) {
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
  if ($lock.expectedUserActionAfterInstall -ne "PROVIDER_API_KEY_ONLY") {
    throw "INSTALLER_ACCEPTANCE_USER_ACTION_POLICY_INVALID"
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
  $pythonVersion = & $privatePython --version
  if ($LASTEXITCODE -ne 0 -or -not $pythonVersion) {
    throw "INSTALLER_ACCEPTANCE_PRIVATE_PYTHON_FAILED"
  }

  $app = Get-ChildItem -Path $InstallRoot -File -Recurse |
    Where-Object {
      $_.Name -match '^lex[- ]machina\.exe$' -and
      $_.FullName -notmatch '\\runtime\\'
    } |
    Select-Object -First 1
  if (-not $app) {
    throw "INSTALLER_ACCEPTANCE_DESKTOP_EXE_MISSING"
  }
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

  Write-Host "G33D_INSTALLER_ACCEPTANCE_PASS"
  Write-Host "User action after installation: PROVIDER_API_KEY_ONLY"
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
