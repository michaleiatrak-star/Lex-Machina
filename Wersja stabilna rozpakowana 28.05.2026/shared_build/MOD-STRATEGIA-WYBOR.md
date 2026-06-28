# MOD-STRATEGIA-WYBOR — Obligatoryjna ocena i ranking ścieżek strategicznych

> **Plik:** `/mnt/skills/user/shared/MOD-STRATEGIA-WYBOR.md`
> **Wersja:** 1.0.0 (2026-06-21)
> **Status:** PRODUKCJA
> **Pozycja w pipeline:** W1.2b — między W1.2a (CLAIM-VALIDATION) a W1.3
>   (mapa cel→przesłanka→dowód). Zastępuje dotychczasową opcjonalną aktywację
>   MOD-WARIANTY-POZWU dla spraw złożonych. Współistnieje z MOD-WARIANTY-POZWU
>   jako jego nadrzędna warstwa — wywołuje go jako generator kart wariantów.
> **Wywołanie:** pisma-procesowe-v3, krok W1.2b (ZAWSZE dla pism złożonych)

---

## DLACZEGO TEN MODUŁ ISTNIEJE

### Luka zidentyfikowana po analizie sesji VII P 94/25

System posiadał fragmentaryczne narzędzia oceny ścieżek:
- MOD-WARIANTY-POZWU: generuje warianty, ale aktywowany warunkowo, bez rankingu
- MOD-ATAK-NA-DRAFT: ocenia gotowy draft, czyli PO wyborze ścieżki — za późno
- MOD-RED-TEAM-WLASNY: atakuje ramy, aktywowany warunkowo

**Brakujące ogniwo:** żaden z modułów nie zawierał zasady:
  *"Oceń WSZYSTKIE ścieżki pod kątem ataku przeciwnika PRZED wyborem jednej,
   a następnie wybierz obligatoryjnie ścieżkę najsilniejszą — porzucając słabszą."*

W rezultacie model mógł wybrać ścieżkę domyślną bez explicite porównania
alternatyw i bez rekomendacji opartej na ocenie ryzyk.

### Zasada naczelna tego modułu

```
⛔ ZASADA BEZWZGLĘDNA: Nigdy nie wchodź w W1.3 z jedną ścieżką jeśli
   zidentyfikowano ≥2 ścieżki — dopóki nie zostały ocenione i nie wybrano
   najsilniejszej z podaniem uzasadnienia.

ZASADA SELEKCJI: Przy wykryciu sprzeczności między ścieżkami (jedna silna,
   jedna słaba) — system OBLIGATORYJNIE rekomenduje ścieżkę silniejszą i
   PORZUCA słabszą. Użytkownik może to zmienić, ale decyzja jest explicite,
   nie domyślna.

ZASADA HIERARCHII ATAKÓW: Ścieżka z atakiem 🔴 od przeciwnika bez kontrargumentu
   MUSI zostać albo wzmocniona, albo zdegradowana do ewentualnej,
   albo porzucona — nigdy nie staje się ścieżką główną bez adresowania ataku.
```

---

## WARUNEK AKTYWACJI

```
AKTYWUJ ZAWSZE gdy pismo złożone (Test C w pisma-procesowe-v3), ORAZ:
  ✓ zidentyfikowano ≥2 możliwe ścieżki prawne / podstawy roszczenia, LUB
  ✓ w materiale dowodowym lub aktach widoczna jest sprzeczność / anomalia
    podmiotowa (różne KRS, NIP, nazwy przy tym samym stosunku prawnym), LUB
  ✓ jedno żądanie ma alternatywną podstawę prawną (np. art. X KP i art. Y KC), LUB
  ✓ materiał dowodowy wskazuje na potencjalny kontratak przeciwnika 🔴/🟠.

NIE aktywuj gdy:
  - pismo proste (Test B) — jedno roszczenie, jedna podstawa, brak alternatyw
  - MOD-WARIANTY-POZWU już zamknięty w tej sesji z identycznym wejściem

Gdy aktywny: wywołuje MOD-WARIANTY-POZWU jako generator kart (§2.2 tamtego modułu).
Gdy nieaktywny: W1.2b pomijane, przejście do W1.3.
```

---

## SEKWENCJA GŁÓWNA: S1 → S2 → S3 → S4 → S5

### S1 — IDENTYFIKACJA ŚCIEŻEK

