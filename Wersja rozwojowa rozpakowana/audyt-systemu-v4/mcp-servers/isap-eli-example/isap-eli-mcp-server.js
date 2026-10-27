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
import { createHash } from "node:crypto";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";
import {
  articleFootnotes, articleWording, extractPageFootnotes, joinLineItems, normalizeArticleId,
  repairDzuPdfEncoding, splitArticles, stripPdfPageHeaders, stripTrailingHeadings,
} from "../wspolne/akt-pdf.mjs";

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

const nazwaAktu = (t) => String(t ?? "").toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").replace(/[.\s]+$/, "").trim();
const NOWELIZACJA = /\bo zmianie\b|\bzmieniając|\bw sprawie zmiany\b|\bo uzupełnieniu\b/i;

/** 0 akt bazowy (tytuł = zapytanie), 1 aktualny t.j. tego aktu, 2 inne, 3 bazowy uchylony, 4 nowelizacja, 5 t.j. zastąpiony. */
export function rangaKandydata(p, zapytanie) {
  const q = nazwaAktu(zapytanie);
  const t = nazwaAktu(p.title);
  // „Ustawa z dnia … 1964 r. - Kodeks …” albo bez myślnika („… 2000 r. Kodeks spółek handlowych”).
  const nazwa = t.replace(/^.*?\b\d{4} r\.(?: -)? /, "");
  const tj = /jednolitego tekstu/.test(t);
  if (q && tj && (t.endsWith(`- ${q}`) || t.endsWith(`ustawy ${q}`))) return p.status === "obowiązujący" ? 1 : 5;
  if (tj) return 5;
  if (q && nazwa === q && !NOWELIZACJA.test(t)) return /uchyl|wygaśnięcie|nieobowiązując/.test(String(p.status ?? "").toLowerCase()) ? 3 : 0;
  if (NOWELIZACJA.test(t)) return 4;
  return 2;
}

/** Kandydaci AMBIGUOUS w kolejności rangi; w obrębie rangi kolejność ELI (od najnowszych). */
export function uporzadkujKandydatow(rawItems, zapytanie) {
  return rawItems.map((p, i) => ({ p, i, r: rangaKandydata(p, zapytanie) })).sort((a, b) => a.r - b.r || a.i - b.i).map((x) => x.p);
}

