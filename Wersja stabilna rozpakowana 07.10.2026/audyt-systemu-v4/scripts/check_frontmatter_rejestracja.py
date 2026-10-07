#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T22 — check_frontmatter_rejestracja.py
Samo-rejestracja frontmatteru: czy każdy plik w `modules/`, `references/`,
`scripts/` i `widgets/` ma wpis w odpowiedniej liście YAML swojego SKILL.md.

PO CO ISTNIEJE (flaga F-147, 2026-09-01)
  System miał 21 testów i ANI JEDNEGO na rejestrację własnych zasobów skilla
  narzędziowego. `check_rejestracja_modulow.py` pilnuje wyłącznie modułów DR
  (4 rejestry dziedzinowe), a `ci_check_shared.py` widzi tylko odwołania
  ZERWANE — plik obecny na dysku, lecz nieobecny w rejestrze, jest dla niego
  stanem najzdrowszym. Ten sam wzorzec ślepoty co F-130 (brak `description:`
  raportowany jako `0` = ✅) i F-145 (plik bez wpisu w CHECKSUMS).

  Przypadek referencyjny, który wymusił ten test: w `audyt-systemu-v4/SKILL.md`
  wpis `- scripts/check_coverage_coherence.py` był doklejony do komentarza
  poprzedniej pozycji LITERALNYM dwuznakiem `\\n` (backslash + n, nie znak
  nowej linii). Parser YAML widział wtedy JEDEN element listy z bardzo długim
  komentarzem, więc T18 — test o priorytecie KRYTYCZNY — fizycznie istniał,
  był wywoływany przez orkiestrator i przez ~5 dni NIE figurował w rejestrze
  `scripts:`. Żaden istniejący test tego nie widział, bo plik istniał, a
  odwołanie nie było zerwane — było go po prostu NIE MA.

CO SPRAWDZA
  A. frontmatter daje się wyodrębnić (otwarcie i zamknięcie `---`);
  B. w obrębie frontmatteru nie występuje literalny dwuznak `\\n` — to
     bezpośrednia przyczyna źródłowa F-147, niewidoczna w renderze;
  C. dla KAŻDEGO klucza listowego (`modules`/`references`/`scripts`/`widgets`),
     który skill w ogóle deklaruje i któremu odpowiada istniejący katalog:
     każdy plik z tego katalogu ma wpis, a każdy wpis ma plik na dysku;
  D. (od 6.158, F-223; tryb kopii od 6.159) lista zapisana BEZ WCIĘCIA (`- pozycja` w kolumnie 0)
     — sygnatura frontmatteru przepisanego serializatorem YAML. Host claude.ai
     robi to przy imporcie z marketplace (F-221: 32/32 `SKILL.md` kopii
     zainstalowanej ≠ `main`; komentarze YAML usunięte, skalary blokowe zamienione
     na ciągi z literalnym `\\n`). Zamiast ~100 fałszywych „BRAK WPISU” test
     zgłasza wtedy JEDEN błąd na klucz i wskazuje przyczynę. Wydanie 6.157
     zbudowano z takiej kopii: −181 linii frontmatteru, T22 na `main` 6 → 113.

ZAKRES ŚWIADOMIE WĄSKI
  Skill, który danego klucza NIE deklaruje, nie jest sprawdzany pod tym kluczem.
  Test pilnuje SPÓJNOŚCI zadeklarowanego rejestru, nie narzuca obowiązku
  prowadzenia rejestru. Katalogi ukryte, `__pycache__`, `.pyc` i archiwa `.zip`
  są pomijane — tak samo jak w T21.

⛔ CZEGO NIE ROZSTRZYGA
  Obecność wpisu nie dowodzi, że plik jest używany, poprawny ani aktualny.
  Test odpowiada wyłącznie na pytanie „czy rejestr i dysk mówią to samo".

KODY WYJŚCIA
  0 — brak rozjazdów
  1 — rozjazdy (literalny `\\n`, plik bez wpisu, wpis bez pliku)
  2 — nie znaleziono żadnego SKILL.md w podanym katalogu
