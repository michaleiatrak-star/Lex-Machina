#!/usr/bin/env node
/**
 * sudop-mcp-server.js — serwer MCP dla API SUDOP (System Udostępniania Danych
 * o Pomocy Publicznej, prowadzony przez UOKiK), potwierdzonego jako publiczne
 * API bez rejestracji (limit 8 zapytań/sekundę) — sesja 2026-07-13j.
 * Dokumentacja: api-sudop.uokik.gov.pl:9443/devportal/apis
 *
 * Przydatność prawna: weryfikacja, czy dany podmiot (po NIP) otrzymał pomoc
 * publiczną/de minimis — istotne w sprawach dot. zamówień publicznych,
 * pomocy publicznej, sporów o zwrot pomocy.
 *
 * ⚠️ STATUS UCZCIWY: protokół MCP zweryfikowany realnym klientem. Kształt
 * odpowiedzi API oparty na publicznej dokumentacji endpointu
 * `/sudop-api/api/przypadki-pomocy?nip-beneficjenta=...` — NIE potwierdzone
 * żywym wywołaniem z tego środowiska.
 *
 * Narzędzie: `sudop_szukaj_pomocy`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SUDOP_BASE_URL = "https://api-sudop.uokik.gov.pl/sudop-api/api/przypadki-pomocy";

const server = new McpServer({ name: "sudop-connector", version: "1.0.0" });

export function normalizujOdpowiedzSUDOP(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { status: "NOT_FOUND", query_type: "pomoc_publiczna", source: "sudop" };
  }

  const zmapowane = rawItems.map((p) => ({
    identyfikator: p.numerSrodkaPomocowego ?? p.idPrzypadku ?? null,
    tytul_lub_nazwa: p.nazwaBeneficjenta ?? null,
    data_publikacji_lub_wyroku: p.dzienUdzieleniaPomocy ?? null,
    wartosc_pomocy: p.wartoscPomocyBrutto ?? null,
    forma_pomocy: p.formaPomocyOpis ?? null,
  }));

  if (zmapowane.length > 1) {
    return { status: "AMBIGUOUS", query_type: "pomoc_publiczna", source: "sudop", kandydaci: zmapowane };
  }

  return {
    status: "FOUND",
    query_type: "pomoc_publiczna",
    source: "sudop",
    result: zmapowane[0],
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
}

async function pobierzZSudop(nip) {
  const url = `${SUDOP_BASE_URL}?nip-beneficjenta=${encodeURIComponent(nip)}`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!resp.ok) throw new Error(`SUDOP API zwróciło HTTP ${resp.status}`);
  const dane = await resp.json();
  return dane.items ?? dane.content ?? [];
}

server.registerTool(
  "sudop_szukaj_pomocy",
  {
    title: "Wyszukiwanie pomocy publicznej/de minimis w SUDOP (UOKiK)",
    description:
      "Sprawdza, czy dany podmiot (po NIP) otrzymał pomoc publiczną lub pomoc " +
      "de minimis w ciągu ostatnich 10 lat, wg bazy SUDOP prowadzonej przez UOKiK.",
    inputSchema: {
      nip: z.string().regex(/^\d{10}$/).describe("10-cyfrowy NIP beneficjenta pomocy"),
    },
  },
  async ({ nip }) => {
    let wynik;
    try {
      const items = await pobierzZSudop(nip);
      wynik = normalizujOdpowiedzSUDOP(items);
    } catch (err) {
      wynik = {
        status: "ERROR",
        query_type: "pomoc_publiczna",
        source: "sudop",
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
  console.error("sudop-mcp-server: nasłuchuję na stdio (MCP)");
}
