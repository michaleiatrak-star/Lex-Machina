# Portability manifest — shared

- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`
- Original files: **205**
- Expanded files after lossless MCP-example compaction, before manifest/checksums: **164**
- Frontmatter description: **163/200**
- Nested MCP archive SHA-256: `6b16d446e08ec5a3c401b371a7bf697e2b898bf2b903e2a1531a2ec818642756`

`shared` pozostaje jedynym SSOT. Wszystkie moduły promptowe pozostają rozwinięte. Jedynie przykładowe serwery MCP — kod techniczny, którego `SKILL.md` nie każe wczytywać jako prompt — są zapakowane wewnętrznie z pełną listą oryginalnych ścieżek i SHA-256 poniżej.

## Pliki zachowane w `tools/mcp-servers/mcp-servers-examples.zip`

- `mcp-servers/ceidg-example/README.md` `4454f3a3713f6ca6a257f4cecd03b02d0c5d5fc8393738a888e8043809813d12`
- `mcp-servers/ceidg-example/ceidg-mcp-server.js` `5e4a79c68a99114e6f58c66e715e805ca11803a7690234016f0a28c01a36aacb`
- `mcp-servers/ceidg-example/package-lock.json` `9ffa195b72508f1efcd207cc6b6e1d8e49ef8015676022b7bc8664731bf3b2be`
- `mcp-servers/ceidg-example/package.json` `8e1e871c9e0af39a42875dcb05c90a96aaf334cc3fddbee26c1c0659ff9d3e4a`
- `mcp-servers/ceidg-example/test_normalizacja.mjs` `da6b38f74f2fab387e85418ff4320ddff88f1b3c57df8446f46ac72867c9fb66`
- `mcp-servers/ceidg-example/test_protokol_mcp.mjs` `8476d41c80d72012fe3e13fa4854ecc7a195cad6f02e8821e1754cec4b8ccf2c`
- `mcp-servers/eurlex-example/README.md` `79d2ca44b9c58bef9f542dd4af585edf714319e24efe57700d5107794db72679`
- `mcp-servers/eurlex-example/eurlex-mcp-server.js` `0aa49497a8c28b619b249b70e91fd6688958cc74d3b5f06bb1f7915d8f122f32`
- `mcp-servers/eurlex-example/package-lock.json` `4f79dcef019992701a8853f8b7bd7dbdaf5698183479fe606e87af98cbeea215`
- `mcp-servers/eurlex-example/package.json` `ea26415318c8c51bc4a590bac3a505e4addbd030dece984513a05504b4918108`
- `mcp-servers/eurlex-example/test_normalizacja.mjs` `05c04f990ccecbaf87e44685753756a01fdeeffece782e88baf92c60e9c3000b`
- `mcp-servers/eurlex-example/test_protokol_mcp.mjs` `8935d6027a435d35c00576a1487863530e527bb356c75c4a42bad1a00690c38b`
- `mcp-servers/isap-eli-example/README.md` `313d23939739be83b41ef22343778b918afa049bc473434b4369ea0451621f53`
- `mcp-servers/isap-eli-example/isap-eli-mcp-server.js` `295a8730c4d6735dcb3d430352a9e67603a7225e2ec6654ada697e6e11d96341`
- `mcp-servers/isap-eli-example/package-lock.json` `5cf17949ca45f97bc47d709646038f2bc7d45eec1bf28d40871e4d887397bd4e`
- `mcp-servers/isap-eli-example/package.json` `a20b5030b7b4a4fe658b7ca19327758117d37e499bbf03af3c397bece884e868`
- `mcp-servers/isap-eli-example/test_normalizacja.mjs` `298d9f7c00564a7eef29a5ebf1c62f963236358f23f670297884ae5cbafdfb43`
- `mcp-servers/isap-eli-example/test_protokol_mcp.mjs` `593961972857dfefc2b075cf9fa878b570741ae876d2a6f2b279040efd2530b2`
- `mcp-servers/krs-example/README.md` `af09cdca20c903c2e5274b10876ed4ce5cbdefac93b86fd103f877358e6d9f0d`
- `mcp-servers/krs-example/krs-mcp-server.js` `04c1eda43db23ac24cc6327c51f84cfc6e1e6cb83e336fd8372aae4a2e9da1e1`
- `mcp-servers/krs-example/package-lock.json` `646b01fa1faaddcfc0346cd57c857dc7aeee6ef96c19931081712472b610214a`
- `mcp-servers/krs-example/package.json` `0a8faf5e9e4fdeac5e36c25de8b5d88fc2ab78a73918a5ebe68558453d43262a`
- `mcp-servers/krs-example/test_normalizacja.mjs` `dc8c0f0eafce3c39ad0b8b5982626c10fdf419581e439c1f0f75100dd5362c30`
- `mcp-servers/krs-example/test_protokol_mcp.mjs` `2b1bf8831f0d119cf7078f9f5fbf726b124afa7f960e1d208173f74e28fb3088`
- `mcp-servers/nbp-example/README.md` `9bb685d2589c55155df7f2be592cdb383d8f48d5f05c748942b86ad9926cdccc`
- `mcp-servers/nbp-example/nbp-mcp-server.js` `95dbb8b68c961e199a86bae725d5d4682d4056ac68842e59daf23a16c0ade7f2`
- `mcp-servers/nbp-example/package-lock.json` `2238b4c83737b00f58f07f42cd8f6b97e515e25d3d88bf1c525ef650aa8a23d5`
- `mcp-servers/nbp-example/package.json` `bb02f14f8b742b5557fe195096aaa3359da874358dd72932ec1c781439a85364`
- `mcp-servers/nbp-example/test_normalizacja.mjs` `5855fb82a9e98a26c7b067c444634bb121e9189a1e7a82195c3bda4d9b9c9c0c`
- `mcp-servers/nbp-example/test_protokol_mcp.mjs` `00d2d93fb0fee1927dbfb1e061dec53bae5daf09effba66ee446a207f1668e51`
- `mcp-servers/saos-example/README.md` `b44c8e4fa4a7b51326dc94b74738ce52f9d9d83fe2ec68778dfb717dfb22eaf0`
- `mcp-servers/saos-example/package-lock.json` `a18ade2108ec7eacf98581c4229b2a66eba5433f3111434704b973a0ff212c8d`
- `mcp-servers/saos-example/package.json` `6d9a09ab1203dbe4e4746622096d36fc186a3d4c6780b0d2130f19dbbfb619b3`
- `mcp-servers/saos-example/saos-mcp-server.js` `3c16e6d540bca22573d9f0b4da98110be7c6390e7da5458595eafc8b5d5bf39c`
- `mcp-servers/saos-example/test_normalizacja.mjs` `f120dd8515fc9867a7e61ae43c856e37e89b72eeb7eaf6c279b0d8fdcc8b7924`
- `mcp-servers/saos-example/test_protokol_mcp.mjs` `2e84997a4957208226bcb0db7ef2b8f0d9be5e1011520f49f4f7b1527848fb30`
- `mcp-servers/sudop-example/README.md` `e69b301eda51d562b84507a736d1ededd6241229661abaf9149f9831f7f84b6c`
- `mcp-servers/sudop-example/package-lock.json` `b2b4352a8020f06cc5b7769e60329408574317264d48c0142029844f4c60a6f9`
- `mcp-servers/sudop-example/package.json` `02f5389a5dd2d5530675040d76d2e700e94bc52cd927111849ccbe656ca4bd07`
- `mcp-servers/sudop-example/sudop-mcp-server.js` `82698e2311e75af7bf0fcb998e56b44a7810bbbb3d5e26abdb1faaea9f904017`
- `mcp-servers/sudop-example/test_normalizacja.mjs` `8ca272c50708daca6f2e8a6038e2c58b52c39c1f4dee9d70087122e6fc7b17bb`
- `mcp-servers/sudop-example/test_protokol_mcp.mjs` `7b1a63b74ac4ed6f32a53a0f5e307106045ebe32c5831060a4a63b211f4d1291`

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
