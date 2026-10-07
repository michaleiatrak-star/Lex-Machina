#!/usr/bin/env node
/**
 * nbp-mcp-server.js — serwer MCP dla NBP Web API (kursy walut/złota),
 * potwierdzonego jako publiczne, w pełni udokumentowane API bez autoryzacji
 * (sesja 2026-07-13j). Od 1.08.2025 wyłącznie HTTPS.
 *
 * Przydatność prawna: przeliczanie kwot w walutach obcych na PLN wg kursu
 * z konkretnego dnia — częste w sprawach cywilnych/gospodarczych (odsetki,
 * odszkodowania, rozliczenia międzynarodowe).
 *
 * ⚠️ STATUS UCZCIWY: protokół MCP zweryfikowany realnym klientem. Kształt
 * odpowiedzi API oparty na oficjalnej, publicznej dokumentacji (api.nbp.pl/en.html)
 * — NIE potwierdzone żywym wywołaniem z tego środowiska.
 *
 * Narzędzie: `nbp_kurs_waluty`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sygnal, owinSerwer, budzetWyczerpany } from "../wspolne/budzet.mjs";

// ⛔ POPRAWKA 2026-09-27h: NBP nie publikuje tabel w dni wolne — zmierzone 14 i 15.03.2026
//    (sobota, niedziela) → HTTP 404 "Brak danych". Przy kursie "z dnia" trzeba cofnąć się do
//    ostatniej tabeli i POWIEDZIEĆ o tym. (27h odsyłało tu do „pluginu mcp-nbp”, którego nie ma w repo — naprawa: 27j, niżej.)
const NBP_BASE_URL = "https://api.nbp.pl/api/exchangerates/rates";

const server = owinSerwer(globalThis.__LEX_MCP_WSPOLNY ?? new McpServer({ name: "nbp-connector", version: "1.1.0" }));

// ⛔ POPRAWKA 2026-09-27j (AUDYT-2026-09-27j): opis z 27h odsyłał do „pluginu mcp-nbp”,
//    którego NIE MA w repozytorium marketplace — shared zawierał wersję z błędem.
//    Zmierzone 2026-09-27 (niedziela): /today → 404, /2026-09-26 (sobota) → 404,
//    zakres /2026-09-16/2026-09-26 → 200 z tabelami do 25.09. Wcześniej konektor zwracał
//    NOT_FOUND przy KAŻDYM wywołaniu w dzień wolny, także bez podanej daty.
//    Teraz: zapytanie zakresem [data−14 dni, data] i ostatnia tabela ≤ data, z jawną
//    informacją o przesunięciu. Konektor NIE rozstrzyga, która tabela jest właściwa
//    dla danej podstawy prawnej — to należy do analizy przepisu (ELI).

const OKNO_DNI = 14;

function dzisWarszawa() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date());
}
function minusDni(iso, n) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}
function roznicaDni(a, b) {
  return Math.round((new Date(a + "T12:00:00Z") - new Date(b + "T12:00:00Z")) / 86400000);
}

/**
 * Normalizuje odpowiedź zakresową NBP ({"rates":[...]}) do schematu
 * shared/SCHEMAT-ODPOWIEDZI-MCP.md. Wybiera ostatnią tabelę z effectiveDate ≤ dataZadana.
 */
// Strona tabel NBP dla człowieka („Otwórz w źródle”); dane do podglądu z API (url_podgladu).
export const NBP_STRONA_TABEL = "https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/";

/**
 * Tabela C (kursy kupna i sprzedaży) dla tej samej daty: ostatnia tabela ≤ dataZadana.
 * rawC === null → NBP nie publikuje tej waluty w tabeli C (albo brak tabeli w oknie).
 */
function kursyKupnaSprzedazy(rawC, dataZadana) {
  const stawki = (rawC?.rates ?? []).filter((r) => !dataZadana || r.effectiveDate <= dataZadana);
  return stawki[stawki.length - 1] ?? null;
}

