# DR-10 — Lokalna Mapa Aktów Prawnych

## Zdrowie, Farmacja, Żywność, Rolnictwo

| Akt prawny | Dz.U. (t.j.) | Moduł | Status |
|---|---|---|---|
| Prawo farmaceutyczne | Dz.U. 2026 poz. 612 t.j. | mod-PrFarm-prawo-farmaceutyczne | ✅ OK |
| Prawo farmaceutyczne — szczegółowy | Dz.U. 2026 poz. 612 t.j. | mod-PrFarm-szczegolowy | ✅ OK |
| GIF/GIS/WIF — nadzór farmaceutyczny i sanitarny | Dz.U. 2026 poz. 612 t.j. (Prawo farmaceutyczne, GIF) + ⚠️ GIS: Dz.U. 2024 poz. 416 t.j. (POPRAWKA 2026-07-02y — BYŁO błędnie 2023.394; ustawa o Państwowej Inspekcji Sanitarnej, obwieszczenie 11.03.2024) | mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny | ⚠️ WYMAGA AKTUALIZACJI MODUŁU (GIS) |
| Rozp. REACH + CLP — chemikalia | Rozp. (WE) 1907/2006 + Rozp. (WE) 1272/2008 | mod-REACH-CLP-chemikalia | ✅ OK |
| Ustawa o działalności leczniczej + prawa pacjenta | Dz.U. 2024 poz. 799 + Dz.U. 2024 poz. 581 | mod-ustawa-dzialalnosc-lecznicza-pacjent | ✅ OK |
| Prawo medyczne — prawa pacjenta framework (RPP) | Dz.U. 2024 poz. 581 t.j. ✅ VER: 2026-06-14 (TRYB DZU — confirmed aktualny; uwaga: nowelizacja 2026/26 art.23, sprawdzić czy konsolidowana) | mod-ustawa-prawa-pacjenta-framework | ✅ OK |
| Prawo medyczne — szczegółowy (ustawa o działalności leczniczej) | Dz.U. 2026 poz. 156 t.j. ✅ VER: 2026-06-14 (TRYB DZU — był 2024/799; nowszy t.j. 2025/450 i 2026/156 znalezione, 2026/156 z 05.02.2026 jest aktualny) | mod-ustawa-medyczne-szczegolowy | ✅ OK |
| Ustawa o świadczeniach zdrowotnych — NFZ | Dz.U. 2025 poz. 1461 t.j. — VER 2026-07-02s: nadal aktualne (obwieszczenie 26.09.2025) | mod-ustawa-NFZ-swiadczenia | ✅ OK |
| ⛔ Ustawa o izbach lekarskich (samorząd zawodowy, odpowiedzialność zawodowa/dyscyplinarna lekarzy — Okręgowy Sąd Lekarski + Naczelny Sąd Lekarski) | Dz.U. 2021 poz. 1342 t.j. (ostatni potwierdzony; ustawa z 2.12.2009 r.) — ⚠️ DODANO 2026-07-02 jako NOWA POZYCJA, całkowicie brakująca w mapie do tej sesji, wykryta przy okazji weryfikacji sądów dyscyplinarnych na żądanie użytkownika. Rozdział 5 "Odpowiedzialność zawodowa" art. 53-112 | ⛔ BRAK MODUŁU DEDYKOWANEGO — sprawdzić czy odpowiedzialność zawodowa lekarzy jest w ogóle omówiona w istniejących modułach medycznych dr-10 | ⛔ NOWA POZYCJA — LUKA SYSTEMOWA |
| ⛔ Ustawa o samorządzie pielęgniarek i położnych (Okręgowy Sąd Pielęgniarek i Położnych + Naczelny Sąd Pielęgniarek i Położnych) | Dz.U. 2025 poz. 1760 t.j. (ustawa z 1.07.2011 r.) — ⚠️ DODANO 2026-07-02, DRUGI z rzędu przypadek CAŁKOWICIE brakującego aktu w mapie dr-10 (ten sam wzorzec co ustawa o izbach lekarskich powyżej). Rozdział 6 "Odpowiedzialność zawodowa" art. 36-88 | ⛔ BRAK MODUŁU DEDYKOWANEGO | ⛔ NOWA POZYCJA — LUKA SYSTEMOWA (DRUGI PRZYPADEK) |

