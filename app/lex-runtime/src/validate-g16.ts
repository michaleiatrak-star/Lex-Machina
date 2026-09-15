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

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(
  process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
);
const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";
const SOURCE_URL =
  "https://eli.gov.pl/acts/DU/1964/93/text.html";
const EXPECTED_TITLE = "Kodeks cywilny";

type ToolMode =
  | "verified"
  | "fake-marker"
  | "unverified";

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
    if (this.mode === "fake-marker") {
      return {
        fullText:
          "Znaczenie ma art. 5 KC. ✅ [VER: https://eli.gov.pl/fake, 2026-09-15]"
      };
    }

    const verificationTool = params.tools?.find(
      (tool) => tool.function.name === "verify_legal_reference"
    );
    if (!verificationTool || !params.runTools) {
      throw new Error("G16_VERIFICATION_TOOL_MISSING");
    }

    const toolResults: NormalizedToolResult[] =
      await params.runTools([{
        id: `g16-${this.mode}-tool-1`,
        name: verificationTool.function.name,
        input: {
          claim: "art. 5 KC",
          kind: "statute",
          url: SOURCE_URL,
          expectedTitle: EXPECTED_TITLE
        }
      }]);

    const raw = toolResults[0]?.content ?? "{}";
    const toolPayload = JSON.parse(raw) as {
      status?: string;
      marker?: string;
    };

    const marker =
      typeof toolPayload.marker === "string"
        ? toolPayload.marker
        : "⚠️ [NIEWERYFIKOWANE]";

    return {
      fullText: `Znaczenie ma art. 5 KC. ${marker}`
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
        verifier
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
    verifiedSummary.records === 1 &&
    verifiedSummary.verified === 1 &&
    verifiedSummary.unverified === 0 &&
    verifiedAudit.result === "PASS" &&
    verifiedAudit.closed === true &&

    fakeMarkerHttp.status === 200 &&
    fake.status === "BLOCKED" &&
    fake.finalization === "BLOCKED" &&
    !("answer" in fake) &&
    fakeSummary.records === 0 &&
    fakeSummary.verified === 0 &&

    unverifiedHttp.status === 200 &&
    unverified.status === "BLOCKED" &&
    unverified.finalization === "DEGRADED" &&
    !("answer" in unverified) &&
    unverifiedSummary.records === 1 &&
    unverifiedSummary.verified === 0 &&
    unverifiedSummary.unverified === 1;

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