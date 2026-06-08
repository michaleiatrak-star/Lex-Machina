# AUDIT-JOURNAL — Dziennik Audytów Systemu Prawnego AI

**Plik:** `AUDIT-JOURNAL.md`  
**Opis:** Chronologiczny rejestr wszystkich audytów systemu — wyniki, naprawy, status.  
**Format wpisu:** jedna sekcja `## AUDYT-YYYY-MM-DD` per sesja audytowa.  
**Powiązany plik referencyjny:** `AUDIT-REFERENCES.md`

> **Zasada:** Po każdym audycie:
> 1. Dodaj wpis do tego dziennika (wyniki, naprawy, status)
> 2. Zaktualizuj `AUDIT-REFERENCES.md` jeśli zmieniły się ścieżki, struktury lub statusy Dz.U.

---

## AUDYT-2026-06-04 / AUDYT-2026-06-05

**Data audytu:** 2026-06-04 (naprawy) + 2026-06-05 (weryfikacja Dz.U.)  
**Zakres:** 33 skille + shared/ (bez archive/); 355 aktów Dz.U.  
**Narzędzie:** audyt-systemu-v3 (wywołany ręcznie)  
**Audytor:** sesja deweloperska  
**Pliki źródłowe:**
- `SKILLS-MAP-AND-FIXES-2026-06-04.md`
- `mapa_dzu_2026-06-05.md`

---

### 1. STATUS OGÓLNY

| Kategoria | Wynik |
|-----------|-------|
| Skille ogółem | 33 + shared/ |
| Pliki ogółem | ~667 |
| Katalogi ogółem | ~71 |
| Rozmiar systemu | ~2.9 MB |
| Błędy CRIT (blokujące) | 4 → **wszystkie naprawione** |
| Ostrzeżenia WARN | 5 → **nieblokujące, otwarte** |
| Akty Dz.U. w mapie | 355 |
| Status Dz.U. OK | ~335 |
| Status Dz.U. PREV | ~20 (referencje historyczne) |

**Ogólny status systemu po audycie: ✅ ZIELONY**

---

### 2. NAPRAWY WYKONANE (CRIT)

#### CRIT-1 — analizator-umow-v1: FAKTY.md → FAKTY_v2.md ✅ NAPRAWIONY

| Plik | Linia | Zmiana |
|------|-------|--------|
| `analizator-umow-v1/SKILL.md` | 113 | `FAKTY.md` → `FAKTY_v2.md` |
| `analizator-umow-v1/SKILL.md` | 217 | `MOD-WALIDACJA · FAKTY` → `MOD-WALIDACJA_v2 · FAKTY_v2` |
| `analizator-umow-v1/references/mod-core-checklist.md` | 563 | `FAKTY.md` → `FAKTY_v2.md` |

**Przyczyna:** Skill odwoływał się do nieistniejącej ścieżki `FAKTY.md` zamiast kanonicznej `FAKTY_v2.md`.

---

#### CRIT-2 — analizator-umow-v1: MOD-WALIDACJA.md → MOD-WALIDACJA_v2.md ✅ NAPRAWIONY

| Plik | Linia | Zmiana |
|------|-------|--------|
| `analizator-umow-v1/SKILL.md` | 112 | `MOD-WALIDACJA.md` (bloki A–I) → `MOD-WALIDACJA_v2.md` (bloki A–J) |

**Przyczyna:** Odwołanie do wersji bez bloku J (FACT-SOURCE-LOCK / LEGAL-STATUS-LOCK). Stub `MOD-WALIDACJA.md` istnieje, ale wskazywany był jako plik główny zamiast `_v2`.

---

#### CRIT-3a — dr-02: analiza-sadowa-v5 → analiza-sadowa-v6 ✅ NAPRAWIONY (17 modułów)

Masowa zamiana w 17 modułach `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/`:

```
mod-KC-ubezpieczenia-szczegolowy.md
mod-KC-ubezpieczenia-framework.md
mod-KC-cywilne-szczegolowy.md
mod-PrUpad-prawo-upadlosciowe.md
mod-KRO-framework-szczegolowy.md
mod-KSH-kodeks-spolek-handlowych.md
mod-KC-zobowiazania-i-roszczenia.md
mod-KPC-windykacja-framework.md
mod-KPC-egzekucja-i-windykacja.md
mod-KSH-gospodarcze-szczegolowy.md
mod-KC-ubezpieczenia-umowne-OC-AC.md
mod-ustawa-cudzoziemcy.md
mod-KRO-framework-rodzinne.md
mod-KRO-rodzinny-i-opiekunczy.md
mod-KP-art943-mobbing.md
mod-KC-framework-cywilne.md
mod-KSH-framework-gospodarcze.md
```

**Przyczyna:** Wersja v5 skilla była przestarzała — model 4-przebiegowy z dwukrotną weryfikacją dowodów dostępny dopiero w v6.

