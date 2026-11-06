#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
E0 migracji prawa polskiego — inwentarz treści krajowej w skillach wykonawczych.

Każdy akapit (blok oddzielony pustą linią, blok kodu w całości) jest:
  PL      — powołuje akt lub przepis prawa polskiego (kodeks, Dz.U., art. N z aktem, ELI/ISAP/SAOS…),
  METODA  — pozostałe.
Wynik: tabela per skill i 10 plików o największym udziale treści PL (kandydaci do migracji).
To pomiar, nie decyzja: akapit PL może być przykładem w metodzie (ocena przy migracji).

Użycie: inwentarz_jurysdykcji.py [katalog_skilli] [--markdown]
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve()
ARGS = [arg for arg in sys.argv[1:] if not arg.startswith("--")]
ROOT = Path(ARGS[0]) if ARGS else HERE.parents[2]
MARKDOWN = "--markdown" in sys.argv
EXECUTIVE = [
    "analiza-sadowa-v6", "analizator-dowodow-v3", "analizator-przepisow-v2", "analizator-umow-v1",
    "chronologia-sprawy-v1", "orzeczenia-sadowe-v2", "pisma-procesowe-v3", "pisma-proste-v2",
    "przesluchanie-swiadkow-v2-min90", "przewodnik-prawny-v2", "raport-klienta-v1", "raport-sytuacyjny-v2",
]
PL = re.compile(
    r"\b(?:KC|KPC|KP|KK|KPK|KPA|PPSA|KRO|KSH|KSCU|KKW|KPW|KW|KKS|UPEA|PZP|UOKiK|ZUS|KRUS|KRS|CEIDG|ISAP|SAOS|CBOSA|ELI)\b"
    r"|Dz\.\s?U\.|\bart\.\s*\d+[\w¹²³⁴⁵⁶⁷⁸⁹⁰]*(?:\s*§\s*\d+)?\s+(?:k\.\w+\.|[A-Z]{2,5})\b|ustaw[aąyie]\s+z\s+dnia"
)
SKIP = re.compile(r"CHANGELOG|HISTORIA-ZMIAN|CHECKSUMS|PORTABILITY-MANIFEST")


def paragraphs(text):
    blocks, current, fenced = [], [], False
    for line in text.splitlines():
        if line.startswith("```"):
            fenced = not fenced
        if not line.strip() and not fenced:
            if current:
                blocks.append("\n".join(current))
            current = []
        else:
            current.append(line)
    if current:
        blocks.append("\n".join(current))
    return blocks


def main():
    rows, files = [], []
    for skill in EXECUTIVE:
        base = ROOT / skill
        total = polish = size = polish_size = 0
        for path in sorted(base.rglob("*.md")):
            if SKIP.search(path.name):
                continue
            blocks = paragraphs(path.read_text(encoding="utf-8"))
            own = [block for block in blocks if PL.search(block)]
            total += len(blocks)
            polish += len(own)
            file_size = sum(len(block) for block in blocks)
            own_size = sum(len(block) for block in own)
            size += file_size
            polish_size += own_size
            if file_size > 1500:
                files.append((own_size / file_size, own_size, f"{skill}/{path.relative_to(base).as_posix()}"))
        rows.append((skill, total, polish, size, polish_size))
    if MARKDOWN:
        print("| Skill | Akapity | z prawem PL | Znaki | udział PL (znaki) |")
        print("|---|---:|---:|---:|---:|")
    for skill, total, polish, size, polish_size in rows:
        share = 100 * polish_size / size if size else 0
        print(f"| {skill} | {total} | {polish} | {size} | {share:.0f}% |" if MARKDOWN else f"{skill:34} akapity {total:5} PL {polish:5}  znaki {size:8}  udział PL {share:3.0f}%")
    print("\nNajwiększy udział treści PL (kandydaci do migracji):")
    for share, own_size, name in sorted(files, reverse=True)[:10]:
        print(f"- {name}: {100 * share:.0f}% ({own_size} znaków)")


if __name__ == "__main__":
    main()
