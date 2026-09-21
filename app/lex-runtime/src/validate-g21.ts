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

const here =
  path.dirname(
    fileURLToPath(import.meta.url)
  );
const repositoryRoot =
  path.resolve(here, "../../..");
const lexRoot =
  path.resolve(
    process.env.LEX_SKILLS_PATH ??
      path.join(
        repositoryRoot,
        "Wersja rozwojowa rozpakowana"
      )
  );
const DR02 =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

type AmendmentMode =
  | "future"
  | "effective"
  | "unknown";

function jsonResponse(
  value: unknown
): Response {
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

function amendmentFixture(
  mode: AmendmentMode
): {
  eli: string;
  relationDate?: string;
  promulgation: string;
  entryIntoForce?: string;
} {
  if (mode === "future") {
    return {
      eli: "DU/2026/1001",
      relationDate:
        "2026-10-01",
      promulgation:
        "2026-07-15",
      entryIntoForce:
        "2026-10-01"
    };
  }

  if (mode === "effective") {
    return {
      eli: "DU/2026/1002",
      relationDate:
        "2026-09-01",
      promulgation:
        "2026-07-15",
      entryIntoForce:
        "2026-09-01"
    };
  }

  return {
    eli: "DU/2026/1003",
    promulgation:
      "2026-07-15"
  };
}

function freshnessFetcher(
  mode: AmendmentMode
): EliFetch {
  const amendment =
    amendmentFixture(mode);

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
            ELI: "DU/2026/795",
            year: 2026,
            pos: 795,
            status:
              "obowiązujący"
          }
        }],
        "Akty zmieniające": [{
          act: {
            ELI: amendment.eli,
            ...(amendment.relationDate
              ? {
                  date:
                    amendment.relationDate
                }
              : {}),
            promulgation:
              amendment.promulgation,
            displayAddress:
              amendment.eli,
            title:
              "Ustawa zmieniająca"
          }
        }]
      });
    }

    if (
      url.endsWith(
        "/DU/2026/795/references"
      )
    ) {
      return jsonResponse({
        "Nowelizacje po tekście jednolitym": [{
          act: {
            ELI: amendment.eli,
            ...(amendment.relationDate
              ? {
                  date:
                    amendment.relationDate
                }
              : {}),
            promulgation:
              amendment.promulgation,
            displayAddress:
              amendment.eli,
            title:
              "Ustawa zmieniająca"
          }
        }]
      });
    }

    if (
      url.endsWith(
        "/DU/2026/795"
      )
    ) {
      return jsonResponse({
        ELI: "DU/2026/795",
        status:
          "obowiązujący",
        promulgation:
          "2026-06-17",
        textHTML: true,
        textPDF: true
      });
    }

    if (
      url.endsWith(
        "/DU/1964/93"
      )
    ) {
      return jsonResponse({
        ELI: "DU/1964/93",
        status: "akt posiada tekst jednolity",
        promulgation:
          "1964-05-18",
        textHTML: true,
        textPDF: true
      });
    }

    if (
      url.endsWith(
        "/" +
          amendment.eli +
          "/text.html"
      )
    ) {
      return new Response(
        "<html><body><p>Art. 1. W art. 6 Kodeksu cywilnego wprowadza się zmianę.</p></body></html>",
        {
          status: 200,
          headers: {
            "content-type":
              "text/html; charset=utf-8"
          }
        }
      );
    }

    if (
      url.endsWith(
        "/" + amendment.eli
      )
    ) {
      return jsonResponse({
        ELI: amendment.eli,
        promulgation:
          amendment.promulgation,
        textHTML: true,
        textPDF: true,
        ...(amendment.entryIntoForce
          ? {
              entryIntoForce:
                amendment.entryIntoForce
            }
          : {})
      });
    }

    throw new Error(
      "Unexpected G21 ELI URL: " +
      url
    );
  };
}

