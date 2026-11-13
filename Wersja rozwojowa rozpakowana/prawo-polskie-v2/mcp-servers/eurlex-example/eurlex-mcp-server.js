#!/usr/bin/env node
/**
 * eurlex-mcp-server.js — serwer MCP dla CELLAR SPARQL endpoint (EUR-Lex),
 * potwierdzonego jako w pełni publiczne API bez autoryzacji — najczęściej
 * referencjonowane źródło w skillach DR tego systemu (32 odwołania,
 * sesja 2026-07-13j).
 *
 * ⚠️ STATUS UCZCIWY — NAJWYŻSZA NIEPEWNOŚĆ CO DO KSZTAŁTU ZAPYTANIA ZE
 * WSZYSTKICH 6 SERWERÓW Z TEJ SESJI: CELLAR to endpoint SPARQL (semantyczny,
 * RDF/CDM ontology), nie prosty REST z płaskim JSON jak KRS/NBP/SUDOP.
 * Poniższe zapytanie SPARQL jest uproszczonym przybliżeniem na podstawie
 * publicznej dokumentacji (szukanie dokumentu po numerze CELEX) — realna
 * ontologia CDM ma dziesiątki predykatów, a dokładna struktura zapytania
 * wymaga weryfikacji względem aktualnego schematu CDM (eur-lex.europa.eu
 * /content/help/data-reuse/reuse-contents-eurlex-details.html) przez
 * developera ZNAJĄCEGO SPARQL, zanim trafi to na produkcję.
 *
 * Limity endpointu (z dokumentacji, sesja 2026-07-13j): timeout zapytania 60s,
 * max 5 równoległych połączeń per IP, wyniki >10 000 wierszy wymagają paginacji.
 *
 * Narzędzie: `eurlex_lookup`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany, opisBleduSieci } from "../wspolne/budzet.mjs";

// ⛔ POPRAWKA 2026-09-27j (AUDYT-2026-09-27j) — diagnoza z 27h była BŁĘDNA.
//    27h: „SPARQL zwraca 406 przy Accept: application/json”. Zmierzone 27j: SPARQL zwraca
//    200 przy KAŻDYM z nagłówków (application/json, application/sparql-results+json),
//    GET i POST. Rzeczywiste przyczyny:
//    (1) 406: `format=application/sparql-results+json` doklejone BEZ kodowania — `+` w
//        query stringu to spacja, serwer dostawał „sparql-results json”.
//    (2) UKRYTY błąd pod spodem: literał bez typu ("32016R0679") zwraca PUSTE wyniki.
//        Sama naprawa (1) dałaby NOT_FOUND dla RODO — ciche fałszywe „akt nie istnieje”.
//        Wymagany literał typowany ^^xsd:string.
//    (3) CELEX był wklejany do zapytania bez walidacji (wstrzyknięcie SPARQL).
//    (4) Zapytanie nie pobierało statusu obowiązywania ani tytułu PL; zwracało zawsze
//        „obowiazuje”. Teraz: cdm:resource_legal_in-force + data końca + tytuł POL.
//    Kontrola: 32016R0679 → true; 31995L0046 → false, koniec 2018-05-24; fikcyjny → 0 wyników.
//    Pełny TEKST aktu: Cellar REST (Accept: application/xhtml+xml + Accept-Language: pol),
//    nie ten konektor — F-135: strona EUR-Lex ucina długie akty.
const CELLAR_SPARQL_URL = "https://publications.europa.eu/webapi/rdf/sparql";
const CELLAR_TEXT_URL = "http://publications.europa.eu/resource/celex/";
const CELEX_RE = /^[0-9CE][0-9]{4}[A-Z]{1,2}[0-9A-Z()_.\-]{1,20}$/;

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "eurlex-connector", version: "1.1.0" }));

export function budujZapytanieSparql(celex) {
  if (!CELEX_RE.test(celex)) throw new Error(`Niepoprawny numer CELEX: ${celex}`);
  return `
PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?work (SAMPLE(?t) AS ?title) (SAMPLE(?d) AS ?date) (SAMPLE(?f) AS ?inforce) (MAX(STR(?e)) AS ?end)
WHERE {
  ?work cdm:resource_legal_id_celex "${celex}"^^xsd:string .
  OPTIONAL { ?work cdm:work_date_document ?d . }
  OPTIONAL { ?work cdm:resource_legal_in-force ?f . }
  OPTIONAL { ?work cdm:resource_legal_date_end-of-validity ?e . }
  OPTIONAL { ?x cdm:expression_belongs_to_work ?work ;
                cdm:expression_uses_language <http://publications.europa.eu/resource/authority/language/POL> ;
                cdm:expression_title ?t . }
} GROUP BY ?work LIMIT 5`.trim();
}

function statusObowiazywania(v) {
  if (v === "1" || v === "true") return "obowiazuje";
  if (v === "0" || v === "false") return "uchylony";
  return "nieznany";
}

/** Normalizuje wynik SPARQL ({"results":{"bindings":[...]}}) do SCHEMAT-ODPOWIEDZI-MCP. */
export function normalizujOdpowiedzEURLEX(rawBindings, celex) {
  if (!Array.isArray(rawBindings) || rawBindings.length === 0) {
    return { status: "NOT_FOUND", query_type: "akt_prawny_ue", source: "eur-lex",
      uwaga: "Brak dzieła o tym numerze CELEX w Cellar. Sprawdź format numeru." };
  }
  // CELEX jest identyfikatorem JEDNOZNACZNYM. Cellar potrafi jednak zwrócić dla jednego
  // CELEX kilka ?work: obok dzieła z tytułem PL także powiązany zasób bez tytułu (np. inna
  // manifestacja wyroku TSUE). Zwijamy do dzieł z tytułem — dopiero gdy kilka z nich NADAL ma
  // tytuł, jest to realna wieloznaczność (AMBIGUOUS). Wcześniej jeden bez tytułu psuł FOUND.
  const tytulowane = rawBindings.filter((b) => b.title?.value);
  const efektywne = tytulowane.length ? tytulowane : rawBindings;
  if (efektywne.length > 1) {
    return { status: "AMBIGUOUS", query_type: "akt_prawny_ue", source: "eur-lex",
      kandydaci: efektywne.map((b) => ({ work: b.work?.value, tytul: b.title?.value ?? null })) };
  }
  const b = efektywne[0];
  const pominiete = rawBindings.length - efektywne.length;
  const status = statusObowiazywania(b.inforce?.value);
  const koniec = b.end?.value && !b.end.value.startsWith("9999") ? b.end.value : null;
  const wynik = {
    status: "FOUND",
    query_type: "akt_prawny_ue",
    source: "eur-lex",
    result: {
      identyfikator: `CELEX:${celex}`,
      tytul_lub_nazwa: b.title?.value ?? null,
      status_obowiazywania: status,
      data_publikacji_lub_wyroku: b.date?.value ?? null,
      koniec_obowiazywania: koniec,
      url_zrodlowy: `https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:${celex}`,
      // Treść aktu: eurlex_tekst (Cellar REST); strona eur-lex.europa.eu w kanale kodu daje HTTP 202 i 0 B.
      tekst_url_cellar: `${CELLAR_TEXT_URL}${celex}`,
      cellar_work: b.work?.value ?? null,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
  if (!b.title?.value) wynik.uwaga = "Brak tytułu w wersji polskiej w Cellar.";
  // „… (Tekst mający znaczenie dla EOG) - Deklaracja”: polski tytuł w Cellar obejmuje deklarację
  // opublikowaną razem z aktem (zgł. 2026-11-13, 561/2006) — to ten sam akt, nie osobne dzieło.
  if (/\s[-–]\s*(?:Deklaracj\w*|Oświadczeni\w*)\s*$/u.test(b.title?.value ?? "")) {
    wynik.result.tytul_aktu = b.title.value.replace(/\s[-–]\s*(?:Deklaracj\w*|Oświadczeni\w*)\s*$/u, "").trim();
    wynik.uwaga_tytul = "Tytuł w Cellar kończy się nazwą dołączonej do aktu deklaracji/oświadczenia; tytul_aktu = tytuł samego aktu.";
  }
  // Cellar potrafi trzymać dla aktu obowiązującego kilka dat końca (561/2006: 2014-02-28 i 9999-12-31,
  // zgł. 2026-11-13): bierzemy najpóźniejszą; data przeszła przy statusie „obowiązuje” jest sprzeczna.
  if (status === "obowiazuje" && koniec && koniec < new Date().toISOString().slice(0, 10)) {
    wynik.result.koniec_obowiazywania = null;
    wynik.uwaga_daty = `Cellar podaje datę końca ${koniec} sprzeczną ze statusem „obowiązuje” — pominięto; sprawdź w tekście skonsolidowanym.`;
  }
  if (status === "uchylony") {
    wynik.uwaga = `⛔ Akt nie obowiązuje${koniec ? ` od dnia następnego po ${koniec}` : ""} ` +
      `(uchylony lub wygasły). Nie powołuj jako prawa obowiązującego.`;
  }
  if (pominiete > 0) {
    wynik.uwaga = `${wynik.uwaga ? wynik.uwaga + " " : ""}` +
      `Cellar zwrócił też ${pominiete} powiązany zasób bez tytułu PL dla tego CELEX — pominięto.`;
  }
  return wynik;
}

export async function zapytajSparql(query, ms = 40000) {
  const body = new URLSearchParams({ query });
  let ostatni;
  for (let proba = 1; proba <= 3; proba++) {
    try {
      const resp = await fetch(CELLAR_SPARQL_URL, { method: "POST", headers: { Accept: "application/sparql-results+json" }, body, signal: sygnal(ms) });
      if (!resp.ok) throw new Error(`CELLAR SPARQL zwrócił HTTP ${resp.status}`);
      return (await resp.json())?.results?.bindings ?? [];
    } catch (e) { ostatni = e; }
  }
  throw ostatni;
}

/** Najnowszy tekst skonsolidowany aktu (CELEX 0…-RRRRMMDD) albo null. */
export async function najnowszaKonsolidacja(celex) {
  if (!CELEX_RE.test(celex) || !/^3/.test(celex)) return null;
  const rows = await zapytajSparql(`PREFIX cdm: <http://publications.europa.eu/ontology/cdm#> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?cx WHERE { ?w cdm:resource_legal_id_celex "${celex}"^^xsd:string . ?c cdm:act_consolidated_consolidates_resource_legal ?w ; cdm:resource_legal_id_celex ?cx . } ORDER BY DESC(?cx) LIMIT 1`);
  const cx = rows[0]?.cx?.value;
  const m = /-(\d{4})(\d{2})(\d{2})$/.exec(cx ?? "");
  return cx ? { celex: cx, data: m ? `${m[1]}-${m[2]}-${m[3]}` : null, tekst_url_cellar: `${CELLAR_TEXT_URL}${cx}` } : null;
}

async function pobierzZCellar(celex) {
  const body = new URLSearchParams({ query: budujZapytanieSparql(celex) });
  let ostatni;
  for (let proba = 1; proba <= 3; proba++) {
    try {
      const resp = await fetch(CELLAR_SPARQL_URL, {
        method: "POST",
        headers: { Accept: "application/sparql-results+json" },
        body,
        signal: sygnal(40000),
      });
      if (!resp.ok) throw new Error(`CELLAR SPARQL zwrócił HTTP ${resp.status}`);
      const dane = await resp.json();
      return dane?.results?.bindings ?? [];
    } catch (e) { ostatni = e; }
  }
  throw ostatni;
}

server.registerTool(
  "eurlex_lookup",
  {
    title: "Akt prawa UE w Cellar po numerze CELEX — metadane i status obowiązywania",
    description:
      "Tytuł (PL), data, status obowiązywania i data końca obowiązywania aktu UE z Cellar " +
      "(SPARQL) po numerze CELEX, np. 32016R0679 (RODO). FOUND/NOT_FOUND/AMBIGUOUS/ERROR. " +
      "Podaje też najnowszą konsolidację (CELEX 0…-RRRRMMDD). Treść artykułu: eurlex_tekst.",
    inputSchema: {
      celex: z.string().regex(CELEX_RE).describe("Numer CELEX, np. '32016R0679' (RODO)"),
    },
  },
  async ({ celex }) => {
    let wynik;
    try {
      wynik = normalizujOdpowiedzEURLEX(await pobierzZCellar(celex), celex);
      if (wynik.status === "FOUND") {
        try { wynik.result.konsolidacja_najnowsza = await najnowszaKonsolidacja(celex); }
        catch { wynik.result.konsolidacja_najnowsza = null; }
      }
    } catch (err) {
      wynik = { status: "ERROR", query_type: "akt_prawny_ue", source: "eur-lex",
        detail: String(err?.message ?? err), retrieved_at: new Date().toISOString() };
    }
    return { content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }] };
  }
);

