# MOD-MACIERZ-DOWOD-TEZA — Macierz Dowód × Teza (skan dwukierunkowy)

> **Plik:** `/mnt/skills/user/shared/MOD-MACIERZ-DOWOD-TEZA.md`
> **Wersja:** 1.2.0 (2026-06-26)
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - pisma-procesowe-v3: po W1.2a (CLAIM-VALIDATION), przed W1.3
>     (jeśli użytkownik dostarczył ≥2 dowody i ≥2 tezy)
>   - analizator-dowodow-v3: po MD2-ekstrakcji, przed MOD-SELEKCJA-DOWODOW
>   - przesłuchanie-swiadkow-v2: po W1 (profil świadka), przed W2 (pytania)
>
> **Relacja z innymi modułami:**
>   MOD-SELEKCJA-DOWODOW  → kierunek Teza→Dowód (wybiera dowody do tez)
>   MOD-MACIERZ-DOWOD-TEZA → kierunek Dowód→Teza (skanuje każdy dowód pod tezy)
>       + kierunek Teza→Dowód (weryfikacja pokrycia)
>   Oba moduły są komplementarne — ten jest wejściem do tamtego.

---

## DLACZEGO TEN MODUŁ ISTNIEJE

`MOD-SELEKCJA-DOWODOW` startuje od tez i szuka dowodów. To powoduje:
- pominięcie dowodów które nie pasują do z góry założonej tezy,
- ale które mogłyby wesprzeć inną tezę lub obalić argumentację przeciwnika,
- oraz brak wykrycia, że jeden dowód wspiera wiele tez jednocześnie.

**Przykład z VII P 94/25:** wiadomość RCS Prezesa Parka z 21.03.2026 r.
obsługuje co najmniej trzy tezy jednocześnie:
- T2 (gotowość do pracy → przeszkoda po stronie pracodawcy)
- T1 (tożsamość pracodawcy → osobisty akt art. 31 KP)
- T5 (brak możliwości mediacji → zachowanie pracodawcy)

Model skupiony na tezie T2 mógłby przypisać ten dowód tylko do T2 i pominąć
jego wartość dla T1 i T5. Macierz D×T wymusza zbadanie każdego dowodu pod
kątem WSZYSTKICH tez równocześnie.

---

## STRUKTURA MACIERZY

```
MACIERZ DOWÓD × TEZA

         T1    T2    T3    ...   Tn    | SIŁA_D | RYZYKA
──────────────────────────────────────┼────────┼────────
D1       [wag] [wag]  -    ...   -    | ★★★    | [kody]
D2        -   [wag]  [wag] ...  [wag] | ★★     | [kody]
D3       [wag]  -    [wag] ...   -    | ★★     | [kody]
...
──────────────────────────────────────┼────────┼────────
PKR_T    P%    P%    P%   ...   P%   (pokrycie tezy w %)
LUKI_T    -     L     -   ...   L    (L = luka krytyczna)
```

Gdzie:
- `[wag]` = waga powiązania dowodu z tezą: ●●● BEZPOŚREDNI / ●● POŚREDNI / ● WSPIERAJĄCY
- `-` = brak powiązania (lub powiązanie niezbadane → "?" przed skanem)
- `PKR_T` = procent przesłanek tezy pokrytych ≥1 dowodem
- `LUKI_T` = tezy z luką krytyczną (brak dowodu kat. A/B dla ≥1 przesłanki niezbędnej)
- `SIŁA_D` = ogólna siła dowodowa: ★★★ (A urzędowy) / ★★ (B prywatny ze źródła) / ★ (C pośredni)
- `RYZYKA` = kody ryzyk (patrz §4)

---

## SEKWENCJA GŁÓWNA: MT1 → MT2 → MT3 → MT4 → MT5

### MT1 — INWENTARYZACJA WEJŚCIOWA

