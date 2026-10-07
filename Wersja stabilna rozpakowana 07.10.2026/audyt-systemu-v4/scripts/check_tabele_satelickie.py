#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T32 — tabele satelickie opłat: każda kwota musi mieć podstawę (O-11(b)).

Powstał 2026-09-16e. `shared/TABELE-OPLAT.md` sekcja 7 prowadzi rejestr plików,
w których poza rdzeniem stoją kwoty opłat. Rejestr był kontrolą ręczną; pomiar
z AUDYT-2026-09-12 wykazał w tych plikach trafność poniżej 80 %, a najczęstszą
postacią była kwota bez podstawy albo z podstawą fałszywą.

Test (offline) — dla każdego pliku z rejestru:
  * plik musi istnieć (FAIL, gdy rejestr wskazuje nieistniejący plik);
  * wiersz tabeli zawierający kwotę („123 zł", „1 000 zł", „5 %") bez podstawy
    prawnej w wierszu ANI w kolumnie nagłówka „Podstawa"/„Przepis"/„Źródło" → WARN.
Podstawa w wierszu, w kolumnie nagłówka albo w KONTEKST=8 liniach nad tabelą
(zdanie wprowadzające „Stawki (art. 13 ust. 1 KSCU):"). Podstawa = „art.", „§", „zał.", „ust.", „pkt", „rozp", „Dz.U.", „KSCU", „KPC", „ustawa".

Kod wyjścia: 1 tylko przy brakującym pliku; WARN nie blokuje (kwota bywa
przykładem obliczeniowym — ocena ręczna).
"""
import argparse, glob, os, re, sys

KWOTA = re.compile(r"\d[\d\s\u00a0]*(?:,\d+)?\s*(?:zł|%)")
PODST = re.compile(r"(?i)art\.|§|zał\.|ust\.|\bpkt\b|rozp|dz\.\s*u\.|kscu|kpc|kpk|kpa|ustaw|okw|uks")
KOL_PODST = re.compile(r"(?i)podstaw|przepis|źródło|zrodlo")


def rejestr(root):
    p = os.path.join(root, "shared", "TABELE-OPLAT.md")
    t = open(p, encoding="utf-8").read()
    a = t.find("## 7.")
    b = t.find("\n## ", a + 5)
    sekcja = t[a:b if b > 0 else None]
    pliki = []
    for l in sekcja.splitlines():
        if not l.startswith("| `"):
            continue
        m = re.match(r"\| `([^`]+)`", l)
        if not m or m.group(1).endswith("/") or "/" not in m.group(1):
            continue
        wz = m.group(1)
        wz = re.sub(r"^([a-z0-9]+-\d+)-\.\.\./", r"\1-*/", wz)   # dr-12-.../ → dr-12-*/
        pliki.append((wz, glob.glob(os.path.join(root, wz))))
    return pliki


KONTEKST = 8   # linie nad tabelą, w których podstawa pokrywa całą tabelę


def _wprowadza(linia):
    """Kontekst pokrywa tabelę tylko jako nagłówek, zdanie wprowadzające („…:")
    albo wskazanie aktu („Dz.U."). Proza obok (np. polecenie reprodukcji z „Art.",
    zdanie „nie stosować tabeli z § 2") nie pokrywa — dwa takie fałszywe pokrycia
    ukryły realne braki w pierwszym przebiegu (2026-09-16e)."""
    x = linia.strip()
    return x.startswith("#") or x.rstrip("*").endswith(":") or bool(re.search(r"Dz\.\s*U\.", x))


def skanuj(tekst):
    warn = []
    linie = tekst.splitlines()
    kol_ok = False
    w_tabeli = False
    for i, l in enumerate(linie, 1):
        if not l.lstrip().startswith("|"):
            kol_ok = w_tabeli = False
            continue
        if not w_tabeli:
            w_tabeli = True
            nad = [x for x in linie[max(0, i - 1 - KONTEKST):i - 1] if x.strip()]
            kol_ok = any(PODST.search(x) and _wprowadza(x) for x in nad[-KONTEKST:])
        komorki = [c.strip() for c in l.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", c) for c in komorki if c):
            continue
        if not kol_ok and any(KOL_PODST.search(c) for c in komorki) and not KWOTA.search(l):
            kol_ok = True
            continue
        if KWOTA.search(l) and not PODST.search(l) and not kol_ok:
            warn.append((i, l.strip()[:120]))
    return warn


def selftest():
    przyp = [
        ("kwota z podstawą w wierszu", "| pozew | 30 zł | x |\n", 1),
        ("kwota + art. w wierszu", "| pozew | 30 zł (art. 13 KSCU) |\n", 0),
        ("kolumna Podstawa w nagłówku", "| Pismo | Opłata | Podstawa |\n|---|---|---|\n| pozew | 30 zł | |\n", 0),
        ("wiersz bez kwoty", "| pozew | stała |\n", 0),
        ("nowa tabela kasuje kolumnę", "| A | Podstawa |\n|---|---|\n| a | b |\n\n| x | 5 % |\n", 1),
        ("podstawa w zdaniu nad tabelą", "Stawki (art. 13 ust. 1 KSCU):\n\n| do 500 zł | 30 zł |\n", 0),
        ("podstawa w nagłówku sekcji", "### Wpis stały — § 2 ust. 1\n\n| skarga | 100 zł |\n", 0),
        ("proza z „Art.” nad tabelą nie pokrywa", "Reprodukcja: sed '/Art. 2/p'.\n\n| do 1 roku | 180 zł |\n", 1),
        ("podstawa zbyt daleko nad tabelą", "art. 13\n" + "tekst\n" * 9 + "| do 500 zł | 30 zł |\n", 1),
    ]
    ok = 0
    for opis, t, exp in przyp:
        w = skanuj(t)
        war = len(w) == exp
        print(("  OK   " if war else "  FAIL ") + opis + f" (warn={len(w)})")
        ok += war
    print(f"SELFTEST T32: {ok}/{len(przyp)}")
    return 0 if ok == len(przyp) else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--szczegoly", action="store_true", help="wypisz każdy wiersz WARN")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    fail = 0
    razem = 0
    print("T32 — tabele satelickie opłat (rejestr: shared/TABELE-OPLAT.md §7)")
    for wz, pliki in rejestr(a.repo_root):
        if not pliki:
            print(f"  ⛔ BRAK PLIKU: {wz}")
            fail += 1
            continue
        for f in sorted(pliki):
            w = skanuj(open(f, encoding="utf-8").read())
            razem += len(w)
            print(f"  {'⚠️ ' if w else '✅'} {os.path.relpath(f, a.repo_root)}: {len(w)} wierszy z kwotą bez podstawy")
            if a.szczegoly:
                for i, l in w:
                    print(f"       L{i}: {l}")
    print(f"WYNIK T32: {'❌ FAIL' if fail else ('⚠️ WARN' if razem else '✅ PASS')} — brakujących plików: {fail}, wierszy do przeglądu: {razem}")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
