// Testy offline konektora TK (bez sieci): klasyfikacja niedostępności źródła, kontrola sygnatury,
// parsowanie wyników OTK ZU / dokumentów IPO. Pełny przebieg po sieci: ../test_poprawnosci.mjs.
import { bladTransportu, zawieraSygnature, normalizujSygnature, toSygnaturaTk, postacSygnaturyTk, wynikiOtkzu, dokumentyIpo } from "./tk-mcp-server.js";
import { BudzetWyczerpany } from "../wspolne/budzet.mjs";
import assert from "node:assert";

// 1. Niedostępność transportu → ERROR (nie OUT_OF_SCOPE). Regresja zgł. 2026-10-07:
//    komunikat „Przekroczony budżet czasu wywołania (50000 ms)” nie był rozpoznawany i dawał OUT_OF_SCOPE.
assert.strictEqual(bladTransportu(new BudzetWyczerpany("Przekroczony budżet czasu wywołania (50000 ms) — źródło nie odpowiada; spróbuj ponownie później.")), true);
{ const e = new Error("The operation was aborted due to timeout"); assert.strictEqual(bladTransportu(e), true); }
{ const e = new Error("x"); e.name = "TimeoutError"; assert.strictEqual(bladTransportu(e), true); }
{ const e = new Error("x"); e.name = "AbortError"; assert.strictEqual(bladTransportu(e), true); }
assert.strictEqual(bladTransportu(new Error("IPO HTTP 503")), true);
assert.strictEqual(bladTransportu(new Error("OTK ZU: nie rozpoznano formularza wyszukiwarki (zmiana strony?)")), true);
assert.strictEqual(bladTransportu(new Error("fetch failed")), true);
// „Rzetelny brak” (dotarliśmy, brak orzeczenia) NIE jest błędem transportu → zostaje OUT_OF_SCOPE.
assert.strictEqual(bladTransportu(new Error("karta sprawy IPO nie zawiera pytanej sygnatury")), false);
assert.strictEqual(bladTransportu(new Error("brak trafienia w wyszukiwarce OTK ZU")), false);
console.log("OK: bladTransportu — timeout/budżet/HTTP/zmiana formularza = niedostępność; brak trafienia = rzetelny brak");

// 2. Kontrola sygnatury TK.
assert.strictEqual(normalizujSygnature("P 4 / 23"), "P 4/23");
assert.ok(toSygnaturaTk("P 4/23") && toSygnaturaTk("SK 3/20") && toSygnaturaTk("K 33/07"));
assert.ok(!toSygnaturaTk("II CSK 1/20")); // repertorium spoza TK
assert.ok(postacSygnaturyTk("Xx 1/99"));
assert.ok(zawieraSygnature("… w sprawie o sygn. akt P 4/23 orzeka …", "P 4/23"));
assert.ok(zawieraSygnature("sygn. P 4/2023", "P 4/23")); // rok 4-cyfrowy
assert.ok(!zawieraSygnature("P 40/23", "P 4/23")); // bez fałszywego trafienia na dłuższym numerze
console.log("OK: sygnatura TK — normalizacja, repertorium, dopasowanie roku, brak fałszywego trafienia");

// 3. Parsowanie wyników (fragmenty układu rzeczywistego).
{ const html = '<li>Wyrok — sygn. SK 3/20 <a href="/2020/A/15">pozycja</a></li><li>K 1/00 <a href="/2000/A/1">x</a></li>';
  const l = wynikiOtkzu(html, "SK 3/20", "https://otkzu.trybunal.gov.pl/Wyszukiwanie");
  assert.deepStrictEqual(l, ["https://otkzu.trybunal.gov.pl/2020/A/15"]); }
{ const html = '<a href="#sprawaForm:tabView:dok_7">Wyrok z dnia 1 maja 2020 r.</a>'
    + '<div id="sprawaForm:tabView:dok_7">… sygn. akt SK 3/20 … <a href="/ipo/downloadOrzeczenieDoc?dok=99">doc</a></div></form>';
  const d = dokumentyIpo(html, "https://ipo.trybunal.gov.pl/ipo/view/sprawa.xhtml");
  assert.strictEqual(d.length, 1);
  assert.match(d[0].url, /#dok_7$/);
  assert.match(d[0].url_doc, /downloadOrzeczenieDoc\?dok=99$/); }
console.log("OK: parsowanie OTK ZU (pozycja zbioru) i zakładek dokumentów IPO");

console.log("\nWSZYSTKIE TESTY TK (offline) PRZESZŁY");
