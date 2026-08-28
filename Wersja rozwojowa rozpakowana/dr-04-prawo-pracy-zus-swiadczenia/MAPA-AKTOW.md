# DR-04 — Lokalna Mapa Aktów Prawnych

## Prawo pracy, ZUS, świadczenia społeczne

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia audytów, dawne numery, zamknięte flagi i przyszłe przepisy niewchodzące jeszcze w życie pozostają poza warstwą runtime.

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Kodeks pracy — indeks całego aktu | Dz.U. 2025 poz. 277 t.j. ze zm. | `mod-KP-current-state-COV.md` + `mod-KP-prawo-pracy` | 🟢 B+/COV; fresh gate |
| KP — praca zdalna | jw. | `mod-KP-praca-zdalna` | ✅ aktywny |
| KP — czas pracy | jw. | `mod-KP-dzial-VI-czas-pracy` | 🟢 B+/COV |
| KP — urlopy pracownicze | jw. | `mod-KP-dzial-VII-urlopy-pracownicze` | 🟢 B+/COV |
| KP — rodzicielstwo | jw. | `mod-KP-dzial-VIII-rodzicielstwo` | ✅ aktywny |
| KP — odpowiedzialność materialna / przedawnienie | jw. | `mod-KP-dzial-V-XIV-odpowiedzialnosc-materialna-przedawnienie` | ✅ aktywny |
| KP — wynagrodzenie / świadczenia / jawność wynagrodzeń | jw. + właściwe prawo UE i przepisy implementujące obowiązujące na dzień sprawy | `mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc` | ✅ aktywny; temporal gate |
| KP — nadużycie prawa / limity umów / wypowiedzenie zmieniające / kary porządkowe | jw. | `mod-KP-naduzycia-pracodawcy-limity-kary-degradacja` | ✅ aktywny |
| Mobbing / dyskryminacja | aktualne brzmienie KP na dzień zdarzenia | `mod-KP-mobbing-dyskryminacja` | ✅ aktywny; temporal gate |
| Konflikt interesów / nepotyzm w zatrudnieniu | KP + przepisy sektorowe właściwe dla danego pracodawcy | `mod-KP-konflikt-interesow-rodzina-nepotyzm` | ✅ aktywny; routing przekrojowy |
| Reforma stażu pracy | przepisy KP obowiązujące na dzień ustalania stażu | `mod-reforma-stazu-pracy-2025-2026` | ✅ aktywny; temporal gate |
| Ustawa o Państwowej Inspekcji Pracy | Dz.U. 2024 poz. 1712 t.j. ze zm. | `mod-ustawa-PIP-inspekcja-pracy` | ✅ aktywny |
| Obchodzenie prawa pracy / mechanizmy kontrolne PIP | KP + ustawa o PIP + akty szczególne | `mod-obchodzenie-prawa-pracy-reforma-PIP-2026` | ✅ aktywny; fresh gate |
| Klasyfikacja naruszeń BHP / prawa pracy | KP + ustawa o PIP + właściwe przepisy branżowe | `mod-klasyfikacja-naruszen-bhp-prawa-pracy` | ✅ aktywny; routing przekrojowy |
| Wypadki przy pracy / choroby zawodowe | Dz.U. 2025 poz. 1644 t.j. ze zm. + przepisy wykonawcze | `mod-wypadek-przy-pracy-choroba-zawodowa` | ✅ aktywny |
| Ustawa o zakładowym funduszu świadczeń socjalnych | Dz.U. 2024 poz. 288 t.j. ze zm. | `mod-ustawa-ZFSS` | ✅ aktywny |
| Ustawa o minimalnym wynagrodzeniu za pracę | Dz.U. 2024 poz. 1773 ze zm. + aktualne rozporządzenie płacowe | `mod-ustawa-minimalne-wynagrodzenie` | ✅ aktywny; fresh gate kwot |
| Ustawa o zatrudnianiu pracowników tymczasowych | Dz.U. 2025 poz. 236 t.j. ze zm. | `mod-ustawa-praca-tymczasowa` | ✅ aktywny |
| Ustawa o zwolnieniach grupowych | Dz.U. 2025 poz. 570 t.j. ze zm. | `mod-ustawa-zwolnienia-grupowe` | 🟡 B+; fresh gate |
| Ustawa o układach zbiorowych pracy i porozumieniach zbiorowych + routing związkowy | Dz.U. 2025 poz. 1661 ze zm. + właściwe ustawy związkowe | `mod-ustawa-zwiazki-zawodowe-spory-zbiorowe` | ✅ aktywny |
| Karta Nauczyciela — aspekty pracownicze | Dz.U. 2026 poz. 515 t.j. ze zm. | `mod-ustawa-karta-nauczyciela-pracownicze` | ✅ aktywny; fresh gate |
| Ustawa o rynku pracy i służbach zatrudnienia | Dz.U. 2025 poz. 620 ze zm. | `mod-ustawa-rynek-pracy-zatrudnienie` | ✅ aktywny |
| Ustawa o rehabilitacji zawodowej i społecznej oraz zatrudnianiu osób niepełnosprawnych / PFRON | Dz.U. 2025 poz. 913 t.j. ze zm. | `mod-ustawa-rehabilitacja-PFRON` | ✅ aktywny |
| Ustawa o systemie ubezpieczeń społecznych (SUS) | Dz.U. 2026 poz. 199 t.j. ze zm. | `mod-SUS-ZUS-ubezpieczenia-spoleczne` + rodzina modułów SUS | 🟢/🟡 aktywny; fresh gate |
| SUS — podstawa wymiaru składek / rozporządzenie składkowe | aktualne brzmienie SUS + właściwego rozporządzenia składkowego | `mod-ROZP-SKLADKOWE-podstawa-wymiaru` | ✅ aktywny; fresh gate kwot, wyłączeń i limitów |
| SUS — pozostałe rozdziały | jw. | `mod-SUS-uzupelnienie-pokrycia-2026` | 🟡 B |
| SUS — podleganie ubezpieczeniom | jw. | `mod-SUS-dzial-2-podleganie-ubezpieczeniom` | ✅ aktywny |
| Ubezpieczenie społeczne rolników (KRUS) | Dz.U. 2025 poz. 1770 t.j. ze zm. | `mod-KRUS-rolnicze-ubezpieczenia` | ✅ aktywny |
| Ustawa o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa | Dz.U. 2026 poz. 854 t.j. ze zm. | `mod-ustawa-zasilkowa-choroba-macierzynstwo` | 🟡 B+; pełna mapa rozdziałów, bez deklaracji COV całego aktu |
| Ustawa o emeryturach i rentach z FUS | Dz.U. 2025 poz. 1749 t.j. ze zm. | rodzina modułów FUS | 🟢/🟡 aktywny; fresh gate |
| FUS — renta rodzinna / zasiłek pogrzebowy / waloryzacja | jw. | `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja` | ✅ aktywny |
| FUS — pozostałe działy | jw. | `mod-FUS-uzupelnienie-pokrycia-2026` | 🟡 B |
| Dodatek pielęgnacyjny / świadczenie rehabilitacyjne / świadczenia pokrewne | FUS + ustawa zasiłkowa + ustawa o świadczeniach rodzinnych | `mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-wyrownawcze` | ✅ aktywny; fresh gate |
| Emerytury pomostowe | Dz.U. 2024 poz. 1696 t.j. ze zm. | `mod-emerytury-pomostowe` | ✅ aktywny; fresh gate |
| Ustawa o świadczeniach rodzinnych + „Za życiem” / programy wsparcia | Dz.U. 2025 poz. 1208 t.j. ze zm. + właściwe akty/programy | `mod-ustawa-swiadczenia-rodzinne` | ✅ aktywny; fresh gate |
| Ustawa o świadczeniu wspierającym / WZON | Dz.U. 2023 poz. 1429 ze zm. | `mod-ustawa-swiadczenie-wspierajace-WZON` | ✅ aktywny |
| Ustawa „Aktywny Rodzic” | Dz.U. 2024 poz. 858 ze zm. | `mod-ustawa-aktywny-rodzic` | ✅ aktywny |
| Ustawa o pomocy społecznej | Dz.U. 2026 poz. 639 t.j. ze zm. | `mod-ustawa-pomoc-spoleczna` | ✅ aktywny; fresh gate kwot |
| Ustawa o ochronie konkurencji i konsumentów — routing pracowniczo-konsumencki | Dz.U. 2025 poz. 1714 t.j. ze zm. | `mod-ustawa-ochrona-konkurencji-konsumentow-UOKiK` | ✅ aktywny / cross-domain |
| KPA — sprawy administracyjne świadczeń | Dz.U. 2025 poz. 1691 t.j. ze zm. | DR-05 `mod-KPA-current-state-COV.md` + `mod-KPA-postepowanie-administracyjne` | 🔗 routing DR-05 |

## Reguły runtime

- każdy fizyczny moduł DR-04 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- stan temporalny KP i innych ustaw ustala się na dzień zdarzenia; nieobowiązujące brzmienie nie może być aktywowane w runtime;
- kwoty świadczeń, płace minimalne, składki, limity, okresy i terminy wymagają fresh gate do ELI/ISAP i właściwych obwieszczeń/rozporządzeń;
- `COV` oznacza udokumentowaną strukturę i routing, nie `FULL` artykuł-po-artykule.
