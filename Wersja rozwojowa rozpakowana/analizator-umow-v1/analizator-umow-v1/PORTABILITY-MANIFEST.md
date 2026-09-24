# Portability manifest — analizator-umow-v1

- Source repository: `michaleiatrak-star/Lex-Machina`
- Source commit: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Original SKILL.md blob: `2160050c58f0733b7dcaa9c44fc494f72cd3ac7e`
- Original skill files copied before portability additions: **58**
- Frontmatter description length: **173/200**

## Zasada shared

`shared` pozostaje osobnym kanonicznym skillem. Ten ZIP nie zawiera kopii plików `shared`; build sprawdza aktywne odwołania do kanonicznych zasobów.

## Zmiany wyłącznie runtime portability

1. Usunięte z metadanych twarde wskazanie `/mnt/skills/user/shared/`.
2. Skrócony tylko frontmatter `description`; szczegółowe triggery pozostają w treści.
3. Dodany adapter dla legacy nazw narzędzi, ścieżek `/mnt/...` i dostarczania dokumentów.
4. Routing umów, moduły references/workflows, hard gate’y, step tracker, redakcja i walidacja dokumentów nie zostały przepisane.
5. Inne skille i `shared` pozostają odrębne.

## Zasada nienaruszania instrukcji

Instrukcje zrozumiałe i wykonalne przez host pozostają bez zmian; adapter działa tylko na granicy runtime.

## Integralność odwołań — korekta

Po pełnym skanie aktywne odwołania do nieistniejących lub historycznych lokalizacji skierowano do istniejących modułów. Placeholdery i wpisy historyczne pozostawiono bez zmian.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
