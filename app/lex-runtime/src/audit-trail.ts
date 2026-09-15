import { randomUUID } from "node:crypto";

export type AuditEventType =
  | "session_started"
  | "skill_read"
  | "resource_read"
  | "route"
  | "provider_start"
  | "provider_end"
  | "tool_decision"
  | "verification"
  | "gate"
  | "session_closed";

export type AuditStatus = "OK" | "DEGRADED" | "BLOCKED";

export type AuditEvent = {
  sequence: number;
  timestamp: string;
  type: AuditEventType;
  target: string;
  status: AuditStatus;
  detail?: Record<string, unknown>;
};

export type AuditCompletenessReport = {
  gate: "G9_AUDIT_COMPLETENESS";
  result: "PASS" | "BLOCKED";
  sessionId: string;
  missing: string[];
  violations: string[];
  eventCount: number;
};

export class AuditTrail {
  readonly sessionId: string;
  private readonly records: AuditEvent[] = [];
  private closed = false;

  constructor(
    sessionId: string = randomUUID(),
    private readonly now: () => string = () => new Date().toISOString()
  ) {
    this.sessionId = sessionId;
  }

  get events(): readonly AuditEvent[] {
    return this.records.map((event) => ({
      ...event,
      ...(event.detail ? { detail: { ...event.detail } } : {})
    }));
  }

  private append(
    type: AuditEventType,
    target: string,
    status: AuditStatus,
    detail?: Record<string, unknown>
  ): void {
    this.records.push({
      sequence: this.records.length + 1,
      timestamp: this.now(),
      type,
      target,
      status,
      ...(detail ? { detail: { ...detail } } : {})
    });
  }

  start(detail?: Record<string, unknown>): void {
    if (this.records.length > 0) {
      throw new Error("Audit session has already started.");
    }
    this.append("session_started", this.sessionId, "OK", detail);
  }

  record(
    type: Exclude<AuditEventType, "session_started" | "session_closed">,
    target: string,
    status: AuditStatus = "OK",
    detail?: Record<string, unknown>
  ): void {
    if (this.closed) {
      throw new Error("Audit trail is closed and append-only.");
    }
    if (this.records.length === 0) {
      throw new Error("Audit session must be started before recording events.");
    }
    this.append(type, target, status, detail);
  }

  close(
    status: Exclude<AuditStatus, "BLOCKED"> = "OK",
    detail?: Record<string, unknown>
  ): void {
    if (this.closed) {
      throw new Error("Audit trail is already closed.");
    }
    if (this.records.length === 0) {
      throw new Error("Cannot close an audit session that never started.");
    }
    this.append("session_closed", this.sessionId, status, detail);
    this.closed = true;
  }

  validateCompletion(options?: {
    requireVerification?: boolean;
    requireToolActivity?: boolean;
  }): AuditCompletenessReport {
    const missing: string[] = [];
    const violations: string[] = [];
    const events = this.records;

    if (events[0]?.type !== "session_started") {
      missing.push("session_started");
    }

    const skillReads = events.filter((event) => event.type === "skill_read");
    if (skillReads.length === 0) {
      missing.push("skill_read");
    } else if (skillReads[0]?.target !== "prawny-router-v3") {
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
    if (
      !events.some(
        (event) =>
          event.type === "gate" &&
          event.target === "G8_HARD_GATE_FINALIZATION" &&
          event.status !== "BLOCKED"
      )
    ) {
      missing.push("g8_finalization");
    }
    if (events.at(-1)?.type !== "session_closed") {
      missing.push("session_closed");
    }

    if (
      options?.requireVerification &&
      !events.some((event) => event.type === "verification")
    ) {
      missing.push("verification");
    }

    if (
      options?.requireToolActivity &&
      !events.some((event) => event.type === "tool_decision")
    ) {
      missing.push("tool_decision");
    }

    if (
      events.some(
        (event) =>
          (event.type === "gate" || event.type === "route") &&
          event.status === "BLOCKED"
      )
    ) {
      violations.push("blocked_event_present");
    }

    const providerStarts = events.filter(
      (event) => event.type === "provider_start"
    ).length;
    const providerEnds = events.filter(
      (event) => event.type === "provider_end"
    ).length;
    if (providerStarts !== providerEnds) {
      violations.push("provider_start_end_mismatch");
    }

    const sequencesValid = events.every(
      (event, index) => event.sequence === index + 1
    );
    if (!sequencesValid) {
      violations.push("non_contiguous_sequence");
    }

    return {
      gate: "G9_AUDIT_COMPLETENESS",
      result:
        missing.length === 0 && violations.length === 0 ? "PASS" : "BLOCKED",
      sessionId: this.sessionId,
      missing,
      violations,
      eventCount: events.length
    };
  }
}
