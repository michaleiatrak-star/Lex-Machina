---
name: raport-sytuacyjny-v2
version: 2.4-render-fix
compatibility: "prawny-router-v3, web_search, web_fetch, Anthropic API"
description: |
  Raport Sytuacyjny Sprawy v2 — interaktywny widget graficzny renderowany inline.

  WYWOŁYWANY przez prawny-router-v3 w trzech trybach:
  [A] OBOWIĄZKOWY — po wygenerowaniu pisma lub ostatnim podsumowującym kroku
  [B] PROPOZYCJA — po wgraniu i analizie dokumentów (tylko sugestia słowna)
  [C] NA ŻĄDANIE — gdy użytkownik pyta o aktualny stan sprawy

  RENDERING: show_widget z HTML (vanilla JS) — NIE present_files, NIE JSX asset.
  Dane wbudowane bezpośrednio w HTML jako literały JS.
---

# Raport Sytuacyjny Sprawy v2.4-render-fix
# Kompatybilny z: prawny-router-v3

---

## ARCHITEKTURA

```
raport-sytuacyjny-v2/
├── SKILL.md
└── assets/
    └── RaportSytuacyjnyWidget.html   ← standalone artefakt React JSX
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
| **analiza-sadowa-v5** | Po §10 Rekomendacje procesowe (Filtr #10/#11) |
| **przesluchanie-swiadkow-v2** | Po sekcji „Mowa końcowa" — ostatnim elemencie strategii |
| **analizator-dowodow-v3** | Po sekcji REKOMENDACJE (ostatni blok analizy) |
| **analizator-umow-v1** | Po §8 Rekomendacje zmian |
| **analizator-przepisow-v2** | Po §8 Rekomendacje (Zakładka 6) — tylko przy konkretnej sprawie |
| **prawo-polskie-v2** | Po bloku REKOMENDACJA modułu dziedzinowego |
| **przewodnik-prawny-v1** | Po opcjach działania z konsekwencjami (ostatni krok LAIK) |
| **orzeczenia-sadowe-v2** | Po liście orzeczeń z linkami — tylko gdy sprawa konkretna |

```
SEKWENCJA WYWOŁANIA [A] — JEDYNA POPRAWNA METODA:
  1. Przeanalizuj rozmowę → zbuduj blueprint JSON ze schematu poniżej
  2. Wywołaj visualize:read_me z modules=["interactive","mockup"] (jeśli nie załadowano)
  3. Wywołaj show_widget z widget_code zawierającym kompletny HTML widgetu
     — dane sprawy jako literały JS wbudowane bezpośrednio w HTML
     — vanilla JS + CSS variables (var(--color-*)) — BEZ React, BEZ importów
     — zakładki: Sprawa | Chronologia | Źródła | Ryzyka | Luki i sprzeczności | Rekomendacje
     — przyciski sendPrompt dla następnych kroków w zakładce Rekomendacje
  4. Poprzedź widgetem komunikat (patrz niżej)

NIE WOLNO:
  ✗ kopiować pliku .jsx i udostępniać przez present_files — plik .jsx nie renderuje się w claude.ai
  ✗ używać bash cp + str_replace + present_files dla tego widgetu
  ✗ używać window.__INJECTED__ — to mechanizm JSX, nie działa w show_widget HTML

SCHEMAT JSON blueprintu:
  { tryb:"A|B|C",
    przepis:"art. X KP/KK/...", czyn:"opis roszczenia/czynu",
    etap:"przedsądowy|I instancja|apelacja|...",
    dziedzina:"karne|cywilne|pracownicze|admin|rodzinne|spadkowe|gospodarcze",
    sygnatura:null, termin:null, pilnosc:"natychmiastowa|wysoka|normalna|niska",
    confidence:0, uwagi_pewnosci:"tekst",
    s1rola:"powód|oskarżony|...", s1opis:"opis strony",
    s2rola:"pozwany|oskarżyciel|...", s2opis:"opis strony",
    zdarzenie:"1-3 zdania stanu faktycznego", skutki:null,
    p1lbl:"wygranie|skazanie|...", p1pct:0, p1opis:null,
    p2lbl:null, p2pct:0, p2war:null,
    sources:[{status:"A|B|C|D|E", type:"dokument|...", name:"opis", impact:"wysoki|...", ryzyko:null}],
    dowody:[{opis:"...", poziom:"A|B|C|D", typ:"...", zrodlo:"...", ryzyko:null}],
    risk_map:[{level:"P1|P2|P3 — opis", name:"...", probability:"...", wplyw:"...", mitigation:"..."}],
    conflicts:[{type:"...", opis:"...", znaczenie:"...", rekomendacja:"..."}],
    chronologia:[{data:"YYYY-MM-DD|null", zdarzenie:"...", zrodlo:"...",
                  status_zrodla:"zweryfikowane|częściowe|twierdzenie strony|brak źródła",
                  znaczenie_procesowe:"wysokie|średnie|niskie", ryzyko:null}],
    procedural_recommendations:[{text:"...", deadline:"..."}],
    nastepnyKrok:null }
  Pola null → null. Brak danych w rozmowie → null (nie wymyślaj).

