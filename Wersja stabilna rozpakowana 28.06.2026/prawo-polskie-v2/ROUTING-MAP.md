## ORKA-BAS — Leksykon Definicji Ministerialnych (GLOBAL)

*Źródło: interpelacje poselskie VII–X kadencji + metareguły ORKA-REG + audyt praktyki*
*Pliki: shared/ORKA-BAS-LEKSYKON.md (104 rekordy) + shared/ORKA-BAS-VIII-X-KADENCJA.md (25 rekordów)*
*Każdy DR-skill ma teraz własną sekcję "ORKA-BAS — Definicje wspomagające" w SKILL.md*
*z listą rekordów dedykowanych tej dziedzinie — router NIE musi przeszukiwać całości.*

| DR-skill | Liczba dedykowanych BAS | Najważniejsze hasła |
|---|---|---|
| DR-01 (ustrój) | 1 (pomocniczy) | właściwość sądu (W31) |
| DR-02 (cywilne/rodzinne) | 15 | zasiedzenie, hipoteka, BW, szkoda/lucrum cessans, terminy, kara umowna, odsetki, nakaz zapłaty |
| DR-03 (karne/wykroczenia) | 13 | recydywa, warunkowe umorzenie, zatarcie, czyn ciągły, mienie znacznej wartości, niewidomy/głuchy w KPK |
| DR-04 (praca/ZUS) | 14 | ⚠️rynek pracy (zmiana 2025), praca zdalna, mobbing, choroba zawodowa, niepełnosprawność/PFRON |
| DR-05 (administracyjne) | 7 | cel publiczny, dwuinstancyjność, informacja przetworzona, pełnomocnik z urzędu |
| DR-06 (podatki/finanse) | 21+ | VAT/PIT, ⚠️reforma upol 2025, CRU JSFP 2026, cały katalog finansów JST |
| DR-07 (PZP) | 1 | rażąco niska cena |
| DR-08 (samorząd) | 4 | mienie komunalne, pas drogowy, strefa zamieszkania, droga wewnętrzna |
| DR-09 (budownictwo) | 9 | samowola budowlana, obiekt liniowy, OZE, odbiorca wrażliwy |
| DR-10 (zdrowie) | 4 | świadczenie zdrowotne, gospodarstwo rolne, gołąb=drób |
| DR-11 (RODO/cyber) | 2 | definicje RODO art.4, uzasadniony interes (LIA) |
| DR-12 (sądownictwo/zawody) | 1 | pełnomocnik/obrońca z urzędu |
| DR-13 (służby/niejawne) | 2 | żołnierz, degradacja wojskowa |
| DR-14 (UE/prawa człowieka) | 2 | gender, Konwencja ONZ art.13 |
| DR-15 (compliance) | 2 | sygnalista, uzasadniony interes RODO |
| DR-16 (pisma/dowody) | 7 | uprawdopodobnienie, szkoda, terminy, nadużycie prawa, dowody, kara umowna |

⚠️ ALERTY WYMAGAJĄCE SZCZEGÓLNEJ UWAGI ROUTERA:
  → DR-04: ✅ ustawa o promocji zatrudnienia (uchylona 01.06.2025) — definicje
    BAS-001-003/014/075 ZWERYFIKOWANE i przeniesione do Dz.U. 2025 poz. 620;
    nowość: rolnicy >2ha + "osoby bierne zawodowo"
  → DR-06: reforma upol od 01.01.2025 (nowe def. budynku/budowli, Dz.U. 2024 poz. 1757)
  → DR-06: CRU JSFP wejście 01.07.2026 (brak progu kwotowego!)
  → DR-06: ✅ NOWY — podatek katastralny: projekt poselski Lewicy w Sejmie
    od 20.03.2026 (BAS-W08) — status: złożony, brak I czytania (06.2026)
  → DR-06: ✅ NOWY — Ordynacja podatkowa: zniesienie "wiecznego przedawnienia"
    + ugoda podatkowa od 01.10.2026 (BAS-W32 — reżim odrębny od KC!)
  → DR-06: ustawa z 27.02.2026 o zmianie UFP — wpływa na katalog BAS-022..098
  → DR-02/DR-03/DR-04: projekt likwidacji ubezwłasnowolnienia w Sejmie (02.06.2026)
    — status bez zmian od ostatniej weryfikacji
  → DR-03: BAS-W23 (mienie znacznej/wielkiej wartości, art. 115 §5-6 KK)
    POTWIERDZONE zamrożone od 2010 (prawo.pl 26.08.2025) — bez nowelizacji
  → DR-04/DR-11: ⚠️⚠️ NAJWYŻSZY PRIORYTET — BAS-W36, AI Act art. 6 + Annex III
    "system wysokiego ryzyka" — TERMIN 02.08.2026 (rekrutacja, ocena
    pracowników, decyzje o awansie/zwolnieniu przez AI). Rozporządzenie UE
    stosowane bezpośrednio, niezależnie od polskiej ustawy wdrożeniowej
    (w pracach — Komisja Rozwoju i Bezpieczeństwa AI, brak uchwalenia 06.2026)

ORKA-REG-01–07 + ORKA-META-01–02: metareguły wykładni — stosuj przy KAŻDEJ
  analizie definicji sektorowej (priorytet definicji legalnej, zakaz przenoszenia
  definicji między ustawami, ocena ad casum).

---

# ROUTING-MAP — Centralna Mapa Aktów Prawnych → DR-skills
# prawo-polskie-v2 v5.4 (aktualizacja 2026-06-14 — TRYB DZU, WARN-8 ZAMKNIĘTY 16/16)
#
# Format: Akt prawny | Dz.U. | DR-skill | Moduł | Status
# Status: ✅ OK = moduł merytoryczny | 🔗 odesłanie = w innym DR | ☐ BRAK = do zbudowania
#
# Zasada: jeden akt prawny = jeden wpis w tej tabeli = jeden moduł
# Wyjątek: rozdziały tego samego aktu mogą mieć osobne moduły (oznaczone w kolumnie Moduł)
#
# ═══════════════════════════════════════════════════════════════════════════════
# PROTOKÓŁ INTEGRACJI — jak dane przepływają w systemie
# ═══════════════════════════════════════════════════════════════════════════════
#
# PULL (DR → prawo-polskie → audyt):
#   Krok 1. Każdy DR-skill utrzymuje lokalną MAPA-AKTOW.md z Dz.U. i statusami.
#   Krok 2. Ta tabela jest WTÓRNA wobec DR-MAPA-AKTOW — aktualizuj ją przez
#            pull z DR-MAPA-AKTOW po każdej zmianie w DR-skill.
#   Krok 3. audyt-systemu-v4 w FAZA 3 porównuje tę tabelę z mapa_dzu_*.md
#            i flaguje rozbieżności jako WARN lub CRIT.
#
# MONITORING (nowe akty oczekujące):
#   Każdy akt z flagą ⏳ lub ⚡ w kolumnie Status pojawia się też w sekcji
#   MONITORING na końcu tego pliku ORAZ w mapa_dzu_*.md (tabela MONITORING).
#   Przy audycie DZU — sprawdź czy akt wszedł w życie i przenieś do tabeli głównej.
#
# ═══════════════════════════════════════════════════════════════════════════════

## TABELA STATUSU — SKRÓCONA WEDŁUG DR

| DR | Dziedzina | ✅ OK | 🔗 odesłanie | ☐ BRAK | ⏳/⚡ MON | Łącznie |
|---|---|:---:|:---:|:---:|:---:|:---:|
| DR-01 | Ustrój Konstytucyjny | 6 | 1 | 0 | 0 | 7 |
| DR-02 | Prawo Cywilne/Rodzinne/Gosp. | 18 | 1 | 0 | 0 | 19 |
| DR-03 | Prawo Karne/Wykroczenia | 16 | 0 | 0 | 2 | 18 |
| DR-04 | Prawo Pracy/ZUS/Świadczenia | 18 | 0 | 0 | 0 | 18 |
| DR-05 | Prawo Administracyjne | 13 | 2 | 0 | 0 | 15 |
| DR-06 | Podatki/Finanse/AML | 21 | 0 | 0 | 0 | 21 |
| DR-07 | Zamówienia Publiczne/Fundusze | 12 | 2 | 0 | 0 | 14 |
| DR-08 | Samorząd Terytorialny | 23 | 0 | 0 | 1 | 24 |
| DR-09 | Budownictwo/Środowisko/Energia | 26 | 0 | 0 | 2 | 28 |
| DR-10 | Zdrowie/Farmacja/Żywność | 27 | 0 | 0 | 1 | 28 |
| DR-11 | Cyfrowe/AI/Dane/IP | 20 | 0 | 0 | 0 | 20 |
| DR-12 | Sądownictwo/Zawody | 11 | 1 | 0 | 0 | 12 |
| DR-13 | Służby/Bezpieczeństwo | 13 | 1 | 0 | 2 | 16 |
| DR-14 | Prawo UE/Międzynarodowe | 18 | 0 | 0 | 0 | 18 |
| DR-15 | Compliance/ISO | 9 | 0 | 0 | 0 | 9 |
| DR-16 | Pisma/Narzędzia | 11 | 0 | 0 | 0 | 11 |
| **SUMA** | | **262** | **9** | **0** | **8** | **279** |

---

## DR-01 — Ustrój Konstytucyjny i Źródła Prawa

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Konstytucja RP + Ustawa o TK | Dz.U. 1997 nr 78 poz. 483 + Dz.U. 2019 poz. 2393 | dr-01/modules/mod-Konstytucja-TK-skarga-konstytucyjna | ✅ OK |
| PUSP + SN (ustrój sądów) | Dz.U. 2024 poz. 334 ze zm. (zm.: 2025.526) + Dz.U. 2024 poz. 622 | dr-01/modules/mod-USP-ustroj-sadow-powszechnych | ✅ OK |
| Ustawa o KRS + ustrój władzy | Dz.U. 2011 poz. 714 ze zm. — weryfikuj aktualny t.j. w ISAP | dr-01/modules/mod-ustawa-KRS-i-ustroj-wladzy | ✅ OK |
| Ustawa o wykonywaniu mandatu posła i senatora | Dz.U. 2024 poz. 907 t.j. ✅ VER: 2026-06-14 (TRYB DZU) | dr-01/modules/mod-ustawa-KRS-i-ustroj-wladzy | ✅ OK |
| Ustawa o partiach politycznych + referendum ogólnokrajowe | Dz.U. 2023 poz. 1215 | dr-01/modules/mod-ustawa-partie-polityczne-referendum | ✅ OK |
| Ustawa o referendum ogólnokrajowym | Dz.U. 2025 poz. 300 t.j. ✅ VER: 2026-06-14 (TRYB DZU — był 2020/851) | dr-01/modules/mod-ustawa-partie-polityczne-referendum | ✅ OK |
| Ustawa o Radzie Ministrów + Prezydent RP | Dz.U. 2022 poz. 2032 ze zm. | → dr-01/modules/mod-ustawa-KRS-i-ustroj-wladzy | 🔗 odesłanie |

