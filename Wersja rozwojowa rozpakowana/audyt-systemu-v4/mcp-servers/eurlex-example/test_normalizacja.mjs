// ⛔ 2026-09-27j: fixture'y to PRAWDZIWE odpowiedzi Cellar SPARQL z 2026-09-27 (fixtures/).
import { normalizujOdpowiedzEURLEX, budujZapytanieSparql } from "./eurlex-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const fx = (c) => JSON.parse(readFileSync(new URL(`./fixtures/cellar_${c}.json`, import.meta.url)));

{ const w = normalizujOdpowiedzEURLEX(fx("32016R0679"), "32016R0679");
  assert.strictEqual(w.status, "FOUND");
  assert.strictEqual(w.result.status_obowiazywania, "obowiazuje");
  assert.match(w.result.tytul_lub_nazwa, /^Rozporządzenie Parlamentu Europejskiego i Rady \(UE\) 2016\/679/);
  assert.strictEqual(w.result.koniec_obowiazywania, null);
  console.log("OK: RODO — obowiązuje, tytuł po polsku"); }

{ const w = normalizujOdpowiedzEURLEX(fx("31995L0046"), "31995L0046");
  assert.strictEqual(w.result.status_obowiazywania, "uchylony");
  assert.strictEqual(w.result.koniec_obowiazywania, "2018-05-24");
  assert.match(w.uwaga, /Nie powołuj jako prawa obowiązującego/);
  console.log("OK: dyrektywa 95/46 — uchylona, data końca, ostrzeżenie"); }

{ const w = normalizujOdpowiedzEURLEX(fx("39999R9999"), "39999R9999");
  assert.strictEqual(w.status, "NOT_FOUND");
  console.log("OK: fikcyjny CELEX → NOT_FOUND"); }

{ // Regresja (zgł. 2026-10-07): jeden CELEX wyroku TSUE zwraca z Cellar dwa ?work — jeden
  // z tytułem PL, drugi bez. CELEX jest jednoznaczny → FOUND z wersji tytułowanej, nie AMBIGUOUS.
  const dwaWorki = [
    { work: { value: "http://publications.europa.eu/resource/cellar/4a1837dd" },
      title: { value: "Wyrok Trybunału (druga izba) z dnia 3 września 2026 r.#BdM Banca SpA przeciwko Komisji Europejskiej.#Sprawa C-145/24 P." },
      inforce: { value: "true" } },
    { work: { value: "http://publications.europa.eu/resource/cellar/507eb501" } }
  ];
  const w = normalizujOdpowiedzEURLEX(dwaWorki, "62024CJ0145");
  assert.strictEqual(w.status, "FOUND");
  assert.match(w.result.tytul_lub_nazwa, /BdM Banca/);
  assert.match(w.uwaga, /pominięto/);
  const amb = normalizujOdpowiedzEURLEX([
    { work: { value: "x" }, title: { value: "Akt A" } },
    { work: { value: "y" }, title: { value: "Akt B" } }
  ], "62024CJ0145");
  assert.strictEqual(amb.status, "AMBIGUOUS");
  assert.strictEqual(amb.kandydaci.length, 2);
  console.log("OK: CELEX z duplikatem bez tytułu → FOUND; dwa tytułowane → AMBIGUOUS"); }

{ assert.match(budujZapytanieSparql("32016R0679"), /"32016R0679"\^\^xsd:string/);
  assert.throws(() => budujZapytanieSparql('3" } ; DROP'), /Niepoprawny numer CELEX/);
  console.log("OK: literał typowany; wstrzyknięcie odrzucone"); }

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");

// ── eurlex_tsue: PRAWDZIWE odpowiedzi Cellar SPARQL (2026-09-28) ─────────────────────────────────
import { normalizujTsue, sygnaturaNaCelex, celexNaSygnature, zapytanieTsue } from "./eurlex-mcp-server.js";
{ const T = JSON.parse(readFileSync(new URL("./fixtures/cellar_tsue.json", import.meta.url)));
  assert.deepStrictEqual(sygnaturaNaCelex("C-131/12").slice(0, 3), ["62012CJ0131", "62012CO0131", "62012CC0131"]);
  assert.deepStrictEqual(sygnaturaNaCelex("T-604/18"), ["62018TJ0604", "62018TO0604"]);
  assert.strictEqual(sygnaturaNaCelex("131/85")[0], "61985CJ0131");
  assert.strictEqual(celexNaSygnature("62012CJ0131"), "C-131/12");
  const w = normalizujTsue(T["C-131/12"], { tryb: "id" });
  assert.strictEqual(w.status, "FOUND"); assert.strictEqual(w.result.identyfikator, "C-131/12");
  assert.strictEqual(w.result.rodzaj, "wyrok"); assert.strictEqual(w.result.ecli, "ECLI:EU:C:2014:317");
  assert.match(w.result.strony, /^Google Spain/); assert.ok(w.powiazane.some((x) => x.rodzaj === "opinia rzecznika generalnego"));
  const d = normalizujTsue(T["C-260/18"], { tryb: "id" });
  assert.match(d.result.strony, /Dziubak/); assert.strictEqual(d.result.data_publikacji_lub_wyroku, "2019-10-03");
  assert.strictEqual(normalizujTsue(T["C-9999/12"], { tryb: "id" }).status, "NOT_FOUND");
  const f = normalizujTsue(T["fraza_93/13_2026"], { tryb: "fraza" });
  assert.ok(f.kandydaci.every((k) => k.rola === "KANDYDAT" && k.identyfikator.startsWith("C-")));
  assert.strictEqual(new Set(f.kandydaci.map((k) => k.celex)).size, f.kandydaci.length, "bez duplikatów");
  assert.match(zapytanieTsue({ ecli: "ECLI:EU:C:2014:317" }), /"ECLI:EU:C:2014:317"\^\^xsd:string/, "ECLI typowany");
  assert.throws(() => zapytanieTsue({ ecli: 'x" } DROP' }), /Niepoprawny ECLI/);
  console.log("OK: TSUE — sygnatura↔CELEX, wyrok + opinia RG, sprawa polska, NOT_FOUND, fraza bez duplikatów, ECLI typowany");
  console.log("\nWSZYSTKIE TESTY eurlex_tsue PRZESZŁY"); }
