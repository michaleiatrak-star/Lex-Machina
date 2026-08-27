#!/usr/bin/env python3
"""
check_rejestracja_modulow.py — kontrola spójności rejestracji modułów.

Powstał 2026-08-14e przy rozszerzaniu flagi F-77, po tym jak ten sam wzorzec
luki wykryto niezależnie w DWÓCH dziedzinach (F-33/DR-06, F-77/DR-02):
moduł istnieje fizycznie na dysku i bywa wliczany do licznika nagłówka,
ale BRAKUJE mu formalnego wpisu w checklistcie SKILL.md albo wiersza
w MAPA-AKTOW.md albo wpisu w centralnej prawo-polskie-v2/ROUTING-MAP.md.

Kontroluje CZTERY rejestry dla każdego modułu:
  1. plik na dysku            (modules/*.md)
  2. wpis [✓] w SKILL.md      (formalny, nie sama wzmianka w prozie — REGUŁA 2)
  3. wiersz w MAPA-AKTOW.md   (lokalna mapa aktów)
  4. wiersz w ROUTING-MAP.md  (mapa centralna — REGUŁA 3)
oraz zgodność licznika w nagłówku "## Moduły (N łącznie ...)".

Wykrywa też MODUŁY-WIDMA: wpisy w rejestrach bez pliku na dysku
(wzorzec flagi F-20).

⚠️ ZNANE OGRANICZENIE DETEKCJI WIDM — wynik WYMAGA PRZEGLĄDU RĘCZNEGO.
Odsiane są dwie klasy fałszywych trafień (skróty będące prefiksem
istniejącej nazwy oraz odesłania do modułów z innych DR), ale trzecia
klasa pozostaje: WZMIANKI HISTORYCZNE, np. udokumentowana zmiana nazwy
pliku („było: mod-stara-nazwa") albo dawny skrót przywołany w opisie
zamkniętej flagi. Takie wpisy są POPRAWNE i nie wolno ich usuwać.
Przykład rzeczywisty: DR-10 raportuje mod-AH i
mod-ustawa-zawody-medyczne-i-prawnicze — oba to zapisy historyczne
przy zamknięciu flag F-1 i F-2 z 2026-07-15, nie luki rejestracyjne.
Zanim uznasz widmo za błąd — sprawdź kontekst wiersza.

Użycie:
    python3 check_rejestracja_modulow.py [katalog_ze_skillami]

Kod wyjścia: 0 = brak rozbieżności, 1 = wykryto rozbieżności.
"""
import os
import re
import sys

WZ_MODUL = re.compile(r'mod-[A-Za-z0-9_-]+')
WZ_CHECK = re.compile(r'\[✓\][^\n]*?(mod-[A-Za-z0-9_-]+)')
WZ_LICZNIK = re.compile(r'##\s*Moduły\s*\((\d+)\s*łącznie')


def czytaj(sciezka):
    try:
        with open(sciezka, encoding='utf-8') as f:
            return f.read()
    except OSError:
        return ''


def sekcje_routing_map(tresc):
    """Rozbija ROUTING-MAP.md na sekcje '## DR-NN' -> treść."""
    czesci = re.split(r'(?m)^(## DR-\d+.*)$', tresc)
    wynik = {}
    for i in range(1, len(czesci), 2):
        naglowek = czesci[i].strip()
        nr = re.search(r'DR-(\d+)', naglowek)
        if nr:
            wynik[nr.group(1)] = czesci[i + 1]
    return wynik


def inwentarz_globalny(baza):
    """Wszystkie moduły w systemie, niezależnie od dziedziny.

    Potrzebny, bo mapy i checklisty legalnie odsyłają do modułów z INNYCH
    DR (np. DR-12 wskazuje mod-ustawa-biegli-rewidenci-zawod, który mieszka
    w DR-06). Bez tego filtra DR-12 raportował 7 widm — wszystkie były
    poprawnymi odesłaniami międzydziedzinowymi (wykryte 2026-08-14e).
    """
    wszystkie = set()
    for skill in os.listdir(baza):
        kat_mod = os.path.join(baza, skill, 'modules')
        if os.path.isdir(kat_mod):
            wszystkie |= {f[:-3] for f in os.listdir(kat_mod) if f.endswith('.md')}
    return wszystkie


