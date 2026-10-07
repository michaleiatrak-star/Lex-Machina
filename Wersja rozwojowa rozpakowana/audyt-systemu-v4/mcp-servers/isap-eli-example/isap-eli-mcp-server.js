#!/usr/bin/env node
/**
 * isap-eli-mcp-server.js — REALNY, uruchamialny serwer MCP dla Sejm ELI API
 * (Dziennik Ustaw / Monitor Polski), zgodny z protokołem opisanym w
 * shared/MCP-INTEGRACJA.md i schematem odpowiedzi z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 *
 * ⚠️ STATUS UCZCIWY: ten serwer POPRAWNIE implementuje protokół MCP (uruchamia
 * się, odpowiada na `tools/list`, `tools/call` — zweryfikowane w tej sesji
 * realnym klientem MCP, patrz self-test poniżej). Samo zapytanie sieciowe do
 * `api.sejm.gov.pl` ✅ PRZETESTOWANE wobec żywego API 2026-09-27g (poprzednio nie było —
 * w którym to piszę, ma dostęp sieciowy ograniczony do listy dozwolonych
 * domen (npm/pypi/github i pokrewne), NIE obejmuje domen .gov.pl. Kształt
 * odpowiedzi Sejm ELI API (pola JSON) trzeba zweryfikować przy pierwszym
 * uruchomieniu w środowisku z realnym dostępem sieciowym.
 *
 * Narzędzie udostępniane: `isap_lookup` — nazwa zgodna z konwencją z
 * shared/KONEKTORY-REKOMENDOWANE.md ("np. isap_lookup, saos_search, ...").
 *
 * Uruchomienie:
 *   node isap-eli-mcp-server.js
 * (komunikacja przez stdio — tak podłącza się serwery MCP lokalne w Claude
 * Desktop / Claude Code; do zdalnego użycia potrzebny wariant Streamable HTTP,
 * poza zakresem tego pliku)
 *
 * Konfiguracja w kliencie MCP (przykład dla Claude Desktop/Code,
 * claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "isap-eli": {
 *         "command": "node",
 *         "args": ["/sciezka/do/isap-eli-mcp-server.js"]
 *       }
 *     }
 *   }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

const ELI_BASE_URL = "https://api.sejm.gov.pl/eli/acts"; // ✅ zweryfikowane wobec żywego API 2026-09-27g

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({
  name: "isap-eli-connector",
  version: "1.0.0",
}));

// ⛔ POPRAWKA 2026-09-27o (AUDYT-2026-09-27o) — zmierzone na żywym ELI:
//  (1) status ELI przepuszczany bez mapowania poza schemat 4 wartości: „akt posiada tekst jednolity”
//      (Kodeks cywilny DU/1964/93) wychodził jako surowy tekst. Mapowanie niżej; naprawa z 27h
//      trafiła tylko do pluginu spoza repozytorium (F-211).
//  (2) kandydaci AMBIGUOUS bez tytułu i statusu („DU 2018 poz. 1000”) — nie do wyboru.
//  (3) brak odczytu po identyfikatorze (`eli`: DU/1964/93) — ŹRÓDŁO-0 HARDGATE nie miało narzędzia MCP.
//  (4) przy „akt posiada tekst jednolity” — ustalenie AKTUALNEGO t.j.: /references → „Inf. o tekście
//      jednolitym” → od najnowszego pierwszy „obowiązujący” (DU/2025/1071 „wygaśnięcie aktu” = t.j.
//      zastąpiony, nie akt uchylony).
// Statusy ELI (zmierzone 27o na 2009 pozycjach): obowiązujący, akt objęty tekstem jednolitym,
// wygaśnięcie aktu, akt jednorazowy, uznany za uchylony, uchylony, nieobowiązujący - uchylona
// podstawa prawna, akt posiada tekst jednolity, bez statusu.
export function mapujStatusEli(status, tytul = "") {
  const s = String(status ?? "").toLowerCase();
  if (s === "obowiązujący") return "obowiazuje";
  if (s.includes("tekst jednolity") || s.includes("tekstem jednolitym")) return "tekst_jednolity_nieaktualny";
  if (s.includes("wygaśnięcie") && /jednolitego tekstu/i.test(tytul)) return "tekst_jednolity_nieaktualny";
  if (/uchyl|wygaśnięcie|nieobowiązując|utrat/.test(s)) return "uchylony";
  return "nieznany";
}

const pozycja = (p) => ({
  identyfikator: `${p.publisher ?? "DU"} ${p.year} poz. ${p.pos}`,
  eli: p.ELI ?? `${p.publisher ?? "DU"}/${p.year}/${p.pos}`,
  tytul_lub_nazwa: p.title ?? null,
  status_obowiazywania: mapujStatusEli(p.status, p.title),
  status_eli: p.status ?? null,
  data_publikacji_lub_wyroku: p.announcementDate ?? p.promulgation ?? null,
  url_zrodlowy: `https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=W${p.publisher ?? "DU"}${p.year}${String(p.pos).padStart(7, "0")}`,
});

/** Wynik wyszukiwania po tytule albo odczytu po ELI → SCHEMAT-ODPOWIEDZI-MCP. */
export function normalizujOdpowiedzELI(rawItems, queryLabel, aktualnyTj = null) {
  const baza = { query_type: "akt_prawny", source: "sejm-eli" };
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { status: "NOT_FOUND", ...baza, uwaga: "Brak pozycji w ELI dla zapytania — nie jest to dowód, że akt nie istnieje (sprawdź tytuł/ELI)." };
  }
  if (rawItems.length > 1) {
    return { status: "AMBIGUOUS", ...baza, liczba_trafien: rawItems.length,
      kandydaci: rawItems.slice(0, 25).map(pozycja),
      uwaga: rawItems.length > 25 ? `Pokazano 25 z ${rawItems.length} — zawęź tytuł albo podaj eli.` : undefined };
  }
  const r = pozycja(rawItems[0]);
  const w = { status: "FOUND", ...baza, result: r, retrieved_at: new Date().toISOString(), confidence: "deterministic" };
  if (r.status_obowiazywania === "tekst_jednolity_nieaktualny") {
    if (aktualnyTj) {
      r.aktualny_tekst_jednolity = aktualnyTj;
      w.uwaga = `⚠️ ${r.identyfikator} to pozycja pierwotna/zastąpiona. Powołuj aktualny tekst jednolity: ` +
        `${aktualnyTj.identyfikator} (${aktualnyTj.eli}).`;
    } else {
      w.uwaga = `⚠️ ${r.identyfikator}: ELI „${r.status_eli}” — nie powołuj tej pozycji; ustal aktualny t.j. (HARDGATE ŹRÓDŁO-0, /references).`;
    }
  } else if (r.status_obowiazywania === "uchylony") {
    w.uwaga = `⛔ ${r.identyfikator}: ELI „${r.status_eli}” — akt nie obowiązuje.`;
  }
  return w;
}

