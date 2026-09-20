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
  NormalizedToolResult,
  ProviderAdapter,
  ProviderStreamParams,
  ProviderStreamResult
} from "./providers/types.js";
import { LexSkillRegistry } from "./registry.js";
import { SafeSessionExecutor } from "./session-executor.js";
import { LegalVerificationToolRuntime } from "./verification-tool-runtime.js";
import {
  TemporalSourceFreshnessChecker
} from "./temporal-source-freshness.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(
  process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
);
const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

type ToolMode =
  | "verified"
  | "fake-marker"
  | "unverified";

function jsonResponse(value: unknown): Response {
  return new Response(
    JSON.stringify(value),
    {
      status: 200,
      headers: {
        "content-type":
          "application/json"
      }
    }
  );
}

function g16FreshnessFetcher(
  input: string | URL
): Promise<Response> {
  const url = String(input);

  if (
    url.endsWith(
      "/DU/1964/93/references"
    )
  ) {
    return Promise.resolve(
      jsonResponse({
        "Inf. o tekście jednolitym": [
          {
            act: {
              ELI:
                "DU/2026/795",
              year: 2026,
              pos: 795,
              status:
                "obowiązujący"
            }
          }
        ],
        "Akty zmieniające": []
      })
    );
  }

  if (
    url.endsWith(
      "/DU/2026/795/references"
    )
  ) {
    return Promise.resolve(
      jsonResponse({})
    );
  }

  if (
    url.endsWith(
      "/DU/2026/795"
    )
  ) {
    return Promise.resolve(
      jsonResponse({
        ELI:
          "DU/2026/795",
        status:
          "obowiązujący",
        promulgation:
          "2026-06-17",
        textHTML: true,
        textPDF: true
      })
    );
  }

  return Promise.reject(
    new Error(
      "G16_UNEXPECTED_FRESHNESS_URL:" +
        url
    )
  );
}

class VerificationProvider implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly label = "G16 deterministic verification provider";
  readonly capabilities = {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };

  constructor(private readonly mode: ToolMode) {}

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    const readTool = params.tools?.find(
      (tool) =>
        tool.function.name ===
          "read_legal_resource"
    );
    const verificationTool = params.tools?.find(
      (tool) =>
        tool.function.name ===
          "verify_legal_reference"
    );
    if (
      !readTool ||
      !verificationTool ||
      !params.runTools
    ) {
      throw new Error(
        "G16_REQUIRED_TOOL_MISSING"
      );
    }

    const statuteResources = [
      "shared/UNIVERSAL-RUNTIME-ADAPTER.md",
      "shared/PRAWO-HARDGATE.md",
      "shared/HIERARCHIA-ZRODEL.md",
      "shared/SELF-CHECK-ANTY-FASADA.md"
    ] as const;

    const readResults =
      await params.runTools(
        statuteResources.map(
          (resource, index) => ({
            id:
              `g16-${this.mode}-read-${index + 1}`,
            name:
              readTool.function.name,
            input: {
              skill:
                "analizator-przepisow-v2",
              path:
                resource
            }
          })
        )
      );

    if (
      readResults.length !==
        statuteResources.length ||
      readResults.some(
        (result) =>
          typeof result.content !==
            "string" ||
          !result.content.trim()
      )
    ) {
      throw new Error(
        "G16_STATUTE_PREFLIGHT_READ_FAILED"
      );
    }

    if (this.mode === "fake-marker") {
      return {
        fullText:
          "Znaczenie ma art. 5 KC. ✅ [VER: https://eli.gov.pl/fake, 2026-09-15]"
      };
    }

    const toolResults:
      NormalizedToolResult[] =
        await params.runTools([{
          id:
            `g16-${this.mode}-verify-1`,
          name:
            verificationTool
              .function.name,
          input: {
            claim:
              "art. 5 KC",
            kind:
              "statute",
            act:
              "KC"
          }
        }]);

    const raw =
      toolResults[0]?.content ??
      "{}";
    const toolPayload =
      JSON.parse(raw) as {
        status?: string;
        marker?: string;
      };

    const marker =
      typeof toolPayload.marker ===
        "string"
        ? toolPayload.marker
        : "⚠️ [NIEWERYFIKOWANE]";

    return {
      fullText:
        `Znaczenie ma art. 5 KC. ${marker}`
    };
  }
}

function executor(
  registry: LexSkillRegistry,
  mode: ToolMode
): SafeSessionExecutor {
  const providers = new ProviderRegistry();
  providers.register(new VerificationProvider(mode));

  const verifier = new OfficialLegalSourceVerifier(
    async () =>
      new Response(
        mode === "verified"
          ? "<html><body><h1>Kodeks cywilny</h1><h2>Art. 5.</h2><p>Treść przepisu ze źródła urzędowego.</p></body></html>"
          : "<html><body><h1>Kodeks cywilny</h1><h2>Art. 6.</h2><p>Inny przepis.</p></body></html>",
        {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8"
          }
        }
      ),
    () => "2026-09-15T18:30:00.000Z"
  );

  return new SafeSessionExecutor(
    registry,
    new ProviderGateway(providers),
    undefined,
    (ledger) =>
      new LegalVerificationToolRuntime(
        ledger,
        verifier,
        undefined,
        new TemporalSourceFreshnessChecker(
          g16FreshnessFetcher,
          () =>
            "2026-09-15T18:30:00.000Z"
        )
      )
  );
}

