#!/usr/bin/env node
/**
 * saos-mcp-server.js — REALNY, uruchamialny serwer MCP dla SAOS REST API
 * (orzeczenia sądów powszechnych i SN), zgodny z protokołem opisanym w
 * shared/MCP-INTEGRACJA.md i schematem odpowiedzi z
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 *
 * Kształt odpowiedzi API oparty na dokumentacji już istniejącej w
 * orzeczenia-sadowe-v2/SKILL.md (sekcja 1-T.1 — Faza 1-T, opisana przed tą
 * sesją, niezależnie zweryfikowana wcześniej przez autorów tego skilla):
 * pola caseNumber, judgmentDate, division.court.name / chambers (SN),
 * textContent (fragment), href. To NIE jest zgadywanie jak w przypadku ISAP —
 * ale nadal NIE zostało to potwierdzone żywym wywołaniem z tego środowiska
 * (saos.org.pl nie jest w dozwolonej liście domen sandboxa).
 *
 * ✅ STATUS 2026-09-27j: zmierzone na żywym API (test_na_zywo.mjs) — patrz blok POPRAWKA niżej.
 * ⛔ Nazwy pól z orzeczenia-sadowe-v2 ≤2.20 były błędne (caseNumber na poziomie trafienia).
 *
 * ⚠️ WAŻNE (zgodnie z orzeczenia-sadowe-v2, Zasada 5 / Faza 1-T.1): SAOS to
 * projekt akademicki (ICM UW), pełni WYŁĄCZNIE rolę wsparcia/wyszukania
 * kandydatów — NIE jest samodzielnym źródłem weryfikacji. Ten connector,
 * zgodnie z KROK 2 z shared/MCP-INTEGRACJA.md, zwraca wynik jako kandydata
 * do potwierdzenia, nigdy jako ostateczne potwierdzenie sygnatury.
 *
 * Narzędzie udostępniane: `saos_search` — nazwa zgodna z konwencją z
 * shared/KONEKTORY-REKOMENDOWANE.md.
 *
 * Uruchomienie:
 *   node saos-mcp-server.js
 *
 * Konfiguracja w kliencie MCP:
 *   {
 *     "mcpServers": {
 *       "saos": {
 *         "command": "node",
 *         "args": ["/sciezka/do/saos-mcp-server.js"]
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

// ⭐ USTALENIE 2026-09-27h: SAOS zawiera także orzeczenia KIO — courtType=NATIONAL_APPEAL_CHAMBER
//    zwraca 22 168 orzeczeń (sygnatury typu "KIO/UZP 2/07"). ⛔ KOREKTA 2026-10-02: wniosek „osobny konektor
//    zbędny” był błędny — SAOS ma KIO tylko do 6.09.2018 (pomiar 2026-10-02); od 6.155+ KIO po 2017 → kio-example.
const SAOS_BASE_URL = "https://www.saos.org.pl/api/search/judgments";

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({
  name: "saos-connector",
  version: "1.1.0",
}));

// ⛔ POPRAWKA 2026-09-27j (AUDYT-2026-09-27j) — zmierzone na żywym API:
//  (1) Sygnatura NIE leży w `item.caseNumber`, tylko w `item.courtCases[].caseNumber`.
//      Poprzedni kod zwracał `identyfikator: null` dla KAŻDEGO trafienia. Błąd przeniesiony
//      z orzeczenia-sadowe-v2 § 1-T.1 pkt 2 (poprawione tamże w 2.21).
//  (2) Izba SN: `division.chambers[].name`, nie `item.chambers`.
//  (3) `caseNumber=` jako PARAMETR zapytania to kontrola istnienia sygnatury (V-SYG-0):
//      „II PK 291/09" → 1 trafienie, fabrykat „III CZP 999/11" → 0. Narzędzie tego nie
//      udostępniało — dodany parametr `sygnatura`.
//  (4) courtType=ADMINISTRATIVE → totalResults 0 dla KAŻDEGO zapytania (także bez frazy),
//      przy 74 571 trafieniach tej samej frazy bez filtra. SAOS nie ma NSA/WSA. Zwracamy
//      zakres OUT_OF_SCOPE, nigdy „brak orzecznictwa". Właściwe źródło: CBOSA.
//  (5) enum courtType uzupełniony o CONSTITUTIONAL_TRIBUNAL (107 trafień testowych)
//      i NATIONAL_APPEAL_CHAMBER (KIO, 22 168).
//  (6) V-SYG-0: min. 3 próby, timeout 45 s (F-171: 5 z 8 wywołań bez odpowiedzi).
//  (7) textContent zawiera znaczniki <em> z podświetlenia — usuwane.

const PROBY = 3;
const TIMEOUT_MS = 45000;

function czysc(t) {
  return typeof t === "string" ? t.replace(/<\/?em>/g, "").replace(/\s+/g, " ").trim() : null;
}

function nazwaSadu(item) {
  const d = item?.division;
  if (d?.court?.name) return d.court.name;
  if (Array.isArray(d?.chambers) && d.chambers.length) {
    return "Sąd Najwyższy — " + d.chambers.map((c) => c.name).join(", ");
  }
  const mapa = {
    SUPREME: "Sąd Najwyższy",
    CONSTITUTIONAL_TRIBUNAL: "Trybunał Konstytucyjny",
    NATIONAL_APPEAL_CHAMBER: "Krajowa Izba Odwoławcza",
  };
  return mapa[item?.courtType] ?? item?.courtType ?? "nieznany sąd";
}

// ⛔ ZASIĘG SAOS (zmierzony 2026-09-28, AUDYT-2026-09-27t; totalResults rok po roku):
//    sądy powszechne — do 2026 (bieżąco); Sąd Najwyższy — ostatni rok 2016 (0 od 2017); TK — 2015 (0 od 2016);
//    KIO — 2018 częściowo (855), 0 od 2019. Brak trafienia dla sygnatury SN/TK/KIO spoza zasięgu = OUT_OF_SCOPE,
//    nie NOT_FOUND (kontrakt SYGNATURY.md: NOT_FOUND w bazie pokrywającej = „prawdopodobnie zmyślona”).
export const ZASIEG = {
  SUPREME: { doRoku: 2016, zrodlo: "sn.pl (DOSTEP-MASZYNOWY-API § SN, proxy snproxy)" },
  CONSTITUTIONAL_TRIBUNAL: { doRoku: 2015, zrodlo: "ipo.trybunal.gov.pl" },
  NATIONAL_APPEAL_CHAMBER: { doRoku: 2017, zrodlo: "narzędzie kio_sprawdz_sygnature (wyszukiwarka UZP orzeczenia.uzp.gov.pl; 2018 w SAOS tylko częściowo)" },
};
const REPERT_SN = "CZP|CSK|CSKP|CNP|CNPP|CZ|CZD|CO|CK|CKN|CKS|NSK|NSKP|NSNc|NSNk|NSNp|PK|PZP|PSK|PSKP|PZ|PO|UK|UZP|USK|USKP|UZ|UO|KK|KZP|KO|KS|KZ|KSP|KX|SNO|SDI|NO|DO|WZ|WO|WK|WA|NWW|NW";
/** Rozpoznanie sądu po sygnaturze (repertorium) i roku; null gdy nie da się ustalić. */
export function sadIRok(syg) {
  const t = String(syg ?? "").trim().replace(/\s+/g, " ");
  const rok = (yy) => { const n = Number(yy); return n < 100 ? (n >= 50 ? 1900 + n : 2000 + n) : n; };
  let m = t.match(/^KIO(?:\/UZP)?\s*\d+\/(\d{2,4})$/i); if (m) return { courtType: "NATIONAL_APPEAL_CHAMBER", rok: rok(m[1]) };
  m = t.match(/^(?:K|P|SK|U|Kp|Pp|Kpt|Ts|Tw|S)\s+\d+\/(\d{2,4})$/); if (m) return { courtType: "CONSTITUTIONAL_TRIBUNAL", rok: rok(m[1]) };
  m = t.match(new RegExp(`^[IVX]+\\s+(?:${REPERT_SN})\\s+\\d+\\/(\\d{2,4})$`)); if (m) return { courtType: "SUPREME", rok: rok(m[1]) };
  return null;
}
export function pozaZasiegiem(syg, courtType, dataOd) {
  const r = sadIRok(syg) ?? (courtType ? { courtType, rok: dataOd ? Number(String(dataOd).slice(0, 4)) : null } : null);
  const z = r && ZASIEG[r.courtType];
  if (!z || !r.rok || r.rok <= z.doRoku) return null;
  return { status: "OUT_OF_SCOPE", query_type: "orzeczenie", source: "saos", snapshot: "🟨",
    powod: `SAOS nie zawiera orzeczeń ${r.courtType === "SUPREME" ? "SN" : r.courtType === "CONSTITUTIONAL_TRIBUNAL" ? "TK" : "KIO"} po ${z.doRoku} r. (zmierzone 2026-09-28); sygnatura/zakres z ${r.rok} r. Źródło właściwe: ${z.zrodlo}. Brak trafienia NIE oznacza, że orzeczenie nie istnieje.` };
}

