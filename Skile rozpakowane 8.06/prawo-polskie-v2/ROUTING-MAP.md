# ROUTING-MAP — Centralna Mapa Aktów Prawnych → DR-skills
# prawo-polskie-v2 v4.1 (aktualizacja 2026-06-07)
#
# Format: Akt prawny | Dz.U. | DR-skill | Moduł | Status
# Status: ✅ OK = moduł merytoryczny | 🔗 odesłanie = w innym DR | ☐ BRAK = do zbudowania
#
# Zasada: jeden akt prawny = jeden wpis w tej tabeli = jeden moduł
# Wyjątek: rozdziały tego samego aktu mogą mieć osobne moduły (oznaczone w kolumnie Moduł)

## TABELA STATUSU — SKRÓCONA WEDŁUG DR

| DR | Dziedzina | ✅ OK | 🔗 odesłanie | ☐ BRAK | Łącznie |
|---|---|:---:|:---:|:---:|:---:|
| DR-01 | Ustrój Konstytucyjny | 4 | 1 | 0 | 5 |
| DR-02 | Prawo Cywilne/Rodzinne/Gosp. | 17 | 1 | 0 | 18 |
| DR-03 | Prawo Karne/Wykroczenia | 14 | 0 | 0 | 14 |
| DR-04 | Prawo Pracy/ZUS/Świadczenia | 18 | 0 | 0 | 18 |
| DR-05 | Prawo Administracyjne | 11 | 3 | 0 | 14 |
| DR-06 | Podatki/Finanse/AML | 20 | 0 | 0 | 20 |
| DR-07 | Zamówienia Publiczne/Fundusze | 12 | 2 | 0 | 14 |
| DR-08 | Samorząd Terytorialny | 15 | 0 | 0 | 15 |
| DR-09 | Budownictwo/Środowisko/Energia | 11 | 0 | 0 | 11 |
| DR-10 | Zdrowie/Farmacja/Żywność | 12 | 0 | 0 | 12 |
| DR-11 | Cyfrowe/AI/Dane/IP | 11 | 0 | 0 | 11 |
| DR-12 | Sądownictwo/Zawody | 10 | 2 | 0 | 12 |
| DR-13 | Służby/Bezpieczeństwo | 9 | 0 | 0 | 9 |
| DR-14 | Prawo UE/Międzynarodowe | 8 | 0 | 0 | 8 |
| DR-15 | Compliance/ISO | 9 | 0 | 0 | 9 |
| DR-16 | Pisma/Narzędzia | 11 | 0 | 0 | 11 |
| **SUMA** | | **182** | **9** | **0** | **191** |

---

## DR-01 — Ustrój Konstytucyjny i Źródła Prawa

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Konstytucja RP + Ustawa o TK | Dz.U. 1997 nr 78 poz. 483 + Dz.U. 2019 poz. 2393 | dr-01/modules/mod-Konstytucja-TK-skarga-konstytucyjna | ✅ OK |
| USP + SN (ustrój sądów) | Dz.U. 2024 poz. 334 + Dz.U. 2023 poz. 1093 | dr-01/modules/mod-USP-ustroj-sadow-powszechnych | ✅ OK |
| Ustawa o KRS + ustrój władzy | Dz.U. 2019 poz. 84 ze zm. | dr-01/modules/mod-ustawa-KRS-i-ustroj-wladzy | ✅ OK |
| Ustawa o partiach politycznych + referendum ogólnokrajowe | Dz.U. 2023 poz. 1215 + Dz.U. 2020 poz. 851 | dr-01/modules/mod-ustawa-partie-polityczne-referendum | ✅ OK |
| Ustawa o Radzie Ministrów + Prezydent RP | Dz.U. 2022 poz. 2032 ze zm. | → dr-01/modules/mod-ustawa-KRS-i-ustroj-wladzy | 🔗 odesłanie |

