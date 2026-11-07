#!/usr/bin/env node
/**
 * uodo-mcp-server.js — decyzje Prezesa UODO (orzeczenia.uodo.gov.pl). AUDYT-2026-09-27r.
 *
 * Zbudowany od zera (konektor z 27i nie trafił do repozytorium — F-211; konektor konkurencji
 * `uodo-orzeczenia-mcp` niepubliczny: GitHub 404, brak w PyPI). Dostęp ustalony z kodu portalu (27r):
 *  • portal = React Router 7, dane loaderów w formacie turbo-stream pod `<trasa>.data`;
 *  • wyszukiwanie: GET /search.data — parametry z mapy w kodzie portalu: content→q, refName→rn,
 *    status→s, keywords→k, decree→dcr, daty dtas/dtae/dtps/dtpe. ⛔ Nazwy pól formularza (`refName`,
 *    `status`) w adresie są IGNOROWANE — zwracają wszystkie 584 decyzje, także dla fikcyjnej sygnatury;
 *  • `rn` dopasowuje PREFIKSOWO (DKN.5112.1 → 7 decyzji) — kontrola istnienia wymaga post-checku;
 *  • dokument: GET /document/{URN}/content.data → urn, refname, status, dates, body (HTML).
 * ⛔ PRAWOMOCNOŚĆ: status przy dacie „announcement” jest HISTORYCZNY (w dniu ogłoszenia zawsze
 *    „nonfinal”); aktualny stan = pole `status` dokumentu albo OSTATNIE zdarzenie w `dates`
 *    (np. validation:final = uprawomocnienie). Nazwy statusów wg portalu: final = prawomocna,
 *    partly-final = częściowo prawomocna, nonfinal = nieprawomocna, repealed = uchylona.
 *    (27i opisywał to jako „ostateczna” — błędnie: decyzja UODO jest ostateczna od wydania,
 *    prawomocność dotyczy kontroli sądowoadministracyjnej.)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

const B = "https://orzeczenia.uodo.gov.pl";
const TRASA_DOK = "routes/_main.document.($urn).content";
const PRAWOMOCNOSC = { final: "prawomocna", "partly-final": "częściowo prawomocna", nonfinal: "nieprawomocna", repealed: "uchylona", unknown: "status nieznany" };

/** turbo-stream (React Router 7): płaska tablica; obiekt {"_k": v} = klucz arr[k], wartość z indeksu v. */
export function dekodujTurbo(arr) {
  const pam = new Map();
  const SPEC = { "-1": undefined, "-2": undefined, "-3": NaN, "-4": Infinity, "-5": null, "-6": -Infinity, "-7": -0 };
  const d = (i) => {
    if (typeof i !== "number") return i;
    if (i < 0) return SPEC[String(i)];
    if (pam.has(i)) return pam.get(i);
    const v = arr[i];
    if (v === null || typeof v !== "object") { pam.set(i, v); return v; }
    if (Array.isArray(v)) {
      if (v.length === 2 && v[0] === "D") { const w = new Date(v[1]).toISOString(); pam.set(i, w); return w; }
      const out = []; pam.set(i, out); for (const x of v) out.push(d(x)); return out;
    }
    const out = {}; pam.set(i, out);
    for (const [k, w] of Object.entries(v)) out[arr[Number(k.slice(1))]] = d(w);
    return out;
  };
  return d(0);
}

/** Aktualna prawomocność: status dokumentu, a gdy go brak — OSTATNIE zdarzenie w `dates` (nie data ogłoszenia). */
export function prawomocnosc(rekord) {
  if (rekord?.status) return rekord.status;
  const d = [...(rekord?.dates ?? [])].filter((x) => x.date).sort((a, b) => a.date.localeCompare(b.date));
  return d.length ? d[d.length - 1].status : "unknown";
}
const naSchemat = (st) => (st === "final" ? "obowiazuje" : st === "repealed" ? "uchylony" : "nieznany");
const data = (r, use) => (r.dates ?? []).find((x) => x.use === use)?.date ?? null;
const OSTRZEZENIE = {
  nonfinal: "⚠️ Decyzja NIEPRAWOMOCNA — może zostać uchylona przez sąd administracyjny; nie powołuj jako utrwalonego stanowiska organu.",
  "partly-final": "⚠️ Decyzja częściowo prawomocna — sprawdź, której części dotyczy prawomocność.",
  repealed: "⛔ Decyzja UCHYLONA — nie powołuj.",
  unknown: "⚠️ Status prawomocności nieznany.",
};

