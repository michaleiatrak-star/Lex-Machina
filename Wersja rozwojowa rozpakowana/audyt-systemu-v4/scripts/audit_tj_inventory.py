#!/usr/bin/env python3
"""Sprawdza deklaracje tekstów jednolitych w repozytorium względem Sejm ELI.

Waliduje, czy wskazana pozycja istnieje, czy rzeczywiście jest obwieszczeniem
o tekście jednolitym oraz czy ELI nie zna nowszego tekstu jednolitego tej samej
ustawy/rozporządzenia. Nie modyfikuje plików.
"""

from __future__ import annotations

import argparse
import json
import re
import time
import unicodedata
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from datetime import date

PAIR_RE = re.compile(
    r"Dz\.\s*U\.?\s*(?:z\s*)?(?P<year>19\d{2}|20\d{2})"
    r"(?:\s*r\.)?\s*(?:poz\.?|nr)\s*(?P<pos>\d+)", re.I
)
TJ_RE = re.compile(r"(?:\bt\.?\s*j\.?\b|tekst(?:u|em)?\s+jednolit)", re.I)
HIST_RE = re.compile(
    r"(?:poprzedni|poprzednio|archiwaln|historyczn|zastąpion|zastepion|"
    r"\bbyło\b|\bbylo\b)", re.I
)
TITLE_STOPWORDS = {
    "ustawa", "ustawy", "rozporzadzenie", "oraz",
    "sprawie", "tekst", "jednolity", "jednolitego", "polskiej", "rzeczypospolitej",
}


def fold(value: str) -> str:
    value = value.translate(str.maketrans({"ł": "l", "Ł": "L"}))
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower().replace("–", "-").replace("—", "-")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def canonical_title(title: str) -> str:
    folded = fold(title)
    for marker in (
        "w sprawie ogloszenia jednolitego tekstu ustawy ",
        "w sprawie ogloszenia jednolitego tekstu rozporzadzenia ",
    ):
        if marker in folded:
            return folded.split(marker, 1)[1]
    return ""


def title_tokens(title: str) -> set[str]:
    return {
        token for token in fold(title).split()
        if len(token) >= 4 and token not in TITLE_STOPWORDS
    }


def expected_act_title(cell: str) -> str:
    """Odetnij zakres modułu od jednoznacznej formalnej nazwy aktu.

    Kontrola jest celowo konserwatywna: skróty i nazwy warsztatowe (KPK,
    „prawo medyczne”, „specustawa”) pozostają poza automatem.
    """
    base = re.split(r"\s+[—–-]\s+|\s+\+\s+|\s+\(", cell.strip(), maxsplit=1)[0]
    normalized = fold(base.strip("* "))
    formal_prefixes = (
        "prawo o ", "prawo ochrony ", "prawo upadlosciowe",
        "prawo restrukturyzacyjne", "kodeks cywilny", "kodeks karny",
        "kodeks postepowania ", "kodeks pracy", "kodeks wykroczen",
    )
    return base.strip("* ") if normalized.startswith(formal_prefixes) else ""


def fetch_year(year: int) -> dict[int, dict]:
    url = f"https://api.sejm.gov.pl/eli/acts/DU/{year}"
    last_error = None
    for attempt in range(3):
        try:
            request = urllib.request.Request(
                url, headers={"User-Agent": "lex-machina-tj-audit/1.0"}
            )
            with urllib.request.urlopen(request, timeout=90) as response:
                payload = json.load(response)
            return {int(item["pos"]): item for item in payload.get("items", [])}
        except Exception as exc:
            last_error = exc
            if attempt < 2:
                time.sleep(1 + attempt)
    raise RuntimeError(f"ELI {year}: {last_error}")


