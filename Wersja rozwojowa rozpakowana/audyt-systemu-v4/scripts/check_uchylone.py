#!/usr/bin/env python3
"""Powołania uchylonych jednostek (art., ust./§, pkt) w modułach DR.

Dla modułu: akt główny = pierwsza para Dz.U. z t.j. w nagłówku (10 wierszy).
Tekst t.j. z ELI (text.pdf -> pdftotext, cache). Zgłasza `UCHYLONY`, gdy wiersz
modułu powołuje jednostkę uchyloną aktu głównego i nie mówi o uchyleniu.
Odwołania z jawnym skrótem innego aktu (KC, KPC, TFUE…) są pomijane.
Źródło jednostek: `text.html` z ELI (identyfikatory jednostek: `arti_21_3` = art. 21³,
`arti_206-para_2` = § 2) — bez spłaszczania indeksów górnych; PDF tylko, gdy aktu nie ma
w HTML. Z HTML także `NIEISTNIEJACY` (artykuł, którego t.j. nie ma) i `NIEISTNIEJACA_JEDNOSTKA`
(§/ust., którego artykuł nie ma).
Kod wyjścia: 0 brak, 1 znaleziska, 2 błąd ELI.

Użycie: check_uchylone.py --root "Wersja rozwojowa rozpakowana" [--skill dr-02-…] [pliki…]
"""
from __future__ import annotations

import argparse
import html as htmllib
import json
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

