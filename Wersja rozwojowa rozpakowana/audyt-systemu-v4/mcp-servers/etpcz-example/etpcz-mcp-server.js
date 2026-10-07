#!/usr/bin/env node
/**
 * etpcz-mcp-server.js — orzecznictwo Europejskiego Trybunału Praw Człowieka w bazie Ministerstwa
 * Sprawiedliwości (etpcz.ms.gov.pl; tłumaczenia i streszczenia po polsku). 2026-10-06.
 *
 * Mechanika (silnik Portalu Orzeczeń, jak orzeczenia.ms.gov.pl; formularz zmierzony w G40B 2026-10-06:
 *  POST /searchetpc.advancedsearchform, pola complaintNumber, phrase, complainant, selecty type/sentenceYear/complaintCountry):
 *  • Linki STAŁE: treść /etpccontent/$N/{docId}, metryka /detailsetpc/$N/{docId};
 *    docId: 990000000000001_I_ETPC_{nr skargi, 6 cyfr}_{20RR}_{Wy|De|…}_{data}_{nr},
 *    np. skarga 43447/19 → …_ETPC_043447_2019_Wy_2021-07-22_001 (rok zawsze „20”+RR: 34503/97 → 2097).
 *  • Wyszukiwanie: formularz wyszukiwarki odczytywany ze strony (pola i akcja z HTML, nie stałe);
 *    trafienia = odnośniki /detailsetpc/$N/{docId}; numer skargi kontrolowany po docId.
 * Orzeczenie ETPCz to materiał orzeczniczy (Konwencja), nie źródło brzmienia przepisu polskiego (ELI);
 * źródłem pierwotnym orzeczeń ETPCz jest HUDOC — baza MS zawiera wybrane orzeczenia.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer } from "../wspolne/budzet.mjs";
import { formularze, daneFormularza } from "../wspolne/formularz.mjs";

const HOST = "https://etpcz.ms.gov.pl";
// Silnik portalu odrzuca łańcuch przeglądarki (502 w Portalu Orzeczeń) — neutralny UA.
const UA = "LexMachina-etpcz/1.0 (+https://github.com/michaleiatrak-star/Lex-machina-aplikacja)";
const PORCJA = 20000;
const RODZAJ = { Wy: "wyrok", De: "decyzja", Po: "postanowienie", Op: "opinia doradcza" };

/** „43447 / 19”, „nr 43447/2019” → { nr: "43447", rr: "19" }; null, gdy to nie numer skargi. */
export function numerSkargi(s) {
  const m = /(?:^|[^\d])(\d{1,6})\s*\/\s*(\d{2}|\d{4})(?!\d)/.exec(String(s ?? "").normalize("NFKC"));
  return m ? { nr: String(Number(m[1])), rr: m[2].slice(-2) } : null;
}

/** Fragment docId dla numeru skargi: 43447/19 → „ETPC_043447_2019”. */
export const kluczSkargi = ({ nr, rr }) => `ETPC_${nr.padStart(6, "0")}_20${rr}`;

/** docId → numer skargi, rodzaj, data. Czysta funkcja. */
export function rozbierzDocId(docId) {
  const m = /_ETPC_(\d{6})_\d{2}(\d{2})_([A-Za-z]{2})_(\d{4}-\d{2}-\d{2})_\d+$/.exec(String(docId ?? ""));
  if (!m) return { docId };
  return { docId, numer_skargi: `${Number(m[1])}/${m[2]}`, rodzaj: RODZAJ[m[3]] ?? m[3], data: m[4] };
}

export const urlTresci = (docId) => `${HOST}/etpccontent/$N/${docId}`;
export const urlMetryki = (docId) => `${HOST}/detailsetpc/$N/${docId}`;

export function dozwolonyHost(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.toLowerCase() === "etpcz.ms.gov.pl";
  } catch {
    return false;
  }
}

/** Id dokumentu z linku do treści/metryki albo samo id. */
export function docIdZ(s) {
  const t = String(s ?? "").trim();
  const m = /\/(?:etpccontent|detailsetpc)\/\$N\/([A-Za-z0-9_.-]{10,120})/.exec(t);
  if (m) return m[1];
  return /^\d{10,20}_I_ETPC_[A-Za-z0-9_.-]+$/.test(t) ? t : null;
}

const ENCJE = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const dekoduj = (t) => String(t ?? "")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ENCJE[n.toLowerCase()] ?? m);
export const tekst = (html) => dekoduj(String(html ?? "")
  .replace(/<(script|style|head|nav|footer)[\s\S]*?<\/\1>/gi, "")
  .replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|tr|h\d)>/gi, "\n").replace(/<[^>]+>/g, " "))
  .split("\n").map((l) => l.replace(/[ \t ]+/g, " ").trim()).filter(Boolean).join("\n");

/**
 * Formularz wyszukiwarki ze strony: akcja, metoda, pola ukryte, pole numeru skargi i pole frazy
 * (rozpoznane po nazwie/id/etykiecie), przycisk. Czysta funkcja; null, gdy brak pola tekstowego.
 */
