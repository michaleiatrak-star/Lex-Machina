# LEGAL-LIFECYCLE-MANAGEMENT

Stan: 2026-05-28. Moduł wspólny dla wszystkich skilli prawniczych.

## Cel

Zapobiega użyciu nieaktualnego przepisu przez wymuszenie kontroli cyklu życia aktu prawnego.

## Procedura obowiązkowa

Przed analizą prawną wykonaj:

1. Zidentyfikuj akt prawny.
2. Sprawdź metrykę w `shared/LEGAL-REGISTRY.md`.
3. Jeżeli sprawa wymaga cytatu albo precyzyjnej podstawy prawnej — sprawdź ISAP online.
4. Ustal:
   - status aktu,
   - tekst jednolity,
   - nowelizacje po tekście jednolitym,
   - datę wejścia w życie,
   - przepisy przejściowe,
   - czy przepis obowiązywał w dacie zdarzenia.
5. Oznacz wynik w analizie:
   - `stan prawny na dzień ...`,
   - `źródło: ISAP`,
   - `ryzyko dezaktualizacji: niskie/średnie/wysokie`.

## Zakazy

- Nie wolno przywoływać Dz.U. z pamięci.
- Nie wolno rekonstruować brzmienia przepisu na podstawie starszych modułów.
- Nie wolno poprawiać metryki aktem z nieoficjalnego bloga, komentarza albo komercyjnej bazy.
- Nie wolno ignorować ustaw zmieniających po tekście jednolitym.

## Macierz ryzyka dezaktualizacji

| Ryzyko | Dziedziny |
|---|---|
| Bardzo wysokie | podatki, KAS, cudzoziemcy, energetyka, cyberbezpieczeństwo, środowisko, planowanie, zamówienia publiczne |
| Wysokie | karne, KPK, KSH, upadłość/restrukturyzacja, koszty sądowe |
| Średnie | KPC, KPA, prawo pracy, RODO, konsumenckie |
| Niższe | część prawa rzeczowego/spadkowego, ale tylko po kontroli KC |

## Format odpowiedzi po kontroli

```text
Stan prawny: [data]
Źródło: ISAP
Akt: [tytuł]
Metryka: [Dz.U.]
Status: [AKTUALNY-ISAP / PO-TJ-ZMIANY / WYMAGA-KONTROLI-ISAP]
Ryzyko dezaktualizacji: [poziom]
Zastrzeżenie: cytat przepisu wymaga bieżącego odczytu ISAP, jeżeli nie został pobrany w tej samej sesji.
```
