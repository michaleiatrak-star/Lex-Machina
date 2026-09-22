param(
  [Parameter(Mandatory=$true)][string]$RuntimeRoot,
  [Parameter(Mandatory=$true)][string]$ManifestPath,
  [Parameter(Mandatory=$true)][string]$ModelId,
  [Parameter(Mandatory=$true)][int]$ContextTokens,
  [ValidateSet("CPU_X64_PORTABLE", "VULKAN_X64")]
  [string]$Backend = "CPU_X64_PORTABLE",
  [ValidateSet("AUTO", "CPU_X64_PORTABLE", "VULKAN_X64")]
  [string]$BackendMode = "CPU_X64_PORTABLE",
  [string]$LocalAiRoot,
  [string]$CacheRoot
)

$ErrorActionPreference = "Stop"
$runtime = [IO.Path]::GetFullPath($RuntimeRoot)
$manifestFile = [IO.Path]::GetFullPath($ManifestPath)
$manifest = Get-Content -Raw -LiteralPath $manifestFile | ConvertFrom-Json

$localRoot = if ($LocalAiRoot) {
  [IO.Path]::GetFullPath($LocalAiRoot)
} else {
  Join-Path $env:LOCALAPPDATA "LexMachina\local-ai"
}
$cache = if ($CacheRoot) {
  [IO.Path]::GetFullPath($CacheRoot)
} else {
  Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache\local-llm"
}
New-Item -ItemType Directory -Force -Path $cache | Out-Null
New-Item -ItemType Directory -Force -Path $localRoot | Out-Null

# Configure llama.cpp-native agent, MCP web tools and Web UI defaults.
# This runs outside Lex Runtime and the Lex Tool Broker.
$nativeWebConfigurator = Join-Path $runtime "bootstrap\configure-llama-native-web.ps1"
if (-not (Test-Path -LiteralPath $nativeWebConfigurator -PathType Leaf)) {
  throw "LLAMA_NATIVE_WEB_CONFIGURATOR_MISSING:$nativeWebConfigurator"
}
& $nativeWebConfigurator -RuntimeRoot $runtime -LocalAiRoot $localRoot | Out-Host

if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
  function Get-FileHash {
    param(
      [string]$Path,
      [string]$LiteralPath,
      [string]$Algorithm = "SHA256"
    )
    if ($Algorithm.ToUpperInvariant() -ne "SHA256") {
      throw "LOCAL_LLM_HASH_ALGORITHM_UNSUPPORTED:$Algorithm"
    }
    $target = if ($LiteralPath) { $LiteralPath } else { $Path }
    if (-not $target) { throw "LOCAL_LLM_HASH_PATH_MISSING" }
    $stream = [IO.File]::OpenRead($target)
    try {
      $sha = [Security.Cryptography.SHA256]::Create()
      try { $bytes = $sha.ComputeHash($stream) }
      finally { $sha.Dispose() }
    } finally { $stream.Dispose() }
    [pscustomobject]@{
      Algorithm = "SHA256"
      Hash = ([BitConverter]::ToString($bytes) -replace '-','')
      Path = [IO.Path]::GetFullPath($target)
    }
  }
}

function Write-LocalAiProgress(
  [string]$Phase,
  [string]$Label,
  [int64]$BytesDownloaded,
  $BytesTotal,
  $Percent
) {
  $payload = [ordered]@{
    phase = $Phase
    label = $Label
    bytesDownloaded = $BytesDownloaded
    bytesTotal = if ($null -eq $BytesTotal) { $null } else { [int64]$BytesTotal }
    percent = if ($null -eq $Percent) { $null } else { [int]$Percent }
  }
  Write-Host ("LEX_LOCAL_AI_PROGRESS:" + ($payload | ConvertTo-Json -Compress))
}

