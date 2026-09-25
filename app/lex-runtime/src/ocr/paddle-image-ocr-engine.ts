import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ImageOcrEngine,
  SupportedImageMediaType
} from "../image-ingestion.js";
import type {
  OcrPageResult
} from "../document-ingestion.js";

export type LocalPaddleImageOcrOptions = {
  python?: string;
  workerPath?: string;
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

const EXTENSION: Record<
  SupportedImageMediaType,
  string
> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/tiff": ".tiff"
};

export class LocalPaddleImageOcrEngine
implements ImageOcrEngine {
  private readonly python: string;
  private readonly workerPath: string;
  private readonly device: string | undefined;
  private readonly timeoutMs: number;

  constructor(
    options: LocalPaddleImageOcrOptions = {}
  ) {
    this.python =
      options.python ??
      process.env.LEX_OCR_PYTHON ??
      "python3";
    this.workerPath =
      options.workerPath ??
      process.env.LEX_OCR_WORKER ??
      defaultWorkerPath();
    this.device =
      (
        options.device ??
        process.env.LEX_OCR_DEVICE?.trim()
      ) || undefined;
    this.timeoutMs =
      options.timeoutMs ?? 10 * 60 * 1000;
  }

  async recognizeImage(
    data: Uint8Array,
    mediaType: SupportedImageMediaType
  ): Promise<OcrPageResult> {
    const tempRoot = await mkdtemp(
      path.join(os.tmpdir(), "lex-paddle-image-")
    );
    const input = path.join(
      tempRoot,
      "image" + EXTENSION[mediaType]
    );
    const output = path.join(
      tempRoot,
      "result.json"
    );

    try {
      await writeFile(input, data);
      const args = [
        this.workerPath,
        "--input",
        input,
        "--output",
        output,
        "--mode",
        "image",
        "--pages",
        "1",
        "--lang",
        "pl"
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
              "OCR_ENGINE_TIMEOUT: Local PaddleOCR image worker exceeded the configured timeout."
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
          reject(new Error(`OCR_ENGINE_START_FAILED: ${error.message}`));
        });
        child.once("exit", (code) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else {
            reject(
              new Error(
                `${/ModuleNotFoundError|No module named/.test(stderr) ? "OCR_ENGINE_MISSING" : "OCR_ENGINE_FAILED"}: Local PaddleOCR image worker failed with exit code ${code}: ${stderr.trim()}`
              )
            );
          }
        });
      });

      const parsed = JSON.parse(
        await readFile(output, "utf8")
      ) as OcrPageResult[];

      if (
        parsed.length !== 1 ||
        parsed[0]?.page !== 1
      ) {
        throw new Error(
          "OCR_ENGINE_INVALID_RESULT: Local PaddleOCR image worker returned an invalid result set."
        );
      }

      return parsed[0];
    } finally {
      await rm(tempRoot, {
        recursive: true,
        force: true
      });
    }
  }
}
