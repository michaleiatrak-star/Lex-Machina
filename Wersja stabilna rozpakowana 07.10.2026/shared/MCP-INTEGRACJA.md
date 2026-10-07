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
KROKIEM 1-detekcja), **wypisz faktyczną listę narzędzi dostępnych w tej rozmowie**
i sprawdź, czy któreś pochodzi z serwera MCP.

⛔ **POPRAWKA 2026-09-27h — poprzednia reguła NIE MOGŁA ZADZIAŁAĆ.** Kazała szukać
narzędzi „nazwanych wg wzorca z `KONEKTORY-REKOMENDOWANE.md` (np. `isap_lookup`,
`saos_search`, `cbosa_search`, `krs_lookup`, `eurlex_lookup`)". Zmierzone:

- (a) tych nazw **nie ma w `KONEKTORY-REKOMENDOWANE.md`** — odesłanie prowadziło do
  konwencji, której ten plik nigdy nie zawierał (jego tabela operuje kategoriami
  funkcjonalnymi, nie nazwami narzędzi);
- (b) nazwa `isap_lookup` **istnieje** — to `registerTool("isap_lookup", …)`
  w `audyt-systemu-v4/mcp-servers/` (`isap-eli-example`). ⚠️ Korekta wobec wydania 3.87,
  które twierdziło, że „narzędzia MCP nie nazywają się w ten sposób" — twierdzenie
  było za szerokie i niezmierzone wobec własnych serwerów tego repozytorium;
- (c) **czego brakowało i co jest faktyczną przyczyną awarii wykrywania:** w hoście
  narzędzie serwera nie nazywa się `isap_lookup`, lecz `mcp__<serwer>__isap_lookup`.
  Szukanie samej nazwy własnej nie trafi, choćby nazwa była poprawna.

Skutek, gdyby tego nie wykryto: tryb MCP-FIRST nie włączyłby się nawet przy poprawnie
zainstalowanym konektorze, a system trwale pracowałby w FALLBACK-HARDGATE, nie
wiedząc o tym (bramka samoraportująca — rodzina F-119).

**Reguła wykrywania — po KSZTAŁCIE nazwy, nie po zgadywanej nazwie własnej:**

```
Narzędzie pochodzi z MCP, gdy jego nazwa ma postać:
    mcp__<nazwa-serwera>__<nazwa-narzędzia>
Przykłady zmierzone w środowisku: mcp__memory__memory_list,
    mcp__mcp-isap__search_acts
⛔ NIE zgaduj nazw narzędzi. Wypisz te, które SĄ, i dopasuj po ZDOLNOŚCI
   (co narzędzie robi wg swojego opisu), nie po nazwie własnej.
```

**⭐ Narzędzia Lex Machina (`audyt-systemu-v4/mcp-servers/`, od shared 3.94) — dopasowanie po
SUFIKSIE nazwy.** Prefiks zależy od hosta — zmierzone/udokumentowane:
Claude Code + plugin: `mcp__plugin_audyt-systemu-v4_lex-<serwer>__<narzędzie>` (dokumentacja
plugins-reference); instalator (`--scal-desktop`, `claude mcp add`): `mcp__lex-<serwer>__<narzędzie>`;
rozszerzenie Claude Desktop (`lex-machina.mcpb`, jeden serwer `lex-machina`): prefiks hosta + nazwa
narzędzia. **Rozpoznawaj narzędzie, gdy nazwa KOŃCZY SIĘ nazwą z tabeli** (po `__` albo w całości).

