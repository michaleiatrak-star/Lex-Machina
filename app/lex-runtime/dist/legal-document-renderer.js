import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
function defaultWorkerPath() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(here, "../../storage/legal_document_worker.py");
}
export class LocalLegalDocumentRenderer {
    python;
    workerPath;
    timeoutMs;
    constructor(options = {}) {
        this.python =
            options.python ??
                process.env
                    .LEX_STORAGE_PYTHON ??
                "python3";
        this.workerPath =
            options.workerPath ??
                process.env
                    .LEX_LEGAL_DOCUMENT_WORKER ??
                defaultWorkerPath();
        this.timeoutMs =
            options.timeoutMs ??
                60_000;
    }
    async render(format, ast) {
        return await this.call({
            operation: "render",
            format,
            ast
        });
    }
    async validate(format, data) {
        const result = await this.callRaw({
            operation: "validate",
            format,
            packageBase64: Buffer.from(data)
                .toString("base64")
        });
        if (typeof result.text !==
            "string" ||
            typeof result.bytes !==
                "number" ||
            typeof result.aliases !==
                "number") {
            throw new Error("LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID");
        }
        return {
            text: result.text,
            bytes: result.bytes,
            aliases: result.aliases
        };
    }
    async extractStyleProfile(format, data) {
        const result = await this.callRaw({
            operation: "profile",
            format,
            packageBase64: Buffer.from(data)
                .toString("base64")
        });
        if (![
            "lex-classic-clean-v1",
            "lex-light-legal-design-v1",
            "lex-classic-tnr-v1"
        ].includes(String(result.styleProfile)) ||
            result.sourceFormat !==
                format ||
            result.safe !== true) {
            throw new Error("LEGAL_DOCUMENT_PROFILE_INVALID");
        }
        return {
            styleProfile: result.styleProfile,
            sourceFormat: format,
            safe: true
        };
    }
    async deanonymize(format, data, replacements) {
        return await this.call({
            operation: "deanonymize",
            format,
            packageBase64: Buffer.from(data)
                .toString("base64"),
            replacements: Object.fromEntries(replacements)
        });
    }
    async call(input) {
        const result = await this.callRaw(input);
        if (typeof result
            .packageBase64 !==
            "string" ||
            typeof result.text !==
                "string" ||
            typeof result.bytes !==
                "number") {
            throw new Error("LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID");
        }
        const data = Buffer.from(result.packageBase64, "base64");
        if (data.byteLength !==
            result.bytes ||
            data.byteLength >
                64 * 1024 * 1024) {
            data.fill(0);
            throw new Error("LEGAL_DOCUMENT_WORKER_SIZE_MISMATCH");
        }
        return {
            data,
            text: result.text,
            ...(typeof result.replaced ===
                "number"
                ? {
                    replaced: result.replaced
                }
                : {})
        };
    }
    async callRaw(input) {
        const request = Buffer.from(JSON.stringify(input), "utf8");
        if (request.byteLength >
            128 * 1024 * 1024) {
            request.fill(0);
            throw new Error("LEGAL_DOCUMENT_WORKER_INPUT_TOO_LARGE");
        }
        try {
            return await new Promise((resolve, reject) => {
                const child = spawn(this.python, [
                    this.workerPath
                ], {
                    stdio: [
                        "pipe",
                        "pipe",
                        "pipe"
                    ],
                    env: {
                        ...process.env,
                        PYTHONUNBUFFERED: "1"
                    }
                });
                const stdout = [];
                let stdoutBytes = 0;
                let stderr = "";
                let settled = false;
                const finish = (action) => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    clearTimeout(timer);
                    action();
                };
                const timer = setTimeout(() => {
                    child.kill("SIGKILL");
                    finish(() => reject(new Error("LEGAL_DOCUMENT_WORKER_TIMEOUT")));
                }, this.timeoutMs);
                child.stdout.on("data", (chunk) => {
                    stdoutBytes +=
                        chunk
                            .byteLength;
                    if (stdoutBytes >
                        128 *
                            1024 *
                            1024) {
                        child.kill("SIGKILL");
                        finish(() => reject(new Error("LEGAL_DOCUMENT_WORKER_OUTPUT_TOO_LARGE")));
                        return;
                    }
                    stdout.push(Buffer.from(chunk));
                });
                child.stderr.on("data", (chunk) => {
                    stderr +=
                        chunk.toString("utf8");
                    if (stderr.length >
                        16_000) {
                        stderr =
                            stderr.slice(-16_000);
                    }
                });
                child.once("error", (error) => finish(() => reject(error)));
                child.once("exit", (code) => finish(() => {
                    if (code !== 0) {
                        reject(new Error(stderr
                            .trim()
                            .split("\n")
                            .pop() ||
                            "LEGAL_DOCUMENT_WORKER_FAILED"));
                        return;
                    }
                    try {
                        const parsed = JSON.parse(Buffer.concat(stdout).toString("utf8"));
                        if (!parsed ||
                            typeof parsed !==
                                "object" ||
                            Array.isArray(parsed)) {
                            throw new Error("LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID");
                        }
                        resolve(parsed);
                    }
                    catch (error) {
                        reject(error instanceof
                            Error
                            ? error
                            : new Error("LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID"));
                    }
                }));
                child.stdin.once("error", (error) => finish(() => reject(error)));
                child.stdin.end(request);
            });
        }
        finally {
            request.fill(0);
        }
    }
}
