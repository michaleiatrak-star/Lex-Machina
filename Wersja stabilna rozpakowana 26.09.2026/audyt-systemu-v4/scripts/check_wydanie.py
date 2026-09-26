#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T33 — zgodność wydanych paczek z drzewem (kontrola PO wydaniu).

Powstał 2026-09-17r jako realizacja zalecenia z AUDYT-2026-09-17p. Tamta sesja
wykryła, że kopia robocza zmieniła się PO spakowaniu i zweryfikowaniu wydania
(3 fragmenty, 2 pliki, pochodzenie nieustalone). Zapora zadziałała dopiero przy
następnym przebiegu T21 — czyli przypadkiem.

Dla każdego skilla, który ma paczkę w katalogu wydań:
  * ZIP musi zawierać katalog o nazwie skilla i tyle samo plików co drzewo (FAIL);
  * każdy plik musi być bajtowo identyczny (FAIL) — wypisywane są nazwy;
  * CHECKSUMS.sha256 wewnątrz ZIP-a musi się zgadzać z jego zawartością (FAIL).
Skille bez paczki są pomijane (informacyjnie), paczki bez skilla — zgłaszane.

Offline. Kod wyjścia: 1 przy jakiejkolwiek rozbieżności, 0 gdy komplet zgodny.
"""
import argparse, hashlib, os, sys, zipfile


def sha(dane):
    return hashlib.sha256(dane).hexdigest()


def pliki_drzewa(katalog):
    out = {}
    for root, dirs, files in os.walk(katalog):
        dirs[:] = [d for d in dirs if d != "__pycache__"]
        for f in files:
            p = os.path.join(root, f)
            out[os.path.relpath(p, katalog).replace(os.sep, "/")] = open(p, "rb").read()
    return out


def sprawdz_zip(sciezka_zip, skill, drzewo):
    bledy = []
    with zipfile.ZipFile(sciezka_zip) as z:
        wpisy = {n[len(skill) + 1:]: z.read(n) for n in z.namelist()
                 if not n.endswith("/") and n.startswith(skill + "/")}
        obce = [n for n in z.namelist() if not n.startswith(skill + "/")]
    if obce:
        bledy.append(f"ZIP zawiera wpisy spoza katalogu {skill}/: {obce[:3]}")
    brak_w_zip = sorted(set(drzewo) - set(wpisy))
    brak_w_drzewie = sorted(set(wpisy) - set(drzewo))
    rozne = sorted(n for n in set(drzewo) & set(wpisy) if drzewo[n] != wpisy[n])
    for n in brak_w_zip:
        bledy.append(f"brak w ZIP: {n}")
    for n in brak_w_drzewie:
        bledy.append(f"brak w drzewie (nadmiarowy w ZIP): {n}")
    for n in rozne:
        bledy.append(f"różna treść: {n}")
    # sumy wewnątrz paczki
    if "CHECKSUMS.sha256" in wpisy:
        for linia in wpisy["CHECKSUMS.sha256"].decode("utf-8").splitlines():
            if "  " not in linia:
                continue
            suma, nazwa = linia.split("  ", 1)
            nazwa = nazwa.strip().lstrip("./")
            if nazwa not in wpisy:
                bledy.append(f"CHECKSUMS wskazuje plik spoza ZIP: {nazwa}")
            elif sha(wpisy[nazwa]) != suma.strip():
                bledy.append(f"suma kontrolna w ZIP nie zgadza się: {nazwa}")
    else:
        bledy.append("brak CHECKSUMS.sha256 w ZIP")
    return bledy


def selftest():
    import tempfile
    ok = 0
    with tempfile.TemporaryDirectory() as d:
        s = os.path.join(d, "skill-x"); os.makedirs(s)
        open(f"{s}/a.md", "w").write("A")
        open(f"{s}/CHECKSUMS.sha256", "w").write(f"{sha(b'A')}  ./a.md\n")
        zp = os.path.join(d, "skill-x.zip")
        with zipfile.ZipFile(zp, "w") as z:
            z.write(f"{s}/a.md", "skill-x/a.md")
            z.write(f"{s}/CHECKSUMS.sha256", "skill-x/CHECKSUMS.sha256")
        for opis, war in [("komplet zgodny", sprawdz_zip(zp, "skill-x", pliki_drzewa(s)) == [])]:
            print(("  OK   " if war else "  FAIL ") + opis); ok += war
        open(f"{s}/a.md", "w").write("A-zmienione")
        b = sprawdz_zip(zp, "skill-x", pliki_drzewa(s))
        for opis, war in [("zmiana treści po wydaniu wykryta", any("różna treść" in x for x in b))]:
            print(("  OK   " if war else "  FAIL ") + opis); ok += war
        open(f"{s}/nowy.md", "w").write("N")
        b = sprawdz_zip(zp, "skill-x", pliki_drzewa(s))
        for opis, war in [("nowy plik po wydaniu wykryty", any("brak w ZIP" in x for x in b))]:
            print(("  OK   " if war else "  FAIL ") + opis); ok += war
        with zipfile.ZipFile(zp, "w") as z:
            z.writestr("skill-x/a.md", "A")
            z.writestr("skill-x/CHECKSUMS.sha256", f"{sha(b'INNE')}  ./a.md\n")
        b = sprawdz_zip(zp, "skill-x", {"a.md": b"A", "CHECKSUMS.sha256": open(f"{s}/CHECKSUMS.sha256", 'rb').read()})
        for opis, war in [("zła suma wewnątrz ZIP wykryta", any("suma kontrolna" in x for x in b))]:
            print(("  OK   " if war else "  FAIL ") + opis); ok += war
    print(f"SELFTEST T33: {ok}/4")
    return 0 if ok == 4 else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
    ap.add_argument("--wydania", default="/mnt/user-data/outputs", help="katalog z paczkami .zip")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    if not os.path.isdir(a.wydania):
        print(f"T33: katalog wydań nie istnieje: {a.wydania} — pomijam")
        return 0
    skille = sorted(d for d in os.listdir(a.repo_root)
                    if os.path.isfile(os.path.join(a.repo_root, d, "SKILL.md")))
    zipy = {f[:-4] for f in os.listdir(a.wydania) if f.endswith(".zip")}
    fail = 0
    print("T33 — zgodność wydanych paczek z drzewem")
    for s in skille:
        if s not in zipy:
            continue
        b = sprawdz_zip(os.path.join(a.wydania, s + ".zip"), s, pliki_drzewa(os.path.join(a.repo_root, s)))
        print(f"  {'⛔' if b else '✅'} {s}: {len(b)} rozbieżności")
        for x in b[:10]:
            print(f"       {x}")
        fail += bool(b)
    osierocone = sorted(zipy - set(skille))
    for z in osierocone:
        print(f"  ⚠️ paczka bez skilla w drzewie: {z}.zip")
    bez_paczki = [s for s in skille if s not in zipy]
    print(f"WYNIK T33: {'❌ FAIL' if fail else '✅ PASS'} — skilli z paczką: {len(zipy & set(skille))}, "
          f"rozbieżnych: {fail}, bez paczki (pominięte): {len(bez_paczki)}")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
