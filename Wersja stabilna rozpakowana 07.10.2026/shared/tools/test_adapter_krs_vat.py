#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testy adapter_krs_vat.py (F-204). Offline: stdlib unittest, bez sieci.

Uruchomienie:  python3 -m unittest test_adapter_krs_vat -v   (z katalogu shared/tools)
Tryb live:     LEX_LIVE=1 python3 -m unittest test_adapter_krs_vat -v

Fixture KRS_ORANGE_MIN odtwarza (w skróconej formie — bez 46 wpisów historii
statutu, nieistotnych dla parsera) kształt odpowiedzi zmierzonej LIVE
2026-09-26 dla KRS 0000010681 (ORANGE POLSKA S.A.), łącznie z anonimizacją
składu organu identyczną z tą, jaką faktycznie zwraca API (inicjały,
maskowany PESEL) — nie jest to wymyślony schemat.

Fixture WL_ORANGE odtwarza kształt opisany (i zadeklarowany jako zmierzony
end-to-end) w shared/DOSTEP-MASZYNOWY-API.md §4 dla tego samego podmiotu
(ta sama para NIP/REGON co w KRS_ORANGE_MIN — potwierdzenie krzyżowe).
Ten kształt NIE został ponownie zmierzony w tej sesji (wl-api zablokowane
przez WAF Incapsula z tego środowiska, patrz test_wl_live_lub_blokada_waf).
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from adapter_krs_vat import (  # noqa: E402
    LicznikWL,
    WLDailyLimitReached,
    waliduj_krs,
    waliduj_nip,
    zapytaj_krs,
    zapytaj_wl,
)

KRS_ORANGE_MIN = {
    "odpis": {
        "rodzaj": "Aktualny",
        "naglowekA": {
            "rejestr": "RejP",
            "numerKRS": "0000010681",
            "stanZDnia": "24.04.2026",
            "dataRejestracjiWKRS": "02.05.2001",
        },
        "dane": {
            "dzial1": {
                "danePodmiotu": {
                    "formaPrawna": "SPÓŁKA AKCYJNA",
                    "identyfikatory": {"regon": "01210078400000", "nip": "5260250995"},
                    "nazwa": "ORANGE POLSKA SPÓŁKA AKCYJNA",
                },
                "siedzibaIAdres": {
                    "siedziba": {"miejscowosc": "WARSZAWA"},
                    "adres": {
                        "ulica": "AL. JEROZOLIMSKIE", "nrDomu": "160",
                        "miejscowosc": "WARSZAWA", "kodPocztowy": "02-326",
                    },
                },
            },
            "dzial2": {
                "reprezentacja": {
                    "nazwaOrganu": "ZARZĄD SPÓŁKI",
                    "sposobReprezentacji": "PREZES ŁĄCZNIE Z CZŁONKIEM ZARZĄDU",
                    "sklad": [
                        {
                            "nazwisko": {"nazwiskoICzlon": "K*******"},
                            "imiona": {"imie": "J****"},
                            "identyfikator": {"pesel": "6**********"},
                            "funkcjaWOrganie": "CZŁONEK ZARZĄDU",
                            "czyZawieszona": False,
                        },
                        {
                            "nazwisko": {"nazwiskoICzlon": "C*****"},
                            "imiona": {"imie": "L*******"},
                            "identyfikator": {"dataUrodzenia": "11.04.1975"},
                            "funkcjaWOrganie": "PREZES ZARZĄDU",
                            "czyZawieszona": False,
                        },
                    ],
                }
            },
        },
    }
}

WL_ORANGE = {
    "result": {
        "subject": {
            "name": "ORANGE POLSKA SPÓŁKA AKCYJNA",
            "nip": "5260250995",
            "regon": "01210078400000",
            "krs": "0000010681",
            "statusVat": "Czynny",
            "accountNumbers": ["11" + "0" * 24],
            "representatives": [],
        },
        "requestId": "TEST-REQUEST-ID-0001",
    }
}


def _transport_z(kod: int, cialo: bytes):
    def _t(url: str):
        return kod, cialo
    return _t


