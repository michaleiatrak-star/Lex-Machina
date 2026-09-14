# CBOSA-ADAPTER — dostęp do orzeczeń NSA/WSA

> **Wersja:** 1.0 (2026-09-14)
> **Zakres:** `orzeczenia-sadowe-v2`
> **Źródło pierwotne:** `https://orzeczenia.nsa.gov.pl` (CBOSA)
> **Implementacja parsera:** `tools/cbosa_parser.py`

## 1. Cel i zasada fail-closed

Adapter zamyka lukę między formularzem HTML CBOSA a kontraktem
`FOUND / NOT_FOUND / AMBIGUOUS / OUT_OF_SCOPE` bez zgadywania sygnatury.

CBOSA nie musi wystawiać REST/JSON API, aby nadawała się do deterministycznego
odczytu. Wystarczający jest kontrakt HTML:

```text
POST /cbo/search          → pierwsza strona wyników + cookies sesji
GET  /cbo/find?p=N        → kolejne strony tej samej sesji
GET  /doc/{DOC_ID}        → metryka + sentencja + pełne uzasadnienie
```

⛔ Jeżeli host nie pozwala wykonać żądania, HTML zmienił strukturę, wynik wymaga
paginacji, której nie pobrano, albo nie udało się odczytać wszystkich kandydatów,
wynik = `OUT_OF_SCOPE`. Nie wolno zamieniać awarii adaptera na `NOT_FOUND`.

## 2. Fresh probe przed użyciem

Stan dostępności CBOSA jest środowiskowy i zmienny. Dated measurement w `shared/`
nie zastępuje próby w bieżącej sesji.

1. Spróbuj `GET /cbo/query` albo od razu kontrolowanego `POST /cbo/search`.
2. Jeśli źródło odpowiada poprawnym HTML-em CBOSA → użyj adaptera poniżej.
3. Jeśli kanał kodu/web jest niedostępny → wróć do kanonicznego
   `shared/SYGNATURY.md`, V-SYG-0.5 (kanał zdegradowany przez indeks).

Nie wyłączaj automatycznie weryfikacji TLS. Problem z łańcuchem certyfikatu w
konkretnym runtime = ograniczenie środowiska, nie zgoda na globalne `verify=False`.

## 3. Dokładny request formularza po sygnaturze

**Metoda:** `POST`

**URL:**

```text
https://orzeczenia.nsa.gov.pl/cbo/search
```

**Content-Type:**

```text
application/x-www-form-urlencoded
```

**Pola zweryfikowane przez niezależne implementacje live:**

```text
wszystkieSlowa=
wystepowanie=gdziekolwiek
odmiana=on
sygnatura=II FSK 2870/18
sad=dowolny
rodzaj=dowolny
symbole=
odDaty=
doDaty=
sedziowie=
funkcja=
submit=Szukaj
```

`odDaty` / `doDaty` są nazwami rzeczywistymi. Nie używaj zgadywanych
`dataOd` / `dataDo`. Wartości selecta `sad` są tekstowe (`dowolny` albo pełna
nazwa sądu), nie indeksowe typu `0`.

Przykład:

```bash
curl -i 'https://orzeczenia.nsa.gov.pl/cbo/search' \
  -A 'Mozilla/5.0' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
  -H 'Accept-Language: pl-PL,pl;q=0.9,en;q=0.5' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -c cookies.txt \
  --data-urlencode 'wszystkieSlowa=' \
  --data-urlencode 'wystepowanie=gdziekolwiek' \
  --data-urlencode 'odmiana=on' \
  --data-urlencode 'sygnatura=II FSK 2870/18' \
  --data-urlencode 'sad=dowolny' \
  --data-urlencode 'rodzaj=dowolny' \
  --data-urlencode 'symbole=' \
  --data-urlencode 'odDaty=' \
  --data-urlencode 'doDaty=' \
  --data-urlencode 'sedziowie=' \
  --data-urlencode 'funkcja=' \
  --data-urlencode 'submit=Szukaj'
```

Nagłówki są strategią runtime, nie częścią normatywnego kontraktu CBOSA. Jeżeli
konkretny host ma własny sprawdzony reżim UA, stosuj jego świeży pomiar.

## 4. Cookies i paginacja

