#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T21 — check_checksums.py
Kompletność i zgodność `CHECKSUMS.sha256` w skillach, które ten plik mają.

PO CO ISTNIEJE (flaga F-145, 2026-08-31d)
  `sha256sum -c` odpowiada tylko na pytanie „czy wpisane sumy się zgadzają".
  NIE odpowiada na pytanie „czy każdy plik skilla ma w ogóle wpis". Rozjazd
  wykryty przy F-145 miał OBIE postacie naraz: 12 sum niezgodnych ORAZ dwa
  moduły kanoniczne bez wpisu — a brak wpisu jest groźniejszy, bo `sha256sum -c`
  raportuje wtedy stan najzdrowszy (zero błędów). Ten sam wzorzec co F-130,
  gdzie brak pola `description:` dawał wynik `0` klasyfikowany jako ✅ OK.

CO SPRAWDZA
  A. każdy plik skilla (poza wykluczeniami) ma wpis w CHECKSUMS.sha256;
  B. każdy wpis odpowiada plikowi istniejącemu na dysku;
  C. każda suma zgadza się z zawartością.

WYKLUCZENIA (świadome)
  sam CHECKSUMS.sha256, artefakty `__pycache__`/`.pyc`, pliki ukryte,
  archiwa `.zip` rejestrowane osobno w manifeście.

⛔ CZEGO NIE ROZSTRZYGA
  Zgodność sumy dowodzi, że plik nie zmienił się OD MOMENTU WPISANIA SUMY.
  Nie dowodzi, że treść jest poprawna ani że wpis powstał na właściwej wersji.
  Odświeżenie sum po zmianie zamierzonej jest częścią wydania, nie tego testu.

KODY WYJŚCIA
  0 — brak rozjazdów
  1 — rozjazdy (brak wpisu / brak pliku / niezgodna suma)
"""

import argparse
import hashlib
import os
import sys

EXCLUDE_DIRS = {"__pycache__", ".git", "archive"}
EXCLUDE_SUFFIX = (".pyc", ".zip")
CHECKSUM_FILE = "CHECKSUMS.sha256"


def sha256(path):
    with open(path, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()


def normalizuj(sciezka):
    """Ścieżka wpisu w postaci porównywalnej z os.path.relpath.

    Obie konwencje generowania są w systemie w użyciu i obie są poprawne:
    `sha256sum *` daje `plik.md`, `find . -type f -exec sha256sum {} +` daje
    `./plik.md`. Znormalizuj, zamiast wymuszać jedną — inaczej test karze
    za konwencję, nie za stan plików.
    """
    sciezka = sciezka.strip().lstrip("*")
    return os.path.normpath(sciezka)


def skill_files(root):
    out = []
    for base, dirs, names in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]
        for n in names:
            if n.startswith(".") or n.endswith(EXCLUDE_SUFFIX) or n == CHECKSUM_FILE:
                continue
            out.append(os.path.relpath(os.path.join(base, n), root))
    return sorted(out)


def check_skill(root, name):
    cpath = os.path.join(root, CHECKSUM_FILE)
    entries = {}
    with open(cpath, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if "  " not in line:
                continue
            h, f = line.split("  ", 1)
            # ⚡ 2026-09-09 (F-170): `sha256sum -c` normalizuje prefiks `./`,
            # ten test go nie normalizował. Cztery skille (audyt-systemu-v4,
            # prawny-router-v3, shared, dr-14) generowały sumy przez
            # `find . -type f`, czyli w formacie `./plik.md` — dla T21 ŻADEN
            # z ich 307 plików nie miał wpisu, a jednocześnie ŻADNA realna
            # niezgodność wewnątrz tych skilli nie była widoczna w szumie.
            # Ta sama klasa ślepoty, którą T21 miał zamykać (F-145): wynik
            # pozornie najzdrowszy przy niesprawdzonym stanie faktycznym.
            entries[normalizuj(f)] = h

    on_disk = skill_files(root)
    brak_wpisu = [f for f in on_disk if f not in entries]
    brak_pliku = [f for f in entries if not os.path.exists(os.path.join(root, f))]
    niezgodne = [f for f, h in entries.items()
                 if os.path.exists(os.path.join(root, f))
                 and sha256(os.path.join(root, f)) != h]

    print("--- {} ---".format(name))
    print("  plików na dysku: {}   wpisów: {}".format(len(on_disk), len(entries)))
    for label, items, mark in (
            ("BRAK WPISU (plik istnieje, sumy nie ma)", brak_wpisu, "⛔"),
            ("BRAK PLIKU (wpis istnieje, pliku nie ma)", brak_pliku, "⛔"),
            ("SUMA NIEZGODNA", niezgodne, "⚠️")):
        if items:
            print("  {} {}: {}".format(mark, label, len(items)))
            for f in sorted(items):
                print("      {}".format(f))
    if not (brak_wpisu or brak_pliku or niezgodne):
        print("  ✅ komplet i zgodność")
    return len(brak_wpisu) + len(brak_pliku) + len(niezgodne)


def main():
    ap = argparse.ArgumentParser(description="T21 — sumy kontrolne skilli")
    ap.add_argument("repo_root", nargs="?", default=".",
                    help="katalog z podkatalogami skilli")
    args = ap.parse_args()

    root = os.path.abspath(args.repo_root)
    print("=" * 72)
    print("TEST T21 — KOMPLETNOŚĆ I ZGODNOŚĆ CHECKSUMS.sha256")
    print("Katalog: {}".format(root))
    print("=" * 72)

    total = 0
    checked = 0
    for name in sorted(os.listdir(root)):
        skill = os.path.join(root, name)
        if os.path.isdir(skill) and os.path.exists(os.path.join(skill, CHECKSUM_FILE)):
            total += check_skill(skill, name)
            checked += 1

    print("-" * 72)
    if checked == 0:
        print("Żaden skill w tym katalogu nie prowadzi CHECKSUMS.sha256 — "
              "test nie ma zastosowania.")
        return 0
    print("Skille z CHECKSUMS: {}   rozjazdów łącznie: {}".format(checked, total))
    print("WYNIK T21: {}".format("PASS" if total == 0 else "FAIL"))
    return 0 if total == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