```
KROK MT1.1 — Lista tez (T1…Tn):
  Źródło: W1.2a (CLAIM-VALIDATION) lub opis sprawy użytkownika
  Format: T[n]: [treść tezy / żądania / okoliczności do wykazania]

  Przykład:
    T1: ciągłość stosunku pracy / tożsamość pracodawcy rzeczywistego
    T2: gotowość do pracy i przeszkoda po stronie pracodawcy (art. 81 §1 KP)
    T3: wysokość wynagrodzenia (stawka miesięczna)
    T4: premia regulaminowa z tytułu PFRON
    T5: brak możliwości mediacji / zachowanie pracodawcy

KROK MT1.2 — Lista dowodów (D1…Dm):
  Źródło: pliki dostarczone przez użytkownika / MD1/MD2-ekstrakcja
  Format: D[m]: [nazwa] | [typ] | [kategoria A/B/C/D] | [opis w 1 zdaniu]

  Typy dowodów:
    DOK-URZ  = dokument urzędowy (protokół sądowy, rejestr, decyzja)
    DOK-PRY  = dokument prywatny strony (umowa, pismo, faktura)
    TAB-OPE  = tabela / arkusz operacyjny (XLS, baza danych, spis)
    KOM-ELE  = korespondencja elektroniczna (email, WhatsApp, RCS, SMS)
    ZRZ-EKR  = zrzut ekranu (komunikator, system, rejestr)
    PRO-ROZ  = protokół rozprawy / przesłuchania
    ZEZ-SWI  = zeznanie świadka (w protokole sądowym)
    REJ-PUB  = dane z rejestru publicznego (KRS, PFRON/SUDOP, ISAP)
    PLI-MUL  = plik multimedialny (nagranie, foto)

KROK MT1.3 — Inicjalizacja macierzy:
  Utwórz tabelę D×T wypełnioną "?" (niezweryfi kowane).
  Dla każdego pola (Di, Tj): "?" → zmień na [wag] lub "-" po skanie MT2.
```

### MT2 — SKAN DWUKIERUNKOWY

```
⛔ ZASADA: Oba skany (A i B) są OBOWIĄZKOWE. Skan A bez B daje niepełny obraz.

SKAN A — DOWÓD → TEZY (dla każdego dowodu Di: jakie tezy wspiera?)
──────────────────────────────────────────────────────────────────
Dla każdego Di:
  1. Przeczytaj / zidentyfikuj zawartość dowodu (z metadanych lub treści)
  2. Dla każdej tezy Tj: czy Di dostarcza informacji o faktach istotnych dla Tj?
     TAK-BEZP: Di bezpośrednio wykazuje fakt konieczny dla Tj → ●●●
     TAK-POSR: Di wymaga wnioskowania, żeby powiązać z Tj → ●●
     TAK-WSPI: Di sam nie wykazuje Tj, ale wzmacnia inny dowód który to robi → ●
     NIE:      Di nie ma żadnego związku z Tj → "-"

  3. Dla każdego powiązania ≥●: notuj KONKRETNY element dowodu:
     "Di wspiera Tj przez: [cytat/opis konkretnego fragmentu/elementu]"
     (⛔ ZAKAZ ogólnikowego "ten dowód wspiera tę tezę" bez wskazania CZYM)

  4. Wynik: wypełnij wiersz Di w macierzy.

SKAN B — TEZA → DOWODY (dla każdej tezy Tj: które dowody ją wspierają?)
──────────────────────────────────────────────────────────────────────────
Dla każdej tezy Tj:
  1. Zidentyfikuj przesłanki prawne Tj (z W1.4 / CLAIM-VALIDATION / przepisu)
  2. Dla każdej przesłanki P: czy ≥1 dowód Di pokrywa tę przesłankę?
     POKRYTE ●●●/●●: przesłanka udowodniona (odpowiednio bezpośrednio/pośrednio)
     POKRYTE ●:       tylko dowód wspierający — luka istotna
     NIEPOKRYTE:      brak dowodu dla przesłanki → LUKA (krytyczna lub istotna)
  3. Oblicz PKR_Tj = (liczba przesłanek pokrytych ●/●●/●●●) / (suma przesłanek) × 100%
  4. Wynik: wypełnij kolumnę Tj w macierzy.
```

### MT3 — KLASYFIKACJA POWIĄZAŃ

