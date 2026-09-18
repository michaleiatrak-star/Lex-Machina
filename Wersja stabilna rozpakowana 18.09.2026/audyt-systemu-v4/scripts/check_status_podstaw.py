#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_status_podstaw.py — TEST T27

PYTANIE, NA KTÓRE ODPOWIADA
  Czy numer Dz.U. podany w korpusie **jako aktualna podstawa prawna** opisuje
  normę, którą wolno dziś stosować? Dwie klasy naruszeń, lustrzane wobec siebie:

    MARTWY      — status „wygaśnięcie aktu" / „uchylony"  (O-9, F-181)
    PRZEDWCZESNY — status „obowiązujący", ale `entryIntoForce` w przyszłości,
                   czyli akt w vacatio legis                (O-10)

PO CO ISTNIEJE (flagi O-9 i F-181, 2026-09-10)
  Cztery ostatnie sesje audytowe pokazały jeden wzorzec: **każde miejsce,
  w którym system mówi coś o akcie zamiast tylko go cytować, jest poza zasięgiem
  testów.** Numer w wierszu mapy pilnują cztery testy; ten sam numer w zdaniu
  „aktualne t.j.: …" — żaden.

  | Test | Pyta o | Dlaczego milczy na tę klasę |
  |------|--------|------------------------------|
  | T3   | zgodność numerów między mapami | zdanie w module nie jest wierszem mapy |
  | T11  | obecność numeru w mapie centralnej | numery są obecne, tylko martwe |
  | T15  | tożsamość aktu i nowszy t.j. | działa na `maps` i `operational`, nie na prozie |
  | T24  | nowelizacje po tekście jednolitym | pyta o zmiany PO t.j., nie czy t.j. żyje |

  Pomiar 2026-09-10: 424 numery w 1903 miejscach; **61 miejsc** podawało jako
  aktualną podstawę tekst jednolity o statusie „wygaśnięcie aktu" lub „uchylony".
  Dwie trzecie w `shared/orka-bas-leksykon`, który cytuje podstawy w TREŚCI
  definicji — przez co omijały go wszystkie przeglądy zorientowane na nagłówki.

⛔ CZEGO TEN TEST NIE ROZSTRZYGA — CZYTAJ, ZANIM UŻYJESZ WYNIKU

  1. **Wygasły numer NIE jest sam w sobie błędem.** Rejestr wolno — i powinien —
     wymieniać numery historyczne („poprzedni t.j.: …", opis łańcucha wersji,
     wpis w raporcie audytowym). Test odsiewa takie konteksty heurystycznie
     i ROBI TO NIEDOSKONALE.

  2. **Heurystyka tego badania dwukrotnie zawyżyła wynik.** Pierwszy przebieg
     na nagłówkach dał „29 przeterminowanych"; po przeczytaniu kontekstu linia
     po linii zostało 13. Dlatego T27 raportuje `⚠️ DO PRZEGLĄDU`, a nie `FAIL`,
     i kończy się kodem 0. Flaga `--strict` zmienia to na kod 1 — używać tylko
     tam, gdzie ktoś faktycznie przejrzy listę.

  3. **Kolumna „aktualny t.j." to wskazówka, nie rozstrzygnięcie.** Algorytm
     „weź najnowszy tekst jednolity aktu bazowego" zawodzi tam, gdzie akt bazowy
     przestał obowiązywać. Zmierzony przypadek: dochody JST — wskazany
     „aktualny" t.j. `2024/356` sam jest uchylony, bo starą ustawę zastąpiła
     nowa (`2024/1572`). Podstawienie wprost z raportu przesunęłoby błąd
     o jedno ogniwo dalej.

  4. **Test nie porównuje tytułów.** Od tego jest T15. W tej serii siedem razy
     okazało się, że pod numerem stoi inny akt, niż głosi opis — przy naprawie
     porównanie tytułu jest obowiązkowe niezależnie od wyniku T27.

WYMAGA SIECI — API ELI. Dlatego test jest w `references/SKRYPTY-RECZNE.md`,
nie w orkiestratorze: w przebiegu bez sieci dawałby FAIL środowiskowy
nieodróżnialny od merytorycznego (ta sama klasa problemu co O-5).

