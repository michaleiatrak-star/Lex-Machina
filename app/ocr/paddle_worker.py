#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

import fitz
import numpy as np
from paddleocr import PaddleOCR


def parse_pages(raw: str) -> list[int]:
    pages = sorted({int(value) for value in raw.split(",") if value.strip()})
    if not pages or any(page < 1 for page in pages):
        raise ValueError("pages must contain positive 1-based page numbers")
    return pages


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--pages", required=True)
    parser.add_argument("--lang", default="pl")
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--device", default=None)
    args = parser.parse_args()

    pages = parse_pages(args.pages)
    ocr_kwargs = dict(
        lang=args.lang,
        ocr_version="PP-OCRv6",
        use_doc_orientation_classify=True,
        use_doc_unwarping=True,
        use_textline_orientation=True,
    )
    if args.device:
        ocr_kwargs["device"] = args.device

    ocr = PaddleOCR(**ocr_kwargs)
    doc = fitz.open(args.input)
    results = []

    try:
        for page_number in pages:
            if page_number > doc.page_count:
                raise ValueError(
                    f"requested page {page_number} exceeds document page count {doc.page_count}"
                )

            page = doc.load_page(page_number - 1)
            pix = page.get_pixmap(dpi=args.dpi, alpha=False)
            channels = pix.n
            image = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
                pix.height, pix.width, channels
            )
            if channels == 4:
                image = image[:, :, :3]

            prediction = list(ocr.predict(image))
            texts: list[str] = []
            scores: list[float] = []

            for item in prediction:
                payload = item.json
                if isinstance(payload, str):
                    payload = json.loads(payload)
                if "res" in payload:
                    payload = payload["res"]

                rec_texts = payload.get("rec_texts") or []
                rec_scores = payload.get("rec_scores") or []
                for text in rec_texts:
                    if isinstance(text, str) and text.strip():
                        texts.append(text.strip())
                for score in rec_scores:
                    try:
                        scores.append(float(score))
                    except (TypeError, ValueError):
                        pass

            confidence = (
                sum(scores) / len(scores)
                if scores
                else None
            )

            results.append(
                {
                    "page": page_number,
                    "text": "\n".join(texts),
                    "confidence": confidence,
                    "lineCount": len(texts),
                    "engine": "PaddleOCR PP-OCRv6_medium",
                }
            )
    finally:
        doc.close()

    Path(args.output).write_text(
        json.dumps(results, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
