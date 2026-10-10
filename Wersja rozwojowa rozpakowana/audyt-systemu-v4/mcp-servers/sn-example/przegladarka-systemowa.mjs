/**
 * przegladarka-systemowa.mjs — okno weryfikacji sn.pl w przeglądarce zainstalowanej u użytkownika
 * (Edge, Chrome, Chromium) przez protokół DevTools, bez Playwrighta i bez zależności (1.7.0).
 *
 * Przebieg jak w aplikacji (okno Tauri): użytkownik zatwierdza narzędzie w czacie, przeglądarka startuje
 * z tymczasowym profilem na sn.pl, weryfikację przechodzi człowiek, a po udanej sondzie snproxy
 * ciasteczka sn.pl i rzeczywisty User-Agent przeglądarki trafiają do pliku sesji. Bez trybu bez okna,
 * bez podmiany User-Agenta i bez ukrywania automatyzacji. Port DevTools tylko na 127.0.0.1, profil
 * usuwany po zamknięciu. Safari nie obsługuje tego protokołu — wtedy sn_sesja_ustaw (ręcznie).
 *
 * Env: SN_PRZEGLADARKA=ścieżka do pliku wykonywalnego (pierwszeństwo przed wyszukiwaniem).
 */
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

/** Kandydaci w kolejności: Edge (jest na każdym Windowsie), Chrome, Chromium. */
export function kandydaciPrzegladarki(platform = process.platform, env = process.env) {
  if (platform === "win32") {
    const katalogi = [env["ProgramFiles(x86)"], env.ProgramFiles, env.LOCALAPPDATA].filter(Boolean);
    return [
      ...katalogi.map((k) => path.win32.join(k, "Microsoft", "Edge", "Application", "msedge.exe")),
      ...katalogi.map((k) => path.win32.join(k, "Google", "Chrome", "Application", "chrome.exe")),
    ];
  }
  if (platform === "darwin") {
    const aplikacje = ["/Applications", path.join(env.HOME || os.homedir(), "Applications")];
    return aplikacje.flatMap((k) => [
      path.join(k, "Google Chrome.app", "Contents", "MacOS", "Google Chrome"),
      path.join(k, "Microsoft Edge.app", "Contents", "MacOS", "Microsoft Edge"),
      path.join(k, "Chromium.app", "Contents", "MacOS", "Chromium"),
    ]);
  }
  const nazwy = ["google-chrome", "google-chrome-stable", "microsoft-edge", "microsoft-edge-stable", "chromium", "chromium-browser"];
  return (env.PATH || "").split(path.delimiter).filter(Boolean).flatMap((k) => nazwy.map((n) => path.join(k, n)));
}

export function znajdzPrzegladarke(env = process.env, platform = process.platform, istnieje = fs.existsSync) {
  if (env.SN_PRZEGLADARKA) return istnieje(env.SN_PRZEGLADARKA) ? env.SN_PRZEGLADARKA : null;
  return kandydaciPrzegladarki(platform, env).find((p) => istnieje(p)) ?? null;
}

// ── Minimalny klient WebSocket (RFC 6455) — Node 18 nie ma globalnego WebSocket ──
function ramka(tekst) {
  const dane = Buffer.from(tekst, "utf8");
  const n = dane.length;
  const naglowek = n < 126 ? Buffer.from([0x81, 0x80 | n])
    : n < 65536 ? Buffer.from([0x81, 0x80 | 126, n >> 8, n & 255])
      : Buffer.concat([Buffer.from([0x81, 0x80 | 127]), (() => { const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(n)); return b; })()]);
  const maska = crypto.randomBytes(4);
  for (let i = 0; i < n; i += 1) dane[i] ^= maska[i & 3];
  return Buffer.concat([naglowek, maska, dane]);
}

/** Dekoduje kompletne ramki z bufora; zwraca [wiadomości, reszta]. Ramki serwera nie są maskowane. */
export function dekodujRamki(bufor, stan = { czesci: [] }) {
  const wiadomosci = [];
  let b = bufor;
  for (;;) {
    if (b.length < 2) break;
    const fin = (b[0] & 0x80) !== 0, opcode = b[0] & 0x0f;
    let n = b[1] & 0x7f, off = 2;
    if (n === 126) { if (b.length < 4) break; n = b.readUInt16BE(2); off = 4; }
    else if (n === 127) { if (b.length < 10) break; n = Number(b.readBigUInt64BE(2)); off = 10; }
    const maskowana = (b[1] & 0x80) !== 0;
    const maska = maskowana ? b.subarray(off, off + 4) : null;
    if (maskowana) off += 4;
    if (b.length < off + n) break;
    const dane = Buffer.from(b.subarray(off, off + n));
    if (maska) for (let i = 0; i < n; i += 1) dane[i] ^= maska[i & 3];
    b = b.subarray(off + n);
    if (opcode === 0x1 || opcode === 0x0) {
      stan.czesci.push(dane);
      if (fin) { wiadomosci.push({ typ: "tekst", dane: Buffer.concat(stan.czesci).toString("utf8") }); stan.czesci = []; }
    } else if (opcode === 0x8) wiadomosci.push({ typ: "zamkniecie" });
    else if (opcode === 0x9) wiadomosci.push({ typ: "ping", dane });
  }
  return [wiadomosci, b];
}

function polaczWs(port, sciezka) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path: sciezka, headers: {
      Connection: "Upgrade", Upgrade: "websocket", "Sec-WebSocket-Version": "13",
      "Sec-WebSocket-Key": crypto.randomBytes(16).toString("base64") } });
    req.on("upgrade", (_res, gniazdo) => resolve(gniazdo));
    req.on("response", (res) => reject(new Error(`DevTools odrzucił połączenie (HTTP ${res.statusCode})`)));
    req.on("error", reject);
    req.end();
  });
}