function Get-VerifiedDownload(
  [string]$Url,
  [string]$ExpectedSha256,
  [string]$Destination,
  [string]$Label
) {
  if ($ExpectedSha256 -notmatch '^[a-fA-F0-9]{64}$') {
    throw "LOCAL_LLM_HASH_INVALID:$Label"
  }

  $expected = $ExpectedSha256.ToLowerInvariant()
  if (Test-Path -LiteralPath $Destination -PathType Leaf) {
    $cached = (Get-FileHash -Algorithm SHA256 -LiteralPath $Destination).Hash.ToLowerInvariant()
    if ($cached -eq $expected) {
      $cachedBytes = (Get-Item -LiteralPath $Destination).Length
      Write-Host "Using verified cache for $Label"
      Write-LocalAiProgress "CACHE_HIT" $Label $cachedBytes $cachedBytes 100
      return
    }
    Remove-Item -LiteralPath $Destination -Force
  }

  $partial = $Destination + ".part"
  Remove-Item -LiteralPath $partial -Force -ErrorAction SilentlyContinue
  Write-Host "Downloading $Label"

  try {
    Add-Type -AssemblyName System.Net.Http
    $client = [System.Net.Http.HttpClient]::new()
    try {
      $response = $client.GetAsync(
        $Url,
        [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead
      ).GetAwaiter().GetResult()

      try {
        $response.EnsureSuccessStatusCode()
        $total = $response.Content.Headers.ContentLength
        $input = $response.Content.ReadAsStreamAsync().GetAwaiter().GetResult()

        try {
          $output = [IO.File]::Open(
            $partial,
            [IO.FileMode]::CreateNew,
            [IO.FileAccess]::Write,
            [IO.FileShare]::None
          )
          try {
            $buffer = New-Object byte[] (1024 * 1024)
            [int64]$downloaded = 0
            [int]$lastPercent = -1
            [int64]$lastReportedBytes = 0

            Write-LocalAiProgress "DOWNLOAD" $Label 0 $total $(if ($null -ne $total -and $total -gt 0) { 0 } else { $null })

            while (($read = $input.Read($buffer, 0, $buffer.Length)) -gt 0) {
              $output.Write($buffer, 0, $read)
              $downloaded += $read

              if ($null -ne $total -and $total -gt 0) {
                $percent = [Math]::Min(
                  100,
                  [Math]::Floor(($downloaded * 100.0) / $total)
                )
                if ($percent -gt $lastPercent) {
                  $lastPercent = [int]$percent
                  Write-LocalAiProgress "DOWNLOAD" $Label $downloaded $total $lastPercent
                }
              } elseif (($downloaded - $lastReportedBytes) -ge (64MB)) {
                $lastReportedBytes = $downloaded
                Write-LocalAiProgress "DOWNLOAD" $Label $downloaded $null $null
              }
            }

            $output.Flush()
          } finally {
            $output.Dispose()
          }
        } finally {
          $input.Dispose()
        }
      } finally {
        $response.Dispose()
      }
    } finally {
      $client.Dispose()
    }

    $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $partial).Hash.ToLowerInvariant()
    if ($actual -ne $expected) {
      throw "LOCAL_LLM_HASH_MISMATCH:$Label expected=$ExpectedSha256 actual=$actual"
    }

    $verifiedBytes = (Get-Item -LiteralPath $partial).Length
    Move-Item -LiteralPath $partial -Destination $Destination -Force
    Write-LocalAiProgress "VERIFIED" $Label $verifiedBytes $verifiedBytes 100
  } catch {
    Remove-Item -LiteralPath $partial -Force -ErrorAction SilentlyContinue
    throw
  }
}

if ($null -eq $manifest.runtime.llamaCpp) {
  throw "LOCAL_LLM_ENGINE_MANIFEST_MISSING"
}
if ($null -eq $manifest.models.localLlm -or @($manifest.models.localLlm).Count -lt 1) {
  throw "LOCAL_LLM_MODEL_MANIFEST_MISSING"
}
if ($null -eq $manifest.localAi.contextSelection) {
  throw "LOCAL_LLM_CONTEXT_POLICY_MISSING"
}

$policy = $manifest.localAi.contextSelection
$minimum = [int]$policy.minimum
$maximum = [int]$policy.maximum
$step = [int]$policy.step
if ($minimum -lt 1 -or $maximum -lt $minimum -or $step -lt 1) {
  throw "LOCAL_LLM_CONTEXT_POLICY_INVALID"
}
if ($ContextTokens -lt $minimum -or $ContextTokens -gt $maximum) {
  throw "LOCAL_LLM_CONTEXT_OUT_OF_RANGE:${ContextTokens}:${minimum}:${maximum}"
}
if ((($ContextTokens - $minimum) % $step) -ne 0) {
  throw "LOCAL_LLM_CONTEXT_STEP_INVALID:${ContextTokens}:${step}"
}

