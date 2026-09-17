param(
  [Parameter(Mandatory=$true)][string]$ReceiptPath,
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$InstallRoot,
  [Parameter(Mandatory=$true)][string]$AppExecutable,
  [Parameter(Mandatory=$true)][int]$ParentPid
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Full-Path([string]$Value) {
  return [IO.Path]::GetFullPath($Value)
}

function Normalize-Thumbprint([string]$Value) {
  return ($Value -replace '\s+', '').ToUpperInvariant()
}

function Write-JsonAtomic([string]$Path, [object]$Value) {
  $parent = Split-Path -Parent $Path
  if ($parent) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  $temporary = $Path + ".tmp"
  [IO.File]::WriteAllText(
    $temporary,
    (($Value | ConvertTo-Json -Depth 12) + [Environment]::NewLine),
    [Text.UTF8Encoding]::new($false)
  )
  Move-Item -LiteralPath $temporary -Destination $Path -Force
}

function Read-Json([string]$Path, [string]$Code) {
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    throw "${Code}_MISSING:$Path"
  }
  try {
    return Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
  } catch {
    throw "${Code}_INVALID:$Path"
  }
}

function Assert-SimpleToken([string]$Value, [string]$Code, [string]$Extension) {
  if (
    [string]::IsNullOrWhiteSpace($Value) -or
    $Value.Contains('/') -or
    $Value.Contains('\') -or
    $Value.Contains('..') -or
    $Value.Contains(':') -or
    -not $Value.EndsWith($Extension, [StringComparison]::OrdinalIgnoreCase) -or
    $Value -notmatch '^[A-Za-z0-9._-]+$'
  ) {
    throw "$Code:$Value"
  }
}

function Get-TrustedSignerThumbprints([object]$Manifest) {
  if (
    $null -eq $Manifest.applicationUpdate -or
    $Manifest.applicationUpdate.verification -ne "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
  ) {
    throw "UPDATE_TRUST_POLICY_INVALID"
  }
  $trusted = @(
    $Manifest.applicationUpdate.trustedSignerThumbprints |
      ForEach-Object { Normalize-Thumbprint ([string]$_) } |
      Where-Object { $_ -match '^[A-F0-9]{40}$' } |
      Select-Object -Unique
  )
  if ($trusted.Count -lt 1) {
    throw "UPDATE_TRUST_POLICY_EMPTY"
  }
  return $trusted
}

function Assert-Authenticode(
  [string]$Installer,
  [string[]]$Trusted,
  [string]$ReceiptThumbprint
) {
  $signature = Get-AuthenticodeSignature -LiteralPath $Installer
  if ($signature.Status -ne 'Valid' -or $null -eq $signature.SignerCertificate) {
    throw "UPDATE_SIGNATURE_INVALID:$($signature.Status)"
  }
  $actual = Normalize-Thumbprint $signature.SignerCertificate.Thumbprint
  if ($Trusted -notcontains $actual) {
    throw "UPDATE_SIGNER_NOT_TRUSTED:$actual"
  }
  if ($actual -ne (Normalize-Thumbprint $ReceiptThumbprint)) {
    throw "UPDATE_RECEIPT_SIGNER_MISMATCH"
  }
  return $actual
}

function Stop-LexProcesses([string]$ApplicationRoot) {
  $normalizedRoot = (Full-Path $ApplicationRoot).TrimEnd('\') + '\'
  $localAiRoot = if ($env:LOCALAPPDATA) {
    (Full-Path (Join-Path $env:LOCALAPPDATA "LexMachina\local-ai")).TrimEnd('\') + '\'
  } else { $null }

  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object {
      $path = [string]$_.ExecutablePath
      if (-not $path) { return $false }
      $full = try { Full-Path $path } catch { return $false }
      return (
        $full.StartsWith($normalizedRoot, [StringComparison]::OrdinalIgnoreCase) -or
        ($localAiRoot -and $full.StartsWith($localAiRoot, [StringComparison]::OrdinalIgnoreCase))
      )
    } |
    ForEach-Object {
      Stop-Process -Id ([int]$_.ProcessId) -Force -ErrorAction SilentlyContinue
    }
}

function Wait-ParentExit([int]$ProcessId) {
  if ($ProcessId -le 0) { return }
  $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
  if (-not $process) { return }
  if (-not $process.WaitForExit(120000)) {
    throw "UPDATE_PARENT_EXIT_TIMEOUT:$ProcessId"
  }
}

function Get-InstallSize([string]$Root) {
  $sum = Get-ChildItem -LiteralPath $Root -File -Recurse -Force -ErrorAction Stop |
    Measure-Object -Property Length -Sum
  return [int64]($sum.Sum ?? 0)
}

function Assert-BackupCapacity([string]$BackupBase, [int64]$InstallBytes) {
  $root = [IO.Path]::GetPathRoot((Full-Path $BackupBase))
  $driveName = $root.TrimEnd('\').TrimEnd(':')
  $drive = Get-PSDrive -Name $driveName -ErrorAction Stop
  $required = $InstallBytes + 536870912L
  if ([int64]$drive.Free -lt $required) {
    throw "UPDATE_BACKUP_SPACE_INSUFFICIENT:required=$required free=$($drive.Free)"
  }
}

function Copy-DirectoryContents([string]$Source, [string]$Destination) {
  New-Item -ItemType Directory -Force -Path $Destination | Out-Null
  foreach ($item in Get-ChildItem -LiteralPath $Source -Force) {
    Copy-Item -LiteralPath $item.FullName -Destination $Destination -Recurse -Force
  }
}

function Get-LexUninstallKeys {
  $root = "Registry::HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall"
  if (-not (Test-Path $root)) { return @() }
  return @(
    Get-ChildItem $root -ErrorAction SilentlyContinue |
      Where-Object {
        try {
          (Get-ItemProperty -LiteralPath $_.PSPath -Name DisplayName -ErrorAction Stop).DisplayName -eq "Lex Machina"
        } catch { $false }
      }
  )
}

function Backup-UninstallRegistry([string]$Destination) {
  New-Item -ItemType Directory -Force -Path $Destination | Out-Null
  $index = 0
  foreach ($key in Get-LexUninstallKeys) {
    $target = Join-Path $Destination ("uninstall-$index.reg")
    & reg.exe export $key.Name $target /y | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "UPDATE_REGISTRY_BACKUP_FAILED:$($key.Name)"
    }
    $index++
  }
}

function Restore-UninstallRegistry([string]$Source) {
  foreach ($key in Get-LexUninstallKeys) {
    Remove-Item -LiteralPath $key.PSPath -Recurse -Force -ErrorAction SilentlyContinue
  }
  if (-not (Test-Path -LiteralPath $Source -PathType Container)) { return }
  foreach ($file in Get-ChildItem -LiteralPath $Source -Filter '*.reg' -File | Sort-Object Name) {
    & reg.exe import $file.FullName | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "UPDATE_REGISTRY_RESTORE_FAILED:$($file.FullName)"
    }
  }
}

function Restore-Backup(
  [string]$ApplicationRoot,
  [string]$BackupRoot,
  [string]$RegistryBackup
) {
  Stop-LexProcesses $ApplicationRoot
  Remove-Item -LiteralPath $ApplicationRoot -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Force -Path $ApplicationRoot | Out-Null
  Copy-DirectoryContents $BackupRoot $ApplicationRoot
  Restore-UninstallRegistry $RegistryBackup
}

$receipt = Full-Path $ReceiptPath
$runtime = Full-Path $RuntimeRoot
$install = Full-Path $InstallRoot
$appExe = Full-Path $AppExecutable
$staging = Full-Path (Join-Path $env:TEMP "LexMachinaUpdate")

if (-not $receipt.StartsWith($staging.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) {
  throw "UPDATE_RECEIPT_OUTSIDE_STAGING"
}
if ($runtime -ne (Full-Path (Join-Path $install "runtime"))) {
  throw "UPDATE_RUNTIME_ROOT_MISMATCH"
}
if (-not $appExe.StartsWith($install.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) {
  throw "UPDATE_APP_EXECUTABLE_OUTSIDE_INSTALL_ROOT"
}

$currentManifestPath = Join-Path $runtime "release-source.json"
$currentManifest = Read-Json $currentManifestPath "UPDATE_CURRENT_MANIFEST"
$trustedSigners = Get-TrustedSignerThumbprints $currentManifest
$currentVersion = try { [Version]([string]$currentManifest.applicationVersion) } catch {
  throw "UPDATE_CURRENT_VERSION_INVALID"
}

$receiptObject = Read-Json $receipt "UPDATE_RECEIPT"
if (
  [int]$receiptObject.schemaVersion -ne 1 -or
  [string]$receiptObject.kind -ne "LEX_MACHINA_APPLICATION_UPDATE"
) {
  throw "UPDATE_RECEIPT_SCHEMA_INVALID"
}
Assert-SimpleToken ([string]$receiptObject.installerToken) "UPDATE_INSTALLER_TOKEN_INVALID" ".exe"
if ([string]$receiptObject.sha256 -notmatch '^[a-fA-F0-9]{64}$') {
  throw "UPDATE_RECEIPT_HASH_INVALID"
}
if ($null -eq $receiptObject.publisher -or [string]$receiptObject.publisher.verification -ne "AUTHENTICODE") {
  throw "UPDATE_RECEIPT_PUBLISHER_INVALID"
}
$targetVersion = try { [Version]([string]$receiptObject.version) } catch {
  throw "UPDATE_TARGET_VERSION_INVALID"
}
if ($targetVersion -le $currentVersion) {
  throw "UPDATE_TARGET_NOT_NEWER:current=$currentVersion target=$targetVersion"
}

$installer = Full-Path (Join-Path (Split-Path -Parent $receipt) ([string]$receiptObject.installerToken))
if (-not (Test-Path -LiteralPath $installer -PathType Leaf)) {
  throw "UPDATE_INSTALLER_MISSING:$installer"
}
$actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $installer).Hash.ToLowerInvariant()
if ($actualHash -ne ([string]$receiptObject.sha256).ToLowerInvariant()) {
  throw "UPDATE_INSTALLER_HASH_MISMATCH"
}
$verifiedThumbprint = Assert-Authenticode `
  $installer `
  $trustedSigners `
  ([string]$receiptObject.publisher.thumbprint)

$backupBase = if ($env:LOCALAPPDATA) {
  Join-Path $env:LOCALAPPDATA "LexMachina\update-backups"
} else {
  Join-Path $env:TEMP "LexMachinaUpdateBackups"
}
New-Item -ItemType Directory -Force -Path $backupBase | Out-Null
$backupRoot = Join-Path $backupBase (
  (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssfffZ") +
  "-" + $currentVersion +
  "-" + [Guid]::NewGuid().ToString("N")
)
$filesBackup = Join-Path $backupRoot "install"
$registryBackup = Join-Path $backupRoot "registry"
$journal = if ($env:LOCALAPPDATA) {
  Join-Path $env:LOCALAPPDATA "LexMachina\update-transaction.json"
} else {
  Join-Path $env:TEMP "LexMachinaUpdate\update-transaction.json"
}

$journalState = [ordered]@{
  schemaVersion = 1
  state = "PREPARED"
  startedAt = (Get-Date).ToUniversalTime().ToString("o")
  currentVersion = $currentVersion.ToString()
  targetVersion = $targetVersion.ToString()
  installRoot = $install
  backupRoot = $backupRoot
  receiptPath = $receipt
  installerPath = $installer
  signerThumbprint = $verifiedThumbprint
  lastError = $null
}
Write-JsonAtomic $journal $journalState

Wait-ParentExit $ParentPid
Stop-LexProcesses $install
Start-Sleep -Milliseconds 500

$installBytes = Get-InstallSize $install
Assert-BackupCapacity $backupBase $installBytes
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
Copy-DirectoryContents $install $filesBackup
Backup-UninstallRegistry $registryBackup
$journalState.state = "BACKED_UP"
$journalState.backupBytes = $installBytes
Write-JsonAtomic $journal $journalState

$rollbackRequired = $true
try {
  $journalState.state = "INSTALLING"
  Write-JsonAtomic $journal $journalState

  $installProcess = Start-Process -FilePath $installer -ArgumentList @(
    "/S",
    "/UPDATE",
    "/D=$install"
  ) -Wait -PassThru
  if ($installProcess.ExitCode -notin @(0, 3010)) {
    throw "UPDATE_INSTALLER_FAILED:$($installProcess.ExitCode)"
  }

  $journalState.state = "VERIFYING"
  Write-JsonAtomic $journal $journalState

  $newRuntime = Join-Path $install "runtime"
  $newManifestPath = Join-Path $newRuntime "release-source.json"
  $newManifest = Read-Json $newManifestPath "UPDATE_NEW_MANIFEST"
  $installedVersion = try { [Version]([string]$newManifest.applicationVersion) } catch {
    throw "UPDATE_INSTALLED_VERSION_INVALID"
  }
  if ($installedVersion -ne $targetVersion) {
    throw "UPDATE_INSTALLED_VERSION_MISMATCH:expected=$targetVersion actual=$installedVersion"
  }

  if (-not (Test-Path -LiteralPath $appExe -PathType Leaf)) {
    throw "UPDATE_POSTCHECK_APP_MISSING"
  }
  $sidecar = Join-Path $newRuntime "lex-runtime-sidecar.exe"
  if (-not (Test-Path -LiteralPath $sidecar -PathType Leaf)) {
    throw "UPDATE_POSTCHECK_SIDECAR_MISSING"
  }
  $postcheck = Start-Process -FilePath $sidecar -ArgumentList @("--self-test") -Wait -PassThru -WindowStyle Hidden
  if ($postcheck.ExitCode -ne 0) {
    throw "UPDATE_POSTCHECK_FAILED:$($postcheck.ExitCode)"
  }

  $rollbackRequired = $false
  $journalState.state = "COMMITTED"
  $journalState.committedAt = (Get-Date).ToUniversalTime().ToString("o")
  Write-JsonAtomic $journal $journalState

  Remove-Item -LiteralPath $backupRoot -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $receipt -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $installer -Force -ErrorAction SilentlyContinue

  if (Test-Path -LiteralPath $appExe -PathType Leaf) {
    Start-Process -FilePath $appExe | Out-Null
  }
  Write-Host "LEX_APPLICATION_UPDATE_COMMITTED:$targetVersion"
  exit 0
} catch {
  $failure = $_.Exception.Message
  $journalState.state = "ROLLING_BACK"
  $journalState.lastError = $failure
  Write-JsonAtomic $journal $journalState

  if ($rollbackRequired) {
    try {
      Restore-Backup $install $filesBackup $registryBackup
      $restoredSidecar = Join-Path $install "runtime\lex-runtime-sidecar.exe"
      if (-not (Test-Path -LiteralPath $restoredSidecar -PathType Leaf)) {
        throw "UPDATE_ROLLBACK_SIDECAR_MISSING"
      }
      $rollbackCheck = Start-Process -FilePath $restoredSidecar -ArgumentList @("--self-test") -Wait -PassThru -WindowStyle Hidden
      if ($rollbackCheck.ExitCode -ne 0) {
        throw "UPDATE_ROLLBACK_HEALTHCHECK_FAILED:$($rollbackCheck.ExitCode)"
      }
      $journalState.state = "ROLLED_BACK"
      $journalState.rolledBackAt = (Get-Date).ToUniversalTime().ToString("o")
      Write-JsonAtomic $journal $journalState
      if (Test-Path -LiteralPath $appExe -PathType Leaf) {
        Start-Process -FilePath $appExe | Out-Null
      }
      Write-Error "LEX_APPLICATION_UPDATE_ROLLED_BACK:$failure"
      exit 31
    } catch {
      $rollbackFailure = $_.Exception.Message
      $journalState.state = "ROLLBACK_FAILED"
      $journalState.rollbackError = $rollbackFailure
      Write-JsonAtomic $journal $journalState
      Write-Error "LEX_APPLICATION_UPDATE_ROLLBACK_FAILED:update=$failure rollback=$rollbackFailure"
      exit 32
    }
  }
  throw
}
