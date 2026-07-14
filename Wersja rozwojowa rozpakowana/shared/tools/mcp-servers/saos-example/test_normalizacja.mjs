import { normalizujOdpowiedzSAOS } from "./saos-mcp-server.js";
import assert from "node:assert";

// FOUND (pojedynczy wynik) - zawsze KANDYDAT, nigdy potwierdzenie ostateczne
{
  const wynik = normalizujOdpowiedzSAOS([
    {
      caseNumber: "II PK 123/22",
      judgmentDate: "2023-03-15",
      division: { court: { name: "Sąd Najwyższy" } },
      textContent: "W ocenie Sądu Najwyższego, zgodnie z art. 45 KP...",
      href: "https://www.saos.org.pl/judgments/123456",
    },
  ]);
  assert.strictEqual(wynik.status, "FOUND");
  assert.strictEqual(wynik.result.identyfikator, "II PK 123/22");
  assert.strictEqual(wynik.result.rola, "KANDYDAT");
  assert.strictEqual(wynik.confidence, "candidate-only");
  console.log("OK: FOUND poprawnie znormalizowany, oznaczony jako KANDYDAT (nie potwierdzenie)");
}

// NOT_FOUND
{
  const wynik = normalizujOdpowiedzSAOS([]);
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: NOT_FOUND poprawnie znormalizowany");
}

// AMBIGUOUS (wiele wynikow)
{
  const wynik = normalizujOdpowiedzSAOS([
    { caseNumber: "I CSK 1/24", judgmentDate: "2024-01-10", division: { court: { name: "SA Warszawa" } } },
    { caseNumber: "I CSK 2/24", judgmentDate: "2024-01-11", division: { court: { name: "SA Kraków" } } },
  ]);
  assert.strictEqual(wynik.status, "AMBIGUOUS");
  assert.strictEqual(wynik.kandydaci.length, 2);
  console.log("OK: AMBIGUOUS poprawnie znormalizowany");
}

// fallback nazwy sadu dla SN (chambers zamiast division.court)
{
  const wynik = normalizujOdpowiedzSAOS([
    { caseNumber: "III UZP 1/25", judgmentDate: "2025-02-01", chambers: [{ name: "Izba Pracy i Ubezpieczeń Społecznych" }] },
  ]);
  assert.strictEqual(wynik.result.sad, "Izba Pracy i Ubezpieczeń Społecznych");
  console.log("OK: fallback chambers (Sąd Najwyższy) poprawnie obsłużony");
}

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
