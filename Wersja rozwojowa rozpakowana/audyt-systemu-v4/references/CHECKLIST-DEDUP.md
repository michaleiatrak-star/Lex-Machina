# CHECKLIST-DEDUP.md
## audyt-systemu-v4 · Mapa pojęć → lokalizacje (proaktywne wykrywanie duplikatów)

> **Cel:** przed dodaniem NOWEJ definicji/pojęcia do systemu — sprawdź tę
> checklistę. Jeśli pojęcie już istnieje w innym miejscu, SCAL (nie duplikuj).
> Po dodaniu nowego pojęcia — DOPISZ je do tabeli niżej.
>
> **Geneza:** podczas sesji 2026-06-12 wykryto i scalono 4 nieplanowane
> duplikaty (mobbing, szkoda, terminy procesowe, wyłączenie sędziego —
> każdy istniał w 2 miejscach z RÓŻNĄ treścią, co groziło niezgodnością).
> Ta checklista ma zapobiec powtórce tego problemu.
>
> ⛔ ZASADA: jeśli pojęcie dotyczy KONKRETNEGO aktu prawnego/artykułu i jest
> używane przez ≥2 DR-skille → kandydat do `shared/definicje/` lub
> `shared/ORKA-BAS-*.md`, NIE do lokalnego modułu DR.

---

## TABELA: POJĘCIE → LOKALIZACJA KANONICZNA → KONSUMENCI

