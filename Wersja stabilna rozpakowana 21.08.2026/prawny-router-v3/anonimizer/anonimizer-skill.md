---
name: anonimizer-v3-jsx
parent: prawny-router-v3
description: |
  Anonimizer dokumentów prawnych v3.2 — domyślny krok wstępny routera.
  Obsługuje PDF, DOCX, DOC, XLSX, TXT/MD.
  Tryb domyślny: TEKSTOWY z listą wyboru kategorii do usunięcia.
  Tryb plikowy: przeciągnij-i-upuść lub kliknij. AI (Anthropic API) odczytuje i anonimizuje PDF/DOCX/XLSX.
  Eksportuje tekst do czatu przez sendPrompt z zachowaniem znaczników routera.
compatibility: "html-vanilla, sendPrompt"
version: "3.2"
default_renderer: "/mnt/skills/user/prawny-router-v3/anonimizer/assets/AnonimizerPrawny.jsx"
rules: "/mnt/skills/user/prawny-router-v3/anonimizer/references/REGULY-ANONIMIZACJI.md"
legacy_renderer: "/mnt/skills/user/prawny-router-v3/anonimizer/assets/anonimizer-widget.legacy.html"
---

# Anonimizer v3.2 — KROK 0A Routera Prawnego

## Status modułu

Domyślny tryb pracy: **HTML vanilla JS** renderowany przez show_widget.

Plik `AnonimizerPrawny.jsx` zawiera kompletny kod HTML (nie JSX) — renderuj go przez show_widget, nie przez present_files.

Stary widget HTML pozostaje wyłącznie jako zapas archiwalny:
`assets/anonimizer-widget.legacy.html`.

---

## Co nowego w v3.2

- **Domyślny tryb tekstowy** z listą wyboru kategorii (checkboxy-przyciski)
- **Przeciąganie pliku** (drag & drop) do strefy upuszczania w zakładce Plik
- **Odczyt PDF przez Anthropic API** — ekstrakcja tekstu z zachowaniem układu, działa też dla skanów (AI widzi obraz)
- **Odczyt DOCX przez Anthropic API** — pełna ekstrakcja z formatowaniem
- **Odczyt XLSX przez Anthropic API** — ekstrakcja danych tabelarycznych
- **Pięć trybów zastępowania**: etykieta opisowa / czarne bloki / gwiazdki / usuń / fikcyjne dane AI
- **Własne frazy** do usunięcia (dowolny tekst)
- **Własne wzorce regex** w zakładce Ustawienia
- **Przycisk „Wyślij do analizy prawnej ↗"** — wywołuje sendPrompt ze znacznikami ##ANON_START##
- Pasek postępu dla operacji na plikach

---

## Integracja z routerem

Anonimizer działa jako **KROK 0A** — przed detekcją trybu prawnego.

```
KROK 0A → anonimizacja / decyzja użytkownika
KROK 1  → detekcja trybu prawnego
KROK 1B → walidacja dziedzinowa + źródła prawa
```

---

## Kiedy uruchomić anonimizator

### Tryb A — automatyczna detekcja danych
Przeskanuj wejście użytkownika przed analizą.

Próg uruchomienia pytania anonimizacyjnego:
- co najmniej 1 sygnał wysokiego ryzyka, albo
- co najmniej 2 sygnały średniego ryzyka.

Sygnały wysokiego ryzyka:
- PESEL,
- NIP,
- REGON,
- numer rachunku bankowego,
- pełny adres,
- imię i nazwisko w dokumencie prywatnym.

Sygnały średniego ryzyka:
- telefon,
- e-mail,
- data urodzenia,
- nazwa firmy w kontekście osoby fizycznej lub sporu.

### Tryb B — na żądanie
Gdy użytkownik wpisuje jedną z fraz:
- `zanonimizuj`,
- `anonimizuj`,
- `anonimizacja`,
- `usuń dane osobowe`,
- `ukryj dane`,
- `usuń nazwiska`,
- `usuń adresy`,
- `RODO`,
- `chcę zanonimizować`.

Wtedy uruchom anonimizator bez pytania wstępnego.

---

