# mod-ustawa-PCC-i-podatek-spadkow-darowizn

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** PCC — Dz.U. 2026 poz. 191 t.j. ✅ VER: 2026-06-05 | Podatek SD — Dz.U. 2024 poz. 1837 t.j. ze zm. (zm.: Dz.U. 2025 poz. 1064) ✅ VER: 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**⚠️ Kwoty wolne od podatku SD — ZAWSZE weryfikuj aktualne przez web_search**

---

## 1. CORE

**PCC:** podatek od czynności cywilnoprawnych (umowy sprzedaży, pożyczki, spółki, hipoteki, depozytu nieprawidłowego).
**SD:** podatek od spadków i darowizn (nabytki od osób z poszczególnych grup pokrewieństwa).

---

## 2. PCC — STAWKI I PROCEDURA

### Stawki PCC (art. 7 ustawy o PCC — weryfikuj w ISAP)

```
1%:    Umowy sprzedaży ruchomości
2%:    Umowy sprzedaży nieruchomości, praw spółdzielczych, użytkowania wieczystego
0,5%:  Umowy spółki, podwyższenie kapitału, zmiana umowy
0,5%:  Pożyczka osoby fizycznej dla osoby fizycznej
0,1%:  Hipoteka na sumie wierzytelności; 19 zł na kwotę nieokreśloną
```

### PCC 6% — ZAKUP 2. I KOLEJNYCH MIESZKAŃ (od 31.08.2023!)

```
Przy zakupie 2. i więcej nieruchomości mieszkalnych przez osobę fizyczną:
  → 6% PCC od wartości rynkowej
  → ZWOLNIENIE: zakup 1. mieszkania (art. 9 pkt 17 ustawy o PCC)
  → Warunek zwolnienia: podatnik nie posiada żadnego innego lokalu/domu
  ⚠️ Weryfikuj aktualne warunki i wyjątki w ISAP
web_search: "PCC 6% mieszkanie 2025 warunki 2 lokal zwolnienie"
```

### Wyłączenia (nie podlega PCC)

```
□ Czynności podlegające VAT (zasada konkurencji VAT/PCC)
  WYJĄTEK: Sprzedaż nieruchomości zwolnionych z VAT → podlega PCC
□ Notariusz pobiera PCC przy aktach notarialnych (brak obowiązku deklaracji)
```

### Termin i deklaracja

```
PCC-3: W terminie 14 dni od zawarcia umowy (gdy bez notariusza)
Opłata: samoobliczenie i zapłata równocześnie ze złożeniem deklaracji
Notariusz: pobiera PCC i odprowadza za podatnika
```

---

## 3. PODATEK SD — GRUPY PODATKOWE I ZWOLNIENIA

### Grupy podatkowe

```
GRUPA 0 (zwolniona — art. 4a SD):
  Małżonek, zstępni, wstępni, pasierb, rodzeństwo, ojczym, macocha
  → PEŁNE ZWOLNIENIE przy zgłoszeniu SD-Z2 w terminie 6 miesięcy

GRUPA I:
  Małżonek, zstępni, wstępni, pasierb, zięć, synowa, rodzeństwo, ojczym, macocha, teściowie

GRUPA II:
  Zstępni rodzeństwa, rodzeństwo rodziców, małżonkowie rodzeństwa,
  małżonkowie innych wstępnych

GRUPA III:
  Inni nabywcy (niespokrewnieni)
```

### ZWOLNIENIE GRUPY 0 — WARUNKI

```
⚠️ KRYTYCZNE: Zwolnienie wymaga ZGŁOSZENIA SD-Z2 w TERMINIE 6 MIESIĘCY od nabycia
  → Nabycie tytułem darowizny: 6 miesięcy od daty darowizny
  → Nabycie tytułem dziedziczenia: 6 miesięcy od uprawomocnienia stwierdzenia nabycia
  → Niezgłoszenie w terminie = UTRATA ZWOLNIENIA i obowiązek zapłaty podatku!

Przy darowiźnie środków pieniężnych:
  → Wymóg udokumentowania otrzymania na konto (przelew lub przekaz pocztowy)
```

### Kwoty wolne — ZAWSZE weryfikuj przed podaniem!

```
⚠️ Kwoty wolne zmieniane są ustawowo — ZAWSZE weryfikuj aktualne:
web_search: "podatek od spadków darowizn kwoty wolne grupy podatkowe 2025 2026"
web_search: "SD kwota wolna Dz.U. 2024 poz. 1837 nowelizacja 2025 poz. 1064"
```

### Terminy SD

```
SD-Z2 (zwolnienie gr. 0):  6 miesięcy od daty nabycia — ZAWITY
SD-3 (deklaracja):         1 miesiąc od powstania obowiązku
```

---

## 4. STRATEGIA, QUALITY GATE, OUTPUT

**Strategia:** SD: sprawdź czy nabycie mieści się w grupie 0 i złóż SD-Z2 PRZED upływem 6 miesięcy. PCC: przy zakupie nieruchomości sprawdź czy jest to 1. czy 2.+ mieszkanie. Przy sporze z organem: termin 14 dni na odwołanie (Op).

**Quality gate:** Kwoty wolne SD — zweryfikowane (nie z pamięci)? SD-Z2 złożone w terminie 6 miesięcy? PCC 6% — sprawdzono czy jest to 2.+ nieruchomość?

**Output:** Kwalifikacja (PCC/SD) → stawka/kwota wolna → deklaracja → spór (termin 14 dni).

**Powiązania:** `mod-OP-ordynacja-podatkowa` | `dr-02` → `mod-KC-spadki` (nabycie majątku) | `dr-05` → `mod-ustawa-SKO` (odwołanie) | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000191 (PCC) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20241837 (SD)
