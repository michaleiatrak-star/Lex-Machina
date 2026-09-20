$ErrorActionPreference = "Stop"

$manifest = Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot "windows-release-source.json") |
  ConvertFrom-Json
$python = $manifest.runtime.python
if ($python.delivery -ne "EMBEDDABLE_APP_LOCAL") {
  throw "EMBEDDED_PYTHON_SMOKE_DELIVERY_INVALID:$($python.delivery)"
}

$root = Join-Path $env:RUNNER_TEMP (
  "Lex Machina Michał Python Smoke-" + [Guid]::NewGuid().ToString("N")
)
$pythonDir = Join-Path $root "python"
$cache = Join-Path $root "cache"
New-Item -ItemType Directory -Force -Path $pythonDir, $cache | Out-Null

function Get-VerifiedDownload(
  [string]$Url,
  [string]$ExpectedSha256,
  [string]$Destination,
  [string]$Label
) {
  Invoke-WebRequest -UseBasicParsing -Uri $Url -OutFile $Destination
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $Destination).Hash.ToLowerInvariant()
  if ($actual -ne $ExpectedSha256.ToLowerInvariant()) {
    throw "EMBEDDED_PYTHON_SMOKE_HASH_MISMATCH:$Label expected=$ExpectedSha256 actual=$actual"
  }
}

try {
  $zip = Join-Path $cache "python-embed.zip"
  Get-VerifiedDownload $python.embeddable.url $python.embeddable.sha256 $zip "python-embed"
  Expand-Archive -LiteralPath $zip -DestinationPath $pythonDir -Force

  $pythonExe = Join-Path $pythonDir "python.exe"
  if (-not (Test-Path -LiteralPath $pythonExe -PathType Leaf)) {
    throw "EMBEDDED_PYTHON_SMOKE_EXE_MISSING"
  }

  $pth = Get-ChildItem -LiteralPath $pythonDir -Filter "python*._pth" -File |
    Select-Object -First 1
  if (-not $pth) {
    throw "EMBEDDED_PYTHON_SMOKE_PTH_MISSING"
  }

  $lines = @(
    Get-Content -LiteralPath $pth.FullName |
      Where-Object {
        $trimmed = $_.Trim()
        $trimmed -ne "#import site" -and
        $trimmed -ne "import site" -and
        $trimmed -ne "Lib\site-packages" -and
        $trimmed -ne "pip-bootstrap.whl"
      }
  )
  $lines += "Lib\site-packages"
  $lines += "pip-bootstrap.whl"
  $lines += "import site"
  [IO.File]::WriteAllLines($pth.FullName, [string[]]$lines, [Text.Encoding]::ASCII)
  New-Item -ItemType Directory -Force -Path (Join-Path $pythonDir "Lib\site-packages") | Out-Null

  $pipCache = Join-Path $cache "pip.whl"
  Get-VerifiedDownload $python.pipBootstrap.url $python.pipBootstrap.sha256 $pipCache "pip-wheel"
  Copy-Item -LiteralPath $pipCache -Destination (Join-Path $pythonDir "pip-bootstrap.whl") -Force

  $stdout = Join-Path $root "pip.stdout.log"
  $stderr = Join-Path $root "pip.stderr.log"
  $proc = Start-Process -FilePath $pythonExe `
    -ArgumentList "-m pip --version" `
    -Wait `
    -PassThru `
    -NoNewWindow `
    -RedirectStandardOutput $stdout `
    -RedirectStandardError $stderr

  $out = if (Test-Path -LiteralPath $stdout) { Get-Content -Raw -LiteralPath $stdout } else { "" }
  $err = if (Test-Path -LiteralPath $stderr) { Get-Content -Raw -LiteralPath $stderr } else { "" }
  $expectedPrefix = "pip $($python.pipBootstrap.version) "
  if ($proc.ExitCode -ne 0 -or -not $out.Trim().StartsWith($expectedPrefix, [StringComparison]::Ordinal)) {
    throw "EMBEDDED_PYTHON_SMOKE_PIP_INVALID exit=$($proc.ExitCode) stdout=$($out.Trim()) stderr=$($err.Trim())"
  }

  $freezeOut = Join-Path $root "freeze.stdout.log"
  $freezeErr = Join-Path $root "freeze.stderr.log"
  $freeze = Start-Process -FilePath $pythonExe `
    -ArgumentList "-m pip freeze --all" `
    -Wait `
    -PassThru `
    -NoNewWindow `
    -RedirectStandardOutput $freezeOut `
    -RedirectStandardError $freezeErr
  if ($freeze.ExitCode -ne 0) {
    $freezeError = if (Test-Path -LiteralPath $freezeErr) {
      Get-Content -Raw -LiteralPath $freezeErr
    } else { "" }
    throw "EMBEDDED_PYTHON_SMOKE_FREEZE_FAILED:$($freeze.ExitCode):$($freezeError.Trim())"
  }

  Write-Host "EMBEDDED_PYTHON_SMOKE_PASS"
  Write-Host $out.Trim()
} finally {
  Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
}
