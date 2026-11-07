#!/usr/bin/env node
/**
 * sn-mcp-server.js — orzeczenia Sądu Najwyższego z oficjalnej bazy sn.pl (2026-10-06).
 *
 * Mechanika portalu od 2026 r. (pomiar CI G22, AUDYT-2026-10-06):
 *  • wyszukiwarka https://www.sn.pl/pl/wyszukiwarka-orzeczen pobiera wyniki przez
 *    `GET /pl/index.php?option=com_ajax&plugin=snproxy&format=json&task=searchOrzeczenia&sygnatura=…`
 *    (1.4.0: ścieżka /pl/; wcześniej /index.php — która działa, pokazuje pole `endpoint` z sondy sn_captcha_auto);
 *    → rekordy {id, sygnatura_sprawy, data_wydania, forma_orzeczenia, …} (różne głębokości opakowania);
 *  • tekst: `task=OrzeczeniePlikHtml&id=ID` → base64 HTML (`OrzeczeniePlikPdf` → base64 PDF);
 *  • ŹRÓDŁEM jest KARTA orzeczenia: https://www.sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=ID.
 *    Adres `blob:https://www.sn.pl/…` to kopia w jednej karcie przeglądarki (nie do powołania),
 *    a stary katalog /sites/orzecznictwo/Orzeczenia3/*.pdf nie serwuje orzeczeń — brak pliku tam
 *    NIE dowodzi braku publikacji.
 *  • sygnatury innych sądów (NSA/WSA, sądy powszechne, KIO, TK) nie są w tej bazie — narzędzie
 *    zwraca, gdzie ich szukać, zamiast mylącego „brak trafień”.
 * Orzeczenie SN to materiał orzeczniczy (R2A), nie źródło brzmienia przepisu; przepis weryfikuj w ELI.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer } from "../wspolne/budzet.mjs";
import {
  autoWlaczone,
  rozwiazAutomatycznie,
  zapiszSesjePlik,
  sciezkaSesji,
  stanOkna,
} from "./sn-captcha-auto.mjs";

const PROXY = "https://www.sn.pl/pl/index.php";
const KARTA = "https://www.sn.pl/pl/wyszukiwarka-orzeczen";
const HOSTY = new Set(["sn.pl", "www.sn.pl"]);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const PORCJA = 20000;
const MAX_BASE64 = 8_000_000;

export const REPERTORIA_SN = new Set([
  "CSK", "CSKP", "KK", "NKK", "UK", "NSNC", "NSNU", "NKN", "CNP", "CNPP", "SDI", "ZK", "CZP", "KZP",
  "UZP", "PZP", "NSNZP", "SNO", "DSI", "DSP", "CZ", "KO", "KSP", "NSW"
]);
const NSA = new Set(["OSK", "FSK", "GSK", "OZ", "FZ", "GZ", "OPS", "FPS", "GPS", "OW", "FW", "GW"]);
const POWSZECHNE = new Set([
  "C", "Ca", "ACa", "ACz", "Cz", "Ns", "Nc", "Co", "Cps", "Nkd", "Nsm", "RC", "RCa", "RCz", "GC", "GCo", "GNc", "GNs",
  "Ga", "Gz", "AGa", "AGz", "GU", "Gzt", "K", "Ka", "Kz", "Kp", "Ko", "AKa", "AKz", "AKo", "W", "Wz", "Kop", "Kow",
  "P", "Pa", "Pz", "Po", "APa", "APz", "U", "Ua", "Uz", "AUa", "AUz", "Nmo"
]);
const TK = new Set(["K", "P", "SK", "U", "Kp", "Kpt", "Pp", "Ts", "Tw", "S"]);

/** „II  C.S.K.P. 89/26” → „II CSKP 89/26”. */
export function normalizujSygnature(s) {
  return String(s ?? "").normalize("NFKC").replace(/\./g, "").replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim();
}

/** Sąd właściwy dla sygnatury (repertorium); null = nie rozpoznano. Repertoria sądów powszechnych są wrażliwe na wielkość liter. */
export function sadSygnatury(s) {
  const m = /^(?:([IVXL]{1,5})\s+)?([A-Z][A-Za-z]{0,5})(?:\/([A-Z][a-z]{1,2}))?\s+\d{1,6}\/\d{2,4}$/u.exec(normalizujSygnature(s));
  if (!m) return null;
  const [, rzymska, rep, siedziba] = m;
  if (rep === "KIO") return "KIO";
  if (siedziba) return /^SAB?$/.test(rep) ? "NSA/WSA" : null;
  if (NSA.has(rep)) return "NSA/WSA";
  if (rep === rep.toUpperCase() && REPERTORIA_SN.has(rep)) return "SN";
  if (rzymska && POWSZECHNE.has(rep)) return "sąd powszechny";
  return !rzymska && TK.has(rep) ? "TK" : null;
}