/**
 * Normalizuje surową odpowiedź SAOS do schematu z shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 * Czysta funkcja — testowalna bez sieci. Każdy wynik to KANDYDAT (Zasada 5).
 */
export function normalizujOdpowiedzSAOS(rawItems, kontekst = {}) {
  if (kontekst.courtType === "ADMINISTRATIVE") {
    return {
      status: "OUT_OF_SCOPE", // 27o: status wprost — kontrakt SYGNATURY.md; NOT_FOUND = „prawdopodobnie zmyślona”
      query_type: "orzeczenie",
      source: "saos",
      uwaga:
        "SAOS nie zawiera orzeczeń NSA/WSA (zmierzone 2026-09-27: totalResults=0 dla każdego " +
        "zapytania). Brak trafień NIE jest dowodem braku orzecznictwa — źródło właściwe: CBOSA.",
      snapshot: "🟨",
    };
  }
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    const w = { status: "NOT_FOUND", query_type: "orzeczenie", source: "saos" };
    w.uwaga = kontekst.sygnatura
      ? "caseNumber: 0 dopasowań w SAOS. SAOS nie jest wyczerpujący — przed uznaniem sygnatury " +
        "za nieistniejącą sprawdź źródło Tier 1 (SYGNATURY.md, V-SYG-0)."
      : "Zero trafień nie jest dowodem nieistnienia orzeczenia.";
    return w;
  }

  const zmapowane = rawItems.map((item) => {
    const sygn = (item.courtCases ?? []).map((c) => c.caseNumber).filter(Boolean);
    return {
      identyfikator: sygn.length ? sygn.join("; ") : null,
      sad: nazwaSadu(item),
      typ_sadu: item.courtType ?? null,
      rodzaj: item.judgmentType ?? null,
      data_wyroku: item.judgmentDate ?? null,
      fragment_tresci: czysc(item.textContent)?.slice(0, 300) ?? null,
      url_zrodlowy: item.id ? `https://www.saos.org.pl/judgments/${item.id}` : item.href ?? null,
      url_api: item.href ?? null,
      rola: "KANDYDAT", // SAOS = wsparcie, nie weryfikacja — Zasada 5 orzeczenia-sadowe-v2
    };
  });

  if (zmapowane.length > 1) {
    return { status: "AMBIGUOUS", query_type: "orzeczenie", source: "saos", kandydaci: zmapowane };
  }
  return {
    status: "FOUND",
    query_type: "orzeczenie",
    source: "saos",
    result: zmapowane[0],
    retrieved_at: new Date().toISOString(),
    confidence: "candidate-only", // NIE "deterministic" — wymaga weryfikacji Tier 1
  };
}