```
Dla każdego pola (Di, Tj) z powiązaniem ≥●:

KLASA-1 KLUCZOWY (Di to jedyny lub główny dowód dla Tj):
  → PKR_Tj znacząco spada bez Di
  → Di musi być chroniony procesowo (kiedy powołać — patrz MOD-TIMING)
  → Oznaczenie w macierzy: ●●●[K] lub ●●[K]

KLASA-2 REDUNDANTNY (Di pokrywa Tj, ale ≥2 inne dowody też to robią):
  → Di powołać dla wzmocnienia (triangulacja)
  → Koszt procesowy niski — można pominąć jeśli dowód ryzykowny
  → Oznaczenie: ●●●[R] lub ●●[R]

KLASA-3 WIELOFUNKCYJNY (Di wspiera ≥3 różne tezy):
  → Strategicznie najcenniejszy typ dowodu
  → Priorytet powołania — jeden dowód "robi robotę" dla wielu tez
  → Oznaczenie: ●●●[W] / ●●[W] / ●[W]
  → Zanotuj: "Di jest WIELOFUNKCYJNY: Tj, Tk, Tl"

KLASA-4 RYZYKOWNY-KRZYŻOWY (Di wspiera Tj, ale szkodzi Tk):
  → ⛔ HARD STOP przed powołaniem
  → Decyzja użytkownika: powołać dla Tj (akceptując ryzyko Tk)?
  → Oznaczenie: ●●●[RK] → wymaga jawnej decyzji
  → (por. MOD-SELEKCJA-DOWODOW HARDGATE-SD-01)
```

### MT4 — RAPORT MACIERZY (wyświetl użytkownikowi)

```
════════════════════════════════════════════════════════════════
MACIERZ DOWÓD × TEZA — [sygnatura sprawy / data]
════════════════════════════════════════════════════════════════

TEZY SPRAWY:
  T1: [treść]
  T2: [treść]
  ...

DOWODY:
  D1: [nazwa] | [typ] | kat. [A/B/C/D]
  D2: [nazwa] | [typ] | kat. [A/B/C/D]
  ...

MACIERZ:
         T1      T2      T3      ...   SIŁA   RYZYKA
  D1     ●●●[K]  ●[W]    -       ...   ★★★    -
  D2     -       ●●[W]   ●●[W]   ...   ★★     RK(T3)
  D3     ●●[R]   -       -       ...   ★★     -
  ...

POKRYCIE TEZ:
  T1: [n]% ([przesłanki pokryte] / [wszystkie przesłanki])  [✅ / ⚠️ / ⛔]
  T2: [n]% ...
  ...

LUKI DOWODOWE:
  ⬛ LUKA KRYTYCZNA T[n], przesłanka [P]: [opis — brak dowodu kat. A/B]
     Propozycja: [jak uzupełnić — wniosek z art. 248 KPC / świadek / etc.]
  ⬛ LUKA ISTOTNA T[n], przesłanka [P]: [opis — tylko dowód kat. C/D]

DOWODY WIELOFUNKCYJNE (priorytet powołania):
  D[x]: [n] tez jednocześnie — T[a], T[b], T[c]
  D[y]: [n] tez jednocześnie — ...

DECYZJE WYMAGANE (RYZYKA KRZYŻOWE):
  D[x]: wspiera T[a], SZKODZI T[b] — czy powołać? [czekam na decyzję]

════════════════════════════════════════════════════════════════
```

### MT5 — ZASILANIE DALSZEGO PIPELINE'U

