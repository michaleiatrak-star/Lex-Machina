#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
zbuduj_pakiet.py — buduje dist/lex-mcp.mjs (wszystkie serwery MCP w jednym pliku, zależności
wbudowane) i dist/NOTICE-THIRD-PARTY.txt (noty licencyjne wbudowanych pakietów).

PO CO (AUDYT-2026-09-27m): plugin uruchamia serwer z `${CLAUDE_PLUGIN_ROOT}`, a Claude Code
NIE instaluje zależności pluginów (brak `npm install`). Serwer musi być jednym plikiem.
Jedna kopia SDK/zod dla wszystkich serwerów: 629 KB zamiast 8 × 1,13 MB.

Wymaga: Node.js 18+, npm, sieć (npm ci + esbuild w przypiętej wersji).
Użycie:
    python zbuduj_pakiet.py            # przebuduj dist/
    python zbuduj_pakiet.py --sprawdz  # CI: zbuduj do katalogu tymczasowego i porównaj bajtowo
    python zbuduj_pakiet.py --mcpb     # dodatkowo rozszerzenie Claude Desktop: dist/lex-machina.mcpb
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

TU = Path(__file__).resolve().parent
ESBUILD = "esbuild@0.24.0"  # przypięte — inna wersja = inne bajty = fałszywy alarm --sprawdz
NAGLOWEK = "// Komponenty zewnętrzne (MIT i in.): noty licencyjne w NOTICE-THIRD-PARTY.txt obok tego pliku.\n"


def narzedzie(n):
    p = shutil.which(n) or (shutil.which(n + ".cmd") if os.name == "nt" else None)
    if not p:
        raise SystemExit(f"⛔ brak `{n}` — zainstaluj Node.js 18+")
    return p


def zbuduj(wyjscie: Path):
    npm, npx = narzedzie("npm"), narzedzie("npx")
    with tempfile.TemporaryDirectory() as tmp:
        stage = Path(tmp) / "stage"
        shutil.copytree(TU, stage, ignore=shutil.ignore_patterns("node_modules", "dist", "__pycache__"))
        # wspólne zależności z katalogu głównego (od 27s — jeden package.json/lock dla wszystkich serwerów)
        subprocess.run([npm, "ci", "--silent", "--no-audit", "--no-fund"], cwd=stage, check=True)
        meta = Path(tmp) / "meta.json"
        out = Path(tmp) / "lex-mcp.mjs"
        subprocess.run([npx, "-y", ESBUILD, "lex-mcp.js", "--bundle", "--platform=node", "--format=esm",
                        "--target=node18", "--minify", "--log-level=warning",
                        # playwright: opcjonalny (sn_captcha_auto, SN 1.4.0) — ładowany w runtime, nie wbudowywany
                        "--external:playwright",
                        f"--metafile={meta}", f"--outfile={out}"], cwd=stage, check=True)
        wyjscie.mkdir(parents=True, exist_ok=True)
        (wyjscie / "lex-mcp.mjs").write_bytes(NAGLOWEK.encode() + out.read_bytes())
        pakiety = sorted({m.group(1) for p in json.loads(meta.read_text())["inputs"]
                          if (m := re.search(r"node_modules/((?:@[^/]+/)?[^/]+)", p))})
        linie = ["NOTY LICENCYJNE KOMPONENTÓW WBUDOWANYCH W lex-mcp.mjs",
                 "Wygenerowane z metapliku esbuild przez zbuduj_pakiet.py. Kod własny Lex Machina: licencja repozytorium.", ""]
        for n in pakiety:
            d = stage / "node_modules" / n
            pj = json.loads((d / "package.json").read_text(encoding="utf-8"))
            lic = sorted(f for f in os.listdir(d) if re.match(r"(?i)^(licen[cs]e|copying)", f))
            linie += ["=" * 72, f"{n} {pj.get('version')} — {pj.get('license')}", "=" * 72,
                      (d / lic[0]).read_text(encoding="utf-8", errors="replace").strip() if lic
                      else f"(brak pliku LICENSE; licencja wg package.json: {pj.get('license')})", ""]
        (wyjscie / "NOTICE-THIRD-PARTY.txt").write_text("\n".join(linie) + "\n", encoding="utf-8")
        return pakiety


def spakuj_mcpb():
    """Rozszerzenie Claude Desktop: manifest + pakiet + noty + LICENSE repozytorium (GPL-3.0).
    Node.js jest dołączony do Claude Desktop (macOS, Windows) — użytkownik niczego nie instaluje."""
    npx = narzedzie("npx")
    licencja = next((p / "LICENSE" for p in (TU, *TU.parents) if (p / "LICENSE").is_file()), None)
    with tempfile.TemporaryDirectory() as tmp:
        k = Path(tmp) / "lex-machina"; (k / "server").mkdir(parents=True)
        shutil.copy2(TU / "mcpb-manifest.json", k / "manifest.json")
        for f in ("lex-mcp.mjs", "NOTICE-THIRD-PARTY.txt"):
            shutil.copy2(TU / "dist" / f, k / "server" / f)
        if licencja:
            shutil.copy2(licencja, k / "LICENSE")
        subprocess.run([npx, "-y", "@anthropic-ai/mcpb@2.1.2", "validate", str(k / "manifest.json")], check=True)
        subprocess.run([npx, "-y", "@anthropic-ai/mcpb@2.1.2", "pack", str(k), str(TU / "dist" / "lex-machina.mcpb")], check=True)
    print(f"✅ dist/lex-machina.mcpb — Claude Desktop: Ustawienia → Rozszerzenia → zainstaluj z pliku")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sprawdz", action="store_true", help="porównaj dist/ z nowym buildem (CI)")
    ap.add_argument("--mcpb", action="store_true", help="spakuj rozszerzenie Claude Desktop (dist/lex-machina.mcpb)")
    a = ap.parse_args()
    if not a.sprawdz:
        p = zbuduj(TU / "dist")
        print(f"✅ dist/lex-mcp.mjs ({(TU / 'dist' / 'lex-mcp.mjs').stat().st_size} B), {len(p)} pakietów w NOTICE")
        if a.mcpb:
            spakuj_mcpb()
        return 0
    with tempfile.TemporaryDirectory() as tmp:
        zbuduj(Path(tmp))
        rozne = [f for f in ("lex-mcp.mjs", "NOTICE-THIRD-PARTY.txt")
                 if not (TU / "dist" / f).is_file() or (TU / "dist" / f).read_bytes() != (Path(tmp) / f).read_bytes()]
    if rozne:
        print(f"⛔ dist/ nieaktualny względem źródeł: {rozne} — uruchom `python zbuduj_pakiet.py` i zacommituj.")
        return 1
    print("✅ dist/ zgodny bajtowo ze źródłami")
    return 0


if __name__ == "__main__":
    sys.exit(main())
