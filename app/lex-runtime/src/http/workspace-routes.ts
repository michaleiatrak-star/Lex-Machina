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
import type {
  EncryptedCaseWorkspaceStore,
  WorkspaceThreadMessage
} from "../case-workspace-store.js";

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
    code === "WORKSPACE_FOLDER_NOT_EMPTY"
  ) {
    res.status(409).json({ error: code });
    return;
  }
  if (
    code.includes("INVALID") ||
    code.includes("TOO_LARGE") ||
    code.includes("LIMIT_EXCEEDED")
  ) {
    res.status(422).json({ error: code });
    return;
  }
  res.status(500).json({ error: "WORKSPACE_OPERATION_FAILED", detail: code });
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
    workspace: EncryptedCaseWorkspaceStore;
    rootDir: string;
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
      res.send(payload);
    } catch (error) {
      sendError(res, error);
    } finally {
      payload?.fill(0);
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
          ? { documentCitations: raw.documentCitations as WorkspaceThreadMessage["documentCitations"] }
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
