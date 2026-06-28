# MODUŁY-MAPA — Mapa wczytywania skilli i modułów

> Wydzielono z pisma-procesowe-v3/SKILL.md (v5.2) — WARN-14 refaktoryzacja
> Wywołanie: `view /mnt/skills/user/pisma-procesowe-v3/references/MODULY-MAPA.md`
> Zawiera: matrycę aktywacji modułów per etap (W1.2, W2.4, W3, V10),
>   pliki kanoniczne shared (kolejność ładowania)

---

## MODUŁY — MAPA WCZYTYWANIA

```
MODUŁ                  WIADOMOŚĆ  KIEDY
─────────────────────────────────────────────────────────────────────────────
PRE-W1 — PRZYGOTOWANIE
─────────────────────────────────────────────────────────────────────────────
INTAKE-GAP             przed W1   gdy brak danych krytycznych
MOD-ETAPY              przed W1   gdy ≥10 dokumentów / akta wielotomowe /
                                   pismo wysokiego ryzyka (apelacja, AO,
                                   skarga kasacyjna); MOD-ETAPY OPAKOWUJE
                                   W1–W3: Etap 1–4 = przygotowanie W1,
                                   Etap 5 = W2, Etap 6 = W3; automat stanów
                                   obowiązuje identycznie wewnątrz MOD-ETAPY

─────────────────────────────────────────────────────────────────────────────
W1 — RAMA I STRATEGIA
─────────────────────────────────────────────────────────────────────────────
CLAIM-VALIDATION       W1.2a      zawsze gdy pismo opiera się na twierdzeniach
                                   faktycznych strony (praktycznie: zawsze);
                                   view /mnt/skills/user/shared/CLAIM-VALIDATION.md
MOD-DOKUMENT-ANOMALIE  W1.2d-PRE  gdy ≥2 dokumenty strony przeciwnej lub pracodawcy;
                                   ⛔ ZAWSZE gdy umowy o pracę / dokumenty XLSX /
                                   pisma strony przeciwnej z numerami rejestrowymi;
                                   DA-0→DA-5: krzyżowa weryfikacja KRS/NIP/REGON;
                                   view /mnt/skills/user/shared/MOD-DOKUMENT-ANOMALIE.md
MOD-WARIANTY-POZWU     W1.2b      gdy aktywny (≥2 aspekty główne / sygnał
                                   wieloznaczności / żądanie wariantów)
MOD-RED-TEAM-WLASNY    W1.6       gdy aktywny (wielopodmiotowość / ciągłość
                                   stosunku prawnego / roszczenie pieniężne /
                                   subsumcja złożona / dowód wieloznaczny)

─────────────────────────────────────────────────────────────────────────────
W2 — PROJEKT PISMA
─────────────────────────────────────────────────────────────────────────────
MOD-SZABLONY           W2.1       zawsze gdy redagujesz pismo
MOD-DOWODY             W2.1       gdy użytkownik dostarczył dowody/dokumenty
MOD-OBAL               W2.1       gdy riposta / odpowiedź na pozew / obalanie
MOD-OPLATY             W2.1       gdy pismo wszczynające postępowanie
MOD-ADMIN              W2.1       gdy sprawa adm./KPA/PPSA/WSA/NSA
MOD-TIMING             W2.1       gdy timing złożenia jest istotny (pierwsza
                                   rozprawa <14 dni / prekluzja / korzystne
                                   postanowienie); view shared/MOD-TIMING.md
MOD-DOKTRYNA           W2.1       gdy uzasadnienie powołuje komentarze lub
                                   literaturę prawniczą; view shared/MOD-DOKTRYNA.md
MOD-INTRO              W2.2       executive summary — zawsze przy: pozew /
                                   apelacja / pismo >3 str.; view shared/MOD-INTRO.md
MOD-ATAK-NA-DRAFT      W2.4       zawsze — bez warunku aktywacji

─────────────────────────────────────────────────────────────────────────────
W3 — WERYFIKACJA + WALIDACJA
─────────────────────────────────────────────────────────────────────────────
PODMIOT-GATE           W3.0       ⛔ ZAWSZE PIERWSZY w W3 — blokuje W3.1
MOD-PRAWO              W3.1       wbudowany w procedurę ⚠️Pn (hardgate + isap)
ISAP-AUDIT-PROTOCOL    W3.1       gdy akty mogły być nowelizowane między datą
                                   zdarzenia a datą pisma; view shared/ISAP-AUDIT-PROTOCOL.md
MOD-ORZE               W3.2       wbudowany w procedurę ⚠️On (→ orzeczenia-sadowe-v2)
ORZECZENIA-HIERARCHIA  W3.2       gdy pismo powołuje orzecznictwo; view shared/ORZECZENIA-HIERARCHIA.md
MOD-FAKTY / FAKTY_v2   W3.3       gdy pismo z dostarczonych materiałów źródłowych
MOD-WALIDACJA A–J      W3.4       zawsze — bloki A–J z triggerami per blok (patrz §W3.4)
LEGAL-QUALITY-GATE     W3.4/W3.6a bramka jakości prawa: PASS/WARN/FAIL
                                   view shared/LEGAL-QUALITY-GATE.md
MOD-KONCENTRACJA       W3.4(C)    ocena długości pisma per typ; view shared/MOD-KONCENTRACJA.md
QUALITY-CHECK          W3.4(C)    kontrola redakcyjna + logiczna; view shared/QUALITY-CHECK.md
RISK-ASSESSMENT        W3.4(F)    zawsze; view shared/RISK-ASSESSMENT.md
EXPERT-OPINION-AUDIT   W3.4(I)    gdy opinia biegłego w aktach; view shared/EXPERT-OPINION-AUDIT.md
HYBRID-VALIDATION      W3.5       zawsze — auto-raport braków
FORMAL-VALIDATOR       W3.5       uzupełnienie HYBRID; view references/checklists/formal-validator.md
COURT-SIMULATION       W3.6a K1   zawsze → zasila "Realizm sądowy" w AUDYT-KONCOWY
AUDYT-KONCOWY          W3.6a K3   zawsze — punktowy audyt 0-10, gate przed .docx
MOD-PEER-REVIEW        W3.7 K1    gdy: WPS>50k / ≥3 żądania / apelacja SN-SA /
                                   "adwokat diabła"; view shared/MOD-PEER-REVIEW.md
POST-VALIDATION        W3.7 K2    zawsze; view shared/POST-VALIDATION.md
UWAGI-REDAKCYJNE       W3.7 K3    ⛔ ZAWSZE — wbudowane w .docx jako ostatnia
                                   sekcja przed podpisem; kursywa 18pt kolor szary;
                                   zawierają: kwestie 🔴 do sprawdzenia przed
                                   złożeniem + kwestie 🟡 zalecane + założenia
                                   kalkulacyjne; bez warunku aktywacji

─────────────────────────────────────────────────────────────────────────────
ŚCIEŻKA TEST A — REDAKCJA (zamiast W1-W2-W3)
─────────────────────────────────────────────────────────────────────────────
MOD-REDAKCJA           Test A     gotowe pismo + prośba o styl/ton/długość;
                                   po R.4 zawsze: PODMIOT-GATE (dla podmiotów
                                   w redagowanym piśmie) + AUDYT-KONCOWY
                                   (uproszczony: kategorie Fakty i Spójność)
                                   + HYBRID-VALIDATION

─────────────────────────────────────────────────────────────────────────────
ENGINES SPECJALISTYCZNE — MATRYCA AKTYWACJI
─────────────────────────────────────────────────────────────────────────────
theory-of-case-engine  W1.2       aktywny gdy: pismo złożone (>2 roszczenia)
                                   LUB apelacja LUB sprawa wieloinstancyjna;
                                   buduje narrację PRZED mapą przesłanka→dowód;
                                   view references/engines/theory-of-case-engine.md

appellate-engine-v8    W1/W2      ⛔ OBOWIĄZKOWY gdy: typ pisma = apelacja /
                                   zażalenie / skarga kasacyjna; zastępuje
                                   ogólną strukturę W2.2 matrycą zarzutów;
                                   view references/engines/appellate-engine-v8.md

rebuttal-drafting-v9   W1/W2      aktywny gdy: typ pisma = riposta / odpowiedź
                                   na pozew / odpowiedź na apelację;
                                   view references/engines/rebuttal-drafting-engine-v9.md

admin-pleading-v8      W1/W2      aktywny gdy: sprawa adm. i pismo złożone
                                   (odwołanie + WSA lub NSA); uzupełnia MOD-ADMIN;
                                   view references/engines/admin-pleading-engine-v8.md

prosecution-v8         W1/W2      ⛔ OBOWIĄZKOWY gdy: zażalenie na prokuraturę /
                                   subsydiarny AO; zastępuje ogólną strukturę W2.2;
                                   view references/engines/prosecution-complaint-engine-v8.md

opponent-attack-v9     W1.2       aktywny gdy: mamy pismo przeciwnika DO OBALENIA
                                   (nie tylko jako kontekst); wywołaj PRZED MOD-OBAL;
                                   view references/engines/opponent-pleading-attack-engine-v9.md

OPPONENT-CHECKLIST     W1.2       wywołaj łącznie z opponent-attack-v9;
                                   view references/checklists/opponent-pleading-audit-checklist-v9.md

─────────────────────────────────────────────────────────────────────────────
ENGINES V10 — ANALIZA PISM PRZECIWNIKA (matryca aktywacji)
─────────────────────────────────────────────────────────────────────────────
Aktywuj WSZYSTKIE 6 engines V10 gdy spełniony ≥1 warunek:
  □ pismo oparte na analizie ≥2 pism procesowych przeciwnika, LUB
  □ sprawa trwa >6 miesięcy i przeciwnik złożył ≥3 pisma, LUB
  □ apelacja od wyroku niekorzystnego (potrzeba analizy uzasadnienia), LUB
  □ sprzeczności między pismami przeciwnika są kluczowym argumentem.

contradiction-v10      W1.2       view references/engines/contradiction-intelligence-engine-v10.md
self-destructive-v10   W1.2       view references/engines/self-destructive-admissions-engine-v10.md
timeline-conflict-v10  W1.2       view references/engines/timeline-conflict-engine-v10.md
cross-pleading-v10     W1.2       view references/engines/cross-pleading-consistency-engine-v10.md
strategic-collapse-v10 W1.2       view references/engines/strategic-theory-collapse-engine-v10.md
judicial-cred-v10      W1.2       view references/engines/judicial-credibility-simulation-engine-v10.md
```

