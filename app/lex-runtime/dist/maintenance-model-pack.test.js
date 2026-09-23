import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { MaintenanceService } from "./maintenance-service.js";
function sha256(bytes) {
    return createHash("sha256")
        .update(bytes)
        .digest("hex");
}
function discoveryResult(indexBytes, signatureBytes) {
    return {
        currentVersion: "0.1.3",
        status: "AVAILABLE",
        checkedAt: "2026-09-18T08:00:00.000Z",
        latestVersion: "0.1.4",
        modelPackIndex: {
            name: "LexMachina-ModelPack-Index.json",
            url: "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-ModelPack-Index.json",
            sha256: sha256(indexBytes),
            bytes: indexBytes.byteLength
        },
        modelPackSignature: {
            name: "LexMachina-ModelPack-Index.sig",
            url: "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-ModelPack-Index.sig",
            sha256: sha256(signatureBytes),
            bytes: signatureBytes.byteLength
        }
    };
}
function fakeDiscovery(value) {
    return {
        async check() {
            return value;
        }
    };
}
function fakeFetch(payloads) {
    return (async (input) => {
        const url = typeof input === "string"
            ? input
            : input instanceof URL
                ? input.toString()
                : input.url;
        const bytes = payloads.get(url);
        if (!bytes) {
            return new Response("missing", { status: 404 });
        }
        return new Response(new TextDecoder().decode(bytes), {
            status: 200,
            headers: {
                "content-type": "application/octet-stream"
            }
        });
    });
}
const unusedInstallerVerifier = {
    verify() {
        throw new Error("UNUSED_INSTALLER_VERIFIER");
    }
};
const unusedSkillVerifier = () => {
    throw new Error("UNUSED_SKILL_INDEX_VERIFIER");
};
function verifiedIndex(args) {
    const modelId = args?.modelId ??
        "local/bielik-11b-v3-q4km";
    const mistral = modelId.startsWith("local/mistral-");
    return {
        signerKeyId: "model-release-test",
        indexSha256: "f".repeat(64),
        index: {
            schemaVersion: 1,
            kind: "LEX_MACHINA_MODEL_PACK_INDEX",
            version: args?.packVersion ??
                "0.1.4",
            compatibility: {
                minAppVersion: args?.minAppVersion ??
                    "0.1.3",
                ...(args?.maxAppVersion
                    ? {
                        maxAppVersion: args.maxAppVersion
                    }
                    : {})
            },
            models: [
                {
                    id: modelId,
                    family: mistral
                        ? "MISTRAL"
                        : "BIELIK",
                    displayName: mistral
                        ? "Mistral NeMo 12B"
                        : "Bielik 11B v3",
                    filename: mistral
                        ? "Mistral-Nemo-Instruct-2407-Q4_K_M.gguf"
                        : "Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
                    url: "https://example.invalid/Bielik-11B-v3.0-Instruct.Q4_K_M.gguf",
                    sha256: args?.sha256 ??
                        "b".repeat(64),
                    quantization: "Q4_K_M",
                    bytes: mistral
                        ? 7_000_000_000
                        : 6_000_000_000,
                    nativeContext: mistral
                        ? 131_072
                        : 32_768,
                    minimumContext: 64_000,
                    maximumRuntimeContext: 200_000,
                    license: "Apache-2.0"
                }
            ]
        }
    };
}
function service(args) {
    const indexBytes = new TextEncoder().encode('{"index":"signed"}');
    const signatureBytes = new TextEncoder().encode('{"signature":"signed"}');
    const result = discoveryResult(indexBytes, signatureBytes);
    if (args?.appReleaseStatus) {
        result.status =
            args.appReleaseStatus;
        if (args.appReleaseStatus ===
            "NO_RELEASE") {
            delete result.latestVersion;
        }
    }
    if (args?.signaturePresent ===
        false) {
        delete result.modelPackSignature;
    }
    const payloads = new Map([
        [
            result
                .modelPackIndex.url,
            indexBytes
        ],
        ...(result.modelPackSignature
            ? [[
                    result
                        .modelPackSignature.url,
                    signatureBytes
                ]]
            : [])
    ]);
    return new MaintenanceService(fakeDiscovery(result), fakeFetch(payloads), unusedInstallerVerifier, () => false, unusedSkillVerifier, () => args?.trustReady ??
        true, () => args?.verified ??
        verifiedIndex(), () => "SIGNED_REQUIRED", () => args?.signatureMode ??
        "SIGNED_REQUIRED");
}
describe("signed model-pack update policy", () => {
    it("blocks updates when the model-pack signer trust root is not configured", async () => {
        const maintenance = service({
            trustReady: false
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64)
        });
        expect(status.status)
            .toBe("BLOCKED");
        expect(status.blockedReason).toBe("SIGNER_POLICY_MISSING");
        expect(status.verificationReady).toBe(false);
    });
    it("allows a model-pack index without .sig only in temporary unsigned mode", async () => {
        const maintenance = service({
            signatureMode: "UNSIGNED_ALLOWED",
            signaturePresent: false,
            verified: {
                ...verifiedIndex({
                    sha256: "b".repeat(64)
                }),
                signerKeyId: "UNSIGNED_ALLOWED"
            }
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64)
        });
        expect(status.status)
            .toBe("AVAILABLE");
        expect(status.signatureMode)
            .toBe("UNSIGNED_ALLOWED");
        expect(status.signerKeyId)
            .toBe("UNSIGNED_ALLOWED");
    });
    it("uses a dedicated model-pack release even when there is no application release", async () => {
        const maintenance = service({
            appReleaseStatus: "NO_RELEASE",
            verified: verifiedIndex({
                sha256: "b".repeat(64),
                packVersion: "0.1.7"
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64),
            packVersion: "0.1.6"
        });
        expect(status.status)
            .toBe("AVAILABLE");
        expect(status.latestPackVersion).toBe("0.1.7");
        expect(status.targetSha256).toBe("b".repeat(64));
    });
    it("reports AVAILABLE only when the trusted signed index changes the installed model hash", async () => {
        const maintenance = service({
            verified: verifiedIndex({
                sha256: "b".repeat(64)
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64)
        });
        expect(status.status)
            .toBe("AVAILABLE");
        expect(status.targetSha256).toBe("b".repeat(64));
        expect(status.signerKeyId).toBe("model-release-test");
    });
    it("reports the Mistral update channel and signed target metadata", async () => {
        const modelId = "local/mistral-nemo-12b-q4km";
        const maintenance = service({
            verified: verifiedIndex({
                modelId,
                sha256: "d".repeat(64)
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId,
            sha256: "a".repeat(64)
        });
        expect(status)
            .toMatchObject({
            status: "AVAILABLE",
            modelId,
            modelFamily: "MISTRAL",
            targetModelId: modelId,
            targetDisplayName: "Mistral NeMo 12B",
            targetBytes: 7_000_000_000,
            targetSha256: "d".repeat(64)
        });
    });
    it("reports UP_TO_DATE when the signed target hash equals the installed hash", async () => {
        const hash = "c".repeat(64);
        const maintenance = service({
            verified: verifiedIndex({
                sha256: hash
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: hash
        });
        expect(status.status)
            .toBe("UP_TO_DATE");
        expect(status.targetSha256).toBe(hash);
    });
    it("blocks a correctly signed index that is incompatible with the application version", async () => {
        const maintenance = service({
            verified: verifiedIndex({
                minAppVersion: "0.2.0"
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64)
        });
        expect(status.status)
            .toBe("BLOCKED");
        expect(status.blockedReason).toBe("APP_INCOMPATIBLE");
    });
    it("blocks replay of a signed model-pack older than the installed signed receipt", async () => {
        const maintenance = service({
            verified: verifiedIndex({
                packVersion: "0.1.4",
                sha256: "b".repeat(64)
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64),
            packVersion: "0.1.5"
        });
        expect(status.status)
            .toBe("BLOCKED");
        expect(status.blockedReason).toBe("PACK_VERSION_ROLLBACK");
    });
    it("blocks a different model hash under the same signed pack version", async () => {
        const maintenance = service({
            verified: verifiedIndex({
                packVersion: "0.1.4",
                sha256: "b".repeat(64)
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64),
            packVersion: "0.1.4"
        });
        expect(status.status)
            .toBe("BLOCKED");
        expect(status.blockedReason).toBe("PACK_VERSION_HASH_CONFLICT");
    });
    it("blocks a signed index that does not contain the installed model", async () => {
        const maintenance = service({
            verified: verifiedIndex({
                modelId: "local/other-model"
            })
        });
        const status = await maintenance
            .modelPackStatus({
            modelId: "local/bielik-11b-v3-q4km",
            sha256: "a".repeat(64)
        });
        expect(status.status)
            .toBe("BLOCKED");
        expect(status.blockedReason).toBe("MODEL_NOT_IN_INDEX");
    });
});
