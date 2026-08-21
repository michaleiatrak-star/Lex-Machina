# MCP-INTEGRACJA.md
## Deterministyczna warstwa weryfikacji — uzupełnienie PRAWO-HARDGATE.md (nie zamiennik)

status: production-ready (wymaga podłączenia connectorów przez developera)
wprowadzono: 2026-07-13 (jako osobny skill `mcp-zrodla-prawa-v1`)
skonsolidowano do `shared/`: 2026-07-13f (patrz AUDIT-JOURNAL, powód: uniknięcie
duplikowania wzorca "protokół + narzędzia" już reprezentowanego przez
PRAWO-HARDGATE.md i shared/tools/ — ten protokół nie jest samodzielnym skillem
wywoływanym intencją użytkownika, tylko modułem ładowanym przez router, dokładnie
jak PRAWO-HARDGATE.md)
wywoływane przez: prawny-router-v3 (required_modules), potencjalnie każdy DR-skill
narzędzia: shared/tools/test_mcp_protocol.py, shared/tools/connector_health_check.py

---

## ⛔ ZASADA NADRZĘDNA — MCP UZUPEŁNIA, NIE ZASTĘPUJE HARD GATE

> HARD GATE (`shared/PRAWO-HARDGATE.md`) pozostaje aktywny bez wyjątku, niezależnie od
> tego, czy serwer MCP jest podłączony. Ten moduł dodaje **dodatkową, twardszą warstwę**
> przed HARD GATE — nie zwalnia z niej. Jeśli developer kiedykolwiek rozważy usunięcie
> HARD GATE "bo MCP już weryfikuje" — to błąd architektoniczny: MCP-connectory mogą być
> niedostępne, nieaktualne względem najnowszej nowelizacji, albo nie obejmować danej
> dziedziny (np. KIO, TK). System musi działać poprawnie i bezpiecznie także przy MCP=0.

## Cel

Router (`prawny-router-v3`) i wszystkie DR-skille dziś weryfikują przepisy i orzeczenia
wyłącznie przez `web_search`/`web_fetch` sterowane instrukcją tekstową (HARD GATE).
To działa, ale zależy w 100% od tego, czy model *zdecyduje się* wykonać fetch zgodnie
z instrukcją. Konkurencja (MateMatic: 5 serwerów MCP do SAOS/CBOSA/Sejm ELI/KRS/EUR-Lex;
Patron) ma to uziemione **programowo** — model nie może "zapomnieć" wykonać wywołania,
bo bez wyniku narzędzia nie ma z czego zbudować odpowiedzi.

Ten moduł wprowadza protokół: **jeśli serwer MCP dla danego typu zapytania jest
podłączony i dostępny w tej rozmowie → użyj go PRZED web_search. Jeśli nie jest
dostępny → HARD GATE działa jak dotychczas (web_search/web_fetch), z jawnym
oznaczeniem, że weryfikacja była promptowa, a nie deterministyczna.**

---

## KROK 1 — Wykrycie dostępnych narzędzi MCP

Na początku obsługi każdej sprawy (po FAZIE routingu w prawny-router-v3, przed
KROKIEM 1-detekcja), sprawdź listę dostępnych narzędzi w tej rozmowie pod kątem
narzędzi oznaczonych jako `[third_party_mcp_app]` lub jawnie nazwanych wg wzorca
z `KONEKTORY-REKOMENDOWANE.md` (np. `isap_lookup`, `saos_search`,
`cbosa_search`, `krs_lookup`, `eurlex_lookup`).

- Znaleziono ≥1 pasujący konektor → tryb **MCP-FIRST** dla tej dziedziny zapytania.
- Nie znaleziono żadnego → tryb **FALLBACK-HARDGATE** (obecny stan systemu, bez zmian).

Nie proponuj instalacji tych connectorów przez `suggest_connectors` przy każdej sprawie —
to infrastruktura developerska, konfigurowana raz przy wdrożeniu portalu, nie wybór
użytkownika końcowego per rozmowa.

## KROK 2 — Zapytanie do MCP zamiast/przed web_search

Gdy tryb MCP-FIRST aktywny, dla każdego powołania (akt prawny, artykuł, sygnatura
orzeczenia):

1. Wywołaj odpowiedni konektor MCP z jak najbardziej precyzyjnym zapytaniem
   (numer aktu jeśli znany, nazwa ustawy, sygnatura sądu).
2. Sklasyfikuj wynik:
   - **FOUND / potwierdzone, z numerem Dz.U. i statusem obowiązywania** → oznacz
     ✅ [MCP-VERIFIED: <źródło>, <data odpowiedzi>] i użyj tego wyniku.
   - **NOT_FOUND** → nie zgaduj. Przejdź do KROK 3 (fallback HARD GATE) — może to
     akt spoza zakresu danego connectora, nie dowód nieistnienia.
   - **AMBIGUOUS** (kilka trafień) → przejdź do KROK 3, doprecyzuj przez web_search.
3. **Nigdy nie łącz wyniku MCP z pamięcią modelu** — jeśli MCP zwraca częściowy
   wynik (np. sam numer bez treści artykułu), treść merytoryczna nadal wymaga
   HARD GATE (web_fetch pełnego tekstu), MCP daje tylko identyfikację/status aktu.

## KROK 3 — Fallback do HARD GATE (bez zmian względem obecnego stanu)

Jeśli MCP niedostępne, zwróciło NOT_FOUND/AMBIGUOUS, lub przekroczyło rozsądny czas
odpowiedzi → standardowa procedura z `shared/PRAWO-HARDGATE.md`: web_search/web_fetch,
oznaczenie ⚠️ [NIEWERYFIKOWANE] jeśli i to zawiedzie. Nie ma stanu "system nie
odpowiada" z powodu braku MCP.

## KROK 4 — Rozbieżność źródeł

Jeśli w tej samej sprawie MCP i web_search dały **różne** odpowiedzi na to samo
pytanie (np. różny aktualny t.j.) → to sytuacja o wyższym priorytecie niż zwykłe
[NIEWERYFIKOWANE]. Oznacz ⛔ [SPRZECZNOŚĆ ŹRÓDEŁ: MCP=<X> vs web=<Y>], zatrzymaj
generowanie treści opartej na tym powołaniu, poinformuj użytkownika wprost i —
jeśli dotyczy mapy centralnej — zgłoś to jako flagę do `audyt-systemu-v4/
references/WARN-OTWARTE.md` przy najbliższej sesji audytowej.

---

## Integracja z prawny-router-v3

Router ładuje ten plik jako `required_modules` **opcjonalnie** — tzn. `view` tego
pliku jest tani (sam protokół), a faktyczne wywołanie narzędzia MCP następuje
tylko, gdy narzędzie jest realnie dostępne (patrz KROK 1). To nie zwiększa
kosztu tokenowego rozmów, w których developer nie podłączył żadnego connectora
— w takim wypadku KROK 1 kończy się natychmiast konkluzją FALLBACK-HARDGATE
i reszta tego pliku nie wpływa na dalszy przebieg.

## Co NIE jest częścią tego modułu

- Kod źródłowy serwerów MCP (ISAP/SAOS/CBOSA) — to osobne projekty infrastrukturalne
  po stronie developera/portalu, niepodlegające temu repozytorium skilli. Patrz
  `KONEKTORY-REKOMENDOWANE.md` po konkretne, istniejące projekty OSS do
  wykorzystania zamiast pisania własnych od zera.
- Gwarancja dostępności zewnętrznych API rządowych — to poza kontrolą silnika.
