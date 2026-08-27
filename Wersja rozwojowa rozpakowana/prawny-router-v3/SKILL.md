---
name: prawny-router-v3
version: "3.30"
type: orchestration
status: production
entrypoint: SKILL.md
compatibility: "web_search, web_fetch, file_read (view), create_file, show_widget — lub równoważne funkcje hosta wg shared/UNIVERSAL-RUNTIME-ADAPTER.md"
description: "UŻYWAJ ZAWSZE i AUTOMATYCZNIE przy każdej sprawie prawnej, w każdej jurysdykcji. Wczytaj przed analizą, oceną cudzego materiału lub pismem; uruchamia HARD GATE i routing."
dependencies:
  requires:
    - shared
    - prawo-polskie-v2
    - analiza-sadowa-v6
    - analizator-dowodow-v3
    - analizator-przepisow-v2
    - analizator-umow-v1
    - chronologia-sprawy-v1
    - dr-03-prawo-karne-wykroczenia-egzekucja
    - dr-08-samorzad-terytorialny-prawo-lokalne
    - dr-09-budownictwo-srodowisko-energia-transport
    - dr-10-zdrowie-farmacja-zywnosc-rolnictwo
    - dr-11-cyfrowe-cyber-ai-dane-ip
    - dr-12-sadownictwo-prokuratura-zawody-prawnicze
    - orzeczenia-sadowe-v2
    - pisma-procesowe-v3
    - pisma-proste-v2
    - przesluchanie-swiadkow-v2-min90
    - przewodnik-prawny-v2
  called_by:
    - użytkownik (punkt wejścia — brak nadrzędnego skilla)
inputs:
  - opis sprawy użytkownika (tekst wolny)
  - opcjonalnie: pliki/dowody wgrane przez użytkownika
  - opcjonalnie: plik kontekstu sesji (eksport z wcześniejszej rozmowy)
outputs:
  - decyzja routingu ([1]-[11]) + wywołanie właściwego skilla PRIMARY/SECONDARY/FALLBACK
  - finalnie: odpowiedź tekstowa, widget (show_widget) lub dokument .docx/.pdf (create_file)
confidence: verified-online
  # HARD GATE wymusza web_search/web_fetch dla każdego przepisu/sygnatury —
  # router sam nie generuje treści prawnej z pamięci, tylko orkiestruje.
escalation:
  - brak dostępu do isap.sejm.gov.pl / orzeczenia.ms.gov.pl / sn.pl / nsa.gov.pl
    → oznacz ⚠️ [NIEWERYFIKOWANE] i poinformuj użytkownika, nie kontynuuj cicho
  - sprawa transgraniczna / prawo obce → pomiń prawo-polskie-v2 i ISAP,
    pozostałe zasady HG aktywne (UP-5)
  - użytkownik zagubiony / brak klasyfikacji → [7] FALLBACK, nie zgadywanie dziedziny
  - podmiot (spółka/organ/sąd) oznaczony ⬛ [DO WERYFIKACJI] i brak dostępu do
    rejestru (KRS/CEIDG) → STOP, poinformuj użytkownika, ZAKAZ generowania
    pisma z podmiotem w statusie ⬛
limitations:
  - nie zastępuje porady radcy prawnego/adwokata — patrz shared/DISCLAIMER.md (KROK 7, obowiązkowy)
  - jakość i czas odpowiedzi zależą od dostępności i jakości web_search/web_fetch
  - nie ingeruje w kontrolę jakości pipeline'u pisma-procesowe-v3 (tylko deleguje)
