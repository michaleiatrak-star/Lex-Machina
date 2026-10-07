# Portability manifest — raport-klienta-v1

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Source files preserved: **2**
- Description: **158/200**
- Active shared refs verified: **5**
- Active local refs verified: **0**
- Active cross-skill refs verified: **0**

## Zasada shared

`shared` pozostaje osobnym kanonicznym SSOT; paczka nie zawiera jego kopii ani kopii innych skilli.

## Zakres zmian

Dodano wyłącznie warstwę portability i zwięzłe metadane trigger/capability. Treść merytoryczna oraz komplet własnych plików skilla zostały zachowane.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
