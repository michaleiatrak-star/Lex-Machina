import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import {
  SupremeCourtCaseVerifier
} from "./case-law-verifier.js";
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
  LegalVerificationToolRuntime
} from "./verification-tool-runtime.js";

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

function json(value: unknown): Response {
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

function caseFetcher(
  mode: "found" | "near-only"
) {
  return async (
    input: string | URL
  ): Promise<Response> => {
    const url = String(input);

    if (
      url.includes(
        "task=searchOrzeczenia"
      )
    ) {
      return json({
        data: [{
          data:
            mode === "found"
              ? [
                  {
                    id: "near",
                    sygnatura_sprawy:
                      "II CZP 25/11"
                  },
                  {
                    id: "exact",
                    sygnatura_sprawy:
                      "III CZP 25/11",
                    data_wydania:
                      "2011-10-18",
                    forma_orzeczenia:
                      "uchwała"
                  }
                ]
              : [{
                  id: "near",
                  sygnatura_sprawy:
                    "II CZP 25/11"
                }]
        }]
      });
    }

    const html =
      "<html><body>" +
      "Sąd Najwyższy " +
      "III CZP 25/11 " +
      "pełny tekst orzeczenia" +
      "</body></html>";

    return json({
      data: [{
        raw: Buffer
          .from(
            html,
            "utf8"
          )
          .toString("base64")
      }]
    });
  };
}

class CaseProvider
implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly label =
    "G22 deterministic case provider";
  readonly capabilities = {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };

  constructor(
    private readonly mode:
      | "tool"
      | "fake-marker"
  ) {}

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    if (
      this.mode ===
      "fake-marker"
    ) {
      return {
        fullText:
          "Zob. sygn. III CZP 25/11 " +
          "✅ [VER: https://sn.pl/fake, 2026-09-15]"
      };
    }

    const tool =
      params.tools?.find(
        (candidate) =>
          candidate.function.name ===
          "verify_case_reference"
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
        "G22_CASE_TOOL_MISSING"
      );
    }

    const requiredReads = [
      "shared/MCP-INTEGRACJA.md",
      "shared/SYGNATURY.md",
      "shared/PRAWO-HARDGATE.md",
      "shared/SELF-CHECK-ANTY-FASADA.md"
    ];

    const readResults =
      await params.runTools(
        requiredReads.map(
          (resource, index) => ({
            id:
              `g22-case-resource-${index + 1}`,
            name:
              readTool.function.name,
            input: {
              skill:
                "orzeczenia-sadowe-v2",
              path:
                resource
            }
          })
        )
      );
    if (
      readResults.length !==
        requiredReads.length ||
      readResults.some(
        (item) =>
          !item.content.includes(
            '"status":"OK"'
          )
      )
    ) {
      throw new Error(
        "G22_CASE_WORKFLOW_READ_FAILED"
      );
    }

    const [result] =
      await params.runTools([{
        id: "g22-case-1",
        name:
          tool.function.name,
        input: {
          claim:
            "sygn. III CZP 25/11",
          signature:
            "III  C.Z.P.  25/11",
          courtFamily: "SN"
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
      payload.status ===
        "VERIFIED" &&
      typeof payload.marker ===
        "string"
    ) {
      return {
        fullText:
          "Zob. sygn. III CZP 25/11 " +
          payload.marker
      };
    }

    return {
      fullText:
        "Zob. sygn. III CZP 25/11 " +
        "⚠️ [NIEWERYFIKOWANE]"
    };
  }
}

function executor(
  registry: LexSkillRegistry,
  providerMode:
    | "tool"
    | "fake-marker",
  sourceMode:
    | "found"
    | "near-only"
): SafeSessionExecutor {
  const providers =
    new ProviderRegistry();

  providers.register(
    new CaseProvider(providerMode)
  );

  const statuteVerifier =
    new OfficialLegalSourceVerifier(
      async () =>
        new Response(
          "<html></html>",
          {
            status: 200,
            headers: {
              "content-type":
                "text/html"
            }
          }
        )
    );

  return new SafeSessionExecutor(
    registry,
    new ProviderGateway(
      providers
    ),
    undefined,
    (ledger) =>
      new LegalVerificationToolRuntime(
        ledger,
        statuteVerifier,
        undefined,
        null,
        new SupremeCourtCaseVerifier(
          caseFetcher(sourceMode),
          () =>
            "2026-09-15T23:00:00.000Z"
        )
      )
  );
}

function appFor(
  registry: LexSkillRegistry,
  providerMode:
    | "tool"
    | "fake-marker",
  sourceMode:
    | "found"
    | "near-only"
) {
  return createLexHttpApp({
    registry,
    modelCatalog: {
      list: async () => [{
        provider:
          "openai" as const,
        id: "g22-model",
        displayName:
          "g22-model",
        selectable: true
      }]
    },
    sessionExecutor:
      executor(
        registry,
        providerMode,
        sourceMode
      )
  });
}

function body() {
  return {
    query:
      "Zweryfikuj istnienie orzeczenia SN o sygnaturze III CZP 25/11.",
    provider: "openai",
    model: "g22-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  };
}

function verification(
  value: Record<string, unknown>
): Record<string, unknown> {
  return (
    value.verification &&
    typeof value.verification ===
      "object"
  )
    ? value.verification as
      Record<string, unknown>
    : {};
}

const registry =
  new LexSkillRegistry(lexRoot);

const issues = [
  ...registry.scan(),
  ...registry.validateDeclarations()
];

const foundHttp =
  await request(
    appFor(
      registry,
      "tool",
      "found"
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const nearHttp =
  await request(
    appFor(
      registry,
      "tool",
      "near-only"
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const fakeHttp =
  await request(
    appFor(
      registry,
      "fake-marker",
      "found"
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const found =
  foundHttp.body as
    Record<string, unknown>;
const near =
  nearHttp.body as
    Record<string, unknown>;
const fake =
  fakeHttp.body as
    Record<string, unknown>;

const foundVerification =
  verification(found);
const nearVerification =
  verification(near);
const fakeVerification =
  verification(fake);

const pass =
  issues.length === 0 &&

  foundHttp.status === 200 &&
  found.status ===
    "DRAFT_PRESENTABLE" &&
  found.finalization ===
    "PASS" &&
  typeof found.answer ===
    "string" &&
  String(found.answer).includes(
    "sygn. III CZP 25/11"
  ) &&
  String(found.answer).includes(
    "https://sn.pl/pl/wyszukiwarka-orzeczen"
  ) &&
  foundVerification.records === 1 &&
  foundVerification.verified === 1 &&

  nearHttp.status === 200 &&
  near.status === "BLOCKED" &&
  !("answer" in near) &&
  nearVerification.records === 0 &&

  fakeHttp.status === 200 &&
  fake.status === "BLOCKED" &&
  !("answer" in fake) &&
  fakeVerification.records === 0;

process.stdout.write(
  JSON.stringify({
    gate:
      "G22_OFFICIAL_SN_CASE_LAW",
    result:
      pass
        ? "PASS"
        : "BLOCKED",
    exactMatchPath: {
      http: foundHttp.status,
      status: found.status,
      finalization:
        found.finalization,
      verification:
        foundVerification,
      answerReleased:
        typeof found.answer ===
        "string"
    },
    nearMatchPath: {
      http: nearHttp.status,
      status: near.status,
      verification:
        nearVerification,
      answerReleased:
        "answer" in near
    },
    fakeMarkerPath: {
      http: fakeHttp.status,
      status: fake.status,
      verification:
        fakeVerification,
      answerReleased:
        "answer" in fake
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
