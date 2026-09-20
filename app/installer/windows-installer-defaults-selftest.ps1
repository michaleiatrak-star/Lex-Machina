param(
  [string]$DefaultsPath = (
    Join-Path $PSScriptRoot "windows-installer-defaults.json"
  ),
  [string]$ConfigPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/tauri.conf.json"
  ),
  [string]$ManifestPath = (
    Join-Path $PSScriptRoot "windows-release-source.json"
  ),
  [string]$HooksPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/windows/hooks.nsh"
  ),
  [string]$BootstrapPath = (
    Join-Path $PSScriptRoot "windows-online-bootstrap.ps1"
  )
)

$ErrorActionPreference = "Stop"

function Assert-Equal(
  [string]$Label,
  $Actual,
  $Expected
) {
  if ([string]$Actual -cne [string]$Expected) {
    throw "WINDOWS_INSTALLER_DEFAULT_MISMATCH:$Label expected=$Expected actual=$Actual"
  }
}

$defaults = Get-Content -Raw -LiteralPath $DefaultsPath | ConvertFrom-Json
$config = Get-Content -Raw -LiteralPath $ConfigPath | ConvertFrom-Json
$manifest = Get-Content -Raw -LiteralPath $ManifestPath | ConvertFrom-Json
$hooks = Get-Content -Raw -LiteralPath $HooksPath
$bootstrap = Get-Content -Raw -LiteralPath $BootstrapPath

if ($defaults.policy -ne "FROZEN_INSTALLER_MECHANICS") {
  throw "WINDOWS_INSTALLER_DEFAULT_POLICY_INVALID:$($defaults.policy)"
}

$targets = @($config.bundle.targets)
if ($targets.Count -ne 1 -or $targets[0] -ne $defaults.bundleTarget) {
  throw "WINDOWS_INSTALLER_DEFAULT_MISMATCH:bundleTarget expected=$($defaults.bundleTarget) actual=$($targets -join ',')"
}

if (@($config.bundle.icon) -notcontains $defaults.installerIcon) {
  throw "WINDOWS_INSTALLER_DEFAULT_MISMATCH:bundleIcon expected=$($defaults.installerIcon)"
}

Assert-Equal "installMode" $config.bundle.windows.nsis.installMode $defaults.installMode
Assert-Equal "installerIcon" $config.bundle.windows.nsis.installerIcon $defaults.installerIcon
Assert-Equal "uninstallerIcon" $config.bundle.windows.nsis.uninstallerIcon $defaults.uninstallerIcon
Assert-Equal "installerHooks" $config.bundle.windows.nsis.installerHooks $defaults.installerHooks
Assert-Equal "languages" (@($config.bundle.windows.nsis.languages) -join "|") (@($defaults.languages) -join "|")
Assert-Equal "webviewInstallMode.type" $config.bundle.windows.webviewInstallMode.type $defaults.webviewInstallMode.type

if ([bool]$config.bundle.windows.webviewInstallMode.silent -ne [bool]$defaults.webviewInstallMode.silent) {
  throw "WINDOWS_INSTALLER_DEFAULT_MISMATCH:webviewInstallMode.silent"
}

Assert-Equal "installerMode" $manifest.installerMode $defaults.installerMode
Assert-Equal "privatePythonDelivery" $manifest.runtime.python.delivery $defaults.privatePythonDelivery
Assert-Equal "visualCppDelivery" $manifest.systemPrerequisites.visualCppRuntime.delivery $defaults.visualCppDelivery
Assert-Equal "webview2Delivery" $manifest.systemPrerequisites.webview2.delivery $defaults.webview2Delivery
Assert-Equal "localAiDelivery" $manifest.localAi.delivery $defaults.localAiDelivery
Assert-Equal "localAiInstallRoot" $manifest.localAi.installRoot $defaults.localAiInstallRoot
Assert-Equal "defaultAdminBootstrapPolicy" $defaults.userData.noExistingAccountBootstrap "TEMPORARY_DEFAULT_ADMIN_WITH_PERSISTENT_CHANGE_PASSWORD_WARNING"
Assert-Equal "defaultAdminUsePolicy" $defaults.userData.defaultAdminUsePolicy "ALLOW_USE_WHILE_PASSWORD_SETUP_PENDING_WITH_PERSISTENT_WARNING"

$expectedRuntimeRootToken = '-RuntimeRoot "$INSTDIR\runtime"'
if (-not $hooks.Contains($expectedRuntimeRootToken)) {
  throw "WINDOWS_INSTALLER_DEFAULT_RUNTIME_ROOT_MISSING:$($defaults.runtimeRoot)"
}

$expectedUserDataRootToken = '$PROFILE\.lex-machina\data'
$expectedAuthDbToken = '$PROFILE\.lex-machina\data\auth\auth.sqlite'
if (-not $hooks.Contains($expectedUserDataRootToken)) {
  throw "WINDOWS_INSTALLER_DEFAULT_USER_DATA_ROOT_MISSING:$($defaults.userData.root)"
}
if (-not $hooks.Contains($expectedAuthDbToken)) {
  throw "WINDOWS_INSTALLER_DEFAULT_AUTH_DB_PATH_MISSING:$($defaults.userData.authDatabase)"
}
if (-not $hooks.Contains('/SD IDYES IDYES lex_account_policy_done IDNO lex_confirm_account_reset')) {
  throw "WINDOWS_INSTALLER_DEFAULT_ACCOUNT_PRESERVE_POLICY_MISSING:$($defaults.userData.silentInstallDefault)"
}
if (-not $hooks.Contains('/SD IDNO IDYES lex_uninstall_delete_user_data IDNO lex_uninstall_keep_user_data')) {
  throw "WINDOWS_INSTALLER_DEFAULT_UNINSTALL_DATA_POLICY_MISSING:$($defaults.userData.silentUninstallDefault)"
}
if (-not $hooks.Contains('RMDir /r "$PROFILE\.lex-machina\data"')) {
  throw "WINDOWS_INSTALLER_DEFAULT_ACCOUNT_RESET_DELETE_MISSING"
}

$expectedCacheToken = 'Join-Path $env:LOCALAPPDATA "LexMachina\bootstrap-cache"'
if (-not $bootstrap.Contains($expectedCacheToken)) {
  throw "WINDOWS_INSTALLER_DEFAULT_CACHE_ROOT_MISSING:$($defaults.bootstrapCacheRoot)"
}

foreach ($productionSource in @(
  @{ Label = "tauri-config"; Text = (Get-Content -Raw -LiteralPath $ConfigPath) },
  @{ Label = "release-manifest"; Text = (Get-Content -Raw -LiteralPath $ManifestPath) },
  @{ Label = "nsis-hooks"; Text = $hooks },
  @{ Label = "online-bootstrap"; Text = $bootstrap }
)) {
  if ($productionSource.Text -match '(?i)C:[\\/]Users[\\/]') {
    throw "WINDOWS_INSTALLER_HARDCODED_USER_PROFILE:$($productionSource.Label)"
  }
}

Write-Host "WINDOWS_INSTALLER_DEFAULTS_PASS"
Write-Host "Installer mechanics are frozen; program payload/version/download SHA-256 values remain intentionally mutable."
