#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T38 — check_plugin_manifest.py: spójność pluginów z marketplace (AUDYT-2026-09-27e).

Każdy skill linii rozwojowej jest instalowany jako osobny plugin z
`.claude-plugin/marketplace.json` w korzeniu repozytorium. Rozjazd manifestu pluginu
z SKILL.md nie psuje treści skilla, ale psuje instalację i aktualizacje: claude.ai
(2026-09-27) instalował z marketplace wyłącznie pluginy z kluczem `dependencies`
we frontmatterze, a `version` w plugin.json decyduje, czy host zauważy aktualizację.

CO SPRAWDZA (każde naruszenie = FAIL)
  A. `<skill>/.claude-plugin/plugin.json` istnieje, jest poprawnym JSON-em, a jego
     `name`, `version` i `description` są identyczne z SKILL.md (nazwa = katalog);
  B. frontmatter SKILL.md każdego skilla poza `shared` ma `dependencies` wskazujące
     `shared`;
  C. gdy obok katalogu skilli leży `.claude-plugin/marketplace.json` (korzeń repo):
     wpisy ↔ katalogi 1:1, `source` wskazuje katalog wpisu, każda nazwa w
     `dependencies` wpisu istnieje w marketplace.
Offline. Kod: 0 PASS, 1 FAIL, 2 błąd wejścia. --selftest: 5 przypadków.
"""
import argparse, json, re, shutil, sys, tempfile
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None


def frontmatter(p: Path):
    t = p.read_text(encoding="utf-8")
    if not t.startswith("---"):
        return None
    e = t.find("\n---", 3)
    return yaml.safe_load(t[4:e]) if e > 0 else None


def skille(root: Path):
    return sorted(d for d in root.iterdir() if d.is_dir() and (d / "SKILL.md").is_file())


def sprawdz(root: Path):
    bledy = []
    ss = skille(root)
    for d in ss:
        fm = frontmatter(d / "SKILL.md") or {}
        pj = d / ".claude-plugin" / "plugin.json"
        if not pj.is_file():
            bledy.append(f"A: {d.name}: brak .claude-plugin/plugin.json")
        else:
            try:
                m = json.loads(pj.read_text(encoding="utf-8"))
            except ValueError as e:
                bledy.append(f"A: {d.name}: plugin.json nie jest JSON-em ({e})")
                m = {}
            for pole, oczek in (("name", d.name), ("version", str(fm.get("version", ""))),
                                ("description", fm.get("description", ""))):
                if m and m.get(pole) != oczek:
                    bledy.append(f"A: {d.name}: plugin.json `{pole}` = {m.get(pole)!r}, SKILL.md/katalog = {oczek!r}")
        if d.name != "shared" and "shared" not in json.dumps(fm.get("dependencies", ""), ensure_ascii=False):
            bledy.append(f"B: {d.name}: frontmatter SKILL.md bez `dependencies` wskazującego `shared`")
    mp = root.parent / ".claude-plugin" / "marketplace.json"
    if mp.is_file():
        mk = json.loads(mp.read_text(encoding="utf-8"))
        wpisy = {w["name"]: w for w in mk.get("plugins", [])}
        nazwy = {d.name for d in ss}
        for n in sorted(set(wpisy) - nazwy):
            bledy.append(f"C: wpis `{n}` w marketplace bez katalogu skilla")
        for n in sorted(nazwy - set(wpisy)):
            bledy.append(f"C: katalog `{n}` bez wpisu w marketplace")
        for n, w in wpisy.items():
            src = w.get("source")
            if isinstance(src, str) and (root.parent / src).resolve() != (root / n).resolve():
                bledy.append(f"C: wpis `{n}`: source {src!r} nie wskazuje katalogu {root.name}/{n}")
            for dep in w.get("dependencies", []):
                dn = dep if isinstance(dep, str) else dep.get("name")
                if dn not in wpisy:
                    bledy.append(f"C: wpis `{n}`: zależność `{dn}` nie istnieje w marketplace")
    return bledy, ss


def _szkielet(tmp: Path, *, bez_pj=False, zla_wersja=False, bez_deps=False, zly_source=False):
    rep = tmp / "repo"; root = rep / "linia"
    for n, deps in (("shared", False), ("skill-a", True)):
        d = root / n; (d / ".claude-plugin").mkdir(parents=True)
        dep = "" if (not deps or bez_deps) else "dependencies:\n  requires:\n    - shared\n"
        (d / "SKILL.md").write_text(f'---\nname: {n}\ndescription: "opis {n}"\n{dep}version: "1.2"\n---\n# {n}\n', encoding="utf-8")
        if not (bez_pj and n == "skill-a"):
            v = "1.3" if (zla_wersja and n == "skill-a") else "1.2"
            (d / ".claude-plugin" / "plugin.json").write_text(json.dumps({"name": n, "version": v, "description": f"opis {n}"}), encoding="utf-8")
    (rep / ".claude-plugin").mkdir()
    pl = [{"name": "shared", "source": "./linia/shared"},
          {"name": "skill-a", "source": "./linia/zly" if zly_source else "./linia/skill-a", "dependencies": ["shared"]}]
    (rep / ".claude-plugin" / "marketplace.json").write_text(json.dumps({"name": "t", "owner": {"name": "t"}, "plugins": pl}), encoding="utf-8")
    return root


def selftest():
    przypadki = [("poprawny", {}, 0, None), ("brak plugin.json", {"bez_pj": True}, 1, "A:"),
                 ("wersja plugin.json ≠ SKILL.md", {"zla_wersja": True}, 1, "A:"),
                 ("brak dependencies", {"bez_deps": True}, 1, "B:"), ("zły source", {"zly_source": True}, 1, "C:")]
    ok = True
    for nazwa, kw, oczek, prefiks in przypadki:
        tmp = Path(tempfile.mkdtemp())
        try:
            b, _ = sprawdz(_szkielet(tmp, **kw))
            wynik = 1 if b else 0
            trafny = wynik == oczek and (prefiks is None or any(x.startswith(prefiks) for x in b))
            print(f"  {'✅' if trafny else '❌'} {nazwa}: {'FAIL' if b else 'PASS'}")
            ok &= trafny
        finally:
            shutil.rmtree(tmp)
    print(f"SELFTEST: {'PASS' if ok else 'FAIL'} ({len(przypadki)} przypadków)")
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--repo-root", default=".", help="katalog linii rozwojowej (katalogi skilli)")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if yaml is None:
        print("BŁĄD: brak modułu PyYAML"); return 2
    if a.selftest:
        return selftest()
    root = Path(a.repo_root).resolve()
    if not root.is_dir():
        print(f"BŁĄD: {root} nie istnieje"); return 2
    bledy, ss = sprawdz(root)
    mp = root.parent / ".claude-plugin" / "marketplace.json"
    print(f"T38: skille: {len(ss)}; marketplace.json: {'TAK' if mp.is_file() else 'NIE (kontrola C pominięta)'}")
    for b in bledy:
        print(f"  ❌ {b}")
    print(f"WYNIK: {'FAIL' if bledy else 'PASS'}")
    return 1 if bledy else 0


if __name__ == "__main__":
    sys.exit(main())
