import { createHash } from "node:crypto";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response
} from "express";
import helmet from "helmet";
import { LexSkillRegistry } from "../registry.js";
import {
  DynamicModelCatalog,
  type ModelDescriptor
} from "../providers/model-catalog.js";
import {
  MissingProviderCredentialError,
  providerConfigurationStatus,
  type ProviderCredentialResolver,
  type ProviderCredentialManager
} from "../providers/credentials.js";
import {
  ProviderGatewayError
} from "../providers/gateway.js";
import type { ProviderId } from "../providers/types.js";
import type {
  UpdateDiscovery
} from "../update-discovery.js";
import type {
  SessionExecutor,
  SessionExecutionRequest
} from "../session-executor.js";
import type {
  DocumentChunkSelection,
  DocumentService,
  ResolvedDocumentAttachment,
  PagePrivacyDirective,
  SupportedDocumentMediaType
} from "../document-service.js";
import { RoutingCatalog } from "./routing-catalog.js";
import {
  decodeUploadFilename,
  type LocalCaseFileStore
} from "../case-file-store.js";
import {
  AuthError,
  type AuthService
} from "../auth/service.js";
import type {
  AuthenticatedContext,
  CaseRole
} from "../auth/types.js";
import {
  CaseAccessError,
  type LocalCaseAccessService
} from "../case-access.js";
import type {
  LocalCaseKnowledgeSearch
} from "../case-knowledge-search.js";
import type {
  LocalSharedTemplateStore
} from "../shared-template-store.js";
import type {
  SecureCaseUploadStore
} from "../case-secure-store.js";
import type {
  StoredUpload
} from "../case-file-store.js";
import {
  assertStoredDocumentSignature,
  storedDocumentMediaType
} from "../stored-document-source.js";

const PROVIDERS = new Set<ProviderId>([
  "openai",
  "anthropic",
  "xai"
]);

function isProviderId(value: string): value is ProviderId {
  return PROVIDERS.has(value as ProviderId);
}

const DOCUMENT_MEDIA_TYPES =
  new Set<SupportedDocumentMediaType>([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff"
  ]);

function requestDocumentMediaType(
  req: Request
): SupportedDocumentMediaType | null {
  const raw = req.get("content-type")
    ?.split(";", 1)[0]
    ?.trim()
    .toLowerCase();
  return raw &&
    DOCUMENT_MEDIA_TYPES.has(
      raw as SupportedDocumentMediaType
    )
    ? raw as SupportedDocumentMediaType
    : null;
}

const PRIVACY_KINDS = new Set([
  "PESEL",
  "NIP",
  "REGON",
  "IBAN",
  "EMAIL",
  "PHONE",
  "PERSON",
  "ADDRESS",
  "CUSTOM"
] as const);

function parsePrivacyDirectives(
  value: unknown
): PagePrivacyDirective[] | null {
  if (!Array.isArray(value)) return null;

  const directives: PagePrivacyDirective[] = [];
  for (const item of value) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return null;
    }
    const record = item as Record<string, unknown>;
    const action = record.action;
    if (
      !Number.isInteger(record.page) ||
      !Number.isInteger(record.start) ||
      !Number.isInteger(record.end) ||
      !["PSEUDONYMIZE", "KEEP", "LABEL"]
        .includes(String(action))
    ) {
      return null;
    }

    const rawKind =
      typeof record.kind === "string"
        ? record.kind
        : undefined;
    if (
      rawKind !== undefined &&
      !PRIVACY_KINDS.has(
        rawKind as
          typeof PRIVACY_KINDS extends Set<infer T>
            ? T
            : never
      )
    ) {
      return null;
    }

    const kind = rawKind as
      | NonNullable<PagePrivacyDirective["kind"]>
      | undefined;

    directives.push({
      page: Number(record.page),
      start: Number(record.start),
      end: Number(record.end),
      action: action as PagePrivacyDirective["action"],
      ...(kind !== undefined
        ? { kind }
        : {}),
      ...(typeof record.label === "string"
        ? { label: record.label }
        : {})
    });
  }
  return directives;
}

function isLoopbackOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname === "::1" ||
        url.hostname === "[::1]"
      )
    );
  } catch {
    return false;
  }
}

function loopbackOriginGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.get("origin");
  if (!origin || isLoopbackOrigin(origin)) {
    next();
    return;
  }

  res.status(403).json({
    error: "ORIGIN_NOT_ALLOWED"
  });
}

export type LexHttpAppOptions = {
  registry: LexSkillRegistry;
  modelCatalog: Pick<DynamicModelCatalog, "list">;
  credentialResolver?: ProviderCredentialResolver;
  credentialManager?: ProviderCredentialManager;
  updateDiscovery?: UpdateDiscovery;
  sessionExecutor?: SessionExecutor;
  documentService?: DocumentService;
  caseFileStore?:
    Pick<
      LocalCaseFileStore,
      | "createCase"
      | "saveUpload"
      | "assertCase"
    > &
    Partial<
      Pick<
        LocalCaseFileStore,
        "listUploads"
      >
    >;
  secureCaseUploadStore?: Pick<
    SecureCaseUploadStore,
    | "saveUpload"
    | "listUploads"
    | "readUploadPayload"
    | "readExtractedPayload"
  >;
  authService?: AuthService;
  sharedTemplateStore?: Pick<
    LocalSharedTemplateStore,
    | "saveTemplate"
    | "listTemplates"
  >;
  caseKnowledgeSearch?: Pick<
    LocalCaseKnowledgeSearch,
    "search"
  >;
  caseAccessService?: Pick<
    LocalCaseAccessService,
    | "createCase"
    | "createFirmKnowledgeWorkspace"
    | "getFirmKnowledgeWorkspace"
    | "listCases"
    | "openCase"
    | "renameCase"
    | "setCaseArchived"
    | "deleteCase"
    | "listLegacyCases"
    | "importLegacyCase"
    | "assertAccess"
    | "listAccess"
    | "listAccessCandidates"
    | "grantAccess"
    | "transferOwnership"
    | "revokeAccess"
    | "rotateCaseKey"
    | "withCaseDataKey"
  >;
};


