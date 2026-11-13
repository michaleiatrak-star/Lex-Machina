#!/usr/bin/env python3
"""Podbija wersje skilli zmienionych w drzewie roboczym.

Dla każdego skilla z `Wersja rozwojowa rozpakowana/<skill>/`, w którym git widzi
zmiany: ostatni człon wersji +1 w SKILL.md i .claude-plugin/plugin.json,
wpis w references/CHANGELOG.md, wiersz `changelog:` we front matter (gdy jest;
blok przycięty do 14 wierszy), przeliczone sumy w CHECKSUMS.sha256.

Użycie: podbij_wersje_skilli.py --opis "ROUTING-MAP: t.j. ... (ELI 2026-11-13)"
"""
import argparse
import hashlib
import json
import re
import subprocess
from datetime import date
from pathlib import Path

UNPACKED = "Wersja rozwojowa rozpakowana"
CHANGELOG_MAX = 14
VERSION_RE = re.compile(r'^version:\s*"?(?P<v>[0-9][0-9.]*)"?(?P<rest>[ \t]*(?:#.*)?)$', re.M)


def changed_skills(repo: Path) -> list[str]:
    out = subprocess.run(
        ["git", "status", "--porcelain", "-z", "--", UNPACKED],
        cwd=repo, check=True, capture_output=True, text=True).stdout
    names = set()
    for item in out.split("\0"):
        parts = Path(item[3:]).parts if len(item) > 3 else ()
        if len(parts) > 1 and parts[0] == UNPACKED:
            names.add(parts[1])
    return sorted(n for n in names if (repo / UNPACKED / n / "SKILL.md").is_file())


def next_version(version: str) -> str:
    parts = version.split(".")
    parts[-1] = str(int(parts[-1]) + 1)
    return ".".join(parts)


def bump_frontmatter(text: str, new: str, line: str) -> str:
    end = text.index("\n---", 4)
    head, rest = text[:end], text[end:]
    head = VERSION_RE.sub(lambda m: f'version: "{new}"{m.group("rest")}', head, count=1)
    match = re.search(r"^changelog: \|\n((?:  .*\n?)*)", head, re.M)
    if match:
        entries = [e for e in match.group(1).split("\n") if e.strip()]
        entries = [re.sub(r"^  Wersja bieżąca: ", "  ", e) for e in entries]
        entries = [f"  Wersja bieżąca: {line}"] + entries
        block = "changelog: |\n" + "\n".join(entries[:CHANGELOG_MAX])
        head = head[:match.start()] + block + head[match.end():].lstrip("\n")
        if not head.endswith("\n") and not rest.startswith("\n"):
            head += "\n"
    return head + rest


def bump_changelog(path: Path, line: str) -> None:
    if not path.is_file():
        return
    lines = path.read_text(encoding="utf-8").split("\n")
    at = next((i for i, l in enumerate(lines) if l.startswith("- ")), len(lines))
    lines.insert(at, f"- {line}")
    path.write_text("\n".join(lines), encoding="utf-8")


def refresh_checksums(skill: Path) -> None:
    path = skill / "CHECKSUMS.sha256"
    if not path.is_file():
        return
    out = []
    for row in path.read_text(encoding="utf-8").splitlines():
        digest, sep, name = row.partition("  ")
        target = skill / name
        if sep and target.is_file():
            digest = hashlib.sha256(target.read_bytes()).hexdigest()
        out.append(f"{digest}{sep}{name}")
    path.write_text("\n".join(out) + "\n", encoding="utf-8")


def bump(repo: Path, name: str, opis: str, dzien: str) -> tuple[str, str]:
    skill = repo / UNPACKED / name
    skill_md = skill / "SKILL.md"
    text = skill_md.read_text(encoding="utf-8")
    old = VERSION_RE.search(text[:text.index("\n---", 4)]).group("v")
    new = next_version(old)
    line = f"{new} ({dzien}): {opis}"
    text = bump_frontmatter(text, new, line)
    # Stopka „*Wersja: X | Ostatnia aktualizacja: …" (audyt-systemu-v4, T12).
    text = re.sub(rf"(\*Wersja: ){re.escape(old)}( \| Ostatnia aktualizacja: )[0-9-]+(?: \([^)]*\))?",
                  lambda m: f"{m.group(1)}{new}{m.group(2)}{dzien} ({opis.split(':')[0][:50]})", text)
    skill_md.write_text(text, encoding="utf-8")
    plugin = skill / ".claude-plugin" / "plugin.json"
    if plugin.is_file():
        raw = plugin.read_text(encoding="utf-8")
        data = json.loads(raw)
        if data.get("version") != old:
            raise SystemExit(f"{name}: plugin.json {data.get('version')} != SKILL.md {old}")
        plugin.write_text(raw.replace(f'"version": "{old}"', f'"version": "{new}"', 1),
                          encoding="utf-8")
    bump_changelog(skill / "references" / "CHANGELOG.md", line)
    refresh_checksums(skill)
    return old, new


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--opis", required=True)
    parser.add_argument("--dzien", default=date.today().isoformat())
    parser.add_argument("--pomin", action="append", default=[],
                        help="skill bez podbicia wersji (np. audyt-systemu-v4)")
    args = parser.parse_args()
    for name in changed_skills(args.repo_root):
        if name in args.pomin:
            continue
        old, new = bump(args.repo_root, name, args.opis, args.dzien)
        print(f"{name}\t{old} -> {new}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