class TestWalidacja(unittest.TestCase):
    def test_krs_dopelnia_zerami(self):
        self.assertEqual(waliduj_krs("10681"), "0000010681")
        self.assertEqual(waliduj_krs("0000010681"), "0000010681")

    def test_krs_odrzuca_niepoprawne(self):
        self.assertIsNone(waliduj_krs(""))
        self.assertIsNone(waliduj_krs("abc"))
        self.assertIsNone(waliduj_krs("12345678901"))  # 11 cyfr

    def test_nip_suma_kontrolna_poprawna(self):
        # 526-025-09-95 — Orange Polska, zmierzony żywy NIP (nie zmyślony)
        self.assertTrue(waliduj_nip("5260250995"))

    def test_nip_suma_kontrolna_niepoprawna(self):
        self.assertFalse(waliduj_nip("5260250996"))  # ostatnia cyfra zmieniona
        self.assertFalse(waliduj_nip("123"))  # zła długość
        # "1234567890": suma ważona pierwszych 9 cyfr = 230, 230 % 11 == 10 →
        # z definicji NIEPOPRAWNY niezależnie od 10. cyfry (mod 11 == 10 nie
        # ma odpowiadającej cyfry kontrolnej 0-9).
        self.assertFalse(waliduj_nip("1234567890"))


class TestKRS(unittest.TestCase):
    def test_found_wyciaga_pola_zgodnie_ze_zmierzonym_schematem(self):
        cialo = json.dumps(KRS_ORANGE_MIN).encode("utf-8")
        wynik = zapytaj_krs("10681", transport=_transport_z(200, cialo))
        self.assertEqual(wynik.status, "FOUND")
        self.assertEqual(wynik.dane["nazwa"], "ORANGE POLSKA SPÓŁKA AKCYJNA")
        self.assertEqual(wynik.dane["nip"], "5260250995")
        self.assertEqual(wynik.dane["regon"], "01210078400000")
        self.assertEqual(wynik.dane["numer_krs"], "0000010681")
        self.assertEqual(wynik.dane["sposob_reprezentacji"], "PREZES ŁĄCZNIE Z CZŁONKIEM ZARZĄDU")
        self.assertEqual(len(wynik.dane["sklad_organu"]), 2)
        self.assertTrue(any("zanonimizowany" in u for u in wynik.uwagi))

    def test_not_found_404(self):
        cialo = json.dumps(
            {"type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
             "title": "Not Found", "status": 404, "traceId": "xyz"}
        ).encode("utf-8")
        wynik = zapytaj_krs("0000000001", transport=_transport_z(404, cialo))
        self.assertEqual(wynik.status, "NOT_FOUND")

    def test_invalid_odpis(self):
        wynik = zapytaj_krs("10681", odpis="Cos innego")
        self.assertEqual(wynik.status, "INVALID_INPUT")

    def test_invalid_rejestr(self):
        wynik = zapytaj_krs("10681", rejestr="X")
        self.assertEqual(wynik.status, "INVALID_INPUT")

    def test_invalid_numer(self):
        wynik = zapytaj_krs("nie-numer")
        self.assertEqual(wynik.status, "INVALID_INPUT")

    def test_error_500(self):
        wynik = zapytaj_krs("10681", transport=_transport_z(500, b"boom"))
        self.assertEqual(wynik.status, "ERROR")

    def test_error_polaczenia(self):
        def _t(url):
            raise ConnectionError("brak sieci")
        wynik = zapytaj_krs("10681", transport=_t)
        self.assertEqual(wynik.status, "ERROR")


