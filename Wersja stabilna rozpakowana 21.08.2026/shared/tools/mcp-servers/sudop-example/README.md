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
node test_protokol_mcp.mjs
```

## Podłączenie
```json
{"mcpServers": {"sudop": {"command": "node", "args": ["/pełna/ścieżka/sudop-mcp-server.js"]}}}
```

## Zastosowanie prawne
Weryfikacja pomocy publicznej/de minimis otrzymanej przez podmiot — sprawy o zwrot pomocy, zamówienia publiczne, kontrole UOKiK.
