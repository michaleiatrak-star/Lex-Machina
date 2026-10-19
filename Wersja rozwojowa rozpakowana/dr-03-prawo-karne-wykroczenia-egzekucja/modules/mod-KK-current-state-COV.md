# Kodeks karny — current-state COV

**Stan operacyjny:** 2026-08-28  
**Status:** B+ / COV  
**Źródło kanoniczne:** ELI, t.j. Dz.U. 2026 poz. 1342 (obwieszczenie Marszałka Sejmu z 2.10.2026, ogł. 16.10.2026; ELI: „obowiązujący”, brak nowelizacji po t.j.; 2026/902 i 988 — „akt objęty tekstem jednolitym”; 2025/1818 i 1872 weszły w życie przed obwieszczeniem — potwierdź w treści t.j.). ⛔ Na 2026-10-19 ELI nie udostępnia tekstu t.j. (textPDF/textHTML: false) — do czasu publikacji brzmienie czytaj z t.j. Dz.U. 2025 poz. 383 (DU/2025/383, status „wygaśnięcie aktu”) łącznie z 2025/1818, 1872, 2026/902, 988.

## Struktura

Kodeks jest obsługiwany jako trzy części:

| Część | Zakres | Status |
|---|---|---|
| ogólna — rozdz. I–XV | odpowiedzialność, formy czynu, wyłączenia, kary, środki, wymiar kary, powrót do przestępstwa, zbieg, środki zabezpieczające, przedawnienie, zatarcie, definicje | B+/COV |
| szczególna — rozdz. XVI–XXXVII | typy przestępstw | B+/COV, routing do kwalifikatora i modułów tematycznych |
| wojskowa — rozdz. XXXVIII–XLIV | odpowiedzialność i przestępstwa wojskowe | B+/COV, aktywowana tylko przy właściwym statusie sprawcy |

### Moduły tematyczne — rozdz. XXXV (dodane 2026-10-04i)

| Rozdział | Zakres | Moduł |
|---|---|---|
| XXXV — przestępstwa przeciwko mieniu | art. 278–295 (kradzież, rozbój, przywłaszczenie, oszustwo, oszustwo komputerowe, zniszczenie mienia, pojazd, paserstwo, kwalifikacje wartościowe, naprawienie szkody) | `mod-KK-art278-295-przestepstwa-przeciwko-mieniu.md` (+ schematy w `kwalifikator-karnomaterialny/part-01`, `part-03`) |

## Runtime

Ten plik jest indeksem current-state. Treść materialna znajduje się przede wszystkim w `mod-KK-kwalifikator-karnomaterialny.md`, katalogu `kwalifikator-karnomaterialny/` oraz modułach tematycznych KK.

Każda kwalifikacja wymaga kolejno: czasu czynu, strony podmiotowej, znamion, stadialności i współdziałania, kontratypów, zbiegu, sankcji oraz ewentualnej reguły intertemporalnej z art. 4 KK.

## Temporal gate

Najnowszy t.j. to Dz.U. 2026 poz. 1342; do czasu publikacji jego tekstu w ELI brzmienie pochodzi z Dz.U. 2025 poz. 383 i czterech nowelizacji po nim (2025/1818, 1872, 2026/902, 988). Przed podaniem znamion, granic kary, środka karnego, terminu przedawnienia lub innej wartości normatywnej pobierz aktualny tekst ujednolicony ELI i sprawdź datę czynu.

## Quality gate
- [ ] ustalono datę czynu;
- [ ] wybrano właściwy rozdział części szczególnej;
- [ ] sprawdzono część ogólną i ewentualny zbieg;
- [ ] sankcję odczytano świeżo w ELI;
- [ ] dla żołnierza sprawdzono część wojskową;
- [ ] nie nadano statusu FULL bez audytu artykuł-po-artykule.
