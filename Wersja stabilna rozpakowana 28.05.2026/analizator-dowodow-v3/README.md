# Analizator Dowodów Procesowych — pełny modularny zestaw

**Ścieżka produkcyjna:** `/mnt/skills/user/analizator-dowodow-v3/`  
**Wersja kodu:** 5.0.0 (fuzja v4+v4)

## Architektura

```
analizator-dowodow-v3/
├── SKILL.md              — główny router + FAZA MX (wykrywanie dziedzin)
├── modules/
│   ├── MX-dziedziny.md   — NOWY: wykrywanie 25 dziedzin prawa
│   ├── MD1–MD6           — Warstwa D: analiza dowodowa (scoring, walidacja, terminy)
│   └── MP0–MP13          — Warstwa P: analiza pism (ekstrakcja, śledcza, synteza)
├── assets/
│   ├── dashboard.html    — widget dashboardu (6 zakładek + sprzeczności)
│   ├── widget-kreator.html — kreator intake
│   └── AnalizaPism.jsx   — komponent React analizy pism
├── checklists/
│   ├── kontrola-jakosci.md
│   └── sprawa-pracownicza.md
└── templates/
    ├── matryca-dowodowa.md
    ├── pytania-do-swiadka.md
    └── raport-koncowy.md
```

## Kiedy używać

Skill jest punktem wejścia dla **całości** analizy materiału procesowego:
- dowody do oceny → Warstwa D
- pisma, narracja, profil podmiotów → Warstwa P
- złożona sprawa z oboma → Warstwa DP (pełna)
- wykrywanie dziedzin prawa → zawsze MX jako pierwszy krok
