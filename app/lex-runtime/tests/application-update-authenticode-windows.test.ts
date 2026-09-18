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
        timeout: 120_000
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

function findSignTool(): string {
  const where = spawnSync(
    path.join(
      process.env.SystemRoot ??
        "C:\\Windows",
      "System32",
      "where.exe"
    ),
    ["signtool.exe"],
    {
      encoding: "utf8",
      windowsHide: true,
      timeout: 10_000
    }
  );
  const fromPath =
    where.status === 0
      ? where.stdout
          .split(/\r?\n/)
          .map((line) =>
            line.trim()
          )
          .find((line) =>
            line &&
            fs.existsSync(line)
          )
      : undefined;
  if (fromPath) {
    return fromPath;
  }

  const programFilesX86 =
    process.env[
      "ProgramFiles(x86)"
    ] ??
    "C:\\Program Files (x86)";
  const binRoot =
    path.join(
      programFilesX86,
      "Windows Kits",
      "10",
      "bin"
    );
  if (
    fs.existsSync(binRoot)
  ) {
    const versions =
      fs.readdirSync(
        binRoot,
        {
          withFileTypes: true
        }
      )
        .filter(
          (entry) =>
            entry.isDirectory()
        )
        .map(
          (entry) =>
            entry.name
        )
        .sort()
        .reverse();
    for (
      const version
      of versions
    ) {
      const candidate =
        path.join(
          binRoot,
          version,
          "x64",
          "signtool.exe"
        );
      if (
        fs.existsSync(
          candidate
        )
      ) {
        return candidate;
      }
    }
  }

  throw new Error(
    "WINDOWS_AUTHENTICODE_TEST_SIGNTOOL_MISSING"
  );
}

function createTrustedTestSigner(
  target: string
): string {
  const root =
    path.dirname(target);
  const pfx =
    path.join(
      root,
      "foreign-signer.pfx"
    );
  const password =
    "LexMachina-CI-" +
    Math.random()
      .toString(16)
      .slice(2);
  const cer = path.join(
    root,
    "foreign-signer.cer"
  );
  const command = [
    "$ErrorActionPreference='Stop'",
    `$pfx=${psLiteral(pfx)}`,
    `$cer=${psLiteral(cer)}`,
    `$plain=${psLiteral(password)}`,
    "$secure=ConvertTo-SecureString $plain -AsPlainText -Force",
    "$cert=New-SelfSignedCertificate -Type CodeSigningCert -Subject 'CN=Lex Machina CI Foreign Signer' -CertStoreLocation 'Cert:\\CurrentUser\\My' -KeyExportPolicy Exportable -KeyLength 2048 -HashAlgorithm SHA256 -NotAfter ([DateTime]::UtcNow.AddDays(2))",
    "Export-PfxCertificate -Cert $cert -FilePath $pfx -Password $secure -Force | Out-Null",
    "Export-Certificate -Cert $cert -FilePath $cer -Force | Out-Null",
    "Import-Certificate -FilePath $cer -CertStoreLocation 'Cert:\\CurrentUser\\Root' | Out-Null",
    "Import-Certificate -FilePath $cer -CertStoreLocation 'Cert:\\CurrentUser\\TrustedPublisher' | Out-Null",
    "$thumb=$cert.Thumbprint",
    "$cert.Reset()",
    "$thumb"
  ].join("; ");

  const output =
    powershell(command)
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

  const signTool =
    findSignTool();
  const signed =
    spawnSync(
      signTool,
      [
        "sign",
        "/fd",
        "SHA256",
        "/f",
        pfx,
        "/p",
        password,
        target
      ],
      {
        encoding: "utf8",
        windowsHide: true,
        timeout: 30_000
      }
    );
  if (
    signed.status !== 0
  ) {
    throw new Error(
      [
        "WINDOWS_AUTHENTICODE_TEST_SIGN_FAILED",
        signed.stdout.trim(),
        signed.stderr.trim()
      ]
        .filter(Boolean)
        .join(":")
    );
  }

  const verified =
    spawnSync(
      signTool,
      [
        "verify",
        "/pa",
        "/all",
        target
      ],
      {
        encoding: "utf8",
        windowsHide: true,
        timeout: 30_000
      }
    );
  if (
    verified.status !== 0
  ) {
    throw new Error(
      [
        "WINDOWS_AUTHENTICODE_TEST_VERIFY_FAILED",
        verified.stdout.trim(),
        verified.stderr.trim()
      ]
        .filter(Boolean)
        .join(":")
    );
  }

  fs.rmSync(
    pfx,
    { force: true }
  );
  fs.rmSync(
    cer,
    { force: true }
  );
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
        "$stores=@('My','Root','TrustedPeople','TrustedPublisher')",
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