def main(baza):
    globalne = inwentarz_globalny(baza)
    routing = czytaj(os.path.join(baza, 'prawo-polskie-v2', 'ROUTING-MAP.md'))
    sekcje = sekcje_routing_map(routing)
    if not sekcje:
        print('OSTRZEŻENIE: nie znaleziono ROUTING-MAP.md — kontrola 4 pominięta\n')

    skille = sorted(d for d in os.listdir(baza) if d.startswith('dr-'))
    problemy = 0
    print('%-46s %5s %5s %5s %5s  %s' % ('SKILL', 'dysk', '[✓]', 'mapa', 'rout', 'STATUS'))
    print('-' * 92)

    for skill in skille:
        kat = os.path.join(baza, skill)
        kat_mod = os.path.join(kat, 'modules')
        if not os.path.isdir(kat_mod):
            continue

        dysk = {f[:-3] for f in os.listdir(kat_mod) if f.endswith('.md')}
        skill_md = czytaj(os.path.join(kat, 'SKILL.md'))
        mapa_md = czytaj(os.path.join(kat, 'MAPA-AKTOW.md'))

        check = set(WZ_CHECK.findall(skill_md))
        mapa = set(WZ_MODUL.findall(mapa_md))

        nr_dr = re.search(r'dr-(\d+)', skill)
        rout = set(WZ_MODUL.findall(sekcje.get(nr_dr.group(1), ''))) if nr_dr else set()

        brak_check = sorted(dysk - check)
        brak_mapa = sorted(dysk - mapa)
        brak_rout = sorted(dysk - rout) if sekcje else []

        # MODUŁY-WIDMA — z odsianiem fałszywych trafień.
        # W prozie i cross-referencjach akty bywają skracane ("patrz mod-PrBud",
        # "mod-KAS"), co dla wyrażenia regularnego wygląda jak osobny moduł.
        # Za widmo uznajemy TYLKO nazwę, która nie jest prefiksem żadnego
        # realnie istniejącego pliku. Bez tego filtra DR-12 raportował
        # 7 widm, z których wszystkie były skrótami (wykryte 2026-08-14e).
        kandydaci = (check | mapa) - globalne
        widma = sorted(k for k in kandydaci
                       if not any(d.startswith(k) for d in globalne))

        m = WZ_LICZNIK.search(skill_md)
        licznik = int(m.group(1)) if m else None
        licznik_ok = (licznik == len(dysk)) if licznik is not None else None

        uwagi = []
        if brak_check:
            uwagi.append('brak [✓]: %d' % len(brak_check))
        if brak_mapa:
            uwagi.append('brak w mapie: %d' % len(brak_mapa))
        if brak_rout:
            uwagi.append('brak w ROUTING: %d' % len(brak_rout))
        if widma:
            uwagi.append('WIDMA: %d' % len(widma))
        if licznik_ok is False:
            uwagi.append('licznik %s != %d' % (licznik, len(dysk)))
        if licznik is None:
            uwagi.append('brak licznika')

        status = 'OK' if not uwagi else '; '.join(uwagi)
        if uwagi:
            problemy += 1
        print('%-46s %5d %5d %5d %5d  %s'
              % (skill, len(dysk), len(dysk & check), len(dysk & mapa),
                 len(dysk & rout), status))

        for etykieta, lista in (('  brak [✓] w SKILL.md', brak_check),
                                ('  brak wiersza w MAPA-AKTOW', brak_mapa),
                                ('  brak w ROUTING-MAP', brak_rout),
                                ('  MODUŁ-WIDMO (wpis bez pliku)', widma)):
            for nazwa in lista:
                print('%s: %s' % (etykieta, nazwa))

    print('-' * 92)
    print('Dziedzin z rozbieżnościami: %d z %d' % (problemy, len(skille)))
    return 1 if problemy else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else '.'))
