Set-StrictMode -Version Latest

function Normalize-Thumbprint([string]$Value) {
  return ($Value -replace '\s+', '').ToUpperInvariant()
}

function Get-UpdateVerificationMode([object]$Manifest) {
  if ($null -eq $Manifest.applicationUpdate) {
    throw "UPDATE_TRUST_POLICY_INVALID"
  }

  if (
    $Manifest.applicationUpdate.verification -eq
      "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
  ) {
    return "SIGNED_REQUIRED"
  }

  if (
    $Manifest.applicationUpdate.verification -eq
      "SHA256_REQUIRED_SIGNATURE_OPTIONAL" -and
    $Manifest.applicationUpdate.temporaryUnsignedAllowed -eq $true
  ) {
    return "UNSIGNED_ALLOWED"
  }

  throw "UPDATE_TRUST_POLICY_INVALID"
}

function Get-TrustedSignerThumbprints([object]$Manifest) {
  $mode = Get-UpdateVerificationMode $Manifest
  $raw = @(
    $Manifest.applicationUpdate.trustedSignerThumbprints
  )
  $trusted = @(
    $raw |
      ForEach-Object {
        Normalize-Thumbprint ([string]$_)
      } |
      Where-Object {
        $_ -match '^[A-F0-9]{40}$'
      } |
      Select-Object -Unique
  )

  if (
    $mode -eq "SIGNED_REQUIRED" -and
    $trusted.Count -lt 1
  ) {
    throw "UPDATE_TRUST_POLICY_EMPTY"
  }

  return $trusted
}

function ConvertTo-CanonicalProductVersion(
  [string]$Raw
) {
  $normalized = $Raw.Trim()
  if (
    $normalized -match
      '^(\d+)\.(\d+)\.(\d+)\.0$'
  ) {
    $normalized =
      "$($matches[1]).$($matches[2]).$($matches[3])"
  }

  if (
    $normalized -notmatch
      '^\d+\.\d+\.\d+$'
  ) {
    throw "UPDATE_INSTALLER_PRODUCT_VERSION_INVALID:$Raw"
  }

  return ([Version]$normalized).ToString()
}

function Assert-Authenticode(
  [string]$Installer,
  [string[]]$Trusted,
  [string]$ReceiptThumbprint
) {
  $signature =
    Get-AuthenticodeSignature -LiteralPath $Installer
  if (
    $signature.Status -ne 'Valid' -or
    $null -eq $signature.SignerCertificate
  ) {
    throw "UPDATE_SIGNATURE_INVALID:$($signature.Status)"
  }

  $actual =
    Normalize-Thumbprint(
      $signature.SignerCertificate.Thumbprint
    )
  if (
    $Trusted -notcontains $actual
  ) {
    throw "UPDATE_SIGNER_NOT_TRUSTED:$actual"
  }
  if (
    $actual -ne
      (Normalize-Thumbprint $ReceiptThumbprint)
  ) {
    throw "UPDATE_RECEIPT_SIGNER_MISMATCH"
  }

  return $actual
}

function Assert-InstallerProductVersion(
  [string]$Installer,
  [Version]$Expected
) {
  $raw =
    [string](
      Get-Item -LiteralPath $Installer
    ).VersionInfo.ProductVersion
  if (
    [string]::IsNullOrWhiteSpace($raw)
  ) {
    throw "UPDATE_INSTALLER_PRODUCT_VERSION_MISSING"
  }

  $actual =
    ConvertTo-CanonicalProductVersion $raw
  if (
    [Version]$actual -ne $Expected
  ) {
    throw "UPDATE_INSTALLER_PRODUCT_VERSION_MISMATCH:expected=$Expected actual=$actual"
  }

  return $actual
}
