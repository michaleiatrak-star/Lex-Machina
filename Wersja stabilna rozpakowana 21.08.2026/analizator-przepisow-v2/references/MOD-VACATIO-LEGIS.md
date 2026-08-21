# MOD-VACATIO-LEGIS — Nowelizacje wieloetapowe i vacatio legis

**Wersja:** 1.0 | **Dodano:** 2026-06-03
**Wywołaj:** z MODUŁ 7C (MOD-HISTORIA-ZMIAN) gdy wykryto vacatio legis lub nowelizację wieloetapową.
**Zasada:** `view /mnt/skills/user/shared/PRAWO-HARDGATE.md` przed każdym przepisem z tego modułu.

---

## CO TO JEST VACATIO LEGIS

Vacatio legis to okres między dniem **ogłoszenia** aktu w Dzienniku Ustaw a dniem jego **wejścia w życie**. W tym czasie akt jest już opublikowany, ale jeszcze nie obowiązuje.

**Znaczenie procesowe:** ten sam przepis może mieć **trzy różne wersje** dla jednej sprawy:
- wersja obowiązująca w dniu zdarzenia,
- wersja obowiązująca w dniu złożenia pisma,
- wersja obowiązująca w dniu orzekania.

---

## TYPY NOWELIZACJI WIELOETAPOWYCH

### Typ 1 — Standardowe vacatio legis (14 dni)

Domyślny termin z art. 4 ustawy o ogłaszaniu aktów normatywnych (Dz.U. 2019 poz. 1461).

```
Ogłoszenie w Dz.U. → 14 dni → Wejście w życie
Przykład: opublikowano 1.03.2025 → obowiązuje od 15.03.2025
```

### Typ 2 — Vacatio legis wydłużone (30, 60, 90, 180 dni lub więcej)

Ustawa może wskazać dowolny termin w przepisach przejściowych.

```
Sygnał w tekście: "ustawa wchodzi w życie po upływie [N] dni od dnia ogłoszenia"
lub: "z dniem [konkretna data]"
```

### Typ 3 — Przepisy przejściowe z rozbiciem na partie

Część przepisów wchodzi w życie w różnych datach wskazanych w ustawie zmieniającej.

```
Przykład KPC (nowelizacja 2025 poz. 1172):
  Art. 1–15 nowelizacji → od 1.03.2026
  Art. 16–28 nowelizacji → od 1.03.2027
  Przepisy dotyczące mediacji budowlanej → od 1.01.2027
```

**Ryzyko:** analiza przepisu bez sprawdzenia której partii przepisów zmiana dotyczy
prowadzi do błędnego ustalenia stanu prawnego.

### Typ 4 — Przepisy retrospektywne (wsteczna moc obowiązująca)

Rzadkie, wymagają wyraźnej podstawy. Sprawdź czy przepis końcowy ustawy
zawiera klauzulę "przepis ma zastosowanie do [zdarzeń/postępowań] wszczętych przed dniem wejścia w życie".

### Typ 5 — Przepisy intertemporalne (stan prawny dla postępowań w toku)

Najczęściej w nowelizacjach KPC, KPK, KPA.

```
Wzorzec: "Do postępowań wszczętych i niezakończonych przed dniem wejścia
          w życie niniejszej ustawy stosuje się przepisy dotychczasowe."
```

**Oznacza:** sprawa wszczęta przed datą X jest nadal prowadzona według starego prawa,
nawet jeśli nowe prawo już obowiązuje.

---

## PROCEDURA ANALIZY VACATIO LEGIS

### Krok VL-1 — Identyfikacja struktury czasowej

```
Dla analizowanego aktu na ISAP sprawdź:
  1. Data ogłoszenia w Dz.U. (kolumna "Ogłoszono")
  2. Data wejścia w życie (kolumna "Obowiązuje od")
  3. Czy są przepisy końcowe z różnymi datami? → wczytaj art. końcowy ustawy
```

### Krok VL-2 — Ustalenie stanu prawnego na datę docelową

```
DATA ZDARZENIA: [DD.MM.RRRR]

Sprawdź kolejno:
  A. Czy przepis istniał w tej dacie? (akt mógł nie być jeszcze opublikowany)
  B. Czy akt był już opublikowany, ale jeszcze nie obowiązywał? → vacatio legis
  C. Czy akt obowiązywał? → ustal wersję ze zmianami do tej daty
  D. Czy po tej dacie przepis zmieniono? → ustal wersję aktualną

WYNIK → jedna z czterech sytuacji:
  [VL-PRZED]    przepis nie istniał w dacie zdarzenia
  [VL-VACATIO]  akt ogłoszony, ale nie obowiązywał — stosuje się stare prawo
  [VL-AKTYWNY]  przepis obowiązywał — podaj wersję z tej daty
  [VL-ZMIANA]   przepis zmieniony po dacie zdarzenia — wskaż obie wersje
```

