# DR-12 — Lokalna Mapa Aktów Prawnych

**Stan operacyjny:** 2026-08-28

Mapa zawiera wyłącznie akty i źródła używane obecnie. Historia korekt należy do audytu/changelogu.

## Sądownictwo, prokuratura, zawody prawnicze

| Akt / zakres | Aktualna podstawa operacyjna | Moduł | Status |
|---|---|---|---|
| Prawo o ustroju sądów powszechnych | aktualny tekst ELI/ISAP; kanonicznie DR-01 | → DR-01/`mod-USP-ustroj-sadow-powszechnych` | 🔗 |
| Prawo o prokuraturze | Dz.U. 2024 poz. 390 t.j. + późn. zm.; fresh gate ELI | `mod-PrProkuratura-organy-ochrony-prawa` | ✅ |
| KPC — arbitraż i mediacja | Dz.U. 2026 poz. 468 t.j. + późn. zm. | `mod-KPC-arbitraz-mediacja-ADR` | ✅ |
| regulatorzy UOKiK / URE / UKE / KNF | właściwe bieżące ustawy sektorowe; nie istnieje jeden zbiorczy Dz.U. | `mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF` | ✅ / fresh gate per regulator |
| sędziowie, referendarze, kuratorzy | właściwe bieżące ustawy ustrojowe i zawodowe | `mod-ustawa-sedziowie-referendarze-kuratorzy` | ✅ / fresh gate |
| odpowiedzialność dyscyplinarna zawodów | właściwa ustawa korporacyjna + kodeks etyki danego zawodu | `mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` | ✅ |
| koszty sądowe w sprawach cywilnych | Dz.U. 2025 poz. 1228 t.j. + późn. zm. | `mod-KSCU-koszty-sadowe-i-pomoc-prawna` | ✅ |
| KPC — biegli sądowi i opinie | Dz.U. 2026 poz. 468 t.j. + późn. zm. | `mod-KPC-biegli-sadowi-opinie` | ✅ |
| Prawo o adwokaturze | Dz.U. 2024 poz. 1564 t.j. + późn. zm.; ELI wskazuje akty zmieniające po t.j. | `mod-ustawa-adwokatura` | ✅ B+/COV |
| ustawa o radcach prawnych | Dz.U. 2024 poz. 499 t.j. + późn. zm., w tym Dz.U. 2026 poz. 731 obowiązujący od 18.06.2026 | `mod-ustawa-radcowie-prawni` | ✅ B+/COV |
| Prawo o notariacie | Dz.U. 2026 poz. 614 t.j. + późn. zm. | `mod-ustawa-notariat` | ✅ |
| ustawa o komornikach sądowych | Dz.U. 2026 poz. 881 t.j. + późn. zm. | `mod-ustawa-komornicy-sadowi-zawod` | ✅ |
| ustawa o rzecznikach patentowych | Dz.U. 2026 poz. 778 t.j. + późn. zm. | `mod-ustawa-rzecznicy-patentowi-zawod` | ✅ |

## Kodeksy etyki zawodowej — źródła kanoniczne

Kodeksy etyki są aktami korporacyjnymi właściwych samorządów, a nie aktami publikowanymi w Dzienniku Ustaw. Przed użyciem pobierz bieżący tekst z oficjalnej strony właściwego organu.

| Zawód | Bieżące źródło kanoniczne | Status |
|---|---|---|
| adwokat | NRA — Kodeks Etyki Adwokackiej, tekst jednolity uchwała nr 174/2026 Prezydium NRA z 23.06.2026 | ✅ B+/COV |
| radca prawny | KIRP/KRRP — KERP, tekst jednolity uchwała nr 884/XI/2023 Prezydium KRRP | ✅ B+/COV |
| notariusz | Krajowa Rada Notarialna — aktualny Kodeks Etyki Zawodowej Notariusza | fresh gate |
| komornik sądowy | Krajowa Rada Komornicza — aktualny Kodeks Etyki Zawodowej Komornika Sądowego | fresh gate |
| rzecznik patentowy | właściwy samorząd rzeczników patentowych — aktualne Zasady Etyki | fresh gate |
| lekarz / lekarz dentysta | Naczelna Izba Lekarska / Krajowy Zjazd Lekarzy | routing DR-10 |
| pielęgniarka / położna | NIPiP / Krajowy Zjazd | routing DR-10 |
| farmaceuta | Naczelna Izba Aptekarska | routing DR-10 |
| lekarz weterynarii | Krajowa Izba Lekarsko-Weterynaryjna | routing DR-10 |
| diagnosta laboratoryjny | KIDL | routing DR-10 |
| doradca podatkowy | KIDP | routing DR-06 |
| biegły rewident | PIBR/KRBR + PANA w zakresie zatwierdzeń/nadzoru | routing DR-15 |
| architekt / inżynier budownictwa | IARP / PIIB | routing DR-09/15 |

## Zmiany przyszłe

Dz.U. 2026 poz. 846 zasadniczo wchodzi w życie 1.10.2026 i modyfikuje m.in. przepisy dotyczące tajemnicy zawodowej adwokatów i radców prawnych w związku z obowiązkami raportowymi. **Na dzień 2026-08-28 nie jest to bieżące brzmienie tych jednostek.**

## Reguła runtime

1. Mapa wskazuje akt i moduł, nie historię jego korekt.
2. `MAPA-POKRYCIA.md` wskazuje bieżącą głębokość pokrycia.
3. Każda konkretna jednostka prawa wymaga fresh gate do ELI/ISAP.
4. Kodeks etyki wymaga fresh gate do oficjalnego samorządu.
