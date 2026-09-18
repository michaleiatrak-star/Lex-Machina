param(
  [string]$SourceImagePath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/lex-machina-brand-source.png"
  ),
  [string]$OutputIconPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/icon.ico"
  )
)

$ErrorActionPreference = "Stop"
$expectedSourceSha256 = "572eff0901365285cbeee54f822cdb6fd969cd281cdc1099568ba4332cd4f61a"
$sizes = @(16, 24, 32, 48, 64, 128, 256)

function Get-Sha256Hex([byte[]]$Bytes) {
  $sha = [Security.Cryptography.SHA256]::Create()
  try {
    return ([BitConverter]::ToString($sha.ComputeHash($Bytes))).Replace("-", "").ToLowerInvariant()
  } finally {
    $sha.Dispose()
  }
}

function Read-U32BigEndian([byte[]]$Data, [int]$Offset) {
  return (
    ([uint32]$Data[$Offset] -shl 24) -bor
    ([uint32]$Data[$Offset + 1] -shl 16) -bor
    ([uint32]$Data[$Offset + 2] -shl 8) -bor
    ([uint32]$Data[$Offset + 3])
  )
}

$sourceFile = (Resolve-Path -LiteralPath $SourceImagePath).Path
$sourceBytes = [IO.File]::ReadAllBytes($sourceFile)
$actualSourceSha256 = Get-Sha256Hex $sourceBytes
if ($actualSourceSha256 -ne $expectedSourceSha256) {
  throw "LEX_BRAND_SOURCE_HASH_MISMATCH expected=$expectedSourceSha256 actual=$actualSourceSha256"
}

$pngSignature = [byte[]](0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A)
if ($sourceBytes.Length -lt 24) {
  throw "LEX_BRAND_SOURCE_TOO_SMALL"
}
for ($i = 0; $i -lt $pngSignature.Length; $i++) {
  if ($sourceBytes[$i] -ne $pngSignature[$i]) {
    throw "LEX_BRAND_SOURCE_NOT_PNG"
  }
}
$sourceWidth = [int](Read-U32BigEndian $sourceBytes 16)
$sourceHeight = [int](Read-U32BigEndian $sourceBytes 20)
if ($sourceWidth -ne 256 -or $sourceHeight -ne 256) {
  throw "LEX_BRAND_SOURCE_DIMENSIONS_INVALID width=$sourceWidth height=$sourceHeight"
}

$frames = [Collections.Generic.List[byte[]]]::new()
$decoderMode = "WPF_RESAMPLED"

try {
  Add-Type -AssemblyName WindowsBase
  Add-Type -AssemblyName PresentationCore

  $sourceStream = [IO.MemoryStream]::new($sourceBytes, $false)
  try {
    $decoder = [Windows.Media.Imaging.PngBitmapDecoder]::new(
      $sourceStream,
      [Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat,
      [Windows.Media.Imaging.BitmapCacheOption]::OnLoad
    )
    if ($decoder.Frames.Count -lt 1) {
      throw "LEX_BRAND_WPF_FRAME_MISSING"
    }
    $sourceBitmap = $decoder.Frames[0]
    if ($sourceBitmap.PixelWidth -ne 256 -or $sourceBitmap.PixelHeight -ne 256) {
      throw "LEX_BRAND_WPF_DIMENSIONS_INVALID width=$($sourceBitmap.PixelWidth) height=$($sourceBitmap.PixelHeight)"
    }

    foreach ($size in $sizes) {
      $scale = [double]$size / 256.0
      $bitmap = if ($size -eq 256) {
        $sourceBitmap
      } else {
        [Windows.Media.Imaging.TransformedBitmap]::new(
          $sourceBitmap,
          [Windows.Media.ScaleTransform]::new($scale, $scale)
        )
      }

      $encoder = [Windows.Media.Imaging.PngBitmapEncoder]::new()
      $encoder.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
      $frameStream = [IO.MemoryStream]::new()
      try {
        $encoder.Save($frameStream)
        $frameBytes = $frameStream.ToArray()
        if ($frameBytes.Length -lt 24) {
          throw "LEX_BRAND_WPF_FRAME_TOO_SMALL:$size"
        }
        $frames.Add($frameBytes)
      } finally {
        $frameStream.Dispose()
      }
    }
  } finally {
    $sourceStream.Dispose()
  }
} catch {
  # ICO supports PNG-compressed frames. If a runner cannot initialize WPF,
  # preserve the canonical verified source as the payload for each nominal
  # size. Windows/NSIS can scale the 256px PNG while the ICO directory remains
  # deterministic and complete.
  Write-Warning "WPF icon resampling unavailable; using canonical PNG payload fallback: $($_.Exception.Message)"
  $decoderMode = "CANONICAL_PNG_FALLBACK"
  $frames.Clear()
  foreach ($size in $sizes) {
    $copy = [byte[]]::new($sourceBytes.Length)
    [Array]::Copy($sourceBytes, $copy, $sourceBytes.Length)
    $frames.Add($copy)
  }
}

if ($frames.Count -ne $sizes.Count) {
  throw "LEX_BRAND_FRAME_COUNT_INVALID:$($frames.Count)"
}

$output = [IO.Path]::GetFullPath($OutputIconPath)
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $output) | Out-Null
$temp = $output + ".tmp"
Remove-Item -LiteralPath $temp -Force -ErrorAction SilentlyContinue

$stream = [IO.File]::Open($temp, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
$writer = [IO.BinaryWriter]::new($stream)
try {
  $writer.Write([UInt16]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]$frames.Count)
  $dataOffset = 6 + (16 * $frames.Count)

  for ($i = 0; $i -lt $frames.Count; $i++) {
    $size = [int]$sizes[$i]
    $frame = $frames[$i]
    $dimension = if ($size -eq 256) { [byte]0 } else { [byte]$size }

    $writer.Write($dimension)
    $writer.Write($dimension)
    $writer.Write([byte]0)
    $writer.Write([byte]0)
    $writer.Write([UInt16]1)
    $writer.Write([UInt16]32)
    $writer.Write([UInt32]$frame.Length)
    $writer.Write([UInt32]$dataOffset)
    $dataOffset += $frame.Length
  }

  foreach ($frame in $frames) {
    $writer.Write($frame)
  }
} finally {
  $writer.Dispose()
  $stream.Dispose()
}

Move-Item -LiteralPath $temp -Destination $output -Force
$iconBytes = [IO.File]::ReadAllBytes($output)

Write-Host "LEX_BRAND_ICON_READY:$output"
Write-Host "LEX_BRAND_SOURCE_SHA256:$actualSourceSha256"
Write-Host "LEX_BRAND_ICON_SHA256:$(Get-Sha256Hex $iconBytes)"
Write-Host "LEX_BRAND_ICON_SIZES:$($sizes -join ',')"
Write-Host "LEX_BRAND_ICON_MODE:$decoderMode"
