// Fixture'y: PRAWDZIWE odpowiedzi wl-api.mf.gov.pl z 2026-09-28 (fixtures/wl.json). AUDYT-2026-09-27s.
import { normalizujPodmiot, normalizujRachunek, nipPoprawny, nrbPoprawny } from "./wl-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const F = JSON.parse(readFileSync(new URL("./fixtures/wl.json", import.meta.url)));
{ const w = normalizujPodmiot(F.szukaj_gus, "5261040828", "2026-09-28");
  assert.strictEqual(w.status, "FOUND"); assert.strictEqual(w.result.status_vat, "Czynny"); assert.strictEqual(w.result.status_obowiazywania, "obowiazuje");
  assert.ok(w.result.ma_rachunki_wirtualne); assert.match(w.uwaga, /wl_sprawdz_rachunek/); assert.ok(w.dowod_sprawdzenia.requestId);
  console.log("OK: GUS — Czynny, rachunki wirtualne → ostrzeżenie, requestId"); }
{ const w = normalizujPodmiot(F.szukaj_brak, "1234567890", "2026-09-28");
  assert.strictEqual(w.status, "NOT_FOUND"); assert.ok(w.dowod_sprawdzenia.requestId, "requestId także przy wyniku negatywnym");
  console.log("OK: NIP spoza wykazu (HTTP 200, subject null) → NOT_FOUND z requestId"); }
{ const w = normalizujPodmiot(F.szukaj_orange, "5260250995", "2026-09-28");
  assert.strictEqual(w.result.rachunki.length, 20); assert.match(w.uwaga, /Pokazano 20 z 30/);
  console.log("OK: wiele rachunków — przycięte do 20 z informacją"); }
{ assert.strictEqual(normalizujRachunek(F.check_tak, "5261040828", "x".repeat(26), "2026-09-28").status, "FOUND");
  const n = normalizujRachunek(F.check_nie, "5261040828", "41101000000000000012345678", "2026-09-28");
  assert.strictEqual(n.status, "NOT_FOUND"); assert.strictEqual(n.result.rachunek_na_liscie, false); assert.ok(n.dowod_sprawdzenia.requestId);
  assert.strictEqual(normalizujRachunek(F.check_zly, "5261040828", "1".repeat(26), "2026-09-28").status, "ERROR");
  console.log("OK: rachunek TAK → FOUND; NIE → NOT_FOUND z requestId; błąd API → ERROR"); }
{ assert.ok(nipPoprawny("5261040828") && nipPoprawny("526-104-08-28")); assert.ok(!nipPoprawny("5261040829"));
  assert.ok(nrbPoprawny("41101000000000000012345678") && nrbPoprawny("PL41 1010 0000 0000 0000 1234 5678")); assert.ok(!nrbPoprawny("1".repeat(26)));
  console.log("OK: walidacja lokalna NIP (mod 11) i NRB (mod 97) zgodna z werdyktami API"); }
console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
