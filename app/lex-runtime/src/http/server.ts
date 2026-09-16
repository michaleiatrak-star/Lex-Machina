import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLexHttpApp } from "./app.js";
import { registerLegacyMigrationRoutes } from "./legacy-migration-routes.js";
import { LexSkillRegistry } from "../registry.js";
import { DynamicModelCatalog } from "../providers/model-catalog.js";
import { EnvironmentCredentialResolver } from "../providers/credentials.js";
import { createLiveProviderRegistry } from "../providers/ai-sdk-adapter.js";
import { ProviderGateway } from "../providers/gateway.js";
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
  SecureCaseArtifactStore
} from "../case-artifact-store.js";
import {
  LegacyCaseStorageMigrator
} from "../legacy-case-migration.js";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4317;

export function assertLoopbackHost(host: string): void {
  if (!["127.0.0.1", "localhost", "::1"].includes(host)) {
    throw new Error(
      "Lex Machina local server refuses non-loopback bind addresses."
    );
  }
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
      secureCaseArtifactStore
    );
  await secureCaseUploadStore
    .cleanupOrphanedWorkdirs();

  const authService =
    new LocalAuthService(
      authStore
    );
  const caseAccessService =
    new LocalCaseAccessService(
      authStore,
      authService,
      caseFileStore,
      caseSecurityRotation
    );

  const credentials = new EnvironmentCredentialResolver();
  const providerRegistry = createLiveProviderRegistry(credentials);
  const providerGateway = new ProviderGateway(providerRegistry);

  const legalSourceVerifier =
    new OfficialLegalSourceVerifier(
      undefined,
      undefined,
      new LocalPdfTextExtractor()
    );

  const app = createLexHttpApp({
    registry,
    modelCatalog: new DynamicModelCatalog(credentials),
    credentialResolver: credentials,
    caseFileStore,
    secureCaseUploadStore,
    sharedTemplateStore,
    authService,
    caseAccessService,
    documentService: new LocalPrivateDocumentService(
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
      secureCaseDocumentStore
    ),
    sessionExecutor: new SafeSessionExecutor(
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
    )
  });

  registerLegacyMigrationRoutes(
    app,
    {
      authService,
      caseAccessService,
      migrator:
        legacyCaseStorageMigrator
    }
  );

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
              authService.close();
              if (error) closeReject(error);
              else closeResolve();
            });
          })
      });
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = await startLocalServer();
  process.stdout.write(
    `Lex Machina runtime listening on http://${server.host}:${server.port}\n`
  );
}