/** Wynik wyszukiwania po tytule albo odczytu po ELI → SCHEMAT-ODPOWIEDZI-MCP. */
export function normalizujOdpowiedzELI(rawItems, queryLabel, aktualnyTj = null) {
  const baza = { query_type: "akt_prawny", source: "sejm-eli" };
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { status: "NOT_FOUND", ...baza, uwaga: "Brak pozycji w ELI dla zapytania — nie jest to dowód, że akt nie istnieje (sprawdź tytuł/ELI)." };
  }
  if (rawItems.length > 1) {
    // ⛔ POPRAWKA 2026-10-20 (porównanie z LexAgento): ELI zwraca od najnowszych, więc dla
    // „Kodeks postępowania cywilnego” pierwszym kandydatem była nowelizacja DU/2026/1046 (KP i KPC).
    // Konsument biorący kandydaci[0] weryfikował przepis w nowelizacji. Teraz: akt bazowy, aktualny
    // t.j., inne akty, nowelizacje; osobno pola akt_bazowy i tekst_jednolity_aktualny.
    const uporzadkowane = uporzadkujKandydatow(rawItems, queryLabel);
    const bazowy = uporzadkowane[0] && rangaKandydata(uporzadkowane[0], queryLabel) === 0 ? pozycja(uporzadkowane[0]) : null;
    const tjAktualny = aktualnyTj ?? (() => {
      const tj = rawItems.find((p) => rangaKandydata(p, queryLabel) === 1);
      return tj ? pozycja(tj) : null;
    })();
    return { status: "AMBIGUOUS", ...baza, liczba_trafien: rawItems.length,
      ...(bazowy ? { akt_bazowy: bazowy } : {}),
      ...(tjAktualny ? { tekst_jednolity_aktualny: tjAktualny } : {}),
      kandydaci: uporzadkowane.slice(0, 25).map(pozycja),
      uwaga: [
        bazowy ? `Akt bazowy: ${bazowy.identyfikator}${tjAktualny ? `; powołuj aktualny t.j. ${tjAktualny.identyfikator}` : ""}. Nowelizacje są na końcu listy.` : null,
        rawItems.length > 25 ? `Pokazano 25 z ${rawItems.length} — zawęź tytuł albo podaj eli.` : null
      ].filter(Boolean).join(" ") || undefined };
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
        const pozycje = await pobierzZEli(query);
        // Akt bazowy z t.j.: aktualny t.j. z /references (pewniejszy niż tytuł obwieszczenia w wynikach).
        const bazowy = pozycje.length > 1 ? uporzadkujKandydatow(pozycje, query)[0] : null;
        const tj = bazowy && rangaKandydata(bazowy, query) === 0 && mapujStatusEli(bazowy.status, bazowy.title) === "tekst_jednolity_nieaktualny"
          ? await aktualnyTekstJednolity(bazowy.ELI ?? `${bazowy.publisher ?? "DU"}/${bazowy.year}/${bazowy.pos}`).catch(() => null)
          : null;
        wynik = normalizujOdpowiedzELI(pozycje, query, tj);
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
const PAGINA_2000_2009 = /^[^\S\n]*(?:Dziennik Ustaw|Monitor Polski)(?:[^\S\n]+Nr[^\S\n]*\d+)?[^\S\n]*(?:\n[^\S\n]*){0,2}[—–-][^\S\n]*\d+[^\S\n]*[—–-][^\S\n]*(?:\n[^\S\n]*){0,2}(?:Poz\.[^\S\n]*\d+(?:[^\S\n]*(?:,|i)[^\S\n]*\d+)*[^\S\n]*)?$/gm;

// Indeks górny z literą („131¹ᵃ”): litery w indeksie górnym → zwykłe, żeby numer nie spadł do „131”.
const LITERY_GORNE = { "ᵃ": "a", "ᵇ": "b", "ᶜ": "c", "ᵈ": "d", "ᵉ": "e", "ᶠ": "f", "ᵍ": "g", "ʰ": "h", "ⁱ": "i" };
export function normalizujNumerArt(a) {
  return String(a).trim().replace(/[ᵃᵇᶜᵈᵉᶠᵍʰⁱ]/g, (c) => LITERY_GORNE[c])
    .replace(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)([a-z]+)$/, (m, g, l) => "[" + [...g].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join("") + l + "]").replace(/^art\.?\s*/i, "").replace(/\s+/g, "")
    .replace(/[\^(]\s*(\d+[a-z]*)\s*\)?$/, "[$1]").replace(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)$/, (m) => "[" + [...m].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join("") + "]");
}

// ── Skany sprzed 2000 r. (zgł. #86): nagłówek „Art. N.” zniekształcony przez warstwę OCR
// (Konstytucja DU/1997/483 text.pdf: „Art. ISO.”, „Art.1S1.”, „Art. lOB.”, „Arł.138.”), więc artykuł
// nie jest znajdowany, a poprzedni wchłania następne. Poprawiamy tylko nagłówek na początku wiersza,
// gdy po zamianie I/l→1, S→5, O→0, B→8 numer jest liczbą; token bez cyfry i bez S/O/B zostaje
// („Art. I.”, „Art. II.” to numery rzymskie w aktach zmieniających).
const OCR_CYFRY = { I: "1", l: "1", S: "5", O: "0", B: "8" };
export function naprawNumeryArtOcr(tekst) {
  const poprawki = [];
  const t = tekst.replace(/(^|\n)([^\S\n]*)Ar([tł])(\.[^\S\n]*)([0-9IlSOB]{1,4})([^\S\n]*\.)/g, (m, p, wc, lit, kr, nr, kropka) => {
    if (!/\d/.test(nr) && !/[SOB]/.test(nr)) return m;
    const cyfry = nr.replace(/[IlSOB]/g, (c) => OCR_CYFRY[c]);
    if (cyfry === nr && lit === "t") return m;
    poprawki.push(`${lit === "t" ? "" : "Arł."}${nr}→${cyfry}`);
    return `${p}${wc}Art${kr}${cyfry}${kropka}`;
  });
  return { tekst: t, poprawki };
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

export const stronaBezTekstu = (t) => (t.match(/\p{L}/gu) ?? []).length < 3;

/** PDF → tekst aktu tym samym odczytem co RAG aplikacji (wspolne/akt-pdf.mjs): wiersze składane
 * z geometrii pozycji, przypisy z dołu strony (drobny druk) wyjęte z treści, paginy usunięte.
 * Zwraca { tekst, strony, przypisy, sha256, strony_bez_tekstu, liczba_stron }. Czysta funkcja na bajtach — testowalna offline. */
export async function tekstZPdf(dane) {
  const sha256 = createHash("sha256").update(dane).digest("hex");
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (!globalThis.pdfjsWorker) globalThis.pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  const doc = await pdfjs.getDocument({ data: dane, isEvalSupported: false, disableFontFace: true, verbosity: 0 }).promise;
  const surowe = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const elementy = (await (await doc.getPage(i)).getTextContent()).items;
    surowe.push(joinLineItems(elementy, true).replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim());
  }
  // Strona bez warstwy tekstowej (skan bez OCR, zgł. #86) dostaje znacznik zamiast cichej luki.
  // Próg: mniej niż 3 litery — DU/1998/875 zwracał 1 znak na cały dokument.
  const bezTekstu = surowe.flatMap((t, i) => (stronaBezTekstu(t) ? [i + 1] : []));
  const strony = naprawMacCEDokument(surowe)
    .map((t, i) => (!stronaBezTekstu(t) ? stripPdfPageHeaders(repairDzuPdfEncoding(t.replace(PAGINA_2000_2009, ""))).trim()
      : `[strona ${i + 1}: brak warstwy tekstowej]`));
  const { pages, footnotes } = extractPageFootnotes(strony);
  return { tekst: pages.filter(Boolean).join("\n"), strony: pages, przypisy: footnotes, sha256,
    strony_bez_tekstu: bezTekstu, liczba_stron: surowe.length };
}

