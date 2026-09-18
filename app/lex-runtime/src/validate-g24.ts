import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import {
  SupremeCourtCaseVerifier
} from "./case-law-verifier.js";
import {
  CaseLawSearchService
} from "./case-law-search.js";
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

const CASE_LAW_WORKFLOW_RESOURCES = [
  "shared/MCP-INTEGRACJA.md",
  "shared/SYGNATURY.md",
  "shared/PRAWO-HARDGATE.md",
  "shared/SELF-CHECK-ANTY-FASADA.md"
] as const;

async function satisfyCaseLawWorkflowPreflight(
  params: ProviderStreamParams,
  idPrefix: string
): Promise<void> {
  const readTool =
    params.tools?.find(
      (candidate) =>
        candidate.function.name ===
        "read_legal_resource"
    );
  if (!readTool || !params.runTools) {
    throw new Error(
      "G24_CASE_LAW_PREFLIGHT_TOOL_MISSING"
    );
  }

  const results =
    await params.runTools(
      CASE_LAW_WORKFLOW_RESOURCES.map(
        (resource, index) => ({
          id:
            `${idPrefix}-case-law-read-${index + 1}`,
          name:
            readTool.function.name,
          input: {
            skill:
              "orzeczenia-sadowe-v2",
            path: resource
          }
        })
      )
    );

  for (const result of results) {
    const payload =
      JSON.parse(
        result.content ?? "{}"
      ) as {
        status?: string;
      };
    if (payload.status !== "OK") {
      throw new Error(
        "G24_CASE_LAW_PREFLIGHT_FAILED"
      );
    }
  }
}

const signature =
  "III CZP 25/11";

const proposition =
  "SN wskazał na znaczenie tej zasady.";

const supportQuote =
  "pełny tekst orzeczenia zawiera tę dokładną wypowiedź";

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

function caseLawDiscoveryFetcher(
  input: string | URL
): Promise<Response> {
  const url = String(input);
  if (
    url.includes(
      "saos.org.pl/api/search/judgments"
    )
  ) {
    return Promise.resolve(
      json({
        items: [],
        info: {
          totalResults: 0
        }
      })
    );
  }
  if (
    url.includes(
      "orzeczenia.nsa.gov.pl/cbo/search"
    )
  ) {
    return Promise.resolve(
      new Response(
        "<html><body>Znaleziono 0 orzeczeń</body></html>",
        {
          status: 200,
          headers: {
            "content-type":
              "text/html; charset=utf-8"
          }
        }
      )
    );
  }
  if (
    url.includes(
      "orzeczenia.nsa.gov.pl/cbo/query"
    )
  ) {
    return Promise.resolve(
      new Response(
        "<html><body>CBOSA</body></html>",
        {
          status: 200,
          headers: {
            "content-type":
              "text/html; charset=utf-8"
          }
        }
      )
    );
  }
  return Promise.reject(
    new Error(
      "G24_UNEXPECTED_DISCOVERY_URL:" +
        url
    )
  );
}

function caseFetcher() {
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
          data: [{
            id: "g24-case",
            sygnatura_sprawy:
              signature,
            data_wydania:
              "2011-10-18",
            forma_orzeczenia:
              "uchwała"
          }]
        }]
      });
    }

    const html =
      "<html><body>" +
      "Sąd Najwyższy " +
      signature +
      " " +
      supportQuote +
      "</body></html>";

    return json({
      data: [{
        data: {
          raw: Buffer
            .from(
              html,
              "utf8"
            )
            .toString(
              "base64"
            )
        }
      }]
    });
  };
}

type ProviderMode =
  | "supported"
  | "fake-support"
  | "altered-proposition"
  | "omit-support-quote";

class PropositionProvider
implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly label =
    "G24 deterministic proposition provider";
  readonly capabilities = {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  };

  constructor(
    private readonly mode:
      ProviderMode
  ) {}

  async stream(
    params: ProviderStreamParams
  ): Promise<ProviderStreamResult> {
    await satisfyCaseLawWorkflowPreflight(
      params,
      "g24"
    );
    if (
      this.mode ===
      "fake-support"
    ) {
      return {
        fullText:
          proposition +
          " „" +
          supportQuote +
          "” sygn. III CZP 25/11 " +
          "✅ [VER: https://sn.pl/fake, 2026-09-15] " +
          "✅ [CASE-QUOTE:11111111111111111111] " +
          "🔗 [CASE-SUPPORT:22222222222222222222]"
      };
    }

    const tool =
      params.tools?.find(
        (candidate) =>
          candidate.function.name ===
          "verify_case_proposition"
      );

    if (
      !tool ||
      !params.runTools
    ) {
      throw new Error(
        "G24_CASE_PROPOSITION_TOOL_MISSING"
      );
    }

    const [result] =
      await params.runTools([{
        id: "g24-proposition-1",
        name:
          tool.function.name,
        input: {
          caseClaim:
            "sygn. III CZP 25/11",
          signature,
          proposition,
          supportQuote,
          courtFamily: "SN"
        }
      }]);

    const payload =
      JSON.parse(
        result?.content ?? "{}"
      ) as {
        status?: string;
        semanticVerification?:
          boolean;
        proposition?: string;
        supportQuote?: string;
        caseMarker?: string;
        quoteMarker?: string;
        supportMarker?: string;
      };

    if (
      payload.status !==
        "SUPPORTED" ||
      payload.semanticVerification !==
        false ||
      typeof payload.caseMarker !==
        "string" ||
      typeof payload.quoteMarker !==
        "string" ||
      typeof payload.supportMarker !==
        "string"
    ) {
      return {
        fullText:
          "sygn. III CZP 25/11 " +
          "⚠️ [NIEWERYFIKOWANE]"
      };
    }

    const outputProposition =
      this.mode ===
      "altered-proposition"
        ? "SN przesądził tę zasadę."
        : proposition;

    const quotePart =
      this.mode ===
      "omit-support-quote"
        ? ""
        : " „" +
          supportQuote +
          "”";

    return {
      fullText:
        outputProposition +
        quotePart +
        " sygn. III CZP 25/11 " +
        payload.caseMarker +
        " " +
        payload.quoteMarker +
        " " +
        payload.supportMarker
    };
  }
}

