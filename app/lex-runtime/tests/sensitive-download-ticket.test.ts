import { describe, expect, it, vi } from "vitest";
import { SensitiveDownloadTicketManager } from "../src/sensitive-download-ticket.js";

function actor(sessionId = "session_1") {
  return {
    user: {
      userId: "user_0123456789abcdef0123456789abcdef",
      loginName: "admin",
      displayName: "Admin",
      appRole: "ADMIN" as const,
      status: "ACTIVE" as const,
      authEpoch: 1,
      createdAt: "2026-09-16T10:00:00.000Z"
    },
    session: {
      sessionId,
      userId: "user_0123456789abcdef0123456789abcdef",
      authEpoch: 1,
      createdAt: "2026-09-16T10:00:00.000Z",
      lastActivityAt: "2026-09-16T10:00:00.000Z",
      idleExpiresAt: "2026-09-16T11:00:00.000Z",
      overallExpiresAt: "2026-09-16T18:00:00.000Z"
    }
  };
}

describe("SensitiveDownloadTicketManager", () => {
  it("is same-session and one-use", () => {
    let revoke: ((event: { sessionId: string }) => void) | undefined;
    const manager = new SensitiveDownloadTicketManager({
      onSessionRevoked: (listener: (event: { sessionId: string }) => void) => {
        revoke = listener;
        return () => {};
      }
    } as any);
    const current = actor();
    const ticket = manager.issue(current as any, {
      caseId: "case_0123456789abcdef0123456789abcdef",
      artifactId: "artifact_0123456789abcdef0123456789abcdef",
      finalSha256: "a".repeat(64)
    });
    expect(() => manager.consume(actor("session_2") as any, ticket.ticketId))
      .toThrow("SENSITIVE_DOWNLOAD_SESSION_MISMATCH");
    expect(manager.consume(current as any, ticket.ticketId).remainingUses).toBe(0);
    expect(() => manager.consume(current as any, ticket.ticketId))
      .toThrow("SENSITIVE_DOWNLOAD_TICKET_NOT_FOUND");
    expect(revoke).toBeTypeOf("function");
  });

  it("revokes outstanding tickets with the session", () => {
    let revoke: ((event: { sessionId: string }) => void) | undefined;
    const manager = new SensitiveDownloadTicketManager({
      onSessionRevoked: (listener: (event: { sessionId: string }) => void) => {
        revoke = listener;
        return () => {};
      }
    } as any);
    const current = actor();
    const ticket = manager.issue(current as any, {
      caseId: "case_0123456789abcdef0123456789abcdef",
      artifactId: "artifact_0123456789abcdef0123456789abcdef",
      finalSha256: "b".repeat(64)
    });
    revoke?.({ sessionId: current.session.sessionId });
    expect(() => manager.consume(current as any, ticket.ticketId))
      .toThrow("SENSITIVE_DOWNLOAD_TICKET_NOT_FOUND");
  });
});