async function eliGet(sciezka) {
  let ostatni;
  for (let proba = 1; proba <= 3; proba++) {
    try {
      const resp = await fetch(`${ELI_BASE_URL}/${sciezka}`, { signal: sygnal(20000) });
      if (resp.status === 404) return null;
      if (!resp.ok) throw new Error(`Sejm ELI API zwróciło HTTP ${resp.status}`);
      return await resp.json();
    } catch (e) { ostatni = e; }
  }
  throw ostatni;
}

/** Aktualny t.j.: /references → „Inf. o tekście jednolitym” → od najnowszego pierwszy „obowiązujący”. */
async function aktualnyTekstJednolity(eli) {
  const ref = await eliGet(`${eli}/references`);
  const wpisy = (ref?.["Inf. o tekście jednolitym"] ?? []).map((x) => x.act).filter(Boolean)
    .sort((a, b) => b.year - a.year || b.pos - a.pos);
  for (const act of wpisy.slice(0, 5)) {
    const d = await eliGet(`${act.publisher ?? "DU"}/${act.year}/${act.pos}`);
    if (d?.status === "obowiązujący") return pozycja(d);
  }
  return null;
}

async function pobierzZEli(query) {
  // ⛔ POPRAWKA 2026-09-27g: poprzednio `${ELI_BASE_URL}/DU/search?title=…` → HTTP 404.
  const dane = await eliGet(`search?publisher=DU&title=${encodeURIComponent(query)}&limit=500`);
  return dane?.items ?? [];
}

