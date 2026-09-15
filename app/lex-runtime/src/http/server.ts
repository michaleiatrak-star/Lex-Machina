import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLexHttpApp } from "./app.js";
import { LexSkillRegistry } from "../registry.js";
import { DynamicModelCatalog } from "../providers/model-catalog.js";
import { EnvironmentCredentialResolver } from "../providers/credentials.js";

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

  const app = createLexHttpApp({
    registry,
    modelCatalog: new DynamicModelCatalog(
      new EnvironmentCredentialResolver()
    )
  });

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
