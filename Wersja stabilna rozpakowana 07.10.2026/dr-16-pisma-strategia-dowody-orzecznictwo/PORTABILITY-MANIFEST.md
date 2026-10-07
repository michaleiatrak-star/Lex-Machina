# Portability manifest — dr-16-pisma-strategia-dowody-orzecznictwo

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Source files preserved before portability additions: **14**
- Frontmatter description: **155/200** characters
- Verified unique active shared file refs: **3**
- Verified unique active local file refs: **1**
- Verified unique active cross-skill file refs: **0**

## Zasada shared

`shared` pozostaje osobnym kanonicznym SSOT. Paczka nie zawiera kopii `shared` ani innych skilli.

## Zakres zmian

Zmieniono wyłącznie metadane trigger/capability i dodano adapter runtime. Wszystkie moduły, mapy aktów, checklisty, bramki i pliki pomocnicze źródłowego DR-skilla zachowano.
## V3 — semantic routing integrity

Aktywne historyczne aliasy modułów zastąpiono kanonicznymi istniejącymi modułami tej samej dziedziny prawa. Router nie jest źródłem prawa materialnego.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
