# DR-08 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje tylko bieżące pokrycie używane przez system. Rejestracja aktu nie jest równoznaczna z pełnym pokryciem; historia zmian należy do audytu/changelogu.

## Legenda

- 🟢 — pokrycie pogłębione / audyt aktu wykonany w użytecznym zakresie;
- 🟡 — moduł istnieje i jest używany, ale brak pełnego audytu rozdziałowego;
- ⚠️ — wymaga aktualizacji lub pogłębienia modułu przed traktowaniem go jako wiarygodnej podstawy operacyjnej.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| samorząd gminny — Dz.U. 2026 poz. 662 | `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa` | 🟢 B+/COV |
| samorząd powiatowy — Dz.U. 2025 poz. 1684 | `mod-ustawa-samorzad-powiatowy` | 🟢 B+/COV — wszystkie 10 rozdziałów, organy, prawo miejscowe, mienie/finanse i nadzór zmapowane |
| samorząd województwa — Dz.U. 2026 poz. 720 | `mod-ustawa-samorzad-wojewodztwa` | 🟢 B+/COV — wszystkie 9 rozdziałów, organy, współpraca zagraniczna, nadzór i prawo miejscowe zmapowane |
| wojewoda i administracja rządowa w województwie — Dz.U. 2025 poz. 428 | `mod-wojewoda-administracja-rzadowa-current-state-COV.md` | 🟢 B+/COV |
| nadzór Wojewody i RIO / legalność uchwał | `mod-nadzor-wojewody-RIO-legalnosc-uchwal` | 🟡 |
| skargi na prawo miejscowe — WSA/NSA | `mod-skargi-na-prawo-miejscowe-WSA-NSA` | 🟡 |
| procedury JST — statuty i regulaminy | `mod-procedury-JST-statuty-regulaminy` | 🟡 |
| dzienniki urzędowe / BIP / publikacja | `mod-dzienniki-urzedowe-BIP-publikacja` | 🟡 |
| kontrola w administracji i inspekcje | `mod-kontrola-administracji-inspekcje` | 🟡 B+ |
| akty porządkowe / bezpieczeństwo lokalne | `mod-akty-porzadkowe-bezpieczenstwo-lokalne` | 🟡 |
| lokalne dane publiczne / RODO / BIP / DIP | `mod-lokalne-dane-publiczne-RODO-BIP` | 🟡 |
| MPZP i WZ | `mod-MPZP-WZ-planowanie-przestrzenne` | 🟡 |
| lokalne podatki / opłaty / taryfy | `mod-lokalne-podatki-oplaty-taryfy` | 🟡 |
| dochody JST | `mod-ustawa-dochody-JST` | 🟡 |
| zarządzanie kryzysowe / ochrona ludności | `mod-ustawa-zarzadzanie-kryzysowe` | 🟡 |
| publiczny transport zbiorowy | `mod-ustawa-komunalne-wod-kan-transport-czystosc` | 🟡 |
| referendum lokalne | `mod-ustawa-referendum-lokalne` | 🟡 B+ |
| pracownicy samorządowi | `mod-ustawa-pracownicy-samorzadowi` | 🟡 |
| utrzymanie czystości i porządku w gminach | `mod-ustawa-komunalne-wod-kan-transport-czystosc` | 🟡 B+ |
| zbiorowe zaopatrzenie w wodę / ścieki | `mod-ustawa-komunalne-wod-kan-transport-czystosc` | 🟡 |
| ochrona zabytków / rewitalizacja | `mod-ustawa-zabytki-rewitalizacja` | 🟡 B+ |
| cmentarze i chowanie zmarłych | `mod-ustawa-zabytki-rewitalizacja` | 🟡 B+ |
| drogi publiczne / strefy płatnego parkowania | `mod-UDP-strefy-platnego-parkowania` | 🟡 |

## Aktywne luki

1. Samorząd gminny, powiatowy i województwa mają bieżące B+/COV; nie oznacza to statusu `FULL` całych ustaw.
2. Następne P1 w DR-08: Prawo przedsiębiorców w lokalnym kontekście JST oraz dalsze pogłębienie nadzoru szczegółowego.
3. Dalsze pogłębianie: nadzór szczegółowy, MPZP/WZ oraz lokalne finanse i usługi komunalne.
4. Przed użyciem konkretnego przepisu obowiązuje świeży odczyt ELI/ISAP; przepisy lokalne wymagają również sprawdzenia właściwego dziennika urzędowego/BIP.