"""

import argparse
import os
import re
import sys

KLUCZE = ("modules", "references", "scripts", "widgets")
EXCLUDE_NAMES = {"__pycache__", "CHECKSUMS.sha256"}
EXCLUDE_SUFFIX = (".pyc", ".zip")


def frontmatter(tresc):
    """Zwraca tekst frontmatteru albo None. Bez PyYAML — pozostałe skrypty
    systemu też chodzą na czystej bibliotece standardowej."""
    if not tresc.startswith("---"):
        return None
    czesci = tresc.split("---", 2)
    if len(czesci) < 3:
        return None
    return czesci[1]


def wpisy_klucza(fm, klucz):
    """Elementy listy YAML `klucz:` — bez komentarzy, bez cudzysłowów.
    Zwraca None, gdy skill w ogóle tego klucza nie deklaruje."""
    m = re.search(r"^%s:[ \t]*$" % re.escape(klucz), fm, re.M)
    if not m:
        return None
    reszta = fm[m.end():]
    out = []
    for linia in reszta.splitlines()[1:] if False else reszta.splitlines():
        if not linia.strip():
            continue
        if re.match(r"^\s*#", linia):
            continue
        m_el = re.match(r"^\s+-\s+(.*)$", linia)
        if m_el:
            wartosc = m_el.group(1).split("#")[0].strip().strip("\"'")
            if wartosc:
                out.append(wartosc.rstrip("/"))
            continue
        if re.match(r"^\s+#", linia) or re.match(r"^\s{2,}\S", linia):
            # linia kontynuacji komentarza wielolinijkowego albo zagnieżdżona
            continue
        break
    return out


def lista_bez_wciecia(fm, klucz):
    """Liczba pozycji `- x` w kolumnie 0 bezpośrednio pod `klucz:` (F-223)."""
    m = re.search(r"^%s:[ \t]*$" % re.escape(klucz), fm, re.M)
    if not m:
        return 0
    n = 0
    for linia in fm[m.end():].splitlines():
        if not linia.strip():
            continue
        if re.match(r"^-\s+\S", linia):
            n += 1
            continue
        break
    return n


def pliki_katalogu(katalog):
    out = []
    for base, dirs, names in os.walk(katalog):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_NAMES and not d.startswith(".")]
        for n in names:
            if n.startswith(".") or n in EXCLUDE_NAMES or n.endswith(EXCLUDE_SUFFIX):
                continue
            out.append(os.path.relpath(os.path.join(base, n), katalog))
    return sorted(out)


def sprawdz_skill(root, nazwa, kopia=False):
    sciezka = os.path.join(root, nazwa, "SKILL.md")
    with open(sciezka, encoding="utf-8") as fh:
        tresc = fh.read()

    problemy = []
    fm = frontmatter(tresc)
    if fm is None:
        problemy.append("⛔ FRONTMATTER: brak lub niedomknięty blok `---` w SKILL.md")
        print("--- {} ---".format(nazwa))
        for p in problemy:
            print("  " + p)
        return len(problemy)

    info = []
    for nr, linia in enumerate(fm.splitlines(), start=2):
        if "\\n" in linia and kopia:
            info.append("ℹ️ literalny `\\n`, linia {} — forma hosta (F-221), nie usterka repozytorium".format(nr))
            continue
        if "\\n" in linia:
            problemy.append(
                "⛔ LITERALNY `\\n` W YAML, linia {}: {}…  — sklejone wpisy listy; "
                "parser widzi JEDEN element, kolejny wypada z rejestru "
                "(przyczyna źródłowa F-147)".format(nr, linia.strip()[:90])
            )

    for klucz in KLUCZE:
        wpisy = wpisy_klucza(fm, klucz)
        if wpisy is None:
            continue
        bez_wciecia = lista_bez_wciecia(fm, klucz)
        if not wpisy and bez_wciecia and kopia:
            info.append("ℹ️ lista `{}:` bez wcięcia ({} poz.) — forma hosta (F-221); "
                        "rejestr sprawdź na repozytorium".format(klucz, bez_wciecia))
            continue
        if not wpisy and bez_wciecia:
            problemy.append(
                "⛔ LISTA `{}:` BEZ WCIĘCIA ({} poz. w kolumnie 0) — frontmatter przepisany "
                "serializatorem YAML (kopia zainstalowana przez hosta? F-221/F-223); "
                "NIE wydawaj z tego pliku — odtwórz SKILL.md z repozytorium".format(klucz, bez_wciecia)
            )
            continue
        katalog = os.path.join(root, nazwa, klucz)
        if not os.path.isdir(katalog):
            continue
        zarejestrowane = {os.path.basename(w) for w in wpisy}
        # wpisy katalogowe (np. `references/raporty-.../`) pokrywają swoją zawartość
        prefiksy = [w for w in wpisy if os.path.isdir(os.path.join(root, nazwa, w))]
        na_dysku = pliki_katalogu(katalog)

        brak_wpisu = []
        for f in na_dysku:
            if os.path.basename(f) in zarejestrowane:
                continue
            pelna = "{}/{}".format(klucz, f)
            if any(pelna.startswith(pref.rstrip("/") + "/") for pref in prefiksy):
                continue
            brak_wpisu.append(f)

        brak_pliku = [
            w for w in wpisy
            if w.startswith(klucz + "/")
            and not os.path.exists(os.path.join(root, nazwa, w))
        ]

        for f in brak_wpisu:
            problemy.append(
                "⛔ BRAK WPISU w `{}:` — plik istnieje, rejestru nie ma: {}/{}".format(
                    klucz, klucz, f)
            )
        for w in brak_pliku:
            problemy.append(
                "⛔ BRAK PLIKU — wpis `{}:` wskazuje nieistniejący: {}".format(klucz, w)
            )

    if problemy or info:
        print("--- {} ---".format(nazwa))
        for p in problemy + info:
            print("  " + p)
    return len(problemy)


def main():
    ap = argparse.ArgumentParser(description="T22 — samo-rejestracja frontmatteru")
    ap.add_argument("repo_root", nargs="?", default=None)
    ap.add_argument("--repo-root", dest="repo_root_opt", default=None)
    ap.add_argument("--selftest", action="store_true")
    tryb = ap.add_mutually_exclusive_group()
    tryb.add_argument("--kopia-zainstalowana", action="store_true",
                      help="forma frontmatteru nadana przez hosta → ℹ️, nie ⛔ (F-221)")
    tryb.add_argument("--repozytorium", action="store_true", help="tryb ścisły (domyślny poza układem plugin:skill)")
    args = ap.parse_args()
    if args.selftest:
        fm_ok = "\nmodules:\n  - modules/A.md   # opis\n"
        fm_zle = "\nmodules:\n- modules/A.md\n"
        ok = (wpisy_klucza(fm_ok, "modules") == ["modules/A.md"]
              and lista_bez_wciecia(fm_ok, "modules") == 0
              and wpisy_klucza(fm_zle, "modules") == []
              and lista_bez_wciecia(fm_zle, "modules") == 1)
        print("SELFTEST T22: {} (lista wcięta / bez wcięcia — F-223)".format("OK" if ok else "FAIL"))
        return 0 if ok else 1

    root = args.repo_root or args.repo_root_opt \
        or os.environ.get("LEX_MACHINA_ROOT") or os.environ.get("REPO_ROOT") \
        or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
    root = os.path.abspath(root)
    kopia = args.kopia_zainstalowana or (not args.repozytorium and any(
        ":" in d for d in os.listdir(root) if os.path.isdir(os.path.join(root, d))))

    print("=" * 72)
    print("TEST T22 — SAMO-REJESTRACJA FRONTMATTERU (modules/references/scripts/widgets)")
    print("Katalog: {}".format(root))
    print("Tryb: {}".format("KOPIA ZAINSTALOWANA (F-221) — forma frontmatteru hosta raportowana jako ℹ️; "
                             "WYNIK NIE ZASTĘPUJE T22 NA REPOZYTORIUM" if kopia else "REPOZYTORIUM (ścisły)"))
    print("=" * 72)

    skille = [n for n in sorted(os.listdir(root))
              if os.path.isfile(os.path.join(root, n, "SKILL.md"))]
    if not skille:
        print("Nie znaleziono żadnego SKILL.md — sprawdź katalog.")
        return 2

    total = 0
    for nazwa in skille:
        total += sprawdz_skill(root, nazwa, kopia)

    print("-" * 72)
    print("Skilli sprawdzonych: {}   rozjazdów łącznie: {}".format(len(skille), total))
    if total == 0:
        print("WYNIK T22: ✅ PASS — każdy zadeklarowany rejestr zgodny z dyskiem.")
        return 0
    print("WYNIK T22: ❌ FAIL — rejestr i dysk mówią co innego.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
