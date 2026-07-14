# isap-eli-example — referencyjny serwer MCP dla Sejm ELI API

## Status uczciwie

✅ **Zweryfikowane w tej sesji, realnym testem:**
- Serwer poprawnie implementuje protokół MCP (stdio) — prawdziwy klient MCP
  (`@modelcontextprotocol/sdk` Client) połączył się, wykonał handshake,
  zobaczył narzędzie `isap_lookup` przez `tools/list`, wywołał je przez
  `tools/call` i poprawnie odebrał odpowiedź. Patrz `test_protokol_mcp.mjs`.
- Funkcja normalizująca odpowiedź (`normalizujOdpowiedzELI`) do schematu
  FOUND/NOT_FOUND/AMBIGUOUS/ERROR z `shared/SCHEMAT-ODPOWIEDZI-MCP.md —
  3/3 przypadków testowych PASS. Patrz `test_normalizacja.mjs`.
- Obsługa błędu sieciowego jest łagodna (zwraca `ERROR` w ustrukturyzowanej
  odpowiedzi), nie powoduje awarii serwera — zweryfikowane właśnie przez brak
  dostępu do `api.sejm.gov.pl` w środowisku, w którym to pisano.

⚠️ **NIE zweryfikowane — wymaga developera:**
- Rzeczywisty kształt odpowiedzi JSON z `api.sejm.gov.pl/eli/acts/DU/search`
  (nazwy pól, struktura, paginacja). Ten serwer zakłada pola
  `year/pos/publisher/title/status/announcementDate/ELI` w `items[]` — do
  potwierdzenia lub korekty przy pierwszym uruchomieniu z realnym dostępem
  sieciowym do `api.sejm.gov.pl`.
- Dokładny endpoint wyszukiwania (`?title=...`) — do zweryfikowania względem
  aktualnej dokumentacji Sejm ELI API.
- Zachowanie przy dużych zbiorach wyników / paginacji.

## Dlaczego to istnieje mimo zasady "integruj, nie buduj od zera"

`shared/KONEKTORY-REKOMENDOWANE.md` rekomenduje podłączenie istniejących,
utrzymywanych projektów OSS zamiast pisania własnych connectorów. Ta zasada
pozostaje słuszna dla środowiska produkcyjnego. Ten plik istnieje, bo
użytkownik zapytał wprost, czy można "wstawić realny connector MCP" — a
żadnego gotowego, zweryfikowanego projektu nie dało się zainstalować i
przetestować z tego sandboksa (brak dostępu do repozytoriów trzecich firm
poza npm/pypi/github, i to głównie na potrzeby zależności, nie gotowych
serwerów MCP dla polskich baz prawnych). Napisano więc minimalny, ale
**realnie działający** serwer referencyjny — nie jako zamiennik rekomendacji
z KONEKTORY-REKOMENDOWANE.md, tylko jako konkretny punkt startowy, gdyby
developer wolał zacząć od czegoś działającego niż od zera.

## Instalacja i uruchomienie

```bash
cd shared/tools/mcp-servers/isap-eli-example
npm install
node test_normalizacja.mjs      # test bez sieci — powinien przejść zawsze
node test_protokol_mcp.mjs      # test protokołu MCP — przejdzie, ale
                                 # isap_lookup zwróci ERROR bez dostępu do
                                 # api.sejm.gov.pl (tak jak w tym środowisku)
```

## Podłączenie do Claude Desktop / Claude Code

W `claude_desktop_config.json` (lub analogicznym pliku konfiguracyjnym MCP):
```json
{
  "mcpServers": {
    "isap-eli": {
      "command": "node",
      "args": ["/pełna/ścieżka/do/isap-eli-mcp-server.js"]
    }
  }
}
```
Po podłączeniu, `shared/MCP-INTEGRACJA.md` (KROK 1) wykryje narzędzie
`isap_lookup` jako dostępny connector i router (od wersji 3.16, po naprawie
F-12 — patrz `orzeczenia-sadowe-v2` i `analizator-przepisow-v2`) użyje go
przed `web_search`/`web_fetch`.

## Co dalej

1. Uruchomić w środowisku z dostępem do `api.sejm.gov.pl`, potwierdzić kształt
   odpowiedzi, skorygować `pobierzZEli()`/`normalizujOdpowiedzELI()` jeśli trzeba.
2. Rozważyć analogiczne serwery dla SAOS (orzecznictwo) i CBOSA (choć CBOSA,
   wg dokumentacji `orzeczenia-sadowe-v2`, nie ma publicznego REST API —
   wymagałby web scrapingu, nie prostego wrappera API).
3. Dodać obsługę paginacji i cache'owania (z TTL, zgodnie z zasadami w
   `shared/KONEKTORY-REKOMENDOWANE.md`).