$model = @($manifest.models.localLlm | Where-Object { $_.id -eq $ModelId }) | Select-Object -First 1
if ($null -eq $model) {
  throw "LOCAL_LLM_MODEL_UNKNOWN:$ModelId"
}
if (-not $model.filename -or -not $model.url -or -not $model.sha256) {
  throw "LOCAL_LLM_MODEL_MANIFEST_INVALID:$ModelId"
}
$nativeContext = [int]$model.nativeContext
$modelMinimum = if ($model.minimumContext) { [int]$model.minimumContext } else { $minimum }
$modelMaximum = if ($model.maximumRuntimeContext) { [int]$model.maximumRuntimeContext } else { $nativeContext }
if ($ContextTokens -lt $modelMinimum -or $ContextTokens -gt $modelMaximum) {
  throw "LOCAL_LLM_MODEL_CONTEXT_UNSUPPORTED:${ModelId}:${ContextTokens}:${modelMinimum}:${modelMaximum}"
}
$extended = $ContextTokens -gt $nativeContext
if ($extended -and ($null -eq $model.contextExtension -or $model.contextExtension.enabled -ne $true)) {
  throw "LOCAL_LLM_CONTEXT_EXTENSION_NOT_ALLOWED:${ModelId}:${ContextTokens}"
}

$modelDir = Join-Path $localRoot "models"
New-Item -ItemType Directory -Force -Path $modelDir | Out-Null

$engine = $manifest.runtime.llamaCpp
if (-not $engine.version) {
  throw "LOCAL_LLM_ENGINE_VERSION_MISSING"
}

function Get-EngineBackend([string]$BackendId) {
  $entries = @($engine.backends)
  if ($entries.Count -gt 0) {
    $match = @($entries | Where-Object { $_.id -eq $BackendId }) | Select-Object -First 1
    if ($null -eq $match) {
      throw "LOCAL_LLM_BACKEND_NOT_IN_MANIFEST:$BackendId"
    }
    if (-not $match.url -or -not $match.sha256) {
      throw "LOCAL_LLM_BACKEND_MANIFEST_INVALID:$BackendId"
    }
    return $match
  }

  if ($BackendId -ne "CPU_X64_PORTABLE") {
    throw "LOCAL_LLM_BACKEND_NOT_IN_MANIFEST:$BackendId"
  }
  return [pscustomobject]@{
    id = "CPU_X64_PORTABLE"
    url = $engine.url
    sha256 = $engine.sha256
    gpuOffload = $false
  }
}

function Install-EngineBackend([object]$BackendSpec) {
  $backendId = [string]$BackendSpec.id
  if ($backendId -notmatch '^[A-Z0-9_]{3,64}$') {
    throw "LOCAL_LLM_BACKEND_ID_INVALID:$backendId"
  }

  $engineZip = Join-Path $cache ("llama-" + $engine.version + "-" + $backendId.ToLowerInvariant() + ".zip")
  Get-VerifiedDownload $BackendSpec.url $BackendSpec.sha256 $engineZip ("llama.cpp:" + $backendId)

  $engineDir = Join-Path $localRoot ("engine\llama\" + $engine.version + "\" + $backendId)
  $serverPath = Join-Path $engineDir "llama-server.exe"
  if (-not (Test-Path -LiteralPath $serverPath -PathType Leaf)) {
    $extract = Join-Path $cache ("llama-extract-" + $engine.version + "-" + $backendId.ToLowerInvariant())
    Remove-Item $extract -Recurse -Force -ErrorAction SilentlyContinue
    Expand-Archive -LiteralPath $engineZip -DestinationPath $extract -Force
    $server = Get-ChildItem -Path $extract -Recurse -File -Filter "llama-server.exe" | Select-Object -First 1
    if (-not $server) {
      throw "LOCAL_LLM_ENGINE_ARCHIVE_LAYOUT_INVALID:$backendId"
    }

    $sourceDir = Split-Path -Parent $server.FullName
    $stagedEngine = $engineDir + ".stage-" + [Guid]::NewGuid().ToString("N")
    New-Item -ItemType Directory -Force -Path $stagedEngine | Out-Null
    Copy-Item (Join-Path $sourceDir "*") $stagedEngine -Recurse -Force
    if (-not (Test-Path -LiteralPath (Join-Path $stagedEngine "llama-server.exe") -PathType Leaf)) {
      Remove-Item $stagedEngine -Recurse -Force -ErrorAction SilentlyContinue
      throw "LOCAL_LLM_SERVER_MISSING:$backendId"
    }
    Remove-Item $engineDir -Recurse -Force -ErrorAction SilentlyContinue
    $engineParent = Split-Path -Parent $engineDir
    New-Item -ItemType Directory -Force -Path $engineParent | Out-Null
    Move-Item $stagedEngine $engineDir
  }

  if (-not (Test-Path -LiteralPath $serverPath -PathType Leaf)) {
    throw "LOCAL_LLM_SERVER_MISSING:$backendId"
  }
  return $serverPath
}

$selectedBackend = Get-EngineBackend $Backend
$serverPath = Install-EngineBackend $selectedBackend
$fallbackBackend = $null
$fallbackServerPath = $null
if ([bool]$selectedBackend.gpuOffload) {
  $fallbackBackend = Get-EngineBackend "CPU_X64_PORTABLE"
  $fallbackServerPath = Install-EngineBackend $fallbackBackend
}

$cachedModel = Join-Path $cache $model.filename
$target = Join-Path $modelDir $model.filename

# Upgrade/profile-recovery path: an already installed GGUF is itself a valid
# source for the verified cache. Seed the cache from the installed file when
# its hash matches the signed/release manifest so requalification does not
# download a multi-gigabyte model again.
if (
  -not (Test-Path -LiteralPath $cachedModel -PathType Leaf) -and
  (Test-Path -LiteralPath $target -PathType Leaf)
) {
  $installedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash.ToLowerInvariant()
  if ($installedHash -eq $model.sha256.ToLowerInvariant()) {
    Copy-Item -LiteralPath $target -Destination $cachedModel -Force
  }
}

Get-VerifiedDownload $model.url $model.sha256 $cachedModel ("model:" + $model.id)
$copyRequired = $true
if (Test-Path -LiteralPath $target -PathType Leaf) {
  $targetHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $target).Hash.ToLowerInvariant()
  $copyRequired = $targetHash -ne $model.sha256.ToLowerInvariant()
}
if ($copyRequired) {
  $temporary = $target + ".tmp"
  Remove-Item -LiteralPath $temporary -Force -ErrorAction SilentlyContinue
  Copy-Item -LiteralPath $cachedModel -Destination $temporary -Force
  $temporaryHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $temporary).Hash.ToLowerInvariant()
  if ($temporaryHash -ne $model.sha256.ToLowerInvariant()) {
    Remove-Item -LiteralPath $temporary -Force -ErrorAction SilentlyContinue
    throw "LOCAL_LLM_STAGED_HASH_MISMATCH:$($model.id)"
  }
  Move-Item -LiteralPath $temporary -Destination $target -Force
}