const GDZIE = {
  "NSA/WSA": "CBOSA (cbosa_sprawdz_sygnature) — orzeczenia.nsa.gov.pl",
  "sąd powszechny": "Portal Orzeczeń Sądów Powszechnych (orzeczenia.ms.gov.pl); SAOS tylko pomocniczo",
  KIO: "wyszukiwarka UZP (kio_sprawdz_sygnature)",
  TK: "ipo.trybunal.gov.pl",
};

/** ID karty z linku „…?orzeczenie=ID” albo samego ID. */
export function idKarty(v) {
  const t = String(v ?? "").trim();
  const zLinku = /[?&]orzeczenie=([\w-]{6,80})/u.exec(t)?.[1];
  if (zLinku) return zLinku;
  return /^[A-Za-z0-9_-]{12,40}$/u.test(t) && /[A-Za-z]/.test(t) ? t : null;
}
export const urlKarty = (id) => `${KARTA}?orzeczenie=${encodeURIComponent(id)}`;

/** Link, który nie jest źródłem: blob: albo stary katalog PDF (z nazwy pliku odzyskuje sygnaturę). */
export function problemLinku(v) {
  const t = String(v ?? "").trim();
  if (/^blob:/i.test(t)) return { rodzaj: "BLOB" };
  let u;
  try { u = new URL(t); } catch { return null; }
  if (!HOSTY.has(u.hostname.toLowerCase()) || !/\/sites\/orzecznictwo\//i.test(u.pathname)) return null;
  const nazwa = decodeURIComponent(u.pathname.split("/").pop() ?? "").replace(/\.(pdf|docx?|rtf)$/i, "").replace(/_/g, " ");
  const m = /^(.*\S)\s+(\d{1,6})-(\d{2,4})(?:-\d+)?$/u.exec(nazwa);
  return { rodzaj: "STARY_PDF", ...(m ? { sygnatura: `${m[1]} ${m[2]}/${m[3]}` } : {}) };
}

const obiekt = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : null);
const wyglada = (o) => obiekt(o) && ("sygnatura_sprawy" in o || "data_wydania" in o || "forma_orzeczenia" in o);

/** Rekordy wyszukiwania z dowolnej głębokości opakowania com_ajax; null = nieznany kształt. Czysta funkcja. */
export function rekordy(v, glebokosc = 0) {
  if (glebokosc > 6) return null;
  if (Array.isArray(v)) {
    if (!v.length) return [];
    if (v.every(wyglada)) return v;
    for (const x of v) { const r = rekordy(x, glebokosc + 1); if (r !== null) return r; }
    return null;
  }
  const o = obiekt(v);
  if (!o) return null;
  if ("sygnatura_sprawy" in o) return [o];
  for (const k of ["data", "items", "records", "results", "orzeczenia"]) {
    if (k in o) { const r = rekordy(o[k], glebokosc + 1); if (r !== null) return r; }
  }
  return null;
}

/** Błąd po stronie sn.pl w kopercie com_ajax ({error, debug}). */
export function bladSn(v) {
  let cur = v;
  for (let i = 0; i <= 4; i += 1) {
    const o = obiekt(cur) ?? obiekt(Array.isArray(cur) ? cur[0] : null);
    if (!o) return null;
    if (o.error !== undefined && o.error !== null && o.error !== false && !("sygnatura_sprawy" in o)) return String(o.error);
    cur = o.data;
  }
  return null;
}

/** Base64 z odpowiedzi OrzeczeniePlikHtml (data[0].raw albo data[0].data.raw). */
export function surowyTekst(v) {
  const p = obiekt(Array.isArray(obiekt(v)?.data) ? obiekt(v).data[0] : null);
  const raw = typeof p?.raw === "string" && p.raw ? p.raw : obiekt(p?.data)?.raw;
  return typeof raw === "string" && raw && raw.length <= MAX_BASE64 && /^[A-Za-z0-9+/=\s]+$/.test(raw) ? raw : null;
}

const ENCJE = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const dekoduj = (t) => String(t ?? "")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ENCJE[n.toLowerCase()] ?? m);
export const tekst = (html) => dekoduj(String(html ?? "")
  .replace(/<(script|style|head)[\s\S]*?<\/\1>/gi, "")
  .replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|tr|h\d)>/gi, "\n").replace(/<[^>]+>/g, " "))
  .split("\n").map((l) => l.replace(/[ \t ]+/g, " ").trim()).filter(Boolean).join("\n");

function proxy(task, params) {
  const u = new URL(PROXY);
  for (const [k, v] of Object.entries({ option: "com_ajax", plugin: "snproxy", format: "json", task, ...params })) u.searchParams.set(k, v);
  return u.toString();
}

// Żądania jak widżet wyszukiwarki (referer, XHR, JSON). Ochrona przed botami sn.pl odpowiada 403
// albo 200 ze stroną HTML (weryfikacja przeglądarki, „<html style=…”) — wtedy raz otwieramy
// wyszukiwarkę po ciasteczka sesji i ponawiamy (pomiar CI 2026-10-06; zgłoszenie użytkownika 2026-10-06).
export class BlokadaSn extends Error {}