| Pojęcie | Lokalizacja kanoniczna | Konsumenci (DR) | Status |
|---|---|---|---|
| Czynny żal (KK art. 15, KKS art. 16-16a) + korekta terminologiczna "samooskarżenie" | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-czynny-zal-KK-KKS-samooskarzenie.md` — KANONICZNE, nowy moduł | DR-03 (lokalne, centralny punkt odniesienia dla 9+ modułów w DR-03/DR-06 wcześniej odwołujących się do czynnego żalu bez treści) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika |
| Dobrowolne poddanie się karze (KPK art. 335 i 387) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-dobrowolne-poddanie-sie-karze-KPK.md` — KANONICZNE, nowy moduł | DR-03 (lokalne) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika — dotąd całkowita luka |
| 15 modułów KK zbudowanych 2026-07-16/18, nigdy niezarejestrowanych w SKILL.md DR-03 | `dr-03-prawo-karne-wykroczenia-egzekucja/SKILL.md` (52 moduły, było 37) | DR-03 (lokalne) | ✅ NADROBIONE 2026-07-21, odpowiedź na polecenie rejestracji |
| Bójka/pobicie (art. 158-159), narażenie na niebezpieczeństwo z rozróżnieniem gwaranta (art. 160), narażenie na zarażenie chorobą (art. 161), NIEUDZIELENIE POMOCY (art. 162, z kluczowym rozgraniczeniem od obowiązku gwaranta) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art148-162-przeciwko-zyciu-zdrowiu.md` (nowe drzewa Z.3-Z.6) | DR-03 (lokalne) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika o nieudzielenie pomocy — moduł obiecywał art. 148-162 w tytule, ale treść urywała się na art. 157 |
| Wymóg umyślności w poplecznictwie (brak wiedzy = brak przestępstwa) + art. 240 KK (niezawiadomienie o zbrodni) + krajowy list gończy (art. 278-280 KPK) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art233-244b-przeciwko-wymiarowi-sprawiedliwosci.md` | DR-03 (lokalne, odesłanie do mod-KPK-wspolpraca-miedzynarodowa-karna dla ENA) | ✅ nowe/rozbudowane 2026-07-21, odpowiedź na pytanie użytkownika. UWAGA: znaleziono szerszą rozbieżność 52 vs 37 modułów zarejestrowanych w SKILL.md DR-03 — wymaga odrębnej sesji audytowej |
| Zawiadomienie PIP i prokuratora o wypadku ciężkim/śmiertelnym/zbiorowym (art. 234 §2 KP) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-wypadek-przy-pracy-choroba-zawodowa.md` | DR-04 (lokalne) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika o zgłoszenia do PIP |
| Kontrola legalności zatrudnienia/pobytu cudzoziemców przez SG, sprzeciw wobec kontroli, obowiązki zgłoszeniowe pracodawcy + NAPRAWIONY błędny Dz.U. w samym module | `dr-13-sluzby-bezpieczenstwo-informacje-niejawne/modules/mod-ustawa-straz-graniczna.md` | DR-13 (lokalne), DR-02 (analogia do Prawa przedsiębiorców) | ✅ nowe + naprawione 2026-07-21, odpowiedź na pytanie użytkownika o zgłoszenia do SG |
| Zgłoszenie naruszenia RODO (art. 33-34) — POTWIERDZONE jako już w pełni opracowane; dodano rozróżnienie od skargi UODO | `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-RODO-szczegolowy.md` (już istniejące) + odesłanie w `mod-UODO-postepowanie-ochrona-danych.md` | DR-11 (lokalne) | ✅ POTWIERDZONE kompletne 2026-07-21 (72h, ocena ryzyka, treść zgłoszenia, zawiadomienie osób, rejestr) — odpowiedź na pytanie użytkownika, BEZ potrzeby nowej treści |
| WNT, odwrotne obciążenie (korekta), ulga na złe długi, elementy faktury, pełne zwolnienie podmiotowe art. 113 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-VAT-podatek-od-towarow-i-uslug.md` (sekcja 3a) | DR-06 (lokalne) | ✅ rozbudowane 2026-07-21, odpowiedź na pytanie użytkownika o kompletność ustaw VAT-owskich |
| Wzory wniosków o interpretację GIP (SPL) i interpretację podatkową KIS (SPM) | `pisma-proste-v2/references/SPL-interpretacja-GIP.md` + `SPM-interpretacja-podatkowa.md` | pisma-proste-v2 (nowe schematy) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika o bazę interpretacji PIP i skarbowych |
| Rzecznik Praw Pacjenta — kompetencje, wszczęcie postępowania, praktyki naruszające zbiorowe prawa pacjentów, trzy rozstrzygnięcia | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-rzecznik-praw-pacjenta-RPP.md` — KANONICZNE, nowy moduł | DR-10 (lokalne, komplementarne do mod-ustawa-prawa-pacjenta-framework) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika — dotąd RPP był tylko jednym słowem |
| Wystąpienie pokontrolne NIK — elementy, termin 21 dni zastrzeżeń, komisja rozstrzygająca, rodzaje kontroli | `dr-06-podatki-finanse-publiczne-aml/modules/mod-UFP-finanse-publiczne-NIK-RIO.md` (sekcja 11) | DR-06 (lokalne) | ✅ rozbudowane 2026-07-21, odpowiedź na pytanie użytkownika — dotąd tylko nazwy kroków bez treści |
| Skrócony opis (description) skilla pisma-proste-v2 — z 19 do 8 linii, bez utraty cytatów artykułów (przeniesione do tabeli routingu) | `pisma-proste-v2/SKILL.md` (nagłówek YAML) | pisma-proste-v2 (lokalne) | ✅ naprawione 2026-07-21, odpowiedź na pytanie użytkownika |
| Rejestr źródeł interpretacji urzędowych — uzupełniony o Rzecznika Praw Pacjenta (DR-10), NIK (DR-15), UTK i GIOŚ (DR-09), nowy mechanizm interpretacji GIP art. 14b (DR-04), odesłania do konkretnej treści ZUS/UODO | `shared/INTERPRETACJE-URZEDOWE.md` | Wszystkie DR (lazy loading per dziedzina) | ✅ zaktualizowane 2026-07-21, odpowiedź na pytanie o kompletność źródeł interpretacji |
| Inspekcja Ochrony Środowiska — struktura GIOŚ + 16 WIOŚ, powołanie, kompetencje, ścieżka odwoławcza | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-inspekcja-ochrony-srodowiska-GIOS-WIOS.md` — KANONICZNE, nowy moduł | DR-09 (lokalne, komplementarne do mod-POS-prawo-ochrony-srodowiska), DR-03 (współpraca z organami ścigania), DR-05 (KPA) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika |
| 10 form ochrony przyrody (art. 6 ustawy) z podziałem na typy i zróżnicowane reżimy ograniczeń + tabela organów ustanawiających | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-formy-ochrony-przyrody-obszary-chronione.md` — KANONICZNE, nowy moduł | DR-09 (lokalne, komplementarne do mod-ustawa-lesna-lowiecka-ochrona-przyrody), DR-08 (publikacja uchwał) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika |
| GDDKiA i mechanizm ZRID (specustawa drogowa) — decyzja zintegrowana, przejście własności z mocy prawa, terminy odszkodowania | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-GDDKiA-specustawa-drogowa-ZRID.md` — KANONICZNE, nowy moduł | DR-09 (lokalne), DR-05 (KPA — charakter decyzji administracyjnej), DR-02 (relacja do ogólnych zasad wywłaszczenia) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika — naprawiono przy okazji wcześniejszy fałszywie pozytywny wpis w głównej mapie |
| Skarga do Prezesa UODO — merytoryczna treść (elementy, subsydiarność, zakaz żądania kary, terminy) + korekta GIODO→UODO + wzór pisma (SPK) | `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-UODO-postepowanie-ochrona-danych.md` (sekcja 9) + `pisma-proste-v2/references/SPK-skarga-do-UODO.md` | DR-11 (lokalne), pisma-proste-v2 (nowy schemat) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika o kompletność tematu GIODO/UODO |
| Poprawny Dz.U. ustawy o SUS/ZUS (2026 poz. 199) + osobny wpis dla ustawy o emeryturach czerwcowych (2025 poz. 1169) | `dr-04-prawo-pracy-zus-swiadczenia/MAPA-AKTOW.md` + `prawo-polskie-v2/ROUTING-MAP.md` (naprawione wiersze) | DR-04 (lokalne) | ✅ naprawione 2026-07-21, moduł mod-SUS-ZUS był poprawny od początku — błąd dotyczył wyłącznie plików mapujących |
| Źródła BIP marszałkowskich dla WSZYSTKICH 16 województw + rozróżnienie dziennik urzędowy vs BIP | `dr-08-samorzad-terytorialny-prawo-lokalne/modules/mod-dzienniki-urzedowe-BIP-publikacja.md` (rozbudowana tabela) | DR-08 (lokalne) | ✅ WSZYSTKIE 16 potwierdzone 2026-07-21 (Łódzkie dostarczone przez użytkownika), odpowiedź na pytanie użytkownika |
| Interpretacja indywidualna ZUS (art. 34 Prawa przedsiębiorców) + wzór wniosku (SPJ) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-SUS-ZUS-ubezpieczenia-spoleczne.md` ANEKS D + `pisma-proste-v2/references/SPJ-interpretacja-zus.md` | DR-04 (lokalne), pisma-proste-v2 (nowy schemat), analizator-umow-v1 (strategia przy ryzyku przekwalifikowania) | ✅ nowe 2026-07-21, odpowiedź na pytanie użytkownika — oba elementy (moduł DR + wzór pisma) potwierdzone jako dodane |
| VAT od samochodów osobowych (50%/100%, VAT-26, ewidencja przebiegu), ryczałt PIT za użytek prywatny (250/400 zł), ogólne zasady KUP, macierz firma/konsument/odsprzedaż | `dr-06-podatki-finanse-publiczne-aml/modules/mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP.md` — KANONICZNE, nowy moduł | DR-06 (lokalne, komplementarne do mod-VAT-podatek-od-towarow-i-uslug i mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci) | ✅ nowe 2026-07-21, odpowiedź na audyt kompletności prawa podatkowego (firmy/konsumenci/użytek własny/odsprzedaż) |
| Art. 217a KK — ochrona osób interweniujących cywilnie (nowy typ kwalifikowany, Dz.U. 2025 poz. 1818) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art222-226-ochrona-funkcjonariusza.md` (nowa sekcja) | DR-03 (lokalne) | ✅ nowe 2026-07-20, odpowiedź na polecenie sprawdzenia najnowszych zmian w prawie karnym |
| Art. 82 KW — usunięcie kary nagany (Dz.U. 2025 poz. 1814) — punkt startowy | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-art49-64-porzadek-publiczny.md` (nowa sekcja) | DR-03 (lokalne) | ⚠️ zmiana legislacyjna odnotowana 2026-07-20, pełna treść przepisu WCIĄŻ punkt startowy |
| BRD II (Dz.U. 2025 poz. 1872) — dożywotni zakaz prowadzenia (art. 42 §3), nowy obowiązkowy zakaz (art. 42 §1a), podwyższone dolne granice kar | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-PRD-nowe-przestepstwa-drogowe-BRD.md` (uzupełnione placeholdery) | DR-03 (lokalne) | ✅ uzupełnione 2026-07-20 |
| Dodatek pielęgnacyjny (ZUS), zasiłek pielęgnacyjny (gmina), świadczenie rehabilitacyjne (ZUS), świadczenie wyrównawcze (2 warianty) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-wyrownawcze.md` — KANONICZNE, nowy moduł | DR-04 (lokalne, komplementarne do mod-ustawa-swiadczenia-rodzinne i mod-ustawa-swiadczenie-wspierajace-WZON) | ✅ nowe 2026-07-20, odpowiedź na pytanie użytkownika, z uczciwą korektą terminologiczną ws. "dodatku rehabilitacyjnego" |
| Plan dla Chorób Rzadkich, Ośrodki Eksperckie (OECR), leki sieroce/refundacja | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-rzadkie-choroby-genetyczne-plan-leki-sieroce.md` — KANONICZNE, nowy moduł | DR-10 (lokalne), DR-04 (świadczenia dla rodzin/opiekunów — komplementarne) | ✅ nowe 2026-07-20, odpowiedź na pytanie użytkownika |
| Świadczenie pielęgnacyjne (reforma 2024 — praca bez limitu), ustawa "za życiem", opieka wytchnieniowa (z pułapką utraty świadczenia >5 dni/tydzień) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-ustawa-swiadczenia-rodzinne.md` (rozbudowane sekcje) | DR-04 (lokalne, komplementarne do mod-ustawa-swiadczenie-wspierajace-WZON), DR-10, DR-02 (piecza zastępcza) | ✅ rozbudowane 2026-07-20, odpowiedź na pytanie użytkownika |
| Likwidacja Wypożyczalni PFRON (fiasko programu, "reaktywacja likwidacyjna" od 10.06.2026, druk sejmowy 2701) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-ustawa-rehabilitacja-PFRON.md` (ANEKS) | DR-04 (lokalne), potencjalnie DR-15/DR-03 (dwie prokuratury badające sprawę) | ⚡ nowe 2026-07-20, TEMAT BARDZO ŚWIEŻY W TOKU, odpowiedź na pytanie użytkownika |
| Sekcja "DO MONITOROWANIA" — 4 konkurencyjne projekty zmian ustawy o wychowaniu w trzeźwości | `dr-06-podatki-finanse-publiczne-aml/modules/mod-alkohol-tyton-regulacja-sprzedazy.md` (Część A, wstęp) | DR-06 (lokalne) | ⚡ nowe 2026-07-20, WATCH-LIST nie stan prawny, odpowiedź na pytanie użytkownika |
| Test kwalifikacji B2B/zlecenie vs stosunek pracy (art. 22 KP), wskazówki redakcyjne §-po-§, orzecznictwo SN, powiązanie ze świeżą reformą PIP (Dz.U. 2026 poz. 473) | `analizator-umow-v1/references/b2b-podwykonawcze.md` (sekcje G.1, G.1B, G.1C) — KANONICZNE, rozbudowane | analizator-umow-v1 (lokalne), DR-04 (mod-ustawa-PIP-inspekcja-pracy.md — pełny opis reformy proceduralnej, bez duplikacji) | ✅ rozbudowane 2026-07-20, odpowiedź na pytanie użytkownika o analizę umów pod kątem kontroli PIP |
| Bimbrownictwo (art. 12a ustawy o wyrobie alkoholu etylowego 2001, uchwała SN I KZP 23/04) | `dr-06-podatki-finanse-publiczne-aml/modules/mod-alkohol-tyton-regulacja-sprzedazy.md` (Część C) | DR-06 (lokalne, zbieg z mod-ustawa-akcyzowa-i-clo-UCC — KKS) | ✅ nowe 2026-07-20, odpowiedź na pytanie użytkownika |
| Marihuana lecznicza (art. 33a), leczenie substytucyjne metadonem (art. 28-28b), prekursory narkotykowe (rozp. UE 273/2004, 111/2005) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-ustawa-narkomania.md` (rozbudowane sekcje) | DR-03 (lokalne, komplementarne do BLOK D kwalifikatora — aspekt karny), DR-10 (recepty, wyroby medyczne) | ✅ rozbudowane 2026-07-20, odpowiedź na pytanie użytkownika |
| Regulacja sprzedaży alkoholu (zezwolenia 3 kategorie, cofnięcie) i wyrobów tytoniowych/e-papierosów (zakaz nieletnim, nowelizacja 5.07.2025) | `dr-06-podatki-finanse-publiczne-aml/modules/mod-alkohol-tyton-regulacja-sprzedazy.md` — KANONICZNE, nowy moduł | DR-06 (lokalne, komplementarne do mod-ustawa-akcyzowa-i-clo-UCC — przemyt), DR-02 (reklama), DR-03 (leczenie odwykowe), DR-08 (kompetencje gminy) | ✅ nowe 2026-07-19, odpowiedź na pytanie użytkownika |
| Limity przewozu gotówki (10 000 EUR), zwolnienia celne dla podróżnych (300/430 EUR), towary zabronione (CITES) — strona konsumencka cła | `dr-06-podatki-finanse-publiczne-aml/modules/mod-clo-podroznych-limity-towary-zabronione.md` — KANONICZNE, nowy moduł | DR-06 (lokalne, komplementarne do mod-UCC-clo-taryfa-celna), DR-09 (ochrona gatunkowa), DR-03 (broń, narkotyki — sygnalizacja) | ✅ nowe 2026-07-19, odpowiedź na pytanie użytkownika |
| System kaucyjny opakowań po napojach (od 1.10.2025) | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-system-kaucyjny-opakowania.md` — KANONICZNE, nowy moduł | DR-09 (lokalne), DR-06 (aspekt VAT kaucji) | ✅ nowe 2026-07-19, odpowiedź na pytanie o "kaucję" (znaczenie 1/3) |
| Kaucja przy najmie lokalu (limity, waloryzacja, potrącenia) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-kaucja-najem-lokalu.md` — KANONICZNE, nowy moduł | DR-02 (lokalne) | ✅ nowe 2026-07-19, odpowiedź na pytanie o "kaucję" (znaczenie 2/3) |
| Poręczenie majątkowe / "kaucja karna" (art. 266-269 KPK) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-poreczenie-majatkowe-kaucja-karna.md` — KANONICZNE, nowy moduł | DR-03 (lokalne) | ✅ nowe 2026-07-19, odpowiedź na pytanie o "kaucję" (znaczenie 3/3) |
| Procedura VAT marża (art. 120) — w tym "FB VAT marża", eksport/WDT pełne warunki stawki 0% | `dr-06-podatki-finanse-publiczne-aml/modules/mod-VAT-podatek-od-towarow-i-uslug.md` | DR-06 (lokalne) | ✅ rozbudowane 2026-07-19, odpowiedź na pytanie użytkownika |
| Ryczałt "zamiast" podatku — logika decyzyjna, zwolnienia przedmiotowe PIT art. 21 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-ustawa-ryczalt-przychody.md` | DR-06 (lokalne) | ✅ rozbudowane 2026-07-19 |
| Baza produktów o niejednoznacznej klasyfikacji VAT (rękawice nitrylowe medyczne vs robocze jako główny przykład) — korekta PKD vs PKWiU/CN | `dr-06-podatki-finanse-publiczne-aml/modules/mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md` — KANONICZNE, nowy moduł | DR-06 (lokalne), DR-10 (status wyrobu medycznego) | ✅ nowe 2026-07-19, odpowiedź na pytanie użytkownika |
| Podatek u źródła (WHT) — mechanizm pay and refund, opinia o preferencji, WH-OSC/WH-OSP; podatek minimalny CIT (art. 24ca) — SKORYGOWANA stawka 10% | `dr-06-podatki-finanse-publiczne-aml/modules/mod-CIT-podatek-dochodowy-prawne.md` (sekcje 4 i 5a) | DR-06 (lokalne), DR-03 (odpowiedzialność karna skarbowa za WHT) | ✅ korekta błędu + rozbudowa 2026-07-19, odpowiedź na audyt pokrycia prawa podatkowego |
| VAT OSS/IOSS — e-commerce transgraniczny, próg 10 000 EUR, deklaracja VIU-DO | `dr-06-podatki-finanse-publiczne-aml/modules/mod-VAT-podatek-od-towarow-i-uslug.md` (sekcja 4) | DR-06 (lokalne) | ✅ rozbudowane 2026-07-19 |
| Podatki sektorowe: bankowy, od gier, tonażowy, opłata cukrowa, od sprzedaży detalicznej | `dr-06-podatki-finanse-publiczne-aml/modules/mod-podatki-sektorowe-bankowy-gry-tonazowy-cukrowy-detaliczny.md` — KANONICZNE, nowy moduł | DR-06 (lokalne), DR-02 (koncesja hazardowa, mod-KSH sekcja 1b) | ✅ nowe 2026-07-19 (bankowy w pełni, reszta jako punkt startowy) |
| Prawo wekslowe i czekowe (weksel własny/trasowany, in blanco, indos, awal, protest, terminy przedawnienia) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-prawo-wekslowe-czekowe.md` — KANONICZNE, nowy moduł | DR-02 (lokalne), DR-03 (fałszerstwo weksla), DR-16 (postępowanie nakazowe) | ✅ nowe 2026-07-19, odpowiedź na audyt pokrycia prawa gospodarczego |
| Kontrola przedsiębiorcy (Rozdział 5 Prawa przedsiębiorców), reglamentacja działalności — koncesja/zezwolenie/wpis regulowany (Rozdział 4) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KSH-spolki-handlowe.md` (sekcje 1a, 1b) | DR-02 (lokalne), DR-05 (kontrola administracji — pokrewny temat, inny kontekst), DR-08 (inspekcje samorządowe) | ✅ rozbudowane 2026-07-19, odpowiedź na audyt pokrycia prawa gospodarczego |
| KPA/PPSA — postępowanie administracyjne i sądowoadministracyjne, w tym ugoda/milczące załatwienie/zaświadczenia/skargi i wnioski Działu VIII | `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-KPA-postepowanie-administracyjne.md` — KANONICZNE, PRZENIESIONE 2026-07-19 z DR-04 (gdzie było błędnie umiejscowione) | DR-05 (lokalne), + 21 plików w całym systemie zaktualizowanych by wskazywać na nową lokalizację (DR-01/02/03/06/07/08/09/10/13, shared/, prawny-router-v3/) | ✅ przeniesione i rozbudowane 2026-07-19, odpowiedź na audyt pokrycia prawa administracyjnego |
| Eksmisja małżonka (art. 58 §2-4 KRO), obowiązek alimentacyjny szerszego kręgu (dziadkowie/rodzeństwo), surogacja, konkubinat, zmiana imienia i nazwiska | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KRO-rodzinne.md` (rozbudowane sekcje) | DR-02 (lokalne) | ✅ rozbudowane 2026-07-19, dokończenie audytu prawa rodzinnego |
| Ubezwłasnowolnienie (całkowite/częściowe), opieka i kuratela, mechanizm dla osoby BEZ RODZINY (OPS/MOPS jako źródło kandydatów na opiekunów) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ubezwlasnowolnienie-opieka-kuratela.md` — KANONICZNE, nowy moduł | DR-02 (lokalne), DR-08 (OPS/MOPS jako organ samorządowy) | ✅ nowe 2026-07-19, odpowiedź na szczegółowe pytanie użytkownika |
| Separacja, ustrój majątkowy małżeński/intercyza, ustalenie ojcostwa (odrębne od zaprzeczenia) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KRO-rodzinne.md` (rozbudowane sekcje) | DR-02 (lokalne) | ✅ rozbudowane 2026-07-19, odpowiedź na pytanie o pełne pokrycie prawa rodzinnego |
| Piecza zastępcza/rodzina zastępcza — odrębna od przysposobienia | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-piecza-zastepcza-rodzina-zastepcza.md` — KANONICZNE, nowy moduł | DR-02 (lokalne, w tym odesłanie z mod-KRO-przysposobienie), DR-08 (PCPR — organ samorządowy) | ✅ nowe 2026-07-19, odpowiedź na pytanie o opiekę zastępczą |
| Zawarcie małżeństwa (forma cywilna/konkordatowa, przeszkody), bigamia (cywilna+karna), małżeństwo zagraniczne (locus regit actum, transkrypcja), małżeństwo jednopłciowe (TSUE C-713/23, NSA 20.03.2026) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KRO-zawarcie-malzenstwa-bigamia-transgraniczne.md` — KANONICZNE | DR-02 (lokalne, w tym mod-KRO-rodzinne — odesłanie dodane), DR-03 (art. 206 KK — odesłanie dodane w kwalifikatorze), DR-14 (kontekst TSUE/swoboda przemieszczania) | ✅ nowe 2026-07-19, odpowiedź na pytanie użytkownika — TEMAT ŻYWY POLITYCZNIE, re-weryfikuj przed użyciem |
| Prawo spadkowe — zapis windykacyjny, wykonawca testamentu, wydziedziczenie (odróżnione od niegodności), odpowiedzialność za długi spadkowe, zrzeczenie się dziedziczenia, dziedziczenie przez gminę/Skarb Państwa (art. 935 KC — brak spadkobierców) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KC-spadki.md` (v2.0) — KANONICZNE | DR-02 (lokalne), DR-08 (gmina jako spadkobierca), DR-06 (podatek od spadków) | ✅ rozbudowane 2026-07-19, odpowiedź na pytanie użytkownika o pełne pokrycie prawa spadkowego |
| Świadek koronny (duży, ustawa 1997, immunitet) i mały świadek koronny (art. 60 §3-4 KK, złagodzenie kary) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-swiadek-koronny-duzy-maly.md` — KANONICZNE, nowy moduł, zastępuje 2-liniową wzmiankę w BLOK H | DR-03 (lokalne) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Fikcyjne firmy jako technika prania pieniędzy (firmy krzaki, słupy, orzecznictwo SA Katowice o sekwencji przelew→gotówka) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art291-pranie-pieniedzy.md` (nowa sekcja) | DR-03 (lokalne), mod-KK-slupy-fikcyjna-reprezentacja-spolki (zbieg) | ✅ rozbudowane 2026-07-18, odpowiedź na pytanie użytkownika |
| Odtworzenie zaginionych/zniszczonych akt sądowych (KPC Księga IV, art. 716-729) | `dr-16-pisma-strategia-dowody-orzecznictwo/modules/mod-KPC-odtworzenie-akt-zaginionych-zniszczonych.md` — KANONICZNE, nowy moduł | DR-16 (lokalne), pisma-procesowe-v3 (szablon wniosku) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Zmiana sposobu użytkowania obiektu, patodeweloperka (reforma 2024), małe obiekty budowlane, linie wysokiego napięcia, strefa powodziowa | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-PrBud-patodeweloperka-uzytkowanie-male-obiekty-ograniczenia.md` — KANONICZNE, nowy moduł | DR-09 (lokalne) | ✅ nowe 2026-07-18, odpowiedź na klaster pytań użytkownika |
| Wycinka drzew (progi obwodu pnia, wyjątki), odpady niebezpieczne (katalog, zakaz obchodzenia klasyfikacji), tereny skażone/rekultywacja (POŚ art. 101a-101m, 3 scenariusze odpowiedzialności), dopalacze/NPS (środek zastępczy vs NSP — reżim administracyjny vs karny) | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-srodowisko-wycinka-odpady-niebezpieczne-rekultywacja.md` (v1.1) — KANONICZNE, w PEŁNI opracowany | DR-09 (lokalne), DR-03 (art. 181/183 KK — zbieg z zanieczyszczeniem/odpadami; BLOK D kwalifikatora — zbieg z klasycznymi narkotykami) | ✅ nowe 2026-07-18, DOKOŃCZONE 2026-07-18 |
| Art. 204 KK — stręczycielstwo/sutenerstwo/kuplerstwo (rozbudowane z jednej linijki) | `dr-03/.../mod-KK-kwalifikator-karnomaterialny.md` BLOK J | DR-03 (lokalne) | ✅ rozbudowane 2026-07-18 |
| Art. 263 KK — nielegalny wyrób/handel/posiadanie broni palnej i amunicji | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art263-bron-nielegalna.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), DR-09 (kłusownictwo — zbieg) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Kłusownictwo — trzy odrębne reżimy (Prawo łowieckie, rybactwo śródlądowe, gatunki chronione) | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-lowiectwo-klusownictwo.md` — KANONICZNE, nowy moduł | DR-09 (lokalne), DR-03 (art. 181 KK gatunki chronione, art. 263 KK broń — zbiegi) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Działania/firmy pod przykryciem (przykrywką) — narzędzie operacyjne służb (art. 19a-20b ustawy o Policji) | `dr-13-sluzby-bezpieczenstwo-informacje-niejawne/modules/mod-ustawa-sluzby-operacyjne-retencja-danych.md` — KANONICZNE, nowa sekcja | DR-13 (lokalne) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Rzeczy znalezione (ustawa 2015 — obowiązki znalazcy, znaleźne 1/10, nabycie własności), zasiedzenie (art. 172-176 KC — pełne opracowanie zastępujące dotychczasowy szkielet) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-rzeczy-znalezione-zasiedzenie.md` — KANONICZNE, nowy moduł | DR-02 (lokalne, w tym ANEKS D mod-KC-cywilne-zobowiazania — teraz odsyła zamiast duplikować), DR-03 (art. 125 KW, art. 284 KK — przywłaszczenie), DR-09 (mod-UGN — odsyła zamiast duplikować) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Monopole państwowe (art. 216 ust. 3 Konstytucji) — gry hazardowe (Totalizator Sportowy), operator wyznaczony (Poczta Polska), PWPW (dokumenty publiczne, obecnie sporne z TSUE) — odrębne od pozycji dominującej/UOKiK i od wyłączności umownej sprywatyzowanych spółek (np. Mennica Polska — NIE monopol) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ustawa-monopole-panstwowe.md` (v1.1) — KANONICZNE | DR-02 (lokalne), pisma-procesowe-v3 (MOD-OPLATY — spór o art. 165 §2 KPC), DR-06 (akcyza), DR-07 (PZP jeśli PWPW/Mennica objęte zamówieniem) | ✅ nowe 2026-07-18, rozbudowane 2026-07-18 (korekta Mennica Polska + PWPW) |
| Konflikt interesów w PZP — osoby prowadzące postępowanie (art. 56-57), rodzina do 2. stopnia w linii bocznej + stosunek pracy/zlecenia z wykonawcą w ciągu 3 lat | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-dzial-I-podstawy-wylaczenia-szacowanie.md` sekcja 6.1 — KANONICZNE dla kontekstu PZP, ODRĘBNE od konfliktu interesów procesowego (węższy zakres pokrewieństwa) | DR-07 (lokalne), DR-04 (mod-KP-konflikt-interesow-rodzina-nepotyzm — ogólna perspektywa), shared/definicje/DEF-INTERES-WLASNY (procesowy, szerszy zakres) | ✅ nowe 2026-07-18, odpowiedź na pytanie doprecyzowujące użytkownika |
| Monopole, pozycja dominująca, kontrola koncentracji (UOKiK) — rozgraniczone od UZNK (nieuczciwa konkurencja) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ustawa-UOKIK-antymonopolowe.md` — KANONICZNE, nowy moduł | DR-02 (lokalne), DR-03 (zmowa przetargowa — zbieg), DR-07 (zamówienia publiczne) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Wrogie przejęcie spółki, techniki obrony (biały rycerz, zatruta pigułka, złote spadochrony, MBO) — brak definicji ustawowej | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KSH-wrogie-przejecie-obrona-bialy-rycerz.md` — KANONICZNE, nowy moduł | DR-02 (lokalne), DR-14 (jeśli agresor/rycerz zagraniczny) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Konflikt interesów w miejscu pracy — zatrudnianie rodziny, nepotyzm, kumoterstwo (sektor prywatny legalny, publiczny ograniczony) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KP-konflikt-interesow-rodzina-nepotyzm.md` — KANONICZNE, nowy moduł | DR-04 (lokalne), DR-05/DR-15 (sygnaliści zgłaszający nepotyzm), shared/definicje/DEF-INTERES-WLASNY (perspektywa procesowa, nie duplikować) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| PZP Dział I — wyłączenia stosowania ustawy, zasady udzielania, szacowanie wartości, zakaz dzielenia zamówienia | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-dzial-I-podstawy-wylaczenia-szacowanie.md` — KANONICZNE, nowy moduł | DR-07 (lokalne) | ✅ nowe 2026-07-18, priorytet 1. z audytu PZP |
| PZP Dział V/VI — zamówienia sektorowe ("korporacje"/przedsiębiorstwa publiczne), obronność/bezpieczeństwo, infrastruktura krytyczna (art. 131a) | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-dzial-V-VI-sektorowe-obronne-infrastruktura-krytyczna.md` — KANONICZNE, nowy moduł, naprawia martwy odnośnik do DR-13 | DR-07 (lokalne), DR-13 (jeśli rozwinie w przyszłości procedurę RCB) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| PZP Dział XI/XII — kontrola doraźna/uprzednia i kary pieniężne Prezesa UZP (odrębne od NIK/RIO/dyscypliny finansów publicznych) | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-dzial-XI-XII-kontrola-kary-UZP.md` — KANONICZNE, nowy moduł | DR-07 (lokalne), mod-ustawa-NIK, mod-ustawa-RIO, mod-ustawa-dyscyplina-finansow-publicznych (rozgraniczenie zakresów) | ✅ nowe 2026-07-18 |
| Zamówienia dofinansowane z UE — podwójny reżim PZP+Wytyczne, zasada konkurencyjności poniżej progu, taryfikator korekt finansowych | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-fundusze-UE-podwojny-rezim.md` — KANONICZNE, nowy moduł | DR-07 (lokalne), mod-ustawa-fundusze-UE-pomoc-publiczna (ogólny reżim, nie duplikować) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| PZP art. 99 ust. 4-6 — zakaz wskazywania znaków towarowych/producenta, naruszenie pośrednie przez dobór parametrów | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-opis-przedmiotu-zakaz-znakow-towarowych.md` — KANONICZNE, nowy moduł | DR-07 (lokalne), DR-03 (zmowa przetargowa — możliwy zbieg) | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Zakaz konkurencji obejmujący działalność marginalną/faktycznie nieprowadzoną (rozbieżność PKD/KRS vs realna działalność) — odrębne od niejasności definicji (ZK-1) | `analizator-umow-v1/references/zakaz-konkurencji.md`, Pułapka ZK-10 — KANONICZNE, dodane 2026-07-18 | analizator-umow-v1 (lokalne), dr-04, dr-02 | ✅ nowe 2026-07-18, odpowiedź na pytanie użytkownika |
| Zakaz konkurencji bezterminowy/brak wskazanego okresu (nieważność automatyczna, SN I PK 453/02) — odrębny od zwykłego zbyt długiego zakazu | `analizator-umow-v1/references/zakaz-konkurencji.md`, Pułapka ZK-9 — KANONICZNE, dodane 2026-07-17. Pozostałe 3 scenariusze (zakaz ogólnoświatowy, bezpłatny, ukryty pod UZNK) JUŻ pokryte wcześniej (KROK 3, Zasada 1, ZK-8) | analizator-umow-v1 (lokalne), dr-04 (prawo pracy — art. 101² KP), dr-02 (B2B — art. 353¹ KC) | ✅ zaktualizowane 2026-07-17, odpowiedź na pytanie użytkownika |
| Słupy jako prezesi/wspólnicy (odpowiedzialność karna — współsprawstwo/pomocnictwo), fikcyjna reprezentacja spółki (falsus procurator, fałszywy organ) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-slupy-fikcyjna-reprezentacja-spolki.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), DR-02 (skutki cywilnoprawne wadliwej reprezentacji), shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA (warstwa AML/UBO — NIE duplikować) | ✅ nowe 2026-07-17, odpowiedź na pytanie użytkownika |
| KP — obejście limitu 3 umów/33 mies. przez rotację między podmiotami powiązanymi (nadużycie osobowości prawnej, art. 8 KP), elementy konieczne kar porządkowych (art. 108-113), degradacja karna vs w trybie wypowiedzenia zmieniającego (art. 42) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KP-naduzycia-pracodawcy-limity-kary-degradacja.md` — KANONICZNE, nowy moduł | DR-04 (lokalne), DR-15/DR-05 (sygnaliści — odesłanie dwukierunkowe zalecane), mod-ustawa-PIP-inspekcja-pracy (sankcje art. 281 pkt 4) | ✅ nowe 2026-07-17, odpowiedź na pytanie użytkownika |
| KP Dział III — wynagrodzenie chorobowe (art. 92, świadczenie wypłacane przez PRACODAWCĘ, 33/14 dni, 80%/100%) + jawność wynagrodzeń (dyrektywa UE 2023/970, Etap 1 od 24.12.2025) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc.md` — KANONICZNE, nowy moduł | DR-04 (lokalne), mod-SUS-ZUS (zasiłek chorobowy od 34/15 dnia — NIE duplikować), mod-KP-mobbing-dyskryminacja (dyskryminacja płacowa) | ✅ nowe 2026-07-17, odpowiedź na pytanie użytkownika o świadczenia pracodawcy |
| KP Dział VI — czas pracy: normy, nadgodziny (limit 150h/rok, granica 48h/tydzień), dodatki 50%/100% | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KP-dzial-VI-czas-pracy.md` — KANONICZNE, nowy moduł | DR-04 (lokalne), mod-KP-dzial-VII (nowelizacja wspólna 2026) | ✅ nowe 2026-07-17, priorytet 1. z audytu KP |
| KP Dział VII — urlopy pracownicze: wymiar (20/26 dni), ekwiwalent art. 171 | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KP-dzial-VII-urlopy-pracownicze.md` — KANONICZNE, nowy moduł | DR-04 (lokalne), mod-KP-prawo-pracy (reforma stażu pracy) | ✅ nowe 2026-07-17, priorytet 2. z audytu KP |
| KP Dział V — odpowiedzialność materialna (zwykła vs mienie powierzone, odwrócenie ciężaru dowodu) + Dział XIV — przedawnienie roszczeń (3 lata, wyjątek art. 291 §2) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KP-dzial-V-XIV-odpowiedzialnosc-materialna-przedawnienie.md` — KANONICZNE, nowy moduł | DR-04 (lokalne), mod-KP-dzial-VI/VII (przedawnienie roszczeń o nadgodziny/urlop) | ✅ nowe 2026-07-17, domyka priorytety wysokie z audytu KP |
| PIP — uprawnienie do przekwalifikowania umów B2B/zlecenia na umowę o pracę w drodze decyzji administracyjnej (Dz.U. 2026 poz. 473, w życie 08.07.2026) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-ustawa-PIP-inspekcja-pracy.md` sekcja 5-6 — KANONICZNE, zaktualizowane 2026-07-17 (status wejścia w życie potwierdzony, dodano zakaz retorsji i retroaktywność ZUS 5 lat) | DR-04 (lokalne) | ✅ zaktualizowane 2026-07-17 na wniosek użytkownika |
| Deepfake i manipulacja głosem/obrazem — mapa kwalifikacji (art. 286 oszustwo, 190a kradzież tożsamości, 270 fałszerstwo, 212/216 zniesławienie/zniewaga); brak dedykowanego przestępstwa w KK | `dr-03/.../mod-KK-kwalifikator-karnomaterialny.md`, BLOK R | DR-03 (lokalne), analiza-sadowa-v6, pisma-procesowe-v3 | ✅ nowe 2026-07-17, zidentyfikowane przez użytkownika |
| Kary/środki karne/wymiar kary (Rozdz. IV-VI KK), kara mieszana (art. 37a/37b), przestępstwa z nienawiści (art. 119/256/257 KK) | `dr-03/.../mod-KK-kwalifikator-karnomaterialny.md`, BLOK P/Q — kontynuacja wzorca BLOK 0/K/M/N/O | DR-03 (lokalne), analiza-sadowa-v6, pisma-procesowe-v3 | ✅ nowe 2026-07-17, priorytet 2. z audytu KK |
| Kodeks wykroczeń Rozdz. XIV — przeciwko mieniu (kradzież ≤800 zł, paserstwo, zniszczenie mienia, wyłączenia progu kwotowego) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-art119-131-przeciwko-mieniu.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), kwalifikator-karnomaterialny (BLOK A/L — próg graniczny) | ✅ nowe 2026-07-17, priorytet 1. z audytu KW |
| Kodeks wykroczeń Rozdz. VIII — porządek i spokój publiczny (art. 51 — zakłócanie spokoju, charakter chuligański) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-art49-64-porzadek-publiczny.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), mod-KK-kwalifikator BLOK Q (eskalacja do przestępstwa z nienawiści) | ✅ nowe 2026-07-17, priorytet 2. z audytu KW — ZAMYKA listę priorytetów zidentyfikowanych w audycie KK/KW |
| KK Rozdz. XVII — przeciwko RP: szpiegostwo (art. 130, reforma 2023), zdrada, dezinformacja wywiadowcza, zasada wzajemności dla państw sojuszniczych | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art127-139-przeciwko-RP.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), DR-13 (służby/bezpieczeństwo), DR-14 (NATO/międzynarodowe) | ✅ nowe 2026-07-17, priorytet podniesiony przez użytkownika (wojna na Ukrainie, szpiegostwo) |
| KK Rozdz. XX — bezpieczeństwo powszechne, ochrona infrastruktury krytycznej fizycznej (art. 165 §1 pkt 3) i cyfrowej (pkt 4), finansowanie terroryzmu | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art163-172-bezpieczenstwo-powszechne.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), dr-01 (stany kryzysowe), mod-KK-cyberprzestepstwa (zbieg z pkt 4), DR-13 | ✅ nowe 2026-07-17, priorytet podniesiony przez użytkownika (infrastruktura krytyczna) |
| KK Rozdz. XXII — przeciwko środowisku: zanieczyszczenie (182), gospodarka odpadami (183), czynny żal przez naprawienie szkody | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art181-188a-przeciwko-srodowisku.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), DR-09 (prawo administracyjne środowiskowe) | ✅ nowe 2026-07-17, priorytet wskazany przez użytkownika |
| KW Rozdz. X/XII/XIII — bezpieczeństwo osób/mienia, przeciwko osobie (art. 107 złośliwe niepokojenie), przeciwko zdrowiu (szczepienia, choroby zakaźne) | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie.md` — KANONICZNE, nowy moduł | DR-03 (lokalne), mod-KK-art190a-stalking (niższy próg nękania), dr-01 (stany kryzysowe — art. 116) | ✅ nowe 2026-07-17 |
| KW Rozdz. XV-XIX — konsumenci, obyczajność publiczna, urządzenia użytku publicznego, ewidencja, szkodnictwo leśne/polne/ogrodowe | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-art132-166-pozostale-rozdzialy.md` — KANONICZNE, nowy moduł, DOMYKA część szczególną KW (wszystkie 12 rozdziałów pokryte) | DR-03 (lokalne) | ✅ nowe 2026-07-17 |
| Samorządy zawodów zaufania publicznego — rejestr portali/źródeł uchwał, kodeksów etyki, regulaminów (NRA, KRRP, KRN, KRK, PIRP, NIL, NIA, NIPiP, KIDL, KIF, KIDP, PIBR, IARP, PIIB i in.), definicja art. 17 Konstytucji | `shared/SAMORZADY-ZAWODOWE-DOKUMENTY.md` — KANONICZNE. NIE duplikuje treści ustawowej statusu poszczególnych zawodów (ta w modułach DR-12 mod-ustawa-adwokatura/radcowie-prawni/notariat/komornicy-sadowi-zawod/rzecznicy-patentowi-zawod) | DR-12 (lokalne + odesłanie), DR-06 (doradcy podatkowi, biegli rewidenci), DR-09 (architekci, inżynierowie), DR-10 (zawody medyczne), orzeczenia-sadowe-v2 (wzorzec analogiczny do PORTALE-LOKALNE.md) | ✅ nowe 2026-07-17 |
| Stany nadzwyczajne (Rozdz. XI Konstytucji, art. 228-234), reżimy ustawowe poniżej progu konstytucyjnego (zarządzanie kryzysowe, ochrona ludności 2024, stan epidemii), doktrynalna kontrowersja COVID-19, graf zależności reżimów kryzysowych | `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-stany-nadzwyczajne-sytuacje-kryzysowe.md` — komplementarny z `mod-specustawy-lex-specialis-graf-zaleznosci.md` (katalog specustaw doraźnych, np. koronawirusowa, POZOSTAJE tam, nie duplikować) | DR-01 (lokalne), DR-09 (klęski żywiołowe środowiskowe), DR-10 (stan epidemii/zdrowie publ.), DR-13 (stan wojenny/wyjątkowy, obrona cywilna), orzeczenia-sadowe-v2, pisma-procesowe-v3 | ✅ nowe 2026-07-17 |
| Specustawy (doktrynalne), lex specialis derogat legi generali (algorytm), przepisy epizodyczne (ZTP Rozdz. 4a §29a-29c), graf zależności specustawa↔akt ogólny | `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-specustawy-lex-specialis-graf-zaleznosci.md` — komplementarny z `mod-ZTP-przepisy-przejsciowe-doktryna.md` (tamten = przepisy przejściowe/Rozdz. 5 ZTP; ten = lex specialis + epizodyczne/Rozdz. 4a ZTP + graf), NIE scalać | DR-01 (lokalne), DR-09 (specustawa drogowa/mieszkaniowa), DR-05 (kolizje z KPA), DR-14 (specustawa Ukraina), orzeczenia-sadowe-v2, pisma-procesowe-v3 | ✅ nowe 2026-07-17 |
| Przepisy przejściowe — mechanizm/algorytm kwalifikacji techniki (kontynuacja / bezpośrednie działanie / ochrona praw nabytych), podstawa prawna ZTP, literatura ekspercka (Mularski, Wronkowska/Zieliński, Łętowska) | `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-ZTP-przepisy-przejsciowe-doktryna.md` (kanoniczne, warstwa DOKTRYNALNA) — NIE scalać z mechaniką dat, która pozostaje wyłącznie w `analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md` (warstwa PROCEDURALNA); oba pliki mają wzajemne odesłania "Zobacz też" dodane 2026-07-17 | DR-01 (lokalne), analizator-przepisow-v2 Moduł 1H/7C, wszystkie DR-moduły przy pytaniu o wpływ nowelizacji na sprawy w toku, pisma-procesowe-v3 (argumentacja intertemporalna) | ✅ nowe 2026-07-17 |
| Mobbing — definicja + linia SN + projekt UD183 | `shared/definicje/DEF-PRACA.md` | DR-04 (rdzeń), DR-16 | ✅ scalone 06-12 |
| Mobbing — kwalifikacja różnicująca + strategia | `dr-04/.../mod-KP-mobbing-dyskryminacja.md` | DR-04 | ✅ wydzielone 06-12 |
| Szkoda/damnum emergens/lucrum cessans | `shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | DR-02, DR-16 | ✅ scalone 06-12 |
| Mienie znacznej/wielkiej wartości (art.115§5-8 KK) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W23 + crossref w DEF-ODPOWIEDZIALNOSC-SZKODA | DR-02, DR-03, DR-16 | ✅ |
| Siła wyższa / rebus sic stantibus (art.357¹ KC) | `shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` | DR-02, DR-16 | ✅ 06-12 |
| Termin zawity/przedawnienie/instrukcyjny | `shared/definicje/DEF-PROCEDURA.md` | DR-02/03/05/16 | ✅ scalone 06-12 |
| Przedawnienie cywilne (reforma 2018) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W32 | DR-02 | ⚠️ częściowy overlap z DEF-PROCEDURA — patrz NOTA-1 |
| Przedawnienie podatkowe (OP, reżim odrębny od KC) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W32 (alert) | DR-06 | ✅ |
| Wyłączenie sędziego/biegłego (art.48-49/281 KPC + TK P10/19) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-01, DR-02, DR-16 | ✅ scalone 06-12 |
| Interes prawny vs faktyczny (art.28 KPA) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-05 (główny), DR-02 | ✅ 06-12 |
| Świadek i interes własny (art.233/261 KPC) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-02, DR-03, DR-16 | ✅ 06-12 |
| Pełnomocnik — konflikt interesów | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-12, DR-16 | ✅ 06-12 |
| Czynność prawna ukryta/pozorna (art.83 KC) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-02, DR-16 | ✅ 06-12 |
| Rzeczywisty beneficjent/UBO (AML/CIT/KSH — 3 definicje) | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` | DR-06, DR-15 | ✅ 06-12 |
| Wypadek przy pracy — definicja 4-elementowa | `shared/definicje/DEF-PRACA.md` (H.1.4) | DR-04 | ✅ scalone 06-12 |
| Wypadek przy pracy — procedura/świadczenia/terminy | `dr-04/.../mod-wypadek-przy-pracy-choroba-zawodowa.md` | DR-04 | ✅ wydzielone 06-12 |
| Praca zdalna — definicja (art.67⁵ KP) + wykładnia MRiPS | `shared/ORKA-BAS-VIII-X-KADENCJA.md` BAS-W03 | DR-04 | ✅ |
| Praca zdalna — obowiązki/BHP/procedura | `dr-04/.../mod-KP-praca-zdalna.md` | DR-04 | ✅ wydzielone 06-12 |
| Weryfikacja deterministyczna aktu prawnego/orzeczenia (MCP jako uzupełnienie HARD GATE) | `shared/MCP-INTEGRACJA.md` (protokół) + `shared/KONEKTORY-REKOMENDOWANE.md` (rekomendacje connectorów) + `shared/tools/test_mcp_protocol.py`, `shared/tools/connector_health_check.py` | prawny-router-v3 (required_modules), potencjalnie każdy DR-skill via router | ✅ skonsolidowane 2026-07-13f (wcześniej osobny skill mcp-zrodla-prawa-v1, usunięty — duplikował wzorzec shared/). Kandydat: jeśli w przyszłości jakikolwiek DR-skill zechce odwołać się bezpośrednio do protokołu MCP, ZAWSZE via `view shared/MCP-INTEGRACJA.md`, nie kopiować logiki KROK 1-4 lokalnie |
| Audit-trail / hash-chain zdarzeń zgodny z art. 12 AI Act | `shared/AUDIT-TRAIL-SPEC.md` (specyfikacja) + `shared/tools/hash_chain_verify.py`, `append_event.py`, `router_event_parser.py` (implementacja referencyjna) | poza silnikiem (portal), punkt odniesienia dla prawny-router-v3 (mapowanie zdarzeń) | ✅ skonsolidowane 2026-07-13f (wcześniej osobny skill audit-trail-portal-v1, usunięty — duplikował wzorzec shared/). Jeśli w przyszłości inny skill potrzebuje logowania zdarzeń/integralności, ZAWSZE odwołanie tutaj, nie nowa implementacja hash-chain gdzie indziej |
| Weryfikacja/walidacja cytowań w gotowym piśmie wobec logu API | `shared/tools/walidator_cytowan.py` + `extract_api_verification_log.py` + `export_gate.py` (bramka łącząca oba) | portal, wywoływane przed present_files/eksportem | ✅ istniało od 2026-07-12, rozszerzone 2026-07-13d o ekstrakcję logu z surowej odpowiedzi API — jedyna kanoniczna lokalizacja tej funkcji |
| Automatyczne wykrywanie nowych pozycji Dz.U./M.P. (wejście do FAZY 3) | `audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md` + `audyt-systemu-v4/scripts/sync_dzu_eli.py`, `mock_eli_server_test.py`, `bootstrap_last_sync_date.py` | audyt-systemu-v4 FAZA 3 (wejście, nie zamiennik ręcznej weryfikacji) | ✅ skonsolidowane 2026-07-13f (wcześniej osobny skill sync-dzu-automatyczny-v1, usunięty — duplikował wzorzec references/+scripts/ już obecny w audyt-systemu-v4) |
| Przeszukiwanie archiwalnego rejestru klauzul niedozwolonych UOKiK (lokalnie, po pobraniu CSV) | `analizator-umow-v1/references/szukaj_klauzul_uokik.py` | analizator-umow-v1 (mod-shared-abusive-clauses.md, AB.2) | ✅ nowe 2026-07-13l — kanoniczna lokalizacja, bo narzędzie jest specyficzne dla domeny tego skilla (analiza umów), nie cross-cutting infrastruktura jak shared/tools/. Jeśli inny skill (np. przewodnik-prawny-v2) potrzebowałby tej samej funkcji, ZAWSZE odwołanie tutaj, nie duplikat |
| Nadużycie prawa (art.5 KC / art.8 KP) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W28 | DR-02, DR-04, DR-16 | ✅ |
| Kara umowna — miarkowanie (art.484§2 KC) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W33 | DR-02, DR-16 | ✅ |
| Hierarchia/kategoryzacja źródeł internetowych (RZĄD 1/2A/2B/3) | `shared/HIERARCHIA-ZRODEL.md` | `analizator-przepisow-v2` (odsyła, nie duplikuje), `shared/PRAWO-HARDGATE.md` (KROK 5-RZĄD), `shared/WERYFIKACJA-SLAD.md` (KOTWICA-TEKSTOWA + tabela śladu) — oraz KAŻDY skill podający linki źródłowe użytkownikowi | ✅ wydzielone 2026-07-15b — wcześniej istniało wyłącznie lokalnie w `analizator-przepisow-v2`, co powodowało pomijanie kategoryzacji przy linkach generowanych poza tym skillem (zgłoszone przez użytkownika) |
| Odsetki: kapitałowe/za opóźnienie/handlowe | `shared/ORKA-BAS-LEKSYKON.md` BAS-W34 | DR-02, DR-16 | ✅ |
| Nakaz zapłaty: sprzeciw vs zarzuty vs EPU | `shared/ORKA-BAS-LEKSYKON.md` BAS-W35 | DR-02, DR-16 | ✅ |
| Moc dowodowa dok. urzędowy vs prywatny (art.243-245 KPC) | `shared/ORKA-BAS-LEKSYKON.md` BAS-W30 | DR-02, DR-16 | ✅ |
| AI Act — system wysokiego ryzyka (termin 02.08.2026) | `shared/ORKA-BAS-VIII-X-KADENCJA.md` BAS-W36 | DR-04, DR-11 | ✅ |
| Pracownik/pracodawca (definicje podmiotowe, A.4) | `shared/definicje/DEF-PRACA.md` | DR-04 | ✅ |
| Przedsiębiorca/konsument (A.2-A.3) | `shared/definicje/DEF-PODMIOTY-WLASNOSC.md` | DR-02 | ✅ |
| Nieruchomość/posiadanie/własność (B.1-B.3) | `shared/definicje/DEF-PODMIOTY-WLASNOSC.md` | DR-02 | ✅ |
| Decyzja administracyjna — definicja + wykonalność | `shared/definicje/DEF-ADMINISTRACYJNE.md` | DR-05 | ✅ scalone (E.3+H.5.1) |
| Obiekt liniowy / samowola budowlana / SPP | `shared/definicje/DEF-BUDOWLANE-DROGOWE.md` | DR-08, DR-09 | ✅ |
| Rękojmia vs gwarancja (reforma 2023) | `shared/definicje/DEF-CYWILNE-WYKLADNIA.md` | DR-02 | ✅ |
| Dochód/przychód/koszty — wykładnia MF | `shared/definicje/DEF-PODATKOWE.md` | DR-06 | ✅ |
| Niealimentacja (art.209 KK) | `shared/definicje/DEF-PRACA.md` (sekcja dolna) | DR-04, DR-03 | ⚠️ patrz NOTA-2 |
| Opłata parkingowa SPP — charakter prawny, zarzuty UPEA art.33 | `dr-08/.../mod-UDP-strefy-platnego-parkowania.md` (293 linii, kanon) | DR-08, DR-03 (przedawnienie), DR-16 | ✅ scalone 06-13 (usunięto duplikat z DEF-BUDOWLANE-DROGOWE) |
| Taryfikator mandatów drogowych — kwoty | `dr-03/.../mod-grzywny-mandaty-szczegolowe.md` (PRM 30.12.2021, NIE Dz.U.2026/724!) | DR-03 | ✅ naprawione 06-13 — patrz NOTA-5 |
| Poszlaki / łańcuch poszlak / Warstwa 2/3 / tabela graniczna | `shared/MOD-POSZLAKI-KONTEKST.md` | pisma-procesowe-v3 (W1.2d), analizator-dowodow-v3 (integracja przyszła) | ✅ 2026-06-23 |
| Roszczenie alternatywne S2 / CV-ALT | `shared/CLAIM-VALIDATION.md` → sekcja KROK CV-ALT | pisma-procesowe-v3 (PK6) | ✅ 2026-06-23 |
| Walor PRZYZNANIA / walor ORGANU | `shared/MOD-POSZLAKI-KONTEKST.md` PK4 (kanoniczne); MOD-DOWODY D6 tylko pointer | pisma-procesowe-v3 | ✅ 2026-06-23 |
| Antycypacja zarzutów universalna U1–U9 | `shared/MOD-POSZLAKI-KONTEKST.md` PK5 + `pisma-procesowe-v3/modules/MOD-DOWODY.md` D7 (triggery) — NIE scalać (różne poziomy szczegółowości) | pisma-procesowe-v3 | ✅ 2026-06-23 |
| Sądy wojskowe — status weryfikowalności orzeczeń (brak portalu, wyjątek SN Izba Karna) | `shared/ORZECZENIA-HIERARCHIA.md` §4.1 | orzeczenia-sadowe-v2, dr-13, dr-12 (dyscyplinarka sędziów wojsk. — nie mylić) | ✅ 2026-07-06 |
| Dyscyplinarka Policja/PSP — status weryfikowalności (baza niepubliczna, skarga do WSA/NSA weryfikowalna normalnie) | `shared/ORZECZENIA-HIERARCHIA.md` §4.2 | orzeczenia-sadowe-v2, dr-13 | ✅ 2026-07-06 |
| OSP — status prawny (stowarzyszenie, nie sąd/służba szczególna) + PSP/ochrona przeciwpożarowa/OSP jako akty | `shared/ORZECZENIA-HIERARCHIA.md` §4.3 (status prawny) + `dr-13/modules/mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa.md` | dr-13 | ✅ 2026-07-07 — WARN-29 zamknięty, moduł poziom A napisany i wdrożony |
| ISU-PESEL: algorytm weryfikacji PESEL — format P1, dekodowanie daty P2 (5 stuleci), niezgodność daty P3, płeć z P10 P4, suma kontrolna wagowa P5 [1,3,7,9,1,3,7,9,1,3], raport ERR-F/D/PL/CK P6; Klasa I (ERR-D/PL/F) / Klasa III (ERR-CK) | `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` §ISU-PESEL (v1.1.0) — WYŁĄCZNA lokalizacja; NIE duplikować w MOD-DOKUMENT-ANOMALIE ani REGUŁA-PESEL-ROZBIEZ | wszystkie skille z EL-OSOBA: pisma-procesowe-v3, analizator-umow-v1, analizator-dowodow-v3, pisma-proste-v2 | ✅ 2026-06-27e |
| MOD-IDENTYFIKACJA-STRONY-UMOWY v1.0.0: identyfikacja strony czynności prawnej metodą danych większościowych; katalog EL-PODMIOT/EL-OSOBA/EL-FAKTURA (25 elementów z wagami); procedura ISU-1-5; próg 60% sumy ważonej; ISU-4 rozstrzyganie uzupełniające (ZUS/JPK/korespondencja); ISU-5 formuła do pisma; 6 typów sporu; art. 65§1 KC jako podstawa | `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` v1.0.0 — WYŁĄCZNA lokalizacja; NIE duplikować mechaniki w MOD-DOKUMENT-ANOMALIE ani W0 MOD-PRACODAWCA-RZECZYWISTY | pisma-procesowe-v3 (W1.2d), analizator-umow-v1, analizator-dowodow-v3, PRE-W2-VERIFICATION-GATE (v1.4.0) | ✅ 2026-06-27d |
| MOD-PRACODAWCA-RZECZYWISTY v2.1.0: WARSTWA 0 (dane większościowe — identyfikacja strony umowy przez ≥4/7 elementów identyfikacyjnych, art.65§1KC); 4-warstwowy argument (W1 pracodawca rzeczywisty art.3KP + W2 obejście prawa art.58§1KC + W3 venire art.8KP + W4 dowody operacyjne); trigger PRE-W2 T1-T4; ZAKAZ-R1; protokół R1-R5; KAT-I/II/III 4-warstwowy argument (pracodawca rzeczywisty art.3KP + obejście prawa art.58§1KC + venire art.8KP + dowody operacyjne); trigger PRE-W2 T1-T4; ZAKAZ-R1 (zakaz "ten sam KRS" gdy KRS błędny); protokół R1-R5; KAT-I/II/III | `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` v2.0.0 — WYŁĄCZNA lokalizacja; NIE duplikować w shared/; plik /home/claude/MOD-PRACODAWCA-RZECZYWISTY.md scalony i usunięty | pisma-procesowe-v3 (W1.2 linia 669, wywołanie z PRE-W2.C/D po wykryciu T1-T4), PRE-W2-VERIFICATION-GATE (v1.3.0) | ✅ 2026-06-27b |
| FSL-D: per-teza weryfikacja dowodów z zakazem cytowania z pamięci | `shared/MOD-FSL-DOKUMENTY.md` v1.0.0 — WYŁĄCZNA lokalizacja; NIE duplikować w CLAIM-VALIDATION ani MACIERZ | pisma-procesowe-v3 (W1.2c-FSL-D), analizator-dowodow-v3 (BLOK-C-FSL) | ✅ 2026-06-27 |
| REGUŁA-NAZWA-PLIKU-MYLĄCA | `shared/MOD-FSL-DOKUMENTY.md` § REGUŁY SZCZEGÓLNE — NIE duplikować w MOD-SKAN-DOWODOW-KOMPLETNY | pisma-procesowe-v3, analizator-dowodow-v3 | ✅ 2026-06-27 |
| Klasy źródeł dowodowych A–G | `shared/DOWODY-METODOLOGIA.md §5` (kanoniczne) | analizator-dowodow-v3, pisma-procesowe-v3, MOD-MACIERZ-DOWOD-TEZA (mapowanie ★) | ✅ 2026-06-24 |
| Klasy pewności faktu (BEZSPORNE/PEWNE/WYDEDUKOWANE/SPORNE) | `shared/DOWODY-METODOLOGIA.md §6` (standard systemowy) | analizator-dowodow-v3 (BLOK-KONSEKWENCJE), chronologia-sprawy-v1 (source), pisma-procesowe-v3 W1.3 | ✅ 2026-06-24 — przeniesione z chronologia-sprawy-v1 |
| Filtr przydatności procesowej tez (USE/SKIP/UWAGA) | `shared/MOD-MACIERZ-DOWOD-TEZA.md §MT4a` | pisma-procesowe-v3 (W1.3), analizator-dowodow-v3 | ✅ 2026-06-24 |
| Warstwa konsekwencji tezy C-X.1/C-X.2/C-X.3 (DTA W6) | `analizator-dowodow-v3/SKILL.md §BLOK-KONSEKWENCJE` | pisma-procesowe-v3 (petitum, uzasadnienie, W2.1) | ✅ 2026-06-24 |
| Numeracja krzyżowa D-NNN/F-NNN/T-NN (DTA-ID-MODE) | `analizator-dowodow-v3/SKILL.md §DTA-ID-MODE` | Trigger ≥5 plików lub ≥5 tez; optional dla małych spraw | ✅ 2026-06-24 |
| Metryka siły ataku per teza (N/10 + po kontrze) | `shared/MOD-ATAK-NA-DRAFT.md §5 D2` | pisma-procesowe-v3 (W2.4 RAPORT D) | ✅ 2026-06-24 |
| LA-WNIOSEK-W-FAKCIE (fakt = wniosek prawny) | `analizator-dowodow-v3/modules/MOD-LAPSUS-AUDYT.md §KAT-II` typ #23 | analizator-dowodow-v3 (BLOK-LAPSUS), pisma-procesowe-v3 (W2.4) | ✅ 2026-06-24 |
| Proweniencja dowodów — taksonomia typów SYS/KOM/ZAW/AUT/URZ/LIN/CHAIN | `shared/MOD-PROWENIENCJA-DOWODOW.md` (plik kanoniczny) | analizator-dowodow-v3 (BLOK-PROWENIENCJA), MP6-sledczy §6.12, pisma-procesowe-v3 W1.2c | ✅ 2026-06-24 |
| Klasy konsekwencji proweniencji P+/P-/P0/P! | `shared/MOD-PROWENIENCJA-DOWODOW.md §PR3` | analizator-dowodow-v3 (integracja z macierzą D×T i BLOK-KONSEKWENCJE) | ✅ 2026-06-24 |
| Podobieństwo tekstu / fingerprint lingwistyczny (LIN) | `shared/MOD-PROWENIENCJA-DOWODOW.md §TYP 6` (kanoniczne) — NIE scalać z MET-CA (MET-CA = narracja, LIN = proweniencja) | analizator-dowodow-v3 MP6 §6.12, MP6-sledczy §6.2 VSA (komplementarne) | ✅ 2026-06-24 |
| 12 technik negacji N1-N12 (gołosłowne zaprzeczenie..spoliation) | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N3` (kanoniczne) | analizator-dowodow-v3 (BLOK-NEGACJA NG3), MP4 §4.3/4.6, RAPORT D §D2, pisma-procesowe-v3 W2.4 | ✅ 2026-06-24 |
| Ciężar dowodu per teza (KR1-KR5) + 6 dziedzin OD-1..OD-6 | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N1` (kanoniczne) | analizator-dowodow-v3 (BLOK-NEGACJA NG1), pisma-procesowe-v3 W1.3 | ✅ 2026-06-24 |
| Odporność dowodów per klasa A-G na negację | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N2` (kanoniczne) — NIE scalać z §5 DOWODY-METODOLOGIA (N2 = dynamika obalania, §5 = bazowe wagi statyczne) | analizator-dowodow-v3 (NG2), MP4 §4.6 | ✅ 2026-06-24 |
| Milczenie jako przyznanie [PRZYZ-MIL-H/M/L] (art. 229-230 KPC) | `shared/MOD-NEGACJA-DOWODOW.md §BLOK N4` (kanoniczne) | analizator-dowodow-v3 (BLOK-NEGACJA NG4), pisma-procesowe-v3 (sekcja "Fakty bezsporne") | ✅ 2026-06-24 |
| Spoliation / odmowa przedłożenia dowodu (art. 233 §2 KPC) | `shared/MOD-NEGACJA-DOWODOW.md §N12 + §N6` (kanoniczne) — NIE scalać z MP6-sledczy §6.4 BEH (N12 = technika negacji, BEH-C = wzorzec behawioralny) | analizator-dowodow-v3 (BLOK-NEGACJA NG3), pisma-procesowe-v3 W1.2d | ✅ 2026-06-24 |
| REJESTR KROKÓW pipeline / śledzenie pominięć / ZAKAZ CICHEGO POMIJANIA | `shared/MOD-STEP-TRACKER.md` (kanoniczne, v1.0.0) — inicjowany w pisma-procesowe-v3 KROK 0-TRACKER; ST-INIT/ST-TRACK/ST-REPORT/ST-FINAL | pisma-procesowe-v3 (KROK 0-TRACKER, REGUŁA NAPRAWY, ZAKAZ-12), shared/MOD-SKAN-DOWODOW-KOMPLETNY (SD-VER) | ✅ 2026-06-24d |
| Tabele nazewnictwa stron T1-T10, wzory nagłówków N1-N7 | `shared/NAZEWNICTWO-STRON.md` (kanoniczne, istniało już) — NIE duplikować lokalnie w skillach | shared/FORMAL-CHECK.md, analizator-dowodow-v3, pisma-proste-v2 | ✅ 2026-07-12 (NOTA-14) |
| Stalking i nękanie (art. 190a KK) — szczegółowy framework, 3 znamiona §1 | `shared/STALKING-NEKANIE.md` (kanoniczne, nowe 2026-07-12) — NIE duplikować w dr-03 ani w routerze | dr-03 (mod-KK-art190a-stalking.md, mod-KK-kwalifikator-karnomaterialny.md) | ✅ 2026-07-12 (NOTA-12) |
| Przesłuchanie świadków — ramowy framework KPC art. 258-305 | `shared/PRZESLUCHANIE-SWIADKOW-KPC.md` (kanoniczne, nowe 2026-07-12) — NIE mylić z pełnym skillem przesluchanie-swiadkow-v2-min90 (inny zakres) | dr-16 | ✅ 2026-07-12 (NOTA-13) |
| Wektory ataku na świadka SW-A1..SW-A8 (konflikt interesu, zaprzeczenie, relacja wtórna...) | `shared/MOD-ATAK-NA-SWIADKA.md §FAZA 2` (kanoniczne, v1.0.0) — NIE scalać z MOD-NEGACJA-DOWODOW §N8 (N8 = ogólny "atak na świadka" bez procedury; ten moduł = pełna procedura SW-P1..SW-P5 + priorytetyzacja + integracja W2.4c) | pisma-procesowe-v3 (W1.2c ŁD-3b, W2.4c, ZAKAZ-13) | ✅ 2026-06-24d |
| SW-TARCZKA — antycypacja ataku na NASZEGO świadka | `shared/MOD-ATAK-NA-SWIADKA.md §FAZA 4 SW-TARCZKA` (kanoniczne) — NIE scalać z ŁD-6 antycypacja (ŁD-6 = ogólna antycypacja na łańcuch; SW-TARCZKA = specyficznie dla ogniwa zeznaniowego) | pisma-procesowe-v3 (W2.4c, ZAKAZ-13) | ✅ 2026-06-24d |
| SW-DETECT — detekcja ogniw zeznaniowych w łańcuchu dowodowym | `shared/MOD-ATAK-NA-SWIADKA.md §FAZA 0` (kanoniczne) — wbudowany w pisma-procesowe-v3 W1.2c ŁD-3b jako automatyczny krok per ogniwo | pisma-procesowe-v3 (ŁD-3b, W2.4c) | ✅ 2026-06-24d |

