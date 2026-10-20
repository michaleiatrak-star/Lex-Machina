# DR-07 — Lokalna Mapa Aktów Prawnych

## Zamówienia Publiczne, Fundusze UE

Mapa runtime pokazuje wyłącznie bieżący stan aktu → moduł. Historia korekt pozostaje poza tym plikiem.

| Akt prawny / zakres | Dz.U. / źródło bieżące | Moduł | Status bieżący |
|---|---|---|---|
| Prawo zamówień publicznych (PZP) | Dz.U. 2026 poz. 793 t.j.; zm. **2026/1347** art. 6 — art. 214 ust. 1 pkt 10 i art. 364 ust. 1 pkt 1 bez „świadectw pochodzenia biogazu rolniczego” od 1.12.2026 ✅ [VER] RZĄD 1 2026-10-20 (ELI DU/2026/1347 i 1348: metadane, `references`, 1347 text.pdf art. 1–6 i 41) | `mod-PZP-zamowienia-publiczne-KIO` | 🟢 operacyjny; konkretny przepis wymaga fresh gate |
| PZP — uzupełnienie: polityka/plan, zamówienia mieszane, komunikacja, dokumentowanie, formalności wyboru, podprogowe, organy i ADR | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-uzupelnienie-pokrycia-2026` | 🟢 B+/COV |
| PZP Dział II — kwalifikacja podmiotowa, JEDZ, kryteria oceny, unieważnienie | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie` | 🟢 B+/COV |
| PZP Dział IV — umowa ramowa, dynamiczny system zakupów, konkurs i usługi społeczne | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-dzial-IV-szczegolne-instrumenty` | 🟢 aktywny; fresh gate |
| PZP — otwarcie i badanie ofert oraz postępowanie odwoławcze przed KIO | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-otwarcie-badanie-ofert-przebieg-KIO` | 🟢 B+/COV |
| PZP Dział VII — umowa i jej wykonanie, podwykonawstwo, zabezpieczenie | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-wykonanie-umowy-compliance` | 🟢 B+/COV |
| PZP Dział I — podstawy, wyłączenia, szacowanie wartości | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-dzial-I-podstawy-wylaczenia-szacowanie` | 🟢 B+/COV |
| PZP Działy V–VI — sektorowe, obronność i bezpieczeństwo | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-dzial-V-VI-sektorowe-obronne-infrastruktura-krytyczna` | 🟢 B+/COV |
| PZP Działy XI–XII — kontrola i kary pieniężne | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-dzial-XI-XII-kontrola-kary-UZP` | 🟢 B+/COV |
| Zamówienia dofinansowane z UE — PZP + Wytyczne kwalifikowalności 2021–2027 | PZP + aktualne wytyczne MFiPR | `mod-PZP-fundusze-UE-podwojny-rezim` | 🟢 operacyjny; wytyczne zawsze fresh gate |
| PZP art. 99 ust. 4–6 — opis przedmiotu zamówienia | Dz.U. 2026 poz. 793 t.j. | `mod-PZP-opis-przedmiotu-zakaz-znakow-towarowych` | 🟢 operacyjny |
| Prawo o notariacie | Dz.U. 2026 poz. 614 t.j. | `mod-PrNotariat-notariat-rejestry` | 🟢 operacyjny |
| Ustawa o NIK | Dz.U. 2022 poz. 623 ze zm. | `mod-ustawa-NIK` | 🟢 operacyjny; aktualność konkretnej jednostki fresh gate |
| Partnerstwo publiczno-prywatne | Dz.U. 2023 poz. 1637 t.j. | `mod-ustawa-PPP-i-koncesja` | 🟢 operacyjny |
| Certyfikacja wykonawców zamówień publicznych | Dz.U. 2025 poz. 1235 | `mod-ustawa-PZP-certyfikacja-wykonawcow` | 🟢 operacyjny |
| Prokuratoria Generalna RP | Dz.U. 2024 poz. 1192 t.j. | `mod-ustawa-Prokuratorii-Generalnej` | 🟢 operacyjny |
| Regionalne izby obrachunkowe | Dz.U. 2025 poz. 7 t.j. | `mod-ustawa-RIO-regionalne-izby` | 🟢 operacyjny |
| KPC — arbitraż i mediacja | Dz.U. 2026 poz. 468 t.j. | `mod-ustawa-arbitraz-mediacja` | 🟢 operacyjny |
| Odpowiedzialność za naruszenie dyscypliny finansów publicznych | Dz.U. 2025 poz. 1484 t.j. | `mod-ustawa-dyscyplina-finansow-publicznych` | 🟢 operacyjny |
| Ustawa wdrożeniowa 2021–2027 | Dz.U. 2025 poz. 1733 t.j. | `mod-ustawa-fundusze-UE-pomoc-publiczna` | 🟢 operacyjny |
| Zasady prowadzenia polityki rozwoju | Dz.U. 2025 poz. 198 t.j. | `mod-ustawa-fundusze-UE-pomoc-publiczna` | 🟢 operacyjny |

## Reguła użycia

- `MAPA-AKTOW.md` nie przechowuje historii napraw ani dat sesji audytowych.
- `B+/COV` nie oznacza `FULL`.
- Przed powołaniem konkretnego przepisu, progu, terminu albo wersji dokumentu programowego wykonaj fresh gate do właściwego źródła urzędowego.
