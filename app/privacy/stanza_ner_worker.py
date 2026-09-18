#!/usr/bin/env python3
import argparse
import json
import os
from pathlib import Path

import stanza


PERSON_LABEL_HINTS = (
    "per",
    "pers",
    "person",
    "persname",
)


def is_person_label(label: str) -> bool:
    normalized = label.lower().replace("_", "").replace("-", "")
    return any(hint in normalized for hint in PERSON_LABEL_HINTS)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    text = Path(args.input).read_text(encoding="utf-8")
    resources_raw = os.environ.get("STANZA_RESOURCES_DIR", "").strip()
    if not resources_raw:
        raise RuntimeError(
            "STANZA_RESOURCES_DIR is required; network model downloads are disabled"
        )
    resources = Path(resources_raw).resolve()
    if not (resources / "resources.json").is_file():
        raise RuntimeError(
            f"Stanza resources.json missing: {resources / 'resources.json'}"
        )
    if not (resources / "pl").is_dir():
        raise RuntimeError(
            f"Polish Stanza models missing: {resources / 'pl'}"
        )

    pipeline = stanza.Pipeline(
        lang="pl",
        dir=str(resources),
        processors="tokenize,ner",
        download_method=None,
        use_gpu=False,
        verbose=False,
    )
    doc = pipeline(text)
    results = []

    for entity in doc.ents:
        if not is_person_label(entity.type):
            continue
        results.append(
            {
                "start": int(entity.start_char),
                "end": int(entity.end_char),
                "value": entity.text,
            }
        )

    Path(args.output).write_text(
        json.dumps(results, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
