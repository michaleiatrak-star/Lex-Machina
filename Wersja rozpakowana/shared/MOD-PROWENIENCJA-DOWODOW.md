# MOD-PROWENIENCJA-DOWODOW — Analiza proweniencji i wspólnego pochodzenia dowodów

> **Wersja:** 1.0.0 | **Status:** PRODUKCJA — plik kanoniczny shared/
> **Wywoływany z:**
>   - `analizator-dowodow-v3` SKILL.md §BLOK-PROWENIENCJA (trigger: ≥3 dowodów)
>   - `analizator-dowodow-v3` modules/MP6-sledczy.md §6.12 (trigger: podejrzenie
>     wspólnego źródła lub manipulacji proweniencją)
>   - `pisma-procesowe-v3` W1.2c po MOD-MACIERZ-DOWOD-TEZA gdy ≥2 dowody klasy C/D
>     wymagają weryfikacji autentyczności
>
> **Cel:** wykryć, że dwa lub więcej pozornie niezależnych dowodów pochodzi
> z tego samego systemu, autora, urządzenia lub procesu — i ocenić procesowe
> konsekwencje tej zależności.
>
> ⛔ HARD GATE: wnioski proweniencyjne są hipotezami [H-PROW] do czasu
> potwierdzenia dowodem technicznym (opinia biegłego, metadane, log systemowy).
> NIGDY nie stwierdzaj wspólnego źródła jako faktu bez potwierdzenia klasy A lub G.

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Dwa dowody mogą być formalnie odrębnymi plikami/dokumentami, a faktycznie
pochodzić z jednego systemu, jednej osoby lub jednej operacji. To ma
krytyczne konsekwencje procesowe:

**Scenariusz 1 — Wzmocnienie:** D-001 (xlsx z HR) i D-007 (e-mail prezesa)
pochodzą z tego samego systemu HRAppka → wzajemnie potwierdzają fakty
jako niezależne kanały tego samego rejestru → siła dowodowa rośnie.

**Scenariusz 2 — Osłabienie:** D-003 (zeznanie świadka A) i D-009 (zeznanie
świadka B) zawierają identyczne sformułowania → świadkowie mogli uzgodnić
treść lub korzystali ze wspólnego szablonu → niezależność zeznań wątpliwa.

**Scenariusz 3 — Wykrycie manipulacji:** D-012 i D-013 mają ten sam czas
modyfikacji w metadanych → dokumenty "z różnych dat" mogły być tworzone
w jednej sesji → [H-PROW] antydatowanie lub fabrykacja.

**Scenariusz 4 — Wzmocnienie przez triangulację:** D-001 (system IT), D-004
(komunikator), D-011 (zeznanie świadka z tego działu) wskazują na ten sam
fakt z trzech niezależnych kanałów → triangulacja klasy BEZSPORNE.

---

## TAKSONOMIA TYPÓW PROWENIENCJI

### TYP 1 — Wspólny system informatyczny (SYS)

```
Definicja: ≥2 dowody pochodzą z tego samego systemu IT (HRAppka, CRM, ERP,
           system kadrowy, komunikator firmowy, platforma chmurowa).

Sygnały wykrycia:
  SYS-1: identyczny format danych (nagłówki kolumn, kody pól, typy dat)
  SYS-2: ciągła numeracja rekordów bez przerw między plikami
  SYS-3: te same identyfikatory systemowe (ID pracownika, numer zlecenia)
         pojawiające się w różnych dokumentach
  SYS-4: te same metadane systemowe (nazwa serwera, wersja oprogramowania,
         kodowanie znaków, format pliku)
  SYS-5: ten sam schemat błędów/anomalii (np. ta sama litera "o" zamieniona
         na zero w kodach we wszystkich plikach z jednego systemu)
  SYS-6: eksport z tego samego raportu — identyczna struktura wierszy/kolumn,
         te same puste pola, te same domyślne wartości

Konsekwencje procesowe:
  (+) Wzajemne potwierdzenie → triangulacja → klasa BEZSPORNE dla faktu
      wspólnego dla obu dokumentów
  (+) Trudność zaprzeczenia przez przeciwnika — "dwa dokumenty kłamią tak samo"
      wymaga wyjaśnienia
  (-) Oba dokumenty mogą być kwestionowane razem jeśli system był kontrolowany
      przez jedną stronę → wniosek o biegłego IT (art. 278 KPC)

Wniosek dowodowy:
  "Zobowiązanie do przedłożenia logów systemowych / eksportu pełnego z [system]
   za okres [daty] — w celu weryfikacji integralności danych"
```

