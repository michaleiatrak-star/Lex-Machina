# saos-example — referencyjny serwer MCP dla SAOS REST API

## Status uczciwie

✅ **Zweryfikowane w tej sesji, realnym testem:**
- Protokół MCP (stdio) — prawdziwy klient MCP połączył się, wykonał
  handshake, zobaczył narzędzie `saos_search` przez `tools/list`, wywołał je
  przez `tools/call` i odebrał odpowiedź. Patrz `test_protokol_mcp.mjs`.
- Normalizacja odpowiedzi (`normalizujOdpowiedzSAOS`) — 4/4 przypadki testowe
  PASS (FOUND, NOT_FOUND, AMBIGUOUS, fallback nazwy sądu SN przez `chambers`).
  Patrz `test_normalizacja.mjs`.
- Obsługa błędu sieciowego jest łagodna (`ERROR`, nie awaria).

✅ **Kształt API lepiej ugruntowany niż w isap-eli-example:** pola
`caseNumber`, `judgmentDate`, `division.court.name`/`chambers`, `textContent`,
`href` pochodzą z dokumentacji już istniejącej w `orzeczenia-sadowe-v2/
SKILL.md` (sekcja "Faza 1-T.1"), napisanej niezależnie, wcześniej, przez
autorów tego skilla — nie jest to założenie wymyślone na potrzeby tego
serwera.

⚠️ **NIE zweryfikowane — wymaga developera:**
- Samo wywołanie sieciowe do `saos.org.pl` — środowisko, w którym to pisano,
  nie ma do niego dostępu (poza listą dozwolonych domen sandboksa).
- Zachowanie przy pustych/częściowych polach w realnej odpowiedzi.

## ⚠️ Zasada wynikająca z orzeczenia-sadowe-v2 (Zasada 5) — NIE do pominięcia

SAOS jest projektem akademickim (ICM UW), **pełni wyłącznie rolę wsparcia /
wyszukania kandydatów, nigdy samodzielnej weryfikacji**. Dlatego:
- Każdy wynik `FOUND` ma pole `result.rola: "KANDYDAT"`.
- Pole `confidence` to `"candidate-only"`, **nie** `"deterministic"` (w
  odróżnieniu od `isap-eli-example`, gdzie `FOUND` = potwierdzenie).
- `shared/MCP-INTEGRACJA.md` (KROK 2) musi traktować wynik tego connectora
  jako krok pośredni — sygnatura z SAOS nadal wymaga potwierdzenia w Tier 1
  (`orzeczenia.ms.gov.pl`/`sn.pl`/CBOSA) przed powołaniem, dokładnie jak dziś
  robi to `orzeczenia-sadowe-v2` przez `web_fetch`.

## Instalacja i uruchomienie

```bash
cd shared/tools/mcp-servers/saos-example
npm install
node test_normalizacja.mjs      # test bez sieci — powinien przejść zawsze
node test_protokol_mcp.mjs      # test protokołu MCP — przejdzie, ale
                                 # saos_search zwróci ERROR bez dostępu do
                                 # saos.org.pl (tak jak w tym środowisku)
```

## Podłączenie do Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "saos": {
      "command": "node",
      "args": ["/pełna/ścieżka/do/saos-mcp-server.js"]
    }
  }
}
```

## Co dalej

1. Uruchomić w środowisku z dostępem do `saos.org.pl`, potwierdzić realny
   kształt odpowiedzi.
2. CBOSA (orzeczenia.nsa.gov.pl) — wg dokumentacji `orzeczenia-sadowe-v2` NIE
   ma publicznego REST API, więc analogiczny prosty wrapper nie zadziała;
   wymagałby web scrapingu formularza (i uwagi na ograniczenie captchą po
   serii zapytań — patrz "Faza 1-T.2" w tym samym skillu).
3. Rozważyć cache z TTL (SAOS bywa opóźniony względem najnowszych orzeczeń —
   nie cache'ować dłużej niż to opóźnienie uzasadnia).
