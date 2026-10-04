#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
napraw_tekst_dzu.py — konwerter do CZYTANIA aktów Dz.U. i M.P. z lat 2000–2009.

PO CO
    W zeszytach Dz.U. i M.P. z lat 2000–2009 polskie litery są zapisane w kodach
    Mac Central European, a PDF deklaruje je jako Mac Roman (fonty QuarkXPress
    „…PL”). Każdy czytnik — pdftotext, pdfjs, pdfplumber, pypdf, PyMuPDF — pokazuje
    „Za∏àcznik” zamiast „Załącznik” i „noÊników” zamiast „nośników”, więc
    wyszukiwanie fraz nic nie znajduje, a podgląd jest nieczytelny.

    Ten skrypt czyta akt i zwraca tekst z PRAWIDŁOWYMI literami: do czytania na
    ekranie (`--format html` otwiera się w przeglądarce z poprawną czcionką),
    do wklejenia (`txt`) albo do dalszej obróbki (`md`).

⛔ GRANICA UŻYCIA
    Wynik jest POMOCĄ W CZYTANIU, nie źródłem prawa. Wiążący jest PDF ogłoszony
    w Dzienniku Ustaw. Do cytowania w piśmie obowiązuje PRAWO-HARDGATE: brzmienie
    przepisu bierze się z ELI (RZĄD 1), nie z konwersji.

    Konwersja NIE wycina aktu z zeszytu: PDF pojedynczej pozycji obejmuje całe
    strony, na których ją wydrukowano, więc na początku i końcu może być fragment
    sąsiedniej pozycji (np. DU/2003/991 zaczyna się załącznikiem do poz. 990).
    Nagłówki stron („Dziennik Ustaw Nr 105 — 7006 — Poz. 990 i 991”) są usuwane.

UŻYCIE
    python3 napraw_tekst_dzu.py DU/2003/991                      # tekst na ekran
    python3 napraw_tekst_dzu.py DU/2003/991 --format html -o a.html
    python3 napraw_tekst_dzu.py akt.pdf --format md -o akt.md    # lokalny PDF
    python3 napraw_tekst_dzu.py zepsuty.txt                      # gotowy tekst
    cat zepsuty.txt | python3 napraw_tekst_dzu.py -               # z potoku
    python3 napraw_tekst_dzu.py DU/2003/991 --szukaj "nośników"   # sprawdź frazę

Wymaga: pdftotext (poppler-utils) tylko dla wejścia PDF.
"""
import argparse
import html as _html
import re
import subprocess
import sys
import shutil
import tempfile
import urllib.request

ELI_BASE = "https://api.sejm.gov.pl/eli/acts"

# Mapa WYPROWADZONA z kodeków, nie przepisana ze zgłoszenia:
#   litera.encode("mac_latin2").decode("mac_roman")
# Ó i ó mapują się na siebie, więc nie ma ich w tabeli (16 pozycji, nie 18).
MAC_CE_NA_PL = {m: p for m, p in zip("Ñàåç¢´¸∏¡ƒÂÊèê˚˝", "ĄąĆćĘęŁłŃńŚśŹźŻż")}
_WSZYSTKIE = re.compile(r"[Ñàåç¢´¸∏¡ƒÂÊèê˚˝]")
# Znaki, które w polskim tekście urzędowym nie występują poza tą usterką.
# Celowo BEZ à, ç, è, ê, Ñ, å — to prawdziwe litery w umowach po francusku,
# hiszpańsku i w językach skandynawskich, publikowanych w Dz.U.
_MARKERY = re.compile(r"[¢´¸∏¡ƒÂÊ˚˝]")
_DIAKRYTYKI_PL = re.compile(r"[ąćęłńśźżĄĆĘŁŃŚŹŻ]")
_PAGINA = re.compile(
    r"^[^\S\n]*(?:Dziennik Ustaw|Monitor Polski)(?:[^\S\n]+Nr[^\S\n]*\d+)?"
    r"[^\S\n]*(?:\n[^\S\n]*){0,2}[—–-][^\S\n]*\d+[^\S\n]*[—–-][^\S\n]*(?:\n[^\S\n]*){0,2}"
    r"(?:Poz\.[^\S\n]*\d+(?:[^\S\n]*(?:,|i)[^\S\n]*\d+)*[^\S\n]*)?$", re.M)


def zepsute_mac_ce(tekst):
    """Czy tekst ma polskie litery w Mac CE odczytane jako Mac Roman."""
    return len(_MARKERY.findall(tekst)) >= 2 and not _DIAKRYTYKI_PL.search(tekst)


def napraw_mac_ce(tekst):
    """Przelicza litery TYLKO gdy usterka wykryta — inaczej zwraca wejście."""
    if not zepsute_mac_ce(tekst):
        return tekst
    return _WSZYSTKIE.sub(lambda m: MAC_CE_NA_PL[m.group()], tekst)


def pdf_na_tekst(sciezka):
    """Tekst z PDF. Po wykryciu usterki czyta bez `-layout`.

    Zeszyty 2000–2009 są dwułamowe; `-layout` stawia łamy obok siebie i miesza
    zdania. Zmierzone na 53 aktach z tych lat mających oficjalny HTML (udział
    słów wzorca we właściwej kolejności): 0,486 z `-layout` → 0,813 bez niego
    i z naprawą liter. Dla aktów nowszych nic się nie zmienia — wykrycie nie trafia.
    """
    if not shutil.which("pdftotext"):
        sys.exit("BŁĄD: brak pdftotext (zainstaluj poppler-utils).")
    wy = subprocess.run(["pdftotext", "-layout", sciezka, "-"], capture_output=True, timeout=300)
    if wy.returncode != 0:
        sys.exit("BŁĄD pdftotext: kod {}".format(wy.returncode))
    tekst = wy.stdout.decode("utf-8", errors="replace")
    if zepsute_mac_ce(tekst):
        bez = subprocess.run(["pdftotext", sciezka, "-"], capture_output=True, timeout=300)
        if bez.returncode == 0:
            tekst = bez.stdout.decode("utf-8", errors="replace")
    return tekst


def wczytaj(zrodlo):
    """Zwraca (tekst_surowy, opis_zrodla). Przyjmuje ELI, plik PDF, plik tekstowy, '-'."""
    if zrodlo == "-":
        return sys.stdin.read(), "wejście standardowe"
    if re.fullmatch(r"(?:DU|MP)/\d{4}/\d{1,5}", zrodlo):
        url = "{}/{}/text.pdf".format(ELI_BASE, zrodlo)
        try:
            with urllib.request.urlopen(url, timeout=120) as r:
                blob = r.read()
        except Exception as exc:                   # noqa: BLE001
            sys.exit("BŁĄD pobierania {}: {}".format(url, exc))
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as fh:
            fh.write(blob)
            tmp = fh.name
        return pdf_na_tekst(tmp), "{} ({})".format(zrodlo, url)
    if zrodlo.lower().endswith(".pdf"):
        return pdf_na_tekst(zrodlo), zrodlo
    with open(zrodlo, encoding="utf-8", errors="replace") as fh:
        return fh.read(), zrodlo


def posprzataj(tekst, zostaw_pagine=False):
    tekst = "\f".join(napraw_mac_ce(s) for s in tekst.split("\f"))
    if not zostaw_pagine:
        tekst = _PAGINA.sub("", tekst)
    tekst = tekst.replace("\f", "\n")
    # Sklejenie wyrazów przeniesionych na następny wiersz („noś-\nników” → „nośników”).
    tekst = re.sub(r"(\w)-\n([a-ząćęłńóśźż])", r"\1\2", tekst)
    tekst = re.sub(r"[ \t]+\n", "\n", tekst)
    return re.sub(r"\n{3,}", "\n\n", tekst).strip() + "\n"


SZABLON_HTML = """<!doctype html>
<html lang="pl">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{tytul}</title>
<style>
  :root {{ color-scheme: light dark; }}
  body {{ max-width: 46rem; margin: 2rem auto; padding: 0 1rem;
         font-family: "Charter", "Georgia", "Times New Roman", serif;
         font-size: 1.05rem; line-height: 1.6; }}
  header {{ border-bottom: 1px solid currentColor; padding-bottom: .6rem; margin-bottom: 1.2rem;
            font-family: system-ui, sans-serif; font-size: .9rem; opacity: .85 }}
  pre {{ white-space: pre-wrap; word-wrap: break-word; font-family: inherit; margin: 0 }}
  mark {{ padding: 0 .1em }}
