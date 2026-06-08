# System Prawny — Mapy Plików Skillów + Raport Napraw
**Data:** 2026-06-04  
**Zakres:** 33 skille + shared/ (bez archive/)  
**Naprawy:** CRIT-1, CRIT-2, CRIT-3a, CRIT-3b, WARN-5 (chronologia description)

---

## CZĘŚĆ I — RAPORT WYKONANYCH NAPRAW

### CRIT-1 — analizator-umow-v1: FAKTY.md → FAKTY_v2.md
| Plik | Linia | Zmiana |
|------|-------|--------|
| `analizator-umow-v1/SKILL.md` | 113 | `FAKTY.md` → `FAKTY_v2.md` |
| `analizator-umow-v1/SKILL.md` | 217 | `MOD-WALIDACJA · FAKTY` → `MOD-WALIDACJA_v2 · FAKTY_v2` |
| `analizator-umow-v1/references/mod-core-checklist.md` | 563 | `FAKTY.md` → `FAKTY_v2.md` |

### CRIT-2 — analizator-umow-v1: MOD-WALIDACJA.md → MOD-WALIDACJA_v2.md
| Plik | Linia | Zmiana |
|------|-------|--------|
| `analizator-umow-v1/SKILL.md` | 112 | `MOD-WALIDACJA.md` + opis "bloki A–I" → `MOD-WALIDACJA_v2.md` + "bloki A–J" |

### CRIT-3a — dr-02: analiza-sadowa-v5 → analiza-sadowa-v6
Masowa zamiana w 17 modułach `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/`:

| Plik |
|------|
| `mod-KC-ubezpieczenia-szczegolowy.md` |
| `mod-KC-ubezpieczenia-framework.md` |
| `mod-KC-cywilne-szczegolowy.md` |
| `mod-PrUpad-prawo-upadlosciowe.md` |
| `mod-KRO-framework-szczegolowy.md` |
| `mod-KSH-kodeks-spolek-handlowych.md` |
| `mod-KC-zobowiazania-i-roszczenia.md` |
| `mod-KPC-windykacja-framework.md` |
| `mod-KPC-egzekucja-i-windykacja.md` |
| `mod-KSH-gospodarcze-szczegolowy.md` |
| `mod-KC-ubezpieczenia-umowne-OC-AC.md` |
| `mod-ustawa-cudzoziemcy.md` |
| `mod-KRO-framework-rodzinne.md` |
| `mod-KRO-rodzinny-i-opiekunczy.md` |
| `mod-KP-art943-mobbing.md` |
| `mod-KC-framework-cywilne.md` |
| `mod-KSH-framework-gospodarcze.md` |

### CRIT-3b — pisma-procesowe-v3: przewodnik-prawny-v1 → v2
| Plik | Linia | Zmiana |
|------|-------|--------|
| `pisma-procesowe-v3/modules/MOD-ROUTE.md` | 126 | `przewodnik-prawny-v1` → `przewodnik-prawny-v2` |

### WARN-5 — chronologia-sprawy-v1: description skrócony do 671 znaków
Description zredukowany z 1037 do 671 znaków (limit: 1024).

---

## CZĘŚĆ II — MAPY PLIKÓW I FOLDERÓW

### Legenda
```
📁  katalog
📄  plik .md / .yaml / .json / inne
🔑  SKILL.md (punkt wejścia skilla)
🗺️  MAPA-AKTOW.md / ROUTING-MAP.md
⚙️  plik konfiguracyjny / schematyczny
🎨  asset (JSX/HTML widget)
📦  moduł dziedzinowy (lazy-load)
🔗  adapter/stub (przekierowanie)
📊  plik CSV/macierzowy
🗃️  katalog archiwum
```

---

### analiza-sadowa-v6
**19 plików · 2 foldery · ~114 KB**

```
analiza-sadowa-v6/
├── 🔑 SKILL.md                                    (30 KB) — orchestrator, 4-przebiegowy model
└── 📁 references/
    ├── 📄 BLUEPRINT-SCHEMA.md                      (6 KB) — schemat blueprintu sprawy
    ├── 📄 PRZEBIEG-1-ekstrakcja.md                 (5 KB) — przebieg 1: ekstrakcja danych
    ├── 📄 PRZEBIEG-2-strukturalna.md               (8 KB) — przebieg 2: analiza strukturalna
    ├── 📄 PRZEBIEG-3-predykcja.md                  (6 KB) — przebieg 3: predykcja wyniku
    ├── 📄 WERYFIKACJA-DOWODOW.md                   (9 KB) — dwukrotna weryfikacja dowodów
    ├── 📄 filtry-analityczne.md                   (13 KB) — filtry: VSA/HUMINT/profilowanie
    ├── 📄 koszty-terminy.md                        (6 KB) — koszty KSCU + terminy
    ├── 📄 moduly-spec.md                           (9 KB) — moduły specjalistyczne
    ├── 📄 orzecznictwo.md                          (4 KB) — integracja orzeczeń
    ├── 📄 MOD-A.md                                 (3 KB) — moduł A: sąd I instancji
    ├── 📄 MOD-B.md                                 (1 KB) — moduł B: apelacja
    ├── 📄 MOD-C.md                                 (1 KB) — moduł C: postępowanie karne
    ├── 📄 MOD-D.md                                 (1 KB) — moduł D: postępowanie adm.
    ├── 📄 MOD-E.md                                 (1 KB) — moduł E: wykroczenia
    ├── 📄 MOD-F.md                                 (2 KB) — moduł F: egzekucja
    └── 📁 engines/
        ├── 📄 adversarial-litigation-analysis-v9.md (3 KB)
        ├── 📄 contradiction-case-analysis-v10.md    (3 KB)
        └── 📄 file-analysis-staged-engine.md        (2 KB)
```

---

### analizator-dowodow-v3
**37 plików · 6 folderów · ~176 KB**

```
analizator-dowodow-v3/
├── 🔑 SKILL.md                                    (14 KB) — orchestrator
├── 📄 README.md                                    (1 KB)
├── 📄 CHANGELOG.md                                 (2 KB)
├── 📁 modules/
│   ├── 📦 MD1-klasyfikacja.md                      (2 KB) — klasyfikacja dokumentu
│   ├── 📦 MD2-scoring.md                           (1 KB) — scoring dowodów A–D
│   ├── 📦 MD3a-walidacja-formalna.md               (1 KB)
│   ├── 📦 MD3b-walidacja-prawna.md                 (2 KB)
│   ├── 📦 MD3c-spojnosc.md                         (7 KB)
│   ├── 📦 MD4-pokrycie.md                          (1 KB) — pokrycie przesłanek
│   ├── 📦 MD5-terminy.md                           (1 KB)
│   ├── 📦 MD6-raport.md                            (1 KB)
│   ├── 📦 MP0-intake.md                            (1 KB)
│   ├── 📦 MP1-ekstrakcja.md                        (3 KB)
│   ├── 📦 MP2-katalog.md                           (2 KB)
│   ├── 📦 MP3-spojnosc.md                          (2 KB)
│   ├── 📦 MP4-moc-slabosci.md                      (2 KB)
│   ├── 📦 MP5-atak.md                              (2 KB)
│   ├── 📦 MP6-sledczy.md                          (15 KB) — analiza śledcza/profilowanie
│   ├── 📦 MP7-synteza.md                           (4 KB)
│   ├── 📦 MP8-dowody.md                            (1 KB)
│   ├── 📦 MP9-jakosc.md                            (4 KB)
│   ├── 📦 MP10-koszty.md                           (6 KB)
│   ├── 📦 MP11-rodo-cyber.md                      (10 KB)
│   ├── 📦 MP12-terminy.md                          (8 KB)
│   ├── 📦 MP13-synteza-faktyczna.md               (19 KB) — synteza faktyczna + CLAIM-VAL
│   └── 📦 MX-dziedziny.md                          (8 KB) — 25 dziedzin prawa
├── 📁 assets/
│   ├── 🎨 dashboard.html                          (29 KB) — widget HTML
│   ├── 🎨 widget-kreator.html                     (17 KB)
│   └── 🎨 AnalizaPism.jsx                          (1 KB)
├── 📁 references/
│   └── 📁 engines/
│       ├── 📄 contradictory-evidence-engine-v10.md
│       ├── 📄 evidence-driven-matrix.md
│       └── 📄 opponent-evidence-weakness-engine-v9.md
├── 📁 checklists/
│   ├── 📄 kontrola-jakosci.md
│   └── 📄 sprawa-pracownicza.md
└── 📁 templates/
    ├── 📄 matryca-dowodowa.md
    ├── 📄 pytania-do-swiadka.md
    └── 📄 raport-koncowy.md
```

