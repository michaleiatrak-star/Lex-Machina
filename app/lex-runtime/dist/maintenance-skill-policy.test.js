import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
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
        checkedAt: "2026-09-18T09:00:00.000Z",
        latestVersion: "0.1.4",
        skillsBundle: {
            name: "LexMachina-Skills-0.1.4.zip",
            url: "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-Skills-0.1.4.zip",
            sha256: "a".repeat(64),
            bytes: 123
        },
        skillsIndex: {
            name: "LexMachina-Skills-Index.json",
            url: "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-Skills-Index.json",
            sha256: sha256(indexBytes),
            bytes: indexBytes.byteLength
        },
        skillsSignature: {
            name: "LexMachina-Skills-Index.sig",
            url: "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-Skills-Index.sig",
            sha256: sha256(signatureBytes),
            bytes: signatureBytes.byteLength
        }
    };
}
function verifiedIndex(args) {
    return {
        signerKeyId: "skill-release-test",
        indexSha256: "f".repeat(64),
        index: {
            schemaVersion: 1,
            kind: "LEX_MACHINA_SKILLS_INDEX",
            version: args?.version ??
                "0.1.4",
            bundle: {
                filename: "LexMachina-Skills-0.1.4.zip",
                sha256: "a".repeat(64),
                bytes: 123
            },
            compatibility: {
                minAppVersion: args?.minAppVersion ??
                    "0.1.3",
                ...(args?.maxAppVersion
                    ? {
                        maxAppVersion: args.maxAppVersion
                    }
                    : {})
            },
            skills: []
        }
    };
}
function service(verified, options) {
    const indexBytes = new TextEncoder().encode('{"signed":"index"}');
    const signatureBytes = new TextEncoder().encode('{"signed":"signature"}');
    const result = discoveryResult(indexBytes, signatureBytes);
    if (options?.signaturePresent ===
        false) {
        delete result.skillsSignature;
    }
    const bundleFetch = vi.fn();
    const fetchImpl = vi.fn(async (input) => {
        const url = typeof input === "string"
            ? input
            : input instanceof URL
                ? input.toString()
                : input.url;
        if (url ===
            result.skillsIndex.url) {
            return new Response(indexBytes, { status: 200 });
        }
        if (result.skillsSignature &&
            url ===
                result.skillsSignature.url) {
            return new Response(signatureBytes, { status: 200 });
        }
        if (url ===
            result.skillsBundle.url) {
            bundleFetch();
            return new Response(new Uint8Array(123), { status: 200 });
        }
        return new Response("missing", { status: 404 });
    });
    const discovery = {
        async check() {
            return result;
        }
    };
    const installerVerifier = {
        verify() {
            throw new Error("UNUSED_INSTALLER_VERIFIER");
        }
    };
    const maintenance = new MaintenanceService(discovery, fetchImpl, installerVerifier, () => true, () => verified, () => false, () => {
        throw new Error("UNUSED_MODEL_PACK_VERIFIER");
    }, () => options?.signatureMode ??
        "SIGNED_REQUIRED", () => "SIGNED_REQUIRED");
    return {
        maintenance,
        bundleFetch
    };
}
describe("signed skill update compatibility policy", () => {
    it("reports an unsigned skill index as ready only in the explicit temporary mode", async () => {
        const { maintenance } = service({
            ...verifiedIndex(),
            signerKeyId: "UNSIGNED_ALLOWED"
        }, {
            signatureMode: "UNSIGNED_ALLOWED",
            signaturePresent: false
        });
        const status = await maintenance
            .skillStatus();
        expect(status.status)
            .toBe("AVAILABLE");
        expect(status.bundleReady)
            .toBe(true);
        expect(status.signatureMode)
            .toBe("UNSIGNED_ALLOWED");
        expect(status.blockedReason)
            .toBeUndefined();
    });
    it("rejects a signed index incompatible with the installed application before downloading the ZIP", async () => {
        const { maintenance, bundleFetch } = service(verifiedIndex({
            minAppVersion: "0.2.0"
        }));
        await expect(maintenance
            .applySkillUpdate()).rejects.toThrow("SKILL_UPDATE_APP_INCOMPATIBLE");
        expect(bundleFetch).not.toHaveBeenCalled();
    });
    it("rejects a signed index whose release version does not match the discovered release before downloading the ZIP", async () => {
        const { maintenance, bundleFetch } = service(verifiedIndex({
            version: "0.1.5"
        }));
        await expect(maintenance
            .applySkillUpdate()).rejects.toThrow("SKILL_UPDATE_INDEX_RELEASE_VERSION_MISMATCH");
        expect(bundleFetch).not.toHaveBeenCalled();
    });
    it("rejects a signed index whose maximum app version is below the installed application before downloading the ZIP", async () => {
        const { maintenance, bundleFetch } = service(verifiedIndex({
            minAppVersion: "0.1.0",
            maxAppVersion: "0.1.2"
        }));
        await expect(maintenance
            .applySkillUpdate()).rejects.toThrow("SKILL_UPDATE_APP_INCOMPATIBLE");
        expect(bundleFetch).not.toHaveBeenCalled();
    });
});
