$ErrorActionPreference = "Stop"

$nsisBiVersion = "3.10.3"
$nsisBiUrl = "https://github.com/SoundSafari/NSISBI-ElectronBuilder/releases/download/1.0.0/nsisbi-electronbuilder-3.10.3.7z"
$nsisBiSha512Base64 = "WRmZUsACjIc2s7bvsFGFRofK31hfS7riPlcfI1V9uFB2Q8s7tidgI/9U16+X0I9X2ZhNxi8N7Z3gKvm6ojvLvg=="
$tauriUtilsUrl = "https://github.com/tauri-apps/nsis-tauri-utils/releases/download/nsis_tauri_utils-v0.5.3/nsis_tauri_utils.dll"
$tauriUtilsSha1 = "75197fee3c6a814fe035788d1c34ead39349b860"

if (-not $env:LOCALAPPDATA) {
  throw "NSISBI_LOCALAPPDATA_MISSING"
}

$archive = Join-Path $env:RUNNER_TEMP "nsisbi-$nsisBiVersion.7z"
$extractRoot = Join-Path $env:RUNNER_TEMP "nsisbi-$nsisBiVersion"
$tauriNsis = Join-Path $env:LOCALAPPDATA "tauri\NSIS"

Write-Host "Preparing verified NSISBI $nsisBiVersion for Tauri large offline bundle"
Invoke-WebRequest -Uri $nsisBiUrl -OutFile $archive -UseBasicParsing

$sha512 = [System.Security.Cryptography.SHA512]::Create()
try {
  $stream = [System.IO.File]::OpenRead($archive)
  try {
    $digest = [Convert]::ToBase64String($sha512.ComputeHash($stream))
  } finally {
    $stream.Dispose()
  }
} finally {
  $sha512.Dispose()
}
if ($digest -cne $nsisBiSha512Base64) {
  throw "NSISBI_ARCHIVE_HASH_MISMATCH:$digest"
}

Remove-Item -LiteralPath $extractRoot -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $extractRoot -Force | Out-Null
& 7z x $archive "-o$extractRoot" -y | Out-Host
if ($LASTEXITCODE -ne 0) {
  throw "NSISBI_EXTRACT_FAILED:$LASTEXITCODE"
}

$sourceRoot = $extractRoot
if (-not (Test-Path (Join-Path $sourceRoot "makensis.exe"))) {
  $candidate = Get-ChildItem -Path $extractRoot -Filter "makensis.exe" -File -Recurse |
    Where-Object { $_.DirectoryName -notmatch "[\\/]Bin$" } |
    Select-Object -First 1
  if (-not $candidate) {
    throw "NSISBI_MAKENSIS_NOT_FOUND"
  }
  $sourceRoot = $candidate.Directory.FullName
}

Remove-Item -LiteralPath $tauriNsis -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tauriNsis -Force | Out-Null
Copy-Item -Path (Join-Path $sourceRoot "*") -Destination $tauriNsis -Recurse -Force

$rootMakensis = Join-Path $tauriNsis "makensis.exe"
$binDir = Join-Path $tauriNsis "Bin"
$binMakensis = Join-Path $binDir "makensis.exe"
if (-not (Test-Path $rootMakensis)) {
  throw "NSISBI_ROOT_MAKENSIS_MISSING"
}
New-Item -ItemType Directory -Path $binDir -Force | Out-Null
if (-not (Test-Path $binMakensis)) {
  Copy-Item -LiteralPath $rootMakensis -Destination $binMakensis -Force
}

$tauriUtilsDir = Join-Path $tauriNsis "Plugins\x86-unicode\additional"
New-Item -ItemType Directory -Path $tauriUtilsDir -Force | Out-Null
$tauriUtilsPath = Join-Path $tauriUtilsDir "nsis_tauri_utils.dll"
Invoke-WebRequest -Uri $tauriUtilsUrl -OutFile $tauriUtilsPath -UseBasicParsing
$actualTauriUtilsSha1 = (Get-FileHash -Algorithm SHA1 -LiteralPath $tauriUtilsPath).Hash.ToLowerInvariant()
if ($actualTauriUtilsSha1 -cne $tauriUtilsSha1) {
  throw "NSIS_TAURI_UTILS_HASH_MISMATCH:$actualTauriUtilsSha1"
}

$required = @(
  "makensis.exe",
  "Bin\makensis.exe",
  "Stubs\lzma-x86-unicode",
  "Stubs\lzma_solid-x86-unicode",
  "Plugins\x86-unicode\additional\nsis_tauri_utils.dll",
  "Include\MUI2.nsh",
  "Include\FileFunc.nsh",
  "Include\x64.nsh",
  "Include\nsDialogs.nsh",
  "Include\WinMessages.nsh",
  "Include\Win\COM.nsh",
  "Include\Win\Propkey.nsh",
  "Include\Win\RestartManager.nsh"
)
foreach ($relative in $required) {
  $path = Join-Path $tauriNsis $relative
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "NSISBI_REQUIRED_FILE_MISSING:$relative"
  }
}

$versionOutput = & $rootMakensis /VERSION 2>&1
if ($LASTEXITCODE -ne 0) {
  throw "NSISBI_VERSION_CHECK_FAILED:$LASTEXITCODE"
}
Write-Host "NSISBI_READY:$tauriNsis"
Write-Host ($versionOutput | Out-String).Trim()