### ⛔⛔ POTWIERDZONY WZORZEC SYSTEMOWY (2 z 2 dotychczas sprawdzonych zawodów medycznych)

Zarówno dla lekarzy, jak i pielęgniarek/położnych, mapa dr-10 śledziła
WYŁĄCZNIE: (a) ustawę "o zawodzie" (regulującą wykonywanie zawodu) oraz
(b) kodeks etyki — ale POMIJAŁA CAŁKOWICIE odrębną ustawę "o samorządzie"
/ "o izbach", która ustanawia strukturę organizacyjną samorządu ORAZ sądy
dyscyplinarne. To sugeruje, że TEN SAM wzorzec luki może występować dla
POZOSTAŁYCH zawodów medycznych w dr-10 (farmaceuta, weterynarz, diagnosta
laboratoryjny) — wymaga systematycznego sprawdzenia, nie tylko przy okazji
zapytań o sądy dyscyplinarne.
| Ustawa o jakości w opiece zdrowotnej i bezpieczeństwie pacjenta | Dz.U. 2023 poz. 1692 ze zm. — VER 2026-07-02t: nadal aktualne (ustawa z 16.06.2023, w życie 8.09.2023) | mod-ustawa-jakosc-opieka-zdrowotna | ✅ OK |
| Ustawa o ochronie zdrowia psychicznego | Dz.U. 2024 poz. 917 ze zm. — VER 2026-07-02t: nadal aktualne (obwieszczenie 14.06.2024) | mod-ustawa-zdrowie-psychiczne | ✅ OK |
| Ustawa o zawodzie lekarza i lekarza dentysty | Dz.U. 2026 poz. 37 t.j. | mod-ustawa-zawod-lekarza | ✅ OK |
| Ustawa o zawodach pielęgniarki i położnej | Dz.U. 2025 poz. 450 t.j. | mod-ustawa-pielegniarka-polozna | ✅ OK |
| Ustawa o diagnostyce laboratoryjnej (obecnie: ustawa o medycynie laboratoryjnej) | ⛔ POPRAWKA 2026-07-02ooo: znaleziono JESZCZE NOWSZY t.j. — **Dz.U. 2023 poz. 2125** (nowszy niż 2022.2280 potwierdzony wcześniej tego dnia w sesji 2026-07-02s — ta wcześniejsza poprawka była krokiem we właściwym kierunku, ale niewystarczającym; łańcuch: 2022.2162 [stary akt, BŁĘDNIE cytowany] → 2022.2280 [t.j. nowego aktu] → 2023.2125 [kolejny t.j.]). Rozdział 7 "Odpowiedzialność zawodowa": **Sąd Diagnostów Laboratoryjnych** (I instancja) → **Wyższy Sąd Diagnostów Laboratoryjnych** (II instancja) → kasacja do Sądu Najwyższego możliwa. Organ samorządu: Krajowa Izba Diagnostów Laboratoryjnych (KIDL) — potwierdzone, że NIE zmienił nazwy | mod-ustawa-diagnostyka-laboratoryjna | ⚠️ WYMAGA KOLEJNEJ AKTUALIZACJI MODUŁU (numer t.j. zmienił się drugi raz w tej samej sesji) |
| Ustawa o wyrobach medycznych | Dz.U. 2022 poz. 974 ze zm. — VER 2026-07-02r: nadal aktualne (ustawa z 7.04.2022, brak nowszego t.j.) | mod-wyroby-medyczne | ✅ OK |
| Ustawa o produktach biobójczych | Dz.U. 2021 poz. 24 ze zm. — VER 2026-07-02t: nadal aktualne (obwieszczenie 2.12.2020) | mod-ustawa-produkty-biobojcze | ✅ OK |
| Ustawa Prawo oświatowe + szkolnictwo wyższe | ⚠️ Prawo oświatowe: Dz.U. 2025 poz. 1043 t.j. (POPRAWKA 2026-07-02u — BYŁO błędnie 2024.737, obwieszczenie 25.07.2025) + Prawo o szkolnictwie wyższym i nauce: Dz.U. 2024 poz. 1571 t.j. — VER 2026-07-02v: nadal aktualne (obwieszczenie 11.09.2024) | mod-ustawa-oswiata-szkolnictwo-wyzsze | ⚠️ WYMAGA AKTUALIZACJI MODUŁU (tylko Prawo oświatowe) |
| Ustawa o sporcie + turystyce + imprezach masowych | ⚠️ Sport: Dz.U. 2026 poz. 95 t.j. (POPRAWKA 2026-07-02v) + ⚠️ NIEJASNOŚĆ 2026-07-02w: mapa cytuje "Dz.U. 2022 poz. 2189" dla turystyki/imprez masowych, ale weryfikacja wykazała, że ustawa o bezpieczeństwie imprez masowych ma t.j. **Dz.U. 2022 poz. 1466** (obwieszczenie 9.06.2022) — inny numer. Możliwe, że 2022.2189 dotyczy WYŁĄCZNIE turystyki (nie zweryfikowano tego osobno), a wiersz łączy dwa różne akty pod jednym numerem. WYMAGA rozdzielenia na dwa osobne wiersze i weryfikacji każdego z osobna w kolejnej sesji | mod-ustawa-sport-turystyka-imprezy-masowe | ⚠️ WYMAGA ROZDZIELENIA I DOMKNIĘCIA |
| Ustawa o edukacji specjalnej + dostępności | ⚠️ Prawo oświatowe (rozdział): Dz.U. 2025 poz. 1043 t.j. (POPRAWKA 2026-07-02u) + ⚠️ Dostępność (ustawa o zapewnianiu dostępności osobom ze szczególnymi potrzebami): Dz.U. 2024 poz. 1411 t.j. (POPRAWKA 2026-07-02x — BYŁO błędnie 2022.2240) | mod-ustawa-edukacja-specjalna-dostepnosc | ⚠️ WYMAGA AKTUALIZACJI MODUŁU (oba składniki) |
| Ustawa o rolnictwie, żywności i weterynarii | ⚠️ NIEJEDNOZNACZNE 2026-07-02y: mapa cytuje Dz.U. 2024 poz. 1284 dla zbiorczego wiersza obejmującego kilka możliwych aktów (moduł mod-AH wymienia bez konkretnych numerów: ustawę o jakości handlowej artykułów rolno-spożywczych, ustawę o ARiMR/PROW/WPR). Weryfikacja wykazała, że **ustawa o jakości handlowej artykułów rolno-spożywczych ma t.j. Dz.U. 2023 poz. 1980** (obwieszczenie 2.08.2023) — INNY numer niż cytowany w mapie. Nie ustalono jednoznacznie, czy 2024.1284 to pomyłka, czy odnosi się do zupełnie innego aktu z tej wielotematycznej grupy (np. ustawy o ARiMR, nieszukanej osobno w tej sesji). WYMAGA dedykowanej sesji z rozbiciem tego zbiorczego wiersza na osobne, precyzyjnie nazwane akty — nie do rozstrzygnięcia jednym zapytaniem ze względu na wieloznaczność samej nazwy wiersza | mod-AH-rolne-zywnosc-weterynaria | ⚠️ WYMAGA ROZBICIA NA OSOBNE AKTY (zadanie strukturalne, nie tylko weryfikacja numeru) |
| Ustawa o bezpieczeństwie żywności i żywienia | Dz.U. 2023 poz. 1448 ze zm. — VER 2026-07-02t: nadal aktualne (obwieszczenie 25.05.2023) + zm. 2025.1424 (nieujęta wcześniej) | mod-ustawa-bezpieczenstwo-zywnosci | ✅ OK |
| Ustawa o Inspekcji Weterynaryjnej | Dz.U. 2024 poz. 12 t.j. — VER 2026-07-02u: nadal aktualne (obwieszczenie 7.12.2023) | mod-ustawa-inspekcja-weterynaryjna | ✅ OK |
| Zawody medyczne i prawnicze (ustawy korporacyjne) | ⚠️ NIEJEDNOZNACZNE 2026-07-02y: mapa cytuje zbiorczo "Dz.U. 2024 poz. 1564 + analogiczne" dla wielu odrębnych zawodów. Weryfikacja treści modułu wykazała, że moduł mod-ustawa-zawody-medyczne-i-prawnicze.md (nazwa faktyczna: mod-CG-zawody-prawnicze-i-pokrewne.md) dotyczy WYŁĄCZNIE zawodów prawniczych pokrewnych (doradcy podatkowi, rzecznicy patentowi, syndycy, mediatorzy) i sam jawnie wskazuje, że większość z nich ma już DEDYKOWANE moduły w innych DR-skillach z własnymi, konkretnymi numerami Dz.U. (dr-12, dr-06, dr-02) — a NIE dotyczy w ogóle zawodów medycznych, mimo nazwy wiersza w mapie sugerującej inaczej. Jeden zbiorczy numer "2024.1564" dla całej tej grupy jest strukturalnie niepoprawny — różne zawody mają różne, odrębne akty. ✅ ROZSTRZYGNIĘTE CZĘŚCIOWO 2026-07-02eee (sesja dr-12, ten sam dzień): potwierdzono krzyżowo, że **2024.1564 to konkretnie i wyłącznie t.j. Prawa o adwokaturze**, potwierdzony aktualny w dr-12/MAPA-AKTOW.md — czyli źródłem pomyłki było potraktowanie numeru JEDNEGO zawodu (adwokat) jako rzekomo zbiorczego dla wielu. WYMAGA nadal rozbicia wiersza na osobne pozycje per zawód, z usunięciem mylącego odniesienia do "zawodów medycznych" z nazwy | mod-ustawa-zawody-medyczne-i-prawnicze (błędnie nazwany plik, treść = zawody prawnicze pokrewne) | ⚠️ WYMAGA PRZEBUDOWY STRUKTURALNEJ (nazwa pliku myląca; źródło numeru 1564 już wyjaśnione) |
| Ustawa o izbach aptekarskich (zawód, zawód zaufania publicznego) | Dz.U. 2025 poz. 1693 t.j. ✅ VER: 2026-06-14 | mod-ustawa-aptekarz-zawod | ✅ NOWY |
| Ustawa o zawodzie lekarza weterynarii i izbach lekarsko-weterynaryjnych (zawód zaufania publicznego) | Dz.U. 2026 poz. 125 t.j. ✅ VER: 2026-06-14 | mod-ustawa-lekarz-weterynarii-zawod | ✅ NOWY |
| Ustawa o zawodzie psychologa oraz samorządzie zawodowym psychologów (NOWA, Dz.U. 2026 poz. 187, w życie 19.05.2028) + ustawa z 2001 r. (Dz.U. 2019 poz. 1026, obecnie faktycznie obowiązująca — samorząd nigdy nie powstał) ✅ VER: 2026-06-14 — ⚠️ STAN PRZEJŚCIOWY | mod-ustawa-psycholog-zawod | ✅ NOWY |

> Źródło weryfikacji: isap.sejm.gov.pl | mz.gov.pl
> Aktualizacja: 2026-07-02y (TRYB DZU krok 5/16 wg WARN-26, PRECYZYJNIE
> DOMKNIĘTY: 15 z ~24 pozycji w pełni zweryfikowane [63%], 5 błędów CRIT
> naprawionych łącznie w kroku 5 [diagnostyka laboratoryjna, Prawo oświatowe
> x2, sport, dostępność, GIS]. 3 pozostałe zbiorcze wiersze precyzyjnie
> udokumentowane jako STRUKTURALNIE NIEJEDNOZNACZNE (nie do rozstrzygnięcia
> samą weryfikacją numeru — wymagają rozbicia na osobne akty w przyszłej
> sesji): rolnictwo/żywność/weterynaria, zawody medyczne i prawnicze
> (błędnie nazwany moduł), sport/turystyka/imprezy masowe (możliwe pomieszanie
> dwóch aktów). Krok 5/16 uznaje się za KOMPLETNIE opracowany na tym etapie —
> pozostałe pozycje wymagają decyzji strukturalnej, nie tylko weryfikacji
