import { randomBytes } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { EncryptedCaseScheduleStore } from "./case-schedule-store.js";
const roots = [];
afterEach(async () => {
    await Promise.all(roots.splice(0)
        .map((root) => rm(root, {
        recursive: true,
        force: true
    })));
});
describe("EncryptedCaseScheduleStore", () => {
    it("stores, reads and rekeys a matter schedule", async () => {
        const root = await mkdtemp(path.join(os.tmpdir(), "lex-schedule-"));
        roots.push(root);
        const store = new EncryptedCaseScheduleStore({
            rootDir: root
        });
        const caseId = "case_" +
            "a".repeat(32);
        const oldKey = randomBytes(32);
        const newKey = randomBytes(32);
        const event = {
            eventId: "scheduleevent_" +
                "b".repeat(32),
            kind: "COURT_HEARING",
            title: "Posiedzenie",
            startsAt: "2026-10-05T09:30",
            location: "Sala 12",
            notes: "Zabrać akta.",
            createdAt: "2026-09-22T15:00:00.000Z",
            createdByUserId: "user_" +
                "c".repeat(32)
        };
        await store.save({
            caseId,
            caseDataKey: oldKey,
            keyVersion: 1,
            events: [event]
        });
        expect(await store.list({
            caseId,
            caseDataKey: oldKey,
            keyVersion: 1
        })).toEqual([
            event
        ]);
        expect(await store
            .rekeyCaseSchedule({
            caseId,
            oldCaseDataKey: oldKey,
            oldKeyVersion: 1,
            newCaseDataKey: newKey,
            newKeyVersion: 2
        })).toBe(true);
        expect(await store.list({
            caseId,
            caseDataKey: newKey,
            keyVersion: 2
        })).toEqual([
            event
        ]);
    });
    it("returns an empty schedule before the first event is stored", async () => {
        const root = await mkdtemp(path.join(os.tmpdir(), "lex-schedule-empty-"));
        roots.push(root);
        const store = new EncryptedCaseScheduleStore({
            rootDir: root
        });
        expect(await store.list({
            caseId: "case_" +
                "d".repeat(32),
            caseDataKey: randomBytes(32),
            keyVersion: 1
        })).toEqual([]);
    });
});