| Narzędzie (sufiks) | Zdolność | Krok HARDGATE | Status → decyzja |
|---|---|---|---|
| `isap_lookup` (`eli`: DU/RRRR/PPP) | akt Dz.U./M.P. po ELI; status; **aktualny t.j.** | ŹRÓDŁO-0 (`PRAWO-HARDGATE.md`) | FOUND+`obowiazuje` → MCP-VERIFIED metryki; `tekst_jednolity_nieaktualny` → powołuj `result.aktualny_tekst_jednolity` |
| `isap_tekst` (`eli`, `artykul` / `szukaj`) | **obowiązujące brzmienie** artykułu z PDF aktualnego t.j. (automatyczne przejście z pozycji pierwotnej); pkt 2 obwieszczenia („t.j. nie obejmuje”); akty zmieniające ogłoszone po t.j. | ŹRÓDŁO-0 — TREŚĆ przepisu | `wersja_tekstu` = `tekst_jednolity` + brak `zmiany_po_tj` → brzmienie do cytowania dosłownie; `tekst_ogloszony` → brzmienie z dnia ogłoszenia, nie stan obecny; indeksy górne jako `Art. N[k]` |
| `isap_lookup` (`query`: tytuł) | identyfikacja aktu po tytule | ŹRÓDŁO-1 (zamiast web_search) | AMBIGUOUS → wybierz kandydata po tytule i statusie, potem `eli` |
| `saos_search` (`sygnatura`) | istnienie sygnatury: SP (bieżąco), SN do 2016, TK do 2015, KIO do 2018 | `PRAWO-HARDGATE-ORZECZENIA.md` KROK 0 (SAOS) | kontrakt SYGNATURY; NSA/WSA oraz SN/TK/KIO spoza zasięgu → OUT_OF_SCOPE (nie „zmyślona”) |
| `saos_cytator` (`sygnatura`) | późniejsze orzeczenia cytujące (fraza w cudzysłowie, pełne treści) + sygnały odstąpienia w TYM SAMYM zdaniu, z kierunkiem (cytowane orzeczenie jako przedmiot vs aktor odstąpienia) | ocena aktualności linii orzeczniczej | KANDYDACI; próba 27t: 6/6 trafień z sygnałem prawdziwych; ⚠️ SN po 2016 i TK po 2015 niewidoczne — brak sygnału nie wyklucza zmiany linii |
| `cbosa_sprawdz_sygnature` | istnienie sygnatury NSA/WSA (exact-match, fail-closed) | KROK 0A pkt 1 (MCP-FIRST) | FOUND = snapshot 🟨 bez awansu; OUT_OF_SCOPE → KROK 0A pkt 2 |
| `cbosa_szukaj`, `cbosa_pobierz` | research NSA/WSA, treść orzeczenia | research, nie weryfikacja | KANDYDAT |
| `eureka_sprawdz_sygnature` | istnienie i AKTUALNOŚĆ interpretacji podatkowej | weryfikacja interpretacji | FOUND+`uchylony` → nie powołuj jako aktualnego stanowiska |
| `eureka_szukaj`, `eureka_pobierz` | research interpretacji, treść | research | KANDYDAT ze statusem |
| `eurlex_tsue` (sygnatura C-/T-/F-, ECLI, CELEX, fraza) | orzeczenia TSUE: wyrok + opinia RG/postanowienia, tytuł PL, strony | powołanie orzecznictwa TSUE | FOUND = identyfikacja sprawy; treść wyroku — EUR-Lex (`url_zrodlowy`) |
| `eurlex_lookup` (CELEX) | akt UE: status obowiązywania, data końca | ŹRÓDŁO-0 dla prawa UE | FOUND+`uchylony` → nie powołuj jako obowiązującego |
| `krs_lookup` | podmiot w KRS — rejestr P **i S** (fundacje, stowarzyszenia) | KROK 0D / PODMIOT-GATE | NOT_FOUND dopiero po P i S |
| `krs_reprezentacja` | organ, sposób reprezentacji, skład (z zawieszeniem), prokurenci, organ nadzoru, stan rejestru | umocowanie osób podpisujących | nazwiska zamaskowane przez rejestr — tożsamość osoby potwierdza odpis/dokument; wnioski w toku niewidoczne |
| `nbp_kurs_waluty` | kurs średni tabeli A | przeliczenia walutowe | `przesuniecie_dni` > 0 → podstawę tabeli ustal z przepisu |
| `uodo_sprawdz_sygnature` | istnienie decyzji Prezesa UODO (post-check — wyszukiwarka prefiksowa) i AKTUALNA prawomocność | weryfikacja decyzji UODO (RODO) | `prawomocnosc` ≠ „prawomocna” → nie powołuj jako utrwalonego stanowiska; prawomocność z metryki, nie z daty ogłoszenia |
| `uodo_szukaj`, `uodo_pobierz` | research decyzji UODO (filtr prawomocności, daty), treść | research RODO | KANDYDAT z prawomocnością |
| `wl_sprawdz_nip` | biała lista VAT: status (Czynny / Zwolniony / Niezarejestrowany), rachunki, `dowod_sprawdzenia.requestId` | PODMIOT-GATE; weryfikacja kontrahenta | NIP spoza wykazu → NOT_FOUND **z** requestId (dowód sprawdzenia negatywnego); `ma_rachunki_wirtualne` → rachunek tylko przez `wl_sprawdz_rachunek` |
| `wl_sprawdz_rachunek` | czy rachunek jest przypisany do NIP na dzień | weryfikacja rachunku przed płatnością | TAK → FOUND, NIE → NOT_FOUND; requestId do akt; NIP/NRB walidowane lokalnie (mod 11 / mod 97) |
| `sudop_szukaj_pomocy` / `sudop_odbierz_wynik` | pomoc publiczna / de minimis | analiza pomocy | ERROR/`PENDING` ≠ brak pomocy |
| `ceidg_szukaj_firmy` | JDG w CEIDG (wymaga klucza) | PODMIOT-GATE | bez klucza ERROR = kanał niedostępny |

