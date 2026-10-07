// test_normalizacja.mjs = test równoważności z parserem referencyjnym (ta sama zawartość, nazwa wymagana przez CI i instalator).
// Równoważność portu JS z parserem referencyjnym Python (orzeczenia-sadowe-v2/tools/cbosa_parser.py).
// Wzorzec: fixtures/rownowaznosc.json — wyniki PYTHONA na tym samym HTML (generowane, nie pisane ręcznie).
import { parsujDokument, weryfikujSygnature, zPonowieniem, extractDocIds } from "./cbosa-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const K = JSON.parse(readFileSync(new URL("./fixtures/rownowaznosc.json", import.meta.url)));
let n = 0;
for (const d of K.dokumenty) {
  let js; try { js = parsujDokument(d.html, d.doc_id); } catch { js = { ERR: true }; }
  if (d.oczekiwane.ERR) assert.ok(js.ERR, `${d.nazwa}: Python odrzucił (${d.oczekiwane.ERR}), JS przyjął`);
  else for (const [k, v] of Object.entries(d.oczekiwane)) assert.deepStrictEqual(js[k] ?? null, v, `${d.nazwa}: pole ${k}`);
  n++;
}
for (const s of K.scenariusze) {
  const v = await weryfikujSygnature(s.search, s.oczekiwana, async () => { throw new Error("brak stron"); }, async (id) => s.docs[id]);
  assert.strictEqual(v.status, s.status, `${s.nazwa}: status`);
  assert.deepStrictEqual((v.matches ?? []).map((m) => m.case_number), s.matches, `${s.nazwa}: trafienia`);
  if (s.status !== "OUT_OF_SCOPE") assert.deepStrictEqual(v.rejected ?? [], s.rejected, `${s.nazwa}: odrzucone`);
  n++;
}
// paginacja (kontrakt shared/CBOSA-ADAPTER.md pkt 4–5)
const strona = (total, ids) => `<html><body><div>Znaleziono ${total} orzeczeń</div>${ids.map((i) => `<a href="/doc/${i}">x</a>`).join("")}</body></html>`;
const dok = K.dokumenty[0].html;
const ids = (a, b) => Array.from({ length: b - a }, (_, i) => `A${String(a + i).padStart(9, "0")}`);
{ const v = await weryfikujSygnature(strona(12, ids(0, 10)), "II FSK 100/24", async () => strona(12, ids(10, 12)), async () => dok);
  assert.strictEqual(v.status, "AMBIGUOUS"); assert.strictEqual(v.doc_ids.length, 12); n++; }
{ const v = await weryfikujSygnature(strona(11, ids(0, 10)), "II FSK 100/24", async () => strona(11, ids(0, 10)), async () => dok);
  assert.strictEqual(v.status, "OUT_OF_SCOPE"); assert.match(v.powod, /bez nowych ID/); n++; }
// Nadmiar unikalnych /doc/ ponad licznik (linki powiązane/nawigacja) NIE jest driftem:
// exact-match decyduje. Wcześniej fałszywe OUT_OF_SCOPE dla istniejącego wyroku (zgł. 2026-10-07).
{ const dok2 = dok.replace(/II\s*FSK\s*100\/24/gi, "III FSK 100/24");
  const v = await weryfikujSygnature(strona(1, ids(0, 2)), "II FSK 100/24",
    async () => { throw new Error("brak stron"); },
    async (id) => (id === "A000000000" ? dok : dok2));
  assert.strictEqual(v.status, "FOUND"); assert.strictEqual(v.matches[0].case_number, "II FSK 100/24"); n++; }
// Komórka wartości z zagnieżdżoną tabelą (data | prawomocność) — wcześniej „brak pól Data orzeczenia”.
{ const zagn = dok.replace(/<td class="info-list-value">(\d{4}-\d{2}-\d{2})<\/td>/,
    '<td class="info-list-value"><table class="info-list"><tr><td >$1</td><td class="war_header">orzeczenie prawomocne</td></tr></table></td>');
  assert.notStrictEqual(zagn, dok);
  const d = parsujDokument(zagn, "AAAAAAAAAA");
  assert.match(d.judgment_date, /^\d{4}-\d{2}-\d{2}$/);
  assert.strictEqual(d.finality, "orzeczenie prawomocne");
  assert.ok(d.court); n++; }