$launchArgs = @(
  "--model", $target,
  "--host", "127.0.0.1",
  "--port", "0",
  "--ctx-size", $ContextTokens.ToString()
)
$contextMode = "NATIVE_OR_REDUCED"
$ropeScale = 1.0
if ([bool]$selectedBackend.gpuOffload) {
  $launchArgs += @(
    "--n-gpu-layers", "999"
  )
}
if ($extended) {
  $contextMode = "YARN_EXTENDED"
  $ropeScale = [Math]::Round(($ContextTokens / [double]$nativeContext), 8)
  $launchArgs += @(
    "--rope-scaling", "yarn",
    "--rope-scale", $ropeScale.ToString([Globalization.CultureInfo]::InvariantCulture),
    "--yarn-orig-ctx", $nativeContext.ToString()
  )
}

$config = [ordered]@{
  schemaVersion = 1
  configuredAt = (Get-Date).ToUniversalTime().ToString("o")
  applicationVersion = $manifest.applicationVersion
  model = [ordered]@{
    id = $model.id
    displayName = $model.displayName
    filename = $model.filename
    path = $target
    sha256 = $model.sha256.ToLowerInvariant()
    quantization = $model.quantization
    nativeContext = $nativeContext
  }
  context = [ordered]@{
    requestedTokens = $ContextTokens
    mode = $contextMode
    extendedBeyondNative = $extended
    ropeScale = $ropeScale
  }
  engine = [ordered]@{
    type = "llama.cpp"
    version = $engine.version
    backend = [string]$selectedBackend.id
    selectionMode = $BackendMode
    gpuOffload = [bool]$selectedBackend.gpuOffload
    executable = $serverPath
    fallbackBackend = if ($fallbackBackend) { [string]$fallbackBackend.id } else { $null }
    fallbackExecutable = $fallbackServerPath
    bind = "127.0.0.1"
    launchArgs = @($launchArgs)
  }
  network = [ordered]@{
    requiredForProvisioning = $true
    requiredForInference = $false
  }
}
$configPath = Join-Path $localRoot "config.json"
$configTemp = $configPath + ".tmp"
[IO.File]::WriteAllText(
  $configTemp,
  (($config | ConvertTo-Json -Depth 10) + [Environment]::NewLine),
  [Text.UTF8Encoding]::new($false)
)
Move-Item -LiteralPath $configTemp -Destination $configPath -Force

