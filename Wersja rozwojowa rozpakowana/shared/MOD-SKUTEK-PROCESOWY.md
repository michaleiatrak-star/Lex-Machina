# MOD-SKUTEK-PROCESOWY — Obowiązkowy Blok Skutku Procesowego

> **Plik:** `/mnt/skills/user/shared/MOD-SKUTEK-PROCESOWY.md`
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:** W2.2 — koniec każdego bloku uzasadnienia klasy A/B
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-SKUTEK-PROCESOWY.md`
> **Trigger:** OBOWIĄZKOWY po każdym bloku uzasadnienia zawierającym tezę klasy A lub B

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Pismo bez wyraźnego skutku procesowego zmusza sędziego do samodzielnego
wyciągania wniosków. Sędzia, który musi sam skonstruować konkluzję, może
skonstruować ją inaczej niż strona zamierza.

**Zasada:** Nigdy nie zostawiaj sędziego bez jednoznacznej instrukcji co
ma zrobić z tym argumentem. Skutek procesowy to instrukcja obsługi argumentu.

---

## SP-1 — SZABLON BLOKU SKUTKU PROCESOWEGO

Każdy blok uzasadnienia klasy A/B kończy się OBOWIĄZKOWO blokiem:

```
─────────────────────────────────────────────────
SKUTEK PROCESOWY:
[Jedno–dwa zdania. Konkret. Co Sąd ma zrobić.]

Format wzorcowy:
"W konsekwencji powyższego Sąd winien [ustalić / zasądzić / zobowiązać
/ nakazać] [konkretny skutek] — bez względu na [ewentualny kontrargument
pozwanego], gdyż [dlaczego kontrargument nie zmienia skutku]."
─────────────────────────────────────────────────
```

**Przykłady poprawne:**

```
SKUTEK PROCESOWY:
Sąd winien ustalić, że strony łączy umowa o pracę na czas nieokreślony
— bez względu na twierdzenie pozwanego o wygaśnięciu umowy z dniem
31.12.2024 r., gdyż przekształcenie z art. 25¹ §3 k.p. następuje
z mocy prawa i nie może być uchylone wolą pracodawcy.
```

```
SKUTEK PROCESOWY:
Sąd winien zasądzić wynagrodzenie za każdy miesiąc od 1 listopada 2024 r.
do dnia wydania wyroku — bez konieczności ustalania, czy powód fizycznie
stawiał się do pracy, gdyż przeszkoda w wykonywaniu pracy leżała
wyłącznie po stronie pracodawcy (art. 81 §1 k.p.).
```

```
SKUTEK PROCESOWY:
Sąd winien zasądzić wynagrodzenie uzupełniające w kwocie co najmniej
1 000 zł miesięcznie — a po zobowiązaniu pozwanego do złożenia
dokumentacji WnD/INF-D-P na podstawie art. 248 §1 k.p.c. — w pełnej
kwocie odpowiadającej faktycznie pobieranemu dofinansowaniu, ustalonej
na podstawie art. 322 k.p.c.
```

**Przykłady błędne (zbyt ogólne):**

```
❌ "Mając na uwadze powyższe, żądanie jest zasadne."
❌ "Wynika z powyższego, że pozwany naruszył prawo."
❌ "W świetle powyższego powód powinien wygrać."
```

---

## SP-2 — SKALA SKUTKÓW PROCESOWYCH

```
TYP S-1: USTALENIE (art. 189 k.p.c.)
  "Sąd winien ustalić, że [fakt / stosunek prawny]."
  Używaj gdy: spór o istnienie stosunku prawnego lub faktu

TYP S-2: ZASĄDZENIE
  "Sąd winien zasądzić od pozwanego na rzecz powoda [kwotę / świadczenie]."
  Używaj gdy: roszczenie pieniężne lub o świadczenie

TYP S-3: ZOBOWIĄZANIE (procesowe)
  "Sąd winien zobowiązać pozwanego do [złożenia dokumentów / wykonania czynności]."
  Używaj gdy: wniosek z art. 248 §1 k.p.c. lub inne zobowiązanie procesowe

TYP S-4: ŁĄCZONY
  "Sąd winien [S-1] oraz [S-2] — oba roszczenia są niezależne i mogą
   być uwzględnione łącznie."
  Używaj gdy: żądanie ustalenia + żądanie zapłaty (typowy przypadek)

TYP S-5: EWENTUALNY
  "Nawet gdyby Sąd nie uwzględnił [tezy głównej], winien [skutek
   alternatywny] na podstawie [inna podstawa prawna]."
  Używaj gdy: teza klasy 🔴/🟠 z zamknięciem furtki
```

---

## SP-3 — KONTROLA JAKOŚCI SKUTKU

```
Per każdy blok — przed zamknięciem:

SP-CHECK-1: Czy skutek jest KONKRETNY — nie ogólny?
  "Sąd winien zasądzić 1 000 zł/mc" ✅
  "Roszczenie jest zasadne" ❌

SP-CHECK-2: Czy skutek wskazuje CO Sąd ma zrobić — nie dlaczego?
  Uzasadnienie = dlaczego; Skutek = co.
  Jedno zdanie "dlaczego" dopuszczalne jako zamknięcie skutku.

SP-CHECK-3: Czy skutek odpowiada żądaniu z petitum?
  Skutek procesowy musi być spójny z treścią żądania nr 1/2/3.
  Rozbieżność = błąd redakcyjny → koryguj.

SP-CHECK-4: Czy przy tezie 🔴/🟠 dodano wariant ewentualny (S-5)?
  TAK → komplet; NIE → dodaj zamknięcie furtki.
```

---

## SP-4 — POZYCJA W DOKUMENCIE

```
Struktura każdego bloku uzasadnienia (schemat 7-elementowy + SP):

[1] FAKT
[2] DOWÓD (z lokalizatorem)
[3] PODSTAWA PRAWNA (zweryfikowana)
[4] ────────────────────────────────
    SKUTEK PROCESOWY:
    [treść wg SP-1]
    ────────────────────────────────
[5] ANTYCYPACJA ZARZUTU
[6] ZAMKNIĘCIE FURTKI (jeśli klasa 🔴/🟠)
[7] WNIOSEK CZĄSTKOWY

Uwaga: Skutek procesowy [4] umieszczamy PO podstawie prawnej,
PRZED antycypacją — żeby sędzia wiedział dokąd zmierzamy,
zanim zobaczy kontrargumenty i ich obalenie.
```

---

## SP-5 — INTEGRACJA Z PIPELINE

```
W2.2 (redakcja każdego bloku):
  → Po elemencie [3] PODSTAWA PRAWNA: obowiązkowo dodaj blok SP-1
  → Sprawdź SP-CHECK-1 do SP-CHECK-4 przed zamknięciem bloku

W2.4 (MOD-ATAK-NA-DRAFT):
  → D2: brak bloku SP = ⬛ LUKA-SP = atak 🔴

W3 (AUDYT-KOŃCOWY):
  → Kryterium SP: czy każdy blok klasy A/B ma blok skutku procesowego?
  → TAK: +1 do oceny; NIE: -2 do oceny (luka krytyczna)

⛔ ZAKAZ: Blok uzasadnienia klasy A/B bez sekcji SKUTEK PROCESOWY
  = nieaktywny procesowo = ⬛ LUKA-SP — nie generuj .docx.
```
