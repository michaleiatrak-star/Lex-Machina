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
| Prawo o ustroju sądów powszechnych | DR-01 / `mod-USP-ustroj-sadow-powszechnych` | 🟡 |
| Prawo o prokuraturze / organy ochrony prawa | `mod-PrProkuratura-organy-ochrony-prawa` | 🟡 |
| sędziowie / referendarze / kuratorzy | `mod-ustawa-sedziowie-referendarze-kuratorzy` | 🟡 |
| koszty sądowe i pomoc prawna (KSCU) | `mod-KSCU-koszty-sadowe-i-pomoc-prawna` | 🟡 |
| KPC — biegli sądowi / opinie | `mod-KPC-biegli-sadowi-opinie` | 🟡 |
| KPC — arbitraż / mediacja | `mod-KPC-arbitraz-mediacja-ADR` | 🟡 |
| regulatorzy UOKiK / URE / UKE / KNF | `mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF` | 🟡 |

## Zawody prawnicze

| Akt / zawód | Moduł | Status bieżący |
|---|---|---|
| Prawo o adwokaturze | `mod-ustawa-adwokatura` | 🟡 |
| radcowie prawni | `mod-ustawa-radcowie-prawni` | 🟡 |
| Prawo o notariacie | `mod-ustawa-notariat` | 🟡 |
| komornicy sądowi | `mod-ustawa-komornicy-sadowi-zawod` | 🟡 |
| rzecznicy patentowi | `mod-ustawa-rzecznicy-patentowi-zawod` | 🟡 |
| odpowiedzialność dyscyplinarna zawodów | `mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` | 🟢/🟡 B+ |

## Kodeksy etyki / samorządy zawodowe

| Zawód | Źródło kanoniczne | Status bieżący |
|---|---|---|
| adwokat | NRA / organy adwokatury | 🟢/🟡 B+ |
| radca prawny | KRRP / Krajowy Zjazd Radców Prawnych | 🟢/🟡 B+ |
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

1. Sama obecność modułu zawodu nie oznacza pełnego audytu ustawy korporacyjnej ani całego postępowania dyscyplinarnego.
2. Kodeksy etyki i uchwały zawodowe należy pobierać z oficjalnych stron właściwego samorządu, nie ze źródeł wtórnych.
3. Prawo o prokuraturze, KSCU oraz akty ustrojowe wymagają dalszego audytu rozdziałowego.
4. Przy kolizji zakresów DR-12 korzysta z DR-01 dla ustroju oraz DR-02/03/05 dla właściwej procedury.
