---
name: audyt-systemu-v4
version: 4.1
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
  - references/SKILLS-MAP-AND-FIXES-2026-06-04.md
  - references/mapa_dzu_2026-06-05.md
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
view /mnt/skills/user/audyt-systemu-v4/references/SKILLS-MAP-AND-FIXES-2026-06-04.md
view /mnt/skills/user/audyt-systemu-v4/references/mapa_dzu_2026-06-05.md
```

Celem jest ustalenie:
- Jaki był wynik ostatniego audytu (AUDIT-JOURNAL.md → ostatni wpis `## AUDYT-YYYY-MM-DD`)
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

Wczytaj: `references/mapa_dzu_2026-06-05.md`

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
cp /mnt/skills/user/audyt-systemu-v4/references/mapa_dzu_2026-06-05.md \
   /mnt/skills/user/audyt-systemu-v4/references/mapa_dzu_YYYY-MM-DD.md
```

2. Zaktualizuj w nowym pliku:
   - Nagłówek: `**Data weryfikacji:** YYYY-MM-DD`
   - Zmień statusy `OK` → `PREV` dla zastąpionych t.j.
   - Dodaj nowe wiersze do tabeli (na początku, sortuj malejąco po roku/poz.)

3. Zaktualizuj odwołanie w SKILL.md (sekcja `references:`):
```
str_replace: mapa_dzu_2026-06-05.md → mapa_dzu_YYYY-MM-DD.md
```

Jeśli **brak zmian Dz.U.** — plik mapy pozostaje bez zmian, odnotuj w AUDIT-JOURNAL.md:
```
Dz.U.: brak nowych t.j. — mapa bez zmian (ostatnia: mapa_dzu_2026-06-05.md)
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
    ├── SKILLS-MAP-AND-FIXES-2026-06-04.md      ← mapa plików + historia napraw CRIT
    └── mapa_dzu_2026-06-05.md                  ← mapa 355 aktów Dz.U.
```

---

*Wersja: 4.1 | Ostatnia aktualizacja: 2026-06-07*
