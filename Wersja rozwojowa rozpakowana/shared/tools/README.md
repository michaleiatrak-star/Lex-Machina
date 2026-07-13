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
```

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

## Nie mylić z audyt-systemu-v4/scripts/ci_check_shared.py

Ten katalog i `audyt-systemu-v4/scripts/` rozwiązują różne problemy:
`ci_check_shared.py` audytuje SILNIK (strukturę plików skilli) i jest
narzędziem dla deweloperów utrzymujących system. `walidator_cytowan.py`
audytuje PRODUKT PRACY (konkretne pismo) i jest narzędziem produkcyjnym
uruchamianym w pipeline portalu dla każdego klienta. Pełny opis rozdziału
w `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-12g.
