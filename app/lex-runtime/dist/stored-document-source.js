import { DOCX_MEDIA_TYPE, ODT_MEDIA_TYPE } from "./office-document-extractor.js";
import { CSV_MEDIA_TYPE, TSV_MEDIA_TYPE, XLSM_MEDIA_TYPE, XLSX_MEDIA_TYPE } from "./spreadsheet-extractor.js";
// ZIP containers (OOXML, ODF): only the archive signature is checked here;
// the extractors validate the package itself.
const ZIP_TYPES = new Set([
    DOCX_MEDIA_TYPE,
    ODT_MEDIA_TYPE,
    XLSX_MEDIA_TYPE,
    XLSM_MEDIA_TYPE
]);
const TEXT_TYPES = new Set([
    "text/plain",
    "text/markdown",
    CSV_MEDIA_TYPE,
    TSV_MEDIA_TYPE
]);
const SUPPORTED = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
    ...[...ZIP_TYPES, ...TEXT_TYPES]
]);
export function storedDocumentMediaType(value) {
    const type = value?.split(";")[0].trim().toLowerCase();
    return type &&
        SUPPORTED.has(type)
        ? type
        : null;
}
function startsWithBytes(data, bytes) {
    return (data.byteLength >=
        bytes.length &&
        bytes.every((value, index) => data[index] === value));
}
export function hasStoredDocumentSignature(data, mediaType) {
    if (mediaType ===
        "application/pdf") {
        const prefix = Buffer.from(data.subarray(0, Math.min(data.byteLength, 1024)));
        return (prefix.indexOf(Buffer.from("%PDF-", "ascii")) >= 0);
    }
    if (mediaType ===
        "image/jpeg") {
        return startsWithBytes(data, [0xff, 0xd8, 0xff]);
    }
    if (mediaType ===
        "image/png") {
        return startsWithBytes(data, [
            0x89,
            0x50,
            0x4e,
            0x47,
            0x0d,
            0x0a,
            0x1a,
            0x0a
        ]);
    }
    if (mediaType ===
        "image/webp") {
        return (data.byteLength >= 12 &&
            Buffer.from(data.subarray(0, 4)).toString("ascii") ===
                "RIFF" &&
            Buffer.from(data.subarray(8, 12)).toString("ascii") ===
                "WEBP");
    }
    if (mediaType ===
        "image/tiff") {
        return (startsWithBytes(data, [0x49, 0x49, 0x2a, 0x00]) ||
            startsWithBytes(data, [0x4d, 0x4d, 0x00, 0x2a]));
    }
    if (ZIP_TYPES.has(mediaType)) {
        return startsWithBytes(data, [0x50, 0x4b, 0x03, 0x04]);
    }
    if (TEXT_TYPES.has(mediaType)) {
        // Text has no signature; a NUL byte early on means binary content.
        return !data
            .subarray(0, 8192)
            .includes(0);
    }
    return false;
}
export function assertStoredDocumentSignature(data, mediaType) {
    if (!hasStoredDocumentSignature(data, mediaType)) {
        throw new Error("STORED_DOCUMENT_SIGNATURE_MISMATCH");
    }
}
