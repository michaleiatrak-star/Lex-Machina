import {
  createHash
} from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  spawnSync
} from "node:child_process";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from "vitest";
import {
  WindowsAuthenticodeInstallerVerifier
} from "../src/application-update-verifier.js";
import {
  MaintenanceService
} from "../src/maintenance-service.js";
import type {
  UpdateDiscovery,
  UpdateDiscoveryResult
} from "../src/update-discovery.js";

const tempRoots: string[] = [];
const testThumbprints:
  string[] = [];

function psLiteral(
  value: string
): string {
  return `'${value.replaceAll(
    "'",
    "''"
  )}'`;
}

function powershell(
  command: string
): string {
  const result =
    spawnSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        command
      ],
      {
        encoding: "utf8",
        windowsHide: true,
        timeout: 60_000
      }
    );
  if (
    result.status !== 0
  ) {
    throw new Error(
      [
        "WINDOWS_AUTHENTICODE_TEST_POWERSHELL_FAILED",
        result.stdout.trim(),
        result.stderr.trim()
      ].filter(Boolean).join(":")
    );
  }
  return result.stdout.trim();
}

function createTrustedTestSigner(
  target: string
): string {
  const command = [
    "$ErrorActionPreference='Stop'",
    `$target=${psLiteral(target)}`,
    "$rsa=[System.Security.Cryptography.RSA]::Create(2048)",
    "$dn=[System.Security.Cryptography.X509Certificates.X500DistinguishedName]::new('CN=Lex Machina CI Foreign Signer')",
    "$req=[System.Security.Cryptography.X509Certificates.CertificateRequest]::new($dn,$rsa,[System.Security.Cryptography.HashAlgorithmName]::SHA256,[System.Security.Cryptography.RSASignaturePadding]::Pkcs1)",
    "$req.CertificateExtensions.Add([System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new([System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::DigitalSignature,$true))",
    "$oids=[System.Security.Cryptography.OidCollection]::new()",
    "$null=$oids.Add([System.Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.3'))",
    "$req.CertificateExtensions.Add([System.Security.Cryptography.X509Certificates.X509EnhancedKeyUsageExtension]::new($oids,$true))",
    "$req.CertificateExtensions.Add([System.Security.Cryptography.X509Certificates.X509SubjectKeyIdentifierExtension]::new($req.PublicKey,$false))",
    "$cert=$req.CreateSelfSigned([DateTimeOffset]::UtcNow.AddHours(-1),[DateTimeOffset]::UtcNow.AddDays(2))",
    "$stores=@('My','Root','TrustedPublisher')",
    "foreach($storeName in $stores){",
    "  $store=[System.Security.Cryptography.X509Certificates.X509Store]::new($storeName,[System.Security.Cryptography.X509Certificates.StoreLocation]::CurrentUser)",
    "  $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)",
    "  try { $store.Add($cert) } finally { $store.Close() }",
    "}",
    "$signed=Set-AuthenticodeSignature -LiteralPath $target -Certificate $cert -HashAlgorithm SHA256",
    "if ($signed.Status -ne 'Valid') { throw ('TEST_SIGNATURE_NOT_VALID:' + $signed.Status) }",
    "$check=Get-AuthenticodeSignature -LiteralPath $target",
    "if ($check.Status -ne 'Valid') { throw ('TEST_SIGNATURE_RECHECK_NOT_VALID:' + $check.Status) }",
    "$thumb=$cert.Thumbprint",
    "$cert.Dispose()",
    "$rsa.Dispose()",
    "$thumb"
  ].join("; ");

  const output =
    powershell(
      command
    )
      .split(/\r?\n/)
      .map((line) =>
        line.trim()
      )
      .filter(Boolean)
      .at(-1);

  if (
    !output ||
    !/^[A-F0-9]{40}$/i.test(
      output
    )
  ) {
    throw new Error(
      "WINDOWS_AUTHENTICODE_TEST_THUMBPRINT_INVALID"
    );
  }
  testThumbprints.push(
    output.toUpperCase()
  );
  return output.toUpperCase();
}

