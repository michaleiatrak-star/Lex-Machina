---
name: analizator-dowodow-v3
version: "5.3.0"
type: executive-analiza
status: production
description: |
  Analizator dowodów procesowych v5 — pełny modularny zestaw (dowody + pisma).
  Stosuj gdy użytkownik: dostarcza dowody, dokumenty, zeznania, nagrania, maile,
  akta, pisma procesowe, decyzje lub korespondencję do oceny; pyta o siłę dowodów,
  hierarchię A–D, wartość procesową, pokrycie przesłanek lub spójność dowodów;
  chce oceny sprawy oczami sądu/przeciwnika/pełnomocnika; pyta o terminy procesowe
  (KPC/KPK/KPW/KPA/KP); chce ekstrakcji faktów, analizy śledczej (profilowanie,
  VSA, HUMINT), syntezy faktycznej, łańcuchów przyczynowych lub narracji procesowej;
  chce ustalić jakich dziedzin prawa dotyczy sprawa (MX: 25 dziedzin).
  Uruchamia widget graficzny z zakładką Sprzeczności (z prawem / między dok.).
  Nigdy nie oceniaj bez wystarczających informacji — pytaj najpierw.
compatibility: "web_search, bash, document_analysis"
changelog:
  - "5.3.0: MD3c kanoniczny z cites[]; nowy type:'intra' dedykowany dla INTRA-CONTRA; dashboard: filtr [INTRA] osobny, type-intra styl, typeLabel/typeCls zaktualizowane; §P3 spójna terminologia type vs prefix"
  - "5.2.0: Reguła Precyzji Detalu §P1–P3; INTRA-CONTRA; checklist 8-punktowy przed zakładką Sprzeczności; format [INTRA]/[CROSS]/[LEG]"
  - "5.1.0: centralny router — jeden decision tree, moduły wczytywane wyłącznie on-demand na podstawie sygnałów; eliminacja duplikacji reguł routingu"
  - "5.0.0: fuzja analizator-dowodow-v4 + analiza-pism-v4; nowy MX; warstwy D/P/DP"
  - "4.0.0: zakładka Sprzeczności z cytatami, M3b skanowanie sprzeczności z prawem"
---

# Analizator Dowodów Procesowych v5.1

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Przed każdą analizą z powołaniem na przepisy lub sygnatury: `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

> **Zasada nadrzędna:** Nigdy nie oceniam bez wystarczających informacji.
> Pytam zanim wystawię ocenę. Każdy alert zawiera podstawę prawną.
> Role: sędzia neutralny · pełnomocnik przeciwnika · Twój pełnomocnik
> · analityk śledczy (hipotezy tylko jako `[H-ŚLEDCZA]`).

---

## KROK 0 — BLOKADA WSTĘPNA

```
Materiał to: umowa / OWU / porozumienie / regulamin / ugoda kontraktowa
(i NIE jest jednym z wielu dowodów w sprawie sądowej)?
→ STOP. Przekieruj do analizator-umow-v1. Nie kontynuuj.
```

---

## KROK 1 — INTAKE I WIDGET

Uruchom widget kreator (zebranie danych od użytkownika):

```
view /mnt/skills/user/analizator-dowodow-v3/assets/widget-kreator.html
→ show_widget(...)
```

Po zebraniu danych przejdź do KROK 2.

---

## KROK 2 — CENTRALNY ROUTER

Odpowiedz na każde pytanie diagnostyczne (TAK/NIE/?) na podstawie materiału.
Każde TAK dodaje moduły do listy do wczytania. Na końcu wczytujesz TYLKO
moduły z tej listy — nic więcej.

---

### BLOK A — Charakter materiału

```
A1. Materiał zawiera dowody do oceny (dokumenty, nagrania, maile, zeznania)?
    TAK → dodaj: MD1, MD2

A2. Materiał zawiera pisma procesowe, akta lub narrację stron?
    TAK → dodaj: MP0, MP1

A3. Tylko pytanie o termin procesowy (bez analizy dowodów)?
    TAK → dodaj: MD5 · STOP (pomiń pozostałe bloki)
```

---

### BLOK B — Liczba i typ dokumentów

```
B1. Liczba dokumentów ≥ 3 LUB sprawa złożona wielowątkowa?
    TAK → dodaj: FAZA2-dashboard

B2. Liczba dokumentów ≥ 2?
    TAK → dodaj: MD3c (sprzeczności między dokumentami) [obowiązkowy]

