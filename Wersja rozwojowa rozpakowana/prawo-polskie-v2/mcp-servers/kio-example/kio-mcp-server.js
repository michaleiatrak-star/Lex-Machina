#!/usr/bin/env node
/**
 * kio-mcp-server.js — orzeczenia Krajowej Izby Odwoławczej i sądów zamówień publicznych
 * (wyszukiwarka Urzędu Zamówień Publicznych, orzeczenia.uzp.gov.pl). 2026-10-02.
 *
 * Dostęp ustalony z kodu portalu i pomiarem na żywo (2026-10-02, sonda CI z Windows):
 *  • strona `GET /Home/Search` NIE zawiera wyników — skrypt Search.min.js pobiera je przez
 *    `POST /Home/GetResults` (formularz: Phrase, Fle=1 odmiana, SCnt=1 szukaj w treści, Sign,
 *    Dt „DD-MM-YYYY - DD-MM-YYYY”, Kind: KIO|SO|SA|SN|pusty, Pg, CountStats). To dlatego
 *    `GET /Home/Search?Sign=` wyglądał na niefiltrujący (DOSTEP-MASZYNOWY-API.md, F-185);
 *  • `Sign` W GetResults FILTRUJE: „KIO 827/18” → 1 dokument, „KIO 99999/18” → 0;
 *  • odpowiedź = fragment HTML: `#resultCounts` „wszystkie,KIO,SO,SA,SN”, pozycje `.search-list-item`
 *    (Organ wydający, Rodzaj dokumentu, Sygnatura, Data wydania DD-MM-YYYY, `.fragment`),
 *    `a.link-details` → `/Home/Details/{id}`; 10 pozycji na stronę;
 *  • treść: `GET /Home/ContentHtml/{id}?Kind=KIO` (HTML), PDF `/Home/PdfContent/{id}?Kind=KIO`;
 *    metryka (przewodniczący, zamawiający, tryb, przepisy Pzp) na `/Home/Details/{id}`.
 * Orzeczenie KIO to materiał orzeczniczy (R2A), nie źródło prawa; przepis Pzp weryfikuj w ELI.
 *
 * POPRAWKI 2026-10-02 (AUDYT-2026-10-02, pomiar z piaskownicy na żywym portalu):
 *  (1) sprawy łączone mają sygnatury rozdzielone „|” („KIO 2304/23|KIO 2306/23”, „KIO 3335/25 | KIO 3339/25 …”) —
 *      dzielenie tylko po „,;” dawało fałszywe OUT_OF_SCOPE dla każdej sygnatury poza pierwszą;
 *  (2) metryka wyroku sądu (SO/SA) ma etykietę „Sygnatura akt / Sygnatura KIO / Sposób rozstrzygnięcia”
 *      („I Ca 117/12 / KIO 44/12 / zmienia wyrok/postanowienie”) — wcześniej `sygnatury: []`, identyfikator „id N”;
 *  (3) data w źródle bywa błędna: KIO 4983/25 ma w metryce i w treści „7 grudnia 2026” (pomiar 2026-10-02,
 *      data z przyszłości) — narzędzie oddaje datę ze źródła i dodaje `ostrzezenie_daty`, nie poprawia jej samo;
 *  (4) budżet czasu wspólny z innymi serwerami (wspolne/budzet.mjs); było 2 × 40 s > 60 s klienta MCP;
 *  (5) nowe narzędzie `kio_kontrola_sadowa`: wyroki sądu zamówień publicznych na skargę na orzeczenie KIO
 *      (art. 579 ust. 1 i art. 580 ust. 1 Pzp, t.j. Dz.U. 2026 poz. 793 — brzmienie z ELI) — wyszukiwane frazą
 *      z sygnaturą KIO w dokumentach SO/SA/SN i potwierdzane polem „Sygnatura KIO” metryki (post-check).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

const B = "https://orzeczenia.uzp.gov.pl";
const NA_STRONE = 10;
const PORCJA = 20000;
const RODZAJE = { KIO: "KIO", SO: "SO", SA: "SA", SN: "SN", wszystkie: "" };
const UA = "Mozilla/5.0 (compatible; LexMachina-kio/1.0)";

const ENCJE = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export function dekoduj(t) {
  return String(t ?? "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENCJE[n.toLowerCase()] ?? m);
}
const tekst = (html) => dekoduj(String(html ?? "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|tr|h\d)>/gi, "\n").replace(/<[^>]+>/g, " "))
  .split("\n").map((l) => l.replace(/[ \t\u00a0]+/g, " ").trim()).filter(Boolean).join("\n");
const jednaLinia = (html) => tekst(html).replace(/\s+/g, " ").trim();

/** „07-12-2026” → „2026-12-07”. */
export function dataIso(t) {
  const m = /(\d{2})-(\d{2})-(\d{4})/.exec(t ?? "");
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}
/** Zakres dat formularza: „DD-MM-YYYY - DD-MM-YYYY” z dat ISO (brakujący koniec = szeroki zakres). */
export function zakresDat(od, doo) {
  if (!od && !doo) return "";
  const f = (iso) => iso.split("-").reverse().join("-");
  return `${f(od ?? "1990-01-01")} - ${f(doo ?? "2100-12-31")}`;
}
/** Sygnatury spraw łączonych: „KIO 1/25|KIO 2/25”, „KIO 1/25 | KIO 2/25”, „KIO 1/25, KIO 2/25”. */
export const rozbijSygnatury = (s) => dekoduj(s).replace(/\u00a0/g, " ").split(/\s*[|,;]\s*/).map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);
const zawiera = (lista, oczekiwana) => lista.map(normalizujSygnature).includes(oczekiwana);

