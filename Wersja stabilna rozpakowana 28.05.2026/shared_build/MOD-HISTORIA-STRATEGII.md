# MOD-HISTORIA-STRATEGII — trwała historia ścieżek strategii procesowej

> Status: shared canonical. Konsumowany przez `MOD-WARIANTY-POZWU.md`,
> `MOD-PRIORYTETY-ASPEKTOW.md`, oraz zakładkę "Historia strategii" w
> `raport-sytuacyjny-v2`.

---

## 1. Problem i dwa tryby działania

Każda regeneracja W1 (pisma-procesowe-v3) lub checklisty priorytetów
(MOD-PRIORYTETY-ASPEKTOW) domyślnie NADPISUJE poprzedni wynik. Ten moduł
definiuje append-only log, żeby poprzednie warianty/wybory były dostępne do
przeglądu i powrotu.

```
TRYB A — Artifacts persistent storage (window.storage)
  Dostępny TYLKO w kontekście widgetu renderowanego przez show_widget.
  Działa w ramach JEDNEJ konwersacji/sesji artefaktu — NIE przetrwa
  między różnymi sesjami silnika ani różnymi konwersacjami z portalu.
  Zastosowanie: prototyp / demo / prezentacja klientowi w jednej sesji.

TRYB B — Portal wendora (PostgreSQL)
  Trwałość między sesjami, dostęp z dashboardu kancelarii.
  Silnik eksportuje JSON wg schematu §3 → portal przechowuje →
  portal odsyła jako kontekst wejściowy do W1 przy kolejnej sesji.
  To jest WŁAŚCIWE miejsce dla produkcyjnej trwałości.
```

⚠️ UWAGA DO UJAWNIENIA UŻYTKOWNIKOWI: jeśli stosowany jest TRYB A, system
musi poinformować, że historia nie przetrwa zamknięcia/zmiany konwersacji —
to realne ograniczenie, nie kosmetyczna uwaga.

---

## 2. Schema JSON (wspólna dla TRYB A i TRYB B)

```json
{
  "sprawa_id": "VII-P-94-25",
  "wersja": 3,
  "timestamp": "2026-06-15T10:00:00Z",
  "warianty_pozwu": [
    {
      "id": "W-A",
      "nazwa": "Roszczenie maksymalne + ryzyko kosztowe",
      "podstawa": "ASP-1 (główne)",
      "ryzyko": "P2",
      "koszt_orientacyjny": "⚠️ weryfikacja KSCU w W3",
      "styl_sugerowany": "stanowczy"
    },
    {
      "id": "W-B",
      "nazwa": "Wariant negocjacyjny",
      "podstawa": "ASP-1 (główne) + ASP-3 (poboczne, wspierające)",
      "ryzyko": "P1",
      "koszt_orientacyjny": "⚠️ weryfikacja KSCU w W3",
      "styl_sugerowany": "negocjacyjny"
    }
  ],
  "wybor": "W-A",
  "powod_odrzucenia": {"W-B": "Klient priorytetyzuje pełne roszczenie nad szybkością ugody"},
  "priorytety": {
    "aspekty_glowne": ["ASP-1"],
    "aspekty_poboczne": ["ASP-2", "ASP-3"],
    "metody_wybrane": {"ASP-2": ["MET-CA"]},
    "mapa_przepisow": {
      "ASP-1": [
        {"przepis": "⚠️ art. 151¹ KP (NIEWERYFIKOWANE)", "glebokosc": "BEZPOSREDNIE", "zgodnosc": "ZGODNA"}
      ]
    },
    "selekcja_dowodow": {
      "ASP-1": {
        "preslanka_1": {"dowod": "DOC-3", "ryzyko_wlasne": "niskie", "ryzyko_krzyzowe": "brak", "status": "zatwierdzony"},
        "preslanka_2": {"dowod": null, "status": "luka_istotna", "dzialanie": "wniosek o zobowiązanie"}
      },
      "ostrzezenia_krzyzowe": [
        {"dowod_id": "DOC-1", "szkodzi_tezie": "ASP-3", "waga": "krytyczne", "decyzja": "nie_uzywam"}
      ]
    }
  }
}
```

Pola `powod_odrzucenia` i `wybor` są opcjonalne przy pierwszym zapisie
(przed dokonaniem wyboru przez użytkownika) — wypełniane po checkpoint W1→W2.

---

## 3. TRYB A — implementacja Artifacts storage

### Schemat kluczy

