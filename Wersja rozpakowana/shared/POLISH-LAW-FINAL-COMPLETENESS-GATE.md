# POLISH-LAW-FINAL-COMPLETENESS-GATE

Stan: 2026-05-28. Bramka końcowa kompletności prawa polskiego dla skills Claude.ai.

## Cel
Każdy moduł prawa polskiego ma działać jak moduły wzorcowe: prawo pracy i prawo karne. Oznacza to, że moduł nie może być tylko opisem aktu; musi prowadzić sprawę od intake do strategii procesowej.

## Minimalny standard modułu
Każdy moduł musi zawierać:

1. zakres spraw i akty prawne,
2. intake sprawy,
3. mapę proceduralną,
4. warunki skuteczności czynności,
5. matrycę dowodową,
6. typowe zarzuty i kontrzarzuty,
7. strategię organową/procesową,
8. ryzyka formalne, dowodowe, materialne i terminowe,
9. orzecznictwo jako kategoria do weryfikacji online,
10. kontrolę ISAP / LEX / Legalis,
11. kontrolę temporalną: stan prawny na datę zdarzenia i na datę czynności,
12. quality gate przed wygenerowaniem odpowiedzi lub pisma.

## Twarda zasada źródeł
Nie wolno cytować literalnego brzmienia przepisu z pamięci. Dla prawa polskiego obowiązuje kolejność:

1. ISAP / Dziennik Ustaw / Monitor Polski,
2. akty prawa miejscowego lub dzienniki urzędowe, jeżeli sprawa tego wymaga,
3. LEX / Legalis pomocniczo, gdy ISAP nie daje praktycznego dostępu albo potrzebna jest warstwa komentarzowa,
4. orzeczenia: SN, NSA, TK, WSA, SA/SO/SR — tylko po identyfikacji realnej sygnatury i źródła.

## Status kompletności
System może być traktowany jako kompletny funkcjonalnie, ale nie jako zamknięta baza prawa. Każdy moduł zawiera mechanizm aktualizacji i ma wymuszać weryfikację obowiązywania aktu na dzień użycia.
