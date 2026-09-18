import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type VerifiedApplicationPublisher = {
  verification: "AUTHENTICODE";
  subject: string;
  thumbprint: string;
  productVersion: string;
};

export interface ApplicationInstallerVerifier {
  verify(
    installerPath: string,
    expectedVersion?: string
  ): VerifiedApplicationPublisher;
}

export type AuthenticodeProbeResult = {
  subject: string;
  thumbprint: string;
  productVersion: string;
};

export type AuthenticodeProbe = (
  installerPath: string
) => AuthenticodeProbeResult;

type UpdateTrustManifest = {
  applicationUpdate?: {
    verification?: unknown;
    trustedSignerThumbprints?: unknown;
  };
};

function normalizeThumbprint(value: string): string {
  return value.replaceAll(/\s+/g, "").toUpperCase();
}

function windowsPowerShellEnvironment(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env
  };
  for (const key of Object.keys(env)) {
    if (
      key.toLowerCase() ===
        "psmodulepath"
    ) {
      delete env[key];
    }
  }
  return env;
}

export function normalizeApplicationProductVersion(
  value: string
): string {
  const match =
    /^(\d+)\.(\d+)\.(\d+)(?:\.0)?$/
      .exec(
        value.trim()
      );
  if (!match) {
    throw new Error(
      "APPLICATION_UPDATE_PRODUCT_VERSION_INVALID"
    );
  }
  return [
    Number(match[1]),
    Number(match[2]),
    Number(match[3])
  ].join(".");
}

export function assertApplicationInstallerVersion(
  actual: string,
  expected: string
): string {
  if (
    !/^\d+\.\d+\.\d+$/.test(
      expected
    )
  ) {
    throw new Error(
      "APPLICATION_UPDATE_EXPECTED_VERSION_INVALID"
    );
  }
  const normalized =
    normalizeApplicationProductVersion(
      actual
    );
  if (normalized !== expected) {
    throw new Error(
      `APPLICATION_UPDATE_VERSION_MISMATCH:expected=${expected}:actual=${normalized}`
    );
  }
  return normalized;
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

function probeWindowsAuthenticode(
  installerPath: string
): AuthenticodeProbeResult {
  if (process.platform !== "win32") {
    throw new Error("APPLICATION_UPDATE_PLATFORM_UNSUPPORTED");
  }
  const command = [
    "$ErrorActionPreference='Stop'",
    "$signature=Get-AuthenticodeSignature -LiteralPath $args[0]",
    "if ($signature.Status -ne 'Valid' -or $null -eq $signature.SignerCertificate) { exit 23 }",
    "$version=(Get-Item -LiteralPath $args[0]).VersionInfo.ProductVersion",
    "if ([string]::IsNullOrWhiteSpace($version)) { exit 24 }",
    "$result=[ordered]@{subject=$signature.SignerCertificate.Subject;thumbprint=$signature.SignerCertificate.Thumbprint;productVersion=$version}",
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
      timeout: 30_000,
      env:
        windowsPowerShellEnvironment()
    }
  );
  if (result.status !== 0) {
    throw new Error("APPLICATION_UPDATE_SIGNATURE_INVALID");
  }

  let parsed: {
    subject?: unknown;
    thumbprint?: unknown;
    productVersion?: unknown;
  };
  try {
    parsed = JSON.parse(result.stdout.trim()) as typeof parsed;
  } catch {
    throw new Error("APPLICATION_UPDATE_SIGNATURE_RESULT_INVALID");
  }
  if (
    typeof parsed.subject !== "string" ||
    typeof parsed.thumbprint !== "string" ||
    typeof parsed.productVersion !== "string"
  ) {
    throw new Error("APPLICATION_UPDATE_SIGNATURE_RESULT_INVALID");
  }
  return {
    subject: parsed.subject,
    thumbprint: parsed.thumbprint,
    productVersion: parsed.productVersion
  };
}

export class WindowsAuthenticodeInstallerVerifier
implements ApplicationInstallerVerifier {
  constructor(
    private readonly configuredTrustedThumbprints?: readonly string[],
    private readonly manifestPath?: string,
    private readonly probe: AuthenticodeProbe =
      probeWindowsAuthenticode
  ) {}

  verify(
    installerPath: string,
    expectedVersion?: string
  ): VerifiedApplicationPublisher {
    const parsed =
      this.probe(
        installerPath
      );
    const actual = normalizeThumbprint(parsed.thumbprint);
    if (!trusted.includes(actual)) {
      throw new Error("APPLICATION_UPDATE_SIGNER_NOT_TRUSTED");
    }
    const productVersion =
      expectedVersion
        ? assertApplicationInstallerVersion(
            parsed.productVersion,
            expectedVersion
          )
        : normalizeApplicationProductVersion(
            parsed.productVersion
          );

    return {
      verification: "AUTHENTICODE",
      subject: parsed.subject,
      thumbprint: actual,
      productVersion
    };
  }
}
