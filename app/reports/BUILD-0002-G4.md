# Build 0002 — G4 Tool Safety

Date: 2026-09-15
Branch: `feature/local-runtime`
PR: #38

## Result

**PASS**

GitHub Actions run: `34996493615`

Validated SHA:

`173bef4f1b4c2d2069f90a51d73a39fa35a13d8a`

## Enforced security properties

- Unknown tool names are denied.
- File reads are limited to configured roots.
- File writes require explicit enablement and configured writable roots.
- Network calls require explicit network enablement.
- Only HTTP/HTTPS URL schemes are accepted by the network policy.
- Localhost and literal private/link-local network addresses are denied.
- Credentials embedded in URLs are denied.
- Code execution is disabled by default.
- MCP execution is disabled by default.
- Every policy decision emits an audit event.

## Negative validation cases

The executable G4 suite requires denial of:

1. unknown tool;
2. file path outside allowed root;
3. `file://` fetch;
4. localhost fetch;
5. link-local metadata-service fetch;
6. write when write capability is disabled;
7. code execution when code capability is disabled.

## Positive validation retained

The full runtime CI also reruns:

- G1 corpus integrity;
- G3 router-first bootstrap;
- unit tests for resolver and session behavior.

All passed in the validated run.

## Next

G5 Provider Conformance and Mike integration.
