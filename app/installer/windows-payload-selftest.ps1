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
$codex = Require-File "app\node_modules\.bin\codex.cmd"
$sidecar = Require-File "lex-runtime-sidecar.exe"
$lockPath = Require-File "component-lock.json"
$appUpdateTransaction = Require-File "bootstrap\app-update-transaction.ps1"
$appUpdateVerification = Require-File "bootstrap\app-update-verification.ps1"
$llamaWebConfigurator = Require-File "bootstrap\configure-llama-native-web.ps1"
$llamaWebMcp = Require-File "bootstrap\llama-web-mcp.py"
$llamaLegalMcp = Require-File "bootstrap\llama-legal-skills-mcp.py"
$llamaPrivateMcp = Require-File "bootstrap\llama-private-docs-mcp.py"
$llamaMistralTemplate = Require-File "bootstrap\mistral-nemo-web-grounded.jinja"
$llamaBielikTemplate = Require-File "bootstrap\bielik-web-grounded.jinja"
$ocrWorker = Require-File "ocr\paddle_worker.py"
$nerWorker = Require-File "privacy\stanza_ner_worker.py"
$documentWorker = Require-File "storage\legal_document_worker.py"
$corpus = Require-Dir "corpus"
$paddle = Require-Dir "models\paddle\official_models"
$stanza = Require-Dir "models\stanza"
$pythonSelftest = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "windows-payload-python-selftest.py"
if (-not (Test-Path -LiteralPath $pythonSelftest -PathType Leaf)) {
  throw "SELFTEST_PYTHON_HELPER_MISSING"
}

$oldEnv = @{
  LEX_PADDLE_MODEL_DIR = $env:LEX_PADDLE_MODEL_DIR
  PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK = $env:PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK
  STANZA_RESOURCES_DIR = $env:STANZA_RESOURCES_DIR
  LEX_PRIVATE_NER_WORKER = $env:LEX_PRIVATE_NER_WORKER
  LEX_PRIVATE_OCR_WORKER = $env:LEX_PRIVATE_OCR_WORKER
  LEX_PRIVATE_DOC_WORKER = $env:LEX_PRIVATE_DOC_WORKER
  PYTHONNOUSERSITE = $env:PYTHONNOUSERSITE
  PYTHONUTF8 = $env:PYTHONUTF8
  HTTP_PROXY = $env:HTTP_PROXY
  HTTPS_PROXY = $env:HTTPS_PROXY
  ALL_PROXY = $env:ALL_PROXY
  NO_PROXY = $env:NO_PROXY
}
$env:LEX_PADDLE_MODEL_DIR = $paddle
$env:PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK = "True"
$env:STANZA_RESOURCES_DIR = $stanza
$env:LEX_PRIVATE_NER_WORKER = $nerWorker
$env:LEX_PRIVATE_OCR_WORKER = $ocrWorker
$env:LEX_PRIVATE_DOC_WORKER = $documentWorker
$env:PYTHONNOUSERSITE = "1"
$env:PYTHONUTF8 = "1"
$env:HTTP_PROXY = "http://127.0.0.1:9"
$env:HTTPS_PROXY = "http://127.0.0.1:9"
$env:ALL_PROXY = "http://127.0.0.1:9"
$env:NO_PROXY = "127.0.0.1,localhost"

Write-Host "SELFTEST_STAGE:native-component-lock"
& $sidecar --self-test | Out-Host
if ($LASTEXITCODE -ne 0) {
  throw "SELFTEST_NATIVE_COMPONENT_LOCK_FAILED"
}

Write-Host "SELFTEST_STAGE:node"
& $node --version | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_NODE_FAILED" }

