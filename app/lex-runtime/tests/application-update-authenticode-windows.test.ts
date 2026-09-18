import {
  createHash
} from "node:crypto";
import {
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

describe(
  "Windows application update signer pinning",
  () => {
    it(
      "rejects a correctly hashed installer whose valid Authenticode identity is not pinned",
      async () => {
        const bytes =
          Buffer.from(
            "deterministic-authenticode-fixture",
            "utf8"
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

        const trustedThumbprint =
          "A".repeat(40);
        const foreignThumbprint =
          "B".repeat(40);

        const verifier =
          new WindowsAuthenticodeInstallerVerifier(
            [
              trustedThumbprint
            ],
            undefined,
            (installerPath) => {
              expect(
                installerPath
                  .toLowerCase()
                  .endsWith(".exe")
              ).toBe(true);
              return {
                subject:
                  "CN=Foreign Test Publisher",
                thumbprint:
                  foreignThumbprint,
                productVersion:
                  "0.1.4"
              };
            }
          );

        const maintenance =
          new MaintenanceService(
            discovery,
            fetchImpl,
            verifier
          );

        await expect(
          maintenance
            .downloadApplicationUpdate()
        ).rejects.toThrow(
          "APPLICATION_UPDATE_SIGNER_NOT_TRUSTED"
        );
      }
    );

    it(
      "accepts the pinned signer identity only when the product version also matches",
      () => {
        const trusted =
          "C".repeat(40);
        const verifier =
          new WindowsAuthenticodeInstallerVerifier(
            [trusted],
            undefined,
            () => ({
              subject:
                "CN=Lex Machina Release",
              thumbprint:
                trusted,
              productVersion:
                "0.1.4.0"
            })
          );

        expect(
          verifier.verify(
            "fixture.exe",
            "0.1.4"
          )
        ).toEqual({
          verification:
            "AUTHENTICODE",
          subject:
            "CN=Lex Machina Release",
          thumbprint:
            trusted,
          productVersion:
            "0.1.4"
        });

        expect(() =>
          verifier.verify(
            "fixture.exe",
            "0.1.5"
          )
        ).toThrow(
          "APPLICATION_UPDATE_VERSION_MISMATCH"
        );
      }
    );
  }
);
