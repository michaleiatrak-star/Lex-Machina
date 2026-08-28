# DR-03 — Lokalna Mapa Aktów Prawnych

## Prawo karne, wykroczenia, egzekucja

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia napraw, dawne numery, zamknięte flagi i opisy kolejnych sesji audytowych pozostają poza runtime.

### Kodeks karny i framework karny

**Baza KK:** Dz.U. 2025 poz. 383 t.j. ze zm.  
**Baza KPK:** Dz.U. 2026 poz. 490 t.j. ze zm.  
**Baza KKW:** Dz.U. 2025 poz. 911 t.j. ze zm.

| Zakres | Moduł / routing | Status runtime |
|---|---|---|
| KK — indeks current-state całego kodeksu | `mod-KK-current-state-COV.md` | 🟢 B+/COV |
| KK — moduł główny | `mod-KK-kodeks-karny` | ✅ aktywny |
| KK + KPK — framework ogólny | `mod-KK-KPK-framework-karne` | ✅ aktywny |
| KK + KPK + KKW — framework szczegółowy | `mod-KK-KPK-framework-szczegolowy` | ✅ aktywny |
| Kwalifikacja karnomaterialna | `mod-KK-kwalifikator-karnomaterialny` | ✅ aktywny; fresh gate |
| Czynny żal / samooskarżenie KK-KKS | `mod-czynny-zal-KK-KKS-samooskarzenie` | ✅ aktywny |
| KK art. 10 — nieletni | `mod-KK-art10-odpowiedzialnosc-nieletnich` | ✅ aktywny |
| KK art. 18–22 — formy popełnienia | `mod-KK-art18-22-formy-popelnienia` | ✅ aktywny |
| KK art. 64–65 — recydywa | `mod-KK-art64-recydywa` | ✅ aktywny |
| KK art. 69–84 — zawieszenie / zwolnienie | `mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie` | ✅ aktywny |
| KK art. 101–105 — przedawnienie | `mod-KK-art101-105-przedawnienie-karalnosci` | ✅ aktywny |
| KK art. 127–139 — przeciwko RP | `mod-KK-art127-139-przeciwko-RP` | ✅ aktywny |
| KK art. 148–162 — życie i zdrowie | `mod-KK-art148-162-przeciwko-zyciu-zdrowiu` | ✅ aktywny |
| KK art. 163–172 — bezpieczeństwo powszechne | `mod-KK-art163-172-bezpieczenstwo-powszechne` | ✅ aktywny |
| KK art. 181–188a — środowisko | `mod-KK-art181-188a-przeciwko-srodowisku` | ✅ aktywny |
| KK art. 190a — stalking | `mod-KK-art190a-stalking` + `shared/STALKING-NEKANIE.md` | ✅ aktywny |
| KK art. 207 — przemoc domowa | `mod-KK-art207-przemoc-domowa` + `mod-KK-przemoc-domowa-szczegolowy` | ✅ aktywny |
| KK art. 212–216 — cześć | `mod-KK-art212-216-przeciwko-czci` | ✅ aktywny |
| KK art. 217a / 222–226 — ochrona funkcjonariusza i osoby interweniującej | `mod-KK-art222-226-ochrona-funkcjonariusza` | ✅ aktywny |
| KK art. 228–231 — korupcja urzędnicza | `mod-KK-art228-231-korupcja-urzednicza` | ✅ aktywny |
| KK art. 233–244b — wymiar sprawiedliwości | `mod-KK-art233-244b-przeciwko-wymiarowi-sprawiedliwosci` | ✅ aktywny |
| KK art. 250a — korupcja wyborcza | `mod-KK-art250a-korupcja-wyborcza` | ✅ aktywny |
| KK art. 255b — patostreaming | `mod-KK-art255b-patostreaming` | ✅ aktywny; temporal/fresh gate |
| KK art. 263 — broń | `mod-KK-art263-bron-nielegalna` | ✅ aktywny; fresh gate ustaw administracyjnych |
| KK art. 267–269c — cyberprzestępstwa | `mod-KK-art267-269c-cyberprzestepstwa` + `mod-KK-cyberprzestepstwa-szczegolowy` | ✅ aktywny |
| KK art. 270–310 — fałszerstwa dokumentów | `mod-KK-art270-310-falszerstwa-dokumentow` | ✅ aktywny |
| KK art. 291–299 — paserstwo / pranie pieniędzy | `mod-KK-art291-pranie-pieniedzy` | ✅ aktywny |
| KK art. 296 — nadużycie zaufania | `mod-KK-art296-naduzycie-zaufania` | ✅ aktywny |
| KK art. 296a — korupcja prywatna | `mod-KK-art296a-korupcja-sektor-prywatny` | ✅ aktywny |
| KK art. 305 — zmowa przetargowa | `mod-KK-art305-zmowa-przetargowa-karna` | ✅ aktywny |
| Fikcyjna reprezentacja / „słupy” | `mod-KK-slupy-fikcyjna-reprezentacja-spolki` | ✅ aktywny; routing wieloaktowy |
| Podmiana części przy naprawie / oszustwo | `mod-podmiana-czesci-naprawa-oszustwo` | ✅ aktywny |
| Samosąd / lincz / ochrona świadków | `mod-lincz-ochrona-swiadkow-lowcy-pedofili` | ✅ aktywny |
| Tajemnica zawodowa / poufność | `mod-tajemnica-zawodowa-poufnosc` | ✅ aktywny |
| Świadek koronny / „mały świadek koronny” | `mod-swiadek-koronny-duzy-maly` | ✅ aktywny; fresh gate |

