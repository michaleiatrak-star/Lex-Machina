// Testy offline konektora SN (bez sieci): rozpoznanie błędu sesji snproxy, koperta com_ajax, rekordy.
// Pełny przebieg po sieci: ../test_poprawnosci.mjs.
import { bladSn, rekordy, ERR_SESJA_SN, normalizujSygnature } from "./sn-mcp-server.js";
import assert from "node:assert";

// 1. „Brak tokenu” i pokrewne = błąd SESJI → kierowane w ścieżkę weryfikacji (BlokadaSn), nie martwy ERROR.
//    Regresja zgł. 2026-10-07: sygnatura dawała ERROR „sn.pl zgłosił błąd: Brak tokenu” bez fallbacku.
for (const msg of ["Brak tokenu", "Brak tokenu sesji", "Sesja wygasła", "Zaloguj się", "Wymagana weryfikacja (captcha)"]) {
  assert.ok(ERR_SESJA_SN.test(msg), `powinno być błędem sesji: ${msg}`);
}
// Błąd merytoryczny zapytania NIE jest błędem sesji → zostaje zwykłym ERROR.
for (const msg of ["Nieprawidłowy parametr sygnatura", "Błąd bazy danych", "Zbyt długie zapytanie"]) {
  assert.ok(!ERR_SESJA_SN.test(msg), `nie powinno być błędem sesji: ${msg}`);
}
console.log("OK: ERR_SESJA_SN — token/sesja/weryfikacja = sesja; błąd zapytania = zwykły ERROR");

// 2. Koperta com_ajax z błędem (różne głębokości) rozpoznawana przez bladSn; rekord nie jest błędem.
assert.strictEqual(bladSn({ error: "Brak tokenu" }), "Brak tokenu");
assert.strictEqual(bladSn({ data: { error: "Brak tokenu" } }), "Brak tokenu");
assert.strictEqual(bladSn([{ error: "Sesja wygasła" }]), "Sesja wygasła");
assert.strictEqual(bladSn({ data: [{ sygnatura_sprawy: "III CZP 25/11" }] }), null);
console.log("OK: bladSn — koperta błędu na różnych głębokościach; rekord nie jest błędem");

// 3. rekordy z różnych kształtów opakowania com_ajax.
const rec = { sygnatura_sprawy: "III CZP 25/11", data_wydania: "2011-05-10T00:00:00", forma_orzeczenia: "uchwała SN", id: "42" };
assert.deepStrictEqual(rekordy({ data: [rec] }), [rec]);
assert.deepStrictEqual(rekordy({ data: { data: [rec] } }), [rec]);
assert.deepStrictEqual(rekordy(rec), [rec]);
assert.strictEqual(normalizujSygnature("iii  czp  25 / 11").toUpperCase(), "III CZP 25/11");
console.log("OK: rekordy — opakowania com_ajax; normalizacja sygnatury");

console.log("\nWSZYSTKIE TESTY SN (offline) PRZESZŁY");