---

## DR-02 — Prawo Cywilne, Rodzinne i Gospodarcze

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Kodeks cywilny — zobowiązania, roszczenia | Dz.U. 2025 poz. 1071 ze zm. | dr-02/modules/mod-KC-cywilne-zobowiazania-odpowiedzialnosc | ✅ OK |
| Kodeks cywilny — konsumenckie | Dz.U. 2025 poz. 1071 ze zm. | dr-02/modules/mod-KC-konsumenckie | ✅ OK |
| Kodeks cywilny — Księga IV Spadki | Dz.U. 2025 poz. 1071 ze zm. | dr-02/modules/mod-KC-spadki | ✅ OK |
| Kodeks cywilny — ubezpieczenia | Dz.U. 2025 poz. 1071 + Dz.U. 2025 poz. 367 t.j. | dr-02/modules/mod-KC-ubezpieczenia | ✅ OK |
| Kodeks rodzinny i opiekuńczy | Dz.U. 2026 poz. 236 t.j. | dr-02/modules/mod-KRO-rodzinne | ✅ OK |
| KP art. 94³ — mobbing, dyskryminacja | Dz.U. 2025 poz. 277 ze zm. | dr-02/modules/mod-KP-art943-mobbing-dyskryminacja | ✅ OK |
| KPC — egzekucja i windykacja | Dz.U. 2026 poz. 468 ze zm. | dr-02/modules/mod-KPC-egzekucja-windykacja | ✅ OK |
| Kodeks spółek handlowych | Dz.U. 2024 poz. 18 ze zm. (zm.: 2025.1085) | dr-02/modules/mod-KSH-spolki-handlowe | ✅ OK |
| Prawo upadłościowe | Dz.U. 2025 poz. 614 ze zm. | dr-02/modules/mod-PrUpad-upadlosc-restrukturyzacja | ✅ OK |
| Prawo restrukturyzacyjne | Dz.U. 2026 poz. 533 t.j. | dr-02/modules/mod-PrUpad-upadlosc-restrukturyzacja | ✅ OK |
| Ustawa o licencji doradcy restrukturyzacyjnego (zawód regulowany, BEZ samorządu — syndyk/nadzorca/zarządca) | Dz.U. 2022 poz. 1007 [sprawdź nowszy t.j.] + Pr. restrukturyzacyjne 2026/533 + Pr. upadłościowe 2025/614 + nowelizacja Dz.U. 2025 poz. 1085 (w życie 23.08.2025) ✅ VER: 2026-06-15 | dr-02/modules/mod-ustawa-doradca-restrukturyzacyjny-zawod | ✅ NOWY |
| Prawo przedsiębiorców (formy działalności gospodarczej, JDG, działalność nierejestrowana) | Dz.U. 2025 poz. 1480 t.j. — art. 5 (próg działalności nierejestrowanej) w brzmieniu od 1.01.2026 wg nowelizacji Dz.U. 2025 poz. 769 ✅ VER: 2026-06-15 | dr-02/modules/mod-KSH-spolki-handlowe (sekcja "FORMY DZIAŁALNOŚCI GOSPODARCZEJ") | ✅ NOWY |
| Ustawa o prawach konsumenta | Dz.U. 2023 poz. 2759 ze zm. | dr-02/modules/mod-ustawa-prawa-konsumenta | ✅ OK |
| Ustawa o cudzoziemcach | Dz.U. 2025 poz. 1079 ze zm. | dr-02/modules/mod-ustawa-cudzoziemcy | ✅ OK |
| Ustawa o ochronie konkurencji i konsumentów (UOKiK) | Dz.U. 2025 poz. 1714 t.j. | dr-02/modules/mod-ustawa-ochrona-konkurencji-konsumentow-UOKiK | ✅ OK |
| Ustawa o KRS — rejestr sądowy | Dz.U. 2025 poz. 869 t.j. | dr-02/modules/mod-ustawa-KRS-rejestr-sadowy | ✅ OK |
| Ustawa o kredycie konsumenckim | Dz.U. 2024 poz. 1567 ze zm. | dr-02/modules/mod-ustawa-deweloperska | ✅ OK |
| Ustawa deweloperska — ochrona nabywcy | Dz.U. 2024 poz. 695 t.j. | dr-02/modules/mod-ustawa-deweloperska | ✅ OK |
| Ustawa o własności lokali + spółdzielnie | Dz.U. 2021 poz. 1048 ze zm. + Dz.U. 2024 poz. 593 t.j. | dr-02/modules/mod-ustawa-spoldzielnie-wlasnosc-lokali | ✅ OK |
| Ustawa o fundacjach i stowarzyszeniach | Dz.U. 2023 poz. 549 ze zm. | dr-02/modules/mod-ustawa-fundacje-stowarzyszenia | ✅ OK |
| Ustawa UZNK — nieuczciwa konkurencja | Dz.U. 2026 poz. 85 t.j. | dr-02/modules/mod-ustawa-UZNK-nieuczciwa-konkurencja | ✅ OK |
| Ustawa o timeshare + zastaw rejestrowy | Dz.U. 2018 poz. 513 + Dz.U. 2018 poz. 2017 | dr-02/modules/mod-ustawa-timeshare-zastaw-rejestrowy | ✅ OK |
| KC — służebności, zasiedzenie, prawo rzeczowe (art. 145, 172, 222, 305¹ KC) | Dz.U. 2025 poz. 1071 ze zm. | dr-02/modules/mod-KC-cywilne-zobowiazania-odpowiedzialnosc → ANEKS D | ✅ OK |
| KC — dział spadku, nabycie spadku, zachowek (art. 991, 1015, 1037 KC) | Dz.U. 2025 poz. 1071 ze zm. | dr-02/modules/mod-KC-cywilne-zobowiazania-odpowiedzialnosc → ANEKS E | ✅ OK |
| Kredyty frankowe — abuzywność klauzul (art. 385¹ KC + dyr. 93/13/EWG + TSUE) | Dz.U. 2025 poz. 1071 + Dz.Urz. UE L 95/29 | dr-02/modules/mod-KC-cywilne-zobowiazania-odpowiedzialnosc → ANEKS F | ✅ OK |
| Ustawa o pomocy obywatelom Ukrainy | Dz.U. 2022 poz. 583 ze zm. (weryfikuj) | dr-02/modules/mod-ustawa-cudzoziemcy | ✅ OK |

---

## DR-03 — Prawo Karne, Wykroczenia, Egzekucja

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Kodeks karny (KK) | Dz.U. 2025 poz. 383 ze zm. (zm.: 2025.1818, 2026.638) | dr-03/modules/mod-KK-kodeks-karny | ✅ OK |
| KK — kwalifikator karnomaterialny | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-kwalifikator-karnomaterialny | ✅ OK |
| KK art. 190a — stalking | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-art190a-stalking | ✅ OK |
| KK art. 207 + ustawa antyprzemocowa | Dz.U. 2025 poz. 383 + Dz.U. 2021 poz. 1249 | dr-03/modules/mod-KK-art207-przemoc-domowa | ✅ OK |
| KK art. 267–269c — cyberprzestępstwa | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-art267-269c-cyberprzestepstwa | ✅ OK |
| KK art. 291 — pranie pieniędzy (KK) | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-art291-pranie-pieniedzy | ✅ OK |
| KK art. 286 — oszustwo | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-KPK-framework-karne → ANEKS przestępstwa gospod. | ✅ OK |
| KK art. 296 — nadużycie zaufania (menedżerskie) | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-KPK-framework-karne → ANEKS przestępstwa gospod. | ✅ OK |
| KK art. 209 — niealimentacja | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-KPK-framework-karne → ANEKS alimenty | ✅ OK |
| Kodeks postępowania karnego (KPK) | Dz.U. 2026 poz. 490 t.j. ze zm. (zm.: ⚡ 2026.638) | dr-03/modules/mod-KK-KPK-framework-karne | ✅ OK |
| KPK — tryby ścigania | Dz.U. 2026 poz. 490 ze zm. | dr-03/modules/mod-KPK-tryby-scigania | ✅ OK |
| Kodeks karny wykonawczy (KKW) | Dz.U. 2025 poz. 911 ze zm. | dr-03/modules/mod-KKW-kodeks-karny-wykonawczy | ✅ OK |
| Kodeks wykroczeń (KW) | Dz.U. 2025 poz. 734 ze zm. (**zm.: Dz.U. 2025 poz. 1872** — art. 86c drift) | dr-03/modules/mod-KW-kodeks-wykroczen | ✅ OK |
| KPW — Kodeks postępowania w sprawach o wykroczenia | Dz.U. 2025 poz. 860 t.j. | dr-03/modules/mod-KW-KPW-framework-szczegolowy | ✅ OK |
| KKS + Ustawa AML | Dz.U. 2025 poz. 633 t.j. + Dz.U. 2025 poz. 644 | dr-03/modules/mod-KKS-karny-skarbowy-i-AML | ✅ OK |
| Ustawa Fundusz Pomocy Pokrzywdzonym | Dz.U. 2022 poz. 2256 ze zm. | dr-03/modules/mod-KK-kodeks-karny | ✅ OK |
| Ustawa o przeciwdziałaniu narkomanii | Dz.U. 2023 poz. 1939 t.j. ✅ VER: 2026-06-14 (TRYB DZU) | dr-03/modules/mod-ustawa-narkomania | ✅ OK |
| Ustawa o odpowiedzialności podmiotów zbiorowych | Dz.U. 2024 poz. 1822 t.j. ✅ VER: 2026-06-14 (TRYB DZU — uwaga: nowelizacja 2025/1440 wchodzi 01.03.2026, nowy art. 9a) | dr-03/modules/mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych | ✅ OK |
| KPK — oczekująca nowelizacja 2026.638 | Dz.U. 2026 poz. 638 — vacatio legis weryfikuj | dr-03/modules/mod-KK-KPK-framework-karne | ⚡ WCHODZI |
| KPK — zmiana 2025.1390 | Dz.U. 2025 poz. 1390 — vacatio weryfikuj | dr-03/modules/mod-KPK-tryby-scigania | ⏳ OCZEKUJE |
| **Prawo o ruchu drogowym (PRD)** | Dz.U. 2024 poz. 1251 t.j. ze zm. (zm.: Dz.U. 2025 poz. 1676, 1734, 1843; Dz.U. 2026 poz. 180) | dr-03/modules/mod-PRD-prawo-jazdy-punkty-karne | ✅ OK |
| **Grzywna/mandat/kara adm./grzywna przymuszenia** | KW Dz.U. 2025 poz. 734 + KPSW Dz.U. 2025 poz. 860 + KPA Dz.U. 2025 poz. 1691 Dz. IVa + UPEA Dz.U. 2023 poz. 2505 | dr-03/modules/mod-grzywny-mandaty-szczegolowe | ✅ OK |
| **Ustawa o kierujących pojazdami (u.k.p.)** | Dz.U. 2025 poz. 1226 t.j. ze zm. Dz.U. 2025 poz. 1676 | dr-03/modules/mod-PRD-prawo-jazdy-punkty-karne | ✅ OK |
| **Ustawa BRD I** — pj od 17 lat, cofnięcie, cyfrowe pj | Dz.U. 2025 poz. 1676 (w życie od 01.2026 etapami — weryfikuj) | dr-03/modules/mod-PRD-prawo-jazdy-punkty-karne (cofnięcie, okres próbny) + mod-PRD-nowe-przestepstwa-drogowe-BRD (pj od 17 lat) | ✅ OK |
| **Ustawa BRD II** — nielegalne wyścigi, drift, brawurowa jazda, przepadek | Dz.U. 2025 poz. 1872 (w życie 29.01.2026, 30.03.2026, 03.06.2026) | dr-03/modules/mod-PRD-nowe-przestepstwa-drogowe-BRD + mod-KW-KPW-framework-szczegolowy | ✅ OK |
| **Rozp. MSWiA — ewidencja kierujących** (taryfikator punktów, kody, szkolenia) | Dz.U. 2026 poz. 724 (w życie 03.06.2026) | dr-03/modules/mod-PRD-prawo-jazdy-punkty-karne | ✅ OK |