### TYP 2 — Wspólny komunikator / kanał elektroniczny (KOM)

```
Definicja: ≥2 dowody to wiadomości z tego samego kanału (WhatsApp, RCS,
           e-mail, Teams, Slack) między tymi samymi lub powiązanymi osobami.

Sygnały wykrycia:
  KOM-1: ten sam identyfikator nadawcy/odbiorcy (numer, adres e-mail, profil)
  KOM-2: ciągłość konwersacji — numery wiadomości, wątki, reply-to
  KOM-3: te same metadane techniczne (serwer, nagłówki SMTP, protokół)
  KOM-4: spójność czasowa — wiadomości układają się w logiczną sekwencję
  KOM-5: te same skróty, emoji, styl pisania → lingwistyczny fingerprint
         (patrz TYP 6 — podobieństwo tekstu)

Konsekwencje procesowe:
  (+) Sieć komunikacji tworzy "łańcuch świadomości" — kto wiedział co i kiedy
  (+) Wiadomości od jednej osoby potwierdzają autentyczność wzajemnie
  (-) Zrzuty ekranu bez metadanych nagłówkowych → ryzyko zakwestionowania
      autentyczności → [RF RYZYKO FORMALNE] w macierzy D×T

Wniosek dowodowy:
  "Zobowiązanie do złożenia pełnej historii konwersacji [kanał] za okres [daty]
   wraz z metadanymi technicznymi (nagłówki, czas serwera, hash wiadomości)"
```

### TYP 3 — Wspólni świadkowie / środowisko zawodowe (ZAW)

```
Definicja: ≥2 świadków pracuje/pracowało w tym samym miejscu, dziale,
           firmie lub pozostaje w zależności służbowej od tej samej osoby.

Sygnały wykrycia:
  ZAW-1: ta sama firma/oddział/dział w dokumentach rejestrowych lub umowach
  ZAW-2: ta sama linia podległości (zeznają o tym samym przełożonym)
  ZAW-3: świadkowie wymieniani w dokumentach wzajemnie lub razem
  ZAW-4: te same zdarzenia opisywane z perspektywy "obserwatora z tego samego
         miejsca" — ten sam kąt widzenia, te same pominięcia
  ZAW-5: zbieżność w czasie zeznań (złożone w krótkim odstępie — ryzyko koordynacji)

Konsekwencje procesowe:
  (+) Świadek z ZAW jest D-klasą świadka bezpośredniego (klasa D) — wyżej
      niż świadek ze słyszenia (klasa E)
  (-) Zależność służbowa → ryzyko stronniczości → [LOJ-001] karta lojalnościowa
      (MP6-sledczy §6.5)
  (-) Wspólne środowisko → ryzyko uzgodnienia treści zeznań → [H-PROW]
      jeśli zeznania zawierają identyczne sformułowania (patrz TYP 6)

Wniosek dowodowy:
  "Wniosek o przesłuchanie świadka [X] z uwzględnieniem jego powiązań
   służbowych z pozwaną — pytania o podległość, oceny pracownicze, naciski"
```

### TYP 4 — Wspólny autor / redaktor (AUT)

```
Definicja: ≥2 dokumenty mają tego samego autora, redaktora lub
           były tworzone na tym samym szablonie przez tę samą osobę.

Sygnały wykrycia:
  AUT-1: metadane dokumentu (pole "Author", "Created by", "Last modified by")
  AUT-2: te same makra, style, czcionki, marginesy — identyczna konfiguracja
         edytora tekstu
  AUT-3: te same typograficzne nawyki (dwukropek po "Zatem:", brak spacji przed
         nawiasem, specyficzne skróty)
  AUT-4: te same błędy ortograficzne/interpunkcyjne powtarzające się w różnych
         dokumentach "od różnych autorów"
  AUT-5: revision history / track changes wskazujący na wspólnego redaktora

Konsekwencje procesowe:
  (+) Identyfikacja autora ukrytego dokumentu (np. kto napisał "pismo z zarządu"
      podpisane przez figuranta)
  (-) Jeśli dokumenty miały być "od różnych stron" a mają tego samego autora
      → [H-PROW] zmowa lub kontrolowany przekaz
  (-) Wniosek o biegłego grafologa lub eksperta od metadanych

Wniosek dowodowy:
  "Wniosek o dopuszczenie dowodu z opinii biegłego z zakresu informatyki
   śledczej na okoliczność autorstwa i daty faktycznego utworzenia dokumentu"
```

