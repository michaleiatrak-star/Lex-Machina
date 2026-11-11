# MOD-SLOWNIK-STATUSOW — wspólny słownik statusów, zakres sprawy i ślad teza → źródło → akapit

> Wersja: 1.0.0 | Typ: kontrakt danych | shared/
> Źródło metody: LEGAL GAUNTLET UNIVERSAL v3 — II.2 (słownik statusów), VI.4, G99; testy akceptacyjne T03, T08, T33.
> Wywoływany z: pisma-procesowe-v3 (W1.1 zakres, W3 raport), analiza-sadowa-v6, HYBRID-VALIDATION (F3.0),
> recenzent-niezalezny. Nie zastępuje znaczników ✅ [VER] / ⚠️ [NIEWERYFIKOWANE] / 🟨 (WERYFIKACJA-SLAD) ani
> FSL-A/B/C (FACT-SOURCE-LOCK) — nadaje im wspólne nazwy w raportach i w wymianie z aplikacją.

## 1. Fakty (status twierdzenia faktycznego)

| Status | Znaczenie | Odpowiednik w skillach |
|---|---|---|
| CONFIRMED_CONTENT | treść dokumentu potwierdzona w źródle (lokalizacja) | FSL-A |
| COURT_FINDING | ustalenie sądu w orzeczeniu | FSL-A (orzeczenie) |
| PARTY_ASSERTION | twierdzenie strony lub organu | FSL-B |
| DISPUTED | strony podają różne wersje | FSL-B ×2, sprzeczność |
| PARTIALLY_SUPPORTED | dowód obejmuje część twierdzenia | FSL-A w części |
| CONTRADICTED | dokument przeczy twierdzeniu | sprzeczność z FSL-A |
| UNVERIFIED / UNKNOWN | brak źródła / brak danych | ⛔ BRAK ŹRÓDŁA |
| OUT_OF_SCOPE | fakt z innej sprawy niż badana (§4) | nie używać |

## 2. Prawo i orzecznictwo

| Status | Znaczenie | Odpowiednik |
|---|---|---|
| VERIFIED_TEMPORAL | brzmienie na dzień zdarzenia potwierdzone w ELI | ✅ [VER] z `asOf` |
| VERIFIED_CURRENT | brzmienie obecne potwierdzone w ELI | ✅ [VER] |
| LAW_UNVERIFIED | brak potwierdzenia w ELI | ⚠️ [NIEWERYFIKOWANE] |
| LAW_CONFLICT | dwa brzmienia albo dwa akty bez rozstrzygnięcia | ⚠️ z przyczyną |
| TRANSITIONAL_UNRESOLVED | ELI jest, ale brzmienia historycznego lub przepisu przejściowego nie odtworzono (§3) | ⚠️ [NIEWERYFIKOWANE] + przyczyna |
| VERIFIED_FULL_TEXT / VERIFIED_EXCERPT | orzeczenie potwierdzone w pełnym tekście / we fragmencie | FOUND, gradient TREŚĆ / FRAGMENT |
| UNVERIFIED_CITATION | sygnatura bez urzędowego potwierdzenia | NOT_FOUND, AMBIGUOUS, OUT_OF_SCOPE; NSA/WSA ze snapshotu 🟨 bez awansu |
| DISTINGUISHED / ADVERSE | inny stan faktyczny / teza przeciwna | opis różnicy / linia przeciwna |

UNVERIFIED_CITATION nie trafia do pisma końcowego. OUT_OF_SCOPE w bazie orzeczeń to brak pokrycia bazy, nie dowód
nieistnienia (weryfikator-orzeczen pkt 4).

## 3. TRANSITIONAL_UNRESOLVED (T03)

