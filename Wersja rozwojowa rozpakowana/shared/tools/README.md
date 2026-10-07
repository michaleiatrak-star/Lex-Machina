# shared/tools/ — narzędzia produkcyjne poza pipeline'em LLM

Ten katalog, w odróżnieniu od reszty `shared/` (markdown wczytywany przez
`view()` w trakcie sesji modelu), zawiera kod uruchamiany **przez portal**,
poza kontekstem rozmowy z modelem — jako bramka przed dopuszczeniem pisma
do `present_files`. Umieszczony w `shared/`, nie w `audyt-systemu-v4/`,
bo audytuje wygenerowane PISMO (produkt pracy), nie sam system skilli —
to ta sama logika klasyfikacji, jaką shared/DEDUPLICATION-POLICY.md
stosuje do modułów merytorycznych: rzeczy używane przez ≥2 skille
produkcyjne (tu: pisma-procesowe-v3 i pisma-proste-v2) należą do shared/.

## walidator_cytowan.py — deterministyczna weryfikacja cytowań (audyt komercyjny, punkt 1)

Sprawdza, czy każde powołanie (art., §, Dz.U., sygnatura orzeczenia) w
finalnym dokumencie ma odpowiadające zdarzenie weryfikacji na oficjalnym
źródle (isap.sejm.gov.pl, sn.pl, nsa.gov.pl, trybunal.gov.pl,
orzeczenia.ms.gov.pl) w logu sesji.

```
python3 walidator_cytowan.py --document pismo.docx --log sesja.json
python3 walidator_cytowan.py --self-test   # przypadki negatywne zgł. #89
```

