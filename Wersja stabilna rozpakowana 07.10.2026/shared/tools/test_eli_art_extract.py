#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Testy eli_art_extract.py (F-201). Offline: stdlib unittest, bez sieci.

Uruchomienie:  python3 -m unittest test_eli_art_extract -v   (z katalogu shared/tools)
Tryb live:     LEX_LIVE=1 python3 -m unittest test_eli_art_extract -v
Fixture'y odtwarzają zbadany kształt HTML api.sejm.gov.pl (t.j. KP Dz.U. 2023 poz. 1465):
sekcja part_1 = treść obwieszczenia z przytoczeniami ustaw zmieniających,
sekcja part_2 = załącznik z tekstem jednolitym.
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from eli_art_extract import parsuj_cytat, wybierz_tekst, wyciagnij  # noqa: E402

OBWIESZCZENIE = """
<html><body>
<section id="part_1"><div class="part" id="_001"><h2 class="part">Treść obwieszczenia</h2>
 <div class="unit unit_pass" id="pass_2" data-id="pass_2"><div class="unit-inner">
  <div class="unit unit_pint" id="pass_2-pint_2" data-id="pint_2"><div class="unit-inner">
   <div class="unit unit_arti" id="pass_2-pint_2-arti_22" data-id="arti_22"><h3>Art.&nbsp;22.</h3>
    <div class="unit-inner">
     <div class="unit unit_pass" id="pass_2-pint_2-arti_22-pass_1" data-id="pass_1"><h3>1.</h3>
      <div class="unit-inner">Do funkcjonujących rodzin zastępczych stosuje się przepisy dotychczasowe.</div></div>
    </div></div>
  </div></div>
 </div></div>
</div></section>
<section id="part_2"><div class="part" id="_002"><h2 class="part"><span>Załącznik</span>&nbsp;-&nbsp;Tekst jednolity ustawy
 <a class="gloss-link tooltip" href="#g1"><sup>1)</sup><span class="tooltip-text">Przypis o dyrektywach.</span></a></h2>
 <div class="unit unit_bran" id="bran_DRUGI" data-id="bran_DRUGI"><div class="unit-inner">
  <div class="unit unit_arti" id="bran_DRUGI-chpt_I-arti_22" data-id="arti_22"><h3>Art.&nbsp;22.</h3>
   <div class="unit-inner">
    <div class="unit unit_para" id="bran_DRUGI-chpt_I-arti_22-para_1" data-id="para_1"><h3>§&nbsp;1.</h3>
     <div class="unit-inner">Przez nawiązanie stosunku pracy pracownik zobowiązuje się
     <a class="gloss-link tooltip" href="#g2"><sup>2)</sup><span class="tooltip-text">PRZYPIS-NIE-DO-TEKSTU</span></a>
     do wykonywania pracy.</div></div>
    <div class="unit unit_para" id="bran_DRUGI-chpt_I-arti_22-para_1_1" data-id="para_1_1"><h3>§&nbsp;1<sup>1</sup>.</h3>
     <div class="unit-inner">Zatrudnienie w warunkach określonych w § 1.</div></div>
   </div></div>
  <div class="unit unit_arti" id="bran_DRUGI-chpt_I-arti_22_1" data-id="arti_22_1"><h3><b>Art.&nbsp;22<sup>1</sup>.</b></h3>
   <div class="unit-inner">
    <div class="unit unit_para" id="bran_DRUGI-chpt_I-arti_22_1-para_2" data-id="para_2"><h3>§&nbsp;2.</h3>
     <div class="unit-inner">Pracodawca żąda podania danych.</div></div>
   </div></div>
  <div class="unit unit_arti" id="bran_DRUGI-chpt_I-arti_36_a" data-id="arti_36_a"><h3>Art.&nbsp;36a.</h3>
   <div class="unit-inner">
    <div class="unit unit_pass" id="bran_DRUGI-chpt_I-arti_36_a-pass_2" data-id="pass_2"><h3>2.</h3>
     <div class="unit-inner">
      <div class="unit unit_pint" id="bran_DRUGI-chpt_I-arti_36_a-pass_2-pint_1" data-id="pint_1"><h3>1)</h3>
       <div class="unit-inner">
        <div class="unit unit_lett" id="bran_DRUGI-chpt_I-arti_36_a-pass_2-pint_1-lett_b" data-id="lett_b"><h3>b)</h3>
         <div class="unit-inner">treść litery b.</div></div>
       </div></div>
     </div></div>
   </div></div>
  <div class="unit unit_arti" id="bran_DRUGI-chpt_I-arti_77" data-id="arti_77"><h3>Art. 77.</h3><div class="unit-inner">Pierwsza kopia.</div></div>
  <div class="unit unit_arti" id="bran_DRUGI-chpt_II-arti_77" data-id="arti_77"><h3>Art. 77.</h3><div class="unit-inner">Druga kopia.</div></div>
  <div class="unit unit_arti" id="pass_9-pint_9-arti_88" data-id="arti_88"><h3>Art. 88.</h3><div class="unit-inner">Przytoczenie w załączniku.</div></div>
 </div></div>
</div></section>
<div class="gloss-section">Przypisy: PRZYPIS-NIE-DO-TEKSTU</div>
</body></html>
"""


