# Portability manifest — orzeczenia-sadowe-v2

- Source baseline: `0b54d97889fb40328b656bb152ef765458b4b384`
- Release: **2.16 (2026-09-14)**
- Files in complete skill package: **11**
- Description: **150/200**
- Active shared refs verified: **13**
- Active local refs verified: **4**
- Active cross-skill refs verified: **0**

## Zasada shared

`shared` pozostaje osobnym kanonicznym SSOT; paczka nie zawiera jego kopii ani kopii innych skilli.

## Zakres zmian

Wydanie 2.16 zachowuje dotychczasowe pliki skilla i dodaje trzy własne zasoby CBOSA:
`references/CBOSA-ADAPTER.md`, `tools/cbosa_parser.py` oraz
`tests/test_cbosa_parser.py`. `SKILL.md` został zaktualizowany punktowo:
bezpośredni CBOSA jest używany po fresh probe, a przy niedostępności obowiązuje
kanoniczny fallback V-SYG-0.5 z `shared/SYGNATURY.md`.

Parser działa fail-closed i nie zastępuje kanonicznych bramek shared. Status
`FOUND` z direct CBOSA oznacza odczyt metryki i treści; `FRAGMENT` wymaga
oddzielnego pinpointu. Test regresyjny parsera: **22/22 PASS** (drift HTML, paginacja, duplikaty, near-match, transport, zakres uzasadnienia).nym.

## Rule 7 / OUTPUT-COMPLETENESS

To wydanie jest przeznaczone do dystrybucji wyłącznie jako kompletny katalog
`orzeczenia-sadowe-v2` ze wszystkimi 11 plikami. Dostarczenie samego parsera,
samego `SKILL.md` albo diffu nie spełnia Reguły 7 audytu.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.