required_modules:
  - shared/MCP-INTEGRACJA.md  # opcjonalny — patrz KROK 1; tani gdy MCP niepodłączone
  - shared/PRAWO-HARDGATE.md
  - shared/HIERARCHIA-ZRODEL.md
  - shared/PORTALE-BRANZOWE-RZAD-2B.md
  - shared/MOD-STEP-TRACKER.md
  - shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md
  - shared/MOD-KONTEKST-SESJI.md
  - shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
  - shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md
  - shared/MOD-PORCJOWANIE-DOWODOW.md
  - shared/PRE-W2-VERIFICATION-GATE.md
  - shared/CP-GATE.md
  - shared/DISCLAIMER.md
  - references/KROK0A-anonimizer.md
  - references/KROK1-detekcja.md
  - references/AUDYT-KLUCZA-ODPOWIEDZI.md
  - dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md
changelog:
  - "3.30 (2026-08-27): synchronizacja mapy dziedzinowej z F-108 P1 oraz rzeczywistymi modułami REACH/CLP, akcyzy/cła i cudzoziemców; references/CHANGELOG.md."
  - "3.29 (2026-08-27): stałe identyfikatory reguł i usunięcie resztek historii; references/CHANGELOG.md."
---

## ŁADOWANE ZAWSZE — BEZWZGLĘDNIE

W każdej sprawie prawnej, przed analizą:

1. `view shared/PRAWO-HARDGATE.md` — świeża weryfikacja każdego powołania w tej turze.
2. `view references/KROK0A-anonimizer.md` — zamknij bramkę anonimizera.
3. `view references/KROK1-detekcja.md` — ustal tryb i jurysdykcję.
4. Wykonaj routing [1]–[11], wczytaj PRIMARY i wypisz ślad KROKU 3A.
5. Przy pierwszym URL: `view shared/HIERARCHIA-ZRODEL.md`; każdy URL musi mieć RZĄD 1/2A/2B/3.
6. Przed wysłaniem: `view references/SELF-CHECK.md` i wykonaj inwentarz VER-GRAIN.
7. Ostatnim elementem odpowiedzi prawnej musi być disclaimer z `shared/DISCLAIMER.md`.

Brak obowiązkowego odczytu lub źródła → `⛔ TRYB ZDEGRADOWANY` i jawne
`⚠️ [NIEWERYFIKOWANE]`; zakaz cichego użycia pamięci modelu.

## ADAPTER RUNTIME

Zastosuj `shared/UNIVERSAL-RUNTIME-ADAPTER.md`. Nazwy `view`, `web_search`,
`web_fetch`, `show_widget`, `create_file` i `present_files` oznaczają równoważne
operacje hosta. Odczyty `shared/...`, `references/...` i `<skill>/...` dotyczą
odpowiednich zainstalowanych skilli; nie kopiuj zależności do routera.

### PATH-SELFTEST

Pierwszy odczyt zasobu w sesji testuje rozwiązywanie ścieżek:

1. Użyj ścieżki semantycznej zapisanej w tym pliku.
2. Przy błędzie ustal prefiks hosta i ponów odczyt.
3. Ponowny błąd → `⛔ TRYB ZDEGRADOWANY — zasoby skilla niedostępne`; podaj
   zasób i błąd, a każdą treść prawną oznacz `⚠️ [NIEWERYFIKOWANE]`.

Zapamiętaj działającą formę na sesję. Nazwa skilla w odwołaniu musi występować
w `dependencies.requires`; w przeciwnym razie zgłoś błąd ścieżki.

---

# Router Prawny v3 — Spis Treści i Sekwencja Główna

## PREFERENCJE UŻYTKOWNIKA (aktywne globalnie)

```
UP-1: router→v3 ZAWSZE pierwszy (przed jakimkolwiek skillem dziedzinowym) — każda jurysdykcja
UP-2: ISAP — weryfikacja KAŻDEGO przepisu online (web_search/web_fetch) — bez wyjątku
UP-3: Sprawy karne → KROK1-detekcja.md kieruje do dr-03; kwalifikacja przez
         view dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md
UP-4: HYBRID-VALIDATION przed każdym .docx
UP-5: Zagraniczne → pomiń prawo-polskie-v2 + ISAP, pozostałe zasady aktywne
```

