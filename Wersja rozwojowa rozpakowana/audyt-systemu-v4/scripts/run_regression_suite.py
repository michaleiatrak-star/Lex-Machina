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


# ---------------------------------------------------------------------------
# PREFLIGHT — kompletność korzenia (flaga O-5, 2026-09-10b)
#
# PO CO ISTNIEJE
#   Na hoście rozdzielającym skille na kilka punktów montowania (np. część
#   w `plugins/`, część w `user/`) testy T3 i T11 — oba KRYTYCZNE — kończyły się
#   `KeyError: 'prawo-polskie-v2'`. Komunikat był NIEODRÓŻNIALNY od realnego
#   braku skilla w repozytorium, więc czytający dostawał FAIL wyglądający jak
#   usterka systemu, a będący usterką środowiska. Zmierzone 2026-09-09.
#
# ⛔ Preflight NIE zastępuje testów i niczego nie naprawia. Zatrzymuje przebieg
#   ZANIM zielone/czerwone wyniki zaczną wprowadzać w błąd, i nazywa przyczynę.
# ---------------------------------------------------------------------------
SKILLE_OCZEKIWANE = 32
SKILLE_KRYTYCZNE = ("shared", "prawny-router-v3", "prawo-polskie-v2", "audyt-systemu-v4")


