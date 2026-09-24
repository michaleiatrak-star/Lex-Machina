import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
function defaultWorkerPath() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(here, "../../../privacy/polish_pii_gazetteer.py");
}
/**
 * Persons from the SGJP dictionary (Morfeusz2) and addresses by structure.
 * Complements Stanza: it knows every Polish given name and surname in every
 * case and finds street addresses, which Stanza does not report at all.
 */
export class LocalGazetteerRecognizer {
    timeoutMs;
    python;
    workerPath;
    constructor(options = {}, timeoutMs = 5 * 60 * 1000) {
        this.timeoutMs = timeoutMs;
        this.python = options.python ?? process.env.LEX_NER_PYTHON ?? "python3";
        this.workerPath =
            options.workerPath ?? process.env.LEX_GAZETTEER_WORKER ?? defaultWorkerPath();
    }
    async recognize(text) {
        if (!text.trim())
            return [];
        const tempRoot = await mkdtemp(path.join(os.tmpdir(), "lex-gazetteer-"));
        const input = path.join(tempRoot, "input.txt");
        const output = path.join(tempRoot, "output.json");
        try {
            await writeFile(input, text, "utf8");
            await new Promise((resolve, reject) => {
                const child = spawn(this.python, ["-X", "utf8", this.workerPath, "--input", input, "--output", output], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
                let stderr = "";
                child.stderr?.on("data", (chunk) => {
                    stderr = (stderr + String(chunk)).slice(-4000);
                });
                const timer = setTimeout(() => {
                    child.kill();
                    reject(new Error("GAZETTEER_TIMEOUT"));
                }, this.timeoutMs);
                child.once("error", (error) => {
                    clearTimeout(timer);
                    reject(error);
                });
                child.once("exit", (code) => {
                    clearTimeout(timer);
                    if (code === 0)
                        resolve();
                    else
                        reject(new Error(`GAZETTEER_FAILED:${code}:${stderr.trim().slice(-400)}`));
                });
            });
            const raw = JSON.parse(await readFile(output, "utf8"));
            return raw
                .filter((item) => (item.kind === "PERSON" || item.kind === "ADDRESS") &&
                Number.isInteger(item.start) &&
                Number.isInteger(item.end) &&
                text.slice(item.start, item.end) === item.value)
                .map((item) => ({
                start: item.start,
                end: item.end,
                kind: item.kind,
                value: item.value,
                confidence: 0.9,
                source: "AUTO",
                ...(item.ambiguous ? { ambiguous: true } : {})
            }));
        }
        finally {
            await rm(tempRoot, { recursive: true, force: true });
        }
    }
}
/** Union of several recognizers; one failing never hides the others. */
export class CompositeRecognizer {
    recognizers;
    constructor(recognizers) {
        this.recognizers = recognizers;
    }
    async recognize(text) {
        const results = await Promise.all(this.recognizers.map((recognizer) => recognizer.recognize(text).catch((error) => {
            process.stderr.write(`PRIVACY_RECOGNIZER_DEGRADED:${error instanceof Error ? error.message : String(error)}\n`);
            return [];
        })));
        const seen = new Set();
        return results.flat().filter((span) => {
            const key = `${span.kind}:${span.start}:${span.end}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
    }
}
