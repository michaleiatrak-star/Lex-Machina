/**
 * sn-captcha-auto.mjs — przejście weryfikacji sn.pl (Incapsula) i zapis sesji dla konektora SN.
 *
 * 1.6.0 (audyt 6.218, 2026-10-10) — tylko człowiek przechodzi weryfikację: WIDOCZNE okno
 *  przeglądarki (Playwright, bez trybu bez okna, bez maskowania automatyzacji i bez podmiany UA).
 *  Automatyczne przechodzenie wyzwania Incapsuli bez udziału użytkownika (1.5.0, tryb headless)
 *  usunięte: to obchodzenie zabezpieczenia serwisu (shared/DOSTEP-MASZYNOWY-API.md §0).
 *  Okno działa w tle (wywołanie MCP wraca od razu — klient ma limit 60 s), sesja zapisuje się sama
 *  po przejściu; zapisany User-Agent to faktyczny UA tej przeglądarki.
 * Przejście weryfikacji potwierdza SONDA: zapytanie snproxy z wnętrza strony musi zwrócić JSON.
 * (1.4.0 uznawała za sukces samą obecność ciasteczek incap_ses/visid_incap, które Incapsula
 * ustawia już na stronie wyzwania — zapisywała sesję, która nie przechodziła.)
 *
 * Env:
 *   SN_CAPTCHA_AUTO=1          automat przy każdej blokadzie w sn_sprawdz_sygnature/sn_szukaj/sn_pobierz
 *   SN_SESSION_FILE=ścieżka    domyślnie ~/.lex-machina/sn-session.json (poza katalogiem pluginu)
 *   SN_CAPTCHA_RECZNIE=0       nie otwieraj okna widocznego (np. serwer bez ekranu)
 *   SN_CAPTCHA_RECZNIE_MS      czas na weryfikację w oknie (domyślnie 300000)
 * Wymaga (opcjonalnie): npm i playwright && npx playwright install chromium — w katalogu mcp-servers.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const START = "https://www.sn.pl/pl/wyszukiwarka-orzeczen";
// UA ręcznie przekazanej sesji, gdy użytkownik nie podał własnego (uczciwy identyfikator klienta).
const DEFAULT_UA = "LexMachina-MCP/1.6 (+https://github.com/michaleiatrak-star/Lex-Machina)";
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

/** Czy snproxy odpowiada JSON-em z tej strony (= weryfikacja przejdzie także poza przeglądarką). */
async function sonda(page) {
  for (const u of SONDY) {
    const w = await page.evaluate(async (adres) => {
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
    }, u).catch(() => ({ status: 0, json: false }));
    if (w.status === 200 && w.json && !w.bladSesji) return u.split("?")[0];
  }
  return null;
}

/**
 * Widoczne okno: wejście na wyszukiwarkę, weryfikację przechodzi użytkownik, sonda co 3 s, zapis sesji.
 */
export async function solvePlaywright(pageUrl = START, env = process.env, { limitMs = 300000 } = {}) {
  const playwright = await zaladujPlaywright();
  const browser = await playwright.chromium.launch({ headless: false });
  try {
    const context = await browser.newContext({ locale: "pl-PL", viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const doKiedy = Date.now() + limitMs;
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: Math.max(5000, limitMs) }).catch(() => {});
    let ch = wykryjChallenge("");
    while (Date.now() < doKiedy) {
      const endpoint = await sonda(page);
      if (endpoint) {
        const cookie = (await context.cookies("https://www.sn.pl")).map((c) => `${c.name}=${c.value}`).join("; ");
        const userAgent = await page.evaluate(() => navigator.userAgent).catch(() => DEFAULT_UA);
        return { ...zapiszSesjePlik({ cookie, userAgent, source: "playwright-okno" }, env),
          endpoint, challenge: ch };
      }
      ch = wykryjChallenge(await page.content().catch(() => ""));
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
  ...(o.wynik ? { wynik: o.wynik } : {}), ...(o.blad ? { blad: o.blad } : {}) };
export const stanOkna = () => publiczne(okno);

export async function otworzOkno(pageUrl = START, env = process.env) {
  if (okno?.stan === "otwarte") return { ...publiczne(okno), juz_otwarte: true };
  await zaladujPlaywright(); // brak Playwrighta → błąd od razu, nie w tle
  const biezace = { stan: "otwarte", otwarte_at: new Date().toISOString(), limit_ms: ms(env.SN_CAPTCHA_RECZNIE_MS, 300000, 30000) };
  okno = biezace;
  solvePlaywright(pageUrl, env, { limitMs: biezace.limit_ms })
    .then((r) => { biezace.stan = "zapisane"; biezace.wynik = { path: r.path, cookies_count: r.cookies_count, names: r.names, saved_at: r.saved_at, endpoint: r.endpoint }; })
    .catch((e) => { biezace.stan = "nieudane"; biezace.blad = e.message; });
  return publiczne(biezace);
}

const UWAGA_RECZNIE = "Poza automatem: otwórz https://www.sn.pl/pl/wyszukiwarka-orzeczen w przeglądarce, przejdź weryfikację " +
  "i przekaż nagłówek Cookie narzędziem sn_sesja_ustaw (albo SN_COOKIE).";

/** Przy blokadzie: widoczne okno w tle (jeśli dozwolone) — weryfikację przechodzi użytkownik. */
export async function rozwiazAutomatycznie(htmlHint = "", pageUrl = START, env = process.env) {
  const ch = wykryjChallenge(htmlHint);
  const steps = [];
  try { await zaladujPlaywright(); } catch (e) {
    return { ok: false, method: "none", challenge: ch, steps, uwaga: `${e.message}. ${UWAGA_RECZNIE}` };
  }
  if (recznieDozwolone(env)) {
    steps.push("okno-widoczne");
    try {
      return { ok: false, oczekuje_na_uzytkownika: true, method: "okno-widoczne", challenge: ch, steps, okno: await otworzOkno(pageUrl, env),
        uwaga: "Otwarto okno przeglądarki z sn.pl — przejdź w nim weryfikację. Sesja zapisze się sama; " +
          "stan: sn_sesja_status, potem ponów zapytanie." };
    } catch (e) { steps.push(`okno: ${e.message}`); }
  }
  return { ok: false, method: "none", challenge: ch, steps, uwaga: UWAGA_RECZNIE };
}
