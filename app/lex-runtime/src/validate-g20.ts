import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { createLexHttpApp } from "./http/app.js";
import {
  OfficialLegalSourceVerifier
} from "./legal-source-verifier.js";
import {
  PdfTextExtractionError,
  type PdfTextExtractor
} from "./pdf-text-extractor.js";
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

const freshnessFetch:
  EliFetch =
  async (input) => {
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
            status: "obowiązujący"
          }
        }],
        "Akty zmieniające": []
      });
    }

    if (
      url.endsWith(
        "/DU/2026/795/references"
      )
    ) {
      return jsonResponse({
        "Nowelizacje po tekście jednolitym":
          []
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
        promulgation:
          "2026-06-17",
        textHTML: false,
        textPDF: true
      });
    }

    throw new Error(
      "Unexpected G20 freshness URL: " +
      url
    );
  };

class PdfProvider
implements ProviderAdapter {
  readonly id = "openai" as const;
  readonly label =
    "G20 deterministic PDF provider";
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
        "G20_REQUIRED_TOOL_MISSING"
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
              "g20-read-" +
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
        "G20_STATUTE_PREFLIGHT_READ_FAILED"
      );
    }

    const [result] =
      await params.runTools([{
        id: "g20-tool-1",
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
        sourceUrl?: string;
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
  registry:
    LexSkillRegistry,
  extractor:
    PdfTextExtractor,
  pdfFetches: string[]
) {
  const providers =
    new ProviderRegistry();
  providers.register(
    new PdfProvider()
  );

  const verifier =
    new OfficialLegalSourceVerifier(
      async (input) => {
        pdfFetches.push(
          String(input)
        );
        return new Response(
          new Uint8Array(
            [37, 80, 68, 70]
          ),
          {
            status: 200,
            headers: {
              "content-type":
                "application/pdf"
            }
          }
        );
      },
      () =>
        "2026-09-15T22:00:00.000Z",
      extractor
    );

  const freshness =
    new TemporalSourceFreshnessChecker(
      freshnessFetch,
      () =>
        "2026-09-15T22:00:00.000Z"
    );

  return createLexHttpApp({
    registry,
    modelCatalog: {
      list: async () => [{
        provider:
          "openai" as const,
        id: "g20-model",
        displayName:
          "g20-model",
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

function requestBody() {
  return {
    query:
      "Zweryfikuj art. 5 KC z urzędowego tekstu PDF.",
    provider: "openai",
    model: "g20-model",
    primarySkill: DR02,
    mode: "PRAWNIK"
  };
}

function verificationSummary(
  body:
    Record<string, unknown>
): Record<string, unknown> {
  return (
    body.verification &&
    typeof body.verification ===
      "object"
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

const goodExtractor:
  PdfTextExtractor = {
    async extract(data) {
      return {
        text:
          "Kodeks cywilny\nArt. 5. Treść przepisu.",
        pages: 4,
        bytes: data.byteLength
      };
    }
  };

const goodFetches: string[] = [];
const goodHttp =
  await request(
    appFor(
      registry,
      goodExtractor,
      goodFetches
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(requestBody());

const badExtractor:
  PdfTextExtractor = {
    async extract() {
      throw new PdfTextExtractionError(
        "No extractable text.",
        "PDF_NO_TEXT"
      );
    }
  };

const badFetches: string[] = [];
const badHttp =
  await request(
    appFor(
      registry,
      badExtractor,
      badFetches
    )
  )
    .post(
      "/api/sessions/execute"
    )
    .send(requestBody());

const good =
  goodHttp.body as
    Record<string, unknown>;
const bad =
  badHttp.body as
    Record<string, unknown>;
const goodVerification =
  verificationSummary(good);
const badVerification =
  verificationSummary(bad);

const expectedPdfUrl =
  "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf";

const pass =
  issues.length === 0 &&

  goodHttp.status === 200 &&
  good.status ===
    "DRAFT_PRESENTABLE" &&
  good.finalization === "PASS" &&
  typeof good.answer ===
    "string" &&
  String(good.answer).includes(
    expectedPdfUrl
  ) &&
  typeof goodVerification.records ===
    "number" &&
  goodVerification.records >= 1 &&
  goodVerification.verified ===
    goodVerification.records &&
  goodVerification.supported === 0 &&
  goodVerification.unverified === 0 &&
  goodFetches.length >= 1 &&
  goodFetches.every(
    (url) =>
      url === expectedPdfUrl
  ) &&

  badHttp.status === 200 &&
  bad.status === "BLOCKED" &&
  !("answer" in bad) &&
  badVerification.records === 0 &&
  badFetches.length === 1 &&
  badFetches[0] ===
    expectedPdfUrl;

process.stdout.write(
  JSON.stringify({
    gate:
      "G20_OFFICIAL_PDF_VERIFICATION",
    result:
      pass
        ? "PASS"
        : "BLOCKED",
    verifiedPdfPath: {
      http: goodHttp.status,
      status: good.status,
      finalization:
        good.finalization,
      verification:
        goodVerification,
      sourceUrl:
        goodFetches[0] ?? null,
      answerReleased:
        typeof good.answer ===
        "string",
      loadedSkills:
        good.loadedSkills,
      workflow:
        good.workflow,
      gateI:
        good.gateI,
      gateITurn:
        good.gateITurn
    },
    extractionFailurePath: {
      http: badHttp.status,
      status: bad.status,
      finalization:
        bad.finalization,
      verification:
        badVerification,
      sourceUrl:
        badFetches[0] ?? null,
      answerReleased:
        "answer" in bad,
      loadedSkills:
        bad.loadedSkills,
      workflow:
        bad.workflow,
      gateI:
        bad.gateI,
      gateITurn:
        bad.gateITurn
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
