#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import re
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path.cwd()
SRC = REPO / "Wersja rozwojowa rozpakowana" / "shared"
OUT_PARENT = REPO / "staging"
OUT = OUT_PARENT / "shared"
HELPER = REPO / ".github" / "portability" / "shared-extract-api-verification-log.py"


def files(root: Path) -> list[Path]:
    return sorted(p for p in root.rglob("*") if p.is_file())


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if text.count(old) != 1:
        raise RuntimeError(f"{label}: expected exactly one occurrence, got {text.count(old)}")
    return text.replace(old, new, 1)


def stage() -> int:
    if OUT_PARENT.exists():
        shutil.rmtree(OUT_PARENT)
    OUT_PARENT.mkdir(parents=True)
    shutil.copytree(SRC, OUT)
    src_count = len(files(SRC))
    out_count = len(files(OUT))
    print(f"source={src_count} staged={out_count}")
    if src_count != out_count:
        raise RuntimeError("source/staging file-count mismatch")
    if src_count > 198:
        raise RuntimeError(f"shared source has {src_count} files; +2 validation files would exceed 200")
    return src_count


def patch_skill() -> int:
    p = OUT / "SKILL.md"
    text = p.read_text(encoding="utf-8")
    pat = re.compile(r"description: >-\n(?:  .*\n)+?(?=dependencies:)", re.M)
    repl = ('description: "Kanoniczna biblioteka Lex Machina: hardgate, walidacja, definicje, terminy i moduły wspólne. '
            'Nie odpowiada użytkownikowi samodzielnie; zasoby wczytują inne skille."\n')
    text, n = pat.subn(repl, text, count=1)
    if n != 1:
        raise RuntimeError("shared description block not found exactly once")

    adapter = """## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

`shared` pozostaje JEDYNYM kanonicznym SSOT. Adapter nie zmienia treści modułów prawnych, tylko sposób rozumienia operacji technicznych.

1. `view /mnt/skills/user/shared/<plik>` oznacza świeży odczyt `<plik>` z rootu zainstalowanego skilla `shared`. Literalna ścieżka `/mnt/skills/user` nie jest wymagana. Obowiązkowego odczytu nie zastępuj pamięcią modelu.
2. Udokumentowane pliki-mosty mogą wskazywać inny osobny skill. `view /mnt/skills/user/<skill>/<plik>` oznacza świeży odczyt zasobu z tego skilla przez mechanizm hosta. Brak obowiązkowego zasobu = fail-closed; NIE kopiuj go do `shared`.
3. `web_search` / `web_fetch` oznaczają świeże wyszukanie lub odczyt źródła. Jeśli host ma inną nazwę narzędzia, użyj równoważnej funkcji. PRAWO-HARDGATE, hierarchia źródeł i statusy pozostają bez zmian.
4. `/mnt/user-data/...` oznacza rzeczywiste pliki użytkownika dostępne w hoście; wymagany ponowny odczyt jest faktycznym odczytem źródła.
5. `show_widget`, `present_files`, `create_file`, shell/Python i podobne operacje wykonuj równoważną natywną funkcją hosta, jeśli literalna nazwa nie istnieje. Nie pomijaj bramek jakości.
6. `tools/` to kod integracyjny portalu. `extract_api_verification_log.py` przyjmuje neutralne `events` i zachowuje zgodność z Claude legacy, generycznymi tool-call oraz Responses-style.

**Zasada nadrzędna:** jeśli istniejąca instrukcja jest zrozumiała i wykonalna w bieżącym hoście, wykonaj ją bez konwersji. Adapter działa tylko na granicy runtime.

"""
    marker = "---\n\n# shared/ — Wspólne moduły systemu prawnych skilli"
    text = replace_once(text, marker, "---\n\n" + adapter + "# shared/ — Wspólne moduły systemu prawnych skilli", "frontmatter marker")
    p.write_text(text, encoding="utf-8")
    m = re.search(r'^description:\s*"(.*?)"\s*$', text, re.M)
    if not m:
        raise RuntimeError("portable description missing")
    if len(m.group(1)) > 200:
        raise RuntimeError(f"description length {len(m.group(1))} > 200")
    return len(m.group(1))