```
Dla każdego żądania z W1.2a (CLAIM-VALIDATION):

  KROK S1.1 — Lista kandydatów:
    Zidentyfikuj wszystkie możliwe ścieżki prawne dla każdego żądania:
    - podstawa prawna A (przepis / konstrukcja)
    - podstawa prawna B (alternatywna)
    - podstawa C (ewentualna / posiłkowa)

  KROK S1.2 — Anomalie podmiotowe (NOWE — lekcja z VII P 94/25):
    Czy w materiale dowodowym widoczna jest SPRZECZNOŚĆ podmiotowa?
    Przykłady:
      - ta sama nazwa handlowa, różne KRS/NIP w dokumentach
      - podmiot A w umowach 1-2, podmiot B (lub A z błędnym numerem) w 3-5
      - zmiana nazwy vs zmiana podmiotu
    Jeśli TAK:
      → Każda możliwa interpretacja tej sprzeczności = osobna ścieżka
      → Dla każdej: wynikająca podstawa prawna + argument procesowy
      → Przykład: "KRS identyczny" → jeden argument; "błąd pracodawcy" → 
        drugi, silniejszy; "przejście zakładu art. 23¹ KP" → trzeci, autonomiczny

  FORMAT S1:
    ŚCIEŻKA-1: [nazwa] | Podstawa: [przepis ⚠️] | Zależy od: [warunek]
    ŚCIEŻKA-2: [nazwa] | Podstawa: [przepis ⚠️] | Zależy od: [warunek]
    ...
```

### S2 — OCENA KAŻDEJ ŚCIEŻKI POD KĄTEM ATAKU PRZECIWNIKA

```
Dla KAŻDEJ ścieżki z S1 — wykonaj pełną ocenę:

  OCENA-A: Atak przeciwnika (perspektywa pełnomocnika strony przeciwnej)
    "Jak pełnomocnik zaatakuje tę ścieżkę?"
    Matryca: [FAKT] [PRAWO] [LOGIKA] [PROCES]
    Klasyfikacja ataku: 🔴 KRYTYCZNY / 🟠 ISTOTNY / 🟡 UMIARKOWANY / 🟢 BRAK
    Czy istnieje kontratak? TAK [opis] / NIE / CZĘŚCIOWY

  OCENA-B: Własne słabości (perspektywa własnej strony)
    RP — ryzyko prawne: czy przepis stosuje się wprost?
    RD — ryzyko dowodowe: czy mamy dowód dla każdej przesłanki?
    RPC — ryzyko procesowe: prekluzja? przedawnienie? WPS?

  OCENA-C: Siła argumentu
    Skala: ★★★ MOCNY / ★★ UMIARKOWANY / ★ SŁABY
    Uzasadnienie: [1-2 zdania]

  OCENA-D: Wzajemna relacja ścieżek
    Czy ścieżki są: KOMPLEMENTARNE (można łączyć) / ALTERNATYWNE (tylko jedna)
                    / HIERARCHICZNE (A fundament, B ewentualna)
    Czy łączenie ścieżek tworzy sprzeczność wewnętrzną? TAK/NIE
```

### S3 — RANKING I REKOMENDACJA SYSTEMOWA

```
Na podstawie S1 i S2 — wygeneruj ranking wszystkich ścieżek:

RANKING (od najsilniejszej):

  #1 ŚCIEŻKA-[X]: [nazwa]
     Atak przeciwnika: 🔴/🟠/🟡/🟢 [opis]
     Kontratak dostępny: TAK/NIE/CZĘŚCIOWY
     Siła własna: ★★★/★★/★
     REKOMENDACJA SYSTEMOWA: [GŁÓWNA / EWENTUALNA / PORZUĆ]

  #2 ŚCIEŻKA-[Y]: [nazwa]
     ...

UZASADNIENIE RANKINGU:
  "[Ścieżka X] jest silniejsza niż [Y], ponieważ:
   (1) [argument merytoryczny]
   (2) [argument dowodowy]
   (3) atak przeciwnika na [X] jest [klasyfikacja] i możliwy do obalenia przez [kontratak],
       podczas gdy atak na [Y] jest 🔴 bez dostępnego kontrargumentu."

ZASADY RANKINGU:
  - Ścieżka z atakiem 🔴 BEZ kontrargumentu → automatycznie #ostatnia lub PORZUĆ
  - Ścieżka będąca BŁĘDEM PRACODAWCY (np. błędny KRS w jego własnych dokumentach)
    → silniejsza niż ścieżka oparta na "interpretacji" tych samych danych
  - Ścieżka autonomiczna (działa niezależnie od innych) → wyżej niż ścieżka
    zależna od przyjęcia innej hipotezy
  - Trzy ścieżki komplementarne → scalaj w warstwową obronę (Warstwa A/B/C),
    nie wybieraj jednej
```