UŻYCIE
  python3 check_status_podstaw.py --repo-root .              # pełny przebieg
  python3 check_status_podstaw.py --repo-root . --cache c.json   # zapisz odczyty
  python3 check_status_podstaw.py --repo-root . --cache c.json --offline
  python3 check_status_podstaw.py --repo-root . --strict     # kod 1 przy trafieniach

KODY WYJŚCIA
  0 — przebieg zakończony (także gdy są trafienia — patrz punkt 2 wyżej)
  1 — trafienia przy --strict, albo brak odpowiedzi API dla części numerów
  2 — błąd użycia lub brak katalogu
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.request
from pathlib import Path

API = "https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}"

# Numer Dz.U. w obu formatach: „Dz.U. 2026 poz. 490" i „Dz.U. 1991 nr 22 poz. 91"
NUMER = re.compile(r"Dz\.U\.\s*(\d{4})(?:\s*nr\s*\d+)?\s*poz\.\s*(\d+)")

# Linia mówi o tekście jednolitym — bez tego numer bywa zwykłym powołaniem aktu
TJ = re.compile(r"t\.?\s?j\.?|tekst[a-ząćęłńóśźż]*\s+jednolit", re.I)

# ⛔ Kontekst historyczny. Ta lista jest SERCEM czułości testu i powstała
#    z ręcznego przeglądu 75 trafień. Każde dodane słowo zmniejsza liczbę
#    fałszywych alarmów i zwiększa ryzyko przeoczenia — zmieniać świadomie.
HISTORYCZNY = re.compile(
    r"poprzedni|poprzednio|dotychczas|wyga[sś]|uchylon|zast[ąa]pion|historyczn|pierwotn|podmian|"
    r"archiw|błędn|bledn|SKORYGOWAN|dawn[ya]|PREV|NIEAKTUAL|nieaktual|"
    r"sprawdź nowszy|nie mylić|→ nowy|-> nowy",
    re.I,
)

# Pliki, w których wygasłe numery są treścią, nie podstawą: dziennik audytów,
# changelogi, rejestry flag, generacje map, raporty z pomiarów.
POMIJANE_NAZWY = {
    "AUDIT-JOURNAL.md", "CHANGELOG.md", "WARN-OTWARTE.md",
    "ALIASY-NAZW-AKTOW.md", "CHECKLIST-DEDUP.md",
}
POMIJANE_WZORCE = ("mapa_dzu_", "F-108-verification", "F-135-cross-check",
                   "F-152-pomiar", "F-171-pomiar", "PRZETERMINOWANE-TJ",
                   "raport-pokrycia", "ISAP-METRYKI")

# Linia sama podaje cezurę czasową — wtedy vacatio legis jest OBSŁUŻONE, nie pominięte.
CEZURA = re.compile(r"w\s+życie|wchodzi\s+w\s+życie|vacatio|od\s+\d{1,2}[.\-/]\d{1,2}[.\-/]20\d\d|"
                    r"sprawdzać\s+wejście\s+w\s+życie|entryIntoForce", re.I)
# Numer stoi w WYLICZENIU ZMIAN, nie jako podstawa — inna waga sygnału.
WYLICZENIE = re.compile(r"ze\s+zm\.|zmian[yi]|nowelizacj", re.I)

MARTWE = {"wygaśnięcie aktu", "uchylony", "uznany za uchylony", "nieobowiązujący"}
# O-11(c), 2026-09-16e — trzecia klasa: numer aktu PIERWOTNEGO albo aktu ZMIENIAJĄCEGO,
# który ELI oznacza jako zastąpiony tekstem jednolitym, a który stoi jako aktualna
# podstawa. Zmierzone przypadki: rozporządzenie MS o Funduszu Sprawiedliwości cytowane
# jako `2017/1760` przy t.j. `2025/1298`; rozporządzenie MKiŚ `2024/1284` („akt objęty
# tekstem jednolitym") jako rzekomy t.j. ustawy. Sygnał słabszy niż MARTWY — brzmienie
# pierwotne bywa cytowane świadomie (data aktu, przepisy przejściowe).
ZASTAPIONE_TJ = {"akt posiada tekst jednolity", "akt objęty tekstem jednolitym"}

