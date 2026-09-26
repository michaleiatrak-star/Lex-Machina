# CBOSA-ADAPTER — implementacja w orzeczenia-sadowe-v2

> **Wersja:** 1.2 (2026-09-14)
> **Kanoniczny kontrakt:** `shared/CBOSA-ADAPTER.md`
> **Implementacja parsera:** `tools/cbosa_parser.py`
> **Testy:** `tests/test_cbosa_parser.py`

Ten plik NIE duplikuje już kontraktu HTTP ani reguł statusów. Przed użyciem:

```
view shared/CBOSA-ADAPTER.md
```

Następnie, jeżeli host udostępnia wykonanie kodu, użyj
`tools/cbosa_parser.py` jako implementacji referencyjnej. Parser realizuje:
- deduplikację `/doc/{ID}`,
- kontrolę licznika i kompletności paginacji,
- exact-match sygnatury,
- odrzucanie near-match,
- kontrolę integralności transportu,
- fail-closed dla driftu HTML,
- `reasoning_available` dla zakresu uzasadnienia.

Regresje 2026-09-14: **22/22 PASS**.

Jeżeli host nie ma wykonania kodu, wykonaj równoważną procedurę natywnymi
narzędziami zgodnie z `shared/CBOSA-ADAPTER.md`. Brak parsera nie zwalnia z
fail-closed ani z `shared/PRAWO-HARDGATE-ORZECZENIA.md`.
