// test_protokol.mjs — protokół MCP WSZYSTKICH serwerów (od 6.202 także sn, sp, tk, etpcz — wcześniej pominięte) (AUDYT-2026-09-27s: zastępuje 10 identycznych
// `*-example/test_protokol_mcp.mjs`, różniących się tylko listą narzędzi). Bez sieci: handshake, lista narzędzi.
// ⛔ 27j: dawna wersja uznawała `status: "ERROR"` za sukces — tu wyłącznie protokół; TREŚĆ sprawdza test_na_zywo.mjs.
// Użycie: node test_protokol.mjs [katalog-serwera …]   (bez argumentów — wszystkie)
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const TU = dirname(fileURLToPath(import.meta.url));
const SERWERY = [
  ["cbosa-example", "cbosa-mcp-server.js", ["cbosa_pobierz", "cbosa_sprawdz_sygnature", "cbosa_szukaj"]],
  ["ceidg-example", "ceidg-mcp-server.js", ["ceidg_szukaj_firmy"]],
  ["eureka-example", "eureka-mcp-server.js", ["eureka_pobierz", "eureka_sprawdz_sygnature", "eureka_szukaj"]],
  ["eurlex-example", "eurlex-mcp-server.js", ["eurlex_lookup", "eurlex_tsue"]],
  ["isap-eli-example", "isap-eli-mcp-server.js", ["isap_lookup", "isap_tekst"]],
  ["kio-example", "kio-mcp-server.js", ["kio_kontrola_sadowa", "kio_pobierz", "kio_sprawdz_sygnature", "kio_szukaj"]],
  ["krs-example", "krs-mcp-server.js", ["krs_lookup", "krs_reprezentacja", "krs_szukaj"]],
  ["nbp-example", "nbp-mcp-server.js", ["nbp_kurs_waluty"]],
  ["saos-example", "saos-mcp-server.js", ["saos_cytator", "saos_search"]],
  ["sn-example", "sn-mcp-server.js", ["sn_captcha_auto", "sn_pobierz", "sn_sesja_status", "sn_sesja_ustaw", "sn_sprawdz_sygnature", "sn_szukaj"]],
  ["sudop-example", "sudop-mcp-server.js", ["sudop_szukaj_pomocy", "sudop_odbierz_wynik"]],
  ["sp-example", "sp-mcp-server.js", ["sp_pobierz", "sp_sprawdz_sygnature", "sp_szukaj"]],
  ["tk-example", "tk-mcp-server.js", ["tk_pobierz", "tk_sprawdz_sygnature"]],
  ["etpcz-example", "etpcz-mcp-server.js", ["etpcz_pobierz", "etpcz_szukaj"]],
  ["uodo-example", "uodo-mcp-server.js", ["uodo_pobierz", "uodo_sprawdz_sygnature", "uodo_szukaj"]],
  ["wl-example", "wl-mcp-server.js", ["wl_sprawdz_nip", "wl_sprawdz_rachunek"]],
];
const wybrane = process.argv.slice(2);
let bledy = 0;
for (const [kat, plik, oczekiwane] of SERWERY) {
  if (wybrane.length && !wybrane.includes(kat)) continue;
  const c = new Client({ name: "test-protokolu", version: "3.0.0" });
  try {
    await c.connect(new StdioClientTransport({ command: process.execPath, args: [join(TU, kat, plik)], cwd: join(TU, kat), stderr: "ignore" }));
    const nazwy = (await c.listTools()).tools.map((t) => t.name).sort();
    const ok = JSON.stringify(nazwy) === JSON.stringify([...oczekiwane].sort());
    if (!ok) bledy++;
    console.log(`${ok ? "✅" : "⛔"} ${kat.padEnd(18)} ${nazwy.join(", ")}${ok ? "" : `  (oczekiwane: ${oczekiwane.join(", ")})`}`);
  } catch (e) { bledy++; console.log(`⛔ ${kat.padEnd(18)} ${String(e?.message ?? e).slice(0, 120)}`); }
  finally { await c.close().catch(() => {}); }
}
console.log(bledy ? `\n⛔ PROTOKÓŁ: ${bledy} serwer(ów) z błędem` : "\nPROTOKÓŁ MCP OK dla wszystkich serwerów (treść: test_na_zywo.mjs)");
process.exit(bledy ? 1 : 0);
