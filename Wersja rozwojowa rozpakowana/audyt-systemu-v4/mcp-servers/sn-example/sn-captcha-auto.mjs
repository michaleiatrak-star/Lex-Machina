/**
 * sn-captcha-auto.mjs — przejście weryfikacji sn.pl (Incapsula) i zapis sesji dla konektora SN.
 *
 * 1.5.0 (audyt 6.202, 2026-10-06) — BEZ PŁATNYCH USŁUG. Zamiast 2captcha:
 *  1. Playwright bez okna (headless) — przechodzi samo wyzwanie JS Incapsuli, w budżecie wywołania;
 *  2. gdy sn.pl pokazuje widżet (reCAPTCHA/hCaptcha/Turnstile) albo tryb bez okna nie przeszedł —
 *     WIDOCZNE okno przeglądarki, w którym weryfikację przechodzi użytkownik. Okno działa w tle
 *     (wywołanie MCP wraca od razu — klient ma limit 60 s), sesja zapisuje się sama po przejściu.
 * 1.7.0 (2026-10-10): okno widoczne najpierw w przeglądarce zainstalowanej u użytkownika (Edge/Chrome/Chromium,
 *     protokół DevTools, przegladarka-systemowa.mjs) — bez Playwrighta, więc działa z rozszerzenia Claude Desktop.
 *     Playwright tylko, gdy jest zainstalowany (próba bez okna, okno zastępcze bez przeglądarki systemowej).
 * Przejście weryfikacji potwierdza SONDA: zapytanie snproxy z wnętrza strony musi zwrócić JSON.
 * (1.4.0 uznawała za sukces samą obecność ciasteczek incap_ses/visid_incap, które Incapsula
 * ustawia już na stronie wyzwania — zapisywała sesję, która nie przechodziła.)
 *
 * Env:
 *   SN_CAPTCHA_AUTO=1          automat przy każdej blokadzie w sn_sprawdz_sygnature/sn_szukaj/sn_pobierz
 *   SN_SESSION_FILE=ścieżka    domyślnie ~/.lex-machina/sn-session.json (poza katalogiem pluginu)
 *   SN_CAPTCHA_HEADLESS=0      pomiń próbę bez okna, od razu okno widoczne
 *   SN_CAPTCHA_RECZNIE=0       nie otwieraj okna widocznego (np. serwer bez ekranu)
 *   SN_CAPTCHA_TIMEOUT_MS      limit próby bez okna (domyślnie 35000, przycinany do budżetu wywołania)
 *   SN_CAPTCHA_RECZNIE_MS      czas na weryfikację w oknie (domyślnie 300000)
 *   SN_PRZEGLADARKA=ścieżka    przeglądarka oparta na Chromium (domyślnie wyszukiwana: Edge, Chrome, Chromium)
 * Opcjonalnie: npm i playwright && npx playwright install chromium — w katalogu mcp-servers.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pozostalyBudzet } from "../wspolne/budzet.mjs";
import { sesjaZPrzegladarki, uruchomPrzegladarke, wykonajWKarcie, znajdzPrzegladarke } from "./przegladarka-systemowa.mjs";

const START = "https://www.sn.pl/pl/wyszukiwarka-orzeczen";
const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
/** Sondy snproxy (względne — wykonywane z wnętrza strony sn.pl). Obie ścieżki: wynik mówi, która działa. */
export const SONDY = ["/pl/index.php", "/index.php"].map((p) =>
  `${p}?option=com_ajax&plugin=snproxy&format=json&task=searchOrzeczenia&sygnatura=${encodeURIComponent("III CZP 25/11")}`);
const ms = (v, d, min) => Math.max(min, Number(v) || d);

export function sciezkaSesji(env = process.env) {
  if (env.SN_SESSION_FILE) return env.SN_SESSION_FILE;
  return path.join(os.homedir(), ".lex-machina", "sn-session.json");
}

