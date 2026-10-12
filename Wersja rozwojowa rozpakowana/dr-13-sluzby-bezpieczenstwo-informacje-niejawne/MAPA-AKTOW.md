# DR-13 — Lokalna Mapa Aktów Prawnych

## Służby, bezpieczeństwo, informacje niejawne

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia korekt numerów, zamknięte flagi i opisy sesji audytowych pozostają poza runtime.

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Ustawa o Policji | Dz.U. 2025 poz. 636 t.j. z późn. zm. (po t.j. (ELI 2026-10-12) 12 zmian, m.in. 2026/646, 2026/815 w mocy 4.07.2026, 2026/1281) | `mod-ustawa-policja` | ✅ aktywny; fresh gate |
| Ustawa o Straży Granicznej | Dz.U. 2026 poz. 367 t.j. z późn. zm. (po t.j. (ELI 2026-10-12): 2026/646, 2026/815 w mocy 4.07.2026, 2026/821, 2026/864, 2026/1123, 2026/1281) | `mod-ustawa-straz-graniczna` | ✅ aktywny; fresh gate |
| Ustawa o Żandarmerii Wojskowej | Dz.U. 2026 poz. 159 t.j.; po t.j. (ELI 2026-10-12): 2026/815 (w mocy 4.07.2026), 2026/1281 | `mod-ustawa-zandarmeria-wojskowa` | ✅ aktywny |
| Ustawa o ABW oraz AW | Dz.U. 2026 poz. 937 t.j. ze zm. | `mod-ustawa-ABW-AW-CBA-sluzby-specjalne` | ✅ aktywny; fresh gate |
| Ustawa o CBA | Dz.U. 2025 poz. 712 t.j. ze zm. | `mod-ustawa-ABW-AW-CBA-sluzby-specjalne` | ✅ aktywny |
| Ustawa o SOP | Dz.U. 2025 poz. 34 t.j. z późn. zm. (po t.j. (ELI 2026-10-12) 9 zmian, m.in. 2026/646, 2026/815 w mocy 4.07.2026, 2026/1281) | `mod-ustawa-ABW-AW-CBA-sluzby-specjalne` | ✅ aktywny |
| Ustawa o SKW oraz SWW | Dz.U. 2026 poz. 157 t.j. ze zm. | `mod-ustawa-SKW-SWW` | ✅ aktywny; fresh gate |
| Ustawa o ochronie informacji niejawnych | Dz.U. 2025 poz. 1209 t.j. ze zm. | `mod-ustawa-informacje-niejawne` | ✅ aktywny |
| Ustawa o obronie Ojczyzny | Dz.U. 2025 poz. 825 t.j. z późn. zm. (po t.j. (ELI 2026-10-12): 2025/1014, 2025/1080, 2026/26, 2026/426, 2026/635, 2026/815 w mocy 4.07.2026, 2026/1123) | `mod-ustawa-obrona-ojczyzny-mobilizacja` | ✅ aktywny; fresh gate |
| Ustawa o ochronie ludności i obronie cywilnej | Dz.U. 2024 poz. 1907 (brak t.j.); zm. (ELI 2026-10-12): 2025/1705, 2026/646, 2026/815 (w mocy 4.07.2026) | `mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna` | ✅ aktywny; fresh gate |
| Program Ochrony Ludności i Obrony Cywilnej 2025–2026 | M.P. 2025 poz. 541 | `mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna` | ✅ aktywny; programowy fresh gate |
| KOZZiD — osoby z zaburzeniami psychicznymi stwarzające zagrożenie | Dz.U. 2022 poz. 1689 t.j. ze zm. | `mod-ustawa-szczegolne-srodki-zabezpieczajace` | ✅ aktywny |
| Ustawa o środkach przymusu bezpośredniego i broni palnej | Dz.U. 2026 poz. 244 t.j.; po t.j. (ELI 2026-10-12): 2026/737, 2026/815 (w mocy 4.07.2026) | `mod-ustawa-policja` | ✅ aktywny; fresh gate |
| Prawo komunikacji elektronicznej — retencja danych / działania służb | Dz.U. 2024 poz. 1221 (brak t.j.); zm. (ELI 2026-10-12): 2025/637, 2025/820, 2026/252, 2026/815 (w mocy 4.07.2026), 2026/1296 | `mod-ustawa-sluzby-operacyjne-retencja-danych` + routing DR-11 | ✅ aktywny; fresh gate |
| Ustawa o Państwowej Straży Pożarnej | Dz.U. 2025 poz. 1312 t.j. ze zm. | `mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa` | ✅ aktywny |
| Ustawa o ochronie przeciwpożarowej | Dz.U. 2025 poz. 188 t.j.; po t.j. (ELI 2026-10-12): 2026/815 (w mocy 4.07.2026) | `mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa` | ✅ aktywny |
| Ustawa o ochotniczych strażach pożarnych | Dz.U. 2025 poz. 244 t.j. ze zm. | `mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa` | ✅ aktywny |
| Ustawa o broni i amunicji | Dz.U. 2024 poz. 485 t.j. ze zm. | `mod-BronAmunU-pozwolenia-cofniecie-strzelnice` | ✅ aktywny; temporal/fresh gate |

## Reguły runtime

- każdy fizyczny moduł DR-13 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- mapy nie przechowują dawnych numerów, opisów napraw, zamkniętych WARN/F-N ani historii sesji;
- przy służbach mundurowych, obronności, broni i retencji danych zawsze sprawdzaj nowelizacje po t.j. przed użyciem konkretnej jednostki;
- status runtime wskazuje aktywne routowanie, a nie kompletność artykuł-po-artykule.
