param(
  [Parameter(Mandatory=$true)][string]$InstallerPath,
  [string]$InstallRoot,
  [bool]$ExpectedNetworkRequiredAtInstall = $true,
  [switch]$BlockNetworkDuringInstall
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

$oldPath = $env:PATH
$oldHttpProxy = $env:HTTP_PROXY
$oldHttpsProxy = $env:HTTPS_PROXY
$oldAllProxy = $env:ALL_PROXY
$oldNoProxy = $env:NO_PROXY

try {
  if ($BlockNetworkDuringInstall) {
    $env:HTTP_PROXY = "http://127.0.0.1:9"
    $env:HTTPS_PROXY = "http://127.0.0.1:9"
    $env:ALL_PROXY = "http://127.0.0.1:9"
    $env:NO_PROXY = "127.0.0.1,localhost"
  }

  Write-Host "G33D: silent install to $InstallRoot"
  $arguments = @("/S", "/D=$InstallRoot")
  $process = Start-Process -FilePath $installer -ArgumentList $arguments -Wait -PassThru
  if ($process.ExitCode -ne 0) {
    throw "INSTALLER_ACCEPTANCE_INSTALL_FAILED:$($process.ExitCode)"
  }

$sidecar = Get-ChildItem -Path $InstallRoot -File -Recurse -Filter "lex-runtime-sidecar.exe" |
  Select-Object -First 1
if (-not $sidecar) {
  throw "INSTALLER_ACCEPTANCE_SIDECAR_MISSING"
}
$runtimeRoot = $sidecar.Directory.FullName
$componentLock = Join-Path $runtimeRoot "component-lock.json"
$privateNode = Join-Path $runtimeRoot "node\node.exe"
$privatePython = Join-Path $runtimeRoot "python\python.exe"
foreach ($required in @($componentLock, $privateNode, $privatePython)) {
  if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
    throw "INSTALLER_ACCEPTANCE_PRIVATE_RUNTIME_MISSING:$required"
  }
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
  $env:PATH = $oldPath
  foreach ($pair in @(
    @{ Name = "HTTP_PROXY"; Value = $oldHttpProxy },
    @{ Name = "HTTPS_PROXY"; Value = $oldHttpsProxy },
    @{ Name = "ALL_PROXY"; Value = $oldAllProxy },
    @{ Name = "NO_PROXY"; Value = $oldNoProxy }
  )) {
    if ($null -eq $pair.Value) {
      Remove-Item -Path ("Env:" + $pair.Name) -ErrorAction SilentlyContinue
    } else {
      Set-Item -Path ("Env:" + $pair.Name) -Value $pair.Value
    }
  }
}
