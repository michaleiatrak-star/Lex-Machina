#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_pokrycie_orkiestratora.py — TEST T23

PYTANIE, NA KTÓRE ODPOWIADA
  Czy każdy skrypt testowy zarejestrowany w `scripts:` jest ALBO wywoływany
  przez `run_regression_suite.py`, ALBO jawnie zadeklarowany jako ręczny
  w `references/SKRYPTY-RECZNE.md` z podanym powodem?

PO CO ISTNIEJE (flaga O-4, otwarta 2026-09-01, zamknięta 2026-09-10c)
  Rejestracja skryptu w `scripts:` nie gwarantuje, że ktokolwiek go uruchamia.
  Zmierzone 2026-09-01: trzy skrypty żyły poza pełnym przebiegiem, w tym
  `test_f108_trade.py` i `mock_eli_server_test.py` ZEPSUTE od dni — awaria była
  niewidoczna, bo nic ich nie wywoływało. Wpięto je ręcznie i nic nie pilnowało,
  żeby następny dodany test też został wpięty.

  ⛔ Flaga wprost zakazywała domykania przeglądem wzrokowym listy: to ten sam
  rodzaj kontroli, który przepuścił F-147.

CO TEST ROZSTRZYGA, A CZEGO NIE
  ✅ Rozstrzyga: czy stan „skrypt poza automatem" jest ZADEKLAROWANY, czy MILCZĄCY.
  ⛔ NIE rozstrzyga, czy skrypt działa. Skrypt może być poprawnie zadeklarowany
     jako ręczny i być zepsuty od miesięcy — dokładnie jak `test_f108_trade.py`
     przed 2026-09-01. T23 pilnuje kompletności deklaracji, nie sprawności kodu.
  ⛔ NIE rozstrzyga, czy skrypty ręczne faktycznie uruchomiono. To należy do
     `AUDIT-JOURNAL.md`.

  ⚠️ Ograniczenie wykrywania wywołań: nazwy skryptów czytane są z literałów
     w `run_regression_suite.py`. Wywołanie zbudowane dynamicznie (sklejenie
     nazwy ze zmiennych) byłoby dla tego testu niewidoczne i dałoby fałszywy
     FAIL. Orkiestrator używa dziś wyłącznie literałów; przy zmianie tej
     konwencji trzeba poprawić parser, a nie obejść test.

KODY WYJŚCIA
  0 — każdy zarejestrowany skrypt ma przypisany status
  1 — co najmniej jeden skrypt bez statusu, albo pusty powód w rejestrze ręcznym
  2 — brak wymaganych plików
