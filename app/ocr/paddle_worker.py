#!/usr/bin/env python3
import argparse
import json
import os
from pathlib import Path

import fitz
import numpy as np
from PIL import Image
from paddleocr import PaddleOCR


def paddle_native_path(path: Path) -> str:
    """Give Paddle's native Windows predictor an ASCII-safe model path."""
    resolved = str(path.resolve())
    if os.name != "nt" or resolved.isascii():
        return resolved

    import ctypes

    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    get_short = kernel32.GetShortPathNameW
    get_short.argtypes = [
        ctypes.c_wchar_p,
        ctypes.c_wchar_p,
        ctypes.c_uint32,
    ]
    get_short.restype = ctypes.c_uint32

    needed = get_short(resolved, None, 0)
    if needed == 0:
        raise RuntimeError(
            "PADDLE_ASCII_PATH_UNAVAILABLE:"
            f"{resolved}:winerr={ctypes.get_last_error()}"
        )
    buffer = ctypes.create_unicode_buffer(needed + 1)
    written = get_short(resolved, buffer, len(buffer))
    short = buffer.value
    if written == 0 or not short or not short.isascii():
        raise RuntimeError(
            "PADDLE_ASCII_PATH_UNAVAILABLE:"
            f"{resolved}:short={short!r}:winerr={ctypes.get_last_error()}"
        )
    return short


def parse_pages(raw: str) -> list[int]:
    pages = sorted({int(value) for value in raw.split(",") if value.strip()})
    if not pages or any(page < 1 for page in pages):
        raise ValueError("pages must contain positive 1-based page numbers")
    return pages


def predict_image(ocr: PaddleOCR, image: np.ndarray, page_number: int) -> dict:
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

    return {
        "page": page_number,
        "text": "\n".join(texts),
        "confidence": confidence,
        "lineCount": len(texts),
        "engine": "PaddleOCR PP-OCRv6_medium",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--pages", default="1")
    parser.add_argument("--lang", default="pl")
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--device", default=None)
    parser.add_argument(
        "--mode",
        choices=("pdf", "image"),
        default="pdf",
    )
    args = parser.parse_args()

    pages = parse_pages(args.pages)
    model_root_raw = os.environ.get("LEX_PADDLE_MODEL_DIR", "").strip()
    if not model_root_raw:
        raise RuntimeError("LEX_PADDLE_MODEL_DIR is required; network model downloads are disabled")
    model_root = Path(model_root_raw).resolve()
    required_models = {
        "doc_orientation_classify_model_dir":
            model_root / "PP-LCNet_x1_0_doc_ori",
        "doc_unwarping_model_dir":
            model_root / "UVDoc",
        "textline_orientation_model_dir":
            model_root / "PP-LCNet_x1_0_textline_ori",
        "text_detection_model_dir":
            model_root / "PP-OCRv6_medium_det",
        "text_recognition_model_dir":
            model_root / "PP-OCRv6_medium_rec",
    }
    missing = [
        str(path)
        for path in required_models.values()
        if not path.is_dir()
    ]
    if missing:
        raise RuntimeError(
            "Local PaddleOCR models are incomplete: " +
            ", ".join(missing)
        )

    ocr_kwargs = dict(
        lang=args.lang,
        ocr_version="PP-OCRv6",
        use_doc_orientation_classify=True,
        use_doc_unwarping=True,
        use_textline_orientation=True,
        # PaddlePaddle 3.3.x CPU oneDNN has a released PIR attribute-conversion
        # regression on Windows. Keep deterministic CPU inference on the
        # non-oneDNN path until the upstream fix is in a pinned release.
        enable_mkldnn=False,
        **{
            key: paddle_native_path(value)
            for key, value in required_models.items()
        },
    )
    if args.device:
        ocr_kwargs["device"] = args.device

    ocr = PaddleOCR(**ocr_kwargs)
    results = []

    if args.mode == "image":
        if pages != [1]:
            raise ValueError("image mode accepts only page 1")
        with Image.open(args.input) as source:
            image = np.array(source.convert("RGB"))
        results.append(
            predict_image(ocr, image, 1)
        )
    else:
        doc = fitz.open(args.input)
        try:
            for page_number in pages:
                if page_number > doc.page_count:
                    raise ValueError(
                        f"requested page {page_number} exceeds document page count {doc.page_count}"
                    )

                page = doc.load_page(page_number - 1)
                pix = page.get_pixmap(
                    dpi=args.dpi,
                    alpha=False,
                )
                channels = pix.n
                image = np.frombuffer(
                    pix.samples,
                    dtype=np.uint8,
                ).reshape(
                    pix.height,
                    pix.width,
                    channels,
                )
                if channels == 4:
                    image = image[:, :, :3]

                results.append(
                    predict_image(
                        ocr,
                        image,
                        page_number,
                    )
                )
        finally:
            doc.close()

    Path(args.output).write_text(
        json.dumps(results, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
