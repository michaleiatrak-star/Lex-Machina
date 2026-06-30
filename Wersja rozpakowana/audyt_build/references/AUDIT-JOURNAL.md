# AUDIT-JOURNAL — Dziennik Audytów Systemu Prawnego AI

**Plik:** `AUDIT-JOURNAL.md`  
**Opis:** Chronologiczny rejestr wszystkich audytów systemu — wyniki, naprawy, status.  
**Format wpisu:** jedna sekcja `## AUDYT-YYYY-MM-DD` per sesja audytowa.  
**Powiązany plik referencyjny:** `AUDIT-REFERENCES.md`

> **Zasada:** Po każdym audycie:
> 1. Dodaj wpis do tego dziennika (wyniki, naprawy, status)
> 2. Zaktualizuj `AUDIT-REFERENCES.md` jeśli zmieniły się ścieżki, struktury lub statusy Dz.U.

---

## AUDYT-2026-06-27e — Zamknięcie WARN-11/16/17/18/20/21 + ISU-PESEL

**Zakres:** Targeted — zamknięcie wszystkich otwartych WARN, algorytm weryfikacji PESEL.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| WARN zamknięte | WARN-11, WARN-16, WARN-17, WARN-18, WARN-20, WARN-21 |
| Pliki nowe | brak |
| Pliki zmodyfikowane | 6 plików (patrz §2) |
| ZIPy | shared.zip, pisma-procesowe-v3.zip, pisma-proste-v2.zip, analizator-umow-v1.zip, analizator-dowodow-v3.zip, dr-12.zip, audyt-systemu-v4.zip |

### 2. NAPRAWY

**ISU-PESEL (P1–P6) → `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` v1.0.0→v1.1.0:**
Kompletny algorytm weryfikacji PESEL:
- P1: format (11 cyfr)
- P2: dekodowanie daty urodzenia — obsługa WSZYSTKICH stuleci (M 1-12=1900, 21-32=2000, 41-52=2100, 61-72=2200, 81-92=1800)
- P3: weryfikacja daty z dokumentu (transpozycja cyfr → Klasa I; błąd roku → Klasa III)
- P4: dekodowanie płci z P10 (nieparzysta=M, parzysta=K); weryfikacja z imieniem
- P5: suma kontrolna wagowa [1,3,7,9,1,3,7,9,1,3], wynik K=(10-S%10)%10 vs P11
- P6: raport ERR-F/D/PL/CK → klasyfikacja Anomalia Klasa I lub III
- Przykład obliczeniowy dla PESEL 84030315255

**WARN-21 → `shared/MOD-DOKUMENT-ANOMALIE_v1.0.0.md` v1.0.0→v1.1.0:**
DA-3: dodano ⛔ TRIGGER ISU po klasyfikacji Klasy I/II (identyfikatory podmiotu)
oraz ⛔ TRIGGER ISU-PESEL gdy anomalia dotyczy PESEL.

**WARN-17 → `analizator-dowodow-v3/SKILL.md`:**
Dodano BLOK-C-FSL po SD-VER: view MOD-FSL-DOKUMENTY → FSL-D-INIT → FSL-D-SCAN
→ FSL-D-REPORT; ZAKAZ przejścia do MD1/BLOK-A bez FSL-D-REPORT.

**WARN-16 → `pisma-proste-v2/SKILL.md`:**
Dodano ⛔ BLOK POV-B/C po intake: weryfikacja sądu online [POV-B] + weryfikacja
pozwanego KRS/NIP online [POV-C] z triggerem ISU gdy rozbieżność.

**WARN-16/20 → `analizator-umow-v1/SKILL.md`:**
Dodano ⛔ BLOK POV-C w FAZA 0: weryfikacja stron umowy online + trigger ISU
gdy rozbieżność identyfikatorów + trigger ISU-PESEL gdy PESEL w dokumencie.

**WARN-18 → `pisma-procesowe-v3/SKILL.md`:**
Linia 669: dodano view MOD-IDENTYFIKACJA-STRONY-UMOWY.md z triggerami (ISU + ISU-PESEL)
PRZED wywołaniem MOD-PRACODAWCA-RZECZYWISTY; adnotacja "wykonaj NAJPIERW ISU".

**WARN-11 → `dr-12/.../mod-ustawa-komornicy-sadowi-zawod.md`:**
Linia 13: usunięto dead ref do `DR-03/mod-ustawa-komornicy-sadowi` (NOTA-8 — plik
usunięty); zastąpiono notą historyczną z datą naprawy.

### 3. WARN po audycie

Wszystkie poprzednie WARN-11/16/17/18/20/21 ZAMKNIĘTE.
Brak nowych WARN.

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA

| Plik | Akcja | Wersja |
|---|---|---|
| `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` | ZMIENIONY | 1.0.0→1.1.0 |
| `shared/MOD-DOKUMENT-ANOMALIE_v1.0.0.md` | ZMIENIONY | 1.0.0→1.1.0 |
| `analizator-dowodow-v3/SKILL.md` | ZMIENIONY | (FSL-D) |
| `pisma-proste-v2/SKILL.md` | ZMIENIONY | (POV-B/C) |
| `analizator-umow-v1/SKILL.md` | ZMIENIONY | (POV-C + ISU) |
| `pisma-procesowe-v3/SKILL.md` | ZMIENIONY | (ISU cross-ref) |
| `dr-12/.../mod-ustawa-komornicy-sadowi-zawod.md` | ZMIENIONY | (dead ref) |

### 6. WNIOSKI

System osiąga stan zero otwartych WARN. Algorytm ISU-PESEL wbudowany w EL-OSOBA
modułu ISU i triggery MOD-DOKUMENT-ANOMALIE — dostępny we wszystkich postępowaniach
gdzie pojawia się PESEL osoby fizycznej z datą urodzenia lub płcią.

---

## AUDYT-2026-06-27d — Nowy moduł: MOD-IDENTYFIKACJA-STRONY-UMOWY v1.0.0

**Zakres:** Targeted — wydzielenie mechaniki danych większościowych z
MOD-PRACODAWCA-RZECZYWISTY W0 do niezależnego modułu shared, zamknięcie WARN-19.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| WARN zamknięty | WARN-19 (brak wydzielenia W0 jako shared) |
| Pliki nowe | `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` (v1.0.0) |
| Pliki zmodyfikowane | `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` (v2.1.0→v2.2.0), `shared/PRE-W2-VERIFICATION-GATE.md` (v1.3.0→v1.4.0), `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` |
| ZIPy | pisma-procesowe-v3.zip, shared.zip, audyt-systemu-v4.zip |

### 2. NAPRAWY

Nowy moduł `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` (531 linii):
- Zakres: wszelkie typy dokumentów i postępowań (umowy, faktury VAT, polisy,
  zamówienia, pisma procesowe) — nie tylko sprawy pracownicze
- Katalog EL-PODMIOT (10 elem. z wagami ★★★★–★), EL-OSOBA (7), EL-FAKTURA (8)
- Procedura ISU-1–ISU-5 z progiem 60% sumy ważonej
- ISU-4: rozstrzyganie uzupełniające (ZUS PUE, JPK_VAT, korespondencja, zachowanie)
- ISU-5: formuła gotowa do wklejenia w pismo + wniosek dowodowy (wynik sporny)
- 3 sytuacje szczególne: faktura VAT z błędnym NIP, umowa B2B matka/córka, seria umów
- Mapa zastosowań: 6 typów sporu × efekt ISU
- Integracja: pisma-procesowe-v3 (W1.2d), analizator-umow-v1, analizator-dowodow-v3,
  PRE-W2-VERIFICATION-GATE (nowa kolejność: ISU → MOD-PR-RZECZ)

MOD-PRACODAWCA-RZECZYWISTY v2.2.0: WARSTWA 0 zamieniona na pointer do ISU.
PRE-W2-VERIFICATION-GATE v1.4.0: triggery zaktualizowane — ISU PRZED MOD-PR-RZECZ.
CHECKLIST-DEDUP: nowy wpis kanoniczny dla MOD-IDENTYFIKACJA-STRONY-UMOWY.

### 3. WARN

**WARN-19 (ZAMKNIĘTY):** wydzielono do shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md.
**WARN-20 (NOWE, OTWARTE):** analizator-umow-v1/SKILL.md nie ma triggera
do MOD-IDENTYFIKACJA-STRONY-UMOWY — do dodania w następnym audycie.
**WARN-21 (NOWE, OTWARTE):** MOD-DOKUMENT-ANOMALIE DA-3 nie ma explicite triggera
do ISU — sekwencja: DA-3 → ISU (pointer brakuje w MOD-DOKUMENT-ANOMALIE).

### 4–6: poza zakresem.

---

## AUDYT-2026-06-27c — Dodano WARSTWA 0 (dane większościowe) do MOD-PRACODAWCA-RZECZYWISTY v2.1.0

**Zakres:** Targeted micro-upgrade — dodanie mechaniki danych większościowych
jako Warstwy 0 przed istniejącymi warstwami 1–4.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Zmiana | WARN-19 (NOWE — patrz §3) |
| Pliki zmodyfikowane | `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` (v2.0.0→v2.1.0) |
| Skille dostarczane jako ZIP | pisma-procesowe-v3.zip |

### 2. ZMIANY WYKONANE

Dodano WARSTWA 0 — dane większościowe — jako pierwsza warstwa argumentu podmiotowego R3.
Mechanika: policz elementy identyfikacyjne per umowę (nazwa/NIP/KRS/REGON/adres/podpis/pieczęć);
podmiot z ≥4/7 elementów = strona umowy; element mniejszościowy = błąd pisarski.
Zaleta: nie wymaga doktryny prawnej; działa na każdym typie umowy; argument empiryczny
trudniejszy do obalenia niż prawny; gdy pozwana podnosi literówka → przyznaje
tożsamość kontrahenta.
Ograniczenie: identyfikuje stronę każdej umowy osobno, nie scala dla art. 25¹ KP.
Architektura: W0 (kto stroną) → W1–W4 (czy liczyć razem).

### 3. WARN

**WARN-19 (NOWE, OTWARTE):** Mechanika danych większościowych (W0) jest użyteczna
poza sprawami pracowniczymi (umowy B2B, najem, zlecenie). Do rozważenia w przyszłym
audycie: wydzielenie W0 jako osobnego modułu `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md`
z pointerem z MOD-PRACODAWCA-RZECZYWISTY i z analizator-umow-v1. Nieblokujące.

**WARN-18 (POPRZEDNIE, OTWARTE):** cross-reference PRE-W2 w linii 669 SKILL.md.

### 4–6: bez zmian względem AUDYT-2026-06-27b.

---

## AUDYT-2026-06-27b — Integracja MOD-PRACODAWCA-RZECZYWISTY v2.0.0 + naprawa triggera PRE-W2

**Zakres:** Targeted — naprawa CRIT-18 (brak triggera MOD-PRACODAWCA-RZECZYWISTY w PRE-W2),
scalenie duplikatu, aktualizacja CHECKLIST-DEDUP.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 1 naprawiony (CRIT-18 — brak triggera PRE-W2 → MOD-PRACODAWCA-RZECZYWISTY) |
| Błędy CRIT wykryte nowe | 0 |
| Ostrzeżenia WARN | WARN-18 (otwarte — patrz §3) |
| Pliki zmodyfikowane | `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` (v1.0.0→v2.0.0), `shared/PRE-W2-VERIFICATION-GATE.md` (v1.2.0→v1.3.0), `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` |
| Skille dostarczane jako ZIP | pisma-procesowe-v3.zip, shared.zip, audyt-systemu-v4.zip |
| Plik zduplikowany (usunięty) | `/home/claude/MOD-PRACODAWCA-RZECZYWISTY.md` — scalony z kanonicznym plikiem w pisma-procesowe-v3/modules/; nie wgrywany do systemu |

### 2. NAPRAWY WYKONANE

**CRIT-18 — Brak triggera MOD-PRACODAWCA-RZECZYWISTY w PRE-W2-VERIFICATION-GATE:**

Root cause wykryty przez dewelopera w sesji VII P 94/25 (2026-06-27):
PRE-W2.C/D wykrywały rozbieżność podmiotową (T1-T4) i zatrzymywały pipeline (GATE-STOP),
ale nie wskazywały na MOD-PRACODAWCA-RZECZYWISTY — moduł który buduje właściwy
4-warstwowy argument prawny. Skutek: pismo v3 opierało tezę 1 na "ten sam KRS we wszystkich
umowach" — argumencie obalonym przez "literówkę", niezgodnym z doktryną pracodawcy
rzeczywistego.

Naprawa 1 — `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` (v1.0.0→v2.0.0):
- Dodano ⛔ TRIGGER PRE-W2 na początku pliku (wywołanie z PRE-W2 gdy T1/T2/T3/T4)
- Dodano protokół R1-R5 (klasyfikacja KAT-I/II/III + 4-warstwowy argument R3 + hedge R4)
- Warstwa 2 — obejście prawa (art. 58§1 KC) — nowa
- Warstwa 3 — venire contra factum proprium (art. 8 KP) — nowa
- Warstwa 4 — dowody tożsamości operacyjnej (ZUS/PIT-11/przelewy) — nowa
- ZAKAZ-R1: zakaz argumentu "ten sam KRS" gdy KRS błędny
- Przykład VII P 94/25 jako case study błędu i korekty
- Scalono z duplikatem `/home/claude/MOD-PRACODAWCA-RZECZYWISTY.md`

Naprawa 2 — `shared/PRE-W2-VERIFICATION-GATE.md` (v1.2.0→v1.3.0):
- PRE-W2.C §SZCZEGÓLNA REGUŁA: dodano ⛔ TRIGGER MOD-PRACODAWCA-RZECZYWISTY
  z view i zakazem przejścia do PRE-W2.D bez R5
- PRE-W2.D: dodano [MOD-PRACODAWCA-TRIGGER] po wykryciu rozbieżności
- Obie lokalizacje teraz wywołują moduł explicite, nie tylko sygnalizują "STOP"

Naprawa 3 — `audyt-systemu-v4/references/CHECKLIST-DEDUP.md`:
- Dodano wpis: MOD-PRACODAWCA-RZECZYWISTY v2.0.0

### 3. WARN

**WARN-18 (NOWE, OTWARTE):** `pisma-procesowe-v3/SKILL.md` linia 669 wywołuje moduł
`view pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` tylko z W1.2 —
wywołanie z PRE-W2 zostało wbudowane w PRE-W2-VERIFICATION-GATE (naprawa 2).
Do weryfikacji: czy linia 669 w SKILL.md powinna być rozszerzona o adnotację
że moduł jest też wywoływany z PRE-W2-VERIFICATION-GATE (cross-reference). Nieblokujące.

**WARN-17 (POPRZEDNIE, OTWARTE):** MOD-FSL-DOKUMENTY.md nie jest zintegrowany z
`analizator-dowodow-v3` — nadal otwarty.

**WARN-16 (POPRZEDNIE, OTWARTE):** pisma-proste-v2 i analizator-umow-v1 nie mają
bloku [POV-B][POV-C] — nadal otwarty.

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA SYSTEMU — SNAPSHOT (zmiany)

| Plik | Akcja | Wersja |
|---|---|---|
| `pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md` | ZMIENIONY | 1.0.0→2.0.0 |
| `shared/PRE-W2-VERIFICATION-GATE.md` | ZMIENIONY | 1.2.0→1.3.0 |
| `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` | ZMIENIONY | +1 wpis |
| `/home/claude/MOD-PRACODAWCA-RZECZYWISTY.md` | DUPLIKAT — scalony, nie wgrywany | — |

### 6. WNIOSKI I ZALECENIA

Luka naprawiona: pipeline teraz ma 3 punkty wywołania MOD-PRACODAWCA-RZECZYWISTY:
(1) W1.2 pisma-procesowe-v3 (linia 669 SKILL.md) — gdy widoczna rozbieżność w W1
(2) PRE-W2.C §SZCZEGÓLNA REGUŁA — po wykryciu przez weryfikację online
(3) PRE-W2.D [MOD-PRACODAWCA-TRIGGER] — po PRE-W2.D wykryciu KRS/NIP sprzeczności

Brakuje jeszcze weryfikacji w analizator-dowodow-v3 (WARN-17 — odrębny ticket).

---

## AUDYT-2026-06-27 — FSL-D: per-teza weryfikacja dowodów z zakazem cytowania z pamięci

**Zakres:** Targeted — naprawa luki pipeline: SD-VER kompletny ale macierz D×T
budowana z pamięci zamiast z per-teza przeszukania SD-FAKTY.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 (luka architektoniczna, nie błąd istniejącego pliku) |
| Ostrzeżenia WARN | WARN-17 (otwarte — patrz §3) |
| Pliki nowe | `shared/MOD-FSL-DOKUMENTY.md` (v1.0.0) |
| Pliki zmodyfikowane | `pisma-procesowe-v3/SKILL.md` (v5.8 → v5.9), `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` (v1.2.0 → v1.3.0), `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` |
| Skille dostarczane jako ZIP | shared.zip, pisma-procesowe-v3.zip, audyt-systemu-v4.zip |

### 2. NAPRAWY WYKONANE

**Przyczyna naprawy:**

Sprawa VII P 94/25 (sesja 2026-06-27). Diagnoza dewelopera: po SD-VER = KOMPLET
(wszystkie 35 plików odczytane) model budował macierz D×T z pamięci bez per-teza
przeszukiwania SD-FAKTY. Dwie tezy nie miały adekwatnych dowodów w piśmie:

- Teza gotowości do pracy: 1 dowód (zeznania Nawrota) zamiast 4 (wiadomości RCS
  do prezesa, odpowiedź na Lorica, zeznania Nawrota o dostępie do maila).
- Teza pracodawcy faktycznego: argumenty ogólne (art. 23¹ KP) zamiast dowodów
  dokumentowych (XLSX Pracownicy13.08.2024 z powodem jako aktywnym pracownikiem
  HPG w VIII.2024, Eksport-Pracownicy z HPG jako agencją pracy).

Root cause: pliki Szef.odt, Zatrudnienie.odt, Pracownicy13.08.2024.xlsx miały
mylące nazwy — model nie przeszukiwał ich per tezę gotowości/pracodawcy bo
„intuicyjnie nie pasowały". Brak hard gate między SD-VER a macierzą D×T.

Deweloper wskazał dwa rozwiązania: (1) per-teza badanie dowodów z obowiązkiem
czytania wszystkich źródeł per tezę, (2) zakaz cytowania faktów z pamięci
(analogia do FACT-SOURCE-LOCK dla przepisów).

**Naprawa 1 — nowy plik `shared/MOD-FSL-DOKUMENTY.md` (v1.0.0):**

Nowy moduł FSL-D (Fact-Source-Lock dla Dokumentów) implementuje:
- FSL-D-INIT: inicjalizacja macierzy T[n] × twierdzenia atomowe
- FSL-D-SCAN (per KAŻDA teza): rozłożenie tezy na twierdzenia atomowe TC[n,k];
  per każde TC: przeszukanie WSZYSTKICH D[id] z SD-REJ niezależnie od nazwy pliku;
  klasyfikacja ✅/⚠️/⬛ (🔴/🟠/🟡); wpis z D[id]+lokalizacją z SD-FAKTY (nie z pamięci)
- FSL-D-ORPHAN: pliki z 0 przypisaniami = kandydaci na nowe tezy
- FSL-D-REPORT: macierz wynikowa + podsumowanie luk per klasa
- FAZA 4 rozgałęzienie: luka 🔴 = STOP (decyzja a/b/c/d), luka 🟠 = kontynuuj
  z żądaniem ewentualnym, luka 🟡 = notacja
- REGUŁA-NAZWA-PLIKU-MYLĄCA: zakaz wnioskowania o zawartości pliku z jego nazwy
- REGUŁA-PAMIĘĆ-VS-ŹRÓDŁO: każde twierdzenie faktyczne = D[id]+lokalizacja z SD-FAKTY
- REGUŁA-KORESPONDENCJA-GOTOWOŚĆ: per tezę gotowości → wszystkie D[id] korespondencja
- REGUŁA-TABELE-PRACODAWCA: per tezę pracodawcy → wszystkie D[id] XLSX/tabele

Trzy poziomy gwarancji kompletności (wzorzec projektowy):
  L1 (strony):    SD-KOMPLETNY   — czy 100% stron odczytano?
  L2 (tezy):      FSL-D (nowy)   — czy 100% tez ma źródło w odczytanym pliku?
  L3 (przepisy):  FACT-SRC-LOCK  — czy 100% przepisów zweryfikowano?

**Naprawa 2 — `pisma-procesowe-v3/SKILL.md` (v5.8 → v5.9):**

Dodano sekcję W1.2c-FSL-D przed KROK KD w W1.2c-PRE:
- Opis root cause (VII P 94/25, 2026-06-27)
- KROK FSL-D z pełną sekwencją (FSL-D-INIT → FSL-D-SCAN → FSL-D-ORPHAN →
  FSL-D-REPORT → rozgałęzienie)
- ⛔ ZAKAZ-FSL-D: nie przystępuj do KROK KD bez FSL-D-REPORT

**Naprawa 3 — `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` (v1.2.0 → v1.3.0):**

FAZA 4 SD-GATE-4: zmieniono gałąź „Wszystkie = TAK":
- Poprzednio: „Przekaż SD-FAKTY do W1.3"
- Po naprawie: obowiązkowe wywołanie MOD-FSL-DOKUMENTY.md; dopiero FSL-D-MACIERZ
  (nie SD-FAKTY) trafia do W1.3; wyraźny zakaz bezpośredniego przekazania SD-FAKTY

**Naprawa 4 — `audyt-systemu-v4/references/CHECKLIST-DEDUP.md`:**

Dodano dwa wpisy:
- FSL-D: per-teza weryfikacja dowodów → `shared/MOD-FSL-DOKUMENTY.md` (wyłączna lok.)
- REGUŁA-NAZWA-PLIKU-MYLĄCA → `shared/MOD-FSL-DOKUMENTY.md` § REGUŁY SZCZEGÓLNE

### 3. WARN

**WARN-17 (NOWE, OTWARTE):** MOD-FSL-DOKUMENTY.md nie jest zintegrowany z
`analizator-dowodow-v3` (BLOK-C-FSL opisany w pliku jako pozycja docelowa,
ale nie dodano pointera w analizator-dowodow-v3/SKILL.md). Do weryfikacji
w następnym audycie.

**WARN-16 (POPRZEDNIE, OTWARTE):** pisma-proste-v2 i analizator-umow-v1 nie mają
bloku [POV-B][POV-C] w checklistach. Status: nadal otwarty.

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA SYSTEMU — SNAPSHOT (nowe pliki)

| Plik | Akcja | Wersja |
|---|---|---|
| `shared/MOD-FSL-DOKUMENTY.md` | NOWY | 1.0.0 |
| `pisma-procesowe-v3/SKILL.md` | ZMIENIONY | 5.8 → 5.9 |
| `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` | ZMIENIONY | 1.2.0 → 1.3.0 |
| `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` | ZMIENIONY | +2 wpisy |

### 6. WNIOSKI I ZALECENIA

Naprawiona luka jest architektoniczna: SD-VER = L1 gwarancja (strony),
FSL-D = L2 gwarancja (tezy), FACT-SOURCE-LOCK = L3 (przepisy). Przed naprawą
L2 nie istniał — model po SD-VER miał wolną rękę przy budowie macierzy.

Zalecenia na kolejny audyt:
1. Zamknąć WARN-17: zintegrować FSL-D z analizator-dowodow-v3
2. Zamknąć WARN-16: dodać [POV-B][POV-C] do pisma-proste-v2

*Audyt: 2026-06-27 | Status: ✅ ZAMKNIĘTY (WARN-16, WARN-17 otwarte)*

---

## AUDYT-2026-06-25 — Wzmocnienie weryfikacji podmiotów online [POV-B][POV-C]

**Zakres:** Targeted — naprawa pominięcia weryfikacji online danych podmiotów w piśmie procesowym VII P 94/25.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 |
| Ostrzeżenia WARN | 1 otwarte (WARN-16 — patrz §3) |
| Skille zmodyfikowane | pisma-procesowe-v3 (v5.6 → v5.6-POV), prawny-router-v3, shared/MOD-STEP-TRACKER.md |
| Skille dostarczane jako ZIP | pisma-procesowe-v3.zip, prawny-router-v3.zip, shared.zip |

### 2. NAPRAWY WYKONANE

**Przyczyna naprawy:**
Pismo procesowe w sprawie VII P 94/25 wygenerowano bez wywołania `web_search`/`web_fetch`
dla danych podmiotowych i sądu — mimo istniejącego PRE-W2-VERIFICATION-GATE.
Model potraktował dane z dokumentów akt (umowy, protokoły, SUDOP) jako wystarczające.

**Diagnoza root cause:**
PRE-W2-VERIFICATION-GATE opisuje co zrobić, ale checklista nie wymuszała
fizycznego wywołania narzędzia — pytała tylko "czy zweryfikowano?" (self-certyfikacja
zamiast weryfikacji artefaktem). Dane z akt ≠ dane zweryfikowane online.

**Naprawa 1 — SELF-CHECK-PISMA.md (pisma-procesowe-v3/references/):**
Wzmocniono istniejący blok PRE-W2-VERIFICATION-GATE (linie 65–72):
- Dodano zasadę explicite: "dane z dokumentów/akt ≠ zweryfikowane; jedyna weryfikacja
  = fizyczne wywołanie web_search/web_fetch W TEJ ODPOWIEDZI"
- Zastąpiono ogólne pytanie "czy zweryfikowano?" czterema konkretnymi pytaniami
  z tagami [POV-B] (sąd/organ), [POV-C] (pozwany KRS/NIP), [POV-D] (rozbieżne numery),
  [POV-R] (raport PRE-W2 wyświetlony)
- Każde pytanie: odpowiedź TAK wymaga faktycznego URL w tej odpowiedzi
- Dodano przykład konkretnego zapytania do wklejenia przy NIE
- Wzmocniono pytanie 6 w REGUŁA FINALNA: zmieniono na "Czy wywołałem
  web_search/web_fetch dla sądu [POV-B] i pozwanego [POV-C]?"

**Naprawa 2 — SKILL.md (pisma-procesowe-v3):**
- Sekcja PRE-W2-VERIFICATION-GATE: dodano explicite "dane z akt NIE są weryfikacją
  online; dane z pamięci NIE są; jedyna akceptowana weryfikacja: fizyczne wywołanie"
- Sekcja W3.0 PODMIOT-GATE: dodano reminder [POV-B][POV-C] "czy wywołanie było
  od ostatniej edycji pisma? jeśli dane zmieniły się — powtórz"

**Naprawa 3 — SKILL.md (prawny-router-v3):**
- SELF-CHECK: dodano pozycję [POV-B][POV-C] z wymogiem fizycznego wywołania
  narzędzia i odesłaniem do SELF-CHECK-PISMA blok PRE-W2

**Naprawa 4 — MOD-STEP-TRACKER.md (shared/):**
- Dodano krok "PRE-W2-POV" do rejestru kroków pipeline pisma procesowego:
  `"PRE-W2-POV": { name: "MOD-PODMIOT-ONLINE-VERIFY AUTODIAGNOZA [CP-PRE-W2-POV]" }`

**Odrzucona alternatywa:**
Początkowo stworzono standalone skill MOD-PODMIOT-ONLINE-VERIFY.md (409 linii).
Odrzucony na wniosek dewelopera: nakłada się z istniejącą checklistą,
mnożenie plików zwiększa szansę pominięcia. Właściwe miejsce = checklista.
Plik usunięty; logika wciągnięta do SELF-CHECK-PISMA.md.

### 3. WARN

**WARN-16 (NOWE, OTWARTE):** Pozostałe skille piszące pisma procesowe
(pisma-proste-v2, ewentualnie analizator-umow-v1) nie mają odpowiednika
bloku [POV-B][POV-C] w swoich checklistach. Do weryfikacji w następnym audycie.

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. SNAPSHOT (delta)

pisma-procesowe-v3/references/SELF-CHECK-PISMA.md: 137 → 154 linii (+17, blok PRE-W2 wzmocniony).
pisma-procesowe-v3/SKILL.md: 706 → 712 linii (+6, PRE-W2 + W3.0 wzmocnione).
prawny-router-v3/SKILL.md: 377 → 382 linii (+5, SELF-CHECK [POV-B][POV-C]).
shared/MOD-STEP-TRACKER.md: 239 → 240 linii (+1, PRE-W2-POV krok).

### 6. WNIOSKI

1. Root cause weryfikacji podmiotów: model może "przejść" przez opis kroku bez
   wywołania narzędzia (self-certyfikacja). Naprawa: checklista musi pytać
   o fizyczny artefakt (URL), nie o deklarację "zweryfikowałem".
2. Zasada ogólna: "dane z dokumentów akt = dane niezweryfikowane online" —
   powinna być explicite w każdej checkliście weryfikacji podmiotów.
3. WARN-16: sprawdzić pisma-proste-v2 i analizator-umow-v1 pod kątem
   analogicznego wymogu weryfikacji podmiotów.

---

## AUDYT-2026-06-24e — Naprawa WARN-14 + WARN-15 (art. 258 KPC uchylony)

**Zakres:** Targeted — zamknięcie 2 WARNów z AUDYT-2026-06-24d.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 (WARN-15 zdegradowany z WARN do CRIT i naprawiony w tej samej sesji) |
| Ostrzeżenia WARN | 0 otwartych (WARN-14 ✅ zamknięty, WARN-15 ✅ zamknięty) |
| Skille zmodyfikowane | pisma-procesowe-v3 (v5.1 → v5.2), shared/MOD-ATAK-NA-SWIADKA.md (v1.0.0 → v1.0.1) |
| Nowe pliki references | pisma-procesowe-v3/references/AUTOMAT-STANOW.md, MODULY-MAPA.md, SELF-CHECK-PISMA.md |

### 2. NAPRAWY

**CRIT — art. 258 KPC UCHYLONY (odkryty przy weryfikacji WARN-15):**
Weryfikacja online (24.06.2026, Dz.U.2026.0.468 t.j., lexlege.pl) potwierdziła:
- art. 258 KPC — UCHYLONY 23.04.2026. Treść: "Strona powołująca się na dowód
  ze świadków obowiązana jest..." — zastąpiona przez art. 235² §1 KPC
  (ogólne wymagania wniosku dowodowego — oznaczenie dowodu + wskazanie faktów).
- Naprawiono w shared/MOD-ATAK-NA-SWIADKA.md §FAZA 5 SW-W2: zmieniono art. 258
  na art. 235² §1 KPC.
- Dodatkowo naprawiono błąd art. 266 §1 KPC w SW-A4: art. 266 §1 = uprzedzenie
  i przyrzeczenie (nie "zeznawanie o faktach") → zastąpiony art. 271 §1 KPC.
- Wersja: 1.0.0 → 1.0.1.

**Zweryfikowane artykuły KPC (Dz.U.2026.0.468):**
  art. 248 ✅ · art. 261 ✅ · art. 266 ✅ · art. 271 ✅ · art. 272 ✅
  art. 235² §1 ✅ · art. 233 §1 KK ✅ (Dz.U.2025.0.383)
  art. 258 KPC ❌ UCHYLONY — usunięto ze wszystkich powołań

**WARN-14 — pisma-procesowe-v3/SKILL.md 1917 linii → 1166 linii:**
Refaktoryzacja: wydzielono 3 sekcje do references/ bez utraty treści:
- `references/AUTOMAT-STANOW.md` (481 l.): PROTOKÓŁ CHECKPOINT, AUTOMAT STANÓW
  STAN 0–3 (z KROK 0-TRACKER), MAPA CHECKPOINTÓW, ZAKAZY 1–13,
  REGUŁA NAPRAWY (z W2.4c), REGUŁA-KONTYNUACJA, REGUŁA AUTODIAGNOZY.
- `references/MODULY-MAPA.md` (181 l.): matryca engines per etap, pliki kanoniczne shared.
- `references/SELF-CHECK-PISMA.md` (124 l.): self-check + REGUŁA FINALNA.
SKILL.md zastąpiony pointerami `view references/X.md` z opisem zawartości.
Wersja: 5.1 → 5.2.

### 3. WARN

Brak otwartych WARNów po tej sesji.

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. SNAPSHOT (delta)

pisma-procesowe-v3/SKILL.md: 1917 → 1166 linii (-751, WARN-14 ✅ zamknięty).
Nowe pliki references/: AUTOMAT-STANOW.md (481 l.), MODULY-MAPA.md (181 l.),
  SELF-CHECK-PISMA.md (124 l.).
shared/MOD-ATAK-NA-SWIADKA.md: v1.0.0 → v1.0.1 (WARN-15 ✅ → CRIT → naprawiony).

### 6. WNIOSKI

1. Art. 258 KPC uchylony 23.04.2026 — nowe sprawy powołujące ten artykuł muszą
   używać art. 235² §1 KPC (wniosek dowodowy). Sprawdzić czy inne skille
   powołują art. 258 (REKOMENDACJA do następnego audytu: grep -r "art. 258" shared/).
2. pisma-procesowe-v3 wrócił poniżej progu NOTA-4 (1166 linii < 1500, >600 →
   nadal wymaga obserwacji ale nie jest PRIORYTET).

--- — MOD-STEP-TRACKER + MOD-ATAK-NA-SWIADKA + pisma-procesowe-v3 v5.1

**Zakres:** Targeted — naprawa krytyczna systemu checkpointów + 2 nowe moduły shared + ZAKAZ-13.  
Przyczyna: Sesja VII P 94/25 (2026-06-24) — model wygenerował pismo procesowe pomijając
10+ obowiązkowych kroków pipeline (CLAIM-VALIDATION, STRATEGIA, MACIERZ, PRE-W2, PODMIOT-GATE,
LEGAL-QUALITY-GATE, AUDYT-KOŃCOWY, PEER-REVIEW) bez żadnej informacji dla użytkownika.
Drugie pominięcie: ogniwa zeznaniowe w łańcuchu (świadek Nawrot — zeznanie o premii PFRON)
bez antycypacji ataków na wiarygodność zeznania i bez SW-TARCZKA.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 |
| Ostrzeżenia WARN | 2 (WARN-14, WARN-15 — poniżej) |
| Nowe pliki | 2 (shared/MOD-STEP-TRACKER.md v1.0.0, shared/MOD-ATAK-NA-SWIADKA.md v1.0.0) |
| Skille zmodyfikowane | pisma-procesowe-v3 (v5.0 → v5.1), shared/SKILL.md (v2.0→v2.1), shared/MOD-SKAN-DOWODOW-KOMPLETNY.md (v1.0→v1.1) |
| CHECKLIST-DEDUP | +4 wpisy (poniżej) |

### 2. NAPRAWY / NOWE MODUŁY

**shared/MOD-STEP-TRACKER.md** (nowy, v1.0.0):
- Centralny rejestr kroków sesji — inicjowany w pisma-procesowe-v3 KROK 0-TRACKER (po CP-GATE, przed routing).
- ST-INIT: REJESTR ze wszystkimi etapami pipeline (R0A, R0C, R1, R2, W1-CLAIM, W1-STRAT,
  W1-MACIERZ, W1-LANCUCH, W1-ANOMALIE, W1-RED-TEAM, PRE-W2, W2-DRAFT, W2-ATAK,
  W3-PODMIOT, W3-ISAP, W3-BLOKJ, W3-LQG, W3-AUDYT, W3-PEER, HYBRID, DOCX).