async function pobierzZSaos(params) {
  const qs = new URLSearchParams();
  if (params.sygnatura) qs.set("caseNumber", params.sygnatura);
  if (params.fraza) qs.set("all", params.fraza);
  if (params.courtType) qs.set("courtType", params.courtType);
  if (params.dataOd) qs.set("judgmentDateFrom", params.dataOd);
  if (params.dataDo) qs.set("judgmentDateTo", params.dataDo);
  qs.set("pageSize", String(params.pageSize ?? 10));
  const url = `${SAOS_BASE_URL}?${qs.toString()}`;

  let ostatni;
  for (let proba = 1; proba <= PROBY; proba++) {
    try {
      const resp = await fetch(url, { signal: sygnal(TIMEOUT_MS) });
      if (!resp.ok) throw new Error(`SAOS API zwróciło HTTP ${resp.status}`);
      // 27p: zmierzone — w czasie „Przerwy technicznej” SAOS zwraca HTTP 200 ze stroną HTML.
      const typ = resp.headers.get("content-type") ?? "";
      if (!typ.includes("json")) {
        const t = (await resp.text()).slice(0, 2000);
        throw new Error(/Przerwa techniczna/i.test(t) ? "SAOS: przerwa techniczna (HTML zamiast JSON)" : `SAOS zwrócił ${typ || "brak typu"} zamiast JSON`);
      }
      const dane = await resp.json();
      return dane.items ?? [];
    } catch (e) {
      ostatni = e;
    }
  }
  throw new Error(`${ostatni?.message ?? ostatni} (po ${PROBY} próbach, V-SYG-0)`);
}