/** Kontrola wiarygodności daty ze źródła: data z przyszłości albo wcześniejsza niż rok z sygnatury. */
export function ostrzezenieDaty(dataIsoStr, sygnatury, dzis = new Date().toISOString().slice(0, 10)) {
  if (!dataIsoStr) return null;
  const uw = [];
  if (dataIsoStr > dzis) uw.push(`data ${dataIsoStr} jest PÓŹNIEJSZA niż dziś (${dzis})`);
  const lata = (sygnatury ?? []).map((x) => /\/(\d{2})$/.exec(x)?.[1]).filter(Boolean).map((r) => 2000 + Number(r));
  if (lata.length && Number(dataIsoStr.slice(0, 4)) < Math.min(...lata)) uw.push(`data ${dataIsoStr} jest wcześniejsza niż rok sygnatury (${Math.min(...lata)})`);
  return uw.length ? `⚠️ Data w źródle UZP prawdopodobnie błędna: ${uw.join("; ")}. Ustal datę z treści/PDF; nie powołuj jej bez sprawdzenia.` : null;
}

export function normalizujSygnature(s) {
  return dekoduj(s).replace(/\u00a0/g, " ").toUpperCase().replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim();
}

/** Fragment HTML z /Home/GetResults → liczniki i pozycje. Czysta funkcja. */
export function parsujWyniki(surowy) {
  const html = dekoduj(surowy);
  const liczniki = (/id="resultCounts"[^>]*value="([^"]*)"|value="([^"]*)"[^>]*id="resultCounts"/.exec(html) ?? []).slice(1).find(Boolean);
  const [wszystkie, kio, so, sa, sn] = (liczniki ?? "").split(",").map((n) => Number(n));
  const pozycje = [];
  for (const blok of html.split(/<div class="search-list-item"/).slice(1)) {
    const pole = (etykieta) => {
      const m = new RegExp(`<label>\\s*${etykieta}:?\\s*</label>([\\s\\S]*?)</(?:p|div)>`, "i").exec(blok);
      return m ? jednaLinia(m[1]) : null;
    };
    const id = /href="\/Home\/Details\/(\d+)"/.exec(blok)?.[1];
    if (!id) continue;
    const fragment = /<p class="fragment">([\s\S]*?)<\/p>/.exec(blok)?.[1];
    pozycje.push({
      id,
      organ: pole("Organ wydający"),
      rodzaj: pole("Rodzaj dokumentu"),
      sygnatura: pole("Sygnatura"),
      data: dataIso(pole("Data wydania")),
      fragment: fragment ? jednaLinia(fragment) : null,
    });
  }
  const liczba = Number(/Liczba znalezionych dokumentów:\s*(\d+)/.exec(html)?.[1] ?? NaN);
  return {
    liczniki: Number.isFinite(wszystkie) ? { wszystkie, KIO: kio, SO: so, SA: sa, SN: sn } : null,
    liczba: Number.isFinite(liczba) ? liczba : null,
    pozycje,
  };
}

