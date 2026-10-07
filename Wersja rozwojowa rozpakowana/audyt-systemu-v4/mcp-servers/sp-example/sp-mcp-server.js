#!/usr/bin/env node
/**
 * sp-mcp-server.js — orzeczenia sądów powszechnych (SR/SO/SA) z Portalu Orzeczeń
 * Sądów Powszechnych (orzeczenia.ms.gov.pl i portale poszczególnych sądów). 2026-10-06.
 *
 * Mechanika (pomiar 2026-09-13, shared/DOSTEP-MASZYNOWY-API.md, V-SYG-0.6):
 *  • GET po sygnaturze bez sesji, kontekst Tapestry (spacja → $0020, „/” → $002f), 17 pozycji,
 *    sygnatura na pozycji 2: /search/advanced/$N/{SYG}/$N×15/{strona};
 *    trafienia: <span class="big_number">N</span> + odnośniki /details/$N/{docId};
 *    brak: „Nie znaleziono żadnego wyniku pasującego do zapytania”.
 *  • Sygnatura nie jest unikalna krajowo (I C 100/15 → 9 sądów) — portal konkretnego sądu
 *    (orzeczenia.{sad}.sr|so|sa.gov.pl) rozstrzyga AMBIGUOUS.
 *  • ⛔ UA: 200 pod neutralnym UA, 502 pod łańcuchem Chrome — wysyłamy neutralny.
 *  • Linki są STAŁE: link do samego orzeczenia /content/$N/{docId}, metryka /details/$N/{docId}.
 *  • Wyszukiwanie po frazie: portal nie ma udokumentowanego GET po frazie — SAOS (RZĄD 3, agregator
 *    akademicki) służy tylko do znalezienia orzeczenia; źródłem jest link do portalu urzędowego z SAOS
 *    (source.judgmentUrl). SAOS zastępuje portal tylko przy jego awarii.
 * Orzeczenie to materiał orzeczniczy (RZĄD 2A z portalu), nie źródło brzmienia przepisu (ELI).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer } from "../wspolne/budzet.mjs";
import { formularze, daneFormularza } from "../wspolne/formularz.mjs";

const AGREGAT = "https://orzeczenia.ms.gov.pl";
const UA = "LexMachina-sp/1.0 (+https://github.com/michaleiatrak-star/Lex-machina-aplikacja)";
const SAOS = "https://www.saos.org.pl/api";
const PORCJA = 20000;
const RODZAJ = { Uz: "uzasadnienie", Wy: "wyrok", Po: "postanowienie", Uc: "uchwała", Za: "zarządzenie", Np: "nakaz zapłaty" };

/** „I  C 100 / 15” → „I C 100/15”. */
export function normalizujSygnature(s) {
  return String(s ?? "").normalize("NFKC").replace(/\./g, "").replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim();
}

/** Wartość w kontekście Tapestry: litery i cyfry bez zmian, pozostałe znaki → $XXXX (np. spacja $0020, „/” $002f, „ą” $0105). */
export const kodujTapestry = (s) => [...normalizujSygnature(s)]
  .map((z) => (/[A-Za-z0-9]/.test(z) ? z : "$" + z.codePointAt(0).toString(16).padStart(4, "0")))
  .join("");

/** Host portalu: agregat albo portal sądu („poznan.so” → orzeczenia.poznan.so.gov.pl). */
export function hostPortalu(sad) {
  if (!sad) return AGREGAT;
  const s = String(sad).trim().toLowerCase().replace(/^orzeczenia\./, "").replace(/\.gov\.pl\/?$/, "");
  if (!/^[a-z0-9-]{2,40}\.(sr|so|sa)$/.test(s)) throw new Error(`Nieprawidłowy portal sądu: ${sad} (np. poznan.so, warszawa.sa)`);
  return `https://orzeczenia.${s}.gov.pl`;
}

