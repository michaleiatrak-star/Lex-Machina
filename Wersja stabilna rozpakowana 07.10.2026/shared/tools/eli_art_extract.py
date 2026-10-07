#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""eli_art_extract.py — deterministyczny odczyt jednostki redakcyjnej z ELI (F-201).

Własna implementacja Lex Machina. Oparta na strukturze HTML serwowanej przez
api.sejm.gov.pl (zbadanej 2026-09-26 na Kodeksie pracy, t.j. Dz.U. 2023 poz. 1465),
a nie na dopasowaniu tekstowym „Art. N.”.

DLACZEGO STRUKTURA, A NIE WZORZEC TEKSTOWY
  Tekst jednolity w ELI to OBWIESZCZENIE z dwiema częściami:
    <section id="part_1">  Treść obwieszczenia — przytacza przepisy ustaw
                           zmieniających („nie obejmuje …”), z WŁASNYMI
                           numerami artykułów;
    <section id="part_2">  Załącznik — Tekst jednolity ustawy.
  W KP (t.j. 2023/1465) jednostka `arti_22` występuje TRZY razy: dwa razy w
  części 1 (przepisy ustaw zmieniających o rodzinach zastępczych) i raz w
  części 2 (właściwy art. 22 KP). Wyszukiwanie „pierwszego Art. 22.” zwraca
  cudzy przepis — to jest objaw U-9 z AUDYT-2026-09-26.
  Każda jednostka ma w HTML `class="unit unit_<rodzaj>"` i `data-id`
  (arti_22, arti_22_1 = art. 22¹, arti_22_1_a = art. 22¹a, para_1_1 = § 1¹,
  pass_2 = ust. 2, pint_3 = pkt 3, lett_a = lit. a). Ekstraktor wybiera
  część dokumentu, potem jednostkę po `data-id`, i pomija przypisy
  (`gloss-link`, `tooltip-text`, `gloss-section`).

AKTUALNOŚĆ TEKSTU — DRUGA PUŁAPKA
  Nie każdy tekst jednolity ma wersję HTML. Dla KP (stan 2026-09-26) najnowszy
  t.j. to Dz.U. 2026 poz. 1245, a HTML ma dopiero t.j. 2023 poz. 1465 — dwa
  teksty jednolite wstecz. Narzędzie, które „bierze najnowszy t.j. z HTML”,
  cicho podaje stan sprzed lat. Dlatego wynik niesie pole `aktualnosc`:
    AKTUALNY_TJ                 — HTML pochodzi z najnowszego t.j.;
    STARSZY_TJ_NOWSZY_TYLKO_PDF — istnieje nowszy t.j., ale tylko w PDF;
    ORYGINAL                    — brak t.j. z HTML; tekst pierwotny aktu;
    PLIK_LOKALNY                — odczyt z pliku, aktualność nieustalana.
  Tylko AKTUALNY_TJ może podpierać status ✅ w PRAWO-HARDGATE, i to wyłącznie
  razem z KROKIEM 2C (nowelizacje po t.j.). Pozostałe wartości wymagają odczytu
  PDF najnowszego t.j. (…/text.pdf) albo oznaczenia 🟨.

STATUSY (jak w CBOSA-ADAPTER): FOUND / NOT_FOUND / AMBIGUOUS / OUT_OF_SCOPE.
  NOT_FOUND nigdy nie oznacza „przepis nie istnieje” — oznacza „nie ma go w
  odczytanym tekście”. Przy trafieniu wyłącznie w treści obwieszczenia wynik
  to NOT_FOUND z uwagą, nigdy FOUND.

Użycie:
  python3 eli_art_extract.py --eli DU/1974/141 --cytat "art. 22 § 1"
  python3 eli_art_extract.py --plik tj.html --cytat "art. 22¹"
  python3 eli_art_extract.py --eli DU/1974/141 --cytat "art. 22 § 1" --json
Kod wyjścia: 0 = FOUND, 1 = inny status, 2 = błąd wejścia/transportu.
Tylko biblioteka standardowa.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from html.parser import HTMLParser