## DR-02 — Prawo Cywilne, Rodzinne i Gospodarcze

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Kodeks cywilny — zobowiązania, roszczenia | Dz.U. 2025 poz. 1071 ze zm. | dr-02/modules/mod-KC-zobowiazania-i-roszczenia | ✅ OK |
| Kodeks cywilny — Księga IV Spadki | Dz.U. 2025 poz. 1071 ze zm. | dr-02/modules/mod-KC-spadki-ksiega4 | ✅ OK |
| Kodeks rodzinny i opiekuńczy | Dz.U. 2023 poz. 2809 ze zm. | dr-02/modules/mod-KRO-rodzinny-i-opiekunczy | ✅ OK |
| KP art. 94³ — mobbing (rozdział KP) | Dz.U. 2025 poz. 277 ze zm. | dr-02/modules/mod-KP-art943-mobbing | ✅ OK |
| Kodeks spółek handlowych | Dz.U. 2025 poz. 614 ze zm. | dr-02/modules/mod-KSH-kodeks-spolek-handlowych | ✅ OK |
| Prawo upadłościowe | Dz.U. 2024 poz. 1171 ze zm. | dr-02/modules/mod-PrUpad-prawo-upadlosciowe | ✅ OK |
| KPC — egzekucja i windykacja | Dz.U. 2026 poz. 468 ze zm. | dr-02/modules/mod-KPC-egzekucja-i-windykacja | ✅ OK |
| Ustawa o prawach konsumenta | Dz.U. 2023 poz. 2759 ze zm. | dr-02/modules/mod-ustawa-prawa-konsumenta | ✅ OK |
| KC — ubezpieczenia umowne + OC | Dz.U. 2025 poz. 1071 + Dz.U. 2025 poz. 367 t.j. | dr-02/modules/mod-KC-ubezpieczenia-umowne-OC-AC | ✅ OK |
| Ustawa o cudzoziemcach | Dz.U. 2025 poz. 1079 ze zm. | dr-02/modules/mod-ustawa-cudzoziemcy | ✅ OK |
| Ustawa o ochronie konkurencji i konsumentów | Dz.U. 2024 poz. 1221 ze zm. | dr-02/modules/mod-ustawa-ochrona-konkurencji-konsumentow | ✅ OK |
| Ustawa o KRS — rejestr sądowy | Dz.U. 2023 poz. 685 ze zm. | dr-02/modules/mod-ustawa-KRS-rejestr-sadowy | ✅ OK |
| Ustawa o kredycie konsumenckim | Dz.U. 2024 poz. 1567 ze zm. | dr-02/modules/mod-ustawa-kredyt-konsumencki | ✅ OK |
| Ustawa o własności lokali | Dz.U. 2021 poz. 1048 ze zm. | → dr-02/modules/mod-ustawa-deweloperska-ochrona-nabywcy | 🔗 odesłanie |
| Prawo restrukturyzacyjne | Dz.U. 2022 poz. 2309 ze zm. | dr-02/modules/mod-ustawa-restrukturyzacja | ✅ OK |
| Ustawa o fundacjach + prawo o stowarzyszeniach | Dz.U. 2023 poz. 549 + Dz.U. 2020 poz. 2261 | dr-02/modules/mod-ustawa-fundacje-stowarzyszenia | ✅ OK |
| Ustawa o zwalczaniu nieuczciwej konkurencji (UZNK) | Dz.U. 2026 poz. 85 t.j. | dr-02/modules/mod-ustawa-UZNK-nieuczciwa-konkurencja | ✅ OK |
| Ustawa o spółdzielniach + prawo spółdzielcze | Dz.U. 2021 poz. 648 ze zm. | dr-02/modules/mod-ustawa-spoldzielnie | ✅ OK |
| Ustawa deweloperska — ochrona nabywcy | Dz.U. 2021 poz. 1177 ze zm. | dr-02/modules/mod-ustawa-deweloperska-ochrona-nabywcy | ✅ OK |