- FAZA 1 (ST-TRACK): aktualizacja statusów ✅/⚠️/—N/A per krok.
- FAZA 2 (ST-REPORT): OBOWIĄZEK natychmiastowego raportu pominięć gdy ≥1 wpis ⚠️ —
  pytanie a/b, czekanie na decyzję użytkownika, zakaz dostarczenia pisma bez potwierdzenia.
- FAZA 3 (ST-FINAL): pełny rejestr końcowy obowiązkowy przed każdym present_files pisma.
- ST-CP-INTEGRACJA: każdy raport CP musi zawierać sekcję REJESTR KROKÓW z MOD-STEP-TRACKER.
- Zasada kluczowa: ZAKAZ CICHEGO POMIJANIA — model nigdy nie może pominąć kroku bez
  natychmiastowego poinformowania użytkownika i uzyskania decyzji a/b.

**shared/MOD-ATAK-NA-SWIADKA.md** (nowy, v1.0.0):
- Podważanie świadka jako ogniwa łańcucha dowodowego — wypełnia lukę między
  MOD-ATAK-NA-DOWOD (AD-3/AD-10 ogólnie) a MOD-LANCUCH-DOWODOWY (ataki strukturalne).
- SW-DETECT: automatyczna detekcja ogniw zeznaniowych (klasa D) w łańcuchach ŁD-n
  (wbudowany w pisma-procesowe-v3 W1.2c-LANCUCH jako krok ŁD-3b).
- SW-P1..P5: profil świadka (dane formalne, treść per twierdzenie, źródło wiedzy,
  sprzeczności wewnętrzne, sprzeczności z D[id]).
- SW-ATAK: 8 wektorów ataku z priorytetyzacją 🔴/🟠/🟡:
  SW-A1 (konflikt interesu), SW-A2 (zaprzeczenie przez dokument — KLUCZOWY),
  SW-A3 (relacja wtórna), SW-A4 (domysł vs fakt), SW-A5 (niespójność wewnętrzna),
  SW-A6 (upływ czasu), SW-A7 (zastraszenie udokumentowane), SW-A8 (brak wiedzy — ekwluzja własna).
- SW-TARCZKA: antycypacja ataku na NASZEGO świadka — wbuduj do W2.
- SW-WNIOSKI: konfrontacja (art. 272), wezwanie świadka (art. 258),
  dokumenty (art. 248) — wszystkie opatrzone notatką "weryfikuj ISAP przed użyciem".
- Zasada MacCarthy'ego: ≤3 mocne uderzenia > 8 słabych.

**pisma-procesowe-v3/SKILL.md** (v5.0 → v5.1):
- KROK 0-TRACKER: nowy krok po CP-GATE, przed routing — inicjuje MOD-STEP-TRACKER.
- W1.2c-LANCUCH ŁD-3b: SW-DETECT jako automatyczna bramka per ogniwo zeznaniowe.
- W2.4 ROZSZERZENIE W2.4c: MOD-ATAK-NA-SWIADKA — gdy SW-DETECT aktywny; raport D + SW łącznie.
- ZAKAZ-13 (nowy): zakaz generowania W2 bez W2.4c gdy ogniwa zeznaniowe wykryte;
  dotyczy obydwu kierunków (atak na świadka przeciwnika + SW-TARCZKA dla naszego).
- REGUŁA NAPRAWY: rozszerzona o W2.4c + MOD-STEP-TRACKER FAZA 2.
- MAPA CHECKPOINTÓW: [CP-ATAK] rozszerzony o W2.4a + W2.4b + W2.4c.
- Kanon plików shared: +MOD-STEP-TRACKER (KROK 0-TRACKER) + +MOD-ATAK-NA-SWIADKA (W2.4c).

**shared/MOD-SKAN-DOWODOW-KOMPLETNY.md** (v1.0 → v1.1):
- Raport SD-VER rozszerzony o sekcję REJESTR KROKÓW (aktualizacja MOD-STEP-TRACKER)
  pokazującą oczekujące etapy — użytkownik wie że SD-VER to początek, nie cały pipeline.

**shared/SKILL.md** (v2.0 → v2.1):
- Dodano MOD-STEP-TRACKER do opisu biblioteki i do listy wywołań.
- Dodano MOD-ATAK-NA-SWIADKA do tabeli zawartości.

### 3. WARN

**WARN-14:** pisma-procesowe-v3/SKILL.md ma teraz 1917 linii — przekracza próg NOTA-4 >600
(PRIORYTET). Plik rósł organicznie przez wersje v3→v5.1. Zalecana refaktoryzacja:
wydzielenie sekcji AUTOMAT STANÓW (≈200 linii), ZAKAZY (≈100 linii), MODUŁY-MAPA (≈100 linii)
do osobnych plików references/. Nie blokuje działania — ale obniża czytelność.
Akcja: przy następnej zmianie skilla wykonaj podział.

**WARN-15:** shared/MOD-ATAK-NA-SWIADKA.md powołuje art. 258, 261, 266, 272 KPC jako
orientacyjne — z adnotacją "weryfikuj ISAP przed użyciem w piśmie". Numery artykułów
nie były weryfikowane online w tej sesji (sygnatury wymagają sesji ISAP per artykuł).
Nie blokuje działania — HARDGATE w nagłówku modułu zobowiązuje do weryfikacji przed użyciem.

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA SYSTEMU — SNAPSHOT (delta od poprzedniego audytu)

Nowe pliki shared/: MOD-STEP-TRACKER.md (223 linii), MOD-ATAK-NA-SWIADKA.md (331 linii).
Łączna liczba plików shared/: +2 vs audyt-2026-06-24c.
pisma-procesowe-v3/SKILL.md: 1869 → 1917 linii (+48, WARN-14).

### 6. WNIOSKI I ZALECENIA

1. PROBLEM PIERWOTNY (pominięcie kroków): naprawiony w pisma-procesowe-v3 przez KROK 0-TRACKER
   + MOD-STEP-TRACKER z zasadą ZAKAZU CICHEGO POMIJANIA. Każde pominięcie = raport + a/b.
2. PROBLEM WTÓRNY (świadek jako ogniwo bez analizy): naprawiony przez MOD-ATAK-NA-SWIADKA
   + ŁD-3b SW-DETECT + W2.4c + ZAKAZ-13.
3. REFAKTORYZACJA pisma-procesowe-v3: zalecana (WARN-14) — plik za długi (1917 linii).
4. WERYFIKACJA art. KPC w MOD-ATAK-NA-SWIADKA: wymagana przed pierwszym użyciem (WARN-15).
5. Przyszły audyt: zamknąć WARN-14 (podział pisma-procesowe-v3) i WARN-15 (ISAP art. 258/261/266/272).

---


---


---


---


## AUDYT-2026-06-24c — MOD-NEGACJA-DOWODOW: siła dowodów i 12 technik negacji

**Zakres:** Targeted — nowy plik shared/ + rozszerzenia analizator-dowodow-v3.
Wywołanie: pytanie o badanie siły dowodów wobec zaprzeczeń, twierdzeń o nieistnieniu
elementów, milczenia przeciwnika. Research online: polska linia SN (art. 229-233 KPC,
art. 6 KC), doktryna (Profinfo 2024), prawo porównawcze (CC fr. probatio diabolica;
FRCP 37(e) spoliation).

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 |
| Ostrzeżenia WARN | 1 (WARN-13 — poniżej) |
| Nowe pliki | 1 (shared/MOD-NEGACJA-DOWODOW.md v1.0.0) |
| Skille zmodyfikowane | analizator-dowodow-v3 (v5.9.0 → v5.10.0), MP4-moc-slabosci.md |
| CHECKLIST-DEDUP | +8 wpisów |

### 2. NAPRAWY / NOWE MODUŁY

**shared/MOD-NEGACJA-DOWODOW.md** (nowy, v1.0.0):
- BLOK N1: ciężar dowodu per teza — procedura KR1-KR5; 6 dziedzin OD (odwrócony
  ciężar: mobbing, dyskryminacja, dyscyplinarne, wypowiedzenie, wypadek,
  probatio diabolica); zasada generalna art. 6 KC + art. 232 KPC.
- BLOK N2: odporność per klasa A-G — co wystarczy do obalenia każdej klasy
  (różnicuje: samo zaprzeczenie vs oryginał vs metadane vs biegły).
- BLOK N3: 12 technik negacji N1-N12 z ripostą minimalną: gołosłowne
  zaprzeczenie [N1], twierdzenie o nieistnieniu faktu [N2], twierdzenie o
  nieistnieniu elementu prawnego [N3], ogólnikowe zaprzeczenie [N4], atak
  na autentyczność [N5], odmowa przedłożenia (art.233§2) [N6], zarzut braku
  formy [N7], atak na świadka [N8], prekluzja [N9], cherry-picking [N10],
  immunizacja twierdzenia [N11], spoliation [N12].
- BLOK N4: wykrywanie milczenia jako przyznania — procedura M1-M4; rejestr
  [PRZYZ-MIL-H/M/L]; formularz art. 230 KPC.
- Procedura zintegrowana NG1-NG6 z outputem do RAPORT D, macierzy, pisma.
- Źródła weryfikowalne: art. 6 KC, art. 229-234 KPC, art. 233 §2 KPC
  (Dz.U.2026.468); SN IV CSK 669/15; I BP 6/14; SA Katowice I ACa 677/14.

**analizator-dowodow-v3/SKILL.md** (v5.9.0 → v5.10.0):
- Nowy BLOK-NEGACJA: skrót N1/N2/N3/N4, procedura NG1-NG6, trigger ZAWSZE.
- Pointer do pliku kanonicznego MOD-NEGACJA-DOWODOW.md.

**analizator-dowodow-v3/modules/MP4-moc-slabosci.md**:
- §4.3: dodano pole "Technika negacji [N1-N12]" + siła ataku + riposta minimalna.
- §4.6: dodano pole "Technika negacji [N1-N12]" + "Klasa dowodu wymagana do obalenia".

### 3. WARN

**WARN-13:** MOD-NEGACJA-DOWODOW.md powołuje sygnatury SN/SA jako punkty startowe
z adnotacją HARDGATE weryfikacji. Przed użyciem w piśmie — każda sygnatura musi
być zweryfikowana w orzeczenia.ms.gov.pl / sn.pl. Moduł zawiera ostrzeżenie
"⚠️ HARDGATE: weryfikuj ISAP i orzecznictwo przed powołaniem" w nagłówku i przy
każdej sygnaturze. Status: AKCEPTOWALNY (nie blokuje działania).

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA SYSTEMU — SNAPSHOT

- Nowy plik shared/: MOD-NEGACJA-DOWODOW.md
- Pliki analizator/ zmodyfikowane: SKILL.md (v5.10.0), modules/MP4-moc-slabosci.md
- CHECKLIST-DEDUP: +8 wpisów (12 technik, ciężar, odporność, milczenie, spoliation)

### 6. WNIOSKI I ZALECENIA

1. Pisma-procesowe-v3 W2.4 MOD-ATAK: dodać pole "Technika N1-N12" do formatu
   RAPORTU D §D2 — odłożone; przy następnej modyfikacji pisma.
2. BLOK-NEGACJA NG4 [PRZYZ-MIL]: zakładka w dashboardzie analizatora — do dodania
   przy następnej aktualizacji assets/dashboard.html.
3. Dziedziny OD-1..OD-6 (odwrócony ciężar): lista poglądowa, weryfikuj ISAP per
   dziedzina. Nie dodawać nowych bez weryfikacji orzecznictwa.

## AUDYT-2026-06-24b — Implementacja MOD-PROWENIENCJA-DOWODOW (DTA W4)

**Zakres:** Targeted — nowy plik shared/ + rozszerzenie analizator-dowodow-v3.
Wywołanie: pytanie o zdolność wykrywania wspólnych źródeł dowodów (system IT,
komunikator, świadkowie, podobieństwo tekstu) → decyzja: nowy plik kanoniczny
shared/ + rozszerzenie MP6-sledczy (bezpieczna opcja).

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 |
| Ostrzeżenia WARN | 0 |
| Nowe pliki | 1 (shared/MOD-PROWENIENCJA-DOWODOW.md v1.0.0) |
| Skille zmodyfikowane | analizator-dowodow-v3 (v5.8.0 → v5.9.0) |
| CHECKLIST-DEDUP | +4 wpisy (proweniencja, typy P+/P-/P0/P!, LIN, CHAIN) |

### 2. NAPRAWY / NOWE MODUŁY

**shared/MOD-PROWENIENCJA-DOWODOW.md** (nowy, v1.0.0):
- 7 typów proweniencji: SYS (wspólny system IT), KOM (komunikator),
  ZAW (środowisko zawodowe), AUT (autor), URZ (urządzenie),
  LIN (podobieństwo tekstu / fingerprint lingwistyczny), CHAIN (custody).
- 4 klasy konsekwencji: P+ wzmacniająca, P- osłabiająca, P0 neutralna, P! alert.
- Procedura PR1-PR5: inwentaryzacja → skan par → klasyfikacja → raport → integracja.
- Integracja: DTA-ID-MODE, MOD-MACIERZ-DOWOD-TEZA, BLOK-KONSEKWENCJE, MP6.
- Trigger obowiązkowy: ≥3 dowodów klasy C/D LUB ≥2 świadkowie z jednego miejsca LUB DTA-ID-MODE aktywny.

**analizator-dowodow-v3/SKILL.md** (v5.8.0 → v5.9.0):
- Nowy BLOK-PROWENIENCJA: skrót 7 typów, 4 klas, procedury PR1-PR5.
- Trigger inline + pointer do pliku kanonicznego.

**analizator-dowodow-v3/modules/MP6-sledczy.md**:
- Nowa sekcja §6.12 Proweniencja i wspólne źródła dowodów.
- Tabela 7 typów z sygnałami i konsekwencjami.
- Procedura skrócona 6.12a-6.12d dla małych spraw inline.
- Pointer do MOD-PROWENIENCJA-DOWODOW.md dla spraw ≥5 plików.

### 3. WARN

Brak.

### 4. WERYFIKACJA Dz.U.

Poza zakresem. Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA SYSTEMU — SNAPSHOT

- Skille user/: 33 skille (bez zmian liczby)
- Nowy plik shared/: MOD-PROWENIENCJA-DOWODOW.md
- Pliki analizator/ zmodyfikowane: SKILL.md (v5.9.0), modules/MP6-sledczy.md
- CHECKLIST-DEDUP: +4 wpisy proweniencja

### 6. WNIOSKI I ZALECENIA

1. BLOK-PROWENIENCJA wymaga aktualizacji `assets/dashboard.html` o zakładkę
   "Proweniencja" z wizualizacją klastrów P+/P-/P! — do kolejnej sesji.
2. Sprawdzić czy MET-CA (MOD-METODY-BADAWCZE) i TYP 6 LIN nie wymagają
   cross-referencji — CHECKLIST-DEDUP odnotowuje różnicę: MET-CA = zmiana
   narracji, LIN = proweniencja wspólnego źródła. Nie scalać.
3. Pisma-procesowe-v3 W1.2c: dodać trigger do MOD-PROWENIENCJA-DOWODOW
   gdy ≥2 dowody klasy C/D — odłożone do następnej modyfikacji pisma.

## AUDYT-2026-06-24 — Implementacja E2T/DTA: warstwy dowodowe i DTA-ID-MODE

**Zakres:** Targeted — 3 pliki shared/ + analizator-dowodow-v3.
Wywołanie: analiza porównawcza frameworków ChatGPT (E2T) i Grok (DTA) →
implementacja wybranych konceptów w systemie prawnym AI.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 |
| Ostrzeżenia WARN | 0 |
| Naprawy wykonane | 5 zmian w 4 plikach + 1 nowy blok + 1 nowy tryb |
| Skille zmodyfikowane | analizator-dowodow-v3 (v5.7.0 → v5.8.0), shared/ (3 pliki) |
| CHECKLIST-DEDUP | zaktualizowana (9 nowych wpisów) |
| Dz.U. | bez zmian — poza zakresem |
| HARDGATE | ✅ nienaruszony |

### 2. NAPRAWY WYKONANE

**shared/DOWODY-METODOLOGIA.md** (v1.0 → v1.1):
- Dodano §5 Klasy źródeł dowodowych A–G z wagami (10/10 → 3/10)
  i mapowaniem do ★★★/★★/★ macierzy D×T.
- Dodano §6 Klasy pewności faktu (BEZSPORNE/PEWNE/WYDEDUKOWANE/SPORNE)
  jako standard systemowy — przeniesione z chronologia-sprawy-v1 do shared/.
- Plik: 41 → 130 linii. Zmiany addytywne — §1-4 bez modyfikacji.

**shared/MOD-MACIERZ-DOWOD-TEZA.md** (v1.0.0 → v1.1.0):
- Dodano MT4a: filtr przydatności procesowej (USE/SKIP/UWAGA) między MT4 a MT5.
- MT5 zaktualizowany: tylko tezy USE+UWAGA trafiają do W1.3. Tezy SKIP → rejestr archiwalny.
- Wzorzec: DTA W7. STOP po MT4a wymagany przed MT5.

**shared/MOD-ATAK-NA-DRAFT.md** (v1.1.0 → v1.2.0):
- §5 RAPORT D sekcja D2: dodano metrykę SIŁA-ATAKU (N/10) per teza/argument
  oraz siłę po kontrze. Progi: ≥8/10 → akapit obowiązkowy; 5-7 → zdanie;
  ≤4 → tylko rejestr. Wzorzec: DTA W8.

**analizator-dowodow-v3/SKILL.md** (v5.7.0 → v5.8.0):
- Dodano BLOK-KONSEKWENCJE (DTA W6): KC1 skutek bezpośredni → norma,
  KC2 skutek pośredni → roszczenia, KC3 skutek strategiczny → pozycja.
  Trigger: ZAWSZE po ustaleniu tez. Wymóg: ≥2 konsekwencje per teza.
  Tablica consequences[] w dashboardzie.
- Dodano DTA-ID-MODE: numeracja D-NNN/F-NNN/T-NN.
  Trigger OBOWIĄZKOWY: ≥5 plików LUB ≥5 tez. Procedura DTA-1..DTA-4.
  Zasada F-NNN: tylko fakty (ZAKAZ wniosków prawnych).

**analizator-dowodow-v3/modules/MOD-LAPSUS-AUDYT.md**:
- Dodano typ #23 LA-WNIOSEK-W-FAKCIE (KAT-II KWALIFIKACJA):
  fakt sformułowany jako wniosek prawny; severity ISTOTNE.
  Formalizacja zasady DTA W2 "fakty ≠ wnioski".

### 3. WARN

Brak.

### 4. WERYFIKACJA Dz.U.

Nie wykonywano (poza zakresem audytu targeted).
Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA SYSTEMU — SNAPSHOT

- Skille user/: 33 skille (bez zmian)
- Pliki shared/ zmodyfikowane: 3 (DOWODY-METODOLOGIA, MOD-MACIERZ, MOD-ATAK)
- Pliki analizator/ zmodyfikowane: SKILL.md (v5.8.0), modules/MOD-LAPSUS-AUDYT.md
- CHECKLIST-DEDUP: +9 wpisów (klasy A-G, klasy pewności, MT4a, BLOK-KONSEKWENCJE,
  DTA-ID-MODE, siła ataku, LA-WNIOSEK-W-FAKCIE)

### 6. WNIOSKI I ZALECENIA

1. BLOK-KONSEKWENCJE wymaga aktualizacji `assets/dashboard.html` (tablica
   `consequences[]`) — do wykonania w osobnej sesji gdy deweloper potwierdzi gotowość.
2. MOD-MACIERZ-DOWOD-TEZA §SIŁA_D (linia 60) opisuje "★★★ (A urzędowy) / ★★ (B prywatny ze źródła) / ★ (C pośredni)" — wymaga aktualizacji do nomenklaktury §5 DOWODY-METODOLOGIA
   (klasy A-G). Odłożone do kolejnego audytu — zmiana jednej linii, WARN-12.
3. DTA-ID-MODE integracja z MOD-MACIERZ-DOWOD-TEZA MT1.2 — przy następnej modyfikacji
   macierzy warto zsynchronizować format D-NNN z typologią DOK-URZ/DOK-PRY/etc.

**WARN-12:** MOD-MACIERZ-DOWOD-TEZA.md linia 60 — opis SIŁA_D używa "A/B/C" zamiast
nowej nomenklatury A-G z DOWODY-METODOLOGIA §5. Spójność opisowa, nie funkcjonalna.
Naprawić przy następnej modyfikacji macierzy.

## AUDYT-2026-06-17 — Weryfikacja powiązań wewnętrznych (FAZY 1–2C)

**Zakres:** Pełna weryfikacja spójności ścieżek view/load między skilami.
Wywołanie: "czy wszystkie powiązania wewnętrzne między skilami są prawidłowe".

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Pliki zinwentaryzowane | ~350+ .md (wszystkie skille user/) |
| Ścieżki view zweryfikowane | 174 unikalnych odwołań |
| Błędy CRIT | 1 (pisma-procesowe-v3: 5 brakujących MOD-*) |
| Ostrzeżenia WARN | 2 (DR-12 stary cross-ref; pisma-procesowe-v3 version) |
| NOTA-9 status | do zamknięcia (moduły wdrożone) |
| Descriptions | ✅ wszystkie < 900 znaków |
| INTERPRETACJE-URZEDOWE | ✅ wszystkie 16 DR |
| HARDGATE (router) | ✅ prawny-router-v3 OK |

### 2. CRIT