server.registerTool(
  "isap_lookup",
  {
    title: "Akt prawny w Sejm ELI (Dz.U.) — po identyfikatorze albo tytule, ze statusem",
    description:
      "Podaj `eli` (np. DU/1964/93) dla odczytu deterministycznego albo `query` (tytuł). Zwraca status " +
      "obowiązywania w schemacie (obowiazuje / uchylony / tekst_jednolity_nieaktualny / nieznany) i surowy " +
      "status ELI; przy pozycji pierwotnej wskazuje AKTUALNY tekst jednolity. FOUND/NOT_FOUND/AMBIGUOUS/ERROR.",
    inputSchema: {
      eli: z.string().regex(/^(DU|MP)\/\d{4}\/\d{1,5}$/).optional().describe("Identyfikator ELI, np. DU/1964/93"),
      query: z.string().min(3).optional().describe("Tytuł lub fraza, np. 'Kodeks cywilny'"),
    },
  },
  async ({ eli, query }) => {
    let wynik;
    try {
      if (!eli && !query) throw new Error("Podaj `eli` albo `query`.");
      if (eli) {
        const d = await eliGet(eli);
        const st = d ? mapujStatusEli(d.status, d.title) : null;
        const tj = st === "tekst_jednolity_nieaktualny" && d.status !== "wygaśnięcie aktu" ? await aktualnyTekstJednolity(eli) : null;
        wynik = normalizujOdpowiedzELI(d ? [d] : [], eli, tj);
      } else {
        wynik = normalizujOdpowiedzELI(await pobierzZEli(query), query);
      }
    } catch (err) {
      wynik = { status: "ERROR", query_type: "akt_prawny", source: "sejm-eli", detail: String(err?.message ?? err), retrieved_at: new Date().toISOString() };
    }
    return { content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }] };
  }
);

// ── isap_tekst (AUDYT-2026-09-27q; luka F-212 wobec mcp-isap `get_act_text`) ─────────────────────
// Zmierzone 27q: `text.html` obwieszczenia t.j. jest PUSTY (0 B) — obowiązujące brzmienie jest WYŁĄCZNIE
// w PDF. mcp-isap zwraca dla t.j. tylko link do PDF, a tekst podaje z `text.html` aktu bazowego = brzmienie
// OGŁOSZONE (KC z 1964 r.). Tu: automatyczne przejście do aktualnego t.j., tekst z PDF (pdfjs),
// cały artykuł (od „Art. N.” do następnego), punkt 2 obwieszczenia („tekst jednolity nie obejmuje”)
// i akty zmieniające ogłoszone PO obwieszczeniu (F-156). Indeksy górne w treści: `Art. 385[1].`
// ⛔ Status „obowiązujący” aktu zmieniającego NIE oznacza zmiany nieujętej w t.j. (zmierzone: 65 takich
//    dla KC, w tym z 1982 r.) — sygnałem jest wyłącznie data ogłoszenia po obwieszczeniu.

const pamiecTekstu = new Map();

// ── WYJĄTEK RZĄD 1: czysty tekst jednolity (ujednolicony, type "U") ważniejszy od text.pdf.
// Zmierzone 2026-10-07 na żywym ELI: Konstytucja DU/1997/483 ma textHTML:false, więc isap_tekst
// czyta `text.pdf` — a to skan z ukrytą warstwą OCR, w którym numery 12 artykułów są zniekształcone
// (np. „Art. ISO.” zamiast „Art. 150.”), co dawało NOT_FOUND dla art. 150. Plik ujednolicony
// (texts[].type === "U", D19970483Lj.pdf, 294 KB born-digital) jest czysty: wszystkie 12 numerów
// (108, 138, 141, 145, 146, 150–154, 156, 176) są poprawne. Dlatego dla tych ELI pobieramy
// wersję "U" zamiast text.pdf. Klucz = ELI aktu; typ = kod z `texts`.
const WYJATKI_TEKST_CZYSTY = {
  "DU/1997/483": { typ: "U", plik: "D19970483Lj.pdf", powod: "skan OCR z 1997 r. zniekształca numery artykułów (np. „Art. ISO.” zamiast „Art. 150.”)" },
};

