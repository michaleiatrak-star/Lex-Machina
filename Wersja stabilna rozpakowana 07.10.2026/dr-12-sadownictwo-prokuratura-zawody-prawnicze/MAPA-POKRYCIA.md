# DR-12 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze wersje kodeksów/uchwał nie są częścią mapy runtime; aktualna wersja konkretnego aktu lub kodeksu zawodowego musi być sprawdzana w źródle urzędowym właściwego organu.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł operacyjny, ale bez pełnego audytu całego aktu;
- 🟡 B+ — pokrycie operacyjne pogłębione;
- ⚠️ — wymaga świeżej kontroli źródła przed zastosowaniem.

## Sądownictwo i prokuratura

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| Prawo o ustroju sądów powszechnych — Dz.U. 2024 poz. 334 ze zm. | DR-01 / `mod-USP-ustroj-sadow-powszechnych` | 🟢 B+ / COV — aktywne działy ustawy zmapowane; uwzględniono Dz.U. 2026 poz. 370 |
| Prawo o prokuraturze — Dz.U. 2026 poz. 810 | `mod-PrProkuratura-organy-ochrony-prawa` | 🟢 B+ / COV — ustrój, status, dyscyplinarne, routing proceduralny i EPPO zmapowane z aktualnego ELI 2026-08-28 |
| sędziowie / referendarze / kuratorzy | `mod-ustawa-sedziowie-referendarze-kuratorzy` | 🟡 |
| KSCU — Dz.U. 2025 poz. 1228 | `mod-KSCU-koszty-sadowe-i-pomoc-prawna` | 🟢 B+ / COV — opłaty, wydatki, zwolnienie i routing kosztowy zmapowane; kwoty wyłącznie fresh gate |
| KPC — biegli sądowi / opinie | `mod-KPC-biegli-sadowi-opinie` | 🟡 |
| KPC — arbitraż / mediacja | `mod-KPC-arbitraz-mediacja-ADR` | 🟡 |
| regulatorzy UOKiK / URE / UKE / KNF | `mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF` | 🟡 |

## Zawody prawnicze

| Akt / zawód | Moduł | Status bieżący |
|---|---|---|
| Prawo o adwokaturze — Dz.U. 2024 poz. 1564 + zmiany | `mod-ustawa-adwokatura` | 🟢 B+ / COV — struktura zawodu, samorząd, wpis/aplikacja, dyscyplinarne i etyka NRA zmapowane 2026-08-28 |
| radcowie prawni — Dz.U. 2024 poz. 499 + Dz.U. 2026 poz. 731 | `mod-ustawa-radcowie-prawni` | 🟢 B+ / COV — nowelizacja obowiązująca od 18.06.2026 i etyka KIRP zmapowane 2026-08-28 |
| Prawo o notariacie | `mod-ustawa-notariat` | 🟡 |
| komornicy sądowi | `mod-ustawa-komornicy-sadowi-zawod` | 🟡 |
| rzecznicy patentowi | `mod-ustawa-rzecznicy-patentowi-zawod` | 🟡 |
| odpowiedzialność dyscyplinarna zawodów | `mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` | 🟢/🟡 B+ |

## Kodeksy etyki / samorządy zawodowe

| Zawód | Źródło kanoniczne | Status bieżący |
|---|---|---|
| adwokat | NRA — KEA, uchwała nr 174/2026 Prezydium NRA z 23.06.2026 | 🟢 B+ / COV |
| radca prawny | KIRP — KERP, tekst jednolity uchwała nr 884/XI/2023 | 🟢 B+ / COV |
| notariusz | KRN | 🟢/🟡 B+ |
| komornik sądowy | KRK + właściwa ustawa | 🟢/🟡 B+ |
| rzecznik patentowy | samorząd rzeczników patentowych | 🟢/🟡 B+ |
| lekarz / dentysta | samorząd lekarski | 🟢/🟡 B+ |
| pielęgniarka / położna | samorząd pielęgniarek i położnych | 🟢/🟡 B+ |
| farmaceuta | samorząd aptekarski | 🟢/🟡 B+ |
| lekarz weterynarii | samorząd lekarsko-weterynaryjny | 🟡; fresh gate |
| diagnosta laboratoryjny | KIDL / samorząd diagnostów | 🟢/🟡 B+ |
| doradca podatkowy | KIDP | 🟡; fresh gate |
| biegły rewident | PIBR/KRBR + PANA w zakresie nadzoru | 🟢/🟡 B+ |
| architekt | IARP | 🟢/🟡 B+ |
| inżynier budownictwa | PIIB | 🟢/🟡 B+ |
| psycholog | właściwy stan ustawowy + źródła samorządowe/środowiskowe | ⚠️ kontrola temporalna |

## Aktywne luki

1. PUSP, Prawo o prokuraturze, KSCU, Prawo o adwokaturze i ustawa o radcach prawnych mają bieżące B+/COV, ale nie status `FULL` artykuł-po-artykule.
2. Prawo o notariacie i pozostałe akty ustrojowe/zawodowe wymagają dalszego audytu rozdziałowego.
3. Kodeksy etyki i uchwały zawodowe należy pobierać z oficjalnych stron właściwego samorządu, nie ze źródeł wtórnych.
4. Zmian z Dz.U. 2026 poz. 846, zasadniczo wchodzących 1.10.2026, nie stosuje się przed ich wejściem w życie.
5. Przy kolizji zakresów DR-12 korzysta z DR-01 dla ustroju oraz DR-02/03/05 dla właściwej procedury.
