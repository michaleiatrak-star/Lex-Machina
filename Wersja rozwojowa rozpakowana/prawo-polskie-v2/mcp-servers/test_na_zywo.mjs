#!/usr/bin/env node
// test_na_zywo.mjs — pomiar TREŚCI odpowiedzi wszystkich przykładowych serwerów na żywym API.
// Wprowadzony w AUDYT-2026-09-27j po dwóch sesjach z rzędu, w których SELF-TEST OK przepuścił
// błędy treści ([object Object] w KRS; null zamiast sygnatury w SAOS; NOT_FOUND w weekend w NBP).
// Wymaga: `npm ci` w katalogu mcp-servers (wspólne zależności, od 27s). Zmienne proxy są przekazywane jawnie —
// SDK domyślnie przekazuje serwerowi tylko HOME/PATH/SHELL/TERM (ustalenie 27h).
// Uruchomienie: node test_na_zywo.mjs   → kod wyjścia 0 tylko, gdy wszystkie asercje przeszły.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
const TU = path.dirname(fileURLToPath(import.meta.url));

async function wywolaj(katalog, plik, narzedzie, args) {
  const t = new StdioClientTransport({ command: "node", args: [plik], cwd: path.join(TU, katalog),
    env: { ...process.env }, stderr: "ignore" });
  const c = new Client({ name: "test-na-zywo", version: "1.0.0" });
  await c.connect(t);
  try {
    const r = await c.callTool({ name: narzedzie, arguments: args });
    return JSON.parse(r.content[0].text);
  } finally { await c.close(); }
}

