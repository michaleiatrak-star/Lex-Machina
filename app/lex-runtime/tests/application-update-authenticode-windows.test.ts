import {
  createHash
} from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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
const testCertificateThumbprints: string[] = [];

function powershell(
  script: string,
  extraEnv: Record<string, string> = {}
): string {
  const result = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      script
    ],
    {
      encoding: "utf8",
      windowsHide: true,
      timeout: 60_000,
      env: {
        ...process.env,
        ...extraEnv
      }
    }
  );
  if (result.status !== 0) {
    throw new Error(
      [
        "WINDOWS_AUTHENTICODE_TEST_POWERSHELL_FAILED",
        result.stdout.trim(),
        result.stderr.trim()
      ].filter(Boolean).join("|")
    );
  }
  return result.stdout.trim();
}

function createTrustedForeignSignedExecutable(
  targetRoot: string
): string {
  const source =
    process.execPath;
  const target =
    path.join(
      targetRoot,
      "LexMachina-Foreign-Signer.exe"
    );
  fs.copyFileSync(
    source,
    target
  );

  const certFile =
    path.join(
      targetRoot,
      "foreign-signer.cer"
    );
  const script = [
    "$ErrorActionPreference='Stop'",
    "$target=$env:LEX_AUTH_TEST_TARGET",
    "$certFile=$env:LEX_AUTH_TEST_CERT_FILE",
    "$cert=New-SelfSignedCertificate -Type CodeSigningCert -Subject 'CN=Lex Machina Foreign Signer Test' -CertStoreLocation 'Cert:\\CurrentUser\\My' -KeyAlgorithm RSA -KeyLength 2048 -HashAlgorithm SHA256 -KeyExportPolicy Exportable -NotAfter (Get-Date).AddDays(2)",
    "Export-Certificate -Cert $cert -FilePath $certFile -Force | Out-Null",
    "Import-Certificate -FilePath $certFile -CertStoreLocation 'Cert:\\CurrentUser\\Root' | Out-Null",
    "Import-Certificate -FilePath $certFile -CertStoreLocation 'Cert:\\CurrentUser\\TrustedPublisher' | Out-Null",
    "$signed=Set-AuthenticodeSignature -LiteralPath $target -Certificate $cert -HashAlgorithm SHA256",
    "if ($signed.Status -ne 'Valid') { throw ('SIGNATURE_NOT_VALID:' + $signed.Status) }",
    "$check=Get-AuthenticodeSignature -LiteralPath $target",
    "if ($check.Status -ne 'Valid' -or $null -eq $check.SignerCertificate) { throw ('SIGNATURE_RECHECK_FAILED:' + $check.Status) }",
    "$check.SignerCertificate.Thumbprint"
  ].join("; ");

  const thumbprint =
    powershell(
      script,
      {
        LEX_AUTH_TEST_TARGET:
          target,
        LEX_AUTH_TEST_CERT_FILE:
          certFile
      }
    )
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .at(-1);

  if (
    !thumbprint ||
    !/^[A-Fa-f0-9]{40}$/.test(
      thumbprint
    )
  ) {
    throw new Error(
      "WINDOWS_AUTHENTICODE_TEST_CERTIFICATE_INVALID"
    );
  }

  testCertificateThumbprints.push(
    thumbprint.toUpperCase()
  );

  const probe =
    new WindowsAuthenticodeInstallerVerifier(
      ["A".repeat(40)]
    );
  expect(() =>
    probe.verify(target)
  ).toThrow(
    "APPLICATION_UPDATE_SIGNER_NOT_TRUSTED"
  );

  return target;
}

function removeTestCertificate(
  thumbprint: string
): void {
  const script = [
    "$ErrorActionPreference='SilentlyContinue'",
    "$thumb=$env:LEX_AUTH_TEST_THUMBPRINT",
    "foreach ($store in @('Cert:\\CurrentUser\\My','Cert:\\CurrentUser\\Root','Cert:\\CurrentUser\\TrustedPublisher')) {",
    "  Get-ChildItem -LiteralPath $store | Where-Object { $_.Thumbprint -eq $thumb } | Remove-Item -Force",
    "}"
  ].join("; ");
  spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      script
    ],
    {
      encoding: "utf8",
      windowsHide: true,
      timeout: 30_000,
      env: {
        ...process.env,
        LEX_AUTH_TEST_THUMBPRINT:
          thumbprint
      }
    }
  );
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
    of testCertificateThumbprints.splice(0)
  ) {
    removeTestCertificate(
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
        const signed =
          createTrustedForeignSignedExecutable(
            root
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
          "A".repeat(40);

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
      },
      180_000
    );
  }
);
