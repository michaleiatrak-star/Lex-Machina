import { normalizujOdpowiedzCEIDG } from "./ceidg-mcp-server.js";
import assert from "node:assert";

// FOUND
{
  const wynik = normalizujOdpowiedzCEIDG({ firmy: [{ nip: "1234567890", nazwa: "Jan Kowalski Firma", status: "AKTYWNY", dataRozpoczecia: "2015-03-01" }] });
  assert.strictEqual(wynik.status, "FOUND");
  assert.strictEqual(wynik.result.status_obowiazywania, "obowiazuje");
  console.log("OK: FOUND poprawnie znormalizowany");
}

// NOT_FOUND
{
  const wynik = normalizujOdpowiedzCEIDG(null);
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: NOT_FOUND poprawnie znormalizowany");
}

// status zawieszony (nie AKTYWNY)
{
  const wynik = normalizujOdpowiedzCEIDG({ firmy: [{ nip: "1111111111", nazwa: "Zawieszona Firma", status: "ZAWIESZONY" }] });
  assert.strictEqual(wynik.result.status_obowiazywania, "ZAWIESZONY");
  console.log("OK: status inny niż AKTYWNY przekazany bez modyfikacji (nie 'obowiazuje')");
}

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