class TestParsujCytat(unittest.TestCase):
    def test_indeks_gorny_i_litera(self):
        self.assertEqual(parsuj_cytat("art. 22 § 1¹"), [("arti", ["22"]), ("para", ["1_1"])])
        self.assertEqual(parsuj_cytat("art. 385(1) § 1")[0], ("arti", ["385_1"]))
        self.assertEqual(parsuj_cytat("art. 22¹a")[0], ("arti", ["22_1_a"]))
        self.assertEqual(parsuj_cytat("art. 36a ust. 2 pkt 1 lit. b")[-1], ("lett", ["b"]))

    def test_kod_aktu_ignorowany(self):
        self.assertEqual(parsuj_cytat("art. 22 § 1 KP"), [("arti", ["22"]), ("para", ["1"])])


class TestWyciagnij(unittest.TestCase):
    def test_pulapka_obwieszczenia(self):
        """U-9: art. 22 z treści obwieszczenia NIE może zostać zwrócony."""
        w = wyciagnij(OBWIESZCZENIE, "art. 22 § 1")
        self.assertEqual(w["status"], "FOUND")
        self.assertTrue(w["tekst"].startswith("§ 1. Przez nawiązanie stosunku pracy"))
        self.assertNotIn("rodzin zastępczych", w["tekst"])
        self.assertIn("part_2", w["czesc"])
        self.assertEqual(w["trafienia_w_innych_czesciach"], 1)

    def test_przypisy_pominiete(self):
        w = wyciagnij(OBWIESZCZENIE, "art. 22 § 1")
        self.assertNotIn("PRZYPIS-NIE-DO-TEKSTU", w["tekst"])

    def test_paragraf_z_indeksem(self):
        w = wyciagnij(OBWIESZCZENIE, "art. 22 § 1¹")
        self.assertEqual(w["status"], "FOUND")
        self.assertTrue(w["tekst"].startswith("§ 1¹."))

    def test_artykul_z_indeksem(self):
        w = wyciagnij(OBWIESZCZENIE, "art. 22¹ § 2")
        self.assertEqual(w["tekst"], "§ 2. Pracodawca żąda podania danych.")

    def test_pelna_sciezka_litera(self):
        w = wyciagnij(OBWIESZCZENIE, "art. 36a ust. 2 pkt 1 lit. b")
        self.assertEqual(w["status"], "FOUND")
        self.assertEqual(w["tekst"], "b) treść litery b.")

    def test_tylko_w_obwieszczeniu_to_not_found(self):
        html = OBWIESZCZENIE.replace('data-id="arti_22"><h3>Art.&nbsp;22.</h3>\n   <div class="unit-inner">\n    <div class="unit unit_para"',
                                     'data-id="arti_2222"><h3>Art.&nbsp;22.</h3>\n   <div class="unit-inner">\n    <div class="unit unit_para"')
        w = wyciagnij(html, "art. 22")
        self.assertEqual(w["status"], "NOT_FOUND")
        self.assertIn("obwieszczenia", w["uwaga"])

    def test_niejednoznacznosc(self):
        w = wyciagnij(OBWIESZCZENIE, "art. 77")
        self.assertEqual(w["status"], "AMBIGUOUS")
        self.assertEqual(len(w["kandydaci"]), 2)

    def test_brak_jednostki_podrzednej(self):
        w = wyciagnij(OBWIESZCZENIE, "art. 22 § 9")
        self.assertEqual(w["status"], "NOT_FOUND")
        self.assertIn("para_", w["uwaga"])

    def test_poza_zakresem(self):
        self.assertEqual(wyciagnij(OBWIESZCZENIE, "§ 3 rozporządzenia")["status"], "OUT_OF_SCOPE")


class TestAktualnosc(unittest.TestCase):
    META = {"ELI": "DU/1974/141", "references": {"Inf. o tekście jednolitym": [
        {"id": "DU/2016/1666"}, {"id": "DU/2026/1245"}, {"id": "DU/2023/1465"}, {"id": "DU/2025/277"}]}}

    def test_nowszy_tj_tylko_pdf(self):
        tj = {"DU/2026/1245": {"textHTML": False}, "DU/2025/277": {"textHTML": False},
              "DU/2023/1465": {"textHTML": True}, "DU/2016/1666": {"textHTML": True}}
        p = wybierz_tekst(self.META, tj)
        self.assertEqual(p, {"czytaj": "DU/2023/1465", "aktualnosc": "STARSZY_TJ_NOWSZY_TYLKO_PDF",
                             "tj_najnowszy": "DU/2026/1245"})

    def test_aktualny(self):
        tj = {k["id"]: {"textHTML": True} for k in self.META["references"]["Inf. o tekście jednolitym"]}
        self.assertEqual(wybierz_tekst(self.META, tj)["aktualnosc"], "AKTUALNY_TJ")

    def test_brak_tj_html(self):
        p = wybierz_tekst(self.META, {})
        self.assertEqual(p["aktualnosc"], "ORYGINAL")


@unittest.skipUnless(os.environ.get("LEX_LIVE") == "1", "tryb live: LEX_LIVE=1")
class TestLive(unittest.TestCase):
    def test_kp_art_22_par_1(self):
        """Przypadek kontrolny U-9. Brzmienie potwierdzone 2026-09-26 w t.j. Dz.U. 2026 poz. 1245 (PDF, RZĄD 1)."""
        from eli_art_extract import pobierz
        w = pobierz("DU/1974/141", "art. 22 § 1")
        self.assertEqual(w["status"], "FOUND")
        self.assertTrue(w["tekst"].startswith("§ 1. Przez nawiązanie stosunku pracy"))
        self.assertNotIn("rodzin", w["tekst"])


if __name__ == "__main__":
    unittest.main()
