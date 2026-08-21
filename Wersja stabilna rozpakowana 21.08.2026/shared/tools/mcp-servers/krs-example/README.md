# krs-example — referencyjny serwer MCP dla Otwartego API KRS

## Status uczciwie
✅ Protokół MCP zweryfikowany realnym klientem (connect/tools-list/tools-call).
✅ Normalizacja: 4/4 przypadki testowe (FOUND aktywny, FOUND wykreślony, NOT_FOUND 404, brak nazwy podmiotu).
✅ Priorytet #1 do wdrożenia — bezpośrednio wspiera PODMIOT-GATE w `prawny-router-v3`.

⚠️ **Nie zweryfikowane:** rzeczywisty kształt JSON z `api-krs.ms.gov.pl/api/krs/OdpisAktualny/{numer}` — endpoint i pola (`odpis.dane.dzial1...`) oparte na publicznie udokumentowanym wzorcu KRS Open API (ustawa o otwartych danych, 2022), nie na żywym wywołaniu z tego środowiska.

## Instalacja
```bash
cd shared/tools/mcp-servers/krs-example
npm install
node test_normalizacja.mjs
node test_protokol_mcp.mjs
```

## Podłączenie
```json
{"mcpServers": {"krs": {"command": "node", "args": ["/pełna/ścieżka/krs-mcp-server.js"]}}}
```

## Co dalej
Potwierdzić realny kształt odpowiedzi wobec `api-krs.ms.gov.pl`, w szczególności ścieżkę do pola "czy wykreślono" (dział 6 rejestru przedsiębiorców) — kluczowe dla PODMIOT-GATE.
