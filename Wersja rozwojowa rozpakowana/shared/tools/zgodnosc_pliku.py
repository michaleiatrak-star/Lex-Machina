#!/usr/bin/env python3
"""
zgodnosc_pliku.py — FILE CHECK: plik końcowy (.docx/.md) zgodny z zatwierdzonym projektem.

LEGAL GAUNTLET UNIVERSAL v3, G99 HYBRID-VAL pkt 4 (HARD CONSISTENCY) i test akceptacyjny T33
(„rachunek i załączniki w DOCX nie zgadzają się z projektem” → FILE CHECK FAIL).
Wywoływany z shared/HYBRID-VALIDATION.md (FAZA 3, krok F3.0) i z export_gate.py (--projekt).

Sprawdza deterministycznie, bez modelu (tylko treść dla adresata: tekst do nagłówka `CZĘŚĆ ROBOCZA`):
  P1  kwota z projektu nie występuje w pliku (albo występuje rzadziej)
  P2  kwota w pliku, której nie ma w projekcie
  P3  data różna między projektem a plikiem (brak albo nadmiar)
  P4  rachunek w pliku się nie zgadza (zapis „A + B − C = D”)
  P5  liczba załączników w spisie różna od projektu
  P6  numeracja spisu załączników nieciągła albo powtórzona
  P7  odwołanie w treści do załącznika, którego nie ma w spisie
  P8  pozycja spisu załączników z projektu, której nie ma w pliku
Nie sprawdza merytoryki ani powołań (to walidator_cytowan.py); różnica redakcyjna bez kwot, dat
i załączników nie jest błędem.

Użycie:
    python3 zgodnosc_pliku.py --projekt projekt.md --plik pismo.docx
    python3 zgodnosc_pliku.py --self-test
Kod wyjścia: 0 = FILE CHECK PASS, 4 = FILE CHECK FAIL, 2 = błąd wywołania.
Testy: python3 -m unittest test_zgodnosc_pliku (z katalogu shared/tools).
"""

import argparse
import importlib.util
import os
import re
import sys
from collections import Counter
from decimal import Decimal, InvalidOperation
from pathlib import Path

_spec = importlib.util.spec_from_file_location(
    "walidator_cytowan", os.path.join(os.path.dirname(os.path.abspath(__file__)), "walidator_cytowan.py"))
_w = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_w)

LICZBA = r"\d{1,3}(?:[   .]\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?"
WALUTA = r"(?:zł|złotych|złote|złoty|PLN|EUR|euro|€|USD)"
KWOTA = re.compile(r"(?<![\d,.])(" + LICZBA + r")(?:,-)?\s?" + WALUTA + r"(?![\wąćęłńóśźż])", re.IGNORECASE)
WYRAZENIE = re.compile(
    r"(?<![\d,.])(" + LICZBA + r")(?:\s?" + WALUTA + r")?"
    r"((?:\s?[+\-−]\s?(?:" + LICZBA + r")(?:\s?" + WALUTA + r")?)+)"
    r"\s?=\s?(" + LICZBA + r")", re.IGNORECASE)
SKLADNIK = re.compile(r"([+\-−])\s?(" + LICZBA + r")")

MIESIACE = {"stycznia": 1, "lutego": 2, "marca": 3, "kwietnia": 4, "maja": 5, "czerwca": 6, "lipca": 7,
            "sierpnia": 8, "września": 9, "października": 10, "listopada": 11, "grudnia": 12}
DATA_CYFRY = re.compile(r"(?<!\d)(\d{1,2})\.(\d{1,2})\.(\d{4})(?!\d)")
DATA_SLOWNA = re.compile(r"(?<!\d)(\d{1,2})\s+(" + "|".join(MIESIACE) + r")\s+(\d{4})(?!\d)", re.IGNORECASE)
DATA_ISO = re.compile(r"(?<![\d-])(\d{4})-(\d{2})-(\d{2})(?![\d-])")

