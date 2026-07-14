import { normalizujOdpowiedzSUDOP } from "./sudop-mcp-server.js";
import assert from "node:assert";

// NOT_FOUND
{
  const wynik = normalizujOdpowiedzSUDOP([]);
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: NOT_FOUND poprawnie znormalizowany");
}

// FOUND (1 przypadek)
{
  const wynik = normalizujOdpowiedzSUDOP([
    { numerSrodkaPomocowego: "SA.12345", nazwaBeneficjenta: "Testowa Sp. z o.o.",
      dzienUdzieleniaPomocy: "2023-05-01", wartoscPomocyBrutto: 50000, formaPomocyOpis: "Dotacja" },
  ]);
  assert.strictEqual(wynik.status, "FOUND");
  assert.strictEqual(wynik.result.wartosc_pomocy, 50000);
  console.log("OK: FOUND (1 przypadek) poprawnie znormalizowany");
}

// AMBIGUOUS (wiele przypadkow pomocy dla tego samego NIP)
{
  const wynik = normalizujOdpowiedzSUDOP([
    { numerSrodkaPomocowego: "SA.1", nazwaBeneficjenta: "A" },
    { numerSrodkaPomocowego: "SA.2", nazwaBeneficjenta: "A" },
  ]);
  assert.strictEqual(wynik.status, "AMBIGUOUS");
  assert.strictEqual(wynik.kandydaci.length, 2);
  console.log("OK: AMBIGUOUS (wiele przypadków pomocy) poprawnie znormalizowany");
}

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
