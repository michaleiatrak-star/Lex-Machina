#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T26 — check_frontmatter_yaml.py

Sprawdza, czy frontmatter KAŻDEGO `SKILL.md` **daje się sparsować jako YAML**
i czy pola listowe są listami łańcuchów, a nie map.

⛔ POWÓD POWSTANIA (F-159, 2026-09-04c) — NAWRÓT, NIE NOWA USTERKA.
`prawny-router-v3` dwa razy pod rząd nie ładował się na hoście z powodu
niepoprawnego YAML-a we własnym frontmatterze:

  3.37 / F-146: niesparowany cudzysłów w polu `changelog` (otwarcie
                typograficzne, domknięcie proste) urwał skalar w połowie zdania.
  3.38 / F-159: element listy `escalation` miał w linii kontynuacji
                „weryfikacji: view shared/…". YAML czyta `": "` jako początek
                mapy → ScannerError → CAŁY frontmatter nieparsowalny.

Za każdym razem naprawiano OBJAW. Przyczyna była wspólna i została przeoczona:
**żaden skrypt w tym pakiecie nie używał PyYAML.** T22 pilnuje rejestracji
zasobów i sam deklaruje w docstringu „Bez PyYAML"; sprawdza, czy frontmatter
da się WYODRĘBNIĆ (są dwa `---`), nie czy da się go PRZECZYTAĆ. Plik z
uszkodzoną składnią przechodził T22 bezbłędnie.

To ta sama klasa ślepoty co F-130, F-145 i F-147: bramka istnieje, ale mierzy
sąsiedni fakt.

⛔ DRUGI SPRAWDZANY BŁĄD — CICHE ZNIEKSZTAŁCENIE TYPU. Zapis:

    inputs:
      - opcjonalnie: pliki/dowody wgrane przez użytkownika

parsuje się BEZ BŁĘDU, ale daje `{"opcjonalnie": "pliki/dowody…"}` — mapę,
nie łańcuch. Konsument czytający listę stringów dostaje słownik i albo się
wywraca, albo cicho gubi treść. Kod wyjścia 0 z samego `yaml.safe_load`
nie wystarcza; dlatego T26 sprawdza też TYPY elementów.

Użycie:
    python3 check_frontmatter_yaml.py                 # wszystkie skille
    python3 check_frontmatter_yaml.py --katalog PATH  # jeden skill
    python3 check_frontmatter_yaml.py --selftest      # offline

Kody wyjścia: 0 = wszystkie frontmattery poprawne; 1 = wykryto usterkę;
2 = błąd wywołania lub BRAK PyYAML (patrz niżej).

⛔ BRAK PyYAML JEST BŁĘDEM, NIE POWODEM DO POMINIĘCIA. Test, który przy braku
zależności kończy się cicho zerem, jest gorszy niż jego brak — udaje, że
sprawdził. Przy braku modułu skrypt kończy się kodem 2 i mówi, czego brakuje.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # patrz uwaga w docstringu — nie udajemy, że sprawdziliśmy
    yaml = None

# Pola, których elementy MUSZĄ być łańcuchami. Mapa w środku to prawie zawsze
# skutek zapisu „- klucz: wartość", nie zamierzona struktura.
POLA_LISTOWE = (
    "inputs", "outputs", "escalation", "limitations",
    "required_modules", "changelog",
)

# ⛔ KOREKTA 2026-09-04c, jeszcze przed wydaniem. Pierwsza wersja T26 wymagała,
# by `changelog` był listą — i zgłosiła `shared` jako usterkę. To był FAŁSZYWY
# ALARM: `shared/SKILL.md` używa bloku `changelog: |`, czyli skalara
# wielolinijkowego. Zapis jest poprawny, a nawet ODPORNIEJSZY na klasę błędów
# F-146/F-159 niż lista cytowanych elementów, bo w bloku `|` dwukropek i
# cudzysłów nie mają znaczenia składniowego.
# Bramka produkująca fałszywe alarmy na legalnej konwencji zostaje wyłączona
# przez użytkownika po drugim przebiegu — dlatego `changelog` jako łańcuch
# jest DOZWOLONY. Wymóg listy pozostaje dla pól, które konsument iteruje.
POLA_DOPUSZCZAJACE_BLOK = ("changelog",)


