"""
test_mcp_protocol.py — referencyjny klasyfikator odpowiedzi z connectora MCP wg
SCHEMAT-ODPOWIEDZI-MCP.md, wraz z testami jednostkowymi (bez sieci).

Cel: jeśli connector MCP nie zwraca natywnie ustrukturyzowanego statusu
FOUND/NOT_FOUND/AMBIGUOUS/ERROR (patrz SCHEMAT-ODPOWIEDZI-MCP.md, sekcja
"Jeśli connector nie potrafi zwrócić tej struktury"), programista portalu może
użyć poniższej funkcji `klasyfikuj_odpowiedz()` jako gotowego, przetestowanego
punktu startowego zamiast pisać własną logikę klasyfikacji od zera.

⚠️ Status: kod jest samodzielny i przetestowany (uruchom `python -m unittest
test_mcp_protocol.py` — nie wymaga sieci ani żadnego zewnętrznego API).
Programista MUSI dostosować `klasyfikuj_odpowiedz()` do rzeczywistego,
natywnego formatu wybranego connectora (patrz KONEKTORY-REKOMENDOWANE.md) —
poniższa implementacja zakłada jeden przykładowy, generyczny kształt wejścia
(lista obiektów z polami identyfikator/status_obowiazywania), NIE jest
uniwersalna dla każdego możliwego connectora.

Użycie jako biblioteka:
    from test_mcp_protocol import klasyfikuj_odpowiedz
    wynik = klasyfikuj_odpowiedz(surowa_odpowiedz_connectora, zrodlo="sejm-eli")
"""

import unittest
from datetime import datetime, timezone


def klasyfikuj_odpowiedz(raw: dict, zrodlo: str, query_type: str = "akt_prawny") -> dict:
    """Normalizuje surową odpowiedź connectora do schematu z
    SCHEMAT-ODPOWIEDZI-MCP.md. Zakłada wejście postaci:
        {"pozycje": [{"identyfikator": "...", "tytul": "...",
                       "status_obowiazywania": "obowiazuje|uchylony|...",
                       "data": "YYYY-MM-DD", "url": "..."}, ...]}
    lub {"blad": "..."} dla przypadku błędu/timeoutu connectora.
    """
    if "blad" in raw:
        return {
            "status": "ERROR",
            "query_type": query_type,
            "source": zrodlo,
            "detail": raw["blad"],
            "retrieved_at": datetime.now(timezone.utc).isoformat(),
        }

    pozycje = raw.get("pozycje", [])

    if len(pozycje) == 0:
        return {
            "status": "NOT_FOUND",
            "query_type": query_type,
            "source": zrodlo,
            "retrieved_at": datetime.now(timezone.utc).isoformat(),
        }

    if len(pozycje) > 1:
        return {
            "status": "AMBIGUOUS",
            "query_type": query_type,
            "source": zrodlo,
            "kandydaci": [p.get("identyfikator") for p in pozycje],
            "retrieved_at": datetime.now(timezone.utc).isoformat(),
        }

    p = pozycje[0]
    return {
        "status": "FOUND",
        "query_type": query_type,
        "source": zrodlo,
        "result": {
            "identyfikator": p.get("identyfikator"),
            "tytul_lub_nazwa": p.get("tytul"),
            "status_obowiazywania": p.get("status_obowiazywania", "nieznany"),
            "data_publikacji_lub_wyroku": p.get("data"),
            "url_zrodlowy": p.get("url"),
        },
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "confidence": "deterministic",
    }


def wymaga_fallbacku_hardgate(sklasyfikowana_odpowiedz: dict) -> bool:
    """Implementuje regułę z shared/MCP-INTEGRACJA.md KROK 2-3: kiedy
    wynik MCP NIE jest wystarczający i trzeba przejść do HARD GATE."""
    status = sklasyfikowana_odpowiedz.get("status")
    if status in ("NOT_FOUND", "AMBIGUOUS", "ERROR"):
        return True
    if status == "FOUND":
        stan = sklasyfikowana_odpowiedz.get("result", {}).get("status_obowiazywania")
        if stan in ("uchylony", "tekst_jednolity_nieaktualny", "nieznany"):
            return True
        return False
    return True  # domyślnie bezpiecznie: nieznany status → fallback


class TestKlasyfikacjaMCP(unittest.TestCase):

    def test_found_obowiazuje_nie_wymaga_fallbacku(self):
        raw = {"pozycje": [{"identyfikator": "Dz.U. 2025 poz. 1071", "tytul": "KC",
                             "status_obowiazywania": "obowiazuje", "data": "2025-06-01",
                             "url": "https://isap.example/1071"}]}
        wynik = klasyfikuj_odpowiedz(raw, zrodlo="sejm-eli")
        self.assertEqual(wynik["status"], "FOUND")
        self.assertFalse(wymaga_fallbacku_hardgate(wynik))

    def test_found_uchylony_wymaga_fallbacku(self):
        raw = {"pozycje": [{"identyfikator": "Dz.U. 2020 poz. 100", "tytul": "Stara ustawa",
                             "status_obowiazywania": "uchylony", "data": "2020-01-01",
                             "url": "https://isap.example/100"}]}
        wynik = klasyfikuj_odpowiedz(raw, zrodlo="sejm-eli")
        self.assertEqual(wynik["status"], "FOUND")
        self.assertTrue(wymaga_fallbacku_hardgate(wynik))

    def test_not_found(self):
        wynik = klasyfikuj_odpowiedz({"pozycje": []}, zrodlo="saos")
        self.assertEqual(wynik["status"], "NOT_FOUND")
        self.assertTrue(wymaga_fallbacku_hardgate(wynik))

    def test_ambiguous(self):
        raw = {"pozycje": [
            {"identyfikator": "Dz.U. 2024 poz. 1", "tytul": "A"},
            {"identyfikator": "Dz.U. 2024 poz. 2", "tytul": "B"},
        ]}
        wynik = klasyfikuj_odpowiedz(raw, zrodlo="sejm-eli")
        self.assertEqual(wynik["status"], "AMBIGUOUS")
        self.assertEqual(len(wynik["kandydaci"]), 2)
        self.assertTrue(wymaga_fallbacku_hardgate(wynik))

    def test_error_timeout(self):
        wynik = klasyfikuj_odpowiedz({"blad": "timeout po 15s"}, zrodlo="cbosa")
        self.assertEqual(wynik["status"], "ERROR")
        self.assertTrue(wymaga_fallbacku_hardgate(wynik))

    def test_found_bez_pola_status_obowiazywania_traktowany_jako_nieznany(self):
        raw = {"pozycje": [{"identyfikator": "Dz.U. 2025 poz. 5", "tytul": "X",
                             "data": "2025-01-01", "url": "u"}]}
        wynik = klasyfikuj_odpowiedz(raw, zrodlo="sejm-eli")
        self.assertEqual(wynik["result"]["status_obowiazywania"], "nieznany")
        self.assertTrue(wymaga_fallbacku_hardgate(wynik))


if __name__ == "__main__":
    unittest.main()
