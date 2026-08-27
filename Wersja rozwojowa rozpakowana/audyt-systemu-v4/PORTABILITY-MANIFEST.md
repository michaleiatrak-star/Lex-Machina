# Portability manifest — audyt-systemu-v4

- Full own skill tree preserved; no `shared` or other skill is vendored.
- `SKILL.md` is host-neutral; named operations are mapped by a semantic runtime adapter.
- Current package files: **71**.
- Current scripts: **23**; current references files: **36**.
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