---

## DR-04 — Prawo Pracy, ZUS, Świadczenia Społeczne

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Kodeks pracy (KP) | Dz.U. 2025 poz. 277 ze zm. (zm.: 2026.25, 2025.807, 2025.1423) | dr-04/modules/mod-KP-prawo-pracy | ✅ OK |
| KPA — postępowanie administracyjne | Dz.U. 2025 poz. 1691 ze zm. | dr-04/modules/mod-KPA-postepowanie-administracyjne | ✅ OK |
| PPSA — sądownictwo administracyjne | Dz.U. 2026 poz. 143 ze zm. | dr-04/modules/mod-KPA-postepowanie-administracyjne | ✅ OK |
| Ustawa o systemie ubezpieczeń społecznych (SUS/ZUS) | Dz.U. 2025 poz. 1169 ze zm. (zm.: 2026.199) | dr-04/modules/mod-SUS-ZUS-ubezpieczenia-spoleczne | ✅ OK |
| Ustawa o emeryturach i rentach z FUS | Dz.U. 2025 poz. 1749 ze zm. | dr-04/modules/mod-SUS-ZUS-ubezpieczenia-spoleczne | ✅ OK |
| Ustawa o ubezpieczeniu społecznym rolników (KRUS) | Dz.U. 2024 poz. 90 ze zm. | dr-04/modules/mod-KRUS-rolnicze-ubezpieczenia | ✅ OK |
| Ustawa o rehabilitacji zawodowej i PFRON | Dz.U. 2025 poz. 913 ze zm. | dr-04/modules/mod-ustawa-rehabilitacja-PFRON | ✅ OK |
| Ustawa o PIP | Dz.U. 2024 poz. 1712 t.j. + zm. Dz.U. 2025 poz. 321/368/620/769, Dz.U. 2026 poz. 160 ⏳ nowelizacja Dz.U. 2026 poz. 473 (wchodzi 08.07.2026) | dr-04/modules/mod-ustawa-PIP-inspekcja-pracy | ✅ OK — sekcja 5 modułu |
| Ustawa o minimalnym wynagrodzeniu | Dz.U. 2024 poz. 1285 ze zm. (MW 2026: 4806 zł) | dr-04/modules/mod-ustawa-minimalne-wynagrodzenie | ✅ OK |
| Ustawa o ZFSS | Dz.U. 2024 poz. 288 ze zm. | dr-04/modules/mod-ustawa-ZFSS | ✅ OK |
| Ustawa o zatrudnianiu pracowników tymczasowych | Dz.U. 2025 poz. 1682 t.j. | dr-04/modules/mod-ustawa-praca-tymczasowa | ✅ OK |
| Ustawa o sporach zbiorowych pracy (nowa) | Dz.U. 2025 poz. 1661 | dr-04/modules/mod-ustawa-zwiazki-zawodowe-spory-zbiorowe | ✅ OK |
| Ustawa o związkach zawodowych | Dz.U. 2026 poz. 549 t.j. | dr-04/modules/mod-ustawa-zwiazki-zawodowe-spory-zbiorowe | ✅ OK |
| Ustawa o ubezpieczeniu społ. z tytułu wypadków przy pracy i chorób zawodowych | Dz.U. 2022 poz. 2189 t.j. ze zm. — weryfikuj ISAP | dr-04/modules/mod-KP-prawo-pracy → ANEKS B | ✅ OK |
| KP art. 67⁵–67²⁴ — praca zdalna | Dz.U. 2025 poz. 277 ze zm. (Dz.U. 2023 poz. 240) | dr-04/modules/mod-KP-prawo-pracy → ANEKS C | ✅ OK |
| Ustawa o zwolnieniach grupowych | Dz.U. 2025 poz. 570 t.j. | dr-04/modules/mod-ustawa-zwolnienia-grupowe | ✅ OK |
| Ustawa o rynku pracy i służbach zatrudnienia | Dz.U. 2025 poz. 620 ze zm. (zm.: 2026.451) | dr-04/modules/mod-ustawa-rynek-pracy-zatrudnienie | ✅ OK |
| Ustawa o świadczeniach rodzinnych | Dz.U. 2025 poz. 1208 t.j. | dr-04/modules/mod-ustawa-swiadczenia-rodzinne | ✅ OK |
| Ustawa o pomocy społecznej | Dz.U. 2025 poz. 1214 t.j. | dr-04/modules/mod-ustawa-pomoc-spoleczna | ✅ OK |
| Ustawa o świadczeniu wspierającym (WZON) | Dz.U. 2023 poz. 1429 ze zm. | dr-04/modules/mod-ustawa-swiadczenie-wspierajace-WZON | ✅ OK |

---

## DR-05 — Prawo Administracyjne i Sądownictwo Administracyjne

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| KPA (kanonik) | Dz.U. 2025 poz. 1691 ze zm. | → DR-04/mod-KPA-postepowanie-administracyjne | 🔗 odesłanie |
| PPSA (kanonik) | Dz.U. 2026 poz. 143 ze zm. | → DR-04/mod-KPA-postepowanie-administracyjne | 🔗 odesłanie |
| Ordynacja podatkowa | Dz.U. 2026 poz. 622 t.j. ⚡ część przepisów wchodzi ~IX.2026 | → DR-06/mod-OP-ordynacja-podatkowa | 🔗 odesłanie |
| UDIP — dostęp do informacji publicznej | Dz.U. 2022 poz. 902 ze zm. — weryfikuj t.j. w ISAP | dr-05/modules/mod-UDIP-dostep-informacji-publicznej | ✅ OK |
| Ustawa o otwartych danych i re-use | Dz.U. 2023 poz. 1524 t.j. | dr-05/modules/mod-UDIP-dostep-informacji-publicznej | ✅ OK |
| Ustawa o skargach na przewlekłość | Dz.U. 2023 poz. 1725 t.j. | dr-05/modules/mod-ustawa-skargi-przewleklosc-dostep-sadu | ✅ OK |
| UPEA — egzekucja administracyjna | Dz.U. 2026 poz. 268 t.j. + Dz.U. 2026 poz. 532 t.j. | dr-05/modules/mod-UPEA-egzekucja-administracyjna | ✅ OK |
| Ustawa o cudzoziemcach (framework) | Dz.U. 2025 poz. 1079 t.j. ze zm. (zm.: 2025.619 Niebieska Karta; 2025.1794; 2026.203) | dr-05/modules/mod-ustawa-cudzoziemcy | ✅ OK |
| Ustawa o warunkach dopuszczalności powierzania pracy cudzoziemcom | Dz.U. 2025 poz. 621 (w życie 01.06.2025) | dr-05/modules/mod-ustawa-cudzoziemcy-zatrudnianie | ✅ OK |
| Ustawa o udzielaniu ochrony cudzoziemcom | Dz.U. 2024 poz. 1546 t.j. | dr-05/modules/mod-ustawa-cudzoziemcy | ✅ OK |
| Ustawa o Rzeczniku Praw Obywatelskich | Dz.U. 2024 poz. 1264 t.j. | dr-05/modules/mod-ustawa-RPO | ✅ OK |
| Ustawa o samorządowych kolegiach odwoławczych (SKO) | Dz.U. 2023 poz. 825 t.j. | dr-05/modules/mod-ustawa-SKO | ✅ OK |
| Ustawa o kontroli w administracji rządowej | Dz.U. 2020 poz. 224 ze zm. | dr-05/modules/mod-ustawa-kontrola-administracji | ✅ OK |
| Ustawa o petycjach | Dz.U. 2018 poz. 870 — weryfikuj t.j. w ISAP | dr-05/modules/mod-ustawa-petycje | ✅ OK |
| Ustawa o sygnalistach | Dz.U. 2024 poz. 928 ze zm. | dr-05/modules/mod-ustawa-sygnalisci | ✅ OK |
| Zaskarzanie decyzji / reprywatyzacja | Dz.U. 2025 poz. 1691 (KPA art. 156) + Dz.U. 2021 poz. 795 | dr-05/modules/mod-ustawa-zaskarzanie-decyzji-wlasnosci | ✅ OK |
| Ustawa o dostępności — osoby ze szczególnymi potrzebami | Dz.U. 2022 poz. 2240 t.j. | dr-05/modules/mod-ustawa-dostepnosc-niepelnosprawni | ✅ OK |

