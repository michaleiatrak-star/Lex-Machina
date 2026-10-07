# MOD-GRAF-PRZYCZYNOWY — sieć zależności zdarzeń, wzajemny wpływ, skutki i scenariusze

> **Wersja:** 1.1.0 (shared 3.99.1, AUDYT-2026-10-02 — rewizja ekspercka: NESS, zaniechanie, przypisanie karne, model wykluczeniowy MET-ACH) | **Status:** PRODUKCJA — plik kanoniczny shared/
> **Wywoływany z:**
>   - `analizator-dowodow-v3` MP13 §13.2 (łańcuchy → graf, gdy ogniwa się rozgałęziają lub zbiegają)
>   - `chronologia-sprawy-v1` TRYB C „graf” (zdarzenia z osi czasu jako węzły; widget `assets/widget-graf-przyczynowy.html`)
>   - `shared/MOD-METODY-BADAWCZE.md` MET-PT (siła dowodu połączenia = atrybut krawędzi)
>   - `shared/MOD-LANCUCH-DOWODOWY.md` (rachunek łańcucha szeregowego i dowodów równoległych)
> **Silnik:** `shared/tools/graf_przyczynowy.py` (raport MD / JSON / Mermaid, `--selftest`); ten sam model liczbowy
> w widgecie (blok ENGINE) — parytet pilnuje T42 w `audyt-systemu-v4`.
> ⛔ HARD GATE: przepisy przez ELI (MCP `isap_tekst`), orzecznictwo przez MCP `saos_search` / `cbosa_szukaj` — nigdy z pamięci.

---

## 1. Po co graf, skoro jest łańcuch

Łańcuch (MP13, MOD-LANCUCH-DOWODOWY) opisuje JEDNĄ drogę A → B → C. Sprawy rzeczywiste mają strukturę sieci:
jedno zdarzenie ma kilka skutków, kilka przyczyn zbiega się w jednym skutku, przyczyny konkurują (alternatywne
wyjaśnienie), zdarzenie późniejsze przerywa związek, a stany trwające wpływają na siebie nawzajem (eskalacja
konfliktu, pogarszanie się zdrowia i zdolności do pracy). Graf pozwala:

- **zbadać** każde połączenie osobno (mechanizm, nie tylko kolejność — MET-PT);
- **oszacować** wsparcie każdego zdarzenia i tezy w jawnym modelu (§4);
- **przewidzieć** skutki zmian: co upada, gdy dany fakt zostanie obalony; co zyskujemy, gdy go udowodnimy (§5);
- **wykazać** całość: tabela, diagram, widget z przeliczaniem na żywo (§7).

## 2. Model danych (JSON — wspólny dla silnika, widgetu i eksportu MOD-WIDGET-IO)

```json
{
  "tytul": "…", "sygnatura": "…", "dziedzina": "cywilne | karne | pracy | administracyjne",
  "teza": "Z-010",
  "wezly": [
    { "id": "Z-001", "opis": "1 zdanie, bez ocen", "data": "2024-09-02", "watek": "W1",
      "typ": "ZDARZENIE | ZANIECHANIE | STAN | SKUTEK_PRAWNY",
      "strona": "powod | pozwany | poszkodowany | osoba_trzecia | osoba_trzecia_niezalezna | organ | sad",
      "pewnosc": "BEZSPORNE | PEWNE | WYDEDUKOWANE | SPORNE", "p": null,
      "brama": "I | LUB", "sprawca": false, "przyczynienie": false, "obowiazek_dzialania": null,
      "alternatywy_zbadane": "null albo uzasadnienie, dlaczego nie ma innych wyjaśnień (gdy brak węzłów OSLABIA)",
      "fakt_m1": "F007", "dok_id": ["DOK-03"] }
  ],
  "krawedzie": [
    { "od": "Z-001", "do": "Z-002", "typ": "WYWOLUJE | WARUNKUJE | WZMACNIA | OSLABIA | PRZERYWA",
      "dowod": "BEZPOSREDNI | POSREDNI | KORELACJA", "p": null,
      "csqn": "TAK | NIE | NESS | NIEUSTALONE", "adekwatnosc": "NORMALNE | NIETYPOWE | NIEUSTALONE",
      "dzialanie_hipotetyczne": "tylko dla krawędzi z ZANIECHANIA: jakie działanie zgodne z obowiązkiem",
      "ryzyko": "STWORZONE | ZWIEKSZONE | BRAK (karne)", "realizacja_ryzyka": "TAK | NIE (karne)",
      "zrodla": ["DOK-03"], "uzasadnienie": "na czym opiera się to połączenie" }
  ],
  "scenariusze": [ { "nazwa": "świadek X niewiarygodny", "obalone": ["Z-002"], "udowodnione": [] } ]
}
```