function sendAuthError(
  res: Response,
  error: unknown
): boolean {
  if (!(error instanceof AuthError)) {
    return false;
  }
  res.status(error.httpStatus).json({
    error: error.code,
    ...(error.retryAfter
      ? { retryAfter: error.retryAfter }
      : {})
  });
  return true;
}

function sendCaseAccessError(
  res: Response,
  error: unknown
): boolean {
  if (
    !(error instanceof
      CaseAccessError)
  ) {
    return false;
  }
  res.status(
    error.httpStatus
  ).json({
    error: error.code
  });
  return true;
}

function responseAuthContext(
  res: Response
): AuthenticatedContext {
  const context =
    res.locals.lexAuth as
      | AuthenticatedContext
      | undefined;
  if (!context) {
    throw new Error(
      "AUTH_CONTEXT_MISSING"
    );
  }
  return context;
}

function publicSkill(skill: {
  name: string;
  frontmatter: Record<string, unknown>;
}): Record<string, unknown> {
  const fm = skill.frontmatter;
  return {
    name: skill.name,
    ...(typeof fm.version === "string" ? { version: fm.version } : {}),
    ...(typeof fm.type === "string" ? { type: fm.type } : {}),
    ...(typeof fm.status === "string" ? { status: fm.status } : {}),
    ...(typeof fm.description === "string"
      ? { description: fm.description }
      : {}),
    category: /^dr-\d{2}-/.test(skill.name)
      ? "domain"
      : "execution"
  };
}

function sanitizeModels(models: ModelDescriptor[]): ModelDescriptor[] {
  return models.map((model) => ({ ...model }));
}

function parseDocumentAttachments(
  value: unknown
): Array<
  DocumentChunkSelection & {
    caseId?: string;
  }
> | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 4) {
    return null;
  }

  const selections: Array<
    DocumentChunkSelection & {
      caseId?: string;
    }
  > = [];
  for (const item of value) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return null;
    }
    const record = item as Record<string, unknown>;
    const caseId =
      typeof record.caseId === "string"
        ? record.caseId.trim()
        : "";
    const documentId =
      typeof record.documentId === "string"
        ? record.documentId.trim()
        : "";
    const chunkIndices =
      Array.isArray(record.chunkIndices)
        ? record.chunkIndices
        : null;

    if (
      (
        caseId &&
        !/^case_[a-f0-9]{32}$/.test(caseId)
      ) ||
      !/^doc_[a-f0-9]{24}$/.test(documentId) ||
      !chunkIndices ||
      chunkIndices.length < 1 ||
      chunkIndices.length > 32 ||
      chunkIndices.some(
        (index) =>
          !Number.isInteger(index) ||
          Number(index) < 1
      )
    ) {
      return null;
    }

    selections.push({
      ...(caseId
        ? { caseId }
        : {}),
      documentId,
      chunkIndices:
        [...new Set(
          chunkIndices.map(Number)
        )]
    });
  }

  return selections;
}

function parseSessionRequest(
  body: unknown
): SessionExecutionRequest | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const value = body as Record<string, unknown>;
  const query =
    typeof value.query === "string"
      ? value.query.trim()
      : "";
  const provider =
    typeof value.provider === "string"
      ? value.provider
      : "";
  const model =
    typeof value.model === "string"
      ? value.model.trim()
      : "";
  const primarySkill =
    typeof value.primarySkill === "string"
      ? value.primarySkill.trim()
      : "";
  const mode =
    value.mode === "LAIK" || value.mode === "PRAWNIK"
      ? value.mode
      : "PRAWNIK";

  if (
    query.length < 1 ||
    query.length > 30_000 ||
    !isProviderId(provider) ||
    model.length < 1 ||
    model.length > 256 ||
    primarySkill.length < 1 ||
    primarySkill.length > 160
  ) {
    return null;
  }

  return {
    query,
    provider,
    model,
    primarySkill,
    mode
  };
}

