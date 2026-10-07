#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""kontrakt_rachunek.py — deterministyczny rachunek i kontrole liczbowe umowy (F-215).

Własna implementacja Lex Machina (stdlib, bez sieci). Uzupełnia R-EKS
(`analizator-umow-v1/references/mod-shared-ryzyko-kwant.md` RK.2a) i workflow
`weryfikacja-spojnosci-odeslan.md` o część, której model językowy NIE powinien liczyć
„w głowie”.

DLACZEGO (AUDYT-2026-09-29): pilot benchmarku publicznego projektu `commercial-legal-pl`
(Apache 2.0, examples/benchmark/wyniki/pilot/PODSUMOWANIE.md) zmierzył, że reguła
„policz, zanim ocenisz” podnosi jakość, ale nie naprawia arytmetyki: mniejszy model
popełnił 3 zmyślenia rachunkowe (2×160 h, wynagrodzenie miesięczne/roczne, cap) i
oblał twarde zero. Wniosek źródła: poniżej pewnej klasy modelu reguła wymaga
deterministycznego kalkulatora. Kodu źródła NIE kopiowano — źródło kalkulatora nie ma.

ODTWORZENIE (AUDYT-2026-10-01b): plik wydany w shared 3.99 (AUDYT-2026-09-29) nie trafił do
repozytorium — T39 kończył się FAIL na `main`, a analizator-umow-v1 1.44 odwoływał się do
nieistniejącego narzędzia. Treść odtworzona 1:1 z zapisu sesji AUDYT-2026-09-29 (utworzenie +
poprawka wykazu załączników w 2 liniach + podkomenda `cytaty` + usunięcie martwego kodu
w `oblicz`) i sprawdzona tymi samymi testami (14) oraz pomiarem T39 na korpusie.

PODKOMENDY
  oblicz   "190*2*160"             bezpieczne wyrażenie (Decimal; + - * / % nawiasy)
  ekspozycja --json dane.json      E1–E4 R-EKS z danych WYEKSTRAHOWANYCH z umowy;
                                   każda liczba MUSI mieć pole „zrodlo” (§/ust.) — WD-2
  slownie  --plik umowa.md         kwota/liczba cyfrą ↔ słownie (polska odmiana)
  odeslania --plik umowa.md        odesłania wewnętrzne (§, ust., pkt, załączniki) do
                                   jednostek, których w umowie nie ma
  cytaty   --plik umowa.md --cytaty c.json
                                   deterministyczna kontrola WD-2: każdy cytat ujęty w
                                   cudzysłów musi DOSŁOWNIE występować w dokumencie
                                   (tolerancja: białe znaki, łamanie wierszy, typografia
                                   cudzysłowów/myślników, znaczniki **markdown**)