### TYP 5 — Wspólne urządzenie / lokalizacja (URZ)

```
Definicja: ≥2 dowody zostały wytworzone na tym samym urządzeniu lub
           w tej samej lokalizacji fizycznej/sieciowej.

Sygnały wykrycia:
  URZ-1: te same dane EXIF (aparat, GPS, czas strefy) w zdjęciach/skanach
  URZ-2: ten sam adres IP/MAC w nagłówkach e-mail lub logach systemowych
  URZ-3: ten sam numer seryjny urządzenia w metadanych dokumentu
  URZ-4: ta sama sieć Wi-Fi lub serwer proxy w danych technicznych
  URZ-5: te same artefakty skanowania (ten sam skaner, te same plamy, rysy)
         w dokumentach "oryginalnych"

Konsekwencje procesowe:
  (+) Lokalizacja dokumentu w konkretnym biurze/urządzeniu → potwierdza
      kto miał dostęp
  (-) Dokumenty "z różnych miejsc" wytworzone na jednym urządzeniu →
      [H-PROW] fabrykacja lub nieujawniony pośrednik
  (+/-) Wspólna lokalizacja = wspólna odpowiedzialność podmiotowa

Wniosek dowodowy:
  "Zabezpieczenie logów sieciowych [serwer/router] za okres [daty] oraz
   metadanych EXIF dokumentów wskazujących na urządzenie i lokalizację"
```

### TYP 6 — Podobieństwo tekstu / lingwistyczny fingerprint (LIN)

```
Definicja: ≥2 dokumenty zawierają identyczne lub bardzo podobne fragmenty
           tekstu wskazujące na wspólny szablon, autora lub koordynację treści.

Sygnały wykrycia:
  LIN-1: identyczne zdania lub akapity w dokumentach "różnych autorów"
  LIN-2: ten sam schemat argumentacyjny (ta sama kolejność punktów,
         te same nagłówki, te same przejścia logiczne)
  LIN-3: te same błędy merytoryczne (ta sama błędna data, ta sama mylna
         kwalifikacja prawna) → wskazuje na wspólne źródło błędu
  LIN-4: ten sam styl formalny (forma grzecznościowa, podpis, układ pisma)
         w dokumentach "z różnych stron"
  LIN-5: te same sformułowania nieformalne / slang / skróty w pismach
         pozornie oficjalnych

Techniki detekcji:
  PODEJŚCIE A — Porównanie dokładne (exact match):
    Szukaj zdań identycznych co do słowa między dokumentami.
    Próg: ≥15 słów identycznych = znaczące podobieństwo.

  PODEJŚCIE B — Porównanie strukturalne:
    Porównaj schemat akapitów: czy kolejność tematów jest identyczna?
    Każdy akapit w D-001 ma odpowiednik w D-002 o tej samej treści?

  PODEJŚCIE C — Analiza błędów:
    Zbierz listę błędów (ortograficznych, merytorycznych, dat) z D-001.
    Sprawdź czy te same błędy pojawiają się w D-002.
    Identyczny błąd = wspólne źródło (niemal pewne).

  PODEJŚCIE D — Fingerprint leksykalny:
    Wypisz 10-15 charakterystycznych słów/zwrotów z D-001 (rzadkich,
    specyficznych dla autora). Sprawdź czy D-002 zawiera ≥5 z nich.

Konsekwencje procesowe:
  (-) Zeznania świadków z identycznymi fragmentami → utrata niezależności →
      siła dowodowa spada do klasy E (poniżej klasy D świadka bezpośredniego)
  (-) Pisma procesowe z identycznymi tezami jak dokumenty strony przeciwnej
      → sugestia dostępu do informacji poufnych lub koordynacji
  (+) Identyczne błędy w dokumentach "od różnych podmiotów" → dowód
      wspólnego źródła → argument za tezą o jednym pracodawcy rzeczywistym
      (przykład: HRAppka w VII P 94/25)

⛔ ZAKAZ: nie utożsamiaj podobieństwa tekstu z dowodem fabrykacji.
  Podobieństwo → [H-PROW]. Fabrykacja → wymaga dowodu klasy A lub G.
```

