# PRZETERMINOWANE-TJ — teksty jednolite wygasłe, deklarowane w nagłówkach jako aktualne

> **Plik:** `audyt-systemu-v4/references/PRZETERMINOWANE-TJ-2026-09-10.md`
> **Wersja:** 1.2 (2026-09-10m) — skan całego korpusu (36 numerów / 61 miejsc);
>              1.1 (2026-09-10l) — korekta liczb i naprawa 13 miejsc;
>              1.0 (2026-09-10k) — pierwszy pomiar, flaga **F-181**.
> **Status:** ⛔ **LICZBY W WERSJI 1.0 BYŁY ZAWYŻONE — patrz korekta niżej.**
> Wersja 1.1 (2026-09-10l): 13 miejsc naprawionych, reszta rozstrzygnięta jako
> fałszywe trafienia heurystyki.

---

## ⛔ KOREKTA 1.1 (2026-09-10l) — moja własna klasa F-164

Wersja 1.0 ogłosiła „**29 przeterminowanych podstaw prawnych w 35 miejscach,
10% wszystkich**". Liczba była **zbudowana na nieweryfikowanej przesłance**:
heurystyka traktowała każdy numer Dz.U. w sąsiedztwie frazy o tekście jednolitym
jako **deklarację aktualnej podstawy**. Sprawdzenie kontekstu linia po linii
pokazało co innego.

