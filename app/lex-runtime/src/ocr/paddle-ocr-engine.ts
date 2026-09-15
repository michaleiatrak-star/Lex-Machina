import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  OcrEngine,
  OcrPageResult
} from "../document-ingestion.js";

export type LocalPaddleOcrOptions = {
  python?: string;
  workerPath?: string;
  dpi?: number;
  device?: string;
  timeoutMs?: number;
};

function defaultWorkerPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(
    here,
    "../../../ocr/paddle_worker.py"
  );
}

export class LocalPaddleOcrEngine
implements OcrEngine {
  private readonly python: string;
  private readonly workerPath: string;
  private readonly dpi: number;
  private readonly device?: string;
  private readonly timeoutMs: number;

  constructor(options: LocalPaddleOcrOptions = {}) {
    this.python =
      options.python ??
      process.env.LEX_OCR_PYTHON ??
      "python3";
    this.workerPath =
      options.workerPath ??
      process.env.LEX_OCR_WORKER ??
      defaultWorkerPath();
    this.dpi = options.dpi ?? 220;
    this.device =
      options.device ??
      process.env.LEX_OCR_DEVICE?.trim() ||
      undefined;
    this.timeoutMs =
      options.timeoutMs ?? 30 * 60 * 1000;
  }

  async recognizePages(
    data: Uint8Array,
    pages: number[]
  ): Promise<OcrPageResult[]> {
    if (pages.length === 0) return [];

    const tempRoot = await mkdtemp(
      path.join(os.tmpdir(), "lex-paddle-ocr-")
    );
    const input = path.join(tempRoot, "document.pdf");
    const output = path.join(tempRoot, "result.json");

    try {
      await writeFile(input, data);
      const args = [
        this.workerPath,
        "--input",
        input,
        "--output",
        output,
        "--pages",
        pages.join(","),
        "--lang",
        "pl",
        "--dpi",
        String(this.dpi)
      ];
      if (this.device) {
        args.push("--device", this.device);
      }

      await new Promise<void>((resolve, reject) => {
        const child = spawn(
          this.python,
          args,
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
              "Local PaddleOCR worker exceeded the configured timeout."
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
                `Local PaddleOCR worker failed with exit code ${code}: ${stderr.trim()}`
              )
            );
          }
        });
      });

      const parsed = JSON.parse(
        await readFile(output, "utf8")
      ) as OcrPageResult[];

      const requested = new Set(pages);
      const seen = new Set<number>();
      for (const result of parsed) {
        if (
          !Number.isInteger(result.page) ||
          !requested.has(result.page) ||
          seen.has(result.page)
        ) {
          throw new Error(
            "Local PaddleOCR worker returned an invalid page set."
          );
        }
        seen.add(result.page);
      }

      if (seen.size !== requested.size) {
        throw new Error(
          "Local PaddleOCR worker did not account for every requested page."
        );
      }

      return parsed.sort((a, b) => a.page - b.page);
    } finally {
      await rm(tempRoot, {
        recursive: true,
        force: true
      });
    }
  }
}
