# Lex Machina local OCR

G27 uses **PaddleOCR PP-OCRv6_medium** with `lang=pl` as the primary local OCR engine.

The OCR path is deliberately separate from G20. G20 verifies official PDFs that already expose text. G27 handles user documents and scanned pages. G27A extends the same local PaddleOCR worker to direct photographs and image files.

## Installation

Create a dedicated Python environment and install:

```bash
python -m pip install -r app/ocr/requirements.txt
```

The first PaddleOCR initialization may download model weights. After the models are present in the local cache, document OCR runs locally. For an offline workstation, pre-warm the models before disconnecting network access.

## Supported inputs

- PDF;
- JPEG;
- PNG;
- WebP;
- TIFF.

A direct image is treated as one OCR page and is processed by PP-OCRv6 with Polish language support, orientation classification, document unwarping and text-line orientation enabled.

## Completeness contract

The Node runtime first inspects **every PDF page**. Pages with a usable text layer remain DIGITAL. Pages with too little text are sent to OCR. Every requested OCR page must return an accounted result; otherwise ingestion fails closed.

A page can be classified as BLANK only after the OCR path has actually processed it and returned no text.

Large documents are not truncated for model context. Their page text is divided into ordered chunks with explicit page markers. The chunker verifies that the sum of source characters in all chunks equals the source character count of the complete document.

Default safety bounds are intentionally high but finite:

- 512 MiB input;
- 10,000 pages;
- 100,000,000 extracted characters;
- 24,000 characters per chunk.

These are safety limits, not model-context truncation. They can be made configurable later without weakening the all-pages accounting rule.

## Manual privacy review

The local web UI can open either a PDF or supported image through `POST /api/documents/review`. OCR/extracted text remains inside the local runtime/browser boundary while the user reviews it. The protected chunks are produced only after `POST /api/documents/:documentId/finalize`.
