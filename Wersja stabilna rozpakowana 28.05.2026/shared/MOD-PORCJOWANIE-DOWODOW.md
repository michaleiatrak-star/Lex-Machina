# MOD-PORCJOWANIE-DOWODOW — Zarządzanie oknem kontekstowym przy dużych zbiorach dowodów

> **Plik:** `/mnt/skills/user/shared/MOD-PORCJOWANIE-DOWODOW.md`
> **Wersja:** 1.0.0 (2026-06-21)
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - prawny-router-v3: KROK 0C (nowy) — po KROK 0B, przed KROK 1
>   - analizator-dowodow-v3: między BLOK B a KROK 1 (MD1-ekstrakcja)
>   - pisma-procesowe-v3: W1.2c — przed MOD-MACIERZ-DOWOD-TEZA gdy materiał duży
>
> **Relacja z MOD-KONTEKST-SESJI:**
>   MOD-KONTEKST-SESJI = bridge MIĘDZY sesjami (eksport/import stanu)
>   MOD-PORCJOWANIE-DOWODOW = zarządzanie WEWNĄTRZ sesji (dzielenie pracy na partie)
>   Oba współpracują: PORCJOWANIE generuje checkpoint → KONTEKST-SESJI go eksportuje.

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Model nie ma dostępu do licznika tokenów w trakcie generowania. Nie może sprawdzić
"ile zostało miejsca" reaktywnie — gdy zabraknie kontekstu, odpowiedź urwie się
bez ostrzeżenia, tracąc wyniki częściowej analizy.

Jedyna skuteczna strategia to działanie **profilaktyczne**: przed analizą oszacuj
rozmiar materiału, podziel na partie o bezpiecznym rozmiarze, przetwarzaj partie
z numerowanymi checkpointami i protokołem wznawiania.

**Progi bezpieczeństwa (szacunkowe):**
```
BEZPIECZNY:     ≤ 5 plików i ≤ 100 KB łącznie  → analiza jednorazowa
OSTRZEŻENIE:    6–15 plików lub 100–400 KB      → porcjowanie zalecane
WYMAGANE:       ≥ 16 plików lub > 400 KB        → porcjowanie obowiązkowe
KRYTYCZNE:      ≥ 30 plików lub > 800 KB        → max 3–4 pliki per partia
```

Progi uwzględniają że okno kontekstowe zajmują też: treść rozmowy,
wczytane moduły skilli (każdy view ≈ 5–20 KB), generowane raporty.
Konserwatywne progi minimalizują ryzyko utraty wyników.

---

## SKAN WSTĘPNY (PD0) — wykonaj zawsze przed analizą materiału

```
KROK PD0.1 — Inwentaryzacja materiału:
  Dla każdego dostarczonego pliku / dokumentu / załącznika:
    - nazwa pliku
    - typ (PDF / DOCX / XLSX / JPG / ODT / ZIP / inny)
    - rozmiar w KB (z metadanych lub bash: ls -lh / wc -c)
    - szacowana gęstość tekstu:
        DOK-TEKSTOWY (PDF/DOCX/ODT/TXT) → 1 KB ≈ 150–200 tokenów
        TABELA (XLSX/CSV)               → 1 KB ≈ 80–120 tokenów
        OBRAZ/SKAN (JPG/PNG)            → stały koszt ≈ 1600 tokenów/obraz
        ZIP                             → zawartość nieznana → rozpakuj, skanuj osobno

KROK PD0.2 — Oblicz szacunek łączny:
  SUMA_KB = suma rozmiarów wszystkich plików tekstowych
  SUMA_OBRAZY = liczba plików graficznych × 1600 tokenów
  SZACUNEK_TOKENOW = SUMA_KB × 175 + SUMA_OBRAZY
  LICZBA_PLIKOW = łączna liczba plików do analizy

KROK PD0.3 — Klasyfikacja materiału:
  Jeśli LICZBA_PLIKOW ≤ 5 i SUMA_KB ≤ 100:
    → STATUS: BEZPIECZNY → pomiń porcjowanie → kontynuuj analizę normalnie

  Jeśli LICZBA_PLIKOW 6–15 lub SUMA_KB 100–400:
    → STATUS: OSTRZEŻENIE → wykonaj PD1 (propozycja podziału)

  Jeśli LICZBA_PLIKOW ≥ 16 lub SUMA_KB > 400:
    → STATUS: WYMAGANE → ⛔ HARD GATE → wykonaj PD1 obowiązkowo

  Jeśli LICZBA_PLIKOW ≥ 30 lub SUMA_KB > 800:
    → STATUS: KRYTYCZNE → max 3–4 pliki per partia → wykonaj PD1

KROK PD0.4 — Wyświetl raport PD0:
  ┌────────────────────────────────────────────────────────────────┐
  │ RAPORT WSTĘPNY MATERIAŁU                                       │
  │ Pliki: [n] | Rozmiar: [X] KB | Szacunek: ~[Y] tokenów         │
  │ Status: [BEZPIECZNY / OSTRZEŻENIE / WYMAGANE / KRYTYCZNE]      │
  └────────────────────────────────────────────────────────────────┘
  Jeśli STATUS ≠ BEZPIECZNY → wyświetl raport PD0 PRZED analizą.
  Jeśli BEZPIECZNY → nie wyświetlaj raportu, kontynuuj cicho.
```