export function autoWlaczone(env = process.env) {
  const v = String(env.SN_CAPTCHA_AUTO ?? "").toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export const recznieDozwolone = (env = process.env) => String(env.SN_CAPTCHA_RECZNIE ?? "1") !== "0";

export function wykryjChallenge(html) {
  const t = String(html ?? "");
  const out = { incapsula: /incapsula|_Incapsula_Resource|imperva/i.test(t), recaptcha: false, hcaptcha: false,
    turnstile: false, sitekey: null, kind: "unknown" };
  const reSite = t.match(/data-sitekey=["']([^"']+)["']/i) || t.match(/sitekey["']\s*:\s*["']([^"']+)["']/i);
  if (/recaptcha|g-recaptcha/i.test(t)) Object.assign(out, { recaptcha: true, kind: "recaptcha", sitekey: reSite?.[1] ?? null });
  else if (/hcaptcha|h-captcha/i.test(t)) Object.assign(out, { hcaptcha: true, kind: "hcaptcha", sitekey: reSite?.[1] ?? null });
  else if (/turnstile|cf-turnstile/i.test(t)) Object.assign(out, { turnstile: true, kind: "turnstile", sitekey: reSite?.[1] ?? null });
  else if (out.incapsula) out.kind = "incapsula_js";
  return out;
}
const maWidzet = (ch) => Boolean(ch?.recaptcha || ch?.hcaptcha || ch?.turnstile);

/** Zapis w formacie SN_SESSION_FILE (bez logowania wartości cookie; plik tylko dla właściciela). */
export function zapiszSesjePlik({ cookie, userAgent, source }, env = process.env) {
  const file = sciezkaSesji(env);
  const data = { cookie: String(cookie ?? "").trim(), userAgent: userAgent || DEFAULT_UA,
    saved_at: new Date().toISOString(), source: source || "auto" };
  if (!data.cookie.includes("=")) throw new Error("Pusty lub nieprawidłowy ciąg cookie");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), { encoding: "utf8", mode: 0o600 });
  const names = data.cookie.split(";").map((x) => x.trim().split("=")[0]).filter(Boolean);
  return { ok: true, path: file, cookies_count: names.length, names, saved_at: data.saved_at, source: data.source };
}

async function zaladujPlaywright() {
  try { return await import("playwright"); } catch {
    throw new Error("Brak playwright — w katalogu mcp-servers: npm i playwright && npx playwright install chromium");
  }
}

/**
 * Sonda wykonywana WEWNĄTRZ strony sn.pl (Playwright: page.evaluate; przeglądarka systemowa: Runtime.evaluate).
 * Samodzielna funkcja — serializowana przez toString, nie może odwoływać się do niczego spoza siebie.
 */
export async function probaSnproxy(adres) {
  try {
    const r = await fetch(adres, { credentials: "include",
      headers: { Accept: "application/json, text/javascript, */*; q=0.01", "X-Requested-With": "XMLHttpRequest" } });
    const t = await r.text();
    let o; try { o = JSON.parse(t); } catch { return { status: r.status, json: false }; }
    // Koperta com_ajax z błędem sesji/tokenu („Brak tokenu”) to poprawny JSON, ale NIE dane —
    // weryfikacja wtedy nie przeszła (zgł. 2026-10-07: sonda błędnie zaliczała taką odpowiedź).
    let cur = o, blad = false;
    for (let i = 0; i < 5 && cur && typeof cur === "object"; i += 1) {
      const c = Array.isArray(cur) ? cur[0] : cur;
      if (c && c.error !== undefined && c.error !== null && c.error !== false && !("sygnatura_sprawy" in c)) { blad = true; break; }
      cur = c ? c.data : null;
    }
    return { status: r.status, json: true, bladSesji: blad };
  } catch { return { status: 0, json: false }; }
}

/** Pierwsza sonda snproxy, która zwraca dane (= weryfikacja przejdzie także poza przeglądarką), albo null. */
async function sondaPrzez(wykonaj) {
  for (const u of SONDY) {
    const w = (await wykonaj(u).catch(() => null)) ?? { status: 0, json: false };
    if (w.status === 200 && w.json && !w.bladSesji) return u.split("?")[0];
  }
  return null;
}
const sonda = (page) => sondaPrzez((u) => page.evaluate(probaSnproxy, u));