```
strategie:{sprawa_id}:{wersja}      → JSON wg §2 (shared=false)
strategie-index:{sprawa_id}         → JSON {"wersje": [1, 2, 3], "aktualna": 3}
```

### Operacje

```javascript
// Odczyt indeksu
let index;
try {
  const r = await window.storage.get(`strategie-index:${sprawaId}`);
  index = r ? JSON.parse(r.value) : {wersje: [], aktualna: 0};
} catch (e) {
  index = {wersje: [], aktualna: 0};
}

// Nowy wpis — NIE nadpisuje poprzednich
const nowaWersja = index.aktualna + 1;
const wpis = { sprawa_id: sprawaId, wersja: nowaWersja, timestamp: new Date().toISOString(), ...danePozaSchematem };

try {
  await window.storage.set(`strategie:${sprawaId}:${nowaWersja}`, JSON.stringify(wpis), false);
  index.wersje.push(nowaWersja);
  index.aktualna = nowaWersja;
  await window.storage.set(`strategie-index:${sprawaId}`, JSON.stringify(index), false);
} catch (e) {
  console.error('Zapis historii strategii nieudany:', e);
  // UI: poinformuj użytkownika, że historia nie została zapisana
}

// Odczyt historii (do zakładki "Historia strategii")
const wszystkieWersje = [];
for (const w of index.wersje) {
  try {
    const r = await window.storage.get(`strategie:${sprawaId}:${w}`);
    if (r) wszystkieWersje.push(JSON.parse(r.value));
  } catch (e) { /* pomiń brakujący wpis */ }
}
```

### Rotacja przy dużej liczbie wersji

```
Jeśli index.wersje.length > 50:
  - zarchiwizuj wersje 1..N-50 do jednego skompresowanego klucza
    `strategie-archiwum:{sprawa_id}` (JSON array, jedno wywołanie set)
  - index.wersje pozostaje z ostatnimi 50 wpisami + wzmianką o archiwum
```

---

## 4. TRYB B — spec dla portalu wendora

### Tabela

```sql
CREATE TABLE case_strategy_history (
  case_id      TEXT NOT NULL,
  version      INTEGER NOT NULL,
  variants_json JSONB NOT NULL,   -- pełna treść wg schematu §2
  chosen       TEXT,               -- id wybranego wariantu (np. "W-A")
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (case_id, version)
);
```

### Endpointy (sugerowane)

```
POST /api/cases/{case_id}/strategy-history
  body: JSON wg §2 (bez case_id/version — generowane server-side)
  → 201, zwraca {version: N}

GET /api/cases/{case_id}/strategy-history?limit=20&before_version=N
  → lista wpisów wg §2, sortowane desc po version

GET /api/cases/{case_id}/strategy-history/latest
  → najnowszy wpis — wejście do W1 przy starcie nowej sesji silnika
```

### Integracja z silnikiem

```
Na starcie sesji (jeśli portal przekazuje case_id w kontekście):
  GET .../strategy-history/latest
  → jeśli istnieje, W1 pisma-procesowe-v3 wyświetla:
    "Wykryto poprzednią analizę strategii dla tej sprawy (wersja N, [data]).
     Wybrany wariant: [nazwa]. Czy kontynuować z tym wariantem, czy
     wygenerować nowe warianty od zera?"

Po checkpoint W1→W2 (zatwierdzenie wariantu):
  POST .../strategy-history z pełnym wpisem §2, chosen = wybrany wariant
```

---

## 5. Wybór trybu — reguła praktyczna

```
Brak wskazania case_id z portalu / praca w izolowanej konwersacji →
  TRYB A (Artifacts), z wyraźnym ostrzeżeniem o nietrwałości.

case_id dostępny w kontekście (np. portal przekazał identyfikator sprawy) →
  TRYB B — silnik generuje JSON wg §2 i sygnalizuje, że dane powinny być
  zapisane przez portal (silnik sam nie ma dostępu do bazy portalu —
  eksportuje JSON, portal go konsumuje).
```

---

## 6. Self-check

```
□ Czy nowy wpis historii NIE nadpisuje poprzedniego (nowy klucz/wersja)?
□ Czy użytkownik został poinformowany o trybie (A=nietrwałe / B=trwałe)?
□ Czy schema JSON wpisu jest identyczna w TRYB A i TRYB B (przenośność)?
□ Przy TRYB A — czy index.wersje.length sprawdzany pod kątem rotacji (>50)?
```