## SEKWENCJA GŁÓWNA

```
KROK 0  → Wczytaj ten plik → ⛔ HG-ACTIVE (blok powyżej) — potwierdź przed kontynuacją
KROK 0-ST → ⛔ [ST-INIT — STEP-TRACKER] (zaraz po HG-ACTIVE, przed jakimkolwiek krokiem):
          view shared/MOD-STEP-TRACKER.md → zainicjuj REJESTR kroków
          (FAZA 0). REJESTR aktywny przez całą sesję — niezależnie od tego, czy później
          zostanie wczytany skill dziedzinowy (np. pisma-procesowe-v3).
          ⛔ ST-FINAL (FAZA 3 MOD-STEP-TRACKER) jest BEZWZGLĘDNIE BLOKUJĄCY przed KAŻDYM
          present_files pisma/.docx — także gdy pismo generowane jest bezpośrednio z routera
          bez pełnego pipeline pisma-procesowe-v3. Polecenia „dalej"/„kontynuuj"/„generuj"
          NIE zwalniają z ST-FINAL ani z obowiązku raportowania pominięć (FAZA 2).
KROK 0-RPK → Gdy zakres obejmuje ≥10 ponumerowanych jednostek albo pracę
          partiami nad wyliczoną listą: view shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md
          i wykonaj RPK-INIT/RPK-COMMIT/RPK-RESUME zgodnie z modułem.
KROK 0A → [ANONIMIZER] → view references/KROK0A-anonimizer.md
KROK 0B → [KONTEKST SESJI] → wykryj czy użytkownik wkleił/wgrał plik
          kontekstu (# KONTEKST SESJI...) lub czy napisał "masz kontekst" /
          "wczytaj sesję" / "plik z poprzedniej sesji" — jeśli TAK:
          view shared/MOD-KONTEKST-SESJI.md → wykonaj
          TRYB IMPORT (§4). IMPORT_AKTYWNY = true dla tej sesji.
          Jeśli NIE — pomiń, kontynuuj do KROK 1.
KROK 0C → Gdy są pliki lub wzmianka o załącznikach: najpierw view
          shared/MOD-SKAN-DOWODOW-KOMPLETNY.md i wykonaj pełny SD-VER.
          Po raporcie SD-VER zakończ turę. Dla dużych materiałów wykonaj też
          shared/MOD-PORCJOWANIE-DOWODOW.md; jego STOP/checkpointy są blokujące.
KROK 0D → [STATUS PODMIOTÓW — OZNACZENIE ⬛] → obowiązkowy gdy w materiałach widoczne
          dane podmiotów (spółki, organy, sądy, fundusze):
          ⛔ Każdy podmiot niebędący osobą prywatną = natychmiast ⬛ [DO WERYFIKACJI]
          ⛔ Status ⬛ utrzymuje się aż do faktycznego web_search/web_fetch w tej sesji
          ⛔ ZAKAZ wstawiania danych ⬛ do pisma / argumentacji bez weryfikacji
          Szczegóły + STATUS-LIFECYCLE: view shared/PRE-W2-VERIFICATION-GATE.md (PRE-W2.0)
          Wyjątki (NIE oznaczaj): imię/nazwisko, adres, PESEL osoby fizycznej
KROK 1  → [DETEKCJA TRYBU + HARD GATE] → view references/KROK1-detekcja.md
KROK 2  → [ROUTING [1]–[11]] → poniżej w tym pliku
KROK 3  → Załaduj PRIMARY → SECONDARY → FALLBACK
KROK 3A → [ŚLAD ROUTINGU — OBOWIĄZKOWY]
          Bezpośrednio po KROK 3, PRZED przejściem do KROK 4, wypisz blok:
          ```
          TRYB: [LAIK / PRAWNIK]
          PRIMARY: [nazwa skilla] — ROUTER-WCZYTANY: [TAK: ścieżka view / NIE]
          SECONDARY: [nazwa(-y) skilla] — ROUTER-WCZYTANY: [TAK / NIE / N-D]
          ODRZUCONE: [skille rozważone i odrzucone] — powód: [jedno zdanie]
          WERSJA ROUTERA: [numer z YAML frontmatter tego pliku]
          ```
          ⛔ Gdy `ROUTER-WCZYTANY: NIE` dla PRIMARY (np. z powodu braku
          dostępu do narzędzi plikowych w danym środowisku) — poprzedź
          resztę odpowiedzi nagłówkiem `⛔ TRYB ZDEGRADOWANY — router
          niewczytany`. Efekt uboczny pożądany: rozbraja sprzeczność
          „zakaz narzędzi plikowych + wykonaj routing" — brak wczytania
          staje się zadeklarowanym, jawnym stanem, nie milczącym
          pominięciem karanym jako uchybienie (patrz F-113 zakres (a)).
          `ROUTER-WCZYTANY: TAK` wymaga faktycznego odczytu w tej turze;
          kontrolę antyfasadową wykonaj z `references/SELF-CHECK.md`.
KROK 4  → Wykonaj analizę / zbierz dane
KROK 5  → Sprawdź TYP WYJŚCIA → SEKWENCJA END-TO-END → poniżej
KROK 5B → [EXPORT KONTEKSTU] → po KROK 5 jeśli sesja zawierała KROK 3B
           (analizator-dowodow-v3) lub W3 (pisma-procesowe-v3):
           view shared/MOD-KONTEKST-SESJI.md → wykonaj
           TRYB EXPORT (§3) — generuj plik .md i present_files.
KROK 6  → Jeśli pismo → generuj .docx
          Kontrola jakości i statusu DRAFT/FINAL zarządzana przez pisma-procesowe-v3
          (shared/CP-GATE.md). Router nie ingeruje w pipeline CP — tylko deleguje.
          ⛔ KROK 6-ST — ST-FINAL (BLOKUJĄCY): przed present_files KAŻDEGO pisma/.docx
          wyświetl PEŁNY REJESTR KROKÓW (FAZA 3 MOD-STEP-TRACKER). Jeśli STATUS =
          ⚠️ DRAFT — NIEZWERYFIKOWANY → pokaż raport pominięć (FAZA 2) i czekaj na decyzję
          a/b. ZAKAZ present_files bez uprzedniego ST-FINAL — także gdy router generuje
          pismo bez pełnego pipeline pisma-procesowe-v3.
KROK 7  → DISCLAIMER → view shared/DISCLAIMER.md
```