---

### analizator-przepisow-v2
**2 pliki · 1 folder · ~40 KB**

```
analizator-przepisow-v2/
├── 🔑 SKILL.md                                    (32 KB) — analiza przepisów, orzecznictwo, vacatio
└── 📁 references/
    └── 📄 MOD-VACATIO-LEGIS.md                     (8 KB) — moduł vacatio legis
```

---

### analizator-umow-v1  ⚠️ NAPRAWIONY (CRIT-1, CRIT-2)
**26 plików · 1 folder · ~331 KB**

```
analizator-umow-v1/
├── 🔑 SKILL.md                                    (11 KB) — orchestrator, routing J0–J10+MA
│                                                  ✅ l.112: MOD-WALIDACJA_v2.md
│                                                  ✅ l.113: FAKTY_v2.md
│                                                  ✅ l.217: MOD-WALIDACJA_v2 · FAKTY_v2
└── 📁 references/
    ├── 📄 mod-J0-routing.md                        (6 KB) — router modułów J
    ├── 📦 mod-J1-najem.md                          (7 KB)
    ├── 📦 mod-J2-nieruchomosci.md                 (12 KB)
    ├── 📦 mod-J3-dystrybucja.md                    (6 KB)
    ├── 📦 mod-J4-finansowanie.md                   (6 KB)
    ├── 📦 mod-J5-umowy-wykonawcze.md               (6 KB)
    ├── 📦 mod-J6-it-konsorcjum.md                 (17 KB)
    ├── 📦 mod-J7-pzp.md                           (14 KB)
    ├── 📦 mod-J8-b2c.md                           (13 KB)
    ├── 📦 mod-J9-ip-prawa-autorskie.md            (14 KB)
    ├── 📦 mod-J10-ubezpieczenia.md                (12 KB)
    ├── 📦 mod-MA-transakcje.md                    (23 KB) — transakcje M&A
    ├── 📄 mod-core-checklist.md                   (24 KB) ✅ l.563: FAKTY_v2.md
    ├── 📦 b2b-podwykonawcze.md                    (22 KB) — PRIMARY: umowy B2B
    ├── 📦 umowy-o-prace.md                        (21 KB) — PRIMARY: umowy o pracę
    ├── 📦 zakaz-konkurencji.md                    (23 KB) — PRIMARY: zakaz konkurencji
    ├── 📄 mod-shared-ai-act.md                    (12 KB)
    ├── 📄 mod-shared-alt-drafts.md                (14 KB)
    ├── 📄 mod-shared-esg.md                       (11 KB)
    ├── 📄 mod-shared-fm-hardship.md               (12 KB)
    ├── 📄 mod-shared-lifecycle.md                 (10 KB)
    ├── 📄 mod-shared-neg-strategia.md              (9 KB)
    ├── 📄 mod-shared-rodo.md                      (10 KB)
    ├── 📄 mod-shared-ryzyko-kwant.md               (8 KB)
    └── 📄 mod-shared-wykladnia.md                 (10 KB)
```

---

### audyt-systemu-v3
**1 plik · 0 folderów · ~23 KB**

```
audyt-systemu-v3/
└── 🔑 SKILL.md                                    (23 KB) — wywołuj TYLKO na żądanie
```

---

### chronologia-sprawy-v1  ⚠️ NAPRAWIONY (WARN-5)
**7 plików · 3 foldery · ~34 KB**

```
chronologia-sprawy-v1/
├── 🔑 SKILL.md                                    (13 KB) ✅ description: 671 znaków (limit 1024)
├── 📁 assets/
│   └── 🎨 ChronologiaSprawy.jsx                   (6 KB) — widget React
├── 📁 references/
│   ├── 📄 BLUEPRINT-SCHEMA.md                      (1 KB)
│   ├── 📄 ekstrakcja-zdarzen.md                    (7 KB)
│   └── 📄 sprzecznosci-dat.md                      (7 KB)
└── 📁 upgrade-min8/
    ├── 📄 MIN8-UPGRADE.md                           (1 KB)
    └── 📄 QUALITY-CHECKLIST.md
```

---

### dr-01-ustroj-konstytucyjny-i-zrodla-prawa
**6 plików · 1 folder · ~16 KB**

```
dr-01-ustroj-konstytucyjny-i-zrodla-prawa/
├── 🔑 SKILL.md                                     (1 KB) — fasada DR-01
├── 🗺️ MAPA-AKTOW.md                                (1 KB) — lista aktów prawnych
└── 📁 modules/
    ├── 📦 mod-Konstytucja-TK-skarga-konstytucyjna.md (6 KB)
    ├── 📦 mod-USP-ustroj-sadow-powszechnych.md       (5 KB)
    ├── 📦 mod-ustawa-KRS-i-ustroj-wladzy.md          (1 KB)
    └── 📦 mod-ustawa-partie-polityczne-referendum.md (1 KB)
```

---

### dr-02-prawo-cywilne-rodzinne-gospodarcze  ⚠️ NAPRAWIONY (CRIT-3a)
**35 plików · 1 folder · ~136 KB**

```
dr-02-prawo-cywilne-rodzinne-gospodarcze/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/  [✅ analiza-sadowa-v5 → v6 we wszystkich poniżej]
    ├── 📦 mod-KC-framework-cywilne.md               (2 KB)
    ├── 📦 mod-KC-cywilne-szczegolowy.md             (4 KB)
    ├── 📦 mod-KC-zobowiazania-i-roszczenia.md       (2 KB)
    ├── 📦 mod-KC-framework-konsumenckie.md          (2 KB)
    ├── 📦 mod-KC-konsumenckie-szczegolowy.md        (5 KB)
    ├── 📦 mod-KC-framework-spadkowe.md              (3 KB)
    ├── 📦 mod-KC-spadki-ksiega4.md                  (3 KB)
    ├── 📦 mod-KC-ubezpieczenia-framework.md         (3 KB)
    ├── 📦 mod-KC-ubezpieczenia-szczegolowy.md       (6 KB)
    ├── 📦 mod-KC-ubezpieczenia-umowne-OC-AC.md      (3 KB)
    ├── 📦 mod-KRO-framework-rodzinne.md             (3 KB)
    ├── 📦 mod-KRO-framework-szczegolowy.md         (12 KB)
    ├── 📦 mod-KRO-rodzinny-i-opiekunczy.md          (3 KB)
    ├── 📦 mod-KSH-framework-gospodarcze.md          (2 KB)
    ├── 📦 mod-KSH-gospodarcze-szczegolowy.md        (5 KB)
    ├── 📦 mod-KSH-kodeks-spolek-handlowych.md       (2 KB)
    ├── 📦 mod-KPC-windykacja-framework.md          (11 KB)
    ├── 📦 mod-KPC-egzekucja-i-windykacja.md        (11 KB)
    ├── 📦 mod-KPC-windykacja-szczegolowy.md        (15 KB)
    ├── 📦 mod-PrUpad-prawo-upadlosciowe.md          (5 KB)
    ├── 📦 mod-KP-art943-mobbing.md                  (2 KB)
    ├── 📦 mod-ustawa-KRS-rejestr-sadowy.md          (1 KB)
    ├── 📦 mod-ustawa-UZNK-nieuczciwa-konkurencja.md (3 KB)
    ├── 📦 mod-ustawa-cudzoziemcy.md                 (6 KB)
    ├── 📦 mod-ustawa-deweloperska-ochrona-nabywcy.md(2 KB)
    ├── 📦 mod-ustawa-fundacje-stowarzyszenia.md     (2 KB)
    ├── 📦 mod-ustawa-kredyt-konsumencki.md          (2 KB)
    ├── 📦 mod-ustawa-prawa-konsumenta.md            (2 KB)
    ├── 📦 mod-ustawa-restrukturyzacja.md            (2 KB)
    ├── 📦 mod-ustawa-spoldzielnie.md                (2 KB)
    ├── 📦 mod-ustawa-timeshare.md                   (2 KB)
    ├── 📦 mod-ustawa-wlasnosc-lokali-spoldzielnia.md(2 KB)
    └── 📦 mod-ustawa-zastaw-rejestrowy.md           (2 KB)
```

