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

## Zmiany merytoryczne objęte t.j. 1342 (wobec t.j. 2025/383) — audyt 2026-10-20

Porównanie tekstów obu t.j. artykuł po artykule (ELI text.pdf, RZĄD 1, 2026-10-20). Poza
zmianami przypisów i numeracji odnośników zmieniły się wyłącznie poniższe przepisy:

| Przepis | Nowelizacja (w mocy) | Istota | Moduł |
|---|---|---|---|
| art. 42 §1a, §3 | 2025/1872 (29.01.2026) | obligatoryjny zakaz przy art. 177 §2a, 178b, 178c §1 pkt 2, 178d, 180a; dożywotni zakaz | `mod-PRD-nowe-przestepstwa-drogowe-BRD` |
| art. 43a §2–§3 | 2025/1872 | świadczenie min. 5 000 / 10 000 zł — nowe pozycje katalogu | BRD; `kwalifikator…/part-04` |
| art. 44b | 2025/1872 | przepadek pojazdu: §1 fakultatywny, §1a obligatoryjny ≥1,5‰, §2–§4 uchylone, §5–§6 nawiązka 5 000–500 000 zł | BRD; part-04 |
| art. 69 §4 pkt 3 | 2025/1872 | zawieszenie tylko w szczególnie uzasadnionych wypadkach (art. 173 §1/3, 177 §1–2a, 355 §1/2 z ≥1,5‰ lub w czasie zakazu) | `mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie` |
| art. 115 §26 | 2025/1872 | definicja nielegalnego wyścigu pojazdów mechanicznych | BRD |
| art. 177 §2a; art. 178 §1, §1a; art. 178a (§5 uchylony); art. 178c; art. 178d | 2025/1872 | wypadek w wyścigu / w warunkach 178d / w czasie zakazu (1–10 lat); obostrzenia przy alkoholu i ucieczce; wyścig; brawurowa jazda | BRD; part-04 |
| art. 217a §2; art. 222 §1a, §2, §3; art. 223 §3; art. 231b §2 (uchylony), §3 | 2025/1818 (2.01.2026) | narażenie (3 m–5 lat), publikacja wyroku na wniosek, ochrona obrońcy porządku publicznego | `mod-KK-art222-226-ochrona-funkcjonariusza` |
| art. 255b | 2026/988 (23.08.2026) | patostreaming | `mod-KK-art255b-patostreaming` |
| art. 269b §1 | 2026/902 (21.07.2026) | katalog obejmuje art. 267 §1–3 (wcześniej §3) | `mod-KK-art267-269c-cyberprzestepstwa`, `mod-KK-cyberprzestepstwa-szczegolowy` |
| art. 198 | — | bez zmiany treści (tylko przypis w 2025/383) | — |

Korekty modułów wynikające z audytu (2026-10-20): BRD — progi art. 178 §1a przypisane wcześniej
ogólnie do wypadków (stosują się tylko przy alkoholu/ucieczce), „art. 44a” zamiast 44b, znamiona
art. 178d; ochrona funkcjonariusza — brak art. 222 §1a, §3, 223 §3, 231b; cyber-szczegółowy —
zagrożenia art. 267 §3, 268, 268a, 269a, 269b, 212 §2; art. 69 §4 — brak pkt 3.

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
