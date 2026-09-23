import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { randomBytes } from "node:crypto";
import { EncryptedCaseWorkspaceStore } from "./case-workspace-store.js";
import { acceptProcessPleadingStart, createProcessPleadingState, markProcessCheckpointReady } from "./process-pleading-state.js";
import { completeChronologyCheckpoint, createChronologyState, requireChronologyTemporalGate } from "./chronology-state.js";
import { completeContractCheckpoint, createContractAnalysisState } from "./contract-analysis-state.js";
import { completeOrderedCaseExecution, createOrderedCaseWorkflowState, requireOrderedCaseExecutionPermit } from "./ordered-case-workflow-state.js";
const roots = [];
function fixture() {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "lex-workspace-"));
    roots.push(rootDir);
    return {
        rootDir,
        caseId: "case_" + "a".repeat(32),
        key: randomBytes(32),
        store: new EncryptedCaseWorkspaceStore({ rootDir })
    };
}
afterEach(() => {
    for (const root of roots.splice(0)) {
        fs.rmSync(root, { recursive: true, force: true });
    }
});
describe("encrypted case workspace", () => {
    it("keeps folder names and thread content encrypted at rest", async () => {
        const { rootDir, caseId, key, store } = fixture();
        const folder = await store.createFolder({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            name: "Dowody"
        });
        await store.appendThreadMessage({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            message: {
                messageId: "message_" + "b".repeat(32),
                role: "user",
                content: "Poufny stan faktyczny",
                createdAt: new Date().toISOString()
            }
        });
        const onDisk = fs.readFileSync(path.join(rootDir, "cases", caseId, "secure", "workspace", "index.lmw1"), "utf8");
        expect(onDisk).not.toContain("Dowody");
        expect(onDisk).not.toContain("Poufny stan faktyczny");
        const workspace = await store.listWorkspace({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            itemIds: []
        });
        expect(workspace.folders[0]?.folderId).toBe(folder.folderId);
        expect((await store.loadThread({ caseId, caseDataKey: key, keyVersion: 1 }))[0]?.content)
            .toBe("Poufny stan faktyczny");
    });
    it("supports several folders and item moves but rejects deleting a non-empty folder", async () => {
        const { caseId, key, store } = fixture();
        const folder = await store.createFolder({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            name: "Pisma"
        });
        const uploadId = "upload_" + "c".repeat(32);
        await store.listWorkspace({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            itemIds: [uploadId]
        });
        await store.moveItem({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            itemId: uploadId,
            folderId: folder.folderId,
            knownItemIds: [uploadId]
        });
        await expect(store.deleteFolder({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            folderId: folder.folderId
        })).rejects.toThrow("WORKSPACE_FOLDER_NOT_EMPTY");
        await store.moveItem({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            itemId: uploadId,
            folderId: null,
            knownItemIds: [uploadId]
        });
        await expect(store.deleteFolder({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            folderId: folder.folderId
        })).resolves.toBeUndefined();
    });
    it("keeps process pleading workflow state encrypted and preserves it across key rotation", async () => {
        const { rootDir, caseId, key, store } = fixture();
        let state = createProcessPleadingState(caseId, "CHECKPOINT", "2026-09-18T00:00:00.000Z");
        state = acceptProcessPleadingStart(state, "2026-09-18T00:00:01.000Z");
        state = markProcessCheckpointReady(state, "CP-1a", "2026-09-18T00:00:02.000Z");
        await store.saveProcessPleadingState({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            state
        });
        const loaded = await store.getProcessPleadingState({
            caseId,
            caseDataKey: key,
            keyVersion: 1
        });
        expect(loaded?.stage).toBe("W1");
        expect(loaded?.pendingCheckpoint)
            .toBe("CP-1a");
        expect(loaded?.documentStatus)
            .toBe("DRAFT");
        const onDisk = fs.readFileSync(path.join(rootDir, "cases", caseId, "secure", "workspace", "index.lmw1"), "utf8");
        expect(onDisk)
            .not.toContain("PROCESS_PLEADING_V1");
        expect(onDisk)
            .not.toContain("CP-1a");
        expect(onDisk)
            .not.toContain("PENDING_CONFIRMATION");
        const next = randomBytes(32);
        expect(await store.rekeyCaseWorkspace({
            caseId,
            oldCaseDataKey: key,
            oldKeyVersion: 1,
            newCaseDataKey: next,
            newKeyVersion: 2
        })).toBe(true);
        const afterRekey = await store.getProcessPleadingState({
            caseId,
            caseDataKey: next,
            keyVersion: 2
        });
        expect(afterRekey?.pendingCheckpoint)
            .toBe("CP-1a");
        expect(afterRekey?.history.length)
            .toBeGreaterThanOrEqual(3);
    });
    it("keeps chronology workflow state encrypted and preserves the temporal-gate decision across key rotation", async () => {
        const { rootDir, caseId, key, store } = fixture();
        let state = createChronologyState(caseId, "2026-09-18T08:00:00.000Z");
        state =
            requireChronologyTemporalGate(state, true, "2026-09-18T08:00:01.000Z");
        state =
            completeChronologyCheckpoint(state, "DOCUMENT_INVENTORY_COMPLETE", [
                "audit://chronology/inventory"
            ], "2026-09-18T08:00:02.000Z");
        await store.saveChronologyState({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            state
        });
        const loaded = await store.getChronologyState({
            caseId,
            caseDataKey: key,
            keyVersion: 1
        });
        expect(loaded?.stage)
            .toBe("THREADS");
        expect(loaded?.temporalGateRequired).toBe(true);
        expect(loaded?.closedCheckpoints).toEqual([
            "DOCUMENT_INVENTORY_COMPLETE"
        ]);
        const onDisk = fs.readFileSync(path.join(rootDir, "cases", caseId, "secure", "workspace", "index.lmw1"), "utf8");
        expect(onDisk)
            .not.toContain("CHRONOLOGY_V1");
        expect(onDisk)
            .not.toContain("DOCUMENT_INVENTORY_COMPLETE");
        expect(onDisk)
            .not.toContain("temporalGateRequired");
        const next = randomBytes(32);
        expect(await store.rekeyCaseWorkspace({
            caseId,
            oldCaseDataKey: key,
            oldKeyVersion: 1,
            newCaseDataKey: next,
            newKeyVersion: 2
        })).toBe(true);
        const afterRekey = await store.getChronologyState({
            caseId,
            caseDataKey: next,
            keyVersion: 2
        });
        expect(afterRekey?.stage)
            .toBe("THREADS");
        expect(afterRekey?.temporalGateRequired).toBe(true);
    });
    it("keeps contract-analysis AU state encrypted and preserves it across key rotation", async () => {
        const { rootDir, caseId, key, store } = fixture();
        let state = createContractAnalysisState(caseId, "DRAFT", "2026-09-18T09:40:00.000Z");
        state =
            completeContractCheckpoint(state, "AU-F0", [
                "audit://contract/AU-F0"
            ], "2026-09-18T09:40:01.000Z");
        await store.saveContractAnalysisState({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            state
        });
        const loaded = await store
            .getContractAnalysisState({
            caseId,
            caseDataKey: key,
            keyVersion: 1
        });
        expect(loaded?.mode)
            .toBe("DRAFT");
        expect(loaded?.stage)
            .toBe("INTAKE");
        expect(loaded?.closedCheckpoints).toEqual(["AU-F0"]);
        const onDisk = fs.readFileSync(path.join(rootDir, "cases", caseId, "secure", "workspace", "index.lmw1"), "utf8");
        expect(onDisk)
            .not.toContain("CONTRACT_ANALYSIS_V1");
        expect(onDisk)
            .not.toContain("AU-F0");
        expect(onDisk)
            .not.toContain("DRAFT");
        const next = randomBytes(32);
        expect(await store
            .rekeyCaseWorkspace({
            caseId,
            oldCaseDataKey: key,
            oldKeyVersion: 1,
            newCaseDataKey: next,
            newKeyVersion: 2
        })).toBe(true);
        const afterRekey = await store
            .getContractAnalysisState({
            caseId,
            caseDataKey: next,
            keyVersion: 2
        });
        expect(afterRekey?.mode)
            .toBe("DRAFT");
        expect(afterRekey
            ?.closedCheckpoints).toEqual(["AU-F0"]);
        expect(afterRekey?.revision).toBe(2);
    });
    it("persists ordered evidence workflow state encrypted with optimistic revision", async () => {
        const { rootDir, caseId, key, store } = fixture();
        let state = createOrderedCaseWorkflowState("EVIDENCE_ANALYSIS_V1", caseId, "2026-09-18T12:00:00.000Z");
        const permit = requireOrderedCaseExecutionPermit(state);
        state =
            completeOrderedCaseExecution(state, permit, [
                "artifact://artifact_1234567890abcdef"
            ], "2026-09-18T12:00:01.000Z");
        await store.saveOrderedCaseWorkflowState({
            caseId,
            workflowId: "EVIDENCE_ANALYSIS_V1",
            caseDataKey: key,
            keyVersion: 1,
            state
        });
        const loaded = await store.getOrderedCaseWorkflowState({
            caseId,
            workflowId: "EVIDENCE_ANALYSIS_V1",
            caseDataKey: key,
            keyVersion: 1
        });
        expect(loaded?.closedCheckpoints).toEqual([
            "AD-KROK0-BLOKADA"
        ]);
        await expect(store.saveOrderedCaseWorkflowState({
            caseId,
            workflowId: "EVIDENCE_ANALYSIS_V1",
            caseDataKey: key,
            keyVersion: 1,
            state,
            expectedRevision: 1
        })).rejects.toThrow("ORDERED_WORKFLOW_STATE_CONFLICT");
        const onDisk = fs.readFileSync(path.join(rootDir, "cases", caseId, "secure", "workspace", "index.lmw1"), "utf8");
        expect(onDisk)
            .not.toContain("AD-KROK0-BLOKADA");
        expect(onDisk)
            .not.toContain("EVIDENCE_ANALYSIS_V1");
    });
    it("re-encrypts the workspace when the case key rotates", async () => {
        const { caseId, key, store } = fixture();
        await store.appendThreadMessage({
            caseId,
            caseDataKey: key,
            keyVersion: 1,
            message: {
                messageId: "message_" + "d".repeat(32),
                role: "assistant",
                content: "Treść odpowiedzi",
                createdAt: new Date().toISOString()
            }
        });
        const next = randomBytes(32);
        expect(await store.rekeyCaseWorkspace({
            caseId,
            oldCaseDataKey: key,
            oldKeyVersion: 1,
            newCaseDataKey: next,
            newKeyVersion: 2
        })).toBe(true);
        await expect(store.loadThread({
            caseId,
            caseDataKey: key,
            keyVersion: 1
        })).rejects.toThrow();
        expect((await store.loadThread({
            caseId,
            caseDataKey: next,
            keyVersion: 2
        }))[0]?.content).toBe("Treść odpowiedzi");
    });
});