> ⛔ KROK 0A jest BRAMKĄ TWARDĄ. Żaden kolejny krok nie może być wykonany
> jeśli KROK 0A nie jest zamknięty (decyzja_sesji ≠ null).

---

## KROK 2 — ROUTING [1]–[11]

### [1] DOKUMENT / UMOWA
`umowa / OWU / kontrakt / ugoda / regulamin / testament / "czy mogę podpisać" / "klauzule"`
→ PRIMARY: `view analizator-umow-v1/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2` · FALLBACK: `przewodnik-prawny-v2`

### [2] AKTA / WYROK / ANALIZA SZANS
`wyrok / nakaz zapłaty / wezwanie / pismo przeciwnika / "jakie mam szanse" / analiza pozycji`
→ PRIMARY: `view analiza-sadowa-v6/SKILL.md`
→ SECONDARY: `analizator-dowodow-v3`, `orzeczenia-sadowe-v2` · FALLBACK: `przewodnik-prawny-v2`

### [3] PISMO ZŁOŻONE
`pozew / apelacja / odpowiedź na pozew / zażalenie / skarga / pismo wielowątkowe`
→ PRIMARY: `view pisma-procesowe-v3/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2`, `analiza-sadowa-v6` · Wyjście: **obowiązkowo .docx**