Dopasowanie (od shared 3.99.19, zgł. #89): domena urzędowa = host z `urlparse` równy domenie
albo `*.domena`, tylko `https` (także w `result_urls`); zgodność = pełny identyfikator
(Dz.U.: rok + pozycja, także ELI `DU/RRRR/POZ` i `WDU…`; sygnatura: wszystkie człony;
artykuł: numer [+ §] [+ skrót kodeksu]), nie pojedynczy ciąg cyfr.

Przykład (żywy test, oba scenariusze):
```
python3 walidator_cytowan.py \
  --document przyklady/przyklad_pisma.md \
  --log przyklady/sesja_niepelna.json
# → FAIL, exit 1: sygnatura I CSK 4821/23 bez śladu weryfikacji

python3 walidator_cytowan.py \
  --document przyklady/przyklad_pisma.md \
  --log przyklady/sesja_pelna.json
# → OK, exit 0: wszystkie 4 powołania zweryfikowane
```

### Wymagany format logu (`sesja.json`)

```json
{
  "session_id": "...",
  "events": [
    {"tool": "web_fetch", "url": "https://isap.sejm.gov.pl/...", "query_context": "art. 211 kc"},
    {"tool": "web_search", "query": "wyrok SN I CSK 123/24", "result_urls": ["https://sn.pl/..."]}
  ]
}
```

### Integracja po stronie portalu — co realnie trzeba dobudować

Ten log **nie wymaga dostępu do wewnętrznej infrastruktury Anthropic**.
Jeśli portal woła Claude API bezpośrednio, każda odpowiedź API już zawiera
w `content[]` bloki `server_tool_use` (web_search/web_fetch) i
`web_search_tool_result`/`web_fetch_tool_result` — to jest gotowy,
ustrukturyzowany ślad tego, co faktycznie zweryfikowano w danej sesji.

**Aktualizacja 2026-07-13d — kroki 1 i 2 poniżej są teraz zaimplementowane
i przetestowane** (wcześniej ten README tylko je opisywał, bez kodu):

1. ✅ **`extract_api_verification_log.py`** — buduje `sesja.json` automatycznie
   z surowej konwersacji API (bloki `server_tool_use`/`*_tool_result`), zamiast
   wymagać ręcznego budowania tego pliku przez portal.
   ```
   python3 extract_api_verification_log.py --input konwersacja_api.json --out sesja.json
   ```
2. ✅ **`export_gate.py`** — łączy krok 1 z `walidator_cytowan.py` w jedno
   wywołanie, dokładnie w miejscu, gdzie ma stać bramka: tuż po
   HYBRID-VALIDATION (`shared/HYBRID-VALIDATION.md`, wywoływanej zawsze przed
   `.docx` wg UP-4) i przed dopuszczeniem do `present_files`/eksportu.
   ```
   python3 export_gate.py --document pismo.docx --api-conversation konwersacja_api.json
   ```
3. **Nadal wymaga developera:** samo *zapisywanie* pełnej konwersacji API
   (wszystkich wiadomości z blokami `content[]`) do pliku JSON w formacie
   oczekiwanym przez `extract_api_verification_log.py` — to zależy od tego,
   jak konkretnie portal woła API (SDK, biblioteka, framework), i **nie może
   być zrobione bez dostępu do kodu portalu**. Format wejściowy jest
   udokumentowany w nagłówku `extract_api_verification_log.py`.
4. Exit code 1 z `export_gate.py` → zablokuj eksport, pokaż listę
   niezweryfikowanych powołań prawnikowi do ręcznej decyzji (nie do
   automatycznego odrzucenia — model mógł np. poprawnie zacytować z
   materiałów dostarczonych przez klienta, które i tak wymagają ludzkiej
   weryfikacji).

### Status testów (2026-07-13d)

| Skrypt | Test | Wynik |
|---|---|---|
| `walidator_cytowan.py` | syntetyczny .md + .docx + 2 fixture'y `przyklady/` | ✅ wszystkie 4 przypadki poprawne |
| `walidator_cytowan.py` (3.99.20) | `test_walidator_cytowan.py`: podciąg domeny (`msn.pl`, `sn.pl.evil…`, ścieżka), http, liczba jako całość, pełny identyfikator, sygnatura różna literą izby, ID ISAP; `--self-test` | ✅ 7/7 + 14/14; fixture'y `przyklady/` bez zmiany wyniku |
| `extract_api_verification_log.py` | self-test: konwersacja z web_fetch + web_search + 1 wywołanie bez wyniku | ✅ 2/2 zdarzenia poprawnie wydobyte, wywołanie bez wyniku poprawnie pominięte |
| `export_gate.py` | self-test end-to-end: 2 powołania, 1 zweryfikowane w konwersacji, 1 nie | ✅ poprawna blokada (exit 1) ze wskazaniem dokładnego powołania; test ścieżki pozytywnej (wszystko zweryfikowane, exit 0) wykonany osobno, PASS |

⚠️ **Co NADAL nie jest przetestowane:** kształt bloków `server_tool_use`/
`*_tool_result` wobec PRAWDZIWEJ odpowiedzi Claude API (wszystkie testy
powyżej używają syntetycznych danych zbudowanych ręcznie wg udokumentowanego
formatu). Programista portalu powinien zapisać jedną prawdziwą odpowiedź API
zawierającą wywołania web_search/web_fetch i uruchomić
`extract_api_verification_log.py` wobec niej jako pierwszy test integracyjny
przed podłączeniem do produkcji.

### Ograniczenia (świadome, nie do obejścia samym kodem)

- **Sprawdza próbę weryfikacji, nie wierność treści.** Wykrywa najcięższy
  przypadek — cytat bez żadnego śladu sprawdzenia. Nie porównuje, czy treść
  przepisu w piśmie zgadza się słowo w słowo z tym, co zwrócił `web_fetch`
  — to osobny, możliwy do dobudowania etap (diff semantyczny), nie objęty
  tą wersją.
- **Dopasowanie jest fuzzy (po numerach)**, nie w 100% odporne na przypadek
  (np. "art. 211" pojawiające się przypadkiem w query o czymś innym z tym
  samym numerem artykułu w innej ustawie). Traktować jako sito pierwszego
  rzutu, nie ostateczny wyrok — stąd rekomendacja "pokaż prawnikowi", nie
  "automatycznie odrzuć".

## adapter_krs_vat.py — odczyt KRS i Białej listy VAT (F-204)

Własny adapter (bez serwerów zewnętrznych, bez klucza API) dwóch rejestrów
publicznych, wpięty w `shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md` przy
weryfikacji elementów E01 (NIP), E02 (nazwa rejestrowa), E03 (KRS), E05
(adres siedziby) i przy ustalaniu sposobu reprezentacji podmiotu.

```
python3 adapter_krs_vat.py krs 10681
python3 adapter_krs_vat.py wl 5260250995 --data 2026-09-26
```

Zwraca JSON ze statusem `FOUND` / `NOT_FOUND` / `INVALID_INPUT` / `ERROR`.
Nigdy nie orzeka o skutku prawnym (np. prawie do odliczenia VAT) — to
zostaje po stronie modułu merytorycznego, zgodnie z PRAWO-HARDGATE.

**Stan weryfikacji (2026-09-26):**

| Rejestr | Schemat JSON | Kanał sieciowy z tego środowiska |
|---|---|---|
| KRS (`api-krs.ms.gov.pl`) | ✅ zmierzony live (KRS 0000010681, ORANGE POLSKA S.A.) | ✅ działa (curl, UA neutralny) |
| WL (`wl-api.mf.gov.pl`) | ⚠️ przejęty z opisu w `DOSTEP-MASZYNOWY-API.md` §4 (tam zmierzony wcześniej, inny podmiot ten sam co w KRS — potwierdzenie krzyżowe) | ⛔ zablokowany WAF-em Incapsula (nagłówek `x-iinfo`, ciasteczko `visid_incap_*`) — 4 warianty nagłówków wypróbowane, wszystkie zablokowane identycznie |

⛔ **Blokada WL to zmierzony OBJAW z TEGO środowiska sieciowego (proxy tej
sesji), nie dowód na niedostępność hosta w ogóle** — ten sam host był
wcześniej zmierzony jako osiągalny z innego środowiska (przykład w
`DOSTEP-MASZYNOWY-API.md` §4). `adapter_krs_vat.py` odróżnia to poprawnie:
odpowiedź HTML z Incapsuli daje `ERROR` z czytelną podpowiedzią, nigdy
fałszywy `NOT_FOUND`. Reprodukcja: `curl -sI "https://wl-api.mf.gov.pl/api/search/nip/5260250995?date=RRRR-MM-DD"`
→ nagłówek `x-iinfo` obecny = blokada.

Testy: `test_adapter_krs_vat.py` — 20 offline (fixture zbudowany z realnej,
live-zmierzonej odpowiedzi KRS) + 2 live (`LEX_LIVE=1`), oba PASS 2026-09-26
(KRS: FOUND; WL: ERROR z poprawną podpowiedzią WAF — test przechodzi, bo
sprawdza POPRAWNE ROZPOZNANIE blokady, nie sukces połączenia).

## Nie mylić z audyt-systemu-v4/scripts/ci_check_shared.py

Ten katalog i `audyt-systemu-v4/scripts/` rozwiązują różne problemy:
`ci_check_shared.py` audytuje SILNIK (strukturę plików skilli) i jest
narzędziem dla deweloperów utrzymujących system. `walidator_cytowan.py`
audytuje PRODUKT PRACY (konkretne pismo) i jest narzędziem produkcyjnym
uruchamianym w pipeline portalu dla każdego klienta. Pełny opis rozdziału
w `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-12g.


## Portability — neutralny log i archiwum przykładów MCP

Dla nowych integracji preferuj `{"session_id":"...","events":[...]}`. Event zawiera `tool`, źródło, opcjonalny `query_context` i status. Claude/Anthropic legacy pozostaje obsługiwany; obsługiwane są też generyczne tool-call/result i ukończone wpisy Responses-style. Sam call bez wyniku nie jest weryfikacją.

Serwery MCP: od 3.93 w `audyt-systemu-v4/mcp-servers/` (rozpakowane; przeniesione z tego katalogu).

## F-206 (2026-09-26d) — przywrócenie 8 narzędzi z historii git

Do 2026-09-26d cały ten katalog istniał tylko jako opis: `walidator_cytowan.py`,
`extract_api_verification_log.py` i `export_gate.py` (opisane wyżej w tym pliku)
były usunięte z drzewa rozwojowego repozytorium `michaleiatrak-star/lex-machina`
mergem `d3385b9` (2026-08-27), a `shared/SKILL.md` je mimo to opisywał — stąd
flaga F-206 (jej pierwotny opis mylnie wskazywał inny commit, `ec3f530b`, który
tylko wymienił ZIP-y binarne).

Przy naprawie okazało się, że **ten sam commit usunął też 5 dalszych narzędzi**,
nigdzie w rejestrze F-206 niewymienionych, choć wciąż opisanych jako „ACTIVE"
w `shared/DEPENDENCY-GRAPH.md`, `shared/AUDIT-TRAIL-SPEC.md` i
`shared/MCP-INTEGRACJA.md`: `append_event.py`, `hash_chain_verify.py`,
`router_event_parser.py` (log audytowy hash-chain), oraz `test_mcp_protocol.py`,
`connector_health_check.py` (testy/health-check connectorów MCP). Wszystkie 8
przywrócono bajt-w-bajt z rodzica tego commitu (klon repozytorium, dostęp
odczytu) i zweryfikowano funkcjonalnie:

| Narzędzie | Weryfikacja | Wynik |
|---|---|---|
| `walidator_cytowan.py` | 4 przypadki z `przyklady/` (jak w tabeli wyżej) | ✅ 4/4 zgodne z opisem |
| `extract_api_verification_log.py` | `--self-test` | ✅ PASS |
| `export_gate.py` | `--self-test` | ✅ PASS |
| `append_event.py` + `hash_chain_verify.py` | end-to-end: zapis 3-wpisowego łańcucha, weryfikacja OK, potem ręcznie spreparowane naruszenie (zmieniony `payload` we wpisie seq=2) → poprawnie wykryte jako pierwszy niezgodny wpis | ✅ obie ścieżki poprawne |
| `router_event_parser.py` | `--self-test` | ✅ PASS |
| `test_mcp_protocol.py` | `python3 -m unittest test_mcp_protocol` | ✅ 6/6 PASS |
| `connector_health_check.py` | `--self-test` | ✅ PASS |

Pliki fixture `przyklady/konwersacja_api_przyklad.json`, `przyklady/przyklad_pisma.md`,
`przyklady/sesja_niepelna.json`, `przyklady/sesja_pelna.json` przywrócone tą samą metodą.


## Serwery MCP

Od 3.93: `audyt-systemu-v4/mcp-servers/` — instalacja: `KONEKTORY-REKOMENDOWANE.md` § GDZIE SIĘ KONFIGURUJE SERWER MCP.