**Identyfikatory:** `Z-nnn` = identyfikator zdarzenia z `chronologia-sprawy-v1` (pole `id`). Gdy graf powstaje
w MP13, pole `fakt_m1` wiąże węzeł z faktem M1 (F-nnn) — jedna przestrzeń identyfikatorów dla osi czasu i łańcuchów.

| Typ krawędzi | Znaczenie | Wpływ w modelu |
|---|---|---|
| WYWOLUJE | A spowodowało B | przyczyna (brama I/LUB) |
| WARUNKUJE | bez A nie byłoby B, ale A samo nie wystarcza | przyczyna konieczna (brama I) |
| WZMACNIA | A zwiększa prawdopodobieństwo/rozmiar B (np. przyczynienie, czynnik współdziałający) | dokłada się jak dodatkowa przyczyna |
| OSLABIA | A jest alternatywnym wyjaśnieniem B lub mu przeciwdziała | mnoży wsparcie B przez (1 − siła A) |
| PRZERYWA | A to nowe, niezależne zdarzenie, które przejmuje rolę przyczyny | jak OSLABIA + flaga prawna przerwania związku |

| Brama węzła | Kiedy | Rachunek |
|---|---|---|
| I (domyślna) | każda przyczyna jest konieczna (przesłanki łączne, łańcuch) | iloczyn — sieć jest SŁABSZA niż każde ogniwo |
| LUB | każda przyczyna wystarcza (przyczyny alternatywne, niezależne dowody tego samego faktu) | 1 − iloczyn porażek — sieć jest SILNIEJSZA niż każde ogniwo |

## 3. Badanie każdej krawędzi — trzy pytania, osobno

1. **Fakt połączenia (MET-PT):** `BEZPOSREDNI` (dokument/zeznanie o samym mechanizmie: decyzja, polecenie,
   wiadomość), `POSREDNI` (wniosek z innych faktów, domniemanie faktyczne art. 231 KPC), `KORELACJA` (wyłącznie
   następstwo w czasie). Krawędź `KORELACJA` zawsze generuje ostrzeżenie *post hoc ergo propter hoc*.
2. **Test warunku koniecznego (csqn):** czy bez A skutek B by nastąpił? `NIE` → krawędź nie jest przyczynowa
   (silnik ją zeruje i ostrzega). `NIEUSTALONE` → flaga do uzupełnienia materiału.
   ⛔ **Granica csqn (rewizja 2026-10-02):** test zawodzi przy **przyczynowości kumulatywnej/nadmiarowej** — gdy dwa
   zdarzenia, każde samo wystarczające, wywołują ten sam skutek (dwóch sprawców, dwa źródła szkody), dla każdego
   z osobna odpowiedź brzmi „skutek i tak by nastąpił”, choć oba są przyczynami. Wtedy wpisz `csqn: "NESS"`
   (A jest koniecznym elementem zbioru warunków wystarczającego do skutku) — krawędź jest liczona, a raport każe
   ocenić przyczynowość kumulatywną/alternatywną (przy różnych sprawcach — art. 441 KC). `NIE` zostaw wyłącznie
   dla zdarzeń, które nie należą do żadnego obecnego zbioru warunków wystarczających.
   **Zaniechanie:** związek jest **hipotetyczny** — pytanie brzmi, czy działanie zgodne z obowiązkiem zapobiegłoby
   skutkowi. Krawędź z węzła `ZANIECHANIE` wymaga pola `dzialanie_hipotetyczne`, a jej `p` oznacza
   prawdopodobieństwo zapobieżenia skutkowi (nie pewność). Brak pola → ostrzeżenie.
