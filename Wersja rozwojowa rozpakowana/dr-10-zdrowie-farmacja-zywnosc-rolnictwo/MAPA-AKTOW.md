# DR-10 — Lokalna Mapa Aktów Prawnych

## Zdrowie, farmacja, żywność, rolnictwo

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia korekt, dawne numery, zamknięte flagi i przyszłe akty niewchodzące jeszcze w życie nie są warstwą runtime.

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Prawo farmaceutyczne | Dz.U. 2026 poz. 612 t.j. ze zm. | `mod-PrFarm-prawo-farmaceutyczne` + `mod-PrFarm-szczegolowy` | ✅ aktywny; fresh gate |
| Prawo farmaceutyczne — refundacja / nadzór / sankcje + ustawa refundacyjna | PrFarm jw. + Dz.U. 2026 poz. 253 t.j. ze zm. | `mod-PrFarm-refundacja-nadzor-sankcje` | ✅ aktywny |
| GIF / WIF / GIS — nadzór farmaceutyczny i sanitarny | PrFarm jw. + Państwowa Inspekcja Sanitarna: Dz.U. 2024 poz. 416 t.j. ze zm. | `mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny` | ✅ aktywny |
| Choroby rzadkie / leki sieroce | aktualny dokument programowy MZ + rozporządzenie (WE) nr 141/2000 | `mod-rzadkie-choroby-genetyczne-plan-leki-sieroce` | ✅ aktywny; fresh gate programu |
| REACH / CLP — chemikalia | rozporządzenie (WE) nr 1907/2006 + rozporządzenie (WE) nr 1272/2008 | `mod-REACH-CLP-chemikalia` | ✅ aktywny; EUR-Lex fresh gate |
| Ustawa o działalności leczniczej | Dz.U. 2026 poz. 156 t.j. ze zm. | `mod-ustawa-dzialalnosc-lecznicza-pacjent` + `mod-ustawa-medyczne-szczegolowy` | ✅ aktywny |
| Ustawa o prawach pacjenta i Rzeczniku Praw Pacjenta | Dz.U. 2024 poz. 581 t.j. ze zm. | `mod-ustawa-prawa-pacjenta-framework` + `mod-rzecznik-praw-pacjenta-RPP` | ✅ aktywny |
| Ustawa o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych | Dz.U. 2025 poz. 1461 t.j. ze zm. | `mod-ustawa-NFZ-swiadczenia` | ✅ aktywny |
| Ustawa o jakości w opiece zdrowotnej i bezpieczeństwie pacjenta | Dz.U. 2023 poz. 1692 ze zm. | `mod-ustawa-jakosc-opieka-zdrowotna` | ✅ aktywny |
| Ustawa o ochronie zdrowia psychicznego | Dz.U. 2024 poz. 917 t.j. ze zm. | `mod-ustawa-zdrowie-psychiczne` | ✅ aktywny |
| Ustawa o zawodach lekarza i lekarza dentysty | Dz.U. 2026 poz. 37 t.j. ze zm. | `mod-ustawa-zawod-lekarza` | ✅ aktywny |
| Ustawa o izbach lekarskich | Dz.U. 2021 poz. 1342 t.j. ze zm. | `mod-ustawa-zawod-lekarza` — odpowiedzialność zawodowa | ✅ aktywny |
| Ustawa o zawodach pielęgniarki i położnej | Dz.U. 2026 poz. 15 t.j. ze zm. | `mod-ustawa-pielegniarka-polozna` | ✅ aktywny |
| Ustawa o samorządzie pielęgniarek i położnych | Dz.U. 2025 poz. 1760 t.j. ze zm. | `mod-ustawa-pielegniarka-polozna` — odpowiedzialność zawodowa | ✅ aktywny |
| Ustawa o medycynie laboratoryjnej | Dz.U. 2025 poz. 1295 t.j. ze zm. | `mod-ustawa-diagnostyka-laboratoryjna` | ✅ aktywny |
| Ustawa o wyrobach medycznych | Dz.U. 2022 poz. 974 ze zm. | `mod-wyroby-medyczne` | ✅ aktywny; fresh gate |
| Ustawa o produktach biobójczych | Dz.U. 2021 poz. 24 t.j. ze zm. | `mod-ustawa-produkty-biobojcze` | ✅ aktywny |
| Prawo oświatowe | Dz.U. 2026 poz. 820 t.j. ze zm. | `mod-ustawa-oswiata-szkolnictwo-wyzsze` + `mod-prawa-ucznia` | ✅ aktywny; temporal gate zmian po t.j. |
| Prawo o szkolnictwie wyższym i nauce | Dz.U. 2024 poz. 1571 t.j. ze zm. | `mod-ustawa-oswiata-szkolnictwo-wyzsze` | ✅ aktywny |
| Edukacja specjalna / dostępność | Prawo oświatowe jw. + Dz.U. 2024 poz. 1411 t.j. | `mod-ustawa-edukacja-specjalna-dostepnosc` | ✅ aktywny |
| Ustawa o sporcie | Dz.U. 2026 poz. 95 t.j. ze zm. | `mod-ustawa-sport-turystyka-imprezy-masowe` | ✅ aktywny |
| Ustawa o bezpieczeństwie imprez masowych | Dz.U. 2023 poz. 616 t.j. ze zm. | `mod-ustawa-sport-turystyka-imprezy-masowe` | ✅ aktywny |
| Ustawa o imprezach turystycznych i powiązanych usługach turystycznych | Dz.U. 2026 poz. 925 t.j. ze zm. | `mod-ustawa-sport-turystyka-imprezy-masowe` | ✅ aktywny |
| Ustawa o jakości handlowej artykułów rolno-spożywczych / IJHARS | Dz.U. 2023 poz. 1980 t.j. ze zm. | `mod-ustawa-rolne-zywnosc-weterynaria` | ✅ aktywny |
| ARiMR / WPR / PROW | właściwe akty bieżące | `mod-ustawa-rolne-zywnosc-weterynaria` | ✅ aktywny; fresh gate |
| Ustawa o bezpieczeństwie żywności i żywienia | Dz.U. 2023 poz. 1448 t.j. ze zm. | `mod-ustawa-bezpieczenstwo-zywnosci` | ✅ aktywny |
| Ustawa o Inspekcji Weterynaryjnej | Dz.U. 2024 poz. 12 t.j. ze zm. | `mod-ustawa-inspekcja-weterynaryjna` | ✅ aktywny |
| Zdrowie / hodowla / dobrostan zwierząt | właściwe ustawy krajowe i akty UE obowiązujące na dzień sprawy | `mod-ustawa-hodowla-zdrowie-zwierzat` | ✅ aktywny; fresh gate |
| Zezwolenia hodowlane / gatunki / gatunki inwazyjne | właściwe ustawy krajowe + CITES / rozporządzenie (WE) nr 338/97 | `mod-ustawa-hodowla-zezwolenia-gatunki` | ✅ aktywny; fresh gate |
| Ustawa o izbach aptekarskich | Dz.U. 2025 poz. 1693 t.j. ze zm. | `mod-ustawa-aptekarz-zawod` | ✅ aktywny |
| Ustawa o zawodzie lekarza weterynarii i izbach lekarsko-weterynaryjnych | Dz.U. 2026 poz. 125 t.j. ze zm. | `mod-ustawa-lekarz-weterynarii-zawod` | ✅ aktywny |
| Psycholog — aktualnie obowiązujący reżim zawodowy | akt obowiązujący na dzień sprawy; przyszłej ustawy nie stosować przed jej wejściem w życie | `mod-ustawa-psycholog-zawod` | ✅ aktywny; temporal gate |
| Zawody prawnicze pokrewne występujące w sprawach DR-10 | właściwe ustawy korporacyjne | `mod-ustawa-zawody-prawnicze-pokrewne` + routing DR-12/DR-06 | ✅ routing |

## Reguły runtime

- akty przyszłe, projekty, dawne błędy numerów i zamknięte flagi nie są wpisami stanu bieżącego; ich miejsce to monitoring i dziennik audytowy;
- w prawie farmaceutycznym, sanitarnym, oświatowym, weterynaryjnym, żywnościowym oraz dla dynamicznych aktów UE zawsze obowiązuje fresh gate przed podaniem konkretnego przepisu, daty, strefy, wymogu lub wyjątku;
- `MAPA-AKTOW.md` nie zastępuje `MAPA-POKRYCIA.md`: wskazuje routing, nie stopień kompletności treści.
