---
name: audyt-systemu-v4
version: 4.6
type: governance-audit
compatibility:
  - Claude
  - Modular Legal Skills
entrypoint: SKILL.md
modules:
  - modules/MOD-INTERLINIE.md     # usuwanie zbędnych pustych linii
  - modules/MOD-WSTAWKI.md        # usuwanie wstawek opisowych
  - modules/MOD-DESCRIPTION.md    # walidacja długości description (limit 1024)
widgets:
  - widgets/WIDGET-MENU.md        # interaktywne menu wielokrotnego wyboru
references:
  - references/AUDIT-JOURNAL.md
  - references/CHECKLIST-DEDUP.md   # mapa pojęć → lokalizacje (5 not, NOTA-6 ORPHAN dodana 06-14g)
  - references/mapa_dzu_2026-07-04.md   # aktualna mapa Dz.U. (439 wierszy); 07-02 poprzednia wersja
---

# audyt-systemu-v4 — Orchestrator Audytu Systemu Prawnego

## Cel
Audyt jakości, spójności i bezpieczeństwa systemu prawniczych skilli AI.
Po zakończeniu audytu: **obowiązkowa aktualizacja plików references**.

---

## FAZA 0 — WCZYTANIE REFERENCES (ZAWSZE PIERWSZE)

Przed jakimkolwiek działaniem wczytaj:

```
view /mnt/skills/user/audyt-systemu-v4/references/AUDIT-JOURNAL.md
view /mnt/skills/user/audyt-systemu-v4/references/CHECKLIST-DEDUP.md
view /mnt/skills/user/audyt-systemu-v4/references/mapa_dzu_2026-07-04.md
```

Celem jest ustalenie:
- Jaki był wynik ostatniego audytu (AUDIT-JOURNAL.md → ostatni wpis `## AUDYT-YYYY-MM-DD`)
- Czy wprowadzane zmiany dotyczą pojęcia już skatalogowanego w CHECKLIST-DEDUP.md
  (jeśli TAK → edytuj lokalizację kanoniczną, NIE twórz nowego wpisu — patrz
  "PROCEDURA UŻYCIA" w CHECKLIST-DEDUP.md)
- Czy edytowany moduł jest na liście modułów >400 linii (NOTA-4 w
  CHECKLIST-DEDUP.md) — jeśli TAK, rozważ podział "przy okazji"
- Jakie WARN są otwarte i wymagają zamknięcia
- Jaka jest aktualna mapa skilli i Dz.U.

---

## FAZA 0B — INTERAKTYWNY WYBÓR ZAKRESU

Gdy użytkownik wywołuje audyt **bez precyzowania zakresu** (np. "przeprowadź audyt", "audytuj system"):

1. Wczytaj widget:
```
view /mnt/skills/user/audyt-systemu-v4/widgets/WIDGET-MENU.md
```

2. Wyrenderuj menu wielokrotnego wyboru przez `show_widget` (kod JSX z WIDGET-MENU.md).

3. Czekaj na wybór użytkownika. Po otrzymaniu — uruchom **tylko wskazane fazy/moduły**.

Gdy użytkownik podał konkretny tryb lub zakres → pomiń widget, przejdź bezpośrednio do właściwej fazy.

---

## FAZA 1 — INWENTARYZACJA SYSTEMU

```bash
find /mnt/skills/user/ -not -path "*/archive/*" | sort
```

Zbuduj tabelę: skill → liczba plików → rozmiar → status (✅/⚠️/❌).

Porównaj z ostatnim snapshotem z AUDIT-JOURNAL.md (sekcja "STRUKTURA SYSTEMU — SNAPSHOT").
Wykryj: nowe skille, usunięte skille, zmienione rozmiary.

---

## FAZA 2 — WERYFIKACJA ZALEŻNOŚCI

### 2A — Spójność ścieżek

Dla każdego SKILL.md sprawdź, czy wszystkie `view`/`load` odwołania wskazują na istniejące pliki:

```bash
grep -r "view /mnt/skills" /mnt/skills/user/ --include="*.md" | grep -v archive
```

Każda ścieżka nieistniejąca = błąd **CRIT**.

### 2B — Wersje skilli w cross-referencjach

Sprawdź, czy żaden skill nie odwołuje się do usuniętej wersji innego skilla (np. v1 zamiast v2):

```bash
grep -r "przewodnik-prawny-v1\|analiza-sadowa-v5\|pisma-procesowe-v2" /mnt/skills/user/ --include="*.md" | grep -v archive
```

Dodaj tu wzorce wg historii napraw z SKILLS-MAP-AND-FIXES.

### 2C — Description length (limit 1024 znaków)

Wczytaj moduł i uruchom procedurę:

```
view /mnt/skills/user/audyt-systemu-v4/modules/MOD-DESCRIPTION.md
```

Przekroczenie 1024 = **CRIT**. Zakres 901–1024 = **WARN**.

---

## FAZA 2D — CZYSTOŚĆ KODU (NOWE MODUŁY)

### 2D-1 — Zbędne interlinie

Wczytaj moduł:
```
view /mnt/skills/user/audyt-systemu-v4/modules/MOD-INTERLINIE.md
```

Wykonaj procedurę wykrycia → napraw każdy plik z ≥2 kolejnymi pustymi liniami → zapisz wynik do raportu.

### 2D-2 — Wstawki opisowe

