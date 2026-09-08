# DEFINICJE-KLUCZOWE.md — INDEKS / ROUTER
## Shared Library · Analizator Prawa Polskiego

> **PRZEBUDOWA 2026-06-12:** Ten plik był wcześniej monolitem (788 linii, bloki A-H).
> Został rozbity na 9 plików tematycznych w `shared/definicje/` — analogicznie
> do wzorca DR-skill (SKILL.md = indeks, modules/ = treść).
>
> **Cel:** DR-skill ładuje (`view`) WYŁĄCZNIE plik tematyczny potrzebny dla
> konkretnej sprawy — nie cały zbiór definicji. Eliminuje to ładowanie
> definicji nieistotnych dla danej dziedziny (np. DR-06 nie potrzebuje
> definicji mobbingu, DR-04 nie potrzebuje definicji obiektu liniowego).
>
> ⛔ HARD GATE: każdy plik tematyczny ma WŁASNĄ bramkę — weryfikuj t.j. w ISAP.

---

## MAPA PLIKÓW TEMATYCZNYCH

| Plik | Zawartość | Główny DR | Rozmiar |
|---|---|---|---|
| `definicje/DEF-PODMIOTY-WLASNOSC.md` | Osoba fizyczna/prawna, przedsiębiorca, konsument, nieruchomość, posiadanie, własność, "rzecz" (art. 45 KC) | **DR-02** | 158 linii |
| `definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | Szkoda (damnum emergens/lucrum cessans — SCALONE z BAS-W26), odpowiedzialność cywilna, odszkodowanie, "mienie znacznej/wielkiej wartości", siła wyższa, rebus sic stantibus (art. 357¹ KC) | **DR-02, DR-16** | 211 linii |
| `definicje/DEF-PRACA.md` | Pracownik/pracodawca, mobbing (SCALONE z BAS-W20 + alert nowelizacji 2026), dyskryminacja, forma umowy, nieobecności, urlopy, wypadek przy pracy, zasiłki ZUS, niealimentacja | **DR-04** | 313 linii |
| `definicje/DEF-PROCEDURA.md` | Termin zawity vs przedawnienie vs instrukcyjny (SCALONE z BAS-W27), strona postępowania/uczestnik | **DR-02/03/05/16** | 85 linii |
| `definicje/DEF-BUDOWLANE-DROGOWE.md` | Obiekt liniowy, samowola budowlana, opłata SPP, decyzja WZ, obiekt budowlany — definicje ministerialne | **DR-08, DR-09** | 114 linii |
| `definicje/DEF-PODATKOWE.md` | Dochód/przychód/koszty (wykładnia MF), koszty uzyskania ZPCh, definicje podatkowe ustawowe | **DR-06** | 122 linii |
| `definicje/DEF-CYWILNE-WYKLADNIA.md` | Rękojmia vs gwarancja — systematyka po reformie 2023 | **DR-02** | 54 linii |
| `definicje/DEF-ADMINISTRACYJNE.md` | Decyzja administracyjna — definicja + wykonalność (SCALONE E.3+H.5.1) | **DR-05** | 74 linii |
| `definicje/METODOLOGIA-ORKA2.md` | Instrukcje weryfikacji interpelacji orka2.sejm.gov.pl (plik metodologiczny, bez definicji prawnych) | deweloperski | 42 linii |
| `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | Interes prawny vs faktyczny (art. 28 KPA), wyłączenie sędziego/biegłego (art. 48-49/281 KPC + TK P 10/19), świadek i interes własny (art. 233/261 KPC), pełnomocnik — konflikt interesów, czynność prawna ukryta/pozorna (art. 83 KC), rzeczywisty beneficjent/UBO (AML/CIT/KSH — 3 różne definicje) | **DR-01/02/03/05/06/12/16** | 333 linii |

**Łącznie: 1076 linii w 9 plikach** (vs 788 linii w 1 monolicie — wzrost wynika
z dodania nagłówków/HARD GATE/cross-referencji do każdego pliku + scalonej
treści z 3 rekordów ORKA usuniętych jako duplikaty).

---

## SCALENIA WYKONANE (eliminacja duplikacji shared/ ↔ ORKA)

Trzy pozycje istniały RÓWNOLEGLE w DEFINICJE-KLUCZOWE.md i w
ORKA-BAS-LEKSYKON.md z różną treścią. Scalono w plikach tematycznych,
w ORKA-BAS-LEKSYKON.md pozostały stuby z odesłaniem:

| Temat | Było w DEFINICJE-KLUCZOWE | Było w ORKA | Scalone do |
|---|---|---|---|
| Mobbing | D.1 (z alertem nowelizacji 10.06.2026) | BAS-W20 (linia SN, przesłanki sporne) | `DEF-PRACA.md` |
| Szkoda/lucrum cessans | C.1 (krótka) | BAS-W26 (pełna, z granicą sporną) | `DEF-ODPOWIEDZIALNOSC-SZKODA.md` |
| Terminy procesowe | E.1 (przykłady art.) | BAS-W27 (tabela różnic, pełna) | `DEF-PROCEDURA.md` |

---

## ZASADA UŻYCIA DLA DR-SKILLI

Każdy DR-skill w sekcji "ORKA-BAS — Definicje wspomagające" (SKILL.md) ma
TERAZ TAKŻE bezpośrednie odniesienie do właściwego pliku `definicje/DEF-*.md`
— bez przechodzenia przez ten indeks. Ten plik (`DEFINICJE-KLUCZOWE.md`) służy
jako mapa dla deweloperów i jako fallback gdy DR-skill nie ma jeszcze
zarejestrowanego odniesienia do nowej struktury.

---
*DEFINICJE-KLUCZOWE.md · shared/ · 2026-06-12*
*PRZEBUDOWANY z monolitu 788 linii → indeks + 9 plików w shared/definicje/*
