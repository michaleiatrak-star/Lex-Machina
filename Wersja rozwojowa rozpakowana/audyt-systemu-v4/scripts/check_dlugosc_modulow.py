#!/usr/bin/env python3
"""
check_dlugosc_modulow.py — T13 (próg długości modułu, ZASADA 13).

Powstał 2026-08-21 (obserwacja O-3) po tym, jak naruszenie progu w
`dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KC-spadki.md` (1036 linii) przetrwało od momentu
przekroczenia aż do ręcznego skanu ad hoc. System miał wtedy DWANAŚCIE
testów regresyjnych na rejestry, wersje i mapy — i ANI JEDNEGO na długość,
mimo że ZASADA 13 jest regułą twardą. Zamknięcie flagi F-78 musiało się
z tego powodu kończyć rekomendacją "zrób świeży skan przy następnym audycie",
czyli przerzuceniem kontroli na pamięć audytora.

CO SPRAWDZA
  ⛔ CRIT  — plik `modules/mod-*.md` powyżej progu 1000 linii (ZASADA 13
             nakazuje podział wg rozdziałów aktu).
  ⚠️  WARN — plik w strefie ostrzegawczej 800-1000 linii: nie jest to
             naruszenie, ale kolejna transza treści przekroczy próg.
             Sygnał "podziel PRZY OKAZJI najbliższej edycji", nie "podziel teraz".

WYŁĄCZENIA (świadome, nie luki):
  - `references/AUDIT-JOURNAL.md` — dziennik przyrostowy, append-only,
    z definicji rosnący; podział zerwałby chronologię i odesłania
    AUDYT-YYYY-MM-DD używane w całym systemie (wyłączony TRWALE).
  - `references/mapa_dzu_*.md` — rejestry historyczne, ta sama logika.
  - `SKILL.md` orkiestratorów — OSOBNA kategoria, DO ROZSTRZYGNIĘCIA przez
    użytkownika (ustalenie z F-78): podział wg "rozdziałów aktu" nie ma tu
    zastosowania, bo te pliki nie opisują aktu prawnego, a SKILL.md musi
    pozostać JEDNYM plikiem wejściowym skilla. Raportowane osobno, jako
    informacja, i NIE wpływa na kod wyjścia.

⚠️ OGRANICZENIE: test mierzy WYŁĄCZNIE liczbę linii. Nie ocenia, czy plik ma
naturalne granice rozdziałów w miejscu, w którym wypadałoby ciąć — to zawsze
pozostaje decyzją audytora. Wynik ⛔ oznacza "podział wymagany", nie "podziel
w połowie pliku".

Użycie:
    python3 check_dlugosc_modulow.py [katalog_ze_skillami]   # domyślnie LEX_MACHINA_SKILLS_ROOT lub cwd
    python3 check_dlugosc_modulow.py --strefa                # pokaż też strefę 800-1000

Kod wyjścia: 0 = brak naruszeń progu, 1 = wykryto plik >1000 linii.
"""
import os
import sys

PROG_CRIT = 1000
PROG_WARN = 800

WYKLUCZONE_NAZWY = ('AUDIT-JOURNAL.md',)
WYKLUCZONE_PREFIKSY = ('mapa_dzu_',)


def policz_linie(sciezka):
    try:
        with open(sciezka, encoding='utf-8', errors='replace') as f:
            return sum(1 for _ in f)
    except OSError:
        return 0


