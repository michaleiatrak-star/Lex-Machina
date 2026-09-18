param(
  [Parameter(Mandatory = $true)]
  [string]$ArtifactPath,

  [Parameter(Mandatory = $true)]
  [string]$ManifestPath,

  [Parameter(Mandatory = $true)]
  [string]$ReceiptPath,

  [string]$TimestampUrl = "http://timestamp.digicert.com"
)

$ErrorActionPreference = "Stop"
$selfTestRequested =
  [Environment]::GetEnvironmentVariable(
    "LEX_SIGNING_SELFTEST_ALLOW_MISSING_TIMESTAMP",
    "Process"
  ) -eq "1"
$selfTestAllowMissingTimestamp = $false


function Normalize-Thumbprint([string]$Value) {
  return (($Value -replace "\\s+", "").ToUpperInvariant())
}

function Find-SignTool {
  $command = Get-Command "signtool.exe" -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $programFilesX86 = [Environment]::GetFolderPath("ProgramFilesX86")
  $kitsRoot = Join-Path $programFilesX86 "Windows Kits\10\bin"
  if (-not (Test-Path -LiteralPath $kitsRoot -PathType Container)) {
    throw "WINDOWS_SIGNTOOL_NOT_FOUND"
  }

  $candidate = Get-ChildItem -LiteralPath $kitsRoot -Directory |
    Sort-Object Name -Descending |
    ForEach-Object {
      Join-Path $_.FullName "x64\signtool.exe"
    } |
    Where-Object {
      Test-Path -LiteralPath $_ -PathType Leaf
    } |
    Select-Object -First 1

  if (-not $candidate) {
    throw "WINDOWS_SIGNTOOL_NOT_FOUND"
  }
  return $candidate
}

$artifact = (Resolve-Path -LiteralPath $ArtifactPath).Path
$manifest = (Resolve-Path -LiteralPath $ManifestPath).Path
$receipt = [IO.Path]::GetFullPath($ReceiptPath)

$extension = [IO.Path]::GetExtension($artifact).ToLowerInvariant()
if ($extension -notin @(".exe", ".dll")) {
  throw "WINDOWS_SIGNING_ARTIFACT_NOT_PE"
}

$release = Get-Content -Raw -LiteralPath $manifest | ConvertFrom-Json

