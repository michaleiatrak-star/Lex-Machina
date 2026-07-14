#!/usr/bin/env node
/**
 * saos-mcp-server.js — REALNY, uruchamialny serwer MCP dla SAOS REST API
 * (orzeczenia sądów powszechnych i SN), zgodny z protokołem opisanym w
 * shared/MCP-INTEGRACJA.md i schematem odpowiedzi z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 *
 * Kształt odpowiedzi API oparty na dokumentacji już istniejącej w
 * orzeczenia-sadowe-v2/SKILL.md (sekcja 1-T.1 — Faza 1-T, opisana przed tą
 * sesją, niezależnie zweryfikowana wcześniej przez autorów tego skilla):
 * pola caseNumber, judgmentDate, division.court.name / chambers (SN),
 * textContent (fragment), href. To NIE jest zgadywanie jak w przypadku ISAP —
 * ale nadal NIE zostało to potwierdzone żywym wywołaniem z tego środowiska
 * (saos.org.pl nie jest w dozwolonej liście domen sandboxa).
 *
 * ⚠️ STATUS UCZCIWY: protokół MCP zweryfikowany REALNYM klientem (patrz
 * test_protokol_mcp.mjs) — connect/tools-list/tools-call działają end-to-end.
 * Samo zapytanie do saos.org.pl NIE było wykonane z tego środowiska.
 *
 * ⚠️ WAŻNE (zgodnie z orzeczenia-sadowe-v2, Zasada 5 / Faza 1-T.1): SAOS to
 * projekt akademicki (ICM UW), pełni WYŁĄCZNIE rolę wsparcia/wyszukania
 * kandydatów — NIE jest samodzielnym źródłem weryfikacji. Ten connector,
 * zgodnie z KROK 2 z shared/MCP-INTEGRACJA.md, zwraca wynik jako kandydata
 * do potwierdzenia, nigdy jako ostateczne potwierdzenie sygnatury.
 *
 * Narzędzie udostępniane: `saos_search` — nazwa zgodna z konwencją z
 * shared/KONEKTORY-REKOMENDOWANE.md.
 *
 * Uruchomienie:
 *   node saos-mcp-server.js
 *
 * Konfiguracja w kliencie MCP:
 *   {
 *     "mcpServers": {
 *       "saos": {
 *         "command": "node",
 *         "args": ["/sciezka/do/saos-mcp-server.js"]
 *       }
 *     }
 *   }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SAOS_BASE_URL = "https://www.saos.org.pl/api/search/judgments";

const server = new McpServer({
  name: "saos-connector",
  version: "1.0.0",
});

/**
 * Normalizuje surową odpowiedź SAOS ({"items": [...]}) do schematu z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md. Czysta funkcja — testowalna bez sieci.
 *
 * Każdy wynik oznaczony `rola: "KANDYDAT"` — SAOS nigdy nie jest
 * samodzielnym potwierdzeniem (patrz nagłówek pliku, Zasada 5).
 */
export function normalizujOdpowiedzSAOS(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { status: "NOT_FOUND", query_type: "orzeczenie", source: "saos" };
  }

  const zmapowane = rawItems.map((item) => {
    const sadNazwa =
      item?.division?.court?.name ??
      item?.chambers?.[0]?.name ??
      item?.courtType ??
      "nieznany sąd";
    return {
      identyfikator: item.caseNumber ?? null,
      sad: sadNazwa,
      data_wyroku: item.judgmentDate ?? null,
      fragment_tresci: typeof item.textContent === "string"
        ? item.textContent.slice(0, 300)
        : null,
      url_zrodlowy: item.href ?? null,
      rola: "KANDYDAT", // SAOS = wsparcie, nie weryfikacja — Zasada 5 orzeczenia-sadowe-v2
    };
  });

  if (zmapowane.length > 1) {
    return {
      status: "AMBIGUOUS",
      query_type: "orzeczenie",
      source: "saos",
      kandydaci: zmapowane,
    };
  }

  return {
    status: "FOUND",
    query_type: "orzeczenie",
    source: "saos",
    result: zmapowane[0],
    retrieved_at: new Date().toISOString(),
    confidence: "candidate-only", // NIE "deterministic" — wymaga weryfikacji Tier 1
  };
}

async function pobierzZSaos(params) {
  const qs = new URLSearchParams();
  if (params.fraza) qs.set("all", params.fraza);
  if (params.courtType) qs.set("courtType", params.courtType);
  if (params.dataOd) qs.set("judgmentDateFrom", params.dataOd);
  if (params.dataDo) qs.set("judgmentDateTo", params.dataDo);
  qs.set("pageSize", String(params.pageSize ?? 10));

  const url = `${SAOS_BASE_URL}?${qs.toString()}`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!resp.ok) {
    throw new Error(`SAOS API zwróciło HTTP ${resp.status}`);
  }
  const dane = await resp.json();
  return dane.items ?? [];
}

server.registerTool(
  "saos_search",
  {
    title: "Wyszukiwanie orzeczeń w SAOS (System Analizy Orzeczeń Sądowych)",
    description:
      "Przeszukuje pełny tekst orzeczeń sądów powszechnych i SN przez SAOS REST " +
      "API (ICM UW). Zwraca KANDYDATÓW do weryfikacji, nigdy potwierdzenia " +
      "ostatecznego — SAOS pełni wyłącznie rolę wsparcia (patrz Zasada 5 " +
      "w orzeczenia-sadowe-v2/SKILL.md). Status: FOUND/NOT_FOUND/AMBIGUOUS/ERROR.",
    inputSchema: {
      fraza: z.string().describe("Fraza pełnotekstowa do wyszukania w treści/tezie orzeczenia"),
      courtType: z.enum(["COMMON", "SUPREME", "ADMINISTRATIVE"]).optional()
        .describe("Typ sądu (opcjonalnie)"),
      dataOd: z.string().optional().describe("Data początkowa, format yyyy-MM-dd"),
      dataDo: z.string().optional().describe("Data końcowa, format yyyy-MM-dd"),
      pageSize: z.number().optional().describe("Liczba wyników (domyślnie 10)"),
    },
  },
  async ({ fraza, courtType, dataOd, dataDo, pageSize }) => {
    let wynik;
    try {
      const items = await pobierzZSaos({ fraza, courtType, dataOd, dataDo, pageSize });
      wynik = normalizujOdpowiedzSAOS(items);
    } catch (err) {
      wynik = {
        status: "ERROR",
        query_type: "orzeczenie",
        source: "saos",
        detail: String(err?.message ?? err),
        retrieved_at: new Date().toISOString(),
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }],
    };
  }
);

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("saos-mcp-server: nasłuchuję na stdio (MCP)");
}
