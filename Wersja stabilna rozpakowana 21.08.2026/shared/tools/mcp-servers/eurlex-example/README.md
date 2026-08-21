# eurlex-example — referencyjny serwer MCP dla EUR-Lex/CELLAR (SPARQL)

## Status uczciwie — NAJWAŻNIEJSZE źródło (32 odwołania w dr-*/), ale najbardziej złożone technicznie

✅ Protokół MCP zweryfikowany realnym klientem.
✅ Normalizacja: 3/3 przypadki testowe (FOUND/NOT_FOUND/AMBIGUOUS).
✅ Endpoint publicznie potwierdzony jako w pełni bez autoryzacji.

⚠️ **Zapytanie SPARQL to uproszczenie.** CELLAR używa ontologii CDM
(Common Data Model) z dziesiątkami predykatów RDF — zapytanie w tym pliku
wyszukuje tylko po `cdm:resource_legal_id_celex` i pobiera `work_title`/
`work_date_document`. Nie pobiera statusu obowiązywania (`status_obowiazywania`
zwraca zawsze `"nieznany"` — celowo, żeby nie zmyślać pola, którego to
zapytanie nie sprawdza). Developer znający SPARQL powinien rozbudować
zapytanie o pełniejszy zestaw predykatów CDM przed produkcją.

⚠️ Limity endpointu (z dokumentacji): timeout 60s, max 5 równoległych połączeń/IP, paginacja powyżej 10 000 wyników.

## Instalacja
```bash
cd shared/tools/mcp-servers/eurlex-example
npm install
node test_normalizacja.mjs
node test_protokol_mcp.mjs
```

## Podłączenie
```json
{"mcpServers": {"eurlex": {"command": "node", "args": ["/pełna/ścieżka/eurlex-mcp-server.js"]}}}
```

## Co dalej (priorytet wysoki — 32 odwołania w skillach DR, największy potencjalny zwrot)
1. Rozbudować zapytanie SPARQL o predykat statusu obowiązywania (in-force) z ontologii CDM.
2. Rozważyć dodanie wsparcia dla wyszukiwania pełnotekstowego, nie tylko po CELEX.
3. Przetestować rzeczywisty limit równoległości (5/IP) w środowisku produkcyjnym z wieloma rozmowami jednocześnie.