---

## PD1 — PODZIAŁ NA PARTIE

```
KROK PD1.1 — Ustal rozmiar partii (BATCH_SIZE):
  KRYTYCZNE:   BATCH_SIZE = 3–4 pliki lub ≤ 60 KB per partia
  WYMAGANE:    BATCH_SIZE = 5–8 pliki lub ≤ 150 KB per partia
  OSTRZEŻENIE: BATCH_SIZE = 8–12 pliki lub ≤ 250 KB per partia

KROK PD1.2 — Posortuj pliki według priorytetu analizy:
  PRIORYTET NAJWYŻSZY (analizuj w P1):
    - Umowy i dokumenty założycielskie stosunku prawnego
    - Protokoły sądowe / postanowienia / wyroki
    - Pisma procesowe stron
  PRIORYTET ŚREDNI (P2):
    - Korespondencja e-mail / SMS / komunikatory
    - Pisma przedprocesowe
    - Zeznania / oświadczenia
  PRIORYTET NIŻSZY (P3+):
    - Tabele i arkusze operacyjne (XLS, CSV)
    - Zrzuty ekranów
    - Inne załączniki wspierające

  Pliki wielofunkcyjne (potencjalnie pokrywające wiele tez) → do P1.

KROK PD1.3 — Zdefiniuj partie:
  P1: [lista plików] | [KB łącznie] | Cel: [tezy/aspekty główne]
  P2: [lista plików] | [KB łącznie] | Cel: [tezy/aspekty uzupełniające]
  P3: [lista plików] | [KB łącznie] | Cel: [aspekty poboczne / weryfikacja]
  ...

KROK PD1.4 — Wyświetl PLAN PORCJOWANIA użytkownikowi:
  (format: PD2 — RAPORT PLANU poniżej)
  → STOP — czekaj na potwierdzenie lub modyfikację planu
  → Użytkownik może: zatwierdzić / zmienić kolejność / przenieść plik między partiami
```

---

## PD2 — RAPORT PLANU (wyświetl użytkownikowi przed rozpoczęciem)

```
════════════════════════════════════════════════════════════════════
PLAN PORCJOWANIA MATERIAŁU DOWODOWEGO
Sprawa: [sygnatura / nazwa] | Data: [data]
════════════════════════════════════════════════════════════════════

MATERIAŁ: [n] plików, ~[X] KB łącznie
STATUS: [WYMAGANE / KRYTYCZNE] — analiza wielopartyjniowa

PLAN PODZIAŁU:
  PARTIA 1 (bieżąca sesja / ta wiadomość):
    → [plik1.pdf] ([X] KB) — [typ / opis]
    → [plik2.docx] ([X] KB) — [typ / opis]
    ...
    Cel: [tezy które ta partia ma pokryć]

  PARTIA 2 (następna wiadomość po otrzymaniu checkpointu):
    → [plik3.xlsx] ([X] KB) — [typ / opis]
    ...
    Cel: [tezy uzupełniające]

  PARTIA [n] (finalna):
    → [plik_n.jpg] ([X] KB) — [typ / opis]
    ...
    Cel: [weryfikacja / aspekty poboczne]

PROTOKÓŁ:
  Po zakończeniu każdej partii → generuję CHECKPOINT (plik .md)
  Na początku kolejnej wiadomości → wgraj CHECKPOINT lub wklej jego treść
  System wznowi analizę dokładnie od miejsca zakończenia partii

PYTANIE: Czy zatwierdzasz ten plan, czy chcesz coś zmienić?
  [TAK / Zmień kolejność: ... / Przenieś [plik] do partii [n]]
════════════════════════════════════════════════════════════════════
```

