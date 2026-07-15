---
name: pisma-proste-v2
version: 2.1
type: executive-pisma
status: production
description: |
  Skill do szybkiego redagowania pism procesowych o NISKIM stopniu złożoności
  z JEDNYM wątkiem prawnym. Stosuj gdy użytkownik prosi o:
  - wniosek o nadanie klauzuli wykonalności (art. 781–788 KPC)
  - sprzeciw od nakazu zapłaty (art. 503 KPC)
  - zarzuty od nakazu zapłaty (art. 493 KPC)
  - wniosek o wszczęcie egzekucji do komornika
  - wniosek o zabezpieczenie roszczenia (art. 730 KPC)
  - wniosek o zwolnienie od kosztów sądowych (art. 102 §1 KSCU)
  - odpowiedź na zawezwanie do próby ugodowej
  - wniosek o przywrócenie terminu (art. 168 KPC)
  - wniosek o wgląd do akt (art. 9 KPC)
  - pismo z wezwaniem do zapłaty (przedsądowe)
  - wniosek o uzasadnienie wyroku (art. 328¹ KPC)
  - wniosek o doręczenie przez komornika (art. 139¹ KPC)
  - sprzeciw od orzeczenia referendarza sądowego
  - NIE stosuj do pism wielowątkowych (apelacje, pozwy złożone,
    pisma przygotowawcze) — użyj pisma-procesowe-v3
compatibility:
  tools:
    - web_search
    - web_fetch
---

# Skill: Pisma Proste v2 — Architektura Modułowa

## CEL I ZAKRES

Skill obsługuje pisma **jednoinstancyjne jednotemowe** — jedno żądanie, jedna podstawa
prawna, prosta dokumentacja. Czas redagowania: 2–4 minuty. Weryfikacja prawna online
jest skrócona do potwierdzenia aktualności przepisu i ewentualnej opłaty.

> **v2 vs v1:** Wersja v2 wprowadza architekturę modułową — logika i schematy są
> podzielone na oddzielne pliki ładowane tylko gdy są potrzebne. Rdzeń merytoryczny
> pozostaje identyczny z v1.

---

## ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI

> Przed podaniem jakiegokolwiek artykułu, terminu, opłaty lub sygnatury:
> `view /mnt/skills/user/shared/NAZEWNICTWO-STRON.md  ← tabele T1-T10, wzory N1-N7
view /mnt/skills/user/shared/PRAWO-HARDGATE.md`
> Jeśli źródło niedostępne → oznacz `⚠️ [NIEWERYFIKOWANE]`.

---

## ZASADY FUNDAMENTALNE

**Zasada 1 — Jeden wątek, jedno żądanie:**
Pismo ma jeden przedmiot i jedną podstawę prawną. Jeśli sprawa ma więcej wątków
→ przełącz na `pisma-procesowe-v3`.

**Zasada 2 — Weryfikacja przepisu przed użyciem:**
Każdy przywołany artykuł weryfikuj na `isap.sejm.gov.pl` lub `prawo.sejm.gov.pl`.
Podaj pełne oznaczenie przy pierwszym użyciu.

**Zasada 3 — Opłata sądowa zawsze:**
Przy każdym piśmie wszczynającym postępowanie lub wymagającym opłaty —
podaj wysokość opłaty i podstawę jej obliczenia.

**Zasada 4 — Termin zawity najpierw:**
Jeśli pismo dotyczy czynności z terminem zawitym (sprzeciw, zarzuty,
wniosek o uzasadnienie) — wskaż termin NA POCZĄTKU odpowiedzi, przed pismem.

**Zasada 5 — Nigdy z pamięci:**
Nie cytuj przepisów ani orzeczeń z pamięci bez weryfikacji online.

---

## ARCHITEKTURA MODUŁOWA — JAK UŻYWAĆ

### MAPA MODUŁÓW

| Moduł | Plik | Kiedy wczytać |
|-------|------|---------------|
| **M1 — Zasady fundamentalne** | `references/M1-zasady.md` | ZAWSZE przy każdym piśmie |
| **M2 — Intake i identyfikacja** | `references/M2-intake.md` | ZAWSZE na początku — zbieranie danych |
| **M3 — Weryfikacja online** | `references/M3-weryfikacja.md` | Gdy pismo zawiera kwotę, opłatę lub nowelizowany przepis |
| **M4 — Struktura i nagłówek** | `references/M4-struktura.md` | ZAWSZE przy redagowaniu pisma |
| **M5 — Terminy zawite** | view /mnt/skills/user/shared/terminy.md | Gdy pismo ma termin zawity (sprzeciw, zarzuty, uzasadnienie, apelacja) |
| **M6 — Opłaty sądowe** | `references/M6-oplaty.md` | Gdy pismo wymaga opłaty lub pytasz o jej wysokość |
| **M7 — Eskalacja i orzecznictwo** | `references/M7-eskalacja.md` | Gdy sprawa może wymagać pisma-procesowe-v3 lub orzecznictwa |
| **M8 — Lista kontrolna** | `references/M8-checklista.md` | ZAWSZE przed wydaniem gotowego pisma |
| **M-FAKTY — Weryfikacja faktyczna** | *(wbudowana — patrz sekcja poniżej)* | ZAWSZE gdy pismo z dostarczonych dokumentów/akt |
| **M9 — Format odpowiedzi** | `references/M9-format.md` | ZAWSZE przy prezentowaniu gotowego pisma |

### SCHEMATY PISM (ładuj TYLKO odpowiedni schemat)

| Schemat | Plik | Typ pisma |
|---------|------|-----------|
| **SPA — Sprzeciw** | `references/SPA-sprzeciw.md` | Sprzeciw od nakazu zapłaty (art. 503 KPC) |
| **SPB — Zarzuty** | `references/SPB-zarzuty.md` | Zarzuty od nakazu zapłaty (art. 493 KPC) |
| **SPC — Klauzula** | `references/SPC-SPD-SPE.md` → sekcja SPC | Wniosek o nadanie klauzuli wykonalności |
| **SPD — Egzekucja** | `references/SPC-SPD-SPE.md` → sekcja SPD | Wniosek o wszczęcie egzekucji |
| **SPE — Wezwanie** | `references/SPC-SPD-SPE.md` → sekcja SPE | Wezwanie przedsądowe do zapłaty |
| **SPE-O — Ostateczne wezwanie** | `references/SPE-ostateczne.md` | Ostateczne przedsądowe wezwanie do zapłaty po bezskutecznym wcześniejszym wezwaniu albo bezpośrednio przed pozwem |
| **SPF — Uzasadnienie** | `references/SPF-SPG.md` → sekcja SPF | Wniosek o uzasadnienie wyroku |
| **SPG — Zabezpieczenie** | `references/SPF-SPG.md` → sekcja SPG | Wniosek o zabezpieczenie roszczenia |
| **SPH — Inne wnioski** | `references/SPH-inne.md` | Zwolnienie od kosztów, przywrócenie terminu, wgląd do akt, doręczenie przez komornika, sprzeciw od orzeczenia referendarza |
| **SPI — Zawezwanie** | `references/SPI-zawezwanie.md` | Odpowiedź na zawezwanie do próby ugodowej |

---

## ŚCIEŻKA WYKONANIA (obowiązkowa kolejność)

```
KROK 1  → Wczytaj references/M1-zasady.md             [zawsze]
KROK 2  → Wczytaj references/M2-intake.md             [zawsze — ustal typ pisma i dane]
KROK 3  → Wczytaj:
           view /mnt/skills/user/shared/terminy.md            [jeśli pismo ma termin zawity]
KROK 4  → Wczytaj właściwy schemat SPA–SPI albo SPE-O [na podstawie wyniku M2; dla wezwania ostatecznego: references/SPE-ostateczne.md]
KROK 5  → Wczytaj references/M6-oplaty.md             [jeśli pismo wymaga opłaty]
KROK 6  → Wczytaj references/M3-weryfikacja.md        [jeśli kwota/przepis wymaga weryfikacji]
KROK 7  → Wczytaj references/M7-eskalacja.md          [jeśli sprawa może być złożona lub wymaga orzecznictwa]
KROK 8  → Wczytaj references/M4-struktura.md          [zawsze — redagowanie pisma]
KROK 9  → Wczytaj references/M8-checklista.md         [zawsze — przed wydaniem]
KROK 9b → WERYFIKACJA FAKTYCZNA (M-FAKTY)             [zawsze gdy pismo z dostarczonych źródeł]
           Porównaj każde twierdzenie faktyczne z materiałem źródłowym.
           Wyświetl Raport MOD-FAKTY przed oddaniem pisma. (patrz sekcja poniżej)
KROK 9c → Wczytaj:
           view /mnt/skills/user/shared/HYBRID-VALIDATION.md    [zawsze — auto-raport braków]
KROK 10 → Wczytaj references/M9-format.md             [zawsze — prezentacja odpowiedzi]
```

---

## FAZA 0 — INTAKE (zbiorczy)

**Zasada ekonomii:** Nie wczytuj modułów, które nie są potrzebne dla danego pisma.
Np. proste wezwanie do zapłaty bez terminu zawitego → pomijasz M5 i M7.

> ⚠ Pliki modułów przechowywane są w katalogu `references/` względem SKILL.md.
> Ładuj z pełną ścieżką.

**Skan kompletności dokumentów (naprawa F-7/ZASADA 11, 2026-07-15)** — jeśli
użytkownik dostarczył JAKIKOLWIEK dokument (nakaz, tytuł wykonawczy, wyrok,
umowa, korespondencja), wykonaj PRZED weryfikacją twierdzeń poniżej:
> `view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` — zastosuj
> FAZA 1-3 w pełni (SD-GATE-TRUNC, SD-GATE-PORCJA, SD-VER), nawet dla
> jednego krótkiego dokumentu. Przyczyna: pismo proste bazuje zwykle na
> 1 dokumencie źródłowym — błąd w jego odczycie (obcięcie przez `view`,
> fragmentaryczna lektura) przenosi się wprost na CAŁE pismo, bez żadnej
> drugiej szansy na wykrycie w wielodokumentowej korelacji krzyżowej.

**Weryfikacja twierdzeń strony** — wykonaj przed redagowaniem:
> `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`
> Twierdzenie sprzeczne z materiałem → zastąp tym co wynika z dokumentów; poinformuj użytkownika.
> Twierdzenie bez oparcia → oznacz jako lukę; nie umieszczaj w piśmie.

Gdy brakuje danych faktycznych — wczytaj: view /mnt/skills/user/shared/INTAKE-GAP.md:
- **Dane krytyczne** (strony, typ, istota): jedno pytanie zbiorcze
- **Dane uzupełniające**: wstaw `⬛ [UZUPEŁNIJ: opis]` w treść
- **Na żądanie wzoru**: pismo ze wszystkimi polami jako ⬛

Przed redagowaniem ustal (patrz references/M2-intake.md — szczegóły):

```
□ TYP PISMA:    [sprzeciw / klauzula / egzekucja / wezwanie / zawezwanie / inne]
□ SĄD / ORGAN:  [nazwa sądu, wydział, miejscowość]
□ SYGNATURA:    [jeśli dotyczy istniejącego postępowania]
□ STRONY:       [wnioskodawca/powód — imię, nazwisko/firma, adres, PESEL/NIP]
                [pozwany/dłużnik — dane + adres do doręczeń]
□ KWOTA:        [wartość przedmiotu + odsetki + koszty, jeśli dotyczy]
□ PODSTAWA:     [co chcemy uzyskać, co się stało]
□ DATA:         [data zdarzenia / doręczenia tytułu / nakazu / zawezwania]
```

⛔ BLOK POV-B/C — WERYFIKACJA PODMIOTÓW (wykonaj po zebraniu danych, przed KROK 4):
```
[POV-B] SĄD / ORGAN:
  ⛔ ZAKAZ użycia adresu sądu z pamięci modelu.
  → web_search "[pełna nazwa sądu] adres wydział"
  → Potwierdź: pełna nazwa + właściwy wydział + aktualny adres + kod pocztowy
  ✅ [VER: URL, data] lub ⛔ [NIEWERYFIKOWANE — brak dostępu]

[POV-C] POZWANY / DŁUŻNIK (gdy firma / spółka):
  ⛔ ZAKAZ użycia KRS/NIP/adresu z pamięci lub wyłącznie z dokumentów użytkownika.
  → web_search "[nazwa spółki] KRS NIP adres"
  → Potwierdź: firma rejestrowa + KRS + NIP + REGON + adres siedziby + status
  → Gdy rozbieżność identyfikatorów:
    view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md → ISU-1→ISU-5
  ✅ [VER: URL, data] lub ⚠️ [ROZBIEŻNOŚĆ: opis]
```

Jeśli użytkownik nie podał wszystkich danych — zapytaj o brakujące
**jednym pytaniem zbiorczym**. Nie pytaj osobno o każdy element.

---

## KATALOG PISM — SKRÓCONY (pełny w references/M2-intake.md)

| Typ pisma | Termin zawity | Opłata | Schemat |
|-----------|---------------|--------|---------|
| Sprzeciw od nakazu zapłaty (EPU/zwykły) | **14 dni** od doręczenia | brak | SPA |
| Zarzuty od nakazu (postęp. nakazowe) | **7 dni** od doręczenia | 3/4 wpisu (art. 19 §3 KSCU) | SPB |
| Wniosek o nadanie klauzuli | brak | 6 zł / 50 zł (art. 71 KSCU) | SPC |
| Wniosek o wszczęcie egzekucji | brak | brak | SPD |
| Wezwanie przedsądowe do zapłaty | brak | brak | SPE |
| Ostateczne przedsądowe wezwanie do zapłaty | 3–5 dni roboczych wg danych sprawy | brak | SPE-O |
| Wniosek o uzasadnienie wyroku | **7 dni** od ogłoszenia | 100 zł (art. 25b KSCU) | SPF |
| Wniosek o zabezpieczenie | brak | 100 zł (art. 69 §1 KSCU) | SPG |
| Zwolnienie od kosztów / przywrócenie terminu / inne | patrz M5 | patrz M6 | SPH |
| Odpowiedź na zawezwanie do próby ugodowej | **tydzień przed posiedzeniem** | brak | SPI |

---

## TERMINY ZAWITE — CZERWONA LINIA (szczegóły: view /mnt/skills/user/shared/terminy.md)

**Przy każdym piśmie z terminem zawitym (→ view /mnt/skills/user/shared/terminy.md):**
1. Podaj termin **BOLD** na początku odpowiedzi
2. Oblicz datę graniczną od podanej daty doręczenia
3. Podaj liczbę pozostałych dni
4. Jeśli termin bliski (≤3 dni) → komunikat **PILNE — działaj natychmiast**
5. Jeśli termin minął → poinformuj i zaproponuj wniosek o przywrócenie (art. 168 KPC)

### Tabela skrócona — terminy zawite pism prostych

| Czynność | Termin | Skutek uchybienia |
|----------|--------|-------------------|
| Sprzeciw od nakazu (zwykły/EPU) | 14 dni od doręczenia | Nakaz prawomocny |
| Zarzuty od nakazu nakazowego | 7 dni od doręczenia | Nakaz prawomocny |
| Zażalenie | 7 dni od doręczenia postanow. | Postanowienie prawomocne |
| Wniosek o uzasadnienie | 7 dni od ogłoszenia | Utrata prawa do apelacji |
| Apelacja cywilna | 14 dni od doręczenia uzasad. | Wyrok prawomocny |
| Sprzeciw od orzeczenia ref. | 7 dni od doręczenia | Orzeczenie prawomocne |
| Odwołanie od wypowiedzenia (KP) | 21 dni od doręczenia | Utrata roszczenia |
| Przywrócenie terminu | 7 dni od ustania przeszkody | Niedopuszczalność |

*Terminy zawite — pełna tabela z podstawami prawnymi: view /mnt/skills/user/shared/terminy.md*

---

## OPŁATY SĄDOWE — SKRÓCONA (szczegóły w references/M6-oplaty.md)