# Direct llama.cpp launcher. This path does not call Lex Runtime or Lex Tool
# Broker; llama-server reads its own LLAMA_ARG_* settings and exposes the
# built-in agent tools directly in its Web UI/API.
$nativeAgentLauncher = Join-Path $localRoot "start-llama-native-agent.ps1"
$nativeAgentLauncherContent = @'
param(
  [ValidateRange(1024, 65535)]
  [int]$Port = 4318
)

$ErrorActionPreference = "Stop"
$configPath = Join-Path $PSScriptRoot "config.json"
if (-not (Test-Path -LiteralPath $configPath -PathType Leaf)) {
  throw "LLAMA_NATIVE_CONFIG_MISSING:$configPath"
}

$config = Get-Content -Raw -LiteralPath $configPath | ConvertFrom-Json
if (-not $config.engine.executable -or -not (Test-Path -LiteralPath $config.engine.executable -PathType Leaf)) {
  throw "LLAMA_NATIVE_ENGINE_MISSING"
}
if (-not $config.model.path -or -not (Test-Path -LiteralPath $config.model.path -PathType Leaf)) {
  throw "LLAMA_NATIVE_MODEL_MISSING"
}

# Native llama.cpp configuration. No Lex broker is involved.
$env:LLAMA_ARG_AGENT = "true"
$env:LLAMA_ARG_CORS_ORIGINS = "localhost"
$env:LLAMA_ARG_MCP_SERVERS_CONFIG = Join-Path $PSScriptRoot "mcp-servers.json"
$env:LLAMA_ARG_UI_CONFIG_FILE = Join-Path $PSScriptRoot "llama-ui-config.json"

$llamaArgs = @(
  "--model", [string]$config.model.path,
  "--alias", [string]$config.model.id,
  "--host", "127.0.0.1",
  "--port", $Port.ToString(),
  "--ctx-size", ([int]$config.context.requestedTokens).ToString(),
  "--parallel", "1",
  "--jinja",
  "--flash-attn", "auto",
  "--cache-type-k", "q8_0",
  "--cache-type-v", "q8_0"
)

if ($config.engine.gpuOffload -eq $true) {
  $llamaArgs += @("--n-gpu-layers", "999")
}

if ([string]$config.model.id -eq "local/mistral-nemo-12b-q4km") {
  $groundedTemplate = Join-Path $PSScriptRoot "mistral-nemo-web-grounded.jinja"
  if (-not (Test-Path -LiteralPath $groundedTemplate -PathType Leaf)) {
    throw "LLAMA_NATIVE_MISTRAL_GROUNDED_TEMPLATE_MISSING:$groundedTemplate"
  }
  $llamaArgs += @(
    "--chat-template-file", $groundedTemplate,
    "--temp", "0.2"
  )
}

if ([string]$config.model.id -eq "local/bielik-11b-v3-q4km") {
  $groundedTemplate = Join-Path $PSScriptRoot "bielik-web-grounded.jinja"
  if (-not (Test-Path -LiteralPath $groundedTemplate -PathType Leaf)) {
    throw "LLAMA_NATIVE_BIELIK_GROUNDED_TEMPLATE_MISSING:$groundedTemplate"
  }
  $llamaArgs += @(
    "--chat-template-file", $groundedTemplate,
    "--temp", "0.2"
  )
}

if ($config.context.extendedBeyondNative -eq $true) {
  $llamaArgs += @(
    "--rope-scaling", "yarn",
    "--rope-scale", ([double]$config.context.ropeScale).ToString([Globalization.CultureInfo]::InvariantCulture),
    "--yarn-orig-ctx", ([int]$config.model.nativeContext).ToString()
  )
}

& ([string]$config.engine.executable) @llamaArgs
exit $LASTEXITCODE
'@
[IO.File]::WriteAllText(
  $nativeAgentLauncher,
  $nativeAgentLauncherContent + [Environment]::NewLine,
  [Text.UTF8Encoding]::new($false)
)

$result = [ordered]@{
  status = "READY"
  root = $localRoot
  configPath = $configPath
  nativeAgentLauncher = $nativeAgentLauncher
  modelId = $model.id
  contextTokens = $ContextTokens
  contextMode = $contextMode
  backend = [string]$selectedBackend.id
  backendMode = $BackendMode
} | ConvertTo-Json -Compress
Write-Output $result
Write-Host "LEX_LOCAL_LLM_INSTALL_PASS:$localRoot"
