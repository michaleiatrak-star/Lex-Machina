import {
  createHash
} from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  LocalModelRuntime
} from "./local-model-runtime.js";
import {
  scoreLegalQualityCase,
  validateLegalQualityCorpus,
  type LegalQualityCase,
  type LegalQualityCaseScore
} from "./legal-quality-benchmark-core.js";

type BenchmarkCaseResult = {
  caseId: string;
  inputTokens: number;
  targetTokens: number;
  elapsedMs: number;
  score: LegalQualityCaseScore;
};

type BenchmarkProfileResult = {
  contextTokens: number;
  result: "PASS" | "FAIL";
  startupMs: number | null;
  tokenizerCharsPerToken: number | null;
  metrics: {
    casePassRate: number;
    decisionAccuracy: number;
    issueRecall: number;
    citationRecall: number;
    citationPrecision: number;
    unknownSourceCount: number;
  };
  cases: BenchmarkCaseResult[];
  error?: string;
};

const DEFAULT_PROFILES = [
  64_000,
  128_000,
  200_000
] as const;

const FILLER = [
  "Materiał tła LEX-BENCH jest neutralnym tekstem technicznym używanym wyłącznie do kontroli długiego kontekstu.",
  "Nie zawiera dodatkowej reguły, faktu ani źródła i nie może zmienić odpowiedzi na zadanie.",
  "Właściwe rozstrzygnięcie wolno oprzeć wyłącznie na blokach oznaczonych identyfikatorem SOURCE.",
  "Jeżeli zdanie nie znajduje się w bloku SOURCE, traktuj je jako pozbawione znaczenia dla analizy."
].join(" ");

function fail(
  message: string
): never {
  throw new Error(message);
}

function argument(
  name: string
): string | undefined {
  const prefix =
    `--${name}=`;
  return process.argv
    .slice(2)
    .find((value) =>
      value.startsWith(prefix)
    )
    ?.slice(
      prefix.length
    );
}

function parseProfiles(
  value: string | undefined
): number[] {
  if (!value) {
    return [
      ...DEFAULT_PROFILES
    ];
  }
  const profiles = [
    ...new Set(
      value
        .split(",")
        .map((item) =>
          Number(
            item.trim()
          )
        )
    )
  ];
  if (
    profiles.length < 1 ||
    profiles.length > 5 ||
    profiles.some(
      (item) =>
        !Number.isInteger(item) ||
        item < 64_000 ||
        item > 200_000
    )
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_PROFILES_INVALID"
    );
  }
  return profiles.sort(
    (left, right) =>
      left - right
  );
}

async function tokenize(
  endpoint: string,
  content: string
): Promise<number> {
  const response =
    await fetch(
      `${endpoint}/tokenize`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Accept:
            "application/json"
        },
        body:
          JSON.stringify({
            content,
            add_special: false,
            parse_special: true,
            with_pieces: false
          }),
        signal:
          AbortSignal.timeout(
            60_000
          )
      }
    );
  if (!response.ok) {
    fail(
      `LEGAL_QUALITY_BENCHMARK_TOKENIZE_HTTP_${response.status}`
    );
  }
  const payload =
    await response.json() as {
      tokens?: unknown;
    };
  if (
    !Array.isArray(
      payload.tokens
    )
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_TOKENIZE_INVALID"
    );
  }
  return payload.tokens.length;
}

function repeatedFiller(
  count: number
): string {
  if (count <= 0) {
    return "";
  }
  const unit =
    `${FILLER} `;
  const repeats =
    Math.ceil(
      count /
        unit.length
    );
  return unit
    .repeat(repeats)
    .slice(0, count);
}

function responseContract(
  benchmarkCase:
    LegalQualityCase
): string {
  return [
    "Zwróć dokładnie jeden obiekt JSON, bez Markdown i bez tekstu przed/po JSON.",
    "Schemat:",
    '{"decision":"<jedna z allowedDecisions>","issues":[{"id":"<jedna z candidateIssueIds>","verdict":"<krótki identyfikator wyniku>","sources":["<SOURCE_ID>"]}]}',
    `allowedDecisions: ${benchmarkCase.allowedDecisions.join(", ")}`,
    `candidateIssueIds: ${benchmarkCase.candidateIssueIds.join(", ")}`,
    "Nie wolno tworzyć innych issue IDs ani source IDs.",
    "Wybierz tylko problemy rzeczywiście konieczne do rozstrzygnięcia.",
    "Każdy problem musi wskazać źródła, z których wynika jego rozstrzygnięcie."
  ].join("\n");
}