if ($selfTestRequested) {
  $runnerTemp = [Environment]::GetEnvironmentVariable(
    "RUNNER_TEMP",
    "Process"
  )
  if ([string]::IsNullOrWhiteSpace($runnerTemp)) {
    throw "WINDOWS_SIGNING_SELFTEST_SCOPE_INVALID"
  }

  $runnerTempFull = [IO.Path]::GetFullPath($runnerTemp).TrimEnd('\')
  $artifactFull = [IO.Path]::GetFullPath($artifact)
  $manifestFull = [IO.Path]::GetFullPath($manifest)
  $receiptFull = [IO.Path]::GetFullPath($receipt)
  $prefix = $runnerTempFull + "\"

  $artifactInRunnerTemp = $artifactFull.StartsWith(
    $prefix,
    [StringComparison]::OrdinalIgnoreCase
  )
  $manifestInRunnerTemp = $manifestFull.StartsWith(
    $prefix,
    [StringComparison]::OrdinalIgnoreCase
  )
  $receiptInRunnerTemp = $receiptFull.StartsWith(
    $prefix,
    [StringComparison]::OrdinalIgnoreCase
  )

  if (
    [string]$release.applicationVersion -ne "0.0.0-test" -or
    -not $artifactInRunnerTemp -or
    -not $manifestInRunnerTemp -or
    -not $receiptInRunnerTemp
  ) {
    throw "WINDOWS_SIGNING_SELFTEST_SCOPE_INVALID"
  }

  $selfTestAllowMissingTimestamp = $true
}

$trusted = @(
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
if ($trusted.Count -lt 1) {
  throw "WINDOWS_SIGNING_TRUST_POLICY_MISSING"
}

$pfxBase64 = [Environment]::GetEnvironmentVariable(
  "LEX_WINDOWS_SIGNING_PFX_BASE64",
  "Process"
)
$pfxPassword = [Environment]::GetEnvironmentVariable(
  "LEX_WINDOWS_SIGNING_PFX_PASSWORD",
  "Process"
)
if (
  [string]::IsNullOrWhiteSpace($pfxBase64) -or
  [string]::IsNullOrWhiteSpace($pfxPassword)
) {
  throw "WINDOWS_SIGNING_SECRET_MISSING"
}

try {
  $pfxBytes = [Convert]::FromBase64String($pfxBase64)
} catch {
  throw "WINDOWS_SIGNING_PFX_BASE64_INVALID"
}

$flags =
  [Security.Cryptography.X509Certificates.X509KeyStorageFlags]::EphemeralKeySet -bor
  [Security.Cryptography.X509Certificates.X509KeyStorageFlags]::UserKeySet

try {
  $certificate =
    [Security.Cryptography.X509Certificates.X509Certificate2]::new(
      $pfxBytes,
      $pfxPassword,
      $flags
    )
} catch {
  throw "WINDOWS_SIGNING_PFX_INVALID"
}

try {
  if (-not $certificate.HasPrivateKey) {
    throw "WINDOWS_SIGNING_PRIVATE_KEY_MISSING"
  }

  $certificateThumbprint =
    Normalize-Thumbprint $certificate.Thumbprint

  if ($trusted -notcontains $certificateThumbprint) {
    throw "WINDOWS_SIGNING_CERTIFICATE_NOT_PINNED"
  }

  $signTool = Find-SignTool
  $tempRoot = if ([string]::IsNullOrWhiteSpace($env:RUNNER_TEMP)) {
    [IO.Path]::GetTempPath()
  } else {
    $env:RUNNER_TEMP
  }
  $temporaryPfx = Join-Path $tempRoot (
    "lex-signing-" + [guid]::NewGuid().ToString("N") + ".pfx"
  )

  try {
    [IO.File]::WriteAllBytes(
      $temporaryPfx,
      $pfxBytes
    )

    if ($selfTestAllowMissingTimestamp) {
      & $signTool sign `
        /fd SHA256 `
        /f $temporaryPfx `
        /p $pfxPassword `
        $artifact
    } else {
      & $signTool sign `
        /fd SHA256 `
        /td SHA256 `
        /tr $TimestampUrl `
        /f $temporaryPfx `
        /p $pfxPassword `
        $artifact
    }

    if ($LASTEXITCODE -ne 0) {
      throw "WINDOWS_SIGNTOOL_SIGN_FAILED:$LASTEXITCODE"
    }
  } finally {
    Remove-Item -LiteralPath $temporaryPfx -Force -ErrorAction SilentlyContinue
  }

  & $signTool verify /pa /all /v $artifact
  if ($LASTEXITCODE -ne 0) {
    throw "WINDOWS_SIGNTOOL_VERIFY_FAILED:$LASTEXITCODE"
  }

  $signature =
    Get-AuthenticodeSignature -LiteralPath $artifact
  if (
    $signature.Status -ne "Valid" -or
    $null -eq $signature.SignerCertificate
  ) {
    throw "WINDOWS_AUTHENTICODE_INVALID"
  }

  $actualThumbprint =
    Normalize-Thumbprint $signature.SignerCertificate.Thumbprint
  if ($trusted -notcontains $actualThumbprint) {
    throw "WINDOWS_AUTHENTICODE_SIGNER_NOT_PINNED"
  }

  $hash =
    (Get-FileHash -Algorithm SHA256 -LiteralPath $artifact).Hash.ToLowerInvariant()
  $artifactInfo =
    Get-Item -LiteralPath $artifact

  $payload = [ordered]@{
    schemaVersion = 1
    result = if ($selfTestAllowMissingTimestamp) { "PASS_SELFTEST" } else { "PASS" }
    verification = if ($selfTestAllowMissingTimestamp) {
      "AUTHENTICODE_PINNED_PUBLISHER_SELFTEST_NO_TIMESTAMP"
    } else {
      "AUTHENTICODE_PINNED_PUBLISHER"
    }
    artifact = $artifactInfo.Name
    sha256 = $hash
    bytes = [int64]$artifactInfo.Length
    signer = [ordered]@{
      subject = $signature.SignerCertificate.Subject
      thumbprint = $actualThumbprint
      notBefore = $signature.SignerCertificate.NotBefore.ToUniversalTime().ToString("o")
      notAfter = $signature.SignerCertificate.NotAfter.ToUniversalTime().ToString("o")
    }
    timestamp = [ordered]@{
      required = (-not $selfTestAllowMissingTimestamp)
      server = if ($selfTestAllowMissingTimestamp) { $null } else { $TimestampUrl }
      status = if ($signature.TimeStamperCertificate) { "PRESENT" } else { "MISSING" }
      subject = if ($signature.TimeStamperCertificate) {
        $signature.TimeStamperCertificate.Subject
      } else {
        $null
      }
    }
    manifest = [ordered]@{
      path = [IO.Path]::GetFileName($manifest)
      sha256 = (
        Get-FileHash -Algorithm SHA256 -LiteralPath $manifest
      ).Hash.ToLowerInvariant()
      applicationVersion = [string]$release.applicationVersion
    }
    signedAt = [DateTimeOffset]::UtcNow.ToString("o")
  }

  if (
    -not $selfTestAllowMissingTimestamp -and
    $payload.timestamp.status -ne "PRESENT"
  ) {
    throw "WINDOWS_AUTHENTICODE_TIMESTAMP_MISSING"
  }

  $directory = Split-Path -Parent $receipt
  if ($directory) {
    New-Item -ItemType Directory -Force -Path $directory | Out-Null
  }

  $temporaryReceipt = $receipt + ".tmp"
  [IO.File]::WriteAllText(
    $temporaryReceipt,
    (($payload | ConvertTo-Json -Depth 8) + [Environment]::NewLine),
    [Text.UTF8Encoding]::new($false)
  )
  Move-Item -LiteralPath $temporaryReceipt -Destination $receipt -Force

  Write-Host "Windows artifact signature verification: PASS"
  Write-Host "Signer thumbprint: $actualThumbprint"
  Write-Host "Artifact SHA-256: $hash"
} finally {
  if ($certificate) {
    $certificate.Dispose()
  }
  if ($pfxBytes) {
    [Array]::Clear($pfxBytes, 0, $pfxBytes.Length)
  }
}