### S4 — DECYZJA O STRUKTURZE PISMA

```
Na podstawie rankingu S3 — wybierz strukturę:

SCENARIUSZ 1: JEDNA ŚCIEŻKA DOMINUJĄCA (reszta słaba lub zależna)
  → Ścieżka #1 = roszczenie główne
  → Ścieżki #2+ = ewentualne lub porzucone (z uzasadnieniem)
  → Struktura pisma: liniowa

SCENARIUSZ 2: KILKA KOMPLEMENTARNYCH ŚCIEŻEK (każda mocna autonomicznie)
  → WARSTWOWA OBRONA: Warstwa A (najsilniejsza) + B + C
  → Każda warstwa samodzielnie wystarczająca
  → W piśmie: "Niezależnie od przyjęcia przez Sąd kwalifikacji..."
  → Struktura: wielowarstwowa (jak w VII P 94/25 po korekcie)

SCENARIUSZ 3: DWIE ALTERNATYWNE (wzajemnie się wykluczające)
  → Żądanie główne (ścieżka #1) + żądanie ewentualne (ścieżka #2)
  → Explicite oznaczenie alternatywności w petitum
  → Nie ma sprzeczności wewnętrznej gdy żądania oznaczone jako ewentualne

⛔ SCENARIUSZ ZABRONIONY: MIESZANIE ŚCIEŻEK BEZ OZNACZENIA
  Np. twierdzenie jednocześnie "ten sam podmiot" i "przejście zakładu pracy"
  bez wyraźnego: "z ostrożności procesowej, na wypadek nieuwzględnienia
  pierwszego argumentu, powód podnosi alternatywnie..."
  → Sąd i przeciwnik wskażą sprzeczność; osłabia wszystkie ścieżki jednocześnie.
```

### S5 — RAPORT STRATEGII (widoczny użytkownikowi)

```
═══════════════════════════════════════════════════════════
RAPORT STRATEGII — MOD-STRATEGIA-WYBOR
Sprawa: [sygn.] | Pismo: [typ] | Data: [data]
═══════════════════════════════════════════════════════════

ZIDENTYFIKOWANE ŚCIEŻKI:
  [lista z S1]

OCENA KAŻDEJ ŚCIEŻKI:
  [oceny z S2 — skrócone, czytelne]

RANKING I REKOMENDACJA:
  #1 [nazwa] — ★★★ MOCNA | Atak: 🟡/🟢 | Kontratak: TAK
     → REKOMENDACJA: ŚCIEŻKA GŁÓWNA
  #2 [nazwa] — ★★ UMIARKOWANA | Atak: 🟠 | Kontratak: CZĘŚCIOWY
     → REKOMENDACJA: EWENTUALNA / wzmocnij przez [sugestia]
  #3 [nazwa] — ★ SŁABA | Atak: 🔴 | Kontratak: NIE
     → REKOMENDACJA: PORZUĆ (bez dostępnego kontrargumentu)

PROPONOWANA STRUKTURA PISMA:
  [SCENARIUSZ 1/2/3 + opis]

UZASADNIENIE REKOMENDACJI:
  [2-4 zdania dlaczego ta struktura a nie inna]

═══════════════════════════════════════════════════════════
Czy zatwierdzasz proponowaną strukturę?
  TAK / Modyfikuj: [wskaż co zmienić] / Porzuć całą ścieżkę X
═══════════════════════════════════════════════════════════
```

---

## REGUŁA BEZWZGLĘDNA — ŚCIEŻKA SILNIEJSZA ZAWSZE WYGRYWA