KOMUNIKAT przed widgetem (zawsze):
  "Poniżej aktualny raport sytuacyjny sprawy —
   możesz uzupełnić brakujące dane lub skorygować automatycznie rozpoznane informacje."
```

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
FRAZY WYZWALAJĄCE — reaguj na każdą z nich natychmiast:
  "aktualny stan sprawy"
  "podsumuj sprawę" / "podsumowanie sprawy"
  "raport sprawy" / "raport sytuacyjny" / "pokaż raport"
  "co wiemy do tej pory" / "co ustaliliśmy"
  "status sprawy" / "odśwież raport"

→ Wywołaj widget natychmiast, bez pytania, bez potwierdzenia.
```

---

## KIEDY NIE GENEROWAĆ

```
✗ Pytanie abstrakcyjne o przepis — brak konkretnej sprawy
✗ Ogólna rozmowa prawna bez stanu faktycznego
✗ Tryb [B]: po dokumentach → TYLKO sugestia słowna
✗ W środku analizy — tylko po ostatnim kroku
✗ analizator-przepisow-v2 przy pytaniach abstrakcyjnych (bez sprawy)
✗ orzeczenia-sadowe-v2 przy wyszukiwaniu bez konkretnej sprawy
```

---

## FUNKCJE WIDGETU v2.2

- **Auto-fill** — Anthropic API wyciąga dane z rozmowy przy każdym otwarciu
- **Retry ×2 z backoffem** — przy błędzie API: próba 1 natychmiast, próba 2 po 500ms, próba 3 po 1000ms
- **Timeout 15s** — AbortController przerywa fetch po 15 sekundach; nie blokuje widgetu
- **Graceful fallback** — po 3 nieudanych próbach widget otwiera się w trybie ręcznym z amber-barem i komunikatem błędu; użytkownik uzupełnia pola ręcznie
- **Historia snapshota** — tryb ręczny zapisuje się jako "Tryb ręczny — brak auto-fill" w historii
- **Detekcja trybu** — widget wykrywa [A]/[B]/[C] i pokazuje go w badge
- **Edycja inline** — metadane, strony, stan faktyczny, dowody, predykcja
- **Oznaczanie zmian** — niebieski kontur + badge "zmienione" na każdym edytowanym elemencie
- **Oznaczanie dowodów** — każdy dowód zmieniony względem auto-fill jest oznaczony
- **Historia zmian** — pełny log z godziną, cofanie Ctrl+Z, ponawianie Ctrl+Y
- **Resetuj** — powrót do stanu auto-fill jednym kliknięciem
- **📄 Eksportuj PDF** — generuje sformatowany raport PDF z wszystkimi sekcjami: metadane, strony, stan faktyczny, rejestr dowodów, predykcja, historia zmian; otwiera dialog drukowania przeglądarki
- **Kontynuuj ↗** — sendPrompt do dalszej pracy z Claude

---

## INTEGRACJA Z PRAWNY-ROUTER-V3

Router v3 wywołuje ten skill jako **ostatni krok SEKWENCJI END-TO-END**
(po KROK 6 — generowaniu dokumentu, lub po ostatnim kroku skilla bez dokumentu).

Dodaj do SELF-CHECK routera v3:
```
□ Czy po wygenerowaniu pisma/raportu wywołałem raport-sytuacyjny-v2? [A]
□ Czy po wgraniu dokumentów zaproponowałem raport-sytuacyjny-v2? [B]
□ Czy na żądanie użytkownika generuję raport-sytuacyjny-v2 natychmiast? [C]
```

---

## WALIDACJA KOŃCOWA — HYBRID-VALIDATION

Po wygenerowaniu dokumentu/raportu/analizy/listy pytań w tym skilla:

```
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
```

FAZA 1 — auto-raport braków 🔴/🟡/🔵 (bez pytania o zgodę)
FAZA 2 — użytkownik uzupełnia wybrane punkty → wstawiaj precyzyjnie
FAZA 3 — licznik ⬛ + zamknięcie

