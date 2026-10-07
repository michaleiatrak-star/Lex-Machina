# Portability manifest — dr-02-prawo-cywilne-rodzinne-gospodarcze

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Source files preserved before portability additions: **73**
- Frontmatter description: **153/200** characters
- Verified unique active shared file refs: **3**
- Verified unique active local file refs: **3**
- Verified unique active cross-skill file refs: **1**

## Zasada shared

`shared` pozostaje osobnym kanonicznym SSOT. Paczka nie zawiera kopii `shared` ani innych skilli.

## Zakres zmian

Zmieniono wyłącznie metadane trigger/capability i dodano adapter runtime. Wszystkie moduły, mapy aktów, checklisty, bramki i pliki pomocnicze źródłowego DR-skilla zachowano.

## Integralność odwołań — korekta

Wydanie po pełnym skanie ścieżek kanonicznych. Aktywne odwołania do nieistniejących/starych lokalizacji zostały skierowane do istniejących modułów; wpisy historyczne i jawne placeholdery pozostawiono bez zmian.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.


## Rozszerzenie PrUp 2026-10-04 (3.62)

Po bazowej migracji dodano źródłowy korpus PrUp, czytnik Python 3 bez zależności
zewnętrznych i pięć modułów. Odczyt PDF/JSON/Markdown działa również bez Pythona;
brak Pythona nie upoważnia do pominięcia weryfikacji online. Aktualna integralność
plików jest w CHECKSUMS.sha256. Nowa treść nie jest deklaracją niezmienności
merytorycznej z historycznej sekcji „Zakres zmian”.

## Pełne oba korpusy — 2026-10-04

Python 3 (biblioteka standardowa): `scripts/prup.py`, `scripts/prrestr.py`,
`scripts/insolvency.py`. Bez Pythona czytaj pełne PDF-y i moduły, a świeżość
sprawdź przez oficjalne ELI narzędziem hosta. Wszystkie ścieżki są względne
wobec katalogu skilla; aktualny katalog roboczy nie wpływa na odczyt.