Konektory obce (`mcp-isap`, `mcp-nsa`, `legal-cite-pl`, …) — dopasowanie po zdolności jak wyżej;
nazwy z tabeli mają pierwszeństwo, bo ich zachowanie jest zmierzone (`test_na_zywo.mjs`, walidator
schematu).

**Zmierzone 2026-09-27g/h — serwery ELI/ISAP** (`@matematicsolutions/mcp-isap` 1.3.0,
protokół MCP 2024-11-05, `initialize` + `tools/list` + `tools/call` wykonane
realnie, źródło danych: api.sejm.gov.pl/eli — ten sam publikator, co RZĄD 1):

| Narzędzie | Wymagane argumenty | Zdolność |
|---|---|---|
| `search_acts` | — (np. `title`, `limit`) | wyszukanie aktu po tytule; zwraca ELI, pozycję Dz.U., typ, status, daty |
| `get_act` | `eli` (np. `DU/2018/1000`) | metryka aktu po identyfikatorze ELI |
| `get_act_text` | `eli` | tekst aktu stronami po 5000 znaków |

**Serwer własny repozytorium** (`audyt-systemu-v4/mcp-servers/isap-eli-example/`,
zmierzony 2026-09-27h): jedno narzędzie `isap_lookup` (arg `query`), zwraca schemat
FOUND / NOT_FOUND / AMBIGUOUS / ERROR wg `SCHEMAT-ODPOWIEDZI-MCP.md` (wzorzec cienkiej warstwy
normalizującej dla dewelopera: `shared/tools/przyklad-adapter-normalizujacy.md` — ilustracja, nie serwer). W hoście:
`mcp__<nazwa-serwera-z-konfiguracji>__isap_lookup`.

⚠️ Tabela jest **przykładem zmierzonym**, nie kontraktem: inny serwer ELI wystawi
inne nazwy. Reguła obowiązująca to dopasowanie po zdolności, tabela służy do
rozpoznania tego konkretnego serwera.

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
  po stronie developera/portalu. **Wyjątek:** Lex Machina utrzymuje własny
  deterministyczny fallback HTML dla CBOSA w `orzeczenia-sadowe-v2`; nie jest
  to serwer MCP ani osobna baza, lecz adapter do urzędowego źródła RZĘDU 2A.
  Patrz `KONEKTORY-REKOMENDOWANE.md` po projekty OSS i priorytet kanałów.
- Gwarancja dostępności zewnętrznych API rządowych — to poza kontrolą silnika.
