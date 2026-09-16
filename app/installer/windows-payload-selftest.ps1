param(
  [Parameter(Mandatory=$true)][string]$PayloadRoot
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path $PayloadRoot).Path

function Require-File([string]$Relative) {
  $path = Join-Path $root $Relative
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "SELFTEST_FILE_MISSING:$Relative"
  }
  return $path
}
function Require-Dir([string]$Relative) {
  $path = Join-Path $root $Relative
  if (-not (Test-Path -LiteralPath $path -PathType Container)) {
    throw "SELFTEST_DIR_MISSING:$Relative"
  }
  return $path
}

$node = Require-File "node\node.exe"
$python = Require-File "python\python.exe"
$server = Require-File "app\dist\http\server.js"
$sidecar = Require-File "lex-runtime-sidecar.exe"
$lockPath = Require-File "component-lock.json"

& $sidecar --self-test | Out-Host
if ($LASTEXITCODE -ne 0) {
  throw "SELFTEST_NATIVE_COMPONENT_LOCK_FAILED"
}
$corpus = Require-Dir "corpus"
$paddle = Require-Dir "models\paddle\official_models"
$stanza = Require-Dir "models\stanza"

& $node --version | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_NODE_FAILED" }

$pythonCode = @'
import os, sys
import fitz, numpy, PIL, paddle, paddleocr, stanza, torch
print("PYTHON_IMPORTS_PASS", sys.version)
'@
& $python -c $pythonCode | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_PYTHON_IMPORT_FAILED" }

$requiredPaddle = @(
 "PP-LCNet_x1_0_doc_ori",
 "UVDoc",
 "PP-LCNet_x1_0_textline_ori",
 "PP-OCRv6_medium_det",
 "PP-OCRv6_medium_rec"
)
foreach ($name in $requiredPaddle) {
  if (-not (Test-Path (Join-Path $paddle $name) -PathType Container)) {
    throw "SELFTEST_PADDLE_MODEL_MISSING:$name"
  }
}
if (-not (Test-Path (Join-Path $stanza "resources.json") -PathType Leaf)) {
  throw "SELFTEST_STANZA_RESOURCES_MISSING"
}
if (-not (Test-Path (Join-Path $stanza "pl") -PathType Container)) {
  throw "SELFTEST_STANZA_PL_MISSING"
}

$lock = Get-Content -Raw -LiteralPath $lockPath | ConvertFrom-Json
foreach ($entry in $lock.files) {
  $path = Join-Path $root ($entry.path -replace '/','\')
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "SELFTEST_LOCK_FILE_MISSING:$($entry.path)"
  }
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant()
  if ($actual -ne $entry.sha256) {
    throw "SELFTEST_LOCK_HASH_MISMATCH:$($entry.path)"
  }
}

$bootstrap = ([Guid]::NewGuid().ToString("N")) + ([Guid]::NewGuid().ToString("N"))
$stdout = Join-Path $env:TEMP ("lex-sidecar-" + [Guid]::NewGuid().ToString("N") + ".out")
$stderr = $stdout + ".err"
$oldHost = $env:LEX_HOST
$oldPort = $env:LEX_PORT
$oldBootstrap = $env:LEX_DESKTOP_BOOTSTRAP_TOKEN
$env:LEX_HOST = "127.0.0.1"
$env:LEX_PORT = "0"
$env:LEX_DESKTOP_BOOTSTRAP_TOKEN = $bootstrap
try {
  $process = Start-Process -FilePath $sidecar -WorkingDirectory $root -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  $deadline = (Get-Date).AddSeconds(90)
  $started = $false
  while ((Get-Date) -lt $deadline -and -not $process.HasExited) {
    Start-Sleep -Milliseconds 250
    if (Test-Path $stdout) {
      $text = Get-Content -Raw -ErrorAction SilentlyContinue $stdout
      if ($text -match 'http://127\.0\.0\.1:\d+') {
        $started = $true
        break
      }
    }
  }
  if (-not $started) {
    $details = ""
    if (Test-Path $stderr) { $details = Get-Content -Raw $stderr }
    throw "SELFTEST_SIDECAR_START_FAILED:$details"
  }
} finally {
  if ($process -and -not $process.HasExited) {
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
  }
  Remove-Item $stdout,$stderr -Force -ErrorAction SilentlyContinue
  $env:LEX_HOST = $oldHost
  $env:LEX_PORT = $oldPort
  $env:LEX_DESKTOP_BOOTSTRAP_TOKEN = $oldBootstrap
}

Write-Host "LEX_INSTALLER_SELFTEST_PASS"
