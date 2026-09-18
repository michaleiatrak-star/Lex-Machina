param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("FreshInstall", "Uninstall", "VerifyPurged")]
  [string]$Mode,

  [string]$InstallStatePath,

  [string]$InstallRoot
)

$ErrorActionPreference = "Stop"

function Remove-TreeStrict(
  [string]$Path,
  [string]$Label
) {
  if ([string]::IsNullOrWhiteSpace($Path)) {
    return
  }
  $full = [IO.Path]::GetFullPath($Path)
  if (-not (Test-Path -LiteralPath $full)) {
    return
  }
  Remove-Item -LiteralPath $full -Recurse -Force -ErrorAction Stop
  if (Test-Path -LiteralPath $full) {
    throw "PROFILE_PURGE_PATH_REMAINS:${Label}:$full"
  }
  Write-Host "Removed ${Label}: $full"
}

function Stop-LexMachinaProcesses([string]$Root) {
  if ([string]::IsNullOrWhiteSpace($Root)) {
    return
  }
  $normalizedRoot = [IO.Path]::GetFullPath($Root).TrimEnd('\') + '\'
  $allowedNames = @(
    "lex-machina.exe",
    "Lex Machina.exe",
    "lex-runtime-sidecar.exe",
    "node.exe",
    "python.exe"
  )

  Get-Process -ErrorAction SilentlyContinue | ForEach-Object {
    $process = $_
    if ($process.Id -eq $PID) {
      return
    }
    $candidate = $null
    try { $candidate = $process.Path } catch {}
    if ([string]::IsNullOrWhiteSpace($candidate)) {
      return
    }
    $full = [IO.Path]::GetFullPath($candidate)
    if (
      $full.StartsWith($normalizedRoot, [StringComparison]::OrdinalIgnoreCase) -and
      $allowedNames -contains [IO.Path]::GetFileName($full)
    ) {
      Write-Host "Stopping Lex Machina process: $($process.Id) $full"
      Stop-Process -Id $process.Id -Force -ErrorAction Stop
    }
  }
}

if ($Mode -eq "FreshInstall") {
  if ([string]::IsNullOrWhiteSpace($InstallStatePath)) {
    throw "PROFILE_PURGE_INSTALL_STATE_REQUIRED"
  }
  $stateFile = [IO.Path]::GetFullPath($InstallStatePath)
  if (-not (Test-Path -LiteralPath $stateFile -PathType Leaf)) {
    throw "PROFILE_PURGE_INSTALL_STATE_MISSING:$stateFile"
  }
  try {
    $installState = Get-Content -Raw -LiteralPath $stateFile | ConvertFrom-Json
  } catch {
    throw "PROFILE_PURGE_INSTALL_STATE_INVALID:$stateFile"
  }
  if ($installState.state -ne "FRESH") {
    Write-Host "LEX_PROFILE_RESET_SKIPPED:$($installState.state)"
    exit 0
  }
}

if ($Mode -ne "VerifyPurged") {
  Stop-LexMachinaProcesses $InstallRoot
}

if (-not ("LexMachinaCredentialPurge" -as [type])) {
  # NSIS runs hook scripts from $PLUGINSDIR. That directory contains the native
  # NSIS System.dll plugin, which Windows PowerShell Add-Type can mistake for
  # the .NET Framework System.dll when it invokes its compiler. Force a safe
  # native working directory during compilation, then restore the caller's cwd.
  $previousNativeCurrentDirectory = [Environment]::CurrentDirectory
  $safeCompilerWorkingDirectory = if ($env:SystemRoot) {
    [IO.Path]::GetFullPath($env:SystemRoot)
  } else {
    [IO.Path]::GetTempPath()
  }
  try {
    [Environment]::CurrentDirectory = $safeCompilerWorkingDirectory
    Add-Type -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class LexMachinaCredentialPurge
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct CREDENTIAL
    {
        public UInt32 Flags;
        public UInt32 Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public UInt32 CredentialBlobSize;
        public IntPtr CredentialBlob;
        public UInt32 Persist;
        public UInt32 AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    [DllImport("advapi32.dll", EntryPoint = "CredEnumerateW", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CredEnumerate(
        string filter,
        UInt32 flags,
        out UInt32 count,
        out IntPtr credentials
    );

    [DllImport("advapi32.dll", EntryPoint = "CredDeleteW", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CredDelete(
        string target,
        UInt32 type,
        UInt32 flags
    );

    [DllImport("advapi32.dll", SetLastError = false)]
    private static extern void CredFree(IntPtr buffer);

    private static bool IsLexMachinaTarget(string target)
    {
        if (String.IsNullOrWhiteSpace(target))
        {
            return false;
        }
        string[] services = new string[] {
            "LexMachina/Desktop",
            "LexMachina/ProviderCredential",
            "LexMachina/SupportIdentity"
        };
        foreach (string service in services)
        {
            if (target.IndexOf(service, StringComparison.OrdinalIgnoreCase) >= 0)
            {
                return true;
            }
        }
        return false;
    }

    public static string[] ListAll()
    {
        UInt32 count;
        IntPtr credentials;
        if (!CredEnumerate(null, 0, out count, out credentials))
        {
            int error = Marshal.GetLastWin32Error();
            if (error == 1168)
            {
                return new string[0];
            }
            throw new Win32Exception(error, "CredEnumerate failed");
        }

        List<string> matches = new List<string>();
        try
        {
            for (UInt32 index = 0; index < count; index++)
            {
                IntPtr credentialPointer = Marshal.ReadIntPtr(
                    credentials,
                    checked((int)index * IntPtr.Size)
                );
                CREDENTIAL credential =
                    (CREDENTIAL)Marshal.PtrToStructure(
                        credentialPointer,
                        typeof(CREDENTIAL)
                    );
                if (IsLexMachinaTarget(credential.TargetName))
                {
                    matches.Add(credential.TargetName);
                }
            }
        }
        finally
        {
            CredFree(credentials);
        }
        return matches.ToArray();
    }

    public static string[] DeleteAll()
    {
        UInt32 count;
        IntPtr credentials;
        if (!CredEnumerate(null, 0, out count, out credentials))
        {
            int error = Marshal.GetLastWin32Error();
            if (error == 1168)
            {
                return new string[0];
            }
            throw new Win32Exception(error, "CredEnumerate failed");
        }

        List<string> deleted = new List<string>();
        try
        {
            for (UInt32 index = 0; index < count; index++)
            {
                IntPtr credentialPointer = Marshal.ReadIntPtr(
                    credentials,
                    checked((int)index * IntPtr.Size)
                );
                CREDENTIAL credential =
                    (CREDENTIAL)Marshal.PtrToStructure(
                        credentialPointer,
                        typeof(CREDENTIAL)
                    );
                if (!IsLexMachinaTarget(credential.TargetName))
                {
                    continue;
                }
                if (!CredDelete(credential.TargetName, credential.Type, 0))
                {
                    int error = Marshal.GetLastWin32Error();
                    if (error != 1168)
                    {
                        throw new Win32Exception(
                            error,
                            "CredDelete failed for " + credential.TargetName
                        );
                    }
                }
                deleted.Add(credential.TargetName);
            }
        }
        finally
        {
            CredFree(credentials);
        }
        return deleted.ToArray();
    }
}
"@
  } finally {
    [Environment]::CurrentDirectory = $previousNativeCurrentDirectory
  }
}

$paths = [Collections.Generic.List[object]]::new()

if ($env:USERPROFILE) {
  $paths.Add([pscustomobject]@{
    Path = (Join-Path $env:USERPROFILE ".lex-machina")
    Label = "user profile, cases and encrypted auth data"
  })
}

if ($env:LOCALAPPDATA) {
  foreach ($relative in @(
    "LexMachina",
    "Lex Machina",
    "pl.lexmachina.desktop"
  )) {
    $paths.Add([pscustomobject]@{
      Path = (Join-Path $env:LOCALAPPDATA $relative)
      Label = "local application data"
    })
  }
}

if ($env:APPDATA) {
  foreach ($relative in @(
    "LexMachina",
    "Lex Machina",
    "pl.lexmachina.desktop"
  )) {
    $paths.Add([pscustomobject]@{
      Path = (Join-Path $env:APPDATA $relative)
      Label = "roaming application data"
    })
  }
}

if ($env:TEMP) {
  foreach ($relative in @(
    "LexMachinaUpdate",
    "LexMachinaOpen"
  )) {
    $paths.Add([pscustomobject]@{
      Path = (Join-Path $env:TEMP $relative)
      Label = "temporary Lex Machina data"
    })
  }
}

$seen = [Collections.Generic.HashSet[string]]::new(
  [StringComparer]::OrdinalIgnoreCase
)

if ($Mode -eq "VerifyPurged") {
  $remainingCredentials = @([LexMachinaCredentialPurge]::ListAll())
  if ($remainingCredentials.Count -gt 0) {
    throw "PROFILE_PURGE_CREDENTIAL_REMAINS:$($remainingCredentials -join ',')"
  }
  foreach ($item in $paths) {
    $full = [IO.Path]::GetFullPath([string]$item.Path)
    if ($seen.Add($full) -and (Test-Path -LiteralPath $full)) {
      throw "PROFILE_PURGE_PATH_REMAINS:$full"
    }
  }
  Write-Host "LEX_PROFILE_PURGE_VERIFY_PASS"
  exit 0
}

$deletedCredentials = [LexMachinaCredentialPurge]::DeleteAll()
foreach ($target in $deletedCredentials) {
  Write-Host "Removed Windows credential: $target"
}

foreach ($item in $paths) {
  $full = [IO.Path]::GetFullPath([string]$item.Path)
  if ($seen.Add($full)) {
    Remove-TreeStrict $full ([string]$item.Label)
  }
}

if ($Mode -eq "FreshInstall") {
  Write-Host "LEX_FRESH_PROFILE_PURGE_PASS"
  Write-Host "Next desktop start will bootstrap a new clean local-admin account."
} else {
  Write-Host "LEX_FULL_UNINSTALL_PURGE_PASS"
}
