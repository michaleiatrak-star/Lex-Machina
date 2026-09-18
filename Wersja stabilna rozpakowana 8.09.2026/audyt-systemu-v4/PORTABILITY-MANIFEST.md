# Portability manifest — audyt-systemu-v4

- Release: **6.98 (2026-09-14)**

- Full own skill tree preserved; no `shared` or other skill is vendored.
- `SKILL.md` is host-neutral; named operations are mapped by a semantic runtime adapter.
- Current package files: **101**.
- Current scripts: **38**; current references files: **51**.
- Frontmatter description: **167/200** characters.

## Existing portability fixes retained

- Repository root detection and `REPO_ROOT` / `LEX_MACHINA_ROOT` support in scripts.
- One skill = one complete package; hard limit 200 files.
- Regression suite propagates the detected root.
- Shared CI reports runtime-specific paths/tokens as portability findings rather than assuming one host.

## Integralność odwołań — korekta

Wydanie po pełnym skanie ścieżek kanonicznych. Aktywne odwołania do nieistniejących/starych lokalizacji zostały skierowane do istniejących modułów; wpisy historyczne i jawne placeholdery pozostawiono bez zmian.

## Universal V4

- zastosowano wspólny `shared/UNIVERSAL-RUNTIME-ADAPTER.md`;
- aktywne ścieżki są semantyczne; źródło, kopia robocza i wynik są rozwiązywane
  przez host zamiast kodowane jako ścieżka jednego środowiska;
- bezpośrednie endpointy dostawców AI w statycznych artefaktach są wyłączone;
- wydanie podlega skanowi prywatności/secrets oraz manifestowi integralności całego release.


## CBOSA / źródła orzecznicze — 6.97

- F-183a zawężona z globalnej luki do pomiaru środowiska docelowego.
- Historyczny pomiar CBOSA 503 z 2026-09-13 pozostaje dowodem dla tamtego runtime,
  ale nie jest już regułą globalną.
- Kanoniczny direct adapter mieszka w `shared/CBOSA-ADAPTER.md`; audyt sprawdza
  jego powiązanie z RZĄD 2A, V-SYG-0.7 i hard gate.
- Implementacja referencyjna adaptera ma 22/22 testów regresyjnych PASS.

## Rule 7

Wydanie 6.97 należy dystrybuować jako pełny katalog `audyt-systemu-v4`
(101 plików), nie jako sam diff plików audytowych.

## CBOSA snapshot / provenance — 6.98

- Zapisano rozdział `DIRECT_LIVE` vs `CRAWLED_OR_INDEXED`.
- Snapshot oficjalnego dokumentu może nieść metrykę, sentencję i uzasadnienie,
  ale sam nie zmienia statusu na ✅ [VER].
- `site:` nie jest filtrem domenowym; obowiązuje POST-CHECK HOSTA.
- F-183a pozostaje otwarta tylko dla pozytywnego direct-live w środowisku docelowym.
- Liczba plików skilla pozostaje **101**.
