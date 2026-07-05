# Moduł [BD] — RCP (art. 30 RODO) + umowa powierzenia DPA (art. 28 RODO)

> **Dodano:** 2026-07-05 (AUDYT-2026-07-05a) — wypełnienie luki operacyjnej RODO.
> **Wzorzec:** rodo-ropa-dpa-pl (bundle ochrona-danych, awesome-matematic-skills-pl).
> **Charakter:** moduł OPERACYJNY — walidacja kompletności rejestru i mechaniczna
> kontrola klauzul umowy powierzenia (checklist a–h). Redakcja/redline samej umowy →
> `analizator-umow-v1`.

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/PRAWO-HARDGATE.md` (RODO → EUR-Lex/CELLAR: CELEX 32016R0679);
- moduł WALIDUJE i wskazuje braki (brak pola = LUKA, nie zgadywanie treści);
- podpis umowy i zatwierdzenie rejestru = człowiek.
---

**Zakres:** rejestr czynności przetwarzania administratora (art. 30 ust. 1) i podmiotu przetwarzającego (art. 30 ust. 2), zwolnienie art. 30 ust. 5, obowiązkowe klauzule umowy powierzenia (art. 28 ust. 3 lit. a–h), podpowierzenie, transfery rozdz. V.

## ZASADY ABSOLUTNE

1. RCP to żywy dokument rozliczalności (art. 5 ust. 2, 24) — nie jednorazowy załącznik do wdrożenia.
2. Umowa powierzenia to LISTA OBOWIĄZKOWYCH KLAUZUL — kompletność sprawdza się mechanicznie wobec art. 28 ust. 3 lit. a–h, nie "na oko".
3. Zwolnienie z RCP (art. 30 ust. 5, <250 pracowników) interpretuj WĄSKO: nie działa, gdy przetwarzanie niesporadyczne, ryzykowne albo obejmuje dane szczególne/karne — w praktyce rzadko ma zastosowanie.
4. Wynik kontroli klauzul podawaj deterministycznie: `KOMPLETNA` / `BRAKI: [lit. …]` — nigdy "wygląda dobrze".

## CZĘŚĆ 1 — RCP: POLA OBOWIĄZKOWE

**Administrator (art. 30 ust. 1) — per czynność przetwarzania:**

```
□ nazwa i dane kontaktowe administratora / współadministratorów / przedstawiciela / IOD
□ cele przetwarzania
□ kategorie osób, których dane dotyczą
□ kategorie danych osobowych
□ kategorie odbiorców (w tym w państwach trzecich / org. międzynarodowych)
□ transfery do państw trzecich + dokumentacja zabezpieczeń (rozdz. V)
□ planowane terminy usunięcia poszczególnych kategorii danych (retencja)
□ ogólny opis środków technicznych i organizacyjnych (art. 32 ust. 1)
```

**Podmiot przetwarzający (art. 30 ust. 2)** — węższy zakres: kategorie przetwarzań w imieniu KAŻDEGO administratora, transfery + zabezpieczenia, opis środków.

Walidacja krzyżowa: czynność w RCP z kryterium wysokiego ryzyka → flaga "wymaga przesiewu DPIA" → `mod-RODO-DPIA-ocena-skutkow.md`.

## CZĘŚĆ 2 — DPA: KONTROLA KLAUZUL art. 28 ust. 3 (a–h)

Umowa MUSI stanowić, że podmiot przetwarzający:

| Lit. | Klauzula | Obecna? |
|---|---|---|
| a | przetwarza WYŁĄCZNIE na udokumentowane polecenie administratora (w tym transfery) | □ |
| b | zapewnia zobowiązanie do POUFNOŚCI osób upoważnionych | □ |
| c | stosuje środki BEZPIECZEŃSTWA wymagane art. 32 | □ |
| d | przestrzega warunków PODPOWIERZENIA (zgoda uprzednia szczegółowa/ogólna + te same obowiązki na subprocesora, art. 28 ust. 2 i 4) | □ |
| e | POMAGA administratorowi odpowiadać na żądania osób (prawa rozdz. III) | □ |
| f | POMAGA w obowiązkach art. 32–36 (bezpieczeństwo, naruszenia, DPIA, konsultacje) | □ |
| g | po zakończeniu usług USUWA lub ZWRACA dane (wybór administratora) + usuwa kopie | □ |
| h | udostępnia informacje niezbędne do wykazania zgodności + umożliwia AUDYTY i inspekcje | □ |

Plus elementy opisowe (art. 28 ust. 3 zd. 1): przedmiot, czas trwania, charakter i cel przetwarzania, rodzaj danych, kategorie osób, obowiązki i prawa administratora. Plus transfery: rozdz. V (decyzja adekwatności / SCC / BCR) — weryfikuj aktualne SCC na EUR-Lex, nie z pamięci.

```
WYNIK KONTROLI:
  wszystkie a–h + elementy opisowe → KOMPLETNA
  braki → BRAKI: [lista liter + elementów] = dokładny cel poprawek umowy
          → redakcja klauzul: analizator-umow-v1 (mod-J21)
```

## WALIDACJA

```text
□ rola podmiotu ustalona: administrator / współadministrator / procesor (od tego zależy ust. 1 vs 2)
□ RCP: wszystkie pola obowiązkowe obecne per czynność albo luki jawnie wypisane
□ zwolnienie art. 30 ust. 5 — jeśli powołane, zbadane wąsko i uzasadnione
□ DPA: checklist a–h wypełniony, wynik KOMPLETNA / BRAKI podany deterministycznie
□ podpowierzenie: łańcuch subprocesorów zidentyfikowany, zgody udokumentowane
□ transfery: podstawa z rozdz. V wskazana i zweryfikowana online
□ czynności wysokiego ryzyka oflagowane do przesiewu DPIA
□ podpis / zatwierdzenie — pozostawione człowiekowi
```

## POWIĄZANIA

| Zagadnienie | Moduł |
|---|---|
| Przesiew i przeprowadzenie DPIA | `mod-RODO-DPIA-ocena-skutkow.md` |
| Żądania osób (RCP = mapa "gdzie są dane") | `mod-RODO-DSAR-zadania-osob.md` |
| Materialne RODO, kary | `mod-RODO-szczegolowy.md` |
| Redakcja / redline umowy powierzenia | `analizator-umow-v1` → mod-J21 |