def patch_tools() -> None:
    if not HELPER.is_file():
        raise RuntimeError("temporary provider-neutral extractor helper missing")
    shutil.copy2(HELPER, OUT / "tools" / "extract_api_verification_log.py")

    p = OUT / "tools" / "export_gate.py"
    text = p.read_text(encoding="utf-8")
    text = replace_once(
        text,
        'parser = argparse.ArgumentParser(description="Bramka eksportu: ekstrakcja logu API + walidacja cytowań")',
        'parser = argparse.ArgumentParser(description="Bramka eksportu: provider-neutralna ekstrakcja logu weryfikacji + walidacja cytowań")',
        "export_gate parser description",
    )
    old = '''parser.add_argument("--api-conversation", required=False,
                         help="Ścieżka do JSON z pełną konwersacją API (format extract_api_verification_log.py)")'''
    new = '''parser.add_argument("--api-conversation", "--verification-input", dest="api_conversation", required=False,
                         help="JSON z logiem weryfikacji: neutralne events, Claude legacy, generic tool-call lub Responses-style")'''
    text = replace_once(text, old, new, "export_gate input argument")
    text = replace_once(
        text,
        'print("Wymagane: --document i --api-conversation (lub --self-test)", file=sys.stderr)',
        'print("Wymagane: --document i --verification-input/--api-conversation (lub --self-test)", file=sys.stderr)',
        "export_gate required message",
    )
    text = text.replace("Zdarzeń weryfikacji wydobytych z konwersacji API:", "Zdarzeń weryfikacji wydobytych z wejścia:")
    p.write_text(text, encoding="utf-8")

    p = OUT / "tools" / "README.md"
    appendix = """

## Portability — neutralny format wejściowy logu weryfikacji

Dla nowych integracji preferuj provider-neutralny JSON `{"session_id":"...","events":[...]}`.
Event zawiera `tool` (`web_fetch`/`web_search`), źródło (`url` albo `query` + `result_urls`),
opcjonalny `query_context` i status. Format Claude/Anthropic `server_tool_use` + `*_tool_result`
pozostaje obsługiwany wstecznie. Ekstraktor rozpoznaje też generyczne pary tool-call/result oraz
ukończone wpisy Responses-style. Samo rozpoczęcie wywołania bez wyniku nie jest dowodem weryfikacji.
"""
    p.write_text(p.read_text(encoding="utf-8") + appendix, encoding="utf-8")


def validate_code() -> None:
    extractor = OUT / "tools" / "extract_api_verification_log.py"
    gate = OUT / "tools" / "export_gate.py"
    subprocess.run([sys.executable, str(extractor), "--self-test"], check=True)
    subprocess.run([sys.executable, str(gate), "--self-test"], check=True)
    py_files = sorted((OUT / "tools").glob("*.py"))
    subprocess.run([sys.executable, "-m", "py_compile", *map(str, py_files)], check=True)
    for cache in OUT.rglob("__pycache__"):
        shutil.rmtree(cache)
    if list(OUT.rglob("*.pyc")) or list(OUT.rglob("*.pyo")):
        raise RuntimeError("generated bytecode remains")


def add_validation_files(source_count: int, desc_len: int) -> None:
    before = len(files(OUT))
    if before != source_count:
        print(f"INFO: same file count preserved after in-place patches: {before}")
    manifest = f"""# Portability manifest — shared

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Canonical source files: **{source_count}**
- Files before manifest/checksums after in-place patches: **{before}**
- Frontmatter description: **{desc_len}/200**

## SSOT

`shared` pozostaje jedyną kanoniczną biblioteką. Nie powiela się jej plików w ZIP-ach innych skilli.

## Zmiany runtime

1. `SKILL.md`: semantyczny adapter dla legacy ścieżek/narzędzi bez masowej zmiany modułów prawnych.
2. `tools/extract_api_verification_log.py`: neutralne `events` + zgodność wsteczna Claude legacy + generic tool-call + Responses-style.
3. `tools/export_gate.py`: zachowuje `--api-conversation`, dodaje neutralny alias `--verification-input`.
4. `tools/README.md`: opis neutralnego kontraktu logu.
5. Pozostałe moduły, bramki, definicje, MCP i świadome pliki-mosty pozostają zachowane.

Instrukcji `web_search`, `web_fetch` i `view`, które host już rozumie, nie przepisywano mechanicznie.
"""
    (OUT / "PORTABILITY-MANIFEST.md").write_text(manifest, encoding="utf-8")
    rows = []
    for f in files(OUT):
        if f.name == "CHECKSUMS.sha256":
            continue
        rows.append(f"{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.relative_to(OUT).as_posix()}")
    (OUT / "CHECKSUMS.sha256").write_text("\n".join(rows) + "\n", encoding="utf-8")


def final_validate() -> None:
    all_files = files(OUT)
    print(f"FINAL_FILES={len(all_files)}")
    if len(all_files) > 200:
        raise RuntimeError(f"hard limit exceeded: {len(all_files)}")
    for rel in ["SKILL.md", "PRAWO-HARDGATE.md", "MOD-STEP-TRACKER.md", "tools/extract_api_verification_log.py", "tools/export_gate.py"]:
        if not (OUT / rel).is_file():
            raise RuntimeError(f"required file missing: {rel}")
    if any("__pycache__" in str(p) for p in all_files):
        raise RuntimeError("__pycache__ in artifact")
    rows = (OUT / "CHECKSUMS.sha256").read_text(encoding="utf-8").splitlines()
    for row in rows:
        digest, rel = row.split("  ", 1)
        got = hashlib.sha256((OUT / rel).read_bytes()).hexdigest()
        if got != digest:
            raise RuntimeError(f"checksum mismatch: {rel}")
    print(f"CHECKSUMS_OK={len(rows)}")


def main() -> None:
    source_count = stage()
    desc_len = patch_skill()
    patch_tools()
    validate_code()
    add_validation_files(source_count, desc_len)
    final_validate()


if __name__ == "__main__":
    main()
