#!/usr/bin/env python3
"""
run_regression_suite.py — Orkiestrator PEŁNEGO zestawu testów regresyjnych.

Uruchamia WSZYSTKIE testy opisane w REGRESSION-TEST-PLAN.md (T1-T8) w
kolejności priorytetowej i zbiera wyniki w JEDEN, czytelny raport.

Zgodnie z REGRESSION-TEST-PLAN.md sekcja 4 (priorytetyzacja):
  ⭐⭐⭐ KRYTYCZNE (T1, T3, T4*, T6) — blokują uznanie sesji za zakończoną
  ⭐⭐ WYSOKIE (T2, T5*, T8) — ostrzeżenie, wymaga przeglądu przed dostarczeniem
  ⭐ ŚREDNI (T7) — okresowe, nie blokuje

  * T4 wymaga PARY migawek (przed/po edycją) — NIE jest uruchamiany
    automatycznie przez ten orkiestrator (brak dostępu do stanu "przed"
    bez wcześniejszego, jawnego wywołania --snapshot) — pomijany tutaj,
    z przypomnieniem w raporcie.
  * T5 (widmowe pokrycie / ghost coverage) NIE MA jeszcze zautomatyzowanego
    skryptu — wymaga osądu LLM/człowieka, patrz REGRESSION-TEST-PLAN.md
    sekcja 3. Pomijany tutaj, z przypomnieniem w raporcie.

Użycie:
    python3 run_regression_suite.py [--repo-root /mnt/skills/user]

Kod wyjścia:
    0 — wszystkie testy KRYTYCZNE (T1, T3*, T6) zaliczone (T3 traktowany
        jako WARN nie FAIL, zgodnie z jego naturą heurystyczną)
    1 — co najmniej jeden test KRYTYCZNY (T1, T6) zwrócił FAIL
"""

import argparse
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def run_script(name: str, args: list) -> tuple:
    """Uruchamia skrypt, zwraca (kod_wyjścia, stdout)."""
    path = SCRIPT_DIR / name
    if not path.exists():
        return None, f"SKRYPT NIEOBECNY: {name}"
    result = subprocess.run(
        [sys.executable, str(path)] + args,
        capture_output=True, text=True
    )
    return result.returncode, result.stdout


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    args = ap.parse_args()

    repo_args = ["--repo-root", args.repo_root]

    print("=" * 70)
    print("ZESTAW TESTÓW REGRESYJNYCH — prawo-polskie-v2 i skille powiązane")
    print("=" * 70)
    print()

    results = {}

    # --- T1: KRYTYCZNY ---
    print("── T1 (⭐⭐⭐ KRYTYCZNY) — Rejestracja modułów " + "─" * 20)
    code, out = run_script("test_module_registration.py", repo_args)
    print(out)
    results["T1"] = code

    # --- T2: WYSOKI ---
    print("── T2 (⭐⭐ WYSOKI) — Zgodność liczników " + "─" * 26)
    code, out = run_script("test_module_count.py", repo_args)
    print(out)
    results["T2"] = code

    # --- T3: KRYTYCZNY (heurystyka, traktowany jako WARN) ---
    print("── T3 (⭐⭐⭐ KRYTYCZNY, heurystyka → WARN) — Spójność Dz.U. między mapami " + "─" * 5)
    code, out = run_script("test_cross_map_dzu.py", repo_args)
    print(out)
    results["T3"] = code

    # --- T4: KRYTYCZNY, ALE wymaga migawek — pomijany tutaj ---
    print("── T4 (⭐⭐⭐ KRYTYCZNY) — Integralność nagłówków " + "─" * 18)
    print("  POMINIĘTY w automatycznym przebiegu — wymaga PARY migawek")
    print("  (--snapshot PRZED edycją, --verify PO edycji), użycie RĘCZNE")
    print("  przy KAŻDEJ edycji str_replace na pliku .md. Patrz")
    print("  test_header_snapshot.py --help.")
    results["T4"] = "MANUAL"
    print()

    # --- T5: WYSOKI, brak automatyzacji — pomijany ---
    print("── T5 (⭐⭐ WYSOKI) — Widmowe pokrycie (ghost coverage) " + "─" * 11)
    print("  BRAK zautomatyzowanego skryptu — WYMAGA osądu LLM/człowieka")
    print("  (sprawdź, czy wpis '✅ OK' w mapie WSKAZUJE na treść, która")
    print("  FAKTYCZNIE istnieje w module, nie tylko deklaruje istnienie).")
    results["T5"] = "MANUAL"
    print()

    # --- T6/T7: istniejący ci_check_shared.py ---
    print("── T6/T7 (⭐⭐⭐/⭐) — Zerwane odwołania / Duplikaty bajtowe " + "─" * 8)
    code, out = run_script("ci_check_shared.py", [])
    print(out if out else "  (ci_check_shared.py nie zwrócił wyjścia tekstowego)")
    results["T6_T7"] = code

    # --- T8: WYSOKI (heurystyka, traktowany jako WARN) ---
    print("── T8 (⭐⭐ WYSOKI, heurystyka → WARN) — Zakres tytuł-vs-treść " + "─" * 8)
    code, out = run_script("test_title_scope_match.py", repo_args)
    print(out)
    results["T8"] = code

    # --- T9: WYSOKI (heurystyka celowana, traktowany jako WARN) ---
    print("── T9 (⭐⭐ WYSOKI, heurystyka celowana → WARN) — Weryfikacja przeniesień do shared/ " + "─" * 3)
    code, out = run_script("test_moved_to_shared.py", repo_args)
    print(out)
    results["T9"] = code

    # T10 (monitorowanie plików Nexto/Virtualo, flaga F-12) USUNIĘTE
    # 2026-07-24d na wyraźne polecenie użytkownika — cały mechanizm
    # (rejestr + skrypt check_nexto_free_files.py) skasowany, patrz
    # AUDIT-JOURNAL.md, wpis AUDYT-2026-07-24d.

    # --- PODSUMOWANIE ---
    print("=" * 70)
    print("PODSUMOWANIE ZBIORCZE")
    print("=" * 70)

    critical_fail = False
    for key, code in results.items():
        if code == "MANUAL":
            status = "⏸️  RĘCZNY (nie uruchomiony automatycznie)"
        elif code == 0:
            status = "✅ PASS"
        elif code == 1:
            status = "⚠️  WARN/FAIL (patrz szczegóły wyżej)"
            if key in ("T1", "T6_T7"):
                critical_fail = True
        else:
            status = f"❌ BŁĄD (kod {code})"
            if key in ("T1", "T6_T7"):
                critical_fail = True
        print(f"  {key}: {status}")

    print()
    if critical_fail:
        print("WYNIK KOŃCOWY: ❌ FAIL — co najmniej jeden test KRYTYCZNY (T1/T6/T7) "
              "nie przeszedł. NAPRAW przed dostarczeniem plików użytkownikowi.")
    else:
        print("WYNIK KOŃCOWY: ✅ PASS (z zastrzeżeniami WARN, jeśli wystąpiły) — "
              "testy krytyczne przeszły. Sprawdź WARN (T2/T3/T8/T9) manualnie "
              "przed finalnym dostarczeniem, oraz pamiętaj o T4/T5 RĘCZNYCH.")

    sys.exit(1 if critical_fail else 0)


if __name__ == "__main__":
    main()