Write-Host "SELFTEST_STAGE:codex"
$codexVersion = (& $codex --version 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_CODEX_CLI_FAILED" }
if ($codexVersion -notmatch '0\.154\.0') {
  throw "SELFTEST_CODEX_CLI_VERSION_MISMATCH:$codexVersion"
}
Write-Host "SELFTEST_CODEX_CLI_PASS:$codexVersion"

Write-Host "SELFTEST_STAGE:python-core"
& $python $pythonSelftest core | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_PYTHON_CORE_IMPORT_FAILED" }

Write-Host "SELFTEST_STAGE:llama-native-web-mcp"
& $python $llamaWebMcp --self-test | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_LLAMA_NATIVE_WEB_MCP_FAILED" }

Write-Host "SELFTEST_STAGE:llama-native-legal-skills-mcp"
& $python $llamaLegalMcp --skills-root $corpus --self-test | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_LLAMA_NATIVE_LEGAL_SKILLS_MCP_FAILED" }

Write-Host "SELFTEST_STAGE:llama-native-private-docs-mcp"
& $python $llamaPrivateMcp --self-test | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_LLAMA_NATIVE_PRIVATE_DOCS_MCP_FAILED" }

$skillFiles = @(Get-ChildItem -LiteralPath $corpus -Directory | Where-Object {
  Test-Path -LiteralPath (Join-Path $_.FullName "SKILL.md") -PathType Leaf
})
if ($skillFiles.Count -ne 32) {
  throw "SELFTEST_LLAMA_LEGAL_SKILL_COUNT_INVALID:expected=32:actual=$($skillFiles.Count)"
}

$templateText = Get-Content -Raw -LiteralPath $llamaMistralTemplate
if ($templateText -notmatch "LEX_WEB_GROUNDED_POLICY_V1" -or
    $templateText -notmatch "web_research" -or
    $templateText -notmatch "LEX_LEGAL_SKILLS_AUTO_POLICY_V1" -or
    $templateText -notmatch "legal_auto_route" -or
    $templateText -notmatch "LEX_DIRECT_LEGAL_MCP_POLICY_V1" -or
    $templateText -notmatch "LEX_PRIVATE_DOCUMENT_POLICY_V1" -or
    $templateText -notmatch "private_ocr_anonymize" -or
    $templateText -notmatch "private_finalize_document") {
  throw "SELFTEST_LLAMA_GROUNDED_TEMPLATE_INVALID"
}

$bielikTemplateText = Get-Content -Raw -LiteralPath $llamaBielikTemplate
if ($bielikTemplateText -notmatch "LEX_WEB_GROUNDED_POLICY_V1" -or
    $bielikTemplateText -notmatch "LEX_LEGAL_SKILLS_AUTO_POLICY_V1" -or
    $bielikTemplateText -notmatch "LEX_DIRECT_LEGAL_MCP_POLICY_V1" -or
    $bielikTemplateText -notmatch "LEX_PRIVATE_DOCUMENT_POLICY_V1" -or
    $bielikTemplateText -notmatch "<tool_call>" -or
    $bielikTemplateText -notmatch "private_ocr_anonymize") {
  throw "SELFTEST_LLAMA_BIELIK_GROUNDED_TEMPLATE_INVALID"
}

# Keep native ML stacks in separate interpreter processes. Paddle/PaddleX and
# Torch load independent native DLL graphs on Windows; production OCR and NER
# workers are separate processes as well.
Write-Host "SELFTEST_STAGE:python-ocr-import"
& $python $pythonSelftest ocr-import | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_PYTHON_OCR_IMPORT_FAILED" }

Write-Host "SELFTEST_STAGE:python-ner-import"
& $python $pythonSelftest ner-import | Out-Host
if ($LASTEXITCODE -ne 0) { throw "SELFTEST_PYTHON_NER_IMPORT_FAILED" }

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
if ($null -eq $lock.networkRequiredAtInstall) {
  throw "SELFTEST_LOCK_INSTALL_NETWORK_POLICY_MISSING"
}
if ($lock.runtimeNetworkRequiredAfterBootstrap -ne $false) {
  throw "SELFTEST_LOCK_RUNTIME_NETWORK_POLICY_INVALID"
}
if ($lock.expectedUserActionAfterInstall -ne "PROVIDER_API_KEY_OR_OPTIONAL_LOCAL_AI_SETUP") {
  throw "SELFTEST_LOCK_USER_ACTION_POLICY_INVALID"
}
if ($null -eq $lock.localAi -or $lock.localAi.requiredForApplicationHealth -ne $false) {
  throw "SELFTEST_LOCK_LOCAL_AI_POLICY_INVALID"
}
if (@($lock.optionalNetworkActionsAfterInstall) -notcontains "LOCAL_AI_PROVISIONING") {
  throw "SELFTEST_LOCK_LOCAL_AI_PROVISIONING_POLICY_MISSING"
}
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

$temp = Join-Path $env:TEMP ("lex-installer-selftest-" + [Guid]::NewGuid().ToString("N"))
New-Item $temp -ItemType Directory | Out-Null

try {
  Write-Host "Self-test: actual local OCR inference"
  $image = Join-Path $temp "ocr.png"
  $ocrOut = Join-Path $temp "ocr.json"
  & $python $pythonSelftest make-ocr-fixture $image
  if ($LASTEXITCODE -ne 0) { throw "SELFTEST_OCR_FIXTURE_FAILED" }
  & $python $ocrWorker --input $image --output $ocrOut --pages 1 --mode image --device cpu
  if ($LASTEXITCODE -ne 0) { throw "SELFTEST_OCR_INFERENCE_FAILED" }
  $ocrJson = Get-Content -Raw $ocrOut | ConvertFrom-Json
  if (@($ocrJson).Count -ne 1 -or $ocrJson[0].page -ne 1) {
    throw "SELFTEST_OCR_OUTPUT_INVALID"
  }

  Write-Host "Self-test: actual local Stanza NER inference"
  $nerInput = Join-Path $temp "ner.txt"
  $nerOut = Join-Path $temp "ner.json"
  [IO.File]::WriteAllText($nerInput, "Jan Kowalski spotkał Annę Nowak w Warszawie.", [Text.UTF8Encoding]::new($false))
  & $python $nerWorker --input $nerInput --output $nerOut
  if ($LASTEXITCODE -ne 0) { throw "SELFTEST_NER_INFERENCE_FAILED" }
  $nerJson = Get-Content -Raw $nerOut | ConvertFrom-Json
  if ($null -eq $nerJson) { throw "SELFTEST_NER_OUTPUT_INVALID" }

  Write-Host "Self-test: deterministic local DOCX renderer"
  $renderRequest = Join-Path $temp "render.json"
  $renderOut = Join-Path $temp "render-result.json"
  $request = [ordered]@{
    operation = "render"
    format = "docx"
    ast = [ordered]@{
      schemaVersion = "1"
      documentType = "letter"
      locale = "pl-PL"
      styleProfile = "lex-classic-clean-v1"
      blocks = @(
        [ordered]@{
          type = "paragraph"
          content = @([ordered]@{ type = "text"; text = "Lex Machina self-test" })
        }
      )
    }
  } | ConvertTo-Json -Depth 12 -Compress
  [IO.File]::WriteAllText($renderRequest, $request, [Text.UTF8Encoding]::new($false))
  Get-Content -Raw $renderRequest | & $python $documentWorker | Out-File -FilePath $renderOut -Encoding utf8
  if ($LASTEXITCODE -ne 0) { throw "SELFTEST_DOCX_RENDER_FAILED" }
  $renderJson = Get-Content -Raw $renderOut | ConvertFrom-Json
  if (-not $renderJson.packageBase64 -or $renderJson.bytes -le 0) {
    throw "SELFTEST_DOCX_RENDER_OUTPUT_INVALID"
  }

  Write-Host "Self-test: loopback sidecar startup and authenticated health"
  $bootstrap = ([Guid]::NewGuid().ToString("N")) + ([Guid]::NewGuid().ToString("N"))
  $stdout = Join-Path $temp "sidecar.out"
  $stderr = Join-Path $temp "sidecar.err"
  $oldHost = $env:LEX_HOST
  $oldPort = $env:LEX_PORT
  $oldBootstrap = $env:LEX_DESKTOP_BOOTSTRAP_TOKEN
  $env:LEX_HOST = "127.0.0.1"
  $env:LEX_PORT = "0"
  $env:LEX_DESKTOP_BOOTSTRAP_TOKEN = $bootstrap
  $process = $null
  try {
    $process = Start-Process -FilePath $sidecar -WorkingDirectory $root -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    $deadline = (Get-Date).AddSeconds(90)
    $address = $null
    while ((Get-Date) -lt $deadline -and -not $process.HasExited) {
      Start-Sleep -Milliseconds 250
      if (Test-Path $stdout) {
        $text = Get-Content -Raw -ErrorAction SilentlyContinue $stdout
        if ($text -match '(http://127\.0\.0\.1:\d+)') {
          $address = $Matches[1]
          break
        }
      }
    }
    if (-not $address) {
      $details = ""
      if (Test-Path $stderr) { $details = Get-Content -Raw $stderr }
      throw "SELFTEST_SIDECAR_START_FAILED:$details"
    }
    $blocked = $false
    try {
      Invoke-WebRequest -UseBasicParsing -Uri ($address + "/health") -TimeoutSec 5 | Out-Null
    } catch {
      if ($_.Exception.Response.StatusCode.value__ -eq 401) { $blocked = $true }
    }
    if (-not $blocked) { throw "SELFTEST_BOOTSTRAP_GUARD_NOT_ENFORCED" }
    $health = Invoke-RestMethod -Uri ($address + "/health") -Headers @{ "X-Lex-Desktop-Bootstrap" = $bootstrap } -TimeoutSec 10
    if ($health.status -ne "ok" -or $health.localOnly -ne $true) {
      throw "SELFTEST_RUNTIME_HEALTH_INVALID"
    }
  } finally {
    if ($process -and -not $process.HasExited) {
      Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }

    # The Rust sidecar owns a child Node runtime. Stopping only the parent can
    # leave that child alive on Windows and make the release payload mutable
    # while the offline archive is being assembled.
    $runtimePrefix = $root.TrimEnd([char]92, [char]47) + [IO.Path]::DirectorySeparatorChar
    Get-Process -ErrorAction SilentlyContinue | ForEach-Object {
      try {
        if ($_.Path -and $_.Path.StartsWith($runtimePrefix, [StringComparison]::OrdinalIgnoreCase)) {
          Write-Host "Self-test cleanup: stopping runtime child $($_.ProcessName) pid=$($_.Id)"
          Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
      } catch {
        Write-Host "Self-test runtime child cleanup note: $($_.Exception.Message)"
      }
    }
    Start-Sleep -Milliseconds 500

    $env:LEX_HOST = $oldHost
    $env:LEX_PORT = $oldPort
    $env:LEX_DESKTOP_BOOTSTRAP_TOKEN = $oldBootstrap
  }

  Write-Host "LEX_INSTALLER_SELFTEST_PASS:LOCAL_AI_OPTIONAL"
} finally {
  foreach ($key in $oldEnv.Keys) {
    Set-Item -Path ("Env:" + $key) -Value $oldEnv[$key] -ErrorAction SilentlyContinue
    if ($null -eq $oldEnv[$key]) {
      Remove-Item -Path ("Env:" + $key) -ErrorAction SilentlyContinue
    }
  }
  Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
}
