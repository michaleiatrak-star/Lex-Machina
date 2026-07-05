# Moduł [BC] — DSAR / Żądania podmiotów danych (art. 12, 15–22 RODO)

> **Dodano:** 2026-07-05 (AUDYT-2026-07-05a) — wypełnienie luki operacyjnej RODO.
> **Wzorzec:** rodo-dsar-pl (bundle ochrona-danych, awesome-matematic-skills-pl).
> **Charakter:** moduł OPERACYJNY — obsługa żądania od wpływu do draftu odpowiedzi,
> z deterministycznym liczeniem terminu. Komplementarny do mod-RODO-szczegolowy
> (katalog praw) — tu: procedura i zegar, nie wykład prawa.

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/PRAWO-HARDGATE.md` (RODO → EUR-Lex/CELLAR: CELEX 32016R0679);
- terminy licz wg sekcji "ZEGAR" poniżej + metodologia `shared/TERM-CALC.md`;
- moduł składa DRAFT odpowiedzi i rejestr — decyzję o realizacji/odmowie, usunięcie/eksport
  danych i wysyłkę wykonuje administrator (akty nieodwracalne = zawsze człowiek).
---

**Zakres:** klasyfikacja żądania (art. 15–22), weryfikacja tożsamości (art. 12 ust. 6), termin miesięczny i przedłużenie (art. 12 ust. 3), bramki odmowy (art. 12 ust. 5, art. 17 ust. 3), draft odpowiedzi, rejestr żądań.

## ZASADY ABSOLUTNE

1. Żądanie podmiotu = ZEGAR + ocena prawna. Najpierw data wpływu i deadline, potem merytoryka.
2. Weryfikacja tożsamości (art. 12 ust. 6) tylko przy UZASADNIONYCH wątpliwościach — zawiesza bieg do potwierdzenia, ale nie służy do obstrukcji.
3. Co do zasady BEZPŁATNIE (art. 12 ust. 5); opłata/odmowa wyłącznie przy żądaniu ewidentnie bezzasadnym lub nadmiernym — ciężar dowodu po administratorze.
4. Każda odmowa: uzasadnienie prawne + pouczenie o skardze do UODO i drodze sądowej (art. 12 ust. 4).
5. Odpowiedź językiem prostym i przejrzystym (art. 12 ust. 1).

## ⏱️ ZEGAR — DETERMINISTYCZNE LICZENIE TERMINU (art. 12 ust. 3)

> Terminu miesięcznego NIE licz "w pamięci" — arytmetyka miesiąca ma pułapki.
> Reguła rozporządzenia (EWG, Euratom) nr 1182/71, art. 3 ust. 2 lit. c:
> termin w miesiącach kończy się w ostatnim miesiącu w dniu o TEJ SAMEJ liczbie
> co dzień startu; jeśli taki dzień nie istnieje — w OSTATNIM dniu tego miesiąca.

```
deadline_1m  = data_wpływu + 1 miesiąc  (wg reguły wyżej)
   wpływ 31.01 → deadline 28.02 (29.02 w roku przestępnym)
   wpływ 15.03 → deadline 15.04
deadline_3m  = data_wpływu + 3 miesiące (przedłużenie: +2 miesiące, art. 12 ust. 3)

⛔ WARUNEK PRZEDŁUŻENIA: o przedłużeniu i jego PRZYCZYNACH poinformuj osobę
   W CIĄGU PIERWSZEGO miesiąca (przed deadline_1m). Po deadline_1m przedłużenie
   nie jest już dostępne.

Do odpowiedzi i rejestru wpisuj obie daty w ISO (YYYY-MM-DD).
Ostatni dzień wolny od pracy → weryfikuj wg shared/TERM-CALC.md (art. 3 ust. 4
rozp. 1182/71: upływ następnego dnia roboczego).
```

## KROK 1 — KLASYFIKACJA ŻĄDANIA

| Art. | Prawo | Klucz kontrolny |
|---|---|---|
| 15 | Dostęp + kopia | zakres informacji art. 15 ust. 1–2; kopia nie może naruszać praw osób trzecich (ust. 4) |
| 16 | Sprostowanie | dane nieprawidłowe / niekompletne |
| 17 | Usunięcie ("bycie zapomnianym") | przesłanki ust. 1 vs WYJĄTKI ust. 3 (obowiązek prawny, roszczenia, wolność wypowiedzi, archiwum/badania) |
| 18 | Ograniczenie | "zamrożenie" zamiast usunięcia — sprawdź przesłanki ust. 1 lit. a–d |
| 20 | Przenoszenie | TYLKO podstawa zgoda/umowa + przetwarzanie zautomatyzowane; format ustrukturyzowany, powszechny, maszynowy |
| 21 | Sprzeciw | wobec uzasadnionego interesu → test ważnych prawnie uzasadnionych podstaw; wobec MARKETINGU → bezwzględny, bez testu |
| 22 | Decyzje zautomatyzowane | prawo do interwencji człowieka, wyrażenia stanowiska, zakwestionowania |

Jedno pismo może zawierać KILKA żądań — klasyfikuj i terminuj każde osobno w rejestrze, odpowiadaj łącznie.

## KROK 2 — BRAMKI I PODSTAWY ODMOWY

```
□ art. 12 ust. 5 — ewidentnie bezzasadne / nadmierne (zwł. ustawiczny charakter)?
  → opłata rozsądna ALBO odmowa; udokumentuj ocenę (ciężar dowodu!)
□ wyjątki specyficzne dla prawa (zwł. art. 17 ust. 3, art. 20 ust. 4, art. 15 ust. 4)
□ ograniczenia krajowe (art. 23 RODO + przepisy sektorowe — weryfikuj ISAP/ELI)
□ dane osób trzecich w kopii → pseudonimizacja / redakcja przed wydaniem
```

## KROK 3 — DRAFT ODPOWIEDZI + REJESTR ŻĄDAŃ

Draft: potwierdzenie wpływu, rozstrzygnięcie per żądanie, działania podjęte / przyczyny odmowy, pouczenia (art. 12 ust. 4). Rejestr (dowód rozliczalności, art. 5 ust. 2): data wpływu, kanał, typ żądania, tożsamość zweryfikowana (T/N), deadline_1m / deadline_3m, rozstrzygnięcie, data odpowiedzi.

## WALIDACJA

```text
□ data wpływu ustalona; deadline_1m (i ew. deadline_3m) policzone wg reguły 1182/71
□ tożsamość: zweryfikowana / niebudząca wątpliwości / żądanie uzupełnienia wysłane
□ każde żądanie z pisma sklasyfikowane (art. 15–22) osobno
□ bramki odmowy sprawdzone; odmowa → uzasadnienie + pouczenie art. 12 ust. 4
□ przedłużenie → informacja z przyczyną wysłana PRZED deadline_1m
□ dane osób trzecich w kopii zredagowane
□ wpis do rejestru żądań kompletny
□ usunięcie / eksport / wysyłka — pozostawione decyzji człowieka (nie wykonuj)
```

## POWIĄZANIA

| Zagadnienie | Moduł |
|---|---|
| Katalog praw i roszczenie art. 82 | `mod-RODO-szczegolowy.md` |
| Skarga osoby do UODO (druga strona lustra) | `mod-UODO-postepowanie-ochrona-danych.md` |
| Skąd wiadomo, gdzie są dane (RCP) | `mod-RODO-RCP-DPA-rejestr-powierzenie.md` |
| Anonimizacja kopii dokumentów | KROK 0A routera (anonimizer) |