Wczytaj moduł:
```
view /mnt/skills/user/audyt-systemu-v4/modules/MOD-WSTAWKI.md
```

Wykonaj skan regex → oceń każde trafienie wg tabeli kwalifikacji → usuń tylko jednoznacznie opisowe wstawki → zapisz wynik do raportu.

**Zasada obu modułów**: zmiany tylko przez `str_replace` na skopiowanych plikach. Nigdy `sed -i` na `/mnt/skills/user/` (read-only mount).

---

## FAZA 3 — WERYFIKACJA MAPY Dz.U.

Wczytaj: `references/mapa_dzu_2026-07-04.md`

### 3-PULL — Synchronizacja DR-MAPA-AKTOW → ROUTING-MAP → mapa_dzu

> ⚙️ **Protokół pull** — wykonaj PRZED 3A gdy zakres audytu obejmuje TRYB DZU lub pełny audyt.
> Cel: mapa_dzu musi być spójna z tym co faktycznie mają DR-skills.

**Krok 1 — Skan DR-MAPA-AKTOW:**

```bash
# Zebranie wszystkich Dz.U. z lokalnych map DR
grep -h "Dz\.U\." /mnt/skills/user/dr-*/MAPA-AKTOW.md | \
  grep -oP "Dz\.U\. \d{4} poz\. \d+" | sort -u
```

**Krok 2 — Porównanie z ROUTING-MAP.md:**

```bash
# Znalezienie Dz.U. w MAPA-AKTOW które nie są w ROUTING-MAP
# (wykonuj manualnie: porównaj output Kroku 1 z ROUTING-MAP.md)
view /mnt/skills/user/prawo-polskie-v2/ROUTING-MAP.md
```

**Krok 3 — Porównanie z mapa_dzu:**

```bash
# Znalezienie Dz.U. w ROUTING-MAP których brak w mapa_dzu
# Każdy akt w ROUTING-MAP z Dz.U. powinien mieć wpis w mapa_dzu
```

**Krok 4 — Wykrywanie MONITORING ze wszystkich źródeł:**

```bash
# Znajdź akty z vacatio legis w DR-MAPA-AKTOW
grep -h "OCZEKUJE\|WCHODZI\|vacatio\|wchodzi w życie" \
  /mnt/skills/user/dr-*/MAPA-AKTOW.md | sort -u
```

Każdy wynik Kroku 4 → **sprawdź czy jest wpisany do sekcji MONITORING** w:
- `mapa_dzu_*.md` (tabela MONITORING)
- `ROUTING-MAP.md` (sekcja MONITORING)

Jeśli brakuje → **dodaj do obu plików** jako `⏳ OCZEKUJE`.

---

### 3A — Nowe t.j. od ostatniego audytu

Sprawdź w ISAP (isap.sejm.gov.pl) czy pojawiły się nowe teksty jednolite dla kluczowych aktów:
- KC, KPC, KPK, KRO, KP, KSH, KPA, PB, PrFarm, PIT, CIT, OrdPod, PrNotariat
- Sprawdź Dz.U. poz. > max_poz z ostatniego audytu (aktualnie: > 670 z 2026)

### 3B — Aktualizacja statusów

Jeśli znaleziono nowe t.j.:
- Zmień status starego wpisu: `OK` → `PREV`
- Dodaj nowy wiersz do tabeli z: rok, poz., akt, typ=TJ, status=OK, skille (wg mapy), uwagi

### 3D — Akty oczekujące na wejście w życie (MONITORING)

Po weryfikacji nowych t.j. (3A–3B) sprawdź i zaktualizuj tabelę aktów opublikowanych, które **nie weszły jeszcze w całości w życie** lub wchodzą etapami.

Dla każdego aktu z tabeli MONITORING wykonaj:
1. Sprawdź w ISAP czy data wejścia w życie minęła lub zbliża się (horyzont: 90 dni).
2. Jeśli akt wszedł w życie → przenieś do tabeli głównej mapy Dz.U. (zmień typ `OCZEKUJE` → `TJ` lub `NOV`), usuń z MONITORING.
3. Jeśli data jeszcze nie minęła → zaktualizuj uwagi, potwierdź termin.
4. Jeśli akt zastępuje inny → odnotuj w kolumnie `Zastępuje` (nazwa aktu + stary Dz.U.).

**Format tabeli MONITORING** (prowadzonej w `mapa_dzu_YYYY-MM-DD.md`, sekcja osobna na końcu pliku):

| Akt | Dz.U. opubl. | Data wejścia w życie | Zastępuje / zmienia | Moduł DR | Status |
|---|---|---|---|---|---|
| Prawo budowlane art. 1 pkt 1 lit. c | Dz.U. 2026 poz. 524 | 20.09.2026 | — (przepis nowy) | dr-09/mod-PrBud-* | ⏳ OCZEKUJE |
| Ordynacja podatkowa (część przepisów z Dz.U. 2025 poz. 1235) | Dz.U. 2026 poz. 622 | ~4 mies. od ogłoszenia | — (nowelizacja OP) | dr-06/mod-OP-* | ⏳ OCZEKUJE |
| Obrona cywilna zm. | Dz.U. 2026 poz. 646 | vacatio legis — weryfikuj | Dz.U. 2024 poz. 1907 (część) | dr-13/mod-ustawa-zarzadzanie-kryzysowe-* | ⏳ OCZEKUJE |