### Krok VL-3 — Weryfikacja przepisów intertemporalnych

```
Sprawdź art. końcowe ustawy zmieniającej pod kątem klauzul:
  □ "stosuje się przepisy dotychczasowe do postępowań wszczętych przed..."
  □ "przepis stosuje się po raz pierwszy do..."
  □ "do zobowiązań powstałych przed... stosuje się przepisy w brzmieniu..."
  □ "przepisy nie mają zastosowania do..."

Jeśli znaleziono klauzulę → oznacz wyraźnie jaka reguła intertemporalna obowiązuje
```

### Krok VL-4 — Format raportu vacatio legis

```
ANALIZA VACATIO LEGIS — [identyfikator przepisu]
Akt: [pełna nazwa + Dz.U.]
Data ogłoszenia: [DD.MM.RRRR]
Data wejścia w życie: [DD.MM.RRRR]
Vacatio legis: [N dni]

ETAPY WEJŚCIA W ŻYCIE:
┌──────────────────────┬───────────────────────────────────────────────────┐
│ Data                 │ Zakres przepisów                                  │
├──────────────────────┼───────────────────────────────────────────────────┤
│ [DD.MM.RRRR]         │ [które artykuły/przepisy]                         │
│ [DD.MM.RRRR]         │ [kolejna partia przepisów]                        │
└──────────────────────┴───────────────────────────────────────────────────┘

STAN DLA ANALIZOWANEJ SPRAWY:
  Data zdarzenia: [DD.MM.RRRR] → [VL-PRZED / VL-VACATIO / VL-AKTYWNY / VL-ZMIANA]
  Wersja przepisu: [treść z datą] ← źródło: [URL ISAP]
  Wersja aktualna: [treść] ← źródło: [URL ISAP]

KLAUZULA INTERTEMPORALNA: [tak — opis / nie wykryto]
RYZYKO: [opis ryzyka procesowego z tytułu vacatio legis lub zmiany w toku]
```

---

## ALERTY AUTOMATYCZNE

### Alert VL-A: Aktywne vacatio legis

Uruchom gdy: data analizy < data wejścia w życie najnowszej nowelizacji.

```
⚠️ VACATIO LEGIS — AKTYWNE
Przepis zostanie zmieniony w dniu [DATA].
Aktualne brzmienie: [wersja dziś]
Brzmienie po zmianie: [wersja od DATA]
Wpływ na sprawę: [ocena]
```

### Alert VL-B: Rozbieżność wersji

Uruchom gdy: wersja w dacie zdarzenia ≠ wersja aktualna.

```
⚠️ ZMIANA PRZEPISU W TRAKCIE SPRAWY
Wersja w dacie zdarzenia ([data]): [treść]
Wersja aktualna ([data]): [treść]
Kluczowa różnica: [co się zmieniło]
Która wersja stosuje się: [z uzasadnieniem — przepisy intertemporalne lub zasada tempus regit actum]
```

### Alert VL-C: Wiele partii wejścia w życie

Uruchom gdy: ustawa ma przepisy wchodzące w różnych datach.

```
⚠️ NOWELIZACJA WIELOETAPOWA
Uwaga: ta ustawa wchodzi w życie w [N] etapach.
Sprawdź, która partia przepisów dotyczy analizowanego artykułu.
Daty etapów: [lista]
```

---

## INTEGRACJA Z MODUŁEM 7C (MOD-HISTORIA-ZMIAN)

Moduł 7C uruchamia MOD-VACATIO-LEGIS automatycznie gdy:
- wykryje vacatio legis w historii aktu na ISAP,
- historia zmian zawiera nowelizację z wieloma datami wejścia w życie,
- użytkownik podał datę zdarzenia sprzed wejścia w życie najnowszej zmiany.

Wynik MOD-VACATIO-LEGIS trafia do **Zakładki 6 — Historia Zmian** widgetu wyników
(Moduł 8 SKILL.md) jako osobna podsekcja "Vacatio legis i przepisy przejściowe".

---

## ZASADA TEMPUS REGIT ACTUM

Dla większości czynności procesowych obowiązuje zasada: do oceny czynności stosuje się
prawo z **daty dokonania czynności**, nie z daty orzekania.

**Wyjątki wymagające osobnej weryfikacji:**
- sankcje karne (lex mitior — prawo łagodniejsze dla oskarżonego),
- prawo do sądu i gwarancje procesowe (EKPC — weryfikuj aktualny standard),
- postępowania wszczęte przed zmianą prawa z klauzulą intertemporalną.

Każdy z tych wyjątków → wywołaj `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`
i zweryfikuj stosowny przepis przejściowy online.