---

## DR-06 — Podatki, Finanse Publiczne, AML

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| **Interpretacje podatkowe, MDR, WIS, uchwały NSA, definicje** | Op Dz.U. 2025 poz. 111 t.j. (art.14a–14p) + EUREKA + orzeczenia.nsa.gov.pl | dr-06/modules/mod-interpretacje-definicje-podatkowe | ✅ OK |
| **Klasyfikacje statystyczne (PKWiU/CN/PKOB/KŚT)** | PKWiU 2025 (Rozp. RM 17.12.2025) + PKWiU 2015 (Dz.U. 2015 poz. 1676) | dr-06/modules/mod-PKWiU-klasyfikacje-statystyczne | ✅ OK |
| Ordynacja podatkowa | Dz.U. 2026 poz. 622 t.j. (25.05.2026) ⚡ część vacatio ~IX.2026 | dr-06/modules/mod-OP-ordynacja-podatkowa | ✅ OK |
| Ustawa o PIT | Dz.U. 2026 poz. 592 t.j. | dr-06/modules/mod-PIT-podatek-dochodowy-fizyczne | ✅ OK |
| Ustawa o CIT | Dz.U. 2026 poz. 554 t.j. | dr-06/modules/mod-CIT-podatek-dochodowy-prawne | ✅ OK |
| Ustawa o VAT | Dz.U. 2025 poz. 775 t.j. | dr-06/modules/mod-VAT-podatek-od-towarow-i-uslug | ✅ OK |
| Ustawa o podatkach i opłatach lokalnych | Dz.U. 2025 poz. 707 t.j. (reforma od 01.01.2025) | dr-06/modules/mod-ustawa-podatek-nieruchomosci-i-lokalne | ✅ OK |
| Ustawa o PCC | Dz.U. 2026 poz. 191 t.j. | dr-06/modules/mod-ustawa-PCC-i-podatek-spadkow-darowizn | ✅ OK |
| Ustawa o podatku od spadków i darowizn | Dz.U. 2024 poz. 1837 t.j. | dr-06/modules/mod-ustawa-PCC-i-podatek-spadkow-darowizn | ✅ OK |
| Ustawa akcyzowa | Dz.U. 2025 poz. 126 t.j. | dr-06/modules/mod-ustawa-akcyzowa-i-clo-UCC | ✅ OK |
| Kodeks celny UE (UCC) + Taryfa celna (CN) | Rozp. (UE) 952/2013 + Rozp. (EWG) 2658/87 | dr-06/modules/mod-UCC-clo-taryfa-celna | ✅ OK |
| Ustawa o ryczałcie od przychodów | Dz.U. 2025 poz. 843 t.j. | dr-06/modules/mod-ustawa-ryczalt-przychody | ✅ OK |
| Ustawa o finansach publicznych (UFP) | Dz.U. 2025 poz. 1483 t.j. | dr-06/modules/mod-UFP-finanse-publiczne-NIK-RIO | ✅ OK |
| Ustawa o KAS | Dz.U. 2025 poz. 1131 t.j. | dr-06/modules/mod-KAS-kontrola-celno-skarbowa | ✅ OK |
| Ustawa o nadzorze KNF | Dz.U. 2024 poz. 724 ze zm. | dr-06/modules/mod-prawo-bankowe-KNF-BFG | ✅ OK |
| Prawo bankowe | Dz.U. 2026 poz. 38 t.j. | dr-06/modules/mod-prawo-bankowe-KNF-BFG | ✅ OK |
| Ustawa o usługach płatniczych | Dz.U. 2025 poz. 611 t.j. | dr-06/modules/mod-ustawa-uslugi-platnicze | ✅ OK |
| Ustawa AML | Dz.U. 2025 poz. 644 t.j. | dr-06/modules/mod-ustawa-AML-instytucje-obowiazkowe | ✅ OK |
| KKS — kodeks karny skarbowy | Dz.U. 2025 poz. 633 t.j. | dr-06/modules/mod-KAS-kontrola-celno-skarbowa | ✅ OK |
| Ustawa o obligacjach | Dz.U. 2022 poz. 2218 ze zm. | dr-06/modules/mod-ustawa-rynek-kapitalowy-fundusze | ✅ OK |
| Ustawa o funduszach inwestycyjnych | Dz.U. 2024 poz. 1034 t.j. | dr-06/modules/mod-ustawa-rynek-kapitalowy-fundusze | ✅ OK |
| Ustawa o biegłych rewidentach, firmach audytorskich oraz nadzorze publicznym (zawód zaufania publicznego) | Dz.U. 2025 poz. 1891 t.j. ✅ VER: 2026-06-14 | dr-06/modules/mod-ustawa-biegli-rewidenci-zawod | ✅ NOWY |
| Ustawa o doradztwie podatkowym (zawód zaufania publicznego) | Dz.U. 2021 poz. 2117 + Dz.U. 2025 poz. 1882 (nowelizacja) ✅ VER: 2026-06-14 | dr-06/modules/mod-ustawa-doradcy-podatkowi-zawod | ✅ NOWY |
| Podatek rolny | Dz.U. 2025 poz. 1344 t.j. | dr-06/modules/mod-ustawa-podatek-nieruchomosci-i-lokalne | ✅ OK |
| Ustawa o podatku od wydobycia kopalin | Dz.U. 2024 poz. 44 ze zm. | dr-06/modules/mod-KAS-kontrola-celno-skarbowa | ✅ OK |

---

## DR-07 — Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Prawo zamówień publicznych (PZP) | Dz.U. 2024 poz. 1320 ze zm. | dr-07/modules/mod-PZP-zamowienia-publiczne-KIO | ✅ OK |
| PZP — certyfikacja wykonawców | Dz.U. 2025 poz. 1235 | dr-07/modules/mod-ustawa-PZP-certyfikacja-wykonawcow | ✅ OK |
| PZP — zamówienia obronne i bezpieczeństwa | Dz.U. 2024 poz. 1320 ze zm. | → DR-15/mod-PZP-zamowienia-obronne-bezpieczenstwa | 🔗 odesłanie |
| Ustawa o PPP | Dz.U. 2023 poz. 1688 ze zm. | dr-07/modules/mod-ustawa-PPP-i-koncesja | ✅ OK |
| Ustawa o zasadach realizacji programów UE 2021-2027 | Dz.U. 2024 poz. 1655 ze zm. | dr-07/modules/mod-ustawa-fundusze-UE-pomoc-publiczna | ✅ OK |
| Ustawa o polityce rozwoju | Dz.U. 2025 poz. 1733 t.j. | dr-07/modules/mod-ustawa-fundusze-UE-pomoc-publiczna | ✅ OK |
| Ustawa o postępowaniu w sprawach pomocy publicznej | Dz.U. 2025 poz. 468 t.j. | dr-07/modules/mod-ustawa-fundusze-UE-pomoc-publiczna | ✅ OK |
| Ustawa o RIO | Dz.U. 2023 poz. 1325 ze zm. | dr-07/modules/mod-ustawa-RIO-regionalne-izby | ✅ OK |
| Ustawa o finansach publicznych | → DR-06/mod-UFP-finanse-publiczne-NIK-RIO | → DR-06 | 🔗 odesłanie |
| KPC cz. V — arbitraż i mediacja | Dz.U. 2026 poz. 468 ze zm. | dr-07/modules/mod-ustawa-arbitraz-mediacja | ✅ OK |
| Prawo o notariacie | Dz.U. 2026 poz. 614 t.j. | dr-07/modules/mod-PrNotariat-notariat-rejestry | ✅ OK |
| Ustawa o NIK | Dz.U. 2022 poz. 623 ze zm. | dr-07/modules/mod-ustawa-NIK | ✅ OK |
| Ustawa o Prokuratorii Generalnej RP | Dz.U. 2023 poz. 1109 ze zm. | dr-07/modules/mod-ustawa-Prokuratorii-Generalnej | ✅ OK |
| Ustawa o dyscyplinie finansów publicznych | Dz.U. 2024 poz. 104 t.j. | dr-07/modules/mod-ustawa-dyscyplina-finansow-publicznych | ✅ OK |

---

## DR-08 — Samorząd Terytorialny i Prawo Lokalne