export function formularzWyszukiwarki(html, baza = HOST + "/") {
  const formy = formularze(html, baza).map((f) => {
    // Pomiar G40B 2026-10-06: complaintNumber = numer skargi, complainant = skarżący, phrase = fraza.
    const numer = f.tekstowe.find((p) => /complaint.?number|application.?number|numer|number|skarg|sygn|\bnr\b/i.test(p.opis) && !/^complainant$/i.test(p.nazwa))?.nazwa ?? null;
    const fraza = f.tekstowe.find((p) => p.nazwa !== numer && /fraz|tre[sś]|text|s[lł]ow|query|phrase|keyword|szukaj|search|q\b/i.test(p.opis))?.nazwa
      ?? f.tekstowe.find((p) => p.nazwa !== numer)?.nazwa ?? null;
    return { akcja: f.akcja, metoda: f.metoda, pola: f.pola, pary: f.pary, poleNumeru: numer, poleFrazy: fraza, przycisk: f.przycisk, pola_tekstowe: f.tekstowe.map((p) => p.nazwa) };
  });
  // Pierwszeństwo: formularz z polem numeru skargi, potem pierwszy z polem tekstowym.
  return formy.find((f) => f.poleNumeru) ?? formy[0] ?? null;
}

/** Strona wyników → liczba (gdy podana) i id dokumentów bez powtórzeń. Czysta funkcja. */
export function parsujWyniki(html) {
  const t = String(html ?? "");
  if (/Nie znaleziono żadnego wyniku|Nie znaleziono zadnego wyniku/i.test(t)) return { liczba: 0, docIds: [] };
  const liczbaTxt = /class="big_number"[^>]*>\s*([\d\s ]+)</.exec(t)?.[1];
  const docIds = [...new Set([...t.matchAll(/\/(?:detailsetpc|etpccontent)\/\$N\/([A-Za-z0-9_.-]{10,120})/g)].map((m) => m[1]))];
  return { liczba: liczbaTxt ? Number(liczbaTxt.replace(/[\s ]/g, "")) : null, docIds };
}

async function pobierz(url, init = {}) {
  const r = await fetch(url, { ...init, signal: sygnal(30000), headers: { "User-Agent": UA, Accept: "text/html,*/*", "Accept-Language": "pl-PL,pl;q=0.9", ...(init.headers ?? {}) } });
  const t = await r.text();
  if (!r.ok) throw new Error(`etpcz.ms.gov.pl HTTP ${r.status}`);
  return { t, url: r.url || url, ciastka: (r.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]) };
}

/** Wyszukiwarka: strona główna (formularz) → wysłanie z numerem skargi albo frazą → id dokumentów. */
async function szukaj({ numer, fraza }) {
  const start = await pobierz(HOST + "/");
  const forma = formularzWyszukiwarki(start.t, start.url);
  if (!forma) throw new Error("etpcz.ms.gov.pl: nie rozpoznano formularza wyszukiwarki (zmiana strony?)");
  const pole = numer ? (forma.poleNumeru ?? forma.poleFrazy) : forma.poleFrazy;
  if (!pole) throw new Error(`etpcz.ms.gov.pl: formularz bez pola ${numer ? "numeru skargi" : "frazy"} (pola: ${forma.pola_tekstowe.join(", ")})`);
  const dane = daneFormularza(forma, { [pole]: numer ?? fraza });
  const naglowki = { Referer: start.url, ...(start.ciastka.length ? { Cookie: start.ciastka.join("; ") } : {}) };
  const wynik = forma.metoda === "post"
    ? await pobierz(forma.akcja, { method: "POST", body: dane.toString(), lexPowtarzalne: true, headers: { ...naglowki, "Content-Type": "application/x-www-form-urlencoded" } })
    : await pobierz(`${forma.akcja.split("?")[0]}?${dane}`, { headers: naglowki });
  return { ...parsujWyniki(wynik.t), forma: { akcja: forma.akcja, metoda: forma.metoda, pole } };
}

const baza = { source: "etpcz.ms.gov.pl", query_type: "orzeczenie" };
const NOTA = "Baza MS zawiera wybrane orzeczenia ETPCz (polskie tłumaczenia/streszczenia); źródłem jest link do treści " +
  "(url_orzeczenia, stały). Brak trafienia ≠ brak orzeczenia — pełny zbiór: HUDOC (hudoc.echr.coe.int).";
const odp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const blad = (e) => ({ status: "ERROR", ...baza, detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() });
const pozycja = (docId) => ({ ...rozbierzDocId(docId), url_orzeczenia: urlTresci(docId), url_metryki: urlMetryki(docId), portal: "etpcz.ms.gov.pl" });

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "etpcz-connector", version: "1.0.0" }));