server.registerTool(
  "saos_search",
  {
    title: "Wyszukiwanie orzeczeń w SAOS (System Analizy Orzeczeń Sądowych)",
    description:
      "SAOS REST API (ICM UW): sądy powszechne, SN, TK, KIO. BEZ NSA/WSA (użyj CBOSA). " +
      "Parametr `sygnatura` = kontrola istnienia (dokładne dopasowanie caseNumber); " +
      "`fraza` = wyszukiwanie treści (NIE potwierdza bytu sygnatury). Zwraca KANDYDATÓW " +
      "do weryfikacji Tier 1 (Zasada 5). Status: FOUND/NOT_FOUND/AMBIGUOUS/OUT_OF_SCOPE/ERROR.",
    inputSchema: {
      sygnatura: z.string().optional()
        .describe("Sygnatura do kontroli istnienia, np. 'II PK 291/09' (białe znaki istotne)"),
      fraza: z.string().optional().describe("Fraza pełnotekstowa (treść/teza/uzasadnienie)"),
      courtType: z.enum([
        "COMMON", "SUPREME", "CONSTITUTIONAL_TRIBUNAL", "NATIONAL_APPEAL_CHAMBER", "ADMINISTRATIVE",
      ]).optional().describe("Typ sądu. ADMINISTRATIVE zwraca status OUT_OF_SCOPE — SAOS nie ma NSA/WSA."),
      dataOd: z.string().optional().describe("Data początkowa, format yyyy-MM-dd"),
      dataDo: z.string().optional().describe("Data końcowa, format yyyy-MM-dd"),
      pageSize: z.number().int().min(1).max(100).optional().describe("Liczba wyników (domyślnie 10)"),
    },
  },
  async ({ sygnatura, fraza, courtType, dataOd, dataDo, pageSize }) => {
    let wynik;
    if (!sygnatura && !fraza) {
      wynik = { status: "ERROR", query_type: "orzeczenie", source: "saos",
        detail: "Podaj `sygnatura` albo `fraza`.", retrieved_at: new Date().toISOString() };
    } else if (courtType === "ADMINISTRATIVE") {
      wynik = normalizujOdpowiedzSAOS([], { courtType, sygnatura });
    } else if (!sygnatura && courtType && pozaZasiegiem(null, courtType, dataOd)) {
      wynik = pozaZasiegiem(null, courtType, dataOd);
    } else {
      try {
        const items = await pobierzZSaos({ sygnatura, fraza, courtType, dataOd, dataDo, pageSize });
        wynik = normalizujOdpowiedzSAOS(items, { courtType, sygnatura });
        if (wynik.status === "NOT_FOUND" && sygnatura) wynik = pozaZasiegiem(sygnatura) ?? wynik;
      } catch (err) {
        wynik = { status: "ERROR", query_type: "orzeczenie", source: "saos",
          detail: String(err?.message ?? err), retrieved_at: new Date().toISOString() };
      }
    }
    return { content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }] };
  }
);

// ── saos_cytator (AUDYT-2026-09-27q; luka F-212 wobec mcp-saos `saos_cite_check`) ────────────────
// Mechanika jak u konkurencji (pełnotekstowe wyszukanie późniejszych orzeczeń zawierających sygnaturę + skan
// fraz W OKNIE wokół KAŻDEGO wystąpienia sygnatury), implementacja i lista wzorców własne. Różnice:
// ścisłe dopasowanie sygnatury w treści (sam wynik wyszukiwarki nie wystarcza), wykluczenie orzeczenia
// cytowanego, osobno sygnały odstąpienia i kontekst uchwały poszerzonego składu.
// 27t: zmierzone na żywo — patrz POPRAWKA 27t niżej.
// ⛔ 27t: `\w` w JS obejmuje TYLKO litery ASCII — „odstąpi\w*” nie dopasowywało „odstąpił”, „podziela\w*” —
//    „podzielając” itd. Wszystkie końcówki fleksyjne: \p{L} (każda litera, flaga u).
const WZORCE_ODSTAPIENIA = [
  [/odst[ąa]pi\p{L}*\s+od\s+(?:tego\s+|powyższego\s+)?(?:pogl[ąa]d|stanowisk|zapatrywa|lini)/iu, "odstąpienie od poglądu"],
  [/nie\s+podziela\p{L}*\s+(?:tego\s+|powyższego\s+|wyra[żz]onego\s+)?(?:pogl[ąa]d|stanowisk|zapatrywa)/iu, "niepodzielenie poglądu"],
  [/(?:utraci[łl]\p{L}*|traci)\s+(?:na\s+)?aktualno/iu, "utrata aktualności"],
  [/zdezaktualizowa/iu, "zdezaktualizowanie"],
  [/nie\s+zas[łl]ugu\p{L}*\s+na\s+aprobat/iu, "brak aprobaty"],
  [/odmienn\p{L}*\s+(?:ni[żz]|od)\s+(?:stanowisk|pogl[ąa]d|wyra[żz]on)/iu, "stanowisko odmienne"],
  [/pogl[ąa]d\p{L}*\s+odosobnion/iu, "pogląd odosobniony"],
  // 2026-10-01 (pomiar: III CKN 1283/00 wobec III CRN 126/80): „Nie można także uznać za zadowalające odwołanie się
  //    do wyroku Sądu Najwyższego z dnia 3 października 1980 r.” — krytyka wyrażona bez słów „odstąpić”/„nie podziela”.
  [/nie\s+(?:mo[żz]na|spos[óo]b)\s+(?:tak[żz]e\s+|te[żz]\s+)?uzna\p{L}*\s+za\s+(?:zadowalaj|trafn|przekonuj)/iu, "zakwestionowanie poglądu"],
];
const WZORCE_KONTEKSTU = [
  [/uchwa[łl]\p{L}*\s+(?:sk[łl]adu\s+siedmiu|pe[łl]nego\s+sk[łl]adu|ca[łl]ej\s+izby|po[łl][ąa]czonych\s+izb)/iu, "uchwała poszerzonego składu"],
  [/zagadnieni\p{L}*\s+prawn\p{L}*\s+(?:przedstawion|budz[ąa]c|wymagaj[ąa]c)/iu, "przedstawione zagadnienie prawne"],
];

