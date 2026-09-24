import {
  FORMAT_MEDIA_TYPE,
  editableMediaType,
  type EditableFormat,
  type EditableModel,
  type LocalOfficeEditor
} from "../office-edit.js";
import { randomBytes } from "node:crypto";
import {
  mkdir,
  readdir,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type {
  Express,
  Request,
  Response
} from "express";
import type { AuthService } from "../auth/service.js";
import type { LocalCaseAccessService } from "../case-access.js";
import type { SecureCaseUploadStore } from "../case-secure-store.js";
import type { LocalSharedTemplateStore } from "../shared-template-store.js";
import type { EncryptedPrivacyVaultStore } from "../privacy/vault-store.js";
import type { LocalPrivateDocumentService } from "../document-service.js";
import {
  documentIdFromSha256,
  purgeSecureCaseDocument
} from "../case-document-purge.js";
import type {
  EncryptedCaseWorkspaceStore,
  WorkspaceThreadMessage
} from "../case-workspace-store.js";
import {
  PROCESS_PLEADING_CHECKPOINTS,
  acceptProcessPleadingStart,
  confirmProcessCheckpoint,
  createProcessPleadingState,
  markProcessCheckpointNotApplicable,
  type ProcessPleadingCheckpoint,
  type ProcessPleadingMode
} from "../process-pleading-state.js";
import {
  createCourtAnalysisState
} from "../court-analysis-state.js";
import {
  createChronologyState
} from "../chronology-state.js";
import {
  createContractAnalysisState,
  type ContractWorkflowMode
} from "../contract-analysis-state.js";
import {
  createOrderedCaseWorkflowState,
  nextOrderedCaseCheckpoint,
  type OrderedCaseWorkflowId
} from "../ordered-case-workflow-state.js";

const CASE_ID = /^case_[a-f0-9]{32}$/;
const UPLOAD_ID = /^upload_[a-f0-9]{32}$/;
const TEMPLATE_ID = /^template_[a-f0-9]{32}$/;
const FOLDER_ID = /^folder_[a-f0-9]{32}$/;
const OPEN_TOKEN = /^open_[a-f0-9]{32}(?:\.[a-z0-9]{1,10})?$/;
const PREVIEW_MAX_BYTES = 64 * 1024 * 1024;
const OPEN_MAX_BYTES = 512 * 1024 * 1024;

function caseIdFrom(req: Request): string {
  return String(req.params.caseId ?? "").trim();
}

function errorCode(error: unknown): string {
  return error instanceof Error ? error.message : "WORKSPACE_OPERATION_FAILED";
}

function sendError(res: Response, error: unknown): void {
  const code = errorCode(error);
  if (["AUTHENTICATION_REQUIRED", "SESSION_REVOKED"].includes(code)) {
    res.status(401).json({ error: code });
    return;
  }
  if (code === "CASE_ACCESS_DENIED") {
    res.status(403).json({ error: code });
    return;
  }
  if (
    code === "CASE_NOT_FOUND" ||
    code.endsWith("_NOT_FOUND") ||
    code === "ENOENT"
  ) {
    res.status(404).json({ error: code });
    return;
  }
  if (
    code === "CASE_ARCHIVED" ||
    code === "WORKSPACE_FOLDER_NOT_EMPTY" ||
    code === "PROCESS_PLEADING_STATE_EXISTS" ||
    code === "PROCESS_PLEADING_STATE_CONFLICT" ||
    code === "COURT_ANALYSIS_STATE_EXISTS" ||
    code === "COURT_ANALYSIS_STATE_CONFLICT" ||
    code === "ORDERED_WORKFLOW_STATE_CONFLICT" ||
    code === "CHRONOLOGY_STATE_EXISTS" ||
    code === "CHRONOLOGY_STATE_CONFLICT" ||
    code === "CONTRACT_STATE_EXISTS" ||
    code === "CONTRACT_STATE_CONFLICT" ||
    code.includes("PROCESS_PLEADING_CONFIRMATION") ||
    code.includes("PROCESS_PLEADING_START_TRANSITION")
  ) {
    res.status(409).json({ error: code });
    return;
  }
  if (
    code.includes("INVALID") ||
    code.includes("TOO_LARGE") ||
    code.includes("LIMIT_EXCEEDED") ||
    code.includes("TRANSITION") ||
    (code.startsWith("OFFICE_EDIT_") && code.includes("UNSUPPORTED"))
  ) {
    res.status(422).json({ error: code });
    return;
  }
  res.status(500).json({ error: "WORKSPACE_OPERATION_FAILED", detail: code });
}

/**
 * Sends file bytes and wipes them once the response is done: the socket may
 * still hold the buffer after send() returns, so wiping earlier corrupts it.
 */
function sendAndWipe(res: Response, data: Buffer): void {
  res.once("close", () => data.fill(0));
  res.send(data);
}

function extensionFor(filename: string): string {
  const extension = path.extname(filename).toLowerCase().replace(/^\./, "");
  return /^[a-z0-9]{1,10}$/.test(extension) ? extension : "";
}

function contentDisposition(filename: string): string {
  const safe = filename
    .normalize("NFKC")
    .replace(/[\r\n"\\/]/g, "_")
    .slice(0, 180) || "document.bin";
  return `inline; filename="${safe}"`;
}

async function cleanupOpenCopies(root: string): Promise<void> {
  let names: string[];
  try {
    names = await readdir(root);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
    throw error;
  }
  const threshold = Date.now() - 60 * 60 * 1000;
  await Promise.all(names.map(async (name) => {
    if (!OPEN_TOKEN.test(name)) return;
    const target = path.join(root, name);
    try {
      const info = await stat(target);
      if (info.isFile() && info.mtimeMs < threshold) {
        await rm(target, { force: true });
      }
    } catch {
      // Cleanup is best-effort and must not expose another path.
    }
  }));
}

export function registerWorkspaceRoutes(
  app: Express,
  dependencies: {
    authService: Pick<AuthService, "authenticateAuthorization">;
    caseAccessService: Pick<
      LocalCaseAccessService,
      "assertAccess" | "openCase" | "withCaseDataKey"
    >;
    uploads: Pick<
      SecureCaseUploadStore,
      "listUploads" | "readUploadPayload"
    >;
    templates: Pick<
      LocalSharedTemplateStore,
      "listTemplates" | "readTemplate"
    > & { templatesDir: string };
    privacyVaults: Pick<
      EncryptedPrivacyVaultStore,
      "deleteDocumentVault"
    >;
    documentService: Pick<
      LocalPrivateDocumentService,
      "forget"
    >;
    workspace: EncryptedCaseWorkspaceStore;
    rootDir: string;
    officeEditor?: Pick<LocalOfficeEditor, "read" | "write">;
  }
): void {
  const actorFor = (req: Request) =>
    dependencies.authService.authenticateAuthorization(
      req.get("authorization")
    );

  const resourcesFor = async (
    actor: ReturnType<typeof actorFor>,
    caseId: string,
    capability: "READ" | "WRITE" = "READ"
  ) => {
    dependencies.caseAccessService.assertAccess(actor, caseId, capability);
    const caseView = dependencies.caseAccessService.openCase(actor, caseId);
    return await dependencies.caseAccessService.withCaseDataKey(
      actor,
      caseId,
      capability,
      async (caseDataKey) => {
        const uploads = await dependencies.uploads.listUploads({
          caseId,
          caseDataKey,
          keyVersion: caseView.keyVersion
        });
        const templates = caseView.caseKind === "FIRM_KNOWLEDGE"
          ? await dependencies.templates.listTemplates()
          : [];
        const itemIds = [
          ...uploads.map((item) => item.uploadId),
          ...templates.map((item) => item.templateId)
        ];
        const workspace = await dependencies.workspace.listWorkspace({
          caseId,
          caseDataKey,
          keyVersion: caseView.keyVersion,
          itemIds
        });
        return { caseView, caseDataKey, uploads, templates, itemIds, workspace };
      }
    );
  };

  app.get("/api/cases/:caseId/workspace", async (req, res) => {
    try {
      const actor = actorFor(req);
      const caseId = caseIdFrom(req);
      const data = await resourcesFor(actor, caseId);
      res.json({
        caseId,
        caseKind: data.caseView.caseKind,
        caseDisplayName:
          data.caseView.displayName ??
          "Sprawa bez nazwy",
        folders: data.workspace.folders,
        itemLocations: data.workspace.itemLocations,
        items: [
          ...data.uploads.map((item) => ({
            kind: "UPLOAD" as const,
            itemId: item.uploadId,
            filename: item.filename,
            mediaType: item.mediaType,
            bytes: item.bytes,
            createdAt: item.storedAt,
            archive: item.archive
          })),
          ...data.templates.map((item) => ({
            kind: "TEMPLATE" as const,
            itemId: item.templateId,
            filename: item.filename,
            mediaType: item.mediaType,
            bytes: item.bytes,
            createdAt: item.createdAt,
            archive: false
          }))
        ]
      });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.get(
    "/api/cases/:caseId/workflow/process-pleading",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "READ"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "READ",
              (caseDataKey) =>
                dependencies.workspace
                  .getProcessPleadingState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion
                  })
            );
        res.json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/process-pleading/initialize",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const mode: ProcessPleadingMode =
          req.body?.mode === "AUTO"
            ? "AUTO"
            : "CHECKPOINT";
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (caseDataKey) => {
                const existing =
                  await dependencies
                    .workspace
                    .getProcessPleadingState({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (existing) {
                  throw new Error(
                    "PROCESS_PLEADING_STATE_EXISTS"
                  );
                }
                return await dependencies
                  .workspace
                  .saveProcessPleadingState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state:
                      createProcessPleadingState(
                        caseId,
                        mode
                      )
                  });
              }
            );
        res.status(201).json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/process-pleading/accept-start",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (caseDataKey) => {
                const current =
                  await dependencies
                    .workspace
                    .getProcessPleadingState({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (!current) {
                  throw new Error(
                    "PROCESS_PLEADING_STATE_NOT_FOUND"
                  );
                }
                const next =
                  acceptProcessPleadingStart(
                    current
                  );
                return await dependencies
                  .workspace
                  .saveProcessPleadingState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state: next,
                    expectedRevision:
                      current.revision
                  });
              }
            );
        res.json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/process-pleading/confirm",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const checkpoint =
          typeof req.body?.checkpoint ===
            "string"
            ? req.body.checkpoint.trim()
            : "";
        if (
          !PROCESS_PLEADING_CHECKPOINTS
            .includes(
              checkpoint as
                ProcessPleadingCheckpoint
            )
        ) {
          throw new Error(
            "PROCESS_PLEADING_CHECKPOINT_INVALID"
          );
        }
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (caseDataKey) => {
                const current =
                  await dependencies
                    .workspace
                    .getProcessPleadingState({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (!current) {
                  throw new Error(
                    "PROCESS_PLEADING_STATE_NOT_FOUND"
                  );
                }
                const next =
                  confirmProcessCheckpoint(
                    current,
                    checkpoint as
                      ProcessPleadingCheckpoint
                  );
                return await dependencies
                  .workspace
                  .saveProcessPleadingState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state: next,
                    expectedRevision:
                      current.revision
                  });
              }
            );
        res.json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/process-pleading/not-applicable",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const checkpoint =
          typeof req.body?.checkpoint === "string"
            ? req.body.checkpoint.trim()
            : "";
        const reason =
          typeof req.body?.reason === "string"
            ? req.body.reason
            : "";
        const expectedRevision =
          Number(req.body?.expectedRevision);

        if (
          !PROCESS_PLEADING_CHECKPOINTS.includes(
            checkpoint as ProcessPleadingCheckpoint
          ) ||
          !Number.isSafeInteger(expectedRevision) ||
          expectedRevision < 1
        ) {
          throw new Error(
            "PROCESS_PLEADING_NA_REQUEST_INVALID"
          );
        }

        dependencies.caseAccessService.assertAccess(
          actor,
          caseId,
          "WRITE"
        );
        const caseView =
          dependencies.caseAccessService.openCase(
            actor,
            caseId
          );

        const state =
          await dependencies.caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (caseDataKey) => {
                const current =
                  await dependencies.workspace
                    .getProcessPleadingState({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (!current) {
                  throw new Error(
                    "PROCESS_PLEADING_STATE_NOT_FOUND"
                  );
                }
                if (
                  current.revision !==
                    expectedRevision
                ) {
                  throw new Error(
                    "PROCESS_PLEADING_STATE_CONFLICT"
                  );
                }
                const next =
                  markProcessCheckpointNotApplicable(
                    current,
                    checkpoint as
                      ProcessPleadingCheckpoint,
                    reason
                  );
                return await dependencies.workspace
                  .saveProcessPleadingState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state: next,
                    expectedRevision:
                      current.revision
                  });
              }
            );

        res.json({ caseId, state });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/process-pleading/reset",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const expectedRevision =
          Number(req.body?.expectedRevision);
        const confirmation =
          typeof req.body?.confirmation === "string"
            ? req.body.confirmation
            : "";

        if (
          confirmation !==
            "RESET_PROCESS_PLEADING" ||
          !Number.isSafeInteger(
            expectedRevision
          ) ||
          expectedRevision < 1
        ) {
          throw new Error(
            "PROCESS_PLEADING_RESET_REQUEST_INVALID"
          );
        }

        dependencies.caseAccessService.assertAccess(
          actor,
          caseId,
          "WRITE"
        );
        const caseView =
          dependencies.caseAccessService.openCase(
            actor,
            caseId
          );
        const cleared =
          await dependencies.caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              (caseDataKey) =>
                dependencies.workspace
                  .clearProcessPleadingState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    expectedRevision
                  })
            );

        if (!cleared) {
          throw new Error(
            "PROCESS_PLEADING_STATE_NOT_FOUND"
          );
        }
        res.json({
          caseId,
          reset: true
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.get(
    "/api/cases/:caseId/workflow/court-analysis",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "READ"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "READ",
              (caseDataKey) =>
                dependencies.workspace
                  .getCourtAnalysisState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion
                  })
            );
        res.json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/court-analysis/initialize",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (caseDataKey) => {
                const existing =
                  await dependencies
                    .workspace
                    .getCourtAnalysisState({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (existing) {
                  throw new Error(
                    "COURT_ANALYSIS_STATE_EXISTS"
                  );
                }
                return await dependencies
                  .workspace
                  .saveCourtAnalysisState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state:
                      createCourtAnalysisState(
                        caseId
                      )
                  });
              }
            );
        res.status(201).json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/court-analysis/reset",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const expectedRevision =
          Number(
            req.body
              ?.expectedRevision
          );
        const confirmation =
          typeof req.body
            ?.confirmation ===
            "string"
            ? req.body
                .confirmation
            : "";

        if (
          confirmation !==
            "RESET_COURT_ANALYSIS" ||
          !Number.isSafeInteger(
            expectedRevision
          ) ||
          expectedRevision < 1
        ) {
          throw new Error(
            "COURT_ANALYSIS_RESET_REQUEST_INVALID"
          );
        }

        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const cleared =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              (caseDataKey) =>
                dependencies.workspace
                  .clearCourtAnalysisState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    expectedRevision
                  })
            );

        if (!cleared) {
          throw new Error(
            "COURT_ANALYSIS_STATE_NOT_FOUND"
          );
        }
        res.json({
          caseId,
          reset: true
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.get(
    "/api/cases/:caseId/workflow/chronology",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "READ"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "READ",
              (caseDataKey) =>
                dependencies.workspace
                  .getChronologyState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion
                  })
            );
        res.json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/chronology/initialize",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (caseDataKey) => {
                const existing =
                  await dependencies
                    .workspace
                    .getChronologyState({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (existing) {
                  throw new Error(
                    "CHRONOLOGY_STATE_EXISTS"
                  );
                }
                return await dependencies
                  .workspace
                  .saveChronologyState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state:
                      createChronologyState(
                        caseId
                      )
                  });
              }
            );
        res.status(201).json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/chronology/reset",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const expectedRevision =
          Number(
            req.body
              ?.expectedRevision
          );
        const confirmation =
          typeof req.body
            ?.confirmation ===
            "string"
            ? req.body
                .confirmation
            : "";

        if (
          confirmation !==
            "RESET_CHRONOLOGY" ||
          !Number.isSafeInteger(
            expectedRevision
          ) ||
          expectedRevision < 1
        ) {
          throw new Error(
            "CHRONOLOGY_RESET_REQUEST_INVALID"
          );
        }

        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const cleared =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              (caseDataKey) =>
                dependencies.workspace
                  .clearChronologyState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    expectedRevision
                  })
            );

        if (!cleared) {
          throw new Error(
            "CHRONOLOGY_STATE_NOT_FOUND"
          );
        }
        res.json({
          caseId,
          reset: true
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.get(
    "/api/cases/:caseId/workflow/contract-analysis",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "READ"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "READ",
              (caseDataKey) =>
                dependencies.workspace
                  .getContractAnalysisState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion
                  })
            );
        res.json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/contract-analysis/initialize",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const rawMode =
          typeof req.body?.mode ===
            "string"
            ? req.body.mode
                .trim()
                .toUpperCase()
            : "";
        if (
          ![
            "ANALYSIS",
            "REDACTION",
            "DRAFT",
            "SUPPLEMENT"
          ].includes(rawMode)
        ) {
          throw new Error(
            "CONTRACT_MODE_INVALID"
          );
        }
        const mode =
          rawMode as
            ContractWorkflowMode;

        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );

        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (
                caseDataKey
              ) => {
                const existing =
                  await dependencies
                    .workspace
                    .getContractAnalysisState({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (existing) {
                  throw new Error(
                    "CONTRACT_STATE_EXISTS"
                  );
                }
                return await dependencies
                  .workspace
                  .saveContractAnalysisState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state:
                      createContractAnalysisState(
                        caseId,
                        mode
                      )
                  });
              }
            );

        res.status(201).json({
          caseId,
          state
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/contract-analysis/reset",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const expectedRevision =
          Number(
            req.body
              ?.expectedRevision
          );
        const confirmation =
          typeof req.body
            ?.confirmation ===
            "string"
            ? req.body
                .confirmation
            : "";

        if (
          confirmation !==
            "RESET_CONTRACT_ANALYSIS" ||
          !Number.isSafeInteger(
            expectedRevision
          ) ||
          expectedRevision < 1
        ) {
          throw new Error(
            "CONTRACT_RESET_REQUEST_INVALID"
          );
        }

        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const cleared =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              (caseDataKey) =>
                dependencies.workspace
                  .clearContractAnalysisState({
                    caseId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    expectedRevision
                  })
            );

        if (!cleared) {
          throw new Error(
            "CONTRACT_STATE_NOT_FOUND"
          );
        }
        res.json({
          caseId,
          reset: true
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.get(
    "/api/cases/:caseId/workflow/ordered/:workflowId",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const workflowId =
          String(
            req.params.workflowId ?? ""
          ).trim() as
            OrderedCaseWorkflowId;
        if (
          ![
            "EVIDENCE_ANALYSIS_V1",
            "WITNESS_QUESTIONING_V1"
          ].includes(
            workflowId
          )
        ) {
          throw new Error(
            "ORDERED_WORKFLOW_ID_INVALID"
          );
        }
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "ANALYZE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "ANALYZE",
              (caseDataKey) =>
                dependencies.workspace
                  .getOrderedCaseWorkflowState({
                    caseId,
                    workflowId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion
                  })
            );
        res.json({
          caseId,
          workflowId,
          state,
          nextCheckpoint:
            state
              ? nextOrderedCaseCheckpoint(
                  state
                )
              : null
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/ordered/:workflowId/initialize",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const workflowId =
          String(
            req.params.workflowId ?? ""
          ).trim() as
            OrderedCaseWorkflowId;
        if (
          ![
            "EVIDENCE_ANALYSIS_V1",
            "WITNESS_QUESTIONING_V1"
          ].includes(
            workflowId
          )
        ) {
          throw new Error(
            "ORDERED_WORKFLOW_ID_INVALID"
          );
        }
        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const state =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              async (
                caseDataKey
              ) => {
                const existing =
                  await dependencies
                    .workspace
                    .getOrderedCaseWorkflowState({
                      caseId,
                      workflowId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                if (existing) {
                  return existing;
                }
                return await dependencies
                  .workspace
                  .saveOrderedCaseWorkflowState({
                    caseId,
                    workflowId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    state:
                      createOrderedCaseWorkflowState(
                        workflowId,
                        caseId
                      )
                  });
              }
            );
        res.json({
          caseId,
          workflowId,
          state,
          nextCheckpoint:
            nextOrderedCaseCheckpoint(
              state
            )
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post(
    "/api/cases/:caseId/workflow/ordered/:workflowId/reset",
    async (req, res) => {
      try {
        const actor = actorFor(req);
        const caseId = caseIdFrom(req);
        const workflowId =
          String(
            req.params.workflowId ?? ""
          ).trim() as
            OrderedCaseWorkflowId;
        const expectedRevision =
          Number(
            req.body
              ?.expectedRevision
          );
        const confirmation =
          typeof req.body
            ?.confirmation ===
            "string"
            ? req.body
                .confirmation
            : "";
        if (
          ![
            "EVIDENCE_ANALYSIS_V1",
            "WITNESS_QUESTIONING_V1"
          ].includes(
            workflowId
          ) ||
          confirmation !==
            "RESET_ORDERED_WORKFLOW" ||
          !Number.isSafeInteger(
            expectedRevision
          ) ||
          expectedRevision < 1
        ) {
          throw new Error(
            "ORDERED_WORKFLOW_RESET_REQUEST_INVALID"
          );
        }

        dependencies.caseAccessService
          .assertAccess(
            actor,
            caseId,
            "WRITE"
          );
        const caseView =
          dependencies.caseAccessService
            .openCase(
              actor,
              caseId
            );
        const cleared =
          await dependencies
            .caseAccessService
            .withCaseDataKey(
              actor,
              caseId,
              "WRITE",
              (caseDataKey) =>
                dependencies.workspace
                  .clearOrderedCaseWorkflowState({
                    caseId,
                    workflowId,
                    caseDataKey,
                    keyVersion:
                      caseView.keyVersion,
                    expectedRevision
                  })
            );
        if (!cleared) {
          throw new Error(
            "ORDERED_WORKFLOW_STATE_NOT_FOUND"
          );
        }
        res.json({
          caseId,
          workflowId,
          reset: true
        });
      } catch (error) {
        sendError(res, error);
      }
    }
  );

  app.post("/api/cases/:caseId/workspace/folders", async (req, res) => {
    try {
      const actor = actorFor(req);
      const caseId = caseIdFrom(req);
      const name = typeof req.body?.name === "string" ? req.body.name : "";
      const parentId = req.body?.parentId === null || req.body?.parentId === undefined
        ? null
        : String(req.body.parentId);
      const caseView = dependencies.caseAccessService.openCase(actor, caseId);
      const folder = await dependencies.caseAccessService.withCaseDataKey(
        actor,
        caseId,
        "WRITE",
        (caseDataKey) => dependencies.workspace.createFolder({
          caseId,
          caseDataKey,
          keyVersion: caseView.keyVersion,
          name,
          parentId
        })
      );
      res.status(201).json({ folder });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete("/api/cases/:caseId/workspace/folders/:folderId", async (req, res) => {
    try {
      const actor = actorFor(req);
      const caseId = caseIdFrom(req);
      const folderId = String(req.params.folderId ?? "");
      if (!FOLDER_ID.test(folderId)) throw new Error("WORKSPACE_FOLDER_ID_INVALID");
      const caseView = dependencies.caseAccessService.openCase(actor, caseId);
      await dependencies.caseAccessService.withCaseDataKey(
        actor,
        caseId,
        "WRITE",
        (caseDataKey) => dependencies.workspace.deleteFolder({
          caseId,
          caseDataKey,
          keyVersion: caseView.keyVersion,
          folderId
        })
      );
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  });

  app.patch("/api/cases/:caseId/workspace/items/:itemId", async (req, res) => {
    try {
      const actor = actorFor(req);
      const caseId = caseIdFrom(req);
      const itemId = String(req.params.itemId ?? "");
      const folderId = req.body?.folderId === null ? null : String(req.body?.folderId ?? "");
      const data = await resourcesFor(actor, caseId, "WRITE");
      await dependencies.caseAccessService.withCaseDataKey(
        actor,
        caseId,
        "WRITE",
        (caseDataKey) => dependencies.workspace.moveItem({
          caseId,
          caseDataKey,
          keyVersion: data.caseView.keyVersion,
          itemId,
          folderId,
          knownItemIds: data.itemIds
        })
      );
      res.json({ itemId, folderId });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.delete("/api/cases/:caseId/workspace/items/:itemId", async (req, res) => {
    try {
      const actor = actorFor(req);
      const caseId = caseIdFrom(req);
      const itemId = String(req.params.itemId ?? "");
      const data = await resourcesFor(actor, caseId, "WRITE");
      if (!data.itemIds.includes(itemId)) throw new Error("WORKSPACE_ITEM_NOT_FOUND");

      if (UPLOAD_ID.test(itemId)) {
        const upload = data.uploads.find((item) => item.uploadId === itemId);
        if (!upload) throw new Error("WORKSPACE_ITEM_NOT_FOUND");
        await dependencies.caseAccessService.withCaseDataKey(
          actor,
          caseId,
          "WRITE",
          async (caseDataKey) => {
            const payload = await dependencies.uploads.readUploadPayload({
              caseId,
              uploadId: itemId,
              caseDataKey,
              keyVersion: data.caseView.keyVersion,
              maxBytes: Math.max(1, upload.bytes)
            });
            payload.fill(0);

            const documentIds = [
              ...new Set(
                [
                  upload.sha256,
                  ...upload.extracted.map((entry) => entry.sha256)
                ].map(documentIdFromSha256)
              )
            ];
            for (const documentId of documentIds) {
              await dependencies.privacyVaults.deleteDocumentVault({
                caseId,
                documentId,
                caseDataKey,
                keyVersion: data.caseView.keyVersion
              });
              await purgeSecureCaseDocument({
                rootDir: dependencies.rootDir,
                caseId,
                documentId
              });
              dependencies.documentService.forget(documentId);
            }

            const target = path.resolve(
              dependencies.rootDir,
              "cases",
              caseId,
              "secure",
              "incoming",
              itemId
            );
            const base = path.resolve(
              dependencies.rootDir,
              "cases",
              caseId,
              "secure",
              "incoming"
            ) + path.sep;
            if (!target.startsWith(base)) throw new Error("CASE_PATH_ESCAPE");
            await rm(target, { recursive: true, force: true });
            await dependencies.workspace.forgetItem({
              caseId,
              caseDataKey,
              keyVersion: data.caseView.keyVersion,
              itemId
            });
          }
        );
      } else if (TEMPLATE_ID.test(itemId)) {
        if (data.caseView.caseKind !== "FIRM_KNOWLEDGE" || actor.user.appRole !== "ADMIN") {
          throw new Error("CASE_ACCESS_DENIED");
        }
        const template = await dependencies.templates.readTemplate(itemId);
        template.data.fill(0);
        const target = path.resolve(dependencies.templates.templatesDir, itemId);
        const base = path.resolve(dependencies.templates.templatesDir) + path.sep;
        if (!target.startsWith(base)) throw new Error("TEMPLATE_PATH_ESCAPE");
        await rm(target, { recursive: true, force: true });
        await dependencies.caseAccessService.withCaseDataKey(
          actor,
          caseId,
          "WRITE",
          (caseDataKey) => dependencies.workspace.forgetItem({
            caseId,
            caseDataKey,
            keyVersion: data.caseView.keyVersion,
            itemId
          })
        );
      } else {
        throw new Error("WORKSPACE_ITEM_NOT_FOUND");
      }
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  });

  const readItem = async (
    actor: ReturnType<typeof actorFor>,
    caseId: string,
    itemId: string,
    maxBytes: number
  ): Promise<{ filename: string; mediaType: string; data: Buffer }> => {
    const data = await resourcesFor(actor, caseId, "READ");
    if (UPLOAD_ID.test(itemId)) {
      const upload = data.uploads.find((item) => item.uploadId === itemId);
      if (!upload) throw new Error("WORKSPACE_ITEM_NOT_FOUND");
      if (upload.bytes > maxBytes) throw new Error("WORKSPACE_ITEM_TOO_LARGE");
      const payload = await dependencies.caseAccessService.withCaseDataKey(
        actor,
        caseId,
        "READ",
        (caseDataKey) => dependencies.uploads.readUploadPayload({
          caseId,
          uploadId: itemId,
          caseDataKey,
          keyVersion: data.caseView.keyVersion,
          maxBytes
        })
      );
      return { filename: upload.filename, mediaType: upload.mediaType, data: payload };
    }
    if (TEMPLATE_ID.test(itemId) && data.caseView.caseKind === "FIRM_KNOWLEDGE") {
      const template = await dependencies.templates.readTemplate(itemId);
      if (template.data.byteLength > maxBytes) {
        template.data.fill(0);
        throw new Error("WORKSPACE_ITEM_TOO_LARGE");
      }
      return {
        filename: template.manifest.filename,
        mediaType: template.manifest.mediaType,
        data: template.data
      };
    }
    throw new Error("WORKSPACE_ITEM_NOT_FOUND");
  };

  app.get("/api/cases/:caseId/workspace/items/:itemId/preview", async (req, res) => {
    let payload: Buffer | undefined;
    try {
      const actor = actorFor(req);
      const item = await readItem(actor, caseIdFrom(req), String(req.params.itemId ?? ""), PREVIEW_MAX_BYTES);
      payload = item.data;
      res.setHeader("Content-Type", item.mediaType || "application/octet-stream");
      res.setHeader("Content-Disposition", contentDisposition(item.filename));
      res.setHeader("Cache-Control", "no-store");
      sendAndWipe(res, payload);
      payload = undefined;
    } catch (error) {
      sendError(res, error);
    } finally {
      payload?.fill(0);
    }
  });

  // Editable model of a DOCX/ODT document or XLSX/CSV sheet for the in-app editor.
  app.get("/api/cases/:caseId/workspace/items/:itemId/editable", async (req, res) => {
    let payload: Buffer | undefined;
    try {
      if (!dependencies.officeEditor) throw new Error("OFFICE_EDIT_UNAVAILABLE");
      const actor = actorFor(req);
      const item = await readItem(actor, caseIdFrom(req), String(req.params.itemId ?? ""), PREVIEW_MAX_BYTES);
      payload = item.data;
      const mediaType = editableMediaType(item.mediaType, item.filename);
      if (!mediaType) throw new Error("OFFICE_EDIT_MEDIA_TYPE_UNSUPPORTED");
      const model = await dependencies.officeEditor.read(payload, mediaType);
      res.setHeader("Cache-Control", "no-store");
      res.json({ filename: item.filename, mediaType: item.mediaType, model });
    } catch (error) {
      sendError(res, error);
    } finally {
      payload?.fill(0);
    }
  });

  // An edited model rendered to a new file; the client stores it as a new
  // case file, so the original is never overwritten.
  app.post("/api/cases/:caseId/workspace/render", async (req, res) => {
    let output: Buffer | undefined;
    try {
      if (!dependencies.officeEditor) throw new Error("OFFICE_EDIT_UNAVAILABLE");
      const actor = actorFor(req);
      dependencies.caseAccessService.assertAccess(actor, caseIdFrom(req), "WRITE");
      const format = String(req.body?.format ?? "") as EditableFormat;
      const model = req.body?.model as EditableModel | undefined;
      if (!(format in FORMAT_MEDIA_TYPE) || !model || typeof model !== "object") {
        throw new Error("OFFICE_EDIT_INVALID_REQUEST");
      }
      const delimiter = typeof req.body?.delimiter === "string" ? req.body.delimiter.slice(0, 1) : undefined;
      output = await dependencies.officeEditor.write(format, model, delimiter);
      res.setHeader("Content-Type", FORMAT_MEDIA_TYPE[format]);
      res.setHeader("Cache-Control", "no-store");
      sendAndWipe(res, output);
      output = undefined;
    } catch (error) {
      sendError(res, error);
    } finally {
      output?.fill(0);
    }
  });

  app.post("/api/cases/:caseId/workspace/items/:itemId/open", async (req, res) => {
    let payload: Buffer | undefined;
    try {
      const actor = actorFor(req);
      const item = await readItem(actor, caseIdFrom(req), String(req.params.itemId ?? ""), OPEN_MAX_BYTES);
      payload = item.data;
      const root = path.join(os.tmpdir(), "LexMachinaOpen");
      await mkdir(root, { recursive: true, mode: 0o700 });
      await cleanupOpenCopies(root);
      const extension = extensionFor(item.filename);
      const token = `open_${randomBytes(16).toString("hex")}${extension ? `.${extension}` : ""}`;
      if (!OPEN_TOKEN.test(token)) throw new Error("WORKSPACE_OPEN_TOKEN_INVALID");
      const target = path.join(root, token);
      await writeFile(target, payload, { flag: "wx", mode: 0o600 });
      res.json({
        token,
        filename: item.filename,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      sendError(res, error);
    } finally {
      payload?.fill(0);
    }
  });

  app.get("/api/cases/:caseId/workspace/thread", async (req, res) => {
    try {
      const actor = actorFor(req);
      const caseId = caseIdFrom(req);
      const caseView = dependencies.caseAccessService.openCase(actor, caseId);
      const messages = await dependencies.caseAccessService.withCaseDataKey(
        actor,
        caseId,
        "READ",
        (caseDataKey) => dependencies.workspace.loadThread({
          caseId,
          caseDataKey,
          keyVersion: caseView.keyVersion
        })
      );
      res.json({ caseId, messages });
    } catch (error) {
      sendError(res, error);
    }
  });

  app.post("/api/cases/:caseId/workspace/thread/messages", async (req, res) => {
    try {
      const actor = actorFor(req);
      const caseId = caseIdFrom(req);
      const caseView = dependencies.caseAccessService.openCase(actor, caseId);
      const raw = req.body as Partial<WorkspaceThreadMessage>;
      const message: WorkspaceThreadMessage = {
        messageId: String(raw.messageId ?? ""),
        role: raw.role as WorkspaceThreadMessage["role"],
        content: String(raw.content ?? ""),
        createdAt: String(raw.createdAt ?? ""),
        ...(typeof raw.meta === "string" ? { meta: raw.meta } : {}),
        ...(Array.isArray(raw.documentCitations)
          ? {
              documentCitations:
                raw.documentCitations as NonNullable<
                  WorkspaceThreadMessage["documentCitations"]
                >
            }
          : {}),
        ...(Array.isArray(raw.restorations)
          ? {
              restorations:
                raw.restorations as NonNullable<
                  WorkspaceThreadMessage["restorations"]
                >
            }
          : {})
      };
      const saved = await dependencies.caseAccessService.withCaseDataKey(
        actor,
        caseId,
        "WRITE",
        (caseDataKey) => dependencies.workspace.appendThreadMessage({
          caseId,
          caseDataKey,
          keyVersion: caseView.keyVersion,
          message
        })
      );
      res.status(201).json({ message: saved });
    } catch (error) {
      sendError(res, error);
    }
  });
}
