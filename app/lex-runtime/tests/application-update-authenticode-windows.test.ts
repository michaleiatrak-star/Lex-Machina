import {
  createHash
} from "node:crypto";
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
function copyTrustedForeignSignedExecutable(
  targetRoot: string
): string {
  const systemRoot =
    process.env.SystemRoot ??
    "C:\\Windows";
  const programFiles =
    process.env.ProgramFiles ??
    "C:\\Program Files";
  const programFilesX86 =
    process.env[
      "ProgramFiles(x86)"
    ] ??
    "C:\\Program Files (x86)";
  const candidates = [
    process.execPath,
    path.join(
      programFiles,
      "PowerShell",
      "7",
      "pwsh.exe"
    ),
    path.join(
      programFiles,
      "dotnet",
      "dotnet.exe"
    ),
    path.join(
      programFiles,
      "Git",
      "bin",
      "git.exe"
    ),
    path.join(
      programFilesX86,
      "Git",
      "bin",
      "git.exe"
    ),
    path.join(
      systemRoot,
      "System32",
      "WindowsPowerShell",
      "v1.0",
      "powershell.exe"
    ),
    path.join(
      systemRoot,
      "System32",
      "msiexec.exe"
    ),
    path.join(
      systemRoot,
      "System32",
      "notepad.exe"
    ),
    path.join(
      systemRoot,
      "System32",
      "where.exe"
    )
  ];

  const target =
    path.join(
      targetRoot,
      "LexMachina-Foreign-Signer.exe"
    );
  const probe =
    new WindowsAuthenticodeInstallerVerifier(
      ["A".repeat(40)]
    );
  const failures:
    string[] = [];

  for (
    const candidate
    of candidates
  ) {
    if (
      !fs.existsSync(
        candidate
      )
    ) {
      continue;
    }

    fs.copyFileSync(
      candidate,
      target
    );
    try {
      probe.verify(target);
      failures.push(
        `${path.basename(candidate)}:UNEXPECTED_PIN_MATCH`
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);
      if (
        message ===
          "APPLICATION_UPDATE_SIGNER_NOT_TRUSTED"
      ) {
        return target;
      }
      failures.push(
        `${path.basename(candidate)}:${message}`
      );
    }

    fs.rmSync(
      target,
      { force: true }
    );
  }

  throw new Error(
    [
      "WINDOWS_AUTHENTICODE_TRUSTED_FOREIGN_EXE_NOT_FOUND",
      ...failures
    ].join("|")
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
          copyTrustedForeignSignedExecutable(
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