// Sesja z weryfikacji wykonanej przez użytkownika (captcha w oknie sn.pl w aplikacji albo ręcznie skopiowane
// ciasteczka): SN_SESSION_FILE (JSON {cookie, userAgent, saved_at}, czytany przy każdym zapytaniu) i SN_COOKIE.
// Wartości ciasteczek nigdy nie trafiają do odpowiedzi ani logów.
const CIASTKO = /^[A-Za-z0-9_.\-]{1,128}=[^;\r\n]{0,4096}$/;
const ciastkaZ = (t) => String(t ?? "").split(";").map((x) => x.trim()).filter((x) => CIASTKO.test(x));
export function sesjaUzytkownika(env = process.env, czytaj = (f) => readFileSync(f, "utf8")) {
  let plik = null;
  // Domyślna ścieżka sesji (sn-captcha-auto / sn_sesja_ustaw), jeśli nie ustawiono SN_SESSION_FILE
  const plikSciezka = env.SN_SESSION_FILE || sciezkaSesji(env);
  try { plik = JSON.parse(czytaj(plikSciezka)); } catch { plik = null; }
  const ua = typeof plik?.userAgent === "string" && /^Mozilla\/5\.0 [\x20-\x7e]{10,400}$/.test(plik.userAgent) ? plik.userAgent : null;
  const ciastka = [...ciastkaZ(env.SN_COOKIE), ...ciastkaZ(plik?.cookie)];
  const nazwy = new Set();
  const unikalne = ciastka.reverse().filter((c) => !nazwy.has(c.split("=")[0]) && nazwy.add(c.split("=")[0])).reverse();
  return {
    ciastka: unikalne,
    ua,
    zapisana: typeof plik?.saved_at === "string" ? plik.saved_at : null,
    sciezka: plikSciezka,
    source: plik?.source ?? null,
  };
}

/** Opis weryfikacji dla aplikacji i modelu, gdy sn.pl zablokował zapytanie automatyczne. */
export function weryfikacjaSn(sesja = sesjaUzytkownika()) {
  const zapisana = sesja.ciastka.length > 0;
  return {
    wymagana: true, url: KARTA, sesja_zapisana: zapisana, ...(sesja.zapisana ? { sesja_z: sesja.zapisana } : {}),
    instrukcja: zapisana
      ? "sn.pl odrzucił zapisaną sesję (wygasła albo ochrona wymaga nowej weryfikacji). Zweryfikuj ponownie w oknie sn.pl (przycisk w aplikacji) i ponów zapytanie."
      : "sn.pl wymaga weryfikacji człowieka (captcha). W aplikacji: „Zweryfikuj w sn.pl”, rozwiąż captcha w oknie sn.pl, kliknij „Gotowe” i ponów zapytanie. Poza aplikacją: ustaw SN_COOKIE z sesji przeglądarki.",
  };
}