---

## NOTY OTWARTE — DO ROZSTRZYGNIĘCIA W KOLEJNYCH AUDYTACH

### NOTA-1: BAS-W32 (przedawnienie cywilne) vs DEF-PROCEDURA.md (terminy) — ✅ ROZWIĄZANE 2026-06-12
Dodano wzajemne odesłania "PATRZ TEŻ" w obu plikach (BAS-W32 → DEF-PROCEDURA,
DEF-PROCEDURA → BAS-W32), wyjaśniające podział: DEF-PROCEDURA = KATEGORIE
terminów, BAS-W32 = KONKRETNE WARTOŚCI terminów przedawnienia. Nie wymagało
re-scalania treści — to NIE był duplikat, tylko nieoznaczona komplementarność.

### NOTA-2: Niealimentacja (art.209 KK) — umiejscowienie
Umieszczona w DEF-PRACA.md (kontekst: alimenty/rodzina), ale art.209 KK
to PRZESTĘPSTWO — materialnie należy do DR-03. Zostawione w DEF-PRACA
z adnotacją "relewantne także dla DR-03", bo:
  (a) to tylko 5 linii — nie uzasadnia osobnego pliku,
  (b) sprawy alimentacyjne najczęściej zaczynają się w DR-04 (rodzina/
      świadczenia) i PRZECHODZĄ do DR-03 dopiero przy niealimentacji.
