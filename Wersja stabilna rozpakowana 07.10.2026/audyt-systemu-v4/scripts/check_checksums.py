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

TRYB KOPII ZAINSTALOWANEJ (F-221, od 6.159)
  claude.ai przy imporcie z marketplace serializuje ponownie frontmatter
  `SKILL.md` (komentarze YAML usunięte, wcięcia list zdjęte, skalary blokowe
  → ciągi z `\\n`). Pomiar 2026-10-03c: 32/32 `SKILL.md` różne bajtowo od `main`,
  32/32 frontmatterów RÓWNOWAŻNYCH semantycznie (PyYAML `safe_load`), 32/32
  korpusów identycznych; wszystkie pozostałe pliki zgodne. Suma `SKILL.md`
  w kopii zainstalowanej jest więc niemiarodajna z definicji.
  Tryb włącza się sam, gdy katalog zawiera podkatalogi `plugin:skill`
  (układ claude.ai), albo flagą `--kopia-zainstalowana`; `--repozytorium`
  wymusza tryb ścisły. W trybie kopii:
    • bez `--repo-ref` — niezgodność sumy `SKILL.md` to ℹ️ (nie liczy się),
      z jawną informacją, że `SKILL.md` NIE został zweryfikowany;
    • z `--repo-ref <katalog skilli repozytorium>` — `SKILL.md` porównywany
      z repozytorium: korpus bajtowo + frontmatter semantycznie (PyYAML, jeśli
      dostępny; bez niego — tylko korpus, z adnotacją). Rozbieżność = ⛔.
  Pozostałe pliki — bez zmian, ściśle jak w repozytorium.

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


def _podziel(tresc):
    if not tresc.startswith("---"):
        return None, tresc
    cz = tresc.split("---", 2)
    return (cz[1], cz[2]) if len(cz) == 3 else (None, tresc)


def porownaj_skill_md(sciezka, ref_sciezka):
    """(ok, opis) — korpus bajtowo, frontmatter semantycznie (F-221)."""
    with open(sciezka, encoding="utf-8") as fh:
        fa, ba = _podziel(fh.read())
    with open(ref_sciezka, encoding="utf-8") as fh:
        fb, bb = _podziel(fh.read())
    if ba != bb:
        return False, "korpus SKILL.md ≠ repozytorium"
    try:
        import yaml  # opcjonalnie — reszta T21 działa na bibliotece standardowej
    except ImportError:
        return True, "korpus = repozytorium; frontmatter NIEPORÓWNANY (brak PyYAML)"
    try:
        rowne = yaml.safe_load(fa or "") == yaml.safe_load(fb or "")
    except yaml.YAMLError as e:
        return False, "frontmatter nie parsuje się: {}".format(str(e).splitlines()[0])
    if not rowne:
        return False, "frontmatter ≠ repozytorium SEMANTYCZNIE (nie tylko forma)"
    return True, "korpus = repozytorium, frontmatter równoważny (różnica wyłącznie formy — F-221)"


def check_skill(root, name, kopia=False, ref_root=None):
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
    if kopia and "SKILL.md" in niezgodne:
        niezgodne.remove("SKILL.md")
        ref = os.path.join(ref_root, name.split(":")[-1], "SKILL.md") if ref_root else None
        if ref and os.path.isfile(ref):
            ok, opis = porownaj_skill_md(os.path.join(root, "SKILL.md"), ref)
            if ok:
                print("  ✅ SKILL.md: {}".format(opis))
            else:
                print("  ⛔ SKILL.md: {}".format(opis))
                niezgodne.append("SKILL.md")
        else:
            print("  ℹ️ SKILL.md: suma niemiarodajna w kopii zainstalowanej (F-221) — "
                  "SKILL.md NIEZWERYFIKOWANY; podaj --repo-ref, aby porównać z repozytorium")
    for label, items, mark in (
            ("BRAK WPISU (plik istnieje, sumy nie ma) — ⚠️ ZANIM dopiszesz sumę: sprawdź w CHANGELOG, czy plik nie został USUNIĘTY w poprzednim wydaniu (relikt instalacji „na nakładkę”, AUDYT-2026-09-29c)", brak_wpisu, "⛔"),
            ("BRAK PLIKU (wpis istnieje, pliku nie ma)", brak_pliku, "⛔"),
            ("SUMA NIEZGODNA", niezgodne, "⚠️")):
        if items:
            print("  {} {}: {}".format(mark, label, len(items)))
            for f in sorted(items):
                print("      {}".format(f))
    if not (brak_wpisu or brak_pliku or niezgodne):
        print("  ✅ komplet i zgodność")
    return len(brak_wpisu) + len(brak_pliku) + len(niezgodne)


def selftest():
    import tempfile
    ok = 0
    with tempfile.TemporaryDirectory() as t:
        a, b = os.path.join(t, "a.md"), os.path.join(t, "b.md")
        repo = '---\nname: x\nlista:\n  - p   # komentarz\n---\nKORPUS\n'
        host = '---\nname: x\nlista:\n- p\n---\nKORPUS\n'
        open(a, "w").write(host); open(b, "w").write(repo)
        r1 = porownaj_skill_md(a, b)
        open(a, "w").write(host.replace("KORPUS", "INNY"))
        r2 = porownaj_skill_md(a, b)
        open(a, "w").write(host.replace("- p", "- q"))
        r3 = porownaj_skill_md(a, b)
    for opis, war in [("forma hosta, ta sama treść → OK", r1[0]),
                      ("inny korpus → ⛔", not r2[0]),
                      ("inna wartość YAML → ⛔ (gdy PyYAML)", (not r3[0]) or "NIEPORÓWNANY" in r3[1])]:
        print(("  OK   " if war else "  FAIL ") + opis); ok += war
    print("SELFTEST T21: {}/3".format(ok))
    return 0 if ok == 3 else 1


def main():
    ap = argparse.ArgumentParser(description="T21 — sumy kontrolne skilli")
    ap.add_argument("repo_root", nargs="?", default=".",
                    help="katalog z podkatalogami skilli")
    tryb = ap.add_mutually_exclusive_group()
    tryb.add_argument("--kopia-zainstalowana", action="store_true",
                      help="wymuś tryb kopii zainstalowanej w hoście (F-221)")
    tryb.add_argument("--repozytorium", action="store_true",
                      help="wymuś tryb ścisły (repozytorium)")
    ap.add_argument("--repo-ref", default=None,
                    help="katalog skilli repozytorium do porównania SKILL.md w trybie kopii")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()
    if args.selftest:
        return selftest()

    root = os.path.abspath(args.repo_root)
    kopia = args.kopia_zainstalowana or (not args.repozytorium and any(
        ":" in d for d in os.listdir(root) if os.path.isdir(os.path.join(root, d))))
    ref_root = os.path.abspath(args.repo_ref) if args.repo_ref else None
    print("=" * 72)
    print("TEST T21 — KOMPLETNOŚĆ I ZGODNOŚĆ CHECKSUMS.sha256")
    print("Katalog: {}".format(root))
    print("Tryb: {}".format(
        "KOPIA ZAINSTALOWANA (F-221) — SKILL.md {}".format(
            "porównywany z {}".format(ref_root) if ref_root else "NIEZWERYFIKOWANY")
        if kopia else "REPOZYTORIUM (ścisły)"))
    print("=" * 72)

    total = 0
    checked = 0
    for name in sorted(os.listdir(root)):
        skill = os.path.join(root, name)
        if os.path.isdir(skill) and os.path.exists(os.path.join(skill, CHECKSUM_FILE)):
            total += check_skill(skill, name, kopia, ref_root)
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
