const DEFAULT_LIMITS = {
    maxPages: 10_000,
    maxTextChars: 100_000_000
};
const IMAGE_OPERATORS = [
    "paintImageXObject",
    "paintInlineImageXObject",
    "paintInlineImageXObjectGroup",
    "paintImageXObjectRepeat",
    "paintImageMaskXObject",
    "paintImageMaskXObjectGroup",
    "paintImageMaskXObjectRepeat",
    "paintSolidColorImageMask",
    "paintJpegXObject"
];
async function pageHasImages(page, ops) {
    const wanted = new Set(IMAGE_OPERATORS.map((name) => ops[name]).filter((value) => typeof value === "number"));
    try {
        const list = await page.getOperatorList();
        return list.fnArray.some((fn) => wanted.has(fn));
    }
    catch {
        // Unknown content: let OCR decide.
        return true;
    }
}
export class PdfJsDocumentPageSource {
    limits;
    minTextForImageCheck;
    constructor(limits = DEFAULT_LIMITS, minTextForImageCheck = 40) {
        this.limits = limits;
        this.minTextForImageCheck = minTextForImageCheck;
    }
    async extract(data) {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const task = pdfjs.getDocument({
            // pdf.js rejects Buffer and transfers (detaches) what it gets; OCR reads
            // the caller's bytes afterwards, so pass a plain copy.
            data: new Uint8Array(data),
            useSystemFonts: false,
            disableFontFace: true,
            verbosity: 0
        });
        try {
            const document = await task.promise;
            if (document.numPages > this.limits.maxPages) {
                throw new Error("PDF_PAGE_LIMIT");
            }
            const pages = [];
            let totalChars = 0;
            for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
                const page = await document.getPage(pageNumber);
                const content = await page.getTextContent();
                const text = content.items
                    .map((item) => "str" in item && typeof item.str === "string"
                    ? item.str
                    : "")
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                totalChars += text.length;
                if (totalChars > this.limits.maxTextChars) {
                    throw new Error("PDF_TEXT_LIMIT");
                }
                // Only pages with little text are OCR candidates; for those, record
                // whether the page draws any image, so text-free vector pages
                // (blank, lines, signatures as paths) skip OCR.
                const hasImages = text.length < this.minTextForImageCheck
                    ? await pageHasImages(page, pdfjs.OPS)
                    : undefined;
                pages.push({
                    page: pageNumber,
                    text,
                    ...(hasImages !== undefined ? { hasImages } : {})
                });
                page.cleanup();
            }
            return {
                bytes: data.byteLength,
                pages
            };
        }
        finally {
            await task.destroy().catch(() => undefined);
        }
    }
}
