# MOD-LANCUCH-DOWODOWY — Budowa, wzmacnianie i atak na łańcuch dowodowy

> **Wersja:** 1.0.0 | **Status:** PRODUKCJA — plik kanoniczny shared/
> **Wywoływany z:**
>   - `pisma-procesowe-v3` W1.3 (budowa łańcuchów do tez głównych)
>   - `pisma-procesowe-v3` W1.2c MACIERZ (po MT4 — sprawdź czy łańcuchy zamknięte)
>   - `pisma-procesowe-v3` W2.4 MOD-ATAK §D2 (atak na łańcuch przeciwnika)
>   - `analizator-dowodow-v3` §BLOK-ATAK-NA-DOWOD §AD-12 SY (systemowy)
>   - `shared/MOD-POSZLAKI-KONTEKST.md` PK2-PK5 (poszlaki jako ogniwa)
>
> **Źródła:**
>   - KPC art. 231 KPC (domniemanie faktyczne — core mechanizm łańcucha poszlak)
>   - KPC art. 233 §1 (swobodna ocena dowodów — siła łańcucha)
>   - MOD-POSZLAKI-KONTEKST §L-X (istniejące łańcuchy poszlak — rozszerza)
>   - MOD-ATAK-NA-DOWOD §AD-12 SY (atak systemowy — odwrót: atak na łańcuch)
>   - MOD-NEGACJA-DOWODOW §N2 (odporność ogniwa per klasa)
>   - Garner/Scalia "Making Your Case" §27 (łańcuch argumentacji)
>   - MacCarthy on Cross-Examination §12 (atak na najsłabsze ogniwo)
>
> ⛔ HARD GATE: przepisy i sygnatury — weryfikuj ISAP i orzeczenia.ms.gov.pl.

---

## DLACZEGO ŁAŃCUCH, NIE LISTA

```
LISTA DOWODÓW (słaba):               ŁAŃCUCH DOWODOWY (silny):
Dowód A wykazuje fakt X.              Dowód A (kl.B) wykazuje fakt X.
Dowód B wykazuje fakt Y.              Fakt X prowadzi do faktu Y [logika].
Dowód C wykazuje fakt Z.              Dowód B (kl.A) potwierdza Y niezależnie.
Roszczenie = X + Y + Z → wniosek.     Fakty X+Y → domniemanie faktyczne Z
                                        (art. 231 KPC) wzmocnione D-C (kl.C).
Problem: przeciwnik atakuje           Z + przesłanka prawna → roszczenie.
każdy dowód osobno. Obalenie          
jednego = dziura w fundamencie.       Przeciwnik musi obalić KAŻDE ogniwo.
                                       Siła = mnożnik, nie suma.

ZASADA KLUCZOWA:
  Łańcuch z 3 ogniw × 0.9 odporności = 0.73 → szansa obalenia 27%
  Lista 3 niezależnych dowodów × 0.9 = 0.27 → szansa obalenia 73%
  → Łańcuch jest silniejszy niż suma składowych.
```

---

## CZĘŚĆ I — ARCHITEKTURA ŁAŃCUCHA

### ŁB-1 — Typy ogniw łańcucha

