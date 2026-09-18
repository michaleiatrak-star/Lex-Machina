$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

. (Join-Path $PSScriptRoot "app-update-verification.ps1")

function Assert-Equal([object]$Actual, [object]$Expected, [string]$Code) {
  if ($Actual -ne $Expected) {
    throw "$Code expected=$Expected actual=$Actual"
  }
}

function Assert-Throws([scriptblock]$Action, [string]$ExpectedCode) {
  try {
    & $Action
  } catch {
    $message = $_.Exception.Message
    if ($message -like ($ExpectedCode + "*")) {
      return
    }
    throw "UPDATE_POLICY_SELFTEST_WRONG_ERROR expected=$ExpectedCode actual=$message"
  }
  throw "UPDATE_POLICY_SELFTEST_EXPECTED_FAILURE:$ExpectedCode"
}

$unsigned = [pscustomobject]@{
  applicationUpdate = [pscustomobject]@{
    verification = "SHA256_REQUIRED_SIGNATURE_OPTIONAL"
    temporaryUnsignedAllowed = $true
    trustedSignerThumbprints = @()
  }
}

Assert-Equal (Get-UpdateVerificationMode $unsigned) "UNSIGNED_ALLOWED" "UPDATE_POLICY_SELFTEST_UNSIGNED_MODE"
$unsignedTrusted = @(Get-TrustedSignerThumbprints $unsigned)
Assert-Equal $unsignedTrusted.Count 0 "UPDATE_POLICY_SELFTEST_UNSIGNED_EMPTY_TRUST"

$signed = [pscustomobject]@{
  applicationUpdate = [pscustomobject]@{
    verification = "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
    trustedSignerThumbprints = @(
      "aa bb cc dd ee ff 00 11 22 33 44 55 66 77 88 99 aa bb cc dd"
    )
  }
}

Assert-Equal (Get-UpdateVerificationMode $signed) "SIGNED_REQUIRED" "UPDATE_POLICY_SELFTEST_SIGNED_MODE"
$signedTrusted = @(Get-TrustedSignerThumbprints $signed)
Assert-Equal $signedTrusted.Count 1 "UPDATE_POLICY_SELFTEST_SIGNED_TRUST_COUNT"
Assert-Equal $signedTrusted[0] "AABBCCDDEEFF00112233445566778899AABBCCDD" "UPDATE_POLICY_SELFTEST_SIGNED_TRUST_VALUE"

$missingSignedTrust = [pscustomobject]@{
  applicationUpdate = [pscustomobject]@{
    verification = "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
    trustedSignerThumbprints = @()
  }
}
Assert-Throws { [void](Get-TrustedSignerThumbprints $missingSignedTrust) } "UPDATE_TRUST_POLICY_EMPTY"

$invalidTemporary = [pscustomobject]@{
  applicationUpdate = [pscustomobject]@{
    verification = "SHA256_REQUIRED_SIGNATURE_OPTIONAL"
    temporaryUnsignedAllowed = $false
    trustedSignerThumbprints = @()
  }
}
Assert-Throws { [void](Get-UpdateVerificationMode $invalidTemporary) } "UPDATE_TRUST_POLICY_INVALID"

Assert-Equal (ConvertTo-CanonicalProductVersion "0.1.4") "0.1.4" "UPDATE_POLICY_SELFTEST_VERSION_SEMVER"
Assert-Equal (ConvertTo-CanonicalProductVersion "0.1.4.0") "0.1.4" "UPDATE_POLICY_SELFTEST_VERSION_WINDOWS"
Assert-Throws { [void](ConvertTo-CanonicalProductVersion "0.1.4.7") } "UPDATE_INSTALLER_PRODUCT_VERSION_INVALID"
Assert-Throws { [void](ConvertTo-CanonicalProductVersion "v0.1.4") } "UPDATE_INSTALLER_PRODUCT_VERSION_INVALID"

Write-Host "G39F application update verification policy self-test: PASS"
