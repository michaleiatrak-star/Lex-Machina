param(
  [string]$IconPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/icon.ico"
  ),
  [string]$PartsDirectory = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/generated-branding"
  )
)

$ErrorActionPreference = "Stop"

$expectedSha256 = "0224a0a48b3672fe3fb5eee99cda10190da81448bacc76c7f7a7ef2afeb1bb47"
$expectedBytes = 20469
$expectedParts = 7

if (-not (Test-Path -LiteralPath $PartsDirectory -PathType Container)) {
  throw "WINDOWS_BRANDING_SOURCE_DIRECTORY_MISSING:$PartsDirectory"
}

$parts = @(
  Get-ChildItem -LiteralPath $PartsDirectory -File -Filter "icon.b64.part*" |
    Sort-Object Name
)
if ($parts.Count -ne $expectedParts) {
  throw "WINDOWS_BRANDING_SOURCE_PARTS_INVALID:expected=$expectedParts actual=$($parts.Count)"
}

$encoded = (
  $parts |
    ForEach-Object {
      (Get-Content -Raw -LiteralPath $_.FullName).Trim()
    }
) -join ""

try {
  $bytes = [Convert]::FromBase64String($encoded)
} catch {
  throw "WINDOWS_BRANDING_SOURCE_BASE64_INVALID"
}

if ($bytes.Length -ne $expectedBytes) {
  throw "WINDOWS_BRANDING_SOURCE_SIZE_INVALID:expected=$expectedBytes actual=$($bytes.Length)"
}
if (
  $bytes.Length -lt 6 -or
  $bytes[0] -ne 0 -or
  $bytes[1] -ne 0 -or
  $bytes[2] -ne 1 -or
  $bytes[3] -ne 0
) {
  throw "WINDOWS_BRANDING_SOURCE_ICO_HEADER_INVALID"
}

$resolvedIcon = [IO.Path]::GetFullPath($IconPath)
$parent = Split-Path -Parent $resolvedIcon
New-Item -ItemType Directory -Force -Path $parent | Out-Null
[IO.File]::WriteAllBytes($resolvedIcon, $bytes)

$actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $resolvedIcon).Hash.ToLowerInvariant()
if ($actual -ne $expectedSha256) {
  Remove-Item -LiteralPath $resolvedIcon -Force -ErrorAction SilentlyContinue
  throw "WINDOWS_BRANDING_SOURCE_HASH_MISMATCH:expected=$expectedSha256 actual=$actual"
}

Write-Host "WINDOWS_BRANDING_SOURCE_READY:$resolvedIcon"
Write-Host "WINDOWS_BRANDING_SOURCE_SHA256=$actual"
