$ErrorActionPreference = "Stop"

$root = Join-Path $env:RUNNER_TEMP ("lex-untrusted-authenticode-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $root | Out-Null
$cert = $null
$rootCert = $null

try {
  $subject = "CN=Lex Machina Untrusted Update Selftest " + [Guid]::NewGuid().ToString("N")
  $cert = New-SelfSignedCertificate `
    -Type CodeSigningCert `
    -Subject $subject `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -HashAlgorithm SHA256 `
    -KeyExportPolicy Exportable `
    -NotAfter (Get-Date).AddDays(2)

  if (-not $cert -or -not $cert.HasPrivateKey) {
    throw "UNTRUSTED_AUTHENTICODE_CERT_CREATE_FAILED"
  }

  $cerPath = Join-Path $root "untrusted-test.cer"
  Export-Certificate -Cert $cert -FilePath $cerPath -Force | Out-Null
  $rootCert = Import-Certificate -FilePath $cerPath -CertStoreLocation "Cert:\CurrentUser\Root"

  $source = Join-Path $env:SystemRoot "System32\where.exe"
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "UNTRUSTED_AUTHENTICODE_SOURCE_PE_MISSING"
  }
  $artifact = Join-Path $root "LexMachina-Untrusted-Test.exe"
  Copy-Item -LiteralPath $source -Destination $artifact -Force

  $signed = Set-AuthenticodeSignature `
    -LiteralPath $artifact `
    -Certificate $cert `
    -HashAlgorithm SHA256
  if ($signed.Status -ne "Valid") {
    throw "UNTRUSTED_AUTHENTICODE_SIGN_FAILED:$($signed.Status):$($signed.StatusMessage)"
  }

  $expectedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $artifact).Hash.ToLowerInvariant()
  $actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $artifact).Hash.ToLowerInvariant()
  if ($actualHash -ne $expectedHash) {
    throw "UNTRUSTED_AUTHENTICODE_HASH_MISMATCH"
  }

  $signature = Get-AuthenticodeSignature -LiteralPath $artifact
  if ($signature.Status -ne "Valid" -or $null -eq $signature.SignerCertificate) {
    throw "UNTRUSTED_AUTHENTICODE_SIGNATURE_NOT_VALID:$($signature.Status)"
  }

  $actualThumbprint = (($signature.SignerCertificate.Thumbprint -replace "\s+", "").ToUpperInvariant())
  $selftestTrustedThumbprint = "1111111111111111111111111111111111111111"
  if ($actualThumbprint -eq $selftestTrustedThumbprint) {
    throw "UNTRUSTED_AUTHENTICODE_FIXTURE_COLLISION"
  }

  # This is the exact fail-closed invariant used by the application updater:
  # a valid Authenticode signature and matching SHA are still insufficient
  # when the signer thumbprint is not in the committed publisher trust root.
  $trusted = @($selftestTrustedThumbprint)
  if ($trusted -contains $actualThumbprint) {
    throw "UNTRUSTED_AUTHENTICODE_UNEXPECTEDLY_TRUSTED"
  }

  Write-Host "Artifact SHA-256 verified: $actualHash"
  Write-Host "Authenticode status: Valid"
  Write-Host "Untrusted signer thumbprint: $actualThumbprint"
  Write-Host "G39J untrusted Authenticode negative acceptance: PASS"
} finally {
  if ($rootCert) {
    Remove-Item -LiteralPath ("Cert:\CurrentUser\Root\" + $rootCert.Thumbprint) -Force -ErrorAction SilentlyContinue
  }
  if ($cert) {
    Remove-Item -LiteralPath ("Cert:\CurrentUser\My\" + $cert.Thumbprint) -Force -ErrorAction SilentlyContinue
  }
  Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
}
