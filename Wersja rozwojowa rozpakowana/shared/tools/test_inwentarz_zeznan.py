"""Regresja F-240: niepamiec swiadka wobec wiedzy z wczesniejszego protokolu (dane fikcyjne)."""
import subprocess
import sys
import tempfile
from pathlib import Path

TOOL = Path(__file__).with_name("inwentarz_zeznan.py")

PIERWSZY = """Sygn. akt II P 1/26
Dnia 3 marca 2026 r.
00:10:00   Staje swiadek – Jan Nowak
           lat 40, obcy wobec stron, pouczony, zeznaje:
           Pracuje u pozwanej jako koordynator. Powod byl zatrudniony na poczatku jako
           informatyk, a pozniej zostal rekruterem.
00:12:00   Na pytania powoda:
           - Jak powod byl informatykiem to wspolpraca ukladala sie dobrze. Pozniej jak
           powod zostal rekruterem to nasza wspolpraca nie ukladala sie dobrze.
           Przewodniczaca uchylila pytanie powoda.
00:14:00   Na pytania powoda:
           - Bylo zarzadzenie wewnetrzne u pozwanej, zeby pracownicy nie kontaktowali sie
           z powodem.
00:15:00   Swiadka zwolniono.
"""

DRUGI = """Sygn. akt V P 2/26
Dnia 10 listopada 2026 r.
00:05:00   Swiadek Jan Nowak - lat 41, po odebraniu przyrzeczenia zeznaje:
           - Ja wspolpracowalem z powodem wowczas kiedy zajmowal sie rekrutacja, a pozniej
           jako programista juz nie.
           - Nie slyszalem aby ograniczono nam mozliwosci kontaktu z powodem.
           Na pytanie powoda:
           - Nie pamietam od jakiego okresu powod byl zatrudniony jako programista.
00:20:00   Sad postanowil odroczyc rozprawe.
"""


def run(tmp, *extra):
    a, b = Path(tmp, "p1.txt"), Path(tmp, "p2.txt")
    a.write_text(PIERWSZY, encoding="utf-8")
    b.write_text(DRUGI, encoding="utf-8")
    return subprocess.run([sys.executable, "-I", str(TOOL), "--swiadek", "Nowak", str(a), str(b), *extra],
                          capture_output=True, text=True)


def test_pary_sw_a9_i_zarzadzenie():
    with tempfile.TemporaryDirectory() as tmp:
        out = run(tmp)
    assert out.returncode == 0, out.stderr
    pairs = out.stdout.split("PARY DO POROWNANIA")[1]
    assert "W-002 <> W-004: SW-A9" in pairs      # dobra wspolpraca jako informatyk / "programista juz nie"
    assert "W-002 <> W-006: SW-A9" in pairs      # ... / "nie pamietam od kiedy programista"
    assert "W-003 <> W-005: SW-A9" in pairs      # zarzadzenie wewnetrzne / "nie slyszalem o ograniczeniu"
    assert "Przewodniczaca" not in out.stdout    # czynnosci sadu nie sa wypowiedzia swiadka
    assert "| 00:12:00 | powoda | Jak powod" in out.stdout   # znacznik czasu i pytajacy wlasciwe


def test_pismo_bez_pary_zwraca_3_a_z_para_0():
    with tempfile.TemporaryDirectory() as tmp:
        bez = Path(tmp, "bez.txt")
        bez.write_text("Swiadek zeznal: „Nie slyszalem aby ograniczono nam mozliwosci kontaktu”.", encoding="utf-8")
        assert run(tmp, "--pismo", str(bez)).returncode == 3
        z = Path(tmp, "z.txt")
        z.write_text(bez.read_text(encoding="utf-8")
                     + " Wczesniej: „Jak powod byl informatykiem to wspolpraca ukladala sie dobrze”"
                     + ", „na poczatku jako informatyk, a pozniej zostal rekruterem”"
                     + " oraz „Bylo zarzadzenie wewnetrzne u pozwanej”.", encoding="utf-8")
        assert run(tmp, "--pismo", str(z)).returncode == 0


if __name__ == "__main__":
    test_pary_sw_a9_i_zarzadzenie()
    test_pismo_bez_pary_zwraca_3_a_z_para_0()
    print("OK")
