#!/usr/bin/env python3
"""Automatyczna aktualizacja numerów tekstów jednolitych z ELI.

1. audit_tj_inventory.py --napraw: nieaktualny t.j. (NEWER_TJ) -> najnowszy z ELI.
2. Podbicie wersji zmienionych skilli (podbij_wersje_skilli.bump) z opisem zmian.
3. Przepakowanie ZIP-ów w WERSJA ROZWOJOWA.
Raport (Markdown) do opisu PR: --raport. Kod wyjścia 0 także bez zmian.
Treść przepisów NIE jest tu weryfikowana: zmieniany jest tylko numer t.j.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from collections import defaultdict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from podbij_wersje_skilli import UNPACKED, bump  # noqa: E402

AUDIT = Path(UNPACKED) / "audyt-systemu-v4" / "scripts" / "audit_tj_inventory.py"
MAPY = Path(UNPACKED) / "audyt-systemu-v4" / "references"
ROW_RE = re.compile(r"^\| (?P<y>\d{4}) \| (?P<p>\d+) \| (?P<akt>[^|]*)\| (?P<typ>[^|]*)\| "
                    r"(?P<st>[^|]*)\| (?P<sk>[^|]*)\| (?P<uw>.*)\|\s*$")


def aktualizuj_mape(repo: Path, fixes: list, dzien: str) -> bool:
    """Nowy t.j. w mapie Dz.U. (T11): wiersz TJ/OK, stary wiersz -> PREV."""
    mapy = sorted((repo / MAPY).glob("mapa_dzu_*.md"))
    if not mapy:
        return False
    path = mapy[-1]
    lines = path.read_text(encoding="utf-8").split("\n")
    rows = {(m["y"], m["p"]): i for i, l in enumerate(lines) if (m := ROW_RE.match(l))}
    nowe = []
    for (old, new), group in sorted(fixes.items()):
        oy, op = old.split("/")
        ny, np_ = new.split("/")
        skills = sorted({Path(f["plik"]).parts[0] for f in group})
        title = short_title(group[0]["tytul"])
        if (oy, op) in rows:
            i = rows[(oy, op)]
            m = ROW_RE.match(lines[i])
            skills = sorted(set(skills) | {s.strip() for s in m["sk"].split(",")
                                           if s.strip() and "+" not in s})
            if m["st"].strip() == "OK":
                uw = m["uw"].strip()
                uw = (uw + " " if uw else "") + f"⬆ zastąpiony przez t.j. {ny} poz. {np_} ({dzien})."
                lines[i] = f"| {oy} | {op} | {m['akt'].strip()} | {m['typ'].strip()} | PREV | {m['sk'].strip()} | {uw} |"
        if (ny, np_) in rows:
            continue
        row = (f"| {ny} | {np_} | {title} — t.j. | TJ | OK | {', '.join(skills)} | "
               f"ELI DU/{ny}/{np_} (automat {dzien}): zastępuje {oy}/{op}. |")
        after = max((i for (y, _), i in rows.items() if y == ny), default=None)
        if after is None:
            after = max(rows.values())
        lines.insert(after + 1, row)
        rows = {(m["y"], m["p"]): i for i, l in enumerate(lines) if (m := ROW_RE.match(l))}
        nowe.append(f"{ny}/{np_} ({title}, zastępuje {oy}/{op})")
    if not nowe:
        return False
    naglowek = next(i for i, l in enumerate(lines) if l.startswith("**Uzupełnienie"))
    lines.insert(naglowek, f"**Uzupełnienie {dzien} (RZĄD 1 ELI, automat aktualizuj_tj.py):** nowe t.j. — "
                 + "; ".join(nowe) + ".")
    path.write_text("\n".join(lines), encoding="utf-8")
    return True


def short_title(title: str) -> str:
    title = re.sub(r"^.*?jednolitego tekstu\s+", "", title)
    return re.sub(r"^(ustawy|rozporządzenia)\s+(-\s+)?", "", title)[:80]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--raport", type=Path, help="raport Markdown do opisu PR")
    args = parser.parse_args()
    repo, dzien = args.repo_root, date.today().isoformat()

    with tempfile.TemporaryDirectory() as tmp:
        fixes_path = Path(tmp) / "tj.json"
        run = subprocess.run(
            [sys.executable, "-I", str(AUDIT), "--root", UNPACKED, "--mode", "operational",
             "--napraw", "--raport-json", str(fixes_path)],
            cwd=repo, capture_output=True, text=True)
        if run.returncode == 2 or not fixes_path.is_file():
            print(run.stdout + run.stderr)
            return 2  # ELI niedostępne: bez zmian, bez pustego sukcesu
        report = json.loads(fixes_path.read_text(encoding="utf-8"))
    remaining = [l for l in run.stdout.splitlines()
                 if l.split("\t", 1)[0] in {"NEWER_TJ", "NOT_TJ", "MISSING", "TITLE_MISMATCH"}]

    by_skill = defaultdict(list)
    by_pair = defaultdict(list)
    for fix in report["naprawione"]:
        by_skill[Path(fix["plik"]).parts[0]].append(fix)
        by_pair[(fix["stary"], fix["nowy"])].append(fix)
    if by_pair and aktualizuj_mape(repo, by_pair, dzien):
        by_skill.setdefault("audyt-systemu-v4", []).extend(
            {**f, "plik": "audyt-systemu-v4/mapa"} for f in report["naprawione"])
    versions = []
    for skill, fixes in sorted(by_skill.items()):
        pairs = sorted({(short_title(f["tytul"]), f["stary"], f["nowy"]) for f in fixes})
        opis = ("automatyczna aktualizacja numerów t.j. z ELI " + dzien + ": "
                + "; ".join(f"{t} {s} → {n}" for t, s, n in pairs)
                + " (sam numer t.j.; treść przepisów nie porównywana)")
        old, new = bump(repo, skill, opis, dzien)
        versions.append((skill, old, new))
    if versions:
        subprocess.run([sys.executable, "scripts/repack_development_archives.py",
                        "--repo-root", "."], cwd=repo, check=True)

    lines = [f"Automatyczna aktualizacja numerów t.j. z ELI ({dzien}).", "",
             "Zmieniany jest tylko numer t.j. w wierszu; treść przepisów nie była "
             "porównywana artykuł po artykule.", ""]
    if versions:
        lines += ["| Skill | Wersja |", "|---|---|"]
        lines += [f"| {s} | {o} → {n} |" for s, o, n in versions]
        lines += ["", "| Plik:wiersz | Akt | Stary → nowy | Uwaga |", "|---|---|---|---|"]
        lines += [f"| {f['plik']}:{f['wiersz']} | {short_title(f['tytul'])} | "
                  f"{f['stary']} → {f['nowy']} | {'; '.join(x for x in (f.get('uwaga'), f.get('kontekst')) if x)} |"
                  for f in report["naprawione"]]
    if report["do_przegladu"]:
        lines += ["", "Do ręcznego przeglądu (bez zmian):", ""]
        lines += [f"- {f['plik']}:{f['wiersz']} {f['stary']} → {f['nowy']} ({f['powod']})"
                  for f in report["do_przegladu"]]
    if remaining:
        lines += ["", "Pozostałe sygnały audytu T15:", "", "```"]
        lines += [l[:240] for l in remaining] + ["```"]
    text = "\n".join(lines) + "\n"
    if args.raport:
        args.raport.write_text(text, encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