Pełna logika: `/mnt/skills/user/shared/HYBRID-VALIDATION.md`

---

## ARCHITEKTURA RENDEROWANIA — OBOWIĄZKOWA REGUŁA WYKONAWCZA

> ⚠️ KOREKTA KRYTYCZNA v2.4 — nadpisuje wszystkie wcześniejsze instrukcje renderowania w tym pliku.

### Dlaczego NIE używamy present_files z plikiem .jsx

Pliki `.jsx` udostępnione przez `present_files` NIE renderują się wizualnie w interfejsie claude.ai — użytkownik widzi wyłącznie link do pobrania pliku, bez żadnej treści. Jest to błąd architektoniczny poprzedniej wersji skilla.

### Jedyna poprawna metoda renderowania: `show_widget`

Raport sytuacyjny ZAWSZE renderuj przez narzędzie `show_widget` z kodem HTML.
Nigdy nie używaj `present_files` ani `cp ... /mnt/user-data/outputs/` dla tego widgetu.
Plik `assets/RaportSytuacyjny.jsx` jest wyłącznie dokumentacją struktury — nie kopiuj go ani nie modyfikuj.

### Sekwencja wywołania — obowiązkowa dla każdego trybu [A]/[B]/[C]

1. Przeanalizuj rozmowę i zbuduj blueprint JSON zgodny ze schematem poniżej.
2. Wywołaj `visualize:read_me` z modułami `["interactive", "mockup"]` (jeśli jeszcze nie załadowano w tej sesji).
3. Wywołaj `show_widget` z parametrem `widget_code` zawierającym kompletny HTML widgetu z danymi sprawy wbudowanymi jako literały JS — BEZ żadnych zewnętrznych zależności, BEZ `window.__INJECTED__`, BEZ importów React.
4. Widget musi używać wyłącznie vanilla JS + inline CSS z CSS variables (`var(--color-*)`).
5. Nie wywołuj `present_files` dla widgetu raportu sytuacyjnego.

### Struktura obowiązkowa widgetu HTML

Widget musi zawierać co najmniej następujące sekcje jako zakładki (tabs, przełączane przez JS):

- **Sprawa** — metadane, strony, stan faktyczny, predykcja z paskiem procentowym
- **Chronologia** — lista zdarzeń z datami, źródłami i statusem weryfikacji
- **Źródła** — tabela A/B/C/D/E z opisem i ryzykiem każdego źródła
- **Ryzyka** — mapa ryzyk P1/P2/P3 z kolorowaniem (danger/warning/secondary)
- **Luki i sprzeczności** — wykryte sprzeczności i brakujące dowody
- **Rekomendacje** — lista kroków P1/P2/P3 z terminami + przyciski `sendPrompt` dla kolejnych akcji

### Schemat danych — pola obowiązkowe blueprintu

```
dziedzina, przepis, etap, pilnosc, confidence (0-10), uwagi_pewnosci
s1rola, s1opis, s2rola, s2opis
zdarzenie, skutki
p1lbl, p1pct, p1opis, p2lbl, p2pct, p2war
sources[]  → {status:"A|B|C|D|E", type, name, impact, ryzyko}
dowody[]   → {opis, poziom:"A|B|C|D", typ, zrodlo, ryzyko}
risk_map[] → {level:"P1|P2|P3 — opis", name, probability, wplyw, mitigation}
conflicts[] → {type, opis, znaczenie, rekomendacja}
chronologia[] → {data, zdarzenie, zrodlo, status_zrodla, znaczenie_procesowe, ryzyko}
procedural_recommendations[] → {text, deadline}
nastepnyKrok
```

Pola z brakiem danych w materiale → wpisz `null` lub pustą tablicę — NIE wymyślaj.

### Reguła kolorowania ryzyk w HTML

- P1 (krytyczne): `border-left: 3px solid var(--color-border-danger)` + `background: var(--color-background-danger)` + `color: var(--color-text-danger)`
- P2 (istotne): `border-left: 3px solid var(--color-border-warning)` + `background: var(--color-background-warning)` + `color: var(--color-text-warning)`
- P3 (porządkowe): `border-left: 3px solid var(--color-border-tertiary)` + `background: var(--color-background-secondary)` + `color: var(--color-text-secondary)`

### Reguła przycisków akcji

W zakładce Rekomendacje dodaj przyciski wywołujące `sendPrompt(...)` dla:
- Weryfikacji przepisów w ISAP (jeśli nie zweryfikowano)
- Sporządzenia pisma procesowego (jeśli sprawa jest gotowa)
- Innych następnych kroków wynikających z blueprintu

