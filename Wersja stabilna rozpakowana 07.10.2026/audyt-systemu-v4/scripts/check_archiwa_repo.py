#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T34 — check_archiwa_repo.py: drzewo rozpakowane ↔ paczki ZIP w repozytorium (F-196).

PO CO ISTNIEJE
  2026-09-23 do drzewa „Wersja rozwojowa rozpakowana” trafił zagnieżdżony duplikat
  `analizator-umow-v1/analizator-umow-v1/` (62 pliki), a 7 plików
  `przesluchanie-swiadkow-v2-min90` rozjechało się z paczką (drzewo 3.25, ZIP 3.26).
  Suita regresji dawała PASS STRUKTURALNY, bo T33 (`check_wydanie.py`) porównuje
  drzewo z katalogiem wydań sesji (domyślnie /mnt/user-data/outputs), a w
  repozytorium nie ma tam niczego — test był bezprzedmiotowy. Rozjazd wykrywał
  wyłącznie `scripts/verify_development_archives.py` w katalogu głównym repo,
  spoza orkiestratora i spoza CI (AUDYT-2026-09-26, U-1/U-2).

CO SPRAWDZA (dla każdego ZIP-a w katalogu paczek)
  A. ZIP ma dokładnie jeden katalog główny = nazwa skilla, bez ścieżek niebezpiecznych;
  B. zbiór plików ZIP == zbiór plików drzewa `<drzewo>/<skill>/` (bez __pycache__,
     .pytest_cache) — nadmiar w drzewie = FAIL (to był duplikat), brak = FAIL;
  C. bajtowa identyczność każdego pliku — FAIL z nazwą;
  D. katalog `<skill>/<skill>/` w drzewie = FAIL jawny (wzorzec F-196);
  E. katalog skilla w drzewie bez paczki = WARN (nie FAIL).