B3. Materiał zawiera nagranie LUB wątpliwość co do legalności dowodu?
    TAK → dodaj: MD3b (walidacja prawna, zakazy dowodowe, art. 267 KK)

B4. Dokument może mieć wady formalne (kopia bez poświadczenia, brak pieczęci,
    brak podpisu, skan bez oryginału)?
    TAK → dodaj: MD3a (walidacja formalna)
```

---

### BLOK C — Zakres analizy dowodowej

```
C1. Użytkownik pyta o luki w materiale / brakujące dowody / pokrycie przesłanek?
    TAK → dodaj: MD4

C2. W materiale pada data doręczenia, ogłoszenia wyroku lub inna data krytyczna?
    TAK → dodaj: MD5

C3. Potrzebny raport końcowy / podsumowanie dowodowe?
    TAK → dodaj: MD6
```

---

### BLOK D — Zakres analizy pism (tylko jeśli A2=TAK)

```
D1. Materiał zawiera twierdzenia stron, narrację, sprzeczne wersje zdarzeń?
    TAK → dodaj: MP3 (kolizje i sprzeczności narracyjne)

D2. Użytkownik pyta o mocne/słabe strony, pozycję procesową, szanse?
    TAK → dodaj: MP4

D3. Użytkownik pyta o strategię ataku / obrony / riposty LUB sprawa
    ma wyraźnego przeciwnika procesowego?
    TAK → dodaj: MP5

D4. Potrzebna ocena prawna per roszczenie/zarzut, ciężar dowodu, znamiona?
    TAK → dodaj: MP2
    (UWAGA: MP2 zawiera katalog dziedzinowy — wczytaj MX przed MP2)

D5. Potrzebny raport końcowy z predykcją i rekomendacjami?
    TAK → dodaj: MP7

D6. Potrzebna matryca dowodowa (admissibility, chain of custody)?
    TAK → dodaj: MP8
```

---

### BLOK E — Moduły specjalistyczne (wczytuj TYLKO gdy sygnał obecny)

```
E1. Pytanie o „logikę zdarzeń" / „co z czego wynika" / „narrację procesową"
    / „powiązanie faktów" / łańcuchy przyczynowe LUB sprawa złożona ≥2 dok.?
    TAK → dodaj: MP13 (synteza faktyczna — 442 linie, wczytuj świadomie)

E2. Podejrzenie manipulacji, ukrytych motywacji, kłamstwa, zaplanowanego działania
    LUB sprawa karna LUB użytkownik pyta o profilowanie / zachowanie stron?
    TAK → dodaj: MP6 (techniki śledcze — 457 linii, wczytuj świadomie)

E3. Materiał dotyczy RODO, monitoringu pracownika, danych osobowych,
    dostępu do kont/urządzeń, art. 267 KK?
    TAK → dodaj: MP11

E4. Użytkownik pyta o koszty sądowe, opłacalność postępowania, próg ekonomiczny?
    TAK → dodaj: MP10

E5. W materiale pada wiele dat krytycznych / terminów sądowych do śledzenia?
    TAK → dodaj: MP12

E6. Konieczna kontrola jakości / audyt antyhalucynacyjny analizy?
    TAK → dodaj: MP9
```

---

### BLOK F — Wykrywanie dziedzin prawa

```
F1. Analiza dotyczy oceny prawnej (D4=TAK) LUB sprawa obejmuje wiele reżimów
    prawnych LUB użytkownik pyta o dziedziny prawa?
    TAK → wczytaj MX przed MP2
         view /mnt/skills/user/analizator-dowodow-v3/modules/MX-dziedziny.md
         Wynik MX uzupełni moduły specjalistyczne (np. MP11 dla RODO/CYBER,
         MP6 dla [KARNE-ZN], MD3b dla [PRAC-ROZW]).

F2. MX wykrył dziedzinę karną [KARNE-ZN]?
    TAK → aktywuj kwalifikator: prawo-polskie-v2 (rozbicie na znamiona)