export function createLexHttpApp(options: LexHttpAppOptions): Express {
  const app = express();
  const routing = new RoutingCatalog(options.registry);
  const documentCaseIds =
    new Map<string, string>();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(loopbackOriginGuard);
  app.use(express.json({ limit: "256kb" }));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "lex-machina-runtime",
      localOnly: true
    });
  });

  app.get(
    "/api/auth/status",
    (_req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      res.json(
        options.authService.status()
      );
    }
  );

  app.post(
    "/api/auth/bootstrap",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const displayName =
        typeof req.body?.displayName ===
          "string"
          ? req.body.displayName
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";

      try {
        const result =
          await options.authService
            .bootstrap({
              loginName,
              displayName,
              password
            });
        res.status(201).json(result);
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "AUTH_BOOTSTRAP_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/auth/login",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";

      try {
        res.json(
          await options.authService
            .login({
              loginName,
              password
            })
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "AUTH_LOGIN_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/auth/recover",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const recoveryCode =
        typeof req.body?.recoveryCode ===
          "string"
          ? req.body.recoveryCode
          : "";
      const newPassword =
        typeof req.body?.newPassword ===
          "string"
          ? req.body.newPassword
          : "";

      try {
        res.json(
          await options.authService
            .recoverAccount({
              loginName,
              recoveryCode,
              newPassword
            })
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "AUTH_RECOVERY_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/auth/logout",
    (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      options.authService
        .logoutAuthorization(
          req.get("authorization")
        );
      res.status(204).end();
    }
  );

  if (options.authService) {
    app.use(
      "/api",
      (req, res, next) => {
        try {
          const context =
            options.authService!
              .authenticateAuthorization(
                req.get(
                  "authorization"
                )
              );
          res.locals.lexAuth =
            context;

          if (
            req.method !== "GET" &&
            req.path !==
              "/auth/lock"
          ) {
            options.authService!
              .touchSession(
                context.session
                  .sessionId
              );
          }
          next();
        } catch (error) {
          if (
            !sendAuthError(
              res,
              error
            )
          ) {
            res.status(401).json({
              error:
                "AUTHENTICATION_REQUIRED"
            });
          }
        }
      }
    );

    app.get(
      "/api/auth/me",
      (_req, res) => {
        res.json(
          responseAuthContext(res)
        );
      }
    );

    app.post(
      "/api/auth/lock",
      (_req, res) => {
        const context =
          responseAuthContext(res);
        options.authService!
          .lockSession(
            context.session
              .sessionId
          );
        res.status(204).end();
      }
    );

    app.post(
      "/api/auth/recovery-code",
      async (req, res) => {
        const password =
          typeof req.body?.password ===
            "string"
            ? req.body.password
            : "";
        try {
          res.status(201).json(
            await options
              .authService!
              .createRecoveryCode(
                responseAuthContext(
                  res
                ),
                { password }
              )
          );
        } catch (error) {
          if (
            !sendAuthError(
              res,
              error
            )
          ) {
            res.status(500).json({
              error:
                "RECOVERY_CODE_CREATE_FAILED"
            });
          }
        }
      }
    );

    app.post(
      "/api/auth/password",
      async (req, res) => {
        const currentPassword =
          typeof req.body
            ?.currentPassword ===
            "string"
            ? req.body
                .currentPassword
            : "";
        const newPassword =
          typeof req.body?.newPassword ===
            "string"
            ? req.body.newPassword
            : "";
        try {
          res.json(
            await options
              .authService!
              .changePassword(
                responseAuthContext(
                  res
                ),
                {
                  currentPassword,
                  newPassword
                }
              )
          );
        } catch (error) {
          if (
            !sendAuthError(
              res,
              error
            )
          ) {
            res.status(500).json({
              error:
                "PASSWORD_CHANGE_FAILED"
            });
          }
        }
      }
    );
  }

  app.get(
    "/api/admin/users",
    (_req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          users:
            options.authService
              .listUsers(
                responseAuthContext(
                  res
                )
              )
        });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/admin/users",
    async (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const loginName =
        typeof req.body?.loginName ===
          "string"
          ? req.body.loginName
          : "";
      const displayName =
        typeof req.body?.displayName ===
          "string"
          ? req.body.displayName
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";
      try {
        const user =
          await options.authService
            .createUser(
              responseAuthContext(res),
              {
                loginName,
                displayName,
                password
              }
            );
        res.status(201).json({
          user
        });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_CREATE_FAILED"
          });
        }
      }
    }
  );

  app.patch(
    "/api/admin/users/:userId/status",
    (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const userId =
        String(
          req.params.userId ?? ""
        ).trim();
      const status =
        req.body?.status ===
          "ACTIVE" ||
        req.body?.status ===
          "DISABLED"
          ? req.body.status
          : null;
      if (!status) {
        res.status(400).json({
          error:
            "INVALID_USER_REQUEST"
        });
        return;
      }
      try {
        const user =
          options.authService
            .setUserStatus(
              responseAuthContext(
                res
              ),
              userId,
              status
            );
        res.json({ user });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_STATUS_UPDATE_FAILED"
          });
        }
      }
    }
  );

  app.delete(
    "/api/admin/users/:userId",
    (req, res) => {
      if (!options.authService) {
        res.status(503).json({
          error:
            "AUTH_SERVICE_UNAVAILABLE"
        });
        return;
      }
      const userId =
        String(
          req.params.userId ?? ""
        ).trim();
      try {
        res.json(
          options.authService
            .deleteUser(
              responseAuthContext(
                res
              ),
              userId
            )
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "USER_DELETE_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/shared/templates",
    async (_req, res) => {
      if (
        !options.sharedTemplateStore
      ) {
        res.status(503).json({
          error:
            "SHARED_TEMPLATE_STORE_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          templates:
            await options
              .sharedTemplateStore
              .listTemplates()
        });
      } catch {
        res.status(500).json({
          error:
            "SHARED_TEMPLATE_LIST_FAILED"
        });
      }
    }
  );

  const sharedTemplateBody =
    express.raw({
      type: () => true,
      limit: "64mb"
    });

  app.post(
    "/api/shared/templates",
    sharedTemplateBody,
    async (req, res) => {
      if (
        !options.sharedTemplateStore
      ) {
        res.status(503).json({
          error:
            "SHARED_TEMPLATE_STORE_UNAVAILABLE"
        });
        return;
      }
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error:
            "TEMPLATE_BODY_REQUIRED"
        });
        return;
      }

      const mediaType =
        req.get("content-type")
          ?.split(";", 1)[0]
          ?.trim()
          .toLowerCase() ||
        "application/octet-stream";
      const filename =
        decodeUploadFilename(
          req.get("x-lex-filename")
        );

      try {
        const stored =
          await options
            .sharedTemplateStore
            .saveTemplate({
              filename,
              mediaType,
              data:
                new Uint8Array(
                  req.body
                ),
              createdByUserId:
                context.user.userId
            });
        res.status(201).json(
          stored
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "UNSUPPORTED_TEMPLATE_MEDIA_TYPE"
        ) {
          res.status(415).json({
            error:
              "UNSUPPORTED_TEMPLATE_MEDIA_TYPE"
          });
          return;
        }
        res.status(422).json({
          error:
            "SHARED_TEMPLATE_STORE_FAILED"
        });
      }
    }
  );

  app.get(
    "/api/firm-knowledge",
    (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const workspace =
          options.caseAccessService
            .getFirmKnowledgeWorkspace(
              responseAuthContext(
                res
              )
            );
        res.json({
          workspace
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "FIRM_KNOWLEDGE_STATUS_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/firm-knowledge",
    async (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const workspace =
          await options
            .caseAccessService
            .createFirmKnowledgeWorkspace(
              responseAuthContext(
                res
              )
            );
        res.status(201).json({
          workspace
        });
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          ) &&
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "FIRM_KNOWLEDGE_CREATE_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases",
    (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const cases =
          options.caseAccessService
            .listCases(
              responseAuthContext(res)
            );
        res.json({
          cases
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_LIST_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/legacy",
    async (_req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          cases:
            await options
              .caseAccessService
              .listLegacyCases(
                responseAuthContext(
                  res
                )
              )
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "LEGACY_CASE_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/import-legacy",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        const imported =
          await options
            .caseAccessService
            .importLegacyCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              )
            );
        res.status(201).json(
          imported
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "LEGACY_CASE_IMPORT_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId",
    (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          options.caseAccessService
            .openCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              )
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_OPEN_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases",
    async (req, res) => {
      if (!options.caseFileStore) {
        res.status(503).json({
          error:
            "CASE_STORAGE_UNAVAILABLE"
        });
        return;
      }

      const displayName =
        typeof req.body?.displayName ===
          "string"
          ? req.body.displayName
          : undefined;

      try {
        const created =
          options.caseAccessService
            ? await options
                .caseAccessService
                .createCase(
                  responseAuthContext(
                    res
                  ),
                  displayName
                )
            : await options
                .caseFileStore
                .createCase(
                  displayName
                );
        res.status(201).json(
          created
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_CREATE_FAILED"
          });
        }
      }
    }
  );

  app.patch(
    "/api/cases/:caseId",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const displayName =
        typeof req.body
          ?.displayName ===
          "string"
          ? req.body
              .displayName
          : "";
      try {
        res.json(
          await options
            .caseAccessService
            .renameCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              displayName
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_RENAME_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/archive",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .setCaseArchived(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              true
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ARCHIVE_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/unarchive",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .setCaseArchived(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              false
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_UNARCHIVE_FAILED"
          });
        }
      }
    }
  );

  app.delete(
    "/api/cases/:caseId",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";
      try {
        res.json(
          await options
            .caseAccessService
            .deleteCase(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              password
            )
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          ) &&
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_DELETE_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId/access-candidates",
    (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          users:
            options.caseAccessService
              .listAccessCandidates(
                responseAuthContext(
                  res
                ),
                String(
                  req.params.caseId ??
                    ""
                )
              )
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_CANDIDATES_FAILED"
          });
        }
      }
    }
  );

  app.get(
    "/api/cases/:caseId/access",
    (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json({
          access:
            options.caseAccessService
              .listAccess(
                responseAuthContext(
                  res
                ),
                String(
                  req.params.caseId ??
                  ""
                )
              )
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/access",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const role =
        typeof req.body?.role ===
          "string"
          ? req.body.role
          : "";
      if (
        ![
          "EDITOR",
          "ANALYST",
          "VIEWER"
        ].includes(role) ||
        typeof req.body
          ?.canReidentify !==
          "boolean" ||
        typeof req.body?.userId !==
          "string"
      ) {
        res.status(400).json({
          error:
            "INVALID_CASE_ACCESS_REQUEST"
        });
        return;
      }
      try {
        const granted =
          await options
            .caseAccessService
            .grantAccess(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              {
                userId:
                  req.body.userId,
                role:
                  role as Exclude<
                    CaseRole,
                    "OWNER"
                  >,
                canReidentify:
                  req.body
                    .canReidentify
              }
            );
        res.status(201).json(
          granted
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_GRANT_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/transfer-owner",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      const userId =
        typeof req.body?.userId ===
          "string"
          ? req.body.userId
          : "";
      const password =
        typeof req.body?.password ===
          "string"
          ? req.body.password
          : "";
      try {
        res.json(
          await options
            .caseAccessService
            .transferOwnership(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                  ""
              ),
              {
                userId,
                password
              }
            )
        );
      } catch (error) {
        if (
          !sendAuthError(
            res,
            error
          ) &&
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_OWNER_TRANSFER_FAILED"
          });
        }
      }
    }
  );

  app.delete(
    "/api/cases/:caseId/access/:userId",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .revokeAccess(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              ),
              String(
                req.params.userId ??
                ""
              )
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_ACCESS_REVOKE_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/rotate-key",
    async (req, res) => {
      if (
        !options.caseAccessService
      ) {
        res.status(503).json({
          error:
            "CASE_ACCESS_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .caseAccessService
            .rotateCaseKey(
              responseAuthContext(
                res
              ),
              String(
                req.params.caseId ??
                ""
              )
            )
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_KEY_ROTATE_FAILED"
          });
        }
      }
    }
  );

  const caseUploadBody = express.raw({
    type: () => true,
    limit: "512mb"
  });

  app.get(
    "/api/cases/:caseId/files",
    async (req, res) => {
      if (
        !options.caseFileStore ||
        !options.caseFileStore
          .listUploads
      ) {
        res.status(503).json({
          error:
            "CASE_STORAGE_UNAVAILABLE"
        });
        return;
      }
      const caseId =
        String(
          req.params.caseId ??
          ""
        ).trim();
      try {
        options.caseAccessService
          ?.assertAccess(
            responseAuthContext(
              res
            ),
            caseId,
            "READ"
          );
        let uploads:
          StoredUpload[];
        if (
          options
            .secureCaseUploadStore &&
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          uploads =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "READ",
                async (
                  caseDataKey
                ) =>
                  await options
                    .secureCaseUploadStore!
                    .listUploads({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    })
              );
        } else {
          uploads =
            await options
              .caseFileStore
              .listUploads!(
                caseId
              );
        }
        res.json({
          caseId,
          uploads
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error:
              "CASE_FILE_LIST_FAILED"
          });
        }
      }
    }
  );

  async function processStoredCaseFile(
    req: Request,
    res: Response,
    fileId?: string
  ): Promise<void> {
    if (
      !options.documentService ||
      !options.caseAccessService ||
      !options.secureCaseUploadStore
    ) {
      res.status(503).json({
        error:
          "STORED_FILE_PROCESSING_UNAVAILABLE"
      });
      return;
    }

    const caseId =
      String(
        req.params.caseId ?? ""
      ).trim();
    const uploadId =
      String(
        req.params.uploadId ?? ""
      ).trim();
    const memberId =
      fileId?.trim();

    if (
      !/^case_[a-f0-9]{32}$/
        .test(caseId) ||
      !/^upload_[a-f0-9]{32}$/
        .test(uploadId) ||
      (
        memberId !== undefined &&
        !/^file_[a-f0-9]{32}$/
          .test(memberId)
      )
    ) {
      res.status(400).json({
        error:
          "INVALID_STORED_FILE_REQUEST"
      });
      return;
    }

    try {
      const context =
        responseAuthContext(res);
      options.caseAccessService
        .assertAccess(
          context,
          caseId,
          "WRITE"
        );
      const caseView =
        options.caseAccessService
          .openCase(
            context,
            caseId
          );

      const result =
        await options
          .caseAccessService
          .withCaseDataKey(
            context,
            caseId,
            "WRITE",
            async (caseDataKey) => {
              let data: Buffer;
              let mediaType:
                SupportedDocumentMediaType;
              let sourceFileId:
                string | undefined;

              if (memberId) {
                const restored =
                  await options
                    .secureCaseUploadStore!
                    .readExtractedPayload({
                      caseId,
                      uploadId,
                      fileId:
                        memberId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion,
                      maxBytes:
                        512 *
                        1024 *
                        1024
                    });
                if (
                  !restored
                    .manifest
                    .processable
                ) {
                  restored.data.fill(0);
                  throw new Error(
                    "STORED_FILE_NOT_PROCESSABLE"
                  );
                }
                const resolved =
                  storedDocumentMediaType(
                    restored
                      .manifest
                      .mediaType
                  );
                if (!resolved) {
                  restored.data.fill(0);
                  throw new Error(
                    "STORED_FILE_MEDIA_UNSUPPORTED"
                  );
                }
                data =
                  restored.data;
                mediaType =
                  resolved;
                sourceFileId =
                  restored
                    .manifest
                    .fileId;
              } else {
                const uploads =
                  await options
                    .secureCaseUploadStore!
                    .listUploads({
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    });
                const upload =
                  uploads.find(
                    (item) =>
                      item.uploadId ===
                        uploadId
                  );
                if (!upload) {
                  throw new Error(
                    "STORED_UPLOAD_NOT_FOUND"
                  );
                }
                if (upload.archive) {
                  throw new Error(
                    "STORED_ARCHIVE_MEMBER_REQUIRED"
                  );
                }
                const resolved =
                  storedDocumentMediaType(
                    upload.mediaType
                  );
                if (!resolved) {
                  throw new Error(
                    "STORED_FILE_MEDIA_UNSUPPORTED"
                  );
                }
                data =
                  await options
                    .secureCaseUploadStore!
                    .readUploadPayload({
                      caseId,
                      uploadId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion,
                      maxBytes:
                        512 *
                        1024 *
                        1024
                    });
                const digest =
                  createHash(
                    "sha256"
                  )
                    .update(data)
                    .digest("hex");
                if (
                  data.byteLength !==
                    upload.bytes ||
                  digest !==
                    upload.sha256
                ) {
                  data.fill(0);
                  throw new Error(
                    "STORED_UPLOAD_INTEGRITY_FAILED"
                  );
                }
                mediaType =
                  resolved;
              }

              try {
                assertStoredDocumentSignature(
                  data,
                  mediaType
                );
                return await options
                  .documentService!
                  .review(
                    data,
                    mediaType,
                    {
                      caseId,
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    }
                  );
              } finally {
                data.fill(0);
              }
            }
          );

      documentCaseIds.set(
        result.documentId,
        caseId
      );
      res.status(201).json({
        ...result,
        caseId,
        uploadId,
        ...(memberId
          ? {
              fileId:
                memberId
            }
          : {})
      });
    } catch (error) {
      if (
        sendCaseAccessError(
          res,
          error
        )
      ) {
        return;
      }
      const code =
        error instanceof Error
          ? error.message
          : "";
      if (
        code ===
          "STORED_UPLOAD_NOT_FOUND" ||
        code ===
          "INVALID_FILE_ID" ||
        code ===
          "ENOENT"
      ) {
        res.status(404).json({
          error:
            "STORED_FILE_NOT_FOUND"
        });
        return;
      }
      if (
        code ===
          "STORED_FILE_MEDIA_UNSUPPORTED" ||
        code ===
          "STORED_FILE_NOT_PROCESSABLE" ||
        code ===
          "STORED_ARCHIVE_MEMBER_REQUIRED"
      ) {
        res.status(415).json({
          error: code
        });
        return;
      }
      if (
        code ===
          "STORED_DOCUMENT_SIGNATURE_MISMATCH" ||
        code ===
          "STORED_UPLOAD_INTEGRITY_FAILED" ||
        code ===
          "EXTRACTED_PAYLOAD_INTEGRITY_FAILED"
      ) {
        res.status(422).json({
          error:
            "STORED_FILE_VALIDATION_FAILED"
        });
        return;
      }
      res.status(422).json({
        error:
          "STORED_FILE_PROCESSING_FAILED"
      });
    }
  }

  app.post(
    "/api/cases/:caseId/files/:uploadId/process",
    async (req, res) => {
      await processStoredCaseFile(
        req,
        res
      );
    }
  );

  app.post(
    "/api/cases/:caseId/files/:uploadId/members/:fileId/process",
    async (req, res) => {
      await processStoredCaseFile(
        req,
        res,
        String(
          req.params.fileId ?? ""
        )
      );
    }
  );

  app.get(
    "/api/cases/:caseId/templates",
    async (req, res) => {
      if (
        !options.caseAccessService ||
        !options.sharedTemplateStore
      ) {
        res.status(503).json({
          error:
            "CASE_TEMPLATE_LIBRARY_UNAVAILABLE"
        });
        return;
      }
      const caseId =
        String(
          req.params.caseId ??
          ""
        ).trim();
      try {
        options.caseAccessService
          .assertAccess(
            responseAuthContext(
              res
            ),
            caseId,
            "READ"
          );
        res.json({
          caseId,
          scope: "FIRM_SHARED",
          templates:
            await options
              .sharedTemplateStore
              .listTemplates()
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(500).json({
            error:
              "CASE_TEMPLATE_LIST_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/cases/:caseId/files",
    caseUploadBody,
    async (req, res) => {
      if (!options.caseFileStore) {
        res.status(503).json({
          error:
            "CASE_STORAGE_UNAVAILABLE"
        });
        return;
      }
      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error:
            "FILE_BODY_REQUIRED"
        });
        return;
      }

      const caseId =
        String(req.params.caseId ?? "")
          .trim();
      const mediaType =
        req.get("content-type")
          ?.split(";", 1)[0]
          ?.trim()
          .toLowerCase() ||
        "application/octet-stream";
      const filename =
        decodeUploadFilename(
          req.get("x-lex-filename")
        );

      try {
        let stored:
          StoredUpload;
        if (
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          options.caseAccessService
            .assertAccess(
              context,
              caseId,
              "WRITE"
            );
          if (
            options
              .secureCaseUploadStore
          ) {
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          stored =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .secureCaseUploadStore!
                    .saveUpload({
                      caseId,
                      filename,
                      mediaType,
                      data:
                        new Uint8Array(
                          req.body
                        ),
                      caseDataKey,
                      keyVersion:
                        caseView.keyVersion
                    })
              );
          } else {
            stored =
              await options
                .caseFileStore
                .saveUpload({
                  caseId,
                  filename,
                  mediaType,
                  data:
                    new Uint8Array(
                      req.body
                    ),
                  extractArchive: true
                });
          }
        } else {
          stored =
            await options
              .caseFileStore
              .saveUpload({
                caseId,
                filename,
                mediaType,
                data:
                  new Uint8Array(
                    req.body
                  ),
                extractArchive: true
              });
        }
        res.status(201).json(
          stored
        );
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error:
              "CASE_FILE_STORE_FAILED"
          });
        }
      }
    }
  );

  app.get("/api/skills", (_req, res) => {
    const skills = [...options.registry.skills.values()]
      .map((skill) =>
        publicSkill({
          name: skill.name,
          frontmatter: skill.frontmatter
        })
      )
      .sort((a, b) =>
        String(a.name).localeCompare(String(b.name), "pl")
      );

    res.json({
      count: skills.length,
      skills
    });
  });

  app.get("/api/routes", (_req, res) => {
    res.json({
      jurisdiction: "PL",
      primarySkills: routing.listDrSkills()
    });
  });

  app.post("/api/routes/validate", (req, res) => {
    const primarySkill =
      typeof req.body?.primarySkill === "string"
        ? req.body.primarySkill.trim()
        : "";

    if (!primarySkill) {
      res.status(400).json({
        error: "PRIMARY_SKILL_REQUIRED"
      });
      return;
    }

    const result = routing.validate(primarySkill);
    res.status(result.valid ? 200 : 422).json(result);
  });

  app.put(
    "/api/admin/providers/:provider/credential",
    (req, res) => {
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (!options.credentialManager) {
        res.status(503).json({
          error:
            "PROVIDER_CREDENTIAL_MANAGER_UNAVAILABLE"
        });
        return;
      }
      const provider =
        String(
          req.params.provider ?? ""
        ).trim();
      if (!isProviderId(provider)) {
        res.status(404).json({
          error:
            "UNKNOWN_PROVIDER"
        });
        return;
      }
      const apiKey =
        typeof req.body?.apiKey ===
          "string"
          ? req.body.apiKey
          : "";
      try {
        options.credentialManager
          .setApiKey(
            provider,
            apiKey
          );
        res.json({
          provider,
          configured: true,
          storage:
            "PROCESS_MEMORY"
        });
      } catch {
        res.status(400).json({
          error:
            "INVALID_PROVIDER_API_KEY"
        });
      }
    }
  );

  app.delete(
    "/api/admin/providers/:provider/credential",
    (req, res) => {
      const context =
        responseAuthContext(res);
      if (
        context.user.appRole !==
          "ADMIN"
      ) {
        res.status(403).json({
          error:
            "AUTHORIZATION_DENIED"
        });
        return;
      }
      if (!options.credentialManager) {
        res.status(503).json({
          error:
            "PROVIDER_CREDENTIAL_MANAGER_UNAVAILABLE"
        });
        return;
      }
      const provider =
        String(
          req.params.provider ?? ""
        ).trim();
      if (!isProviderId(provider)) {
        res.status(404).json({
          error:
            "UNKNOWN_PROVIDER"
        });
        return;
      }
      options.credentialManager
        .clearApiKey(provider);
      res.json({
        provider,
        cleared: true,
        storage:
          "PROCESS_MEMORY"
      });
    }
  );

  app.get(
    "/api/update/status",
    async (_req, res) => {
      if (!options.updateDiscovery) {
        res.status(503).json({
          error:
            "UPDATE_DISCOVERY_UNAVAILABLE"
        });
        return;
      }
      try {
        res.json(
          await options
            .updateDiscovery
            .check()
        );
      } catch {
        res.status(503).json({
          error:
            "UPDATE_DISCOVERY_UNAVAILABLE"
        });
      }
    }
  );

  app.get("/api/providers", async (_req, res) => {
    if (!options.credentialResolver) {
      res.status(503).json({
        error:
          "PROVIDER_CONFIGURATION_STATUS_UNAVAILABLE"
      });
      return;
    }

    const providers =
      await providerConfigurationStatus(
        options.credentialResolver
      );

    res.json({
      providers
    });
  });

  app.get("/api/models/:provider", async (req, res) => {
    const provider = String(req.params.provider ?? "");
    if (!isProviderId(provider)) {
      res.status(404).json({
        error: "UNKNOWN_PROVIDER"
      });
      return;
    }

    try {
      const models = await options.modelCatalog.list(provider);
      res.json({
        provider,
        models: sanitizeModels(models)
      });
    } catch (error) {
      if (error instanceof MissingProviderCredentialError) {
        res.status(503).json({
          error: "PROVIDER_NOT_CONFIGURED",
          provider
        });
        return;
      }

      res.status(502).json({
        error: "PROVIDER_MODEL_DISCOVERY_FAILED",
        provider
      });
    }
  });

  const documentBody = express.raw({
    type: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/tiff"
    ],
    limit: "512mb"
  });

  app.post(
    "/api/documents/ingest",
    documentBody,
    async (req, res) => {
      if (!options.documentService) {
        res.status(503).json({
          error: "DOCUMENT_INGESTION_UNAVAILABLE"
        });
        return;
      }

      const mediaType =
        requestDocumentMediaType(req);
      if (!mediaType) {
        res.status(415).json({
          error: "UNSUPPORTED_DOCUMENT_MEDIA_TYPE"
        });
        return;
      }

      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error: "DOCUMENT_BODY_REQUIRED"
        });
        return;
      }

      try {
        const data = new Uint8Array(req.body);
        let stored:
          StoredUpload | undefined;
        let caseId:
          string | undefined;

        if (options.caseFileStore) {
          caseId =
            req.get("x-lex-case-id")
              ?.trim();
          if (!caseId) {
            res.status(400).json({
              error: "CASE_ID_REQUIRED"
            });
            return;
          }
          const filename =
            decodeUploadFilename(
              req.get(
                "x-lex-filename"
              )
            );
          if (
            options.caseAccessService
          ) {
            const context =
              responseAuthContext(
                res
              );
            options.caseAccessService
              .assertAccess(
                context,
                caseId,
                "WRITE"
              );
            if (
              options
                .secureCaseUploadStore
            ) {
            const securedCaseId =
              caseId;
            const caseView =
              options.caseAccessService
                .openCase(
                  context,
                  securedCaseId
                );
            stored =
              await options
                .caseAccessService
                .withCaseDataKey(
                  context,
                  securedCaseId,
                  "WRITE",
                  async (
                    caseDataKey
                  ) =>
                    await options
                      .secureCaseUploadStore!
                      .saveUpload({
                        caseId:
                          securedCaseId,
                        filename,
                        mediaType,
                        data,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion
                      })
                );
            } else {
              stored =
                await options
                  .caseFileStore
                  .saveUpload({
                    caseId,
                    filename,
                    mediaType,
                    data,
                    extractArchive:
                      false
                  });
            }
          } else {
            stored =
              await options
                .caseFileStore
                .saveUpload({
                  caseId,
                  filename,
                  mediaType,
                  data,
                  extractArchive:
                    false
                });
          }
        }

        let result;
        if (
          caseId &&
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          result =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  mediaType ===
                    "application/pdf"
                    ? await options
                        .documentService!
                        .ingestPdf(
                          data,
                          {
                            caseId,
                            caseDataKey,
                            keyVersion:
                              caseView.keyVersion
                          }
                        )
                    : await options
                        .documentService!
                        .ingestImage(
                          data,
                          mediaType,
                          {
                            caseId,
                            caseDataKey,
                            keyVersion:
                              caseView.keyVersion
                          }
                        )
              );
        } else {
          result =
            mediaType ===
              "application/pdf"
              ? await options
                  .documentService
                  .ingestPdf(
                    data
                  )
              : await options
                  .documentService
                  .ingestImage(
                    data,
                    mediaType
                  );
        }
        if (stored) {
          documentCaseIds.set(
            result.documentId,
            stored.caseId
          );
        }
        res.status(201).json({
          ...result,
          ...(stored
            ? {
                caseId: stored.caseId,
                uploadId: stored.uploadId
              }
            : {})
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error: "DOCUMENT_INGESTION_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/documents/review",
    documentBody,
    async (req, res) => {
      if (!options.documentService) {
        res.status(503).json({
          error: "DOCUMENT_INGESTION_UNAVAILABLE"
        });
        return;
      }

      const mediaType =
        requestDocumentMediaType(req);
      if (!mediaType) {
        res.status(415).json({
          error: "UNSUPPORTED_DOCUMENT_MEDIA_TYPE"
        });
        return;
      }
      if (
        !Buffer.isBuffer(req.body) ||
        req.body.byteLength === 0
      ) {
        res.status(400).json({
          error: "DOCUMENT_BODY_REQUIRED"
        });
        return;
      }

      try {
        const data =
          new Uint8Array(req.body);
        let stored:
          StoredUpload | undefined;
        let caseId:
          string | undefined;

        if (options.caseFileStore) {
          caseId =
            req.get("x-lex-case-id")
              ?.trim();
          if (!caseId) {
            res.status(400).json({
              error: "CASE_ID_REQUIRED"
            });
            return;
          }
          const filename =
            decodeUploadFilename(
              req.get(
                "x-lex-filename"
              )
            );
          if (
            options.caseAccessService
          ) {
            const context =
              responseAuthContext(
                res
              );
            options.caseAccessService
              .assertAccess(
                context,
                caseId,
                "WRITE"
              );
            if (
              options
                .secureCaseUploadStore
            ) {
            const securedCaseId =
              caseId;
            const caseView =
              options.caseAccessService
                .openCase(
                  context,
                  securedCaseId
                );
            stored =
              await options
                .caseAccessService
                .withCaseDataKey(
                  context,
                  securedCaseId,
                  "WRITE",
                  async (
                    caseDataKey
                  ) =>
                    await options
                      .secureCaseUploadStore!
                      .saveUpload({
                        caseId:
                          securedCaseId,
                        filename,
                        mediaType,
                        data,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion
                      })
                );
            } else {
              stored =
                await options
                  .caseFileStore
                  .saveUpload({
                    caseId,
                    filename,
                    mediaType,
                    data,
                    extractArchive:
                      false
                  });
            }
          } else {
            stored =
              await options
                .caseFileStore
                .saveUpload({
                  caseId,
                  filename,
                  mediaType,
                  data,
                  extractArchive:
                    false
                });
          }
        }

        let result:
          Awaited<
            ReturnType<
              NonNullable<
                LexHttpAppOptions[
                  "documentService"
                ]
              >["review"]
            >
          >;
        if (
          caseId &&
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          result =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .documentService!
                    .review(
                      data,
                      mediaType,
                      {
                        caseId,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion
                      }
                    )
              );
        } else {
          result =
            await options
              .documentService
              .review(
                data,
                mediaType,
                caseId
                  ? { caseId }
                  : undefined
              );
        }
        if (stored) {
          documentCaseIds.set(
            result.documentId,
            stored.caseId
          );
        }
        res.status(201).json({
          ...result,
          ...(stored
            ? {
                caseId: stored.caseId,
                uploadId: stored.uploadId
              }
            : {})
        });
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error: "DOCUMENT_REVIEW_FAILED"
          });
        }
      }
    }
  );

  app.post(
    "/api/documents/:documentId/finalize",
    async (req, res) => {
      if (!options.documentService) {
        res.status(503).json({
          error: "DOCUMENT_INGESTION_UNAVAILABLE"
        });
        return;
      }

      const documentId =
        String(req.params.documentId ?? "")
          .trim();
      const requestedCaseId =
        typeof req.body?.caseId ===
          "string"
          ? req.body.caseId.trim()
          : "";
      const directives =
        parsePrivacyDirectives(
          req.body?.directives
        );
      if (
        !/^doc_[a-f0-9]{24}$/.test(
          documentId
        ) ||
        (
          requestedCaseId &&
          !/^case_[a-f0-9]{32}$/.test(
            requestedCaseId
          )
        ) ||
        directives === null
      ) {
        res.status(400).json({
          error: "INVALID_DOCUMENT_PRIVACY_REQUEST"
        });
        return;
      }

      try {
        let result;
        if (
          options.caseAccessService
        ) {
          const caseId =
            requestedCaseId ||
            documentCaseIds.get(
              documentId
            );
          if (!caseId) {
            throw new CaseAccessError(
              "CASE_ACCESS_DENIED",
              403
            );
          }
          const context =
            responseAuthContext(
              res
            );
          const caseView =
            options.caseAccessService
              .openCase(
                context,
                caseId
              );
          result =
            await options
              .caseAccessService
              .withCaseDataKey(
                context,
                caseId,
                "WRITE",
                async (
                  caseDataKey
                ) =>
                  await options
                    .documentService!
                    .finalizeReview(
                      documentId,
                      directives,
                      {
                        caseId,
                        caseDataKey,
                        keyVersion:
                          caseView.keyVersion
                      }
                    )
              );
        } else {
          result =
            await options
              .documentService
              .finalizeReview(
                documentId,
                directives
              );
        }
        res.json(result);
      } catch (error) {
        if (
          !sendCaseAccessError(
            res,
            error
          )
        ) {
          res.status(422).json({
            error: "DOCUMENT_PRIVACY_FINALIZATION_FAILED"
          });
        }
      }
    }
  );

  app.post("/api/sessions/execute", async (req, res) => {
    if (!options.sessionExecutor) {
      res.status(503).json({
        error: "SESSION_EXECUTION_UNAVAILABLE"
      });
      return;
    }

    const request = parseSessionRequest(req.body);
    const attachments =
      parseDocumentAttachments(
        req.body?.attachments
      );
    if (!request || attachments === null) {
      res.status(400).json({
        error: "INVALID_SESSION_REQUEST"
      });
      return;
    }

    const route = routing.validate(request.primarySkill);
    if (!route.valid) {
      res.status(422).json({
        error: "INVALID_ROUTE",
        reason: route.reason
      });
      return;
    }

    try {
      if (attachments.length > 0) {
        if (!options.documentService) {
          res.status(503).json({
            error:
              "DOCUMENT_ATTACHMENT_SERVICE_UNAVAILABLE"
          });
          return;
        }

        const resolved:
          ResolvedDocumentAttachment[] = [];
        if (
          options.caseAccessService
        ) {
          const context =
            responseAuthContext(res);
          for (
            const selection
            of attachments
          ) {
            const caseId =
              selection.caseId ||
              documentCaseIds.get(
                selection.documentId
              );
            if (!caseId) {
              throw new CaseAccessError(
                "CASE_ACCESS_DENIED",
                403
              );
            }
            options.caseAccessService
              .assertAccess(
                context,
                caseId,
                "ANALYZE"
              );

            if (
              options
                .documentService
                .restoreDocument
            ) {
              const caseView =
                options.caseAccessService
                  .openCase(
                    context,
                    caseId
                  );
              await options
                .caseAccessService
                .withCaseDataKey(
                  context,
                  caseId,
                  "ANALYZE",
                  async (
                    caseDataKey
                  ) =>
                    await options
                      .documentService!
                      .restoreDocument!({
                        caseId,
                        documentId:
                          selection
                            .documentId,
                        caseDataKey,
                        keyVersion:
                          caseView
                            .keyVersion
                      })
                );
            }

            resolved.push(
              await options
                .documentService!
                .resolveProtectedChunks({
                  documentId:
                    selection
                      .documentId,
                  chunkIndices:
                    selection
                      .chunkIndices
                })
            );
          }
        } else {
          resolved.push(
            ...await Promise.all(
              attachments.map(
                (selection) =>
                  options
                    .documentService!
                    .resolveProtectedChunks({
                      documentId:
                        selection
                          .documentId,
                      chunkIndices:
                        selection
                          .chunkIndices
                    })
              )
            )
          );
        }
        request.documentAttachments =
          resolved.map((attachment) => ({
            documentId:
              attachment.documentId,
            chunks:
              attachment.chunks.map(
                (chunk) => ({ ...chunk })
              )
          }));
      }

      const result = await options.sessionExecutor.execute(request);
      res.json(result);
    } catch (error) {
      if (
        sendCaseAccessError(
          res,
          error
        )
      ) {
        return;
      }

      if (error instanceof MissingProviderCredentialError) {
        res.status(503).json({
          error: "PROVIDER_NOT_CONFIGURED",
          provider: error.provider
        });
        return;
      }

      if (
        error instanceof Error &&
        [
          "UNKNOWN_LOCAL_DOCUMENT",
          "DOCUMENT_NOT_FINALIZED",
          "INVALID_DOCUMENT_CHUNK_SELECTION",
          "UNKNOWN_DOCUMENT_CHUNK",
          "DOCUMENT_ATTACHMENT_CONTEXT_TOO_LARGE",
          "TOO_MANY_DOCUMENT_ATTACHMENTS"
        ].includes(error.message)
      ) {
        res.status(422).json({
          error:
            "DOCUMENT_ATTACHMENT_RESOLUTION_FAILED"
        });
        return;
      }

      if (error instanceof ProviderGatewayError) {
        res.status(502).json({
          error: "PROVIDER_EXECUTION_FAILED",
          provider: error.provider
        });
        return;
      }

      res.status(500).json({
        error: "SESSION_EXECUTION_FAILED"
      });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({
      error: "NOT_FOUND"
    });
  });

  return app;
}
