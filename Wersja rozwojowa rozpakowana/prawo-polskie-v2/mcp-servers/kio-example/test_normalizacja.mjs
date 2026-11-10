// Parser wyszukiwarki UZP na fragmentach prawdziwych odpowiedzi (fixtures/uzp.json, 2026-10-02).
import { parsujWyniki, parsujMetryke, zakresDat, normalizujSygnature, dataIso } from "./kio-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const F = JSON.parse(readFileSync(new URL("./fixtures/uzp.json", import.meta.url)));

{ const w = parsujWyniki(F.wyniki);
  assert.deepStrictEqual(w.liczniki, { wszystkie: 8750, KIO: 8654, SO: 96, SA: 0, SN: 0 });
  assert.strictEqual(w.liczba, 8654);
  assert.strictEqual(w.pozycje.length, 2);
  assert.deepStrictEqual(w.pozycje[0], { id: "32291", organ: "Krajowa Izba Odwoławcza", rodzaj: "wyrok",
    sygnatura: "KIO 4983/25", data: "2026-12-07", fragment: "złożenia wyjaśnień rażąco niskiej ceny , formułując je następująco" });
  assert.strictEqual(w.pozycje[1].id, "35091");
  console.log("OK: lista wyników — liczniki wg organu, sygnatura, data ISO, fragment, id"); }

{ const w = parsujWyniki(F.brak);
  assert.strictEqual(w.pozycje.length, 0); assert.strictEqual(w.liczba, 0);
  console.log("OK: brak trafień"); }

{ const m = parsujMetryke(F.szczegoly);
  assert.strictEqual(m.rodzaj, "wyrok"); assert.strictEqual(m.data, "2026-12-07");
  assert.strictEqual(m.przewodniczacy, "Renata Tubisz"); assert.match(m.zamawiajacy, /Baza Lotnictwa/);
  assert.deepStrictEqual(m.sygnatury, ["KIO 4983/25"]); assert.deepStrictEqual(m.rozstrzygniecia, ["KIO 4983/25 / oddala"]);
  assert.deepStrictEqual(m.przepisy_pzp, ["Art. 224 ust. 6", "Art. 224 ust. 5", "Art. 226 ust. 1 pkt 8"]);
  assert.strictEqual(m.tryb, "przetarg nieograniczony");
  console.log("OK: metryka — rozstrzygnięcie, przewodniczący, zamawiający, przepisy Pzp"); }

{ assert.strictEqual(zakresDat("2025-01-01", "2025-12-31"), "01-01-2025 - 31-12-2025");
  assert.strictEqual(zakresDat(undefined, undefined), "");
  assert.strictEqual(normalizujSygnature("kio  827 / 18"), "KIO 827/18");
  assert.strictEqual(dataIso("07-12-2026"), "2026-12-07");
  console.log("OK: daty formularza, normalizacja sygnatury"); }


// AUDYT-2026-10-02 — sprawy łączone, wyrok sądu na skargę, kontrola daty (fragmenty prawdziwych odpowiedzi)
import { rozbijSygnatury, ostrzezenieDaty } from "./kio-mcp-server.js";
{ const w = parsujWyniki(F.wyniki_laczone);
  assert.strictEqual(w.pozycje.length, 1);
  assert.deepStrictEqual(rozbijSygnatury(w.pozycje[0].sygnatura), ["KIO 2304/23", "KIO 2306/23"]);
  assert.deepStrictEqual(rozbijSygnatury("KIO 3335/25 | KIO 3339/25, KIO 3341/25"), ["KIO 3335/25", "KIO 3339/25", "KIO 3341/25"]);
  console.log("OK: sprawa łączona — sygnatury rozdzielone „|” (wcześniej fałszywe OUT_OF_SCOPE dla drugiej)"); }
{ const m = parsujMetryke(F.szczegoly_sad);
  assert.match(m.organ, /Sąd Okręgowy/);
  assert.deepStrictEqual(m.sygnatury, ["I Ca 117/12"]);
  assert.deepStrictEqual(m.sygnatury_kio, ["KIO 44/12"]);
  assert.match(m.sposob_rozstrzygniecia[0], /zmienia/);
  console.log("OK: metryka wyroku sądu — sygnatura sądu, sygnatura KIO, sposób rozstrzygnięcia"); }
{ assert.match(ostrzezenieDaty("2026-12-07", ["KIO 4983/25"], "2026-10-02"), /PÓŹNIEJSZA/);
  assert.match(ostrzezenieDaty("2024-05-01", ["KIO 10/25"], "2026-10-02"), /wcześniejsza niż rok sygnatury/);
  assert.strictEqual(ostrzezenieDaty("2025-12-07", ["KIO 4983/25"], "2026-10-02"), null);
  console.log("OK: kontrola wiarygodności daty ze źródła"); }
console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
