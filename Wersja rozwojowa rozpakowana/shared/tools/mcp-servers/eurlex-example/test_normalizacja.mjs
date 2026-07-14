import { normalizujOdpowiedzEURLEX } from "./eurlex-mcp-server.js";
import assert from "node:assert";

// FOUND
{
  const bindings = [{ title: { value: "Rozporządzenie RODO" }, date: { value: "2016-04-27" } }];
  const wynik = normalizujOdpowiedzEURLEX(bindings, "32016R0679");
  assert.strictEqual(wynik.status, "FOUND");
  assert.strictEqual(wynik.result.identyfikator, "CELEX:32016R0679");
  console.log("OK: FOUND poprawnie znormalizowany");
}

// NOT_FOUND
{
  const wynik = normalizujOdpowiedzEURLEX([], "00000000");
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: NOT_FOUND poprawnie znormalizowany");
}

// AMBIGUOUS
{
  const bindings = [{ title: { value: "A" } }, { title: { value: "B" } }];
  const wynik = normalizujOdpowiedzEURLEX(bindings, "XXXXX");
  assert.strictEqual(wynik.status, "AMBIGUOUS");
  console.log("OK: AMBIGUOUS poprawnie znormalizowany");
}

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
