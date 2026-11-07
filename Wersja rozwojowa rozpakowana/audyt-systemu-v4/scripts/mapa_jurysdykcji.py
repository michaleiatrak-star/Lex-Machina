#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
E0b migracji prawa polskiego — mapa kategorii treści krajowej (skille wykonawcze, shared, router).

Dla każdego pliku: udział znaków w akapitach z treścią krajową, kategorie (akty i przepisy, terminy,
opłaty, sądy i procedura, wymogi pism, źródła i bazy, organy, zawody, identyfikatory, typy umów,
sygnatury, waluta), klasa (MODUŁ PL ≥ 70% / MIESZANY / METODA < 15%) i klucz JUR: z manifestu,
gdy plik już ma swój klucz. Pomiar regułami słownikowymi — decyzję o przeniesieniu podejmuje
migracja z testem równoważności (T50).

Użycie: mapa_jurysdykcji.py [katalog_skilli] [--inwentarz | --plan [--app=<katalog src aplikacji>] | --migruj [...]]
  --inwentarz: tabela E0 (udział treści PL per skill); --plan: plan migracji per skill wykonawczy;
  --migruj: etap E3 (opis niżej, przy migruj()).
"""
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve()
ARGS = [arg for arg in sys.argv[1:] if not arg.startswith("--")]
ROOT = Path(ARGS[0]) if ARGS else HERE.parents[2]
EXECUTIVE = [
    "analiza-sadowa-v6", "analizator-dowodow-v3", "analizator-przepisow-v2", "analizator-umow-v1",
    "chronologia-sprawy-v1", "orzeczenia-sadowe-v2", "pisma-procesowe-v3", "pisma-proste-v2",
    "przesluchanie-swiadkow-v2-min90", "przewodnik-prawny-v2", "raport-klienta-v1", "raport-sytuacyjny-v2",
]
PL = re.compile(
    r"\b(?:KC|KPC|KP|KK|KPK|KPA|PPSA|KRO|KSH|KSCU|KKW|KPW|KW|KKS|UPEA|PZP|UOKiK|ZUS|KRUS|KRS|CEIDG|ISAP|SAOS|CBOSA|ELI)\b"
    r"|Dz\.\s?U\.|\bart\.\s*\d+[\w¹²³⁴⁵⁶⁷⁸⁹⁰]*(?:\s*§\s*\d+)?\s+(?:k\.\w+\.|[A-Z]{2,5})\b|ustaw[aąyie]\s+z\s+dnia"
)
SKIP = re.compile(r"CHANGELOG|HISTORIA-ZMIAN|CHECKSUMS|PORTABILITY-MANIFEST")


def paragraphs(text):
    blocks, current, fenced = [], [], False
    for line in text.splitlines():
        if line.startswith("```"):
            fenced = not fenced
        if not line.strip() and not fenced:
            if current:
                blocks.append("\n".join(current))
            current = []
        else:
            current.append(line)
    if current:
        blocks.append("\n".join(current))
    return blocks


class inv:  # the E0 inventory's rules, shared by both reports
    EXECUTIVE = EXECUTIVE
    PL = PL
    SKIP = SKIP
    paragraphs = staticmethod(paragraphs)


SCOPE = EXECUTIVE + ["shared", "prawny-router-v3"]
# Plan: 12 skilli wykonawczych, audyt systemu (13.) i shared; dr-* (warstwa prawa polskiego) poza zakresem.
PLAN_SCOPE = EXECUTIVE + ["audyt-systemu-v4", "shared"]
CATEGORIES = {
    "akty i przepisy": r"\bart\.\s*\d+[\w¹²³⁴⁵⁶⁷⁸⁹⁰]*(?:\s*§\s*\d+)?\s+(?:k\.\w+\.|[A-Z]{2,5})\b|Dz\.\s?U\.|\bustaw[aąyie]\s+z\s+dnia",
    "terminy": r"\b\d+\s*(?:dni|tygodni\w*|miesi\w+)\b[^\n]{0,60}\b(?:KPC|KPK|KPA|PPSA|KPW|KP|KC|termin)",
    "opłaty": r"\b(?:KSCU|opłat\w*|wpis\w*\s+(?:stały|stosunkowy)|taks\w*|koszt\w*\s+(?:sądow|zastępstw))",
    "sądy i procedura": r"\b(?:sąd\w*\s+(?:rejonow|okręgow|apelacyjn|pracy|najwyższ)\w*|WSA|NSA|e-Sąd|EPU|Portal Informacyjn\w*|biur\w* podawcz|wydział\w*)",
    "wymogi pism": r"\b(?:braki?\w* formaln|wymog\w* formaln|pozew\w*|apelacj\w*|zażaleni\w*|sprzeciw\w*|skarg\w* kasacyjn|odpowied\w+ na pozew)",
    "źródła i bazy": r"\b(?:ELI|ISAP|SAOS|CBOSA|EUREKA|sn\.pl|orzeczenia\.ms\.gov\.pl|api\.sejm|isap\.sejm|Legalis|LEX\b|dziennikustaw)",
    "organy": r"\b(?:ZUS|KRUS|UOKiK|PIP|UODO|KAS|NFZ|KNF|URE|RPO|prokurat\w*|Policj\w*|urz\w+ skarbow)",
    "zawody": r"\b(?:adwokat\w*|radc\w* prawn|notariusz\w*|komornik\w*|doradc\w* podatkow|rzeczni\w* patentow|OIRP|KIRP|NRA)",
    "identyfikatory": r"\b(?:PESEL|NIP|REGON|KRS|CEIDG|ksi[ęe]g\w* wieczyst|nr KW)\b",
    "typy umów": r"\b(?:umow\w* o pracę|umow\w* zleceni\w*|umow\w* o dzieło|B2B|JDG|najm\w* okazjonaln|deweloper\w*|UUDE|PZP|konsument\w*)",
    "sygnatury": r"\b[IVX]{1,4}\s+(?:C|Ca|ACa|CSK|CSKP|CZP|K|Ka|AKa|U|Pa|APa|P|PK|OSK|FSK|GSK)\s+\d+/\d{2}\b",
    "waluta": r"\b\d[\d\s.,]*\s*(?:zł|PLN)\b|słownie",
}
COMPILED = {name: re.compile(pattern, re.IGNORECASE if name not in ("sygnatury", "źródła i bazy", "identyfikatory") else 0) for name, pattern in CATEGORIES.items()}


def manifest_keys():
    path = ROOT / "prawo-polskie-v2" / "JURYSDYKCJA.md"
    keys = {}
    if path.is_file():
        for line in path.read_text(encoding="utf-8").splitlines():
            match = re.match(r"\|\s*`(JUR:[a-z0-9-]+)`\s*\|\s*`([^`]+)`", line)
            if match:
                keys[match.group(2)] = match.group(1)
    return keys


def inventory():
    rows, files = [], []
    for skill in EXECUTIVE:
        base = ROOT / skill
        total = polish = size = polish_size = 0
        for path in sorted(base.rglob("*.md")):
            if SKIP.search(path.name):
                continue
            blocks = paragraphs(path.read_text(encoding="utf-8"))
            own = [block for block in blocks if PL.search(block)]
            total += len(blocks)
            polish += len(own)
            file_size = sum(len(block) for block in blocks)
            own_size = sum(len(block) for block in own)
            size += file_size
            polish_size += own_size
            if file_size > 1500:
                files.append((own_size / file_size, own_size, f"{skill}/{path.relative_to(base).as_posix()}"))
        rows.append((skill, total, polish, size, polish_size))
    if True:
        print("| Skill | Akapity | z prawem PL | Znaki | udział PL (znaki) |")
        print("|---|---:|---:|---:|---:|")
    for skill, total, polish, size, polish_size in rows:
        share = 100 * polish_size / size if size else 0
        print(f"| {skill} | {total} | {polish} | {size} | {share:.0f}% |")
    print("\nNajwiększy udział treści PL (kandydaci do migracji):")
    for share, own_size, name in sorted(files, reverse=True)[:10]:
        print(f"- {name}: {100 * share:.0f}% ({own_size} znaków)")



def main():
    keys = manifest_keys()
    rows = []
    totals = Counter()
    for skill in SCOPE:
        for path in sorted((ROOT / skill).rglob("*.md")):
            if inv.SKIP.search(path.name):
                continue
            text = path.read_text(encoding="utf-8")
            blocks = inv.paragraphs(text)
            size = sum(map(len, blocks))
            if size < 1500:
                continue
            share = sum(len(block) for block in blocks if inv.PL.search(block)) / size
            counts = Counter({name: len(pattern.findall(text)) for name, pattern in COMPILED.items()})
            counts = +counts
            klass = "MODUŁ PL" if share >= 0.7 else "METODA" if share < 0.15 else "MIESZANY"
            rel = path.relative_to(ROOT).as_posix()
            rows.append((klass, share, rel, counts, keys.get(rel, "")))
            totals.update({klass: 1})
    order = {"MODUŁ PL": 0, "MIESZANY": 1, "METODA": 2}
    print(f"Pliki: {sum(totals.values())} — MODUŁ PL {totals['MODUŁ PL']}, MIESZANY {totals['MIESZANY']}, METODA {totals['METODA']}\n")
    print("| Klasa | Plik | Udział PL | Kategorie (liczba trafień) | Klucz |")
    print("|---|---|---:|---|---|")
    for klass, share, rel, counts, key in sorted(rows, key=lambda row: (order[row[0]], -row[1], row[2])):
        cats = ", ".join(f"{name} {count}" for name, count in counts.most_common(4))
        print(f"| {klass} | `{rel}` | {100 * share:.0f}% | {cats or '—'} | {f'`{key}`' if key else ''} |")


def plan(app_root=None):
    """Plan migracji per skill wykonawczy: co przenieść, co rozdzielić, co zostaje, co w aplikacji."""
    keys = manifest_keys()
    app_refs = {}
    if app_root:
        for path in Path(app_root).rglob("*.ts"):
            if "node_modules" in path.parts or "dist" in path.parts:
                continue
            text = path.read_text(encoding="utf-8", errors="ignore")
            for match in re.finditer(r"([a-z0-9-]+-v\d+(?:-min\d+)?/(?:references|modules|workflows)/[A-Za-z0-9._/-]+\.md)", text):
                app_refs.setdefault(match.group(1), set()).add(path.name)
    for skill in PLAN_SCOPE:
        rows = []
        for path in sorted((ROOT / skill).rglob("*.md")):
            if SKIP.search(path.name):
                continue
            blocks = paragraphs(path.read_text(encoding="utf-8"))
            size = sum(map(len, blocks))
            if size < 400:
                continue
            share = sum(len(block) for block in blocks if PL.search(block)) / size
            rows.append((share, path.relative_to(ROOT).as_posix(), size))
        move = [row for row in rows if row[0] >= 0.7]
        split = [row for row in rows if 0.15 <= row[0] < 0.7]
        stay = [row for row in rows if row[0] < 0.15]
        print(f"### {skill}\n")
        print(f"Pliki: {len(rows)} — przenieść {len(move)}, rozdzielić {len(split)}, metoda {len(stay)}.\n")
        if move:
            print("Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):")
            for share, rel, size in sorted(move, reverse=True):
                print(f"- `{rel}` ({100 * share:.0f}%, {size} zn.){' — `' + keys[rel] + '`' if rel in keys else ''}")
            print()
        if split:
            print("Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):")
            for share, rel, size in sorted(split, reverse=True)[:12]:
                print(f"- `{rel}` ({100 * share:.0f}%)")
            if len(split) > 12:
                print(f"- … i {len(split) - 12} dalszych (udział < {100 * sorted(split, reverse=True)[12][0]:.0f}%)")
            print()
        used = sorted({f"`{rel}` ← {', '.join(sorted(app_refs[rel]))}" for _, rel, _ in rows if rel in app_refs})
        if used:
            print("Aplikacja (E4 — ścieżka zmienia się na klucz):")
            for item in used:
                print(f"- {item}")
            print()


# ---------------------------------------------------------------------------------------------
# E3 — --migruj
"""
migruj_jurysdykcje.py — etap E3 migracji prawa krajowego (wzór dla każdej jurysdykcji)

