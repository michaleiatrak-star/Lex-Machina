---
name: mod-AC-chemikalia-reach

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa chemicznego: karty charakterystyki (SDS), rozporządzenie REACH
  (1907/2006) i CLP (1272/2008). Stosuj ZAWSZE gdy użytkownik pyta o:
  - kartę charakterystyki (SDS, MSDS) — kiedy wymagana, jak zbudowana, kto musi
    sporządzić, jak przekazać odbiorcy
  - obowiązki producenta, importera lub dystrybutora chemikaliów na rynku UE/PL
  - rejestrację substancji lub mieszaniny w ECHA (REACH)
  - klasyfikację i oznakowanie substancji/mieszanin (CLP, piktogramy, zwroty H/P)
  - zezwolenia REACH (Annex XIV), ograniczenia (Annex XVII), SVHC
  - kontrolę Inspekcji Ochrony Środowiska lub PIP w zakresie chemikaliów
  - naruszenia przepisów REACH/CLP i sankcje (ustawa o substancjach chemicznych)
  Powiązane: mod-Y (środowisko/DŚU), mod-AA (farmaceutyczne), mod-Q (podatki
  akcyzowe na niektóre substancje), prawo-polskie-v2.
compatibility:
  tools:
    - web_search
    - web_fetch
---

# mod-AC — Chemikalia: REACH / CLP / Karta Charakterystyki (SDS)

## AKTY PRAWNE — WERYFIKUJ ZAWSZE NA ISAP / EUR-LEX

| Akt | Oznaczenie | Przedmiot |
|-----|-----------|-----------|
| Rozporządzenie REACH | (WE) nr 1907/2006 | Rejestracja, ocena, udzielanie zezwoleń |
| Rozporządzenie CLP | (WE) nr 1272/2008 | Klasyfikacja, oznakowanie, pakowanie |
| Ustawa o substancjach chem. | Dz.U. 2022 poz. 1816 t.j. | Przepisy krajowe, sankcje, nadzór |
| Rozporządzenie delegowane | (UE) 2020/878 | Aktualna struktura SDS (16 sekcji) |
| Rozporządzenie Biobójcze | (UE) nr 528/2012 | Produkty biobójcze |

> ⚠ Zawsze weryfikuj aktualność przepisów: https://echa.europa.eu i https://isap.sejm.gov.pl

---

## 1. KARTA CHARAKTERYSTYKI (SDS) — KIEDY WYMAGANA

### Obowiązek sporządzenia SDS (art. 31 REACH)

SDS jest **obowiązkowa** dla:

1. **Substancji** spełniających kryteria klasyfikacji jako niebezpieczne (CLP)
2. **Substancji** trwałych, bioakumulujących i toksycznych (PBT) lub vPvB
3. **Substancji** z listy SVHC (kandydackiej REACH Annex XIV)
4. **Mieszanin** sklasyfikowanych jako niebezpieczne (CLP)
5. **Mieszanin** niesklasyfikowanych, ale zawierających:
   - substancję SVHC > 0,1% w/w — SDS na żądanie odbiorcy
   - substancję PBT/vPvB > 0,1% w/w — SDS na żądanie odbiorcy

> **Uwaga:** Od 01.01.2023 r. format SDS oparty wyłącznie na rozp. 2020/878 (Annex II REACH zmieniony).

### Kto ma obowiązek sporządzenia SDS

| Rola w łańcuchu dostaw | Obowiązek |
|------------------------|-----------|
| Producent substancji | SDS przed wprowadzeniem na rynek |
| Importer (spoza UE) | SDS przed pierwszym wprowadzeniem do UE |
| Dystrybutor | Przekazanie SDS otrzymanej od producenta/importera |
| Dalszy użytkownik | Może sporządzić własny scenariusz narażenia (ES) |

---

## 2. STRUKTURA SDS — 16 SEKCJI (rozp. 2020/878)

