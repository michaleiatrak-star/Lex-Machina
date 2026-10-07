#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testy walidator_cytowan.py: domena urzędowa po hoście, pełny identyfikator cytatu.

Uruchomienie:  python3 -m unittest test_walidator_cytowan -v   (z katalogu shared/tools)
"""
import importlib.util
import os
import unittest

_spec = importlib.util.spec_from_file_location(
    "walidator_cytowan", os.path.join(os.path.dirname(os.path.abspath(__file__)), "walidator_cytowan.py"))
w = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(w)


def potwierdzone(cytat, **zdarzenie):
    c = w.extract_citations(cytat)[0]  # typ cytatu (artykul / dziennik_ustaw / sygnatura) z ekstraktora
    return w.log_has_verification(c, [zdarzenie])[0]


class DomenaUrzedowa(unittest.TestCase):
    def test_podciag_domeny_nie_wystarcza(self):
        for url in ("https://msn.pl/211", "https://sn.pl.evil.example/211",
                    "https://evil.example/isap.sejm.gov.pl/211", "https://evil.example/?u=sn.pl&a=211"):
            self.assertFalse(potwierdzone("art. 211 KC", url=url, query_context="art. 211"), url)

    def test_wymagane_https(self):
        self.assertFalse(potwierdzone("art. 211 KC", url="http://isap.sejm.gov.pl/x", query_context="art. 211"))

    def test_subdomena_i_wynik_wyszukiwania(self):
        self.assertTrue(potwierdzone("I CSK 123/24", tool="web_search", query="I CSK 123/24",
                                     result_urls=["https://www.sn.pl/sites/orzecznictwo/I CSK 123-24.pdf"]))
        self.assertFalse(potwierdzone("I CSK 123/24", tool="web_search", query="I CSK 123/24",
                                      result_urls=["https://www.sn.pl.attacker.net/x"]))


class ZgodnoscCytatu(unittest.TestCase):
    def test_cala_liczba_nie_podciag(self):
        self.assertFalse(potwierdzone("art. 211 KC", url="https://isap.sejm.gov.pl/x", query_context="art. 2110 kc"))
        self.assertTrue(potwierdzone("art. 211 KC", url="https://isap.sejm.gov.pl/x", query_context="art. 211 kc"))

    def test_wszystkie_liczby_cytatu(self):
        self.assertFalse(potwierdzone("Dz.U. 2023 poz. 1691", url="https://isap.sejm.gov.pl/a", query_context="ustawa 2023"))
        self.assertFalse(potwierdzone("I CSK 123/24", url="https://orzeczenia.nsa.gov.pl/doc/X", query_context="I CSK 1234/24"))

    def test_sygnatura_rozna_litera_izby(self):
        self.assertFalse(potwierdzone("I CSK 123/24", url="https://www.sn.pl/x", query_context="II CSK 123/24"))

    def test_identyfikator_isap(self):
        self.assertTrue(potwierdzone("Dz.U. 2023 poz. 1691",
                                     url="https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230001691"))


if __name__ == "__main__":
    unittest.main()