/**
 * Jedna przeglądarka: wejście na wyszukiwarkę, czekanie na przejście weryfikacji (sonda co 3 s), zapis sesji.
 * headless=true przerywa od razu przy widżecie (człowiek go nie zobaczy).
 */
export async function solvePlaywright(pageUrl = START, env = process.env, { headless = true, limitMs = 35000 } = {}) {
  const playwright = await zaladujPlaywright();
  const browser = await playwright.chromium.launch({ headless, args: ["--disable-blink-features=AutomationControlled"] });
  try {
    const context = await browser.newContext({ userAgent: DEFAULT_UA, locale: "pl-PL", viewport: { width: 1280, height: 800 } });
    await context.addInitScript(() => { Object.defineProperty(navigator, "webdriver", { get: () => undefined }); });
    const page = await context.newPage();
    const doKiedy = Date.now() + limitMs;
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: Math.max(5000, limitMs) }).catch(() => {});
    let ch = wykryjChallenge("");
    while (Date.now() < doKiedy) {
      const endpoint = await sonda(page);
      if (endpoint) {
        const cookie = (await context.cookies("https://www.sn.pl")).map((c) => `${c.name}=${c.value}`).join("; ");
        return { ...zapiszSesjePlik({ cookie, userAgent: DEFAULT_UA, source: headless ? "playwright-auto" : "playwright-okno" }, env),
          endpoint, challenge: ch };
      }
      ch = wykryjChallenge(await page.content().catch(() => ""));
      if (headless && maWidzet(ch)) {
        const e = new Error(`sn.pl pokazuje widżet ${ch.kind} — wymaga przejścia przez człowieka w widocznym oknie`);
        e.challenge = ch; e.widzet = true; throw e;
      }
      await page.waitForTimeout(3000);
    }
    const e = new Error(`Weryfikacja sn.pl nie przeszła w ${Math.round(limitMs / 1000)} s (sonda snproxy bez JSON)`);
    e.challenge = ch; throw e;
  } finally {
    await browser.close().catch(() => {});
  }
}

// ── Okno widoczne w tle: wywołanie MCP wraca od razu, sesja zapisuje się po przejściu weryfikacji ──
let okno = null;
const publiczne = (o) => o && { stan: o.stan, otwarte_at: o.otwarte_at, limit_s: Math.round(o.limit_ms / 1000),
  ...(o.przegladarka ? { przegladarka: o.przegladarka } : {}),
  ...(o.wynik ? { wynik: o.wynik } : {}), ...(o.blad ? { blad: o.blad } : {}) };
export const stanOkna = () => publiczne(okno);

/**
 * Okno w przeglądarce systemowej (Edge/Chrome przez DevTools): czeka, aż użytkownik przejdzie weryfikację
 * (sonda snproxy z karty sn.pl co 3 s), zapisuje ciasteczka sn.pl z rzeczywistym User-Agentem i zamyka okno.
 */
export async function solvePrzegladarkaSystemowa(exe, pageUrl = START, env = process.env, { limitMs = 300000 } = {},
  uruchom = uruchomPrzegladarke) {
  const p = await uruchom(exe, pageUrl);
  return {
    wynik: (async () => {
      try {
        const doKiedy = Date.now() + limitMs;
        while (Date.now() < doKiedy) {
          if (!p.czyDziala()) throw new Error("Okno przeglądarki zamknięte przed przejściem weryfikacji");
          const endpoint = await sondaPrzez((u) => wykonajWKarcie(p.cdp, `(${probaSnproxy.toString()})(${JSON.stringify(u)})`));
          if (endpoint) {
            const { cookie, userAgent } = await sesjaZPrzegladarki(p.cdp);
            return { ...zapiszSesjePlik({ cookie, userAgent, source: "przegladarka-systemowa" }, env), endpoint };
          }
          await new Promise((r) => setTimeout(r, 3000));
        }
        throw new Error(`Weryfikacja sn.pl nie przeszła w ${Math.round(limitMs / 1000)} s`);
      } finally {
        await p.zamknij().catch(() => {});
      }
    })(),
  };
}

