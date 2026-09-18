# DR-09 — Lokalna Mapa Aktów Prawnych

## Budownictwo, środowisko, energia, transport

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia korekt, dawne błędy numerów, zamknięte flagi i opisy sesji audytowych pozostają poza runtime.

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Prawo ochrony środowiska (POŚ) | Dz.U. 2025 poz. 647 t.j. ze zm. | `mod-POS-prawo-ochrony-srodowiska` | ✅ aktywny; fresh gate |
| POŚ / OOŚ / Natura 2000 — workflow szczegółowy | POŚ jw. + UOOŚiS Dz.U. 2026 poz. 670 t.j. ze zm. + ustawa o ochronie przyrody Dz.U. 2026 poz. 13 t.j. ze zm. | `mod-POS-prawo-ochrony-srodowiska-szczegoly` | ✅ aktywny; fresh gate |
| Ustawa o zapobieganiu szkodom w środowisku i ich naprawie | Dz.U. 2020 poz. 2187 t.j. ze zm. | `mod-POS-prawo-ochrony-srodowiska` | ✅ aktywny; fresh gate |
| Prawo budowlane | Dz.U. 2026 poz. 524 t.j. ze zm. | `mod-PrBud-prawo-budowlane` | ✅ aktywny; temporal gate |
| Prawo budowlane — pozostałe części | jw. | `mod-PrBud-uzupelnienie-pokrycia-2026` | 🟡 B+ |
| Prawo budowlane — zmiana użytkowania / małe obiekty / ograniczenia | jw. + właściwe akty wykonawcze | `mod-PrBud-patodeweloperka-uzytkowanie-male-obiekty-ograniczenia` | ✅ aktywny; fresh gate |
| Samorządy zawodowe architektów i inżynierów budownictwa | Dz.U. 2025 poz. 1783 t.j. ze zm. | `mod-ustawa-architekci-inzynierowie-budownictwa-zawod` | ✅ aktywny |
| Prawo energetyczne / URE / OZE | Dz.U. 2026 poz. 43 t.j. ze zm. ✅ [VER] RZĄD 1 2026-09-16d (było `2025/459` — obwieszczenie MF, podmiana aktu) | `mod-PrEnergetyczne-URE-OZE` | ✅ aktywny; temporal gate |
| Prawo geodezyjne i kartograficzne / wywłaszczenia | Dz.U. 2024 poz. 1151 t.j. ze zm. | `mod-PrGeodezyjne-kartografia-wywlaszczenia` | ✅ aktywny |
| Ustawa o gospodarce nieruchomościami (UGN) | Dz.U. 2026 poz. 399 t.j. ze zm. | `mod-UGN-gospodarka-nieruchomosciami` | 🟢 B+/COV |
| Ustawa o przekształceniu prawa użytkowania wieczystego w prawo własności nieruchomości (29.07.2005) — przekształcenie NA WNIOSEK | **Dz.U. 2024 poz. 900 t.j.** ✅ [VER] RZĄD 1 2026-09-10e — obwieszczenie Marszałka Sejmu z 11.06.2024, akt bazowy Dz.U. 2005 nr 175 poz. 1459, najnowszy z 3 t.j., zero nowelizacji po tekście jednolitym | brak dedykowanego modułu — obsługa przez `mod-UGN-gospodarka-nieruchomosciami` | 🔴 KATALOGOWANY, bez modułu |
| Ustawa o przekształceniu prawa użytkowania wieczystego gruntów zabudowanych na cele mieszkaniowe w prawo własności (20.07.2018) — przekształcenie Z MOCY PRAWA od 1.01.2019 | **Dz.U. 2025 poz. 6 t.j.** ✅ [VER] RZĄD 1 2026-09-10e — obwieszczenie z 23.12.2024, akt bazowy Dz.U. 2018 poz. 1716, zero nowelizacji po tekście jednolitym | brak dedykowanego modułu — obsługa przez `mod-UGN-gospodarka-nieruchomosciami` | 🔴 KATALOGOWANY, bez modułu |

