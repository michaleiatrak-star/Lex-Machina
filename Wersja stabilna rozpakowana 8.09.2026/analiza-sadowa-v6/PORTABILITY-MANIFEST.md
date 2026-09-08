# Portability manifest — analiza-sadowa-v6

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Corrected distribution rule: only the complete own `analiza-sadowa-v6` source tree is packaged.
- `shared` remains a separate canonical SSOT; no shared files are vendored.
- Source files preserved before portability additions: **20**
- Verified active shared refs: **17**
- Verified active local refs: **1**
- Verified active cross-skill refs: **0**

## Zakres zmian

Zmieniono wyłącznie metadane portability i dodano adapter runtime. Czteroprzebiegowa metodologia, references/, engines/, hard gate’y i zasady weryfikacji pozostają merytorycznie bez zmian.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