/**
 * Widoczne okno w tle: najpierw przeglądarka systemowa (bez zależności), a bez niej okno Playwrighta.
 * Wywołanie wraca od razu po otwarciu okna; stan: stanOkna() / sn_sesja_status.
 */
export async function otworzOkno(pageUrl = START, env = process.env, deps = {}) {
  if (okno?.stan === "otwarte") return { ...publiczne(okno), juz_otwarte: true };
  const limit = ms(env.SN_CAPTCHA_RECZNIE_MS, 300000, 30000);
  const exe = (deps.znajdz ?? znajdzPrzegladarke)(env);
  let wynik, przegladarka;
  if (exe) {
    ({ wynik } = await solvePrzegladarkaSystemowa(exe, pageUrl, env, { limitMs: limit }, deps.uruchom));
    przegladarka = path.basename(exe);
  } else {
    try { await (deps.zaladujPlaywright ?? zaladujPlaywright)(); } catch {
      throw new Error("Brak przeglądarki Edge/Chrome/Chromium i brak playwright — zainstaluj Chrome albo Edge " +
        "(albo ustaw SN_PRZEGLADARKA na plik wykonywalny przeglądarki opartej na Chromium)");
    }
    wynik = solvePlaywright(pageUrl, env, { headless: false, limitMs: limit });
    przegladarka = "playwright-chromium";
  }
  const biezace = { stan: "otwarte", otwarte_at: new Date().toISOString(), limit_ms: limit, przegladarka };
  okno = biezace;
  wynik
    .then((r) => { biezace.stan = "zapisane"; biezace.wynik = { path: r.path, cookies_count: r.cookies_count, names: r.names, saved_at: r.saved_at, endpoint: r.endpoint }; })
    .catch((e) => { biezace.stan = "nieudane"; biezace.blad = e.message; });
  return publiczne(biezace);
}

const UWAGA_RECZNIE = "Poza automatem: otwórz https://www.sn.pl/pl/wyszukiwarka-orzeczen w przeglądarce, przejdź weryfikację " +
  "i przekaż nagłówek Cookie narzędziem sn_sesja_ustaw (albo SN_COOKIE).";

/** Próba bez okna w budżecie wywołania, potem okno widoczne w tle (jeśli dozwolone). */
export async function rozwiazAutomatycznie(htmlHint = "", pageUrl = START, env = process.env, deps = {}) {
  const ch = wykryjChallenge(htmlHint);
  const steps = [];
  const zostalo = pozostalyBudzet() - 10000;
  if (String(env.SN_CAPTCHA_HEADLESS ?? "1") !== "0" && !maWidzet(ch) && zostalo >= 8000) {
    steps.push("playwright-headless");
    try {
      const r = await solvePlaywright(pageUrl, env, { headless: true, limitMs: Math.min(ms(env.SN_CAPTCHA_TIMEOUT_MS, 35000, 8000), zostalo) });
      return { ok: true, method: "playwright", challenge: ch, steps, ...r };
    } catch (e) {
      steps.push(`headless: ${e.message}`);
      if (e.challenge) ch.strona = e.challenge.kind; // co faktycznie pokazał sn.pl (np. incapsula_js, recaptcha)
      // Bez Playwrighta (np. rozszerzenie Claude Desktop) dalej okno w przeglądarce systemowej.
      if (/^Brak playwright/.test(e.message) && !recznieDozwolone(env)) {
        return { ok: false, method: "none", challenge: ch, steps, uwaga: `${e.message}. ${UWAGA_RECZNIE}` };
      }
    }
  }
  if (recznieDozwolone(env)) {
    steps.push("okno-widoczne");
    try {
      return { ok: false, oczekuje_na_uzytkownika: true, method: "okno-widoczne", challenge: ch, steps, okno: await otworzOkno(pageUrl, env, deps),
        uwaga: "Otwarto okno przeglądarki z sn.pl — przejdź w nim weryfikację. Sesja zapisze się sama, a okno zamknie; " +
          "stan: sn_sesja_status, potem ponów zapytanie." };
    } catch (e) { steps.push(`okno: ${e.message}`); }
  }
  return { ok: false, method: "none", challenge: ch, steps, uwaga: UWAGA_RECZNIE };
}
