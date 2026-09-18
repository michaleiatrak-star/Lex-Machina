import { describe, expect, it } from "vitest";
import { AuditTrail } from "../src/audit-trail.js";

function fixedAudit(): AuditTrail {
  return new AuditTrail("session-test", () => "2026-09-15T00:00:00Z");
}

function completeBase(audit: AuditTrail): void {
  audit.start();
  audit.record("skill_read", "prawny-router-v3");
  audit.record("resource_read", "shared/PRAWO-HARDGATE.md");
  audit.record("skill_read", "prawo-polskie-v2");
  audit.record("route", "dr-02-prawo-cywilne-rodzinne-gospodarcze");
  audit.record("skill_read", "dr-02-prawo-cywilne-rodzinne-gospodarcze");
  audit.record("provider_start", "openai");
  audit.record("provider_end", "openai");
  audit.record("gate", "G8_HARD_GATE_FINALIZATION");
}

describe("AuditTrail", () => {
  it("passes a complete legal-session audit", () => {
    const audit = fixedAudit();
    completeBase(audit);
    audit.close();

    expect(audit.validateCompletion()).toMatchObject({
      result: "PASS",
      missing: [],
      violations: []
    });
  });

  it("blocks completion when the session was not closed", () => {
    const audit = fixedAudit();
    completeBase(audit);

    expect(audit.validateCompletion()).toMatchObject({
      result: "BLOCKED",
      missing: expect.arrayContaining(["session_closed"])
    });
  });

  it("blocks an audit where the router was not the first skill", () => {
    const audit = fixedAudit();
    audit.start();
    audit.record("skill_read", "dr-02-prawo-cywilne-rodzinne-gospodarcze");
    audit.record("skill_read", "prawny-router-v3");
    audit.record("route", "dr-02-prawo-cywilne-rodzinne-gospodarcze");
    audit.record("provider_start", "openai");
    audit.record("provider_end", "openai");
    audit.record("gate", "G8_HARD_GATE_FINALIZATION");
    audit.close();

    expect(audit.validateCompletion()).toMatchObject({
      result: "BLOCKED",
      violations: expect.arrayContaining(["router_not_first_skill"])
    });
  });

  it("can require explicit verification evidence", () => {
    const audit = fixedAudit();
    completeBase(audit);
    audit.close();

    expect(
      audit.validateCompletion({ requireVerification: true })
    ).toMatchObject({
      result: "BLOCKED",
      missing: expect.arrayContaining(["verification"])
    });
  });

  it("is append-only after close", () => {
    const audit = fixedAudit();
    completeBase(audit);
    audit.close();

    expect(() =>
      audit.record("gate", "after-close")
    ).toThrow(/append-only/);
  });
});
