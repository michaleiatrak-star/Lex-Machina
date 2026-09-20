param(
  [Parameter(Mandatory = $true)]
  [string]$DesktopExePath,

  [Parameter(Mandatory = $true)]
  [string]$InstallerPath,

  [string]$ConfigPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/tauri.conf.json"
  ),

  [string]$IconPath = (
    Join-Path $PSScriptRoot "../lex-desktop/src-tauri/icons/icon.ico"
  )
)

$ErrorActionPreference = "Stop"

$configFile = (Resolve-Path -LiteralPath $ConfigPath).Path
$iconFile = (Resolve-Path -LiteralPath $IconPath).Path
$desktopExe = (Resolve-Path -LiteralPath $DesktopExePath).Path
$installer = (Resolve-Path -LiteralPath $InstallerPath).Path

$config = Get-Content -Raw -LiteralPath $configFile | ConvertFrom-Json
$icons = @($config.bundle.icon)
if ($icons -notcontains "icons/icon.ico") {
  throw "WINDOWS_BRANDING_APP_ICON_NOT_CONFIGURED"
}
if ($config.bundle.windows.nsis.installerIcon -ne "icons/icon.ico") {
  throw "WINDOWS_BRANDING_INSTALLER_ICON_NOT_CONFIGURED"
}
if ($config.bundle.windows.nsis.uninstallerIcon -ne "icons/icon.ico") {
  throw "WINDOWS_BRANDING_UNINSTALLER_ICON_NOT_CONFIGURED"
}

$expectedBrandSha256 = "055686adddaf980c1e2a92bd7957090fdac349529dbf60bc85fd0ef26e367b76"
$actualBrandSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $iconFile).Hash.ToLowerInvariant()
if ($actualBrandSha256 -ne $expectedBrandSha256) {
  throw "WINDOWS_BRANDING_ICON_HASH_MISMATCH:expected=$expectedBrandSha256 actual=$actualBrandSha256"
}

$bytes = [IO.File]::ReadAllBytes($iconFile)
if ($bytes.Length -lt 22) {
  throw "WINDOWS_BRANDING_ICO_TOO_SMALL"
}

function Read-U16([byte[]]$Data, [int]$Offset) {
  return [BitConverter]::ToUInt16($Data, $Offset)
}

function Read-U32([byte[]]$Data, [int]$Offset) {
  return [BitConverter]::ToUInt32($Data, $Offset)
}

if ((Read-U16 $bytes 0) -ne 0 -or (Read-U16 $bytes 2) -ne 1) {
  throw "WINDOWS_BRANDING_ICO_HEADER_INVALID"
}

$count = [int](Read-U16 $bytes 4)
if ($count -lt 5) {
  throw "WINDOWS_BRANDING_ICO_NOT_MULTISIZE:$count"
}

$expected = @(16, 24, 32, 48, 64, 128, 256)
$observed = [Collections.Generic.HashSet[int]]::new()

for ($index = 0; $index -lt $count; $index++) {
  $offset = 6 + ($index * 16)
  if (($offset + 16) -gt $bytes.Length) {
    throw "WINDOWS_BRANDING_ICO_DIRECTORY_TRUNCATED:$index"
  }

  $widthByte = [int]$bytes[$offset]
  $heightByte = [int]$bytes[$offset + 1]
  $width = if ($widthByte -eq 0) { 256 } else { $widthByte }
  $height = if ($heightByte -eq 0) { 256 } else { $heightByte }
  $bitCount = [int](Read-U16 $bytes ($offset + 6))
  $imageBytes = [int64](Read-U32 $bytes ($offset + 8))
  $imageOffset = [int64](Read-U32 $bytes ($offset + 12))

  if ($width -ne $height -or $bitCount -ne 32) {
    throw "WINDOWS_BRANDING_ICO_ENTRY_INVALID:$index"
  }
  if (
    $imageBytes -le 0 -or
    $imageOffset -lt 0 -or
    ($imageOffset + $imageBytes) -gt $bytes.Length
  ) {
    throw "WINDOWS_BRANDING_ICO_ENTRY_BOUNDS_INVALID:$index"
  }

  [void]$observed.Add($width)
}

foreach ($size in $expected) {
  if (-not $observed.Contains($size)) {
    throw "WINDOWS_BRANDING_ICO_SIZE_MISSING:$size"
  }
}

if (-not ("LexMachinaBrandingNative" -as [type])) {
  Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public static class LexMachinaBrandingNative
{
    private const uint LOAD_LIBRARY_AS_DATAFILE = 0x00000002;
    private const uint LOAD_LIBRARY_AS_IMAGE_RESOURCE = 0x00000020;
    private static readonly IntPtr RT_GROUP_ICON = new IntPtr(14);

    private delegate bool EnumResNameProc(
        IntPtr hModule,
        IntPtr lpszType,
        IntPtr lpszName,
        IntPtr lParam
    );

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern IntPtr LoadLibraryEx(
        string lpFileName,
        IntPtr hFile,
        uint dwFlags
    );

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool EnumResourceNames(
        IntPtr hModule,
        IntPtr lpszType,
        EnumResNameProc lpEnumFunc,
        IntPtr lParam
    );

    [DllImport("kernel32.dll")]
    private static extern bool FreeLibrary(IntPtr hModule);

    public static int CountGroupIcons(string path)
    {
        IntPtr module = LoadLibraryEx(
            path,
            IntPtr.Zero,
            LOAD_LIBRARY_AS_DATAFILE | LOAD_LIBRARY_AS_IMAGE_RESOURCE
        );
        if (module == IntPtr.Zero)
        {
            throw new InvalidOperationException(
                "LoadLibraryEx failed: " + Marshal.GetLastWin32Error()
            );
        }

        try
        {
            int count = 0;
            EnumResNameProc callback = delegate(
                IntPtr h,
                IntPtr type,
                IntPtr name,
                IntPtr state
            )
            {
                count++;
                return true;
            };

            EnumResourceNames(
                module,
                RT_GROUP_ICON,
                callback,
                IntPtr.Zero
            );
            GC.KeepAlive(callback);
            return count;
        }
        finally
        {
            FreeLibrary(module);
        }
    }
}
"@
}

foreach ($target in @(
  @{ Path = $desktopExe; Label = "desktop-exe" },
  @{ Path = $installer; Label = "installer" }
)) {
  $groups = [LexMachinaBrandingNative]::CountGroupIcons($target.Path)
  if ($groups -lt 1) {
    throw "WINDOWS_BRANDING_GROUP_ICON_MISSING:$($target.Label)"
  }
  Write-Host "Brand icon resource PASS: $($target.Label) groupIcons=$groups"
}

Write-Host "Pinned brand icon hash PASS: $actualBrandSha256"
Write-Host "WINDOWS_BRANDING_ACCEPTANCE_PASS"
Write-Host "Post-build ICO SHA256: $((Get-FileHash -Algorithm SHA256 -LiteralPath $iconFile).Hash.ToLowerInvariant())"
Write-Host "ICO sizes: $(@($observed | Sort-Object) -join ', ')"
