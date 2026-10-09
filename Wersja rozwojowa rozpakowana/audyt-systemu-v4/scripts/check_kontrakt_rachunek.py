#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T39 — check_kontrakt_rachunek.py: regresja deterministycznego rachunku umowy (F-215).

(1) testy jednostkowe `analizator-umow-v1/scripts/test_kontrakt_rachunek.py` (offline);
(2) pomiar na korpusie `analizator-umow-v1/benchmark/posiane-wady/umowy/`:
    05 → rozbieżność kwota cyfrą/słownie (wada i3) i martwe odesłanie do §10 (wada i6) WYKRYTE;
    01 (kontrolna, zero wad) → zero rozbieżności słownie i zero martwych odesłań (brak fałszywych alarmów);
    04 → wszystkie pary cyfra/słownie zgodne.
Kod: 0 PASS, 1 FAIL, 2 brak narzędzia/korpusu.
"""
import argparse, importlib.util, os, subprocess, sys
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--repo-root"); a = ap.parse_args()
    root = Path(a.repo_root or Path(__file__).resolve().parents[2])
    tools = root / "analizator-umow-v1" / "scripts"
    kor = root / "analizator-umow-v1" / "benchmark" / "posiane-wady" / "umowy"
    if not (tools / "kontrakt_rachunek.py").is_file() or not (tools / "test_kontrakt_rachunek.py").is_file():
        print("❌ brak analizator-umow-v1/scripts/kontrakt_rachunek.py lub testu"); return 2
    env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
    r = subprocess.run([sys.executable, "-m", "unittest", "test_kontrakt_rachunek"], cwd=tools, env=env,
                       capture_output=True, text=True, timeout=120)
    print((r.stdout + r.stderr).strip()[-600:])
    ok = r.returncode == 0
    if not kor.is_dir():
        print("⚠️ brak korpusu benchmarkowego — pomiar (2) pominięty"); return 0 if ok else 1
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location("kr", tools / "kontrakt_rachunek.py")
    K = importlib.util.module_from_spec(spec); spec.loader.exec_module(K)
    t = {p.name[:2]: p.read_text(encoding="utf-8") for p in kor.glob("*.md")}
    kontrole = [
        ("05: i3 kwota słownie ≠ cyfrą wykryta", any(x["status"] == "ROZBIEZNOSC" and x["cyfra"] == "9.800,00" for x in K.slownie(t["05"]))),
        ("05: i6 martwe odesłanie do §10 wykryte", any("§10" in u["odeslanie"] for u in K.odeslania(t["05"])["ustalenia"])),
        ("01: kontrolna — zero rozbieżności słownie", all(x["status"] == "OK" for x in K.slownie(t["01"]))),
        ("01: kontrolna — zero martwych odesłań", K.odeslania(t["01"])["status"] == "OK"),
        ("04: pary cyfra/słownie zgodne (≥5)", (lambda s: len(s) >= 5 and all(x["status"] == "OK" for x in s))(K.slownie(t["04"]))),
    ]
    for opis, w in kontrole:
        print(f"{'PASS' if w else 'FAIL'} {opis}"); ok &= w
    print(f"WYNIK: {'PASS' if ok else 'FAIL'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
