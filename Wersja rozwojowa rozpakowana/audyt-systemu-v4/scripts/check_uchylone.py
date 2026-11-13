#!/usr/bin/env python3
"""Powołania uchylonych jednostek (art., ust./§, pkt) w modułach DR.

Dla modułu: akt główny = pierwsza para Dz.U. z t.j. w nagłówku (10 wierszy).
Tekst t.j. z ELI (text.pdf -> pdftotext, cache). Zgłasza `UCHYLONY`, gdy wiersz
modułu powołuje jednostkę uchyloną aktu głównego i nie mówi o uchyleniu.
Odwołania z jawnym skrótem innego aktu (KC, KPC, TFUE…) są pomijane.
Kod wyjścia: 0 brak, 1 znaleziska, 2 błąd ELI.

Użycie: check_uchylone.py --root "Wersja rozwojowa rozpakowana" [--skill dr-02-…] [pliki…]
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

ART_RE = re.compile(r"^\s*Art\.\s*(\d+[a-z]*)\.\s*(?:\d+\)\s*)?(.*)$")
UNIT_RE = re.compile(r"^\s*(?:§\s*)?(\d+[a-z]*)\.\s*(?:\d+\)\s*)?\(uchylony\)")
PKT_RE = re.compile(r"^\s*(\d+[a-z]*)\)\s+\(uchylony\)")
UST_START_RE = re.compile(r"^\s*(?:§\s*)?(\d+[a-z]*)\.\s")
SUP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍ", "0123456789abcdefg")  # 442¹ w ELI-PDF = „4421"
REF_RE = re.compile(
    r"\bart\.\s*(?P<art>\d+[⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍ]*[a-z]*)(?![\d⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍa-z])(?!\s*[–-]\s*\d)"
    r"(?:\s*(?:ust\.|§)\s*(?P<ust>\d+[a-z]*))?"
    r"(?:\s*pkt\s*(?P<pkt>\d+[a-z]*))?"
    r"(?P<tail>[^\n|;]{0,14})", re.I)
_UNUSED = re.compile(r"^\W*(?:w\s+zw\.\s+z\s+)?([A-ZŁŚŻŹĆ][A-Za-zŁŚŻŹĆąęółśżźćń]{1,9}\b|k\.\s*[a-z]\.|"
                          r"ustaw\w*|rozporządz\w*|kodeks\w*|konstytucji|dyrektyw\w*|traktat\w*)")


def eli_text(year: str, pos: str, cache: Path) -> str:
    out = cache / f"DU-{year}-{pos}.txt"
    if out.is_file():
        return out.read_text(encoding="utf-8")
    url = f"https://api.sejm.gov.pl/eli/acts/DU/{year}/{pos}/text.pdf"
    with urllib.request.urlopen(url, timeout=120) as resp:
        data = resp.read()
    with tempfile.NamedTemporaryFile(suffix=".pdf") as pdf:
        pdf.write(data)
        pdf.flush()
        text = subprocess.run(["pdftotext", "-layout", pdf.name, "-"], check=True,
                              capture_output=True, text=True).stdout
    out.write_text(text, encoding="utf-8")
    return text


def repealed_units(text: str) -> set[tuple]:
    """{(art,), (art, ust), (art, ust, pkt), (art, None, pkt)} uchylone w t.j."""
    units, art, ust = set(), None, None
    # Tekst jednolity zaczyna się od załącznika; obwieszczenie (pkt 1–2) pomijamy.
    start = text.find("Załącznik do obwieszczenia")
    for line in text[start if start >= 0 else 0:].splitlines():
        line = re.sub(r"(?<=\d)\[(\d+)\]", r"\1", line)  # „Art. 186[1]." = art. 186¹
        m = ART_RE.match(line)
        if m:
            art, ust = m.group(1), None
            if m.group(2).startswith("(uchylony)") or m.group(2).startswith("(pominięty)"):
                units.add((art,))
            else:
                first = re.match(r"(?:§\s*)?(\d+[a-z]*)\.\s", m.group(2))
                ust = first.group(1) if first else None
            continue
        if art is None:
            continue
        u = UNIT_RE.match(line)
        if u:
            units.add((art, u.group(1)))
            continue
        p = PKT_RE.match(line)
        if p:
            units.add((art, ust, p.group(1)))
            continue
        s = UST_START_RE.match(line)
        if s and not line.lstrip().startswith(("Art.", "Dziennik")):
            ust = s.group(1)
    return units


PAIR_RE = re.compile(r"Dz\.\s*U\.?\s*(?:z\s*)?(\d{4})(?:\s*r\.)?\s*poz\.\s*(\d+)")
ABBR_RE = re.compile(r"\b([A-ZŁŚŻ][A-Za-złśżźćń]{0,6}[A-ZŁŚŻ][A-Za-złśżźćń]{0,4}|Op|KC|KP|KK)\b")
STOP = {"VER", "ELI", "RZĄD", "ISAP", "DU", "OK", "UE"}


def header_acts(lines: list[str]):
    """(akt główny lub None, {skrót: (rok, poz)}) z nagłówka modułu (30 wierszy)."""
    found, abbr = [], {}
    for line in lines[:30]:
        for seg in re.split(r"\s\|\s|·", line):
            if not re.search(r"t\.\s*j\.", seg):
                continue
            pair = PAIR_RE.search(seg)
            if not pair:
                continue
            key = (pair.group(1), pair.group(2))
            if key not in found:
                found.append(key)
            for token in ABBR_RE.findall(seg[:pair.start()]):
                if token not in STOP:
                    abbr.setdefault(token, key)
    return (found[0] if len(found) == 1 else None), abbr


def main_act(lines: list[str]):
    return header_acts(lines)[0]


def scan(path: Path, units_of, main=None, abbr=None) -> list[tuple]:
    """units_of(act) -> zbiór jednostek uchylonych; act wybierany per powołanie."""
    abbr = abbr or {}
    hits = []
    all_lines = path.read_text(encoding="utf-8").splitlines()
    for lineno, line in enumerate(all_lines, 1):
        nxt = all_lines[lineno][:40] if lineno < len(all_lines) else ""
        low = line.lower()
        if any(w in low for w in ("uchyl", "dawn", "poprzedn", "był ", "było ", "nie obowiązuje",
                                  "nie powołuj", "historyczn")):
            continue
        pairs = set(PAIR_RE.findall(line)) | set(re.findall(r"\bDU/(\d{4})/(\d+)", line))
        line_act = next(iter(pairs)) if len(pairs) == 1 else None
        for m in REF_RE.finditer(line):
            tail = m.group("tail") or ""
            further = (line[m.end():m.end() + 60] + " " + nxt) if m.end() + 40 >= len(line) else line[m.end():m.end() + 60]
            if re.search(r"\b(?:ustaw\w*|rozporządz\w*|kodeks\w*|nowelizac\w*|rozp\.|konwencj\w*|umow\w*|OECD|TFUE|dyrektyw\w*)",
                         tail + " " + further, re.I):
                continue
            before = line[max(0, m.start() - 14):m.start()]
            if re.search(r"\b(?:od|do|między|przed|po)\s*$", before, re.I):
                continue  # opis zakresu („od art. 132", „do art. 103a")
            prefix = re.search(r"\b([A-ZŁŚŻ][A-Za-złśżźćń.]{0,8})\s*$", before)
            token = re.match(r"^\s*(?:§\s*\d+\w*\s*)?(?:ust\.\s*\d+\w*\s*)?(?:pkt\s*\d+\w*\s*)?([A-ZŁŚŻ][A-Za-złśżźćń.]{0,8})", tail)
            name = token.group(1).rstrip(".") if token else None
            if not name and prefix:
                name = prefix.group(1).rstrip(".")
            if name and name in abbr:
                act = abbr[name]
            elif name and name not in STOP:
                continue  # inny akt niż znane z nagłówka
            elif pairs:
                act = line_act
            else:
                act = main
            if not act:
                continue
            units = units_of(act)
            art, ust, pkt = m.group("art").translate(SUP), m.group("ust"), m.group("pkt")
            keys = [(art,)]
            if ust:
                keys.append((art, ust))
            if pkt:
                keys.append((art, ust, pkt))
            for key in keys:
                if key in units:
                    hits.append((lineno, f"DU/{act[0]}/{act[1]} art. " + " ".join(k or "-" for k in key), line.strip()))
                    break
    return hits


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, required=True)
    ap.add_argument("--skill", action="append", default=[])
    ap.add_argument("--cache", type=Path, default=Path(tempfile.gettempdir()) / "eli-tj-cache")
    ap.add_argument("pliki", nargs="*", type=Path)
    args = ap.parse_args()
    args.cache.mkdir(parents=True, exist_ok=True)
    files = list(args.pliki)
    for skill in args.skill or ([] if files else [d.name for d in args.root.glob("dr-*")]):
        files += sorted((args.root / skill / "modules").rglob("*.md"))
    found = errors = 0
    cache: dict = {}

    def units_of(act):
        if act not in cache:
            cache[act] = repealed_units(eli_text(*act, args.cache))
        return cache[act]

    for path in files:
        main_, abbr = header_acts(path.read_text(encoding="utf-8").splitlines())
        if not main_ and not abbr:
            continue
        try:
            hits = scan(path, units_of, main_, abbr)
        except Exception as exc:  # fail-closed: brak tekstu to nie „brak problemów"
            print(f"ELI_ERROR\t{path}\t{exc}")
            errors += 1
            continue
        for lineno, unit, line in hits:
            found += 1
            print(f"UCHYLONY\t{path.relative_to(args.root) if args.root in path.parents else path}:{lineno}"
                  f"\t{unit}\t{line[:160]}")
    print(f"PLIKI={len(files)} ZNALEZISKA={found} BLEDY_ELI={errors}")
    return 2 if errors else (1 if found else 0)


if __name__ == "__main__":
    sys.exit(main())
