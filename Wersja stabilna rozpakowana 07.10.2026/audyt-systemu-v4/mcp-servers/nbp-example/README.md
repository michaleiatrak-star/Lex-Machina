> ⛔ **STAN 2026-09-27j (AUDYT-2026-09-27j, shared 3.90):** NBP 1.1.0 — w dni bez publikacji (weekend, święto, przed ok. 12:00) zwraca ostatnią tabelę przed datą z jawnym `przesuniecie_dni` i `uwaga`; wcześniej NOT_FOUND, także bez podanej daty.

Testy: `test_normalizacja.mjs` (offline, na prawdziwych odpowiedziach z `fixtures/`), `../test_protokol.mjs` (tylko protokół MCP — nie sprawdza treści), `../test_na_zywo.mjs` (treść na żywym API; jedyny test, który wykrywa błędy treści).

---

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
node ../test_protokol.mjs
```

## Podłączenie
```json
{"mcpServers": {"nbp": {"command": "node", "args": ["/pełna/ścieżka/nbp-mcp-server.js"]}}}
```

## Zastosowanie prawne
Przeliczanie kwot w walutach obcych wg kursu z konkretnego dnia — sprawy cywilne/gospodarcze z elementem zagranicznym, odsetki, odszkodowania.
