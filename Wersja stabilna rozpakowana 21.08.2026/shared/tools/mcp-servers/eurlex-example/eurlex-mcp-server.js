#!/usr/bin/env node
/**
 * eurlex-mcp-server.js — serwer MCP dla CELLAR SPARQL endpoint (EUR-Lex),
 * potwierdzonego jako w pełni publiczne API bez autoryzacji — najczęściej
 * referencjonowane źródło w skillach DR tego systemu (32 odwołania,
 * sesja 2026-07-13j).
 *
 * ⚠️ STATUS UCZCIWY — NAJWYŻSZA NIEPEWNOŚĆ CO DO KSZTAŁTU ZAPYTANIA ZE
 * WSZYSTKICH 6 SERWERÓW Z TEJ SESJI: CELLAR to endpoint SPARQL (semantyczny,
 * RDF/CDM ontology), nie prosty REST z płaskim JSON jak KRS/NBP/SUDOP.
 * Poniższe zapytanie SPARQL jest uproszczonym przybliżeniem na podstawie
 * publicznej dokumentacji (szukanie dokumentu po numerze CELEX) — realna
 * ontologia CDM ma dziesiątki predykatów, a dokładna struktura zapytania
 * wymaga weryfikacji względem aktualnego schematu CDM (eur-lex.europa.eu
 * /content/help/data-reuse/reuse-contents-eurlex-details.html) przez
 * developera ZNAJĄCEGO SPARQL, zanim trafi to na produkcję.
 *
 * Limity endpointu (z dokumentacji, sesja 2026-07-13j): timeout zapytania 60s,
 * max 5 równoległych połączeń per IP, wyniki >10 000 wierszy wymagają paginacji.
 *
 * Narzędzie: `eurlex_lookup`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CELLAR_SPARQL_URL = "https://publications.europa.eu/webapi/rdf/sparql";

const server = new McpServer({ name: "eurlex-connector", version: "1.0.0" });

/**
 * Buduje uproszczone zapytanie SPARQL wyszukujące dokument po numerze CELEX.
 * ⚠️ Przybliżenie — patrz nagłówek pliku.
 */
function budujZapytanieSparql(celex) {
  return `
PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
SELECT ?work ?title ?date WHERE {
  ?work cdm:resource_legal_id_celex "${celex}" .
  OPTIONAL { ?work cdm:work_title ?title . }
  OPTIONAL { ?work cdm:work_date_document ?date . }
}
LIMIT 5
`.trim();
}

/**
 * Normalizuje wynik SPARQL (format JSON, standardowy dla SPARQL 1.1 Query
 * Results JSON Format: {"results":{"bindings":[...]}}) do schematu z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 */
export function normalizujOdpowiedzEURLEX(rawBindings, celex) {
  if (!Array.isArray(rawBindings) || rawBindings.length === 0) {
    return { status: "NOT_FOUND", query_type: "akt_prawny_ue", source: "eur-lex" };
  }
  if (rawBindings.length > 1) {
    return {
      status: "AMBIGUOUS",
      query_type: "akt_prawny_ue",
      source: "eur-lex",
      kandydaci: rawBindings.map((b) => b.title?.value ?? celex),
    };
  }
  const b = rawBindings[0];
  return {
    status: "FOUND",
    query_type: "akt_prawny_ue",
    source: "eur-lex",
    result: {
      identyfikator: `CELEX:${celex}`,
      tytul_lub_nazwa: b.title?.value ?? null,
      status_obowiazywania: "nieznany", // CDM ma osobny predykat in-force, pominięty w tym uproszczeniu
      data_publikacji_lub_wyroku: b.date?.value ?? null,
      url_zrodlowy: `https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:${celex}`,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
}

async function pobierzZCellar(celex) {
  const zapytanie = budujZapytanieSparql(celex);
  const url = `${CELLAR_SPARQL_URL}?query=${encodeURIComponent(zapytanie)}&format=application/sparql-results+json`;
  const resp = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" },
    signal: AbortSignal.timeout(20000), // endpoint dopuszcza do 60s, ale krótszy timeout lokalny
  });
  if (!resp.ok) throw new Error(`CELLAR SPARQL zwrócił HTTP ${resp.status}`);
  const dane = await resp.json();
  return dane?.results?.bindings ?? [];
}

server.registerTool(
  "eurlex_lookup",
  {
    title: "Wyszukiwanie aktu prawa UE w EUR-Lex/CELLAR po numerze CELEX",
    description:
      "Pobiera metadane aktu prawa UE (tytuł, data) z semantycznego repozytorium " +
      "CELLAR po numerze CELEX (np. 32016R0679 dla RODO). Zwraca " +
      "FOUND/NOT_FOUND/AMBIGUOUS/ERROR. Endpoint publiczny, bez autoryzacji, " +
      "ale ograniczony do 5 równoległych połączeń/IP i timeout 60s po stronie serwera.",
    inputSchema: {
      celex: z.string().describe("Numer CELEX aktu, np. '32016R0679' (RODO)"),
    },
  },
  async ({ celex }) => {
    let wynik;
    try {
      const bindings = await pobierzZCellar(celex);
      wynik = normalizujOdpowiedzEURLEX(bindings, celex);
    } catch (err) {
      wynik = {
        status: "ERROR",
        query_type: "akt_prawny_ue",
        source: "eur-lex",
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
  console.error("eurlex-mcp-server: nasłuchuję na stdio (MCP)");
}