/**
 * Czy nazwa sądu (SAOS: „Sąd Okręgowy w Poznaniu”) odpowiada kodowi portalu („poznan.so”): rodzaj sądu + rdzeń
 * nazwy miasta bez znaków diakrytycznych. Zachowawczo: kod złożony („warszawa-praga.so”) dopasowuje też
 * sąd z tym samym rdzeniem — wtedy wynik pozostaje AMBIGUOUS. Czysta funkcja (6.202).
 */
export function pasujeDoSadu(nazwa, kod) {
  const m = /^([a-z0-9-]{2,40})\.(sr|so|sa)$/.exec(String(kod ?? "").trim().toLowerCase().replace(/^orzeczenia\./, "").replace(/\.gov\.pl\/?$/, ""));
  if (!m) return false;
  const n = String(nazwa ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L").toLowerCase();
  const rodzaj = { sr: "rejonowy", so: "okregowy", sa: "apelacyjny" }[m[2]];
  const miasto = m[1].split("-")[0];
  return n.includes(rodzaj) && n.includes(miasto.slice(0, Math.min(5, miasto.length)));
}

export function dozwolonyHost(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && (u.hostname === "orzeczenia.ms.gov.pl" || /^orzeczenia\.[a-z0-9-]{2,40}\.(sr|so|sa)\.gov\.pl$/.test(u.hostname));
  } catch {
    return false;
  }
}

export const urlSzukania = (host, syg, strona = 1) => `${host}/search/advanced/$N/${kodujTapestry(syg)}${"/$N".repeat(15)}/${strona}`;
/** Fraza w pierwszym polu formularza zaawansowanego (pozycja 1 kontekstu, sygnatura pusta). */
export const urlSzukaniaFrazy = (host, fraza, strona = 1) => `${host}/search/advanced/${kodujTapestry(fraza)}/$N${"/$N".repeat(15)}/${strona}`;

/** Czy tekst orzeczenia zawiera frazę (wszystkie słowa ≥ 4 znaki, bez odmiany: pierwsze 5 liter). Czysta funkcja. */
export function zawieraFraze(tekstDok, fraza) {
  const t = String(tekstDok).toLocaleLowerCase("pl");
  const slowa = String(fraza).toLocaleLowerCase("pl").split(/[^\p{L}\d]+/u).filter((w) => w.length >= 4);
  return slowa.length > 0 && slowa.every((w) => t.includes(w.slice(0, 5)));
}
export const urlOrzeczenia = (host, docId) => `${host}/content/$N/${docId}`;
export const urlMetryki = (host, docId) => `${host}/details/$N/${docId}`;

/**
 * Identyfikator dokumentu portalu, np. 155000000001006_I_C_000100_2015_Uz_2015-06-18_001
 * → sygnatura I C 100/15, rodzaj, data. Nierozpoznany kształt → tylko id.
 */
export function rozbierzDocId(docId) {
  const m = /^(\d{6,})_([IVXL]{1,6})_([A-Za-z]{1,6})_0*(\d{1,6})_(\d{4})_([A-Za-z]{1,4})_(\d{4}-\d{2}-\d{2})_(\d{1,4})$/.exec(String(docId));
  if (!m) return { docId };
  const [, kodSadu, wydzial, rep, nr, rok, typ, data] = m;
  return { docId, kodSadu, sygnatura: `${wydzial} ${rep} ${nr}/${rok.slice(2)}`, rodzaj: RODZAJ[typ] ?? typ, data };
}

/** Ta sama sygnatura niezależnie od zapisu roku (15 / 2015). */
export function tasamaSygnatura(a, b) {
  const k = (s) => normalizujSygnature(s).replace(/\/(\d{2})(\d{2})$/, (_, c, r) => (c === "19" || c === "20" ? `/${r}` : `/${c}${r}`)).toUpperCase();
  return k(a) === k(b);
}

