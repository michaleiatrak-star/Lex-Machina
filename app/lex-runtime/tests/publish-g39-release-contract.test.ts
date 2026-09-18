import {
  readFileSync
} from "node:fs";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";
import {
  describe,
  expect,
  it
} from "vitest";

const here = path.dirname(
  fileURLToPath(import.meta.url)
);
const repositoryRoot =
  path.resolve(
    here,
    "../../.."
  );
const workflowPath =
  path.join(
    repositoryRoot,
    ".github",
    "workflows",
    "publish-g39-installers.yml"
  );

describe(
  "G39 prerelease publisher contract",
  () => {
    const workflow =
      readFileSync(
        workflowPath,
        "utf8"
      );

    it(
      "requires every release gate on the exact validated source SHA",
      () => {
        expect(workflow)
          .toContain(
            "head_sha=$source_sha&status=success"
          );

        for (
          const requiredWorkflow
          of [
            ".github/workflows/lex-runtime.yml",
            ".github/workflows/f138-structural-audit.yml",
            ".github/workflows/g39-installer-state.yml",
            ".github/workflows/lex-installer.yml",
            ".github/workflows/offline-windows-installer.yml"
          ]
        ) {
          expect(workflow)
            .toContain(
              `"${requiredWorkflow}"`
            );
        }
      }
    );

    it(
      "publishes only the accepted online and offline artifacts with checksum verification",
      () => {
        expect(workflow)
          .toContain(
            "LexMachina-Windows-Online-Installer"
          );
        expect(workflow)
          .toContain(
            "LexMachina-Windows-Offline-Setup"
          );
        expect(workflow)
          .toContain(
            "ONLINE_RELEASE_HASH_MISMATCH"
          );
        expect(workflow)
          .toContain(
            "OFFLINE_RELEASE_HASH_MISMATCH"
          );
        expect(workflow)
          .toContain(
            "SHA256SUMS.txt"
          );
      }
    );
  }
);
