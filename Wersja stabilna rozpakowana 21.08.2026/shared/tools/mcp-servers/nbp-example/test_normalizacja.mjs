import { normalizujOdpowiedzNBP } from "./nbp-mcp-server.js";
import assert from "node:assert";

// FOUND
{
  const raw = { table: "A", currency: "dolar amerykański", code: "USD",
                rates: [{ no: "134/A/NBP/2026", effectiveDate: "2026-07-10", mid: 4.0123 }] };
  const wynik = normalizujOdpowiedzNBP(raw, "usd");
  assert.strictEqual(wynik.status, "FOUND");
  assert.strictEqual(wynik.result.kurs_sredni, 4.0123);
  console.log("OK: FOUND poprawnie znormalizowany");
}

// NOT_FOUND (np. weekend, NBP zwraca 404 -> raw = null)
{
  const wynik = normalizujOdpowiedzNBP(null, "eur");
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: brak notowania (weekend) poprawnie potraktowany jako NOT_FOUND, nie ERROR");
}

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