### [4] PISMO PROSTE (1 wątek, 1 podstawa prawna)
`sprzeciw od nakazu / klauzula / przywrócenie terminu / wgląd / uzasadnienie / wezwanie do zapłaty`
→ PRIMARY: `view pisma-proste-v2/SKILL.md`
→ NIE używaj gdy >1 wątek → [3] · Wyjście: **obowiązkowo .docx**

### [5] ORZECZNICTWO
`"znajdź wyrok" / "precedens" / "linia orzecznicza" / weryfikacja sygnatury`
→ PRIMARY: `view orzeczenia-sadowe-v2/SKILL.md`
→ SECONDARY: `analiza-sadowa-v6`

### [6] DOWODY / TERMINY / KOSZTY
`maile / SMS / nagrania / faktury / terminy procesowe / koszty sądowe / opłaty komornicze`
→ PRIMARY: `view analizator-dowodow-v3/SKILL.md`
→ SECONDARY: `analiza-sadowa-v6`

### [7] ZAGUBIONY / FALLBACK
`"co mam zrobić" / "od czego zacząć" / wyjaśnienie wyniku / walidacja przepisu`
→ PRIMARY: `view przewodnik-prawny-v2/SKILL.md`
→ SECONDARY: `prawo-polskie-v2`

### [8] PRZESŁUCHANIE ŚWIADKA
`świadek / cross-examination / biegły / pytania do świadka / rozbicie zeznania`
→ PRIMARY: `view przesluchanie-swiadkow-v2-min90/SKILL.md`
→ SECONDARY: `analizator-dowodow-v3`, `analiza-sadowa-v6`

### [9] ANALIZA PRZEPISU
`"art. X" / "§ Y" / przesłanki / wykładnia / "czy mnie dotyczy"`
→ PRIMARY: `view analizator-przepisow-v2/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2`, `pisma-procesowe-v3`

### [10] BEZ KLASYFIKACJI — ROUTER DZIEDZINOWY
`mandat / ZUS / alimenty / stalking / mobbing / eksmisja / deweloper / upadłość / RODO
/ zatrzymanie / mediacja / komornik / rozwód / zachowek / AI Act / sprawa wielodziedzinowa`
→ PRIMARY: `view prawo-polskie-v2/SKILL.md`

### [11] WERYFIKACJA CUDZEGO MATERIAŁU PRAWNEGO — KLUCZ / OPINIA / CUDZA ANALIZA
`"porównaj z kluczem" / "oto klucz odpowiedzi" / "sprawdź tę opinię" / "zweryfikuj tę
analizę" / "czy te przepisy się zgadzają" / "co jest nie tak w tym piśmie" / recenzja
cudzego opracowania / notatki egzaminacyjne / materiał z innego AI do sprawdzenia`
→ PRIMARY: `view analizator-przepisow-v2/SKILL.md`
→ SECONDARY: właściwy `dr-XX` domeny materiału (merytoryka) + `orzeczenia-sadowe-v2`
  (gdy materiał powołuje sygnatury) · FALLBACK: `przewodnik-prawny-v2`
→ OBOWIĄZKOWO: `view references/AUDYT-KLUCZA-ODPOWIEDZI.md` i wykonaj protokół
  K0–K6 przed sformułowaniem werdyktu porównawczego.

Materiał wejściowy traktuj jako hipotezę do sprawdzenia. Ziarnistość, rejestr
pokrycia, test spójności i werdykty są kanonicznie opisane w pliku K0–K6.

Przy nakładaniu się skilli: `view shared/ACTIVATION-MATRIX.md`.

**Routing BJ–BW (ZUS / niepełnosprawność / zawody zaufania):**
`view prawny-router-v3/references/ROUTING-BJ-BW.md`

**Zasada odciążenia routera:** Router NIE jest bazą prawa materialnego — tylko orkiestruje.
Nie dubluj treści modułów dziedzinowych w routerze.