**Reguły statusów MONITORING:**

| Status | Znaczenie |
|---|---|
| ⏳ OCZEKUJE | Opublikowany, vacatio legis w toku — nie stosuj do zdarzeń wcześniejszych |
| ⚡ WCHODZI-90DNI | Data wejścia w ciągu 90 dni — zaktualizuj moduł przed tą datą |
| ✅ WSZEDŁ | Wszedł w życie — przesuń do tabeli głównej, usuń z MONITORING |
| ❌ UCHYLONY | Uchylony przed wejściem — usuń z MONITORING, odnotuj w AUDIT-JOURNAL |

**Przy wpisie do raportu (Faza 6)** dodaj sekcję `### 4B. MONITORING — akty oczekujące` z aktualnym stanem tabeli.

**Przy aktualizacji mapa_dzu (Faza 7B)** — tabela MONITORING jest aktualizowana razem z tabelą główną, na końcu pliku.

---

### 3C — Rozporządzenia "do weryfikacji"

Otwarte WARN z poprzednich audytów:
- WARN-4: Rozp. RM 2020.2437 (progi PZP) — dr-07
- WARN-5b: Rozp. MS 2015.1800 (stawki komornicze) — analizator-dowodow-v3
- WARN-6: Rozp. RM 2008.1656 (prace uciążliwe) — dr-16

Dla każdego: sprawdź online czy istnieje nowszy akt. Jeśli tak → CRIT. Jeśli nie → zamknij WARN jako "zweryfikowane, bez zmian".

---

## FAZA 4 — TESTY ANTYHALUCYNACYJNE

### 4A — Zakaz cytowania z pamięci

```bash
grep -r "Dz\.U\. [0-9]\{4\} poz\." /mnt/skills/user/ --include="*.md" | grep -v "isap\|weryfikuj\|MAPA\|mapa_dzu\|references\|archive" | head -30
```

Hardkodowane Dz.U. bez kontekstu weryfikacji = **WARN**.

### 4B — PRAWO-HARDGATE obecny

```bash
grep -r "PRAWO-HARDGATE" /mnt/skills/user/ --include="*.md" | grep -v archive | head -10
```

Brak HARDGATE w routerze = **CRIT**.

---

## FAZA 5 — SCORING

Dla każdego skilla generuj wynik 0–10:

| Kryterium | Waga | Punkty |
|-----------|------|--------|
| Brak błędów CRIT | 40% | 0–4 |
| Spójność zależności (ścieżki, wersje) | 25% | 0–2.5 |
| Description w limicie | 10% | 0–1 |
| Czystość kodu (interlinie + wstawki) | 15% | 0–1.5 |
| HARDGATE obecny (router) | 10% | 0–1 |

**Wynik < 6.0** = skill wymaga naprawy przed użyciem.
**Wynik ≥ 8.0** = skill zielony.

---

## FAZA 6 — RAPORT AUDYTU

Generuj raport wg szablonu z AUDIT-JOURNAL.md (sekcja "SZABLON NOWEGO WPISU").

Struktura wymaganego raportu:

```
## AUDYT-YYYY-MM-DD

### 1. STATUS OGÓLNY
### 2. NAPRAWY WYKONANE (CRIT)
### 3. OSTRZEŻENIA (WARN)
### 4. WERYFIKACJA Dz.U.
### 5. STRUKTURA SYSTEMU — SNAPSHOT
### 6. WNIOSKI I ZALECENIA
```

---

## FAZA 7 — AKTUALIZACJA PLIKÓW REFERENCES ← OBOWIĄZKOWE

Po zakończeniu audytu **ZAWSZE** zaktualizuj oba pliki references:

### 7A — Aktualizacja AUDIT-JOURNAL.md

Dopisz nowy wpis audytu na **początku listy** (po nagłówku i opisie pliku, przed poprzednim wpisem):

```bash
view /mnt/skills/user/audyt-systemu-v4/references/AUDIT-JOURNAL.md
```

Następnie użyj `str_replace` aby wstawić nowy wpis `## AUDYT-YYYY-MM-DD` bezpośrednio po linii:
```
> **Zasada:** Po każdym audycie: [...]
```

Zaktualizuj również stopkę:
```
*Ostatnia aktualizacja: YYYY-MM-DD*
```

### 7B — Aktualizacja mapa_dzu_YYYY-MM-DD.md

Jeśli znaleziono nowe t.j. lub zmiany statusów Dz.U.:

1. Utwórz nową wersję pliku z datą bieżącą:
```bash
cp /mnt/skills/user/audyt-systemu-v4/references/mapa_dzu_2026-06-14.md \
   /mnt/skills/user/audyt-systemu-v4/references/mapa_dzu_YYYY-MM-DD.md
```

2. Zaktualizuj w nowym pliku:
   - Nagłówek: `**Data weryfikacji:** YYYY-MM-DD`
   - Zmień statusy `OK` → `PREV` dla zastąpionych t.j.
   - Dodaj nowe wiersze do tabeli (na początku, sortuj malejąco po roku/poz.)

3. Zaktualizuj odwołanie w SKILL.md (sekcja `references:`):
```
str_replace: mapa_dzu_2026-06-14.md → mapa_dzu_YYYY-MM-DD.md
```