export function regexSygnatury(syg) {
  const esc = String(syg).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s*\\?\/\s*/g, "\\s*/\\s*").replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\d])${esc}(?![\\d])`, "giu");
}

/** Czysta funkcja. 27t: dla KAŻDEJ frazy liczy się NAJBLIŻSZE wystąpienie sygnatury (≤ okno); z tej relacji
 *  wynika kierunek: fraza w tym samym zdaniu tuż ZA sygnaturą, poprzedzona podmiotem („… III CKN 1283/00 Sąd
 *  Najwyższy odstąpił od…”) → cytowane orzeczenie jest AKTOREM (kontekst), w pozostałych układach → sygnał. */
// 27t: granica zdania — kropka/!/? + wielka litera, ALE nie po skrótach (r., nr, poz., art., …), nie przed sygnaturą
//      zaczynającą się cyfrą rzymską („2002 r. III CKN 1283/00”) i nie w nawiasie cytatu publikatora.
const GRANICA = /(?<!\b(?:r|nr|Nr|poz|art|ust|pkt|zob|por|np|tj|tzw|ok|str|sygn|akt|t|s|z|m\.in|k\.c|k\.p\.c|k\.p|k\.k|OSNC|OSNP|OSNCP|OSNAPiUS|LEX|Dz\.U|Dz\. U))[.!?]\s+(?![IVX]+\s+\p{Lu}{1,4}\s+\d)\p{Lu}/u;
export const toSamoZdanie = (fragment) => !GRANICA.test(fragment);
export function skanujCytowanie(tekst, syg, okno = 700) {
  // 27t: pełna treść z /api/judgments/{id} to HTML — usuwamy WSZYSTKIE znaczniki i encje.
  const t = String(tekst ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/g, " ").replace(/[\u00a0\u2009\u202f]/g, " ").replace(/\s+/g, " ");
  const wyst = [...t.matchAll(regexSygnatury(syg))].map((m) => ({ od: m.index, do: m.index + m[0].length }));
  const sygnaly = [];
  if (!wyst.length) return { wystapienia: 0, sygnaly };
  // 2026-10-01: odesłanie DATĄ. Uzasadnienia przywołują orzeczenie raz z sygnaturą („wyrok z dnia 3 października
  //    1980 r., III CRN 126/80”), a dalej samą datą („odwołanie się do wyroku … z dnia 3 października 1980 r.”) —
  //    krytyka padała ~2000 zn. od sygnatury i była niewidoczna. Data wzięta WYŁĄCZNIE z tekstu przed sygnaturą
  //    staje się dodatkową kotwicą, jeśli za nią nie stoi inna sygnatura (inne orzeczenie z tego samego dnia).
  const daty = new Set();
  for (const w of wyst) {
    const m = t.slice(Math.max(0, w.od - 80), w.od).match(/z\s+dnia\s+(\d{1,2}\s+\p{L}+\s+\d{4})\s*r\.?\s*,?\s*(?:sygn\.\s*(?:akt\s*)?)?$/u);
    if (m) daty.add(m[1]);
  }
  const liczbaSyg = wyst.length;
  for (const d of daty) {
    const re = new RegExp(`z\\s+dnia\\s+${d.replace(/\s+/g, "\\s+")}\\s*r\\.?`, "giu");
    for (const m of t.matchAll(re)) {
      const od = m.index, kon = od + m[0].length;
      if (wyst.some((w) => Math.abs(w.od - kon) < 25 || (w.od <= od && w.do >= od))) continue; // to samo przywołanie z sygnaturą
      if (/^\s*,?\s*(?:sygn\.\s*(?:akt\s*)?)?[IVX]+\s+\p{Lu}/u.test(t.slice(kon, kon + 20))) continue; // inna sygnatura z tą datą
      wyst.push({ od, do: kon, data: true });
    }
  }
  const dodaj = (typ, etykieta, pocz, kon) => {
    const i = sygnaly.findIndex((x) => x.etykieta === etykieta);
    const fr = t.slice(Math.max(0, pocz - 300), kon + 300).slice(0, 1400);
    if (i < 0) sygnaly.push({ typ, etykieta, fragment: fr });
  };
  const ocen = (wzorce, typBazowy) => {
    for (const [re, et] of wzorce) {
      for (const m of t.matchAll(new RegExp(re.source, "giu"))) {
        const fOd = m.index, fDo = m.index + m[0].length;
        const odl = (w) => (w.do <= fOd ? fOd - w.do : w.od >= fDo ? w.od - fDo : 0);
        const najbl = wyst.reduce((a, w) => (odl(w) < odl(a) ? w : a));
        if (odl(najbl) > okno) continue;
        // 27t: fraza musi być w TYM SAMYM zdaniu co sygnatura (próba na żywo: fałszywe trafienie II PK 145/11 —
        //      „nie podziela stanowiska tego Sądu [rejonowego]” w innym zdaniu, 411 zn. dalej).
        if (!toSamoZdanie(t.slice(Math.min(najbl.do, fOd), Math.max(najbl.od, fDo)))) continue;
        let typ = typBazowy, etk = et;
        if (typBazowy === "odstapienie" && najbl.do <= fOd) {
          const pom = t.slice(najbl.do, fOd);
          if (pom.length <= 250 && !/[.;]\s+\p{Lu}/u.test(pom) && /(S[ąa]d\s+Najwy[żz]sz\p{L}*|SN|Trybuna[łl]\p{L}*|Izba|S[ąa]d)\s*(?:\S+\s+){0,3}$/u.test(pom)) {
            typ = "kontekst"; etk = `cytowane orzeczenie samo odstąpiło od innego poglądu (${et})`;
          }
        }
        dodaj(typ, etk, Math.min(najbl.od, fOd), Math.max(najbl.do, fDo));
      }
    }
  };
  ocen(WZORCE_ODSTAPIENIA, "odstapienie");
  ocen(WZORCE_KONTEKSTU, "kontekst");
  return { wystapienia: liczbaSyg, sygnaly };
}

export function podsumujCytator(items, syg, pelne = new Map(), lacznie = null) {
  const baza = { query_type: "cytowania", source: "saos" };
  const norm = (x) => String(x).replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim().toUpperCase();
  const cyt = [];
  let wykluczone = 0;
  for (const it of items ?? []) {
    const wlasne = (it.courtCases ?? []).map((c) => norm(c.caseNumber));
    if (wlasne.includes(norm(syg))) { wykluczone++; continue; } // samo orzeczenie cytowane
    const tekst = pelne.get(it.id) ?? it.textContent; // pełny tekst dla próby; fragment wyszukiwarki dla reszty
    const s = skanujCytowanie(tekst, syg);
    if (!s.wystapienia) continue; // brak sygnatury w tekście — trafienie wyszukiwarki odrzucone
    cyt.push({ identyfikator: (it.courtCases ?? []).map((c) => c.caseNumber).join("; "), sad: nazwaSadu(it),
      data_wyroku: it.judgmentDate ?? null, url_zrodlowy: it.id ? `https://www.saos.org.pl/judgments/${it.id}` : null,
      przeskanowano_pelny_tekst: pelne.has(it.id), sygnaly: s.sygnaly, rola: "KANDYDAT" });
  }
  if (!cyt.length) return { status: "NOT_FOUND", ...baza, uwaga: `Brak orzeczeń w SAOS cytujących ${syg}. SAOS nie obejmuje NSA/WSA i nie jest kompletny — to nie dowód braku cytowań.` };
  const waga = (c) => (c.sygnaly.some((x) => x.typ === "odstapienie") ? 2 : c.sygnaly.length ? 1 : 0);
  cyt.sort((a, b) => waga(b) - waga(a) || String(b.data_wyroku).localeCompare(String(a.data_wyroku))); // 27t: sygnały najpierw
  const skan = cyt.filter((c) => c.przeskanowano_pelny_tekst);
  const odst = cyt.filter((c) => c.sygnaly.some((x) => x.typ === "odstapienie"));
  const kont = cyt.filter((c) => c.sygnaly.some((x) => x.typ === "kontekst"));
  const razem = lacznie != null ? Math.max(lacznie - wykluczone, cyt.length) : cyt.length;
  return { status: "FOUND", ...baza,
    result: { identyfikator: syg, liczba_cytujacych: razem, przeskanowano: skan.length,
      z_sygnalem_odstapienia: odst.length, z_kontekstem_uchwaly: kont.length,
      werdykt: odst.length ? `⚠️ Sygnały odstąpienia/krytyki w ${odst.length} z ${skan.length} przeskanowanych (najnowszych) orzeczeń cytujących — przeczytaj fragmenty.`
        : `Brak sygnałów odstąpienia w ${skan.length} najnowszych orzeczeniach cytujących (z ${razem}; heurystyka).` },
    cytujace: [...odst, ...cyt.filter((c) => !odst.includes(c))].slice(0, 20),
    uwaga: "Heurystyka językowa w oknie wokół sygnatury — nie zastępuje lektury. Wyniki = KANDYDACI. Skan pełnego tekstu obejmuje najnowsze orzeczenia; " +
      "pole referencedCourtCases SAOS jest niekompletne (27t) i nie jest używane.",
    retrieved_at: new Date().toISOString(), confidence: "candidate-only" };
}

