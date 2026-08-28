#!/usr/bin/env python3
"""run_regression_suite.py — orkiestrator testów regresyjnych Lex-Machina.

Root repo jest jawnie propagowany do testów, które go obsługują. Dzięki temu
zestaw działa z rozpakowanego ZIP-a / checkoutu bez założenia `/mnt/skills/user`.
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent


def auto_root() -> Path:
    env = os.environ.get("LEX_MACHINA_ROOT") or os.environ.get("REPO_ROOT")
    if env:
        return Path(env).resolve()
    return SCRIPT_DIR.parents[1]


def run_script(name: str, args: list[str]) -> tuple[int | None, str]:
    path = SCRIPT_DIR / name
    if not path.exists():
        return None, f"SKRYPT NIEOBECNY: {name}"
    result = subprocess.run(
        [sys.executable, str(path)] + args,
        capture_output=True,
        text=True,
    )
    return result.returncode, result.stdout + result.stderr


def sekcja(tytul: str):
    print("── " + tytul + " " + "─" * max(3, 66 - len(tytul)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=None)
    args = ap.parse_args()

    root = Path(args.repo_root).resolve() if args.repo_root else auto_root()
    repo_args = ["--repo-root", str(root)]

    print("=" * 72)
    print("ZESTAW TESTÓW REGRESYJNYCH — Lex-Machina")
    print(f"ROOT: {root}")
    print("=" * 72)

    results = {}

    for key, label, script, sargs in [
        ("T1", "T1 KRYTYCZNY — Rejestracja modułów", "test_module_registration.py", repo_args),
        ("T2", "T2 WYSOKI — Zgodność liczników", "test_module_count.py", repo_args),
        ("T3", "T3 KRYTYCZNY/heurystyka — Spójność Dz.U.", "test_cross_map_dzu.py", repo_args),
    ]:
        sekcja(label)
        code, out = run_script(script, sargs)
        print(out)
        results[key] = code

    sekcja("T4 KRYTYCZNY — Integralność nagłówków")
    print("RĘCZNY: test_header_snapshot.py --snapshot/--verify wokół edycji .md.
")
    results["T4"] = "MANUAL"

    sekcja("T5 WYSOKI — Widmowe pokrycie")
    print("RĘCZNY: wymaga osądu treści, nie tylko obecności deklaracji.
")
    results["T5"] = "MANUAL"

    sekcja("T6/T7 KRYTYCZNY/ŚREDNI — Odwołania, duplikaty, portability")
    code, out = run_script("ci_check_shared.py", repo_args)
    print(out)
    results["T6_T7"] = code

    for key, label, script, sargs in [
        ("T8", "T8 WYSOKI — Zakres tytuł-vs-treść", "test_title_scope_match.py", repo_args),
        ("T9", "T9 WYSOKI — Przeniesienia do shared", "test_moved_to_shared.py", repo_args),
        ("T11", "T11 WYSOKI — Synchronizacja aktów", "check_sync_aktow.py", repo_args + ["--limit", "10"]),
        ("T12", "T12 ŚREDNI — Zgodność wersji/changelogu", "check_wersje_changelog.py", [str(root)]),
        ("T13", "T13 ŚREDNI — Długość modułów", "check_dlugosc_modulow.py", [str(root)]),
        ("T14", "T14 KRYTYCZNY — description ≤200", "check_description.py", [str(root)]),
        ("T17", "T17 KRYTYCZNY — kontrakt routera", "test_router_contract.py", repo_args),
        ("T18", "T18 KRYTYCZNY — spójność map pokrycia i routingu", "check_coverage_coherence.py", [str(root)]),
        ("T19", "T19 KRYTYCZNY — F-108: 52/52 inventory, 48/52 COV i metryki", "test_f108_consistency.py", []),
    ]:
        sekcja(label)
        code, out = run_script(script, sargs)
        print(out)
        results[key] = code

    print("=" * 72)
    print("PODSUMOWANIE")
    print("=" * 72)

    # T1 i T6/T7 są twardymi blockerami strukturalnymi na każdym etapie migracji.
    # T14 może być czerwony przejściowo, dopóki kolejne skille nie zostaną skrócone
    # do profilu uniwersalnego; nadal jest jawnie raportowany.
    critical_fail = False
    for key, code in results.items():
        if code == "MANUAL":
            status = "⏸ RĘCZNY"
        elif code == 0:
            status = "✅ PASS"
        elif code == 1:
            status = "⚠️ WARN/FAIL — patrz sekcja"
            if key in ("T1", "T6_T7", "T18", "T19"):
                critical_fail = True
        else:
            status = f"❌ BŁĄD (kod {code})"
            if key in ("T1", "T6_T7", "T19"):
                critical_fail = True
        print(f"  {key}: {status}")

    if critical_fail:
        print("
WYNIK KOŃCOWY: ❌ FAIL — aktywny blocker strukturalny.")
        return 1

    print("
WYNIK KOŃCOWY: ✅ PASS STRUKTURALNY — przejrzyj WARN i testy ręczne przed wydaniem.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