function cleanupCertificate(
  thumbprint: string
): void {
  const escaped =
    thumbprint.replace(
      /[^A-F0-9]/gi,
      ""
    );
  if (
    !/^[A-F0-9]{40}$/i.test(
      escaped
    )
  ) {
    return;
  }

  try {
    powershell(
      [
        "$ErrorActionPreference='SilentlyContinue'",
        `$thumb=${psLiteral(escaped)}`,
        "$stores=@('My','Root','TrustedPublisher')",
        "foreach($storeName in $stores){",
        "  $store=[System.Security.Cryptography.X509Certificates.X509Store]::new($storeName,[System.Security.Cryptography.X509Certificates.StoreLocation]::CurrentUser)",
        "  $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)",
        "  try {",
        "    foreach($cert in @($store.Certificates.Find([System.Security.Cryptography.X509Certificates.X509FindType]::FindByThumbprint,$thumb,$false))){ $store.Remove($cert) }",
        "  } finally { $store.Close() }",
        "}"
      ].join("; ")
    );
  } catch {
    // Best-effort CI cleanup; never mask the actual test result.
  }
}

beforeEach(() => {
  if (
    process.platform !==
      "win32"
  ) {
    return;
  }
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-authenticode-foreign-"
      )
    );
  tempRoots.push(root);
});

afterEach(() => {
  for (
    const thumbprint
    of testThumbprints.splice(0)
  ) {
    cleanupCertificate(
      thumbprint
    );
  }
  for (
    const root
    of tempRoots.splice(0)
  ) {
    fs.rmSync(
      root,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe.skipIf(
  process.platform !== "win32"
)(
  "Windows application update signer pinning",
  () => {
    it(
      "rejects a correctly hashed Authenticode-valid installer signed by a foreign certificate",
      async () => {
        const root =
          tempRoots.at(-1)!;
        const source =
          path.join(
            process.env.SystemRoot ??
              "C:\\Windows",
            "System32",
            "where.exe"
          );
        if (
          !fs.existsSync(
            source
          )
        ) {
          throw new Error(
            "WINDOWS_AUTHENTICODE_TEST_SOURCE_EXE_MISSING"
          );
        }

        const signed =
          path.join(
            root,
            "LexMachina-Foreign-Signer.exe"
          );
        fs.copyFileSync(
          source,
          signed
        );
        const actualSigner =
          createTrustedTestSigner(
            signed
          );

        const bytes =
          fs.readFileSync(
            signed
          );
        const sha256 =
          createHash("sha256")
            .update(bytes)
            .digest("hex");

        const result:
          UpdateDiscoveryResult = {
            currentVersion:
              "0.1.3",
            status:
              "AVAILABLE",
            checkedAt:
              "2026-09-18T10:00:00.000Z",
            latestVersion:
              "0.1.4",
            installer: {
              name:
                "LexMachina-Windows-Online-0.1.4.exe",
              url:
                "https://example.invalid/LexMachina-Windows-Online-0.1.4.exe",
              sha256,
              bytes:
                bytes.byteLength
            }
          };

        const discovery:
          UpdateDiscovery = {
            async check() {
              return result;
            }
          };
        const fetchImpl =
          (async (
            input:
              | RequestInfo
              | URL
          ) => {
            const url =
              typeof input ===
                "string"
                ? input
                : input instanceof URL
                  ? input.toString()
                  : input.url;
            if (
              url !==
                result.installer!
                  .url
            ) {
              return new Response(
                "not found",
                { status: 404 }
              );
            }
            return new Response(
              bytes,
              { status: 200 }
            );
          }) as
            typeof fetch;

        const deliberatelyDifferent =
          actualSigner ===
            "A".repeat(40)
            ? "B".repeat(40)
            : "A".repeat(40);

        const maintenance =
          new MaintenanceService(
            discovery,
            fetchImpl,
            new WindowsAuthenticodeInstallerVerifier(
              [
                deliberatelyDifferent
              ]
            )
          );

        await expect(
          maintenance
            .downloadApplicationUpdate()
        ).rejects.toThrow(
          "APPLICATION_UPDATE_SIGNER_NOT_TRUSTED"
        );
      }
    );
  }
);
