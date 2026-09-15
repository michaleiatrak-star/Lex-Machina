# Wpływ skilli — testy ChatGPT 2026-09-15

> Wszystkie wyniki w tym pliku pochodzą z testów wykonanych w **ChatGPT**
> na modelu **GPT-5.6 Sol**.

## Wynik główny

| Poziom reasoning | Bez skilli | Ze skillami | Delta |
|---|---:|---:|---:|
| Medium | 8,76 | **9,34** | **+0,58** |
| High | 9,16 | **9,31** | **+0,15** |

Skille poprawiły wynik na obu poziomach reasoning, ale efekt był wyraźnie większy
dla Medium.

## Część międzynarodowa i polska

| Poziom | K bez → ze skillami | Delta K | PL bez → ze skillami | Delta PL |
|---|---:|---:|---:|---:|
| Medium | 8,74 → 9,20 | **+0,46** | 8,79 → 9,49 | **+0,70** |
| High | 9,11 → 9,24 | **+0,13** | 9,20 → 9,37 | **+0,17** |

Największa poprawa wystąpiła w polskich kazusach przy Medium.

## Co dawały skille

W tej serii testów skille poprawiały przede wszystkim **architekturę odpowiedzi**,
a nie tylko liczbę przywołanych przepisów:

1. routing do właściwych reżimów prawa;
2. pełniejszy issue spotting;
3. rozdzielenie reżimów i kompetencji;
4. przypisanie faktów do przesłanek;
5. jawny kontrargument strony przeciwnej;
6. rozdzielenie braków dowodowych od wniosków;
7. dobór środka ochrony i skutku proceduralnego.

To dokładnie odpowiada konstrukcji autorskiego klucza.

## Dlaczego wzrost przy High jest mały

GPT-5.6 Sol High bez skilli osiągnął już 9,16/10. Przy tym poziomie reasoning model
sam odtwarzał dużą część zachowań narzucanych przez system skillowy. Dlatego pełny
routing poprawił wynik tylko o 0,15 pkt.

Przy Medium różnica wyniosła 0,58 pkt. Skille działały więc jako silniejsza
proteza metodologiczna: stabilizowały kolejność analizy, wymuszały kompletność osi
i ograniczały pomijanie reżimów pomocniczych.

## Efekt uboczny: over-solving

High ze skillami nie wygrał całego porównania mimo większej głębokości analizy.
W części kazusów rozbudowywał kwestie wykraczające poza rdzeń klucza. W benchmarku,
który mierzy zgodność z rubryką autora, dodatkowa poprawna analiza nie daje premii,
jeżeli przesuwa środek ciężkości poza klucz.

Najlepszy wynik uzyskał zatem **Medium + skille (9,34)**, minimalnie przed
**High + skille (9,31)**.

## Wniosek

Dla GPT-5.6 Sol skille mają największą wartość przy Medium i w kazusach
wieloreżimowych, szczególnie polskich. Przy High są przede wszystkim warstwą
kontroli jakości i kompletności.

Wniosek dotyczy wyłącznie tej serii **testów w ChatGPT** i tego konkretnego banku
kazusów oraz autorskiego klucza.