## DR-03 — Prawo Karne, Wykroczenia, Egzekucja

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Kodeks karny (KK) + KPK | Dz.U. 2025 poz. 383 + Dz.U. 2026 poz. 490 | dr-03/modules/mod-KK-kodeks-karny | ✅ OK |
| KK art. 190a — stalking | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-art190a-stalking | ✅ OK |
| KK art. 207 + ustawa antyprzemocowa | Dz.U. 2025 poz. 383 + Dz.U. 2021 poz. 1249 | dr-03/modules/mod-KK-art207-przemoc-domowa | ✅ OK |
| KK art. 267–269c — cyberprzestępstwa | Dz.U. 2025 poz. 383 ze zm. | dr-03/modules/mod-KK-art267-269c-cyberprzestepstwa | ✅ OK |
| Kodeks karny wykonawczy (KKW) | Dz.U. 2025 poz. 911 ze zm. | dr-03/modules/mod-KKW-kodeks-karny-wykonawczy | ✅ OK |
| Kodeks wykroczeń (KW) + KPW | Dz.U. 2025 poz. 734 + Dz.U. 2022 poz. 1124 | dr-03/modules/mod-KW-kodeks-wykroczen | ✅ OK |
| KPK — tryby ścigania | Dz.U. 2026 poz. 490 ze zm. | dr-03/modules/mod-KPK-tryby-scigania | ✅ OK |
| KKS + Ustawa AML | Dz.U. 2025 poz. 633 t.j. + Dz.U. 2023 poz. 1124 | dr-03/modules/mod-KKS-karny-skarbowy-i-AML | ✅ OK |
| Kwalifikator karnomaterialny | — | dr-03/modules/mod-KK-kwalifikator-karnomaterialny | ✅ OK |
| Framework prawo karne szczegółowy | — | dr-03/modules/mod-KK-KPK-framework-szczegolowy | ✅ OK |
| Ustawa o odpowiedzialności podmiotów zbiorowych | Dz.U. 2024 poz. 1247 ze zm. | dr-03/modules/mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych | ✅ OK |
| Ustawa o komornikach sądowych | Dz.U. 2023 poz. 1691 ze zm. | dr-03/modules/mod-ustawa-komornicy-sadowi | ✅ OK |
| Ustawa o Funduszu Pomocy Pokrzywdzonym | Dz.U. 2022 poz. 2256 ze zm. | dr-03/modules/mod-ustawa-fundusz-pomocy-pokrzywdzonym | ✅ OK |
| Ustawa o przeciwdziałaniu narkomanii | Dz.U. 2023 poz. 1939 ze zm. | dr-03/modules/mod-ustawa-narkomania | ✅ OK |

## DR-04 — Prawo Pracy, ZUS, Świadczenia Społeczne

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Kodeks pracy (KP) | Dz.U. 2025 poz. 277 ze zm. | dr-04/modules/mod-KP-kodeks-pracy | ✅ OK |
| KPA + PPSA | Dz.U. 2025 poz. 1691 + Dz.U. 2026 poz. 143 | dr-04/modules/mod-KPA-kpa-i-postepowanie-adm | ✅ OK |
| Ustawa SUS — ZUS | Dz.U. 2026 poz. 199 (t.j. 09.02.2026) ze zm. (poz. 26) | dr-04/modules/mod-SUS-ubezpieczenia-spoleczne-ZUS | ✅ OK |
| Ustawa KRUS | Dz.U. 2024 poz. 90 ze zm. | dr-04/modules/mod-KRUS-ubezpieczenie-spoleczne-rolnikow | ✅ OK |
| Ustawa o rehabilitacji + PFRON | Dz.U. 2024 poz. 44 ze zm. | dr-04/modules/mod-ustawa-rehabilitacja-niepelnosprawnosc-PFRON | ✅ OK |
| Ustawa o pomocy społecznej | Dz.U. 2024 poz. 1431 ze zm. | dr-04/modules/mod-ustawa-pomoc-spoleczna | ✅ OK |
| Framework ZUS/renty/emerytury | — | dr-04/modules/mod-SUS-framework-ubezpieczen-spolecznych | ✅ OK |
| Ustawa o rynku pracy i służbach zatrudnienia | Dz.U. 2024 poz. 475 ze zm. | dr-04/modules/mod-ustawa-rynek-pracy-sluzby-zatrudnienia | ✅ OK |
| Ustawa o świadczeniach rodzinnych | Dz.U. 2024 poz. 323 ze zm. | dr-04/modules/mod-ustawa-swiadczenia-rodzinne | ✅ OK |
| Ustawa o Państwowej Inspekcji Pracy (PIP) | Dz.U. 2022 poz. 1967 ze zm. | dr-04/modules/mod-ustawa-PIP-panstwowa-inspekcja-pracy | ✅ OK |
| Ustawa o minimalnym wynagrodzeniu | Dz.U. 2024 poz. 1285 ze zm. | dr-04/modules/mod-ustawa-minimalne-wynagrodzenie | ✅ OK |
| Ustawa o ZFSS | Dz.U. 2024 poz. 288 ze zm. | dr-04/modules/mod-ustawa-ZFSS | ✅ OK |
| Ustawa o zatrudnianiu pracowników tymczasowych | Dz.U. 2019 poz. 1563 ze zm. | dr-04/modules/mod-ustawa-praca-tymczasowa | ✅ OK |
| Ustawa o rozwiązywaniu sporów zbiorowych | Dz.U. 2023 poz. 1789 ze zm. | dr-04/modules/mod-ustawa-spory-zbiorowe | ✅ OK |
| Ustawa o związkach zawodowych | Dz.U. 2022 poz. 854 ze zm. | dr-04/modules/mod-ustawa-zwiazki-zawodowe | ✅ OK |
| Ustawa o zwolnieniach grupowych | Dz.U. 2024 poz. 61 ze zm. | dr-04/modules/mod-ustawa-zwolnienia-grupowe | ✅ OK |
| Ustawa Aktywny Rodzic (świadczenia rodzicielskie) | Dz.U. 2023 poz. 2760 ze zm. | dr-04/modules/mod-ustawa-aktywny-rodzic | ✅ OK |
| Ustawa o świadczeniu uzupełniającym (500+ dla niepełnosprawnych) | Dz.U. 2023 poz. 1456 ze zm. | dr-04/modules/mod-ustawa-swiadczenie-uzupelniajace-500 | ✅ OK |
| Ustawa o ochronie konkurencji (aspekt pracowniczy) | Dz.U. 2024 poz. 1221 ze zm. | dr-04/modules/mod-ustawa-ochrona-konkurencji-konsumentow | ✅ OK |

