#!/usr/bin/env node
/**
 * cbosa-mcp-server.js — CBOSA (orzeczenia.nsa.gov.pl): NSA i WSA.
 *
 * PORT 1:1 parsera referencyjnego `orzeczenia-sadowe-v2/tools/cbosa_parser.py` (kontrakt
 * `shared/CBOSA-ADAPTER.md`): unikalne /doc/{ID}, licznik „Znaleziono N orzeczeń”, paginacja
 * /cbo/find?p=N w tej samej sesji, exact-match sygnatury z odrzuceniem near-match, kontrola
 * transportu, FAIL-CLOSED przy zmianie HTML. Równoważność z Pythonem: test_normalizacja.mjs (równoważność z Pythonem).
 *
 * Statusy (preferencja użytkownika: „NSA/WSA: snapshot 🟨 bez awansu, brak trafień = OUT_OF_SCOPE”):
 *   FOUND/AMBIGUOUS → snapshot 🟨, awans: false;  0 wyników i fail-closed → status OUT_OF_SCOPE + powód
 *   (27o: wprost w `status` — kontrakt SYGNATURY.md; NOT_FOUND oznaczałoby „prawdopodobnie zmyśloną”);
 *   awaria sieci → ERROR (= kanał niedostępny).
 *
 * ⚠️ AUDYT-2026-09-27m: z sandboxa Claude CBOSA NIEOSIĄGALNA (brama egress: „upstream connect
 *    error… remote connection failure” → 503; TLS kończy się na certyfikacie bramy). Warstwa
 *    HTTP (sesja, przekierowania, cookies) NIEZMIERZONA na żywo — test_na_zywo.mjs z sieci
 *    użytkownika rozstrzyga (F-213). Parser zweryfikowany różnicowo względem Pythona.
 *
 * Źródło porównawcze: cbosa-mcp (ChatGPT, Python) — ten sam kontrakt HTTP; odrzucony jako baza:
 * parser nie wyciąga Sygnatury/Daty/Sądu nawet z własnej próbki, próbki wymyślone (126/391 B),
 * brak exact-match, błąd paginacji (page=0 nie stronicuje, page>0 dubluje stronę 1).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany, pozostalyBudzet, opisBleduSieci } from "../wspolne/budzet.mjs";

const BASE = "https://orzeczenia.nsa.gov.pl";
const HOST = "orzeczenia.nsa.gov.pl";
const DOC_ID_RE = /^[A-Z0-9]{10}$/i;
const TOTAL_RE = /Znaleziono\s+(\d+)\s+orzecze(?:ń|nia|nie)/i;
const LIMIT_STRON = 20; // limit bezpieczeństwa paginacji (200 wyników) — powyżej fail-closed

// ── pomocnicze: encje HTML i tokenizacja ─────────────────────────────────────────────────
const ENCJE = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
export function unescapeHtml(s) {
  return String(s ?? "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENCJE[e.toLowerCase()] ?? m;
  });
}
function* tokeny(html) {
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?)>|([^<]+|<)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("<!--")) continue;
    if (m[5] !== undefined) { yield { typ: "tekst", tekst: unescapeHtml(m[5]) }; continue; }
    const atr = {};
    for (const a of m[3].matchAll(/([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
      atr[a[1].toLowerCase()] = unescapeHtml(a[2] ?? a[3] ?? a[4] ?? "");
    }
    yield { typ: m[1] ? "koniec" : m[4] ? "pusty" : "start", tag: m[2].toLowerCase(), atr };
  }
}
const klasy = (atr) => new Set((atr.class ?? "").split(/\s+/).filter(Boolean));
const klucz = (k) => (k.size === 1 ? [...k][0] : [...k].sort().join(" "));

class Zbieracz { // _TextCollector
  constructor() { this.cz = []; }
  add(d) { this.cz.push(d); }
  newline() { this.cz.push("\n"); }
  text() {
    const raw = this.cz.join("");
    return raw.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n").trim();
  }
}

// ── parser wyników i dokumentu (odpowiedniki _SearchParser / _DocumentParser) ─────────────
export function extractDocIds(html) {
  const out = [], widz = new Set();
  // Sekcja „powiązane” (span.powiazane) nie należy do listy wyników (PR #84): jej linki nie są
  // kandydatami, więc nie ma po co pobierać tych dokumentów.
  let powiazane = 0;
  for (const t of tokeny(html)) {
    if (t.tag === "span") {
      if (t.typ === "start" && (powiazane > 0 || klasy(t.atr).has("powiazane"))) { powiazane += 1; continue; }
      if (t.typ === "koniec" && powiazane > 0) { powiazane -= 1; continue; }
    }
    if (powiazane > 0) continue;
    if (t.typ === "koniec" || t.tag !== "a") continue;
    const m = (t.atr.href ?? "").match(/^\/doc\/([A-Z0-9]{10})\/?$/i);
    if (m && !widz.has(m[1].toUpperCase())) { widz.add(m[1].toUpperCase()); out.push(m[1].toUpperCase()); }
  }
  return out;
}
export function extractTotal(html) {
  const m = unescapeHtml(html).match(TOTAL_RE);
  return m ? Number(m[1]) : null;
}
export function normalizeCaseNumber(s) {
  return unescapeHtml(s ?? "").replace(/\u00a0/g, " ").trim().toUpperCase()
    .replace(/\./g, "").replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/");
}
function sygnaturaZTytulu(title) {
  if (!title) return null;
  const head = title.split(/\s+-\s+(?=(?:Wyrok|Postanowienie|Uchwała)\b)/i)[0];
  return head !== title ? normalizeCaseNumber(head) || null : null;
}

function parsujDokumentSurowo(html) {
  const s = { title: new Zbieracz(), inTitle: false, tabela: {}, sekcje: {}, tdKl: null, td: new Zbieracz(),
    divKl: null, div: new Zbieracz(), etykTab: null, etykSek: null, glab: 0, sekcja: null,
    htmlEnd: false, bodyEnd: false, widzSent: false, widzUzas: false,
    // CBOSA zagnieżdża tabelę w komórce wartości („Data orzeczenia”: data | „orzeczenie prawomocne”);
    // wewnętrzne komórki należą do wartości zewnętrznej. Wcześniej gubiły datę: „brak pól Data orzeczenia”.
    tdZagn: 0 };
  const nl = () => { if (s.tdKl) s.td.newline(); if (s.divKl) s.div.newline(); };
  for (const t of tokeny(html)) {
    if (t.typ === "tekst") {
      if (s.glab > 0 && s.sekcja) { s.sekcja.add(t.tekst); continue; }
      if (s.inTitle) s.title.add(t.tekst);
      if (s.tdKl !== null) s.td.add(t.tekst);
      if (s.divKl !== null) s.div.add(t.tekst);
      continue;
    }
    const tag = t.tag;
    if (t.typ === "pusty" && tag === "br") { if (s.glab > 0 && s.sekcja) s.sekcja.newline(); nl(); continue; }
    if (t.typ === "start" || t.typ === "pusty") {
      const k = klasy(t.atr);
      if (tag === "title") { s.inTitle = true; continue; }
      if (tag === "td") {
        if (s.tdKl !== null) { s.tdZagn += 1; s.td.add(" "); continue; }
        s.tdKl = klucz(k); s.td = new Zbieracz(); continue;
      }
      if (tag === "div") { s.divKl = klucz(k); s.div = new Zbieracz(); continue; }
      if (tag === "span" && k.has("info-list-value-uzasadnienie") && s.etykSek) { s.glab = 1; s.sekcja = new Zbieracz(); continue; }
      if (s.glab > 0) {
        if (tag === "br") { if (s.sekcja) s.sekcja.newline(); continue; }
        if (["img", "hr", "meta", "link", "input"].includes(tag)) continue;
        s.glab += 1;
        if (["p", "div", "li", "tr"].includes(tag) && s.sekcja) s.sekcja.newline();
      } else if (tag === "br" || tag === "p") nl();
      continue;
    }
    // koniec
    if (tag === "html") s.htmlEnd = true; else if (tag === "body") s.bodyEnd = true;
    if (tag === "title") { s.inTitle = false; continue; }
    if (s.glab > 0) {
      s.glab -= 1;
      if (s.glab === 0 && s.sekcja) {
        const et = (s.etykSek ?? "").trim(), w = s.sekcja.text();
        if (et && w) s.sekcje[et] = w;
        s.sekcja = null; s.etykSek = null;
      } else if (["p", "div", "li", "tr"].includes(tag) && s.sekcja) s.sekcja.newline();
      continue;
    }
    if (tag === "td" && s.tdZagn > 0) { s.tdZagn -= 1; s.td.add(" "); continue; }
    if (tag === "td" && s.tdKl !== null) {
      const tx = s.td.text(), k = new Set(s.tdKl.split(" "));
      // Etykieta bywa też zagnieżdżona: td.info-list-label > table > td.lista-label (pomiar na żywo,
      // PR #84) — wcześniej ginęła razem z wartością pola („Sąd”, „Data orzeczenia” = null).
      if (k.has("lista-label") || k.has("info-list-label")) s.etykTab = tx;
      else if (k.has("info-list-value") && s.etykTab) { s.tabela[s.etykTab] = tx; s.etykTab = null; }
      s.tdKl = null; s.td = new Zbieracz(); continue;
    }
    if (tag === "div" && s.divKl !== null) {
      const tx = s.div.text(), k = new Set(s.divKl.split(" "));
      if (k.has("lista-label") && (tx === "Sentencja" || tx === "Uzasadnienie")) {
        s.etykSek = tx; if (tx === "Sentencja") s.widzSent = true; else s.widzUzas = true;
      }
      s.divKl = null; s.div = new Zbieracz();
    }
  }
  return s;
}

/** Odczyt pola tabeli z tolerancją etykiety: wprost, z dwukropkiem, oraz po normalizacji
 * (bez końcowego „:”, bez spacji, bez wielkości liter) — i po liście synonimów. */