// ── eurlex_tsue (AUDYT-2026-09-27q; luka F-212 wobec mcp-eu-sparql `search_cjeu*`) ─────────────────
// Zmierzone 27q: (1) ECLI jako literał BEZ typu → 0 wyników, z ^^xsd:string → trafienie (ta sama pułapka co
// CELEX); konkurencja omija ją porównaniem tekstowym FILTER (wolniej). (2) SYGNATURA SPRAWY — tak powołują
// prawnicy („C-131/12”) — nie jest wyszukiwaniem u konkurencji; tu przeliczana deterministycznie na CELEX:
// sektor 6 + rok + rodzaj + numer (C-131/12 → 62012CJ0131 wyrok, 62012CC0131 opinia RG; 380 ms).
// (3) fraza w polskim tytule: „93/13”, wyroki od 2019 → 1,3 s.
const RODZAJE = { J: "wyrok", O: "postanowienie", C: "opinia rzecznika generalnego", V: "opinia Trybunału", P: "stanowisko rzecznika generalnego" };
const SYG_RE = /^\s*(?:([CTF])\s*[-–]\s*)?(\d{1,4})\s*\/\s*(\d{2}|\d{4})\s*(P)?\s*$/i;

/** „C-131/12” → kandydaci CELEX (wyrok, postanowienie, opinia RG…). null, gdy format nie pasuje. */
export function sygnaturaNaCelex(syg) {
  const m = String(syg).match(SYG_RE);
  if (!m) return null;
  const sad = (m[1] ?? "C").toUpperCase();
  let rok = Number(m[3]); if (rok < 100) rok += rok >= 50 ? 1900 : 2000;
  const nr = String(m[2]).padStart(4, "0");
  const litery = sad === "C" ? ["J", "O", "C", "V", "P"] : ["J", "O"];
  return litery.map((l) => `6${rok}${sad}${l}${nr}`);
}