STATUSY: OK / ROZBIEZNOSC / BRAK_ZRODLA / BRAK_DANYCH / NIEROZSTRZYGNIETE.
Narzędzie liczy według BRZMIENIA umowy. Skuteczność postanowień (ius cogens,
art. 483/484/473 KC itd.) rozstrzyga osobno IC po odczycie przepisu w ELI —
narzędzie nie jest źródłem prawa (Reguła 26 routera).
Kod wyjścia: 0 brak ustaleń, 1 są ustalenia (rozbieżność / martwe odesłanie /
brak źródła), 2 błąd wejścia.
"""
from __future__ import annotations

import argparse
import ast
import calendar
import datetime as dt
import json
import re
import sys
from decimal import ROUND_HALF_UP, Decimal, getcontext
from pathlib import Path

getcontext().prec = 28
D = Decimal
GR = D("0.01")


# ─────────────────────────────── oblicz ────────────────────────────────────
_DOZW = (ast.Expression, ast.BinOp, ast.UnaryOp, ast.Constant, ast.Add, ast.Sub,
         ast.Mult, ast.Div, ast.Mod, ast.USub, ast.UAdd)


def oblicz(wyr: str) -> Decimal:
    """Bezpieczne wyrażenie arytmetyczne w Decimal. Przecinek dziesiętny dozwolony
    (190,5); separator tysięcy kropką NIE (niejednoznaczny) — podaj 9800, nie 9.800."""
    w = re.sub(r"(\d),(\d)", r"\1.\2", wyr.replace("×", "*").replace("÷", "/"))
    drzewo = ast.parse(w, mode="eval")
    for n in ast.walk(drzewo):
        if not isinstance(n, _DOZW):
            raise ValueError(f"niedozwolony element wyrażenia: {type(n).__name__}")
        if isinstance(n, ast.Constant) and not isinstance(n.value, (int, float)):
            raise ValueError("dozwolone wyłącznie liczby")

    def ev(n):
        if isinstance(n, ast.Expression):
            return ev(n.body)
        if isinstance(n, ast.Constant):
            return D(str(n.value))
        if isinstance(n, ast.UnaryOp):
            v = ev(n.operand)
            return -v if isinstance(n.op, ast.USub) else v
        a, b = ev(n.left), ev(n.right)
        return {ast.Add: a + b, ast.Sub: a - b, ast.Mult: a * b}.get(type(n.op)) if not isinstance(
            n.op, (ast.Div, ast.Mod)) else (a / b if isinstance(n.op, ast.Div) else a % b)

    return ev(drzewo)


def fmt(x) -> str:
    if x is None:
        return "—"
    if isinstance(x, str):
        return x
    q = x.quantize(GR, ROUND_HALF_UP)
    s = f"{q:,.2f}".replace(",", " ").replace(".", ",")
    return s[:-3] if s.endswith(",00") else s


# ───────────────────────────── ekspozycja ──────────────────────────────────
class BrakZrodla(ValueError):
    pass


def _liczba(obj, pole, wymagane=True):
    """Pobiera {"wartosc": x, "zrodlo": "§…"}; liczba bez źródła = BRAK_ZRODLA (WD-2)."""
    v = obj.get(pole)
    if v is None:
        if wymagane:
            return None
        return None
    if isinstance(v, dict):
        if v.get("wartosc") is None:
            return None
        if not str(v.get("zrodlo", "")).strip():
            raise BrakZrodla(f"{pole}: liczba bez pola „zrodlo” (§/ust.) — WD-2")
        return D(str(v["wartosc"])), str(v["zrodlo"])
    raise BrakZrodla(f"{pole}: podaj obiekt {{wartosc, zrodlo}}, nie gołą liczbę")


def _dodaj_miesiace(d: dt.date, m: int) -> dt.date:
    r, mi = divmod(d.month - 1 + m, 12)
    y, mo = d.year + r, mi + 1
    return dt.date(y, mo, min(d.day, calendar.monthrange(y, mo)[1]))


def ekspozycja(dane: dict) -> dict:
    wyn = {"status": "OK", "E1": {}, "E2": [], "E3": None, "E4": {}, "brak_danych": [], "zalezne_od_IC": [],
           "dzialania": []}
    dz = wyn["dzialania"]

    # wartość referencyjna: albo wprost, albo składniki T&M
    wartosc_mies = None
    wm = dane.get("wynagrodzenie_miesieczne")
    tm = dane.get("tm")
    if wm:
        wartosc_mies = _liczba(dane, "wynagrodzenie_miesieczne")
    elif tm:
        st, zs = _liczba(tm, "stawka_h")
        os_, zo = _liczba(tm, "liczba_osob")
        h, zh = _liczba(tm, "godziny_mies_na_osobe")
        wartosc_mies = (st * os_ * h, f"{zs}, {zo}, {zh}")
        dz.append(f"wynagrodzenie miesięczne = {fmt(st)} zł × {fmt(os_)} os. × {fmt(h)} h = {fmt(st * os_ * h)} zł "
                  f"[{wartosc_mies[1]}]")
    okres = _liczba(dane, "okres_miesiecy", False) if dane.get("okres_miesiecy") else None
    wartosc_umowy = _liczba(dane, "wartosc_umowy", False) if dane.get("wartosc_umowy") else None
    if wartosc_umowy is None and wartosc_mies and okres:
        wartosc_umowy = (wartosc_mies[0] * okres[0], f"{wartosc_mies[1]}; {okres[1]}")
        dz.append(f"wartość umowy = {fmt(wartosc_mies[0])} zł × {fmt(okres[0])} mies. = {fmt(wartosc_umowy[0])} zł")
    if wartosc_umowy is None:
        wyn["brak_danych"].append("wartość umowy")

    # E1
    cap = dane.get("cap")
    cap_kw = None
    if cap:
        if cap.get("krotnosc_wynagrodzenia_mies") and wartosc_mies:
            k, zk = _liczba(cap, "krotnosc_wynagrodzenia_mies")
            cap_kw = (wartosc_mies[0] * k, zk)
            dz.append(f"cap = {fmt(k)} × {fmt(wartosc_mies[0])} zł = {fmt(cap_kw[0])} zł [{zk}]")
        elif cap.get("kwota"):
            cap_kw = _liczba(cap, "kwota")
    if cap_kw is None:
        wyn["brak_danych"].append("limit odpowiedzialności (cap)")
    poza, nieogr = [], []
    scen_dni = int(dane.get("scenariusz_dni_opoznienia", 30))
    for k in dane.get("kary", []):
        naz, zr = k.get("nazwa", "kara"), k.get("zrodlo")
        if not zr:
            raise BrakZrodla(f"kara „{naz}”: brak pola „zrodlo”")
        typ = k.get("typ")
        pozycja = {"nazwa": naz, "zrodlo": zr, "typ": typ}
        if typ == "dzienna_pct":
            p, _ = _liczba(k, "procent")
            if not wartosc_mies and not k.get("podstawa"):
                wyn["brak_danych"].append(f"podstawa kary „{naz}”")
                continue
            podst = _liczba(k, "podstawa")[0] if k.get("podstawa") else wartosc_mies[0]
            dzien = podst * p / 100
            pozycja["za_dzien"] = dzien
            dz.append(f"{naz}: {fmt(p)}% × {fmt(podst)} zł = {fmt(dzien)} zł/dzień [{zr}]")
        elif typ == "dzienna_kwota":
            dzien, _ = _liczba(k, "kwota")
            pozycja["za_dzien"] = dzien
        elif typ in ("za_przypadek", "jednorazowa"):
            pozycja["za_przypadek"], _ = _liczba(k, "kwota")
        else:
            raise ValueError(f"kara „{naz}”: nieznany typ {typ!r}")
        sufit = _liczba(k, "sufit", False) if k.get("sufit") else None
        pozycja["sufit"] = sufit[0] if sufit else None
        if "za_dzien" in pozycja:
            s = pozycja["za_dzien"] * scen_dni
            if sufit:
                s = min(s, sufit[0])
            pozycja["scenariusz"] = f"{scen_dni} dni → {fmt(s)} zł"
            dz.append(f"{naz}: scenariusz {scen_dni} dni = {fmt(pozycja['za_dzien'])} × {scen_dni}"
                      f"{' (sufit ' + fmt(sufit[0]) + ')' if sufit else ''} = {fmt(s)} zł")
            if not sufit:
                pozycja["uwaga"] = "BEZ SUFITU — suma rośnie liniowo z czasem opóźnienia"
        if k.get("poza_capem"):
            if "za_dzien" in pozycja and not sufit:
                nieogr.append(f"{naz} ({zr}) — bez sufitu")
            else:
                poza.append((naz, zr, pozycja.get("sufit") or pozycja.get("za_przypadek")))
        if k.get("zalezy_od_IC"):
            wyn["zalezne_od_IC"].append(f"{naz} ({zr})")
        wyn["E2"].append({kk: (fmt(vv) if isinstance(vv, Decimal) else vv) for kk, vv in pozycja.items()})
    for ind in dane.get("indemnifikacje", []):
        zr = ind.get("zrodlo")
        if not zr:
            raise BrakZrodla("indemnifikacja: brak pola „zrodlo”")
        lim = _liczba(ind, "limit", False) if ind.get("limit") else None
        if ind.get("poza_capem", True):
            if lim:
                poza.append((ind.get("nazwa", "indemnifikacja"), zr, lim[0]))
            else:
                nieogr.append(f"{ind.get('nazwa', 'indemnifikacja')} ({zr}) — bez limitu")
    suma_poza = sum((x[2] for x in poza if x[2] is not None), D(0))
    e1 = wyn["E1"]
    e1["cap_nominalny"] = fmt(cap_kw[0]) if cap_kw else "BRAK DANYCH"
    e1["poza_capem_policzalne"] = [f"{n} ({z}) = {fmt(v)} zł" for n, z, v in poza]
    e1["poza_capem_nieograniczone"] = nieogr
    if nieogr:
        e1["efektywna"] = "NIEOGRANICZONA"
    elif cap_kw:
        tot = cap_kw[0] + suma_poza
        e1["efektywna"] = fmt(tot)
        if wartosc_umowy and wartosc_umowy[0]:
            e1["krotnosc_wartosci"] = fmt(tot / wartosc_umowy[0])
        dz.append(f"E1 = {fmt(cap_kw[0])} + {fmt(suma_poza)} = {fmt(tot)} zł")
    else:
        e1["efektywna"] = "BRAK DANYCH"

    # E3 asymetria
    a = dane.get("asymetria")
    if a:
        x, zx = _liczba(a, "strona_A")
        y, zy = _liczba(a, "strona_B")
        wyn["E3"] = {"A": fmt(x), "B": fmt(y), "roznica": fmt(x - y),
                     "krotnosc": fmt(x / y) if y else "∞ (strona B: 0)", "zrodla": f"{zx}; {zy}"}

    # E4 daty graniczne
    t = dane.get("terminy") or {}
    if t.get("data_zawarcia") and t.get("okres_miesiecy"):
        d0 = dt.date.fromisoformat(t["data_zawarcia"]["wartosc"] if isinstance(t["data_zawarcia"], dict)
                                   else t["data_zawarcia"])
        m, zm = _liczba(t, "okres_miesiecy")
        koniec = _dodaj_miesiace(d0, int(m))
        wyn["E4"]["koniec_okresu"] = koniec.isoformat()
        wyn["E4"]["uwaga_koniec"] = "koniec okresu liczony wg art. 112 KC do weryfikacji w ELI (dzień odpowiadający)"
        if t.get("okno_dni"):
            ok, zo = _liczba(t, "okno_dni")
            wyn["E4"]["ostatni_dzien_na_oswiadczenie"] = (koniec - dt.timedelta(days=int(ok))).isoformat()
            dz.append(f"E4: {d0} + {int(m)} mies. = {koniec}; − {int(ok)} dni = "
                      f"{wyn['E4']['ostatni_dzien_na_oswiadczenie']} [{zm}; {zo}]")
    if t.get("podwyzka_pct") and (t.get("stawka") or (tm and tm.get("stawka_h"))):
        p, zp = _liczba(t, "podwyzka_pct")
        st = _liczba(t, "stawka")[0] if t.get("stawka") else _liczba(tm, "stawka_h")[0]
        nowa = st * (1 + p / 100)
        wyn["E4"]["stawka_po_przedluzeniu"] = fmt(nowa)
        if wartosc_mies and tm:
            wyn["E4"]["wynagrodzenie_mies_po_przedluzeniu"] = fmt(wartosc_mies[0] * (1 + p / 100))
        dz.append(f"E4: stawka po przedłużeniu = {fmt(st)} × (1 + {fmt(p)}%) = {fmt(nowa)} [{zp}]")
    if t.get("termin_platnosci_dni"):
        tp, zt = _liczba(t, "termin_platnosci_dni")
        wyn["E4"]["termin_platnosci_dni"] = int(tp)
        if tp > 60:
            wyn["E4"]["uwaga_platnosc"] = ("termin > 60 dni — sprawdź reżim ustawy o przeciwdziałaniu nadmiernym "
                                           "opóźnieniom w transakcjach handlowych (ELI, RZĄD 1)")
    if wartosc_mies:
        wyn["wynagrodzenie_miesieczne"] = fmt(wartosc_mies[0])
    if wartosc_umowy:
        wyn["wartosc_umowy"] = fmt(wartosc_umowy[0])
    wyn["linia_R_EKS"] = (f"R-EKS: E1 = {e1['efektywna']}"
                          f"{' (' + e1['krotnosc_wartosci'] + '× wartości)' if e1.get('krotnosc_wartosci') else ''}"
                          f" · E2 = {'; '.join(p.get('scenariusz') or (p.get('za_przypadek', '') + ' zł/przypadek') for p in wyn['E2']) or '—'}"
                          f" · E3 = {wyn['E3']['krotnosc'] + '×' if wyn['E3'] else '—'}"
                          f" · E4 = {wyn['E4'].get('ostatni_dzien_na_oswiadczenie', '—')}"
                          f"   Zależne od IC: {', '.join(wyn['zalezne_od_IC']) or '—'}"
                          f"   Brak danych: {', '.join(wyn['brak_danych']) or '—'}   [kontrakt_rachunek.py]")
    return wyn


# ─────────────────────────────── słownie ───────────────────────────────────
def _formy(*par):
    out = {}
    for wart, formy in par:
        for f in formy.split():
            out[f] = wart
    return out


JEDN = _formy(
    (0, "zero"), (1, "jeden jedna jedno jednego jednej jednym jedną"),
    (2, "dwa dwie dwóch dwu dwoma dwom"), (3, "trzy trzech trzem trzema"),
    (4, "cztery czterech czterem czterema"), (5, "pięć pięciu"), (6, "sześć sześciu"),
    (7, "siedem siedmiu"), (8, "osiem ośmiu"), (9, "dziewięć dziewięciu"), (10, "dziesięć dziesięciu"),
    (11, "jedenaście jedenastu"), (12, "dwanaście dwunastu"), (13, "trzynaście trzynastu"),
    (14, "czternaście czternastu"), (15, "piętnaście piętnastu"), (16, "szesnaście szesnastu"),
    (17, "siedemnaście siedemnastu"), (18, "osiemnaście osiemnastu"), (19, "dziewiętnaście dziewiętnastu"),
    (20, "dwadzieścia dwudziestu"), (30, "trzydzieści trzydziestu"), (40, "czterdzieści czterdziestu"),
    (50, "pięćdziesiąt pięćdziesięciu"), (60, "sześćdziesiąt sześćdziesięciu"),
    (70, "siedemdziesiąt siedemdziesięciu"), (80, "osiemdziesiąt osiemdziesięciu"),
    (90, "dziewięćdziesiąt dziewięćdziesięciu"), (100, "sto stu"), (200, "dwieście dwustu"),
    (300, "trzysta trzystu"), (400, "czterysta czterystu"), (500, "pięćset pięciuset"),
    (600, "sześćset sześciuset"), (700, "siedemset siedmiuset"), (800, "osiemset ośmiuset"),
    (900, "dziewięćset dziewięciuset"))
MNOZ = _formy((1000, "tysiąc tysiące tysięcy tysiąca tysiącach tysiącem"),
              (1000000, "milion miliony milionów miliona milionem"))
SLOWO = re.compile(r"[a-ząćęłńóśźż]+", re.I)
# separator tysięcy: kropka, spacja niełamiąca (U+00A0) lub wąska spacja niełamiąca (U+202F)
CYFRY = re.compile(r"(?<![\d.,])(\d{1,3}(?:[.\u00a0\u202f]\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?)(?![\d])")


def slowa_na_liczbe(slowa: list[str]) -> int | None:
    tot, cur, byla = 0, 0, False
    for w in slowa:
        w = w.lower()
        if w in JEDN:
            cur += JEDN[w]; byla = True
        elif w in MNOZ:
            tot += (cur or 1) * MNOZ[w]; cur = 0; byla = True
        else:
            return None
    return tot + cur if byla else None


def _cyfra(s: str) -> Decimal:
    return D(re.sub(r"[.\u00a0\u202f]", "", s).replace(",", "."))


def slownie(tekst: str) -> list[dict]:
    """Znajduje ciągi liczebników (≥1 słowo) i paruje z najbliższą liczbą cyfrową
    w tym samym akapicie (±160 znaków). Zgłasza wyłącznie pary, w których liczebnik
    jest w nawiasie, po słowie „słownie” albo przed „zł/złotych/procent”."""
    wyniki = []
    akapity = re.split(r"\n\s*\n", tekst)
    off = 0
    for ak in akapity:
        tokeny = [(m.group(0), m.start(), m.end()) for m in SLOWO.finditer(ak)]
        i = 0
        uzyte_cyfry = set()
        while i < len(tokeny):
            if tokeny[i][0].lower() in JEDN or tokeny[i][0].lower() in MNOZ:
                j = i
                while j < len(tokeny) and (tokeny[j][0].lower() in JEDN or tokeny[j][0].lower() in MNOZ):
                    j += 1
                fraza = [t[0] for t in tokeny[i:j]]
                s, e = tokeny[i][1], tokeny[j - 1][2]
                wart = slowa_na_liczbe(fraza)
                przed, po = ak[max(0, s - 25):s].lower(), ak[e:e + 40].lower()
                kontekst = ("(" in ak[max(0, s - 3):s] or "słownie" in przed or "słownie" in po[:15]
                            or re.match(r"\s*(zł|złot|procent|%)", po))
                if wart is not None and kontekst:
                    kand = [(abs(m.start() - s), m) for m in CYFRY.finditer(ak)
                            if abs(m.start() - s) <= 160 and m.start() not in uzyte_cyfry
                            and not re.match(r"\d{2}-\d{3}", ak[m.start():m.start() + 6])
                            and not re.search(r"(KRS|NIP|REGON|nr|poz\.|§|ust\.|pkt|art\.)\s*$", ak[max(0, m.start() - 8):m.start()])]
                    if kand:
                        _, m = min(kand, key=lambda x: x[0])
                        uzyte_cyfry.add(m.start())
                        c = _cyfra(m.group(1))
                        zgod = c == D(wart) or (c.to_integral_value() == c and int(c) == wart)
                        linia = tekst[:off + s].count("\n") + 1
                        wyniki.append({"status": "OK" if zgod else "ROZBIEZNOSC", "linia": linia,
                                       "cyfra": m.group(1), "slownie": " ".join(fraza),
                                       "wartosc_slownie": wart, "wartosc_cyfra": str(c)})
                i = j
            else:
                i += 1
        off += len(ak) + 2
    return wyniki


# ────────────────────────────── odesłania ──────────────────────────────────
NAGL = re.compile(r"^\s*(?:#+\s*)?(?:\*\*)?§\s*(\d+[a-z]?)\b", re.M)
UST_KROP = re.compile(r"^\s*(?:\*\*)?(\d+)\.(\d+)\.(?:\s|\*)", re.M)
UST_PROS = re.compile(r"^\s*(?:\*\*)?(\d+)\.\s", re.M)
PKT = re.compile(r"^\s*(?:\*\*)?(\d+)\)\s", re.M)
REF_PAR = re.compile(r"§\s*(\d+[a-z]?)(?:\.(\d+))?(?:\s*ust\.?\s*(\d+)(?:\.(\d+))?)?(?:\s*pkt\.?\s*(\d+))?")
REF_UST = re.compile(r"(?<!§)(?<!§\s)\bust\.?\s*(\d+)(?:\.(\d+))?")
REF_ZAL = re.compile(r"Załącznik(?:u|iem|a|i|ach)?\s+nr\s*(\d+)", re.I)
ZEWN = re.compile(r"(art\.\s*\d+[\w¹²³⁴⁵⁶⁷⁸⁹⁰]*\s*|KC\s*|k\.c\.\s*|ustawy\s*|rozporządzenia\s*)$", re.I)


def odeslania(tekst: str) -> dict:
    linie = tekst.splitlines()
    pary = []  # (nr_linii, §)
    for m in NAGL.finditer(tekst):
        pary.append((tekst[:m.start()].count("\n"), m.group(1)))
    paragrafy = {p for _, p in pary}
    krop = {(a, b) for a, b in UST_KROP.findall(tekst)}
    styl = "kropkowy (N.M.)" if krop else "ustępy w §"
    ust_w_par: dict[str, set] = {}
    pkt_w: dict[tuple, set] = {}
    biez, biez_ust = None, None
    for i, l in enumerate(linie):
        for nr, p in pary:
            if nr == i:
                biez, biez_ust = p, None
        if biez and not krop:
            m = UST_PROS.match(l)
            if m:
                biez_ust = m.group(1)
                ust_w_par.setdefault(biez, set()).add(m.group(1))
        m = PKT.match(l)
        if m and biez:
            pkt_w.setdefault((biez, biez_ust), set()).add(m.group(1))
    zal_def = set()
    # wykaz załączników = linia zaczynająca się od „Załącznik…” + jej kontynuacja do pustej linii
    # (poprawka 2026-09-29: wykaz zawinięty na 2 linie dawał fałszywy alarm na umowie kontrolnej 01)
    for m in re.finditer(r"(?ims)^[ \t]*(?:#+[ \t]*|\*+[ \t]*)?załącznik.*?(?=\n[ \t]*\n|\Z)", tekst):
        zal_def |= set(re.findall(r"nr\s*(\d+)", m.group(0)))
    ustalenia, sprawdzone = [], 0

    def zgl(nr, ref, powod):
        ustalenia.append({"status": "MARTWE_ODESLANIE", "linia": nr + 1, "odeslanie": ref, "powod": powod})

    biez = None
    for i, l in enumerate(linie):
        for nr, p in pary:
            if nr == i:
                biez = p
        tylko_tresc = NAGL.sub("", l) if NAGL.match(l) else l
        for m in REF_PAR.finditer(tylko_tresc):
            if ZEWN.search(tylko_tresc[max(0, m.start() - 30):m.start()]):
                continue  # „art. 484 § 1 KC” — przepis ustawy, nie jednostka umowy
            p, kropM, u, uM, pk = m.groups()
            sprawdzone += 1
            ref = m.group(0).strip()
            if p not in paragrafy:
                zgl(i, ref, f"brak § {p} w umowie (paragrafy: {', '.join(sorted(paragrafy, key=lambda x: int(re.sub(r'[a-z]', '', x)))) or '—'})")
                continue
            if kropM and krop and (p, kropM) not in krop:
                zgl(i, ref, f"brak jednostki {p}.{kropM}")
            if u:
                if krop:
                    jedn = (u, uM) if uM else (p, u)
                    if jedn not in krop:
                        zgl(i, ref, f"brak jednostki {jedn[0]}.{jedn[1]}")
                elif u not in ust_w_par.get(p, set()):
                    zgl(i, ref, f"§ {p} nie ma ust. {u}")
        for m in REF_UST.finditer(tylko_tresc):
            if tylko_tresc[max(0, m.start() - 12):m.start()].rstrip().endswith(tuple("0123456789")) and "§" in tylko_tresc[max(0, m.start() - 12):m.start()]:
                continue  # już objęte REF_PAR
            if ZEWN.search(tylko_tresc[max(0, m.start() - 30):m.start()]) or re.search(r"art\.\s*\d+\w*\s*$", tylko_tresc[max(0, m.start() - 20):m.start()]):
                continue
            u, uM = m.groups()
            if not biez:
                continue
            sprawdzone += 1
            if krop:
                jedn = (u, uM) if uM else (biez, u)
                if jedn not in krop:
                    zgl(i, m.group(0), f"brak jednostki {jedn[0]}.{jedn[1]}")
            elif u not in ust_w_par.get(biez, set()):
                zgl(i, m.group(0), f"§ {biez} nie ma ust. {u}")
        for m in REF_ZAL.finditer(l):
            if re.match(r"\s*(?:#+\s*|\*+)?\s*załącznik", l, re.I):
                continue
            sprawdzone += 1
            if zal_def and m.group(1) not in zal_def:
                zgl(i, m.group(0), f"załącznik nr {m.group(1)} nie figuruje w wykazie załączników ({', '.join(sorted(zal_def)) or '—'})")
    if not zal_def and REF_ZAL.search(tekst):
        ustalenia.append({"status": "NIEROZSTRZYGNIETE", "linia": None, "odeslanie": "Załącznik nr …",
                          "powod": "umowa powołuje załączniki, ale nie ma ich wykazu — sprawdź ręcznie"})
    return {"styl_numeracji": styl, "paragrafy": sorted(paragrafy, key=lambda x: int(re.sub(r'[a-z]', '', x))),
            "odeslan_sprawdzonych": sprawdzone, "ustalenia": ustalenia,
            "status": "ROZBIEZNOSC" if any(u["status"] == "MARTWE_ODESLANIE" for u in ustalenia) else "OK"}


# ─────────────────────────────── cytaty ────────────────────────────────────
_TYPO = str.maketrans({"„": '"', "”": '"', "“": '"', "«": '"', "»": '"', "‘": "'", "’": "'",
                       "–": "-", "—": "-", "\u00a0": " ", "\u202f": " "})


def _norm(t: str) -> str:
    t = t.translate(_TYPO).replace("**", "").replace("__", "")
    t = re.sub(r"-\n(?=\w)", "", t)            # przeniesienie wyrazu
    return re.sub(r"\s+", " ", t).strip().lower()


def cytaty(tekst: str, lista: list) -> dict:
    """WD-2 deterministycznie. `lista`: ["cytat", ...] albo [{"cytat": ..., "lokalizacja": "§3.1"}].
    Wynik per cytat: DOSLOWNY / NIEZWERYFIKOWANY (→ [CYTAT NIEZWERYFIKOWANY], nie przypisuj umowie).
    Dla niezweryfikowanego podaje najdłuższy dosłowny prefiks — pokazuje, gdzie cytat „odjechał”."""
    baza = _norm(tekst)
    wyn = []
    for poz in lista:
        c = poz["cytat"] if isinstance(poz, dict) else str(poz)
        n = _norm(c)
        if not n:
            continue
        ok = n in baza
        r = {"cytat": c, "status": "DOSLOWNY" if ok else "NIEZWERYFIKOWANY"}
        if isinstance(poz, dict) and poz.get("lokalizacja"):
            r["lokalizacja"] = poz["lokalizacja"]
        if not ok:
            slowa = n.split(" ")
            k = 0
            while k < len(slowa) and " ".join(slowa[:k + 1]) in baza:
                k += 1
            r["zgodny_prefiks_slow"] = f"{k}/{len(slowa)}"
            r["rozjazd_od"] = " ".join(slowa[k:k + 6])
        wyn.append(r)
    zle = sum(1 for r in wyn if r["status"] != "DOSLOWNY")
    return {"status": "ROZBIEZNOSC" if zle else "OK", "sprawdzonych": len(wyn), "niezweryfikowanych": zle,
            "cytaty": wyn}


# ──────────────────────────────── CLI ──────────────────────────────────────
def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sp = ap.add_subparsers(dest="cmd", required=True)
    a1 = sp.add_parser("oblicz"); a1.add_argument("wyrazenie")
    a2 = sp.add_parser("ekspozycja"); a2.add_argument("--json", required=True)
    a3 = sp.add_parser("slownie"); a3.add_argument("--plik", required=True)
    a4 = sp.add_parser("odeslania"); a4.add_argument("--plik", required=True)
    a5 = sp.add_parser("cytaty"); a5.add_argument("--plik", required=True); a5.add_argument("--cytaty", required=True)
    a = ap.parse_args(argv)
    try:
        if a.cmd == "oblicz":
            w = oblicz(a.wyrazenie)
            print(json.dumps({"status": "OK", "wyrazenie": a.wyrazenie, "wynik": fmt(w), "wynik_dokladny": str(w)},
                             ensure_ascii=False)); return 0
        if a.cmd == "ekspozycja":
            r = ekspozycja(json.loads(Path(a.json).read_text(encoding="utf-8")))
            print(json.dumps(r, ensure_ascii=False, indent=1)); return 0
        tekst = Path(a.plik).read_text(encoding="utf-8")
        if a.cmd == "cytaty":
            r = cytaty(tekst, json.loads(Path(a.cytaty).read_text(encoding="utf-8")))
            print(json.dumps(r, ensure_ascii=False, indent=1)); return 1 if r["status"] != "OK" else 0
        if a.cmd == "slownie":
            r = slownie(tekst)
            print(json.dumps({"status": "ROZBIEZNOSC" if any(x["status"] != "OK" for x in r) else "OK",
                              "pary": r}, ensure_ascii=False, indent=1))
            return 1 if any(x["status"] != "OK" for x in r) else 0
        r = odeslania(tekst)
        print(json.dumps(r, ensure_ascii=False, indent=1))
        return 1 if r["status"] != "OK" else 0
    except BrakZrodla as e:
        print(json.dumps({"status": "BRAK_ZRODLA", "detail": str(e)}, ensure_ascii=False)); return 1
    except (ValueError, KeyError, SyntaxError, json.JSONDecodeError, OSError) as e:
        print(json.dumps({"status": "BLAD_WEJSCIA", "detail": f"{type(e).__name__}: {e}"}, ensure_ascii=False))
        return 2


if __name__ == "__main__":
    sys.exit(main())