# ⛔ DRUGA KLASA, LUSTRZANA — flaga O-10, dodana 2026-09-10r.
#   Akt o statusie „obowiązujący", którego data wejścia w życie jest w PRZYSZŁOŚCI,
#   jest w vacatio legis: istnieje, ale jego normy jeszcze nie stosuje się.
#   Zmierzony przypadek (AUDYT-2026-09-10q): reforma antymobbingowa 2026/1046
#   opisana w zasobie kanonicznym `shared` jako stan obowiązujący od 30.07.2026
#   (data PODPISU), podczas gdy entryIntoForce = 2026-11-05.
#
#   ⚠️ Ta klasa jest CIĘŻSZA od martwego numeru. Martwy numer zwykle prowadzi do
#   tekstu, który da się rozpoznać jako stary. Norma w vacatio legis wygląda na
#   aktualną i bywa cytowana z pełnym przekonaniem — bo `status` jest zdrowy.
#
#   ⛔ „status: obowiązujący" w ELI znaczy tylko tyle, że akt NIE ZOSTAŁ UCHYLONY.
#   O stosowaniu rozstrzyga osobne pole `entryIntoForce`.


def pobierz(rok, poz, proby=3):
    for _ in range(proby):
        try:
            with urllib.request.urlopen(API.format(rok=rok, poz=poz), timeout=25) as r:
                tekst = r.read().decode("utf-8")
                if tekst.strip():
                    return json.loads(tekst)
        except Exception:
            pass
        time.sleep(1.5)
    return None


