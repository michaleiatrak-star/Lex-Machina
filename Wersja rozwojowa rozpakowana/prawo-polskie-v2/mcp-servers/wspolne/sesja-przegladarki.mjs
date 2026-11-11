// sesja-przegladarki.mjs — źródła za ochroną antybotową (Cloudflare, DataDome, Imperva, F5) dla
// wszystkich konektorów naraz (zgłoszenie użytkownika 2026-11-11: „R2A tak jak SN”).
//
// 1. Rozpoznanie: odpowiedź, która jest stroną weryfikacji przeglądarki, a nie danymi źródła, kończy
//    się błędem z oznaczeniem LAW_SOURCE_VERIFICATION_REQUIRED:<host>. Aplikacja otwiera wtedy okno
//    tego hosta (najpierw zminimalizowane; w trybie serwerowym próba przeglądarką na serwerze), a po
//    weryfikacji ponawia pytanie. Konektor nie zgaduje treści i nie podaje braku danych.
// 2. Sesja: ciasteczka i User-Agent z tego okna zapisuje aplikacja w pliku LEX_BROWSER_SESSIONS_FILE
//    ({"hosts": {"<host>": {"cookie", "userAgent", "saved_at"}}}); plik jest czytany przy każdym
//    zapytaniu do danego hosta. Wartości ciasteczek nigdy nie trafiają do odpowiedzi ani logów.
//
// sn.pl ma własną obsługę (sn-mcp-server.js, SN_SESSION_FILE) i jest tu pomijany.

import { readFileSync } from "node:fs";

export const OZNACZENIE = "LAW_SOURCE_VERIFICATION_REQUIRED";

// Strona samej ochrony, nie źródła: znaczniki dostawców. Zwykła strona z reCAPTCHA w formularzu nie jest blokadą.
const STRONA_OCHRONY =
  /<title>Just a moment\.\.\.<\/title>|cf-chl-|\/cdn-cgi\/challenge-platform\/|Attention Required! \| Cloudflare|captcha-delivery\.com|geo\.captcha|_Incapsula_Resource|incident_id|Request unsuccessful\. Incapsula|TSPD_101|The requested URL was rejected\. Please consult with your administrator|Weryfikacja przeglądarki|weryfikacja przegladarki/iu;
const POMIJANE = /(^|\.)sn\.pl$/iu;
const CIASTKO = /^[A-Za-z0-9_.\-]{1,128}=[^;\r\n]{0,4096}$/;

export class BlokadaPrzegladarki extends Error {
  constructor(host, status) {
    super(`${OZNACZENIE}:${host} — źródło odpowiada stroną weryfikacji przeglądarki (HTTP ${status}), nie danymi. Aplikacja otworzy okno tego źródła; po weryfikacji zapytanie zostanie ponowione. To nie jest brak danych w źródle.`);
    this.name = "BlokadaPrzegladarki";
    this.host = host;
  }
}

export function jestStronaOchrony(status, typ, tekst) {
  const html = /text\/html/iu.test(typ ?? "") || /^\s*</u.test(tekst ?? "");
  if (!html) return false;
  const t = String(tekst ?? "").slice(0, 30_000);
  if ([401, 403, 429, 503].includes(status)) return STRONA_OCHRONY.test(t) || t.length < 4_000 && /captcha|challenge|access denied|forbidden/iu.test(t);
  return status >= 200 && status < 300 && t.length < 60_000 && STRONA_OCHRONY.test(t);
}

/** Sesja z okna weryfikacji dla hosta (ciasteczka i User-Agent) albo null. */
export function sesjaHosta(host, env = process.env, czytaj = (f) => readFileSync(f, "utf8")) {
  const plik = env.LEX_BROWSER_SESSIONS_FILE;
  if (!plik) return null;
  let dane;
  try {
    dane = JSON.parse(czytaj(plik));
  } catch {
    return null;
  }
  const wpis = dane?.hosts?.[String(host).toLowerCase()];
  if (!wpis || typeof wpis.cookie !== "string") return null;
  const ciastka = wpis.cookie.split(";").map((x) => x.trim()).filter((x) => CIASTKO.test(x));
  if (!ciastka.length) return null;
  const ua = typeof wpis.userAgent === "string" && /^Mozilla\/5\.0 [\x20-\x7e]{10,400}$/.test(wpis.userAgent) ? wpis.userAgent : null;
  return { cookie: ciastka.join("; "), ua };
}

/**
 * Owija globalny fetch: dokłada sesję z okna dla hosta i zamienia stronę ochrony w BlokadaPrzegladarki.
 * Wywoływane raz, w lex-mcp.js, przed wczytaniem konektorów.
 */
export function zainstalujSesjePrzegladarki(env = process.env) {
  const oryginal = globalThis.fetch;
  if (typeof oryginal !== "function" || oryginal.__lexSesja) return;
  const owiniety = async (wejscie, opcje = {}) => {
    let url;
    try {
      url = new URL(typeof wejscie === "string" || wejscie instanceof URL ? String(wejscie) : wejscie.url);
    } catch {
      return oryginal(wejscie, opcje);
    }
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || POMIJANE.test(host)) return oryginal(wejscie, opcje);
    const sesja = sesjaHosta(host, env);
    let init = opcje;
    if (sesja) {
      const naglowki = new Headers(opcje.headers ?? (typeof wejscie === "object" && !(wejscie instanceof URL) ? wejscie.headers : undefined));
      const istniejace = naglowki.get("cookie");
      naglowki.set("cookie", istniejace ? `${istniejace}; ${sesja.cookie}` : sesja.cookie);
      if (sesja.ua) naglowki.set("user-agent", sesja.ua);
      init = { ...opcje, headers: naglowki };
    }
    const odpowiedz = await oryginal(wejscie, init);
    const typ = odpowiedz.headers.get("content-type") ?? "";
    if ([401, 403, 429, 503].includes(odpowiedz.status) || (/text\/html/iu.test(typ) && odpowiedz.ok)) {
      const tekst = await odpowiedz.clone().text().catch(() => "");
      if (jestStronaOchrony(odpowiedz.status, typ, tekst)) throw new BlokadaPrzegladarki(host, odpowiedz.status);
    }
    return odpowiedz;
  };
  owiniety.__lexSesja = true;
  globalThis.fetch = owiniety;
}
