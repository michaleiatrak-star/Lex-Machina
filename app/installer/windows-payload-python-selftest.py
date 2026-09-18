from __future__ import annotations

from pathlib import Path
import sys


def core_imports() -> int:
    import fitz  # noqa: F401
    import numpy  # noqa: F401
    import PIL  # noqa: F401

    print("PYTHON_CORE_IMPORTS_PASS", sys.version)
    return 0


def ocr_import() -> int:
    from paddleocr import PaddleOCR  # noqa: F401

    print("PYTHON_OCR_IMPORT_PASS")
    return 0


def ner_import() -> int:
    import stanza  # noqa: F401
    import torch

    print("PYTHON_NER_IMPORT_PASS", torch.__version__)
    return 0


def make_ocr_fixture(output: str) -> int:
    from PIL import Image, ImageDraw

    path = Path(output)
    image = Image.new("RGB", (720, 180), "white")
    draw = ImageDraw.Draw(image)
    draw.text((30, 60), "LEX MACHINA TEST 123", fill="black")
    image.save(path)
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print("PYTHON_SELFTEST_USAGE_ERROR", file=sys.stderr)
        return 2

    command = sys.argv[1]
    if command == "core" and len(sys.argv) == 2:
        return core_imports()
    if command == "ocr-import" and len(sys.argv) == 2:
        return ocr_import()
    if command == "ner-import" and len(sys.argv) == 2:
        return ner_import()
    if command == "make-ocr-fixture" and len(sys.argv) == 3:
        return make_ocr_fixture(sys.argv[2])

    print(f"PYTHON_SELFTEST_COMMAND_INVALID:{command}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
