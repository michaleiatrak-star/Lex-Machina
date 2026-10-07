# SCHEMAT-ODPOWIEDZI-MCP.md
## MCP-INTEGRACJA.md — ustrukturyzowany format wyniku, którego oczekuje KROK 2

Każdy connector podłączony pod ten protokół powinien (w miarę możliwości technicznych
danego serwera MCP) zwracać wynik, który da się sprowadzić do poniższej struktury —
niezależnie od tego, w jakim natywnym formacie odpowiada dany serwer.

```json
{
  "status": "FOUND | NOT_FOUND | AMBIGUOUS | OUT_OF_SCOPE | ERROR",
  "query_type": "akt_prawny | orzeczenie | podmiot",
  "source": "sejm-eli | saos | cbosa | kio | eurlex | krs",
  "result": {
    "identyfikator": "np. Dz.U. 2026 poz. 795 / sygnatura / KRS 0000123456",
    "tytul_lub_nazwa": "string",
    "status_obowiazywania": "obowiazuje | uchylony | tekst_jednolity_nieaktualny | nieznany",
    "data_publikacji_lub_wyroku": "YYYY-MM-DD",
    "url_zrodlowy": "https://..."
  },
  "retrieved_at": "ISO-8601 timestamp",
  "confidence": "deterministic"
}
```

## Reguły klasyfikacji dla KROK 2 (shared/MCP-INTEGRACJA.md)

- `status: "FOUND"` + `status_obowiazywania: "obowiazuje"` → ✅ MCP-VERIFIED, można
  użyć `identyfikator` jako potwierdzonego powołania.
- `status: "FOUND"` + `status_obowiazywania: "uchylony"` lub
  `"tekst_jednolity_nieaktualny"` → **nie jest to potwierdzenie aktualności** —
  traktuj jak sygnał, że trzeba znaleźć nowszy t.j. (przejście do KROK 3, HARD GATE,
  żeby ustalić aktualny numer).
- `status: "NOT_FOUND"` → przejście do KROK 3 (fallback), nie interpretuj jako
  "akt nie istnieje".
- `status: "AMBIGUOUS"` → przejście do KROK 3 z doprecyzowaniem zapytania.
- `status: "OUT_OF_SCOPE"` (od 3.94) → baza nie pokrywa zapytania albo wyniku nie da się rozstrzygnąć
  (fail-closed: drift HTML, niepełna paginacja, CAPTCHA; NSA/WSA w SAOS; brak exact-hit w CBOSA).
  ⛔ NIGDY dowód nieistnienia i NIGDY „sygnatura prawdopodobnie zmyślona” — przejdź do następnego
  źródła wg HARDGATE (dla NSA/WSA: `PRAWO-HARDGATE-ORZECZENIA.md` KROK 0A pkt 2). Pole `powod` podaje przyczynę.
  Odpowiada statusowi OUT_OF_SCOPE kontraktu `SYGNATURY.md` — oba kontrakty mają teraz tę samą wartość.
  (Do 3.93 serwery sygnalizowały to polem `zakres` przy `status: "NOT_FOUND"` — pole wycofane: skill
  czytający tylko `status` wziąłby prawdziwe orzeczenie NSA za zmyślone.)
- `status: "ERROR"` (timeout, błąd serwera, brak autoryzacji) → traktuj identycznie
  jak "MCP niedostępne" w KROK 1/3 — nigdy nie ujawniaj użytkownikowi surowego
  komunikatu błędu technicznego, tylko oznaczenie ⚠️ [WERYFIKACJA PROMPTOWA].

## Jeśli connector nie potrafi zwrócić tej struktury

Część istniejących serwerów MCP zwraca wolny tekst lub własny format. W takim
wypadku Claude powinien sam zinterpretować odpowiedź connectora względem
powyższych pięciu statusów (FOUND/NOT_FOUND/AMBIGUOUS/OUT_OF_SCOPE/ERROR) na podstawie treści
zwrotu — nie wymagaj literalnie tego JSON-a jako warunku działania protokołu.
Schemat powyżej to punkt odniesienia przy projektowaniu/wyborze connectora przez
developera, nie sztywny wymóg wejściowy blokujący użycie istniejących serwerów.