Jeśli **brak zmian Dz.U.** — plik mapy pozostaje bez zmian, odnotuj w AUDIT-JOURNAL.md:
```
Dz.U.: brak nowych t.j. — mapa bez zmian (ostatnia: mapa_dzu_2026-06-14.md)
```

### 7C — Aktualizacja SKILLS-MAP-AND-FIXES

Jeśli wykonano naprawy CRIT:

1. Dopisz nową sekcję na początku CZĘŚĆ I:
```markdown
## CZĘŚĆ Ia — NAPRAWY YYYY-MM-DD
### CRIT-X — [opis]
...
```

2. Jeśli zmieniła się struktura katalogu skilla — zaktualizuj odpowiedni blok w CZĘŚĆ II.

---

## TRYBY WYWOŁANIA

### TRYB INTERAKTYWNY (menu wyboru) ← DOMYŚLNY
Wywołanie: "przeprowadź audyt" / "audytuj system" (bez zakresu)
→ Faza 0 → Faza 0B (widget menu) → czekaj na wybór → uruchom wybrane fazy.

### TRYB AUTO (pełny audyt)
Wywołanie: "pełny audyt" / "audyt kompletny"
→ Wykonaj Fazy 0–7 w całości.

### TRYB TARGETED (wybrany skill)
Wywołanie: "audytuj [nazwa-skilla]"
→ Faza 0 + Fazy 1–5 tylko dla wskazanego skilla + Faza 6 (skrócony raport) + Faza 7A.

### TRYB CZYSTOŚĆ (tylko interlinie + wstawki + description)
Wywołanie: "wyczyść skille" / "usuń zbędne interlinie" / "usuń wstawki opisowe" / "sprawdź description"
→ Faza 0 → Fazy 2C + 2D-1 + 2D-2 (lub podzbiór) → Faza 6 (skrócony) → Faza 7A.

### TRYB DZU (tylko mapa Dz.U.)
Wywołanie: "sprawdź mapę Dz.U." / "aktualizuj Dz.U."
→ Faza 0 + Faza 3 (A+B+C+D) + Faza 7A + 7B.

### TRYB WARN-CLOSE (zamknięcie ostrzeżeń)
Wywołanie: "zamknij otwarte warningi" / "sprawdź WARN-X"
→ Faza 0 → odczytaj otwarte WARN z AUDIT-JOURNAL → weryfikacja online → Faza 7A.

---

## ZASADY KRYTYCZNE

1. **Nigdy nie cytuj przepisów ani sygnatur z pamięci** — weryfikacja tylko przez isap.sejm.gov.pl i oficjalne źródła orzeczeń.
2. **Każdy audyt kończy się aktualizacją AUDIT-JOURNAL.md** — bez wyjątków.
3. **Mapa Dz.U. aktualizowana tylko gdy potwierdzone zmiany online** — nie spekuluj.
4. **CRIT blokuje skill** — nie używaj skilla z otwartym CRIT.
5. **WARN nie blokuje** — ale musi być odnotowany i zamknięty w następnym audycie.
6. **Moduły czystości (interlinie, wstawki) działają zachowawczo** — w razie wątpliwości ZOSTAW, nie usuwaj.
7. ⛔ **ZASADA KOMPLETNOŚCI OUTPUTU (OUTPUT-COMPLETENESS) — NARUSZENIE = CRIT**

   Każda naprawa pliku (CRIT lub WARN) musi być dostarczona jako **kompletny skill**
   zawierający WSZYSTKIE pliki i podfoldery danego skilla, nie tylko zmieniony plik.
8. ⛔ **ZASADA WERYFIKACJI NUMERU NIEZALEŻNIE OD NAZWY (dodana 2026-07-02s,
   na wyraźny nakaz użytkownika) — "jeśli nazwy różnią się choć trochę,
   sprawdzaj w ISAP".**

   Zgodność NAZWY aktu między dwoma źródłami (np. między MAPA-AKTOW.md a
   treścią modułu) NIE jest dowodem poprawności numeru Dz.U. Odkryty
   przypadek referencyjny (dr-10, ustawa o medycynie laboratoryjnej): moduł
   poprawnie nazwał akt, ale podał numer Dz.U. należący do INNEGO,
   zastąpionego aktu o pokrewnej tematyce (2022.2162 zamiast 2022.2280).
   Zasada praktyczna: przy każdej weryfikacji TRYB DZU sprawdzaj NUMER
   niezależnie od tego, czy NAZWA aktu w mapie/module wygląda poprawnie —
   zwłaszcza gdy w tej samej dziedzinie istnieje stary i nowy akt o
   zbliżonym temacie (typowy wzorzec ryzyka: reformy zawodowe/regulacyjne,
   gdzie nowa ustawa zastępuje starą pod inną nazwą lub tym samym tytułem).
   Techniczne ograniczenie: `isap.sejm.gov.pl` blokuje bezpośredni
   `web_fetch` (ROBOTS_DISALLOWED) — weryfikacja odbywa się przez
   `web_search` z numerem Dz.U. jako frazą kluczową, czytając zaindeksowane
   fragmenty (w tym z samego ISAP, oraz dziennikustaw.gov.pl/sip.lex.pl/
   gofin.pl jako źródła pomocnicze).
   Dostarczanie wyłącznie zmodyfikowanego pliku bez reszty struktury grozi nieodwracalną
   utratą danych przy wgraniu (nadpisanie katalogu bez pozostałych plików).

   **Reguła:** po każdej naprawie → `find /mnt/skills/user/<skill>/ -not -path "*/archive/*"` →
   skopiuj WSZYSTKIE pliki do `/home/claude/<skill>/` z zachowaniem podfolderów →
   `zip -r <skill>.zip <skill>/` → skopiuj ZIP do `/mnt/user-data/outputs/` →
   `present_files` pliku ZIP. Nigdy nie dostarcza się luźnych plików .md.

   **Wyjątek dozwolony:** wyłącznie gdy deweloper **explicite** potwierdził w tej sesji,
   że chce tylko diff/patch i rozumie ryzyko. Bez takiego potwierdzenia — zawsze pełna struktura.

   Naruszenie tej zasady (dostarczenie samego pliku zamiast pełnego skilla) jest błędem
   krytycznym równoważnym CRIT i musi być odnotowane w AUDIT-JOURNAL.

