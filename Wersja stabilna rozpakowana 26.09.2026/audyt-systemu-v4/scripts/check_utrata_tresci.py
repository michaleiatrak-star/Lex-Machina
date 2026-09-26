#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T30 — utrata treści bez cofnięcia numeru wersji (F-189).

Powstał 2026-09-16 (AUDYT-2026-09-16c). T12 wykrywa regresję dyskową tylko wtedy,
gdy numer `version:` na dysku jest NIŻSZY niż w dzienniku. Utrata, po której numer
podbito ponownie (kolizja: ten sam numer w dwóch sesjach), jest dla T12 niewidoczna —
tak zaginęła naprawa `dr-09` z AUDYT-2026-09-10l.

Dwie kontrole:
  A. Tabele „było → jest" w AUDIT-JOURNAL (pierwsza komórka: stary numer Dz.U.,
     druga: nowy, trzecia: skill). Dla każdego wiersza: nowy numer MUSI występować
     w skillu, a stary NIE MOŻE występować poza kontekstem historycznym
     („poprzedni", „wygasł", „było", „→", …).
  B. Kolizje wersji: ten sam numer wersji tego samego skilla w dwóch różnych
     sesjach dziennika (od 2026-08-24 — wcześniejsze wpisy nie mają changelogów).

Offline, deterministyczny. Kod wyjścia: 1 przy trafieniu A lub B, 0 w przeciwnym razie.
"""
import argparse, glob, os, re, sys

HIST = re.compile(r"(?i)poprzedn|wygas|był[aoy]?\b|zamiast|→|->|historycz|dawn|nieaktualn|"
                  r"stary|stara|zastąpi|korekt|eliminow|błędn|pułapk|podmian")
POMIN = ("CHANGELOG", "AUDIT-JOURNAL", "mapa_dzu", "PRZETERMINOWANE", "raporty-pokrycia",
         "WARN-OTWARTE", "REGRESSION-TEST-PLAN")
OD_DATY = "AUDYT-2026-08-24"


def _skille(root):
    return sorted((d for d in os.listdir(root) if os.path.isfile(os.path.join(root, d, "SKILL.md"))),
                  key=len, reverse=True)


def _pliki(root, skill):
    for f in glob.glob(os.path.join(root, skill, "**", "*.md"), recursive=True):
        if not any(p in f for p in POMIN):
            yield f


def _wzor(y, n):
    return re.compile(rf"(?<!\d){y}\s*(?:r\.\s*)?(?:poz\.\s*|/|\.)\s*{n}(?!\d)")


def kontrola_a(root, dziennik):
    skills = _skille(root)
    alias = {}
    for i in range(1, 17):
        k = "dr-%02d" % i
        m = [s for s in skills if s.startswith(k + "-")]
        if m:
            alias[k] = m[0]
    wynik = []
    for nr, l in enumerate(dziennik, 1):
        if not l.startswith("|"):
            continue
        c = [x.strip() for x in l.strip().strip("|").split("|")]
        if len(c) < 3:
            continue
        a = re.fullmatch(r"`?(\d{4})[/.](\d{1,4})`?(?:\s*×\d)?", c[0])
        b = re.fullmatch(r"\*{0,2}`?(\d{4})[/.](\d{1,4})`?\*{0,2}", c[1])
        if not (a and b):
            continue
        kto = {s for s in skills if s in c[2]} | {alias[k] for k in alias
                                                  if re.search(rf"`?{k}`?(?![\d-])", c[2])}
        for s in sorted(kto):
            nowy = stary = False
            for f in _pliki(root, s):
                for linia in open(f, encoding="utf-8"):
                    if _wzor(*b.groups()).search(linia):
                        nowy = True
                    if _wzor(*a.groups()).search(linia) and not HIST.search(linia):
                        stary = True
            if not nowy or stary:
                wynik.append(f"L{nr}: {s} — było {a.group(1)}/{a.group(2)} "
                             f"(żywe: {stary}), jest {b.group(1)}/{b.group(2)} (obecne: {nowy})")
    return wynik


def kontrola_b(root, dziennik):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import check_wersje_changelog as c
    skills = _skille(root)
    naglowki, h = [], None
    for l in dziennik:
        if l.startswith("## AUDYT"):
            h = l[3:3 + len(OD_DATY) + 1].rstrip()
        naglowki.append(h)
    jednostki, blok, start = [], None, 0
    for i, l in enumerate(dziennik):
        if not l.strip():
            if blok is not None:
                jednostki.append((" ".join(blok), True, start))
                blok = None
            continue
        if l.lstrip().startswith("|"):
            jednostki.append((l, True, i))
            continue
        if blok is not None:
            blok.append(l.strip())
        elif "wersj" in l.lower():
            blok, start = [l.strip()], i
        else:
            jednostki.append((l, False, i))
    if blok is not None:
        jednostki.append((" ".join(blok), True, start))
    mapa = {}
    for s in skills:
        for t, f, i in jednostki:
            if s not in t or not naglowki[i] or naglowki[i] < OD_DATY:
                continue
            for seg in (x for y in re.split(r"[,;]", t) for x in re.split(r"(?=`[^`]+`)", y)):
                if s not in seg:
                    continue
                z = []
                c._dopasuj_segment(seg, z, f, s)
                for v in z:
                    mapa.setdefault((s, v), set()).add(naglowki[i])
    wynik = []
    for (s, v), h in sorted(mapa.items()):
        if len(h) < 2 or _zadeklarowana(root, s, v):
            continue
        wynik.append(f"{s} {v}: {sorted(h)}")
    return wynik


def _zadeklarowana(root, skill, wersja):
    """Kolizja rozstrzygnięta = w CHANGELOG skilla linia z numerem i „LUKA JAWNA"/„KOLIZJA"
    (ten sam mechanizm co deklaracja luki w T12: brak widać, zmyślonego wpisu — nie)."""
    p = os.path.join(root, skill, "references", "CHANGELOG.md")
    if not os.path.exists(p):
        return False
    wz = re.compile(rf"(?<![\d.]){re.escape(wersja)}(?![\d])")
    return any(wz.search(l) and ("LUKA JAWNA" in l or "KOLIZJA" in l)
               for l in open(p, encoding="utf-8"))


def selftest():
    import tempfile
    ok = 0
    with tempfile.TemporaryDirectory() as d:
        for s in ("dr-09-x", "audyt-systemu-v4"):
            os.makedirs(f"{d}/{s}/modules")
            open(f"{d}/{s}/SKILL.md", "w").write("---\nname: x\n---\n")
        m = f"{d}/dr-09-x/modules/a.md"
        open(m, "w", encoding="utf-8").write("Tekst jednolity: Dz.U. 2024 poz. 1112\n")
        J = ["## AUDYT-2026-09-10l — test", "", "| Było | Jest | Skill |", "|---|---|---|",
             "| `2024/1112` | **2026/670** | `dr-09` |"]
        r1 = kontrola_a(d, J)
        open(m, "w", encoding="utf-8").write("Tekst jednolity: Dz.U. 2026 poz. 670 (poprzedni 2024 poz. 1112 wygasły)\n")
        r2 = kontrola_a(d, J)
        open(m, "w", encoding="utf-8").write("Tekst jednolity: Dz.U. 2026 poz. 670\nDz.U. 2024 poz. 1112\n")
        r3 = kontrola_a(d, J)
        os.makedirs(f"{d}/dr-09-x/references")
        JB = ["## AUDYT-2026-09-10l — a", "**Wersje:** `dr-09-x` 3.28 → 3.29", "",
              "## AUDYT-2026-09-13 — b", "**Wersje:** `dr-09-x` 3.28 → 3.29", ""]
        open(f"{d}/dr-09-x/references/CHANGELOG.md", "w", encoding="utf-8").write("# CL\n- 3.29 (13)\n")
        b1 = kontrola_b(d, JB)
        open(f"{d}/dr-09-x/references/CHANGELOG.md", "a", encoding="utf-8").write("- 3.29 (10l) — LUKA JAWNA: kolizja\n")
        b2 = kontrola_b(d, JB)
        for opis, war in [("utrata wykryta (stary żywy, nowego brak)", len(r1) == 1),
                          ("stan poprawny — brak trafienia (kontekst historyczny)", r2 == []),
                          ("stary numer żywy obok nowego — trafienie", len(r3) == 1),
                          ("kolizja numeru wersji wykryta", len(b1) == 1),
                          ("kolizja zadeklarowana w CHANGELOG — pominięta", b2 == [])]:
            print(("  OK   " if war else "  FAIL ") + opis)
            ok += war
    print(f"SELFTEST T30: {ok}/5")
    return 0 if ok == 5 else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    j = os.path.join(a.repo_root, "audyt-systemu-v4", "references", "AUDIT-JOURNAL.md")
    dziennik = open(j, encoding="utf-8").read().splitlines()
    A, B = kontrola_a(a.repo_root, dziennik), kontrola_b(a.repo_root, dziennik)
    print("T30 — utrata treści bez cofnięcia numeru (F-189)")
    print(f"  A. tabele „było → jest\": {len(A)} trafień")
    for x in A:
        print("     ⛔", x)
    print(f"  B. kolizje numerów wersji (od {OD_DATY[6:]}): {len(B)}")
    for x in B:
        print("     ⚠️", x)
    if not A and not B:
        print("WYNIK T30: ✅ PASS")
        return 0
    print("WYNIK T30: ❌ FAIL — sprawdź, czy treść z dziennika jest na dysku")
    return 1


if __name__ == "__main__":
    sys.exit(main())
