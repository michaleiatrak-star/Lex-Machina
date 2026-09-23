import fs from "node:fs";
import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MaintenanceService, applicationUpdateStagingRoot } from "./maintenance-service.js";
afterEach(() => {
    fs.rmSync(applicationUpdateStagingRoot(), {
        recursive: true,
        force: true
    });
});
describe("application update release-to-installer version binding", () => {
    it("persists an explicit unsigned receipt when the temporary policy accepts SHA-256 + ProductVersion", async () => {
        const bytes = Buffer.from("unsigned-installer-fixture", "utf8");
        const digest = createHash("sha256")
            .update(bytes)
            .digest("hex");
        const discovery = {
            async check() {
                return {
                    currentVersion: "0.1.3",
                    status: "AVAILABLE",
                    checkedAt: "2026-09-18T10:05:00.000Z",
                    latestVersion: "0.1.4",
                    installer: {
                        name: "LexMachina-Windows-Online-Installer.exe",
                        url: "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-Windows-Online-Installer.exe",
                        sha256: digest,
                        bytes: bytes.byteLength
                    }
                };
            }
        };
        const fetchImpl = vi.fn(async () => new Response(bytes, {
            status: 200
        }));
        const verify = vi.fn((_path, expectedVersion) => {
            expect(expectedVersion).toBe("0.1.4");
            return {
                verification: "UNSIGNED_ALLOWED",
                subject: null,
                thumbprint: null,
                productVersion: "0.1.4",
                warning: "TEMPORARY_UNSIGNED_UPDATE_ALLOWED"
            };
        });
        const installerVerifier = {
            verify
        };
        const maintenance = new MaintenanceService(discovery, fetchImpl, installerVerifier, () => false, () => {
            throw new Error("UNUSED_SKILL_VERIFIER");
        }, () => false, () => {
            throw new Error("UNUSED_MODEL_PACK_VERIFIER");
        });
        const result = await maintenance
            .downloadApplicationUpdate();
        expect(result.publisher).toEqual({
            verification: "UNSIGNED_ALLOWED",
            subject: null,
            thumbprint: null,
            productVersion: "0.1.4",
            warning: "TEMPORARY_UNSIGNED_UPDATE_ALLOWED"
        });
        const receipt = JSON.parse(fs.readFileSync(applicationUpdateStagingRoot() +
            "/" +
            result.receiptToken, "utf8"));
        expect(receipt.sha256).toBe(digest);
        expect(receipt.version).toBe("0.1.4");
        expect(receipt.publisher
            ?.verification).toBe("UNSIGNED_ALLOWED");
        expect(receipt.publisher
            ?.productVersion).toBe("0.1.4");
        expect(receipt.publisher
            ?.warning).toBe("TEMPORARY_UNSIGNED_UPDATE_ALLOWED");
    });
    it("passes the discovered release version to Authenticode verification and persists the verified ProductVersion", async () => {
        const bytes = Buffer.from("signed-installer-fixture", "utf8");
        const digest = createHash("sha256")
            .update(bytes)
            .digest("hex");
        const discovery = {
            async check() {
                return {
                    currentVersion: "0.1.3",
                    status: "AVAILABLE",
                    checkedAt: "2026-09-18T10:00:00.000Z",
                    latestVersion: "0.1.4",
                    installer: {
                        name: "LexMachina-Windows-Online-Installer.exe",
                        url: "https://github.com/michaleiatrak-star/Lex-Machina/releases/download/v0.1.4/LexMachina-Windows-Online-Installer.exe",
                        sha256: digest,
                        bytes: bytes.byteLength
                    }
                };
            }
        };
        const fetchImpl = vi.fn(async () => new Response(bytes, {
            status: 200
        }));
        const verify = vi.fn((_path, expectedVersion) => {
            expect(expectedVersion).toBe("0.1.4");
            return {
                verification: "AUTHENTICODE",
                subject: "CN=Lex Machina Test",
                thumbprint: "A".repeat(40),
                productVersion: "0.1.4"
            };
        });
        const installerVerifier = {
            verify
        };
        const maintenance = new MaintenanceService(discovery, fetchImpl, installerVerifier, () => false, () => {
            throw new Error("UNUSED_SKILL_VERIFIER");
        }, () => false, () => {
            throw new Error("UNUSED_MODEL_PACK_VERIFIER");
        });
        const result = await maintenance
            .downloadApplicationUpdate();
        expect(verify)
            .toHaveBeenCalledTimes(1);
        expect(result.version).toBe("0.1.4");
        expect(result.publisher
            .productVersion).toBe("0.1.4");
        const receipt = JSON.parse(fs.readFileSync(applicationUpdateStagingRoot() +
            "/" +
            result.receiptToken, "utf8"));
        expect(receipt.version).toBe("0.1.4");
        expect(receipt.publisher
            ?.productVersion).toBe("0.1.4");
    });
});
