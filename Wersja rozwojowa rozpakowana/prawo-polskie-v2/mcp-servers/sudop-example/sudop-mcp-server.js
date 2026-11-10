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
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

// ⛔ POPRAWKA 2026-09-27j (AUDYT-2026-09-27j). Stan 27h: nota o asynchroniczności, ale
//    kod dalej robił jedno żądanie i parsował JSON → crash „Unexpected token 'P'”.
//    Zmierzone 27j:
//      ?nip=...                → HTTP 400 „nierozpoznany parametr nip”
//      ?nip-beneficjenta=...   → HTTP 303, Location WZGLĘDNY: /sudop-api/api/kolejka/{uuid}
//      GET kolejka/{uuid}      → 200 text/plain „Przygotowywanie odpowiedzi, przewidywany
//                                czas to 60 sekund” — bez zmian przez 266 s (2 NIP-y).
//    Wynik końcowy NIE został zaobserwowany, więc kształt JSON wyniku jest NIEZWERYFIKOWANY.
//    Konstrukcja: sudop_szukaj_pomocy zleca i czeka ≤ 50 s; jeśli wynik niegotowy →
//    ERROR z detail „PENDING” i kolejka_id; sudop_odbierz_wynik odbiera później.
const SUDOP_HOST = "https://api-sudop.uokik.gov.pl";
const SUDOP_BASE_URL = `${SUDOP_HOST}/sudop-api/api/przypadki-pomocy`;
const CZEKANIE_MS = 50000;
const INTERWAL_MS = 10000;

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "sudop-connector", version: "1.1.0" }));

export function normalizujOdpowiedzSUDOP(raw) {
  const rawItems = Array.isArray(raw) ? raw : raw?.items ?? raw?.content ?? raw?.dane ?? [];
  const uwagaKsztalt = "Kształt JSON wyniku SUDOP niezweryfikowany pomiarem (27j) — sprawdź pola ręcznie.";
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { status: "NOT_FOUND", query_type: "pomoc_publiczna", source: "sudop", uwaga: uwagaKsztalt };
  }
  const zmapowane = rawItems.map((p) => ({
    identyfikator: p.numerSrodkaPomocowego ?? p.idPrzypadku ?? null,
    tytul_lub_nazwa: p.nazwaBeneficjenta ?? null,
    data_publikacji_lub_wyroku: p.dzienUdzieleniaPomocy ?? null,
    wartosc_pomocy: p.wartoscPomocyBrutto ?? null,
    forma_pomocy: p.formaPomocyOpis ?? null,
    surowe_klucze: Object.keys(p ?? {}).slice(0, 20),
  }));
  const w = zmapowane.length > 1
    ? { status: "AMBIGUOUS", query_type: "pomoc_publiczna", source: "sudop", kandydaci: zmapowane }
    : { status: "FOUND", query_type: "pomoc_publiczna", source: "sudop", result: zmapowane[0],
        retrieved_at: new Date().toISOString(), confidence: "unverified-shape" };
  w.uwaga = uwagaKsztalt;
  return w;
}

const pending = (kolejkaId, komunikat) => ({
  status: "ERROR",
  query_type: "pomoc_publiczna",
  source: "sudop",
  detail: "PENDING",
  kolejka_id: kolejkaId,
  komunikat_serwera: komunikat,
  uwaga: "Zlecenie przyjęte przez SUDOP, wynik niegotowy. Wywołaj sudop_odbierz_wynik z kolejka_id " +
    "za kilka minut. Brak wyniku NIE oznacza braku pomocy.",
  retrieved_at: new Date().toISOString(),
});

async function odpytajKolejke(kolejkaId, limitMs) {
  const url = `${SUDOP_HOST}/sudop-api/api/kolejka/${encodeURIComponent(kolejkaId)}`;
  const start = Date.now();
  let komunikat = null;
  for (;;) {
    const resp = await fetch(url, { signal: sygnal(20000) });
    if (!resp.ok) throw new Error(`SUDOP kolejka zwróciła HTTP ${resp.status}`);
    const typ = resp.headers.get("content-type") ?? "";
    if (typ.includes("json")) return { gotowe: true, dane: await resp.json() };
    komunikat = (await resp.text()).slice(0, 200);
    if (Date.now() - start + INTERWAL_MS > limitMs) return { gotowe: false, komunikat };
    await new Promise((r) => setTimeout(r, INTERWAL_MS));
  }
}

async function zlec(nip) {
  const resp = await fetch(`${SUDOP_BASE_URL}?nip-beneficjenta=${encodeURIComponent(nip)}`, {
    redirect: "manual", signal: sygnal(20000),
  });
  if (resp.status === 200 && (resp.headers.get("content-type") ?? "").includes("json")) {
    return { natychmiast: await resp.json() };
  }
  const loc = resp.headers.get("location");
  if (resp.status !== 303 || !loc) throw new Error(`SUDOP: oczekiwano 303 z Location, jest HTTP ${resp.status}`);
  const m = loc.match(/kolejka\/([0-9a-f-]{36})/i);
  if (!m) throw new Error(`SUDOP: nieoczekiwany Location: ${loc}`);
  return { kolejkaId: m[1] };
}

const blad = (err) => ({ status: "ERROR", query_type: "pomoc_publiczna", source: "sudop",
  detail: String(err?.message ?? err), retrieved_at: new Date().toISOString() });
const tekst = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });

server.registerTool(
  "sudop_szukaj_pomocy",
  {
    title: "Pomoc publiczna / de minimis w SUDOP (UOKiK) — zlecenie",
    description:
      "Zleca wyszukanie pomocy publicznej dla NIP beneficjenta. API SUDOP jest asynchroniczne: " +
      "czeka ≤50 s; jeśli wynik niegotowy, zwraca ERROR/PENDING z kolejka_id do sudop_odbierz_wynik.",
    inputSchema: { nip: z.string().regex(/^\d{10}$/).describe("10-cyfrowy NIP beneficjenta pomocy") },
  },
  async ({ nip }) => {
    try {
      const z1 = await zlec(nip);
      if (z1.natychmiast) return tekst(normalizujOdpowiedzSUDOP(z1.natychmiast));
      const r = await odpytajKolejke(z1.kolejkaId, CZEKANIE_MS);
      return tekst(r.gotowe ? normalizujOdpowiedzSUDOP(r.dane) : pending(z1.kolejkaId, r.komunikat));
    } catch (err) { return tekst(blad(err)); }
  }
);

server.registerTool(
  "sudop_odbierz_wynik",
  {
    title: "SUDOP — odbiór wyniku zlecenia z kolejki",
    description: "Odbiera wynik wcześniejszego sudop_szukaj_pomocy po kolejka_id (czeka ≤50 s).",
    inputSchema: { kolejka_id: z.string().uuid().describe("kolejka_id z odpowiedzi PENDING") },
  },
  async ({ kolejka_id }) => {
    try {
      const r = await odpytajKolejke(kolejka_id, CZEKANIE_MS);
      return tekst(r.gotowe ? normalizujOdpowiedzSUDOP(r.dane) : pending(kolejka_id, r.komunikat));
    } catch (err) { return tekst(blad(err)); }
  }
);

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("sudop-mcp-server: nasłuchuję na stdio (MCP)");
}