function buildPrompt(
  benchmarkCase:
    LegalQualityCase,
  totalChars: number
): string {
  const prefix = [
    "LEX-BENCH: KONTROLOWANY TEST ROZUMOWANIA PRAWNICZEGO.",
    "To zadanie jest fikcyjne. Nie stosuj wiedzy zewnętrznej ani prawa rzeczywistego.",
    benchmarkCase.instruction,
    responseContract(
      benchmarkCase
    ),
    "",
    "PAKIET ŹRÓDŁOWY:"
  ].join("\n");

  const sourceBlocks =
    benchmarkCase.sources.map(
      (source) =>
        [
          `[SOURCE ${source.id}]`,
          source.text,
          `[/SOURCE ${source.id}]`
        ].join("\n")
    );

  const suffix = [
    "",
    "KONIEC PAKIETU ŹRÓDŁOWEGO.",
    "Wykonaj analizę i zwróć wyłącznie JSON zgodny ze schematem."
  ].join("\n");

  const fixedChars =
    prefix.length +
    suffix.length +
    sourceBlocks.reduce(
      (sum, block) =>
        sum +
        block.length,
      0
    ) +
    Math.max(
      0,
      sourceBlocks.length - 1
    ) *
      2;

  const fillerChars =
    Math.max(
      0,
      totalChars -
        fixedChars
    );
  const gapCount =
    sourceBlocks.length + 1;
  const baseGap =
    Math.floor(
      fillerChars /
        gapCount
    );
  let remainder =
    fillerChars %
    gapCount;

  const gaps =
    Array.from(
      {
        length: gapCount
      },
      () => {
        const extra =
          remainder > 0
            ? 1
            : 0;
        if (
          remainder > 0
        ) {
          remainder -= 1;
        }
        return repeatedFiller(
          baseGap + extra
        );
      }
    );

  const parts: string[] = [
    prefix,
    gaps[0]!
  ];
  for (
    let index = 0;
    index <
      sourceBlocks.length;
    index += 1
  ) {
    parts.push(
      sourceBlocks[index]!,
      gaps[index + 1]!
    );
  }
  parts.push(suffix);

  return parts.join(
    "\n\n"
  );
}

async function fitPrompt(args: {
  endpoint: string;
  benchmarkCase:
    LegalQualityCase;
  targetTokens: number;
  charsPerToken: number;
}): Promise<{
  content: string;
  inputTokens: number;
}> {
  let chars =
    Math.max(
      4_000,
      Math.floor(
        args.targetTokens *
          args.charsPerToken
      )
    );

  for (
    let attempt = 0;
    attempt < 6;
    attempt += 1
  ) {
    const content =
      buildPrompt(
        args.benchmarkCase,
        chars
      );
    const inputTokens =
      await tokenize(
        args.endpoint,
        content
      );
    const ratio =
      inputTokens /
      args.targetTokens;

    if (
      ratio >= 0.95 &&
      ratio <= 1.0
    ) {
      return {
        content,
        inputTokens
      };
    }

    if (
      inputTokens < 1
    ) {
      fail(
        "LEGAL_QUALITY_BENCHMARK_EMPTY_TOKENIZATION"
      );
    }

    const correction =
      args.targetTokens /
      inputTokens;
    chars =
      Math.max(
        4_000,
        Math.floor(
          chars *
            correction *
            0.985
        )
      );
  }

  const content =
    buildPrompt(
      args.benchmarkCase,
      chars
    );
  const inputTokens =
    await tokenize(
      args.endpoint,
      content
    );
  if (
    inputTokens >
      args.targetTokens
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_PROMPT_TOO_LARGE"
    );
  }
  return {
    content,
    inputTokens
  };
}

