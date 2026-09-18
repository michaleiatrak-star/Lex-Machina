# CBOSA-ADAPTER — kanoniczny kontrakt dostępu NSA/WSA

> **Plik:** `shared/CBOSA-ADAPTER.md`
> **Wersja:** 1.1 (2026-09-14) — rozdzielono DIRECT_LIVE od CRAWLED_OR_INDEXED; fallback snapshot ma host post-check, exact-match i jawny content_scope.
> **Status źródła:** CBOSA / `orzeczenia.nsa.gov.pl` = **RZĄD 2A**
> **Rola:** transport i walidacja; adapter nie ma własnego RZĘDU.

## Zasada

Dla NSA/WSA, po braku lub niepowodzeniu MCP, system ma spróbować direct CBOSA
**przed** ogólnym `web_search`. Dostępność jest cechą bieżącego runtime,
więc każdy przebieg zaczyna się od fresh-probe.

## Kontrakt HTTP

```text
POST /cbo/search
GET  /cbo/find?p=N      # kolejne strony tej samej sesji/cookies
GET  /doc/{DOC_ID}      # dokument
```

Formularz exact-case:

```text
wszystkieSlowa=
wystepowanie=gdziekolwiek
odmiana=on
sygnatura={SYGNATURA}
sad=dowolny
rodzaj=dowolny
symbole=
odDaty=
doDaty=
sedziowie=
funkcja=
submit=Szukaj
```

`Content-Type: application/x-www-form-urlencoded`.

## Kompletność wyszukiwania

1. Odczytaj licznik `Znaleziono N orzeczeń`.
2. Nierozpoznany licznik = `OUT_OF_SCOPE`.
3. Wyciągnij unikalne `/doc/{ID}`.
4. Jeśli liczba ID < N, pobieraj `/cbo/find?p=N` z tymi samymi cookies.
5. Brak nowych ID na kolejnej stronie, pętla paginacji, więcej ID niż licznik
   albo limit bezpieczeństwa = `OUT_OF_SCOPE`.
6. Dopiero kompletny zbiór kandydatów wolno klasyfikować.

## Dokument i integralność transportu

Dla każdego kandydata pobierz `/doc/{ID}`. Wymagane do uznania dokumentu:
- zamknięty BODY/HTML,
- sygnatura,
- sąd,
- data,
- sentencja.

Jeżeli transport jest oznaczony jako niepełny albo `Content-Length` nie zgadza
się z liczbą odebranych bajtów → `OUT_OF_SCOPE`.

Krytyczny drift HTML lub błąd odczytu choć jednego kandydata także daje
`OUT_OF_SCOPE`, bo exact-match mógł zostać przeoczony.

## Exact-match

Po normalizacji kosmetyki (case, spacje, kropki skrótów, spacje wokół `/`):
- 0 exact-match po kompletnym wyniku → `NOT_FOUND`
- 1 exact-match → `FOUND`
- >=2 exact-match → `AMBIGUOUS`

Nigdy nie podstawiaj „najbliższej” sygnatury.

## Zakres treści

`FOUND` nie oznacza automatycznie, że opublikowano uzasadnienie.

- metryka + sentencja: mogą być użyte po własnej weryfikacji/pinpoint;
- gdy uzasadnienie jest obecne i kompletne: `reasoning_available=true`;
- gdy kompletny dokument nie publikuje uzasadnienia:
  `reasoning_available=false` — zakaz przypisywania tezy z uzasadnienia;
- urwane/niezamknięte uzasadnienie = `OUT_OF_SCOPE`, nie
  `reasoning_available=false`.

Poziom FRAGMENT wymaga `shared/WERYFIKACJA-SLAD.md` i
`shared/PRAWO-HARDGATE-ORZECZENIA.md`.

## Provenance kanału

Adapter rozróżnia źródło treści od sposobu dostępu:

| access_mode | Znaczenie |
|---|---|
| `DIRECT_LIVE` | bieżący request do CBOSA/originu odpowiedział właściwym dokumentem |
| `CRAWLED_OR_INDEXED` | host retrieval przekazał kopię/snapshot oficjalnego URL; brak dowodu bieżącego połączenia z originem |
| `DIRECT_UNAVAILABLE` | 5xx / timeout / connection failure w bieżącym runtime |
| `POLICY_BLOCKED` | odmowa narzędzia/polityki; nie jest dowodem awarii CBOSA |

`access_mode` jest provenance, nie statusem weryfikacji z `WERYFIKACJA-SLAD.md`.

## Fallback retrieval/snapshot

Jeżeli direct CBOSA jest niedostępna → `shared/SYGNATURY.md` V-SYG-0.5.

Minimalna sekwencja:
1. discovery (natywny filtr domeny lub `site:`);
2. POST-CHECK HOSTA — exact hostname `orzeczenia.nsa.gov.pl`, HTTPS i `/doc/{ID}`;
3. exact-match sygnatury po normalizacji;
4. klasyfikacja faktycznie widocznej treści.

Dopuszczalne `content_scope`:
- `EXISTENCE_ONLY`;
- `METADATA_SENTENCE`;
- `METADATA_SENTENCE_REASONING_PARTIAL`;
- `METADATA_SENTENCE_REASONING_FULL`.

⛔ `site:` nie jest filtrem domenowym. Wynik spoza hosta kanonicznego odrzuć
przed odczytem; nie odpytuj automatycznie near-domain.

⛔ Snapshot może być bogatszy od snippetu — w pomiarze 10/10 badanych
oficjalnych snapshotów miało co najmniej metrykę + sentencję — ale nadal
pozostaje `CRAWLED_OR_INDEXED`. Sam fakt posiadania pełnego uzasadnienia
nie podnosi provenance do `DIRECT_LIVE` ani statusu do ✅ [VER].

⛔ Fallback nigdy nie produkuje `NOT_FOUND`. Brak wyniku w crawlerze/indexie
jest wyłącznie `OUT_OF_SCOPE`.
## Implementacja referencyjna

`orzeczenia-sadowe-v2/tools/cbosa_parser.py` implementuje ten kontrakt.
Jest to implementacja wykonawcza skilla, nie zależność `shared`.
Host bez tego parsera może wykonać równoważną procedurę natywnymi narzędziami.

Regresje implementacji referencyjnej 2026-09-14: **22/22 PASS**.
