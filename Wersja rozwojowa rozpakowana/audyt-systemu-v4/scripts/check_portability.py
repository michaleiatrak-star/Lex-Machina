#!/usr/bin/env python3
"""
check_portability.py — T15: bramka przenośności Claude + ChatGPT.

Cel nie jest stylistyczny. Test blokuje wyłącznie wzorce, które wiążą CORE
skilla z konkretnym runtime i mogą uniemożliwić wykonanie na drugim hoście.
Nie zgłasza zwykłych nazw produktów w historii/changelogu ani instrukcji,
które oba modele potrafią zrozumieć i wykonać bez specjalnego API.

Domyślnie skanuje aktywne pliki .md/.py/.sh/.yaml/.yml/.json/.js/.ts w repo.
Katalogi historyczne `archive` oraz .git są pomijane.

Klasy blokujące:
  - /mnt/skills/user      — twarda ścieżka runtime
  - /mnt/user-data        — twarda ścieżka runtime
  - /home/claude          — vendor-specific filesystem
  - server_tool_use       — surowy format Claude API
  - web_search_tool_result / web_fetch_tool_result — surowy format Claude API

Klasy ostrzegawcze:
  - present_files, show_widget, sendPrompt, web_search, web_fetch
    Są raportowane, ale nie blokują automatycznie, bo część wystąpień może być
    historyczna albo opisywać opcjonalny renderer. Decyzja zależy od kontekstu.

Użycie:
    python3 check_portability.py [--repo-root PATH] [--skill NAME]

Kod wyjścia:
    0 — brak aktywnych blockerów
    1 — znaleziono blocker portability
    2 — błąd użycia/ścieżki
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

BLOCKERS = {
    "/mnt/skills/user": re.compile(r"/mnt/skills/user"),
    "/mnt/user-data": re.compile(r"/mnt/user-data"),
    "/home/claude": re.compile(r"/home/claude"),
    "server_tool_use": re.compile(r"\bserver_tool_use\b"),
    "web_search_tool_result": re.compile(r"\bweb_search_tool_result\b"),
    "web_fetch_tool_result": re.compile(r"\bweb_fetch_tool_result\b"),
}

WARNINGS = {
    "present_files": re.compile(r"\bpresent_files\b"),
    "show_widget": re.compile(r"\bshow_widget\b"),
    "sendPrompt": re.compile(r"\bsendPrompt\b"),
    "web_search": re.compile(r"\bweb_search\b"),
    "web_fetch": re.compile(r"\bweb_fetch\b"),
}

TEXT_SUFFIXES = {".md", ".py", ".sh", ".yaml", ".yml", ".json", ".js", ".ts", ".txt"}
SKIP_DIRS = {".git", "archive", "__pycache__", "node_modules"}

# Ten skrypt musi móc nazwać wykrywane wzorce bez raportowania samego siebie.
SELF_NAME = "check_portability.py"


def auto_root() -> Path:
    env = os.environ.get("LEX_MACHINA_ROOT") or os.environ.get("REPO_ROOT")
    if env:
        return Path(env).resolve()
    return Path(__file__).resolve().parents[2]


def iter_files(root: Path):
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        if path.name == SELF_NAME:
            continue
        yield path


def scan(path: Path, patterns):
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []
    hits = []
    for name, rx in patterns.items():
        for m in rx.finditer(text):
            line = text.count("\n", 0, m.start()) + 1
            hits.append((name, line))
    return hits


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=None)
    ap.add_argument("--skill", default=None,
                    help="Skanuj tylko jeden katalog skilla względem repo-root")
    args = ap.parse_args()

    repo = Path(args.repo_root).resolve() if args.repo_root else auto_root()
    target = repo / args.skill if args.skill else repo
    if not target.is_dir():
        print(f"BŁĄD: katalog nie istnieje: {target}")
        return 2

    blockers = []
    warnings = []
    scanned = 0

    for path in iter_files(target):
        scanned += 1
        rel = path.relative_to(repo) if path.is_relative_to(repo) else path
        for name, line in scan(path, BLOCKERS):
            blockers.append((str(rel), line, name))
        for name, line in scan(path, WARNINGS):
            warnings.append((str(rel), line, name))

    print("=" * 76)
    print("T15 — PORTABILITY GATE Claude + ChatGPT")
    print(f"Root: {target} | plików tekstowych: {scanned}")
    print("=" * 76)

    if blockers:
        print(f"\n⛔ BLOCKERY: {len(blockers)}")
        for rel, line, name in blockers:
            print(f"  {rel}:{line} — {name}")
    else:
        print("\n✅ Brak twardych zależności runtime w aktywnym zakresie.")

    if warnings:
        print(f"\n⚠️ DO PRZEGLĄDU KONTEKSTOWEGO: {len(warnings)}")
        for rel, line, name in warnings[:100]:
            print(f"  {rel}:{line} — {name}")
        if len(warnings) > 100:
            print(f"  ... i {len(warnings) - 100} dalszych")

    print("\nWYNIK T15: " + ("FAIL" if blockers else "PASS"))
    return 1 if blockers else 0


if __name__ == "__main__":
    sys.exit(main())