/** Treść odpowiedzi snproxy: JSON albo opis, dlaczego to nie dane (strona HTML, ochrona przed botami). */
export function rozpoznajOdpowiedz(status, typ, tekst) {
  const t = String(tekst ?? "");
  const html = /^\s*</.test(t) || (/text\/html/i.test(typ ?? "") && !/^\s*[[{]/.test(t));
  if (status === 403 || html) {
    const bot = status === 403 || /incapsula|imperva|incident_id|_Incapsula_Resource|captcha|challenge/i.test(t);
    return { blad: new BlokadaSn(bot
      ? "sn.pl: ochrona przed botami — strona weryfikacji przeglądarki zamiast danych (HTTP " + status + ")"
      : "sn.pl: strona HTML zamiast danych JSON (HTTP " + status + "; przerwa techniczna albo zmiana portalu)") };
  }
  if (status < 200 || status >= 300) return { blad: new Error(`sn.pl HTTP ${status}`) };
  try { return { dane: JSON.parse(t) }; } catch { return { blad: new Error("sn.pl: odpowiedź nie jest poprawnym JSON (zmiana portalu?)") }; }
}

async function pobierzJson(url) {
  const sesja = sesjaUzytkownika();
  const pierwsza = await zadanieSn(url, sesja.ciastka, false, sesja.ua);
  const tekst1 = await pierwsza.r.text();
  const odczyt = rozpoznajOdpowiedz(pierwsza.r.status, pierwsza.r.headers.get("content-type"), tekst1);
  if (!(odczyt.blad instanceof BlokadaSn)) {
    if (odczyt.blad) throw odczyt.blad;
    return odczyt.dane;
  }
  const strona = await zadanieSn(KARTA, pierwsza.ciastka, true, sesja.ua).catch(() => null);
  if (strona) await strona.r.arrayBuffer().catch(() => null);
  const druga = (await zadanieSn(url, strona ? strona.ciastka : pierwsza.ciastka, false, sesja.ua)).r;
  const tekst2 = await druga.text();
  const wynik = rozpoznajOdpowiedz(druga.status, druga.headers.get("content-type"), tekst2);
  if (!(wynik.blad instanceof BlokadaSn)) {
    if (wynik.blad) throw wynik.blad;
    return wynik.dane;
  }
  // Automatyczne przejście weryfikacji (Playwright bez okna, potem okno widoczne w tle), gdy SN_CAPTCHA_AUTO=1
  if (autoWlaczone()) {
    const auto = await rozwiazAutomatycznie(tekst2 || tekst1, KARTA).catch((e) => ({
      ok: false, method: "error", playwright_error: e.message,
    }));
    if (auto.ok) {
      const po = sesjaUzytkownika();
      const trzecia = (await zadanieSn(url, po.ciastka, false, po.ua)).r;
      const tekst3 = await trzecia.text();
      const w3 = rozpoznajOdpowiedz(trzecia.status, trzecia.headers.get("content-type"), tekst3);
      if (w3.blad) {
        const err = w3.blad;
        err.auto_captcha = { ok: true, method: auto.method, nadal_blokada: true };
        throw err;
      }
      return w3.dane;
    }
    const err = wynik.blad;
    err.auto_captcha = auto;
    throw err;
  }
  throw wynik.blad;
}

async function zadanieSn(url, poczatkowe, strona = false, ua = null) {
  let adres = url;
  let ciastka = poczatkowe;
  for (let i = 0; i <= 3; i += 1) {
    const r = await fetch(adres, {
      redirect: "manual", signal: sygnal(40000),
      headers: {
        "User-Agent": ua ?? UA, "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8", "Cache-Control": "no-cache", Pragma: "no-cache",
        ...(strona
          ? { Accept: "text/html,application/xhtml+xml,*/*;q=0.8", "Sec-Fetch-Dest": "document", "Sec-Fetch-Mode": "navigate", "Sec-Fetch-Site": "none" }
          : { Accept: "application/json, text/javascript, */*; q=0.01", Referer: KARTA, Origin: "https://www.sn.pl", "X-Requested-With": "XMLHttpRequest",
              "Sec-Fetch-Dest": "empty", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Site": "same-origin" }),
        ...(ciastka.length ? { Cookie: ciastka.join("; ") } : {}),
      },
    });
    const nowe = (r.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]);
    ciastka = [...ciastka.filter((c) => !nowe.some((n) => n.split("=")[0] === c.split("=")[0])), ...nowe];
    if (r.status >= 300 && r.status < 400) {
      const dalej = new URL(r.headers.get("location") ?? "", adres);
      if (dalej.protocol !== "https:" || !HOSTY.has(dalej.hostname)) throw new Error("Przekierowanie poza sn.pl");
      adres = dalej.toString();
      continue;
    }
    return { r, ciastka };
  }
  throw new Error("Za dużo przekierowań sn.pl");
}

const baza = { source: "sn.pl", query_type: "orzeczenie" };
// Błąd snproxy wskazujący na SESJĘ/weryfikację (nie na wadliwe zapytanie): widżet sn.pl woła snproxy
// bez parametru token — „Brak tokenu” znaczy, że sesja nie jest zweryfikowana (jak blokada bot), a nie
// że brakuje pola w żądaniu. Taki błąd kierujemy w ścieżkę BlokadaSn: fallback SAOS + instrukcja
// „Zweryfikuj w sn.pl → Gotowe → ponów” (zgł. 2026-10-07: „Brak tokenu” leciał jako martwy ERROR).
export const ERR_SESJA_SN = /brak\s+token|token|sesj|autoryz|uprawnie|zaloguj|wygas|captcha|zweryfik|niezalogowan/i;
const NOTA = "Źródło = KARTA orzeczenia (link „url_karty”), nigdy blob: ani PDF. Orzeczenie SN to materiał orzeczniczy (R2A), " +
  "przepis weryfikuj w ELI. Brak trafienia nie dowodzi braku orzeczenia (np. jeszcze nieopublikowane).";
const odp = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const blad = (e) => ({ status: "ERROR", ...baza, detail: String(e?.message ?? e),
  ...(e instanceof BlokadaSn ? { powod: "SN_WERYFIKACJA_WYMAGANA", weryfikacja: weryfikacjaSn() } : {}),
  ...(e?.auto_captcha ? { auto_captcha: e.auto_captcha } : {}), retrieved_at: new Date().toISOString() });
const pozycja = (r) => ({
  sygnatura: normalizujSygnature(r.sygnatura_sprawy),
  data_wydania: typeof r.data_wydania === "string" ? r.data_wydania.slice(0, 10) : null,
  forma: r.forma_orzeczenia ?? null,
  id_karty: String(r.id ?? ""),
  url_karty: r.id ? urlKarty(String(r.id)) : null,
});

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "sn-connector", version: "1.0.0" }));

