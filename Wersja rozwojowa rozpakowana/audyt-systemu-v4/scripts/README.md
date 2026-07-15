# Narzędzia deweloperskie audytu — ci_check_shared.py

Powstałe w ramach audytu gotowości komercyjnej silnika, punkt 2. Kod, nie
markdown — działa niezależnie od tego, czy model w danej sesji zastosował
się do bramek opisanych w SKILL.md.

## ci_check_shared.py — regresja strukturalna

Skanuje cały `/mnt/skills/user/` i wykrywa:
1. **Zerwane odwołania** `view()` / `required_modules` na nieistniejące
   pliki — BŁĄD, blokuje commit.
2. **Duplikaty bajtowe** (MD5) między różnymi lokalizacjami — OSTRZEŻENIE,
   nie blokuje, ale wymaga decyzji redakcyjnej.

```
python3 ci_check_shared.py --repo-root /mnt/skills/user
bash install_precommit_hook.sh /mnt/skills/user   # podpina jako git hook
```

Pierwsze uruchomienie na produkcyjnym stanie silnika (2026-07-12): 0 zerwanych
odwołań, 4 nieudokumentowane duplikaty bajtowe wykryte automatycznie.
Wszystkie 4 scalone tego samego dnia (patrz `shared/DEPENDENCY-GRAPH.md`,
sekcja "Moduły scalone do shared/ 2026-07-12", oraz
`shared/CHECKLIST-DEDUP.md` NOTA-12/13/14).

**Czego NIE robi:** nie sprawdza poprawności merytorycznej treści, tylko
strukturalną integralność systemu plików. To pierwsza linia obrony przed
regresją typu "edycja shared/X.md cicho psuje 31 zależnych skilli" —
nie zastępuje przeglądu treści.

## Gdzie jest walidator cytowań?

`walidator_cytowan.py` (audyt komercyjny, punkt 1) **nie mieszka tutaj**.
To bramka produkcyjna dla wygenerowanych pism (uruchamiana przez portal
przed `present_files`), nie narzędzie audytu systemu skilli — więc
zgodnie z tą samą logiką klasyfikacji, jaką ten skill stosuje do reszty
systemu, mieszka w `/mnt/skills/user/shared/tools/` — obok modułów, z
których faktycznie korzysta pipeline produkcyjny (`shared/HYBRID-VALIDATION.md`
i inne), nie w audycie deweloperskim. Patrz `shared/tools/README.md`.
