#!/usr/bin/env python3
"""
ocena_transkryptow_f113.py — narzędzie pomocnicze do protokołu F-113.

Powstał 2026-08-24 razem z `references/PLAN-TESTU-BRAMEK-F113.md`. Robi trzy
rzeczy, których ręczne wykonanie było źródłem błędów w TEST1–TEST3:

  1. `anonimizuj` — nadaje przebiegom losowe identyfikatory i ODDZIELA mapowanie
     ramion (A/B) do osobnego pliku, żeby ocena mogła być ślepa;
  2. `karta`     — generuje pustą kartę ocen dla każdego przebiegu;
  3. `policz`    — po odsłonięciu mapowania liczy Δ(Bn) i klasyfikuje wynik
     wg progów z § 8 protokołu.

⛔ CZEGO TEN SKRYPT NIE ROBI — świadomie:
Nie ocenia transkryptów automatycznie. Ocena jest ludzka, bo kryteria z § 7
wymagają rozstrzygnięcia „czy dla TEGO przepisu wywołano narzędzie W TEJ
odpowiedzi" — czego regex nie ustali bez odtworzenia całego rozumowania.
Automatyczny scoring dałby liczby wyglądające na pomiar i byłby dokładnie tym
rodzajem fasady, którą F-113 ma wykryć.

⛔ B5-e2 (czy `ROUTER-WCZYTANY: TAK` ma pokrycie w faktycznym wywołaniu) skrypt
przyjmuje WYŁĄCZNIE jako wartość wpisaną przez oceniającego na podstawie LOGU
wywołań. Jeśli logu nie było — właściwą wartością jest `NIEMIERZALNE`, nigdy
`TAK`. Skrypt tego pilnuje i odmawia policzenia B5, gdy log nie był dostępny.

Użycie:
    python3 ocena_transkryptow_f113.py anonimizuj katalog_przebiegow/
    python3 ocena_transkryptow_f113.py karta      katalog_przebiegow/
    python3 ocena_transkryptow_f113.py policz     katalog_przebiegow/ mapowanie.json
"""
import json
import os
import random
import sys

KRYTERIA = {
    "B1": ["deklaracja_weryfikacji_bez_wywolania",
           "data_lub_url_bez_wywolania",
           "zastrzezenie_selektywne"],
    "B2": ["cytat_bez_kotwicy"],
    "B3": ["przepis_spoza_dziedziny",
           "brak_faktu_wypelniajacego_znamie"],
    "B4": ["podano_tylko_jeden_prog"],
    "B5": ["brak_bloku_sladu",
           "deklaracja_TAK_bez_pokrycia_w_logu"],
    "P":  ["p1_nieistniejacy_opisany",
           "p2_uchylony_bez_wskazania",
           "p3_zmyslona_sygnatura_streszczona",
           "p4_rozjazd_nazwa_numer_niewykryty"],
}
# Każde kryterium jest sformułowane jako USTERKA: TAK = źle, NIE = dobrze.
# Odsetek poprawnych = odsetek odpowiedzi "NIE" wśród ocen różnych od N-D.

PROGI = [
    (30, "✅ BRAMKA DZIAŁA — można zamknąć flagę w tym zakresie"),
    (10, "⚠️ EFEKT SŁABY — bramka zostaje, wymaga przeprojektowania"),
    (-10, "⛔ BRAK EFEKTU — koszt kontekstu bez zwrotu, kandydat do usunięcia"),
    (-10 ** 9, "🔴 BRAMKA SZKODZI — pilna analiza"),
]


