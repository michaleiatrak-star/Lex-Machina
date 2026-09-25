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
  TemporalSourceFreshnessChecker,
  type EliFetch
} from "./temporal-source-freshness.js";
import { LegalVerificationToolRuntime } from "./verification-tool-runtime.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(
  process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
);
const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: {
      "content-type": "application/json"
    }
  });
}

function currentFreshnessFetcher(
  stale = false
): EliFetch {
  const currentEli =
    stale
      ? "DU/2027/10"
      : "DU/2026/795";

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
              stale ? 2027 : 2026,
            pos:
              stale ? 10 : 795,
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
      status: "obowiązujący",
      promulgation:
        stale
          ? "2027-01-10"
          : "2026-06-17",
      textHTML: true,
      textPDF: true
    });
  };
}

function historicalFreshnessFetcher(): EliFetch {
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
        "Inf. o tekście jednolitym": [
          {
            act: {
              ELI: "DU/2019/1145",
              year: 2019,
              pos: 1145,
              status:
                "uznany za uchylony"
            }
          },
          {
            act: {
              ELI: "DU/2026/795",
              year: 2026,
              pos: 795,
              status: "obowiązujący"
            }
          }
        ],
        "Akty zmieniające": []
      });
    }

    if (
      url.endsWith(
        "/DU/1964/93"
      )
    ) {
      return jsonResponse({
        ELI: "DU/1964/93",
        status: "obowiązujący",
        entryIntoForce:
          "1965-01-01",
        repealDate:
          "2021-01-01",
        promulgation:
          "1964-05-18"
      });
    }

    if (
      url.endsWith(
        "/DU/2019/1145"
      )
    ) {
      return jsonResponse({
        ELI: "DU/2019/1145",
        status:
          "uznany za uchylony",
        legalStatusDate:
          "2019-06-01",
        repealDate:
          "2021-01-01",
        promulgation:
          "2019-06-19",
        textHTML: true,
        textPDF: true
      });
    }

    if (
      url.endsWith(
        "/DU/2026/795"
      )
    ) {
      return jsonResponse({
        ELI: "DU/2026/795",
        status: "obowiązujący",
        legalStatusDate:
          "2026-05-20",
        promulgation:
          "2026-06-17",
        textHTML: true,
        textPDF: true
      });
    }

    if (url.endsWith("/references")) {
      return jsonResponse({});
    }

    throw new Error(
      "Unexpected G19 historical URL: " +
      url
    );
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

  constructor(
    private readonly asOf?: string
  ) {}

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    const tool = params.tools?.find(
      (candidate) =>
        candidate.function.name ===
        "verify_legal_reference"
    );
    const readTool = params.tools?.find(
      (candidate) =>
        candidate.function.name ===
        "read_legal_resource"
    );
    if (
      !tool ||
      !readTool ||
      !params.runTools
    ) {
      throw new Error(
        "G19_REQUIRED_TOOL_MISSING"
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
              `g19-read-${index + 1}`,
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
        "G19_STATUTE_PREFLIGHT_READ_FAILED"
      );
    }

    const [result] =
      await params.runTools([{
        id: "g19-tool-1",
        name: tool.function.name,
        input: {
          claim: "art. 5 KC",
          kind: "statute",
          act: "KC",
          ...(this.asOf
            ? { asOf: this.asOf }
            : {})
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
  freshnessFetch:
    EliFetch,
  verificationFetches: string[],
  asOf?: string
) {
  const providers =
    new ProviderRegistry();
  providers.register(
    new TemporalProvider(asOf)
  );

  const verifier =
    new OfficialLegalSourceVerifier(
      async (input) => {
        verificationFetches.push(
          String(input)
        );
        return new Response(
          "<html><title>Kodeks cywilny</title>" +
          "<body><h2>Art. 5.</h2><p>Treść.</p></body></html>",
          {
            status: 200,
            headers: {
              "content-type":
                "text/html; charset=utf-8"
            }
          }
        );
      },
      () =>
        "2026-09-15T21:00:00.000Z"
    );

  const freshness =
    new TemporalSourceFreshnessChecker(
      freshnessFetch,
      () =>
        "2026-09-15T21:00:00.000Z"
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
        new ProviderGateway(
          providers
        ),
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

function requestBody(
  asOf?: string
) {
  return {
    query:
      asOf
        ? `Według stanu na ${asOf} zweryfikuj art. 5 KC z kontrolą aktualności źródła.`
        : "Zweryfikuj art. 5 KC z kontrolą aktualności źródła.",
    provider: "openai",
    model: "g19-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  };
}

function verificationSummary(
  body: Record<string, unknown>
): Record<string, unknown> {
  return (
    body.verification &&
    typeof body.verification === "object"
  )
    ? body.verification as
      Record<string, unknown>
    : {};
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
    currentFreshnessFetcher(false),
    currentFetches
  )
)
  .post("/api/sessions/execute")
  .send(requestBody());

const staleFetches: string[] = [];
const staleHttp = await request(
  appFor(
    registry,
    currentFreshnessFetcher(true),
    staleFetches
  )
)
  .post("/api/sessions/execute")
  .send(requestBody());

const historicalFetches: string[] = [];
const historicalHttp = await request(
  appFor(
    registry,
    historicalFreshnessFetcher(),
    historicalFetches,
    "2020-06-01"
  )
)
  .post("/api/sessions/execute")
  .send(
    requestBody("2020-06-01")
  );

const afterRepealFetches: string[] = [];
const afterRepealHttp = await request(
  appFor(
    registry,
    historicalFreshnessFetcher(),
    afterRepealFetches,
    "2021-01-01"
  )
)
  .post("/api/sessions/execute")
  .send(
    requestBody("2021-01-01")
  );

const current =
  currentHttp.body as
    Record<string, unknown>;
const stale =
  staleHttp.body as
    Record<string, unknown>;
const historical =
  historicalHttp.body as
    Record<string, unknown>;
const afterRepeal =
  afterRepealHttp.body as
    Record<string, unknown>;

const currentVerification =
  verificationSummary(current);
const staleVerification =
  verificationSummary(stale);
const historicalVerification =
  verificationSummary(historical);
const afterRepealVerification =
  verificationSummary(
    afterRepeal
  );

const pass =
  issues.length === 0 &&

  currentHttp.status === 200 &&
  current.status ===
    "DRAFT_PRESENTABLE" &&
  current.finalization === "PASS" &&
  typeof current.answer ===
    "string" &&
  typeof currentVerification.records ===
    "number" &&
  currentVerification.records >= 1 &&
  currentVerification.verified ===
    currentVerification.records &&
  currentVerification.supported === 0 &&
  currentVerification.unverified === 0 &&
  currentFetches.length >= 1 &&
  currentFetches.every(
    (url) =>
      url ===
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html"
  ) &&

  staleHttp.status === 200 &&
  stale.status === "DRAFT_PRESENTABLE" &&
  // HARD GATE: shown only with the marker at the unverified claim.
  stale.finalization === "DEGRADED" &&
  typeof stale.answer === "string" &&
  staleVerification.records === 0 &&
  staleFetches.length === 0 &&

  historicalHttp.status === 200 &&
  historical.status ===
    "DRAFT_PRESENTABLE" &&
  historical.finalization === "PASS" &&
  typeof historical.answer ===
    "string" &&
  String(historical.answer).includes(
    "STAN NA 2020-06-01"
  ) &&
  typeof historicalVerification.records ===
    "number" &&
  historicalVerification.records >= 1 &&
  historicalVerification.verified ===
    historicalVerification.records &&
  historicalVerification.supported === 0 &&
  historicalVerification.unverified === 0 &&
  historicalFetches.length >= 1 &&
  historicalFetches.every(
    (url) =>
      url ===
        "https://api.sejm.gov.pl/eli/acts/DU/2019/1145/text.html"
  ) &&

  afterRepealHttp.status === 200 &&
  afterRepeal.status === "DRAFT_PRESENTABLE" &&
  typeof afterRepeal.answer === "string" &&
  afterRepealVerification.records === 0 &&
  afterRepealFetches.length === 0;

process.stdout.write(
  JSON.stringify({
    gate:
      "G19_TEMPORAL_SOURCE_FRESHNESS",
    result:
      pass ? "PASS" : "BLOCKED",
    currentPath: {
      http: currentHttp.status,
      status: current.status,
      finalization:
        current.finalization,
      verification:
        currentVerification,
      contentFetches:
        currentFetches
    },
    staleDescriptorPath: {
      http: staleHttp.status,
      status: stale.status,
      finalization:
        stale.finalization,
      answerReleased:
        "answer" in stale,
      verification:
        staleVerification,
      contentFetches:
        staleFetches
    },
    historicalRepealedTextException: {
      asOf: "2020-06-01",
      http: historicalHttp.status,
      status:
        historical.status,
      finalization:
        historical.finalization,
      markerContainsAsOf:
        typeof historical.answer === "string" &&
        String(historical.answer).includes(
          "STAN NA 2020-06-01"
        ),
      verification:
        historicalVerification,
      contentFetches:
        historicalFetches
    },
    historicalAfterRepeal: {
      asOf: "2021-01-01",
      http:
        afterRepealHttp.status,
      status:
        afterRepeal.status,
      answerReleased:
        "answer" in afterRepeal,
      verification:
        afterRepealVerification,
      contentFetches:
        afterRepealFetches
    },
    modelProviderCallExecuted: false,
    liveOfficialNetworkCallExecuted:
      false
  }, null, 2) + "\n"
);

if (!pass) {
  process.exitCode = 1;
}
