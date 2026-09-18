param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$ArtifactPath
)

$ErrorActionPreference = "Stop"

$artifact = (Resolve-Path -LiteralPath $ArtifactPath).Path
$manifestOverride = [Environment]::GetEnvironmentVariable(
  "LEX_SIGNING_MANIFEST_PATH",
  "Process"
)
$manifest = if ([string]::IsNullOrWhiteSpace($manifestOverride)) {
  Join-Path $PSScriptRoot "windows-release-source.json"
} else {
  [IO.Path]::GetFullPath($manifestOverride)
}
$signer = Join-Path $PSScriptRoot "sign-windows-artifact.ps1"

if (-not (Test-Path -LiteralPath $manifest -PathType Leaf)) {
  throw "TAURI_SIGNING_MANIFEST_MISSING"
}
if (-not (Test-Path -LiteralPath $signer -PathType Leaf)) {
  throw "TAURI_SIGNING_SCRIPT_MISSING"
}

$receiptRoot = [Environment]::GetEnvironmentVariable(
  "LEX_SIGNING_RECEIPT_DIR",
  "Process"
)
if ([string]::IsNullOrWhiteSpace($receiptRoot)) {
  $receiptRoot = Join-Path ([IO.Path]::GetTempPath()) "LexMachinaSigningReceipts"
}
$receiptRoot = [IO.Path]::GetFullPath($receiptRoot)
New-Item -ItemType Directory -Force -Path $receiptRoot | Out-Null

$pathBytes = [Text.Encoding]::UTF8.GetBytes($artifact.ToLowerInvariant())
$sha = [Security.Cryptography.SHA256]::Create()
try {
  $pathDigest = ([BitConverter]::ToString($sha.ComputeHash($pathBytes))).Replace("-", "").ToLowerInvariant()
} finally {
  $sha.Dispose()
  [Array]::Clear($pathBytes, 0, $pathBytes.Length)
}

$leaf = [IO.Path]::GetFileName($artifact)
$safeLeaf = ($leaf -replace '[^A-Za-z0-9._-]', '_')
$receipt = Join-Path $receiptRoot (
  "$safeLeaf-$($pathDigest.Substring(0, 16)).json"
)

$arguments = @(
  "-ArtifactPath",
  $artifact,
  "-ManifestPath",
  $manifest,
  "-ReceiptPath",
  $receipt
)
& $signer @arguments
if ($LASTEXITCODE -ne 0) {
  throw "TAURI_SIGNING_FAILED:$LASTEXITCODE"
}

Write-Host "Tauri signing receipt: $receipt"