3. **Przypisanie prawne** (osobno od faktów):
   - prawo cywilne — art. 361 § 1 KC: zobowiązany odpowiada „tylko za normalne następstwa działania lub
     zaniechania, z którego szkoda wynikła” (brzmienie z ELI, t.j. Dz.U. 2026 poz. 795) → pole `adekwatnosc`;
   - przyczynienie się poszkodowanego — art. 362 KC: obowiązek naprawienia szkody „ulega odpowiedniemu
     zmniejszeniu stosownie do okoliczności, a zwłaszcza do stopnia winy obu stron” → jawne `przyczynienie: true`
     przy węźle zachowania poszkodowanego (sama strona „powód/poszkodowany” NIE oznacza przyczynienia — skarga
     czy wniosek pracownika to nie przyczynienie się do szkody);
   - kilku sprawców — art. 441 § 1 KC (odpowiedzialność solidarna przy czynie niedozwolonym) i § 2 (regres
     „od stopnia, w jakim przyczyniła się do powstania szkody”) → jawne `sprawca: true` przy ≥ 2 węzłach różnych
     podmiotów;
   - prawo karne — art. 2 KK: za przestępstwo skutkowe popełnione przez zaniechanie odpowiada „ten tylko, na kim
     ciążył prawny, szczególny obowiązek zapobiegnięcia skutkowi” (t.j. Dz.U. 2025 poz. 383; nowelizacje po t.j.
     do 2026-10-01 nie zmieniają art. 2) → pole `obowiazek_dzialania` przy węźle `ZANIECHANIE`;
   - przerwanie związku (zdarzenie nowe, niezależne, które samo wywołało skutek) → krawędź `PRZERYWA`;
   - prawo karne, **obiektywne przypisanie skutku** (doktryna; poza art. 2 KK): sprawca stworzył albo zwiększył
     prawnie nieakceptowalne ryzyko, a skutek jest realizacją właśnie tego ryzyka → pola `ryzyko`
     i `realizacja_ryzyka` na krawędziach ścieżki do tezy; braki → flaga;
   - **standard dowodu i wątpliwości:** w sprawie karnej „niedające się usunąć wątpliwości rozstrzyga się na korzyść
     oskarżonego” (art. 5 § 2 KPK, t.j. Dz.U. 2026 poz. 490; nowelizacje po t.j. sprawdzone 2026-10-02 — art. 5 bez
     zmian) → krawędź ze ścieżki do tezy z `csqn` NIEUSTALONE albo tylko korelacją = flaga, nie domniemanie
     związku; w sprawie cywilnej nieustalony związek obciąża tego, kto wywodzi z niego skutki prawne (art. 6 KC,
     t.j. Dz.U. 2026 poz. 795), dowody wskazuje strona (art. 232 KPC), a sąd może wywnioskować fakt z innych
     ustalonych faktów (art. 231 KPC — domniemanie faktyczne; t.j. Dz.U. 2026 poz. 468, nowelizacje po t.j.
     sprawdzone — art. 231–232 bez zmian) → podstawa krawędzi `POSREDNI`.
   Doktrynalne testy (adekwatność, obiektywne przypisanie, przerwanie związku) i ich wykładnię potwierdzaj
   orzecznictwem pobranym przez MCP (`saos_search` z frazą, np. „normalne następstwa”; NSA/WSA: `cbosa_szukaj`,
   snapshot 🟨), nie z pamięci. Brak trafień = OUT_OF_SCOPE, bez dopowiadania tez.

## 4. Szacowanie — jawny model liczbowy