def iter_md_files(root: Path, mode: str):
    if mode == "all":
        yield from root.rglob("*.md")
        return
    if mode == "maps":
        yield from root.rglob("MAPA-AKTOW.md")
        yield from root.rglob("ROUTING-MAP.md")
        return
    # Operacyjna treść skilli: bez dzienników, map historycznych i raportów.
    for path in root.rglob("*.md"):
        rel = path.relative_to(root)
        if "references" in rel.parts:
            continue
        if path.name == "SKILL.md" or "modules" in rel.parts or path.name in {
            "MAPA-AKTOW.md", "ROUTING-MAP.md"
        }:
            yield path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--mode", choices=("maps", "operational", "all"), default="operational")
    parser.add_argument("--year-from", type=int, default=1997)
    parser.add_argument("--year-to", type=int, default=date.today().year)
    args = parser.parse_args()

    claims = []
    for path in iter_md_files(args.root, args.mode):
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            continue
        for lineno, line in enumerate(lines, 1):
            cells = line.split("|")
            citation = cells[2] if len(cells) >= 4 else line
            if not TJ_RE.search(citation):
                continue
            matches = list(PAIR_RE.finditer(citation))
            for index, match in enumerate(matches):
                end = matches[index + 1].start() if index + 1 < len(matches) else len(citation)
                before = citation[max(0, match.start() - 16):match.start()]
                history = citation[max(0, match.start() - 90):match.start()]
                after = citation[match.end():min(end, match.end() + 28)]
                prefixed = re.search(r"(?:t\.?\s*j\.?|tekst\s+jednolity)\s*$", before, re.I)
                suffixed = re.match(r"^[\s*(),;:-]*(?:t\.?\s*j\.?|tekst\s+jednolity)", after, re.I)
                if not (prefixed or suffixed) or HIST_RE.search(history):
                    continue
                year, pos = int(match.group("year")), int(match.group("pos"))
                if args.year_from <= year <= args.year_to:
                    # Tytuł z pierwszej komórki jest wiarygodnym oczekiwanym
                    # tytułem tylko dla jednoaktowego wiersza mapy. Wiersze
                    # wieloaktowe pozostają poza tym testem, aby uniknąć
                    # przypisania jednego nagłówka do kilku metryk.
                    expected_title = ""
                    if len(cells) >= 4 and len(matches) == 1:
                        expected_title = expected_act_title(cells[1])
                    claims.append((path, lineno, line, year, pos, expected_title))

    years = list(range(args.year_from, args.year_to + 1))
    metadata: dict[int, dict[int, dict]] = {}
    api_errors = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fetch_year, year): year for year in years}
        for future in as_completed(futures):
            year = futures[future]
            try:
                metadata[year] = future.result()
            except Exception as exc:  # jawny fail-closed, nie pusty sukces
                api_errors.append((year, exc))

    if api_errors:
        for year, exc in sorted(api_errors):
            print(f"API_ERROR\t{year}\t{exc}")
        return 2

    tj_by_title = defaultdict(list)
    for year in years:
        for pos, item in metadata[year].items():
            key = canonical_title(item.get("title", ""))
            if key:
                tj_by_title[key].append((year, pos, item.get("title", "")))

    problems = []
    valid = 0
    row_claims = defaultdict(set)
    for path, lineno, _line, year, pos, _expected_title in claims:
        item = metadata[year].get(pos)
        key = canonical_title(item.get("title", "")) if item else ""
        if key:
            row_claims[(path, lineno, key)].add((year, pos))

    for path, lineno, line, year, pos, expected_title in claims:
        item = metadata[year].get(pos)
        rel = path.relative_to(args.root)
        if item is None:
            problems.append(("MISSING", year, pos, rel, lineno, "brak pozycji w ELI", line))
            continue
        title = item.get("title", "")
        key = canonical_title(title)
        if not key:
            problems.append(("NOT_TJ", year, pos, rel, lineno, title, line))
            continue
        expected_tokens = title_tokens(expected_title)
        actual_tokens = title_tokens(key)
        overlap = len(expected_tokens & actual_tokens) / len(expected_tokens) if expected_tokens else 1.0
        if len(expected_tokens) >= 2 and overlap < 0.66:
            problems.append((
                "TITLE_MISMATCH", year, pos, rel, lineno,
                f"wiersz: {expected_title} — ELI: {title}", line,
            ))
            continue
        valid += 1
        newer = sorted((y, p, t) for y, p, t in tj_by_title[key] if (y, p) > (year, pos))
        if any(pair > (year, pos) for pair in row_claims[(path, lineno, key)]):
            continue
        if newer:
            y, p, title_new = newer[-1]
            problems.append(("NEWER_TJ", year, pos, rel, lineno,
                             f"nowszy: Dz.U. {y} poz. {p} — {title_new}", line))

    print(f"FILES={len(set(path for path, *_ in claims))}")
    print(f"CLAIMS={len(claims)}")
    print(f"UNIQUE_CLAIMS={len({(year, pos) for *_, year, pos, _expected in claims})}")
    print(f"VALID_TJ_CLAIMS={valid}")
    print(f"PROBLEMS={len(problems)}")
    for kind, year, pos, path, lineno, detail, line in problems:
        print(f"{kind}\tDz.U. {year} poz. {pos}\t{path}:{lineno}\t{detail}\t{line.strip()}")
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
