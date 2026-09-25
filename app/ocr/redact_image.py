#!/usr/bin/env python3
"""Mask rectangles on a page image (personal data before a model sees it)."""
import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--boxes", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    boxes = json.loads(Path(args.boxes).read_text(encoding="utf-8"))
    with Image.open(args.input) as source:
        picture = source.convert("RGB")
    draw = ImageDraw.Draw(picture)
    width, height = picture.size
    for box in boxes:
        x0, y0, x1, y1 = (float(value) for value in box)
        x0, y0 = max(0.0, min(x0, x1)), max(0.0, min(y0, y1))
        x1, y1 = min(float(width), max(x0, x1)), min(float(height), max(y0, y1))
        if x1 > x0 and y1 > y0:
            draw.rectangle([x0, y0, x1, y1], fill=(0, 0, 0))
    picture.save(args.output, format="JPEG", quality=85)


if __name__ == "__main__":
    main()
