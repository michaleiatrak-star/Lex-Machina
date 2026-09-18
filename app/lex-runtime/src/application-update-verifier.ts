import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type VerifiedApplicationPublisher =
  | {
      verification: "AUTHENTICODE";
      subject: string;
      thumbprint: string;
      productVersion: string;
    }
  | {
      verification: "UNSIGNED_ALLOWED";
      subject: null;
      thumbprint: null;
      productVersion: string;
      warning:
        "TEMPORARY_UNSIGNED_UPDATE_ALLOWED";
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

export type ProductVersionProbe = (
  installerPath: string
) => string;

type UpdateTrustManifest = {
  applicationUpdate?: {
    verification?: unknown;
    trustedSignerThumbprints?: unknown;
    temporaryUnsignedAllowed?: unknown;
  };
};

type ApplicationUpdateTrustPolicy = {
  mode: "REQUIRED" | "OPTIONAL";
  trustedThumbprints: string[];
};

function normalizeThumbprint(
  value: string
): string {
  return value
    .replaceAll(/\s+/g, "")
    .toUpperCase();
}

function windowsPowerShellEnvironment():
  NodeJS.ProcessEnv {
  const env:
    NodeJS.ProcessEnv = {
      ...process.env
    };
  for (
    const key
    of Object.keys(env)
  ) {
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
  if (
    normalized !== expected
  ) {
    throw new Error(
      `APPLICATION_UPDATE_VERSION_MISMATCH:expected=${expected}:actual=${normalized}`
    );
  }
  return normalized;
}

function validateTrustedThumbprints(
  values: readonly string[],
  allowEmpty = false
): string[] {
  const normalized = [
    ...new Set(
      values.map(
        normalizeThumbprint
      )
    )
  ];
  if (
    (
      !allowEmpty &&
      normalized.length === 0
    ) ||
    normalized.some(
      (value) =>
        !/^[A-F0-9]{40}$/.test(
          value
        )
    )
  ) {
    throw new Error(
      "APPLICATION_UPDATE_SIGNER_POLICY_MISSING"
    );
  }
  return normalized;
}

function defaultManifestPath(): string {
  const runtimeRoot =
    process.env
      .LEX_RUNTIME_ROOT
      ?.trim();
  if (!runtimeRoot) {
    throw new Error(
      "APPLICATION_UPDATE_RUNTIME_ROOT_MISSING"
    );
  }
  return path.join(
    path.resolve(runtimeRoot),
    "release-source.json"
  );
}

function readApplicationUpdateTrustPolicy(
  manifestPath: string =
    defaultManifestPath()
): ApplicationUpdateTrustPolicy {
  let manifest:
    UpdateTrustManifest;
  try {
    manifest = JSON.parse(
      fs.readFileSync(
        manifestPath,
        "utf8"
      )
    ) as UpdateTrustManifest;
  } catch {
    throw new Error(
      "APPLICATION_UPDATE_SIGNER_POLICY_MISSING"
    );
  }

  const update =
    manifest.applicationUpdate;
  const values =
    Array.isArray(
      update
        ?.trustedSignerThumbprints
    )
      ? update!
          .trustedSignerThumbprints!
          .filter(
            (
              value
            ): value is string =>
              typeof value ===
                "string"
          )
      : [];

  if (
    update?.verification ===
      "SHA256_AND_AUTHENTICODE_PINNED_PUBLISHER"
  ) {
    return {
      mode: "REQUIRED",
      trustedThumbprints:
        validateTrustedThumbprints(
          values
        )
    };
  }

  if (
    update?.verification ===
      "SHA256_REQUIRED_SIGNATURE_OPTIONAL" &&
    update.temporaryUnsignedAllowed ===
      true
  ) {
    return {
      mode: "OPTIONAL",
      trustedThumbprints:
        validateTrustedThumbprints(
          values,
          true
        )
    };
  }

  throw new Error(
    "APPLICATION_UPDATE_SIGNER_POLICY_MISSING"
  );
}

export function applicationUpdateSignatureMode(
  manifestPath: string =
    defaultManifestPath()
): "REQUIRED" | "OPTIONAL" {
  return readApplicationUpdateTrustPolicy(
    manifestPath
  ).mode;
}

export function trustedUpdateSignerThumbprints(
  manifestPath: string =
    defaultManifestPath()
): string[] {
  const trusted =
    readApplicationUpdateTrustPolicy(
      manifestPath
    ).trustedThumbprints;
  if (
    trusted.length === 0
  ) {
    throw new Error(
      "APPLICATION_UPDATE_SIGNER_POLICY_MISSING"
    );
  }
  return trusted;
}

function probeWindowsAuthenticode(
  installerPath: string
): AuthenticodeProbeResult {
  if (
    process.platform !==
      "win32"
  ) {
    throw new Error(
      "APPLICATION_UPDATE_PLATFORM_UNSUPPORTED"
    );
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
  const result =
    spawnSync(
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
  if (
    result.status !== 0
  ) {
    throw new Error(
      "APPLICATION_UPDATE_SIGNATURE_INVALID"
    );
  }

  let parsed: {
    subject?: unknown;
    thumbprint?: unknown;
    productVersion?: unknown;
  };
  try {
    parsed = JSON.parse(
      result.stdout.trim()
    ) as typeof parsed;
  } catch {
    throw new Error(
      "APPLICATION_UPDATE_SIGNATURE_RESULT_INVALID"
    );
  }
  if (
    typeof parsed.subject !==
      "string" ||
    typeof parsed.thumbprint !==
      "string" ||
    typeof parsed.productVersion !==
      "string"
  ) {
    throw new Error(
      "APPLICATION_UPDATE_SIGNATURE_RESULT_INVALID"
    );
  }
  return {
    subject:
      parsed.subject,
    thumbprint:
      parsed.thumbprint,
    productVersion:
      parsed.productVersion
  };
}

function probeWindowsProductVersion(
  installerPath: string
): string {
  if (
    process.platform !==
      "win32"
  ) {
    throw new Error(
      "APPLICATION_UPDATE_PLATFORM_UNSUPPORTED"
    );
  }
  const command = [
    "$ErrorActionPreference='Stop'",
    "$version=(Get-Item -LiteralPath $args[0]).VersionInfo.ProductVersion",
    "if ([string]::IsNullOrWhiteSpace($version)) { exit 24 }",
    "Write-Output $version"
  ].join("; ");
  const result =
    spawnSync(
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
  if (
    result.status !== 0 ||
    !result.stdout.trim()
  ) {
    throw new Error(
      "APPLICATION_UPDATE_PRODUCT_VERSION_INVALID"
    );
  }
  return result.stdout.trim();
}

export class WindowsAuthenticodeInstallerVerifier
implements ApplicationInstallerVerifier {
  constructor(
    private readonly configuredTrustedThumbprints?:
      readonly string[],
    private readonly manifestPath?: string,
    private readonly probe:
      AuthenticodeProbe =
        probeWindowsAuthenticode,
    private readonly productVersionProbe:
      ProductVersionProbe =
        probeWindowsProductVersion
  ) {}

  verify(
    installerPath: string,
    expectedVersion?: string
  ): VerifiedApplicationPublisher {
    const policy =
      this.configuredTrustedThumbprints
        ? {
            mode:
              "REQUIRED" as const,
            trustedThumbprints:
              validateTrustedThumbprints(
                this
                  .configuredTrustedThumbprints
              )
          }
        : readApplicationUpdateTrustPolicy(
            this.manifestPath
          );

    if (
      policy.mode === "REQUIRED"
    ) {
      const parsed =
        this.probe(
          installerPath
        );
      const actual =
        normalizeThumbprint(
          parsed.thumbprint
        );
      if (
        !policy.trustedThumbprints
          .includes(actual)
      ) {
        throw new Error(
          "APPLICATION_UPDATE_SIGNER_NOT_TRUSTED"
        );
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
        verification:
          "AUTHENTICODE",
        subject:
          parsed.subject,
        thumbprint:
          actual,
        productVersion
      };
    }

    if (
      policy.trustedThumbprints
        .length > 0
    ) {
      try {
        const parsed =
          this.probe(
            installerPath
          );
        const actual =
          normalizeThumbprint(
            parsed.thumbprint
          );
        if (
          policy.trustedThumbprints
            .includes(actual)
        ) {
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
            verification:
              "AUTHENTICODE",
            subject:
              parsed.subject,
            thumbprint:
              actual,
            productVersion
          };
        }
      } catch {
        // In temporary OPTIONAL mode SHA-256 + ProductVersion
        // remains the trust floor when signing is absent/untrusted.
      }
    }

    const rawProductVersion =
      this.productVersionProbe(
        installerPath
      );
    const productVersion =
      expectedVersion
        ? assertApplicationInstallerVersion(
            rawProductVersion,
            expectedVersion
          )
        : normalizeApplicationProductVersion(
            rawProductVersion
          );

    return {
      verification:
        "UNSIGNED_ALLOWED",
      subject: null,
      thumbprint: null,
      productVersion,
      warning:
        "TEMPORARY_UNSIGNED_UPDATE_ALLOWED"
    };
  }
}
