#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_ramie_kontrolne.py — UNIWERSALNY generator RAMIENIA A (kontrolnego)
dla pomiaru skuteczności DOWOLNEJ bramki.

PO CO ISTNIEJE (F-167, 2026-09-27b)
  Poprzednik `build_ramie_kontrolne_f113.py` miał mapę wycięć ZAKODOWANĄ
  w Pythonie i obejmował wyłącznie pięć bramek B1–B5 z planu F-113. Protokół
  wykonawczy F-113 §6 mówił wprost: „bramki wprowadzone po 2026-08-24 wymagają
  osobnego projektu badania". Skutek: CN-GATE i REM-GATE (F-166/F-167) nie miały
  ŻADNEJ drogi pomiaru, bo dodanie bramki wymagało edycji kodu.

  Ten skrypt odwraca zależność: mapa wycięć jest DANYMI
  (`references/REJESTR-BRAMEK-POMIAR.json`), kod jest stały. Dodanie bramki do
  pomiaru = nowy wpis w rejestrze. Kod pozostaje jedną implementacją — poprzedni
  skrypt jest odtąd cienką nakładką, żeby nie powstała druga kopia logiki
  wycinania (klasa błędu F-115: siedem kopii, żadna nieaktualizowana).

CO ROBI
  1. kopiuje drzewo skilli do katalogu poza repo,
  2. wycina wskazane bramki: pliki kanoniczne, kotwice dosłowne, bloki zakresowe
     oraz ZAMIANY (patrz niżej),
  3. sprząta odwołania po skasowanych plikach,
  4. weryfikuje wynik `ci_check_shared.py` — zerwane odwołanie oznacza, że
     przebieg mierzyłby reakcję na awarię zasobu, nie brak bramki.

⭐ ZAMIANY — czego nie umiał poprzednik
  Sprzątanie odwołań usuwa CAŁE LINIE zawierające nazwę skasowanego pliku.
  Gdy jedna linia wymienia bramkę mierzoną OBOK bramek NIEmierzonych
  (np. lista zasobów leniwie ładowanych), usunięcie linii zabiera także te
  drugie — ramię A różni się wtedy od B o WIĘCEJ niż mierzona bramka.
  Wpis `zamiany` w rejestrze podaje dosłowne stare→nowe brzmienie takiego
  fragmentu. Zamiana jest IDEMPOTENTNA: gdy `stare` już nie występuje, a `nowe`
  występuje, uznaje się ją za wykonaną (inna bramka zdążyła ją zastosować).

⛔ CZEGO TEN SKRYPT NIE ROBI
  Nie uruchamia przebiegów, nie ocenia i nie liczy Δ. Ocena jest ludzka —
  patrz `ocena_transkryptow_f113.py` (świadoma rezygnacja z auto-scoringu)
  i `references/PLAN-POMIARU-BRAMEK-UNIWERSALNY.md` §5 (stopnie oceniającego).

⛔ ZAKAZ URUCHAMIANIA NA DRZEWIE PRODUKCYJNYM
  Skrypt odmawia zapisu wewnątrz drzewa źródłowego. Ramię A jest artefaktem
  testowym i nigdy nie wraca do wydania.

KODY WYJŚCIA
  0 — ramię A zbudowane, brak zerwanych odwołań
  1 — nie wykonano któregoś wycięcia (zmieniła się treść pliku źródłowego)
  2 — błąd użycia
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

REJESTR_DOMYSLNY = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..", "references", "REJESTR-BRAMEK-POMIAR.json")


def wczytaj_rejestr(sciezka):
    with open(sciezka, encoding="utf-8") as f:
        d = json.load(f)
    if "bramki" not in d:
        raise ValueError(f"{sciezka}: brak klucza 'bramki'")
    return d


