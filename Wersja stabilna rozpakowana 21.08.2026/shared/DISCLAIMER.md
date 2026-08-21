# DISCLAIMER — Moduł Zastrzeżenia Prawnego

> **Plik kanoniczny:** `/mnt/skills/user/shared/DISCLAIMER.md`
> **Wersja:** 2.1 | Aktualizacja: 2026-07-05b (R5 — klauzula profesjonalnej
>              weryfikacji dla pism kierowanych do sądu; NSA I FZ 104/26)

---

## ZASADA GŁÓWNA

**Każda odpowiedź systemu dotycząca prawa MUSI kończyć się disclaimerem.**

Brak disclaimera = potencjalne naruszenie regulacji dotyczących świadczenia
pomocy prawnej w Polsce (Prawo o adwokaturze, Dz.U. z 2024 r. poz. 1564 (t.j.);
ustawa o radcach prawnych, Dz.U. z 2024 r. poz. 499 (t.j.)).

**Odpowiedzialność za dodanie disclaimera leży na routerze (KROK 7).**
Skille dziedzinowe MOGĄ dodawać własny disclaimer jako element wyjściowy,
ale router ZAWSZE weryfikuje jego obecność w SELF-CHECK.

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
  □ Rozmowa to wyłącznie KROK 0A (anonimizacja) — dodaj DOPIERO przy analizie
```

---

## TREŚĆ DISCLAIMERA — DWA WARIANTY

### TRYB LAIK (uproszczony)

```
---
⚖️ **Ważna informacja:** Niniejsza analiza ma charakter wyłącznie informacyjny
i edukacyjny. Nie stanowi porady prawnej ani opinii prawnej w rozumieniu
Prawa o adwokaturze (Dz.U. z 2024 r. poz. 1564 (t.j.)) ani ustawy o radcach
prawnych (Dz.U. z 2024 r. poz. 499 (t.j.)). W indywidualnej sprawie zalecam
skonsultowanie się z adwokatem lub radcą prawnym.
```

### TRYB PRAWNIK (pełny)

```
---
⚖️ **Zastrzeżenie:** Niniejsza analiza ma charakter informacyjny. Nie stanowi
porady prawnej ani opinii prawnej w rozumieniu art. 4 Prawa o adwokaturze
(Dz.U. z 2024 r. poz. 1564 (t.j.)) ani art. 6 ustawy o radcach prawnych
(Dz.U. z 2024 r. poz. 499 (t.j.)). Weryfikacja przepisów: isap.sejm.gov.pl.
Orzecznictwo: orzeczenia.ms.gov.pl / sn.pl. Każda analiza wymaga weryfikacji
pod kątem aktualnego stanu prawnego i okoliczności konkretnej sprawy.
```

### WARIANT PISMO SĄDOWE (NOWY v2.1 — obowiązkowy dodatek dla pism kierowanych
### do sądu/organu, DOŁĄCZ do wariantu PRAWNIK, nie zamiast niego)

> Dodano po: postanowienie NSA z 23.06.2026, sygn. I FZ 104/26 — NSA ocenił
> "nader krytycznie" bezrefleksyjne korzystanie z AI przez profesjonalnego
> pełnomocnika (pismo zawierało zmyślone sygnatury/daty orzeczeń, których
> pełnomocnik najwyraźniej nie zweryfikował ani nie przeczytał przed
> podpisaniem). Ten wariant czyni ten obowiązek WIDOCZNYM w każdej odpowiedzi
> kończącej się projektem pisma procesowego, nie tylko domyślnym.

```
---
⚠️ **Przed podpisaniem i złożeniem do sądu/organu:** ten projekt wymaga
samodzielnej, merytorycznej lektury i weryfikacji przez pełnomocnika —
w szczególności każdej powołanej sygnatury, daty orzeczenia i tezy prawnej
(nie wystarczy weryfikacja formalna/stylistyczna). Odpowiedzialność zawodowa
za treść pisma wniesionego do sądu spoczywa na pełnomocniku, niezależnie od
narzędzi użytych przy jego przygotowaniu (art. 4 Prawa o adwokaturze /
art. 6 ustawy o radcach prawnych — należyta staranność). Tabela śladu
weryfikacji poniżej ułatwia tę kontrolę, ale jej NIE zastępuje.
```

**Pozycja:** bezpośrednio PO wariancie PRAWNIK, PRZED tabelą śladu weryfikacji
(poziom pełny), gdy odpowiedź zawiera projekt pisma kierowanego do sądu/organu
(pisma-procesowe-v3, pisma-proste-v2). Dla opinii/analiz bez pisma — pomiń,
wystarczy wariant PRAWNIK.

---

## POZYCJA DISCLAIMERA

```
Odpowiedź tekstowa    → zawsze ostatni akapit (nie środek, nie header)
Pismo .docx           → stopka na ostatniej stronie + w wiadomości czatu
Widget (raport/dash.) → sekcja "Informacje prawne" na końcu widgetu
```

---

## INTEGRACJA ZE SKILLAMI — WYMAGANIA PER SKILL

### prawny-router-v3 (KROK 7) ✅ Zintegrowany

Router weryfikuje disclaimer w SELF-CHECK (punkt [DISCLAIMER]).
Wywołanie: `view /mnt/skills/user/shared/DISCLAIMER.md` przed generowaniem outputu.

### analiza-sadowa-v6 ⚠️ Wymaga dodania

Dodać do sekcji RAPORT KOŃCOWY (Wiadomość 5, sekcja §11):

```markdown
### §11 — Zastrzeżenie prawne
view /mnt/skills/user/shared/DISCLAIMER.md
[wklej wariant LAIK lub PRAWNIK zależnie od trybu sesji]
```

### pisma-procesowe-v3 ⚠️ Wymaga dodania

Dodać do sekcji W3.6 — Pismo finalne, po generowaniu .docx:

```markdown
Po W3.6 — po generowaniu .docx:
- view /mnt/skills/public/docx/SKILL.md → generuj .docx → present_files
- Dodaj disclaimer: wariant LAIK/PRAWNIK JAK DOTĄD, plus OBOWIĄZKOWO
  wariant PISMO SĄDOWE (v2.1) bezpośrednio po nim — patrz sekcja wyżej
  → view /mnt/skills/user/shared/DISCLAIMER.md
