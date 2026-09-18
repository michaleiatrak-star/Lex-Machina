param(
  [ValidateSet("Probe", "Purge")]
  [string]$Mode = "Purge",
  [string]$DataRootOverride,
  [string]$LocalAppRootOverride,
  [string]$RoamingAppRootOverride,
  [switch]$SkipCredentialManager,
  [switch]$SkipProcessStop
)

$ErrorActionPreference = "Stop"

function Add-UniquePath(
  [Collections.Generic.List[string]]$List,
  [string]$Value
) {
  if ([string]::IsNullOrWhiteSpace($Value)) {
    return
  }
  $full = [IO.Path]::GetFullPath($Value)
  if (-not $List.Contains($full)) {
    $List.Add($full)
  }
}

function Get-LexDataRoots {
  $roots = [Collections.Generic.List[string]]::new()

  if ($DataRootOverride) {
    Add-UniquePath $roots $DataRootOverride
  } elseif ($env:LEX_DATA_DIR) {
    Add-UniquePath $roots $env:LEX_DATA_DIR
  } elseif ($env:USERPROFILE) {
    Add-UniquePath $roots (Join-Path $env:USERPROFILE ".lex-machina")
  }

  if ($LocalAppRootOverride) {
    Add-UniquePath $roots $LocalAppRootOverride
  } elseif ($env:LOCALAPPDATA) {
    Add-UniquePath $roots (Join-Path $env:LOCALAPPDATA "LexMachina")
    Add-UniquePath $roots (Join-Path $env:LOCALAPPDATA "Lex Machina")
    Add-UniquePath $roots (Join-Path $env:LOCALAPPDATA "pl.lexmachina.desktop")
  }

  if ($RoamingAppRootOverride) {
    Add-UniquePath $roots $RoamingAppRootOverride
  } elseif ($env:APPDATA) {
    Add-UniquePath $roots (Join-Path $env:APPDATA "LexMachina")
    Add-UniquePath $roots (Join-Path $env:APPDATA "Lex Machina")
    Add-UniquePath $roots (Join-Path $env:APPDATA "pl.lexmachina.desktop")
  }

  if (
    -not $DataRootOverride -and
    -not $LocalAppRootOverride -and
    -not $RoamingAppRootOverride -and
    $env:TEMP
  ) {
    Add-UniquePath $roots (Join-Path $env:TEMP "LexMachinaOpen")
    Add-UniquePath $roots (Join-Path $env:TEMP "LexMachinaUpdate")
    Add-UniquePath $roots (Join-Path $env:TEMP "LexMachinaOfflineSelfExtract")
  }

  return @($roots)
}

function Ensure-CredentialInterop {
  if ("LexMachina.CredentialNative" -as [type]) {
    return
  }

  Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

namespace LexMachina {
  public static class CredentialNative {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
      public UInt32 Flags;
      public UInt32 Type;
      public IntPtr TargetName;
      public IntPtr Comment;
      public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
      public UInt32 CredentialBlobSize;
      public IntPtr CredentialBlob;
      public UInt32 Persist;
      public UInt32 AttributeCount;
      public IntPtr Attributes;
      public IntPtr TargetAlias;
      public IntPtr UserName;
    }

    [DllImport("advapi32.dll", EntryPoint = "CredEnumerateW",
      CharSet = CharSet.Unicode, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool CredEnumerate(
      string Filter,
      UInt32 Flags,
      out UInt32 Count,
      out IntPtr Credentials
    );

    [DllImport("advapi32.dll", EntryPoint = "CredDeleteW",
      CharSet = CharSet.Unicode, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool CredDelete(
      string TargetName,
      UInt32 Type,
      UInt32 Flags
    );

    [DllImport("advapi32.dll", EntryPoint = "CredFree")]
    public static extern void CredFree(IntPtr Buffer);
  }
}
"@
}

function Get-LexCredentialTargets {
  if ($SkipCredentialManager) {
    return @()
  }

  Ensure-CredentialInterop
  $count = [uint32]0
  $credentials = [IntPtr]::Zero
  $ok = [LexMachina.CredentialNative]::CredEnumerate(
    $null,
    0,
    [ref]$count,
    [ref]$credentials
  )
  if (-not $ok) {
    $errorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
    if ($errorCode -eq 1168) {
      return @()
    }
    throw "LEX_CREDENTIAL_ENUMERATE_FAILED:$errorCode"
  }

  try {
    $targets = [Collections.Generic.List[object]]::new()
    for ($i = 0; $i -lt [int]$count; $i++) {
      $credentialPointer = [Runtime.InteropServices.Marshal]::ReadIntPtr(
        $credentials,
        $i * [IntPtr]::Size
      )
      if ($credentialPointer -eq [IntPtr]::Zero) {
        continue
      }
      $credential = [Runtime.InteropServices.Marshal]::PtrToStructure(
        $credentialPointer,
        [type][LexMachina.CredentialNative+CREDENTIAL]
      )
      if ($credential.Type -ne 1 -or $credential.TargetName -eq [IntPtr]::Zero) {
        continue
      }
      $targetName = [Runtime.InteropServices.Marshal]::PtrToStringUni(
        $credential.TargetName
      )
      if (
        $targetName -and
        (
          $targetName -match "(?i)LexMachina/"
        )
      ) {
        $targets.Add([pscustomobject]@{
          TargetName = $targetName
          Type = [uint32]$credential.Type
        })
      }
    }
    return @($targets)
  } finally {
    [LexMachina.CredentialNative]::CredFree($credentials)
  }
}

function Stop-LexProcesses {
  if ($SkipProcessStop) {
    return
  }

  foreach ($image in @(
    "lex-machina.exe",
    "lex-runtime-sidecar.exe"
  )) {
    & "$env:SystemRoot\System32\taskkill.exe" /IM $image /T /F 2>$null | Out-Null
  }
  Start-Sleep -Milliseconds 350
}

$roots = @(Get-LexDataRoots)
$credentials = @(Get-LexCredentialTargets)
$existingRoots = @(
  $roots | Where-Object {
    Test-Path -LiteralPath $_
  }
)

if ($Mode -eq "Probe") {
  if ($existingRoots.Count -gt 0 -or $credentials.Count -gt 0) {
    Write-Host "LEX_PROFILE_STATE_PRESENT roots=$($existingRoots.Count) credentials=$($credentials.Count)"
    exit 10
  }
  Write-Host "LEX_PROFILE_STATE_EMPTY"
  exit 0
}

Stop-LexProcesses

foreach ($credential in $credentials) {
  $deleted = [LexMachina.CredentialNative]::CredDelete(
    $credential.TargetName,
    $credential.Type,
    0
  )
  if (-not $deleted) {
    $errorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
    if ($errorCode -ne 1168) {
      throw "LEX_CREDENTIAL_DELETE_FAILED:$($credential.TargetName):$errorCode"
    }
  }
}

foreach ($root in $roots) {
  if (Test-Path -LiteralPath $root) {
    Remove-Item -LiteralPath $root -Recurse -Force
  }
}

$remainingRoots = @(
  $roots | Where-Object {
    Test-Path -LiteralPath $_
  }
)
$remainingCredentials = @(Get-LexCredentialTargets)

if (
  $remainingRoots.Count -gt 0 -or
  $remainingCredentials.Count -gt 0
) {
  throw "LEX_PROFILE_PURGE_INCOMPLETE roots=$($remainingRoots.Count) credentials=$($remainingCredentials.Count)"
}

Write-Host "LEX_PROFILE_PURGE_PASS roots=$($roots.Count) credentials=$($credentials.Count)"