### TYP 7 — Wspólny łańcuch przechowywania (CHAIN)

```
Definicja: ≥2 dowody przeszły przez te same ręce / systemy przed dotarciem
           do postępowania — ich łańcuch custody (przechowywania) jest wspólny.

Sygnały wykrycia:
  CHAIN-1: te same stemple, pieczęcie, adnotacje na dokumentach z różnych dat
  CHAIN-2: dokumenty "różnych stron" składane razem w jednej kopercie/segregatorze
  CHAIN-3: te same braki formalne (brak numeru strony na tej samej stronie,
            brak podpisu w tym samym miejscu) — wskazuje na jednokrotne kopiowanie
  CHAIN-4: ślady digitalizacji (ten sam skaner, ta sama kolejność skanowania
            dokumentów z "różnych źródeł")
  CHAIN-5: przerwy w numeracji lub kolejności dokumentów w aktach sugerujące
            selektywne włączanie / wyłączanie

Konsekwencje procesowe:
  (+/-) Wspólny chain of custody może wzmacniać lub osłabiać w zależności
       od tego kto go kontrolował
  (-) Jeśli łańcuch był w rękach jednej strony → ryzyko manipulacji selekcją
      → pytanie o kompletność materiału
```

---

## PROCEDURA GŁÓWNA: PR1 → PR2 → PR3 → PR4 → PR5

### PR1 — INWENTARYZACJA PROWENIENCYJNA

```
Dla każdego dowodu D-NNN z rejestru DTA-ID-MODE (lub Lp. przy małych sprawach):

  [D-NNN | nazwa | typ | klasa A-G]
  Dane proweniencyjne (wypełnij co dostępne):
    Autor/system:     [kto/co wytworzyło]
    Data wytworzenia: [data dokumentu vs data metadanych — czy spójne?]
    Kanał:            [sposób dostarczenia do akt]
    Przechowywanie:   [kto miał dostęp przed złożeniem do akt]
    Metadane:         [dostępne / niedostępne / wymagają żądania]
    Zależność:        [od kogo dokument pochodzi formalnie?]

Format skrócony (inline gdy <5 dowodów):
  D-001 | xlsx HR | B | autor: system HRAppka | meta: dostępne
  D-007 | RCS Park | C | autor: J.Park | meta: zrzut ekranu — brak nagłówków
```

### PR2 — SKAN PODOBIEŃSTWA (para po parze)

```
Dla każdej pary (Di, Dj) gdzie i < j:

KROK PR2.1 — Test SYS (wspólny system):
  Czy Di i Dj mają te same: format, kody pól, numerację, metadane systemowe?
  → TAK: oznacz [SYS] | → NIE: pomiń

KROK PR2.2 — Test KOM (wspólny kanał):
  Czy Di i Dj to wiadomości z tego samego kanału/wątku?
  → TAK: oznacz [KOM] | → NIE: pomiń

KROK PR2.3 — Test ZAW (wspólne środowisko zawodowe):
  Czy autorzy/świadkowie Di i Dj pracowali w tym samym miejscu?
  → TAK: oznacz [ZAW] z oceną ryzyka stronniczości (niska/średnia/wysoka)

KROK PR2.4 — Test LIN (podobieństwo tekstu):
  Zastosuj Podejścia A-D z TYP 6.
  → ≥1 hit: oznacz [LIN-N] z cytatem i lokalizacją w obu dokumentach

KROK PR2.5 — Test AUT (wspólny autor):
  Czy metadane lub nawyki lingwistyczne wskazują na tego samego autora?
  → TAK: oznacz [AUT] z uzasadnieniem

KROK PR2.6 — Test URZ/CHAIN (urządzenie / custody):
  Czy EXIF, nagłówki, artefakty skanowania wskazują na wspólne urządzenie?
  → TAK: oznacz [URZ] lub [CHAIN]

WYNIK PR2: lista par z typem proweniencji:
  (D-001, D-011): [SYS] — wspólny system HRAppka
  (D-004, D-009): [LIN-3] — identyczne błędy daty w obu zeznaniach
  (D-002, D-003): [ZAW] — obaj świadkowie: dział HR, podległość tej samej osobie
```