"""

import argparse
import re
import sys
from pathlib import Path

SKILL = "audyt-systemu-v4"
ORKIESTRATOR = "scripts/run_regression_suite.py"
REJESTR_RECZNY = "references/SKRYPTY-RECZNE.md"
WZORZEC_TESTU = re.compile(r"^(test_|check_|ci_check_).*\.py$")


def zarejestrowane(skill_md: Path):
    """Nazwy plików skryptów z pola `scripts:` frontmatteru."""
    tekst = skill_md.read_text(encoding="utf-8")
    czesci = tekst.split("---", 2)
    if len(czesci) < 3:
        return None
    fm = czesci[1]
    linie = fm.split("\n")
    try:
        start = next(i for i, l in enumerate(linie) if l.startswith("scripts:"))
    except StopIteration:
        return set()
    koniec = start + 1
    while koniec < len(linie) and (linie[koniec].startswith(" ") or not linie[koniec].strip()):
        koniec += 1
    out = set()
    for linia in linie[start + 1:koniec]:
        m = re.match(r"\s*-\s*([^\s#]+)", linia)
        if m:
            nazwa = m.group(1).split("/")[-1]
            if WZORZEC_TESTU.match(nazwa):
                out.add(nazwa)
    return out


def wywolywane(orkiestrator: Path):
    return set(re.findall(r"[\"']([a-z0-9_]+\.py)[\"']",
                          orkiestrator.read_text(encoding="utf-8")))


def reczne(rejestr: Path):
    """Zwraca {nazwa: powód}. Powód pusty = błąd deklaracji."""
    out = {}
    for linia in rejestr.read_text(encoding="utf-8").split("\n"):
        if not linia.startswith("| `"):
            continue
        kol = [c.strip() for c in linia.strip().strip("|").split("|")]
        if len(kol) < 2:
            continue
        nazwa = kol[0].strip("`")
        if WZORZEC_TESTU.match(nazwa):
            out[nazwa] = kol[1]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=".")
    a = ap.parse_args()
    root = Path(a.repo_root).resolve() / SKILL

    print("=" * 72)
    print("TEST T23 — POKRYCIE ORKIESTRATORA (flaga O-4)")
    print(f"Katalog: {root}")
    print("=" * 72)

    for wzgl in ("SKILL.md", ORKIESTRATOR, REJESTR_RECZNY):
        if not (root / wzgl).is_file():
            print(f"⛔ BRAK PLIKU: {wzgl}")
            return 2

    reg = zarejestrowane(root / "SKILL.md")
    if reg is None:
        print("⛔ Nie udało się odczytać frontmatteru SKILL.md")
        return 2
    orch = wywolywane(root / ORKIESTRATOR)
    man = reczne(root / REJESTR_RECZNY)

    bez_statusu = sorted(reg - orch - set(man))
    puste_powody = sorted(n for n, p in man.items() if not p or len(p) < 20)
    duchy = sorted(set(man) - reg)
    niezarejestrowane = sorted(n for n in (orch - reg) if WZORZEC_TESTU.match(n))

    print(f"\nZarejestrowanych skryptów testowych : {len(reg)}")
    print(f"  wywoływanych przez orkiestrator   : {len(reg & orch)}")
    print(f"  zadeklarowanych jako ręczne       : {len(reg & set(man))}")

    blad = False

    if bez_statusu:
        blad = True
        print("\n⛔ SKRYPTY BEZ STATUSU — ani w orkiestratorze, ani w rejestrze ręcznym:")
        for n in bez_statusu:
            print(f"     • {n}")
        print("   To jest dokładnie stan, który ukrył awarię test_f108_trade.py.")
        print(f"   Napraw: wepnij do {ORKIESTRATOR} albo dopisz wiersz")
        print(f"   z POWODEM do {REJESTR_RECZNY}.")

    if puste_powody:
        blad = True
        print("\n⛔ DEKLARACJE RĘCZNE BEZ POWODU (albo powód poniżej 20 znaków):")
        for n in puste_powody:
            print(f"     • {n}")
        print("   „bo tak\" nie jest powodem — deklaracja bez uzasadnienia")
        print("   przywraca stan milczący, który ta flaga miała usunąć.")

    if duchy:
        print("\n⚠️ W REJESTRZE RĘCZNYM, ALE NIE W `scripts:` — skrypt-duch:")
        for n in duchy:
            print(f"     • {n}")
        print("   Nie jest to FAIL, ale albo plik zniknął, albo wypadł z rejestracji.")

    if niezarejestrowane:
        print("\n⚠️ WYWOŁYWANE PRZEZ ORKIESTRATOR, NIEZAREJESTROWANE w `scripts:`:")
        for n in niezarejestrowane:
            print(f"     • {n}")
        print("   T22 tego nie widzi — pilnuje kierunku rejestr → dysk, nie odwrotnie.")

    print("\n" + "-" * 72)
    if blad:
        print("WYNIK T23: ⛔ FAIL — co najmniej jeden skrypt bez przypisanego statusu.")
        return 1
    print("WYNIK T23: ✅ PASS — każdy zarejestrowany skrypt ma status "
          "(orkiestrator albo jawna deklaracja ręczna).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
