#!/usr/bin/env python3
"""
szukaj_klauzul_uokik.py — pobiera (lub wczytuje lokalnie) archiwalny,
zanonimizowany rejestr klauzul niedozwolonych UOKiK i pozwala przeszukać go
lokalnie, deterministycznie, bez powtarzania web_fetch przy każdym zapytaniu.

## KONTEKST PRAWNY (zweryfikowany web_search 2026-07-13l — nie zgaduj)

Rejestr (dawny art. 479⁴⁵ KPC) utracił charakter ustawowy 17-18.04.2026 —
10-letni okres przejściowy z nowelizacji z 5.08.2015 (Dz.U. 2015 poz. 1634)
wygasł, a ustawodawca nie przedłużył go mimo apeli praktyków i Prezesa UOKiK.
Od 18.04.2026 UOKiK udostępnia rejestr WYŁĄCZNIE w wersji zanonimizowanej
(bez danych stron postępowania), o charakterze informacyjno-edukacyjnym —
BEZ skutku rozszerzonej prawomocności wobec osób trzecich. Zawiera ~7786
archiwalnych wpisów (wyroki SOKiK sprzed 17.04.2016), NIE obejmuje spraw
późniejszych (te są wyłącznie w bazie decyzji Prezesa UOKiK, osobne źródło).

Traktuj wynik tego narzędzia jako ANALOGIĘ/WSKAZÓWKĘ interpretacyjną do
powołania przez art. 385¹ KC — NIE jako samodzielną, wiążącą podstawę prawną.
Zgodnie z Zasadą 1-2 w analizator-umow-v1/SKILL.md.

## STATUS UCZCIWY

⚠️ Adres CSV poniżej (`https://rejestr.uokik.gov.pl/csv-archive/...`) pochodzi
z okresu SPRZED zmiany na wersję zanonimizowaną (źródło: projekt OSS
zmilonas/klauzule-niedozwolone-uokik) — NIE zweryfikowano, czy dokładnie ten
sam adres i format CSV obowiązuje w wersji zanonimizowanej po 18.04.2026.
Środowisko, w którym to napisano, nie ma dostępu sieciowego do domen .gov.pl.
Encoding pliku (windows-1250) i separator (średnik) oparte na tym samym
źródle — do potwierdzenia przez developera przy pierwszym pobraniu.

Logika parsowania i przeszukiwania (poniżej) przetestowana na syntetycznym
pliku CSV w tym samym formacie — patrz sekcja testowa.

Użycie:
    # pobranie (wymaga dostępu do rejestr.uokik.gov.pl):
    python szukaj_klauzul_uokik.py --pobierz --plik rejestr.csv

    # przeszukanie już pobranego/lokalnego pliku:
    python szukaj_klauzul_uokik.py --plik rejestr.csv --fraza "zmiana regulaminu"
"""

import csv
import sys
import argparse
import urllib.request

CSV_URL = "https://rejestr.uokik.gov.pl/csv-archive/uokik-rejestr-klauzul-niedozwolonych-automat.csv"
ENCODING_ZRODLOWY = "windows-1250"


def pobierz_csv(sciezka_docelowa: str) -> None:
    """Pobiera plik CSV z rejestru. Wymaga dostępu sieciowego do rejestr.uokik.gov.pl
    (nie dostępnego z tego środowiska deweloperskiego)."""
    print(f"Pobieranie z {CSV_URL} ...", file=sys.stderr)
    urllib.request.urlretrieve(CSV_URL, sciezka_docelowa)
    print(f"Zapisano: {sciezka_docelowa}", file=sys.stderr)
    print("UWAGA: zweryfikuj ręcznie, czy plik zawiera nagłówki i dane w oczekiwanym "
          "formacie — adres/format mogły się zmienić po przejściu na wersję "
          "zanonimizowaną (18.04.2026).", file=sys.stderr)


def wczytaj_wpisy(sciezka: str, encoding: str = ENCODING_ZRODLOWY) -> list[dict]:
    """Wczytuje wpisy z lokalnego pliku CSV. Próbuje podanego kodowania,
    z fallbackiem na UTF-8 (na wypadek gdyby wersja zanonimizowana zmieniła encoding)."""
    for enc in (encoding, "utf-8", "utf-8-sig"):
        try:
            with open(sciezka, "r", encoding=enc, newline="") as f:
                tresc = f.read()
            break
        except (UnicodeDecodeError, LookupError):
            continue
    else:
        raise ValueError(f"Nie udało się odczytać {sciezka} w żadnym z próbowanych kodowań")

    # autodetekcja separatora (średnik typowy dla eksportów UOKiK, ale bądź odporny)
    separator = ";" if tresc.count(";") > tresc.count(",") else ","
    reader = csv.DictReader(tresc.splitlines(), delimiter=separator)
    return list(reader)


def szukaj(wpisy: list[dict], fraza: str) -> list[dict]:
    """Proste, deterministyczne wyszukiwanie pełnotekstowe (case-insensitive)
    w polu z treścią postanowienia. Nazwa pola bywa różna między wersjami
    eksportu — sprawdzamy kilka wariantów."""
    fraza_lower = fraza.lower()
    mozliwe_pola_tresci = ["Postanowienie", "Klauzula", "TrescPostanowienia", "postanowienie"]

    wyniki = []
    for wpis in wpisy:
        tresc_pola = None
        for pole in mozliwe_pola_tresci:
            if pole in wpis:
                tresc_pola = wpis[pole]
                break
        if tresc_pola is None:
            # fallback: przeszukaj wszystkie wartości wiersza
            tresc_pola = " ".join(str(v) for v in wpis.values())

        if fraza_lower in (tresc_pola or "").lower():
            wyniki.append(wpis)
    return wyniki


