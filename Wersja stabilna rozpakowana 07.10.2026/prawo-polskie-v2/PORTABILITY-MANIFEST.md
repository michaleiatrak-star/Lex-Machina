# Portability manifest — prawo-polskie-v2

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Pełne własne drzewo skilla zachowane.
- `shared`, DR-skille i router pozostają osobnymi zależnościami; brak kopii.
- Zmieniono tylko metadane runtime i dodano adapter operacji technicznych.
- Routing, `ROUTING-MAP.md`, reżim mapy Dz.U. i logika DR-01–DR-16 nie zostały przepisane.
## V3 — semantic routing integrity

Aktywne historyczne aliasy modułów zastąpiono kanonicznymi istniejącymi modułami tej samej dziedziny prawa. Router nie jest źródłem prawa materialnego.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