class AmendmentProvider
implements ProviderAdapter {
  readonly id =
    "openai" as const;
  readonly label =
    "G21 deterministic amendment provider";
  readonly capabilities = {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    const tool =
      params.tools?.find(
        (candidate) =>
          candidate.function.name ===
          "verify_legal_reference"
      );
    const readTool =
      params.tools?.find(
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
        "G21_REQUIRED_TOOL_MISSING"
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
              "g21-read-" +
              String(index + 1),
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
        "G21_STATUTE_PREFLIGHT_READ_FAILED"
      );
    }

    const [result] =
      await params.runTools([{
        id: "g21-tool-1",
        name:
          tool.function.name,
        input: {
          claim: "art. 5 KC",
          kind: "statute",
          act: "KC"
        }
      }]);

    const payload =
      JSON.parse(
        result?.content ?? "{}"
      ) as {
        status?: string;
        marker?: string;
      };

    if (
      payload.status === "VERIFIED" &&
      typeof payload.marker ===
        "string"
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
  mode: AmendmentMode,
  contentFetches: string[]
) {
  const providers =
    new ProviderRegistry();
  providers.register(
    new AmendmentProvider()
  );

  const verifier =
    new OfficialLegalSourceVerifier(
      async (input) => {
        contentFetches.push(
          String(input)
        );
        return new Response(
          "<html><title>Kodeks cywilny</title>" +
          "<body><h2>Art. 5.</h2><p>Treść.</p></body></html>",
          {
            status: 200,
            headers: {
              "content-type":
                "text/html"
            }
          }
        );
      },
      () =>
        "2026-09-15T23:00:00.000Z"
    );

  const freshness =
    new TemporalSourceFreshnessChecker(
      freshnessFetcher(mode),
      () =>
        "2026-09-15T23:00:00.000Z"
    );

  return createLexHttpApp({
    registry,
    modelCatalog: {
      list: async () => [{
        provider:
          "openai" as const,
        id: "g21-model",
        displayName:
          "g21-model",
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

function body() {
  return {
    query:
      "Zweryfikuj art. 5 KC z uwzględnieniem nowelizacji po tekście jednolitym.",
    provider: "openai",
    model: "g21-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  };
}

function summary(
  responseBody:
    Record<string, unknown>
): Record<string, unknown> {
  return (
    responseBody.verification &&
    typeof responseBody.verification ===
      "object"
  )
    ? responseBody.verification as
      Record<string, unknown>
    : {};
}

const registry =
  new LexSkillRegistry(lexRoot);
const issues = [
  ...registry.scan(),
  ...registry.validateDeclarations()
];

const futureFetches: string[] = [];
const futureHttp =
  await request(
    appFor(
      registry,
      "future",
      futureFetches
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const effectiveFetches: string[] = [];
const effectiveHttp =
  await request(
    appFor(
      registry,
      "effective",
      effectiveFetches
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const unknownFetches: string[] = [];
const unknownHttp =
  await request(
    appFor(
      registry,
      "unknown",
      unknownFetches
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const future =
  futureHttp.body as
    Record<string, unknown>;
const effective =
  effectiveHttp.body as
    Record<string, unknown>;
const unknown =
  unknownHttp.body as
    Record<string, unknown>;

const futureVerification =
  summary(future);
const effectiveVerification =
  summary(effective);
const unknownVerification =
  summary(unknown);

const pass =
  issues.length === 0 &&

  futureHttp.status === 200 &&
  future.status ===
    "DRAFT_PRESENTABLE" &&
  future.finalization ===
    "PASS" &&
  typeof future.answer ===
    "string" &&
  typeof futureVerification.records ===
    "number" &&
  futureVerification.records >= 1 &&
  futureVerification.verified ===
    futureVerification.records &&
  futureVerification.supported === 0 &&
  futureVerification.unverified === 0 &&
  futureFetches.length >= 1 &&

  effectiveHttp.status === 200 &&
  effective.status ===
    "DRAFT_PRESENTABLE" &&
  typeof effective.answer ===
    "string" &&
  typeof effectiveVerification.records ===
    "number" &&
  effectiveVerification.records >= 1 &&
  effectiveVerification.verified ===
    effectiveVerification.records &&
  effectiveVerification.unverified === 0 &&
  effectiveFetches.length >= 1 &&
  effectiveFetches.every(
    (url) =>
      url ===
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html"
  ) &&

  unknownHttp.status === 200 &&
  unknown.status ===
    "DRAFT_PRESENTABLE" &&
  typeof unknown.answer ===
    "string" &&
  unknownVerification.records === 0 &&
  unknownFetches.length === 0;

process.stdout.write(
  JSON.stringify({
    gate:
      "G21_AMENDMENT_AWARE_LEGAL_STATE",
    result:
      pass ? "PASS" : "BLOCKED",
    futureAmendment: {
      http: futureHttp.status,
      status: future.status,
      finalization:
        future.finalization,
      verification:
        futureVerification,
      contentFetches:
        futureFetches.length,
      allowedBecause:
        "amendment effective date is after target legal-state date"
    },
    effectiveAmendment: {
      http: effectiveHttp.status,
      status: effective.status,
      answerReleased:
        "answer" in effective,
      verification:
        effectiveVerification,
      contentFetches:
        effectiveFetches.length,
      allowedBecause:
        "official amendment text proves the requested article is untouched; verification uses the latest consolidated text"
    },
    unknownEffectDate: {
      http: unknownHttp.status,
      status: unknown.status,
      answerReleased:
        "answer" in unknown,
      verification:
        unknownVerification,
      contentFetches:
        unknownFetches.length,
      degradedBecause:
        "official amendment effect date could not be established"
    },
    liveOfficialNetworkCallExecuted:
      false,
    modelProviderCallExecuted:
      false
  }, null, 2) + "\n"
);

if (!pass) {
  process.exitCode = 1;
}