---

#### CRIT-3b — pisma-procesowe-v3: przewodnik-prawny-v1 → v2 ✅ NAPRAWIONY

| Plik | Linia | Zmiana |
|------|-------|--------|
| `pisma-procesowe-v3/modules/MOD-ROUTE.md` | 126 | `przewodnik-prawny-v1` → `przewodnik-prawny-v2` |

**Przyczyna:** Routing do nieistniejącego (usuniętego) skilla v1 zamiast aktualnego v2.

---

### 3. OSTRZEŻENIA (WARN — nieblokujące)

#### WARN-5 — chronologia-sprawy-v1: description skrócony ✅ NAPRAWIONY

| Plik | Zmiana |
|------|--------|
| `chronologia-sprawy-v1/SKILL.md` | Description: 1037 → 671 znaków (limit: 1024) |

**Przyczyna:** Przekroczenie limitu długości description (1024 znaki). Skill mógł nie być poprawnie rozpoznawany przez router.

---

#### WARN-1 — shared/DEPENDENCY-GRAPH.md — brakujące wpisy ⚠️ OTWARTE

19 plików aktywnych w systemie nie jest uwzględnionych w grafie zależności:
- CLAIM-VALIDATION, WERYFIKACJA-SLAD, ORZECZENIA-OUTPUT-SCHEMA i inne

**Ryzyko:** niskie — plik jest DOCS-ONLY, nie jest wywoływany runtime.

---

#### WARN-2 — shared: pliki z odwołaniami tylko z archive/ ⚠️ OTWARTE

Dwa pliki mają odwołania wyłącznie z katalogu archive/:
- `MATRIX-COMPLETENESS-AUDIT-GATE.md`
- `MATRIX-ROUTING-PRIORITY-RULES.md`

**Zalecenie:** Rozważyć przeniesienie do `archive/`.

---

#### WARN-3 — shared/SKILL.md — niekompletna tabela rejestru ⚠️ OTWARTE

Tabela rejestru w `shared/SKILL.md` nie zawiera wszystkich aktywnych plików (poza obecną listą).

**Zalecenie:** Rozszerzyć o brakujące wpisy.

---

#### WARN-4 — dr-07: Rozp. RM 2020.2437 (progi PZP) ⚠️ DO WERYFIKACJI

Rozporządzenie oznaczone jako "do weryfikacji" w mapie Dz.U.

---

#### WARN-5b — analizator-dowodow-v3: Rozp. MS 2015.1800 ⚠️ DO WERYFIKACJI

Rozporządzenie (stawki minimalne komornicze) oznaczone "do weryfikacji".

---

#### WARN-6 — dr-16: Rozp. RM 2008.1656 (wykaz prac uciążliwych) ⚠️ DO WERYFIKACJI

Rozporządzenie oznaczone "weryfikuj" — może istnieć nowelizacja.

---

### 4. WERYFIKACJA MAPY Dz.U. (2026-06-05)

**Metoda:** Przegląd online ISAP + analiza kontekstu skilli  
**Łączna liczba unikalnych Dz.U.:** 355  
**Zakres weryfikacji:** wszystkie wpisy

| Kategoria | Liczba |
|-----------|--------|
| Status OK | ~335 |
| Status PREV (ref historyczne) | ~20 |
| Do weryfikacji (oznaczone wprost) | 3 (WARN-4, WARN-5b, WARN-6) |
| Błędy w mapie | 0 |

**Kluczowe aktualizacje t.j. w 2026 roku:**
- KPC: 2026.468 (t.j. 2026) — zastąpił 2024.1816
- KPK: 2026.490 (t.j. 2026)
- KRO: 2026.236 (t.j. 2026)
- PB: 2026.524 (t.j. 27.03.2026)
- PrFarm: 2026.612 (t.j. 17.04.2026)
- PIT: 2026.592 (t.j. 17.04.2026)
- CIT: 2026.554 (t.j. 27.03.2026)
- OrdPod: 2026.622 (t.j. 25.05.2026)
- PrNotariat: 2026.614 (t.j. 07.05.2026)

---

### 5. STRUKTURA SYSTEMU — SNAPSHOT (2026-06-04)

