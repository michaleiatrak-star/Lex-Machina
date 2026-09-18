# Build 0017 — G19 Historical Legal-State Exception

Date: 2026-09-15  
Branch: `feature/local-runtime`  
PR: #38

## Result

**PASS**

Validated by the full G1-G20 pipeline:

- GitHub Actions run: `35014644845`
- validated SHA: `360aeb3854810022222a85ea624182becdd0eb86`
- F-138 structural audit: `35014644693` — PASS

## Rule

Current-law verification remains fail-closed when the selected consolidated text is repealed, expired, stale or otherwise non-current.

The only exception is an explicit historical request with:

`asOf = YYYY-MM-DD`

The exception is valid only when official ELI metadata proves that:

1. the base act was in force on `asOf`;
2. the selected official text was applicable at `asOf`;
3. no later amendment relevant before `asOf` invalidates that selected text;
4. `asOf` is a genuine past date.

## Historical provenance

Verification records now carry:

- `temporalMode = HISTORICAL`;
- `asOf`;
- source URL/tier;
- verification method;
- source format.

The provider-visible marker explicitly says:

`STAN NA YYYY-MM-DD`

so a historical citation cannot be confused with a statement about current law.

## Red conditions retained

The runtime remains BLOCKED for:

- repealed t.j. in a current-law query;
- requested date before entry into force;
- requested date on/after repeal or expiration;
- current/future `asOf`;
- amendment after selected historical t.j. and before `asOf`;
- missing official historical text;
- unsupported source format without a compatible verifier.

## Export/audit propagation

Temporal provenance is retained in:

- VerificationLedger;
- G9 audit events;
- G10 neutral verification log.

This closes the historical-state exception without weakening the current-law gate.