## DR-05 — Prawo Administracyjne i Sądownictwo Administracyjne

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| KPA (kanonik) | Dz.U. 2025 poz. 1691 ze zm. | → DR-04/mod-KPA-kpa-i-postepowanie-adm | 🔗 odesłanie |
| PPSA (kanonik) | Dz.U. 2026 poz. 143 ze zm. | → DR-04/mod-KPA-kpa-i-postepowanie-adm | 🔗 odesłanie |
| Ordynacja podatkowa | Dz.U. 2026 poz. 622 (t.j. 25.05.2026) | → DR-06/mod-OP-podatkowe-szczegolowy | 🔗 odesłanie |
| UDIP — dostęp do informacji publicznej | Dz.U. 2022 poz. 902 ze zm. | dr-05/modules/mod-UDIP-dostep-informacji-publicznej | ✅ OK |
| Ustawa o skargach na przewlekłość | Dz.U. 2016 poz. 1259 ze zm. | dr-05/modules/mod-ustawa-skargi-na-przewleklosc-postepowania | ✅ OK |
| UPEA — egzekucja administracyjna | Dz.U. 2026 poz. 532 (t.j.) | dr-05/modules/mod-UPEA-egzekucja-administracyjna | ✅ OK |
| Ustawa o cudzoziemcach (framework) | Dz.U. 2025 poz. 1079 ze zm. | dr-05/modules/mod-ustawa-cudzoziemcy-framework | ✅ OK |
| Ustawa o cudzoziemcach (pobyt i praca) | Dz.U. 2025 poz. 1079 ze zm. | dr-05/modules/mod-ustawa-cudzoziemcy-pobyt-praca | ✅ OK |
| Ustawa o cudzoziemcach (szczegółowy) | Dz.U. 2025 poz. 1079 ze zm. | dr-05/modules/mod-ustawa-cudzoziemcy-szczegolowy | ✅ OK |
| Ustawa o Rzeczniku Praw Obywatelskich | Dz.U. 2024 poz. 1264 ze zm. | dr-05/modules/mod-ustawa-RPO | ✅ OK |
| Ustawa o samorządowych kolegiach odwoławczych (SKO) | Dz.U. 2023 poz. 825 ze zm. | dr-05/modules/mod-ustawa-SKO | ✅ OK |
| Ustawa o kontroli w administracji rządowej | Dz.U. 2020 poz. 224 ze zm. | dr-05/modules/mod-ustawa-kontrola-administracji | ✅ OK |
| Ustawa o petycjach | Dz.U. 2018 poz. 870 ze zm. | dr-05/modules/mod-ustawa-petycje | ✅ OK |
| Zaskarzanie decyzji reprywatyzacyjnych / art. 156 KPA | Dz.U. 2021 poz. 1706 + Dz.U. 2021 poz. 795 | dr-05/modules/mod-ustawa-zaskarzanie-decyzji-wlasnosci | ✅ OK |