Katalog paczek: --archiwa albo automatycznie `../WERSJA ROZWOJOWA` względem drzewa.
Brak katalogu paczek = PASS informacyjny (host bez układu repozytorium).
Offline. Kod: 0 zgodne, 1 rozbieżność, 2 błąd wejścia. --selftest: 4 przypadki.
"""
import argparse, os, shutil, sys, tempfile, zipfile
from pathlib import Path, PurePosixPath

POMIN = {"__pycache__", ".pytest_cache"}


def pliki(katalog: Path) -> dict:
    out = {}
    for root, dirs, files in os.walk(katalog):
        dirs[:] = [d for d in dirs if d not in POMIN]
        for f in files:
            p = Path(root) / f
            # Pliki kanału pluginów w korzeniu skilla (.claude-plugin/, .mcp.json) nie
            # wchodzą do paczki: claude.ai odrzuca skill z manifestem pluginu (6.187).
            if p.relative_to(katalog).parts[0].startswith("."):
                continue
            out[p.relative_to(katalog).as_posix()] = p.read_bytes()
    return out


def sprawdz(drzewo: Path, archiwa: Path):
    bledy, ostrz, spr = [], [], 0
    for d in sorted(x for x in drzewo.iterdir() if x.is_dir() and x.name not in POMIN):
        if (d / d.name).is_dir():
            bledy.append(f"D: zagnieżdżony katalog {d.name}/{d.name}/ (wzorzec F-196)")
    zipy = sorted(archiwa.glob("*.zip"))
    nazwy = set()
    for z in zipy:
        with zipfile.ZipFile(z) as zf:
            wpisy = [i for i in zf.infolist() if not i.is_dir()]
            imiona = [i.filename for i in wpisy]
            if any(PurePosixPath(n).is_absolute() or ".." in PurePosixPath(n).parts or "\\" in n for n in imiona):
                bledy.append(f"A: {z.name}: niebezpieczna ścieżka"); continue
            korzenie = {PurePosixPath(n).parts[0] for n in imiona}
            if len(korzenie) != 1:
                bledy.append(f"A: {z.name}: {len(korzenie)} katalogi główne {sorted(korzenie)[:3]}"); continue
            skill = korzenie.pop(); nazwy.add(skill)
            zawart = {n[len(skill) + 1:]: zf.read(n) for n in imiona
                      if not any(p in POMIN for p in PurePosixPath(n).parts)}
            for n in imiona:
                if len(PurePosixPath(n).parts) > 1 and PurePosixPath(n).parts[1].startswith("."):
                    bledy.append(f"A: {z.name}: plik pluginu w paczce skilla: {n} (claude.ai odrzuca)")
        cel = drzewo / skill
        if not cel.is_dir():
            bledy.append(f"B: {z.name}: brak katalogu {skill}/ w drzewie"); continue
        dysk = pliki(cel); spr += 1
        for n in sorted(set(dysk) - set(zawart)):
            bledy.append(f"B: extra w drzewie: {skill}/{n}")
        for n in sorted(set(zawart) - set(dysk)):
            bledy.append(f"B: brak w drzewie: {skill}/{n}")
        for n in sorted(set(dysk) & set(zawart)):
            if dysk[n] != zawart[n]:
                bledy.append(f"C: różna treść: {skill}/{n}")
    for d in sorted(x.name for x in drzewo.iterdir() if x.is_dir() and x.name not in POMIN):
        if d not in nazwy:
            ostrz.append(f"E: {d}/ bez paczki w {archiwa.name}")
    return bledy, ostrz, spr


def _selftest() -> int:
    tmp = Path(tempfile.mkdtemp()); ok = True
    try:
        drzewo, arch = tmp / "drzewo", tmp / "arch"; arch.mkdir()
        (drzewo / "skill-a" / "references").mkdir(parents=True)
        (drzewo / "skill-a" / "SKILL.md").write_text("A\n"); (drzewo / "skill-a" / "references" / "x.md").write_text("x\n")
        def pakuj():
            with zipfile.ZipFile(arch / "skill-a.zip", "w") as zf:
                for n in ["SKILL.md", "references/x.md"]:
                    zf.write(drzewo / "skill-a" / n, f"skill-a/{n}")
        pakuj()
        przypadki = []
        przypadki.append(("zgodne", sprawdz(drzewo, arch)[0] == []))
        (drzewo / "skill-a" / "skill-a").mkdir(); (drzewo / "skill-a" / "skill-a" / "SKILL.md").write_text("A\n")
        b = sprawdz(drzewo, arch)[0]
        przypadki.append(("zagnieżdżony duplikat → FAIL", any(x.startswith("D:") for x in b) and any("extra" in x for x in b)))
        shutil.rmtree(drzewo / "skill-a" / "skill-a")
        (drzewo / "skill-a" / "references" / "x.md").write_text("zmienione\n")
        przypadki.append(("różna treść → FAIL", any(x.startswith("C:") for x in sprawdz(drzewo, arch)[0])))
        (drzewo / "skill-a" / "references" / "x.md").write_text("x\n")
        (drzewo / "skill-b").mkdir()
        b, o, _ = sprawdz(drzewo, arch)
        przypadki.append(("skill bez paczki → WARN, nie FAIL", b == [] and any(x.startswith("E:") for x in o)))
        for n, w in przypadki:
            print(f"  {'✅' if w else '❌'} {n}"); ok &= w
    finally:
        shutil.rmtree(tmp)
    print(f"SELFTEST: {'PASS' if ok else 'FAIL'}")
    return 0 if ok else 1


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", help="katalog z rozpakowanymi skillami")
    ap.add_argument("--archiwa", help="katalog z paczkami .zip (domyślnie ../WERSJA ROZWOJOWA)")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return _selftest()
    drzewo = Path(a.repo_root or Path(__file__).resolve().parents[2])
    archiwa = Path(a.archiwa) if a.archiwa else drzewo.parent / "WERSJA ROZWOJOWA"
    if not drzewo.is_dir():
        print(f"BŁĄD: brak drzewa {drzewo}"); return 2
    if not archiwa.is_dir():
        print(f"INFO: brak katalogu paczek ({archiwa}) — układ inny niż repozytorium; PASS informacyjny.")
        return 0
    bledy, ostrz, spr = sprawdz(drzewo, archiwa)
    print(f"T34: drzewo {drzewo.name} ↔ paczki {archiwa.name}: sprawdzonych skilli {spr}")
    for o in ostrz: print("  ⚠️", o)
    for b in bledy[:60]: print("  ❌", b)
    if len(bledy) > 60: print(f"  … i {len(bledy) - 60} dalszych")
    print(f"WYNIK: {'FAIL' if bledy else 'PASS'} ({len(bledy)} rozbieżności, {len(ostrz)} ostrzeżeń)")
    return 1 if bledy else 0


if __name__ == "__main__":
    sys.exit(main())
