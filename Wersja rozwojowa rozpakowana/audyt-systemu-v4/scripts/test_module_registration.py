#!/usr/bin/env python3
"""
test_module_registration.py — Test regresyjny T1: kompletność rejestracji modułów.

WERSJA: 1.1 (2026-07-21) — naprawiono ryzyko fałszywego negatywu przy
nazwach-podciągach (patrz docstring funkcji check_registration niżej).

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  Audyt 2026-07-21o (AUDIT-JOURNAL.md) — DR-03 miało FIZYCZNIE 52 pliki
  w modules/, ale TYLKO 37 było zarejestrowanych w SKILL.md. 15 modułów
  zbudowanych 2026-07-16/18 nigdy nie trafiło do rejestru. Analogiczny,
  mniejszy przypadek: mod-KK-art233-244b (jeden plik, sesja 2026-07-20).

ZASADA TESTU: dla KAŻDEGO skilla z katalogiem `modules/`, KAŻDY plik .md
w `modules/**` (także podkatalogi i nazwy bez `mod-`) MUSI być zarejestrowany:
nazwą w SKILL.md, kodem (MD1, MP12) w SKILL.md, gdy kod nosi jeden plik, albo
nazwą w pliku wskazanym z SKILL.md (rejestr modułów, moduł nadrzędny części).

Test jest DETERMINISTYCZNY — nie wymaga LLM ani sieci, wyłącznie
analiza plików na dysku (ta sama filozofia co ci_check_shared.py).

Użycie:
    python3 test_module_registration.py [--repo-root SKILLS_ROOT] [--quiet]

Kod wyjścia:
    0 — wszystkie moduły zarejestrowane
    1 — znaleziono co najmniej jeden niezarejestrowany moduł
"""

import argparse
import collections
import os
import re
import sys
from pathlib import Path

from _lex_common import HIST, module_files

# Skille jawnie WYŁĄCZONE z tego testu — nie mają struktury modules/*.md
# zarejestrowanej w SKILL.md w ten sam sposób (np. shared/ jest biblioteką
# lazy-loaded bez jednego centralnego rejestru — patrz sesja 2026-07-21
# ustalenie przy budowie PORTALE-BRANZOWE-RZAD-2B.md).
SKIP_SKILLS = {"shared", "audyt-systemu-v4"}

# 2026-10-10 (audyt mutacyjny): zbiór KNOWN_ABBREVIATED_NAMING zwalniał
# analizator-dowodow-v3 i pisma-procesowe-v3 z FAIL na stałe („26 pozycji do weryfikacji
# manualnej”), więc dowolny nowy moduł w tych skillach przechodził. Zastąpiony regułami
# rejestracji (patrz check_registration): kod modułu (MD1, MP12, MD-NARR) w SKILL.md,
# gdy nosi go jeden plik, oraz wzmianka w pliku wskazanym z SKILL.md (rejestr modułów,
# moduł nadrzędny podkatalogu). Te same reguły obejmują podkatalogi modules/**.
MODULE_CODE = re.compile(r"^(M[DPX]\d*[a-z]?(?:-NARR)?)-")
TOK = re.compile(r"[A-Za-z0-9_\-\./]+\.md")


def token_re(name: str):
    """Nazwa jako cały token: nie poprzedzona i nie followed przez [\\w-]."""
    return re.compile(r"(?<![\w-])" + re.escape(name) + r"(?![\w-])")


def semantic_skill_name(skill_dir: Path) -> str:
    try:
        head = (skill_dir / "SKILL.md").read_text(encoding="utf-8", errors="strict")[:4000]
    except OSError:
        return skill_dir.name
    match = re.search(r"^name:\s*['\"]?([^'\"\n]+)", head, re.MULTILINE)
    return match.group(1).strip() if match else skill_dir.name


def find_skills_with_modules(repo_root: Path):
    """Znajdź wszystkie skille posiadające katalog modules/ i plik SKILL.md."""
    result = []
    for skill_dir in sorted(repo_root.iterdir()):
        if not skill_dir.is_dir() or skill_dir.name in SKIP_SKILLS:
            continue
        modules_dir = skill_dir / "modules"
        skill_md = skill_dir / "SKILL.md"
        if modules_dir.is_dir() and skill_md.exists():
            result.append((skill_dir, modules_dir, skill_md))
    return result


