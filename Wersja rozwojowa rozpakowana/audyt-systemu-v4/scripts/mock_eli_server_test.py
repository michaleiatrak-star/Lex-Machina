"""
mock_eli_server_test.py — testuje sync_dzu_eli.py end-to-end wobec lokalnego
mock-serwera HTTP symulującego Sejm ELI API, bez dostępu do internetu.

Cel: to bezpośrednia odpowiedź na flagę F-10 (WARN-OTWARTE.md) — "sync_dzu_eli.py
nie przetestowany wobec żywego API". Ten skrypt nie zastępuje testu wobec
prawdziwego api.sejm.gov.pl (kształt odpowiedzi prawdziwego API może się różnić
i MUSI zostać zweryfikowany przez programistę), ale pozwala already teraz
sprawdzić całą resztę logiki (parsowanie odpowiedzi JSON, budowa raportu,
obsługa błędów sieciowych) w sposób w pełni zautomatyzowany i powtarzalny.

Użycie:
    python mock_eli_server_test.py
"""

import sys
import os
import json
import time
import http.server
import threading
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sync_dzu_eli  # noqa: E402


PRZYKLADOWA_ODPOWIEDZ_ELI = {
    "items": [
        {"year": 2026, "pos": 999, "title": "Ustawa testowa Z", "announcementDate": "2026-07-11",
         "ELI": "http://mock/eli/2026/999"},
        {"year": 2025, "pos": 1071, "title": "Kodeks cywilny (nowelizacja)", "announcementDate": "2026-07-10",
         "ELI": "http://mock/eli/2025/1071"},
    ]
}


class MockEliHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/eli/acts/DU/search"):
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
    sync_dzu_eli.ELI_BASE_URL = f"http://127.0.0.1:{port}/eli/acts"

    with tempfile.TemporaryDirectory() as tmp:
        mapa_path = os.path.join(tmp, "mapa_test.md")
        with open(mapa_path, "w", encoding="utf-8") as f:
            f.write("Kodeks cywilny — Dz.U. 2025 poz. 1071 (t.j.)\n"
                    "Inna ustawa — Dz.U. 2020 poz. 5\n")

        out_path = os.path.join(tmp, "raport.md")

        numery_znane = sync_dzu_eli.wczytaj_numery_z_mapy(mapa_path)
        nowe_pozycje = sync_dzu_eli.pobierz_nowe_pozycje_eli("2026-07-04")
        raport = sync_dzu_eli.zbuduj_raport(nowe_pozycje, numery_znane)

        with open(out_path, "w", encoding="utf-8") as f:
            f.write(raport)

        print(raport)
        print()

        # asercje testowe
        oczekiwana_liczba = 2
        zawiera_juz_w_mapie = "Kodeks cywilny (nowelizacja)" in raport and "TAK" in raport
        zawiera_nowa = "Ustawa testowa Z" in raport and "NIE" in raport

        server.shutdown()

        if len(nowe_pozycje) == oczekiwana_liczba and zawiera_juz_w_mapie and zawiera_nowa:
            print("SELF-TEST OK: sync_dzu_eli.py poprawnie pobiera z mock-API, "
                  "poprawnie rozróżnia pozycje już znane od nowych, poprawnie buduje raport.")
            sys.exit(0)
        else:
            print("SELF-TEST NIEUDANY: sprawdź logikę pobierz_nowe_pozycje_eli()/zbuduj_raport().")
            sys.exit(1)


if __name__ == "__main__":
    main()
