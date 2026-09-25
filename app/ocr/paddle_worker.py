#!/usr/bin/env python3
import argparse
import json
import sys
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


EVIDENCE_MAX_SIDE = 1600


def _box(values) -> list[float] | None:
    """[x0, y0, x1, y1] from a box or polygon."""
    try:
        flat = np.asarray(values, dtype=float).reshape(-1)
    except (TypeError, ValueError):
        return None
    if flat.size == 4:
        x0, y0, x1, y1 = flat.tolist()
    elif flat.size >= 8 and flat.size % 2 == 0:
        xs, ys = flat[0::2], flat[1::2]
        x0, y0, x1, y1 = float(xs.min()), float(ys.min()), float(xs.max()), float(ys.max())
    else:
        return None
    return [min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)]


def _overlap(a: list[float], b: list[float]) -> float:
    w = min(a[2], b[2]) - max(a[0], b[0])
    h = min(a[3], b[3]) - max(a[1], b[1])
    if w <= 0 or h <= 0:
        return 0.0
    area = max(1.0, (a[2] - a[0]) * (a[3] - a[1]))
    return (w * h) / area


def _field(item, payload: dict, key: str):
    try:
        value = item[key]
        if value is not None:
            return value
    except Exception:
        pass
    return payload.get(key)


def predict_image(
    ocr: PaddleOCR,
    image: np.ndarray,
    page_number: int,
    evidence_dir: Path | None = None,
) -> dict:
    prediction = list(ocr.predict(image))
    texts: list[str] = []
    scores: list[float] = []
    # Per line: text, recognition score and box, for OCR correction and for
    # masking personal data on the page image sent as evidence.
    lines: list[dict] = []
    unread: list[list[float]] = []
    evidence_image = image
    boxes_known = True

    for item in prediction:
        payload = item.json
        if isinstance(payload, str):
            payload = json.loads(payload)
        if "res" in payload:
            payload = payload["res"]

        rec_texts = payload.get("rec_texts") or []
        rec_scores = payload.get("rec_scores") or []
        rec_boxes = _field(item, payload, "rec_boxes")
        rec_polys = _field(item, payload, "rec_polys")
        dt_polys = _field(item, payload, "dt_polys")
        geometry = rec_boxes if rec_boxes is not None and len(rec_boxes) == len(rec_texts) else rec_polys
        if geometry is None or len(geometry) != len(rec_texts):
            boxes_known = False
            geometry = [None] * len(rec_texts)

        # Boxes are in the coordinates of the preprocessed (rotated,
        # unwarped) image; without it the boxes cannot be trusted.
        pre = _field(item, payload, "doc_preprocessor_res")
        if pre is not None:
            try:
                output_img = pre["output_img"]
            except Exception:
                output_img = None
            if output_img is None:
                boxes_known = False
            else:
                evidence_image = np.asarray(output_img)

        read_boxes: list[list[float]] = []
        for index, text in enumerate(rec_texts):
            try:
                score = float(rec_scores[index])
            except (IndexError, TypeError, ValueError):
                score = None
            if score is not None:
                scores.append(score)
            box = _box(geometry[index]) if geometry[index] is not None else None
            if isinstance(text, str) and text.strip():
                texts.append(text.strip())
                lines.append({"text": text.strip(), "score": score, "box": box})
                if box:
                    read_boxes.append(box)
            elif box:
                unread.append(box)
        for poly in dt_polys if dt_polys is not None else []:
            box = _box(poly)
            if box and not any(_overlap(box, known) > 0.5 for known in read_boxes):
                unread.append(box)

    confidence = (
        sum(scores) / len(scores)
        if scores
        else None
    )

    result = {
        "page": page_number,
        "text": "\n".join(texts),
        "confidence": confidence,
        "lineCount": len(texts),
        "engine": "PaddleOCR PP-OCRv6_medium",
        "lines": [
            {"text": line["text"], "score": line["score"]}
            for line in lines
        ],
    }

    if evidence_dir is not None and boxes_known and all(line["box"] for line in lines):
        height, width = evidence_image.shape[:2]
        scale = min(1.0, EVIDENCE_MAX_SIDE / max(width, height))
        picture = Image.fromarray(evidence_image[:, :, :3].astype(np.uint8))
        if scale < 1.0:
            picture = picture.resize((max(1, round(width * scale)), max(1, round(height * scale))))
        name = f"page-{page_number}.jpg"
        picture.save(evidence_dir / name, format="JPEG", quality=90)
        scaled = lambda box: [round(value * scale, 1) for value in box]
        for index, line in enumerate(lines):
            result["lines"][index]["box"] = scaled(line["box"])
        result["evidence"] = {
            "file": name,
            "width": picture.width,
            "height": picture.height,
            "unread": [scaled(box) for box in unread],
        }

    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--pages", default="1")
    parser.add_argument("--lang", default="pl")
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--device", default=None)
    parser.add_argument("--evidence-dir", default=None)
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
    evidence_dir = Path(args.evidence_dir) if args.evidence_dir else None
    if evidence_dir is not None:
        evidence_dir.mkdir(parents=True, exist_ok=True)

    if args.mode == "image":
        if pages != [1]:
            raise ValueError("image mode accepts only page 1")
        with Image.open(args.input) as source:
            image = np.array(source.convert("RGB"))
        results.append(
            predict_image(ocr, image, 1, evidence_dir)
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
                        evidence_dir,
                    )
                )
                # Progress for the runtime (page number only, no content).
                print(f"LEX_OCR_PAGE {page_number}", file=sys.stderr, flush=True)
        finally:
            doc.close()

    Path(args.output).write_text(
        json.dumps(results, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