---

## PD3 — ANALIZA PARTII (wykonuj dla każdej Pi)

```
KROK PD3.1 — Nagłówek partii (wyświetl na początku analizy każdej partii):
  ┌──────────────────────────────────────────────────────────────┐
  │ PARTIA [i] z [n] — [nazwa / opis]                           │
  │ Pliki: [lista] | Pozostałe partie: [n-i]                    │
  │ Tezy do pokrycia w tej partii: [T1, T2, ...]                │
  └──────────────────────────────────────────────────────────────┘

KROK PD3.2 — Wykonaj analizę plików z bieżącej partii:
  Użyj właściwego narzędzia per typ pliku:
    PDF tekstowy    → pdftotext | pdfplumber
    PDF skan        → pdftoppm + view (obraz)
    DOCX/ODT        → extract-text
    XLSX/CSV        → python3 openpyxl/csv
    JPG/PNG         → view (obraz bezpośredni)
  
  Dla każdego pliku wykonaj analizę zgodnie z aktywnym skillem:
    analizator-dowodow-v3 → kroki MD1/MD2/MD3 per dokument
    pisma-procesowe-v3    → ekstrakcja faktów do W1.3
    MOD-MACIERZ-DOWOD-TEZA → skan D×T dla plików tej partii

KROK PD3.3 — Akumuluj wyniki w strukturze stanu partii:
  STAN_PARTII = {
    partia_nr: [i],
    pliki_przeanalizowane: [lista z DOC-ID],
    tezy_pokryte: { T1: [●●●/●●/●], T2: [...], ... },
    dowody_wstepne: [ { doc_id, kategoria, opis, tezy: [...] } ],
    luki_wykryte: [ { teza, przesłanka, opis } ],
    fakty_kluczowe: [ { fakt, źródło, doc_id } ],
    ostrzezenia: [ { kod, opis, doc_id } ],
    nierozstrzygniete: [ { kwestia, wymaga_partii: [n] } ]
  }

KROK PD3.4 — Raport końcowy partii (wyświetl po zakończeniu analizy):
  ┌──────────────────────────────────────────────────────────────┐
  │ ✅ PARTIA [i]/[n] ZAKOŃCZONA                                 │
  │ Przeanalizowane: [lista plików]                              │
  │ Tezy częściowo pokryte: [T1 ●●, T3 ●, ...]                  │
  │ Nowe fakty kluczowe: [n]                                     │
  │ Luki wykryte: [n] ⬛                                         │
  │ Ostrzeżenia: [n] ⚠️                                          │
  └──────────────────────────────────────────────────────────────┘
  → Generuję CHECKPOINT — pobierz go i wgraj / wklej w kolejnej wiadomości
```

---

## PD4 — GENEROWANIE CHECKPOINTU