### Podział odpowiedzialności

- `SKILL.md` → analiza merytoryczna, dobór trybu, budowa blueprintu JSON
- `references/` → bramki walidacyjne (SOURCE-STATUS-MATRIX, PROCESS-RISK-MAP, itd.)
- Rendering → wyłącznie przez `show_widget` z HTML (vanilla JS)


---

# MIN8 QUALITY UPGRADE

Ten skill działa z dodatkowym kontraktem jakościowym `upgrade-min8/MIN8-UPGRADE.md` oraz checklistą `upgrade-min8/QUALITY-CHECKLIST.md`.

## Obowiązkowe reguły wykonawcze
- stosuj twarde bramki źródłowe dla przepisów i orzecznictwa,
- odróżniaj fakty, interpretacje, hipotezy i ryzyka,
- nie przyjmuj twierdzeń użytkownika jako udowodnionych bez dowodu,
- wskazuj poziom pewności 0–10,
- eskaluj do właściwego skilla, gdy sprawa wykracza poza zakres modułu,
- nie duplikuj funkcji `shared`; referuj do nich jako zależności.

## Status modernizacji
Docelowy poziom jakościowy: minimum 8.0/10 przy użyciu wspólnego kontraktu `SKILL-CONTRACT-MIN8`.


---

# MIN8.5 QUALITY UPGRADE — RAPORT SYTUACYJNY PROCESOWY

Cel tej iteracji: podnieść moduł z poziomu raportowo-statusowego do poziomu procesowo-analitycznego, bez zmiany roli modułu jako końcowego raportu sytuacyjnego.

## Zakres obowiązkowy od v2.3-min85

Raport nie może być wyłącznie podsumowaniem. Musi zawierać pięć bloków kontrolnych:

1. **Chronologia z odniesieniem do źródeł**
2. **Status źródeł każdego ustalenia**
3. **Mapa ryzyk procesowych**
4. **Sprzeczności, luki i punkty wymagające dowodu**
5. **Rekomendacje procesowe z priorytetem działania**

Jeżeli brakuje danych do któregokolwiek bloku, wpisz `brak danych w materiale`, a nie uzupełniaj domyślnie.

---

## 1. POWIĄZANIE Z CHRONOLOGIĄ

### Obowiązkowa integracja

Jeżeli w sprawie występują daty, zdarzenia, terminy, pisma, decyzje, czynności stron albo dowody czasowe, raport musi załadować logikę:

```text
/mnt/skills/user/chronologia-sprawy-v1/SKILL.md
```

albo jej aktualną iterację `chronologia-sprawy-v1-min8`, jeżeli jest dostępna.

### Wymagany format ustalenia chronologicznego

Każde istotne zdarzenie w raporcie musi mieć strukturę:

```json
{
  "data": "YYYY-MM-DD lub null",
  "zdarzenie": "krótki opis",
  "źródło": "nazwa dokumentu / wiadomości / wypowiedzi / brak",
  "status_źródła": "zweryfikowane | częściowe | twierdzenie strony | brak źródła",
  "znaczenie_procesowe": "wysokie | średnie | niskie",
  "ryzyko": "opis ryzyka albo null"
}
```

### Reguła antyhalucynacyjna

Nie wolno porządkować zdarzeń według dat domniemanych. Jeżeli data nie wynika z materiału, wpisz `null` i oznacz zdarzenie jako wymagające uzupełnienia.

---

## 2. STATUS ŹRÓDEŁ KAŻDEGO USTALENIA

Każde ustalenie faktyczne w raporcie musi otrzymać jeden z pięciu statusów:

| Status | Znaczenie | Wpływ na raport |
|---|---|---|
| `A — źródło bezpośrednie` | dokument, nagranie, e-mail, decyzja, pismo, akt | można używać jako mocnego ustalenia |
| `B — źródło pośrednie` | relacja, opis, streszczenie, odpowiedź strony | wymaga ostrożności |
| `C — twierdzenie strony` | informacja wyłącznie od użytkownika lub przeciwnika | nie traktować jako udowodnione |
| `D — luka dowodowa` | brak dokumentu lub brak potwierdzenia | oznaczyć jako ryzyko |
| `E — sprzeczność` | dwa źródła mówią co innego | skierować do bloku sprzeczności |

### Reguła wykonawcza

W sekcji „co wiadomo” nie wolno mieszać ustaleń kategorii A z twierdzeniami kategorii C bez oznaczenia statusu.

---

## 3. MAPA RYZYK PROCESOWYCH

Raport musi zawierać tabelę ryzyk.

### Minimalny schemat ryzyka

