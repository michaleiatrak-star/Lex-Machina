# LEGAL-QUALITY-GATE — bramka jakości prawa

Stan: 2026-05-28.

## Bramka przed oddaniem analizy/pisma

Pismo albo analiza nie spełnia standardu kancelaryjnego, jeżeli:

- zawiera podstawę prawną bez sprawdzenia ISAP,
- używa starego Dz.U. mimo istnienia nowszego tekstu jednolitego,
- nie rozróżnia tekstu jednolitego i ustawy zmieniającej,
- pomija przepisy przejściowe,
- miesza stan prawny z różnych dat,
- cytuje orzecznictwo bez źródła oficjalnego,
- nie oznacza ryzyka dezaktualizacji,
- zapisuje powołania aktów niezgodnie z `shared/FORMAT-CYTOWANIA.md` (F1–F9: np. `Dz.U.`, brak „z … r.”,
  „t.j.”, `KPC`, `§1`, metryka ELI albo status konektora w treści).

## Wynik bramki

- `PASS` — można użyć.
- `PASS-WITH-WARNING` — można użyć, ale wskazać ryzyko.
- `FAIL` — nie wolno oddać jako gotowego pisma.

## Standard minimalny dla modułów `.md`

Każdy moduł prawny musi zawierać:

1. zakres modułu,
2. źródła ISAP,
3. status aktualności,
4. procedurę weryfikacji,
5. workflow merytoryczny,
6. checklistę dowodową,
7. typowe rozstrzygnięcia,
8. ryzyka procesowe,
9. odwołania do `shared`.
