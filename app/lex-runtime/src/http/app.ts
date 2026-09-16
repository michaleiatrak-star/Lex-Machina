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
  type ProviderCredentialResolver
} from "../providers/credentials.js";
import {
  ProviderGatewayError
} from "../providers/gateway.js";
import type { ProviderId } from "../providers/types.js";
import type {
  SessionExecutor,
  SessionExecutionRequest
} from "../session-executor.js";
import type {
  DocumentService,
  PagePrivacyDirective,
  SupportedDocumentMediaType
} from "../document-service.js";
import { RoutingCatalog } from "./routing-catalog.js";

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

    directives.push({
      page: Number(record.page),
      start: Number(record.start),
      end: Number(record.end),
      action: action as PagePrivacyDirective["action"],
      ...(typeof record.kind === "string"
        ? {
            kind:
              record.kind as PagePrivacyDirective["kind"]
          }
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
  sessionExecutor?: SessionExecutor;
  documentService?: DocumentService;
};

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
        const result =
          mediaType === "application/pdf"
            ? await options.documentService.ingestPdf(
                data
              )
            : await options.documentService.ingestImage(
                data,
                mediaType
              );
        res.status(201).json(result);
      } catch {
        res.status(422).json({
          error: "DOCUMENT_INGESTION_FAILED"
        });
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
        const result =
          await options.documentService.review(
            new Uint8Array(req.body),
            mediaType
          );
        res.status(201).json(result);
      } catch {
        res.status(422).json({
          error: "DOCUMENT_REVIEW_FAILED"
        });
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
      const directives =
        parsePrivacyDirectives(
          req.body?.directives
        );
      if (
        !/^doc_[a-f0-9]{24}$/.test(
          documentId
        ) ||
        directives === null
      ) {
        res.status(400).json({
          error: "INVALID_DOCUMENT_PRIVACY_REQUEST"
        });
        return;
      }

      try {
        const result =
          await options.documentService.finalizeReview(
            documentId,
            directives
          );
        res.json(result);
      } catch {
        res.status(422).json({
          error: "DOCUMENT_PRIVACY_FINALIZATION_FAILED"
        });
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
    if (!request) {
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
      const result = await options.sessionExecutor.execute(request);
      res.json(result);
    } catch (error) {
      if (error instanceof MissingProviderCredentialError) {
        res.status(503).json({
          error: "PROVIDER_NOT_CONFIGURED",
          provider: error.provider
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