→ AKCJA: jeśli DR-03 w przyszłości otrzyma własny plik definicje/
  DEF-KARNE-WYBRANE.md (obecnie nie istnieje), PRZENIEŚĆ tam i dodać
  stub w DEF-PRACA.

### NOTA-5: TYP BŁĘDU "PRAWDZIWY CYTAT W ZŁYM KONTEKŚCIE" — ✅ NAPRAWIONE 06-13
mod-grzywny-mandaty-szczegolowe.md cytował "Dz.U. 2026 poz. 724 (MSWiA
29.05.2026)" jako podstawę TARYFIKATORA KWOT mandatów. Ten Dz.U. ISTNIEJE
i data/minister są PRAWDZIWE — ALE dotyczy ewidencji punktów karnych
(weszło w życie 03.06.2026), NIE kwot mandatów. Kwoty wciąż oparte na
PRM 30.12.2021 (Dz.U. 2021 poz. 2484) — "te same kwoty co 2022" (potw.
marzec 2026). To NAJGORSZY typ błędu HARDGATE: cytat "wygląda zweryfikowany"
(realny Dz.U.) ale jest UŻYTY W ZŁYM KONTEKŚCIE.
→ AKCJA NA PRZYSZŁOŚĆ: przy weryfikacji online NIE WYSTARCZY potwierdzić,
  że dany Dz.U./data/numer ISTNIEJE — trzeba potwierdzić, że PRZEDMIOT
  tego aktu odpowiada TEMU, do czego jest przywoływany. ✅ ZROBIONE 06-14:
  dodano KROK 2B do PRAWO-HARDGATE.md (weryfikacja przedmiotu/tytułu aktu,
  nie tylko numeru Dz.U.).