API = "https://api.sejm.gov.pl/eli/acts"
# Kanał kodu (shared/PRAWO-HARDGATE.md, blok „KANAŁ KODU MA WŁASNE WYMOGI”):
# neutralny UA, jawny Accept, ścieżka zamiast roota.
_UA = "curl/8.5.0"  # neutralny UA zmierzony w DOSTEP-MASZYNOWY-API §1
_SUP = str.maketrans("¹²³⁴⁵⁶⁷⁸⁹⁰", "1234567890")
_DO_SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")
_VOID = {"br", "img", "hr", "meta", "link", "input", "col", "area", "base", "wbr", "source"}
_POMIN_KLASY = ("tooltip-text", "gloss-link", "gloss-section", "hidden")


# ---------------------------------------------------------------- numeracja
def _numer_na_id(numer: str) -> list[str]:
    """'22' → ['22']; '22¹'/'22^1'/'22(1)'/'22[1]' → ['22_1'];
    '22¹a' → ['22_1_a']; '36a' → ['36_a', '36a']."""
    s = numer.strip().replace(" ", "")
    s = re.sub(r"\^(\d+)|\((\d+)\)|\[(\d+)\]",
               lambda m: "".join(chr(0x2070) if d == "0" else d.translate(_DO_SUP)
                                 for d in (m.group(1) or m.group(2) or m.group(3))), s)
    m = re.fullmatch(r"(\d+)([¹²³⁴⁵⁶⁷⁸⁹⁰]*)([a-z]*)", s)
    if not m:
        return []
    baza, sup, lit = m.group(1), m.group(2).translate(_SUP), m.group(3)
    czesci = [baza] + ([sup] if sup else []) + ([lit] if lit else [])
    kand = ["_".join(czesci)]
    if lit and not sup:
        kand.append(baza + lit)
    return kand


_JEDN = {"art": "arti", "§": "para", "ust": "pass", "pkt": "pint", "lit": "lett"}


def parsuj_cytat(cytat: str) -> list[tuple[str, list[str]]]:
    """'art. 22 § 1¹ pkt 2 lit. a' → [('arti',['22']),('para',['1_1']),('pint',['2']),('lett',['a'])].
    Kod aktu (np. 'KP') ignorowany — akt wskazuje --eli."""
    wynik = []
    wz = re.compile(r"(art\.|§|ust\.|pkt|lit\.)\s*"
                    r"([0-9]+[¹²³⁴⁵⁶⁷⁸⁹⁰]*(?:\^\d+|\(\d+\)|\[\d+\])?[a-z]{0,2}(?![a-z])|[a-z]{1,2}\)?(?![a-z]))",
                    re.IGNORECASE)
    for m in wz.finditer(cytat):
        rodzaj = _JEDN[m.group(1).lower().rstrip(".")]
        num = m.group(2)
        if rodzaj == "lett":
            wynik.append((rodzaj, [num.rstrip(")").lower()]))
        else:
            wynik.append((rodzaj, _numer_na_id(num)))
    return wynik


# ------------------------------------------------------------------- parser
@dataclass
class Jednostka:
    rodzaj: str
    id: str
    data_id: str
    czesc: str
    tekst: list = field(default_factory=list)

    def tresc(self) -> str:
        t = "".join(self.tekst).replace("\xa0", " ")
        return re.sub(r"\s+", " ", t).strip()


class _Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stos = []            # (tag, jednostka|None, pomin:bool, sekcja|None, sup:bool)
        self.jednostki: list[Jednostka] = []
        self.etykiety: dict[str, str] = {}
        self._czesc = ""
        self._h2 = None

    def _pomin(self):
        return any(p for _, _, p, _, _ in self.stos)

    def _sup(self):
        return any(s for _, _, _, _, s in self.stos)

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in _VOID:
            return
        a = {k.lower(): (v or "") for k, v in attrs}
        klasa = a.get("class", "")
        pomin = any(k in klasa.split() or k in klasa for k in _POMIN_KLASY)
        sekcja = None
        if tag == "section" and re.fullmatch(r"part_\d+", a.get("id", "")):
            sekcja = a["id"]
            self._czesc = sekcja
        jedn = None
        m = re.match(r"unit unit_(\w+)", klasa)
        if tag == "div" and m and a.get("id"):
            jedn = Jednostka(m.group(1), a["id"], a.get("data-id", ""), self._czesc)
            self.jednostki.append(jedn)
        if tag == "h2" and "part" in klasa.split() and self._czesc:
            self._h2 = []
        self.stos.append((tag, jedn, pomin, sekcja, tag == "sup"))

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in _VOID:
            return
        while self.stos:
            t, _, _, sekcja, _ = self.stos.pop()
            if sekcja:
                self._czesc = next((s for _, _, _, s, _ in reversed(self.stos) if s), "")
            if t == "h2" and self._h2 is not None:
                self.etykiety.setdefault(self._czesc, re.sub(r"\s+", " ", "".join(self._h2)).strip())
                self._h2 = None
            if t == tag:
                break

    def handle_data(self, data):
        if self._pomin():
            return
        if self._sup() and data.strip().isdigit():
            data = data.strip().translate(_DO_SUP)
        if self._h2 is not None:
            self._h2.append(data)
        for _, j, _, _, _ in self.stos:
            if j is not None:
                j.tekst.append(data)