---

### dr-03-prawo-karne-wykroczenia-egzekucja
**26 plików · 1 folder · ~143 KB**

```
dr-03-prawo-karne-wykroczenia-egzekucja/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-KK-KPK-framework-karne.md             (7 KB)
    ├── 📦 mod-KK-KPK-framework-szczegolowy.md       (9 KB)
    ├── 📦 mod-KK-kwalifikator-karnomaterialny.md   (25 KB) — największy moduł DR-03
    ├── 📦 mod-KPK-tryby-scigania.md                (10 KB)
    ├── 📦 mod-KK-cyberprzestepstwa-szczegolowy.md   (9 KB)
    ├── 📦 mod-KK-cyber-framework.md                (10 KB)
    ├── 📦 mod-KK-art267-269c-cyberprzestepstwa.md  (10 KB)
    ├── 📦 mod-KK-przemoc-domowa-framework.md        (4 KB)
    ├── 📦 mod-KK-przemoc-domowa-szczegolowy.md      (8 KB)
    ├── 📦 mod-KK-art207-przemoc-domowa.md           (4 KB)
    ├── 📦 mod-KK-stalking-framework.md              (3 KB)
    ├── 📦 mod-KK-stalking-szczegolowy.md            (6 KB)
    ├── 📦 mod-KK-art190a-stalking.md                (3 KB)
    ├── 📦 mod-KKS-karny-skarbowy-i-AML.md           (5 KB)
    ├── 📦 mod-KKW-kodeks-karny-wykonawczy.md        (5 KB)
    ├── 📦 mod-KW-KPW-framework-szczegolowy.md       (8 KB)
    ├── 📦 mod-KW-framework-wykroczenia.md           (3 KB)
    ├── 📦 mod-KW-kodeks-wykroczen.md                (3 KB)
    ├── 📦 mod-KK-kodeks-karny.md                    (1 KB)
    ├── 📦 mod-KK-art291-pranie-pieniedzy.md         (2 KB)
    ├── 📦 mod-ustawa-narkomania.md                  (2 KB)
    ├── 📦 mod-ustawa-fundusz-pomocy-pokrzywdzonym.md(2 KB)
    ├── 📦 mod-ustawa-komornicy-sadowi.md            (2 KB)
    └── 📦 mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych.md (2 KB)
```

---

### dr-04-prawo-pracy-zus-swiadczenia
**29 plików · 1 folder · ~95 KB**

```
dr-04-prawo-pracy-zus-swiadczenia/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-KP-framework-prawo-pracy.md           (2 KB)
    ├── 📦 mod-KP-kodeks-pracy.md                    (2 KB)
    ├── 📦 mod-KP-szczegolowy.md                     (7 KB)
    ├── 📦 mod-KP-mobbing-framework.md               (2 KB)
    ├── 📦 mod-KP-mobbing-szczegolowy.md             (4 KB)
    ├── 📦 mod-KPA-framework-admin.md                (2 KB)
    ├── 📦 mod-KPA-kpa-i-postepowanie-adm.md         (3 KB)
    ├── 📦 mod-KPA-admin-szczegolowy.md              (4 KB)
    ├── 📦 mod-SUS-framework-ZUS.md                  (4 KB)
    ├── 📦 mod-SUS-framework-ubezpieczen-spolecznych.md (5 KB)
    ├── 📦 mod-SUS-ubezpieczenia-spoleczne-ZUS.md    (4 KB)
    ├── 📦 mod-SUS-renty-emerytury-szczegolowy.md    (9 KB)
    ├── 📦 mod-KRUS-ubezpieczenie-spoleczne-rolnikow.md (4 KB)
    ├── 📦 mod-ustawa-rehabilitacja-niepelnosprawnosc-PFRON.md (6 KB)
    ├── 📦 mod-ustawa-ochrona-konkurencji-konsumentow.md (7 KB)
    ├── 📦 mod-ustawa-pomoc-spoleczna.md             (6 KB)
    ├── 📦 mod-ustawa-PIP-panstwowa-inspekcja-pracy.md (2 KB)
    ├── 📦 mod-ustawa-ZFSS.md                        (2 KB)
    ├── 📦 mod-ustawa-aktywny-rodzic.md              (2 KB)
    ├── 📦 mod-ustawa-minimalne-wynagrodzenie.md     (2 KB)
    ├── 📦 mod-ustawa-praca-tymczasowa.md            (2 KB)
    ├── 📦 mod-ustawa-rynek-pracy-sluzby-zatrudnienia.md (2 KB)
    ├── 📦 mod-ustawa-spory-zbiorowe.md              (2 KB)
    ├── 📦 mod-ustawa-swiadczenia-rodzinne.md        (2 KB)
    ├── 📦 mod-ustawa-swiadczenie-uzupelniajace-500.md (2 KB)
    ├── 📦 mod-ustawa-zwiazki-zawodowe.md            (2 KB)
    └── 📦 mod-ustawa-zwolnienia-grupowe.md          (2 KB)
```

---

### dr-05-prawo-administracyjne-sadowoadministracyjne
**13 plików · 1 folder · ~47 KB**

```
dr-05-prawo-administracyjne-sadowoadministracyjne/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-UDIP-dostep-informacji-publicznej.md  (6 KB)
    ├── 📦 mod-UPEA-egzekucja-administracyjna.md     (6 KB)
    ├── 📦 mod-ustawa-cudzoziemcy-framework.md       (6 KB)
    ├── 📦 mod-ustawa-cudzoziemcy-pobyt-praca.md     (6 KB)
    ├── 📦 mod-ustawa-cudzoziemcy-szczegolowy.md     (8 KB)
    ├── 📦 mod-ustawa-skargi-na-przewleklosc-postepowania.md (4 KB)
    ├── 📦 mod-ustawa-zaskarzanie-decyzji-wlasnosci.md (2 KB)
    ├── 📦 mod-ustawa-RPO.md                         (2 KB)
    ├── 📦 mod-ustawa-SKO.md                         (2 KB)
    ├── 📦 mod-ustawa-kontrola-administracji.md      (2 KB)
    └── 📦 mod-ustawa-petycje.md                     (2 KB)
```

---

### dr-06-podatki-finanse-publiczne-aml
**23 pliki · 1 folder · ~69 KB**

```
dr-06-podatki-finanse-publiczne-aml/
├── 🔑 SKILL.md                                     (1 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-PIT-CIT-VAT-framework.md              (6 KB)
    ├── 📦 mod-PIT-CIT-VAT-podatki-dochodowe-i-obrotowe.md (7 KB)
    ├── 📦 mod-OP-podatkowe-szczegolowy.md           (8 KB)
    ├── 📦 mod-KAS-kontrola-celno-skarbowa.md        (5 KB)
    ├── 📦 mod-UFP-finanse-publiczne-NIK-RIO.md      (6 KB)
    ├── 📦 mod-ustawa-akcyzowa-i-clo-UCC.md         (13 KB) — największy moduł DR-06
    ├── 📦 mod-prawo-bankowe.md                      (2 KB)
    ├── 📦 mod-ustawa-AML-instytucje-obowiazkowe.md  (1 KB)
    ├── 📦 mod-ustawa-BFG.md                         (1 KB)
    ├── 📦 mod-ustawa-CIT-szczegolowy.md             (1 KB)
    ├── 📦 mod-ustawa-KNF-nadzor.md                  (1 KB)
    ├── 📦 mod-ustawa-PCC.md                         (1 KB)
    ├── 📦 mod-ustawa-PIT-szczegolowy.md             (2 KB)
    ├── 📦 mod-ustawa-VAT-szczegolowy.md             (2 KB)
    ├── 📦 mod-ustawa-fundusze-inwestycyjne.md       (1 KB)
    ├── 📦 mod-ustawa-gry-hazardowe.md               (1 KB)
    ├── 📦 mod-ustawa-obligacje-i-instrumenty-fin.md (2 KB)
    ├── 📦 mod-ustawa-podatek-nieruchomosci.md       (1 KB)
    ├── 📦 mod-ustawa-podatek-spadkow-darowizn.md    (1 KB)
    ├── 📦 mod-ustawa-ryczalt-przychody.md           (1 KB)
    └── 📦 mod-ustawa-uslugi-platnicze.md            (1 KB)
```

---

### dr-07-zamowienia-publiczne-fundusze-ue
**16 plików · 1 folder · ~57 KB**

