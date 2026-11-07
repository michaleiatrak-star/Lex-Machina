// ⛔ 2026-09-29 (F-214): fixture `firmy_nip_aktywny.json` ma KSZTAŁT zmierzony na żywym API v3
//    (NIP w `wlasciciel.nip`). Poprzednie przypadki używały zgadniętego kształtu `firmy[].nip`
//    i przechodziły przy `identyfikator: null` w produkcji — test nie sprawdzał identyfikatora.
import { normalizujOdpowiedzCEIDG, nipPoprawny } from "./ceidg-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";

const fx = JSON.parse(readFileSync(new URL("./fixtures/firmy_nip_aktywny.json", import.meta.url), "utf-8"));

{ // FOUND — kształt zmierzony
  const w = normalizujOdpowiedzCEIDG(fx, "1234563218");
  assert.strictEqual(w.status, "FOUND");
  assert.strictEqual(w.result.identyfikator, "1234563218", "NIP musi być czytany z wlasciciel.nip");
  assert.strictEqual(w.result.regon, "000000000");
  assert.strictEqual(w.result.status_obowiazywania, "obowiazuje");
  assert.strictEqual(w.result.data_publikacji_lub_wyroku, "2026-09-21");
  assert.ok(w.result.url_rekordu_api.includes("/firma/"));
  assert.strictEqual(w.uwaga, undefined);
  console.log("OK: FOUND — identyfikator z wlasciciel.nip, REGON, status, data, link");
}
{ // HTTP 204 → pobierz zwraca null → NOT_FOUND z odesłaniem do KRS
  const w = normalizujOdpowiedzCEIDG(null);
  assert.strictEqual(w.status, "NOT_FOUND");
  assert.match(w.uwaga, /KRS/);
  console.log("OK: brak wpisu (HTTP 204) → NOT_FOUND z odesłaniem do KRS");
}
{ // kilka wpisów: wykreślony starszy + aktywny nowszy → result = aktywny
  const stary = { ...fx.firmy[0], status: "WYKRESLONY", dataRozpoczecia: "2010-01-01", id: "x-old" };
  const w = normalizujOdpowiedzCEIDG({ firmy: [stary, fx.firmy[0]] }, "1234563218");
  assert.strictEqual(w.result.status_ceidg, "AKTYWNY");
  assert.strictEqual(w.liczba_wpisow, 2);
  assert.strictEqual(w.wpisy.length, 2);
  assert.match(w.uwaga, /2 wpisy/);
  console.log("OK: wiele wpisów → result = AKTYWNY, pełna lista w `wpisy`");
}
{ // brak aktywnego → najnowszy + ostrzeżenie; status inny niż AKTYWNY bez zamiany na 'obowiazuje'
  const z = { ...fx.firmy[0], status: "ZAWIESZONY" };
  const w = normalizujOdpowiedzCEIDG({ firmy: [z] }, "1234563218");
  assert.strictEqual(w.result.status_obowiazywania, "ZAWIESZONY");
  assert.match(w.uwaga, /Brak wpisu AKTYWNEGO/);
  console.log("OK: ZAWIESZONY przekazany wprost + ostrzeżenie o braku wpisu aktywnego");
}
{ // post-check tożsamości NIP
  const w = normalizujOdpowiedzCEIDG(fx, "5261040828");
  assert.match(w.uwaga, /≠ NIP zapytania/);
  console.log("OK: rozjazd NIP odpowiedź/zapytanie → ostrzeżenie blokujące");
}
{ // suma kontrolna NIP (odsiew przed zapytaniem — zmierzone: API zwraca 400 NIEPOPRAWNY_NUMER_NIP)
  assert.strictEqual(nipPoprawny("1234563218"), true);
  assert.strictEqual(nipPoprawny("5261040828"), true);
  assert.strictEqual(nipPoprawny("6340000543"), false);
  assert.strictEqual(nipPoprawny("12345"), false);
  console.log("OK: suma kontrolna NIP");
}
console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