/** Zwraca URL czystego tekstu ujednoliconego dla wyjątku RZĄD 1 albo null. `plik` z żywych
 * metadanych (`texts`), z fallbackiem na wartość zapisaną w mapie, gdy metadanych brak. */
export function wybierzTekstCzysty(eli, meta = null) {
  const w = WYJATKI_TEKST_CZYSTY[eli];
  if (!w) return null;
  const plik = (meta?.texts ?? []).find((t) => t.type === w.typ)?.fileName ?? w.plik;
  return { url: `${ELI_BASE_URL}/${eli}/text/${w.typ}/${encodeURIComponent(plik)}`, powod: w.powod };
}

// ── Dz.U./M.P. z lat 2000–2009: polskie litery w fontach QuarkXPress „…PL” są zapisane
// w kodach Mac Central European, a PDF deklaruje je jako Mac Roman („Za∏àcznik” zamiast
// „Załącznik”). Dotyczy pdfjs tak samo jak pdftotext, pdfplumber, pypdf i PyMuPDF.
// Mapa WYPROWADZONA, nie przepisana: litera.encode("mac_latin2").decode("mac_roman");
// Ó i ó mapują się na siebie, więc nie ma ich w tabeli (16 pozycji, nie 18).
const MAC_CE_NA_PL = Object.fromEntries(
  [..."Ñàåç¢´¸∏¡ƒÂÊèê˚˝"].map((c, i) => [c, "ĄąĆćĘęŁłŃńŚśŹźŻż"[i]]),
);
// ⛔ Bramką NIE jest rocznik, tylko wykrycie usterki: à, ç, è, ê, Ñ i å są prawdziwymi literami
// w tekstach francuskich, hiszpańskich i skandynawskich (umowy międzynarodowe w Dz.U.), więc
// przeliczenie po samym roczniku psułoby je. Sygnałem usterki są znaki, które w tekście
// urzędowym nie występują poza nią (¢ ´ ¸ ∏ ¡ ƒ Â Ê ˚ ˝), przy JEDNOCZESNYM braku prawidłowych
// polskich znaków diakrytycznych — przy tej usterce font psuje je wszystkie, więc licznik = 0.
const MARKERY_MAC_CE = /[¢´¸∏¡ƒÂÊ˚˝]/;        // bez flagi /g — używane też przez .test()
const DIAKRYTYKI_PL = /[ąćęłńśźżĄĆĘŁŃŚŹŻ]/;  // bez flagi /g — j.w.

/** Czy strona ma polskie litery w kodach Mac CE odczytanych jako Mac Roman. */
export function zepsuteMacCE(tekst) {
  return (tekst.match(/[¢´¸∏¡ƒÂÊ˚˝]/g) ?? []).length >= 2 && !DIAKRYTYKI_PL.test(tekst);
}
/** Przelicza litery TYLKO na stronach, na których usterka została wykryta. */
export function naprawMacCE(tekst) {
  return zepsuteMacCE(tekst) ? tekst.replace(/[Ñàåç¢´¸∏¡ƒÂÊèê˚˝]/g, (c) => MAC_CE_NA_PL[c]) : tekst;
}

