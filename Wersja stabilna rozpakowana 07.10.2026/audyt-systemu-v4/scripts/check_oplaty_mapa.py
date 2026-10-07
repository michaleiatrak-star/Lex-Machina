#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T29 — integralność podziału TABELE-OPLAT na rdzeń i satelity.

Powstał 2026-09-12q wraz z podziałem `shared/TABELE-OPLAT.md` (1555 linii) na
rdzeń nawigacyjny i siedem satelitów w `shared/oplaty/`.

⛔ PO CO. Sekcja 7 rdzenia opisuje, jak w tym systemie powstały „tabele
satelickie": pliki z własnymi kwotami, bez właściciela i bez rejestru, które
rozjechały się z przepisem. Podział na satelity tworzy dokładnie taką strukturę
— różnica polega wyłącznie na tym, że TUTAJ istnieje pojedyncza mapa własności
i test, który jej pilnuje. Bez tego testu podział jest regresją, nie porządkiem.

Cztery bramki:

  B1  KOMPLETNOŚĆ MAPY W DÓŁ — każdy plik wymieniony w mapie rdzenia ISTNIEJE.
  B2  KOMPLETNOŚĆ MAPY W GÓRĘ — każdy plik w `shared/oplaty/` jest W MAPIE.
      (B1 bez B2 przepuszcza plik-sierotę, czyli satelitę bez właściciela.)
  B3  UNIKALNOŚĆ WŁAŚCICIELA — żaden nagłówek sekcji (`## 1a.`, `## 6b.`…)
      nie występuje w więcej niż jednym pliku. To jest właściwa bramka
      antyduplikacyjna.
  B4  STOPKA STATUSU — każdy satelita niesie blok „Plik satelicki", żeby
      odczytany w oderwaniu nie udawał źródła samodzielnego.

