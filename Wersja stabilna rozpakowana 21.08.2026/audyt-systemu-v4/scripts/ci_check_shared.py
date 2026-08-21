#!/usr/bin/env python3
"""
ci_check_shared.py — deterministyczny CI dla silnika skilli prawnych.

Adresuje punkt 2 audytu komercyjnego: "shared/ to punkt osobliwy
architektury (...) bez CI/testów regresyjnych każda edycja jednego ze 115
plików może cicho zepsuć 31 zależnych skilli."

Dwie kontrole, oparte wyłącznie na analizie plików na dysku (brak zależności
sieciowych, brak zależności od LLM — czysto deterministyczne):

  1. ZERWANE ODWOŁANIA (BŁĄD, kod wyjścia 1)
     Każde `view /mnt/skills/user/...` oraz każda ścieżka *.md w polach
     frontmatter `required_modules:` / `dependencies: requires:` musi
     wskazywać na plik, który faktycznie istnieje na dysku.

  2. DUPLIKATY BAJTOWE (OSTRZEŻENIE, nie blokuje)
     Pliki *.md o identycznym MD5 w różnych lokalizacjach — dokładnie ten
     typ błędu, jaki znaleziono ręcznie w prawny-router-v3 vs dr-03
     (kwalifikator-karnomaterialny.md, 2026-07-12). Ten check automatyzuje
     wykrywanie na przyszłość.

Użycie:
    python3 ci_check_shared.py [--repo-root /mnt/skills/user] [--quiet]

Kod wyjścia:
    0 — brak zerwanych odwołań (duplikaty, jeśli są, tylko ostrzegają)
    1 — znaleziono co najmniej jedno zerwane odwołanie

Przeznaczone do uruchamiania jako git pre-commit hook (patrz
install_precommit_hook.sh w tym samym katalogu) oraz ręcznie przy każdej
sesji audyt-systemu-v4.
"""

import argparse
import hashlib
import re
import sys
from pathlib import Path

VIEW_PATTERN = re.compile(r"view\s+(/mnt/skills/user/\S+?\.md)\b")

# pola frontmatter, w których mogą wystąpić ścieżki względne do plików .md
FRONTMATTER_PATH_PATTERN = re.compile(
    r"^\s*-\s*([a-zA-Z0-9_\-./]+\.md)\s*$", re.MULTILINE
)

# katalogi/pliki celowo pomijane w kontroli duplikatów
# (STUB-y są z definicji krótkimi plikami przekierowującymi — ich treść
# różni się od kanonicznej, więc i tak nie trafią w duplikat bajtowy;
# lista zostawiona pusta świadomie, żeby nie maskować przyszłych błędów)
DUPLICATE_CHECK_IGNORE = set()

# bare placeholder stems używane w dokumentacji jako generyczny przykład
# wywołania (np. "view .../shared/X.md" = "wywołaj DOWOLNY plik tak") —
# nie są to realne odwołania i nie powinny być traktowane jak zerwane linki
PLACEHOLDER_STEMS = {"x", "nazwa", "akt", "nazwa-pliku", "plik"}


def is_placeholder_ref(ref_path: Path) -> bool:
    raw = str(ref_path)
    if "[" in raw or "]" in raw:
        return True
    if ref_path.stem.lower() in PLACEHOLDER_STEMS:
        return True
    return False

# minimalny rozmiar pliku brany pod uwagę w kontroli duplikatów (bajty) —
# odcina puste/prawie puste pliki, które i tak nie są znaczącym duplikatem
MIN_DUPLICATE_SIZE = 200


def find_md_files(repo_root: Path):
    return sorted(p for p in repo_root.rglob("*.md") if ".git" not in p.parts)


def resolve_relative_ref(ref: str, source_file: Path, repo_root: Path):
    """Ścieżki w required_modules bywają względne do repo_root (np.
    'shared/PRAWO-HARDGATE.md') albo do katalogu skilla (np.
    'modules/mod-X.md'). Próbujemy obu interpretacji."""
    candidates = [
        repo_root / ref,
        source_file.parent / ref,
    ]
    return candidates


def check_broken_links(md_files, repo_root: Path):
    errors = []
    for f in md_files:
        try:
            text = f.read_text(encoding="utf-8", errors="strict")
        except Exception as e:
            errors.append((f, None, f"BŁĄD ODCZYTU: {e}"))
            continue

        for m in VIEW_PATTERN.finditer(text):
            ref_path = Path(m.group(1))
            if is_placeholder_ref(ref_path):
                continue
            if not ref_path.exists():
                errors.append((f, str(ref_path), "view() wskazuje na nieistniejący plik"))

        # tylko sekcja frontmatter (między pierwszymi --- ... ---)
        if text.startswith("---"):
            end = text.find("\n---", 3)
            frontmatter = text[:end] if end != -1 else ""
            for m in FRONTMATTER_PATH_PATTERN.finditer(frontmatter):
                ref = m.group(1)
                if is_placeholder_ref(Path(ref)):
                    continue
                if ref.startswith("/mnt/"):
                    if not Path(ref).exists():
                        errors.append((f, ref, "frontmatter wskazuje na nieistniejący plik"))
                else:
                    candidates = resolve_relative_ref(ref, f, repo_root)
                    if not any(c.exists() for c in candidates):
                        errors.append(
                            (f, ref, "frontmatter (ścieżka względna) nie rozwiązuje się do istniejącego pliku")
                        )
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    md_files = find_md_files(repo_root)

    errors = check_broken_links(md_files, repo_root)
    duplicates = check_duplicates(md_files)

    if not args.quiet:
        print(f"ci_check_shared.py — {len(md_files)} plików .md przeskanowanych w {repo_root}\n")

        print(f"[1/2] ZERWANE ODWOŁANIA: {len(errors)}")
        for src, ref, msg in errors:
            print(f"  BŁĄD  {src.relative_to(repo_root)}")
            print(f"        → '{ref}' — {msg}")

        print(f"\n[2/2] DUPLIKATY BAJTOWE (MD5): {len(duplicates)} grup")
        for h, files in duplicates.items():
            print(f"  OSTRZEŻENIE  {len(files)} plików identycznych (md5 {h[:10]}...):")
            for f in files:
                print(f"        - {f.relative_to(repo_root)}")

        print()
        if errors:
            print(f"WYNIK: FAIL — {len(errors)} zerwanych odwołań musi zostać naprawionych.")
        else:
            print("WYNIK: OK — brak zerwanych odwołań."
                  + (" Duplikaty powyżej wymagają decyzji, ale nie blokują." if duplicates else ""))

    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