```
⛔ OBOWIĄZKOWO po każdej partii (z wyjątkiem ostatniej) — generuj checkpoint.

FORMAT CHECKPOINTU (plik: checkpoint-P[i]-[sprawa].md):

---
# CHECKPOINT ANALIZY — PARTIA [i]/[n]
Sprawa: [sygnatura]
Data/czas: [timestamp]
Wygenerowano przez: MOD-PORCJOWANIE-DOWODOW v1.0.0

## STATUS OGÓLNY
Ukończone partie: P1 [... Pi]
Następna partia: P[i+1]
Pliki do analizy w P[i+1]: [lista]

## TEZY I POKRYCIE (stan na koniec P[i])
T1: [treść] | Pokrycie: [%] | Dowody: [DOC-ID, waga]
T2: [treść] | Pokrycie: [%] | Dowody: [DOC-ID, waga]
...

## DOWODY PRZEANALIZOWANE
| DOC-ID | Nazwa | Kategoria | Tezy | Kluczowy element |
|--------|-------|-----------|------|-----------------|
| D01    | [...]  | A         | T1●●●, T2● | [opis] |
...

## FAKTY KLUCZOWE USTALONE
1. [fakt] — źródło: [DOC-ID], str./data: [...]
2. [fakt] — źródło: [DOC-ID], str./data: [...]
...

## LUKI DOWODOWE (wymagają P[i+1]+)
⬛ T[n]/P[przesłanka]: [opis luki] — szukaj w: [plik z P[i+1]]
⬛ T[n]/P[przesłanka]: [opis luki] — szukaj w: [plik z P[i+1]]

## OSTRZEŻENIA PRZENIESIONE
⚠️ [kod] [DOC-ID]: [opis]

## KWESTIE NIEROZSTRZYGNIĘTE
→ [kwestia] — wymaga danych z: [plik z P[i+1]]

## INSTRUKCJA WZNAWIANIA
Wgraj ten plik lub wklej jego treść na początku kolejnej wiadomości.
Napisz: "Kontynuuj analizę — partia [i+1]" + wgraj pliki z P[i+1].
System automatycznie wczyta stan i wznowi od P[i+1].
---

KROK PD4.1 — Wypełnij checkpoint danymi z STAN_PARTII (PD3.3).
KROK PD4.2 — Zapisz jako plik przez bash_tool / create_file:
  Ścieżka: /mnt/user-data/outputs/checkpoint-P[i]-[sygnatura].md
KROK PD4.3 — present_files checkpoint.
KROK PD4.4 — Wyświetl instrukcję:
  "📋 Checkpoint P[i] gotowy. W następnej wiadomości:
   1. Wgraj plik checkpoint-P[i]-[...].md
   2. Wgraj pliki z PARTII [i+1]: [lista plików]
   3. Napisz: 'Kontynuuj analizę'"
```

---

## PD5 — WZNAWIANIE Z CHECKPOINTU

```
TRIGGER WZNAWIANIA — wykryj że użytkownik:
  - wgrał plik zaczynający się od "# CHECKPOINT ANALIZY"
  - wkleil blok z nagłówkiem "# CHECKPOINT ANALIZY"
  - napisał "kontynuuj analizę" + wgrał pliki nowej partii
  - napisał "partia [n]" lub "wznów od P[n]"

KROK PD5.1 — Parsuj checkpoint:
  Wczytaj sekcje: STATUS OGÓLNY, TEZY I POKRYCIE, DOWODY PRZEANALIZOWANE,
  FAKTY KLUCZOWE, LUKI, OSTRZEŻENIA, KWESTIE NIEROZSTRZYGNIĘTE.

KROK PD5.2 — Zbuduj stan startowy:
  Odtwórz STAN_PARTII z danych checkpointu.
  Zidentyfikuj pliki nowej partii (wgrane przez użytkownika).
  Weryfikuj: czy pliki z listy "następna partia" w checkpoincie są dostępne?
    BRAK pliku → ⚠️ informuj użytkownika, kontynuuj bez brakującego.

KROK PD5.3 — Potwierdź wznowienie:
  "✅ Wczytuję checkpoint P[i]. Wznawiam analizę od PARTII [i+1].
  Pliki tej partii: [lista]
  Stan z poprzedniej partii: [n] dowodów, [n] faktów, [n] luk.
  Przechodzę do analizy..."

KROK PD5.4 — Wykonaj PD3 dla nowej partii.
```

---

## PD6 — SYNTEZA FINALNA (po ostatniej partii)

