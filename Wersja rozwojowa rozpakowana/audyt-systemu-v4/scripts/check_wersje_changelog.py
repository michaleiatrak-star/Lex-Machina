#!/usr/bin/env python3
"""
check_wersje_changelog.py — TEST T12: zgodność metadanych wersji skilla.

Powstał 2026-08-20z, po tym jak ten sam wzorzec rozjazdu wykryto w JEDNEJ
sesji w TRZECH skillach z trzech różnych rodzin:
  - przesluchanie-swiadkow-v2-min90: version 3.22, changelog kończy się na 3.19
    (3.20-3.22 bez wpisu GDZIEKOLWIEK — historia nie do odtworzenia),
  - analizator-dowodow-v3: version 5.16.1, pole `changelog` mówi 5.15.0,
    nagłówek H1 mówi „v5.1" — TRZY różne numery w jednym pliku,
  - audyt-systemu-v4: stopka „Wersja: 5.0" przy version 6.8 (rozjazd 9 wersji).
Trzy niezależne wystąpienia = wzorzec, nie incydent. Naprawa ręczna czwarty raz
byłaby droższa niż ten test.

Kontroluje CZTERY nośniki numeru wersji w każdym skillu:
  1. pole `version:` we frontmatterze YAML          (źródło prawdy)
  2. najwyższy numer wpisu w references/CHANGELOG.md LUB w sekcji
     `## CHANGELOG` wewnątrz SKILL.md — brany jest WYŻSZY z obu
  3. numer deklarowany w polu `changelog:` YAML     (jeśli występuje)
  4. numer w nagłówku H1 i w stopce SKILL.md        (jeśli występuje)

Kontroluje też LOKALIZACJĘ historii (standard 2026-08-20z4): wpisy wersji mają
mieszkać wyłącznie w `references/CHANGELOG.md`. Sekcja `## CHANGELOG` w korpusie
SKILL.md zawierająca wpisy = ⛔; pole `changelog:` w YAML dłuższe niż 15 linii = ⚠️.
Powód: rozproszenie historii między trzy lokalizacje było bezpośrednią przyczyną
fałszywych wyników tego testu w sesji 2026-08-20z3 (szukał w references/, wpisy
leżały w SKILL.md, raportował nieistniejące luki).

Wykrywa dodatkowo PUŁAPKĘ FLOAT: niecytowane `version: 6.10` YAML parsuje jako
float 6.1 — numer NIŻSZY niż 6.9, co cicho odwraca porządek wersji. Problem
nie istnieje przy jednocyfrowym minor, więc pojawia się dopiero przy przejściu
X.9 → X.10 i łatwo go przeoczyć. Wykryty przypadkiem 2026-08-20z przy kontroli
parsowalności frontmatterów audyt-systemu-v4.

⚠️ ZNANE OGRANICZENIE — wynik WYMAGA PRZEGLĄDU RĘCZNEGO.
Skille mają różne konwencje changelogów: niektóre numerują wpisy jako
„**6.9 (data)**", inne jako „- 5.15.0 (data)", jeszcze inne „## v3.15".
Parser obsługuje te trzy formaty, ale skill o formacie nietypowym zgłosi
BRAK-CHANGELOGU zamiast realnej niezgodności. Brak pliku references/CHANGELOG.md
NIE jest błędem — wiele skilli trzyma historię wyłącznie w polu YAML.

Kod wyjścia: 0 = brak rozbieżności, 1 = wykryto rozbieżności.

Użycie:
    python3 check_wersje_changelog.py [katalog_ze_skillami] [--profilaktyka]

Klasyfikacja wyników:
  ⛔ czynny rozjazd  — rejestry podają RÓŻNE numery albo brakuje opisu zmian
  ⚠️ ryzyko utajone  — plik działa, ale typ YAML odwraca porządek wersji
  ℹ️ profilaktyka     — jeszcze nic złego, zapobiegnie przyszłej pułapce (--profilaktyka)
"""
import os
import re
import sys

DOMYSLNY_KATALOG = "/mnt/skills/user"