def zbierz(root: Path):
    """Zwraca {'rok/poz': [(ścieżka, nr_linii, treść), …]} — tylko konteksty
    wyglądające na deklarację AKTUALNEJ podstawy."""
    kand, odsiane = {}, 0
    for sciezka in root.rglob("*.md"):
        nazwa = sciezka.name
        if nazwa in POMIJANE_NAZWY or any(w in nazwa for w in POMIJANE_WZORCE):
            continue
        try:
            linie = sciezka.read_text(encoding="utf-8").split("\n")
        except Exception:
            continue
        for i, linia in enumerate(linie, 1):
            if not TJ.search(linia):
                continue
            trafienia = NUMER.findall(linia)
            if not trafienia:
                continue
            # ⛔ Kontekst czyta się w OKNIE, nie w jednej linii. Zmierzone
            #    2026-09-10p: adnotacja korygująca rozkłada się na 2–3 linie
            #    („poprzedni zapis …" w jednej, numer w następnej), więc badanie
            #    samej linii dawało fałszywy alarm na **własnych naprawach**.
            #    Okno ±2 wiersze pokrywa typową adnotację i cenę tę płaci się
            #    ryzykiem przeoczenia numeru sąsiadującego z cudzą adnotacją.
            okno = "\n".join(linie[max(0, i - 3): i + 2])
            if HISTORYCZNY.search(okno):
                odsiane += len(trafienia)
                continue
            pary = [(int(a), int(b)) for a, b in trafienia]
            for rok, poz in pary:
                # numer nowszy w tej samej linii = ten stoi tam jako historyczny
                if any(p > (rok, poz) for p in pary):
                    odsiane += 1
                    continue
                rel = str(sciezka.relative_to(root))
                # ⛔ Pełna linia, nie wycinek. Pierwsza wersja zapisywała
                #   `linia.strip()[:150]` i dopasowywała cezurę do WYCINKA —
                #   w wierszach map cezura stoi często za 150. znakiem, więc
                #   test zgłaszał jako brak czegoś, co w pliku było.
                #   Skracamy dopiero przy WYŚWIETLANIU.
                kand.setdefault(f"{rok}/{poz}", []).append((rel, i, linia.strip()))
    return kand, odsiane


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo-root", default=".")
    ap.add_argument("--cache", help="plik JSON z odczytanymi statusami")
    ap.add_argument("--offline", action="store_true",
                    help="nie odpytuj API — użyj wyłącznie cache")
    ap.add_argument("--strict", action="store_true",
                    help="kod wyjścia 1 przy trafieniach (tylko gdy ktoś je przejrzy)")
    a = ap.parse_args()

    root = Path(a.repo_root).resolve()
    if not root.is_dir():
        print(f"BŁĄD: {root} nie istnieje", file=sys.stderr)
        return 2

    print("=" * 72)
    print("TEST T27 — STATUS PODSTAW PRAWNYCH W PROZIE KORPUSU (O-9 / F-181)")
    print(f"Katalog: {root}")
    print("=" * 72)

    kand, odsiane = zbierz(root)
    miejsc = sum(len(v) for v in kand.values())
    print(f"\nnumerów podanych jako aktualna podstawa : {len(kand)}")
    print(f"miejsc                                  : {miejsc}")
    print(f"odsianych jako kontekst historyczny     : {odsiane}")

    cache = {}
    if a.cache and os.path.isfile(a.cache):
        cache = json.load(open(a.cache, encoding="utf-8"))
        print(f"cache wczytany                          : {len(cache)} pozycji")

    brak_odp = []
    for i, poz in enumerate(sorted(kand)):
        if poz in cache:
            continue
        if a.offline:
            brak_odp.append(poz)
            continue
        rok, nr = poz.split("/")
        d = pobierz(rok, nr)
        if d is None:
            brak_odp.append(poz)
            cache[poz] = {"status": "BRAK_ODPOWIEDZI", "tytul": ""}
        else:
            cache[poz] = {"status": d.get("status", ""), "tytul": d.get("title", "")[:110],
                          "wejscie": d.get("entryIntoForce", "")}
        if i % 50 == 0 and i:
            print(f"  … odczytano {i}/{len(kand)}", file=sys.stderr)

    if a.cache:
        json.dump(cache, open(a.cache, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    trafienia = {p: v for p, v in kand.items()
                 if cache.get(p, {}).get("status") in MARTWE}
    n_miejsc = sum(len(v) for v in trafienia.values())

    # O-10: numery, których data wejścia w życie jeszcze nie nadeszła
    dzis = time.strftime("%Y-%m-%d")
    przedwczesne, bez_cezury, bez_daty = {}, {}, 0
    for p, v in kand.items():
        c = cache.get(p, {})
        if c.get("status") in MARTWE:
            continue
        w = c.get("wejscie")
        if w is None:
            bez_daty += 1
        elif w and w > dzis:
            # ⛔ Rozróżnienie wprowadzone 2026-09-10r po pierwszym przebiegu O-10,
            #   który dał 16 trafień, z czego większość NIE była błędem:
            #   linia albo sama podawała cezurę („w życie 1.10.2026"), albo
            #   wymieniała numer w wyliczeniu zmian, nie jako podstawę.
            #   Ta sama lekcja co przy 1.0/1.1 listy F-181 — nie ogłaszać
            #   liczby przed przeczytaniem kontekstu.
            for rel, ln, tresc in v:
                if CEZURA.search(tresc):
                    continue                      # cezura podana — obsłużone
                cel = bez_cezury if WYLICZENIE.search(tresc) else przedwczesne
                cel.setdefault(p, []).append((rel, ln, tresc))
    n_przedw = sum(len(v) for v in przedwczesne.values())
    zastapione = {p: v for p, v in kand.items()
                  if cache.get(p, {}).get("status") in ZASTAPIONE_TJ}
    n_zast = sum(len(v) for v in zastapione.values())
    n_bez = sum(len(v) for v in bez_cezury.values())

    print("\n" + "-" * 72)
    if trafienia:
        print(f"⚠️ DO PRZEGLĄDU: {len(trafienia)} numerów w {n_miejsc} miejscach "
              f"ma status martwy, a stoi jako aktualna podstawa.\n")
        for poz, v in sorted(trafienia.items(), key=lambda x: -len(x[1])):
            c = cache[poz]
            print(f"  Dz.U. {poz.replace('/', ' poz. ')}  [{c['status']}]  {len(v)}×")
            print(f"      {c['tytul'][:100]}")
            for rel, ln, tresc in v[:4]:
                print(f"      • {rel}:{ln}")
                print(f"        {tresc[:120]}")
            if len(v) > 4:
                print(f"      … i {len(v) - 4} dalszych")
    else:
        print("✅ Brak numerów o statusie martwym w pozycji aktualnej podstawy.")

    print("\n" + "-" * 72)
    if przedwczesne:
        print(f"⛔ W VACATIO LEGIS: {len(przedwczesne)} numerów w {n_przedw} miejscach "
              f"stoi jako aktualna podstawa, a wchodzi w życie DOPIERO PÓŹNIEJ.\n")
        for poz, v in sorted(przedwczesne.items(), key=lambda x: -len(x[1])):
            c = cache[poz]
            print(f"  Dz.U. {poz.replace('/', ' poz. ')}  [wejście w życie: {c['wejscie']}]  {len(v)}×")
            print(f"      {c['tytul'][:100]}")
            for rel, ln, tresc in v[:3]:
                print(f"      • {rel}:{ln}")
        print("\n  ⛔ Do dnia wejścia w życie stosuje się STARE brzmienie. Wpis musi")
        print("     podawać cezurę czasową, nie sam numer.")
    else:
        print("✅ Brak numerów w vacatio legis w pozycji aktualnej podstawy.")
    if bez_cezury:
        print(f"\n⚠️ W WYLICZENIU ZMIAN, BEZ CEZURY: {len(bez_cezury)} numerów "
              f"w {n_bez} miejscach.")
        print("   Numer wymieniony jako zmiana, choć jeszcze nie wszedł w życie,")
        print("   a linia nie podaje daty. Sygnał słabszy niż wyżej — ale model")
        print("   czytający „ze zm. …\" nie ma jak odróżnić zmiany działającej")
        print("   od tej w vacatio legis.")
        for poz, v in sorted(bez_cezury.items(), key=lambda x: -len(x[1])):
            print(f"     Dz.U. {poz.replace('/', ' poz. ')} "
                  f"[w życie: {cache[poz]['wejscie']}]  {len(v)}×")
            for rel, ln, _ in v[:3]:
                print(f"        • {rel}:{ln}")
    if bez_daty:
        print(f"\n⚠️ {bez_daty} numerów bez pola `entryIntoForce` w cache — "
              f"kontrola O-10 ich nie objęła (odśwież cache bez --offline).")

    print("\n" + "-" * 72)
    if zastapione:
        print(f"⚠️ ZASTĄPIONE TEKSTEM JEDNOLITYM: {len(zastapione)} numerów w {n_zast} miejscach "
              f"(O-11(c)). Cytuj t.j. albo zaznacz, że chodzi o brzmienie pierwotne.")
        for poz, v in sorted(zastapione.items(), key=lambda x: -len(x[1])):
            c = cache[poz]
            print(f"  Dz.U. {poz.replace('/', ' poz. ')}  [{c['status']}]  {len(v)}×")
            print(f"      {c['tytul'][:100]}")
            for rel, ln, tresc in v[:3]:
                print(f"      • {rel}:{ln}")
                print(f"        {tresc[:120]}")
    else:
        print("✅ Brak numerów zastąpionych tekstem jednolitym w pozycji aktualnej podstawy.")

    if brak_odp:
        print(f"\n⛔ BRAK ODPOWIEDZI API dla {len(brak_odp)} numerów — wynik NIEPEŁNY.")
        print("   To nie jest 'brak problemów'. Powtórz przebieg albo uzupełnij cache.")
        for p in brak_odp[:10]:
            print(f"     • Dz.U. {p.replace('/', ' poz. ')}")

    print("\n" + "=" * 72)
    print("⛔ ZANIM UŻYJESZ TEJ LISTY — przeczytaj docstring, punkty 1–4.")
    print("   Skrót: wygasły numer nie jest sam w sobie błędem; ta heurystyka")
    print("   dwukrotnie zawyżyła wynik; 'aktualny t.j.' bywa też uchylony;")
    print("   porównanie tytułów przy naprawie jest obowiązkowe.")
    print("=" * 72)

    if brak_odp:
        return 1
    if (trafienia or przedwczesne or bez_cezury) and a.strict:
        print("WYNIK T27: ⛔ FAIL (--strict)")
        return 1
    print("WYNIK T27: ⚠️ DO PRZEGLĄDU"
          if (trafienia or przedwczesne or bez_cezury) else "WYNIK T27: ✅ PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
