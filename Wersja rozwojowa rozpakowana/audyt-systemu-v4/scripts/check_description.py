#!/usr/bin/env python3
"""
check_description.py — TEST T14: obecność i długość pola `description:` w SKILL.md.

Powstał 2026-08-24 (flaga F-130), po wykryciu, że `audyt-systemu-v4` był JEDYNYM
skillem w całym systemie bez pola `description:` — i że istniejąca kontrola
(FAZA 2C, modules/MOD-DESCRIPTION.md) nie mogła tego zobaczyć z powodu wady
konstrukcyjnej: jej skrypt dla pliku bez pola wypisywał `0` i klasyfikował wynik
jako ✅ OK. Brak pola, stan najgorszy z możliwych, raportowany był jako najzdrowszy.

Dlaczego to nie jest usterka kosmetyczna: `description` jest polem, na podstawie
którego skill jest WYBIERANY do wywołania. Skill bez niego leży na dysku i może
nigdy nie zostać uruchomiony automatycznie — a wykryć to można wyłącznie przez
nieobecność wywołań, czyli praktycznie nigdy.

Kontroluje dla każdego SKILL.md:
  1. czy plik ma frontmatter YAML                      → brak = ⛔
  2. czy frontmatter zawiera pole `description:`        → brak = ⛔ (F-130)
  3. czy pole nie jest puste ani samym białym znakiem   → puste = ⛔
  4. długość treści: >1024 = ⛔, 901–1024 = ⚠️, ≤900 = OK

⚠️ OGRANICZENIE, JAWNE: test mierzy OBECNOŚĆ i DŁUGOŚĆ, nie JAKOŚĆ opisu.
Description obecny, ale nietrafnie opisujący skill, przejdzie ten test i nadal
będzie powodował złe wyzwalanie. Na to nie ma automatu — patrz F-113
(test skuteczności z grupą kontrolną).

Użycie:
    python3 check_description.py [katalog_ze_skillami]

Kod wyjścia: 0 = brak problemów, 1 = wykryto ⛔ lub ⚠️.
"""
import os
import re
import sys

DOMYSLNY_KATALOG = "/mnt/skills/user"
LIMIT_CRIT = 1024
LIMIT_WARN = 900


def frontmatter(tresc):
    """Zwraca surowy blok YAML między pierwszą a drugą linią '---', albo None."""
    if not tresc.startswith("---"):
        return None
    czesci = tresc.split("---", 2)
    return czesci[1] if len(czesci) >= 3 else None


def wytnij_description(fm):
    """Zwraca treść description bez składni YAML, albo None gdy pola brak.

    Obsługuje trzy formy zapisu spotykane w tym systemie:
      description: tekst w jednej linii
      description: | (albo >, >-, |-)  + wcięty blok
      description: >-  + wcięty blok
    """
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
    tekst = " ".join(x for x in ([inline] + blok) if x).strip()
    return tekst


def sprawdz(sciezka_skilla):
    nazwa = os.path.basename(sciezka_skilla)
    plik = os.path.join(sciezka_skilla, "SKILL.md")
    if not os.path.isfile(plik):
        return []
    tresc = open(plik, encoding="utf-8", errors="replace").read()
    fm = frontmatter(tresc)
    if fm is None:
        return [(nazwa, "⛔ BRAK FRONTMATTERA: plik nie zaczyna się blokiem YAML "
                        "'---' — pole description nie ma gdzie istnieć.")]
    opis = wytnij_description(fm)
    if opis is None:
        return [(nazwa, "⛔ BRAK POLA `description:` we frontmatterze (F-130). "
                        "Skill jest wybierany do wywołania na podstawie tego pola — "
                        "bez niego może nigdy nie zostać uruchomiony automatycznie, "
                        "a objawem jest CISZA, nie błąd.")]
    if not opis:
        return [(nazwa, "⛔ POLE `description:` PUSTE — skutek identyczny jak brak pola.")]
    n = len(opis)
    if n > LIMIT_CRIT:
        return [(nazwa, f"⛔ DŁUGOŚĆ {n} znaków > {LIMIT_CRIT} — description zostanie "
                        f"obcięty w UI bez ostrzeżenia. Skróć.")]
    if n > LIMIT_WARN:
        return [(nazwa, f"⚠️ DŁUGOŚĆ {n} znaków — w przedziale {LIMIT_WARN + 1}–{LIMIT_CRIT}, "
                        f"blisko twardego limitu. Zalecane skrócenie zapasowo.")]
    return []


def main(baza):
    wyniki = []
    zbadane = 0
    for wpis in sorted(os.listdir(baza)):
        sciezka = os.path.join(baza, wpis)
        if os.path.isdir(sciezka) and os.path.isfile(os.path.join(sciezka, "SKILL.md")):
            zbadane += 1
            wyniki.extend(sprawdz(sciezka))

    print("=" * 72)
    print("TEST T14 — POLE description W SKILL.md (obecność + długość)")
    print(f"Katalog: {baza}   |   zbadanych skilli: {zbadane}")
    print("=" * 72)
    if not wyniki:
        print("\n✅ Każdy skill ma niepuste pole `description:` w limicie długości.")
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
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else DOMYSLNY_KATALOG))
