import {
  randomBytes
} from "node:crypto";
import type {
  Express,
  Request,
  Response
} from "express";
import type {
  AuthService
} from "../auth/service.js";
import type {
  LocalAuthStore
} from "../auth/store.js";
import type {
  LocalCaseAccessService
} from "../case-access.js";
import type {
  LegacyCaseStorageMigrator
} from "../legacy-case-migration.js";

function caseIdFrom(
  req: Request
): string {
  return String(
    req.params.caseId ?? ""
  ).trim();
}

export function registerLegacyMigrationRoutes(
  app: Express,
  dependencies: {
    authService: Pick<
      AuthService,
      "authenticateAuthorization"
    >;
    securityEvents: Pick<
      LocalAuthStore,
      "recordSecurityEvent"
    >;
    caseAccessService: Pick<
      LocalCaseAccessService,
      | "assertAccess"
      | "openCase"
      | "withCaseDataKey"
    >;
    migrator: Pick<
      LegacyCaseStorageMigrator,
      "migrate"
    >;
  }
): void {
  app.post(
    "/api/cases/:caseId/migrate-legacy-storage",
    async (req, res) => {
      try {
        const actor =
          dependencies.authService
            .authenticateAuthorization(
              req.get(
                "authorization"
              )
            );
        const caseId =
          caseIdFrom(req);
        dependencies
          .caseAccessService
          .assertAccess(
            actor,
            caseId,
            "MANAGE"
          );
        const caseView =
          dependencies
            .caseAccessService
            .openCase(
              actor,
              caseId
            );
        const report =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "MANAGE",
              async (
                caseDataKey
              ) =>
                await dependencies
                  .migrator
                  .migrate({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView
                        .keyVersion
                  })
            );

        dependencies
          .securityEvents
          .recordSecurityEvent({
            eventId:
              "event_" +
              randomBytes(16)
                .toString("hex"),
            userId:
              actor.user.userId,
            eventType:
              report
                .remainingLegacyPlaintext
                ? "legacy_storage_migration_blocked"
                : "legacy_storage_migration_completed",
            occurredAt:
              new Date()
                .toISOString(),
            result:
              report
                .remainingLegacyPlaintext
                ? "BLOCKED"
                : "PASS",
            metadata: {
              caseId,
              migratedUploadCount:
                report
                  .migratedUploads
                  .length,
              alreadySecureUploadCount:
                report
                  .alreadySecureUploads
                  .length,
              blockedEntryCount:
                report
                  .blockedEntries
                  .length
            }
          });

        if (
          report
            .remainingLegacyPlaintext
        ) {
          res.status(409).json({
            error:
              "LEGACY_STORAGE_MIGRATION_BLOCKED",
            report
          });
          return;
        }
        res.json({ report });
      } catch (error) {
        const code =
          error instanceof Error
            ? error.message
            : "LEGACY_STORAGE_MIGRATION_FAILED";
        if (
          code ===
            "AUTHENTICATION_REQUIRED" ||
          code ===
            "SESSION_REVOKED"
        ) {
          res.status(401).json({
            error: code
          });
          return;
        }
        if (
          code ===
            "CASE_ACCESS_DENIED"
        ) {
          res.status(403).json({
            error: code
          });
          return;
        }
        res.status(422).json({
          error:
            "LEGACY_STORAGE_MIGRATION_FAILED",
          detail: code
        });
      }
    }
  );
}