async function askModel(args: {
  endpoint: string;
  modelId: string;
  content: string;
}): Promise<string> {
  const response =
    await fetch(
      `${args.endpoint}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Accept:
            "application/json"
        },
        body:
          JSON.stringify({
            model:
              args.modelId,
            messages: [
              {
                role: "user",
                content:
                  args.content
              }
            ],
            temperature: 0,
            max_tokens: 1_200,
            stream: false
          }),
        signal:
          AbortSignal.timeout(
            30 *
              60_000
          )
      }
    );
  if (!response.ok) {
    fail(
      `LEGAL_QUALITY_BENCHMARK_CHAT_HTTP_${response.status}`
    );
  }
  const payload =
    await response.json() as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };
  const output =
    payload.choices?.[0]
      ?.message
      ?.content;
  if (
    typeof output !==
      "string"
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_CHAT_INVALID"
    );
  }
  return output.trim();
}

function average(
  values: number[]
): number {
  if (
    values.length === 0
  ) {
    return 0;
  }
  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    values.length
  );
}

function aggregateProfile(
  cases:
    BenchmarkCaseResult[],
  acceptance: ReturnType<
    typeof validateLegalQualityCorpus
  >["acceptance"]
): {
  passed: boolean;
  metrics:
    BenchmarkProfileResult["metrics"];
} {
  const metrics = {
    casePassRate:
      cases.filter(
        (item) =>
          item.score.passed
      ).length /
      Math.max(
        1,
        cases.length
      ),
    decisionAccuracy:
      cases.filter(
        (item) =>
          item.score
            .decisionCorrect
      ).length /
      Math.max(
        1,
        cases.length
      ),
    issueRecall:
      average(
        cases.map(
          (item) =>
            item.score
              .issueRecall
        )
      ),
    citationRecall:
      average(
        cases.map(
          (item) =>
            item.score
              .citationRecall
        )
      ),
    citationPrecision:
      average(
        cases.map(
          (item) =>
            item.score
              .citationPrecision
        )
      ),
    unknownSourceCount:
      cases.reduce(
        (sum, item) =>
          sum +
          item.score
            .unknownSourceCount,
        0
      )
  };

  return {
    passed:
      metrics.casePassRate >=
        acceptance
          .minimumCasePassRate &&
      metrics.issueRecall >=
        acceptance
          .minimumIssueRecall &&
      metrics.citationRecall >=
        acceptance
          .minimumCitationRecall &&
      metrics.citationPrecision >=
        acceptance
          .minimumCitationPrecision &&
      metrics
        .unknownSourceCount ===
        0 &&
      (
        !acceptance
          .requireDecisionAccuracy ||
        metrics
          .decisionAccuracy ===
          1
      ),
    metrics
  };
}

async function main():
  Promise<void> {
  if (
    process.platform !==
      "win32"
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_WINDOWS_REQUIRED"
    );
  }

  const outputArg =
    argument("output");
  const corpusArg =
    argument("corpus");
  if (
    !outputArg ||
    !corpusArg
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_OUTPUT_AND_CORPUS_REQUIRED"
    );
  }

  const outputPath =
    path.resolve(
      outputArg
    );
  const corpusPath =
    path.resolve(
      corpusArg
    );
  if (
    !fs.existsSync(
      corpusPath
    )
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_CORPUS_MISSING"
    );
  }

  const corpusBytes =
    fs.readFileSync(
      corpusPath
    );
  const corpus =
    validateLegalQualityCorpus(
      JSON.parse(
        corpusBytes
          .toString("utf8")
      )
    );
  const corpusSha256 =
    createHash("sha256")
      .update(
        corpusBytes
      )
      .digest("hex");
  const profiles =
    parseProfiles(
      argument(
        "profiles"
      )
    );

  const runtime =
    new LocalModelRuntime();
  const identity =
    runtime
      .installedModelUpdateIdentity();
  if (!identity) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_MODEL_NOT_INSTALLED"
    );
  }

  const requestedModel =
    argument("model");
  if (
    requestedModel &&
    requestedModel !==
      identity.modelId
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_MODEL_MISMATCH"
    );
  }

  const modelId =
    identity.modelId;
  const originalContext =
    identity.contextTokens;
  const descriptor =
    runtime
      .listModels()
      .find(
        (model) =>
          model.id ===
            modelId &&
          model.installed
      );
  if (!descriptor) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_MODEL_DESCRIPTOR_MISSING"
    );
  }

  if (
    profiles.some(
      (profile) =>
        profile <
          descriptor
            .minimumContextWindow ||
        profile >
          descriptor
            .maximumContextWindow
    )
  ) {
    fail(
      "LEGAL_QUALITY_BENCHMARK_PROFILE_OUTSIDE_MODEL_POLICY"
    );
  }

  const results:
    BenchmarkProfileResult[] =
      [];
  let fatal:
    string | null =
      null;

  try {
    for (
      const contextTokens
      of profiles
    ) {
      const profile:
        BenchmarkProfileResult = {
          contextTokens,
          result: "FAIL",
          startupMs: null,
          tokenizerCharsPerToken:
            null,
          metrics: {
            casePassRate: 0,
            decisionAccuracy: 0,
            issueRecall: 0,
            citationRecall: 0,
            citationPrecision: 0,
            unknownSourceCount: 0
          },
          cases: []
        };

      try {
        await runtime
          .reconfigureContext(
            modelId,
            contextTokens
          );
        await runtime
          .ensureRunning(
            modelId
          );

        const status =
          runtime.status();
        const qualification =
          status.qualification;
        if (
          !qualification ||
          qualification.modelId !==
            modelId ||
          qualification
            .contextTokens !==
            contextTokens
        ) {
          fail(
            "LEGAL_QUALITY_BENCHMARK_QUALIFICATION_MISSING"
          );
        }

        profile.startupMs =
          qualification.startupMs;
        const charsPerToken =
          qualification
            .tokenizerCalibration
            ?.conservativeCharsPerToken;
        if (
          typeof charsPerToken !==
            "number" ||
          !Number.isFinite(
            charsPerToken
          ) ||
          charsPerToken < 1 ||
          charsPerToken > 3
        ) {
          fail(
            "LEGAL_QUALITY_BENCHMARK_TOKENIZER_CALIBRATION_REQUIRED"
          );
        }
        profile
          .tokenizerCharsPerToken =
          charsPerToken;

        const endpoint =
          `http://${runtime.host}:${runtime.port}`;
        const targetTokens =
          Math.floor(
            contextTokens *
              corpus.contextLoad
          );

        for (
          const benchmarkCase
          of corpus.cases
        ) {
          const fitted =
            await fitPrompt({
              endpoint,
              benchmarkCase,
              targetTokens,
              charsPerToken
            });
          const started =
            Date.now();
          const rawResponse =
            await askModel({
              endpoint,
              modelId,
              content:
                fitted.content
            });
          const elapsedMs =
            Date.now() -
            started;
          const score =
            scoreLegalQualityCase(
              benchmarkCase,
              rawResponse
            );

          profile.cases.push({
            caseId:
              benchmarkCase.id,
            inputTokens:
              fitted.inputTokens,
            targetTokens,
            elapsedMs,
            score
          });
        }

        const aggregate =
          aggregateProfile(
            profile.cases,
            corpus.acceptance
          );
        profile.metrics =
          aggregate.metrics;
        profile.result =
          aggregate.passed
            ? "PASS"
            : "FAIL";
      } catch (error) {
        profile.error =
          error instanceof Error
            ? error.message
            : String(error);
      } finally {
        await runtime.stop();
      }

      results.push(
        profile
      );
    }
  } catch (error) {
    fatal =
      error instanceof Error
        ? error.message
        : String(error);
  } finally {
    try {
      await runtime
        .reconfigureContext(
          modelId,
          originalContext
        );
      await runtime.stop();
    } catch (error) {
      fatal =
        fatal ??
        `RESTORE_FAILED:${
          error instanceof Error
            ? error.message
            : String(error)
        }`;
    }
  }

  const report = {
    schemaVersion: 1,
    kind:
      "LEX_MACHINA_LOCAL_LEGAL_QUALITY_BENCHMARK",
    corpus: {
      id:
        corpus.corpusId,
      version:
        corpus
          .corpusVersion,
      sha256:
        corpusSha256,
      confidentiality:
        corpus
          .confidentiality,
      caseCount:
        corpus.cases.length,
      contextLoad:
        corpus.contextLoad
    },
    model: {
      id: modelId,
      sha256:
        identity.sha256,
      displayName:
        descriptor.displayName,
      nativeContextWindow:
        descriptor
          .nativeContextWindow,
      quantization:
        descriptor.quantization
    },
    hardware:
      runtime
        .hardwareProfile(),
    acceptance:
      corpus.acceptance,
    privacy: {
      rawPromptsStored: false,
      rawResponsesStored: false,
      reportContainsCaseContent: false,
      responseIntegrity:
        "SHA256_ONLY"
    },
    originalContext,
    profiles: results,
    fatalError: fatal,
    generatedAt:
      new Date()
        .toISOString()
  };

  fs.mkdirSync(
    path.dirname(
      outputPath
    ),
    {
      recursive: true
    }
  );
  const temporary =
    `${outputPath}.tmp`;
  fs.writeFileSync(
    temporary,
    `${JSON.stringify(
      report,
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.renameSync(
    temporary,
    outputPath
  );

  const passed =
    !fatal &&
    results.length ===
      profiles.length &&
    results.every(
      (profile) =>
        profile.result ===
          "PASS"
    );

  console.log(
    JSON.stringify(
      {
        result:
          passed
            ? "PASS"
            : "FAIL",
        outputPath,
        corpusId:
          corpus.corpusId,
        modelId,
        profiles:
          results.map(
            (profile) => ({
              contextTokens:
                profile
                  .contextTokens,
              result:
                profile.result,
              casePassRate:
                profile
                  .metrics
                  .casePassRate,
              decisionAccuracy:
                profile
                  .metrics
                  .decisionAccuracy
            })
          )
      },
      null,
      2
    )
  );

  if (!passed) {
    process.exitCode = 1;
  }
}

void main().catch(
  (error) => {
    console.error(
      error instanceof Error
        ? error.stack
        : String(error)
    );
    process.exitCode = 1;
  }
);
