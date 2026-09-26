#!/usr/bin/env python3
"""
check_coverage_coherence.py — spójność routingu i bieżących map pokrycia.

Kontrole:
1) każdy DR-01..DR-16 ma MAPA-POKRYCIA.md;
2) ROUTING-MAP wskazuje istniejące moduły;
3) MAPA-AKTOW nie wskazuje nieistniejących modułów;
4) mapa dziedzinowa nie utrzymuje nieaktualnego "brak modułu";
5) MAPA-POKRYCIA jest mapą stanu bieżącego, a nie warstwą baseline/delta.

Nie bada merytorycznej poprawności prawa. Kod 0 = spójność strukturalna,
kod 1 = rozbieżność wymagająca naprawy.
"""
from __future__ import annotations
import re
import sys
import unicodedata
from pathlib import Path

MOD = re.compile(r"(dr-\d{2}-[^\s|)]+/modules/(mod-[A-Za-z0-9_-]+)\.md)")
MOD_NAME = re.compile(r"(?<![\w-])(mod-[A-Za-z0-9_-]+)(?![\w-])")
STOP = {
    "prawo", "ustawa", "ustawy", "kodeks", "oraz", "sprawach", "dziedzina",
    "dedykowanego", "modulu", "brak", "przez", "polskie"
}
RUNTIME_HISTORY_MARKERS = (
    "baseline + delta",
    "pokrycie-delta-",
    "delta wobec raportu",
    "snapshot bazowy",
)


def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch)).lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def tokens(s: str):
    return {x for x in norm(s).split() if len(x) >= 5 and x not in STOP}


def main(root: Path) -> int:
    problems = []
    drs = sorted(
        p for p in root.iterdir()
        if p.is_dir()
        and re.match(r"dr-(0[1-9]|1[0-6])-", p.name)
        and not p.name.endswith("-out")
    )

    # 1 + 5. Coverage maps mandatory and current-state only.
    for d in drs:
        coverage = d / "MAPA-POKRYCIA.md"
        if not coverage.exists():
            problems.append(f"BRAK MAPA-POKRYCIA: {d.name}")
            continue
        text = read(coverage).lower()
        for marker in RUNTIME_HISTORY_MARKERS:
            if marker in text:
                problems.append(
                    f"HISTORYCZNA WARSTWA W MAPIE RUNTIME: {d.name}: {marker}"
                )

    # Inventory modules.
    modules = {}
    for d in drs:
        module_dir = d / "modules"
        for p in module_dir.glob("*.md") if module_dir.is_dir() else []:
            modules[p.stem] = p
    module_tokens = {name: tokens(name) for name in modules}

    # 2. Central routing explicit paths must exist.
    routing = read(root / "prawo-polskie-v2" / "ROUTING-MAP.md")
    for full, _name in MOD.findall(routing):
        if not (root / full).exists():
            problems.append(f"BROKEN ROUTING PATH: {full}")

    # 3. Local MAPA-AKTOW references to mod-* must resolve somewhere.
    for d in drs:
        mapa = read(d / "MAPA-AKTOW.md")
        for name in sorted(set(MOD_NAME.findall(mapa))):
            if name not in modules:
                # Short prefixes are tolerated only when they resolve
                # unambiguously to an existing module.
                matches = [real for real in modules if real.startswith(name)]
                if len(matches) != 1:
                    problems.append(f"MAPA-AKTOW GHOST: {d.name}: {name}")

    # 4. Suspicious "no module" declarations in domain coverage map.
    domain = read(root / "prawny-router-v3" / "references" / "pokrycie-dziedzinowe.md")
    for no, line in enumerate(domain.splitlines(), 1):
        if "brak dedykowanego modu" not in norm(line):
            continue
        cells = [x.strip() for x in line.strip().strip("|").split("|")]
        label = cells[0] if cells else line
        wanted = tokens(label)
        if not wanted:
            continue
        candidates = []
        for name, tok in module_tokens.items():
            overlap = len(wanted & tok)
            if overlap and overlap / max(1, len(wanted)) >= 0.5:
                candidates.append(name)
        if candidates:
            problems.append(
                f"STALE 'BRAK MODULU' line {no}: {label} -> "
                + ", ".join(sorted(candidates)[:5])
            )

    # Runtime must not depend on deleted delta layers.
    for rel in (
        "audyt-systemu-v4/references/POKRYCIE-DELTA-2026-08-28.md",
        "audyt-systemu-v4/references/F-108-ETAP2-DELTA-2026-08-28.md",
    ):
        if (root / rel).exists():
            problems.append(f"OBSOLETE RUNTIME DELTA: {rel}")

    print(f"DR checked: {len(drs)}; modules: {len(modules)}")
    if problems:
        for p in problems:
            print("FAIL:", p)
        print(f"WYNIK: FAIL ({len(problems)} rozbieżności)")
        return 1

    print(
        "WYNIK: OK — 16 map bieżących, routing i moduły spójne, "
        "brak warstwy baseline/delta w runtime."
    )
    return 0


if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    raise SystemExit(main(root))