Dodatkowo: "art. 86c KW — drift/celowy poślizg" w tym samym module —
BRAK potwierdzenia online (2026-06-13, wyszukiwanie zwróciło wyłącznie
wyniki o zawodach Drift Masters). Oznaczono w tabeli jako ⚠️ NIEZWERYFIKOWANE
z instrukcją web_search przed użyciem — możliwe że to błędny numer art.
lub konfuzja z nowymi ustawami BRD I/BRD II (06.2026, patrz mod-PRD).

### NOTA-3: mod-KK-kwalifikator-karnomaterialny.md (589→1794 linii, DR-03) —
ŚWIADOMIE NIE dzielony (pierwotnie).
To przekrojowe drzewo decyzyjne (BLOK A-G = różne kategorie przestępstw
KK, porównywane wzajemnie w sekcji "BŁĘDY KWALIFIKACYJNE"). Podział
zniszczyłby logikę porównawczą (np. BŁĄD 1 wymaga widzenia jednocześnie
BLOK A.1 rozbój i kradzież rozbójniczą). WYJĄTEK od "jeden moduł = jeden
akt" — udokumentowany, nie traktować jako zaniedbanie w przyszłych audytach.

**Aktualizacja 2026-07-17:** plik urósł do 1794 linii po dodaniu BLOK 0,
K (2026-07-15) oraz M, N, O, P, Q (2026-07-17) — wszystkie dot. CZĘŚCI
OGÓLNEJ KK (kontratypy, zbieg przestępstw, środki zabezpieczające,
zatarcie skazania, kary, przestępstwa z nienawiści). W przeciwieństwie do
BLOK A-G (przestępstwa szczegółowe, wzajemnie porównywane), bloki części
ogólnej NIE mają tej samej zależności krzyżowej — **rekomendacja dla
przyszłego audytu: rozważyć wydzielenie BLOK 0/K/M/N/O/P/Q do osobnego
pliku (np. `mod-KK-czesc-ogolna-kompendium.md`)**, zachowując BLOK A-L
(przestępstwa szczegółowe) w oryginalnym pliku zgodnie z uzasadnieniem
NOTA-3 pierwotnym. Nie wykonano tego podziału w tej sesji ze względu na
priorytet uzupełniania TREŚCI nad refaktoryzacją STRUKTURY.

