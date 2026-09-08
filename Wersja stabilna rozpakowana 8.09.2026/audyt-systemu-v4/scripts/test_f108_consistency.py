#!/usr/bin/env python3
"""Regression guard for F-108 coverage/currentness declarations.

This is a static consistency test. It does not replace live ELI/EUR-Lex checks.
"""

from pathlib import Path
import re
import sys

AUDIT = Path(__file__).resolve().parents[1]
DEV = AUDIT.parent
F108 = AUDIT / "references" / "F-108-lista-MS-egzamin-2026.md"
MAP = AUDIT / "references" / "mapa_dzu_2026-08-28.md"
ROUTING = DEV / "prawo-polskie-v2" / "ROUTING-MAP.md"

EXPECTED_BELOW_COV = set()

def fail(msg: str) -> None:
    print(f"FAIL: {msg}")
    raise SystemExit(1)

f108 = F108.read_text(encoding="utf-8")
rows = {}
for line in f108.splitlines():
    m = re.match(r"^\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(.+)\|$", line)
    if m:
        ident = int(m.group(1))
        if 1 <= ident <= 52:
            rows[ident] = line

if set(rows) != set(range(1, 53)):
    fail(f"F-108 IDs are not exactly 1..52: got {sorted(rows)}")

actual_below = {i for i, line in rows.items() if "COV" not in line}
if actual_below != EXPECTED_BELOW_COV:
    fail(f"below-COV set changed: expected {EXPECTED_BELOW_COV}, got {actual_below}")

if "52/52 aktów ma realny routing/moduł i 52/52 ma potwierdzony status B+/COV" not in f108:
    fail("F-108 summary no longer states 52/52 inventory and 52/52 COV")

required_modules = [
    DEV / "dr-03-prawo-karne-wykroczenia-egzekucja" / "modules" / "mod-KW-current-state-COV.md",
    DEV / "dr-03-prawo-karne-wykroczenia-egzekucja" / "modules" / "mod-KW-art65-69-instytucje.md",
    DEV / "dr-04-prawo-pracy-zus-swiadczenia" / "modules" / "mod-SUS-current-state-COV.md",
    DEV / "dr-04-prawo-pracy-zus-swiadczenia" / "modules" / "mod-ustawa-zasilkowa-current-state-COV.md",
    DEV / "dr-04-prawo-pracy-zus-swiadczenia" / "modules" / "mod-zwolnienia-grupowe-current-state-COV.md",
]
for module in required_modules:
    if not module.exists():
        fail(f"required F-108 COV module missing: {module.relative_to(DEV)}")

routing = ROUTING.read_text(encoding="utf-8")
if "Dz.U. 2025 poz. 1071 ze zm." in routing:
    fail("stale KC 2025/1071 remains in active ROUTING-MAP")
if "| Ustawa Prawo o prokuraturze | Dz.U. 2024 poz. 390" in routing:
    fail("stale Prawo o prokuraturze 2024/390 remains in active ROUTING-MAP")

for needle in [
    "mod-KW-current-state-COV.md",
    "mod-KW-art65-69-instytucje.md",
    "mod-SUS-current-state-COV.md",
    "mod-ustawa-zasilkowa-current-state-COV.md",
    "mod-zwolnienia-grupowe-current-state-COV.md",
]:
    if needle not in routing:
        fail(f"F-108 current-state module not registered in ROUTING-MAP: {needle}")

dzu = MAP.read_text(encoding="utf-8")
required = {
    "| 2026 | 810 | Prawo o prokuraturze |",
    "| 2026 | 854 | Ustawa o świadczeniach pieniężnych",
    "| 2026 | 316 | Ustawa z 23.01.2026 r. o zmianie ustawy o fundacjach",
    "| 2024 | 1796 | Ustawa o prawach konsumenta |",
    "| 2023 | 166 | Ustawa o fundacjach | TJ | OK |",
    "| 2020 | 2261 | Prawo o stowarzyszeniach | TJ | OK |",
}
for needle in required:
    if needle not in dzu:
        fail(f"missing corrected Dz.U. row: {needle}")

forbidden = {
    "| 2025 | 1338 | Prawo o stowarzyszeniach |",
    "| 2023 | 549 | Ustawa o fundacjach",
    "| 2024 | 1069 | Ustawa o spółdzielniach mieszkaniowych",
    "| 2026 | 346 | Prawo restrukturyzacyjne",
}
for needle in forbidden:
    if needle in dzu:
        fail(f"known false Dz.U. identity returned: {needle}")

print("PASS: F-108 inventory=52/52, COV=52/52, FULL=0/52, current-state modules and known currentness corrections preserved.")