```
dr-07-zamowienia-publiczne-fundusze-ue/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-PZP-framework.md                      (8 KB)
    ├── 📦 mod-PZP-prawo-zamowien-publicznych.md     (8 KB)
    ├── 📦 mod-PZP-compliance-SWZ-OPZ.md             (7 KB)
    ├── 📦 mod-PZP-szczegolowy.md                    (9 KB)
    ├── 📦 mod-PrNotariat-notariat-rejestry.md       (5 KB)
    ├── 📦 mod-ustawa-arbitraz-mediacja-KPC-czesc5.md (6 KB)
    ├── 📦 mod-ustawa-NIK.md                         (2 KB)
    ├── 📦 mod-ustawa-PPP-partnerstwo-publiczno-prywatne.md (1 KB)
    ├── 📦 mod-ustawa-Prokuratorii-Generalnej.md     (1 KB)
    ├── 📦 mod-ustawa-RIO-regionalne-izby.md         (1 KB)
    ├── 📦 mod-ustawa-dyscyplina-finansow-publicznych.md (1 KB)
    ├── 📦 mod-ustawa-fundusze-UE-2021-2027.md       (2 KB)
    ├── 📦 mod-ustawa-koncesja-roboty.md             (1 KB)
    └── 📦 mod-ustawa-polityka-rozwoju.md            (1 KB)
```

---

### dr-08-samorzad-terytorialny-prawo-lokalne
**22 pliki · 1 folder · ~68 KB**

```
dr-08-samorzad-terytorialny-prawo-lokalne/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-USG-USP-USW-samorzad-terytorialny.md  (5 KB)
    ├── 📦 mod-MPZP-WZ-planowanie-przestrzenne.md    (5 KB)
    ├── 📦 mod-procedury-JST-statuty-regulaminy.md   (5 KB)
    ├── 📦 mod-nadzor-wojewody-RIO-legalnosc-uchwal.md (5 KB)
    ├── 📦 mod-skargi-na-prawo-miejscowe-WSA-NSA.md  (5 KB)
    ├── 📦 mod-lokalne-podatki-oplaty-taryfy.md      (5 KB)
    ├── 📦 mod-lokalne-dane-publiczne-RODO-BIP.md    (5 KB)
    ├── 📦 mod-akty-porzadkowe-bezpieczenstwo-lokalne.md (5 KB)
    ├── 📦 mod-dzienniki-urzedowe-BIP-publikacja.md  (5 KB)
    ├── 📦 mod-ustawa-kontrola-administracji-inspekcje.md (5 KB)
    ├── 📦 mod-ustawa-zarzadzanie-kryzysowe-ochrona-ludnosci.md (5 KB)
    ├── 📦 mod-ustawa-cmentarze.md                   (1 KB)
    ├── 📦 mod-ustawa-czystosc-porzadek-gminy.md     (1 KB)
    ├── 📦 mod-ustawa-dochody-JST.md                 (1 KB)
    ├── 📦 mod-ustawa-pracownicy-samorzadowi.md      (2 KB)
    ├── 📦 mod-ustawa-referendum-lokalne.md          (1 KB)
    ├── 📦 mod-ustawa-rewitalizacja.md               (2 KB)
    ├── 📦 mod-ustawa-transport-zbiorowy.md          (2 KB)
    ├── 📦 mod-ustawa-wod-kan.md                     (1 KB)
    └── 📦 mod-ustawa-zabytki.md                     (2 KB)
```

---

### dr-09-budownictwo-srodowisko-energia-transport
**28 plików · 1 folder · ~109 KB**

```
dr-09-budownictwo-srodowisko-energia-transport/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (1 KB)
└── 📁 modules/
    ├── 📦 mod-PrBud-framework.md                    (7 KB)
    ├── 📦 mod-PrBud-prawo-budowlane.md              (8 KB)
    ├── 📦 mod-PrBud-samowola-WZ-MPZP.md             (2 KB)
    ├── 📦 mod-POS-framework.md                      (8 KB)
    ├── 📦 mod-POS-framework-szczegolowy.md          (9 KB)
    ├── 📦 mod-POS-prawo-ochrony-srodowiska.md       (8 KB)
    ├── 📦 mod-UGN-framework-nieruchomosci.md        (5 KB)
    ├── 📦 mod-UGN-framework-szczegolowy.md         (12 KB)
    ├── 📦 mod-UGN-gospodarka-nieruchomosciami.md    (5 KB)
    ├── 📦 mod-PrEnergetyczne-URE-OZE.md             (5 KB)
    ├── 📦 mod-PrGeodezyjne-kartografia-wywlaszczenia.md (4 KB)
    ├── 📦 mod-PrWodne-gospodarka-sciekowa.md        (5 KB)
    ├── 📦 mod-ustawa-OOS-oceny-srodowiskowe.md      (2 KB)
    ├── 📦 mod-ustawa-lesna-lowiecka-ochrona-przyrody.md (5 KB)
    ├── 📦 mod-ustawa-odpadach-gospodarka-komunalna.md (5 KB)
    ├── 📦 mod-ustawa-transport-drogowy-kolejowy-lotniczy.md (5 KB)
    ├── 📦 mod-ustawa-charakterystyka-energetyczna.md (2 KB)
    ├── 📦 mod-ustawa-drogi-publiczne.md             (1 KB)
    ├── 📦 mod-ustawa-elektromobilnosc.md            (1 KB)
    ├── 📦 mod-ustawa-planowanie-przestrzenne.md     (2 KB)
    ├── 📦 mod-ustawa-prawo-gazowe.md                (2 KB)
    ├── 📦 mod-ustawa-transport-kolejowy.md          (2 KB)
    ├── 📦 mod-kodeks-morski.md                      (1 KB)
    ├── 📦 mod-prawo-geologiczne-gornicze.md         (1 KB)
    ├── 📦 mod-prawo-lotnicze.md                     (1 KB)
    └── 📦 mod-specustawa-drogowa.md                 (1 KB)
```

---

### dr-10-zdrowie-farmacja-zywnosc-rolnictwo
**27 plików · 1 folder · ~125 KB**

```
dr-10-zdrowie-farmacja-zywnosc-rolnictwo/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-PrFarm-framework.md                   (5 KB)
    ├── 📦 mod-PrFarm-GIF-WIF-framework.md           (9 KB)
    ├── 📦 mod-PrFarm-prawo-farmaceutyczne.md        (9 KB)
    ├── 📦 mod-PrFarm-szczegolowy.md                (20 KB) — największy moduł DR-10
    ├── 📦 mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny.md (5 KB)
    ├── 📦 mod-REACH-CLP-chemikalia.md              (12 KB)
    ├── 📦 mod-ustawa-dzialalnosc-lecznicza-pacjent.md (5 KB)
    ├── 📦 mod-ustawa-prawa-pacjenta-framework.md   (11 KB)
    ├── 📦 mod-ustawa-medyczne-szczegolowy.md        (8 KB)
    ├── 📦 mod-ustawa-zawody-medyczne-i-prawnicze.md (5 KB)
    ├── 📦 mod-ustawa-oswiata-szkolnictwo-wyzsze.md  (5 KB)
    ├── 📦 mod-ustawa-edukacja-specjalna-dostepnosc.md (4 KB)
    ├── 📦 mod-ustawa-sport-turystyka-imprezy-masowe.md (5 KB)
    ├── 📦 mod-ustawa-rolne-zywnosc-weterynaria.md   (5 KB)
    ├── 📦 mod-ustawa-bezpieczenstwo-zywnosci.md     (2 KB)
    ├── 📦 mod-ustawa-NFZ-swiadczenia.md             (2 KB)
    ├── 📦 mod-ustawa-RPP-prawa-pacjenta.md          (2 KB)
    ├── 📦 mod-ustawa-diagnostyka-laboratoryjna.md   (1 KB)
    ├── 📦 mod-ustawa-inspekcja-weterynaryjna.md     (1 KB)
    ├── 📦 mod-ustawa-jakosc-opieka-zdrowotna.md     (1 KB)
    ├── 📦 mod-ustawa-pielegniarka-polozna.md        (1 KB)
    ├── 📦 mod-ustawa-produkty-biobojcze.md          (1 KB)
    ├── 📦 mod-ustawa-wyroby-medyczne.md             (1 KB)
    ├── 📦 mod-ustawa-zawod-lekarza.md               (2 KB)
    └── 📦 mod-ustawa-zdrowie-psychiczne.md          (2 KB)
```

