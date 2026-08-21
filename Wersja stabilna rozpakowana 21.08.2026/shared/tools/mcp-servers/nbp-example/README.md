# nbp-example — referencyjny serwer MCP dla NBP Web API

## Status uczciwie
✅ Protokół MCP zweryfikowany realnym klientem.
✅ Normalizacja: 2/2 przypadki (FOUND, NOT_FOUND — brak notowania w dniu wolnym, nie ERROR).
✅ Kształt API jest najbardziej ugruntowany w tej sesji — oficjalna, publiczna, jednoznaczna dokumentacja (`api.nbp.pl/en.html`).

⚠️ **Nie zweryfikowane:** samo żywe wywołanie (środowisko nie ma dostępu do `api.nbp.pl`).

## Instalacja
```bash
cd shared/tools/mcp-servers/nbp-example
npm install
node test_normalizacja.mjs
node test_protokol_mcp.mjs
```

## Podłączenie
```json
{"mcpServers": {"nbp": {"command": "node", "args": ["/pełna/ścieżka/nbp-mcp-server.js"]}}}
```

## Zastosowanie prawne
Przeliczanie kwot w walutach obcych wg kursu z konkretnego dnia — sprawy cywilne/gospodarcze z elementem zagranicznym, odsetki, odszkodowania.