NAGLOWEK_ZALACZNIKOW = re.compile(r"^\s*(?:\*\*)?\s*za[łl]ącznik(?:i|ów)?\s*(?:\*\*)?\s*:?\s*(?:\*\*)?\s*$", re.IGNORECASE)
POZYCJA = re.compile(r"^\s*(?:(\d+)\s*[.)]|[-–•*])\s+(.+?)\s*$")
ODWOLANIE = re.compile(r"\bzał(?:ącznik(?:i|u|iem|a)?|\.)\s*(?:nr\.?\s*)?(\d+)", re.IGNORECASE)


def _kwota(tekst):
    s = re.sub(r"[   .]", "", tekst).replace(",", ".")
    try:
        return Decimal(s).quantize(Decimal("0.01"))
    except InvalidOperation:
        return None


def _pl(k):
    """Kwota w zapisie polskim: 12 400,00."""
    calk, ulamek = f"{k:.2f}".split(".")
    znak = "-" if calk.startswith("-") else ""
    calk = calk.lstrip("-")
    grupy = []
    while calk:
        grupy.insert(0, calk[-3:])
        calk = calk[:-3]
    return f"{znak}{' '.join(grupy)},{ulamek}"


def kwoty(tekst):
    """Licznik kwot z walutą (1 000 zł == 1000,00 zł)."""
    return Counter(k for k in (_kwota(m.group(1)) for m in KWOTA.finditer(tekst)) if k is not None)


def daty(tekst):
    """Licznik dat znormalizowanych do RRRR-MM-DD (12.03.2026, 12 marca 2026, 2026-03-12)."""
    wynik = Counter()
    for m in DATA_CYFRY.finditer(tekst):
        d, mies, r = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= d <= 31 and 1 <= mies <= 12:
            wynik[f"{r:04d}-{mies:02d}-{d:02d}"] += 1
    for m in DATA_SLOWNA.finditer(tekst):
        wynik[f"{int(m.group(3)):04d}-{MIESIACE[m.group(2).lower()]:02d}-{int(m.group(1)):02d}"] += 1
    for m in DATA_ISO.finditer(tekst):
        wynik[f"{m.group(1)}-{m.group(2)}-{m.group(3)}"] += 1
    return wynik


def rachunki(tekst):
    """Lista (zapis, wyliczone, podane) dla zapisów „A + B − C = D”, które się nie zgadzają."""
    bledy = []
    for m in WYRAZENIE.finditer(tekst):
        suma = _kwota(m.group(1))
        for znak, liczba in SKLADNIK.findall(m.group(2)):
            k = _kwota(liczba)
            suma = suma + k if znak == "+" else suma - k
        podane = _kwota(m.group(3))
        if suma != podane:
            bledy.append((m.group(0).strip(), suma, podane))
    return bledy


def spis_zalacznikow(tekst):
    """(pozycje [(numer|None, opis)], tekst bez spisu). Spis = lista pod nagłówkiem „Załączniki”."""
    linie = tekst.splitlines()
    for i, linia in enumerate(linie):
        if NAGLOWEK_ZALACZNIKOW.match(linia):
            pozycje, j = [], i + 1
            while j < len(linie):
                if not linie[j].strip():
                    if pozycje:
                        break
                    j += 1
                    continue
                m = POZYCJA.match(linie[j])
                if not m:
                    break
                pozycje.append((int(m.group(1)) if m.group(1) else None, m.group(2)))
                j += 1
            return pozycje, "\n".join(linie[:i] + linie[j:])
    return [], tekst


def _opis(s):
    return re.sub(r"\s+", " ", re.sub(r"[*_`]", "", s)).strip().rstrip(";.,").lower()


