# Wyniki benchmarku ChatGPT — 2026-09-15

> **Pochodzenie wyników:** testy wykonane w **ChatGPT** na modelu **GPT-5.6 Sol**.
> Porównano cztery konfiguracje: Medium bez skilli, High bez skilli,
> Medium ze skillami oraz High ze skillami.
>
> Ocena 0–10 mierzy **zgodność odpowiedzi z autorskim kluczem kazusów**.
> Klucz jest jedynym wzorcem benchmarku; nie był podważany ani zastępowany niezależną oceną prawa.

Bank obejmuje 14 kazusów: K-01–K-07 oraz PL-01–PL-07.

## Macierz wyników

| Kazus | Medium bez skilli | High bez skilli | Medium + skille | High + skille |
|---|---:|---:|---:|---:|
| K-01 | **9,0** | **9,3** | **9,2** | **9,1** |
| K-02 | 8,8 | 9,1 | **9,2** | **9,3** |
| K-03 | 8,6 | 9,0 | **9,1** | **9,3** |
| K-04 | 8,8 | 9,2 | **9,2** | **9,4** |
| K-05 | 8,5 | 8,9 | **9,2** | **9,1** |
| K-06 | 8,8 | 9,2 | **9,2** | **9,3** |
| K-07 | 8,7 | 9,1 | **9,3** | **9,2** |
| PL-01 | 8,8 | 9,2 | **9,5** | 9,4 |
| PL-02 | 8,7 | 9,1 | **9,4** | 9,3 |
| PL-03 | 8,8 | 9,2 | **9,5** | 9,3 |
| PL-04 | 8,9 | 9,3 | **9,5** | 9,4 |
| PL-05 | 8,8 | 9,2 | **9,5** | 9,4 |
| PL-06 | 8,7 | 9,1 | **9,5** | 9,4 |
| PL-07 | 8,8 | 9,3 | **9,5** | 9,4 |
| **Średnia 14 kazusów** | **8,76** | **9,16** | **9,34** | **9,31** |

## Średnie według części

| Konfiguracja ChatGPT | K-01–K-07 | PL-01–PL-07 | Łącznie |
|---|---:|---:|---:|
| GPT-5.6 Sol Medium bez skilli | 8,74 | 8,79 | **8,76** |
| GPT-5.6 Sol High bez skilli | 9,11 | 9,20 | **9,16** |
| GPT-5.6 Sol Medium ze skillami | 9,20 | **9,49** | **9,34** |
| GPT-5.6 Sol High ze skillami | **9,24** | 9,37 | **9,31** |

## Ranking

1. **GPT-5.6 Sol Medium ze skillami — 9,34/10**
2. **GPT-5.6 Sol High ze skillami — 9,31/10**
3. **GPT-5.6 Sol High bez skilli — 9,16/10**
4. **GPT-5.6 Sol Medium bez skilli — 8,76/10**

## Interpretacja

Najwyższą zgodność z kluczem uzyskał przebieg **Medium ze skillami**.
Przewaga nad High ze skillami jest minimalna (0,03 pkt) i nie oznacza przewagi
ogólnej zdolności modelu. W tej konkretnej metryce Medium + skille częściej
pozostawał ściśle przy osiach rubryki, podczas gdy High częściej rozwijał kwestie
dodatkowe, które nie dawały punktów za zgodność z kluczem.

Wynik High bez skilli jest już bardzo wysoki (9,16), co wskazuje, że przy wysokim
poziomie reasoning model sam rekonstruuje dużą część metodologii wymaganej przez
klucz. Skille mają wtedy przede wszystkim funkcję kontroli kompletności i routingu.

Największą korzyść ze skilli widać w części polskiej przy Medium: wzrost z 8,79 do
9,49. Kazusy PL częściej wymagają równoległego prowadzenia kilku reżimów i dokładnego
przypisania ich do osobnych przesłanek, środków i ról podmiotowych.

## Zastrzeżenie metodologiczne

Są to **wyniki testów przeprowadzonych w ChatGPT**, a ocena została wykonana względem
autorskiego klucza dostarczonego razem z bankiem kazusów. Benchmark nie ustala
„obiektywnej poprawności prawa” niezależnie od klucza. Mierzy zgodność odpowiedzi
ChatGPT z tym kluczem i jego rubrykami.
