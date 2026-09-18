import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import {
  LocalModelRuntime
} from "./local-model-runtime.js";

const roots: string[] = [];

function releaseManifestPath():
  string {
  const candidates = [
    path.resolve(
      process.cwd(),
      "../installer/windows-release-source.json"
    ),
    path.resolve(
      process.cwd(),
      "app/installer/windows-release-source.json"
    )
  ];
  const found =
    candidates.find(
      (candidate) =>
        fs.existsSync(
          candidate
        )
    );
  if (!found) {
    throw new Error(
      "LOCAL_BACKEND_TEST_MANIFEST_MISSING"
    );
  }
  return found;
}

afterEach(() => {
  for (
    const root
    of roots.splice(0)
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

describe(
  "Local AI backend release policy",
  () => {
    it(
      "pins CPU and Vulkan to the same llama.cpp release with verified hashes",
      () => {
        const manifest =
          JSON.parse(
            fs.readFileSync(
              releaseManifestPath(),
              "utf8"
            )
          ) as {
            runtime: {
              llamaCpp: {
                version: string;
                url: string;
                sha256: string;
                backend: string;
                backends:
                  Array<{
                    id: string;
                    url: string;
                    sha256: string;
                    bytes: number;
                    gpuOffload: boolean;
                  }>;
              };
            };
            localAi: {
              backendSelection: {
                allowed: string[];
                default: string;
              };
            };
          };

        const engine =
          manifest.runtime
            .llamaCpp;
        const cpu =
          engine.backends.find(
            (item) =>
              item.id ===
              "CPU_X64_PORTABLE"
          );
        const vulkan =
          engine.backends.find(
            (item) =>
              item.id ===
              "VULKAN_X64"
          );

        expect(cpu)
          .toBeDefined();
        expect(vulkan)
          .toBeDefined();
        expect(
          engine.backend
        ).toBe(
          "CPU_X64_PORTABLE"
        );
        expect(
          cpu?.url
        ).toBe(
          engine.url
        );
        expect(
          cpu?.sha256
        ).toBe(
          engine.sha256
        );

        for (
          const backend
          of [cpu!, vulkan!]
        ) {
          expect(
            backend.url
          ).toContain(
            "/releases/download/" +
            engine.version +
            "/"
          );
          expect(
            backend.url
              .startsWith(
                "https://"
              )
          ).toBe(true);
          expect(
            backend.sha256
          ).toMatch(
            /^[a-f0-9]{64}$/
          );
          expect(
            backend.bytes
          ).toBeGreaterThan(
            1_000_000
          );
        }

        expect(
          cpu?.gpuOffload
        ).toBe(false);
        expect(
          vulkan?.gpuOffload
        ).toBe(true);
        expect(
          manifest.localAi
            .backendSelection
            .default
        ).toBe("AUTO");
        expect(
          new Set(
            manifest.localAi
              .backendSelection
              .allowed
          )
        ).toEqual(
          new Set([
            "AUTO",
            "VULKAN_X64",
            "CPU_X64_PORTABLE"
          ])
        );
      }
    );

    it(
      "exposes only the manifest-approved backend preferences",
      () => {
        const root =
          fs.mkdtempSync(
            path.join(
              os.tmpdir(),
              "lex-backend-policy-"
            )
          );
        roots.push(root);
        const runtimeRoot =
          path.join(
            root,
            "runtime"
          );
        fs.mkdirSync(
          runtimeRoot,
          { recursive: true }
        );
        fs.copyFileSync(
          releaseManifestPath(),
          path.join(
            runtimeRoot,
            "release-source.json"
          )
        );

        const runtime =
          new LocalModelRuntime({
            rootDir:
              path.join(
                root,
                "local-ai"
              ),
            runtimeRoot,
            port: 4318
          });
        expect(
          runtime
            .backendSelectionPolicy()
        ).toEqual({
          allowed: [
            "AUTO",
            "VULKAN_X64",
            "CPU_X64_PORTABLE"
          ],
          default: "AUTO"
        });
      }
    );
  }
);
