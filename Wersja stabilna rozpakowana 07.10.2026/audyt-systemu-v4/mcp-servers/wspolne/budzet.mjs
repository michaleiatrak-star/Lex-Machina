// budzet.mjs — wspólny budżet czasu wywołania narzędzia MCP (AUDYT-2026-10-01).
//
// ⛔ PO CO: domyślny timeout żądania klienta MCP (SDK) = 60 s. Serwery miały pętle prób
//    3 × 30–45 s (EUREKA 90 s, UODO 90 s, EUR-Lex 120 s, SAOS 135 s, PDF ISAP 90 s). Gdy źródło
//    zawiesza połączenie (EUREKA: zmierzone 25–50% żądań bez odpowiedzi 2026-10-01), klient zrywał
//    po 60 s z „MCP error -32001: Request timed out”, a własny ERROR serwera nigdy nie docierał.
//    Teraz każde wywołanie narzędzia ma jeden budżet (domyślnie 50 s); każda próba HTTP dostaje
//    min(własny limit, pozostały budżet). Po wyczerpaniu budżetu kolejne próby kończą się od razu
//    jawnym błędem, więc narzędzie zwraca ERROR przed timeoutem klienta.
import { AsyncLocalStorage } from "node:async_hooks";
import tls from "node:tls";

// Certyfikaty z magazynu systemu obok wbudowanych (2026-10-06): na Windows antywirus albo zapora
// firmowa przechwytujące HTTPS instalują swój urząd w magazynie systemu — przeglądarka działa,
// a Node (tylko lista wbudowana) kończył „fetch failed”. Równoważne `node --use-system-ca`.
try {
  if (typeof tls.getCACertificates === "function" && typeof tls.setDefaultCACertificates === "function") {
    tls.setDefaultCACertificates([...new Set([...tls.getCACertificates("default"), ...tls.getCACertificates("system")])]);
  }
} catch { /* starszy Node albo brak magazynu: zostaje lista wbudowana */ }

const als = new AsyncLocalStorage();
export const BUDZET_MS = Math.max(5000, Number(process.env.LEX_BUDZET_MS) || 50000);

export class BudzetWyczerpany extends Error {}

/** Sygnał przerwania dla jednej próby HTTP: min(limitMs, pozostały budżet wywołania). */
export function sygnal(limitMs) {
  const st = als.getStore();
  if (!st) return AbortSignal.timeout(limitMs); // poza wywołaniem narzędzia (testy offline)
  const zostalo = st.koniec - Date.now();
  if (zostalo <= 250) {
    st.wyczerpany = true;
    throw new BudzetWyczerpany(`Przekroczony budżet czasu wywołania (${BUDZET_MS} ms) — źródło nie odpowiada; spróbuj ponownie później.`);
  }
  return AbortSignal.timeout(Math.min(limitMs, zostalo));
}

/** Pozostały budżet bieżącego wywołania w ms (Infinity poza wywołaniem narzędzia). */
export const pozostalyBudzet = () => (als.getStore()?.koniec ?? Infinity) - Date.now();

/** Czy budżet bieżącego wywołania został wyczerpany (dla narzędzi zbierających wiele odpowiedzi). */
export const budzetWyczerpany = () => Boolean(als.getStore()?.wyczerpany);

/** Owija server.registerTool raz na serwer: każdy handler biegnie we własnym budżecie. */
export function owinSerwer(server) {
  if (server.__lexBudzet) return server;
  const oryg = server.registerTool.bind(server);
  server.registerTool = (nazwa, meta, handler) =>
    oryg(nazwa, meta, (...a) => als.run({ koniec: Date.now() + BUDZET_MS, wyczerpany: false }, () => handler(...a)));
  server.__lexBudzet = true;
  return server;
}

// ── Błędy sieci (2026-10-06): „fetch failed” bez przyczyny → kod i host; ponowienie przejściowych ──
// ⛔ PO CO: undici zgłasza każdy błąd sieci jako „fetch failed”, a przyczynę (DNS, TLS, zerwane
//    połączenie) chowa w e.cause — użytkownik widział tylko „fetch failed” (CBOSA). Teraz komunikat
//    niesie kod i host. Błąd przed wysłaniem żądania ponawiamy zawsze (do 2 razy); zerwanie po
//    wysłaniu — tylko dla GET/HEAD albo żądania oznaczonego `lexPowtarzalne: true` (np. POST
//    wyszukiwarki, który niczego nie zmienia). Każda próba mieści się w budżecie wywołania.
const PRZED_WYSLANIEM = new Set(["EAI_AGAIN", "ECONNREFUSED", "ENETUNREACH", "EHOSTUNREACH", "UND_ERR_CONNECT_TIMEOUT"]);
const PRZEJSCIOWE = new Set([...PRZED_WYSLANIEM, "ECONNRESET", "ETIMEDOUT", "EPIPE", "UND_ERR_SOCKET"]);
const TLS = /CERT|SELF_SIGNED|UNABLE_TO|ERR_TLS|ERR_SSL|SSL/i;

/** Kod błędu sieci z łańcucha przyczyn (np. ECONNRESET, ENOTFOUND, UNABLE_TO_VERIFY_LEAF_SIGNATURE). */
export function kodSieci(e) {
  for (let c = e, i = 0; c && i < 5; c = c.cause, i++) {
    if (typeof c.code === "string" && c.code !== "ERR_INVALID_STATE") return c.code;
  }
  return null;
}

