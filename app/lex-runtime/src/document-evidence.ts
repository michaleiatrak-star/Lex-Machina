import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { IngestedPage } from "./document-ingestion.js";
import type { PseudonymizationVaultToken } from "./privacy/pseudonymizer.js";

export type Box = [number, number, number, number];

/** A page image sent to a model as evidence, personal data masked. */
export type EvidenceImage = {
  page: number;
  mediaType: "image/jpeg";
  data: string;
  masked: number;
};

// Fewer letters and digits than this: a photo, not a text scan.
export const PHOTO_MAX_TEXT_CHARS = 60;

export type EvidencePolicy = "photos" | "all";

/**
 * Photos (image files with no or incidental text) go as images by default;
 * a page with text only when the user asks for it ("all"). PDFs are text.
 */
export function wantsImage(page: IngestedPage, mediaType: string, policy: EvidencePolicy): boolean {
  if (!page.image) return false;
  if (policy === "all") return true;
  return mediaType.startsWith("image/") && page.text.replace(/[^\p{L}\p{N}]/gu, "").length < PHOTO_MAX_TEXT_CHARS;
}

// A line read this badly may hide personal data the text layer missed.
export const LOW_SCORE_LINE = 0.5;

/** Every text the anonymization key hides: values, case forms, name parts. */
export function protectedValues(tokens: PseudonymizationVaultToken[]): string[] {
  const values = new Set<string>();
  const add = (text: string | undefined) => {
    const value = text?.trim();
    if (value && value.length >= 2) values.add(value);
  };
  for (const token of tokens) {
    add(token.value);
    const forms = token.entity ? Object.values(token.entity.forms).map((form) => form.text) : [];
    forms.forEach(add);
    add(token.entity?.canonical);
    // A person may appear by surname alone, or split over two lines.
    if (token.kind === "PERSON" || token.kind === "ADDRESS") {
      for (const text of [token.value, ...forms]) {
        for (const word of text.split(/\s+/)) if (/\p{L}{3,}|\d{2,}/u.test(word)) add(word);
      }
    }
  }
  return [...values].sort((a, b) => b.length - a.length);
}

function escape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Boxes to paint black on the page image: every occurrence of a protected
 * value (by the line boxes, spread proportionally over the line, padded),
 * every region the OCR detected but could not read and every badly read
 * line. Null when the image and the text cannot be aligned (no image sent).
 */
export function maskBoxes(page: IngestedPage, values: string[]): Box[] | null {
  const lines = page.lines ?? [];
  if (!page.image || lines.some((line) => !line.box)) return null;
  const offsets: number[] = [];
  let cursor = 0;
  for (const line of lines) {
    const at = page.text.indexOf(line.text, cursor);
    if (at < 0) return null;
    offsets.push(at);
    cursor = at + line.text.length;
  }
  const boxes: Box[] = page.image.unread.map((box) => [...box] as Box);
  const lineBox = (index: number, from: number, to: number): Box => {
    const [x0, y0, x1, y1] = lines[index]!.box!;
    const length = Math.max(1, lines[index]!.text.length);
    const charWidth = (x1 - x0) / length;
    const pad = charWidth * 1.5 + 4;
    return [
      Math.max(x0 - 2, x0 + charWidth * from - pad),
      y0 - 3,
      Math.min(x1 + 2, x0 + charWidth * to + pad),
      y1 + 3
    ];
  };
  lines.forEach((line, index) => {
    if (typeof line.score === "number" && line.score < LOW_SCORE_LINE) boxes.push(lineBox(index, 0, line.text.length));
  });
  for (const value of values) {
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escape(value).replace(/\s+/g, "\\s+")}(?![\\p{L}\\p{N}])`, "gu");
    for (const match of page.text.matchAll(pattern)) {
      const start = match.index!;
      const end = start + match[0].length;
      lines.forEach((line, index) => {
        const lineStart = offsets[index]!;
        const lineEnd = lineStart + line.text.length;
        if (end <= lineStart || start >= lineEnd) return;
        boxes.push(lineBox(index, Math.max(start, lineStart) - lineStart, Math.min(end, lineEnd) - lineStart));
      });
    }
  }
  return boxes.map((box) => box.map((value) => Math.round(value * 10) / 10) as Box);
}

function defaultRedactor(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../../ocr/redact_image.py");
}

export interface PageImageMasker {
  mask(jpeg: string, boxes: Box[]): Promise<string>;
}

/** Paints the boxes black with the OCR Python (Pillow); cached per image and boxes. */
export class LocalPageImageMasker implements PageImageMasker {
  private readonly cache = new Map<string, string>();

  constructor(
    private readonly python = process.env.LEX_OCR_PYTHON ?? "python3",
    private readonly script = process.env.LEX_OCR_REDACTOR ?? defaultRedactor(),
    private readonly timeoutMs = 60_000
  ) {}

  async mask(jpeg: string, boxes: Box[]): Promise<string> {
    const key = createHash("sha256").update(jpeg).update(JSON.stringify(boxes)).digest("hex");
    const cached = this.cache.get(key);
    if (cached) return cached;
    const dir = await mkdtemp(path.join(os.tmpdir(), "lex-evidence-"));
    try {
      const input = path.join(dir, "page.jpg");
      const boxesFile = path.join(dir, "boxes.json");
      const output = path.join(dir, "masked.jpg");
      await writeFile(input, Buffer.from(jpeg, "base64"));
      await writeFile(boxesFile, JSON.stringify(boxes));
      await new Promise<void>((resolve, reject) => {
        const child = spawn(this.python, ["-X", "utf8", this.script, "--input", input, "--boxes", boxesFile, "--output", output], {
          windowsHide: true,
          stdio: ["ignore", "ignore", "pipe"]
        });
        let stderr = "";
        child.stderr?.on("data", (chunk) => {
          stderr = (stderr + String(chunk)).slice(-2000);
        });
        const timer = setTimeout(() => {
          child.kill();
          reject(new Error("EVIDENCE_MASK_TIMEOUT"));
        }, this.timeoutMs);
        child.once("error", (error) => {
          clearTimeout(timer);
          reject(error);
        });
        child.once("exit", (code) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`EVIDENCE_MASK_FAILED:${code}:${stderr.trim().slice(-300)}`));
        });
      });
      const masked = (await readFile(output)).toString("base64");
      if (this.cache.size > 64) this.cache.clear();
      this.cache.set(key, masked);
      return masked;
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }
}