server.registerTool("sn_sprawdz_sygnature", {
  title: "Sprawdź sygnaturę orzeczenia Sądu Najwyższego",
  description: "Czy w oficjalnej bazie sn.pl jest orzeczenie o tej sygnaturze (dokładne dopasowanie); zwraca kartę orzeczenia " +
    "(url_karty) do powołania. Sygnatura innego sądu → wskazanie właściwej bazy.",
  inputSchema: { sygnatura: z.string().min(4).max(40).describe("np. II CSKP 89/26, III CZP 25/11") },
}, async ({ sygnatura }) => {
  const oczekiwana = normalizujSygnature(sygnatura);
  const sad = sadSygnatury(oczekiwana);
  if (sad && sad !== "SN") {
    return odp({ status: "OUT_OF_SCOPE", ...baza, oczekiwana, sad, powod: "SYGNATURA_INNEGO_SADU",
      uwaga: `${oczekiwana} to sygnatura: ${sad}. Szukaj w: ${GDZIE[sad]}. Baza sn.pl jej nie zawiera.` });
  }
  try {
    const dane = await pobierzJson(proxy("searchOrzeczenia", { sygnatura: oczekiwana, strona: "1", rozmiar_strony: "25" }));
    const upstream = bladSn(dane);
    if (upstream) {
      if (ERR_SESJA_SN.test(upstream)) throw new BlokadaSn(`sn.pl: ${upstream} — sesja niezweryfikowana`);
      return odp({ status: "ERROR", ...baza, oczekiwana, detail: `sn.pl zgłosił błąd: ${upstream}`, retrieved_at: new Date().toISOString() });
    }
    const lista = rekordy(dane);
    if (lista === null) return odp({ status: "ERROR", ...baza, oczekiwana, detail: "Nieznany kształt odpowiedzi snproxy (zmiana portalu?).", retrieved_at: new Date().toISOString() });
    const trafione = lista.filter((r) => normalizujSygnature(r.sygnatura_sprawy).toUpperCase() === oczekiwana.toUpperCase());
    if (!trafione.length) {
      return odp({ status: "OUT_OF_SCOPE", ...baza, oczekiwana, odrzucone: lista.map((r) => normalizujSygnature(r.sygnatura_sprawy)).slice(0, 10),
        uwaga: `Brak dokładnego trafienia ${oczekiwana} w bazie sn.pl. ${NOTA}`, retrieved_at: new Date().toISOString() });
    }
    return odp({ status: trafione.length === 1 ? "FOUND" : "AMBIGUOUS", ...baza, oczekiwana,
      ...(trafione.length === 1 ? { result: pozycja(trafione[0]) } : { kandydaci: trafione.map(pozycja) }),
      uwaga: NOTA, retrieved_at: new Date().toISOString(), confidence: "deterministic" });
  } catch (e) {
    if (!(e instanceof BlokadaSn)) return odp(blad(e));
    // sn.pl nie wpuszcza (ochrona przed botami): SAOS zastępczo (RZĄD 3, SN do 2016 r.), z jawnym oznaczeniem.
    const zastepczo = await saosSn(oczekiwana).catch((s) => ({ blad: String(s?.message ?? s) }));
    const wspolne = { ...baza, oczekiwana, sn_blad: e.message, wyszukiwarka_sn: KARTA, powod: "SN_WERYFIKACJA_WYMAGANA", weryfikacja: weryfikacjaSn(),
      ...(e.auto_captcha ? { auto_captcha: e.auto_captcha } : {}), retrieved_at: new Date().toISOString() };
    if (zastepczo.blad || !zastepczo.trafione?.length) {
      return odp({ status: "ERROR", ...wspolne, detail: e.message, ...(zastepczo.blad ? { saos_blad: zastepczo.blad } : { saos: "brak trafienia (SAOS ma SN do 2016 r.)" }),
        uwaga: `sn.pl zablokował zapytanie automatyczne. Zweryfikuj się w sn.pl (weryfikacja.instrukcja) i ponów zapytanie albo sprawdź ${oczekiwana} ręcznie w wyszukiwarce SN (wyszukiwarka_sn) i powołaj kartę orzeczenia. Brak trafienia ≠ brak orzeczenia.` });
    }
    return odp({ status: zastepczo.trafione.length === 1 ? "FOUND" : "AMBIGUOUS", ...wspolne, source: "saos (zastępczo za sn.pl)", rzad: "R3",
      ...(zastepczo.trafione.length === 1 ? { result: zastepczo.trafione[0] } : { kandydaci: zastepczo.trafione }),
      uwaga: `sn.pl zablokował zapytanie automatyczne; rekord z SAOS (RZĄD 3, agregator akademicki). Przed powołaniem znajdź kartę orzeczenia w wyszukiwarce SN (wyszukiwarka_sn) i powołuj kartę, nie SAOS.` });
  }
});

