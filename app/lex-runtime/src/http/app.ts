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
  MissingProviderCredentialError
} from "../providers/credentials.js";
import type { ProviderId } from "../providers/types.js";
import { RoutingCatalog } from "./routing-catalog.js";

const PROVIDERS = new Set<ProviderId>([
  "openai",
  "anthropic",
  "xai"
]);

function isProviderId(value: string): value is ProviderId {
  return PROVIDERS.has(value as ProviderId);
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

  app.use((_req, res) => {
    res.status(404).json({
      error: "NOT_FOUND"
    });
  });

  return app;
}
