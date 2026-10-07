#!/usr/bin/env node
/**
 * eureka-mcp-server.js — serwer MCP dla EUREKA (eureka.mf.gov.pl): interpretacje
 * indywidualne i ogólne, objaśnienia podatkowe, WIS/WIA i pozostałe dokumenty KIS/MF.
 * Schemat odpowiedzi: shared/SCHEMAT-ODPOWIEDZI-MCP.md (FOUND/NOT_FOUND/AMBIGUOUS/ERROR).
 *
 * ✅ ZMIERZONE 2026-09-27k (AUDYT-2026-09-27k) na żywym API — zamyka F-158(b):
 *   POST /api/public/v1/wyszukiwarka/informacje/?size=&page=&sort=  → 200 JSON
 *        {results:[{ID_INFORMACJI,SYG,DT_WYD,TEZA,KATEGORIA_INFORMACJI,STATUS_INFORMACJI}],totalHits}
 *        (sesje 27i/F-158(b) próbowały GET → powłoka SPA/404; wymagany POST z ciałem JSON)
 *   GET  /api/public/v1/informacje/{ID}  → 200, treść w dokument.fields[] {key,value}
 *   GET  /api/public/v1/pozycje-slownika/wyszukiwarka?kodSlownika=STATUS_INFORMACJI
 *        → 27 Aktualna, 28 Robocza, 29 Nieaktualna/Zmieniona/Wygaszona/Archiwalna,
 *          30 Nieaktualna, 33 Usunięta. Status 29 ma 22 328 dokumentów.
 *
 * ⛔ DWA ZABEZPIECZENIA, KTÓRYCH NIE MA konektor konkurencyjny (@matematicsolutions/mcp-eureka 0.2.0):
 *  (1) Filtr SYG dopasowuje PREFIKS: „…678.2026” zwraca „…678.2026.1.WK”. Konkurencja
 *      reklamuje to jako funkcję; przy WERYFIKACJI to fałszywe potwierdzenie. Tu: post-check
 *      tożsamości (orzeczenia-sadowe-v2 Faza 1-S pkt 4) — prefiks nigdy nie daje FOUND.
 *  (2) STATUS_INFORMACJI: konkurencja pobiera kolumnę, ale jej nie używa. Tu: mapowanie na
 *      status_obowiazywania + ostrzeżenie ⛔ dla interpretacji nieaktualnej/zmienionej.
 *
 * Uwaga metodologiczna: interpretacja indywidualna wiąże w sprawie wnioskodawcy; dla innych
 * podmiotów jest argumentem, nie źródłem prawa. Konektor tego nie ocenia — to analiza skilla.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

const BASE = "https://eureka.mf.gov.pl/api/public/v1";
const PORTAL = "https://eureka.mf.gov.pl/informacje/podglad";
const KOLUMNY = ["ID_INFORMACJI", "SYG", "DT_WYD", "TEZA", "KATEGORIA_INFORMACJI", "STATUS_INFORMACJI"];

const STATUS_KOD = { 27: "Aktualna", 28: "Robocza", 29: "Nieaktualna/Zmieniona/Wygaszona/Archiwalna", 30: "Nieaktualna", 33: "Usunięta" };

/** Etykieta (z wyszukiwarki) albo kod (z dokumentu) → schemat status_obowiazywania. */
export function mapujStatus(v) {
  const etykieta = Array.isArray(v) ? v[0] : STATUS_KOD[Number(v)] ?? v;
  if (etykieta === "Aktualna") return { status_obowiazywania: "obowiazuje", status_eureka: etykieta };
  if (typeof etykieta === "string" && /Nieaktualna|Zmieniona|Wygaszona|Archiwalna|Usunięta/.test(etykieta)) {
    return { status_obowiazywania: "uchylony", status_eureka: etykieta };
  }
  return { status_obowiazywania: "nieznany", status_eureka: etykieta ?? null };
}

const normSyg = (s) => String(s ?? "").replace(/\s+/g, "").toUpperCase();
const dzien = (s) => (typeof s === "string" ? s.slice(0, 10) : null);

function pozycja(r) {
  const st = mapujStatus(r.STATUS_INFORMACJI);
  return {
    identyfikator: r.SYG ?? null,
    tytul_lub_nazwa: r.TEZA ?? null,
    kategoria: Array.isArray(r.KATEGORIA_INFORMACJI) ? r.KATEGORIA_INFORMACJI[0] : r.KATEGORIA_INFORMACJI ?? null,
    ...st,
    data_publikacji_lub_wyroku: dzien(r.DT_WYD),
    id_eureka: r.ID_INFORMACJI ?? null,
    url_zrodlowy: r.ID_INFORMACJI ? `${PORTAL}/${r.ID_INFORMACJI}` : null,
  };
}

const OSTRZEZENIE_STATUS = (p) =>
  `⛔ ${p.identyfikator ?? p.id_eureka}: status EUREKA „${p.status_eureka}” — interpretacja NIE jest ` +
  `aktualna (zmieniona, wygaszona lub archiwalna). Nie powołuj jako aktualnego stanowiska organu.`;