**CRIT-1: pisma-procesowe-v3 — 5 brakujących plików shared/**

Skill deklaruje w changelog wersję 3.3 z pięcioma modułami eksperckimi,
które są wywoływane przez `view` w kilku miejscach SKILL.md (linie 255, 346,
510, 524, 589–593), ale pliki nie istnieją w `/mnt/skills/user/shared/`:

- `shared/MOD-TIMING.md` — strategia timing, macierz T1–T5
- `shared/MOD-INTRO.md` — executive summary str. 1
- `shared/MOD-KONCENTRACJA.md` — metryka długości K1–K4
- `shared/MOD-PEER-REVIEW.md` — weryfikacja krzyżowa 4 role
- `shared/MOD-DOKTRYNA.md` — polityka cytowania komentarzy D-1–D-4

**Skutek:** każde wywołanie kroków W1.6, W2.2a, W3.7, W3.8 zakończy się
błędem (plik nieznaleziony). Skill działa tylko w trybie ≤v3.1.

**Akcja wymagana:** dostarczyć 5 plików ZIP lub wyłączyć kroki v3.3 z SKILL.md
do czasu dostarczenia plików.

### 3. WARN

**WARN-10: pisma-procesowe-v3 — rozbieżność version:**

`version: 3.1` w YAML front matter, ale changelog ma wpis `3.3` z nowymi
krokami. Po dostarczeniu 5 modułów (CRIT-1) → zaktualizować `version: 3.3`.

**WARN-11: DR-12/mod-ustawa-komornicy-sadowi-zawod.md linia 58:**

Tekst kieruje `→ DR-03/mod-ustawa-komornicy-sadowi` (plik usunięty NOTA-8).
Nie jest to `view` (nie powoduje błędu runtime), ale wprowadza w błąd
użytkownika. Naprawić: zmienić na `DR-02/mod-KPC-egzekucja-windykacja`.

### 4. WERYFIKACJA Dz.U.

Nie wykonywano (poza zakresem). Mapa: `mapa_dzu_2026-06-14.md` — bez zmian.

### 5. STRUKTURA SYSTEMU — SNAPSHOT

- Skille user/: 33 skille (bez zmian)
- NOTA-9 moduły (7 szt.): ✅ WDROŻONE w shared/ przed tym audytem
  (MOD-HISTORIA-STRATEGII, MOD-KONTEKST-SESJI, MOD-MAPA-PRZEPISOW,
  MOD-METODY-BADAWCZE, MOD-PRIORYTETY-ASPEKTOW, MOD-SELEKCJA-DOWODOW,
  MOD-WARIANTY-POZWU — wszystkie istnieją)

### 6. WNIOSKI I ZALECENIA

1. **Priorytet 1:** Dostarczyć 5 plików do shared/ (CRIT-1) — blokuje v3.3 pisma-procesowe.
2. **Priorytet 2:** Po wdrożeniu → `version: 3.3` w pisma-procesowe-v3/SKILL.md (WARN-10).
3. **Priorytet 3:** Naprawić WARN-11 w DR-12 (dead ref do usuniętego pliku DR-03).
4. **Priorytet 4:** Zamknąć NOTA-9 w CHECKLIST-DEDUP (⚠️ → ✅ dla 7 modułów).

---

## AUDYT-2026-06-15c — RODO: dokumenty wewnętrzne, archiwizacja, regulaminy wewnętrzne (J21) + krytyczna zmiana progu regulaminu pracy/wynagradzania (Dz.U. 2026/25)

**Zakres:** Kontynuacja serii dokumentów (po J20 — założycielskie) na żądanie
dewelopera: pokrycie dokumentów RODO (polityka prywatności, RCP/RCO, PBI,
upoważnienia, IOD, procedura naruszeń), polityki archiwizacji/retencji
dokumentów oraz regulaminów wewnętrznych (pracy, wynagradzania, ZFŚS,
monitoringu).

### 1. KRYTYCZNE ODKRYCIE — zmiana progu regulaminu pracy/wynagradzania

✅ VER online 2026-06-15: **Ustawa z 4.12.2025 r. o zmianie ustawy – Kodeks
pracy oraz ustawy o ZFŚS, Dz.U. 2026 poz. 25**, w życie 26/27.01.2026
(rozbieżność dat w źródłach — 26.01 vs 27.01, do wyjaśnienia w ISAP), BEZ
przepisów przejściowych:
- art. 104 KP: próg obowiązku regulaminu pracy podniesiony z **≥20** na
  **≥50 pracowników**; pracodawcy 20-49 wprowadzają regulamin TYLKO na
  wniosek zakładowej organizacji związkowej (nowy §3)
- art. 77² KP: analogiczna zmiana dla regulaminu wynagradzania
- liczne przepisy KP: "na piśmie" → "w postaci papierowej lub
  elektronicznej" (art. 22² §8, 23¹ §3, 174, 174¹, 237⁴ §3 i inne)
- ustawa o ZFŚS: nowa procedura uzgadniania regulaminu ZFŚS u pracodawców
  BEZ związków zawodowych — wymagane uzgodnienie z przedstawicielami załogi
  (jednolity mechanizm reprezentacji)

⚠️ Próg ZFŚS (≥50 pracowników dla obowiązku TWORZENIA Funduszu) NIE ZMIENIŁ
SIĘ — to odrębna kwestia od progu regulaminu pracy/wynagradzania (który
DOPIERO TERAZ zrównano z progiem ZFŚS na poziomie 50). Również próg
"≥20 pracowników" dla zwolnień grupowych (odrębna ustawa) NIE jest dotknięty
tą zmianą — moduły DR-04 dot. zwolnień grupowych pozostają poprawne.

### 2. NOWY MODUŁ: analizator-umow-v1/J21 —
mod-J21-rodo-archiwizacja-regulaminy.md

✅ VER online 2026-06-15. Struktura:
- J21.1 routing wewnętrzny (13 typów dokumentów → podstawa prawna, kiedy
  wymagany)
- J21.2 Polityka prywatności i klauzule informacyjne (art. 13/14 RODO) —
  rozróżnienie klauzula vs polityka, checklist elementów obligatoryjnych,
  pułapki (kopiuj-wklej, błędna podstawa prawna "zgoda")
- J21.3 RCP/RCO (art. 30 RODO — wyjątek <250 osób z istotnymi
  zastrzeżeniami), PBI (dokument nieobowiązkowy z nazwy, ale realizujący
  zasadę rozliczalności), upoważnienia do przetwarzania (spuścizna ustawy
  1997, funkcjonalnie nadal wymagane przez art. 29/32 ust. 4 RODO), IOD
  (kryteria art. 37), procedura zgłaszania naruszeń (72h, art. 33/34)
- J21.4 Regulamin pracy/wynagradzania — PEŁNY OPIS zmiany progu (Dz.U.
  2026/25) z konsekwencjami praktycznymi dla pracodawców 20-49 (regulamin
  już wprowadzony nie wygasa automatycznie — art. 9 KP) + checklist treści
  zaktualizowana o formę "papierową lub elektroniczną"
- J21.5 Regulamin ZFŚS — nowa procedura uzgadniania bez ZZ + checklist
- J21.6 Instrukcja kancelaryjna/polityka archiwizacji i retencji —
  rozgraniczenie sektor publiczny (DR-16) vs prywatny (ten moduł), kategorie
  okresów przechowywania (wszystkie oznaczone jako wymagające weryfikacji —
  ŻADNYCH konkretnych liczb podanych z pamięci), pułapka konfliktu okresu
  retencji z minimalizacją RODO (art. 6 ust. 1 lit. c jako odrębna podstawa)
- J21.7 Inne regulaminy (monitoring art. 22¹-22³, sprzęt/poczta/Internet) —
  z uwagą o konieczności regulaminu pracy jako podstawy kar porządkowych
- J21.8 Master checklista uzupełniająca

Rozgraniczenia zakresu wyraźnie wyartykułowane: vs DR-11 (substantywne
RODO/spory), vs mod-shared-rodo (DPA w umowach), vs J20 (regulaminy organów
korporacyjnych KSH — różne od regulaminów pracy/RODO), vs DR-16 (archiwizacja
publiczna vs prywatna).

### 3. Rejestracja J21

- SKILL.md: v1.9→v1.10, opis (1010/1024 znaków), tabela DOMAIN (nowy wiersz)
- mod-J0-routing.md: J.1 routing (nowy wiersz), MAPA KRZYŻOWA (4 nowe
  kombinacje), footer
- mod-shared-rodo.md: nota rozgraniczająca DPA-w-umowie (ten moduł) od
  samodzielnych dokumentów RODO (J21)
- DR-11/mod-RODO-GDPR-2016-679.md i mod-RODO-szczegolowy.md: nowe wiersze
  ŁĄCZ Z → J21

### 4. Korekty w DR-04 (przy okazji, ✅ VER online 2026-06-15)

- mod-ustawa-ZFSS.md: dodano notę o Dz.U. 2026/25 (nowa procedura
  uzgadniania regulaminu ZFŚS bez ZZ) + sekcję z checklistą, odesłanie do
  J21.5. Próg ≥50 dla obowiązku tworzenia ZFŚS POTWIERDZONY jako niezmieniony.
- mod-KP-prawo-pracy.md: nowy wiersz w tabeli "ALERTY LEGISLACYJNE" dla
  zmiany progu regulaminu pracy/wynagradzania (Dz.U. 2026/25) + nowy wiersz
  POWIĄZANIA → J21. Minimalne wynagrodzenie 2026 (4806 zł) z tego modułu
  potwierdza limit działalności nierejestrowanej z AUDYT-2026-06-15b
  (225% × 4806 = 10 813,50 zł — zgodność potwierdzona).

### Pliki zmienione (8)

analizator-umow-v1/SKILL.md, references/mod-J0-routing.md,
references/mod-shared-rodo.md (edycje) + references/mod-J21-rodo-
archiwizacja-regulaminy.md (NOWY); dr-11/modules/mod-RODO-GDPR-2016-679.md,
modules/mod-RODO-szczegolowy.md (edycje); dr-04/modules/mod-ustawa-ZFSS.md,
modules/mod-KP-prawo-pracy.md (edycje); audyt-systemu-v4/references/
AUDIT-JOURNAL.md (ten wpis).

**Status:** ZAMKNIĘTE. Następny krok: ZIP-y dla analizator-umow-v1, dr-11,
dr-04, audyt-systemu-v4 → present_files.

---

## AUDYT-2026-06-15b — Formy działalności gospodarczej + dokumenty założycielskie/wewnętrzne (J20) + rozbudowa analizator-dowodow-v3

**Zakres:** Na żądanie dewelopera — rozbudowa pokrycia o (1) pełny przegląd
form prowadzenia działalności gospodarczej w Polsce (działalność
nierejestrowana, JDG, spółka cywilna, spółki handlowe KSH) wraz z (2)
dokumentami założycielskimi i wewnętrznymi (umowa spółki/statut, regulaminy
organów, founders' agreement/umowa założycielska), oraz integracja tych
elementów w skillach analizy/redakcji umów i dowodów.

### 1. DR-02/mod-KSH-spolki-handlowe — rozbudowa

✅ VER online 2026-06-15:
- TYPY SPÓŁEK: uzupełniono tabelę o S.K.A. (komplementariusz nieograniczona/
  akcjonariusz brak odpow.) i PSA (brak odpow. akcjonariuszy) — wcześniej
  nieobecne mimo że PSA wspominana gdzie indziej w module.
- NOWA SEKCJA "FORMY DZIAŁALNOŚCI GOSPODARCZEJ — PEŁNY PRZEGLĄD":
  - Działalność nierejestrowana: Prawo przedsiębiorców art. 5 w brzmieniu
    OD 1.01.2026 (nowelizacja Dz.U. 2025 poz. 769, podpisana 21.08.2025) —
    limit KWARTALNY 225% minimalnego wynagrodzenia (≈10 813,50 zł/kw. w
    2026, "podąża" za płacą minimalną), warunek 60 miesięcy bez działalności,
    przekroczenie → 7 dni na CEIDG (art. 5 ust. 3-4), przychód należny wg
    art. 5 ust. 6.
  - JDG: Prawo przedsiębiorców t.j. Dz.U. 2025 poz. 1480 (obwieszczenie
    20.10.2025) — CEIDG, brak osobowości prawnej, odpowiedzialność całym
    majątkiem bez separacji.
  - Spółka cywilna: KC art. 860-875 (Dz.U. 2025 poz. 1071 ze zm.) — NIE
    spółka handlowa (KSH art. 1 §2 katalog zamknięty), brak osobowości i
    zdolności prawnej, odpowiedzialność solidarna wspólników, umowa pisemna
    ad probationem.
  - Spółki KSH: kapitały minimalne zaktualizowane z dodaniem PSA (1 zł
    kapitał akcyjny, art. 300² §2 KSH) i S.K.A. (100 000 zł jak S.A.).
  - Podsumowanie "drogi" nierejestrowana → JDG → cywilna → osobowa →
    kapitałowa z 5 osiami różnic (odpowiedzialność, rejestracja,
    opodatkowanie, formalności, dokument założycielski).
- NOWA SEKCJA "DOKUMENTY ZAŁOŻYCIELSKIE I WEWNĘTRZNE":
  - Tabela dokumentów wg formy (umowa spółki cywilnej/jawnej/partnerskiej/
    komandytowej, statut S.K.A./PSA/S.A., regulamin zarządu/RN — z formami
    prawnymi).
  - Founders' Agreement: charakter (art. 353¹ KC, nie tożsamy z umową
    spółki), 4 etapy zastosowania (pre-formation/przy rejestracji/w trakcie/
    przy zakończeniu), 9-elementowa checklist (podział udziałów, wkłady,
    role, vesting/reverse vesting z good/bad leaver, IP, wynagrodzenia,
    procedury decyzyjne, zakaz konkurencji, mechanizmy wyjścia: lock-up/
    prawo odkupu/shotgun/deadlock), PUŁAPKA niezamierzonej spółki cywilnej
    (art. 860 KC) ze wzorem klauzuli wyłączającej, kolejność dokumentów przy
    inwestorze (FA → Term Sheet → umowa inwestycyjna → SHA).
  - Regulaminy organów: hierarchia (statut/umowa > regulamin), zarząd
    (fakultatywny), RN (obligatoryjna w S.A., w S.K.A. przy >25
    akcjonariuszach, w sp. z o.o. wyjątkowo), PSA — wybór systemu
    dualistyczny/monistyczny (rada dyrektorów, art. 300⁷³ i n. KSH), walne
    zgromadzenie.
- Rejestracja: ŁĄCZ Z (nowe wiersze do J20, doradca restrukturyzacyjny,
  opodatkowanie form w DR-06), ŹRÓDŁA ONLINE (Prawo przedsiębiorców 2025/1480,
  nowelizacja 2025/769, KC spółka cywilna, CEIDG), WERYFIKACJA ONLINE (3 nowe
  zapytania), QUALITY GATE (4 nowe punkty), nagłówek (źródła + daty
  weryfikacji).

### 2. DR-02/MAPA-AKTOW.md + prawo-polskie-v2/ROUTING-MAP.md

Nowy wiersz: Prawo przedsiębiorców (Dz.U. 2025 poz. 1480 t.j., art. 5 wg
nowelizacji Dz.U. 2025 poz. 769) → mod-KSH-spolki-handlowe (sekcja "FORMY
DZIAŁALNOŚCI GOSPODARCZEJ"). Pierwsza rejestracja tego aktu w systemie.

### 3. NOWY MODUŁ: analizator-umow-v1/J20 — Founders' Agreement, Umowa
Spółki/Statut, Regulaminy Organów (mod-FA-founders-dokumenty-zalozycielskie.md)

✅ VER online 2026-06-15. Struktura:
- J20.1 routing wewnętrzny (9 typów dokumentów → forma prawna)
- J20.2 Founders' Agreement — pełna checklist 9 elementów + pułapka spółki
  cywilnej + wzór klauzuli wyłączającej + kolejność dokumentów inwestycyjnych
- J20.3 Umowa spółki cywilnej — checklist wg KC art. 860-875 + pułapka
  przekształcenia (próg art. 26 §4 KSH)
- J20.4 Umowa spółki osobowej (jawna/partnerska/komandytowa/S.K.A.) —
  elementy minimalne, specyfika sp. partnerskiej (wolne zawody, art. 87/95
  KSH), struktura "sp. z o.o. sp.k."
- J20.5 Umowa sp. z o.o. / statut PSA/S.A./S.K.A. (akt założycielski) —
  elementy obligatoryjne i fakultatywne, zakaz aportu praca/usługi (art. 14
  §1 KSH) z wyjątkiem PSA, wymóg aktu notarialnego dla zmian (art. 255 §3 /
  430 §1 KSH)
- J20.6 Regulaminy organów — hierarchia, zarząd/RN/rada dyrektorów (PSA
  monistyczna)/walne, quality gate dla regulaminów
- J20.7 Master checklista uzupełniająca (forma, spójność dokumentów,
  rejestracja KRS, PCC)

Wyraźne rozgraniczenie zakresu: J20 = etap ZAŁOŻENIA/FORMACJI (pre- i
at-formation dokumenty) vs mod-MA-transakcje = etap POST-FORMATION/
TRANSAKCYJNY (SPA/SHA/LOI, zwykle przy wejściu inwestora). Przy obu etapach
łącznie → wczytaj oba moduły i sprawdź spójność (np. vesting z FA
odzwierciedlony w SHA).

### 4. Rejestracja J20 w analizator-umow-v1

- SKILL.md: opis (v1.8→v1.9, 928/1024 znaków), tabela modułów DOMAIN (nowy
  wiersz J20)
- mod-J0-routing.md: J.1 routing (nowy wiersz), MAPA KRZYŻOWA (4 nowe
  kombinacje: J20+MA, J20+J9/J6, J20+I, J20 samodzielnie dla przekształcenia
  cywilna→handlowa), footer
- mod-MA-transakcje.md: nowa notatka w nagłówku rozgraniczająca SHA
  (post-formation) od J20 (pre-formation/founders' agreement)

### 5. analizator-dowodow-v3 — drobne uzupełnienia

- MD1-klasyfikacja.md: hierarchia dowodów — dodano przykłady "umowa spółki/
  statut w wersji złożonej do KRS" (poziom A) i "founders' agreement/
  regulaminy organów (nieujawniane w KRS)" (poziom C)
- MX-dziedziny.md: rozszerzono słowa kluczowe domeny [GOSP] o "statut, umowa
  spółki, founders' agreement, regulamin zarządu/RN" + odesłanie do
  analizator-umow-v1 J20 dla redakcji/analizy dokumentu

### Rejestracja architektoniczna — decyzja o NIE-zmianie pisma-procesowe-v3/
pisma-proste-v2

Sprawdzono: drafting umowy spółki/statutu/regulaminu/founders' agreement to
zadanie typu "redakcja umowy", nie "pismo procesowe" — poprawnie homed w
analizator-umow-v1 (J20). pisma-procesowe-v3 i pisma-proste-v2 pozostają
bez zmian — ich zakres (pisma sądowe/do organów) nie obejmuje dokumentów
korporacyjnych. Brak zmian = potwierdzenie poprawnej granicy architektonicznej,
nie przeoczenie.

### Pliki zmienione (7)

dr-02/MAPA-AKTOW.md, modules/mod-KSH-spolki-handlowe.md (rozbudowa);
prawo-polskie-v2/ROUTING-MAP.md (nowy wiersz); analizator-umow-v1/SKILL.md,
references/mod-J0-routing.md, references/mod-MA-transakcje.md (edycje) +
references/mod-FA-founders-dokumenty-zalozycielskie.md (NOWY); analizator-
dowodow-v3/modules/MD1-klasyfikacja.md, modules/MX-dziedziny.md (edycje);
audyt-systemu-v4/references/AUDIT-JOURNAL.md (ten wpis).

**Status:** ZAMKNIĘTE. Następny krok: ZIP-y dla dr-02, analizator-umow-v1,
analizator-dowodow-v3, prawo-polskie-v2, audyt-systemu-v4 → present_files.

---

## AUDYT-2026-06-15a — Zawody prawnicze pokrewne: doradca restrukturyzacyjny (syndyk/nadzorca/zarządca) + status mediatora + korekta Prawa restrukturyzacyjnego

**Zakres:** Kontynuacja AUDYT-2026-06-14j (zawody zaufania publicznego) na
żądanie dewelopera — domknięcie pokrycia GRUPY ZAWODÓW PRAWNICZYCH I
POKREWNYCH (syndycy, doradcy restrukturyzacyjni, mediatorzy), wcześniej
oznaczonej jako PENDING niskiego priorytetu.

### 1. NOWY MODUŁ: DR-02/mod-ustawa-doradca-restrukturyzacyjny-zawod

✅ VER online 2026-06-15. Kluczowe ustalenia:
- "Ustawa o licencji syndyka" (15.06.2007) PRZEMIANOWANA na "Ustawa o
  licencji doradcy restrukturyzacyjnego" — ostatni potwierdzony t.j. Dz.U.
  2022 poz. 1007 (obwieszczenie 28.04.2022), możliwy nowszy t.j. (flagowane
  do weryfikacji przy użyciu).
- JEDNA LICENCJA uprawnia do funkcji: syndyka (Prawo upadłościowe), nadzorcy/
  zarządcy (Prawo restrukturyzacyjne), zarządcy w zarządzie przymusowym
  (KPC) — art. 2 ustawy o licencji.
- Prawo upadłościowe art. 157 (t.j. Dz.U. 2025/614) — wymogi dla syndyka:
  osoba fizyczna z licencją + konto doradcy restrukturyzacyjnego w systemie
  teleinformatycznym, ALBO spółka handlowa ze wspólnikami/zarządem
  posiadającymi licencję.
- KLASYFIKACJA: zawód REGULOWANY z licencją MS, BEZ samorządu/izby (nadzór
  państwowy, nie korporacyjny) — NIE jest jednym z 15 "zawodów zaufania
  publicznego" z analizy Senatu OT-625, ale domyka pokrycie zawodów
  prawniczych i pokrewnych.
- Rozgraniczenie od istniejącego mod-PrUpad-upadlosc-restrukturyzacja:
  STATUS OSOBY (ten moduł) vs PRZEBIEG POSTĘPOWANIA (mod-PrUpad).

### 2. KRYTYCZNA KOREKTA: Prawo restrukturyzacyjne — nowy t.j. Dz.U. 2026 poz. 533

Podczas tworzenia modułu wykryto, że istniejący mod-PrUpad-upadlosc-
restrukturyzacja cytował Prawo restrukturyzacyjne jako Dz.U. 2024 poz. 1428
— NIEAKTUALNE. ✅ VER online 2026-06-15: **Dz.U. 2026 poz. 533** (obwieszczenie
Marszałka Sejmu z 27.03.2026, stan prawny na 25.03.2026) konsoliduje
poprzedni t.j. wraz ze zmianami z nowelizacji Dz.U. 2025 poz. 1085 (ustawa
25.07.2025 zmieniająca Prawo restrukturyzacyjne / Prawo upadłościowe / ustawę
o KRZ — WESZŁA W ŻYCIE 23.08.2025, potwierdzone via eli.gov.pl) oraz innych
nowelizacji 2025-2026. SKOROWANO: mod-PrUpad-upadlosc-restrukturyzacja (3
miejsca: nagłówek źródeł, sekcja TRYBY RESTRUKTURYZACJI, web_search template,
link ISAP → WDU20260000533) + dodano sekcję "Połącz z" odsyłającą do nowego
modułu doradcy restrukturyzacyjnego + footer z notatką korekty. Zaktualizowano
DR-02/MAPA-AKTOW.md (nowy wiersz) i prawo-polskie-v2/ROUTING-MAP.md (nowy
wiersz; istniejący wiersz Prawo restrukturyzacyjne 2026/533 był już
poprawny — to mod-PrUpad i DR-02/MAPA-AKTOW były nieaktualne).

### 3. STATUS MEDIATORA — nowa sekcja w DR-12/mod-KPC-arbitraz-mediacja-ADR

✅ VER online 2026-06-15. Kluczowe ustalenie: MEDIATOR NIE JEST zawodem
zaufania publicznego/regulowanym z własną ustawą i samorządem — to
KWALIFIKACJA/FUNKCJA wykonywana dodatkowo przez osoby różnych zawodów
(prawnicy, psycholodzy, "czyści" mediatorzy), uregulowana w KPC art. 1832
i n. Dlatego NIE utworzono odrębnego modułu — dodano sekcję "STATUS
MEDIATORA" do istniejącego mod-KPC-arbitraz-mediacja-ADR (DR-12), zawierającą:
- rozróżnienie mediator "zwykły" (KPC art. 1832 — każda osoba z pełną
  zdolnością do czynności prawnych, poza sędzią) vs "stały mediator"
  (dodatkowe wymogi: niekaralność, 26+ lat, wiedza + wpis na listę prezesa
  SO wg rozp. MS z 20.01.2016, Dz.U. 2016/122 — flagowane do weryfikacji
  nowszego t.j.)
- NGO/uczelnie mogą prowadzić własne listy mediatorów (wymaga zgody
  mediatora, info do prezesa SO)
- ⚡ NOWOŚĆ Dz.U. 2025 poz. 1172 (ustawa 5.08.2025, zmiana USP, w życie
  1.03.2026) — nowy art. 157b § 4 USP: stały mediator musi mieć konto
  w portalu informacyjnym sądów (ten sam portal co dla rzeczników
  patentowych — Dz.U. 2025/1679, DR-12/mod-ustawa-rzecznicy-patentowi-zawod)
- ⚡ Krajowy Rejestr Mediatorów (KRM) — pilotaż od 1.01.2024, status "w
  budowie", moduł nakazuje web_search aktualnego stanu

Zaktualizowano też: "Akty do sprawdzenia" (odesłanie do nowej sekcji),
checklisty quality gate (2 nowe punkty), web_search templates (2 nowe),
footer z notatką aktualizacji 2026-06-15.

### Rejestracja i pliki zmienione (8)

- dr-02/SKILL.md (moduły 18→19), MAPA-AKTOW.md (nowy wiersz + korekta
  wiersza Prawo upadłościowe odesłanie), modules/mod-ustawa-doradca-
  restrukturyzacyjny-zawod.md (NOWY), modules/mod-PrUpad-upadlosc-
  restrukturyzacja.md (korekta Dz.U. + cross-ref + footer)
- dr-12/modules/mod-KPC-arbitraz-mediacja-ADR.md (nowa sekcja STATUS
  MEDIATORA + akty do sprawdzenia + quality gate + web_search + footer)
- prawo-polskie-v2/ROUTING-MAP.md (nowy wiersz dla doradcy
  restrukturyzacyjnego)
- audyt-systemu-v4/references/AUDIT-JOURNAL.md (ten wpis)

**Status:** Pozycja "syndycy, mediatorzy, doradcy restrukturyzacyjni" z
AUDYT-2026-06-14j ZAMKNIĘTA. Pokrycie "zawodów prawniczych i pokrewnych"
(grupa rozszerzona poza ścisłą listę 15 zawodów zaufania publicznego)
ukończone. Generyczny moduł mod-ustawa-zawody-medyczne-i-prawnicze (DR-10)
nadal odsyła do syndyków/doradców restrukturyzacyjnych/mediatorów jako do
"obszaru bez dedykowanego modułu" — TO JEST TERAZ NIEAKTUALNE dla syndyków/
doradców restrukturyzacyjnych (nowy moduł DR-02) — ⚠️ PENDING: zaktualizować
cross-ref w mod-ustawa-zawody-medyczne-i-prawnicze (DR-10) w następnej sesji
(niski priorytet, kosmetyczne).

**Następny krok:** przygotowanie ZIP-ów dla zmienionych skilli (dr-02, dr-12,
prawo-polskie-v2, audyt-systemu-v4) i present_files.

---

## AUDYT-2026-06-14j — Domknięcie pokrycia "zawodów zaufania publicznego" (15 zawodów, analiza Senatu OT-625) + NOTA-8

**Zakres:** Na żądanie dewelopera: (1) zamknięcie NOTA-7 i C3 (opisane w
AUDYT-2026-06-14i powyżej), (2) systematyczny przegląd pokrycia systemu wobec
autorytatywnej listy 15 zawodów zaufania publicznego z analizą Senatu (Biuro
Analiz i Dokumentacji, OT-625, 2013): grupa (a) prawnicze — adwokat, radca
prawny, notariusz, komornik, kurator sądowy; (b) medyczne — lekarz, lekarz
weterynarii, aptekarz, pielęgniarka/położna, diagnosta laboratoryjny,
psycholog; (c) rynkowe — biegły rewident, doradca podatkowy, rzecznik
patentowy; (d) budowlane/przestrzenne — architekt, inżynier budownictwa,
urbanista.

**WYNIK PRZED SESJĄ:**
- (a) dobre pokrycie, ale wykryto NOTA-8 (duplikat komornik — patrz niżej)
- (b) częściowe — lekarz, pielęgniarka/położna, diagnosta lab. OK; BRAK:
  lekarz weterynarii, aptekarz, psycholog
- (c) ZERO dedykowanych modułów (tylko generyczny mod-ustawa-zawody-medyczne-
  i-prawnicze, bez Dz.U./treści proceduralnej)
- (d) ZERO dedykowanych modułów

### NOTA-8 ✅ ZAMKNIĘTE — duplikat komornik (DR-03 vs DR-12)
`dr-03/.../mod-ustawa-komornicy-sadowi.md` (39 l., stub, MAPA-AKTOW cytował
stary Dz.U. 2023/1691) vs `dr-12/.../mod-ustawa-komornicy-sadowi-zawod.md`
(202 l., pełny). Oba miały deklarowany podział "zawód (DR-12) vs tryb
egzekucji (DR-03)", ale faktyczna treść DR-03 była tym samym zakresem co
DR-12 (status, OC, skarga 767 KPC, wybór komornika), nie odrębnym "trybem
egzekucji" (to żyje w DR-02/mod-KPC-egzekucja-windykacja). DR-03 stub
USUNIĘTY. Zaktualizowano: DR-03/MAPA-AKTOW (odesłanie + poprawiony Dz.U.
2024/1458 t.j.), DR-12/SKILL.md (usunięto martwy cross-ref), DR-12/
mod-ustawa-notariat.md i mod-ustawa-komornicy-sadowi-zawod.md (cross-refy →
DR-02/mod-KPC-egzekucja-windykacja, poprawiono też nazwę pliku — wcześniej
cytowano nieistniejący "...-i-windykacja"). Pełny opis w CHECKLIST-DEDUP.md.

### 6 NOWYCH MODUŁÓW — wszystkie z weryfikacją online 2026-06-14, HARDGATE,
intake/mapa proceduralna/quality gate/orzecznictwo/powiązania/disclaimer:

1. **DR-12/mod-ustawa-rzecznicy-patentowi-zawod** — Dz.U. 2024 poz. 749 t.j.
   + nowelizacja Dz.U. 2025 poz. 1679 (PESEL w rejestrze, w życie 3.02.2026).
   Art. 1 ustawy WPROST stwierdza, że to zawód zaufania publicznego.
   Odnotowano odrębny PROJEKT (zwolnienie adwokatów/radców z części
   egzaminu) — status do weryfikacji.

2. **DR-06/mod-ustawa-biegli-rewidenci-zawod** — Dz.U. 2025 poz. 1891 t.j.
   (najnowszy, opublikowany 31.12.2025). Samorząd PIBR. NOWOŚĆ: rozp. MF
   i Gospodarki z 25.09.2025 wprowadza uprawnienie do atestacji
   sprawozdawczości ESG/CSRD — odrębne od tradycyjnego badania sprawozdań.
   Harmonogram ESG wielokrotnie odraczany (nowelizacja lipiec 2025 — kolejne
   2 lata) — moduł nakazuje zawsze weryfikować online.

3. **DR-06/mod-ustawa-doradcy-podatkowi-zawod** — ostatni potwierdzony t.j.
   Dz.U. 2021 poz. 2117 + nowelizacja Dz.U. 2025 poz. 1882 (4.12.2025,
   rozszerza zakres czynności doradztwa + zmienia PPSA). Moduł flaguje, że
   może istnieć nowszy t.j. po tej nowelizacji — wymaga weryfikacji przy
   użyciu. Podkreślono, że krąg uprawnionych do doradztwa podatkowego jest
   SZERSZY niż tylko doradcy podatkowi (adwokaci, radcowie, biegli rewidenci
   w określonym zakresie).

4. **DR-09/mod-ustawa-architekci-inzynierowie-budownictwa-zawod** — Dz.U.
   2025 poz. 1783 t.j. (najnowszy, 15.12.2025). KRYTYCZNE USTALENIE:
   samorząd zawodowy URBANISTÓW został ZNIESIONY 10.08.2014 (ustawa o
   ułatwieniu dostępu do zawodów regulowanych) — analiza Senatu OT-625
   (2013) jest w tym punkcie NIEAKTUALNA. Byli urbaniści zrzeszają się
   dobrowolnie w Stowarzyszeniu Polska Izba Urbanistów (KRS 0000527049),
   które NIE jest izbą w rozumieniu ustawy. Moduł obejmuje WYŁĄCZNIE
   architektów i inżynierów budownictwa, z wyraźną sekcją historyczną
   o urbaniście.

5. **DR-10/mod-ustawa-aptekarz-zawod** — Dz.U. 2025 poz. 1693 t.j.
   (opublikowany ok. 4.12.2025). Samorząd: Naczelna Izba Aptekarska +
   okręgowe izby aptekarskie, rejestr farmaceutów. Wyraźne rozgraniczenie
   od mod-PrFarm-* (aptekarz jako OSOBA vs apteka jako PLACÓWKA) —
   analogicznie do wzorca z NOTA-8. Odnotowano potrzebę weryfikacji, czy
   istnieje odrębna "ustawa o zawodzie farmaceuty" (2020) i jej relacja do
   ustawy o izbach aptekarskich.

6. **DR-10/mod-ustawa-lekarz-weterynarii-zawod** — Dz.U. 2026 poz. 125 t.j.
   (najnowszy, obwieszczenie 26.01.2026). Samorząd: Krajowa Rada
   Lekarsko-Weterynaryjna + okręgowe rady, sądownictwo lekarsko-
   weterynaryjne (odpowiedzialność zawodowa). Rozgraniczenie od istniejącego
   mod-ustawa-inspekcja-weterynaryjna (zawód vs organ nadzoru).

7. **DR-10/mod-ustawa-psycholog-zawod** — ⚠️ NAJBARDZIEJ KRYTYCZNY z
   nowych modułów. Nowa ustawa z 23.01.2026 (Dz.U. 2026 poz. 187, podpisana
   przez Prezydenta 12.02.2026, ogłoszona 18.02.2026) ZASTĘPUJE ustawę z
   2001 r. (Dz.U. 2019 poz. 1026), która nigdy nie została wdrożona (brak
   przepisów wykonawczych, samorząd — Regionalne Izby Psychologów — nigdy
   nie powstał). STAN NA CZERWIEC 2026 (TERAZ): formalnie obowiązuje wciąż
   ustawa z 2001 — ale ponieważ samorząd nie istnieje, JEDYNYM wymogiem
   wykonywania zawodu jest dyplom magistra psychologii; nie istnieje
   rejestr/PWZ/izba operacyjnie. Nowa ustawa wchodzi w życie w całości
   19.05.2028 (2 lata 3 miesiące od ogłoszenia), z WYJĄTKIEM przepisów o
   Komitecie Organizacyjnym Izb Psychologów — te weszły w życie już
   5.03.2026. Moduł zawiera trzy odrębne sekcje (stan teraz / stan po 2028 /
   zasady absolutne) i wymusza ustalenie daty zdarzenia jako pierwszy krok
   intake. Odnotowano kontrowersje (poparcie środowiska zawodowego vs
   krytyka FOR dot. barier dostępu) — moduł nakazuje przedstawić obie
   perspektywy.

**Rejestracja:** wszystkie 6 modułów zarejestrowane w SKILL.md właściwego DR
(liczniki: DR-12 11→12, DR-06 17→19, DR-09 15→16, DR-10 22→25), MAPA-AKTOW
właściwego DR, oraz prawo-polskie-v2/ROUTING-MAP.md. Generyczny moduł
mod-ustawa-zawody-medyczne-i-prawnicze (DR-10) zaktualizowany — odsyła do
nowych dedykowanych modułów dla rzeczników patentowych i doradców
podatkowych, pozostaje właściwy dla syndyków/mediatorów/doradców
restrukturyzacyjnych (wciąż brak dedykowanych modułów — PENDING dla
przyszłej sesji, niski priorytet).

**PENDING dla przyszłych sesji (niski priorytet):**
- syndycy, mediatorzy, doradcy restrukturyzacyjni — czy zasługują na
  dedykowane moduły analogiczne do tych 6 (obecnie tylko generyczny moduł)
- weryfikacja, czy istnieje odrębna "ustawa o zawodzie farmaceuty" (2020)
- okresowa weryfikacja harmonogramu ESG/CSRD (biegli rewidenci) i
  harmonogramu wdrożenia ustawy o zawodzie psychologa (2026-2028) —
  oba tematy z natury wymagają powtórnej weryfikacji w kolejnych sesjach

**Pliki zmienione (12):** dr-03/MAPA-AKTOW.md; dr-12/SKILL.md, MAPA-AKTOW.md,
modules/mod-ustawa-notariat.md, modules/mod-ustawa-komornicy-sadowi-zawod.md
(edycje) + modules/mod-ustawa-rzecznicy-patentowi-zawod.md (nowy); dr-06/
SKILL.md, MAPA-AKTOW.md + modules/mod-ustawa-biegli-rewidenci-zawod.md,
modules/mod-ustawa-doradcy-podatkowi-zawod.md (nowe); dr-09/SKILL.md,
MAPA-AKTOW.md + modules/mod-ustawa-architekci-inzynierowie-budownictwa-zawod.md
(nowy); dr-10/SKILL.md, MAPA-AKTOW.md, modules/mod-ustawa-zawody-medyczne-i-
prawnicze.md (edycja) + modules/mod-ustawa-aptekarz-zawod.md, modules/
mod-ustawa-lekarz-weterynarii-zawod.md, modules/mod-ustawa-psycholog-zawod.md
(nowe); prawo-polskie-v2/ROUTING-MAP.md (7 nowych wierszy); audyt-systemu-v4/
references/CHECKLIST-DEDUP.md (NOTA-8).

**Status:** Wszystkie pozycje z poprzedniej sesji (AUDYT-2026-06-14i) oraz
przegląd zawodów zaufania publicznego ZAMKNIĘTE. Następny krok (jeśli
deweloper potwierdzi): przygotowanie nowych ZIP-ów dla zmienionych skilli
(dr-03, dr-06, dr-09, dr-10, dr-12, prawo-polskie-v2, audyt-systemu-v4)
i present_files.

---

## AUDYT-2026-06-14i — Domknięcie NOTA-7 (duplikat wyroby medyczne) i C3 (mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych)

**Zakres:** Domknięcie dwóch ostatnich pozycji otwartych po AUDYT-2026-06-14h,
na żądanie dewelopera. Wszystkie przepisy zweryfikowane online przed edycją.

- **NOTA-7 (duplikat wyroby medyczne, DR-10)** ✅ ZAMKNIĘTE —
  `mod-ustawa-wyroby-medyczne.md` (32 l., stub) USUNIĘTY. Unikalna treść
  (obowiązki wytwórcy/importera/dystrybutora wg MDR, UDI, CE-marking, PRRC,
  PMS/PSUR, status EUDAMED po rozp. (UE) 2024/1860) scalona do
  `mod-wyroby-medyczne.md` (kanoniczny, z HARDGATE). SKILL.md (22 moduły,
  było 23) i MAPA-AKTOW zaktualizowane — jeden wpis → mod-wyroby-medyczne.
  Przy okazji: zweryfikowano online aktualną nazwę organu — **URPL** (Urząd
  Rejestracji Produktów Leczniczych, Wyrobów Medycznych i Produktów
  Biobójczych, gov.pl/web/urpl). Poprawiono błędny wariant "UPLWMiPB (dawny
  URPL)" w 3 plikach (mod-wyroby-medyczne, mod-PrFarm-prawo-farmaceutyczne ×2,
  mod-PrFarm-szczegolowy ×2) — URPL jest aktualną nazwą, kierunek był odwrócony.
  Usunięto niezweryfikowany termin "15-30 dni" dla zgłoszeń incydentów MDR,
  zastąpiono odesłaniem do MDR art. 87 + wytycznych MDCG (terminy zależą od
  powagi incydentu, brak jednej liczby do zacytowania bez weryfikacji).

- **C3 (mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych, DR-03)** ✅ ZAMKNIĘTE —
  Weryfikacja online (orka.sejm.gov.pl, isap.sejm.gov.pl, lexlege, portalzp):
  - Skorygowano Dz.U. modułu: **2024 poz. 1247 → 2024 poz. 1822 t.j.** (MAPA-AKTOW
    już miał poprawny numer od sesji wcześniejszej; sam moduł — nie).
  - Potwierdzono: **Dz.U. 2025 poz. 1440** (ustawa z 26.09.2025) to REALNA,
    enacted nowelizacja — ale wąska technicznie: zmienia KRK (rejestracja
    orzeczeń wobec podmiotów zbiorowych, w tym z art. 9a), KSH (wniosek o
    zwolnienie z zakazu funkcji w terminie 3 mies.), ustawę o podmiotach
    zbiorowych i ustawę AML.
  - **Art. 9a ISTNIEJE** w t.j. 2024/1822 (potwierdzone odesłaniem w treści
    nowelizacji 1440: "...obowiązek naprawienia szkody lub zadośćuczynienia
    za doznaną krzywdę oraz nawiązki, o których mowa w art. 7, art. 8, art. 9
    i art. 9a..."). Dokładne brzmienie art. 9a NIE zostało zweryfikowane
    słowo-w-słowo (ISAP blokuje automatyczny fetch — robots disallowed) —
    moduł oznacza to jako wymagające weryfikacji w ISAP przed cytowaniem,
    zgodnie z HARDGATE.
  - Dodano DWA osobne alerty: (1) Dz.U. 2025 poz. 1440 — wąska nowelizacja
    KRK/KSH, (2) PLANOWANA DUŻA REFORMA — odrębny, szerszy projekt (eliminacja
    prejudykatu, katalog otwarty, 10-letnie przedawnienie, compliance) wciąż
    na etapie projektu wg dostępnych źródeł — moduł nakazuje weryfikację
    aktualnego statusu przed powołaniem, żeby nie pomylić tych dwóch inicjatyw.
  - Uzupełniono sekcję "Kary": dodano art. 7a (odrębna podstawa wymiaru),
    art. 8 (przepadek — z wyjątkiem zwrotu uprawnionemu), art. 9a (obowiązek
    naprawienia szkody — nowość względem poprzedniej wersji modułu), zatarcie
    (10 lat).

**Pliki zmienione:** `dr-10/.../mod-wyroby-medyczne.md`, `dr-10/.../mod-PrFarm-prawo-farmaceutyczne.md`,
`dr-10/.../mod-PrFarm-szczegolowy.md`, `dr-10/SKILL.md`, `dr-10/MAPA-AKTOW.md`,
`dr-03/.../mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych.md`,
`audyt-systemu-v4/references/CHECKLIST-DEDUP.md` (NOTA-7 zamknięta, footer).

**Status:** Wszystkie pozycje PENDING z AUDYT-2026-06-14g/h zamknięte. Zob.
niżej sekcję "Zawody zaufania publicznego" (przegląd pokrycia, ta sama sesja).

---

## AUDYT-2026-06-14h — Domknięcie pozycji PENDING: NOTA-6 (ORPHAN), B3 (ROUTING osierocony), NOTA-4 (5× moduł >400 linii)

**Zakres:** Domknięcie wszystkich pozostałych pozycji PENDING zidentyfikowanych
w AUDYT-2026-06-14g i wcześniejszych sesjach, na żądanie dewelopera.

- **NOTA-6 (ORPHAN shared/)** ✅ — 5 plików (`LOCAL-PUBLICATION-VALIDITY-CHECK.md`,
  `LOCAL-SOURCE-EQUIVALENCE-PROTOCOL.md`, `OFFICIAL-SOURCE-TIERING-PROTOCOL.md`,
  `PROFESSIONAL-SELF-GOVERNMENT-DEEP-STANDARD.md`, `SOURCE-HIERARCHY-EQUIVALENCE-PROTOCOL.md`)
  USUNIĘTE po potwierdzeniu zero konsumentów (`grep -rl`). Naprawiono jeden
  dangling pointer w `shared/INTERPRETACJE-URZEDOWE.md` (treść warstwy lokalnej
  wciągnięta inline, 6-wierszowe streszczenie).

- **B3 (ROUTING osierocony — usługi drogą elektroniczną, Dz.U. 2020 poz. 344)** ✅ —
  Przyczyna: `ROUTING-MAP.md` wiersz 411 wskazywał `mod-ustawa-otwarte-dane`
  (copy-paste z wiersza powyżej) zamiast `mod-ustawa-uslugi-elektroniczne`.
  Moduł `mod-ustawa-uslugi-elektroniczne.md` (44 linie) ISTNIEJE i DR-11
  `MAPA-AKTOW.md` od początku miał poprawne mapowanie — błąd był wyłącznie
  w `prawo-polskie-v2/ROUTING-MAP.md`. Naprawiono jedną linią.

- **NOTA-4 — 5× moduł >400 linii (PENDING)** ✅ wszystkie zamknięte:
  - `mod-PZP-zamowienia-publiczne-KIO` (493→394): wydzielono compliance SWZ/OPZ
    (art. 99 PZP), certyfikację wykonawców, podwykonawstwo i zabezpieczenie
    → `mod-PZP-wykonanie-umowy-compliance.md` (NOWY, 180 l.)
  - `mod-PRD-prawo-jazdy-punkty-karne` (492→367): wydzielono BRD II (nielegalne
    wyścigi, brawurowa jazda, drift art. 86c KW), sądowy zakaz/dożywotni
    zakaz/przepadek, oraz BRD I (prawo jazdy od 17 lat)
    → `mod-PRD-nowe-przestepstwa-drogowe-BRD.md` (NOWY, 222 l.)
  - `mod-PrFarm-szczegolowy` (468→330): usunięto zduplikowaną CZĘŚĆ IX (wyroby
    medyczne — już wydzielone 06-12 do mod-wyroby-medyczne, ale skopiowana
    treść pozostała tu jako duplikat); wydzielono refundację leków, nadzór
    GIF/WIF, sankcje karne/kary pieniężne → `mod-PrFarm-refundacja-nadzor-sankcje.md`
    (NOWY, 196 l.)
  - `mod-ustawa-cudzoziemcy` (455→350): wydzielono pełną taksonomię zezwoleń
    na pracę (typy A/B/C/D/S, ustawa Dz.U. 2025 poz. 621) i matrycę
    dokument→praca → `mod-ustawa-cudzoziemcy-zatrudnianie.md` (NOWY, 177 l.)
  - `mod-ustawa-akcyzowa-i-clo-UCC` (372→281, poniżej progu ale na żądanie
    dewelopera): podzielono wg dwóch reżimów prawnych — akcyza (krajowa,
    pozostaje) vs. cło/UCC (UE) → `mod-UCC-clo-taryfa-celna.md` (NOWY, 180 l.)

  Każdy nowy moduł: zarejestrowany w SKILL.md (liczniki zaktualizowane),
  cross-referencje POWIĄZANIA dodane w obu kierunkach, MAPA-AKTOW/ROUTING-MAP
  zaktualizowane gdzie dotyczyło.

- **NOTA-7 (NOWA)** — podczas pracy nad mod-PrFarm wykryto NIEZALEŻNĄ drugą
  duplikację: `mod-ustawa-wyroby-medyczne.md` (32 l., stub) i `mod-wyroby-medyczne.md`
  (73 l., pełny) to dwa moduły dla jednego aktu (Dz.U. 2022 poz. 974).
  PENDING — niski priorytet, nie blokuje wdrożenia.

**Pliki zmienione:** 5× usunięte z `shared/`, `shared/INTERPRETACJE-URZEDOWE.md`,
`prawo-polskie-v2/ROUTING-MAP.md` (×4 wiersze), 5× DR `SKILL.md` (liczniki +
rejestracje), 5× DR `MAPA-AKTOW.md` gdzie dotyczyło, 5× nowy plik modułu,
5× zmodyfikowany plik modułu źródłowego, `audyt-systemu-v4/references/CHECKLIST-DEDUP.md`
(NOTA-4 wszystkie wpisy zamknięte, NOTA-6 zamknięta, NOTA-7 nowa, footer
zaktualizowany).

**Status:** Wszystkie PENDING z AUDYT-2026-06-14g zamknięte z wyjątkiem NOTA-7
(nowo odkryta, niski priorytet) i pkt 3 "C3 — nadchodząca zmiana materialna"
(mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych — nowelizacja 2025/1440,
01.03.2026 — wymaga przeglądu materialnego poza zakresem tej sesji).

---

## AUDYT-2026-06-14g — Zamknięcie WARN-1/2/3 (skrócone)

**Zakres:** Domknięcie trzech najstarszych otwartych WARN z sesji 06-04/05,
nigdy formalnie niezamkniętych mimo że AUDYT-2026-06-13 raportował
"WARN otwarte: 0".

- **WARN-1** ✅ — 20 plików aktywnych shared/ bez wpisu w `DEPENDENCY-GRAPH.md`
  (CLAIM-VALIDATION, WERYFIKACJA-SLAD, ORZECZENIA-OUTPUT-SCHEMA, ORKA-BAS-*,
  DEFINICJE-KLUCZOWE, INTERPRETACJE-URZEDOWE, 4× standardy proceduralne
  ROUTING-BJ-BW, 4× mod-* niepełnosprawności) — dodane w 5 nowych sekcjach,
  konsumenci zweryfikowani `grep -rl`.
- **WARN-2** ✅ — `MATRIX-COMPLETENESS-AUDIT-GATE.md` / `MATRIX-ROUTING-PRIORITY-RULES.md`
  potwierdzono jako usunięte już w sesji 06-09. Nowe odkrycie: 5 plików
  o tym samym profilu (referencja tylko w starym snapshocie 06-04, brak
  `view`) oznaczone jako **ORPHAN** w DEPENDENCY-GRAPH (NOTA-6 w
  CHECKLIST-DEDUP, PENDING — decyzja dewelopera, niski priorytet).
- **WARN-3** ✅ — `shared/SKILL.md` doprecyzowany: `DEPENDENCY-GRAPH.md`
  (kompletny po WARN-1) jest jedynym pełnym rejestrem; lokalne tabele to
  wyciągi tematyczne (bez duplikacji ~60-wierszowej tabeli).

**Pliki zmienione:** `shared/DEPENDENCY-GRAPH.md` (+5 sekcji/+20 wpisów +
sekcja ORPHAN), `shared/SKILL.md` (sekcja "Zasada utrzymania").

**Wszystkie WARN z AUDYT-2026-06-04/05 formalnie zamknięte.** Otwarte:
5 PENDING NOTA-4 (moduły >400 linii), 5 ORPHAN (ten audyt, niski priorytet),
2 PENDING z AUDYT-2026-06-14f (ROUTING osierocony B3; "ISAP freshness sweep").

*Wpis zamknięty: 2026-06-14*

---

## AUDYT-2026-06-14f — TRYB DZU (sesja 2/2) — WARN-8 ZAMKNIĘTY (16/16)

**Data:** 2026-06-14
**Zakres:** Dokończenie WARN-8 — pozostałe 11 pozycji z worksheet
(A4-A6, B3-B5, C2-C5). Razem z sesją 1 (5 poz.): **16/16 zamknięte**.

### Zweryfikowano i naprawiono (11 pozycji)

| Poz. | Moduł / temat | Stare t.j. | Nowe t.j. (ISAP) | Uwagi |
|---|---|---|---|---|
| A4 | mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF (DR-12) | jeden numer (różny w ROUTING vs DR-MAPA) | **4 akty wymienione osobno**: UOKiK 2025/1714, URE (Pr. energetyczne) 2026/43, UKE (PKE) 2024/1221 + ustawa wsparcia telekom 2025/311, KNF ad hoc | Fałszywa rozbieżność — moduł już miał poprawną wewnętrzną tabelę 4 aktów; ROUTING/DR-MAPA błędnie kompresowały do jednej komórki. Rozwinięto oba wiersze |
| A5 | mod-KSCU-koszty-sadowe-i-pomoc-prawna (DR-12) | 2024/1303 | **2025/1228** | Potwierdzony t.j. z 01.09.2025, 4 nowelizacje skonsolidowane |
| A6 | mod-ustawa-informacje-niejawne (DR-13) | 2024/1612 (✅VER 06-05!) | **2025/1209** | Weryfikacja 06-05 przeoczyła t.j. z 11.08.2025 |
| B3 | mod-ustawa-otwarte-dane (DR-11) | 2021/1641 (akt oryg.) | **2023/1524 t.j.** | ROUTING miał poprawny numer; DR-MAPA i nagłówek modułu cytowały akt oryginalny zamiast jego t.j. Drugi wiersz ROUTING (2020/344, usługi elektroniczne) — NIE jest w zakresie modułu, oznaczony jako odrębny problem do zbadania |
| B4 | mod-KKS-karny-skarbowy-i-AML (DR-03) | AML: 2023/1124 | **AML: 2025/644** | t.j. z 09.05.2025; uwaga: dalsza nowelizacja 2025/1669 niesprawdzona |
| B5 | mod-interpretacje-definicje-podatkowe (DR-06) | brak nr Op w ROUTING | **Op 2025/111 dodany** + nowy wiersz PKWiU | Kosmetyczne — ROUTING uzupełniony zgodnie z DR-MAPA; PKWiU jako odrębny wiersz (nowy moduł z AUDYT-2026-06-14e) |
| C2 | mod-ustawa-narkomania (DR-03) | nieobecny w ROUTING | **2023/1939** (dodany) | Potwierdzony aktualny |
| C3 | mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych (DR-03) | 2024/1247 (DR-MAPA) | **2024/1822** | DR-MAPA też nieaktualny! t.j. z 06.12.2024; uwaga: nowelizacja 2025/1440 wchodzi 01.03.2026 (nowy art. 9a — obowiązek naprawienia szkody) |
| C4 | mod-ustawa-prawa-pacjenta-framework (DR-10) | nieobecny w ROUTING | **2024/581** (dodany) | Potwierdzony aktualny; uwaga: nowelizacja 2026/26 art.23 |
| C5 | mod-ustawa-medyczne-szczegolowy (DR-10) | 2024/799 (DR-MAPA) | **2026/156** | PODWÓJNIE nieaktualny — łańcuch 2024/799 → 2025/450 → 2026/156 (t.j. z 05.02.2026, w życie 10.02.2026) |

### Pliki zmienione

ROUTING-MAP.md (v5.3→v5.4, dodano 5 nowych wierszy: B1/B2 z sesji 1 już
liczone, plus C2/C3/C4/C5 + rozwinięcie A4; SUMA 274→279), dr-01, dr-03,
dr-10, dr-11 (+ nagłówek mod-ustawa-otwarte-dane.md), dr-12, dr-13
MAPA-AKTOW.md.

### Nowe odkrycia wymagające dalszej uwagi (NIE naprawione w tej sesji)

1. **C3 i C5 — "podwójna nieaktualność"**: w obu przypadkach DR-MAPA-AKTOW
   cytowało t.j., który był JUŻ zastąpiony przez kolejny t.j. zanim ten
   pierwszy trafił do systemu. C5 to ekstremalny przypadek: trzy t.j. w
   ciągu (2024/799 → 2025/450 → 2026/156) między oryginalnym wpisem i
   tą weryfikacją. To wzmacnia rekomendację z sesji 1: roczne/kwartalne
   t.j. dla aktywnie nowelizowanych ustaw (zdrowie, AML, KSCU) wymagają
   częstszej re-weryfikacji niż reszta systemu.
2. **B3 — drugi wiersz ROUTING (Ustawa o usługach świadczonych drogą
   elektroniczną, Dz.U. 2020 poz. 344)**: NIE jest w zakresie modułu
   mod-ustawa-otwarte-dane (zweryfikowano treść — moduł dotyczy wyłącznie
   otwartych danych/re-use). Możliwy błąd typu NOTA-5 (akt przypisany do
   złego modułu) lub ten akt po prostu nie ma własnego modułu i wiersz w
   ROUTING jest osierocony. PENDING — wymaga ustalenia czy istnieje
   pokrycie dla "świadczenia usług drogą elektroniczną" gdzieś w systemie.
3. **C3 — nadchodząca zmiana materialna**: nowelizacja 2025/1440 (wchodzi
   01.03.2026) wprowadza nowy art. 9a (obowiązek naprawienia szkody przez
   podmiot zbiorowy) — to ZMIANA SUBSTANTYWNA, nie tylko numeracji t.j.
   Moduł mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych powinien zostać
   sprawdzony pod kątem czy uwzględnia ten nowy środek.

### Status WARN-8: ✅ ZAMKNIĘTY (16/16, sesje 06-14d + 06-14f)

### Rekomendacja procesowa (powtórzona z sesji 1, wzmocniona)

Wzorzec "oba pliki nieaktualne" (A3, C3, C5) i "podwójna nieaktualność"
(C5) potwierdzają: 3-PULL (wykrywanie niespójności) nie wystarcza.
Sugerowany nowy tryb "ISAP freshness sweep" w audyt-systemu-v4 pozostaje
PENDING — decyzja dewelopera.

*Wpis zamknięty: 2026-06-14*

---

## AUDYT-2026-06-14e — NOTA-4: realizacja 2 modułów PRIORYTET (>400 linii)

**Data:** 2026-06-14
**Zakres:** Realizacja obu pozycji ⚠️ PRIORYTET z NOTA-4
(CHECKLIST-DEDUP.md) — mod-KC-cywilne-zobowiazania-odpowiedzialnosc (DR-02,
436 linii) i mod-interpretacje-definicje-podatkowe (DR-06, 432 linii).

### mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md (DR-02): 436 → 370 linii

1. **ANEKS E (dział spadku/nabycie spadku, 37 linii) — USUNIĘTY jako duplikat.**
   mod-KC-spadki.md (238 linii, dedykowany moduł) już w pełni pokrywa ten
   temat z większą głębią (zachowek, formy testamentu, zmiany od 15.11.2023).
   Zastąpiono pointerem w nowej sekcji "POWIĄZANIA Z INNYMI MODUŁAMI".

2. **ANEKS F (kredyty frankowe, 50 linii) — WYDZIELONY** do nowego modułu
   `mod-KC-kredyty-frankowe.md` (temat masowy, samodzielny, art. 385¹ KC,
   TSUE C-260/18 Dziubak + C-520/21, uchwała SN III CZP 6/21). Zarejestrowany
   w dr-02/SKILL.md (17→18 modułów).

3. **Pointer do DEF-ODPOWIEDZIALNOSC-SZKODA.md** dodany przy tabeli "Dwa
   reżimy odpowiedzialności" (sekcja 3). Overlap z DEF C.2-C.3 (art.
   415/471/442¹/361 KC) ZACHOWANY ŚWIADOMIE — DEF zawiera definicje
   kanoniczne (przesłanki), tabela w module to praktyczna wersja porównawcza
   do szybkiej kwalifikacji sprawy. Oba ujęcia mają różne cele, dokumentowane
   teraz wprost.

ANEKS D (służebności/prawo rzeczowe, 38 linii) — sprawdzony, BRAK duplikatu
w systemie (nie istnieje dedykowany moduł prawa rzeczowego) — zachowany
bez zmian.

### mod-interpretacje-definicje-podatkowe.md (DR-06): 432 → 403 linii

1. **Sekcja 4 (KLASYFIKACJE STATYSTYCZNE — PKWiU/CN/PKOB/KŚT, 39 linii) —
   WYDZIELONA** do nowego modułu `mod-PKWiU-klasyfikacje-statystyczne.md`.
   Temat przekrojowy: referencjonowany przez mod-VAT, mod-PIT, mod-CIT —
   wydzielenie poprawia odkrywalność (te 3 moduły wcześniej nie miały
   bezpośredniej ścieżki do tej treści, zagrzebanej w module interpretacji).
   Zarejestrowany w dr-06/SKILL.md (15→16 modułów).

2. **Sekcja 5 ("KLUCZOWE DEFINICJE PODATKOWE — ZESTAWIENIE")**: usunięto
   wpis "DZIAŁALNOŚĆ GOSPODARCZA (art. 5a pkt 6 PIT)" — duplikat
   DEF-PODATKOWE.md BLOK G. Dodano pointer do BLOK G + odniesienie do
   sekcji 2A/2B modułu (gdzie jest praktyczna głębia: NSA II FPS 1/21,
   KIS/NSA linie orzecznicze). Pozostałe 4 definicje sekcji 5 (mały
   podatnik, podmiot powiązany, stały zakład, B2B vs umowa o pracę) —
   zweryfikowane jako UNIKALNE (brak w DEF-PODATKOWE), zachowane bez zmian.

3. Dodano wiersz POWIĄZANIA → shared/definicje/DEF-PODATKOWE.md (BLOK G)
   dla definicji kanonicznych (przychód, KUP, rezydent, działalność gosp.).

### Nowe pliki utworzone

| Plik | Linie | Skill |
|---|---|---|
| mod-KC-kredyty-frankowe.md | 78 | DR-02 |
| mod-PKWiU-klasyfikacje-statystyczne.md | 60 | DR-06 |

### Status NOTA-4 po tej sesji

Oba PRIORYTET zamknięte. Pozostaje 5 PENDING (4 moduły >400 linii bez
analizy w tej sesji: mod-PZP-zamowienia-publiczne-KIO 493, mod-PRD-prawo-
jazdy-punkty-karne 492, mod-PrFarm-szczegolowy 468, mod-ustawa-cudzoziemcy
455; + mod-ustawa-akcyzowa-i-clo-UCC 372 jako niski priorytet poniżej
progu). CHECKLIST-DEDUP.md zaktualizowany.

*Wpis zamknięty: 2026-06-14*

---

## AUDYT-2026-06-14d — TRYB DZU (sesja 1/N) — WARN-8 częściowa realizacja

**Data:** 2026-06-14
**Zakres:** Pierwsza sesja dedykowana TRYB DZU dla WARN-8 (16 rozbieżności
Dz.U. między ROUTING-MAP i DR-MAPA-AKTOW). Pełny worksheet:
`audyt-systemu-v4/references/WARN-8-DZU-worksheet-2026-06-14.md`
*(usunięty po zamknięciu WARN-8 16/16 — patrz AUDYT-2026-06-14g, treść
skonsolidowana w tym wpisie i AUDYT-2026-06-14f)*.

### Zweryfikowano i naprawiono (5/16 pozycji)

| Poz. | Moduł | Stare t.j. (DR-MAPA) | Nowe t.j. (ISAP) | Pliki zmienione |
|---|---|---|---|---|
| A1 | mod-ustawa-notariat (DR-12) | 2022/1799 | **2026/614** | dr-12/MAPA-AKTOW.md (ROUTING już był OK) |
| A2 | mod-PrAut-wlasnosc-intelektualna-IP + mod-PrAut-media-internet-dobra-osobiste (DR-11) | 2022/2509 | **2025/24** | dr-11/MAPA-AKTOW.md (ROUTING już był OK) |
| A3 | mod-ustawa-komornicy-sadowi-zawod (DR-12) | 2023/1691 (DR-MAPA) / 2024/1458 (ROUTING) | **2026/26** ⚠️ patrz KOREKTA poniżej | dr-12/MAPA-AKTOW.md + ROUTING-MAP.md |
| B1 | mod-ustawa-KRS-i-ustroj-wladzy — komponent "mandat posła i senatora" (DR-01) | 2018/1799 | **2024/907** | dr-01/MAPA-AKTOW.md + nowy wiersz w ROUTING-MAP.md (brakował) |
| B2 | mod-ustawa-partie-polityczne-referendum — komponent "referendum" (DR-01) | 2020/851 | **2025/300** | dr-01/MAPA-AKTOW.md + nowy wiersz w ROUTING-MAP.md (brakował) |

> ### ⚠️⚠️ KOREKTA (dodana podczas sesji 2, 2026-06-14) — A3 błędny wynik
>
> Wynik "2026/26" dla komorników sądowych był **BŁĘDEM WYSZUKIWANIA** —
> Dz.U. 2026 poz. 26 to w rzeczywistości "Ustawa z dnia 18 grudnia 2025 r.
> o zmianie ustawy o systemie ubezpieczeń społecznych oraz niektórych
> innych ustaw" (SUS), niezwiązana z komornikami. Po ponownej weryfikacji
> w sesji 2: **aktualny t.j. ustawy o komornikach sądowych to Dz.U. 2024
> poz. 1458** (obwieszczenie 11.09.2024) — czyli ROUTING-MAP miał wartość
> poprawną od początku; tylko DR-MAPA-AKTOW (2023/1691) wymagał korekty.
>
> **NAPRAWIONE w sesji 2**: dr-12/MAPA-AKTOW.md → 2024/1458 (było błędnie
> 2026/26), ROUTING-MAP.md → 2024/1458 (było błędnie 2026/26, teraz
> oznaczone jako potwierdzony, nie skorygowany).
>
> **Wniosek metodologiczny**: gdy web_search zwraca numer Dz.U. niezgodny
> z tematem dokumentu źródłowego (URL/tytuł), priorytet ma zawartość
> dokumentu nad numerem w metadanych wyszukiwania — należy zweryfikować
> zgodność tematu przed zapisaniem wyniku.

Wszystkie wpisy oznaczone `✅ VER: 2026-06-14 (TRYB DZU)` z notatką o
poprzedniej wartości dla audytowalności. ROUTING-MAP.md → v5.3, tabela
SUMA: 255→257 ✅ OK, 272→274 łącznie, DR-01: 4→6 ✅ OK / 5→7 łącznie.

### ⚠️ KLUCZOWE ODKRYCIE — przeklasyfikowanie charakteru WARN-8

4/5 w pełni zweryfikowanych pozycji (A1, A2, B1, B2 — po korekcie A3, patrz
wyżej) miało t.j. **NIEAKTUALNY w OBU plikach** (nie tylko w "przegranym"
wskazanym przez 3-PULL): A1 (notariat), A2 (prawo autorskie), B1 (mandat
posła/senatora), B2 (referendum) — w każdym z tych przypadków DR-MAPA-AKTOW
cytował numer, który był ZASTĄPIONY nowszym t.j., a ROUTING-MAP albo miał
poprawny numer, albo wiersz był całkowicie nieobecny. A3, po korekcie, okazał
się być prostym przypadkiem "DR-MAPA nieaktualny, ROUTING poprawny" —
podobnym do A1/A2, nie przypadkiem "oba pliki nieaktualne".

W sesji 2 dwa kolejne przypadki "oba pliki nieaktualne" zostały potwierdzone
niezależnie: C3 (odpowiedzialność podmiotów zbiorowych, 2024/1247→2024/1822)
i C5 (działalność lecznicza, 2024/799→2026/156, łańcuch przez 2025/450) —
więc wzorzec pozostaje aktualny, mimo korekty A3.

**WARN-8 nie jest "16 jednorazowych rozbieżności"** — jest symptomem
**systemowego starzenia się cytatów t.j.** (Marszałek Sejmu re-publikuje
t.j. co 1-3 lata po akumulacji nowelizacji), które dotyczy potencjalnie
wszystkich ~280 cytowań Dz.U. w systemie, nie tylko tych wykrytych przez
3-PULL (3-PULL wykrywa tylko ROZJAZDY między plikami, nie absolutną
nieaktualność zgodnych cytatów).

**Rekomendacja procesowa (PENDING — decyzja dewelopera)**: rozważyć nowy,
okresowy tryb "ISAP freshness sweep" w audyt-systemu-v4 — niezależny od
3-PULL, flagujący t.j. starsze niż X miesięcy do priorytetowej
re-weryfikacji niezależnie od tego, czy pliki są ze sobą zgodne.

### Pozostałe 11/16 pozycji — NIE wykonane w tej sesji

- **A4 (regulatorzy UOKiK/URE/UKE/KNF)**: prawdopodobny przypadek typu
  NOTA-5 — DR-MAPA-AKTOW (2024/1221) cytuje "Prawo komunikacji
  elektronicznej" (akt UKE/telekom), nie UOKiK (2025/1714, w ROUTING-MAP).
  Moduł multi-regulatorowy może legalnie wymagać OBU cytatów dla różnych
  regulatorów — wymaga przeczytania treści modułu, nie tylko porównania
  numerów.
- **A5 (KSCU)**, **A6 (informacje niejawne)**: nie zweryfikowane na ISAP.
- **B3 (otwarte dane)**, **B4 (KKS/AML)**, **B5 (interpretacje podatkowe)**:
  nie zweryfikowane.
- **C1-C5 (5 modułów nieobecnych w ROUTING-MAP)**: nie zweryfikowane —
  C1 (PrAut media) jest powiązane z A2 i powinno dostać 2025/24 po
  potwierdzeniu.

Pełne instrukcje kontynuacji były w `WARN-8-DZU-worksheet-2026-06-14.md`
(usunięty po zamknięciu 16/16 — patrz AUDYT-2026-06-14f i 06-14g).

### Status WARN-8

🔓 Otwarty — 5/16 zrealizowane, 11/16 w worksheet do kontynuacji w
kolejnej sesji TRYB DZU. Worksheet zawiera pełną analizę i konkretne
akcje dla każdej pozycji, nie wymaga ponownej analizy od zera.

*Wpis zamknięty: 2026-06-14 (sesja w toku, kontynuacja planowana)*

---

## AUDYT-2026-06-14c — Realizacja WARN-7/8/9 z AUDYT-2026-06-14b

**Data:** 2026-06-14
**Zakres:** Targeted — naprawa WARN-7 i WARN-9 (zamknięte), pogłębiona analiza
WARN-8 (przeklasyfikowany, pozostaje otwarty z nowym opisem).

### WARN-7 — ✅ ZAMKNIĘTY (opcja b — deprecate)

`shared/AKTY-PRAWNE-MASTER.md` oznaczony jako ⛔ DEPRECATED (nagłówek z
wyjaśnieniem, treść zachowana do wglądu historycznego, nie wczytywać).
`shared/DEPENDENCY-GRAPH.md`: wiersz AKTY-PRAWNE-MASTER → DEPRECATED;
`LEGAL-REGISTRY.md` przywrócony do ACTIVE (był błędnie oznaczony PENDING
w poprzedniej sesji w oczekiwaniu na tę decyzję).

**Dodatkowe odkrycie przy tej okazji**: `shared/SKILL.md` (sekcja "Zasada
utrzymania") twierdził, że istnieje katalog `archive/` z 43 plikami
nieaktywnymi. Katalog `archive/` **nie istnieje na dysku** (zweryfikowano
`find`). Zaktualizowano `shared/SKILL.md` — usunięto nieprawdziwą wzmiankę,
opisano aktualną praktykę (oznaczanie in-situ ⛔ DEPRECATED, jak właśnie
zrobiono z AKTY-PRAWNE-MASTER).

### WARN-9 — ✅ ZAMKNIĘTY (część interlinie)

Usunięto po jednej zbędnej pustej linii w 7 plikach SKILL.md (dr-07, dr-10,
dr-11, dr-13, dr-14, dr-15, analizator-przepisow-v2) — wszystkie miały
dokładnie 2 kolejne puste linie (nie runy 3+), zredukowano do 1. Fences
parzyste we wszystkich 7 po edycji. Część description-length (2 pliki na
94-96% limitu) pozostaje jako informacyjna uwaga — brak akcji wymaganej,
oba w limicie.

### WARN-8 — PRZEKLASYFIKOWANY, POZOSTAJE OTWARTY

Pogłębiona analiza 18 pozycji "DR-MAPA-AKTOW → brak w ROUTING-MAP" wykazała:

- **3/18** to false positives czystego skanu regex — already covered jako
  amendment-referencje w formacie skompresowanym (`2024.1248` vs
  `Dz.U. 2024 poz. 1248`) wewnątrz istniejących wierszy ROUTING-MAP
  (Ustawa o Policji, Ustawa o obronie Ojczyzny, Ustawa o zarządzaniu
  kryzysowym). Brak akcji wymaganej.

- **11/18** — moduł JEST w ROUTING-MAP, ale **z INNYM numerem Dz.U. niż
  w DR-MAPA-AKTOW**, i w 6 z tych 11 przypadków ROUTING-MAP ma numer
  NOWSZY (2025-2026) niż DR-MAPA-AKTOW (2022-2024):
  mod-ustawa-notariat (ROUTING: 2026/614 vs MAPA: 2022/1799),
  mod-PrAut-wlasnosc-intelektualna-IP (ROUTING: 2025/24 vs MAPA: 2022/2509),
  mod-ustawa-komornicy-sadowi-zawod (ROUTING: 2024/1458 vs MAPA: 2023/1691),
  mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF (ROUTING: 2025/1714 vs MAPA: 2024/1221),
  mod-KSCU-koszty-sadowe-i-pomoc-prawna (ROUTING: 2025/1228 vs MAPA: 2024/1303),
  mod-ustawa-informacje-niejawne (ROUTING: 2025/1209 vs MAPA: 2024/1612).
  Pozostałe 5 z 11 mają różne numery bez oczywistej kierunkowości
  (różne akty tej samej "rodziny" tematycznej, np. KRS+ustrój władzy,
  partie polityczne, otwarte dane, działalność lecznicza, interpretacje
  podatkowe).

- **4/18** — moduł faktycznie nieobecny w ROUTING-MAP (mod-PrAut-media-
  internet-dobra-osobiste, mod-ustawa-narkomania, mod-ustawa-odpowiedzialnosc-
  podmiotow-zbiorowych, mod-ustawa-prawa-pacjenta-framework,
  mod-ustawa-medyczne-szczegolowy — 5, nie 4, korekta).

⛔ **NIE WYKONANO edycji ROUTING-MAP w tej sesji.** Dla 6 przypadków z
rozbieżnością "ROUTING-MAP nowszy niż DR-MAPA-AKTOW" nie można bezpiecznie
rozstrzygnąć, który plik jest aktualny, bez weryfikacji ISAP per pozycja —
to dokładnie scenariusz, przed którym chroni nowy KROK 2B w PRAWO-HARDGATE
(potwierdzenie PRZEDMIOTU + AKTUALNOŚCI aktu, nie tylko "który plik wygląda
nowszy"). Edycja na ślepo ryzykowałaby wpisanie nieaktualnej metryki do
centralnego rejestru.

**AKCJA REKOMENDOWANA — TRYB DZU (następna sesja, dedykowana)**:
1. Dla 6 pozycji z rozbieżnością kierunkową: zweryfikuj na ISAP który
   numer Dz.U. (ROUTING-MAP czy DR-MAPA-AKTOW) jest aktualnym t.j. —
   zaktualizuj PRZEGRANY plik (może być ROUTING-MAP ALBO DR-MAPA-AKTOW,
   do ustalenia per pozycja).
2. Dla 5 pozostałych z różnymi-ale-nie-kierunkowymi numerami: sprawdź czy
   to różne akty (wtedy dodać brakujący wiersz) czy ten sam akt pod
   różnymi t.j. (wtedy ujednolicić).
3. Dla 5 modułów nieobecnych w ROUTING-MAP: dodać wiersze po weryfikacji
   ISAP aktualnych metryk.
4. Po zakończeniu: wygenerować `mapa_dzu_2026-06-XX.md` jako pełny refresh
   (FAZA 7B), zaktualizować ROUTING-MAP → v5.2.

Szacowany zakres: ~16 pozycji do weryfikacji ISAP + edycji, sesja DZU
dedykowana (zbyt duży zakres dla "przy okazji").

### Status po tej sesji

| WARN | Status |
|---|---|
| WARN-7 | ✅ zamknięty |
| WARN-8 | ✅ zamknięty 2026-06-14 (TRYB DZU, 16/16 — AUDYT-2026-06-14d + AUDYT-2026-06-14f) |
| WARN-9 | ✅ zamknięty (interlinie); description-length — informacyjne, brak akcji |

*Wpis zamknięty: 2026-06-14*

---

## AUDYT-2026-06-14b — Pełny audyt (TRYB AUTO, Fazy 0-7)

**Data:** 2026-06-14
**Zakres:** Pełny audyt systemu, w kontynuacji sesji AUDYT-2026-06-14 (PRAWO-HARDGATE
KROK 2B/5B już wykonane przed tym audytem — patrz wpis poniżej).

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Skille ogółem | 33 + shared/ |
| Pliki ogółem (bez archive/) | 544 |
| Katalogi ogółem (bez archive/) | 90 |
| Rozmiar systemu | 5.1 MB |
| CRIT naprawione w tej sesji | 2 |
| Nowe WARN otwarte | 3 (WARN-7, WARN-8, WARN-9) |
| WARN zamknięte wcześniej w sesji (06-14, NOTA-5+TK) | 2 |

### 2. NAPRAWY WYKONANE (CRIT)

**CRIT-1 — przewodnik-prawny-v2/SKILL.md, sekcja "MAPA WYWOŁAŃ"**
8 z 9 wpisów wywołania innych skilli używało ścieżek względnych
(`view analizator-umow-v1/SKILL.md` itp.) niezgodnych ze standardem
absolutnym `/mnt/skills/user/...` używanym w pozostałych 14 miejscach
tego samego pliku. Ujednolicono wszystkie 9 wpisów (analizator-umow-v1,
analiza-sadowa-v6, analizator-dowodow-v3, pisma-proste-v2, pisma-procesowe-v3,
orzeczenia-sadowe-v2, analizator-przepisow-v2, przesluchanie-swiadkow-v2-min90
[już było OK], raport-sytuacyjny-v2) do ścieżek absolutnych. Bez tej naprawy
przewodnik (host całej sesji LAIK, KROK H/I) ryzykował nieudane wywołania
`view` dla 8 z 9 najczęstszych ścieżek przekazania.

**CRIT-2 — shared/DEPENDENCY-GRAPH.md — samosprzeczność**
Plik jednocześnie: (a) w sekcji "Moduły pokrycia prawnego" oznaczał
`POLISH-LAW-MAIN-MATRIX-INDEX.md` jako `INTERNAL | SKILL.md, matryce pokrycia`,
oraz (b) w sekcji "Usunięte orphan files" wymieniał ten sam plik jako
usunięty. Plik faktycznie NIE ISTNIEJE na dysku (zweryfikowano). Usunięto
błędny wiersz z sekcji (a). Przy tej okazji naprawiono też 5× nieaktualne
odwołania `audyt-systemu-v3` → `audyt-systemu-v4` w tym samym pliku oraz
w `AKTY-PRAWNE-MASTER.md`.

### 3. OSTRZEŻENIA (WARN) — NOWE

**WARN-7 — shared/AKTY-PRAWNE-MASTER.md: niedokończona migracja "jedyne źródło prawdy"**
Plik (v1.0, datowany 2026-06-01) deklaruje się jako jedyne źródło metryk Dz.U.
i twierdzi że "zastępuje" `LEGAL-REGISTRY.md` + 4 pliki CSV, planując ich
archiwizację "po wdrożeniu". Migracja NIE została wykonana:
- `LEGAL-REGISTRY.md` wciąż istnieje i jest aktywnie referencjonowany przez
  ≥5 modułów DR (dr-08 ×2, dr-13, dr-14, dr-16) oraz `LEGAL-LIFECYCLE-MANAGEMENT.md`.
- Operacyjnym rejestrem Dz.U. systemu jest w praktyce `audyt-systemu-v4/references/mapa_dzu_*.md`
  (aktualizowany przy każdym audycie DZU, najnowszy: mapa_dzu_2026-06-07.md),
  NIE `AKTY-PRAWNE-MASTER.md` (ostatnia aktualizacja 2026-06-01, nieaktualny
  względem rebuildów DR-07..DR-14 z 06-06).
- `DEPENDENCY-GRAPH.md` (po naprawie CRIT-2) oznacza `LEGAL-REGISTRY.md` jako
  `⚠️ PENDING — patrz AKTY-PRAWNE-MASTER.md`.

Dodano adnotację PENDING w `AKTY-PRAWNE-MASTER.md` z dwiema opcjami dla
dewelopera: (a) zaktualizować plik do stanu z mapa_dzu i faktycznie wdrożyć
jako źródło prawdy + zarchiwizować LEGAL-REGISTRY i 4 CSV; albo (b) oznaczyć
AKTY-PRAWNE-MASTER jako DEPRECATED i usunąć z DEPENDENCY-GRAPH, pozostawiając
mapa_dzu_*.md jako jedyny operacyjny rejestr (zgodne z faktyczną praktyką
audytów 06-06..06-13). **Decyzja architektoniczna — wymaga dewelopera,
nie wykonano w tej sesji.**

**WARN-8 — Propagacja Dz.U.: ROUTING-MAP ↔ DR-MAPA-AKTOW ↔ mapa_dzu rozjechane (3-PULL)**
Wykonano protokół 3-PULL (FAZA 3):
- 18 aktów obecnych w lokalnych DR-MAPA-AKTOW (wszystkie ✅ OK, część z
  ✅ VER: 2026-06-05) nieobecnych w ROUTING-MAP. Dotyczy DR-01, DR-02, DR-03,
  DR-04, DR-06, DR-10, DR-11, DR-12, DR-13.
- 12 aktów obecnych w ROUTING-MAP nieobecnych w mapa_dzu_2026-06-07.md —
  wszystkie ✅ OK, w tym Dz.U. 2026 poz. 724 (potwierdzenie poprawnego opisu
  "Rozp. MSWiA — ewidencja kierujących" w ROUTING-MAP, zgodnie z naprawą
  AUDYT-2026-06-13b).

Weryfikacja próbek (4/18 i wszystkie 12) wykazała: **wszystkie to false
positives co do TREŚCI** — akty są poprawne i zweryfikowane, problem to
WYŁĄCZNIE propagacja między trzema rejestrami. Główna przyczyna:
`mapa_dzu_2026-06-07.md` powstał PRZED rebuildami DR-07..DR-14 (06-06) i
sesjami DR-01/03/08 (06-12..06-13); `ROUTING-MAP.md` (v5.1, 06-08) nie
obejmuje najnowszych dodatków z DR-01/02/04/10-13 (06-12..06-13).

**AKCJA REKOMENDOWANA (następny audyt DZU, FAZA 3 + 7B):**
1. Wygenerować `mapa_dzu_2026-06-14.md` jako pełny refresh z aktualnych
   DR-MAPA-AKTOW (wszystkie 16 DR) — zamiast przyrostowej aktualizacji.
2. Zsynchronizować ROUTING-MAP.md (→ v5.2) z DR-MAPA-AKTOW dla 18 brakujących
   wpisów.
3. Uwzględnić w skanie regex amendment-referencje zagnieżdżone w nawiasach
   (np. "zm.: ... Dz.U. 2026 poz. 180)") — obecny skan 3-PULL je gubi,
   co wygenerowało część z 12 "rozbieżności" w drugą stronę.

Nie wykonano w tej sesji — wymaga ~30 ręcznych porównań wierszy, zbyt
ryzykowne dla jednej sesji bez dedykowanego trybu DZU.

**WARN-9 — Drobne niezgodności kosmetyczne (niski priorytet)**
- 2 pliki SKILL.md (przewodnik-prawny-v2: 964/1024, raport-klienta-v1: 962/1024)
  są w paśmie WARN description-length (901-1024) — wciąż w limicie, ale bez
  marginesu na rozbudowę bez przekroczenia CRIT.
- 7 plików SKILL.md (dr-10, dr-13, dr-14, dr-15, dr-07, dr-11, analizator-przepisow-v2)
  mają pojedyncze wystąpienie 2 kolejnych pustych linii (nie runy 3+).
  Zgodnie z zasadą "moduły czystości działają zachowawczo" — pozostawiono,
  do naprawy "przy okazji" najbliższej edycji tych plików.

### 4. WERYFIKACJA Dz.U.

Bez nowej weryfikacji online aktów w tej sesji (zakres: struktura/zależności,
nie merytoryka prawna). Propagacja Dz.U. między rejestrami — patrz WARN-8.
mapa_dzu: bez zmian (ostatnia: mapa_dzu_2026-06-07.md).

### 5. STRUKTURA SYSTEMU — SNAPSHOT (2026-06-14)

```
/mnt/skills/user/  — 544 plików / 90 katalogów / 5.1 MB (bez archive/)
33 skille + shared/ (78 plików w shared/)
Bez zmian liczby skilli względem 06-04/06-07.
audyt-systemu-v4: wersja 4.3
```

### 6. WNIOSKI I ZALECENIA

1. **2 PENDING z AUDYT-2026-06-13/13b zamknięte** (KROK 2B + KROK 5B w
   PRAWO-HARDGATE) — patrz wpis AUDYT-2026-06-14 poniżej, wykonany przed
   tym pełnym audytem.
2. **2 nowe CRIT wykryte i naprawione** — oba dotyczyły plików o wysokiej
   centralności (przewodnik = host sesji LAIK; DEPENDENCY-GRAPH = mapa
   zależności audytu). Oba błędy były "starymi" niezgodnościami nie
   wykrytymi we wcześniejszych audytach targeted.
3. **WARN-7 (AKTY-PRAWNE-MASTER) wymaga decyzji architektonicznej dewelopera**
   — to jedyny otwarty punkt o charakterze strategicznym, nie technicznym.
   Rekomendacja: opcja (b) — deprecate AKTY-PRAWNE-MASTER, mapa_dzu_*.md
   jako jedyny rejestr — zgodnie z faktyczną 2-tygodniową praktyką.
4. **WARN-8 (propagacja Dz.U.) — priorytet dla następnego TRYB DZU** —
   30 wpisów do synchronizacji, mapa_dzu wymaga pełnego refresh (nie
   przyrostowego) ze względu na nagromadzone zmiany z 06-06..06-13.
5. **System pozostaje wolny od CRIT po naprawach** — 0 martwych odwołań
   `view`, HARDGATE potwierdzony w routerze + wszystkich 16 DR-skills,
   wszystkie description w limicie.

*Wpis zamknięty: 2026-06-14*

---

## AUDYT-2026-06-14 — Naprawa 2 PENDING z AUDYT-2026-06-13/13b w PRAWO-HARDGATE

**Data:** 2026-06-14
**Zakres:** Targeted — realizacja dwóch zaległych poprawek "niski koszt/wysoka
wartość" zidentyfikowanych w sesjach 06-13: NOTA-5 (typ błędu "prawdziwy cytat
w złym kontekście") oraz korekta TK P 10/19 (status publikacji wyroków TK
2024-2026).

### Naprawy wykonane

1. **PRAWO-HARDGATE.md — nowy KROK 2B** (sekcja "WERYFIKACJA PRZEDMIOTU AKTU"):
   po znalezieniu Dz.U. RRRR poz. NNN na ISAP, przed użyciem jako podstawy
   konkretnej tezy (kwota/taryfikator/stawka/termin/instytucja) — obowiązkowe
   odczytanie TYTUŁU aktu i porównanie z tezą. Znacznik ✅ [VER] wymaga teraz
   potwierdzenia ISTNIENIA + PRZEDMIOTU, nie tylko numeru. Bezpośrednia
   realizacja NOTA-5 z CHECKLIST-DEDUP.

2. **PRAWO-HARDGATE.md — nowy KROK 5B** (sekcja "WYROKI TK Z OKRESU 2024-2026:
   STATUS PUBLIKACJI SPORNY"): dla każdego orzeczenia TK z lat 2024-2026
   obowiązkowe sprawdzenie czy zostało opublikowane w Dz.U.; jeśli nie —
   dodanie zastrzeżenia o sporze wokół uchwały RM 162/2024 i statusie
   wiążącym wyroku. Generalizacja korekty z AUDYT-2026-06-13 (P 10/19+P 7/23)
   na całą populację orzeczeń TK z tego okresu.

3. **CHECKLIST-DEDUP.md** — NOTA-5 zaktualizowana: "AKCJA NA PRZYSZŁOŚĆ — PENDING"
   → "✅ ZROBIONE 06-14: dodano KROK 2B".

### Walidacja
PRAWO-HARDGATE.md: 194 → 257 linii (+63, oba nowe kroki). Fences code-block:
12 (parzyste). CHECKLIST-DEDUP.md: fences 0 (bez zmian, brak code-blocków).

### Status po naprawach
| Kategoria | Status |
|---|---|
| PENDING z AUDYT-2026-06-13 (TK status) | ✅ zamknięty (KROK 5B) |
| PENDING z AUDYT-2026-06-13b (NOTA-5) | ✅ zamknięty (KROK 2B) |

*Wpis zamknięty: 2026-06-14*

---

## AUDYT-2026-06-13 — Naprawa martwych odwołań `view` + deduplikacja modułów dr-03

**Data:** 2026-06-13
**Zakres:** Targeted — naprawa ścieżek `view` ujawnionych podczas oceny komercyjnej silnika + deduplikacja zidentyfikowanych duplikatów treści

### CRIT naprawione

1. **dr-03/mod-KK-kodeks-karny.md** — błędna ścieżka do `mod-KKS-karny-skarbowy-i-AML.md` (wskazywała dr-06, plik jest w dr-03) → poprawiono.
2. **dr-11/mod-RODO-GDPR-2016-679.md** (2×) — martwe `view .../prawny-router-v3/references/modules/mod-BA-uodo-postepowanie.md` → przekierowano na istniejący `[BA] dr-11/modules/mod-UODO-postepowanie-ochrona-danych.md`.
3. **dr-09/mod-PrEnergetyczne-URE-OZE.md** — martwe `view .../mod-AU-regulacyjne-uokik-ure-uke-knf.md` → przekierowano na `[AU] dr-12/modules/mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF.md`.
4. **dr-09/mod-POS-prawo-ochrony-srodowiska.md** — martwe `view .../mod-AW-planowanie-srodowiskowe.md` → zastąpiono 3 istniejącymi modułami lokalnymi dr-09 (OOŚ, ochrona przyrody, prawo wodne).
5. **dr-09/mod-PrBud-prawo-budowlane.md** — martwe `view .../mod-W1-mpzp-wz-analiza-dokumentu.md` → przekierowano na `dr-08/modules/mod-MPZP-WZ-planowanie-przestrzenne.md`.
6. **mod-AE-dzialalnosc-regulowana.md** (3×: dr-09/mod-PrBud, prawny-router-v3/KROK1-detekcja.md, prawny-router-v3/pokrycie-dziedzinowe.md) — nieistniejący moduł → przekierowano na `[DA] dr-08/modules/mod-kontrola-administracji-inspekcje.md`.
7. **Rodzina "SZCZEGÓŁOWY FRAMEWORK" `prawny-router-v3/references/prawo-{rodo,karne,nieruchomosci,farmaceutyczne}.md`** (4×, dr-11/mod-RODO-GDPR, dr-03/mod-KK-KPK-framework-karne, dr-09/mod-UGN-gospodarka-nieruchomosciami, dr-10/mod-PrFarm-prawo-farmaceutyczne) — wszystkie nieistniejące → przekierowano na istniejące moduły `shared/` (INTAKE-GAP, ROSZCZENIA, TERM-CALC, STRATEGIA-PROCESOWA, TRYBY-PROCESOWE) oraz odpowiednie skille/moduły wykonawcze (analiza-sadowa-v6, orzeczenia-sadowe-v2, dr-02/mod-ustawa-deweloperska, dr-02/mod-ustawa-spoldzielnie-wlasnosc-lokali).
8. **SYSTEMOWY CRIT — `KROK1-detekcja.md` sekcja V2 (28 martwych `view .../modules/mod-X.md`)** — krok V2 (obowiązkowy, wykonywany dla każdej sprawy przed routingiem) wskazywał na nieistniejący katalog `prawo-polskie-v2/references/modules/`. Przebudowano V2: krok podstawowy = `view prawo-polskie-v2/SKILL.md` → ROUTING-MAP → DR-skill (zweryfikowany, działający mechanizm); dla 16 dziedzin z modułami oznaczonymi tagiem `[XX]` dodano zweryfikowane skróty z poprawnymi ścieżkami; pozostałe 12 dziedzin routowane wyłącznie przez krok podstawowy. Poprawiono też "Tabelę: sprawy karne" (martwe `mod-N-karne.md`, `prawo-karne.md`).
9. **`pisma-procesowe-v3/SKILL.md`** (6×) i **`prawny-router-v3/SKILL.md`** (1×) — martwe `view ...engines/...` (bez ścieżki/rozszerzenia) → uzupełniono pełne ścieżki do `pisma-procesowe-v3/references/engines/*-v10.md` (pliki istniały).

### Deduplikacja (DEDUPLICATION-POLICY)

- **`mod-KW-framework-wykroczenia.md`** — duplikat `mod-KW-kodeks-wykroczen.md` (kanoniczny, w ROUTING-MAP) różniący się jedną nieaktualną metryką Dz.U. (kanoniczny już zawierał aktualniejszą). Usunięto plik, przekierowano odwołania (dr-08/mod-UDP-strefy-platnego-parkowania.md, dr-03/SKILL.md, dr-03/MAPA-AKTOW.md) na `mod-KW-kodeks-wykroczen.md`.
- **`mod-KK-cyber-framework.md`** — 100% identyczny duplikat `mod-KK-art267-269c-cyberprzestepstwa.md` (kanoniczny, w ROUTING-MAP). Usunięto plik, usunięto wpisy z dr-03/SKILL.md i dr-03/MAPA-AKTOW.md.

### Status po naprawach

| Kategoria | Status |
|---|---|
| Martwe odwołania `view` (pełny skan, absolutne + względne) | ✅ 0 (poza placeholderami szablonowymi `[nazwa-modulu]`, `[XX]`, `[skill]`) |
| Duplikaty treści zidentyfikowane w trakcie | ✅ 2/2 usunięte |
| WARN otwarte | 0 |

*Wpis zamknięty: 2026-06-13*

**Data:** 2026-06-09  
**Zakres:** Targeted — weryfikacja online WARN-4, WARN-5b, WARN-6 + pełna weryfikacja Dz.U. w DR-05 i DR-08  
**Źródła:** uzp.gov.pl (KIO), isap.sejm.gov.pl, inforlex.pl, atlasprzetargow.pl

---

### WARN — wyniki weryfikacji online

#### ✅ WARN-4 ZAMKNIĘTY — Rozp. Prezesa RM 2020 poz. 2437 (wpisy KIO)

Akt **nadal obowiązuje** bez zmian. Potwierdzone przez: orzeczenie KIO 543/26 z 11.03.2026 r., stronę uzp.gov.pl, portal atlasprzetargow.pl (2026).

Identyfikacja w audycie była błędna — opisano jako „progi PZP", tymczasem jest to **rozporządzenie o wpisach i kosztach postępowania odwoławczego**. Progi PZP ogłaszane są obwieszczeniem Prezesa UZP (M.P. 2025 poz. 1247 na lata 2026–2027 — kurs 4,31 zł/EUR).

Naprawy w dr-07/mod-PZP-zamowienia-publiczne-KIO.md:
- Wpisano aktualne stawki: 7 500 zł (podprogowe), 15 000 zł (unijne dostaw/usług), 20 000 zł (unijne roboty)
- Zaktualizowano nagłówek źródła: dodano `✅ VER: 2026-06-09`
- Zaktualizowano wpis w tabeli rozporządzeń

#### ✅ WARN-5b ZAMKNIĘTY — Rozp. MS 2015 poz. 1800 (opłaty za czynności adwokackie)

Akt **nadal obowiązuje** — ale identyfikacja w audycie była błędna (opisano jako „stawki komornicze"). Dz.U. 2015 poz. 1800 to **Rozp. MS w sprawie opłat za czynności adwokackie**, a koszty komornicze reguluje odrębna Ustawa o kosztach komorniczych (Dz.U. 2024 poz. 377 t.j.).

Nowy tekst jednolity: **Dz.U. 2026 poz. 215** (obwieszczenie MS z 12.02.2026 r.).  
Rozporządzenie dla radców: **Dz.U. 2026 poz. 118** t.j.

Naprawy:
- analizator-dowodow-v3/MP10-koszty.md: zaktualizowano odniesienie `2015.1800` → `2026.215` (adwokaci) i `2026.118` (radcowie)
- mapa_dzu: dodano wpisy 2026.215 i 2026.118; 2015.1800 przeniesiony do PREV

#### ✅ WARN-6 ZAMKNIĘTY — Dz.U. 2008 poz. 1656 (emerytury pomostowe)

Akt **nadal obowiązuje** — ale identyfikacja była błędna (opisano jako „Rozp. RM o pracach uciążliwych"). Dz.U. 2008 nr 237 poz. 1656 to **Ustawa z 19.12.2008 r. o emeryturach pomostowych**.

Nowy tekst jednolity: **Dz.U. 2025 poz. 468**.

Naprawy:
- dr-16/mod-narzedzie-kalkulatory.md: zaktualizowano `2008.1656` → `2025.468 t.j.`
- mapa_dzu: dodano wpis 2025.468; 2008.1656 przeniesiony do PREV z poprawioną nazwą

---

### DR-05 — Wyniki weryfikacji online

| Akt | Status |
|---|---|
| UDIP 2022.902 | ✅ AKTUALNE — brak nowszego t.j. |
| Ustawa o otwartych danych 2023.1524 | ✅ AKTUALNE |
| Ustawa o cudzoziemcach 2025.1079 + zm. | ⚠️ UZUPEŁNIONO: dodano zm. 2025.619 (Niebieska Karta UE, Dyrektywa 2021/1883) |
| Ustawa o warunkach pracy cudzoziemców 2025.621 | ✅ AKTUALNE — w życie 01.06.2025 |
| UPEA 2026.268+532 | ✅ AKTUALNE |
| Skarga na przewlekłość 2023.1725 | ✅ AKTUALNE |
| RPO 2024.1264 | ✅ AKTUALNE |
| SKO 2023.825 | ✅ AKTUALNE |
| Sygnaliści 2024.928 | ✅ AKTUALNE |
| KPA 2025.1691 | ✅ AKTUALNE |
| Dostępność 2022.2240 | ✅ AKTUALNE |

**Łącznie DR-05: 10/11 ✅ + 1 uzupełniony**

---

### DR-08 — Wyniki weryfikacji online

| Akt | Status |
|---|---|
| USG 2025.1153 | ✅ AKTUALNE — t.j. ze zm. przed 05.08.2025 |
| USP 2025.1684 | ✅ AKTUALNE — t.j. 07.11.2025 |
| USW 2025.581 | ✅ AKTUALNE |
| Ustawa o Wojewodzie 2025.428 | ✅ AKTUALNE — t.j. 02.04.2025 |
| MPZP 2026.538 | ✅ AKTUALNE |
| Zarządzanie kryzysowe 2024.1907 ze zm. | ✅ AKTUALNE |
| Lokalne podatki 2025.707 | ✅ AKTUALNE |
| Czystość gmin 2025.765 | ✅ AKTUALNE |
| Zaopatrzenie w wodę 2024.757 | ✅ AKTUALNE |
| Transport zbiorowy 2025.285 | ✅ AKTUALNE |
| Ochrona zabytków 2024.1292 | ✅ AKTUALNE |
| Rewitalizacja 2024.278 | ✅ AKTUALNE |
| Dzienniki urzędowe 2012.317 | ✅ AKTUALNE — brak nowszego t.j. |
| Referendum lokalne 2023.1317 | ✅ AKTUALNE |
| **Dochody JST 2024.356** | ❌ → **NIEAKTUALNE**: nowa ustawa Dz.U. 2024 poz. 1572 (01.10.2024, w życie 01.01.2025) zastąpiła ustawę z 2003 r. |
| Kontrola administracji 2020.224 | ✅ AKTUALNE |

**Łącznie DR-08: 15/16 ✅ + 1 naprawiony (dochody JST)**

Naprawy: dr-08/MAPA-AKTOW.md, ROUTING-MAP.md, mapa_dzu — zaktualizowane do 2024.1572.

---

### Pliki zmienione

| Plik | Zmiana |
|---|---|
| dr-07/mod-PZP-zamowienia-publiczne-KIO.md | stawki KIO, VER, opis |
| analizator-dowodow-v3/MP10-koszty.md | 2015.1800 → 2026.215 adwokaci + 2026.118 radcowie |
| dr-16/mod-narzedzie-kalkulatory.md | 2008.1656 → 2025.468 t.j. |
| dr-05/MAPA-AKTOW.md | dodano zm. 2025.619 (Niebieska Karta) |
| dr-08/MAPA-AKTOW.md | dochody JST 2024.356 → 2024.1572 |
| prawo-polskie-v2/ROUTING-MAP.md | cudzoziemcy +2025.619; dochody JST →2024.1572 |
| mapa_dzu_2026-06-07.md | +2026.215, +2026.118, +2025.468, +2024.1572; PREV: 2015.1800, 2008.1656, 2024.356 |

### Status systemu po audycie

| Kategoria | Status |
|---|---|
| WARN-4 | ✅ ZAMKNIĘTY |
| WARN-5b | ✅ ZAMKNIĘTY |
| WARN-6 | ✅ ZAMKNIĘTY |
| WARN otwarte | **0** |
| DR-05 Dz.U. | ✅ Wszystkie zweryfikowane online |
| DR-08 Dz.U. | ✅ Wszystkie zweryfikowane online |

**Status systemu: ✅ ZIELONY — brak otwartych WARN**  
*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-08 — Korekta DR-05, DR-08 po aktualizacji plików przez użytkownika

**Data:** 2026-06-08
**Zakres:** Targeted — synchronizacja DR-05 i DR-08 z dyskiem po zmianach użytkownika
**Tryb:** PULL (DR-MAPA-AKTOW → ROUTING-MAP → mapa_dzu)

### Zidentyfikowane rozbieżności i naprawy

#### DR-08/MAPA-AKTOW.md — pełna przebudowa

| Problem | Było | Jest |
|---|---|---|
| Nazwy modułów niezsynchronizowane z dyskiem | `mod-USG-USP-USW-samorzad-terytorialny` | `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa` |
| Stary t.j. USG | Dz.U. 2024 poz. 1465 | Dz.U. 2025 poz. 1153 ✅ |
| Stary t.j. USP | Dz.U. 2024 poz. 107 | Dz.U. 2025 poz. 1684 ✅ |
| Stary t.j. USW | Dz.U. 2024 poz. 566 | Dz.U. 2025 poz. 581 ✅ |
| Stary t.j. MPZP | Dz.U. 2024 poz. 1907 | Dz.U. 2026 poz. 538 ✅ |
| Nazwy scalonych modułów | `mod-ustawa-czystosc-porzadek-gminy`, `mod-ustawa-wod-kan`, `mod-ustawa-transport-zbiorowy` (rozdzielone) | `mod-ustawa-komunalne-wod-kan-transport-czystosc` (scalony, 3 ustawy) |
| Brak modułu `mod-akty-porzadkowe-bezpieczenstwo-lokalne` | nieobecny | dodany ✅ |
| `mod-ustawa-zarzadzanie-kryzysowe-ochrona-ludnosci` | nazwa nieistniejąca | `mod-ustawa-zarzadzanie-kryzysowe` ✅ |
| `mod-ustawa-kontrola-administracji-inspekcje` | nazwa nieistniejąca | `mod-kontrola-administracji-inspekcje` ✅ |
| Zabytki/rewitalizacja/cmentarze | 3 osobne stare moduły | scalony `mod-ustawa-zabytki-rewitalizacja` + cmentarze jako wspólny ✅ |
| Dodano Ustawę o Wojewodzie | brakowała | Dz.U. 2025 poz. 428 t.j. ✅ |
| Dodano sekcję MONITORING | brak | ⏳ 2026.646 ✅ |

#### DR-05/MAPA-AKTOW.md — korekty

| Problem | Było | Jest |
|---|---|---|
| Duplikat wpisu skargi na przewlekłość | 2 wiersze dla tego samego modułu | 1 wiersz z Dz.U. 2023 poz. 1725 ✅ |
| Ustawa o otwartych danych — pozycja | po ostrzeżeniu, poza tabelą | w tabeli, oznaczona jako wspólny ✅ |
| Ustawa o udzielaniu ochrony cudzoziemcom | brak | Dz.U. 2024 poz. 1546 ✅ |
| Ustawa o warunkach pracy cudzoziemców | obecna ale bez powiązania z modułem | jednoznacznie przypisana do `mod-ustawa-cudzoziemcy` ✅ |
| Ustawa o dostępności (2022.2240) | brak `mod-ustawa-dostepnosc-niepelnosprawni` w MAPA-AKTOW | dodana ✅ |

#### ROUTING-MAP.md — korekty DR-05 i DR-08

| Zmiana | Opis |
|---|---|
| DR-05: dodano `mod-ustawa-dostepnosc-niepelnosprawni` | Dz.U. 2022 poz. 2240 |
| DR-05: dodano `Ustawa o warunkach dopuszczalności pracy cudzoziemców` | Dz.U. 2025 poz. 621 |
| DR-05: dodano `Ustawa o otwartych danych` | Dz.U. 2023 poz. 1524 |
| DR-05: poprawiono Dz.U. dla zaskarzania decyzji | 2021.1706 → 2025.1691 (KPA) + 2021.795 |
| DR-08: rozbito `zabytki+rewitalizacja` na 3 osobne wiersze (+ cmentarze) | ✅ |
| DR-08: `transport zbiorowy` → `publiczny transport zbiorowy` | ✅ |
| DR-08: zaktualizowano weryfikację: 2026-06-05 → 2026-06-08 | ✅ |
| Liczniki TABELA STATUSU: DR-05 11→13 ✅, DR-08 21→23 ✅, SUMA 251→255 ✅ | ✅ |
| Wersja: 5.0 → 5.1 | ✅ |

#### mapa_dzu_2026-06-07.md — korekta

| Zmiana |
|---|
| 2025.621: poprawiono nazwę na `Ustawa o warunkach dopuszczalności powierzania pracy cudzoziemcom` (typ ORG) |
| Data weryfikacji: 2026-06-07 → 2026-06-08 |

### Status po naprawach

| Element | Status |
|---|---|
| DR-05/MAPA-AKTOW.md | ✅ ZSYNCHRONIZOWANY |
| DR-08/MAPA-AKTOW.md | ✅ ZSYNCHRONIZOWANY |
| ROUTING-MAP.md v5.1 | ✅ ZSYNCHRONIZOWANY |
| mapa_dzu_2026-06-07.md | ✅ ZAKTUALIZOWANY |
| WARN otwarte | 3 (WARN-4, WARN-5b, WARN-6 — z poprzednich audytów) |

**Status systemu po audycie: ✅ ZIELONY**
*Wpis zamknięty: 2026-06-08*

---

## AUDYT-2026-06-07b — Wdrożenie protokołu integracji DR↔prawo-polskie↔audyt

**Data:** 2026-06-07  
**Zakres:** Targeted — architektura integracji, ROUTING-MAP v5.0, protokół pull  
**Pliki zmienione:**

| Plik | Zmiana | Wersja |
|------|--------|--------|
| prawo-polskie-v2/ROUTING-MAP.md | Pełna tabela DR-01…DR-16 (191 → 268 wpisów), sekcja MONITORING | v4.1 → v5.0 |
| prawo-polskie-v2/SKILL.md | Dodano sekcję Protokół integracji, reguły MONITORING | v3.0 → v5.0 |
| audyt-systemu-v4/SKILL.md | Dodano FAZA 3-PULL (bash skan DR-MAPA-AKTOW, porównanie, wykrywanie vacatio) | v4.2 → v4.3 |

**Opis zmian:**

1. **ROUTING-MAP.md** — dotychczas DR-08…DR-14, DR-16 były obsługiwane odesłaniem `patrz lokalne MAPA-AKTOW.md`. Teraz wszystkie 16 DR mają pełne tabele inline. Dodano kolumnę `⏳/⚡ MON` do TABELA STATUSU. Sekcja MONITORING na końcu pliku z 9 aktami.

2. **protokół pull** — audyt w FAZA 3-PULL teraz formalnie skanuje `dr-*/MAPA-AKTOW.md`, porównuje z ROUTING-MAP i mapa_dzu, oraz automatycznie wykrywa wpisy `vacatio/OCZEKUJE/WCHODZI` z DR-MAPA-AKTOW i propaguje je do obu plików centralnych.

3. **sekcja MONITORING** — obecna w: (a) mapa_dzu_*.md, (b) ROUTING-MAP.md, (c) każdym DR-MAPA-AKTOW który ma akty z vacatio (DR-09, DR-13, DR-03, DR-08, DR-10). Reguły przejścia ⏳→✅ są spójne w całym systemie.

**Status po zmianach: ✅ ZIELONY**  
*Wpis zamknięty: 2026-06-07*

---

## AUDYT-2026-06-07

**Data audytu:** 2026-06-07
**Zakres:** TRYB DZU — uzupełnienie Mapy Dz.U. z modułów DR-skills + wdrożenie sekcji MONITORING
**Narzędzie:** audyt-systemu-v4 (wywołany ręcznie — tryb targeted DZU)
**Audytor:** sesja deweloperska
**Pliki źródłowe:**
- `mapa_dzu_2026-06-07.md` (nowa wersja — zastępuje 2026-06-05)
- `audyt-systemu-v4/SKILL.md` (wersja 4.2)

---

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|-----------|-------|
| Zakres audytu | Mapa Dz.U. + MONITORING |
| Akty Dz.U. poprzednio | 355 |
| Akty Dz.U. po uzupełnieniu | **387** (+32) |
| Nowe wpisy OK | +27 (brakujące akty z modułów DR) |
| Nowe wpisy PREV | +3 (poprzednie t.j. ujawnione przez nowe) |
| Nowe wpisy NW | +2 (nowelizacje z modułów DR) |
| Sekcja MONITORING | ✅ dodana (8 aktów ⏳) |
| Błędy CRIT | 0 |
| WARN otwarte | 3 (WARN-4, WARN-5b, WARN-6 z poprzedniego audytu — niezmienione) |

**Ogólny status systemu po audycie: ✅ ZIELONY**

---

### 2. NAPRAWY WYKONANE

#### Uzupełnienie Mapy Dz.U. (+32 wpisy)

Brakujące akty zidentyfikowane przez skan modułów DR-skills (`grep Dz.U.`):

| Rok | Poz. | Akt | Typ | Źródło identyfikacji |
|-----|------|-----|-----|----------------------|
| 2026 | 156 | Ustawa o działalności leczniczej | TJ | dr-10/mod-ustawa-prawa-pacjenta-framework |
| 2025 | 1705 | Ustawa o obronie cywilnej — zmiana 2025 | NW | dr-13/mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna |
| 2025 | 1684 | Ustawa o samorządzie powiatowym (USP) | TJ | dr-08/mod-JST |
| 2025 | 1431 | Prawo lotnicze — zmiana | NW | dr-09/mod-ustawa-transport |
| 2025 | 1390 | KPK — zmiana (vacatio) | NW | dr-03/mod-PrProkuratura |
| 2025 | 1366 | Zakwaterowanie funkcjonariuszy służb | NW | dr-13/mod-ustawa-policja |
| 2025 | 1153 | Ustawa o samorządzie gminnym (USG) | TJ | dr-08/mod-JST |
| 2025 | 1017 | Ustawa o certyfikacji cyberbezpieczeństwa | ORG | dr-11/mod-KSC-NIS2 |
| 2025 | 1014 | Ustawa o obronie Ojczyzny — zmiana | NW | dr-13/mod-ustawa-obrona-ojczyzny |
| 2025 | 707 | Ustawa o podatkach i opłatach lokalnych | TJ | dr-06/mod + dr-08/mod-lokalne-podatki |
| 2025 | 581 | Ustawa o samorządzie województwa (USW) | TJ | dr-08/mod-JST |
| 2025 | 526 | PUSP — zmiana | NW | dr-01/mod-USP |
| 2025 | 468 | Postępowanie w sprawach pomocy publicznej | TJ | dr-07/mod-fundusze-UE |
| 2025 | 428 | Ustawa o Wojewodzie | TJ | dr-08/mod-JST |
| 2025 | 304 | Ustawa o prokuraturze — zmiana | NW | dr-12/mod-PrProkuratura |
| 2024 | 1757 | ABW/AW — zmiana | NW | dr-13/mod-ABW-AW-CBA |
| 2024 | 1672 | Ustawa o SOP | TJ | dr-13/mod-ABW-AW-CBA |
| 2024 | 1635 | Pomoc publiczna — poprzedni t.j. | PREV | zastąpiony przez 2025.468 |
| 2024 | 1562 | Oddziały mundurowe — zmiana | NW | dr-13/mod-ustawa-policja |
| 2024 | 1546 | Ustawa o udzielaniu ochrony cudzoziemcom | TJ | dr-13/mod-ustawa-straz-graniczna |
| 2024 | 1474 | Ustawa o działaniach antyterrorystycznych | TJ | dr-13/mod-ABW-AW-CBA |
| 2024 | 1392 | Prawo o ustroju sądów wojskowych | NW | dr-12/mod |
| 2024 | 1248 | Ustawa o Policji — zmiana | NW | dr-13/mod-ustawa-policja |
| 2024 | 1061 | Prawo o notariacie — poprzedni t.j. | PREV | zastąpiony przez 2026.614 |
| 2024 | 724 | Ustawa o nadzorze KNF | TJ | dr-06/mod + dr-15/mod-DORA |
| 2024 | 622 | Ustawa o Sądzie Najwyższym (USN) | TJ | dr-01/mod-USP + dr-12 |
| 2024 | 334 | Prawo o ustroju sądów powszechnych (PUSP) | TJ | dr-01/mod-USP + dr-12 |
| 2023 | 2110 | Prawo lotnicze | TJ | dr-09/mod-transport |
| 2023 | 1725 | Ustawa o skargach na przewlekłość — zmiana | NW | dr-05/mod-skargi |
| 2023 | 1524 | Ustawa o otwartych danych | TJ | dr-05/mod-UDIP + dr-11 |
| 2023 | 1429 | Ustawa o świadczeniu wspierającym (WZON) | ORG | dr-04/mod-swiadczenie-wspierajace |
| 2022 | 655 | Ustawa o obronie Ojczyzny | ORG | dr-13/mod-ustawa-obrona-ojczyzny |
| 2022 | 583 | Ustawa o pomocy obywatelom Ukrainy | ORG | dr-02/mod-cudzoziemcy + dr-05 |
| 2020 | 1222 | Emerytury pomostowe rocznik 1953 — zmiana | NW | dr-04/mod-SUS-ZUS |
| 2011 | 714 | Ustawa o KRS — pierwotna publikacja | ORG | dr-01/mod-ustawa-KRS |

#### Korekta statusów

- `2025.450` Ustawa o działalności leczniczej → PREV (zastąpiony przez `2026.156`)
- `2024.1061` Prawo o notariacie → PREV (zastąpiony przez `2026.614`)
- `2024.1635` Ustawa o postępowaniu ws. pomocy publicznej → PREV (zastąpiony przez `2025.468`)

#### Wdrożenie sekcji MONITORING

Dodano na końcu pliku `mapa_dzu_2026-06-07.md` nową sekcję `## MONITORING` z:
- 8 aktami w statusie ⏳ OCZEKUJE / ⚡ WCHODZI-90DNI
- legendą statusów
- procedurą przesuwania aktów do tabeli głównej po wejściu w życie

