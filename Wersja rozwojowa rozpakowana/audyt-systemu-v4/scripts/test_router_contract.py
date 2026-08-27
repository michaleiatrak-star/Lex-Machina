#!/usr/bin/env python3
"""T17: statyczny kontrakt i lekki korpus routera prawnego.

Test nie mierzy zachowania modelu (to nadal F-113/F-133). Chroni elementy,
których utrata powodowała już regresje: imperatywny trigger, PATH-SELFTEST,
routing cudzego materiału, reguły bezwzględne, deduplikację oraz zakaz
domyślnej pełnej zgodności z kluczem.
Rozpoznaje skill po polu `name`, więc nie zależy od nazwy katalogu hosta.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def skill_name(path: Path) -> str | None:
    text = path.read_text(encoding="utf-8", errors="replace")
    match = re.search(r"^name:\s*['\"]?([^'\"\n]+)", text, re.MULTILINE)
    return match.group(1).strip() if match else None


def find_skill(root: Path, wanted: str) -> Path | None:
    direct = root / wanted
    if (direct / "SKILL.md").is_file():
        return direct
    for skill_file in sorted(root.glob("*/SKILL.md")):
        if skill_name(skill_file) == wanted:
            return skill_file.parent
    return None


def description(text: str) -> str:
    match = re.search(r"^description:\s*(['\"])(.*?)\1\s*$", text, re.MULTILINE)
    return match.group(2) if match else ""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", required=True)
    args = parser.parse_args()
    root = Path(args.repo_root).resolve()
    router = find_skill(root, "prawny-router-v3")
    if router is None:
        print("⛔ Nie znaleziono skilla name=prawny-router-v3.")
        return 2

    skill = (router / "SKILL.md").read_text(encoding="utf-8")
    self_check_path = router / "references" / "SELF-CHECK.md"
    key_audit_path = router / "references" / "AUDYT-KLUCZA-ODPOWIEDZI.md"
    self_check = self_check_path.read_text(encoding="utf-8") if self_check_path.is_file() else ""
    key_audit = key_audit_path.read_text(encoding="utf-8") if key_audit_path.is_file() else ""

    desc = description(skill)
    body = skill.split("---", 2)[-1]
    always_pos = body.find("## ŁADOWANE ZAWSZE — BEZWZGLĘDNIE")
    adapter_pos = body.find("## ADAPTER RUNTIME")
    expected_rules = ["1", "1C", "2", "3", "4", "5", "6", "7", "7B", "7C",
                      "8", "9", "10", "11", "11a", "12", "14", "15", "16",
                      "17", "18", "19", "20", "20a", "21", "22", "23", "24",
                      "25", "26", "27"]
    actual_rules = re.findall(r"^- \*\*Reguła ([0-9]+[a-zA-Z]?) —", body, re.MULTILINE)
    rule_meanings = {"9": "trwałość HARD GATE", "22": "świadek", "23": "re-check każdej tury",
                     "24": "VER-GRAIN", "25": "cudzy materiał", "26": "skill nie jest źródłem",
                     "27": "audyt klucza"}
    checks = [
        ("imperatywny trigger", desc.startswith("UŻYWAJ ZAWSZE") and "każdej jurysdykcji" in desc),
        ("description ≤200", 0 < len(desc) <= 200),
        ("stabilny nagłówek major", "# Router Prawny v3 —" in skill and "# Router Prawny v3." not in skill),
        ("PATH-SELFTEST", "PATH-SELFTEST" in skill and "TRYB ZDEGRADOWANY" in skill),
        ("reguły bezwzględne pierwsze", always_pos >= 0 and adapter_pos > always_pos),
        ("pełny self-check przed wysłaniem", "view references/SELF-CHECK.md" in body),
        ("lekki korpus ≤500 linii", len(skill.splitlines()) <= 500),
        ("bez narracji incydentów", not re.search(r"ROOT CAUSE|VII P 94/25|HP sp\. z o\.o\.|Dlaczego OSOBNA|przeniesione stąd|flaga F-126", skill, re.IGNORECASE)),
        ("bez zduplikowanej reguły 13", "13" not in actual_rules and "13. Weryfikacja:" not in skill),
        ("stałe identyfikatory i kolejność reguł", actual_rules == expected_rules),
        ("numery reguł zachowują znaczenie", all(f"Reguła {number} — {meaning}:" in body for number, meaning in rule_meanings.items())),
        ("kategoria [11]", "### [11] WERYFIKACJA CUDZEGO MATERIAŁU" in skill),
        ("obowiązkowy odczyt audytu klucza", "OBOWIĄZKOWO: `view references/AUDYT-KLUCZA-ODPOWIEDZI.md`" in skill),
        ("plik audytu klucza", key_audit_path.is_file()),
        ("ledger N/N", "PEŁNA ZGODNOŚĆ — N/N" in key_audit and "P + O + U = N" in key_audit),
        ("zakaz domyślnego PASS", "Zakaz:" in key_audit and "nierozstrzygnięte=0" in key_audit),
        ("self-check audytu klucza", "AUDYT KLUCZA" in self_check and "pokrycie N/N" in self_check),
    ]

    failed = [name for name, ok in checks if not ok]
    print(f"T17 — kontrakt routera: {router.name}; description={len(desc)}/200")
    for name, ok in checks:
        print(f"{'✅' if ok else '⛔'} {name}")
    if failed:
        print(f"\nWYNIK T17: FAIL — {len(failed)} niespełnionych warunków.")
        return 1
    print("\nWYNIK T17: PASS — kontrakt statyczny kompletny.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
