const DEFAULT_LIMITS = {
    maxPages: 10_000,
    maxTextChars: 100_000_000
};
export class PdfJsDocumentPageSource {
    limits;
    constructor(limits = DEFAULT_LIMITS) {
        this.limits = limits;
    }
    async extract(data) {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const task = pdfjs.getDocument({
            data,
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
                pages.push({
                    page: pageNumber,
                    text
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
