import {
  describe,
  expect,
  it
} from "vitest";
import {
  CompleteDocumentIngestor,
  type OcrEngine
} from "../src/document-ingestion.js";
import {
  PdfJsDocumentPageSource
} from "../src/pdf-document-page-source.js";

const DIGITAL_PDF =
  "JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMSAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL0NvbnRlbnRzIDcgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NiA4NDEuODg5OCBdIC9QYXJlbnQgNiAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNCAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDYgMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9BdXRob3IgKGFub255bW91cykgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MDkxNjEzMTcyNyswMCcwMCcpIC9DcmVhdG9yIChhbm9ueW1vdXMpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MDkxNjEzMTcyNyswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgMyAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTYxCj4+CnN0cmVhbQpHYXBARjVta0lfJ0xfW1lgRVRAI1IkPDMqWGBjIT1uaV01aC5BVWZhTG1DcTdEXE8oVmBIcVxzY21lLC9GYiMrS1hVSE9IKUdIaDNqTkwzJGA2RWVDYkxwWmoiQk9YNGAsVCtuKlwwOTVlPzY6LkhjOC4sWlhwQFhSLi8zY2JFVUBdKCNsZ2ZNaGNZIy47cnNcWyloRCw1a1k1KG4wTmh+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAwOTIgMDAwMDAgbiAKMDAwMDAwMDE5OSAwMDAwMCBuIAowMDAwMDAwNDAyIDAwMDAwIG4gCjAwMDAwMDA0NzAgMDAwMDAgbiAKMDAwMDAwMDczMSAwMDAwMCBuIAowMDAwMDAwNzkwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPDNlODdiZTU1MDAzMmI4NWE5NTRhMTU1MDg0N2E4NzNiPjwzZTg3YmU1NTAwMzJiODVhOTU0YTE1NTA4NDdhODczYj5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gNSAwIFIKL1Jvb3QgNCAwIFIKL1NpemUgOAo+PgpzdGFydHhyZWYKMTA0MQolJUVPRgo=";

describe("digital PDF ingestion", () => {
  it("uses the embedded text layer without invoking OCR when text is sufficient", async () => {
    let ocrCalls = 0;
    const ocr:
      OcrEngine = {
        async recognizePages() {
          ocrCalls += 1;
          return [];
        }
      };

    const ingestor =
      new CompleteDocumentIngestor(
        new PdfJsDocumentPageSource(),
        ocr
      );

    const result =
      await ingestor.ingest(
        Uint8Array.from(
          Buffer.from(
            DIGITAL_PDF,
            "base64"
          )
        )
      );

    expect(
      result.totalPages
    ).toBe(1);
    expect(
      result.digitalPages
    ).toBe(1);
    expect(
      result.ocrPages
    ).toBe(0);
    expect(
      ocrCalls
    ).toBe(0);
    expect(
      result.pages[0]?.text
    ).toContain(
      "Cyfrowy PDF kancelarii"
    );
  });
});

// Two pages with a short text line and no images (like a signature page).
const SHORT_TEXT_PDF = "JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUiA0IDAgUl0gL0NvdW50IDIgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNSAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNyAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNiAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNyAwIFIgPj4gPj4gPj4KZW5kb2JqCjUgMCBvYmoKPDwgL0xlbmd0aCA4NiA+PgpzdHJlYW0KQlQgL0YxIDI0IFRmIDcyIDcwMCBUZCAoU3Ryb25hIDEgLSBQb3pldyBvIHphcGxhdGUpIFRqIEVUIDAgMCAxIHJnIDcyIDUwMCAyMDAgMTAwIHJlIGYKZW5kc3RyZWFtCmVuZG9iago2IDAgb2JqCjw8IC9MZW5ndGggODYgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiA3MiA3MDAgVGQgKFN0cm9uYSAyIC0gUG96ZXcgbyB6YXBsYXRlKSBUaiBFVCAwIDAgMSByZyA3MiA1MDAgMjAwIDEwMCByZSBmCmVuZHN0cmVhbQplbmRvYmoKNyAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCnhyZWYKMCA4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKMDAwMDAwMDI0NyAwMDAwMCBuIAowMDAwMDAwMzczIDAwMDAwIG4gCjAwMDAwMDA1MDkgMDAwMDAgbiAKMDAwMDAwMDY0NSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDggL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjcxNQolJUVPRgo=";

describe("stored PDF bytes", () => {
  it("accepts a Node Buffer, keeps it intact and skips OCR on pages without images", async () => {
    const data = Buffer.from(SHORT_TEXT_PDF, "base64");
    const before = Buffer.from(data);
    let ocrPages: number[] = [];
    const ocr: OcrEngine = {
      async recognizePages(bytes, pages) {
        ocrPages = pages;
        expect(Buffer.from(bytes).equals(before)).toBe(true);
        return pages.map((page) => ({ page, text: "" }));
      }
    };
    const result = await new CompleteDocumentIngestor(new PdfJsDocumentPageSource(), ocr).ingest(data);
    expect(result.totalPages).toBe(2);
    expect(result.ocrPages).toBe(0);
    expect(result.digitalPages).toBe(2);
    expect(ocrPages).toEqual([]);
    expect(data.equals(before)).toBe(true);
  });
});

describe("OCR candidates", () => {
  it("sends short pages with images or unknown content to OCR, never image-free ones", async () => {
    let requested: number[] = [];
    const ingestor = new CompleteDocumentIngestor(
      {
        async extract() {
          return {
            bytes: 1,
            pages: [
              { page: 1, text: "", hasImages: true },
              { page: 2, text: "", hasImages: false },
              { page: 3, text: "" },
              { page: 4, text: "x".repeat(80) }
            ]
          };
        }
      },
      {
        async recognizePages(_data, pages) {
          requested = pages;
          return pages.map((page) => ({ page, text: "tekst ze skanu" }));
        }
      }
    );
    const result = await ingestor.ingest(new Uint8Array([1]));
    expect(requested).toEqual([1, 3]);
    expect(result.pages.map((page) => page.source)).toEqual(["OCR", "BLANK", "OCR", "DIGITAL"]);
  });
});