# --- formaty numeracji wpisów changelogu spotykane w systemie ---
WZORCE_WPISU = [
    re.compile(r"^\*\*v?(\d+\.\d+(?:\.\d+)?)\s*\("),      # **6.9 (2026-08-20)**
    re.compile(r"^-\s+\*?\*?v?(\d+\.\d+(?:\.\d+)?)\s*[\(,—-]"),  # - 5.15.0 (data)
    re.compile(r"^##+\s+v?(\d+\.\d+(?:\.\d+)?)\b"),        # ## v3.15
]


def klucz(numer):
    """Porównywalny klucz wersji: '6.10' > '6.9' (odwrotnie niż przy float)."""
    return tuple(int(x) for x in numer.split("."))


def czytaj_frontmatter(tresc):
    if not tresc.startswith("---"):
        return None
    koniec = tresc.find("\n---", 3)
    return tresc[3:koniec] if koniec > 0 else None


def numer_z_yaml(fm):
    m = re.search(r"^version:\s*(.+)$", fm, re.M)
    if not m:
        return None, False
    surowy = m.group(1).split("#")[0].strip()
    cytowany = surowy.startswith(('"', "'"))
    return surowy.strip("\"'"), cytowany


def najwyzszy_z_tekstu(tekst):
    """Najwyższy numer wpisu w dowolnym tekście changelogu."""
    znalezione = []
    for linia in tekst.splitlines():
        for wzor in WZORCE_WPISU:
            m = wzor.match(linia.strip().lstrip("> "))
            if m:
                znalezione.append(m.group(1))
                break
    if not znalezione:
        return None
    return max(znalezione, key=klucz)


def najwyzszy_z_changelogu(katalog, tresc_skill):
    """Najwyższy numer wpisu z OBU możliwych lokalizacji historii.

    ⚠️ Pierwsza wersja testu czytała wyłącznie references/CHANGELOG.md i przez
    to zgłosiła FAŁSZYWĄ „lukę historii" w pisma-procesowe-v3 (version 5.17 vs
    changelog 5.10) — podczas gdy wpisy 5.12-5.15 istniały, tylko w sekcji
    `## CHANGELOG` wewnątrz SKILL.md, a do references/ wyniesiono jedynie
    starszą część (5.7-5.11). To udokumentowany, dopuszczalny wzorzec w tym
    systemie: nowsze wpisy w SKILL.md jako kontekst bieżący, starsze wyniesione.
    Wykryte 2026-08-20z3 przy realizacji F-102.
    """
    kandydaci = []
    plik = os.path.join(katalog, "references", "CHANGELOG.md")
    if os.path.exists(plik):
        w = najwyzszy_z_tekstu(open(plik, encoding="utf-8", errors="replace").read())
        if w:
            kandydaci.append(w)
    m = re.search(r"^##\s*CHANGELOG\b(.*?)(?=^##\s|\Z)", tresc_skill, re.M | re.S)
    if m:
        w = najwyzszy_z_tekstu(m.group(1))
        if w:
            kandydaci.append(w)
    return max(kandydaci, key=klucz) if kandydaci else None


def bez_komentarzy(tekst):
    """Usuwa komentarze HTML. Bez tego test raportuje WŁASNE notatki naprawcze:
    komentarz wyjaśniający „stopka podawała Wersja: 5.2 przy version: 6.1"
    był wykrywany jako... stopka podająca 5.2. Wykryte 2026-08-20z3."""
    return re.sub(r"<!--.*?-->", "", tekst, flags=re.S)


