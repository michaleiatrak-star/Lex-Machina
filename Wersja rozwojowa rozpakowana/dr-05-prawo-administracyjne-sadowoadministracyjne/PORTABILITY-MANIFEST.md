# Portability manifest — dr-05-prawo-administracyjne-sadowoadministracyjne

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Source files preserved before portability additions: **31**
- Frontmatter description: **152/200** characters
- Verified unique active shared file refs: **2**
- Verified unique active local file refs: **2**
- Verified unique active cross-skill file refs: **0**

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