class TestWL(unittest.TestCase):
    def test_wymaga_daty(self):
        wynik = zapytaj_wl("5260250995", data=None)
        self.assertEqual(wynik.status, "INVALID_INPUT")

    def test_odrzuca_zly_format_daty(self):
        wynik = zapytaj_wl("5260250995", data="26-09-2026")
        self.assertEqual(wynik.status, "INVALID_INPUT")

    def test_odrzuca_niepoprawny_nip(self):
        # "1234567890" ma kontrolną = 10 (patrz TestWalidacja) — z definicji
        # niepoprawny NIP, więc gate musi zatrzymać PRZED jakąkolwiek próbą
        # transportu; brak jawnego `transport=` jest tu celowe — test
        # weryfikuje, że w tym przypadku default transport NIGDY się nie
        # wywoła (inaczej test próbowałby realnego połączenia sieciowego).
        wynik = zapytaj_wl("1234567890", data="2026-09-26")
        self.assertEqual(wynik.status, "INVALID_INPUT")

    def test_found(self):
        cialo = json.dumps(WL_ORANGE).encode("utf-8")
        wynik = zapytaj_wl("5260250995", data="2026-09-26", transport=_transport_z(200, cialo))
        self.assertEqual(wynik.status, "FOUND")
        self.assertEqual(wynik.dane["status_vat"], "Czynny")
        self.assertEqual(wynik.dane["request_id"], "TEST-REQUEST-ID-0001")

    def test_not_found_bez_subject(self):
        cialo = json.dumps({"result": {"subject": None, "requestId": "R2"}}).encode("utf-8")
        wynik = zapytaj_wl("5260250995", data="2026-09-26", transport=_transport_z(200, cialo))
        self.assertEqual(wynik.status, "NOT_FOUND")

    def test_rachunek_26_zer_HTTP_400_WL_111(self):
        cialo = json.dumps({"code": "WL-111", "message": "Nieprawidłowy numer konta bankowego"}).encode("utf-8")
        wynik = zapytaj_wl(
            "5260250995", data="2026-09-26", rachunek="0" * 26, transport=_transport_z(400, cialo)
        )
        self.assertEqual(wynik.status, "INVALID_INPUT")
        self.assertIn("WL-111", wynik.uwagi[0])

    def test_rachunek_zla_dlugosc_odrzucony_lokalnie(self):
        wynik = zapytaj_wl("5260250995", data="2026-09-26", rachunek="123")
        self.assertEqual(wynik.status, "INVALID_INPUT")

    def test_html_zamiast_json_daje_ERROR_z_podpowiedzia_waf(self):
        # Symuluje dokładnie to, co zaobserwowano live: HTTP 200 + strona
        # wyzwania Incapsula zamiast JSON.
        cialo = b'<html><head><script src="/_Incapsula_Resource?x=1"></script></head></html>'
        wynik = zapytaj_wl("5260250995", data="2026-09-26", transport=_transport_z(200, cialo))
        self.assertEqual(wynik.status, "ERROR")
        self.assertTrue(any("WAF" in u or "Incapsula" in u for u in wynik.uwagi))

    def test_licznik_dobowy_ostrzega_po_przekroczeniu(self):
        licznik = LicznikWL(limit=2)
        cialo = json.dumps(WL_ORANGE).encode("utf-8")
        zapytaj_wl("5260250995", data="2026-09-26", transport=_transport_z(200, cialo), licznik=licznik)
        zapytaj_wl("5260250995", data="2026-09-26", transport=_transport_z(200, cialo), licznik=licznik)
        with self.assertRaises(WLDailyLimitReached):
            zapytaj_wl("5260250995", data="2026-09-26", transport=_transport_z(200, cialo), licznik=licznik)


@unittest.skipUnless(os.environ.get("LEX_LIVE") == "1", "sonda live wyłączona domyślnie (LEX_LIVE=1 by włączyć)")
class TestLive(unittest.TestCase):
    def test_krs_live_orange(self):
        """Zmierzone jako działające 2026-09-26 z tego środowiska. Jeśli w
        innym środowisku ten test zawiedzie z powodu sieci (nie z powodu
        zmiany schematu), to zgodne z F-183a/F-171: różne środowiska mają
        różny egress, nie jest to regresja kodu."""
        wynik = zapytaj_krs("0000010681")
        self.assertIn(wynik.status, ("FOUND", "ERROR"))
        if wynik.status == "FOUND":
            self.assertEqual(wynik.dane["nip"], "5260250995")

    def test_wl_live_lub_blokada_waf(self):
        """Zmierzone jako ZABLOKOWANE (Incapsula WAF) 2026-09-26 z tego
        środowiska — ten test PRZECHODZI zarówno gdy API odpowiada (FOUND/
        NOT_FOUND), jak i gdy adapter poprawnie rozpoznaje blokadę WAF jako
        ERROR z czytelną podpowiedzią (nie jako fałszywy NOT_FOUND)."""
        wynik = zapytaj_wl("5260250995", data=datetime_today())
        self.assertIn(wynik.status, ("FOUND", "NOT_FOUND", "ERROR"))
        if wynik.status == "ERROR":
            self.assertTrue(any("WAF" in u or "Incapsula" in u for u in wynik.uwagi))


def datetime_today() -> str:
    import datetime as _dt
    return _dt.date.today().isoformat()


if __name__ == "__main__":
    unittest.main()