```
SEKCJA  1 — Identyfikacja substancji/mieszaniny i identyfikacja przedsiębiorstwa
SEKCJA  2 — Identyfikacja zagrożeń (klasyfikacja CLP, zwroty H, piktogramy)
SEKCJA  3 — Skład/informacja o składnikach
SEKCJA  4 — Środki pierwszej pomocy
SEKCJA  5 — Postępowanie w przypadku pożaru
SEKCJA  6 — Postępowanie w przypadku niezamierzonego uwolnienia
SEKCJA  7 — Postępowanie z substancją i jej magazynowanie
SEKCJA  8 — Kontrola narażenia/środki ochrony indywidualnej (NDS/NDSCh)
SEKCJA  9 — Właściwości fizyczne i chemiczne
SEKCJA 10 — Stabilność i reaktywność
SEKCJA 11 — Informacje toksykologiczne
SEKCJA 12 — Informacje ekologiczne (trwałość, bioakumulacja, ekotoksyczność)
SEKCJA 13 — Postępowanie z odpadami (kody odpadów z rozp. 2014/955/UE)
SEKCJA 14 — Informacje dotyczące transportu (ADR/RID/IMDG/IATA)
SEKCJA 15 — Informacje dotyczące przepisów prawnych
SEKCJA 16 — Inne informacje (data sporządzenia, zmiany)
```

**Język SDS:** Musi być w języku oficjalnym państwa, w którym jest używana (w Polsce — **po polsku**, art. 31 ust. 5 REACH).

---

## 3. KLASYFIKACJA I OZNAKOWANIE (CLP)

### Główne klasy zagrożeń (piktogramy GHS)

| Piktogram | Symbol | Klasy zagrożeń |
|-----------|--------|----------------|
| GHS01 | 💥 | Materiały wybuchowe, nadtlenki org. |
| GHS02 | 🔥 | Łatwopalne (ciecze, gazy, ciała stałe) |
| GHS03 | ⭕ | Utleniające |
| GHS04 | 🔴 | Gazy pod ciśnieniem |
| GHS05 | ⚗️ | Działanie żrące (skóra, metal) |
| GHS06 | ☠️ | Toksyczność ostra (kat. 1–3) |
| GHS07 | ⚠️ | Szkodliwe, drażniące (kat. 4–5) |
| GHS08 | ❗ | Działanie szkodliwe na org. (CMR, PBT) |
| GHS09 | 🌿 | Środowisko wodne |

### Zwroty H i P
- **Zwroty H** (Hazard statements) — opis zagrożenia np. H225 „Wysoce łatwopalna ciecz i pary"
- **Zwroty P** (Precautionary statements) — środki ostrożności
- Pełna lista: Annex III CLP (rozp. 1272/2008)

---

## 4. REACH — REJESTRACJA SUBSTANCJI

### Progi rejestracyjne (art. 6–7 REACH)

| Ilość substancji (t/rok na producenta/importera) | Obowiązek |
|--------------------------------------------------|-----------|
| ≥ 1 tona | Rejestracja w ECHA (obowiązkowa) |
| < 1 tony | Brak obowiązku rejestracji (poza SVHC/Annex XIV) |
| Faza-in substancje | Terminy graniczne: 2010/2013/2018 (zakończone) |

