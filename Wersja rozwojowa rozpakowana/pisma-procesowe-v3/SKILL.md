---
name: pisma-procesowe-v3
version: "5.11"
type: executive-pisma
status: production
description: |
  Modularny framework do pism procesowych na poziomie kancelaryjnym.
  Pipeline: W1 (rama + CLAIM-VALIDATION + RED-TEAM) → W1.2d-PRE (MOD-DOKUMENT-ANOMALIE)
  → W2 (projekt + executive summary + timing + doktryna + ATAK-NA-DRAFT) → W3
  (PODMIOT-GATE → ISAP → orzeczenia → fakty → walidacja A–J z triggerami
  → LEGAL-QUALITY-GATE → AUDYT-KONCOWY z COURT-SIMULATION → PEER-REVIEW
  + POST-VALIDATION + UWAGI-REDAKCYJNE) → .docx.
  Engines specjalistyczne z matrycą aktywacji: appellate-v8 (apelacja),
  prosecution-v8 (prokuratura), rebuttal-v9 (riposta), theory-of-case
  (≥2 roszczenia), V10 engines (matryca 4 warunków).
  Poziom: kancelaryjny — każde pismo przechodzi przez 5-etapową kontrolę
  jakości (LEGAL-QUALITY-GATE, AUDYT-KONCOWY, PEER-REVIEW, POST-VALIDATION,
  UWAGI-REDAKCYJNE).
compatibility: "Wymaga narzędzi: web_search, web_fetch"
cp_gate: "/mnt/skills/user/shared/CP-GATE.md"
reread_gate: "MRG — przed każdym [CP] i każdą odpowiedzią pipeline: view CP-GATE.md + view MOD-STEP-TRACKER.md (zakaz polegania na pamięci)"
---

# Pisma Procesowe v3 — Model Trzech Wiadomości

---


## ⛔⛔⛔ HARD GATE ZERO — BEZWZGLĘDNY AUTOMAT STANÓW ⛔⛔⛔

> ⛔ KROK 0 GATE — wczytaj AUTOMAT-STANOW przed routing:
> `view /mnt/skills/user/pisma-procesowe-v3/references/AUTOMAT-STANOW.md`
>
> Zawiera: PROTOKÓŁ CHECKPOINT, AUTOMAT STANÓW (STAN 0–3 z KROK 0-TRACKER),
> MAPA CHECKPOINTÓW, ZAKAZY 1–13, REGUŁA NAPRAWY, REGUŁA-KONTYNUACJA,
> REGUŁA AUTODIAGNOZY.
>
> ⛔ NIE rozpoczynaj pracy bez wczytania AUTOMAT-STANOW.md.
> ⛔ ZAKAZ-12 i ZAKAZ-13 są tam — ich pominięcie = błąd krytyczny.

---

## ⛔⛔⛔ HARD GATE MRG — MANDATORY-REREAD-GATE ⛔⛔⛔

> Ten blok jest WIĄŻĄCY i NADRZĘDNY wobec „pamięci" modelu o treści plików
> oraz wobec chęci szybkiego dostarczenia pisma.
> Powstał po sprawie VII P 94/25: brak ponownego wczytania = brak wiedzy o krokach.
> Cel: przed każdym krokiem [CP] i przed każdą odpowiedzią w pipeline pisma
> stan checkpointów oraz rejestr kroków są odczytywane ze ŚWIEŻEJ wersji z dysku —
> nigdy z pamięci modelu, która może zawierać poprzednią wersję pliku.

```
⛔ MRG-GATE — AKTYWNY OD KROK 0 DO present_files, BEZ WYJĄTKÓW

REGUŁA MRG: Przed KAŻDĄ odpowiedzią w pipeline pisma procesowego ORAZ
przed KAŻDYM krokiem oznaczonym [CP], model MUSI wykonać OBA wywołania:
  1. view /mnt/skills/user/shared/CP-GATE.md
  2. view /mnt/skills/user/shared/MOD-STEP-TRACKER.md
Następnie zaktualizować CP-REJESTR (§2 CP-GATE.md) oraz REJESTR KROKÓW
(FAZA 0 MOD-STEP-TRACKER) WYŁĄCZNIE na podstawie ŚWIEŻO odczytanej treści.

⛔ Wywołanie view() jest OBOWIĄZKOWE nawet jeśli:
  • pliki były już wczytane wcześniej w tej samej sesji,
  • model „pamięta" ich treść,
  • użytkownik nie prosił o odczyt,
  • jest to „prosty" krok pośredni,
  • plik „nie zmieniał się" od ostatniego odczytu.

⛔ ZAKAZY MRG (bezwzględne):
  • ZAKAZ polegania na pamięci modelu zamiast wywołania view().
  • ZAKAZ pominięcia odczytu „bo to ten sam plik co poprzednio".
  • ZAKAZ pominięcia odczytu gdy plik „nie zmieniał się" od ostatniego razu.
  • ZAKAZ zamknięcia jakiegokolwiek [CP] bez uprzedniego podwójnego view().
  • ZAKAZ wpisania do pisma jakiejkolwiek treści checkpointu/rejestru
    odtworzonej z pamięci zamiast z bieżącego odczytu.

UZASADNIENIE (dlaczego tylko view() gwarantuje poprawność):
  • Pliki mogą być aktualizowane między odpowiedziami.
  • Pamięć modelu może zawierać poprzednią wersję pliku.
  • Jedynie view() gwarantuje odczyt aktualnej wersji z dysku.

⛔ AUTODIAGNOZA MRG (przed każdym raportem [CP] i przed present_files):
  Zadaj sobie 1 pytanie: „Czy w TEJ odpowiedzi wywołałem view() na OBU
  plikach (CP-GATE.md + MOD-STEP-TRACKER.md) przed bieżącym [CP]?"
  Jeśli NIE → NIE zamykaj [CP], NIE wywołuj present_files — najpierw OBA view().
```

> Reguła interpretacyjna MRG: „ponowne wczytanie" = fizyczne wywołanie
> narzędzia view() w bieżącej odpowiedzi. Nie jest nim odtworzenie treści
> z pamięci ani odwołanie się do wcześniejszego wczytania w historii rozmowy.
> Lista pozycji [CP] objętych regułą = pełny CP-REJESTR (§2 CP-GATE.md):
> CP-1a, CP-1b, CP-1c-*, CP-PD, CP-1d-*, CP-W1, CP-PRE-W2, CP-ATAK,
> CP-PODMIOT, CP-QUALITY, CP-AUDYT, CP-PEER.

---

## ⛔⛔⛔ HARD GATE STEP-DISCLOSURE — INFORMACJA WARUNKOWA ⛔⛔⛔

> Ten blok jest WIĄŻĄCY i NADRZĘDNY wobec chęci szybkiego dostarczenia pisma.
> Powstał po sprawie VII P 94/25 (2026-06-24), w której pismo zostało wydane
> z pominięciem kilkunastu kroków kontroli jakości — BEZ poinformowania użytkownika.
> Cel: każde pominięcie lub krok jeszcze-do-zrobienia MUSI być ujawniony, zanim
> użytkownik dostanie plik. Żaden krok nie może zostać „cicho" przeskoczony.

```
⛔ SD-GATE — AKTYWNY OD STARTU DO present_files, BEZ WYJĄTKÓW

KROK A — ST-INIT (na starcie, raz):
  view /mnt/skills/user/shared/MOD-STEP-TRACKER.md → zainicjuj REJESTR kroków.
  Każdy krok pipeline = jeden wpis ze statusem: ○ OCZEKUJE.

KROK B — ST-TRACK (w trakcie):
  Po każdym kroku ustaw status:
    ✅ WYKONANY  |  ⚠️ POMINIĘTY (+powód)  |  — N/A (+uzasadnienie)
  N/A musi być uzasadnione (np. „brak dowodów pośrednich" dla MOD-LANCUCH).

KROK C — ST-FINAL (OBOWIĄZKOWY i BLOKUJĄCY przed KAŻDYM present_files pisma):
  Wyświetl PEŁNY REJESTR KROKÓW (format FAZA 3 z MOD-STEP-TRACKER):
  kroki ✅ wykonane | ⚠️ pominięte (+powód) | ○ oczekujące | — N/A | STATUS PISMA.

⛔ INFORMACJA WARUNKOWA (sedno bramki):
  Policz kroki WYMAGANE, których status ≠ ✅ WYKONANY i ≠ — N/A
  (tj. wszystkie ⚠️ POMINIĘTY oraz ○ OCZEKUJE).

  • Jeśli liczba = 0:
       STATUS PISMA = ✅ FINAL — GOTOWE DO ZŁOŻENIA.
       Dozwolone present_files bez dalszych pytań.

  • Jeśli liczba ≥ 1  →  WARUNEK SPEŁNIONY → URUCHOM INFORMACJĘ WARUNKOWĄ:
       1) STATUS PISMA = ⚠️ DRAFT — NIEZWERYFIKOWANY (X krok(ów) pominięto/do zrobienia).
       2) .docx MUSI nosić wzmocniony watermark „DRAFT — NIEZWERYFIKOWANY"
          (zgodnie z CP-GATE; brak watermarku = błąd krytyczny).
       3) Wyświetl blok ujawnienia:

          ┌─────────────────────────────────────────────────────────────┐
          │ ⚠️ INFORMACJA WARUNKOWA — PISMO NIEPEŁNE                      │
          │                                                             │
          │ Kroki pominięte lub jeszcze do wykonania:                   │
          │  ⚠️/○ [ID] [nazwa] — [powód / co to weryfikuje]            │
          │  ...                                                        │
          │                                                             │
          │ Skutek dla jakości pisma:                                   │
          │  → [czego nie sprawdzono / jakie ryzyko procesowe]          │
          │                                                             │
          │ Decyzja:                                                    │
          │  a) Akceptuję pismo jako DRAFT (bez tych kroków)            │
          │  b) Wykonaj brakujące kroki przed dostarczeniem (zalecane)  │
          └─────────────────────────────────────────────────────────────┘

       4) ⛔ ZAKOŃCZ ODPOWIEDŹ. Czekaj na decyzję a/b.
          - „a"/„tak"  → present_files z plikiem DRAFT — NIEZWERYFIKOWANY.
          - „b"/„nie" → wykonaj brakujące kroki, potem ponów ST-FINAL.

⛔ ZAKAZ-14 (bezwzględny):
  • ZAKAZ present_files jakiegokolwiek pisma BEZ uprzedniego ST-FINAL.
  • ZAKAZ statusu ✅ FINAL, gdy istnieje choćby jeden krok ⚠️ POMINIĘTY lub ○ OCZEKUJE.
  • ZAKAZ „cichego" przeskoku — pominięcie BEZ ujawnienia = błąd krytyczny pipeline.
  • Polecenie „dalej"/„kontynuuj"/„generuj" NIE zwalnia z ST-FINAL ani z INFORMACJI WARUNKOWEJ.

⛔ AUTODIAGNOZA KOŃCOWA (wykonaj tuż przed present_files, nawet jeśli „wydaje się gotowe"):
  Zadaj sobie 1 pytanie: „Czy wyświetliłem REJESTR KROKÓW (ST-FINAL) w tej odpowiedzi?"
  Jeśli NIE → NIE wywołuj present_files. Najpierw ST-FINAL.
```

> Reguła interpretacyjna: „informacja warunkowa" = informacja, której wyświetlenie
> jest WARUNKOWANE istnieniem ≥1 kroku pominiętego/oczekującego. Warunek spełniony →
> informacja OBOWIĄZKOWA + STOP. Warunek niespełniony → pismo FINAL, bez pytań.

---

## ⛔⛔⛔ HARD GATE WARUNKOWY — AKCEPTACJA STARTU + WCZYTANIE CHECKLISTY ⛔⛔⛔

> Ten blok wykonuje się JEDNORAZOWO — na samym początku każdej sesji z tym skillem,
> przed jakimkolwiek działaniem merytorycznym (przed Test A / Test B / Test C).
> Jest WIĄŻĄCY i nie może być pominięty nawet gdy użytkownik podał już wszystkie dane.
>
> Cel: użytkownik ZAWSZE wie, że (a) pipeline ma wiele etapów, (b) nie wszystkie
> mogły zostać wykonane w przeszłości lub mogą zostać pominięte w tej sesji,
> (c) każde pominięcie będzie jawne — nigdy ciche.

```
⛔ CG-GATE (CONDITIONAL GATE) — WYKONAJ JAKO ABSOLUTNIE PIERWSZY KROK

KROK CG-1 — INFORMACJA WSTĘPNA (wyświetl użytkownikowi przed startem):

  ┌─────────────────────────────────────────────────────────────────────────┐
  │ ⚠️ INFORMACJA PRZED STARTEM — PISMA PROCESOWE v3                        │
  │                                                                         │
  │ Ten skill realizuje wieloetapowy pipeline kancelaryjny (W1 → W2 → W3)  │
  │ z kilkunastoma obowiązkowymi krokami kontroli jakości.                  │
  │                                                                         │
  │ Ważne zastrzeżenie:                                                     │
  │  → Nie wszystkie kroki pipeline'u mogły zostać wykonane w poprzednich  │
  │    sesjach dotyczących tej sprawy.                                      │
  │  → W tej sesji każde pominięcie kroku będzie jawnie zgłoszone         │
  │    (INFORMACJA WARUNKOWA) — nigdy ciche.                               │
  │  → Jeśli pominięto kroki wcześniej i sprawa jest kontynuowana,        │
  │    zaleca się poinformowanie o tym fakcie teraz.                       │
  │                                                                         │
  │ Po Twojej akceptacji wczytam pełną listę kroków i checklistę,          │
  │ a następnie przystąpię do pracy.                                        │
  │                                                                         │
  │ Czy akceptujesz powyższe warunki i chcesz kontynuować?                 │
  │  a) Tak, akceptuję — wczytaj checklistę i rozpocznij                   │
  │  b) Nie — zakończ lub wyjaśnij wątpliwości                             │
  └─────────────────────────────────────────────────────────────────────────┘

  ⛔ ZAKOŃCZ ODPOWIEDŹ PO WYŚWIETLENIU CG-1. Czekaj na decyzję a/b.
  ⛔ NIE wykonuj żadnego kroku merytorycznego przed akceptacją.

KROK CG-2 — PO OTRZYMANIU AKCEPTACJI „a" (WCZYTANIE CHECKLISTY):

  Wykonaj WSZYSTKIE poniższe view() w podanej kolejności:

  1. view /mnt/skills/user/pisma-procesowe-v3/references/AUTOMAT-STANOW.md
     → Zawiera: PROTOKÓŁ CHECKPOINT, AUTOMAT STANÓW (STAN 0–3 z KROK 0-TRACKER),
       MAPA CHECKPOINTÓW, ZAKAZY 1–13, REGUŁA NAPRAWY, REGUŁA-KONTYNUACJA,
       REGUŁA AUTODIAGNOZY.

  2. view /mnt/skills/user/pisma-procesowe-v3/references/SELF-CHECK-PISMA.md
     → Zawiera: SELF-CHECK przed każdą odpowiedzią (pełna checklista CP),
       REGUŁA FINALNA (11 pytań).

  3. view /mnt/skills/user/pisma-procesowe-v3/references/MODULY-MAPA.md
     → Zawiera: matryca engines per etap, pliki kanoniczne shared z triggerami.

  Po wczytaniu — wyświetl użytkownikowi REJESTR KROKÓW (format ST-INIT):

  ┌─────────────────────────────────────────────────────────────────────────┐
  │ ✅ CHECKLIST WCZYTANA — PIPELINE AKTYWNY                                │
  │                                                                         │
  │ Kroki pipeline (status startowy):                                       │
  │  ○ KROK 0: CP-GATE + STEP-TRACKER (inicjalizacja)                      │
  │  ○ Test A / Test B / Test C (routing)                                   │
  │  ○ W1: CLAIM-VALIDATION [CP-1a]                                         │
  │  ○ W1: MOD-STRATEGIA-WYBOR [CP-1b] (gdy ≥2 ścieżki)                   │
  │  ○ W1: SKAN DOWODÓW / MACIERZ / ŁAŃCUCH [CP-1c-*]                     │
  │  ○ W1: MOD-DOKUMENT-ANOMALIE / MOD-POSZLAKI [CP-1d-*]                  │
  │  ○ W1: RAMA + STRATEGIA [CP-W1]                                         │
  │  ○ PRE-W2-GATE [CP-PRE-W2]                                              │
  │  ○ W2: PROJEKT PISMA + ATAK-NA-DRAFT [CP-ATAK]                         │
  │  ○ W3: PODMIOT-GATE [CP-PODMIOT]                                        │
  │  ○ W3: WERYFIKACJA + WALIDACJA [CP-QUALITY]                             │
  │  ○ W3: AUDYT-KOŃCOWY [CP-AUDYT]                                         │
  │  ○ W3: PEER-REVIEW + POST-VALIDATION [CP-PEER]                          │
  │                                                                         │
  │ Zastrzeżenie: nie wszystkie kroki muszą być wymagane w Twojej sprawie  │
  │ (N/A z uzasadnieniem). Każde pominięcie będzie jawnie zgłoszone.       │
  │                                                                         │
  │ Teraz przystępuję do KROKU 0 — routing.                                │
  └─────────────────────────────────────────────────────────────────────────┘

  Następnie wykonaj KROK 0 (CP-GATE → STEP-TRACKER → routing Test A/B/C).

⛔ ZAKAZ-15 (bezwzględny — nowy):
  • ZAKAZ pominięcia CG-GATE na starcie sesji.
  • ZAKAZ rozpoczęcia jakiegokolwiek kroku merytorycznego bez akceptacji „a".
  • ZAKAZ wczytania checklisty bez wyświetlenia najpierw bloku INFORMACJA WSTĘPNA.
  • Polecenie „zacznij pismo" / „pisz" / „generuj od razu" NIE zwalnia z CG-GATE.
```

> Wyjątek od CG-GATE: gdy użytkownik w tej samej wiadomości co trigger pisma
> explicite napisał „pomijam informację wstępną, znam pipeline" lub podobny
> jednoznaczny sygnał świadomości — CG-1 można zastąpić jednolinijkowym
> potwierdzeniem wczytania checklisty i natychmiast wykonać CG-2.
> Bez takiego sygnału: zawsze pełny CG-1 + czekanie na odpowiedź.

---

## ZASADA GŁÓWNA — MODEL TRZECH WIADOMOŚCI

Każde pismo procesowe powstaje w trzech izolowanych wiadomościach. Żadna nie może być pominięta. Żadna nie może być połączona z inną.

```
W1 — RAMA I STRATEGIA
     Co dowodzimy, czym, jakie przepisy (lista robocza ⚠️ nieweryfikowane)
     → checkpoint: użytkownik zatwierdza ramę przed redakcją
     → STOP po W1 — czekaj na odpowiedź użytkownika

W2 — PROJEKT PISMA
     Pełna redakcja procesowa. Przepisy jako ⚠️[WERYFIKACJA W3].
     Sygnatury orzeczeń: ZAKAZ — tylko placeholder [ORZECZENIE: opis → W3]
     → STOP po W2 — nie pytaj użytkownika, przejdź do W3 automatycznie

W3 — WERYFIKACJA ZE ŹRÓDEŁ + WALIDACJA
     web_fetch dla każdego ⚠️ → zamknięcie przez zweryfikowane cytaty z ISAP
     web_fetch dla każdego [ORZECZENIE] → sygnatura + teza + URL ze źródła
     MOD-WALIDACJA (bloki A–I) → raport formalny
     Pismo finalne z pełnymi oznaczeniami Dz.U.
     → .docx generowany WYŁĄCZNIE po zamknięciu W3
```

> ZASADA IZOLACJI: W2 NIE MOŻE zawierać żadnego pełnego oznaczenia Dz.U. ani żadnej sygnatury orzeczenia.
> Każde takie wstawienie w W2 jest błędem krytycznym — przepis nieweryfikowany = przepis nieistniejący.

---

## KROK 0 — ROUTING (wykonaj przed uruchomieniem modelu)

> Kolejność wykonania: Test A → Test B → Test C. Test A ma priorytet —
> jeśli dotyczy, pomija pozostałe testy.

### Test A — Czy to redakcja istniejącego pisma (nie tworzenie nowego)?

```
TAK, gdy WSZYSTKIE są prawdą:
  ✓ Użytkownik dostarczył treść GOTOWEGO pisma (wklejona / plik)
  ✓ Żądanie dotyczy formy/stylu/długości/tonu, nie nowej argumentacji
  ✓ Nie proszono o dodanie nowych przepisów/orzeczeń/zarzutów

Sygnały: "popraw to pismo", "zredaguj", "skróć", "wzmocnij ton", "przeredaguj
na bardziej stanowczy/neutralny/negocjacyjny", "wygładź styl", "sprawdź i
popraw" (po raporcie z KROK F przewodnika).

→ TAK: przejdź do `modules/MOD-REDAKCJA.md` — NIE wykonuj W1-W2-W3, NIE
  sprawdzaj Testu B/C.
→ NIE: przejdź do Testu B.

Test A ma priorytet — jeśli użytkownik dostarczył gotowe pismo i prosi
o poprawki formy, nie kwalifikuj tego jako "pismo proste" (Test B) ani
nie uruchamiaj W1 (Test C) — to są ścieżki dla pism PISANYCH OD ZERA.
```

### Test B — Czy to pismo proste?

Pismo proste = spełnia WSZYSTKIE trzy warunki:
1. Jedno żądanie procesowe
2. Jedna podstawa prawna (nie wymaga analizy wielowątkowej)
3. Należy do katalogu: sprzeciw od nakazu (art. 503 KPC), zarzuty od nakazu
   (art. 493 KPC), wniosek o klauzulę (art. 781 KPC), wniosek o wszczęcie
   egzekucji (art. 797 KPC), zabezpieczenie (art. 730 KPC), zwolnienie od kosztów
   (art. 102 KSCU), uzasadnienie wyroku (art. 328¹ KPC), przywrócenie terminu
   (art. 168 KPC), wezwanie przedsądowe (art. 455 KC), wgląd do akt (art. 9 KPC),
   doręczenie przez komornika (art. 139¹ KPC), sprzeciw od orzeczenia referendarza
   (art. 398²² KPC).

→ TAK na wszystkie 3: zaproponuj `pisma-proste-v2` i zapytaj użytkownika.
→ NIE na którykolwiek: przejdź do Testu C i kontynuuj model trzech wiadomości.

### Test C — Intake (dane minimalne)

Przed W1 ustal minimum — brakujące dane = jedno pytanie zbiorcze:

```
□ TYP PISMA:    [pozew / apelacja / sprzeciw / wniosek / riposta / zawiadomienie]
□ DZIEDZINA:    [cywilna / pracownicza / karna / administracyjna / gospodarcza]
□ STRONY:       [powód/wnioskodawca + pozwany/uczestnik]
□ ETAP:         [nowa sprawa / sprawa w toku — sygnatura: ___]
□ CEL:          [co osiągnąć tym pismem]
□ MATERIAŁY:    [czy użytkownik dostarczył dokumenty/akta — TAK/NIE]
```

Po uzyskaniu danych stron — oznacz każdy podmiot prowadzący działalność jako ⚠️POD.
Weryfikacja ⚠️POD następuje w W3.0 (PODMIOT-GATE). W W1 i W2 stosuj dane
dostarczone przez użytkownika z adnotacją ⚠️POD — nigdy nie wpisuj danych
rejestrowych z pamięci (NIP, KRS, REGON, adres, skład zarządu).

Gdy brak danych: view /mnt/skills/user/shared/INTAKE-GAP.md

---

## WIADOMOŚĆ 1 — RAMA I STRATEGIA

> ⛔ HARD GATE W1:
> NIE redaguj treści pisma w tej wiadomości.
> NIE podawaj pełnych numerów Dz.U.
> NIE podawaj sygnatur orzeczeń.
> Po ukończeniu W1 — ZATRZYMAJ SIĘ i czekaj na zatwierdzenie przez użytkownika.
> Przejście do W2 wymaga wyraźnej zgody: "tak" / "dalej" / "redaguj" / "ok".

> Cel W1: ustalić co dowodzimy, czym, i jakie przepisy będą potrzebne (lista robocza).

### W1.1 — Typ i tryb pisma

```
TYP PISMA:      [nazwa]
SĄD / ORGAN:    [nazwa — właściwość orientacyjna, weryfikacja w W3]
TRYB:           [uproszczony / zwykły / nakazowy / KPA / PPSA]
OPŁATA:         orientacyjna [kwota ⚠️ — weryfikacja w W3]
TERMIN ZAWITY:  [data lub "brak" — weryfikacja w W3]
```

### W1.2 — Teza centralna

Jedno zdanie:
```
"Dowodzimy że [X], co skutkuje [Y], na podstawie [dziedzina prawa]."
```

### W1.2a — CLAIM-VALIDATION (przed mapą przesłanek)

> ⛔ OBOWIĄZKOWE — wykonaj przed W1.3. Pomiń tylko gdy pismo nie zawiera
> żadnych twierdzeń faktycznych strony (praktycznie: nigdy).
> Wywołaj: `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`

Przed zbudowaniem mapy przesłanka → dowód wykonaj weryfikację twierdzeń strony:

- Dla każdego twierdzenia faktycznego z opisu sprawy i dostarczonych dokumentów
  wykonaj kroki C1–C4 z MOD-CLAIM-VALIDATION.
- Twierdzenie `[⛔ SPRZECZNE]` → zastąp twierdzeniem wynikającym z materiału; poinformuj użytkownika.
- Twierdzenie `[⛔ NIEUDOWODNIONE]` → oznacz jako lukę; nie buduj na nim przesłanki;
  wpisz do W1.5 jako ⬛ BRAK ISTOTNY lub BRAK KRYTYCZNY zależnie od wagi.
- Wyświetl Raport Walidacji Twierdzeń jeśli wykryto błędy.

> Engines specjalistyczne — wywołaj PRZED W1.2 gdy aktywne (patrz MODUŁY-MAPA):
> ```
> view references/engines/theory-of-case-engine.md      (≥2 roszczenia / apelacja)
> view references/engines/appellate-engine-v8.md        (⛔ obowiązkowy przy apelacji)
> view references/engines/rebuttal-drafting-engine-v9.md (riposta / odpowiedź)
> view references/engines/prosecution-complaint-engine-v8.md (⛔ obowiązkowy: zażalenie do prokuratury)
> view references/engines/opponent-pleading-attack-engine-v9.md (analiza pisma przeciwnika)
> ```

### W1.2a-POST — ELIMINACJA TEZ I WERYFIKACJA PRZEPISÓW (obowiązkowe po CLAIM-VALIDATION)

> ⛔ OBOWIĄZKOWE — wykonaj po CLAIM-VALIDATION (W1.2a) per każde żądanie.
> Wypełnia lukę systemową: CLAIM-VALIDATION sprawdza twierdzenia vs fakty;
> PRAWO-HARDGATE sprawdza przepis przed cytowaniem;
> TEN KROK sprawdza czy przepis DOTYCZY tej sytuacji i czy żądanie ma podstawę.

```
KROK ET: Eliminacja tez i weryfikacja przepisów
  view /mnt/skills/user/shared/MOD-ELIMINACJA-TEZ.md

  Per każde żądanie z petitum:
  → ET-Q1: Czy istnieje przepis który to żądanie PRZEWIDUJE? (ISAP)
  → ET-Q2: Czy PRZESŁANKI przepisu są spełnione przez fakty F-nn?
           (subsumpcja — per każda przesłanka osobno)
  → ET-Q3: Czy przepisy z materiału dowodowego są PRAWIDŁOWE?
           (nie przepisuj — weryfikuj samodzielnie)
  → Raport ET-4: ZATWIERDZONE / EWENTUALNE / WYELIMINOWANE

  WYNIK:
  ✅ ZATWIERDZONE → wchodzą do W1.3 i petitum
  ⚠️ EWENTUALNE  → wchodzą jako "ewentualnie" + CV-ALT
  ⛔ WYELIMINOWANE → NIE wchodzą do petitum ani uzasadnienia
```

### W1.2c-PRE — KARTY DOWODOWE I ŁAŃCUCHY (gdy ≥2 dokumenty dostarczone)

> ⛔ OBOWIĄZKOWE gdy użytkownik dostarczył ≥2 dokumenty.
> Wykonaj PO SD-SKAN, PRZED W1.2b i PRZED W1.3.
>
> DIAGNOZA DLACZEGO ŁAŃCUCHY NIE BYŁY UŻYWANE (naprawione 2026-06-25):
> MOD-LANCUCH-DOWODOWY istniał ale nie był wywołany w pipeline.
> Brak MOD-KARTA-DOWODU powodował że system produkował LISTY, nie GRAFY.

### W1.2c-FSL-D — FACT-SOURCE-LOCK DOKUMENTÓW (⛔ OBOWIĄZKOWE — wykonaj PRZED KROK KD)

> ⛔ HARD GATE — wykonaj natychmiast po SD-VER = KOMPLET, PRZED jakąkolwiek
> pracą na macierzy lub kartach dowodowych.
>
> DIAGNOZA DLACZEGO FSL-D JEST KONIECZNE (sprawa VII P 94/25, 2026-06-27):
> Po SD-VER (wszystkie pliki odczytane ✅) model budował macierz D×T z PAMIĘCI
> zamiast z per-teza przeszukania SD-FAKTY. Skutek: teza gotowości do pracy
> miała 1 dowód zamiast 4. Teza pracodawcy faktycznego — argumenty ogólne
> zamiast konkretnych wierszy XLSX i zrzutów ekranu. Nazwa pliku (Szef.odt,
> Zatrudnienie.odt) myląca — model pomijał pliki bo „intuicyjnie nie pasowały".
>
> FSL-D WYMUSZA: per każdą tezę → przeszukanie WSZYSTKICH D[id] z SD-REJ →
> każde twierdzenie atomowe musi mieć D[id] + lokalizację z SD-FAKTY (nie z pamięci).

```
⛔ KROK FSL-D: Fact-Source-Lock Dokumentów
  view /mnt/skills/user/shared/MOD-FSL-DOKUMENTY.md

  Sekwencja FSL-D (wykonaj w tej kolejności):

  FSL-D-INIT:
    1. Pobierz listę tez T1..Tn z CLAIM-VALIDATION (W1.2a)
    2. Pobierz SD-REJ (D01..D[N]) z MOD-SKAN-DOWODOW-KOMPLETNY
    3. Zbuduj pustą FSL-D-MACIERZ: T[n] × twierdzenia atomowe

  FSL-D-SCAN (per KAŻDA teza T[n], po kolei):
    A. Rozłóż T[n] na twierdzenia atomowe TC[n,1]..TC[n,k]
    B. Per KAŻDE TC[n,k]: przeszukaj WSZYSTKIE D[id] z SD-REJ
       ⛔ ZAKAZ CYTOWANIA Z PAMIĘCI: wracaj do SD-FAKTY[D[id]], nie do
          odtworzenia z kontekstu konwersacji
       ⛔ ZAKAZ WNIOSKOWANIA Z NAZWY PLIKU: przeszukuj każdy D[id]
          niezależnie od tego czy jego nazwa „pasuje" do tezy
    C. Klasyfikuj: ✅ POTWIERDZONE / ⚠️ POŚREDNIE / ⬛ FSL-D-LUKA (🔴/🟠/🟡)
    D. Wpisz do FSL-D-MACIERZ: TC[n,k] → D[id], lok.[strona/zakładka/obraz/godz.],
       treść wyekstrahowana z SD-FAKTY (nie parafrazowana z pamięci)

  FSL-D-ORPHAN:
    Po skanowaniu wszystkich T[n]: czy jest D[id] z 0 przypisań do tez?
    → TAK: sprawdź czy zawiera fakty na nową tezę T_new → zaproponuj użytkownikowi
    → NIE: FSL-D-NEUTRALNY

  FSL-D-REPORT:
    Wyświetl raport z FSL-D-MACIERZ (wg formatu z MOD-FSL-DOKUMENTY.md)
    Policz: ✅ potwierdzone / ⚠️ pośrednie / ⬛ luki per klasa (🔴/🟠/🟡)

  Rozgałęzienie:
    ⬛ FSL-D-LUKA 🔴 → ⛔ STOP: zadaj PYTANIA FSL-D; czekaj na decyzję a/b/c/d
    ⬛ FSL-D-LUKA 🟠 → kontynuuj, ale w piśmie: żądanie ewentualne + UWAGI REDAKCYJNE
    ⬛ FSL-D-LUKA 🟡 → notacja w raporcie; nie blokuje
    brak luk 🔴/🟠 → przejdź do KROK KD (karty dowodowe)

  ⛔ ZAKAZ-FSL-D: NIE przystępuj do KROK KD ani KROK ŁD ani KROK MT
     dopóki FSL-D-REPORT nie jest wyświetlony i luki 🔴 nie są rozwiązane.
     Naruszenie = błąd krytyczny pipeline — równoważny pominięciu CLAIM-VALIDATION.
```

```
KROK KD: Wypełnij karty dowodowe i rejestr faktów
  view /mnt/skills/user/shared/MOD-KARTA-DOWODU.md
  → Per każdy D[nn] ze SD-FAKTY: wypełnij KD-1 (karta dowodowa)
  → Zbuduj KD-2 (rejestr faktów F-nn z pewnością i źródłem)
  → Narysuj KD-3 (graf relacji dowód→fakt→teza per teza)

KROK ŁD: Zbuduj łańcuchy dowodowe z kart
  view /mnt/skills/user/shared/MOD-LANCUCH-DOWODOWY.md
  → Per każda teza T-X: wykonaj ŁD-1..ŁD-7
  → Ogniwa łańcucha = fakty F-nn z rejestru (nie lista plików)
  → BRAMKA EQG (ŁB-5): wyklucz ogniwa szkodliwe
  → Scoring ★-★★★★★ per teza główna
  → OUTPUT łańcucha ŁD-XX → wejście do W1.3

KROK MT: Macierz Dowód × Teza (⛔ OBOWIĄZKOWE gdy ≥2 dowody i ≥2 tezy)
  view /mnt/skills/user/shared/MOD-MACIERZ-DOWOD-TEZA.md
  → MT1: inwentaryzacja — lista T1..Tn z przesłankami + lista D1..Dm z kategorią A/B/C/D
  → MT2: skan dwukierunkowy (A: każdy dowód → wszystkie tezy; B: każda teza → pokrycie przesłanek)
  → MT3: klasyfikacja powiązań: [K] KLUCZOWY / [W] WIELOFUNKCYJNY / [R] REDUNDANTNY / [RK] RYZYKOWNY
  → MT4: raport — tabela D×T, pokrycie tez (%), luki KRYTYCZNE/ISTOTNE, decyzje RK
  → MT5: zasilenie pipeline:
       • luki KRYTYCZNE z MT4 → W1.5 jako ⬛ BRAK KRYTYCZNY
       • luki ISTOTNE z MT4   → W1.5 jako ⬛ BRAK ISTOTNY
       • dowody [W] (wielofunkcyjne) → powołuj RAZ w sekcji "Na dowód" z listą tez
       • po W2: MT5-MANDATE-ALL-EVIDENCE (cross-check N_pismo ≥ 0.7 × N_macierzy)

  ⛔ POZYCJA: ten krok jest TUTAJ (W1.2c), NIE w W2.
     Macierz musi powstać PRZED mapą przesłanka→dowód (W1.3).
     Tworzenie macierzy w W2 = błąd architektoniczny: pismo redagowane
     bez wiedzy o lukach i wielofunkcyjności dowodów.

  ⛔ WBUDOWANIE W PISMO: tabela D×T z MT4 WCHODZI do treści pisma
     jako osobna sekcja (przed lub po uzasadnieniu, zależnie od konwencji sądu).
     Macierz nie jest tylko krokiem wewnętrznym — jest widoczna dla sądu,
     bo art. 227 i 232 k.p.c. wymagają wskazania jakie fakty mają być wykazane
     jakim dowodem. Wnioski dowodowe formułowane są PER TEZA (nie jako lista en bloc).

  ⛔ FORMAT SĄDOWY — ZAKAZ SYMBOLI:
     Tabela w piśmie procesowym NIE używa symboli wewnętrznych (●●●, ★, [K], [W], RK).
     Te oznaczenia służą wyłącznie wewnętrznemu pipeline'owi (MT1–MT5).
     Tabela dla sędziego ma WYŁĄCZNIE kolumny czytelne dla prawnika:
       Lp. | Dowód (nazwa i opis) | Lokalizacja w aktach (str./zał./godz.) |
       Roszczenie (T1/T2/... lub pełna nazwa) | Na okoliczność (opis faktów)
     Dla dokumentów z protokołu: obowiązkowe wskazanie strony protokołu i godziny.
     Dla załączników: numer załącznika.
     Klasyfikacje wewnętrzne (siła dowodu, ryzyka krzyżowe) — tylko do użytku
     wewnętrznego modelu; nie trafiają do pisma.

⛔ Generator pisma nie pyta "jakie dowody mam?"
   Pyta: "jakie FAKTY F-nn prowadzą do TEZY T-X i w jakim łańcuchu?"
⛔ ZAKAZ: sekcja "Na dowód" bez powiązania z F-nn z rejestru.
⛔ ZAKAZ: W1.3 bez gotowych łańcuchów ŁD-XX dla tez głównych.
⛔ ZAKAZ: W1.3 bez gotowej macierzy D×T (gdy ≥2 dowody i ≥2 tezy).
⛔ ZAKAZ: wnioski dowodowe jako lista en bloc — każdy wniosek wskazuje tezę Tn.
```

### W1.2b — MOD-STRATEGIA-WYBOR (obligatoryjna ocena i ranking ścieżek)

> ⛔ HARD GATE W1.2b — dla każdego pisma złożonego gdy ≥2 ścieżki prawne
> lub anomalia podmiotowa w materiale dowodowym.
>
> Wywołaj: `view /mnt/skills/user/shared/MOD-STRATEGIA-WYBOR.md`
>
> Moduł jest NADRZĘDNY wobec MOD-WARIANTY-POZWU — wywołuje go wewnętrznie
> jako generator kart. Nie wywołuj MOD-WARIANTY-POZWU samodzielnie.

Jeśli warunek aktywacji spełniony:
1. S1 — zidentyfikuj WSZYSTKIE ścieżki (w tym anomalie podmiotowe: różne KRS/NIP)
2. S2 — oceń każdą ścieżkę pod kątem ataku przeciwnika (OCENA-A/B/C)
3. S3 — wygeneruj ranking z rekomendacją; ścieżka z atakiem 🔴 bez kontrargumentu
         → PORZUĆ lub EWENTUALNA — nigdy GŁÓWNA
4. S4 — wybierz strukturę pisma (Scenariusz 1/2/3)
5. S5 — wyświetl RAPORT STRATEGII użytkownikowi; czekaj na zatwierdzenie
6. Po zatwierdzeniu: zaktualizuj W1.2 (teza centralna) jeśli zmienił się wybór;
   zapisz wynik do MOD-HISTORIA-STRATEGII PRZED W1.3

⛔ ZASADA BEZWZGLĘDNA: Ścieżka z atakiem 🔴 bez kontrargumentu NIE może być
ścieżką główną. System OBLIGATORYJNIE rekomenduje ścieżkę silniejszą — użytkownik
może to zmienić, ale decyzja musi być explicite, nie domyślna.

Jeśli warunek aktywacji NIE jest spełniony — pomiń ten krok, przejdź do W1.3.

### W1.3–W1.6 + Checkpoint W1→W2

> Szczegóły kroków W1.3 (mapa przesłanka→dowód), W1.4 (lista przepisów),
> W1.4b (roszczenia narastające, tabela-petitum, podwójne żądanie ustalenia),
> W1.5 (braki krytyczne), W1.6 (MOD-RED-TEAM-WLASNY) i Checkpoint W1→W2:
>
> `view /mnt/skills/user/pisma-procesowe-v3/references/W1-SZCZEGOLY.md`



## ⛔⛔⛔ PRE-W2-VERIFICATION-GATE — BRAMKA OBOWIĄZKOWA PRZED W2 ⛔⛔⛔

> **Wywołaj:** `view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md`
>
> ⛔ HARD GATE — BEZWZGLĘDNY. Wykonaj PO zatwierdzeniu W1 przez użytkownika,
> PRZED W2.1. NIE można pominąć. NIE ma wyjątków (nawet "prosta sprawa",
> "mam to z pamięci", "użytkownik podał dane", "dane są w aktach sprawy").
> Dane z akt sprawy NIE są weryfikacją online. Dane z pamięci modelu NIE są.
> ⛔ WERYFIKACJA [POV-B][POV-C]: web_search/web_fetch dla SĄDU i POZWANEGO
>    musi być wywołany fizycznie w tej odpowiedzi — patrz SELF-CHECK-PISMA.md blok PRE-W2.
>
> **Co weryfikuje:**
> - PRE-W2.B: adres i wydział sądu/organu — web_search OBOWIĄZKOWY
> - PRE-W2.C: dane rejestrowe pozwanego — KRS/NIP/adres z rejestru
> - PRE-W2.D: każdy numer KRS/NIP z akt — do której spółki należy?
>             Rozbieżność KRS ≠ NIP w tym samym dokumencie → STOP, wyjaśnij
>
> **Efekt:** Raport PRE-W2 (widoczny użytkownikowi) z danymi zweryfikowanymi.
> W2.1 używa WYŁĄCZNIE danych z raportu PRE-W2, nie z pamięci modelu.
>
> ⛔ ZAKAZ-PRE-W2: NIE wstawiaj do W2 żadnego adresu sądu, KRS, NIP, REGON,
> adresu pozwanego bez uprzedniej weryfikacji w PRE-W2. Naruszenie = błąd
> krytyczny — powróć do PRE-W2 i wykonaj retroaktywnie.
>
> **Przykłady błędów wyeliminowanych przez ten gate:**
> - SR Katowice-Zachód VII Wydział Pracy: ul. Warszawska 45 (nie ul. Lompy 14)
> - KRS 0000796445 = Human Park sp. z o.o.; HPG ma KRS 0001025052 — bez
>   sprawdzenia rejestru model błędnie zbudował argument "ten sam KRS"

---

## WIADOMOŚĆ 2 — PROJEKT PISMA

> ⛔ HARD GATE W2:
> Wykonaj W2 wyłącznie po zatwierdzeniu W1 przez użytkownika ORAZ po zamknięciu
> PRE-W2-VERIFICATION-GATE (GATE-OK lub GATE-WARN).
> W2 NIE MOŻE zawierać: żadnego numeru Dz.U., żadnej sygnatury orzeczenia.
> Każdy przepis = ⚠️[art. X ustawa — WERYFIKACJA W3]
> Każde orzeczenie = [ORZECZENIE: opis → WERYFIKACJA W3]
> Dane podmiotowe (sąd, pozwany, KRS, NIP, adres) = WYŁĄCZNIE z raportu PRE-W2.
> Po ukończeniu W2 — przejdź do W3 automatycznie (nie pytaj użytkownika o zgodę).

> Cel W2: pełna redakcja procesowa pisma w oparciu o zatwierdzoną ramę z W1.
> Fakty: wyłącznie z materiałów użytkownika. Braki = ⬛ [UZUPEŁNIJ: opis]

> ⛔ HARD GATE — FAKTY:
> Czy użytkownik dostarczył materiały źródłowe?
>   TAK → MOD-FAKTY uruchomi się w W3 po weryfikacji prawnej
>   NIE → stosuj zasadę nadrzędną: żaden fakt bez źródła z opisu użytkownika

### W2.1 — Moduły do wczytania przed redakcją

```
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-SZABLONY.md   (zawsze)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-DOWODY.md     (gdy są dowody)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-OBAL.md       (gdy riposta/odpowiedź)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-OPLATY.md     (gdy pismo wszczynające)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-ADMIN.md      (gdy sprawa adm./KPA/WSA)
view /mnt/skills/user/shared/MOD-TIMING.md                         (gdy timing złożenia jest istotny:
                                                                     pierwsza rozprawa <14 dni /
                                                                     wniosek dowodowy grożący prekluzją /
                                                                     korzystne postanowienie do utrwalenia)
view /mnt/skills/user/shared/MOD-DOKTRYNA.md                       (gdy uzasadnienie powołuje
                                                                     komentarze lub literaturę —
                                                                     hierarchia: orzeczenie > doktryna)
⛔ UWAGA: MOD-MACIERZ-DOWOD-TEZA (KROK MT) wykonany już w W1.2c.
          W2 używa gotowej macierzy z W1.2c:
          • wnioski dowodowe formułuj PER TEZA: "Na okoliczność Tn: dowód D[x], D[y]"
          • dowody [W] powołuj RAZ z listą tez, nie per teza oddzielnie
          • tabela D×T z MT4 wchodzi do treści pisma jako sekcja widoczna dla sądu
          • MT5-MANDATE-ALL-EVIDENCE: sprawdź N_pismo ≥ 0.7 × N_macierzy po redakcji W2
view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md
                                                                    (⛔ OBOWIĄZKOWE gdy: rozbieżne
                                                                     identyfikatory stron w dokumentach
                                                                     (różne KRS/NIP/nazwa); błędny PESEL;
                                                                     faktura z błędnym NIP — wykonaj
                                                                     ISU-1→ISU-5 przed W1.3;
                                                                     ⛔ gdy PESEL w aktach i znana data
                                                                     ur. lub płeć — wykonaj ISU-PESEL P1→P6)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md
                                                                    (⛔ OBOWIĄZKOWE gdy: w materiale
                                                                     widoczne są ≥2 podmioty / różne KRS
                                                                     na umowach / zmiana nazwy pracodawcy /
                                                                     argument o tożsamości pracodawcy —
                                                                     wykonaj NAJPIERW ISU, potem PR1→PR4)
view /mnt/skills/user/shared/MOD-BUDOWA-ARGUMENTU.md               (⛔ OBOWIĄZKOWE — zawsze przed W2.2:
                                                                     schemat 7-elementowy każdego bloku,
                                                                     klasyfikacja A/B/C/D, kolejność tez,
                                                                     zamknięcie furtki, wniosek cząstkowy)
view /mnt/skills/user/shared/MOD-KOSZT-ODPOWIEDZI.md               (⛔ OBOWIĄZKOWE — zawsze przed W2.2:
                                                                     szablon KO-2 dla twierdzeń o dokumentach
                                                                     pozwanego, numerowanie KO-4, audit KO-3
                                                                     uruchamiany po W2 przed AUDYT-KOŃCOWY)
view /mnt/skills/user/shared/MOD-SKUTEK-PROCESOWY.md               (⛔ OBOWIĄZKOWE — zawsze przed W2.2:
                                                                     SP-1: blok skutku po każdej podstawie
                                                                     prawnej; SP-3: 4 pytania kontrolne;
                                                                     SP-5: pozycja w schemacie 7-el.)
view /mnt/skills/user/shared/MOD-MIKROPODSUMOWANIA.md               (⛔ OBOWIĄZKOWE — zawsze przed W2.2:
                                                                     MK-1: 3-4 zdania po każdym rozdziale;
                                                                     MK-2: zasady redakcji; BLOKADA gdy brak)
view /mnt/skills/user/shared/MOD-STRESS-TEST.md                     (⛔ OBOWIĄZKOWE — po W2, przed W3:
                                                                     ST-1: symulacja odpowiedzi pełnomocnika;
                                                                     ST-2: raport do wyświetlenia;
                                                                     ST-3: fix dla argumentów 🔴;
                                                                     BLOKADA .docx bez PASS)
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md                (⛔ OBOWIĄZKOWE — zawsze przed W2.2:
                                                                     klasyfikacja A/B/C/D twierdzeń,
                                                                     kolejność bloków uzasadnienia,
                                                                     zasada niezależności tez)
```

### W2.2–W2.3 — Struktura pisma + lista placeholderów

> Obowiązkowy szablon nagłówka/żądań/uzasadnienia/podpisu (W2.2)
> i lista kontrolna ⚠️Pn / ⚠️On / ⬛ po redakcji (W2.3):
> `view /mnt/skills/user/pisma-procesowe-v3/references/W2-SZCZEGOLY.md`

### W2.4 — MOD-ATAK-NA-DRAFT (gate na gotowym tekście)

> ⛔⛔⛔ HARD GATE W2.4 — BEZWZGLĘDNY, BEZ WYJĄTKU ⛔⛔⛔
> Ten krok jest OBLIGATORYJNY. Nie ma warunku aktywacji. Każdy draft przez niego przechodzi.
> NIE WOLNO przejść do W3 bez wykonania W2.4 i wyświetlenia RAPORTU D.
> NIE WOLNO wygenerować .docx bez zamkniętego W2.4.
> Pośpiech użytkownika, prosta sprawa, brak prośby — ŻADNE z nich nie jest wyjątkiem.

> Wywołaj: `view /mnt/skills/user/shared/MOD-ATAK-NA-DRAFT.md`
> (plik istnieje od v1.0.0 2026-06-21; jeśli view() zwróci błąd — zatrzymaj się
> i poinformuj użytkownika o brakującym pliku zamiast cicho pomijać krok)

**Sekwencja W2.4 (wykonaj w tej kolejności):**

1. `view /mnt/skills/user/shared/MOD-ATAK-NA-DRAFT.md`
2. D1 — skan zdań kategorycznych → naprawa redakcyjna samodzielnie
3. D2 — test pełnomocnika akapit po akapicie → naprawa redakcyjna dla 🟡/🟢;
         dla 🔴/🟠 bez pokrycia dowodowego → oznacz jako ⬛ LUKA D4
4. D3 — skan sprzeczności międzyakapitowych → naprawa redakcyjna samodzielnie
5. D5 — analiza własnych słabości i ryzyk (RP prawne / RD dowodowe / RPC procesowe)
         → 🔴/🟠: zdanie ubezpieczające lub zmiana konstrukcji; 🟡: notacja w RAPORCIE D
6. D4 — weryfikacja luk dowodowych → jeśli ⬛ LUKA D4 klasy 🔴/🟠: STOP
7. Wyświetl RAPORT D (obligatoryjny — nawet gdy wynik ✅)

**Rozgałęzienie po RAPORCIE D:**
- ATAK-OK / ATAK-UWAGI → przejdź do W3 automatycznie
- ATAK-STOP (⬛ LUKA D4 🔴/🟠) → STOP; zadaj pytania użytkownikowi;
  czekaj na odpowiedź; dopiero po niej uzupełnij draft i przejdź do W3

⛔ ZAKAZ-9 (nowy): NIE przechodzij do W3 bez wyświetlonego RAPORTU D z W2.4.
   Naruszenie = błąd krytyczny pipeline — powróć do W2.4 i wykonaj go retroaktywnie.

---

## WIADOMOŚĆ 3 — WERYFIKACJA ZE ŹRÓDEŁ + WALIDACJA

> ⛔ HARD GATE W3:
> NIE generuj pisma finalnego ani .docx przed ukończeniem W3.
> ⛔⛔ PODMIOT-GATE (W3.0) MUSI być wykonany JAKO PIERWSZY w W3 — przed W3.1.
>     NIE przechodzij do weryfikacji przepisów (W3.1) bez zamkniętego PODMIOT-GATE.
>     Każdy ⚠️POD bez statusu ✅/⚠️/⛔ = blokada W3.1.
> Każdy ⚠️Pn musi mieć wpis ✅ lub ⛔ w raporcie.
> ⛔ Każdy ⚠️On (orzeczenie powołane w piśmie — CYTAT LUB GOŁE POWOŁANIE NA
>   POPARCIE TEZY) musi mieć **status GRAD z shared/WERYFIKACJA-SLAD.md
>   (GRAD-1..4), nie samą sygnaturę + URL.** Naprawa po NSA I FZ 104/26
>   (zażalenie z fabrykowanymi datami/sygnaturami niedotyczącymi w ogóle
>   powoływanej instytucji procesowej) — sam URL potwierdza tylko ISTNIENIE,
>   nie potwierdza, że orzeczenie faktycznie popiera tezę pisma.
>   → view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md → wykonaj GRAD-1..4
>     dla KAŻDEGO ⚠️On, w tym GRAD-3b (GUARD INSTYTUCJA) gdy strony
>     anonimizowane. Wynik 🟢 → ✅. Wynik 🟠/🟡 → decyzja/złagodzenie przed
>     W3.6a. Wynik 🔴 lub kotwica nierozwiązana → ⛔ USUŃ powołanie, nie
>     "napraw" innym pinpointem tej samej sygnatury.
> ⛔ Gdy pismo zawiera zwrot typu "zgodnie z ugruntowaną linią orzeczniczą"
>   / "utrwalone orzecznictwo" / "jednolicie przyjmuje się" — dodatkowo
>   uruchom Zasadę 10 (BILANS) z `orzeczenia-sadowe-v2` PRZED W3.6a: takie
>   sformułowanie jest twierdzeniem o STANIE CAŁEJ LINII, nie o pojedynczym
>   wyroku — wymaga sprawdzenia linii przeciwnej, nie tylko istnienia
>   przykładów zgodnych.
> Każdy ⚠️POD musi mieć wpis ✅/⚠️/⛔ z PODMIOT-GATE.
> Dopiero po zamknięciu wszystkich ⚠️ — pismo finalne + .docx.

### W3.0 — PODMIOT-GATE (weryfikacja danych podmiotów przed W3.1)

> ⛔ OBOWIĄZKOWE — wykonaj jako pierwsze w W3, przed weryfikacją przepisów.
> Dotyczy stron pisma ORAZ sądu/organu z nagłówka. Dane z pamięci = ⚠️POD.
>
> ⛔ Sprawdź SELF-CHECK-PISMA.md blok [POV-B][POV-C]: czy web_search/web_fetch
> dla sądu i pozwanego był wywołany fizycznie od ostatniej edycji pisma?
> NIE → powtórz wywołanie zanim W3.1.
>
> Szczegóły procedury P1–P4, formaty raportu POD-1/2/3/S1/S2, ZAKAZ-7:
> `view /mnt/skills/user/pisma-procesowe-v3/references/W3-PODMIOT-GATE.md`

### W3.1–W3.7 + Finalizacja

> Szczegóły kroków W3.1 (ISAP), W3.2 (orzeczenia + ZAKRES-STOSOWANIA),
> W3.3 (MOD-FAKTY), W3.4 (MOD-WALIDACJA bloki A–J + moduły warunkowe),
> W3.5 (HYBRID-VALIDATION), W3.6 (raport W3), W3.6a (AUDYT-KOŃCOWY +
> COURT-SIMULATION + LEGAL-QUALITY-GATE), W3.7 (PEER-REVIEW + POST-VALIDATION
> + UWAGI-REDAKCYJNE), generowanie .docx i ST-FINAL:
>
> `view /mnt/skills/user/pisma-procesowe-v3/references/W3-WERYFIKACJA.md`

## SELF-CHECK PRZED KAŻDĄ ODPOWIEDZIĄ

> ⛔ MRG (MANDATORY-REREAD-GATE) — JAKO ABSOLUTNIE PIERWSZY KROK KAŻDEJ ODPOWIEDZI
> w pipeline pisma (i przed każdym [CP]). Wykonaj OBA view() ze świeżej wersji z dysku:
> `view /mnt/skills/user/shared/CP-GATE.md`
> `view /mnt/skills/user/shared/MOD-STEP-TRACKER.md`
> → zaktualizuj CP-REJESTR + REJESTR KROKÓW WYŁĄCZNIE ze świeżo odczytanej treści.
> Obowiązkowe nawet gdy pliki były już wczytane, model „pamięta" treść lub plik
> „nie zmieniał się". Pełna reguła i zakazy: HARD GATE MRG (góra pliku).
>
> ⛔ Następnie wczytaj SELF-CHECK-PISMA przed każdą odpowiedzią w ramach pipeline pisma:
> `view /mnt/skills/user/pisma-procesowe-v3/references/SELF-CHECK-PISMA.md`
>
> Zawiera: listę kontrolną, REGUŁĘ FINALNĄ.

---

## MODUŁY — MAPA WCZYTYWANIA

> Pełna mapa aktywacji modułów i pliki kanoniczne shared:
> `view /mnt/skills/user/pisma-procesowe-v3/references/MODULY-MAPA.md`
>
> Zawiera: matrycę engines (W1.2-V10), kolejność ładowania shared/ per krok,
> pliki kanoniczne shared (MOD-STEP-TRACKER, MOD-ATAK-NA-SWIADKA, itp.).

---

## DODATEK — CONTRADICTION INTELLIGENCE (V10) + PISMO ADMINISTRACYJNE

> Matryca aktywacji V10, sekwencja 6 modułów engines, obsługa KPA/PPSA/WSA/NSA:
> `view /mnt/skills/user/pisma-procesowe-v3/references/DODATKI.md`


---

## CHANGELOG

> Pełna historia napraw (5.7...5.11, każda z root cause i opisem naprawy)
> wyniesiona do `references/CHANGELOG.md` (redukcja kosztu kontekstu,
> 2026-07-12 runda 2) — treść zachowana w 100%, tylko przeniesiona:
> `view /mnt/skills/user/pisma-procesowe-v3/references/CHANGELOG.md`
>
> Najnowsza pozycja (kontekst do bieżącej pracy): **5.11 (2026-07-12)** —
> naprawiono 7 martwych odwołań do modułów ⛔ obowiązkowych w W2.2
> (MOD-BUDOWA-ARGUMENTU, MOD-ELIMINACJA-TEZ, MOD-KARTA-DOWODU,
> MOD-KOSZT-ODPOWIEDZI, MOD-MIKROPODSUMOWANIA, MOD-SKUTEK-PROCESOWY,
> MOD-STRESS-TEST — odzyskane do shared/), naprawiono nazwę pliku
> MOD-DOKUMENT-ANOMALIE_v1.1.0.md w MODULY-MAPA.md i AUTOMAT-STANOW.md,
> oraz wyniesiono tę sekcję CHANGELOG do osobnego pliku.
