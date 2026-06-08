---
name: przesluchanie-swiadkow-v2-min90
version: 2.90
type: legal-skill
domain: litigation-witness-examination
status: production-candidate
default_mode: text
graphic_mode: on_request_only
performance_profile: fast_text_first
compatibility:
  - Claude Skills
  - Modular Legal Skills
entrypoint: SKILL.md
ui:
  default: text
  jsx: assets/witness_examination_step_lazy.jsx
  render_policy: explicit_request_only
dependencies:
  required:
    - shared
    - analizator-dowodow
  optional:
    - chronologia-sprawy
    - analiza-sadowa
    - raport-sytuacyjny
validation:
  required_gates:
    - QUESTION-ADMISSIBILITY-GATE
    - WITNESS-SCORING
    - FACT-EVIDENCE-MAPPING
    - CROSS-EXAMINATION-GATE
    - TEXT-FIRST-UI-GATE
typologies:
  witnesses: typologies/witnesses/witness-types.yaml
  judges: typologies/judges/judge-types.yaml
  matrix: typologies/matrices/witness-judge-matrix.md
---

# Przesłuchanie świadków v2-min90

## Cel

Moduł służy do przygotowania przesłuchania świadków, kontrprzesłuchania, oceny wartości dowodowej zeznań oraz dopasowania strategii do typu świadka i typu sędziego.

## Zasada nadrzędna

Domyślnym trybem jest **szybki tryb tekstowy**.

Tryb graficzny/JSX wolno uruchomić wyłącznie na wyraźne żądanie użytkownika.

## Kiedy używać

Użyj tego skilla, gdy użytkownik chce:

- przygotować pytania do świadka,
- przygotować kontrprzesłuchanie,
- ocenić wiarygodność świadka,
- dobrać strategię do typu świadka,
- dobrać styl pytań do typu sędziego,
- wykryć sprzeczności w zeznaniach,
- opracować impeachment/cross-examination,
- zbudować mapę: pytanie → cel → fakt → dowód kontrolny → ryzyko.

## Tryb tekstowy — domyślny

Odpowiedź powinna zawierać:

1. cel przesłuchania,
2. tezę dowodową,
3. typ świadka,
4. prawdopodobny typ sędziego albo założenie neutralne,
5. strategię pytania,
6. pytania główne,
7. pytania kontrolne,
8. pytania na sprzeczności,
9. pytania ryzykowne/niedopuszczalne,
10. macierz pytanie → cel → fakt → dowód → ryzyko,
11. scoring świadka 0–10,
12. rekomendacje.

## Tryb graficzny — tylko na żądanie

Tryb JSX może zostać użyty tylko przy jednoznacznych triggerach:

- „pokaż graficznie”,
- „widok graficzny”,
- „dashboard”,
- „panel JSX”,
- „wizualizacja”,
- „diagram”.

W razie wątpliwości zawsze wybierz tryb tekstowy.

## Zakaz

Nie wolno domyślnie:

- tworzyć artefaktu graficznego,
- renderować panelu bocznego,
- importować brakujących komponentów,
- generować JSX bez danych wejściowych,
- pomijać analizy tekstowej.

## Typologie

Moduł zawiera biblioteki:

- typów świadków,
- typów sędziów,
- macierzy świadek × sędzia.

## Bramka pytań

Każde pytanie musi mieć:

- cel procesowy,
- związek z tezą dowodową,
- kategorię dopuszczalności,
- przewidywany efekt odpowiedzi,
- ryzyko,
- dowód kontrolny albo wskazanie braku dowodu kontrolnego.

## Scoring świadka 0–10

Skala:

- 0–3: świadek słaby,
- 4–6: świadek umiarkowany,
- 7–8: świadek istotny,
- 9–10: świadek kluczowy.

Kryteria:

- bezpośredniość wiedzy,
- interes w wyniku sprawy,
- spójność z dokumentami,
- odporność na kontrpytania,
- znaczenie dla ciężaru dowodu,
- stabilność relacji.