```
Po zatwierdzeniu macierzy przez użytkownika:

→ pisma-procesowe-v3 W1.3:
    Dla każdej tezy Tj: wstaw dowody z macierzy (●●●[K] i ●●● najpierw)
    do pola "Dowód" w mapie cel→przesłanka→dowód.
    Dowody [K] (kluczowe) → oznacz w piśmie jako główny dowód tezy.
    Dowody [W] (wielofunkcyjne) → powołaj raz, odnieś do wielu tez.

→ MOD-SELEKCJA-DOWODOW:
    Przekaż jako pre-wypełnioną mapę — selekcja może pominąć krok MT2.A
    (już wykonany) i skupić się na rankingu i analizie ryzyk.

→ pisma-procesowe-v3 W2 (sekcja "Na dowód"):
    Każdy dowód powołuj z listą tez które obsługuje:
    "[Nazwa dowodu] — na okoliczność: [T1: ...], [T2: ...]"
    Nie powtarzaj tego samego dowodu dla każdej tezy oddzielnie.

→ przesłuchanie-swiadkow-v2:
    Zeznania świadka to D[x] w macierzy — dla jakich tez świadek jest ●●●[K]?
    To determinuje, które pytania są krytyczne (muszą paść) vs opcjonalne.

⛔ MT5-MANDATE-ALL-EVIDENCE (NOWE — v1.1.0):
    Po zasileniu W1.3 wykonaj cross-check:

    KROK MT5-A: Policz dowody z macierzy = [N_macierz]
    KROK MT5-B: Policz dowody powołane w piśmie (sekcja faktyczna + wnioski dowodowe) = [N_pismo]
    KROK MT5-C: Jeśli N_pismo < N_macierz × 0.7:
       → ⚠️ ALERT: "W piśmie powołano [N_pismo] z [N_macierz] dowodów zidentyfikowanych
          w macierzy. Brakuje: [lista D[id] nieuwzględnionych]. Czy pominąć świadomie?"
       → Czekaj na odpowiedź użytkownika (lista dowodów do pominięcia / "wszystkie uwzględnij")
       → ⛔ NIE generuj .docx przed tym cross-checkiem

    ⛔ ZAKAZ "cichego" pomijania dowodów: każdy D[id] z macierzy ●/●●/●●● musi być
       ALBO powołany w piśmie, ALBO jawnie pominięty z uzasadnieniem.

⛔ MT5-PROPORCJONALNOSC (NOWE — v1.1.0):
    Długość uzasadnienia pisma procesowego musi być PROPORCJONALNA do:
    - liczby tez (T1..Tn): minimum 1 akapit per teza
    - liczby dowodów w macierzy: każdy ●●● musi mieć co najmniej zdanie w uzasadnieniu
    - złożoności sprawy: przy ≥5 tezach → uzasadnienie ≥ 5 sekcji merytorycznych

    PO wygenerowaniu draftu pisma (W2) wykonaj:
    KROK MT5-P.1: Policz sekcje merytoryczne uzasadnienia = [S_draft]
    KROK MT5-P.2: Policz tezy = [T_n]
    KROK MT5-P.3: Jeśli S_draft < T_n:
       → ⚠️ ALERT: "Uzasadnienie ma [S_draft] sekcji dla [T_n] tez — niewystarczające.
          Brakuje sekcji dla: [lista tez bez sekcji]."
       → Uzupełnij brakujące sekcje przed W3.
```

---

### MT6 — FORMAT SĄDOWY TABELI W PIŚMIE PROCESOWYM

```
⛔ ZASADA DWÓCH WARSTW — BEZWZGLĘDNA:

  WARSTWA WEWNĘTRZNA (MT1–MT5, tylko dla modelu):
    Symbole ●/●●/●●●, [K]/[W]/[R]/[RK], ★/★★/★★★, PKR%, SIŁA_D, RYZYKA
    → służą klasyfikacji, priorytetyzacji, decyzjom o powołaniu
    → NIE trafiają do pisma procesowego — ani do uzasadnienia, ani do zestawienia

  WARSTWA SĄDOWA (MT6, wchodzi do treści pisma):
    Tabela czytelna dla sędziego — bez żadnych symboli wewnętrznych.
    Kolumny obowiązkowe:

    | Lp. | Dowód                  | Lokalizacja w aktach          | Roszczenie | Na okoliczność               |
    |-----|------------------------|-------------------------------|------------|------------------------------|
    |  1  | Nazwa i krótki opis    | Zał. nr X / str. Y protokołu  | T1 / nazwa | Opis faktu który wykazuje    |

    ⛔ KOLUMNA "Lokalizacja w aktach" — OBOWIĄZKI:
       • Dokument złożony jako załącznik: "zał. nr [N]" lub "akta sprawy / zał. [N]"
       • Zeznanie z protokołu sądowego: "protokół str. [X]–[Y], godz. [HH:MM:SS]"
       • Wpis z rejestru publicznego: "wydruk z [rejestr] z dnia [data] / zał. [N]"
       • Dokument wnioskowany (do złożenia): "dokument wnioskowany — pkt [X] wniosków dow."
       ⛔ ZAKAZ: "w aktach" bez numeru strony lub załącznika — nieokreślone = bezużyteczne dla sądu

    ⛔ KOLUMNA "Na okoliczność" — OBOWIĄZKI:
       • Konkretny fakt który wykazuje ten dowód dla danej tezy — nie ogólnik.
       • Dla zeznań: wskazać które konkretne zdanie / fragment jest istotny.
       • Dla dokumentów wielostronicowych: wskazać stronę / pozycję / paragraf.

    ⛔ KOLUMNA "Roszczenie":
       • Kod tezy (T1, T2...) LUB pełna nazwa roszczenia — konsekwentnie w całej tabeli.
       • Gdy dowód obsługuje wiele tez: "T1, T2, T3" — wymień wszystkie.
       • NIE używać [K]/[W]/[R] ani innych kodów wewnętrznych.

⛔ UWAGI DO TABELI W PIŚMIE (tekst pod tabelą, nie w tabeli):
    Decyzje o ograniczeniu dowodu do wybranych tez (np. RK — ryzyko krzyżowe)
    opisuje się zdaniem prozą pod tabelą:
    "Dowód nr [N] ([nazwa]) powołany wyłącznie na okoliczność [teza X].
     Na okoliczność [teza Y] powód nie powołuje tego dowodu z uwagi na [krótkie uzasadnienie]."
    — bez kodów RK, bez symboli wewnętrznych.

⛔ ZAKAZ SYMBOLI W PIŚMIE — katalog zakazanych oznaczeń:
    ●, ●●, ●●● (wagi powiązania)
    ★, ★★, ★★★ (siła dowodowa)
    [K], [W], [R], [RK] (klasyfikacje)
    PKR%, SIŁA_D, RF, RS, RP, RU (kody ryzyk)
    BEZPOŚREDNI / POŚREDNI / WSPIERAJĄCY (terminologia wewnętrzna)
    Żaden z tych elementów nie ma znaczenia procesowego dla sądu i nie może
    pojawić się w piśmie procesowym — ani w tabeli, ani w uzasadnieniu.
```

