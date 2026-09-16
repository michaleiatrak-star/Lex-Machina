# Build 0025A — G27A Direct Image OCR

Date: 2026-09-16  
Branch: `feature/local-runtime`  
PR: #38

## Status

**PASS — G27A DIRECT IMAGE OCR**

## Scope

G27A extends G27 from PDF/scanned-PDF processing to direct image files.

Supported media types:
- JPEG;
- PNG;
- WebP;
- TIFF.

Each image is treated as one fully accounted OCR page. The production adapter uses the same local PaddleOCR PP-OCRv6 worker with Polish language support.

## Processing contract

`image bytes → local PP-OCRv6 → page 1 → provenance/confidence → chunk integrity`

No image is silently treated as textless input. An OCR adapter failure blocks ingestion.

## Validation

- strict TypeScript — PASS
- direct image ingestion test — PASS
- Python OCR worker syntax — PASS
- G27A deterministic gate — PASS
- web/API image media-type path — PASS
- GitHub Actions `35058610946` — success
- F-138 `35058610889` — success

The heavy Paddle model itself remains a local installation and is not downloaded during every CI build.