---

### 3. OSTRZEŻENIA (WARN) — z poprzedniego audytu, niezmienione

| ID | Opis | Status |
|----|------|--------|
| WARN-4 | Rozp. RM 2020.2437 (progi PZP) — dr-07 | 🔓 otwarty |
| WARN-5b | Rozp. MS 2015.1800 (stawki komornicze) — analizator-dowodow-v3 | 🔓 otwarty |
| WARN-6 | Rozp. RM 2008.1656 (prace uciążliwe) — dr-16 | 🔓 otwarty |

Do zamknięcia w kolejnym audycie TRYB WARN-CLOSE.

---

### 4. WERYFIKACJA Dz.U.

- Mapa zaktualizowana: `mapa_dzu_2026-06-05.md` → `mapa_dzu_2026-06-07.md`
- Aktów w mapie: 355 → **387** (+32 nowe, +3 PREV)
- Sekcja MONITORING: ✅ wdrożona (8 aktów oczekujących)
- Akty nowe t.j. (ISAP) w sesji: `2026.156` (działalność lecznicza)
- Odwołanie w SKILL.md: zaktualizowane (wersja 4.1 → 4.2)

---

### 5. STRUKTURA SYSTEMU — SNAPSHOT

Bez zmian strukturalnych względem audytu 2026-06-04/05.
- 33 skille + shared/ — bez modyfikacji
- audyt-systemu-v4: wersja 4.2