---

```
RK     = RYZYKOWNY KRZYŻOWO (Di wspiera Tj ale szkodzi Tk)
         → wymaga jawnej decyzji użytkownika przed powołaniem
RF     = RYZYKO FORMALNE (brak oryginału, skan, brak podpisu, brak daty)
         → wyjaśnić lub pominąć
RS     = RYZYKO SPORNOŚCI (strona przeciwna prawdopodobnie zakwestionuje autentyczność)
         → przygotować kontrargument lub potwierdzenie
RP     = RYZYKO PREKLUZJI (dowód może być uznany za spóźniony — art. 205³ KPC)
         → natychmiastowe powołanie w bieżącym piśmie
RU     = RYZYKO UJAWNIENIA (powołanie dowodu ujawnia stronie przeciwnej
         informacje które mogą wykorzystać przeciwko naszej pozycji)
         → rozważyć timing (MOD-TIMING)
```

---

## SZABLON SZYBKI (do użycia inline — TYLKO FORMAT ROBOCZY)

⛔ Poniższy szablon jest formatem ROBOCZYM (pipeline wewnętrzny).
   NIE kopiuj go do pisma procesowego. Do pisma użyj formatu MT6 (tabela sądowa).

Gdy ≤5 dowodów i ≤4 tezy — uproszczony format inline:

```
MACIERZ D×T [skrócona]:

       T1         T2         T3         T4
D1:   ●●●[K]     ●[W]        -         ●[W]    ★★★
D2:    -         ●●[W]      ●●[W]       -       ★★    RF
D3:   ●●[R]       -          -         ●●[K]   ★★
D4:    ●[W]      ●●●[K]     ●[W]        -       ★★★

Pokrycie: T1=100% ✅  T2=100% ✅  T3=75% ⚠️  T4=67% ⚠️
Luki: T3/P2 ⬛, T4/P1 ⬛
Wielofunkcyjne: D4 (T1+T2+T3)
Ryzyka: D2/RF (brak oryginału)
```

---

## INTEGRACJA Z PIPELINE pisma-procesowe-v3

