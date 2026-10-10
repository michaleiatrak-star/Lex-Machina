# Narzędzia deweloperskie audytu — ci_check_shared.py

Powstałe w ramach audytu gotowości komercyjnej silnika, punkt 2. Kod, nie
markdown — działa niezależnie od tego, czy model w danej sesji zastosował
się do bramek opisanych w SKILL.md.

## ci_check_shared.py — regresja strukturalna

Skanuje cały `` i wykrywa:
1. **Zerwane odwołania** `view()` / `required_modules` na nieistniejące
   pliki — BŁĄD, blokuje commit.
2. **Duplikaty bajtowe** (MD5) między różnymi lokalizacjami — OSTRZEŻENIE,
   nie blokuje, ale wymaga decyzji redakcyjnej.

```
python3 ci_check_shared.py --repo-root "$LEX_MACHINA_SKILLS_ROOT"
bash install_precommit_hook.sh "$LEX_MACHINA_SKILLS_ROOT"   # podpina jako git hook; istniejący hook tylko z --force (kopia .bak), --test uruchamia
```

Pierwsze uruchomienie na produkcyjnym stanie silnika (2026-07-12): 0 zerwanych
odwołań, 4 nieudokumentowane duplikaty bajtowe wykryte automatycznie.
Wszystkie 4 scalone tego samego dnia (patrz `shared/DEPENDENCY-GRAPH.md`,
sekcja "Moduły scalone do shared/ 2026-07-12", oraz
`audyt-systemu-v4/references/CHECKLIST-DEDUP.md` NOTA-12/13/14).

**Czego NIE robi:** nie sprawdza poprawności merytorycznej treści, tylko
strukturalną integralność systemu plików. To pierwsza linia obrony przed
regresją typu "edycja shared/X.md cicho psuje 31 zależnych skilli" —
nie zastępuje przeglądu treści.

## audit_amendment_scope.py — propagacja per nowelizacja

Odtwarza pełną sekwencję numerowanych dyspozycji z urzędowego tekstu
nowelizacji, wyodrębnia jednostki aktu bazowego i mierzy ich wystąpienia
w całym korpusie. Nie zakłada ścieżki konkretnego hosta ani dostawcy modelu.

```bash
python3 audit_amendment_scope.py NOWELIZACJA.txt "$LEX_MACHINA_SKILLS_ROOT" \
  --act-label "KK — Dz.U. 2022 poz. 2600" --to-directive 116
```

Wynik jest inwentarzem do kontroli merytorycznej, nie automatycznym
potwierdzeniem poprawności przepisów.

## Gdzie jest walidator cytowań?

`walidator_cytowan.py` (audyt komercyjny, punkt 1) **nie mieszka tutaj**.
To bramka produkcyjna dla wygenerowanych pism (uruchamiana przez portal
przed `present_files`), nie narzędzie audytu systemu skilli — więc
zgodnie z tą samą logiką klasyfikacji, jaką ten skill stosuje do reszty
systemu, mieszka w `shared/tools/` — obok modułów, z
których faktycznie korzysta pipeline produkcyjny (`shared/HYBRID-VALIDATION.md`
i inne), nie w audycie deweloperskim. Patrz `shared/tools/README.md`.


## test_f108_consistency.py — T19 F-108

Deterministyczny guard bieżącego benchmarku 52 aktów. Chroni rozdzielenie
`routing != COV != FULL`, końcowy wynik 52/52 COV przy 0 FULL, obecność
current-state modułów domykających F-108 oraz zestaw krytycznych korekt metryk
Dz.U. z audytu 2026-08-28. Jest uruchamiany przez
`run_regression_suite.py` (z `--repo-root`) i jego FAIL jest blockerem strukturalnym.
Wiersze Dz.U. sprawdza w najnowszej `references/mapa_dzu_RRRR-MM-DD.md` (od 2026-10-10).

## _lex_common.py — wspólne narzędzia (import, nie test)

Graf odwołań T43/T44 (`RefGraph`, indeks odwrotny nazwa pliku -> źródła) i inwentarz
modułów T1/T2/T13 (`module_files`: `modules/**`, także bez prefiksu `mod-`). Od 2026-10-10.

## check_sieroty.py — T43 sieroty (pliki bez ścieżki wywołania)

Dodany 2026-10-04b (AUDYT-2026-10-04b, F-225). Dla każdego pliku każdego skilla
szuka odwołania z pliku, który nie jest zapisem historycznym. Nazwy nieunikalne
w systemie wymagają ścieżki rozstrzygającej — skan po samej nazwie był ślepy na
pary typu `prawny-router-v3/references/HYBRID-VALIDATION.md` / `shared/HYBRID-VALIDATION.md`.

```
python3 check_sieroty.py --repo-root "$LEX_MACHINA_SKILLS_ROOT"
```

FAIL = plik do powiązania (żywa treść) albo do usunięcia z wpisem w CHANGELOG
(relikt wskrzeszony nakładką, duplikat). Allowlista z uzasadnieniem — w skrypcie.

## check_osiagalnosc_shared.py — T44 osiągalność `shared`

Dodany 2026-10-04d. Graf odwołań od SKILL.md skilli produkcyjnych (bez audytu i rejestrów);
każdy plik `shared` musi być osiągalny. Uzupełnia T43: T43 łapie plik bez żadnego odwołania,
T44 — plik wymieniony wyłącznie w rejestrze.

```
python3 check_osiagalnosc_shared.py --repo-root "$LEX_MACHINA_SKILLS_ROOT"
```

## check_mapy_aktow.py — T45 mapy aktów czytelne maszynowo

Dodany 2026-10-04e (F-229). Mapy aktów są czytane nie tylko przez model, ale i przez aplikacje
parsujące Markdown — tabela bez nagłówka albo wiersz z nadmiarową komórką „gubi” moduł.

```
python3 check_mapy_aktow.py --repo-root "$LEX_MACHINA_SKILLS_ROOT"
```

## build_ramie_kontrolne.py, ocena_transkryptow_f113.py — odmowy i selftest

```
python3 build_ramie_kontrolne.py --selftest        # out==src, out w src, src w out, /, $HOME, --force bez znacznika
python3 ocena_transkryptow_f113.py --selftest      # brak katalogu, mapowanie.json, X###.txt, resztki tmp, --dry-run
python3 ocena_transkryptow_f113.py anonimizuj katalog/ --dry-run
```