---

### dr-11-cyfrowe-cyber-ai-dane-ip
**22 pliki · 1 folder · ~70 KB**

```
dr-11-cyfrowe-cyber-ai-dane-ip/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (1 KB)
└── 📁 modules/
    ├── 📦 mod-AI-Act-framework.md                   (7 KB)
    ├── 📦 mod-RODO-framework.md                     (3 KB)
    ├── 📦 mod-RODO-GDPR-2016-679.md                 (3 KB)
    ├── 📦 mod-RODO-szczegolowy.md                   (8 KB)
    ├── 📦 mod-UODO-postepowanie-ochrona-danych.md   (6 KB)
    ├── 📦 mod-KSC-NIS2-cyberbezpieczenstwo-telekom.md (5 KB)
    ├── 📦 mod-PrAut-framework-IP.md                 (3 KB)
    ├── 📦 mod-PrAut-wlasnosc-intelektualna-IP.md    (3 KB)
    ├── 📦 mod-PrAut-media-internet-dobra-osobiste.md (5 KB)
    ├── 📦 mod-PrTelekom-poczta-UKE.md               (4 KB)
    ├── 📦 mod-DMA-digital-markets-act.md            (2 KB)
    ├── 📦 mod-DSA-digital-services-act.md           (2 KB)
    ├── 📦 mod-DORA-eIDAS-cyfrowe-finanse.md         (5 KB)
    ├── 📦 mod-EUCS-CRA-akty-regulacyjne-UE.md       (2 KB)
    ├── 📦 mod-MiCA-kryptoaktywa.md                  (2 KB)
    ├── 📦 mod-ustawa-informatyzacja-podmiotow-publicznych.md (2 KB)
    ├── 📦 mod-ustawa-otwarte-dane.md                (2 KB)
    ├── 📦 mod-ustawa-podpis-elektroniczny.md        (2 KB)
    ├── 📦 mod-ustawa-prawo-wlasnosci-przemyslowej.md (2 KB)
    └── 📦 mod-ustawa-uslugi-elektroniczne.md        (2 KB)
```

---

### dr-12-sadownictwo-prokuratura-zawody-prawnicze
**13 plików · 1 folder · ~43 KB**

```
dr-12-sadownictwo-prokuratura-zawody-prawnicze/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (2 KB)
└── 📁 modules/
    ├── 📦 mod-KSCU-koszty-sadowe-i-pomoc-prawna.md  (4 KB)
    ├── 📦 mod-KPC-arbitraz-mediacja-ADR.md          (4 KB)
    ├── 📦 mod-KPC-biegli-sadowi-opinie.md           (5 KB)
    ├── 📦 mod-PrProkuratura-organy-ochrony-prawa.md (4 KB)
    ├── 📦 mod-ustawa-sedziowie-referendarze-kuratorzy.md (5 KB)
    ├── 📦 mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow.md (6 KB)
    ├── 📦 mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF.md (6 KB)
    ├── 📦 mod-ustawa-adwokatura.md                  (2 KB)
    ├── 📦 mod-ustawa-radcowie-prawni.md             (2 KB)
    ├── 📦 mod-ustawa-notariat.md                    (2 KB)
    └── 📦 mod-ustawa-komornicy-sadowi-zawod.md      (1 KB)
```

---

### dr-13-sluzby-bezpieczenstwo-informacje-niejawne
**11 plików · 1 folder · ~46 KB**

```
dr-13-sluzby-bezpieczenstwo-informacje-niejawne/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (1 KB)
└── 📁 modules/
    ├── 📦 mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md (5 KB)
    ├── 📦 mod-ustawa-informacje-niejawne.md         (5 KB)
    ├── 📦 mod-ustawa-obrona-ojczyzny-mobilizacja.md (6 KB)
    ├── 📦 mod-ustawa-policja.md                     (5 KB)
    ├── 📦 mod-ustawa-sluzby-operacyjne-retencja-danych.md (4 KB)
    ├── 📦 mod-ustawa-straz-graniczna.md             (5 KB)
    ├── 📦 mod-ustawa-zandarmeria-wojskowa.md        (5 KB)
    ├── 📦 mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna.md (6 KB)
    └── 📦 mod-ustawa-szczegolne-srodki-zabezpieczajace.md (2 KB)
```

---

### dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka
**10 plików · 1 folder · ~30 KB**

```
dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/
├── 🔑 SKILL.md                                     (1 KB)
├── 🗺️ MAPA-AKTOW.md                                (1 KB)
└── 📁 modules/
    ├── 📦 mod-TFUE-TUE-prawo-pierwotne-UE.md        (5 KB)
    ├── 📦 mod-KPP-karta-praw-podstawowych-UE.md     (2 KB)
    ├── 📦 mod-EKPC-ETPC-prawa-czlowieka.md          (6 KB)
    ├── 📦 mod-PMPP-prawo-prywatne-miedzynarodowe.md (5 KB)
    ├── 📦 mod-KPC-egzekucja-transgraniczna-UE.md    (5 KB)
    ├── 📦 mod-ONZ-pakty-prawa-czlowieka.md          (2 KB)
    ├── 📦 mod-NATO-umowy-miedzynarodowe.md          (2 KB)
    └── 📦 mod-rejestr-zrodla-prawa-lifecycle.md     (2 KB)
```

---

### dr-15-compliance-iso-governance-audyt
**11 plików · 1 folder · ~45 KB**

```
dr-15-compliance-iso-governance-audyt/
├── 🔑 SKILL.md                                     (1 KB)
├── 🗺️ MAPA-AKTOW.md                                (1 KB)
└── 📁 modules/
    ├── 📦 mod-ISO-37301-compliance-management.md    (9 KB) — największy moduł DR-15
    ├── 📦 mod-ustawa-sygnalisci.md                 (12 KB)
    ├── 📦 mod-AML-nadzor-finansowy-instytucje.md    (5 KB)
    ├── 📦 mod-PZP-zamowienia-obronne-bezpieczenstwa.md (5 KB)
    ├── 📦 mod-ustawa-nauczyciele-uczelnie.md        (5 KB)
    ├── 📦 mod-DORA-compliance-sektor-finansowy.md   (2 KB)
    ├── 📦 mod-ISO-27001-bezpieczenstwo-informacji.md (2 KB)
    ├── 📦 mod-ISO-37001-antykorupcja.md             (2 KB)
    └── 📦 mod-ISO-42001-AI-management.md           (2 KB)
```

---

### dr-16-pisma-strategia-dowody-orzecznictwo
**13 plików · 1 folder · ~49 KB**

```
dr-16-pisma-strategia-dowody-orzecznictwo/
├── 🔑 SKILL.md                                     (2 KB)
├── 🗺️ MAPA-AKTOW.md                                (1 KB)
└── 📁 modules/
    ├── 📦 mod-KPC-e-doreczenia-portal-sadowy.md     (5 KB)
    ├── 📦 mod-KPC-procedury-UE-TSUE-ETPC.md         (4 KB)
    ├── 📦 mod-KPC-arbitraz-sportowy-dyscyplinarny.md (4 KB)
    ├── 📦 mod-KPC-przesluchanie-swiadkow.md         (4 KB)
    ├── 📦 mod-KPC-wzory-pism-procesowych.md         (2 KB)
    ├── 📦 mod-Konstytucja-prawa-i-wolnosci-procesowe.md (5 KB)
    ├── 📦 mod-narzedzie-kalkulatory.md              (5 KB)
    ├── 📦 mod-narzedzie-kontroler-kompletnosci.md   (3 KB)
    ├── 📦 mod-ustawa-archiwa-dokumentacja.md        (5 KB)
    ├── 📦 mod-ustawa-obywatelstwo-paszporty-ewidencja.md (4 KB)
    └── 📦 mod-ustawa-prawo-prasowe-media.md         (5 KB)
```

---

### orzeczenia-sadowe-v2
**2 pliki · 1 folder · ~35 KB**

```
orzeczenia-sadowe-v2/
├── 🔑 SKILL.md                                    (17 KB) — wyszukiwanie i weryfikacja orzeczeń
└── 📁 references/
    └── 🎨 widget.md                               (19 KB) — widget HTML orzeczeń
```

---

