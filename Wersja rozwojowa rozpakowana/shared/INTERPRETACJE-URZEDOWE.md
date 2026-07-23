# INTERPRETACJE-URZEDOWE — Rejestr oficjalnych źródeł interpretacji prawa per dziedzina

## Cel

ISAP (akty prawne) i portale orzecznictwa (sn.pl, nsa.gov.pl, orzeczenia.ms.gov.pl,
trybunal.gov.pl, curia.europa.eu, hudoc.echr.coe.int) pokrywają WARSTWĘ LEGISLACYJNĄ
i ORZECZNICZĄ. Dla prawa miejscowego i aktów jednostek z własnym reżimem (gmina,
powiat, samorządy zawodowe, uczelnie, regulatorzy) źródłem równoważnym są: dzienniki
urzędowe województw, BIP właściwego organu/jednostki, rejestry urzędowe, statuty,
regulaminy, uchwały, zarządzenia i akty nadzorcze — weryfikuj online, nigdy z pamięci.

Ten moduł uzupełnia trzecią warstwę: **oficjalne interpretacje, wytyczne, stanowiska
i wyjaśnienia organów administracji i regulatorów** — istotne przy ocenie praktyki
stosowania prawa (jak organ faktycznie interpretuje przepis), niezależnie od linii
orzeczniczej sądów.

## Zasada

Każdy moduł DR przy analizie powołującej się na praktykę administracyjną organu
(a nie tylko na sam przepis/wyrok) powinien — jeśli to istotne dla sprawy — sprawdzić
także właściwy organ interpretacyjny z listy poniżej. Lazy loading: wczytuj tylko
wiersz właściwy dla dziedziny sprawy. Status interpretacji organu ≠ status wyroku —
zawsze zaznacz, czy źródło to interpretacja administracyjna (niewiążąca sądu) czy
orzeczenie.

## Rejestr per DR

