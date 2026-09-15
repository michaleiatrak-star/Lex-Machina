# Lex Machina App — Build Log

## Workstream

Branch: `feature/local-runtime`

### 2026-09-15 — Build 0001

Status: **IN PROGRESS**

Implemented:

- G0 baseline branch created from `main`.
- Initial Lex corpus baseline pinned in `app/lex-version.yaml`.
- Application/runtime scope documented in `app/README.md`.
- Initial TypeScript `LexSkillRegistry` implemented.
- YAML frontmatter parsing implemented.
- Dependency validation implemented for `dependencies.requires`.
- Required resource validation implemented for `required_modules`.
- Semantic resolution implemented for `shared/`, `references/`, `modules/`, `assets/` and explicit sibling-skill paths.
- Path traversal protection implemented.
- G1 CLI report implemented.
- Unit fixtures added for resolver success, missing dependency and traversal denial.

Validation state:

- **G0 baseline:** PASS structurally; branch and pinned commit exist.
- **G1 corpus integrity:** NOT YET EXECUTED against the full repository in CI/runtime.
- **G2 resolver:** implementation + unit fixtures present; NOT YET EXECUTED by repository CI.

Known constraint:

The current chat execution environment cannot clone GitHub over the shell network. Repository writes are therefore performed through the GitHub connector. Full executable validation must be run by GitHub Actions or another repository-capable CI environment; adding that workflow is the next task.

Next:

1. add GitHub Actions workflow for `app/lex-runtime`;
2. execute G1/G2 on the actual corpus;
3. fix all discovered resolver/dependency discrepancies rather than weakening the gate;
4. only then start G3 router state machine.
