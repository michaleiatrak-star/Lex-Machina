#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testy zgodnosc_pliku.py: FILE CHECK pliku końcowego wobec projektu (G99, T33).

Uruchomienie:  python3 -m unittest test_zgodnosc_pliku -v   (z katalogu shared/tools)
"""
import importlib.util
import os
import subprocess
import sys
import tempfile
import unittest

_TU = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("zgodnosc_pliku", os.path.join(_TU, "zgodnosc_pliku.py"))
z = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(z)

PROJEKT = ("Wnoszę o zasądzenie 12 000,00 zł.\n"
           "Należność 10 000 zł + odsetki 2 000 zł; 10 000 + 2 000 = 12 000.\n"
           "Umowa z 12 marca 2026 r. (zał. nr 1), wezwanie z 01.04.2026 (zał. nr 2).\n\n"
           "Załączniki:\n1. umowa z 12.03.2026\n2. wezwanie do zapłaty\n")


def kody(projekt, plik):
    return sorted(n["kod"] for n in z.porownaj(projekt, plik))


class Zgodnosc(unittest.TestCase):
    def test_zmiana_redakcyjna_i_zapis_kwoty_nie_jest_bledem(self):
        plik = PROJEKT.replace("Wnoszę o zasądzenie", "Powód wnosi o zasądzenie").replace("12 000,00 zł", "12000 zł")
        self.assertEqual(kody(PROJEKT, plik), [])

    def test_inna_kwota(self):
        self.assertEqual(kody(PROJEKT, PROJEKT.replace("odsetki 2 000 zł", "odsetki 2 500 zł")), ["P1", "P2"])

    def test_rachunek_niezgodny(self):
        self.assertIn("P4", kody(PROJEKT, PROJEKT.replace("= 12 000.", "= 12 400.")))

    def test_rachunek_z_odejmowaniem(self):
        self.assertEqual(z.rachunki("15 000 zł − 3 000 zł = 12 000 zł"), [])
        self.assertEqual(len(z.rachunki("15 000 - 3 000 = 11 000")), 1)

    def test_data_zmieniona(self):
        self.assertEqual(kody(PROJEKT, PROJEKT.replace("01.04.2026", "02.04.2026")), ["P3", "P3"])

    def test_brak_zalacznika_i_odwolanie_poza_spis(self):
        plik = PROJEKT.replace("2. wezwanie do zapłaty\n", "")
        self.assertEqual(kody(PROJEKT, plik), ["P5", "P7", "P8"])

    def test_numeracja_nieciagla(self):
        self.assertEqual(kody(PROJEKT, PROJEKT.replace("2. wezwanie", "3. wezwanie")), ["P6", "P7"])

    def test_czesc_robocza_pominieta(self):
        plik = PROJEKT + "\nCZĘŚĆ ROBOCZA\nkwota kontrolna 999 zł z 01.01.2020\n"
        self.assertEqual(kody(PROJEKT, plik), [])

    def test_docx_i_kod_wyjscia(self):
        import docx
        with tempfile.TemporaryDirectory() as tmp:
            projekt = os.path.join(tmp, "projekt.md")
            with open(projekt, "w", encoding="utf-8") as f:
                f.write(PROJEKT)
            d = docx.Document()
            for linia in PROJEKT.replace("odsetki 2 000 zł", "odsetki 2 500 zł").split("\n"):
                d.add_paragraph(linia)
            plik = os.path.join(tmp, "pismo.docx")
            d.save(plik)
            wynik = subprocess.run([sys.executable, os.path.join(_TU, "zgodnosc_pliku.py"), "--projekt", projekt,
                                    "--plik", plik], capture_output=True, text=True)
        self.assertEqual(wynik.returncode, 4, wynik.stdout + wynik.stderr)
        self.assertIn("FILE CHECK FAIL", wynik.stdout)
        self.assertIn("2 500,00", wynik.stdout)

    def test_self_test(self):
        self.assertEqual(z.self_test(), 0)


if __name__ == "__main__":
    unittest.main()