function poleTabeli(tabela, etykiety) {
  for (const e of etykiety) {
    if (tabela[e]) return tabela[e];
    if (tabela[`${e}:`]) return tabela[`${e}:`];
  }
  const want = new Set(etykiety.map((e) => e.toLowerCase()));
  for (const [k, v] of Object.entries(tabela)) {
    if (v && want.has(k.replace(/:\s*$/, "").trim().toLowerCase())) return v;
  }
  return null;
}

/** Odpowiednik parse_cbosa_document. KOTWICE poprawności (fail-closed): sygnatura, Sentencja,
 * zamknięty BODY/HTML. „Sąd”/„Data orzeczenia” są BEST-EFFORT — ich brak (inny układ karty)
 * nie przekreśla odczytu treści; zwracamy je jako null z listą `brak_metadanych` (zgł. 2026-10-07:
 * karta bez pól „Sąd, Data orzeczenia” dawała fałszywe OUT_OF_SCOPE mimo realnego orzeczenia). */
export function parsujDokument(html, docId) {
  const id = String(docId).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!DOC_ID_RE.test(id)) throw new Error(`Nieprawidłowy CBOSA doc_id: ${docId}`);
  const s = parsujDokumentSurowo(html);
  let syg = sygnaturaZTytulu(s.title.text()) || poleTabeli(s.tabela, ["Sygnatura", "Sygnatura akt"]);
  if (!syg) throw new Error(`Brak sygnatury w dokumencie CBOSA ${id}`);
  syg = normalizeCaseNumber(syg);
  const sad = poleTabeli(s.tabela, ["Sąd", "Sąd/Organ", "Sąd orzekający"]);
  const dataPole = poleTabeli(s.tabela, ["Data orzeczenia", "Data wyroku"]) ?? "";
  // „2019-05-22 orzeczenie prawomocne” → data i informacja CBOSA o prawomocności
  const data = dataPole.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? dataPole;
  const prawomocnosc = /orzeczenie\s+(nie)?prawomocne/i.exec(dataPole)?.[0]?.toLowerCase() ?? null;
  const sent = s.sekcje["Sentencja"], uzas = s.sekcje["Uzasadnienie"];
  if (!s.htmlEnd || !s.bodyEnd) throw new Error(`Niekompletny HTML CBOSA ${id}: brak zamknięcia BODY/HTML`);
  if (!sent) throw new Error(`Zmiana/niekompletność kontraktu HTML CBOSA ${id}: brak Sentencji`);
  if (s.widzUzas && !uzas) throw new Error(`Niekompletna sekcja Uzasadnienie w dokumencie CBOSA ${id}`);
  const brakMeta = [["Sąd", sad], ["Data orzeczenia", data]].filter(([, v]) => !v).map(([n]) => n);
  return { doc_id: id, case_number: syg, court: sad || null, judgment_date: data || null,
    operative_part: sent || null, reasoning: uzas || null, url: `${BASE}/doc/${id}`,
    reasoning_available: Boolean(uzas), document_complete: true, finality: prawomocnosc,
    ...(brakMeta.length ? { brak_metadanych: brakMeta } : {}) };
}