def preflight(root: Path) -> bool:
    """Zwraca True, gdy korzeń nadaje się do przebiegu."""
    obecne = sorted(d.name for d in root.iterdir()
                    if d.is_dir() and (d / "SKILL.md").is_file())
    brakujace = [s for s in SKILLE_KRYTYCZNE if s not in obecne]

    print(f"PREFLIGHT: skilli w korzeniu: {len(obecne)} (oczekiwane: {SKILLE_OCZEKIWANE})")
    if not brakujace and len(obecne) >= SKILLE_OCZEKIWANE:
        return True

    # Szukamy skilli krytycznych poza tym korzeniem — to rozstrzyga,
    # czy mamy do czynienia z brakiem, czy z rozdzieleniem drzewa.
    gdzie_indziej = {}
    for kandydat in (root.parent, *[p for p in root.parent.iterdir() if p.is_dir()]):
        for s in brakujace:
            if (kandydat / s / "SKILL.md").is_file():
                gdzie_indziej.setdefault(s, str(kandydat / s))

    print("=" * 72)
    if gdzie_indziej:
        print("⛔ KORZEŃ NIEKOMPLETNY — SKILLE SĄ, ALE POZA TYM KATALOGIEM.")
        print("   To NIE jest usterka systemu. To rozdzielone drzewo.")
        for s, gdzie in sorted(gdzie_indziej.items()):
            print(f"     • {s} → {gdzie}")
        print("\n   Zestaw zakłada JEDEN korzeń. Scal drzewo i uruchom ponownie:")
        print("     mkdir /tmp/lex && cp -r <korzeń-1>/* <korzeń-2>/* /tmp/lex/")
        print("     python3 run_regression_suite.py --repo-root /tmp/lex")
    else:
        print("⛔ KORZEŃ NIEKOMPLETNY — SKILLI NIE MA NIGDZIE W POBLIŻU.")
        print("   To wygląda na realny brak, nie na rozdzielone drzewo.")
        for s in brakujace:
            print(f"     • brak: {s}")
        if len(obecne) < SKILLE_OCZEKIWANE:
            print(f"   Ponadto: {len(obecne)} < {SKILLE_OCZEKIWANE} skilli.")
    print("=" * 72)
    print("PRZEBIEG PRZERWANY — wyniki na niekompletnym korzeniu wprowadzałyby w błąd.")
    return False


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

    if not preflight(root):
        return 2

    results = {}

    for key, label, script, sargs in [
        ("T23", "T23 — Pokrycie orkiestratora (O-4)", "test_pokrycie_orkiestratora.py", repo_args),
        ("T1", "T1 KRYTYCZNY — Rejestracja modułów", "test_module_registration.py", repo_args),
        ("T2", "T2 WYSOKI — Zgodność liczników", "test_module_count.py", repo_args),
        ("T3", "T3 KRYTYCZNY/heurystyka — Spójność Dz.U.", "test_cross_map_dzu.py", repo_args),
    ]:
        sekcja(label)
        code, out = run_script(script, sargs)
        print(out)
        results[key] = code

    sekcja("T4 KRYTYCZNY — Integralność nagłówków")
    print("RĘCZNY: test_header_snapshot.py --snapshot/--verify wokół edycji .md.\n")
    results["T4"] = "MANUAL"

    sekcja("T5 WYSOKI — Widmowe pokrycie")
    print("RĘCZNY: wymaga osądu treści, nie tylko obecności deklaracji.\n")
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
        ("T19", "T19 KRYTYCZNY — F-108: 52/52 inventory, 52/52 COV, 0 FULL i metryki", "test_f108_consistency.py", []),
        ("T19b", "T19b — F-108/46: stawki, rejestr 52/52, propagacja, mutacje", "test_f108_trade.py", repo_args),
        ("T22", "T22 KRYTYCZNY — samo-rejestracja frontmatteru", "check_frontmatter_rejestracja.py", [str(root)]),
        # F-189 (2026-09-16): T28 i T29 są offline i deterministyczne. SKRYPTY-RECZNE
        # deklarował T28 jako „wchodzi do orkiestratora", ale nie był wołany — 20 FAIL
        # nie zmieniało wyniku pełnego przebiegu.
        ("T28", "T28 KRYTYCZNY — wartości i cytaty (W1/W2 FAIL, W3 WARN)", "check_wartosci_prawne.py", ["--katalog", str(root), "--tylko-fail"]),
        ("T29", "T29 WYSOKI — integralność podziału TABELE-OPLAT", "check_oplaty_mapa.py", ["--katalog", str(root)]),
        ("MOCK", "MOCK — self-test sync_dzu_eli wobec lokalnego mock-ELI", "mock_eli_server_test.py", []),
    ]:
        sekcja(label)
        code, out = run_script(script, sargs)
        print(out)
        results[key] = code

    print("=" * 72)
    print("PODSUMOWANIE")
    print("=" * 72)

    # T1 i T6/T7 są twardymi blockerami strukturalnymi na każdym etapie migracji.
    # T22 dołączył do nich 2026-09-01 (F-147): rozjazd rejestr-vs-dysk potrafi
    # wyciszyć inny test KRYTYCZNY, więc nie może być zwykłym ostrzeżeniem.
    # T14 może być czerwony przejściowo, dopóki kolejne skille nie zostaną skrócone
    # do profilu uniwersalnego; nadal jest jawnie raportowany.
    # T28 i T29 dołączyły 2026-09-16 (F-189): W1 to nawrót błędu JUŻ naprawionego
    # po odczycie treści — dokładnie ta klasa, którą regresja ma blokować.
    BLOCKERY = ("T1", "T6_T7", "T18", "T19", "T19b", "T22", "T28", "T29")
    critical_fail = False
    for key, code in results.items():
        if code == "MANUAL":
            status = "⏸ RĘCZNY"
        elif code == 0:
            status = "✅ PASS"
        elif code == 1:
            status = "⚠️ WARN/FAIL — patrz sekcja"
            if key in BLOCKERY:
                critical_fail = True
        else:
            status = f"❌ BŁĄD (kod {code})"
            if key in BLOCKERY:
                critical_fail = True
        print(f"  {key}: {status}")

    if critical_fail:
        print("\nWYNIK KOŃCOWY: ❌ FAIL — aktywny blocker strukturalny.")
        return 1

    print("\nWYNIK KOŃCOWY: ✅ PASS STRUKTURALNY — przejrzyj WARN i testy ręczne przed wydaniem.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
