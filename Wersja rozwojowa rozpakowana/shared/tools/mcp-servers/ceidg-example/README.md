# ceidg-example — referencyjny serwer MCP dla API CEIDG/Biznes.gov.pl

## Status uczciwie — NAJWIĘKSZA NIEPEWNOŚĆ ze wszystkich 6 serwerów tej sesji

✅ Protokół MCP zweryfikowany realnym klientem (w tym poprawna, czytelna
obsługa braku klucza API — zwraca ERROR zamiast się wywalić).
✅ Normalizacja: 3/3 przypadki testowe.

⚠️ **Różni się od pozostałych 4 (KRS/NBP/SUDOP/ISAP/SAOS): wymaga klucza API**
uzyskanego przez darmowy wniosek na `dane.biznes.gov.pl` — bez niego
narzędzie zwraca czytelny ERROR, nie próbuje nawet wywołania sieciowego.

⚠️ **Kształt zapytania NAJMNIEJ pewny w tej sesji:** dokumentacja znaleziona
w tym researchu opisuje głównie API **asynchroniczne** ("Hurtownia Danych" —
żądanie raportu → sprawdzenie statusu → pobranie CSV), nie prosty
synchroniczny GET jak w pozostałych serwerach. Endpoint `/api/ceidg/v2/firmy`
użyty w tym pliku to przybliżenie na podstawie wzmianki o "Interfejs METODA
FIRMA" w dokumentacji — **wymaga potwierdzenia przez developera z pełnym
dostępem do dokumentacji API (PDF z `dane.biznes.gov.pl`) bardziej niż
jakikolwiek inny serwer w tej sesji.**

## Instalacja
```bash
cd shared/tools/mcp-servers/ceidg-example
npm install
node test_normalizacja.mjs
CEIDG_API_KEY=twoj_klucz node test_protokol_mcp.mjs   # bez klucza: self-test i tak przechodzi (sprawdza obsługę braku klucza)
```

## Podłączenie
```json
{"mcpServers": {"ceidg": {"command": "node", "args": ["/pełna/ścieżka/ceidg-mcp-server.js"], "env": {"CEIDG_API_KEY": "..."}}}}
```

## Co dalej (priorytet wysoki — więcej pracy niż inne)
1. Złożyć wniosek o klucz API na `dane.biznes.gov.pl`.
2. Pobrać pełną dokumentację PDF i potwierdzić, czy istnieje faktycznie
   synchroniczny endpoint wyszukiwania po NIP, czy trzeba przejść na model
   asynchroniczny (raport → polling → pobranie pliku).
3. Jeśli asynchroniczny — przepisać `pobierzZCeidg()` na trzy kroki zamiast jednego GET.