def numery_z_prozy(tresc, pole_changelog):
    """Numery deklarowane poza polem `version:` — H1, stopka, pole changelog.

    ⚠️ Przyjmuje KORPUS pliku (bez frontmatteru). Pierwsza wersja testu
    przeszukiwała całą treść i raportowała fałszywe trafienia z wpisów
    changelogu opisujących wersje INNYCH plików (rzeczywisty przypadek:
    shared/SKILL.md, wpis 3.15 cytujący 'Wersja: 1.1.0' pliku
    MOD-DOKUMENT-ANOMALIE). Wykryte przy pierwszym przebiegu 2026-08-20z.
    """
    wynik = {}
    m = re.search(r"^#\s+.*?v(\d+\.\d+(?:\.\d+)?)\s*$", tresc, re.M)
    if m:
        wynik["naglowek H1"] = m.group(1)
    # ⚠️ Kotwica na POCZĄTEK linii (opcjonalnie po `*` kursywy). Bez niej test
    # łapał wiersze WEWNĄTRZ wpisów changelogu w rodzaju „- Wersja: 3.8 → 3.9"
    # i raportował je jako stopkę — fałszywe trafienie w prawny-router-v3.
    m = re.search(r"^\*?\s?Wersja:\s*(\d+\.\d+(?:\.\d+)?)", tresc, re.M)
    if m:
        wynik["stopka"] = m.group(1)
    if pole_changelog:
        m = re.search(r"Wersja bie[żz]{1}[aą]ca:\s*(\d+\.\d+(?:\.\d+)?)", pole_changelog)
        if m:
            wynik["pole changelog: |"] = m.group(1)
    return wynik


def luka_zadeklarowana(katalog, tresc_skill):
    """Czy skill JAWNIE deklaruje lukę historii („LUKA JAWNA").

    Kryterium wyjścia T12 świadomie nie brzmi „zero rozbieżności": historii,
    której nie da się odtworzyć, nie wolno uzupełniać zmyślonymi wpisami.
    Skill, który lukę udokumentował, jest w stanie POPRAWNYM — i test musi to
    odróżniać od skilla, który po prostu milczy.
    """
    zrodla = [tresc_skill]
    plik = os.path.join(katalog, "references", "CHANGELOG.md")
    if os.path.exists(plik):
        zrodla.append(open(plik, encoding="utf-8", errors="replace").read())
    return any("LUKA JAWNA" in z for z in zrodla)


