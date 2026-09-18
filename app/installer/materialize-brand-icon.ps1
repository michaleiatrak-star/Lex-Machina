param(
  [string]$SourceImagePath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/lex-machina-brand-source.png"
  ),
  [string]$OutputIconPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/icon.ico"
  )
)

$ErrorActionPreference = "Stop"
# Permanent branding rule: every Windows EXE/NSIS icon is generated only from this pinned canonical source.
$expectedSourceSha256 = "6693484ed95835e4b51b42e5eea854a02a4670170d9f8c50c8cd209e84026616"
$sizes = @(16, 24, 32, 48, 64, 128, 256)

function Get-Sha256Hex([byte[]]$Bytes) {
  $sha = [Security.Cryptography.SHA256]::Create()
  try {
    return ([BitConverter]::ToString($sha.ComputeHash($Bytes))).Replace("-", "").ToLowerInvariant()
  } finally {
    $sha.Dispose()
  }
}

$sourceFile = (Resolve-Path -LiteralPath $SourceImagePath).Path
$sourceBytes = [IO.File]::ReadAllBytes($sourceFile)
$actualSourceSha256 = Get-Sha256Hex $sourceBytes
if ($actualSourceSha256 -ne $expectedSourceSha256) {
  throw "LEX_BRAND_SOURCE_HASH_MISMATCH expected=$expectedSourceSha256 actual=$actualSourceSha256"
}

Add-Type -AssemblyName PresentationCore
$sourceStream = [IO.MemoryStream]::new($sourceBytes, $false)
$frames = [Collections.Generic.List[byte[]]]::new()
try {
  $decoder = [System.Windows.Media.Imaging.PngBitmapDecoder]::new(
    $sourceStream,
    [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat,
    [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
  )
  if ($decoder.Frames.Count -ne 1) {
    throw "LEX_BRAND_SOURCE_FRAME_COUNT_INVALID:$($decoder.Frames.Count)"
  }
  $sourceFrame = $decoder.Frames[0]
  if ($sourceFrame.PixelWidth -ne 256 -or $sourceFrame.PixelHeight -ne 256) {
    throw "LEX_BRAND_SOURCE_DIMENSIONS_INVALID:$($sourceFrame.PixelWidth)x$($sourceFrame.PixelHeight)"
  }

  foreach ($size in $sizes) {
    $scaleX = [double]$size / [double]$sourceFrame.PixelWidth
    $scaleY = [double]$size / [double]$sourceFrame.PixelHeight
    $transform = [System.Windows.Media.ScaleTransform]::new($scaleX, $scaleY)
    $resized = [System.Windows.Media.Imaging.TransformedBitmap]::new(
      $sourceFrame,
      $transform
    )
    $encoder = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
    $encoder.Frames.Add(
      [System.Windows.Media.Imaging.BitmapFrame]::Create($resized)
    )
    $frameStream = [IO.MemoryStream]::new()
    try {
      $encoder.Save($frameStream)
      $frames.Add($frameStream.ToArray())
    } finally {
      $frameStream.Dispose()
    }
  }
} finally {
  $sourceStream.Dispose()
}

$output = [IO.Path]::GetFullPath($OutputIconPath)
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $output) | Out-Null
$temp = $output + ".tmp"
$stream = [IO.File]::Open($temp, [IO.FileMode]::Create, [IO.FileAccess]::Write, [IO.FileShare]::None)
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
  foreach ($frame in $frames) { $writer.Write($frame) }
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
