"""
bootstrap_last_sync_date.py — idempotentna inicjalizacja pliku .last_sync_date
używanego przez harmonogram (HARMONOGRAM-CRON.md) jako punkt startowy dla
sync_dzu_eli.py --since.

Problem, który rozwiązuje: przy pierwszym uruchomieniu harmonogramu plik
.last_sync_date jeszcze nie istnieje — bez tego skryptu cron/Action zawiódłby
przy pierwszym cyklu (`cat .last_sync_date` na nieistniejącym pliku).

Zasada: jeśli plik już istnieje, skrypt NIC nie robi (nie nadpisuje) — bootstrap
jest bezpieczny do wielokrotnego uruchomienia (idempotentny). Data startowa
domyślnie brana z nazwy aktualnego pliku mapa_dzu_YYYY-MM-DD.md (żeby pierwsza
synchronizacja objęła dokładnie okres od ostatniej ręcznej weryfikacji, a nie
np. cały rok wstecz).

Użycie:
    python bootstrap_last_sync_date.py --mapa-dir /sciezka/audyt-systemu-v4/references \
        --state-file .last_sync_date
"""

import os
import re
import sys
import argparse
from datetime import date


WZORZEC_NAZWY_MAPY = re.compile(r"mapa_dzu_(\d{4}-\d{2}-\d{2})\.md")


def znajdz_najnowsza_date_mapy(katalog: str) -> str | None:
    """Skanuje katalog w poszukiwaniu plików mapa_dzu_YYYY-MM-DD.md i zwraca
    najnowszą datę znalezioną w nazwie pliku (odpowiada dacie ostatniej ręcznej
    weryfikacji zgodnie z konwencją audyt-systemu-v4)."""
    if not os.path.isdir(katalog):
        return None
    daty = []
    for nazwa in os.listdir(katalog):
        dopasowanie = WZORZEC_NAZWY_MAPY.match(nazwa)
        if dopasowanie:
            daty.append(dopasowanie.group(1))
    return max(daty) if daty else None


def bootstrap(state_file: str, mapa_dir: str | None, domyslna_data: str | None) -> str:
    if os.path.exists(state_file):
        with open(state_file, "r", encoding="utf-8") as f:
            istniejaca = f.read().strip()
        print(f"Plik {state_file} już istnieje (data: {istniejaca}) — bez zmian (idempotentnie).")
        return istniejaca

    data_startowa = None
    if mapa_dir:
        data_startowa = znajdz_najnowsza_date_mapy(mapa_dir)
        if data_startowa:
            print(f"Znaleziono mapa_dzu_{data_startowa}.md w {mapa_dir} — używam tej daty jako punktu startowego.")

    if not data_startowa:
        data_startowa = domyslna_data or date.today().isoformat()
        print(f"Nie znaleziono pliku mapa_dzu_*.md — używam daty domyślnej: {data_startowa}")

    with open(state_file, "w", encoding="utf-8") as f:
        f.write(data_startowa)

    print(f"Utworzono {state_file} z datą startową {data_startowa}.")
    return data_startowa


def main():
    parser = argparse.ArgumentParser(description="Bootstrap pliku .last_sync_date (idempotentny)")
    parser.add_argument("--state-file", default=".last_sync_date")
    parser.add_argument("--mapa-dir", help="Katalog z plikami mapa_dzu_YYYY-MM-DD.md")
    parser.add_argument("--domyslna-data", help="Data użyta jeśli nie znaleziono mapa_dzu_*.md (YYYY-MM-DD)")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        uruchom_self_test()
        return

    bootstrap(args.state_file, args.mapa_dir, args.domyslna_data)


def uruchom_self_test():
    import tempfile

    with tempfile.TemporaryDirectory() as tmp:
        state_file = os.path.join(tmp, ".last_sync_date")
        mapa_dir = os.path.join(tmp, "references")
        os.makedirs(mapa_dir)
        # symulacja dwóch plików mapa_dzu, najnowsza data powinna wygrać
        open(os.path.join(mapa_dir, "mapa_dzu_2026-07-02.md"), "w").close()
        open(os.path.join(mapa_dir, "mapa_dzu_2026-07-04.md"), "w").close()

        # 1. pierwsze uruchomienie — powinno utworzyć plik z datą 2026-07-04
        wynik1 = bootstrap(state_file, mapa_dir, None)
        test1_ok = (wynik1 == "2026-07-04") and os.path.exists(state_file)

        # 2. drugie uruchomienie — powinno być idempotentne (bez zmiany)
        with open(state_file, "w") as f:
            f.write("2026-07-04")  # wartość referencyjna
        wynik2 = bootstrap(state_file, mapa_dir, None)
        test2_ok = (wynik2 == "2026-07-04")

        print()
        if test1_ok and test2_ok:
            print("SELF-TEST OK: bootstrap poprawnie wykrywa najnowszą mapę i jest idempotentny.")
            sys.exit(0)
        else:
            print(f"SELF-TEST NIEUDANY: test1_ok={test1_ok} test2_ok={test2_ok}")
            sys.exit(1)


if __name__ == "__main__":
    main()