// Tytuł PL w Cellar: „opis#strony#przedmiot…” (liczba części zmienna — zmierzone 27q).
const tytulPl = (t) => { const [opis, strony, ...reszta] = String(t ?? "").split("#").map((x) => x.trim()); return { opis: opis || null, strony: strony || null, przedmiot: reszta.filter(Boolean).join(" ") || null }; };
/** 62012CJ0131 → „C-131/12”; orzeczenia sprzed 1989 (bez sądu pierwszej instancji) też z literą C. */
export function celexNaSygnature(c) {
  const m = String(c).match(/^6(\d{4})([CTF])[A-Z](\d{4})$/);
  return m ? `${m[2]}-${Number(m[3])}/${m[1].slice(2)}` : null;
}

export function normalizujTsue(bindings, zapytanie) {
  const baza = { query_type: "orzeczenie_tsue", source: "eur-lex" };
  const po = new Map();
  for (const b of bindings) {
    const c = b.celex?.value; if (!c || po.has(c)) continue;
    const t = tytulPl(b.title?.value);
    po.set(c, { identyfikator: celexNaSygnature(c) ?? c, celex: c, ecli: b.ecli?.value ?? null,
      rodzaj: RODZAJE[c.charAt(6)] ?? c.slice(5, 7), data_publikacji_lub_wyroku: b.date?.value ?? null,
      tytul_lub_nazwa: t.opis, strony: t.strony, przedmiot: t.przedmiot,
      url_zrodlowy: `https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:${c}` });
  }
  const lista = [...po.values()].sort((a, b) => String(b.data_publikacji_lub_wyroku).localeCompare(String(a.data_publikacji_lub_wyroku)));
  if (!lista.length) return { status: "NOT_FOUND", ...baza, uwaga: `Brak orzeczeń TSUE dla: ${zapytanie}.` };
  if (zapytanie.tryb === "fraza") return { status: lista.length > 1 ? "AMBIGUOUS" : "FOUND", ...baza, liczba_trafien: lista.length, kandydaci: lista.map((k) => ({ ...k, rola: "KANDYDAT" })) };
  const glowny = lista.find((k) => k.celex.charAt(6) === "J") ?? lista[0];
  return { status: "FOUND", ...baza, result: glowny, powiazane: lista.filter((k) => k !== glowny),
    retrieved_at: new Date().toISOString(), confidence: "deterministic" };
}

