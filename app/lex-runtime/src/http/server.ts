import { timingSafeEqual } from "node:crypto";
import express, {
  type NextFunction,
  type Request,
  type Response
} from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLexHttpApp } from "./app.js";
import { registerLegacyMigrationRoutes } from "./legacy-migration-routes.js";
import { registerWorkspaceRoutes } from "./workspace-routes.js";
import { LexSkillRegistry } from "../registry.js";
import { DynamicModelCatalog } from "../providers/model-catalog.js";
import {
  EnvironmentCredentialResolver,
  MemoryOverlayCredentialResolver
} from "../providers/credentials.js";
import { createLiveProviderRegistry } from "../providers/ai-sdk-adapter.js";
import { ProviderGateway } from "../providers/gateway.js";
import {
  GitHubReleaseUpdateDiscovery
} from "../update-discovery.js";
import { SafeSessionExecutor } from "../session-executor.js";
import { LegalVerificationToolRuntime } from "../verification-tool-runtime.js";
import { TemporalSourceFreshnessChecker } from "../temporal-source-freshness.js";
import { OfficialLegalSourceVerifier } from "../legal-source-verifier.js";
import { LocalPdfTextExtractor } from "../pdf-text-extractor.js";
import { CompleteDocumentIngestor } from "../document-ingestion.js";
import { PdfJsDocumentPageSource } from "../pdf-document-page-source.js";
import { LocalPaddleOcrEngine } from "../ocr/paddle-ocr-engine.js";
import { LocalPaddleImageOcrEngine } from "../ocr/paddle-image-ocr-engine.js";
import { CompleteImageIngestor } from "../image-ingestion.js";
import { LocalStanzaNamedEntityRecognizer } from "../privacy/stanza-ner.js";
import { LocalPrivateDocumentService } from "../document-service.js";
import { LocalCaseFileStore } from "../case-file-store.js";
import { LocalAuthStore } from "../auth/store.js";
import { LocalAuthService } from "../auth/service.js";
import {
  LocalCaseAccessService
} from "../case-access.js";
import {
  LocalSharedTemplateStore
} from "../shared-template-store.js";
import {
  LocalTemplateProfileService
} from "../template-profile-service.js";
import {
  EncryptedPrivacyVaultStore
} from "../privacy/vault-store.js";
import {
  SecureCaseUploadStore
} from "../case-secure-store.js";
import {
  CaseSecurityRotationCoordinator
} from "../case-security-rotation.js";
import {
  SecureCaseDocumentStore
} from "../case-document-store.js";
import {
  LocalCaseKnowledgeSearch
} from "../case-knowledge-search.js";
import {
  SecureCaseArtifactStore
} from "../case-artifact-store.js";
import {
  EncryptedCaseWorkspaceStore
} from "../case-workspace-store.js";
import {
  LegacyCaseStorageMigrator
} from "../legacy-case-migration.js";
import {
  LocalOfficeDocumentTextExtractor
} from "../office-document-extractor.js";
import {
  LocalSpreadsheetTextExtractor
} from "../spreadsheet-extractor.js";
import {
  DocumentGenerationStateStore
} from "../document-generation-state.js";
import {
  LocalDocumentAuthoringService
} from "../document-authoring-service.js";
import {
  DeanonymizationReauthorizationManager
} from "../auth/reauthorization.js";
import {
  SensitiveDownloadTicketManager
} from "../sensitive-download-ticket.js";
import {
  LegalDocumentAstGenerator
} from "../legal-document-ast-generator.js";
import {
  LocalSupportService
} from "../support-service.js";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4317;

export function assertLoopbackHost(host: string): void {
  if (!["127.0.0.1", "localhost", "::1"].includes(host)) {
    throw new Error(
      "Lex Machina local server refuses non-loopback bind addresses."
    );
  }
}

function isLoopbackOrigin(
  origin: string
): boolean {
  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" ||
        url.protocol === "https:") &&
      [
        "localhost",
        "127.0.0.1",
        "::1",
        "[::1]"
      ].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

function desktopBootstrapGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const expected =
    process.env
      .LEX_DESKTOP_BOOTSTRAP_TOKEN
      ?.trim();
  if (!expected) {
    next();
    return;
  }

  const provided =
    req.get(
      "x-lex-desktop-bootstrap"
    )?.trim() ?? "";
  const expectedBytes =
    Buffer.from(
      expected,
      "utf8"
    );
  const providedBytes =
    Buffer.from(
      provided,
      "utf8"
    );
  const accepted =
    expectedBytes.length ===
      providedBytes.length &&
    expectedBytes.length >
      0 &&
    timingSafeEqual(
      expectedBytes,
      providedBytes
    );
  expectedBytes.fill(0);
  providedBytes.fill(0);

  if (!accepted) {
    res.status(401).json({
      error:
        "DESKTOP_BOOTSTRAP_REQUIRED"
    });
    return;
  }
  next();
}

function loopbackOriginGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.get("origin");
  if (
    !origin ||
    isLoopbackOrigin(origin)
  ) {
    next();
    return;
  }
  res.status(403).json({
    error: "ORIGIN_NOT_ALLOWED"
  });
}

export function resolveRuntimeRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(here, "../../../..");
  return path.resolve(
    process.env.LEX_SKILLS_PATH ??
      path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
  );
}

