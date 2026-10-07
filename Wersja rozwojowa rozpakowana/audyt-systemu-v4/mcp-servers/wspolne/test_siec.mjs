// Błędy sieci: kod i host w komunikacie zamiast „fetch failed”; ponowienie tylko tam, gdzie bezpieczne.
import { opisBleduSieci, kodSieci, BlokadaBotow } from "./budzet.mjs";
import assert from "node:assert";
import http from "node:http";

let zerwij = 0;
const zadania = [];
const serwer = http.createServer((req, res) => {
  zadania.push(req.method);
  if (zerwij > 0) { zerwij--; req.socket.destroy(); return; }
  if (req.url === "/imperva") { res.setHeader("content-type", "text/html"); res.end('<html style="height:100%"><script src="/_Incapsula_Resource?SWJIYLWA=1"></script></html>'); return; }
  if (req.url === "/html") { res.setHeader("content-type", "text/html"); res.end("<html><body>Przerwa techniczna</body></html>"); return; }
  if (req.url === "/json") { res.end('{"a":1}'); return; }
  res.end("ok");
});
await new Promise((ok) => serwer.listen(0, "127.0.0.1", ok));
const url = `http://127.0.0.1:${serwer.address().port}/`;

// GET: dwa zerwania, trzecia próba odpowiada.
zerwij = 2;
assert.strictEqual(await (await fetch(url)).text(), "ok");
assert.deepStrictEqual(zadania.splice(0), ["GET", "GET", "GET"]);

// POST bez oznaczenia: zerwanie po wysłaniu NIE jest ponawiane (brak podwójnego wysłania).
zerwij = 1;
await assert.rejects(fetch(url, { method: "POST", body: "x" }), (e) => /Połączenie zerwane przez serwer \(127\.0\.0\.1\): (ECONNRESET|UND_ERR_SOCKET)/.test(e.message));
assert.deepStrictEqual(zadania.splice(0), ["POST"]);

// POST oznaczony jako powtarzalny (wyszukiwarka): ponowiony.
zerwij = 1;
assert.strictEqual(await (await fetch(url, { method: "POST", body: "x", lexPowtarzalne: true })).text(), "ok");
assert.deepStrictEqual(zadania.splice(0), ["POST", "POST"]);
// json(): strona weryfikacji / HTML / poprawny JSON.
await assert.rejects((await fetch(url + "imperva")).json(), (e) => e instanceof BlokadaBotow && /^127\.0\.0\.1: ochrona przed botami/.test(e.message));
await assert.rejects((await fetch(url + "html")).json(), (e) => /strona HTML zamiast danych JSON \(HTTP 200/.test(e.message));
assert.deepStrictEqual(await (await fetch(url + "json")).json(), { a: 1 });
zadania.splice(0);
serwer.close();

// Odmowa połączenia: kod w komunikacie.
const wolny = http.createServer();
await new Promise((ok) => wolny.listen(0, "127.0.0.1", ok));
const zamkniety = wolny.address().port;
await new Promise((ok) => wolny.close(ok));
await assert.rejects(fetch(`http://127.0.0.1:${zamkniety}/`), (e) => /ECONNREFUSED/.test(e.message) && kodSieci(e) === "ECONNREFUSED");

// Opisy przyczyn.
const z = (code) => Object.assign(new TypeError("fetch failed"), { cause: Object.assign(new Error("x"), { code }) });
assert.match(opisBleduSieci(z("UNABLE_TO_VERIFY_LEAF_SIGNATURE"), "orzeczenia.nsa.gov.pl"), /^Błąd TLS \(orzeczenia\.nsa\.gov\.pl\): UNABLE_TO_VERIFY_LEAF_SIGNATURE/);
assert.match(opisBleduSieci(z("ENOTFOUND"), "a.pl"), /^Błąd DNS/);
assert.match(opisBleduSieci(new TypeError("fetch failed"), "a.pl"), /^Błąd sieci \(a\.pl\): fetch failed/);
console.log("OK: błędy sieci z kodem i hostem; ponowienie GET i POST oznaczonego, bez ponowienia zwykłego POST; json() z przyczyną (ochrona przed botami, HTML)");