/** Odpowiednik collect_search_doc_ids + verify_search_results + classify_exact_matches. */
export async function weryfikujSygnature(searchHtml, oczekiwana, pobierzStrone, pobierzDokument) {
  const exp = normalizeCaseNumber(oczekiwana);
  const oos = (powod, ids = []) => ({ status: "OUT_OF_SCOPE", expected: exp, doc_ids: ids, powod });
  const total = extractTotal(searchHtml);
  if (total === null) return oos("Nie rozpoznano licznika wyników CBOSA — możliwy drift HTML.");
  if (total === 0) return { status: "NOT_FOUND", expected: exp, doc_ids: [], powod: "CBOSA zwróciła 0 wyników." };
  const ids = extractDocIds(searchHtml);
  if (!ids.length) return oos("HTML nie zawiera /doc/{ID} albo zmienił się kontrakt strony.");
  const widz = new Set(ids);
  for (let p = 2; ids.length < total; p++) {
    if (p > LIMIT_STRON + 1) return oos(`Przekroczony limit paginacji (${LIMIT_STRON} stron).`, ids);
    let nowe;
    try { nowe = extractDocIds(await pobierzStrone(p)).filter((i) => !widz.has(i)); }
    catch (e) { return oos(`Błąd paginacji p=${p}: ${e.message}`, ids); }
    if (!nowe.length) return oos(`Paginacja bez nowych ID na stronie ${p} (total=${total}, odczytano=${ids.length}).`, ids);
    for (const i of nowe) { widz.add(i); ids.push(i); }
  }
  // Nadmiar unikalnych /doc/{ID} ponad licznik „Znaleziono N” NIE jest driftem: strona wyników
  // CBOSA niesie też linki spoza trafień (orzeczenia powiązane, nawigacja). To dodatkowi
  // kandydaci, nie brak kompletności — i tak przechodzą przez exact-match + fail-closed
  // parsujDokument, więc nie mogą dać fałszywego trafienia. Blokada `> total` dawała fałszywe
  // OUT_OF_SCOPE dla istniejących wyroków (zgł. użytkownika 2026-10-07).
  const dok = [];
  try { for (const id of ids) dok.push(parsujDokument(await pobierzDokument(id), id)); }
  catch (e) { return oos(`Nie udało się odczytać wszystkich kandydatów CBOSA: ${e.message}`, ids); }
  const trafione = dok.filter((d) => normalizeCaseNumber(d.case_number) === exp);
  const odrzucone = dok.filter((d) => normalizeCaseNumber(d.case_number) !== exp).map((d) => d.case_number);
  return { status: trafione.length === 1 ? "FOUND" : trafione.length ? "AMBIGUOUS" : "NOT_FOUND",
    expected: exp, matches: trafione, rejected: odrzucone, doc_ids: ids };
}