/** Kontrola istnienia sygnatury: filtr SYG (prefiksowy) + post-check tożsamości. */
export function normalizujSygnature(raw, sygnatura) {
  const wyniki = raw?.results ?? [];
  const cel = normSyg(sygnatura);
  const zgodne = wyniki.filter((r) => normSyg(r.SYG) === cel).map(pozycja);
  const odrzucone = wyniki.filter((r) => normSyg(r.SYG) !== cel).map((r) => r.SYG);
  const baza = { query_type: "interpretacja", source: "eureka" };
  if (zgodne.length === 0) {
    const w = { status: "NOT_FOUND", ...baza,
      uwaga: "Brak dokumentu o sygnaturze identycznej z podaną. EUREKA nie obejmuje wszystkich " +
        "rozstrzygnięć — brak trafienia nie jest dowodem nieistnienia." };
    if (odrzucone.length) {
      w.odrzucone_post_checkiem = odrzucone.slice(0, 10);
      w.uwaga += ` Filtr SYG dopasował prefiksowo ${odrzucone.length} INNYCH sygnatur — nie są potwierdzeniem podanej.`;
    }
    return w;
  }
  if (zgodne.length > 1) return { status: "AMBIGUOUS", ...baza, kandydaci: zgodne };
  const w = { status: "FOUND", ...baza, result: zgodne[0], retrieved_at: new Date().toISOString(), confidence: "deterministic" };
  if (zgodne[0].status_obowiazywania === "uchylony") w.uwaga = OSTRZEZENIE_STATUS(zgodne[0]);
  if (odrzucone.length) w.odrzucone_post_checkiem = odrzucone.slice(0, 10);
  return w;
}

/** Wyszukiwanie treściowe: zawsze kandydaci; status każdej pozycji jawnie. */
export function normalizujWyszukiwanie(raw) {
  const wyniki = (raw?.results ?? []).map(pozycja);
  const baza = { query_type: "interpretacja", source: "eureka" };
  if (wyniki.length === 0) return { status: "NOT_FOUND", ...baza, uwaga: "Zero trafień nie jest dowodem braku stanowiska organu." };
  const nieakt = wyniki.filter((p) => p.status_obowiazywania === "uchylony").length;
  const w = { status: wyniki.length > 1 ? "AMBIGUOUS" : "FOUND", ...baza, liczba_trafien: raw.totalHits ?? wyniki.length };
  if (wyniki.length > 1) w.kandydaci = wyniki; else { w.result = wyniki[0]; w.retrieved_at = new Date().toISOString(); w.confidence = "candidate-only"; }
  if (nieakt) w.uwaga = `⛔ ${nieakt} z ${wyniki.length} pozycji ma status nieaktualny/zmieniony — patrz pole status_eureka.`;
  return w;
}