| Czynność | Opłata | Podstawa |
|----------|--------|----------|
| Sprzeciw od nakazu (w terminie) | brak | art. 503 KPC |
| Zarzuty od nakazu | 3/4 wpisu | art. 19 §3 KSCU |
| Wniosek o wszczęcie egzekucji | brak | art. 797 KPC |
| Wniosek o zabezpieczenie | 100 zł | art. 69 §1 KSCU |
| Wniosek o uzasadnienie wyroku | 100 zł | art. 25b KSCU |
| Wniosek o doręczenie przez komornika | 60 zł | Rozporządzenie MS |\n| Pozew / apelacja do 500 zł | 30 zł | art. 27 pkt 1 KSCU |
| Pozew / apelacja do 1 500 zł | 100 zł | art. 27 pkt 2 KSCU |
| Pozew / apelacja do 4 000 zł | 200 zł | art. 27 pkt 3 KSCU |
| Pozew / apelacja do 7 500 zł | 400 zł | art. 27 pkt 4 KSCU |
| Pozew / apelacja do 15 000 zł | 500 zł | art. 27 pkt 5 KSCU |
| Pozew / apelacja do 20 000 zł | 750 zł | art. 27 pkt 6 KSCU |
| Pozew / apelacja powyżej 20 000 zł | 5% WP (min. 200, max 200 000 zł) | art. 13 §2 KSCU |
| EPU — nakaz zapłaty | 1,25% WP (min. 30 zł) | art. 19 §2b KSCU |
| Odpowiedź na zawezwanie | brak | — |

*Aktualizuj stawki przez weryfikację na isap.sejm.gov.pl — mogą ulec zmianie.*

---

## ORZECZNICTWO I ESKALACJA (szczegóły w references/M7-eskalacja.md)

### Kiedy użyć orzecznictwa (→ orzeczenia-sadowe-v2)

Pisma proste co do zasady **nie wymagają** orzecznictwa. Wywołaj `orzeczenia-sadowe-v2`
tylko w trzech sytuacjach:

```
SYTUACJA A — kwestionujesz zasadność roszczenia (np. przedawnienie)
  → max 1–2 orzeczenia Kat. 1 lub 2, tylko w UZASADNIENIU

SYTUACJA B — strona przeciwna powołała orzecznictwo
  → znajdź orzeczenia obalające jej linię; nigdy bez weryfikacji

SYTUACJA C — niestandardowy stan faktyczny
  → np. kwestionowanie właściwości sądu lub formy doręczenia
```

### Kiedy eskalować do pisma-procesowe-v3 (obowiązkowo)

```
□ Więcej niż jedno żądanie procesowe (nawet jeśli powiązane)
□ Więcej niż jedna podstawa prawna wymagająca analizy
□ Strona złożyła odpowiedź z argumentacją merytoryczną
□ Pismo jest odpowiedzią na argumentację prawną (nie tylko formalną)
□ Konieczna analiza orzecznictwa SN (>2 orzeczenia lub Kat. 3–4)
□ Pismo jest apelacją, skargą kasacyjną, odpowiedzią na pozew
  lub pismem przygotowawczym
□ Wymagane wyważenie kilku konkurujących podstaw prawnych
□ Sprawa dotyczy nieważności czynności prawnej lub jej wzruszenia
```

**Nigdy nie eskaluj bez wyjaśnienia przyczyny** — użyj szablonu z references/M7-eskalacja.md.

---

## FORMAT ODPOWIEDZI (szczegóły w references/M9-format.md)