def main():
    parser = argparse.ArgumentParser(
        description="Pobiera/przeszukuje archiwalny, zanonimizowany rejestr klauzul niedozwolonych UOKiK")
    parser.add_argument("--pobierz", action="store_true", help="Pobierz świeży CSV z rejestru")
    parser.add_argument("--plik", help="Ścieżka do pliku CSV (docelowa przy --pobierz, źródłowa przy wyszukiwaniu)")
    parser.add_argument("--fraza", help="Fraza do wyszukania w treści postanowień")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        uruchom_self_test()
        return

    if not args.plik:
        print("Podaj --plik (lub --self-test).", file=sys.stderr)
        sys.exit(2)

    if args.pobierz:
        pobierz_csv(args.plik)
        if not args.fraza:
            return

    if not args.fraza:
        print("Podaj --fraza do wyszukania (albo samo --pobierz bez --fraza).", file=sys.stderr)
        sys.exit(2)

    wpisy = wczytaj_wpisy(args.plik)
    wyniki = szukaj(wpisy, args.fraza)

    print(f"Wczytano {len(wpisy)} wpisów, znaleziono {len(wyniki)} pasujących do frazy {args.fraza!r}.\n")
    for w in wyniki[:20]:
        print(f"— {w}")
    if len(wyniki) > 20:
        print(f"... i {len(wyniki) - 20} więcej (obcięto do 20 w podglądzie)")

    print("\n⚠️ Przypomnienie: to wpisy ANALOGICZNE/informacyjne (rejestr utracił "
          "charakter ustawowy 18.04.2026), NIE samodzielna podstawa prawna. "
          "Powołaj się na art. 385¹ KC + analogię, zgodnie z Zasadą 2 w SKILL.md.")


def uruchom_self_test():
    import tempfile
    import os

    # syntetyczny plik CSV w konwencji rejestru (windows-1250, srednik)
    wiersze = [
        {"Id": "1", "DataWydania": "2015-03-12", "SygnaturaWyroku": "XVII AmC 123/13",
         "Postanowienie": "Sąd może zmienić regulamin w każdym czasie bez podania przyczyny."},
        {"Id": "2", "DataWydania": "2014-06-01", "SygnaturaWyroku": "XVII AmC 456/12",
         "Postanowienie": "Wszelkie spory rozstrzyga sąd właściwy dla siedziby Sprzedawcy."},
        {"Id": "3", "DataWydania": "2013-01-01", "SygnaturaWyroku": "XVII AmC 789/11",
         "Postanowienie": "Reklamacje rozpatrywane są w terminie 90 dni roboczych."},
    ]

    with tempfile.TemporaryDirectory() as tmp:
        sciezka = os.path.join(tmp, "test_rejestr.csv")
        with open(sciezka, "w", encoding="windows-1250", newline="") as f:
            w = csv.DictWriter(f, fieldnames=["Id", "DataWydania", "SygnaturaWyroku", "Postanowienie"], delimiter=";")
            w.writeheader()
            w.writerows(wiersze)

        wpisy = wczytaj_wpisy(sciezka)
        ok1 = len(wpisy) == 3

        wyniki_regulamin = szukaj(wpisy, "zmiana regulaminu")
        # "zmiana regulaminu" nie wystapi doslownie, testujemy czesciowa fraze
        wyniki_regulamin2 = szukaj(wpisy, "zmienić regulamin")
        ok2 = len(wyniki_regulamin2) == 1 and wyniki_regulamin2[0]["Id"] == "1"

        wyniki_sad = szukaj(wpisy, "sąd właściwy")
        ok3 = len(wyniki_sad) == 1 and wyniki_sad[0]["Id"] == "2"

        wyniki_brak = szukaj(wpisy, "fraza ktorej na pewno nie ma")
        ok4 = len(wyniki_brak) == 0

        print(f"Wczytano {len(wpisy)} wpisów testowych (oczekiwano 3): {'OK' if ok1 else 'BŁĄD'}")
        print(f"Wyszukiwanie 'zmienić regulamin' -> {len(wyniki_regulamin2)} (oczekiwano 1): {'OK' if ok2 else 'BŁĄD'}")
        print(f"Wyszukiwanie 'sąd właściwy' -> {len(wyniki_sad)} (oczekiwano 1): {'OK' if ok3 else 'BŁĄD'}")
        print(f"Wyszukiwanie frazy nieobecnej -> {len(wyniki_brak)} (oczekiwano 0): {'OK' if ok4 else 'BŁĄD'}")

        if ok1 and ok2 and ok3 and ok4:
            print("\nSELF-TEST OK: parsowanie CSV (windows-1250, średnik) i wyszukiwanie "
                  "działają poprawnie na syntetycznych danych w konwencji rejestru UOKiK.")
            sys.exit(0)
        else:
            print("\nSELF-TEST NIEUDANY.")
            sys.exit(1)


if __name__ == "__main__":
    main()
