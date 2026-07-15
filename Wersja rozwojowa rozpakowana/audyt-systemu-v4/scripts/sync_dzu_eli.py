"""
sync_dzu_eli.py — referencyjny skrypt wykrywania nowych pozycji Dz.U./M.P.
przez Sejm ELI API, do użycia jako wejście dla audyt-systemu-v4 FAZA 3.

⚠️ Status: NIE URUCHAMIANY wobec żywego API w tym środowisku — sandbox audytowy
ma dostęp sieciowy tylko do domen z listy dozwolonej (github, npm, pypi itd.),
NIE obejmuje api.sejm.gov.pl. Struktura zapytań poniżej odzwierciedla publicznie
udokumentowany kształt Sejm ELI API (endpoints /eli/acts/...), ale developer MUSI
zweryfikować dokładne ścieżki/parametry względem aktualnej dokumentacji API przed
wdrożeniem produkcyjnym — API rządowe bywa zmieniane bez komunikatu wstecznej
kompatybilności.

Zasada nadrzędna (patrz SKILL.md): ten skrypt tylko WYKRYWA różnice, NIGDY nie
zapisuje ich automatycznie do mapa_dzu.md. Wynik to raport do przeglądu przez
sesję audytową.

Użycie:
    python sync_dzu_eli.py --mapa /sciezka/mapa_dzu_2026-07-04.md \
                            --since 2026-07-04 \
                            --out raport_roznic_2026-07-13.md
"""

import re
import sys
import json
import argparse
import urllib.request
from datetime import date

ELI_BASE_URL = "https://api.sejm.gov.pl/eli/acts"  # do zweryfikowania przez developera
TIMEOUT_S = 15


def wczytaj_numery_z_mapy(sciezka_mapy: str) -> set[str]:
    """Wyciąga wszystkie numery 'Dz.U. RRRR poz. N' / 'M.P. RRRR poz. N'
    już obecne w mapie centralnej — identyczna logika jak audyt-systemu-v4
    FAZA 3 / 3-PULL."""
    wzorzec = re.compile(r"(?:Dz\.U\.|M\.P\.) \d{4} poz\. \d+")
    with open(sciezka_mapy, "r", encoding="utf-8") as f:
        tresc = f.read()
    return set(wzorzec.findall(tresc))


def pobierz_nowe_pozycje_eli(od_daty: str) -> list[dict]:
    """Pobiera listę pozycji Dziennika Ustaw opublikowanych od podanej daty.

    UWAGA: dokładny kształt zapytania (parametry, paginacja) wymaga weryfikacji
    względem aktualnej dokumentacji Sejm ELI API przez developera — to jest
    szkielet, nie gwarantowanie poprawności wobec API w danej chwili.
    """
    url = f"{ELI_BASE_URL}/DU/search?dateFrom={od_daty}"
    try:
        with urllib.request.urlopen(url, timeout=TIMEOUT_S) as resp:
            dane = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        print(f"BŁĄD: nie udało się pobrać danych z Sejm ELI API: {exc}", file=sys.stderr)
        return []

    pozycje = []
    for item in dane.get("items", []):
        pozycje.append({
            "identyfikator": f"Dz.U. {item.get('year')} poz. {item.get('pos')}",
            "tytul": item.get("title", ""),
            "data_publikacji": item.get("announcementDate", ""),
            "url": item.get("ELI", ""),
        })
    return pozycje


def zbuduj_raport(nowe_pozycje: list[dict], numery_znane: set[str]) -> str:
    linie = [
        f"# Raport różnic Dz.U. — wygenerowano {date.today().isoformat()}",
        "",
        f"Nowych pozycji od ostatniej synchronizacji: {len(nowe_pozycje)}",
        "",
        "> Ten raport NIE modyfikuje mapa_dzu.md. Każda pozycja wymaga ręcznej",
        "> weryfikacji i decyzji w ramach sesji audyt-systemu-v4 FAZA 3, zgodnie",
        "> z zasadą 'nigdy nie zgaduj numeru'.",
        "",
        "| Identyfikator | Tytuł | Data publikacji | Już w mapie? | Akcja sugerowana |",
        "|---|---|---|---|---|",
    ]
    for p in nowe_pozycje:
        juz_w_mapie = "TAK — możliwa nowelizacja" if p["identyfikator"] in numery_znane else "NIE"
        akcja = (
            "Sprawdzić czy to nowy t.j. istniejącego aktu — sesja audytowa"
            if juz_w_mapie.startswith("TAK")
            else "Ocenić przynależność do DR-skilla — sesja audytowa"
        )
        linie.append(f"| {p['identyfikator']} | {p['tytul']} | {p['data_publikacji']} | {juz_w_mapie} | {akcja} |")

    return "\n".join(linie)


def main():
    parser = argparse.ArgumentParser(description="Wykrywanie nowych pozycji Dz.U./M.P. (Sejm ELI API)")
    parser.add_argument("--mapa", required=True, help="Ścieżka do mapa_dzu_*.md")
    parser.add_argument("--since", required=True, help="Data ostatniej synchronizacji, YYYY-MM-DD")
    parser.add_argument("--out", required=True, help="Ścieżka wyjściowego raportu .md")
    args = parser.parse_args()

    numery_znane = wczytaj_numery_z_mapy(args.mapa)
    nowe_pozycje = pobierz_nowe_pozycje_eli(args.since)
    raport = zbuduj_raport(nowe_pozycje, numery_znane)

    with open(args.out, "w", encoding="utf-8") as f:
        f.write(raport + "\n")

    print(f"Raport zapisany: {args.out} ({len(nowe_pozycje)} nowych pozycji)")


if __name__ == "__main__":
    main()