</style>
<header>
  <strong>{tytul}</strong><br>
  Konwersja do czytania — litery Mac CE przeliczone na polskie, żywa pagina usunięta.<br>
  ⛔ Wiążący jest PDF ogłoszony w Dzienniku Ustaw; do pisma cytuj z ELI (RZĄD 1).
</header>
<pre>{tresc}</pre>
</html>
"""


def main():
    ap = argparse.ArgumentParser(
        description="Naprawia polskie litery w aktach Dz.U./M.P. z lat 2000–2009 i przygotowuje tekst do czytania.",
        formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__)
    ap.add_argument("zrodlo", help="ELI (DU/2003/991), plik .pdf, plik tekstowy albo '-' dla potoku")
    ap.add_argument("--format", choices=("txt", "md", "html"), default="txt")
    ap.add_argument("-o", "--wyjscie", help="plik wynikowy (domyślnie: na ekran)")
    ap.add_argument("--szukaj", help="sprawdź, ile razy fraza występuje przed i po naprawie")
    ap.add_argument("--zostaw-pagine", action="store_true", help="nie usuwaj nagłówków stron")
    a = ap.parse_args()

    surowy, opis = wczytaj(a.zrodlo)
    wykryto = any(zepsute_mac_ce(s) for s in surowy.split("\f"))
    czysty = posprzataj(surowy, a.zostaw_pagine)

    if a.szukaj:
        print("fraza {!r}: przed naprawą {}× , po naprawie {}×".format(
            a.szukaj, surowy.count(a.szukaj), czysty.count(a.szukaj)), file=sys.stderr)

    print("źródło: {}".format(opis), file=sys.stderr)
    print("usterka Mac CE: {}".format("WYKRYTA — litery przeliczone" if wykryto
                                      else "nie wykryta — tekst bez zmian liter"), file=sys.stderr)

    if a.format == "html":
        wynik = SZABLON_HTML.format(tytul=_html.escape(opis), tresc=_html.escape(czysty))
    elif a.format == "md":
        wynik = ("# {}\n\n> Konwersja do czytania (litery Mac CE przeliczone, żywa pagina usunięta).\n"
                 "> ⛔ Wiążący jest PDF ogłoszony w Dzienniku Ustaw; do pisma cytuj z ELI (RZĄD 1).\n\n"
                 "```\n{}```\n".format(opis, czysty))
    else:
        wynik = czysty

    if a.wyjscie:
        with open(a.wyjscie, "w", encoding="utf-8") as fh:
            fh.write(wynik)
        print("zapisano: {}".format(a.wyjscie), file=sys.stderr)
    else:
        sys.stdout.write(wynik)


if __name__ == "__main__":
    main()