> ⛔ **Dwie różne ustawy o przekształceniu użytkowania wieczystego — nie mylić.**
> Ustawa z 2005 r. działa **na wniosek** i obejmuje szeroki krąg nieruchomości;
> ustawa z 2018 r. przekształciła **z mocy prawa** grunty zabudowane na cele
> mieszkaniowe z dniem 1.01.2019. Powołanie niewłaściwej z nich jest błędem
> podstawy prawnej, nie nieścisłością nazewniczą. Obie mają odrębne t.j.
> (2024/900 i 2025/6) i odrębne akty bazowe (2005/1459 i 2018/1716).

| Prawo geologiczne i górnicze | Dz.U. 2026 poz. 69 t.j. ze zm. | `mod-prawo-geologiczne-gornicze` | ✅ aktywny |
| Prawo wodne | Dz.U. 2025 poz. 960 t.j. ze zm. | `mod-PrWodne-gospodarka-sciekowa` | ✅ aktywny |
| Ustawa o OOŚ / oceny środowiskowe | Dz.U. 2026 poz. 670 t.j. ze zm. | `mod-ustawa-OOS-oceny-srodowiskowe` | ✅ aktywny |
| Ustawa o elektromobilności i paliwach alternatywnych | Dz.U. 2024 poz. 1289 t.j. ze zm. | `mod-ustawa-charakterystyka-energetyczna` | ✅ aktywny; fresh gate; ✅ VER 2026-09-01 RZĄD 1 (ELI DU/2024/1289: obwieszczenie 19.08.2024, status obowiązujący) — KOREKTA: dawny numer 2024 poz. 1634 należy do rozporządzenia MF ws. zwrotu VAT siłom zbrojnym |
| Ustawa o planowaniu i zagospodarowaniu przestrzennym | Dz.U. 2026 poz. 538 t.j. ze zm. | `mod-ustawa-planowanie-przestrzenne` | ✅ aktywny |
| Prawo energetyczne — rynek gazu (brak odrębnej ustawy „Prawo gazowe") | Dz.U. 2026 poz. 43 t.j. ze zm. ✅ [VER] RZĄD 1 2026-09-16d (było `2024/1538` — obwieszczenie MSWiA, podmiana aktu) | `mod-ustawa-prawo-gazowe` | ✅ aktywny; fresh gate |
| Transport drogowy / kolejowy / lotniczy / morski | właściwe bieżące ustawy sektorowe | `mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski` | ✅ aktywny; fresh gate |
| Specustawa drogowa / ZRID | Dz.U. 2024 poz. 311 t.j. ze zm. | `mod-GDDKiA-specustawa-drogowa-ZRID` | ✅ aktywny |
| Ustawa o odpadach / gospodarka komunalna | Dz.U. 2023 poz. 1587 t.j. ze zm. | `mod-ustawa-odpadach-gospodarka-komunalna` | ✅ aktywny; fresh gate |
| Ustawa o ochronie przyrody — formy ochrony | Dz.U. 2026 poz. 13 t.j. ze zm. | `mod-formy-ochrony-przyrody-obszary-chronione` | ✅ aktywny |
| Wycinka / odpady niebezpieczne / remediacja | ustawa o ochronie przyrody jw. + ustawa o odpadach jw. + POŚ jw. | `mod-srodowisko-wycinka-odpady-niebezpieczne-rekultywacja` | ✅ aktywny; fresh gate |
| Inspekcja Ochrony Środowiska | Dz.U. 2024 poz. 425 t.j. ze zm. | `mod-inspekcja-ochrony-srodowiska-GIOS-WIOS` | ✅ aktywny; fresh gate |
| System kaucyjny / opakowania | Dz.U. 2026 poz. 619 t.j. ze zm. | `mod-system-kaucyjny-opakowania` | ✅ aktywny; fresh gate |
| ⛔ **PPWR — rozporządzenie (UE) 2025/40** (opakowania i odpady opakowaniowe; uchyla dyrektywę 94/62/WE) | **CELEX `32025R0040`**, ELI `data.europa.eu/eli/reg/2025/40/oj` ✅ [VER] RZĄD 1 2026-09-13 — EUR-Lex, status **In force**. ⛔ **STOSUJE SIĘ OD 12.08.2026** (art. 67 ust. 5 — od 12.02.2029). Dyrektywa 94/62/WE traci moc od 12.08.2026 z wyjątkiem art. 8 ust. 2 i art. 9 ust. 1-2 | `mod-UE-PPWR-EUDR-rozporzadzenia-srodowiskowe` | ✅ aktywny; ⛔ akt UE **bezpośrednio stosowany** — nie szukać obowiązku w ustawie polskiej |
| ⛔ **EUDR — rozporządzenie (UE) 2023/1115** (produkty niepowodujące wylesiania; uchyla rozp. 995/2010) | **CELEX `32023R1115`**, wersja skonsolidowana `02023R1115-20251226` ✅ [VER] RZĄD 1 2026-09-13. ⛔⛔ **DATA STOSOWANIA PRZESUWANA DWUKROTNIE** — obowiązuje **30.12.2026**, a dla osób fizycznych oraz mikro- i małych przedsiębiorstw ustanowionych do 31.12.2024 — **30.06.2027** (art. 38 ust. 2-3). Powtarzane daty 30.12.2025 / 30.06.2026 są NIEAKTUALNE | `mod-UE-PPWR-EUDR-rozporzadzenia-srodowiskowe` | ✅ aktywny; ⛔ odczyt WERSJI SKONSOLIDOWANEJ, nie tekstu pierwotnego |
| Ustawa o ochronie zabytków + obiekty użyteczności publicznej | Dz.U. 2024 poz. 1292 t.j. ze zm. + Prawo budowlane jw. + właściwe akty wykonawcze | `mod-ochrona-zabytkow-obiekty-uzytecznosci-publicznej` | ✅ aktywny; fresh gate |
| Prawo łowieckie — moduł ogólny / ochrona przyrody | Dz.U. 2025 poz. 539 t.j. ze zm. | `mod-ustawa-lesna-lowiecka-ochrona-przyrody` | ✅ aktywny |
| Prawo łowieckie — szkody łowieckie | jw. | `mod-szkody-lowieckie-szacowanie-odszkodowanie` | ✅ aktywny |
| Prawo łowieckie — obwody / dzierżawa / odszkodowania | jw. | `mod-lowieckie-obwody-dzierzawa-odszkodowania` | ✅ aktywny |
| Prawo łowieckie — wykonywanie polowania | jw. | `mod-lowieckie-wykonywanie-polowania-uprawnienia` | ✅ aktywny |
| Prawo łowieckie — odpowiedzialność dyscyplinarna PZŁ | jw. | `mod-lowieckie-odpowiedzialnosc-dyscyplinarna-PZL` | ✅ aktywny |
| Prawo łowieckie — PZŁ / koła / nadzór ministra | jw. | `mod-lowieckie-PZL-kola-nadzor-ministra` | ✅ aktywny |
| Prawo łowieckie — straż łowiecka | jw. | `mod-lowieckie-straz-lowiecka-PSL-uprawnienia` | ✅ aktywny |
| Prawo łowieckie — zasady gospodarki / plany | jw. | `mod-lowieckie-zasady-gospodarki-lowieckiej-plany` | ✅ aktywny |
| Prawo łowieckie — przepisy ogólne / organy administracji | jw. | `mod-lowieckie-przepisy-ogolne-organy-administracji` | ✅ aktywny |
| Prawo łowieckie — działalność gospodarcza / turystyka / obrót | jw. | `mod-lowieckie-dzialalnosc-gospodarcza-turystyka-obrot` | ✅ aktywny |
| Prawo łowieckie — przepisy przejściowe / końcowe | jw. | `mod-lowieckie-przepisy-przejsciowe-koncowe-derogacja` | ✅ aktywny |
| Kłusownictwo | Prawo łowieckie jw. + ustawa o rybactwie śródlądowym Dz.U. 2022 poz. 883 t.j. ze zm. | `mod-lowiectwo-klusownictwo` | ✅ aktywny; fresh gate |

## Reguły runtime

- każdy fizyczny moduł DR-09 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- mapy nie przechowują dawnych błędów numerów, opisów napraw, zamkniętych flag ani narracji kolejnych sesji;
- przepisy wykonawcze, projekty, harmonogramy wejścia w życie i dynamiczne akty środowiskowe/energetyczne wymagają fresh lub temporal gate;
- status runtime wskazuje routing, nie `FULL` artykuł-po-artykule.
