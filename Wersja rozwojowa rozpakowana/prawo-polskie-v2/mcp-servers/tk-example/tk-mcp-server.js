#!/usr/bin/env node
/**
 * tk-mcp-server.js — orzeczenia Trybunału Konstytucyjnego (2026-10-06). Konektor PROSTY, wyłącznie źródła urzędowe.
 *
 * SAOS nie jest źródłem dla TK (SAOS przeszukuje się tylko narzędziami SAOS). Kolejność:
 *  • tk_sprawdz_sygnature — (1) karta sprawy IPO pod stałym adresem
 *    `ipo.trybunal.gov.pl/ipo/view/sprawa.xhtml?pokaz=dokumenty&sygnatura=K+33%2F07` (GET, bez sesji),
 *    z kontrolą, że strona zawiera pytaną sygnaturę, i listą dokumentów sprawy; (2) wyszukiwarka OTK ZU
 *    (`otkzu.trybunal.gov.pl/Wyszukiwanie`, pole Sygnatura) → pozycja zbioru `/{rok}/{A|B}/{poz}`;
 *    (3) formularz JSF IPO (`/ipo/Szukaj?cid=1`, bywa niesprawny); brak trafienia → OUT_OF_SCOPE
 *    z linkami urzędowymi (karta IPO, wyszukiwarka OTK ZU), nie „nie istnieje”;
 *  • tk_pobierz — treść spod adresu IPO/OTK ZU z kontrolą, że tekst zawiera pytaną sygnaturę.
 * Orzeczenie TK to materiał orzeczniczy (RZĄD 2A), nie źródło brzmienia przepisu (ELI).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, BudzetWyczerpany } from "../wspolne/budzet.mjs";

const IPO = "https://ipo.trybunal.gov.pl/ipo";
const OTKZU = "https://otkzu.trybunal.gov.pl";
const UA = "Mozilla/5.0 (compatible; LexMachina-tk/1.0)";
const PORCJA = 20000;
const HOSTY = new Set(["ipo.trybunal.gov.pl", "otkzu.trybunal.gov.pl", "trybunal.gov.pl", "www.trybunal.gov.pl"]);
const REP_TK = new Set(["K", "P", "SK", "U", "Kp", "Kpt", "Pp", "Ts", "Tw", "S"]);

export function normalizujSygnature(s) {
  return String(s ?? "").normalize("NFKC").replace(/\./g, "").replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim();
}

/** Sygnatura TK: repertorium bez numeru wydziału (K 33/07, SK 3/20, Kp 1/09). */
export function toSygnaturaTk(s) {
  const m = /^([A-Za-z]{1,3}) \d{1,4}\/\d{2,4}$/.exec(normalizujSygnature(s));
  return Boolean(m && REP_TK.has(m[1]));
}

/** Postać sygnatury bez numeru wydziału („LITERY nr/rok”), także przy repertorium spoza REP_TK. */
export function postacSygnaturyTk(s) {
  return /^[A-Za-z]{1,3} \d{1,4}\/\d{2,4}$/.test(normalizujSygnature(s));
}

