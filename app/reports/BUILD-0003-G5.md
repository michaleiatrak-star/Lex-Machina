# Build 0003 — G5 Provider Conformance

Date: 2026-09-15
Branch: `feature/local-runtime`
PR: #38

## Result

**PASS — non-live provider conformance**

GitHub Actions run: `34997893806`

Validated SHA:

`ac26cbef057ccdea783c1f262a14048bc61aabe7`

## Contract

The runtime now uses one normalized provider boundary for:

- OpenAI;
- Anthropic;
- xAI.

The contract normalizes:

- user/assistant messages;
- streamed content callbacks;
- reasoning callbacks;
- tool schemas;
- tool calls;
- tool results;
- provider capabilities;
- provider error handling;
- model-discovery capability.

## AI SDK bridge

The runtime can instantiate provider models through:

- `@ai-sdk/openai`;
- `@ai-sdk/anthropic`;
- `@ai-sdk/xai`.

The CI smoke test intentionally creates provider model objects with dummy keys and performs **no external API request**.

## G5 conformance cases

Each deterministic provider adapter is required to pass:

1. streamed content aggregation;
2. reasoning callback behavior;
3. normalized tool-call shape;
4. tool-result roundtrip;
5. model discovery contract;
6. fail-closed behavior when tool support is absent.

## Important limitation

This gate does **not** claim that live OpenAI, Anthropic or xAI APIs were called successfully. Live credentialled provider validation remains pending and will be represented by a separate gate.

## Next

G7 deterministic vertical slice:
`prawny-router-v3 → prawo-polskie-v2 → DR-02 → provider → audit trace`.