function appFor(
  registry:
    LexSkillRegistry,
  mode: ProviderMode
) {
  const providers =
    new ProviderRegistry();

  providers.register(
    new PropositionProvider(
      mode
    )
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

  const caseVerifier =
    new SupremeCourtCaseVerifier(
      caseFetcher(),
      () =>
        "2026-09-15T23:45:00.000Z"
    );

  return createLexHttpApp({
    registry,
    modelCatalog: {
      list: async () => [{
        provider:
          "openai" as const,
        id: "g24-model",
        displayName:
          "g24-model",
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
            statuteVerifier,
            undefined,
            null,
            caseVerifier,
            new CaseLawSearchService(
              caseLawDiscoveryFetcher
            )
          )
      )
  });
}

function body() {
  return {
    query:
      "Powiąż parafrazę z dokładnym dowodem z orzeczenia SN III CZP 25/11.",
    provider: "openai",
    model: "g24-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  };
}

function verification(
  value:
    Record<string, unknown>
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

const supportedHttp =
  await request(
    appFor(
      registry,
      "supported"
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
      "fake-support"
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const alteredHttp =
  await request(
    appFor(
      registry,
      "altered-proposition"
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const omittedHttp =
  await request(
    appFor(
      registry,
      "omit-support-quote"
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(body());

const supported =
  supportedHttp.body as
    Record<string, unknown>;
const fake =
  fakeHttp.body as
    Record<string, unknown>;
const altered =
  alteredHttp.body as
    Record<string, unknown>;
const omitted =
  omittedHttp.body as
    Record<string, unknown>;

const supportedSummary =
  verification(supported);
const fakeSummary =
  verification(fake);
const alteredSummary =
  verification(altered);
const omittedSummary =
  verification(omitted);

const pass =
  issues.length === 0 &&

  supportedHttp.status === 200 &&
  supported.status ===
    "DRAFT_PRESENTABLE" &&
  supported.finalization ===
    "PASS" &&
  typeof supported.answer ===
    "string" &&
  String(
    supported.answer
  ).includes(
    proposition
  ) &&
  String(
    supported.answer
  ).includes(
    supportQuote
  ) &&
  String(
    supported.answer
  ).includes(
    "CASE-SUPPORT:"
  ) &&
  typeof supportedSummary.records ===
    "number" &&
  supportedSummary.records >= 3 &&
  supportedSummary.supported === 1 &&
  supportedSummary.verified ===
    supportedSummary.records - 1 &&
  supportedSummary.unverified === 0 &&

  fakeHttp.status === 200 &&
  fake.status === "BLOCKED" &&
  !("answer" in fake) &&
  typeof fakeSummary.records ===
    "number" &&
  fakeSummary.records >= 1 &&
  fakeSummary.verified ===
    fakeSummary.records &&
  fakeSummary.supported === 0 &&
  fakeSummary.unverified === 0 &&

  alteredHttp.status === 200 &&
  altered.status ===
    "BLOCKED" &&
  !("answer" in altered) &&
  typeof alteredSummary.records ===
    "number" &&
  alteredSummary.records >= 3 &&
  alteredSummary.supported === 1 &&
  alteredSummary.verified ===
    alteredSummary.records - 1 &&
  alteredSummary.unverified === 0 &&

  omittedHttp.status === 200 &&
  omitted.status ===
    "BLOCKED" &&
  !("answer" in omitted) &&
  typeof omittedSummary.records ===
    "number" &&
  omittedSummary.records >= 3 &&
  omittedSummary.supported === 1 &&
  omittedSummary.verified ===
    omittedSummary.records - 1 &&
  omittedSummary.unverified === 0;

process.stdout.write(
  JSON.stringify({
    gate:
      "G24_SN_PROPOSITION_EVIDENCE_LINK",
    result:
      pass
        ? "PASS"
        : "BLOCKED",
    supportedPath: {
      http:
        supportedHttp.status,
      status:
        supported.status,
      finalization:
        supported.finalization,
      verification:
        supportedSummary,
      answerReleased:
        typeof supported.answer ===
        "string",
      semanticVerification:
        false
    },
    fabricatedSupportMarker: {
      http:
        fakeHttp.status,
      status:
        fake.status,
      verification:
        fakeSummary,
      answerReleased:
        "answer" in fake
    },
    alteredProposition: {
      http:
        alteredHttp.status,
      status:
        altered.status,
      verification:
        alteredSummary,
      answerReleased:
        "answer" in altered
    },
    omittedSupportQuote: {
      http:
        omittedHttp.status,
      status:
        omitted.status,
      verification:
        omittedSummary,
      answerReleased:
        "answer" in omitted
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