```
p(węzła):     BEZSPORNE 0,98 · PEWNE 0,90 · WYDEDUKOWANE 0,70 · SPORNE 0,50  (lub własne p z uzasadnieniem)
p(krawędzi):  BEZPOSREDNI 0,90 · POSREDNI 0,70 · KORELACJA 0,40 · csqn=NIE → 0  (lub własne p z uzasadnieniem)

węzeł źródłowy:    s = p(węzeł)
brama I:           s = p(węzeł) · Π (s_przyczyny · p_krawędzi)
brama LUB:         s = p(węzeł) · [1 − Π (1 − s_przyczyny · p_krawędzi)]
WZMACNIA:          czynnik przyczynowy f ← 1 − (1 − f) · Π (1 − s · p)
OSLABIA/PRZERYWA:  s ← s · Π (1 − s_czynnika · p_krawędzi)
```

`s` czytaj: „zdarzenie zaszło ORAZ wynika z przyczyn ujętych w grafie”. Przykłady kontrolne (selftest):
łańcuch 3 × 0,9 = **0,729** (słabszy niż każde ogniwo); trzy niezależne dowody po 0,9 dla jednego faktu
(brama LUB) = **0,999**.

⛔ **Granice modelu — podawaj je przy każdej liczbie:** (1) zakłada niezależność ogniw — dwa zeznania osób
powiązanych nie są niezależne, łącz je w jeden węzeł; (2) wartości domyślne są skalą porządkową siły materiału,
nie statystyką orzeczniczą — nie przedstawiaj ich jako „szansy wygranej w procentach”; (3) predykcja
rozstrzygnięcia (analiza-sadowa-v6 §9) może korzystać z wyniku grafu tylko z opisem tych założeń.

## 5. Przewidywanie — ogniwa krytyczne i scenariusze „co jeśli”

- **Ogniwa krytyczne:** silnik obala po kolei każdy węzeł (s = 0) i mierzy spadek tezy; lista od największego
  spadku = gdzie przeciwnik uderzy i gdzie potrzebny jest dodatkowy dowód (wniosek dowodowy, MOD-LANCUCH ŁB-*).
- **Scenariusze:** `obalone` (s = 0) / `udowodnione` (s = 1) dla wybranych węzłów → nowa wartość tezy i lista
  węzłów zmienionych o ≥ 0,05. Typowe: „świadek niewiarygodny”, „dokument antydatowany”, „biegły potwierdzi
  mechanizm”. W widgecie: kliknięcie węzła przełącza zwykły → obalony → udowodniony.
- **Skutki dalsze:** każdy węzeł potomny tezy (np. utrata zarobku → szkoda → odsetki) przelicza się tak samo —
  graf pokazuje, które roszczenia upadają razem z jednym faktem.

## 5a. Model wykluczeniowy — przyczyny alternatywne i konkurujące hipotezy

Związek wykazany pośrednio albo z samej kolejności zdarzeń jest wiarygodny dopiero wtedy, gdy **zbadano i odrzucono
inne wyjaśnienia** tego samego skutku. Graf wymusza to na dwa sposoby:

1. **Węzły alternatywne:** każde rozsądne alternatywne wyjaśnienie skutku = osobny węzeł z krawędzią `OSLABIA`
   (lub `PRZERYWA`, gdy przejmuje rolę przyczyny). Gdy do skutku prowadzi krawędź `POSREDNI`/`KORELACJA`, a nie ma
   ani jednej krawędzi alternatywnej ani pola `alternatywy_zbadane` z uzasadnieniem — silnik zgłasza
   „WYKLUCZENIE: … bez zbadanych przyczyn alternatywnych”.