```
Gdy ukończono ostatnią partię (Pi = Pn):

KROK PD6.1 — Scal wyniki wszystkich partii:
  WYNIKI_FINALNE = merge(STAN_P1, STAN_P2, ..., STAN_Pn)
  Deduplikuj: ten sam fakt z wielu partii → jeden wpis z wieloma źródłami.
  Scalaj pokrycie tez: dla każdej Tj — suma dowodów ze wszystkich partii.
  Scalaj luki: luka z P1 może być zamknięta przez dowód z P2.

KROK PD6.2 — Weryfikacja zamknięcia luk:
  Dla każdej ⬛ LUKI z wcześniejszych checkpointów:
    Czy dowód z późniejszej partii ją pokrywa? → LUKA ZAMKNIĘTA / LUKA OTWARTA

KROK PD6.3 — Generuj wynik zgodnie z aktywnym skillem:
  analizator-dowodow-v3 → dashboard / MD-NARR (pełny, z danych wszystkich partii)
  pisma-procesowe-v3    → zasilona W1.3 (mapa przesłanka→dowód, kompletna)
  MOD-MACIERZ-DOWOD-TEZA → pełna macierz D×T (wszystkie Di × wszystkie Tj)

KROK PD6.4 — Raport finalny:
  ┌──────────────────────────────────────────────────────────────────┐
  │ ✅ ANALIZA KOMPLETNA — [n] partii ukończonych                   │
  │ Dowodów przeanalizowanych: [m] | Faktów kluczowych: [k]         │
  │ Tezy w pełni pokryte: [x]/[n_tez] ✅                           │
  │ Luki zamknięte w kolejnych partiach: [y]                        │
  │ Luki pozostające otwarte: [z] ⬛                                │
  └──────────────────────────────────────────────────────────────────┘
```

---

## INTEGRACJA Z PIPELINE — punkty wejścia

### prawny-router-v3: KROK 0C (nowy)

```
KROK 0C — [PORCJOWANIE] — po KROK 0B, przed KROK 1:
  Wykryj czy użytkownik wgrał pliki / wymienił dokumenty do analizy.
  Jeśli TAK → wykonaj PD0 (skan wstępny):
    STATUS BEZPIECZNY  → pomiń, kontynuuj do KROK 1
    STATUS ≥ OSTRZEŻENIE → wykonaj PD1 → PD2 → STOP (czekaj na zatwierdzenie planu)
    STATUS KRYTYCZNE   → ⛔ HARD GATE → PD1 → PD2 → STOP (plan obowiązkowy)
  Jeśli NIE (brak plików, tylko opis słowny) → pomiń, kontynuuj do KROK 1.

  Trigger wznawiania (PD5):
  Jeśli użytkownik wgrał plik "# CHECKPOINT ANALIZY..." → PD5 (wznów).
```

### analizator-dowodow-v3: między BLOK B a KROK 1

```
Po BLOK B (diagnoza wejścia), PRZED MD1-ekstrakcją:
  Wykonaj PD0 dla wszystkich wgranych plików.
  STATUS BEZPIECZNY  → kontynuuj MD1 normalnie.
  STATUS ≥ OSTRZEŻENIE → PD1 → PD2 → STOP.
  STATUS KRYTYCZNE   → ⛔ HARD GATE → PD1 → PD2 → STOP.
  
  W każdej partii: MD1/MD2/MD3 wykonaj per plik z bieżącej partii Pi.
  Wyniki MD1/MD2 per plik → akumuluj w STAN_PARTII (PD3.3).
```

### pisma-procesowe-v3: W1.2c (przed MOD-MACIERZ-DOWOD-TEZA)

```
W W1.2c, przed uruchomieniem MOD-MACIERZ-DOWOD-TEZA:
  Wykonaj PD0 dla wszystkich wgranych materiałów dowodowych.
  STATUS BEZPIECZNY → kontynuuj MOD-MACIERZ-DOWOD-TEZA normalnie.
  STATUS ≥ OSTRZEŻENIE → PD1 (podział materiału) → PD2 (plan) → STOP.
  Po P1: macierz częściowa (Di z P1 × wszystkie Tj) → checkpoint.
  Po Pn: macierz pełna → PD6 → zasilenie W1.3.
```

---

## REGUŁY SPECJALNE