// ⛔ POPRAWKA 27t (SAOS dostępny, zmierzone): (1) `all=III CZP 29/17` bez cudzysłowu = AND po tokenach
//    (korekta 2026-10-01: nie OR — „zachowek darowizna” 1968 < „zachowek” 3346; tokeny III/29/17 są pospolite)
//    (81 357 trafień) → fraza w cudzysłowie (5920); (2) `textContent` w wynikach wyszukiwania = FRAGMENT
//    z podświetleniem (400–900 zn.) → pełny tekst z /api/judgments/{id} dla próby najnowszych.
const PROBA_PELNEGO_TEKSTU = 25;
async function pelnyTekst(id) {
  for (let p = 1; p <= 3; p++) {
    try {
      const r = await fetch(`https://www.saos.org.pl/api/judgments/${id}`, { signal: sygnal(45000) });
      if (!(r.headers.get("content-type") ?? "").includes("json")) throw new Error("SAOS: HTML zamiast JSON");
      return (await r.json())?.data?.textContent ?? "";
    } catch (e) { if (p === 3) return null; }
  }
}

const LIMIT_PELNYCH = 60;
// ⛔ 27t (zmierzone na 6 prawdziwych parach „A nie podziela poglądu z B”): `all=<sygnatura>` bez cudzysłowu
//    traktuje sygnaturę jako osobne słowa → 17–51 tys. trafień, orzeczenie cytujące w 0/6. `all="<sygnatura>"`
//    (fraza) → 41–92 trafienia, cytujące w 6/6. Kolejność: od najnowszych (sortingField=JUDGMENT_DATE).
async function kandydaciCytujacy(syg, dataOd) {
  const qs = new URLSearchParams({ all: `"${syg}"`, pageSize: "100", sortingField: "JUDGMENT_DATE", sortingDirection: "DESC" });
  if (dataOd) qs.set("judgmentDateFrom", dataOd);
  let ostatni;
  for (let p = 1; p <= PROBY; p++) {
    try {
      const r = await fetch(`${SAOS_BASE_URL}?${qs}`, { signal: sygnal(TIMEOUT_MS) });
      if (!r.ok || !(r.headers.get("content-type") ?? "").includes("json")) throw new Error(`SAOS HTTP ${r.status}`);
      const d = await r.json(); return { items: d.items ?? [], total: d.info?.totalResults ?? null };
    } catch (e) { ostatni = e; }
  }
  throw new Error(`${ostatni?.message ?? ostatni} (po ${PROBY} próbach)`);
}
async function pelnaTresc(id) {
  for (let p = 1; p <= 3; p++) {
    try {
      const r = await fetch(`https://www.saos.org.pl/api/judgments/${id}`, { signal: sygnal(TIMEOUT_MS) });
      if (!r.ok || !(r.headers.get("content-type") ?? "").includes("json")) throw new Error(`HTTP ${r.status}`);
      return (await r.json()).data?.textContent ?? null;
    } catch (e) { if (p === 3) return null; }
  }
}

