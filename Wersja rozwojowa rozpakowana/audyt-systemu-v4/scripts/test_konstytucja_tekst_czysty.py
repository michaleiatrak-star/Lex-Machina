#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_konstytucja_tekst_czysty.py — Test regresyjny T47: wyjątek RZĄD 1 na czysty
tekst ujednolicony Konstytucji (zgłoszenie #83, kontynuacja).

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  Dz.U. z lat 1990–1999 mają textHTML:false, więc isap_tekst czyta `text.pdf` —
  skan z ukrytą warstwą OCR. W Konstytucji DU/1997/483 OCR zniekształca numery
  12 artykułów („Art. ISO." zamiast „Art. 150."), co dawało NOT_FOUND dla art. 150.
  Plik ujednolicony (texts[].type === "U", born-digital) jest czysty — i jest
  wyjątkiem ważniejszym od text.pdf w RZĄD 1.

CO TEST SPRAWDZA — bez sieci, wyłącznie na plikach repozytorium:
  1. Źródło JS ma mapę WYJATKI_TEKST_CZYSTY z wpisem DU/1997/483 (typ "U").
  2. tekstPdf przyjmuje nadpisanie URL (sygnatura `tekstPdf(eli, url`).
  3. Handler isap_tekst używa wybierzTekstCzysty i ustawia z niego url_zrodlowy.
  4. Czysta funkcja wybierzTekstCzysty (wykonana w node, offline) buduje URL
     `/text/U/…` dla Konstytucji, null dla aktu spoza wyjątków, oraz bierze nazwę
     pliku z żywych metadanych `texts`, gdy są.

Użycie:
    python3 test_konstytucja_tekst_czysty.py [--repo-root SKILLS_ROOT] [--quiet]

Kod wyjścia: 0 — wszystko zgodne; 1 — co najmniej jedna niezgodność; 2 — brak node.
"""
import argparse
import json
import pathlib
import re
import shutil
import subprocess
import sys

JS_REL = "mcp-servers/isap-eli-example/isap-eli-mcp-server.js"
NODE_PROBE = r"""
import { wybierzTekstCzysty } from "./isap-eli-example/isap-eli-mcp-server.js";
const meta = { texts: [{fileName:"D19970483.pdf",type:"O"},{fileName:"D19970483.pdf",type:"I"},{fileName:"D19970483Lj.pdf",type:"U"}] };
const out = {
  brak: wybierzTekstCzysty("DU/1964/93"),
  z_meta: wybierzTekstCzysty("DU/1997/483", meta),
  fallback: wybierzTekstCzysty("DU/1997/483"),
};
process.stdout.write(JSON.stringify(out));
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root")
    ap.add_argument("--quiet", action="store_true")
    a = ap.parse_args()
    root = pathlib.Path(a.repo_root or pathlib.Path(__file__).resolve().parents[2])
    audyt = root / "Wersja rozwojowa rozpakowana" / "audyt-systemu-v4"
    if not audyt.is_dir():
        audyt = root / "audyt-systemu-v4"
    if not audyt.is_dir():
        audyt = pathlib.Path(__file__).resolve().parents[1]
    bledy: list[str] = []

    js = audyt / JS_REL
    if not js.is_file():
        print("WYNIK T47: FAIL — BRAK PLIKU: {}".format(JS_REL))
        return 1
    src = js.read_text(encoding="utf-8")

    if not re.search(r'WYJATKI_TEKST_CZYSTY\s*=\s*\{[^}]*"DU/1997/483"\s*:\s*\{[^}]*typ:\s*"U"', src, re.S):
        bledy.append("JS: brak wpisu DU/1997/483 (typ \"U\") w WYJATKI_TEKST_CZYSTY")
    if not re.search(r'async function tekstPdf\(eli,\s*url', src):
        bledy.append("JS: tekstPdf nie przyjmuje nadpisania URL (tekstPdf(eli, url))")
    if not re.search(r'wybierzTekstCzysty\(zrodlo\.eli,\s*meta\)', src):
        bledy.append("JS: handler nie wywołuje wybierzTekstCzysty(zrodlo.eli, meta)")
    if not re.search(r'url_zrodlowy:\s*czysty\?\.url', src):
        bledy.append("JS: url_zrodlowy nie pochodzi z wyjątku (czysty?.url)")

    node = shutil.which("node")
    if not node:
        print("WYNIK T47: BRAK NODE — pominięto sprawdzenie funkcji; część źródłowa: {}".format(
            "OK" if not bledy else "FAIL"))
        return 2 if not bledy else 1

    r = subprocess.run([node, "--input-type=module", "-e", NODE_PROBE], cwd=str(audyt / "mcp-servers"),
                       capture_output=True, text=True, timeout=60)
    if r.returncode != 0:
        bledy.append("node: wykonanie wybierzTekstCzysty nie powiodło się: {}".format(
            (r.stderr or r.stdout)[-400:]))
    else:
        try:
            out = json.loads(r.stdout)
        except ValueError:
            out = None
            bledy.append("node: nie-JSON na wyjściu: {}".format(r.stdout[:200]))
        if out is not None:
            if out.get("brak") is not None:
                bledy.append("funkcja: akt spoza wyjątków powinien dać null, dał {}".format(out["brak"]))
            exp = "https://api.sejm.gov.pl/eli/acts/DU/1997/483/text/U/D19970483Lj.pdf"
            for klucz in ("z_meta", "fallback"):
                url = (out.get(klucz) or {}).get("url")
                if url != exp:
                    bledy.append("funkcja[{}]: URL = {!r}, oczekiwano {!r}".format(klucz, url, exp))

    if bledy:
        if not a.quiet:
            for b in bledy:
                print("  ⛔ {}".format(b))
        print("WYNIK T47: FAIL — {} niezgodności.".format(len(bledy)))
        return 1
    print("WYNIK T47: OK — wyjątek RZĄD 1 na czysty tekst ujednolicony Konstytucji obecny "
          "(mapa, nadpisanie URL, handler, funkcja).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
