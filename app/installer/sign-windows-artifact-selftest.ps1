$ErrorActionPreference = "Stop"

$root = Join-Path $env:RUNNER_TEMP ("lex-sign-selftest-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $root | Out-Null

try {
  $artifact = Join-Path $root "LexMachina-Test.exe"
  [IO.File]::WriteAllBytes(
    $artifact,
    [byte[]](0x4d, 0x5a, 0x00, 0x00)
  )

  $receipt = Join-Path $root "receipt.json"
  $manifest = Join-Path $root "release-source.json"

  function Invoke-ExpectedFailure([string]$ExpectedCode) {
    $arguments = @(
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      (Join-Path $PSScriptRoot "sign-windows-artifact.ps1"),
      "-ArtifactPath",
      $artifact,
      "-ManifestPath",
      $manifest,
      "-ReceiptPath",
      $receipt
    )

    $output = & powershell.exe @arguments 2>&1

    if ($LASTEXITCODE -eq 0) {
      throw "SIGNING_SELFTEST_UNEXPECTED_SUCCESS:$ExpectedCode"
    }

    $joined = ($output | Out-String)
    if ($joined -notmatch [regex]::Escape($ExpectedCode)) {
      throw "SIGNING_SELFTEST_WRONG_FAILURE expected=$ExpectedCode output=$joined"
    }

    Write-Host "Expected failure observed: $ExpectedCode"
  }

  [IO.File]::WriteAllText(
    $manifest,
    (@{
      schemaVersion = 4
      applicationVersion = "0.0.0-test"
      applicationUpdate = @{
        verification = "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
        trustedSignerThumbprints = @()
      }
    } | ConvertTo-Json -Depth 5),
    [Text.UTF8Encoding]::new($false)
  )

  Invoke-ExpectedFailure "WINDOWS_SIGNING_TRUST_POLICY_MISSING"

  [IO.File]::WriteAllText(
    $manifest,
    (@{
      schemaVersion = 4
      applicationVersion = "0.0.0-test"
      applicationUpdate = @{
        verification = "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
        trustedSignerThumbprints = @(
          "1111111111111111111111111111111111111111"
        )
      }
    } | ConvertTo-Json -Depth 5),
    [Text.UTF8Encoding]::new($false)
  )

  Remove-Item Env:LEX_WINDOWS_SIGNING_PFX_BASE64 -ErrorAction SilentlyContinue
  Remove-Item Env:LEX_WINDOWS_SIGNING_PFX_PASSWORD -ErrorAction SilentlyContinue

  Invoke-ExpectedFailure "WINDOWS_SIGNING_SECRET_MISSING"

  if (Test-Path -LiteralPath $receipt) {
    throw "SIGNING_SELFTEST_RECEIPT_MUST_NOT_EXIST"
  }

  Write-Host "G39J Authenticode fail-closed self-test: PASS"

  $source = Join-Path $root "Program.cs"
  $positiveArtifact = Join-Path $root "LexMachina-Signing-Positive.exe"
  [IO.File]::WriteAllText(
    $source,
    "using System; internal static class Program { [STAThread] private static void Main() { } }",
    [Text.UTF8Encoding]::new($false)
  )

  $compiler = Join-Path $env:WINDIR "Microsoft.NET\Framework64\v4.0.30319\csc.exe"
  if (-not (Test-Path -LiteralPath $compiler -PathType Leaf)) {
    $compiler = Join-Path $env:WINDIR "Microsoft.NET\Framework\v4.0.30319\csc.exe"
  }
  if (-not (Test-Path -LiteralPath $compiler -PathType Leaf)) {
    throw "SIGNING_SELFTEST_CSC_MISSING"
  }

  & $compiler /nologo /target:winexe /optimize+ "/out:$positiveArtifact" $source
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $positiveArtifact -PathType Leaf)) {
    throw "SIGNING_SELFTEST_PE_BUILD_FAILED:$LASTEXITCODE"
  }

  $testCertificate = $null
  $rootCertificatePath = $null
  $publisherCertificatePath = $null
  try {
    $testCertificate = New-SelfSignedCertificate `
      -Type CodeSigningCert `
      -Subject "CN=Lex Machina CI Signing Test" `
      -CertStoreLocation "Cert:\CurrentUser\My" `
      -KeyExportPolicy Exportable `
      -KeyAlgorithm RSA `
      -KeyLength 2048 `
      -HashAlgorithm SHA256 `
      -NotAfter (Get-Date).AddDays(2)

    if (-not $testCertificate -or -not $testCertificate.HasPrivateKey) {
      throw "SIGNING_SELFTEST_CERTIFICATE_CREATE_FAILED"
    }

    $thumbprint = (($testCertificate.Thumbprint -replace "\s+", "").ToUpperInvariant())
    $cerPath = Join-Path $root "test-signing.cer"
    Export-Certificate -Cert $testCertificate -FilePath $cerPath | Out-Null

    $rootImport = Import-Certificate -FilePath $cerPath -CertStoreLocation "Cert:\CurrentUser\Root"
    $publisherImport = Import-Certificate -FilePath $cerPath -CertStoreLocation "Cert:\CurrentUser\TrustedPublisher"
    $rootCertificatePath = "Cert:\CurrentUser\Root\$thumbprint"
    $publisherCertificatePath = "Cert:\CurrentUser\TrustedPublisher\$thumbprint"

    $pfxPath = Join-Path $root "test-signing.pfx"
    $plainPassword = "LexMachina-CI-" + [Guid]::NewGuid().ToString("N")
    $securePassword = ConvertTo-SecureString $plainPassword -AsPlainText -Force
    Export-PfxCertificate -Cert $testCertificate -FilePath $pfxPath -Password $securePassword | Out-Null

    [IO.File]::WriteAllText(
      $manifest,
      (@{
        schemaVersion = 4
        applicationVersion = "0.0.0-test"
        applicationUpdate = @{
          verification = "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
          trustedSignerThumbprints = @($thumbprint)
        }
      } | ConvertTo-Json -Depth 5),
      [Text.UTF8Encoding]::new($false)
    )

    $env:LEX_WINDOWS_SIGNING_PFX_BASE64 = [Convert]::ToBase64String(
      [IO.File]::ReadAllBytes($pfxPath)
    )
    $env:LEX_WINDOWS_SIGNING_PFX_PASSWORD = $plainPassword
    $env:LEX_SIGNING_MANIFEST_PATH = $manifest
    $positiveReceiptDir = Join-Path $root "positive-receipts"
    $env:LEX_SIGNING_RECEIPT_DIR = $positiveReceiptDir

    & (Join-Path $PSScriptRoot "tauri-sign-command.ps1") $positiveArtifact

    $signature = Get-AuthenticodeSignature -LiteralPath $positiveArtifact
    if ($signature.Status -ne "Valid") {
      throw "SIGNING_SELFTEST_POSITIVE_SIGNATURE_INVALID:$($signature.Status)"
    }
    $actualThumbprint = (($signature.SignerCertificate.Thumbprint -replace "\s+", "").ToUpperInvariant())
    if ($actualThumbprint -ne $thumbprint) {
      throw "SIGNING_SELFTEST_POSITIVE_SIGNER_MISMATCH"
    }
    if ($null -eq $signature.TimeStamperCertificate) {
      throw "SIGNING_SELFTEST_POSITIVE_TIMESTAMP_MISSING"
    }

    $receipts = @(
      Get-ChildItem -LiteralPath $positiveReceiptDir -File -Filter "*.json"
    )
    if ($receipts.Count -ne 1) {
      throw "SIGNING_SELFTEST_POSITIVE_RECEIPT_COUNT:$($receipts.Count)"
    }
    $positiveReceipt = Get-Content -Raw -LiteralPath $receipts[0].FullName | ConvertFrom-Json
    if (
      $positiveReceipt.result -ne "PASS" -or
      $positiveReceipt.signer.thumbprint -ne $thumbprint -or
      $positiveReceipt.timestamp.status -ne "PRESENT"
    ) {
      throw "SIGNING_SELFTEST_POSITIVE_RECEIPT_INVALID"
    }

    Write-Host "G39J Authenticode positive self-test: PASS signer=$thumbprint"
  } finally {
    foreach ($name in @(
      "LEX_WINDOWS_SIGNING_PFX_BASE64",
      "LEX_WINDOWS_SIGNING_PFX_PASSWORD",
      "LEX_SIGNING_MANIFEST_PATH",
      "LEX_SIGNING_RECEIPT_DIR"
    )) {
      Remove-Item -Path ("Env:" + $name) -ErrorAction SilentlyContinue
    }
    if ($rootCertificatePath) {
      Remove-Item -LiteralPath $rootCertificatePath -Force -ErrorAction SilentlyContinue
    }
    if ($publisherCertificatePath) {
      Remove-Item -LiteralPath $publisherCertificatePath -Force -ErrorAction SilentlyContinue
    }
    if ($testCertificate) {
      Remove-Item -LiteralPath ("Cert:\CurrentUser\My\" + $testCertificate.Thumbprint) -Force -ErrorAction SilentlyContinue
    }
  }
} finally {
  Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
}

# GitHub's pwsh wrapper propagates the last native-process exit code even when
# that failure was intentionally asserted above. Reaching this line means every
# expected fail-closed condition matched, so make the harness outcome explicit.
exit 0
