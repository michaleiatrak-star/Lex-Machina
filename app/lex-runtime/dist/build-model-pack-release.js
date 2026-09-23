import { createHash, createPrivateKey, sign } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
const APP_VERSION = /^\d+\.\d+\.\d+$/;
const SAFE_KEY_ID = /^[A-Za-z0-9._-]{3,96}$/;
const SHA256 = /^[a-f0-9]{64}$/i;
function fail(message) {
    throw new Error(message);
}
function atomicWrite(target, data) {
    const resolved = path.resolve(target);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    const temporary = `${resolved}.tmp`;
    fs.writeFileSync(temporary, data);
    fs.renameSync(temporary, resolved);
}
const [manifestArg, outputArg, packVersion, minAppVersion, maxAppVersionArg, keyId] = process.argv.slice(2);
if (!manifestArg ||
    !outputArg ||
    !packVersion ||
    !minAppVersion ||
    !keyId) {
    fail("USAGE: build-model-pack-release <release-source.json> <outputDir> <packVersion> <minAppVersion> <maxAppVersion|-> <keyId>");
}
if (!APP_VERSION.test(packVersion) ||
    !APP_VERSION.test(minAppVersion) ||
    (maxAppVersionArg &&
        maxAppVersionArg !== "-" &&
        !APP_VERSION.test(maxAppVersionArg))) {
    fail("MODEL_PACK_RELEASE_VERSION_INVALID");
}
if (!SAFE_KEY_ID.test(keyId)) {
    fail("MODEL_PACK_RELEASE_KEY_ID_INVALID");
}
const manifestPath = path.resolve(manifestArg);
const outputDir = path.resolve(outputArg);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const sourceModels = manifest.models?.localLlm;
if (!Array.isArray(sourceModels) ||
    sourceModels.length < 1) {
    fail("MODEL_PACK_RELEASE_MODELS_MISSING");
}
const models = sourceModels.map((model) => {
    const id = typeof model.id ===
        "string"
        ? model.id
        : "";
    const displayName = typeof model.displayName ===
        "string"
        ? model.displayName
        : "";
    const updateFamily = model.updateFamily ===
        "BIELIK" ||
        model.updateFamily ===
            "MISTRAL"
        ? model.updateFamily
        : "";
    const filename = typeof model.filename ===
        "string"
        ? model.filename
        : "";
    const url = typeof model.url ===
        "string"
        ? model.url
        : "";
    const sha256 = typeof model.sha256 ===
        "string"
        ? model.sha256
            .toLowerCase()
        : "";
    const quantization = typeof model.quantization ===
        "string"
        ? model.quantization
        : "";
    const nativeContext = Number(model.nativeContext);
    const minimumContext = Number(model.minimumContext);
    const maximumRuntimeContext = Number(model.maximumRuntimeContext);
    const license = typeof model.license ===
        "string"
        ? model.license
        : "";
    let parsedUrl;
    try {
        parsedUrl =
            new URL(url);
    }
    catch {
        fail(`MODEL_PACK_RELEASE_URL_INVALID:${id}`);
    }
    if (!/^local\/[a-z0-9][a-z0-9._-]{1,120}$/.test(id) ||
        !displayName ||
        displayName.length > 200 ||
        !updateFamily ||
        !/^[A-Za-z0-9._-]+\.gguf$/i.test(filename) ||
        parsedUrl.protocol !==
            "https:" ||
        !SHA256.test(sha256) ||
        !quantization ||
        quantization.length > 200 ||
        !Number.isSafeInteger(nativeContext) ||
        nativeContext < 1 ||
        !Number.isSafeInteger(minimumContext) ||
        minimumContext < 1 ||
        !Number.isSafeInteger(maximumRuntimeContext) ||
        maximumRuntimeContext <
            minimumContext ||
        !license ||
        license.length > 200) {
        fail(`MODEL_PACK_RELEASE_MODEL_INVALID:${id || "unknown"}`);
    }
    return {
        id,
        family: updateFamily,
        displayName,
        filename,
        url: parsedUrl.toString(),
        sha256,
        quantization,
        nativeContext,
        minimumContext,
        maximumRuntimeContext,
        license
    };
})
    .sort((left, right) => left.id.localeCompare(right.id, "en"));
if (new Set(models.map((model) => model.id)).size !==
    models.length) {
    fail("MODEL_PACK_RELEASE_DUPLICATE_MODEL");
}
const index = {
    schemaVersion: 1,
    kind: "LEX_MACHINA_MODEL_PACK_INDEX",
    version: packVersion,
    compatibility: {
        minAppVersion,
        ...(maxAppVersionArg &&
            maxAppVersionArg !== "-"
            ? {
                maxAppVersion: maxAppVersionArg
            }
            : {})
    },
    models
};
const indexBytes = Buffer.from(`${JSON.stringify(index, null, 2)}\n`, "utf8");
const privateKeyPem = process.env
    .LEX_MODEL_PACK_PRIVATE_KEY_PEM;
if (!privateKeyPem?.trim()) {
    fail("MODEL_PACK_RELEASE_PRIVATE_KEY_MISSING");
}
const privateKey = createPrivateKey(privateKeyPem);
if (privateKey
    .asymmetricKeyType !==
    "ed25519") {
    fail("MODEL_PACK_RELEASE_PRIVATE_KEY_TYPE_INVALID");
}
const signature = sign(null, indexBytes, privateKey);
const signatureBytes = Buffer.from(`${JSON.stringify({
    schemaVersion: 1,
    algorithm: "Ed25519",
    keyId,
    signature: signature.toString("base64")
}, null, 2)}\n`, "utf8");
const indexPath = path.join(outputDir, "LexMachina-ModelPack-Index.json");
const signaturePath = path.join(outputDir, "LexMachina-ModelPack-Index.sig");
atomicWrite(indexPath, indexBytes);
atomicWrite(signaturePath, signatureBytes);
console.log(JSON.stringify({
    result: "PASS",
    packVersion,
    modelCount: models.length,
    keyId,
    indexSha256: createHash("sha256")
        .update(indexBytes)
        .digest("hex"),
    outputs: {
        index: indexPath,
        signature: signaturePath
    }
}, null, 2));
