param(
  [Parameter(Mandatory=$true)][string]$InstallerPath,
  [Parameter(Mandatory=$true)][string]$RuntimeBundlePath,
  [Parameter(Mandatory=$true)][string]$OutputPath,
  [string]$ReceiptPath,
  [string]$ComponentLockPath,
  [string]$IconPath
)

$ErrorActionPreference = "Stop"
$installer = (Resolve-Path -LiteralPath $InstallerPath).Path
$runtimeBundle = (Resolve-Path -LiteralPath $RuntimeBundlePath).Path
$source = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "offline-selfextract/OfflineSelfExtractor.cs")).Path
if (-not $IconPath) {
  $IconPath = Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/icon.ico"
}
$icon = (Resolve-Path -LiteralPath $IconPath).Path
$output = [IO.Path]::GetFullPath($OutputPath)
$outputDir = Split-Path -Parent $output
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
Remove-Item -LiteralPath $output -Force -ErrorAction SilentlyContinue

$compiler = Join-Path $env:WINDIR "Microsoft.NET/Framework64/v4.0.30319/csc.exe"
if (-not (Test-Path -LiteralPath $compiler -PathType Leaf)) {
  $compiler = Join-Path $env:WINDIR "Microsoft.NET/Framework/v4.0.30319/csc.exe"
}
if (-not (Test-Path -LiteralPath $compiler -PathType Leaf)) {
  throw "OFFLINE_STANDALONE_CSC_MISSING"
}

$stub = Join-Path $env:RUNNER_TEMP ("LexMachinaOfflineStub-" + [Guid]::NewGuid().ToString("N") + ".exe")
$stage = Join-Path $env:RUNNER_TEMP ("LexMachinaOfflinePayload-" + [Guid]::NewGuid().ToString("N"))
$payload = Join-Path $env:RUNNER_TEMP ("LexMachinaOfflinePayload-" + [Guid]::NewGuid().ToString("N") + ".zip")
New-Item -ItemType Directory -Force -Path $stage | Out-Null

try {
  Copy-Item -LiteralPath $installer -Destination (Join-Path $stage "LexMachina-Offline-Setup.exe")
  Copy-Item -LiteralPath $runtimeBundle -Destination (Join-Path $stage "LexMachina-Offline-Runtime.zip")
  if ($ReceiptPath) {
    $receipt = (Resolve-Path -LiteralPath $ReceiptPath).Path
    Copy-Item -LiteralPath $receipt -Destination (Join-Path $stage "SHA256-OFFLINE.txt")
  }
  if ($ComponentLockPath) {
    $lock = (Resolve-Path -LiteralPath $ComponentLockPath).Path
    Copy-Item -LiteralPath $lock -Destination (Join-Path $stage "component-lock-offline.json")
  }

  & $compiler /nologo /target:winexe /optimize+ /platform:x64 `
    "/out:$stub" `
    "/win32icon:$icon" `
    /reference:System.dll `
    /reference:System.Core.dll `
    /reference:System.IO.Compression.dll `
    /reference:System.IO.Compression.FileSystem.dll `
    /reference:System.Windows.Forms.dll `
    $source
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $stub -PathType Leaf)) {
    throw "OFFLINE_STANDALONE_STUB_COMPILE_FAILED:$LASTEXITCODE"
  }

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [IO.Compression.ZipFile]::CreateFromDirectory(
    $stage,
    $payload,
    [IO.Compression.CompressionLevel]::NoCompression,
    $false
  )

  $payloadInfo = Get-Item -LiteralPath $payload
  $payloadHashHex = (Get-FileHash -Algorithm SHA256 -LiteralPath $payload).Hash.ToLowerInvariant()
  $payloadHash = New-Object byte[] 32
  for ($i = 0; $i -lt 32; $i++) {
    $payloadHash[$i] = [Convert]::ToByte($payloadHashHex.Substring($i * 2, 2), 16)
  }

  $stubInfo = Get-Item -LiteralPath $stub
  $outputStream = [IO.File]::Open($output, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
  try {
    $stubStream = [IO.File]::OpenRead($stub)
    try { $stubStream.CopyTo($outputStream) } finally { $stubStream.Dispose() }
    $payloadOffset = $outputStream.Position
    $payloadStream = [IO.File]::OpenRead($payload)
    try { $payloadStream.CopyTo($outputStream) } finally { $payloadStream.Dispose() }

    $writer = [IO.BinaryWriter]::new($outputStream, [Text.Encoding]::ASCII, $true)
    try {
      $writer.Write([Text.Encoding]::ASCII.GetBytes("LEXOFF01"))
      $writer.Write([int64]$payloadOffset)
      $writer.Write([int64]$payloadInfo.Length)
      $writer.Write($payloadHash)
      $writer.Flush()
    } finally { $writer.Dispose() }
  } finally { $outputStream.Dispose() }

  $outInfo = Get-Item -LiteralPath $output
  $outHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $output).Hash.ToLowerInvariant()
  Write-Host "OFFLINE_STANDALONE_READY:$output"
  Write-Host "OFFLINE_STANDALONE_ICON=$icon"
  Write-Host "OFFLINE_STANDALONE_BYTES=$($outInfo.Length)"
  Write-Host "OFFLINE_STANDALONE_SHA256=$outHash"
  Write-Host "OFFLINE_STANDALONE_PAYLOAD_SHA256=$payloadHashHex"
} finally {
  Remove-Item -LiteralPath $stub -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $payload -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
}
