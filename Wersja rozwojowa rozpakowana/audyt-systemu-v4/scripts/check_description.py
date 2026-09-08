#!/usr/bin/env python3
"""
check_description.py — TEST T14: obecność i długość pola `description:` w SKILL.md.

Kontroluje dla każdego SKILL.md:
  1. czy plik ma frontmatter YAML                      → brak = ⛔
  2. czy frontmatter zawiera pole `description:`      → brak = ⛔
  3. czy pole nie jest puste                          → puste = ⛔
  4. długość treści w profilu wspólnym Claude+ChatGPT:
       >200 = ⛔, 181–200 = ⚠️, ≤180 = OK.

Limit 200 jest celowo konserwatywnym wspólnym mianownikiem dla jednego,
identycznego ZIP-a używanego na obu platformach. Test mierzy obecność i długość,
nie jakość opisu ani skuteczność triggerowania.

Użycie:
    python3 check_description.py [katalog_ze_skillami]

Kod wyjścia: 0 = brak problemów, 1 = wykryto ⛔ lub ⚠️.
"""
import os
import re
import sys
from pathlib import Path

LIMIT_CRIT = 200
LIMIT_WARN = 180


def domyslny_katalog():
    """Preferuj jawny root; bez niego spróbuj wykryć repo względem skryptu."""
    env = os.environ.get("LEX_MACHINA_ROOT") or os.environ.get("REPO_ROOT")
    if env:
        return env
    tutaj = Path(__file__).resolve()
    kandydat = tutaj.parents[2]
    return str(kandydat)


def frontmatter(tresc):
    if not tresc.startswith("---"):
        return None
    czesci = tresc.split("---", 2)
    return czesci[1] if len(czesci) >= 3 else None


def wytnij_description(fm):
    m = re.search(r"^description:[ \t]*([|>][-+]?)?[ \t]*(.*)$", fm, re.M)
    if not m:
        return None
    inline = m.group(2).strip().strip('"').strip("'")
    reszta = fm[m.end():]
    blok = []
    for linia in reszta.split("\n"):
        if linia.strip() == "":
            blok.append("")
            continue
        if re.match(r"^[ \t]", linia):
            blok.append(linia.strip())
        else:
            break
    return " ".join(x for x in ([inline] + blok) if x).strip()


def sprawdz(sciezka_skilla):
    nazwa = os.path.basename(sciezka_skilla)
    plik = os.path.join(sciezka_skilla, "SKILL.md")
    if not os.path.isfile(plik):
        return []
    tresc = open(plik, encoding="utf-8", errors="replace").read()
    fm = frontmatter(tresc)
    if fm is None:
        return [(nazwa, "⛔ BRAK FRONTMATTERA — pole description nie ma gdzie istnieć.")]
    opis = wytnij_description(fm)
    if opis is None:
        return [(nazwa, "⛔ BRAK POLA `description:` we frontmatterze.")]
    if not opis:
        return [(nazwa, "⛔ POLE `description:` PUSTE.")]
    n = len(opis)
    if n > LIMIT_CRIT:
        return [(nazwa, f"⛔ DŁUGOŚĆ {n} znaków > {LIMIT_CRIT} — przekracza profil uniwersalny Claude+ChatGPT.")]
    if n > LIMIT_WARN:
        return [(nazwa, f"⚠️ DŁUGOŚĆ {n} znaków — blisko limitu {LIMIT_CRIT}; zalecany zapas.")]
    return []


def main(baza):
    if not os.path.isdir(baza):
        print(f"BŁĄD: katalog repo nie istnieje: {baza}")
        return 2
    wyniki = []
    zbadane = 0
    for wpis in sorted(os.listdir(baza)):
        sciezka = os.path.join(baza, wpis)
        if os.path.isdir(sciezka) and os.path.isfile(os.path.join(sciezka, "SKILL.md")):
            zbadane += 1
            wyniki.extend(sprawdz(sciezka))

    print("=" * 72)
    print("TEST T14 — description: obecność + profil uniwersalny ≤200 znaków")
    print(f"Katalog: {baza}   |   zbadanych skilli: {zbadane}")
    print("=" * 72)
    if not wyniki:
        print("\n✅ Każdy skill ma niepuste description w profilu uniwersalnym.")
        return 0
    biezacy = None
    for nazwa, problem in wyniki:
        if nazwa != biezacy:
            print(f"\n--- {nazwa} ---")
            biezacy = nazwa
        print(f"  {problem}")
    kryt = sum(1 for _, p in wyniki if p.startswith("⛔"))
    ostrz = sum(1 for _, p in wyniki if p.startswith("⚠️"))
    print(f"\n{'-' * 72}")
    print(f"RAZEM: {len(wyniki)} — ⛔ {kryt}, ⚠️ {ostrz}.")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else domyslny_katalog()))