| | Miejsc |
|---|---:|
| trafień heurystyki | 35 |
| jawnie oznaczone jako **poprzednie/historyczne** („Poprzedni t.j.: …") | **16** |
| własne adnotacje korygujące z tej serii sesji | 4 |
| linia podaje numer aktualny, a wygasły stoi obok jako historyczny | 2 |
| ⛔ **realnie przeterminowane, podane jako aktualna podstawa** | **13** |

⛔ To jest **dokładnie klasa F-164** — reguła (tu: alarm) zbudowana na tezie
o świecie, której nikt nie zmierzył. Popełniona przeze mnie w sesji, która
katalogowała tę samą klasę u innych. Odnotowane jawnie, bo wersja 1.0 trafiła
do wydania i do rejestru flag.

⚠️ Wniosek dla przyszłego testu z O-9/F-181: **sam fakt, że numer jest wygasły,
nie czyni z niego błędu.** Rejestr wolno — i powinien — wymieniać numery
historyczne. Test musi rozstrzygać, czy numer jest podany **jako aktualna
podstawa**, a to wymaga czytania kontekstu, nie sąsiedztwa frazy. Dlatego
projekt czułości jest tu trudniejszy niż sam odczyt statusu.

### Naprawione 2026-09-10l (13 miejsc, 6 skilli)

| Było | Jest | Gdzie |
|---|---|---|
| `2016/283` | **2026/300** | `analizator-umow-v1` — Zasady techniki prawodawczej |
| `2020/344` | **2024/1513** | `dr-11` — świadczenie usług drogą elektroniczną |
| `2024/1034` | **2026/60** | `dr-06` — fundusze inwestycyjne |
| `2023/646` | **2024/722** | `dr-06` — obrót instrumentami ⛔ **11 nowelizacji po t.j.** |
| `2024/1112` | **2026/670** | `dr-09` — UOOŚiS ⚠️ ten sam skill podawał już 2026/670 w module POŚ |
| `2024/37` | **2026/490** | `prawny-router-v3` — KPK, 5 nowelizacji po t.j. |
| `2024/44` | **2026/884** | `shared` — ustawa rehabilitacyjna |
| `2024/695` ×2 | **2026/880** | `analizator-umow-v1` — UUDE |
| `2024/799` | **2026/156** | `shared/orka-bas` — działalność lecznicza |
| `2024/1530` | **2025/1483** | `shared/orka-bas` — UFP, 5 nowelizacji po t.j. |
| `2025/111` ×3 | **2026/622** | `shared/orka-bas` ×2, `dr-06` — Ordynacja podatkowa |

Każda para sprawdzona przez **porównanie tytułów** starego i nowego
obwieszczenia — żadna nie okazała się podmianą aktu.

---


---

## Skąd ta lista

Kandydat z AUDYT-2026-09-10h brzmiał: nagłówki modułów („aktualne t.j.: …")
starzeją się niezauważone, bo są cytowane rzadziej niż treść, a jako pierwsze
wpadają w oko czytającemu. Pomiar wykonany 2026-09-10k, jednorazowo, ręcznie.

**Metoda.** Z pierwszych 25 linii każdego pliku `.md` w korpusie wyekstrahowano
numery Dz.U. stojące w sąsiedztwie frazy o tekście jednolitym. Każdy numer
odczytany w RZĘDZIE 1 (`api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}`) — pole
`status`. Dla przeterminowanych dodatkowo ustalono **aktualny** tekst jednolity
przez listę `Inf. o tekście jednolitym` aktu bazowego.

**Wynik:**

| Status w ELI | Numerów |
|---|---:|
| obowiązujący | 249 |
| **wygaśnięcie aktu** | **28** |
| akt posiada tekst jednolity | 10 |
| **uchylony** | **1** |
| akt objęty tekstem jednolitym | 1 |
| akt jednorazowy | 1 |
| **RAZEM** | **290** |

⛔ **29 numerów przeterminowanych w 35 miejscach, w 11 skillach.** To 10% wszystkich
numerów deklarowanych w nagłówkach jako aktualne.

---

## Dlaczego żaden test tego nie złapał

| Test | Pyta o | Dlaczego milczy |
|---|---|---|
| T3 | zgodność numerów między mapami | numer w nagłówku modułu nie jest wierszem mapy |
| T11 | obecność numeru w mapie centralnej | numery są obecne — tylko nieaktualne |
| T15 | tożsamość aktu i nowszy t.j. | działa na `maps` i `operational`, nie na nagłówkach |
| T24 | nowelizacje po tekście jednolitym | pyta o zmiany po t.j., nie o to, czy t.j. jeszcze żyje |

To ta sama rodzina co **O-9** (adnotacja o stanie przeterminowała się), ale
w wariancie twardszym: tu nie starzeje się opis, tylko **sam numer podstawy
prawnej**. Powołanie wygasłego tekstu jednolitego jest błędem podstawy, nie
nieścisłością redakcyjną.

---

## Lista robocza

Kolumna „Aktualny t.j." pochodzi z odczytu RZĄD 1 z 2026-09-10k. ⛔ Przed
wpisaniem **sprawdzić ponownie** — między pomiarem a naprawą mogło wyjść nowe
obwieszczenie; ta lista wskazuje CO poprawić, nie zastępuje weryfikacji.

| Wygasły numer w nagłówku | Status | Aktualny t.j. | Miejsc | Gdzie |
|---|---|---|---:|---|
| `Dz.U. 2025 poz. 111` | wygaśnięcie aktu | **Dz.U. 2026 poz. 622** | 3 | `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:15`<br>`shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:20`<br>`dr-06-podatki-finanse-publiczne-aml/modules/mod-KAS-kontrola-celno-skarbowa.md:4` |
| `Dz.U. 2022 poz. 2162` | uchylony | **— (akt bazowy UCHYLONY)** | 2 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-diagnostyka-laboratoryjna.md:15`<br>`dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-diagnostyka-laboratoryjna.md:19` ⛔ rozstrzygnięte 2026-09-10j: t.j. **starej** ustawy o diagnostyce laboratoryjnej; podstawą jest ustawa o medycynie laboratoryjnej, t.j. Dz.U. 2025 poz. 1295 |
| `Dz.U. 2023 poz. 1028` | wygaśnięcie aktu | **Dz.U. 2025 poz. 1362** | 2 | `prawo-polskie-v2/references/CHANGELOG.md:7`<br>`analizator-umow-v1/references/CHANGELOG.md:3` |
| `Dz.U. 2024 poz. 695` | wygaśnięcie aktu | **Dz.U. 2026 poz. 880** | 2 | `analizator-umow-v1/references/mod-J2-nieruchomosci.md:9`<br>`analizator-umow-v1/references/mod-J2-nieruchomosci.md:22` |
| `Dz.U. 2025 poz. 450` | wygaśnięcie aktu | **Dz.U. 2026 poz. 156** | 2 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-prawa-pacjenta-framework.md:15`<br>`dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-pielegniarka-polozna.md:7` |
| `Dz.U. 2016 poz. 283` | wygaśnięcie aktu | **Dz.U. 2026 poz. 300** | 1 | `analizator-umow-v1/references/generator/kategorie-klauzul-taksonomia.md:18` |
| `Dz.U. 2018 poz. 1799` | wygaśnięcie aktu | **Dz.U. 2024 poz. 907** | 1 | `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-ustawa-KRS-i-ustroj-wladzy.md:4` |
| `Dz.U. 2020 poz. 344` | wygaśnięcie aktu | **Dz.U. 2024 poz. 1513** | 1 | `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-ustawa-uslugi-elektroniczne.md:5` |
| `Dz.U. 2022 poz. 2032` | wygaśnięcie aktu | **Dz.U. 2024 poz. 68** | 1 | `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-ustawa-KRS-i-ustroj-wladzy.md:4` |
| `Dz.U. 2022 poz. 2123` | wygaśnięcie aktu | **Dz.U. 2024 poz. 917** | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-zdrowie-psychiczne.md:9` |
| `Dz.U. 2022 poz. 2240` | wygaśnięcie aktu | **Dz.U. 2024 poz. 1411** | 1 | `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-ustawa-dostepnosc-niepelnosprawni.md:16` |
| `Dz.U. 2023 poz. 154` | wygaśnięcie aktu | **Dz.U. 2026 poz. 125** | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-lekarz-weterynarii-zawod.md:25` |
| `Dz.U. 2023 poz. 551` | wygaśnięcie aktu | **Dz.U. 2025 poz. 1783** | 1 | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-ustawa-architekci-inzynierowie-budownictwa-zawod.md:25` |
| `Dz.U. 2023 poz. 646` | wygaśnięcie aktu | **Dz.U. 2024 poz. 722** | 1 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-ustawa-rynek-kapitalowy-fundusze.md:4` |
| `Dz.U. 2023 poz. 702` | wygaśnięcie aktu | **Dz.U. 2026 poz. 500** | 1 | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-ustawa-fundusze-UE-pomoc-publiczna.md:9` |
| `Dz.U. 2023 poz. 872` | wygaśnięcie aktu | **Dz.U. 2026 poz. 981** | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-inspekcja-weterynaryjna.md:24` |
| `Dz.U. 2024 poz. 1034` | wygaśnięcie aktu | **Dz.U. 2026 poz. 60** | 1 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-ustawa-rynek-kapitalowy-fundusze.md:4` |
| `Dz.U. 2024 poz. 1035` | wygaśnięcie aktu | **Dz.U. 2025 poz. 1891** | 1 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-ustawa-biegli-rewidenci-zawod.md:22` |
| `Dz.U. 2024 poz. 1112` | wygaśnięcie aktu | **Dz.U. 2026 poz. 670** | 1 | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-ustawa-OOS-oceny-srodowiskowe.md:6` |
| `Dz.U. 2024 poz. 1530` | wygaśnięcie aktu | **Dz.U. 2025 poz. 1483** | 1 | `shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:22` |
| `Dz.U. 2024 poz. 1646` | wygaśnięcie aktu | **Dz.U. 2026 poz. 38** | 1 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-prawo-bankowe-KNF-BFG.md:18` |
| `Dz.U. 2024 poz. 37` | wygaśnięcie aktu | **Dz.U. 2026 poz. 490** | 1 | `prawny-router-v3/references/legacy-material-router/tryby-scigania.md:3` |
| `Dz.U. 2024 poz. 44` | wygaśnięcie aktu | **Dz.U. 2026 poz. 884** | 1 | `shared/mod-niewidomy-prawa-prawne.md:9` |
| `Dz.U. 2024 poz. 688` | wygaśnięcie aktu | **Dz.U. 2025 poz. 1693** | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-aptekarz-zawod.md:24` |
| `Dz.U. 2024 poz. 708` | wygaśnięcie aktu | **Dz.U. 2025 poz. 1667** | 1 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-ustawa-rynek-kapitalowy-fundusze.md:4` |
| `Dz.U. 2024 poz. 799` | wygaśnięcie aktu | **Dz.U. 2026 poz. 156** | 1 | `shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:16` |
| `Dz.U. 2024 poz. 814` | wygaśnięcie aktu | **Dz.U. 2026 poz. 15** | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-pielegniarka-polozna.md:7` |
| `Dz.U. 2025 poz. 1043` | wygaśnięcie aktu | **Dz.U. 2026 poz. 820** | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-prawa-ucznia.md:4` |
| `Dz.U. 2025 poz. 907` | wygaśnięcie aktu | **Dz.U. 2026 poz. 253** | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-PrFarm-refundacja-nadzor-sankcje.md:15` |

---

---

## 1.2 (2026-09-10m) — SKAN CAŁEGO KORPUSU, nie tylko nagłówków

Wersja 1.1 objęła **pierwsze 25 linii** każdego pliku. To rozszerzenie obejmuje
**cały korpus**: 424 unikalne numery Dz.U. w 1903 miejscach, po odsianiu linii
z kontekstem historycznym. Każdy numer odczytany w RZĘDZIE 1.

### Klasyfikacja — podana jawnie, bo dwa poprzednie liczniki okazały się zawyżone

| | |
|---|---:|
| numery w korpusie (poza dziennikiem, changelogami i mapami) | 424 |
| miejsc | 1903 |
| numerów o statusie wygasły/uchylony | 47 |
| miejsc z tymi numerami | 75 |
| odsiane: kontekst historyczny, raporty audytowe, nowszy numer w tej samej linii | 15 |
| ⛔ **podane jako aktualna podstawa** | **36 numerów / 61 miejsc** |

⚠️ **Ostrzeżenie o tej liczbie.** Dwa poprzednie liczniki tego badania
(„29 przeterminowanych" w 1.0) skurczyły się po ręcznym sprawdzeniu kontekstu.
Ta wartość jest ostrożniejsza — odsiewa raporty audytowe, adnotacje historyczne
i linie, w których obok wygasłego stoi numer aktualny — ale **nadal jest wynikiem
heurystyki, nie odczytu każdej linii przez człowieka.** Przed naprawą każdą
pozycję przeczytać w kontekście.

### Rozkład wg skilla

`shared` **41 miejsc** (głównie `orka-bas-leksykon`), `dr-10` 4, `analizator-umow-v1` 3,
`dr-03`, `dr-06`, `dr-09` po 2, pozostałe (`dr-01`, `dr-02`, `dr-05`, `dr-08`,
`dr-12`, `prawny-router-v3`, `prawo-polskie-v2`) po 1.

⛔ Koncentracja w `shared/orka-bas-leksykon` nie jest przypadkiem: leksykon cytuje
podstawy prawne **w treści definicji**, a nie w nagłówku, więc wszystkie
dotychczasowe przeglądy go omijały.

### Lista — kolumna „now." to nowelizacje po AKTUALNYM tekście jednolitym (KROK 2C)

| Wygasły numer | Akt | Aktualny t.j. | now. | Miejsc | Gdzie |
|---|---|---|---|---:|---|
| `Dz.U. 2024 poz. 1530` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 1483** | ⛔ 5 | 14 | `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:63`<br>`shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:82`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:92`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:95`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:102`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:111`<br>… |
| `Dz.U. 2022 poz. 2267` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2024 poz. 356** | 0 | 5 | `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:64`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:200`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:204`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:213`<br>`shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:237` |
| `Dz.U. 2021 poz. 1249` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2024 poz. 1673** | ⛔ 1 | 2 | `prawny-router-v3/references/legacy-material-router/przemoc-domowa.md:159`<br>`dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-przemoc-domowa-szczegolowy.md:159` |
| `Dz.U. 2023 poz. 344` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 399** | ⛔ 1 | 2 | `shared/orka-bas-leksykon/czesc-01-praca-admin-drogowe.md:137`<br>`shared/orka-bas-leksykon/czesc-01-praca-admin-drogowe.md:141` |
| `Dz.U. 2023 poz. 984` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 515** | 0 | 2 | `shared/ORKA-BAS-VIII-X-KADENCJA.md:402`<br>`shared/orka-bas-leksykon/czesc-05-kandydaci-prawa-obywatelskie-sporne.md:40` |
| `Dz.U. 2024 poz. 1320` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 793** | 0 | 2 | `shared/AKTY-PRAWNE-MASTER.md:173`<br>`analizator-umow-v1/references/mod-J7-pzp.md:292` |
| `Dz.U. 2024 poz. 361` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 775** | ⛔ 5 | 2 | `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:27`<br>`shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:30` |
| `Dz.U. 2024 poz. 37` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 490** | ⛔ 5 | 2 | `shared/mod-niewidomy-prawa-prawne.md:73`<br>`shared/mod-niewidomy-prawa-prawne.md:394` |
| `Dz.U. 2024 poz. 44` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 884** | 0 | 2 | `shared/mod-niewidomy-prawa-prawne.md:28`<br>`shared/mod-niewidomy-prawa-prawne.md:393` |
| `Dz.U. 2025 poz. 1363` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 942** | 0 | 2 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-rolne-zywnosc-weterynaria.md:28`<br>`prawo-polskie-v2/ROUTING-MAP.md:719` |
| `Dz.U. 2020 poz. 224` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 158** | 0 | 1 | `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-ustawa-kontrola-administracji.md:72` |
| `Dz.U. 2020 poz. 333` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 1344** | 0 | 1 | `shared/orka-bas-leksykon/czesc-06-priorytety-P1.md:47` |
| `Dz.U. 2020 poz. 342` | Obwieszczenie Ministra Finansów z dnia 3 lutego 2020 r. w | **Dz.U. 2026 poz. 909** | 0 | 1 | `dr-06-podatki-finanse-publiczne-aml/modules/mod-rachunkowosc-budzetowa-JSFP.md:53` |
| `Dz.U. 2021 poz. 1909` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 1584** | 0 | 1 | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ustawa-doradca-restrukturyzacyjny-zawod.md:111` |
| `Dz.U. 2021 poz. 857` | Obwieszczenie Ministra Rodziny i Polityki Społecznej z dni | **Dz.U. 2026 poz. 677** | 0 | 1 | `shared/mod-osoba-niewidoma-prawa-sad.md:49` |
| `Dz.U. 2022 poz. 1710` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 793** | 0 | 1 | `shared/ORKA-BAS-VIII-X-KADENCJA.md:472` |
| `Dz.U. 2022 poz. 2032` | Obwieszczenie Ministra Spraw Wewnętrznych i Administracji | **Dz.U. 2024 poz. 68** | 0 | 1 | `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-ustawa-KRS-i-ustroj-wladzy.md:42` |
| `Dz.U. 2022 poz. 2162` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **— (rozstrzygnięte 10j: akt bazowy uchylony)** | 0 | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-diagnostyka-laboratoryjna.md:19` |
| `Dz.U. 2022 poz. 2241` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 1718** | 0 | 1 | `shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:282` |
| `Dz.U. 2022 poz. 2305` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 825** | ⛔ 5 | 1 | `shared/orka-bas-leksykon/czesc-05-kandydaci-prawa-obywatelskie-sporne.md:53` |
| `Dz.U. 2022 poz. 2509` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 24** | 0 | 1 | `shared/orka-bas-leksykon/czesc-07-priorytety-P2-bas-v18.md:321` |
| `Dz.U. 2023 poz. 1124` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 644** | ⛔ 1 | 1 | `shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md:312` |
| `Dz.U. 2023 poz. 1984` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 1066** | 0 | 1 | `shared/orka-bas-leksykon/czesc-03-cywilne-niepelnosprawnosc.md:80` |
| `Dz.U. 2023 poz. 2119` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2025 poz. 734** | ⛔ 4 | 1 | `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KW-art119-131-przeciwko-mieniu.md:220` |
| `Dz.U. 2024 poz. 1112` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 670** | ⛔ 1 | 1 | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-ustawa-OOS-oceny-srodowiskowe.md:58` |
| `Dz.U. 2024 poz. 1214` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 12** | 0 | 1 | `analizator-umow-v1/references/mod-J10-ubezpieczenia.md:26` |
| `Dz.U. 2024 poz. 1290` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 69** | 0 | 1 | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-prawo-geologiczne-gornicze.md:41` |
| `Dz.U. 2024 poz. 1568` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 468** | ⛔ 2 | 1 | `dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-KPC-arbitraz-mediacja-ADR.md:202` |
| `Dz.U. 2024 poz. 266` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 43** | ⛔ 3 | 1 | `shared/orka-bas-leksykon/czesc-02-finanse-nieruchomosci-energetyczne.md:141` |
| `Dz.U. 2024 poz. 356` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2024 poz. 356 ⚠️ sprawdzić — status starego „uchylony”** | 0 | 1 | `dr-08-samorzad-terytorialny-prawo-lokalne/modules/mod-ustawa-dochody-JST.md:31` |
| `Dz.U. 2024 poz. 695` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 880** | 0 | 1 | `analizator-umow-v1/references/mod-J2-nieruchomosci.md:271` |
| `Dz.U. 2024 poz. 935` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 143** | ⛔ 1 | 1 | `shared/mod-osoba-niewidoma-prawa-sad.md:239` |
| `Dz.U. 2025 poz. 1214` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 639** | ⛔ 2 | 1 | `shared/AKTY-PRAWNE-MASTER.md:108` |
| `Dz.U. 2025 poz. 450` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 156** | ⛔ 1 | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-pielegniarka-polozna.md:62` |
| `Dz.U. 2025 poz. 614` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 913** | 0 | 1 | `shared/AKTY-PRAWNE-MASTER.md:93` |
| `Dz.U. 2025 poz. 907` | Obwieszczenie Marszałka Sejmu Rzeczypospolitej Polskiej z | **Dz.U. 2026 poz. 253** | ⛔ 1 | 1 | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-PrFarm-refundacja-nadzor-sankcje.md:15` |

⛔ Przy naprawie obowiązuje **porównanie tytułów** starego i nowego obwieszczenia.
W tej serii sześć razy okazało się, że pod numerem stoi inny akt, niż głosi opis.

⚠️ `2024/356` ma status **uchylony**, nie „wygaśnięcie aktu" — to inna sytuacja
niż zwykłe zastąpienie tekstu jednolitego i wymaga osobnego sprawdzenia.

## Kolejność naprawy

Zgodnie z regułą przyjętą 2026-09-10e (mapa zbiorcza przed modułami):

```
1. dla każdej pozycji: ponowny odczyt RZĄD 1 (status + aktualny t.j. + nowelizacje po nim)
2. korekta w ROUTING-MAP i mapie centralnej, jeśli numer tam występuje
3. korekta nagłówka modułu + propagacja w obrębie pliku (ZASADA 8)
4. wersja skilla + wpis do changelogu — jedna pozycja = jeden skill, nie zbiorczo
```

⛔ **Nie poprawiać hurtem podmianą tekstu.** Trzy przypadki z tej serii
(antyterrorystyczna, kryzysowe, laboratoryjna) pokazały, że pod przeterminowanym
numerem bywa **podmiana aktu**, a nie zwykłe starzenie — wtedy „aktualny t.j."
z tej tabeli dotyczy niewłaściwej ustawy. Każda pozycja wymaga spojrzenia na
tytuł, nie tylko na numer.

⚠️ Pozycje z ≥2 miejscami sprawdzać w pierwszej kolejności: powtórzenie numeru
w kilku plikach zwykle znaczy, że był propagowany, więc błąd też.