def frontmatter(tresc: str) -> str | None:
    m = re.match(r"---\n(.*?)\n---\n", tresc, re.S)
    return m.group(1) if m else None


def sprawdz(sciezka: Path) -> list[str]:
    """Zwraca listę usterek; pusta = plik zdrowy."""
    usterki: list[str] = []
    tresc = sciezka.read_text(encoding="utf-8")
    fm = frontmatter(tresc)

    if fm is None:
        return ["brak frontmatteru (nie znaleziono pary ---)"]

    try:
        dane = yaml.safe_load(fm)
    except yaml.YAMLError as e:
        mark = getattr(e, "problem_mark", None)
        gdzie = f", linia {mark.line + 1}, kolumna {mark.column + 1}" if mark else ""
        return [f"NIEPARSOWALNY YAML: {getattr(e, 'problem', e)}{gdzie}"]

    if not isinstance(dane, dict):
        return [f"frontmatter nie jest mapą, tylko {type(dane).__name__}"]

    for pole in POLA_LISTOWE:
        wartosc = dane.get(pole)
        if wartosc is None:
            continue
        if isinstance(wartosc, str) and pole in POLA_DOPUSZCZAJACE_BLOK:
            continue  # blok `|` — konwencja legalna, patrz komentarz wyżej
        if not isinstance(wartosc, list):
            usterki.append(f"pole `{pole}` nie jest listą, tylko {type(wartosc).__name__}")
            continue
        for i, el in enumerate(wartosc):
            if isinstance(el, dict):
                klucz = next(iter(el), "?")
                usterki.append(
                    f"`{pole}`[{i}] to MAPA, nie tekst — zapis „- {klucz}: …\" "
                    f"tworzy słownik; ujmij element w cudzysłów albo zamień "
                    f"dwukropek na myślnik"
                )
            elif not isinstance(el, str):
                usterki.append(f"`{pole}`[{i}] jest typu {type(el).__name__}, oczekiwano tekstu")

    return usterki


def przebieg(korzen: Path) -> int:
    pliki = sorted(korzen.glob("*/SKILL.md")) or sorted(korzen.glob("SKILL.md"))
    if not pliki:
        print(f"Nie znaleziono żadnego SKILL.md w {korzen}", file=sys.stderr)
        return 2

    print("=" * 72)
    print("TEST T26 — PARSOWALNOŚĆ FRONTMATTERU (YAML)")
    print(f"Katalog: {korzen}")
    print("=" * 72)

    zle = 0
    for f in pliki:
        usterki = sprawdz(f)
        nazwa = f.parent.name if f.parent != korzen else f.name
        if usterki:
            zle += 1
            print(f"\n❌ {nazwa}")
            for u in usterki:
                print(f"     {u}")
        else:
            print(f"✅ {nazwa}")

    print("-" * 72)
    if zle:
        print(f"WYNIK T26: ❌ FAIL — {zle} z {len(pliki)} frontmatterów z usterką.")
        print("⛔ Frontmatter, który się nie parsuje, oznacza skill NIEŁADUJĄCY SIĘ")
        print("   na hoście — objaw wygląda jak „stara wersja na dysku\".")
        return 1
    print(f"WYNIK T26: ✅ PASS — {len(pliki)}/{len(pliki)} frontmatterów poprawnych.")
    return 0