*Źródło: dr-08/MAPA-AKTOW.md | Weryfikacja: 2026-06-08*

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Ustawa o samorządzie gminnym (USG) | Dz.U. 2025 poz. 1153 t.j. | dr-08/modules/mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa | ✅ OK |
| Ustawa o samorządzie powiatowym (USP) | Dz.U. 2025 poz. 1684 t.j. | dr-08/modules/mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa | ✅ OK |
| Ustawa o samorządzie województwa (USW) | Dz.U. 2025 poz. 581 t.j. | dr-08/modules/mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa | ✅ OK |
| Ustawa o Wojewodzie i administracji rządowej w województwie | Dz.U. 2025 poz. 428 t.j. | dr-08/modules/mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa | ✅ OK |
| Ustawa o pracownikach samorządowych | Dz.U. 2024 poz. 1135 t.j. | dr-08/modules/mod-ustawa-pracownicy-samorzadowi | ✅ OK |
| Ustawa o dochodach JST (nowa 2024) | Dz.U. 2024 poz. 1572 (w życie 01.01.2025 — zastępuje ustawę z 2003 r.) | dr-08/modules/mod-ustawa-dochody-JST | ✅ OK |
| Ustawa o referendum lokalnym | Dz.U. 2023 poz. 1317 ze zm. | dr-08/modules/mod-ustawa-referendum-lokalne | ✅ OK |
| Ustawa o zarządzaniu kryzysowym i ochronie ludności | Dz.U. 2024 poz. 1907 ze zm. (zm.: 2025.1705, ⚡ 2026.646) | dr-08/modules/mod-ustawa-zarzadzanie-kryzysowe | ✅ OK |
| Nadzór Wojewody i RIO — legalność uchwał | USG/USP/USW | dr-08/modules/mod-nadzor-wojewody-RIO-legalnosc-uchwal | ✅ OK |
| Procedury JST — statuty, regulaminy | Uchwały JST | dr-08/modules/mod-procedury-JST-statuty-regulaminy | ✅ OK |
| Lokalne podatki i opłaty | Dz.U. 2025 poz. 707 t.j. + Uchwały | dr-08/modules/mod-lokalne-podatki-oplaty-taryfy | ✅ OK |
| MPZP i WZ — planowanie przestrzenne | Dz.U. 2026 poz. 538 t.j. | dr-08/modules/mod-MPZP-WZ-planowanie-przestrzenne | ✅ OK |
| Akty porządkowe — bezpieczeństwo lokalne | art. 40 §3 USG + przepisy porządkowe | dr-08/modules/mod-akty-porzadkowe-bezpieczenstwo-lokalne | ✅ OK |
| Skargi na prawo miejscowe — WSA/NSA | PPSA + USG | dr-08/modules/mod-skargi-na-prawo-miejscowe-WSA-NSA | ✅ OK |
| Lokalne dane publiczne — RODO, BIP | RODO + UDIP | dr-08/modules/mod-lokalne-dane-publiczne-RODO-BIP | ✅ OK |
| Ustawa o kontroli w administracji i inspekcjach | Dz.U. 2020 poz. 224 ze zm. | dr-08/modules/mod-kontrola-administracji-inspekcje | ✅ OK |
| Dzienniki urzędowe województw + BIP | Dz.U. 2012 poz. 317 ze zm. | dr-08/modules/mod-dzienniki-urzedowe-BIP-publikacja | ✅ OK |
| Ustawa o czystości i porządku w gminach | Dz.U. 2025 poz. 765 t.j. | dr-08/modules/mod-ustawa-komunalne-wod-kan-transport-czystosc | ✅ OK |
| Ustawa o zbiorowym zaopatrzeniu w wodę | Dz.U. 2024 poz. 757 ze zm. | dr-08/modules/mod-ustawa-komunalne-wod-kan-transport-czystosc | ✅ OK |
| Ustawa o publicznym transporcie zbiorowym | Dz.U. 2025 poz. 285 t.j. | dr-08/modules/mod-ustawa-komunalne-wod-kan-transport-czystosc | ✅ OK |
| Ustawa o ochronie zabytków i opiece nad zabytkami | Dz.U. 2024 poz. 1292 t.j. | dr-08/modules/mod-ustawa-zabytki-rewitalizacja | ✅ OK |
| Ustawa o rewitalizacji | Dz.U. 2024 poz. 278 ze zm. | dr-08/modules/mod-ustawa-zabytki-rewitalizacja | ✅ OK |
| Ustawa o cmentarzach i chowaniu zmarłych | Dz.U. 2023 poz. 1284 ze zm. | dr-08/modules/mod-ustawa-zabytki-rewitalizacja | ✅ OK |
| Zmiana ustawy o obronie cywilnej — 2026.646 | Dz.U. 2026 poz. 646 — vacatio legis weryfikuj w ISAP | dr-08/modules/mod-ustawa-zarzadzanie-kryzysowe | ⏳ OCZEKUJE |
| **Ustawa o drogach publicznych — SPP/ŚSPP** (art. 13, 13b, 13f opłaty parkingowe) | Dz.U. 2025 poz. 889 t.j. | dr-08/modules/mod-UDP-strefy-platnego-parkowania | ✅ OK |

---

## DR-09 — Budownictwo, Środowisko, Energia, Transport

*Źródło: dr-09/MAPA-AKTOW.md | Weryfikacja: 2026-06-05*

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Prawo budowlane | Dz.U. 2026 poz. 524 t.j. ⚠️ art. 1 pkt 1 lit. c → 20.09.2026 | dr-09/modules/mod-PrBud-prawo-budowlane | ✅ OK |
| Ustawa o samorządach zawodowych architektów oraz inżynierów budownictwa (zawód zaufania publicznego) | Dz.U. 2025 poz. 1783 t.j. ✅ VER: 2026-06-14 | dr-09/modules/mod-ustawa-architekci-inzynierowie-budownictwa-zawod | ✅ NOWY |
| Prawo ochrony środowiska (POŚ) | Dz.U. 2026 poz. 670 t.j. | dr-09/modules/mod-POS-prawo-ochrony-srodowiska | ✅ OK |
| Prawo energetyczne + URE + OZE | Dz.U. 2025 poz. 459 ze zm. (zm.: ⏳ 2026.516) | dr-09/modules/mod-PrEnergetyczne-URE-OZE | ✅ OK |
| Prawo gazowe | Dz.U. 2024 poz. 1538 ze zm. | dr-09/modules/mod-ustawa-prawo-gazowe | ✅ OK |
| Ustawa o elektromobilności | Dz.U. 2024 poz. 1634 ze zm. | dr-09/modules/mod-ustawa-charakterystyka-energetyczna | ✅ OK |
| Ustawa o charakterystyce energetycznej budynków | Dz.U. 2024 poz. 544 ze zm. | dr-09/modules/mod-ustawa-charakterystyka-energetyczna | ✅ OK |
| Ustawa o transporcie drogowym, kolejowym, lotniczym | Dz.U. 2024 poz. 1539 ze zm. | dr-09/modules/mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski | ✅ OK |
| Prawo lotnicze | Dz.U. 2023 poz. 2110 ze zm. (zm.: 2025.1431) | dr-09/modules/mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski | ✅ OK |
| Prawo o transporcie kolejowym | Dz.U. 2025 poz. 1234 t.j. | dr-09/modules/mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski | ✅ OK |
| Specustawa drogowa (ZRID) | Dz.U. 2024 poz. 1641 ze zm. | dr-09/modules/mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski | ✅ OK |
| Ustawa o drogach publicznych | Dz.U. 2025 poz. 889 t.j. | dr-09/modules/mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski | ✅ OK |
| Prawo wodne | Dz.U. 2025 poz. 960 t.j. | dr-09/modules/mod-PrWodne-gospodarka-sciekowa | ✅ OK |
| Ustawa o odpadach + gospodarka komunalna | Dz.U. 2023 poz. 1587 ze zm. | dr-09/modules/mod-ustawa-odpadach-gospodarka-komunalna | ✅ OK |
| Ustawa o OOŚ — oceny środowiskowe | Dz.U. 2024 poz. 1112 t.j. | dr-09/modules/mod-ustawa-OOS-oceny-srodowiskowe | ✅ OK |
| Ustawa leśna, łowiecka, ochrona przyrody | Dz.U. 2024 poz. 1219 + Dz.U. 2026 poz. 13 | dr-09/modules/mod-ustawa-lesna-lowiecka-ochrona-przyrody | ✅ OK |
| Ustawa o planowaniu i zagospodarowaniu przestrzennym | Dz.U. 2026 poz. 538 t.j. | dr-09/modules/mod-ustawa-planowanie-przestrzenne | ✅ OK |
| Ustawa o gospodarce nieruchomościami (UGN) | Dz.U. 2024 poz. 1899 ze zm. | dr-09/modules/mod-UGN-gospodarka-nieruchomosciami | ✅ OK |
| Prawo geodezyjne + wywłaszczenia | Dz.U. 2023 poz. 1752 ze zm. | dr-09/modules/mod-PrGeodezyjne-kartografia-wywlaszczenia | ✅ OK |
| Prawo geologiczne i górnicze | Dz.U. 2024 poz. 1290 t.j. | dr-09/modules/mod-prawo-geologiczne-gornicze | ✅ OK |
| Kodeks morski | Dz.U. 2023 poz. 1523 ze zm. | dr-09/modules/mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski | ✅ OK |
| Ustawa o zapobieganiu szkodom w środowisku | Dz.U. 2007 poz. 75 ze zm. | dr-09/modules/mod-POS-prawo-ochrony-srodowiska | ✅ OK |
| Ustawa deweloperska | Dz.U. 2024 poz. 695 t.j. | dr-09/modules/mod-UGN-gospodarka-nieruchomosciami | ✅ OK |
| Ustawa o ochronie praw lokatorów | Dz.U. 2025 poz. 413 ze zm. | dr-09/modules/mod-UGN-gospodarka-nieruchomosciami | ✅ OK |
| Ustawa o KW i hipotece | Dz.U. 2025 poz. 341 t.j. | dr-09/modules/mod-UGN-gospodarka-nieruchomosciami | ✅ OK |
| PrBud — art. 1 pkt 1 lit. c — zmiana wchodzi 20.09.2026 | Dz.U. 2026 poz. 524 (przepis) | dr-09/modules/mod-PrBud-prawo-budowlane | ⏳ OCZEKUJE |
| Prawo energetyczne — zmiana 2026 | Dz.U. 2026 poz. 516 — vacatio weryfikuj | dr-09/modules/mod-PrEnergetyczne-URE-OZE | ⏳ OCZEKUJE |

---

## DR-10 — Zdrowie, Farmacja, Żywność, Rolnictwo