```
OGNIWO BAZOWE [ŁO-BASE]:
  Dowód klasy A lub B, który wykazuje fakt kluczowy bezpośrednio.
  Wymagany: TAK — każdy łańcuch musi mieć ≥1 ogniwo bazowe.
  Siła: 8-10/10. Atak: wymaga kontrdownodu kl. A lub G.

OGNIWO POŚREDNIE [ŁO-POŚR]:
  Dowód klasy C/D/E lub domniemanie faktyczne (art. 231 KPC)
  prowadzące od faktu X do faktu Y przez wnioskowanie logiczne.
  Siła: 4-7/10 samodzielnie; 7-9/10 gdy oparte na ŁO-BASE.
  Atak: atak na logikę przejścia lub na sam dowód pośredni.

OGNIWO WZMACNIAJĄCE [ŁO-WZM]:
  Dowód potwierdzający ten sam fakt co inne ogniwo, z innego
  niezależnego źródła (triangulacja P+ z MOD-PROWENIENCJA).
  Siła: podnosi odporność całego ogniwa o 1-2 punkty.
  Atak: musi obalić WSZYSTKIE niezależne źródła jednocześnie.

OGNIWO NEGATYWNE [ŁO-NEG]:
  Fakt wykazywany przez BRAK dowodu po stronie przeciwnika
  (art. 233 §2 KPC odmowa; N12 spoliation; PRZYZ-MIL z MOD-NEGACJA).
  Siła: 5-8/10 gdy dobrze udokumentowany obowiązek.
  Atak: trudny — wymaga wyjaśnienia dlaczego dokumentu brak.
```

### ŁB-2 — Schemat budowy łańcucha ŁD-n

```
Format per każda teza główna T-X:

╔══════════════════════════════════════════════════════╗
║  ŁAŃCUCH ŁD-01 → TEZA T-01: [treść tezy]            ║
╠══════════════════════════════════════════════════════╣
║  OGNIWO 1 [ŁO-BASE]:                                 ║
║    Dowód: D-NNN ([klasa A/B], [opis])                ║
║    Fakt wykazywany: F-101 [opis faktu]               ║
║    Odporność: 9/10                                    ║
║    Podatność: [AD-X — ryzyko]                        ║
║    Szczepienie: [SHIELD krok]                        ║
║         ↓ [logika przejścia — 1 zdanie]             ║
║  OGNIWO 2 [ŁO-POŚR]:                                ║
║    Dowód: D-NNN ([klasa C], [opis])                  ║
║    + Domniemanie faktyczne (art. 231 KPC): [F-101]   ║
║      → [F-102] na podstawie: [F-103, F-104]          ║
║    Wzmocnienie: D-NNN2 ([klasa D], niezależne)       ║
║    Odporność ogniwa: 6/10 → po wzmocnieniu: 8/10    ║
║    Podatność: [AD-X — ryzyko]                        ║
║         ↓ [logika przejścia]                        ║
║  OGNIWO 3 [ŁO-WZM / ŁO-NEG]:                        ║
║    Dowód: [odmowa złożenia przez stronę — art. 233   ║
║      §2 KPC + D-NNN3 (dokument wskazujący obowiązek)]║
║    Fakt wykazywany: F-103 [opis]                     ║
║    Odporność: 8/10                                   ║
║         ↓ [logika]                                  ║
║  KONKLUZJA ŁAŃCUCHA:                                 ║
║    Przesłanka prawna: art. X §Y [opis]               ║
║    Wniosek: [T-01 jest wykazana]                     ║
║  SIŁA ŁAŃCUCHA: ★★★★ (3 ogniwa, ŁO-BASE + wzmocn.) ║
║  ODPORNOŚĆ NA ATAK: TAK (każde ogniwo ≥ 7/10)       ║
╚══════════════════════════════════════════════════════╝
```

### ŁB-3 — Typy łańcuchów