### NOTA-4: Moduły >400 linii — STATUS PO SESJI 2026-06-12
| Moduł | Linie PRZED | Status |
|---|---|---|
| mod-PrFarm-prawo-farmaceutyczne (DR-10) | 915 | → 901 (wydzielono mod-wyroby-medyczne, 73 linii) |
| mod-KK-kwalifikator-karnomaterialny (DR-03) | 589 | NIE DZIELIĆ — patrz NOTA-3 |
| mod-KP-prawo-pracy (DR-04) | 524 | → 337 (wydzielono 3 moduły: mobbing 109, wypadek 112, praca zdalna 75) |
| mod-PZP-zamowienia-publiczne-KIO (DR-07) | 493 | ✅ ZROBIONE 06-14: 394 linii. Wydzielono sekcje 10 (compliance SWZ/OPZ art. 99), 11 (certyfikacja wykonawców), ANEKS A-B (podwykonawstwo, zabezpieczenie) → mod-PZP-wykonanie-umowy-compliance.md (NOWY, 180 l.) |
| mod-PRD-prawo-jazdy-punkty-karne (DR-03) | 492 | ✅ ZROBIONE 06-14: 367 linii. Wydzielono sekcje 5-7 (sądowy zakaz, nowe przestępstwa drogowe BRD II, prawo jazdy od 17 lat BRD I) + alert B → mod-PRD-nowe-przestepstwa-drogowe-BRD.md (NOWY, 222 l.) |
| mod-PrFarm-szczegolowy (DR-10) | 468 | ✅ ZROBIONE 06-14: 330 linii. Usunięto zduplikowaną CZĘŚĆ IX (już w mod-wyroby-medyczne z 06-12). Wydzielono CZĘŚĆ VI-VIII (refundacja, nadzór GIF/WIF, sankcje) → mod-PrFarm-refundacja-nadzor-sankcje.md (NOWY, 196 l.) |
| mod-ustawa-cudzoziemcy (DR-05) | 455 | ✅ ZROBIONE 06-14: 350 linii. Wydzielono sekcję 4 (zezwolenia na pracę A/B/C/D/S + matryca dokument→praca, ustawa Dz.U. 2025 poz. 621) → mod-ustawa-cudzoziemcy-zatrudnianie.md (NOWY, 177 l.) |
| mod-KC-cywilne-zobowiazania-odpowiedzialnosc (DR-02) | 436 | ✅ ZROBIONE 06-14: 370 linii. Usunięto ANEKS E (37 l., duplikat mod-KC-spadki — pointer dodany). Wydzielono ANEKS F (50 l.) → mod-KC-kredyty-frankowe.md (NOWY). Dodano pointer do DEF-ODPOWIEDZIALNOSC-SZKODA C.2-C.3 przy tabeli "Dwa reżimy" (overlap zachowany świadomie — różne poziomy: definicyjny vs porównawczy) |
| mod-interpretacje-definicje-podatkowe (DR-06) | 432 | ✅ ZROBIONE 06-14: 403 linii. Wydzielono sekcję 4 (PKWiU/CN/PKOB/KŚT, 39 l.) → mod-PKWiU-klasyfikacje-statystyczne.md (NOWY, referencjonowany przez mod-VAT/PIT/CIT). Sekcja 5: usunięto duplikat "DZIAŁALNOŚĆ GOSPODARCZA" (już w DEF-PODATKOWE BLOK G), dodano pointer. Pozostałe 4 definicje sekcji 5 (mały podatnik, podmiot powiązany, stały zakład, B2B vs umowa o pracę) — unikalne, zachowane |
| mod-ustawa-akcyzowa-i-clo-UCC (DR-06) | 372 | ✅ ZROBIONE 06-14: 281 linii. Wydzielono cło/UCC (Nomenklatura Scalona CN/TARIC, WIT, procedury celne, wartość celna, FTA/GSP) → mod-UCC-clo-taryfa-celna.md (NOWY, 180 l.). Podział wg dwóch reżimów prawnych: akcyza (krajowa) vs. UCC (UE) |

**Reguła progowa:** moduł >400 linii = kandydat do audytu PRZY NAJBLIŻSZEJ
zmianie tego modułu (nie wymaga dedykowanej sesji — "przy okazji").
Moduł >600 linii = PRIORYTET nawet bez innej zmiany w toku.

### NOTA-6: ORPHAN shared/ — ✅ ZAMKNIĘTE 2026-06-14 (sesja 3)
`LOCAL-PUBLICATION-VALIDITY-CHECK.md`, `LOCAL-SOURCE-EQUIVALENCE-PROTOCOL.md`,
`OFFICIAL-SOURCE-TIERING-PROTOCOL.md`, `PROFESSIONAL-SELF-GOVERNMENT-DEEP-STANDARD.md`,
`SOURCE-HIERARCHY-EQUIVALENCE-PROTOCOL.md` — USUNIĘTE (decyzja dewelopera: usunąć).
Zero konsumentów potwierdzone (`grep -rl` przed usunięciem). Jedyny dangling
pointer (`shared/INTERPRETACJE-URZEDOWE.md` → `OFFICIAL-SOURCE-TIERING-PROTOCOL.md`)
naprawiony — treść warstwy lokalnej (DUW/BIP/rejestry) wciągnięta inline jako
2-zdaniowe streszczenie, bez utraty informacji istotnej dla DR-08/DR-12.
`DEPENDENCY-GRAPH.md` zaktualizowany (wpis ORPHAN usunięty).

---

### NOTA-7: DUPLIKAT — mod-wyroby-medyczne vs mod-ustawa-wyroby-medyczne (DR-10) — ✅ ZAMKNIĘTE 2026-06-14 (sesja 4)
Podczas wydzielania mod-PrFarm-refundacja-nadzor-sankcje z mod-PrFarm-szczegolowy
wykryto, że CZĘŚĆ IX (wyroby medyczne) w mod-PrFarm-szczegolowy była zduplikowaną
kopią treści już wydzielonej 2026-06-12 do `mod-wyroby-medyczne.md` — USUNIĘTO.

Dodatkowo wykryto NIEZALEŻNY drugi plik `mod-ustawa-wyroby-medyczne.md` (32 linie,
stub: akt prawny + MDR/IVDR bez treści proceduralnej), zarejestrowany osobno w
SKILL.md i MAPA-AKTOW (Dz.U. 2022 poz. 974 → mod-ustawa-wyroby-medyczne).

**Rozwiązanie:** Scalono unikalną treść stubu (obowiązki wytwórcy/importera/
dystrybutora wg MDR, UDI, CE-marking, PRRC, status modułów EUDAMED po rozp.
(UE) 2024/1860) do `mod-wyroby-medyczne.md` (kanoniczny). `mod-ustawa-wyroby-medyczne.md`
USUNIĘTY. SKILL.md (sekcja WYROBY MEDYCZNE I CHEMIA, liczba modułów 23→22) i
MAPA-AKTOW zaktualizowane — jeden wpis → mod-wyroby-medyczne.

**Przy okazji:** zweryfikowano online (2026-06-14) aktualną nazwę organu —
**URPL** (Urząd Rejestracji Produktów Leczniczych, Wyrobów Medycznych i Produktów
Biobójczych), gov.pl/web/urpl. Poprawiono błędny wariant "UPLWMiPB (dawny URPL)"
— było odwrotnie: URPL jest aktualną nazwą, "UPLWMiPB" nie jest potwierdzoną
nazwą urzędu. Naprawiono w mod-wyroby-medyczne.md, mod-PrFarm-prawo-farmaceutyczne.md
(2 miejsca) i mod-PrFarm-szczegolowy.md (2 miejsca). Usunięto też niezweryfikowany
"15-30 dni" termin zgłoszenia incydentu MDR — zastąpiono odesłaniem do MDR art. 87 + MDCG.

---

### NOTA-8: DUPLIKAT — mod-ustawa-komornicy-sadowi (DR-03) vs mod-ustawa-komornicy-sadowi-zawod (DR-12) — ✅ ZAMKNIĘTE 2026-06-14 (sesja 5)
Wykryte podczas przeglądu pokrycia "zawodów zaufania publicznego" (grupa a —
zawody prawnicze: adwokat, radca prawny, notariusz, komornik, kurator sądowy).

Dwa moduły dla jednej ustawy o komornikach sądowych (Dz.U. 2024 poz. 1458 t.j.):
- `dr-03/.../mod-ustawa-komornicy-sadowi.md` (39 linii, stub bez HARDGATE-equiv,
  MAPA-AKTOW cytował STARY t.j. Dz.U. 2023 poz. 1691)
- `dr-12/.../mod-ustawa-komornicy-sadowi-zawod.md` (202 linie, pełny: intake,
  mapa proceduralna, matryca dowodowa, strategia, quality gate)

Oba moduły miały zadeklarowany podział "zawód (DR-12) vs tryb egzekucji (DR-03)",
ale faktyczna treść DR-03 stubu (status komornika, OC, skarga 767 KPC, wybór
komornika, opłaty) była tym samym zakresem co DR-12, nie odrębnym "trybem
egzekucji" (to żyje w DR-02/mod-KPC-egzekucja-windykacja).

**Rozwiązanie:** `mod-ustawa-komornicy-sadowi.md` (DR-03) USUNIĘTY — nic
unikalnego do scalenia. Zaktualizowano:
- DR-03/MAPA-AKTOW.md: wiersz → odesłanie do dr-12/mod-ustawa-komornicy-sadowi-zawod,
  poprawiono Dz.U. 2023/1691 → 2024/1458 t.j.
- DR-12/SKILL.md: usunięto martwy cross-ref do DR-03
- DR-12/mod-ustawa-notariat.md: cross-ref "tytuł egzekucyjny" → DR-02/mod-KPC-egzekucja-windykacja
  + status zawodu komornika → ten sam DR
- DR-12/mod-ustawa-komornicy-sadowi-zawod.md: usunięto wewnętrzne odesłania do
  usuniętego DR-03 stubu, zastąpiono DR-02/mod-KPC-egzekucja-windykacja (poprawiono
  też nazwę pliku — wcześniej cytowano nieistniejący "...-i-windykacja")
