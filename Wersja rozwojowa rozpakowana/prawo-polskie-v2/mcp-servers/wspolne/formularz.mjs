// formularz.mjs — formularze wyszukiwarek odczytywane z HTML (silnik Portalu Orzeczeń: Tapestry,
// orzeczenia.ms.gov.pl, portale sądów, etpcz.ms.gov.pl). Nazwy pól i akcja nie są stałe, więc
// konektor bierze je ze strony (pomiar G40B 2026-10-06: POST /searchetpc.advancedsearchform,
// pola phrase, complaintNumber, ukryte t:ac i t:formdata). Czyste funkcje, bez sieci.

const ENCJE = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export const dekoduj = (t) => String(t ?? "")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ENCJE[n.toLowerCase()] ?? m);
const ATRYBUT = (tag, nazwa) => new RegExp(`\\b${nazwa}\\s*=\\s*["']([^"']*)["']`, "i").exec(tag)?.[1];

/**
 * Wszystkie formularze strony: akcja (bezwzględna), metoda, pola ukryte i listy wyboru (wartość
 * zaznaczona albo pierwsza), pola tekstowe z opisem (nazwa, id, placeholder, title), przycisk.
 */
export function formularze(html, baza) {
  const formy = [];
  for (const [, atrForm, wnetrze] of String(html ?? "").matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    // pary: pola ukryte i wybory w kolejności dokumentu, z powtórzeniami — Tapestry ma kilka
    // ukrytych `t:formdata` (orzeczenia.ms.gov.pl: 6); z jednym portal gubił frazę (pomiar 2026-10-06).
    const pary = [];
    const tekstowe = [];
    let przycisk = null;
    for (const [tag, atrSelect, opcje] of wnetrze.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>|<(?:input|button)\b[^>]*>/gi)) {
      if (atrSelect !== undefined) {
        const nazwa = ATRYBUT(atrSelect, "name");
        if (!nazwa) continue;
        const lista = [...opcje.matchAll(/<option\b([^>]*)>/gi)].map(([, a]) => a);
        const wybrana = lista.find((a) => /\bselected\b/i.test(a)) ?? lista[0];
        pary.push([nazwa, dekoduj((wybrana && ATRYBUT(wybrana, "value")) ?? "")]);
        continue;
      }
      const nazwa = ATRYBUT(tag, "name");
      if (!nazwa) continue;
      const typ = (ATRYBUT(tag, "type") ?? (/^<button/i.test(tag) ? "submit" : "text")).toLowerCase();
      const opis = `${nazwa} ${ATRYBUT(tag, "id") ?? ""} ${ATRYBUT(tag, "placeholder") ?? ""} ${ATRYBUT(tag, "title") ?? ""}`;
      if (typ === "hidden") pary.push([nazwa, dekoduj(ATRYBUT(tag, "value") ?? "")]);
      else if (typ === "text" || typ === "search") tekstowe.push({ nazwa, opis });
      else if (typ === "submit" && !przycisk) przycisk = { nazwa, wartosc: dekoduj(ATRYBUT(tag, "value") ?? "") };
    }
    const pola = Object.fromEntries(pary);
    if (!tekstowe.length) continue;
    const akcja = new URL(dekoduj(ATRYBUT(atrForm, "action") ?? "") || baza, baza).toString();
    formy.push({ akcja, metoda: (ATRYBUT(atrForm, "method") ?? "get").toLowerCase(), pola, pary, tekstowe, przycisk });
  }
  return formy;
}

/** Dane do wysłania: pola ukryte i wybory (z powtórzeniami, w kolejności strony), pola tekstowe, przycisk. */
export function daneFormularza(forma, wartosci) {
  const dane = new URLSearchParams();
  for (const [nazwa, wartosc] of forma.pary ?? Object.entries(forma.pola ?? {})) {
    if (!(nazwa in wartosci)) dane.append(nazwa, wartosc);
  }
  for (const [nazwa, wartosc] of Object.entries(wartosci)) dane.append(nazwa, wartosc);
  if (forma.przycisk) dane.append(forma.przycisk.nazwa, forma.przycisk.wartosc);
  return dane;
}