---

## STRUKTURA KATALOGU

```
audyt-systemu-v4/
├── SKILL.md                                    ← orchestrator (ten plik)
├── modules/
│   ├── MOD-INTERLINIE.md                       ← wykrycie i usuwanie zbędnych pustych linii
│   ├── MOD-WSTAWKI.md                          ← wykrycie i usuwanie wstawek opisowych
│   └── MOD-DESCRIPTION.md                      ← walidacja długości description (limit 1024)
├── widgets/
│   └── WIDGET-MENU.md                          ← kod JSX interaktywnego menu wyboru
└── references/
    ├── AUDIT-JOURNAL.md                        ← dziennik audytów
    ├── CHECKLIST-DEDUP.md                      ← mapa pojęć → lokalizacje kanoniczne (dedup)
    └── mapa_dzu_2026-07-04.md                  ← mapa 439 wierszy Dz.U. (aktualna)
```

---

*Wersja: 5.0 | Ostatnia aktualizacja: 2026-07-04*

## CHANGELOG

**5.0 (2026-07-04p) — PROJEKT "KATALOG WSZYSTKICH T.J." ZAKOŃCZONY:**
- **DR-15 (Compliance, ISO, Governance, Audyt):** sprawdzona — już w pełni
  zweryfikowana z sesji 2026-07-02aaaa (5/5 aktów krajowych), brak akcji.
- **DR-16 (Pisma, Strategia, Dowody, Orzecznictwo) — W PEŁNI SKATALOGOWANA:**
  Prawo prasowe (2018.1914) potwierdzone w pełni jako pierwszy i jedyny
  t.j. tej ustawy od 1984 r.
- **MILESTONE: wszystkie 16 dziedzin (DR-01 do DR-16) przeszły dedykowaną
  sesję katalogowania tekstów jednolitych.** Podsumowanie łączne projektu:
  ok. 20 błędnych/nieistniejących numerów Dz.U. naprawionych, 4 błędne
  klasyfikacje aktu (ustawa↔rozporządzenie), kilka duplikatów
  międzydomenowych skonsolidowanych, 3 fałszywe alarmy o rzekomych nowych
  t.j. rozstrzygnięte. Pozostają świadomie otwarte: 3 flagi strukturalne
  w DR-10 (wymagają przebudowy modułów) + pojedyncze flagi "WYMAGA
  AKTUALIZACJI MODUŁU" w kilku dziedzinach (treść modułu, nie numer).
- Podbicie wersji z 4.x na 5.0 odzwierciedla ukończenie pełnego cyklu
  katalogowania wszystkich 16 dziedzin — kamień milowy projektu.

**4.21 (2026-07-04o):**
- **DR-14 (Prawo UE, Międzynarodowe, Prawa Człowieka) — 2 pozycje krajowe
  domknięte:** ustawa o "obecności sił zbrojnych obcych" — POPRAWKA NAZWY
  I NUMERU: prawidłowa nazwa "ustawa o zasadach pobytu wojsk obcych na
  terytorium RP" (23.09.1999), aktualny t.j. Dz.U. 2024.1770 (było błędnie
  2020.1287, numer nienależący do tej ustawy); Prawo prywatne
  międzynarodowe (2023.503) w pełni potwierdzone.
- `mapa_dzu_2026-07-04.md` zaktualizowana.

**4.20 (2026-07-04n):**
- **DR-13 (Służby, Bezpieczeństwo, Informacje Niejawne) — 1 pozycja
  poprawiona:** ustawa o SOP — numer "2024.1672" nie odpowiadał żadnemu
  potwierdzonemu dokumentowi; prawidłowy łańcuch t.j.: 2023.66 → 2024.325
  → 2025.34 (aktualny).
- `mapa_dzu_2026-07-04.md` +2 wiersze (nowy OK, PREV chain uzupełniony).
- DR-13 kończy z 0 pozycji o niepotwierdzonym numerze podstawowym.

**4.19 (2026-07-04m):**
- **DR-12 (Sądownictwo, Prokuratura, Zawody Prawnicze) — 2 pozycje w
  tabeli dyscyplinarnej zamknięte:** izby lekarskie (Dz.U. 2021.1342
  potwierdzone jako nadal aktualne — poprzednia ostrożność po lekcji z
  fałszywym alarmem USW okazała się nadmiarowa, liczne dokumenty ze
  stycznia 2026 potwierdzają ten sam numer); medycyna laboratoryjna
  (POPRAWKA — poprzedni numer 2022.2280 był już nieaktualny, prawidłowy
  aktualny t.j. to 2023.2125, zgodnie z mapą centralną, która już to
  miała poprawnie — korekta propagowana do dr-10 i dr-12 lokalnie).
