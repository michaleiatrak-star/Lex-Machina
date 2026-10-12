// Fixture'y: PRAWDZIWE odpowiedzi Sejm ELI z 2026-09-27 (fixtures/). AUDYT-2026-09-27o.
import { normalizujOdpowiedzELI, mapujStatusEli } from "./isap-eli-mcp-server.js";
import assert from "node:assert";
import { readFileSync } from "node:fs";
const fx = (n) => JSON.parse(readFileSync(new URL(`./fixtures/${n}.json`, import.meta.url)));
const kc = fx("eli_DU_1964_93"), tj = fx("eli_DU_2026_795"), tjStary = fx("eli_DU_2025_1071");

{ assert.match(tj.title, /jednolitego tekstu ustawy\s*[–-]\s*Kodeks cywilny/, "fixture t.j. dotyczy KC");
  const w = normalizujOdpowiedzELI([kc], "DU/1964/93", { identyfikator: "DU 2026 poz. 795", eli: "DU/2026/795" });
  assert.strictEqual(w.status, "FOUND");
  assert.strictEqual(w.result.status_obowiazywania, "tekst_jednolity_nieaktualny", "KC pierwotny NIE może być 'obowiazuje'");
  assert.strictEqual(w.result.status_eli, "akt posiada tekst jednolity");
  assert.match(w.uwaga, /Powołuj aktualny tekst jednolity: DU 2026 poz\. 795/);
  console.log("OK: KC DU/1964/93 → tekst_jednolity_nieaktualny + wskazanie aktualnego t.j."); }

{ assert.strictEqual(normalizujOdpowiedzELI([tj]).result.status_obowiazywania, "obowiazuje");
  assert.strictEqual(normalizujOdpowiedzELI([tjStary]).result.status_obowiazywania, "tekst_jednolity_nieaktualny",
    "t.j. z „wygaśnięcie aktu” = zastąpiony nowszym t.j., nie akt uchylony");
  console.log("OK: t.j. aktualny → obowiazuje; t.j. wygasły → tekst_jednolity_nieaktualny"); }

{ const m = { "obowiązujący": "obowiazuje", "akt objęty tekstem jednolitym": "tekst_jednolity_nieaktualny",
    "akt posiada tekst jednolity": "tekst_jednolity_nieaktualny", "wygaśnięcie aktu": "uchylony",
    "uznany za uchylony": "uchylony", "uchylony": "uchylony", "nieobowiązujący - uchylona podstawa prawna": "uchylony",
    "akt jednorazowy": "nieznany", "bez statusu": "nieznany" };
  for (const [k, v] of Object.entries(m)) assert.strictEqual(mapujStatusEli(k), v, k);
  console.log("OK: wszystkie 9 statusów ELI (zmierzone) → schemat 4 wartości"); }

{ const w = normalizujOdpowiedzELI(fx("eli_szukaj_kc"), "Kodeks cywilny");
  assert.strictEqual(w.status, "AMBIGUOUS");
  assert.ok(w.kandydaci.every((k) => k.tytul_lub_nazwa && k.status_obowiazywania && k.eli), "kandydat = tytuł + status + ELI");
  assert.ok(w.kandydaci.every((k) => ["obowiazuje", "uchylony", "tekst_jednolity_nieaktualny", "nieznany"].includes(k.status_obowiazywania)));
  console.log(`OK: wyszukiwanie „Kodeks cywilny” → AMBIGUOUS, ${w.kandydaci.length} kandydatów z tytułem i statusem`); }

{ assert.strictEqual(normalizujOdpowiedzELI([]).status, "NOT_FOUND");
  console.log("OK: brak pozycji → NOT_FOUND z zastrzeżeniem"); }
console.log("\nWSZYSTKIE TESTY JEDNOSTKOWE (bez sieci) PRZESZŁY");

