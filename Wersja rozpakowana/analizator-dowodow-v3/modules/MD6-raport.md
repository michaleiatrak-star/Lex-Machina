# MD6 — RAPORT KOŃCOWY

```
RAPORT DOWODOWY — [opis sprawy]
Data: [data] · Analizator Dowodów v4
POZYCJA PROCESOWA: [SILNA / UMIARKOWANA / SŁABA / KRYTYCZNA]
Uzasadnienie: [2–3 zdania]

HIERARCHIA:
  A ([n]): [lista z score]  B ([n]): [lista]
  C ([n]): [lista]          D ([n]): [wymagają uzupełnienia]

WALIDACJA: Kryt.: [n] | Ostrzeg.: [n] | Do spr.: [n] | Konflikty: [n]
[lista alertów krytycznych i sprzeczności DO SPRAWDZENIA]

POKRYCIE: [%] pokrytych | Luki krytyczne: [n]

DOWODY DO PISMA (top 3):
  1. [dowód] — [X.X]/10 — [uzasadnienie priorytetu]

TERMINY: ⚠ [czynność]: [data] ZAWITY

SPRZECZNOŚCI (podsumowanie):
  Z prawem: [n] · Między dok.: [n] · Wątpliwości: [n]
  [lista tytułów sprzeczności ze statusem]

REKOMENDACJE:
  1. [działanie krytyczne]
  2. [działanie krytyczne]
```

---

## FAZA 2 — DASHBOARD GRAFICZNY (≥3 dowodów)

Po analizie modułowej uruchom dashboard:

```
view /mnt/skills/user/analizator-dowodow-v3/assets/dashboard.html
→ show_widget(widget_code=<treść>, title="analizator_dowodow_dashboard",
