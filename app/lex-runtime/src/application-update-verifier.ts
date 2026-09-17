import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type VerifiedApplicationPublisher = {
  verification: "AUTHENTICODE";
  subject: string;
  thumbprint: string;
};

export interface ApplicationInstallerVerifier {
  verify(installerPath: string): VerifiedApplicationPublisher;
}

type UpdateTrustManifest = {
  applicationUpdate?: {
    verification?: unknown;
    trustedSignerThumbprints?: unknown;
  };
};

function normalizeThumbprint(value: string): string {
  return value.replaceAll(/\s+/g, "").toUpperCase();
}

function validateTrustedThumbprints(values: readonly string[]): string[] {
  const normalized = [
    ...new Set(values.map(normalizeThumbprint))
  ];
  if (
    normalized.length === 0 ||
    normalized.some((value) => !/^[A-F0-9]{40}$/.test(value))
  ) {
    throw new Error("APPLICATION_UPDATE_SIGNER_POLICY_MISSING");
  }
  return normalized;
}

function defaultManifestPath(): string {
  const runtimeRoot = process.env.LEX_RUNTIME_ROOT?.trim();
  if (!runtimeRoot) {
    throw new Error("APPLICATION_UPDATE_RUNTIME_ROOT_MISSING");
  }
  return path.join(path.resolve(runtimeRoot), "release-source.json");
}

export function trustedUpdateSignerThumbprints(
  manifestPath: string = defaultManifestPath()
): string[] {
  let manifest: UpdateTrustManifest;
  try {
    manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8")
    ) as UpdateTrustManifest;
  } catch {
    throw new Error("APPLICATION_UPDATE_SIGNER_POLICY_MISSING");
  }
  if (
    manifest.applicationUpdate?.verification !==
      "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER" ||
    !Array.isArray(
      manifest.applicationUpdate?.trustedSignerThumbprints
    )
  ) {
    throw new Error("APPLICATION_UPDATE_SIGNER_POLICY_MISSING");
  }
  const values = manifest.applicationUpdate
    .trustedSignerThumbprints
    .filter((value): value is string => typeof value === "string");
  return validateTrustedThumbprints(values);
}

export class WindowsAuthenticodeInstallerVerifier
implements ApplicationInstallerVerifier {
  constructor(
    private readonly configuredTrustedThumbprints?: readonly string[],
    private readonly manifestPath?: string
  ) {}

  verify(installerPath: string): VerifiedApplicationPublisher {
    if (process.platform !== "win32") {
      throw new Error("APPLICATION_UPDATE_PLATFORM_UNSUPPORTED");
    }
    const trusted = this.configuredTrustedThumbprints
      ? validateTrustedThumbprints(this.configuredTrustedThumbprints)
      : trustedUpdateSignerThumbprints(this.manifestPath);
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
    const actual = normalizeThumbprint(parsed.thumbprint);
    if (!trusted.includes(actual)) {
      throw new Error("APPLICATION_UPDATE_SIGNER_NOT_TRUSTED");
    }
    return {
      verification: "AUTHENTICODE",
      subject: parsed.subject,
      thumbprint: actual
    };
  }
}
