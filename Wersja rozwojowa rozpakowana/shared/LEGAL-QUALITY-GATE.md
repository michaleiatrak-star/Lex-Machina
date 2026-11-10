# LEGAL-QUALITY-GATE — bramka jakości prawa

Stan: 2026-11-08. Kryteria wspólne dla każdej jurysdykcji; nazwy krajowe: `JUR:stan-prawny`.

## Bramka przed oddaniem analizy/pisma

Pismo albo analiza nie spełnia standardu kancelaryjnego, jeżeli:

- zawiera podstawę prawną bez sprawdzenia w oficjalnym źródle aktów,
- używa starej wersji skonsolidowanej mimo istnienia nowszej,
- nie rozróżnia wersji skonsolidowanej i aktu zmieniającego,
- pomija przepisy przejściowe,
- miesza stan prawny z różnych dat,
- cytuje orzecznictwo bez źródła oficjalnego,
- nie oznacza ryzyka dezaktualizacji (`JUR:ryzyko-dezaktualizacji`),
- zapisuje powołania aktów niezgodnie z `JUR:format-cytowania` (reguły F1–F9 jurysdykcji).

## Wynik bramki

- `PASS` — można użyć.
- `PASS-WITH-WARNING` — można użyć, ale wskazać ryzyko.
- `FAIL` — nie wolno oddać jako gotowego pisma.

## Standard minimalny dla modułów `.md`

Każdy moduł prawny musi zawierać:

1. zakres modułu,
2. oficjalne źródła aktów,
3. status aktualności,
4. procedurę weryfikacji,
5. workflow merytoryczny,
6. checklistę dowodową,
7. typowe rozstrzygnięcia,
8. ryzyka procesowe,
9. odwołania do `shared`.