export function normalizujOdpowiedzNBP(raw, kodWaluty, dataZadana, rawC = undefined) {
  const kod = kodWaluty.toUpperCase();
  const stawki = (raw?.rates ?? []).filter((r) => !dataZadana || r.effectiveDate <= dataZadana);
  const stawka = stawki[stawki.length - 1];
  if (!stawka) {
    return {
      status: "NOT_FOUND", query_type: "kurs_waluty", source: "nbp",
      uwaga: `Brak tabeli A dla ${kod} w oknie ${OKNO_DNI} dni przed ${dataZadana}.`,
    };
  }
  const wynik = {
    status: "FOUND",
    query_type: "kurs_waluty",
    source: "nbp",
    result: {
      identyfikator: `${kod} tabela ${stawka.no}`,
      tytul_lub_nazwa: `Kurs ${kod}/PLN (NBP)`,
      status_obowiazywania: "obowiazuje",
      data_publikacji_lub_wyroku: stawka.effectiveDate,
      url_zrodlowy: NBP_STRONA_TABEL,
      url_podgladu: `https://api.nbp.pl/api/exchangerates/rates/a/${kod.toLowerCase()}/${stawka.effectiveDate}/?format=json`,
      kurs_sredni: stawka.mid,
      data_zadana: dataZadana ?? stawka.effectiveDate,
      data_tabeli: stawka.effectiveDate,
      przesuniecie_dni: dataZadana ? roznicaDni(dataZadana, stawka.effectiveDate) : 0,
    },
    retrieved_at: new Date().toISOString(),
    confidence: "deterministic",
  };
  const uwagi = [];
  const c = rawC === undefined ? undefined : kursyKupnaSprzedazy(rawC, dataZadana);
  if (c) {
    Object.assign(wynik.result, {
      kurs_kupna: c.bid,
      kurs_sprzedazy: c.ask,
      tabela_c: c.no,
      data_tabeli_c: c.effectiveDate,
    });
    if (c.effectiveDate !== stawka.effectiveDate) {
      uwagi.push(`Kursy kupna i sprzedaży z tabeli C ${c.no} z ${c.effectiveDate} (inna data niż tabela A).`);
    }
  } else if (rawC === null) {
    uwagi.push(`NBP nie publikuje kursów kupna i sprzedaży ${kod} (tabela C obejmuje tylko wybrane waluty); podano kurs średni z tabeli A.`);
  } else if (rawC && typeof rawC === "object" && rawC.blad) {
    uwagi.push(`Kursy kupna i sprzedaży (tabela C) niedostępne: ${rawC.blad}.`);
  }
  if (wynik.result.przesuniecie_dni > 0) {
    uwagi.unshift(
      `⚠️ NBP nie opublikował tabeli A z dnia ${dataZadana} (dzień wolny lub przed publikacją). ` +
      `Zwrócono OSTATNIĄ tabelę przed tą datą: ${stawka.no} z ${stawka.effectiveDate} ` +
      `(o ${wynik.result.przesuniecie_dni} dni wcześniej). Czy to właściwa tabela dla podstawy ` +
      `prawnej przeliczenia — ustal z brzmienia przepisu (ELI), konektor tego nie rozstrzyga.`);
  }
  if (uwagi.length) wynik.uwaga = uwagi.join(" ");
  return wynik;
}

async function pobierzZNbp(kodWaluty, dataZadana, tabela = "a") {
  const od = minusDni(dataZadana, OKNO_DNI);
  const url = `${NBP_BASE_URL}/${tabela}/${kodWaluty.toLowerCase()}/${od}/${dataZadana}/?format=json`;
  const resp = await fetch(url, { signal: sygnal(15000) });
  if (resp.status === 404) return null; // brak jakiejkolwiek tabeli w oknie
  if (!resp.ok) throw new Error(`NBP API zwróciło HTTP ${resp.status}`);
  return await resp.json();
}

server.registerTool(
  "nbp_kurs_waluty",
  {
    title: "Kurs waluty NBP: średni (tabela A), kupna i sprzedaży (tabela C)",
    description:
      "Średni kurs waluty obcej z tabeli A NBP dla wskazanego dnia (domyślnie dziś, czas " +
      "warszawski) oraz, gdy NBP je publikuje, kurs kupna i sprzedaży z tabeli C (kurs_kupna, " +
      "kurs_sprzedazy, tabela_c). W dni bez publikacji zwraca ostatnią tabelę przed datą i JAWNIE " +
      "podaje przesunięcie (pola data_zadana, data_tabeli, przesuniecie_dni, uwaga).",
    inputSchema: {
      kodWaluty: z.string().regex(/^[A-Za-z]{3}$/).describe("Kod ISO 4217, np. USD, EUR, GBP"),
      data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
        .describe("Data YYYY-MM-DD (opcjonalnie, domyślnie dziś)"),
    },
  },
  async ({ kodWaluty, data }) => {
    let wynik;
    const dzis = dzisWarszawa();
    const dataZadana = data ?? dzis;
    if (dataZadana > dzis) {
      wynik = { status: "ERROR", query_type: "kurs_waluty", source: "nbp",
        detail: `Data ${dataZadana} jest z przyszłości — NBP nie publikuje kursów z wyprzedzeniem.`,
        retrieved_at: new Date().toISOString() };
    } else {
      try {
        const [raw, rawC] = await Promise.all([
          pobierzZNbp(kodWaluty, dataZadana),
          // Tabela C jest uzupełnieniem: jej błąd nie przekreśla kursu średniego.
          pobierzZNbp(kodWaluty, dataZadana, "c").catch((e) => ({ blad: String(e?.message ?? e) })),
        ]);
        wynik = normalizujOdpowiedzNBP(raw, kodWaluty, dataZadana, rawC);
      } catch (err) {
        wynik = { status: "ERROR", query_type: "kurs_waluty", source: "nbp",
          detail: String(err?.message ?? err), retrieved_at: new Date().toISOString() };
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
  console.error("nbp-mcp-server: nasłuchuję na stdio (MCP)");
}