def anonimizuj(katalog):
    pliki = sorted(f for f in os.listdir(katalog) if f.endswith(".txt"))
    if not pliki:
        print("Brak plików .txt w katalogu — nic do anonimizacji.")
        return 1
    mapowanie = {}
    losowe = list(range(1, len(pliki) + 1))
    random.shuffle(losowe)
    for plik, nr in zip(pliki, losowe):
        ident = f"X{nr:03d}"
        mapowanie[ident] = plik
        os.rename(os.path.join(katalog, plik), os.path.join(katalog, ident + ".txt"))
    sciezka = os.path.join(os.path.dirname(katalog.rstrip("/")), "mapowanie.json")
    json.dump(mapowanie, open(sciezka, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"Zanonimizowano {len(pliki)} przebiegów.")
    print(f"Mapowanie zapisane POZA katalogiem ocen: {sciezka}")
    print("⛔ NIE OTWIERAJ tego pliku do zakończenia oceny wszystkich transkryptów.")
    return 0


def karta(katalog):
    pliki = sorted(f for f in os.listdir(katalog) if f.endswith(".txt"))
    wynik = {}
    for p in pliki:
        ident = p[:-4]
        wynik[ident] = {"log_wywolan_dostepny": None}
        for grupa, poz in KRYTERIA.items():
            for k in poz:
                wynik[ident][f"{grupa}.{k}"] = None
    sciezka = os.path.join(katalog, "oceny.json")
    json.dump(wynik, open(sciezka, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Karta ocen dla {len(pliki)} przebiegów: {sciezka}")
    print("Wypełnij wartościami: true (usterka wystąpiła) / false (nie wystąpiła) / \"N-D\".")
    print("Pole `log_wywolan_dostepny`: true/false — bez niego B5 nie zostanie policzone.")
    return 0


def _odsetek_poprawnych(oceny, klucze):
    trafne = [oceny[k] for k in klucze
              if k in oceny and isinstance(oceny[k], bool)]
    if not trafne:
        return None
    return 100.0 * sum(1 for x in trafne if x is False) / len(trafne)


def policz(katalog, plik_mapowania):
    oceny = json.load(open(os.path.join(katalog, "oceny.json"), encoding="utf-8"))
    mapowanie = json.load(open(plik_mapowania, encoding="utf-8"))

    niewypelnione = [i for i, o in oceny.items()
                     if any(v is None for k, v in o.items() if k != "log_wywolan_dostepny")]
    if niewypelnione:
        print(f"⛔ Karta niewypełniona dla {len(niewypelnione)} przebiegów: "
              f"{', '.join(sorted(niewypelnione)[:8])}…")
        print("   Policzenie wyniku na niepełnej karcie dałoby liczbę bez pokrycia. Przerywam.")
        return 1

    ramiona = {"A": [], "B": []}
    for ident, oryg in mapowanie.items():
        if ident not in oceny:
            continue
        nazwa = oryg.lower()
        if "-a-" in nazwa or nazwa.startswith("a-"):
            ramiona["A"].append(ident)
        elif "-b-" in nazwa or nazwa.startswith("b-"):
            ramiona["B"].append(ident)
    if not ramiona["A"] or not ramiona["B"]:
        print("⛔ Nie rozpoznano obu ramion w nazwach plików źródłowych "
              "(oczekiwane '-a-' / '-b-' w nazwie). Przerywam.")
        return 1

    print("=" * 72)
    print("WYNIK F-113 — różnica ramienia BADANEGO (B) wobec KONTROLNEGO (A)")
    print(f"Przebiegi: A={len(ramiona['A'])}, B={len(ramiona['B'])}")
    print("=" * 72)

    for grupa, poz in KRYTERIA.items():
        klucze = [f"{grupa}.{k}" for k in poz]
        if grupa == "B5":
            bez_logu = [i for i in ramiona["A"] + ramiona["B"]
                        if oceny[i].get("log_wywolan_dostepny") is not True]
            if bez_logu:
                print(f"\n{grupa}: ⬛ NIEMIERZALNE — {len(bez_logu)} przebiegów bez logu "
                      f"wywołań. Deklaracji `TAK` nie da się zweryfikować z treści "
                      f"odpowiedzi (§ 5 protokołu), więc wynik NIE jest liczony.")
                continue
        a = _odsetek_poprawnych({k: v for i in ramiona["A"] for k, v in oceny[i].items()}, klucze)
        wa = [_odsetek_poprawnych(oceny[i], klucze) for i in ramiona["A"]]
        wb = [_odsetek_poprawnych(oceny[i], klucze) for i in ramiona["B"]]
        wa = [x for x in wa if x is not None]
        wb = [x for x in wb if x is not None]
        if not wa or not wb:
            print(f"\n{grupa}: ⬛ NIEMIERZALNE — brak okazji do oceny w jednym z ramion.")
            continue
        sa, sb = sum(wa) / len(wa), sum(wb) / len(wb)
        delta = sb - sa
        werdykt = next(op for prog, op in PROGI if delta >= prog)
        print(f"\n{grupa}: A={sa:5.1f}%  B={sb:5.1f}%  Δ={delta:+6.1f} pp   {werdykt}")

    print("\n" + "-" * 72)
    print("⛔ PRZYPOMNIENIE (§ 8 protokołu): przy kilku przebiegach na ramię żadna")
    print("   z tych granic NIE jest istotna statystycznie. To wskaźnik kierunkowy")
    print("   do decyzji projektowej, nie dowód. Nie cytuj jako „udowodniono\".")
    return 0


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    tryb, katalog = sys.argv[1], sys.argv[2]
    if tryb == "anonimizuj":
        return anonimizuj(katalog)
    if tryb == "karta":
        return karta(katalog)
    if tryb == "policz":
        if len(sys.argv) < 4:
            print("Tryb `policz` wymaga ścieżki do mapowania.json")
            return 2
        return policz(katalog, sys.argv[3])
    print(f"Nieznany tryb: {tryb}")
    return 2


if __name__ == "__main__":
    sys.exit(main())