```
⛔ ZASADA: Gdy system wykryje dwie ścieżki, z których:
   - ŚCIEŻKA A jest silna (kontratak na atak 🔴 dostępny) ORAZ
   - ŚCIEŻKA B jest słaba (atak 🔴 bez kontrargumentu) LUB sprzeczna z A

   → System OBLIGATORYJNIE rekomenduje A jako główną i B jako ewentualną lub PORZUCA B.
   → System NIE może zbudować pisma na obu ścieżkach jako równorzędnych.
   → Użytkownik może zdecydować inaczej — ale musi to być ŚWIADOMA DECYZJA,
     po przeczytaniu uzasadnienia dlaczego B jest słabsza.

LEKCJA Z VII P 94/25:
   ŚCIEŻKA SŁABA:  "ten sam KRS = ten sam podmiot" → atak 🔴 (KRS należy do HP sp. z o.o.,
                    nie HPG; model zbudował argument bez weryfikacji rejestru)
   ŚCIEŻKA MOCNA:  "błąd KRS po stronie pracodawcy → nie może szkodzić pracownikowi"
                    → atak 🟡 (Ciecierski podniesie, sąd prawdopodobnie oddali)
   ŚCIEŻKA MOCNA:  "art. 23¹ KP — przejście zakładu" → autonomiczna, atak 🟡
   ŚCIEŻKA MOCNA:  "HPG samodzielnie wyczerpała limit 3 umów" → autonomiczna, brak ataku 🔴

   → System powinien był AUTOMATYCZNIE porzucić ścieżkę "ten sam KRS"
     i zbudować warstwową obronę A/B/C z pozostałych trzech.
   → Tego mechanizmu brakowało. Ten moduł go wdraża.
```

---

## INTEGRACJA Z PIPELINE pisma-procesowe-v3

```
SEKWENCJA W1 (zaktualizowana):
  W1.1 Typ i tryb pisma
  W1.2 Teza centralna (wstępna, może ulec zmianie po S3)
  W1.2a CLAIM-VALIDATION (weryfikacja twierdzeń)
  W1.2b MOD-STRATEGIA-WYBOR (TEN MODUŁ) ← nowy punkt spinający
        → wywołuje MOD-WARIANTY-POZWU §2.2 jako generator kart
        → wywołuje MOD-MAPA-PRZEPISOW jako źródło kandydatów przepisów
        → S1 → S2 → S3 → S4 → S5 (RAPORT + pytanie do użytkownika)
        → Po zatwierdzeniu: zaktualizuj W1.2 (teza centralna może się zmienić)
  W1.3 Mapa cel→przesłanka→dowód (dla wybranej struktury z S4)
  W1.4 Lista robocza przepisów
  W1.5 Braki krytyczne
  W1.6 MOD-RED-TEAM-WLASNY

RELACJA z istniejącymi modułami:
  MOD-WARIANTY-POZWU → wywoływany przez S1/S2 jako generator kart wariantów.
                         Nie jest już samodzielnym krokiem W1.2b.
                         Jego self-check §6 → integrowany do S5 raportu.
  MOD-ATAK-NA-DRAFT  → pozostaje w W2.4 jako drugi poziom kontroli (na tekście).
  MOD-RED-TEAM-WLASNY → pozostaje w W1.6 jako kontrola ram.
  PRE-W2-GATE        → pozostaje między checkpoint W1 a W2.1.

WYWOŁANIE w SKILL.md:
  Po W1.2a, przed W1.3:
  view /mnt/skills/user/shared/MOD-STRATEGIA-WYBOR.md
  Wykonaj S1 → S2 → S3 → S4 → S5
  ⛔ ZAKAZ przejścia do W1.3 bez zamkniętego S5 (zatwierdzenie użytkownika)
     gdy warunek aktywacji spełniony.
```

---

## PRZYKŁAD RAPORTU — sprawa VII P 94/25 (post-factum)