### pisma-procesowe-v3  ⚠️ NAPRAWIONY (CRIT-3b)
**30 plików · 5 folderów · ~103 KB**

```
pisma-procesowe-v3/
├── 🔑 SKILL.md                                    (23 KB) — model W1–W3, 3 wiadomości
└── 📁 modules/
    ├── 📦 MOD-ROUTE.md                             (5 KB) ✅ l.126: przewodnik-prawny-v2
    ├── 📦 MOD-ETAPY.md                             (4 KB) — etapy postępowania
    ├── 📦 MOD-PRAWO.md                             (6 KB) — prawo materialne
    ├── 📦 MOD-DOWODY.md                            (4 KB) — dowody
    ├── 📦 MOD-FAKTY.md                             (6 KB) — weryfikacja faktów
    ├── 📦 MOD-OPLATY.md                            (5 KB) — opłaty sądowe
    ├── 📦 MOD-ORZE.md                              (6 KB) — orzecznictwo
    ├── 📦 MOD-OBAL.md                              (5 KB) — obalanie dowodów
    ├── 📦 MOD-SZABLONY.md                          (9 KB) — szablony pism
    ├── 📦 MOD-ADMIN.md                             (6 KB) — postępowanie admin.
    ├── 🔗 MOD-WALIDACJA.md                         (2 KB) — adapter → shared/MOD-WALIDACJA_v2.md
    └── 📁 references/
        ├── 📁 checklists/
        │   ├── 📄 formal-validator.md
        │   └── 📄 opponent-pleading-audit-checklist-v9.md
        ├── 📁 engines/
        │   ├── 📄 pleading-engine-v8.md
        │   ├── 📄 appellate-engine-v8.md
        │   ├── 📄 admin-pleading-engine-v8.md
        │   ├── 📄 prosecution-complaint-engine-v8.md
        │   ├── 📄 rebuttal-drafting-engine-v9.md
        │   ├── 📄 opponent-pleading-attack-engine-v9.md
        │   ├── 📄 court-simulation-engine.md
        │   ├── 📄 theory-of-case-engine.md
        │   ├── 📄 contradiction-intelligence-engine-v10.md
        │   ├── 📄 cross-pleading-consistency-engine-v10.md
        │   ├── 📄 judicial-credibility-simulation-engine-v10.md
        │   ├── 📄 self-destructive-admissions-engine-v10.md
        │   ├── 📄 strategic-theory-collapse-engine-v10.md
        │   └── 📄 timeline-conflict-engine-v10.md
        └── 📁 templates/
            ├── 📄 pozew-expert-template.md
            └── 📄 odpowiedz-na-pozew-expert-template.md
```

---

### pisma-proste-v2
**21 plików · 1 folder · ~99 KB**

```
pisma-proste-v2/
├── 🔑 SKILL.md                                    (17 KB) — 10 typów prostych pism
└── 📁 references/
    ├── 🔗 HYBRID-VALIDATION.md                     (1 KB) — stub → shared/
    ├── 🔗 INTAKE-GAP.md                            (1 KB) — stub → shared/
    ├── 🔗 POST-VALIDATION.md                       (1 KB) — stub → shared/
    ├── 📄 terminy.md                               (1 KB) — stub → shared/terminy.md
    ├── 📄 M1-zasady.md                             (3 KB)
    ├── 📄 M2-intake.md                             (5 KB)
    ├── 📄 M3-weryfikacja.md                        (1 KB)
    ├── 📄 M4-struktura.md                          (3 KB)
    ├── 📄 M5-terminy.md                            (1 KB)
    ├── 📄 M6-oplaty.md                             (3 KB)
    ├── 📄 M7-eskalacja.md                          (2 KB)
    ├── 📄 M8-checklista.md                         (1 KB)
    ├── 📄 M9-format.md                             (5 KB)
    ├── 📦 SPA-sprzeciw.md                          (4 KB)
    ├── 📦 SPB-zarzuty.md                           (5 KB)
    ├── 📦 SPC-SPD-SPE.md                          (10 KB)
    ├── 📦 SPE-ostateczne.md                        (7 KB)
    ├── 📦 SPF-SPG.md                               (9 KB)
    └── 📦 SPH-inne.md                             (18 KB) — największy plik
```

---

### prawny-router-v3
**28 plików · 6 folderów · ~203 KB**

```
prawny-router-v3/
├── 🔑 SKILL.md                                    (10 KB) — orchestrator główny systemu
├── 📁 references/
│   ├── 🔗 MOD-WALIDACJA.md                         (1 KB) — adapter → shared/MOD-WALIDACJA_v2.md
│   ├── 🔗 HYBRID-VALIDATION.md                     (1 KB) — stub → shared/
│   ├── 🔗 ISAP-AUDIT-PROTOCOL.md                   (1 KB) — stub → shared/
│   ├── 🔗 ISAP-METRYKI-AKTOW.md                    (7 KB)
│   ├── 📄 KROK0A-anonimizer.md                     (5 KB) — krok 0A: anonimizacja
│   ├── 📄 KROK1-detekcja.md                        (9 KB) — krok 1: detekcja trybu LAIK/PRAWNIK
│   ├── 📄 ROUTING-BJ-BW.md                         (4 KB) — routing BJ/BW
│   ├── 📄 ROUTING-CONTRADICTION-INTELLIGENCE-V10.md (1 KB)
│   ├── 📄 ROUTING-OPPONENT-ANALYSIS-V9.md          (1 KB)
│   ├── 📄 SELF-CHECK.md                            (3 KB)
│   ├── 📄 HARD-GATES-ORZECZNICTWO.md               (1 KB)
│   ├── 📄 pokrycie-dziedzinowe.md                  (4 KB) — mapa 28 dziedzin prawa
│   ├── 📄 cyberprzestepstwa.md                     (9 KB)
│   ├── 📄 kwalifikator-karnomaterialny.md         (25 KB)
│   ├── 📄 mobbing-dyskryminacja.md                 (4 KB)
│   ├── 📄 przemoc-domowa.md                        (8 KB)
│   ├── 📄 przesluchanie-swiadkow.md                (4 KB)
│   ├── 📄 stalking-nekanie.md                      (6 KB)
│   ├── 📄 tryby-scigania.md                       (10 KB)
│   ├── 📄 wykroczenia.md                           (8 KB)
│   └── 📁 modules/
│       └── 📄 ROUTING-TO-DOMAIN-SKILLS.md          (1 KB)
├── 📁 assets/
│   └── 🎨 kreator-widget.html                     (18 KB)
└── 📁 anonimizer/                                 — subskill anonimizacji
    ├── 📄 anonimizer-skill.md                      (6 KB)
    ├── 📁 assets/
    │   ├── 🎨 AnonimizerPrawny.jsx                (28 KB)
    │   └── 🎨 anonimizer-widget.legacy.html       (31 KB)
    └── 📁 references/
        ├── 📄 BLUEPRINT-SCHEMA.md
        └── 📄 REGULY-ANONIMIZACJI.md
```

---

### prawo-polskie-v2
**2 pliki · 0 folderów · ~20 KB**

```
prawo-polskie-v2/
├── 🔑 SKILL.md                                     (3 KB) — fasada 16 dziedzin (DR-01..DR-16)
└── 🗺️ ROUTING-MAP.md                              (16 KB) — pełna mapa routingu
```

---

### prompt-master
**2 pliki · 1 folder · ~15 KB**

```
prompt-master/
├── 🔑 SKILL.md                                     (8 KB) — framework 7 warstw promptów
└── 📁 references/
    └── 📄 framework-7-warstw.md                    (7 KB)
```

---

### przesluchanie-swiadkow-v2-min90
**28 plików · 15 folderów · ~70 KB**