```
[Ł-SEK] SEKWENCYJNY — klasyczny:
  Fakt A → Fakt B → Fakt C → Teza
  Siła: zależy od najsłabszego ogniwa
  Atak: atakuj jedno ogniwo → łańcuch pęka

[Ł-RÓW] RÓWNOLEGŁY — kilka niezależnych dróg do tej samej tezy:
  Droga 1: Fakt A1 → Fakt B1 → Teza
  Droga 2: Fakt A2 → Fakt B2 → Teza
  Droga 3: Fakt A3 →        → Teza
  Siła: Teza wykazana nawet gdy jedna droga upadnie
  Atak: musi obalić WSZYSTKIE drogi — znacznie trudniejsze

[Ł-DOM] DOMNIEMANIOWY — z art. 231 KPC jako pomostem:
  Fakt pozytywny A (wykazany) + Fakt pozytywny B (wykazany)
  → Domniemanie faktyczne C (art. 231 KPC)
  → Teza
  Siła: 7-9/10 gdy domniemanie logicznie silne
  Atak: musi wykazać że wnioskowanie nie jest "doświadczeniem życiowym"

[Ł-NEG] NEGATYWNY — z braku dowodu / zachowania:
  Strona miała obowiązek [X] → brak dokumentu [X] (art. 233 §2 KPC)
  → Domniemanie: fakt [X] nie istniał lub był niekorzystny
  → Teza
  Siła: 6-8/10 gdy obowiązek dobrze wykazany
  Atak: wyjaśnienie braku dokumentu bez niekorzystnego domniemana

[Ł-CIĄ] CIĄGŁOŚCI — specyficzny dla spraw ze zmianami w czasie:
  Fakt A (czas T1) → CIĄGŁOŚĆ → Fakt A' (czas T2 = data sporna)
  Dowód: dokumenty z D6 pisma-procesowe-v3 (ciągłość numeracji, personel)
  Siła: 8-9/10 gdy udokumentowana bez przerwy
  Atak: wskazanie faktycznej przerwy lub zmiany w kluczowym oknie
```

### ŁB-4 — Dobór dowodów do ogniw (hierarchia)

```
KROK 1 — OGNIWO BAZOWE: szukaj w hierarchii A > B:
  Klasa A (urz.): samodzielne ŁO-BASE; niemal nieatakowane
  Klasa B (dok. pryw.): ŁO-BASE gdy niekwestionowane; ryzyko AD-4 (oryginał)
  → Brak A lub B → łańcuch jest poszlakowy [Ł-DOM] lub [Ł-NEG]

KROK 2 — OGNIWO POŚREDNIE: klasy C/D/E z wzmocnieniem:
  C + D (niezależne źródła) → odporność wystarczająca
  E (hearsay) → tylko jako wzmocnienie; nie jako ogniwo samodzielne
  F (strona) → tylko jako ŁO-NEG (przyznanie); nigdy jako główne

KROK 3 — WZMOCNIENIE KRZYŻOWE (triangulacja):
  Najlepsze wzmocnienie: ogniwo z innej klasy z innego źródła
  [SYS] + [KOM] = najsilniejsza triangulacja (MOD-PROWENIENCJA §PR2)
  [ZAW] + [ZAW] = ryzyko koordynacji [H-PROW] — unikaj

KROK 4 — OGNIWA NEGATYWNE (wzmacniacze):
  Każdy brak dokumentu którego istnienie jest prawnie wymagane
  → ogniwo negatywne → art. 233 §2 KPC + wzmacnia łańcuch główny
  → Dokumentuj: "Pozwana nie złożyła [X] mimo zobowiązania z art. 248 KPC"
```

### ŁB-5 — BRAMKA-ŁD: eliminacja ogniw szkodliwych

