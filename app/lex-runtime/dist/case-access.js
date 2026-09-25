import { randomBytes } from "node:crypto";
import { randomCaseDataKey, unwrapCaseKeyForOfflineUser, unwrapCaseKeyForSessionUser, unwrapUserSharingPrivateKey, wrapCaseKeyForOfflineUser, wrapCaseKeyForSessionUser } from "./case-crypto.js";
export class CaseAccessError extends Error {
    code;
    httpStatus;
    constructor(code, httpStatus) {
        super(code);
        this.code = code;
        this.httpStatus = httpStatus;
        this.name = "CaseAccessError";
    }
}
const ROLE_CAPABILITIES = {
    OWNER: new Set([
        "READ",
        "WRITE",
        "ANALYZE",
        "MANAGE"
    ]),
    EDITOR: new Set([
        "READ",
        "WRITE",
        "ANALYZE"
    ]),
    ANALYST: new Set([
        "READ",
        "ANALYZE"
    ]),
    VIEWER: new Set([
        "READ"
    ])
};
function validCaseId(value) {
    return /^case_[a-f0-9]{32}$/
        .test(value);
}
function validUserId(value) {
    return /^user_[a-f0-9]{32}$/
        .test(value);
}
function cleanDisplayName(value) {
    const cleaned = value
        ?.normalize("NFKC")
        .trim()
        .slice(0, 160);
    return cleaned || undefined;
}
function cleanScheduleText(value, maxLength) {
    if (typeof value !== "string") {
        return undefined;
    }
    const cleaned = value
        .normalize("NFKC")
        .trim()
        .slice(0, maxLength);
    return cleaned || undefined;
}
function cleanScheduleStart(value) {
    if (typeof value !== "string") {
        return null;
    }
    const cleaned = value.trim();
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
        .test(cleaned) ||
        Number.isNaN(Date.parse(cleaned))) {
        return null;
    }
    return cleaned;
}
/** Local wall-clock "YYYY-MM-DDTHH:MM", the format events are stored in. */
function localMinute(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export class LocalCaseAccessService {
    store;
    auth;
    files;
    keyRotationParticipant;
    schedule;
    caseOperationTails = new Map();
    constructor(store, auth, files, keyRotationParticipant, schedule) {
        this.store = store;
        this.auth = auth;
        this.files = files;
        this.keyRotationParticipant = keyRotationParticipant;
        this.schedule = schedule;
    }
    async createCase(context, displayName, caseKind = "MATTER") {
        const caseId = "case_" +
            randomBytes(16)
                .toString("hex");
        if (![
            "MATTER",
            "FIRM_KNOWLEDGE"
        ].includes(caseKind)) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        if (caseKind ===
            "FIRM_KNOWLEDGE") {
            this.assertAdmin(context);
            const existing = this.store
                .getCaseByKind("FIRM_KNOWLEDGE");
            if (existing) {
                throw new CaseAccessError("FIRM_KNOWLEDGE_ALREADY_EXISTS", 409);
            }
        }
        const keyVersion = 1;
        const caseDataKey = randomCaseDataKey();
        const now = new Date().toISOString();
        try {
            const ownerEnvelope = await this.auth
                .withSessionUserMasterKey(context.session
                .sessionId, (userMasterKey) => wrapCaseKeyForSessionUser(userMasterKey, {
                userId: context.user
                    .userId,
                caseId,
                caseDataKey,
                keyVersion
            }));
            let metadata;
            try {
                const cleanedName = cleanDisplayName(displayName);
                metadata =
                    await this.files
                        .createCase({
                        caseId,
                        ...(cleanedName
                            ? {
                                displayName: cleanedName
                            }
                            : {}),
                        createdByUserId: context.user.userId,
                        keyVersion,
                        caseKind
                    });
            }
            catch (error) {
                throw error;
            }
            const record = {
                caseId,
                createdByUserId: context.user.userId,
                createdAt: metadata.createdAt,
                updatedAt: metadata.createdAt,
                keyVersion,
                caseKind,
                ...(metadata.displayName
                    ? {
                        displayName: metadata.displayName
                    }
                    : {})
            };
            const ownerAccess = {
                caseId,
                userId: context.user.userId,
                role: "OWNER",
                canReidentify: true,
                envelope: ownerEnvelope,
                grantedByUserId: context.user.userId,
                grantedAt: metadata.createdAt
            };
            try {
                this.store
                    .createCaseWithOwner({
                    caseRecord: record,
                    ownerAccess
                });
            }
            catch (error) {
                await this.files
                    .removeCase(caseId);
                throw error;
            }
            this.audit(context.user.userId, "case_created", now, {
                caseId,
                keyVersion,
                caseKind
            });
            return {
                ...record,
                role: "OWNER",
                canReidentify: true
            };
        }
        finally {
            caseDataKey.fill(0);
        }
    }
    getFirmKnowledgeWorkspace(context) {
        const record = this.store.getCaseByKind("FIRM_KNOWLEDGE");
        if (!record) {
            return null;
        }
        const access = this.store
            .getCaseAccess(record.caseId, context.user.userId);
        if (!access) {
            return null;
        }
        return {
            ...record,
            role: access.role,
            canReidentify: access.canReidentify
        };
    }
    async createFirmKnowledgeWorkspace(context) {
        return await this.createCase(context, "Wiedza kancelarii", "FIRM_KNOWLEDGE");
    }
    listCases(context) {
        return this.store
            .listCasesForUser(context.user.userId);
    }
    openCase(context, caseId) {
        const access = this.assertAccess(context, caseId, "READ");
        const record = this.store.getCase(caseId);
        if (!record) {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        return {
            ...record,
            role: access.role,
            canReidentify: access.canReidentify
        };
    }
    async listCaseSchedule(context, caseId) {
        if (!this.schedule) {
            throw new Error("CASE_SCHEDULE_UNAVAILABLE");
        }
        return await this.withCaseDataKey(context, caseId, "READ", async (caseDataKey) => {
            const record = this.store.getCase(caseId);
            if (!record) {
                throw new CaseAccessError("CASE_NOT_FOUND", 404);
            }
            return await this.schedule
                .list({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion
            });
        });
    }
    async addCaseScheduleEvent(context, caseId, input) {
        if (!this.schedule) {
            throw new Error("CASE_SCHEDULE_UNAVAILABLE");
        }
        const kind = typeof input.kind ===
            "string" &&
            [
                "CLIENT_MEETING",
                "COURT_HEARING",
                "DEADLINE",
                "OTHER"
            ].includes(input.kind)
            ? input.kind
            : null;
        const title = cleanScheduleText(input.title, 180);
        const startsAt = cleanScheduleStart(input.startsAt);
        const location = cleanScheduleText(input.location, 180);
        const notes = cleanScheduleText(input.notes, 2000);
        if (!kind ||
            !title ||
            !startsAt) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        return await this.withCaseDataKey(context, caseId, "WRITE", async (caseDataKey) => {
            const record = this.store.getCase(caseId);
            if (!record) {
                throw new CaseAccessError("CASE_NOT_FOUND", 404);
            }
            const events = await this.schedule
                .list({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion
            });
            const createdAt = new Date()
                .toISOString();
            const event = {
                eventId: "scheduleevent_" +
                    randomBytes(16)
                        .toString("hex"),
                kind,
                title,
                startsAt,
                ...(location
                    ? { location }
                    : {}),
                ...(notes
                    ? { notes }
                    : {}),
                createdAt,
                createdByUserId: context.user.userId
            };
            await this.schedule
                .save({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion,
                events: [...events, event]
                    .sort((left, right) => left.startsAt
                    .localeCompare(right.startsAt) ||
                    left.createdAt
                        .localeCompare(right.createdAt))
            });
            this.audit(context.user.userId, "case_schedule_event_added", createdAt, {
                caseId,
                eventId: event.eventId,
                kind: event.kind,
                startsAt: event.startsAt
            });
            return event;
        });
    }
    async deleteCaseScheduleEvent(context, caseId, eventId) {
        if (!this.schedule) {
            throw new Error("CASE_SCHEDULE_UNAVAILABLE");
        }
        if (!/^scheduleevent_[a-f0-9]{32}$/
            .test(eventId)) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        return await this.withCaseDataKey(context, caseId, "WRITE", async (caseDataKey) => {
            const record = this.store.getCase(caseId);
            if (!record) {
                throw new CaseAccessError("CASE_NOT_FOUND", 404);
            }
            const events = await this.schedule
                .list({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion
            });
            const next = events.filter((event) => event.eventId !==
                eventId);
            if (next.length ===
                events.length) {
                throw new CaseAccessError("CASE_SCHEDULE_EVENT_NOT_FOUND", 404);
            }
            await this.schedule
                .save({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion,
                events: next
            });
            const deletedAt = new Date()
                .toISOString();
            this.audit(context.user.userId, "case_schedule_event_deleted", deletedAt, {
                caseId,
                eventId
            });
            return {
                eventId,
                deletedAt
            };
        });
    }
    /**
     * Events of every active case the user can read, from the start of today,
     * soonest first. A case whose key is unavailable is skipped, not fatal.
     */
    async listUpcomingEvents(context, options = {}) {
        if (!this.schedule) {
            throw new Error("CASE_SCHEDULE_UNAVAILABLE");
        }
        const from = cleanScheduleStart(options.from) ??
            localMinute(new Date()).slice(0, 10) + "T00:00";
        const until = cleanScheduleStart(options.until);
        const limit = Math.min(Math.max(Math.trunc(options.limit ?? 50), 1), 500);
        const cases = this.listCases(context).filter((item) => !item.archivedAt && item.caseKind !== "FIRM_KNOWLEDGE");
        const upcoming = [];
        for (const item of cases) {
            let events;
            try {
                events = await this.listCaseSchedule(context, item.caseId);
            }
            catch {
                continue;
            }
            for (const event of events) {
                if (event.startsAt < from)
                    continue;
                if (until && event.startsAt > until)
                    continue;
                upcoming.push({
                    ...event,
                    caseId: item.caseId,
                    ...(item.displayName ? { caseDisplayName: item.displayName } : {})
                });
            }
        }
        return upcoming
            .sort((left, right) => left.startsAt.localeCompare(right.startsAt) ||
            left.createdAt.localeCompare(right.createdAt))
            .slice(0, limit);
    }
    async listCaseContacts(context, caseId) {
        if (!this.schedule) {
            throw new Error("CASE_SCHEDULE_UNAVAILABLE");
        }
        return await this.withCaseDataKey(context, caseId, "READ", async (caseDataKey) => {
            const record = this.store.getCase(caseId);
            if (!record) {
                throw new CaseAccessError("CASE_NOT_FOUND", 404);
            }
            return await this.schedule.listContacts({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion
            });
        });
    }
    async addCaseContact(context, caseId, input) {
        if (!this.schedule) {
            throw new Error("CASE_SCHEDULE_UNAVAILABLE");
        }
        const kind = input.kind === "PERSON" || input.kind === "ORGANIZATION"
            ? input.kind
            : null;
        const name = cleanScheduleText(input.name, 180);
        const role = cleanScheduleText(input.role, 120);
        const phone = cleanScheduleText(input.phone, 60);
        const email = cleanScheduleText(input.email, 180);
        const address = cleanScheduleText(input.address, 300);
        const notes = cleanScheduleText(input.notes, 2000);
        if (!kind ||
            !name ||
            (phone && !/^[+\d][\d\s()./-]{2,}$/.test(phone)) ||
            (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        return await this.withCaseDataKey(context, caseId, "WRITE", async (caseDataKey) => {
            const record = this.store.getCase(caseId);
            if (!record) {
                throw new CaseAccessError("CASE_NOT_FOUND", 404);
            }
            const contacts = await this.schedule.listContacts({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion
            });
            const createdAt = new Date().toISOString();
            const contact = {
                contactId: "casecontact_" + randomBytes(16).toString("hex"),
                kind,
                name,
                ...(role ? { role } : {}),
                ...(phone ? { phone } : {}),
                ...(email ? { email } : {}),
                ...(address ? { address } : {}),
                ...(notes ? { notes } : {}),
                createdAt,
                createdByUserId: context.user.userId
            };
            await this.schedule.saveContacts({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion,
                contacts: [...contacts, contact]
            });
            // Names and contact details stay out of the audit log.
            this.audit(context.user.userId, "case_contact_added", createdAt, {
                caseId,
                contactId: contact.contactId,
                kind: contact.kind
            });
            return contact;
        });
    }
    async deleteCaseContact(context, caseId, contactId) {
        if (!this.schedule) {
            throw new Error("CASE_SCHEDULE_UNAVAILABLE");
        }
        if (!/^casecontact_[a-f0-9]{32}$/.test(contactId)) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        return await this.withCaseDataKey(context, caseId, "WRITE", async (caseDataKey) => {
            const record = this.store.getCase(caseId);
            if (!record) {
                throw new CaseAccessError("CASE_NOT_FOUND", 404);
            }
            const contacts = await this.schedule.listContacts({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion
            });
            const next = contacts.filter((item) => item.contactId !== contactId);
            if (next.length === contacts.length) {
                throw new CaseAccessError("CASE_CONTACT_NOT_FOUND", 404);
            }
            await this.schedule.saveContacts({
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion,
                contacts: next
            });
            const deletedAt = new Date().toISOString();
            this.audit(context.user.userId, "case_contact_deleted", deletedAt, {
                caseId,
                contactId
            });
            return { contactId, deletedAt };
        });
    }
    async listLegacyCases(context) {
        this.assertAdmin(context);
        return await this.files
            .listLegacyCases();
    }
    async importLegacyCase(context, caseId) {
        this.assertAdmin(context);
        if (!validCaseId(caseId)) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        if (this.store.getCase(caseId)) {
            throw new CaseAccessError("LEGACY_CASE_ALREADY_IMPORTED", 409);
        }
        let metadata;
        try {
            metadata =
                await this.files
                    .readCaseMetadata(caseId);
        }
        catch {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        if (metadata.createdByUserId ||
            metadata.keyVersion) {
            throw new CaseAccessError("LEGACY_CASE_ALREADY_IMPORTED", 409);
        }
        const caseDataKey = randomCaseDataKey();
        const keyVersion = 1;
        const now = new Date().toISOString();
        try {
            const ownerEnvelope = await this.auth
                .withSessionUserMasterKey(context.session
                .sessionId, (userMasterKey) => wrapCaseKeyForSessionUser(userMasterKey, {
                userId: context.user
                    .userId,
                caseId,
                caseDataKey,
                keyVersion
            }));
            const record = {
                caseId,
                createdByUserId: context.user.userId,
                createdAt: metadata.createdAt,
                updatedAt: now,
                keyVersion,
                caseKind: "MATTER",
                ...(metadata.displayName
                    ? {
                        displayName: metadata.displayName
                    }
                    : {})
            };
            const ownerAccess = {
                caseId,
                userId: context.user.userId,
                role: "OWNER",
                canReidentify: true,
                envelope: ownerEnvelope,
                grantedByUserId: context.user.userId,
                grantedAt: now
            };
            this.store
                .createCaseWithOwner({
                caseRecord: record,
                ownerAccess
            });
            try {
                await this.files
                    .updateCaseSecurityMetadata(caseId, {
                    createdByUserId: context.user
                        .userId,
                    keyVersion
                });
            }
            catch (error) {
                this.store
                    .deleteCaseRegistration(caseId);
                throw error;
            }
            this.audit(context.user.userId, "legacy_case_imported", now, {
                caseId,
                keyVersion
            });
            return {
                ...record,
                role: "OWNER",
                canReidentify: true
            };
        }
        finally {
            caseDataKey.fill(0);
        }
    }
    assertAccess(context, caseId, capability) {
        if (!validCaseId(caseId)) {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
        const access = this.store
            .getCaseAccess(caseId, context.user.userId);
        if (!access) {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
        const caseRecord = this.store.getCase(caseId);
        if (!caseRecord) {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        if (caseRecord.archivedAt &&
            capability !== "READ" &&
            capability !== "MANAGE") {
            throw new CaseAccessError("CASE_ARCHIVED", 409);
        }
        if (capability ===
            "REIDENTIFY") {
            if (!access.canReidentify) {
                throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
            }
            return access;
        }
        if (!ROLE_CAPABILITIES[access.role].has(capability)) {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
        return access;
    }
    async renameCase(context, caseId, displayName) {
        return await this
            .withCaseOperationLock(caseId, async () => await this
            .renameCaseUnlocked(context, caseId, displayName));
    }
    async renameCaseUnlocked(context, caseId, displayName) {
        this.assertAccess(context, caseId, "MANAGE");
        const cleaned = cleanDisplayName(displayName);
        if (!cleaned) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        const record = this.store.getCase(caseId);
        if (!record) {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        const now = new Date().toISOString();
        await this.files
            .updateCaseLifecycleMetadata(caseId, {
            updatedAt: now,
            displayName: cleaned
        });
        try {
            this.store
                .updateCaseDisplayName(caseId, cleaned, now);
        }
        catch (error) {
            try {
                await this.files
                    .updateCaseLifecycleMetadata(caseId, {
                    updatedAt: record.updatedAt,
                    displayName: record.displayName ??
                        null
                });
            }
            catch {
                throw new Error("CASE_LIFECYCLE_ROLLBACK_FAILED");
            }
            throw error;
        }
        this.audit(context.user.userId, "case_renamed", now, {
            caseId
        });
        return this.openCase(context, caseId);
    }
    async setCaseArchived(context, caseId, archived) {
        return await this
            .withCaseOperationLock(caseId, async () => await this
            .setCaseArchivedUnlocked(context, caseId, archived));
    }
    async setCaseArchivedUnlocked(context, caseId, archived) {
        this.assertAccess(context, caseId, "MANAGE");
        const record = this.store.getCase(caseId);
        if (!record) {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        if (Boolean(record.archivedAt) ===
            archived) {
            return this.openCase(context, caseId);
        }
        const now = new Date().toISOString();
        const archivedAt = archived ? now : null;
        await this.files
            .updateCaseLifecycleMetadata(caseId, {
            updatedAt: now,
            archivedAt
        });
        try {
            this.store
                .setCaseArchivedAt(caseId, archivedAt, now);
        }
        catch (error) {
            try {
                await this.files
                    .updateCaseLifecycleMetadata(caseId, {
                    updatedAt: record.updatedAt,
                    archivedAt: record.archivedAt ??
                        null
                });
            }
            catch {
                throw new Error("CASE_LIFECYCLE_ROLLBACK_FAILED");
            }
            throw error;
        }
        this.audit(context.user.userId, archived
            ? "case_archived"
            : "case_unarchived", now, { caseId });
        return this.openCase(context, caseId);
    }
    async deleteCase(context, caseId, password) {
        return await this
            .withCaseOperationLock(caseId, async () => await this
            .deleteCaseUnlocked(context, caseId, password));
    }
    async deleteCaseUnlocked(context, caseId, password) {
        const access = this.assertAccess(context, caseId, "MANAGE");
        if (access.role !== "OWNER") {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
        if (typeof password !==
            "string" ||
            password.length < 1) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        await this.auth
            .reauthenticate(context, password, "DELETE_CASE");
        const deletedAt = new Date().toISOString();
        // Files first: if SQLite removal unexpectedly fails, retrying the
        // delete can finish a stale registration without leaving case data.
        await this.files
            .removeCase(caseId);
        this.store
            .deleteCaseRegistration(caseId);
        this.audit(context.user.userId, "case_deleted", deletedAt, { caseId });
        return {
            caseId,
            deletedAt
        };
    }
    listAccessCandidates(context, caseId) {
        this.assertAccess(context, caseId, "MANAGE");
        const existing = new Set(this.store
            .listCaseAccess(caseId)
            .map((item) => item.userId));
        return this.store
            .listUsers()
            .filter((user) => user.status ===
            "ACTIVE" &&
            !existing.has(user.userId))
            .map((user) => ({
            userId: user.userId,
            loginName: user.loginName,
            displayName: user.displayName,
            appRole: user.appRole,
            status: user.status,
            createdAt: user.createdAt,
            ...(user.lastLoginAt
                ? {
                    lastLoginAt: user.lastLoginAt
                }
                : {})
        }));
    }
    listAccess(context, caseId) {
        this.assertAccess(context, caseId, "MANAGE");
        return this.store
            .listCaseAccess(caseId)
            .map((access) => {
            const user = this.store
                .getUserById(access.userId);
            if (!user) {
                throw new Error("CASE_ACCESS_USER_MISSING");
            }
            return {
                user: {
                    userId: user.userId,
                    loginName: user.loginName,
                    displayName: user.displayName,
                    appRole: user.appRole,
                    status: user.status,
                    createdAt: user.createdAt,
                    ...(user.lastLoginAt
                        ? {
                            lastLoginAt: user.lastLoginAt
                        }
                        : {})
                },
                role: access.role,
                canReidentify: access.canReidentify,
                grantedByUserId: access
                    .grantedByUserId,
                grantedAt: access.grantedAt,
                keyVersion: access.envelope
                    .keyVersion
            };
        });
    }
    async grantAccess(context, caseId, input) {
        this.assertAccess(context, caseId, "MANAGE");
        if (!validUserId(input.userId) ||
            input.userId ===
                context.user.userId ||
            ![
                "EDITOR",
                "ANALYST",
                "VIEWER"
            ].includes(input.role)) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        const target = this.store.getUserById(input.userId);
        if (!target ||
            target.status !== "ACTIVE") {
            throw new CaseAccessError("TARGET_USER_NOT_FOUND", 404);
        }
        const targetKeys = this.store
            .getUserSharingKeys(target.userId);
        if (!targetKeys) {
            throw new CaseAccessError("TARGET_CRYPTO_NOT_READY", 409);
        }
        const record = this.store.getCase(caseId);
        if (!record) {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        const now = new Date().toISOString();
        await this.withCaseDataKey(context, caseId, "MANAGE", async (caseDataKey) => {
            const envelope = wrapCaseKeyForOfflineUser(targetKeys
                .publicKeyDer, {
                targetUserId: target.userId,
                caseId,
                caseDataKey,
                keyVersion: record.keyVersion
            });
            this.store
                .upsertCaseAccess({
                caseId,
                userId: target.userId,
                role: input.role,
                canReidentify: input.canReidentify,
                envelope,
                grantedByUserId: context.user.userId,
                grantedAt: now
            });
        });
        this.audit(context.user.userId, "case_access_granted", now, {
            caseId,
            targetUserId: target.userId,
            role: input.role,
            canReidentify: input.canReidentify,
            keyVersion: record.keyVersion
        });
        return {
            user: {
                userId: target.userId,
                loginName: target.loginName,
                displayName: target.displayName,
                appRole: target.appRole,
                status: target.status,
                createdAt: target.createdAt,
                ...(target.lastLoginAt
                    ? {
                        lastLoginAt: target.lastLoginAt
                    }
                    : {})
            },
            role: input.role,
            canReidentify: input.canReidentify,
            grantedByUserId: context.user.userId,
            grantedAt: now,
            keyVersion: record.keyVersion
        };
    }
    async transferOwnership(context, caseId, input) {
        if (!validUserId(input.userId) ||
            input.userId ===
                context.user.userId ||
            typeof input.password !==
                "string" ||
            input.password.length < 1) {
            throw new CaseAccessError("INVALID_CASE_ACCESS_REQUEST", 400);
        }
        const access = this.assertAccess(context, caseId, "MANAGE");
        if (access.role !==
            "OWNER") {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
        const target = this.store.getUserById(input.userId);
        if (!target ||
            target.status !==
                "ACTIVE") {
            throw new CaseAccessError("TARGET_USER_NOT_FOUND", 404);
        }
        const targetKeys = this.store
            .getUserSharingKeys(target.userId);
        if (!targetKeys) {
            throw new CaseAccessError("TARGET_CRYPTO_NOT_READY", 409);
        }
        await this.auth
            .reauthenticate(context, input.password, "TRANSFER_CASE_OWNERSHIP");
        const record = this.store.getCase(caseId);
        if (!record) {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        const transferredAt = new Date().toISOString();
        await this.withCaseDataKey(context, caseId, "MANAGE", async (caseDataKey) => {
            const existing = this.store
                .getCaseAccess(caseId, target.userId);
            const envelope = existing &&
                existing.envelope
                    .keyVersion ===
                    record.keyVersion
                ? existing.envelope
                : wrapCaseKeyForOfflineUser(targetKeys.publicKeyDer, {
                    targetUserId: target.userId,
                    caseId,
                    caseDataKey,
                    keyVersion: record.keyVersion
                });
            await this.files
                .updateCaseLifecycleMetadata(caseId, {
                updatedAt: transferredAt
            });
            try {
                this.store
                    .transferCaseOwnership({
                    caseId,
                    previousOwnerUserId: context.user.userId,
                    newOwnerAccess: {
                        caseId,
                        userId: target.userId,
                        role: "OWNER",
                        canReidentify: true,
                        envelope,
                        grantedByUserId: context.user.userId,
                        grantedAt: transferredAt
                    },
                    updatedAt: transferredAt
                });
            }
            catch (error) {
                try {
                    await this.files
                        .updateCaseLifecycleMetadata(caseId, {
                        updatedAt: record.updatedAt
                    });
                }
                catch {
                    throw new Error("CASE_LIFECYCLE_ROLLBACK_FAILED");
                }
                throw error;
            }
        });
        this.audit(context.user.userId, "case_ownership_transferred", transferredAt, {
            caseId,
            previousOwnerUserId: context.user.userId,
            newOwnerUserId: target.userId,
            previousOwnerRole: "EDITOR",
            keyVersion: record.keyVersion
        });
        return {
            caseId,
            previousOwnerUserId: context.user.userId,
            newOwnerUserId: target.userId,
            previousOwnerRole: "EDITOR",
            keyVersion: record.keyVersion,
            transferredAt
        };
    }
    async revokeAccess(context, caseId, targetUserId) {
        this.assertAccess(context, caseId, "MANAGE");
        const targetAccess = this.store.getCaseAccess(caseId, targetUserId);
        if (!targetAccess) {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
        if (targetAccess.role ===
            "OWNER") {
            throw new CaseAccessError("OWNER_ACCESS_IMMUTABLE", 409);
        }
        const result = await this.rotateCaseKey(context, caseId, targetUserId);
        this.audit(context.user.userId, "case_access_revoked", new Date().toISOString(), {
            caseId,
            targetUserId,
            keyVersion: result.keyVersion
        });
        return {
            caseId,
            revokedUserId: targetUserId,
            keyVersion: result.keyVersion
        };
    }
    async rotateCaseKey(context, caseId, revokedUserId) {
        this.assertAccess(context, caseId, "MANAGE");
        const record = this.store.getCase(caseId);
        if (!record) {
            throw new CaseAccessError("CASE_NOT_FOUND", 404);
        }
        const currentAccess = this.store
            .listCaseAccess(caseId)
            .filter((item) => item.userId !==
            revokedUserId);
        if (!currentAccess.some((item) => item.userId ===
            context.user.userId &&
            item.role === "OWNER")) {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
        const nextKeyVersion = record.keyVersion + 1;
        const nextKey = randomCaseDataKey();
        const now = new Date().toISOString();
        try {
            return await this.withCaseDataKey(context, caseId, "MANAGE", async (currentCaseDataKey) => {
                const remaining = [];
                for (const existing of currentAccess) {
                    let envelope;
                    if (existing.userId ===
                        context.user.userId) {
                        envelope =
                            await this.auth
                                .withSessionUserMasterKey(context.session
                                .sessionId, (userMasterKey) => wrapCaseKeyForSessionUser(userMasterKey, {
                                userId: existing.userId,
                                caseId,
                                caseDataKey: nextKey,
                                keyVersion: nextKeyVersion
                            }));
                    }
                    else {
                        const userKeys = this.store
                            .getUserSharingKeys(existing.userId);
                        if (!userKeys) {
                            throw new CaseAccessError("TARGET_CRYPTO_NOT_READY", 409);
                        }
                        envelope =
                            wrapCaseKeyForOfflineUser(userKeys.publicKeyDer, {
                                targetUserId: existing.userId,
                                caseId,
                                caseDataKey: nextKey,
                                keyVersion: nextKeyVersion
                            });
                    }
                    remaining.push({
                        ...existing,
                        envelope
                    });
                }
                let vaultRekeyed = false;
                let keyCommitCompleted = false;
                try {
                    if (this
                        .keyRotationParticipant) {
                        vaultRekeyed =
                            await this
                                .keyRotationParticipant
                                .rekeyCaseVault({
                                caseId,
                                oldCaseDataKey: currentCaseDataKey,
                                oldKeyVersion: record.keyVersion,
                                newCaseDataKey: nextKey,
                                newKeyVersion: nextKeyVersion
                            });
                    }
                    await this.files
                        .updateCaseKeyVersion(caseId, nextKeyVersion);
                    try {
                        this.store
                            .revokeAccessAndRotate({
                            caseId,
                            revokedUserId: revokedUserId ??
                                "__none__",
                            newKeyVersion: nextKeyVersion,
                            updatedAt: now,
                            remaining
                        });
                    }
                    catch (error) {
                        try {
                            await this.files
                                .updateCaseKeyVersion(caseId, record.keyVersion);
                        }
                        catch {
                            // Original DB error remains primary.
                        }
                        throw error;
                    }
                    keyCommitCompleted =
                        true;
                    this.audit(context.user.userId, "case_key_rotated", now, {
                        caseId,
                        previousKeyVersion: record.keyVersion,
                        keyVersion: nextKeyVersion,
                        ...(revokedUserId
                            ? {
                                revokedUserId
                            }
                            : {})
                    });
                    return {
                        caseId,
                        keyVersion: nextKeyVersion
                    };
                }
                catch (error) {
                    if (!keyCommitCompleted &&
                        vaultRekeyed &&
                        this
                            .keyRotationParticipant) {
                        try {
                            await this
                                .keyRotationParticipant
                                .rekeyCaseVault({
                                caseId,
                                oldCaseDataKey: nextKey,
                                oldKeyVersion: nextKeyVersion,
                                newCaseDataKey: currentCaseDataKey,
                                newKeyVersion: record.keyVersion
                            });
                        }
                        catch {
                            throw new Error("CASE_KEY_ROTATION_ROLLBACK_FAILED");
                        }
                    }
                    throw error;
                }
            });
        }
        finally {
            nextKey.fill(0);
        }
    }
    async withCaseDataKey(context, caseId, capability, callback) {
        return await this
            .withCaseOperationLock(caseId, async () => await this
            .withCaseDataKeyUnlocked(context, caseId, capability, callback));
    }
    async withCaseDataKeyUnlocked(context, caseId, capability, callback) {
        const access = this.assertAccess(context, caseId, capability);
        const record = this.store.getCase(caseId);
        if (!record ||
            access.envelope
                .keyVersion !==
                record.keyVersion) {
            throw new CaseAccessError("CASE_KEY_UNAVAILABLE", 409);
        }
        return await this.auth
            .withSessionUserMasterKey(context.session.sessionId, async (userMasterKey) => {
            let caseDataKey;
            try {
                try {
                    if (access.envelope
                        .algorithm ===
                        "UMK-HKDF-SHA256-AES-256-GCM") {
                        caseDataKey =
                            unwrapCaseKeyForSessionUser(userMasterKey, {
                                userId: context.user.userId,
                                caseId,
                                keyVersion: record.keyVersion,
                                envelope: access.envelope
                            });
                    }
                    else {
                        const userKeys = this.store
                            .getUserSharingKeys(context.user.userId);
                        if (!userKeys) {
                            throw new CaseAccessError("CASE_KEY_UNAVAILABLE", 409);
                        }
                        const privateKey = unwrapUserSharingPrivateKey(userMasterKey, context.user.userId, userKeys.keyVersion, {
                            nonce: userKeys
                                .privateKeyWrapNonce,
                            ciphertext: userKeys
                                .privateKeyWrapCiphertext,
                            tag: userKeys
                                .privateKeyWrapTag
                        });
                        caseDataKey =
                            unwrapCaseKeyForOfflineUser(privateKey, {
                                userId: context.user.userId,
                                caseId,
                                keyVersion: record.keyVersion,
                                envelope: access.envelope
                            });
                    }
                    if (caseDataKey.length !== 32) {
                        throw new CaseAccessError("CASE_KEY_UNAVAILABLE", 409);
                    }
                }
                catch (error) {
                    if (error instanceof
                        CaseAccessError) {
                        throw error;
                    }
                    throw new CaseAccessError("CASE_KEY_UNAVAILABLE", 409);
                }
                return await callback(caseDataKey);
            }
            finally {
                caseDataKey?.fill(0);
            }
        });
    }
    async withCaseOperationLock(caseId, operation) {
        const previous = this.caseOperationTails
            .get(caseId) ??
            Promise.resolve();
        let release;
        const current = new Promise((resolve) => {
            release = resolve;
        });
        const tail = previous.then(() => current, () => current);
        this.caseOperationTails.set(caseId, tail);
        await previous.catch(() => undefined);
        try {
            return await operation();
        }
        finally {
            release?.();
            if (this.caseOperationTails
                .get(caseId) === tail) {
                this.caseOperationTails
                    .delete(caseId);
            }
        }
    }
    assertAdmin(context) {
        if (context.user.appRole !==
            "ADMIN") {
            throw new CaseAccessError("CASE_ACCESS_DENIED", 403);
        }
    }
    audit(userId, eventType, occurredAt, metadata) {
        this.store.recordSecurityEvent({
            eventId: "event_" +
                randomBytes(16)
                    .toString("hex"),
            userId,
            eventType,
            occurredAt,
            result: "PASS",
            metadata
        });
    }
}
