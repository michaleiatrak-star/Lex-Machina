import { randomUUID } from "node:crypto";
export class AuditTrail {
    now;
    sessionId;
    records = [];
    closed = false;
    constructor(sessionId = randomUUID(), now = () => new Date().toISOString()) {
        this.now = now;
        this.sessionId = sessionId;
    }
    get events() {
        return this.records.map((event) => ({
            ...event,
            ...(event.detail ? { detail: { ...event.detail } } : {})
        }));
    }
    get isClosed() {
        return this.closed;
    }
    append(type, target, status, detail) {
        this.records.push({
            sequence: this.records.length + 1,
            timestamp: this.now(),
            type,
            target,
            status,
            ...(detail ? { detail: { ...detail } } : {})
        });
    }
    start(detail) {
        if (this.records.length > 0) {
            throw new Error("Audit session has already started.");
        }
        this.append("session_started", this.sessionId, "OK", detail);
    }
    record(type, target, status = "OK", detail) {
        if (this.closed) {
            throw new Error("Audit trail is closed and append-only.");
        }
        if (this.records.length === 0) {
            throw new Error("Audit session must be started before recording events.");
        }
        this.append(type, target, status, detail);
    }
    close(status = "OK", detail) {
        if (this.closed) {
            throw new Error("Audit trail is already closed.");
        }
        if (this.records.length === 0) {
            throw new Error("Cannot close an audit session that never started.");
        }
        this.append("session_closed", this.sessionId, status, detail);
        this.closed = true;
    }
    validateCompletion(options) {
        const missing = [];
        const violations = [];
        const events = this.records;
        if (events[0]?.type !== "session_started") {
            missing.push("session_started");
        }
        const skillReads = events.filter((event) => event.type === "skill_read");
        if (skillReads.length === 0) {
            missing.push("skill_read");
        }
        else if (skillReads[0]?.target !== "prawny-router-v3") {
            violations.push("router_not_first_skill");
        }
        if (!events.some((event) => event.type === "route")) {
            missing.push("route");
        }
        if (!events.some((event) => event.type === "provider_start")) {
            missing.push("provider_start");
        }
        if (!events.some((event) => event.type === "provider_end")) {
            missing.push("provider_end");
        }
        if (!events.some((event) => event.type === "gate" &&
            event.target === "G8_HARD_GATE_FINALIZATION" &&
            event.status !== "BLOCKED")) {
            missing.push("g8_finalization");
        }
        if (events.at(-1)?.type !== "session_closed") {
            missing.push("session_closed");
        }
        if (options?.requireVerification &&
            !events.some((event) => event.type === "verification")) {
            missing.push("verification");
        }
        if (options?.requireToolActivity &&
            !events.some((event) => event.type === "tool_decision")) {
            missing.push("tool_decision");
        }
        if (options?.requireDeterministicWorkflow) {
            const ownershipGates = [
                "G39K_MODEL_TASK_OWNERSHIP",
                "G39L_ROUTER_REQUIRED_MODULES"
            ];
            for (const target of ownershipGates) {
                if (!events.some((event) => event.type ===
                    "gate" &&
                    event.target ===
                        target &&
                    event.status ===
                        "OK")) {
                    missing.push(target.toLowerCase());
                }
            }
            const gates = [
                "G39H_WORKFLOW_PREFLIGHT",
                "G39H_WORKFLOW_PROVIDER_COMPLETE",
                "G39H_WORKFLOW_RESOURCE_READS",
                "G39H_WORKFLOW_FINALIZATION"
            ];
            const indices = gates.map((target) => events.findIndex((event) => event.type === "gate" &&
                event.target === target));
            gates.forEach((target, index) => {
                if (indices[index] === -1) {
                    missing.push(target.toLowerCase());
                }
            });
            if (indices.every((index) => index >= 0) &&
                !indices.every((index, position) => position === 0 ||
                    index > indices[position - 1])) {
                violations.push("deterministic_workflow_order_invalid");
            }
        }
        if (events.some((event) => (event.type === "gate" || event.type === "route") &&
            event.status === "BLOCKED")) {
            violations.push("blocked_event_present");
        }
        const providerStarts = events.filter((event) => event.type === "provider_start").length;
        const providerEnds = events.filter((event) => event.type === "provider_end").length;
        if (providerStarts !== providerEnds) {
            violations.push("provider_start_end_mismatch");
        }
        const sequencesValid = events.every((event, index) => event.sequence === index + 1);
        if (!sequencesValid) {
            violations.push("non_contiguous_sequence");
        }
        return {
            gate: "G9_AUDIT_COMPLETENESS",
            result: missing.length === 0 && violations.length === 0 ? "PASS" : "BLOCKED",
            sessionId: this.sessionId,
            missing,
            violations,
            eventCount: events.length
        };
    }
}