*Źródło: dr-10/MAPA-AKTOW.md | Weryfikacja: 2026-06-05*

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Prawo farmaceutyczne | Dz.U. 2026 poz. 612 t.j. | dr-10/modules/mod-PrFarm-prawo-farmaceutyczne | ✅ OK |
| GIF/GIS/WIF — nadzór farmaceutyczny | Dz.U. 2026 poz. 612 + Dz.U. 2023 poz. 394 | dr-10/modules/mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny | ✅ OK |
| Rozp. REACH + CLP — chemikalia | Rozp. (WE) 1907/2006 + 1272/2008 | dr-10/modules/mod-REACH-CLP-chemikalia | ✅ OK |
| Ustawa o działalności leczniczej | Dz.U. 2026 poz. 156 t.j. | dr-10/modules/mod-ustawa-dzialalnosc-lecznicza-pacjent | ✅ OK |
| Ustawa o świadczeniach zdrowotnych — NFZ | Dz.U. 2025 poz. 1461 t.j. | dr-10/modules/mod-ustawa-NFZ-swiadczenia | ✅ OK |
| Ustawa o jakości w opiece zdrowotnej | Dz.U. 2023 poz. 1692 ze zm. | dr-10/modules/mod-ustawa-jakosc-opieka-zdrowotna | ✅ OK |
| Ustawa o zawodzie lekarza | Dz.U. 2026 poz. 37 t.j. | dr-10/modules/mod-ustawa-dzialalnosc-lecznicza-pacjent | ✅ OK |
| Ustawa o zawodach pielęgniarki i położnej | Dz.U. 2025 poz. 450 t.j. | dr-10/modules/mod-ustawa-pielegniarka-polozna | ✅ OK |
| Ustawa o diagnostyce laboratoryjnej | Dz.U. 2022 poz. 2162 ze zm. | dr-10/modules/mod-ustawa-diagnostyka-laboratoryjna | ✅ OK |
| Ustawa o wyrobach medycznych | Dz.U. 2022 poz. 974 ze zm. | dr-10/modules/mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny | ✅ OK |
| Ustawa o produktach biobójczych | Dz.U. 2021 poz. 24 ze zm. | dr-10/modules/mod-ustawa-produkty-biobojcze | ✅ OK |
| Ustawa Prawo oświatowe + szkolnictwo wyższe | Dz.U. 2024 poz. 737 + Dz.U. 2024 poz. 1571 | dr-10/modules/mod-ustawa-oswiata-szkolnictwo-wyzsze | ✅ OK |
| Ustawa o sporcie + imprezach masowych | Dz.U. 2023 poz. 2048 | dr-10/modules/mod-ustawa-rolne-zywnosc-weterynaria | ✅ OK |
| Ustawa o bezpieczeństwie żywności | Dz.U. 2023 poz. 1448 ze zm. | dr-10/modules/mod-ustawa-bezpieczenstwo-zywnosci | ✅ OK |
| Ustawa o Inspekcji Weterynaryjnej | Dz.U. 2024 poz. 12 t.j. | dr-10/modules/mod-ustawa-inspekcja-weterynaryjna | ✅ OK |
| Ustawa o izbach aptekarskich (zawód zaufania publicznego) | Dz.U. 2025 poz. 1693 t.j. ✅ VER: 2026-06-14 | dr-10/modules/mod-ustawa-aptekarz-zawod | ✅ NOWY |
| Ustawa o zawodzie lekarza weterynarii i izbach lekarsko-weterynaryjnych (zawód zaufania publicznego) | Dz.U. 2026 poz. 125 t.j. ✅ VER: 2026-06-14 | dr-10/modules/mod-ustawa-lekarz-weterynarii-zawod | ✅ NOWY |
| Ustawa o zawodzie psychologa oraz samorządzie zawodowym psychologów (⚠️ stan przejściowy 2026-2028) | Dz.U. 2026 poz. 187 (nowa, w życie 19.05.2028) + Dz.U. 2019 poz. 1026 (obecnie faktycznie obowiązująca) ✅ VER: 2026-06-14 | dr-10/modules/mod-ustawa-psycholog-zawod | ✅ NOWY |
| Ustawa refundacyjna | Dz.U. 2025 poz. 907 t.j. | dr-10/modules/mod-PrFarm-prawo-farmaceutyczne | ✅ OK |
| Ustawa o ochronie zdrowia psychicznego | Dz.U. 2024 poz. 917 ze zm. | dr-10/modules/mod-ustawa-dzialalnosc-lecznicza-pacjent | ✅ OK |
| Ustawa o prawach pacjenta i Rzeczniku Praw Pacjenta | Dz.U. 2024 poz. 581 t.j. ✅ VER: 2026-06-14 (TRYB DZU; uwaga: nowelizacja 2026/26 art.23) | dr-10/modules/mod-ustawa-prawa-pacjenta-framework | ✅ OK |
| Ustawa o działalności leczniczej | Dz.U. 2026 poz. 156 t.j. ✅ VER: 2026-06-14 (TRYB DZU — był 2024/799) | dr-10/modules/mod-ustawa-medyczne-szczegolowy | ✅ OK |
| Ustawa o substancjach chemicznych (REACH) | Dz.U. 2022 poz. 1816 ze zm. | dr-10/modules/mod-REACH-CLP-chemikalia | ✅ OK |
| Adwokatura / zawody medyczne — ustawy korporacyjne | Dz.U. 2024 poz. 1564 | dr-10/modules/mod-ustawa-pielegniarka-polozna | ✅ OK |
| Ustawa o ubezpieczeniach obowiązkowych lekarzy | Dz.U. 2025 poz. 367 t.j. | dr-10/modules/mod-ustawa-dzialalnosc-lecznicza-pacjent | ✅ OK |
| Ustawa o medycynie — edukacja specjalna | Dz.U. 2022 poz. 2240 | dr-10/modules/mod-ustawa-edukacja-specjalna-dostepnosc | ✅ OK |
| Ustawa o rolnictwie ekologicznym + weterynaria | Dz.U. 2024 poz. 1284 | dr-10/modules/mod-ustawa-rolne-zywnosc-weterynaria | ✅ OK |
| Ustawa KRUS | Dz.U. 2024 poz. 90 ze zm. | dr-10/modules/mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny | ✅ OK |
| Prawo farmaceutyczne — zmiana 2025 | Dz.U. 2025 poz. 1537 ze zm. | dr-10/modules/mod-PrFarm-prawo-farmaceutyczne | ⏳ OCZEKUJE |

---

## DR-11 — Cyfrowe, Cyberbezpieczeństwo, AI, Dane, IP

*Źródło: dr-11/MAPA-AKTOW.md | Weryfikacja: 2026-06-05*

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| RODO — Rozp. UE 2016/679 | Dz.Urz. UE L 119/1 | dr-11/modules/mod-RODO-GDPR-2016-679 | ✅ OK |
| Ustawa UODO — implementacja RODO | Dz.U. 2019 poz. 1781 ze zm. | dr-11/modules/mod-UODO-postepowanie-ochrona-danych | ✅ OK |
| Ustawa o KSC + NIS2 (2022/2555) | Dz.U. 2024 poz. 1226 ze zm. (zm.: 2026.252) | dr-11/modules/mod-KSC-NIS2-cyberbezpieczenstwo-telekom | ✅ OK |
| Ustawa o krajowym systemie certyfikacji cyberbezpieczeństwa | Dz.U. 2025 poz. 1017 | dr-11/modules/mod-ustawa-certyfikacja-cyberbezpieczenstwa | ✅ OK |
| KSC — krajowy system cyberbezpieczeństwa | Dz.U. 2026 poz. 20 t.j. | dr-11/modules/mod-KSC-NIS2-cyberbezpieczenstwo-telekom | ✅ OK |
| DORA (Rozp. UE 2022/2554) + eIDAS 2.0 | Rozp. UE 2022/2554 + 2024/1183 | dr-11/modules/mod-DORA-eIDAS-cyfrowe-finanse | ✅ OK |
| Prawo komunikacji elektronicznej + UKE | Dz.U. 2024 poz. 1220 t.j. | dr-11/modules/mod-PrTelekom-poczta-UKE | ✅ OK |
| Ustawa o prawie autorskim i prawach pokrewnych | Dz.U. 2025 poz. 24 t.j. | dr-11/modules/mod-PrAut-wlasnosc-intelektualna-IP | ✅ OK |
| AI Act — Rozp. UE 2024/1689 | Dz.Urz. UE L 2024/1689 | dr-11/modules/mod-AI-Act-framework | ✅ OK |
| DMA — Digital Markets Act (Rozp. UE 2022/1925) | Dz.Urz. UE L 265/1 z 12.10.2022 | dr-11/modules/mod-DMA-digital-markets-act | ✅ OK |
| DSA — Digital Services Act (Rozp. UE 2022/2065) | Dz.Urz. UE L 277/1 z 27.10.2022 | dr-11/modules/mod-DSA-digital-services-act | ✅ OK |
| CRA, EUCS, DA, DGA — akty cyfrowe UE | Dz.Urz. UE L 2024/2847 + inne | dr-11/modules/mod-EUCS-CRA-akty-regulacyjne-UE | ✅ OK |
| MiCA — kryptoaktywa (Rozp. UE 2023/1114) | Dz.Urz. UE L 2023/1114 | dr-11/modules/mod-MiCA-kryptoaktywa | ✅ OK |
| Ustawa o informatyzacji podmiotów publicznych + KSeF | Dz.U. 2024 poz. 1557 t.j. | dr-11/modules/mod-ustawa-informatyzacja-podmiotow-publicznych | ✅ OK |
| Ustawa o otwartych danych | Dz.U. 2023 poz. 1524 t.j. | dr-11/modules/mod-ustawa-otwarte-dane | ✅ OK |
| Ustawa o podpisie elektronicznym i eIDAS | Rozp. UE 910/2014 + Dz.U. 2016 poz. 147 | dr-11/modules/mod-ustawa-podpis-elektroniczny | ✅ OK |
| Prawo własności przemysłowej | Dz.U. 2023 poz. 1170 t.j. | dr-11/modules/mod-ustawa-prawo-wlasnosci-przemyslowej | ✅ OK |
| Ustawa o usługach świadczonych drogą elektroniczną | Dz.U. 2020 poz. 344 ze zm. | dr-11/modules/mod-ustawa-uslugi-elektroniczne | ✅ OK |
| Ustawa UODO stara (2018) — ref historyczna | Dz.U. 2018 poz. 1000 | dr-11/modules/mod-UODO-postepowanie-ochrona-danych | ✅ OK |
| KSeF — ustawa o e-Fakturze | Dz.U. 2021 poz. 1237 ze zm. | dr-11/modules/mod-ustawa-informatyzacja-podmiotow-publicznych | ✅ OK |
| Ustawa o usługach zaufania (krajowa) | Dz.U. 2016 poz. 1579 ze zm. | dr-11/modules/mod-ustawa-podpis-elektroniczny | ✅ OK |