/** Strona /Home/Details/{id} → metryka orzeczenia. Czysta funkcja. */
export function parsujMetryke(surowy) {
  // Etykiety są zakodowane encjami („Data wydania rozstrzygni&#x119;cia”).
  const html = dekoduj(surowy);
  const pole = (etykieta) => {
    const m = new RegExp(`<label[^>]*>\\s*${etykieta}\\s*</label>(?:<br[^>]*>)?([\\s\\S]*?)</(?:p|div)>`, "i").exec(html);
    return m ? jednaLinia(m[1]) || null : null;
  };
  // KIO: „Sygnatura akt / Sposób rozstrzygnięcia”; sąd (SO/SA/SN): „Sygnatura akt / Sygnatura KIO / Sposób rozstrzygnięcia”
  const sygM = /Sygnatura akt( \/ Sygnatura KIO)? \/ Sposób rozstrzygnięcia\s*<\/label>\s*<ul>([\s\S]*?)<\/ul>/i.exec(html);
  const zKio = Boolean(sygM?.[1]);
  const rozstrzygniecia = sygM ? [...sygM[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => jednaLinia(m[1])) : [];
  const czesci = rozstrzygniecia.map((r) => r.split(" / ").map((x) => x.trim()));
  const przepisy = /Kluczowe przepisy ustawy Pzp\s*<\/b>\s*<p[^>]*>([\s\S]*?)<\/p>/i.exec(html)?.[1];
  const zagadnienia = /Zagadnienia merytoryczne[\s\S]*?<\/b>\s*<p[^>]*>([\s\S]*?)<\/p>/i.exec(html)?.[1];
  return {
    organ: pole("Organ wydający"),
    rodzaj: pole("Rodzaj dokumentu"),
    data: dataIso(pole("Data wydania rozstrzygnięcia") ?? ""),
    przewodniczacy: pole("Przewodniczący"),
    zamawiajacy: pole("Zamawiający"),
    miejscowosc: pole("Miejscowość"),
    tryb: pole("Tryb postępowania"),
    rodzaj_zamowienia: pole("Rodzaj zamówienia"),
    sygnatury: czesci.flatMap((c) => rozbijSygnatury(c[0])),
    sygnatury_kio: zKio ? czesci.flatMap((c) => rozbijSygnatury(c[1])) : [],
    sposob_rozstrzygniecia: czesci.map((c) => c[c.length - 1]).filter(Boolean),
    rozstrzygniecia,
    przepisy_pzp: przepisy ? jednaLinia(przepisy).split(/[|;]/).map((p) => p.trim()).filter(Boolean) : [],
    zagadnienia: zagadnienia ? jednaLinia(zagadnienia).split(/[|;]/).map((p) => p.trim()).filter(Boolean) : [],
  };
}

const kindDla = (organ) => /Izba Odwoławcza/i.test(organ ?? "") ? "KIO" : /Apelacyjny/i.test(organ ?? "") ? "SA" : /Najwyższy/i.test(organ ?? "") ? "SN" : /Okręgowy/i.test(organ ?? "") ? "SO" : "KIO";
const pozycjaSchematu = (p) => ({
  identyfikator: p.sygnatura,
  sygnatury: rozbijSygnatury(p.sygnatura),
  ...(ostrzezenieDaty(p.data, rozbijSygnatury(p.sygnatura)) ? { ostrzezenie_daty: ostrzezenieDaty(p.data, rozbijSygnatury(p.sygnatura)) } : {}),
  tytul_lub_nazwa: [p.rodzaj, p.sygnatura].filter(Boolean).join(" "),
  sad: p.organ,
  data_wyroku: p.data,
  rodzaj_dokumentu: p.rodzaj,
  fragment: p.fragment,
  id_kio: p.id,
  url_zrodlowy: `${B}/Home/Details/${p.id}`,
  url_podgladu: `${B}/Home/ContentHtml/${p.id}?Kind=${kindDla(p.organ)}`,
  rola: "KANDYDAT",
});

class Sesja {
  constructor() { this.cookies = new Map(); }
  async zadanie(sciezka, init = {}) {
    let ostatni;
    for (let proba = 1; proba <= 3; proba++) {
      try {
        const headers = { "User-Agent": UA, "Accept-Language": "pl-PL,pl;q=0.9", ...(init.headers ?? {}) };
        if (this.cookies.size) headers.Cookie = [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
        const r = await fetch(`${B}${sciezka}`, { ...init, headers, redirect: "manual", signal: sygnal(20000) });
        for (const c of r.headers.getSetCookie?.() ?? []) { const [kv] = c.split(";"); const i = kv.indexOf("="); if (i > 0) this.cookies.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim()); }
        if (!r.ok) throw new Error(`Wyszukiwarka UZP HTTP ${r.status}`);
        return await r.text();
      } catch (e) { ostatni = e; }
    }
    throw ostatni;
  }
  szukaj(pola) {
    return this.zadanie("/Home/GetResults", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest", Referer: `${B}/Home/Search` },
      body: new URLSearchParams(pola).toString(),
    });
  }
}