/** SAOS (RZĄD 3) dla SN po sygnaturze — tylko gdy sn.pl nie wpuszcza. */
async function saosSn(syg) {
  const r = await fetch(`https://www.saos.org.pl/api/search/judgments?caseNumber=${encodeURIComponent(syg)}&courtType=SUPREME&pageSize=10`,
    { signal: sygnal(30000), headers: { Accept: "application/json", "User-Agent": "LexMachina-sn/1.0" } });
  const t = await r.text();
  if (!r.ok || /^\s*</.test(t)) throw new Error(`SAOS HTTP ${r.status}${/^\s*</.test(t) ? " (strona HTML)" : ""}`);
  const dane = JSON.parse(t);
  const trafione = (dane.items ?? [])
    .filter((it) => (it.courtCases ?? []).some((c) => normalizujSygnature(c.caseNumber).toUpperCase() === syg.toUpperCase()))
    .map((it) => ({ sygnatura: syg, data_wydania: it.judgmentDate ?? null, forma: it.judgmentType ?? null, url_saos: `https://www.saos.org.pl/judgments/${it.id}` }));
  return { trafione };
}

export const FORMY = [
  "wyrok SN", "wyrok SN SD", "wyrok siedmiu sędziów SN", "wyrok siedmiu sędziów SN SD", "postanowienie SN", "postanowienie SN SD",
  "postanowienie siedmiu sędziów SN", "postanowienie całej Izby SN", "uchwała SN", "uchwała SN SD", "uchwała siedmiu sędziów SN",
  "uchwała siedmiu sędziów SN zasada prawna", "uchwała siedmiu sędziów SN SD", "uchwała całej izby SN", "uchwała całej Izby SN zasada prawna",
  "uchwała połączonych izb SN", "uchwała połączonych Izb SN zasada prawna", "uchwała pełnego składu SN", "uchwała pełnego składu SN zasada prawna",
  "orzeczenie", "zarządzenie", "wyciąg z protokołu", "opinia",
];
export const IZBY = [
  "Izba Cywilna", "Izba Karna", "Izba Odpowiedzialności Zawodowej", "Izba Pracy i Ubezpieczeń Społecznych",
  "Izba Pracy, Ubezpieczeń Społecznych i Spraw Publicznych", "Izba Wojskowa", "Izba Administracyjna, Pracy i Ubezpieczeń Społecznych",
  "Izba Kontroli Nadzwyczajnej i Spraw Publicznych", "Izba Dyscyplinarna",
];
export const SKLADY = ["Skład", "Skład 1-osobowy", "Skład 3-osobowy", "Skład 5-osobowy", "Skład 7-osobowy", "Skład całej Izby SN", "Skład połączonych Izb SN", "Skład całego SN"];

/**
 * Parametry snproxy jak w widżecie wyszukiwarki sn.pl (kod strony, 2026-10-06): treść idzie jako q i tresc,
 * „w dniu” = od i do tego samego dnia. Czysta funkcja.
 */
export function parametrySzukania(a) {
  const od = a.dataWDniu || a.dataOd || "";
  const doo = a.dataWDniu || a.dataDo || "";
  const p = {
    q: a.tresc, tresc: a.tresc, sygnatura: a.sygnatura ? normalizujSygnature(a.sygnatura) : "", forma_orzeczenia: a.forma,
    data_wydania_od: od, data_wydania_do: doo, izba: a.izba, sklad_sedziowski: a.sklad, sedzia_w_skladzie: a.sedzia,
    przewodniczacy: a.przewodniczacy, sprawozdawca: a.sprawozdawca, wspolsprawozdawca: a.wspolsprawozdawca,
    autor_uzasadnienia: a.autorUzasadnienia, strona: String(a.strona ?? 1), rozmiar_strony: String(a.naStrone ?? 25),
  };
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== ""));
}

/** Kontrola trafień wobec pytanych pól, które rekord zawiera (sygnatura, forma, daty). Czysta funkcja. */
export function pasujeDoFiltra(r, a) {
  const syg = normalizujSygnature(r.sygnatura_sprawy).toUpperCase();
  const data = typeof r.data_wydania === "string" ? r.data_wydania.slice(0, 10) : "";
  const od = a.dataWDniu || a.dataOd, doo = a.dataWDniu || a.dataDo;
  return (!a.sygnatura || syg === normalizujSygnature(a.sygnatura).toUpperCase())
    && (!a.forma || !r.forma_orzeczenia || String(r.forma_orzeczenia).trim().toLowerCase() === a.forma.trim().toLowerCase())
    && (!od || !data || data >= od) && (!doo || !data || data <= doo);
}