Pliki kanoniczne shared (kolejność ładowania w W3):
```
view /mnt/skills/user/shared/MOD-STEP-TRACKER.md             (KROK 0-TRACKER, zawsze — ST-INIT przed pipeline)
view /mnt/skills/user/shared/PRAWO-HARDGATE.md
view /mnt/skills/user/shared/INTAKE-GAP.md
view /mnt/skills/user/shared/CLAIM-VALIDATION.md             (W1.2a, zawsze)
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
view /mnt/skills/user/shared/MOD-WALIDACJA_v2.md             (bloki A–J)
view /mnt/skills/user/shared/FAKTY_v2.md
view /mnt/skills/user/shared/FACT-SOURCE-LOCK.md             (Blok J prerequisite)
view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md            (Blok J prerequisite)
view /mnt/skills/user/shared/LEGAL-QUALITY-GATE.md           (W3.4/W3.6a — bramka jakości prawa)
view /mnt/skills/user/shared/POST-VALIDATION.md              (W3.7 K2 — zawsze)
view /mnt/skills/user/shared/MOD-PEER-REVIEW.md              (W3.7 K1 — warunkowo)
view /mnt/skills/user/shared/MOD-INTRO.md                    (W2.2 — pozew/apelacja/>3str)
view /mnt/skills/user/shared/MOD-KONCENTRACJA.md             (W3.4 Blok C — zawsze)
view /mnt/skills/user/shared/MOD-DOKTRYNA.md                 (W2.1 — gdy doktryna w uzasadnieniu)
view /mnt/skills/user/shared/MOD-TIMING.md                   (W2.1 — gdy timing istotny)
view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
view /mnt/skills/user/shared/MOD-WARIANTY-POZWU.md           (W1.2b, gdy aktywny)
view /mnt/skills/user/shared/MOD-RED-TEAM-WLASNY.md          (W1.6, gdy aktywny)
view /mnt/skills/user/shared/MOD-ATAK-NA-DRAFT.md            (W2.4, zawsze)
view /mnt/skills/user/shared/MOD-ATAK-NA-SWIADKA.md          (W2.4c, gdy ogniwa zeznaniowe w ŁD-n)
view /mnt/skills/user/shared/AUDYT-KONCOWY.md                (W3.6a, zawsze)
view /mnt/skills/user/shared/MOD-PRIORYTETY-ASPEKTOW.md      (wejście do W1.2b)
view /mnt/skills/user/shared/MOD-MAPA-PRZEPISOW.md           (Podstawa/Ryzyko w W1.2b)
view /mnt/skills/user/shared/MOD-HISTORIA-STRATEGII.md       (zapis wariantów W1.2b)
```

---

## INTEGRACJA Z INNYMI SKILLAMI

| Potrzeba | Skill | Kiedy |
|---|---|---|
| Orzecznictwo SN/SA (szerokie wyszukiwanie) | `orzeczenia-sadowe-v2` | W3.2 gdy wiele orzeczeń do weryfikacji |
| Analiza dowodów przed W1 | `analizator-dowodow-v3` | gdy duże akta, wiele dowodów |
| Analiza sprawy przed W1 | `analiza-sadowa-v6` | gdy użytkownik nie wie od czego zacząć |
| Proste pismo 1-wątkowe | `pisma-proste-v2` | po pozytywnym Teście A |
| Redakcja/poprawa gotowego pisma (styl, ton, długość) | MOD-REDAKCJA (ten skill) | po pozytywnym Teście C — bez W1-W2-W3 |
| Wyjaśnienie dla laika | `przewodnik-prawny-v2` | gdy użytkownik zagubiony |

---

