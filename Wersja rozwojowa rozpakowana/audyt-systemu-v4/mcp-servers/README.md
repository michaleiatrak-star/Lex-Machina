# Serwery MCP Lex Machina — `audyt-systemu-v4/mcp-servers/`

Od audyt 6.143 / shared 3.93 (AUDYT-2026-09-27m). Serwery leżą **rozpakowane**, bo host
uruchamia serwer z pliku na dysku, nie z archiwum.

## Instalacja

| Gdzie | Jak |
|---|---|
| **Claude Desktop — zalecane** | rozszerzenie `lex-machina.mcpb`: Ustawienia → Rozszerzenia → zainstaluj z pliku. Node.js jest wbudowany w Desktop — nie instalujesz nic więcej. Budowa: `python zbuduj_pakiet.py --mcpb` → `dist/lex-machina.mcpb` (poza repozytorium: artefakt wydania) |
| Claude Code + plugin `audyt-systemu-v4` | nic — `../.mcp.json` startuje 8 serwerów `lex-*` z `${CLAUDE_PLUGIN_ROOT}` |
| Claude Desktop bez rozszerzenia / Claude Code bez pluginu / sieć z proxy HTTPS | `python instaluj_serwery_mcp.py [--scal-desktop]` (przepisuje `NODE_EXTRA_CA_CERTS`/proxy, których `.mcp.json` pluginu nie przekaże) |
| claude.ai w przeglądarce | nie dotyczy — serwery stdio tam nie działają; potrzebny serwer pod HTTPS (F-8) |

## Zawartość

| Co | Po co |
|---|---|
| `dist/lex-mcp.mjs` | wszystkie serwery w jednym pliku z wbudowanymi zależnościami; `node dist/lex-mcp.mjs <serwer>` albo `wszystkie` (jeden serwer z wszystkimi narzędziami — tryb rozszerzenia) |
| `dist/NOTICE-THIRD-PARTY.txt` | noty licencyjne 8 wbudowanych pakietów (MIT, BSD-3-Clause, ISC) — wymagane przy rozpowszechnianiu |
| `mcpb-manifest.json` | manifest rozszerzenia Claude Desktop (MCPB 0.3; walidowany `mcpb validate`) |
| `zbuduj_pakiet.py` | przebudowa `dist/`; `--sprawdz` = CI wykrywa nieaktualny `dist/`; `--mcpb` = rozszerzenie |
| `instaluj_serwery_mcp.py` | konfiguracja hosta; `--diagnoza` (czy ta maszyna ma Claude Desktop), `--scal-desktop`, `--mcpb KATALOG` (rozszerzenie bez sieci), `--sprawdz` (CI). Uruchamiany z pozycji 14 menu audytu (FAZA 0E) |
| `LICENSE` | GPL-3.0 repozytorium — dołączana do rozszerzenia `.mcpb` |
| `*-example/` | źródła i testy offline `test_normalizacja.mjs` (na prawdziwych odpowiedziach API) |
| `package.json`, `package-lock.json` | WSPÓLNE zależności wszystkich serwerów (od 27s; dawniej 10 identycznych kopii) — `npm ci` raz, w tym katalogu |
| `test_protokol.mjs` | protokół MCP wszystkich serwerów naraz (od 27s; dawniej 10 kopii `test_protokol_mcp.mjs`) |
| `test_poprawnosci.mjs` | test PRAWDZIWOŚCI treści (od 2026-10-01): każda odpowiedź porównana z niezależnym odczytem źródła (surowe API, pełny tekst, SPARQL, `pdftotext` dla PDF ISAP) + budżet czasu na zawieszonym źródle; `CEIDG_API_KEY` tylko w zmiennej środowiskowej |
| `wspolne/budzet.mjs` | wspólny budżet czasu wywołania narzędzia (domyślnie 50 s, `LEX_BUDZET_MS`) — zawieszone źródło daje ERROR serwera zamiast `-32001 Request timed out` klienta (60 s) |
| `test_na_zywo.mjs` | test TREŚCI na żywym API (29 przypadków; `LEX_POMIN="SAOS|CBOSA"` pomija niedostępne kanały); wymaga `npm ci` w tym katalogu |

Serwery: `isap`, `saos`, `krs`, `nbp`, `eurlex`, `eureka`, `sudop`, `cbosa`, `uodo`, `wl` (biała lista VAT), `ceidg` (tylko z `CEIDG_API_KEY`).

⚠️ `cbosa`: port 1:1 parsera `orzeczenia-sadowe-v2/tools/cbosa_parser.py` (równoważność:
`cbosa-example/test_normalizacja.mjs`, 25 przypadków generowanych z Pythona + paginacja + regresje
z pomiaru na żywo). Warstwa HTTP zmierzona na żywo 2026-09-30/10-01 (macOS, Node 22) — trzy defekty
naprawione: (1) kontrola `Content-Length` myliła bajty skompresowane (gzip) z po dekompresji;
(2) sekcja „powiązane" (`span.powiazane`) była liczona jako wyniki; (3) metadane dokumentu
w zagnieżdżonych tabelach nie były odczytywane („brak pól Data orzeczenia"). `test_na_zywo.mjs`: CBOSA → FOUND (pełny harness 30/30).
Z sandboxa Claude nadal 503 (F-213); pomiar wykonywać z sieci użytkownika.

⛔ Po każdej zmianie w `*-example/*.js`: `python zbuduj_pakiet.py`, inaczej CI zgłosi nieaktualny `dist/`.