// ── isap_tekst: wycinek PRAWDZIWEGO tekstu PDF t.j. KC (DU 2026 poz. 795, pdfjs, 2026-09-28) ─────
import { podzielObwieszczenie, artykulObowiazujacy, normalizujNumerArt } from "./isap-eli-mcp-server.js";
const wytnijArtykul = (z, n) => artykulObowiazujacy({ zalacznik: z, przypisy: {} }, n)?.tresc ?? null;
{ const t = readFileSync(new URL("./fixtures/tj_kc_2026_795_wycinek.txt", import.meta.url), "utf8");
  const o = podzielObwieszczenie(t);
  assert.strictEqual(o.stan_prawny_na, "19 maja 2026");
  assert.match(o.nie_obejmuje, /^2\. Podany w załączniku/); assert.match(o.nie_obejmuje, /Dz\. U\. poz\. 1172/);
  const a118 = wytnijArtykul(o.zalacznik, "118");
  assert.match(a118, /^Art\. 118\. Jeżeli przepis szczególny nie stanowi inaczej, termin przedawnienia wynosi sześć lat/);
  assert.match(a118, /ostatni dzień roku kalendarzowego/); assert.doesNotMatch(a118, /Art\. 119\./, "artykuł kończy się przed następnym");
  const a3851 = wytnijArtykul(o.zalacznik, "385¹");
  assert.match(a3851, /^Art\. 385\[1\]\. § 1\. Postanowienia umowy zawieranej z konsumentem/); assert.doesNotMatch(a3851, /Art\. 385\[2\]\./);
  assert.strictEqual(wytnijArtykul(o.zalacznik, "13"), null, "cytat „Art. 13.” z pkt 2 preambuły NIE jest artykułem KC");
  for (const w of ["385^1", "385(1)", "385¹", "art. 385^1"]) assert.strictEqual(normalizujNumerArt(w), "385[1]", w);
  console.log("OK: isap_tekst — stan prawny, pkt 2, cały art. 118 i 385[1], preambuła wyłączona, indeksy górne");
}

// ── Brzmienie obowiązujące wg odnośników (zapis pdf.js 4.x: „8)” sklejone z etykietą) ──────────
{ const przypisy = {
    "3": "Ze zmianą wprowadzoną przez art. 26 pkt 1 lit. a ustawy z dnia 12 lipca 2024 r. (Dz. U. poz. 1222), która wejdzie w życie z dniem 10 listopada 2024 r.",
    "8": "Obowiązuje do wejścia w życie zmiany, o której mowa w odnośniku 9.",
    "9": "Przez art. 26 pkt 3 ustawy, o której mowa w odnośniku 3.",
    "2": "W tym brzmieniu obowiązuje do wejścia w życie zmiany, o której mowa w odnośniku 4.",
    "4": "W brzmieniu ustalonym przez art. 1 pkt 1 ustawy z dnia 25 lipca 2025 r. (Dz. U. poz. 1157), która wejdzie w życie z dniem 23 września 2025 r.",
    "6": "Dodany przez art. 1 pkt 2 ustawy z dnia 1 lipca 2026 r. (Dz. U. poz. 900), która wejdzie w życie z dniem 5 listopada 2026 r." };
  const dok = { zalacznik: [
    "Art. 10. 8) 1. Zakazane jest przesyłanie niezamówionej informacji handlowej.", "2. Informację handlową uważa się za zamówioną.",
    "Art. 10. (uchylony) 9 )",
    "Art. 13. 1. W sprawach o prawa majątkowe pobiera się opłatę stałą.", "2. 2 ) W sprawach ponad 20 000 złotych nie więcej niż 200 000 złotych.",
    "2. 4 ) W sprawach ponad 20 000 złotych nie więcej niż 100 000 złotych.",
    "Art. 14. 1. Pracodawca jest obowiązany:", "1) przestrzegać przepisów;", "2) 6 ) przeciwdziałać naruszaniu godności;", "3) (uchylony)",
    "Art. 15. Dalej." ].join("\n"), przypisy };
  const a10 = artykulObowiazujacy(dok, "10", "2026-10-12");
  assert.strictEqual(a10.tresc.trim(), "Art. 10. (uchylony)", "drugi wydruk obowiązuje od 10.11.2024 (odnośnik 9 → 3)");
  assert.match(artykulObowiazujacy(dok, "10", "2024-10-01").tresc, /Zakazane jest przesyłanie/, "przed zmianą — pierwszy wydruk");
  const a13 = artykulObowiazujacy(dok, "13", "2026-10-12");
  assert.match(a13.tresc, /100 000 złotych/); assert.doesNotMatch(a13.tresc, /200 000/);
  const a14 = artykulObowiazujacy(dok, "14", "2026-10-12");
  assert.doesNotMatch(a14.tresc, /godności/, "punkt dodany, wchodzi 5.11.2026 — poza brzmieniem obowiązującym");
  assert.strictEqual(a14.brzmienia_przyszle[0].from, "2026-11-05");
  assert.deepStrictEqual(Object.keys(a14.odnosniki), ["6"]);
  console.log("OK: isap_tekst — brzmienie obowiązujące wg odnośników, punkt jeszcze nieobowiązujący, znacznik sklejony");
  console.log("\nWSZYSTKIE TESTY isap_tekst PRZESZŁY"); }