def _wybierz_czesc(etykiety: dict[str, str], czesci: set[str]) -> tuple[str, str]:
    """Zwraca (część, powód). Obwieszczenie → część z 'Tekst jednolity'."""
    for c, e in etykiety.items():
        if "tekst jednolity" in e.lower().replace("\xa0", " "):
            return c, f"{c}: {e[:80]}"
    kandydaci = sorted(c for c in czesci if not etykiety.get(c, "").lower().startswith("treść obwieszczenia"))
    if kandydaci:
        return kandydaci[0], f"{kandydaci[0]}: {etykiety.get(kandydaci[0], '(bez etykiety)')[:80]}"
    return "", "dokument bez sekcji part_N"


def wyciagnij(html: str, cytat: str) -> dict:
    """Czysta funkcja offline: HTML + cytat → wynik ze statusem."""
    sciezka = parsuj_cytat(cytat)
    if not sciezka or sciezka[0][0] != "arti" or not sciezka[0][1]:
        return {"status": "OUT_OF_SCOPE", "uwaga": "cytat musi zaczynać się od 'art. N'", "cytat": cytat}
    p = _Parser()
    p.feed(html)
    p.close()
    czesci = {j.czesc for j in p.jednostki}
    czesc, powod = _wybierz_czesc(p.etykiety, czesci)
    art_ids = sciezka[0][1]
    wszystkie = [j for j in p.jednostki if j.rodzaj == "arti" and j.data_id in {f"arti_{i}" for i in art_ids}]
    w_czesci = [j for j in wszystkie if j.czesc == czesc]
    # Jednostka zagnieżdżona w innej (pass_/pint_ przed arti_) to przytoczenie.
    glowne = [j for j in w_czesci if not re.search(r"(^|-)(pass|pint)_[^-]+-.*arti_", j.id)] or w_czesci
    wynik = {"cytat": cytat, "czesc": powod, "trafienia_w_innych_czesciach": len(wszystkie) - len(w_czesci)}
    if not glowne:
        wynik["status"] = "NOT_FOUND"
        if wszystkie:
            wynik["uwaga"] = ("jednostka występuje wyłącznie poza tekstem aktu (np. w treści obwieszczenia "
                              "— przepis ustawy zmieniającej); NIE jest to szukany przepis")
        return wynik
    if len(glowne) > 1:
        wynik.update(status="AMBIGUOUS", kandydaci=[j.id for j in glowne])
        return wynik
    cel = glowne[0]
    for rodzaj, ids in sciezka[1:]:
        dzieci = [j for j in p.jednostki if j.id.startswith(cel.id + "-") and j.rodzaj == rodzaj
                  and j.data_id in {f"{rodzaj}_{i}" for i in ids}]
        # najbliższy potomek: najkrótszy identyfikator
        dzieci.sort(key=lambda j: len(j.id))
        if not dzieci:
            wynik.update(status="NOT_FOUND", uwaga=f"brak jednostki {rodzaj}_{ids} w {cel.id}",
                         jednostka_nadrzedna=cel.id, tekst_nadrzedny=cel.tresc()[:4000])
            return wynik
        cel = dzieci[0]
    wynik.update(status="FOUND", id_jednostki=cel.id, tekst=cel.tresc())
    return wynik