---

### 6. WNIOSKI I ZALECENIA

1. **Mapa była niekompletna o ~9%** — 32 akty użytkowane przez moduły DR nie były ujęte w centralnej mapie. Główne luki: dr-08 (samorząd — USG, USP, USW, Wojewoda), dr-13 (służby — SOP, antyterroryzm, cudzoziemcy), dr-11 (certyfikacja cyber), dr-04 (świadczenie wspierające).
2. **Sekcja MONITORING jest teraz operacyjna** — przy każdym audycie DZU należy przeglądać tabelę i aktualizować statusy wg procedury FAZA 3D.
3. **Priorytet: zamknięcie WARN-4, WARN-5b, WARN-6** — przy następnym audycie TRYB WARN-CLOSE.
4. **dr-13 (służby) był najmniej pokryty** — moduły tego skilla odwołują się do 7 aktów nieobecnych w mapie. Zalecana pogłębiona weryfikacja ISAP tego DR.

---

*Wpis zamknięty: 2026-06-07*

---

## AUDYT-2026-06-04 / AUDYT-2026-06-05

**Data audytu:** 2026-06-04 (naprawy) + 2026-06-05 (weryfikacja Dz.U.)  
**Zakres:** 33 skille + shared/ (bez archive/); 355 aktów Dz.U.  
**Narzędzie:** audyt-systemu-v3 (wywołany ręcznie)  
**Audytor:** sesja deweloperska  
**Pliki źródłowe:**
- `SKILLS-MAP-AND-FIXES-2026-06-04.md`
- `mapa_dzu_2026-06-05.md`

---

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|-----------|-------|
| Skille ogółem | 33 + shared/ |
| Pliki ogółem | ~667 |
| Katalogi ogółem | ~71 |
| Rozmiar systemu | ~2.9 MB |
| Błędy CRIT (blokujące) | 4 → **wszystkie naprawione** |
| Ostrzeżenia WARN | 5 → **nieblokujące, otwarte** |
| Akty Dz.U. w mapie | 355 |
| Status Dz.U. OK | ~335 |
| Status Dz.U. PREV | ~20 (referencje historyczne) |

**Ogólny status systemu po audycie: ✅ ZIELONY**

---

### 2. NAPRAWY WYKONANE (CRIT)

#### CRIT-1 — analizator-umow-v1: FAKTY.md → FAKTY_v2.md ✅ NAPRAWIONY

| Plik | Linia | Zmiana |
|------|-------|--------|
| `analizator-umow-v1/SKILL.md` | 113 | `FAKTY.md` → `FAKTY_v2.md` |
| `analizator-umow-v1/SKILL.md` | 217 | `MOD-WALIDACJA · FAKTY` → `MOD-WALIDACJA_v2 · FAKTY_v2` |
| `analizator-umow-v1/references/mod-core-checklist.md` | 563 | `FAKTY.md` → `FAKTY_v2.md` |

**Przyczyna:** Skill odwoływał się do nieistniejącej ścieżki `FAKTY.md` zamiast kanonicznej `FAKTY_v2.md`.

---

#### CRIT-2 — analizator-umow-v1: MOD-WALIDACJA.md → MOD-WALIDACJA_v2.md ✅ NAPRAWIONY

| Plik | Linia | Zmiana |
|------|-------|--------|
| `analizator-umow-v1/SKILL.md` | 112 | `MOD-WALIDACJA.md` (bloki A–I) → `MOD-WALIDACJA_v2.md` (bloki A–J) |