// ── mapowanie na SCHEMAT-ODPOWIEDZI-MCP + preferencję NSA/WSA ─────────────────────────────
const SNAP = "CBOSA jest bazą informacyjną NSA (orzeczenia zanonimizowane, bez klauzuli prawomocności " +
  "w metadanych). Wynik = snapshot 🟨, bez awansu na źródło zweryfikowane.";
export function naSchemat(v) {
  const baza = { query_type: "orzeczenie", source: "cbosa", snapshot: "🟨", awans: false, retrieved_at: new Date().toISOString() };
  const poz = (d) => ({ identyfikator: d.case_number, sad: d.court, data_wyroku: d.judgment_date,
    url_zrodlowy: d.url, doc_id: d.doc_id, uzasadnienie_dostepne: d.reasoning_available,
    sentencja: d.operative_part?.slice(0, 1500) ?? null, rola: "KANDYDAT" });
  if (v.status === "OUT_OF_SCOPE") return { status: "OUT_OF_SCOPE", ...baza, powod: v.powod,
    uwaga: "Wynik CBOSA niepotwierdzony (fail-closed). Nie wolno z niego wnioskować o istnieniu ani braku orzeczenia." };
  if (v.status === "NOT_FOUND") return { status: "OUT_OF_SCOPE", ...baza, powod: "Brak dokładnego trafienia w CBOSA.",
    odrzucone_post_checkiem: v.rejected ?? [], uwaga: "Brak dokładnego trafienia w CBOSA ≠ brak orzeczenia (NSA/WSA: OUT_OF_SCOPE). " + SNAP };
  if (v.status === "AMBIGUOUS") return { status: "AMBIGUOUS", ...baza, kandydaci: v.matches.map(poz), uwaga: SNAP };
  return { status: "FOUND", ...baza, result: poz(v.matches[0]), confidence: "snapshot",
    odrzucone_post_checkiem: v.rejected, uwaga: SNAP };
}