# --------------------------------------------------------------- transport
def _get(url: str, accept: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": _UA, "Accept": accept})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


def _klucz(eli: str) -> tuple[int, int]:
    _, rok, poz = eli.split("/")
    return int(rok), int(poz)


def wybierz_tekst(meta: dict, meta_tj: dict[str, dict]) -> dict:
    """Czysta funkcja: metadane aktu + metadane jego t.j. → co czytać i z jaką aktualnością."""
    tj = sorted((x["id"] for x in (meta.get("references") or {}).get("Inf. o tekście jednolitym", [])),
                key=_klucz, reverse=True)
    najnowszy = tj[0] if tj else None
    z_html = next((t for t in tj if meta_tj.get(t, {}).get("textHTML")), None)
    if najnowszy and z_html == najnowszy:
        return {"czytaj": z_html, "aktualnosc": "AKTUALNY_TJ", "tj_najnowszy": najnowszy}
    if z_html:
        return {"czytaj": z_html, "aktualnosc": "STARSZY_TJ_NOWSZY_TYLKO_PDF", "tj_najnowszy": najnowszy}
    return {"czytaj": meta.get("ELI") or meta.get("eli") or "", "aktualnosc": "ORYGINAL", "tj_najnowszy": najnowszy}


def pobierz(eli: str, cytat: str) -> dict:
    eli = eli.strip().strip("/")
    meta = json.loads(_get(f"{API}/{eli}", "application/json"))
    meta.setdefault("ELI", eli)
    meta_tj = {}
    for x in (meta.get("references") or {}).get("Inf. o tekście jednolitym", []):
        try:
            meta_tj[x["id"]] = json.loads(_get(f"{API}/{x['id']}", "application/json"))
        except (urllib.error.URLError, ValueError):
            meta_tj[x["id"]] = {}
    plan = wybierz_tekst(meta, meta_tj)
    if plan["aktualnosc"] == "ORYGINAL" and not meta.get("textHTML"):
        return {"status": "OUT_OF_SCOPE", "eli": eli, "uwaga": "brak tekstu HTML aktu i jego t.j.; czytaj PDF",
                **plan}
    html = _get(f"{API}/{plan['czytaj']}/text.html", "text/html").decode("utf-8", "replace")
    wynik = wyciagnij(html, cytat)
    wynik.update(eli=eli, tytul=meta.get("title", "")[:160], **plan,
                 zrodlo=f"{API}/{plan['czytaj']}/text.html")
    if plan["aktualnosc"] != "AKTUALNY_TJ":
        wynik["ostrzezenie"] = (f"tekst HTML nie pochodzi z najnowszego t.j. ({plan['tj_najnowszy']}); "
                                f"przed ✅ odczytaj {API}/{plan['tj_najnowszy']}/text.pdf" if plan["tj_najnowszy"]
                                else "tekst pierwotny aktu — nie podpiera ✅ dla aktu nowelizowanego")
    return wynik


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    zr = ap.add_mutually_exclusive_group(required=True)
    zr.add_argument("--eli", help="np. DU/1974/141 (akt pierwotny; t.j. wybierany automatycznie)")
    zr.add_argument("--plik", help="lokalny text.html (tryb offline)")
    ap.add_argument("--cytat", required=True, help="np. 'art. 22 § 1', 'art. 22¹', 'art. 36a ust. 2 pkt 1'")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    try:
        if a.plik:
            w = wyciagnij(open(a.plik, encoding="utf-8").read(), a.cytat)
            w["aktualnosc"] = "PLIK_LOKALNY"
        else:
            w = pobierz(a.eli, a.cytat)
    except (urllib.error.URLError, OSError, ValueError) as e:
        print(f"BŁĄD TRANSPORTU/WEJŚCIA: {e}", file=sys.stderr)
        return 2
    if a.json:
        print(json.dumps(w, ensure_ascii=False, indent=2))
    else:
        print(f"[{w['status']}] {w.get('cytat')} | aktualność: {w.get('aktualnosc')} | {w.get('czesc', '')}")
        for k in ("uwaga", "ostrzezenie", "zrodlo"):
            if w.get(k):
                print(f"  {k}: {w[k]}")
        if w.get("tekst"):
            print(w["tekst"])
    return 0 if w["status"] == "FOUND" else 1


if __name__ == "__main__":
    sys.exit(main())
