# Portability manifest — prawny-router-v3

- Pakiet bieżący: **42 plików**
- Description: **170/200**
- Ścieżki aktywne: semantyczne, rozwiązywane przez PATH-SELFTEST
- Zależności zewnętrzne: osobne skille wskazane w `dependencies.requires`

`shared` i wszystkie skille wykonawcze/dziedzinowe pozostają osobnymi
instalacjami. Pakiet routera nie zawiera ich kopii. Nazwy operacji są
semantyczne, a brak obowiązkowego zasobu prowadzi do jawnego trybu
zdegradowanego. Reguły routingu i HARD GATE są niezależne od hosta.

## Integralność odwołań — korekta

Wydanie po pełnym skanie ścieżek kanonicznych. Aktywne odwołania do nieistniejących/starych lokalizacji zostały skierowane do istniejących modułów; wpisy historyczne i jawne placeholdery pozostawiono bez zmian.
## V3 — semantic routing integrity

Aktywne historyczne aliasy modułów zastąpiono kanonicznymi istniejącymi modułami tej samej dziedziny prawa. Router nie jest źródłem prawa materialnego.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
