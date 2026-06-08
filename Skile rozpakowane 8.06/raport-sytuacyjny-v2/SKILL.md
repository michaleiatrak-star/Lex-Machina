---
name: raport-sytuacyjny-v2
version: 2.5
type: executive-raport
status: production
compatibility: "prawny-router-v3, web_search, web_fetch, show_widget"
description: |
  Raport Sytuacyjny Sprawy v2 — interaktywny widget graficzny renderowany inline.
  WYWOŁYWANY przez prawny-router-v3 w trzech trybach:
  [A] OBOWIĄZKOWY — po wygenerowaniu pisma lub ostatnim podsumowującym kroku.
  [B] PROPOZYCJA — po wgraniu i analizie dokumentów (tylko sugestia słowna).
  [C] NA ŻĄDANIE — gdy użytkownik pyta o aktualny stan sprawy.
  RENDERING: show_widget z HTML vanilla JS — NIE present_files, NIE JSX, NIE React.
  Dane sprawy wbudowane jako literały JS bezpośrednio w HTML widgetu.
  Zawiera: chronologię z weryfikacją źródeł, mapę ryzyk P1/P2/P3, sprzeczności
  i luki dowodowe, rekomendacje procesowe z priorytetem, eksport PDF.
---

# Raport Sytuacyjny Sprawy v2.5
# Kompatybilny z: prawny-router-v3

---

## ARCHITEKTURA

```
raport-sytuacyjny-v2/
├── SKILL.md                ← ten plik — jedyne źródło prawdy
└── assets/
    └── RaportSytuacyjnyWidget.html   ← dokumentacja struktury (nie używaj bezpośrednio)
```

---

## POZYCJA W PIPELINE ROUTERA v3

```
prawny-router-v3 SEKWENCJA GŁÓWNA:

KROK 0–4  → [analiza, skille, zbieranie danych]
KROK 5    → TYP WYJŚCIA (pismo / analiza / orzecznictwo)
KROK 6    → generowanie .docx / .pdf (jeśli pismo)
           ↓
     ★ RAPORT SYTUACYJNY [A] ★   ← PO KROK 6 (lub po ostatnim kroku)
           ↓
[Użytkownik kontynuuje / pyta]
           ↓
     ★ RAPORT [C] NA ŻĄDANIE ★
```

---

## TRYB [A] — OBOWIĄZKOWY

Wywołaj po **każdym** z poniższych zakończeń pipeline'u:

| Skill / moment | Konkretny punkt wywołania |
|---|---|
| **pisma-procesowe-v3** | Po `present_files` z gotowym `.docx` (KROK 6 routera) |
| **pisma-proste-v2** | Po checkliście finalnej i `present_files` |
| **analiza-sadowa-v6** | Po §10 Rekomendacje procesowe (Filtr #10/#11) |
| **przesluchanie-swiadkow-v2** | Po sekcji „Mowa końcowa" — ostatnim elemencie strategii |
| **analizator-dowodow-v3** | Po sekcji REKOMENDACJE (ostatni blok analizy) |
| **analizator-umow-v1** | Po §8 Rekomendacje zmian |
| **analizator-przepisow-v2** | Po §8 Rekomendacje — tylko przy konkretnej sprawie |
| **prawo-polskie-v2** | Po bloku REKOMENDACJA modułu dziedzinowego |
| **przewodnik-prawny-v2** | Po opcjach działania z konsekwencjami (ostatni krok LAIK) |
| **orzeczenia-sadowe-v2** | Po liście orzeczeń z linkami — tylko gdy sprawa konkretna |

---

## TRYB [B] — PROPOZYCJA po wgraniu dokumentów

```
WYZWALACZ:
  Użytkownik wgrywa plik (PDF, DOCX, skan) — akta, wyrok, umowa, pismo
  → po zakończeniu analizy treści dokumentu (nie przerywaj analizy)

ZACHOWANIE — tylko propozycja słowna, NIE widget automatycznie:
  "Przeanalizowałem dokumenty. Czy chcesz zobaczyć raport sytuacyjny sprawy
   z automatycznie wyciągniętymi danymi? Możesz go edytować na bieżąco."

Gdy użytkownik potwierdzi → wywołaj widget (sekwencja jak [A]).
Gdy odmówi lub milczy → kontynuuj bez widgetu.
```

---

## TRYB [C] — NA ŻĄDANIE (natychmiastowy)

```
FRAZY WYZWALAJĄCE — reaguj natychmiast, bez potwierdzenia:
  "aktualny stan sprawy" / "podsumuj sprawę" / "podsumowanie sprawy"
  "raport sprawy" / "raport sytuacyjny" / "pokaż raport"
  "co wiemy do tej pory" / "co ustaliliśmy" / "status sprawy" / "odśwież raport"
```

---

## KIEDY NIE GENEROWAĆ

```
✗ Pytanie abstrakcyjne o przepis — brak konkretnej sprawy
✗ Ogólna rozmowa prawna bez stanu faktycznego
✗ Tryb [B]: po dokumentach → TYLKO sugestia słowna
✗ W środku analizy — tylko po ostatnim kroku skilla
✗ analizator-przepisow-v2 przy pytaniach abstrakcyjnych (bez sprawy)
✗ orzeczenia-sadowe-v2 przy wyszukiwaniu bez konkretnej sprawy
```

---

## SEKWENCJA WYWOŁANIA — JEDYNA POPRAWNA METODA

```
KROK 1 — Przeanalizuj rozmowę → zbuduj blueprint JSON (schemat poniżej)
KROK 2 — Wykonaj walidację kompletności blueprintu (sekcja WALIDACJA)
KROK 3 — Wywołaj visualize:read_me z modules=["interactive","mockup"]
          (tylko jeśli nie załadowano w tej sesji)
KROK 4 — Wywołaj show_widget z widget_code zawierającym kompletny HTML widgetu:
          • dane sprawy jako literały JS wbudowane bezpośrednio w HTML
          • vanilla JS + CSS variables (var(--color-*))
          • BEZ React, BEZ importów, BEZ window.__INJECTED__
          • zakładki: Sprawa | Chronologia | Źródła | Ryzyka |
                      Luki i sprzeczności | Rekomendacje
          • przyciski sendPrompt dla następnych kroków w zakładce Rekomendacje
KROK 5 — Poprzedź widget komunikatem:
          "Poniżej aktualny raport sytuacyjny sprawy —
           możesz uzupełnić brakujące dane lub skorygować automatycznie
           rozpoznane informacje."

NIE WOLNO:
  ✗ kopiować pliku .jsx i udostępniać przez present_files
  ✗ używać bash cp + str_replace + present_files dla tego widgetu
  ✗ używać window.__INJECTED__
  ✗ używać Anthropic API do zasilania widgetu (dane z rozmowy, nie z API)
```

---

## BLUEPRINT JSON — SCHEMAT DANYCH

```json
{
  "tryb": "A|B|C",
  "przepis": "art. X KP/KK/...",
  "czyn": "opis roszczenia / czynu",
  "etap": "przedsądowy|I instancja|apelacja|kasacja|egzekucja",
  "dziedzina": "karne|cywilne|pracownicze|admin|rodzinne|spadkowe|gospodarcze",
  "sygnatura": null,
  "termin": null,
  "pilnosc": "natychmiastowa|wysoka|normalna|niska",
  "confidence": 0,
  "uwagi_pewnosci": "tekst",
  "s1rola": "powód|oskarżony|wnioskodawca|...",
  "s1opis": "opis strony 1",
  "s2rola": "pozwany|oskarżyciel|...",
  "s2opis": "opis strony 2",
  "zdarzenie": "1–3 zdania stanu faktycznego",
  "skutki": null,
  "p1lbl": "wygranie|skazanie|...",
  "p1pct": 0,
  "p1opis": null,
  "p2lbl": null,
  "p2pct": 0,
  "p2war": null,
  "sources": [
    {"status": "A|B|C|D|E", "type": "dokument|...", "name": "opis",
     "impact": "wysoki|średni|niski", "ryzyko": null}
  ],
  "dowody": [
    {"opis": "...", "poziom": "A|B|C|D", "typ": "...",
     "zrodlo": "...", "ryzyko": null}
  ],
  "risk_map": [
    {"level": "P1|P2|P3", "name": "...", "probability": "...",
     "wplyw": "...", "mitigation": "..."}
  ],
  "conflicts": [
    {"type": "...", "opis": "...", "znaczenie": "...", "rekomendacja": "..."}
  ],
  "chronologia": [
    {"data": "YYYY-MM-DD|null", "zdarzenie": "...", "zrodlo": "...",
     "status_zrodla": "zweryfikowane|częściowe|twierdzenie strony|brak źródła",
     "znaczenie_procesowe": "wysokie|średnie|niskie", "ryzyko": null}
  ],
  "procedural_recommendations": [
    {"text": "...", "deadline": "..."}
  ],
  "nastepnyKrok": null
}
```

**Reguła antyhalucynacyjna:** Pola bez podstawy w materiale → `null`. Nie wymyślaj dat, kwot, sygnatur ani stron. Jeśli data nie wynika z materiału → `null`.

**Pole `chronologia[]`:** Jeśli w historii rozmowy istnieje blok "DANE CHRONOLOGICZNE DLA RAPORTU SYTUACYJNEGO" wygenerowany przez chronologia-sprawy-v1 — wyciągnij go i użyj jako wartości tego pola.

```javascript
// Logika auto-zasilania chronologii w widgecie HTML:
const chronSource = window._chronologiaData || null;
if (chronSource && blueprint.chronologia.length === 0) {
  blueprint.chronologia = chronSource;
}
```

**Pola rozszerzone blueprintu** (wbuduj obok schematu głównego w widgecie):

```json
{
  "ustaleniaZeStatusemZrodla": [],
  "mapaRyzyk": [],
  "sprzecznosciILuki": [],
  "rekomendacjeProcesowe": [],
  "poziomPewnosciRaportu": 0,
  "ograniczeniaRaportu": []
}
```

`poziomPewnosciRaportu` 0–10: zakaz 9–10 przy braku źródeł dla kluczowych faktów.

---

## STATUS ŹRÓDEŁ — KLASYFIKACJA

Każde ustalenie faktyczne musi otrzymać jeden z pięciu statusów:

| Status | Znaczenie | Zasada |
|---|---|---|
| `A — źródło bezpośrednie` | dokument, nagranie, e-mail, decyzja, pismo, akt | mocne ustalenie |
| `B — źródło pośrednie` | relacja, opis, streszczenie, odpowiedź strony | wymaga ostrożności |
| `C — twierdzenie strony` | informacja wyłącznie od użytkownika lub przeciwnika | nie traktować jako udowodnione |
| `D — luka dowodowa` | brak dokumentu lub brak potwierdzenia | oznaczyć jako ryzyko |
| `E — sprzeczność` | dwa źródła mówią co innego | skierować do bloku sprzeczności |

Zakaz mieszania ustaleń kategorii A z twierdzeniami kategorii C bez oznaczenia statusu.

---

## MAPA RYZYK — FORMAT

```json
{
  "ryzyko": "opis",
  "kategoria": "dowodowe|prawne|terminowe|formalne|strategiczne|kosztowe|reputacyjne",
  "prawdopodobieństwo": "niskie|średnie|wysokie",
  "wpływ": "niski|średni|wysoki|krytyczny",
  "podstawa": "z czego wynika ryzyko",
  "działanie_mitygujące": "konkretna czynność",
  "priorytet": "P1|P2|P3"
}
```

Priorytety:
- `P1` — może przesądzić o wyniku lub terminie; działanie natychmiastowe.
- `P2` — istotne, nie blokuje biegu sprawy.
- `P3` — porządkowe lub strategiczne.

Kolorowanie w widgecie:
- P1: `border-left: 3px solid var(--color-border-danger)` + `background: var(--color-background-danger)`
- P2: `border-left: 3px solid var(--color-border-warning)` + `background: var(--color-background-warning)`
- P3: `border-left: 3px solid var(--color-border-tertiary)` + `background: var(--color-background-secondary)`

---

## SPRZECZNOŚCI I LUKI — FORMAT

```json
{
  "punkt": "czego dotyczy sprzeczność",
  "wersja_1": "opis + źródło",
  "wersja_2": "opis + źródło",
  "znaczenie": "wysokie|średnie|niskie",
  "rekomendacja": "jak usunąć sprzeczność"
}
```

Wykrywaj obligatoryjnie: sprzeczne daty, sprzeczne kwoty, sprzeczne wersje zdarzeń, brak dokumentu potwierdzającego kluczową tezę, brak dowodu doręczenia, nieustaloną właściwość sądu, nieustalony termin.

Jeśli nie wykryto sprzeczności i materiał był wystarczający → `"Nie wykryto sprzeczności w dostarczonym materiale"`.
Jeśli materiał niewystarczający → `"Brak wystarczających danych do oceny sprzeczności"`.

---

## REKOMENDACJE PROCESOWE — FORMAT

```json
{
  "działanie": "konkretna czynność",
  "cel": "co ma osiągnąć",
  "podstawa": "fakt/ryzyko/luka, z którego wynika",
  "termin": "data albo tryb: natychmiast / przed kolejnym pismem / przed rozprawą",
  "priorytet": "P1|P2|P3",
  "eskalacja_do_skilla": "nazwa skilla albo null"
}
```

Eskalacje (przyciski sendPrompt w zakładce Rekomendacje):

| Sytuacja | Eskalacja |
|---|---|
| Brak osi czasu | `chronologia-sprawy-v1` |
| Brak oceny dowodów | `analizator-dowodow-v3` |
| Potrzeba pisma | `pisma-procesowe-v3` |
| Pytania do świadka | `przesluchanie-swiadkow-v2` |
| Problem z podstawą prawną | `analizator-przepisow-v2` |
| Potrzeba orzecznictwa | `orzeczenia-sadowe-v2` |

---

## WALIDACJA KOMPLETNOŚCI BLUEPRINTU

Wykonaj przed renderowaniem widgetu:

```
POLA OBOWIĄZKOWE:
  □ dziedzina         → null?  → ⬛ [UZUPEŁNIJ: cywilne/karne/pracownicze/admin/inne]
  □ etap              → null?  → ⬛ [UZUPEŁNIJ: przedsądowy/I instancja/apelacja/...]
  □ s1rola + s1opis   → null?  → ⬛ [UZUPEŁNIJ: kim jest strona 1]
  □ s2rola + s2opis   → null?  → ⬛ [UZUPEŁNIJ: kim jest strona 2]
  □ zdarzenie         → null?  → ⬛ [UZUPEŁNIJ: stan faktyczny 1–3 zdania]
  □ p1lbl + p1pct     → null?  → ⬛ [UZUPEŁNIJ: scenariusz główny i prawdopodobieństwo]

POLA OSTRZEGAWCZE:
  □ sources[]         → pusta? → ⚠️ brak rejestru źródeł
  □ risk_map[]        → pusta? → ⚠️ brak mapy ryzyk
  □ chronologia[]     → pusta? → ⚠️ brak osi czasu — rozważ chronologia-sprawy-v1

WYNIK:
  0 pól ⬛ → GOTOWY    → renderuj widget
  1–2 ⬛  → CZĘŚCIOWY → renderuj widget z banerem "⚠️ Raport częściowy — uzupełnij pola [lista]"
  ≥3 ⬛   → ROBOCZY   → renderuj widget z banerem "⛔ Wersja robocza — brak kluczowych danych"
                        + wyświetl listę brakujących pól przed widgetem
```

Baner statusu w widgecie (sekcja Sprawa):

| Status | Kolor | Tekst |
|---|---|---|
| GOTOWY | `var(--color-background-success)` | `✅ Raport kompletny` |
| CZĘŚCIOWY | `var(--color-background-warning)` | `⚠️ Raport częściowy — uzupełnij pola [lista]` |
| ROBOCZY | `var(--color-background-danger)` | `⛔ Wersja robocza — brak kluczowych danych` |

---

## HARD GATES — ZAKAZY

Raport nie może być oznaczony jako gotowy gdy:

- nie oznaczono statusu źródeł kluczowych ustaleń,
- nie wskazano ryzyk procesowych,
- pominięto sprzeczności lub luki mimo widocznych rozbieżności,
- podano termin bez źródła,
- podano podstawę prawną bez weryfikacji albo zastrzeżenia,
- przedstawiono twierdzenie strony (status C) jako fakt udowodniony.
- `confidence` wynosi 9–10 przy braku źródeł dla kluczowych faktów.

W takim przypadku raport otrzymuje status `WERSJA ROBOCZA`.

---

## POZIOM PEWNOŚCI RAPORTU 0–10

| Poziom | Kryterium |
|---|---|
| 0–3 | Raport orientacyjny, materiał niewystarczający |
| 4–6 | Częściowa podstawa, istotne luki |
| 7–8 | Dobra podstawa, ograniczone ryzyka |
| 9–10 | Mocna podstawa źródłowa, brak istotnych luk |

Zakaz dawania 9–10 przy braku źródeł dla kluczowych faktów.

---

## FUNKCJE WIDGETU

- **6 zakładek:** Sprawa | Chronologia | Źródła | Ryzyka | Luki i sprzeczności | Rekomendacje
- **Baner statusu** (GOTOWY / CZĘŚCIOWY / ROBOCZY) w zakładce Sprawa
- **Auto-fill** — dane z rozmowy wyciągane automatycznie przy każdym otwarciu; brak Anthropic API
- **Detekcja trybu** — widget wykrywa [A]/[B]/[C] i pokazuje go w badge
- **Edycja inline** — metadane, strony, stan faktyczny, dowody, predykcja
- **Oznaczanie zmian** — niebieski kontur + badge "zmienione" na każdym edytowanym elemencie
- **Oznaczanie dowodów** — każdy dowód zmieniony względem auto-fill jest oznaczony
- **Historia zmian** — pełny log z godziną, cofanie Ctrl+Z, ponawianie Ctrl+Y
- **Resetuj** — powrót do stanu auto-fill jednym kliknięciem
- **Graceful fallback** — przy błędzie renderowania widget otwiera się w trybie ręcznym
  z amber-barem i komunikatem błędu; użytkownik uzupełnia pola ręcznie
- **Historia snapshota** — tryb ręczny zapisuje się jako "Tryb ręczny — brak auto-fill" w historii
- **Retry ×2 z backoffem** — przy błędzie: próba 1 natychmiast, próba 2 po 500 ms, próba 3 po 1000 ms
- **Timeout 15s** — AbortController przerywa fetch po 15 sekundach; nie blokuje widgetu
- **📄 Eksportuj PDF** — pełny raport: metadane, strony, stan faktyczny, rejestr dowodów,
  predykcja, chronologia, ryzyka, rekomendacje, historia zmian; otwiera dialog drukowania
- **Kontynuuj ↗** — sendPrompt do dalszej pracy z Claude
- **Przyciski sendPrompt** w zakładce Rekomendacje dla kolejnych kroków akcji

---

## INTEGRACJA Z PRAWNY-ROUTER-V3

Router v3 wywołuje ten skill jako **ostatni krok SEKWENCJI END-TO-END**
(po KROK 6 lub po ostatnim kroku skilla bez dokumentu).

Punkty self-check routera v3:
```
□ Czy po wygenerowaniu pisma/raportu wywołałem raport-sytuacyjny-v2? [A]
□ Czy po wgraniu dokumentów zaproponowałem raport-sytuacyjny-v2? [B]
□ Czy na żądanie użytkownika generuję raport-sytuacyjny-v2 natychmiast? [C]
```

---

## WALIDACJA KOŃCOWA — HYBRID-VALIDATION

Po wygenerowaniu widgetu:

```
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
```

FAZA 1 — auto-raport braków 🔴/🟡/🔵 (bez pytania o zgodę)
FAZA 2 — użytkownik uzupełnia wybrane punkty → wstawiaj precyzyjnie
FAZA 3 — licznik ⬛ + zamknięcie

---

## INTEGRACJA Z KANCELARYJNYM JĄDREM SHARED

Gdy wynik ma służyć strategii procesowej, ocenie ryzyka lub decyzji terminowej:

```
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Nie dubluj logiki shared w lokalnych plikach.