```
PRZED ZŁOŻENIEM ŁAŃCUCHA — per każde ogniwo sprawdź:

EQG-1 ZAKAZ DOWODOWY:
  Czy istnieje zakaz ustawowy (AD-5: nagranie, RODO, tajemnica)?
  TAK → WYKLUCZ ogniwo bezwzględnie. Nie ma wyjątku.
  → Szukaj zamiennika z innej klasy.

EQG-2 SAMOOSKARŻENIE:
  Czy ogniwo zawiera fragment który SZKODZI własnej tezie lub
  POMAGA tezie przeciwnika? (RISK ASSESSMENT krzyżowe)
  → Identyfikuj konkretny fragment, nie cały dowód
  → OPCJE: (a) wyklucz cały dowód, (b) wyklucz fragment + zaznacz
    w sądzie że składasz z zastrzeżeniem, (c) złóż i antycypuj w D7
  → Decyzja: użytkownik (HARDGATE-SD-01 z MOD-SELEKCJA-DOWODOW)

EQG-3 ŁATWE DO PODWAŻENIA (atak ≥ 7/10):
  Sprawdź AD-1..AD-12 per ogniwo → jeśli ≥ 2 aktywne wektory ≥ 6/10:
  PRIORYTET OBRONY: zastosuj SHIELD per wektor
  Jeśli SHIELD niemożliwy (brak oryginału, brak metadanych):
    → Wyklucz ogniwo CHYBA ŻE jest jedynym dla tej przesłanki
    → Jeśli jedyne: zaznacz jako ⚠️ PODATNE + antycypuj atak w D7

EQG-4 EFEKT ODWROTNY:
  Czy złożenie tego dowodu ujawni stronie przeciwnej fakt kluczowy
  który jej pomoże? (RYZYKO UJAWNIENIA z MOD-SELEKCJA-DOWODOW §3.3)
  → Oceniaj strategicznie: czy lepiej złożyć teraz czy zachować
    na etap repliki / rozprawy?
  → Jeśli ocena WYSOKIE RYZYKO UJAWNIENIA: zaznacz [OPÓŹNIJ]
    + notuj w MOD-HISTORIA-STRATEGII pole selekcja_dowodow

FORMAT WYJŚCIA EQG per ogniwo:
  EQG-1: WYKLUCZ ❌ / DOPUSZCZ ✅
  EQG-2: WYKLUCZ ❌ / ANTYCYPUJ ⚠️ / DOPUSZCZ ✅
  EQG-3: WYKLUCZ ❌ / SZCZEPIJ 🛡 / DOPUSZCZ ✅
  EQG-4: OPÓŹNIJ ⏳ / DOPUSZCZ ✅

⛔ HARD GATE: Ogniwo EQG-1=WYKLUCZ lub EQG-2=WYKLUCZ → nie wchodzi do łańcucha.
  Ogniwo EQG-3=WYKLUCZ → wchodzi tylko gdy jedyne per przesłankę + antycypacja D7.
  Ogniwo EQG-4=OPÓŹNIJ → nie w tym piśmie; zaznacz w MOD-HISTORIA-STRATEGII.
```

---

## CZĘŚĆ II — ATAK NA ŁAŃCUCH DOWODOWY PRZECIWNIKA

### ŁA-1 — Strategia: atak na najsłabsze ogniwo

```
ZASADA MacCarthy'ego (Cross-Examination §12):
  "Nie atakuj łańcucha kompleksowo — atakuj najsłabsze ogniwo.
   Gdy ogniwo pęka, cały łańcuch się rozsypuje."

PROCEDURA IDENTYFIKACJI NAJSŁABSZEGO OGNIWA:
  1. Odtwórz łańcuch dowodowy przeciwnika:
     Które fakty musi wykazać per przesłankę przepisu?
     Jakie dowody powołał? Co jest logicznym mostem między nimi?

  2. Oceń per ogniwo (klasa A-G → MOD-NEGACJA §N2):
     Najsłabsze = najniższa klasa + aktywne wektory AD-X

  3. Skup atak na JEDNYM najsłabszym ogniwie:
     → Nie rozpraszaj ataków na wszystkie dowody (traci moc)
     → Jeden skuteczny atak > pięć słabych

  4. Po uderzeniu: wskaż że bez tego ogniwa łańcuch jest niekompletny
     "Bez wykazania faktu [X] teza T-Y nie ma podstawy dowodowej —
      dowód D-NNN [opis] jest niewystarczający z uwagi na [AD-X].
      Żaden inny dowód powodowej nie wykazuje faktu [X]."
```

### ŁA-2 — Atak kontrdowodem aktywnym (KD-1..KD-5)