---

## KROK 5–6 — SEKWENCJA END-TO-END

```
CZY WYNIK TO PISMO [3] lub [4]?
├── TAK
│   ├── ⛔ Materiały źródłowe? TAK → view shared/FAKTY_v2.md (F0-F3)
│   │                           NIE → każdy fakt bez źródła = ⬛ [UZUPEŁNIJ]
│   ├── pisma-procesowe-v3 lub pisma-proste-v2 → treść
│   ├── HYBRID-VALIDATION (policz ⬛) → view shared/HYBRID-VALIDATION.md
│   ├── view HOST_CAPABILITY[document_generation] → generuj .docx → present_files
│   └── Instrukcja złożenia (LAIK: "Wydrukuj i złóż w sądzie...")
├── ANALIZA / RAPORT?
│   ├── LAIK → przewodnik-prawny-v2 (KROK H) → widget + opcje
│   └── PRAWNIK → surowy raport → "Czy wygenerować pismo?"
└── ORZECZNICTWO? → Linki do baz + cytowania → opcja "Dołącz do pisma"
```

**BRAMKA CHRONOLOGICZNA** (auto, przed KROK 4):
Wczytaj gdy ≥2 dokumenty wieloetapowe LUB słowa kluczowe ("chronologia"/"oś czasu"/"timeline"):
`view chronologia-sprawy-v1/SKILL.md`

---

## REGUŁY NADRZĘDNE

- **Reguła 1 — wejście:** router jest pierwszym krokiem; wczytaj PRIMARY przed analizą.
- **Reguła 1C — pliki:** wykonaj KROK 0C i PD0; status krytyczny blokuje analizę.
- **Reguła 2 — anonimizacja:** zamknij KROK 0A przed analizą.
- **Reguła 3 — HARD GATE:** przed analizą wykonaj KROK 1B.
- **Reguła 4 — niejednoznaczność:** zadaj jedno pytanie, nie zakładaj trybu.
- **Reguła 5 — kreator:** żądanie kreatora uruchamia go natychmiast.
- **Reguła 6 — pismo:** deleguj do właściwego skilla i wygeneruj `.docx`.
- **Reguła 7 — LAIK:** raport przez `przewodnik-prawny-v2`, KROK H.
- **Reguła 7B — menu:** pytanie o możliwości → przewodnik, KROK M.
- **Reguła 7C — Q&A:** pytania użytkownika → przewodnik, KROK Q.
- **Reguła 8 — termin:** termin zawity sprawdź przed pozostałymi kwestiami.
- **Reguła 9 — trwałość HARD GATE:** każda tura podlega `shared/PRAWO-HARDGATE.md`.
- **Reguła 10 — walidacja:** przed generowaniem wykonaj HYBRID-VALIDATION; zero ⬛ przed oddaniem.
- **Reguła 11 — dostawa:** `present_files` po walidacji, przed disclaimerem.
- **Reguła 11a — kroki:** wykonaj ST-INIT i blokujące ST-FINAL z `shared/MOD-STEP-TRACKER.md`.
- **Reguła 12 — chronologia:** przy ≥2 dokumentach wieloetapowych wykonaj bramkę chronologiczną.
- **Reguła 14 — ślad weryfikacji:** wykonaj `shared/WERYFIKACJA-SLAD.md`.
- **Reguła 15 — sygnatury:** wykonaj `shared/SYGNATURY.md`.
- **Reguła 16 — disclaimer:** wykonaj KROK 7.

### Reguły wykonawcze 17–27

- **Reguła 17 — V10:** przy analizie pisma przeciwnika wczytaj
  `pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md`.
- **Reguła 18 — PRE-W2:** przed W2 każdego pisma wczytaj
  `shared/PRE-W2-VERIFICATION-GATE.md`; zweryfikuj online sąd, organ i podmioty.
