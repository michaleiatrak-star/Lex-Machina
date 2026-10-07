// ⛔ 2026-09-27j: poprzednie fixture'y były WYMYŚLONE i miały ten sam błędny kształt co kod
// (caseNumber na poziomie trafienia) — test potwierdzał błąd zamiast go łapać.
// Obecne fixture'y to wycinki PRAWDZIWYCH odpowiedzi SAOS z 2026-09-27 (fixtures/).
import { normalizujOdpowiedzSAOS } from "./saos-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const fx = (n) => JSON.parse(readFileSync(new URL(`./fixtures/saos_${n}.json`, import.meta.url)));

{ const w = normalizujOdpowiedzSAOS(fx("SUPREME"), { sygnatura: "II PK 291/09" });
  assert.strictEqual(w.status, "FOUND");
  assert.strictEqual(w.result.identyfikator, "II PK 291/09");
  assert.match(w.result.sad, /^Sąd Najwyższy — Izba/);
  assert.strictEqual(w.result.rola, "KANDYDAT");
  assert.strictEqual(w.confidence, "candidate-only");
  console.log("OK: SN — sygnatura z courtCases, izba z division.chambers"); }

{ const w = normalizujOdpowiedzSAOS(fx("COMMON"));
  assert.ok(w.result.identyfikator, "identyfikator nie może być null");
  assert.match(w.result.sad, /^Sąd /);
  assert.ok(!/<em>/.test(w.result.fragment_tresci ?? ""), "znaczniki <em> usunięte");
  console.log("OK: sąd powszechny — sygnatura, nazwa sądu, fragment bez <em>"); }

{ const w = normalizujOdpowiedzSAOS(fx("NAC"));
  assert.match(w.result.identyfikator, /^KIO/);
  assert.strictEqual(w.result.sad, "Krajowa Izba Odwoławcza");
  console.log("OK: KIO — sygnatura i nazwa organu"); }

{ const w = normalizujOdpowiedzSAOS([]);
  assert.strictEqual(w.status, "NOT_FOUND");
  assert.match(w.uwaga, /nie jest dowodem/);
  console.log("OK: NOT_FOUND z zastrzeżeniem"); }

{ const w = normalizujOdpowiedzSAOS([], { courtType: "ADMINISTRATIVE" });
  assert.strictEqual(w.status, "OUT_OF_SCOPE");
  assert.strictEqual(w.snapshot, "🟨");
  console.log("OK: NSA/WSA → OUT_OF_SCOPE, nie „brak orzecznictwa”"); }

{ const w = normalizujOdpowiedzSAOS([...fx("COMMON"), ...fx("SUPREME")]);
  assert.strictEqual(w.status, "AMBIGUOUS");
  assert.ok(w.kandydaci.every((k) => k.identyfikator));
  console.log("OK: AMBIGUOUS — każdy kandydat z sygnaturą"); }

console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");

// ── saos_cytator: logika (kształt odpowiedzi z PRAWDZIWYCH fixture'ów SAOS; treść okna — konstrukcja testowa,
//    bo SAOS 27q w przerwie technicznej; skuteczność wzorców na żywo — F-212 pkt 1) ─────────────────────
import { skanujCytowanie, podsumujCytator, regexSygnatury } from "./saos-mcp-server.js";
{ const baza = fx("SUPREME")[0];
  const cyt = { ...baza, id: 1, courtCases: [{ caseNumber: "I CSK 1/20" }], judgmentDate: "2020-05-05",
    textContent: "… Sąd Najwyższy w składzie niniejszym nie podziela poglądu wyrażonego w wyroku z dnia 1 lutego 2010 r., II  PK 291 / 09, …" };
  const neutr = { ...baza, id: 2, courtCases: [{ caseNumber: "II PK 5/21" }], judgmentDate: "2021-01-01", textContent: "… por. wyrok SN z 2010 r., II PK 291/09 …" };
  const falsz = { ...baza, id: 3, courtCases: [{ caseNumber: "II PK 6/21" }], textContent: "… II PK 291/099 oraz II PK 2910/09 …" };
  assert.ok(regexSygnatury("II PK 291/09").test("sygn. II  PK 291 / 09."));
  assert.strictEqual(skanujCytowanie(falsz.textContent, "II PK 291/09").wystapienia, 0, "291/099 i 2910/09 to inne sygnatury");
  const w = podsumujCytator([baza, cyt, neutr, falsz], "II PK 291/09");
  assert.strictEqual(w.status, "FOUND"); assert.strictEqual(w.result.liczba_cytujacych, 2, "samo orzeczenie i fałszywe trafienie wykluczone");
  assert.strictEqual(w.result.z_sygnalem_odstapienia, 1); assert.match(w.result.werdykt, /^⚠️/);
  assert.strictEqual(w.cytujace.find((c) => c.identyfikator === "I CSK 1/20").sygnaly[0].etykieta, "niepodzielenie poglądu");
  assert.strictEqual(podsumujCytator([baza], "II PK 291/09").status, "NOT_FOUND");
  console.log("OK: cytator — ścisłe dopasowanie sygnatury, wykluczenie cytowanego i fałszywych trafień, sygnał w oknie");
  console.log("\nWSZYSTKIE TESTY saos_cytator PRZESZŁY"); }