/** Komunikat błędu sieci zrozumiały dla użytkownika: host, kod i co to znaczy. */
export function opisBleduSieci(e, host) {
  const kod = kodSieci(e);
  const gdzie = host ? ` (${host})` : "";
  if (e?.name === "TimeoutError") return `Źródło${gdzie} nie odpowiedziało w limicie czasu.`;
  if (!kod) return `Błąd sieci${gdzie}: ${e?.cause?.message ?? e?.message ?? e}`;
  if (TLS.test(kod)) return `Błąd TLS${gdzie}: ${kod} — certyfikat serwera nie przeszedł weryfikacji (niepełny łańcuch po stronie serwera albo zapora/antywirus przechwytujący HTTPS).`;
  if (kod === "ENOTFOUND" || kod === "EAI_AGAIN") return `Błąd DNS${gdzie}: ${kod} — nie rozwiązano nazwy hosta (brak sieci albo DNS).`;
  if (kod === "ECONNREFUSED") return `Połączenie odrzucone${gdzie}: ${kod} — serwer nie przyjmuje połączeń (awaria albo zapora).`;
  if (kod === "ECONNRESET" || kod === "UND_ERR_SOCKET" || kod === "EPIPE") return `Połączenie zerwane przez serwer${gdzie}: ${kod} — przeciążenie lub przerwa techniczna źródła.`;
  if (kod === "ETIMEDOUT" || kod === "UND_ERR_CONNECT_TIMEOUT") return `Przekroczony czas połączenia${gdzie}: ${kod}.`;
  return `Błąd sieci${gdzie}: ${kod}`;
}

// ── Odpowiedź, która nie jest JSON (2026-10-06): zamiast „Unexpected token '<'” przyczyna ──
// ⛔ PO CO: sn.pl, wl-api.mf.gov.pl i inne źródła za Imperva/Cloudflare odpowiadają 200 ze stroną
//    weryfikacji przeglądarki („<html style=…”, _Incapsula_Resource) zamiast danych; konektory
//    wywołujące r.json() zgłaszały wtedy błąd parsera. Teraz json() każdej odpowiedzi mówi, co przyszło.
export class BlokadaBotow extends Error {}
const OCHRONA = /incapsula|imperva|incident_id|_Incapsula_Resource|captcha|cf-chl|challenge-platform|cloudflare/i;
/** Komunikat, gdy treść odpowiedzi nie jest JSON (host, kod HTTP i co przyszło zamiast danych). */
export function opisNieJson(tekst, status, host) {
  const t = String(tekst ?? "");
  const gdzie = host || "źródło";
  if (!t.trim()) return { blad: new Error(`${gdzie}: pusta odpowiedź zamiast danych JSON (HTTP ${status}).`) };
  if (/^\s*</.test(t) && OCHRONA.test(t)) {
    return { blad: new BlokadaBotow(`${gdzie}: ochrona przed botami — strona weryfikacji przeglądarki zamiast danych (HTTP ${status}). ` +
      "Źródło odrzuca zapytania automatyczne z tej sieci; brak danych ≠ brak w źródle — sprawdź ręcznie w wyszukiwarce źródła albo spróbuj później.") };
  }
  if (/^\s*</.test(t)) return { blad: new Error(`${gdzie}: strona HTML zamiast danych JSON (HTTP ${status}; przerwa techniczna albo zmiana API).`) };
  return { blad: new Error(`${gdzie}: odpowiedź nie jest poprawnym JSON (HTTP ${status}).`) };
}
function jsonZPrzyczyna(r, host) {
  r.json = async () => {
    const t = await r.text();
    try { return JSON.parse(t); } catch { throw opisNieJson(t, r.status, host).blad; }
  };
  return r;
}

const czekaj = (ms) => new Promise((ok) => setTimeout(ok, ms));
if (typeof globalThis.fetch === "function" && !globalThis.fetch.__lexSiec) {
  const oryg = globalThis.fetch;
  const fetchLex = async (input, init) => {
    const metoda = String(init?.method ?? input?.method ?? "GET").toUpperCase();
    let host = "";
    try { host = new URL(String(input?.url ?? input)).hostname; } catch { /* adres sprawdza fetch */ }
    for (let proba = 0; ; proba++) {
      try {
        return jsonZPrzyczyna(await oryg(input, init), host);
      } catch (e) {
        if (e?.name === "AbortError" || init?.signal?.aborted) throw e;
        const kod = kodSieci(e);
        const powtarzalne = metoda === "GET" || metoda === "HEAD" || init?.lexPowtarzalne === true;
        const zostalo = (als.getStore()?.koniec ?? Infinity) - Date.now();
        if (proba < 2 && kod && zostalo > 3000 && (PRZED_WYSLANIEM.has(kod) || (PRZEJSCIOWE.has(kod) && powtarzalne))) {
          await czekaj(400 * (proba + 1));
          continue;
        }
        throw new Error(opisBleduSieci(e, host), { cause: e });
      }
    }
  };
  fetchLex.__lexSiec = true;
  globalThis.fetch = fetchLex;
}
