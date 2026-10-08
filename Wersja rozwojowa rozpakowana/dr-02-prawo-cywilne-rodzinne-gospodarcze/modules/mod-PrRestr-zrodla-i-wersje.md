# Prawo restrukturyzacyjne — pełny korpus i sposób użycia

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prrestr.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prrestr/index.json`.

## Zakres korpusu

Ustawa z 15 maja 2015 r., akt pierwotny DU/2015/978, tekst jednolity DU/2026/533
(stan prawny 25.03.2026). Pełny PDF obejmuje również obwieszczenie, przepisy
przejściowe i przypisy. Indeks zawiera 407 jawnych nagłówków artykułów/grup.
Art. 401–447 są w t.j. pominięte zbiorowo; pełny tekst pierwotny jest w
`references/insolvency/sources/original-prrestr.pdf`. Uchylony dział III tytułu IV
nie tworzy obowiązujących procedur dla banków.

```sh
python3 scripts/prrestr.py summary
python3 scripts/prrestr.py article 211b --verify-online
python3 scripts/prrestr.py article 156 --as-of 2026-10-04 --verify-online
python3 scripts/prrestr.py search 'wierzytelności spornych'
python3 scripts/prrestr.py temporal --as-of 2026-10-04
python3 scripts/insolvency.py coverage
python3 scripts/insolvency.py route prrestr 312
python3 scripts/insolvency.py sources
```

Czytnik zwraca dokładny wycinek ekstrakcji ze stroną i URL. Tekst zachowuje
nagłówki i przypisy; nie cytuj ich jako części normy. Indeks nie zastępuje PDF.
`--as-of` odrzuca znaną niewłaściwą wersję, ale nie stwierdza samodzielnie,
że nowe prawo stosuje się do starej sprawy. Tryb offline zawsze wskazuje snapshot.
`--verify-online` blokuje zmienione źródło lub relacje ELI i błędy sieci.

## Zmiany już ogłoszone

- DU/2026/1206, art. 24 i 57: art. 4 ust. 2 pkt 4 od 11.01.2027.
- DU/2026/176, art. 24 i 35: uchylenie art. 156 ust. 5 pkt 4 od 18.02.2027.
  T.j. drukuje oba warianty pkt 4 obok siebie, z odnośnikami 31–32.
  Na 04.10.2026 wymóg oznaczenia rodzaju akcji nadal obowiązuje.
- Reforma DU/2025/1085: dla wyboru starych/nowych reguł decyduje jej art. 4,
  a nie sama data głosowania lub sporządzania opinii.
- Ujęte w t.j. (z regułami przejściowymi): DU/2025/1085 (43 zmiany PrRestr, art. 4), DU/2025/1170 (art. 26a; art. 5 — sprawy wszczęte i niezakończone), DU/2025/1172 (art. 209 ust. 1). Pełna tabela: `references/insolvency/wersje-i-przepisy-przejsciowe.md`.

## Dobór procedury

Wszystkie moduły tabeli są w klasie **A / COV-ART** (08.10.2026; `references/insolvency/plan-pokrycia.md`).

| Zadanie | Moduł |
|---|---|
| Zdolność, niewypłacalność, tryb, plan i test zaspokojenia | `mod-PrRestr-wejscie-plan-test.md` |
| PZU, dzień układowy, dokumenty, ochrona, głosowanie | `mod-PrRestr-pzu.md` |
| Przyspieszone postępowanie układowe i postępowanie układowe | `mod-PrRestr-ppu-pu.md` |
| Sanacja, zarząd, bezskuteczność, zatrudnienie, sprzedaż | `mod-PrRestr-sanacja.md` |
| Nadzorca/zarządca, kwalifikacje, obowiązki i wynagrodzenie | `mod-PrRestr-dzial-III-nadzorca-zarzadca.md` |
| Spis, sprzeciw, zgromadzenie, rada | `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele.md` |
| Układ i jego wykonanie, zmiana i uchylenie | `mod-PrRestr-dzial-VI-uklad.md` |
| Układ częściowy | `mod-PrRestr-dzial-VII-uklad-czesciowy.md` |
| Pomoc publiczna | `mod-PrRestr-dzial-V-pomoc-publiczna.md` |
| Wspólna procedura, zakończenie, uproszczony wniosek | `mod-PrRestr-procedura-zakonczenie.md` |
| Transgraniczne, deweloperzy, emitenci, przepisy karne/przejściowe | `mod-PrRestr-odrebne-miedzynarodowe.md` |

Pełne pokrycie źródłowe i routing sprawdzają `coverage.json` i testy.
Nie oznacza to encyklopedycznego komentarza, pełnej bazy orzecznictwa ani
niezależnego audytu każdej możliwej wykładni przepisu.

Rozbudowa systemu o następny akt: `references/insolvency/dodawanie-ustawy.md`.