```json
{
  "ryzyko": "opis",
  "kategoria": "dowodowe | prawne | terminowe | formalne | strategiczne | kosztowe | reputacyjne",
  "prawdopodobieństwo": "niskie | średnie | wysokie",
  "wpływ": "niski | średni | wysoki | krytyczny",
  "podstawa": "z czego wynika ryzyko",
  "działanie_mitygujące": "konkretna czynność",
  "priorytet": "P1 | P2 | P3"
}
```

### Priorytety

- `P1` — ryzyko może przesądzić o wyniku albo terminie; wymaga działania natychmiast.
- `P2` — istotne, ale nie blokuje biegu sprawy.
- `P3` — porządkowe albo strategiczne.

---

## 4. SPRZECZNOŚCI, LUKI I PUNKTY DOWODOWE

Raport musi wykrywać i ujawniać:

- sprzeczne daty,
- sprzeczne kwoty,
- sprzeczne wersje zdarzeń,
- brak dokumentu potwierdzającego kluczową tezę,
- brak dowodu doręczenia,
- brak źródła przepisu/orzeczenia,
- niejasny status strony lub roszczenia,
- nieustaloną właściwość sądu/organu,
- nieustalony termin.

### Format sprzeczności

```json
{
  "punkt": "czego dotyczy sprzeczność",
  "wersja_1": "opis + źródło",
  "wersja_2": "opis + źródło",
  "znaczenie": "wysokie | średnie | niskie",
  "rekomendacja": "jak usunąć sprzeczność"
}
```

Jeżeli nie wykryto sprzeczności, wpisz: `Nie wykryto sprzeczności w dostarczonym materiale`, ale tylko wtedy, gdy materiał był wystarczający do takiej oceny. W przeciwnym razie wpisz: `Brak wystarczających danych do oceny sprzeczności`.

---

## 5. REKOMENDACJE PROCESOWE

Każdy raport musi kończyć się rekomendacjami procesowymi. Nie mogą być ogólne.

### Format rekomendacji

```json
{
  "działanie": "konkretna czynność",
  "cel": "co ma osiągnąć",
  "podstawa": "fakt/ryzyko/luka, z którego wynika",
  "termin": "data albo tryb: natychmiast / przed kolejnym pismem / przed rozprawą",
  "priorytet": "P1 | P2 | P3",
  "eskalacja_do_skilla": "nazwa skilla albo null"
}
```

### Przykładowe eskalacje

- brak osi czasu → `chronologia-sprawy-v1-min8`
- brak oceny dowodów → `analizator-dowodow-v3-min8`
- potrzeba pisma → `pisma-procesowe-v3`
- pytania do świadka → `przesluchanie-swiadkow-v2`
- problem z podstawą prawną → `analizator-przepisow-v2-min8`
- potrzeba orzecznictwa → `orzeczenia-sadowe-v2`

---

## 6. ROZSZERZONY BLUEPRINT RAPORTU

Od v2.3-min85 blueprint powinien zawierać dodatkowe pola:

```json
{
  "chronologia": [],
  "ustaleniaZeStatusemŹródła": [],
  "mapaRyzyk": [],
  "sprzecznościILuki": [],
  "rekomendacjeProcesowe": [],
  "poziomPewnościRaportu": 0,
  "ograniczeniaRaportu": []
}
```

### Poziom pewności raportu 0–10

- `0–3` — raport orientacyjny, materiał niewystarczający,
- `4–6` — częściowa podstawa, istotne luki,
- `7–8` — dobra podstawa, ograniczone ryzyka,
- `9–10` — mocna podstawa źródłowa, brak istotnych luk.

Nie wolno dawać `9–10`, jeżeli brak źródeł dla kluczowych faktów.

---

## 7. HARD GATES

Raport nie może zostać oznaczony jako gotowy, jeżeli:

- nie oznaczono statusu źródeł kluczowych ustaleń,
- nie wskazano ryzyk procesowych,
- pominięto sprzeczności lub luki mimo widocznych rozbieżności,
- podano termin bez źródła,
- podano podstawę prawną bez weryfikacji albo zastrzeżenia,
- przedstawiono twierdzenie strony jako fakt udowodniony.

W takim przypadku raport otrzymuje status:

```text
WERSJA ROBOCZA — wymaga uzupełnienia źródeł / dowodów / terminów
```

---

## 8. OCENA DOCELOWA

Po tej modernizacji moduł powinien być oceniany nie niżej niż 8.5/10, pod warunkiem że router rzeczywiście wymusza użycie powyższych bloków oraz nie pomija walidacji `HYBRID-VALIDATION`.