```
⚠ [ALERT TERMINOWY — tylko jeśli pismo ma termin zawity]
   "Termin do wniesienia [sprzeciwu/zarzutów/wniosku] upływa: [data].
   Pozostało: [X] dni."
   [jeśli ≤3 dni]: PILNE — działaj natychmiast.
   [jeśli minął]: Termin upłynął. Rozważ wniosek o przywrócenie (art. 168 KPC).

📋 DANE DO UZUPEŁNIENIA (tylko jeśli brakuje danych po intake)
   [Lista brakujących danych — jedno pytanie zbiorcze]

─── TREŚĆ PISMA ──────────────────────────────────────────────
[pełna treść gotowa do skopiowania / wysłania]

💡 UWAGI PRAKTYCZNE
   [1–3 krótkie wskazówki dotyczące tego konkretnego pisma]

📎 OPŁATA SĄDOWA
   [kwota i sposób uiszczenia — jeśli dotyczy]

📅 CO DALEJ
   [następny krok po złożeniu pisma]

📋 HYBRID-VALIDATION (zawsze — wczytaj view /mnt/skills/user/shared/HYBRID-VALIDATION.md)
   Auto-raport braków 🔴/🟡/🔵. Użytkownik uzupełnia wybrane → wstaw do pisma.
   Licznik: "Pismo zawiera ⬛ [X] pól do uzupełnienia."
```

---

## LISTA KONTROLNA PRZED WYDANIEM (szczegóły w references/M8-checklista.md)

```
CHECKLISTA FINALNA (pisma proste)
□ TERMIN ZAWITY     Czy nie upłynął? Alert terminowy wyświetlony?
□ DANE STRON        Imię, nazwisko, adres, PESEL/NIP — kompletne?
□ SYGNATURA AKT     Wpisana poprawnie? (lub „—" dla nowego postęp.)
□ PODSTAWA PRAWNA   Zweryfikowana online? Pełne oznaczenie?
□ OPŁATA SĄDOWA     Podana z artykułem KSCU? Sposób uiszczenia?
□ ŻĄDANIE           Jedno? Jasne? W trybie „wnoszę o" / „żądam"?
□ ODPIS             Czy wymagany odpis dla strony przeciwnej?
□ TYTUŁ PISMA       Spójny z treścią? WIELKIE LITERY?
□ PODPIS            Miejsce na podpis lub dane pełnomocnika?
□ ZAŁĄCZNIKI        Wymienione i numerowane?
□ M-FAKTY           Weryfikacja faktyczna wykonana? Raport wyświetlony?
                    Czy pismo powstało z dostarczonych dokumentów? → OBOWIĄZKOWE.
                    Żadna fikcja faktyczna w treści pisma (⛔ = błąd krytyczny)?
□ HYBRID-VALIDATION Uruchomiony? Raport braków wyświetlony? Licznik ⬛ podany?
```

Nie wydawaj pisma jeśli którykolwiek element checklisty nie jest spełniony.

---

## M-FAKTY — WERYFIKACJA ZGODNOŚCI FAKTYCZNEJ (pisma-proste-v2)

**Plik kanoniczny — wczytaj zawsze:**
```
view /mnt/skills/user/shared/FAKTY_v2.md
```

Uruchamiaj zawsze gdy pismo powstaje z dostarczonych przez użytkownika dokumentów,
akt, pism, faktur, wyroków, umów lub opisów słownych przekazanych w konwersacji.
Procedura, klasyfikacja błędów, format raportu i nakazy bezwzględne są w FAKTY_v2.md.

---

*Skill pisma-proste-v2 · Architektura modułowa · v2.2*
*Dla pism wielowątkowych → pisma-procesowe-v3*
*Dla analizy dowodów → analizator-dowodow-v3 · Dla orzecznictwa → orzeczenia-sadowe-v2*

---

## KROK 9d — PROCEDURAL CORE SHARED

Przed oddaniem jakiegokolwiek pisma, nawet prostego, wczytaj i zastosuj:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/FORMAL-CHECK.md
view /mnt/skills/user/shared/BRAKI-FORMALNE.md
view /mnt/skills/user/shared/WARUNKI-SKUTECZNOSCI.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Jeżeli pismo dotyczy terminu, sprzeciwu, zarzutów, uzasadnienia, apelacji, zażalenia albo przywrócenia terminu, dołącz:

```text
view /mnt/skills/user/shared/TERM-CALC.md
```

Jeżeli pismo zawiera dowody lub zarzuty faktyczne, dołącz:

```text
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
```

Pismo proste nie może ominąć walidacji tylko dlatego, że jest krótkie.
