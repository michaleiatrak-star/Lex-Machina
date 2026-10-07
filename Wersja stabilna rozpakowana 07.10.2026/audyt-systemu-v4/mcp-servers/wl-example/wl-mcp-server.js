#!/usr/bin/env node
/**
 * wl-mcp-server.js — Wykaz podatników VAT („biała lista”, wl-api.mf.gov.pl). AUDYT-2026-09-27s; zamyka F-211.
 *
 * Zmierzone 27s na żywym API:
 *  • `date` OBOWIĄZKOWY (bez niego HTTP 400 WL-190);
 *  • NIP spoza wykazu → HTTP 200 z `subject: null` (nie 404) — ale z `requestId`: to też dowód sprawdzenia;
 *  • check/nip/{nip}/bank-account/{nrb} → accountAssigned TAK/NIE + requestId; rachunek z błędną sumą
 *    kontrolną → HTTP 400 WL-111, zła długość → WL-109 — walidacja mod 97 lokalnie, zanim zużyje się zapytanie;
 *  • podmioty z `hasVirtualAccounts: true` (GUS, Orange) — sama lista `accountNumbers` NIE wystarcza do
 *    sprawdzenia rachunku; właściwą drogą jest endpoint check (nie porównanie z listą);
 *  • API nie podaje limitów w nagłówkach.
 * `requestId` + `requestDateTime` zwracane jako `dowod_sprawdzenia` — do zachowania w aktach.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany, BlokadaBotow } from "../wspolne/budzet.mjs";

const B = "https://wl-api.mf.gov.pl/api";
// Oficjalna wyszukiwarka wykazu (Ministerstwo Finansów); podatnik.info to serwis prywatny.
export const WL_WYSZUKIWARKA = "https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka";
const dzis = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date());

export function nipPoprawny(nip) {
  const n = String(nip).replace(/[\s-]/g, "");
  if (!/^\d{10}$/.test(n)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  return w.reduce((s, x, i) => s + x * Number(n[i]), 0) % 11 === Number(n[9]);
}
export function nrbPoprawny(nrb) {
  const n = String(nrb).replace(/[\s-]/g, "").replace(/^PL/i, "");
  return /^\d{26}$/.test(n) && BigInt(n.slice(2) + "2521" + n.slice(0, 2)) % 97n === 1n;
}
const dowod = (r) => ({ requestId: r?.requestId ?? null, requestDateTime: r?.requestDateTime ?? null });
const STATUS = { Czynny: "obowiazuje", Zwolniony: "obowiazuje", Niezarejestrowany: "uchylony" };

export function normalizujPodmiot(raw, nip, data) {
  const baza = { query_type: "podatnik_vat", source: "biala-lista-vat" };
  const r = raw?.result;
  if (!r) return { status: "ERROR", ...baza, detail: raw?.message ?? "Nieoczekiwana odpowiedź API", kod: raw?.code ?? null };
  const s = r.subject;
  if (!s) return { status: "NOT_FOUND", ...baza, dowod_sprawdzenia: dowod(r),
    uwaga: `Podmiot o NIP ${nip} nie figuruje w wykazie podatników VAT na dzień ${data}. requestId potwierdza sprawdzenie — zachowaj go.` };
  const rach = s.accountNumbers ?? [];
  const w = { status: "FOUND", ...baza,
    result: { identyfikator: `NIP ${s.nip}`, tytul_lub_nazwa: s.name, status_vat: s.statusVat,
      status_obowiazywania: STATUS[s.statusVat] ?? "nieznany", regon: s.regon ?? null, krs: s.krs ?? null,
      adres: s.workingAddress ?? s.residenceAddress ?? null, data_publikacji_lub_wyroku: data,
      data_rejestracji_vat: s.registrationLegalDate ?? null, data_wykreslenia: s.removalDate ?? null, podstawa_wykreslenia: s.removalBasis ?? null,
      liczba_rachunkow: rach.length, rachunki: rach.slice(0, 20), ma_rachunki_wirtualne: s.hasVirtualAccounts === true,
      url_zrodlowy: WL_WYSZUKIWARKA },
    dowod_sprawdzenia: dowod(r), retrieved_at: new Date().toISOString(), confidence: "deterministic" };
  const uw = [];
  if (s.statusVat !== "Czynny") uw.push(`⚠️ Status VAT: ${s.statusVat}${s.removalDate ? ` (wykreślony ${s.removalDate}${s.removalBasis ? `, ${s.removalBasis}` : ""})` : ""}.`);
  if (s.hasVirtualAccounts) uw.push("Podmiot ma rachunki wirtualne — rachunek sprawdzaj narzędziem wl_sprawdz_rachunek, nie przez porównanie z listą.");
  if (rach.length > 20) uw.push(`Pokazano 20 z ${rach.length} rachunków.`);
  if (uw.length) w.uwaga = uw.join(" ");
  return w;
}

export function normalizujRachunek(raw, nip, nrb, data) {
  const baza = { query_type: "rachunek_vat", source: "biala-lista-vat" };
  const r = raw?.result;
  if (!r) return { status: "ERROR", ...baza, detail: raw?.message ?? "Nieoczekiwana odpowiedź API", kod: raw?.code ?? null };
  const res = { identyfikator: `NIP ${nip} / rachunek …${String(nrb).slice(-4)}`, rachunek_na_liscie: r.accountAssigned === "TAK",
    data_publikacji_lub_wyroku: data, url_zrodlowy: WL_WYSZUKIWARKA };
  if (r.accountAssigned === "TAK") return { status: "FOUND", ...baza, result: res, dowod_sprawdzenia: dowod(r), retrieved_at: new Date().toISOString(), confidence: "deterministic" };
  return { status: "NOT_FOUND", ...baza, result: res, dowod_sprawdzenia: dowod(r),
    uwaga: `⚠️ Rachunek NIE jest przypisany do NIP ${nip} w wykazie na dzień ${data} (odpowiedź API: ${r.accountAssigned}). requestId — zachowaj jako dowód sprawdzenia.` };
}

async function api(sciezka) {
  let ostatni;
  for (let p = 1; p <= 3; p++) {
    try {
      const r = await fetch(`${B}/${sciezka}`, { signal: sygnal(20000) });
      const d = await r.json();
      if (r.status === 400 || r.ok) return d; // 400 = błąd merytoryczny z kodem WL-xxx — nie ponawiamy
      throw new Error(`Biała lista HTTP ${r.status}`);
    } catch (e) {
      ostatni = e;
      if (e instanceof BlokadaBotow) break; // strona weryfikacji przeglądarki: ponowienie nic nie da
    }
  }
  throw ostatni;
}
const blad = (q, m) => ({ status: "ERROR", query_type: q, source: "biala-lista-vat", detail: m,
  ...(/ochrona przed botami/.test(m) ? { url_wyszukiwarki: WL_WYSZUKIWARKA } : {}), retrieved_at: new Date().toISOString() });
const odp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const DATA = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("dzień, na który sprawdzasz (domyślnie dziś, czas warszawski)");
const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "wl-connector", version: "1.0.0" }));

server.registerTool("wl_sprawdz_nip", {
  title: "Biała lista VAT — status podatnika i rachunki",
  description: "Status VAT (Czynny / Zwolniony / Niezarejestrowany), dane rejestrowe, rachunki z wykazu i requestId (dowód sprawdzenia) na wskazany dzień.",
  inputSchema: { nip: z.string().min(10).max(13), data: DATA },
}, async ({ nip, data }) => {
  const n = nip.replace(/[\s-]/g, ""); const d = data ?? dzis();
  if (!nipPoprawny(n)) return odp(blad("podatnik_vat", `NIP ${nip} ma niepoprawną sumę kontrolną — nie wysłano zapytania.`));
  try { return odp(normalizujPodmiot(await api(`search/nip/${n}?date=${d}`), n, d)); }
  catch (e) { return odp(blad("podatnik_vat", String(e?.message ?? e))); }
});

server.registerTool("wl_sprawdz_rachunek", {
  title: "Biała lista VAT — czy rachunek jest przypisany do NIP",
  description: "Właściwa kontrola rachunku kontrahenta (uwzględnia rachunki wirtualne — w odróżnieniu od porównania z listą). " +
    "TAK → FOUND, NIE → NOT_FOUND; zawsze z requestId do zachowania w aktach.",
  inputSchema: { nip: z.string().min(10).max(13), rachunek: z.string().min(26).max(40), data: DATA },
}, async ({ nip, rachunek, data }) => {
  const n = nip.replace(/[\s-]/g, ""), r = rachunek.replace(/[\s-]/g, "").replace(/^PL/i, ""), d = data ?? dzis();
  if (!nipPoprawny(n)) return odp(blad("rachunek_vat", `NIP ${nip} ma niepoprawną sumę kontrolną — nie wysłano zapytania.`));
  if (!nrbPoprawny(r)) return odp(blad("rachunek_vat", "Numer rachunku ma niepoprawną sumę kontrolną lub długość (NRB: 26 cyfr) — nie wysłano zapytania."));
  try { return odp(normalizujRachunek(await api(`check/nip/${n}/bank-account/${r}?date=${d}`), n, r, d)); }
  catch (e) { return odp(blad("rachunek_vat", String(e?.message ?? e))); }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("wl-mcp-server: nasłuchuję na stdio (MCP)");
}
