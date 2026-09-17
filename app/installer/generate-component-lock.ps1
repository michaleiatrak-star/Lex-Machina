param(
  [Parameter(Mandatory=$true)][string]$PayloadRoot,
  [Parameter(Mandatory=$true)][string]$Output,
  [bool]$NetworkRequiredAtInstall = $false,
  [bool]$IncludeBundledVisualCppRuntime = $true
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path $PayloadRoot).Path
$files = Get-ChildItem -Path $root -File -Recurse |
  Where-Object { $_.FullName -ne (Join-Path $root "component-lock.json") } |
  Sort-Object FullName

$entries = @()
foreach ($file in $files) {
  $relative = $file.FullName.Substring($root.Length).TrimStart([char]92, [char]47) -replace '\\','/'
  $entries += [pscustomobject][ordered]@{
    path = $relative
    bytes = $file.Length
    sha256 = (Get-FileHash -Algorithm SHA256 -Path $file.FullName).Hash.ToLowerInvariant()
  }
}

$components = @(
  @{ id="node-runtime"; path="node"; required=$true },
  @{ id="python-runtime"; path="python"; required=$true },
  @{ id="lex-runtime"; path="app"; required=$true },
  @{ id="legal-corpus"; path="corpus"; required=$true },
  @{ id="paddle-ocr-pl"; path="models/paddle"; required=$true },
  @{ id="stanza-pl-ner"; path="models/stanza"; required=$true },
  @{ id="runtime-sidecar"; path="lex-runtime-sidecar.exe"; required=$true }
)
if ($IncludeBundledVisualCppRuntime) {
  $components += @{ id="visual-cpp-runtime"; path="prerequisites/vc_redist.x64.exe"; required=$true }
}

$componentRows = foreach ($component in $components) {
  $prefix = $component.path.TrimEnd('/') + "/"
  $members = @($entries | Where-Object {
    $_.path -eq $component.path -or $_.path.StartsWith($prefix)
  })
  if ($members.Count -eq 0) {
    throw "Required installer component is empty: $($component.id)"
  }
  $aggregateText = ($members | ForEach-Object {
    "$($_.sha256)  $($_.path)"
  }) -join "`n"
  $bytes = [Text.Encoding]::UTF8.GetBytes($aggregateText)
  $sha = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
  [ordered]@{
    id = $component.id
    required = $component.required
    relativePath = $component.path
    fileCount = $members.Count
    bytes = ($members | Measure-Object -Property bytes -Sum).Sum
    sha256Manifest = ([BitConverter]::ToString($sha) -replace '-','').ToLowerInvariant()
  }
}

$lock = [ordered]@{
  schemaVersion = 2
  status = "RELEASE_CANDIDATE_LOCK"
  applicationVersion = "0.1.0"
  target = "windows-x86_64"
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  sourceCommit = if ($env:GITHUB_SHA) { $env:GITHUB_SHA } else { "LOCAL_BUILD" }
  sourceRepository = "michaleiatrak-star/Lex-Machina"
  networkRequiredAtInstall = $NetworkRequiredAtInstall
  runtimeNetworkRequiredAfterBootstrap = $false
  expectedUserActionAfterInstall = "PROVIDER_API_KEY_ONLY"
  systemPrerequisites = @("webview2", "visual-cpp-runtime")
  components = @($componentRows)
  files = @($entries)
}

$json = $lock | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText($Output, $json + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
Write-Host "Component lock: $Output ($($entries.Count) files)"