// ── HTTP: sesja z cookies, przekierowania ręcznie (host przypięty), kontrola transferu ───────
// Zerwane połączenie (orzeczenia.nsa.gov.pl zrywa je seriami przy przeciążeniu, zgłoszenie 2026-10-06):
// ponowienie całego żądania po 1,5 s i 3 s, o ile zostało budżetu; także zerwanie w trakcie odczytu treści.
const ZERWANE = /Połączenie zerwane|Niekompletny|UND_ERR_SOCKET|ECONNRESET|terminated/i;
const czekaj = (ms) => new Promise((ok) => setTimeout(ok, ms));
export async function zPonowieniem(proba, { przerwa = 1500, prob = 3, budzet = pozostalyBudzet } = {}) {
  for (let i = 1; ; i++) {
    try { return await proba(); }
    catch (e) {
      if (i >= prob || !ZERWANE.test(String(e?.message ?? e)) || budzet() < przerwa * i + 5000) throw e;
      await czekaj(przerwa * i);
    }
  }
}

class Sesja {
  constructor() { this.cookies = new Map(); }
  zadanie(url, init = {}) { return zPonowieniem(() => this.jednoZadanie(url, init)); }
  async jednoZadanie(url, init = {}) {
    for (let skok = 0; skok < 6; skok++) {
      const u = new URL(url);
      if (u.protocol !== "https:" || u.hostname !== HOST) throw new Error(`Odmowa: host spoza CBOSA (${u.host})`);
      const headers = { "User-Agent": "lex-machina-cbosa/1.0", Accept: "text/html,application/xhtml+xml,*/*;q=0.8", "Accept-Language": "pl-PL,pl;q=0.9", ...(init.headers ?? {}) };
      if (this.cookies.size) headers.Cookie = [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
      const r = await fetch(url, { ...init, headers, redirect: "manual", signal: sygnal(40000), lexPowtarzalne: true }); // wyszukiwarka i odczyt niczego nie zmieniają
      for (const c of r.headers.getSetCookie?.() ?? []) { const [kv] = c.split(";"); const i = kv.indexOf("="); if (i > 0) this.cookies.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim()); }
      if (r.status >= 300 && r.status < 400 && r.headers.get("location")) {
        url = new URL(r.headers.get("location"), url).href; init = { method: "GET" }; continue;
      }
      if (!r.ok) throw new Error(`CBOSA HTTP ${r.status}`);
      let buf;
      try { buf = Buffer.from(await r.arrayBuffer()); }
      catch (e) { throw new Error(opisBleduSieci(e, HOST), { cause: e }); }
      // Content-Length to rozmiar PRZESŁANY: przy gzip/br fetch zwraca treść po dekompresji
      // (większą), więc długość porównujemy tylko bez kompresji (wcześniej: fałszywy błąd 18128/5690 B).
      // ⚠️ Korekta 2026-10-01 (pomiar lokalny, undici/Node 22): ucięcie przy Content-Length lub w trybie
      //    chunked rzuca UND_ERR_SOCKET już w fetch; ucięty gzip BEZ Content-Length (koniec = zamknięcie
      //    połączenia) przechodzi BEZ wyjątku (4918/30013 B). Przed tym chroni dopiero kontrola treści:
      //    dokument — zamknięcie BODY/HTML w parsujDokument; lista wyników — kontrola niżej (</html>).
      const cl = Number(r.headers.get("content-length"));
      const kodowanie = (r.headers.get("content-encoding") ?? "").trim().toLowerCase();
      if (cl && (!kodowanie || kodowanie === "identity") && cl !== buf.length) throw new Error(`Niekompletny transport HTTP (${buf.length}/${cl} B)`);
      const cs = ((r.headers.get("content-type") ?? "").match(/charset=([\w-]+)/i)?.[1] ?? "utf-8").toLowerCase();
      const html = new TextDecoder(cs).decode(buf);
      if (/text\/html/i.test(r.headers.get("content-type") ?? "") && !/<\/html>/i.test(html))
        throw new Error(`Niekompletny HTML CBOSA (brak </html>, ${buf.length} B) — transport ucięty`);
      return html;
    }
    throw new Error("Pętla przekierowań CBOSA");
  }
}