def check_registration(skill_dir: Path, modules_dir: Path, skill_md: Path):
    """Zwraca listę nazw modułów (bez .md) NIEOBECNYCH w treści SKILL.md.

    ⚠️ POPRAWKA 2026-07-21 (znaleziona przy PONOWNYM przeglądzie T1 na
    żądanie użytkownika "zbadaj działanie T1"): pierwotna wersja
    używała NAIWNEGO sprawdzenia podciągu (`name in skill_text`), co
    dawało TEORETYCZNE ryzyko FAŁSZYWEGO NEGATYWU (test milcząco
    PRZECHODZI, mimo braku rejestracji), gdy nazwa KRÓTSZEGO modułu
    jest DOSŁOWNYM podciągiem nazwy DŁUŻSZEGO (np. istnieje PLIK
    "mod-ustawa-cudzoziemcy.md" ORAZ "mod-ustawa-cudzoziemcy-
    zatrudnianie.md" — gdyby SKILL.md wspominał WYŁĄCZNIE tę drugą, a
    NIE pierwszą osobno, sprawdzenie podciągu BŁĘDNIE uznałoby
    pierwszą za "zarejestrowaną", bo jej nazwa WYSTĘPUJE jako
    fragment tekstu drugiej). POTWIERDZONO przeszukaniem CAŁEGO
    systemu: 2 PARY nazw o tej własności ISTNIEJĄ (dr-05: mod-ustawa-
    cudzoziemcy / -zatrudnianie; dr-09: mod-POS-prawo-ochrony-
    srodowiska / -szczegoly) — W OBU przypadkach OBIE nazwy SĄ
    obecnie jawnie, osobno zarejestrowane (żaden aktywny błąd NIE
    został znaleziony), ALE ryzyko było REALNE i wymagało naprawy
    PRZED wystąpieniem faktycznej regresji, nie PO.

    NAPRAWIONA metoda: wymaga, by nazwa modułu WYSTĘPOWAŁA w tekście
    NIE bezpośrednio poprzedzona/followed przez dodatkowy znak
    słowotwórczy (litera/cyfra/myślnik) — tzw. dopasowanie z GRANICĄ
    SŁOWA, analogicznie do `\\b` w wyrażeniach regularnych, ale
    dostosowane do faktu że myślnik ("-") jest CZĘŚCIĄ nazw modułów
    (standardowe `\\b` w Pythonie NIE traktuje myślnika jako granicy
    słowa, więc użyto jawnego wykluczenia znaków [\\w-] po obu
    stronach dopasowania)."""
    try:
        skill_text = skill_md.read_text(encoding="utf-8", errors="strict")
    except Exception as e:
        return None, f"BŁĄD ODCZYTU SKILL.md: {e}"

    rels = module_files(skill_dir)          # modules/**, także bez prefiksu mod-
    stem = lambda rel: os.path.splitext(os.path.basename(rel))[0]
    codes = collections.Counter(
        MODULE_CODE.match(stem(r)).group(1) for r in rels if MODULE_CODE.match(stem(r)))

    # Pliki „o jeden krok” od SKILL.md: wskazane ścieżką (rejestr modułów, np.
    # references/MODULY-MAPA.md) oraz moduły z modules/ zarejestrowane nazwą (moduł
    # nadrzędny rejestruje swoje części w podkatalogu). Pliki historii się nie liczą.
    hop = set()
    for t in set(TOK.findall(skill_text)):
        t2 = t.lstrip("./")
        if t2.startswith(skill_dir.name + "/"):
            t2 = t2[len(skill_dir.name) + 1:]
        if (skill_dir / t2).is_file() and not HIST.search(t2):
            hop.add(t2)
    for rel in rels:
        if "/" not in rel and token_re(stem(rel)).search(skill_text):
            hop.add("modules/" + rel)
    hop_text = {h: (skill_dir / h).read_text(encoding="utf-8", errors="replace") for h in sorted(hop)}

    missing = []
    for rel in rels:
        name = stem(rel)
        if token_re(name).search(skill_text):
            continue
        m = MODULE_CODE.match(name)
        if m and codes[m.group(1)] == 1 and re.search(
                r"(?<![\w-])" + re.escape(m.group(1)) + r"(?!\w)", skill_text):
            continue
        pat = token_re(name)
        if any(pat.search(t) for h, t in hop_text.items() if h != "modules/" + rel):
            continue
        missing.append(rel[:-3])
    return missing, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.environ.get("LEX_MACHINA_SKILLS_ROOT", "."))
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    skills = find_skills_with_modules(repo_root)

    total_missing = 0
    report_lines = []

    for skill_dir, modules_dir, skill_md in skills:
        skill_name = semantic_skill_name(skill_dir)
        missing, err = check_registration(skill_dir, modules_dir, skill_md)
        if err:
            report_lines.append(f"  BŁĄD  {skill_name}: {err}")
            total_missing += 1
            continue
        if missing:
            report_lines.append(
                f"  BŁĄD  {skill_name}: {len(missing)} niezarejestrowanych modułów:"
            )
            total_missing += len(missing)
            for name in missing:
                report_lines.append(f"        - {name}.md")

    if not args.quiet:
        print(f"test_module_registration.py — {len(skills)} skilli sprawdzonych "
              f"(pominięto: {', '.join(sorted(SKIP_SKILLS))})\n")
        if report_lines:
            print("\n".join(report_lines))
        else:
            print("  Wszystkie moduły są zarejestrowane w odpowiadających SKILL.md.")
        print()
        if total_missing:
            print(f"WYNIK T1: FAIL — {total_missing} niezarejestrowanych modułów "
                  f"musi zostać dodanych do SKILL.md.")
        else:
            print("WYNIK T1: OK — brak niezarejestrowanych modułów.")

    sys.exit(1 if total_missing else 0)


if __name__ == "__main__":
    main()