/** Strona wyników → liczba trafień i identyfikatory dokumentów. Czysta funkcja. */
export function parsujWyniki(html) {
  const t = String(html ?? "");
  if (/Nie znaleziono żadnego wyniku|Nie znaleziono zadnego wyniku/i.test(t)) return { liczba: 0, docIds: [], sady: {} };
  const liczbaTxt = /class="big_number"[^>]*>\s*([\d\s ]+)</.exec(t)?.[1];
  // Link pozycji: /details/<kontekst>/<docId>. Przy wyszukiwaniu sygnaturą kontekst = $N, przy frazie
  // to zakodowana fraza — docId rozpoznajemy po końcówce (_RRRR-MM-DD_NNN), niezależnie od kontekstu.
  const trafienia = [...t.matchAll(/\/(?:details|content)\/[^/"\s]+\/([A-Za-z0-9_.-]{6,120}_\d{4}-\d{2}-\d{2}_\d{3})/g)];
  const docIds = [...new Set(trafienia.map((m) => m[1]))];
  // Nazwa sądu przy pozycji listy („II K 1350/18 - wyrok … Sąd Rejonowy w … z 2019-11-05”), gdy portal ją podaje.
  const sady = {};
  // Nazwa sądu bywa PRZED linkiem (lista frazy) albo PO nim (lista sygnatury) — bierzemy ją z granic
  // wiersza wyniku (</li>, </tr>, </p>…), żeby nie przypisać sądu z sąsiedniej pozycji. Kończy się
  // przed „Data orzeczenia/publikacji”, „trafność”, myślnikiem albo datą.
  const GRANICA = /<\/(?:li|tr|ul|ol|table|tbody)>/gi;
  const granice = [0, ...[...t.matchAll(GRANICA)].map((g) => g.index + g[0].length), t.length];
  const przed = (i) => granice.filter((g) => g <= i).pop() ?? 0;
  const po = (i) => granice.find((g) => g > i) ?? t.length;
  for (const m of trafienia) {
    if (sady[m[1]]) continue;
    const okno = tekst(t.slice(przed(m.index), po(m.index + m[0].length))).replace(/\n/g, " ");
    const nazwa = /\bSąd (?:Rejonowy|Okręgowy|Apelacyjny|Najwyższy)\b.{2,80}?(?=\s+Data\s|\s+trafność|\s+z\s+\d{4}-\d{2}-\d{2}|\s+-\s|\s*$)/u.exec(okno)?.[0];
    if (nazwa) sady[m[1]] = nazwa.trim();
  }
  return { liczba: liczbaTxt ? Number(liczbaTxt.replace(/[\s ]/g, "")) : null, docIds, sady };
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

async function pobierz(url, typ = "text") {
  let ostatni;
  for (let proba = 1; proba <= 2; proba += 1) {
    try {
      const r = await fetch(url, { signal: sygnal(30000), headers: { "User-Agent": UA, Accept: typ === "json" ? "application/json" : "text/html" } });
      if (!r.ok) throw Object.assign(new Error(`HTTP ${r.status}`), { status: r.status });
      if (typ !== "json") return await r.text();
      // SAOS w czasie przerwy technicznej (albo przy blokadzie) oddaje stronę HTML z kodem 200.
      if (!(r.headers.get("content-type") ?? "").includes("json")) {
        throw Object.assign(new Error(`${new URL(url).hostname}: strona HTML zamiast danych JSON (przerwa techniczna albo blokada)`), { status: 503 });
      }
      return await r.json();
    } catch (e) {
      ostatni = e;
      if (e?.status && e.status < 500) break;
    }
  }
  throw ostatni;
}

/** SAOS (zastępczo): rekord po sygnaturze z urzędowym linkiem źródłowym. */
async function saosPoSygnaturze(syg) {
  const dane = await pobierz(`${SAOS}/search/judgments?caseNumber=${encodeURIComponent(normalizujSygnature(syg))}&courtType=COMMON&pageSize=10`, "json");
  const trafione = (dane.items ?? []).filter((it) => (it.courtCases ?? []).some((c) => tasamaSygnatura(c.caseNumber, syg)));
  const wynik = [];
  for (const it of trafione.slice(0, 5)) {
    const pelny = await pobierz(`${SAOS}/judgments/${it.id}`, "json").catch(() => null);
    const zrodlo = pelny?.data?.source?.judgmentUrl;
    wynik.push({
      sygnatura: normalizujSygnature(syg), data: it.judgmentDate ?? null, sad: it.division?.court?.name ?? null, rodzaj: RODZAJ_SAOS[it.judgmentType] ?? it.judgmentType ?? null,
      url_orzeczenia: zrodlo && dozwolonyHost(zrodlo) ? zrodlo : null, url_saos: `https://www.saos.org.pl/judgments/${it.id}`,
    });
  }
  return wynik;
}

const baza = { source: "orzeczenia.ms.gov.pl", query_type: "orzeczenie" };
const NOTA = "Źródłem jest link do samego orzeczenia w Portalu Orzeczeń (url_orzeczenia, stały). Sygnatura SR/SO nie jest " +
  "unikalna krajowo — przy AMBIGUOUS podaj portal sądu (sad, np. poznan.so). Brak trafienia ≠ brak orzeczenia " +
  "(portal publikuje wybrane orzeczenia). Przepisy weryfikuj w ELI.";
const odp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const blad = (e) => ({ status: "ERROR", ...baza, detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() });
const pozycja = (host, docId, sady = {}) => ({ ...rozbierzDocId(docId), ...(sady[docId] ? { sad: sady[docId] } : {}),
  url_orzeczenia: urlOrzeczenia(host, docId), url_metryki: urlMetryki(host, docId), portal: new URL(host).hostname });

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "sp-connector", version: "1.0.0" }));

server.registerTool("sp_sprawdz_sygnature", {
  title: "Sprawdź sygnaturę orzeczenia sądu powszechnego",
  description: "Czy w Portalu Orzeczeń Sądów Powszechnych jest orzeczenie o tej sygnaturze (SR/SO/SA). Zwraca stały link do " +
    "samego orzeczenia (url_orzeczenia). `sad` (np. poznan.so, warszawa.sa) zawęża do portalu jednego sądu i rozstrzyga " +
    "sygnatury powtarzające się w różnych sądach. Przy awarii portalu: SAOS z linkiem urzędowym.",
  inputSchema: {
    sygnatura: z.string().min(4).max(40).describe("np. I C 100/15, V ACa 12/24"),
    sad: z.string().max(60).optional().describe("portal sądu: miasto.so | miasto.sr | miasto.sa"),
  },
}, async ({ sygnatura, sad }) => {
  const oczekiwana = normalizujSygnature(sygnatura);
  let host;
  try { host = hostPortalu(sad); } catch (e) { return odp(blad(e)); }
  try {
    const strona = await pobierz(urlSzukania(host, oczekiwana));
    const w = parsujWyniki(strona);
    const docs = w.docIds.filter((id) => { const r = rozbierzDocId(id); return !r.sygnatura || tasamaSygnatura(r.sygnatura, oczekiwana); });
    if (!docs.length) {
      return odp({ status: "OUT_OF_SCOPE", ...baza, oczekiwana, portal: new URL(host).hostname, liczba_trafien: w.liczba ?? 0,
        uwaga: `Brak orzeczenia ${oczekiwana} w portalu ${new URL(host).hostname}. ${NOTA}`, retrieved_at: new Date().toISOString() });
    }
    // Uzasadnienie i wyrok jednej sprawy w jednym sądzie to jedna sprawa; różne sądy = AMBIGUOUS.
    const sady = new Set(docs.map((id) => rozbierzDocId(id).kodSadu ?? id));
    return odp({ status: sady.size === 1 ? "FOUND" : "AMBIGUOUS", ...baza, oczekiwana, liczba_trafien: w.liczba,
      ...(sady.size === 1 ? { result: pozycja(host, docs[0], w.sady), dokumenty: docs.map((id) => pozycja(host, id, w.sady)) } : { kandydaci: docs.map((id) => pozycja(host, id, w.sady)) }),
      uwaga: NOTA, retrieved_at: new Date().toISOString(), confidence: "deterministic" });
  } catch (e) {
    // Portal urzędowy nie odpowiada → SAOS zastępczo (RZĄD 3), z linkiem do portalu, gdy SAOS go zna.
    try {
      const wszystkie = await saosPoSygnaturze(oczekiwana);
      // 6.202: wskazany sąd (sad) zawęża także wynik zastępczy — wcześniej SAOS zwracał tę sygnaturę ze wszystkich sądów.
      const zastepczo = sad ? wszystkie.filter((k) => pasujeDoSadu(k.sad, sad)) : wszystkie;
      const inne = sad ? wszystkie.filter((k) => !zastepczo.includes(k)) : [];
      return odp({ status: zastepczo.length ? (zastepczo.length === 1 ? "FOUND" : "AMBIGUOUS") : "OUT_OF_SCOPE", ...baza, source: "saos (zastępczo)",
        oczekiwana, portal_blad: String(e?.message ?? e), ...(zastepczo.length === 1 ? { result: zastepczo[0] } : { kandydaci: zastepczo }),
        ...(sad ? { sad_wskazany: sad, ...(inne.length ? { inne_sady: inne.length } : {}) } : {}),
        uwaga: `Portal Orzeczeń nie odpowiedział (${e?.message ?? e}); wynik z SAOS (RZĄD 3, agregator akademicki). Powołuj url_orzeczenia, gdy jest.`,
        retrieved_at: new Date().toISOString() });
    } catch (e2) {
      return odp({ ...blad(e), saos_blad: String(e2?.message ?? e2) });
    }
  }
});

server.registerTool("sp_pobierz", {
  title: "Pobierz orzeczenie sądu powszechnego",
  description: "Treść orzeczenia z Portalu Orzeczeń po stałym linku (…/content/$N/{id} albo …/details/$N/{id}) lub id dokumentu; " +
    "porcjami po 20 000 znaków (offset).",
  inputSchema: {
    url_lub_id: z.string().min(10).max(400).describe("link z portalu albo id dokumentu (np. 155000000001006_I_C_000100_2015_Uz_2015-06-18_001)"),
    sad: z.string().max(60).optional().describe("portal sądu, gdy podajesz samo id"),
    offset: z.number().int().min(0).optional(),
  },
}, async ({ url_lub_id, sad, offset = 0 }) => {
  try {
    let host, docId;
    if (/^https?:\/\//i.test(url_lub_id)) {
      if (!dozwolonyHost(url_lub_id)) return odp({ status: "ERROR", ...baza, detail: "To nie jest adres Portalu Orzeczeń Sądów Powszechnych." });
      const u = new URL(url_lub_id);
      host = u.origin;
      docId = /\/(?:content|details)\/\$N\/([A-Za-z0-9_.-]{10,120})/.exec(decodeURIComponent(u.pathname))?.[1];
    } else {
      host = hostPortalu(sad);
      docId = url_lub_id.trim();
    }
    if (!docId) return odp({ status: "ERROR", ...baza, detail: "Nie rozpoznano id dokumentu w adresie." });
    const calosc = tekst(await pobierz(urlOrzeczenia(host, docId)));
    if (calosc.length < 40) return odp({ status: "NOT_FOUND", ...baza, url_orzeczenia: urlOrzeczenia(host, docId), uwaga: "Portal nie zwrócił treści orzeczenia." });
    const czesc = calosc.slice(offset, offset + PORCJA);
    return odp({ status: "FOUND", ...baza, confidence: "deterministic",
      result: { ...pozycja(host, docId), tresc: czesc, tresc_offset: offset, tresc_dlugosc: calosc.length, tresc_kompletna: offset + czesc.length >= calosc.length },
      uwaga: NOTA, retrieved_at: new Date().toISOString() });
  } catch (e) { return odp(blad(e)); }
});

/** Formularz wyszukiwarki portalu z polem frazy (ten sam silnik co etpcz.ms.gov.pl: pole `phrase`). Czysta funkcja. */
export function formularzFrazy(html, baza) {
  for (const forma of formularze(html, baza)) {
    const pole = forma.tekstowe.find((p) => /^phrase$/i.test(p.nazwa)) ??
      forma.tekstowe.find((p) => /phrase|fraz|tre[sś][cć]|s[lł]owa|szukaj|search|query|keyword/i.test(p.opis));
    if (pole) return { ...forma, poleFrazy: pole.nazwa };
  }
  return null;
}

/**
 * Fraza w Portalu Orzeczeń: formularz wyszukiwarki odczytany ze strony (strona główna albo
 * wyszukiwarka zaawansowana), wysłany z frazą; bez formularza — adres kontekstu Tapestry.
 */
async function wynikiFrazyPortalu(host, fraza) {
  for (const start of [`${host}/`, `${host}/search/advanced`]) {
    const r = await fetch(start, { signal: sygnal(30000), headers: { "User-Agent": UA, Accept: "text/html" } }).catch(() => null);
    if (!r?.ok) continue;
    const forma = formularzFrazy(await r.text(), r.url || start);
    if (!forma) continue;
    const ciastka = (r.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
    const dane = daneFormularza(forma, { [forma.poleFrazy]: fraza });
    const naglowki = { "User-Agent": UA, Accept: "text/html", Referer: start, ...(ciastka ? { Cookie: ciastka } : {}) };
    const wynik = forma.metoda === "post"
      ? await fetch(forma.akcja, { method: "POST", body: dane.toString(), lexPowtarzalne: true, signal: sygnal(30000), headers: { ...naglowki, "Content-Type": "application/x-www-form-urlencoded" } })
      : await fetch(`${forma.akcja.split("?")[0]}?${dane}`, { signal: sygnal(30000), headers: naglowki });
    if (!wynik.ok) throw new Error(`HTTP ${wynik.status}`);
    return { ...parsujWyniki(await wynik.text()), metoda: `formularz ${new URL(forma.akcja).pathname} (${forma.poleFrazy})` };
  }
  return { ...parsujWyniki(await pobierz(urlSzukaniaFrazy(host, fraza))), metoda: "adres kontekstu Tapestry" };
}

// Rodzaje orzeczeń SAOS (judgmentType) po polsku.
const RODZAJ_SAOS = { SENTENCE: "wyrok", DECISION: "postanowienie", RESOLUTION: "uchwała", REASONS: "uzasadnienie", REGULATION: "zarządzenie" };

/** SAOS (zastępczo, RZĄD 3): kandydaci po frazie z linkiem urzędowym, gdy SAOS go zna. */
async function saosPoFrazie({ fraza, dataOd, dataDo, limit }) {
  const qs = new URLSearchParams({ all: fraza, courtType: "COMMON", pageSize: String(Math.max(10, limit)), sortingField: "JUDGMENT_DATE", sortingDirection: "DESC" });
  if (dataOd) qs.set("judgmentDateFrom", dataOd);
  if (dataDo) qs.set("judgmentDateTo", dataDo);
  const dane = await pobierz(`${SAOS}/search/judgments?${qs}`, "json");
  const wynik = [];
  for (const it of (dane.items ?? []).slice(0, limit)) {
    const pelny = await pobierz(`${SAOS}/judgments/${it.id}`, "json").catch(() => null);
    wynik.push(pozycjaSaos(it, pelny?.data?.source?.judgmentUrl));
  }
  return wynik;
}

/** Pozycja SAOS (zastępczo): sygnatura, polski rodzaj, sąd, link portalu (tylko urzędowy host) i link SAOS. */
export function pozycjaSaos(it, zrodlo) {
  const sygnatury = (it.courtCases ?? []).map((c) => normalizujSygnature(c.caseNumber)).filter(Boolean);
  return {
    sygnatura: sygnatury[0] ?? null, ...(sygnatury.length > 1 ? { sygnatury } : {}), data: it.judgmentDate ?? null,
    sad: it.division?.court?.name ?? null, rodzaj: RODZAJ_SAOS[it.judgmentType] ?? it.judgmentType ?? null,
    url_orzeczenia: zrodlo && dozwolonyHost(zrodlo) ? zrodlo : null, url_saos: `https://www.saos.org.pl/judgments/${it.id}`,
  };
}

server.registerTool("sp_szukaj", {
  title: "Szukaj orzeczeń sądów powszechnych po frazie",
  description: "Wyszukiwanie po treści w Portalu Orzeczeń (urzędowym; agregat albo portal sądu `sad`), stałe linki do orzeczeń. " +
    "Trafienia sprawdzane odczytem treści; gdy portal nie odpowie albo nie przyjmie frazy — SAOS zastępczo (RZĄD 3) z linkiem do portalu. " +
    "Portal szuka tylko po frazie albo sygnaturze (sygnatura: sp_sprawdz_sygnature) — bez filtrów dat. " +
    "Wynik to kandydaci — przed powołaniem przeczytaj treść (sp_pobierz).",
  inputSchema: {
    fraza: z.string().min(3).max(300),
    sad: z.string().max(60).optional().describe("portal sądu: miasto.so | miasto.sr | miasto.sa"),
  },
}, async ({ fraza, sad }) => {
  // Portal szuka tylko po sygnaturze albo frazie (bez dat i limitu) — tyle przyjmuje narzędzie.
  let host;
  try { host = hostPortalu(sad); } catch (e) { return odp(blad(e)); }
  let portalUwaga = null;
  // 1. Portal Orzeczeń (źródło urzędowe).
  try {
    const w = await wynikiFrazyPortalu(host, fraza);
    const ids = w.docIds.slice(0, 10);
    // Kontrola, że portal przyjął frazę: treść przynajmniej jednego z pierwszych trafień ją zawiera.
    const sprawdzone = [];
    for (const id of ids.slice(0, 3)) {
      const t = await pobierz(urlOrzeczenia(host, id)).then(tekst).catch(() => "");
      sprawdzone.push(zawieraFraze(t, fraza));
    }
    if (ids.length && sprawdzone.some(Boolean)) {
      return odp({ status: "AMBIGUOUS", ...baza, query_type: "wyszukiwanie", fraza, portal: new URL(host).hostname, metoda: w.metoda, liczba_trafien: w.liczba,
        kandydaci: ids.map((id) => pozycja(host, id, w.sady)),
        uwaga: "Kandydaci z Portalu Orzeczeń (źródło urzędowe) — przed powołaniem przeczytaj treść (sp_pobierz). " + NOTA,
        retrieved_at: new Date().toISOString() });
    }
    portalUwaga = ids.length ? "portal zwrócił orzeczenia bez tej frazy w treści (fraza nieprzyjęta przez portal)" : "brak trafień w portalu";
    if (!ids.length && w.liczba === 0) {
      return odp({ status: "OUT_OF_SCOPE", ...baza, query_type: "wyszukiwanie", fraza, portal: new URL(host).hostname, liczba_trafien: 0,
        uwaga: `Brak trafień w portalu ${new URL(host).hostname}. ${NOTA}`, retrieved_at: new Date().toISOString() });
    }
  } catch (e) {
    portalUwaga = `portal nie odpowiedział (${e?.message ?? e})`;
  }
  // 2. SAOS — wyłącznie zastępczo.
  try {
    const kandydaci = await saosPoFrazie({ fraza, limit: 5 });
    return odp({ status: kandydaci.length ? "AMBIGUOUS" : "OUT_OF_SCOPE", ...baza, source: "saos (zastępczo)", query_type: "wyszukiwanie", fraza,
      portal_uwaga: portalUwaga, kandydaci,
      uwaga: `Portal Orzeczeń: ${portalUwaga}. Wynik zastępczy z SAOS (RZĄD 3, agregator akademicki) — powołuj url_orzeczenia z portalu, gdy jest. ` + NOTA,
      retrieved_at: new Date().toISOString() });
  } catch (e2) {
    return odp({ status: "ERROR", ...baza, query_type: "wyszukiwanie", fraza, portal_uwaga: portalUwaga, saos_blad: String(e2?.message ?? e2),
      detail: `Portal Orzeczeń: ${portalUwaga}; SAOS: ${e2?.message ?? e2}`, retrieved_at: new Date().toISOString() });
  }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("sp-mcp-server: nasłuchuję na stdio (MCP)");
}
