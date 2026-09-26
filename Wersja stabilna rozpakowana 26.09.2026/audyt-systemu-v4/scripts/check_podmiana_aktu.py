#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T31 — podmiana aktu w rejestrach map, NIEZALEŻNIE od oznaczenia „t.j.".

Powstał 2026-09-16d (AUDYT-2026-09-16d). T15 porównuje tytuł z ELI z nazwą
lokalną tylko dla deklaracji oznaczonych jako tekst jednolity. Wiersz
„… | Dz.U. 2024 poz. 44 ze zm. |" (podatek od kopalin opisany numerem ustawy
o rehabilitacji) przechodził więc bez porównania. Pierwszy przebieg T31 wykrył
5 dalszych podmian w ROUTING-MAP i MAPA-AKTOW (Prawo energetyczne → obwieszczenie
MF; „Prawo gazowe" → obwieszczenie MSWiA; charakterystyka energetyczna →
rozporządzenie MON; rolnictwo ekologiczne → rozporządzenie MKiŚ; UOKiK → Prawo
komunikacji elektronicznej).

Reguła: wiersz, którego pierwsza komórka zaczyna się od „Ustawa/Kodeks/Prawo/
Rozporządzenie", a druga zawiera DOKŁADNIE jeden numer Dz.U. — co najmniej połowa
rdzeni nazwy musi występować w tytule z ELI. Wpisy z references/ALIASY-NAZW-AKTOW.md
(numer + nazwa robocza zawarta w nazwie wiersza) są pomijane.

WYMAGA SIECI (API ELI). Wynik: kandydaci do przeglądu — status RĘCZNY.
Kod wyjścia: 0 brak kandydatów, 1 są kandydaci, 2 brak dostępu do ELI.
"""
import argparse, concurrent.futures as cf, glob, json, os, re, sys, unicodedata, urllib.request

STOP = set(("ustawa ustawy kodeks prawo rozporządzenie tekstu jednolitego sprawie ogłoszenia "
            "obwieszczenie marszałka sejmu rzeczypospolitej polskiej ministra niektórych innych "
            "oraz zmianie dnia").split())
WZ_NAZWA = re.compile(r"(?i)(ustawa|kodeks|prawo|rozporządzenie)\b")
WZ_NR = re.compile(r"Dz\.U\.\s*(\d{4})\s*poz\.\s*(\d+)")


def _n(s):
    return unicodedata.normalize("NFC", s.lower())


def aliasy(root):
    p = os.path.join(root, "audyt-systemu-v4", "references", "ALIASY-NAZW-AKTOW.md")
    out = []
    for l in open(p, encoding="utf-8"):
        c = [x.strip() for x in l.strip().strip("|").split("|")]
        if len(c) >= 4 and c[3]:
            m = re.fullmatch(r"Dz\.U\.\s*(\d{4})\s*poz\.\s*(\d+)", c[0])
            if m:
                out.append((m.groups(), _n(re.sub(r"[*`⛔⭐✅]", "", c[1]).strip())))
    return out


def wiersze(root):
    pliki = [os.path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md")] + \
        sorted(glob.glob(os.path.join(root, "*", "MAPA-AKTOW.md")))
    for f in pliki:
        for i, l in enumerate(open(f, encoding="utf-8"), 1):
            if not l.startswith("|"):
                continue
            c = [x.strip() for x in l.strip().strip("|").split("|")]
            if len(c) < 2:
                continue
            nazwa = re.sub(r"[*`⛔⭐✅⚡]", "", c[0]).strip()
            if not WZ_NAZWA.match(nazwa):
                continue
            nr = set(WZ_NR.findall(c[1]))
            if len(nr) == 1:
                yield os.path.relpath(f, root), i, nazwa, nr.pop()


def tytul_eli(nr):
    y, p = nr
    d = json.load(urllib.request.urlopen(f"https://api.sejm.gov.pl/eli/acts/DU/{y}/{p}", timeout=30))
    return d.get("title", ""), d.get("status", "")


def ocen(nazwa, tytul):
    nm = re.sub(r"\(.*?\)|—.*|–.*| - .*", "", nazwa)
    rdz = [w[:6] for w in re.findall(r"[a-ząćęłńóśźż]{5,}", _n(nm)) if w not in STOP]
    if not rdz:
        return True
    return sum(r in _n(tytul) for r in rdz) / len(rdz) >= 0.5


def selftest():
    ok = 0
    for opis, war in [
        ("ta sama ustawa — zgodne", ocen("Ustawa o charakterystyce energetycznej budynków",
                                         "Obwieszczenie … tekstu ustawy o charakterystyce energetycznej budynków")),
        ("podmiana (rozporządzenie MON) — niezgodne", not ocen("Ustawa o charakterystyce energetycznej budynków",
                                                               "Rozporządzenie Ministra Obrony Narodowej … w sprawie opłat za używanie lokali")),
        ("dopisek po myślniku ignorowany", ocen("Prawo energetyczne — rynek gazu",
                                                 "Obwieszczenie … tekstu ustawy - Prawo energetyczne")),
    ]:
        print(("  OK   " if war else "  FAIL ") + opis)
        ok += war
    print(f"SELFTEST T31: {ok}/3")
    return 0 if ok == 3 else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    al = aliasy(a.repo_root)
    rows = [r for r in wiersze(a.repo_root)
            if not any(r[3] == n and nm and nm in _n(r[2]) for n, nm in al)]
    nums = sorted({r[3] for r in rows})
    try:
        with cf.ThreadPoolExecutor(6) as ex:
            tyt = dict(zip(nums, ex.map(tytul_eli, nums)))
    except Exception as e:
        print(f"T31: brak dostępu do ELI — {e}")
        return 2
    kand = [(f, i, nm, n, *tyt[n]) for f, i, nm, n in rows if not ocen(nm, tyt[n][0])]
    print(f"T31 — wierszy: {len(rows)} (po aliasach), numerów: {len(nums)}, kandydatów: {len(kand)}")
    for f, i, nm, n, t, st in kand:
        print(f"  {f}:{i} | {nm[:60]} | {n[0]}/{n[1]} | {st} | ELI: {t[:120]}")
    return 1 if kand else 0


if __name__ == "__main__":
    sys.exit(main())
