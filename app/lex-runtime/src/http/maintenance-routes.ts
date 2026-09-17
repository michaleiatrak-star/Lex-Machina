import type { Express, Request, Response } from "express";
import {
  AuthError,
  type AuthService
} from "../auth/service.js";
import type { LocalModelRuntime } from "../local-model-runtime.js";
import type { MaintenanceService } from "../maintenance-service.js";

function authenticated(
  req: Request,
  authService: AuthService
) {
  return authService.authenticateAuthorization(
    req.get("authorization")
  );
}

function requireAdmin(
  req: Request,
  res: Response,
  authService: AuthService
): ReturnType<typeof authenticated> | null {
  try {
    const actor = authenticated(req, authService);
    if (actor.user.appRole !== "ADMIN") {
      res.status(403).json({
        error: "AUTHORIZATION_DENIED"
      });
      return null;
    }
    return actor;
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(error.httpStatus).json({
        error: error.code,
        ...(error.retryAfter
          ? { retryAfter: error.retryAfter }
          : {})
      });
      return null;
    }
    throw error;
  }
}

function sendMaintenanceError(
  res: Response,
  error: unknown
): void {
  const code = error instanceof Error
    ? error.message.split(":", 1)[0]!
    : "MAINTENANCE_FAILED";
  const status =
    code.includes("IN_PROGRESS")
      ? 409
      : code.includes("NOT_AVAILABLE") ||
          code.includes("UNSUPPORTED") ||
          code.includes("INVALID")
        ? 409
        : code.includes("UNKNOWN")
          ? 404
          : code.includes("MISSING") ||
              code.includes("NOT_VERIFIED") ||
              code.includes("VALIDATION") ||
              code.includes("PROVISIONING_FAILED")
            ? 503
            : 500;
  res.status(status).json({ error: code });
}

export function registerMaintenanceRoutes(
  app: Express,
  dependencies: {
    authService: AuthService;
    localModels: LocalModelRuntime;
    maintenance: MaintenanceService;
  }
): void {
  const {
    authService,
    localModels,
    maintenance
  } = dependencies;

  app.get(
    "/api/local-models",
    (req, res) => {
      try {
        authenticated(req, authService);
        res.json({
          provider: "local",
          models: localModels.listModels(),
          runtime: localModels.status()
        });
      } catch (error) {
        if (error instanceof AuthError) {
          res.status(error.httpStatus).json({
            error: error.code
          });
          return;
        }
        throw error;
      }
    }
  );

  app.post(
    "/api/local-models/provision",
    async (req, res) => {
      if (!requireAdmin(req, res, authService)) return;
      try {
        const modelId =
          typeof req.body?.modelId === "string"
            ? req.body.modelId.trim()
            : "";
        const contextTokens = Number(req.body?.contextTokens);
        if (!modelId) {
          res.status(400).json({ error: "LOCAL_MODEL_ID_REQUIRED" });
          return;
        }
        if (!Number.isInteger(contextTokens)) {
          res.status(400).json({ error: "LOCAL_MODEL_CONTEXT_INVALID" });
          return;
        }
        const provisioned = await localModels.provision(
          modelId,
          contextTokens
        );
        res.json({
          ...provisioned,
          runtime: localModels.status()
        });
      } catch (error) {
        sendMaintenanceError(res, error);
      }
    }
  );

  app.post(
    "/api/local-models/repair",
    async (req, res) => {
      if (!requireAdmin(req, res, authService)) return;
      try {
        const repaired = await localModels.repair();
        res.json({
          ...repaired,
          runtime: localModels.status()
        });
      } catch (error) {
        sendMaintenanceError(res, error);
      }
    }
  );

  app.post(
    "/api/local-models/remove",
    async (req, res) => {
      if (!requireAdmin(req, res, authService)) return;
      try {
        const modelId =
          typeof req.body?.modelId === "string"
            ? req.body.modelId.trim()
            : "";
        if (!modelId) {
          res.status(400).json({
            error: "LOCAL_MODEL_ID_REQUIRED"
          });
          return;
        }
        const removed = await localModels.remove(modelId);
        res.json({
          ...removed,
          runtime: localModels.status()
        });
      } catch (error) {
        sendMaintenanceError(res, error);
      }
    }
  );

  app.post(
    "/api/local-models/start",
    async (req, res) => {
      try {
        authenticated(req, authService);
        const modelId =
          typeof req.body?.modelId === "string"
            ? req.body.modelId
            : "";
        const model = await localModels.ensureRunning(modelId);
        res.json({
          model,
          runtime: localModels.status()
        });
      } catch (error) {
        if (error instanceof AuthError) {
          res.status(error.httpStatus).json({
            error: error.code
          });
          return;
        }
        sendMaintenanceError(res, error);
      }
    }
  );

  app.post(
    "/api/local-models/stop",
    async (req, res) => {
      try {
        authenticated(req, authService);
        await localModels.stop();
        res.json({
          runtime: localModels.status()
        });
      } catch (error) {
        if (error instanceof AuthError) {
          res.status(error.httpStatus).json({
            error: error.code
          });
          return;
        }
        sendMaintenanceError(res, error);
      }
    }
  );

  app.get(
    "/api/local-models/update/status",
    async (req, res) => {
      if (!requireAdmin(req, res, authService)) return;
      try {
        const installed =
          localModels.installedModelUpdateIdentity();
        res.json(
          await maintenance.modelPackStatus(
            installed
              ? {
                  modelId:
                    installed.modelId,
                  sha256:
                    installed.sha256
                }
              : null
          )
        );
      } catch (error) {
        sendMaintenanceError(res, error);
      }
    }
  );

  app.get(
    "/api/skills/update/status",
    async (req, res) => {
      if (!requireAdmin(req, res, authService)) return;
      try {
        res.json(await maintenance.skillStatus());
      } catch (error) {
        sendMaintenanceError(res, error);
      }
    }
  );

  app.post(
    "/api/skills/update/apply",
    async (req, res) => {
      if (!requireAdmin(req, res, authService)) return;
      try {
        res.json(await maintenance.applySkillUpdate());
      } catch (error) {
        sendMaintenanceError(res, error);
      }
    }
  );

  app.post(
    "/api/update/download",
    async (req, res) => {
      if (!requireAdmin(req, res, authService)) return;
      try {
        res.json(await maintenance.downloadApplicationUpdate());
      } catch (error) {
        sendMaintenanceError(res, error);
      }
    }
  );
}