def porownaj(projekt: str, plik: str):
    """Lista naruszeń {kod, opis} — pusta = FILE CHECK PASS."""
    projekt, plik = _w.tresc_dla_adresata(projekt), _w.tresc_dla_adresata(plik)
    out = []

    kp, kf = kwoty(projekt), kwoty(plik)
    for k in sorted((kp - kf).elements()):
        out.append({"kod": "P1", "opis": f"kwota {_pl(k)} z projektu nie występuje w pliku (albo rzadziej)"})
    for k in sorted((kf - kp).elements()):
        out.append({"kod": "P2", "opis": f"kwota {_pl(k)} w pliku, której nie ma w projekcie"})

    dp, df = daty(projekt), daty(plik)
    for d in sorted(set(dp) | set(df)):
        if dp[d] != df[d]:
            out.append({"kod": "P3", "opis": f"data {d}: w projekcie {dp[d]}×, w pliku {df[d]}×"})

    for zapis, wyliczone, podane in rachunki(plik):
        out.append({"kod": "P4", "opis": f"rachunek „{zapis}”: wynik {_pl(wyliczone)}, podano {_pl(podane)}"})

    sp, _ = spis_zalacznikow(projekt)
    sf, tresc_pliku = spis_zalacznikow(plik)
    if len(sp) != len(sf):
        out.append({"kod": "P5", "opis": f"załączniki: w projekcie {len(sp)}, w pliku {len(sf)}"})
    numery = [n for n, _ in sf if n is not None]
    if numery and numery != list(range(1, len(numery) + 1)):
        out.append({"kod": "P6", "opis": f"numeracja spisu załączników: {numery}"})
    dostepne = set(numery) if len(numery) == len(sf) else set(range(1, len(sf) + 1))  # numery spisu albo 1..n
    for n in sorted({int(m.group(1)) for m in ODWOLANIE.finditer(tresc_pliku)}):
        if n not in dostepne:
            out.append({"kod": "P7", "opis": f"odwołanie do załącznika nr {n}, w spisie pozycji: {len(sf)}"})
    opisy_pliku = {_opis(o) for _, o in sf}
    for _, o in sp:
        if _opis(o) not in opisy_pliku:
            out.append({"kod": "P8", "opis": f"załącznik z projektu nie występuje w spisie pliku: „{o}”"})
    return out


def raport(naruszenia) -> int:
    if not naruszenia:
        print("FILE CHECK PASS — kwoty, daty, rachunki i załączniki zgodne z projektem")
        return 0
    print(f"FILE CHECK FAIL — {len(naruszenia)} niezgodności (G99 HYBRID-VAL; status pliku: DRAFT_UNVERIFIED)")
    for n in naruszenia:
        print(f"  [{n['kod']}] {n['opis']}")
    return 4


def self_test() -> int:
    projekt = ("Wnoszę o zasądzenie 12 000,00 zł (należność główna 10 000 zł + odsetki 2 000 zł).\n"
               "Umowa z 12 marca 2026 r. (zał. nr 1), wezwanie z 01.04.2026 (zał. nr 2).\n"
               "10 000 + 2 000 = 12 000\n\nZałączniki:\n1. umowa z 12.03.2026\n2. wezwanie do zapłaty\n")
    zgodny = projekt.replace("12 000,00 zł", "12 000 zł")
    zly = (projekt.replace("2 000 zł", "2 500 zł").replace("= 12 000", "= 12 400")
           .replace("2. wezwanie do zapłaty\n", "3. wezwanie do zapłaty\n"))
    ok = not porownaj(projekt, zgodny)
    kody = {n["kod"] for n in porownaj(projekt, zly)}
    ok = ok and {"P1", "P2", "P4", "P6"} <= kody
    print("SELF-TEST OK" if ok else f"SELF-TEST NIEUDANY: {kody}")
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(description="FILE CHECK: plik końcowy zgodny z projektem (G99, T33)")
    ap.add_argument("--projekt", type=Path)
    ap.add_argument("--plik", type=Path)
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        sys.exit(self_test())
    if not (a.projekt and a.plik):
        print("Wymagane: --projekt i --plik (lub --self-test)", file=sys.stderr)
        sys.exit(2)
    sys.exit(raport(porownaj(_w.read_document_text(a.projekt), _w.read_document_text(a.plik))))


if __name__ == "__main__":
    main()