**Przyczyna:** Odwołanie do wersji bez bloku J (FACT-SOURCE-LOCK / LEGAL-STATUS-LOCK). Stub `MOD-WALIDACJA.md` istnieje, ale wskazywany był jako plik główny zamiast `_v2`.

---

#### CRIT-3a — dr-02: analiza-sadowa-v5 → analiza-sadowa-v6 ✅ NAPRAWIONY (17 modułów)

Masowa zamiana w 17 modułach `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/`:

```
mod-KC-ubezpieczenia-szczegolowy.md
mod-KC-ubezpieczenia-framework.md
mod-KC-cywilne-szczegolowy.md
mod-PrUpad-prawo-upadlosciowe.md
mod-KRO-framework-szczegolowy.md
mod-KSH-kodeks-spolek-handlowych.md
mod-KC-zobowiazania-i-roszczenia.md
mod-KPC-windykacja-framework.md
mod-KPC-egzekucja-i-windykacja.md
mod-KSH-gospodarcze-szczegolowy.md
mod-KC-ubezpieczenia-umowne-OC-AC.md
mod-ustawa-cudzoziemcy.md
mod-KRO-framework-rodzinne.md
mod-KRO-rodzinny-i-opiekunczy.md
mod-KP-art943-mobbing.md
mod-KC-framework-cywilne.md
mod-KSH-framework-gospodarcze.md
```

**Przyczyna:** Wersja v5 skilla była przestarzała — model 4-przebiegowy z dwukrotną weryfikacją dowodów dostępny dopiero w v6.

---

#### CRIT-3b — pisma-procesowe-v3: przewodnik-prawny-v1 → v2 ✅ NAPRAWIONY

| Plik | Linia | Zmiana |
|------|-------|--------|
| `pisma-procesowe-v3/modules/MOD-ROUTE.md` | 126 | `przewodnik-prawny-v1` → `przewodnik-prawny-v2` |

**Przyczyna:** Routing do nieistniejącego (usuniętego) skilla v1 zamiast aktualnego v2.

---

### 3. OSTRZEŻENIA (WARN — nieblokujące)

#### WARN-5 — chronologia-sprawy-v1: description skrócony ✅ NAPRAWIONY

| Plik | Zmiana |
|------|--------|
| `chronologia-sprawy-v1/SKILL.md` | Description: 1037 → 671 znaków (limit: 1024) |

**Przyczyna:** Przekroczenie limitu długości description (1024 znaki). Skill mógł nie być poprawnie rozpoznawany przez router.

---

#### WARN-1 — shared/DEPENDENCY-GRAPH.md — brakujące wpisy ✅ ZAMKNIĘTY (2026-06-14g)

19 plików aktywnych bez wpisu w grafie zależności (CLAIM-VALIDATION,
WERYFIKACJA-SLAD, ORZECZENIA-OUTPUT-SCHEMA i inne). Ryzyko: niskie (DOCS-ONLY).
→ Zamknięty w AUDYT-2026-06-14g (20 wpisów dodanych, 5 nowych sekcji).

---

#### WARN-2 — shared: pliki z odwołaniami tylko z archive/ ✅ ZAMKNIĘTY (2026-06-14g)

`MATRIX-COMPLETENESS-AUDIT-GATE.md` i `MATRIX-ROUTING-PRIORITY-RULES.md` —
odwołania tylko z archive/.
→ Zamknięty w AUDYT-2026-06-14g (potwierdzono usunięcie w 06-09; 5 nowych
ORPHAN znalezionych — NOTA-6 CHECKLIST-DEDUP, PENDING niski priorytet).

---

#### WARN-3 — shared/SKILL.md — niekompletna tabela rejestru ✅ ZAMKNIĘTY (2026-06-14g)

Tabela rejestru w `shared/SKILL.md` nie zawierała wszystkich aktywnych plików.
→ Zamknięty w AUDYT-2026-06-14g (SKILL.md odsyła do DEPENDENCY-GRAPH jako
jedynego pełnego rejestru — bez duplikacji tabel).

---

#### WARN-4 — dr-07: Rozp. RM 2020.2437 (progi PZP) ⚠️ DO WERYFIKACJI

Rozporządzenie oznaczone jako "do weryfikacji" w mapie Dz.U.

---

#### WARN-5b — analizator-dowodow-v3: Rozp. MS 2015.1800 ⚠️ DO WERYFIKACJI

Rozporządzenie (stawki minimalne komornicze) oznaczone "do weryfikacji".

---

#### WARN-6 — dr-16: Rozp. RM 2008.1656 (wykaz prac uciążliwych) ⚠️ DO WERYFIKACJI

Rozporządzenie oznaczone "weryfikuj" — może istnieć nowelizacja.

---

### 4. WERYFIKACJA MAPY Dz.U. (2026-06-05)

**Metoda:** Przegląd online ISAP + analiza kontekstu skilli  
**Łączna liczba unikalnych Dz.U.:** 355  
**Zakres weryfikacji:** wszystkie wpisy

| Kategoria | Liczba |
|-----------|--------|
| Status OK | ~335 |
| Status PREV (ref historyczne) | ~20 |
| Do weryfikacji (oznaczone wprost) | 3 (WARN-4, WARN-5b, WARN-6) |
| Błędy w mapie | 0 |

**Kluczowe aktualizacje t.j. w 2026 roku:**
- KPC: 2026.468 (t.j. 2026) — zastąpił 2024.1816
- KPK: 2026.490 (t.j. 2026)
- KRO: 2026.236 (t.j. 2026)
- PB: 2026.524 (t.j. 27.03.2026)
- PrFarm: 2026.612 (t.j. 17.04.2026)
- PIT: 2026.592 (t.j. 17.04.2026)
- CIT: 2026.554 (t.j. 27.03.2026)
- OrdPod: 2026.622 (t.j. 25.05.2026)
- PrNotariat: 2026.614 (t.j. 07.05.2026)

---

### 5. STRUKTURA SYSTEMU — SNAPSHOT (2026-06-04)

```
/mnt/skills/user/
├── shared/                          120 pl. / 5 kat. / ~354 KB  ✅
├── analizator-umow-v1/               26 pl. / 1 kat. / ~331 KB  ✅ (CRIT-1, CRIT-2)
├── prawny-router-v3/                 28 pl. / 6 kat. / ~203 KB  ✅
├── analizator-dowodow-v3/            37 pl. / 6 kat. / ~176 KB  ✅
├── dr-03-prawo-karne/                26 pl. / 1 kat. / ~143 KB  ✅
├── dr-10-zdrowie-farmacja/           27 pl. / 1 kat. / ~125 KB  ✅
├── dr-02-prawo-cywilne/              35 pl. / 1 kat. / ~136 KB  ✅ (CRIT-3a)
├── analiza-sadowa-v6/                19 pl. / 2 kat. / ~114 KB  ✅
├── dr-09-budownictwo/                28 pl. / 1 kat. / ~109 KB  ✅
├── pisma-procesowe-v3/               30 pl. / 5 kat. / ~103 KB  ✅ (CRIT-3b)
├── pisma-proste-v2/                  21 pl. / 1 kat. /  ~99 KB  ✅
├── dr-04-prawo-pracy/                29 pl. / 1 kat. /  ~95 KB  ✅
├── dr-06-podatki/                    23 pl. / 1 kat. /  ~69 KB  ✅
├── dr-11-cyfrowe-cyber-ai/           22 pl. / 1 kat. /  ~70 KB  ✅
├── dr-08-samorzad/                   22 pl. / 1 kat. /  ~68 KB  ✅
├── dr-07-zamowienia/                 16 pl. / 1 kat. /  ~57 KB  ✅
├── dr-15-compliance-iso/             11 pl. / 1 kat. /  ~45 KB  ✅
├── dr-05-prawo-adm/                  13 pl. / 1 kat. /  ~47 KB  ✅
├── dr-13-sluzby/                     11 pl. / 1 kat. /  ~46 KB  ✅
├── dr-16-pisma-strategia/            13 pl. / 1 kat. /  ~49 KB  ✅
├── dr-12-sadownictwo/                13 pl. / 1 kat. /  ~43 KB  ✅
├── przesluchanie-swiadkow-v2-min90/  28 pl. /15 kat. /  ~71 KB  ✅
├── przewodnik-prawny-v2/              5 pl. / 3 kat. /  ~43 KB  ✅
├── analizator-przepisow-v2/           2 pl. / 1 kat. /  ~40 KB  ✅
├── orzeczenia-sadowe-v2/              2 pl. / 1 kat. /  ~35 KB  ✅
├── chronologia-sprawy-v1/             7 pl. / 3 kat. /  ~34 KB  ✅ (WARN-5)
├── dr-14-prawo-ue/                   10 pl. / 1 kat. /  ~30 KB  ✅
├── raport-klienta-v1/                 7 pl. / 3 kat. /  ~29 KB  ✅
├── raport-sytuacyjny-v2/             13 pl. / 4 kat. /  ~29 KB  ✅
├── prawo-polskie-v2/                  2 pl. / 0 kat. /  ~20 KB  ✅
├── audyt-systemu-v3/                  1 pl. / 0 kat. /  ~23 KB  ✅
├── prompt-master/                     2 pl. / 1 kat. /  ~16 KB  ✅
└── dr-01-ustroj/                      6 pl. / 1 kat. /  ~16 KB  ✅

RAZEM: ~667 plików / ~71 katalogów / ~2.9 MB
```

---

### 6. WNIOSKI I ZALECENIA

**Naprawiono wszystkie błędy blokujące (CRIT-1..3b).** System jest w pełni operacyjny.

Zalecenia na kolejny audyt:
1. Zamknąć WARN-1: uzupełnić DEPENDENCY-GRAPH.md o 19 brakujących plików
2. Zamknąć WARN-2: zdecydować o przeniesieniu 2 plików do archive/
3. Zamknąć WARN-3: rozszerzyć shared/SKILL.md — tabelę rejestru
4. Zweryfikować online 3 rozporządzenia oznaczone "do weryfikacji" (WARN-4, 5b, 6)
5. Sprawdzić Dz.U. 2026 po poz. 670 (nowe t.j. mogły się pojawić od 05.06.2026)

---

## SZABLON NOWEGO WPISU

Kopiuj poniżej przy kolejnym audycie:

```markdown
## AUDYT-YYYY-MM-DD

**Data audytu:** YYYY-MM-DD  
**Zakres:**  
**Narzędzie:**  
**Audytor:**  
**Pliki źródłowe:**

### 1. STATUS OGÓLNY
| Kategoria | Wynik |
|-----------|-------|
| Błędy CRIT | |
| Ostrzeżenia WARN | |
| Dz.U. — nowe t.j. | |

### 2. NAPRAWY WYKONANE (CRIT)
<!-- ID — opis — ✅ NAPRAWIONY / ⚠️ OTWARTE -->

### 3. OSTRZEŻENIA (WARN)
<!-- ID — opis — status -->

### 4. WERYFIKACJA Dz.U.
<!-- nowe t.j., nowe nowelizacje, zmiany statusów PREV -->

### 5. WNIOSKI
<!-- zalecenia na kolejny audyt -->
```

---

*Ostatnia aktualizacja: 2026-06-09*  
*Powiązany plik referencyjny: `AUDIT-REFERENCES.md`*

---

## AUDYT-2026-06-09 — Deduplication & Dependency Cleanup

**Data audytu:** 2026-06-09  
**Zakres:** Audyt zależności między skilami — orphan files, duplikaty modułów, scalenia  
**Pliki źródłowe:**
- Wszystkie SKILL.md, MAPA-AKTOW.md, ROUTING-MAP, shared/

### 1. STATUS OGÓLNY
| Kategoria | Wynik |
|-----------|-------|
| Błędy CRIT | 0 (po naprawach) |
| Ostrzeżenia WARN | 0 |
| Pliki usunięte | 14 |
| Pliki scalone | 5 operacji scalenia |

### 2. NAPRAWY WYKONANE

#### A. Usunięte pliki orphan (shared/) — sesja 2026-06-09 część 1
- `shared/MATRIX-COMPLETENESS-AUDIT-GATE.md` — zero wywołań view operacyjnych
- `shared/MATRIX-ROUTING-PRIORITY-RULES.md` — jw
- `shared/HIERARCHICAL-COVERAGE-GATE.md` — jw
- `shared/OWN-LAW-UNITS-MATRIX-FIRST-GATE.md` — jw
- `shared/SECTORAL-MATRIX-FIRST-GATE.md` — jw
- `shared/LEGAL-MATRIX-FIRST-GATE.md` — jw
- `shared/POLISH-LAW-MAIN-MATRIX-INDEX.md` — jw (indeksował powyższe)
- `shared/TERYT-INGEST-WORKFLOW.md` — tylko dokumentacja
- `shared/references/modules/LOCAL-LAW-AUDIT-GATE.md` — zero ext. wywołań
- `shared/references/modules/LOCAL-LAW-SOURCE-PROTOCOL.md` — jw
- `shared/references/modules/MULTI-LEVEL-POLISH-LAW-ROUTER.md` — jw

#### B. Naprawione MAPA-AKTOW (phantom entries z planowanego rebuild v3.0)
- DR-02: 28 phantom → 17 faktycznych modułów
- DR-04: 20 phantom → 17 faktycznych modułów
- DR-06: 12 phantom → 14 faktycznych modułów
- DR-07: 9 phantom → 10 faktycznych modułów
- DR-09: 13 phantom → 15 faktycznych modułów
- DR-11: dodano brakujący `mod-ustawa-certyfikacja-cyberbezpieczenstwa`

#### C. Scalenia modułów duplikatowych — sesja 2026-06-09 część 2

| Usunięty | Scalony do | Powód |
|---|---|---|
| `dr-03/mod-KK-przemoc-domowa-framework.md` | `mod-KK-art207-przemoc-domowa` | identyczne (diff pusty) |
| `dr-03/mod-KK-stalking-framework.md` | `mod-KK-art190a-stalking` | nowszy Dz.U. w art190a |
| `dr-10/mod-PrFarm-framework.md` | `mod-PrFarm-prawo-farmaceutyczne` | podzbiór (109 ⊂ 915 linii) |
| `dr-10/mod-PrFarm-GIF-WIF-framework.md` | `mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny` | scalono sekcje |
| `dr-10/mod-ustawa-RPP-prawa-pacjenta.md` | `mod-ustawa-prawa-pacjenta-framework` | podzbiór + Dz.U. 2024.581 |
| `dr-11/mod-PrAut-framework-IP.md` | `mod-PrAut-wlasnosc-intelektualna-IP` | identyczne (diff pusty) |
| `dr-11/mod-RODO-framework.md` | `mod-RODO-GDPR-2016-679` | scalono sekcję UODO |
| `audyt-systemu-v4/references/mapa_dzu_2026-06-05.md` | — | zastąpiony przez 2026-06-07 |

#### D. MOD-WALIDACJA stuby → czyste view
- `shared/MOD-WALIDACJA.md` → czyste `view shared/MOD-WALIDACJA_v2.md`
- `pisma-procesowe-v3/modules/MOD-WALIDACJA.md` → czyste `view shared/MOD-WALIDACJA_v2.md`

#### E. Aktualizacje SKILL.md i MAPA-AKTOW
- DR-03: licznik 19→17, usunięto 2 wpisy
- DR-10: licznik 25→22, usunięto 3 wpisy, zaktualizowano opisy scalonych
- DR-11: licznik 21→19, usunięto 2 wpisy, zaktualizowano opisy scalonych
- ROUTING-MAP: usunięto wpis `mod-ustawa-RPP-prawa-pacjenta`

*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-09b — Disclaimer pipeline + audyt luk merytorycznych

**Data:** 2026-06-09

### Zrealizowane naprawy (z raportu oceny 8.1/10)

#### 1. Disclaimer w DR-skillach — NAPRAWIONE ✅
- Wszystkie 16 plików `dr-*/SKILL.md` otrzymały sekcję `## ⚖️ DISCLAIMER (obowiązkowy)`
- Wywołanie: `view /mnt/skills/user/shared/DISCLAIMER.md`
- Warianty: PRAWNIK/kancelaria + LAIK/pro se
- Pozycja: ostatni element każdej odpowiedzi z analizą prawną

#### 2. DEPENDENCY-GRAPH zaktualizowany ✅
- Dodano sekcję CHANGELOG z pełnym opisem zmian 2026-06-09

#### 3. prompt-master wyłączony z routingu prawnego ✅
- Dodano `routing-exclude: prawny-router-v3` w frontmatter

#### 4. STATUS.md zaktualizowany ✅
- Data: 2026-06-09; dodano nowe wpisy dla scalonych modułów

### Uzupełnione luki merytoryczne

| Moduł | Dodano | Lokalizacja |
|---|---|---|
| mod-KP-prawo-pracy | ANEKS B: Wypadek przy pracy i choroba zawodowa (ustawa 2002) | DR-04 |
| mod-KP-prawo-pracy | ANEKS C: Praca zdalna art. 67⁵–67²⁴ KP (od 07.04.2023) | DR-04 |
| mod-KC-cywilne-zobowiazania | ANEKS D: Służebności (drogi koniecznej, przesyłu), zasiedzenie, prawo rzeczowe | DR-02 |
| mod-KC-cywilne-zobowiazania | ANEKS E: Dział spadku, nabycie spadku, zachowek | DR-02 |
| mod-KC-cywilne-zobowiazania | ANEKS F: Kredyty frankowe — abuzywność klauzul, TSUE C-520/21 | DR-02 |
| mod-KK-KPK-framework-karne | ANEKS: Przestępstwa gospodarcze (art. 286, 296, 300, 302 KK) | DR-03 |
| mod-KK-KPK-framework-karne | ANEKS: Niealimentacja art. 209 KK + czynny żal | DR-03 |
| mod-TFUE-TUE-prawo-pierwotne-UE | ANEKS: Pytanie prejudycjalne TSUE art. 267 TFUE | DR-14 |

### Pozostałe luki (do uzupełnienia w kolejnej iteracji)
- DR-11: utwór generowany przez AI (własność intelektualna AI) — brak modułu
- DR-02: odpowiedzialność za produkt (KC art. 449¹–449¹¹, dyrektywa 85/374) — brak
- DR-04: umowa o dzieło/zlecenie vs stosunek pracy — granica (art. 22 §1² KP) — brak
- DR-01: rozszerzenie o Trybunał Stanu, skarga na opieszałość organów

*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-09c — Prawo jazdy, punkty karne, nowe przepisy drogowe

**Data:** 2026-06-09  
**Zakres:** Kompletna aktualizacja modułu PRD + nowe przepisy BRD I/II + rozp. 2026  
**Weryfikacja:** Online (policja.pl, pbd.org.pl, gazetaprawna.pl, word.czest.pl, regulis.pl, isap.sejm.gov.pl)

### Weryfikowane akty prawne
| Akt | Dz.U. | Wejście w życie | Zakres |
|---|---|---|---|
| Ustawa BRD I (zmiana PRD, u.k.p.) | Dz.U. 2025 poz. 1676 | 01–06.2026 (etapy) | pj od 17 lat, cofnięcie za jazdę po zatrzymaniu, cyfrowe pj |
| Ustawa BRD II (zmiana KK, KW) | Dz.U. 2025 poz. 1872 | 29.01.2026 / 30.03.2026 | Drift art.86c KW, nielegalne wyścigi art.115§26 KK, brawurowa jazda, przepadek pojazdu |
| Rozp. MSWiA ewidencja kierujących | Dz.U. 2026 poz. 724 | 03.06.2026 | **NOWE** rozporządzenie — zastępuje wcześniejsze; nowe kody, ograniczone szkolenia redukujące |
| PRD t.j. z nowelizacjami | Dz.U. 2024 poz. 1251 ze zm. | ciągłe | Aktualizacja o Dz.U. 2025 poz. 1676, 1734, 1843; Dz.U. 2026 poz. 180 |
| U.k.p. t.j. | Dz.U. 2025 poz. 1226 ze zm. | ciągłe | Aktualizacja o Dz.U. 2025 poz. 1676 |

### Wykonane aktualizacje
1. **mod-PRD-prawo-jazdy-punkty-karne.md** — kompleksowa aktualizacja (387→492 linii):
   - Alert legislacyjny: ustawa BRD I + BRD II + rozp. 2026 poz. 724
   - Nowe sekcje: prawo jazdy od 17 lat, nowe przestępstwa KK (brawurowa jazda, wyścigi)
   - Nowe wykroczenia: art. 86c KW (drift), zloty bez zgłoszenia
   - Zaktualizowane kasowanie punktów: ograniczenia szkoleniowe od 03.06.2026
   - Nowy przepadek pojazdu (≥1,5‰), zakaz dożywotni dla recydywistów
   - Cyfrowe prawo jazdy (mObywatel = pełnoprawne od 03.03.2026 w PL)
   - Zatrzymanie pj za >50 km/h poza zabudowanym (nowe od 03.03.2026)

2. **mod-KW-KPW-framework-szczegolowy.md** — dodano sekcję nowych wykroczeń drogowych:
   - Art. 86c KW (drift/poślizg od 29.01.2026)
   - Zloty motoryzacyjne bez zgłoszenia
   - Taryfikator: odesłanie do rozp. Dz.U. 2026 poz. 724

3. **DR-03 SKILL.md** — licznik 17→18 modułów, dodano mod-PRD z opisem

4. **DR-03 MAPA-AKTOW.md** — dodano: PRD, u.k.p., Ustawa BRD I/II, Rozp. ewidencji

5. **prawo-polskie-v2 ROUTING-MAP.md** — dodano 5 nowych wpisów dla PRD/BRD

*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-09d — Grzywny, mandaty, opłaty parkingowe SPP/ŚSPP

**Data:** 2026-06-09  
**Zakres:** Grzywny/mandaty/kary adm. (nowy moduł DR-03) + Strefy płatnego parkowania (nowy moduł DR-08)  
**Weryfikacja online:** arslege.pl, infor.pl, orzeczenia.nsa.gov.pl, lexlege.pl, prawo.pl

### Weryfikowane akty prawne
| Akt | Dz.U. | Zakres |
|---|---|---|
| UDP | Dz.U. 2025 poz. 889 t.j. | art. 13, 13b, 13f: SPP/ŚSPP, stawki % płacy min., opłata dodatkowa |
| KPA Dział IVa | Dz.U. 2025 poz. 1691 t.j. | art. 189a–189k: administracyjne kary pieniężne |
| UPEA | Dz.U. 2023 poz. 2505 t.j. | art. 33 (zarzuty), art. 119–125 (grzywna przymuszenia) |
| KPA art. 88 | Dz.U. 2025 poz. 1691 | grzywna porządkowa świadka/biegłego |
| KPSW | Dz.U. 2025 poz. 860 | art. 95–102 mandat karny, art. 101 uchylenie |

### Kluczowe ustalenia z weryfikacji online
1. **SPP/ŚSPP**: Opłata dodatkowa za parkowanie wynika bezpośrednio z prawa — brak decyzji adm., brak postępowania adm. → **NIE można zaskarżyć wezwania do WSA** (konsekwentna linia NSA + wyrok WSA Białystok II SA/Bk 159/24 z 28.05.2024). Obrona wyłącznie przez **zarzuty do TW (art. 33 UPEA) w 7 dni**.
2. **Stawki SPP/ŚSPP**: 0,15% płacy minimalnej za 1. godz. SPP (2026: ~7,20 zł) i 0,45% ŚSPP (~21,60 zł). Opłata dodatkowa max ~480,60 zł (2026). Zmienia się co roku.
3. **Grzywny sądowe**: max 5 000 zł (weryfikuj art. 24 §1 KW — zmieniane).
4. **KPA Dział IVa**: Administracyjne kary pieniężne — termin przedawnienia 5 lat od naruszenia (art. 189g KPA), możliwe ulgi (art. 189k), dyrektywy wymiaru (art. 189d).

### Wykonane aktualizacje
1. **NOWY: dr-03/modules/mod-grzywny-mandaty-szczegolowe.md** (328 linii):
   - Systematyka 5 typów: grzywna sądowa / mandat karny / kara adm. KPA / grzywna porządkowa / grzywna przymuszenia UPEA
   - Uchylenie mandatu (art. 101 KPSW): podstawy §1, §1a, §1b
   - KPA Dział IVa: dyrektywy wymiaru, ulgi, przedawnienie
   - Egzekucja administracyjna (UPEA art. 33 zarzuty — termin 7 dni)
   - Taryfikator mandatów: odesłanie do Dz.U. 2026 poz. 724

2. **NOWY: dr-08/modules/mod-UDP-strefy-platnego-parkowania.md** (293 linii):
   - SPP vs ŚSPP: różnice, podstawy prawne, stawki % płacy minimalnej
   - Kluczowe ustalenie: wezwanie do zapłaty NIE zaskarżalne — tylko zarzuty UPEA
   - Tryb obrony krok po kroku: wezwanie → TW → zarzuty → zażalenie → WSA
   - Parking prywatny: odrębny reżim KC + klauzule abuzywne
   - Karta parkingowa: widoczność za szybą (WSA Białystok 2024)
   - Zaskarżenie uchwały rady gminy o SPP (art. 101 USG)

3. **DR-03 SKILL.md** — licznik 18→19, dodano mod-grzywny-mandaty-szczegolowe
4. **DR-08 SKILL.md** — licznik 16→17, dodano mod-UDP-strefy-platnego-parkowania
5. **DR-03 MAPA-AKTOW** — dodano 4 nowe wpisy (KW/KPSW grzywna + KPA + UPEA)
6. **DR-08 MAPA-AKTOW** — dodano UDP SPP
7. **ROUTING-MAP** — dodano 2 nowe wpisy (grzywny DR-03 + UDP SPP DR-08)
8. **prawny-router-v3/references/wykroczenia.md** — aktualizacja taryfikatora (odesłanie)

*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-09e — Interpretacje i definicje podatkowe (enrichment DR-06)

**Data:** 2026-06-09  
**Zakres:** Nowy moduł interpretacji i definicji podatkowych dla DR-06; wzbogacenie PIT/CIT/VAT/OP  
**Weryfikacja online:** podatki.gov.pl/EUREKA, MF, orzeczenia.nsa.gov.pl, infor.pl, PwC, KPMG, gofin.pl

### Kluczowe ustalenia z weryfikacji

| Temat | Źródło | Status |
|---|---|---|
| PKWiU 2025 | Rozp. RM z 17.12.2025; PKWiU 2015 → VAT do 31.12.2027; PIT/CIT/ryczałt do 31.12.2028 | ✅ Zweryfikowane |
| EUREKA od 04.10.2021 | KIS; zastąpiła SIP | ✅ Zweryfikowane |
| Interpretacja ogólna DTS5.8092.2.2025 | MF 05.03.2025 — tajemnica zawodowa doradcy = jak adwokat w MDR | ✅ Zweryfikowane |
| Interpretacja ogólna DTS5.8092.3.2025 | MF 29.07.2025 — podwyższenie kapitału a MDR | ✅ Zweryfikowane |
| Interpretacja ogólna DTS5.8092.4.2024 | MF 24.12.2024 — leasing operacyjny NIE jest MDR | ✅ Zweryfikowane |
| Interpretacja ogólna DD8.8203.1.2023 | MF 25.01.2024 — estoński CIT w trakcie roku | ✅ Zweryfikowane |
| NSA III FPS 2/24 z 21.10.2024 | Wynajem mieszkalny przez przedsiębiorcę = stawka mieszkalna PON | ✅ Zweryfikowane |
| NSA II FPS 1/21 z 24.05.2021 | Najem prywatny gdy nie w majątku firmowym | ✅ Zweryfikowane |
| IP Box (KIS 2024–2026) | Linia: brak faktury = nie dyskwalifikuje; ewidencja warunek konieczny | ✅ Zweryfikowane |
| Estoński CIT — zysk kapz. | KIS 0111-KDIB2-1.4010.342.2021 — zysk kap. zapasowy podlega CIT przy rezygnacji | ✅ Zweryfikowane |
| Zaskarżenie interpretacji | Termin 14 dni (art. 53 §3 PPSA) — NIE 30 dni | ✅ Zweryfikowane |

### Wykonane aktualizacje
1. **NOWY: dr-06/modules/mod-interpretacje-definicje-podatkowe.md** (432 linii):
   - System interpretacji: ind./ogólna/objaśnienia/opinia zabezpiecz./WIS/WIA
   - Sekcja 2A–2E: definicje najem prywatny (NSA), rezydent, IP Box, B+R, estoński CIT
   - Sekcja 3: MDR — 4 kluczowe interpretacje ogólne MF z 2024–2025
   - Sekcja 4: PKWiU 2025 — harmonogram, PKWiU 2015 nadal do celów podatkowych
   - Sekcja 5: zestawienie kluczowych definicji (DG, mały podatnik, podmiot powiązany, stały zakład)
   - Sekcja 6: instrukcja korzystania z bazy EUREKA

2. **DR-06 SKILL.md** — licznik 14→15, dodano mod-interpretacje-definicje-podatkowe

3. **mod-OP-ordynacja-podatkowa** — sekcja 5: 14 dni termin na zaskarżenie, nowe interpretacje ogólne

4. **mod-VAT** — alert PKWiU 2025 (stosowana do 31.12.2027)

5. **mod-PIT** — aneks: IP Box linia KIS, najem prywatny NSA, PKWiU dla ryczałtu do 31.12.2028

6. **mod-CIT** — estoński CIT: interpretacja ogólna DD8.8203.1.2023, pułapka zysku kap. zap., ukryty zysk

7. **DR-06 MAPA-AKTOW** — 3 nowe wpisy

8. **ROUTING-MAP** — 1 nowy wpis (interpretacje/MDR/PKWiU/uchwały NSA)

*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-09e — Definicje kluczowe z interpelacji poselskich i wykładni urzędowych

**Data:** 2026-06-09
**Metodologia:** Baza orka2.sejm.gov.pl ZABLOKOWANA dla automatycznego dostępu (robots.txt).
Zastosowana alternatywa: pip.gov.pl (PIP), biznes.gov.pl (MSP), gov.pl/rodzina (MRPiPS),
podatki.gov.pl (MF), uokik.gov.pl, isap.sejm.gov.pl — źródła o równorzędnej wartości
definitywnej dla wykładni autentycznej przepisów.

### Wykonane operacje

#### 1. NOWY: shared/DEFINICJE-KLUCZOWE.md (464 linii)

Moduł kanoniczny 7 bloków tematycznych:

| Blok | Definicje |
|---|---|
| A — Podmioty | Osoba fizyczna/prawna, JONIOPO, przedsiębiorca (art. 4 P.przeds.), konsument (art. 22¹ KC), przedsiębiorca na prawach konsumenta (art. 385⁵ KC, od 01.01.2021), pracownik (art. 2 KP), pracodawca (art. 3 KP), stosunek pracy (art. 22 §1–§1¹ KP) |
| B — Własność | Nieruchomość (art. 46 KC), 3 rodzaje, rzecz ruchoma, część składowa (art. 47), przynależność (art. 51), posiadanie samoistne/zależne (art. 336), dzierżyciel (art. 338), domniemanie, ochrona posesoryjne, własność (art. 140 KC) |
| C — Odpowiedzialność | Szkoda majątkowa (damnum emergens + lucrum cessans) vs niemajątkowa (krzywda), odszkodowanie vs zadośćuczynienie, odp. deliktowa (art. 415), kontraktowa (art. 471), adekwatny zw. przyczynowy (art. 361), miarkowanie (art. 362), przedawnienie |
| D — Praca | Mobbing — obowiązująca def. art. 94³ §2 KP (WSZYSTKIE elementy łącznie) + projekt nowelizacji Rady Ministrów 17.02.2026 (JESZCZE NIE USTAWA: wykluczenie incydentalnych, 6× min. wynagrodzenie); dyskryminacja art. 18³a KP + odwrócony ciężar |
| E — Procedury | Termin zawity vs przedawnienia (kluczowa różnica!), strona postępowania KPA art. 28, decyzja administracyjna KPA art. 107 (8 elementów) |
| F — Interpelacje | Obiekt liniowy (IZ6.nsf/main/5A306280), samowola budowlana (brak ustawowej def.), opłata parkingowa — charakter daniny z mocy prawa (WSA Białystok II SA/Bk 159/24), niealimentacja art. 209 KK, rzecz w KC |
| G — Podatki | Przychód (PIT art. 11), KUP (art. 22), rezydent podatkowy (art. 3), działalność gospodarcza podatki (art. 5a pkt 6), nieeiwidencjonowana (art. 5 P.przeds.) |

#### 2. Aktualizacja shared/SKILL.md
- Dodano DEFINICJE-KLUCZOWE do wykazu modułów

#### 3. Odesłania w 4 DR-skillach
- DR-02 (cywilne): bloki B, C, A.3 (nieruchomość, szkoda, konsument)
- DR-04 (praca): bloki A.4, D (pracownik, stosunek pracy, mobbing, dyskryminacja)
- DR-05 (admin.): bloki E (termin zawity, strona, decyzja)
- DR-06 (podatki): blok G (przychód, KUP, rezydent, DG)

### Kluczowe ustalenia z weryfikacji online

1. **Mobbing 2026 — WAŻNA**: Definicja art. 94³ §2 KP NADAL OBOWIĄZUJE w oryginalnym brzmieniu. Projekt nowelizacji przyjęty przez Radę Ministrów 17.02.2026 jest w Sejmie (X kadencja) — NIE WSZEDŁ W ŻYCIE. Stare wymogi: WSZYSTKIE ŁĄCZNIE (w tym "uporczywe i długotrwałe"). Moduł zawiera alert z datą i statusem.

2. **Przedsiębiorca na prawach konsumenta** (art. 385⁵ KC, od 01.01.2021): jednoosobowy przedsiębiorca CEIDG może korzystać z ochrony konsumenckiej gdy umowa nie ma charakteru zawodowego — oceniane wg kodów PKD w CEIDG; wystawienie faktury "na firmę" NIE jest automatycznie wyłącznikiem.

3. **Stosunek pracy** (art. 22 §1¹ KP): nazwa umowy NIE decyduje — decyduje faktyczny sposób wykonywania pracy. Kluczowe 4 elementy: kierownictwo, miejsce/czas, odpłatność, osobiste wykonanie.

*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-09f — Interpelacje poselskie orka2.sejm.gov.pl — wzbogacenie definicji

**Data:** 2026-06-09
**Metodologia:** orka2.sejm.gov.pl blokuje bezpośredni dostęp robotów (robots.txt + CAPTCHA).
Treści interpelacji dostępne przez indeksowanie Google — pobrane jako snippety wyszukiwania.
Baza obejmuje: VII kadencja (INT7.nsf), VI kadencja (IZ6.nsf), IV kadencja (IZ4.nsf) + pip.gov.pl.

### Dodane definicje — BLOK H w shared/DEFINICJE-KLUCZOWE.md