def wytnij_zakres(tekst, od, do, gdzie):
    i = tekst.find(od)
    if i == -1:
        raise LookupError(f"{gdzie}: nie znaleziono początku bloku {od!r}")
    j = tekst.find(do, i + len(od))
    if j == -1:
        raise LookupError(f"{gdzie}: nie znaleziono końca bloku {do!r}")
    return tekst[:i] + tekst[j:]


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo-root", help="drzewo skilli (ramię B, nietykalne)")
    ap.add_argument("--out", help="katalog docelowy ramienia A")
    ap.add_argument("--bramki", help="które bramki wyciąć, np. CN,REM (bez wartości → błąd)")
    ap.add_argument("--rejestr", default=REJESTR_DOMYSLNY,
                    help="plik rejestru bramek (domyślnie references/REJESTR-BRAMEK-POMIAR.json)")
    ap.add_argument("--lista", action="store_true", help="wypisz bramki dostępne w rejestrze i wyjdź")
    ap.add_argument("--force", action="store_true", help="nadpisz istniejący katalog wyjściowy")
    a = ap.parse_args()

    try:
        rejestr = wczytaj_rejestr(a.rejestr)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(f"BŁĄD rejestru: {e}", file=sys.stderr)
        return 2
    BRAMKI = rejestr["bramki"]

    if a.lista:
        print(f"REJESTR: {os.path.abspath(a.rejestr)}  (wersja {rejestr.get('wersja','?')})")
        for k, v in BRAMKI.items():
            print(f"  {k:<4} {v.get('opis','')}")
        return 0

    if not a.repo_root or not a.out or not a.bramki:
        print("BŁĄD: wymagane --repo-root, --out i --bramki (albo --lista)", file=sys.stderr)
        return 2

    src = os.path.abspath(a.repo_root)
    out = os.path.abspath(a.out)
    if not os.path.isdir(src):
        print(f"BŁĄD: {src} nie istnieje", file=sys.stderr)
        return 2
    if out == src or out.startswith(src + os.sep):
        print("⛔ ODMOWA: katalog wyjściowy leży wewnątrz drzewa źródłowego.\n"
              "   Ramię A jest artefaktem testowym i nie może powstać w drzewie wydania.",
              file=sys.stderr)
        return 2
    if os.path.exists(out):
        if not a.force:
            print(f"BŁĄD: {out} istnieje (użyj --force)", file=sys.stderr)
            return 2
        shutil.rmtree(out)

    shutil.copytree(src, out)
    wybrane = [b.strip() for b in a.bramki.split(",") if b.strip()]
    print("=" * 72)
    print("RAMIĘ A (kontrolne)")
    print(f"źródło:  {src}")
    print(f"cel:     {out}")
    print(f"rejestr: {os.path.abspath(a.rejestr)} (wersja {rejestr.get('wersja','?')})")
    print(f"bramki wycinane: {', '.join(wybrane)}")
    print("=" * 72)

    bledy = []
    for b in wybrane:
        if b not in BRAMKI:
            bledy.append(f"{b}: nieznana bramka (dostępne: {', '.join(BRAMKI)})")
            continue
        spec = BRAMKI[b]
        print(f"\n── {b} — {spec.get('opis','')} ──")

        for rel in spec.get("usun_pliki", []):
            p = os.path.join(out, rel)
            if os.path.exists(p):
                os.remove(p)
                print(f"   usunięto plik:  {rel}")
            else:
                bledy.append(f"{b}: brak pliku {rel}")

        for rel, kotwica in spec.get("kotwice", []):
            p = os.path.join(out, rel)
            t = open(p, encoding="utf-8").read()
            n = t.count(kotwica)
            if n != 1:
                bledy.append(f"{b}: kotwica w {rel} wystąpiła {n}× (oczekiwano 1)")
                continue
            open(p, "w", encoding="utf-8").write(t.replace(kotwica, ""))
            print(f"   wycięto kotwicę w: {rel}")

        for rel, od, do in spec.get("zakresy", []):
            p = os.path.join(out, rel)
            t = open(p, encoding="utf-8").read()
            try:
                open(p, "w", encoding="utf-8").write(wytnij_zakres(t, od, do, rel))
                print(f"   wycięto blok w:    {rel}")
            except LookupError as e:
                bledy.append(f"{b}: {e}")

        for rel, stare, nowe in spec.get("zamiany", []):
            p = os.path.join(out, rel)
            t = open(p, encoding="utf-8").read()
            n = t.count(stare)
            if n == 1:
                open(p, "w", encoding="utf-8").write(t.replace(stare, nowe))
                print(f"   zamiana w:         {rel}")
            elif n == 0 and nowe and nowe in t:
                print(f"   zamiana już wykonana (idempotentnie): {rel}")
            else:
                bledy.append(f"{b}: zamiana w {rel} — 'stare' wystąpiło {n}× "
                             f"(oczekiwano 1), a 'nowe' nieobecne")

    # ------------------------------------------------------------------
    # SPRZĄTANIE ODWOŁAŃ — bez tego kroku ramię A jest bezużyteczne.
    # Skill z zerwanym odwołaniem wchodzi w ⛔ TRYB ZDEGRADOWANY (fail-closed),
    # więc przebieg mierzyłby reakcję na AWARIĘ ZASOBU, nie brak bramki.
    # Pomiar 2026-09-10: 3 skasowane pliki → 43 zerwane odwołania w 57 plikach.
    # Historii (CHANGELOG, AUDIT-JOURNAL) NIE ruszamy — to ślad audytowy.
    # ------------------------------------------------------------------
    usuniete = [os.path.basename(r) for b in wybrane if b in BRAMKI
                for r in BRAMKI[b].get("usun_pliki", [])]
    if usuniete:
        print("\n── sprzątanie odwołań po skasowanych plikach ──")
        POMIN = ("CHANGELOG.md", "HISTORIA-ZMIAN-PLIKOW.md", "AUDIT-JOURNAL.md", "WARN-OTWARTE.md")
        zmienione = wyciete_linie = 0
        for korzen, _, pliki in os.walk(out):
            for nazwa in pliki:
                if not nazwa.endswith(".md") or nazwa in POMIN:
                    continue
                sciezka = os.path.join(korzen, nazwa)
                tresc = open(sciezka, encoding="utf-8").read()
                if not any(u in tresc for u in usuniete):
                    continue
                linie = tresc.split("\n")
                zostaw = [l for l in linie if not any(u in l for u in usuniete)]
                if len(zostaw) != len(linie):
                    open(sciezka, "w", encoding="utf-8").write("\n".join(zostaw))
                    zmienione += 1
                    wyciete_linie += len(linie) - len(zostaw)
        print(f"   plików poprawionych: {zmienione}, linii usuniętych: {wyciete_linie}")

    # ------------------------------------------------------------------
    # ⭐ KONTROLA RESZTKOWA NAZW KRÓTKICH (F-167, 2026-09-27b)
    #
    # Sprzątanie wyżej usuwa linie zawierające NAZWĘ PLIKU bramki. Nie widzi
    # linii, które wołają bramkę jej nazwą krótką („CN-GATE", „REM-3") ani —
    # co gorsze — fragmentów odtwarzających JEJ LOGIKĘ w innym module.
    # Zmierzone przy pierwszej budowie ramienia CN/REM: po pełnym sprzątaniu
    # w drzewie zostało 11 plików z nazwami krótkimi, w tym dwa bloki
    # odtwarzające treść CN-2 i CN-3 w liście kontrolnej MG. Ramię A z takim
    # ogonem zachowuje bramkę i pomiar mierzy różnicę mniejszą niż rzeczywista.
    #
    # Skrypt NIE usuwa tych miejsc automatycznie — nie umie odróżnić wzmianki
    # incydentalnej od treści bramki. Przerywa i wypisuje listę: decyzję
    # podejmuje człowiek i zapisuje ją w rejestrze (zamiana albo
    # `dopuszczone_wzmianki` z uzasadnieniem).
    # ------------------------------------------------------------------
    nazwy = []
    dopuszczone = set()
    for b in wybrane:
        if b in BRAMKI:
            nazwy += BRAMKI[b].get("nazwy_krotkie", [])
            dopuszczone |= set(BRAMKI[b].get("dopuszczone_wzmianki", []))
    if nazwy:
        print("\n── kontrola resztkowa nazw krótkich ──")
        print(f"   szukane: {', '.join(nazwy)}")
        pomijane = rejestr.get("pomijane_w_skanie", [])
        resztki = []
        for korzen, _, pliki in os.walk(out):
            for nazwa in pliki:
                if not nazwa.endswith(".md"):
                    continue
                sciezka = os.path.join(korzen, nazwa)
                rel = os.path.relpath(sciezka, out)
                if any(pom in rel or rel.endswith(pom) for pom in pomijane):
                    continue
                if rel in dopuszczone:
                    continue
                for nr, linia in enumerate(open(sciezka, encoding="utf-8"), 1):
                    for nk in nazwy:
                        if nk in linia:
                            resztki.append(f"{rel}:{nr}: {linia.strip()[:90]}")
                            break
        if resztki:
            print(f"   ⛔ pozostało {len(resztki)} wystąpień:")
            for r in resztki[:25]:
                print(f"      {r}")
            if len(resztki) > 25:
                print(f"      … i {len(resztki)-25} dalszych")
            bledy.append(f"kontrola resztkowa: {len(resztki)} wystąpień nazw krótkich "
                         "bramki w ramieniu A — dopisz zamianę albo `dopuszczone_wzmianki` "
                         "z uzasadnieniem do rejestru")
        else:
            print("   ✅ brak resztek")

    print("\n" + "=" * 72)
    print("KONTROLA INTEGRALNOŚCI RAMIENIA A")
    ci = os.path.join(out, "audyt-systemu-v4", "scripts", "ci_check_shared.py")
    if os.path.exists(ci):
        r = subprocess.run([sys.executable, ci, "--repo-root", out],
                           capture_output=True, text=True)
        ogon = [l for l in r.stdout.strip().split("\n") if l.startswith("WYNIK")]
        print("   ci_check_shared:", ogon[0] if ogon else f"kod {r.returncode}")
        if r.returncode != 0:
            bledy.append("ci_check_shared: zerwane odwołania w ramieniu A — "
                         "przebieg zmierzyłby reakcję na awarię zasobu, nie brak bramki")
    else:
        print("   ⚠️ ci_check_shared.py niedostępny — kontrola pominięta")

    print("=" * 72)
    if bledy:
        print("\n⛔ NIEPOWODZENIE — ramię A NIE nadaje się do przebiegu:")
        for e in bledy:
            print(f"   • {e}")
        print("\nNajczęstsza przyczyna: treść bramki zmieniła się od ostatniej edycji\n"
              "rejestru. Popraw REJESTR-BRAMEK-POMIAR.json, nigdy drzewo produkcyjne.")
        return 1

    print("\n✅ RAMIĘ A GOTOWE.")
    print("   Dalej: references/PLAN-POMIARU-BRAMEK-UNIWERSALNY.md, sekcja „Karta przebiegu”.")
    print("   ⛔ Nie wgrywaj tego drzewa jako wydania — to artefakt testowy.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