function formularz({ fraza, sygnatura, dataOd, dataDo, rodzaj = "KIO", strona = 1 }) {
  const p = { CountStats: "True", Kind: RODZAJE[rodzaj] ?? "KIO", Pg: String(strona) };
  if (fraza) Object.assign(p, { Phrase: fraza, Fle: "1", SCnt: "1" });
  if (sygnatura) p.Sign = sygnatura;
  const dt = zakresDat(dataOd, dataDo);
  if (dt) p.Dt = dt;
  return p;
}

const baza = { query_type: "orzeczenie", source: "kio-uzp" };
const NOTA = "Orzeczenia KIO i sądów zamówień z wyszukiwarki UZP to materiał orzeczniczy (R2A), nie źródło prawa; " +
  "przepisy Pzp weryfikuj w ELI. Brak trafienia nie dowodzi braku orzeczenia.";
const odp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const blad = (e) => ({ status: "ERROR", ...baza, detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() });

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "kio-connector", version: "1.1.0" }));
const DATA = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional();
const RODZAJ = z.enum(["KIO", "SO", "SA", "SN", "wszystkie"]).optional()
  .describe("KIO (domyślnie), SO/SA = sądy okręgowe/apelacyjne w sprawach zamówień, SN, wszystkie");

server.registerTool("kio_szukaj", {
  title: "Orzeczenia KIO (wyszukiwarka UZP)",
  description: "Wyszukiwanie orzeczeń Krajowej Izby Odwoławczej (oraz sądów w sprawach zamówień) po frazie w treści " +
    "(z odmianą), sygnaturze i dacie wydania. Zwraca listę: sygnatura, rodzaj, data, fragment, id do kio_pobierz.",
  inputSchema: {
    fraza: z.string().min(2).max(300).optional().describe("słowa kluczowe lub fragment treści, np. 'rażąco niska cena'"),
    sygnatura: z.string().min(3).max(40).optional().describe("np. KIO 827/18"),
    dataOd: DATA, dataDo: DATA, rodzaj: RODZAJ,
    strona: z.number().int().min(1).max(500).optional(),
  },
}, async (a) => {
  if (!a.fraza && !a.sygnatura && !a.dataOd && !a.dataDo) return odp({ status: "ERROR", ...baza, detail: "Podaj frazę, sygnaturę albo zakres dat." });
  try {
    const sesja = new Sesja();
    const w = parsujWyniki(await sesja.szukaj(formularz(a)));
    const strona = a.strona ?? 1;
    const liczba = w.liczba ?? (w.liczniki ? w.liczniki[a.rodzaj && a.rodzaj !== "wszystkie" ? a.rodzaj : "wszystkie"] : null) ?? w.pozycje.length;
    if (!w.pozycje.length) {
      return odp({ status: "OUT_OF_SCOPE", ...baza, liczba_trafien: liczba ?? 0, strona, uwaga: `Brak trafień w wyszukiwarce UZP. ${NOTA}`, retrieved_at: new Date().toISOString() });
    }
    return odp({ status: "AMBIGUOUS", ...baza, liczba_trafien: liczba, strona, stron: liczba ? Math.ceil(liczba / NA_STRONE) : null,
      liczniki_wg_organu: w.liczniki, kandydaci: w.pozycje.map(pozycjaSchematu), uwaga: NOTA, retrieved_at: new Date().toISOString() });
  } catch (e) { return odp(blad(e)); }
});