# --------------------------------------------------------------------------
# SELFTEST — offline. Każdy przypadek pozytywny ma mutację negatywną.
# --------------------------------------------------------------------------
def selftest(tmp: Path) -> int:
    przypadki = [
        ("poprawny", """---
name: x
inputs:
  - "tekst"
escalation:
  - "a → b"
---
tresc
""", 0),
        # NAWRÓT F-159: ": " w linii kontynuacji elementu listy
        ("F-159 dwukropek w kontynuacji", """---
name: x
escalation:
  - sprawa obca → pomiń ISAP,
    ale NIE pomijaj weryfikacji: view shared/GATES.md
---
tresc
""", 1),
        # NAWRÓT F-146: niesparowany cudzysłów
        ("F-146 niesparowany cudzysłów", """---
name: x
changelog:
  - „3.36: opis zaczęty typograficznie i domknięty prosto"
  - inny
---
tresc
""", 1),
        # ciche zniekształcenie typu — YAML parsuje się, ale element to mapa
        ("mapa zamiast tekstu", """---
name: x
inputs:
  - opcjonalnie: pliki wgrane przez użytkownika
---
tresc
""", 1),
        # mutacja negatywna do poprzedniego: ten sam tekst w cudzysłowie = OK
        ("ten sam zapis ujęty w cudzysłów", """---
name: x
inputs:
  - "opcjonalnie: pliki wgrane przez użytkownika"
---
tresc
""", 0),
        ("brak frontmatteru", "zwykły markdown bez frontmatteru\n", 1),
        # dwukropek w treści BEZ spacji po nim nie jest błędem — YAML go przepuszcza
        # blok `|` w changelog — konwencja shared/, NIE usterka
        ("changelog jako blok |", """---
name: x
changelog: |
  Wersja 3.31: opis z dwukropkiem i „cudzysłowem" — w bloku bez znaczenia
  Wersja 3.30: kolejna linia
---
tresc
""", 0),
        # mutacja negatywna: blok NIE jest wymówką dla pola iterowanego
        ("inputs jako blok | to usterka", """---
name: x
inputs: |
  jedna linia
  druga linia
---
tresc
""", 1),
        ("dwukropek bez spacji jest legalny", """---
name: x
inputs:
  - godzina 12:30 i adres http://example.com
---
tresc
""", 0),
    ]

    ok = 0
    for i, (nazwa, tresc, oczek) in enumerate(przypadki, 1):
        f = tmp / f"case{i}.md"
        f.write_text(tresc, encoding="utf-8")
        usterki = sprawdz(f)
        wynik = 1 if usterki else 0
        if wynik == oczek:
            ok += 1
            szczegol = usterki[0][:60] if usterki else "czysty"
            print(f"  [{i}] PASS  {nazwa:<38} {szczegol}")
        else:
            print(f"  [{i}] FAIL  {nazwa:<38} oczekiwano {oczek}, otrzymano {wynik} "
                  f"({usterki})")

    # Kontrola samego testu: musi znać obie flagi, które go wywołały.
    if "F-146" in __doc__ and "F-159" in __doc__:
        ok += 1
        print(f"  [{len(przypadki)+1}] PASS  docstring wskazuje obie flagi nawrotu")
    else:
        print(f"  [!!] FAIL  docstring nie tłumaczy, po co ten test powstał")

    razem = len(przypadki) + 1
    print(f"\nSELFTEST: {ok}/{razem}")
    return 0 if ok == razem else 1


def main() -> int:
    ap = argparse.ArgumentParser(description="T26 — parsowalność frontmatteru")
    ap.add_argument("--katalog", default=None,
                    help="katalog skilla lub repozytorium skilli (domyślnie: dwa poziomy wyżej)")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()

    if yaml is None:
        print("⛔ BRAK PyYAML — test NIE został wykonany.", file=sys.stderr)
        print("   Zainstaluj: pip install pyyaml --break-system-packages", file=sys.stderr)
        print("   ⛔ Kod 2, nie 0: cicha zgoda udawałaby, że sprawdzono.", file=sys.stderr)
        return 2

    if a.selftest:
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            return selftest(Path(d))

    korzen = Path(a.katalog) if a.katalog else Path(__file__).resolve().parents[2]
    return przebieg(korzen)


if __name__ == "__main__":
    sys.exit(main())