const PRZYPADKI = [
  ["ISAP: „Kodeks cywilny” → AMBIGUOUS, kandydaci z tytułem i statusem", "isap-eli-example", "isap-eli-mcp-server.js",
    "isap_lookup", { query: "Kodeks cywilny" },
    (w) => w.status === "AMBIGUOUS" && w.kandydaci.every((k) => k.tytul_lub_nazwa && k.status_obowiazywania)],
  ["ISAP: DU/1964/93 (KC pierwotny) → tekst_jednolity_nieaktualny + aktualny t.j.", "isap-eli-example", "isap-eli-mcp-server.js",
    "isap_lookup", { eli: "DU/1964/93" },
    (w) => w.status === "FOUND" && w.result.status_obowiazywania === "tekst_jednolity_nieaktualny" && /Kodeks cywilny/.test(w.result.aktualny_tekst_jednolity?.tytul_lub_nazwa ?? "")],
  ["KRS: 0000019193 → PKP S.A.", "krs-example", "krs-mcp-server.js", "krs_lookup",
    { numerKrs: "0000019193" },
    (w) => w.status === "FOUND" && /POLSKIE KOLEJE PAŃSTWOWE/.test(w.result?.tytul_lub_nazwa)],
  ["NBP: EUR z soboty 26.09.2026 → tabela z 25.09, przesunięcie jawne", "nbp-example", "nbp-mcp-server.js",
    "nbp_kurs_waluty", { kodWaluty: "EUR", data: "2026-09-26" },
    (w) => w.status === "FOUND" && w.result.data_tabeli === "2026-09-25" &&
      w.result.przesuniecie_dni === 1 && typeof w.result.kurs_sredni === "number" && !!w.uwaga],
  ["SAOS: sygnatura prawdziwa II PK 291/09 → FOUND z sygnaturą", "saos-example", "saos-mcp-server.js",
    "saos_search", { sygnatura: "II PK 291/09" },
    (w) => w.status === "FOUND" && w.result.identyfikator === "II PK 291/09" && /^Sąd Najwyższy/.test(w.result.sad)],
  ["SAOS: fabrykat III CZP 999/11 → NOT_FOUND", "saos-example", "saos-mcp-server.js",
    "saos_search", { sygnatura: "III CZP 999/11" }, (w) => w.status === "NOT_FOUND"],
  ["SAOS: KIO → sygnatury KIO", "saos-example", "saos-mcp-server.js", "saos_search",
    { fraza: "wadium", courtType: "NATIONAL_APPEAL_CHAMBER", pageSize: 2 },
    (w) => ["FOUND", "AMBIGUOUS"].includes(w.status) && (w.kandydaci ?? [w.result]).filter(Boolean).length > 0 &&
      (w.kandydaci ?? [w.result]).filter(Boolean).every((k) => /KIO/.test(k.identyfikator ?? ""))],
  ["SAOS: NSA/WSA → OUT_OF_SCOPE, nie „brak orzecznictwa”", "saos-example", "saos-mcp-server.js",
    "saos_search", { fraza: "podatek", courtType: "ADMINISTRATIVE" }, (w) => w.status === "OUT_OF_SCOPE"],
  ["EUR-Lex: RODO → obowiązuje, tytuł PL", "eurlex-example", "eurlex-mcp-server.js", "eurlex_lookup",
    { celex: "32016R0679" },
    (w) => w.status === "FOUND" && w.result.status_obowiazywania === "obowiazuje" && /^Rozporządzenie/.test(w.result.tytul_lub_nazwa)],
  ["EUR-Lex: dyrektywa 95/46 → uchylona 2018-05-24", "eurlex-example", "eurlex-mcp-server.js", "eurlex_lookup",
    { celex: "31995L0046" },
    (w) => w.result?.status_obowiazywania === "uchylony" && w.result.koniec_obowiazywania === "2018-05-24"],
  ["CEIDG: spółka z KRS → NOT_FOUND z odesłaniem do KRS (z kluczem) / ERROR bez klucza", "ceidg-example", "ceidg-mcp-server.js",
    "ceidg_szukaj_firmy", { nip: "5261040828" },
    // ⛔ 2026-09-29 (F-214): 5261040828 to spółka z KRS → API v3 oddaje HTTP 204 → oczekiwany NOT_FOUND.
    //    Poprzednio `w.status !== "ERROR"` — a serwer i tak zwracał ERROR („Unexpected end of JSON input”).
    (w) => process.env.CEIDG_API_KEY ? (w.status === "NOT_FOUND" && /KRS/.test(w.uwaga ?? "")) : (w.status === "ERROR" && /CEIDG_API_KEY/.test(w.detail))],
  ["CEIDG: błędna suma kontrolna NIP → ERROR bez zapytania (oszczędność limitu)", "ceidg-example", "ceidg-mcp-server.js",
    "ceidg_szukaj_firmy", { nip: "6340000543" },
    (w) => w.status === "ERROR" && (/sumę kontrolną/.test(w.detail) || (!process.env.CEIDG_API_KEY && /CEIDG_API_KEY/.test(w.detail)))],
  ["SUDOP: zlecenie → wynik albo PENDING z kolejka_id (bez crasha)", "sudop-example", "sudop-mcp-server.js",
    "sudop_szukaj_pomocy", { nip: "5261040828" },
    (w) => (w.detail === "PENDING" && /^[0-9a-f-]{36}$/.test(w.kolejka_id)) || ["FOUND", "NOT_FOUND", "AMBIGUOUS"].includes(w.status)],
  ["EUREKA: pełna sygnatura → FOUND, aktualna", "eureka-example", "eureka-mcp-server.js",
    "eureka_sprawdz_sygnature", { sygnatura: "0112-KDIL1-1.4012.678.2026.1.WK" },
    (w) => w.status === "FOUND" && w.result.status_obowiazywania === "obowiazuje"],
  ["EUREKA: ucięta sygnatura → NOT_FOUND (post-check, nie prefiks)", "eureka-example", "eureka-mcp-server.js",
    "eureka_sprawdz_sygnature", { sygnatura: "0112-KDIL1-1.4012.678.2026" },
    (w) => w.status === "NOT_FOUND" && (w.odrzucone_post_checkiem ?? []).length >= 1],
  ["EUREKA: interpretacja zmieniona → FOUND + ⛔", "eureka-example", "eureka-mcp-server.js",
    "eureka_sprawdz_sygnature", { sygnatura: "0112-KDIL3.4012.100.2021.4.MBN" },
    (w) => w.status === "FOUND" && w.result.status_obowiazywania === "uchylony" && /NIE jest aktualna/.test(w.uwaga)],
  ["EUREKA: dokument po ID → treść bez HTML", "eureka-example", "eureka-mcp-server.js",
    "eureka_pobierz", { id: "709097" },
    (w) => w.status === "FOUND" && w.result.tresc_dlugosc > 5000 && !/<p/.test(w.result.tresc)],
  ["CBOSA: III OSK 1959/22 → FOUND, snapshot 🟨 (⚠️ z sandboxa Claude brama zwraca 503 — uruchom u siebie)", "cbosa-example", "cbosa-mcp-server.js",
    "cbosa_sprawdz_sygnature", { sygnatura: "III OSK 1959/22" },
    (w) => w.status === "FOUND" && w.snapshot === "🟨" && w.result.identyfikator === "III OSK 1959/22"],
  ["KRS: fundacja WOŚP (rejestr S) → FOUND, nie NOT_FOUND", "krs-example", "krs-mcp-server.js", "krs_lookup", { numerKrs: "30897" },
    (w) => w.status === "FOUND" && /^S/.test(w.result.rejestr)],
  ["KRS: reprezentacja PKP → sposób + skład + prokurenci, bez PESEL", "krs-example", "krs-mcp-server.js", "krs_reprezentacja", { numerKrs: "0000019193" },
    (w) => w.status === "FOUND" && /PREZESA/.test(w.result.reprezentacja.sposob_reprezentacji) && w.result.reprezentacja.sklad.length > 0 && !/\d{11}/.test(JSON.stringify(w))],
  ["ISAP: treść art. 118 KC przez DU/1964/93 → aktualny t.j., brzmienie obowiązujące", "isap-eli-example", "isap-eli-mcp-server.js", "isap_tekst", { eli: "DU/1964/93", artykul: "118" },
    (w) => w.status === "FOUND" && w.result.wersja_tekstu === "tekst_jednolity" && /sześć lat/.test(w.result.tresc) && !!w.result.tj_nie_obejmuje],
  ["TSUE: C-131/12 → wyrok Google Spain + opinia RG", "eurlex-example", "eurlex-mcp-server.js", "eurlex_tsue", { sygnatura: "C-131/12" },
    (w) => w.status === "FOUND" && w.result.identyfikator === "C-131/12" && w.result.ecli === "ECLI:EU:C:2014:317" && w.powiazane.length >= 1],
  ["SAOS: cytator III CRN 126/80 → sygnał odstąpienia (SN odstąpił w III CKN 1283/00)", "saos-example", "saos-mcp-server.js", "saos_cytator", { sygnatura: "III CRN 126/80" },
    (w) => w.status === "FOUND" && w.result.z_sygnalem_odstapienia >= 1 && w.zakres_skanu.przeskanowano_pelnych > 0 && w.result.przeskanowano > 0 /* 2026-10-01: było 0 mimo pobranych tekstów */],
  ["SAOS: cytator III CKN 1283/00 → „samo odstąpiło” (kierunek), nie sygnał przeciw niemu", "saos-example", "saos-mcp-server.js", "saos_cytator", { sygnatura: "III CKN 1283/00" },
    (w) => w.status === "FOUND" && w.result.z_sygnalem_odstapienia === 0 && w.cytujace.some((c) => c.sygnaly.some((s) => /samo odstąpiło/.test(s.etykieta)))],
  ["SAOS: sygnatura SN z 2017 (poza zasięgiem SAOS) → OUT_OF_SCOPE, nie „zmyślona”", "saos-example", "saos-mcp-server.js", "saos_search", { sygnatura: "III CZP 29/17", courtType: "SUPREME" },
    (w) => w.status === "OUT_OF_SCOPE" && /po 2016/.test(w.powod)],
  ["UODO: DKN.5112.33.2022 → FOUND, prawomocna (z ostatniego zdarzenia, nie z daty ogłoszenia)", "uodo-example", "uodo-mcp-server.js", "uodo_sprawdz_sygnature", { sygnatura: "DKN.5112.33.2022" },
    (w) => w.status === "FOUND" && w.result.prawomocnosc === "prawomocna" && !!w.result.data_uprawomocnienia],
  ["UODO: prefiks DKN.5112.1 → NOT_FOUND (post-check), nie potwierdzenie", "uodo-example", "uodo-mcp-server.js", "uodo_sprawdz_sygnature", { sygnatura: "DKN.5112.1" },
    (w) => w.status === "NOT_FOUND" && (w.odrzucone_post_checkiem ?? []).length > 0],
  ["KIO: KIO 827/18 → FOUND (dokładne dopasowanie w wyszukiwarce UZP)", "kio-example", "kio-mcp-server.js", "kio_sprawdz_sygnature", { sygnatura: "KIO 827/18" },
    (w) => w.status === "FOUND" && w.result.identyfikator === "KIO 827/18" && !!w.result.id_kio],
  ["KIO: fraza „rażąco niska cena” → lista orzeczeń z sygnaturą, datą i id", "kio-example", "kio-mcp-server.js", "kio_szukaj", { fraza: "rażąco niska cena" },
    (w) => w.status === "AMBIGUOUS" && w.liczba_trafien > 100 && w.kandydaci.length === 10 &&
      w.kandydaci.every((k) => /^KIO /.test(k.identyfikator ?? "") && /^\d{4}-\d{2}-\d{2}$/.test(k.data_wyroku ?? "") && !!k.id_kio)],
  ["KIO: kio_pobierz 32291 → KIO 4983/25 z metryką i treścią", "kio-example", "kio-mcp-server.js", "kio_pobierz", { id: "32291" },
    (w) => w.status === "FOUND" && /KIO 4983\/25/.test(w.result.identyfikator) && w.result.tresc.length > 1000 && w.result.przepisy_pzp.length > 0],
  ["KIO: sprawa łączona KIO 2306/23 → FOUND (sygnatury rozdzielone „|”)", "kio-example", "kio-mcp-server.js", "kio_sprawdz_sygnature", { sygnatura: "KIO 2306/23" },
    (w) => w.status === "FOUND" && w.result.sygnatury.includes("KIO 2306/23")],
  ["KIO: kontrola sądowa KIO 44/12 → wyrok SO I Ca 117/12 „zmienia”", "kio-example", "kio-mcp-server.js", "kio_kontrola_sadowa", { sygnatura: "KIO 44/12" },
    (w) => w.status === "FOUND" && w.orzeczenia_sadu.some((o) => /I Ca 117\/12/i.test(o.identyfikator) && /zmienia/.test(o.rozstrzygniecie ?? "")) && /⛔/.test(w.uwaga)],
  ["KIO: data z przyszłości w źródle (KIO 4983/25) → ostrzezenie_daty", "kio-example", "kio-mcp-server.js", "kio_sprawdz_sygnature", { sygnatura: "KIO 4983/25" },
    (w) => w.status === "FOUND" && (w.result.data_wyroku <= new Date().toISOString().slice(0, 10) || /PÓŹNIEJSZA/.test(w.result.ostrzezenie_daty ?? ""))],
  ["KIO: fikcyjna KIO 99999/18 → OUT_OF_SCOPE", "kio-example", "kio-mcp-server.js", "kio_sprawdz_sygnature", { sygnatura: "KIO 99999/18" },
    (w) => w.status === "OUT_OF_SCOPE"],
  ["Biała lista: GUS 5261040828 → Czynny, requestId", "wl-example", "wl-mcp-server.js", "wl_sprawdz_nip", { nip: "5261040828" },
    (w) => w.status === "FOUND" && w.result.status_vat === "Czynny" && !!w.dowod_sprawdzenia.requestId],
  ["Biała lista: rachunek obcy (poprawny formalnie) → NOT_FOUND z requestId", "wl-example", "wl-mcp-server.js", "wl_sprawdz_rachunek", { nip: "5261040828", rachunek: "41101000000000000012345678" },
    (w) => w.status === "NOT_FOUND" && w.result.rachunek_na_liscie === false && !!w.dowod_sprawdzenia.requestId],
  ["Biała lista: NIP z błędną sumą kontrolną → ERROR lokalnie, bez zapytania", "wl-example", "wl-mcp-server.js", "wl_sprawdz_nip", { nip: "5261040829" },
    (w) => w.status === "ERROR" && /sumę kontrolną/.test(w.detail)],
];

