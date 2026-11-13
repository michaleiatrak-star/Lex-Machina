# REJESTR ZMIAN W CZASIE — PL (`JUR:rejestr-zmian-w-czasie`)

Dwie tabele dla aktów powoływanych w modułach DR (format wskazanie + kwalifikator). Przed powołaniem przepisu
aktu z tej listy sprawdź wiersz; brzmienie i tak pobierasz z ELI (RZĄD 1). Utrzymanie:
`audyt-systemu-v4/scripts/check_nowelizacje.py --rejestr` (codziennie, `tj-eli-codziennie.yml`); procedura:
`audyt-systemu-v4/references/METODYKA-MODULY-DR.md` (W-4…W-6).

## A. Zmiany nadchodzące

Generowane z ELI i znaczników `[OD RRRR-MM-DD: RRRR/poz]` w modułach — **nie edytuj ręcznie**. Wiersz znika
w dniu wejścia zmiany w życie; ten sam przebieg zgłasza moduły do wdrożenia (`ZMIANA_WESZLA`, W-6).

<!-- GENEROWANE:check_nowelizacje.py START -->
| Wchodzi | Nowelizacja | Akt (t.j.) | Zakres | Moduły |
|---|---|---|---|---|
| 2026-12-03 | 2026/1440 — Ustawa z dnia 4 września 2026 r. o zmianie ustawy - Kodeks spółek hand | 2024/18 | art. 238 § 1, 243 § 2; art. 238 § 1, 243 § 2, 300⁹⁵ § 2: zgoda i pełnomocnictwo w formie dokumentowej, przepis przejściowy art. 3; art. 238, 243, 300⁹⁵, nie art. 22–124 | dr-02/mod-KSH-organy-spolki-zoo, dr-02/mod-KSH-spolki-handlowe, dr-02/mod-KSH-spolki-osobowe-rada-nadzorcza |
| 2027-01-11 | 2026/1206 — Ustawa z dnia 31 lipca 2026 r. o zmianie ustawy - Prawo bankowe oraz n | 2026/913 | tylko art. 452, 456 | dr-02/mod-KSH-spolki-handlowe |
| 2027-02-18 | 2026/176 — Ustawa z dnia 23 stycznia 2026 r. o zmianie ustawy - Kodeks spółek han | 2024/18 | S.A./PSA, nie art. 201–254; S.A./PSA/S.K.A., nie art. 22–124 | dr-02/mod-KSH-organy-spolki-zoo, dr-02/mod-KSH-spolki-handlowe, dr-02/mod-KSH-spolki-osobowe-rada-nadzorcza |
| 2028-05-19 | 2026/187 — Ustawa z dnia 23 stycznia 2026 r. o zawodzie psychologa oraz samorządz | 2024/18 | art. 88 | dr-02/mod-KSH-organy-spolki-zoo, dr-02/mod-KSH-spolki-handlowe, dr-02/mod-KSH-spolki-osobowe-rada-nadzorcza |
| 2028-09-30 | 2026/346 — Ustawa z dnia 27 lutego 2026 r. o zmianie ustawy - Prawo o stowarzysze | 2025/1228 | art. 52 ust. 2, 53 ust. 3: opłaty od wniosków przy wzorcach S24 | dr-02/mod-KPC-egzekucja-windykacja |
| 2030-01-10 | 2026/644 — Ustawa z dnia 17 kwietnia 2026 r. o zmianie niektórych ustaw w związku | 2024/18 | art. 402⁷, 421¹ | dr-02/mod-KSH-organy-spolki-zoo, dr-02/mod-KSH-spolki-handlowe, dr-02/mod-KSH-spolki-osobowe-rada-nadzorcza |
<!-- GENEROWANE:check_nowelizacje.py KONIEC -->

## B. Przepisy czasowe (przejściowe, dostosowujące, terminy)

Wpis po odczycie treści nowelizacji (W-4; ELI nie oznacza przepisów przejściowych w danych). `Do`: data
końcowa albo `bez terminu: <warunek>`. Wiersz z datą `Do` wcześniejszą niż dziś usuwa skrypt; wiersz bez terminu
przegląda się przy każdej zmianie aktu. Daty końcowe terminów liczonych w latach i miesiącach — KC art. 110–116
(brzmienie z ELI).

