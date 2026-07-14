#!/usr/bin/env node
/**
 * krs-mcp-server.js — serwer MCP dla Otwartego API Krajowego Rejestru
 * Sądowego (KRS), uruchomionego przez Ministerstwo Sprawiedliwości w 2022 r.
 * na podstawie ustawy o otwartych danych (zbadane i potwierdzone jako
 * publiczne, bez logowania — sesja 2026-07-13j/k).
 *
 * Zgodne z protokołem shared/MCP-INTEGRACJA.md i schematem
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 *
 * ⚠️ STATUS UCZCIWY: protokół MCP zweryfikowany realnym klientem (patrz
 * test_protokol_mcp.mjs). Kształt odpowiedzi API OPARTY na publicznie
 * udokumentowanym wzorcu endpointu "odpis aktualny" (api-krs.ms.gov.pl/api/
 * krs/OdpisAktualny/{numerKRS}?rejestr=P&format=json) — NIE zostało to
 * potwierdzone żywym wywołaniem z tego środowiska (brak dostępu do domen
 * .gov.pl w sandboksie). Struktura JSON (pole `odpis.dane.dzial1...`) jest
 * wzorowana na oficjalnej dokumentacji Ministerstwa Sprawiedliwości, ale
 * MUSI zostać potwierdzona przez developera przy pierwszym uruchomieniu.
 *
 * Narzędzie: `krs_lookup` (nazwa zgodna z shared/KONEKTORY-REKOMENDOWANE.md).
 *
 * Szczególnie istotne dla PODMIOT-GATE w prawny-router-v3, który weryfikuje
 * status podmiotu/organu przed generowaniem pism.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const KRS_BASE_URL = "https://api-krs.ms.gov.pl/api/krs";

const server = new McpServer({ name: "krs-connector", version: "1.0.0" });

/**
 * Normalizuje surową odpowiedź "OdpisAktualny" KRS do schematu z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md. Czysta funkcja, testowalna bez sieci.
 */
export function normalizujOdpowiedzKRS(raw, numerKrs) {
  if (raw?.status === 404 || raw == null) {
    return { status: "NOT_FOUND", query_type: "podmiot", source: "krs" };
  }

  const dzial1 = raw?.odpis?.dane?.dzial1;
  const nazwaPodmiotu =
    dzial1?.danePodmiotu?.nazwa ?? dzial1?.danePodmiotu?.nazwaPodmiotu ?? null;
  const formaPrawna = dzial1?.danePodmiotu?.formaPrawna ?? null;
  const stanRejestru = raw?.odpis?.naglowekA?.stanZDnia ?? null;
  // wykreślenie / status podmiotu — pole obecności w dziale 6 rejestru przedsiębiorców
  const wykreslony = Boolean(raw?.odpis?.dane?.dzial6?.wykreslenie?.czyWykreslono);

  if (!nazwaPodmiotu) {
    return { status: "NOT_FOUND", query_type: "podmiot", source: "krs" };
  }

  return {
    status: "FOUND",
    query_type: "podmiot",
    source: "krs",
    result: {
      identyfikator: `KRS ${numerKrs}`,
      tytul_lub_nazwa: nazwaPodmiotu,
      status_obowiazywania: wykreslony ? "wykreslony" : "obowiazuje",
      data_publikacji_lub_wyroku: stanRejestru,
      url_zrodlowy: `https://prs.ms.gov.pl/krs/podglad-informacji-aktualnej/${numerKrs}`,
      forma_prawna: formaPrawna,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
}

async function pobierzZKrs(numerKrs) {
  const url = `${KRS_BASE_URL}/OdpisAktualny/${numerKrs}?rejestr=P&format=json`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (resp.status === 404) return { status: 404 };
  if (!resp.ok) {
    throw new Error(`API KRS zwróciło HTTP ${resp.status}`);
  }
  return await resp.json();
}

server.registerTool(
  "krs_lookup",
  {
    title: "Weryfikacja podmiotu w KRS (Otwarte API Krajowego Rejestru Sądowego)",
    description:
      "Pobiera odpis aktualny podmiotu z Krajowego Rejestru Sądowego po numerze " +
      "KRS. Przydatne do weryfikacji PODMIOT-GATE — czy spółka/organ istnieje, " +
      "jaka jest jego nazwa i czy nie został wykreślony z rejestru. Zwraca " +
      "FOUND/NOT_FOUND/ERROR (nigdy AMBIGUOUS — wyszukiwanie jest po unikalnym numerze).",
    inputSchema: {
      numerKrs: z.string().regex(/^\d{10}$/).describe("10-cyfrowy numer KRS podmiotu"),
    },
  },
  async ({ numerKrs }) => {
    let wynik;
    try {
      const raw = await pobierzZKrs(numerKrs);
      wynik = normalizujOdpowiedzKRS(raw, numerKrs);
    } catch (err) {
      wynik = {
        status: "ERROR",
        query_type: "podmiot",
        source: "krs",
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
  console.error("krs-mcp-server: nasłuchuję na stdio (MCP)");
}