```
Zamiast atakować ogniwo formalnie — zastąp je własnym faktem:

PROCEDURA:
  1. Zidentyfikuj kluczowy fakt F-X wykazywany przez ogniwo przeciwnika
  2. Złóż własny dowód który wykazuje [nie-F-X] (KD-1..KD-5 z MOD-ATAK-NA-DOWOD)
  3. W piśmie: "Powód twierdzi że F-X na podstawie D-NNN.
     Strona pozwana przedkłada D-ABC (klasa [X]) który wykazuje
     że F-X nie miało miejsca / przebiegało inaczej. [Opis rozbieżności.]
     Sąd stanie przed koniecznością oceny sprzecznych dowodów —
     przy czym D-ABC [opis przewagi] przemawia za wersją pozwanej."
  4. Wniosek o konfrontację (art. 272 KPC) gdy sprzeczność dotyczy
     dwóch świadków / dwóch dokumentów tego samego rzędu.
```

### ŁA-3 — Atak na logikę przejścia między ogniwami

```
Gdy ogniwa same w sobie są silne, ale logiczne przejście jest słabe:

Sygnał: "skoro A, to B" — gdzie to "to" jest kwestią oceny, nie faktu.

Technika:
  "Strona powodowa wywodzi z faktu [A] (wykazanego D-NNN) wniosek [B].
   Logika tego wnioskowania jest błędna, albowiem fakt [A] jest
   kompatybilny co najmniej z trzema innymi wyjaśnieniami: [X], [Y], [Z].
   Strona nie wykazała dlaczego wnioskowanie prowadzi właśnie do [B],
   a nie do alternatyw [X/Y/Z]. Samo istnienie faktu [A] nie pozwala
   na domniemanie faktyczne faktu [B] (art. 231 KPC — wymagane
   'doświadczenie życiowe' jako podstawa domniemanie)."

Obrona własna:
  → Każde przejście między ogniwami: explicite wyjaśnij logikę
  → "Z faktu [A] logicznie wynika [B], ponieważ [wyjaśnienie]"
  → Alternatywy eliminuj: "Inne wyjaśnienie [X] jest wykluczone przez [D-NNN]"
```

### ŁA-4 — Atak na proweniencję całego łańcucha

```
Gdy ogniwa pochodzą z powiązanych źródeł (MOD-PROWENIENCJA [ZAW/LIN]):

Technika:
  "Wszystkie dowody strony powodowej na fakt [X] (D-001, D-007, D-009)
   pochodzą z tego samego źródła: [pracodawca / ten sam dział /
   ta sama osoba]. Tworzą pozorny łańcuch wzajemnie potwierdzających
   się dokumentów z jednego pochodzenia — nie są niezależnymi źródłami.
   Usunięcie zaufania do jednego ze źródeł obala cały łańcuch,
   nie tylko jedno ogniwo." [MOD-PROWENIENCJA §PR3 P-]

Obrona własna:
  → Zawsze buduj łańcuch z niezależnych źródeł [SYS+KOM lub A+D]
  → Unikaj: 3 świadkowie z tego samego działu jako 3 "niezależne" ogniwa
  → Triangulacja P+ (≥2 klasy z różnych źródeł) = tarcza na ŁA-4
```

---

## CZĘŚĆ III — INTEGRACJA W PIŚMIE PROCESOWYM

### Sekcja "MATERIAŁ DOWODOWY" — architektura pisma

