# DR-11 — Lokalna Mapa Aktów Prawnych

## Cyfrowe, cyberbezpieczeństwo, AI, dane, IP

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia korekt, dawne nazwy aktów, zamknięte flagi i opisy sesji audytowych pozostają poza runtime.

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| RODO / GDPR | rozporządzenie (UE) 2016/679 | `mod-RODO-GDPR-2016-679` + `mod-RODO-szczegolowy` | ✅ aktywny; EUR-Lex fresh gate |
| RODO — DPIA | jw. | `mod-RODO-DPIA-ocena-skutkow` | ✅ aktywny |
| RODO — DSAR / prawa podmiotów danych | jw. | `mod-RODO-DSAR-zadania-osob` | ✅ aktywny |
| RODO — RCP / DPA | jw. | `mod-RODO-RCP-DPA-rejestr-powierzenie` | ✅ aktywny |
| Ustawa o ochronie danych osobowych | Dz.U. 2019 poz. 1781 t.j. ze zm.; po t.j.: Dz.U. 2026 poz. 252 art. 16 (od 3.04.2026) i 2026 poz. 548 art. 38 (ustawa o zarządzaniu danymi, od 23.07.2026), 2026 poz. 1003 art. 123 (ustawa o systemach AI: art. 59a — współpraca Prezesa UODO z Komisją Rozwoju i Bezpieczeństwa SI, od 11.08.2026) — ELI 2026-10-31 | `mod-UODO-postepowanie-ochrona-danych` | ✅ aktywny; fresh gate |
| Krajowy System Cyberbezpieczeństwa / NIS2 | Dz.U. 2026 poz. 20 t.j.; po t.j. (ELI 2026-10-12): 2026/252, 2026/815 (w mocy 4.07.2026), 2026/1003, 2026/1206 | `mod-KSC-NIS2-cyberbezpieczenstwo-telekom` | ✅ aktywny; fresh gate |
| DORA / eIDAS 2.0 | rozporządzenie (UE) 2022/2554 + rozporządzenie (UE) 2024/1183 | `mod-DORA-eIDAS-cyfrowe-finanse` | ✅ aktywny; EUR-Lex fresh gate |
| Prawo komunikacji elektronicznej + poczta + UKE | Dz.U. 2024 poz. 1221 (brak t.j.); zm. (ELI 2026-10-12): 2025/637, 2025/820, 2026/252, 2026/815 (w mocy 4.07.2026), 2026/1296 + właściwe akty pocztowe | `mod-PrTelekom-poczta-UKE` | ✅ aktywny; fresh gate |
| Prawo autorskie i prawa pokrewne | Dz.U. 2025 poz. 24 t.j. ze zm. (m.in. 2026/1296 art. 4 — art. 22¹ ust. 3, od 6.11.2026) | `mod-PrAut-wlasnosc-intelektualna-IP` | 🟢 B+/COV |
| Prawo autorskie — media / internet / dobra osobiste | jw. | `mod-PrAut-media-internet-dobra-osobiste` | ✅ aktywny |
| AI Act + krajowy reżim systemów AI | rozporządzenie (UE) 2024/1689 + Dz.U. 2026 poz. 1003 ze zm. | `mod-AI-Act-framework` | ✅ aktywny; temporal/EUR-Lex fresh gate |
| Digital Markets Act | rozporządzenie (UE) 2022/1925 | `mod-DMA-digital-markets-act` | ✅ aktywny |
| Digital Services Act | rozporządzenie (UE) 2022/2065 | `mod-DSA-digital-services-act` | ✅ aktywny |
| CRA / EUCS / Data Act / Data Governance Act | właściwe akty UE, w tym rozporządzenie (UE) 2024/2847 | `mod-EUCS-CRA-akty-regulacyjne-UE` | ✅ aktywny; EUR-Lex fresh gate |
| MiCA | rozporządzenie (UE) 2023/1114 | `mod-MiCA-kryptoaktywa` | ✅ aktywny; EUR-Lex fresh gate |
| Informatyzacja podmiotów publicznych | Dz.U. 2026 poz. 1241 t.j. ze zm. | `mod-ustawa-informatyzacja-podmiotow-publicznych` | ✅ aktywny |
| KSeF — routing podatkowo-cyfrowy | bieżący reżim ustawy o VAT + akty wykonawcze | `mod-ustawa-informatyzacja-podmiotow-publicznych` + routing DR-06 | ✅ aktywny; temporal gate |
| Otwarte dane i ponowne wykorzystywanie | Dz.U. 2023 poz. 1524 t.j. ze zm. | `mod-ustawa-otwarte-dane` | ✅ aktywny |
| Usługi zaufania / identyfikacja elektroniczna / eIDAS | Dz.U. 2024 poz. 1725 t.j. ze zm. + rozporządzenie (UE) nr 910/2014 ze zm. | `mod-ustawa-podpis-elektroniczny` | ✅ aktywny; EUR-Lex fresh gate |
| Prawo własności przemysłowej | Dz.U. 2023 poz. 1170 t.j. ze zm. (m.in. 2026/1296 art. 5 — art. 296 ust. 3, od 6.11.2026) | `mod-ustawa-prawo-wlasnosci-przemyslowej` | ✅ aktywny |
| Świadczenie usług drogą elektroniczną | Dz.U. 2024 poz. 1513 t.j. ze zm.; ⚡ **2026/1296** (implementacja DSA, w mocy 6.11.2026): uchylony rozdz. 3 (art. 12–15), koordynator — Prezes UKE, organy, skarga, sąd okręgowy, kary do 6% obrotu ✅ [VER] RZĄD 1 2026-10-20 (ELI DU/2026/1296 text.pdf) | `mod-ustawa-uslugi-elektroniczne` | ✅ aktywny; fresh gate |
| Krajowy system certyfikacji cyberbezpieczeństwa | Dz.U. 2025 poz. 1017 ze zm. | `mod-ustawa-certyfikacja-cyberbezpieczenstwa` | ✅ aktywny |

## Reguły runtime

- każdy fizyczny moduł DR-11 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- mapy nie przechowują poprzednich numerów, dawnych nazw ustaw, opisów napraw ani zamkniętych flag;
- dla prawa UE, cyberbezpieczeństwa, AI, telekomunikacji i KSeF obowiązuje fresh/temporal gate przed użyciem konkretnej jednostki, daty lub obowiązku;
- status runtime wskazuje routing, nie `FULL` artykuł-po-artykule.
