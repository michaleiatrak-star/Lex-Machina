import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
// Legacy build: the modern one needs Map.prototype.getOrInsertComputed, which
// current WebView2/Chromium releases do not ship yet.
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

// The webview's CSP (object-src 'none') blocks the built-in PDF plugin, so
// pages are drawn by pdf.js onto a canvas. Assets come from dist/pdfjs/.
// Absolute, because the pdf.js worker resolves these URLs itself.
const assetsUrl = () => new URL(`${import.meta.env.BASE_URL}pdfjs/`, document.baseURI).href;

async function openPdf(data: Uint8Array): Promise<PDFDocumentLoadingTask> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const ASSETS = assetsUrl();
  return pdfjs.getDocument({
    data,
    cMapUrl: `${ASSETS}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${ASSETS}standard_fonts/`,
    wasmUrl: `${ASSETS}wasm/`,
    iccUrl: `${ASSETS}iccs/`
  });
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export function PdfPreview(props: {
  blob: Blob;
  filename: string;
  initialPage?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(props.initialPage ?? 1);
  const [pageInput, setPageInput] = useState(String(props.initialPage ?? 1));
  const [zoom, setZoom] = useState(1.25);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let loading: PDFDocumentLoadingTask | null = null;
    setPdf(null);
    setError("");
    void props.blob.arrayBuffer()
      .then((buffer) => openPdf(new Uint8Array(buffer)))
      .then((task) => {
        loading = task;
        if (cancelled) {
          void task.destroy();
          return null;
        }
        return task.promise;
      })
      .then((document) => {
        if (!document || cancelled) return;
        setPdf(document);
        const start = Math.min(Math.max(props.initialPage ?? 1, 1), document.numPages);
        setPage(start);
        setPageInput(String(start));
      })
      .catch((failure: unknown) => {
        if (!cancelled) setError(failure instanceof Error ? failure.message : String(failure));
      });
    return () => {
      cancelled = true;
      void loading?.destroy();
    };
  }, [props.blob, props.initialPage]);

  useEffect(() => {
    if (!pdf || !canvas.current) return;
    let task: RenderTask | null = null;
    let cancelled = false;
    void pdf.getPage(page).then((pdfPage) => {
      if (cancelled || !canvas.current) return;
      const ratio = window.devicePixelRatio || 1;
      const viewport = pdfPage.getViewport({ scale: zoom });
      const target = canvas.current;
      target.width = Math.floor(viewport.width * ratio);
      target.height = Math.floor(viewport.height * ratio);
      target.style.width = `${Math.floor(viewport.width)}px`;
      target.style.height = `${Math.floor(viewport.height)}px`;
      task = pdfPage.render({
        canvas: target,
        viewport,
        transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0]
      });
      task.promise.catch((failure: unknown) => {
        if (!cancelled && (failure as { name?: string })?.name !== "RenderingCancelledException") {
          setError(failure instanceof Error ? failure.message : String(failure));
        }
      });
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, page, zoom]);

  function goTo(next: number): void {
    if (!pdf) return;
    const bounded = Math.min(Math.max(Math.round(next), 1), pdf.numPages);
    setPage(bounded);
    setPageInput(String(bounded));
  }

  function zoomBy(direction: 1 | -1): void {
    const index = ZOOM_STEPS.findIndex((step) => step >= zoom - 1e-6);
    const next = ZOOM_STEPS[Math.min(Math.max(index + direction, 0), ZOOM_STEPS.length - 1)]!;
    setZoom(next);
  }

  if (error) {
    return (
      <p className="workspace-preview-error" role="alert">
        Nie udało się wyświetlić PDF: {error}
      </p>
    );
  }

  return (
    <div className="pdf-preview">
      <div className="pdf-preview-toolbar" role="toolbar" aria-label="Nawigacja PDF">
        <button type="button" disabled={!pdf || page <= 1} onClick={() => goTo(page - 1)} aria-label="Poprzednia strona">
          ‹
        </button>
        <label>
          Strona{" "}
          <input
            type="number"
            min={1}
            max={pdf?.numPages ?? 1}
            value={pageInput}
            disabled={!pdf}
            onChange={(event) => setPageInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") goTo(Number(pageInput) || page);
            }}
            onBlur={() => goTo(Number(pageInput) || page)}
          />
          {" "}z {pdf?.numPages ?? "…"}
        </label>
        <button
          type="button"
          disabled={!pdf || page >= pdf.numPages}
          onClick={() => goTo(page + 1)}
          aria-label="Następna strona"
        >
          ›
        </button>
        <span className="pdf-preview-spacer" />
        <button type="button" disabled={!pdf} onClick={() => zoomBy(-1)} aria-label="Pomniejsz">−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" disabled={!pdf} onClick={() => zoomBy(1)} aria-label="Powiększ">+</button>
      </div>
      <div className="pdf-preview-page">
        {pdf ? null : <p>Wczytywanie PDF…</p>}
        <canvas ref={canvas} aria-label={`${props.filename}, strona ${page}`} />
      </div>
    </div>
  );
}