```
Pozycja w SEKWENCJI GŁÓWNEJ (aktualizacja po v4.4):

  W1.1 Typ i tryb pisma
  W1.2 Teza centralna (wstępna)
  W1.2a CLAIM-VALIDATION → lista tez T1..Tn
  W1.2b MOD-STRATEGIA-WYBOR (gdy ≥2 ścieżki lub anomalia podmiotowa)

  ⛔ NOWE W1.2c — MOD-MACIERZ-DOWOD-TEZA (TEN MODUŁ):
    Trigger: użytkownik dostarczył ≥2 dowody / dokumenty / pliki
    Sekwencja: MT1 → MT2 → MT3 → MT4 (raport) → MT5 (zasilanie)
    ⛔ STOP po raporcie MT4 — czekaj na:
       (a) zatwierdzenie macierzy przez użytkownika, LUB
       (b) decyzje w polach RK (dowody ryzykowne krzyżowo)
       Dopiero po zatwierdzeniu → MT5 → W1.3

  W1.3 Mapa cel→przesłanka→dowód (wstępnie wypełniona z MT5)
  W1.4 Lista robocza przepisów
  W1.4b Tabela roszczeń narastających (gdy roszczenie pieniężne)
  W1.5 Braki krytyczne (uzupełnione o luki z MT4)
  W1.6 MOD-RED-TEAM-WLASNY

ZASADA STOP po MT4:
  Model MUSI wyświetlić raport MT4 i ZATRZYMAĆ SIĘ.
  Użytkownik ma możliwość:
  - zatwierdzenia macierzy ("ok" / "dalej" / "zatwierdź")
  - korekty wag ("D3 wspiera też T4")
  - decyzji w polach RK
  - dorzucenia nowych dowodów ("mam jeszcze...")
  NIE przechodzić do W1.3 bez zatwierdzenia macierzy.
```

---

## PRZYKŁAD PEŁNY — sprawa VII P 94/25