// ── 27t: polskie końcówki (\p{L}) i KIERUNEK — fragment z PRAWDZIWEGO orzeczenia I CSK 358/11 (SAOS, 2026-09-28) ──
{ const prawdziwy = "(por. postanowienia Sądu Najwyższego z dnia 12 października 2000 r., IV CKN 1525/00, niepubl. i z dnia 4 października 2002 r. III CKN 1283/00). Wprawdzie w wyroku z dnia 3 października 1980 r., III CRN 126/80 (OSNCP 1981, nr 8, poz. 150) Sąd Najwyższego wyraził pogląd, zaaprobowany wówczas w piśmiennictwie, że istniejący między współwłaścicielami budynku poważny konflikt może stanowić okoliczność uzasadniającą odmowę zniesienia współwłasności przez ustanowienie odrębnej własności lokali, jednakże w postanowieniu z dnia 4 listopada 2002 r., III CKN 1283/00 Sąd Najwyższy odstąpił od tego stanowiska i wyraził zapatrywanie, że konflikt osobisty";
  const aktor = skanujCytowanie(prawdziwy, "III CKN 1283/00").sygnaly;
  assert.ok(aktor.length && aktor.every((x) => x.typ === "kontekst"), "III CKN 1283/00 jest AKTOREM odstąpienia — nie sygnał przeciw niemu");
  const przedmiot = skanujCytowanie(prawdziwy, "III CRN 126/80").sygnaly;
  assert.ok(przedmiot.some((x) => x.typ === "odstapienie" && /odstąpienie/.test(x.etykieta)), "III CRN 126/80 jest PRZEDMIOTEM odstąpienia");
  assert.strictEqual(skanujCytowanie(prawdziwy, "IV CKN 1525/00").sygnaly.length, 0, "IV CKN 1525/00 (aprobująco „por.”) — fraza w INNYM zdaniu → brak sygnału");
  console.log("OK: 27t — „odstąpił” (\\p{L}), kierunek: aktor vs przedmiot odstąpienia na prawdziwym fragmencie"); }

// ── 27t: fałszywe trafienie z próby na żywo (II PK 145/11 o II PK 129/09) — fraza w innym zdaniu ──
import { toSamoZdanie } from "./saos-mcp-server.js";
{ const fp = "(przykładowo wyroki Sądu Najwyższego z 3 października 2008 r., II PK 48/08, LEX nr 513006 oraz z 24 listopada 2009 r., II PK 129/09, LEX nr 571918). W rozpoznawanej sprawie uzasadnienie wyroku Sądu drugiej instancji dotknięte jest właśnie takimi brakami, które uniemożliwiają Sądowi Najwyższemu dokonanie oceny zarzutów kasacyjnych, bowiem Sąd drugiej instancji ograniczył się do stwierdzenia, że nie podziela stanowiska tego Sądu co do tego, że intencją stron było nawiązanie umowy";
  assert.strictEqual(skanujCytowanie(fp, "II PK 129/09").sygnaly.length, 0, "fraza o sądzie rejonowym w innym zdaniu");
  assert.ok(toSamoZdanie("z dnia 4 października 2002 r. III CKN 1283/00 Sąd Najwyższy odstąpił"), "„r. III CKN” to nie granica zdania");
  assert.ok(toSamoZdanie("(OSNCP 1981, Nr 8, poz. 150) Sąd Najwyższy wyraził pogląd"), "skróty publikatora to nie granica");
  assert.ok(!toSamoZdanie("LEX nr 571918). W rozpoznawanej sprawie"), "„). W” to granica");
  console.log("OK: 27t — to samo zdanie: fałszywe trafienie z próby odrzucone; skróty i sygnatury rzymskie nie tną zdania"); }