export async function startLocalServer(options?: {
  host?: string;
  port?: number;
}): Promise<{
  host: string;
  port: number;
  close(): Promise<void>;
}> {
  const host = options?.host ?? process.env.LEX_HOST ?? DEFAULT_HOST;
  const rawPort = options?.port ?? Number(process.env.LEX_PORT ?? DEFAULT_PORT);
  const port = Number.isInteger(rawPort) && rawPort >= 0 && rawPort <= 65535
    ? rawPort
    : DEFAULT_PORT;

  assertLoopbackHost(host);

  const registry = new LexSkillRegistry(resolveRuntimeRoot());
  const issues = [...registry.scan(), ...registry.validateDeclarations()];
  if (issues.length > 0) {
    throw new Error(
      `Lex corpus validation failed before HTTP startup: ${issues.length} issue(s).`
    );
  }

  const caseFileStore =
    new LocalCaseFileStore();
  const authStore =
    new LocalAuthStore({
      rootDir:
        caseFileStore.rootDir
    });
  const sharedTemplateStore =
    new LocalSharedTemplateStore({
      rootDir:
        caseFileStore.rootDir
    });
  const templateProfileService =
    new LocalTemplateProfileService(
      sharedTemplateStore
    );
  const privacyVaultStore =
    new EncryptedPrivacyVaultStore({
      rootDir:
        caseFileStore.rootDir
    });
  const secureCaseUploadStore =
    new SecureCaseUploadStore({
      rootDir:
        caseFileStore.rootDir
    });
  const secureCaseDocumentStore =
    new SecureCaseDocumentStore({
      rootDir:
        caseFileStore.rootDir
    });
  const secureCaseArtifactStore =
    new SecureCaseArtifactStore({
      rootDir:
        caseFileStore.rootDir
    });
  const workspaceStore =
    new EncryptedCaseWorkspaceStore({
      rootDir:
        caseFileStore.rootDir
    });
  const documentGenerationState =
    new DocumentGenerationStateStore({
      rootDir:
        caseFileStore.rootDir
    });
  const caseKnowledgeSearch =
    new LocalCaseKnowledgeSearch(
      secureCaseDocumentStore
    );
  const legacyCaseStorageMigrator =
    new LegacyCaseStorageMigrator(
      secureCaseUploadStore,
      {
        rootDir:
          caseFileStore.rootDir
      }
    );
  const caseSecurityRotation =
    new CaseSecurityRotationCoordinator(
      privacyVaultStore,
      secureCaseUploadStore,
      secureCaseDocumentStore,
      secureCaseArtifactStore,
      workspaceStore
    );
  await secureCaseUploadStore
    .cleanupOrphanedWorkdirs();

  const authService =
    new LocalAuthService(
      authStore
    );
  const supportService =
    new LocalSupportService({
      installationId:
        process.env
          .LEX_SUPPORT_INSTALLATION_ID,
      challengePublicKey:
        process.env
          .LEX_SUPPORT_CHALLENGE_PUBLIC_KEY,
      vendorPublicKeyPem:
        process.env
          .LEX_SUPPORT_VENDOR_PUBLIC_KEY_PEM,
      vendorKeyId:
        process.env
          .LEX_SUPPORT_VENDOR_KEY_ID,
      securityEvents:
        authStore
    });
  const caseAccessService =
    new LocalCaseAccessService(
      authStore,
      authService,
      caseFileStore,
      caseSecurityRotation
    );
  const documentAuthoringService =
    new LocalDocumentAuthoringService(
      privacyVaultStore,
      secureCaseArtifactStore,
      documentGenerationState
    );
  const reauthorizationManager =
    new DeanonymizationReauthorizationManager(
      authService,
      caseAccessService,
      authStore,
      documentGenerationState
    );
  const sensitiveDownloadTickets =
    new SensitiveDownloadTicketManager(
      authService
    );

  const credentials =
    new MemoryOverlayCredentialResolver(
      new EnvironmentCredentialResolver()
    );
  const providerRegistry = createLiveProviderRegistry(credentials);
  const providerGateway = new ProviderGateway(providerRegistry);

  const legalSourceVerifier =
    new OfficialLegalSourceVerifier(
      undefined,
      undefined,
      new LocalPdfTextExtractor()
    );

  const sessionExecutor =
    new SafeSessionExecutor(
      registry,
      providerGateway,
      undefined,
      (ledger) =>
        new LegalVerificationToolRuntime(
          ledger,
          legalSourceVerifier,
          undefined,
          new TemporalSourceFreshnessChecker()
        )
    );
  const documentAstGenerator =
    new LegalDocumentAstGenerator(
      sessionExecutor
    );
  const documentService =
    new LocalPrivateDocumentService(
      new CompleteDocumentIngestor(
        new PdfJsDocumentPageSource(),
        new LocalPaddleOcrEngine()
      ),
      new LocalStanzaNamedEntityRecognizer(),
      24_000,
      new CompleteImageIngestor(
        new LocalPaddleImageOcrEngine()
      ),
      privacyVaultStore,
      secureCaseDocumentStore,
      new LocalOfficeDocumentTextExtractor(),
      new LocalSpreadsheetTextExtractor()
    );

  const coreApp = createLexHttpApp({
    registry,
    modelCatalog: new DynamicModelCatalog(credentials),
    credentialResolver: credentials,
    credentialManager: credentials,
    updateDiscovery:
      new GitHubReleaseUpdateDiscovery(),
    caseFileStore,
    secureCaseUploadStore,
    sharedTemplateStore,
    templateProfileService,
    authService,
    supportService,
    caseAccessService,
    caseKnowledgeSearch,
    documentAuthoringService,
    documentAstGenerator,
    reauthorizationManager,
    sensitiveDownloadTickets,
    secureCaseArtifactStore,
    documentService,
    sessionExecutor
  });

  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(desktopBootstrapGuard);
  app.use(loopbackOriginGuard);
  app.use(express.json({ limit: "2mb" }));
  registerLegacyMigrationRoutes(
    app,
    {
      authService,
      securityEvents: authStore,
      caseAccessService,
      migrator:
        legacyCaseStorageMigrator
    }
  );
  registerWorkspaceRoutes(
    app,
    {
      authService,
      caseAccessService,
      uploads:
        secureCaseUploadStore,
      templates:
        sharedTemplateStore,
      privacyVaults:
        privacyVaultStore,
      documentService,
      workspace:
        workspaceStore,
      rootDir:
        caseFileStore.rootDir
    }
  );
  app.use(coreApp);

  return new Promise((resolve, reject) => {
    const server = app.listen(port, host);
    server.once("error", reject);
    server.once("listening", () => {
      const address = server.address();
      const actualPort =
        typeof address === "object" && address
          ? address.port
          : port;

      resolve({
        host,
        port: actualPort,
        close: () =>
          new Promise<void>((closeResolve, closeReject) => {
            server.close((error) => {
              credentials.close();
              supportService.close();
              authService.close();
              if (error) closeReject(error);
              else closeResolve();
            });
          })
      });
    });
  });
}

if (
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) ===
    path.resolve(process.argv[1])
) {
  const server = await startLocalServer();
  process.stdout.write(
    `Lex Machina runtime listening on http://${server.host}:${server.port}\n`
  );
}
