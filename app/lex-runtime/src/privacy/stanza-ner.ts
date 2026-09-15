import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  NamedEntityRecognizer,
  PiiSpan
} from "./pseudonymizer.js";

export type LocalStanzaOptions = {
  python?: string;
  workerPath?: string;
  timeoutMs?: number;
};

function defaultWorkerPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(
    here,
    "../../../privacy/stanza_ner_worker.py"
  );
}

export class LocalStanzaNamedEntityRecognizer
implements NamedEntityRecognizer {
  private readonly python: string;
  private readonly workerPath: string;
  private readonly timeoutMs: number;

  constructor(options: LocalStanzaOptions = {}) {
    this.python =
      options.python ??
      process.env.LEX_NER_PYTHON ??
      "python3";
    this.workerPath =
      options.workerPath ??
      process.env.LEX_NER_WORKER ??
      defaultWorkerPath();
    this.timeoutMs =
      options.timeoutMs ?? 10 * 60 * 1000;
  }

  async recognize(text: string): Promise<PiiSpan[]> {
    if (!text.trim()) return [];

    const tempRoot = await mkdtemp(
      path.join(os.tmpdir(), "lex-stanza-ner-")
    );
    const input = path.join(tempRoot, "input.txt");
    const output = path.join(tempRoot, "result.json");

    try {
      await writeFile(input, text, "utf8");
      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          this.python,
          [
            this.workerPath,
            "--input",
            input,
            "--output",
            output
          ],
          {
            stdio: ["ignore", "ignore", "pipe"],
            env: {
              ...process.env,
              PYTHONUNBUFFERED: "1"
            }
          }
        );
        let stderr = "";
        const timer = setTimeout(() => {
          child.kill("SIGKILL");
          reject(
            new Error(
              "Local Stanza NER worker exceeded the configured timeout."
            )
          );
        }, this.timeoutMs);

        child.stderr.on("data", (chunk: Buffer) => {
          stderr += chunk.toString("utf8");
          if (stderr.length > 32_000) {
            stderr = stderr.slice(-32_000);
          }
        });
        child.once("error", (error) => {
          clearTimeout(timer);
          reject(error);
        });
        child.once("exit", (code) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else {
            reject(
              new Error(
                `Local Stanza NER worker failed with exit code ${code}: ${stderr.trim()}`
              )
            );
          }
        });
      });

      const parsed = JSON.parse(
        await readFile(output, "utf8")
      ) as Array<{
        start: number;
        end: number;
        value: string;
        confidence?: number;
      }>;

      return parsed
        .filter(
          (span) =>
            Number.isInteger(span.start) &&
            Number.isInteger(span.end) &&
            span.start >= 0 &&
            span.end > span.start &&
            text.slice(span.start, span.end) === span.value
        )
        .map((span) => ({
          start: span.start,
          end: span.end,
          kind: "PERSON" as const,
          value: span.value,
          ...(span.confidence !== undefined
            ? { confidence: span.confidence }
            : {})
        }));
    } finally {
      await rm(tempRoot, {
        recursive: true,
        force: true
      });
    }
  }
}
