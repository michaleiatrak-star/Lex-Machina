# Kodeks karny — current-state COV

**Stan operacyjny:** 2026-08-28  
**Status:** B+ / COV  
**Źródło kanoniczne:** ELI, t.j. Dz.U. 2026 poz. 1342 (obwieszczenie Marszałka Sejmu z 2.10.2026, ogł. 16.10.2026; ELI: „obowiązujący”, brak nowelizacji po t.j.; 2026/902 i 988 — „akt objęty tekstem jednolitym”; 2025/1818 i 1872 weszły w życie przed obwieszczeniem i są w treści t.j.). Tekst t.j. udostępniony w ELI 2026-10-20 (text.pdf) — brzmienie czytaj z DU/2026/1342. ✅ [VER] RZĄD 1 2026-10-20 (ELI DU/2026/1342 text.pdf odczytany; porównanie artykułów z DU/2025/383: zmienione wyłącznie przepisy objęte 2025/1818, 1872, 2026/902, 988, m.in. art. 42, 43a, 44b, 69, 115 § 26, 177 § 2a, 178–178d, 217a, 222, 223, 231b, 255b, 269b; art. 278–295 bez zmian).

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

Najnowszy t.j. to Dz.U. 2026 poz. 1342 (tekst w ELI od 2026-10-20; obejmuje 2025/1818, 1872, 2026/902, 988; brak nowelizacji po t.j.). Przed podaniem znamion, granic kary, środka karnego, terminu przedawnienia lub innej wartości normatywnej pobierz aktualny tekst ujednolicony ELI i sprawdź datę czynu.

## Quality gate
- [ ] ustalono datę czynu;
- [ ] wybrano właściwy rozdział części szczególnej;
- [ ] sprawdzono część ogólną i ewentualny zbieg;
- [ ] sankcję odczytano świeżo w ELI;
- [ ] dla żołnierza sprawdzono część wojskową;
- [ ] nie nadano statusu FULL bez audytu artykuł-po-artykule.
