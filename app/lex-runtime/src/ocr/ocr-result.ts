import { readFile } from "node:fs/promises";
import path from "node:path";
import type { OcrLine, OcrPageResult } from "../document-ingestion.js";

// Page images kept per document as evidence (masked before sending).
export const EVIDENCE_MAX_PAGES = 30;

type Box = [number, number, number, number];

function box(value: unknown): Box | undefined {
  return Array.isArray(value) && value.length === 4 && value.every((item) => Number.isFinite(item))
    ? (value.map(Number) as Box)
    : undefined;
}

/**
 * Worker output → OcrPageResult: per-line text/score/box and, for the first
 * pages, the page image the boxes refer to. A page image comes only with a
 * box for every line (a photo may have no lines); otherwise the page has no image (nothing could be
 * masked reliably).
 */
export async function readOcrPages(raw: unknown[], evidenceDir: string): Promise<OcrPageResult[]> {
  let images = 0;
  const pages: OcrPageResult[] = [];
  for (const item of raw) {
    const page = item as OcrPageResult & {
      lines?: Array<{ text?: unknown; score?: unknown; box?: unknown }>;
      evidence?: { file?: unknown; width?: unknown; height?: unknown; unread?: unknown };
    };
    const lines: OcrLine[] | undefined = Array.isArray(page.lines)
      ? page.lines
          .filter((line) => typeof line?.text === "string")
          .map((line) => {
            const lineBox = box(line.box);
            return {
              text: line.text as string,
              ...(typeof line.score === "number" ? { score: line.score } : {}),
              ...(lineBox ? { box: lineBox } : {})
            };
          })
      : undefined;
    const { evidence, ...rest } = page;
    const result: OcrPageResult = { ...rest, ...(lines ? { lines } : {}) };
    delete (result as { image?: unknown }).image;
    const file = typeof evidence?.file === "string" ? path.basename(evidence.file) : null;
    if (
      file &&
      (lines ?? []).every((line) => line.box) &&
      images < EVIDENCE_MAX_PAGES &&
      Number.isFinite(evidence?.width) &&
      Number.isFinite(evidence?.height)
    ) {
      try {
        const jpeg = (await readFile(path.join(evidenceDir, file))).toString("base64");
        result.image = {
          jpeg,
          width: Number(evidence!.width),
          height: Number(evidence!.height),
          unread: (Array.isArray(evidence!.unread) ? evidence!.unread : []).map(box).filter((b): b is Box => Boolean(b))
        };
        images += 1;
      } catch {
        // No image for this page: text only.
      }
    }
    pages.push(result);
  }
  return pages;
}
