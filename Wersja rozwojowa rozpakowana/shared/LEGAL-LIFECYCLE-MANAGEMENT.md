# LEGAL-LIFECYCLE-MANAGEMENT

Stan: 2026-11-08. Moduł wspólny dla wszystkich skilli prawniczych i każdej jurysdykcji. Pojęcia według
ontologii ELI; nazwy, źródła i statusy krajowe: `JUR:stan-prawny`.

## Cel

Zapobiega użyciu nieaktualnego przepisu przez wymuszenie kontroli cyklu życia aktu prawnego.

## Procedura obowiązkowa

Przed analizą prawną wykonaj:

1. Zidentyfikuj akt prawny.
2. Sprawdź metrykę w `JUR:legal-registry`.
3. Jeżeli sprawa wymaga cytatu albo precyzyjnej podstawy prawnej — sprawdź oficjalne źródło aktów (`JUR:hierarchia-zrodel`) online.
4. Ustal:
   - status aktu,
   - wersję skonsolidowaną (punkt w czasie),
   - akty zmieniające po tej wersji,
   - datę wejścia w życie,
   - przepisy przejściowe,
   - czy przepis obowiązywał w dacie zdarzenia.
5. Oznacz wynik w analizie:
   - `stan prawny na dzień ...`,
   - `źródło: [oficjalne źródło aktów]`,
   - `ryzyko dezaktualizacji: niskie/średnie/wysokie` według `JUR:ryzyko-dezaktualizacji`.

## Zakazy

- Nie wolno przywoływać metryki aktu (pozycji w dzienniku urzędowym) z pamięci.
- Nie wolno rekonstruować brzmienia przepisu na podstawie starszych modułów.
- Nie wolno poprawiać metryki aktem z nieoficjalnego bloga, komentarza albo komercyjnej bazy.
- Nie wolno ignorować aktów zmieniających po wersji skonsolidowanej.

## Format odpowiedzi po kontroli

```text
Stan prawny: [data]
Źródło: [oficjalne źródło aktów]
Akt: [tytuł]
Metryka: [zapis według JUR:format-cytowania]
Status: [statusy z JUR:stan-prawny]
Ryzyko dezaktualizacji: [poziom]
Zastrzeżenie: cytat przepisu wymaga bieżącego odczytu oficjalnego źródła, jeżeli nie został pobrany w tej samej sesji.
```
