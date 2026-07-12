# QUALITY-CHECK — kontrola jakości pisma i analizy

## 1. Kontrola redakcyjna

Usuń albo popraw:

- powtórzenia,
- emocjonalność bez znaczenia prawnego,
- ogólniki,
- zarzuty bez dowodu,
- cytaty bez źródła,
- chaotyczną chronologię,
- mieszanie faktów z oceną,
- zbyt wiele równorzędnych argumentów,
- wnioski bez podstawy.

## 2. Kontrola logiczna

Sprawdź:

- czy każdy fakt prowadzi do przesłanki prawnej,
- czy każdy dowód ma tezę dowodową,
- czy żądanie wynika z uzasadnienia,
- czy zarzuty są uporządkowane od najsilniejszego,
- czy argument przeciwnika został uprzedzony,
- czy pismo da się streścić w trzech zdaniach.

## 3. Decyzja jakościowa

```text
QUALITY-CHECK
Czy pismo jest procesowe, a nie publicystyczne: TAK / NIE
Czy struktura jest logiczna: TAK / NIE
Czy usunięto nadmiar: TAK / NIE
Czy sąd szybko zobaczy element decydujący: TAK / NIE
Wymagane poprawki: ...
```

## 4. Metryka długości (MOD-KONCENTRACJA)

Po kontroli redakcyjnej i logicznej — zawsze uruchom:

```
view /mnt/skills/user/shared/MOD-KONCENTRACJA.md
```

Moduł ocenia czy pismo mieści się w limicie orientacyjnym per typ
(pozew ≤8–14 str., riposta ≤5 str., apelacja ≤10 str.) i generuje
RAPORT MOD-KONCENTRACJA z rekomendacjami skrócenia gdy WARN/ALERT.

## 5. Executive summary (MOD-INTRO)

Sprawdź czy pismo zawiera executive summary (str. 1):

```
Czy pismo ma executive summary (2–5 zdań przed petitum)?
  NIE i typ pisma wymaga (pozew / apelacja / pismo >3 str.):
    → view /mnt/skills/user/shared/MOD-INTRO.md
    → Wygeneruj executive summary i wstaw przed petitum
  TAK → sprawdź czy spełnia wymogi z MOD-INTRO §3 (max 150 słów,
        max 2 przepisy, brak emocji)
```
