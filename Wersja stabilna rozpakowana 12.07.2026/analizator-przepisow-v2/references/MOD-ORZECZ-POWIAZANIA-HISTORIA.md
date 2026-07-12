# MOD-ORZECZ-POWIAZANIA-HISTORIA — Orzecznictwo, mapa powiązań, historia zmian, kontekst dla laika, widget wyników

**Wersja:** 1.0 | **Wyodrębniono z SKILL.md:** 2026-06-14 (refaktoryzacja — eliminacja monolitu)
**Wywołaj z:** analizator-przepisow-v2/SKILL.md → INSTRUKCJE OPERACYJNE, kroki 5–9 i 13.
**Zasada:** `view /mnt/skills/user/shared/PRAWO-HARDGATE.md` przed każdym orzeczeniem i przepisem z tego modułu — sygnatury wyłącznie po weryfikacji online.

Zawiera moduły: 7 (Linia orzecznicza), 7A (MOD-ORZECZ-PRZEPIS), 7B (MOD-ZBIEZNOSC — mapa powiązań), 7C (MOD-HISTORIA-ZMIAN + MOD-VACATIO-LEGIS), 7D (MOD-KONTEKST-PRAKTYCZNY), 8 (Widget wyników — 7 zakładek).

Moduł 7C odsyła dalej do `references/MOD-VACATIO-LEGIS.md` przy wykryciu vacatio legis lub nowelizacji wieloetapowej.

---

## MODUŁ 7 — LINIA ORZECZNICZA

Stosuj gdy: użytkownik pyta o orzecznictwo, przepis zawiera pojęcia nieostre, wynik jest niejednoznaczny.

```
KROK 7.1 — Identyfikacja kwestii spornych
  Jakie pojęcia/przesłanki są interpretowane różnie?

KROK 7.2 — Wyszukiwanie (TYLKO oficjalne źródła w tej kolejności):
  1. SN: https://www.sn.pl/orzecznictwo
  2. NSA: https://orzeczenia.nsa.gov.pl
  3. TK: https://www.trybunal.gov.pl/orzeczenia
  4. TSUE: https://curia.europa.eu (dla norm UE)
  5. MS: https://orzeczenia.ms.gov.pl
  6. SAOS: https://saos.org.pl

KROK 7.3 — NIGDY nie cytuj sygnatur z pamięci AI.
  Każde orzeczenie zweryfikuj online przed podaniem.

KROK 7.4 — Analiza:
  Stanowisko dominujące / mniejszościowe
  Rozbieżności SN vs SA, NSA vs WSA
  Uchwały SN/NSA wiążące inne sądy
```

### Raport linii orzeczniczej

```
LINIA ORZECZNICZA — [przepis] / [kwestia]
Kwestia sporna: [o co chodzi]

DOMINUJĄCE:
  Treść: [opis wykładni]
  Orzeczenia: [sygnatury — zweryfikowane online]
  Sąd: SN / NSA / TK / sądy powszechne

MNIEJSZOŚCIOWE:
  Treść: [opis]
  Orzeczenia: [sygnatury — zweryfikowane]

HISTORIA: [data] → [zmiana wykładni / uchwała / wyrok TK]

ROZBIEŻNOŚCI: między izbami SN / SN a SA / NSA a WSA / PL a TSUE

REKOMENDACJA: [właściwa wykładnia + ryzyko odmiennej interpretacji]
```

---

## MODUŁ 7A — MOD-ORZECZ-PRZEPIS (automatyczne orzecznictwo do przepisu)

**Uruchamiaj automatycznie** po każdej analizie przepisu — bez żądania użytkownika.  
Cel: pobranie 3 realnych orzeczeń bezpośrednio dotyczących analizowanego przepisu i wykrycie rozbieżności linii orzeczniczych.

### Procedura wyszukiwania