Stosuj, gdy zdarzenie jest sprzed obecnego tekstu jednolitego, a nie odtworzono brzmienia jednostki na dzień zdarzenia
(brak wersji historycznej, odnośniki nie rozstrzygają, przepis przejściowy aktu zmieniającego nieodczytany).
- Nie podawaj dzisiejszego brzmienia jako brzmienia z dnia zdarzenia; nie cytuj go w cudzysłowie jako obowiązującego wtedy.
- Wskaż, czego brakuje: akt zmieniający (Dz.U. z ELI), jego przepis przejściowy, wersja historyczna (TEMPORAL-LAW-CHECK
  T-4, `freshness.transitionalProvisions[]`, `asOf`).
- Norma kluczowa z tym statusem = pismo nie może dostać READY_FOR_HUMAN_REVIEW (G99 pkt 8); dopuszczalny DRAFT
  z ostrzeżeniem i listą do ustalenia.

## 4. Zakres sprawy: IN_SCOPE / OUT_OF_SCOPE (T08)

Teczka (folder, sprawa w aplikacji) może zawierać materiał kilku postępowań. Przed analizą ustal zakres:
1. Lista postępowań w materiale: sygnatura, sąd lub organ, strony, przedmiot.
2. Badane postępowanie = IN_SCOPE (wskazane przez użytkownika; bez wskazania — zapytaj, nie zgaduj).
3. Pozostałe = OUT_OF_SCOPE: nie przenoś z nich faktów, dat doręczeń, terminów, ustaleń ani dowodów do sprawy badanej.
4. Wyjątek: dokument z innej sprawy jako dowód w badanej (np. wyrok karny w sprawie cywilnej) — tylko jawnie, z jego
   sygnaturą i podstawą powołania; status faktu według §1, nie automatycznie CONFIRMED_CONTENT dla sprawy badanej.
5. W raporcie: `ZAKRES: IN_SCOPE <sygn.> · OUT_OF_SCOPE <sygn., sygn.>`. Ta sama osoba w dwóch sprawach nie łączy spraw.

## 5. Wagi, werdykty, status pliku

- Waga uchybienia: FATAL (eliminuje tryb lub zasadnicze żądanie; MOD-DOPUSZCZALNOSC-GATE) / MAJOR / MINOR / INFORMATIONAL.
- Werdykt audytu: PASS / PASS_WITH_TARGETED_FIX / BLOCKED / INSUFFICIENT_DATA / OUT_OF_SCOPE.
- Status pliku: DRAFT_UNVERIFIED (FATAL, LAW_UNVERIFIED lub TRANSITIONAL_UNRESOLVED w normie kluczowej, UNVERIFIED_CITATION,
  FILE CHECK FAIL) → DRAFT_REVIEWABLE (bez blokad, otwarte MAJOR/MINOR) → READY_FOR_HUMAN_REVIEW (HYBRID-VALIDATION
  z FILE CHECK PASS). Podpis i złożenie to czynność osoby uprawnionej; nie pisz, że pismo złożono.
- Ocena argumentu A/B/C/D to rola w piśmie, nie prawdopodobieństwo; bez niekalibrowanych procentów.

## 6. Ślad teza → źródło → akapit (finding)

Każde istotne ustalenie w raporcie W3 i w recenzji ma rekord:

```text
[F-n] TEZA: <jedno zdanie>
      FAKT: <status §1> — <dokument, strona/akapit lub sygnatura i karta akt>
      PRAWO: <status §2> — <przepis, ELI, data brzmienia>   ORZECZENIA: <status §2> — <sygnatura, akapit/teza>
      KONTRARGUMENT: <najmocniejszy>   WPŁYW: <co się zmienia, gdy teza upada>
      WAGA: FATAL/MAJOR/MINOR/INFORMATIONAL   DZIAŁANIE: <następny krok>   AKAPIT PISMA: <nr akapitu w projekcie>
```

Brak lokalizacji źródła (strona, akapit, karta) = status nie wyższy niż UNVERIFIED. Wersja JSON (pola: finding_id,
proposition, fact_status, source_locations[], norm_status, law_snapshot_ids[], precedent_ids[], opposing_argument,
impact_test, remedy, importance, next_action) nie zastępuje czytelnego rekordu.
