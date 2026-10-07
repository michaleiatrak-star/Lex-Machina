> ⛔ **STAN 2026-09-27j (AUDYT-2026-09-27j, shared 3.90):** SUDOP 1.1.0 — API asynchroniczne: `sudop_szukaj_pomocy` zleca i czeka ≤50 s, potem zwraca ERROR/`PENDING` z `kolejka_id`; `sudop_odbierz_wynik` odbiera. ⚠️ Wyniku końcowego nie zaobserwowano w pomiarze (kolejka >30 min bez odpowiedzi) — kształt JSON wyniku NIEZWERYFIKOWANY.

Testy: `test_normalizacja.mjs` (offline, na prawdziwych odpowiedziach z `fixtures/`), `../test_protokol.mjs` (tylko protokół MCP — nie sprawdza treści), `../test_na_zywo.mjs` (treść na żywym API; jedyny test, który wykrywa błędy treści).

---

# sudop-example — referencyjny serwer MCP dla API SUDOP (UOKiK)

## Status uczciwie
✅ Protokół MCP zweryfikowany realnym klientem.
✅ Normalizacja: 3/3 przypadki (NOT_FOUND, FOUND, AMBIGUOUS — wiele przypadków pomocy dla tego samego NIP).
✅ API publicznie potwierdzone, bez rejestracji, limit 8 zapytań/s (dokumentacja: `api-sudop.uokik.gov.pl:9443/devportal/apis`).

⚠️ **Nie zweryfikowane:** żywe wywołanie (brak dostępu do `saos.org.pl`/`uokik.gov.pl` z tego środowiska); dokładne nazwy pól JSON oparte na dokumentacji tekstowej, nie na specyfikacji Swagger (nie udało się pobrać pliku `.json` z portalu deweloperskiego z tego środowiska).

## Instalacja
```bash
cd shared/tools/mcp-servers/sudop-example
npm install
node test_normalizacja.mjs
node ../test_protokol.mjs
```

## Podłączenie
```json
{"mcpServers": {"sudop": {"command": "node", "args": ["/pełna/ścieżka/sudop-mcp-server.js"]}}}
```

## Zastosowanie prawne
Weryfikacja pomocy publicznej/de minimis otrzymanej przez podmiot — sprawy o zwrot pomocy, zamówienia publiczne, kontrole UOKiK.