- Dodano nowy wiersz w mapie centralnej: ustawa o izbach lekarskich
  (2021.1342) — wcześniej całkowicie nieobecna.

**4.18 (2026-07-04l):**
- **DR-11 (Cyfrowe, Cyberbezpieczeństwo, AI, Dane, IP) — W PEŁNI
  SKATALOGOWANA:** ostatnia niejednoznaczność (ustawa o świadczeniu usług
  drogą elektroniczną) zamknięta — potwierdzony t.j. Dz.U. 2024.1513
  (było błędnie cytowane jako "2020.344 ze zm."), plus nowelizacja DSA z
  18.12.2025 zmieniająca ten sam tekst.
- `mapa_dzu_2026-07-04.md` zaktualizowana (+1 wiersz OK, 1 PREV).

**4.17 (2026-07-04k):**
- **DR-10 (Zdrowie, Farmacja, Żywność, Rolnictwo) — 1 flaga numeryczna
  zamknięta:** ustawa o imprezach turystycznych — potwierdzony t.j. Dz.U.
  2023.2211 (poprzedni numer "2022.2189" z dawnego wiersza zbiorczego nie
  odpowiadał żadnemu dokumentowi). Pozostają 3 flagi STRUKTURALNE (nie
  numeryczne): rolnictwo/żywność/weterynaria (wymaga rozbicia wiersza
  zbiorczego), zawody medyczne/prawnicze (błędnie nazwany plik modułu),
  izby lekarskie (brak dedykowanego modułu) — wymagają sesji dedykowanej z
  decyzjami strukturalnymi, nie tylko weryfikacji Dz.U.
- `mapa_dzu_2026-07-04.md` +1 wiersz.

**4.16 (2026-07-04j):**
- **DR-09 (Budownictwo, Środowisko, Energia, Transport) — 2 flagi zamknięte:**
  ustawa o odpadach — flaga PILNA o rzekomym nowym t.j. z 1.07.2026
  rozstrzygnięta jako FAŁSZYWY ALARM (źródło mylnie datowane, opisywało
  wydarzenie z 2023 r.; potwierdzono przez dokument z 11.05.2026, że
  2023.1587 nadal obowiązuje); ustawa OOŚ (2024.1112) w pełni potwierdzona.
  1 pozycja bez numeru pozostaje otwarta ("POŚ Szczegóły" — wymaga
  doprecyzowania zakresu, nie do rozstrzygnięcia samą weryfikacją Dz.U.).

**4.15 (2026-07-04i):**
- **DR-08 (Samorząd Terytorialny i Prawo Lokalne) — SKATALOGOWANA:** 2
  pozycje domknięte: nowelizacja ochrony ludności/obrony cywilnej z
  17.04.2026 zidentyfikowana jako Dz.U. 2026.646 (scalono z wcześniejszym
  wpisem MONITORING); ustawa o ogłaszaniu aktów normatywnych (2019.1461)
  potwierdzona jako nadal aktualna.
- **Rozstrzygnięty rzekomy konflikt numeracji:** flaga "MOŻLIWY KONFLIKT"
  dla Dz.U. 2026.646 (dwa różne opisane tematy — obrona cywilna vs.
  oświadczenia przy pozwoleniu na budowę) okazała się FAŁSZYWYM ALARMEM —
  to jedna wieloprzedmiotowa ustawa nowelizująca kilka aktów jednocześnie,
  w tym Prawo budowlane.
- `mapa_dzu_2026-07-04.md` zaktualizowana (3 wiersze poprawione/zamknięte).

**4.14 (2026-07-04h):**
- **DR-07 (Zamówienia Publiczne, Fundusze UE) — SKATALOGOWANA:** 2 pozycje
  domknięte: NIK (2022.623 w pełni potwierdzone), PPP (POPRAWKA — numer
  "1688" należał do zupełnie innego aktu z tego samego roku, prawidłowy
  t.j. to 2023.1637).
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane.

**4.13 (2026-07-04g):**
- **DR-06 (Podatki, Finanse Publiczne, AML) — W PEŁNI SKATALOGOWANA:**
  ostatnia niezweryfikowana pozycja (ustawa akcyzowa, Dz.U. 2025.126)
  potwierdzona jako poprawna (isap, infor.pl, dziennikustaw.gov.pl, MF).
  DR-06 kończy z 0 pozycji niezweryfikowanych (pozostają 2 flagi treści
  modułu: obligacje, interpretacje podatkowe — numery już poprawne).
- **Podsumowanie etapu:** DR-01 do DR-06 mają teraz 0 otwartych pozycji
  "weryfikuj numer" / "niezweryfikowane". Łącznie w projekcie katalogowania
  naprawiono dotąd 9 błędnych/nieistniejących numerów Dz.U. (KNF x2 warianty,
  Rada Ministrów, Fundusz Pomocy Pokrzywdzonym, pracownicy tymczasowi, SKO,
  cudzoziemcy/ochrona, Aktywny Rodzic duplikat, KRS) w 6 dziedzinach.