---

## DR-12 — Sądownictwo, Prokuratura, Zawody Prawnicze

*Źródło: dr-12/MAPA-AKTOW.md | Weryfikacja: 2026-06-05*

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| PUSP (ustrój sądów powszechnych) | Dz.U. 2024 poz. 334 ze zm. (zm.: 2025.526) | → DR-01/mod-USP-ustroj-sadow-powszechnych | 🔗 odesłanie |
| Ustawa Prawo o prokuraturze | Dz.U. 2024 poz. 390 ze zm. (zm.: 2025.304) | dr-12/modules/mod-PrProkuratura-organy-ochrony-prawa | ✅ OK |
| KPC — arbitraż i mediacja | Dz.U. 2026 poz. 468 ze zm. | dr-12/modules/mod-KPC-arbitraz-mediacja-ADR | ✅ OK |
| KPC — biegli sądowi i opinie | Dz.U. 2026 poz. 468 ze zm. | dr-12/modules/mod-KPC-biegli-sadowi-opinie | ✅ OK |
| KSCU — koszty sądowe | Dz.U. 2025 poz. 1228 t.j. | dr-12/modules/mod-KSCU-koszty-sadowe-i-pomoc-prawna | ✅ OK |
| Ustawa o regulatorach (UOKiK, URE, UKE, KNF) | UOKiK: Dz.U. 2025 poz. 1714 t.j. + URE: Prawo energetyczne Dz.U. 2026 poz. 43 t.j. + UKE: Prawo komunikacji elektronicznej Dz.U. 2024 poz. 1221 + ustawa o wspieraniu rozwoju usług i sieci telekom. Dz.U. 2025 poz. 311 t.j. + KNF: ustawy sektorowe (sprawdzać każdorazowo) ✅ VER: 2026-06-14 (TRYB DZU — moduł ma własną tabelę aktów, rozwinięto wiersz dla zgodności) | dr-12/modules/mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF | ✅ OK |
| Ustawa o sędziach, referendarzach, kuratorach | Dz.U. 2024 poz. 334 ze zm. | dr-12/modules/mod-ustawa-sedziowie-referendarze-kuratorzy | ✅ OK |
| Ustawa o odpowiedzialności dyscyplinarnej zawodów | Ustawy korporacyjne | dr-12/modules/mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow | ✅ OK |
| Ustawa Prawo o adwokaturze | Dz.U. 2024 poz. 1564 ze zm. | dr-12/modules/mod-ustawa-adwokatura | ✅ OK |
| Ustawa o radcach prawnych | Dz.U. 2024 poz. 499 ze zm. | dr-12/modules/mod-ustawa-radcowie-prawni | ✅ OK |
| Ustawa Prawo o notariacie (zawód) | Dz.U. 2026 poz. 614 t.j. | dr-12/modules/mod-ustawa-notariat | ✅ OK |
| Ustawa o komornikach sądowych | Dz.U. 2024 poz. 1458 t.j. ✅ VER: 2026-06-14 (TRYB DZU — potwierdzono aktualny, KOREKTA: 2026/26 to inny akt - Ustawa SUS, błąd wcześniejszego wyszukiwania) | dr-12/modules/mod-ustawa-komornicy-sadowi-zawod | ✅ OK |
| Ustawa o rzecznikach patentowych (zawód, zawód zaufania publicznego) | Dz.U. 2024 poz. 749 t.j. + Dz.U. 2025 poz. 1679 (w życie 3.02.2026) ✅ VER: 2026-06-14 | dr-12/modules/mod-ustawa-rzecznicy-patentowi-zawod | ✅ NOWY |

---

## DR-13 — Służby, Bezpieczeństwo, Informacje Niejawne

*Źródło: dr-13/MAPA-AKTOW.md | Weryfikacja: 2026-06-05*
*⚠️ Służby mundurowe — bardzo liczne nowelizacje 2024–2026. Przed cytowaniem weryfikuj ISAP.*

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Ustawa o Policji | Dz.U. 2024 poz. 1589 t.j. ze zm. (zm.: 2024.1248, 2024.1562, 2025.1366) | dr-13/modules/mod-ustawa-policja | ✅ OK |
| Ustawa o Straży Granicznej | Dz.U. 2024 poz. 1552 t.j. ze zm. (zm.: 2025.1366) | dr-13/modules/mod-ustawa-straz-graniczna | ✅ OK |
| Ustawa o Żandarmerii Wojskowej | Dz.U. 2024 poz. 1654 t.j. ze zm. | dr-13/modules/mod-ustawa-zandarmeria-wojskowa | ✅ OK |
| Ustawa o ABW i AW | Dz.U. 2024 poz. 1183 t.j. ze zm. | dr-13/modules/mod-ustawa-ABW-AW-CBA-sluzby-specjalne | ✅ OK |
| Ustawa o CBA | Dz.U. 2024 poz. 1392 t.j. ze zm. | dr-13/modules/mod-ustawa-ABW-AW-CBA-sluzby-specjalne | ✅ OK |
| Ustawa o SOP | Dz.U. 2024 poz. 1672 t.j. ze zm. (zm.: 2025.1366) | dr-13/modules/mod-ustawa-ABW-AW-CBA-sluzby-specjalne | ✅ OK |
| Ustawa o ochronie informacji niejawnych | Dz.U. 2025 poz. 1209 t.j. | dr-13/modules/mod-ustawa-informacje-niejawne | ✅ OK |
| Ustawa o obronie Ojczyzny | Dz.U. 2022 poz. 655 ze zm. (zm.: 2025.825, 2025.1014) | dr-13/modules/mod-ustawa-obrona-ojczyzny-mobilizacja | ✅ OK |
| Ustawa o ochronie ludności i obronie cywilnej | Dz.U. 2024 poz. 1907 ze zm. (zm.: 2025.1705, ⚡ 2026.646) | dr-13/modules/mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna | ✅ OK |
| Ustawa o działaniach antyterrorystycznych | Dz.U. 2024 poz. 1474 t.j. | dr-13/modules/mod-ustawa-ABW-AW-CBA-sluzby-specjalne | ✅ OK |
| Ustawa — szczególne środki zabezpieczające | Dz.U. 2020 poz. 2001 ze zm. | dr-13/modules/mod-ustawa-szczegolne-srodki-zabezpieczajace | ✅ OK |
| Ustawa o środkach przymusu bezpośredniego | Dz.U. 2023 poz. 202 t.j. | dr-13/modules/mod-ustawa-policja | ✅ OK |
| Ustawa o udzielaniu ochrony cudzoziemcom | Dz.U. 2024 poz. 1546 t.j. | dr-13/modules/mod-ustawa-straz-graniczna | ✅ OK |
| Prawo komunikacji elektronicznej (retencja danych) | Dz.U. 2024 poz. 1220 t.j. | → DR-11/mod-PrTelekom-poczta-UKE | 🔗 odesłanie |
| Zmiana ustawy o obronie cywilnej 2026.646 | Dz.U. 2026 poz. 646 — vacatio legis weryfikuj | dr-13/modules/mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna | ⏳ OCZEKUJE |
| Ustawa o zakwaterowaniu funkcjonariuszy 2025.1366 | Dz.U. 2025 poz. 1366 — weryfikuj termin wejścia | dr-13/modules/mod-ustawa-policja | ⏳ OCZEKUJE |

---

## DR-14 — Prawo UE, Międzynarodowe, Prawa Człowieka

*Źródło: dr-14/MAPA-AKTOW.md | Weryfikacja: 2026-06-07*

| Akt prawny | Dz.U. / Dz.Urz. UE | Moduł | Status |
|---|---|---|---|
| TUE + TFUE — prawo pierwotne UE | Dz.Urz. UE C 326 z 26.10.2012 | dr-14/modules/mod-TFUE-TUE-prawo-pierwotne-UE | ✅ OK |
| Art. 267 TFUE — pytanie prejudycjalne do TSUE | Dz.Urz. UE C 326 z 26.10.2012 | dr-14/modules/mod-TFUE-TUE-prawo-pierwotne-UE → ANEKS prejudycjalne | ✅ OK |
| Karta Praw Podstawowych UE (KPP) | Dz.Urz. UE C 326/391 (od 01.12.2009) | dr-14/modules/mod-KPP-karta-praw-podstawowych-UE | ✅ OK |
| EKPC + ETPC — prawa człowieka | Dz.U. 1993 nr 61 poz. 284 | dr-14/modules/mod-EKPC-ETPC-prawa-czlowieka | ✅ OK |
| Rozp. Bruksela Ia 1215/2012 | Dz.Urz. UE L 351/1 | dr-14/modules/mod-KPC-egzekucja-transgraniczna-UE | ✅ OK |
| KPC — egzekucja transgraniczna | Dz.U. 2026 poz. 468 t.j. | dr-14/modules/mod-KPC-egzekucja-transgraniczna-UE | ✅ OK |
| Rzym I 593/2008 + Rzym II 864/2007 | EUR-Lex — weryfikuj | dr-14/modules/mod-PMPP-prawo-prywatne-miedzynarodowe | ✅ OK |
| Prawo prywatne międzynarodowe (krajowe) | Dz.U. 2023 poz. 503 t.j. | dr-14/modules/mod-PMPP-prawo-prywatne-miedzynarodowe | ✅ OK |
| Rozp. spadkowe 650/2012 | EUR-Lex — weryfikuj | dr-14/modules/mod-PMPP-prawo-prywatne-miedzynarodowe | ✅ OK |
| Bruksela IIb 2019/1111 | EUR-Lex (od 01.08.2022) | dr-14/modules/mod-PMPP-prawo-prywatne-miedzynarodowe | ✅ OK |
| Haga 1980 — uprowadzenie dziecka | hcch.net | dr-14/modules/mod-PMPP-prawo-prywatne-miedzynarodowe | ✅ OK |
| Haga 2007 — alimenty transgraniczne | hcch.net | dr-14/modules/mod-PMPP-prawo-prywatne-miedzynarodowe | ✅ OK |
| MPPOiP (ONZ) | Dz.U. 1977 nr 38 poz. 167 | dr-14/modules/mod-ONZ-pakty-prawa-czlowieka | ✅ OK |
| MPPGSiK (ONZ) | Dz.U. 1977 nr 38 poz. 169 | dr-14/modules/mod-ONZ-pakty-prawa-czlowieka | ✅ OK |
| CRPD — Konwencja ONZ o prawach osób z niepełnosprawnościami | Dz.U. 2012 poz. 1169 | dr-14/modules/mod-ONZ-pakty-prawa-czlowieka | ✅ OK |
| Traktat Waszyngtoński (NATO) | Dz.U. 1999 nr 87 poz. 970 | dr-14/modules/mod-NATO-umowy-miedzynarodowe | ✅ OK |
| SOFA NATO | Dz.U. 2000 nr 21 poz. 257 | dr-14/modules/mod-NATO-umowy-miedzynarodowe | ✅ OK |
| Ustawa o obecności sił zbrojnych obcych | Dz.U. 2020 poz. 1287 | dr-14/modules/mod-NATO-umowy-miedzynarodowe | ✅ OK |
| Rejestr źródeł prawa i lifecycle | — (moduł metodyczny) | dr-14/modules/mod-rejestr-zrodla-prawa-lifecycle | ✅ OK |

