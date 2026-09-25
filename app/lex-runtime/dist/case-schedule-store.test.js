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
    it("keeps contacts and events apart in one encrypted file", async () => {
        const root = await mkdtemp(path.join(os.tmpdir(), "lex-contacts-"));
        roots.push(root);
        const store = new EncryptedCaseScheduleStore({ rootDir: root });
        const caseId = "case_" + "e".repeat(32);
        const key = randomBytes(32);
        const newKey = randomBytes(32);
        const base = { caseId, caseDataKey: key, keyVersion: 1 };
        const event = {
            eventId: "scheduleevent_" + "1".repeat(32),
            kind: "DEADLINE",
            title: "Apelacja",
            startsAt: "2026-10-10T12:00",
            createdAt: "2026-09-22T15:00:00.000Z",
            createdByUserId: "user_" + "c".repeat(32)
        };
        const contact = {
            contactId: "casecontact_" + "2".repeat(32),
            kind: "ORGANIZATION",
            name: "Sad Rejonowy",
            phone: "+48 22 000 00 00",
            email: "biuro@example.pl",
            createdAt: "2026-09-22T15:00:00.000Z",
            createdByUserId: "user_" + "c".repeat(32)
        };
        await store.save({ ...base, events: [event] });
        await store.saveContacts({ ...base, contacts: [contact] });
        expect(await store.list(base)).toEqual([event]);
        expect(await store.listContacts(base)).toEqual([contact]);
        await store.save({ ...base, events: [] });
        expect(await store.listContacts(base)).toEqual([contact]);
        await store.rekeyCaseSchedule({
            caseId,
            oldCaseDataKey: key,
            oldKeyVersion: 1,
            newCaseDataKey: newKey,
            newKeyVersion: 2
        });
        expect(await store.listContacts({ caseId, caseDataKey: newKey, keyVersion: 2 })).toEqual([contact]);
    });
});
