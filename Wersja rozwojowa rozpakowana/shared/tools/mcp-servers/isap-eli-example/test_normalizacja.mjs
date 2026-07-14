import { normalizujOdpowiedzELI } from "./isap-eli-mcp-server.js";
import assert from "node:assert";

// FOUND
{
  const wynik = normalizujOdpowiedzELI(
    [{ publisher: "DU", year: 2025, pos: 1071, title: "Kodeks cywilny", status: "obowiązujący",
       announcementDate: "2025-06-01", ELI: "https://isap.example/1071" }],
    "kodeks cywilny"
  );
  assert.strictEqual(wynik.status, "FOUND");
  assert.strictEqual(wynik.result.identyfikator, "DU 2025 poz. 1071");
  assert.strictEqual(wynik.result.status_obowiazywania, "obowiazuje");
  console.log("OK: FOUND poprawnie znormalizowany");
}

// NOT_FOUND
{
  const wynik = normalizujOdpowiedzELI([], "ustawa ktora nie istnieje");
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: NOT_FOUND poprawnie znormalizowany");
}

// AMBIGUOUS
{
  const wynik = normalizujOdpowiedzELI(
    [
      { publisher: "DU", year: 2024, pos: 1, title: "A" },
      { publisher: "DU", year: 2024, pos: 2, title: "B" },
    ],
    "wieloznaczne"
  );
  assert.strictEqual(wynik.status, "AMBIGUOUS");
  assert.strictEqual(wynik.kandydaci.length, 2);
  console.log("OK: AMBIGUOUS poprawnie znormalizowany");
}

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
