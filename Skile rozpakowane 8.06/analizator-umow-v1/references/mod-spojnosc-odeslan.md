# MODUŁ SPOJNOSC-ODESLAN — WERYFIKACJA §→§ (2-PASS)
## Analizator Umów v1 · Moduł Spójności Wewnętrznej

> **Wczytaj gdy (auto-trigger):** tryb ANALIZA LUB REDAKCJA i spełnione ≥2
> z poniższych warunków:
>   - umowa >15 stron lub >5 000 słów
>   - >15 paragrafów
>   - >10 odesłań §→§ w treści (np. „zgodnie z §X ust. Y")
>   - >3 niespójności wstępne wykryte w triage lub Fazie 0
>   - słowa kluczowe w treści umowy: „Załącznik", „z zastrzeżeniem",
>     „stosuje się odpowiednio", „jak wskazano powyżej", „zgodnie z §"
>
> **Wczytaj gdy (na żądanie):** frazy: „sprawdź odesłania", „czy paragrafy
> się zgadzają", „weryfikacja odesłań", „sprawdź spójność §", „renumeracja".
>
> **NIE wczytuj** przy prostych umowach ≤5 stron / ≤8 paragrafów.

> ⛔ HARD GATE — ten moduł nie zawiera przepisów — ale jeśli w toku
> weryfikacji powołujesz art. / § / Dz.U. dla uzasadnienia błędu →
> web_search/web_fetch do isap.sejm.gov.pl obowiązkowo.

---

## SO.0 — DLACZEGO 2 PASSY, NIE JEDEN

Modele językowe mają systematyczną tendencję do gubienia powiązań
między odległymi fragmentami długich dokumentów (attention dilution).
Relacje §18 → definicja w §2, niespójność kwoty w preambule i §3,
błędna renumeracja po edycji — są systematycznie pomijane przy
jednorazowym czytaniu, bo model „wie" co powinno być zamiast czytać co jest.

**Rozwiązanie:** rozdzielenie inwentaryzacji od weryfikacji.

```
Pass 1 — MODEL TYLKO LICZY I WYPISUJE (nie analizuje, nie ocenia)
Pass 2 — MODEL WERYFIKUJE KAŻDE ODESŁANIE OSOBNO W TABELI
```

Pass 1 bez analizy → Pass 2 weryfikuje każde odesłanie w izolacji.
Błąd w Pass 2 wynika z faktu, nie z domysłu.

---

## SO.1 — PASS 1: INWENTARYZACJA (nie analizuj — tylko wypisz)

### Zadanie Passu 1

Przeczytaj umowę **wyłącznie w celu wypisania list** poniżej.
W Passie 1 **nie oceniasz, nie weryfikujesz, nie komentarujesz**.
Tylko liczyj i wypisuj. STOP po wygenerowaniu wszystkich list.

### Lista 1: Odesłania §→§

Wypisz każde odesłanie wewnętrzne w formacie:

```
| Lokalizacja (gdzie odesłanie) | Cel (dokąd odsyła) | Cytat dosłowny |
|---|---|---|
| §3 ust. 2 | §7 ust. 1 pkt a) | „zgodnie z §7 ust. 1 pkt a)" |
| §5 ust. 4 | §2 (definicja) | „w rozumieniu §2 niniejszej Umowy" |
| ...     | ...     | ... |
```

### Lista 2: Definicje i ich użycia

Wypisz każde pojęcie pisane Wielką Literą:

```
| Pojęcie | Zdefiniowane w | Użyte w (§§) |
|---|---|---|
| „Utwór" | §2 ust. 1 | §6, §8 ust. 3, §11 |
| „Timesheet" | §2 ust. 4 | §4, §5 ust. 2 |
| ...     | ...     | ... |
```

Wypisz osobno pojęcia pisane Wielką Literą **bez definicji**:
```
Pojęcia bez definicji: [lista lub „brak"]
```

### Lista 3: Załączniki

```
| Nazwa załącznika | Wymieniony w preambule/treści | Przywołany w § |
|---|---|---|
| Załącznik nr 1 — Wzór Zamówienia | tak | §3 ust. 1 |
| Załącznik nr 2 — Timesheet | tak | §4 ust. 2 |
| ...     | ...     | ... |
```

### Lista 4: Kwoty i terminy

Wypisz każde wystąpienie kwoty (PLN, EUR lub %) i terminu (dni, miesięcy):

```
| Rodzaj | Wartość | Lokalizacja |
|---|---|---|
| Wynagrodzenie miesięczne | 15 000 PLN | §5 ust. 1 |
| Kara umowna | 0,5% dziennie | §9 ust. 2 |
| Termin płatności | 30 dni | §5 ust. 3 |
| ...     | ...     | ... |
```

### Format wyjścia Passu 1

```
## PASS 1 — INWENTARYZACJA SPÓJNA [nazwa umowy]

### Lista 1: Odesłania §→§ ([N] szt.)
[tabela]

### Lista 2: Definicje ([N] szt.) + Pojęcia bez definicji ([N] szt.)
[tabela] + [lista pojęć bez definicji]

### Lista 3: Załączniki ([N] szt.)
[tabela]

### Lista 4: Kwoty i terminy ([N] szt.)
[tabela]

---
Pass 1 ukończony. Przejdź do Pass 2.
```

---

## SO.2 — PASS 2: WERYFIKACJA (każde odesłanie osobno)

### Zadanie Passu 2

Korzystając wyłącznie z list z Passu 1, zweryfikuj **każdy element osobno**.
Nie polegaj na pamięci kontekstowej — sprawdzaj każde odesłanie jakby
było pierwszym. Wynik każdej weryfikacji: ✅ OK / ❌ BŁĄD / ⚠️ UWAGA.

### Weryfikacja Listy 1: Odesłania §→§

Dla każdego odesłania z Listy 1 sprawdź:

```
□ Czy wskazany §X ust. Y faktycznie istnieje w dokumencie?
□ Czy wskazany §X ust. Y zawiera to, do czego odsyła treść?
□ Czy po edycji/renumeracji odesłanie nadal jest aktualne?
```

Tabela weryfikacji:

```
| Odesłanie | Cel istnieje? | Cel zawiera właściwą treść? | Status |
|---|---|---|---|
| §3→§7 ust.1 pkt a) | ✅ tak | ✅ tak, klauzula IP | ✅ OK |
| §5 ust.4→§2 def. | ✅ tak | ❌ §2 nie definiuje pojęcia | ❌ BŁĄD |
```

### Weryfikacja Listy 2: Definicje

```
□ Każde pojęcie Wielką Literą ma definicję?
□ Definicja jest używana zgodnie z jej treścią?
□ Pojęcie ma jedną, nie dwie definicje w różnych §?
□ Nie ma wariantów pisowni tego samego pojęcia?
```

Tabela:

```
| Pojęcie | Ma definicję | Używane spójnie | Status |
|---|---|---|---|
| „Utwór" | ✅ §2 ust.1 | ✅ zawsze Wielką | ✅ OK |
| „Specjalista" | ❌ brak | N/D | ❌ BŁĄD |
| „specjalista" (mała) | — | — | ⚠️ prawdopodobnie to samo co Specjalista |
```

### Weryfikacja Listy 3: Załączniki

```
□ Każdy wymieniony załącznik jest przywołany w treści §?
□ Każdy przywołany w treści § załącznik jest wymieniony na liście?
□ Numeracja załączników jest ciągła (1, 2, 3... bez luk)?
```

### Weryfikacja Listy 4: Kwoty i terminy

```
□ Kwota w preambule = kwota w §?
□ Suma składowych = kwota łączna?
□ Terminy nie kolidują ze sobą (np. termin zapłaty ≠ termin wygaśnięcia)?
□ Kwoty słownie = kwoty cyframi (jeśli obie formy podane)?
□ Jednostki spójne (nie mix „dni" i „miesięcy" dla tej samej kwestii)?
```

---

## SO.3 — FORMAT RAPORTU WERYFIKACJI

```
## PASS 2 — RAPORT WERYFIKACJI SPÓJNOŚCI [nazwa umowy]

### ❌ BŁĘDY WYMAGAJĄCE KOREKTY ([N] szt.)

#### Błąd 1: [Krótki tytuł]
- **Lokalizacja:** §X ust. Y
- **Opis:** [co jest nie tak — konkretnie, z cytatem]
- **Skutek:** [co może wyniknąć — nieważność klauzuli / sprzeczność / luka]
- **Rekomendacja:** [konkretna poprawka brzmienia]

#### Błąd 2: [...]

### ⚠️ UWAGI DO ROZWAŻENIA ([N] szt.)

#### Uwaga 1: [Krótki tytuł]
- **Lokalizacja:** §X ust. Y
- **Opis:** [co budzi wątpliwość — nie błąd, ale ryzyko interpretacyjne]
- **Rekomendacja:** [opcjonalna poprawka]

### ✅ ELEMENTY ZWERYFIKOWANE POZYTYWNIE

Odesłania §→§: [N]/[N] poprawnych
Definicje: [N]/[N] zdefiniowanych i spójnych
Załączniki: [N]/[N] kompletnych
Kwoty/terminy: [N]/[N] spójnych

### OCENA SPÓJNOŚCI WEWNĘTRZNEJ: [XX/100]

[2–3 zdania uzasadnienia]
```

---

## SO.4 — INTEGRACJA Z RAPORTEM F.1

Wyniki weryfikacji §→§ wkomponuj do raportu F.1 analizatora jako sekcja:

```
## MODUŁ C — LOGIKA WEWNĘTRZNA I SPÓJNOŚĆ ODESŁAŃ
[wyniki SO.3 — błędy i uwagi]
[ocena spójności XX/100]
```

Jeśli raport F.1 nie był planowany — wygeneruj samodzielny raport SO.3
i zaproponuj: „Czy chcesz, żebym wykonał pełną analizę ryzyk?"

---

## SO.5 — BARDZO DŁUGIE UMOWY (30+ stron)

Przy umowach >30 stron lub >15 000 słów weryfikacja w jednej sesji
może być niewystarczająca ze względu na ograniczenia okna kontekstowego.

Komunikat obowiązkowy:

> „Umowa jest bardzo długa (>30 stron). Weryfikacja 2-pass w Claude może
> nie wychwycić wszystkich powiązań między odległymi fragmentami.
> Rekomenduje się uzupełnienie analizy w narzędziu RAG (np. NotebookLM),
> które pracuje na indeksie, a nie na długim kontekście.
> Kontynuuję weryfikację w zakresie dostępnego okna — wskaż priorytety."

Procedura: podziel weryfikację na sekcje, raportuj per sekcja.

---

*Moduł: mod-spojnosc-odeslan.md · v1.0 · Analizator Umów v1.6*
*Powiązania: mod-core-checklist.md (Moduł C) · SKILL.md (Faza 0 auto-trigger)*
*Uzupełnienie: /mnt/skills/user/shared/POST-VALIDATION.md (dokumenty generowane)*
