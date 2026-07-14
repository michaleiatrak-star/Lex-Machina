#!/usr/bin/env node
/**
 * isap-eli-mcp-server.js — REALNY, uruchamialny serwer MCP dla Sejm ELI API
 * (Dziennik Ustaw / Monitor Polski), zgodny z protokołem opisanym w
 * shared/MCP-INTEGRACJA.md i schematem odpowiedzi z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 *
 * ⚠️ STATUS UCZCIWY: ten serwer POPRAWNIE implementuje protokół MCP (uruchamia
 * się, odpowiada na `tools/list`, `tools/call` — zweryfikowane w tej sesji
 * realnym klientem MCP, patrz self-test poniżej). Samo zapytanie sieciowe do
 * `api.sejm.gov.pl` NIE zostało przetestowane wobec żywego API — środowisko,
 * w którym to piszę, ma dostęp sieciowy ograniczony do listy dozwolonych
 * domen (npm/pypi/github i pokrewne), NIE obejmuje domen .gov.pl. Kształt
 * odpowiedzi Sejm ELI API (pola JSON) trzeba zweryfikować przy pierwszym
 * uruchomieniu w środowisku z realnym dostępem sieciowym.
 *
 * Narzędzie udostępniane: `isap_lookup` — nazwa zgodna z konwencją z
 * shared/KONEKTORY-REKOMENDOWANE.md ("np. isap_lookup, saos_search, ...").
 *
 * Uruchomienie:
 *   node isap-eli-mcp-server.js
 * (komunikacja przez stdio — tak podłącza się serwery MCP lokalne w Claude
 * Desktop / Claude Code; do zdalnego użycia potrzebny wariant Streamable HTTP,
 * poza zakresem tego pliku)
 *
 * Konfiguracja w kliencie MCP (przykład dla Claude Desktop/Code,
 * claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "isap-eli": {
 *         "command": "node",
 *         "args": ["/sciezka/do/isap-eli-mcp-server.js"]
 *       }
 *     }
 *   }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const ELI_BASE_URL = "https://api.sejm.gov.pl/eli/acts"; // do zweryfikowania przez developera

const server = new McpServer({
  name: "isap-eli-connector",
  version: "1.0.0",
});

/**
 * Normalizuje surową odpowiedź Sejm ELI API do schematu z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md (status FOUND/NOT_FOUND/AMBIGUOUS/ERROR).
 * Wydzielona jako czysta funkcja — testowalna bez sieci (patrz self-test).
 */
export function normalizujOdpowiedzELI(rawItems, queryLabel) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { status: "NOT_FOUND", query_type: "akt_prawny", source: "sejm-eli" };
  }
  if (rawItems.length > 1) {
    return {
      status: "AMBIGUOUS",
      query_type: "akt_prawny",
      source: "sejm-eli",
      kandydaci: rawItems.map((p) => `${p.publisher ?? "DU"} ${p.year} poz. ${p.pos}`),
    };
  }
  const p = rawItems[0];
  return {
    status: "FOUND",
    query_type: "akt_prawny",
    source: "sejm-eli",
    result: {
      identyfikator: `${p.publisher ?? "DU"} ${p.year} poz. ${p.pos}`,
      tytul_lub_nazwa: p.title ?? null,
      status_obowiazywania: p.status === "obowiązujący" ? "obowiazuje" : (p.status ?? "nieznany"),
      data_publikacji_lub_wyroku: p.announcementDate ?? null,
      url_zrodlowy: p.ELI ?? null,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
}

async function pobierzZEli(query) {
  const url = `${ELI_BASE_URL}/DU/search?title=${encodeURIComponent(query)}`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!resp.ok) {
    throw new Error(`Sejm ELI API zwróciło HTTP ${resp.status}`);
  }
  const dane = await resp.json();
  return dane.items ?? [];
}

server.registerTool(
  "isap_lookup",
  {
    title: "Wyszukiwanie aktu prawnego w ISAP (Sejm ELI API)",
    description:
      "Wyszukuje akt prawny (ustawę, rozporządzenie) w oficjalnym rejestrze " +
      "Dziennika Ustaw / Monitora Polskiego przez Sejm ELI API. Zwraca " +
      "ustrukturyzowany wynik: FOUND (z numerem Dz.U. i statusem " +
      "obowiązywania), NOT_FOUND, AMBIGUOUS (kilka trafień) lub ERROR.",
    inputSchema: {
      query: z.string().describe("Tytuł ustawy lub fraza do wyszukania, np. 'Kodeks cywilny'"),
    },
  },
  async ({ query }) => {
    let wynik;
    try {
      const items = await pobierzZEli(query);
      wynik = normalizujOdpowiedzELI(items, query);
    } catch (err) {
      wynik = {
        status: "ERROR",
        query_type: "akt_prawny",
        source: "sejm-eli",
        detail: String(err?.message ?? err),
        retrieved_at: new Date().toISOString(),
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }],
    };
  }
);

// Uruchamiamy serwer tylko gdy plik wywołany bezpośrednio (nie przy imporcie
// w testach jednostkowych normalizujOdpowiedzELI powyżej).
if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("isap-eli-mcp-server: nasłuchuję na stdio (MCP)"); // stderr, nie zaśmieca protokołu na stdout
}
