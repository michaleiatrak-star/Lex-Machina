# DEDUPLICATION-POLICY

Stan: 2026-06-13 (usunięcie martwych stubów, dokumentacja świadomych duplikatów).

## Zasada

Moduły merytoryczne prawa polskiego są kanonicznie w:

`/mnt/skills/user/shared/`

Router i skille dziedzinowe wywołują je **bezpośrednio** przez:
```
view /mnt/skills/user/shared/NAZWA.md
```

**Zakaz tworzenia lokalnych stubów/adapterów** — od 2026-06-13 każde wywołanie modułu shared/ musi być bezpośrednie. Stuby pośrednie (`references/HYBRID-VALIDATION.md` → `shared/HYBRID-VALIDATION.md`) są niedopuszczalne i będą usuwane w audytach.

## Stuby zadeklarowane jako usunięte 2026-06-13 — FAKTYCZNIE usunięte 2026-07-12

> **Korekta (2026-07-12):** ten nagłówek od 2026-06-13 twierdził, że poniższe
> pliki zostały usunięte. Nie zostały — `ci_check_shared.py` (audyt
> gotowości komercyjnej) potwierdził, że 9 z 10 wciąż fizycznie leżało na
> dysku jako martwe stuby, mimo tej deklaracji. Zweryfikowano ponownie
> (zero żywych `view()` na pełną ścieżkę każdego pliku) i usunięto naprawdę
> w tej sesji. Jedyny faktycznie usunięty wcześniej: `raport-sytuacyjny-v2/
> references/HYBRID-VALIDATION.md`. Pełny opis: AUDIT-JOURNAL.md,
> wpis AUDYT-2026-07-12g.

Następujące pliki były martwymi stubami (nie wywoływanymi przez żaden `view` w SKILL.md):

| Usunięty plik | Docelowy plik shared/ | Powód usunięcia |
|---|---|---|
| `pisma-procesowe-v3/modules/MOD-WALIDACJA.md` | `shared/MOD-WALIDACJA_v2.md` | SKILL.md wywołuje bezpośrednio shared/ |
| `prawny-router-v3/references/MOD-WALIDACJA.md` | `shared/MOD-WALIDACJA_v2.md` | Martwy — nie wywoływany przez view |
| `prawny-router-v3/references/HYBRID-VALIDATION.md` | `shared/HYBRID-VALIDATION.md` | Martwy — nie wywoływany przez view |
| `prawny-router-v3/references/ISAP-AUDIT-PROTOCOL.md` | `shared/ISAP-AUDIT-PROTOCOL.md` | Martwy — nie wywoływany przez view |
| `pisma-proste-v2/references/HYBRID-VALIDATION.md` | `shared/HYBRID-VALIDATION.md` | Martwy — nie wywoływany przez view |
| `pisma-proste-v2/references/INTAKE-GAP.md` | `shared/INTAKE-GAP.md` | Martwy — nie wywoływany przez view |
| `pisma-proste-v2/references/POST-VALIDATION.md` | `shared/POST-VALIDATION.md` | Martwy — nie wywoływany przez view |
| `pisma-proste-v2/references/terminy.md` | `shared/terminy.md` | Martwy — nie wywoływany przez view |
| `pisma-proste-v2/references/M5-terminy.md` | `shared/terminy.md` | Martwy — nie wywoływany przez view; `pisma-proste-v2/references/M1-zasady.md` (ZASADA 6) zaktualizowany na bezpośrednie odwołanie |
| `raport-sytuacyjny-v2/references/HYBRID-VALIDATION.md` | `shared/HYBRID-VALIDATION.md` | Martwy — SKILL.md wywołuje bezpośrednio shared/ (faktycznie usunięty już 2026-06-13) |

## Duplikaty bajtowe scalone 2026-07-12 (audyt komercyjny, wykryte przez ci_check_shared.py)

| Usunięte pliki (oba) | Nowy plik kanoniczny | Uwaga |
|---|---|---|
| `analizator-dowodow-v3/modules/MOD-NAZEWNICTWO-STRON.md` | `shared/NAZEWNICTWO-STRON.md` (już istniał, konsumenci przekierowani) | 2 wywołania w analizator-dowodow-v3/SKILL.md przekierowane |
| `dr-03/modules/mod-KK-stalking-szczegolowy.md` + `prawny-router-v3/references/stalking-nekanie.md` | `shared/STALKING-NEKANIE.md` (nowy) | Patrz NOTA-12 w CHECKLIST-DEDUP.md |
| `dr-16/modules/mod-KPC-przesluchanie-swiadkow.md` + `prawny-router-v3/references/przesluchanie-swiadkow.md` | `shared/PRZESLUCHANIE-SWIADKOW-KPC.md` (nowy) | Patrz NOTA-13 w CHECKLIST-DEDUP.md. Nie mylić z pełnym skillem `przesluchanie-swiadkow-v2-min90` (inny zakres — zaawansowana strategia, nie ramowy KPC) |

