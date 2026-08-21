"""
connector_health_check.py — sprawdza dostępność skonfigurowanych connectorów
MCP (health-check), żeby KROK 1 protokołu MCP-INTEGRACJA.md wiedział, które
connectory realnie traktować jako "podłączone" w danym środowisku.

⚠️ Status: kod jest funkcjonalny i przetestowany wobec lokalnego serwera mock
(patrz sekcja testowa na końcu pliku oraz `python connector_health_check.py --self-test`).
NIE był uruchamiany wobec żadnego realnego serwera MCP/API rządowego — to
wymaga uzupełnienia pliku `connectors.json` przez programistę portalu
rzeczywistymi adresami wybranych connectorów (patrz KONEKTORY-REKOMENDOWANE.md).

Użycie produkcyjne:
    python connector_health_check.py --config connectors.json

Format connectors.json:
[
  {"name": "sejm-eli", "health_url": "https://twoj-connector/health", "timeout_s": 5},
  {"name": "saos", "health_url": "https://twoj-connector-saos/health", "timeout_s": 5}
]

Wyjście: tabela w konsoli + plik connectors_status.json (do odczytu przez
Claude/portal jako wejście do KROK 1 protokołu MCP-INTEGRACJA.md).
"""

import sys
import json
import argparse
import urllib.request
import urllib.error
import threading
import http.server
import time


def sprawdz_connector(nazwa: str, url: str, timeout_s: float) -> dict:
    start = time.monotonic()
    try:
        with urllib.request.urlopen(url, timeout=timeout_s) as resp:
            czas_ms = round((time.monotonic() - start) * 1000, 1)
            dostepny = 200 <= resp.status < 300
            return {"name": nazwa, "available": dostepny, "http_status": resp.status,
                     "latency_ms": czas_ms, "error": None}
    except urllib.error.URLError as exc:
        czas_ms = round((time.monotonic() - start) * 1000, 1)
        return {"name": nazwa, "available": False, "http_status": None,
                "latency_ms": czas_ms, "error": str(exc.reason)}
    except Exception as exc:
        czas_ms = round((time.monotonic() - start) * 1000, 1)
        return {"name": nazwa, "available": False, "http_status": None,
                "latency_ms": czas_ms, "error": str(exc)}


def sprawdz_wszystkie(config: list[dict]) -> list[dict]:
    wyniki = []
    for c in config:
        wynik = sprawdz_connector(c["name"], c["health_url"], c.get("timeout_s", 5))
        wyniki.append(wynik)
    return wyniki


def wypisz_tabele(wyniki: list[dict]) -> None:
    print(f"{'Connector':<15} {'Dostępny':<10} {'HTTP':<6} {'Latencja (ms)':<15} Błąd")
    for w in wyniki:
        status = "TAK" if w["available"] else "NIE"
        print(f"{w['name']:<15} {status:<10} {str(w['http_status'] or '-'):<6} "
              f"{str(w['latency_ms']):<15} {w['error'] or ''}")


def main():
    parser = argparse.ArgumentParser(description="Health-check connectorów MCP")
    parser.add_argument("--config", help="Ścieżka do connectors.json")
    parser.add_argument("--out", default="connectors_status.json", help="Plik wynikowy")
    parser.add_argument("--self-test", action="store_true",
                         help="Uruchamia wbudowany test na lokalnym mock-serwerze, bez sieci zewnętrznej")
    args = parser.parse_args()

    if args.self_test:
        uruchom_self_test()
        return

    if not args.config:
        print("Podaj --config connectors.json lub uruchom --self-test", file=sys.stderr)
        sys.exit(2)

    with open(args.config, "r", encoding="utf-8") as f:
        config = json.load(f)

    wyniki = sprawdz_wszystkie(config)
    wypisz_tabele(wyniki)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(wyniki, f, ensure_ascii=False, indent=2)
    print(f"\nZapisano: {args.out}")


def uruchom_self_test():
    """Uruchamia lokalny serwer HTTP (jeden endpoint OK, jeden 500, jeden
    nieistniejący port) i sprawdza, czy sprawdz_wszystkie() poprawnie
    klasyfikuje wszystkie 3 przypadki — bez żadnego dostępu do sieci
    zewnętrznej. To pozwala programiście zweryfikować logikę tego skryptu
    przed podłączeniem prawdziwych connectorów."""

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/ok":
                self.send_response(200)
                self.end_headers()
            else:
                self.send_response(500)
                self.end_headers()

        def log_message(self, format, *args):
            pass  # wycisz logi serwera testowego

    server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
    port = server.server_port
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    config = [
        {"name": "mock-ok", "health_url": f"http://127.0.0.1:{port}/ok", "timeout_s": 3},
        {"name": "mock-blad-500", "health_url": f"http://127.0.0.1:{port}/blad", "timeout_s": 3},
        {"name": "mock-niedostepny", "health_url": "http://127.0.0.1:1/nieistnieje", "timeout_s": 1},
    ]
    wyniki = sprawdz_wszystkie(config)
    server.shutdown()

    wypisz_tabele(wyniki)

    oczekiwane = {"mock-ok": True, "mock-blad-500": False, "mock-niedostepny": False}
    wszystko_ok = all(
        next(w for w in wyniki if w["name"] == nazwa)["available"] == oczekiwane_wynik
        for nazwa, oczekiwane_wynik in oczekiwane.items()
    )
    print()
    if wszystko_ok:
        print("SELF-TEST OK: logika health-check poprawnie klasyfikuje dostępny/niedostępny/błąd 5xx.")
        sys.exit(0)
    else:
        print("SELF-TEST NIEUDANY: sprawdź logikę sprawdz_connector().")
        sys.exit(1)


if __name__ == "__main__":
    main()
