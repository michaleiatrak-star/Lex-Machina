import fs from "node:fs";
import {
  createHash
} from "node:crypto";
import {
  afterEach,
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  MaintenanceService,
  applicationUpdateStagingRoot
} from "./maintenance-service.js";
import type {
  ApplicationInstallerVerifier
} from "./application-update-verifier.js";
import type {
  UpdateDiscovery
} from "./update-discovery.js";

afterEach(() => {
  fs.rmSync(
    applicationUpdateStagingRoot(),
    {
      recursive: true,
      force: true
    }
  );
});

describe(
  "application update release-to-installer version binding",
  () => {
    it(
      "passes the discovered release version to Authenticode verification and persists the verified ProductVersion",
      async () => {
        const bytes =
          Buffer.from(
            "signed-installer-fixture",
            "utf8"
          );
        const digest =
          createHash("sha256")
            .update(bytes)
            .digest("hex");

        const discovery:
          UpdateDiscovery = {
            async check() {
              return {
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
                    "LexMachina-Windows-Online-Installer.exe",
                  url:
                    "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-Windows-Online-Installer.exe",
                  sha256:
                    digest,
                  bytes:
                    bytes.byteLength
                }
              };
            }
          };

        const fetchImpl =
          vi.fn(
            async () =>
              new Response(
                bytes,
                {
                  status: 200
                }
              )
          ) as unknown as
            typeof fetch;

        const verify =
          vi.fn(
            (
              _path: string,
              expectedVersion?: string
            ) => {
              expect(
                expectedVersion
              ).toBe("0.1.4");
              return {
                verification:
                  "AUTHENTICODE" as const,
                subject:
                  "CN=Lex Machina Test",
                thumbprint:
                  "A".repeat(40),
                productVersion:
                  "0.1.4"
              };
            }
          );

        const installerVerifier:
          ApplicationInstallerVerifier = {
            verify
          };

        const maintenance =
          new MaintenanceService(
            discovery,
            fetchImpl,
            installerVerifier,
            () => false,
            () => {
              throw new Error(
                "UNUSED_SKILL_VERIFIER"
              );
            },
            () => false,
            () => {
              throw new Error(
                "UNUSED_MODEL_PACK_VERIFIER"
              );
            }
          );

        const result =
          await maintenance
            .downloadApplicationUpdate();

        expect(verify)
          .toHaveBeenCalledTimes(1);
        expect(
          result.version
        ).toBe("0.1.4");
        expect(
          result.publisher
            .productVersion
        ).toBe("0.1.4");

        const receipt =
          JSON.parse(
            fs.readFileSync(
              applicationUpdateStagingRoot() +
                "/" +
                result.receiptToken,
              "utf8"
            )
          ) as {
            version?: unknown;
            publisher?: {
              productVersion?: unknown;
            };
          };

        expect(
          receipt.version
        ).toBe("0.1.4");
        expect(
          receipt.publisher
            ?.productVersion
        ).toBe("0.1.4");
      }
    );
  }
);