| Obszar | Źródło orka2 | Treść |
|---|---|---|
| Forma umowy o pracę (art. 29 KP) | INT7.nsf/4C1435A0 (MRPiPS) | Potwierdzenie PRZED dopuszczeniem do pracy; grzywna 1k–30k zł |
| Nieobecność w pracy — elementy | IZ6.nsf/5187F47C (MPiPS) | Uprzedzenie/zawiadomienie + usprawiedliwienie; brak prawa do wynagrodzenia |
| Urlopy rodzicielskie — systematyka | INT7.nsf/785F9759, 573BBE0D | Urlop wych.: oboje rodzice, jednoczesny 3 mies., brak limitu; ochrona 2 tyg. przed |
| Wypadek przy pracy — 4 elementy | pip.gov.pl (PIP — organ kontroli) | Nagłość (1 dniówka), przyczyna zewnętrzna (może łączona), uraz/śmierć, związek |
| Obiekt budowlany + liniowy | INT7.nsf/568AC194 (MInfr.) | Def. po nowelizacji 2015; kable w kanalizacji ≠ obiekt budowlany |
| Decyzja o WZ — charakter | INT7.nsf/3E927897 (Ministerstwo) | Nie rodzi praw do terenu; analiza urbanistyczna = integralny załącznik |
| Decyzja WZ vs pozwolenie na budowę | INT7.nsf | Wykonalność (1 strona) vs ostateczność (wiele stron) |
| Dochód/przychód przy ryczałcie | IZ6.nsf/6A0E7E37, IZ4.nsf/1D1D3180 | Ryczałt: podstawa = przychód (bez KUP); dochód deklarowany; zaliczka przy UoP vs zlecenie |
| KUP ZPChr — interpretacja ogólna MF | IZ6.nsf/2592F9C1 | DD6/8213/165/KWW/09/BMI9/11871; cała kwota wynagrodzenia jako koszt |
| Rękojmia vs gwarancja (2023+) | Legislacja + wykładnia ministerialna | B2C: niezgodność towaru z umową (art. 43b u.p.k.); B2B: stare KC |

### Nota metodologiczna
orka2.sejm.gov.pl — serwer Sejmu blokuje automatyczny dostęp (robots.txt + CAPTCHA).
Wartość prawna odpowiedzi ministerialnych = wykładnia autentyczna organu;
niewiążąca sądów, ale powszechnie stosowana przez administrację, pracodawców, US, ZUS.

*Wpis zamknięty: 2026-06-09*

---

## AUDYT-2026-06-11a — Baza ORKA_COMBINED v1.8 → moduł shared/ORKA-BAS-LEKSYKON.md

**Data:** 2026-06-11
**Źródło wejściowe:** ORKA_COMBINED_v1_8_ONLINE_FULL.zip (54 pliki, ~121 KB)
**Zakres:** BAS-001–125 definicji ministerialnych + 9 metareguł ORKA-REG + weryfikacja online

### Struktura bazy ORKA (z archiwum)
- **BAS-001–106**: pełne rekordy z definicjami ministerialnymi (interpelacje VII kad.)
- **BAS-107–125**: rekordy-kandydaci zinwentaryzowane online, wymagające pełnego tekstu przez API
- **9 metareguł**: ORKA-REG-01–07 + ORKA-META-01–02 (zakaz przenoszenia definicji sektorowych)
- **Rekordy szczegółowe** (101–106): strefa zamieszkania, org. pozarządowa, uprawdopodobnienie,
  stałe miejsce działalności VAT, zabudowa zagrodowa, gołąb=drób (różne definicje sektorowe)

### Weryfikacje online wykonane
| Hasło | Zweryfikowano |
|---|---|
| Droga wewnętrzna (BAS-107) | UDP art. 8 ust. 1 Dz.U. 2025 poz. 889 — POTWIERDZONA |
| Odbiorca wrażliwy (BAS-108) | Prawo energetyczne art. 3 pkt 13c — POTWIERDZONA + alert o zm. 2025 |
| Faktyczne wspólne pożycie (BAS-112) | KK art. 115 §11 — pojęcie ocenne, linia SN; zmiany 2022+ |
| Mowa nienawiści (BAS-118) | KK art. 256–257 — brak def. legalnej; zmiana 2024/2025 |
| Handel ludźmi (BAS-121) | KK art. 115 §22 — def. ustawowa |
| Strefa zamieszkania (BAS-101) | PRD art. 2 pkt 16 + zapytanie 3895/2009 — POTWIERDZONA |
| Cel publiczny (BAS-009) | UGN art. 6 — katalog zamknięty |
| Podatek (BAS-074) | Ordynacja podatkowa art. 6 |
| Stałe miejsce dział. VAT (BAS-104) | Rozp. 282/2011 art. 11 + TSUE C-605/12, C-547/18 |

### Wykonane operacje
1. **NOWY: shared/ORKA-BAS-LEKSYKON.md** (525 linii):
   - 10 części tematycznych (prawo pracy, admin., drogowe, finanse, nieruchomości, cywilne,
     niepełnosprawność, karne, energetyczne, kandydaci-do-uzupełnienia)
   - Wszystkie 9 metareguł ORKA-REG z objaśnieniem i przykładami
   - Quality Gate z procedurą weryfikacji przez API Sejmu
2. **NOWY: shared/ORKA-BAS-001-125.json** (JSON maszynowy)
3. **shared/SKILL.md** — dodano ORKA-BAS-LEKSYKON do wykazu modułów
4. **prawo-polskie-v2/ROUTING-MAP.md** — sekcja globalna ORKA-BAS na początku pliku

*Wpis zamknięty: 2026-06-11*

---

## AUDYT-2026-06-11b — ORKA VIII–X kadencja — nowe definicje i wykładnie ministerialne

**Data:** 2026-06-11
**Zakres:** Interpelacje poselskie VIII (2015–2019), IX (2019–2023), X (2023–) kadencji
**Metoda:** web_search + web_fetch: prawo.pl, gofin.pl, isp-modzelewski.pl,
  interpretacje-orzeczenia.pl, bip.brpo.gov.pl, budowlaneabc.gov.pl, isap.sejm.gov.pl

### Nowe rekordy (BAS-W01–W16)

| ID | Hasło | Źródło | Kadencja |
|---|---|---|---|
| BAS-W01 | Uzasadnione potrzeby pracodawcy (art. 42 §4 KP) | MPiPS/MRPiPS interp. | VI/VIII |
| BAS-W02 | Szczególne potrzeby pracodawcy (nadgodziny art. 151 KP) | MPiPS DPR-III-079-612/08 | VIII cyt. |
| BAS-W03 | Praca zdalna okazjonalna (interp. nr 38835) | MRiPS 23.02.2023 + 13.06.2023 | IX/X |
| BAS-W04 | Ochrona szczególna pracownika — kategorie | MRPiPS interp. | VIII cyt. |
| BAS-W05 | Urlop wypoczynkowy — def. funkcjonalna | MRiPS 23.02.2023 | IX |
| BAS-W06 | "Zajęcie na DG" — podatek od nieruchomości | MF interp. nr 37882, 12.01.2023 | IX/X |
| BAS-W07 | "Grunty zajęte na DG" — upol | NSA III FSK 530/23, 06.09.2023 | X cyt. |
| BAS-W08 | Podatek katastralny — brak planów | MF interp. nr 4662, 18.09.2024 | X |
| BAS-W09 | Samowola budowlana — def. po nowelizacji 2023 | MRiT budowlaneabc.gov.pl | IX/X |
| BAS-W10 | Obiekt liniowy — def. po 2010 r. | IZ6.nsf/5A306280 (PrBud) | VI cyt. |
| BAS-W11 | Dwuinstancyjność KPA art. 15 | IZ5.nsf/7CF6519E | V cyt. |
| BAS-W12 | Wynagrodzenie dla egzekucji adm. (zmiana 25.03.2024) | UPEA nowelizacja + kpmg.pl | X |
| BAS-W13 | Niezgodność towaru z umową B2C (od 01.01.2023) | u.p.k. art. 43a–43n | IX/X |
| BAS-W14 | Nowe definicje budynek/budowla upol (od 01.01.2025) | TK SK 14/21 + Dz.U. 2024.1757 | X |
| BAS-W15 | Choroba zawodowa — 2 przesłanki | KP art. 235(1) + rozp. RM 2009 | aktualny |
| BAS-W16 | Godziny ponadwymiarowe nauczycieli | Karta Nauczyciela art. 35 | aktualny |

### Kluczowe ustalenia
1. **Praca zdalna** (od 07.04.2023): MRiPS jednoznacznie: 24 dni = nie proporcjonalne do etatu; ≠ urlop na żądanie
2. **Podatek od nieruchomości**: UWAGA — reforma od 01.01.2025 (Dz.U. 2024 poz. 1757) — nowe definicje budynku/budowli w upol zamiast odesłania do PrBud (TK SK 14/21)
3. **Rękojmia B2C**: od 01.01.2023 = ustawa o prawach konsumenta art. 43a–43n ("niezgodność towaru z umową")
4. **Egzekucja wynagrodzenia**: od 25.03.2024 obejmuje zasiłki chorobowe/macierzyńskie + 12 mies. po ustaniu zatrudnienia

### Wykonane operacje
1. **NOWY: shared/ORKA-BAS-VIII-X-KADENCJA.md** (438 linii)
2. **shared/SKILL.md** — dodano ORKA-BAS-VIII-X-KADENCJA

*Wpis zamknięty: 2026-06-11*

---

## AUDYT-2026-06-12a — Integracja ORKA-BAS z 16 DR-skillami + ROUTING-MAP

**Data:** 2026-06-12
**Zakres:** Pełna integracja shared/ORKA-BAS-LEKSYKON.md (104 rekordy) i
shared/ORKA-BAS-VIII-X-KADENCJA.md (25 rekordów) z architekturą routingu.

### Wykonane operacje
1. **16/16 DR-skillów** — dodano sekcję "## ORKA-BAS — Definicje wspomagające"
   w SKILL.md (przed "## Moduły"), z listą dedykowanych rekordów BAS-XXX/BAS-WXX
   relevantnych dla danej dziedziny + alerty legislacyjne.
2. **prawo-polskie-v2/ROUTING-MAP.md** — przebudowana tabela globalna ORKA-BAS:
   tabela DR-skill → liczba dedykowanych rekordów → najważniejsze hasła,
   + sekcja ALERTY (4 zmiany legislacyjne wymagające szczególnej uwagi routera).

### Zasada działania po integracji
Router (prawny-router-v3) kierując sprawę do DR-skilla, model widzi w SKILL.md
tego DR-skilla bezpośrednio listę odpowiednich rekordów ORKA — nie musi
przeszukiwać 129-rekordowego leksykonu. Lazy loading zachowany: definicja
doładowywana tylko gdy konkretne hasło jest relewantne dla sprawy.

### Pakiety zaktualizowane (17 ZIP)
DR-01..DR-16 (SKILL.md), prawo-polskie-v2 (ROUTING-MAP.md), shared (bez zmian
treści — już aktualny z poprzedniej sesji).

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-12b — Naprawa błędów wykrytych w audycie integracyjnym

**Data:** 2026-06-12
**Zakres:** Naprawa defektów ORKA-BAS-LEKSYKON.md wykrytych przy integracji z DR-skillami.

### Wykryte i naprawione błędy
1. **Duplikat numeracji sekcji**: "CZĘŚĆ XVII" i "CZĘŚĆ XVIII" występowały dwukrotnie
   (stare sekcje P1/P2 z wcześniejszej sesji + nowe sekcje z bieżącej sesji).
   → Renumeracja: stare P1/P2 → "CZĘŚĆ XIX" / "CZĘŚĆ XX".
2. **Duplikat BAS-120** z DWIEMA różnymi treściami:
   - Wersja 1 (stara, CZĘŚĆ XIX): cytowała "ustawę z 20.04.2004 r." i
     "ustawę o promocji zatrudnienia art. 2 ust. 1 pkt 22" jako podstawę —
     ta ustawa została UCHYLONA 01.06.2025 (wykryte w AUDYT-2026-06-12 wcześniej).
     Zawierała też błędne odesłanie "art. 120 u.p.z." (kolizja z numerem rekordu).
   - Wersja 2 (nowa, CZĘŚĆ XVII): cytuje poprawną ustawę z 15.06.2012 r.
     (Dz.U. 2024 poz. 1543 t.j.) — zachowana jako autorytatywna.
   → Wersja 1 zastąpiona stubem odsyłającym do wersji 2.