/** Naprawa całego dokumentu: rozpoznanie na JEDNEJ stronie przenosi się na pozostałe.
 * Font jest własnością zeszytu, nie strony, a strona złożona niemal bez polskiego tekstu
 * (wykaz substancji, tabela liczb) ma za mało markerów, by przejść próg samodzielnie —
 * zmierzone na DU/2000/1097 str. 10: jeden marker w słowie „Za∏àcznik” i zero polskich liter.
 * Strona dziedziczy rozpoznanie, gdy ma CHOĆ JEDEN marker i zero polskich znaków
 * diakrytycznych; strona bez markerów (np. wyłącznie obcojęzyczna) pozostaje nietknięta. */
export function naprawMacCEDokument(strony) {
  const dokumentZepsuty = strony.some(zepsuteMacCE);
  return strony.map((s) => (
    zepsuteMacCE(s) || (dokumentZepsuty && MARKERY_MAC_CE.test(s) && !DIAKRYTYKI_PL.test(s))
      ? s.replace(/[Ñàåç¢´¸∏¡ƒÂÊèê˚˝]/g, (c) => MAC_CE_NA_PL[c])
      : s));
}

// Żywa pagina. Pierwszy wzorzec — format bieżący („Dziennik Ustaw – 12 – Poz. 345”), drugi —
// format z lat 2000–2009 („Dziennik Ustaw Nr 105 — 7006 — Poz. 990 i 991”), też dla M.P.
// ⛔ Klasy znaków celowo bez `\s`: `\s` obejmuje koniec wiersza, więc wzorzec zjadałby numer
// pozycji stojący w następnym wierszu jako nagłówek treści (zmierzone na DU/2000/649).
const PAGINA_BIEZACA = /^Dziennik Ustaw\s*–\s*\d+\s*–\s*Poz\.\s*\d+\s*$/m;
const PAGINA_2000_2009 = /^[^\S\n]*(?:Dziennik Ustaw|Monitor Polski)(?:[^\S\n]+Nr[^\S\n]*\d+)?[^\S\n]*(?:\n[^\S\n]*){0,2}[—–-][^\S\n]*\d+[^\S\n]*[—–-][^\S\n]*(?:\n[^\S\n]*){0,2}(?:Poz\.[^\S\n]*\d+(?:[^\S\n]*(?:,|i)[^\S\n]*\d+)*[^\S\n]*)?$/gm;

export function czyscTekstPdf(strony) {
  return naprawMacCEDokument(strony)
    .map((t) => t.replace(PAGINA_BIEZACA, "").replace(PAGINA_2000_2009, "")).join("\n")
    .replace(/(\p{L})-\n(\p{Ll})/gu, "$1$2").replace(/[ \t]+\n/g, "\n").replace(/\n{2,}/g, "\n");
}

export function normalizujNumerArt(a) {
  return String(a).trim().replace(/^art\.?\s*/i, "").replace(/\s+/g, "")
    .replace(/[\^(]\s*(\d+)\s*\)?$/, "[$1]").replace(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)$/, (m) => "[" + [...m].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join("") + "]");
}

/** Podział obwieszczenia: preambuła (pkt 1–2) i załącznik (tekst ustawy). */
export function podzielObwieszczenie(tekst) {
  const m = tekst.search(/\n\s*Załącznik do obwieszczenia/i);
  const preambula = m > 0 ? tekst.slice(0, m) : "";
  const zalacznik = m > 0 ? tekst.slice(m) : tekst;
  const p2 = preambula.match(/\n2\.\s*Podany w załączniku[\s\S]*$/);
  const stan = preambula.match(/stanu prawnego na dzień\s*\n?\s*(\d{1,2} \p{L}+ \d{4}) r\./u);
  return { preambula, zalacznik, nie_obejmuje: p2 ? p2[0].trim() : null, stan_prawny_na: stan ? stan[1] : null };
}

/** Cały artykuł z tekstu ustawy: od „Art. N.” do następnego „Art. …”. */
export function wytnijArtykul(zalacznik, numer) {
  const n = normalizujNumerArt(numer).replace(/[[\]]/g, "\\$&");
  const re = new RegExp(`(?:^|\\n)(Art\\.\\s*${n}\\.[\\s\\S]*?)(?=\\nArt\\.\\s*\\d+[a-z]*(?:\\[\\d+\\])?\\.\\s|\\n\\s*Rozdział|\\n\\s*DZIAŁ|\\n\\s*TYTUŁ|\\n\\s*KSIĘGA|$)`);
  const m = zalacznik.match(re);
  return m ? m[1].trim() : null;
}