function formularz(pola) {
  const p = { wszystkieSlowa: "", wystepowanie: "gdziekolwiek", odmiana: "on", sygnatura: "", sad: "dowolny",
    rodzaj: "dowolny", symbole: "", odDaty: "", doDaty: "", sedziowie: "", funkcja: "", submit: "Szukaj", ...pola };
  return new URLSearchParams(p);
}
async function szukaj(sesja, pola) {
  return sesja.zadanie(`${BASE}/cbo/search`, { method: "POST", body: formularz(pola),
    headers: { "Content-Type": "application/x-www-form-urlencoded" } });
}

const blad = (e) => ({ status: "ERROR", query_type: "orzeczenie", source: "cbosa", detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() });
const tekst = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "cbosa-connector", version: "1.0.0" }));

server.registerTool("cbosa_sprawdz_sygnature", {
  title: "CBOSA — kontrola istnienia sygnatury NSA/WSA (exact-match, fail-closed)",
  description: "Pełny zbiór kandydatów (paginacja), odczyt każdego dokumentu, dokładne dopasowanie sygnatury. " +
    "Wynik = snapshot 🟨; brak trafień = OUT_OF_SCOPE, nie dowód nieistnienia.",
  inputSchema: { sygnatura: z.string().min(4).describe("np. III OSK 1959/22") },
}, async ({ sygnatura }) => {
  try {
    const s = new Sesja();
    const pierwsza = await szukaj(s, { sygnatura: sygnatura.trim() });
    const v = await weryfikujSygnature(pierwsza, sygnatura,
      (p) => s.zadanie(`${BASE}/cbo/find?p=${p}`), (id) => s.zadanie(`${BASE}/doc/${id}`));
    return tekst(naSchemat(v));
  } catch (e) { return tekst({ ...blad(e), snapshot: "🟨" }); }
});