## DR-06 — Podatki, Finanse Publiczne, AML

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| PIT + CIT + VAT (framework) | Dz.U. 2026 poz. 592 (PIT) + Dz.U. 2026 poz. 554 (CIT) + Dz.U. 2024 poz. 361 (VAT) | dr-06/modules/mod-PIT-CIT-VAT-podatki-dochodowe-i-obrotowe | ✅ OK |
| Ordynacja podatkowa | Dz.U. 2026 poz. 622 (t.j. 25.05.2026) | dr-06/modules/mod-OP-podatkowe-szczegolowy | ✅ OK |
| UFP — finanse publiczne + NIK + RIO | Dz.U. 2024 poz. 1530 ze zm. | dr-06/modules/mod-UFP-finanse-publiczne-NIK-RIO | ✅ OK |
| KAS — kontrola celno-skarbowa | Dz.U. 2023 poz. 615 ze zm. | dr-06/modules/mod-KAS-kontrola-celno-skarbowa | ✅ OK |
| Ustawa akcyzowa + UCC (cło) | Dz.U. 2025 poz. 126 + Rozp. 952/2013 | dr-06/modules/mod-ustawa-akcyzowa-i-clo-UCC | ✅ OK |
| Ustawa AML (aspekt instytucji obowiązanych) | Dz.U. 2025 poz. 644 t.j. | dr-06/modules/mod-ustawa-AML-instytucje-obowiazkowe | ✅ OK |
| Prawo bankowe | Dz.U. 2024 poz. 1646 ze zm. | dr-06/modules/mod-prawo-bankowe | ✅ OK |
| Ustawa o grach hazardowych | Dz.U. 2023 poz. 227 ze zm. | dr-06/modules/mod-ustawa-gry-hazardowe | ✅ OK |
| Ustawa o obligacjach i instrumentach finansowych | Dz.U. 2022 poz. 2218 ze zm. | dr-06/modules/mod-ustawa-obligacje-i-instrumenty-fin | ✅ OK |
| Ustawa o nadzorze KNF | Dz.U. 2024 poz. 136 ze zm. | dr-06/modules/mod-ustawa-KNF-nadzor | ✅ OK |
| Ustawa o BFG | Dz.U. 2024 poz. 487 ze zm. | dr-06/modules/mod-ustawa-BFG | ✅ OK |
| Ustawa o PCC | Dz.U. 2024 poz. 295 ze zm. | dr-06/modules/mod-ustawa-PCC | ✅ OK |
| Ustawa o podatku od spadków i darowizn | Dz.U. 2024 poz. 596 ze zm. | dr-06/modules/mod-ustawa-podatek-spadkow-darowizn | ✅ OK |
| Ustawa o podatkach i opłatach lokalnych | Dz.U. 2023 poz. 70 ze zm. | dr-06/modules/mod-ustawa-podatek-nieruchomosci | ✅ OK |
| Ustawa o ryczałcie od przychodów ewidencjonowanych | Dz.U. 2022 poz. 2540 ze zm. | dr-06/modules/mod-ustawa-ryczalt-przychody | ✅ OK |
| Ustawa o funduszach inwestycyjnych + TFI | Dz.U. 2024 poz. 1034 t.j. | dr-06/modules/mod-ustawa-fundusze-inwestycyjne | ✅ OK |
| Ustawa o usługach płatniczych | Dz.U. 2024 poz. 30 ze zm. | dr-06/modules/mod-ustawa-uslugi-platnicze | ✅ OK |
| Ustawa o CIT — szczegółowy | Dz.U. 2026 poz. 554 (t.j. 27.03.2026) | dr-06/modules/mod-ustawa-CIT-szczegolowy | ✅ OK |
| Ustawa o PIT — szczegółowy | Dz.U. 2026 poz. 592 (t.j. 17.04.2026) | dr-06/modules/mod-ustawa-PIT-szczegolowy | ✅ OK |
| Ustawa o VAT — szczegółowy | Dz.U. 2024 poz. 361 ze zm. | dr-06/modules/mod-ustawa-VAT-szczegolowy | ✅ OK |