```
KROK A — Sformułuj 3 różne zapytania per źródło:
  q1: [sygnatura art. X §Y] + [nazwa aktu] + "orzeczenie" + rok (bieżący i -2)
  q2: [teza kluczowego pojęcia z Modułu 2] + [kodeks/ustawa]
  q3: [skutek prawny z przepisu] + [dziedzina] + "wyrok" / "uchwała"

KROK B — Źródła w kolejności:
  1. https://saos.org.pl — agregator, najszerszy zasięg
  2. https://www.sn.pl/orzecznictwo — SN (linia wiodąca cywilna/karna)
  3. https://orzeczenia.ms.gov.pl — sądy powszechne SA/SO/SR
  4. https://orzeczenia.nsa.gov.pl — NSA/WSA (jeśli przepis administracyjny)
  5. https://www.trybunal.gov.pl/orzeczenia — TK (jeśli konstytucyjność)

KROK C — Weryfikacja każdego orzeczenia:
  Sprawdź czy URL prowadzi do realnego dokumentu
  Potwierdź sygnaturę i datę
  Jeśli orzeczenie niedostępne → pomiń, wyszukaj kolejne
  NIGDY nie podawaj sygnatury z pamięci AI

KROK D — Klasyfikacja hierarchiczna:
  TIER 1 (linia wiodąca):   SN, NSA, TK, TSUE
  TIER 2 (linia stosowania): SA, WSA
  TIER 3 (przykłady):        SO, SR — dopuszczalne gdy brak Tier 1/2

KROK E — Alert rozbieżności:
  Porównaj tezy zebranych orzeczeń
  Jeśli teza T1 ≠ T2 lub T1 sprzeczna z T3:
    → oznacz "⚠️ LINIA NIEJEDNOLITA"
    → wskaż co powoduje rozbieżność (inna wykładnia pojęcia / inna data / inna izba / zmiana ustawy)
    → wskaż które stanowisko jest dominujące i dlaczego
```

### Format karty orzeczenia

```
┌─────────────────────────────────────────────────────────────┐
│ ORZECZENIE [nr z 1–3] — [Tier 1/2/3]                       │
├──────────────┬──────────────────────────────────────────────┤
│ Sygnatura    │ [sygn. — zweryfikowana online]               │
│ Sąd          │ [pełna nazwa sądu i izby]                    │
│ Data         │ [DD.MM.RRRR]                                 │
│ Teza         │ [jedno zdanie — własne słowa, nie cytat]     │
│ Link         │ [URL do oficjalnego źródła]                   │
│ Relevance    │ ██████░░░░ 6/10 — [jak bezpośrednio dotyczy] │
└──────────────┴──────────────────────────────────────────────┘
```

### Raport MOD-ORZECZ-PRZEPIS

```
ORZECZNICTWO DO PRZEPISU — [identyfikator]
Wyszukano: [data dziś] | Źródła: [lista]

[3 karty orzeczeń według formatu powyżej]

OCENA LINII ORZECZNICZEJ:
  Status: JEDNOLITA ✅ / NIEJEDNOLITA ⚠️ / BRAK DANYCH ❓

  [jeśli NIEJEDNOLITA:]
  Rozbieżność: [co jest sporne — konkretna kwestia]
  Stanowisko A: [opis + orzeczenia] — dominujące / mniejszościowe
  Stanowisko B: [opis + orzeczenia] — dominujące / mniejszościowe
  Przyczyna rozbieżności: [inna wykładnia pojęcia X / zmiana ustawy z dnia Y /
                           rozbieżność izb SN / SN vs SA / wpływ TSUE / inne]
  Rekomendacja praktyczna: [które stanowisko powołać i dlaczego]
```

---

## MODUŁ 7B — MOD-ZBIEZNOSC (mapa powiązań norm)

**Uruchamiaj gdy:** przepis odsyła do innych artykułów / zachodzi zbieg / ścieżka B (wiele przepisów) / użytkownik pyta o "powiązane przepisy" lub "inne artykuły".

```
PROCEDURA:
1. Przeczytaj treść przepisu — wypisz wszystkie odesłania ustawowe
2. Sprawdź ISAP: czy artykuły odsyłające obowiązują
3. Wyszukaj zbieg norm (patrz Moduł 5) i dodaj do mapy
4. Ustal typ relacji dla każdego powiązania

TYP RELACJI:
  → ODESŁANIE BEZPOŚREDNIE: przepis wprost powołuje inny art.
  → LEX SPECIALIS: jeden przepis zawęża/rozszerza drugi
  → ZBIEG KUMULATYWNY: oba stosują się jednocześnie
  → ZBIEG ELIMINACYJNY: jeden wyklucza drugi
  → SKUTEK / PODSTAWA: jeden jest podstawą, drugi skutkiem
  → DEFINICJA: jeden definiuje pojęcie użyte w drugim
```

### Format mapy powiązań (tekstowy — gotowy do widget)

```
MAPA POWIĄZAŃ — [przepis główny]

[przepis główny]
  ├── [art. X] — ODESŁANIE BEZPOŚREDNIE — [dlaczego powiązany]
  ├── [art. Y §Z] — LEX SPECIALIS — [w jakim zakresie]
  ├── [art. A] — DEFINICJA — [jakie pojęcie definiuje]
  └── [art. B] — ZBIEG KUMULATYWNY — [gdy stosuje się razem]
       └── [art. C] — SKUTEK — [co z tego wynika]

Węzłów: [n] | Zbiegów: [k] | Lex specialis: [l]
```

---

