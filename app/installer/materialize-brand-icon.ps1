param(
  [string]$SourceImagePath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/lex-machina-brand-source.jpg"
  ),
  [string]$OutputIconPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/icon.ico"
  )
)

$ErrorActionPreference = "Stop"
# Permanent branding rule: every Windows EXE/NSIS icon is generated only from this pinned canonical source.
$expectedSourceSha256 = "d9749565c559ce04dc173479466088d9f3c3d3807a4d0f06126130d38d3036db"
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

Add-Type -AssemblyName System.Drawing
$sourceStream = [IO.MemoryStream]::new($sourceBytes, $false)
$sourceImage = $null
$frames = [Collections.Generic.List[byte[]]]::new()
try {
  $sourceImage = [Drawing.Image]::FromStream($sourceStream, $true, $true)
  if ($sourceImage.Width -ne 256 -or $sourceImage.Height -ne 256) {
    throw "LEX_BRAND_SOURCE_DIMENSIONS_INVALID:$($sourceImage.Width)x$($sourceImage.Height)"
  }

  foreach ($size in $sizes) {
    $bitmap = [Drawing.Bitmap]::new($size, $size, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    $frameStream = [IO.MemoryStream]::new()
    try {
      $graphics.Clear([Drawing.Color]::Transparent)
      $graphics.CompositingMode = [Drawing.Drawing2D.CompositingMode]::SourceOver
      $graphics.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.DrawImage($sourceImage, [Drawing.Rectangle]::new(0, 0, $size, $size))
      $bitmap.Save($frameStream, [Drawing.Imaging.ImageFormat]::Png)
      $frames.Add($frameStream.ToArray())
    } finally {
      $frameStream.Dispose()
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
} finally {
  if ($sourceImage) { $sourceImage.Dispose() }
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