```
/mnt/skills/user/
├── shared/                          120 pl. / 5 kat. / ~354 KB  ✅
├── analizator-umow-v1/               26 pl. / 1 kat. / ~331 KB  ✅ (CRIT-1, CRIT-2)
├── prawny-router-v3/                 28 pl. / 6 kat. / ~203 KB  ✅
├── analizator-dowodow-v3/            37 pl. / 6 kat. / ~176 KB  ✅
├── dr-03-prawo-karne/                26 pl. / 1 kat. / ~143 KB  ✅
├── dr-10-zdrowie-farmacja/           27 pl. / 1 kat. / ~125 KB  ✅
├── dr-02-prawo-cywilne/              35 pl. / 1 kat. / ~136 KB  ✅ (CRIT-3a)
├── analiza-sadowa-v6/                19 pl. / 2 kat. / ~114 KB  ✅
├── dr-09-budownictwo/                28 pl. / 1 kat. / ~109 KB  ✅
├── pisma-procesowe-v3/               30 pl. / 5 kat. / ~103 KB  ✅ (CRIT-3b)
├── pisma-proste-v2/                  21 pl. / 1 kat. /  ~99 KB  ✅
├── dr-04-prawo-pracy/                29 pl. / 1 kat. /  ~95 KB  ✅
├── dr-06-podatki/                    23 pl. / 1 kat. /  ~69 KB  ✅
├── dr-11-cyfrowe-cyber-ai/           22 pl. / 1 kat. /  ~70 KB  ✅
├── dr-08-samorzad/                   22 pl. / 1 kat. /  ~68 KB  ✅
├── dr-07-zamowienia/                 16 pl. / 1 kat. /  ~57 KB  ✅
├── dr-15-compliance-iso/             11 pl. / 1 kat. /  ~45 KB  ✅
├── dr-05-prawo-adm/                  13 pl. / 1 kat. /  ~47 KB  ✅
├── dr-13-sluzby/                     11 pl. / 1 kat. /  ~46 KB  ✅
├── dr-16-pisma-strategia/            13 pl. / 1 kat. /  ~49 KB  ✅
├── dr-12-sadownictwo/                13 pl. / 1 kat. /  ~43 KB  ✅
├── przesluchanie-swiadkow-v2-min90/  28 pl. /15 kat. /  ~71 KB  ✅
├── przewodnik-prawny-v2/              5 pl. / 3 kat. /  ~43 KB  ✅
├── analizator-przepisow-v2/           2 pl. / 1 kat. /  ~40 KB  ✅
├── orzeczenia-sadowe-v2/              2 pl. / 1 kat. /  ~35 KB  ✅
├── chronologia-sprawy-v1/             7 pl. / 3 kat. /  ~34 KB  ✅ (WARN-5)
├── dr-14-prawo-ue/                   10 pl. / 1 kat. /  ~30 KB  ✅
├── raport-klienta-v1/                 7 pl. / 3 kat. /  ~29 KB  ✅
├── raport-sytuacyjny-v2/             13 pl. / 4 kat. /  ~29 KB  ✅
├── prawo-polskie-v2/                  2 pl. / 0 kat. /  ~20 KB  ✅
├── audyt-systemu-v3/                  1 pl. / 0 kat. /  ~23 KB  ✅
├── prompt-master/                     2 pl. / 1 kat. /  ~16 KB  ✅
└── dr-01-ustroj/                      6 pl. / 1 kat. /  ~16 KB  ✅

RAZEM: ~667 plików / ~71 katalogów / ~2.9 MB
```

---

### 6. WNIOSKI I ZALECENIA

**Naprawiono wszystkie błędy blokujące (CRIT-1..3b).** System jest w pełni operacyjny.

Zalecenia na kolejny audyt:
1. Zamknąć WARN-1: uzupełnić DEPENDENCY-GRAPH.md o 19 brakujących plików
2. Zamknąć WARN-2: zdecydować o przeniesieniu 2 plików do archive/
3. Zamknąć WARN-3: rozszerzyć shared/SKILL.md — tabelę rejestru
4. Zweryfikować online 3 rozporządzenia oznaczone "do weryfikacji" (WARN-4, 5b, 6)
5. Sprawdzić Dz.U. 2026 po poz. 670 (nowe t.j. mogły się pojawić od 05.06.2026)

---

## SZABLON NOWEGO WPISU

Kopiuj poniżej przy kolejnym audycie:

```markdown
## AUDYT-YYYY-MM-DD

**Data audytu:** YYYY-MM-DD  
**Zakres:**  
**Narzędzie:**  
**Audytor:**  
**Pliki źródłowe:**

### 1. STATUS OGÓLNY
| Kategoria | Wynik |
|-----------|-------|
| Błędy CRIT | |
| Ostrzeżenia WARN | |
| Dz.U. — nowe t.j. | |

### 2. NAPRAWY WYKONANE (CRIT)
<!-- ID — opis — ✅ NAPRAWIONY / ⚠️ OTWARTE -->

### 3. OSTRZEŻENIA (WARN)
<!-- ID — opis — status -->

### 4. WERYFIKACJA Dz.U.
<!-- nowe t.j., nowe nowelizacje, zmiany statusów PREV -->

### 5. WNIOSKI
<!-- zalecenia na kolejny audyt -->
```

---

*Ostatnia aktualizacja: 2026-06-05*  
*Powiązany plik referencyjny: `AUDIT-REFERENCES.md`*