- ROUTING-MAP.md już wskazywał poprawnie na dr-12 — bez zmian

Wniosek ogólny: świadomy podział "moduł A = zawód, moduł B = procedura" jest
poprawnym wzorcem TYLKO gdy moduł B faktycznie zawiera odrębną treść proceduralną
(np. UPEA dla zajęć administracyjnych). Gdy moduł B jest tylko krótszą kopią
modułu A pod innym tytułem, to nie jest podział funkcjonalny — to duplikat.

## PROCEDURA UŻYCIA (dla audytu/dewelopera)

1. **Przed dodaniem nowego pojęcia/definicji**: Ctrl+F w tabeli wyżej —
   czy temat już istnieje? Jeśli TAK → edytuj istniejące miejsce, NIE
   twórz nowego wpisu w innym pliku.
2. **Po dodaniu nowego pojęcia**: dopisz wiersz do tabeli (Pojęcie |
   Lokalizacja | Konsumenci | Status=✅ z datą).
3. **Przy edycji modułu DR**: sprawdź czy edytowana treść ma odpowiednik
   w tej tabeli — jeśli edytujesz definicję BEZ sprawdzenia, ryzykujesz
   stworzenie wersji rozbieżnej (jak mobbing/szkoda/terminy/wyłączenie
   sędziego — 4 przypadki znalezione 2026-06-12).
4. **Audyt okresowy** (audyt-systemu-v4, sekcja "deduplikacja"): grep
   po kluczowych frazach z kolumny "Pojęcie" w całym `/mnt/skills/user/`
   — jeśli fraza pojawia się w >1 pliku POZA "Lokalizacja kanoniczna" +
   "Konsumenci" (które powinny mieć tylko odesłania/cross-ref, nie pełną
   treść) → potencjalny nowy duplikat.

---
*CHECKLIST-DEDUP.md · audyt-systemu-v4/references/ · utworzony 2026-06-12*
*Ostatnia aktualizacja: 2026-07-02 (sesja 2) · naprawa WARN-22 · NOTA-1 do
NOTA-10 — WSZYSTKIE ZAMKNIĘTE. Zero otwartych WARN/NOTA w tym pliku.*

---

### NOTA-11: DUPLIKAT — prawny-router-v3/references/kwalifikator-karnomaterialny.md vs dr-03/modules/mod-KK-kwalifikator-karnomaterialny.md — ✅ ZAMKNIĘTE 2026-07-12

Zgłoszone jako ZNALEZISKO w prawny-router-v3/SKILL.md (limitations, 2026-07-04),
poza zakresem ówczesnej sesji standaryzacji metadanych. Podjęte w ramach
audytu gotowości komercyjnej silnika (punkt 4).

Weryfikacja: `diff` + `md5sum` — pliki bajt-w-bajt identyczne (589 linii,
ten sam hash). Nie wariant, nie rozbieżna treść — czysta kopia.

Kanoniczny: `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md`
(już wskazany jako kanoniczny w prawny-router-v3 required_modules pod UP-3).

**Rozwiązanie:** `prawny-router-v3/references/kwalifikator-karnomaterialny.md`
USUNIĘTY. Realne miejsca wywołania, które nadal wskazywały na kopię w
routerze — oba wewnątrz DR-03, mimo że kanoniczny plik leży w tym samym
katalogu:
- `dr-03/modules/mod-KW-kodeks-wykroczen.md` (linia z `view` + wiersz tabeli ŁĄCZ Z)
- `dr-03/modules/mod-KK-KPK-framework-karne.md` (linia z `view` + wiersz tabeli ŁĄCZ Z)

Oba przekierowane na ścieżkę kanoniczną. prawny-router-v3/SKILL.md
zaktualizowany (v3.13 → 3.14, limitations + changelog).

Wniosek ogólny: znaleziska oznaczone "do weryfikacji w następnym audycie"
w polu `limitations` poszczególnych skilli nie trafiają automatycznie do
WARN-OTWARTE.md, jeśli nie zostały jawnie tam wpisane jako WARN/F — warto
przy kolejnym pełnym audycie DZU przeszukać `limitations:` wszystkich
SKILL.md pod kątem podobnych niezamkniętych znalezisk.

### NOTA-12: DUPLIKAT — dr-03/modules/mod-KK-stalking-szczegolowy.md vs prawny-router-v3/references/stalking-nekanie.md — ✅ ZAMKNIĘTE 2026-07-12

Wykryte automatycznie przez `audyt-systemu-v4/scripts/ci_check_shared.py`
(audyt gotowości komercyjnej, pierwsze uruchomienie). `diff`+`md5sum`: bajt-w-bajt
identyczne (116 linii).

Oba faktycznie używane: `dr-03/SKILL.md` (checklist modułów) i
`dr-03/MAPA-AKTOW.md` śledziły `mod-KK-stalking-szczegolowy` jako moduł DR-03;
`dr-03/modules/mod-KK-art190a-stalking.md` i `mod-KK-kwalifikator-karnomaterialny.md`
odwoływały się (view + 2× prosa) do kopii routera. Router sam deklaruje zasadę
"nie duplikuj treści modułów dziedzinowych w routerze" (prawny-router-v3/SKILL.md,
"Zasada odciążenia routera") — kopia w `references/` była jej naruszeniem.

**Rozwiązanie:** nowy plik kanoniczny `shared/STALKING-NEKANIE.md` (treść
identyczna z obu usuniętych). Oba oryginały usunięte. Zaktualizowane:
`mod-KK-art190a-stalking.md` (view), `mod-KK-kwalifikator-karnomaterialny.md`
(2× prosa), `dr-03/SKILL.md` (checklist 20→19 + nota o relokacji),
`dr-03/MAPA-AKTOW.md` (wskaźnik modułu).

### NOTA-13: DUPLIKAT — dr-16/modules/mod-KPC-przesluchanie-swiadkow.md vs prawny-router-v3/references/przesluchanie-swiadkow.md — ✅ ZAMKNIĘTE 2026-07-12

Wykryte tą samą sesją co NOTA-12. Bajt-w-bajt identyczne (99 linii, art.
258-305 KPC — ramowy framework, NIE mylić z pełnym skillem
`przesluchanie-swiadkow-v2-min90`, który ma inny zakres: zaawansowana
strategia przesłuchania, nie podstawy ustawowe).

Oba faktycznie używane: `dr-16/SKILL.md` (checklist), `dr-16/MAPA-AKTOW.md`
i `prawo-polskie-v2/ROUTING-MAP.md` (centralna mapa routingu) śledziły moduł
pod nazwą `dr-16/modules/mod-KPC-przesluchanie-swiadkow`.

**Rozwiązanie:** nowy plik kanoniczny `shared/PRZESLUCHANIE-SWIADKOW-KPC.md`.
Oba oryginały usunięte. Zaktualizowane: `dr-16/SKILL.md` (checklist 11→10 +
nota o relokacji), `dr-16/MAPA-AKTOW.md`, `prawo-polskie-v2/ROUTING-MAP.md`.

### NOTA-14: DUPLIKAT — analizator-dowodow-v3/modules/MOD-NAZEWNICTWO-STRON.md vs shared/NAZEWNICTWO-STRON.md + 9 martwych stubów HYBRID-VALIDATION/MOD-WALIDACJA/etc. — ✅ ZAMKNIĘTE 2026-07-12

Wykryte tą samą sesją. Różne od NOTA-12/13: tu kanoniczny plik w `shared/`
JUŻ istniał — `analizator-dowodow-v3/modules/MOD-NAZEWNICTWO-STRON.md` był
zbędną kopią, 2 wywołania `view()` w `analizator-dowodow-v3/SKILL.md`
przekierowane na `shared/NAZEWNICTWO-STRON.md`, kopia usunięta.

**Odkrycie poboczne (istotniejsze niż sam duplikat):** ten sam skan wykrył,
że `pisma-proste-v2/references/HYBRID-VALIDATION.md` i
`prawny-router-v3/references/HYBRID-VALIDATION.md` są identyczne — ale
`shared/DEDUPLICATION-POLICY.md` już od **2026-06-13** deklarował te dwa
pliki (i 7 pokrewnych: `MOD-WALIDACJA.md` ×2, `ISAP-AUDIT-PROTOCOL.md`,
`INTAKE-GAP.md`, `POST-VALIDATION.md`, `terminy.md`, `M5-terminy.md`) jako
"usunięte". Weryfikacja na dysku: 9 z 10 wciąż fizycznie istniało — zero
żywych `view()` na pełną ścieżkę każdego, więc bezpieczne do usunięcia, ale
deklaracja "usunięte" była fałszywa od miesiąca i nic tego nie wyłapało.

