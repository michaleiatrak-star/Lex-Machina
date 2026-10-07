#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testy kontrakt_rachunek.py (F-215). Offline, stdlib. Liczby oczekiwane w przypadku T&M
są te same, co w manifeście `analizator-umow-v1/benchmark/posiane-wady/manifesty/manifest.yaml`
(umowa 04) — test pilnuje, że narzędzie liczy tak jak złoty standard.
Odtworzone 2026-10-01b (AUDYT-2026-10-01b) z zapisu sesji AUDYT-2026-09-29 — plik nie trafił do repozytorium."""
import unittest
from decimal import Decimal as D

import kontrakt_rachunek as K


def zr(w, z="§x"):
    return {"wartosc": w, "zrodlo": z}


TM04 = {
    "tm": {"stawka_h": zr(190, "§1.2"), "liczba_osob": zr(2, "§1.1"), "godziny_mies_na_osobe": zr(160, "§1.1")},
    "okres_miesiecy": zr(12, "§5.1"),
    "cap": {"krotnosc_wynagrodzenia_mies": zr(12, "§3.1")},
    "kary": [
        {"nazwa": "opóźnienie sprintu", "zrodlo": "§2.1", "typ": "dzienna_pct", "procent": zr(0.4, "§2.1"),
         "poza_capem": True, "zalezy_od_IC": True},
        {"nazwa": "wada krytyczna", "zrodlo": "§2.2", "typ": "za_przypadek", "kwota": zr(4000, "§2.2"), "poza_capem": True},
    ],
    "indemnifikacje": [{"nazwa": "indemnifikacja IP", "zrodlo": "§3.3", "poza_capem": True}],
    "terminy": {"data_zawarcia": "2026-04-02", "okres_miesiecy": zr(12, "§5.1"), "okno_dni": zr(60, "§5.2"),
                "podwyzka_pct": zr(6, "§5.3")},
    "scenariusz_dni_opoznienia": 30,
}


class Oblicz(unittest.TestCase):
    def test_podstawy(self):
        self.assertEqual(K.oblicz("190*2*160"), D(60800))
        self.assertEqual(K.oblicz("60800*12"), D(729600))
        self.assertEqual(K.oblicz("0,4/100*60800"), D("243.2"))
        self.assertEqual(K.oblicz("190*(1+6/100)"), D("201.4"))

    def test_bezpieczenstwo(self):
        for zle in ("__import__('os')", "a+1", "'x'*3", "open('f')"):
            with self.assertRaises((ValueError, SyntaxError)):
                K.oblicz(zle)


class Ekspozycja(unittest.TestCase):
    def test_umowa_tm_jak_manifest(self):
        r = K.ekspozycja(TM04)
        self.assertEqual(r["wynagrodzenie_miesieczne"], "60 800")
        self.assertEqual(r["wartosc_umowy"], "729 600")
        self.assertEqual(r["E1"]["cap_nominalny"], "729 600")
        self.assertEqual(r["E1"]["efektywna"], "NIEOGRANICZONA")      # indemnifikacja IP bez limitu + kara bez sufitu
        kara = r["E2"][0]
        self.assertEqual(kara["za_dzien"], "243,20")
        self.assertIn("BEZ SUFITU", kara["uwaga"])
        self.assertEqual(r["E4"]["stawka_po_przedluzeniu"], "201,40")
        self.assertEqual(r["E4"]["wynagrodzenie_mies_po_przedluzeniu"], "64 448")
        self.assertEqual(r["E4"]["koniec_okresu"], "2027-04-02")
        self.assertEqual(r["E4"]["ostatni_dzien_na_oswiadczenie"], "2027-02-01")
        self.assertIn("opóźnienie sprintu (§2.1)", r["zalezne_od_IC"])
        self.assertTrue(r["linia_R_EKS"].startswith("R-EKS: E1 = NIEOGRANICZONA"))

    def test_policzalna_z_sufitem(self):
        d = {"wynagrodzenie_miesieczne": zr(10000, "§4"), "okres_miesiecy": zr(12, "§9"),
             "cap": {"kwota": zr(120000, "§5.1")},
             "kary": [{"nazwa": "SLA", "zrodlo": "§4.2", "typ": "dzienna_kwota", "kwota": zr(500, "§4.2"),
                       "sufit": zr(18000, "§4.3"), "poza_capem": True}],
             "asymetria": {"strona_A": zr(120000, "§5.1"), "strona_B": zr(10000, "§5.2")}}
        r = K.ekspozycja(d)
        self.assertEqual(r["E1"]["efektywna"], "138 000")
        self.assertEqual(r["E1"]["krotnosc_wartosci"], "1,15")
        self.assertEqual(r["E3"]["krotnosc"], "12")
        self.assertIn("15 000", r["E2"][0]["scenariusz"])            # 500 × 30 < sufit

    def test_liczba_bez_zrodla_blokuje(self):
        with self.assertRaises(K.BrakZrodla):
            K.ekspozycja({"wynagrodzenie_miesieczne": {"wartosc": 1000}})
        with self.assertRaises(K.BrakZrodla):
            K.ekspozycja({"wynagrodzenie_miesieczne": 1000})

    def test_brak_capu_to_brak_danych_nie_zero(self):
        r = K.ekspozycja({"wynagrodzenie_miesieczne": zr(1000)})
        self.assertEqual(r["E1"]["efektywna"], "BRAK DANYCH")
        self.assertIn("limit odpowiedzialności (cap)", r["brak_danych"])


class Slownie(unittest.TestCase):
    def test_odmiana(self):
        self.assertEqual(K.slowa_na_liczbe("sto sześćdziesiąt".split()), 160)
        self.assertEqual(K.slowa_na_liczbe(["osiemnastu"]), 18)
        self.assertEqual(K.slowa_na_liczbe("dziewięć tysięcy pięćset".split()), 9500)
        self.assertEqual(K.slowa_na_liczbe("sto pięćdziesiąt tysięcy".split()), 150000)
        self.assertEqual(K.slowa_na_liczbe("dwa miliony trzysta tysięcy".split()), 2300000)
        self.assertIsNone(K.slowa_na_liczbe(["dwa", "egzemplarze"]))

    def test_rozbieznosc_i_zgodnosc(self):
        t = ("Abonament wynosi **osiem tysięcy złotych netto** (słownie), tj. **9.800,00 zł netto**.\n\n"
             "Zespół 2 (dwóch) osób, 160 (sto sześćdziesiąt) godzin.\n\n"
             "Umowę sporządzono w dwóch egzemplarzach.")
        r = K.slownie(t)
        st = {(p["cyfra"], p["status"]) for p in r}
        self.assertIn(("9.800,00", "ROZBIEZNOSC"), st)
        self.assertIn(("2", "OK"), st)
        self.assertIn(("160", "OK"), st)
        self.assertEqual(len(r), 3)                                  # „dwóch egzemplarzach” bez kontekstu → pominięte

    def test_nie_paruje_z_nip_kod_pocztowy(self):
        r = K.slownie("NIP 7252345678, 90-425 Łódź, kara 4.000,00 zł (słownie: cztery tysiące złotych).")
        self.assertEqual([(p["cyfra"], p["status"]) for p in r], [("4.000,00", "OK")])


class Odeslania(unittest.TestCase):
    UM = ("## §1 Przedmiot\n\n1.1. Treść.\n1.2. Zob. ust. 1.1 oraz §2 ust. 2.1.\n\n"
          "## §2 Kary\n\n2.1. Kara wg art. 484 § 1 KC.\n2.2. Tryb z §10 ust. 5 oraz ust. 2.7.\n"
          "2.3. Opis w Załączniku nr 3.\n\n---\n*Załączniki: nr 1 (SLA),\nnr 2 (Harmonogram).*\n")

    def test_martwe(self):
        r = K.odeslania(self.UM)
        odes = sorted(u["odeslanie"] for u in r["ustalenia"])
        self.assertEqual(r["status"], "ROZBIEZNOSC")
        self.assertIn("§10 ust. 5", odes)
        self.assertIn("ust. 2.7", odes)
        self.assertIn("Załączniku nr 3", odes)
        self.assertEqual(len(odes), 3)                               # art. 484 § 1 KC nie jest jednostką umowy

    def test_wykaz_zalacznikow_w_dwoch_liniach(self):
        # regresja 2026-09-29: fałszywy alarm na umowie kontrolnej 01
        r = K.odeslania("## §1 X\n\n1.1. Zob. Załącznik nr 2.\n\n*Załączniki: nr 1 (A),\nnr 2 (B).*\n")
        self.assertEqual(r["status"], "OK")


class Cytaty(unittest.TestCase):
    T = "3.1. Łączna odpowiedzialność Wykonawcy z tytułu niewykonania lub nienależytego\nwykonania umowy ograniczona jest do **„Capu Rocznego”** — wyłącznie."

    def test_tolerancje(self):
        r = K.cytaty(self.T, ["nienależytego wykonania umowy", 'ograniczona jest do "Capu Rocznego" - wyłącznie'])
        self.assertEqual(r["status"], "OK")

    def test_zmyslony(self):
        r = K.cytaty(self.T, [{"cytat": "ograniczona jest do dwukrotności wynagrodzenia", "lokalizacja": "§3.1"}])
        self.assertEqual(r["status"], "ROZBIEZNOSC")
        c = r["cytaty"][0]
        self.assertEqual(c["status"], "NIEZWERYFIKOWANY")
        self.assertEqual(c["zgodny_prefiks_slow"], "3/5")
        self.assertTrue(c["rozjazd_od"].startswith("dwukrotności"))


if __name__ == "__main__":
    unittest.main(verbosity=1)