ART_RE = re.compile(r"^\s*Art\.\s*(\d+(?:_\d+)?[a-z]*)\.\s*(?:\d+\)\s*)?(.*)$")
UNIT_RE = re.compile(r"^\s*(?:§\s*)?(\d+[a-z]*)\.\s*(?:\d+\)\s*)?\(uchylony\)")
PKT_RE = re.compile(r"^\s*(\d+[a-z]*)\)\s+\(uchylony\)")
UST_START_RE = re.compile(r"^\s*(?:§\s*)?(\d+[a-z]*)\.\s")
SUP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍ", "0123456789abcdefg")  # 442¹ w ELI-PDF = „4421"
REF_RE = re.compile(
    r"\bart\.\s*(?P<art>\d+[⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍ]*[a-z]*)(?![\d⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍa-z])(?!\s*[–-]\s*\d)"
    r"(?:\s*(?:ust\.|§)\s*(?P<ust>\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]*[a-z]*))?"
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


SUP_DIGITS = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹", "0123456789")
LOWER_WORDS = {"i", "w", "z", "ze", "oraz", "lub", "albo", "do", "na", "od", "po", "przy", "jako", "nie", "tj", "zd",
               "lit", "pkt", "ust", "zw", "art", "jest", "się", "gdy", "czy", "tego", "tej", "ten", "to", "za"}
# Wiersz sam deklaruje jednostkę z nowelizacji po t.j. (nie ma jej w t.j.): „zm. 2026/184”, „[OD …]”, „dodany”.
AMENDED_LINE = re.compile(r"\b(?:dodan\w*|nowy|nowa|wchodz\w*)\b|\bzm\.\s*\d{4}/\d+|\[OD \d{4}-|\bod \d{1,2}\.\d{2}\.20\d\d", re.I)
HTML_ID_RE = re.compile(r'id="((?:[a-z]+_[^"-]+-)*arti_[^"]+)"')


def canon_art(raw: str) -> str:
    """„21³” -> „21_3”, „209¹” -> „209_1”, „4a” -> „4a” (klucz zgodny z identyfikatorem ELI)."""
    m = re.match(r"(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([ᵃᵇᶜᵈᵉᶠᵍ]*)([a-z]*)", raw)
    if not m:
        return raw
    num, sup, suplet, letters = m.groups()
    suplet = suplet.translate(str.maketrans("ᵃᵇᶜᵈᵉᶠᵍ", "abcdefg"))
    return num + ("_" + sup.translate(SUP_DIGITS) + suplet if sup else suplet) + letters


def eli_html(year: str, pos: str, cache: Path) -> str | None:
    out = cache / f"DU-{year}-{pos}.html"
    if out.is_file():
        return out.read_text(encoding="utf-8") or None
    # ELI publikuje część t.j. tylko w PDF (textHTML: false, /struct 404): zapamiętane jako brak;
    # nieudane pobranie nie jest zapisywane (następny przebieg ponawia).
    try:
        with urllib.request.urlopen(f"https://api.sejm.gov.pl/eli/acts/DU/{year}/{pos}", timeout=60) as resp:
            has_html = bool(json.loads(resp.read().decode("utf-8")).get("textHTML"))
        if not has_html:
            out.write_text("", encoding="utf-8")
            return None
        with urllib.request.urlopen(f"https://api.sejm.gov.pl/eli/acts/DU/{year}/{pos}/text.html", timeout=300) as resp:
            data = resp.read().decode("utf-8", errors="replace")
    except Exception:
        return None
    out.write_text(data, encoding="utf-8")
    return data or None


def html_units(page: str) -> tuple[set[str], set[tuple], set[tuple]]:
    """(artykuły, istniejące (art, ust), uchylone jednostki) z text.html t.j. — klucze kanoniczne."""
    arts: set[str] = set()
    units: set[tuple] = set()
    repealed: set[tuple] = set()
    matches = list(HTML_ID_RE.finditer(page))
    for i, m in enumerate(matches):
        path = m.group(1)
        tail = path[path.index("arti_"):].split("-")
        art = tail[0][5:]
        key: list = [art]
        ust = pkt = None
        for part in tail[1:]:
            kind, _, val = part.partition("_")
            if kind in ("para", "pass"):
                ust = val
            elif kind == "pint":
                pkt = val
        arts.add(art)
        if ust:
            units.add((art, ust))
        end = matches[i + 1].start() if i + 1 < len(matches) else m.end() + 2000
        start = page.find(">", m.end()) + 1
        body = htmllib.unescape(re.sub(r"<[^>]+>", " ", page[start:end]))
        body = re.sub(r"\s+", " ", body).strip()
        label = r"^(?:Art\.\s*[\d\s]+[a-z]*\s*\.|§\s*[\d\s]+[a-z]*\.|\d+[a-z]*[.)])?\s*"
        if re.match(label + r"\((?:uchylony|uchylona|uchylone|pominięty|skreślony)\)", body):
            repealed.add(tuple(k for k in (art, ust, pkt) if k is not None) if (ust or pkt) else (art,))
            if pkt and not ust:
                repealed.add((art, None, pkt))
    return arts, units, repealed


def repealed_units(text: str) -> set[tuple]:
    """{(art,), (art, ust), (art, ust, pkt), (art, None, pkt)} uchylone w t.j."""
    units, art, ust = set(), None, None
    # Tekst jednolity zaczyna się od załącznika; obwieszczenie (pkt 1–2) pomijamy.
    start = text.find("Załącznik do obwieszczenia")
    for line in text[start if start >= 0 else 0:].splitlines():
        line = re.sub(r"(?<=\d)\[(\d+[a-z]?)\]", r"_\1", line)  # „Art. 491[11a].” = art. 491¹¹ᵃ = klucz „491_11a”
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
            # Wszystkie pozycje Dz.U. segmentu („UPNPR — Dz.U. 2023 poz. 845 t.j.; uRTV — Dz.U. 2022
            # poz. 1722 t.j.”): skrót przypisany do najbliższej pozycji po nim.
            prev = 0
            for pair in PAIR_RE.finditer(seg):
                key = (pair.group(1), pair.group(2))
                if key not in found:
                    found.append(key)
                for token in ABBR_RE.findall(seg[prev:pair.start()]):
                    if token not in STOP:
                        abbr.setdefault(token, key)
                prev = pair.end()
    return (found[0] if len(found) == 1 else None), abbr


def main_act(lines: list[str]):
    return header_acts(lines)[0]


def scan(path: Path, units_of, main=None, abbr=None, exists_of=None) -> list[tuple]:
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
        line = re.sub(r"(\bart\.\s*\d+)\((\d)\)", lambda m: m.group(1) + "⁰¹²³⁴⁵⁶⁷⁸⁹"[int(m.group(2))], line)  # „519(1)” = 519¹
        for m in REF_RE.finditer(line):
            tail = m.group("tail") or ""
            further = (line[m.end():m.end() + 60] + " " + nxt) if m.end() + 40 >= len(line) else line[m.end():m.end() + 60]
            if re.search(r"\b(?:ustaw\w*|rozporządz\w*|kodeks\w*|nowelizac\w*|rozp\.|konwencj\w*|umow\w*|OECD|TFUE|dyrektyw\w*)",
                         tail + " " + further, re.I):
                continue
            # Inny akt nazwany tuż przed powołaniem („z Konstytucją (art. 21 …)”, „Prawo o postępowaniu
            # układowym z 1934 r. (bez art. 31 § 5)”) — powołanie nie dotyczy aktu z nagłówka.
            if not pairs and re.search(r"Konstytucj\w*|\bPraw\w* o \w+|ustaw\w* z (?:dnia )?\d", line[max(0, m.start() - 90):m.start()]):
                continue
            before = line[max(0, m.start() - 14):m.start()]
            if re.search(r"\b(?:od|do|między|przed|po)\s*$", before, re.I):
                continue  # opis zakresu („od art. 132", „do art. 103a")
            prefix = re.search(r"\b([A-ZŁŚŻ][A-Za-złśżźćń.]{0,8})\s*$", before)
            # „art. 485 i n. KPC”, „art. 16b/53 uRTV”: skrót aktu po „i n.” albo po kolejnych numerach.
            token = re.match(r"^\s*(?:§\s*\d+\w*\s*)?(?:ust\.\s*\d+\w*\s*)?(?:pkt\s*\d+\w*\s*)?(?:i\s+(?:n|nast)\.\s*|[/,–-]\s*\d+\w*\s*)*([A-ZŁŚŻ][A-Za-złśżźćń.]{0,8})", tail + line[m.end():m.end() + 24])
            name = token.group(1).rstrip(".") if token else None
            if not name and prefix:
                name = prefix.group(1).rstrip(".")
            # Akt jednoznaczny (skrót przy powołaniu, Dz.U. w wierszu, jeden akt w nagłówku): tylko wtedy
            # kontrola istnienia jednostki — przy kilku aktach bez skrótu „art. 16b” nie wiadomo czyj.
            single = len({a for a in abbr.values()} | ({main} if main else set())) == 1
            low = re.match(r"^\s*(?:§\s*\d+\w*\s*)?(?:ust\.\s*\d+\w*\s*)?(?:pkt\s*\d+\w*\s*)?([a-ząćęłńóśźż]{2,5})\b", tail)
            if not name and low and low.group(1) not in LOWER_WORDS:
                continue  # „art. 36a ukk”, „art. 5 upnpr”: skrót innego aktu małymi literami
            if name and name in abbr:
                act = abbr[name]
                explicit = bool(re.fullmatch(r"[A-ZŁŚŻ][A-Za-złśżźćń]{0,6}", name)) and (name.isupper() or sum(c.isupper() for c in name) >= 2)
            elif name and name not in STOP:
                continue  # inny akt niż znane z nagłówka
            elif pairs:
                act = line_act
                explicit = act is not None
            else:
                act = main
                explicit = single
            if not act:
                continue
            units = units_of(act)
            art, ust, pkt = canon_art(m.group("art")), m.group("ust"), m.group("pkt")
            if ust:
                ust = canon_art(ust)
            known = exists_of(act) if exists_of and explicit else None
            if known and art not in known[0] and not AMENDED_LINE.search(line):
                hits.append((lineno, f"NIEISTNIEJACY DU/{act[0]}/{act[1]} art. {art}", line.strip()))
                continue
            if known and ust and (art, ust) not in known[1] and any(k[0] == art for k in known[1]) \
                    and not AMENDED_LINE.search(line):
                hits.append((lineno, f"NIEISTNIEJACA_JEDNOSTKA DU/{act[0]}/{act[1]} art. {art} § {ust}", line.strip()))
                continue
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

    html_cache: dict = {}

    def html_of(act):
        if act not in html_cache:
            page = eli_html(*act, args.cache)
            html_cache[act] = html_units(page) if page and "arti_" in page else None
        return html_cache[act]

    def units_of(act):
        if act not in cache:
            parsed = html_of(act)
            cache[act] = parsed[2] if parsed else repealed_units(eli_text(*act, args.cache))
        return cache[act]

    def exists_of(act):
        parsed = html_of(act)
        return (parsed[0], parsed[1]) if parsed else None

    for path in files:
        main_, abbr = header_acts(path.read_text(encoding="utf-8").splitlines())
        if not main_ and not abbr:
            continue
        try:
            hits = scan(path, units_of, main_, abbr, exists_of)
        except Exception as exc:  # fail-closed: brak tekstu to nie „brak problemów"
            print(f"ELI_ERROR\t{path}\t{exc}")
            errors += 1
            continue
        for lineno, unit, line in hits:
            found += 1
            code = "UCHYLONY" if not unit.startswith("NIEISTNIEJ") else unit.split()[0]
            unit = unit if code == "UCHYLONY" else unit.split(" ", 1)[1]
            print(f"{code}\t{path.relative_to(args.root) if args.root in path.parents else path}:{lineno}"
                  f"\t{unit}\t{line[:160]}")
    print(f"PLIKI={len(files)} ZNALEZISKA={found} BLEDY_ELI={errors}")
    return 2 if errors else (1 if found else 0)


if __name__ == "__main__":
    sys.exit(main())
