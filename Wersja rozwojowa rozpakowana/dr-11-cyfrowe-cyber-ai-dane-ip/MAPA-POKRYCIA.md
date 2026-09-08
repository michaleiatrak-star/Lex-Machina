# DR-11 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze statusy nie są częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł operacyjny, ale bez pełnego audytu całego aktu;
- 🟡 B+ — pokrycie operacyjne pogłębione;
- ⚠️ — wymaga świeżej kontroli prawnej przed użyciem.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| RODO 2016/679 — framework | `mod-RODO-GDPR-2016-679` | 🟡 |
| RODO — szczegółowy | `mod-RODO-szczegolowy` | 🟢/🟡 B+ |
| DPIA art. 35–36 | `mod-RODO-DPIA-ocena-skutkow` | 🟢/🟡 B+ |
| DSAR art. 12, 15–22 | `mod-RODO-DSAR-zadania-osob` | 🟢/🟡 B+ |
| RCP / DPA art. 30 i 28 | `mod-RODO-RCP-DPA-rejestr-powierzenie` | 🟢/🟡 B+ |
| ustawa o ochronie danych osobowych | `mod-UODO-postepowanie-ochrona-danych` | 🟢/🟡 B+ |
| KSC / NIS2 | `mod-KSC-NIS2-cyberbezpieczenstwo-telekom` | 🟢/🟡 B+ |
| DORA / eIDAS 2.0 | `mod-DORA-eIDAS-cyfrowe-finanse` | 🟢/🟡 B+ |
| Prawo komunikacji elektronicznej / UKE | `mod-PrTelekom-poczta-UKE` | 🟢/🟡 B+ |
| prawo autorskie — Dz.U. 2025 poz. 24 | `mod-PrAut-wlasnosc-intelektualna-IP` | 🟢 B+ / COV — przedmiot/podmiot, prawa osobiste i majątkowe, dozwolony użytek, czas ochrony, umowy/licencje, programy komputerowe, roszczenia i odpowiedzialność karna zmapowane |
| media / internet / dobra osobiste | `mod-PrAut-media-internet-dobra-osobiste` | 🟡 |
| AI Act + krajowy system AI | `mod-AI-Act-framework` | 🟢/🟡 B+ |
| DMA | `mod-DMA-digital-markets-act` | 🟡 |
| DSA | `mod-DSA-digital-services-act` | 🟡 |
| CRA / EUCS / Data Act / DGA | `mod-EUCS-CRA-akty-regulacyjne-UE` | 🟡 |
| MiCA | `mod-MiCA-kryptoaktywa` | 🟡 |
| informatyzacja podmiotów publicznych / KSeF | `mod-ustawa-informatyzacja-podmiotow-publicznych` | 🟢/🟡 B+ |
| otwarte dane / ponowne wykorzystanie | `mod-ustawa-otwarte-dane` | 🟡 |
| usługi zaufania / podpis elektroniczny | `mod-ustawa-podpis-elektroniczny` | 🟢/🟡 B+ |
| Prawo własności przemysłowej | `mod-ustawa-prawo-wlasnosci-przemyslowej` | 🟡 |
| usługi drogą elektroniczną | `mod-ustawa-uslugi-elektroniczne` | 🟡 |
| krajowy system certyfikacji cyberbezpieczeństwa | `mod-ustawa-certyfikacja-cyberbezpieczenstwa` | 🟡 |

## Aktywne luki

1. Prawo autorskie ma bieżące B+/COV dla głównych rozdziałów, ale nie status `FULL` artykuł-po-artykule.
2. RODO ma kilka pogłębionych modułów, ale brak statusu `FULL` całego rozporządzenia.
3. Akty cyfrowe UE są liczne i zmienne; kompletność należy oceniać per akt, a nie dla DR-11 zbiorczo.
4. AI Act, eIDAS 2.0, DORA, NIS2/KSC i akty danych wymagają kontroli temporalnej oraz świeżego EUR-Lex / ELI przed zastosowaniem.
5. Prawo własności przemysłowej wymaga dalszego audytu rozdziałowego.