function tekstZHtml(html) {
  return String(html ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<\/(p|div|li|h\d)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n\n").trim();
}

/** Dokument po ID: dokument.fields[] → schemat; treść jako tekst, porcjowana. */
export function normalizujDokument(raw, offset = 0, limit = 20000) {
  const pola = Object.fromEntries((raw?.dokument?.fields ?? []).map((f) => [f.key, f.value]));
  if (!pola.ID_INFORMACJI) return { status: "NOT_FOUND", query_type: "interpretacja", source: "eureka" };
  const st = mapujStatus(pola.STATUS_INFORMACJI);
  const tresc = tekstZHtml(pola.TRESC_INTERESARIUSZ ?? pola.TRESC);
  const w = {
    status: "FOUND", query_type: "interpretacja", source: "eureka",
    result: {
      identyfikator: pola.SYG ?? null,
      tytul_lub_nazwa: pola.TEZA ?? null,
      ...st,
      data_publikacji_lub_wyroku: dzien(pola.DT_WYD),
      data_publikacji_w_eureka: dzien(pola.DATA_PUBLIKACJI),
      id_eureka: pola.ID_INFORMACJI,
      url_zrodlowy: `${PORTAL}/${pola.ID_INFORMACJI}`,
      tresc: tresc.slice(offset, offset + limit),
      tresc_offset: offset,
      tresc_dlugosc: tresc.length,
      tresc_kompletna: offset + limit >= tresc.length,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
  if (st.status_obowiazywania === "uchylony") w.uwaga = OSTRZEZENIE_STATUS(w.result);
  if (!w.result.tresc_kompletna) {
    w.uwaga = (w.uwaga ? w.uwaga + " " : "") +
      `Treść porcjowana: ${offset}–${offset + limit} z ${tresc.length} znaków; pobierz resztę z offset=${offset + limit}.`;
  }
  return w;
}

async function http(url, init = {}) {
  let ostatni;
  for (let proba = 1; proba <= 3; proba++) {
    try {
      const resp = await fetch(url, { ...init, headers: { Accept: "application/json", ...(init.headers ?? {}) }, signal: sygnal(15000) /* 2026-10-01: norma <1 s; 3×15 s mieści się w budżecie 50 s */ });
      const typ = resp.headers.get("content-type") ?? "";
      if (!resp.ok) throw new Error(`EUREKA HTTP ${resp.status}`);
      if (!typ.includes("json")) throw new Error(`EUREKA zwróciła ${typ || "brak typu"} zamiast JSON (powłoka SPA?)`);
      return await resp.json();
    } catch (e) { ostatni = e; }
  }
  throw ostatni;
}

// ⚠️ 2026-10-01: tryb frazy jest wrażliwy na szyk („alkohol akcyza” → 8 trafień) — opisane w narzędziu.
// ⛔ POPRAWKA 2026-09-30: searchInFullPhrase:false szuka słów osobno — „akcyza alkohol” dawało
//    3722 trafień posortowanych po dacie (podział spółek, ryczałt…). Portal EUREKA szuka frazy
//    w całości: 454 trafienia, te same co na stronie (pomiar na żywym API, CI 36761874591).
async function szukaj({ filtr = {}, fraza, rozmiar = 10 }) {
  const body = { filter: filtr, columns: KOLUMNY, searchInFullPhrase: Boolean(fraza), searchInContent: false, searchInSynonyms: false, warunkiDodatkowe: [] };
  if (fraza) body.searchQuery = fraza;
  return http(`${BASE}/wyszukiwarka/informacje/?size=${rozmiar}&page=0&sort=DT_WYD%2Cdesc`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

const blad = (e) => ({ status: "ERROR", query_type: "interpretacja", source: "eureka", detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() });
const tekst = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "eureka-connector", version: "1.0.0" }));

server.registerTool("eureka_sprawdz_sygnature", {
  title: "EUREKA — kontrola istnienia sygnatury interpretacji",
  description: "Czy dokument o DOKŁADNIE tej sygnaturze istnieje w EUREKA, i czy jest aktualny. " +
    "Post-check tożsamości: sygnatura ucięta lub podobna nigdy nie daje FOUND.",
  inputSchema: { sygnatura: z.string().min(5).describe("Pełna sygnatura, np. 0112-KDIL1-1.4012.678.2026.1.WK") },
}, async ({ sygnatura }) => {
  try { return tekst(normalizujSygnature(await szukaj({ filtr: { SYG: sygnatura.trim() }, rozmiar: 20 }), sygnatura)); }
  catch (e) { return tekst(blad(e)); }
});

server.registerTool("eureka_szukaj", {
  title: "EUREKA — wyszukiwanie interpretacji i objaśnień",
  description: "Fraza + filtry. Zwraca KANDYDATÓW z jawnym statusem aktualności każdej pozycji. " +
    "Fraza jest szukana W CAŁOŚCI i w podanym SZYKU słów (pomiar 2026-10-01: „akcyza alkohol” 454, „alkohol akcyza” 8) — " +
    "przy małej liczbie trafień spróbuj innego szyku lub krótszej frazy. Pojedyncze słowo daje bardzo szeroki zbiór " +
    "sortowany po dacie (nie po trafności) — zawężaj filtrami. " +
    "kategoria: 1 = interpretacja indywidualna, 3 = ogólna, 11 = objaśnienia podatkowe.",
  inputSchema: {
    fraza: z.string().min(2).describe("Fraza wyszukiwania"),
    kategoria: z.array(z.number().int()).optional().describe("Id kategorii, np. [1]"),
    tylkoAktualne: z.boolean().optional().describe("true → tylko status Aktualna (27)"),
    dataOd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    dataDo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    rozmiar: z.number().int().min(1).max(50).optional(),
  },
}, async ({ fraza, kategoria, tylkoAktualne, dataOd, dataDo, rozmiar }) => {
  const filtr = {};
  if (kategoria?.length) filtr.KATEGORIA_INFORMACJI = kategoria;
  if (tylkoAktualne) filtr.STATUS_INFORMACJI = [27];
  if (dataOd) filtr.DT_WYD_start = dataOd;
  if (dataDo) filtr.DT_WYD_end = dataDo;
  try { return tekst(normalizujWyszukiwanie(await szukaj({ filtr, fraza, rozmiar: rozmiar ?? 10 }))); }
  catch (e) { return tekst(blad(e)); }
});

server.registerTool("eureka_pobierz", {
  title: "EUREKA — pełny dokument po ID",
  description: "Metadane, status aktualności i treść (tekst, porcjowany po 20 000 znaków).",
  inputSchema: {
    id: z.string().regex(/^\d{1,10}$/).describe("id_eureka z wyników wyszukiwania"),
    offset: z.number().int().min(0).optional(),
  },
}, async ({ id, offset }) => {
  try { return tekst(normalizujDokument(await http(`${BASE}/informacje/${id}`), offset ?? 0)); }
  catch (e) { return tekst(blad(e)); }
});

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("eureka-mcp-server: nasłuchuję na stdio (MCP)");
}