export function pozycja(r) {
  const st = prawomocnosc(r);
  return { identyfikator: r.refname ?? null, urn: r.refid ?? r.urn ?? null, tytul_lub_nazwa: r.title ?? r.name ?? null,
    prawomocnosc: PRAWOMOCNOSC[st] ?? st, status_obowiazywania: naSchemat(st),
    data_publikacji_lub_wyroku: data(r, "announcement"), data_uprawomocnienia: data(r, "validation"),
    url_zrodlowy: `${B}/document/${r.refid ?? r.urn}/content` };
}
const norm = (s) => String(s ?? "").replace(/\s+/g, "").toUpperCase();

export function normalizujSygnature(wyszukiwanie, sygnatura, dokument = null) {
  const baza = { query_type: "decyzja_uodo", source: "uodo" };
  const items = wyszukiwanie?.items ?? [];
  const zgodne = items.filter((i) => norm(i.refname) === norm(sygnatura));
  const odrzucone = items.filter((i) => norm(i.refname) !== norm(sygnatura)).map((i) => i.refname);
  if (!zgodne.length) {
    const w = { status: "NOT_FOUND", ...baza, uwaga: "Brak decyzji o dokładnie tej sygnaturze w portalu orzeczeń UODO (portal nie obejmuje wszystkich rozstrzygnięć — brak trafienia nie jest dowodem nieistnienia)." };
    if (odrzucone.length) { w.odrzucone_post_checkiem = odrzucone.slice(0, 10); w.uwaga += ` Wyszukiwarka dopasowała prefiksowo ${odrzucone.length} INNYCH sygnatur.`; }
    return w;
  }
  if (zgodne.length > 1) return { status: "AMBIGUOUS", ...baza, kandydaci: zgodne.map(pozycja) };
  const r = pozycja(dokument ? { ...zgodne[0], ...dokument, refid: zgodne[0].refid } : zgodne[0]);
  const w = { status: "FOUND", ...baza, result: r, retrieved_at: new Date().toISOString(), confidence: "deterministic" };
  const st = prawomocnosc(dokument ?? zgodne[0]);
  if (OSTRZEZENIE[st]) w.uwaga = OSTRZEZENIE[st];
  if (odrzucone.length) w.odrzucone_post_checkiem = odrzucone.slice(0, 10);
  return w;
}

export function normalizujWyszukiwanie(wyszukiwanie) {
  const baza = { query_type: "decyzja_uodo", source: "uodo" };
  const items = wyszukiwanie?.items ?? [];
  if (!items.length) return { status: "NOT_FOUND", ...baza, uwaga: "Zero trafień nie jest dowodem braku rozstrzygnięć." };
  const k = items.map((i) => ({ ...pozycja(i), rola: "KANDYDAT" }));
  const nieprawomocne = k.filter((x) => x.prawomocnosc !== "prawomocna").length;
  const w = { status: k.length > 1 ? "AMBIGUOUS" : "FOUND", ...baza, liczba_trafien: Number(wyszukiwanie.itemsCount ?? k.length), strona: wyszukiwanie.pages?.current ?? 1, stron: wyszukiwanie.pages?.total ?? 1 };
  if (k.length > 1) w.kandydaci = k; else { w.result = k[0]; w.confidence = "candidate-only"; w.retrieved_at = new Date().toISOString(); }
  if (nieprawomocne) w.uwaga = `⚠️ ${nieprawomocne} z ${k.length} decyzji nie jest prawomocnych — pole prawomocnosc.`;
  return w;
}

export function tekstZHtml(html) {
  return String(html ?? "").replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<\/(p|div|h\d|li|dd|dt|tr)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n))).replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

export function normalizujDokument(dok, offset = 0, limit = 20000) {
  const baza = { query_type: "decyzja_uodo", source: "uodo" };
  if (!dok?.refname) return { status: "NOT_FOUND", ...baza };
  const t = tekstZHtml(dok.body);
  const r = { ...pozycja(dok), tresc: t.slice(offset, offset + limit), tresc_offset: offset, tresc_dlugosc: t.length, tresc_kompletna: offset + limit >= t.length };
  const st = prawomocnosc(dok);
  const uw = [OSTRZEZENIE[st], r.tresc_kompletna ? null : `Treść porcjowana: pobierz dalej z offset=${offset + limit}.`].filter(Boolean);
  return { status: "FOUND", ...baza, result: r, ...(uw.length ? { uwaga: uw.join(" ") } : {}), retrieved_at: new Date().toISOString(), confidence: "deterministic" };
}