### Kodeks postępowania karnego

| Zakres | Moduł / routing | Status runtime |
|---|---|---|
| KPK — indeks current-state całego kodeksu | `mod-KPK-current-state-COV.md` | 🟢 B+/COV |
| Tryby ścigania | `mod-KPK-tryby-scigania` | ✅ aktywny |
| Dobrowolne poddanie się karze / konsensualne zakończenie | `mod-dobrowolne-poddanie-sie-karze-KPK` | ✅ aktywny |
| Mediacja karna | `mod-KPK-mediacja-sprawiedliwosc-naprawcza` | ✅ aktywny |
| Środki zapobiegawcze / tymczasowe aresztowanie | `mod-KPK-srodki-zapobiegawcze-tymczasowe-aresztowanie` | ✅ aktywny |
| Poręczenie majątkowe | `mod-poreczenie-majatkowe-kaucja-karna` | ✅ aktywny |
| Podstawy procesowe / dowody biegłych / odwoławcze / postępowania szczególne | `mod-KPK-podstawy-odwolawcze-przeslanki-zarzuty-biegli` | ✅ aktywny; fresh gate |
| Współpraca międzynarodowa karna / ENA / ekstradycja / EPPO | `mod-KPK-wspolpraca-miedzynarodowa-karna` | ✅ aktywny; fresh gate |

### Kodeks karny wykonawczy

| Zakres | Moduł / routing | Status runtime |
|---|---|---|
| KKW — indeks current-state całego kodeksu | `mod-KKW-current-state-COV.md` | 🟢 B+/COV |
| KKW — moduł główny | `mod-KKW-kodeks-karny-wykonawczy` | ✅ aktywny |
| KKW — pokrycie pozostałych części | `mod-KKW-uzupelnienie-pokrycia-2026` | 🟡 B/B+ |
| Fundusz Pomocy Pokrzywdzonym / Pomoc Postpenitencjarna | art. 43 KKW + właściwe rozporządzenie wykonawcze | `mod-ustawa-fundusz-pomocy-pokrzywdzonym` | ✅ aktywny; fresh gate aktu wykonawczego |
| Opłaty w sprawach karnych | Dz.U. 2023 poz. 123 t.j. ze zm. | `mod-ustawa-oplaty-w-sprawach-karnych` | 🟢 B+/COV |

### Wykroczenia i KPW

**Baza KW:** Dz.U. 2025 poz. 734 t.j. ze zm.  
**Baza KPW:** Dz.U. 2025 poz. 860 t.j. ze zm.