const TYT = `OPTIONAL { ?x cdm:expression_belongs_to_work ?w ; cdm:expression_uses_language <http://publications.europa.eu/resource/authority/language/POL> ; cdm:expression_title ?title . }`;
export function zapytanieTsue({ sygnatura, ecli, celex, fraza, dataOd, limit }) {
  const P = "PREFIX cdm: <http://publications.europa.eu/ontology/cdm#> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n";
  const pola = "SELECT ?celex ?ecli ?date ?title WHERE {";
  const reszta = `OPTIONAL { ?w cdm:case-law_ecli ?ecli } OPTIONAL { ?w cdm:work_date_document ?date } ${TYT} }`;
  if (sygnatura || celex) {
    const lista = celex ? [celex] : sygnaturaNaCelex(sygnatura);
    if (!lista) throw new Error(`Nierozpoznany format sygnatury: ${sygnatura} (oczekiwane np. C-131/12, T-604/18, 131/85)`);
    for (const c of lista) if (!/^6\d{4}[A-Z]{2}\d{4}$/.test(c)) throw new Error(`Niepoprawny CELEX orzeczenia: ${c}`);
    return P + pola + ` VALUES ?celex { ${lista.map((c) => `"${c}"^^xsd:string`).join(" ")} } ?w cdm:resource_legal_id_celex ?celex . ` + reszta;
  }
  if (ecli) {
    if (!/^ECLI:EU:[CTF]:\d{4}:\d{1,6}$/i.test(ecli)) throw new Error(`Niepoprawny ECLI: ${ecli}`);
    return P + pola + ` ?w cdm:case-law_ecli "${ecli.toUpperCase()}"^^xsd:string ; cdm:resource_legal_id_celex ?celex . BIND("${ecli.toUpperCase()}" AS ?ecli) OPTIONAL { ?w cdm:work_date_document ?date } ${TYT} }`;
  }
  const f = String(fraza).toLowerCase().replace(/["\\]/g, "");
  return P + `SELECT DISTINCT ?celex ?ecli ?date ?title WHERE { ?w cdm:work_has_resource-type <http://publications.europa.eu/resource/authority/resource-type/JUDG> ; cdm:resource_legal_id_celex ?celex ; cdm:work_date_document ?date . FILTER(?date >= "${dataOd ?? "2015-01-01"}"^^xsd:date) ?x cdm:expression_belongs_to_work ?w ; cdm:expression_uses_language <http://publications.europa.eu/resource/authority/language/POL> ; cdm:expression_title ?title . FILTER(CONTAINS(LCASE(STR(?title)), "${f}")) OPTIONAL { ?w cdm:case-law_ecli ?ecli } } ORDER BY DESC(?date) LIMIT ${Math.min(limit ?? 20, 50) * 2}`;
}

server.registerTool("eurlex_tsue", {
  title: "Orzecznictwo TSUE — po sygnaturze sprawy, ECLI, CELEX albo frazie",
  description: "Sygnatura („C-131/12”, „T-604/18”) przeliczana na CELEX; ECLI; CELEX (6…); fraza w polskim tytule " +
    "(wyroki od `dataOd`, domyślnie 2015). Wynik: wyrok jako result, opinia RG/postanowienia jako powiązane.",
  inputSchema: {
    sygnatura: z.string().max(20).optional(), ecli: z.string().max(40).optional(),
    celex: z.string().regex(/^6\d{4}[A-Z]{2}\d{4}$/).optional(), fraza: z.string().min(3).max(80).optional(),
    dataOd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), limit: z.number().int().min(1).max(50).optional(),
  },
}, async (a) => {
  const baza = { query_type: "orzeczenie_tsue", source: "eur-lex" };
  try {
    if (!a.sygnatura && !a.ecli && !a.celex && !a.fraza) throw new Error("Podaj sygnatura, ecli, celex albo fraza.");
    const body = new URLSearchParams({ query: zapytanieTsue(a) });
    let ostatni, dane;
    for (let proba = 1; proba <= 3 && !dane; proba++) {
      try { const r = await fetch(CELLAR_SPARQL_URL, { method: "POST", headers: { Accept: "application/sparql-results+json" }, body, signal: sygnal(60000) });
        if (!r.ok) throw new Error(`CELLAR SPARQL HTTP ${r.status}`); dane = await r.json(); } catch (e) { ostatni = e; }
    }
    if (!dane) throw ostatni;
    const w = normalizujTsue(dane.results?.bindings ?? [], { ...a, tryb: a.fraza && !a.sygnatura && !a.ecli && !a.celex ? "fraza" : "id" });
    if (w.kandydaci) w.kandydaci = w.kandydaci.slice(0, a.limit ?? 20);
    return { content: [{ type: "text", text: JSON.stringify(w, null, 2) }] };
  } catch (e) {
    return { content: [{ type: "text", text: JSON.stringify({ status: "ERROR", ...baza, detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() }, null, 2) }] };
  }
});

// ── eurlex_tekst (zgł. 2026-11-13: router wymaga brzmienia artykułu, eurlex_lookup daje tylko metrykę) ──
// Cellar REST: Accept application/xhtml+xml + Accept-Language pol (kanał z DOSTEP-MASZYNOWY-API §3,
// ten sam co w aplikacji: eu-law-verifier). Artykuł: element id="art_N" albo od tytułu „Artykuł N”
// do następnego artykułu lub załącznika.
const ARTYKUL_TYTUL = /<p\b[^>]*class="(?:title-article-norm|ti-art|oj-ti-art)"[^>]*>\s*Artykuł\s+(\d+[a-z]*)\s*<\/p>/giu;
export function czytelny(html) {
  return String(html)
    .replace(/<sup\b[^>]*>([\s\S]*?)<\/sup>/giu, "^$1")
    .replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/giu, " ")
    .replace(/<\s*(?:br\b[^>]*|\/?(?:p|div|li|tr|td|th|h[1-6]|table)\b[^>]*)>/giu, "\n")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&nbsp;|&#160;/gu, " ").replace(/&amp;/gu, "&").replace(/&lt;/gu, "<").replace(/&gt;/gu, ">").replace(/&quot;/gu, '"')
    .normalize("NFKC").replace(/[ \t\f\v]+/gu, " ").replace(/ *\n */gu, "\n").replace(/\n{2,}/gu, "\n").trim();
}
export function artykulUe(html, artykul) {
  const nr = String(artykul).toLowerCase().replace(/^art\.?\s*/u, "").match(/^\d+[a-z]*/u)?.[0];
  if (!nr) return null;
  const start = html.search(new RegExp(`<div\\b[^>]*\\bid="art_${nr}"`, "u"));
  if (start >= 0) {
    let depth = 0; const tags = /<\/?div\b[^>]*>/giu; tags.lastIndex = start;
    for (let t = tags.exec(html); t; t = tags.exec(html)) {
      depth += t[0].startsWith("</") ? -1 : 1;
      if (depth === 0) return czytelny(html.slice(start, t.index + t[0].length));
    }
  }
  const tytuly = [...html.matchAll(ARTYKUL_TYTUL)];
  const i = tytuly.findIndex((m) => m[1].toLowerCase() === nr);
  if (i < 0) return null;
  const od = tytuly[i].index, doK = tytuly[i + 1]?.index ?? html.length;
  const zal = html.slice(od, doK).search(/<p\b[^>]*class="(?:title-annex-1|doc-ti|oj-doc-ti)"/u);
  return czytelny(html.slice(od, zal > 0 ? od + zal : doK));
}
export function artykulyUe(html) {
  const ids = [...html.matchAll(/<div\b[^>]*class="eli-subdivision"[^>]*\bid="art_(\d+[a-z]*)"/gu)].map((m) => m[1]);
  return ids.length ? ids : [...html.matchAll(ARTYKUL_TYTUL)].map((m) => m[1]);
}
async function pobierzTekstCellar(celex) {
  const url = `${CELLAR_TEXT_URL}${celex}`;
  let ostatni;
  for (let proba = 1; proba <= 3; proba++) {
    try {
      const r = await fetch(url, { headers: { Accept: "application/xhtml+xml", "Accept-Language": "pol" }, redirect: "follow", signal: sygnal(60000) });
      if (r.status >= 500 && proba < 3) { ostatni = new Error(`Cellar HTTP ${r.status} (${(await r.text()).slice(0, 120)})`); await new Promise((ok) => setTimeout(ok, 1500 * proba)); continue; }
      if (!r.ok) throw Object.assign(new Error(`Cellar HTTP ${r.status}`), { http: r.status });
      return { url, html: await r.text() };
    } catch (e) { ostatni = e.http ? e : new Error(opisBleduSieci(e, "publications.europa.eu"), { cause: e }); if (e.http) break; }
  }
  throw ostatni;
}
server.registerTool("eurlex_tekst", {
  title: "Treść aktu UE z Cellar — cały tekst porcjami albo jeden artykuł",
  description: "Brzmienie aktu UE po CELEX (także konsolidacji 0…-RRRRMMDD) z Cellar REST. Z `artykul` (np. \"10\") — tekst artykułu; " +
    "bez — porcja tekstu (offset) i lista artykułów. Domyślnie najnowsza konsolidacja, gdy istnieje (pole wersja). FOUND/NOT_FOUND/ERROR.",
  inputSchema: {
    celex: z.string().regex(CELEX_RE).describe("CELEX aktu, np. 32006R0561, albo konsolidacji 02006R0561-20241231"),
    artykul: z.string().max(20).optional().describe("Numer artykułu, np. \"10\" albo \"6a\""),
    wersja: z.enum(["najnowsza", "pierwotna"]).optional().describe("najnowsza (domyślnie) = ostatnia konsolidacja; pierwotna = tekst z Dz.Urz."),
    offset: z.number().int().min(0).optional(),
  },
}, async ({ celex, artykul, wersja, offset }) => {
  const baza = { query_type: "tekst_aktu_ue", source: "cellar" };
  try {
    let cel = celex, konsolidacja = null;
    if ((wersja ?? "najnowsza") === "najnowsza" && /^3/.test(celex)) {
      try { konsolidacja = await najnowszaKonsolidacja(celex); } catch { konsolidacja = null; }
      if (konsolidacja) cel = konsolidacja.celex;
    }
    const { url, html } = await pobierzTekstCellar(cel);
    const wynik = { status: "FOUND", ...baza, celex: cel, akt: celex, wersja: cel === celex ? "tekst wskazany" : `konsolidacja ${konsolidacja.data}`, url_zrodlowy: url, retrieved_at: new Date().toISOString(),
      uwaga: "Tekst skonsolidowany UE to dokument dokumentacyjny; moc prawną ma wersja z Dz.Urz. UE." };
    if (artykul) {
      const t = artykulUe(html, artykul);
      if (!t) return { content: [{ type: "text", text: JSON.stringify({ status: "NOT_FOUND", ...baza, celex: cel, artykul, uwaga: `Brak artykułu ${artykul} w tym tekście.`, artykuly: artykulyUe(html).slice(0, 200) }, null, 2) }] };
      wynik.artykul = artykul; wynik.tekst = t.slice(0, 15000); if (t.length > 15000) wynik.uwaga += " Artykuł ucięty do 15 000 znaków.";
    } else {
      const caly = czytelny(html), od = Math.min(offset ?? 0, caly.length);
      Object.assign(wynik, { offset: od, nastepny_offset: od + 15000 < caly.length ? od + 15000 : null, dlugosc: caly.length, artykuly: artykulyUe(html).slice(0, 400), tekst: caly.slice(od, od + 15000) });
    }
    return { content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }] };
  } catch (e) {
    return { content: [{ type: "text", text: JSON.stringify({ status: "ERROR", ...baza, celex, retryable: !e?.http || e.http >= 500, detail: String(e?.message ?? e),
      uwaga: "Cellar niedostępny — to awaria źródła, nie dowód nieistnienia aktu; ponów później.", retrieved_at: new Date().toISOString() }, null, 2) }] };
  }
});

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("eurlex-mcp-server: nasłuchuję na stdio (MCP)");
}
