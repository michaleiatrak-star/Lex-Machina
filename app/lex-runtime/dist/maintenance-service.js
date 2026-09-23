import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { WindowsAuthenticodeInstallerVerifier } from "./application-update-verifier.js";
import { LexSkillRegistry } from "./registry.js";
import { skillUpdateSignatureMode, skillUpdateTrustReady, verifySkillUpdateIndex } from "./skill-update-verifier.js";
import { modelPackSignatureMode, modelPackTrustReady, modelUpdateFamilyForId, verifyModelPackIndex } from "./model-pack-verifier.js";
import { CURRENT_APPLICATION_VERSION, compareVersions } from "./update-discovery.js";
function localAppDataRoot() {
    const base = process.env.LOCALAPPDATA?.trim();
    if (base)
        return path.resolve(base, "LexMachina");
    return path.resolve(os.homedir(), ".lex-machina");
}
export function installedSkillOverlayRoot() {
    return path.join(localAppDataRoot(), "skills", "current");
}
export function installedSkillOverlayPreviousRoot() {
    return path.join(localAppDataRoot(), "skills", "previous");
}
export function validateSkillOverlayRoot(root, options) {
    const resolved = path.resolve(root);
    if (!fs.existsSync(resolved) ||
        !fs.statSync(resolved).isDirectory()) {
        return {
            healthy: false,
            version: null,
            issues: ["ROOT_MISSING"]
        };
    }
    let version = null;
    const versionMarker = markerPath(resolved);
    if (fs.existsSync(versionMarker)) {
        try {
            const marker = JSON.parse(fs.readFileSync(versionMarker, "utf8"));
            if (typeof marker.version !==
                "string" ||
                !/^\d+\.\d+\.\d+$/.test(marker.version)) {
                return {
                    healthy: false,
                    version: null,
                    issues: [
                        "VERSION_MARKER_INVALID"
                    ]
                };
            }
            version = marker.version;
        }
        catch {
            return {
                healthy: false,
                version: null,
                issues: [
                    "VERSION_MARKER_INVALID"
                ]
            };
        }
    }
    else if (options?.requireVersionMarker ??
        true) {
        return {
            healthy: false,
            version: null,
            issues: [
                "VERSION_MARKER_MISSING"
            ]
        };
    }
    else {
        version =
            options?.fallbackVersion ??
                null;
    }
    const registry = new LexSkillRegistry(resolved);
    const issues = [
        ...registry.scan(),
        ...registry.validateDeclarations()
    ].map((issue) => issue.code +
        ":" +
        (issue.skill ?? "") +
        ":" +
        (issue.target ?? ""));
    if (registry.skills.size === 0) {
        issues.push("NO_SKILLS");
    }
    return {
        healthy: issues.length === 0,
        version,
        issues
    };
}
function readSkillHealthMarker(root) {
    try {
        const parsed = JSON.parse(fs.readFileSync(markerPath(root), "utf8"));
        return (parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed))
            ? parsed
            : null;
    }
    catch {
        return null;
    }
}
function writeSkillHealthMarker(root, patch) {
    const target = markerPath(root);
    let existing = {};
    try {
        const parsed = JSON.parse(fs.readFileSync(target, "utf8"));
        if (parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)) {
            existing =
                parsed;
        }
    }
    catch {
        // Validation runs before this helper is used.
    }
    const temporary = target + ".tmp";
    fs.writeFileSync(temporary, JSON.stringify({
        ...existing,
        ...patch
    }, null, 2) + "\n", "utf8");
    fs.renameSync(temporary, target);
}
export function recoverSkillOverlayForStartup(bundledRoot) {
    const current = installedSkillOverlayRoot();
    const previous = installedSkillOverlayPreviousRoot();
    if (!fs.existsSync(current)) {
        return {
            root: null,
            action: "BUNDLED",
            version: null
        };
    }
    const currentHealth = validateSkillOverlayRoot(current);
    const marker = currentHealth.healthy
        ? readSkillHealthMarker(current)
        : null;
    const markerHealth = typeof marker?.health ===
        "string"
        ? marker.health
        : null;
    if (currentHealth.healthy &&
        markerHealth ===
            "PENDING_RESTART_VALIDATION") {
        writeSkillHealthMarker(current, {
            health: "RUNTIME_VALIDATION_IN_PROGRESS",
            runtimeValidationStartedAt: new Date().toISOString()
        });
        return {
            root: current,
            action: "CURRENT_RUNTIME_VALIDATION",
            version: currentHealth.version
        };
    }
    const effectiveCurrentHealth = currentHealth.healthy &&
        markerHealth ===
            "RUNTIME_VALIDATION_IN_PROGRESS"
        ? {
            healthy: false,
            version: currentHealth.version,
            issues: [
                "RUNTIME_VALIDATION_INCOMPLETE"
            ]
        }
        : currentHealth;
    if (effectiveCurrentHealth.healthy) {
        return {
            root: current,
            action: "CURRENT_HEALTHY",
            version: effectiveCurrentHealth.version
        };
    }
    const previousHealth = validateSkillOverlayRoot(previous);
    if (!previousHealth.healthy) {
        const bundledHealth = bundledRoot
            ? validateSkillOverlayRoot(bundledRoot, {
                requireVersionMarker: false,
                fallbackVersion: CURRENT_APPLICATION_VERSION
            })
            : {
                healthy: false,
                version: null,
                issues: [
                    "BUNDLED_ROOT_NOT_PROVIDED"
                ]
            };
        if (bundledRoot &&
            bundledHealth.healthy) {
            const failed = path.join(path.dirname(current), "failed-" +
                Date.now() +
                "-" +
                randomBytes(4)
                    .toString("hex"));
            fs.renameSync(current, failed);
            try {
                fs.rmSync(failed, {
                    recursive: true,
                    force: true
                });
            }
            catch {
                // Keeping a quarantined failed overlay is safer than restoring it.
            }
            return {
                root: path.resolve(bundledRoot),
                action: "ROLLED_BACK_TO_BUNDLED",
                version: bundledHealth.version,
                ...(effectiveCurrentHealth.version
                    ? {
                        rolledBackFromVersion: effectiveCurrentHealth.version
                    }
                    : {})
            };
        }
        throw new Error("SKILL_OVERLAY_STARTUP_INVALID_NO_ROLLBACK:current=" +
            effectiveCurrentHealth.issues.join(",") +
            ":previous=" +
            previousHealth.issues.join(",") +
            ":bundled=" +
            bundledHealth.issues.join(","));
    }
    const failed = path.join(path.dirname(current), "failed-" +
        Date.now() +
        "-" +
        randomBytes(4).toString("hex"));
    fs.renameSync(current, failed);
    try {
        fs.renameSync(previous, current);
    }
    catch (error) {
        fs.renameSync(failed, current);
        throw error;
    }
    try {
        writeSkillHealthMarker(current, {
            health: "ROLLED_BACK_HEALTHY",
            validatedAt: new Date().toISOString(),
            rolledBackFromVersion: effectiveCurrentHealth.version,
            rollbackReason: effectiveCurrentHealth.issues
        });
        fs.rmSync(failed, {
            recursive: true,
            force: true
        });
    }
    catch (error) {
        throw error;
    }
    return {
        root: current,
        action: "ROLLED_BACK_TO_PREVIOUS",
        version: previousHealth.version,
        ...(effectiveCurrentHealth.version
            ? {
                rolledBackFromVersion: effectiveCurrentHealth.version
            }
            : {})
    };
}
export function commitSkillOverlayRuntimeHealth(root) {
    const current = installedSkillOverlayRoot();
    const resolved = path.resolve(root);
    if (!fs.existsSync(current) ||
        resolved !==
            path.resolve(current)) {
        return;
    }
    const health = validateSkillOverlayRoot(current);
    if (!health.healthy) {
        throw new Error("SKILL_OVERLAY_RUNTIME_COMMIT_INVALID");
    }
    const marker = readSkillHealthMarker(current);
    if (marker?.health !==
        "RUNTIME_VALIDATION_IN_PROGRESS") {
        return;
    }
    writeSkillHealthMarker(current, {
        health: "ACTIVE_HEALTHY",
        runtimeValidatedAt: new Date().toISOString()
    });
}
export function applicationUpdateStagingRoot() {
    return path.join(os.tmpdir(), "LexMachinaUpdate");
}
function markerPath(root) {
    return path.join(root, ".lex-skills-version.json");
}
export function installedSkillOverlayVersion() {
    try {
        const parsed = JSON.parse(fs.readFileSync(markerPath(installedSkillOverlayRoot()), "utf8"));
        return typeof parsed.version === "string"
            ? parsed.version
            : null;
    }
    catch {
        return null;
    }
}
function sha256(data) {
    return createHash("sha256").update(data).digest("hex");
}
async function downloadVerified(asset, fetchImpl) {
    const response = await fetchImpl(asset.url, {
        headers: {
            Accept: "application/octet-stream"
        },
        redirect: "follow",
        signal: AbortSignal.timeout(30 * 60_000)
    });
    if (!response.ok) {
        throw new Error(`UPDATE_ASSET_DOWNLOAD_FAILED:${response.status}`);
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    const actual = sha256(bytes);
    if (actual !== asset.sha256.toLowerCase()) {
        throw new Error("UPDATE_ASSET_HASH_MISMATCH");
    }
    if (asset.bytes !== undefined && bytes.byteLength !== asset.bytes) {
        throw new Error("UPDATE_ASSET_SIZE_MISMATCH");
    }
    return bytes;
}
function requireLatestVersion(status) {
    if (!status.latestVersion) {
        throw new Error("UPDATE_RELEASE_VERSION_MISSING");
    }
    return status.latestVersion;
}
function extractZip(zipPath, destination) {
    fs.mkdirSync(destination, { recursive: true });
    const result = process.platform === "win32"
        ? spawnSync("powershell.exe", [
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            "Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force",
            zipPath,
            destination
        ], { encoding: "utf8", windowsHide: true })
        : spawnSync("unzip", ["-q", zipPath, "-d", destination], { encoding: "utf8" });
    if (result.status !== 0) {
        throw new Error(`SKILL_UPDATE_EXTRACT_FAILED:${result.stderr || result.stdout || result.status}`);
    }
}
function skillFileSha256(filePath) {
    return createHash("sha256")
        .update(fs.readFileSync(filePath))
        .digest("hex");
}
export function validateSkillCandidateAgainstIndex(registry, index) {
    const actualIds = [
        ...registry.skills.keys()
    ].sort();
    const indexedIds = index.skills
        .map((skill) => skill.id)
        .sort();
    if (JSON.stringify(actualIds) !==
        JSON.stringify(indexedIds)) {
        throw new Error("SKILL_UPDATE_INDEX_SKILL_SET_MISMATCH");
    }
    for (const expected of index.skills) {
        const actual = registry.get(expected.id);
        if (!actual) {
            throw new Error("SKILL_UPDATE_INDEX_SKILL_SET_MISMATCH");
        }
        const version = typeof actual.frontmatter.version ===
            "string"
            ? actual.frontmatter.version.trim()
            : "";
        if (version !== expected.version) {
            throw new Error(`SKILL_UPDATE_INDEX_VERSION_MISMATCH:${expected.id}`);
        }
        const actualHash = skillFileSha256(actual.skillFile);
        if (actualHash !==
            expected.sha256.toLowerCase()) {
            throw new Error(`SKILL_UPDATE_INDEX_HASH_MISMATCH:${expected.id}`);
        }
        const dependencies = [
            ...new Set(actual.frontmatter
                .dependencies?.requires ??
                [])
        ].sort();
        if (JSON.stringify(dependencies) !==
            JSON.stringify([...expected.dependencies]
                .sort())) {
            throw new Error(`SKILL_UPDATE_INDEX_DEPENDENCY_MISMATCH:${expected.id}`);
        }
    }
}
function locateSkillRoot(stage) {
    for (const candidate of [
        path.join(stage, "Wersja rozwojowa rozpakowana"),
        path.join(stage, "corpus"),
        stage
    ]) {
        if (!fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) {
            continue;
        }
        const registry = new LexSkillRegistry(candidate);
        const issues = [
            ...registry.scan(),
            ...registry.validateDeclarations()
        ];
        if (registry.skills.size > 0 && issues.length === 0) {
            return candidate;
        }
    }
    throw new Error("SKILL_UPDATE_CORPUS_INVALID");
}
export class MaintenanceService {
    discovery;
    fetchImpl;
    installerVerifier;
    skillTrustReady;
    skillIndexVerifier;
    modelPackTrustPolicyReady;
    modelPackIndexVerifier;
    skillSignatureMode;
    modelSignatureMode;
    constructor(discovery, fetchImpl = fetch, installerVerifier = new WindowsAuthenticodeInstallerVerifier(), skillTrustReady = skillUpdateTrustReady, skillIndexVerifier = (indexBytes, signatureBytes) => verifySkillUpdateIndex(indexBytes, signatureBytes), modelPackTrustPolicyReady = modelPackTrustReady, modelPackIndexVerifier = (indexBytes, signatureBytes) => verifyModelPackIndex(indexBytes, signatureBytes), skillSignatureMode = skillUpdateSignatureMode, modelSignatureMode = modelPackSignatureMode) {
        this.discovery = discovery;
        this.fetchImpl = fetchImpl;
        this.installerVerifier = installerVerifier;
        this.skillTrustReady = skillTrustReady;
        this.skillIndexVerifier = skillIndexVerifier;
        this.modelPackTrustPolicyReady = modelPackTrustPolicyReady;
        this.modelPackIndexVerifier = modelPackIndexVerifier;
        this.skillSignatureMode = skillSignatureMode;
        this.modelSignatureMode = modelSignatureMode;
    }
    async applicationStatus() {
        return await this.discovery.check();
    }
    async downloadApplicationUpdate() {
        const status = await this.discovery.check();
        if (status.status !== "AVAILABLE") {
            throw new Error("APPLICATION_UPDATE_NOT_AVAILABLE");
        }
        if (!status.installer) {
            throw new Error("APPLICATION_UPDATE_INSTALLER_NOT_VERIFIED");
        }
        const version = requireLatestVersion(status);
        const bytes = await downloadVerified(status.installer, this.fetchImpl);
        const root = applicationUpdateStagingRoot();
        fs.mkdirSync(root, { recursive: true });
        const nonce = randomBytes(8).toString("hex");
        const token = `update_${version.replaceAll(".", "-")}_${nonce}.exe`;
        const receiptToken = token.replace(/\.exe$/i, ".json");
        const target = path.join(root, token);
        const temporary = `${target}.tmp`;
        const receiptPath = path.join(root, receiptToken);
        const receiptTemporary = `${receiptPath}.tmp`;
        try {
            fs.writeFileSync(temporary, bytes, { flag: "wx" });
            fs.renameSync(temporary, target);
            const publisher = this.installerVerifier.verify(target, version);
            const stagedAt = new Date().toISOString();
            const receipt = {
                schemaVersion: 1,
                kind: "LEX_MACHINA_APPLICATION_UPDATE",
                version,
                installerToken: token,
                originalFilename: status.installer.name,
                sha256: status.installer.sha256.toLowerCase(),
                bytes: bytes.byteLength,
                stagedAt,
                publisher
            };
            fs.writeFileSync(receiptTemporary, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
            fs.renameSync(receiptTemporary, receiptPath);
            return {
                version,
                token,
                receiptToken,
                filename: status.installer.name,
                sha256: status.installer.sha256.toLowerCase(),
                bytes: bytes.byteLength,
                stagedAt,
                publisher
            };
        }
        catch (error) {
            fs.rmSync(temporary, { force: true });
            fs.rmSync(receiptTemporary, { force: true });
            fs.rmSync(receiptPath, { force: true });
            fs.rmSync(target, { force: true });
            throw error;
        }
    }
    async skillStatus() {
        const status = await this.discovery.check();
        const currentVersion = installedSkillOverlayVersion() ??
            CURRENT_APPLICATION_VERSION;
        const latestVersion = status.latestVersion;
        const available = Boolean(status.skillsBundle && latestVersion) &&
            compareVersions(currentVersion, latestVersion) < 0;
        const signatureMode = this.skillSignatureMode();
        const indexAssetsReady = Boolean(status.skillsBundle &&
            status.skillsIndex &&
            (signatureMode ===
                "UNSIGNED_ALLOWED" ||
                status.skillsSignature));
        const verificationReady = this.skillTrustReady();
        let blockedReason = null;
        if (available &&
            !indexAssetsReady) {
            blockedReason =
                status.skillsIndex
                    ? "SIGNED_INDEX_MISSING"
                    : "INDEX_MISSING";
        }
        else if (available &&
            !verificationReady) {
            blockedReason =
                "SIGNER_POLICY_MISSING";
        }
        return {
            currentVersion,
            status: status.status === "UNAVAILABLE" || status.status === "NO_RELEASE"
                ? "UNAVAILABLE"
                : available
                    ? "AVAILABLE"
                    : "UP_TO_DATE",
            ...(latestVersion ? { latestVersion } : {}),
            checkedAt: status.checkedAt,
            bundleReady: indexAssetsReady &&
                verificationReady,
            verificationReady,
            signatureMode,
            ...(blockedReason
                ? { blockedReason }
                : {})
        };
    }
    async verifiedModelPackTarget(modelId) {
        const status = await this.discovery.check();
        const signatureMode = this.modelSignatureMode();
        if (!status.modelPackIndex) {
            throw new Error("MODEL_PACK_INDEX_MISSING");
        }
        if (signatureMode ===
            "SIGNED_REQUIRED" &&
            !status.modelPackSignature) {
            throw new Error("MODEL_PACK_SIGNED_INDEX_MISSING");
        }
        if (!this.modelPackTrustPolicyReady()) {
            throw new Error("MODEL_PACK_SIGNER_POLICY_MISSING");
        }
        const indexBytes = await downloadVerified(status.modelPackIndex, this.fetchImpl);
        const signatureBytes = status.modelPackSignature
            ? await downloadVerified(status.modelPackSignature, this.fetchImpl)
            : new Uint8Array();
        const verified = this.modelPackIndexVerifier(indexBytes, signatureBytes);
        const index = verified.index;
        if (compareVersions(CURRENT_APPLICATION_VERSION, index.compatibility
            .minAppVersion) < 0 ||
            (index.compatibility
                .maxAppVersion &&
                compareVersions(CURRENT_APPLICATION_VERSION, index.compatibility
                    .maxAppVersion) > 0)) {
            throw new Error("MODEL_PACK_APP_INCOMPATIBLE");
        }
        const model = index.models.find((item) => item.id === modelId);
        if (!model) {
            throw new Error("MODEL_PACK_MODEL_NOT_IN_INDEX");
        }
        const family = model.family ??
            modelUpdateFamilyForId(model.id);
        return {
            packVersion: index.version,
            signerKeyId: verified.signerKeyId,
            indexSha256: verified.indexSha256,
            model: {
                ...model,
                ...(family
                    ? { family }
                    : {})
            }
        };
    }
    async modelPackStatus(installed) {
        const discovery = await this.discovery.check();
        const signatureMode = this.modelSignatureMode();
        const verificationReady = this.modelPackTrustPolicyReady();
        const indexReady = Boolean(discovery.modelPackIndex &&
            (signatureMode ===
                "UNSIGNED_ALLOWED" ||
                discovery.modelPackSignature));
        const installedFamily = installed
            ? modelUpdateFamilyForId(installed.modelId) ??
                undefined
            : undefined;
        if (!installed) {
            return {
                status: "NOT_CONFIGURED",
                checkedAt: discovery.checkedAt,
                verificationReady,
                signatureMode
            };
        }
        if (discovery.status ===
            "UNAVAILABLE" ||
            (discovery.status ===
                "NO_RELEASE" &&
                (!indexReady))) {
            return {
                status: "UNAVAILABLE",
                checkedAt: discovery.checkedAt,
                modelId: installed.modelId,
                ...(installedFamily
                    ? {
                        modelFamily: installedFamily
                    }
                    : {}),
                currentSha256: installed.sha256,
                verificationReady,
                signatureMode
            };
        }
        if (!indexReady) {
            return {
                status: "BLOCKED",
                checkedAt: discovery.checkedAt,
                modelId: installed.modelId,
                ...(installedFamily
                    ? {
                        modelFamily: installedFamily
                    }
                    : {}),
                currentSha256: installed.sha256,
                verificationReady,
                signatureMode,
                blockedReason: (discovery.modelPackIndex
                    ? "SIGNED_INDEX_MISSING"
                    : "INDEX_INVALID")
            };
        }
        if (!verificationReady) {
            return {
                status: "BLOCKED",
                checkedAt: discovery.checkedAt,
                modelId: installed.modelId,
                ...(installedFamily
                    ? {
                        modelFamily: installedFamily
                    }
                    : {}),
                currentSha256: installed.sha256,
                verificationReady,
                signatureMode,
                blockedReason: "SIGNER_POLICY_MISSING"
            };
        }
        try {
            const target = await this
                .verifiedModelPackTarget(installed.modelId);
            if (installed.packVersion) {
                const packComparison = compareVersions(target.packVersion, installed.packVersion);
                if (packComparison < 0) {
                    return {
                        status: "BLOCKED",
                        checkedAt: discovery.checkedAt,
                        modelId: installed.modelId,
                        currentSha256: installed.sha256
                            .toLowerCase(),
                        latestPackVersion: target.packVersion,
                        targetSha256: target.model.sha256,
                        verificationReady: true,
                        signatureMode,
                        signerKeyId: target.signerKeyId,
                        blockedReason: "PACK_VERSION_ROLLBACK"
                    };
                }
                if (packComparison === 0 &&
                    target.model.sha256 !==
                        installed.sha256
                            .toLowerCase()) {
                    return {
                        status: "BLOCKED",
                        checkedAt: discovery.checkedAt,
                        modelId: installed.modelId,
                        currentSha256: installed.sha256
                            .toLowerCase(),
                        latestPackVersion: target.packVersion,
                        targetSha256: target.model.sha256,
                        verificationReady: true,
                        signatureMode,
                        signerKeyId: target.signerKeyId,
                        blockedReason: "PACK_VERSION_HASH_CONFLICT"
                    };
                }
            }
            const available = target.model.sha256 !==
                installed.sha256
                    .toLowerCase();
            return {
                status: available
                    ? "AVAILABLE"
                    : "UP_TO_DATE",
                checkedAt: discovery.checkedAt,
                modelId: installed.modelId,
                ...(installedFamily
                    ? {
                        modelFamily: installedFamily
                    }
                    : {}),
                currentSha256: installed.sha256
                    .toLowerCase(),
                latestPackVersion: target.packVersion,
                targetModelId: target.model.id,
                targetDisplayName: target.model.displayName,
                ...(target.model.bytes
                    ? {
                        targetBytes: target.model.bytes
                    }
                    : {}),
                targetSha256: target.model.sha256,
                verificationReady: true,
                signatureMode,
                signerKeyId: target.signerKeyId
            };
        }
        catch (error) {
            const code = error instanceof Error
                ? error.message
                : String(error);
            const blockedReason = code ===
                "MODEL_PACK_APP_INCOMPATIBLE"
                ? "APP_INCOMPATIBLE"
                : code ===
                    "MODEL_PACK_MODEL_NOT_IN_INDEX"
                    ? "MODEL_NOT_IN_INDEX"
                    : "INDEX_INVALID";
            return {
                status: "BLOCKED",
                checkedAt: discovery.checkedAt,
                modelId: installed.modelId,
                ...(installedFamily
                    ? {
                        modelFamily: installedFamily
                    }
                    : {}),
                currentSha256: installed.sha256,
                verificationReady: true,
                signatureMode,
                blockedReason
            };
        }
    }
    async applySkillUpdate() {
        const status = await this.discovery.check();
        const version = requireLatestVersion(status);
        const previousVersion = installedSkillOverlayVersion() ??
            CURRENT_APPLICATION_VERSION;
        if (compareVersions(previousVersion, version) >= 0) {
            throw new Error("SKILL_UPDATE_NOT_AVAILABLE");
        }
        if (!status.skillsBundle) {
            throw new Error("SKILL_UPDATE_BUNDLE_NOT_VERIFIED");
        }
        const signatureMode = this.skillSignatureMode();
        if (!status.skillsIndex) {
            throw new Error("SKILL_UPDATE_INDEX_MISSING");
        }
        if (signatureMode ===
            "SIGNED_REQUIRED" &&
            !status.skillsSignature) {
            throw new Error("SKILL_UPDATE_SIGNED_INDEX_MISSING");
        }
        if (!this.skillTrustReady()) {
            throw new Error("SKILL_UPDATE_SIGNER_POLICY_MISSING");
        }
        const indexBytes = await downloadVerified(status.skillsIndex, this.fetchImpl);
        const signatureBytes = status.skillsSignature
            ? await downloadVerified(status.skillsSignature, this.fetchImpl)
            : new Uint8Array();
        const verifiedIndex = this.skillIndexVerifier(indexBytes, signatureBytes);
        const index = verifiedIndex.index;
        if (index.version !== version) {
            throw new Error("SKILL_UPDATE_INDEX_RELEASE_VERSION_MISMATCH");
        }
        if (compareVersions(CURRENT_APPLICATION_VERSION, index.compatibility.minAppVersion) < 0 ||
            (index.compatibility.maxAppVersion &&
                compareVersions(CURRENT_APPLICATION_VERSION, index.compatibility.maxAppVersion) > 0)) {
            throw new Error("SKILL_UPDATE_APP_INCOMPATIBLE");
        }
        if (index.bundle.filename !==
            status.skillsBundle.name ||
            index.bundle.sha256 !==
                status.skillsBundle.sha256
                    .toLowerCase() ||
            (status.skillsBundle.bytes !==
                undefined &&
                index.bundle.bytes !==
                    status.skillsBundle.bytes)) {
            throw new Error("SKILL_UPDATE_INDEX_BUNDLE_MISMATCH");
        }
        const bytes = await downloadVerified(status.skillsBundle, this.fetchImpl);
        if (sha256(bytes) !==
            index.bundle.sha256 ||
            bytes.byteLength !==
                index.bundle.bytes) {
            throw new Error("SKILL_UPDATE_SIGNED_BUNDLE_MISMATCH");
        }
        const skillsRoot = path.join(localAppDataRoot(), "skills");
        const workRoot = path.join(skillsRoot, `update-${Date.now()}-${randomBytes(4).toString("hex")}`);
        const zipPath = path.join(workRoot, "skills.zip");
        const extracted = path.join(workRoot, "extracted");
        const candidate = path.join(workRoot, "candidate");
        fs.mkdirSync(workRoot, { recursive: true });
        fs.writeFileSync(zipPath, bytes);
        extractZip(zipPath, extracted);
        const sourceRoot = locateSkillRoot(extracted);
        fs.cpSync(sourceRoot, candidate, { recursive: true, force: true });
        const validation = new LexSkillRegistry(candidate);
        const issues = [
            ...validation.scan(),
            ...validation.validateDeclarations()
        ];
        if (validation.skills.size === 0 || issues.length > 0) {
            fs.rmSync(workRoot, { recursive: true, force: true });
            throw new Error("SKILL_UPDATE_VALIDATION_FAILED");
        }
        try {
            validateSkillCandidateAgainstIndex(validation, index);
        }
        catch (error) {
            fs.rmSync(workRoot, {
                recursive: true,
                force: true
            });
            throw error;
        }
        const installedAt = new Date().toISOString();
        fs.writeFileSync(markerPath(candidate), JSON.stringify({
            version,
            installedAt,
            indexSha256: verifiedIndex.indexSha256,
            signerKeyId: verifiedIndex.signerKeyId
        }, null, 2), "utf8");
        const current = installedSkillOverlayRoot();
        const backup = installedSkillOverlayPreviousRoot();
        fs.rmSync(backup, { recursive: true, force: true });
        if (fs.existsSync(current)) {
            fs.renameSync(current, backup);
        }
        try {
            fs.renameSync(candidate, current);
            writeSkillHealthMarker(current, {
                health: "PENDING_RESTART_VALIDATION"
            });
        }
        catch (error) {
            fs.rmSync(current, { recursive: true, force: true });
            if (fs.existsSync(backup)) {
                fs.renameSync(backup, current);
            }
            throw error;
        }
        finally {
            fs.rmSync(workRoot, { recursive: true, force: true });
        }
        return {
            previousVersion,
            installedVersion: version,
            installedAt,
            restartRequired: true,
            skillRoot: current
        };
    }
}
