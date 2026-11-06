# Migracja prawa polskiego — inwentarz, plan per skill i mapa kategorii (2026-11-06)

Wygenerowane skryptem `scripts/mapa_jurysdykcji.py` (`--inwentarz`, `--plan --app=<src aplikacji>`, bez flag — mapa). Zakres: 12 skilli wykonawczych, audyt-systemu-v4 i shared; skille dziedzinowe `dr-*` (w tym `dr-16`) poza zakresem — to warstwa prawa polskiego. Akapit z powołaniem aktu lub przepisu PL liczony w całości (zawyża udział, gdy przepis jest przykładem w metodzie).

## 1. Inwentarz (E0)

| Skill | Akapity | z prawem PL | Znaki | udział PL (znaki) |
|---|---:|---:|---:|---:|
| analiza-sadowa-v6 | 649 | 80 | 132926 | 30% |
| analizator-dowodow-v3 | 838 | 76 | 213431 | 37% |
| analizator-przepisow-v2 | 218 | 32 | 48941 | 40% |
| analizator-umow-v1 | 2023 | 430 | 762163 | 55% |
| chronologia-sprawy-v1 | 227 | 17 | 75778 | 12% |
| orzeczenia-sadowe-v2 | 142 | 19 | 104171 | 72% |
| pisma-procesowe-v3 | 1202 | 155 | 337761 | 46% |
| pisma-proste-v2 | 797 | 186 | 186955 | 59% |
| przesluchanie-swiadkow-v2-min90 | 463 | 42 | 120602 | 23% |
| przewodnik-prawny-v2 | 170 | 16 | 53984 | 32% |
| raport-klienta-v1 | 199 | 0 | 41223 | 0% |
| raport-sytuacyjny-v2 | 114 | 1 | 25565 | 6% |

Największy udział treści PL (kandydaci do migracji):
- analizator-umow-v1/references/mod-J7-pzp.md: 99% (14194 znaków)
- analizator-umow-v1/references/mod-J5-umowy-wykonawcze.md: 94% (5822 znaków)
- analizator-umow-v1/references/mod-FA-founders-dokumenty-zalozycielskie.md: 93% (18104 znaków)
- analizator-umow-v1/references/mod-J2-nieruchomosci.md: 93% (11105 znaków)
- analizator-umow-v1/references/mod-J8-b2c.md: 91% (11586 znaków)
- pisma-proste-v2/references/SPJ-interpretacja-zus.md: 91% (7061 znaków)
- analizator-umow-v1/references/umowy-o-prace.md: 91% (23566 znaków)
- analizator-umow-v1/references/mod-shared-rodo.md: 91% (11480 znaków)
- analizator-umow-v1/references/mod-J0-routing.md: 90% (6710 znaków)
- analizator-dowodow-v3/modules/MD3b-walidacja-prawna.md: 87% (2082 znaków)

## 2. Plan migracji per skill (E2–E4)

Kolejność realizacji: najpierw skille z najmniejszą liczbą odwołań z aplikacji i innych skilli (chronologia, przesłuchanie, przewodnik, analizator-przepisow, orzeczenia), potem analizator-dowodow, analiza-sadowa, pisma-proste, pisma-procesowe, na końcu analizator-umow. Każde przeniesienie: odesłanie `JUR:` w skillu + wiersze w `migracja-jurysdykcji/*.tsv` + T50 + bateria regresji porównana z bazą + testy aplikacji. Raporty klienta i sytuacyjny — metoda, bez zmian. `audyt-systemu-v4`: mapy Dz.U., synchronizacja z ELI i raporty pokrycia to narzędzia pakietu PL — skrypty dostaną parametr jurysdykcji (manifest), treść map przechodzi do pakietu PL. `shared`: moduły PL (terminy, opłaty, procedura, definicje, leksykon) — pakiet PL; pliki metody zostają.

### analiza-sadowa-v6

Pliki: 19 — przenieść 1, rozdzielić 13, metoda 5.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `analiza-sadowa-v6/references/MOD-B.md` (71%, 1353 zn.)

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `analiza-sadowa-v6/references/BLUEPRINT-SCHEMA.md` (63%)
- `analiza-sadowa-v6/references/koszty-terminy.md` (58%)
- `analiza-sadowa-v6/references/PRZEBIEG-3-predykcja.md` (52%)
- `analiza-sadowa-v6/references/moduly-spec.md` (45%)
- `analiza-sadowa-v6/references/MOD-F.md` (45%)
- `analiza-sadowa-v6/references/engines/contradiction-case-analysis-v10.md` (43%)
- `analiza-sadowa-v6/references/MOD-D.md` (40%)
- `analiza-sadowa-v6/SKILL.md` (29%)
- `analiza-sadowa-v6/references/MOD-C.md` (28%)
- `analiza-sadowa-v6/references/MOD-E.md` (28%)
- `analiza-sadowa-v6/references/orzecznictwo.md` (17%)
- `analiza-sadowa-v6/references/PRZEBIEG-2-strukturalna.md` (17%)
- … i 1 dalszych (udział < 16%)

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `analiza-sadowa-v6/references/WERYFIKACJA-DOWODOW.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts

### analizator-dowodow-v3

Pliki: 32 — przenieść 5, rozdzielić 10, metoda 17.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `analizator-dowodow-v3/modules/MD3b-walidacja-prawna.md` (87%, 2390 zn.) — `JUR:dowody-md3b-walidacja-prawna`
- `analizator-dowodow-v3/modules/MP10-koszty.md` (82%, 15148 zn.) — `JUR:dowody-mp10-koszty`
- `analizator-dowodow-v3/modules/MP11-rodo-cyber.md` (77%, 10308 zn.) — `JUR:dowody-mp11-rodo-cyber`
- `analizator-dowodow-v3/modules/MX-dziedziny.md` (77%, 8262 zn.) — `JUR:dowody-mx-dziedziny`
- `analizator-dowodow-v3/modules/MP12-terminy.md` (76%, 8824 zn.) — `JUR:dowody-mp12-terminy`

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `analizator-dowodow-v3/modules/MP5-atak.md` (60%)
- `analizator-dowodow-v3/modules/MD1-klasyfikacja.md` (59%)
- `analizator-dowodow-v3/modules/MD-NARR-raport-narracyjny.md` (56%)
- `analizator-dowodow-v3/checklists/kontrola-jakosci.md` (38%)
- `analizator-dowodow-v3/SKILL.md` (38%)
- `analizator-dowodow-v3/modules/MD3a-walidacja-formalna.md` (26%)
- `analizator-dowodow-v3/modules/MD3c-spojnosc.md` (26%)
- `analizator-dowodow-v3/modules/MP13-synteza-faktyczna.md` (23%)
- `analizator-dowodow-v3/modules/MOD-LAPSUS-AUDYT.md` (21%)
- `analizator-dowodow-v3/modules/MP9-jakosc.md` (19%)

### analizator-przepisow-v2

Pliki: 3 — przenieść 0, rozdzielić 3, metoda 0.

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `analizator-przepisow-v2/SKILL.md` (44%)
- `analizator-przepisow-v2/references/MOD-ORZECZ-POWIAZANIA-HISTORIA.md` (37%)
- `analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md` (28%)

### analizator-umow-v1

Pliki: 63 — przenieść 18, rozdzielić 34, metoda 11.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `analizator-umow-v1/references/mod-J7-pzp.md` (99%, 14309 zn.) — `JUR:umowy-j7-pzp`
- `analizator-umow-v1/references/mod-J5-umowy-wykonawcze.md` (94%, 6215 zn.) — `JUR:umowy-j5-umowy-wykonawcze`
- `analizator-umow-v1/references/mod-FA-founders-dokumenty-zalozycielskie.md` (93%, 19506 zn.) — `JUR:umowy-fa-founders-dokumenty-zalozycielskie`
- `analizator-umow-v1/references/mod-J2-nieruchomosci.md` (93%, 12004 zn.) — `JUR:umowy-j2-nieruchomosci`
- `analizator-umow-v1/references/mod-J8-b2c.md` (91%, 12667 zn.) — `JUR:umowy-j8-b2c`
- `analizator-umow-v1/references/umowy-o-prace.md` (91%, 25950 zn.) — `JUR:umowy-umowy-o-prace`
- `analizator-umow-v1/references/mod-shared-rodo.md` (91%, 12669 zn.) — `JUR:umowy-shared-rodo`
- `analizator-umow-v1/references/mod-J0-routing.md` (90%, 7452 zn.) — `JUR:umowy-j0-routing`
- `analizator-umow-v1/references/zakaz-konkurencji.md` (85%, 41704 zn.) — `JUR:umowy-zakaz-konkurencji`
- `analizator-umow-v1/references/mod-shared-fm-hardship.md` (77%, 17360 zn.) — `JUR:umowy-shared-fm-hardship`
- `analizator-umow-v1/references/mod-J10-ubezpieczenia.md` (77%, 11685 zn.) — `JUR:umowy-j10-ubezpieczenia`
- `analizator-umow-v1/references/mod-MA-transakcje.md` (76%, 22896 zn.) — `JUR:umowy-ma-transakcje`
- `analizator-umow-v1/references/mod-shared-orzecznictwo-umow.md` (76%, 11110 zn.) — `JUR:umowy-shared-orzecznictwo-umow`
- `analizator-umow-v1/references/mod-shared-abusive-clauses.md` (75%, 16395 zn.) — `JUR:umowy-shared-abusive-clauses`
- `analizator-umow-v1/references/b2b-podwykonawcze.md` (74%, 44637 zn.) — `JUR:umowy-b2b-podwykonawcze`
- `analizator-umow-v1/references/generator/essentialia-regulaminy-i-korporacyjne.md` (74%, 9617 zn.) — `JUR:umowy-essentialia-regulaminy-i-korporacyjne`
- `analizator-umow-v1/references/mod-J21-rodo-archiwizacja-regulaminy.md` (71%, 34367 zn.) — `JUR:umowy-j21-rodo-archiwizacja-regulaminy`
- `analizator-umow-v1/references/mod-J4-finansowanie.md` (70%, 6471 zn.) — `JUR:umowy-j4-finansowanie`

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `analizator-umow-v1/references/mod-shared-wykladnia.md` (67%)
- `analizator-umow-v1/references/mod-core-checklist.md` (59%)
- `analizator-umow-v1/references/poufnosc-nda.md` (59%)
- `analizator-umow-v1/references/mod-shared-lifecycle.md` (59%)
- `analizator-umow-v1/references/mod-J3-dystrybucja.md` (58%)
- `analizator-umow-v1/SKILL.md` (56%)
- `analizator-umow-v1/references/mod-shared-alt-drafts.md` (53%)
- `analizator-umow-v1/references/mod-shared-ius-cogens.md` (53%)
- `analizator-umow-v1/benchmark/posiane-wady/manifesty/instrukcja-sedziego.md` (52%)
- `analizator-umow-v1/workflows/generator-dokumentow-korporacyjnych.md` (52%)
- `analizator-umow-v1/references/mod-shared-ryzyko-kwant.md` (49%)
- `analizator-umow-v1/references/mod-shared-regulatory-horizon.md` (46%)
- … i 22 dalszych (udział < 44%)

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `analizator-umow-v1/references/generator/rdzen-generowania.md` ← checkpoint-skill-sections.ts
- `analizator-umow-v1/references/mod-core-checklist.md` ← checkpoint-skill-sections.ts

### chronologia-sprawy-v1

Pliki: 6 — przenieść 0, rozdzielić 1, metoda 5.

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `chronologia-sprawy-v1/references/sprzecznosci-dat.md` (19%)

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `chronologia-sprawy-v1/references/ekstrakcja-zdarzen.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts
- `chronologia-sprawy-v1/references/sprzecznosci-dat.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts

### orzeczenia-sadowe-v2

Pliki: 5 — przenieść 2, rozdzielić 1, metoda 2.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `orzeczenia-sadowe-v2/references/widget.md` (87%, 21167 zn.)
- `orzeczenia-sadowe-v2/SKILL.md` (82%, 67976 zn.)

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `orzeczenia-sadowe-v2/references/CBOSA-ADAPTER.md` (49%)

### pisma-procesowe-v3

Pliki: 47 — przenieść 6, rozdzielić 21, metoda 20.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `pisma-procesowe-v3/references/W3-PODMIOT-GATE.md` (84%, 4850 zn.) — `JUR:pisma-w3-podmiot-gate`
- `pisma-procesowe-v3/references/MODULY-MAPA.md` (80%, 12663 zn.)
- `pisma-procesowe-v3/modules/MOD-OPLATY.md` (78%, 18558 zn.) — `JUR:pisma-oplaty`
- `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` (75%, 21220 zn.) — `JUR:pisma-pracodawca-rzeczywisty`
- `pisma-procesowe-v3/modules/MOD-PRAWO.md` (74%, 6230 zn.) — `JUR:pisma-prawo`
- `pisma-procesowe-v3/references/AUTOMAT-STANOW.md` (70%, 31894 zn.)

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `pisma-procesowe-v3/references/SELF-CHECK-PISMA.md` (69%)
- `pisma-procesowe-v3/modules/MOD-SZABLONY.md` (65%)
- `pisma-procesowe-v3/modules/MOD-KOSZT-ODPOWIEDZI.md` (62%)
- `pisma-procesowe-v3/modules/MOD-ELIMINACJA-TEZ.md` (62%)
- `pisma-procesowe-v3/modules/MOD-BUDOWA-ARGUMENTU.md` (61%)
- `pisma-procesowe-v3/references/W3-WERYFIKACJA.md` (53%)
- `pisma-procesowe-v3/references/W1-SZCZEGOLY.md` (52%)
- `pisma-procesowe-v3/modules/MOD-ADMIN.md` (48%)
- `pisma-procesowe-v3/modules/MOD-DOKTRYNA.md` (46%)
- `pisma-procesowe-v3/references/W2-SZCZEGOLY.md` (46%)
- `pisma-procesowe-v3/modules/MOD-ROUTE.md` (43%)
- `pisma-procesowe-v3/modules/MOD-STRESS-TEST.md` (41%)
- … i 9 dalszych (udział < 39%)

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `pisma-procesowe-v3/references/AUTOMAT-STANOW.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts
- `pisma-procesowe-v3/references/SELF-CHECK-PISMA.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts
- `pisma-procesowe-v3/references/W1-SZCZEGOLY.md` ← process-checkpoint-contract.ts
- `pisma-procesowe-v3/references/W2-SZCZEGOLY.md` ← process-checkpoint-contract.ts
- `pisma-procesowe-v3/references/W3-PODMIOT-GATE.md` ← process-checkpoint-contract.ts
- `pisma-procesowe-v3/references/W3-WERYFIKACJA.md` ← process-checkpoint-contract.ts

### pisma-proste-v2

Pliki: 25 — przenieść 7, rozdzielić 14, metoda 4.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `pisma-proste-v2/references/SPJ-interpretacja-zus.md` (91%, 7757 zn.) — `JUR:pisma-proste-spj-interpretacja-zus`
- `pisma-proste-v2/references/SPB-zarzuty.md` (84%, 5222 zn.) — `JUR:pisma-proste-spb-zarzuty`
- `pisma-proste-v2/references/SPH-inne.md` (81%, 17751 zn.) — `JUR:pisma-proste-sph-inne`
- `pisma-proste-v2/references/SPL-skarga-komornik.md` (80%, 6044 zn.) — `JUR:pisma-proste-spl-skarga-komornik`
- `pisma-proste-v2/references/SPA-sprzeciw.md` (80%, 3767 zn.) — `JUR:pisma-proste-spa-sprzeciw`
- `pisma-proste-v2/references/M6-oplaty.md` (80%, 14514 zn.) — `JUR:pisma-proste-m6-oplaty`
- `pisma-proste-v2/references/SPF-SPG.md` (74%, 9041 zn.) — `JUR:pisma-proste-spf-spg`

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `pisma-proste-v2/references/SPN-wypowiedzenie.md` (68%)
- `pisma-proste-v2/references/M9-format.md` (67%)
- `pisma-proste-v2/references/M3-weryfikacja.md` (61%)
- `pisma-proste-v2/references/SPO-reklamacja.md` (60%)
- `pisma-proste-v2/references/SPK-skarga-do-UODO.md` (56%)
- `pisma-proste-v2/references/SPC-SPD-SPE.md` (56%)
- `pisma-proste-v2/SKILL.md` (53%)
- `pisma-proste-v2/references/SPM-skd-oswiadczenie.md` (51%)
- `pisma-proste-v2/references/SPL-interpretacja-GIP.md` (48%)
- `pisma-proste-v2/references/SPR-odstapienie.md` (43%)
- `pisma-proste-v2/references/SPM-interpretacja-podatkowa.md` (30%)
- `pisma-proste-v2/references/M1-zasady.md` (30%)
- … i 2 dalszych (udział < 26%)

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `pisma-proste-v2/references/M1-zasady.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts
- `pisma-proste-v2/references/M2-intake.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts
- `pisma-proste-v2/references/M4-struktura.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts
- `pisma-proste-v2/references/M7-eskalacja.md` ← execution-engine.ts
- `pisma-proste-v2/references/M8-checklista.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts
- `pisma-proste-v2/references/M9-format.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts

### przesluchanie-swiadkow-v2-min90

Pliki: 11 — przenieść 2, rozdzielić 3, metoda 6.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `przesluchanie-swiadkow-v2-min90/references/PRAWO-HARDGATE-WITNESS.md` (86%, 8186 zn.) — `JUR:przesluchanie-prawo-hardgate-witness`
- `przesluchanie-swiadkow-v2-min90/references/CROSS-EXAMINATION-GATE.md` (71%, 2370 zn.)

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `przesluchanie-swiadkow-v2-min90/references/QUESTION-ADMISSIBILITY-GATE.md` (46%)
- `przesluchanie-swiadkow-v2-min90/references/WITNESS-SCORING.md` (22%)
- `przesluchanie-swiadkow-v2-min90/SKILL.md` (17%)

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts

### przewodnik-prawny-v2

Pliki: 4 — przenieść 0, rozdzielić 2, metoda 2.

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `przewodnik-prawny-v2/references/KROK-M.md` (54%)
- `przewodnik-prawny-v2/SKILL.md` (34%)

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `przewodnik-prawny-v2/references/TRYB-SUROWA-ANALIZA.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts

### raport-klienta-v1

Pliki: 4 — przenieść 0, rozdzielić 0, metoda 4.

Aplikacja (E4 — ścieżka zmienia się na klucz):
- `raport-klienta-v1/references/BLUEPRINT-SCHEMA.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts, report-blueprint-repair.ts, report-blueprint-tool-runtime.ts
- `raport-klienta-v1/references/jezyk-klienta.md` ← deterministic-workflow.test.ts, deterministic-workflow.ts

### raport-sytuacyjny-v2

Pliki: 1 — przenieść 0, rozdzielić 0, metoda 1.

### audyt-systemu-v4