```
SCHEMAT SEKCJI DLA KAŻDEJ TEZY GŁÓWNEJ:

## [Teza T-01: treść]

Tezę T-01 wykazują następujące ogniwa dowodowe:

**Ogniwo pierwsze — [dowód klasy A/B]:**
  [Opis dowodu D-NNN], złożony jako załącznik nr [X], potwierdza
  że [fakt F-101]. Dowód ten [ma charakter dokumentu urzędowego /
  pochodzi od strony pozwanej] i jako taki nie wymaga wzmocnienia
  (art. 244 / 245 KPC — weryfikuj).

**Ogniwo drugie — [domniemanie / dowód klasy C+D]:**
  Z faktu F-101 (wykazanego powyżej), w połączeniu z [D-NNN2,
  załącznik nr Y — fakt F-102], na podstawie doświadczenia życiowego
  wyprowadzić można domniemanie faktyczne (art. 231 KPC), że [F-103].
  Domniemanie to jest wzmocnione zeznaniem świadka [imię] ([klasa D])
  który bezpośrednio obserwował [okoliczności wykazujące F-103].

**Ogniwo trzecie — zaniechanie strony pozwanej:**
  Strona pozwana, wezwana do złożenia dokumentu [X] zobowiązaniem z dnia
  [data], nie wykonała zobowiązania. W świetle art. 233 §2 KPC sąd może
  ocenić tę odmowę na niekorzyść pozwanej — co wzmacnia domniemanie
  faktyczne co do [F-103/F-104].

**Wniosek łańcucha:**
  Fakty F-101 + F-102 + domniemanie F-103 + zaniechanie pozwanej co do F-104
  łącznie wykazują tezę T-01: [treść]. Każde z ogniw jest niezależnie
  weryfikowalne, a obalenie jednego nie eliminuje pozostałych.

Na dowód powyższego powołuję:
  1. [D-NNN opis] — zał. nr [X] — na okoliczność: [F-101]
  2. [D-NNN2 opis] — zał. nr [Y] — na okoliczność: [F-102]
  3. Zeznania świadka [imię] — na okoliczność: [F-103]
  [4. Wniosek o zobowiązanie pozwanej do złożenia [X] — art. 248 KPC]
```

### Format skrócony dla ogniw bez szczegółowego opisu

```
Gdy łańcuch jest oczywisty i nie wymaga wyjaśnienia logiki:

Teza T-02: [treść]
Dowód: (1) [D-NNN — kl. A] wykazuje F-201; (2) [D-NNN2 — kl. C+D]
wykazuje F-202; (3) F-201 + F-202 → F-203 (art. 231 KPC).
⛔ Stosuj tylko dla tez pobocznych / oczywistych łańcuchów.
Tezy główne → zawsze pełny schemat z §CZĘŚĆ III.
```

---

## CZĘŚĆ IV — PROCEDURA ZINTEGROWANA

### Pipeline ŁD (per teza główna T-X)