Pierwszy `POST /cbo/search` nie wymaga wcześniejszego cookie. Odpowiedź może
ustanowić sesję; zachowaj wszystkie pary `Set-Cookie` i odeślij je przy:

```text
GET /cbo/find?p=2
GET /cbo/find?p=3
...
```

CBOSA renderuje typowo 10 wyników na stronę. Parser odczytuje licznik
`Znaleziono N orzeczeń`. Jeżeli `N` jest większe niż liczba odczytanych unikalnych
`/doc/{ID}`, pojedyncza strona jest **niekompletna** i nie wolno nadać
`FOUND/NOT_FOUND/AMBIGUOUS` przed pobraniem pozostałych stron.

## 5. Pobranie dokumentu

Z listy wyników wyciągaj wyłącznie linki dokładnie w formacie:

```text
/doc/{DOC_ID}
```

gdzie `DOC_ID` ma 10 znaków alfanumerycznych. Następnie:

```text
GET https://orzeczenia.nsa.gov.pl/doc/{DOC_ID}
```

Parser `tools/cbosa_parser.py` odczytuje:

- sygnaturę,
- sąd,
- datę orzeczenia,
- sentencję,
- pełne uzasadnienie,
- trwały URL dokumentu.

## 6. Exact-match i status wyniku

Przed porównaniem normalizuj:

- wielkość liter,
- wielokrotne białe znaki,
- spacje wokół `/`,
- kropki w skrótach repertoriów.

⛔ Nie uzupełniaj brakującej izby, repertorium, numeru ani rocznika.
⛔ Nie wybieraj „najbliższej” sygnatury.

Po pobraniu **wszystkich** kandydatów filtruj cały zbiór:

```text
0 exact-match  → NOT_FOUND
1 exact-match  → FOUND
≥2 exact-match → AMBIGUOUS
```

Każdy odrzucony kandydat zapisuj jako `rejected_case_numbers`.

`OUT_OF_SCOPE` ma pierwszeństwo, gdy:

- request/fetch zawiódł,
- nie rozpoznano kontraktu HTML,
- nie pobrano całej paginacji,
- choć jednego kandydata nie dało się odczytać i przez to exact-match mógł zostać
  przeoczony.

## 7. Zakres potwierdzenia

`FOUND` po pełnym odczycie `/doc/{ID}` daje co najmniej
`ISTNIENIE+TREŚĆ`: metryka, sentencja i uzasadnienie zostały odczytane.

Poziom `FRAGMENT` nadaj dopiero po wskazaniu konkretnego fragmentu/pinpointu,
zgodnie z `shared/WERYFIKACJA-SLAD.md` i Zasadą 2B tego skilla.

## 8. Testy

Test lokalny parsera (`tests/test_cbosa_parser.py`) obejmuje:

1. deduplikację linków `/doc/{ID}`,
2. sygnaturę + sąd + datę + sentencję + pełne uzasadnienie,
3. `FOUND` z odrzuceniem bliskiej, lecz niezgodnej sygnatury,
4. `NOT_FOUND`, gdy pozostają wyłącznie wyniki niezgodne,
5. `AMBIGUOUS` przy dwóch exact-match,
6. `OUT_OF_SCOPE` przy niepełnej paginacji.

Dodatkowa kontrola zgodności struktury została wykonana na publicznym fixture
CBOSA `II FSK 2870/18` z projektu `matematicsolutions/mcp-nsa`: tytuł dokumentu,
pole `Sąd`, `Data orzeczenia`, `Sentencja`, `Uzasadnienie` i linki `/doc/{ID}`
mają strukturę oczekiwaną przez parser. Fixture zawiera uzasadnienie o długości
> 50 tys. znaków HTML, więc test kontraktu nie opiera się wyłącznie na krótkim
przykładzie.

## 9. Pochodzenie kontraktu

Kontrakt HTTP został niezależnie potwierdzony w publicznych implementacjach:

- `matematicsolutions/mcp-nsa` (MIT),
- `worldwidelaw/legal-sources`, źródło `PL/NSA-Tax`.

Kod `tools/cbosa_parser.py` jest implementacją własną Lex Machina; nie kopiuje
kodu tych projektów. Zewnętrzne implementacje służą jako niezależny dowód
kształtu requestu i fixture regresyjny.
