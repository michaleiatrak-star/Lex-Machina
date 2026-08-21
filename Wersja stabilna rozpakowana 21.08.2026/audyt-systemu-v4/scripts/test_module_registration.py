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

ZASADA TESTU: dla KAŻDEGO skilla o strukturze `modules/*.md`, KAŻDY
plik fizycznie obecny na dysku MUSI być wspomniany (po nazwie pliku,
bez rozszerzenia .md) GDZIEŚ w treści SKILL.md tego samego skilla.

Test jest DETERMINISTYCZNY — nie wymaga LLM ani sieci, wyłącznie
analiza plików na dysku (ta sama filozofia co ci_check_shared.py).

Użycie:
    python3 test_module_registration.py [--repo-root /mnt/skills/user] [--quiet]

Kod wyjścia:
    0 — wszystkie moduły zarejestrowane
    1 — znaleziono co najmniej jeden niezarejestrowany moduł
"""

import argparse
import re
import sys
from pathlib import Path

# Skille jawnie WYŁĄCZONE z tego testu — nie mają struktury modules/*.md
# zarejestrowanej w SKILL.md w ten sam sposób (np. shared/ jest biblioteką
# lazy-loaded bez jednego centralnego rejestru — patrz sesja 2026-07-21
# ustalenie przy budowie PORTALE-BRANZOWE-RZAD-2B.md).
SKIP_SKILLS = {"shared", "audyt-systemu-v4"}

# ⚠️ ZNANE OGRANICZENIE HEURYSTYKI (odnotowane 2026-07-21 przy pierwszym
# uruchomieniu tego testu): niektóre skille odwołują się do modułów
# SKRÓCONYMI KODAMI w treści SKILL.md (np. "MD1", "MP0"), zamiast pełną
# nazwą pliku ("MD1-klasyfikacja.md", "MP0-intake.md") — dla TYCH skilli
# prosty test "czy nazwa pliku występuje w tekście" daje FAŁSZYWE
# POZYTYWY (moduł JEST referencjonowany, tylko innym zapisem). Te skille
# WYMAGAJĄ manualnej weryfikacji zamiast automatycznej — NIE wykluczono
# ich całkowicie z testu (żeby nie ukryć PRZYSZŁYCH, prawdziwych braków),
# ale ich wynik NALEŻY interpretować z tym zastrzeżeniem.
KNOWN_ABBREVIATED_NAMING = {
    "analizator-dowodow-v3",  # SKILL.md używa "MD1"/"MP0" itd., nie pełnych nazw
    "pisma-procesowe-v3",     # SKILL.md używa "MOD-ETAPY" jako etykiety w tekście
                              # opisowym, wymaga weryfikacji manualnej czy to
                              # faktyczny brak czy tylko inny format odwołania
}


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

    module_files = sorted(p.stem for p in modules_dir.glob("*.md"))
    missing = []
    for name in module_files:
        # Dopasowanie: `name` NIE poprzedzone i NIE followed przez [\w-]
        pattern = re.compile(
            r"(?<![\w-])" + re.escape(name) + r"(?![\w-])"
        )
        if not pattern.search(skill_text):
            missing.append(name)
    return missing, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    skills = find_skills_with_modules(repo_root)

    total_missing = 0
    total_flagged_for_review = 0
    report_lines = []

    for skill_dir, modules_dir, skill_md in skills:
        missing, err = check_registration(skill_dir, modules_dir, skill_md)
        if err:
            report_lines.append(f"  BŁĄD  {skill_dir.name}: {err}")
            total_missing += 1
            continue
        if missing:
            if skill_dir.name in KNOWN_ABBREVIATED_NAMING:
                report_lines.append(
                    f"  ⚠️ DO WERYFIKACJI MANUALNEJ  {skill_dir.name}: "
                    f"{len(missing)} plików bez DOSŁOWNEGO dopasowania nazwy "
                    f"(ZNANE odwołania skrótowe w tym skillu — SPRAWDŹ RĘCZNIE, "
                    f"nie traktuj automatycznie jako FAIL):"
                )
                total_flagged_for_review += len(missing)
            else:
                report_lines.append(
                    f"  BŁĄD  {skill_dir.name}: {len(missing)} niezarejestrowanych modułów:"
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
        if total_flagged_for_review:
            print(f"UWAGA: {total_flagged_for_review} pozycji oznaczonych do WERYFIKACJI "
                  f"MANUALNEJ (skille z odwołaniami skrótowymi) — NIE liczą się do FAIL.")
        if total_missing:
            print(f"WYNIK T1: FAIL — {total_missing} niezarejestrowanych modułów "
                  f"musi zostać dodanych do SKILL.md.")
        else:
            print("WYNIK T1: OK — brak niezarejestrowanych modułów (poza pozycjami "
                  "do weryfikacji manualnej, jeśli występują).")

    sys.exit(1 if total_missing else 0)


if __name__ == "__main__":
    main()