Moduł prawa krajowego, który dziś leży w skillu wykonawczym albo w shared, przechodzi do pakietu
jurysdykcji; skill wykonawczy wskazuje go kluczem `JUR:<klucz>` (jak pilot MD5-terminy).

KROKI (dla każdego klucza z manifestu, którego moduł leży w skillu wykonawczym)
  1. plik → <pakiet>/krajowe/<skill>/<ścieżka w skillu>; wiersz manifestu wskazuje nowe miejsce;
  2. odwołania do pliku w skillach wykonawczych, shared, audycie i w samym pakiecie → `JUR:<klucz>`
     (`view references/x.md` → `view JUR:<klucz>`, `x.md` → `JUR:<klucz>`);
  3. warstwa prawa krajowego (dr-*, pakiet, moduły z manifestu), audyt i pliki inne niż .md:
     treść bez zmian, tylko ścieżka przechodzi na nowe miejsce; skille z listy --bez-zmian
     nie są dotykane;
  4. odwołania względne w przeniesionym pliku do plików, które zostały w skillu
     (`references/y.md`), dostają nazwę skilla (`<skill>/references/y.md`).
  Historia (AUDIT-JOURNAL, CHANGELOG, CHECKSUMS, migracja-jurysdykcji/, ZIP) zostaje bez zmian.

