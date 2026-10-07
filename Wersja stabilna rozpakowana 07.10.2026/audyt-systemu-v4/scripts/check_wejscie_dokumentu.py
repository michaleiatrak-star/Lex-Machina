#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T35 — check_wejscie_dokumentu.py: wywołanie bramki WD w skillach przyjmujących materiał (F-200).

Lista konsumentów NIE jest tu zakodowana: czytana jest z jednego źródła prawdy —
wiersza `MOD-WEJSCIE-DOKUMENTU.md` w `shared/DEPENDENCY-GRAPH.md`.
CO SPRAWDZA
  A. `shared/MOD-WEJSCIE-DOKUMENTU.md` istnieje i zawiera sekcje WD-1, WD-2, WD-3 (FAIL);
  B. wiersz konsumentów w DEPENDENCY-GRAPH istnieje i wskazuje istniejące skille (FAIL);
  C. każdy konsument ma w SKILL.md wywołanie `shared/MOD-WEJSCIE-DOKUMENTU.md` (FAIL);
  D. żaden konsument nie trzyma KOPII treści reguł (nagłówki `## WD-1`/`WD-1.1`…) (FAIL) —
     wzorzec F-115: kopie dryfują przy pierwszej zmianie źródła.
Offline. Kod: 0 PASS, 1 FAIL, 2 błąd wejścia. --selftest: 4 przypadki.
"""
import argparse, re, shutil, sys, tempfile
from pathlib import Path

MOD = "MOD-WEJSCIE-DOKUMENTU.md"
KOPIA = re.compile(r"^#{1,4}\s*WD-[123]\b|^\*\*WD-[123]\.\d", re.M)


def konsumenci(root: Path):
    dg = root / "shared" / "DEPENDENCY-GRAPH.md"
    if not dg.is_file():
        return None
    for l in dg.read_text(encoding="utf-8").splitlines():
        if l.startswith(f"| `{MOD}`"):
            kol = l.split("|")[3]
            return [n for n in re.findall(r"[a-z0-9]+(?:-[a-z0-9]+)+", kol.split("—")[0]) if (root / n).is_dir()] \
                or re.findall(r"[a-z0-9]+(?:-[a-z0-9]+)+", kol.split("—")[0])
    return None


def sprawdz(root: Path):
    bledy = []
    m = root / "shared" / MOD
    if not m.is_file():
        return [f"A: brak shared/{MOD}"], []
    t = m.read_text(encoding="utf-8")
    for w in ("WD-1", "WD-2", "WD-3"):
        if not re.search(rf"^## {w}\b", t, re.M):
            bledy.append(f"A: moduł bez sekcji ## {w}")
    lista = konsumenci(root)
    if not lista:
        return bledy + ["B: brak wiersza konsumentów w shared/DEPENDENCY-GRAPH.md"], []
    for s in lista:
        p = root / s / "SKILL.md"
        if not p.is_file():
            bledy.append(f"B: konsument {s} nie istnieje"); continue
        body = p.read_text(encoding="utf-8")
        if f"shared/{MOD}" not in body:
            bledy.append(f"C: {s}/SKILL.md bez wywołania shared/{MOD}")
        if KOPIA.search(body):
            bledy.append(f"D: {s}/SKILL.md zawiera kopię treści reguł WD")
    return bledy, lista


def _selftest() -> int:
    tmp = Path(tempfile.mkdtemp()); ok = True
    try:
        (tmp / "shared").mkdir(); (tmp / "skill-a").mkdir(); (tmp / "skill-b").mkdir()
        (tmp / "shared" / MOD).write_text("## WD-1 · a\n## WD-2 · b\n## WD-3 · c\n", encoding="utf-8")
        (tmp / "shared" / "DEPENDENCY-GRAPH.md").write_text(
            f"| `{MOD}` | ACTIVE | skill-a, skill-b — utworzony |\n", encoding="utf-8")
        wyw = f"view shared/{MOD}\n"
        (tmp / "skill-a" / "SKILL.md").write_text(wyw, encoding="utf-8")
        (tmp / "skill-b" / "SKILL.md").write_text(wyw, encoding="utf-8")
        wyn = [("komplet → PASS", sprawdz(tmp)[0] == [])]
        (tmp / "skill-b" / "SKILL.md").write_text("brak\n", encoding="utf-8")
        wyn.append(("brak wywołania → FAIL C", any(b.startswith("C:") for b in sprawdz(tmp)[0])))
        (tmp / "skill-b" / "SKILL.md").write_text(wyw + "## WD-1 · kopia\n", encoding="utf-8")
        wyn.append(("kopia treści → FAIL D", any(b.startswith("D:") for b in sprawdz(tmp)[0])))
        (tmp / "shared" / MOD).write_text("## WD-1\n## WD-3\n", encoding="utf-8")
        wyn.append(("moduł bez WD-2 → FAIL A", any("WD-2" in b for b in sprawdz(tmp)[0])))
        for n, w in wyn:
            print(f"  {'✅' if w else '❌'} {n}"); ok &= w
    finally:
        shutil.rmtree(tmp)
    print(f"SELFTEST: {'PASS' if ok else 'FAIL'}")
    return 0 if ok else 1


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return _selftest()
    root = Path(a.repo_root or Path(__file__).resolve().parents[2])
    bledy, lista = sprawdz(root)
    print(f"T35: konsumenci bramki WD (z DEPENDENCY-GRAPH): {len(lista)} — {', '.join(lista)}")
    for b in bledy: print("  ❌", b)
    print(f"WYNIK: {'FAIL' if bledy else 'PASS'}")
    return 1 if bledy else 0


if __name__ == "__main__":
    sys.exit(main())
