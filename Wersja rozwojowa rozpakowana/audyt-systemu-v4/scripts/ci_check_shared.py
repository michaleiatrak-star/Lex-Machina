#!/usr/bin/env python3
"""
ci_check_shared.py — deterministyczny CI dla silnika skilli prawnych.

Kontrole:
  1. zerwane odwołania do plików .md — BŁĄD,
  2. duplikaty bajtowe — OSTRZEŻENIE,
  3. portability warnings — nazwy/ścieżki runtime wymagające przeglądu.

Skrypt nie zakłada konkretnego hosta ani katalogu instalacyjnego. Root repo można
podać przez --repo-root, LEX_MACHINA_ROOT/REPO_ROOT albo wykryć względem skryptu.
"""

import argparse
import hashlib
import os
import re
import sys
from pathlib import Path

# Obsługujemy stary zapis absolutny i nowe, zwykłe ścieżki względne po `view`.
VIEW_ABS_PATTERN = re.compile(r"view\s+(/\S+?\.md)\b")
VIEW_REL_PATTERN = re.compile(r"view\s+((?:shared|[a-z0-9][\w-]*)/\S+?\.md)\b", re.I)

FRONTMATTER_PATH_PATTERN = re.compile(
    r"^\s*-\s*([a-zA-Z0-9_\-./]+\.md)\s*$", re.MULTILINE
)

DUPLICATE_CHECK_IGNORE = set()
PLACEHOLDER_STEMS = {"x", "nazwa", "akt", "nazwa-pliku", "plik"}
MIN_DUPLICATE_SIZE = 200

PORTABILITY_PATTERNS = {
    "/mnt/skills/user": re.compile(r"/mnt/skills/user"),
    "/mnt/user-data": re.compile(r"/mnt/user-data"),
    "/home/claude": re.compile(r"/home/claude"),
    "server_tool_use": re.compile(r"\bserver_tool_use\b"),
    "web_search_tool_result": re.compile(r"\bweb_search_tool_result\b"),
    "web_fetch_tool_result": re.compile(r"\bweb_fetch_tool_result\b"),
    "present_files": re.compile(r"\bpresent_files\b"),
    "show_widget": re.compile(r"\bshow_widget\b"),
}


def auto_root() -> Path:
    env = os.environ.get("LEX_MACHINA_ROOT") or os.environ.get("REPO_ROOT")
    if env:
        return Path(env).resolve()
    return Path(__file__).resolve().parents[2]


def is_placeholder_ref(ref_path: Path) -> bool:
    raw = str(ref_path)
    return (
        "[" in raw or "]" in raw or "*" in raw or "?" in raw
        or ref_path.stem.lower() in PLACEHOLDER_STEMS
    )


def is_external_skill_ref(ref: str, skill_index) -> bool:
    """Odwołanie do opcjonalnego skilla spoza danego checkoutu nie jest zerwanym plikiem lokalnym."""
    first = Path(ref).parts[0] if Path(ref).parts else ""
    return bool(re.fullmatch(r"[a-z0-9][\w-]*-v\d+(?:-min\d+)?", first, re.I)) and first not in skill_index


def find_md_files(repo_root: Path):
    return sorted(
        p for p in repo_root.rglob("*.md")
        if ".git" not in p.parts and "archive" not in p.parts
    )


def build_skill_index(repo_root: Path):
    """Mapuj semantyczną nazwę skilla na katalog pakietu o nazwie technicznej."""
    index = {}
    for skill_md in repo_root.glob("*/SKILL.md"):
        try:
            head = skill_md.read_text(encoding="utf-8", errors="strict")[:4000]
        except OSError:
            continue
        match = re.search(r"^name:\s*['\"]?([^'\"\n]+)", head, re.MULTILINE)
        if match:
            index[match.group(1).strip()] = skill_md.parent
    return index


def owning_skill_dir(source_file: Path, repo_root: Path):
    current = source_file.parent
    while current != repo_root and repo_root in current.parents:
        if (current / "SKILL.md").exists():
            return current
        current = current.parent
    return None


def resolve_relative_ref(ref: str, source_file: Path, repo_root: Path, skill_index):
    ref_path = Path(ref)
    candidates = [source_file.parent / ref_path, repo_root / ref_path]
    owner = owning_skill_dir(source_file, repo_root)
    if owner:
        candidates.append(owner / ref_path)
    parts = ref_path.parts
    if parts and parts[0] in skill_index:
        candidates.append(skill_index[parts[0]].joinpath(*parts[1:]))
    return candidates


