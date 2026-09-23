import { markProcessCheckpointNotApplicable, nextRequiredProcessCheckpoint, validateProcessPleadingState } from "./process-pleading-state.js";
export function evidenceInventoryFromUploads(uploads, source) {
    let fileCount = 0;
    for (const upload of uploads) {
        if (!upload.archive) {
            fileCount += 1;
            continue;
        }
        if (upload.archiveExtractionStatus ===
            "DEFERRED_G34H2") {
            return {
                fileCount: null,
                complete: false,
                source
            };
        }
        if (!Array.isArray(upload.extracted)) {
            return {
                fileCount: null,
                complete: false,
                source
            };
        }
        fileCount +=
            upload.extracted.length;
    }
    return {
        fileCount,
        complete: true,
        source
    };
}
function deterministicDecision(checkpoint, inventory) {
    if (!inventory.complete ||
        inventory.fileCount === null) {
        return {
            checkpoint,
            decision: "UNDETERMINED",
            reason: "Persisted evidence inventory is incomplete; checkpoint applicability remains fail-closed."
        };
    }
    const count = inventory.fileCount;
    switch (checkpoint) {
        case "CP-1c-skan":
            return count === 0
                ? {
                    checkpoint,
                    decision: "NOT_APPLICABLE",
                    reason: "DETERMINISTIC_NA: persisted case evidence inventory contains 0 files; CP-1c-skan applies only when files are present."
                }
                : {
                    checkpoint,
                    decision: "REQUIRES_EXECUTION",
                    reason: `Persisted case evidence inventory contains ${count} file(s); CP-1c-skan must execute.`
                };
        case "CP-PD":
            return count < 30
                ? {
                    checkpoint,
                    decision: "NOT_APPLICABLE",
                    reason: `DETERMINISTIC_NA: persisted case evidence inventory contains ${count} file(s); CP-PD threshold is >=30 files.`
                }
                : {
                    checkpoint,
                    decision: "REQUIRES_EXECUTION",
                    reason: `Persisted case evidence inventory contains ${count} file(s); CP-PD threshold is met.`
                };
        case "CP-1c-macierz":
            return count <= 1
                ? {
                    checkpoint,
                    decision: "NOT_APPLICABLE",
                    reason: `DETERMINISTIC_NA: persisted case evidence inventory contains ${count} evidence file(s); CP-1c-macierz requires >=2 evidence files.`
                }
                : {
                    checkpoint,
                    decision: "REQUIRES_EXECUTION",
                    reason: `Persisted case evidence inventory contains ${count} evidence file(s); CP-1c-macierz must execute.`
                };
        case "CP-1d":
            return count === 0
                ? {
                    checkpoint,
                    decision: "NOT_APPLICABLE",
                    reason: "DETERMINISTIC_NA: persisted case evidence inventory contains 0 documents; CP-1d applies when at least one document is present."
                }
                : {
                    checkpoint,
                    decision: "REQUIRES_EXECUTION",
                    reason: `Persisted case evidence inventory contains ${count} document(s); CP-1d must execute.`
                };
        default:
            return {
                checkpoint,
                decision: "UNDETERMINED",
                reason: "Checkpoint requires semantic or previously computed workflow facts and is not auto-resolved from file count."
            };
    }
}
export function applyDeterministicProcessApplicability(input, inventory, at = new Date().toISOString()) {
    let state = validateProcessPleadingState(input);
    const applied = [];
    if (inventory.fileCount !== null &&
        (!Number.isSafeInteger(inventory.fileCount) ||
            inventory.fileCount < 0)) {
        throw new Error("PROCESS_EVIDENCE_INVENTORY_INVALID");
    }
    while (true) {
        const checkpoint = nextRequiredProcessCheckpoint(state);
        if (!checkpoint) {
            return {
                state,
                applied,
                nextCheckpoint: null
            };
        }
        const decision = deterministicDecision(checkpoint, inventory);
        if (decision.decision !==
            "NOT_APPLICABLE") {
            return {
                state,
                applied,
                nextCheckpoint: checkpoint
            };
        }
        state =
            markProcessCheckpointNotApplicable(state, checkpoint, decision.reason, at);
        applied.push(decision);
    }
}