```
KROK ŁD-1 — IDENTYFIKACJA PRZESŁANEK PRAWNYCH:
  Per T-X: jakie fakty muszą być wykazane zgodnie z przepisem?
  (z MOD-MACIERZ-DOWOD-TEZA, MT1 — przesłanki)

KROK ŁD-2 — DOBÓR OGNIW (ŁB-4):
  Per przesłanka P: które dowody? Klasa? Typ ogniwa (BASE/POŚR/WZM/NEG)?
  Sprawdź: triangulacja (różne źródła)? Domniemanie faktyczne możliwe?

KROK ŁD-3 — BRAMKA EQG (ŁB-5):
  Per każde ogniwo: EQG-1 / EQG-2 / EQG-3 / EQG-4
  Wyklucz szkodliwe; szczepij podatne; opóźnij ryzykowne ujawnieniowo.

KROK ŁD-4 — TYP ŁAŃCUCHA (ŁB-3):
  Ł-SEK / Ł-RÓW / Ł-DOM / Ł-NEG / Ł-CIĄ (lub kombinacja)
  Preferuj Ł-RÓW (≥2 niezależne drogi) gdy to możliwe.

KROK ŁD-5 — SCORING ŁAŃCUCHA:
  ★ — 1 ogniwo kl. C lub niżej; brak wzmocnienia; atak możliwy
  ★★ — 2 ogniwa; ≥1 kl. B; podatne na ŁA-1 (najsłabsze ogniwo)
  ★★★ — 3 ogniwa; ≥1 kl. A/B + 1 kl. C wzmocniony; ★★ odporności
  ★★★★ — Ł-RÓW lub 3+ ogniwa z ≥2 niezależnymi źródłami; ★★★ odporności
  ★★★★★ — kl. A + Ł-DOM + Ł-NEG kombinacja; obalenie wymaga kontrdownodu A/G

KROK ŁD-6 — ANTYCYPACJA ATAKU NA ŁAŃCUCH (D7 + ŁA):
  Per każde ogniwo: który atak ŁA-1..ŁA-4 jest możliwy?
  → Wstaw antycypację do D7 pisma (format [ANTYCYPACJA ZARZUTU X]):
    "Pozwana może podnosić [ŁA-1/ŁA-2/ŁA-3/ŁA-4 opis].
     Zarzut ten jest chybiony, ponieważ [riposta minimalna z
     MOD-NEGACJA §N3 lub MOD-ATAK-NA-DOWOD SHIELD]."

KROK ŁD-7 — FORMAT W PIŚMIE (§CZĘŚĆ III):
  Tezy główne: pełny schemat łańcucha (ogniwa numerowane + wniosek)
  Tezy poboczne: format skrócony
  Sekcja "Na dowód": każde ogniwo z okolicznością

OUTPUT:
  ╔══════════════════════════════╗
  ║ ŁD-01 → T-01 ★★★★           ║
  ║ ŁD-02 → T-02 ★★★            ║
  ║ ŁD-03 → T-03 ★★ ⚠️PODATNY   ║
  ║ EQG: D-007 ❌ / D-012 🛡     ║
  ╚══════════════════════════════╝
```

---

## SELF-CHECK

```
□ ŁD-1: per każda teza główna — przesłanki prawne zidentyfikowane?
□ ŁD-2: per każda przesłanka — ogniwo BASE zidentyfikowane?
□ ŁD-3: BRAMKA EQG wykonana per każde ogniwo? Wykluczone EQG-1/2?
□ ŁD-4: typ łańcucha wybrany? Ł-RÓW preferowane?
□ ŁD-5: scoring ★-★★★★★ ustalony? Tezy ★/★★ mają alternatywę?
□ ŁD-6: antycypacja ŁA-1..ŁA-4 wstawiona do D7 per najsłabsze ogniwo?
□ ŁD-7: pełny schemat łańcucha w piśmie dla tez głównych?
□ Sekcja "Na dowód": każde ogniwo z przesłanką prawną (ad-X §Y)?
□ Triangulacja P+: ≥2 niezależne źródła dla ogniw kl. C/D?
Którykolwiek = NIE → wróć do brakującego kroku.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Przyczyna: system miał fragmentaryczne pokrycie łańcucha:
  MOD-DOWODY D2 (prosty schemat A→B→wniosek), MOD-POSZLAKI-KONTEKST
  (poszlaki L-X bez architektury budowy i ataku), MOD-ATAK-NA-DOWOD
  §AD-12 SY (atak systemowy bez procedury łańcucha).
Luki wypełnione: 5 typów łańcuchów (ŁB-3), 4 typy ogniw (ŁB-1),
  schemat ŁD-n (ŁB-2), BRAMKA EQG (ŁB-5), 4 strategie ataku ŁA-1..ŁA-4,
  schemat sekcji w piśmie (CZĘŚĆ III), pipeline ŁD-1..ŁD-7.
Źródła: KPC art. 231, 233; MOD-POSZLAKI-KONTEKST (istniejący);
  MacCarthy §12 (atak na najsłabsze ogniwo); Garner/Scalia §27 (łańcuch
  argumentacji); MOD-NEGACJA §N2 (odporność ogniwa); MOD-ATAK-NA-DOWOD
  SHIELD (szczepienie); MOD-PROWENIENCJA §PR2 (triangulacja P+).
```
