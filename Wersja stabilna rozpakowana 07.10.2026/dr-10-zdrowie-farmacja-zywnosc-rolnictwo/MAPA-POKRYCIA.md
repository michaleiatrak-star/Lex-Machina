# DR-10 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze statusy nie są częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł operacyjny, ale bez pełnego audytu rozdziałowego;
- ⚠️ — zakres wymagający aktualizacji lub pogłębienia przed użyciem bezpośrednim.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| Prawo farmaceutyczne — framework | `mod-PrFarm-prawo-farmaceutyczne` | 🟡 |
| refundacja / nadzór / sankcje | `mod-PrFarm-refundacja-nadzor-sankcje` | 🟢/🟡 B+ |
| Prawo farmaceutyczne — szczegółowy | `mod-PrFarm-szczegolowy` | 🟡 |
| GIF/GIS/WIF — nadzór | `mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny` | 🟢/🟡 B+ |
| REACH / CLP — chemikalia | `mod-REACH-CLP-chemikalia` | 🟢/🟡 |
| działalność lecznicza + prawa pacjenta | `mod-ustawa-dzialalnosc-lecznicza-pacjent` | 🟡 |
| prawa pacjenta — framework | `mod-ustawa-prawa-pacjenta-framework` | 🟡 |
| Rzecznik Praw Pacjenta | `mod-rzecznik-praw-pacjenta-RPP` | 🟢/🟡 B+ |
| działalność lecznicza — szczegółowy | `mod-ustawa-medyczne-szczegolowy` | 🟡 |
| świadczenia zdrowotne / NFZ | `mod-ustawa-NFZ-swiadczenia` | 🟡 |
| jakość w opiece zdrowotnej | `mod-ustawa-jakosc-opieka-zdrowotna` | 🟡 |
| ochrona zdrowia psychicznego | `mod-ustawa-zdrowie-psychiczne` | 🟡 |
| zawód lekarza / dentysty | `mod-ustawa-zawod-lekarza` | 🟡 |
| izby lekarskie / odpowiedzialność zawodowa | `mod-ustawa-zawod-lekarza` | 🟢/🟡 B+ |
| pielęgniarka / położna | `mod-ustawa-pielegniarka-polozna` | 🟡 |
| samorząd pielęgniarek i położnych | `mod-ustawa-pielegniarka-polozna` | 🟢/🟡 B+ |
| medycyna laboratoryjna | `mod-ustawa-diagnostyka-laboratoryjna` | 🟡 |
| wyroby medyczne | `mod-wyroby-medyczne` | 🟡 |
| produkty biobójcze | `mod-ustawa-produkty-biobojcze` | 🟡 |
| Prawo oświatowe / szkolnictwo wyższe | `mod-ustawa-oswiata-szkolnictwo-wyzsze` | 🟡 |
| prawa ucznia | `mod-prawa-ucznia` | 🟢/🟡 B+ |
| sport / imprezy masowe / turystyka | `mod-ustawa-sport-turystyka-imprezy-masowe` | 🟡 |
| edukacja specjalna / dostępność | `mod-ustawa-edukacja-specjalna-dostepnosc` | 🟢/🟡 B+ |
| rolnictwo / żywność / weterynaria | moduły rolne, bezpieczeństwa żywności i inspekcji weterynaryjnej | 🟢/🟡 |
| bezpieczeństwo żywności i żywienia | `mod-ustawa-bezpieczenstwo-zywnosci` | 🟡 |
| Inspekcja Weterynaryjna | `mod-ustawa-inspekcja-weterynaryjna` | 🟡 |
| izby aptekarskie / zawód farmaceuty | `mod-ustawa-aptekarz-zawod` | 🟡 |
| lekarz weterynarii / samorząd | `mod-ustawa-lekarz-weterynarii-zawod` | 🟡 |
| psycholog / samorząd psychologów | moduł zawodów medycznych / psychologicznych | 🟡; wymaga kontroli temporalnej nowej ustawy 2026 |
| ochrona zwierząt / hodowla | `mod-ustawa-hodowla-zdrowie-zwierzat` | 🟢/🟡 B+ |

## Aktywne luki

1. Większość aktów DR-10 ma routing i realną treść, ale brak pełnego audytu rozdziałowego całych ustaw.
2. Priorytet pogłębiania: Prawo farmaceutyczne, NFZ/świadczenia zdrowotne, prawa pacjenta i zawody medyczne.
3. REACH/CLP jest kanonicznie w DR-10; akty UE wymagają świeżego EUR-Lex.
4. Przed użyciem krajowego przepisu obowiązuje świeży odczyt ELI/ISAP, szczególnie przy aktach z przyszłymi lub etapowymi terminami wejścia w życie.