const DATA = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional();
server.registerTool("sn_szukaj", {
  title: "Szukaj orzeczeń Sądu Najwyższego (wszystkie pola wyszukiwarki sn.pl)",
  description: "Wyszukiwarka bazy orzeczeń SN: treść orzeczenia i uzasadnienia, sygnatura, forma, data (w dniu / od / do), izba, " +
    "skład, sędziowie. Zwraca karty orzeczeń (url_karty) do powołania; trafienia sprawdzane wobec sygnatury, formy i dat.",
  inputSchema: {
    tresc: z.string().min(2).max(300).optional().describe("W treści orzeczenia i uzasadnienia"),
    sygnatura: z.string().min(4).max(40).optional(),
    forma: z.enum(FORMY).optional(),
    dataWDniu: DATA.describe("data wydania RRRR-MM-DD"), dataOd: DATA, dataDo: DATA,
    izba: z.enum(IZBY).optional(),
    sklad: z.enum(SKLADY).optional(),
    sedzia: z.string().max(80).optional(), przewodniczacy: z.string().max(80).optional(), sprawozdawca: z.string().max(80).optional(),
    wspolsprawozdawca: z.string().max(80).optional(), autorUzasadnienia: z.string().max(80).optional(),
    strona: z.number().int().min(1).max(500).optional(),
    naStrone: z.union([z.literal(10), z.literal(25), z.literal(50), z.literal(100)]).optional(),
  },
}, async (a) => {
  const p = parametrySzukania(a);
  if (!Object.keys(p).some((k) => !["strona", "rozmiar_strony"].includes(k))) {
    return odp({ status: "ERROR", ...baza, detail: "Podaj co najmniej jedno pole wyszukiwania." });
  }
  if (a.sygnatura) {
    const sad = sadSygnatury(a.sygnatura);
    if (sad && sad !== "SN") return odp({ status: "OUT_OF_SCOPE", ...baza, sad, powod: "SYGNATURA_INNEGO_SADU", uwaga: `Szukaj w: ${GDZIE[sad]}.` });
  }
  try {
    const dane = await pobierzJson(proxy("searchOrzeczenia", p));
    const upstream = bladSn(dane);
    if (upstream) {
      if (ERR_SESJA_SN.test(upstream)) throw new BlokadaSn(`sn.pl: ${upstream} — sesja niezweryfikowana`);
      return odp({ status: "ERROR", ...baza, detail: `sn.pl zgłosił błąd: ${upstream}`, retrieved_at: new Date().toISOString() });
    }
    const lista = rekordy(dane);
    if (lista === null) return odp({ status: "ERROR", ...baza, detail: "Nieznany kształt odpowiedzi snproxy (zmiana portalu?).", retrieved_at: new Date().toISOString() });
    const trafione = lista.filter((r) => pasujeDoFiltra(r, a));
    return odp({ status: trafione.length ? "AMBIGUOUS" : "OUT_OF_SCOPE", ...baza, query_type: "wyszukiwanie", strona: a.strona ?? 1,
      kandydaci: trafione.map(pozycja), ...(lista.length > trafione.length ? { odrzucone_niepasujace: lista.length - trafione.length } : {}),
      ...(lista.length === Number(p.rozmiar_strony) ? { nastepna_strona: (a.strona ?? 1) + 1 } : {}),
      uwaga: "Kandydaci z wyszukiwarki SN — przed powołaniem sprawdź treść (sn_pobierz). " + NOTA, retrieved_at: new Date().toISOString() });
  } catch (e) { return odp(blad(e)); }
});

server.registerTool("sn_pobierz", {
  title: "Pobierz orzeczenie Sądu Najwyższego (po karcie)",
  description: "Pełny tekst orzeczenia SN po karcie (link …?orzeczenie=ID albo samo ID); porcjami po 20 000 znaków (offset). " +
    "Link blob: albo stary PDF /sites/orzecznictwo/ nie jest źródłem — narzędzie poprosi o sygnaturę lub kartę.",
  inputSchema: {
    karta: z.string().min(6).max(300).describe("https://www.sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=ID albo ID"),
    offset: z.number().int().min(0).optional(),
  },
}, async ({ karta, offset = 0 }) => {
  const problem = problemLinku(karta);
  if (problem) {
    return odp({ status: "OUT_OF_SCOPE", ...baza, powod: problem.rodzaj === "BLOB" ? "LINK_TYMCZASOWY_BLOB" : "STARY_KATALOG_PDF",
      ...(problem.sygnatura ? { sygnatura_z_nazwy_pliku: problem.sygnatura } : {}),
      uwaga: problem.rodzaj === "BLOB"
        ? "blob: to kopia w jednej karcie przeglądarki — nikt inny jej nie otworzy. Poproś o sygnaturę albo link do karty."
        : `Stary katalog PDF sn.pl nie serwuje orzeczeń.${problem.sygnatura ? ` Sprawdź sygnaturę ${problem.sygnatura} narzędziem sn_sprawdz_sygnature.` : " Poproś o sygnaturę albo kartę."}` });
  }
  const id = idKarty(karta);
  if (!id) return odp({ status: "ERROR", ...baza, detail: "To nie jest karta orzeczenia sn.pl (…?orzeczenie=ID) ani ID." });
  try {
    const dane = await pobierzJson(proxy("OrzeczeniePlikHtml", { id }));
    const raw = surowyTekst(dane);
    if (!raw) return odp({ status: "NOT_FOUND", ...baza, id_karty: id, url_karty: urlKarty(id), uwaga: `sn.pl nie zwrócił tekstu dla karty ${id}.` });
    const calosc = tekst(Buffer.from(raw.replace(/\s+/g, ""), "base64").toString("utf8"));
    const sygnatura = /Sygn\.?\s*akt:?\s*([IVXL]{1,5}\s+[A-Z]{2,6}\s+\d{1,6}\/\d{2,4})/u.exec(calosc)?.[1] ?? null;
    const czesc = calosc.slice(offset, offset + PORCJA);
    return odp({ status: "FOUND", ...baza, confidence: "deterministic",
      result: {
        sygnatura: sygnatura ? normalizujSygnature(sygnatura) : null,
        id_karty: id, url_karty: urlKarty(id), url_zrodlowy: urlKarty(id),
        tresc: czesc, tresc_offset: offset, tresc_dlugosc: calosc.length, tresc_kompletna: offset + czesc.length >= calosc.length,
      },
      uwaga: NOTA, retrieved_at: new Date().toISOString() });
  } catch (e) { return odp(blad(e)); }
});