```
REGUŁA-ZIP: Jeśli użytkownik wgrywa plik ZIP:
  → Przed PD0 rozpakuj ZIP (bash: unzip -l) → zinwentaryzuj zawartość.
  → Dopiero po inwentaryzacji zawartości ZIP → wykonaj PD0.
  → ZIP ≠ 1 plik — liczy się zawartość, nie kontener.

REGUŁA-OBRAZ: Skany i zdjęcia (JPG/PNG bez tekstu):
  → Koszt stały ≈ 1600 tokenów/obraz niezależnie od rozmiaru.
  → Grupuj obrazy po max 5 per partia (≈ 8000 tokenów).
  → Obrazy z tekstem do OCR → wyższy koszt → max 3 per partia.

REGUŁA-XLSX: Arkusze z wieloma zakładkami:
  → Każda zakładka = osobny "dokument" do celów porcjowania.
  → Zinwentaryzuj: lista_zakładek, rozmiar per zakładka.
  → Podziel między partie per zakładkę jeśli WYMAGANE/KRYTYCZNE.

REGUŁA-PRIORYTET-TEZ: Jeśli znane są tezy sprawy przed podziałem:
  → W PD1.2 przypisz każdy plik do tezy której dotyczy.
  → Pliki dla tej samej tezy → do tej samej partii (gdy to możliwe).
  → Unikaj rozbijania powiązanych dowodów między partie.

REGUŁA-SZYBKA-PARTIA: Jeśli materiał jednorodny (np. 20 arkuszy XLS tej samej struktury):
  → Można przetwarzać 2–3 na raz w tej samej iteracji bash_tool.
  → Nie wymaga osobnej wiadomości per plik — tylko per partię tokenową.

REGUŁA-MINIMUM-PARTII: Nie dziel jeśli możesz uniknąć:
  → Jeśli OSTRZEŻENIE ale materiał to 1 duży PDF i 2 małe → spróbuj jednorazowo.
  → Porcjowanie = koszt (dodatkowe wiadomości, checkpoint) — stosuj gdy konieczne.
```

---

## SELF-CHECK MODUŁU

```
□ PD0 wykonany przed analizą materiału (gdy ≥2 pliki)?
□ Status obliczony z LICZBA_PLIKOW i SUMA_KB?
□ STATUS BEZPIECZNY → analiza jednorazowa (bez raportu PD0)?
□ STATUS ≥ OSTRZEŻENIE → raport PD0 wyświetlony użytkownikowi?
□ STATUS ≥ WYMAGANE → plan PD1/PD2 wyświetlony i zatwierdzony przed analizą?
□ STATUS KRYTYCZNE → ⛔ HARD GATE → nie zaczęto analizy bez zatwierdzonego planu?
□ Po każdej partii (z wyjątkiem ostatniej): checkpoint wygenerowany i present_files?
□ Instrukcja wznawiania wyświetlona po każdym checkpoincie?
□ Przy wznawianiu (PD5): checkpoint sparsowany, stan odtworzony?
□ Po ostatniej partii: PD6 synteza finalna wykonana?
□ Luki z wcześniejszych checkpointów: weryfikacja zamknięcia w PD6?
Którykolwiek = NIE → wróć do brakującego kroku.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-21) — Pierwsza wersja.
Przyczyna: brak jakiegokolwiek mechanizmu zarządzania oknem kontekstowym
wewnątrz sesji przy dużych zbiorach dowodów. Model mógł rozpocząć analizę
dużego materiału (np. ZIP z 35 plikami) i urwać bez ostrzeżenia gdy kontekst
się wypełnił — tracąc wszystkie wyniki częściowej analizy.
Istniejący MOD-KONTEKST-SESJI działa między sesjami (export/import stanu),
nie wewnątrz sesji. Ten moduł wypełnia tę lukę przez profilaktyczne
szacowanie rozmiaru materiału przed analizą i podział na partie z protokołem
checkpointów i wznawiania.
Przykład triggera: ZIP z 35 plikami (9.5 MB) — sesja VII P 94/25 —
model przeanalizował go bez podziału, ryzykując utratę wyników.
Przy STATUS KRYTYCZNE (≥30 plików) moduł wymusiłby podział na ~9 partii
po 4 pliki, z 8 checkpointami między partiami.
```