---

## DR-15 — Compliance, ISO, Governance, Audyt

| Akt prawny / norma | Źródło | Moduł | Status |
|---|---|---|---|
| PZP — zamówienia obronne i bezpieczeństwa | Dz.U. 2024 poz. 1320 ze zm. | dr-15/modules/mod-PZP-zamowienia-obronne-bezpieczenstwa | ✅ OK |
| Ustawa AML — nadzór finansowy | Dz.U. 2025 poz. 644 t.j. | dr-15/modules/mod-AML-nadzor-finansowy-instytucje | ✅ OK |
| DORA — compliance sektor finansowy | Rozp. UE 2022/2554 | dr-15/modules/mod-DORA-compliance-sektor-finansowy | ✅ OK |
| Ustawa — nauczyciele i uczelnie | Dz.U. 2023 poz. 984 + Dz.U. 2024 poz. 1571 | dr-15/modules/mod-ustawa-nauczyciele-uczelnie | ✅ OK |
| Ustawa o ochronie sygnalistów | Dz.U. 2024 poz. 928 ze zm. | dr-15/modules/mod-ustawa-sygnalisci | ✅ OK |
| ISO 37001:2016 — Anti-bribery management | Norma ISO | dr-15/modules/mod-ISO-37001-antykorupcja | ✅ OK |
| ISO 37301:2021 — Compliance management systems | Norma ISO | dr-15/modules/mod-ISO-37301-compliance-management | ✅ OK |
| ISO 27001:2022 — Information security management | Norma ISO | dr-15/modules/mod-ISO-27001-bezpieczenstwo-informacji | ✅ OK |
| ISO 42001:2023 — AI management system | Norma ISO | dr-15/modules/mod-ISO-42001-AI-management | ✅ OK |

---

## DR-16 — Pisma, Strategia, Dowody, Orzecznictwo

*Źródło: dr-16/MAPA-AKTOW.md | Weryfikacja: 2026-06-05*

| Narzędzie / akt | Podstawa | Moduł | Status |
|---|---|---|---|
| KPC — przesłuchanie świadków (art. 258–305) | Dz.U. 2026 poz. 468 ze zm. | dr-16/modules/mod-KPC-przesluchanie-swiadkow | ✅ OK |
| KPC — e-doręczenia i portal sądowy | Dz.U. 2026 poz. 468 ze zm. | dr-16/modules/mod-KPC-e-doreczenia-portal-sadowy | ✅ OK |
| KPC — procedury UE (TSUE, ETPCz) | KPC + Rozp. UE | dr-16/modules/mod-KPC-procedury-UE-TSUE-ETPC | ✅ OK |
| KPC — arbitraż sportowy i dyscyplinarny | Dz.U. 2026 poz. 468 cz. V | dr-16/modules/mod-KPC-arbitraz-sportowy-dyscyplinarny | ✅ OK |
| KPC — wzory pism procesowych | Dz.U. 2026 poz. 468 ze zm. | dr-16/modules/mod-KPC-wzory-pism-procesowych | ✅ OK |
| Ustawa Prawo prasowe | Dz.U. 2018 poz. 1914 ze zm. | dr-16/modules/mod-ustawa-prawo-prasowe-media | ✅ OK |
| Konstytucja — prawa i wolności w procesie | Art. 45, 47, 51, 77 Konstytucji | dr-16/modules/mod-Konstytucja-prawa-i-wolnosci-procesowe | ✅ OK |
| Ustawa o archiwach i dokumentacji | Dz.U. 2020 poz. 164 ze zm. | dr-16/modules/mod-ustawa-archiwa-dokumentacja | ✅ OK |
| Ustawa o obywatelstwie, paszportach, ewidencji | Dz.U. 2024 poz. 80 + inne | dr-16/modules/mod-ustawa-obywatelstwo-paszporty-ewidencja | ✅ OK |
| Ustawa o emeryturach pomostowych — wykaz prac szczególnych | Dz.U. 2025 poz. 468 t.j. ✅ VER: 2026-06-09 | dr-16/modules/mod-narzedzie-kalkulatory | ✅ OK |
| Narzędzia procesowe — kalkulatory, kontrolery | — | dr-16/modules/mod-narzedzie-kalkulatory | ✅ OK |

---

## MONITORING — Akty opublikowane, niebędące jeszcze w pełni w życiu

> **Procedura audytu (FAZA 3D):** Przy każdym audycie DZU sprawdź każdy wpis.
> Akt, który wszedł w życie → zmień Status w tabeli DR powyżej na ✅ OK, usuń z tej tabeli.
> Akt uchylony przed wejściem → status ❌, usuń, odnotuj w AUDIT-JOURNAL.

| Akt | Dz.U. | Data wejścia w życie | Zmienia / zastępuje | DR-skill | Status |
|---|---|---|---|---|---|
| KPK — nowelizacja 2026 (wybrane przepisy) | 2026 poz. 638 | vacatio legis — weryfikuj w ISAP | KPK t.j. 2026.490 | DR-03 | ⚡ WCHODZI |
| Ordynacja podatkowa — część przepisów | 2026 poz. 622 | ~IX.2026 (~4 mies. od ogłoszenia) | OP poprzedni 2025.111 | DR-06 | ⚡ WCHODZI |
| Obrona cywilna — zmiana 2026 | 2026 poz. 646 | vacatio legis — weryfikuj w ISAP | Ustawa 2024.1907 | DR-08, DR-13 | ⏳ OCZEKUJE |
| Prawo energetyczne — zmiana 2026 | 2026 poz. 516 | vacatio legis — weryfikuj w ISAP | PrEnergetyczne 2025.459 | DR-09 | ⏳ OCZEKUJE |
| PrBud — art. 1 pkt 1 lit. c | 2026 poz. 524 (przepis) | 20.09.2026 | — (przepis nowy) | DR-09 | ⏳ OCZEKUJE |
| Prawo budowlane — zmiana 2025 | 2025 poz. 1847 | weryfikuj vacatio w ISAP | PrBud t.j. 2026.524 | DR-09 | ⏳ OCZEKUJE |
| KPK — zmiana 2025.1390 | 2025 poz. 1390 | vacatio — weryfikuj w ISAP | KPK t.j. 2026.490 | DR-03 | ⏳ OCZEKUJE |
| Zakwaterowanie funkcjonariuszy służb | 2025 poz. 1366 | weryfikuj termin wejścia | Policja, SG, PSP, SOP | DR-13 | ⏳ OCZEKUJE |
| Prawo farmaceutyczne — zmiana 2025 | 2025 poz. 1537 | weryfikuj termin wejścia | PrFarm t.j. 2026.612 | DR-10 | ⏳ OCZEKUJE |

### Legenda statusów MONITORING

| Status | Znaczenie |
|---|---|
| ⏳ OCZEKUJE | Opublikowany, vacatio legis w toku — nie stosuj do zdarzeń wcześniejszych |
| ⚡ WCHODZI | Data wejścia w ciągu 90 dni od daty audytu — zaktualizuj moduł przed tą datą |
| ✅ WSZEDŁ | Wszedł w życie — przesuń do tabeli DR, usuń z MONITORING |
| ❌ UCHYLONY | Uchylony przed wejściem — usuń, odnotuj w AUDIT-JOURNAL |

---

*Wersja: 5.4 | Data: 2026-06-14*
*Łączna liczba wpisów w tabelach DR: 279 (262 ✅ + 9 🔗 + 8 ⏳/⚡)*
*Źródła lokalne: dr-01..dr-16/MAPA-AKTOW.md | Źródło centralne: mapa_dzu_2026-06-14.md*
*TRYB DZU 2026-06-14: WARN-8 ZAMKNIĘTY — 16/16 pozycji zweryfikowane na ISAP
i naprawione w dwóch sesjach. Sesja 1 (5 poz.): A1 notariat→2026/614, A2
PrAut→2025/24, A3 komornicy→2024/1458 potwierdzony (ROUTING był już poprawny; KOREKTA: wcześniejszy wynik '2026/26' był błędem wyszukiwania - to inny akt, Ustawa SUS), B1 mandat posła/senatora→2024/907,
B2 referendum→2025/300. Sesja 2 (11 poz.): A4 regulatorzy (rozwinięto na
4 akty per regulator, zgodnie z tabelą wewnętrzną modułu), A5 KSCU→2025/1228,
A6 informacje niejawne→2025/1209, B3 otwarte dane→2023/1524 t.j., B4
KKS+AML→2025/644, B5 PKWiU rejestracja w ROUTING + Op pointer, C2
narkomania→2023/1939 (dodany), C3 odpowiedzialność podmiotów
zbiorowych→2024/1822 (był 2024/1247, też nieaktualny!), C4 prawa
pacjenta→2024/581 (dodany), C5 działalność lecznicza→2026/156 (był 2024/799,
podwójnie nieaktualny). Pełny dziennik:
audyt-systemu-v4/references/AUDIT-JOURNAL.md, AUDYT-2026-06-14f.*