```
przesluchanie-swiadkow-v2-min90/
├── 🔑 SKILL.md                                    (18 KB)
├── 📄 README.md
├── 📄 CHANGELOG.md
├── 📄 MANIFEST.md
├── 📁 references/
│   ├── 📄 CROSS-EXAMINATION-GATE.md               (3 KB)
│   ├── 📄 QUESTION-ADMISSIBILITY-GATE.md          (3 KB)
│   ├── 📄 WITNESS-SCORING.md                      (2 KB)
│   ├── 📄 PRAWO-HARDGATE-WITNESS.md               (5 KB) — lokalny hard gate
│   ├── 📄 FACT-EVIDENCE-MAPPING.md
│   └── 📄 TEXT-FIRST-UI-GATE.md
├── 📁 assets/
│   └── 🎨 witness_examination_step_lazy.jsx       (15 KB)
├── 📁 typologies/
│   ├── 📁 witnesses/
│   │   └── ⚙️ witness-types.yaml
│   ├── 📁 judges/
│   │   └── ⚙️ judge-types.yaml
│   └── 📁 matrices/
│       └── 📄 witness-judge-matrix.md
├── 📁 schemas/
│   └── ⚙️ witness-blueprint.schema.json
├── 📁 templates/
│   ├── 📄 QUESTION-MAP-TEMPLATE.md
│   └── 📄 TEXT-OUTPUT-TEMPLATE.md
├── 📁 rules/
│   ├── ⚙️ router-policy.yaml
│   └── ⚙️ ui-render-policy.yaml
├── 📁 integration/
│   └── 📄 ROUTER-SNIPPET.md
├── 📁 components/
│   └── 📄 README.md
├── 📁 docs/
│   └── 📄 USAGE.md
├── 📁 examples/
│   └── ⚙️ example-blueprint.json
├── 📁 reports/
│   ├── 📄 FIX-REPORT.md
│   ├── 📄 MERGE-REPORT.md
│   ├── ⚙️ SOURCE-INVENTORY.json
│   └── ⚙️ STATIC-CHECKS.json
└── 📁 tests/
    └── 📄 REGRESSION-CASES.md
```

---

### przewodnik-prawny-v2
**5 plików · 3 foldery · ~42 KB**

```
przewodnik-prawny-v2/
├── 🔑 SKILL.md                                    (34 KB) — gospodarz sesji prawnej
├── 📁 assets/
│   └── 🎨 KreatorSprawy.jsx                        (6 KB)
├── 📁 references/
│   └── 📄 BLUEPRINT-SCHEMA.md                      (1 KB)
└── 📁 upgrade-min8/
    ├── 📄 MIN8-UPGRADE.md
    └── 📄 QUALITY-CHECKLIST.md
```

---

### raport-klienta-v1
**7 plików · 3 foldery · ~29 KB**

```
raport-klienta-v1/
├── 🔑 SKILL.md                                     (8 KB) — raport dla klienta IND/BIZ
├── 📁 assets/
│   └── 🎨 RaportKlienta.jsx                        (6 KB)
├── 📁 references/
│   ├── 📄 BLUEPRINT-SCHEMA.md                      (1 KB)
│   ├── 📄 jezyk-klienta.md                         (7 KB) — uproszczony język dla laika
│   └── 📄 sekcje-biznesowe.md                      (6 KB)
└── 📁 upgrade-min8/
    ├── 📄 MIN8-UPGRADE.md
    └── 📄 QUALITY-CHECKLIST.md
```

---

### raport-sytuacyjny-v2
**13 plików · 4 foldery · ~29 KB**

```
raport-sytuacyjny-v2/
├── 🔑 SKILL.md                                    (16 KB) — widget raportu sytuacyjnego
├── 📄 README.md
├── 📁 assets/
│   └── 🎨 RaportSytuacyjny.jsx                     (7 KB)
├── 📁 references/
│   ├── 📄 BLUEPRINT-SCHEMA.md                      (1 KB)
│   ├── 📄 CONTRADICTION-AND-GAP-GATE.md            (1 KB)
│   ├── 📄 HYBRID-VALIDATION.md                     (1 KB) — stub → shared/
│   ├── 📄 PROCEDURAL-RECOMMENDATION-GATE.md        (1 KB)
│   ├── 📄 PROCESS-RISK-MAP.md                      (1 KB)
│   └── 📄 SOURCE-STATUS-MATRIX.md                  (1 KB)
├── 📁 upgrade-min8/
│   ├── 📄 MIN8-UPGRADE.md
│   └── 📄 QUALITY-CHECKLIST.md
└── 📁 upgrade-min85/
    ├── 📄 MIN85-UPGRADE.md
    └── 📄 QUALITY-CHECKLIST-MIN85.md
```

---

### shared
**120 plików · 5 folderów aktywnych + archive · ~354 KB**

#### Moduły walidacyjne i faktów
```
shared/
├── 📄 MOD-WALIDACJA_v2.md                         (14 KB) ⭐ KANONICZNY — bloki A–J
├── 🔗 MOD-WALIDACJA.md                             (1 KB) — STUB → MOD-WALIDACJA_v2.md
├── 📄 HYBRID-VALIDATION.md                         (6 KB)
├── 📄 POST-VALIDATION.md                           (7 KB)
├── 📄 FACT-SOURCE-LOCK.md                         (12 KB) — FSL-A/B/C, via Blok J
├── 📄 LEGAL-STATUS-LOCK.md                        (17 KB) — LSL-1..6, via Blok J
├── 📄 FAKTY_v2.md                                 (11 KB) ⭐ KANONICZNY (nie FAKTY.md)
├── 📄 INTAKE-GAP.md                                (3 KB)
├── 📄 FORMAL-CHECK.md                              (3 KB)
├── 📄 BRAKI-FORMALNE.md                            (2 KB)
├── 📄 WARUNKI-SKUTECZNOSCI.md                      (2 KB)
├── 📄 QUALITY-CHECK.md                             (1 KB)
└── 📄 CLAIM-VALIDATION.md                          (7 KB)
```

#### Moduły terminów i procedury
```
├── 📄 terminy.md                                   (2 KB)
├── 📄 TERM-CALC.md                                 (2 KB)
├── 📄 TRYBY-PROCESOWE.md                           (2 KB)
├── 📄 PREKLUZJA-DOWODOWA.md                        (1 KB)
└── 📄 TEMPORAL-LAW-CHECK.md                        (1 KB)
```

#### Moduły dowodowe i orzecznicze
```
├── 📄 DOWODY-METODOLOGIA.md                        (1 KB)
├── 📄 ORZECZENIA-HIERARCHIA.md                     (1 KB)
├── 📄 ORZECZENIA-OUTPUT-SCHEMA.md                  (6 KB)
├── 📄 ROSZCZENIA.md                                (1 KB)
├── 📄 STRATEGIA-PROCESOWA.md                       (1 KB)
├── 📄 RISK-ASSESSMENT.md                           (1 KB)
├── 📄 EXPERT-OPINION-AUDIT.md                      (2 KB)
└── 📄 SYGNATURY.md                                 (6 KB)
```

#### Moduły prawa materialnego
```
├── 📄 PRAWO-HARDGATE.md                            (9 KB) ⭐ GLOBALNY HARD GATE
├── 📄 ISAP-AUDIT-PROTOCOL.md                       (1 KB)
├── 📄 ISAP-METRYKI-AKTOW.md                       (10 KB)
├── 📄 TEMPORAL-LAW-CHECK.md                        (1 KB)
├── 📄 MODULE-STANDARD-POLISH-LAW.md                (2 KB)
├── 📄 LEGAL-QUALITY-GATE.md                        (1 KB)
├── 📄 LEGAL-LIFECYCLE-MANAGEMENT.md                (2 KB)
├── 📄 LEGAL-REGISTRY.md                            (5 KB)
├── 📄 AKTY-PRAWNE-MASTER.md                       (15 KB)
└── 📄 WERYFIKACJA-SLAD.md                          (5 KB)
```

#### Moduły routingu i orchestracji
```
├── 📄 ACTIVATION-MATRIX.md                         (5 KB)
├── 📄 CROSS-DOMAIN-CONFLICT-ROUTER.md              (1 KB)
├── 📄 LEGAL-MATRIX-FIRST-GATE.md                   (1 KB)
├── 📄 HIERARCHICAL-COVERAGE-GATE.md                (1 KB)
├── 📄 OWN-LAW-UNITS-MATRIX-FIRST-GATE.md           (1 KB)
├── 📄 SECTORAL-MATRIX-FIRST-GATE.md                (1 KB)
└── 📄 raport-sytuacyjny-integracja.md              (2 KB)
```

#### Moduły pokrycia prawa polskiego
```
├── 📄 POLISH-LAW-COMPLETENESS-MATRIX.md            (3 KB)
├── 📄 POLISH-LAW-FINAL-COMPLETENESS-GATE.md        (2 KB)
├── 📄 POLISH-LAW-MAIN-MATRIX-INDEX.md              (3 KB)
├── 📄 POLISH-LAW-MAX-COVERAGE-STANDARD.md          (1 KB)
├── 📄 LEGAL-KNOWLEDGE-GRAPH.md                     (1 KB)
└── 📊 PRAWO-POLSKIE-FULL-MODULE-REGISTRY-A-IP.csv (30 KB)
```

