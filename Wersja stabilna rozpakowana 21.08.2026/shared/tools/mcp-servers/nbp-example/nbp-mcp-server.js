#!/usr/bin/env node
/**
 * nbp-mcp-server.js — serwer MCP dla NBP Web API (kursy walut/złota),
 * potwierdzonego jako publiczne, w pełni udokumentowane API bez autoryzacji
 * (sesja 2026-07-13j). Od 1.08.2025 wyłącznie HTTPS.
 *
 * Przydatność prawna: przeliczanie kwot w walutach obcych na PLN wg kursu
 * z konkretnego dnia — częste w sprawach cywilnych/gospodarczych (odsetki,
 * odszkodowania, rozliczenia międzynarodowe).
 *
 * ⚠️ STATUS UCZCIWY: protokół MCP zweryfikowany realnym klientem. Kształt
 * odpowiedzi API oparty na oficjalnej, publicznej dokumentacji (api.nbp.pl/en.html)
 * — NIE potwierdzone żywym wywołaniem z tego środowiska.
 *
 * Narzędzie: `nbp_kurs_waluty`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NBP_BASE_URL = "https://api.nbp.pl/api/exchangerates/rates";

const server = new McpServer({ name: "nbp-connector", version: "1.0.0" });

/**
 * Normalizuje odpowiedź NBP ({"rates":[{"no":..., "effectiveDate":..., "mid":...}]})
 * do schematu z shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 */
export function normalizujOdpowiedzNBP(raw, kodWaluty) {
  const stawka = raw?.rates?.[0];
  if (!stawka) {
    // typowo: brak notowania w danym dniu (weekend/święto) — NIE błąd, brak danych
    return { status: "NOT_FOUND", query_type: "kurs_waluty", source: "nbp" };
  }
  return {
    status: "FOUND",
    query_type: "kurs_waluty",
    source: "nbp",
    result: {
      identyfikator: `${kodWaluty.toUpperCase()} tabela ${stawka.no}`,
      tytul_lub_nazwa: `Kurs średni ${kodWaluty.toUpperCase()}/PLN`,
      status_obowiazywania: "obowiazuje",
      data_publikacji_lub_wyroku: stawka.effectiveDate,
      url_zrodlowy: `https://api.nbp.pl/api/exchangerates/rates/a/${kodWaluty.toLowerCase()}/${stawka.effectiveDate}/`,
      kurs_sredni: stawka.mid,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
}

async function pobierzZNbp(kodWaluty, data) {
  const segment = data ? `/${data}` : "/today";
  const url = `${NBP_BASE_URL}/a/${kodWaluty.toLowerCase()}${segment}/?format=json`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (resp.status === 404) return null; // brak notowania tego dnia (NBP zwraca 404, nie pusta tablica)
  if (!resp.ok) throw new Error(`NBP API zwróciło HTTP ${resp.status}`);
  return await resp.json();
}

server.registerTool(
  "nbp_kurs_waluty",
  {
    title: "Kurs średni waluty NBP (tabela A)",
    description:
      "Pobiera średni kurs wymiany waluty obcej na PLN z tabeli A NBP dla " +
      "wskazanego dnia (lub dzisiejszego, jeśli data nie podana). Przydatne " +
      "do przeliczeń kwot w sprawach z elementem zagranicznym.",
    inputSchema: {
      kodWaluty: z.string().length(3).describe("Trzyliterowy kod waluty ISO 4217, np. USD, EUR, GBP"),
      data: z.string().optional().describe("Data w formacie YYYY-MM-DD (opcjonalnie, domyślnie dziś)"),
    },
  },
  async ({ kodWaluty, data }) => {
    let wynik;
    try {
      const raw = await pobierzZNbp(kodWaluty, data);
      wynik = normalizujOdpowiedzNBP(raw, kodWaluty);
    } catch (err) {
      wynik = {
        status: "ERROR",
        query_type: "kurs_waluty",
        source: "nbp",
        detail: String(err?.message ?? err),
        retrieved_at: new Date().toISOString(),
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }] };
  }
);

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("nbp-mcp-server: nasłuchuję na stdio (MCP)");
}
