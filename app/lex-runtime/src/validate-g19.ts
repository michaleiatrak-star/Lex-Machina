import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { createLexHttpApp } from "./http/app.js";
import {
  OfficialLegalSourceVerifier
} from "./legal-source-verifier.js";
import {
  ProviderGateway,
  ProviderRegistry
} from "./providers/gateway.js";
import type {
  ProviderAdapter,
  ProviderStreamParams,
  ProviderStreamResult
} from "./providers/types.js";
import { LexSkillRegistry } from "./registry.js";
import { SafeSessionExecutor } from "./session-executor.js";
import {
  TemporalSourceFreshnessChecker
} from "./temporal-source-freshness.js";
import { LegalVerificationToolRuntime } from "./verification-tool-runtime.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(
  process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
);
const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

type Mode = "current" | "stale";

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: {
      "content-type": "application/json"
    }
  });
}

function freshnessFetcher(mode: Mode) {
  const currentEli =
    mode === "current"
      ? "DU/2026/795"
      : "DU/2027/10";

  return async (
    input: string | URL
  ): Promise<Response> => {
    const url = String(input);

    if (
      url.endsWith(
        "/DU/1964/93/references"
      )
    ) {
      return jsonResponse({
        "Inf. o tekście jednolitym": [{
          act: {
            ELI: currentEli,
            year:
              mode === "current"
                ? 2026
                : 2027,
            pos:
              mode === "current"
                ? 795
                : 10,
            status: "obowiązujący"
          }
        }],
        "Akty zmieniające": []
      });
    }

    if (url.endsWith("/references")) {
      return jsonResponse({
        "Nowelizacje po tekście jednolitym": []
      });
    }

    return jsonResponse({
      ELI: currentEli,
      promulgation:
        mode === "current"
          ? "2026-06-17"
          : "2027-01-10",
      textHTML: true,
      textPDF: true
    });
  };
}

class TemporalProvider implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly label =
    "G19 deterministic temporal provider";
  readonly capabilities = {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    const tool = params.tools?.find(
      (candidate) =>
        candidate.function.name ===
        "verify_legal_reference"
    );
    if (!tool || !params.runTools) {
      throw new Error(
        "G19_VERIFICATION_TOOL_MISSING"
      );
    }

    const [result] =
      await params.runTools([{
        id: "g19-tool-1",
        name: tool.function.name,
        input: {
          claim: "art. 5 KC",
          kind: "statute",
          act: "KC"
        }
      }]);

    const payload = JSON.parse(
      result?.content ?? "{}"
    ) as {
      status?: string;
      error?: string;
      marker?: string;
    };

    if (
      payload.status === "VERIFIED" &&
      typeof payload.marker === "string"
    ) {
      return {
        fullText:
          "Znaczenie ma art. 5 KC. " +
          payload.marker
      };
    }

    return {
      fullText:
        "Znaczenie ma art. 5 KC. " +
        "⚠️ [NIEWERYFIKOWANE]"
    };
  }
}

function appFor(
  registry: LexSkillRegistry,
  mode: Mode,
  verificationFetches: string[]
) {
  const providers = new ProviderRegistry();
  providers.register(new TemporalProvider());

  const verifier =
    new OfficialLegalSourceVerifier(
      async (input) => {
        verificationFetches.push(
          String(input)
        );
        return new Response(
          "<html><title>Kodeks cywilny</title>" +
          "<body>Art. 5. Treść.</body></html>",
          {
            status: 200,
            headers: {
              "content-type":
                "text/html; charset=utf-8"
            }
          }
        );
      },
      () => "2026-09-15T21:00:00.000Z"
    );

  const freshness =
    new TemporalSourceFreshnessChecker(
      freshnessFetcher(mode),
      () => "2026-09-15T21:00:00.000Z"
    );

  return createLexHttpApp({
    registry,
    modelCatalog: {
      list: async () => [{
        provider: "openai" as const,
        id: "g19-model",
        displayName: "g19-model",
        selectable: true
      }]
    },
    sessionExecutor:
      new SafeSessionExecutor(
        registry,
        new ProviderGateway(providers),
        undefined,
        (ledger) =>
          new LegalVerificationToolRuntime(
            ledger,
            verifier,
            undefined,
            freshness
          )
      )
  });
}

function requestBody() {
  return {
    query:
      "Zweryfikuj art. 5 KC z kontrolą aktualności źródła.",
    provider: "openai",
    model: "g19-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  };
}

const registry =
  new LexSkillRegistry(lexRoot);
const issues = [
  ...registry.scan(),
  ...registry.validateDeclarations()
];

const currentFetches: string[] = [];
const currentHttp = await request(
  appFor(
    registry,
    "current",
    currentFetches
  )
)
  .post("/api/sessions/execute")
  .send(requestBody());

const staleFetches: string[] = [];
const staleHttp = await request(
  appFor(
    registry,
    "stale",
    staleFetches
  )
)
  .post("/api/sessions/execute")
  .send(requestBody());

const current =
  currentHttp.body as Record<string, unknown>;
const stale =
  staleHttp.body as Record<string, unknown>;

const currentVerification =
  current.verification &&
  typeof current.verification === "object"
    ? current.verification as
      Record<string, unknown>
    : {};
const staleVerification =
  stale.verification &&
  typeof stale.verification === "object"
    ? stale.verification as
      Record<string, unknown>
    : {};

const pass =
  issues.length === 0 &&
  currentHttp.status === 200 &&
  current.status === "DRAFT_PRESENTABLE" &&
  current.finalization === "PASS" &&
  typeof current.answer === "string" &&
  currentVerification.verified === 1 &&
  currentFetches.length === 1 &&
  currentFetches[0] ===
    "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html" &&
  staleHttp.status === 200 &&
  stale.status === "BLOCKED" &&
  stale.finalization === "BLOCKED" &&
  !("answer" in stale) &&
  staleVerification.records === 0 &&
  staleFetches.length === 0;

process.stdout.write(
  JSON.stringify({
    gate: "G19_TEMPORAL_SOURCE_FRESHNESS",
    result: pass ? "PASS" : "BLOCKED",
    currentPath: {
      http: currentHttp.status,
      status: current.status,
      finalization: current.finalization,
      verification: currentVerification,
      contentFetches: currentFetches
    },
    staleDescriptorPath: {
      http: staleHttp.status,
      status: stale.status,
      finalization: stale.finalization,
      answerReleased: "answer" in stale,
      verification: staleVerification,
      contentFetches: staleFetches
    },
    modelProviderCallExecuted: false,
    liveOfficialNetworkCallExecuted: false
  }, null, 2) + "\n"
);

if (!pass) process.exitCode = 1;
