#!/usr/bin/env node
/**
 * ceidg-mcp-server.js — serwer MCP dla API CEIDG / Biznes.gov.pl (Centralna
 * Ewidencja i Informacja o Działalności Gospodarczej), potwierdzonego jako
 * publiczne API — ALE, w odróżnieniu od KRS/NBP/SUDOP/ISAP/SAOS, WYMAGA
 * bezpłatnego klucza API uzyskanego przez wniosek na dane.biznes.gov.pl
 * (sesja 2026-07-13j/k).
 *
 * ⚠️ STATUS UCZCIWY — WIĘKSZA NIEPEWNOŚĆ NIŻ POZOSTAŁE 4 SERWERY Z TEJ SESJI:
 * Dokumentacja publiczna znaleziona w tej sesji wskazuje na istnienie metody
 * synchronicznego wyszukiwania po NIP ("Interfejs METODA FIRMA"), ale główny
 * nurt dokumentacji "Hurtowni Danych CEIDG" opisuje API asynchroniczne
 * (żądanie raportu → sprawdzenie statusu → pobranie pliku CSV), a nie prosty
 * GET zwracający JSON od razu. Endpoint i kształt odpowiedzi poniżej to
 * NAJLEPSZE PRZYBLIŻENIE na podstawie fragmentów dokumentacji — WYMAGA
 * potwierdzenia przez developera z dostępem do pełnej dokumentacji API
 * (klucz + pełny PDF z dane.biznes.gov.pl) BARDZIEJ niż jakikolwiek inny
 * serwer w tej sesji.
 *
 * Wymaga zmiennej środowiskowej CEIDG_API_KEY (klucz z dane.biznes.gov.pl).
 *
 * Narzędzie: `ceidg_szukaj_firmy`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

// ⛔ POPRAWKA 2026-09-27h: wersja v2 zwraca HTTP 404 (zmierzone). Działa v3, ale wymaga
//    TOKENU (v3 bez nagłówka Authorization → HTTP 401). Token uzyskuje się z rejestracji
//    w CEIDG; bez niego konektor MUSI zwracać ERROR, nie udawać braku podmiotu.
const CEIDG_BASE_URL = "https://dane.biznes.gov.pl/api/ceidg/v3";

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "ceidg-connector", version: "1.1.0" }));

// ⛔ POPRAWKA 2026-09-29 (AUDYT-2026-09-29, F-214) — kształt zmierzony na ŻYWYM API v3 z tokenem:
//    (a) NIP i REGON są w `firmy[].wlasciciel.{nip,regon}`, NIE w `firmy[].nip` → poprzednio
//        `identyfikator: null` przy każdym FOUND;
//    (b) NIP spoza CEIDG (np. spółka z KRS) → HTTP 204 BEZ treści → poprzednio `resp.json()`
//        rzucało „Unexpected end of JSON input” i narzędzie zwracało ERROR zamiast NOT_FOUND;
//    (c) NIP z błędną sumą kontrolną → HTTP 400 {code:"NIEPOPRAWNY_NUMER_NIP"} — teraz odsiewane
//        lokalnie (bez zużywania limitu zapytań) i komunikowane wprost;
//    (d) jeden NIP może mieć KILKA wpisów (wykreślony + aktywny) — zwracamy wszystkie, `result`
//        wskazuje wpis AKTYWNY, a przy jego braku najnowszy;
//    (e) 401/403/429 dostają osobne, czytelne komunikaty (429: NIE ponawiać — limit liczony od
//        ostatniego żądania, ponawianie przedłuża blokadę; DOSTEP-MASZYNOWY-API.md §4).
export const CEIDG_WYSZUKIWARKA = "https://aplikacja.ceidg.gov.pl/CEIDG/CEIDG.Public.UI/Search.aspx";

export function nipPoprawny(nip) {
  const n = String(nip ?? "").replace(/[\s-]/g, "");
  if (!/^\d{10}$/.test(n)) return false;
  const s = [6, 5, 7, 2, 3, 4, 5, 6, 7].reduce((a, w, i) => a + w * Number(n[i]), 0) % 11;
  return s === Number(n[9]);
}

function wpis(firma) {
  const w = firma?.wlasciciel ?? {};
  const a = firma?.adresDzialalnosci ?? null;
  return {
    identyfikator: w.nip ?? firma?.nip ?? null,
    regon: w.regon ?? firma?.regon ?? null,
    tytul_lub_nazwa: firma?.nazwa ?? firma?.firma ?? null,
    wlasciciel: [w.imie, w.nazwisko].filter(Boolean).join(" ") || null,
    status_ceidg: firma?.status ?? null,
    status_obowiazywania: firma?.status === "AKTYWNY" ? "obowiazuje" : (firma?.status ?? "nieznany"),
    data_publikacji_lub_wyroku: firma?.dataRozpoczecia ?? null,
    adres_dzialalnosci: a ? [a.ulica, [a.budynek, a.lokal].filter(Boolean).join("/"), a.kod, a.miasto].filter(Boolean).join(" ") : null,
    id_ceidg: firma?.id ?? null,
    url_rekordu_api: firma?.link ?? null,
    url_zrodlowy: CEIDG_WYSZUKIWARKA,
  };
}

export function normalizujOdpowiedzCEIDG(raw, nipZapytania = null) {
  const lista = Array.isArray(raw?.firmy) ? raw.firmy : (raw?.firma ? [raw.firma] : []);
  if (!lista.length) {
    return {
      status: "NOT_FOUND", query_type: "podmiot", source: "ceidg",
      uwaga: "Brak wpisu w CEIDG dla tego NIP. CEIDG obejmuje wyłącznie przedsiębiorców-osoby fizyczne " +
        "(i wspólników s.c.) — spółkę prawa handlowego sprawdź w KRS (api-krs.ms.gov.pl) albo na białej liście VAT.",
      retrieved_at: new Date().toISOString(),
    };
  }
  const wpisy = lista.map(wpis);
  const aktywne = wpisy.filter((w) => w.status_ceidg === "AKTYWNY");
  const najnowszy = [...wpisy].sort((x, y) => String(y.data_publikacji_lub_wyroku ?? "").localeCompare(String(x.data_publikacji_lub_wyroku ?? "")))[0];
  const wynik = {
    status: "FOUND", query_type: "podmiot", source: "ceidg",
    result: aktywne[0] ?? najnowszy,
    liczba_wpisow: wpisy.length,
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
  const uw = [];
  if (wpisy.length > 1) { wynik.wpisy = wpisy; uw.push(`NIP ma ${wpisy.length} wpisy w CEIDG — sprawdź, który dotyczy okresu z Twojej sprawy.`); }
  if (aktywne.length > 1) uw.push("Więcej niż jeden wpis AKTYWNY dla jednego NIP — sytuacja nietypowa, zweryfikuj ręcznie w wyszukiwarce CEIDG.");
  if (!aktywne.length) uw.push(`⚠️ Brak wpisu AKTYWNEGO — status najnowszego: ${najnowszy.status_ceidg ?? "nieznany"}.`);
  if (nipZapytania && wynik.result.identyfikator && wynik.result.identyfikator !== nipZapytania)
    uw.push(`⛔ NIP w odpowiedzi (${wynik.result.identyfikator}) ≠ NIP zapytania (${nipZapytania}) — nie używaj wyniku.`);
  if (uw.length) wynik.uwaga = uw.join(" ");
  return wynik;
}

// API CEIDG odpowiada bywa po 20–40 s; 15 s dawało ERROR przy działającym API. Ponowienie tylko po
// przekroczeniu czasu albo błędzie sieci (nigdy po 429 — limit liczony od ostatniego żądania).
const CEIDG_TIMEOUT_MS = 45000;

async function pobierzZCeidg(nip, apiKey) {
  const url = `${CEIDG_BASE_URL}/firmy?nip=${encodeURIComponent(nip)}`;
  const zapytanie = () => fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    signal: sygnal(CEIDG_TIMEOUT_MS),
  });
  let resp;
  try { resp = await zapytanie(); }
  catch { resp = await zapytanie(); }
  if (resp.status === 204 || resp.status === 404) return null;   // brak wpisu — nie błąd
  const tekst = await resp.text();
  let json = null;
  try { json = tekst ? JSON.parse(tekst) : null; } catch { /* treść nie-JSON */ }
  if (resp.ok) return json;
  const kod = json?.code ? ` ${json.code}` : "";
  if (resp.status === 401) throw new Error("API CEIDG HTTP 401 — token nieprawidłowy, wygasły albo nieprzekazany (sprawdź CEIDG_API_KEY).");
  if (resp.status === 403) throw new Error("API CEIDG HTTP 403 — token bez uprawnień do tej metody.");
  if (resp.status === 429) throw new Error("API CEIDG HTTP 429 — przekroczony limit zapytań. NIE ponawiaj od razu: limit liczony od ostatniego żądania, ponawianie przedłuża blokadę.");
  throw new Error(`API CEIDG HTTP ${resp.status}${kod}${json?.message ? ` — ${json.message}` : ""}`);
}