```
TEZY:
  T1: Ciągłość stosunku pracy / tożsamość pracodawcy rzeczywistego (art. 22 §1 KP)
  T2: Gotowość do pracy i przeszkoda po stronie pracodawcy (art. 81 §1 KP)
  T3: Wysokość wynagrodzenia (5.036,50 zł brutto — §3 umowy z 29.12.2023)
  T4: Premia regulaminowa PFRON (praktyka zakładowa — art. 9 §1 KP)
  T5: Brak możliwości mediacji / zachowanie pracodawcy

DOWODY:
  D01: Umowy o pracę nr 1–5           | DOK-PRY | A | 5 umów, KRS 0000796445 w każdej
  D02: Protokół rozprawy 27.01.2026   | PRO-ROZ | A | zeznania Nawrota, wniosek powoda o PFRON
  D03: Lorica 4.05.2026               | DOK-PRY | B | zakaz kontaktu, żądanie usunięcia danych
  D04: Dokument 182 (odp. na wezw.)   | DOK-PRY | B | Ciecierski: umowa wygasła 31.12.2024
  D05: Wezwanie do zapłaty 2.05.2026  | DOK-PRY | B | roszczenia, gotowość do pracy
  D06: Pismo powoda 12.05.2026        | DOK-PRY | B | oferta ugodowa, gotowość do pracy
  D07: RCS Prezes Park 21.03.2026     | ZRZ-EKR | B | zakaz kontaktu, odesłanie do kancelarii
  D08: RCS powód → Park (koreański)   | ZRZ-EKR | B | gotowość do pracy, milczenie Parka
  D09: PFRON/SUDOP lista HPG          | REJ-PUB | A | 30 pozycji, 123.445 zł, daty refundacji
  D10: PFRON/SUDOP lista HP sp.z o.o. | REJ-PUB | A | 6 pozycji HP (NIP 8971869561)
  D11: Pracownicy13.08.2024.xlsx      | TAB-OPE | B | dwa arkusze HP/HPG, ciągła numeracja
  D12: WhatsApp Sławek HP 09-29.06.23 | ZRZ-EKR | B | czynności rekrutacyjne (hp→hpg boundary)
  D13: WhatsApp Yurij HP 08-09.08.23  | ZRZ-EKR | B | czynności rekrutacyjne (już HPG)
  D14: Spis zdawczo-odbiorczy akt     | TAB-OPE | B | 964 wiersze, jeden podmiot HP sp.z o.o.
  D15: Candidates/Zeszyt1.xlsx        | TAB-OPE | B | arkusze rekrutacyjne powoda, daty
  D16: Orzeczenie o niepełnosprawności| DOK-URZ | A | stopień znaczny, symbol 04-O (w aktach)
  D17: Riposta 17.01.2026             | DOK-PRY | B | pismo procesowe powoda z aktami
  D18: RCS Park → zakaz (Wiadomość III)| ZRZ-EKR| B | osobisty akt Prezesa = art. 31 KP

MACIERZ:
        T1          T2          T3          T4          T5         SIŁA   RYZYKA
D01    ●●●[K]       -          ●●●[K]       -           -          ★★★     -
D02    ●●[W]       ●●[W]        -          ●●●[K]      ●[W]        ★★★     -
D03    ●[W]        ●●●[K]       -           -          ●●●[W]      ★★      -
D04    ●●[W]       ●●[W]        -           -          ●[W]        ★★      -
D05    ●[W]        ●●[W]       ●●[R]        -          ●[W]        ★★      -
D06    ●[W]        ●●[W]        -           -          ●●[W]       ★★      -
D07    ●●[W]       ●●●[K]       -           -          ●●●[W]      ★★★    -
D08    ●[W]        ●●●[K]       -           -          ●[W]        ★★      -
D09     -           -           -          ●●●[K]       -          ★★★     -
D10    ●●[W]        -           -          ●●[R]        -          ★★★     -
D11    ●●●[K]       -           -           -           -          ★★      RF(brak oryg)
D12    ●●●[K]      ●[W]         -           -          ●[W]        ★★      -
D13    ●●●[K]       -           -           -           -          ★★      -
D14    ●●[W]        -           -           -           -          ★★      -
D15    ●●[W]       ●[W]         -          ●[W]         -          ★★      -
D16     -           -           -          ●●●[K]       -          ★★★     -
D17    ●●[W]       ●●[W]        -           -          ●●[W]       ★★      -
D18    ●●[W]       ●●●[K]       -           -          ●●●[W]      ★★★     -

POKRYCIE:
  T1: 100% ✅  (D01 ●●●, D11 ●●●, D12 ●●●, D13 ●●● — silne wielopokrycie)
  T2: 100% ✅  (D03 ●●●, D07 ●●●, D08 ●●●, D18 ●●●)
  T3: 100% ✅  (D01 ●●● dla stawki umownej)
  T4: 100% ✅  (D02 ●●●, D09 ●●●, D16 ●●●)
  T5:  80% ⚠️  (D03 ●●●, D07 ●●●, D18 ●●● — brak dowodu na niestawiennictwo 18.06)

DOWODY WIELOFUNKCYJNE (priorytet):
  D07 (RCS Park 21.03): T1 + T2 + T5 — 3 tezy ●●●/●●●/●●●
  D18 (Wiadomość III Park): T1 + T2 + T5 — 3 tezy ●●/●●●/●●●
  D02 (protokół): T1 + T2 + T4 + T5 — 4 tezy
  D12 (WhatsApp graniczny): T1 + T2 — bezpośredni dowód ciągłości

LUKI:
  T5/brak: dowód na niestawiennictwo Parka 18.06.2026 → akta sądu (wniosek o włączenie)

RYZYKA KRZYŻOWE: brak

Wniosek: macierz kompletna — wszystkie tezy pokryte ≥1 dowodem ●●●.
D07 + D18 (oba osobiste akty Prezesa) = najcenniejsze dowody wielofunkcyjne.
```

---

## SELF-CHECK MODUŁU

```
□ MT1: lista tez (T1..Tn) z CLAIM-VALIDATION (w tym C0 — wątki z pism procesowych)?
□ MT1: lista dowodów (D1..Dm) z inventory plików / MD2-ekstrakcja?
□ MT2.A: każdy dowód przeskanowany pod WSZYSTKIE tezy?
□ MT2.A: dla każdego ●: wskazany KONKRETNY element dowodu (nie ogólnik)?
□ MT2.B: każda teza ma policzone PKR_%?
□ MT3: każde powiązanie sklasyfikowane (K/R/W/RK)?
□ MT6: tabela sądowa (MT6) gotowa — bez symboli ●/★/[K]/[W]/[RK]?
□ MT6: każda pozycja ma lokalizację w aktach (str./zał./godz.)?
□ MT6: kolumna "Na okoliczność" opisuje konkretny fakt, nie ogólnik?
□ MT6: decyzje o ograniczeniu dowodu (dawne RK) opisane prozą pod tabelą?
□ MT4: STOP po raporcie — czekam na zatwierdzenie lub decyzje RK?
□ MT5: po zatwierdzeniu — W1.3 zasilony danymi z macierzy?
□ MT5: dowody wielofunkcyjne powołane raz z listą tez (nie wielokrotnie)?
□ MT5-MANDATE-ALL-EVIDENCE: cross-check N_pismo vs N_macierz × 0.7?
□ MT5-PROPORCJONALNOSC: S_draft ≥ T_n (sekcje ≥ tezy)?
Którykolwiek = NIE → wróć do brakującego kroku.
```

