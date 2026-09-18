#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T5 — widmowe pokrycie (ghost coverage): KANDYDACI do przeglądu ręcznego.

Powstał 2026-09-16 (AUDYT-2026-09-16b). Plan testów od 2026-07-21 opisywał T5
jako test „bez automatu"; pierwszy przebieg tej heurystyki wskazał 30 kandydatów,
z których po odczycie: 11 błędnych wskaźników, 2 prawdziwe widma, 2 PODMIANY
numeru aktu (2024/44 — rehabilitacja zamiast podatku od kopalin; 2024/1564 —
adwokatura podpięta pod moduł o pielęgniarkach), 1 nieaktualny status.

Reguła: wiersz ROUTING-MAP wskazuje moduł, w którym nie występuje ANI żaden numer
Dz.U. z tego wiersza, ANI wystarczająca liczba rdzeni (6 liter) nazwy aktu.

⛔ Wynik to LISTA KANDYDATÓW, nie lista błędów. Wiersze meta (rejestracja
current-state, moduły przekrojowe) wychodzą zawsze — oceniaj ręcznie. Status
w SKRYPTY-RECZNE.md. Kod wyjścia: 0 zawsze (test nie blokuje).
"""
import argparse, os, re, sys, unicodedata

STOP = set(("ustawa ustawy ustawie ustaw kodeks prawo przepisy niektórych innych "
            "oraz zmianie sprawie dotyczące rozporządzenie rozporządzenia").split())


def kandydaci(root):
    rm = os.path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md")
    wynik, n = [], 0
    for i, l in enumerate(open(rm, encoding="utf-8"), 1):
        if not l.startswith("|"):
            continue
        cells = [c.strip() for c in l.strip().strip("|").split("|")]
        if len(cells) < 3:
            continue
        mods = re.findall(r"([a-z0-9-]+/(?:modules|references)/[^\s`|,;)]+\.md)", l)
        if not mods:
            continue
        name = re.sub(r"[*`⛔⭐✅]", "", cells[0])
        nums = set(re.findall(r"(\d{4})\s*poz\.\s*(\d+)", l)) | set(re.findall(r"\b(20\d\d)[./](\d{1,4})\b", l))
        low = unicodedata.normalize("NFC", name.lower())
        rdzenie = [w[:6] for w in re.findall(r"[a-ząćęłńóśźż]{6,}", low) if w not in STOP]
        for m in mods:
            n += 1
            p = os.path.join(root, m)
            if not os.path.exists(p):
                wynik.append((i, m, "BRAK PLIKU", name[:70]))
                continue
            t = unicodedata.normalize("NFC", open(p, encoding="utf-8").read().lower())
            num = any(re.search(rf"{y}\s*(poz\.|/|\.)\s*{q}\b", t) for y, q in nums)
            traf = [w for w in rdzenie if w in t]
            if not num and len(traf) < max(1, min(2, len(rdzenie))):
                wynik.append((i, m, f"numery={sorted(nums)[:3]} rdzenie={rdzenie[:5]} trafione={traf}", name[:70]))
    return n, wynik


def selftest():
    import tempfile
    ok = 0
    with tempfile.TemporaryDirectory() as d:
        os.makedirs(f"{d}/prawo-polskie-v2"); os.makedirs(f"{d}/x/modules")
        open(f"{d}/x/modules/a.md", "w", encoding="utf-8").write("Ustawa o elektromobilności, Dz.U. 2024 poz. 1289")
        open(f"{d}/x/modules/b.md", "w", encoding="utf-8").write("Charakterystyka energetyczna budynków")
        open(f"{d}/prawo-polskie-v2/ROUTING-MAP.md", "w", encoding="utf-8").write(
            "| Ustawa o elektromobilności | Dz.U. 2024 poz. 1289 | x/modules/a.md | ok |\n"
            "| Ustawa o elektromobilności | Dz.U. 2024 poz. 1289 | x/modules/b.md | ok |\n"
            "| Ustawa o czymś | Dz.U. 2020 poz. 1 | x/modules/brak.md | ok |\n")
        n, w = kandydaci(d)
        for opis, war in [("poprawny wskaźnik nie jest kandydatem", all(c[1] != "x/modules/a.md" for c in w)),
                          ("moduł bez treści aktu jest kandydatem", any(c[1] == "x/modules/b.md" for c in w)),
                          ("brak pliku zgłoszony", any(c[2] == "BRAK PLIKU" for c in w)),
                          ("policzone 3 powiązania", n == 3)]:
            print(("  OK   " if war else "  FAIL ") + opis); ok += war
    print(f"SELFTEST T5: {ok}/4")
    return 0 if ok == 4 else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    n, w = kandydaci(a.repo_root)
    print(f"T5 — powiązań wiersz→moduł: {n}; kandydatów do przeglądu ręcznego: {len(w)}")
    for i, m, d, nm in w:
        print(f"  L{i} | {nm} | {m} | {d}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
