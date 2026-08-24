#!/usr/bin/env python3
"""
check_sync_aktow.py — Test regresyjny T11: SYNCHRONIZACJA AKTÓW między trzema
rejestrami systemu (dodany 2026-08-15z, flaga F-89).

PROBLEM, KTÓRY TEN TEST WYKRYWA — udokumentowany CZTEROKROTNIE:
  1) 2026-08-13 — cztery podatki sektorowe opisane poprawnie w dr-06, ale
     nieobecne w mapie centralnej i w ROUTING-MAP.
  2) 2026-08-14 — 12 nowych modułów zarejestrowanych lokalnie, ale nieobecnych
     w ROUTING-MAP (stąd REGUŁA 3 w HARDGATE-AUDYT).
  3) 2026-08-15y — ustawa o systemach sztucznej inteligencji (Dz.U. 2026
     poz. 1003) znana w dr-11 od 14.08, nieobecna w mapie centralnej.
  4) 2026-08-15z — Dz.U. 2026 poz. 1004 (narkomania) i poz. 825/846
     (Ordynacja) wpisane do mapy centralnej, ale początkowo NIE do ROUTING-MAP.

RÓŻNICA WOBEC ISTNIEJĄCYCH TESTÓW:
  - `check_rejestracja_modulow.py` sprawdza rejestrację MODUŁÓW (plik na dysku
    vs SKILL.md vs MAPA-AKTOW.md vs ROUTING-MAP) — NIE sprawdza AKTÓW.
  - `test_cross_map_dzu.py` (T3) porównuje NUMERY tego samego aktu w dwóch
    mapach — wykrywa rozbieżność numeru, ale NIE wykrywa AKTU, którego
    w drugim rejestrze w ogóle NIE MA.
  - Ten test wykrywa właśnie BRAK POZYCJI, nie rozbieżność numeru.

ZASADA: dla każdego numeru „Dz.U. RRRR poz. NNNN" znalezionego w dowolnym
z rejestrów sprawdza, czy występuje też w dwóch pozostałych:
  A) lokalne `dr-XX/MAPA-AKTOW.md` (16 plików)
  B) centralna `prawo-polskie-v2/ROUTING-MAP.md`
  C) mapa Dz.U. `audyt-systemu-v4/references/mapa_dzu_*.md` (najnowsza)

⚠️ OGRANICZENIA (czytaj przed interpretacją wyniku):
  - To heurystyka TEKSTOWA po numerze, bez rozumienia kontekstu. Numer
    wymieniony wyłącznie „przy okazji" (np. w opisie innej ustawy) liczy się
    jako obecność.
  - Rejestry mają RÓŻNE przeznaczenie: mapa Dz.U. jest katalogiem WSZYSTKICH
    aktów, ROUTING-MAP zawiera to, co ma routing do modułu. Akt świadomie
    skatalogowany bez modułu MOŻE legalnie nie mieć wiersza w ROUTING-MAP.
    Dlatego wynik to LISTA DO PRZEGLĄDU, nie lista błędów.
  - Nie rozstrzyga, KTÓRY rejestr ma rację — to robi człowiek/LLM po ISAP.

Użycie:
    python3 check_sync_aktow.py [--repo-root /mnt/skills/user] [--limit N]
                                [--kierunek lokalne|centralna|mapa|wszystkie]

Kod wyjścia:
    0 — brak wykrytych braków synchronizacji
    1 — wykryto co najmniej jeden akt obecny w jednym rejestrze, a brakujący
        w innym (WYMAGA PRZEGLĄDU, patrz ograniczenia wyżej)
"""

import argparse
import re
import sys
from pathlib import Path

# "Dz.U. 2023 poz. 1939", "Dz. U. z 2023 r. poz. 1939", "Dz.U. 2023.1939"
RE_POZ = re.compile(
    r"Dz\.\s?U\.\s*(?:z\s*)?(\d{4})\s*(?:r\.\s*)?(?:poz\.\s*|\.)(\d{1,5})",
    re.IGNORECASE,
)


# mapa Dz.U. trzyma numery w kolumnach tabeli: "| 2026 | 1004 | Ustawa … |"
RE_WIERSZ_MAPY = re.compile(r"^\|\s*(\d{4})\s*\|\s*(\d{1,5})\s*\|")