def zbierz(katalog):
    # ⛔ Kategoria dodana 2026-09-12p: ZASOBY KANONICZNE `shared/` (pliki .md
    #    leżące bezpośrednio w katalogu skilla `shared`, poza SKILL.md).
    #    Do tej pory T13 mierzył WYŁĄCZNIE `modules/mod-*.md`, więc
    #    `shared/TABELE-OPLAT.md` urósł do 1471 linii — o 47 % ponad próg CRIT —
    #    całkowicie poza zasięgiem testu. Nie jest to jednak naruszenie ZASADY 13
    #    w tym samym sensie: te pliki są CELOWO scentralizowane, a podział
    #    odtworzyłby dokładnie rozproszenie, które sekcja 7 TABELE-OPLAT nazywa
    #    tabelami satelickimi. Dlatego kategoria RAPORTOWANA, nie blokująca —
    #    jak SKILL.md wg F-78. Decyzja o podziale należy do użytkownika.
    moduly, skille, kanoniczne, pominiete = [], [], [], []
    for root, dirs, files in os.walk(katalog):
        if 'archive' in root.split(os.sep):
            continue
        for nazwa in files:
            if not nazwa.endswith('.md'):
                continue
            sciezka = os.path.join(root, nazwa)
            n = policz_linie(sciezka)
            rel = os.path.relpath(sciezka, katalog)
            if nazwa in WYKLUCZONE_NAZWY or nazwa.startswith(WYKLUCZONE_PREFIKSY):
                if n > PROG_WARN:
                    pominiete.append((n, rel))
                continue
            if os.path.basename(root) == 'modules' and nazwa.startswith('mod-'):
                moduly.append((n, rel))
            elif nazwa == 'SKILL.md':
                skille.append((n, rel))
            elif 'shared' in root.split(os.sep):
                # ⛔ ZAKRES POPRAWIONY 2026-09-12r. Wersja z 12p sprawdzała
                #    `basename(root) == 'shared'`, więc obejmowała wyłącznie
                #    pliki leżące BEZPOŚREDNIO w katalogu skilla. Podział
                #    TABELE-OPLAT (12q) utworzył `shared/oplaty/` z siedmioma
                #    satelitami — i te NATYCHMIAST wypadły poza zakres testu,
                #    dokładnie tak jak wcześniej wypadł z niego sam
                #    TABELE-OPLAT. Ta sama plamka, drugi raz, w odstępie
                #    jednej sesji. Teraz: cały podkatalog `shared/`, rekurencyjnie.
                kanoniczne.append((n, rel))
    return moduly, skille, kanoniczne, pominiete


PRZYPADKI_SELFTEST = [
    ('plik bezpośrednio w shared/ jest widziany',
     'shared/X.md', 'kanoniczne'),
    ('satelita w podkatalogu shared/ też jest widziany',
     'shared/oplaty/01-a.md', 'kanoniczne'),
    ('moduł dziedzinowy trafia do kategorii modułów',
     'dr-99-x/modules/mod-y.md', 'moduly'),
    ('SKILL.md ma własną kategorię',
     'dr-99-x/SKILL.md', 'skille'),
    ('plik poza shared i poza modules jest pomijany',
     'dr-99-x/references/NOTATKA.md', None),
]


def selftest():
    import tempfile
    ok = 0
    for opis, wzgledna, oczek in PRZYPADKI_SELFTEST:
        with tempfile.TemporaryDirectory() as d:
            pelna = os.path.join(d, wzgledna)
            os.makedirs(os.path.dirname(pelna), exist_ok=True)
            open(pelna, 'w', encoding='utf-8').write('x\n' * 10)
            moduly, skille, kanoniczne, _ = zbierz(d)
            gdzie = None
            if any(wzgledna in r for _, r in kanoniczne):
                gdzie = 'kanoniczne'
            elif any(wzgledna in r for _, r in moduly):
                gdzie = 'moduly'
            elif any(wzgledna in r for _, r in skille):
                gdzie = 'skille'
            if gdzie == oczek:
                ok += 1
                print('  OK   %s' % opis)
            else:
                print('  BŁĄD %s -> %s (oczek. %s)' % (opis, gdzie, oczek))
    print('\nSELFTEST T13: %d/%d' % (ok, len(PRZYPADKI_SELFTEST)))
    return 0 if ok == len(PRZYPADKI_SELFTEST) else 1