async function tekstPdf(eli, url = null) {
  if (pamiecTekstu.has(eli)) return pamiecTekstu.get(eli);
  const resp = await fetch(url ?? `${ELI_BASE_URL}/${eli}/text.pdf`, { signal: sygnal(90000) });
  if (!resp.ok) throw new Error(`PDF ${eli}: HTTP ${resp.status}`);
  const t = await tekstZPdf(new Uint8Array(await resp.arrayBuffer()));
  pamiecTekstu.set(eli, t);
  return t;
}

const MIESIACE = { stycznia: 1, lutego: 2, marca: 3, kwietnia: 4, maja: 5, czerwca: 6, lipca: 7, sierpnia: 8, "września": 9, "października": 10, listopada: 11, grudnia: 12 };
/** „24 marca 2026” → „2026-03-24”; null, gdy nie da się odczytać. */
export function dataIso(tekst) {
  const m = /^(\d{1,2}) (\p{L}+) (\d{4})/u.exec(String(tekst ?? "").trim());
  const mies = m ? MIESIACE[m[2].toLocaleLowerCase("pl")] : null;
  return mies ? `${m[3]}-${String(mies).padStart(2, "0")}-${m[1].padStart(2, "0")}` : null;
}
const dzisWarszawa = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date());

/** Podział załącznika na artykuły (raz na dokument). Nagłówki: „Art. 11[1].”, „Art. 6 1 .”, zakresy
 * „Art. 133–142.”; artykuł drukowany kilkakrotnie (brzmienie obecne i przyszłe) zostaje z wydrukami. */
function artykulyDokumentu(dok) {
  if (!dok.podzial) dok.podzial = splitArticles(dok.zalacznik);
  return dok.podzial;
}

/** Cały artykuł w brzmieniu obowiązującym w dniu `dzis`, rozstrzygniętym z odnośników
 * („Obowiązuje do wejścia w życie zmiany…”, „Dodany … wejdzie w życie z dniem …”). null = brak. */