# ⭐ FORMA SKRÓCONA BEZ PREFIKSU "Dz.U." — "zm.: 2025.1705", "+2026.176",
# "(zm. 2025.1863)". RE_POZ jej NIE łapie, bo wymaga prefiksu aktu.
# Dodane 2026-08-22 (F-106) po przeglądzie 29 trafień: PIĘĆ pozycji było
# raportowanych jako „brak w ROUTING-MAP", choć numer TAM JEST — tyle że
# zapisany skrótowo w komentarzu wiersza aktu bazowego (2025.1705, 2025.1366,
# 2024.80, 2023.1082, 2021.2490). Używane WYŁĄCZNIE do demotowania trafienia
# z „brak" na „obecny w formie skróconej" — nigdy do zgłaszania nowych braków,
# bo bez prefiksu wzorzec jest podatny na przypadkowe dopasowania (daty,
# numery stron). Kierunek zmiany jest zatem wyłącznie w stronę MNIEJ alarmów.
RE_POZ_LUZNA = re.compile(r"(?<![\d.])((?:19|20)\d{2})\.(\d{1,5})(?!\d)")

# ⭐ NOTACJA LEX/„RRRR.NN.PPPP" — "Dz.U.2026.0.468" (rok . numer dziennika .
# pozycja; dla aktów po 2012 r. środkowy człon to zawsze 0). Pomiar 2026-08-23g:
# 95 wystąpień w systemie, m.in. shared/MOD-ATAK-NA-SWIADKA.md, ROUTING-MAP.md
# i moduły dr-02/dr-06/dr-09. RE_POZ rozbierał je BŁĘDNIE na (rok, "0") — czyli
# na artefakt, który funkcja artefakt() niżej po cichu odrzucała, przez co
# PRAWDZIWA pozycja (468) NIGDY nie trafiała do porównania. Skutek: fałszywy
# NEGATYW — akt obecny w jednym rejestrze i nieobecny w drugim nie mógł zostać
# wykryty, jeżeli którykolwiek z rejestrów zapisał go w tej notacji.
# Naprawa (flaga F-125): normalizacja tekstu PRZED parsowaniem.
RE_LEX = re.compile(r"Dz\.\s?U\.\s*(\d{4})\.(\d{1,3})\.(\d{1,5})", re.IGNORECASE)


def normalizuj(txt: str) -> str:
    """Sprowadza notację 'Dz.U.RRRR.NN.PPPP' do 'Dz.U. RRRR poz. PPPP'.

    Wywoływana na KAŻDYM czytanym pliku, przed uruchomieniem RE_POZ —
    inaczej środkowy człon (numer dziennika) zostaje odczytany jako pozycja.
    """
    return RE_LEX.sub(lambda m: f"Dz.U. {m.group(1)} poz. {m.group(3)}", txt)


# artefakt parsera: "poz. 0" nie istnieje w Dz.U. — powstaje z rozbioru
# zapisów typu "art. 2025.0" lub uciętych fragmentów tabel
# ⚠️ Po naprawie F-125 ta funkcja NIE powinna już odrzucać notacji LEX —
# jeśli mimo normalizacji nadal pojawiają się trafienia "poz. 0", to znak,
# że istnieje TRZECI, jeszcze nierozpoznany format zapisu numeru. Zgłoś go,
# nie rozszerzaj filtra.
def artefakt(rok_poz):
    return rok_poz[1] == "0"


def zbierz_mape_dzu(path: Path):
    """Mapa Dz.U. ma format tabelaryczny (rok i pozycja w osobnych kolumnach),
    a NIE frazę 'Dz.U. RRRR poz. NNNN' — wymaga własnego parsera.
    Zbiera OBA formaty, bo w komentarzach wierszy występują też frazy pełne."""
    try:
        txt = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return set()
    txt = normalizuj(txt)
    wynik = {(m.group(1), m.group(2)) for m in RE_POZ.finditer(txt)}
    for linia in txt.splitlines():
        m = RE_WIERSZ_MAPY.match(linia)
        if m:
            wynik.add((m.group(1), m.group(2)))
    return wynik