def resolve_legacy_abs(ref: str, repo_root: Path, skill_index):
    prefix = "/mnt/skills/user/"
    if ref.startswith(prefix):
        rel = Path(ref[len(prefix):])
        if rel.parts and rel.parts[0] in skill_index:
            return skill_index[rel.parts[0]].joinpath(*rel.parts[1:])
        return repo_root / rel
    return Path(ref)


def check_broken_links(md_files, repo_root: Path):
    errors = []
    skill_index = build_skill_index(repo_root)
    for f in md_files:
        if f.name == "AUDIT-JOURNAL.md":
            continue
        try:
            text = f.read_text(encoding="utf-8", errors="strict")
        except Exception as e:
            errors.append((f, None, f"BŁĄD ODCZYTU: {e}"))
            continue

        for m in VIEW_ABS_PATTERN.finditer(text):
            raw = m.group(1)
            ref_path = Path(raw)
            if is_placeholder_ref(ref_path):
                continue
            resolved = resolve_legacy_abs(raw, repo_root, skill_index)
            if not resolved.exists():
                errors.append((f, raw, "view wskazuje na nieistniejący plik"))

        for m in VIEW_REL_PATTERN.finditer(text):
            ref = m.group(1)
            if is_placeholder_ref(Path(ref)):
                continue
            if is_external_skill_ref(ref, skill_index):
                continue
            if not any(c.exists() for c in resolve_relative_ref(ref, f, repo_root, skill_index)):
                errors.append((f, ref, "względne view nie rozwiązuje się do istniejącego pliku"))

        if text.startswith("---"):
            end = text.find("\n---", 3)
            frontmatter = text[:end] if end != -1 else ""
            for m in FRONTMATTER_PATH_PATTERN.finditer(frontmatter):
                ref = m.group(1)
                if is_placeholder_ref(Path(ref)):
                    continue
                if ref.startswith("/mnt/"):
                    resolved = resolve_legacy_abs(ref, repo_root, skill_index)
                    if not resolved.exists():
                        errors.append((f, ref, "frontmatter wskazuje na nieistniejący plik"))
                elif not any(c.exists() for c in resolve_relative_ref(ref, f, repo_root, skill_index)):
                    errors.append((f, ref, "frontmatter (ścieżka względna) nie rozwiązuje się do pliku"))
    return errors


def check_duplicates(md_files):
    by_hash = {}
    for f in md_files:
        if f in DUPLICATE_CHECK_IGNORE:
            continue
        try:
            data = f.read_bytes()
        except Exception:
            continue
        if len(data) < MIN_DUPLICATE_SIZE:
            continue
        h = hashlib.md5(data).hexdigest()
        by_hash.setdefault(h, []).append(f)
    return {h: files for h, files in by_hash.items() if len(files) > 1}


def check_portability(md_files, repo_root: Path):
    hits = []
    for f in md_files:
        try:
            text = f.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for name, rx in PORTABILITY_PATTERNS.items():
            for m in rx.finditer(text):
                line = text.count("\n", 0, m.start()) + 1
                hits.append((f.relative_to(repo_root), line, name))
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=None)
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve() if args.repo_root else auto_root()
    if not repo_root.is_dir():
        print(f"BŁĄD: root repo nie istnieje: {repo_root}")
        return 2

    md_files = find_md_files(repo_root)
    errors = check_broken_links(md_files, repo_root)
    duplicates = check_duplicates(md_files)
    portability = check_portability(md_files, repo_root)

    if not args.quiet:
        print(f"ci_check_shared.py — {len(md_files)} plików .md w {repo_root}\n")
        print(f"[1/3] ZERWANE ODWOŁANIA: {len(errors)}")
        for src, ref, msg in errors:
            print(f"  BŁĄD  {src.relative_to(repo_root)}")
            print(f"        → '{ref}' — {msg}")

        print(f"\n[2/3] DUPLIKATY BAJTOWE: {len(duplicates)} grup")
        for h, files in duplicates.items():
            print(f"  OSTRZEŻENIE  {len(files)} plików identycznych (md5 {h[:10]}...):")
            for f in files:
                print(f"        - {f.relative_to(repo_root)}")

        print(f"\n[3/3] PORTABILITY — DO PRZEGLĄDU: {len(portability)}")
        for rel, line, name in portability[:80]:
            print(f"  {rel}:{line} — {name}")
        if len(portability) > 80:
            print(f"  ... i {len(portability) - 80} dalszych")

        print()
        if errors:
            print(f"WYNIK: FAIL — {len(errors)} zerwanych odwołań.")
        else:
            print("WYNIK: OK — brak zerwanych odwołań. Portability jest na tym etapie raportem migracyjnym, nie automatycznym FAIL.")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
