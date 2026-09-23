import { access, chmod, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readCaseBlob, rekeyCaseBlob, writeCaseBlob, writeCaseBlobFromFile } from "./case-blob.js";
function defaultZipWorkerPath() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(here, "../../storage/zip_extract_worker.py");
}
function defaultRootDir() {
    return path.resolve(process.env.LEX_DATA_DIR ??
        path.join(os.homedir(), ".lex-machina", "data"));
}
function validCaseId(value) {
    return /^case_[a-f0-9]{32}$/
        .test(value);
}
function validUploadId(value) {
    return /^upload_[a-f0-9]{32}$/
        .test(value);
}
function validFileId(value) {
    return /^file_[a-f0-9]{32}$/
        .test(value);
}
function safeFilename(value) {
    const normalized = value
        .normalize("NFKC")
        .replace(/[\x00-\x1f\x7f]/g, "")
        .replace(/[\\/]/g, "_")
        .trim();
    const candidate = normalized ||
        "upload.bin";
    if (candidate === "." ||
        candidate === ".." ||
        candidate.length > 180) {
        return "upload.bin";
    }
    return candidate;
}
function sha256(data) {
    return createHash("sha256")
        .update(data)
        .digest("hex");
}
function manifestIdentity(caseId, uploadId, keyVersion) {
    return {
        caseId,
        objectId: uploadId,
        purpose: "incoming-manifest",
        keyVersion
    };
}
function payloadIdentity(caseId, uploadId, keyVersion) {
    return {
        caseId,
        objectId: uploadId,
        purpose: "incoming-payload",
        keyVersion
    };
}
function extractedManifestIdentity(caseId, fileId, keyVersion) {
    return {
        caseId,
        objectId: fileId,
        purpose: "extracted-manifest",
        keyVersion
    };
}
function extractedPayloadIdentity(caseId, fileId, keyVersion) {
    return {
        caseId,
        objectId: fileId,
        purpose: "extracted-payload",
        keyVersion
    };
}
export class SecureCaseUploadStore {
    rootDir;
    manifestMaxBytes;
    python;
    zipWorkerPath;
    zipTimeoutMs;
    workRoot;
    constructor(options = {}) {
        this.rootDir =
            path.resolve(options.rootDir ??
                defaultRootDir());
        this.manifestMaxBytes =
            options.manifestMaxBytes ??
                512 * 1024;
        this.python =
            options.python ??
                process.env
                    .LEX_STORAGE_PYTHON ??
                "python3";
        this.zipWorkerPath =
            options.zipWorkerPath ??
                process.env
                    .LEX_ZIP_WORKER ??
                defaultZipWorkerPath();
        this.zipTimeoutMs =
            options.zipTimeoutMs ??
                10 * 60 * 1000;
        this.workRoot =
            path.resolve(options.workRoot ??
                path.join(this.rootDir, "work", "zip"));
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
    incomingDir(caseId) {
        return path.join(this.caseDir(caseId), "secure", "incoming");
    }
    uploadDir(caseId, uploadId) {
        if (!validUploadId(uploadId)) {
            throw new Error("INVALID_UPLOAD_ID");
        }
        const base = path.resolve(this.incomingDir(caseId));
        const target = path.resolve(base, uploadId);
        if (!target.startsWith(base + path.sep)) {
            throw new Error("SECURE_UPLOAD_PATH_ESCAPE");
        }
        return target;
    }
    extractedDir(caseId, uploadId) {
        return path.join(this.uploadDir(caseId, uploadId), "extracted");
    }
    extractedFileDir(caseId, uploadId, fileId) {
        if (!validFileId(fileId)) {
            throw new Error("INVALID_FILE_ID");
        }
        const base = path.resolve(this.extractedDir(caseId, uploadId));
        const target = path.resolve(base, fileId);
        if (!target.startsWith(base + path.sep)) {
            throw new Error("EXTRACTED_FILE_PATH_ESCAPE");
        }
        return target;
    }
    async readExtractedManifest(args) {
        const data = await readCaseBlob({
            targetFile: path.join(this.extractedFileDir(args.caseId, args.uploadId, args.fileId), "manifest.lme"),
            identity: extractedManifestIdentity(args.caseId, args.fileId, args.keyVersion),
            caseDataKey: args.caseDataKey,
            maxBytes: this.manifestMaxBytes
        });
        try {
            const parsed = JSON.parse(data.toString("utf8"));
            if (parsed.fileId !==
                args.fileId ||
                parsed.uploadId !==
                    args.uploadId ||
                parsed.storage !==
                    "ENCRYPTED_LME1" ||
                typeof parsed.relativePath !==
                    "string" ||
                !parsed.relativePath ||
                typeof parsed.compressedBytes !==
                    "number" ||
                !Number.isSafeInteger(parsed.compressedBytes) ||
                parsed.compressedBytes < 0 ||
                typeof parsed.uncompressedBytes !==
                    "number" ||
                !Number.isSafeInteger(parsed.uncompressedBytes) ||
                parsed.uncompressedBytes < 0 ||
                !/^[a-f0-9]{64}$/.test(parsed.sha256) ||
                !(parsed.mediaType === null ||
                    typeof parsed.mediaType ===
                        "string") ||
                typeof parsed.processable !==
                    "boolean") {
                throw new Error("SECURE_EXTRACTED_MANIFEST_INVALID");
            }
            return parsed;
        }
        finally {
            data.fill(0);
        }
    }
    async listExtractedEntries(args) {
        let entries;
        try {
            entries =
                await readdir(this.extractedDir(args.caseId, args.uploadId), {
                    withFileTypes: true
                });
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT") {
                return [];
            }
            throw error;
        }
        const result = [];
        for (const entry of entries) {
            if (!entry.isDirectory() ||
                !validFileId(entry.name)) {
                throw new Error("SECURE_EXTRACTED_DIRECTORY_INVALID");
            }
            const manifest = await this.readExtractedManifest({
                ...args,
                fileId: entry.name
            });
            result.push({
                fileId: manifest.fileId,
                relativePath: manifest.relativePath,
                compressedBytes: manifest.compressedBytes,
                uncompressedBytes: manifest.uncompressedBytes,
                sha256: manifest.sha256,
                mediaType: manifest.mediaType,
                processable: manifest.processable
            });
        }
        return result.sort((a, b) => a.relativePath
            .localeCompare(b.relativePath));
    }
    async assertCaseKeyVersion(caseId, keyVersion) {
        await access(path.join(this.caseDir(caseId), "case.json"));
        const parsed = JSON.parse(await readFile(path.join(this.caseDir(caseId), "case.json"), "utf8"));
        if (parsed.caseId !==
            caseId ||
            parsed.keyVersion !==
                keyVersion ||
            typeof parsed
                .createdByUserId !==
                "string") {
            throw new Error("CASE_KEY_VERSION_MISMATCH");
        }
    }
    async cleanupOrphanedWorkdirs() {
        await rm(this.workRoot, {
            recursive: true,
            force: true
        });
        await mkdir(this.workRoot, {
            recursive: true,
            mode: 0o700
        });
    }
    async runZipWorker(inputPath, outputDir, workerManifest) {
        await new Promise((resolve, reject) => {
            const child = spawn(this.python, [
                this.zipWorkerPath,
                "--input",
                inputPath,
                "--output-dir",
                outputDir,
                "--manifest",
                workerManifest
            ], {
                stdio: [
                    "ignore",
                    "ignore",
                    "pipe"
                ],
                env: {
                    ...process.env,
                    PYTHONUNBUFFERED: "1"
                }
            });
            let stderr = "";
            const timer = setTimeout(() => {
                child.kill("SIGKILL");
                reject(new Error("ZIP_EXTRACTION_TIMEOUT"));
            }, this.zipTimeoutMs);
            child.stderr.on("data", (chunk) => {
                stderr +=
                    chunk.toString("utf8");
                if (stderr.length >
                    32_000) {
                    stderr =
                        stderr.slice(-32_000);
                }
            });
            child.once("error", (error) => {
                clearTimeout(timer);
                reject(error);
            });
            child.once("exit", (code) => {
                clearTimeout(timer);
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error("ZIP_EXTRACTION_FAILED:" +
                        stderr.trim()));
                }
            });
        });
    }
    async extractZipEncrypted(args) {
        await mkdir(this.workRoot, {
            recursive: true,
            mode: 0o700
        });
        const jobDir = await mkdtemp(path.join(this.workRoot, "job_"));
        await chmod(jobDir, 0o700);
        const inputPath = path.join(jobDir, "archive.bin");
        const outputDir = path.join(jobDir, "output");
        const workerManifest = path.join(jobDir, "manifest.json");
        const persistentExtracted = path.join(this.uploadDir(args.caseId, args.uploadId), "extracted");
        try {
            await writeFile(inputPath, args.data, {
                flag: "wx",
                mode: 0o600
            });
            await this.runZipWorker(inputPath, outputDir, workerManifest);
            const raw = JSON.parse(await readFile(workerManifest, "utf8"));
            if (!Array.isArray(raw.entries) ||
                raw.entries.length >
                    10_000) {
                throw new Error("ZIP_MANIFEST_INVALID");
            }
            await mkdir(persistentExtracted, {
                recursive: true,
                mode: 0o700
            });
            const result = [];
            const outputBase = path.resolve(outputDir) + path.sep;
            for (const unknownEntry of raw.entries) {
                if (!unknownEntry ||
                    typeof unknownEntry !==
                        "object" ||
                    Array.isArray(unknownEntry)) {
                    throw new Error("ZIP_MANIFEST_INVALID");
                }
                const entry = unknownEntry;
                const relativePath = typeof entry
                    .relativePath ===
                    "string"
                    ? entry
                        .relativePath
                    : "";
                const compressedBytes = entry
                    .compressedBytes;
                const uncompressedBytes = entry
                    .uncompressedBytes;
                const digest = typeof entry.sha256 ===
                    "string"
                    ? entry.sha256
                    : "";
                const mediaType = entry.mediaType ===
                    null ||
                    typeof entry.mediaType ===
                        "string"
                    ? entry.mediaType
                    : undefined;
                const processable = entry.processable;
                if (!relativePath ||
                    relativePath.length >
                        512 ||
                    relativePath.includes("\\") ||
                    path.posix.isAbsolute(relativePath) ||
                    relativePath
                        .split("/")
                        .some((part) => !part ||
                        part === "." ||
                        part === "..") ||
                    typeof compressedBytes !==
                        "number" ||
                    !Number.isSafeInteger(compressedBytes) ||
                    compressedBytes < 0 ||
                    typeof uncompressedBytes !==
                        "number" ||
                    !Number.isSafeInteger(uncompressedBytes) ||
                    uncompressedBytes < 0 ||
                    uncompressedBytes >
                        512 *
                            1024 *
                            1024 ||
                    !/^[a-f0-9]{64}$/
                        .test(digest) ||
                    mediaType === undefined ||
                    typeof processable !==
                        "boolean") {
                    throw new Error("ZIP_MANIFEST_INVALID");
                }
                const plaintextPath = path.resolve(outputDir, relativePath);
                if (!plaintextPath
                    .startsWith(outputBase)) {
                    throw new Error("ZIP_OUTPUT_PATH_ESCAPE");
                }
                const plaintextStat = await stat(plaintextPath);
                if (!plaintextStat
                    .isFile() ||
                    plaintextStat.size !==
                        uncompressedBytes) {
                    throw new Error("ZIP_OUTPUT_SIZE_MISMATCH");
                }
                const fileId = "file_" +
                    randomBytes(16)
                        .toString("hex");
                const encryptedDir = path.join(persistentExtracted, fileId);
                await mkdir(encryptedDir, {
                    recursive: true,
                    mode: 0o700
                });
                await writeCaseBlobFromFile({
                    targetFile: path.join(encryptedDir, "payload.lme"),
                    sourceFile: plaintextPath,
                    identity: extractedPayloadIdentity(args.caseId, fileId, args.keyVersion),
                    caseDataKey: args.caseDataKey,
                    expectedSha256: digest
                });
                const stored = {
                    fileId,
                    relativePath,
                    compressedBytes,
                    uncompressedBytes,
                    sha256: digest,
                    mediaType,
                    processable
                };
                const encryptedManifest = {
                    ...stored,
                    fileId,
                    uploadId: args.uploadId,
                    storage: "ENCRYPTED_LME1"
                };
                const manifestBytes = Buffer.from(JSON.stringify(encryptedManifest), "utf8");
                try {
                    await writeCaseBlob({
                        targetFile: path.join(encryptedDir, "manifest.lme"),
                        identity: extractedManifestIdentity(args.caseId, fileId, args.keyVersion),
                        caseDataKey: args.caseDataKey,
                        data: manifestBytes
                    });
                }
                finally {
                    manifestBytes.fill(0);
                }
                result.push(stored);
            }
            return result;
        }
        catch (error) {
            await rm(persistentExtracted, {
                recursive: true,
                force: true
            });
            throw error;
        }
        finally {
            await rm(jobDir, {
                recursive: true,
                force: true
            });
        }
    }
    async saveUpload(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        const uploadId = args.uploadId ??
            ("upload_" +
                randomBytes(16)
                    .toString("hex"));
        if (!validUploadId(uploadId)) {
            throw new Error("INVALID_UPLOAD_ID");
        }
        await mkdir(this.incomingDir(args.caseId), {
            recursive: true,
            mode: 0o700
        });
        const dir = this.uploadDir(args.caseId, uploadId);
        try {
            await access(dir);
            throw new Error("SECURE_UPLOAD_ALREADY_EXISTS");
        }
        catch (error) {
            if (!(error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT")) {
                throw error;
            }
        }
        await mkdir(this.incomingDir(args.caseId), {
            recursive: true,
            mode: 0o700
        });
        await mkdir(dir, {
            recursive: false,
            mode: 0o700
        });
        const filename = safeFilename(args.filename);
        const isZip = args.mediaType ===
            "application/zip" ||
            filename
                .toLowerCase()
                .endsWith(".zip");
        const manifest = {
            caseId: args.caseId,
            uploadId,
            filename,
            mediaType: args.mediaType,
            sha256: sha256(args.data),
            bytes: args.data.byteLength,
            storedAt: new Date()
                .toISOString(),
            archive: isZip,
            extracted: [],
            storage: "ENCRYPTED_LME1"
        };
        try {
            await writeCaseBlob({
                targetFile: path.join(dir, "payload.lme"),
                identity: payloadIdentity(args.caseId, uploadId, args.keyVersion),
                caseDataKey: args.caseDataKey,
                data: args.data,
                expectedSha256: manifest.sha256
            });
            if (isZip) {
                manifest.extracted =
                    await this
                        .extractZipEncrypted({
                        caseId: args.caseId,
                        uploadId,
                        data: args.data,
                        caseDataKey: args.caseDataKey,
                        keyVersion: args.keyVersion
                    });
                manifest.archiveExtractionStatus =
                    "COMPLETE";
            }
            const manifestBytes = Buffer.from(JSON.stringify(manifest), "utf8");
            try {
                await writeCaseBlob({
                    targetFile: path.join(dir, "manifest.lme"),
                    identity: manifestIdentity(args.caseId, uploadId, args.keyVersion),
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
    async listUploads(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        let entries;
        try {
            entries =
                await readdir(this.incomingDir(args.caseId), {
                    withFileTypes: true
                });
        }
        catch (error) {
            if (error instanceof
                Error &&
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
                !validUploadId(entry.name)) {
                continue;
            }
            try {
                const data = await readCaseBlob({
                    targetFile: path.join(this.uploadDir(args.caseId, entry.name), "manifest.lme"),
                    identity: manifestIdentity(args.caseId, entry.name, args.keyVersion),
                    caseDataKey: args.caseDataKey,
                    maxBytes: this
                        .manifestMaxBytes
                });
                try {
                    const parsed = JSON.parse(data.toString("utf8"));
                    if (parsed.caseId !==
                        args.caseId ||
                        parsed.uploadId !==
                            entry.name ||
                        typeof parsed
                            .filename !==
                            "string" ||
                        typeof parsed
                            .mediaType !==
                            "string" ||
                        !/^[a-f0-9]{64}$/
                            .test(parsed.sha256) ||
                        typeof parsed
                            .bytes !==
                            "number" ||
                        typeof parsed
                            .storedAt !==
                            "string" ||
                        typeof parsed
                            .archive !==
                            "boolean" ||
                        !Array.isArray(parsed.extracted) ||
                        parsed.storage !==
                            "ENCRYPTED_LME1") {
                        throw new Error("SECURE_UPLOAD_MANIFEST_INVALID");
                    }
                    if (parsed.archive) {
                        parsed.extracted =
                            await this
                                .listExtractedEntries({
                                caseId: args.caseId,
                                uploadId: entry.name,
                                caseDataKey: args.caseDataKey,
                                keyVersion: args.keyVersion
                            });
                    }
                    result.push(parsed);
                }
                finally {
                    data.fill(0);
                }
            }
            catch {
                // Fail closed for the invalid entry, but keep unrelated
                // valid uploads browsable.
            }
        }
        return result.sort((a, b) => b.storedAt
            .localeCompare(a.storedAt));
    }
    async readUploadPayload(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        return await readCaseBlob({
            targetFile: path.join(this.uploadDir(args.caseId, args.uploadId), "payload.lme"),
            identity: payloadIdentity(args.caseId, args.uploadId, args.keyVersion),
            caseDataKey: args.caseDataKey,
            maxBytes: args.maxBytes
        });
    }
    async readExtractedPayload(args) {
        await this
            .assertCaseKeyVersion(args.caseId, args.keyVersion);
        const manifest = await this
            .readExtractedManifest({
            caseId: args.caseId,
            uploadId: args.uploadId,
            fileId: args.fileId,
            caseDataKey: args.caseDataKey,
            keyVersion: args.keyVersion
        });
        if (manifest.uncompressedBytes >
            args.maxBytes) {
            throw new Error("EXTRACTED_PAYLOAD_LIMIT_EXCEEDED");
        }
        const data = await readCaseBlob({
            targetFile: path.join(this.extractedFileDir(args.caseId, args.uploadId, args.fileId), "payload.lme"),
            identity: extractedPayloadIdentity(args.caseId, args.fileId, args.keyVersion),
            caseDataKey: args.caseDataKey,
            maxBytes: args.maxBytes
        });
        if (data.byteLength !==
            manifest.uncompressedBytes ||
            sha256(data) !==
                manifest.sha256) {
            data.fill(0);
            throw new Error("EXTRACTED_PAYLOAD_INTEGRITY_FAILED");
        }
        return {
            manifest: {
                fileId: manifest.fileId,
                relativePath: manifest.relativePath,
                compressedBytes: manifest.compressedBytes,
                uncompressedBytes: manifest.uncompressedBytes,
                sha256: manifest.sha256,
                mediaType: manifest.mediaType,
                processable: manifest.processable
            },
            data
        };
    }
    async rekeyCaseIncoming(args) {
        let entries;
        try {
            entries =
                await readdir(this.incomingDir(args.caseId), {
                    withFileTypes: true
                });
        }
        catch (error) {
            if (error instanceof
                Error &&
                "code" in error &&
                error.code ===
                    "ENOENT") {
                return false;
            }
            throw error;
        }
        const uploadIds = entries
            .filter((entry) => entry
            .isDirectory() &&
            validUploadId(entry.name))
            .map((entry) => entry.name)
            .sort();
        const completed = [];
        const rekeyOne = async (uploadId, reverse = false) => {
            const fromKey = reverse
                ? args
                    .newCaseDataKey
                : args
                    .oldCaseDataKey;
            const toKey = reverse
                ? args
                    .oldCaseDataKey
                : args
                    .newCaseDataKey;
            const fromVersion = reverse
                ? args
                    .newKeyVersion
                : args
                    .oldKeyVersion;
            const toVersion = reverse
                ? args
                    .oldKeyVersion
                : args
                    .newKeyVersion;
            const dir = this.uploadDir(args.caseId, uploadId);
            const descriptors = [
                {
                    targetFile: path.join(dir, "payload.lme"),
                    fromIdentity: payloadIdentity(args.caseId, uploadId, fromVersion),
                    toIdentity: payloadIdentity(args.caseId, uploadId, toVersion)
                },
                {
                    targetFile: path.join(dir, "manifest.lme"),
                    fromIdentity: manifestIdentity(args.caseId, uploadId, fromVersion),
                    toIdentity: manifestIdentity(args.caseId, uploadId, toVersion)
                }
            ];
            const extractedRoot = path.join(dir, "extracted");
            try {
                const extractedEntries = await readdir(extractedRoot, {
                    withFileTypes: true
                });
                for (const entry of extractedEntries) {
                    if (!entry
                        .isDirectory() ||
                        !validFileId(entry.name)) {
                        continue;
                    }
                    descriptors.push({
                        targetFile: path.join(extractedRoot, entry.name, "payload.lme"),
                        fromIdentity: extractedPayloadIdentity(args.caseId, entry.name, fromVersion),
                        toIdentity: extractedPayloadIdentity(args.caseId, entry.name, toVersion)
                    }, {
                        targetFile: path.join(extractedRoot, entry.name, "manifest.lme"),
                        fromIdentity: extractedManifestIdentity(args.caseId, entry.name, fromVersion),
                        toIdentity: extractedManifestIdentity(args.caseId, entry.name, toVersion)
                    });
                }
            }
            catch (error) {
                if (!(error instanceof
                    Error &&
                    "code" in error &&
                    error.code ===
                        "ENOENT")) {
                    throw error;
                }
            }
            const changed = [];
            try {
                for (const descriptor of descriptors) {
                    await rekeyCaseBlob({
                        targetFile: descriptor
                            .targetFile,
                        oldIdentity: descriptor
                            .fromIdentity,
                        newIdentity: descriptor
                            .toIdentity,
                        oldCaseDataKey: fromKey,
                        newCaseDataKey: toKey
                    });
                    changed.push(descriptor);
                }
            }
            catch (error) {
                try {
                    for (const descriptor of [...changed]
                        .reverse()) {
                        await rekeyCaseBlob({
                            targetFile: descriptor
                                .targetFile,
                            oldIdentity: descriptor
                                .toIdentity,
                            newIdentity: descriptor
                                .fromIdentity,
                            oldCaseDataKey: toKey,
                            newCaseDataKey: fromKey
                        });
                    }
                }
                catch {
                    throw new Error("SECURE_UPLOAD_REKEY_ROLLBACK_FAILED");
                }
                throw error;
            }
        };
        try {
            for (const uploadId of uploadIds) {
                await rekeyOne(uploadId);
                completed.push(uploadId);
            }
            return (uploadIds.length > 0);
        }
        catch (error) {
            try {
                for (const uploadId of [...completed]
                    .reverse()) {
                    await rekeyOne(uploadId, true);
                }
            }
            catch {
                throw new Error("SECURE_CASE_REKEY_ROLLBACK_FAILED");
            }
            throw error;
        }
    }
}