```
═══════════════════════════════════════════════════════════
RAPORT STRATEGII — MOD-STRATEGIA-WYBOR
Sprawa: VII P 94/25 | Pismo: Rozszerzenie powództwa | 21.06.2026
═══════════════════════════════════════════════════════════

ZIDENTYFIKOWANE ŚCIEŻKI (Żądanie I — ustalenie stosunku pracy):

  ŚCIEŻKA-A: Błąd KRS pracodawcy — nie może działać na niekorzyść pracownika
    Podstawa: art. 8 KP (zakaz nadużycia prawa) + KRS 0000796445 w umowach 3-5
              → pracodawca sam stworzył dokument z tym numerem
    Autonomiczna: TAK

  ŚCIEŻKA-B: Przejście zakładu pracy — art. 23¹ KP
    Podstawa: art. 23¹ §1 KP — ta sama siedziba, prezes, branża, pracownicy
    Autonomiczna: TAK

  ŚCIEŻKA-C: HPG samodzielnie wyczerpała limit 3 umów terminowych
    Podstawa: art. 25¹ §1 i §3 KP — umowy 3, 4, 5 = 3 umowy HPG
    Autonomiczna: TAK — niezależna od A i B

  ŚCIEŻKA-ODRZUCONA: "Ten sam KRS = ten sam podmiot"
    Podstawa: KRS 0000796445 identyczny we wszystkich umowach
    Problem: KRS 0000796445 należy do HP sp. z o.o. (NIP 8971869561),
             a nie do HPG (KRS 0001025052, NIP 6343021499) — weryfikacja KRS

OCENA:

  ŚCIEŻKA-A: Atak: 🟡 (Ciecierski powie "błąd nieistotny") | Kontratak: TAK
             (pracodawca profesjonalny, błąd obciąża wyłącznie jego)
             Siła: ★★★

  ŚCIEŻKA-B: Atak: 🟡 (wymaga wykazania przejęcia zakładu) | Kontratak: TAK
             (ta sama siedziba/prezes/branża/pracownicy)
             Siła: ★★

  ŚCIEŻKA-C: Atak: 🟢 BRAK (arytmetyka: 3 umowy HPG = limit wyczerpany)
             Siła: ★★★

  ŚCIEŻKA-ODRZUCONA: Atak: 🔴 KRYTYCZNY (KRS 0000796445 ≠ HPG z rejestru)
                      Kontratak: NIE | Siła: ★

RANKING:
  #1 ŚCIEŻKA-C — ★★★ | atak 🟢 | REKOMENDACJA: WARSTWA GŁÓWNA
  #2 ŚCIEŻKA-A — ★★★ | atak 🟡 | REKOMENDACJA: WARSTWA RÓWNORZĘDNA
  #3 ŚCIEŻKA-B — ★★  | atak 🟡 | REKOMENDACJA: WARSTWA DODATKOWA
  ODRZUCONA     — ★   | atak 🔴 | REKOMENDACJA: PORZUĆ

PROPONOWANA STRUKTURA: SCENARIUSZ 2 — WARSTWOWA OBRONA A/B/C
  "Niezależnie od kwalifikacji przyjętej przez Sąd, limit umów terminowych
   został wyczerpany na co najmniej trzy niezależne sposoby."

═══════════════════════════════════════════════════════════
```

---

## SELF-CHECK MODUŁU

```
□ S1: wszystkie ścieżki (w tym anomalie podmiotowe) zidentyfikowane?
□ S2: każda ścieżka oceniona pod kątem ataku przeciwnika (OCENA-A)?
□ S2: każda ścieżka oceniona pod kątem własnych słabości (OCENA-B/C)?
□ S3: ranking wygenerowany z uzasadnieniem?
□ S3: ścieżka z atakiem 🔴 bez kontrargumentu oznaczona PORZUĆ lub EWENTUALNA?
□ S4: struktura pisma wybrana (Scenariusz 1/2/3)?
□ S4: brak SCENARIUSZA ZABRONIONEGO (mieszanie ścieżek bez oznaczenia)?
□ S5: raport wyświetlony użytkownikowi z pytaniem o zatwierdzenie?
□ Po zatwierdzeniu: W1.2 (teza centralna) zaktualizowana jeśli zmienił się wybór?
□ Wynik zapisany w MOD-HISTORIA-STRATEGII przed W1.3?
Którykolwiek = NIE → uzupełnij przed W1.3.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-21) — Pierwsza wersja.
  Przyczyna: brak obligatoryjnego mechanizmu oceny i rankingu ścieżek przed
  wyborem jednej, zidentyfikowany w sesji VII P 94/25 (rozszerzenie powództwa).
  System posiadał: MOD-WARIANTY-POZWU (generowanie kart, warunkowo aktywowany),
  MOD-ATAK-NA-DRAFT (ocena po wyborze), MOD-RED-TEAM-WLASNY (ocena ram).
  Brakowało: spójnego pipeline'u który obligatoryjnie ocenia WSZYSTKIE ścieżki
  pod kątem ataku przeciwnika PRZED wyborem jednej, rankinguje je i rekomenduje
  najsilniejszą — z zasadą, że ścieżka z atakiem 🔴 bez kontrargumentu nie może
  być ścieżką główną.
  Powiązane naprawy w tej samej sesji: PRE-W2-VERIFICATION-GATE.md (weryfikacja
  podmiotów przed W2), aktualizacje SKILL.md pisma-procesowe-v3 i prawny-router-v3.
```
