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
  HYBRID-VALIDATION — walidacja hybrydowa po wygenerowaniu pisma/dokumentu
  INTAKE-GAP        — zarządzanie brakami danych faktycznych (⬛ pola, tryby 1–3)
  POST-VALIDATION   — walidacja spójności po wygenerowaniu pisma
  MOD-WALIDACJA     — walidacja formalna i prawnicza pisma (bloki A–I, JEDYNE ŹRÓDŁO PRAWDY)
                      (poprzednio duplikowany w pisma-procesowe-v3/modules/ i prawny-router-v3/references/)
  terminy           — terminy procesowe zawite i przedawnienia (KPC/KPK/KPW/KPA/KP)
  FAKTY (MOD-FAKTY)         — weryfikacja zgodności faktycznej pisma ze źródłem
  raport-sytuacyjny-integracja — sekwencja wywołania widgetu Raportu Sytuacyjnego v2
---

# shared/ — Wspólne moduły systemu prawnych skilli

Katalog zawiera pliki kanoniczne współdzielone przez wszystkie skille prawne.
Nie jest samodzielnym skillem — pełni rolę biblioteki referencji.

## Zawartość katalogu

| Plik | Rola |
|------|------|
| `HYBRID-VALIDATION.md` | Walidacja hybrydowa — auto-raport braków po piśmie (Fazy 1–3) |
| `INTAKE-GAP.md` | Zarządzanie brakami danych faktycznych (⬛ pola, tryby 1–3) |
| `POST-VALIDATION.md` | Walidacja spójności po wygenerowaniu gotowego pisma |
| `terminy.md` | Tabela terminów zawitych i przedawnień (KPC, KPK, KPW, KPA, KP, PPSA) |
| `FAKTY.md`                        | Weryfikacja zgodności faktycznej pisma ze źródłem (MOD-FAKTY) |
| `raport-sytuacyjny-integracja.md` | Sekwencja wywołania widgetu Raportu Sytuacyjnego v2 |

Pliki w `prawny-router-v3/references/` (nie w shared, ale powiązane):
| `pokrycie-dziedzinowe.md` | Pełna mapa dziedzin → modułów → powiązanych skilli (28 dziedzin) |

Wszystkie pliki są kanoniczne — nie istnieją stuby ani kopie w innych lokalizacjach.

## Jak korzystać

Każdy skill wczytuje pliki z tego katalogu bezpośrednio przez `view`:

```
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
view /mnt/skills/user/shared/INTAKE-GAP.md
view /mnt/skills/user/shared/POST-VALIDATION.md
view /mnt/skills/user/shared/terminy.md
view /mnt/skills/user/shared/FAKTY.md
view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
```

Nie wczytuj wszystkich naraz — tylko te potrzebne dla danego kroku.

> **Uwaga:** `raport-sytuacyjny-integracja.md` jest wywoływany przez `prawny-router-v3`
> opisowo (punkty self-check [A]/[B]/[C]). Skille dziedzinowe nie wywołują go przez `view` —
> logika wyzwalania jest w routerze. `FAKTY.md` jest wbudowany bezpośrednio w `pisma-procesowe-v3`
> i `pisma-proste-v2` (sekcje MOD-FAKTY / M-FAKTY) — wywołanie przez `view` możliwe gdy potrzebna
> jest pełna wersja modułu.

## Zasada utrzymania (v2.0)

- Wszystkie pliki w tym katalogu są **kanoniczne** — jedyna kopia w systemie
- Stuby lokalne w katalogach poszczególnych skilli zostały usunięte
- Skille wywołują pliki bezpośrednio przez `view /mnt/skills/user/shared/X.md`
- Nie twórz lokalnych kopii ani stubów — aktualizuj tylko ten katalog
