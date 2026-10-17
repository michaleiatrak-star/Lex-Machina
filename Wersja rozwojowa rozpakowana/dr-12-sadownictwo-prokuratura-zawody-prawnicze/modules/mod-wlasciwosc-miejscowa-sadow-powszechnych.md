# mod-WMS — Sąd właściwy miejscowo: siedziby i obszary sądów powszechnych

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
**Źródło weryfikacji:** rozporządzenie Ministra Sprawiedliwości z 28.12.2018 r. w sprawie ustalenia siedzib i obszarów właściwości sądów apelacyjnych, sądów okręgowych i sądów rejonowych oraz zakresu rozpoznawanych przez nie spraw — **t.j. Dz.U. 2026 poz. 492** (obwieszczenie z 2.04.2026, ogł. 9.04.2026; obejmuje zm. Dz.U. 2025 poz. 1012, 1607 i 2026 poz. 392; brak zmian po t.j.) ✅ [VER] RZĄD 1 2026-10-17 (ELI DU/2018/2548 `/references`, text.pdf t.j. i trzech zmian odczytane). Podstawa: art. 20 pkt 1 Prawa o ustroju sądów powszechnych (→ DR-01/`mod-USP-ustroj-sadow-powszechnych`).
**Przepisy KPC powołane w module:** art. 17, 27 § 1, 34 § 1, 35, 37 i 38 § 1 — brzmienie odczytane z t.j. Dz.U. 2026 poz. 468 ✅ [VER] RZĄD 1 2026-10-17 (ELI DU/2026/468 text.pdf); zmiany po t.j. (ELI DU/1964/296 `/references`: 2026/26, 473, 830, 1003, 1046, 1296) sprawdzaj przed cytowaniem w piśmie.
**Konsumenci:** pisma-procesowe-v3, pisma-proste-v2, analiza-sadowa-v6, DR-02, DR-03, DR-04 (właściwość sądu w piśmie).

```
⛔ Sądu, jego siedziby ani adresu NIE podawaj z pamięci ani z samej nazwy miasta.
⛔ 9 miast ma kilka sądów rejonowych: Warszawa (7), Kraków (4), Poznań (3), Wrocław (3),
   Łódź, Gdańsk, Katowice, Lublin, Szczecin (po 2). Bez numeru budynku sądu nie wybieraj.
⛔ Warstwa sądów PRG (GUGiK) jest częściowo nieaktualna wobec t.j. 2026/492 — rozstrzyga akt.
✅ Właściwość rzeczowa (SR/SO, art. 17 KPC) i podstawa właściwości miejscowej (art. 27 i n. KPC)
   — ustal i nazwij sam; ten moduł daje SĄD dla MIEJSCA.
```

## 1. Aplikacja Lex Machina — mechanizm (obowiązkowy, gdy dostępny)

| Krok | Działanie |
|---|---|
| WMS-1 | Ustal, czyj adres wyznacza właściwość: pozwany — art. 27 § 1 KPC; umowa — miejsce wykonania, art. 34 § 1 KPC; czyn niedozwolony — miejsce zdarzenia, art. 35 KPC; najem/dzierżawa nieruchomości — art. 37 KPC; prawa rzeczowe na nieruchomości — art. 38 § 1 KPC (położenie nieruchomości) |
| WMS-2 | Wywołaj `court_for_address` z aliasem adresu z materiału (`[PII:ADDRESS:…]`, `[LMPII:D01:ADDRESS:…]`) i `basis` (np. „pozwany, art. 27 § 1 KPC”); `kind` dla sprawy innej niż cywilna (gospodarcze, pracy, ksiegi_wieczyste…) |
| WMS-3 | `FOUND` → sąd, siedziba i adres dokładnie z wyniku; `NEAR_BOUNDARY` / `ADDRESS_*` → `[Sąd do ustalenia: …]` z kandydatami i brakiem (istniejący numer budynku); nie wybieraj |
| WMS-4 | `kind.heard = false` → sąd rejonowy nie rozpoznaje tej kategorii (§ 3); wskaż sąd okręgu z listy `alternatives` i zaznacz, że wydział trzeba potwierdzić |
| WMS-5 | Sprawa w toku: blok **SĄD SPRAWY** (sąd, wydział, sygnatura z akt albo sąd pierwszego pisma) — kolejne pisma do niego; nowe postępowanie → ponownie WMS-1 |

Aplikacja odtwarza adres lokalnie (model go nie zna), pyta geokoder GUGiK, rozstrzyga gminę wg § 3 aktu, dzielnice Warszawy i delegatury Krakowa/Łodzi wg ewidencji (ULDK), pozostałe miasta dzielone wg obszarów PRG z kontrolą 30 m od granicy. Pismo z sądem spoza narzędzia i spoza akt dostaje adnotację `[SĄD DO SPRAWDZENIA: …]`.

## 2. Bez aplikacji (claude.ai) — tabela z aktu

`view dr-12-sadownictwo-prokuratura-zawody-prawnicze/references/wlasciwosc-sadow-tj-2026-492.tsv` — 319 SR: SO, SA, obszar (brzmienie § 3), zakres spraw, siedziba (MS, lipiec 2026).

| Sytuacja | Postępowanie |
|---|---|
| Miejscowość = miasto/gmina z kolumny obszaru jednego SR | ten SR; SO i SA z wiersza |
| Wieś | ustal gminę (TERYT) — dopiero gmina wskazuje SR; brak pewności → pytanie do użytkownika |
| Miasto dzielone | Warszawa, Kraków, Łódź, Poznań, Wrocław — dzielnica (Kraków, Łódź, Poznań, Wrocław: „tradycyjne” dzielnice z § 3); Gdańsk — jednostka pomocnicza; Katowice, Lublin, Szczecin — granica opisana ulicami/rzeką/koleją w § 3 → bez rozstrzygnięcia przez użytkownika: `[Sąd do ustalenia]` |
| Kategoria spoza zakresu SR | kolumna `zakres_spraw`; inny SR tego samego SO z daną kategorią — wydział potwierdź (BIP sądu) |

## 3. Kontrola PRG (stan 2026-10-17)

Obszary sądów w PRG (GUGiK, wersja 12.08.2025) niezgodne z t.j. 2026/492: Czeladź, Wojkowice, Bobrowniki (SR w Czeladzi; PRG: Będzin), powiat grójecki (SR w Grójcu; PRG: Radom), Darłowo, Malechowo (SR w Sławnie; PRG: Koszalin), Łagów (SR w Kielcach), Jabłoń, Podedwórze (SR w Radzyniu Podlaskim), Bobolice (SR w Koszalinie). Kontrola: `app/courts/check_court_base_prg.py` (repozytorium aplikacji).

## 4. Quality gate

- [ ] Sąd z WMS-2 albo z bloku SĄD SPRAWY (nie z pamięci)
- [ ] Podstawa właściwości miejscowej nazwana (art. KPC — weryfikacja ELI)
- [ ] SR/SO uzasadnione (art. 17 KPC — m.in. pkt 4: prawa majątkowe o WPS ponad 100 000 zł)
- [ ] Miasto dzielone: rozstrzygnięte przez narzędzie albo `[Sąd do ustalenia]`
- [ ] Kategoria sprawy w zakresie sądu (§ 3) albo wskazany sąd okręgu z zastrzeżeniem wydziału