function appFor(
  registry: LexSkillRegistry,
  mode: ToolMode
) {
  return createLexHttpApp({
    registry,
    modelCatalog: {
      list: async () => [{
        provider: "openai" as const,
        id: "g16-model",
        displayName: "g16-model",
        selectable: true
      }]
    },
    sessionExecutor: executor(registry, mode)
  });
}

function requestBody() {
  return {
    query:
      "Zweryfikuj powołanie art. 5 KC i użyj wyłącznie świeżego źródła urzędowego.",
    provider: "openai",
    model: "g16-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  };
}

const registry = new LexSkillRegistry(lexRoot);
const issues = [
  ...registry.scan(),
  ...registry.validateDeclarations()
];

if (issues.length > 0) {
  process.stdout.write(
    JSON.stringify({
      gate: "G16_VERIFIED_TOOL_LOOP",
      result: "BLOCKED",
      issues
    }, null, 2) + "\n"
  );
  process.exitCode = 1;
} else {
  const verifiedHttp = await request(
    appFor(registry, "verified")
  )
    .post("/api/sessions/execute")
    .send(requestBody());

  const fakeMarkerHttp = await request(
    appFor(registry, "fake-marker")
  )
    .post("/api/sessions/execute")
    .send(requestBody());

  const unverifiedHttp = await request(
    appFor(registry, "unverified")
  )
    .post("/api/sessions/execute")
    .send(requestBody());

  const verified = verifiedHttp.body as Record<string, unknown>;
  const fake = fakeMarkerHttp.body as Record<string, unknown>;
  const unverified = unverifiedHttp.body as Record<string, unknown>;

  const verifiedAudit =
    verified.audit &&
    typeof verified.audit === "object"
      ? verified.audit as Record<string, unknown>
      : {};
  const verifiedSummary =
    verified.verification &&
    typeof verified.verification === "object"
      ? verified.verification as Record<string, unknown>
      : {};
  const fakeSummary =
    fake.verification &&
    typeof fake.verification === "object"
      ? fake.verification as Record<string, unknown>
      : {};
  const unverifiedSummary =
    unverified.verification &&
    typeof unverified.verification === "object"
      ? unverified.verification as Record<string, unknown>
      : {};

  const pass =
    verifiedHttp.status === 200 &&
    verified.status === "DRAFT_PRESENTABLE" &&
    verified.finalization === "PASS" &&
    typeof verified.answer === "string" &&
    String(verified.answer).includes("art. 5 KC") &&
    String(verified.answer).includes("✅ [VER:") &&
    typeof verifiedSummary.records === "number" &&
    verifiedSummary.records >= 1 &&
    verifiedSummary.verified ===
      verifiedSummary.records &&
    verifiedSummary.supported === 0 &&
    verifiedSummary.unverified === 0 &&
    verifiedAudit.result === "PASS" &&
    verifiedAudit.closed === true &&

    fakeMarkerHttp.status === 200 &&
    fake.status === "DRAFT_PRESENTABLE" &&
    fake.finalization === "DEGRADED" &&
    typeof fake.answer === "string" &&
    fakeSummary.records === 1 &&
    fakeSummary.verified === 0 &&
    fakeSummary.unverified === 1 &&

    unverifiedHttp.status === 200 &&
    unverified.status === "DRAFT_PRESENTABLE" &&
    unverified.finalization === "DEGRADED" &&
    typeof unverified.answer === "string" &&
    typeof unverifiedSummary.records === "number" &&
    unverifiedSummary.records >= 1 &&
    unverifiedSummary.verified === 0 &&
    unverifiedSummary.supported === 0 &&
    unverifiedSummary.unverified ===
      unverifiedSummary.records;

  process.stdout.write(
    JSON.stringify({
      gate: "G16_VERIFIED_TOOL_LOOP",
      result: pass ? "PASS" : "BLOCKED",
      verifiedPath: {
        http: verifiedHttp.status,
        status: verified.status,
        finalization: verified.finalization,
        verification: verifiedSummary,
        audit: verifiedAudit.result,
        answerReleased: typeof verified.answer === "string"
      },
      fakeMarkerPath: {
        http: fakeMarkerHttp.status,
        status: fake.status,
        finalization: fake.finalization,
        verification: fakeSummary,
        answerReleased: "answer" in fake
      },
      unmatchedOfficialSourcePath: {
        http: unverifiedHttp.status,
        status: unverified.status,
        finalization: unverified.finalization,
        verification: unverifiedSummary,
        answerReleased: "answer" in unverified
      },
      liveOfficialNetworkCallExecuted: false,
      liveProviderCallExecuted: false
    }, null, 2) + "\n"
  );

  if (!pass) process.exitCode = 1;
}