server.registerTool("cbosa_szukaj", {
  title: "CBOSA — wyszukiwanie orzeczeń NSA/WSA",
  description: "Fraza + filtry; zwraca doc_id kandydatów (strona 10 wyników) i licznik. Sygnatury czytaj cbosa_pobierz.",
  inputSchema: {
    fraza: z.string().min(2), odDaty: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    doDaty: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), strona: z.number().int().min(1).max(LIMIT_STRON).optional(),
  },
}, async ({ fraza, odDaty, doDaty, strona }) => {
  try {
    const s = new Sesja();
    let html = await szukaj(s, { wszystkieSlowa: fraza, odDaty: odDaty ?? "", doDaty: doDaty ?? "" });
    const total = extractTotal(html);
    if (total === null) return tekst({ status: "OUT_OF_SCOPE", query_type: "orzeczenie", source: "cbosa", powod: "Nie rozpoznano licznika wyników — możliwy drift HTML." });
    if ((strona ?? 1) > 1) html = await s.zadanie(`${BASE}/cbo/find?p=${strona}`);
    const ids = extractDocIds(html);
    return tekst({ status: total === 0 ? "OUT_OF_SCOPE" : "AMBIGUOUS",
      query_type: "orzeczenie", source: "cbosa", snapshot: "🟨", awans: false, liczba_trafien: total, strona: strona ?? 1,
      kandydaci: ids.map((id) => ({ doc_id: id, url_zrodlowy: `${BASE}/doc/${id}`, rola: "KANDYDAT" })) });
  } catch (e) { return tekst(blad(e)); }
});

server.registerTool("cbosa_pobierz", {
  title: "CBOSA — dokument po doc_id (fail-closed)",
  description: "Sygnatura, sąd, data, sentencja, uzasadnienie. Niekompletny dokument = ERROR/OUT_OF_SCOPE.",
  inputSchema: { doc_id: z.string().regex(DOC_ID_RE).describe("10 znaków, np. 099620132A") },
}, async ({ doc_id }) => {
  try {
    const d = parsujDokument(await new Sesja().zadanie(`${BASE}/doc/${doc_id.toUpperCase()}`), doc_id);
    return tekst({ status: "FOUND", query_type: "orzeczenie", source: "cbosa", snapshot: "🟨", awans: false, confidence: "snapshot",
      result: { identyfikator: d.case_number, sad: d.court, data_wyroku: d.judgment_date, url_zrodlowy: d.url,
        ...(d.finality ? { prawomocnosc: `${d.finality} (wg CBOSA)` } : {}),
        sentencja: d.operative_part, uzasadnienie: d.reasoning, uzasadnienie_dostepne: d.reasoning_available },
      uwaga: d.brak_metadanych ? `Karta bez pól: ${d.brak_metadanych.join(", ")} (inny układ karty) — treść odczytana. ${SNAP}` : SNAP });
  } catch (e) { return tekst({ ...blad(e), status: "OUT_OF_SCOPE", powod: String(e?.message ?? e) }); }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("cbosa-mcp-server: nasłuchuję na stdio (MCP)");
}
