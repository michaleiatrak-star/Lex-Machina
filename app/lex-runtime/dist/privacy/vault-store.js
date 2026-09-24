import { PERSON_CASES } from "./person-morphology.js";
import { createCipheriv, createDecipheriv, createHash, createHmac, hkdfSync, randomBytes } from "node:crypto";
import { mkdir, open, readFile, rename, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PseudonymizationVault } from "./pseudonymizer.js";
const MAGIC = Buffer.from("LMV1", "ascii");
const SCHEMA_VERSION = 1;
const CIPHER_SUITE = 1;
const GCM_TAG_BYTES = 16;
const NONCE_BYTES = 12;
const HEADER_BYTES = 4 + 2 + 2 + 4 + 8 + 2 + 4 + 8;
function defaultRootDir() {
    return path.resolve(process.env.LEX_DATA_DIR ??
        path.join(os.homedir(), ".lex-machina", "data"));
}
function validCaseId(value) {
    return /^case_[a-f0-9]{32}$/
        .test(value);
}
function validDocumentId(value) {
    return /^doc_[a-f0-9]{24}$/
        .test(value);
}
function assertCaseKey(key) {
    if (key.byteLength !== 32) {
        throw new Error("INVALID_CASE_DATA_KEY");
    }
}
function derivePrivacyVaultKey(caseDataKey, caseId) {
    assertCaseKey(caseDataKey);
    return Buffer.from(hkdfSync("sha256", caseDataKey, Buffer.from(caseId, "utf8"), Buffer.from("lex/privacy-vault/v1", "utf8"), 32));
}
export function privacyVaultDeanonymizationKeyBinding(args) {
    if (!validCaseId(args.caseId)) {
        throw new Error("INVALID_CASE_ID");
    }
    if (!Number.isInteger(args.keyVersion) ||
        args.keyVersion < 1) {
        throw new Error("INVALID_VAULT_KEY_VERSION");
    }
    const key = derivePrivacyVaultKey(args.caseDataKey, args.caseId);
    try {
        return createHmac("sha256", key)
            .update(JSON.stringify({
            purpose: "lex/privacy-vault/deanonymization-binding/v1",
            caseId: args.caseId,
            keyVersion: args.keyVersion
        }), "utf8")
            .digest("hex");
    }
    finally {
        key.fill(0);
    }
}
function canonicalSnapshot(snapshot) {
    const counters = {};
    for (const key of Object.keys(snapshot.counters).sort()) {
        const kind = key;
        const value = snapshot.counters[kind];
        if (value !== undefined) {
            counters[kind] =
                value;
        }
    }
    return {
        counters,
        tokens: [...snapshot.tokens]
            .sort((a, b) => a.token.localeCompare(b.token, "en"))
            .map((item) => ({
            token: item.token,
            kind: item.kind,
            value: item.value,
            createdAt: item.createdAt,
            ...(item.entity
                ? {
                    entity: canonicalEntity(item.entity)
                }
                : {})
        }))
    };
}
// Person identity and paradigm, in a fixed field order for the canonical payload.
function canonicalEntity(entity) {
    const forms = {};
    for (const personCase of PERSON_CASES) {
        const form = entity.forms[personCase];
        forms[personCase] = {
            text: String(form.text),
            source: String(form.source),
            confidence: Number(form.confidence)
        };
    }
    return {
        canonical: String(entity.canonical),
        gender: entity.gender === "f" ? "f" : "m1",
        genderAlternatives: [...entity.genderAlternatives].map(String),
        status: entity.status,
        forms,
        warnings: [...entity.warnings].map(String)
    };
}
function canonicalPayload(payload) {
    const documents = {};
    for (const documentId of Object.keys(payload.documents).sort()) {
        documents[documentId] =
            canonicalSnapshot(payload.documents[documentId]);
    }
    return {
        schemaVersion: 1,
        caseId: payload.caseId,
        generation: payload.generation,
        documents
    };
}
function aadBytes(args) {
    return Buffer.from(JSON.stringify({
        schemaVersion: 1,
        caseId: args.caseId,
        generation: args.generation,
        keyVersion: args.keyVersion
    }), "utf8");
}
function encodeEnvelope(args) {
    if (!Number.isInteger(args.keyVersion) ||
        args.keyVersion < 1) {
        throw new Error("INVALID_VAULT_KEY_VERSION");
    }
    const payload = canonicalPayload(args.payload);
    const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
    const aad = aadBytes({
        caseId: args.caseId,
        generation: payload.generation,
        keyVersion: args.keyVersion
    });
    const nonce = randomBytes(NONCE_BYTES);
    const key = derivePrivacyVaultKey(args.caseDataKey, args.caseId);
    try {
        const cipher = createCipheriv("aes-256-gcm", key, nonce);
        cipher.setAAD(aad);
        const ciphertext = Buffer.concat([
            cipher.update(plaintext),
            cipher.final()
        ]);
        const tag = cipher.getAuthTag();
        const header = Buffer.alloc(HEADER_BYTES);
        let offset = 0;
        MAGIC.copy(header, offset);
        offset += 4;
        header.writeUInt16BE(SCHEMA_VERSION, offset);
        offset += 2;
        header.writeUInt16BE(CIPHER_SUITE, offset);
        offset += 2;
        header.writeUInt32BE(args.keyVersion, offset);
        offset += 4;
        header.writeBigUInt64BE(BigInt(payload.generation), offset);
        offset += 8;
        header.writeUInt16BE(nonce.byteLength, offset);
        offset += 2;
        header.writeUInt32BE(aad.byteLength, offset);
        offset += 4;
        header.writeBigUInt64BE(BigInt(ciphertext.byteLength), offset);
        return Buffer.concat([
            header,
            nonce,
            aad,
            ciphertext,
            tag
        ]);
    }
    finally {
        key.fill(0);
        plaintext.fill(0);
    }
}
function decodeEnvelope(args) {
    const data = args.data;
    if (data.byteLength <
        HEADER_BYTES +
            NONCE_BYTES +
            GCM_TAG_BYTES) {
        throw new Error("PRIVACY_VAULT_TRUNCATED");
    }
    let offset = 0;
    if (!data.subarray(0, 4).equals(MAGIC)) {
        throw new Error("PRIVACY_VAULT_MAGIC_INVALID");
    }
    offset += 4;
    const schema = data.readUInt16BE(offset);
    offset += 2;
    const suite = data.readUInt16BE(offset);
    offset += 2;
    const keyVersion = data.readUInt32BE(offset);
    offset += 4;
    const generationBig = data.readBigUInt64BE(offset);
    offset += 8;
    const nonceLength = data.readUInt16BE(offset);
    offset += 2;
    const aadLength = data.readUInt32BE(offset);
    offset += 4;
    const ciphertextLengthBig = data.readBigUInt64BE(offset);
    offset += 8;
    if (schema !==
        SCHEMA_VERSION ||
        suite !==
            CIPHER_SUITE ||
        keyVersion !==
            args.expectedKeyVersion ||
        nonceLength !==
            NONCE_BYTES ||
        generationBig >
            BigInt(Number.MAX_SAFE_INTEGER) ||
        ciphertextLengthBig >
            BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error("PRIVACY_VAULT_HEADER_INVALID");
    }
    const generation = Number(generationBig);
    const ciphertextLength = Number(ciphertextLengthBig);
    const expectedLength = HEADER_BYTES +
        nonceLength +
        aadLength +
        ciphertextLength +
        GCM_TAG_BYTES;
    if (data.byteLength !==
        expectedLength) {
        throw new Error("PRIVACY_VAULT_LENGTH_INVALID");
    }
    const nonce = data.subarray(offset, offset + nonceLength);
    offset += nonceLength;
    const aad = data.subarray(offset, offset + aadLength);
    offset += aadLength;
    const ciphertext = data.subarray(offset, offset +
        ciphertextLength);
    offset +=
        ciphertextLength;
    const tag = data.subarray(offset, offset +
        GCM_TAG_BYTES);
    const expectedAad = aadBytes({
        caseId: args.caseId,
        generation,
        keyVersion
    });
    if (!aad.equals(expectedAad)) {
        throw new Error("PRIVACY_VAULT_AAD_INVALID");
    }
    const key = derivePrivacyVaultKey(args.caseDataKey, args.caseId);
    let plaintext;
    try {
        const decipher = createDecipheriv("aes-256-gcm", key, nonce);
        decipher.setAAD(aad);
        decipher.setAuthTag(tag);
        plaintext =
            Buffer.concat([
                decipher.update(ciphertext),
                decipher.final()
            ]);
        const parsed = JSON.parse(plaintext.toString("utf8"));
        if (parsed.schemaVersion !==
            1 ||
            parsed.caseId !==
                args.caseId ||
            parsed.generation !==
                generation ||
            !parsed.documents ||
            typeof parsed.documents !==
                "object" ||
            Array.isArray(parsed.documents)) {
            throw new Error("PRIVACY_VAULT_PAYLOAD_INVALID");
        }
        for (const [documentId, snapshot] of Object.entries(parsed.documents)) {
            if (!validDocumentId(documentId) ||
                !snapshot ||
                typeof snapshot !==
                    "object" ||
                !Array.isArray(snapshot.tokens)) {
                throw new Error("PRIVACY_VAULT_PAYLOAD_INVALID");
            }
            new PseudonymizationVault(snapshot);
        }
        return canonicalPayload(parsed);
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.startsWith("PRIVACY_VAULT_")) {
            throw error;
        }
        throw new Error("PRIVACY_VAULT_AUTHENTICATION_FAILED");
    }
    finally {
        key.fill(0);
        plaintext?.fill(0);
    }
}
export class EncryptedPrivacyVaultStore {
    rootDir;
    queues = new Map();
    constructor(options = {}) {
        this.rootDir =
            path.resolve(options.rootDir ??
                defaultRootDir());
    }
    privacyDir(caseId) {
        if (!validCaseId(caseId)) {
            throw new Error("INVALID_CASE_ID");
        }
        const target = path.resolve(this.rootDir, "cases", caseId, "private", "privacy");
        const base = path.resolve(this.rootDir, "cases", caseId) + path.sep;
        if (!target.startsWith(base)) {
            throw new Error("PRIVACY_VAULT_PATH_ESCAPE");
        }
        return target;
    }
    vaultPath(caseId) {
        return path.join(this.privacyDir(caseId), "vault.lmv");
    }
    async withCaseQueue(caseId, operation) {
        const previous = this.queues.get(caseId) ??
            Promise.resolve();
        let release;
        const current = new Promise((resolve) => {
            release = resolve;
        });
        const chain = previous.then(() => current);
        this.queues.set(caseId, chain);
        await previous;
        try {
            return await operation();
        }
        finally {
            release?.();
            if (this.queues.get(caseId) === chain) {
                this.queues.delete(caseId);
            }
        }
    }
    async readPayload(caseId, caseDataKey, keyVersion) {
        let data;
        try {
            data = await readFile(this.vaultPath(caseId));
        }
        catch (error) {
            if (error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT") {
                return {
                    schemaVersion: 1,
                    caseId,
                    generation: 0,
                    documents: {}
                };
            }
            throw error;
        }
        const payload = decodeEnvelope({
            data,
            caseId,
            caseDataKey,
            expectedKeyVersion: keyVersion
        });
        let meta;
        try {
            meta = JSON.parse(await readFile(path.join(this.privacyDir(caseId), "vault-meta.json"), "utf8"));
        }
        catch {
            throw new Error("PRIVACY_VAULT_META_MISSING_OR_INVALID");
        }
        const hash = createHash("sha256")
            .update(data)
            .digest("hex");
        if (meta.schemaVersion !== 1 ||
            meta.cipherSuite !==
                "AES-256-GCM" ||
            meta.generation !==
                payload.generation ||
            meta.keyVersion !==
                keyVersion ||
            meta.encryptedBytes !==
                data.byteLength ||
            meta.ciphertextSha256 !==
                hash) {
            throw new Error("PRIVACY_VAULT_META_MISMATCH");
        }
        return payload;
    }
    async writePayload(caseId, caseDataKey, keyVersion, payload) {
        const dir = this.privacyDir(caseId);
        await mkdir(dir, {
            recursive: true,
            mode: 0o700
        });
        const data = encodeEnvelope({
            caseId,
            payload,
            caseDataKey,
            keyVersion
        });
        const finalPath = this.vaultPath(caseId);
        const partialPath = finalPath + ".partial";
        await rm(partialPath, { force: true });
        const handle = await open(partialPath, "wx", 0o600);
        try {
            await handle.writeFile(data);
            await handle.sync();
        }
        finally {
            await handle.close();
        }
        const verify = decodeEnvelope({
            data: await readFile(partialPath),
            caseId,
            caseDataKey,
            expectedKeyVersion: keyVersion
        });
        if (verify.generation !==
            payload.generation) {
            throw new Error("PRIVACY_VAULT_VERIFY_FAILED");
        }
        await rename(partialPath, finalPath);
        const meta = {
            schemaVersion: 1,
            cipherSuite: "AES-256-GCM",
            generation: payload.generation,
            keyVersion,
            encryptedBytes: data.byteLength,
            ciphertextSha256: createHash("sha256")
                .update(data)
                .digest("hex"),
            modifiedAt: new Date()
                .toISOString()
        };
        const metaPath = path.join(dir, "vault-meta.json");
        const metaPartial = metaPath + ".partial";
        await rm(metaPartial, { force: true });
        const metaHandle = await open(metaPartial, "wx", 0o600);
        try {
            await metaHandle.writeFile(JSON.stringify(meta, null, 2), {
                encoding: "utf8"
            });
            await metaHandle.sync();
        }
        finally {
            await metaHandle.close();
        }
        await rename(metaPartial, metaPath);
    }
    async getGeneration(args) {
        const payload = await this.readPayload(args.caseId, args.caseDataKey, args.keyVersion);
        return payload.generation;
    }
    async loadDocumentVault(args) {
        if (!validDocumentId(args.documentId)) {
            throw new Error("INVALID_DOCUMENT_ID");
        }
        const payload = await this.readPayload(args.caseId, args.caseDataKey, args.keyVersion);
        const snapshot = payload.documents[args.documentId];
        return new PseudonymizationVault(snapshot);
    }
    async saveDocumentVault(args) {
        if (!validDocumentId(args.documentId)) {
            throw new Error("INVALID_DOCUMENT_ID");
        }
        return await this.withCaseQueue(args.caseId, async () => {
            const payload = await this.readPayload(args.caseId, args.caseDataKey, args.keyVersion);
            const next = {
                ...payload,
                generation: payload.generation +
                    1,
                documents: {
                    ...payload.documents,
                    [args.documentId]: args.vault
                        .snapshot()
                }
            };
            await this.writePayload(args.caseId, args.caseDataKey, args.keyVersion, next);
            return next.generation;
        });
    }
    async deleteDocumentVault(args) {
        if (!validDocumentId(args.documentId)) {
            throw new Error("INVALID_DOCUMENT_ID");
        }
        return await this.withCaseQueue(args.caseId, async () => {
            const payload = await this.readPayload(args.caseId, args.caseDataKey, args.keyVersion);
            if (payload.documents[args.documentId] === undefined) {
                return false;
            }
            const documents = {
                ...payload.documents
            };
            delete documents[args.documentId];
            const next = {
                ...payload,
                generation: payload.generation +
                    1,
                documents
            };
            await this.writePayload(args.caseId, args.caseDataKey, args.keyVersion, next);
            return true;
        });
    }
    async rekeyCaseVault(args) {
        return await this.withCaseQueue(args.caseId, async () => {
            let payload;
            try {
                payload =
                    await this.readPayload(args.caseId, args.oldCaseDataKey, args.oldKeyVersion);
            }
            catch (error) {
                throw error;
            }
            if (payload.generation === 0 &&
                Object.keys(payload.documents).length === 0) {
                try {
                    await readFile(this.vaultPath(args.caseId));
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
            }
            const next = {
                ...payload,
                generation: payload.generation +
                    1
            };
            await this.writePayload(args.caseId, args.newCaseDataKey, args.newKeyVersion, next);
            return true;
        });
    }
    async loadPayloadForTest(caseId, caseDataKey, keyVersion) {
        return this.readPayload(caseId, caseDataKey, keyVersion);
    }
}
