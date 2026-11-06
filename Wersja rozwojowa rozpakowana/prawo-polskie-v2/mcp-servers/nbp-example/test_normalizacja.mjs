// ⛔ 2026-09-27j: poprzedni test utrwalał błąd — „weekend → NOT_FOUND” był asercją POZYTYWNĄ.
// Fixture: prawdziwa odpowiedź zakresowa NBP 2026-09-12..2026-09-26 (fixtures/).
import { normalizujOdpowiedzNBP } from "./nbp-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const raw = JSON.parse(readFileSync(new URL("./fixtures/nbp_eur_zakres.json", import.meta.url)));

{ const w = normalizujOdpowiedzNBP(raw, "eur", "2026-09-26"); // sobota
  assert.strictEqual(w.status, "FOUND");
  assert.strictEqual(w.result.data_tabeli, "2026-09-25");
  assert.strictEqual(w.result.przesuniecie_dni, 1);
  assert.match(w.uwaga, /nie opublikował tabeli A z dnia 2026-09-26/);
  console.log("OK: sobota → tabela z piątku, przesunięcie jawne"); }

{ const w = normalizujOdpowiedzNBP(raw, "eur", "2026-09-25"); // dzień roboczy
  assert.strictEqual(w.result.przesuniecie_dni, 0);
  assert.strictEqual(w.uwaga, undefined);
  console.log("OK: dzień roboczy → tabela z tego dnia, bez ostrzeżenia"); }

{ const w = normalizujOdpowiedzNBP(raw, "eur", "2026-09-20"); // niedziela w środku okna
  assert.strictEqual(w.result.data_tabeli, "2026-09-18");
  assert.strictEqual(w.result.przesuniecie_dni, 2);
  console.log("OK: niedziela → piątek, nie późniejsza tabela z okna"); }

{ const w = normalizujOdpowiedzNBP(null, "eur", "2026-09-26");
  assert.strictEqual(w.status, "NOT_FOUND");
  console.log("OK: brak tabel w całym oknie → NOT_FOUND"); }

{ const rawC = { table: "C", code: "EUR", rates: [
    { no: "186/C/NBP/2026", effectiveDate: "2026-09-25", bid: 4.21, ask: 4.29 }] };
  const w = normalizujOdpowiedzNBP(raw, "eur", "2026-09-25", rawC);
  assert.strictEqual(w.result.kurs_kupna, 4.21);
  assert.strictEqual(w.result.kurs_sprzedazy, 4.29);
  assert.strictEqual(w.result.tabela_c, "186/C/NBP/2026");
  assert.match(w.result.url_podgladu, /^https:\/\/api\.nbp\.pl\/api\/exchangerates\/rates\/a\/eur\/2026-09-25\/\?format=json$/);
  console.log("OK: tabela C → kurs kupna i sprzedaży obok średniego"); }

{ const w = normalizujOdpowiedzNBP(raw, "eur", "2026-09-25", null);
  assert.strictEqual(w.result.kurs_kupna, undefined);
  assert.match(w.uwaga, /nie publikuje kursów kupna i sprzedaży EUR/);
  console.log("OK: waluta spoza tabeli C → jawna uwaga, kurs średni zostaje"); }

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
