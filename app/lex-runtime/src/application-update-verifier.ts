import { spawnSync } from "node:child_process";

export type VerifiedApplicationPublisher = {
  verification: "AUTHENTICODE";
  subject: string;
  thumbprint: string;
};

export interface ApplicationInstallerVerifier {
  verify(installerPath: string): VerifiedApplicationPublisher;
}

function normalizedTrustedThumbprint(value: string | undefined): string {
  const normalized = value?.replaceAll(/\s+/g, "").toUpperCase() ?? "";
  if (!/^[A-F0-9]{40}$/.test(normalized)) {
    throw new Error("APPLICATION_UPDATE_SIGNER_POLICY_MISSING");
  }
  return normalized;
}

export class WindowsAuthenticodeInstallerVerifier
implements ApplicationInstallerVerifier {
  constructor(
    private readonly trustedThumbprint: string | undefined =
      process.env.LEX_UPDATE_SIGNER_THUMBPRINT
  ) {}

  verify(installerPath: string): VerifiedApplicationPublisher {
    if (process.platform !== "win32") {
      throw new Error("APPLICATION_UPDATE_PLATFORM_UNSUPPORTED");
    }
    const trusted = normalizedTrustedThumbprint(this.trustedThumbprint);
    const command = [
      "$ErrorActionPreference='Stop'",
      "$signature=Get-AuthenticodeSignature -LiteralPath $args[0]",
      "if ($signature.Status -ne 'Valid' -or $null -eq $signature.SignerCertificate) { exit 23 }",
      "$result=[ordered]@{subject=$signature.SignerCertificate.Subject;thumbprint=$signature.SignerCertificate.Thumbprint}",
      "$result | ConvertTo-Json -Compress"
    ].join("; ");
    const result = spawnSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        command,
        installerPath
      ],
      {
        encoding: "utf8",
        windowsHide: true,
        timeout: 30_000
      }
    );
    if (result.status !== 0) {
      throw new Error("APPLICATION_UPDATE_SIGNATURE_INVALID");
    }
    let parsed: { subject?: unknown; thumbprint?: unknown };
    try {
      parsed = JSON.parse(result.stdout.trim()) as typeof parsed;
    } catch {
      throw new Error("APPLICATION_UPDATE_SIGNATURE_RESULT_INVALID");
    }
    if (
      typeof parsed.subject !== "string" ||
      typeof parsed.thumbprint !== "string"
    ) {
      throw new Error("APPLICATION_UPDATE_SIGNATURE_RESULT_INVALID");
    }
    const actual = parsed.thumbprint.replaceAll(/\s+/g, "").toUpperCase();
    if (actual !== trusted) {
      throw new Error("APPLICATION_UPDATE_SIGNER_NOT_TRUSTED");
    }
    return {
      verification: "AUTHENTICODE",
      subject: parsed.subject,
      thumbprint: actual
    };
  }
}