// 2026-10-01: odesłanie DATĄ (fragment prawdziwego uzasadnienia III CKN 1283/00, pomiar na pełnym tekście SAOS).
{
  const tekst = "Sąd Najwyższy zważył, co następuje: W wyroku z dnia 3 października 1980 r., III CRN 126/80 Sąd Najwyższy wyraził pogląd, " +
    "zaaprobowany wówczas w piśmiennictwie, że istniejący między właścicielami budynku poważny konflikt może stanowić okoliczność " +
    "uzasadniającą odmowę zniesienia współwłasności. " + "Dalszy wywód o art. 211 k.c. ".repeat(60) +
    "Nie można także uznać za zadowalające odwołanie się do wyroku Sądu Najwyższego z dnia 3 października 1980 r. i poprzestanie na stwierdzeniu, że konflikt wyklucza podział.";
  const s = skanujCytowanie(tekst, "III CRN 126/80");
  if (s.wystapienia !== 1 || !s.sygnaly.some((x) => x.typ === "odstapienie")) { console.error("FAIL: odesłanie datą niewykryte", JSON.stringify(s).slice(0, 300)); process.exit(1); }
  // ta sama data przy INNEJ sygnaturze nie jest kotwicą
  const inny = "W wyroku z dnia 3 października 1980 r., III CRN 126/80 SN wyraził pogląd. " + "x ".repeat(400) +
    "Nie można uznać za trafne stanowiska z wyroku z dnia 3 października 1980 r., II CR 999/80.";
  if (skanujCytowanie(inny, "III CRN 126/80").sygnaly.length) { console.error("FAIL: data przy innej sygnaturze potraktowana jako kotwica"); process.exit(1); }
  console.log("OK: 2026-10-01 — odesłanie datą wykryte; ta sama data z inną sygnaturą pominięta");
}

// zgł. #90 — FOUND tylko przy tożsamości sygnatury (courtCases[].caseNumber), nie „jedna pozycja po mapowaniu”
{ const w = normalizujOdpowiedzSAOS(fx("SUPREME"), { sygnatura: "II PK 29/09" });
  assert.strictEqual(w.status, "NOT_FOUND");
  assert.deepStrictEqual(w.odrzucone_post_checkiem, ["II PK 291/09"]);
  console.log("OK: #90 sygnatura nieistniejąca (near-match II PK 291/09) → NOT_FOUND, nie FOUND"); }

{ const w = normalizujOdpowiedzSAOS(fx("SUPREME"), { sygnatura: "I PK 291/09" });
  assert.strictEqual(w.status, "NOT_FOUND");
  console.log("OK: #90 sygnatura różna literą (I PK vs II PK) → NOT_FOUND"); }

{ const w = normalizujOdpowiedzSAOS(fx("SUPREME"), { sygnatura: "ii  pk 291/09" });
  assert.strictEqual(w.status, "FOUND");
  console.log("OK: #90 normalizacja (wielkość liter, spacje) → FOUND"); }

{ const tk = [{ courtType: "CONSTITUTIONAL_TRIBUNAL", courtCases: [{ caseNumber: "K 7/94" }] }];
  assert.strictEqual(normalizujOdpowiedzSAOS(tk, { sygnatura: "K 7/94" }).status, "FOUND");
  assert.strictEqual(normalizujOdpowiedzSAOS(tk, { sygnatura: "SK 7/94" }).status, "NOT_FOUND");
  console.log("OK: #90 TK — sygnatura z courtCases[].caseNumber; SK 7/94 ≠ K 7/94"); }

{ const w = normalizujOdpowiedzSAOS([...fx("COMMON"), ...fx("SUPREME")], { sygnatura: "II PK 291/09" });
  assert.strictEqual(w.status, "FOUND");
  assert.deepStrictEqual(w.odrzucone_post_checkiem, ["I ACa 566/12"]);
  console.log("OK: #90 obce trafienie odrzucone post-checkiem, zostaje jedno tożsame → FOUND"); }

{ const w = normalizujOdpowiedzSAOS(fx("COMMON"), { sygnatura: "II PK 291/09", kompletne: false });
  assert.strictEqual(w.status, "ERROR");
  console.log("OK: #90 niepełne stronicowanie bez trafienia → ERROR, nie NOT_FOUND"); }
