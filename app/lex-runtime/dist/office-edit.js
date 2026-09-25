import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
export const EDITABLE_MEDIA_TYPES = new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroenabled.12",
    "text/csv",
    "text/tab-separated-values"
]);
export const FORMAT_MEDIA_TYPE = {
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    odt: "application/vnd.oasis.opendocument.text",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv",
    tsv: "text/tab-separated-values"
};
const EXTENSION_MEDIA_TYPE = {
    docx: FORMAT_MEDIA_TYPE.docx,
    odt: FORMAT_MEDIA_TYPE.odt,
    xlsx: FORMAT_MEDIA_TYPE.xlsx,
    xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
    csv: FORMAT_MEDIA_TYPE.csv,
    tsv: FORMAT_MEDIA_TYPE.tsv
};
/** The editable media type of a stored file, or null; falls back to the extension. */
export function editableMediaType(mediaType, filename) {
    const type = mediaType.split(";")[0].trim().toLowerCase();
    if (EDITABLE_MEDIA_TYPES.has(type))
        return type;
    const extension = /\.([a-z]+)$/i.exec(filename)?.[1]?.toLowerCase() ?? "";
    return EXTENSION_MEDIA_TYPE[extension] ?? null;
}
function defaultWorkerPath() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(here, "../../storage/office_edit_worker.py");
}
/**
 * DOCX/ODT documents and XLSX/CSV sheets as an editable model, and back to a
 * new file (storage/office_edit_worker.py, standard library only).
 */
export class LocalOfficeEditor {
    timeoutMs;
    python;
    workerPath;
    constructor(options = {}, timeoutMs = 60_000) {
        this.timeoutMs = timeoutMs;
        this.python = options.python ?? process.env.LEX_STORAGE_PYTHON ?? "python3";
        this.workerPath =
            options.workerPath ?? process.env.LEX_OFFICE_EDIT_WORKER ?? defaultWorkerPath();
    }
    async read(data, mediaType) {
        if (!EDITABLE_MEDIA_TYPES.has(mediaType))
            throw new Error("OFFICE_EDIT_MEDIA_TYPE_UNSUPPORTED");
        const output = await this.run(["read", "--media-type", mediaType], data);
        return JSON.parse(output.toString("utf8"));
    }
    async write(format, model, delimiter) {
        if (!(format in FORMAT_MEDIA_TYPE))
            throw new Error("OFFICE_EDIT_FORMAT_UNSUPPORTED");
        return await this.run(["write"], Buffer.from(JSON.stringify({ format, model, ...(delimiter ? { delimiter } : {}) }), "utf8"));
    }
    run(args, input) {
        return new Promise((resolve, reject) => {
            const child = spawn(this.python, ["-X", "utf8", this.workerPath, ...args], {
                windowsHide: true,
                stdio: ["pipe", "pipe", "pipe"]
            });
            const chunks = [];
            let size = 0;
            let stderr = "";
            const timer = setTimeout(() => {
                child.kill();
                reject(new Error("OFFICE_EDIT_TIMEOUT"));
            }, this.timeoutMs);
            child.stdout.on("data", (chunk) => {
                size += chunk.length;
                if (size > 128 * 1024 * 1024) {
                    child.kill();
                    reject(new Error("OFFICE_EDIT_OUTPUT_TOO_LARGE"));
                    return;
                }
                chunks.push(chunk);
            });
            child.stderr.on("data", (chunk) => {
                stderr = (stderr + String(chunk)).slice(-2000);
            });
            child.once("error", (error) => {
                clearTimeout(timer);
                reject(error);
            });
            child.once("exit", (code) => {
                clearTimeout(timer);
                if (code === 0)
                    resolve(Buffer.concat(chunks));
                else {
                    const reason = /OFFICE_EDIT_[A-Z_:a-zA-Z]+|SPREADSHEET_[A-Z_]+/.exec(stderr)?.[0];
                    reject(new Error(reason ?? `OFFICE_EDIT_FAILED:${code}`));
                }
            });
            child.stdin.end(Buffer.from(input));
        });
    }
}
