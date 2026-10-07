// Fixture: PRAWDZIWE odpisy aktualne KRS z 2026-09-28 (działy 1, 2, 6 + nagłówek). AUDYT-2026-09-27q.
import { normalizujOdpowiedzKRS, normalizujReprezentacje, maskujPesel, regonPoprawny, nipPoprawny, KRS_WYSZUKIWARKA } from "./krs-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const F = JSON.parse(readFileSync(new URL("./fixtures/krs_odpisy.json", import.meta.url)));

{ const w = normalizujOdpowiedzKRS(F.wosp_0000030897_rejestrS, "0000030897");
  assert.strictEqual(w.status, "FOUND"); assert.match(w.result.tytul_lub_nazwa, /WIELKA ORKIESTRA/);
  assert.match(w.result.rejestr, /^S/); assert.strictEqual(w.result.status_obowiazywania, "obowiazuje");
  console.log("OK: fundacja z rejestru S → FOUND (dotąd NOT_FOUND)"); }

{ const w = normalizujReprezentacje(F.pkp_0000019193, "0000019193"), r = w.result.reprezentacja;
  assert.match(r.sposob_reprezentacji, /WSPÓŁDZIAŁANIE PREZESA/);
  assert.ok(r.sklad.length >= 3 && r.sklad.every((s) => s.funkcja && s.osoba_maska && typeof s.zawieszony === "boolean"));
  assert.ok(r.sklad.some((s) => /PREZES ZARZĄDU/.test(s.funkcja)));
  assert.ok(r.prokurenci.length >= 1 && r.organ_nadzoru[0].nazwa === "RADA NADZORCZA");
  assert.match(w.uwaga, /Stan rejestru na dzień 27\.08\.2026/);
  console.log(`OK: PKP — sposób reprezentacji, ${r.sklad.length} członków zarządu, ${r.prokurenci.length} prokurentów, rada nadzorcza`); }

{ const surowy = JSON.stringify(F.orlen_0000028860.odpis.dane.dzial2.prokurenci);
  assert.match(surowy, /PESEL:\d{11}/, "fixture zawiera niezamaskowany PESEL w wolnym tekście (stan rejestru)");
  const w = normalizujReprezentacje(F.orlen_0000028860, "0000028860");
  assert.doesNotMatch(JSON.stringify(w), /\d{11}/, "żaden 11-cyfrowy PESEL nie może wyjść z konektora");
  console.log("OK: ORLEN — PESEL z wolnego tekstu prokury zamaskowany"); }

{ assert.strictEqual(maskujPesel("X (PESEL:82072702612) Y"), "X (PESEL:8**********) Y");
  assert.strictEqual(normalizujOdpowiedzKRS({ status: 404 }, "0000000001").status, "NOT_FOUND");
  console.log("OK: maskowanie PESEL; brak w P i S → NOT_FOUND"); }
{ const w = normalizujOdpowiedzKRS(F.wosp_0000030897_rejestrS, "0000030897");
  assert.strictEqual(w.result.url_zrodlowy, KRS_WYSZUKIWARKA);
  assert.strictEqual(w.result.url_podgladu, "https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/0000030897?rejestr=S&format=json");
  assert.ok(regonPoprawny("610188201") && regonPoprawny("61018820100000") && !regonPoprawny("610188202"));
  assert.ok(nipPoprawny("7740001454") && !nipPoprawny("7740001455"));
  console.log("OK: wyszukiwarka KRS jako źródło, odpis aktualny (P/S) do podglądu, sumy NIP/REGON"); }
console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");
