// Fixture'y: PRAWDZIWE dane loaderów portalu orzeczenia.uodo.gov.pl (turbo-stream, zdekodowane), 2026-09-28. AUDYT-2026-09-27r.
import { normalizujSygnature, normalizujWyszukiwanie, normalizujDokument, prawomocnosc, dekodujTurbo, pozycja } from "./uodo-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const F = JSON.parse(readFileSync(new URL("./fixtures/uodo.json", import.meta.url)));

{ const w = normalizujSygnature(F.rn_dokladna, "DKN.5112.1.2023", { status: F.dok_nonfinal.status, dates: F.dok_nonfinal.dates });
  assert.strictEqual(w.status, "FOUND"); assert.strictEqual(w.result.prawomocnosc, "nieprawomocna");
  assert.strictEqual(w.result.status_obowiazywania, "nieznany"); assert.match(w.uwaga, /NIEPRAWOMOCNA/);
  console.log("OK: sygnatura dokładna → FOUND, nieprawomocna + ostrzeżenie"); }

{ const w = normalizujSygnature(F.rn_prefiks, "DKN.5112.1");
  assert.strictEqual(w.status, "NOT_FOUND", "prefiks NIE potwierdza sygnatury"); assert.ok(w.odrzucone_post_checkiem.length >= 2);
  assert.strictEqual(normalizujSygnature(F.rn_fikcyjna, "DKN.5112.99.2023").status, "NOT_FOUND");
  console.log(`OK: prefiks DKN.5112.1 → NOT_FOUND (odrzucone ${F.rn_prefiks.items.length}); fikcyjna → NOT_FOUND`); }

{ const r = F.szukaj_final.items.find((i) => i.refname === "DKN.5112.33.2022") ?? F.szukaj_final.items[0];
  assert.strictEqual(r.dates.find((d) => d.use === "announcement").status, "nonfinal", "fixture: status przy ogłoszeniu historyczny");
  assert.strictEqual(prawomocnosc(r), "final", "prawomocność z OSTATNIEGO zdarzenia, nie z daty ogłoszenia");
  assert.strictEqual(pozycja(r).prawomocnosc, "prawomocna"); assert.ok(pozycja(r).data_uprawomocnienia);
  const w = normalizujWyszukiwanie(F.szukaj_final);
  assert.ok(w.kandydaci.every((k) => k.prawomocnosc === "prawomocna"), "filtr s=final → wszystkie prawomocne po poprawnym odczycie");
  console.log("OK: wyszukiwanie „prawomocne” — każda pozycja prawomocna (odczyt z daty ogłoszenia dałby „nieprawomocna”)"); }

{ const f = normalizujDokument(F.dok_final), n = normalizujDokument(F.dok_nonfinal);
  assert.strictEqual(f.result.prawomocnosc, "prawomocna"); assert.strictEqual(f.result.status_obowiazywania, "obowiazuje");
  assert.ok(f.result.tresc.length > 500 && !/<dl|<h1/.test(f.result.tresc), "treść bez HTML");
  assert.strictEqual(n.result.prawomocnosc, "nieprawomocna"); assert.match(n.uwaga, /NIEPRAWOMOCNA/);
  console.log("OK: dokument — prawomocność z metryki, treść bez HTML"); }

{ const t = dekodujTurbo([{ _1: 2, _3: -5 }, "a", [4, 5], "b", 7, "x"]);
  assert.deepStrictEqual(t, { a: [7, "x"], b: null });
  console.log("OK: dekoder turbo-stream (obiekty, tablice, null)"); }
console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