#### Pliki CSV — matryce źródeł prawa
```
├── 📊 DOMAIN-ROUTER-MATRIX.csv                     (6 KB)
├── 📊 MATRIX-REGISTRY.csv                          (4 KB)
├── 📊 VOIVODESHIP-COVERAGE-MATRIX.csv             (11 KB)
├── 📊 VOIVODESHIP-LAW-SOURCE-MATRIX.csv            (3 KB)
├── 📊 LOCAL-GOVERNMENT-LAW-COVERAGE-MATRIX.csv     (3 KB)
├── 📊 LOCAL-LAW-SOURCE-MATRIX.csv                  (1 KB)
├── 📊 PROFESSIONS-DEEP-COVERAGE-MATRIX.csv         (5 KB)
├── 📊 UNITS-WITH-OWN-LEGAL-REGIMES-MATRIX.csv      (4 KB)
└── [+ 20 innych plików .csv — matryce sektorowe]
```

#### Moduły zarządzania systemem
```
├── 📄 DEPENDENCY-GRAPH.md                          (5 KB) — DOCS-ONLY, nie wywoływany
├── 📄 DEDUPLICATION-POLICY.md                      (4 KB)
├── 📄 CHANGELOG.md                                 (1 KB)
├── 📄 STATUS.md                                    (1 KB)
├── 📄 DISCLAIMER.md                                (6 KB)
├── 📄 KANCELARIA-WORKFLOW.md                       (1 KB)
└── 🔑 SKILL.md                                     (6 KB) — manifest katalogu
```

#### Moduły specjalistyczne / standardy
```
├── 📄 DISABILITY-FUNCTIONAL-ASSESSMENT.md          (2 KB)
├── 📄 DISCIPLINARY-PROCEEDINGS-STANDARD.md         (2 KB)
├── 📄 JUDICIARY-LEGAL-STANDARD.md                  (2 KB)
├── 📄 SOCIAL-SECURITY-LAW-STANDARD.md              (3 KB)
├── 📄 PROFESSIONAL-SELF-GOVERNMENT-DEEP-STANDARD.md (1 KB)
├── 📄 OFFICIAL-SOURCE-TIERING-PROTOCOL.md          (1 KB)
├── 📄 SOURCE-HIERARCHY-EQUIVALENCE-PROTOCOL.md     (2 KB)
├── 📄 LOCAL-SOURCE-EQUIVALENCE-PROTOCOL.md         (1 KB)
├── 📄 LOCAL-PUBLICATION-VALIDITY-CHECK.md          (1 KB)
├── 📄 MATRIX-COMPLETENESS-AUDIT-GATE.md            (1 KB) ⚠️ odwołania tylko z archive/
└── 📄 MATRIX-ROUTING-PRIORITY-RULES.md             (1 KB) ⚠️ odwołania tylko z archive/
```

#### Podkatalogi
```
├── 📁 checklists/
│   ├── 📄 contradiction-intelligence-checklist-v10.md
│   └── 📄 final-pleading-audit-v8.md
├── 📁 references/modules/
│   ├── 📄 LOCAL-LAW-AUDIT-GATE.md
│   ├── 📄 LOCAL-LAW-SOURCE-PROTOCOL.md
│   └── 📄 MULTI-LEVEL-POLISH-LAW-ROUTER.md
├── 📁 reports/                                    — raporty deweloperskie (nie ładowane)
│   ├── 📄 LEGAL-LIFECYCLE-UPDATE-2026-05-28.md
│   ├── 📄 RAPORT-STANDARYZACJA-PRAWA-POLSKIEGO-2026-05-28.md
│   ├── 📄 V8-RAPORT-ZMIAN.md
│   ├── 📄 V9-RAPORT-ZMIAN.md
│   ├── 📄 raport-deep-polish-law-2026-05-28.md
│   └── 📄 raport-duplikatow-po-deep-polish-law.md
└── 🗃️ archive/                                    — 43+ pliki nieaktywne (nie ładować)
```

---

## CZĘŚĆ III — PODSUMOWANIE SYSTEMU

### Statystyki całościowe
| Skill | Pliki | Foldery | Rozmiar |
|-------|-------|---------|---------|
| shared | 120 | 5 | 355 KB |
| analizator-umow-v1 | 26 | 1 | 331 KB |
| prawny-router-v3 | 28 | 6 | 203 KB |
| analizator-dowodow-v3 | 37 | 6 | 176 KB |
| dr-03-prawo-karne | 26 | 1 | 143 KB |
| dr-02-prawo-cywilne | 35 | 1 | 136 KB |
| analiza-sadowa-v6 | 19 | 2 | 114 KB |
| dr-10-zdrowie-farmacja | 27 | 1 | 125 KB |
| pisma-proste-v2 | 21 | 1 | 99 KB |
| pisma-procesowe-v3 | 30 | 5 | 103 KB |
| dr-09-budownictwo | 28 | 1 | 109 KB |
| przewodnik-prawny-v2 | 5 | 3 | 43 KB |
| dr-04-prawo-pracy | 29 | 1 | 95 KB |
| przesluchanie-swiadkow-v2-min90 | 28 | 15 | 71 KB |
| dr-11-cyfrowe-cyber-ai | 22 | 1 | 70 KB |
| dr-08-samorzad-terytorialny | 22 | 1 | 68 KB |
| dr-06-podatki | 23 | 1 | 69 KB |
| dr-07-zamowienia-publiczne | 16 | 1 | 57 KB |
| dr-05-prawo-adm | 13 | 1 | 47 KB |
| dr-15-compliance-iso | 11 | 1 | 45 KB |
| dr-12-sadownictwo | 13 | 1 | 43 KB |
| dr-13-sluzby | 11 | 1 | 46 KB |
| dr-16-pisma-strategia | 13 | 1 | 49 KB |
| analizator-przepisow-v2 | 2 | 1 | 40 KB |
| orzeczenia-sadowe-v2 | 2 | 1 | 35 KB |
| chronologia-sprawy-v1 | 7 | 3 | 34 KB |
| dr-14-prawo-ue | 10 | 1 | 30 KB |
| raport-klienta-v1 | 7 | 3 | 29 KB |
| raport-sytuacyjny-v2 | 13 | 4 | 29 KB |
| prawo-polskie-v2 | 2 | 0 | 20 KB |
| prompt-master | 2 | 1 | 16 KB |
| dr-01-ustroj | 6 | 1 | 16 KB |
| audyt-systemu-v3 | 1 | 0 | 23 KB |
| **RAZEM** | **~667** | **~71** | **~2.9 MB** |

### Kluczowe ścieżki kanoniczne
```
PRAWO-HARDGATE:      view /mnt/skills/user/shared/PRAWO-HARDGATE.md
MOD-WALIDACJA:       view /mnt/skills/user/shared/MOD-WALIDACJA_v2.md  ← NIE .md bez _v2
FAKTY:               view /mnt/skills/user/shared/FAKTY_v2.md          ← NIE FAKTY.md
HYBRID-VALIDATION:   view /mnt/skills/user/shared/HYBRID-VALIDATION.md
INTAKE-GAP:          view /mnt/skills/user/shared/INTAKE-GAP.md
terminy:             view /mnt/skills/user/shared/terminy.md
DISCLAIMER:          view /mnt/skills/user/shared/DISCLAIMER.md
SYGNATURY:           view /mnt/skills/user/shared/SYGNATURY.md
CLAIM-VALIDATION:    view /mnt/skills/user/shared/CLAIM-VALIDATION.md
WERYFIKACJA-SLAD:    view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md
raport-integracja:   view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
```

### Otwarte zadania (WARN — nie blokujące)
1. **DEPENDENCY-GRAPH.md** — uzupełnić o 19 brakujących plików (CLAIM-VALIDATION, WERYFIKACJA-SLAD, ORZECZENIA-OUTPUT-SCHEMA i inne)
2. **MATRIX-COMPLETENESS-AUDIT-GATE.md + MATRIX-ROUTING-PRIORITY-RULES.md** — rozważyć przeniesienie do `archive/` (odwołania tylko z archiwum)
3. **shared/SKILL.md** — rozszerzyć tabelę rejestru o pliki aktywne poza obecną listą
