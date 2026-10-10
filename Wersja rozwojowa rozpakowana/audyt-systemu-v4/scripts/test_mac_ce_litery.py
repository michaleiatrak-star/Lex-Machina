#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_mac_ce_litery.py — Test regresyjny T46: polskie litery w aktach Dz.U./M.P. 2000–2009.

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  Zgłoszenie #83 (isap_tekst). W zeszytach Dz.U. i M.P. z lat 2000–2009 polskie
  litery są zapisane w kodach Mac Central European, a PDF deklaruje je jako Mac
  Roman (fonty QuarkXPress „…PL”): „Za∏àcznik” zamiast „Załącznik”, „noÊników”
  zamiast „nośników”. Wyszukiwanie fraz nie znajdowało nic.

CO TEST SPRAWDZA — bez sieci, wyłącznie na plikach repozytorium:
  1. Mapa liter w KODZIE zgadza się z mapą WYPROWADZONĄ z kodeków
     (litera.encode("mac_latin2").decode("mac_roman")). To jest właściwy
     sprawdzian: mapa nie może być przepisana „na oko” ze zgłoszenia.
  2. Wykrycie usterki trafia w tekst zepsuty, a NIE trafia w poprawny polski
     ani we francuski (à, ç, è, ê są tam prawdziwymi literami — przeliczanie
     po samym roczniku psułoby umowy międzynarodowe w Dz.U.).
  3. Wzorzec żywej paginy usuwa nagłówek w obu postaciach (jeden wiersz i trzy
     wiersze po czytaniu bez `-layout`), a NIE zjada numeru pozycji stojącego
     w następnym wierszu jako nagłówek treści.
  4. Obie implementacje — pythonowa i JavaScript (serwer MCP) — mają tę samą
     mapę i te same znaki markerów. Rozjazd między nimi jest błędem.

Użycie:
    python3 test_mac_ce_litery.py [--repo-root SKILLS_ROOT] [--quiet]

