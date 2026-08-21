#!/usr/bin/env node
/**
 * ceidg-mcp-server.js — serwer MCP dla API CEIDG / Biznes.gov.pl (Centralna
 * Ewidencja i Informacja o Działalności Gospodarczej), potwierdzonego jako
 * publiczne API — ALE, w odróżnieniu od KRS/NBP/SUDOP/ISAP/SAOS, WYMAGA
 * bezpłatnego klucza API uzyskanego przez wniosek na dane.biznes.gov.pl
 * (sesja 2026-07-13j/k).
 *
 * ⚠️ STATUS UCZCIWY — WIĘKSZA NIEPEWNOŚĆ NIŻ POZOSTAŁE 4 SERWERY Z TEJ SESJI:
 * Dokumentacja publiczna znaleziona w tej sesji wskazuje na istnienie metody
 * synchronicznego wyszukiwania po NIP ("Interfejs METODA FIRMA"), ale główny
 * nurt dokumentacji "Hurtowni Danych CEIDG" opisuje API asynchroniczne
 * (żądanie raportu → sprawdzenie statusu → pobranie pliku CSV), a nie prosty
 * GET zwracający JSON od razu. Endpoint i kształt odpowiedzi poniżej to
 * NAJLEPSZE PRZYBLIŻENIE na podstawie fragmentów dokumentacji — WYMAGA
 * potwierdzenia przez developera z dostępem do pełnej dokumentacji API
 * (klucz + pełny PDF z dane.biznes.gov.pl) BARDZIEJ niż jakikolwiek inny
 * serwer w tej sesji.
 *
 * Wymaga zmiennej środowiskowej CEIDG_API_KEY (klucz z dane.biznes.gov.pl).
 *
 * Narzędzie: `ceidg_szukaj_firmy`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CEIDG_BASE_URL = "https://dane.biznes.gov.pl/api/ceidg/v2";

const server = new McpServer({ name: "ceidg-connector", version: "1.0.0" });

export function normalizujOdpowiedzCEIDG(raw) {
  const firma = raw?.firmy?.[0] ?? raw?.firma ?? null;
  if (!firma) {
    return { status: "NOT_FOUND", query_type: "podmiot", source: "ceidg" };
  }
  return {
    status: "FOUND",
    query_type: "podmiot",
    source: "ceidg",
    result: {
      identyfikator: firma.nip ?? null,
      tytul_lub_nazwa: firma.nazwa ?? firma.firma ?? null,
      status_obowiazywania: firma.status === "AKTYWNY" ? "obowiazuje" : (firma.status ?? "nieznany"),
      data_publikacji_lub_wyroku: firma.dataRozpoczecia ?? null,
      url_zrodlowy: "https://aplikacja.ceidg.gov.pl/CEIDG/CEIDG.Public.UI/Search.aspx",
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
}

async function pobierzZCeidg(nip, apiKey) {
  const url = `${CEIDG_BASE_URL}/firmy?nip=${encodeURIComponent(nip)}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(15000),
  });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`API CEIDG zwróciło HTTP ${resp.status}`);
  return await resp.json();
}

server.registerTool(
  "ceidg_szukaj_firmy",
  {
    title: "Weryfikacja jednoosobowej działalności gospodarczej w CEIDG",
    description:
      "Sprawdza dane jednoosobowej działalności gospodarczej po numerze NIP " +
      "w rejestrze CEIDG. WYMAGA klucza API (zmienna środowiskowa CEIDG_API_KEY) " +
      "— w odróżnieniu od pozostałych connectorów tej sesji.",
    inputSchema: {
      nip: z.string().regex(/^\d{10}$/).describe("10-cyfrowy NIP przedsiębiorcy"),
    },
  },
  async ({ nip }) => {
    const apiKey = process.env.CEIDG_API_KEY;
    let wynik;
    if (!apiKey) {
      wynik = {
        status: "ERROR",
        query_type: "podmiot",
        source: "ceidg",
        detail: "Brak CEIDG_API_KEY w zmiennych środowiskowych — wymagany klucz z dane.biznes.gov.pl",
        retrieved_at: new Date().toISOString(),
      };
    } else {
      try {
        const raw = await pobierzZCeidg(nip, apiKey);
        wynik = normalizujOdpowiedzCEIDG(raw);
      } catch (err) {
        wynik = {
          status: "ERROR",
          query_type: "podmiot",
          source: "ceidg",
          detail: String(err?.message ?? err),
          retrieved_at: new Date().toISOString(),
        };
      }
    }
    return { content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }] };
  }
);

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ceidg-mcp-server: nasłuchuję na stdio (MCP)");
}
