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
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

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
const CELEX_RE = /^[0-9CE][0-9]{4}[A-Z]{1,2}[0-9A-Z()_.\-]{1,20}$/;

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "eurlex-connector", version: "1.1.0" }));

export function budujZapytanieSparql(celex) {
  if (!CELEX_RE.test(celex)) throw new Error(`Niepoprawny numer CELEX: ${celex}`);
  return `
PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?work (SAMPLE(?t) AS ?title) (SAMPLE(?d) AS ?date) (SAMPLE(?f) AS ?inforce) (SAMPLE(?e) AS ?end)
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
      cellar_work: b.work?.value ?? null,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
  if (!b.title?.value) wynik.uwaga = "Brak tytułu w wersji polskiej w Cellar.";
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
      "Nie pobiera pełnego tekstu.",
    inputSchema: {
      celex: z.string().regex(CELEX_RE).describe("Numer CELEX, np. '32016R0679' (RODO)"),
    },
  },
  async ({ celex }) => {
    let wynik;
    try {
      wynik = normalizujOdpowiedzEURLEX(await pobierzZCellar(celex), celex);
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

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("eurlex-mcp-server: nasłuchuję na stdio (MCP)");
}