server.registerTool("saos_cytator", {
  title: "SAOS — czy orzeczenie jest nadal aprobowane (późniejsze cytowania + sygnały odstąpienia)",
  description: "Późniejsze orzeczenia (SP bieżąco; SN do 2016, TK do 2015, KIO do 2018 — zasięg SAOS) zawierające sygnaturę; " +
    "PEŁNE treści najnowszych 60 kandydatów (+ każdego z sygnałem we fragmencie), sygnały odstąpienia od poglądu w oknie wokół sygnatury. Heurystyka — KANDYDACI.",
  inputSchema: {
    sygnatura: z.string().min(4).max(40).describe("np. III CZP 29/17"),
    dataOd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("tylko orzeczenia od tej daty"),
  },
}, async ({ sygnatura, dataOd }) => {
  try {
    const { items, total } = await kandydaciCytujacy(sygnatura, dataOd);
    const norm = (x) => String(x).replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim().toUpperCase();
    const obce = items.filter((it) => !(it.courtCases ?? []).some((c) => norm(c.caseNumber) === norm(sygnatura)));
    // tani pre-skan fragmentów: kandydat z sygnałem już we fragmencie zawsze idzie do pełnego skanu
    const zSygnalem = new Set(obce.filter((it) => skanujCytowanie(it.textContent, sygnatura).sygnaly.some((x) => x.typ === "odstapienie")).map((it) => it.id));
    const kand = obce.filter((it, i) => i < LIMIT_PELNYCH || zSygnalem.has(it.id));
    // ⛔ POPRAWKA 2026-10-01 (test poprawności): wcześniej podsumujCytator dostawał tablicę bez mapy
    //    pełnych tekstów → każde cytowanie miało przeskanowano_pelny_tekst=false, `przeskanowano`=0,
    //    a werdykt brzmiał „… w 0 najnowszych orzeczeniach cytujących”, choć teksty pobrano. Do tego
    //    nieudane pobranie po cichu wracało do FRAGMENTU, a raport twierdził, że skan był pełny.
    const pelneTeksty = new Map();
    let nieudane = 0;
    for (let i = 0; i < kand.length && !budzetWyczerpany(); i += 8) {
      await Promise.all(kand.slice(i, i + 8).map(async (it) => {
        const t = await pelnaTresc(it.id);
        if (t) pelneTeksty.set(it.id, t); else nieudane++;
      }));
    }
    const w = podsumujCytator(items, sygnatura, pelneTeksty, total);
    const pominieteBudzet = kand.filter((it) => !pelneTeksty.has(it.id)).length - nieudane;
    w.zakres_skanu = { trafien_frazy: total, kandydatow_z_wyszukiwarki: items.length, przeskanowano_pelnych: pelneTeksty.size,
      nieudane_pobrania_pelnego_tekstu: nieudane, pominiete_z_braku_czasu: Math.max(0, pominieteBudzet),
      zasieg_saos: "SP do 2026; SN do 2016; TK do 2015; KIO do 2018 — późniejsze orzeczenia SN/TK/KIO niewidoczne" };
    if (nieudane || pominieteBudzet > 0) {
      w.uwaga = (w.uwaga ? w.uwaga + " " : "") + `⚠️ Skan niepełny: ${nieudane} pełnych tekstów nie pobrano, ${Math.max(0, pominieteBudzet)} pominięto z braku czasu — ` +
        "dla nich oceniono tylko fragment wyszukiwarki; brak sygnału odstąpienia NIE jest rozstrzygający.";
    }
    const sr = sadIRok(sygnatura);
    if (sr?.courtType === "SUPREME" || sr?.courtType === "CONSTITUTIONAL_TRIBUNAL") {
      w.uwaga = (w.uwaga ? w.uwaga + " " : "") + `⚠️ Cytowania przez ${sr.courtType === "SUPREME" ? "SN po 2016" : "TK po 2015"} r. poza zasięgiem SAOS — brak sygnału odstąpienia nie wyklucza późniejszej zmiany linii.`;
    }
    return { content: [{ type: "text", text: JSON.stringify(w, null, 2) }] };
  } catch (e) {
    return { content: [{ type: "text", text: JSON.stringify({ status: "ERROR", query_type: "cytowania", source: "saos", detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() }, null, 2) }] };
  }
});

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("saos-mcp-server: nasłuchuję na stdio (MCP)");
}