## Pytanie anonimizacyjne

Jeżeli wykryto dane osobowe, ale użytkownik nie zażądał anonimizacji wprost, zadaj:

```
Wykryłem w przesłanym dokumencie możliwe dane osobowe lub identyfikacyjne.

Czy chcesz je zanonimizować przed analizą?
a) Tak — uruchom narzędzie anonimizacji.
b) Nie — analizuj dokument bez zmian.

Anonimizacja zastąpi dane znacznikami typu [PESEL], [ADRES], [E-MAIL] albo inicjałami.
```

- `a` / `tak` → uruchom JSX.
- `b` / `nie` → przejdź do KROK 1 z oryginalnym tekstem i oznacz decyzję sesyjną jako `raw`.

---

## Domyślne uruchomienie JSX

```
1. view /mnt/skills/user/prawny-router-v3/anonimizer/references/BLUEPRINT-SCHEMA.md
2. view /mnt/skills/user/prawny-router-v3/anonimizer/references/REGULY-ANONIMIZACJI.md
3. view /mnt/skills/user/prawny-router-v3/anonimizer/assets/AnonimizerPrawny.jsx
4. show_widget z HTML vanilla JS — jedyna metoda renderowania inline w claude.ai (NIE present_files z .jsx)
```

Komunikat do użytkownika:

```
Otwieram narzędzie anonimizacji. Wgraj plik (PDF/DOCX/DOC/TXT) lub wklej tekst.
Treść pliku nie będzie wyświetlana — anonimizacja odbywa się lokalnie w tle.
Po zakończeniu wybierz „Anonimizuj i wyślij" — wynik wróci do czatu ze znacznikami routera.
```

---

## Obsługiwane formaty plików

| Format | Biblioteka | Uwagi |
|--------|-----------|-------|
| PDF    | PDF.js 3.11.174 (CDN) | Ekstrakcja tekstu strona po stronie; nie obsługuje PDF skanowanych (OCR) |
| DOCX   | Mammoth 1.6.0 (CDN) | Pełna ekstrakcja tekstu |
| DOC    | Mammoth 1.6.0 (CDN) | Fallback tekstowy dla Word 97–2003; zalecane zapisanie jako DOCX |
| TXT/MD | natywny TextDecoder | Bez zależności CDN |

---

## Ograniczenia

- Automatyczna anonimizacja działa heurystycznie.
- Wynik wymaga kontroli człowieka.
- PDF skanowane (graficzne) nie zawierają warstwy tekstowej — ekstrakcja zwróci pusty wynik.
- Stare pliki .doc (Word 97–2003) mogą być nieczytelne — zalecane DOCX.
- Moduł nie usuwa metadanych binarnych z plików PDF/DOCX.
- Nie wolno traktować wyniku jako gwarancji pełnej zgodności z RODO.

---

## Znaczniki zwrotne

### Tekst zanonimizowany
```
##ANON_START##
Źródło: [nazwa pliku albo "(wklejony tekst)"]
Anonimizacja: TAK | Usuniętych danych: N (...)
##ANON_END##

Oto zanonimizowany dokument do analizy prawnej:

[treść dokumentu]
```

### Tekst oryginalny za zgodą użytkownika
```
##PLIK_ORYGINALNY##
Źródło: [nazwa pliku albo "(wklejony tekst)"]
Anonimizacja: NIE — użytkownik wyraził zgodę na przetwarzanie danych oryginalnych w tej sesji.
##PLIK_ORYGINALNY_END##

Oto dokument oryginalny (bez anonimizacji) do analizy prawnej:

[treść dokumentu]
```

---

## Reakcja routera

Jeżeli wiadomość zawiera `##ANON_START##`:
- pomiń KROK 0A,
- ustaw `decyzja_sesji = anon`,
- przejdź do KROK 1.

Jeżeli wiadomość zawiera `##PLIK_ORYGINALNY##`:
- pomiń KROK 0A,
- ustaw `decyzja_sesji = raw`,
- przejdź do KROK 1.

---

*Anonimizer v3.1 JSX · prawny-router-v3 · PDF + DOCX + DOC + TXT · bez podglądu treści*