server.registerTool("kio_sprawdz_sygnature", {
  title: "Sprawdź sygnaturę orzeczenia KIO",
  description: "Czy orzeczenie o tej sygnaturze jest w wyszukiwarce UZP (dokładne dopasowanie, także sprawy łączone).",
  inputSchema: { sygnatura: z.string().min(3).max(40).describe("np. KIO 827/18") },
}, async ({ sygnatura }) => {
  try {
    const oczekiwana = normalizujSygnature(sygnatura);
    const w = parsujWyniki(await new Sesja().szukaj(formularz({ sygnatura, rodzaj: "wszystkie" })));
    const trafione = w.pozycje.filter((p) => zawiera(rozbijSygnatury(p.sygnatura), oczekiwana));
    if (!trafione.length) {
      return odp({ status: "OUT_OF_SCOPE", ...baza, oczekiwana, odrzucone: w.pozycje.map((p) => p.sygnatura),
        uwaga: `Brak dokładnego trafienia dla ${oczekiwana}. ${NOTA}`, retrieved_at: new Date().toISOString() });
    }
    return odp({ status: trafione.length === 1 ? "FOUND" : "AMBIGUOUS", ...baza,
      ...(trafione.length === 1 ? { result: pozycjaSchematu(trafione[0]) } : { kandydaci: trafione.map(pozycjaSchematu) }),
      uwaga: NOTA, retrieved_at: new Date().toISOString(), confidence: "deterministic" });
  } catch (e) { return odp(blad(e)); }
});

server.registerTool("kio_pobierz", {
  title: "Pobierz orzeczenie KIO",
  description: "Metryka (sygnatury i sposób rozstrzygnięcia, przewodniczący, zamawiający, tryb, przepisy Pzp, zagadnienia) " +
    "i treść orzeczenia po id z kio_szukaj; treść porcjami po 20 000 znaków (offset).",
  inputSchema: { id: z.string().regex(/^\d{1,9}$/).describe("id z kio_szukaj (id_kio)"), offset: z.number().int().min(0).optional() },
}, async ({ id, offset = 0 }) => {
  try {
    const sesja = new Sesja();
    const [szczegoly, tresc] = await Promise.all([
      sesja.zadanie(`/Home/Details/${id}`),
      sesja.zadanie(`/Home/ContentHtml/${id}?Kind=KIO&flection=0`),
    ]);
    const m = parsujMetryke(szczegoly);
    const calosc = tekst(tresc.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<head[\s\S]*?<\/head>/i, ""));
    if (!m.sygnatury.length && !calosc) return odp({ status: "NOT_FOUND", ...baza, uwaga: `Brak dokumentu o id ${id} w wyszukiwarce UZP.` });
    const syg = m.sygnatury.length ? m.sygnatury : rozbijSygnatury(/Sygn\.\s*akt:?\s*([^\n]{3,60})/i.exec(calosc)?.[1]?.split(/\s{2,}|WYROK|POSTANOWIENIE|UCHWAŁA/)[0]);
    const ostrz = ostrzezenieDaty(m.data, syg);
    const czesc = calosc.slice(offset, offset + PORCJA);
    return odp({ status: "FOUND", ...baza, confidence: "deterministic",
      result: {
        identyfikator: syg.join(", ") || `id ${id}`,
        sygnatury: syg,
        ...(m.sygnatury_kio.length ? { sygnatury_kio_kontrolowane: m.sygnatury_kio } : {}),
        sad: m.organ, data_wyroku: m.data, rodzaj_dokumentu: m.rodzaj,
        ...(ostrz ? { ostrzezenie_daty: ostrz } : {}),
        rozstrzygniecie: m.sposob_rozstrzygniecia.join("; ") || m.rozstrzygniecia.join("; ") || null,
        przewodniczacy: m.przewodniczacy, zamawiajacy: m.zamawiajacy, miejscowosc: m.miejscowosc,
        tryb_postepowania: m.tryb, rodzaj_zamowienia: m.rodzaj_zamowienia,
        przepisy_pzp: m.przepisy_pzp, zagadnienia: m.zagadnienia,
        tresc: czesc, tresc_offset: offset, tresc_dlugosc: calosc.length, tresc_kompletna: offset + czesc.length >= calosc.length,
        id_kio: id,
        url_zrodlowy: `${B}/Home/Details/${id}`,
        url_podgladu: `${B}/Home/ContentHtml/${id}?Kind=${kindDla(m.organ)}`,
        url_pdf: `${B}/Home/PdfContent/${id}?Kind=${kindDla(m.organ)}`,
      },
      uwaga: NOTA, retrieved_at: new Date().toISOString() });
  } catch (e) { return odp(blad(e)); }
});