| DR | Dziedzina | Dodatkowe źródła interpretacji urzędowej |
|---|---|---|
| DR-01 | Ustrój konstytucyjny, źródła prawa | `rcl.gov.pl` (Rządowe Centrum Legislacji — projekty, OSR, uzasadnienia), `rpo.gov.pl` (wystąpienia generalne RPO) |
| DR-02 | Cywilne, rodzinne, gospodarcze | `rf.gov.pl` (Rzecznik Finansowy — interpretacje w sporach konsumenckich finansowych/ubezpieczeniowych), `uokik.gov.pl` (decyzje, wyjaśnienia, rejestr klauzul niedozwolonych), `ekrs.ms.gov.pl` (KRS — wpisy, dokumenty spółek) |
| DR-03 | Karne, wykroczenia, egzekucja | `gov.pl/web/prokuratura-krajowa` (wytyczne i komunikaty Prokuratury Krajowej), `komornik.pl` (Krajowa Izba Komornicza — wytyczne egzekucyjne) |
| DR-04 | Praca, ZUS, świadczenia | `zus.pl` (interpretacje indywidualne ZUS — art. 34 Prawa przedsiębiorców, patrz `dr-04/mod-SUS-ZUS-ubezpieczenia-spoleczne.md` ANEKS D), `pip.gov.pl` (Państwowa Inspekcja Pracy — stanowiska prawne + NOWE interpretacje indywidualne GIP wg art. 14b ustawy o PIP, patrz `dr-04/mod-ustawa-PIP-inspekcja-pracy.md` §6.1), `gov.pl/web/rodzina` (MRPiPS — interpretacje KP, świadczenia rodzinne) |
| DR-05 | Administracyjne, sądowoadministracyjne | `rpo.gov.pl` (wystąpienia RPO w sprawach administracyjnych), `gov.pl` (BIP właściwego ministerstwa — wyjaśnienia KPA) |
| DR-06 | Podatki, finanse publiczne, AML | *(już szeroko pokryte: interpretacje.podatki.gov.pl, eureka)* + `gov.pl/web/finanse` (komunikaty MF), `gov.pl/web/finanse/giif` (GIIF — interpretacje AML/przeciwdziałanie praniu pieniędzy) |
| DR-07 | Zamówienia publiczne, fundusze UE | *(już: uzp.gov.pl, kio.gov.pl)* + `funduszeeuropejskie.gov.pl` (interpretacje wytycznych kwalifikowalności UE), `gov.pl/web/uokik` (pomoc publiczna — decyzje i wyjaśnienia) |
| DR-08 | Samorząd terytorialny, prawo lokalne | `rio.gov.pl` (Regionalne Izby Obrachunkowe — rozstrzygnięcia nadzorcze ws. budżetów i uchwał JST), BIP właściwego wojewody (rozstrzygnięcia nadzorcze wojewody) |
| DR-09 | Budownictwo, środowisko, energia, transport | `gunb.gov.pl` (Główny Urząd Nadzoru Budowlanego — wyjaśnienia Prawa budowlanego), `gdos.gov.pl` (Generalna Dyrekcja Ochrony Środowiska — wytyczne OOŚ/Natura 2000), `ure.gov.pl` (Urząd Regulacji Energetyki — interpretacje, decyzje), `utk.gov.pl` (Urząd Transportu Kolejowego — decyzje regulacyjne, interpretacje prawa kolejowego), `gios.gov.pl` (Główny Inspektorat Ochrony Środowiska — stanowiska IOŚ, patrz też `dr-09/mod-inspekcja-ochrony-srodowiska-GIOS-WIOS.md`) |
| DR-10 | Zdrowie, farmacja, żywność, rolnictwo | *(już: urpl.gov.pl, gif.gov.pl, mz.gov.pl)* + `gis.gov.pl` (Główny Inspektorat Sanitarny — stanowiska sanepid), `wetgiw.gov.pl` (Główny Inspektorat Weterynarii), `gov.pl/web/rpp` (Rzecznik Praw Pacjenta — stanowiska, postępowania wyjaśniające ws. praw pacjenta) |
| DR-11 | Cyfrowe, cyberbezpieczeństwo, AI, dane, IP | *(już: uodo.gov.pl — skarga do Prezesa UODO opisana w `dr-11/mod-UODO-postepowanie-ochrona-danych.md` §9, wzór: `pisma-proste-v2/SPK`; uprp.gov.pl)* + `uke.gov.pl` (Urząd Komunikacji Elektronicznej — interpretacje Prawa telekomunikacyjnego), `cert.pl` / `gov.pl/web/baza-wiedzy` (CSIRT NASK — wytyczne KSC/NIS2) |
| DR-12 | Sądownictwo, prokuratura, zawody prawnicze | `gov.pl/web/sprawiedliwosc` (komunikaty i wytyczne MS), `rpo.gov.pl`, samorządy zawodowe: `nra.pl` (adwokatura), `kirp.pl` (radcowie prawni), `kin.pl` (notariat — KRN) |
| DR-13 | Służby, bezpieczeństwo, informacje niejawne | `abw.gov.pl` (wytyczne ochrony informacji niejawnych), `gov.pl/web/sluzby-specjalne` + `gov.pl/web/policja` / BIP KGP (wytyczne, statystyki, komunikaty Komendy Głównej Policji), `zandarmeria-wojskowa.wp.mil.pl` (komunikaty ŻW), `gov.pl/web/kgpsp` (Komenda Główna PSP — wytyczne, KSRG) — ⚠️ patrz też `shared/ORZECZENIA-HIERARCHIA.md` §4 dla statusu weryfikowalności orzeczeń/dyscyplinarki sądów wojskowych, Policji i PSP (bazy niepubliczne/brak portalu — nie mylić interpretacji urzędowej z orzeczeniem) |
| DR-14 | Prawo UE, międzynarodowe, prawa człowieka | *(już szeroko pokryte: eur-lex, curia, echr, hcch)* — bez zmian |
| DR-15 | Compliance, ISO, governance, audyt | *(już: iso.org, pkn.pl)* + `uodo.gov.pl` (wytyczne RODO w compliance), `knf.gov.pl` (governance — sektor finansowy, ESG), `nik.gov.pl` (Najwyższa Izba Kontroli — wystąpienia pokontrolne, informacje o wynikach kontroli, istotne dla audytu zgodności w sektorze publicznym) |
| DR-16 | Pisma, strategia, dowody, orzecznictwo | brak dodatkowych — dziedzina metodyczna, korzysta ze źródeł DR-01…DR-15 wg sprawy |

## Status interpretacji vs orzecznictwo

- Interpretacja indywidualna / stanowisko organu → wiąże tylko adresata (np. interpretacja
  podatkowa, ZUS) lub ma charakter informacyjny (np. stanowisko PIP, GIS).
- Rozstrzygnięcie nadzorcze RIO/wojewody → wiążące dla aktu JST, zaskarżalne do WSA.
- Decyzja regulatora (URE, UKE, UOKiK, KNF, UODO) → akt administracyjny, zaskarżalny.
- W piśmie procesowym/analizie zawsze odróżnij: ⚖️ orzeczenie sądu vs 📋 interpretacja/
  stanowisko organu — różna siła wiążąca.
