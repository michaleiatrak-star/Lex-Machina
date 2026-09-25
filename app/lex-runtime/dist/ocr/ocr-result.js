import { readFile } from "node:fs/promises";
import path from "node:path";
// Page images kept per document as evidence (masked before sending).
export const EVIDENCE_MAX_PAGES = 30;
function box(value) {
    return Array.isArray(value) && value.length === 4 && value.every((item) => Number.isFinite(item))
        ? value.map(Number)
        : undefined;
}
/**
 * Worker output → OcrPageResult: per-line text/score/box and, for the first
 * pages, the page image the boxes refer to. A page image comes only with a
 * box for every line (a photo may have no lines); otherwise the page has no image (nothing could be
 * masked reliably).
 */
export async function readOcrPages(raw, evidenceDir) {
    let images = 0;
    const pages = [];
    for (const item of raw) {
        const page = item;
        const lines = Array.isArray(page.lines)
            ? page.lines
                .filter((line) => typeof line?.text === "string")
                .map((line) => {
                const lineBox = box(line.box);
                return {
                    text: line.text,
                    ...(typeof line.score === "number" ? { score: line.score } : {}),
                    ...(lineBox ? { box: lineBox } : {})
                };
            })
            : undefined;
        const { evidence, ...rest } = page;
        const result = { ...rest, ...(lines ? { lines } : {}) };
        delete result.image;
        const file = typeof evidence?.file === "string" ? path.basename(evidence.file) : null;
        if (file &&
            (lines ?? []).every((line) => line.box) &&
            images < EVIDENCE_MAX_PAGES &&
            Number.isFinite(evidence?.width) &&
            Number.isFinite(evidence?.height)) {
            try {
                const jpeg = (await readFile(path.join(evidenceDir, file))).toString("base64");
                result.image = {
                    jpeg,
                    width: Number(evidence.width),
                    height: Number(evidence.height),
                    unread: (Array.isArray(evidence.unread) ? evidence.unread : []).map(box).filter((b) => Boolean(b))
                };
                images += 1;
            }
            catch {
                // No image for this page: text only.
            }
        }
        pages.push(result);
    }
    return pages;
}
