#!/usr/bin/env python3
"""Audyt propagacji nowelizacji przez cały korpus skilli.

Narzędzie jest niezależne od hosta i modelu. Przyjmuje tekst urzędowy
nowelizacji oraz katalog korpusu, odtwarza kolejno numerowane dyspozycje
artykułu nowelizującego i raportuje artykuły aktu bazowego wraz z liczbą
plików korpusu, w których są powołane.

Przykład:
  python3 audit_amendment_scope.py D20222600-layout.txt SKILLS_ROOT \
    --act-label KK --from-directive 1 --to-directive 116
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


TOP_LEVEL = re.compile(r"^(\d+)\)\s+(.*)$")
ARTICLE = re.compile(r"\bart\.?\s*(\d+[a-z]*)\b", re.IGNORECASE)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("amendment_text", type=Path)
    parser.add_argument("corpus_root", type=Path)
    parser.add_argument("--act-label", default="AKT")
    parser.add_argument("--from-directive", type=int, default=1)
    parser.add_argument("--to-directive", type=int, required=True)
    parser.add_argument("--output", type=Path)
    return parser.parse_args()


def directives(text: str, first: int, last: int) -> list[tuple[int, str]]:
    starts: list[tuple[int, int, str]] = []
    expected = first
    lines = text.splitlines()
    for index, line in enumerate(lines):
        match = TOP_LEVEL.match(line)
        if match and int(match.group(1)) == expected:
            starts.append((expected, index, match.group(2)))
            expected += 1
            if expected > last:
                break
    if expected <= last:
        missing = ", ".join(str(n) for n in range(expected, last + 1))
        raise ValueError(f"brak kolejnych dyspozycji od: {missing}")

    result: list[tuple[int, str]] = []
    for offset, (number, start, opening) in enumerate(starts):
        end = starts[offset + 1][1] if offset + 1 < len(starts) else len(lines)
        result.append((number, "\n".join([opening, *lines[start + 1 : end]])))
    return result


def markdown_files(root: Path) -> list[Path]:
    return [path for path in root.rglob("*.md") if ".git" not in path.parts]


def article_index(files: list[Path]) -> dict[str, tuple[int, int]]:
    """Zbuduj indeks jednym przebiegiem; nie odczytuj korpusu per artykuł."""
    totals: dict[str, int] = {}
    per_file: dict[str, int] = {}
    for path in files:
        data = path.read_text(encoding="utf-8", errors="replace")
        found = [item.lower() for item in ARTICLE.findall(data)]
        for article in found:
            totals[article] = totals.get(article, 0) + 1
        for article in set(found):
            per_file[article] = per_file.get(article, 0) + 1
    return {
        article: (per_file.get(article, 0), occurrence_count)
        for article, occurrence_count in totals.items()
    }


def build_report(args: argparse.Namespace) -> str:
    source = args.amendment_text.read_text(encoding="utf-8", errors="replace")
    parsed = directives(source, args.from_directive, args.to_directive)
    files = markdown_files(args.corpus_root)
    index = article_index(files)
    rows = [
        f"# Zakres propagacji: {args.act_label}",
        "",
        f"Dyspozycje: **{len(parsed)}** ({args.from_directive}–{args.to_directive}); "
        f"korpus: **{len(files)}** plików Markdown.",
        "",
        "| Dysp. | Artykuły wykryte w dyspozycji | Pliki / wystąpienia w korpusie |",
        "|---:|---|---:|",
    ]
    for number, body in parsed:
        # Zakres dyspozycji kończy się przed pierwszym cytatem nowego
        # brzmienia. Artykuły wewnątrz cytatu są odesłaniami normatywnymi,
        # a nie kolejnymi jednostkami zmienianymi przez tę dyspozycję.
        scope = body.split("„", 1)[0]
        articles = list(dict.fromkeys(ARTICLE.findall(scope)))
        coverage = []
        for article in articles:
            file_count, occurrence_count = index.get(article.lower(), (0, 0))
            coverage.append(f"art. {article}: {file_count}/{occurrence_count}")
        rows.append(
            f"| {number} | {', '.join('art. ' + a for a in articles) or '—'} "
            f"| {'; '.join(coverage) or '—'} |"
        )
    rows.extend(
        [
            "",
            "## Warunek zamknięcia",
            "",
            "Raport jest inwentarzem, nie dowodem poprawności treści. Każda dyspozycja, "
            "której przepis występuje w korpusie, wymaga porównania treści modułu z "
            "brzmieniem obowiązującym; wynik 0 trafień również musi zostać jawnie "
            "zakwalifikowany jako brak pokrycia albo świadomy brak zastosowania.",
        ]
    )
    return "\n".join(rows) + "\n"


def main() -> int:
    args = parse_args()
    try:
        report = build_report(args)
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    if args.output:
        args.output.write_text(report, encoding="utf-8")
    else:
        print(report, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
