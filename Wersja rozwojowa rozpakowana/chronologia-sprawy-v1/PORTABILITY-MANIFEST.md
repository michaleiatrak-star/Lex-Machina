# Portability manifest — chronologia-sprawy-v1

- Source repository: `michaleiatrak-star/Lex-Machina`
- Source commit: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Original SKILL.md blob: `9337eb7e091761ce40e2d48c6fdf75cd3d04d9bc`
- Original skill files copied before portability additions: **9**
- Frontmatter description length: **173/200**

## Zasada shared

`shared` pozostaje osobnym kanonicznym skillem; ten ZIP nie zawiera jego kopii.

## Zmiany wyłącznie runtime portability

1. `Anthropic API` w compatibility zastąpiono neutralnymi capability.
2. Skrócono tylko frontmatter `description`; historia wersji i auto-trigger pozostają w treści.
3. Dodano adapter dla legacy ścieżek, narzędzi oraz renderowania widgetu/JSX.
4. Pełne `assets`, `references` i archiwalne `upgrade-min8` pozostają w ZIP-ie.
5. Ekstrakcja, sprzeczności, finanse, pewność i proweniencja nie zostały przepisane.

## Zasada nienaruszania instrukcji

Instrukcje zrozumiałe i wykonalne przez host pozostają bez zmian; adapter działa tylko na granicy runtime.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