Pliki: 52 — przenieść 18, rozdzielić 23, metoda 11.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-KKW.md` (99%, 13289 zn.)
- `audyt-systemu-v4/references/mapa_dzu_2026-08-28.md` (97%, 161150 zn.)
- `audyt-systemu-v4/references/mapa_dzu_2026-10-04.md` (97%, 238092 zn.)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-SUS-FUS.md` (91%, 14380 zn.)
- `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` (89%, 97959 zn.)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-PZP.md` (89%, 11700 zn.)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/00-indeks-raportow-pokrycia.md` (88%, 11493 zn.)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-PPSA.md` (86%, 11492 zn.)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-KW.md` (85%, 4984 zn.)
- `prawo-polskie-v2/mcp-servers/ceidg-example/README.md` (81%, 2331 zn.)
- `audyt-systemu-v4/references/ALIASY-NAZW-AKTOW.md` (80%, 7922 zn.)
- `audyt-systemu-v4/references/F-108-lista-MS-egzamin-2026.md` (77%, 5288 zn.)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-KPC.md` (77%, 36151 zn.)
- `audyt-systemu-v4/widgets/WIDGET-MENU.md` (75%, 12283 zn.)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-OP.md` (75%, 13355 zn.)
- `audyt-systemu-v4/references/migracja-jurysdykcji/PLAN-I-MAPA.md` (73%, 59902 zn.)
- `audyt-systemu-v4/references/WARN-OTWARTE.md` (71%, 47514 zn.)
- `prawo-polskie-v2/mcp-servers/README.md` (70%, 5594 zn.)

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-KSH.md` (69%)
- `audyt-systemu-v4/references/SCHEDULED-TASK-COWORK.md` (66%)
- `audyt-systemu-v4/references/FORMAT-RAPORTU-ROZNIC.md` (65%)
- `audyt-systemu-v4/references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrUp-PrRestr.md` (63%)
- `audyt-systemu-v4/references/SKRYPTY-RECZNE.md` (60%)
- `audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md` (57%)
- `audyt-systemu-v4/references/F-152-pomiar-domen-2026-09-04.md` (56%)
- `audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md` (52%)
- `audyt-systemu-v4/references/F-171-pomiar-domen-2026-09-09.md` (51%)
- `audyt-systemu-v4/SKILL.md` (50%)
- `audyt-systemu-v4/modules/MOD-TRESC-MERYTORYCZNA.md` (48%)
- `prawo-polskie-v2/mcp-servers/saos-example/README.md` (42%)
- … i 11 dalszych (udział < 39%)

### shared

Pliki: 155 — przenieść 43, rozdzielić 75, metoda 37.

Przenieść do pakietu PL (E3; odesłanie `JUR:` w skillu, test równoważności T50):
- `shared/mod-prawa-obywatelskie-srodki-karne.md` (98%, 15436 zn.) — `JUR:prawa-obywatelskie-srodki-karne`
- `shared/ISAP-METRYKI-AKTOW.md` (97%, 13127 zn.) — `JUR:isap-metryki-aktow`
- `shared/LEGAL-REGISTRY.md` (97%, 6138 zn.) — `JUR:legal-registry`
- `shared/orka-bas-leksykon/czesc-06-priorytety-P1.md` (96%, 10051 zn.) — `JUR:leksykon-priorytety-p1`
- `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` (96%, 19607 zn.) — `JUR:definicje-interes-wlasny-wylaczenia`
- `shared/orka-bas-leksykon/czesc-01-praca-admin-drogowe.md` (95%, 10142 zn.) — `JUR:leksykon-praca-admin-drogowe`
- `shared/orka-bas-leksykon/czesc-05-kandydaci-prawa-obywatelskie-sporne.md` (95%, 11413 zn.) — `JUR:leksykon-kandydaci-prawa-obywatelskie-sporne`
- `shared/orka-bas-leksykon/czesc-08-praktyka-prawnicza.md` (95%, 17071 zn.) — `JUR:leksykon-praktyka-prawnicza`
- `shared/orka-bas-leksykon/czesc-03-cywilne-niepelnosprawnosc.md` (94%, 11772 zn.) — `JUR:leksykon-cywilne-niepelnosprawnosc`
- `shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` (93%, 9515 zn.) — `JUR:definicje-odpowiedzialnosc-szkoda`
- `shared/orka-bas-leksykon/czesc-04-karne.md` (93%, 6420 zn.) — `JUR:leksykon-karne`
- `shared/mod-niewidomy-prawa-prawne.md` (92%, 19024 zn.) — `JUR:niewidomy-prawa-prawne`
- `shared/MOD-NEGACJA-DOWODOW.md` (91%, 29567 zn.)
- `shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md` (90%, 19998 zn.) — `JUR:leksykon-priorytety-p2-bas-v18`
- `shared/definicje/DEF-PODMIOTY-WLASNOSC.md` (90%, 6052 zn.) — `JUR:definicje-podmioty-wlasnosc`
- `shared/mod-niepelnosprawnosc-intelektualna-gluchota.md` (89%, 21783 zn.) — `JUR:niepelnosprawnosc-intelektualna-gluchota`
- `shared/INTERPRETACJE-URZEDOWE.md` (88%, 7035 zn.) — `JUR:interpretacje-urzedowe`
- `shared/POLISH-LAW-MAX-COVERAGE-STANDARD.md` (85%, 1280 zn.)
- `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md` (85%, 8381 zn.) — `JUR:leksykon-finanse-nieruchomosci-energetyczne`
- `shared/DOMAIN-LOCK.md` (85%, 4958 zn.)
- `shared/ORKA-BAS-VIII-X-KADENCJA.md` (84%, 35684 zn.) — `JUR:orka-bas-viii-x-kadencja`
- `shared/definicje/DEF-PRACA.md` (82%, 19838 zn.) — `JUR:definicje-praca`
- `shared/LEGAL-LIFECYCLE-MANAGEMENT.md` (81%, 1721 zn.)
- `shared/PRAWO-HARDGATE-BLOKADA.md` (79%, 12534 zn.) — `JUR:prawo-hardgate-blokada`
- `shared/ZAZALENIE-ADRESAT-GATE.md` (79%, 8959 zn.) — `JUR:zazalenie-adresat-gate`
- `shared/POLISH-LAW-COMPLETENESS-MATRIX.md` (78%, 2449 zn.) — `JUR:polish-law-completeness-matrix`
- `shared/definicje/DEF-ADMINISTRACYJNE.md` (78%, 2409 zn.) — `JUR:definicje-administracyjne`
- `shared/SKILL.md` (78%, 32855 zn.)
- `shared/ZAWIADOMIENIA-KRZYZOWE.md` (76%, 9016 zn.) — `JUR:zawiadomienia-krzyzowe`
- `shared/mod-osoba-niewidoma-prawa-sad.md` (76%, 14805 zn.) — `JUR:osoba-niewidoma-prawa-sad`
- `shared/agents/weryfikator-isap.md` (76%, 2857 zn.) — `JUR:agent-weryfikator-isap`
- `shared/definicje/DEF-PROCEDURA.md` (76%, 3968 zn.) — `JUR:definicje-procedura`
- `shared/definicje/DEF-PODATKOWE.md` (76%, 5326 zn.) — `JUR:definicje-podatkowe`
- `shared/definicje/DEF-BUDOWLANE-DROGOWE.md` (75%, 5084 zn.) — `JUR:definicje-budowlane-drogowe`
- `shared/terminy.md` (75%, 71687 zn.) — `JUR:terminy-procesowe`
- `shared/PRE-W2-VERIFICATION-GATE.md` (74%, 14144 zn.) — `JUR:pre-w2-verification-gate`
- `shared/TRYBY-PROCESOWE.md` (73%, 1566 zn.) — `JUR:tryby-procesowe`
- `shared/definicje/DEF-CYWILNE-WYKLADNIA.md` (73%, 2102 zn.) — `JUR:definicje-cywilne-wykladnia`
- `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` (73%, 30866 zn.) — `JUR:identyfikacja-strony-umowy`
- `shared/STALKING-NEKANIE.md` (73%, 5233 zn.) — `JUR:stalking-nekanie`
- `shared/TEMPORAL-LAW-CHECK.md` (71%, 6631 zn.)
- `shared/MOD-DOKUMENT-ANOMALIE_v1.1.0.md` (70%, 8119 zn.)
- `shared/FORMAT-CYTOWANIA.md` (70%, 5688 zn.) — `JUR:format-cytowania`

Rozdzielić (metoda zostaje, akapity z prawem krajowym → moduł PL z kluczem):
- `shared/ORZECZENIA-HIERARCHIA.md` (69%)
- `shared/ISAP-AUDIT-PROTOCOL.md` (69%)
- `shared/SCHEMAT-ODPOWIEDZI-MCP.md` (69%)
- `shared/PORTALE-BRANZOWE-RZAD-2B.md` (69%)
- `shared/WLASCIWOSC-GATE.md` (68%)
- `shared/TABELE-OPLAT.md` (67%)
- `shared/PRAWO-HARDGATE.md` (67%)
- `shared/MOD-ATAK-NA-SWIADKA.md` (67%)
- `shared/MOD-ATAK-NA-DOWOD.md` (66%)
- `shared/KONEKTORY-REKOMENDOWANE.md` (65%)
- `shared/LEGAL-QUALITY-GATE.md` (65%)
- `shared/DEFINICJE-KLUCZOWE.md` (64%)
- … i 63 dalszych (udział < 63%)

## 3. Mapa kategorii (E0b)

Wygenerowane: `python3 scripts/mapa_jurysdykcji.py <katalog skilli>` (skille wykonawcze, shared, prawny-router-v3; pliki ≥ 1500 znaków). Klasa: MODUŁ PL ≥ 70% treści w akapitach z prawem krajowym, METODA < 15%, pomiędzy — MIESZANY (do rozdzielenia przy migracji). Kolumna „Klucz” — adres w `prawo-polskie-v2/JURYSDYKCJA.md`. Pomiar słownikowy: fałszywe trafienia wykluczone z kluczy ręcznie (np. `prawny-router-v3/references/SELF-CHECK.md` — metoda z nazwami źródeł).

## Warstwa aplikacji (lex-runtime), poza zakresem skilli

| Kategoria | Pliki (≥ 5 trafień) | Przykłady |
|---|---:|---|
| źródła prawa PL (ELI, ISAP, Dz.U.) | 31 | core-law-index, core-law-tool-runtime, verification-tool-runtime, temporal-source-freshness |
| orzecznictwo PL (SN, SAOS, CBOSA, portal) | 26 | case-law-search, case-law-verifier, court-of-signature |
| rejestry (KRS, biała lista, CEIDG, NBP) | 6 | privacy/registry-enrichment, lex-mcp-connectors, courts/court-base-data |
| anonimizacja (Morfeusz, PESEL, imiona) | 3 | privacy/pesel-names, privacy/pseudonymizer |
| skróty aktów (KPC, KPK, KPA…) | 8 | finalization-gate, act-map-resolver, legal-act-abbreviations |
| kwoty w zł | 4 | amount-references, ocr-amounts, document-citations |
| polskie wyrażenia w regułach i komunikatach | 107 | courts/court-base-data, case-semantic-check, session-executor |

Inna jurysdykcja w aplikacji = dostawca jurysdykcji (weryfikator przepisów, źródła orzeczeń, rejestry, anonimizator, baza sądów, wzorce dokumentów) — etap E6.

## Skille

Pliki: 338 — MODUŁ PL 86, MIESZANY 172, METODA 80

| Klasa | Plik | Udział PL | Kategorie (liczba trafień) | Klucz |
|---|---|---:|---|---|
| MODUŁ PL | `analizator-umow-v1/references/mod-J7-pzp.md` | 99% | typy umów 61, akty i przepisy 41, źródła i bazy 11, wymogi pism 1 | `JUR:umowy-j7-pzp` |
| MODUŁ PL | `prawny-router-v3/references/SELF-CHECK.md` | 98% | źródła i bazy 12, opłaty 5, akty i przepisy 3, waluta 2 |  |
| MODUŁ PL | `shared/mod-prawa-obywatelskie-srodki-karne.md` | 98% | akty i przepisy 40, zawody 8, organy 2, źródła i bazy 1 | `JUR:prawa-obywatelskie-srodki-karne` |
| MODUŁ PL | `shared/ISAP-METRYKI-AKTOW.md` | 97% | akty i przepisy 74, źródła i bazy 57, organy 7, sądy i procedura 3 | `JUR:isap-metryki-aktow` |
| MODUŁ PL | `shared/LEGAL-REGISTRY.md` | 97% | źródła i bazy 31, akty i przepisy 25, organy 20, opłaty 2 | `JUR:legal-registry` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-06-priorytety-P1.md` | 96% | akty i przepisy 21, sądy i procedura 13, sygnatury 5, źródła i bazy 2 | `JUR:leksykon-priorytety-p1` |
| MODUŁ PL | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | 96% | akty i przepisy 47, sądy i procedura 5, identyfikatory 5, zawody 4 | `JUR:definicje-interes-wlasny-wylaczenia` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-01-praca-admin-drogowe.md` | 95% | akty i przepisy 44, sądy i procedura 2, źródła i bazy 2, opłaty 1 | `JUR:leksykon-praca-admin-drogowe` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-05-kandydaci-prawa-obywatelskie-sporne.md` | 95% | akty i przepisy 33, waluta 11, sądy i procedura 7, organy 6 | `JUR:leksykon-kandydaci-prawa-obywatelskie-sporne` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-08-praktyka-prawnicza.md` | 95% | akty i przepisy 60, wymogi pism 10, opłaty 6, typy umów 6 | `JUR:leksykon-praktyka-prawnicza` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-03-cywilne-niepelnosprawnosc.md` | 94% | akty i przepisy 36, wymogi pism 1, źródła i bazy 1, organy 1 | `JUR:leksykon-cywilne-niepelnosprawnosc` |
| MODUŁ PL | `analizator-umow-v1/references/mod-J5-umowy-wykonawcze.md` | 94% | źródła i bazy 10, typy umów 8, akty i przepisy 6, organy 4 | `JUR:umowy-j5-umowy-wykonawcze` |
| MODUŁ PL | `shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | 93% | akty i przepisy 26, sygnatury 4, źródła i bazy 2, waluta 2 | `JUR:definicje-odpowiedzialnosc-szkoda` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-04-karne.md` | 93% | akty i przepisy 26, źródła i bazy 1 | `JUR:leksykon-karne` |
| MODUŁ PL | `analizator-umow-v1/references/mod-FA-founders-dokumenty-zalozycielskie.md` | 93% | akty i przepisy 33, identyfikatory 11, źródła i bazy 6, organy 3 | `JUR:umowy-fa-founders-dokumenty-zalozycielskie` |
| MODUŁ PL | `analizator-umow-v1/references/mod-J2-nieruchomosci.md` | 93% | typy umów 59, akty i przepisy 16, źródła i bazy 14, identyfikatory 4 | `JUR:umowy-j2-nieruchomosci` |
| MODUŁ PL | `shared/mod-niewidomy-prawa-prawne.md` | 92% | akty i przepisy 32, organy 11, źródła i bazy 10, waluta 8 | `JUR:niewidomy-prawa-prawne` |
| MODUŁ PL | `analizator-umow-v1/references/mod-J8-b2c.md` | 91% | akty i przepisy 37, typy umów 36, źródła i bazy 10, organy 9 | `JUR:umowy-j8-b2c` |
| MODUŁ PL | `shared/MOD-NEGACJA-DOWODOW.md` | 91% | akty i przepisy 81, źródła i bazy 22, sygnatury 13, wymogi pism 5 |  |
| MODUŁ PL | `pisma-proste-v2/references/SPJ-interpretacja-zus.md` | 91% | organy 21, opłaty 11, identyfikatory 4, waluta 4 | `JUR:pisma-proste-spj-interpretacja-zus` |
| MODUŁ PL | `analizator-umow-v1/references/umowy-o-prace.md` | 91% | akty i przepisy 37, źródła i bazy 29, typy umów 12, sądy i procedura 4 | `JUR:umowy-umowy-o-prace` |
| MODUŁ PL | `analizator-umow-v1/references/mod-shared-rodo.md` | 91% | akty i przepisy 19, organy 13, wymogi pism 3, źródła i bazy 1 | `JUR:umowy-shared-rodo` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md` | 90% | akty i przepisy 54, organy 4, źródła i bazy 3, opłaty 2 | `JUR:leksykon-priorytety-p2-bas-v18` |
| MODUŁ PL | `analizator-umow-v1/references/mod-J0-routing.md` | 90% | typy umów 26, identyfikatory 3, akty i przepisy 2, źródła i bazy 1 | `JUR:umowy-j0-routing` |
| MODUŁ PL | `shared/definicje/DEF-PODMIOTY-WLASNOSC.md` | 90% | akty i przepisy 26, źródła i bazy 7, typy umów 4, identyfikatory 2 | `JUR:definicje-podmioty-wlasnosc` |
| MODUŁ PL | `shared/mod-niepelnosprawnosc-intelektualna-gluchota.md` | 89% | akty i przepisy 47, organy 12, waluta 11, źródła i bazy 9 | `JUR:niepelnosprawnosc-intelektualna-gluchota` |
| MODUŁ PL | `shared/INTERPRETACJE-URZEDOWE.md` | 88% | organy 34, zawody 5, źródła i bazy 3, sądy i procedura 2 | `JUR:interpretacje-urzedowe` |
| MODUŁ PL | `analizator-dowodow-v3/modules/MD3b-walidacja-prawna.md` | 87% | akty i przepisy 14, źródła i bazy 2, sygnatury 1 | `JUR:dowody-md3b-walidacja-prawna` |
| MODUŁ PL | `orzeczenia-sadowe-v2/references/widget.md` | 87% | akty i przepisy 5, sądy i procedura 2, sygnatury 1 |  |
| MODUŁ PL | `prawny-router-v3/references/ROUTING-BJ-BW.md` | 87% | organy 28, zawody 5, typy umów 4, opłaty 3 | `JUR:router-routing-bj-bw` |
| MODUŁ PL | `prawny-router-v3/references/ZRODLA-AKTOW-FALLBACK.md` | 87% | źródła i bazy 29 | `JUR:zrodla-aktow` |
| MODUŁ PL | `przesluchanie-swiadkow-v2-min90/references/PRAWO-HARDGATE-WITNESS.md` | 86% | akty i przepisy 28, źródła i bazy 10, opłaty 1 | `JUR:przesluchanie-prawo-hardgate-witness` |
| MODUŁ PL | `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md` | 85% | akty i przepisy 25, źródła i bazy 2, typy umów 2, opłaty 1 | `JUR:leksykon-finanse-nieruchomosci-energetyczne` |
| MODUŁ PL | `shared/DOMAIN-LOCK.md` | 85% | akty i przepisy 2, źródła i bazy 1, organy 1, typy umów 1 |  |
| MODUŁ PL | `analizator-umow-v1/references/zakaz-konkurencji.md` | 85% | akty i przepisy 54, typy umów 32, źródła i bazy 29, sygnatury 12 | `JUR:umowy-zakaz-konkurencji` |
| MODUŁ PL | `pisma-procesowe-v3/references/W3-PODMIOT-GATE.md` | 84% | identyfikatory 29, sądy i procedura 6, organy 2, typy umów 1 | `JUR:pisma-w3-podmiot-gate` |
| MODUŁ PL | `pisma-proste-v2/references/SPB-zarzuty.md` | 84% | akty i przepisy 21, opłaty 17, waluta 17, identyfikatory 4 | `JUR:pisma-proste-spb-zarzuty` |
| MODUŁ PL | `shared/ORKA-BAS-VIII-X-KADENCJA.md` | 84% | akty i przepisy 58, organy 18, typy umów 18, źródła i bazy 12 | `JUR:orka-bas-viii-x-kadencja` |
| MODUŁ PL | `orzeczenia-sadowe-v2/SKILL.md` | 82% | źródła i bazy 97, sądy i procedura 48, typy umów 10, akty i przepisy 7 |  |
| MODUŁ PL | `analizator-dowodow-v3/modules/MP10-koszty.md` | 82% | opłaty 76, akty i przepisy 62, waluta 54, wymogi pism 15 | `JUR:dowody-mp10-koszty` |
| MODUŁ PL | `shared/definicje/DEF-PRACA.md` | 82% | akty i przepisy 33, źródła i bazy 10, organy 9, typy umów 7 | `JUR:definicje-praca` |
| MODUŁ PL | `shared/LEGAL-LIFECYCLE-MANAGEMENT.md` | 81% | źródła i bazy 6, akty i przepisy 2, opłaty 1, organy 1 |  |
| MODUŁ PL | `pisma-proste-v2/references/SPH-inne.md` | 81% | akty i przepisy 49, wymogi pism 29, opłaty 25, identyfikatory 16 | `JUR:pisma-proste-sph-inne` |
| MODUŁ PL | `pisma-proste-v2/references/SPL-skarga-komornik.md` | 80% | zawody 25, akty i przepisy 9, sądy i procedura 5, wymogi pism 3 | `JUR:pisma-proste-spl-skarga-komornik` |
| MODUŁ PL | `pisma-proste-v2/references/SPA-sprzeciw.md` | 80% | wymogi pism 14, akty i przepisy 11, sądy i procedura 8, identyfikatory 4 | `JUR:pisma-proste-spa-sprzeciw` |
| MODUŁ PL | `prawny-router-v3/references/pokrycie-dziedzinowe.md` | 80% | typy umów 5, organy 3, akty i przepisy 2, źródła i bazy 2 | `JUR:router-pokrycie-dziedzinowe` |
| MODUŁ PL | `pisma-procesowe-v3/references/MODULY-MAPA.md` | 80% | wymogi pism 20, sądy i procedura 4, organy 4, identyfikatory 3 |  |
| MODUŁ PL | `pisma-proste-v2/references/M6-oplaty.md` | 80% | opłaty 134, akty i przepisy 92, waluta 89, wymogi pism 26 | `JUR:pisma-proste-m6-oplaty` |
| MODUŁ PL | `shared/PRAWO-HARDGATE-BLOKADA.md` | 79% | źródła i bazy 24, akty i przepisy 10, sądy i procedura 2 | `JUR:prawo-hardgate-blokada` |
| MODUŁ PL | `shared/ZAZALENIE-ADRESAT-GATE.md` | 79% | wymogi pism 26, akty i przepisy 19, sądy i procedura 4, organy 3 | `JUR:zazalenie-adresat-gate` |
| MODUŁ PL | `shared/POLISH-LAW-COMPLETENESS-MATRIX.md` | 78% | źródła i bazy 3, sądy i procedura 2, organy 2, akty i przepisy 1 | `JUR:polish-law-completeness-matrix` |
| MODUŁ PL | `shared/definicje/DEF-ADMINISTRACYJNE.md` | 78% | akty i przepisy 7, źródła i bazy 1 | `JUR:definicje-administracyjne` |
| MODUŁ PL | `pisma-procesowe-v3/modules/MOD-OPLATY.md` | 78% | akty i przepisy 102, opłaty 96, waluta 63, wymogi pism 33 | `JUR:pisma-oplaty` |
| MODUŁ PL | `shared/SKILL.md` | 78% | akty i przepisy 20, źródła i bazy 17, opłaty 11, wymogi pism 8 |  |
| MODUŁ PL | `analizator-umow-v1/references/mod-shared-fm-hardship.md` | 77% | akty i przepisy 15, źródła i bazy 6, typy umów 3, organy 1 | `JUR:umowy-shared-fm-hardship` |
| MODUŁ PL | `analizator-dowodow-v3/modules/MP11-rodo-cyber.md` | 77% | akty i przepisy 46, organy 12, źródła i bazy 3, wymogi pism 2 | `JUR:dowody-mp11-rodo-cyber` |
| MODUŁ PL | `analizator-dowodow-v3/modules/MX-dziedziny.md` | 77% | akty i przepisy 20, organy 6, sądy i procedura 5, terminy 4 | `JUR:dowody-mx-dziedziny` |
| MODUŁ PL | `analizator-umow-v1/references/mod-J10-ubezpieczenia.md` | 77% | akty i przepisy 14, typy umów 9, źródła i bazy 5, organy 5 | `JUR:umowy-j10-ubezpieczenia` |
| MODUŁ PL | `analizator-umow-v1/references/mod-MA-transakcje.md` | 76% | akty i przepisy 17, źródła i bazy 11, organy 10, identyfikatory 8 | `JUR:umowy-ma-transakcje` |
| MODUŁ PL | `shared/ZAWIADOMIENIA-KRZYZOWE.md` | 76% | organy 50, akty i przepisy 19, sądy i procedura 1 | `JUR:zawiadomienia-krzyzowe` |
| MODUŁ PL | `shared/mod-osoba-niewidoma-prawa-sad.md` | 76% | akty i przepisy 29, źródła i bazy 10, zawody 7, sądy i procedura 4 | `JUR:osoba-niewidoma-prawa-sad` |
| MODUŁ PL | `shared/agents/weryfikator-isap.md` | 76% | źródła i bazy 7, waluta 2 | `JUR:agent-weryfikator-isap` |
| MODUŁ PL | `shared/definicje/DEF-PROCEDURA.md` | 76% | akty i przepisy 9, wymogi pism 4, organy 2, terminy 1 | `JUR:definicje-procedura` |
| MODUŁ PL | `shared/definicje/DEF-PODATKOWE.md` | 76% | akty i przepisy 17, źródła i bazy 7, organy 4, typy umów 2 | `JUR:definicje-podatkowe` |
| MODUŁ PL | `analizator-umow-v1/references/mod-shared-orzecznictwo-umow.md` | 76% | źródła i bazy 23, akty i przepisy 17, typy umów 8, sądy i procedura 7 | `JUR:umowy-shared-orzecznictwo-umow` |
| MODUŁ PL | `analizator-dowodow-v3/modules/MP12-terminy.md` | 76% | akty i przepisy 31, wymogi pism 12, źródła i bazy 8, organy 4 | `JUR:dowody-mp12-terminy` |
| MODUŁ PL | `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` | 75% | identyfikatory 58, akty i przepisy 18, źródła i bazy 12, sygnatury 10 | `JUR:pisma-pracodawca-rzeczywisty` |
| MODUŁ PL | `shared/definicje/DEF-BUDOWLANE-DROGOWE.md` | 75% | akty i przepisy 7, źródła i bazy 5, sądy i procedura 2, wymogi pism 2 | `JUR:definicje-budowlane-drogowe` |
| MODUŁ PL | `analizator-umow-v1/references/mod-shared-abusive-clauses.md` | 75% | organy 24, akty i przepisy 17, typy umów 17, źródła i bazy 13 | `JUR:umowy-shared-abusive-clauses` |
| MODUŁ PL | `shared/terminy.md` | 75% | akty i przepisy 379, wymogi pism 61, opłaty 28, terminy 26 | `JUR:terminy-procesowe` |
| MODUŁ PL | `analizator-umow-v1/references/b2b-podwykonawcze.md` | 74% | akty i przepisy 39, typy umów 37, źródła i bazy 31, organy 23 | `JUR:umowy-b2b-podwykonawcze` |
| MODUŁ PL | `pisma-proste-v2/references/SPF-SPG.md` | 74% | akty i przepisy 38, opłaty 25, waluta 10, wymogi pism 9 | `JUR:pisma-proste-spf-spg` |
| MODUŁ PL | `analizator-umow-v1/references/generator/essentialia-regulaminy-i-korporacyjne.md` | 74% | akty i przepisy 18, identyfikatory 6, wymogi pism 3, typy umów 2 | `JUR:umowy-essentialia-regulaminy-i-korporacyjne` |
| MODUŁ PL | `pisma-procesowe-v3/modules/MOD-PRAWO.md` | 74% | akty i przepisy 6, wymogi pism 2, źródła i bazy 2, organy 2 | `JUR:pisma-prawo` |
| MODUŁ PL | `shared/PRE-W2-VERIFICATION-GATE.md` | 74% | identyfikatory 83, sądy i procedura 12, organy 5 | `JUR:pre-w2-verification-gate` |
| MODUŁ PL | `shared/TRYBY-PROCESOWE.md` | 73% | wymogi pism 11, opłaty 3, zawody 2, akty i przepisy 1 | `JUR:tryby-procesowe` |
| MODUŁ PL | `shared/definicje/DEF-CYWILNE-WYKLADNIA.md` | 73% | typy umów 5, akty i przepisy 2, źródła i bazy 1 | `JUR:definicje-cywilne-wykladnia` |
| MODUŁ PL | `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` | 73% | identyfikatory 105, akty i przepisy 16, sądy i procedura 5, typy umów 5 | `JUR:identyfikacja-strony-umowy` |
| MODUŁ PL | `shared/STALKING-NEKANIE.md` | 73% | wymogi pism 14, akty i przepisy 10, źródła i bazy 4, organy 4 | `JUR:stalking-nekanie` |
| MODUŁ PL | `analizator-umow-v1/references/mod-J21-rodo-archiwizacja-regulaminy.md` | 71% | akty i przepisy 61, organy 17, źródła i bazy 9, wymogi pism 2 | `JUR:umowy-j21-rodo-archiwizacja-regulaminy` |
| MODUŁ PL | `shared/TEMPORAL-LAW-CHECK.md` | 71% | akty i przepisy 3, źródła i bazy 2 |  |
| MODUŁ PL | `przesluchanie-swiadkow-v2-min90/references/CROSS-EXAMINATION-GATE.md` | 71% | źródła i bazy 5, akty i przepisy 2 |  |
| MODUŁ PL | `shared/MOD-DOKUMENT-ANOMALIE_v1.1.0.md` | 70% | identyfikatory 52, organy 2, typy umów 2, akty i przepisy 1 |  |
| MODUŁ PL | `pisma-procesowe-v3/references/AUTOMAT-STANOW.md` | 70% | identyfikatory 25, organy 8, wymogi pism 7, źródła i bazy 3 |  |
| MODUŁ PL | `analizator-umow-v1/references/mod-J4-finansowanie.md` | 70% | źródła i bazy 8, akty i przepisy 5, waluta 4, opłaty 3 | `JUR:umowy-j4-finansowanie` |
| MODUŁ PL | `shared/FORMAT-CYTOWANIA.md` | 70% | akty i przepisy 28, źródła i bazy 8, opłaty 1 | `JUR:format-cytowania` |
| MIESZANY | `shared/ORZECZENIA-HIERARCHIA.md` | 69% | sądy i procedura 17, źródła i bazy 14, organy 7, akty i przepisy 1 | `JUR:orzecznictwo-hierarchia` |
| MIESZANY | `shared/ISAP-AUDIT-PROTOCOL.md` | 69% | źródła i bazy 14, akty i przepisy 4 |  |
| MIESZANY | `shared/SCHEMAT-ODPOWIEDZI-MCP.md` | 69% | sądy i procedura 5, źródła i bazy 2, akty i przepisy 1, identyfikatory 1 |  |
| MIESZANY | `shared/PORTALE-BRANZOWE-RZAD-2B.md` | 69% | organy 3, opłaty 2, wymogi pism 1, typy umów 1 | `JUR:portale-branzowe` |
| MIESZANY | `pisma-procesowe-v3/references/SELF-CHECK-PISMA.md` | 69% | identyfikatory 18, sądy i procedura 4, organy 3, akty i przepisy 1 |  |
| MIESZANY | `prawny-router-v3/references/SOCIAL-SECURITY-LAW-STANDARD.md` | 68% | organy 7, sądy i procedura 3, wymogi pism 1, źródła i bazy 1 |  |
| MIESZANY | `shared/WLASCIWOSC-GATE.md` | 68% | sądy i procedura 10, akty i przepisy 9, źródła i bazy 3, waluta 3 | `JUR:wlasciwosc-sadow` |
| MIESZANY | `pisma-proste-v2/references/SPN-wypowiedzenie.md` | 68% | akty i przepisy 59, źródła i bazy 10, typy umów 6, opłaty 3 |  |
| MIESZANY | `shared/TABELE-OPLAT.md` | 67% | opłaty 43, akty i przepisy 9, waluta 4, sądy i procedura 3 | `JUR:oplaty-sadowe` |
| MIESZANY | `pisma-proste-v2/references/M9-format.md` | 67% | opłaty 5, wymogi pism 4, akty i przepisy 1, organy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-wykladnia.md` | 67% | akty i przepisy 14, źródła i bazy 11, typy umów 3, waluta 2 |  |
| MIESZANY | `shared/PRAWO-HARDGATE.md` | 67% | źródła i bazy 73, akty i przepisy 24, sądy i procedura 3, organy 2 | `JUR:weryfikacja-przepisow-kanon` |
| MIESZANY | `shared/MOD-ATAK-NA-SWIADKA.md` | 67% | akty i przepisy 18, źródła i bazy 6, organy 5 |  |
| MIESZANY | `shared/MOD-ATAK-NA-DOWOD.md` | 66% | akty i przepisy 50, źródła i bazy 4, sygnatury 4, opłaty 2 |  |
| MIESZANY | `shared/KONEKTORY-REKOMENDOWANE.md` | 65% | źródła i bazy 69, identyfikatory 22, sądy i procedura 20, organy 18 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-SZABLONY.md` | 65% | akty i przepisy 25, sądy i procedura 17, identyfikatory 17, waluta 16 |  |
| MIESZANY | `shared/DEFINICJE-KLUCZOWE.md` | 64% | akty i przepisy 4, typy umów 3, opłaty 1, źródła i bazy 1 |  |
| MIESZANY | `shared/MOD-LANCUCH-DOWODOWY.md` | 63% | akty i przepisy 16, źródła i bazy 2, organy 1 |  |
| MIESZANY | `shared/tools/przyklad-adapter-normalizujacy.md` | 63% | źródła i bazy 2, akty i przepisy 1 |  |
| MIESZANY | `prawny-router-v3/references/KROK1-detekcja.md` | 63% | źródła i bazy 14, organy 11, wymogi pism 2, akty i przepisy 1 |  |
| MIESZANY | `analiza-sadowa-v6/references/BLUEPRINT-SCHEMA.md` | 63% | akty i przepisy 5, źródła i bazy 1 |  |
| MIESZANY | `shared/NAZEWNICTWO-STRON.md` | 62% | akty i przepisy 35, sądy i procedura 27, identyfikatory 19, wymogi pism 13 | `JUR:nazewnictwo-stron` |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-KOSZT-ODPOWIEDZI.md` | 62% | akty i przepisy 8, organy 2, typy umów 1 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-ELIMINACJA-TEZ.md` | 62% | źródła i bazy 18, akty i przepisy 9, identyfikatory 3, organy 2 |  |
| MIESZANY | `shared/oplaty/05-sprawy-karne.md` | 62% | akty i przepisy 35, waluta 30, opłaty 26, wymogi pism 5 | `JUR:oplaty-sprawy-karne` |
| MIESZANY | `shared/MODULE-STANDARD-POLISH-LAW.md` | 62% | źródła i bazy 5, akty i przepisy 1, opłaty 1, sądy i procedura 1 | `JUR:standard-modulu-prawa-krajowego` |
| MIESZANY | `shared/PRAWO-HARDGATE-ORZECZENIA.md` | 61% | sądy i procedura 30, źródła i bazy 30, zawody 19, akty i przepisy 8 | `JUR:weryfikacja-orzeczen-kanon` |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-BUDOWA-ARGUMENTU.md` | 61% | akty i przepisy 4, organy 2, typy umów 1 |  |
| MIESZANY | `pisma-proste-v2/references/SPO-reklamacja.md` | 60% | akty i przepisy 20, typy umów 20, źródła i bazy 6, opłaty 2 |  |
| MIESZANY | `analizator-dowodow-v3/modules/MP5-atak.md` | 60% | akty i przepisy 7, wymogi pism 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-core-checklist.md` | 59% | akty i przepisy 34, typy umów 21, organy 12, źródła i bazy 11 |  |
| MIESZANY | `analizator-umow-v1/references/poufnosc-nda.md` | 59% | akty i przepisy 11, źródła i bazy 9, identyfikatory 2, typy umów 2 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-lifecycle.md` | 59% | źródła i bazy 6, akty i przepisy 4, typy umów 2, waluta 1 |  |
| MIESZANY | `analizator-dowodow-v3/modules/MD1-klasyfikacja.md` | 59% | akty i przepisy 3, organy 3, identyfikatory 3, zawody 1 |  |
| MIESZANY | `analiza-sadowa-v6/references/koszty-terminy.md` | 58% | waluta 100, akty i przepisy 66, opłaty 55, wymogi pism 25 | `JUR:analiza-koszty-terminy` |
| MIESZANY | `shared/portale-branzowe-rzad-2b/czesc-01-niepelnosprawni-dr02-dr04.md` | 58% | organy 16, akty i przepisy 9, typy umów 5, zawody 3 |  |
| MIESZANY | `analizator-umow-v1/references/mod-J3-dystrybucja.md` | 58% | opłaty 8, źródła i bazy 5, akty i przepisy 4, typy umów 1 |  |
| MIESZANY | `pisma-proste-v2/references/SPK-skarga-do-UODO.md` | 56% | akty i przepisy 21, organy 15, sądy i procedura 8, opłaty 5 |  |
| MIESZANY | `shared/FORMAL-CHECK.md` | 56% | wymogi pism 13, opłaty 5, identyfikatory 4, sądy i procedura 2 | `JUR:wymogi-formalne-pism` |
| MIESZANY | `analizator-dowodow-v3/modules/MD-NARR-raport-narracyjny.md` | 56% | akty i przepisy 1, źródła i bazy 1 |  |
| MIESZANY | `shared/definicje/METODOLOGIA-ORKA2.md` | 56% | organy 3, źródła i bazy 1 |  |
| MIESZANY | `analizator-umow-v1/SKILL.md` | 56% | typy umów 21, organy 17, źródła i bazy 14, identyfikatory 11 |  |
| MIESZANY | `shared/portale-branzowe-rzad-2b/czesc-02-dr05-dr09.md` | 56% | sądy i procedura 5, typy umów 5, organy 2, akty i przepisy 1 |  |
| MIESZANY | `pisma-proste-v2/references/SPC-SPD-SPE.md` | 56% | akty i przepisy 23, identyfikatory 16, zawody 13, opłaty 9 |  |
| MIESZANY | `shared/LEGAL-STATUS-LOCK.md` | 54% | wymogi pism 16, akty i przepisy 12, organy 7, sądy i procedura 4 |  |
| MIESZANY | `shared/MCP-INTEGRACJA.md` | 54% | źródła i bazy 20, sądy i procedura 9, organy 6, identyfikatory 6 |  |
| MIESZANY | `przewodnik-prawny-v2/references/KROK-M.md` | 54% | źródła i bazy 4, organy 4, wymogi pism 3, typy umów 1 |  |
| MIESZANY | `shared/SYGNATURY.md` | 54% | źródła i bazy 36, sądy i procedura 33, sygnatury 20, wymogi pism 13 | `JUR:sygnatury-repertoria` |
| MIESZANY | `shared/HIERARCHIA-ZRODEL.md` | 53% | źródła i bazy 95, sądy i procedura 11, organy 10, akty i przepisy 9 | `JUR:hierarchia-zrodel` |
| MIESZANY | `pisma-procesowe-v3/references/W3-WERYFIKACJA.md` | 53% | źródła i bazy 12, akty i przepisy 7, sądy i procedura 4, wymogi pism 3 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-alt-drafts.md` | 53% | akty i przepisy 6, źródła i bazy 2, typy umów 1 |  |
| MIESZANY | `pisma-proste-v2/SKILL.md` | 53% | opłaty 56, akty i przepisy 52, wymogi pism 40, waluta 39 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-ius-cogens.md` | 53% | akty i przepisy 15, typy umów 10, zawody 1 |  |
| MIESZANY | `shared/POLISH-LAW-FINAL-COMPLETENESS-GATE.md` | 52% | źródła i bazy 7, sądy i procedura 2 | `JUR:kompletnosc-prawa-krajowego` |
| MIESZANY | `analiza-sadowa-v6/references/PRZEBIEG-3-predykcja.md` | 52% | źródła i bazy 7, akty i przepisy 6, sądy i procedura 2 |  |
| MIESZANY | `shared/DEDUPLICATION-POLICY.md` | 52% | źródła i bazy 3, sądy i procedura 2, organy 2, akty i przepisy 1 |  |
| MIESZANY | `shared/agents/recenzent-niezalezny.md` | 52% | źródła i bazy 6, wymogi pism 2, zawody 1 |  |
| MIESZANY | `pisma-procesowe-v3/references/W1-SZCZEGOLY.md` | 52% | akty i przepisy 6, waluta 4, opłaty 1, źródła i bazy 1 |  |
| MIESZANY | `analizator-umow-v1/benchmark/posiane-wady/manifesty/instrukcja-sedziego.md` | 52% | waluta 5, akty i przepisy 2, zawody 1, typy umów 1 |  |
| MIESZANY | `analizator-umow-v1/workflows/generator-dokumentow-korporacyjnych.md` | 52% | akty i przepisy 5, wymogi pism 1, zawody 1, identyfikatory 1 |  |
| MIESZANY | `pisma-proste-v2/references/SPM-skd-oswiadczenie.md` | 51% | akty i przepisy 15, identyfikatory 4, typy umów 4, opłaty 2 |  |
| MIESZANY | `shared/RATE-COMPLETENESS.md` | 51% | akty i przepisy 1, opłaty 1, źródła i bazy 1, organy 1 |  |
| MIESZANY | `shared/MOD-KARTA-DOWODU.md` | 51% | akty i przepisy 12, organy 3, waluta 2, identyfikatory 1 |  |
| MIESZANY | `shared/MOD-MAPA-PRZEPISOW.md` | 50% | akty i przepisy 8, źródła i bazy 2 |  |
| MIESZANY | `shared/WERYFIKACJA-SLAD.md` | 49% | źródła i bazy 29, akty i przepisy 15, sądy i procedura 14, sygnatury 6 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-ryzyko-kwant.md` | 49% | źródła i bazy 10, akty i przepisy 6, typy umów 3, waluta 3 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-ADMIN.md` | 48% | sądy i procedura 6, wymogi pism 5, akty i przepisy 3, organy 1 |  |
| MIESZANY | `shared/FACT-SOURCE-LOCK.md` | 48% | organy 6, wymogi pism 2, terminy 1 |  |
| MIESZANY | `pisma-proste-v2/references/SPL-interpretacja-GIP.md` | 48% | organy 13, akty i przepisy 4, sądy i procedura 2, typy umów 2 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-DOKTRYNA.md` | 46% | wymogi pism 6, organy 5, źródła i bazy 1 |  |
| MIESZANY | `przesluchanie-swiadkow-v2-min90/references/QUESTION-ADMISSIBILITY-GATE.md` | 46% | akty i przepisy 15, źródła i bazy 6, opłaty 1, organy 1 |  |
| MIESZANY | `pisma-procesowe-v3/references/W2-SZCZEGOLY.md` | 46% | wymogi pism 5, akty i przepisy 2 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-regulatory-horizon.md` | 46% | akty i przepisy 8, źródła i bazy 2, zawody 2, typy umów 1 |  |
| MIESZANY | `shared/MOD-STRATEGIA-WYBOR.md` | 46% | identyfikatory 27, akty i przepisy 5, organy 2 |  |
| MIESZANY | `shared/TERM-CALC.md` | 46% | wymogi pism 3, sądy i procedura 1 | `JUR:liczenie-terminow` |
| MIESZANY | `analiza-sadowa-v6/references/moduly-spec.md` | 45% | akty i przepisy 12, zawody 1 |  |
| MIESZANY | `analiza-sadowa-v6/references/MOD-F.md` | 45% | akty i przepisy 1, zawody 1 |  |
| MIESZANY | `shared/oplaty/04-wartosci-powtarzalne-kotwice.md` | 45% | akty i przepisy 42, waluta 14, organy 7, źródła i bazy 2 | `JUR:oplaty-wartosci-powtarzalne` |
| MIESZANY | `shared/ACTIVATION-MATRIX.md` | 44% | wymogi pism 4, organy 4, sądy i procedura 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-J9-ip-prawa-autorskie.md` | 44% | akty i przepisy 28, źródła i bazy 11, organy 4, typy umów 3 |  |
| MIESZANY | `shared/CLAIM-VALIDATION.md` | 44% | akty i przepisy 5, wymogi pism 2, źródła i bazy 2 |  |
| MIESZANY | `analizator-przepisow-v2/SKILL.md` | 44% | źródła i bazy 34, akty i przepisy 8, sądy i procedura 6, waluta 4 |  |
| MIESZANY | `shared/oplaty/07-komornicze-skarbowe-notarialne.md` | 44% | waluta 56, opłaty 39, akty i przepisy 37, zawody 13 | `JUR:oplaty-komornicze-skarbowe-notarialne` |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-ROUTE.md` | 43% | sądy i procedura 2, wymogi pism 2, organy 1 |  |
| MIESZANY | `shared/DOSTEP-MASZYNOWY-API.md` | 43% | źródła i bazy 81, identyfikatory 26, sądy i procedura 24, sygnatury 16 |  |
| MIESZANY | `pisma-proste-v2/references/SPR-odstapienie.md` | 43% | akty i przepisy 14, typy umów 10, opłaty 2, źródła i bazy 2 |  |
| MIESZANY | `analiza-sadowa-v6/references/engines/contradiction-case-analysis-v10.md` | 43% | akty i przepisy 1 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-STRESS-TEST.md` | 41% | identyfikatory 5, zawody 3, organy 2, waluta 2 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-legal-design.md` | 41% | typy umów 8, akty i przepisy 2, źródła i bazy 1 |  |
| MIESZANY | `shared/MOD-GRAF-PRZYCZYNOWY.md` | 41% | akty i przepisy 19, sądy i procedura 2, źródła i bazy 2 |  |
| MIESZANY | `analizator-umow-v1/workflows/generator-dokumentow-hr-rodo.md` | 41% | akty i przepisy 10, wymogi pism 1 |  |
| MIESZANY | `analizator-umow-v1/references/generator/kategorie-klauzul-taksonomia.md` | 41% | akty i przepisy 3, opłaty 3, terminy 1, zawody 1 |  |
| MIESZANY | `analizator-umow-v1/references/generator/boilerplate-strukturalne.md` | 41% | identyfikatory 10, akty i przepisy 5, opłaty 3, typy umów 3 |  |
| MIESZANY | `analizator-umow-v1/references/mod-J6-it-konsorcjum.md` | 41% | akty i przepisy 15, typy umów 6, źródła i bazy 5, opłaty 3 |  |
| MIESZANY | `shared/PRAWO-HARDGATE-AKT-MIEJSCOWY.md` | 40% | źródła i bazy 3, sądy i procedura 1 |  |
| MIESZANY | `shared/oplaty/02-zwolnienia-zwrot-alimenty.md` | 40% | akty i przepisy 62, opłaty 41, wymogi pism 24, organy 4 | `JUR:oplaty-zwolnienia-zwrot-alimenty` |
| MIESZANY | `shared/MOD-STEP-TRACKER.md` | 40% | źródła i bazy 2, organy 1 |  |
| MIESZANY | `analizator-dowodow-v3/checklists/kontrola-jakosci.md` | 38% | źródła i bazy 1 |  |
| MIESZANY | `analizator-umow-v1/workflows/triage-szybki.md` | 38% | akty i przepisy 6, typy umów 5, identyfikatory 2, waluta 2 |  |
| MIESZANY | `shared/DEPENDENCY-GRAPH.md` | 38% | typy umów 6, źródła i bazy 3, sądy i procedura 2, organy 2 |  |
| MIESZANY | `analizator-dowodow-v3/SKILL.md` | 38% | akty i przepisy 20, wymogi pism 12, źródła i bazy 6, organy 4 |  |
| MIESZANY | `shared/MOD-MACIERZ-DOWOD-TEZA.md` | 37% | akty i przepisy 8, identyfikatory 5, organy 4, waluta 2 |  |
| MIESZANY | `shared/oplaty/06-administracyjne-wieczystoksiegowe-KIO.md` | 37% | waluta 30, opłaty 17, akty i przepisy 16, wymogi pism 2 | `JUR:oplaty-administracyjne-wieczystoksiegowe-kio` |
| MIESZANY | `analizator-przepisow-v2/references/MOD-ORZECZ-POWIAZANIA-HISTORIA.md` | 37% | sądy i procedura 17, źródła i bazy 16, akty i przepisy 4 |  |
| MIESZANY | `przewodnik-prawny-v2/SKILL.md` | 34% | źródła i bazy 22, wymogi pism 6, organy 6, zawody 3 |  |
| MIESZANY | `shared/agents/weryfikator-orzeczen.md` | 34% | sądy i procedura 5, waluta 2, źródła i bazy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-antywzorce-jezykowe.md` | 33% | akty i przepisy 6, opłaty 2, zawody 1 |  |
| MIESZANY | `shared/portale-branzowe-rzad-2b/czesc-03-dr10-dr16.md` | 33% | organy 16, zawody 9, źródła i bazy 4, sądy i procedura 2 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-DOWODY.md` | 33% | akty i przepisy 11, organy 4, waluta 2, opłaty 1 |  |
| MIESZANY | `prawny-router-v3/references/HARD-GATES-ORZECZNICTWO.md` | 33% | źródła i bazy 7, sądy i procedura 2 |  |
| MIESZANY | `analizator-umow-v1/references/mod-J1-najem.md` | 32% | źródła i bazy 9, akty i przepisy 4, typy umów 3, terminy 1 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-OBAL.md` | 32% | akty i przepisy 5, wymogi pism 1, organy 1 |  |
| MIESZANY | `shared/MOD-ATAK-NA-DRAFT.md` | 31% | akty i przepisy 8, wymogi pism 4, opłaty 1, organy 1 |  |
| MIESZANY | `shared/MOD-WALIDACJA_v2.md` | 31% | akty i przepisy 11, wymogi pism 8, opłaty 6, identyfikatory 5 |  |
| MIESZANY | `shared/MOD-INTRO.md` | 30% | wymogi pism 6, akty i przepisy 2, sądy i procedura 2, organy 1 |  |
| MIESZANY | `pisma-proste-v2/references/SPM-interpretacja-podatkowa.md` | 30% | akty i przepisy 6, opłaty 5, sądy i procedura 5, organy 4 |  |
| MIESZANY | `pisma-proste-v2/references/M1-zasady.md` | 30% | opłaty 8, wymogi pism 2, akty i przepisy 1, źródła i bazy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-zlote-reguly.md` | 30% | waluta 2, organy 1, zawody 1, identyfikatory 1 |  |
| MIESZANY | `analiza-sadowa-v6/SKILL.md` | 29% | źródła i bazy 17, sądy i procedura 6, wymogi pism 6, akty i przepisy 5 |  |
| MIESZANY | `shared/MOD-POSZLAKI-KONTEKST.md` | 29% | identyfikatory 4, wymogi pism 2, organy 2, waluta 1 |  |
| MIESZANY | `shared/DISCLAIMER.md` | 29% | akty i przepisy 17, zawody 15, źródła i bazy 8, sądy i procedura 3 |  |
| MIESZANY | `analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md` | 28% | akty i przepisy 4, źródła i bazy 4 |  |
| MIESZANY | `shared/tools/README.md` | 28% | źródła i bazy 9, identyfikatory 9, akty i przepisy 7, organy 2 |  |
| MIESZANY | `shared/AUDIT-TRAIL-SPEC.md` | 28% | akty i przepisy 3, identyfikatory 2 |  |
| MIESZANY | `shared/MOD-WYJATEK-GATE.md` | 28% | typy umów 6, źródła i bazy 3, akty i przepisy 2 |  |
| MIESZANY | `analizator-dowodow-v3/modules/MD3a-walidacja-formalna.md` | 26% | akty i przepisy 2 |  |
| MIESZANY | `pisma-proste-v2/references/SPE-ostateczne.md` | 26% | identyfikatory 8, typy umów 8, akty i przepisy 7, waluta 6 |  |
| MIESZANY | `pisma-procesowe-v3/SKILL.md` | 26% | identyfikatory 28, organy 22, akty i przepisy 18, wymogi pism 14 |  |
| MIESZANY | `shared/PRZESLUCHANIE-SWIADKOW-KPC.md` | 26% | akty i przepisy 7 | `JUR:przesluchanie-swiadkow-procedura` |
| MIESZANY | `shared/oplaty/01-KSCU-cywilne-rodzinne-pracownicze.md` | 26% | waluta 102, akty i przepisy 89, opłaty 80, wymogi pism 28 | `JUR:oplaty-cywilne-rodzinne-pracownicze` |
| MIESZANY | `prawny-router-v3/SKILL.md` | 26% | źródła i bazy 17, organy 8, identyfikatory 7, sądy i procedura 6 |  |
| MIESZANY | `analizator-dowodow-v3/modules/MD3c-spojnosc.md` | 26% | źródła i bazy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-economic.md` | 26% | opłaty 7, waluta 5, akty i przepisy 4, źródła i bazy 1 |  |
| MIESZANY | `shared/MOD-WARIANTY-POZWU.md` | 26% | opłaty 1 |  |
| MIESZANY | `pisma-procesowe-v3/references/DODATKI.md` | 25% | sądy i procedura 6, wymogi pism 5, organy 4, typy umów 1 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-REDAKCJA.md` | 25% | wymogi pism 4, źródła i bazy 2, identyfikatory 2 |  |
| MIESZANY | `shared/MOD-METODY-BADAWCZE.md` | 25% | akty i przepisy 3, źródła i bazy 3, typy umów 1 |  |
| MIESZANY | `prawny-router-v3/references/PROFIL-LEKKI.md` | 24% | opłaty 2 |  |
| MIESZANY | `analizator-umow-v1/benchmark/posiane-wady/README.md` | 24% | akty i przepisy 8, typy umów 1 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-SKUTEK-PROCESOWY.md` | 24% | akty i przepisy 4, organy 2, typy umów 2, waluta 2 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-fallback-library.md` | 23% | opłaty 5, typy umów 3, akty i przepisy 2 |  |
| MIESZANY | `shared/ORKA-BAS-LEKSYKON.md` | 23% | źródła i bazy 7, sądy i procedura 1, organy 1 |  |
| MIESZANY | `analizator-dowodow-v3/modules/MP13-synteza-faktyczna.md` | 23% | źródła i bazy 2, akty i przepisy 1 |  |
| MIESZANY | `shared/CBOSA-ADAPTER.md` | 23% | źródła i bazy 7, sądy i procedura 6 |  |
| MIESZANY | `shared/portale-branzowe-rzad-2b/czesc-04-ogolne-metodologia.md` | 22% | zawody 3, typy umów 3, źródła i bazy 2, organy 2 |  |
| MIESZANY | `shared/MOD-HISTORIA-STRATEGII.md` | 22% | opłaty 2, akty i przepisy 1 |  |
| MIESZANY | `analizator-umow-v1/references/generator/doktryna-uzupelnienie.md` | 22% | akty i przepisy 5 |  |
| MIESZANY | `przesluchanie-swiadkow-v2-min90/references/WITNESS-SCORING.md` | 22% | akty i przepisy 2, źródła i bazy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-esg.md` | 22% | źródła i bazy 4, akty i przepisy 2, opłaty 2, typy umów 1 |  |
| MIESZANY | `pisma-procesowe-v3/modules/MOD-ETAPY.md` | 21% | wymogi pism 4, opłaty 1, źródła i bazy 1, organy 1 |  |
| MIESZANY | `shared/MOD-KONCENTRACJA.md` | 21% | wymogi pism 6, sądy i procedura 2, organy 2 |  |
| MIESZANY | `shared/INTAKE-GAP.md` | 21% | identyfikatory 6 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-missing-clause.md` | 21% | typy umów 9, akty i przepisy 7, organy 3, opłaty 1 |  |
| MIESZANY | `analizator-dowodow-v3/modules/MOD-LAPSUS-AUDYT.md` | 21% | waluta 6, akty i przepisy 4, źródła i bazy 3, zawody 2 |  |
| MIESZANY | `shared/MOD-TIMING.md` | 21% | akty i przepisy 5, wymogi pism 4, terminy 2, organy 1 |  |
| MIESZANY | `pisma-proste-v2/references/SPI-zawezwanie.md` | 20% | akty i przepisy 6, opłaty 5, identyfikatory 4, sądy i procedura 2 |  |
| MIESZANY | `analizator-dowodow-v3/modules/MP9-jakosc.md` | 19% | źródła i bazy 1 |  |
| MIESZANY | `shared/MOD-GENERATOR-AKTU.md` | 19% | opłaty 1, wymogi pism 1, waluta 1 |  |
| MIESZANY | `chronologia-sprawy-v1/references/sprzecznosci-dat.md` | 19% | akty i przepisy 16, terminy 6, wymogi pism 6, źródła i bazy 2 |  |
| MIESZANY | `shared/MOD-FSL-DOKUMENTY.md` | 18% | waluta 3, akty i przepisy 2, identyfikatory 2, organy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-diff-intelligence.md` | 18% | akty i przepisy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-neg-strategia.md` | 18% | źródła i bazy 3, typy umów 2, akty i przepisy 1 |  |
| MIESZANY | `analizator-umow-v1/references/mod-shared-ai-act.md` | 18% | akty i przepisy 13, typy umów 4 |  |
| MIESZANY | `przesluchanie-swiadkow-v2-min90/SKILL.md` | 17% | źródła i bazy 7, organy 5, akty i przepisy 2, wymogi pism 2 |  |
| MIESZANY | `shared/MOD-KONTEKST-SESJI.md` | 17% | wymogi pism 4, akty i przepisy 1, źródła i bazy 1 |  |
| MIESZANY | `analiza-sadowa-v6/references/orzecznictwo.md` | 17% | źródła i bazy 9, sądy i procedura 6 |  |
| MIESZANY | `analizator-umow-v1/benchmark/posiane-wady/umowy/01-czysta-b2b.md` | 17% | identyfikatory 6, waluta 5, akty i przepisy 4 |  |
| MIESZANY | `analiza-sadowa-v6/references/PRZEBIEG-2-strukturalna.md` | 17% | organy 2, akty i przepisy 1, wymogi pism 1 |  |
| MIESZANY | `analizator-umow-v1/workflows/generator-regulaminu.md` | 16% | typy umów 4, akty i przepisy 2, identyfikatory 2 |  |
| MIESZANY | `analizator-umow-v1/workflows/generator-umowy.md` | 16% | identyfikatory 4, zawody 2, opłaty 1, typy umów 1 |  |
| MIESZANY | `analiza-sadowa-v6/references/PRZEBIEG-1-ekstrakcja.md` | 16% | akty i przepisy 2 |  |
| MIESZANY | `shared/oplaty/03-koszty-zastepstwa-taksy.md` | 15% | waluta 69, opłaty 12, wymogi pism 8, akty i przepisy 7 | `JUR:oplaty-koszty-zastepstwa-taksy` |
| METODA | `przewodnik-prawny-v2/references/KROK-F.md` | 15% | akty i przepisy 6, opłaty 4, źródła i bazy 3, identyfikatory 2 |  |
| METODA | `analizator-umow-v1/benchmark/posiane-wady/umowy/02-jawne-nda.md` | 14% | identyfikatory 4, waluta 1 |  |
| METODA | `shared/MOD-PROWENIENCJA-DOWODOW.md` | 13% | akty i przepisy 3, opłaty 1, wymogi pism 1, organy 1 |  |
| METODA | `shared/MOD-OS-CZASU-PRZESLANEK.md` | 12% | typy umów 10, akty i przepisy 7, źródła i bazy 5, sygnatury 2 |  |
| METODA | `przewodnik-prawny-v2/references/TRYB-SUROWA-ANALIZA.md` | 12% | akty i przepisy 1 |  |
| METODA | `shared/HIERARCHIA-ZRODEL-MIEDZYNARODOWE.md` | 12% | źródła i bazy 2, akty i przepisy 1 |  |
| METODA | `shared/MOD-SELEKCJA-DOWODOW.md` | 12% | akty i przepisy 1 |  |
| METODA | `analiza-sadowa-v6/references/MOD-A.md` | 12% | akty i przepisy 1 |  |
| METODA | `chronologia-sprawy-v1/SKILL.md` | 11% | organy 6, waluta 4, opłaty 2, wymogi pism 2 |  |
| METODA | `analizator-umow-v1/benchmark/posiane-wady/umowy/05-adwersarialne-injection.md` | 11% | identyfikatory 4, waluta 3 |  |
| METODA | `shared/UNIVERSAL-RUNTIME-ADAPTER.md` | 11% | źródła i bazy 4, akty i przepisy 1 |  |
| METODA | `pisma-procesowe-v3/modules/MOD-AUDIT-BUNDLE.md` | 11% | akty i przepisy 4, organy 1, zawody 1, sygnatury 1 |  |
| METODA | `shared/MOD-RED-TEAM-WLASNY.md` | 10% | akty i przepisy 3, wymogi pism 2, identyfikatory 1 |  |
| METODA | `analiza-sadowa-v6/references/engines/file-analysis-staged-engine.md` | 10% | źródła i bazy 1 |  |
| METODA | `shared/CP-GATE.md` | 10% | organy 8, wymogi pism 3, identyfikatory 2 |  |
| METODA | `analizator-umow-v1/benchmark/posiane-wady/umowy/04-matematyczna-tm.md` | 9% | identyfikatory 4, waluta 3 |  |
| METODA | `chronologia-sprawy-v1/references/ekstrakcja-zdarzen.md` | 9% | wymogi pism 3, akty i przepisy 2, opłaty 2, waluta 2 |  |
| METODA | `shared/SAMORZADY-ZAWODOWE-DOKUMENTY.md` | 9% | zawody 43, akty i przepisy 2, waluta 2, źródła i bazy 1 | `JUR:samorzady-zawodowe-dokumenty` |
| METODA | `przesluchanie-swiadkow-v2-min90/references/WITNESS-INTELLIGENCE.md` | 8% | organy 6 |  |
| METODA | `analizator-umow-v1/benchmark/posiane-wady/umowy/03-ukryte-wdrozenie.md` | 8% | identyfikatory 4, waluta 1 |  |
| METODA | `shared/HYBRID-VALIDATION.md` | 8% | identyfikatory 3 |  |
| METODA | `shared/POST-VALIDATION.md` | 8% | identyfikatory 3 |  |
| METODA | `orzeczenia-sadowe-v2/references/PORTALE-LOKALNE.md` | 8% | sądy i procedura 16, źródła i bazy 5 |  |
| METODA | `pisma-procesowe-v3/modules/MOD-FAKTY.md` | 7% | identyfikatory 3, waluta 1 |  |
| METODA | `raport-sytuacyjny-v2/SKILL.md` | 6% | organy 3, wymogi pism 2, waluta 1 |  |
| METODA | `analizator-dowodow-v3/modules/MP6-sledczy.md` | 5% | identyfikatory 3, akty i przepisy 1, opłaty 1, organy 1 |  |
| METODA | `pisma-proste-v2/references/M4-struktura.md` | 4% | wymogi pism 9, zawody 2, identyfikatory 2, opłaty 1 |  |
| METODA | `pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md` | 4% | sądy i procedura 3, wymogi pism 1, źródła i bazy 1, sygnatury 1 |  |
| METODA | `shared/MOD-PRIORYTETY-ASPEKTOW.md` | 3% | akty i przepisy 1, opłaty 1, wymogi pism 1, typy umów 1 |  |
| METODA | `pisma-procesowe-v3/modules/MOD-ORZE.md` | 3% | źródła i bazy 4, sądy i procedura 2, akty i przepisy 1 |  |
| METODA | `analizator-umow-v1/workflows/popraw-fragment.md` | 2% | opłaty 2, akty i przepisy 1, zawody 1 |  |
| METODA | `analiza-sadowa-v6/references/filtry-analityczne.md` | 2% | źródła i bazy 4, sądy i procedura 2, wymogi pism 2, organy 2 |  |
| METODA | `shared/WARUNKI-SKUTECZNOSCI.md` | 1% | wymogi pism 9, opłaty 5 |  |
| METODA | `analiza-sadowa-v6/references/WERYFIKACJA-DOWODOW.md` | 0% | — |  |
| METODA | `analiza-sadowa-v6/references/engines/adversarial-litigation-analysis-v9.md` | 0% | — |  |
| METODA | `analizator-dowodow-v3/modules/MD4-pokrycie.md` | 0% | — |  |
| METODA | `analizator-dowodow-v3/modules/MP1-ekstrakcja.md` | 0% | wymogi pism 2, waluta 1 |  |
| METODA | `analizator-dowodow-v3/modules/MP2-katalog.md` | 0% | — |  |
| METODA | `analizator-dowodow-v3/modules/MP3-spojnosc.md` | 0% | — |  |
| METODA | `analizator-dowodow-v3/modules/MP4-moc-slabosci.md` | 0% | — |  |
| METODA | `analizator-dowodow-v3/modules/MP7-synteza.md` | 0% | — |  |
| METODA | `analizator-dowodow-v3/templates/raport-koncowy.md` | 0% | — |  |
| METODA | `analizator-umow-v1/references/generator/legal-design-produkcyjny.md` | 0% | typy umów 5 |  |
| METODA | `analizator-umow-v1/references/generator/rdzen-generowania.md` | 0% | opłaty 1, zawody 1, typy umów 1 |  |
| METODA | `analizator-umow-v1/references/generator/style-format-generowania.md` | 0% | waluta 2, zawody 1, typy umów 1 |  |
| METODA | `analizator-umow-v1/references/mod-shared-model-umowy.md` | 0% | organy 1 |  |
| METODA | `analizator-umow-v1/workflows/ocena-drugiej-strony.md` | 0% | opłaty 2, zawody 1 |  |
| METODA | `analizator-umow-v1/workflows/weryfikacja-spojnosci-odeslan.md` | 0% | zawody 1 |  |
| METODA | `orzeczenia-sadowe-v2/references/ORZECZENIA-OUTPUT-SCHEMA.md` | 0% | sygnatury 4, sądy i procedura 3, źródła i bazy 3, typy umów 1 |  |
| METODA | `pisma-procesowe-v3/modules/MOD-MIKROPODSUMOWANIA.md` | 0% | waluta 3, organy 2, typy umów 1 |  |
| METODA | `pisma-procesowe-v3/references/engines/opponent-pleading-attack-engine-v9.md` | 0% | wymogi pism 2, opłaty 1, organy 1 |  |
| METODA | `pisma-procesowe-v3/references/engines/self-destructive-admissions-engine-v10.md` | 0% | — |  |
| METODA | `pisma-proste-v2/references/M2-intake.md` | 0% | wymogi pism 10, zawody 4, sądy i procedura 3, identyfikatory 2 |  |
| METODA | `pisma-proste-v2/references/M7-eskalacja.md` | 0% | wymogi pism 4, źródła i bazy 2, sądy i procedura 1, organy 1 |  |
| METODA | `prawny-router-v3/anonimizer/anonimizer-skill.md` | 0% | identyfikatory 4 |  |
| METODA | `prawny-router-v3/references/AUDYT-KLUCZA-ODPOWIEDZI.md` | 0% | — |  |
| METODA | `prawny-router-v3/references/DISCIPLINARY-PROCEEDINGS-STANDARD.md` | 0% | zawody 3, wymogi pism 1 |  |
| METODA | `prawny-router-v3/references/KROK0A-anonimizer.md` | 0% | identyfikatory 3, wymogi pism 2, waluta 2 |  |
| METODA | `raport-klienta-v1/SKILL.md` | 0% | wymogi pism 2, organy 1 |  |
| METODA | `raport-klienta-v1/references/BLUEPRINT-SCHEMA.md` | 0% | — |  |
| METODA | `raport-klienta-v1/references/jezyk-klienta.md` | 0% | wymogi pism 4, opłaty 3, sądy i procedura 1, organy 1 |  |
| METODA | `raport-klienta-v1/references/sekcje-biznesowe.md` | 0% | — |  |
| METODA | `shared/AUDYT-KONCOWY.md` | 0% | — |  |
| METODA | `shared/DISABILITY-FUNCTIONAL-ASSESSMENT.md` | 0% | — |  |
| METODA | `shared/FAKTY_v2.md` | 0% | wymogi pism 1, waluta 1 |  |
| METODA | `shared/MIEDZYNARODOWE-GATES.md` | 0% | akty i przepisy 4, wymogi pism 1, źródła i bazy 1 |  |
| METODA | `shared/MOD-CN-GATE.md` | 0% | — |  |
| METODA | `shared/MOD-DLUGIE-PISMO.md` | 0% | — |  |
| METODA | `shared/MOD-DOKUMENT-GATES.md` | 0% | identyfikatory 2, typy umów 2, organy 1 |  |
| METODA | `shared/MOD-PEER-REVIEW.md` | 0% | zawody 5, wymogi pism 2, organy 1, waluta 1 |  |
| METODA | `shared/MOD-PORCJOWANIE-DOWODOW.md` | 0% | organy 2 |  |
| METODA | `shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md` | 0% | organy 3 |  |
| METODA | `shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md` | 0% | organy 1 |  |
| METODA | `shared/MOD-REM-GATE.md` | 0% | wymogi pism 1 |  |
| METODA | `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` | 0% | organy 3, identyfikatory 3, wymogi pism 1 |  |
| METODA | `shared/MOD-WEJSCIE-DOKUMENTU.md` | 0% | waluta 2 |  |
| METODA | `shared/MOD-WIDGET-IO.md` | 0% | — |  |
| METODA | `shared/QUALITY-CHECK.md` | 0% | wymogi pism 4 |  |
| METODA | `shared/SELF-CHECK-ANTY-FASADA.md` | 0% | — |  |
| METODA | `shared/STRATEGIA-PROCESOWA.md` | 0% | organy 3, wymogi pism 1 |  |