- **Reguła 19 — strategia:** dla pisma z ≥2 ścieżkami lub anomalią podmiotową wczytaj
  `shared/MOD-STRATEGIA-WYBOR.md` przed W1.3.
- **Reguła 20 — checkpointy:** wykonuj `shared/CP-GATE.md`; po STOP zakończ turę.
- **Reguła 20a — status pisma:** DRAFT/FINAL i checkpointy pisma prowadzi `pisma-procesowe-v3`.
- **Reguła 21 — zlecenie złożone:** przypisz PRIMARY osobno każdemu komponentowi i nie
  omijaj checkpointu jednego komponentu z powodu równoległego wykonania innych.
- **Reguła 22 — świadek:** frazy „pytania do świadka”, „przesłuchanie”,
  „kontrprzesłuchanie” lub ich synonimy wymagają przed odpowiedzią odczytu
  `przesluchanie-swiadkow-v2-min90/SKILL.md` i wejścia od PRE-W1a.
- **Reguła 23 — re-check każdej tury:** jeżeli odpowiedź wspomina, potwierdza, koryguje
  albo ocenia przepis, sygnaturę lub kwalifikację, ponownie wykonaj HARD GATE
  dla każdego powołania w tej turze.
- **Reguła 24 — VER-GRAIN:** przed wysłaniem zinwentaryzuj osobno każdą jednostkę
  redakcyjną, wartość liczbową, datę, status i sygnaturę; każda pozycja musi
  mieć własne pokrycie źródłowe albo własny znacznik `⚠️ [NIEWERYFIKOWANE]`.
  Rozbieżność źródeł wymaga kontroli temporalnej z
  `shared/TEMPORAL-LAW-CHECK.md`.
- **Reguła 25 — cudzy materiał:** kategoria [11] i
  `references/AUDYT-KLUCZA-ODPOWIEDZI.md`; materiał nie jest źródłem prawa.
- **Reguła 26 — skill nie jest źródłem:** moduł wskazuje, który przepis sprawdzić, ale nie
  zastępuje świeżego odczytu źródła.
- **Reguła 27 — audyt klucza:** werdykt „PEŁNA ZGODNOŚĆ” jest dozwolony wyłącznie przy
  `P=N`, `O=0`, `U=0` i rachunku `P + O + U = N`.

---

## SELF-CHECK (przed każdą odpowiedzią)

Wykonaj w całości: `view prawny-router-v3/references/SELF-CHECK.md`.

Bramki blokujące:

- anonimizacja zamknięta;
- PRIMARY faktycznie wczytany i ślad KROKU 3A zgodny z wywołaniami;
- każdy URL ma znacznik RZĄD;
- każde powołanie ma świeżą weryfikację lub własne `⚠️ [NIEWERYFIKOWANE]`;
- VER-GRAIN i właściwe reguły warunkowe wykonane;
- aktywne checkpointy, PRE-W2, RPK i ST-FINAL zamknięte;
- disclaimer jest ostatnim elementem odpowiedzi prawnej.

Niespełnienie któregokolwiek punktu → STOP; wykonaj brakujący krok albo uruchom
jawny TRYB ZDEGRADOWANY.

## RENDEROWANIE WIDGETÓW

> Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai.
> Jedyna poprawna metoda inline: `show_widget` z HTML (vanilla JS).
> Pliki .docx / .pdf → present_files (dokumenty do pobrania — tu zasada nie dotyczy).

**Anonimizer — aktualny standard:**
`view prawny-router-v3/anonimizer/anonimizer-skill.md`

---

## POKRYCIE DZIEDZINOWE (wczytuj tylko gdy potrzebne)

```text
view prawny-router-v3/references/pokrycie-dziedzinowe.md
```

Tylko gdy: pytanie o dostępność modułu, audyt systemu, budowanie kombinacji multi-skill.

## CHANGELOG

`view prawny-router-v3/references/CHANGELOG.md`