/** Status zapisanej sesji (bez wartości cookie). */
server.registerTool("sn_sesja_status", {
  title: "Status sesji sn.pl",
  description: "Czy jest aktywna sesja po weryfikacji (SN_SESSION_FILE / SN_COOKIE).",
  inputSchema: {},
}, async () => {
  const s = sesjaUzytkownika();
  return odp({
    status: "OK",
    sesja_zapisana: s.ciastka.length > 0,
    cookies_count: s.ciastka.length,
    names: s.ciastka.map((c) => c.split("=")[0]),
    saved_at: s.zapisana,
    source: s.source,
    path: s.sciezka,
    auto_captcha_env: autoWlaczone(),
    okno_weryfikacji: stanOkna(),
    retrieved_at: new Date().toISOString(),
  });
});

/** Ręczne wklejenie Cookie po captcha (format SN_SESSION_FILE). */
server.registerTool("sn_sesja_ustaw", {
  title: "Ustaw sesję sn.pl (Cookie po captcha)",
  description: "Po przejściu challenge w przeglądarce wklej nagłówek Cookie. Zapisuje SN_SESSION_FILE. Wartości nie są logowane.",
  inputSchema: {
    cookie: z.string().min(10).max(8000).describe("Pełny ciąg Cookie z DevTools"),
    userAgent: z.string().min(20).max(400).optional().describe("Opcjonalny User-Agent z tej samej sesji"),
  },
}, async ({ cookie, userAgent }) => {
  try {
    const r = zapiszSesjePlik({ cookie, userAgent: userAgent || UA, source: "sn_sesja_ustaw" });
    return odp({ status: "OK", ...r, uwaga: "Sesja zapisana. Ponów sn_sprawdz_sygnature / sn_pobierz.", retrieved_at: new Date().toISOString() });
  } catch (e) {
    return odp({ status: "ERROR", detail: e.message });
  }
});

/**
 * Przejście weryfikacji sn.pl bez płatnych usług (1.7.0): widoczne okno w tle w przeglądarce systemowej
 * (Edge/Chrome/Chromium przez DevTools; bez niej okno Playwrighta), w którym weryfikację przechodzi
 * użytkownik. Z zainstalowanym Playwrightem najpierw próba bez okna w budżecie wywołania.
 * Ustawienia są przekazywane kopią env — wywołanie nie zmienia process.env serwera (tryb wspólny).
 */
server.registerTool("sn_captcha_auto", {
  title: "Przejdź weryfikację sn.pl (okno przeglądarki, bez płatnych usług)",
  description:
    "Gdy sn.pl blokuje zapytania: otwiera widoczne okno przeglądarki użytkownika (Edge/Chrome) na sn.pl, " +
    "w którym użytkownik przechodzi weryfikację; sesja zapisuje się sama, okno się zamyka. Z zainstalowanym " +
    "Playwrightem najpierw próba bez okna. headless:false = od razu okno. Stan: sn_sesja_status.",
  inputSchema: {
    headless: z.boolean().optional().describe("false = od razu widoczne okno do weryfikacji przez użytkownika"),
  },
}, async ({ headless }) => {
  const env = { ...process.env, ...(headless === false ? { SN_CAPTCHA_HEADLESS: "0" } : headless === true ? { SN_CAPTCHA_HEADLESS: "1" } : {}) };
  try {
    const r = await rozwiazAutomatycznie("", KARTA, env);
    if (r.ok) {
      return odp({ status: "OK", method: r.method, endpoint: r.endpoint, path: r.path, cookies_count: r.cookies_count,
        names: r.names, saved_at: r.saved_at, steps: r.steps, uwaga: "Sesja zapisana. Ponów zapytanie SN.",
        retrieved_at: new Date().toISOString() });
    }
    if (r.oczekuje_na_uzytkownika) {
      return odp({ status: "PENDING", powod: "SN_WERYFIKACJA_W_OKNIE", ...r, retrieved_at: new Date().toISOString() });
    }
    return odp({ status: "ERROR", powod: "AUTO_CAPTCHA_FAILED", ...r, weryfikacja: weryfikacjaSn(), retrieved_at: new Date().toISOString() });
  } catch (e) {
    return odp({ status: "ERROR", detail: e.message, retrieved_at: new Date().toISOString() });
  }
});

if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  await server.connect(new StdioServerTransport());
  console.error("sn-mcp-server: nasłuchuję na stdio (MCP)");
}
