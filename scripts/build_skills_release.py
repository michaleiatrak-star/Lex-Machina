#!/usr/bin/env python3
"""Paczka i indeks wydania skilli dla automatycznej aktualizacji aplikacji.

python3 scripts/build_skills_release.py <katalog skilli> <katalog wyjsciowy> <wersja> <minAppVersion>

Wynik:
- LexMachina-Skills-<wersja>.zip: katalog "Wersja rozwojowa rozpakowana" (aplikacja szuka go w paczce);
- LexMachina-Skills-Index.json: schemat jak build-skill-update-release.ts aplikacji
  (wersja, SHA-256 i rozmiar paczki, minAppVersion, dla kazdego skilla id, wersja, SHA-256 SKILL.md
  i zaleznosci). Aplikacja instaluje wydanie tylko z nowszym skillem i bez starszego.
"""

import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

import yaml

FRONTMATTER = re.compile(r"^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?")
SEMVER = re.compile(r"^\d+\.\d+\.\d+$")
SAFE_ID = re.compile(r"^[A-Za-z0-9._-]{1,128}$")
ARCHIVE_ROOT = "Wersja rozwojowa rozpakowana"
SKIPPED_PARTS = {"__pycache__", ".DS_Store"}
FIXED_TIME = (2020, 1, 1, 0, 0, 0)


def fail(message: str) -> None:
    raise SystemExit(f"SKILL_RELEASE_FAILED: {message}")


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def skills_of(source: Path) -> list[dict]:
    skills = []
    seen = set()
    for directory in sorted(p for p in source.iterdir() if p.is_dir()):
        skill_file = directory / "SKILL.md"
        if not skill_file.is_file():
            continue
        match = FRONTMATTER.match(skill_file.read_text(encoding="utf-8"))
        if not match:
            fail(f"brak naglowka YAML: {skill_file}")
        front = yaml.safe_load(match.group(1))
        if not isinstance(front, dict):
            fail(f"naglowek nie jest obiektem: {skill_file}")
        name = front.get("name")
        version = front.get("version")
        if not isinstance(name, str) or not SAFE_ID.match(name.strip()):
            fail(f"nazwa skilla: {skill_file}")
        if not isinstance(version, str) or not version.strip() or len(version.strip()) > 64:
            fail(f"wersja skilla musi byc tekstem w cudzyslowie: {skill_file}")
        name = name.strip()
        if name in seen:
            fail(f"powtorzona nazwa skilla: {name}")
        seen.add(name)
        requires = (front.get("dependencies") or {}).get("requires") or []
        if not isinstance(requires, list) or not all(isinstance(item, str) for item in requires):
            fail(f"dependencies.requires: {skill_file}")
        skills.append({
            "id": name,
            "version": version.strip(),
            "sha256": sha256_file(skill_file),
            "dependencies": sorted(set(requires)),
        })
    if not skills:
        fail("brak skilli")
    return sorted(skills, key=lambda item: item["id"])


def build_zip(source: Path, target: Path) -> None:
    # Stala kolejnosc i czas plikow: ta sama tresc daje te sama paczke.
    with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(source.rglob("*")):
            if not path.is_file() or SKIPPED_PARTS.intersection(path.parts):
                continue
            info = zipfile.ZipInfo(f"{ARCHIVE_ROOT}/{path.relative_to(source).as_posix()}", FIXED_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info, path.read_bytes())


def main() -> None:
    if len(sys.argv) != 5:
        fail("uzycie: build_skills_release.py <katalog skilli> <wyjscie> <wersja> <minAppVersion>")
    source, output, version, min_app = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], sys.argv[4]
    if not source.is_dir():
        fail(f"brak katalogu {source}")
    if not SEMVER.match(version) or not SEMVER.match(min_app):
        fail("wersja i minAppVersion w postaci X.Y.Z")
    output.mkdir(parents=True, exist_ok=True)
    skills = skills_of(source)
    bundle = output / f"LexMachina-Skills-{version}.zip"
    build_zip(source, bundle)
    index = {
        "schemaVersion": 1,
        "kind": "LEX_MACHINA_SKILLS_INDEX",
        "version": version,
        "bundle": {
            "filename": bundle.name,
            "sha256": sha256_file(bundle),
            "bytes": bundle.stat().st_size,
        },
        "compatibility": {"minAppVersion": min_app},
        "skills": skills,
    }
    (output / "LexMachina-Skills-Index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"result": "PASS", "version": version, "skills": len(skills), "bundle": index["bundle"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
