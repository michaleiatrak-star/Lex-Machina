#!/usr/bin/env python3
"""check_widget_no_ai_egress.py — widgety/skrypty nie wysylaja danych do dostawcow AI.

Egzekwuje shared/UNIVERSAL-RUNTIME-ADAPTER.md §5: statyczne widgety Lex Machina
nie wywoluja endpointow Anthropic/OpenAI/Google AI. Skanuje *.html, *.js, *.jsx,
*.mjs w drzewie skilli (bez node_modules).

Uzycie: python3 check_widget_no_ai_egress.py [--repo-root KATALOG]
Kod wyjscia: 0 — czysto; 1 — znaleziono endpoint dostawcy AI.
"""
import argparse
import pathlib
import re
import sys

WZORZEC = re.compile(r"api\.anthropic\.com|api\.openai\.com|generativelanguage\.googleapis\.com"
                     r"|generativelanguage|api\.mistral\.ai|api\.cohere\.(?:ai|com)")
ROZSZERZENIA = {".html", ".htm", ".js", ".jsx", ".mjs", ".cjs"}
POMIJANE = {"node_modules", ".git", "__pycache__"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=str(pathlib.Path(__file__).resolve().parents[2]))
    root = pathlib.Path(ap.parse_args().repo_root)
    bledy = []
    for p in sorted(root.rglob("*")):
        if p.suffix.lower() not in ROZSZERZENIA or not p.is_file():
            continue
        if POMIJANE & set(p.relative_to(root).parts):
            continue
        for nr, linia in enumerate(p.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if WZORZEC.search(linia):
                bledy.append(f"{p.relative_to(root)}:{nr}: {linia.strip()[:120]}")
    if bledy:
        print("BLAD: endpoint dostawcy AI w widgecie/skrypcie (zakaz: UNIVERSAL-RUNTIME-ADAPTER §5):")
        print("\n".join(bledy))
        return 1
    print("OK: brak wywolan dostawcow AI w widgetach/skryptach.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