async function tekstPdf(eli, url = null) {
  if (pamiecTekstu.has(eli)) return pamiecTekstu.get(eli);
  const resp = await fetch(url ?? `${ELI_BASE_URL}/${eli}/text.pdf`, { signal: sygnal(90000) });
  if (!resp.ok) throw new Error(`PDF ${eli}: HTTP ${resp.status}`);
  const dane = new Uint8Array(await resp.arrayBuffer());
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (!globalThis.pdfjsWorker) globalThis.pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  const doc = await pdfjs.getDocument({ data: dane, isEvalSupported: false, disableFontFace: true, verbosity: 0 }).promise;
  const strony = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    strony.push(c.items.map((it) => it.str + (it.hasEOL ? "\n" : "")).join(""));
  }
  const t = czyscTekstPdf(strony);
  pamiecTekstu.set(eli, t);
  return t;
}

async function zmianyPoTj(eliBazowy, tj) {
  const ref = await eliGet(`${eliBazowy}/references`);
  const rokTj = Number(tj.eli.split("/")[1]);
  const kandydaci = (ref?.["Akty zmieniające"] ?? []).map((x) => x.act).filter((a) => a && a.year >= rokTj - 1);
  const po = [];
  for (const a of kandydaci.slice(0, 15)) {
    const d = await eliGet(`${a.publisher ?? "DU"}/${a.year}/${a.pos}`);
    const ogl = d?.promulgation ?? d?.announcementDate;
    if (ogl && tj.data_publikacji_lub_wyroku && ogl > tj.data_publikacji_lub_wyroku) po.push({ eli: d.ELI ?? `${a.publisher}/${a.year}/${a.pos}`, tytul: d.title, ogloszono: ogl, wejscie_w_zycie: d.entryIntoForce ?? null });
  }
  return po;
}