```

---

### BLOK G — Tryb minimalny (kiedy NIE wczytywać modułów P)

```
Jeśli użytkownik zadaje JEDNO konkretne pytanie (np. „czy ten dowód jest silny",
„ile mam czasu na apelację", „co znaczy ten zapis") i NIE prosi o pełną analizę:
→ odpowiedz inline bez wczytywania modułów
→ wczytaj maksymalnie 1–2 moduły jeśli niezbędne do precyzyjnej odpowiedzi
→ NIE uruchamiaj dashboardu ani MP7/MD6
```

---

## KROK 3 — WYKONANIE

Po ustaleniu listy modułów z KROK 2:

1. Wczytaj moduły **jeden po drugim** w kolejności:
   `MX (jeśli F1) → MD1 → MP0 → MP1 → MD2 → MD3* → MP2 → MP3 → MD4 → MP4 → MP5 → MD5 → MP8 → MP10→MP11→MP12 → MP13 → MP6 → MD6/MP7 → MP9`

2. Prowadź analizę zgodnie z instrukcjami każdego wczytanego modułu.

3. Moduły **nigdy nie wczytywane domyślnie** (tylko gdy sygnał z BLOK E):
   - MP6 — techniki śledcze (457 linii)
   - MP13 — synteza faktyczna (442 linie)
   - MP11 — RODO/cyber (292 linie)
   - MP12 — terminy kalendarz (256 linii)
   - MP10 — koszty (203 linie)
   - MP9 — kontrola jakości (103 linie)

---

## KROK 4 — DASHBOARD (jeśli B1=TAK)

```
view /mnt/skills/user/analizator-dowodow-v3/assets/dashboard.html
→ show_widget(widget_code=<treść>, title="analizator_dowodow_dashboard",
              loading_messages=["Buduję dashboard dowodów...",
                                "Wczytuję sprzeczności...",
                                "Kalkuluję pozycję procesową..."])
