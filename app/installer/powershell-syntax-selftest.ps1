param()

$ErrorActionPreference = "Stop"

$installerRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$files = @(
  Get-ChildItem -LiteralPath $installerRoot -File -Filter "*.ps1" |
    Sort-Object FullName
)

if ($files.Count -lt 1) {
  throw "INSTALLER_POWERSHELL_SYNTAX_NO_FILES"
}

$failures = [Collections.Generic.List[string]]::new()

foreach ($file in $files) {
  $tokens = $null
  $errors = $null
  [void][System.Management.Automation.Language.Parser]::ParseFile(
    $file.FullName,
    [ref]$tokens,
    [ref]$errors
  )

  foreach ($parseError in @($errors)) {
    $extent = $parseError.Extent
    $failures.Add(
      (
        "{0}:{1}:{2}:{3}" -f
          $file.Name,
          $extent.StartLineNumber,
          $extent.StartColumnNumber,
          $parseError.Message
      )
    )
  }
}

if ($failures.Count -gt 0) {
  throw (
    "INSTALLER_POWERSHELL_SYNTAX_FAILED:" +
    ($failures -join " | ")
  )
}

Write-Host "INSTALLER_POWERSHELL_SYNTAX_PASS"
Write-Host "Files parsed: $($files.Count)"
