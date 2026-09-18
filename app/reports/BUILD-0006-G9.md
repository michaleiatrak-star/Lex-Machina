# Build 0006 — G9 Audit Completeness

Date: 2026-09-15
Branch: `feature/local-runtime`
PR: #38

## Result

**PASS**

GitHub Actions run: `34998701143`

Validated SHA:

`c5bad4c17eb9f5c661fd8fdaf12ce8d73ae5bebc`

## Enforced audit properties

A finalizable legal session must contain a contiguous append-only trail including:

1. session start;
2. `prawny-router-v3` as the first skill-read event;
3. routing event;
4. provider start;
5. provider end;
6. successful or degraded G8 HARD GATE finalization;
7. session close.

Optional strict modes can additionally require verification and tool-decision events.

## Immutability

After session close the trail rejects further appends.

## Real-corpus validation

The G9 executable test performs a real-corpus G7 vertical slice, transfers the execution trace into the audit trail, runs G8 finalization and validates completeness.

## Next

G10 — integrate the existing Lex export/citation validation pipeline behind a controlled runtime adapter.
