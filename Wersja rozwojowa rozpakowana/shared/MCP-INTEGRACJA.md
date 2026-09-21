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

W aplikacji Lex Machina preferowanym wejściem jest **jedna federacja runtime**
(`legal-federation`) oparta na agregatorze `matematicsolutions/prawo-pl-mcp`.
Federacja normalizuje dziesięć rodzin źródeł bez wystawiania modelowi kilkudziesięciu
konkurujących schematów:

`saos · nsa · isap · krs · eureka · kio · uodo · eu-sparql · eu-compliance · legalize`.

Rozpoznaj narzędzia `list_federated_legal_sources`,
`search_federated_legal_sources`, `get_federated_legal_document`,
`call_federated_legal_source` i `federated_legal_coverage`.

- Federacja dostępna → tryb **MCP-FEDERATION-FIRST** dla discovery/retrieval.
- Federacja niedostępna, ale host ma indywidualny connector MCP → użyj go jako
  warstwy discovery/retrieval zgodnie z tym samym kontraktem bezpieczeństwa.
- Brak MCP → **FALLBACK-HARDGATE**; natywne resolvery Lex Machina działają bez MCP.

⛔ MCP nie otrzymuje danych klienta, treści akt sprawy ani tokenów anonimizera.
Do zewnętrznej federacji przekazuj wyłącznie publiczne identyfikatory, nazwy aktów,
sygnatury oraz neutralne frazy prawne.

Nie proponuj instalacji connectorów użytkownikowi końcowemu przy każdej sprawie —
to infrastruktura aplikacji, a nie wybór per rozmowa.

## KROK 2 — MCP jako discovery/retrieval, nie drugi system prawdy

Gdy federacja jest aktywna:

1. Użyj właściwego źródła z federacji z możliwie precyzyjnym publicznym
   identyfikatorem albo neutralną frazą prawną.
2. **FOUND nie tworzy znacznika ✅ [VER].** Wynik MCP jest materiałem źródłowym
   do dalszej walidacji, nie wpisem do ledgeru weryfikacyjnego.
3. Dla przepisu / Dz.U. / aktualnego brzmienia prawa polskiego po retrieval
   uruchom natywne `verify_legal_reference` Lex Machina. Dopiero ono wraz z
   kontrolą temporalną może utworzyć ważny ✅ [VER].
4. Dla SN discovery może iść przez SAOS, lecz finalna sygnatura/cytat/teza
   przechodzi odpowiednio `verify_case_reference`, `verify_case_quote`,
   `verify_case_proposition`.
5. EUREKA, KIO i UODO zachowują swój rzeczywisty charakter: interpretacje /
   orzeczenia / decyzje organów. **Nigdy** nie zamykają same bramki brzmienia
   przepisu.
6. **NOT_FOUND / pusty wynik / source_unavailable ≠ nieistnienie.** Odczytaj
   `federated_legal_coverage` i uruchom natywny fallback urzędowy.
7. Nigdy nie łącz częściowego wyniku MCP z pamięcią modelu.

## KROK 3 — Fallback do HARD GATE (bez zmian względem obecnego stanu)

Jeśli MCP niedostępne, zwróciło NOT_FOUND/AMBIGUOUS, lub przekroczyło rozsądny czas
odpowiedzi → standardowa procedura z `shared/PRAWO-HARDGATE.md`.

**Wyjątek wykonawczy NSA/WSA — zanim użyjesz ogólnego web_search:** jeżeli sprawa
routuje do CBOSA, uruchom `shared/SYGNATURY.md` V-SYG-0.7 DIRECT-CBOSA
(`POST /cbo/search` → kompletna paginacja → `/doc/{ID}` → exact-match),
zgodnie z `shared/DOSTEP-MASZYNOWY-API.md`. Implementacja parsera:
implementacja referencyjna opisana w `shared/CBOSA-ADAPTER.md`. Dopiero jeśli direct CBOSA
jest niedostępna w bieżącym runtime → V-SYG-0.5 RETRIEVAL/SNAPSHOT z obowiązkowym
POST-CHECK HOSTA, exact-match i jawnym `access_mode/content_scope`.

To jest ważne: brak connectora MCP **nie może obniżać systemu z deterministycznego
HTML do luźnego wyszukiwania webowego**, jeśli źródło urzędowe ma odtwarzalny
formularz server-side.

Oznaczenie ⚠️ [NIEWERYFIKOWANE] stosuj dopiero, gdy odpowiedni HARD GATE / kanał
urzędowy także zawiedzie. Nie ma stanu "system nie odpowiada" z powodu braku MCP.

## KROK 4 — Rozbieżność źródeł

Jeśli MCP i natywna ścieżka urzędowa Lex Machina dały **różne** odpowiedzi na
to samo pytanie (np. różny aktualny t.j.), nie rozstrzygaj przez głosowanie źródeł.
Natywna ścieżka urzędowa + temporal freshness jest **autorytetem weryfikacyjnym**;
wykonaj ją ponownie i zatrzymaj publikację spornego powołania aż do wyjaśnienia.
Jeśli sprzeczność pozostaje, oznacz ⛔ [SPRZECZNOŚĆ ŹRÓDEŁ] i zgłoś flagę audytową.
Federacja nigdy nie nadpisuje wpisu ledgeru Lex Machina.

---

## Integracja z prawny-router-v3

Router ładuje ten plik jako `required_modules`. W desktopowym runtime RC14
federacja jest wystawiana jako pięć narzędzi wysokiego poziomu nad dziesięcioma
rodzinami źródeł, natomiast natywne narzędzia weryfikacyjne pozostają osobno.
Ten rozdział odpowiedzialności jest celowy: **MCP = research/retrieval,
Lex verifier = autoryzacja cytowania**. Awaria federacji degraduje tylko research;
nie wyłącza HARD GATE ani natywnych resolverów.

## Co NIE jest częścią tego modułu

- Kod źródłowy serwerów MCP (ISAP/SAOS/CBOSA) — to osobne projekty infrastrukturalne
  po stronie developera/portalu. **Wyjątek:** Lex Machina utrzymuje własny
  deterministyczny fallback HTML dla CBOSA w `orzeczenia-sadowe-v2`; nie jest
  to serwer MCP ani osobna baza, lecz adapter do urzędowego źródła RZĘDU 2A.
  Patrz `KONEKTORY-REKOMENDOWANE.md` po projekty OSS i priorytet kanałów.
- Gwarancja dostępności zewnętrznych API rządowych — to poza kontrolą silnika.