| Zakres | Moduł / routing | Status runtime |
|---|---|---|
| KW — moduł główny | `mod-KW-kodeks-wykroczen` | ✅ aktywny |
| KW — część ogólna | `mod-KW-art1-48-czesc-ogolna` | ✅ aktywny |
| KW art. 49–64 — porządek publiczny | `mod-KW-art49-64-porzadek-publiczny` | ✅ aktywny |
| KW art. 70–118 — bezpieczeństwo / osoba / zdrowie | `mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie` | ✅ aktywny |
| KW art. 119–131 — mienie | `mod-KW-art119-131-przeciwko-mieniu` | ✅ aktywny |
| KW art. 132–166 — pozostałe rozdziały | `mod-KW-art132-166-pozostale-rozdzialy` | ✅ aktywny |
| KPW — indeks wszystkich 12 działów | `mod-KPW-kodeks-postepowania-w-sprawach-o-wykroczenia.md` | 🟢 B+/COV |
| KW + KPW — framework szczegółowy | `mod-KW-KPW-framework-szczegolowy` | ✅ aktywny |
| Grzywny / mandaty / KPA / UPEA / KPW | `mod-grzywny-mandaty-szczegolowe` | ✅ aktywny; fresh gate kwot i terminów |

### KKS, narkomania i inne akty karne

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Kodeks karny skarbowy | Dz.U. 2025 poz. 633 t.j. ze zm. | `mod-KKS-karny-skarbowy-i-AML` | 🟢 B+/COV |
| AML — routing do KKS / DR-06 | Dz.U. 2025 poz. 644 t.j. ze zm. | `mod-KKS-karny-skarbowy-i-AML` + DR-06 | ✅ aktywny |
| Ustawa o przeciwdziałaniu narkomanii — indeks current-state | Dz.U. 2023 poz. 1939 t.j. ze zm., w tym obowiązująca zmiana Dz.U. 2026 poz. 1004 | `mod-narkomania-current-state-COV.md` + `mod-ustawa-narkomania` | 🟢 B+/COV |
| Przymusowe leczenie odwykowe / leczenie uzależnień | właściwe akty alkoholowe i narkotykowe | `mod-przymusowe-leczenie-odwykowe` | ✅ aktywny; fresh gate |
| Odpowiedzialność podmiotów zbiorowych | Dz.U. 2024 poz. 1822 t.j. ze zm. | `mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych` | ✅ aktywny |
| Nielegalny pobór mediów — kwalifikacja karna / cywilna / sektorowa | właściwe bieżące przepisy KK, Prawa energetycznego i ustaw sektorowych | `mod-nielegalny-pobor-mediow` | ✅ aktywny; fresh gate |
| Komornicy sądowi — routing wykonawczy | aktualna ustawa o komornikach sądowych | DR-12 `mod-ustawa-komornicy-sadowi-zawod` | 🔗 routing DR-12 |

### Ruch drogowy i bezpieczeństwo ruchu

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Prawo o ruchu drogowym / kierujący pojazdami / punkty karne | PRD: Dz.U. 2024 poz. 1251 t.j. ze zm.; u.k.p.: Dz.U. 2025 poz. 1226 t.j. ze zm. | `mod-PRD-prawo-jazdy-punkty-karne` | ✅ aktywny; fresh gate |
| Nowe przestępstwa drogowe / BRD | właściwe obowiązujące nowelizacje KK/KW/PRD | `mod-PRD-nowe-przestepstwa-drogowe-BRD` | ✅ aktywny; temporal gate |
| Modyfikacje / przeróbki pojazdów | PRD jw. + akty homologacyjne / tachografowe | `mod-przerobki-modyfikacje-pojazdow` | ✅ aktywny; fresh gate |

## Reguły runtime

- każdy fizyczny moduł DR-03 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- mapy nie przechowują dawnych błędów, wpisów `NAPRAWIONE/ZAMKNIĘTE/NOWY`, opisów sesji ani projektów niewchodzących jeszcze w życie;
- znamiona, sankcje, tryb ścigania, terminy, kwoty, środki zapobiegawcze i przepisy intertemporalne zawsze wymagają fresh gate do ELI/ISAP przed użyciem;
- `COV` oznacza aktualną strukturę/routing, nie `FULL` artykuł-po-artykule.