> Substancja niezarejestrowana = **nie może być wprowadzana na rynek UE** (zasada „no data, no market").

### SVHC i Annex XIV (zezwolenia)

- **SVHC** (Substances of Very High Concern) — lista kandydacka ECHA; > 200 substancji (aktualizacja co 6 mies.)
- **Annex XIV** — lista substancji wymagających zezwolenia REACH (sunset date)
- **Annex XVII** — lista ograniczeń w stosowaniu i wprowadzaniu na rynek

---

## 5. OBOWIĄZKI W ŁAŃCUCHU DOSTAW

```
Producent / Importer
  ↓  sporządza SDS + rejestruje w ECHA (≥1 t/rok)
Dystrybutor
  ↓  przekazuje SDS bez zmian; może dodać sekcje jeśli jest dalszym użytkownikiem
Dalszy Użytkownik (DU)
  ↓  sprawdza zastosowanie na liście scenariuszy narażenia (ES)
  ↓  jeśli zastosowanie poza ES → powiadomienie ECHA lub własna ocena CSA/CSR
Użytkownik końcowy (nie DU)
     przechowuje SDS, stosuje środki ochrony z sekcji 8
```

---

## 6. NADZÓR I SANKCJE W POLSCE

### Organy kontrolne

| Organ | Zakres |
|-------|--------|
| **Inspekcja Ochrony Środowiska (GIOŚ/WIOŚ)** | Kontrola przestrzegania REACH/CLP |
| **Państwowa Inspekcja Pracy (PIP)** | NDS w miejscu pracy, SDS sekcja 8 |
| **Inspekcja Handlowa** | Oznakowanie produktów konsumenckich |
| **WSSE / Sanepid** | Substancje w żywności/kosmetykach |

### Sankcje (ustawa o substancjach chemicznych i ich mieszaninach)

- Brak SDS lub niepełna SDS: **grzywna do 50 000 zł** (art. 35 ustawy)
- Wprowadzenie substancji bez rejestracji REACH: **kara pieniężna GIOŚ**
- Naruszenie CLP: **do 50 000 zł** + ewentualnie art. 163 KK (sprowadzenie zagrożenia)
- Ponowne naruszenie: możliwość cofnięcia zezwolenia na prowadzenie działalności

> **Kwalifikator karny:** Jeśli naruszenie stwarza bezpośrednie zagrożenie dla zdrowia/życia → rozważ art. 163 §1 KK (sprowadzenie niebezpieczeństwa powszechnego) lub art. 182 KK (zanieczyszczenie środowiska).

---

## 7. POWIĄZANIA Z INNYMI MODUŁAMI

| Moduł | Powiązanie |
|-------|-----------|
| **mod-Y (środowisko)** | Ocena oddziaływania na środowisko substancji REACH; kody odpadów z SDS sekcja 13 |
| **mod-AA (farmaceutyczne)** | Substancje aktywne w lekach — równolegle REACH i Prawo farm. |
| **mod-Q (podatkowe)** | Podatek akcyzowy na niektóre substancje energetyczne i alkohol etylowy |
| **mod-AD (akcyza/cło)** | Klasyfikacja taryfowa CN substancji chemicznych przy imporcie |
| **mod-W (budowlane)** | SDS dla materiałów budowlanych (farby, kleje, uszczelniacze) |

---

## 8. ŚCIEŻKA WERYFIKACJI ONLINE (obowiązkowa)

```
1. Sprawdź listę SVHC (kandydacką):
   https://echa.europa.eu/candidate-list-table

2. Sprawdź Annex XIV (substancje wymagające zezwolenia):
   https://echa.europa.eu/authorisation-list

3. Sprawdź rejestrację substancji w bazie ECHA:
   https://echa.europa.eu/information-on-chemicals

4. Weryfikuj aktualność rozp. REACH i CLP:
   https://isap.sejm.gov.pl (implementacja UE w PL)
   https://eur-lex.europa.eu (teksty źródłowe UE)

5. NDS/NDSCh (sekcja 8 SDS):
   Rozporządzenie MRPiPS — weryfikuj na isap.sejm.gov.pl
```

---

*mod-AC-chemikalia-reach · v1.0 · 2026-05*
*Powiązane: mod-Y, mod-AA, mod-AD, mod-Q*
*Weryfikacja przepisów: echa.europa.eu + isap.sejm.gov.pl*

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- substancja/mieszanina;
- rola podmiotu;
- rejestracja/zezwolenie/ograniczenie;
- SDS;
- organ;
- łańcuch dostaw;

## 2. Mapa proceduralna

```text
Identyfikacja trybu i organu/sądu
  ↓
Kontrola terminu, doręczenia, właściwości i legitymacji
  ↓
Ustalenie faktów materialnych i proceduralnych
  ↓
Matryca dowodowa: fakt → dowód → ciężar dowodu → luka
  ↓
Dobór pisma/środka: wniosek / odwołanie / zażalenie / skarga / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: minimum, optimum, wariant eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb
□ właściwy organ albo sąd
□ termin liczony od prawidłowego zdarzenia
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z podstawą prawną
□ dowody przypisane do każdej tezy
□ kontrola opłat, odpisów, pełnomocnictw i podpisu
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz na dzień orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- karty charakterystyki;
- rejestracje;
- umowy dostaw;
- etykiety;
- korespondencja ECHA/organy;
- badania;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak danych produktu;
- zła rola w łańcuchu;
- nieaktualna SDS;
- ryzyko wycofania produktu;

## 6. Strategia procesowa

Zastosuj trzy warianty:

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia proceduralne, wadliwość ustaleń, niewłaściwą wykładnię, naruszenie zasady proporcjonalności albo praw strony.

### Wariant eskalacyjny
Zakłada przejście do organu II instancji, WSA/NSA, sądu powszechnego, SN, TSUE, ETPC albo organu sektorowego — tylko gdy wynika to z trybu.

## 7. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy moduł działa praktycznie, a nie opisowo?
□ Czy wskazano decydujący element prawny?
□ Czy oddzielono fakty od interpretacji?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy wskazano słabe punkty klienta?
□ Czy każdy przepis i Dz.U. ma kontrolę ISAP albo oznaczenie braku weryfikacji?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |
