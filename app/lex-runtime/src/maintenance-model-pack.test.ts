import {
  createHash
} from "node:crypto";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  MaintenanceService
} from "./maintenance-service.js";
import type {
  ApplicationInstallerVerifier
} from "./application-update-verifier.js";
import type {
  VerifiedModelPackIndex
} from "./model-pack-verifier.js";
import type {
  UpdateDiscovery,
  UpdateDiscoveryResult
} from "./update-discovery.js";

function sha256(
  bytes: Uint8Array
): string {
  return createHash("sha256")
    .update(bytes)
    .digest("hex");
}

function discoveryResult(
  indexBytes: Uint8Array,
  signatureBytes: Uint8Array
): UpdateDiscoveryResult {
  return {
    currentVersion: "0.1.3",
    status: "AVAILABLE",
    checkedAt:
      "2026-09-18T08:00:00.000Z",
    latestVersion: "0.1.4",
    modelPackIndex: {
      name:
        "LexMachina-ModelPack-Index.json",
      url:
        "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-ModelPack-Index.json",
      sha256:
        sha256(indexBytes),
      bytes:
        indexBytes.byteLength
    },
    modelPackSignature: {
      name:
        "LexMachina-ModelPack-Index.sig",
      url:
        "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-ModelPack-Index.sig",
      sha256:
        sha256(signatureBytes),
      bytes:
        signatureBytes.byteLength
    }
  };
}

function fakeDiscovery(
  value: UpdateDiscoveryResult
): UpdateDiscovery {
  return {
    async check() {
      return value;
    }
  };
}

function fakeFetch(
  payloads:
    ReadonlyMap<
      string,
      Uint8Array
    >
): typeof fetch {
  return (async (
    input:
      | RequestInfo
      | URL
  ) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const bytes =
      payloads.get(url);
    if (!bytes) {
      return new Response(
        "missing",
        { status: 404 }
      );
    }
    return new Response(
      bytes,
      {
        status: 200,
        headers: {
          "content-type":
            "application/octet-stream"
        }
      }
    );
  }) as typeof fetch;
}

const unusedInstallerVerifier:
  ApplicationInstallerVerifier = {
    verify() {
      throw new Error(
        "UNUSED_INSTALLER_VERIFIER"
      );
    }
  };

const unusedSkillVerifier =
  () => {
    throw new Error(
      "UNUSED_SKILL_INDEX_VERIFIER"
    );
  };

function verifiedIndex(args?: {
  minAppVersion?: string;
  maxAppVersion?: string;
  modelId?: string;
  sha256?: string;
}): VerifiedModelPackIndex {
  return {
    signerKeyId:
      "model-release-test",
    indexSha256:
      "f".repeat(64),
    index: {
      schemaVersion: 1,
      kind:
        "LEX_MACHINA_MODEL_PACK_INDEX",
      version: "0.1.4",
      compatibility: {
        minAppVersion:
          args?.minAppVersion ??
          "0.1.3",
        ...(args?.maxAppVersion
          ? {
              maxAppVersion:
                args.maxAppVersion
            }
          : {})
      },
      models: [
        {
          id:
            args?.modelId ??
            "local/bielik-11b-v3-q4km",
          displayName:
            "Bielik 11B v3",
          filename:
            "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
          url:
            "https://example.invalid/Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
          sha256:
            args?.sha256 ??
            "b".repeat(64),
          quantization:
            "Q4_K_M",
          nativeContext:
            32_768,
          minimumContext:
            64_000,
          maximumRuntimeContext:
            200_000,
          license:
            "Apache-2.0"
        }
      ]
    }
  };
}

function service(args?: {
  trustReady?: boolean;
  verified?:
    VerifiedModelPackIndex;
}) {
  const indexBytes =
    new TextEncoder().encode(
      '{"index":"signed"}'
    );
  const signatureBytes =
    new TextEncoder().encode(
      '{"signature":"signed"}'
    );
  const result =
    discoveryResult(
      indexBytes,
      signatureBytes
    );
  const payloads =
    new Map<
      string,
      Uint8Array
    >([
      [
        result
          .modelPackIndex!.url,
        indexBytes
      ],
      [
        result
          .modelPackSignature!.url,
        signatureBytes
      ]
    ]);

  return new MaintenanceService(
    fakeDiscovery(result),
    fakeFetch(payloads),
    unusedInstallerVerifier,
    () => false,
    unusedSkillVerifier as never,
    () =>
      args?.trustReady ??
      true,
    () =>
      args?.verified ??
      verifiedIndex()
  );
}

describe(
  "signed model-pack update policy",
  () => {
    it(
      "blocks updates when the model-pack signer trust root is not configured",
      async () => {
        const maintenance =
          service({
            trustReady:
              false
          });

        const status =
          await maintenance
            .modelPackStatus({
              modelId:
                "local/bielik-11b-v3-q4km",
              sha256:
                "a".repeat(64)
            });

        expect(status.status)
          .toBe("BLOCKED");
        expect(
          status.blockedReason
        ).toBe(
          "SIGNER_POLICY_MISSING"
        );
        expect(
          status.verificationReady
        ).toBe(false);
      }
    );

    it(
      "reports AVAILABLE only when the trusted signed index changes the installed model hash",
      async () => {
        const maintenance =
          service({
            verified:
              verifiedIndex({
                sha256:
                  "b".repeat(64)
              })
          });

        const status =
          await maintenance
            .modelPackStatus({
              modelId:
                "local/bielik-11b-v3-q4km",
              sha256:
                "a".repeat(64)
            });

        expect(status.status)
          .toBe("AVAILABLE");
        expect(
          status.targetSha256
        ).toBe(
          "b".repeat(64)
        );
        expect(
          status.signerKeyId
        ).toBe(
          "model-release-test"
        );
      }
    );

    it(
      "reports UP_TO_DATE when the signed target hash equals the installed hash",
      async () => {
        const hash =
          "c".repeat(64);
        const maintenance =
          service({
            verified:
              verifiedIndex({
                sha256:
                  hash
              })
          });

        const status =
          await maintenance
            .modelPackStatus({
              modelId:
                "local/bielik-11b-v3-q4km",
              sha256:
                hash
            });

        expect(status.status)
          .toBe("UP_TO_DATE");
        expect(
          status.targetSha256
        ).toBe(hash);
      }
    );

    it(
      "blocks a correctly signed index that is incompatible with the application version",
      async () => {
        const maintenance =
          service({
            verified:
              verifiedIndex({
                minAppVersion:
                  "0.2.0"
              })
          });

        const status =
          await maintenance
            .modelPackStatus({
              modelId:
                "local/bielik-11b-v3-q4km",
              sha256:
                "a".repeat(64)
            });

        expect(status.status)
          .toBe("BLOCKED");
        expect(
          status.blockedReason
        ).toBe(
          "APP_INCOMPATIBLE"
        );
      }
    );

    it(
      "blocks a signed index that does not contain the installed model",
      async () => {
        const maintenance =
          service({
            verified:
              verifiedIndex({
                modelId:
                  "local/other-model"
              })
          });

        const status =
          await maintenance
            .modelPackStatus({
              modelId:
                "local/bielik-11b-v3-q4km",
              sha256:
                "a".repeat(64)
            });

        expect(status.status)
          .toBe("BLOCKED");
        expect(
          status.blockedReason
        ).toBe(
          "MODEL_NOT_IN_INDEX"
        );
      }
    );
  }
);