- view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md → propozycja Raportu Sytuacyjnego
```

### pisma-proste-v2 ⚠️ Wymaga dodania

Dodać do KROK 9 (końcowy):

```markdown
KROK 9c → DISCLAIMER (obowiązkowy)
→ view /mnt/skills/user/shared/DISCLAIMER.md
→ Dodaj jako ostatni element wiadomości (LAIK: uproszczony / PRAWNIK: pełny)
  + WARIANT PISMO SĄDOWE (v2.1) bezpośrednio po wariancie PRAWNIK
```

### orzeczenia-sadowe-v2 ⚠️ Wymaga dodania

Dodać do sekcji WYNIK / RAPORT:

```markdown
Na końcu każdego raportu z orzeczeniami:
→ view /mnt/skills/user/shared/DISCLAIMER.md (wariant PRAWNIK)
Uwaga: orzecznictwo cytowane z oficjalnych baz nie zastępuje porady prawnej.
```

### analizator-dowodow-v3 ⚠️ Wymaga dodania

Dodać do sekcji RAPORT KOŃCOWY widgetu (sekcja "Informacje prawne"):

```markdown
→ view /mnt/skills/user/shared/DISCLAIMER.md
Widget: dodaj sekcję "Informacje prawne" na końcu widgetu z disclaimerem wariantu LAIK.
```

### analizator-umow-v1 ⚠️ Wymaga dodania

Dodać do sekcji WYNIK ANALIZY:

```markdown
Po raporcie analizy umowy:
→ view /mnt/skills/user/shared/DISCLAIMER.md (PRAWNIK: pełny)
```

### DR-01–DR-16 ⚠️ Wymaga dodania

Dla każdego DR-skill: dodać do sekcji OUTPUT / WYNIK:

```markdown
→ view /mnt/skills/user/shared/DISCLAIMER.md
[wariant zależnie od trybu sesji]
```

Skille DR są wczytywane przez router — router dodaje disclaimer przez KROK 7.
Jednak gdy DR-skill generuje samodzielny output (np. widget), powinien go dodać.

---

## MECHANIZM AWARYJNY (gdy brak dostępu do shared/DISCLAIMER.md)

Router i skille używają wbudowanego wariantu inline:

```
LAIK inline:
⚖️ Niniejsza analiza ma charakter informacyjny i nie stanowi porady prawnej.
Zalecam konsultację z adwokatem lub radcą prawnym.

PRAWNIK inline:
⚖️ Niniejsza analiza ma charakter informacyjny. Nie stanowi porady prawnej
(art. 4 Prawa o adwokaturze / art. 6 u.r.p.). Weryfikacja: isap.sejm.gov.pl.
```

---

## SELF-CHECK ROUTERA — SEKCJA DISCLAIMERA

Sekcja już jest w KROK 7 routera (v3.5) i pozostaje w SELF-CHECK (v3.6):

```
□ [DISCLAIMER] Odpowiedź zawiera analizę prawną → shared/DISCLAIMER.md jest OSTATNIM elementem?
  □ Tryb LAIK → wariant uproszczony
  □ Tryb PRAWNIK → wariant pełny
  □ Odpowiedź zawiera projekt pisma do sądu/organu → WARIANT PISMO SĄDOWE (v2.1)
    dołączony bezpośrednio po wariancie PRAWNIK?
  □ Pismo .docx → stopka na ostatniej stronie + disclaimer w wiadomości czatu
```
