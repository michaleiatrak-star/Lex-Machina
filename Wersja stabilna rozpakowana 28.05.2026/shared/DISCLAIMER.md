# DISCLAIMER — Moduł Zastrzeżenia Prawnego

> **Plik:** `/mnt/skills/user/shared/DISCLAIMER.md`
> **Wersja:** 1.0 (2026-05-25)
> **Status:** NOWY — naprawa BLOKER-1

---

## ZASADA GŁÓWNA

**Każda odpowiedź systemu dotycząca prawa MUSI kończyć się disclaimerem.**

Brak disclaimera = naruszenie regulacji dotyczących świadczenia pomocy prawnej w Polsce
(Prawo o adwokaturze, Dz.U. z 2020 r. poz. 1651 ze zm.; ustawa o radcach prawnych,
Dz.U. z 2022 r. poz. 1166 ze zm.).

---

## KIEDY STOSOWAĆ

```
ZAWSZE — przy każdej odpowiedzi zawierającej:
  □ analizę prawną (jakiegokolwiek rodzaju)
  □ kwalifikację prawną czynu/zdarzenia
  □ interpretację przepisu
  □ wskazanie roszczeń lub strategii procesowej
  □ projekt lub treść pisma procesowego
  □ ocenę szans w postępowaniu
  □ wskazanie terminów procesowych
  □ orzecznictwo z komentarzem do sprawy

WYJĄTEK — pominąć gdy:
  □ Odpowiedź dotyczy wyłącznie technikaliów (np. "jak wgrać plik")
  □ Pytanie jest czysto administracyjne (np. "jaki jest adres sądu")
  □ Rozmowa to wyłącznie KROK 0A (anonimizacja) — disclaimer dodać DOPIERO przy analizie
```

---

## TREŚĆ DISCLAIMERA — DWA WARIANTY

### TRYB LAIK (uproszczony)

```
---
⚖️ **Ważna informacja:** Niniejsza analiza ma charakter wyłącznie informacyjny
i edukacyjny. Nie stanowi porady prawnej ani opinii prawnej w rozumieniu
Prawa o adwokaturze (Dz.U. z 2020 r. poz. 1651 ze zm.) ani ustawy o radcach
prawnych (Dz.U. z 2022 r. poz. 1166 ze zm.). W indywidualnej sprawie zalecam
skonsultowanie się z adwokatem lub radcą prawnym.
```

### TRYB PRAWNIK (pełny)

```
---
⚖️ **Zastrzeżenie:** Niniejsza analiza ma charakter informacyjny. Nie stanowi
porady prawnej ani opinii prawnej w rozumieniu art. 4 Prawa o adwokaturze
(Dz.U. z 2020 r. poz. 1651 ze zm.) ani art. 6 ustawy o radcach prawnych
(Dz.U. z 2022 r. poz. 1166 ze zm.). Weryfikacja przepisów: isap.sejm.gov.pl.
Orzecznictwo: orzeczenia.ms.gov.pl / sn.pl. Każda analiza wymaga weryfikacji
pod kątem aktualnego stanu prawnego i okoliczności konkretnej sprawy.
```

---

## INTEGRACJA Z ROUTEREM

### Dodaj do SELF-CHECK routera (sekcja przed `JEŚLI BLOK 0A nie zamknięty`):

```
□ [DISCLAIMER] Odpowiedź zawiera analizę prawną → disclaimer MUSI być ostatnim elementem?
  □ Tryb LAIK → wariant uproszczony
  □ Tryb PRAWNIK → wariant pełny
  □ Pismo procesowe (.docx) → disclaimer na ostatniej stronie pisma + w wiadomości
```

### Pozycja w odpowiedzi:
- Odpowiedź tekstowa → zawsze **ostatni akapit** (nie środek, nie header)
- Pismo .docx → na ostatniej stronie pisma jako stopka + w wiadomości czatu
- Widget (raport, analizator) → jako sekcja "Informacje prawne" na końcu widgetu

---

## PODSTAWA PRAWNA (zweryfikowana 2026-05-25)

- Ustawa z dnia 26 maja 1982 r. Prawo o adwokaturze (Dz.U. z 2020 r. poz. 1651 ze zm.)
  art. 4 ust. 1: „Zawód adwokata polega na świadczeniu pomocy prawnej, a w szczególności
  na udzielaniu porad prawnych, sporządzaniu opinii prawnych, opracowywaniu projektów
  aktów prawnych oraz występowaniu przed sądami i urzędami."
- Ustawa z dnia 6 lipca 1982 r. o radcach prawnych (Dz.U. z 2022 r. poz. 1166 ze zm.)
  art. 6: zakres świadczenia pomocy prawnej przez radcę prawnego.

System AI nie jest adwokatem ani radcą prawnym. Świadczenie pomocy prawnej za
wynagrodzeniem przez podmiot nieuprawniony może skutkować nieważnością umowy
(stanowisko NRA — projekt nowelizacji 2025). System ten nie pobiera wynagrodzenia,
lecz z ostrożności stosuje disclaimer przy każdej analizie prawnej.