---

## HISTORIA ZMIAN

```
1.1.0 (2026-06-26)
Przyczyna: analiza błędów sprawa VII P 94/25 (sesja 2026-06-26):
  (1) Macierz D×T budowana poprawnie — ale jej wyniki NIE trafiały do treści pisma.
      Wynik: pismo powołuje 5 z 18+ dowodów, uzasadnienie ma 4 sekcje dla 8+ tez.
  (2) N_pismo << N_macierz bez żadnego alertu systemowego.
  (3) Brak triggera proporcjonalności uzasadnienia.
Naprawy:
  + MT5-MANDATE-ALL-EVIDENCE: cross-check dowodów macierzy vs powołanych w piśmie
    (próg: 70% — przy niższym → alert + zapytanie użytkownika + blokada .docx)
  + MT5-PROPORCJONALNOSC: sekcje uzasadnienia ≥ liczba tez; uzupełnij przed W3
  + Self-check uzupełniony o oba nowe kroki

1.0.0 (2026-06-21) — Pierwsza wersja.
Przyczyna: identyfikacja luki systemowej — żaden istniejący moduł nie wykonywał
skanu KAŻDY DOWÓD → WSZYSTKIE TEZY równocześnie. MOD-SELEKCJA-DOWODOW działa
w kierunku Teza→Dowód i jest późniejszy w pipeline (po ustaleniu tez).
Ten moduł jest wcześniejszy i komplementarny: skanuje dowody bi-directionally,
buduje trwałą macierz D×T z klasami K/R/W/RK, identyfikuje dowody wielofunkcyjne
i luki, zanim W1.3 zostanie wypełnione.
Przykład z VII P 94/25: wiadomość RCS Prezesa Parka z 21.03.2026 obsługuje 3 tezy
jednocześnie (T1, T2, T5) i była w dowodach od początku — bez macierzy model
przypisał ją tylko do T2 (gotowość do pracy), pomijając wartość dla T1 i T5.
```

---

## CHANGELOG

**1.2.0 (2026-06-26) — NAPRAWA: MT6 format sądowy + zakaz symboli w piśmie**

Root cause (sprawa VII P 94/25, sesja 2026-06-26):
Moduł definiował jeden format wyjściowy (symbole ●/★/[K]) bez rozróżnienia
między formatem roboczym (pipeline) a formatem sądowym (pismo procesowe).
Model kopiował symbole wewnętrzne do tabeli w piśmie, co tworzyło dokument
nieczytelny dla sędziego — bez wartości procesowej.

Naprawy:
1. Nowa sekcja MT6 — FORMAT SĄDOWY TABELI W PIŚMIE PROCESOWYM:
   - ZASADA DWÓCH WARSTW: warstwa wewnętrzna (MT1–MT5, symbole) vs
     warstwa sądowa (MT6, tabela czytelna dla prawnika i sędziego)
   - Obowiązkowe kolumny: Lp. | Dowód | Lokalizacja w aktach |
     Roszczenie | Na okoliczność
   - Obowiązkowe: str./zał./godz. w kolumnie "Lokalizacja w aktach"
   - Decyzje o ograniczeniu dowodu (dawne RK): prozą pod tabelą, bez kodów
   - Katalog zakazu: ●/★/[K]/[W]/[RK]/PKR%/RF/RS i inne — nigdy w piśmie

2. Szablon szybki oznaczony explicite jako FORMAT ROBOCZY (nie sądowy).

3. SELF-CHECK: 4 nowe pytania MT6.

**1.1.0 (2026-06-21) — MT5-MANDATE-ALL-EVIDENCE, MT5-PROPORCJONALNOSC**
