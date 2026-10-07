// Testy offline konektorów sądowych (sn, sp, tk, etpcz) w jednym pliku (limit plików skilla, T41).
// Każda sekcja = dawny <katalog>/test_normalizacja.mjs, we własnym bloku; importy jako await import().

// ═══ sn ═══
{
  // Funkcje czyste serwera SN (bez sieci): sąd po sygnaturze, karta, linki niebędące źródłem, koperty snproxy.
  const { sadSygnatury, idKarty, urlKarty, problemLinku, rekordy, bladSn, surowyTekst, tekst, normalizujSygnature } = await import("./sn-example/sn-mcp-server.js");
  const { default: assert } = await import("node:assert");

  assert.strictEqual(normalizujSygnature("II  C.S.K.P. 89 / 26"), "II CSKP 89/26");
  assert.strictEqual(sadSygnatury("II CSKP 89/26"), "SN");
  assert.strictEqual(sadSygnatury("III OSK 1959/22"), "NSA/WSA");
  assert.strictEqual(sadSygnatury("I SA/Wa 123/20"), "NSA/WSA");
  assert.strictEqual(sadSygnatury("II Cz 12/20"), "sąd powszechny");
  assert.strictEqual(sadSygnatury("KIO 82/18"), "KIO");
  assert.strictEqual(sadSygnatury("SK 3/20"), "TK");
  console.log("OK: sąd właściwy dla sygnatury (repertoria powszechne wrażliwe na wielkość liter)");

  assert.strictEqual(idKarty("https://www.sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=ZuUySp8Bw1HnVDW6c5lg"), "ZuUySp8Bw1HnVDW6c5lg");
  assert.strictEqual(idKarty("ZuUySp8Bw1HnVDW6c5lg"), "ZuUySp8Bw1HnVDW6c5lg");
  assert.strictEqual(idKarty("II CSKP 89/26"), null);
  assert.strictEqual(urlKarty("abc123DEF456"), "https://www.sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=abc123DEF456");
  assert.deepStrictEqual(problemLinku("blob:https://www.sn.pl/aeff2f6a-34cd-4771-8941-6b7ea9295466"), { rodzaj: "BLOB" });
  assert.deepStrictEqual(problemLinku("https://www.sn.pl/sites/orzecznictwo/Orzeczenia3/II%20CSKP%2089-26.pdf"), { rodzaj: "STARY_PDF", sygnatura: "II CSKP 89/26" });
  assert.strictEqual(problemLinku("https://www.sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie=x"), null);
  console.log("OK: karta = źródło; blob: i stary katalog PDF rozpoznane");

  const rek = { id: "ZuUy", sygnatura_sprawy: "III CZP 25/11", data_wydania: "2011-10-18" };
  assert.deepStrictEqual(rekordy({ data: [{ data: [rek] }] }), [rek]);
  assert.deepStrictEqual(rekordy({ data: [{ data: { data: rek } }] }), [rek]);
  assert.deepStrictEqual(rekordy({ data: [{ data: [] }] }), []);
  assert.strictEqual(rekordy({ data: [{ cos: 1 }] }), null);
  assert.strictEqual(bladSn({ data: [{ data: { error: "timeout", debug: "x" } }] }), "timeout");
  const html = "<html><head><title>x</title></head><body><p>Sygn. akt III CZP 25/11</p><p>UCHWAŁA</p></body></html>";
  const b64 = Buffer.from(html, "utf8").toString("base64");
  assert.strictEqual(surowyTekst({ data: [{ data: { raw: b64 } }] }), b64);
  assert.strictEqual(surowyTekst({ data: [{ raw: b64 }] }), b64);
  assert.strictEqual(tekst(html), "Sygn. akt III CZP 25/11\nUCHWAŁA");
  console.log("OK: koperty snproxy (rekordy, błąd po stronie sn.pl, base64 tekstu)");

  // Parametry wyszukiwarki jak w widżecie sn.pl (q i tresc, „w dniu” = od = do) i kontrola trafień.
  const { parametrySzukania, pasujeDoFiltra } = await import("./sn-example/sn-mcp-server.js");
  assert.deepStrictEqual(parametrySzukania({ tresc: "sankcja kredytu darmowego", forma: "wyrok SN", dataWDniu: "2026-07-08", izba: "Izba Cywilna" }), {
    q: "sankcja kredytu darmowego", tresc: "sankcja kredytu darmowego", forma_orzeczenia: "wyrok SN",
    data_wydania_od: "2026-07-08", data_wydania_do: "2026-07-08", izba: "Izba Cywilna", strona: "1", rozmiar_strony: "25",
  });
  assert.deepStrictEqual(parametrySzukania({ sygnatura: "II  CSKP 89 / 26", naStrone: 10 }), { sygnatura: "II CSKP 89/26", strona: "1", rozmiar_strony: "10" });
  assert.ok(pasujeDoFiltra({ sygnatura_sprawy: "II CSKP 89/26", data_wydania: "2026-07-08", forma_orzeczenia: "wyrok SN" }, { dataOd: "2026-07-01", dataDo: "2026-07-31", forma: "wyrok SN" }));
  assert.ok(!pasujeDoFiltra({ sygnatura_sprawy: "II CSKP 89/26", data_wydania: "2026-08-08" }, { dataDo: "2026-07-31" }));
  assert.ok(!pasujeDoFiltra({ sygnatura_sprawy: "I CSKP 89/26" }, { sygnatura: "II CSKP 89/26" }));
  console.log("OK: parametry wyszukiwarki SN (treść, forma, daty, izba) i kontrola trafień");

  // Odpowiedź snproxy: JSON albo strona HTML (ochrona przed botami) — nigdy „Unexpected token '<'”.
  const { rozpoznajOdpowiedz, BlokadaSn } = await import("./sn-example/sn-mcp-server.js");
  assert.deepStrictEqual(rozpoznajOdpowiedz(200, "application/json", '{"data":[]}'), { dane: { data: [] } });
  const strona = rozpoznajOdpowiedz(200, "text/html", '<html style="height:100%"><head><META NAME="ROBOTS"></head><body><iframe src="/_Incapsula_Resource?x"></iframe></body></html>');
  assert.ok(strona.blad instanceof BlokadaSn && /ochrona przed botami/.test(strona.blad.message), strona.blad?.message);
  assert.ok(rozpoznajOdpowiedz(200, "application/json", "<html><body>Przerwa techniczna</body></html>").blad instanceof BlokadaSn);
  assert.ok(rozpoznajOdpowiedz(403, "text/html", "<html></html>").blad instanceof BlokadaSn);
  assert.ok(!(rozpoznajOdpowiedz(500, "application/json", "{}").blad instanceof BlokadaSn));
  assert.match(rozpoznajOdpowiedz(200, "application/json", "{zly").blad.message, /nie jest poprawnym JSON/);
  console.log("OK: strona HTML/ochrona przed botami rozpoznana zamiast błędu parsowania JSON");
  {
    const { sesjaUzytkownika, weryfikacjaSn } = await import("./sn-example/sn-mcp-server.js");
    // 1.5.0: bez SN_SESSION_FILE czytany jest domyślny plik sesji ~/.lex-machina/sn-session.json;
    // błąd odczytu = brak sesji. Wynik niesie też ścieżkę i źródło sesji (bez wartości ciasteczek).
    const brak = sesjaUzytkownika({}, () => { throw new Error("nie czytaj"); });
    assert.deepStrictEqual({ ciastka: brak.ciastka, ua: brak.ua, zapisana: brak.zapisana, source: brak.source },
      { ciastka: [], ua: null, zapisana: null, source: null });
    assert.match(brak.sciezka, /\.lex-machina[\\/]sn-session\.json$/);
    assert.strictEqual(sesjaUzytkownika({ SN_SESSION_FILE: "/x/s.json" }, () => { throw new Error("brak"); }).sciezka, "/x/s.json");
    const plik = JSON.stringify({ cookie: "incap_ses_1=b; zle ciastko; visid_incap_1=c", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/140.0", saved_at: "2026-10-06T10:00:00Z" });
    const s = sesjaUzytkownika({ SN_COOKIE: "incap_ses_1=a; x=1", SN_SESSION_FILE: "f" }, () => plik);
    assert.deepStrictEqual(s.ciastka, ["x=1", "incap_ses_1=b", "visid_incap_1=c"]);
    assert.strictEqual(s.ua, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/140.0");
    assert.strictEqual(sesjaUzytkownika({ SN_SESSION_FILE: "f" }, () => "{zly json").ciastka.length, 0);
    const w = weryfikacjaSn(s);
    assert.strictEqual(w.wymagana, true);
    assert.strictEqual(w.sesja_zapisana, true);
    assert.ok(!JSON.stringify(w).includes("incap_ses_1=b"), "wartości ciasteczek nie trafiają do odpowiedzi");
    assert.strictEqual(weryfikacjaSn(brak).sesja_zapisana, false);
    console.log("OK: sesja z weryfikacji użytkownika (plik + SN_COOKIE, bez ujawniania wartości) i opis weryfikacji");
  }
  {
    // sn-captcha-auto.mjs (1.5.0) — funkcje czyste i ścieżka bez Playwrighta; bez sieci.
    const { autoWlaczone, sciezkaSesji, wykryjChallenge, zapiszSesjePlik, recznieDozwolone, SONDY, rozwiazAutomatycznie } =
      await import("./sn-example/sn-captcha-auto.mjs");
    const { mkdtempSync, readFileSync: czytaj, rmSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    for (const v of ["1", "true", "YES", "on"]) assert.strictEqual(autoWlaczone({ SN_CAPTCHA_AUTO: v }), true);
    for (const v of [undefined, "", "0", "nie"]) assert.strictEqual(autoWlaczone({ SN_CAPTCHA_AUTO: v }), false);
    assert.strictEqual(sciezkaSesji({ SN_SESSION_FILE: "/a/b.json" }), "/a/b.json");
    assert.match(sciezkaSesji({}), /\.lex-machina[\\/]sn-session\.json$/);
    assert.strictEqual(recznieDozwolone({}), true);
    assert.strictEqual(recznieDozwolone({ SN_CAPTCHA_RECZNIE: "0" }), false);
    assert.deepStrictEqual(SONDY.map((u) => u.split("?")[0]), ["/pl/index.php", "/index.php"]);
    assert.ok(SONDY.every((u) => /plugin=snproxy/.test(u) && /III%20CZP%2025%2F11/.test(u)));
    assert.strictEqual(wykryjChallenge('<script src="/_Incapsula_Resource?x"></script>').kind, "incapsula_js");
    const rc = wykryjChallenge('<div class="g-recaptcha" data-sitekey="KLUCZ123"></div>');
    assert.deepStrictEqual([rc.kind, rc.sitekey], ["recaptcha", "KLUCZ123"]);
    assert.strictEqual(wykryjChallenge("<html></html>").kind, "unknown");
    const kat = mkdtempSync(join(tmpdir(), "sn-sesja-"));
    const env = { SN_SESSION_FILE: join(kat, "s.json") };
    const z = zapiszSesjePlik({ cookie: "incap_ses_1=TAJNE; visid_incap_1=c", source: "test" }, env);
    assert.deepStrictEqual([z.cookies_count, z.names], [2, ["incap_ses_1", "visid_incap_1"]]);
    assert.ok(!JSON.stringify(z).includes("TAJNE"), "wartości ciasteczek nie trafiają do wyniku");
    assert.strictEqual(JSON.parse(czytaj(env.SN_SESSION_FILE, "utf8")).source, "test");
    assert.throws(() => zapiszSesjePlik({ cookie: "bez-znaku-rownosci" }, env), /nieprawidłowy/);
    const bezPliku = {}; const kat2 = join(kat, "dom");
    zapiszSesjePlik({ cookie: "a=1" }, { ...bezPliku, SN_SESSION_FILE: join(kat2, "s.json") });
    assert.deepStrictEqual(bezPliku, {}, "zapis sesji nie zmienia przekazanego env");
    if (process.platform !== "win32") {
      const { statSync } = await import("node:fs");
      assert.strictEqual(statSync(join(kat2, "s.json")).mode & 0o077, 0, "plik sesji tylko dla właściciela");
    }
    // Bez Playwrighta i bez okna: jawny wynik, żadnych usług zewnętrznych, żadnego wyjątku.
    let maPlaywright = true; try { await import("playwright"); } catch { maPlaywright = false; }
    if (!maPlaywright) {
      const r = await rozwiazAutomatycznie("", undefined, { SN_CAPTCHA_RECZNIE: "0" });
      assert.strictEqual(r.ok, false);
      assert.match(r.uwaga, /Brak playwright/);
      assert.ok(!JSON.stringify(r).includes("2captcha"));
    }
    rmSync(kat, { recursive: true, force: true });
    console.log("OK: weryfikacja sn.pl — przełączniki, sondy snproxy, ścieżka sesji w ~/.lex-machina, zapis 0600 bez zmiany env, brak Playwrighta jawnie");
  }
}

// ═══ sp ═══
{
  // Funkcje czyste konektora sp (bez sieci): Tapestry, portal sądu, id dokumentu, strona wyników.
  const { kodujTapestry, hostPortalu, dozwolonyHost, urlSzukania, urlOrzeczenia, rozbierzDocId, tasamaSygnatura, parsujWyniki, tekst } = await import("./sp-example/sp-mcp-server.js");
  const { default: assert } = await import("node:assert");

  assert.strictEqual(kodujTapestry("I  C 100 / 15"), "I$0020C$0020100$002f15");
  assert.strictEqual(urlSzukania("https://orzeczenia.ms.gov.pl", "I C 100/15"),
    "https://orzeczenia.ms.gov.pl/search/advanced/$N/I$0020C$0020100$002f15/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/1");
  assert.strictEqual(hostPortalu(), "https://orzeczenia.ms.gov.pl");
  assert.strictEqual(hostPortalu("poznan.so"), "https://orzeczenia.poznan.so.gov.pl");
  assert.strictEqual(hostPortalu("orzeczenia.warszawa.sa.gov.pl"), "https://orzeczenia.warszawa.sa.gov.pl");
  assert.throws(() => hostPortalu("evil.com"));
  assert.ok(dozwolonyHost("https://orzeczenia.krakow.sr.gov.pl/content/$N/1"));
  assert.ok(!dozwolonyHost("https://orzeczenia.evil.pl/content/$N/1"));
  console.log("OK: kontekst Tapestry i portale sądów");

  const id = "155000000001006_I_C_000100_2015_Uz_2015-06-18_001";
  assert.deepStrictEqual(rozbierzDocId(id), { docId: id, kodSadu: "155000000001006", sygnatura: "I C 100/15", rodzaj: "uzasadnienie", data: "2015-06-18" });
  assert.deepStrictEqual(rozbierzDocId("abc"), { docId: "abc" });
  assert.ok(tasamaSygnatura("I C 100/15", "I C 100/2015"));
  assert.ok(!tasamaSygnatura("I C 100/15", "II C 100/15"));
  assert.strictEqual(urlOrzeczenia("https://orzeczenia.ms.gov.pl", id), `https://orzeczenia.ms.gov.pl/content/$N/${id}`);
  console.log("OK: id dokumentu → sygnatura, rodzaj, data; stały link do orzeczenia");

  const html = `<div><span class="big_number">2</span> <a href="/details/$N/${id}">I C 100/15</a>
  <a href="/details/$N/${id}">x</a> <a href="/details/$N/155010000000503_I_C_000100_2015_Uz_2016-01-02_001">y</a></div>`;
  assert.deepStrictEqual(parsujWyniki(html), { liczba: 2, docIds: [id, "155010000000503_I_C_000100_2015_Uz_2016-01-02_001"], sady: {} });
  // Wyszukiwanie frazą: kontekst w linku to zakodowana fraza (nie $N), nazwa sądu stoi przed linkiem (pomiar na żywo 2026-10-06).
  const frazaHtml = `<div class="big_number">52 357</div><table class="result-list"><tbody>
    <tr><td class="title"><div class="single_result"><div class="title"><h4><a href="/details/zado$015b$0107uczynienie/152510000004021_VIII_Pa_000045_2022_Uz_2022-07-25_001">VIII Pa 45/22</a></h4>
    <p>wyrok</p><p>Sąd Okręgowy w Łodzi</p><p>Data orzeczenia: 2022-07-25</p><p>Data publikacji: 2022-10-07</p></div></div></td></tr></tbody></table>`;
  const wf = parsujWyniki(frazaHtml);
  assert.strictEqual(wf.liczba, 52357);
  assert.deepStrictEqual(wf.docIds, ["152510000004021_VIII_Pa_000045_2022_Uz_2022-07-25_001"]);
  assert.strictEqual(wf.sady["152510000004021_VIII_Pa_000045_2022_Uz_2022-07-25_001"], "Sąd Okręgowy w Łodzi");
  assert.deepStrictEqual(parsujWyniki("<p>Nie znaleziono żadnego wyniku pasującego do zapytania</p>"), { liczba: 0, docIds: [], sady: {} });
  assert.strictEqual(tekst("<html><head><title>x</title></head><body><p>Sygn. akt I C 100/15</p><p>WYROK</p></body></html>"), "Sygn. akt I C 100/15\nWYROK");
  console.log("OK: strona wyników (liczba, id bez powtórzeń, brak trafień)");

  // Fraza w kontekście Tapestry (polskie znaki jako $XXXX) i kontrola, że treść zawiera frazę.
  {
    // 6.202: wskazany portal sądu zawęża wynik zastępczy SAOS (nazwa sądu ↔ kod portalu).
    const { pasujeDoSadu } = await import("./sp-example/sp-mcp-server.js");
    assert.strictEqual(pasujeDoSadu("Sąd Okręgowy w Poznaniu", "poznan.so"), true);
    assert.strictEqual(pasujeDoSadu("Sąd Rejonowy Poznań-Grunwald i Jeżyce w Poznaniu", "poznan.so"), false, "rodzaj sądu musi się zgadzać");
    assert.strictEqual(pasujeDoSadu("Sąd Okręgowy w Słupsku", "poznan.so"), false);
    assert.strictEqual(pasujeDoSadu("Sąd Apelacyjny w Łodzi", "lodz.sa"), true);
    assert.strictEqual(pasujeDoSadu("Sąd Okręgowy we Wrocławiu", "orzeczenia.wroclaw.so.gov.pl"), true);
    assert.strictEqual(pasujeDoSadu("Sąd Okręgowy w Poznaniu", "zly-kod"), false);
    console.log("OK: SP — wskazany sąd zawęża wynik zastępczy SAOS (rodzaj + miasto, bez diakrytyków)");
  }
  const { urlSzukaniaFrazy, zawieraFraze } = await import("./sp-example/sp-mcp-server.js");
  assert.strictEqual(kodujTapestry("kredyt ą"), "kredyt$0020$0105");
  assert.strictEqual(urlSzukaniaFrazy("https://orzeczenia.ms.gov.pl", "sankcja kredytu"),
    "https://orzeczenia.ms.gov.pl/search/advanced/sankcja$0020kredytu/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/1");
  assert.ok(zawieraFraze("Sąd uznał, że sankcja kredytu darmowego przysługuje", "sankcji kredytu darmowego"));
  assert.ok(!zawieraFraze("Sprawa o zapłatę z umowy najmu", "sankcja kredytu darmowego"));
  console.log("OK: fraza w Portalu Orzeczeń (kodowanie Tapestry, kontrola treści)");

  // Nazwa sądu z listy wyników (rozróżnia te same sygnatury w różnych sądach); brak nazwy = brak pola.
  const { parsujWyniki: parsuj } = await import("./sp-example/sp-mcp-server.js");
  const lista = `<div class="big_number">2</div><ul>
  <li><h4><a href="/details/$N/151025200001006_II_K_001350_2018_Uz_2019-11-05_002">II K 1350/18 - uzasadnienie Sąd Rejonowy w Bytomiu z 2019-11-05</a></h4></li>
  <li><h4><a href="/details/$N/152505100001006_II_K_001350_2018_Uz_2019-06-10_002">II K 1350/18 - uzasadnienie</a></h4><p>Sąd Rejonowy w Rybniku</p><p>z 2019-06-10</p></li>
  <li><a href="/details/$N/159999999999999_I_C_000001_2020_Uz_2020-01-01_001">I C 1/20</a></li></ul>`;
  const wynik = parsuj(lista);
  assert.strictEqual(wynik.liczba, 2);
  assert.strictEqual(wynik.sady["151025200001006_II_K_001350_2018_Uz_2019-11-05_002"], "Sąd Rejonowy w Bytomiu");
  assert.strictEqual(wynik.sady["152505100001006_II_K_001350_2018_Uz_2019-06-10_002"], "Sąd Rejonowy w Rybniku");
  assert.strictEqual(wynik.sady["159999999999999_I_C_000001_2020_Uz_2020-01-01_001"], undefined);
  console.log("OK: nazwa sądu przy pozycji listy wyników (gdy portal ją podaje)");
  {
    const { formularzFrazy, pozycjaSaos } = await import("./sp-example/sp-mcp-server.js");
    const { formularze, daneFormularza } = await import("./wspolne/formularz.mjs");
    const html = `<form action="/search.searchform" method="post"><input type="hidden" name="t:formdata" value="F"/>
      <input type="text" name="signature" title="Sygnatura"/><input type="text" name="phrase" title="Fraza"/><input type="submit" name="s" value="Szukaj"/></form>`;
    const f = formularzFrazy(html, "https://orzeczenia.ms.gov.pl/");
    assert.strictEqual(f.poleFrazy, "phrase");
    assert.strictEqual(f.akcja, "https://orzeczenia.ms.gov.pl/search.searchform");
    // Silnik Tapestry ma kilka ukrytych pól o tej samej nazwie (t:formdata) — muszą przetrwać wysłanie.
    const wielo = formularze('<form action="/s" method="post"><input type="hidden" name="t:formdata" value="A"/><input type="hidden" name="t:formdata" value="B"/><input type="text" name="phrase"/><input type="submit" name="go" value="Szukaj"/></form>', "https://x/")[0];
    assert.deepStrictEqual(daneFormularza(wielo, { phrase: "kot" }).getAll("t:formdata"), ["A", "B"]);
    assert.strictEqual(formularzFrazy("<form><input name='signature'/></form>", "https://orzeczenia.ms.gov.pl/"), null);
    const p = pozycjaSaos({ id: 7, judgmentDate: "2026-09-07", judgmentType: "REASONS", division: { court: { name: "Sąd Okręgowy w Poznaniu" } },
      courtCases: [{ caseNumber: "XII C 12/25" }] }, "https://example.com/x");
    assert.deepStrictEqual(p, { sygnatura: "XII C 12/25", data: "2026-09-07", sad: "Sąd Okręgowy w Poznaniu", rodzaj: "uzasadnienie",
      url_orzeczenia: null, url_saos: "https://www.saos.org.pl/judgments/7" });
    assert.strictEqual(pozycjaSaos({ id: 8, judgmentType: "SENTENCE", courtCases: [] }, "https://orzeczenia.ms.gov.pl/content/$N/1").url_orzeczenia, "https://orzeczenia.ms.gov.pl/content/$N/1");
    console.log("OK: formularz frazy portalu i pozycja SAOS (sygnatura, rodzaj po polsku, link SAOS)");
  }
}

// ═══ tk ═══
{
  // Funkcje czyste konektora tk (bez sieci).
  const { toSygnaturaTk, dozwolonyHost, zawieraSygnature, normalizujSygnature } = await import("./tk-example/tk-mcp-server.js");
  const { default: assert } = await import("node:assert");

  assert.strictEqual(normalizujSygnature("K  33 / 07"), "K 33/07");
  assert.ok(toSygnaturaTk("K 33/07") && toSygnaturaTk("SK 3/20") && toSygnaturaTk("Kp 1/09"));
  assert.ok(!toSygnaturaTk("I C 100/15") && !toSygnaturaTk("II CSKP 89/26"));
  assert.ok(dozwolonyHost("https://ipo.trybunal.gov.pl/ipo/Sprawa?cid=1&dokument=123&sprawa=456"));
  assert.ok(!dozwolonyHost("https://example.com/ipo"));
  assert.ok(zawieraSygnature("Wyrok z dnia 3 lipca 2008 r. Sygn. akt K. 33/07", "K 33/07"));
  assert.ok(zawieraSygnature("sygn. K 33/2007", "K 33/07"));
  assert.ok(!zawieraSygnature("Sygn. akt SK 33/07", "K 33/07"));
  assert.ok(!zawieraSygnature("Sygn. akt K 333/07", "K 33/07"));
  console.log("OK: sygnatury TK, hosty IPO/OTK ZU, kontrola tożsamości dokumentu");

  // Formularz JSF wyszukiwarki IPO: pola odczytywane z HTML (nazwy nie są stałe).
  const { formularzIpo, wynikiIpo } = await import("./tk-example/tk-mcp-server.js");
  const strona = `<html><body><form id="wyszukiwanie" name="wyszukiwanie" method="post" action="/ipo/Szukaj?cid=1">
  <input type="hidden" name="wyszukiwanie" value="wyszukiwanie" />
  <input id="wyszukiwanie:sygnatura" name="wyszukiwanie:sygnatura" type="text" value="" />
  <input id="wyszukiwanie:fraza" name="wyszukiwanie:fraza" type="text" value="" />
  <button id="wyszukiwanie:j_idt42" name="wyszukiwanie:j_idt42" type="submit"><span class="ui-button-text">Szukaj</span></button>
  <input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="-123:456&amp;x" />
  </form></body></html>`;
  assert.deepStrictEqual(formularzIpo(strona), {
    akcja: "https://ipo.trybunal.gov.pl/ipo/Szukaj?cid=1",
    pola: { wyszukiwanie: "wyszukiwanie", "javax.faces.ViewState": "-123:456&x" },
    poleSygnatury: "wyszukiwanie:sygnatura",
    przycisk: "wyszukiwanie:j_idt42",
  });
  assert.strictEqual(formularzIpo("<form><input name='x' type='text'></form>"), null);
  const wyniki = `<table><tr><td><a href="/ipo/Sprawa?cid=1&amp;dokument=4519&amp;sprawa=4796">K 33/07</a></td><td>Wyrok</td></tr>
  <tr><td><a href="/ipo/Sprawa?cid=1&amp;dokument=9999&amp;sprawa=1">SK 33/07</a></td></tr></table>`;
  assert.deepStrictEqual(wynikiIpo(wyniki, "K 33/07"), ["https://ipo.trybunal.gov.pl/ipo/Sprawa?cid=1&dokument=4519&sprawa=4796"]);
  console.log("OK: formularz JSF IPO (ViewState, pole sygnatury, przycisk Szukaj) i wyniki przy pytanej sygnaturze");

  // Źródła urzędowe bez SAOS: karta sprawy IPO (GET po sygnaturze) i pozycje OTK ZU.
  const { urlSprawyIpo, dokumentyIpo, formularzSygnatury, wynikiOtkzu } = await import("./tk-example/tk-mcp-server.js");
  assert.strictEqual(urlSprawyIpo("K 28/05"), "https://ipo.trybunal.gov.pl/ipo/view/sprawa.xhtml?pokaz=dokumenty&sygnatura=K+28%2F05");
  assert.strictEqual(urlSprawyIpo("P  21 / 19"), "https://ipo.trybunal.gov.pl/ipo/view/sprawa.xhtml?pokaz=dokumenty&sygnatura=P+21%2F19");
  const karta = `<h1>Sprawa P 21/19</h1><ul><li><a href="/ipo/Sprawa?cid=1&amp;dokument=20359&amp;sprawa=22412">Wyrok z dnia 1 lipca 2020</a></li>
  <li><a href="/ipo/view/sprawa.xhtml?pokaz=dokumenty">Dokumenty</a></li><li><a href="https://example.com/dokument">obcy</a></li></ul>`;
  assert.deepStrictEqual(dokumentyIpo(karta), [{ tytul: "Wyrok z dnia 1 lipca 2020", url: "https://ipo.trybunal.gov.pl/ipo/Sprawa?cid=1&dokument=20359&sprawa=22412" }]);
  {
    // Układ karty IPO od 2026 (pomiar 6.202, K 33/07): zakładki dok_N z pełnym tekstem i plikiem .doc; brak `dokument=`.
    const { zakladkiIpo } = await import("./tk-example/tk-mcp-server.js");
    const u = "https://ipo.trybunal.gov.pl/ipo/view/sprawa.xhtml?pokaz=dokumenty&sygnatura=K+33%2F07";
    const nowa = `<form><ul><li><a href="#sprawaForm:tabView:dok_506" tabindex="-1">Wyrok z dnia 11 grudnia 2008</a></li>
      <li><a href="#sprawaForm:tabView:dok_505" tabindex="-1">Postanowienie inne z dnia 12 grudnia 2007</a></li></ul>
      <div id="sprawaForm:tabView:dok_506" class="ui-tabs-panel"><p>Wyrok w sprawie K 33/07: Trybunał orzekł…</p>
      <a id="sprawaForm:tabView:pobierzDoc506" href="/ipo/downloadOrzeczenieDoc?dok=22649">Pobierz</a></div>
      <div id="sprawaForm:tabView:dok_505" class="ui-tabs-panel"><p>Postanowienie, sygn. K 33/07.</p>
      <a href="/ipo/downloadOrzeczenieDoc?dok=20195">Pobierz</a></div></form><div>Twoja sesja wygasła</div>`;
    const z = zakladkiIpo(nowa, u);
    assert.deepStrictEqual(z.map(({ tresc, ...d }) => d), [
      { zakladka: "506", tytul: "Wyrok z dnia 11 grudnia 2008", url: `${u}#dok_506`, url_doc: "https://ipo.trybunal.gov.pl/ipo/downloadOrzeczenieDoc?dok=22649" },
      { zakladka: "505", tytul: "Postanowienie inne z dnia 12 grudnia 2007", url: `${u}#dok_505`, url_doc: "https://ipo.trybunal.gov.pl/ipo/downloadOrzeczenieDoc?dok=20195" }]);
    assert.match(z[0].tresc, /Trybunał orzekł/);
    assert.ok(!/sesja wygasła/.test(z[1].tresc), "panel ostatniego dokumentu nie wchodzi w stopkę strony");
    assert.strictEqual(dokumentyIpo(nowa, u)[0].url, `${u}#dok_506`);
    console.log("OK: karta IPO 2026 — zakładki dokumentów (tytuł, pełny tekst, plik .doc), bez stopki strony");
  }
  assert.deepStrictEqual(formularzSygnatury(`<form action="/Wyszukiwanie" method="get"><input name="Sygnatura" type="text"><input name="MiejscePublikacji" type="text"><button type="submit" name="szukaj" value="1">Szukaj</button></form>`),
    { akcja: "https://otkzu.trybunal.gov.pl/Wyszukiwanie", metoda: "get", pola: {}, poleSygnatury: "Sygnatura", przycisk: { nazwa: "szukaj", wartosc: "1" } });
  assert.strictEqual(formularzSygnatury("<form><input name='fraza'></form>"), null);
  const lista = `<table><tr><td><a href="/2020/A/43">OTK ZU A/2020, poz. 43</a></td><td>Wyrok (P 21/19)</td></tr>
  <tr><td><a href="/2021/A/1">OTK ZU A/2021, poz. 1</a></td><td>Wyrok (SK 21/19)</td></tr></table>`;
  assert.deepStrictEqual(wynikiOtkzu(lista, "P 21/19"), ["https://otkzu.trybunal.gov.pl/2020/A/43"]);
  console.log("OK: karta sprawy IPO po sygnaturze, dokumenty sprawy, formularz i wyniki OTK ZU");
  {
    const { postacSygnaturyTk, toSygnaturaTk: tk } = await import("./tk-example/tk-mcp-server.js");
    assert.ok(postacSygnaturyTk("OK 291/09") && !tk("OK 291/09"), "repertorium spoza listy: pytamy źródła TK");
    assert.ok(!postacSygnaturyTk("II OSK 1/20") && !postacSygnaturyTk("I C 100/15 x"));
    console.log("OK: sygnatura w postaci TK spoza listy repertoriów idzie do źródeł urzędowych");
  }
}

// ═══ etpcz ═══
{
  // Funkcje czyste konektora etpcz (bez sieci).
  const { numerSkargi, kluczSkargi, rozbierzDocId, docIdZ, dozwolonyHost, formularzWyszukiwarki, parsujWyniki, urlTresci } = await import("./etpcz-example/etpcz-mcp-server.js");
  const { default: assert } = await import("node:assert");

  assert.deepStrictEqual(numerSkargi("43447 / 19"), { nr: "43447", rr: "19" });
  assert.deepStrictEqual(numerSkargi("skarga nr 34503/1997"), { nr: "34503", rr: "97" });
  assert.strictEqual(numerSkargi("art. 6"), null);
  assert.strictEqual(kluczSkargi({ nr: "43447", rr: "19" }), "ETPC_043447_2019");
  assert.strictEqual(kluczSkargi({ nr: "34503", rr: "97" }), "ETPC_034503_2097");
  const id = "990000000000001_I_ETPC_043447_2019_Wy_2021-07-22_001";
  assert.deepStrictEqual(rozbierzDocId(id), { docId: id, numer_skargi: "43447/19", rodzaj: "wyrok", data: "2021-07-22" });
  assert.deepStrictEqual(rozbierzDocId("990000000000001_I_ETPC_034503_2097_Wy_2008-11-12_001").numer_skargi, "34503/97");
  assert.strictEqual(docIdZ(`https://etpcz.ms.gov.pl/detailsetpc/$N/${id}`), id);
  assert.strictEqual(docIdZ(id), id);
  assert.strictEqual(docIdZ("https://example.com/x"), null);
  assert.strictEqual(urlTresci(id), `https://etpcz.ms.gov.pl/etpccontent/$N/${id}`);
  assert.ok(dozwolonyHost("https://etpcz.ms.gov.pl/etpccontent/$N/x") && !dozwolonyHost("https://orzeczenia.ms.gov.pl/"));
  console.log("OK: numer skargi ↔ id dokumentu (rok 20RR), stałe linki, host");

  const strona = `<form action="/search.form" method="post"><input type="hidden" name="t:formdata" value="abc&amp;d"/>
  <input type="text" name="phrase" id="phrase" placeholder="Szukaj w treści"/><input type="text" name="applicationNumber" id="nrSkargi"/>
  <input type="submit" name="submit" value="Szukaj"/></form><form action="/login"><input type="password" name="p"/></form>`;
  assert.deepStrictEqual(formularzWyszukiwarki(strona), {
    akcja: "https://etpcz.ms.gov.pl/search.form", metoda: "post", pola: { "t:formdata": "abc&d" }, pary: [["t:formdata", "abc&d"]],
    poleNumeru: "applicationNumber", poleFrazy: "phrase", przycisk: { nazwa: "submit", wartosc: "Szukaj" }, pola_tekstowe: ["phrase", "applicationNumber"],
  });
  assert.strictEqual(formularzWyszukiwarki("<form><input type='password' name='p'></form>"), null);
  const wyniki = `<span class="big_number">2</span><a href="/detailsetpc/$N/${id}">43447/19</a><a href="/etpccontent/$N/${id}">treść</a>
  <a href="/detailsetpc/$N/990000000000001_I_ETPC_000001_2019_De_2020-01-01_001">1/19</a>`;
  assert.deepStrictEqual(parsujWyniki(wyniki), { liczba: 2, docIds: [id, "990000000000001_I_ETPC_000001_2019_De_2020-01-01_001"] });
  assert.deepStrictEqual(parsujWyniki("<p>Nie znaleziono żadnego wyniku</p>"), { liczba: 0, docIds: [] });
  // Prawdziwy formularz etpcz.ms.gov.pl (G40B 2026-10-06): complaintNumber, nie complainant (skarżący).
  const prawdziwy = `<form onsubmit="javascript:return Tapestry.waitForPage(event);" action="/searchetpc.advancedsearchform" method="post" id="advancedSearchForm">
<input value="$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/1" name="t:ac" type="hidden"><input value="22oQ:H4sI" name="t:formdata" type="hidden">
<input autocomplete="off" id="complainant" name="complainant" type="text"><input autocomplete="off" id="complaintNumber" name="complaintNumber" type="text">
<input id="conventionArticle" name="conventionArticle" type="text"><input id="conventionProtocolArticle" name="conventionProtocolArticle" type="text">
<input autocomplete="off" id="phrase" name="phrase" type="text">
<select class="courtSelect" id="type" name="type"><option value="">wszystkie</option><option value="Wy">wyrok</option></select>
<select class="courtSelect" id="sentenceYear" name="sentenceYear"><option value="">---</option><option value="2021" selected="selected">2021</option></select>
<select class="courtSelect" id="complaintCountry" name="complaintCountry"><option value="">---</option></select>
<input value="Szukaj" class="searchSubmit" id="advancedSearchFormSubmit" name="advancedSearchFormSubmit" type="submit"></form>`;
  const f = formularzWyszukiwarki(prawdziwy, "https://etpcz.ms.gov.pl/");
  assert.strictEqual(f.akcja, "https://etpcz.ms.gov.pl/searchetpc.advancedsearchform");
  assert.strictEqual(f.metoda, "post");
  assert.strictEqual(f.poleNumeru, "complaintNumber");
  assert.strictEqual(f.poleFrazy, "phrase");
  assert.deepStrictEqual(f.pola, { "t:ac": "$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/1", "t:formdata": "22oQ:H4sI", type: "", sentenceYear: "2021", complaintCountry: "" });
  assert.deepStrictEqual(f.przycisk, { nazwa: "advancedSearchFormSubmit", wartosc: "Szukaj" });
  console.log("OK: formularz wyszukiwarki (pole numeru skargi i frazy) i strona wyników; prawdziwy formularz etpcz.ms.gov.pl");
}