```

Tablice do wypełnienia: `evidence[]` · `alerts_data{}` · `coverage_data[]`
· `gaps[]` · `terminy[]` · `recs[]` · `contradictions[]` (typy: `legal|intra|inter|doubt`) · `dziedziny[]`

---

## OBSŁUGA PLIKÓW

| Typ | Poziom | Sygnały dla routera |
|-----|--------|---------------------|
| PDF protokół urzędowy | A | — |
| Zdjęcie dokumentu | C | pytaj o oryginał |
| E-mail / SMS | C | sprawdź metadane |
| Nagranie | C | **B3=TAK** (MD3b obowiązkowy) |
| Skan umowy jako dowód | C | B4=TAK + B3=TAK |
| Pismo procesowe | — | **A2=TAK** |
| Akt oskarżenia | — | A2=TAK + **F2=TAK** (kwalifikator karny) |

---

## INTEGRACJE

| Kiedy | Skill |
|-------|-------|
| Dokument kontraktowy (nie jako dowód) | `analizator-umow-v1` |
| Głębsza analiza karna | `analiza-sadowa-v6` |
| Pismo po analizie | `pisma-procesowe-v3` |
| Orzecznictwo | `orzeczenia-sadowe-v2` |
| Weryfikacja przepisu | `analizator-przepisow-v2` |
| Chronologia wielu dok. | `chronologia-sprawy-v1` |
| Świadkowie | `przesluchanie-swiadkow-v2` |
| Raport stanu sprawy | `raport-sytuacyjny-v2` (po MD6/MP7) |
| Raport dla klienta | `raport-klienta-v1` |
| Eksport .docx | HYBRID-VALIDATION → `docx` |

---

## ZASADY STYLU

**Zawsze:** ocena siły = liczba + uzasadnienie · alert = `[⚠ KOD-N]` + podstawa
+ rekomendacja · sprzeczność = cytat + lokalizacja + status · luka = konkretne
uzupełnienie · terminy zawite oznaczone ⚠ ZAWITY · przepisy weryfikuj w ISAP.

**Nigdy:** ocena bez kryteriów · pominięcie alertu legalności nagrań · mylenie
terminów instrukcyjnych z zawitymi · orzeczenia z pamięci · sugerowanie że
analiza zastępuje poradę prawnika · LEG-CONTRA bez weryfikacji w ISAP.

**Progi jakości — analiza niedopuszczalna gdy:** wnioski bez źródła · cytaty
mieszane z parafrazą · nieweryfikowane orzeczenia · hipoteza śledcza jako fakt
· pominięty najmocniejszy kontrargument · łańcuch MP13 bez ID z MP1 · narracja
bez wersji przeciwnika · raport bez testu spójności (MP13 §13.7) gdy MP13 aktywny.

---

## REGUŁA PRECYZJI DETALU — obowiązkowa przy każdej analizie

### §P1 — Sprzeczności wewnątrz jednej strony (INTRA-CONTRA)

Przy analizie wielodokumentowej każda strona może zmienić narrację między pismami.
Obowiązek: porównywać twierdzenia tej samej strony **pismo po piśmie**, nie tylko
twierdzenia stron między sobą. Sprzeczność wewnętrzna = zmiana wersji przez tę
samą stronę w różnych dokumentach/terminach.

Przykład kanoniczny (sprawa VII P 94/25):
- Odp. na pozew (kwiecień 2025): konto = `m.wiatrak.humanpark@gmail.com`
  → Pozwana kwalifikuje jako konto pracownicze na domenie humanpark.
- Pismo procesowe (czerwiec 2025): „Powód stworzył PRYWATNEGO maila z dopiskiem
  @humanpark.pl" → Pozwana zmienia kwalifikację na prywatne konto Powoda.
- WYNIK: dwie wykluczające się charakterystyki tego samego konta w dwóch pismach
  tej samej strony → INTRA-CONTRA klasy KRYTYCZNEJ.

### §P2 — Checklist precyzji detalu

Przed wygenerowaniem każdej zakładki „Sprzeczności" wykonaj:

```
[ ] Czy ta sama strona zmienia opis faktyczny między pismami?
[ ] Czy daty w dokumentach są spójne (np. data podpisania vs data odbioru)?
[ ] Czy kwoty są identyczne we wszystkich dokumentach (np. 1 000 zł vs 1 060 zł)?
[ ] Czy nazwy własne (adresy e-mail, nazwy firm, imiona) są identyczne wszędzie?
[ ] Czy kwalifikacja prawna faktu jest spójna (np. zaliczka vs nienależne środki)?
[ ] Czy domena/serwer konta mailowego jest spójna z jego kwalifikacją jako służbowe?
[ ] Czy chronologia zdarzeń jest możliwa (daty → terminy → działania)?
[ ] Czy twierdzenia o świadkach są spójne (rola, zależność, adres doręczeń)?
```

### §P3 — Format INTRA-CONTRA w dashboardzie

Sprzeczności wewnętrzne oznaczać typem `intra` (dedykowany typ — nie `inter`):
- `[INTRA]` — `type:'intra'` — zmiana narracji tej samej strony
- `[CROSS]` — `type:'inter'` — sprzeczność między twierdzeniami różnych stron
- `[LEG]`   — `type:'legal'` — sprzeczność z przepisem prawa
- `[DOUBT]` — `type:'doubt'` — wątpliwość nierozstrzygnięta

Każda INTRA-CONTRA musi zawierać:
1. Cytat z dokumentu pierwszego (z lokalizacją: str./data pisma)
2. Cytat z dokumentu drugiego (z lokalizacją: str./data pisma)
3. Konkretną rozbieżność (co dokładnie się zmienia: słowo, liczba, kwalifikacja)
4. Rekomendację procesową: jak atakować tę sprzeczność na rozprawie

---

## TRYB ETAPOWY DLA OBSZERNYCH MATERIAŁÓW

Przy dużej liczbie dokumentów nie generuj od razu konkluzji końcowej. Dziel analizę na etapy:

```
1. inwentarz dokumentów,
2. ekstrakcja faktów,
3. matryca dowodowa,
4. sprzeczności i luki,
5. ocena siły dowodowej,
6. tezy procesowe,
7. raport końcowy.
```

Jeżeli analiza ma prowadzić do pisma procesowego, wynik przekaż do `pisma-procesowe-v3`,
a nie twórz finalnego pisma bez audytu.
---

## DODATEK V10 — CONTRADICTION INTELLIGENCE

Przy analizie pism przeciwnika obowiązkowo uruchom moduły V10:
- contradiction-intelligence-engine-v10,
- self-destructive-admissions-engine-v10,
- timeline-conflict-engine-v10,
- cross-pleading-consistency-engine-v10,
- strategic-theory-collapse-engine-v10,
- judicial-credibility-simulation-engine-v10.

Hard gate: nie przygotowuj repliki, odpowiedzi, apelacji ani zażalenia bez sprawdzenia, czy przeciwnik nie zawarł w swoich pismach twierdzeń wzajemnie sprzecznych, dorozumianych przyznań albo twierdzeń szkodliwych dla własnej teorii sprawy.

---

## Integracja z kancelaryjnym jądrem shared

Jeżeli wynik tego skilla ma służyć do pisma, strategii procesowej, oceny ryzyka albo decyzji terminowej, wczytaj właściwe moduły shared:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Nie dubluj logiki shared w lokalnych plikach. Lokalne moduły mogą tylko doprecyzować analizę dziedzinową.

---

## Twarda integracja dowodowa shared

Przy analizie dowodów obowiązkowo wczytaj:

```text
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
```

Raport dowodowy musi wskazywać: fakt istotny, przesłankę prawną, dowód główny, dowody wspierające, lukę, kontrargument i ryzyko pominięcia.