### PR3 — KLASYFIKACJA KONSEKWENCJI

```
Dla każdej wykrytej pary z PR2:

KLASA P-PLUS (proweniencja wzmacniająca):
  Warunek: Di i Dj potwierdzają ten sam fakt F-NNN i ich wspólne źródło
           jest niezależne od strony kwestionującej ten fakt.
  Efekt: fakt F-NNN awansuje do klasy BEZSPORNE lub PEWNE.
  Format: P+: (D-001, D-011) [SYS-niezależny] → F-102 ↑ BEZSPORNE

KLASA P-MINUS (proweniencja osłabiająca):
  Warunek: Di i Dj były w rękach lub pod kontrolą jednej strony i ich
           "niezależność" jest pozorna.
  Efekt: oba dokumenty tracą niezależność → traktuj jak jeden dowód.
  Format: P-: (D-004, D-009) [LIN-3] → [H-PROW] koordynacja treści zeznań

KLASA P-NEUTRAL (proweniencja kontekstowa):
  Warunek: wspólne źródło znane obu stronom, nie wpływa na siłę dowodową.
  Efekt: odnotuj dla kompletności rejestru.
  Format: P0: (D-002, D-003) [ZAW] → świadkowie z jednego działu, znane obu stronom

KLASA P-ALERT (proweniencja wymagająca wyjaśnienia):
  Warunek: sygnał wspólnego źródła jest nieoczekiwany lub niezgodny z deklaracją.
  Efekt: [H-PROW] + wniosek dowodowy o wyjaśnienie.
  Format: P!: (D-012, D-013) [URZ-1] — metadane EXIF: ten sam czas modyfikacji
          → [H-PROW] antydatowanie? → wniosek o biegłego IT
```

### PR4 — RAPORT PROWENIENCYJNY

```
════════════════════════════════════════════════════════════════
RAPORT PROWENIENCJI DOWODÓW
Sprawa: [sygnatura] | Data: [data] | Dowodów przeskanowanych: [N]
════════════════════════════════════════════════════════════════

KLASTRY ŹRÓDŁOWE (grupy dowodów o wspólnym pochodzeniu):

  KLASTER A — [SYS: nazwa systemu / KOM: nazwa kanału / ZAW: nazwa miejsca]:
    Dowody: D-001, D-004, D-011
    Typ powiązania: [TYP 1-7]
    Klasa konsekwencji: P+ / P- / P0 / P!
    Fakt wzmocniony / osłabiony: F-NNN [opis]
    [H-PROW jeśli P- lub P!]: [hipoteza]

  KLASTER B — ...

FAKTY AWANSOWANE (P+ → wyższa klasa pewności):
  F-102: ciągła numeracja pracowników → BEZSPORNE (D-001 [SYS] + D-011 [SYS])

FAKTY ZDEGRADOWANE (P- → niższa wiarygodność):
  F-205: zeznanie świadka A o dacie → SPORNE
         (D-004 [LIN-3 z D-009] → utrata niezależności)

ALERTY PROWENIENCYJNE (P!):
  [H-PROW-1]: (D-012, D-013) — ten sam czas modyfikacji mimo różnych dat
              → możliwe antydatowanie → wniosek o biegłego IT

WNIOSKI DOWODOWE WYNIKAJĄCE Z PROWENIENCJI:
  [1] Zobowiązanie do przedłożenia: [opis]
  [2] Wniosek o biegłego: [specjalność, teza dowodowa]
  [3] Pytania do świadka: [wynikające z ZAW lub LIN]

TRIANGULACJA (fakty potwierdzone ≥3 niezależnymi klasami):
  F-101: [opis faktu] → D-001 [SYS/B] + D-007 [KOM/C] + D-002 [ZEZ-SWI/D]
         = TRIANGULACJA KLASY BEZSPORNE
════════════════════════════════════════════════════════════════
```

