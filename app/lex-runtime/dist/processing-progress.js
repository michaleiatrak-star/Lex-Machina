const PROGRESS_ID = /^[a-z0-9]{16,64}$/;
const TTL_MS = 15 * 60 * 1000;
const MAX_ENTRIES = 500;
export function progressIdFrom(value) {
    const id = typeof value === "string" ? value.trim().toLowerCase() : "";
    return PROGRESS_ID.test(id) ? id : undefined;
}
export class ProcessingProgressRegistry {
    now;
    entries = new Map();
    constructor(now = Date.now) {
        this.now = now;
    }
    reporter(caseId, progressId) {
        if (!progressId)
            return undefined;
        return (progress) => {
            this.prune();
            const existing = this.entries.get(progressId);
            // An id is bound to the case that first used it.
            if (existing && existing.caseId !== caseId)
                return;
            this.entries.set(progressId, { caseId, progress: { ...progress }, updatedAt: this.now() });
        };
    }
    get(caseId, progressId) {
        this.prune();
        const entry = this.entries.get(progressId);
        if (!entry || entry.caseId !== caseId)
            return undefined;
        return { ...entry.progress, updatedAt: new Date(entry.updatedAt).toISOString() };
    }
    prune() {
        const limit = this.now() - TTL_MS;
        for (const [id, entry] of this.entries) {
            if (entry.updatedAt < limit)
                this.entries.delete(id);
        }
        while (this.entries.size > MAX_ENTRIES) {
            this.entries.delete(this.entries.keys().next().value);
        }
    }
}