export function dozwolonyHost(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && HOSTY.has(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/** Czy tekst zawiera sygnaturę (odporne na spacje, kropki i zapis roku 07/2007). */
export function zawieraSygnature(tekstDok, syg) {
  const n = normalizujSygnature(syg);
  const m = /^([A-Za-z]{1,3}) (\d{1,4})\/(\d{2,4})$/.exec(n);
  if (!m) return false;
  const rok = m[3].length === 4 ? `(?:${m[3]}|${m[3].slice(2)})` : `(?:${m[3]}|(?:19|20)${m[3]})`;
  return new RegExp(`(?<![\\p{L}\\d])${m[1]}\\.?\\s*${m[2]}\\s*\\/\\s*${rok}(?!\\d)`, "u").test(String(tekstDok).normalize("NFKC"));
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

const ATRYBUT = (tag, nazwa) => new RegExp(`\\b${nazwa}\\s*=\\s*"([^"]*)"`, "i").exec(tag)?.[1];

/**
 * Formularz wyszukiwarki IPO z pobranego HTML: akcja, pola ukryte (z ViewState), pole sygnatury
 * i przycisk „Szukaj”. Czysta funkcja; null, gdy formularza nie da się rozpoznać.
 */
export function formularzIpo(html, baza = "https://ipo.trybunal.gov.pl/ipo/Szukaj?cid=1") {
  const t = String(html ?? "");
  for (const forma of t.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    const [, atrForm, wnetrze] = forma;
    const pola = {};
    let poleSygnatury = null;
    let przycisk = null;
    for (const [tag] of wnetrze.matchAll(/<(?:input|button)\b[^>]*>/gi)) {
      const nazwa = ATRYBUT(tag, "name");
      if (!nazwa) continue;
      const typ = (ATRYBUT(tag, "type") ?? "text").toLowerCase();
      const id = ATRYBUT(tag, "id") ?? "";
      if (typ === "hidden") pola[nazwa] = dekoduj(ATRYBUT(tag, "value") ?? "");
      else if ((typ === "text" || typ === "search") && /sygn/i.test(`${nazwa} ${id}`) && !poleSygnatury) poleSygnatury = nazwa;
      else if ((typ === "submit" || /^<button/i.test(tag)) && !przycisk) przycisk = nazwa;
    }
    const przyciskSzukaj = [...wnetrze.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)]
      .find(([, atr, tresc]) => /szukaj|wyszukaj/i.test(tekst(tresc) + " " + (ATRYBUT(atr, "value") ?? "")) && ATRYBUT(atr, "name"));
    if (!poleSygnatury || !("javax.faces.ViewState" in pola)) continue;
    const akcja = dekoduj(ATRYBUT(atrForm, "action") ?? baza);
    return { akcja: new URL(akcja, baza).toString(), pola, poleSygnatury, przycisk: przyciskSzukaj ? ATRYBUT(przyciskSzukaj[1], "name") : przycisk };
  }
  return null;
}

/** Wyniki wyszukiwarki IPO: odnośniki do spraw/dokumentów, przy których stoi pytana sygnatura. Czysta funkcja. */
export function wynikiIpo(html, syg, baza = "https://ipo.trybunal.gov.pl/ipo/Szukaj?cid=1") {
  const t = String(html ?? "");
  const wiersze = t.split(/<\/tr>|<\/li>|<\/div>\s*<div class="[^"]*(?:wynik|result|ui-datalist-item)/i);
  const linki = [];
  for (const wiersz of wiersze) {
    if (!zawieraSygnature(tekst(wiersz), syg)) continue;
    for (const [, href] of wiersz.matchAll(/href="([^"]*(?:Sprawa|dokument|Dokument)[^"]*)"/g)) {
      const url = new URL(dekoduj(href), baza).toString();
      if (dozwolonyHost(url) && !linki.includes(url)) linki.push(url);
    }
  }
  return linki;
}

/** Wyszukiwarka IPO: GET formularza (sesja + ViewState) → POST z sygnaturą → linki do orzeczenia. */
async function ipoSzukaj(syg) {
  const start = "https://ipo.trybunal.gov.pl/ipo/Szukaj?cid=1";
  const r1 = await fetch(start, { signal: sygnal(30000), headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!r1.ok) throw new Error(`IPO HTTP ${r1.status}`);
  const ciastka = (r1.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  const forma = formularzIpo(await r1.text(), r1.url || start);
  if (!forma) throw new Error("IPO: nie rozpoznano formularza wyszukiwarki (zmiana strony?)");
  const dane = new URLSearchParams({ ...forma.pola, [forma.poleSygnatury]: normalizujSygnature(syg), ...(forma.przycisk ? { [forma.przycisk]: forma.przycisk } : {}) });
  const r2 = await fetch(forma.akcja, {
    method: "POST", signal: sygnal(30000), body: dane.toString(),
    headers: { "User-Agent": UA, Accept: "text/html", "Content-Type": "application/x-www-form-urlencoded", Referer: start, ...(ciastka ? { Cookie: ciastka } : {}) },
  });
  if (!r2.ok) throw new Error(`IPO HTTP ${r2.status}`);
  return wynikiIpo(await r2.text(), syg, forma.akcja);
}

/** Stały adres karty sprawy w IPO (zakładka dokumentów): spacja jako „+”, ukośnik jako %2F. */
export function urlSprawyIpo(syg) {
  return `${IPO}/view/sprawa.xhtml?pokaz=dokumenty&sygnatura=${encodeURIComponent(normalizujSygnature(syg)).replace(/%20/g, "+")}`;
}

/**
 * Zakładki dokumentów na karcie sprawy IPO (układ od 2026, pomiar 6.202 na K 33/07): etykieta
 * `<a href="#sprawaForm:tabView:dok_N">Wyrok z dnia …</a>`, panel `<div id="sprawaForm:tabView:dok_N">` z PEŁNYM
 * tekstem orzeczenia i odnośnik `/ipo/downloadOrzeczenieDoc?dok=ID` (plik .doc). Dawny parametr `dokument=`
 * zniknął — parser go szukał i zwracał pustą listę, a narzędzie podawało kartę zamiast orzeczenia. Czysta funkcja.
 */
export function zakladkiIpo(html, baza = `${IPO}/view/sprawa.xhtml`) {
  const t = String(html ?? "");
  const etykiety = new Map();
  for (const [, n, et] of t.matchAll(/<a\b[^>]*href="#sprawaForm:tabView:dok_(\d+)"[^>]*>([^<]*)/gi)) {
    if (!etykiety.has(n)) etykiety.set(n, dekoduj(et).replace(/\s+/g, " ").trim() || null);
  }
  const starty = [...t.matchAll(/<div\b[^>]*\bid="sprawaForm:tabView:dok_(\d+)"/gi)].map((m) => ({ n: m[1], i: m.index }));
  const karta = baza.split("#")[0];
  return starty.map(({ n, i }, k) => {
    let koniec = k + 1 < starty.length ? starty[k + 1].i : t.length;
    const form = t.indexOf("</form>", i);
    if (form !== -1) koniec = Math.min(koniec, form);
    const panel = t.slice(i, koniec);
    const doc = /href="([^"]*downloadOrzeczenieDoc\?dok=\d+)"/i.exec(panel)?.[1];
    return { zakladka: n, tytul: etykiety.get(n) ?? null, url: `${karta}#dok_${n}`,
      ...(doc ? { url_doc: new URL(dekoduj(doc), karta).toString() } : {}), tresc: tekst(panel) };
  });
}

/** Dokumenty z karty sprawy IPO: zakładki (układ od 2026) albo odnośniki z parametrem `dokument=` (dawny). Czysta funkcja. */
export function dokumentyIpo(html, baza = `${IPO}/view/sprawa.xhtml`) {
  const wynik = zakladkiIpo(html, baza).map(({ tresc, ...d }) => d);
  for (const [, atr, tresc] of String(html ?? "").matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = ATRYBUT(atr, "href");
    if (!href || !/[?&;]dokument=\d+/i.test(dekoduj(href))) continue;
    const url = new URL(dekoduj(href), baza).toString();
    if (dozwolonyHost(url) && !wynik.some((d) => d.url === url)) wynik.push({ tytul: tekst(tresc).replace(/\n/g, " ") || null, url });
  }
  return wynik;
}

/**
 * Formularz wyszukiwarki z polem sygnatury (OTK ZU): akcja, metoda, pola ukryte, nazwa pola sygnatury
 * i przycisku. Czysta funkcja; null, gdy formularza nie da się rozpoznać.
 */
export function formularzSygnatury(html, baza = `${OTKZU}/Wyszukiwanie`) {
  for (const [, atrForm, wnetrze] of String(html ?? "").matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    const pola = {};
    let poleSygnatury = null;
    let przycisk = null;
    for (const [tag] of wnetrze.matchAll(/<(?:input|button)\b[^>]*>/gi)) {
      const nazwa = ATRYBUT(tag, "name");
      if (!nazwa) continue;
      const typ = (ATRYBUT(tag, "type") ?? (/^<button/i.test(tag) ? "submit" : "text")).toLowerCase();
      const id = ATRYBUT(tag, "id") ?? "";
      if (typ === "hidden") pola[nazwa] = dekoduj(ATRYBUT(tag, "value") ?? "");
      else if ((typ === "text" || typ === "search") && /sygn/i.test(`${nazwa} ${id}`) && !poleSygnatury) poleSygnatury = nazwa;
      else if (typ === "submit" && !przycisk) przycisk = { nazwa, wartosc: dekoduj(ATRYBUT(tag, "value") ?? "") };
    }
    if (!poleSygnatury) continue;
    const akcja = new URL(dekoduj(ATRYBUT(atrForm, "action") ?? "") || baza, baza).toString();
    return { akcja, metoda: (ATRYBUT(atrForm, "method") ?? "get").toLowerCase(), pola, poleSygnatury, przycisk };
  }
  return null;
}

/** Pozycje OTK ZU (`/{rok}/{A|B}/{poz}`, `downloadOTK?mpo=`) przy pytanej sygnaturze. Czysta funkcja. */
export function wynikiOtkzu(html, syg, baza = `${OTKZU}/Wyszukiwanie`) {
  const linki = [];
  for (const wiersz of String(html ?? "").split(/<\/tr>|<\/li>|<\/article>|<\/div>\s*<div/i)) {
    if (!zawieraSygnature(tekst(wiersz), syg)) continue;
    for (const [, href] of wiersz.matchAll(/href="([^"]+)"/g)) {
      const url = new URL(dekoduj(href), baza).toString();
      if (!dozwolonyHost(url) || !/\/\d{4}\/[AB]\/\d+(?:$|[?#])|downloadOTK\?mpo=\d+/.test(url)) continue;
      if (!linki.includes(url)) linki.push(url);
    }
  }
  return linki;
}

const naglowki = { "User-Agent": UA, Accept: "text/html,*/*" };

/** Karta sprawy IPO po sygnaturze: null, gdy strona nie dotyczy tej sprawy. */
async function ipoSprawa(syg) {
  const url = urlSprawyIpo(syg);
  const r = await fetch(url, { signal: sygnal(30000), headers: naglowki });
  if (!r.ok) throw new Error(`IPO HTTP ${r.status}`);
  const html = await r.text();
  if (!zawieraSygnature(tekst(html), syg)) return null;
  return { url_sprawy: url, dokumenty: dokumentyIpo(html, r.url || url) };
}

/** Wyszukiwarka OTK ZU: formularz z polem Sygnatura → pozycje zbioru przy tej sygnaturze. */
async function otkzuSzukaj(syg) {
  const start = `${OTKZU}/Wyszukiwanie`;
  const r1 = await fetch(start, { signal: sygnal(30000), headers: naglowki });
  if (!r1.ok) throw new Error(`OTK ZU HTTP ${r1.status}`);
  const ciastka = (r1.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  const forma = formularzSygnatury(await r1.text(), r1.url || start);
  if (!forma) throw new Error("OTK ZU: nie rozpoznano formularza wyszukiwarki (zmiana strony?)");
  const dane = new URLSearchParams({ ...forma.pola, [forma.poleSygnatury]: normalizujSygnature(syg),
    ...(forma.przycisk ? { [forma.przycisk.nazwa]: forma.przycisk.wartosc } : {}) });
  const naglowkiSesji = { ...naglowki, Referer: start, ...(ciastka ? { Cookie: ciastka } : {}) };
  const r2 = forma.metoda === "post"
    ? await fetch(forma.akcja, { method: "POST", signal: sygnal(30000), body: dane.toString(), headers: { ...naglowkiSesji, "Content-Type": "application/x-www-form-urlencoded" } })
    : await fetch(`${forma.akcja.split("?")[0]}?${dane}`, { signal: sygnal(30000), headers: naglowkiSesji });
  if (!r2.ok) throw new Error(`OTK ZU HTTP ${r2.status}`);
  return wynikiOtkzu(await r2.text(), syg, r2.url || forma.akcja);
}

async function pobierz(url) {
  const r = await fetch(url, { signal: sygnal(30000), headers: naglowki });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.text();
}

const baza = { source: "ipo.trybunal.gov.pl", query_type: "orzeczenie" };
const zapytanie = (syg) => `site:ipo.trybunal.gov.pl "${normalizujSygnature(syg)}"`;
const NOTA = "Źródłem jest link do samego orzeczenia w IPO/OTK ZU (tylko źródła urzędowe TK; SAOS nie jest źródłem TK). " +
  "Brak trafienia ≠ brak orzeczenia.";
const odp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const blad = (e) => ({ status: "ERROR", ...baza, detail: String(e?.message ?? e), retrieved_at: new Date().toISOString() });

/** Czy błąd źródła to NIEDOSTĘPNOŚĆ transportu (timeout, wyczerpany budżet, zerwane połączenie, HTTP,
 * zmiana/nierozpoznanie formularza), a nie rzetelne „sprawdzono, brak orzeczenia”. Taki stan to ERROR
 * (źródło nie odpowiedziało), nie OUT_OF_SCOPE. Klasyfikacja po typie błędu, nie po treści komunikatu
 * (zgł. 2026-10-07: „Przekroczony budżet czasu wywołania” nie pasował do regexu i dawał fałszywe OUT_OF_SCOPE). */
export function bladTransportu(e) {
  if (e instanceof BudzetWyczerpany) return true;
  const n = e?.name ?? "";
  if (n === "TimeoutError" || n === "AbortError") return true;
  return /HTTP|fetch|abort|timeout|budżet|budzet|rozpozna|nie odpowiada|ECONN|ENOTFOUND|EAI_AGAIN|socket|network|UND_ERR/i
    .test(String(e?.message ?? e));
}

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "tk-connector", version: "1.0.0" }));

server.registerTool("tk_sprawdz_sygnature", {
  title: "Sprawdź sygnaturę orzeczenia Trybunału Konstytucyjnego",
  description: "Orzeczenie TK po sygnaturze (K, P, SK, U, Kp, Kpt…) wyłącznie ze źródeł urzędowych: karta sprawy IPO " +
    "(view/sprawa.xhtml?sygnatura=), wyszukiwarka OTK ZU (otkzu.trybunal.gov.pl), formularz IPO. Bez SAOS. Brak trafienia → " +
    "OUT_OF_SCOPE z linkami urzędowymi; znaleziony dokument sprawdź narzędziem tk_pobierz.",
  inputSchema: { sygnatura: z.string().min(3).max(30).describe("np. K 33/07, SK 3/20") },
}, async ({ sygnatura }) => {
  const oczekiwana = normalizujSygnature(sygnatura);
  // Repertorium spoza listy, ale w postaci „LITERY nr/rok” (bez wydziału) — mimo to pytamy źródła urzędowe TK.
  const pozaLista = !toSygnaturaTk(oczekiwana);
  if (pozaLista && !postacSygnaturyTk(oczekiwana)) {
    return odp({ status: "OUT_OF_SCOPE", ...baza, oczekiwana, powod: "SYGNATURA_INNEGO_SADU",
      uwaga: `${oczekiwana} nie ma postaci sygnatury TK (repertorium K, P, SK, U, Kp, Kpt, Pp, Ts, Tw, S bez numeru wydziału).` });
  }
  // Trzy urzędowe źródła TK odpytywane RÓWNOLEGLE (nie sekwencyjnie): wolne IPO nie wyczerpuje wtedy
  // wspólnego budżetu czasu, odbierając szansę OTK ZU i formularzowi IPO (zgł. 2026-10-07: wszystkie trzy
  // padały kaskadowo na timeout, a wynik był mylnie OUT_OF_SCOPE). Priorytet wyniku zachowany kolejnością.
  const czas = () => new Date().toISOString();
  const zrodla = [
    { klucz: "ipo", async szukaj() {
      const sprawa = await ipoSprawa(oczekiwana);
      if (!sprawa) return { brak: "karta sprawy IPO nie zawiera pytanej sygnatury" };
      return { wynik: odp({ status: "FOUND", ...baza, metoda: "IPO — karta sprawy", oczekiwana,
        result: { sygnatura: oczekiwana, url_orzeczenia: sprawa.dokumenty[0]?.url ?? sprawa.url_sprawy, url_sprawy: sprawa.url_sprawy, dokumenty: sprawa.dokumenty },
        uwaga: "Karta sprawy IPO zawiera pytaną sygnaturę. Przed powołaniem przeczytaj dokument orzeczenia tk_pobierz (z sygnaturą). " + NOTA,
        retrieved_at: czas() }) };
    } },
    { klucz: "otkzu", async szukaj() {
      const linki = await otkzuSzukaj(oczekiwana);
      if (!linki.length) return { brak: "brak trafienia w wyszukiwarce OTK ZU" };
      return { wynik: odp({ status: linki.length === 1 ? "FOUND" : "AMBIGUOUS", ...baza, source: "otkzu.trybunal.gov.pl", metoda: "OTK ZU — wyszukiwarka (Sygnatura)", oczekiwana,
        ...(linki.length === 1 ? { result: { sygnatura: oczekiwana, url_orzeczenia: linki[0] } } : { kandydaci: linki.map((url) => ({ sygnatura: oczekiwana, url_orzeczenia: url })) }),
        uwaga: "Pozycja OTK ZU przy pytanej sygnaturze — przed powołaniem przeczytaj ją tk_pobierz (z sygnaturą). " + NOTA,
        retrieved_at: czas() }) };
    } },
    { klucz: "ipo_wyszukiwarka", async szukaj() {
      const linki = await ipoSzukaj(oczekiwana);
      if (!linki.length) return { brak: "brak trafienia w formularzu IPO" };
      return { wynik: odp({ status: linki.length === 1 ? "FOUND" : "AMBIGUOUS", ...baza, metoda: "IPO — formularz wyszukiwarki", oczekiwana,
        ...(linki.length === 1 ? { result: { sygnatura: oczekiwana, url_orzeczenia: linki[0] } } : { kandydaci: linki.map((url) => ({ sygnatura: oczekiwana, url_orzeczenia: url })) }),
        uwaga: "Link z wyszukiwarki IPO — przed powołaniem przeczytaj dokument tk_pobierz (z sygnaturą). " + NOTA,
        retrieved_at: czas() }) };
    } },
  ];
  const stany = await Promise.all(zrodla.map((z) => z.szukaj().then((r) => ({ ...r }), (e) => ({ blad: e }))));
  // Priorytet: pierwszy znaleziony w kolejności źródeł.
  for (const s of stany) if (s.wynik) return s.wynik;
  const bledy = {};
  let osiagnieto = false; // czy choć jedno źródło rzetelnie sprawdziło (dotarliśmy i brak trafienia)
  stany.forEach((s, i) => {
    if (s.brak !== undefined) { bledy[zrodla[i].klucz] = s.brak; osiagnieto = true; }
    else { bledy[zrodla[i].klucz] = String(s.blad?.message ?? s.blad); if (!bladTransportu(s.blad)) osiagnieto = true; }
  });
  const wszystkieBledy = !osiagnieto; // żadne źródło nie odpowiedziało → ERROR (nie OUT_OF_SCOPE)
  return odp({ status: wszystkieBledy ? "ERROR" : "OUT_OF_SCOPE", ...baza, oczekiwana, zrodla: bledy,
    ...(pozaLista ? { powod: "REPERTORIUM_SPOZA_LISTY_TK", repertoria_tk: [...REP_TK] } : {}),
    url_sprawy: urlSprawyIpo(oczekiwana), url_wyszukiwarki_otkzu: `${OTKZU}/Wyszukiwanie`, zapytanie_wyszukiwarki: zapytanie(oczekiwana),
    uwaga: `${wszystkieBledy ? "Źródła urzędowe TK nie odpowiedziały (timeout/niedostępność) — spróbuj ponownie" : `Brak trafienia ${oczekiwana} w IPO i OTK ZU`} — otwórz url_sprawy albo wyszukiwarkę OTK ZU; znaleziony dokument sprawdź tk_pobierz. ${NOTA}`,
    retrieved_at: czas() });
});

server.registerTool("tk_pobierz", {
  title: "Pobierz orzeczenie TK spod adresu IPO / OTK ZU",
  description: "Treść dokumentu orzeczenia z ipo.trybunal.gov.pl albo otkzu.trybunal.gov.pl (stały link) z kontrolą, czy zawiera " +
    "pytaną sygnaturę; porcjami po 20 000 znaków (offset).",
  inputSchema: {
    url: z.string().url().max(600),
    sygnatura: z.string().max(30).optional().describe("sygnatura do kontroli tożsamości dokumentu"),
    offset: z.number().int().min(0).optional(),
  },
}, async ({ url, sygnatura, offset = 0 }) => {
  if (!dozwolonyHost(url)) return odp({ status: "ERROR", ...baza, detail: "Dozwolone są tylko adresy ipo.trybunal.gov.pl i otkzu.trybunal.gov.pl." });
  try {
    // Karta IPO z wybraną zakładką (#dok_N) albo plik .doc (downloadOrzeczenieDoc?dok=ID) → tekst panelu tego dokumentu.
    const zak = /#dok_(\d+)$/.exec(url)?.[1];
    const dok = /downloadOrzeczenieDoc\?dok=(\d+)/.exec(url)?.[1];
    let calosc;
    if (zak || dok) {
      if (dok && !sygnatura) return odp({ status: "ERROR", ...baza, detail: "Plik .doc z IPO: podaj sygnaturę — treść czytam z karty sprawy (zakładka tego dokumentu)." });
      const karta = zak ? url.split("#")[0] : urlSprawyIpo(sygnatura);
      const zakladki = zakladkiIpo(await pobierz(karta), karta);
      const z = zakladki.find((x) => (zak && x.zakladka === zak) || (dok && x.url_doc?.endsWith(`dok=${dok}`)));
      if (!z) return odp({ status: "NOT_FOUND", ...baza, url_orzeczenia: url, uwaga: "Na karcie sprawy nie ma zakładki tego dokumentu (zmiana karty albo inna sprawa).",
        zakladki: zakladki.map(({ tresc, ...d }) => d) });
      calosc = z.tresc;
    } else calosc = tekst(await pobierz(url));
    if (calosc.length < 40) return odp({ status: "NOT_FOUND", ...baza, url_orzeczenia: url, uwaga: "Strona nie zawiera treści orzeczenia (np. wymaga przeglądarki)." });
    if (sygnatura && !zawieraSygnature(calosc, sygnatura)) {
      return odp({ status: "MISMATCH", ...baza, url_orzeczenia: url, oczekiwana: normalizujSygnature(sygnatura),
        uwaga: "Dokument pod tym adresem nie zawiera pytanej sygnatury — to nie jest to orzeczenie (albo strona wymaga przeglądarki)." });
    }
    const czesc = calosc.slice(offset, offset + PORCJA);
    return odp({ status: "FOUND", ...baza, confidence: sygnatura ? "deterministic" : "unverified-identity",
      result: { ...(sygnatura ? { sygnatura: normalizujSygnature(sygnatura) } : {}), url_orzeczenia: url,
        tresc: czesc, tresc_offset: offset, tresc_dlugosc: calosc.length, tresc_kompletna: offset + czesc.length >= calosc.length },
      uwaga: NOTA, retrieved_at: new Date().toISOString() });
  } catch (e) { return odp(blad(e)); }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("tk-mcp-server: nasłuchuję na stdio (MCP)");
}