def main(katalog=None, pokaz_strefe=True):
    katalog = katalog or os.environ.get('LEX_MACHINA_SKILLS_ROOT', os.getcwd())
    moduly, skille, kanoniczne, pominiete = zbierz(katalog)
    crit = sorted([x for x in moduly if x[0] > PROG_CRIT], reverse=True)
    warn = sorted([x for x in moduly if PROG_WARN < x[0] <= PROG_CRIT], reverse=True)
    skille_duze = sorted([x for x in skille if x[0] > PROG_CRIT], reverse=True)
    kanon_duze = sorted([x for x in kanoniczne if x[0] > PROG_WARN], reverse=True)

    print('check_dlugosc_modulow.py — T13 (próg długości, ZASADA 13)')
    print(f'  przeskanowano modułów `modules/mod-*.md`: {len(moduly)}')
    print(f'  zasobów kanonicznych `shared/**/*.md`: {len(kanoniczne)}'
          f' (w tym satelity w podkatalogach)')
    print(f'  próg CRIT: >{PROG_CRIT} linii | strefa WARN: {PROG_WARN}-{PROG_CRIT}\n')

    if crit:
        print(f'⛔ NARUSZENIE PROGU — podział WYMAGANY: {len(crit)}')
        for n, rel in crit:
            print(f'     {n:5d}  {rel}')
        print()
    else:
        print('✅ Żaden moduł nie przekracza progu 1000 linii.\n')

    if pokaz_strefe and warn:
        print(f'⚠️  STREFA OSTRZEGAWCZA {PROG_WARN}-{PROG_CRIT} — podziel PRZY OKAZJI '
              f'najbliższej edycji, nie hurtem: {len(warn)}')
        for n, rel in warn:
            print(f'     {n:5d}  {rel}')
        print()

    if skille_duze:
        print('ℹ️  Pliki SKILL.md >1000 linii — OSOBNA KATEGORIA (ustalenie F-78),')
        print('    do rozstrzygnięcia przez użytkownika; NIE wpływa na kod wyjścia:')
        for n, rel in skille_duze:
            print(f'     {n:5d}  {rel}')
        print()

    if kanon_duze:
        print(f'ℹ️  Zasoby kanoniczne `shared/*.md` powyżej {PROG_WARN} linii — OSOBNA')
        print('    KATEGORIA (ustalenie 2026-09-12p); NIE wpływa na kod wyjścia.')
        print('    ⛔ Te pliki są CELOWO scentralizowane — podział odtworzyłby')
        print('    rozproszenie, przed którym broni sekcja 7 TABELE-OPLAT. Przy')
        print('    przekroczeniu progu rozważyć SPIS TREŚCI, nie cięcie:')
        for n, rel in kanon_duze:
            znacznik = ' ⛔ >CRIT' if n > PROG_CRIT else ''
            print(f'     {n:5d}  {rel}{znacznik}')
        print()

    if pominiete:
        print('   (wyłączone z kontroli, zgodnie z docstringiem: '
              + ', '.join(os.path.basename(r) for _, r in pominiete[:4])
              + ('…' if len(pominiete) > 4 else '') + ')\n')

    print('=' * 68)
    if crit:
        print(f'WYNIK T13: ⛔ CRIT — {len(crit)} moduł(ów) do podziału.')
        print('   Procedura: ZASADA 13 w SKILL.md, sekcja "Jak dzielić" (kroki 1-6).')
        print('   ⛔ Krok 6 obowiązkowy: potwierdź "0 linii oryginału nieodnalezionych"')
        print('      PRZED usunięciem/nadpisaniem pliku źródłowego.')
        return 1
    print('WYNIK T13: ✅ OK — brak modułów powyżej progu.')
    if warn:
        print(f'   {len(warn)} plik(ów) w strefie ostrzegawczej — bez działania dzisiaj.')
    return 0


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args and '--katalog' in sys.argv:
        i = sys.argv.index('--katalog')
        if i + 1 < len(sys.argv):
            args = [sys.argv[i + 1]]
    sys.exit(main(args[0] if args else None,
                  pokaz_strefe='--strefa' in sys.argv or True))