async function pobierzDane(sciezka) {
  let ostatni;
  for (let p = 1; p <= 3; p++) {
    try {
      const r = await fetch(B + sciezka, { signal: sygnal(30000) });
      if (!r.ok) throw new Error(`UODO HTTP ${r.status}`);
      const typ = r.headers.get("content-type") ?? "";
      if (!/script|json/.test(typ)) throw new Error(`UODO zwrócił ${typ} zamiast danych loadera (zmiana portalu?)`);
      return dekodujTurbo(await r.json());
    } catch (e) { ostatni = e; }
  }
  throw ostatni;
}
const szukaj = async (p) => (await pobierzDane(`/search.data?${new URLSearchParams(p)}`))["routes/_main.search"]?.data;
const dokument = async (urn) => (await pobierzDane(`/document/${urn}/content.data`))[TRASA_DOK]?.data;
const blad = (e) => ({ status: "ERROR", query_type: "decyzja_uodo", source: "uodo", detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() });
const odp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "uodo-connector", version: "1.0.0" }));

server.registerTool("uodo_sprawdz_sygnature", {
  title: "UODO — istnienie decyzji Prezesa UODO i jej prawomocność",
  description: "Kontrola istnienia sygnatury (np. DKN.5112.1.2023) z post-checkiem tożsamości (wyszukiwarka dopasowuje prefiksowo) " +
    "i AKTUALNĄ prawomocność z metryki (prawomocna / nieprawomocna / uchylona).",
  inputSchema: { sygnatura: z.string().min(5).max(40) },
}, async ({ sygnatura }) => {
  try {
    const w = await szukaj({ rn: sygnatura.trim() });
    const traf = (w?.items ?? []).filter((i) => norm(i.refname) === norm(sygnatura));
    const dok = traf.length === 1 ? await dokument(traf[0].refid) : null;
    return odp(normalizujSygnature(w, sygnatura, dok ? { status: dok.status, dates: dok.dates } : null));
  } catch (e) { return odp(blad(e)); }
});

server.registerTool("uodo_szukaj", {
  title: "UODO — wyszukiwanie decyzji Prezesa UODO",
  description: "Pełnotekstowo; filtr prawomocności i dat ogłoszenia. Każdy kandydat z aktualną prawomocnością.",
  inputSchema: {
    fraza: z.string().min(2).max(120), prawomocnosc: z.enum(["prawomocna", "nieprawomocna", "czesciowo", "uchylona"]).optional(),
    dataOd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), dataDo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    strona: z.number().int().min(1).max(100).optional(),
  },
}, async ({ fraza, prawomocnosc: pr, dataOd, dataDo, strona }) => {
  try {
    const p = { q: fraza };
    if (pr) p.s = { prawomocna: "final", nieprawomocna: "nonfinal", czesciowo: "partly-final", uchylona: "repealed" }[pr];
    if (dataOd) p.dtas = dataOd; if (dataDo) p.dtae = dataDo; if (strona) p.page = String(strona); // 27r: `p` ignorowany (zmierzone), działa `page`
    return odp(normalizujWyszukiwanie(await szukaj(p)));
  } catch (e) { return odp(blad(e)); }
});

server.registerTool("uodo_pobierz", {
  title: "UODO — treść decyzji",
  description: "Pełna treść decyzji (porcjami po 20 000 znaków) z prawomocnością. Podaj URN albo sygnaturę.",
  inputSchema: { urn_lub_sygnatura: z.string().min(5).max(80), offset: z.number().int().min(0).optional() },
}, async ({ urn_lub_sygnatura: u, offset }) => {
  try {
    let urn = u.trim();
    if (!urn.startsWith("urn:")) {
      const w = await szukaj({ rn: urn }); const t = (w?.items ?? []).filter((i) => norm(i.refname) === norm(urn));
      if (t.length !== 1) return odp(normalizujSygnature(w, urn));
      urn = t[0].refid;
    }
    if (!/^urn:ndoc:gov:pl:uodo:[\w:.-]+$/.test(urn)) throw new Error(`Niepoprawny URN: ${urn}`);
    return odp(normalizujDokument(await dokument(urn), offset ?? 0));
  } catch (e) { return odp(blad(e)); }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("uodo-mcp-server: nasłuchuję na stdio (MCP)");
}