server.registerTool("kio_kontrola_sadowa", {
  title: "Kontrola sądowa orzeczenia KIO (skarga do sądu zamówień publicznych)",
  description: "Czy orzeczenie KIO o danej sygnaturze było przedmiotem wyroku/postanowienia sądu na skargę (SO — sąd zamówień " +
    "publicznych, SA, SN) w bazie UZP; zwraca sygnaturę sądu i sposób rozstrzygnięcia (np. „zmienia”, „oddala”). " +
    "Brak trafienia NIE dowodzi braku skargi ani prawomocności.",
  inputSchema: { sygnatura: z.string().min(3).max(40).describe("sygnatura KIO, np. KIO 44/12") },
}, async ({ sygnatura }) => {
  try {
    const oczekiwana = normalizujSygnature(sygnatura);
    const sesja = new Sesja();
    const kand = [];
    for (const rodzaj of ["SO", "SA", "SN"]) {
      const w = parsujWyniki(await sesja.szukaj({ CountStats: "True", Kind: rodzaj, Pg: "1", Phrase: oczekiwana, Fle: "0", SCnt: "1" }));
      kand.push(...w.pozycje);
    }
    const potwierdzone = [], odrzucone = [];
    for (const p of kand.slice(0, 15)) {
      if (budzetWyczerpany()) { odrzucone.push({ sygnatura: p.sygnatura, powod: "niesprawdzone — brak czasu" }); continue; }
      const m = parsujMetryke(await sesja.zadanie(`/Home/Details/${p.id}`));
      if (zawiera(m.sygnatury_kio, oczekiwana)) {
        potwierdzone.push({ ...pozycjaSchematu(p), sad: m.organ, sygnatury_kio_kontrolowane: m.sygnatury_kio,
          rozstrzygniecie: m.sposob_rozstrzygniecia.join("; ") || null, rola: "ORZECZENIE_SADU_NA_SKARGE" });
      } else odrzucone.push({ sygnatura: p.sygnatura, powod: `metryka wskazuje ${m.sygnatury_kio.join(", ") || "inną sprawę"} — sygnatura KIO tylko w treści` });
    }
    const podstawa = "Skarga do sądu na orzeczenie Izby — art. 579 ust. 1 Pzp; sąd zamówień publicznych = SO w Warszawie (art. 580 ust. 1 Pzp; t.j. Dz.U. 2026 poz. 793, brzmienie z ELI 2026-10-02).";
    if (!potwierdzone.length) {
      return odp({ status: "OUT_OF_SCOPE", ...baza, query_type: "kontrola_sadowa", oczekiwana, odrzucone,
        uwaga: `Brak w bazie UZP orzeczenia sądu z metryką „Sygnatura KIO” = ${oczekiwana}. NIE dowodzi to prawomocności ani braku skargi — baza UZP nie jest kompletna. ${podstawa}`,
        retrieved_at: new Date().toISOString() });
    }
    const zmienia = potwierdzone.some((x) => /zmienia|uchyla/i.test(x.rozstrzygniecie ?? ""));
    return odp({ status: "FOUND", ...baza, query_type: "kontrola_sadowa", oczekiwana, result: potwierdzone[0], orzeczenia_sadu: potwierdzone, odrzucone,
      uwaga: (zmienia ? `⛔ Sąd ZMIENIŁ lub UCHYLIŁ orzeczenie ${oczekiwana} — nie powołuj go jako aktualnego stanowiska bez lektury wyroku sądu. ` : "") + podstawa,
      retrieved_at: new Date().toISOString(), confidence: "deterministic" });
  } catch (e) { return odp(blad(e)); }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("kio-mcp-server: nasłuchuję na stdio (MCP)");
}