export function artykulObowiazujacy(dok, numer, dzis = dzisWarszawa()) {
  const { articles, repeats } = artykulyDokumentu(dok);
  const id = normalizeArticleId(String(numer).replace(/^art\.?\s*/i, ""));
  if (!articles[id]) return null;
  const wydruki = [articles[id], ...(repeats[id] ?? [])].map(stripTrailingHeadings);
  const oznaczony = wydruki.join("\n");
  const przypisy = dok.przypisy ?? {};
  const z = articleFootnotes(oznaczony, przypisy);
  const brzmienie = articleWording(oznaczony, przypisy, dzis);
  const wynik = { id, tresc: z.text, odnosniki: Object.fromEntries(z.notes.map((n) => [n, przypisy[n]]).filter(([, t]) => t)) };
  // Jednostka drukowana dwukrotnie także wewnątrz jednego artykułu („2. … 200 000 złotych.” obok
  // „2. … 100 000 złotych.”): brzmienie wybiera się zawsze, gdy artykuł ma odnośniki.
  if (z.notes.length || wydruki.length > 1) {
    if (brzmienie.unresolved) wynik.nierozstrzygniete = true;
    else wynik.tresc = brzmienie.text;
    if (brzmienie.pending.length) wynik.brzmienia_przyszle = brzmienie.pending;
  }
  wynik.tresc = wynik.tresc.trim();
  return wynik;
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
    na_dzien: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
      .describe("RRRR-MM-DD: brzmienie artykułu na ten dzień (wymaga `artykul`; nie wcześniej niż stan prawny t.j.)"),
  },
}, async ({ eli, artykul, szukaj, offset, wersja, na_dzien }) => {
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
    const pdf = await tekstPdf(zrodlo.eli, czysty?.url ?? null);
    const urlPdf = czysty?.url ?? `${ELI_BASE_URL}/${zrodlo.eli}/text.pdf`;
    if (pdf.liczba_stron && pdf.strony_bez_tekstu.length === pdf.liczba_stron) {
      return tekstOdp({ status: "OUT_OF_SCOPE", ...baza, result: { identyfikator: zrodlo.identyfikator, eli_zrodla_tekstu: zrodlo.eli, url_zrodlowy: urlPdf },
        powod: "PDF bez warstwy tekstowej (skan bez OCR) — treści nie odczytano. Brzmienie wyłącznie z PDF pod url_zrodlowy (odczyt wzrokowy/OCR), oznaczone jako niedeterministyczne." });
    }
    let ocr = { tekst: pdf.tekst, poprawki: [] };
    if (!czysty && Number(zrodlo.eli.split("/")[1]) < 2000) ocr = naprawNumeryArtOcr(pdf.tekst);
    const obw = { ...(wersjaTekstu === "tekst_jednolity" ? podzielObwieszczenie(ocr.tekst) : { zalacznik: ocr.tekst, nie_obejmuje: null, stan_prawny_na: null }), przypisy: pdf.przypisy };
    const result = { identyfikator: zrodlo.identyfikator, eli_bazowy: eli, eli_zrodla_tekstu: zrodlo.eli, wersja_tekstu: czysty ? "tekst_ujednolicony" : wersjaTekstu,
      status_obowiazywania: wersjaTekstu === "tekst_jednolity" ? zrodlo.status_obowiazywania : st,
      tytul_lub_nazwa: zrodlo.tytul_lub_nazwa, stan_prawny_na: obw.stan_prawny_na,
      url_zrodlowy: czysty?.url ?? `${ELI_BASE_URL}/${zrodlo.eli}/text.pdf`,
      proweniencja: { plik_sha256: pdf.sha256, ekstraktor: "pdf.js-lines/2 (wspolne/akt-pdf.mjs)",
        uwaga: "Konwersja PDF → tekst nieurzędowa; urzędowy jest PDF pod url_zrodlowy." } };
    const uw = [];
    if (czysty) uw.push(`✅ Tekst ujednolicony (wersja „U”) — ${czysty.powod}; pominięto skan text.pdf.`);
    if (wersjaTekstu === "tekst_ogloszony" && !czysty) uw.push("⚠️ Tekst OGŁOSZONY (brzmienie z dnia ogłoszenia), nie stan obecny.");
    let pewnosc = "deterministic";
    if (pdf.strony_bez_tekstu?.length) {
      result.strony_bez_tekstu = pdf.strony_bez_tekstu; pewnosc = "partial";
      uw.push(`⚠️ Strony PDF bez warstwy tekstowej: ${pdf.strony_bez_tekstu.join(", ")} z ${pdf.liczba_stron} — ich treści brak w wyniku (znacznik „[strona N: brak warstwy tekstowej]”); brak artykułu lub frazy NIE dowodzi, że ich nie ma — sprawdź PDF.`);
    }
    if (ocr.poprawki.length) {
      result.numery_art_ocr = ocr.poprawki;
      uw.push(`⚠️ Skan z warstwą OCR: poprawiono numery artykułów (${ocr.poprawki.slice(0, 12).join(", ")}${ocr.poprawki.length > 12 ? ", …" : ""}) — przed powołaniem porównaj z PDF.`);
    }
    if (obw.nie_obejmuje) result.tj_nie_obejmuje = obw.nie_obejmuje.slice(0, 4000);
    if (tj && !jestObwieszczeniemTj) {
      result.zmiany_po_tj = await zmianyPoTj(eli, tj);
      if (result.zmiany_po_tj.length) uw.push(`⚠️ ${result.zmiany_po_tj.length} akt(y) zmieniające ogłoszone po t.j. — brzmienie może być nieaktualne.`);
    }
    if (artykul) {
      const dzien = na_dzien ?? dzisWarszawa();
      if (na_dzien) {
        // T.j. scala zmiany sprzed stanu prawnego bez odnośników: wcześniejszego brzmienia z niego nie odczytasz.
        const granica = dataIso(obw.stan_prawny_na) ?? zrodlo.data_publikacji_lub_wyroku ?? null;
        if (wersjaTekstu !== "tekst_jednolity" || !granica || na_dzien < granica) {
          return tekstOdp({ status: "OUT_OF_SCOPE", ...baza, result: { ...result, na_dzien },
            powod: `Brzmienie na ${na_dzien} nie wynika z ${zrodlo.identyfikator}${granica ? ` (stan prawny / ogłoszenie: ${granica})` : ""}. ` +
              "Ustal t.j. obowiązujący w tym dniu (ELI /references) i wywołaj isap_tekst z jego ELI." });
        }
        result.na_dzien = na_dzien;
      }
      const art = artykulObowiazujacy(obw, normalizujNumerArt(artykul), dzien);
      if (!art) return tekstOdp(pewnosc === "partial"
        ? { status: "OUT_OF_SCOPE", ...baza, result, powod: `Brak „Art. ${normalizujNumerArt(artykul)}.” w odczytanym tekście, ale strony ${pdf.strony_bez_tekstu.join(", ")} nie mają warstwy tekstowej — sprawdź PDF.` }
        : { status: "NOT_FOUND", ...baza, result, uwaga: `Brak „Art. ${normalizujNumerArt(artykul)}.” w tekście ${zrodlo.identyfikator}.` });
      result.artykul = normalizujNumerArt(artykul); result.tresc = art.tresc;
      // Artykuł dodany z datą późniejszą (KPK art. 100a od 1.10.2029): cała treść w brzmieniach przyszłych.
      if (!art.tresc && art.brzmienia_przyszle?.length) {
        const od = art.brzmienia_przyszle.map((b) => b.from).filter(Boolean).sort()[0] ?? null;
        return tekstOdp({ status: "OUT_OF_SCOPE", ...baza, result: { ...result, jeszcze_nie_obowiazuje: true, wchodzi_w_zycie: od, brzmienia_przyszle: art.brzmienia_przyszle },
          powod: `Art. ${result.artykul} nie obowiązuje na ${dzien}${od ? ` — wchodzi w życie z dniem ${od}` : ""}. Nie podawaj go jako obowiązującego.` });
      }
      if (Object.keys(art.odnosniki).length) result.odnosniki = art.odnosniki;
      if (art.brzmienia_przyszle) {
        result.brzmienia_przyszle = art.brzmienia_przyszle;
        uw.push(`⚠️ T.j. drukuje też brzmienie wchodzące w życie później (brzmienia_przyszle); „tresc” = brzmienie obowiązujące ${na_dzien ? "na " + na_dzien : "dziś"}.`);
      }
      if (art.nierozstrzygniete) pewnosc = "partial";
      if (art.nierozstrzygniete) uw.push("⚠️ Kilka brzmień jednostki bez odczytywalnej daty wejścia w życie: `tresc` zawiera wszystkie — nie podawaj jej jako jednego obowiązującego brzmienia.");
      if (/^Art\.\s*\S+\.\s*\(uchylony\)/.test(art.tresc)) uw.push("⛔ Artykuł uchylony.");
    } else if (szukaj) {
      const fr = []; let i = -1; const low = obw.zalacznik.toLowerCase(), q = szukaj.toLowerCase();
      while (fr.length < 5 && (i = low.indexOf(q, i + 1)) >= 0) fr.push({ pozycja: i, fragment: obw.zalacznik.slice(Math.max(0, i - 400), i + 400) });
      if (!fr.length) return tekstOdp(pewnosc === "partial"
        ? { status: "OUT_OF_SCOPE", ...baza, result, powod: `Fraza „${szukaj}” nie występuje w odczytanym tekście, ale strony ${pdf.strony_bez_tekstu.join(", ")} nie mają warstwy tekstowej — sprawdź PDF.` }
        : { status: "NOT_FOUND", ...baza, result, uwaga: `Fraza „${szukaj}” nie występuje w tekście.` });
      result.fragmenty = fr;
    } else {
      const o = offset ?? 0; result.tresc = obw.zalacznik.slice(o, o + 20000);
      result.tresc_offset = o; result.tresc_dlugosc = obw.zalacznik.length;
    }
    uw.push("Tekst urzędowy integralny — nie parafrazuj; indeksy górne w zapisie Art. N[k].");
    return tekstOdp({ status: "FOUND", ...baza, result, uwaga: uw.join(" "), retrieved_at: new Date().toISOString(), confidence: pewnosc });
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
