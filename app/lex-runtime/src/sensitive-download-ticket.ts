import {
  randomBytes
} from "node:crypto";
import type {
  AuthenticatedContext
} from "./auth/types.js";
import type {
  AuthService
} from "./auth/service.js";

export type SensitiveDownloadTicket = {
  ticketId: string;
  sessionId: string;
  userId: string;
  caseId: string;
  artifactId: string;
  finalSha256: string;
  expiresAt: string;
  remainingUses: 1 | 0;
};

export class SensitiveDownloadTicketManager {
  private readonly tickets =
    new Map<
      string,
      SensitiveDownloadTicket
    >();

  constructor(
    auth:
      Pick<
        AuthService,
        "onSessionRevoked"
      >,
    private readonly ttlMs =
      60_000
  ) {
    auth.onSessionRevoked(
      (event) => {
        for (
          const [
            id,
            ticket
          ] of this
            .tickets
        ) {
          if (
            ticket.sessionId ===
              event.sessionId
          ) {
            this.tickets
              .delete(id);
          }
        }
      }
    );
  }

  issue(
    actor:
      AuthenticatedContext,
    input: {
      caseId: string;
      artifactId: string;
      finalSha256: string;
    }
  ): SensitiveDownloadTicket {
    if (
      !/^case_[a-f0-9]{32}$/
        .test(
          input.caseId
        ) ||
      !/^artifact_[a-f0-9]{32}$/
        .test(
          input.artifactId
        ) ||
      !/^[a-f0-9]{64}$/
        .test(
          input.finalSha256
        )
    ) {
      throw new Error(
        "SENSITIVE_DOWNLOAD_TARGET_INVALID"
      );
    }
    const ticket:
      SensitiveDownloadTicket = {
        ticketId:
          "download_" +
          randomBytes(16)
            .toString("hex"),
        sessionId:
          actor.session
            .sessionId,
        userId:
          actor.user.userId,
        caseId:
          input.caseId,
        artifactId:
          input.artifactId,
        finalSha256:
          input.finalSha256,
        expiresAt:
          new Date(
            Date.now() +
              this.ttlMs
          ).toISOString(),
        remainingUses: 1
      };
    this.tickets.set(
      ticket.ticketId,
      ticket
    );
    return {
      ...ticket
    };
  }

  consume(
    actor:
      AuthenticatedContext,
    ticketId: string
  ): SensitiveDownloadTicket {
    const ticket =
      this.tickets.get(
        ticketId
      );
    if (!ticket) {
      throw new Error(
        "SENSITIVE_DOWNLOAD_TICKET_NOT_FOUND"
      );
    }
    if (
      ticket.sessionId !==
        actor.session
          .sessionId ||
      ticket.userId !==
        actor.user.userId
    ) {
      throw new Error(
        "SENSITIVE_DOWNLOAD_SESSION_MISMATCH"
      );
    }
    if (
      ticket.remainingUses !==
        1
    ) {
      throw new Error(
        "SENSITIVE_DOWNLOAD_TICKET_USED"
      );
    }
    if (
      Date.parse(
        ticket.expiresAt
      ) <= Date.now()
    ) {
      this.tickets.delete(
        ticketId
      );
      throw new Error(
        "SENSITIVE_DOWNLOAD_TICKET_EXPIRED"
      );
    }
    ticket.remainingUses = 0;
    this.tickets.delete(
      ticketId
    );
    return {
      ...ticket
    };
  }
}