/** Połączenie CDP z przeglądarką: wyslij(metoda, parametry, sesja) → wynik. */
export async function polaczCdp(port, sciezka) {
  const gniazdo = await polaczWs(port, sciezka);
  const oczekujace = new Map();
  let nastepny = 1, reszta = Buffer.alloc(0);
  const stan = { czesci: [] };
  const zakoncz = (blad) => { for (const o of oczekujace.values()) o.reject(blad); oczekujace.clear(); };
  gniazdo.on("data", (porcja) => {
    const [wiadomosci, r] = dekodujRamki(Buffer.concat([reszta, porcja]), stan);
    reszta = r;
    for (const w of wiadomosci) {
      if (w.typ === "zamkniecie") { gniazdo.end(); continue; }
      if (w.typ === "ping") continue;
      let o; try { o = JSON.parse(w.dane); } catch { continue; }
      const czeka = o.id !== undefined ? oczekujace.get(o.id) : undefined;
      if (!czeka) continue;
      oczekujace.delete(o.id);
      if (o.error) czeka.reject(new Error(`CDP ${czeka.metoda}: ${o.error.message}`));
      else czeka.resolve(o.result ?? {});
    }
  });
  gniazdo.on("close", () => zakoncz(new Error("Przeglądarka zamknięta")));
  gniazdo.on("error", (e) => zakoncz(e));
  return {
    wyslij(metoda, parametry = {}, sessionId) {
      const id = nastepny++;
      return new Promise((resolve, reject) => {
        oczekujace.set(id, { resolve, reject, metoda });
        gniazdo.write(ramka(JSON.stringify({ id, method: metoda, params: parametry, ...(sessionId ? { sessionId } : {}) })));
      });
    },
    zamknij() { gniazdo.destroy(); },
  };
}

const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));

/** Start przeglądarki z tymczasowym profilem; port DevTools z pliku DevToolsActivePort. */
export async function uruchomPrzegladarke(exe, url, { limitStartuMs = 20000 } = {}) {
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "lex-sn-przegladarka-"));
  const usunProfil = () => { try { fs.rmSync(profil, { recursive: true, force: true }); } catch { /* plik zajęty */ } };
  const proces = spawn(exe, [`--user-data-dir=${profil}`, "--remote-debugging-port=0", "--remote-debugging-address=127.0.0.1",
    "--no-first-run", "--no-default-browser-check", "--new-window", url], { stdio: "ignore" });
  let wyjscie = null;
  // Koniec serwera MCP (klient zamknął połączenie) zamyka też okno — bez osieroconej przeglądarki.
  const sprzatnij = () => { if (wyjscie === null) proces.kill(); usunProfil(); };
  process.once("exit", sprzatnij);
  process.stdin.once("end", sprzatnij); // transport stdio zamknięty — klienta już nie ma
  proces.on("exit", (kod) => {
    wyjscie = kod ?? 0;
    process.removeListener("exit", sprzatnij);
    process.stdin.removeListener("end", sprzatnij);
  });
  proces.on("error", (e) => { wyjscie = e; });
  const plik = path.join(profil, "DevToolsActivePort");
  const doKiedy = Date.now() + limitStartuMs;
  while (Date.now() < doKiedy && wyjscie === null) {
    const [port, sciezka] = fs.existsSync(plik) ? fs.readFileSync(plik, "utf8").split(/\r?\n/) : [];
    if (port && sciezka) {
      const cdp = await polaczCdp(Number(port), sciezka);
      return { cdp, proces, profil, czyDziala: () => wyjscie === null,
        async zamknij() {
          await cdp.wyslij("Browser.close").catch(() => {});
          cdp.zamknij();
          for (let i = 0; i < 20 && wyjscie === null; i += 1) await czekaj(250);
          if (wyjscie === null) proces.kill();
          usunProfil();
        } };
    }
    await czekaj(200);
  }
  proces.kill();
  usunProfil();
  throw new Error(wyjscie instanceof Error ? `Nie udało się uruchomić przeglądarki: ${wyjscie.message}`
    : `Przeglądarka nie udostępniła DevTools w ${Math.round(limitStartuMs / 1000)} s`);
}

/** Wykonanie wyrażenia w karcie sn.pl (pierwsza karta z adresem sn.pl); null, gdy brak takiej karty. */
export async function wykonajWKarcie(cdp, wyrazenie) {
  const { targetInfos = [] } = await cdp.wyslij("Target.getTargets");
  const karta = targetInfos.find((t) => t.type === "page" && /^https:\/\/(www\.)?sn\.pl\//.test(t.url));
  if (!karta) return null;
  const { sessionId } = await cdp.wyslij("Target.attachToTarget", { targetId: karta.targetId, flatten: true });
  try {
    const { result, exceptionDetails } = await cdp.wyslij("Runtime.evaluate",
      { expression: wyrazenie, awaitPromise: true, returnByValue: true }, sessionId);
    return exceptionDetails ? null : result?.value ?? null;
  } finally {
    await cdp.wyslij("Target.detachFromTarget", { sessionId }).catch(() => {});
  }
}

/** Ciasteczka sn.pl z profilu przeglądarki (nagłówek Cookie) i jej rzeczywisty User-Agent. */
export async function sesjaZPrzegladarki(cdp) {
  const { cookies = [] } = await cdp.wyslij("Storage.getCookies");
  const cookie = cookies.filter((c) => /(^|\.)sn\.pl$/.test(String(c.domain).replace(/^\./, "")))
    .map((c) => `${c.name}=${c.value}`).join("; ");
  const { userAgent } = await cdp.wyslij("Browser.getVersion");
  return { cookie, userAgent };
}
