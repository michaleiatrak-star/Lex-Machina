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
    """Return an ASCII alias for Paddle's native Windows filesystem calls."""
    resolved = str(path.resolve())
    if os.name != "nt" or resolved.isascii():
        return resolved

    import atexit
    import ctypes
    import string
    import subprocess

    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    get_short = kernel32.GetShortPathNameW
    get_short.argtypes = [
        ctypes.c_wchar_p,
        ctypes.c_wchar_p,
        ctypes.c_uint32,
    ]
    get_short.restype = ctypes.c_uint32

    needed = get_short(resolved, None, 0)
    if needed:
        buffer = ctypes.create_unicode_buffer(needed + 1)
        written = get_short(resolved, buffer, len(buffer))
        short = buffer.value
        if written and short and short.isascii():
            return short

    # 8.3 names may be disabled. A temporary subst drive gives the native
    # predictor an ASCII alias while files remain in the locked install tree.
    for letter in reversed(string.ascii_uppercase[3:]):
        drive = f"{letter}:"
        drive_root = drive + "\\"
        if os.path.exists(drive_root):
            continue

        result = subprocess.run(
            ["subst", drive, resolved],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
        )
        if result.returncode != 0:
            continue

        def cleanup(mapped_drive: str = drive) -> None:
            subprocess.run(
                ["subst", mapped_drive, "/D"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )

        atexit.register(cleanup)
        return drive_root

    raise RuntimeError(
        "PADDLE_ASCII_PATH_UNAVAILABLE:"
        f"{resolved}:winerr={ctypes.get_last_error()}"
    )

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
    native_model_root = Path(paddle_native_path(model_root))
    required_models = {
        "doc_orientation_classify_model_dir":
            native_model_root / "PP-LCNet_x1_0_doc_ori",
        "doc_unwarping_model_dir":
            native_model_root / "UVDoc",
        "textline_orientation_model_dir":
            native_model_root / "PP-LCNet_x1_0_textline_ori",
        "text_detection_model_dir":
            native_model_root / "PP-OCRv6_medium_det",
        "text_recognition_model_dir":
            native_model_root / "PP-OCRv6_medium_rec",
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
            key: str(value)
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
