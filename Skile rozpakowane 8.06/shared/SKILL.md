---
name: shared
version: 2.0
type: library
compatibility: "wszystkie skille prawne systemu"
description: |
  Biblioteka współdzielonych modułów systemu prawnych skilli.
  NIE jest samodzielnym skillem — zawiera pliki kanoniczne
  wczytywane przez inne skille przez view.

  Zawiera:
  PRAWO-HARDGATE    — ⛔ HARD GATE zakazu cytowania prawa/orzeczeń z pamięci (globalny)
  HYBRID-VALIDATION — walidacja hybrydowa po wygenerowaniu pisma/dokumentu
  INTAKE-GAP        — zarządzanie brakami danych faktycznych (⬛ pola, tryby 1–3)
  POST-VALIDATION   — walidacja spójności po wygenerowaniu pisma
  MOD-WALIDACJA_v2  — walidacja formalna i prawnicza pisma (bloki A–J, JEDYNE ŹRÓDŁO PRAWDY)
  FACT-SOURCE-LOCK  — klasyfikacja faktów FSL-A/B/C (via MOD-WALIDACJA_v2 Blok J)
  LEGAL-STATUS-LOCK — weryfikacja statusów aktów LSL-1..6 (via MOD-WALIDACJA_v2 Blok J)
  terminy           — terminy procesowe zawite i przedawnienia (KPC/KPK/KPW/KPA/KP)
  FAKTY (MOD-FAKTY) — weryfikacja zgodności faktycznej pisma ze źródłem
  raport-sytuacyjny-integracja — sekwencja wywołania widgetu Raportu Sytuacyjnego v2
---

# shared/ — Wspólne moduły systemu prawnych skilli

Katalog zawiera pliki kanoniczne współdzielone przez wszystkie skille prawne.
Nie jest samodzielnym skillem — pełni rolę biblioteki referencji.

## Zawartość katalogu

| Plik | Rola |
|------|------|
| `PRAWO-HARDGATE.md` | ⛔ Globalny zakaz cytowania prawa/orzeczeń z pamięci — wczytaj przed każdym przepisem |
| `HYBRID-VALIDATION.md` | Walidacja hybrydowa — auto-raport braków po piśmie (Fazy 1–3) |
| `INTAKE-GAP.md` | Zarządzanie brakami danych faktycznych (⬛ pola, tryby 1–3) |
| `POST-VALIDATION.md` | Walidacja spójności po wygenerowaniu gotowego pisma |
| `MOD-WALIDACJA_v2.md` | ⭐ Walidacja formalna i prawnicza pisma (bloki A–J) — **JEDYNE ŹRÓDŁO PRAWDY** |
| `MOD-WALIDACJA.md` | STUB → przekierowuje do `MOD-WALIDACJA_v2.md` (zachować dla kompatybilności) |
| `FACT-SOURCE-LOCK.md` | Klasyfikacja faktów FSL-A/B/C — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `LEGAL-STATUS-LOCK.md` | Weryfikacja statusów aktów LSL-1..6 — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `terminy.md` | Tabela terminów zawitych i przedawnień (KPC, KPK, KPW, KPA, KP, PPSA) |
| `FAKTY_v2.md`                        | Weryfikacja zgodności faktycznej pisma ze źródłem (MOD-FAKTY) |
| `raport-sytuacyjny-integracja.md` | Sekwencja wywołania widgetu Raportu Sytuacyjnego v2 |

Pliki w `prawny-router-v3/references/` (nie w shared, ale powiązane):
| `pokrycie-dziedzinowe.md` | Pełna mapa dziedzin → modułów → powiązanych skilli (28 dziedzin) |

Wszystkie pliki są kanoniczne — nie istnieją stuby ani kopie w innych lokalizacjach.

## Jak korzystać

Każdy skill wczytuje pliki z tego katalogu bezpośrednio przez `view`:

```
view /mnt/skills/user/shared/PRAWO-HARDGATE.md  ← wymagane przed każdym przepisem/orzeczeniem
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
view /mnt/skills/user/shared/INTAKE-GAP.md
view /mnt/skills/user/shared/POST-VALIDATION.md
view /mnt/skills/user/shared/terminy.md
view /mnt/skills/user/shared/FAKTY_v2.md
view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
```

Nie wczytuj wszystkich naraz — tylko te potrzebne dla danego kroku.

> **Uwaga:** `raport-sytuacyjny-integracja.md` jest wywoływany przez `prawny-router-v3`
> opisowo (punkty self-check [A]/[B]/[C]). Skille dziedzinowe nie wywołują go przez `view` —
> logika wyzwalania jest w routerze. `FAKTY_v2.md` jest wbudowany bezpośrednio w `pisma-procesowe-v3`
> i `pisma-proste-v2` (sekcje MOD-FAKTY / M-FAKTY) — wywołanie przez `view` możliwe gdy potrzebna
> jest pełna wersja modułu.

## Zasada utrzymania (v2.1 — 2026-06-04)

- `DEPENDENCY-GRAPH.md` — pełna mapa zależności: który skill wywołuje który moduł; aktualizuj przy każdej zmianie
- `archive/` — 43 pliki nieaktywne (0 odwołań); nie usuwać, przenieść z powrotem przy potrzebie

- Wszystkie pliki w tym katalogu są **kanoniczne** — jedyna kopia w systemie
- Stuby lokalne w katalogach poszczególnych skilli zostały usunięte
- Skille wywołują pliki bezpośrednio przez `view /mnt/skills/user/shared/X.md`
- Nie twórz lokalnych kopii ani stubów — aktualizuj tylko ten katalog

## Moduły kancelaryjne v3.0 — obowiązkowe moduły współdzielone

| Plik | Rola |
|------|------|
| `FORMAL-CHECK.md` | Centralna walidacja formalna pisma i decyzja: gotowe / uzupełnić / nie składać |
| `BRAKI-FORMALNE.md` | Klasyfikacja braków krytycznych, istotnych i technicznych |
| `WARUNKI-SKUTECZNOSCI.md` | Warunki procesowej skuteczności pozwu, apelacji, zażalenia, sprzeciwu, KPA itd. |
| `TRYBY-PROCESOWE.md` | Centralny rejestr trybów, etapów, rygorów i modułów do wczytania |
| `PREKLUZJA-DOWODOWA.md` | Kontrola spóźnionych twierdzeń i dowodów |
| `TERM-CALC.md` | Metodologia kontroli terminów; nie zastępuje kalendarza sądowego |
| `RISK-ASSESSMENT.md` | Matryca ryzyka formalnego, dowodowego, prawnego i kosztowego |
| `ORZECZENIA-HIERARCHIA.md` | Hierarchia orzecznictwa, test aktualności i karta orzeczenia |
| `DOWODY-METODOLOGIA.md` | Matryca dowodowa i test wiarygodności dowodu |
| `ROSZCZENIA.md` | Konstrukcja roszczeń głównych, ewentualnych i alternatywnych |
| `STRATEGIA-PROCESOWA.md` | Taktyka procesowa i wybór następnego ruchu |
| `QUALITY-CHECK.md` | Kontrola jakości pisma: logika, struktura, nadmiar, emocjonalność |
| `KANCELARIA-WORKFLOW.md` | Sekwencja pracy kancelaryjnej możliwa w `.md skills` |
| `STATUS.md` | Rejestr wersji i statusów modułów shared |

### Obowiązkowe wywołania dla generatorów pism

Przy każdym piśmie gotowym do złożenia generator musi co najmniej wczytać:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/FORMAL-CHECK.md
view /mnt/skills/user/shared/BRAKI-FORMALNE.md
view /mnt/skills/user/shared/WARUNKI-SKUTECZNOSCI.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Gdy występują terminy, dowody, orzecznictwo albo strategia, dodatkowo:

```text
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md
view /mnt/skills/user/shared/ROSZCZENIA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
```