## Pliki kanoniczne w shared/ (jedyne źródła prawdy)

| Plik | Funkcja |
|---|---|
| `HYBRID-VALIDATION.md` | Walidacja hybrydowa po wygenerowaniu pisma |
| `INTAKE-GAP.md` | Zarządzanie brakami danych faktycznych |
| `POST-VALIDATION.md` | Walidacja spójności po wygenerowaniu pisma |
| `MOD-WALIDACJA_v2.md` | Walidacja formalna i prawnicza (bloki A–J) — JEDYNE ŹRÓDŁO |
| `MOD-WALIDACJA.md` | STUB → przekierowuje do MOD-WALIDACJA_v2.md (zachować dla kompatybilności) |
| `FAKTY_v2.md` | MOD-FAKTY — weryfikacja zgodności faktycznej ze źródłem |
| `FAKTY.md` | STUB → przekierowuje do FAKTY_v2.md (zachować dla kompatybilności) |
| `ISAP-AUDIT-PROTOCOL.md` | Protokół aktualności prawa |
| `WERYFIKACJA-SLAD.md` | Ślad weryfikacji przepisów i orzeczeń |
| `terminy.md` | Tabela terminów zawitych (KPC/KPK/KPW/KPA/KP) |
| `SYGNATURY.md` | Format sygnatur procesowych (V-SYG-1/2/3/4) |
| `DISCLAIMER.md` | Disclaimer prawny (LAIK/PRAWNIK) |
| `PRAWO-HARDGATE.md` | Hard gate zakazu cytowania z pamięci |
| `NAZEWNICTWO-STRON.md` | Tabele nazewnictwa stron T1-T10, wzory nagłówków N1-N7 (dodany do rejestru 2026-07-12, istniał już wcześniej) |
| `STALKING-NEKANIE.md` | Framework art. 190a KK — stalking i nękanie (scalony 2026-07-12) |
| `PRZESLUCHANIE-SWIADKOW-KPC.md` | Ramowy framework KPC art. 258-305 — przesłuchanie świadków (scalony 2026-07-12; nie mylić z pełnym skillem przesluchanie-swiadkow-v2-min90) |

## Świadome duplikaty — udokumentowane wyjątki (2026-06-13)

Poniższe moduły istnieją w dwóch DR-skillach. **NIE są błędami.** Zakresy merytoryczne się nie pokrywają.

### mod-ustawa-sygnalisci.md

| Lokalizacja | Zakres | Kiedy ładować |
|---|---|---|
| `dr-05/.../mod-ustawa-sygnalisci.md` | Perspektywa procesowa sygnalisty: kanały zgłoszenia, ochrona przed odwetem, roszczenia, pisma do RPO/PIP | Gdy klient = sygnalista chroniący swoje prawa |
| `dr-15/.../mod-ustawa-sygnalisci.md` | Perspektywa compliance pracodawcy: wdrożenie kanału, ISO 37301 CMS, AML, RODO w rejestrze, audyt | Gdy klient = pracodawca wdrażający lub audytujący system |

### mod-ustawa-cudzoziemcy.md

| Lokalizacja | Zakres | Kiedy ładować |
|---|---|---|
| `dr-05/.../mod-ustawa-cudzoziemcy.md` | **Kanoniczny** — pełna taksonomia tytułów pobytowych, wydalenie, SZUSC→WSA→NSA, ochrona międzynarodowa | Domyślny dla spraw administracyjnych i procesowych |
| `dr-02/.../mod-ustawa-cudzoziemcy.md` | Skrócony — cywilno-pracowniczy, kary pracodawcy, ścieżka odwoławcza skrócona | Tylko gdy sprawa ograniczona do relacji pracodawca–cudzoziemiec |

Moduł DR-05 jest wersją kanoniczną. Aktualizuj merytorykę przede wszystkim w DR-05.

## Reguła dla nowych modułów

Każdy nowy moduł merytoryczny → wyłącznie w `shared/`.
Nowy adapter w skill → **tylko** gdy niezbędna jest logika specyficzna dla skilla wykraczająca poza samo przekierowanie. Wtedy wymagana adnotacja `ADAPTER` w nagłówku pliku i wpis w tej polityce.
