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
} finally {
  Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
}

# GitHub's pwsh wrapper propagates the last native-process exit code even when
# that failure was intentionally asserted above. Reaching this line means every
# expected fail-closed condition matched, so make the harness outcome explicit.
exit 0