Kod wyjścia: 0 — wszystko zgodne; 1 — co najmniej jedna niezgodność.
"""
import argparse
import importlib.util
import pathlib
import re
import sys

POLSKIE = "ĄąĆćĘęŁłŃńÓóŚśŹźŻż"


def mapa_z_kodekow():
    """Mojibake -> litera, wyprowadzone z kodeków; bez Ó/ó (mapują się na siebie)."""
    out = {}
    for ch in POLSKIE:
        m = ch.encode("mac_latin2").decode("mac_roman")
        if m != ch:
            out[m] = ch
    return out


def wczytaj_modul(sciezka, nazwa):
    spec = importlib.util.spec_from_file_location(nazwa, str(sciezka))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def klasa_znakow(wzorzec):
    """Zbiór znaków prostej klasy „[...]” (markery, diakrytyki); None, gdy to nie klasa."""
    m = re.fullmatch(r"\[([^\]\\]+)\]", wzorzec)
    return set(m.group(1)) if m else None


def porownaj_wzorce_js(src, wzorce_py, mow):
    """2026-10-10 (audyt mutacyjny): wcześniej pkt 4 sprawdzał tylko OBECNOŚĆ nazw
    `MARKERY_MAC_CE`/`PAGINA_2000_2009` w JS — zawężenie markerów w JS do `[¢]` przechodziło.
    Teraz treść wzorców JS musi być identyczna z pythonową (markery i diakrytyki jako zbiory
    znaków, pagina — dosłownie, z flagą `m`)."""
    bledy = []
    # Wszystkie pythonowe implementacje muszą być zgodne także między sobą.
    for klucz, per_plik in wzorce_py.items():
        if len({rx.pattern for rx in per_plik.values()}) > 1:
            bledy.append("PY: wzorce {} różnią się między plikami: {}".format(klucz, sorted(per_plik)))
    py = {k: next(iter(v.values())) for k, v in wzorce_py.items() if v}
    for klucz, stala in (("markery", "MARKERY_MAC_CE"), ("diakrytyki", "DIAKRYTYKI_PL"),
                         ("pagina", "PAGINA_2000_2009")):
        m = re.search(r"const " + stala + r" = /(.+)/([a-z]*);", src)
        if not m:
            bledy.append("JS: nie znaleziono literału {} w postaci `const {} = /…/;`".format(stala, stala))
            continue
        if klucz not in py:
            continue
        zrodlo, flagi = m.group(1), m.group(2)
        if klucz == "pagina":
            if zrodlo != py[klucz].pattern or "m" not in flagi:
                bledy.append("JS: PAGINA_2000_2009 różni się od wzorca pythonowego")
        elif klasa_znakow(zrodlo) != klasa_znakow(py[klucz].pattern):
            bledy.append("JS: {} = {} ≠ Python {}".format(stala, zrodlo, py[klucz].pattern))
    # Każdy inny literał klasy z flagą /g (kopia markerów w zepsuteMacCE, klasa wszystkich
    # znaków Mac CE w podmianie) musi być równy markerom albo pełnej mapie z kodeków.
    if "markery" in py:
        wz = klasa_znakow(py["markery"].pattern)
        pelna = set(mapa_z_kodekow())
        for lit in re.findall(r"/(\[[^\]/]+\])/g", src):
            zn = klasa_znakow(lit)
            if zn and zn & pelna and zn not in (wz, pelna):
                bledy.append("JS: literał {} nie jest ani klasą markerów {}, ani pełną mapą Mac CE".format(
                    lit, py["markery"].pattern))
    if not bledy:
        mow("  serwer MCP (JS): markery, diakrytyki i pagina zgodne z Pythonem")
    return bledy


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=".")
    ap.add_argument("--quiet", action="store_true")
    a = ap.parse_args()
    root = pathlib.Path(a.repo_root).resolve()
    audyt = root / "audyt-systemu-v4"
    if not audyt.is_dir():
        audyt = root if (root / "scripts").is_dir() else root
    bledy = []
    mow = (lambda *x: None) if a.quiet else print

    wzorcowa = mapa_z_kodekow()
    mow("mapa wyprowadzona z kodeków: {} pozycji".format(len(wzorcowa)))
    if len(wzorcowa) != 16:
        bledy.append("mapa z kodeków ma {} pozycji, oczekiwano 16".format(len(wzorcowa)))

    # Wzorce strony pythonowej do porównania z JS (pkt 4): {nazwa: {plik: pattern}}.
    wzorce_py = {"markery": {}, "diakrytyki": {}, "pagina": {}}

    # 1 + 2 + 3: strona pythonowa
    for plik, nazwa in (("scripts/napraw_tekst_dzu.py", "konwerter"),
                        ("scripts/check_wyjatek_gate_eli.py", "gate_eli")):
        p = audyt / plik
        if not p.exists():
            bledy.append("BRAK PLIKU: {}".format(plik))
            continue
        try:
            mod = wczytaj_modul(p, "t46_" + nazwa)
        except Exception as exc:                   # noqa: BLE001
            bledy.append("{}: nie importuje się ({})".format(plik, exc))
            continue
        for klucz, attrs in (("markery", ("_MARKERY_MAC_CE", "_MARKERY")),
                             ("diakrytyki", ("_DIAKRYTYKI_PL",)),
                             ("pagina", ("_PAGINA_2000_2009", "_PAGINA"))):
            rx = next((getattr(mod, x) for x in attrs if getattr(mod, x, None) is not None), None)
            if rx is None:
                bledy.append("{}: brak wzorca {} ({})".format(plik, klucz, "/".join(attrs)))
            else:
                wzorce_py[klucz][plik] = rx
        mapa = getattr(mod, "MAC_CE_NA_PL", None)
        if mapa != wzorcowa:
            bledy.append("{}: MAC_CE_NA_PL != mapa z kodeków (brakuje {}, nadmiarowe {})".format(
                plik,
                {k: v for k, v in wzorcowa.items() if k not in (mapa or {})},
                {k: v for k, v in (mapa or {}).items() if k not in wzorcowa}))
        else:
            mow("  {}: mapa zgodna z kodekami".format(plik))

        zep = getattr(mod, "zepsute_mac_ce", None)
        if zep is None:
            bledy.append("{}: brak funkcji zepsute_mac_ce".format(plik))
        else:
            przypadki = [
                ("Za∏àcznik do rozporzàdzenia okreÊla noÊniki s∏u˝àce", True, "tekst zepsuty"),
                ("Załącznik do rozporządzenia określa nośniki służące", False, "poprawny polski"),
                ("Accord relatif à la coopération, créé à Genève, règlement de l'État", False, "francuski"),
                ("", False, "pusty"),
            ]
            for tekst, oczek, opis in przypadki:
                if bool(zep(tekst)) != oczek:
                    bledy.append("{}: wykrycie usterki — {} dało {}, oczekiwano {}".format(
                        plik, opis, bool(zep(tekst)), oczek))
            nap = getattr(mod, "napraw_mac_ce", None)
            if nap and nap("Za∏àcznik okreÊla noÊniki s∏u˝àce") != "Załącznik określa nośniki służące":
                bledy.append("{}: napraw_mac_ce nie odtwarza oczekiwanego tekstu".format(plik))
            # Propagacja rozpoznania w obrębie dokumentu (AUDYT-2026-10-04k, pomiar: 2 → 0
            # nieprzeliczonych znaków). Strona z jednym markerem i bez polskich liter
            # NIE przechodzi progu sama — ma go odziedziczyć po stronie rozpoznanej.
            dok = getattr(mod, "napraw_mac_ce_dokument", None)
            if dok is None:
                bledy.append("{}: brak funkcji napraw_mac_ce_dokument".format(plik))
            else:
                slaba = "Za∏àcznik nr 3\nWYKAZ SUBSTANCJI PSYCHOTROPOWYCH\nAMFEPRAMON\nDELORAZEPAM"
                mocna = "Za∏àcznik okreÊla noÊniki s∏u˝àce do zapisu"
                wynik = dok(mocna + "\f" + slaba)
                if "Za∏àcznik nr 3" in wynik:
                    bledy.append("{}: strona o jednym markerze NIE odziedziczyła rozpoznania".format(plik))
                if "Załącznik nr 3" not in wynik:
                    bledy.append("{}: propagacja nie dała oczekiwanego tekstu".format(plik))
                # strona bez markerów (obcojęzyczna) ma zostać nietknięta
                obca = "Accord relatif à la coopération, créé à Genève"
                if dok(mocna + "\f" + obca).split("\f")[1] != obca:
                    bledy.append("{}: propagacja ZMIENIŁA stronę bez markerów (ryzyko dla tekstów obcych)".format(plik))

        pag = getattr(mod, "_PAGINA_2000_2009", None) or getattr(mod, "_PAGINA", None)
        if pag is None:
            bledy.append("{}: brak wzorca żywej paginy".format(plik))
        else:
            jeden = "Dziennik Ustaw Nr 105 — 7006 — Poz. 990 i 991\nTREŚĆ"
            trzy = "Dziennik Ustaw Nr 105\n\n— 7006 —\n\nPoz. 990 i 991\nTREŚĆ"
            numer = "Dziennik Ustaw Nr 53 — 3338 — Poz. 649\n649\nROZPORZĄDZENIE"
            if "Dziennik" in pag.sub("", jeden):
                bledy.append("{}: pagina jednowierszowa nie usunięta".format(plik))
            if "Dziennik" in pag.sub("", trzy):
                bledy.append("{}: pagina łamana na wiersze nie usunięta".format(plik))
            if "649" not in pag.sub("", numer).split("ROZPORZ")[0]:
                bledy.append("{}: wzorzec paginy ZJADA numer pozycji z następnego wiersza".format(plik))
            if not bledy:
                mow("  {}: wykrycie i pagina zgodne".format(plik))

    # 4: zgodność implementacji JS
    js = audyt / "mcp-servers/isap-eli-example/isap-eli-mcp-server.js"
    if not js.exists():
        bledy.append("BRAK PLIKU: mcp-servers/isap-eli-example/isap-eli-mcp-server.js")
    else:
        src = js.read_text(encoding="utf-8")
        m = re.search(r'\[\.\.\."([^"]+)"\]\.map\(\(c, i\) => \[c, "([^"]+)"\[i\]\]\)', src)
        if not m:
            bledy.append("JS: nie znaleziono tabeli MAC_CE_NA_PL w oczekiwanej postaci")
        else:
            mapa_js = dict(zip(m.group(1), m.group(2)))
            if mapa_js != wzorcowa:
                bledy.append("JS: mapa różni się od mapy z kodeków / od pythonowej")
            else:
                mow("  serwer MCP (JS): mapa zgodna z kodekami")
        for frag, opis in (("MARKERY_MAC_CE", "markery"), ("DIAKRYTYKI_PL", "diakrytyki"),
                           ("PAGINA_2000_2009", "pagina 2000–2009"),
                           ("naprawMacCEDokument", "propagacja rozpoznania w dokumencie")):
            if frag not in src:
                bledy.append("JS: brak {} ({})".format(frag, opis))
        bledy += porownaj_wzorce_js(src, wzorce_py, mow)

    print()
    if bledy:
        print("WYNIK T46: FAIL — {} niezgodności.".format(len(bledy)))
        for b in bledy:
            print("  BŁĄD  {}".format(b))
        return 1
    print("WYNIK T46: OK — mapa liter wyprowadzona z kodeków, wykrycie i pagina zgodne, "
          "implementacja pythonowa i JS zgodne ze sobą.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