## MODUŁ 7C — MOD-HISTORIA-ZMIAN + MOD-VACATIO-LEGIS (nowelizacje przepisu)

**Uruchamiaj automatycznie** przy każdej analizie — w tle, bez przerywania głównego flow.  
Wynik prezentuj w dedykowanej zakładce widgetu (Moduł 8 Zakładka 6).

**Szczególnie krytyczny dla:** przepisów podatkowych (PIT/VAT/CIT), KPA, KPC, KP, RODO, prawa budowlanego.

**Moduł vacatio legis** — uruchom przy wykryciu:
- aktywnego vacatio legis (akt opublikowany, jeszcze nie obowiązuje),
- nowelizacji wieloetapowej (różne daty wejścia w życie),
- rozbieżności między wersją w dacie zdarzenia a wersją aktualną.
```
view /mnt/skills/user/analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md
```
W środowisku produkcyjnym:
```
view /mnt/skills/user/analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md
```

```
PROCEDURA:
1. ISAP — pobierz historię nowelizacji aktu prawnego (wykaz zmian)
   URL: https://isap.sejm.gov.pl → wyszukaj akt → zakładka "Historia"
2. Ogranicz do ostatnich 3 lat (domyślnie) lub wskazanego okresu
3. Dla każdej nowelizacji: ustal co się zmieniło W ANALIZOWANYM PRZEPISIE
   (pomiń nowelizacje innych artykułów)
4. Oceń istotność zmiany dla analizowanej sprawy

ALERT KRYTYCZNY:
  Jeśli przepis zmieniony w ostatnich 6 miesiącach → ⚠️ ŚWIEŻA NOWELIZACJA
  Jeśli zmiana w trakcie analizowanego okresu → ⚠️ STAN PRAWNY NIESTAŁY
  Jeśli wykryto vacatio legis lub nowelizację wieloetapową:
    → view /mnt/skills/user/analizator-przepisow-v2/references/MOD-VACATIO-LEGIS.md
    → uruchom procedurę VL-1→VL-4, dodaj alerty VL-A/VL-B/VL-C do raportu
```

### Format raportu historii zmian

```
HISTORIA ZMIAN — [identyfikator przepisu]
Źródło: ISAP [URL] | Okres: ostatnie 3 lata

┌─────────────┬──────────────────────┬────────────────┬──────────────────┐
│ Data zmiany │ Nowelizacja (Dz.U.)  │ Co się zmieniło│ Istotność        │
├─────────────┼──────────────────────┼────────────────┼──────────────────┤
│ [DD.MM.RR]  │ Dz.U. [rok] poz.[n] │ [opis skrócony]│ ⚠️ WYSOKA / niska│
└─────────────┴──────────────────────┴────────────────┴──────────────────┘

Status: BEZ ZMIAN w ostatnich 3 latach ✅ / ZMIENIONY [n] razy ⚠️
Ostatnia zmiana: [data] — [Dz.U.]
Rekomendacja: [czy sprawdzić tekst historyczny dla starszej sprawy]
```

---

## MODUŁ 7D — MOD-KONTEKST-PRAKTYCZNY (wyjaśnienie dla laika)

**Uruchamiaj automatycznie** gdy: użytkownik nie jest prawnikiem (wykryj z tonu pytania) LUB użytkownik wprost pyta "co to znaczy" / "jak to działa" / "czy to dotyczy mnie".  
Prezentuj w osobnym boxie obok analizy technicznej — NIE zastępuje analizy, jest jej uzupełnieniem.

```
FORMAT — trzy elementy obowiązkowe:

CO TEN PRZEPIS ZNACZY W PRAKTYCE (dla laika):
  [Zdanie 1: co przepis pozwala / zabrania / nakazuje — bez żargonu]
  [Zdanie 2: kiedy typowo się go stosuje — przykład życiowy]
  [Zdanie 3: co to oznacza dla osoby w takiej sytuacji jak użytkownik]

PRZYKŁAD Z ŻYCIA:
  Sytuacja: [krótki opis — 2-3 zdania — maksymalnie konkretny]
  Skutek: [co się stało, kto wygrał/przegrał, dlaczego]

JĘZYK TECHNICZNY vs PROSTY:
  "Czyn niedozwolony" = wyrządzona komuś szkoda
  "Związek przyczynowy" = że właśnie to działanie wywołało szkodę
  [Inne pojęcia z analizowanego przepisu — tłumacz z pary na parę]

Styl: jak tłumaczenie przyjacielowi przy kawie — konkretnie, bez patronizowania.
Nie upraszczaj przez omijanie istotnych niuansów — zaznaczaj je słowem "uwaga:".

Dozwolone wsparcie z dużych portali RZĘDU 2 (prawo.pl, LEX, Legalis, rp.pl,
gofin.pl i pozostałe — patrz SKILL.md Moduł 1, "Hierarchia źródeł") do
sformułowania przystępnego przykładu lub porównania — oznacz je
📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: ...]. Źródła Rzędu 3 (strony indywidualne,
blogi, NGO) tylko po zastosowaniu zasad dodatkowych Rzędu 3 (data + krzyżowa
weryfikacja). Nie zastępują
one weryfikacji przepisu (ISAP) ani orzecznictwa (Moduł 7/7A).
```