| Przepis | Dotyczy | Reguła | Od | Do | Moduły |
|---|---|---|---|---|---|
| 2026/1440 art. 3 ust. 1 | KSH art. 238 § 1 | zgody na zawiadomienie elektroniczne wyrażone przed 2026-12-03 — przepisy dotychczasowe (forma pisemna zgody) | 2026-12-03 | bez terminu: do odwołania zgody | dr-02/mod-KSH-organy-spolki-zoo |
| 2026/1440 art. 3 ust. 2 | KSH art. 243 § 2, 300⁹⁵ § 2 | pełnomocnictwa udzielone przed 2026-12-03 — przepisy dotychczasowe (pisemna pod rygorem nieważności) | 2026-12-03 | bez terminu: do wygaśnięcia pełnomocnictwa | dr-02/mod-KSH-organy-spolki-zoo |
| 2026/176 art. 28 | ustawa 2019/1798 art. 15 ust. 2 | dokument akcji zachowuje moc dowodową (wobec spółki, co do praw udziałowych) przez 7 lat od wejścia w życie ustawy 2019/1798 (2021-03-01) | 2026-02-28 | 2028-03-01 | dr-02/mod-KSH-spolki-handlowe |
| 2026/176 art. 29 | spółki z rejestrem akcjonariuszy lub akcjami w depozycie | wniosek do sądu rejestrowego o wpis danych z art. 38 ustawy o KRS w 3 miesiące od 2027-02-18 | 2027-02-18 | 2027-05-18 | dr-02/mod-KSH-spolki-handlowe |
| 2026/176 art. 31 | KSH — akcje imienne i na okaziciela | akcje niezarejestrowane 2027-02-18 w rejestrze akcjonariuszy ani depozycie — dotychczasowe przepisy do dnia rejestracji | 2027-02-18 | bez terminu: do rejestracji akcji | dr-02/mod-KSH-spolki-handlowe |
| 2026/176 art. 32 | KSH art. 476 § 1¹; ustawa o KRS art. 25da | sprawy o wykreślenie wszczęte przed 2027-02-18 — nowe przepisy, jeżeli nie rozpoczęło się posiedzenie | 2027-02-18 | bez terminu: do zakończenia tych spraw | dr-02/mod-KSH-spolki-handlowe |
| 2026/176 art. 33 | ustawa 2019/1798 art. 18 ust. 1–2 | sprawy o grzywnę wszczęte przed 2026-02-28 — dotychczasowe sądy właściwe do zakończenia (także wykonanie) | 2026-02-28 | bez terminu: do zakończenia tych spraw | dr-02/mod-KSH-spolki-handlowe |
| 2026/176 art. 34 | S.A., S.K.A., PSA, SE | dostosowanie umów, aktów założycielskich i statutów — nie później niż 2 lata od 2027-02-18 | 2027-02-18 | 2029-02-18 | dr-02/mod-KSH-spolki-handlowe |
| 2026/473 art. 15 | KPC (art. 63¹–63², 477¹ᶜ i n., 755⁶ — zmiany z art. 2 noweli) | postępowania wszczęte i niezakończone przed 2026-07-08, w których PIP wniosła powództwo o ustalenie stosunku pracy — KPC w brzmieniu dotychczasowym | 2026-07-08 | bez terminu: do zakończenia tych spraw | dr-02/mod-KPC-uzupelnienie-pokrycia-2026 |
| 2026/830 art. 19 | ustawa o ochronie uczestników debaty publicznej; KPC art. 4¹ zd. 2 | ustawa — do postępowań wszczętych od 2026-07-08; w sprawach w toku art. 4¹ zd. 2 — do czynności podjętych po 2026-07-08 | 2026-07-08 | bez terminu: do zakończenia spraw w toku | dr-02/mod-KPC-art162-zastrzezenie-protokol |
| 2026/1046 art. 5 | KPC art. 47 § 2 pkt 1 lit. d, 461 § 1¹, 477⁶ᵃ | postępowania wszczęte i niezakończone przed 2026-11-05 — KPC w brzmieniu dotychczasowym | 2026-11-05 | bez terminu: do zakończenia tych spraw | dr-02/mod-KPC-uzupelnienie-pokrycia-2026 |

## C. Odczyt W-4 (przepisy przejściowe i daty wejścia nowelizacji)

Każda nowelizacja z tabeli A ma wiersz: data odczytu treści nowelizacji w ELI i wynik (wiersze tabeli B albo
„brak”). Brak wiersza = `BRAK_W4`. Wiersz znika, gdy nowelizacja opuści tabelę A i nie ma wierszy w tabeli B.

| Nowelizacja | Odczyt | Wynik |
|---|---|---|
| 2026/1440 | 2026-11-13 | art. 3 ust. 1–2 → tabela B; wejście: art. 4 (30 dni od ogłoszenia; art. 2 od 2027-02-18) |
| 2026/176 | 2026-11-13 | art. 28, 29, 31–34 → tabela B; wejście: art. 35 (12 miesięcy; art. 28 i 33 od 2026-02-28) |
| 2026/187 | 2026-11-13 | brak przepisów przejściowych dla art. 138 (KSH art. 88); wejście: art. 161 (2 lata i 3 miesiące) |
| 2026/644 | 2026-11-13 | art. 18 dotyczy rachunkowości, nie KSH; art. 6 (KSH) wchodzi 2030-01-10 (art. 19 pkt 3 lit. a) |
| 2026/1206 | 2026-11-13 | brak przepisów przejściowych dla art. 7 (PrUp art. 452, 456); art. 7 wchodzi 2027-01-11 (art. 57) |
| 2026/346 | 2026-11-13 | KSCU art. 52 ust. 2, 53 ust. 3 (art. 3); brak przepisów przejściowych (art. 1–4); wejście art. 4: 2028-09-30 |
| 2026/473 | 2026-11-13 | KPC (art. 2), KSCU (art. 7); przejściowy art. 15 → tabela B; wejście art. 20: 3 miesiące od ogłoszenia (2026-07-08) |
| 2026/830 | 2026-11-13 | KPC art. 4¹ zd. 2 (art. 18); przejściowy art. 19 → tabela B; wejście art. 20: 14 dni (2026-07-08) |
| 2026/1046 | 2026-11-13 | KPC art. 47, 461 § 1¹, 477⁶ᵃ (art. 2); przejściowy art. 5 → tabela B; wejście art. 6: 3 miesiące (2026-11-05) |