Użycie:
  migruj_jurysdykcje.py [katalog_skilli] [--pakiet=prawo-polskie-v2] [--klucz=JUR:a,JUR:b]
                        [--bez-zmian=<skill,...>] [--wykonaj]
  Bez --wykonaj: tylko plan (co, dokąd, ile odwołań w których skillach).
"""
WYKONAWCZE = {
    "analiza-sadowa-v6", "analizator-dowodow-v3", "analizator-przepisow-v2", "analizator-umow-v1",
    "chronologia-sprawy-v1", "orzeczenia-sadowe-v2", "pisma-procesowe-v3", "pisma-proste-v2",
    "przesluchanie-swiadkow-v2-min90", "przewodnik-prawny-v2", "raport-klienta-v1", "raport-sytuacyjny-v2",
}
HISTORIA = re.compile(r"(AUDIT-JOURNAL|CHANGELOG|HISTORIA-ZMIAN)", re.I)
TEKST = {".md", ".json", ".py", ".txt", ".yaml", ".yml", ".tsv"}
WZGLEDNE = ("references/", "modules/", "checklists/", "templates/", "assets/", "generator/", "agents/", "widgets/")


def argumenty_migracji():
    root, opts = None, {}
    for arg in sys.argv[1:]:
        if arg.startswith("--"):
            name, _, value = arg[2:].partition("=")
            opts[name] = value or True
        else:
            root = Path(arg)
    return (root or HERE.parents[2]).resolve(), opts


def manifest_wiersze(path):
    rows = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"\|\s*`(JUR:[a-z0-9-]+)`\s*\|\s*`([^`]+)`\s*\|", line)
        if match:
            rows[match.group(1)] = match.group(2)
    return rows


def pliki(root):
    for path in root.rglob("*"):
        if path.is_file() and path.suffix in TEKST and "__pycache__" not in path.parts:
            yield path


def wzorzec(stara):
    """Token ścieżki kończący się nazwą pliku; prefiks musi być sufiksem prawdziwej ścieżki."""
    nazwa = re.escape(Path(stara).name)
    return re.compile(r"(?<![\w/.\-])((?:/mnt/skills/user/)?(?:[\w.\-]+/)*)" + nazwa + r"(?![\w.\-])")


def zgodny(prefiks, stara, plik_skill, skill_modulu, unikalna):
    prefiks = prefiks.removeprefix("/mnt/skills/user/")  # ścieżka bezwzględna środowiska skilli
    pelna = prefiks + Path(stara).name
    if not stara.endswith(pelna):
        return False
    # Sama nazwa albo ścieżka względna skilla: tylko gdy nazwa jest jednoznaczna w korpusie
    # albo odwołanie stoi w tym samym skillu.
    if not prefiks.split("/", 1)[0] == skill_modulu:
        return unikalna or plik_skill == skill_modulu
    return True


def migruj():
    root, opts = argumenty_migracji()
    pakiet = opts.get("pakiet", "prawo-polskie-v2")
    bez_zmian = set(str(opts.get("bez-zmian", "")).split(",")) - {""}
    wybrane = set(str(opts["klucz"]).split(",")) if "klucz" in opts else None
    wykonaj = bool(opts.get("wykonaj"))
    plik_manifestu = root / pakiet / "JURYSDYKCJA.md"
    rows = manifest_wiersze(plik_manifestu)
    nazwy = {}
    for path in pliki(root):
        nazwy[path.name] = nazwy.get(path.name, 0) + 1

    ruchy = []
    for key, module in rows.items():
        skill = module.split("/", 1)[0]
        # Skille wykonawcze i shared; agenci wtyczki zostają w agents/ (konwencja wykrywania).
        if (skill not in WYKONAWCZE and skill != "shared") or "/agents/" in module or (wybrane and key not in wybrane):
            continue
        if not (root / module).is_file():
            print(f"✗ {key}: brak {module}")
            return 1
        ruchy.append((key, module, f"{pakiet}/krajowe/{module}"))

    korpus = {path: path.read_text(encoding="utf-8") for path in pliki(root)}
    moduly_pl = set(rows.values())
    zmiany = {}
    kod = {}
    for key, stara, nowa in ruchy:
        skill_modulu = stara.split("/", 1)[0]
        wz = wzorzec(stara)
        unikalna = nazwy.get(Path(stara).name, 0) == 1
        for path, text in list(korpus.items()):
            rel = path.relative_to(root).as_posix()
            plik_skill = rel.split("/", 1)[0]
            if (plik_skill in bez_zmian or HISTORIA.search(path.name) or "migracja-jurysdykcji" in rel
                    or path == plik_manifestu or path.name == "CHECKSUMS.sha256"):
                continue
            if path.suffix in (".py", ".ts", ".js"):
                # Kod składa ścieżki z części: poprawka ręczna, z testem — tylko raport.
                if wz.search(text):
                    kod.setdefault(rel, set()).add(key)
                continue
            # Ścieżka zamiast klucza: warstwa prawa krajowego (dr-*, pakiet, moduły z manifestu),
            # audyt (rejestry i kontrole czytają ścieżki) i pliki inne niż .md (kod testów).
            dziedzinowy = (plik_skill.startswith("dr-") or plik_skill in (pakiet, "audyt-systemu-v4")
                           or path.suffix != ".md" or rel in moduly_pl)

            def podmien(match):
                if not zgodny(match.group(1), stara, plik_skill, skill_modulu, unikalna):
                    return match.group(0)
                return nowa if dziedzinowy else key

            nowy = wz.sub(podmien, text)
            if nowy != text:
                korpus[path] = nowy
                zmiany.setdefault(rel, set()).add(key)

    print(f"Pakiet: {pakiet}; moduły do przeniesienia: {len(ruchy)}; pliki z odwołaniami: {len(zmiany)}")
    for key, stara, nowa in ruchy:
        print(f"  {key}: {stara} → {nowa}")
    for rel in sorted(zmiany):
        print(f"  odwołania: {rel} ({len(zmiany[rel])})")
    for rel in sorted(kod):
        print(f"  KOD (ręcznie): {rel} ({', '.join(sorted(kod[rel]))})")
    if not wykonaj:
        print("PLAN (bez --wykonaj nic nie zmieniono)")
        return 0

    for path, text in korpus.items():
        if path.relative_to(root).as_posix() in zmiany:
            path.write_text(text, encoding="utf-8")
    manifest_text = plik_manifestu.read_text(encoding="utf-8")
    for key, stara, nowa in ruchy:
        src, dst = root / stara, root / nowa
        dst.parent.mkdir(parents=True, exist_ok=True)
        text = src.read_text(encoding="utf-8")
        skill = stara.split("/", 1)[0]
        # Odwołania względne do plików, które zostały w skillu wykonawczym.
        text = re.sub(
            r"(?<![\w/.\-])((?:" + "|".join(map(re.escape, WZGLEDNE)) + r")[\w./\-]+\.md)",
            lambda m: f"{skill}/{m.group(1)}" if (root / skill / m.group(1)).is_file() else m.group(1),
            text,
        )
        dst.write_text(text, encoding="utf-8")
        src.unlink()
        manifest_text = manifest_text.replace(f"| `{key}` | `{stara}` |", f"| `{key}` | `{nowa}` |")
    plik_manifestu.write_text(manifest_text, encoding="utf-8")
    print("WYKONANO")
    return 0




if __name__ == "__main__":
    if "--migruj" in sys.argv:
        sys.exit(migruj())
    if "--plan" in sys.argv:
        app = next((arg.split("=", 1)[1] for arg in sys.argv if arg.startswith("--app=")), None)
        plan(app)
        sys.exit(0)
    inventory() if "--inwentarz" in sys.argv else main()