2. **MET-ACH** (`shared/MOD-METODY-BADAWCZE.md`, silnik: `graf_przyczynowy.py plik.json --ach`) rozstrzyga, które
   wyjaśnienie się utrzymuje: macierz hipoteza × dowód, ranking po **ważonej niespójności**, a nie po liczbie
   potwierdzeń; dowody zgodne ze wszystkimi hipotezami są niediagnostyczne i nie wzmacniają żadnej. Wynik wraca do
   grafu: hipoteza **wykluczona dowodem klasy A/B** → węzeł alternatywny z niskim `p` (z cytatem dowodu);
   hipoteza niewykluczona → zostaje z `p` wynikającym z materiału.
3. **Niezależność:** dwie przyczyny w bramie `LUB` oparte na tym samym źródle (np. ten sam dokument, ten sam
   świadek) nie są niezależne — silnik ostrzega, bo wzór 1 − Π(1 − s·p) zawyżałby wsparcie; połącz je w jeden węzeł.

## 6. Wzajemny wpływ i sprzężenia zwrotne

Cykl w grafie (A wpływa na B, B na A) jest dopuszczalny tylko między węzłami typu `STAN` albo jako eskalacja
rozpisana na kolejne zdarzenia. Silnik: wykrywa cykle (silnie spójne składowe), raportuje je jako
„SPRZĘŻENIE — wzajemny wpływ”, a do obliczeń rozcina krawędź o najpóźniejszej przyczynie (przy remisie —
najsłabszą); rozcięte krawędzie są wymienione w raporcie. Krawędź od zdarzenia późniejszego do wcześniejszego
(poza OSLABIA) to **błąd danych** — przyczyna nie może nastąpić po skutku.

## 7. Wykazanie — formaty wyjścia

| Forma | Kiedy | Jak |
|---|---|---|
| Tabela + lista ścieżek (MD) | zawsze w raporcie | `python3 shared/tools/graf_przyczynowy.py graf.json` |
| Diagram Mermaid | pismo, raport statyczny, strona | `--mermaid` |
| Widget interaktywny | „pokaż zależności”, „graf”, „co jeśli” | `chronologia-sprawy-v1/assets/widget-graf-przyczynowy.html` przez `show_widget` (pasek MOD-WIDGET-IO: JSON/MD); widget liczy wsparcie, ogniwa krytyczne i ostrzeżenia post hoc/csqn/sprzężeń — flagi art. 361/362/441 KC i art. 2 KK podaje raport silnika |
| JSON | przekazanie do innego skilla / kolejnej sesji | `--json` lub eksport z widgetu (silnik czyta też `{_meta, state}`) |

Każdy raport grafu zawiera: tabelę węzłów (wsparcie), tabelę krawędzi (typ, dowód połączenia, csqn,
adekwatność, źródła), ścieżki do tezy z najsłabszym ogniwem, ogniwa krytyczne, scenariusze, flagi prawne,
ostrzeżenia (post hoc, csqn, sprzężenia) i zdanie o założeniach z §4.

## 8. Procedura (kolejność obowiązkowa)

1. Węzły z chronologii (`Z-nnn`) lub z M1 (`fakt_m1`) — bez węzła bez źródła; hipoteza = `pewnosc: SPORNE` + `[H]`.
2. Krawędzie: dla każdej trzy pytania z §3 i `zrodla`; połączenie bez źródła = `KORELACJA`; przy dwóch
   przyczynach wystarczających — `NESS`, nie `NIE`; przy zaniechaniu — `dzialanie_hipotetyczne`.
2a. Model wykluczeniowy (§5a): przyczyny alternatywne jako węzły `OSLABIA`; spór o wersję → MET-ACH.
3. Bramy: dla każdego węzła z ≥ 2 przyczynami rozstrzygnij I/LUB i zapisz dlaczego.
4. Silnik (albo widget) → raport §7.
5. Wersja przeciwnika (MP13 §13.5): osobne krawędzie OSLABIA/PRZERYWA dla alternatywnych wyjaśnień — graf
   jednostronny jest niepełny.
6. Ogniwa krytyczne → wnioski dowodowe / pytania do świadków (przesluchanie-swiadkow-v2-min90) / atak na łańcuch przeciwnika (MOD-LANCUCH §D2).
