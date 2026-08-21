import { normalizujOdpowiedzKRS } from "./krs-mcp-server.js";
import assert from "node:assert";

// FOUND - podmiot aktywny
{
  const raw = {
    odpis: {
      naglowekA: { stanZDnia: "2026-07-13" },
      dane: {
        dzial1: { danePodmiotu: { nazwa: "Testowa Spółka z o.o.", formaPrawna: "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ" } },
        dzial6: { wykreslenie: { czyWykreslono: false } },
      },
    },
  };
  const wynik = normalizujOdpowiedzKRS(raw, "0000123456");
  assert.strictEqual(wynik.status, "FOUND");
  assert.strictEqual(wynik.result.tytul_lub_nazwa, "Testowa Spółka z o.o.");
  assert.strictEqual(wynik.result.status_obowiazywania, "obowiazuje");
  console.log("OK: FOUND (podmiot aktywny) poprawnie znormalizowany");
}

// FOUND - podmiot wykreslony
{
  const raw = {
    odpis: {
      naglowekA: { stanZDnia: "2026-01-01" },
      dane: {
        dzial1: { danePodmiotu: { nazwa: "Zlikwidowana Sp. z o.o." } },
        dzial6: { wykreslenie: { czyWykreslono: true } },
      },
    },
  };
  const wynik = normalizujOdpowiedzKRS(raw, "0000999999");
  assert.strictEqual(wynik.result.status_obowiazywania, "wykreslony");
  console.log("OK: podmiot wykreślony poprawnie oznaczony (nie 'obowiazuje')");
}

// NOT_FOUND - 404
{
  const wynik = normalizujOdpowiedzKRS({ status: 404 }, "0000000000");
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: NOT_FOUND (404) poprawnie znormalizowany");
}

// NOT_FOUND - brak danych podmiotu w odpowiedzi
{
  const wynik = normalizujOdpowiedzKRS({ odpis: { dane: {} } }, "0000000001");
  assert.strictEqual(wynik.status, "NOT_FOUND");
  console.log("OK: brak nazwy podmiotu poprawnie potraktowany jako NOT_FOUND");
}

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
