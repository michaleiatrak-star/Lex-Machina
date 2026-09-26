# Portability manifest — analizator-przepisow-v2

- Source repository: `michaleiatrak-star/Lex-Machina`
- Source commit: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Original skill tree SHA: `ec65a43dca61467ea24157583a361739e1faab8e`
- Original skill files copied before portability additions: **4**
- Frontmatter description length: **181/200**

## Zasada shared

`shared` pozostaje osobnym kanonicznym skillem. Ten ZIP NIE zawiera kopii plików `shared`; build jedynie potwierdza istnienie referencjonowanych zasobów w kanonicznym katalogu repo.

## Zmiany wyłącznie runtime portability

1. Neutralne capability metadata zamiast nazw narzędzi jednego hosta.
2. Skrócony tylko frontmatter `description`; szczegółowe triggery i funkcje pozostają w treści.
3. Dodany adapter dla legacy `view`, `web_search`, `web_fetch`, `show_widget`, `sendPrompt` i `/mnt/...`.
4. Moduły analizy, orzecznictwa, historii zmian, vacatio legis, drzewo przesłanek i schemat widgetu nie zostały przepisane.
5. Inne skille, w tym `shared`, pozostają odrębne.

## Zasada nienaruszania instrukcji

Instrukcje zrozumiałe i wykonalne przez host pozostają bez zmian; adapter działa wyłącznie na granicy runtime.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
