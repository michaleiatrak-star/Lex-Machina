# Moduł [BB] — DPIA / Ocena skutków dla ochrony danych (art. 35–36 RODO)

> **Dodano:** 2026-07-05 (AUDYT-2026-07-05a) — wypełnienie luki operacyjnej RODO.
> **Wzorzec:** rodo-dpia-pl (bundle ochrona-danych, awesome-matematic-skills-pl).
> **Charakter:** moduł OPERACYJNY (proces + draft), komplementarny do merytorycznych
> mod-RODO-GDPR-2016-679 i mod-RODO-szczegolowy — nie duplikuje ich treści.

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/PRAWO-HARDGATE.md` (RODO → EUR-Lex/CELLAR:
  CELEX 32016R0679; wykaz operacji UODO → uodo.gov.pl; ustawa o ochronie danych → ISAP/ELI);
- ślad weryfikacji wg `shared/WERYFIKACJA-SLAD.md` (gradient: parafraza wytycznych EROD = poziom TREŚĆ);
- moduł składa DRAFT — decyzja administratora i wniosek do UODO należą do człowieka.
---

**Zakres:** czy DPIA (OSOD) jest wymagana, struktura oceny wg art. 35 ust. 7, uprzednie konsultacje z Prezesem UODO (art. 36), rejestr decyzji DPIA. Relacja do FRIA z AI Act → `mod-AI-Act-framework.md`.

## ZASADY ABSOLUTNE

1. DPIA to proces zarządzania ryzykiem dla praw i wolności OSÓB, nie formularz do odhaczenia i nie ocena ryzyka biznesowego administratora.
2. Wynik przesiewu progu podawaj deterministycznie: `WYMAGANA / ZALECANA / NIEWYMAGANA` + uzasadnienie per kryterium. Zakaz "raczej tak".
3. Ryzyko szczątkowe WYSOKIE mimo środków = OBOWIĄZEK uprzednich konsultacji z UODO PRZED rozpoczęciem przetwarzania (art. 36 ust. 1).
4. System AI wysokiego ryzyka: DPIA (RODO) i FRIA (art. 27 AI Act) NIE zastępują się wzajemnie — sprawdź kumulację obowiązków.

## KROK 1 — PRÓG: CZY DPIA JEST WYMAGANA (art. 35 ust. 1, 3, 4)

Trzy ścieżki — wystarczy jedna pozytywna:

```
Ś-1 WYKAZ UODO (art. 35 ust. 4): sprawdź AKTUALNY komunikat Prezesa UODO
    z wykazem operacji zawsze wymagających DPIA (web_fetch: uodo.gov.pl —
    wykaz był zmieniany; nie cytuj pozycji wykazu z pamięci).
    Operacja na wykazie → WYMAGANA.

Ś-2 KRYTERIA EROD (WP248 rev.01) — reguła: ≥2 kryteria → WYMAGANA, 1 → ZALECANA:
    □ 1. ocena / scoring (w tym profilowanie)
    □ 2. automatyczne decyzje z istotnym skutkiem (art. 22)
    □ 3. systematyczny monitoring
    □ 4. dane szczególne (art. 9) / wysoce osobiste / karne (art. 10)
    □ 5. duża skala
    □ 6. łączenie / zestawianie zbiorów
    □ 7. osoby wymagające szczególnej opieki (dzieci, pracownicy, pacjenci)
    □ 8. nowe technologie (AI, IoT, biometria)
    □ 9. przetwarzanie uniemożliwia realizację prawa / usługi / umowy

Ś-3 PRZYPADKI OBLIGATORYJNE (art. 35 ust. 3):
    a) systematyczna, kompleksowa ocena czynników osobowych (profilowanie)
       jako podstawa decyzji o istotnym skutku,
    b) dane szczególne / karne na dużą skalę,
    c) systematyczny monitoring miejsc publicznych na dużą skalę.
```

## KROK 2 — STRUKTURA OSOD (minimum z art. 35 ust. 7)

Draft musi zawierać CZTERY filary — brak filaru = draft niekompletny (oznacz lukę, nie zgaduj):

| Filar | Treść |
|---|---|
| a) Opis | systematyczny opis operacji i celów (+ prawnie uzasadniony interes, jeśli podstawą art. 6 ust. 1 lit. f) |
| b) Niezbędność i proporcjonalność | minimalizacja, podstawa prawna, ograniczenie celu, retencja, prawa osób, transfery |
| c) Ocena ryzyka | dla praw i wolności osób: scenariusze poufność / integralność / dostępność; prawdopodobieństwo × waga |
| d) Środki | techniczne i organizacyjne + RYZYKO SZCZĄTKOWE po ich zastosowaniu |

Dodatkowo udokumentuj: opinię IOD (art. 35 ust. 2), konsultację z osobami, których dane dotyczą — gdy stosowne (art. 35 ust. 9), oraz przegląd okresowy (art. 35 ust. 11 — DPIA to dokument żywy).

## KROK 3 — UPRZEDNIE KONSULTACJE (art. 36)

```
Ryzyko szczątkowe (filar d) = WYSOKIE?
  TAK → ⛔ NIE ROZPOCZYNAJ przetwarzania. Przygotuj draft wystąpienia do
        Prezesa UODO (zakres informacji: art. 36 ust. 3 lit. a–f).
        Wniosek SKŁADA administrator — nie moduł.
  NIE → udokumentuj decyzję administratora o akceptacji ryzyka + datę przeglądu.
```

## WALIDACJA

```text
□ przesiew progu wykonany (Ś-1 wykaz UODO zweryfikowany online, Ś-2 policzone kryteria, Ś-3)
□ wynik deterministyczny: WYMAGANA / ZALECANA / NIEWYMAGANA + uzasadnienie
□ 4 filary art. 35 ust. 7 obecne albo luki jawnie oznaczone
□ opinia IOD odnotowana (lub odnotowany brak IOD)
□ ryzyko szczątkowe ocenione; WYSOKIE → ścieżka art. 36 uruchomiona
□ kumulacja z FRIA (AI Act) sprawdzona dla systemów AI
□ decyzja i data przeglądu wpisane do rejestru decyzji DPIA
```

## POWIĄZANIA

| Zagadnienie | Moduł |
|---|---|
| Materialne RODO, kary, odszkodowanie art. 82 | `mod-RODO-szczegolowy.md` |
| Postępowanie przed UODO | `mod-UODO-postepowanie-ochrona-danych.md` |
| Rejestr czynności (skąd lista operacji do przesiewu) | `mod-RODO-RCP-DPA-rejestr-powierzenie.md` |
| FRIA / AI wysokiego ryzyka | `mod-AI-Act-framework.md` |
