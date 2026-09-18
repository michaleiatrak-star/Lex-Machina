import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { createLexHttpApp } from "./http/app.js";
import {
  DeterministicLegalActResolver
} from "./legal-act-resolver.js";
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
import { VerificationLedger } from "./verification-ledger.js";
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
const EXPECTED_URL =
  "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html";

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

function g18FreshnessFetcher(
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
      "G18_UNEXPECTED_FRESHNESS_URL:" +
        url
    )
  );
}

class ResolverProvider implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly label = "G18 deterministic resolver provider";
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
        candidate.function.name === "verify_legal_reference"
    );
    const readTool = params.tools?.find(
      (candidate) =>
        candidate.function.name === "read_legal_resource"
    );
    if (
      !tool ||
      !readTool ||
      !params.runTools
    ) {
      throw new Error(
        "G18_REQUIRED_TOOL_MISSING"
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
              `g18-read-${index + 1}`,
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
        "G18_STATUTE_PREFLIGHT_READ_FAILED"
      );
    }

    const parameters = tool.function.parameters as {
      required?: string[];
      properties?: Record<string, unknown>;
    };
    if (
      parameters.properties?.url ||
      parameters.properties?.expectedTitle ||
      !parameters.properties?.act
    ) {
      throw new Error("G18_TRANSPORT_FIELDS_EXPOSED");
    }

    const [result] = await params.runTools([{
      id: "g18-tool-1",
      name: tool.function.name,
      input: {
        claim: "art. 5 KC",
        kind: "statute",
        act: "Kodeks cywilny"
      }
    }]);

    const payload = JSON.parse(
      result?.content ?? "{}"
    ) as {
      status?: string;
      marker?: string;
      act?: {
        id?: string;
        eli?: string;
      };
    };

    if (
      payload.status !== "VERIFIED" ||
      payload.act?.id !== "KC" ||
      payload.act?.eli !== "DU/2026/795" ||
      typeof payload.marker !== "string"
    ) {
      throw new Error("G18_RESOLUTION_RESULT_INVALID");
    }

    return {
      fullText:
        "Znaczenie ma art. 5 KC. " + payload.marker
    };
  }
}

const fetchInputs: string[] = [];
const verifier = new OfficialLegalSourceVerifier(
  async (input) => {
    fetchInputs.push(String(input));
    return new Response(
      "<html><head><title>Kodeks cywilny</title></head>" +
      "<body><h2>Art. 5.</h2><p>Treść przepisu.</p></body></html>",
      {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8"
        }
      }
    );
  },
  () => "2026-09-15T20:00:00.000Z"
);

const registry = new LexSkillRegistry(lexRoot);
const issues = [
  ...registry.scan(),
  ...registry.validateDeclarations()
];

const resolver = new DeterministicLegalActResolver();
const kc = resolver.resolve("k.c.");
const kpc = resolver.resolve("KPC");
const kpk = resolver.resolve(
  "Kodeks postępowania karnego"
);

const unknownLedger = new VerificationLedger();
const unknownRuntime = new LegalVerificationToolRuntime(
  unknownLedger,
  verifier,
  resolver
);
const [unknownResult] = await unknownRuntime.runTools([{
  id: "g18-unknown-1",
  name: "verify_legal_reference",
  input: {
    claim: "art. 1 XYZ",
    kind: "statute",
    act: "XYZ"
  }
}]);
const unknownPayload = JSON.parse(
  unknownResult?.content ?? "{}"
) as {
  status?: string;
  error?: string;
};

const providers = new ProviderRegistry();
providers.register(new ResolverProvider());

const sessionExecutor = new SafeSessionExecutor(
  registry,
  new ProviderGateway(providers),
  undefined,
  (ledger) =>
    new LegalVerificationToolRuntime(
      ledger,
      verifier,
      resolver,
      new TemporalSourceFreshnessChecker(
        g18FreshnessFetcher,
        () =>
          "2026-09-15T20:00:00.000Z"
      )
    )
);

const app = createLexHttpApp({
  registry,
  modelCatalog: {
    list: async () => [{
      provider: "openai" as const,
      id: "g18-model",
      displayName: "g18-model",
      selectable: true
    }]
  },
  sessionExecutor
});

const response = await request(app)
  .post("/api/sessions/execute")
  .send({
    query:
      "Zweryfikuj art. 5 KC bez podawania adresu źródła przez model.",
    provider: "openai",
    model: "g18-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  });

const body = response.body as Record<string, unknown>;
const verification =
  body.verification &&
  typeof body.verification === "object"
    ? body.verification as Record<string, unknown>
    : {};

const pass =
  issues.length === 0 &&
  kc.id === "KC" &&
  kc.eli === "DU/2026/795" &&
  kpc.id === "KPC" &&
  kpc.eli === "DU/2026/468" &&
  kpk.id === "KPK" &&
  kpk.eli === "DU/2026/490" &&
  unknownPayload.status === "DENIED" &&
  unknownPayload.error === "UNKNOWN_LEGAL_ACT" &&
  unknownLedger.all().length === 0 &&
  response.status === 200 &&
  body.status === "DRAFT_PRESENTABLE" &&
  body.finalization === "PASS" &&
  typeof body.answer === "string" &&
  String(body.answer).includes("✅ [VER:") &&
  typeof verification.records === "number" &&
  verification.records >= 1 &&
  verification.verified ===
    verification.records &&
  verification.supported === 0 &&
  verification.unverified === 0 &&
  fetchInputs.length >= 1 &&
  fetchInputs.every(
    (input) =>
      input === EXPECTED_URL
  );

process.stdout.write(
  JSON.stringify({
    gate: "G18_DETERMINISTIC_LEGAL_SOURCE_RESOLVER",
    result: pass ? "PASS" : "BLOCKED",
    registry: resolver.list().map((act) => ({
      id: act.id,
      eli: act.eli,
      baseEli: act.baseEli,
      registryAsOf: act.registryAsOf
    })),
    transportFieldsExposedToModel: false,
    unknownAct: {
      status: unknownPayload.status ?? null,
      error: unknownPayload.error ?? null,
      networkCallsBeforeSession: 0
    },
    session: {
      http: response.status,
      status: body.status,
      finalization: body.finalization,
      verification,
      answerReleased: typeof body.answer === "string"
    },
    resolvedFetchUrl: fetchInputs[0] ?? null,
    modelProviderCallExecuted: false,
    liveOfficialNetworkCallExecuted: false
  }, null, 2) + "\n"
);

if (!pass) process.exitCode = 1;