server.registerTool(
  "ceidg_szukaj_firmy",
  {
    title: "Weryfikacja jednoosobowej działalności gospodarczej w CEIDG",
    description:
      "Sprawdza wpis przedsiębiorcy-osoby fizycznej po NIP w CEIDG (API v3): nazwa, właściciel, REGON, " +
      "status (AKTYWNY/ZAWIESZONY/WYKREŚLONY…), data rozpoczęcia, adres. Wszystkie wpisy dla NIP. " +
      "Spółki handlowe → KRS. WYMAGA tokenu CEIDG_API_KEY.",
    inputSchema: {
      nip: z.string().regex(/^\d{10}$/).describe("10-cyfrowy NIP przedsiębiorcy"),
    },
  },
  async ({ nip }) => {
    const apiKey = process.env.CEIDG_API_KEY;
    const blad = (detail) => ({ status: "ERROR", query_type: "podmiot", source: "ceidg", detail, retrieved_at: new Date().toISOString() });
    let wynik;
    if (!apiKey) {
      wynik = blad("Brak CEIDG_API_KEY w zmiennych środowiskowych — wymagany klucz z dane.biznes.gov.pl");
    } else if (!nipPoprawny(nip)) {
      wynik = blad(`NIP ${nip} ma niepoprawną sumę kontrolną — nie wysłano zapytania (oszczędność limitu).`);
    } else {
      try {
        wynik = normalizujOdpowiedzCEIDG(await pobierzZCeidg(nip, apiKey), nip);
      } catch (err) {
        wynik = blad(String(err?.message ?? err));
      }
    }
    return { content: [{ type: "text", text: JSON.stringify(wynik, null, 2) }] };
  }
);

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ceidg-mcp-server: nasłuchuję na stdio (MCP)");
}