## DR-07 — Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Prawo zamówień publicznych (PZP) | Dz.U. 2024 poz. 1320 ze zm. | dr-07/modules/mod-PZP-prawo-zamowien-publicznych | ✅ OK |
| PZP — compliance SWZ/OPZ | Dz.U. 2024 poz. 1320 ze zm. | dr-07/modules/mod-PZP-compliance-SWZ-OPZ | ✅ OK |
| PZP — zamówienia obronne i bezpieczeństwa | Dz.U. 2024 poz. 1320 ze zm. | → DR-15/mod-PZP-zamowienia-obronne-bezpieczenstwa | 🔗 odesłanie |
| Ustawa o PPP | Dz.U. 2023 poz. 1688 ze zm. | dr-07/modules/mod-ustawa-PPP-partnerstwo-publiczno-prywatne | ✅ OK |
| Ustawa o zasadach realizacji programów UE 2021-2027 | Dz.U. 2024 poz. 1655 ze zm. | dr-07/modules/mod-ustawa-fundusze-UE-2021-2027 | ✅ OK |
| Ustawa o postępowaniu w sprawach pomocy publicznej | Dz.U. 2023 poz. 702 ze zm. | dr-07/modules/mod-ustawa-polityka-rozwoju | ✅ OK |
| Ustawa o RIO | Dz.U. 2023 poz. 1325 ze zm. | dr-07/modules/mod-ustawa-RIO-regionalne-izby | ✅ OK |
| Ustawa o finansach publicznych | → DR-06/mod-UFP-finanse-publiczne-NIK-RIO | → DR-06 | 🔗 odesłanie |
| KPC cz. V — arbitraż i mediacja | Dz.U. 2026 poz. 468 ze zm. | dr-07/modules/mod-ustawa-arbitraz-mediacja-KPC-czesc5 | ✅ OK |
| Prawo o notariacie + rejestry | Dz.U. 2026 poz. 614 t.j. | dr-07/modules/mod-PrNotariat-notariat-rejestry | ✅ OK |
| Ustawa o NIK | Dz.U. 2022 poz. 623 ze zm. | dr-07/modules/mod-ustawa-NIK | ✅ OK |
| Ustawa o Prokuratorii Generalnej RP | Dz.U. 2023 poz. 1109 ze zm. | dr-07/modules/mod-ustawa-Prokuratorii-Generalnej | ✅ OK |
| Ustawa o dyscyplinie finansów publicznych | Dz.U. 2021 poz. 289 ze zm. | dr-07/modules/mod-ustawa-dyscyplina-finansow-publicznych | ✅ OK |
| Ustawa o koncesji na roboty budowlane lub usługi | Dz.U. 2023 poz. 140 ze zm. | dr-07/modules/mod-ustawa-koncesja-roboty | ✅ OK |

## DR-08–DR-14, DR-16 — patrz lokalne MAPA-AKTOW.md w każdym DR-skill.

## DR-15 — Compliance, ISO, Governance, Audyt

| Akt prawny / norma | Źródło | Moduł | Status |
|---|---|---|---|
| PZP — zamówienia obronne i bezpieczeństwa | Dz.U. 2024 poz. 1320 ze zm. | dr-15/modules/mod-PZP-zamowienia-obronne-bezpieczenstwa | ✅ OK |
| Ustawa AML — nadzór finansowy (instytucje obowiązane) | Dz.U. 2025 poz. 644 t.j. | dr-15/modules/mod-AML-nadzor-finansowy-instytucje | ✅ OK |
| Ustawa — nauczyciele i uczelnie (compliance pracodawcy) | Dz.U. 2023 poz. 984 + Dz.U. 2024 poz. 1571 | dr-15/modules/mod-ustawa-nauczyciele-uczelnie | ✅ OK |
| ISO 37001:2016 — Anti-bribery management | Norma ISO | dr-15/modules/mod-ISO-37001-antykorupcja | ✅ OK |
| ISO 37301:2021 — Compliance management systems | Norma ISO | dr-15/modules/mod-ISO-37301-compliance-management | ✅ OK |
| ISO 27001:2022 — Information security management | Norma ISO | dr-15/modules/mod-ISO-27001-bezpieczenstwo-informacji | ✅ OK |
| ISO 42001:2023 — AI management system | Norma ISO | dr-15/modules/mod-ISO-42001-AI-management | ✅ OK |
| DORA — compliance sektor finansowy | Rozp. UE 2022/2554 | dr-15/modules/mod-DORA-compliance-sektor-finansowy | ✅ OK |
| Ustawa o ochronie sygnalistów | Dz.U. 2024 poz. 928 ze zm. | dr-15/modules/mod-ustawa-sygnalisci | ✅ OK |
