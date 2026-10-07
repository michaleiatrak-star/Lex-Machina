#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T42 — check_graf_przyczynowy.py (AUDYT-2026-10-01b).

Sprawdza MOD-GRAF-PRZYCZYNOWY w trzech miejscach naraz, bo jeden model liczbowy żyje w dwóch językach:
  A. selftest silnika `shared/tools/graf_przyczynowy.py` (szereg 0,729; LUB 0,999; csqn; cykle; flagi 361/362/441 KC, 2 KK);
  B. PARYTET: blok ENGINE-START…ENGINE-END z `chronologia-sprawy-v1/assets/widget-graf-przyczynowy.html`
     uruchomiony w Node na tych samych grafach musi dać te same wartości wsparcia (±1e-6) — inaczej widget
     pokazuje użytkownikowi inne liczby niż raport (klasa F-115: logika w dwóch kopiach);
  C. regresja błędu z MOD-LANCUCH-DOWODOWY (do shared 3.98: „3 niezależne dowody × 0,9 = 0,27”) — plik nie może
     zawierać tej formuły, a moduł grafu musi istnieć i być wskazany w MP13 i w chronologii (TRYB C).
Bez Node część B jest pomijana z ostrzeżeniem (WARN), nie FAIL. Kod: 0 PASS/WARN, 1 FAIL.
"""
import argparse
import importlib.util
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def auto_root() -> Path:
    return Path(__file__).resolve().parents[2]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root")
    a = ap.parse_args()
    root = Path(a.repo_root) if a.repo_root else auto_root()
    bledy, ostrz = [], []
    silnik = root / "shared/tools/graf_przyczynowy.py"
    widget = root / "chronologia-sprawy-v1/assets/widget-graf-przyczynowy.html"
    if not silnik.exists() or not widget.exists():
        print(f"⛔ brak pliku: {silnik if not silnik.exists() else widget}")
        print("T42 → WYNIK: FAIL"); return 1

    spec = importlib.util.spec_from_file_location("graf_przyczynowy", silnik)
    gp = importlib.util.module_from_spec(spec); spec.loader.exec_module(gp)
    print("A. selftest silnika:")
    if not gp._selftest():
        bledy.append("selftest silnika")

    grafy = [
        {"wezly": [{"id": "A", "p": 0.9}, {"id": "B", "p": 1}, {"id": "C", "p": 1}],
         "krawedzie": [{"od": "A", "do": "B", "typ": "WYWOLUJE", "p": 0.9}, {"od": "B", "do": "C", "typ": "WARUNKUJE", "p": 0.9}]},
        {"wezly": [{"id": "D1", "p": 0.9}, {"id": "D2", "pewnosc": "SPORNE"}, {"id": "T", "brama": "LUB", "pewnosc": "PEWNE"}, {"id": "X", "pewnosc": "WYDEDUKOWANE"}],
         "krawedzie": [{"od": "D1", "do": "T", "typ": "WYWOLUJE", "dowod": "BEZPOSREDNI"}, {"od": "D2", "do": "T", "typ": "WYWOLUJE", "dowod": "KORELACJA"},
                       {"od": "X", "do": "T", "typ": "OSLABIA", "dowod": "POSREDNI"}]},
        {"wezly": [{"id": "S1", "data": "2024-01-01", "p": 0.8}, {"id": "S2", "data": "2024-02-01", "p": 0.9}, {"id": "S3", "data": "2024-03-01", "p": 1}],
         "krawedzie": [{"od": "S1", "do": "S2", "typ": "WZMACNIA", "p": 0.5}, {"od": "S2", "do": "S1", "typ": "OSLABIA", "p": 0.5},
                       {"od": "S2", "do": "S3", "typ": "WYWOLUJE", "dowod": "POSREDNI", "csqn": "TAK"}, {"od": "S1", "do": "S3", "typ": "PRZERYWA", "p": 0.3}]},
        {"wezly": [{"id": "Z1", "pewnosc": "BEZSPORNE"}, {"id": "Z2", "pewnosc": "PEWNE"}, {"id": "Z3", "pewnosc": "SPORNE"}, {"id": "SZ", "pewnosc": "BEZSPORNE", "brama": "LUB"}],
         "krawedzie": [{"od": "Z1", "do": "SZ", "typ": "WYWOLUJE", "dowod": "BEZPOSREDNI", "csqn": "NIE"}, {"od": "Z2", "do": "SZ", "typ": "WZMACNIA", "dowod": "POSREDNI"},
                       {"od": "Z3", "do": "SZ", "typ": "WYWOLUJE", "dowod": "KORELACJA"}]},
    ]
    oczekiwane = []
    for g in grafy:
        akt, _, _ = gp._rozetnij_cykle(g)
        oczekiwane.append(gp.wsparcie(g, akt))

    print("B. parytet Python ↔ JS (widget):")
    html = widget.read_text(encoding="utf-8")
    m = re.search(r"// ENGINE-START.*?\n(.*?)// ENGINE-END", html, re.S)
    if not m:
        bledy.append("brak bloku ENGINE-START/ENGINE-END w widgecie")
    elif not shutil.which("node"):
        ostrz.append("Node niedostępny — parytet pominięty")
    else:
        js = m.group(1) + "\nconst G=" + json.dumps(grafy) + ";\nconsole.log(JSON.stringify(G.map(g=>{const r=rozetnij(g);return wsparcie(g,r.akt);})));\n"
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(js); sciezka = f.name
        wynik = subprocess.run(["node", sciezka], capture_output=True, text=True, timeout=60)
        if wynik.returncode != 0:
            bledy.append("silnik JS nie uruchamia się: " + wynik.stderr.strip()[:300])
        else:
            js_wyn = json.loads(wynik.stdout)
            for i, (py, jsw) in enumerate(zip(oczekiwane, js_wyn)):
                rozne = {k: (py[k], jsw.get(k)) for k in py if jsw.get(k) is None or abs(py[k] - jsw[k]) > 1e-6}
                print(("OK  " if not rozne else "FAIL") + f"  graf {i + 1}: {len(py)} węzłów" + (f" — rozbieżne {rozne}" if rozne else ""))
                if rozne:
                    bledy.append(f"parytet graf {i + 1}")

    print("C. regresja i podpięcia:")
    lan = (root / "shared/MOD-LANCUCH-DOWODOWY.md").read_text(encoding="utf-8")
    if re.search(r"×\s*0[.,]9\s*=\s*0[.,]27", lan):
        bledy.append("MOD-LANCUCH-DOWODOWY nadal zawiera błędną formułę „× 0,9 = 0,27”")
    for plik, wzorzec in [("shared/MOD-GRAF-PRZYCZYNOWY.md", "graf_przyczynowy.py"),
                          ("analizator-dowodow-v3/modules/MP13-synteza-faktyczna.md", "MOD-GRAF-PRZYCZYNOWY"),
                          ("chronologia-sprawy-v1/SKILL.md", "widget-graf-przyczynowy.html"),
                          ("shared/MOD-METODY-BADAWCZE.md", "MOD-GRAF-PRZYCZYNOWY")]:
        p = root / plik
        ok = p.exists() and wzorzec in p.read_text(encoding="utf-8")
        print(("OK  " if ok else "FAIL") + f"  {plik} → {wzorzec}")
        if not ok:
            bledy.append(f"{plik} nie wskazuje {wzorzec}")
    for o in ostrz:
        print("⚠️ " + o)
    for b in bledy:
        print("⛔ " + b)
    print("T42 → WYNIK: " + ("FAIL" if bledy else "WARN" if ostrz else "PASS"))
    return 1 if bledy else 0


if __name__ == "__main__":
    sys.exit(main())