server.registerTool("etpcz_szukaj", {
  title: "Szukaj orzeczeń ETPCz (baza MS)",
  description: "Orzeczenia Europejskiego Trybunału Praw Człowieka w bazie Ministerstwa Sprawiedliwości (etpcz.ms.gov.pl): " +
    "po numerze skargi (np. 43447/19 — dokładna kontrola) albo po frazie. Zwraca stałe linki do treści (url_orzeczenia); " +
    "treść czytaj etpcz_pobierz. Baza zawiera wybrane orzeczenia — brak trafienia ≠ brak orzeczenia (pełny zbiór: HUDOC).",
  inputSchema: {
    numer_skargi: z.string().max(30).optional().describe("np. 43447/19"),
    fraza: z.string().min(2).max(200).optional().describe("słowo kluczowe lub fragment, gdy brak numeru skargi"),
  },
}, async ({ numer_skargi, fraza }) => {
  const skarga = numer_skargi ? numerSkargi(numer_skargi) : null;
  if (numer_skargi && !skarga) return odp({ status: "ERROR", ...baza, detail: `„${numer_skargi}” nie ma postaci numeru skargi (np. 43447/19).` });
  if (!skarga && !fraza) return odp({ status: "ERROR", ...baza, detail: "Podaj numer_skargi albo fraza." });
  try {
    const w = await szukaj(skarga ? { numer: `${skarga.nr}/${skarga.rr}` } : { fraza });
    const ids = skarga ? w.docIds.filter((id) => id.includes(kluczSkargi(skarga))) : w.docIds;
    if (!ids.length) {
      return odp({ status: "OUT_OF_SCOPE", ...baza, ...(skarga ? { numer_skargi: `${skarga.nr}/${skarga.rr}` } : { fraza }), liczba_trafien: w.liczba ?? 0,
        ...(skarga && w.docIds.length ? { odrzucone: w.docIds.slice(0, 10).map((id) => rozbierzDocId(id).numer_skargi ?? id) } : {}),
        uwaga: `Brak trafienia w bazie MS. ${NOTA}`, retrieved_at: new Date().toISOString() });
    }
    return odp({ status: skarga && ids.length === 1 ? "FOUND" : "AMBIGUOUS", ...baza, ...(skarga ? { numer_skargi: `${skarga.nr}/${skarga.rr}` } : { fraza }),
      liczba_trafien: skarga ? ids.length : (w.liczba ?? ids.length),
      ...(skarga && ids.length === 1 ? { result: pozycja(ids[0]) } : { kandydaci: ids.map(pozycja) }),
      uwaga: (skarga ? "" : "Kandydaci po frazie — przed powołaniem przeczytaj treść (etpcz_pobierz). ") + NOTA,
      retrieved_at: new Date().toISOString(), ...(skarga ? { confidence: "deterministic" } : {}) });
  } catch (e) { return odp(blad(e)); }
});

server.registerTool("etpcz_pobierz", {
  title: "Pobierz orzeczenie ETPCz (baza MS)",
  description: "Treść orzeczenia spod stałego linku etpcz.ms.gov.pl (/etpccontent/$N/{id}) albo po id dokumentu; porcjami po 20 000 znaków (offset). " +
    "Z numerem_skargi — kontrola, że dokument dotyczy tej skargi.",
  inputSchema: {
    url_lub_id: z.string().min(10).max(400).describe("link z etpcz.ms.gov.pl albo id dokumentu"),
    numer_skargi: z.string().max(30).optional(),
    offset: z.number().int().min(0).optional(),
  },
}, async ({ url_lub_id, numer_skargi, offset = 0 }) => {
  const docId = docIdZ(url_lub_id);
  if (!docId) return odp({ status: "ERROR", ...baza, detail: "Podaj link z etpcz.ms.gov.pl (/etpccontent/$N/… albo /detailsetpc/$N/…) albo id dokumentu." });
  const skarga = numer_skargi ? numerSkargi(numer_skargi) : null;
  if (skarga && !docId.includes(kluczSkargi(skarga))) {
    return odp({ status: "MISMATCH", ...baza, url_orzeczenia: urlTresci(docId), oczekiwana: `${skarga.nr}/${skarga.rr}`,
      uwaga: "Dokument pod tym id dotyczy innej skargi." });
  }
  try {
    const calosc = tekst((await pobierz(urlTresci(docId))).t);
    if (calosc.length < 40) return odp({ status: "NOT_FOUND", ...baza, url_orzeczenia: urlTresci(docId), uwaga: "Strona nie zawiera treści orzeczenia." });
    const czesc = calosc.slice(offset, offset + PORCJA);
    return odp({ status: "FOUND", ...baza, confidence: "deterministic",
      result: { ...pozycja(docId), tresc: czesc, tresc_offset: offset, tresc_dlugosc: calosc.length, tresc_kompletna: offset + czesc.length >= calosc.length },
      uwaga: NOTA, retrieved_at: new Date().toISOString() });
  } catch (e) { return odp(blad(e)); }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("etpcz-mcp-server: nasłuchuję na stdio (MCP)");
}
