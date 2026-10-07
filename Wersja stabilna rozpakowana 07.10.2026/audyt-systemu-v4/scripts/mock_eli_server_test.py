"""
mock_eli_server_test.py — testuje sync_dzu_eli.py end-to-end wobec lokalnego
mock-serwera HTTP symulującego Sejm ELI API, bez dostępu do internetu.

Cel: to bezpośrednia odpowiedź na flagę F-10 (WARN-OTWARTE.md) — "sync_dzu_eli.py
nie przetestowany wobec żywego API". Ten skrypt nie zastępuje testu wobec
prawdziwego api.sejm.gov.pl (kształt odpowiedzi prawdziwego API może się różnić
i MUSI zostać zweryfikowany przez programistę), ale pozwala już teraz
sprawdzić całą resztę logiki (parsowanie odpowiedzi JSON, budowa raportu,
obsługa błędów sieciowych) w sposób w pełni zautomatyzowany i powtarzalny.

⚡ NAPRAWIONE 2026-09-01 (F-147). Skrypt był zsynchronizowany z WCZEŚNIEJSZĄ
wersją `sync_dzu_eli.py` i kończył się `AttributeError` już na pierwszym
wywołaniu, czyli nie testował niczego. Trzy rozjazdy naraz:
  (1) `wczytaj_numery_z_mapy()` przyjmuje `Path`, dostawał `str`;
  (2) `pobierz_nowe_pozycje_eli()` przyjmuje DWIE daty (`date`, `date`),
      dostawał jeden `str`;
  (3) mock obsługiwał endpoint `/eli/acts/DU/search`, a produkcja odpytuje
      indeks ROCZNY `/eli/acts/DU/{rok}` i filtruje datę lokalnie.
Skrypt nie był wpięty w orkiestrator, więc awaria była niewidoczna dla
pełnego przebiegu regresji — od tej wersji wywołuje go `run_regression_suite.py`.

Użycie:
    python3 mock_eli_server_test.py
"""

import sys
import os
import json
import http.server
import threading
import tempfile
from datetime import date
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sync_dzu_eli  # noqa: E402


ROK_TESTOWY = 2026

PRZYKLADOWA_ODPOWIEDZ_ELI = {
    "items": [
        {"year": 2026, "pos": 999, "title": "Ustawa testowa Z", "announcementDate": "2026-07-11",
         "ELI": "http://mock/eli/2026/999"},
        {"year": 2026, "pos": 795, "title": "Kodeks cywilny (tekst jednolity)", "announcementDate": "2026-06-17",
         "ELI": "http://mock/eli/2026/795"},
        # pozycja spoza przedziału — sprawdza, że filtr daty faktycznie działa
        {"year": 2026, "pos": 111, "title": "Ustawa sprzed przedzialu", "announcementDate": "2026-01-05",
         "ELI": "http://mock/eli/2026/111"},
    ]
}


class MockEliHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # produkcja odpytuje indeks roczny: /eli/acts/DU/{rok}
        if self.path.rstrip("/").endswith("/eli/acts/DU/{}".format(ROK_TESTOWY)):
            body = json.dumps(PRZYKLADOWA_ODPOWIEDZ_ELI).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass


def uruchom_mock_serwer():
    server = http.server.HTTPServer(("127.0.0.1", 0), MockEliHandler)
    port = server.server_port
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, port


def main():
    server, port = uruchom_mock_serwer()
    # podmieniamy adres bazowy modułu na nasz mock, żeby przetestować realny
    # przepływ pobierz_nowe_pozycje_eli() bez modyfikowania kodu produkcyjnego
    sync_dzu_eli.ELI_BASE_URL = "http://127.0.0.1:{}/eli/acts/DU".format(port)

    try:
        with tempfile.TemporaryDirectory() as tmp:
            mapa_path = Path(tmp) / "mapa_test.md"
            mapa_path.write_text(
                "Kodeks cywilny — Dz.U. 2026 poz. 795 (t.j.)\n"
                "Inna ustawa — Dz.U. 2020 poz. 5\n",
                encoding="utf-8",
            )
            out_path = Path(tmp) / "raport.md"

            numery_znane = sync_dzu_eli.wczytaj_numery_z_mapy(mapa_path)
            nowe_pozycje = sync_dzu_eli.pobierz_nowe_pozycje_eli(
                date(2026, 7, 4), date(2026, 7, 31)
            )
            raport = sync_dzu_eli.zbuduj_raport(nowe_pozycje, numery_znane)
            out_path.write_text(raport, encoding="utf-8")

            print(raport)
            print()

            # asercje testowe
            kontrole = [
                ("filtr daty: 1 pozycja w przedziale 04-31.07",
                 len(nowe_pozycje) == 1),
                ("pozycja spoza przedziału odfiltrowana",
                 all(p["identyfikator"] != "Dz.U. 2026 poz. 111" for p in nowe_pozycje)),
                ("nowa pozycja obecna i oznaczona NIE",
                 "Ustawa testowa Z" in raport and "| NIE |" in raport),
                ("rozpoznanie pozycji już znanej z mapy",
                 "Dz.U. 2026 poz. 795" in numery_znane),
                ("mapa czytana z Path bez błędu typu",
                 len(numery_znane) == 2),
            ]
    finally:
        server.shutdown()

    for etykieta, ok in kontrole:
        print(("PASS " if ok else "FAIL ") + etykieta)

    if all(ok for _, ok in kontrole):
        print("SELF-TEST OK: sync_dzu_eli.py poprawnie pobiera z mock-API, "
              "poprawnie filtruje przedział dat, poprawnie rozróżnia pozycje "
              "już znane od nowych i poprawnie buduje raport.")
        sys.exit(0)
    print("SELF-TEST NIEUDANY: sprawdź logikę pobierz_nowe_pozycje_eli()/zbuduj_raport().")
    sys.exit(1)


if __name__ == "__main__":
    main()
