#!/usr/bin/env python3
"""Wykrywa nowe pozycje Dz.U. przez publiczne API Sejm ELI.

Skrypt tylko tworzy raport do ręcznego audytu. Nie zmienia map Dz.U.
Używa działającego endpointu rocznego `/eli/acts/DU/{rok}` i filtruje
lokalnie po dacie publikacji. Błąd API kończy proces kodem różnym od zera.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from datetime import date, datetime
from pathlib import Path

ELI_BASE_URL = "https://api.sejm.gov.pl/eli/acts/DU"
TIMEOUT_S = 60


def wczytaj_numery_z_mapy(sciezka_mapy: Path) -> set[str]:
    wzorzec = re.compile(r"(?:Dz\.U\.|M\.P\.)\s+\d{4}\s+poz\.\s+\d+")
    return set(wzorzec.findall(sciezka_mapy.read_text(encoding="utf-8")))


def pobierz_rok(rok: int) -> list[dict]:
    with urllib.request.urlopen(f"{ELI_BASE_URL}/{rok}", timeout=TIMEOUT_S) as resp:
        return json.load(resp).get("items", [])


def pobierz_nowe_pozycje_eli(od_daty: date, do_daty: date) -> list[dict]:
    pozycje = []
    for rok in range(od_daty.year, do_daty.year + 1):
        for item in pobierz_rok(rok):
            raw_date = item.get("promulgation") or item.get("announcementDate")
            if not raw_date:
                continue
            data_publikacji = datetime.strptime(raw_date[:10], "%Y-%m-%d").date()
            if not (od_daty <= data_publikacji <= do_daty):
                continue
            year, pos = int(item["year"]), int(item["pos"])
            pozycje.append({
                "identyfikator": f"Dz.U. {year} poz. {pos}",
                "tytul": item.get("title", ""),
                "data_publikacji": data_publikacji.isoformat(),
                "url": f"https://eli.gov.pl/eli/DU/{year}/{pos}/ogl",
            })
    return sorted(pozycje, key=lambda p: (p["data_publikacji"], p["identyfikator"]))


def zbuduj_raport(pozycje: list[dict], numery_znane: set[str]) -> str:
    linie = [
        f"# Raport różnic Dz.U. — wygenerowano {date.today().isoformat()}", "",
        f"Pozycji w przedziale: {len(pozycje)}", "",
        "> Raport nie modyfikuje map. Każda pozycja wymaga oceny zakresu,",
        "> daty wejścia w życie i propagacji zgodnie z Regułą 7.", "",
        "| Identyfikator | Tytuł | Data publikacji | W mapie? | ELI |",
        "|---|---|---|---|---|",
    ]
    for p in pozycje:
        status = "TAK" if p["identyfikator"] in numery_znane else "NIE"
        title = p["tytul"].replace("|", "\\|")
        linie.append(
            f"| {p['identyfikator']} | {title} | {p['data_publikacji']} | "
            f"{status} | {p['url']} |"
        )
    return "\n".join(linie) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Raport nowych pozycji Dz.U. z Sejm ELI")
    parser.add_argument("--mapa", type=Path, required=True)
    parser.add_argument("--since", required=True, help="YYYY-MM-DD, włącznie")
    parser.add_argument("--until", default=date.today().isoformat(), help="YYYY-MM-DD, włącznie")
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    try:
        od_daty = datetime.strptime(args.since, "%Y-%m-%d").date()
        do_daty = datetime.strptime(args.until, "%Y-%m-%d").date()
        if od_daty > do_daty:
            raise ValueError("--since jest późniejsze niż --until")
        numery = wczytaj_numery_z_mapy(args.mapa)
        pozycje = pobierz_nowe_pozycje_eli(od_daty, do_daty)
        args.out.write_text(zbuduj_raport(pozycje, numery), encoding="utf-8")
    except Exception as exc:
        print(f"BŁĄD ELI/SYNC: {exc}", file=sys.stderr)
        return 2

    print(f"Raport zapisany: {args.out} ({len(pozycje)} pozycji)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