server.registerTool("isap_tekst", {
  title: "Treść aktu (obowiązujące brzmienie) — artykuł, wyszukiwanie, strona",
  description: "Treść z PDF AKTUALNEGO tekstu jednolitego (automatyczne przejście z pozycji pierwotnej). `artykul` = cały " +
    "artykuł (np. '118', '385^1'); `szukaj` = fragmenty; bez nich strona 20 000 znaków od `offset`. Zwraca też, czego " +
    "t.j. nie obejmuje (pkt 2 obwieszczenia) i akty zmieniające ogłoszone po t.j.",
  inputSchema: {
    eli: z.string().regex(/^(DU|MP)\/\d{4}\/\d{1,5}$/).describe("ELI aktu bazowego albo obwieszczenia t.j., np. DU/1964/93"),
    artykul: z.string().max(12).optional(), szukaj: z.string().min(3).max(120).optional(),
    offset: z.number().int().min(0).optional(),
    wersja: z.enum(["aktualna", "ogloszona"]).optional().describe("domyślnie aktualna (t.j.)"),
  },
}, async ({ eli, artykul, szukaj, offset, wersja }) => {
  const baza = { query_type: "tekst_aktu", source: "sejm-eli" };
  try {
    const meta = await eliGet(eli);
    if (!meta) return tekstOdp({ status: "NOT_FOUND", ...baza, uwaga: `Brak ${eli} w ELI.` });
    const st = mapujStatusEli(meta.status, meta.title);
    let zrodlo = pozycja(meta), wersjaTekstu = "tekst_ogloszony", tj = null;
    const jestObwieszczeniemTj = /jednolitego tekstu/i.test(meta.title ?? "");
    if (jestObwieszczeniemTj) { wersjaTekstu = "tekst_jednolity"; tj = zrodlo; }
    else if (st === "tekst_jednolity_nieaktualny" && wersja !== "ogloszona") {
      tj = await aktualnyTekstJednolity(eli);
      if (!tj) return tekstOdp({ status: "OUT_OF_SCOPE", ...baza, powod: "Nie ustalono aktualnego t.j. (brak obowiązującego obwieszczenia w /references)." });
      zrodlo = tj; wersjaTekstu = "tekst_jednolity";
    }
    const czysty = wybierzTekstCzysty(zrodlo.eli, meta);
    const pelny = await tekstPdf(zrodlo.eli, czysty?.url ?? null);
    const obw = wersjaTekstu === "tekst_jednolity" ? podzielObwieszczenie(pelny) : { zalacznik: pelny, nie_obejmuje: null, stan_prawny_na: null };
    const result = { identyfikator: zrodlo.identyfikator, eli_bazowy: eli, eli_zrodla_tekstu: zrodlo.eli, wersja_tekstu: czysty ? "tekst_ujednolicony" : wersjaTekstu,
      status_obowiazywania: wersjaTekstu === "tekst_jednolity" ? zrodlo.status_obowiazywania : st,
      tytul_lub_nazwa: zrodlo.tytul_lub_nazwa, stan_prawny_na: obw.stan_prawny_na,
      url_zrodlowy: czysty?.url ?? `${ELI_BASE_URL}/${zrodlo.eli}/text.pdf` };
    const uw = [];
    if (czysty) uw.push(`✅ Tekst ujednolicony (wersja „U”) — ${czysty.powod}; pominięto skan text.pdf.`);
    if (wersjaTekstu === "tekst_ogloszony" && !czysty) uw.push("⚠️ Tekst OGŁOSZONY (brzmienie z dnia ogłoszenia), nie stan obecny.");
    if (obw.nie_obejmuje) result.tj_nie_obejmuje = obw.nie_obejmuje.slice(0, 4000);
    if (tj && !jestObwieszczeniemTj) {
      result.zmiany_po_tj = await zmianyPoTj(eli, tj);
      if (result.zmiany_po_tj.length) uw.push(`⚠️ ${result.zmiany_po_tj.length} akt(y) zmieniające ogłoszone po t.j. — brzmienie może być nieaktualne.`);
    }
    if (artykul) {
      const art = wytnijArtykul(obw.zalacznik, artykul);
      if (!art) return tekstOdp({ status: "NOT_FOUND", ...baza, result, uwaga: `Brak „Art. ${normalizujNumerArt(artykul)}.” w tekście ${zrodlo.identyfikator}.` });
      result.artykul = normalizujNumerArt(artykul); result.tresc = art;
      if (/^Art\.\s*\S+\.\s*\(uchylony\)/.test(art)) uw.push("⛔ Artykuł uchylony.");
    } else if (szukaj) {
      const fr = []; let i = -1; const low = obw.zalacznik.toLowerCase(), q = szukaj.toLowerCase();
      while (fr.length < 5 && (i = low.indexOf(q, i + 1)) >= 0) fr.push({ pozycja: i, fragment: obw.zalacznik.slice(Math.max(0, i - 400), i + 400) });
      if (!fr.length) return tekstOdp({ status: "NOT_FOUND", ...baza, result, uwaga: `Fraza „${szukaj}” nie występuje w tekście.` });
      result.fragmenty = fr;
    } else {
      const o = offset ?? 0; result.tresc = obw.zalacznik.slice(o, o + 20000);
      result.tresc_offset = o; result.tresc_dlugosc = obw.zalacznik.length;
    }
    uw.push("Tekst urzędowy integralny — nie parafrazuj; indeksy górne w zapisie Art. N[k].");
    return tekstOdp({ status: "FOUND", ...baza, result, uwaga: uw.join(" "), retrieved_at: new Date().toISOString(), confidence: "deterministic" });
  } catch (err) {
    return tekstOdp({ status: "ERROR", ...baza, detail: String(err?.message ?? err), retrieved_at: new Date().toISOString() });
  }
});
const tekstOdp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("isap-eli-mcp-server: nasłuchuję na stdio (MCP)"); // stderr, nie zaśmieca protokołu na stdout
}