### PR5 — INTEGRACJA Z PIPELINE

```
→ DTA-ID-MODE (analizator-dowodow-v3):
    Aktualizuj pole klasy pewności F-NNN na podstawie wyników PR3.
    Klastry SYS / KOM dokumentuj jako proweniencję w DTA-1 (rejestr D-NNN).

→ MOD-MACIERZ-DOWOD-TEZA §SIŁA_D:
    Dowody z P+ → podwyższ wagę ●● → ●●● jeśli triangulacja ≥3 niezależnych.
    Dowody z P- → obniż wagę ●●● → ●● i oznacz RS (ryzyko sporności).

→ analizator-dowodow-v3 BLOK-KONSEKWENCJE:
    Dla każdego klastra P+: dodaj konsekwencję C-X.3 (strategiczną):
    "Wspólne źródło D-NNN i D-NNN → fakt F-NNN nie wymaga odrębnego dowodzenia"

→ pisma-procesowe-v3 W1.3:
    Fakty BEZSPORNE z P+ → sekcja "Fakty bezsporne" pisma (bez dowodzenia).
    Alerty P! → sekcja wniosków dowodowych (art. 248 KPC / biegły art. 278 KPC).

→ MP6-sledczy §6.12:
    Alerty P! i hipotezy [H-PROW] → rejestr hipotez śledczych z protokołem
    weryfikacji (co musi paść na rozprawie, co można zweryfikować OSINT).
```

---

## TRIGGERY AKTYWACJI

```
OBOWIĄZKOWY (auto-trigger):
  ≥3 dowodów klasy C lub D (korespondencja, zeznania) w tej samej sprawie
  LUB DTA-ID-MODE aktywny (≥5 plików)
  LUB ≥2 świadkowie z tego samego miejsca pracy / działu

ZALECANY:
  Dowody od tej samej strony pozornie "z różnych źródeł"
  Zeznania zawierające identyczne lub bardzo podobne sformułowania
  Dokumenty z datami budzącymi wątpliwości chronologiczne

NA ŻĄDANIE:
  Użytkownik mówi: "sprawdź czy to z jednego systemu", "czy te zeznania
  są skoordynowane", "skąd pochodzi ten dokument", "czy to ten sam autor"
```

---

## SELF-CHECK

```
□ PR1: każdy dowód ma wypełnione dane proweniencyjne (autor/system/kanał)?
□ PR2: każda para przeskanowana pod wszystkie 6 typów (SYS/KOM/ZAW/LIN/AUT/URZ)?
□ PR2.4: przy LIN podany cytat dosłowny i lokalizacja w obu dokumentach?
□ PR3: każda para sklasyfikowana P+/P-/P0/P!?
□ PR4: raport zawiera klastry, fakty awansowane/zdegradowane, alerty P!?
□ PR4: hipotezy oznaczone [H-PROW] (nie jako fakty)?
□ PR5: wyniki skierowane do DTA-ID-MODE, macierzy D×T i BLOK-KONSEKWENCJE?
□ PR5: dla każdego P! — konkretny wniosek dowodowy (art. 248 / biegły)?
Którykolwiek = NIE → wróć do brakującego kroku.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Przyczyna: system nie miał mechanizmu wykrywania wspólnego źródła i proweniencji
dowodów. MET-NET (MOD-METODY-BADAWCZE) mapuje relacje podmiotów, nie
łańcuchy źródłowe dokumentów. MP6-sledczy (analizator-dowodow-v3) zawiera
OSINT i HUMINT, ale bez systematycznej taksonomii typów proweniencji i procedury
skanowania par D-NNN. Moduł implementuje DTA Warstwę 4 (Pochodzenie faktu) jako
standard systemowy dostępny dla analizatora, pism procesowych i MP6.
Taksonomia: 7 typów (SYS/KOM/ZAW/AUT/URZ/LIN/CHAIN), 4 klasy konsekwencji
(P+/P-/P0/P!), procedura PR1-PR5 z integracją DTA-ID-MODE i BLOK-KONSEKWENCJE.
```
