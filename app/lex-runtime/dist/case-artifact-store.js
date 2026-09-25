import { access, readFile, readdir, rm } from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { readCaseBlob, rekeyCaseBlob, writeCaseBlob } from "./case-blob.js";
function defaultRootDir() {
    return path.resolve(process.env.LEX_DATA_DIR ??
        path.join(os.homedir(), ".lex-machina", "data"));
}
function validCaseId(value) {
    return /^case_[a-f0-9]{32}$/
        .test(value);
}
function validArtifactId(value) {
    return /^artifact_[a-f0-9]{32}$/
        .test(value);
}
function safeFilename(value) {
    const normalized = value
        .normalize("NFKC")
        .replace(/[\x00-\x1f\x7f]/g, "")
        .replace(/[\\/]/g, "_")
        .trim();
    const candidate = normalized ||
        "artifact.bin";
    if (candidate === "." ||
        candidate === ".." ||
        candidate.length > 180) {
        return "artifact.bin";
    }
    return candidate;
}
function manifestIdentity(caseId, artifactId, keyVersion) {
    return {
        caseId,
        objectId: artifactId,
        purpose: "artifact-manifest",
        keyVersion
    };
}
function payloadIdentity(caseId, artifactId, keyVersion) {
    return {
        caseId,
        objectId: artifactId,
        purpose: "artifact-payload",
        keyVersion
    };
}
export class SecureCaseArtifactStore {
    rootDir;
    manifestMaxBytes;
    constructor(options = {}) {
        this.rootDir =
            path.resolve(options.rootDir ??
                defaultRootDir());
        this.manifestMaxBytes =
            options.manifestMaxBytes ??
                512 * 1024;
    }
    caseDir(caseId) {
        if (!validCaseId(caseId)) {
            throw new Error("INVALID_CASE_ID");
        }
        const target = path.resolve(this.rootDir, "cases", caseId);
        const base = path.resolve(this.rootDir, "cases") + path.sep;
        if (!target.startsWith(base)) {
            throw new Error("CASE_PATH_ESCAPE");
        }
        return target;
    }
    artifactsDir(caseId) {
        return path.join(this.caseDir(caseId), "secure", "artifacts");
    }
    artifactDir(caseId, artifactId) {
        if (!validArtifactId(artifactId)) {
            throw new Error("INVALID_ARTIFACT_ID");
        }
        const base = path.resolve(this.artifactsDir(caseId));
        const target = path.resolve(base, artifactId);
        if (!target.startsWith(base + path.sep)) {
            throw new Error("ARTIFACT_PATH_ESCAPE");
        }
        return target;
    }
    async assertCaseKeyVersion(caseId, keyVersion) {
        const metadataPath = path.join(this.caseDir(caseId), "case.json");
        await access(metadataPath);
        const raw = JSON.parse(await readFile(metadataPath, "utf8"));
        if (raw.caseId !==
            caseId ||
            raw.keyVersion !==
                keyVersion ||
            typeof raw
                .createdByUserId !==
                "string") {
            throw new Error("CASE_KEY_VERSION_MISMATCH");
        }
    }
    async saveArtifact(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        const artifactId = "artifact_" +
            randomBytes(16)
                .toString("hex");
        const dir = this.artifactDir(args.caseId, artifactId);
        const digest = createHash("sha256")
            .update(args.data)
            .digest("hex");
        const manifest = {
            schemaVersion: 1,
            caseId: args.caseId,
            artifactId,
            filename: safeFilename(args.filename),
            mediaType: args.mediaType,
            sha256: digest,
            bytes: args.data.byteLength,
            createdAt: new Date()
                .toISOString(),
            ...(args.createdByUserId
                ? {
                    createdByUserId: args.createdByUserId
                }
                : {}),
            sensitivity: args.sensitivity,
            storage: "ENCRYPTED_LME1",
            ...(args.sourceArtifactId &&
                validArtifactId(args.sourceArtifactId)
                ? { sourceArtifactId: args.sourceArtifactId }
                : {})
        };
        try {
            await writeCaseBlob({
                targetFile: path.join(dir, "payload.lme"),
                identity: payloadIdentity(args.caseId, artifactId, args.keyVersion),
                caseDataKey: args.caseDataKey,
                data: args.data,
                expectedSha256: digest
            });
            const manifestBytes = Buffer.from(JSON.stringify(manifest), "utf8");
            try {
                await writeCaseBlob({
                    targetFile: path.join(dir, "manifest.lme"),
                    identity: manifestIdentity(args.caseId, artifactId, args.keyVersion),
                    caseDataKey: args.caseDataKey,
                    data: manifestBytes
                });
            }
            finally {
                manifestBytes.fill(0);
            }
            return {
                ...manifest
            };
        }
        catch (error) {
            await rm(dir, {
                recursive: true,
                force: true
            });
            throw error;
        }
    }
    async listArtifacts(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        let entries;
        try {
            entries =
                await readdir(this.artifactsDir(args.caseId), {
                    withFileTypes: true
                });
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code ===
                    "ENOENT") {
                return [];
            }
            throw error;
        }
        const result = [];
        for (const entry of entries) {
            if (!entry.isDirectory() ||
                !validArtifactId(entry.name)) {
                continue;
            }
            try {
                const bytes = await readCaseBlob({
                    targetFile: path.join(this.artifactDir(args.caseId, entry.name), "manifest.lme"),
                    identity: manifestIdentity(args.caseId, entry.name, args.keyVersion),
                    caseDataKey: args.caseDataKey,
                    maxBytes: this.manifestMaxBytes
                });
                try {
                    const parsed = JSON.parse(bytes.toString("utf8"));
                    if (parsed.schemaVersion !==
                        1 ||
                        parsed.caseId !==
                            args.caseId ||
                        parsed.artifactId !==
                            entry.name ||
                        !/^[a-f0-9]{64}$/
                            .test(parsed.sha256) ||
                        parsed.storage !==
                            "ENCRYPTED_LME1" ||
                        ![
                            "PROTECTED",
                            "CLEAR_PII"
                        ].includes(parsed.sensitivity)) {
                        throw new Error("SECURE_ARTIFACT_MANIFEST_INVALID");
                    }
                    result.push(parsed);
                }
                finally {
                    bytes.fill(0);
                }
            }
            catch {
                // Invalid artifacts are omitted rather than exposing corrupt metadata.
            }
        }
        return result.sort((a, b) => b.createdAt
            .localeCompare(a.createdAt));
    }
    async readArtifact(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        return await readCaseBlob({
            targetFile: path.join(this.artifactDir(args.caseId, args.artifactId), "payload.lme"),
            identity: payloadIdentity(args.caseId, args.artifactId, args.keyVersion),
            caseDataKey: args.caseDataKey,
            maxBytes: args.maxBytes
        });
    }
    async deleteArtifact(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        const dir = this.artifactDir(args.caseId, args.artifactId);
        // Resolve/validate the artifact path before removal. The case data key
        // requirement keeps deletion behind the same case-access boundary as
        // reads/writes, even though recursive removal itself does not decrypt.
        if (!Buffer.isBuffer(args.caseDataKey) ||
            args.caseDataKey.length < 16) {
            throw new Error("CASE_DATA_KEY_INVALID");
        }
        await rm(dir, {
            recursive: true,
            force: true
        });
    }
    async rekeyCaseArtifacts(args) {
        let entries;
        try {
            entries =
                await readdir(this.artifactsDir(args.caseId), {
                    withFileTypes: true
                });
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code ===
                    "ENOENT") {
                return false;
            }
            throw error;
        }
        const descriptors = [];
        for (const entry of entries) {
            if (!entry.isDirectory() ||
                !validArtifactId(entry.name)) {
                continue;
            }
            const dir = this.artifactDir(args.caseId, entry.name);
            descriptors.push({
                targetFile: path.join(dir, "payload.lme"),
                oldIdentity: payloadIdentity(args.caseId, entry.name, args.oldKeyVersion),
                newIdentity: payloadIdentity(args.caseId, entry.name, args.newKeyVersion)
            }, {
                targetFile: path.join(dir, "manifest.lme"),
                oldIdentity: manifestIdentity(args.caseId, entry.name, args.oldKeyVersion),
                newIdentity: manifestIdentity(args.caseId, entry.name, args.newKeyVersion)
            });
        }
        const completed = [];
        try {
            for (const descriptor of descriptors) {
                await rekeyCaseBlob({
                    targetFile: descriptor.targetFile,
                    oldIdentity: descriptor
                        .oldIdentity,
                    newIdentity: descriptor
                        .newIdentity,
                    oldCaseDataKey: args.oldCaseDataKey,
                    newCaseDataKey: args.newCaseDataKey
                });
                completed.push(descriptor);
            }
            return (descriptors.length > 0);
        }
        catch (error) {
            try {
                for (const descriptor of [...completed]
                    .reverse()) {
                    await rekeyCaseBlob({
                        targetFile: descriptor.targetFile,
                        oldIdentity: descriptor
                            .newIdentity,
                        newIdentity: descriptor
                            .oldIdentity,
                        oldCaseDataKey: args.newCaseDataKey,
                        newCaseDataKey: args.oldCaseDataKey
                    });
                }
            }
            catch {
                throw new Error("SECURE_ARTIFACT_REKEY_ROLLBACK_FAILED");
            }
            throw error;
        }
    }
}
