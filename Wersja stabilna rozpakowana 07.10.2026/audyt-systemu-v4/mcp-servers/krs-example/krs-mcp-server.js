#!/usr/bin/env node
/**
 * krs-mcp-server.js — serwer MCP dla Otwartego API Krajowego Rejestru
 * Sądowego (KRS), uruchomionego przez Ministerstwo Sprawiedliwości w 2022 r.
 * na podstawie ustawy o otwartych danych (zbadane i potwierdzone jako
 * publiczne, bez logowania — sesja 2026-07-13j/k).
 *
 * Zgodne z protokołem shared/MCP-INTEGRACJA.md i schematem
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md.
 *
 * ⚠️ STATUS UCZCIWY: protokół MCP zweryfikowany realnym klientem (patrz
 * test_protokol_mcp.mjs). Kształt odpowiedzi API OPARTY na publicznie
 * udokumentowanym wzorcu endpointu "odpis aktualny" (api-krs.ms.gov.pl/api/
 * krs/OdpisAktualny/{numerKRS}?rejestr=P&format=json) — NIE zostało to
 * potwierdzone żywym wywołaniem z tego środowiska (brak dostępu do domen
 * .gov.pl w sandboksie). Struktura JSON (pole `odpis.dane.dzial1...`) jest
 * wzorowana na oficjalnej dokumentacji Ministerstwa Sprawiedliwości, ale
 * MUSI zostać potwierdzona przez developera przy pierwszym uruchomieniu.
 *
 * Narzędzie: `krs_lookup` (nazwa zgodna z shared/KONEKTORY-REKOMENDOWANE.md).
 *
 * Szczególnie istotne dla PODMIOT-GATE w prawny-router-v3, który weryfikuje
 * status podmiotu/organu przed generowaniem pism.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

const KRS_BASE_URL = "https://api-krs.ms.gov.pl/api/krs";
// „Otwórz w źródle”: oficjalna wyszukiwarka KRS (prs.ms.gov.pl to aplikacja JavaScript bez treści
// dla podglądu). Pełny odpis aktualny do podglądu: Otwarte API KRS (url_podgladu).
export const KRS_WYSZUKIWARKA = "https://wyszukiwarka-krs.ms.gov.pl/";
// NIP/REGON → numer KRS: wykaz podatników VAT (wl-api.mf.gov.pl) podaje pole `krs` (zmierzone 2026-10-01:
// ORLEN NIP 7740001454 i REGON 610188201 → 0000028860). Otwarte API KRS nie ma wyszukiwania po NIP/REGON.
const WL_API = "https://wl-api.mf.gov.pl/api";

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "krs-connector", version: "1.1.0" }));

// ⛔ POPRAWKA 2026-09-27q (AUDYT-2026-09-27q) — zmierzone na żywym API KRS:
//  (1) tylko rejestr=P → fundacje i stowarzyszenia (rejestr S) dawały NOT_FOUND jak nieistniejący podmiot
//      (Fundacja WOŚP 0000030897: P → 404, S → 200). Teraz P, potem S.
//  (2) status „wykreslony” spoza schematu 4 wartości → „uchylony” + status_rejestru.
//  (3) NOWE `krs_reprezentacja` (luka F-212 wobec mcp-krs `get_board`): organ, sposób reprezentacji,
//      skład z `czyZawieszona`, prokurenci, organ nadzoru, stan rejestru. Pole organu to `nazwaOrganu` —
//      konkurencja czyta `nazwa` (brak w API) i nazwy organu nie pokazuje nigdy.
//  (4) PESEL w WOLNYM tekście: rejestr maskuje pola strukturalne, ale „rodzajProkury” ORLEN (0000028860)
//      zawiera pełne nazwisko i niezamaskowany PESEL innej osoby — maskowane tu, spójnie z API.

export function maskujPesel(t) {
  return typeof t === "string" ? t.replace(/(PESEL\s*:?\s*)(\d)\d{10}/gi, "$1$2**********").replace(/\b(\d)\d{10}\b/g, "$1**********") : t;
}
const osoba = (o) => [o?.imiona?.imie, o?.imiona?.imieDrugie, o?.nazwisko?.nazwiskoICzlon, o?.nazwisko?.nazwiskoCzlonPierwszy]
  .filter(Boolean).join(" ") || null;
const naglowek = (raw) => raw?.odpis?.naglowekA ?? {};

/** Normalizuje odpis aktualny (P albo S) do SCHEMAT-ODPOWIEDZI-MCP. Czysta funkcja. */
export function normalizujOdpowiedzKRS(raw, numerKrs) {
  if (raw?.status === 404 || raw == null) {
    return { status: "NOT_FOUND", query_type: "podmiot", source: "krs",
      uwaga: "Brak w rejestrze przedsiębiorców (P) i stowarzyszeń/fundacji (S). Sprawdź numer." };
  }
  const n = naglowek(raw);
  const dp = raw?.odpis?.dane?.dzial1?.danePodmiotu ?? {};
  const nazwa = dp.nazwa ?? dp.nazwaPodmiotu ?? null;
  if (!nazwa) return { status: "NOT_FOUND", query_type: "podmiot", source: "krs" };
  // pole wykreślenia — ⚠️ niezmierzone na podmiocie wykreślonym (brak przypadku testowego)
  const wykreslony = Boolean(raw?.odpis?.dane?.dzial6?.wykreslenie?.czyWykreslono || n.dataWykresleniaZRejestru);
  const w = {
    status: "FOUND", query_type: "podmiot", source: "krs",
    result: {
      identyfikator: `KRS ${numerKrs}`,
      tytul_lub_nazwa: nazwa,
      status_obowiazywania: wykreslony ? "uchylony" : "obowiazuje",
      status_rejestru: wykreslony ? "wykreślony" : "wpisany",
      rejestr: n.rejestr === "RejS" ? "S (stowarzyszenia, fundacje, SPZOZ)" : "P (przedsiębiorcy)",
      forma_prawna: dp.formaPrawna ?? null,
      data_publikacji_lub_wyroku: n.stanZDnia ?? null,
      stan_z_dnia: n.stanZDnia ?? null,
      data_ostatniego_wpisu: n.dataOstatniegoWpisu ?? null,
      url_zrodlowy: KRS_WYSZUKIWARKA,
      url_podgladu: `${KRS_BASE_URL}/OdpisAktualny/${numerKrs}?rejestr=${n.rejestr === "RejS" ? "S" : "P"}&format=json`,
      nip: dp.identyfikatory?.nip ?? null,
      // KRS dopełnia 9-cyfrowy REGON zerami do 14 cyfr; zwracamy REGON jednostki głównej.
      regon: dp.identyfikatory?.regon ? String(dp.identyfikatory.regon).replace(/^(\d{9})00000$/, "$1") : null,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
  if (wykreslony) w.uwaga = "⛔ Podmiot wykreślony z KRS.";
  return w;
}

/** Reprezentacja z działu 2 odpisu aktualnego. Czysta funkcja. */
export function normalizujReprezentacje(raw, numerKrs) {
  const podst = normalizujOdpowiedzKRS(raw, numerKrs);
  if (podst.status !== "FOUND") return podst;
  const d2 = raw.odpis.dane.dzial2 ?? {};
  const rep = d2.reprezentacja ?? {};
  const sklad = (rep.sklad ?? []).map((o) => ({ funkcja: o.funkcjaWOrganie ?? null, osoba_maska: osoba(o),
    zawieszony: o.czyZawieszona === true }));
  const prokurenci = (d2.prokurenci ?? []).map((p) => ({ osoba_maska: osoba(p), rodzaj_prokury: maskujPesel(p.rodzajProkury ?? null) }));
  const nadzor = (d2.organNadzoru ?? []).map((o) => ({ nazwa: o.nazwa ?? null, liczba_czlonkow: (o.sklad ?? []).length }));
  const r = podst.result;
  r.reprezentacja = {
    organ: rep.nazwaOrganu ?? null,
    sposob_reprezentacji: maskujPesel(rep.sposobReprezentacji ?? null),
    sklad, prokurenci, organ_nadzoru: nadzor,
  };
  const uw = [`Stan rejestru na dzień ${r.stan_z_dnia} (ostatni wpis ${r.data_ostatniego_wpisu}); wnioski w toku nie są widoczne w odpisie.`,
    "Imiona i nazwiska zamaskowane przez rejestr; PESEL w treści wolnej zamaskowany przez konektor."];
  const zaw = sklad.filter((s) => s.zawieszony);
  if (zaw.length) uw.unshift(`⚠️ Zawieszeni w czynnościach: ${zaw.map((s) => s.funkcja).join(", ")}.`);
  if (!rep.sposobReprezentacji) uw.unshift("⚠️ Odpis nie zawiera sposobu reprezentacji — ustal z umowy/statutu.");
  podst.uwaga = [podst.uwaga, ...uw].filter(Boolean).join(" ");
  return podst;
}

async function pobierzZKrs(numerKrs) {
  let ostatni;
  for (const rejestr of ["P", "S"]) {
    for (let proba = 1; proba <= 3; proba++) {
      try {
        const resp = await fetch(`${KRS_BASE_URL}/OdpisAktualny/${numerKrs}?rejestr=${rejestr}&format=json`, { signal: sygnal(20000) });
        if (resp.status === 404) { ostatni = null; break; }
        if (!resp.ok) throw new Error(`API KRS zwróciło HTTP ${resp.status}`);
        return await resp.json();
      } catch (e) { ostatni = e; }
    }
    if (ostatni) throw ostatni;
  }
  return { status: 404 };
}

export function regonPoprawny(regon) {
  const r = String(regon ?? "").replace(/[\s-]/g, "");
  const suma = (w, n) => w.reduce((s, x, i) => s + x * Number(n[i]), 0) % 11 % 10;
  if (/^\d{9}$/.test(r)) return suma([8, 9, 2, 3, 4, 5, 6, 7], r) === Number(r[8]);
  // 14 cyfr: KRS podaje REGON jednostki głównej dopełniony zerami (ORLEN 61018820100000), bez cyfry kontrolnej
  // REGON-14 — sprawdzamy 9-cyfrowy rdzeń, którym i tak szuka wykaz VAT.
  if (/^\d{14}$/.test(r)) return regonPoprawny(r.slice(0, 9));
  return false;
}
export function nipPoprawny(nip) {
  const n = String(nip ?? "").replace(/[\s-]/g, "");
  if (!/^\d{10}$/.test(n)) return false;
  return [6, 5, 7, 2, 3, 4, 5, 6, 7].reduce((s, x, i) => s + x * Number(n[i]), 0) % 11 === Number(n[9]);
}

/** Numer KRS z wykazu podatników VAT po NIP albo REGON (9 cyfr; 14-cyfrowy skracany do 9). */
async function krsZWykazu(rodzaj, wartosc) {
  const dzis = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date());
  const resp = await fetch(`${WL_API}/search/${rodzaj}/${wartosc}?date=${dzis}`, { signal: sygnal(20000) });
  const dane = await resp.json().catch(() => null);
  if (!resp.ok && resp.status !== 400) throw new Error(`Wykaz podatników VAT HTTP ${resp.status}`);
  const s = dane?.result?.subject ?? null;
  return { krs: s?.krs ?? null, nazwa: s?.name ?? null, nip: s?.nip ?? null, regon: s?.regon ?? null,
    requestId: dane?.result?.requestId ?? null, kod: dane?.code ?? null };
}

const odpowiedz = (w) => ({ content: [{ type: "text", text: JSON.stringify(w, null, 2) }] });
const blad = (err) => ({ status: "ERROR", query_type: "podmiot", source: "krs", detail: String(err?.message ?? err), retrieved_at: new Date().toISOString() });
const NUMER = z.string().regex(/^\d{1,10}$/).transform((s) => s.padStart(10, "0")).describe("Numer KRS (zera wiodące opcjonalne)");

server.registerTool("krs_lookup", {
  title: "Podmiot w KRS — istnienie, nazwa, forma, rejestr (P i S)",
  description: "Odpis aktualny z KRS po numerze: rejestr przedsiębiorców (P) albo stowarzyszeń/fundacji (S). " +
    "PODMIOT-GATE: czy podmiot istnieje i nie jest wykreślony. FOUND/NOT_FOUND/ERROR.",
  inputSchema: { numerKrs: NUMER },
}, async ({ numerKrs }) => {
  try { return odpowiedz(normalizujOdpowiedzKRS(await pobierzZKrs(numerKrs), numerKrs)); }
  catch (e) { return odpowiedz(blad(e)); }
});

server.registerTool("krs_reprezentacja", {
  title: "KRS — kto i jak reprezentuje podmiot (zarząd, sposób reprezentacji, prokura)",
  description: "Dział 2 odpisu aktualnego: organ, sposób reprezentacji, skład (z zawieszeniem), prokurenci, organ " +
    "nadzoru, stan rejestru na dzień. Do weryfikacji umocowania osób podpisujących.",
  inputSchema: { numerKrs: NUMER },
}, async ({ numerKrs }) => {
  try { return odpowiedz(normalizujReprezentacje(await pobierzZKrs(numerKrs), numerKrs)); }
  catch (e) { return odpowiedz(blad(e)); }
});

server.registerTool("krs_szukaj", {
  title: "KRS — podmiot po NIP albo REGON",
  description: "Ustala numer KRS po NIP albo REGON (przez wykaz podatników VAT Ministerstwa Finansów, który podaje KRS) " +
    "i zwraca odpis aktualny jak krs_lookup. Podmiot spoza wykazu VAT (np. niezarejestrowany do VAT) nie zostanie " +
    "znaleziony tą drogą — wtedy podaj numer KRS albo użyj wyszukiwarki KRS.",
  inputSchema: {
    nip: z.string().min(10).max(13).optional().describe("NIP (10 cyfr)"),
    regon: z.string().min(9).max(14).optional().describe("REGON (9 albo 14 cyfr)"),
  },
}, async ({ nip, regon }) => {
  const n = nip?.replace(/[\s-]/g, ""), r = regon?.replace(/[\s-]/g, "");
  const baza = { query_type: "podmiot", source: "krs", url_zrodlowy: KRS_WYSZUKIWARKA, retrieved_at: new Date().toISOString() };
  if (!n === !r) return odpowiedz({ status: "ERROR", ...baza, detail: "Podaj dokładnie jedno: NIP albo REGON." });
  if (n && !nipPoprawny(n)) return odpowiedz({ status: "ERROR", ...baza, detail: `NIP ${nip} ma niepoprawną sumę kontrolną — nie wysłano zapytania.` });
  if (r && !regonPoprawny(r)) return odpowiedz({ status: "ERROR", ...baza, detail: `REGON ${regon} ma niepoprawną sumę kontrolną — nie wysłano zapytania.` });
  try {
    const w = await krsZWykazu(n ? "nip" : "regon", n ?? r.slice(0, 9));
    if (!w.krs) {
      return odpowiedz({ status: "NOT_FOUND", ...baza,
        uwaga: w.nazwa
          ? `${w.nazwa} jest w wykazie podatników VAT, ale bez numeru KRS (np. osoba fizyczna — sprawdź CEIDG).`
          : `Brak podmiotu o ${n ? `NIP ${n}` : `REGON ${r}`} w wykazie podatników VAT, więc numeru KRS nie ustalono. ` +
            "To nie dowód, że podmiotu nie ma w KRS — podaj numer KRS albo użyj wyszukiwarki KRS." });
    }
    const wynik = normalizujOdpowiedzKRS(await pobierzZKrs(w.krs.padStart(10, "0")), w.krs.padStart(10, "0"));
    wynik.ustalono_przez = `wykaz podatników VAT (requestId ${w.requestId ?? "—"}): ${n ? `NIP ${n}` : `REGON ${r}`} → KRS ${w.krs}`;
    return odpowiedz(wynik);
  } catch (e) { return odpowiedz(blad(e)); }
});

// ⛔ POPRAWKA 2026-09-27m: `import.meta.url === \`file://${process.argv[1]}\`` był fałszywy na Windows
//    (ukośniki, litera dysku) i dla każdej ścieżki ze spacją (URL koduje %20) — serwer się wczytywał,
//    ale NIE otwierał transportu, więc host nie widział narzędzi. Porównanie po normalizacji ścieżek.
if (!globalThis.__LEX_MCP_WSPOLNY && process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("krs-mcp-server: nasłuchuję na stdio (MCP)");
}