// Karta bez pól „Sąd”/„Data orzeczenia” (inny układ) — BEST-EFFORT, nie OUT_OF_SCOPE.
// Wcześniej fałszywe „brak pól Sąd, Data orzeczenia” mimo realnego orzeczenia (zgł. 2026-10-07).
{ const bezMeta = dok
    .replace('<tr><td class="lista-label">Sąd</td><td class="info-list-value">Naczelny Sąd Administracyjny</td></tr>', "")
    .replace('<tr><td class="lista-label">Data orzeczenia</td><td class="info-list-value">2026-01-10</td></tr>', "");
  assert.notStrictEqual(bezMeta, dok);
  const d = parsujDokument(bezMeta, "AAAAAAAAAA");
  assert.strictEqual(d.court, null);
  assert.strictEqual(d.judgment_date, null);
  assert.deepStrictEqual(d.brak_metadanych, ["Sąd", "Data orzeczenia"]);
  assert.match(d.operative_part, /Oddala skargę kasacyjną/);
  const v = await weryfikujSygnature(strona(1, ids(0, 1)), "II FSK 100/24",
    async () => { throw new Error("brak stron"); }, async () => bezMeta);
  assert.strictEqual(v.status, "FOUND"); n++; }
// Brak Sentencji NADAL fail-closed (kotwica poprawności).
{ const bezSent = dok.replace('<div class="lista-label">Sentencja</div>', '<div class="lista-label">Inne</div>');
  assert.throws(() => parsujDokument(bezSent, "AAAAAAAAAA"), /brak Sentencji/); n++; }
// Układy z żywej strony CBOSA zgłoszone w PR #84 (geek111): etykieta w zagnieżdżonej tabeli, sekcja „powiązane”.
{ const dokZagn = `<html><head><TITLE>III OSK 1959/22 - Wyrok NSA z 2023-11-29</TITLE></head><body>` +
    `<table><tr><td class="info-list-label"><table><tr><td class="lista-label">Data orzeczenia</td></tr></table></td>` +
    `<td class="info-list-value"><table><tr><td>2023-11-29</td><td>orzeczenie prawomocne</td></tr></table></td></tr>` +
    `<tr><td class="info-list-label"><table><tr><td class="lista-label">Sąd</td></tr></table></td>` +
    `<td class="info-list-value">Naczelny Sąd Administracyjny</td></tr></table>` +
    `<div class="lista-label">Sentencja</div><span class="info-list-value-uzasadnienie"><p>Oddala skargę kasacyjną.</p></span></body></html>`;
  const d = parsujDokument(dokZagn, "2E1C5318E4");
  assert.strictEqual(d.court, "Naczelny Sąd Administracyjny");
  assert.strictEqual(d.judgment_date, "2023-11-29"); n++;
  const pow = `<html><body><div>Znaleziono 1 orzeczeń</div><a href="/doc/AAAAAAAAAA">x</a>` +
    `<span class="powiazane"><span><a href="/doc/BBBBBBBBBB">y</a></span></span><a href="/doc/CCCCCCCCCC">z</a></body></html>`;
  assert.deepStrictEqual(extractDocIds(pow), ["AAAAAAAAAA", "CCCCCCCCCC"]); n++; }
console.log(`OK: ${n} przypadków zgodnych z parserem referencyjnym (Python) + paginacja`);

{ let n = 0;
  const w = await zPonowieniem(async () => { if (++n < 3) throw new Error("Połączenie zerwane przez serwer (orzeczenia.nsa.gov.pl): UND_ERR_SOCKET"); return "ok"; }, { przerwa: 5, budzet: () => 1e9 });
  assert.deepStrictEqual([w, n], ["ok", 3]);
  n = 0;
  await assert.rejects(zPonowieniem(async () => { n++; throw new Error("CBOSA HTTP 404"); }, { przerwa: 5, budzet: () => 1e9 }));
  assert.strictEqual(n, 1);
  n = 0;
  await assert.rejects(zPonowieniem(async () => { n++; throw new Error("UND_ERR_SOCKET"); }, { przerwa: 5, budzet: () => 100 }));
  assert.strictEqual(n, 1);
  console.log("OK: ponowienie po zerwanym połączeniu (w budżecie), bez ponawiania błędów HTTP"); }