---

## MODUŁ 8 — WIDGET WYNIKÓW (po analizie)

Po każdej pełnej analizie (Moduły 1–7D) wygeneruj interaktywny widget HTML z zakładkami:

Zakładka 1 — KARTA PRZEPISU:
- Pełna treść z wyróżnieniem przesłanek kolorem
- Badge statusu: obowiązuje / zmieniony / uchylony
- Data stanu prawnego, link do ISAP
- Jeśli tryb historyczny: oś czasu zmian przepisu
- Jeśli MOD-KONTEKST aktywny: boks "W PRAKTYCE" z tłumaczeniem dla laika (collapsible)

Zakładka 2 — DRZEWO PRZESŁANEK (INTERAKTYWNE):
- Wizualne drzewo div z węzłami: zielony (T) / czerwony (N) / pomarańczowy (?)
- Badge typu logicznego (AND / OR / MIXED) przy korzeniu
- Tooltip z uzasadnieniem po najechaniu
- TRYB KROKOWY (przycisk "Sprawdź krok po kroku"):
  Krok 1/N: "Czy przesłanka [P1: nazwa] jest spełniona?"
  Przyciski: [TAK] [NIE] [WĄTPLIWE]
  Po wyborze: →gałąź wyniku cząstkowego + wyjaśnienie co to oznacza
  Po P1..Pn: podsumowanie automatyczne (wszystkie TAK → przepis stosuje się / dowolne NIE przy AND → nie stosuje się)
  Reset: "Zacznij od nowa"

Zakładka 3 — MATRYCA OCENY:
- Tabela: przesłanka | status | pasek pewności (%) | uzasadnienie | braki
- Wiersz podsumowujący z dużym badge WYNIK KOŃCOWY

Zakładka 4 — ORZECZNICTWO (MOD-ORZECZ-PRZEPIS):
- 3 karty orzeczeń (sygnatura + sąd + rok + teza + link + relevance bar)
- Tier badge: SN/NSA/TK (tier 1) / SA/WSA (tier 2) / SR/SO (tier 3)
- Alert LINIA NIEJEDNOLITA ⚠️ jeśli wykryto rozbieżność (czerwony boks)
  → opis stanowiska A i B + co powoduje rozbieżność + rekomendacja
- Alert LINIA JEDNOLITA ✅ jeśli brak rozbieżności (zielony boks)
- Filtry: [SN] [SA] [NSA] [WSA] — toggle pokazuje/ukrywa tier

Zakładka 5 — POWIĄZANIA NORM (MOD-ZBIEZNOSC):
- Wizualna mapa powiązań (ASCII-tree lub div-tree)
- Każdy węzeł: [artykuł] + [typ relacji badge] + [opis jednozdaniowy]
- Klik w węzeł → sendPrompt("Analizuj [artykuł] [akt]")
- Legenda typów relacji kolorami

Zakładka 6 — HISTORIA ZMIAN (MOD-HISTORIA-ZMIAN):
- Tabela nowelizacji z ostatnich 3 lat
- Badge istotności: ⚠️ WYSOKA / szara NISKA
- Alert ⚠️ ŚWIEŻA NOWELIZACJA jeśli zmiana w ostatnich 6 miesiącach
- Porównanie wersji (gdy dostępne): aktualna vs poprzednia (diff-style)

Zakładka 7 — RAPORT I REKOMENDACJE:
- Konkluzja w dużym boxie (zielony/czerwony/pomarańczowy)
- Gauge 0–100% ogólnej pewności analizy
- Lista ryzyk i rekomendacji
- Jeśli MOD-KONTEKST aktywny: boks "Co to oznacza dla Ciebie" (laik)
- Przyciski: sendPrompt("Generuj pismo procesowe") / sendPrompt("Zbadaj orzecznictwo") / sendPrompt("Analizuj dowody")

Wymagania techniczne widgetu wyników:
- Jeden plik HTML, CSS i JS inline, bez zewnętrznych bibliotek
- Kolory jak w Module 0.3, responsywny min-width 320px
- Eksport PDF: window.print() ze stylami @media print
