# G39H AUTO coordinator design — 2026-09-18

Status: **DESIGN LOCKED / IMPLEMENTATION NEXT**

## Purpose

PROCESS_PLEADING_V1 AUTO mode must implement the canonical TRYB-AUTO contract without weakening deterministic invariants.

AUTO is allowed only when the user explicitly requests execution without per-checkpoint confirmations. It means:

- run eligible checkpoints sequentially;
- do not stop merely to request approval after every completed checkpoint;
- preserve the same checkpoint order, source/citation/privacy/audit gates and fail-closed behavior;
- stop immediately when required user data is missing or a deterministic/semantic gate blocks;
- emit one checkpoint report before any final process document may be produced.

AUTO must not mean “call the same model prompt repeatedly”.

## Runtime model

### 1. Deterministic outer coordinator

Introduce a ProcessAutoCoordinator around semantic execution.

Per HTTP request it may execute at most a bounded number of semantic nodes:

- default maximum: 4 semantic nodes;
- hard maximum: 8;
- deterministic N/A transitions do not consume the semantic-node budget;
- wall-clock/provider timeout remains independently enforced.

The coordinator loop is:

LOAD_STATE -> APPLY_OBJECTIVE_NA -> REQUIRE_PERMIT -> EXECUTE_ONE_NODE -> VALIDATE_NODE_RESULT -> APPLY_TRANSITION -> PERSIST -> repeat

The loop ends on:

- FINAL;
- USER_INPUT_REQUIRED;
- BLOCKED;
- semantic-node budget exhausted;
- provider/tool/source/citation/privacy/finalization failure;
- optimistic-concurrency conflict.

### 2. Typed semantic-node result

A semantic checkpoint executed inside AUTO must return a runtime-validated object with:

- schemaVersion = 1;
- checkpoint = the exact ProcessPleadingCheckpoint from the permit;
- revision = the exact workflow revision from the permit;
- outcome = COMPLETE, USER_INPUT_REQUIRED, or BLOCKED;
- bounded summary;
- bounded userQuestions;
- bounded evidenceRefs;
- bounded sourceRefs.

Bounds:

- summary: normalized, max 8,000 characters;
- userQuestions: max 12, each max 1,000 characters;
- evidenceRefs: max 128;
- sourceRefs: max 128;
- checkpoint/revision must exactly equal the runtime permit.

A model narrative alone never closes a checkpoint.

### 3. Transition rules

COMPLETE:

- only after the ordinary SessionExecutor source/resource/citation/finalization gates pass;
- call the existing optimistic-concurrency completeProcessExecution;
- persist the node result and new workflow state atomically under the case key;
- continue only if AUTO budget remains.

USER_INPUT_REQUIRED:

- do not close the checkpoint;
- persist the bounded node result;
- stop AUTO and return the questions to the user;
- next user request resumes the same checkpoint/revision lineage.

BLOCKED:

- do not close the checkpoint;
- persist the reason/audit reference;
- stop AUTO.

### 4. Encrypted checkpoint artifacts

Extend the encrypted case workspace with optional bounded per-checkpoint artifacts keyed by checkpoint name. Each record stores revision, outcome, summary, userQuestions, evidenceRefs, sourceRefs, and createdAt.

Requirements:

- encrypted at rest with the same case data key;
- included in case-key rotation;
- never persisted in plaintext logs;
- overwritten only by a strictly newer valid workflow revision;
- maximum total serialized size enforced.

### 5. Carry between semantic nodes

The next node receives:

- the original user goal;
- current deterministic stage/checkpoint;
- only prior validated checkpoint artifacts needed for the current stage;
- current evidence/context selection from Context Orchestrator;
- current mandatory legal resources.

It does not receive unrestricted raw output from previous model calls.

This prevents hidden prompt accumulation and keeps the 64k–200k model context budget measurable.

### 6. User-visible AUTO report

A single AUTO response contains:

- checkpoints completed in this request;
- checkpoints deterministically marked N/A with reasons;
- current checkpoint if stopped;
- user questions when input is required;
- source/evidence verification status;
- whether another AUTO continuation is required because the bounded node budget was reached.

A final process document remains forbidden until the persisted process state is FINAL.

## Security and determinism invariants

AUTO never disables:

- case ACL and case-key access;
- encrypted workflow persistence;
- optimistic-concurrency revision checks;
- objective checkpoint applicability rules;
- mandatory legal-resource reads;
- official-source hierarchy and citation verification;
- local-document citation re-fetch;
- privacy/pseudonymization rules;
- final-artifact suppression;
- release/update trust policies.

## Implementation slices

### AUTO-1 — semantic result schema

- parser/validator;
- unit tests for malformed checkpoint/revision, oversized fields, unsupported outcome;
- no coordinator loop yet.

### AUTO-2 — encrypted checkpoint artifacts

- workspace schema-compatible optional field;
- atomic save/read;
- rekey test;
- plaintext-at-rest negative test;
- size cap.

### AUTO-3 — one-node semantic executor adapter

- execute one permitted checkpoint;
- require structured result;
- preserve all existing SessionExecutor gates.

### AUTO-4 — bounded coordinator loop

- max node budget;
- objective N/A between semantic nodes;
- optimistic concurrency after every node;
- stop reasons.

### AUTO-5 — HTTP/UI

- one explicit AUTO request;
- progress/report;
- USER_INPUT_REQUIRED resume;
- budget-exhausted continuation.

### AUTO-6 — acceptance

Required scenarios:

1. CHECKPOINT mode behavior unchanged.
2. AUTO completes several semantic nodes in order without confirmation prompts.
3. AUTO stops on missing user input and does not close the active checkpoint.
4. AUTO cannot skip a semantic checkpoint.
5. stale revision aborts without a second provider call.
6. provider/tool failure leaves the last committed state intact.
7. final artifact remains blocked until FINAL.
8. encrypted artifacts are not visible on disk.
9. AUTO node budget is enforced.
10. deterministic N/A transitions do not consume the semantic-node budget.

## Gate

Do not mark G39H AUTO PASS until AUTO-1 through AUTO-6 are green in runtime CI and the current installer acceptance remains green.
