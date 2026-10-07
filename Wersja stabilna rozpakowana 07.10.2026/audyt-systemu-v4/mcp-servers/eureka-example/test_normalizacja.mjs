// Fixture'y: PRAWDZIWE odpowiedzi EUREKA z 2026-09-27 (fixtures/). Treść dokumentów ucięta do 6000 zn.
import { normalizujSygnature, normalizujWyszukiwanie, normalizujDokument, mapujStatus } from "./eureka-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const fx = (n) => JSON.parse(readFileSync(new URL(`./fixtures/${n}.json`, import.meta.url)));
const SYG = "0112-KDIL1-1.4012.678.2026.1.WK";

{ const w = normalizujSygnature(fx("syg_pelna"), SYG);
  assert.strictEqual(w.status, "FOUND"); assert.strictEqual(w.result.identyfikator, SYG);
  assert.strictEqual(w.result.status_obowiazywania, "obowiazuje");
  console.log("OK: pełna sygnatura → FOUND, aktualna"); }

{ const ucieta = "0112-KDIL1-1.4012.678.2026";
  const w = normalizujSygnature(fx("syg_prefiks"), ucieta);
  assert.strictEqual(w.status, "NOT_FOUND", "prefiks NIE może potwierdzić sygnatury");
  assert.deepStrictEqual(w.odrzucone_post_checkiem, [SYG]);
  console.log("OK: ucięta sygnatura → NOT_FOUND mimo trafienia prefiksowego (post-check)"); }

{ const w = normalizujSygnature(fx("syg_fikcyjna"), "0112-KDIL1-1.4012.999.2026.1.XX");
  assert.strictEqual(w.status, "NOT_FOUND"); assert.match(w.uwaga, /nie jest dowodem/);
  console.log("OK: fikcyjna sygnatura → NOT_FOUND z zastrzeżeniem"); }

{ const w = normalizujSygnature(fx("status_29"), "0112-kdil3.4012.100.2021.4.mbn");
  assert.strictEqual(w.status, "FOUND");
  assert.strictEqual(w.result.status_obowiazywania, "uchylony");
  assert.match(w.uwaga, /NIE jest aktualna/);
  console.log("OK: interpretacja zmieniona → FOUND + ⛔ (wielkość liter bez znaczenia)"); }

{ const w = normalizujDokument(fx("dok_709097"));
  assert.strictEqual(w.result.identyfikator, SYG);
  assert.strictEqual(w.result.data_publikacji_lub_wyroku, "2026-09-11");
  assert.ok(w.result.tresc.length > 500 && !/<p|style=/.test(w.result.tresc), "treść jako tekst, bez HTML");
  console.log("OK: dokument — metadane z dokument.fields, treść bez HTML"); }

{ const w = normalizujDokument(fx("dok_445895"));
  assert.strictEqual(w.result.status_obowiazywania, "uchylony"); assert.match(w.uwaga, /NIE jest aktualna/);
  const p = normalizujDokument(fx("dok_709097"), 0, 1000);
  assert.strictEqual(p.result.tresc_kompletna, false); assert.match(p.uwaga, /offset=1000/);
  console.log("OK: dokument nieaktualny ostrzega; porcjowanie treści jawne"); }

{ assert.strictEqual(mapujStatus(["Aktualna"]).status_obowiazywania, "obowiazuje");
  assert.strictEqual(mapujStatus("33").status_obowiazywania, "uchylony");
  assert.strictEqual(mapujStatus("28").status_obowiazywania, "nieznany");
  assert.strictEqual(normalizujWyszukiwanie({ results: [] }).status, "NOT_FOUND");
  console.log("OK: mapowanie statusów (etykiety i kody), pusty wynik"); }

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
