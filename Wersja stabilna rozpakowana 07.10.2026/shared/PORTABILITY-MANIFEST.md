# Portability manifest — shared

- Source baseline: `e35599cf505b47d061e0ddca608c009feb4035bc`
- Release: **3.86 (2026-09-27e, AUDYT-2026-09-27e)** — dodany `.claude-plugin/plugin.json` (193 pliki z CHECKSUMS; limit wydania 200)
- Current files in complete shared package: **192** (3.93: −2 — archiwum serwerów MCP i instalator przeniesione do audyt-systemu-v4; wcześniej 192 (+16 vs 3.82's 176: 8 narzędzi `tools/*.py` +
  `tools/przyklad-adapter-normalizujacy.md` + 4 fixture'y `tools/przyklady/` +
  `tools/mcp-servers/mcp-servers-examples.zip` (historyczne; od 3.93 w audyt-systemu-v4) — wszystkie przywrócone bajt-w-bajt z historii git
  repozytorium `michaleiatrak-star/lex-machina`, commit sprzed `6dbe7a0`; 42 luźne pliki
  `tools/mcp-servers/**/*` NIE trzymane osobno na dysku — tylko w ZIP-ie, żeby zmieścić się w
  limicie 200 plików)
- ⚠️ (historyczne) Archiwum `tools/mcp-servers/mcp-servers-examples.zip` — od 3.93 przeniesione do `audyt-systemu-v4/mcp-servers/` jako pliki rozpakowane; PRZYWRÓCONE 2026-09-26d
  (F-206) — od 2026-08-27 (merge `d3385b9`) do 2026-09-26d było nieobecne w pakiecie mimo opisu w `SKILL.md`
- Original files: **205**
- Expanded files after lossless MCP-example compaction, before manifest/checksums: **164**
- Frontmatter description: **163/200**
- Nested MCP archive SHA-256: `6b240d1dc2249daef42b303495831c4809767784677e8d12a7538b53613f2d5d`
  (przebudowany 2026-09-26d — poprzedni hash `6b16d446e...` pochodził z innej kompresji tej samej
  treści i jest nieodtwarzalny przy ponownym pakowaniu identycznych plików: ZIP nie jest
  deterministyczny bajt-w-bajt. Weryfikacja tożsamości treści poniżej opiera się na **hashach
  pojedynczych plików** — te 42 wartości `sha256` per-file zostały wszystkie potwierdzone zgodne
  z odzyskanymi z historii git plikami; to one, nie hash archiwum, są dowodem identyczności treści)

`shared` pozostaje jedynym SSOT. Wszystkie moduły promptowe pozostają rozwinięte. Jedynie przykładowe serwery MCP — kod techniczny, którego `SKILL.md` nie każe wczytywać jako prompt — są zapakowane wewnętrznie z pełną listą oryginalnych ścieżek i SHA-256 poniżej.

## Serwery MCP — przeniesione do `audyt-systemu-v4/mcp-servers/` (3.93, AUDYT-2026-09-27m)

Archiwum `tools/mcp-servers/mcp-servers-examples.zip` usunięte z shared: serwer musi leżeć
rozpakowany, żeby host mógł go uruchomić, a plugin `audyt-systemu-v4` ma na to miejsce
(183 pliki przy limicie 200). Stan i sumy: `audyt-systemu-v4/CHECKSUMS.sha256`.


## Runtime portability

- adapter semantyczny w istniejącym `SKILL.md`;
- provider-neutralny `extract_api_verification_log.py` z kompatybilnością Claude legacy;
- `export_gate.py`: alias `--verification-input`;
- bez masowego przepisywania instrukcji rozumianych przez host.

## Integralność odwołań — korekta

Wydanie po pełnym skanie ścieżek kanonicznych. Aktywne odwołania do nieistniejących/starych lokalizacji zostały skierowane do istniejących modułów; wpisy historyczne i jawne placeholdery pozostawiono bez zmian.
## V3 — semantic routing integrity

Aktywne historyczne aliasy modułów zastąpiono kanonicznymi istniejącymi modułami tej samej dziedziny prawa. Router nie jest źródłem prawa materialnego.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki `/mnt/skills/user/...` normalizowane są do kanonicznego `skill/path`;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.


## CBOSA / orzecznictwo — 3.60

Dodano kanoniczny `CBOSA-ADAPTER.md`. Warstwa `shared` nie zależy wykonawczo od
konkretnego skilla: adapter opisuje kontrakt, a `orzeczenia-sadowe-v2` jest jego
implementacją referencyjną. Routing RZĄD 2A prowadzi MCP-FIRST → direct CBOSA →
fallback V-SYG-0.5.

Reguła 7: wydanie 3.60 należy dystrybuować jako kompletny katalog `shared`,
nie jako zestaw zmienionych plików.

## CBOSA retrieval / provenance — 3.61

SSOT rozróżnia direct-live od snapshotu. `site:` nie jest bramką domenową;
V-SYG-0.5 wymusza pełny hostname + exact-match i zachowuje faktyczny zakres
treści snapshotu bez fałszywej promocji do ✅ [VER]. Liczba plików bez zmian.