def zbierz(path: Path):
    """Zwraca zbiór krotek (rok, pozycja) znalezionych w pliku."""
    try:
        txt = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return set()
    return {(m.group(1), m.group(2)) for m in RE_POZ.finditer(normalizuj(txt))}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    ap.add_argument("--limit", type=int, default=25,
                    help="ile pozycji wypisać w każdej kategorii (0 = wszystkie)")
    ap.add_argument("--kierunek", default="wszystkie",
                    choices=["lokalne", "centralna", "mapa", "wszystkie"])
    ap.add_argument("--bez-filtra", action="store_true",
                    help="pokaż listę surową, bez odsiewania form skróconych "
                         "i artefaktów (stan sprzed poprawki F-106)")
    args = ap.parse_args()

    root = Path(args.repo_root)

    routing = root / "prawo-polskie-v2" / "ROUTING-MAP.md"
    if not routing.exists():
        print(f"BŁĄD: brak {routing}")
        sys.exit(2)

    mapy_dzu = sorted((root / "audyt-systemu-v4" / "references").glob("mapa_dzu_*.md"))
    if not mapy_dzu:
        print("BŁĄD: brak pliku mapa_dzu_*.md")
        sys.exit(2)
    mapa_dzu = mapy_dzu[-1]  # najnowsza wg nazwy (data w nazwie)

    lokalne = {}
    for d in sorted(root.glob("dr-*/MAPA-AKTOW.md")):
        lokalne[d.parent.name] = zbierz(d)

    zb_routing = zbierz(routing)
    zb_routing_luzne = {
        (m.group(1), m.group(2))
        for m in RE_POZ_LUZNA.finditer(routing.read_text(encoding="utf-8", errors="replace"))
    }
    zb_mapa = zbierz_mape_dzu(mapa_dzu)
    zb_lokalne = set().union(*lokalne.values()) if lokalne else set()

    print(f"check_sync_aktow.py — T11 (synchronizacja aktów)")
    print(f"  lokalne MAPA-AKTOW: {len(lokalne)} plików, {len(zb_lokalne)} numerów")
    print(f"  ROUTING-MAP:        {len(zb_routing)} numerów")
    print(f"  {mapa_dzu.name}: {len(zb_mapa)} numerów\n")

    def wypisz(tytul, zbior, skad=None):
        if not zbior:
            print(f"  ✅ {tytul}: brak\n")
            return
        pokaz = sorted(zbior, key=lambda t: (-int(t[0]), -int(t[1])))
        limit = args.limit or len(pokaz)
        print(f"  ⚠️  {tytul}: {len(zbior)}")
        for rok, poz in pokaz[:limit]:
            zrodlo = ""
            if skad:
                gdzie = [k for k, v in skad.items() if (rok, poz) in v]
                zrodlo = "  ← " + ", ".join(sorted(gdzie)[:3])
            print(f"       Dz.U. {rok} poz. {poz}{zrodlo}")
        if len(pokaz) > limit:
            print(f"       … i {len(pokaz) - limit} dalszych (--limit 0 pokazuje wszystkie)")
        print()

    brakow = 0

    if args.kierunek in ("lokalne", "wszystkie"):
        brak_surowy = zb_lokalne - zb_routing
        brak = brak_surowy if args.bez_filtra else {
            x for x in brak_surowy
            if x not in zb_routing_luzne and not artefakt(x)}
        odsiane = len(brak_surowy) - len(brak)
        if odsiane:
            print(f"  ℹ️  Odsiano {odsiane} trafień: numer obecny w ROUTING-MAP "
                  f"w formie skróconej (RRRR.NNN bez prefiksu) lub artefakt "
                  f'"poz. 0". Pełna lista surowa: --bez-filtra\n')
        brakow += len(brak)
        wypisz("W lokalnej MAPA-AKTOW, BRAK w ROUTING-MAP (REGUŁA 3 HARDGATE)",
               brak, lokalne)

    if args.kierunek in ("mapa", "wszystkie"):
        brak = zb_lokalne - zb_mapa
        brakow += len(brak)
        wypisz("W lokalnej MAPA-AKTOW, BRAK w mapie Dz.U.", brak, lokalne)

    if args.kierunek in ("centralna", "wszystkie"):
        brak = zb_routing - zb_mapa
        brakow += len(brak)
        wypisz("W ROUTING-MAP, BRAK w mapie Dz.U.", brak)

    print("=" * 68)
    if brakow:
        print(f"WYNIK T11: WARN — {brakow} pozycji do PRZEGLĄDU.")
        print("⚠️ To NIE jest lista błędów — akt świadomie skatalogowany bez")
        print("   modułu może legalnie nie mieć wiersza w ROUTING-MAP.")
        print("   Priorytet przeglądu: akty z ostatnich 12 miesięcy.")
    else:
        print("WYNIK T11: OK — rejestry zsynchronizowane w granicach tej heurystyki.")

    sys.exit(1 if brakow else 0)


if __name__ == "__main__":
    main()