Kody wyjścia: 0 = czysto, 1 = naruszenie, 2 = błąd wywołania.
"""

import argparse
import os
import re
import sys

RDZEN = os.path.join('shared', 'TABELE-OPLAT.md')
KATALOG = os.path.join('shared', 'oplaty')

# Pozycja mapy: `oplaty/NAZWA.md` wewnątrz tabeli w rdzeniu.
WZ_MAPA = re.compile(r'`oplaty/([A-Za-z0-9._-]+\.md)`')
# Nagłówek sekcji numerowanej: "## 1.", "## 1a.", "## 6b.", "## 2e." …
WZ_SEKCJA = re.compile(r'^##\s+(?:[⛔⭐⚠️\s]*)?(\d+[a-z]?)\.\s', re.MULTILINE)
WZ_STOPKA = re.compile(r'Plik satelicki')


def sekcje(tekst):
    return set(WZ_SEKCJA.findall(tekst))


def sprawdz(root):
    bledy, info = [], []
    p_rdzen = os.path.join(root, RDZEN)
    p_kat = os.path.join(root, KATALOG)

    if not os.path.isfile(p_rdzen):
        bledy.append(('B0', RDZEN, 'brak rdzenia'))
        return bledy, info
    rdzen = open(p_rdzen, encoding='utf-8').read()

    w_mapie = set(WZ_MAPA.findall(rdzen))
    na_dysku = set(f for f in os.listdir(p_kat)
                   if f.endswith('.md')) if os.path.isdir(p_kat) else set()

    for f in sorted(w_mapie - na_dysku):
        bledy.append(('B1', f, 'wymieniony w mapie rdzenia, ale NIE ISTNIEJE'))
    for f in sorted(na_dysku - w_mapie):
        bledy.append(('B2', f, 'istnieje w shared/oplaty/, ale NIE MA GO W MAPIE '
                               '— satelita bez właściciela'))

    wlasciciel = {}
    for f in sorted(na_dysku):
        tekst = open(os.path.join(p_kat, f), encoding='utf-8').read()
        if not WZ_STOPKA.search(tekst):
            bledy.append(('B4', f, 'brak bloku „Plik satelicki" — odczytany '
                                   'w oderwaniu udaje źródło samodzielne'))
        for s in sekcje(tekst):
            if s in wlasciciel:
                bledy.append(('B3', f, 'sekcja %s ma już właściciela: %s '
                                       '— DUPLIKACJA' % (s, wlasciciel[s])))
            else:
                wlasciciel[s] = f
    # rdzeń też może trzymać sekcje (7, 8) — nie mogą się dublować z satelitami
    for s in sekcje(rdzen):
        if s in wlasciciel:
            bledy.append(('B3', RDZEN, 'sekcja %s jest i w rdzeniu, i w %s'
                          % (s, wlasciciel[s])))
        else:
            wlasciciel[s] = RDZEN

    info.append('plików w mapie: %d | na dysku: %d | sekcji z właścicielem: %d'
                % (len(w_mapie), len(na_dysku), len(wlasciciel)))
    return bledy, info


# ---------------------------------------------------------------------------
PRZYPADKI = [
    ('B3 wykrywa tę samą sekcję w dwóch plikach',
     {'a.md': '## 1a. TEST\ntreść\nPlik satelicki',
      'b.md': '## 1a. TEST\ntreść\nPlik satelicki'},
     '`oplaty/a.md` `oplaty/b.md`', 1),
    ('czysty podział przechodzi',
     {'a.md': '## 1a. TEST\nPlik satelicki',
      'b.md': '## 2b. TEST\nPlik satelicki'},
     '`oplaty/a.md` `oplaty/b.md`', 0),
    ('B2 wykrywa satelitę bez wpisu w mapie',
     {'a.md': '## 1a. X\nPlik satelicki',
      'sierota.md': '## 9z. X\nPlik satelicki'},
     '`oplaty/a.md`', 1),
    ('B1 wykrywa wpis w mapie bez pliku',
     {'a.md': '## 1a. X\nPlik satelicki'},
     '`oplaty/a.md` `oplaty/widmo.md`', 1),
    ('B4 wykrywa brak stopki statusu',
     {'a.md': '## 1a. X\nbez stopki'},
     '`oplaty/a.md`', 1),
]


def selftest():
    import tempfile
    ok = 0
    for opis, pliki, mapa, exp in PRZYPADKI:
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(os.path.join(d, 'shared', 'oplaty'))
            open(os.path.join(d, RDZEN), 'w', encoding='utf-8').write(
                '# rdzen\n' + mapa + '\n')
            for n, t in pliki.items():
                open(os.path.join(d, KATALOG, n), 'w', encoding='utf-8').write(t)
            b, _ = sprawdz(d)
            got = 1 if b else 0
            if got == exp:
                ok += 1
                print('  OK   %s' % opis)
            else:
                print('  BŁĄD %s -> %s (oczek. %s); %s' % (opis, got, exp, b))
    print('\nSELFTEST: %d/%d' % (ok, len(PRZYPADKI)))
    return 0 if ok == len(PRZYPADKI) else 1


def main():
    ap = argparse.ArgumentParser(description='T29 — mapa własności sekcji opłat')
    ap.add_argument('--katalog', default='.')
    ap.add_argument('--selftest', action='store_true')
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    if not os.path.isdir(a.katalog):
        print('BŁĄD: nie ma katalogu %s' % a.katalog, file=sys.stderr)
        return 2
    bledy, info = sprawdz(a.katalog)
    print('T29 — integralność podziału TABELE-OPLAT')
    for i in info:
        print('  ' + i)
    print()
    if bledy:
        print('⛔ NARUSZENIA (%d):' % len(bledy))
        for kod, plik, opis in bledy:
            print('   [%s] %s — %s' % (kod, plik, opis))
        return 1
    print('✅ OK — mapa kompletna w obie strony, każda sekcja ma '
          'jednego właściciela, wszystkie satelity mają stopkę statusu.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
