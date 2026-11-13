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
| 2028-05-19 | 2026/187 — Ustawa z dnia 23 stycznia 2026 r. o zawodzie psychologa oraz samorządz | 2024/18 | art. 88; art. 88** | dr-02/mod-KSH-organy-spolki-zoo, dr-02/mod-KSH-spolki-handlowe, dr-02/mod-KSH-spolki-osobowe-rada-nadzorcza |
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