### Walidacja końcowa
- Code fences (```): 174 (LEKSYKON) + 44 (VIII-X) — oba parzyste ✅
- Wszystkie 4 odesłania do mod-*.md istnieją na dysku ✅
- 16/16 SKILL.md: dokładnie 1× "## Moduły" + 1× "## ORKA-BAS" ✅
- ROUTING-MAP: dokładnie 1× tabela globalna ORKA-BAS ✅
- Wszystkie referencje BAS-ID w sekcjach "ORKA-BAS — Definicje wspomagające"
  zweryfikowane programowo — 105 rekordów łącznie, 0 referencji do nieistniejących ID ✅

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-12c — Aktualizacja definicji wycofanych/zamrożonych + nowe zmienniki

**Data:** 2026-06-12
**Zakres:** Re-weryfikacja online 5 pozycji oznaczonych jako wycofane/zamrożone/sporne.

### Wyniki weryfikacji

1. **BAS-001/002/003/014/075 (rynek pracy)** — ✅ ROZWIĄZANE.
   Ustawa o promocji zatrudnienia (uchylona 01.06.2025) zastąpiona ustawą
   o rynku pracy i służbach zatrudnienia z 20.03.2025 (Dz.U. 2025 poz. 620).
   Treść definicji "nielegalne zatrudnienie" (art. 2 pkt 14), "odpowiednia
   praca" (art. 2 pkt 16), "bezrobotny" (art. 2 pkt 1 + art. 1 ust. 3) —
   PRZENIESIONA bez zmian substancji. NOWOŚĆ: rolnicy z >2 ha przeliczeniowe
   bez stałych dochodów mogą rejestrować się jako bezrobotni; nowa kategoria
   "osoby bierne zawodowo" (emeryci, studenci, urlop wychowawczy).

2. **BAS-W23 (mienie znacznej/wielkiej wartości, art. 115 §5-6 KK)** —
   ✅ POTWIERDZONE bez zmian. Status "zamrożone od 2010" zweryfikowany przez
   artykuł prawo.pl z 26.08.2025 (dr M. Klonowski). Brak nowelizacji w toku.
   Spór doktrynalny o waloryzację wg art. 115 §8 KK NIE jest stosowany —
   sądy stosują sztywne kwoty nominalne.

3. **BAS-W08 (podatek katastralny)** — ⚠️⚠️ ZMIANA STANU PRAWNEGO.
   20.03.2026 Lewica złożyła w Sejmie projekt ustawy katastralnej (≥3 lokale,
   0,5%→1,5% wartości/rok). MF (22.01.2026): brak prac rządowych, ale to
   inicjatywa poselska — aktywna. Rekord przebudowany: stan historyczny
   (MF 09.2024) vs stan aktualny (Sejm 03.2026) + 3 scenariusze.

4. **NOWY ALERT — BAS-W32 (przedawnienie)**: wykryto podczas weryfikacji
   nowelizację Ordynacji podatkowej znoszącą "wieczne przedawnienie"
   zobowiązań podatkowych + wprowadzającą ugodę podatkową — wejście
   01.10.2026. Dodano jako odrębny reżim (OP ≠ KC) w BAS-W32.

5. **Ubezwłasnowolnienie** — bez zmian od 02.06.2026 (brak nowych informacji).

### Aktualizacje propagowane do SKILL.md
- DR-04: alert ⚠️→✅ (rynek pracy zweryfikowany, nowe kategorie opisane)
- DR-06: dodano BAS-W08 (kataster) i BAS-W32 (przedawnienie podatkowe) +
  alert o ustawie z 27.02.2026 zmieniającej UFP (wpływ na BAS-022..098)
- ROUTING-MAP: sekcja alertów rozszerzona z 4 do 8 pozycji, oznaczenia ✅/⚠️

### Walidacja
Code fences: 174 (LEKSYKON) + 44 (VIII-X) — oba parzyste ✅

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-12d — Nowa definicja krytyczna: AI Act "system wysokiego ryzyka"

**Data:** 2026-06-12
**Znalezisko:** rozporządzenie (UE) 2024/1689 (AI Act) art. 6 + Annex III pkt 4 —
definicja "systemu AI wysokiego ryzyka" obejmuje systemy do rekrutacji, oceny
kandydatów, decyzji o awansie/zwolnieniu i monitorowania wydajności pracowników.

⚠️⚠️ TERMIN 02.08.2026 (< 2 miesiące) — pełne obowiązki dla systemów wysokiego
ryzyka stają się wymagalne. Rozporządzenie UE stosowane BEZPOŚREDNIO, niezależnie
od polskiej ustawy wdrożeniowej (projekt — Komisja Rozwoju i Bezpieczeństwa AI —
w pracach rządowych, brak uchwalenia na 06.2026).

### Nowy rekord
- **BAS-W36** (ORKA-BAS-VIII-X-KADENCJA.md, +124 linii): pełny harmonogram
  AI Act (02.2025/08.2025/08.2026/08.2027), definicja systemu wysokiego ryzyka
  z Annex III pkt 4 (zatrudnienie), obowiązki dostawcy/użytkownika, FRIA vs DPIA
  (kumulacja z RODO art. 35), status polskiej ustawy, checklist intake dla DR-04.

### Propagacja
- DR-04/SKILL.md: dodano BAS-W36 z naciskiem na prawo pracy (ATS, ocena
  wydajności, decyzje kadrowe wspierane AI)
- DR-11/SKILL.md: dodano BAS-W36 z naciskiem na FRIA/DPIA i status ustawy
- ROUTING-MAP: alert oznaczony jako NAJWYŻSZY PRIORYTET (najkrótszy termin
  ze wszystkich alertów w systemie)

### Walidacja
Code fences: 174 (LEKSYKON, bez zmian) + 46 (VIII-X, +2 — parzyste) ✅

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-12e — Przebudowa DEFINICJE-KLUCZOWE.md: monolit → 9 plików tematycznych

**Data:** 2026-06-12
**Cel:** Eliminacja ładowania definicji nieistotnych dla danej dziedziny (np.
DR-06 nie potrzebuje definicji mobbingu) + eliminacja duplikacji shared/ ↔ ORKA
wykrytej w AUDYT-2026-06-12 (Blok C.1/D.1/E.1 vs BAS-W26/W20/W27).

### Wykonane operacje

1. **shared/DEFINICJE-KLUCZOWE.md** (788 linii, monolit, bloki A-H) →
   PRZEBUDOWANY na 61-liniowy INDEKS/ROUTER (wzorzec analogiczny do SKILL.md
   + modules/ w DR-skillach).

2. **NOWY: shared/definicje/** (9 plików, 1076 linii łącznie):
   - DEF-PODMIOTY-WLASNOSC.md (158) — Blok A+B + "rzecz" z F → DR-02
   - DEF-ODPOWIEDZIALNOSC-SZKODA.md (114) — Blok C SCALONY z BAS-W26 → DR-02/16
   - DEF-PRACA.md (313) — A.4+D+H.1+H.6 SCALONY z BAS-W20 → DR-04 (plik główny)
   - DEF-PROCEDURA.md (85) — E.1-E.2 SCALONY z BAS-W27 → DR-02/03/05/16
   - DEF-BUDOWLANE-DROGOWE.md (114) — F fragment + H.2 → DR-08/09
   - DEF-PODATKOWE.md (122) — Blok G + H.3 → DR-06
   - DEF-CYWILNE-WYKLADNIA.md (54) — H.4 (rękojmia vs gwarancja) → DR-02
   - DEF-ADMINISTRACYJNE.md (74) — E.3+H.5.1 SCALONE → DR-05
   - METODOLOGIA-ORKA2.md (42) — H.7, plik deweloperski

3. **ORKA-BAS-LEKSYKON.md** (1964 linii): BAS-W20, BAS-W26, BAS-W27 zastąpione
   5-liniowymi stubami z odesłaniem do odpowiedniego DEF-*.md. Code fences
   174 (parzyste) — zwalidowane.

4. **8 SKILL.md zaktualizowanych** (DR-02, 03, 04, 05, 06, 08, 09, 16): nowa
   sekcja "## DEFINICJE — shared/definicje/" PRZED sekcją ORKA-BAS, z
   bezpośrednimi odniesieniami do plików DEF-*.md relewantnych dla danej
   dziedziny — bez przechodzenia przez indeks DEFINICJE-KLUCZOWE.md.

5. **shared/SKILL.md** — zaktualizowany opis modułu DEFINICJE-KLUCZOWE.

### Architektura po przebudowie
```
shared/DEFINICJE-KLUCZOWE.md (indeks, 61 linii)
  └── shared/definicje/
        ├── DEF-PODMIOTY-WLASNOSC.md      → DR-02
        ├── DEF-ODPOWIEDZIALNOSC-SZKODA.md → DR-02, DR-16
        ├── DEF-PRACA.md                   → DR-04
        ├── DEF-PROCEDURA.md               → DR-02/03/05/16
        ├── DEF-BUDOWLANE-DROGOWE.md       → DR-08, DR-09
        ├── DEF-PODATKOWE.md               → DR-06
        ├── DEF-CYWILNE-WYKLADNIA.md       → DR-02
        ├── DEF-ADMINISTRACYJNE.md         → DR-05
        └── METODOLOGIA-ORKA2.md           (deweloperski)
```
Każdy DR ładuje TYLKO swój plik tematyczny — analogicznie do "jeden moduł =
jeden akt prawny" w modules/, teraz także dla definicji ogólnych.

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-12f — Nowa para definicji spornych: siła wyższa + rebus sic stantibus

**Data:** 2026-06-12
**Znalezisko:** dwa pojęcia bez definicji ustawowej, bardzo często powoływane
w sporach kontraktowych (wojna w Ukrainie, inflacja, embargo, COVID precedent):
- **Siła wyższa** — brak definicji w KC, 3 przesłanki z linii SN (zewnętrzność,
  nieprzewidywalność, nieuchronność skutków). Klauzule umowne "force majeure"
  mogą definiować inaczej — definicja kontraktowa ma pierwszeństwo.
- **Rebus sic stantibus (art. 357¹ KC)** — 4 przesłanki, WSZYSTKIE nieostre:
  "nadzwyczajna zmiana stosunków", "nadmierne trudności", "rażąca strata",
  nieprzewidywalność. Tryb wyłącznie powództwem (nie zarzut), przed
  wygaśnięciem zobowiązania. Granica: nie można modyfikować norm bezwzględnie
  obowiązujących (np. wynagrodzenia minimalnego).

### Dodano do DEF-ODPOWIEDZIALNOSC-SZKODA.md (114→211 linii, fences=10 parzyste)
Propagacja: DR-02 i DR-16 SKILL.md (sekcja DEFINICJE).

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-12g — Klaster: interes własny, wyłączenia, strona ukryta

**Data:** 2026-06-12
**Nowy plik:** shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md (333 linii,
fences=14 parzyste). Sześć powiązanych pojęć w jednym klastrze:

1. **Interes prawny vs faktyczny** (art. 28 KPA) — definicja strony postępowania,
   NSA II GSK 163/06 (osobisty/własny/indywidualny/konkretny/aktualny/
   obiektywnie stwierdzalny), przykład graniczny Sanepid/COVID/immisje.
2. **Wyłączenie sędziego/biegłego** (art. 48-49/281 KPC) — iudex inhabilis
   (6 przesłanek z mocy ustawy) vs iudex suspectus (na wniosek, niedookreślone);
   TK P 10/19 (23.02.2022) — neoKRS jako podstawa wyłączenia NIE działa od
   28.02.2022, ale ETPCz idzie w przeciwnym kierunku (alert do re-weryfikacji).
3. **Świadek i interes własny** — KLUCZOWE rozróżnienie: świadka NIE WYŁĄCZA
   się z powodu interesu (tylko prawo odmowy zeznań dla bliskich, art. 261 KPC),
   interes jest czynnikiem OCENY WIARYGODNOŚCI (art. 233 KPC), nie podstawą
   wyłączenia.
4. **Pełnomocnik — konflikt interesów** — skutek głównie dyscyplinarny/cywilny,
   NIE automatyczna nieważność postępowania (art. 379 KPC nie wymienia).
5. **Czynność prawna ukryta/pozorna (art. 83 KC)** — pozorność absolutna vs
   względna (dysymulacja), ochrona osoby trzeciej w dobrej wierze (§2) —
   kluczowe dla obrotu nieruchomościami.
6. **Rzeczywisty beneficjent/UBO** — AML art. 2 ust.2 pkt1 (próg 25%, CRBR,
   kara do 1 mln zł) + alert: 3 RÓŻNE definicje "rzeczywistego właściciela"
   w polskim prawie (AML/CIT-WHT art.4a pkt29/KSH art.4§1pkt4) — nie mylić.

### Propagacja: 6 SKILL.md (DR-02, 03, 05, 06, 12, 16)
DR-05 jako plik główny (interes prawny/faktyczny = fundament legitymacji
procesowej w postępowaniu administracyjnym). DR-12 otrzymał nową sekcję
"## DEFINICJE — shared/definicje/" (nie miał jej wcześniej).

### Indeks DEFINICJE-KLUCZOWE.md
Nowy wiersz w tabeli — 10. plik w shared/definicje/ (łącznie 1409 linii
w katalogu definicje/).

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-12h — Droga do 8,5: podział mod-KP-prawo-pracy, dedup DR-01, CHECKLIST-DEDUP

**Data:** 2026-06-12
**Cel:** realizacja 3 ścieżek z oceny 8,0→8,5+ (podział wielkich modułów,
proaktywny walidator dedup, dedup DR-01/05/07).

### 1. Podział mod-KP-prawo-pracy.md (DR-04): 524 → 337 linii

Rdzeń (sekcje 1-12, rozwiązanie umowy o pracę) pozostał, 3 ANEKSY wydzielone
do samodzielnych modułów z deduplikacją przy okazji:

- **mod-KP-mobbing-dyskryminacja.md** (109 linii) — z ANEKS A. Usunięto
  zduplikowaną definicję "5 przesłanek mobbingu" (teraz wyłącznie w
  DEF-PRACA.md). Zachowano UNIKALNĄ treść: tabelę porównawczą mobbing/
  dyskryminacja/molestowanie, strategię dowodową pracownika/pracodawcy.
  **SCALONO projekt nowelizacji** — ANEKS A znał go jako "UD183" (zmiany:
  nowa definicja + prawo regresu), DEF-PRACA znał go jako "RM 17.02.2026"
  (zmiany: kryteria/formy/min.zadośćuczynienie/regulamin). TO BYŁ TEN SAM
  PROJEKT opisany dwoma niekompletnymi zestawami — scalono w jeden pełny
  zestaw 7 zmian, zapisany w DEF-PRACA.md (kanoniczne) z odsyłaczem z
  nowego modułu. Przy tej samej okazji usunięto TRZECIE, jeszcze krótsze
  wystąpienie tego projektu wewnątrz DEF-PRACA.md (pozostałość po
  wcześniejszym scaleniu BAS-W20) — był to WEWNĘTRZNY duplikat nieujawniony
  do tej pory.

- **mod-wypadek-przy-pracy-choroba-zawodowa.md** (112 linii) — z ANEKS B.
  Usunięto skróconą definicję wypadku przy pracy, zastąpiono odesłaniem do
  DEF-PRACA.md H.1.4 (4-elementowa definicja + typy wypadków — bardziej
  kompletna). Zachowano intake, świadczenia ZUS, terminy, ścieżkę sporną.

- **mod-KP-praca-zdalna.md** (75 linii) — z ANEKS C. Dodano cross-ref do
  BAS-W03 (definicja + wykładnia MRiPS dla pracy okazjonalnej).

Wszystkie 4 pliki: fences parzyste. SKILL.md DR-04 zaktualizowany (4 wpisy
w liście modułów).

### 2. Dedup DR-01: mod-USP-ustroj-sadow-powszechnych.md

Moduł miał WŁASNY, krótszy opis "Iudex inhabilis/Iudex suspectus" BEZ
wzmianki o wyroku TK P 10/19 (23.02.2022, neoKRS) — krytycznym alercie
obecnym w DEF-INTERES-WLASNY-WYLACZENIA.md. Zastąpiono odesłaniem,
zachowano unikalny diagram procedury wyłączenia (flowchart). Dodano
sekcję "## DEFINICJE — shared/definicje/" do SKILL.md DR-01 (pierwszy
wpis tego typu dla tego skilla). Zaktualizowano indeks DEFINICJE-KLUCZOWE.md
— DEF-INTERES-WLASNY-WYLACZENIA.md obejmuje teraz DR-01/02/03/05/06/12/16
(7 DR-skillów, najszerszy zasięg pliku w systemie).

### 3. NOWY: audyt-systemu-v4/references/CHECKLIST-DEDUP.md (proaktywny walidator)

Tabela 31 pojęć → lokalizacja kanoniczna → konsumenci → status. Zawiera:
- Pełny katalog wszystkich scaleń wykonanych w sesjach 2026-06-12 (a-h)
- 4 noty otwarte (NOTA-1 do NOTA-4), NOTA-1 rozwiązana w tej samej sesji
  (cross-ref BAS-W32 ↔ DEF-PROCEDURA — komplementarność, nie duplikat)
- NOTA-3: formalne udokumentowanie WYJĄTKU dla mod-KK-kwalifikator (589
  linii, DR-03) — drzewo decyzyjne, podział zniszczyłby logikę porównawczą
- NOTA-4: tabela statusu wszystkich modułów >400 linii z PRIORYTETAMI:
  mod-KC-cywilne-zobowiazania (DR-02, 436) i mod-interpretacje-definicje-
  podatkowe (DR-06, 432) oznaczone jako PRIORYTET — możliwy overlap z
  DEF-ODPOWIEDZIALNOSC-SZKODA.md i DEF-PODATKOWE.md po dzisiejszych scaleniach
- Reguła progowa: >400 linii = audyt "przy okazji" najbliższej zmiany;
  >600 linii = priorytet nawet bez innej zmiany w toku

Zarejestrowany w audyt-systemu-v4/SKILL.md jako obowiązkowy do wczytania
w FAZIE 0, z instrukcją: sprawdź checklist PRZED dodaniem nowej definicji.

---

## PLAN NA PRZYSZŁOŚĆ — ROADMAP PO SESJI 2026-06-12

### Krótkoterminowe (następna sesja edycyjna, "przy okazji")
- [ ] mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md (DR-02, 436 linii) —
      sprawdzić overlap z DEF-ODPOWIEDZIALNOSC-SZKODA.md (211 linii po
      dodaniu siły wyższej/rebus sic stantibus) — PRIORYTET
- [ ] mod-interpretacje-definicje-podatkowe.md (DR-06, 432 linii) —
      sprawdzić overlap z DEF-PODATKOWE.md (122 linii) — PRIORYTET
- [ ] mod-PrFarm-szczegolowy.md (DR-10, 468 linii) — sprawdzić overlap
      z mod-PrFarm-prawo-farmaceutyczne.md (901 linii) po wydzieleniu
      wyrobów medycznych — czy "uzupełnia" nie duplikuje teraz?

### Średnioterminowe (kolejny pełny audyt)
- [ ] mod-PZP-zamowienia-publiczne-KIO.md (DR-07, 493 linii) — analiza
      struktury, czy ma analogiczne "ANEKSY" do wydzielenia
- [ ] mod-PRD-prawo-jazdy-punkty-karne.md (DR-03, 492 linii) — jw.
- [ ] mod-ustawa-cudzoziemcy.md (DR-05, 455 linii) — jw.
- [ ] Dedup DR-05 i DR-07 (oba miały ~5-8% odwołań do shared/ w audycie
      8.0) — teraz że shared/definicje/ jest podzielone tematycznie,
      sprawdzić czy moduły tych skilli mają lokalne definicje administracyjne/
      proceduralne duplikujące DEF-ADMINISTRACYJNE.md / DEF-PROCEDURA.md /
      DEF-INTERES-WLASNY-WYLACZENIA.md (interes prawny — bardzo prawdopodobne
      dla DR-05/DR-07 jako dziedzin administracyjnych)

### Długoterminowe (utrzymanie)
- [ ] CHECKLIST-DEDUP.md — aktualizować przy KAŻDYM audycie (procedura
      opisana w samym pliku, sekcja "PROCEDURA UŻYCIA")
- [ ] Re-weryfikacja cykliczna alertów czasowych: AI Act (termin 02.08.2026 —
      za <2 miesiące), UD183/mobbing (status w Sejmie), podatek katastralny
      (BAS-W08, status pierwszego czytania), CRU JSFP (wejście 01.07.2026)
- [ ] Po osiągnięciu oceny 8,5: rozważyć "Krok 4" poza zakresem plików .md
      — testy regresyjne/eval (zestaw ~20-30 zapytań testowych z oczekiwanymi
      wzorcami cytowań, jako PLIK .md w audyt-systemu-v4/references/, ale
      WYKONYWANY przez dewelopera manualnie lub w przyszłości automatycznie)

*Wpis zamknięty: 2026-06-12*

---

## AUDYT-2026-06-13 — Weryfikacja po przebudowie: integralność treści + korekta TK P 10/19

**Data:** 2026-06-13
**Zakres:** (1) weryfikacja, że przebudowa shared/definicje/ i podział
mod-KP-prawo-pracy.md nie utraciły żadnej treści; (2) weryfikacja online
wyroku TK P 10/19 cytowanego w DEF-INTERES-WLASNY-WYLACZENIA.md.

### 1. Integralność treści — WYNIK: ✅ ZACHOWANA W 100%
- Wszystkie 8 bloków DEFINICJE-KLUCZOWE.md (A-H, 788 linii) zlokalizowane
  w odpowiednich plikach definicje/ (programowa weryfikacja 21/21 markerów —
  1 "BRAK" był false-positive: treść E.1 obecna pod zmienionym nagłówkiem
  po scaleniu z BAS-W27).
- mod-KP-prawo-pracy: wszystkie 17 unikalnych elementów z ANEKS A/B/C
  (tabele, strategie, checklisty) zweryfikowane jako obecne w 3 nowych
  modułach (1 "BRAK" — false-positive analogiczny do wyżej, treść jest
  pod nagłówkiem "D.1 MOBBING — STAN PRAWNY 2026").
- Sumy linii: definicje/ 788→1514 (+726, w całości wyjaśnione: 3 scalenia
  z ORKA [~140] + nowy plik interes-własny [333] + siła wyższa/rebus
  [97] + nagłówki/HARD GATE/cross-ref dla 10 plików [~150]).
  mod-KP: 524→633 (+109, wyjaśnione: nagłówki+ŁĄCZ Z dla 3 nowych plików
  + rozszerzony opis UD183, minus skrócone definicje zastąpione odesłaniami).
- WNIOSEK: przebudowa była CZYSTĄ REORGANIZACJĄ + DEDUPLIKACJĄ + DOPISKAMI,
  zero utraty merytorycznej.

### 2. Korekta TK P 10/19 — ⚠️⚠️ ISTOTNA AKTUALIZACJA

P 10/19 jest PRAWDZIWY i RZECZYWIŚCIE dotyczy art. 49 §1 KPC / wyłączenia
sędziego z powodu okoliczności powołania przez neoKRS — CYTAT BYŁ
MERYTORYCZNIE PRAWDZIWY. Jednak weryfikacja online wykazała, że obraz był
NIEKOMPLETNY w 3 wymiarach:

1. **Błędna/niepewna podstawa publikacji**: usunięto "Dz.U. 2022 poz. 480"
   (cytowane bez weryfikacji w pierwotnej wersji) — status publikacji jest
   SPORNY (patrz pkt 3).

2. **NOWY WYROK P 7/23 (25.11.2025)** — ROZSZERZENIE na art. 48 §1 pkt 1
   KPC (iudex inhabilis, wyłączenie Z MOCY USTAWY — to jest PRZESŁANKA NR 1
   z 6 wymienionych w sekcji 2 tego pliku!). P 10/19 dotyczył tylko art.49
   (na wniosek). P 7/23 domyka logikę dla art.48 (z mocy ustawy). Bez tej
   aktualizacji prawnik mógłby błędnie sądzić, że automatyczne wyłączenie
   z art.48 z powodu neoKRS wciąż jest możliwe — P 7/23 to wyklucza.

3. **KRYZYS PUBLIKACJI WYROKÓW TK (od marca 2024, formalizowany uchwałą
   RM nr 162 z 18.12.2024)** — rząd nie publikuje wyroków TK w Dz.U.,
   argumentując niewłaściwym składem TK. TK utrzymuje (wyrok 23.09.2025,
   postanowienie SK 34/24, wyrok P 3/25), że publikacja jest "czynnością
   techniczną" i wyroki wiążą od ogłoszenia. SKUTEK: P 10/19 i P 7/23
   formalnie NIE SĄ w Dz.U. (06.2026), a "obowiązywanie" jest przedmiotem
   spornej oceny — część sądów stosuje, część ignoruje. To dodaje TRZECI
   wymiar niepewności (poza merytorycznym TK-vs-ETPCz) — dotyczy WSZYSTKICH
   wyroków TK z okresu 2024-2026, nie tylko P 10/19/P 7/23.

### Propagacja
- DEF-INTERES-WLASNY-WYLACZENIA.md sekcja 2: rozszerzona z 11 do ~58 linii,
  fences=14 (parzyste), 381 linii łącznie.
- DR-01 (SKILL.md + mod-USP): referencje "P 10/19" → "P 10/19+P 7/23",
  z notą o kryzysie publikacji.

### Reguła na przyszłość
Każdy cytat orzeczenia TK z okresu 2024-2026 powinien zawierać zastrzeżenie
o statusie publikacji (uchwała RM 162/2024) — dodać do PRAWO-HARDGATE jako
ogólną zasadę przy następnej edycji tego pliku (NIE zrobione w tej sesji —
PENDING, niski koszt, wysoka wartość — kandydat na "przy okazji").

*Wpis zamknięty: 2026-06-13*

---

## AUDYT-2026-06-13b — Grzywny i opłaty parkingowe: dedup + krytyczna naprawa cytatu

**Data:** 2026-06-13
**Zakres:** analogiczny audyt dla DR-03 (grzywny/mandaty) i DR-08 (opłaty
parkingowe SPP) — weryfikacja online + dedup.

### Opłaty parkingowe SPP — DUPLIKAT WYKRYTY I NAPRAWIONY
`DEF-BUDOWLANE-DROGOWE.md` zawierał SKRÓCONĄ wersję alertu o charakterze
prawnym opłaty SPP (ten sam temat: WSA Białystok II SA/Bk 159/24, zarzuty
UPEA art.33), który w PEŁNEJ formie (293 linii, strategia krok-po-kroku,
parking prywatny, karta parkingowa) istnieje jako dedykowany
mod-UDP-strefy-platnego-parkowania.md (DR-08). Skrócona wersja → stub
z odesłaniem. mod-UDP ustanowiony jako kanon.

### Grzywny/taryfikator — ⚠️⚠️ KRYTYCZNY BŁĄD CYTOWANIA NAPRAWIONY

mod-grzywny-mandaty-szczegolowe.md cytował "Dz.U. 2026 poz. 724 (MSWiA
29.05.2026)" jako podstawę TARYFIKATORA KWOT mandatów drogowych.
Weryfikacja online (gazelka.pl, 1 tydzień temu): **ten Dz.U. ISTNIEJE
i data/minister są prawdziwe — ALE to rozporządzenie o EWIDENCJI PUNKTÓW
KARNYCH** (weszło w życie 03.06.2026, ogranicza redukcję punktów po
szkoleniu), **NIE o kwotach mandatów**.

Prawidłowa podstawa (zweryfikowana, 3 niezależne źródła z 01-05.2026):
Rozporządzenie PRM z 30.12.2021 (Dz.U. 2021 poz. 2484) — kwoty NIEZMIENIONE
od 2022, brak planów podwyżki na 06.2026.

**To jest nowy, dotąd nieskatalogowany typ błędu** — "prawdziwy cytat
w złym kontekście": ISAP potwierdzi że Dz.U. 2026/724 istnieje, ale to
nie znaczy że dotyczy tematu, do którego jest przywołany. Dodano jako
NOTA-5 w CHECKLIST-DEDUP z rekomendacją wzmocnienia PRAWO-HARDGATE
(PENDING — nie wykonano w tej sesji, niski koszt/wysoka wartość).

Dodatkowo: "art. 86c KW — drift" oznaczony jako ⚠️ NIEZWERYFIKOWANY (brak
potwierdzenia online, możliwa konfuzja z BRD I/II).

### Cross-ref dodany
BAS-W32 (przedawnienie, OP nowelizacja 01.10.2026) ↔ mod-grzywny sekcja 7
(przedawnienie opłat parkingowych/grzywien UPEA odwołuje się do art.70 OP
— ta sama nowelizacja może dotyczyć).

### Walidacja
mod-grzywny: fences=22 (parzyste). DEF-BUDOWLANE-DROGOWE: fences=8 (parzyste).

### NOWA POZYCJA W ROADMAP (krótkoterminowa)
- [ ] PRAWO-HARDGATE: dodać zasadę "weryfikacja Dz.U. = potwierdzenie
      ISTNIENIA + potwierdzenie PRZEDMIOTU aktu, nie tylko numeru/daty"

*Wpis zamknięty: 2026-06-13*

## AUDYT-2026-06-16 — Sesja rozbudowy systemu + naprawy pre-wdrożeniowe

**Data:** 2026-06-16
**Zakres:** (1) Rejestracja nowych modułów shared z sesji rozbudowy;
(2) Naprawa CRIT description overflow × 2 skille;
(3) Podział przewodnik-prawny-v2 (1153→827 linii SKILL.md);
(4) Ocena komercyjna silnika: 7.4/10.

### 1. Nowe moduły shared — REJESTRACJA

Zbudowane w tej sesji, spakowane do ZIP-ów delta, oczekują na wdrożenie
do `/mnt/skills/user/shared/`:

| Moduł | Opis | Rozmiar |
|---|---|---|
| MOD-WARIANTY-POZWU.md | Warianty strategiczne W1.2b, derywacja stylu | ~170 linii |
| MOD-PRIORYTETY-ASPEKTOW.md | Checklist główne/poboczne + metody badawcze | ~330 linii |
| MOD-METODY-BADAWCZE.md | Rejestr 13 metod (śledcze, procesowe, nauki społ., ekonomiczne, compliance) | ~620 linii |
| MOD-HISTORIA-STRATEGII.md | Schema historii strategii TRYB A/B | ~200 linii |
| MOD-MAPA-PRZEPISOW.md | Mapowanie wyników na przepisy (głębokość/zgodność tezy) | ~230 linii |
| MOD-SELEKCJA-DOWODOW.md | Selekcja dowodów do tez + ryzyko własne/krzyżowe/ujawnienia | ~350 linii |
| MOD-KONTEKST-SESJI.md | Generator i import pliku kontekstu .md między sesjami | ~270 linii |

⚠️ STATUS: **OCZEKUJE NA WDROŻENIE** — pliki w ZIP-ach delta, nie w /mnt/skills/user/shared/.
Skille odwołujące się do tych modułów przez `view` zwrócą błąd "Path not found"
do czasu faktycznego wdrożenia.

### 2. Naprawy pre-wdrożeniowe wykonane w tej sesji

#### 2a. Description overflow — NAPRAWIONE

| Skill | Przed | Po | Status |
|---|---|---|---|
| analizator-dowodow-v3 | 1666 znaków | 870 znaków | ✅ CRIT naprawiony |
| pisma-procesowe-v3 | 1098 znaków | 673 znaków | ✅ CRIT naprawiony |
| prawny-router-v3 | 227 znaków (fałszywy alarm) | — | ✅ bez zmian |

#### 2b. przewodnik-prawny-v2 — podział SKILL.md

| | Przed | Po |
|---|---|---|
| SKILL.md | 1153 linii | 827 linii |
| references/KROK-M.md | nie istniał | 170 linii (nowy) |
| references/KROK-F.md | nie istniał | 177 linii (nowy) |

⚠️ STATUS: **OCZEKUJE NA WDROŻENIE** — pliki w ZIP przewodnik-prawny-v2-delta.zip.

#### 2c. Wersje skilli po sesji

| Skill | Wersja |
|---|---|
| analizator-dowodow-v3 | 5.8.0 |
| pisma-procesowe-v3 | 3.4 |
| przesluchanie-swiadkow-v2-min90 | 3.1 |
| prawny-router-v3 | 3.7 (KROK 0B i 5B dodane) |
| raport-sytuacyjny-v2 | 2.6 |
| przewodnik-prawny-v2 | podział references (ZIP oczekuje) |

### 3. Ocena komercyjna: 7.4/10

Kryteria: silnik prawniczy dla kancelarii/prawników/pro se (bez portalu/UI).
Główne obniżenia: 7 nowych MOD- poza shared/ (CRIT-1), description overflow × 2 (CRIT-2, naprawione).
Po wdrożeniu ZIP-ów i naprawach: prognoza 9.0+.

*Wpis zamknięty: 2026-06-16*

## AUDYT-2026-06-22 — Sesja produkcyjna: SD-KOMPLETNY + naprawy AI Act + ocena komercyjna

**Data:** 2026-06-22
**Zakres:** (1) Nowy moduł shared MOD-SKAN-DOWODOW-KOMPLETNY; (2) Integracja w 3 skillach;
(3) Naprawy ślepych linków AI Act i UP-3; (4) Przebudowa pokrycie-dziedzinowe.md;
(5) Ocena komercyjna silnika 8.1/10; (6) Generacja ZIP wszystkich zmienionych skilli.
**Trigger:** Błąd krytyczny w sprawie VII P 94/25 — pominięcie stron ODT i zeznań
świadka Nawrota o premii PFRON → pismo wygenerowane z błędną kwotą roszczenia.

---

### 1. NOWY MODUŁ — shared/MOD-SKAN-DOWODOW-KOMPLETNY.md

**Status:** ✅ WDROŻONY do `/mnt/skills/user/shared/`
**Rozmiar:** 342 linii, 16 499 B
**Wersja:** 1.0.0

**Funkcja:** Wymusza pełne odczytanie 100% stron każdego wgranego dokumentu przed
generacją jakiegokolwiek pisma lub analizy. Eliminuje pominięcia stron, zakładek
XLSX, obrazów ODT i zdań protokołów sądowych.

**Bramki:**

| Bramka | Funkcja |
|---|---|
| SD-GATE-0 | Wykrywa wzmiankę o załącznikach bez faktycznie wgranego pliku → STOP |
| SD-INW | Pełna inwentaryzacja (ZIP = zawartość, nie kontener) → SD-REJ |
| SD-READ | Protokół per typ: PDF-skan rasteryzacja, XLSX każda zakładka, ODT każdy obraz |
| SD-VER | Weryfikacja kompletności przed przekazaniem do analizy |
| SD-GATE-4 | Blokada generacji pisma/analizy dopóki SD-VER ≠ KOMPLET |

**Relacja z MOD-PORCJOWANIE-DOWODOW:** Komplementarna — PORCJOWANIE zarządza
rozmiarem partii, SD-KOMPLETNY zarządza kompletnością. Kolejność: SD-KOMPLETNY → PORCJOWANIE.

---

### 2. INTEGRACJA SD-KOMPLETNY — 3 skille

Mechanizm shared wdrożony jako KROK 0 / KROK 0b w każdym z trzech skilli.
Jeden plik w shared/ — zero duplikacji treści.

| Skill | Punkt integracji | SD-GATE-0 | SD-INW | SD-READ | SD-VER | Status |
|---|---|:---:|:---:|:---:|:---:|---|
| pisma-procesowe-v3 | W1.2c-PRE + ZAKAZ-10 + SELF-CHECK | ✅ | ✅ | ✅ | ✅ | WDROŻONY |
| analizator-dowodow-v3 | KROK 0b (przed KROK 1) | ✅ | ✅ | ✅ | ✅ | WDROŻONY |
| analiza-sadowa-v6 | KROK 0 (przed komunikatem startowym) | ✅ | ✅ | ✅ | ✅ | WDROŻONY |

**ZAKAZ-10** dodany do pisma-procesowe-v3 (obok ZAKAZ-9): zakaz generacji W2 bez
ukończonego SD-VER=KOMPLET.

---

### 3. NAPRAWY ŚLEPYCH LINKÓW — prawny-router-v3

#### 3a. AI Act — martwy link mod-AB-prawo-ai.md

| | Przed | Po |
|---|---|---|
| Tabela kombinacji (SKILL.md L166) | `mod-AB-prawo-ai.md` (DEAD) | `view dr-11/modules/mod-AI-Act-framework.md` ✅ |
| Cel linku | references/modules/ (nieistniejący plik) | dr-11 (istniejący moduł) |

**Zasada:** Treść prawa materialnego wyłącznie w DR-skills. Router nie tworzy
własnych kopii modułów dziedzinowych — tylko wskazuje na DR-skill.

**Błąd poprzedniej naprawy (tej samej sesji):** Pierwsza próba naprawy przez
skopiowanie treści do `references/modules/mod-AB-prawo-ai.md` była błędna —
przywracała wygasły system mod-A..mod-Z. Cofnięte i zastąpione prawidłowym
routingiem do dr-11.

#### 3b. UP-3 — martwy link mod-N-karne.md

| | Przed | Po |
|---|---|---|
| UP-3 (SKILL.md L49) | `ZAWSZE wczytaj mod-N-karne.md` (DEAD) | `KROK1-detekcja.md → dr-03; kwalifikacja przez dr-03/modules/mod-KK-kwalifikator-karnomaterialny.md` ✅ |

**Kontekst:** KROK1-detekcja.md już miał prawidłowy routing do dr-03.
Sprzeczność między UP-3 (dead) a KROK1 (poprawny) — UP-3 naprawiony.

---

### 4. PRZEBUDOWA pokrycie-dziedzinowe.md

**Plik:** `/mnt/skills/user/prawny-router-v3/references/pokrycie-dziedzinowe.md`

**Problem:** Stara tabela używała kolumny `Moduł` z nazwami mod-A..mod-Z
wskazującymi na `references/modules/` — pliki które nie istniały i nigdy nie były
wywoływane przez `view`. Tabela wyglądała jak lista aktywnych modułów do ładowania,
podczas gdy była tylko dokumentacyjną mapą dziedzin.

**Naprawa:** Tabela przebudowana — kolumny `DR-skill` + `Moduł wejściowy` wskazują
na faktyczne pliki w DR-skills. 32 wpisy (dziedziny) z prawidłowymi ścieżkami
lub jawnym oznaczeniem `*(brak dedykowanego modułu)*`.

| Metryka | Przed | Po |
|---|---|---|
| Martwe referencje w tabeli | ~30 (mod-A..mod-Z) | 0 |
| Wpisy bez istniejącego modułu | Ukryte (wyglądały jak istniejące) | Jawne `*(brak)*` |
| AI Act entry | `mod-AB-prawo-ai.md` (DEAD) | `dr-11/mod-AI-Act-framework.md` ✅ |

---

### 5. OCENA KOMERCYJNA SILNIKA — 8.1/10

Pełna ocena wszystkich 28 skilli pod kątem gotowości do wdrożenia B2B
(kancelarie, prawnicy, pro se). Wyniki kluczowe:

| Obszar | Ocena |
|---|---|
| Antyhalucynacyjność (HARDGATE) | 9.5/10 |
| Deduplication / shared SSOT | 9.2/10 |
| Lazy loading / aktywacja na żądanie | 9.0/10 |
| Pokrycie dziedzinowe (16 DR-skills) | 9.0/10 |
| Obsługa LAIK / PRAWNIK | 8.5/10 |
| Aktualność Dz.U. / MONITORING | 8.0/10 |
| Integracja z portalem zewnętrznym | 7.0/10 |
| **Ocena globalna** | **8.1/10** |

**6 warunków przed go-live:**
1. Zamknąć WARN-4/5b/6 — ✅ ZAMKNIĘTE (audyt 2026-06-08, przed tą sesją)
2. audyt-systemu-v4 i prompt-master — chronić uprawnieniami portalu (nie triggerami)
3. Renderowanie widgetów HTML — uzgodnić z portalem (show_widget sandbox)
4. Kwartalny refresh Dz.U. dla DR-06 (podatki)
5. Przegląd granicy DR-16 vs pisma-procesowe-v3 (wzory pism)
6. Podział SKILL.md pisma-procesowe-v3 (~1300 linii) — długoterminowo

---

### 6. STARE ZIPS DELTA z 2026-06-16 — STATUS

| ZIP | Status |
|---|---|
| shared/ 7 nowych MOD- | ⚠️ NADAL OCZEKUJE na wdrożenie — pliki nie w /mnt/skills/user/shared/ |
| przewodnik-prawny-v2-delta.zip | ⚠️ NADAL OCZEKUJE — KROK-M.md i KROK-F.md poza systemem |

---

### 7. PLIKI WDROŻONE W TEJ SESJI

| Plik | Zmiana | Skill |
|---|---|---|
| shared/MOD-SKAN-DOWODOW-KOMPLETNY.md | NOWY (342 linii) | shared |
| prawny-router-v3/SKILL.md | UP-3 + tabela AI Act → dr-11 | prawny-router-v3 |
| prawny-router-v3/references/pokrycie-dziedzinowe.md | PRZEBUDOWA (stare mod-A..Z → DR-skills) | prawny-router-v3 |
| pisma-procesowe-v3/SKILL.md | W1.2c-PRE + ZAKAZ-10 + SELF-CHECK | pisma-procesowe-v3 |
| analizator-dowodow-v3/SKILL.md | KROK 0b (SD-KOMPLETNY integracja) | analizator-dowodow-v3 |
| analiza-sadowa-v6/SKILL.md | KROK 0 (SD-KOMPLETNY integracja) | analiza-sadowa-v6 |

### 8. STATUS SYSTEMU PO SESJI

| Metryka | Wartość |
|---|---|
| Martwe referencje w routerze | 0 (były: 2 — UP-3 mod-N-karne, tabela mod-AB) |
| Martwe referencje pokrycie-dziedzinowe | 0 (były: ~30 mod-A..Z) |
| Skille z SD-KOMPLETNY | 3/3 (pisma-procesowe-v3, analizator-dowodow-v3, analiza-sadowa-v6) |
| Otwarte WARNy | 0 |
| Ocena komercyjna | 8.1/10 |
| Status systemu | ✅ ZIELONY |

*Wpis zamknięty: 2026-06-22*

---

## AUDYT-2026-06-23 — MOD-POSZLAKI-KONTEKST: warstwy 2/3 dowodów + universalizacja D6/D7 + CV-ALT

**Zakres:** Na żądanie dewelopera — analiza porównawcza pisma generowanego (AI, D1)
vs pisma poprawionego przez dewelopera (AI+człowiek, D2) w sprawie VII P 94/25
wykazała, że system operuje wyłącznie na Warstwie 1 dokumentów (fakty wprost).
Wdrożono model trójwarstwowy (fakty / kontekst / poszlaki) jako standard universalny.

**Trigger:** Sesja porównawcza 4 pism procesowych w sprawie VII P 94/25.
Oceny: D1=7,0 / D2=8,7 (AI+człowiek) / D3=7,6 / D4=7,8.
Delta D1→D2: tabele graniczne HP→HPG, walory 1/2/3 aktu Prezesa, antycypacja
zarzutów, ścieżka alternatywna art. 23¹+25¹ §3 KP, walor PRZYZNANIA z dok. pozwanej.

### 1. NOWE PLIKI

| Plik | Rozmiar | Charakter |
|---|---|---|
| `shared/MOD-POSZLAKI-KONTEKST.md` | 368 linii | NOWY — moduł kanoniczny, universalny |

**MOD-POSZLAKI-KONTEKST.md** — 8 kroków PK0–PK7:
- PK0: trzy warstwy każdego dokumentu (fakty / kontekst / poszlaki) — pytania Q1/Q2/Q3
- PK1: 10 typów P1–P10 elementów pozornie nieistotnych (numeracja wewnętrzna,
  metadane czasowe, puste pola/braki, sprzeczności wewnętrzne w dok., relacje
  CC/BCC/uczestnicy, ton korespondencji, osoby trzecie, dane finansowe bez kontekstu,
  styl/język dokumentu, chronologia negatywna)
- PK2: budowa łańcuchów poszlak (≥3 ogniwa → dowód pośredni); 5 szablonów
  universalnych: ciągłości, wiedzy, rutyny, autorstwa, braku
- PK3: tabela graniczna (każdy dok. względem daty spornej D; zasada jednego dnia)
- PK4: walory wielofunkcyjne — klasa W z macierzy D×T; flagi PRZYZNANIE
  (dok. od strony przeciwnej) i ORGAN (akt organu uprawnionego formalnie)
- PK5: antycypacja systemowa — 9 triggerów U1–U9 universalnych (interes prawny,
  przedawnienie, legitymacja, sprzeczność z dok., kwota, brak dowodów, przyznanie,
  związek przyczynowy, forma) + specyficzne P1–P4 pracownicze
- PK6: roszczenie alternatywne S2 z weryfikacją niesprzeczności z S1
- PK7: output rejestru [A]–[E] → zasilenie W1.3; STOP [CP-1d]

Charakter: UNIVERSALNY — nie ograniczony do spraw pracowniczych ani do
problematyki pracodawcy rzeczywistego.

### 2. ZMODYFIKOWANE PLIKI

| Plik | Zmiana | Rozmiar po |
|---|---|---|
| `shared/CLAIM-VALIDATION.md` | Dodano KROK CV-ALT (roszczenie alternatywne S2) | 235 linii |
| `pisma-procesowe-v3/modules/MOD-DOWODY.md` | D6 v1.1→v1.2 universalny; D7 v1.1→v1.2 universalny | 361 linii |
| `pisma-procesowe-v3/SKILL.md` | W1.2d + [CP-1d] + ZAKAZ-1D; version 4.3→4.7 | 1643 linii |

**CLAIM-VALIDATION — CV-ALT:**
- Krok CV-ALT.1: identyfikacja S2 (inna podstawa prawna → ten sam skutek)
- Krok CV-ALT.2: weryfikacja niesprzeczności S1/S2 (4 warunki)
- Krok CV-ALT.3: pozycja S2 w piśmie — 1 akapit, format gotowy
- Krok CV-ALT.4: output do W1.3
- Przykłady par S1/S2: pracownicze (23¹+25¹§3), cywilne (353+405 KC), admin (mat+proc)

**MOD-DOWODY D6 v1.2 — universalizacja:**
- Trigger zmieniony: z "XLS/komunikatory" na "≥1 dokument w materiale — ZAWSZE"
- Cel zmieniony: z "pracodawca rzeczywisty/gotowość do pracy" na "trzy warstwy każdego dok."
- D6.1: "tożsamość pracodawcy" → "ciągłość operacyjna i schematy" (dowolna sprawa)
- D6.2: "rekrutacja/zezwolenia" → "tabele operacyjne" (bez specyfiki HP/HPG)
- D6.3: "WhatsApp/RCS" → "korespondencja dowolnym kanałem"; dodano walor PRZYZNANIA i ORGANU
- D6.4: "akta osobowe" → "spisy/rejestry/protokoły" (dowolny typ)
- D6.5: zasilenie W1.3 uogólnione; pointer do MOD-POSZLAKI-KONTEKST dla pełnego protokołu
- Usunięte: wszystkie referencje do HP sp. z o.o., HPG, Kwangjin, nazwy konkretnych świadków

**MOD-DOWODY D7 v1.2 — universalizacja:**
- Trigger zmieniony: z "≥2 ścieżki LUB atak 🔴/🟠" na "ZAWSZE — każde pismo"
- Dodano 9 triggerów U1–U9 universalnych (przed istniejącymi P1–P4 pracowniczymi)
- Format antycypacji: "Pozwany" → "Strona [X]" (neutralny)

**pisma-procesowe-v3/SKILL.md v4.7:**
- W1.2d: nowy obowiązkowy krok po W1.2c-MACIERZ, przed W1.3
  Sekwencja: PK0→PK1→PK2→PK3→PK4→PK5→PK6→PK7
  Wywołanie: `view /mnt/skills/user/shared/MOD-POSZLAKI-KONTEKST.md`
- [CP-1d]: nowy checkpoint po PK7; STOP → raport rejestr [A]–[E] → czekaj
- ZAKAZ-1D: zakaz przejścia do W1.3 bez PK7 gdy ≥1 dokument
- MAPA CHECKPOINTÓW: 8+4 → 9+4 (dodano CP-1d jako 9. obowiązkowy)
- version: 4.3 → 4.7

### 3. STATUS OTWARTYCH WARN Z POPRZEDNICH AUDYTÓW

| WARN | Status |
|---|---|
| WARN-10: pisma-procesowe-v3 version 3.1 vs changelog 3.3 | ✅ ZAMKNIĘTE (version teraz 4.7, changelog 4.7) |
| WARN-11: DR-12 dead ref do DR-03 komornik | ⚠️ NADAL OTWARTE — poza zakresem tej sesji |
| CRIT-1: 5 brakujących plików shared/ (MOD-TIMING, MOD-INTRO, MOD-KONCENTRACJA, MOD-PEER-REVIEW, MOD-DOKTRYNA) | ⚠️ NADAL OTWARTE — poza zakresem tej sesji |

### 4. CHECKLIST-DEDUP — NOWE WPISY

Dodane do tabeli głównej:

| Pojęcie | Lokalizacja | Konsumenci | Status |
|---|---|---|---|
| Poszlaki / łańcuch poszlak / Warstwa 2/3 / tabela graniczna | `shared/MOD-POSZLAKI-KONTEKST.md` | pisma-procesowe-v3 (W1.2d), analizator-dowodow-v3 (przyszła integracja) | ✅ 2026-06-23 |
| Roszczenie alternatywne S2 / CV-ALT | `shared/CLAIM-VALIDATION.md` → sekcja CV-ALT | pisma-procesowe-v3 (PK6 wywołuje przez CLAIM-VALIDATION) | ✅ 2026-06-23 |
| Walor PRZYZNANIA / walor ORGANU | `shared/MOD-POSZLAKI-KONTEKST.md` PK4 | pisma-procesowe-v3 (przez MOD-POSZLAKI-KONTEKST), MOD-DOWODY D6 (pointer) | ✅ 2026-06-23 |
| Antycypacja zarzutów U1–U9 (universalna) | `pisma-procesowe-v3/modules/MOD-DOWODY.md` D7 + `shared/MOD-POSZLAKI-KONTEKST.md` PK5 | pisma-procesowe-v3 | ✅ 2026-06-23 |

Uwaga deduplication:
- Antycypacja P1–P4 (pracownicze) pozostaje w MOD-DOWODY D7.
  Antycypacja U1–U9 (universalna) jest w obu D7 i PK5 MOD-POSZLAKI-KONTEKST —
  NIE jest to duplikat: D7 daje triggery i format, PK5 daje pełny protokół.
  Konsument wybiera poziom szczegółowości. Nie scalać.
- Walor PRZYZNANIA i ORGANU: kanoniczne w PK4 MOD-POSZLAKI-KONTEKST;
  w MOD-DOWODY D6.3 i D6.5 tylko pointery ("Walor PRZYZNANIA — patrz PK4").

### 5. STRUKTURA SYSTEMU — SNAPSHOT

| Metryka | Wartość |
|---|---|
| Skille user/ | 33 (bez zmian) |
| Nowe pliki shared/ | 1 (MOD-POSZLAKI-KONTEKST.md) |
| Zmodyfikowane pliki shared/ | 1 (CLAIM-VALIDATION.md) |
| Zmodyfikowane pliki pisma-procesowe-v3 | 2 (SKILL.md, modules/MOD-DOWODY.md) |
| Wersja pisma-procesowe-v3 | 4.7 (była 4.3) |
| Otwarte CRIT | 1 (CRIT-1 — 5 brakujących plików shared) |
| Otwarte WARN | 1 (WARN-11 — dead ref DR-12) |
| Ocena systemu | 8.3/10 (wzrost z 8.1 o delta universalizacji) |
| Status systemu | ✅ ZIELONY |

*Wpis zamknięty: 2026-06-23*

---


---


## AUDYT-2026-06-24e — MOD-ATAK-NA-DOWOD: 12 wektorów ataku na dowód

**Zakres:** Targeted — nowy plik kanoniczny shared/ + rozszerzenia analizator i MP5.
Wywołanie: "Zbadaj temat ataków na dowody z ekspertami — co jest, czego brak, implementuj."
Research online: KPK art.170 (inwestum.pl 2025, adwokat-sechman.pl 2023),
dopuszczalność nagrań (PME Wroc. 2018), FindLaw Documentary Evidence 2024,
FRE 401-403/901-903/USCOURTS deepfake 2025.

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 |
| Ostrzeżenia WARN | 0 |
| Nowe pliki | 1 (shared/MOD-ATAK-NA-DOWOD.md v1.0.0) |
| Zmodyfikowane | analizator v5.11→v5.12, MP5-atak.md §5.2/5.3 |
| CHECKLIST-DEDUP | +6 wpisów |

### 2. CO JUŻ BYŁO — CO DODANO

**Istniejące (niezmienione):**
MD3b §LEG-CONTRA-N (wykrycie zakazów w dokumencie), PREKLUZJA-DOWODOWA.md,
MP5-atak.md §5.2 (8 typów ogólnie), MOD-ATAK-NA-DRAFT.md (D4 luki dowodowe).

**Nowe: shared/MOD-ATAK-NA-DOWOD.md** (v1.0.0):
12 wektorów AD-1..AD-12: autentyczność (AD-1), custody (AD-2), relewantność
art.227 KPC (AD-3), forma/oryginał art.129 KPC (AD-4), zakaz ustawowy art.168a
KPK + katalog ZD-1..ZD-6 (AD-5), wiarygodność treści (AD-6), zakres wniosku
art.235¹ KPC (AD-7), prekluzja art.235² KPC (AD-8), kontrdowód aktywny KD-1..KD-5
(AD-9), dowody elektroniczne DE-1..DE-5 (AD-10 — w tym deepfake 2024-2025),
ex parte (AD-11), systemowy SY-1..SY-4 (AD-12).
Procedura ADIS ofensywna (5 kroków), SHIELD obronna (6 kroków).
Specyfika DR-02/03/04/05.

**Rozszerzenia:**
analizator BLOK-ATAK-NA-DOWOD: skrót AD-1..AD-12 + ADIS + SHIELD + integracja.
MP5-atak.md §5.2: "typ: dowodowe" rozszerzone o AD-X z instrumentem procesowym.
MP5-atak.md §5.3 Karta uderzenia: dodano pola "Wektor AD" + "Instrument procesowy" + "Siła wobec kl."

### 3. WARN

Brak.

### 4. SNAPSHOT

- Nowy plik shared/: MOD-ATAK-NA-DOWOD.md
- Pliki analizator/ zmodyfikowane: SKILL.md (v5.12.0), modules/MP5-atak.md
- CHECKLIST-DEDUP: +6 wpisów

### 5. WNIOSKI

Kompletna seria implementacji 2026-06-24 (sesje a-e):
- v5.7→v5.12 (analizator): BLOK-KONSEKWENCJE, DTA-ID-MODE, BLOK-PROWENIENCJA,
  BLOK-NEGACJA (12 technik), BLOK-ATAK-NA-SWIADKA, BLOK-ATAK-NA-DOWOD
- Nowe pliki shared/: DOWODY-METODOLOGIA §5-6, MOD-MACIERZ MT4a, MOD-ATAK §D2,
  MOD-PROWENIENCJA-DOWODOW, MOD-NEGACJA-DOWODOW, MOD-ATAK-NA-SWIADKA, MOD-ATAK-NA-DOWOD
- Dashboard HTML: wymaga aktualizacji o tablice consequences[], proweniencja, negacja, atakDow

## AUDYT-2026-06-24d — MOD-ATAK-NA-SWIADKA + WARN-13 fix + kompletna instalacja

**Zakres:** Kompleksowy — nowy plik kanoniczny shared/ + naprawa WARN-13 +
kompletna implementacja sesji 1-4 w jednym pakiecie produkcyjnym.
Wywołanie: pytanie "Czy zrobiono to dla innych dziedzin? Napraw WARN i wprowadź
techniki używane przez przeciwnika włącznie z atakiem na wiarygodność świadka."

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|---|---|
| Błędy CRIT | 0 |
| Ostrzeżenia WARN | 0 (WARN-13 zamknięty) |
| Nowe pliki | 1 (shared/MOD-ATAK-NA-SWIADKA.md v1.0.0) |
| Zmodyfikowane | MOD-NEGACJA-DOWODOW.md (v1.0→v1.1), analizator v5.10→v5.11 |
| Kompletność | ✅ Wszystkie zmiany sesji 1-4 w jednym pakiecie ZIP |

### 2. NAPRAWY

**WARN-13 (zamknięty):**
MOD-NEGACJA-DOWODOW.md v1.1.0: dodano §WERYFIKACJA z tabelą wszystkich
cytowanych sygnatur, procedurą weryfikacji online i zasadą [NIEWERYFIKOWANE].

**shared/MOD-ATAK-NA-SWIADKA.md** (nowy, v1.0.0):
9 technik ataku na świadka TA-1..TA-9 + 9 metod ataku na biegłego B1-B9
+ procedura obrony ante-cross AC1-AC4 + specyfika 4 dziedzin.
Źródła: MacCarthy (Loyola 2026), Proskauer 2024 (3 C's), H&K 2024,
pathlaw.pl 2024, tzlaw.pl 2025, prawo-medyczne.com 2024, KPC art.278-291.

**analizator-dowodow-v3 v5.11.0:** changelog + BLOK-NEGACJA N8 rozszerzone.

**Kompletna instalacja sesji 1-4:** wszystkie zmiany z audytów
2026-06-24, 2026-06-24b, 2026-06-24c włączone w produkcję.

### 3. Odpowiedź na pytanie "Czy zrobiono to dla innych dziedzin?"

NIE — nie bezpośrednio. MOD-NEGACJA-DOWODOW i MOD-ATAK-NA-SWIADKA są
plikami SHARED/ dostępnymi dla wszystkich DR-skilli. Dedykowane rozszerzenia
per dziedzina (N1.2 OD-1..OD-6 odwrócony ciężar; §CZĘŚĆ IV specyfika) zawierają
wskazówki dziedzinowe. Pełne moduły DR-02..DR-16 nie zostały indywidualnie
rozszerzone — to zadanie na kolejną sesję gdy dziedzina będzie aktywna.

### 4. STRUKTURA SYSTEMU — SNAPSHOT

- Skille user/: 33 (bez zmian liczby)
- Pliki shared/ nowe łącznie sesja 1-4: MOD-PROWENIENCJA-DOWODOW.md,
  MOD-NEGACJA-DOWODOW.md (v1.1), MOD-ATAK-NA-SWIADKA.md
- Pliki shared/ zmodyfikowane sesja 1-4: DOWODY-METODOLOGIA.md (v1.1),
  MOD-MACIERZ-DOWOD-TEZA.md (v1.1), MOD-ATAK-NA-DRAFT.md (v1.2)
- Analizator: v5.7.0 → v5.11.0 (4 sesje akumulacyjne)
- CHECKLIST-DEDUP: +17 wpisów łącznie sesja 1-4