def sprawdz_skill(katalog, profilaktyka=False):
    plik = os.path.join(katalog, "SKILL.md")
    if not os.path.exists(plik):
        return []
    tresc = open(plik, encoding="utf-8", errors="replace").read()
    fm = czytaj_frontmatter(tresc)
    if fm is None:
        return []
    wersja, cytowany = numer_z_yaml(fm)
    if wersja is None:
        return []

    problemy = []
    nazwa = os.path.basename(katalog)


    # 1. pułapka float — dwucyfrowy minor bez cudzysłowu
    minor = wersja.split(".")[1] if "." in wersja else ""
    major = wersja.split(".")[0]
    if not cytowany and wersja.count(".") == 1 and len(minor) > 1:
        problemy.append(
            f"⚠️ TYP YAML: `version: {wersja}` bez cudzysłowu parsuje się jako float "
            f"{float(wersja)} — a {float(wersja)} < {major}.9. Porządek wersji jest więc "
            f"ODWRÓCONY dla każdego narzędzia porównującego numery liczbowo. Sam plik "
            f"działa poprawnie (wyświetlanie jako tekst), dlatego to ryzyko UTAJONE, "
            f"nie czynny błąd. Naprawa: cudzysłów."
        )
    elif profilaktyka and not cytowany and wersja.count(".") == 1:
        problemy.append(
            f"ℹ️ PROFILAKTYKA: `version: {wersja}` niecytowany — pułapka float pojawi się "
            f"przy przejściu na {major}.10."
        )

    # 2. changelog vs version
    cl = najwyzszy_z_changelogu(katalog, tresc)
    if cl is None:
        if os.path.exists(os.path.join(katalog, "references", "CHANGELOG.md")):
            problemy.append("⚠️ references/CHANGELOG.md istnieje, ale parser nie rozpoznał "
                            "żadnego numeru wpisu — format nietypowy, sprawdź ręcznie.")
    else:
        try:
            if klucz(cl) < klucz(wersja):
                if luka_zadeklarowana(katalog, tresc):
                    problemy.append(
                        f"ℹ️ LUKA JAWNA: version={wersja}, changelog={cl} — różnica jest "
                        f"UDOKUMENTOWANA w changelogu jako historia nie do odtworzenia. "
                        f"Zgodne z kryterium wyjścia T12, nie wymaga działania."
                    )
                else:
                    problemy.append(
                        f"⛔ LUKA HISTORII: version={wersja}, a najnowszy wpis changelogu={cl}. "
                        f"Zmiany między {cl} a {wersja} nie są nigdzie opisane."
                    )
            elif klucz(cl) > klucz(wersja):
                problemy.append(
                    f"⛔ ODWROTNY ROZJAZD: changelog ma wpis {cl}, a version={wersja} — "
                    f"wersja nie została podbita po naprawie."
                )
        except ValueError:
            pass

    # 3. STANDARD LOKALIZACJI (2026-08-20z4): historia wyłącznie w references/CHANGELOG.md
    m_sek = re.search(r"^##\s*CHANGELOG\b[^\n]*\n(.*?)(?=^##\s|\Z)", tresc, re.M | re.S)
    if m_sek and najwyzszy_z_tekstu(m_sek.group(1)):
        problemy.append(
            "⛔ HISTORIA W KORPUSIE: sekcja `## CHANGELOG` w SKILL.md zawiera wpisy wersji. "
            "Standard 2026-08-20z4: pełna historia WYŁĄCZNIE w references/CHANGELOG.md, "
            "w SKILL.md dopuszczalne jest tylko odesłanie. Rozproszenie historii było "
            "przyczyną fałszywych wyników tego testu w sesji 08-20z3."
        )
    m_pole = re.search(r"^changelog:(.*?)(?=^[a-zA-Z_]+:|\Z)", fm, re.M | re.S)
    if m_pole and len(m_pole.group(1).strip().split("\n")) > 15:
        problemy.append(
            f"⚠️ HISTORIA W YAML: pole `changelog:` ma "
            f"{len(m_pole.group(1).strip().split(chr(10)))} linii — to pełna historia, "
            f"nie skrót. Wynieś do references/CHANGELOG.md, zostaw kilka linii + odesłanie."
        )

    # 4. numery w prozie
    m = re.search(r"^changelog:\s*\|(.*?)(?=^\w+:|\Z)", fm, re.M | re.S)
    korpus = bez_komentarzy(tresc[tresc.find("\n---", 3) + 4:] if tresc.startswith("---") else tresc)
    for gdzie, num in numery_z_prozy(korpus, m.group(1) if m else None).items():
        if num != wersja and not wersja.startswith(num + "."):
            problemy.append(f"⚠️ ROZJAZD W PLIKU: {gdzie} podaje {num}, `version:` podaje {wersja}.")

    return [(nazwa, p) for p in problemy]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    profilaktyka = "--profilaktyka" in sys.argv
    baza = args[0] if args else DOMYSLNY_KATALOG
    wszystkie = []
    for wpis in sorted(os.listdir(baza)):
        sciezka = os.path.join(baza, wpis)
        if os.path.isdir(sciezka):
            wszystkie.extend(sprawdz_skill(sciezka, profilaktyka))

    print("=" * 72)
    print("TEST T12 — ZGODNOŚĆ METADANYCH WERSJI SKILLA")
    print(f"Katalog: {baza}")
    print("=" * 72)
    if not wszystkie:
        print("\n✅ Brak rozbieżności.")
        return 0
    biezacy = None
    for nazwa, problem in wszystkie:
        if nazwa != biezacy:
            print(f"\n--- {nazwa} ---")
            biezacy = nazwa
        print(f"  {problem}")
    krytyczne = sum(1 for _, p in wszystkie if p.startswith("⛔"))
    utajone = sum(1 for _, p in wszystkie if p.startswith("⚠️"))
    print(f"\n{'-' * 72}")
    print(f"RAZEM: {len(wszystkie)} — ⛔ czynnych rozjazdów: {krytyczne}, "
          f"⚠️ ryzyk utajonych: {utajone}.")
    print("Pełną listę skilli z niecytowanym `version:` pokaże flaga --profilaktyka.")
    print("⚠️ Wynik WYMAGA PRZEGLĄDU RĘCZNEGO — patrz ograniczenia w docstringu.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