let bledy = 0;
// Walidator kontraktu (shared/SCHEMAT-ODPOWIEDZI-MCP.md, od 3.94): KAŻDA odpowiedź, niezależnie od przypadku.
const STATUSY = ["FOUND", "NOT_FOUND", "AMBIGUOUS", "OUT_OF_SCOPE", "ERROR"];
const OBOW = ["obowiazuje", "uchylony", "tekst_jednolity_nieaktualny", "nieznany"];
function schemat(w) {
  const e = [];
  if (!STATUSY.includes(w.status)) e.push(`status spoza schematu: ${w.status}`);
  if (!w.source || !w.query_type) e.push("brak source/query_type");
  if (w.status === "FOUND" && !w.result?.identyfikator) e.push("FOUND bez result.identyfikator");
  if (w.status === "OUT_OF_SCOPE" && !w.powod && !w.uwaga) e.push("OUT_OF_SCOPE bez powodu");
  for (const r of [w.result, ...(w.kandydaci ?? [])].filter(Boolean))
    if (r.status_obowiazywania !== undefined && !OBOW.includes(r.status_obowiazywania)) e.push(`status_obowiazywania spoza schematu: ${r.status_obowiazywania}`);
  if ("zakres" in w) e.push("pole `zakres` wycofane w 3.94 — OUT_OF_SCOPE w `status`");
  return e;
}
// Filtr (np. gdy SAOS/CBOSA niedostępne): LEX_POMIN="SAOS|CBOSA" pomija przypadki, których opis pasuje.
const POMIN = process.env.LEX_POMIN ? new RegExp(process.env.LEX_POMIN) : null;
// Odwrotnie: LEX_TYLKO="^KIO" uruchamia tylko przypadki, których opis pasuje (np. nowy konektor w CI).
const TYLKO = process.env.LEX_TYLKO ? new RegExp(process.env.LEX_TYLKO) : null;
let pominiete = 0;
for (const [opis, kat, plik, narz, args, warunek] of PRZYPADKI) {
  if ((POMIN && POMIN.test(opis)) || (TYLKO && !TYLKO.test(opis))) { pominiete++; console.log(`⏭️ POMINIĘTE  ${opis}`); continue; }
  let w, ok = false;
  let sch = [];
  try { w = await wywolaj(kat, plik, narz, args); ok = !!warunek(w); sch = schemat(w); ok = ok && sch.length === 0; }
  catch (e) { w = { wyjatek: String(e) }; }
  console.log(`${ok ? "✅ PASS" : "⛔ FAIL"}  ${opis}`);
  if (sch.length) console.log("         SCHEMAT: " + sch.join("; "));
  if (!ok) { bledy++; console.log("         " + JSON.stringify(w).slice(0, 400)); }
}
console.log(`\n${PRZYPADKI.length - pominiete - bledy}/${PRZYPADKI.length - pominiete} przypadków zgodnych co do TREŚCI${pominiete ? ` (pominięte: ${pominiete})` : ""}.`);
process.exit(bledy ? 1 : 0);