**4.12 (2026-07-04f):**
- **DR-05 (Prawo Administracyjne i Sądownictwo Administracyjne) — SKATALOGOWANA:**
  3 pozycje domknięte: ustawa o udzielaniu ochrony cudzoziemcom (nowy t.j.
  2025.223, było 2024.1546 — sync również w dr-13/ROUTING-MAP), SKO
  (POPRAWKA — numer "2023.825" niepotwierdzony w 6 źródłach, prawidłowy
  2018.570), skarga na przewlekłość (status podniesiony do "w pełni
  potwierdzone", trzykrotnie zweryfikowane w projekcie).
- Pozostaje 1 świadomie otwarta flaga PILNA (cudzoziemcy/Ukraina — zmiana
  systemowa, wymaga sesji merytorycznej dedykowanej, nie tylko numeru Dz.U.).
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane
  (w tym duplikat cudzoziemcy/ochrona między dr-05 i dr-13).

**4.11 (2026-07-04e):**
- **DR-04 (Prawo Pracy, ZUS, Świadczenia Społeczne) — SKATALOGOWANA:** 2
  pozycje zamknięte: Ustawa Aktywny Rodzic (Dz.U. 2024.858, brak jeszcze
  t.j.), ustawa o zatrudnianiu pracowników tymczasowych (POPRAWKA — numer
  "2025.1682" był błędny/nieistniejący, prawidłowy to 2025.236, potwierdzone
  4 niezależnymi źródłami).
- **Duplikat wykryty i naprawiony:** dwa wiersze "Ustawa Aktywny Rodzic" w
  mapie centralnej — jeden poprawny (2024.858), drugi błędny (2023.2760,
  który w rzeczywistości to zupełnie inna ustawa o wsparciu odbiorców
  energii). Skonsolidowane.
- `mapa_dzu_2026-07-04.md` i `prawo-polskie-v2/ROUTING-MAP.md` zsynchronizowane.

**4.10 (2026-07-04d):**
- **DR-03 (Prawo Karne, Wykroczenia, Egzekucja) — SKATALOGOWANA:** ostatnia
  otwarta pozycja (Fundusz Pomocy Pokrzywdzonym) zamknięta — okazało się być
  BŁĘDEM STRUKTURALNYM, nie tylko numeru: nie jest to odrębna ustawa, lecz
  rozporządzenie MS wydane na podstawie art. 43 KKW; poprzedni numer
  "2022.2256" nie istniał. Poprawiono na aktualny t.j. rozporządzenia
  Dz.U. 2025 poz. 1298. Sygnał o nowelizacji ustawy o przeciwdziałaniu
  narkomanii (11.06.2026) zaktualizowany — bill przeszedł Sejm, ale brak
  potwierdzonej publikacji w Dz.U. — flaga świadomie pozostaje otwarta.
- `mapa_dzu_2026-07-04.md` +1 wiersz (Fundusz Pomocy Pokrzywdzonym, rozporządzenie).
- DR-03 kończy z 0 pozycji "niezweryfikowanych"; pozostaje 1 flaga oczekująca
  na publikację aktu (narkomania, poza kontrolą audytu) + 2 flagi treści
  modułu (numery już poprawne).

**4.9 (2026-07-04c):**
- **DR-02 (Prawo Cywilne, Rodzinne i Gospodarcze) — SKATALOGOWANA:** 4 pozycje
  uprzednio "weryfikuj w ISAP" zamknięte: OZSS (2018.708 — potwierdzone
  aktualne), KK art. 233 (2025.383 — zsynchronizowane z dr-03), doradca
  restrukturyzacyjny licencja (2022.1007 — potwierdzone aktualne). KC
  (2025.1071) i KSH (2024.18) potwierdzone jako aktualne podstawowe t.j.
- **Wykryty i rozwiązany duplikat międzydomenowy (flaga otwarta z sesji
  DR-01):** ustawa o skardze na przewlekłość miała w mapie centralnej 3
  niespójne wiersze (2016.1259 błędny, 2023.1725 typu NW błędnie, 2023.1725
  typu TJ poprawny) — skonsolidowane do jednego kanonicznego wiersza TJ z
  konsumentami dr-01 + dr-05. Zweryfikowano bezpośrednio w `dr-05/MAPA-
  AKTOW.md`, że lokalny plik dr-05 już miał poprawny numer — błąd był
  wyłącznie w niezsynchronizowanej mapie centralnej.
- `mapa_dzu_2026-07-04.md` zaktualizowana (448 → 448 wierszy netto — 2 dodane
  jako duplikaty PREV, ale bez zmiany liczby aktywnych OK).

**4.8 (2026-07-04b):**
- **Rozpoczęto projekt "katalog wszystkich obowiązujących tekstów jednolitych
  ustaw"** — realizowany etapami, jedna dziedzina (DR) na sesję, zgodnie z
  zasadą "nigdy nie zgaduj numeru".
- **DR-01 (Ustrój Konstytucyjny i Źródła Prawa) — W PEŁNI SKATALOGOWANA:**
  11/11 aktów zweryfikowanych w ISAP. 2 akty dodane od zera (PUSA — Dz.U.
  2024.1297; skarga na przewlekłość — Dz.U. 2023.1725), 2 błędne numery
  poprawione (KRS: 2011.714→2024.1186; Rada Ministrów: 2022.2032 [numer
  nieistniejący]→2025.780), 1 duplikat wykryty i skonsolidowany (PUSP
  2024.334 pod dwiema nazwami), 1 flaga międzydomenowa otwarta (niespójność
  numeru skargi na przewlekłość między DR-01 i DR-05 — do zbadania w sesji
  DR-05).
- `mapa_dzu_2026-07-04.md` zaktualizowana (439 → 448 wierszy).

**4.7 (2026-07-04):**
- **TRYB WARN-CLOSE — 3 drugorzędne flagi z 2026-07-02eeee ZAMKNIĘTE:**
  WARN-KNF (duplikat "Ustawa o nadzorze KNF" — jedyny prawidłowy t.j.
  2025.640, poprzedni 2024.135; błędne 2024.136/2024.724 przeklasyfikowane),
  WARN-SPORT (rozdzielono "Ustawa o sporcie" 2026.95 od odrębnego aktu
  "Ustawa o bezpieczeństwie imprez masowych" — t.j. 2023.616, poprzedni
  2022.1466; turystyka pozostaje otwarta, niezweryfikowana), WARN-RZPAT
  (poprzedni wpis 2025.591 był rozporządzeniem wykonawczym, nie t.j. ustawy;
  prawidłowy aktualny t.j. to 2026.778, poprzedni 2024.749).
- Zaktualizowano `mapa_dzu_2026-07-02.md` → `mapa_dzu_2026-07-04.md` (432 →
  439 wierszy).
- Poprawki propagowane do: `dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md`,
  `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/MAPA-AKTOW.md`,
  `dr-12-sadownictwo-prokuratura-zawody-prawnicze/MAPA-AKTOW.md`,
  `prawo-polskie-v2/ROUTING-MAP.md`.
- Wszystkie 3 numery zweryfikowane online (isap.sejm.gov.pl, infor.pl,
  prawo.pl) — żaden nie był zgadywany.
- CRIT-1 (5 plików shared/: MOD-TIMING, MOD-INTRO, MOD-KONCENTRACJA,
  MOD-PEER-REVIEW, MOD-DOKTRYNA) zweryfikowany jako JUŻ ZAMKNIĘTY —
  wszystkie 5 plików istnieją na dysku; wpis w AUDIT-JOURNAL był nieaktualny
  (pochodził z sesji 2026-06-23, naprawiony później bez odnotowania).

**4.6 (2026-07-02):**
- **WARN-26 ZAMKNIĘTY W CAŁOŚCI (16/16 kroków)** — pełna weryfikacja TRYB
  DZU wszystkich DR-skilli (dr-01…dr-16) + synchronizacja obu plików
  centralnych (`prawo-polskie-v2/ROUTING-MAP.md`: 46 wierszy;
  `mapa_dzu_2026-07-02.md`: 28 sync + 3 dodane). 68 błędów CRIT naprawionych
  łącznie w DR-MAPA-AKTOW w trakcie sesji. Wykryto i udokumentowano
  strukturalny dryf synchronizacji dysk↔centralne indeksy (dokładnie
  ryzyko zasygnalizowane we wcześniejszym audycie silnika) — naprawy
  punktowe w DR-skillach nie były propagowane automatycznie do
  ROUTING-MAP/mapa_dzu. 3 flagi świadomie pozostawione nierozstrzygnięte
  (duplikat KNF, możliwe rozdzielenie sport/imprezy masowe, niepotwierdzony
  t.j. rzeczników patentowych) zamiast zgadywania.


**4.5 (2026-06-17):**
- Dodano ZASADĘ 7: OUTPUT-COMPLETENESS — każda naprawa musi być dostarczona
  jako kompletny skill (wszystkie pliki + podfoldery), nie tylko zmieniony plik.
  Naruszenie = CRIT. Wyjątek tylko na explicite potwierdzenie dewelopera w sesji.

**4.4 (2026-06-14g):**
- Naprawiono nieaktualne odwołania `mapa_dzu_2026-06-07.md` → `mapa_dzu_2026-06-14.md`
  (12 miejsc w SKILL.md, w tym FAZA 0, FAZA 7B, drzewo plików)
- WARN-1/2/3 (zaległość z AUDYT-2026-06-04/05) formalnie zamknięte —
  patrz AUDIT-JOURNAL.md → AUDYT-2026-06-14g (skrócony)
- `shared/DEPENDENCY-GRAPH.md` uzupełniony o 20 brakujących wpisów
- 5 nowych plików ORPHAN w shared/ oznaczone (CHECKLIST-DEDUP NOTA-6, PENDING)
- Usunięto pliki archiwalne z `references/`: `SKILLS-MAP-AND-FIXES-2026-06-04.md`
  (snapshot 06-04, zastąpiony przez DEPENDENCY-GRAPH/CHECKLIST-DEDUP/mapa_dzu),
  `mapa_dzu_2026-06-07.md` (zastąpiony przez 06-14), `WARN-8-DZU-worksheet-2026-06-14.md`
  (worksheet zamknięty 16/16, treść skondensowana w AUDIT-JOURNAL)

**4.3:** PRAWO-HARDGATE KROK 2B/5B (NOTA-5, TK 2024-2026), AKTY-PRAWNE-MASTER
deprecated (WARN-7), WARN-8 zamknięty 16/16 (TRYB DZU), WARN-9 zamknięty.
