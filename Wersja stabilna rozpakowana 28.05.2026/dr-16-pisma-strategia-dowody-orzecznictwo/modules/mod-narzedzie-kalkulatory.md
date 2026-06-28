# Kalkulatory Procesowe — Prawo Polskie v2

Plik wczytywany **wyłącznie gdy sprawa wymaga obliczeń.**
Zawiera: kalkulator terminów, zachowku, nadgodzin, emerytury.

---

## KALKULATOR TERMINÓW

Po otrzymaniu daty doręczenia oblicz automatycznie wszystkie krytyczne terminy:

```
DATA DORĘCZENIA: [DD.MM.RRRR]
↓
Oblicz:
  + 7 dni      → sprzeciw od wyroku nakazowego (wykroczenia, art. 94 KPSW) ZAWITY
  + 14 dni     → odwołanie od decyzji administracyjnej (art. 129 §2 KPA) ZAWITY
  + 14 dni     → sprzeciw od orzeczenia lekarza orzecznika ZUS ZAWITY
  + 14 dni     → odstąpienie od umowy (internet / poza lokalem, art. 27 uPK)
  + 21 dni     → odwołanie od wypowiedzenia / dyscyplinarki (art. 264 KP) ZAWITY
  + 30 dni     → skarga do WSA (art. 53 §1 PPSA)
  + 1 miesiąc  → odwołanie od decyzji ZUS do sądu (art. 477⁹ §1 KPC)
  + 6 tygodni  → zaskarżenie uchwały wspólnoty mieszkaniowej (art. 25 uWŁ)
  + 6 miesięcy → oświadczenie o przyjęciu / odrzuceniu spadku (art. 1015 KC)

OSTRZEŻENIA:
  Termin < 5 dni:   🚨 PILNE — zostały X dni!
  Termin minął:     ❌ TERMIN UPŁYNĄŁ — sprawdź możliwość przywrócenia (art. 168 KPC / 58 KPA)
```

### Tabela terminów — reference card

| Termin | Czynność | Podstawa | Typ |
|---|---|---|---|
| **7 dni** | Sprzeciw od wyroku nakazowego | art. 94 KPSW | ZAWITY |
| **14 dni** | Odwołanie od decyzji adm. | art. 129 §2 KPA | ZAWITY |
| **14 dni** | Sprzeciw od orzeczenia ZUS | art. 14 ustawy FUS | ZAWITY |
| **14 dni** | Odstąpienie od umowy (internet) | art. 27 uPK | PREKLUZYJNY |
| **21 dni** | Odwołanie od wypowiedzenia | art. 264 KP | ZAWITY |
| **30 dni** | Skarga do WSA | art. 53 §1 PPSA | ZAWITY |
| **1 miesiąc** | Odwołanie ZUS do sądu | art. 477⁹ KPC | ZAWITY |
| **1 miesiąc** | Termin dyscyplinarki (dla pracodawcy) | art. 52 §2 KP | ZAWITY |
| **6 tygodni** | Zaskarżenie uchwały WM | art. 25 uWŁ | ZAWITY |
| **6 miesięcy** | Przyjęcie / odrzucenie spadku | art. 1015 KC | ZAWITY |
| **3 lata** | Przedawnienie — roszczenia prac. | art. 291 KP | PRZEDAWNIENIE |
| **3 lata** | Przedawnienie — delikt od wiedzy | art. 442¹ §1 KC | PRZEDAWNIENIE |
| **5 lat** | Zachowek — przedawnienie | art. 1007 KC | PRZEDAWNIENIE |
| **6 lat** | Przedawnienie ogólne KC | art. 118 KC | PRZEDAWNIENIE |

---

## KALKULATOR ZACHOWKU

```
KROK 1 — SUBSTRAT ZACHOWKU:
  Czysta wartość spadku (aktywa − długi):        [X] zł
  + Darowizny doliczane (z 10 lat przed śmiercią): [Y] zł
  = Substrat zachowku:                            [X + Y] zł

KROK 2 — UDZIAŁ ZACHOWKOWY:
  Uprawniony małoletni lub trwale niezdolny do pracy:  2/3 udziału ustawowego
  Pozostali uprawnieni (pełnoletni, zdolni do pracy):  1/2 udziału ustawowego

KROK 3 — WYLICZENIE:
  Zachowek = substrat × udział zachowkowy × udział w dziedziczeniu ustawowym

PRZYKŁAD:
  Substrat: 300 000 zł | Uprawniony: syn (pełnoletni) | Dziedziczą: 2 dzieci
  Udział ustawowy syna: 1/2 | Udział zachowkowy: 1/2 × 1/2 = 1/4
  Zachowek = 300 000 × 1/4 = 75 000 zł

PRZEDAWNIENIE: 5 lat od ogłoszenia / otwarcia testamentu (art. 1007 KC)
WERYFIKUJ: czy darowizny sprzed ponad 10 lat można wyłączyć (art. 994 KC)
```

---

## KALKULATOR NADGODZIN

```
KROK 1 — STAWKA GODZINOWA:
  Stawka = wynagrodzenie miesięczne brutto ÷ (wymiar etatu × 4,33 × 8h)

KROK 2 — DOPŁATA:
  Godziny w dzień powszedni (normalne):      +50% stawki godzinowej
  Godziny przekraczające dobowy wymiar:       +50% lub +100% (zależy od normy)
  Godziny w porze nocnej (21:00–7:00):       +100% stawki
  Godziny w niedzielę / święto:              +100% stawki

KROK 3 — KWOTA DO ZAPŁATY:
  Dopłata = liczba nadgodzin × stawka godzinowa × współczynnik (1,5 lub 2,0)

PRZEDAWNIENIE: 3 lata wstecz od daty wytoczenia powództwa (art. 291 KP)
UWAGA: Pracodawca może zastąpić dopłatę czasem wolnym (za zgodą pracownika).
```

---

## KALKULATOR EMERYTURY (uproszczony)

```
SYSTEM NOWY (urodzeni po 31.12.1948, składki po 01.01.1999):
  Emerytura = suma składek na koncie ZUS ÷ dalsze trwanie życia (miesiące, tabela GUS)
  Warunek: osiągnięcie wieku emerytalnego (60 lat kobiety / 65 lat mężczyźni)
  Brak wymogu stażu ubezpieczeniowego — ale składki muszą być na koncie

SYSTEM STARY (urodzeni przed 01.01.1949 lub uprawnienia mieszane):
  Wymagany staż: 20 lat kobiety / 25 lat mężczyźni (składkowe + nieskładkowe)
  Podstawa: 24% kwoty bazowej + 1,3% za każdy rok składkowy + 0,7% nieskładkowy

EMERYTURA POMOSTOWA:
  → praca w szczególnych warunkach lub o szczególnym charakterze
  → minimum 15 lat pracy szczególnej
  → Wykaz prac szczególnych: Ustawa o emeryturach pomostowych Dz.U. 2025 poz. 468 t.j. ✅ VER: 2026-06-09
    (pierwotnie Dz.U. 2008 nr 237 poz. 1656 — zastąpiony przez t.j. 2025.468)

UWAGA: Dokładne wyliczenie wymaga danych z konta ZUS (PUE ZUS: pue.zus.pl)
```