**Rozwiązanie:** wszystkie 9 usunięte naprawdę. `pisma-proste-v2/references/
M1-zasady.md` (ZASADA 6, tabela ekonomii modułów) zaktualizowany — wskazywał
usunięty `M5-terminy.md`, teraz bezpośrednio `shared/terminy.md`.
`DEDUPLICATION-POLICY.md` skorygowany (nagłówek + adnotacja o fałszywej
deklaracji). `DEPENDENCY-GRAPH.md` zaktualizowany (kolumny "Wywołujące
skille" wskazywały nieistniejące już pliki-adaptery jako punkty odniesienia).

**Wniosek ogólny:** deklaracja zamknięcia w pliku polityki ≠ wykonanie.
Zalecenie na przyszłość: każda sesja audytowa, która pisze "usunięto X",
powinna kończyć się realnym `rm` w tej samej sesji, nie tylko wpisem —
`ci_check_shared.py` (uruchamiany teraz jako git pre-commit hook) wyłapie
to przy następnej próbie commita, jeśli ktoś znowu tylko zadeklaruje.

## NOTA-9 — Nowe moduły shared z sesji 2026-06-16 (oczekują na wdrożenie)

**Status:** ⚠️ OCZEKUJE NA WDROŻENIE do /mnt/skills/user/shared/

Zarejestrowane pojęcia/moduły jako kanoniczne lokalizacje:

| Pojęcie/Moduł | Lokalizacja kanoniczna | Konsumenci | Status |
|---|---|---|---|
| Warianty strategiczne pisma (W1.2b) | `shared/MOD-WARIANTY-POZWU.md` | pisma-procesowe-v3, analizator-dowodow-v3 | ✅ wdrożone 06-17 |
| Checklist priorytetów aspektów (główne/poboczne) | `shared/MOD-PRIORYTETY-ASPEKTOW.md` | analizator-dowodow-v3, analiza-sadowa-v6 | ✅ wdrożone 06-17 |
| Rejestr metod badawczych (13 metod) | `shared/MOD-METODY-BADAWCZE.md` | analizator-dowodow-v3 BLOK E2a-j | ✅ wdrożone 06-17 |
| Historia strategii (TRYB A/B, schema JSON) | `shared/MOD-HISTORIA-STRATEGII.md` | MOD-WARIANTY-POZWU, MOD-PRIORYTETY-ASPEKTOW | ✅ wdrożone 06-17 |
| Mapowanie wyników na przepisy (głębokość/zgodność) | `shared/MOD-MAPA-PRZEPISOW.md` | analizator-dowodow-v3 KROK 3B.2, MOD-WARIANTY-POZWU | ✅ wdrożone 06-17 |
| Selekcja dowodów do tez + ryzyko krzyżowe | `shared/MOD-SELEKCJA-DOWODOW.md` | analizator-dowodow-v3 KROK 3B.3, pisma-procesowe-v3 W1.3 | ✅ wdrożone 06-17 |
| Kontekst sesji (bridge między sesjami, format .md) | `shared/MOD-KONTEKST-SESJI.md` | prawny-router-v3 KROK 0B/5B, przesluchanie-swiadkow-v2 KROK 0 | ✅ wdrożone 06-17 |

**Po wdrożeniu ZIP-ów**: zmień status wszystkich wierszy z ⚠️ na ✅ z datą wdrożenia.

**Uwaga deduplication**: 
- Ryzyko krzyżowe dowodów (HARDGATE-SD-01/02) jest kanoniczne w MOD-SELEKCJA-DOWODOW.
  Nie tworzyć kopii tej logiki w DR-skillach ani w pisma-procesowe-v3.
- Rejestr metod badawczych: wszystkie 13 metod (SLE-01/02/03 + MET-ACH/FTL/NET/CA/
  CASE/PT/TRI/FA/DQ/COMP) są kanoniczne w MOD-METODY-BADAWCZE. Nie duplikować
  opisów metod w BLOK E analizatora (odwołanie przez view, nie inline).
- Format pliku kontekstu sesji (9 sekcji §2 MOD-KONTEKST-SESJI): jeden format
  dla TRYB A i TRYB B (portal vendora) — nie tworzyć alternatywnych schematów.

*NOTA-9 ZAMKNIĘTA: 2026-06-17 · wszystkie 7 modułów wdrożone i zweryfikowane*
| 8 wektorów ataku na świadka SW-A1..SW-A8 (konflikt interesu, zaprzeczenie przez dokument, źródło wtórne, domysł vs fakt, niespójność wewnętrzna, upływ czasu, zastraszenie, brak wiedzy) | `shared/MOD-ATAK-NA-SWIADKA.md FAZA 2` (kanoniczne) — nazewnictwo poprawione 2026-07-02 (WARN-22): dawne odwołanie do "TA-1..TA-9 §CZĘŚĆ I" było nieaktualne, plik od v1.0.0 używa SW-A1..SW-A8/FAZA 0-5 | analizator-dowodow-v3 (BLOK-NEGACJA N8), przesluchanie-swiadkow-v2, dr-16 mod-KPC-przesluchanie-swiadkow, pisma-procesowe-v3 W2.4 | ✅ 2026-06-24, nazewnictwo naprawione 2026-07-02 |
| Profil świadka SW-P1..SW-P5 (dane formalne, treść zeznań, źródło wiedzy, sprzeczności wewnętrzne/zewnętrzne) | `shared/MOD-ATAK-NA-SWIADKA.md FAZA 1` (kanoniczne) — poprzednio błędnie łączone z "§CZĘŚĆ II" (metody ataku na biegłego); to ODRĘBNA sekcja profilowania świadka, nie biegłego | analizator-dowodow-v3 (BLOK-NEGACJA N8), pisma-procesowe-v3 | ✅ naprawiono 2026-07-02 (WARN-22) |
| Priorytetyzacja wektorów SW-PRIOR (macierz 🔴/🟠/🟡, zasada ≤3 ataków) + integracja W2.4c i SW-TARCZKA (obrona naszego świadka) | `shared/MOD-ATAK-NA-SWIADKA.md FAZA 3-4` (kanoniczne) — pełni funkcję dawnego wpisu "AC1-AC4 obrona ante-cross §CZĘŚĆ III", którego oznaczona nazwa AC1-AC4 NIE występuje w żadnej wersji pliku (0.x-1.1.0) — prawdopodobnie pomyłka referencyjna z sesji 2026-06-24d, a nie usunięta treść | przesluchanie-swiadkow-v2 W3-W4, pisma-procesowe-v3 | ✅ naprawiono 2026-07-02 (WARN-22 — patrz NOTA-10 dla pełnego wyjaśnienia) |
| Specyfika ataku na świadka/biegłego per dziedzina (DR-02/03/04/05) | `shared/MOD-ATAK-NA-SWIADKA.md FAZA 6 — SPECYFIKA DZIEDZINOWA PER DR` (kanoniczne, poglądowe) — sekcja DODANA 2026-07-02 (WARN-22), wcześniej deklarowana w CHECKLIST-DEDUP ale nieobecna w pliku. DR-02: pełne (pointer do mod-KRO-rodzinne.md S1-S4). DR-03/04/05: poglądowe, pełne moduły „DO OPRACOWANIA” | DR-02 (pełne), DR-03, DR-04, DR-05 (poglądowe — pointer, pełne rozwinięcie oczekuje na przyszłą sesję) | ✅ NAPRAWIONE 2026-07-02 (WARN-22 zamknięty) |
| Trudności praktyczne w sprawach rozwodowych (T1-T7: trwałość rozkładu, wina, OZSS, majątek, eskalacja, przewlekłość, zmiana 2027) | `dr-02/.../mod-KRO-rodzinne.md` §"NAJWIĘKSZE TRUDNOŚCI PRAKTYCZNE" | DR-02 (lokalne, dziedzinowe) | ✅ 2026-07-02 |
| Mediacja rozwodowa (art. 436/445²/183¹–183¹⁵ KPC) — przebieg, zalety, ograniczenia, wzór wniosku | `dr-02/.../mod-KRO-rodzinne.md` §"MEDIACJA W SPRAWACH ROZWODOWYCH" | DR-02 (lokalne) — od 2026-07-17 może odsyłać do `dr-12/.../mod-techniki-mediacyjne-negocjacyjne.md` dla ogólnej warstwy technik (patrz wpis poniżej) | ✅ 2026-07-02, uzupełnione 2026-07-17 |
| Techniki mediacyjne i negocjacyjne — 5 zasad mediacji, przygotowanie w 5 krokach (zbieranie informacji, wyznaczanie celów wg Koła Konfliktu Moore'a, plan, logistyka, analiza), przygotowanie z perspektywy mediatora (screening, sesje wstępne), ustalanie priorytetów/kolejności kwestii, style/modele, typy negocjacji, negocjacje oparte na interesach (Fisher/Ury), BATNA/ZOPA, techniki komunikacyjne + rola ciszy/komunikacja niewerbalna, caucus, nierównowaga siły, rola/umiejętności/osobowość mediatora, kwestie kulturowe (Hofstede) | `dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-techniki-mediacyjne-negocjacyjne.md` (v1.3) — KANONICZNE dla warstwy technik OGÓLNYCH (cywilna/rodzinna/pracownicza/gospodarcza). Komplementarne z `mod-KPC-arbitraz-mediacja-ADR.md` (procedura) i `dr-03/.../mod-KPK-mediacja-sprawiedliwosc-naprawcza.md` (specyfika karna) | DR-12 (lokalne), DR-02, DR-03 (mediacja karna — moduł osobny), DR-04, DR-07, pisma-procesowe-v3, przewodnik-prawny-v2 | ✅ nowe 2026-07-17, rozbudowane i skorygowane 2026-07-17 (v1.1→1.3) |
| Mediacja karna i sprawiedliwość naprawcza — art. 23a KPK (§1-7), rozszerzenie na wykroczenia (2015), przesłanki kwalifikacji, poufność/art. 178a KPK, idea sprawiedliwości naprawczej | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KPK-mediacja-sprawiedliwosc-naprawcza.md` — KANONICZNE dla specyfiki karnoprawnej mediacji. NIE duplikuje ogólnych technik (te w mod-techniki-mediacyjne-negocjacyjne.md, wpis powyżej) | DR-03 (lokalne), DR-12 (odesłanie dwukierunkowe) | ✅ nowe 2026-07-17 |
| Opinia OZSS — przygotowanie klienta, kwestionowanie opinii | `dr-02/.../mod-KRO-rodzinne.md` §"OPINIA OZSS — ROZSZERZONE" | DR-02 (lokalne) | ✅ 2026-07-02 |
| Specyfika świadków w sprawach rozwodowych (krąg rodzinny, art. 233 §1 KPC — standard zaskarżenia, art. 233 KK — granice odpowiedzialności) | `dr-02/.../mod-KRO-rodzinne.md` §"ŚWIADKOWIE W SPRAWACH ROZWODOWYCH" (S1-S4) — NIE duplikuje `shared/MOD-ATAK-NA-SWIADKA.md` (SW-A1..SW-A8 pozostają tam kanoniczne); ten wpis = wyłącznie specyfika dziedzinowa DR-02 | DR-02 (pointer do shared/MOD-ATAK-NA-SWIADKA.md dla technik ogólnych) | ✅ 2026-07-02 |
| WARN-13 zamknięty: §WERYFIKACJA sygnatur w MOD-NEGACJA-DOWODOW | `shared/MOD-NEGACJA-DOWODOW.md §WERYFIKACJA` | System: procedura weryfikacji przed powołaniem w piśmie | ✅ 2026-06-24 |
| 12 wektorów ataku na dowód AD-1..AD-12 | `shared/MOD-ATAK-NA-DOWOD.md §CZĘŚĆ I` (kanoniczne) | analizator-dowodow-v3 (BLOK-ATAK-NA-DOWOD, MP5-atak §5.2/5.3), pisma-procesowe-v3 (W2.4 + W1.2d) | ✅ 2026-06-24 |
| Procedura ADIS ofensywna (5 kroków ataku na dowody przeciwnika) | `shared/MOD-ATAK-NA-DOWOD.md §CZĘŚĆ II` | analizator-dowodow-v3 (BLOK-ATAK-NA-DOWOD), pisma-procesowe-v3 W1.2d | ✅ 2026-06-24 |
| Procedura SHIELD obronna (6 kroków szczepienia dowodu) | `shared/MOD-ATAK-NA-DOWOD.md §CZĘŚĆ III` | pisma-procesowe-v3 W2.4, analizator-dowodow-v3 MP5-atak §5.4 | ✅ 2026-06-24 |
| Ataki na dowody elektroniczne DE-1..DE-5 (metadane, hash, AI/deepfake) | `shared/MOD-ATAK-NA-DOWOD.md §AD-10` — NIE scalać z DR-11 (DR-11=prawo cyfrowe, AD-10=taktyki ataku) | analizator-dowodow-v3, pisma-procesowe-v3 | ✅ 2026-06-24 |
| Zakaz dowodowy katalog ZD-1..ZD-6 (nagrania, tajemnice, RODO, art.174 KPK) | `shared/MOD-ATAK-NA-DOWOD.md §AD-5` (rozszerzenie MD3b §LEG-CONTRA-N o katalog i mechanizmy ataku) | analizator-dowodow-v3 MD3b (istniejący wykrywa), MP5-atak §AD-5 (mechanizm ofensywny) | ✅ 2026-06-24 |
| Kontrdowód aktywny KD-1..KD-5 (sekwencja ofensywna) | `shared/MOD-ATAK-NA-DOWOD.md §AD-9` (kanoniczne) — NIE scalać z MP5 §5.4 (MP5=ogólny przeciwplan) | analizator-dowodow-v3 (BLOK-ATAK-NA-DOWOD ADIS-4) | ✅ 2026-06-24 |
| Rejestr załączników + checkpoint kontynuacji (RZ-REJ/RZ-SHOW, statusy ✅/🔶/⬜/➖/⬛) | `shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md` v1.0.0 — WYŁĄCZNA lokalizacja; NIE duplikować w MOD-SKAN-DOWODOW-KOMPLETNY (ten plik = metodologia odczytu, nie widoczność/zgoda użytkownika) | prawny-router-v3 (required_modules + SELF-CHECK), pośrednio wszystkie skille wywoływane przez router z załącznikami | ✅ 2026-07-12 |
| Ustawa o zapewnianiu dostępności osobom ze szczególnymi potrzebami (Dz.U. 2024 poz. 1411 t.j.) | Akt WSPÓLNY dla ≥2 skilli — kandydat do `shared/` zamiast duplikowania w lokalnych MAPA-AKTOW. Numer 2022.2240 (nieaktualny, POPRAWIONY 2026-07-02) był zduplikowany identycznie błędnie w DWÓCH MAPA-AKTOW jednocześnie — wskazuje, że przy tworzeniu dr-10 skopiowano wpis z dr-05 (lub odwrotnie) bez niezależnej weryfikacji obu | dr-05/mod-ustawa-dostepnosc-niepelnosprawni, dr-10/mod-ustawa-edukacja-specjalna-dostepnosc — SPRAWDŹ inne DR-skille przy okazji (prawdopodobny trzeci/czwarty duplikat) | ⚠️ NAPRAWIONE W 2 MIEJSCACH 2026-07-02 — zalecane przeniesienie do shared/ |
| Ustawa o kontroli w administracji rządowej (Dz.U. 2026 poz. 158 t.j.) | ⛔ WZORZEC SYSTEMOWY POTWIERDZONY: identyczny błędny numer (2020.224, nieaktualny od dawna) wystąpił w TRZECH skillach jednocześnie (dr-05, dr-08 — dr-11/dr-13 NIE sprawdzone, prawdopodobne kolejne wystąpienia). To już nie pojedynczy przypadek lecz udowodniony wzorzec: przy budowie systemu ten akt był kopiowany między MAPA-AKTOW bez niezależnej weryfikacji w KAŻDYM miejscu. REKOMENDACJA PODNIESIONA DO WYSOKIEGO PRIORYTETU: przenieść do `shared/definicje/` jako akt kanoniczny z jednym źródłem prawdy | dr-05/mod-ustawa-kontrola-administracji, dr-08/mod-kontrola-administracji-inspekcje — SPRAWDŹ dr-11 (cyfrowe/AI/dane), dr-13 (służby/bezpieczeństwo), dr-15 (compliance/audyt) jako najbardziej prawdopodobne kolejne wystąpienia | ⚠️ NAPRAWIONE W 2 MIEJSCACH 2026-07-02 — PILNA rekomendacja przeniesienia do shared/ |

---

## NOTA-10 — WARN-22: rozbieżność struktury shared/MOD-ATAK-NA-SWIADKA.md vs CHECKLIST-DEDUP (wykryto 2026-07-02, ZAMKNIĘTA 2026-07-02)

**Status:** ✅ ZAMKNIĘTA — naprawiona w tej samej sesji (targeted audit "napraw WARN").

**Opis:** Tabela główna (wpisy z sesji 2026-06-24) odwołuje się do sekcji
`shared/MOD-ATAK-NA-SWIADKA.md §CZĘŚĆ I / §CZĘŚĆ II / §CZĘŚĆ III / §CZĘŚĆ IV`
oraz do techniki „TA-1..TA-9”. Faktyczna treść pliku (wersja 1.0.1, 2026-06-24)
jest zorganizowana jako `FAZA 0–5` z wektorami `SW-A1..SW-A8` (nie TA-1..TA-9)
i **nie zawiera** żadnej sekcji `§CZĘŚĆ I–IV` ani specyfiki dziedzinowej
DR-02/03/04/05 (poglądowej), którą CHECKLIST-DEDUP deklaruje jako kanoniczną.

**Wpływ:**
- Konsumenci szukający "specyfiki dziedzinowej" per DR-02/03/04/05 w
  `§CZĘŚĆ IV` NIE znajdą tam nic — sekcja nie istnieje w obecnej wersji pliku.
- Prawdopodobna przyczyna: plik został zrestrukturyzowany (TA-1..TA-9/CZĘŚĆ I-IV
  → SW-A1..SW-A8/FAZA 0-5) w wersji 1.0.0→1.0.1, ale CHECKLIST-DEDUP nie został
  zaktualizowany równolegle (naruszenie zasady „Po dodaniu/zmianie pojęcia —
  dopisz/zaktualizuj tabelę” — PROCEDURA UŻYCIA pkt 2).

**Naprawa wykonana 2026-07-02:**
1. ✅ Dodano sekcję `FAZA 6 — SPECYFIKA DZIEDZINOWA PER DR` do
   `shared/MOD-ATAK-NA-SWIADKA.md` (v1.0.1→v1.1.0) — DR-02 pełne (pointer do
   mod-KRO-rodzinne.md S1-S4), DR-03/04/05 poglądowe z jawnym „DO OPRACOWANIA”.
2. ✅ Zaktualizowano 4 wiersze tabeli głównej CHECKLIST-DEDUP: usunięto
   nieaktualne nazwy (TA-1..TA-9, B1-B9, §CZĘŚĆ I-IV) i odwołania do
   nieistniejącego oznaczenia „AC1-AC4” (funkcję pełni FAZA 3-4/SW-TARCZKA —
   ustalono, że AC1-AC4 to najpewniej pomyłka referencyjna z sesji 06-24d,
   nie usunięta treść; brak dowodu, że taka sekcja kiedykolwiek istniała).
3. ✅ Usunięto 3 zdublowane, nieaktualne wiersze (dawne TA-1..TA-9/B1-B9/AC1-AC4).

**Uwaga resztkowa (NIEBLOKUJĄCA, do rozważenia w przyszłości):** wiersz
"Wektory ataku na świadka SW-A1..SW-A8" z sesji 2026-06-24d (linia ~82,
poprawny od początku) i naprawiony wiersz z tej sesji (linia ~277) opisują
ten sam koncept z dwóch sesji. Nie jest to błąd merytoryczny (obie treści są
zgodne z plikiem), ale drobna redundancja nawigacyjna w tabeli — kandydat do
scalenia przy najbliższym porządkowaniu CHECKLIST-DEDUP (poza zakresem
naprawy WARN-22).

*NOTA-10 ZAMKNIĘTA: 2026-07-02 · naprawiono w tej samej sesji co wykrycie.*
