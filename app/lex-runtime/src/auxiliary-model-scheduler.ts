import type {
  NormalizedToolCall,
  NormalizedToolResult,
  ProviderId
} from "./providers/types.js";
import type {
  ProviderGateway
} from "./providers/gateway.js";
import {
  detectHistoricalAsOf
} from "./gate-i-auto-verification.js";

export type AuxiliaryRoutingConfig = {
  enabled: boolean;
  provider: ProviderId;
  model: string;
};

export type AuxiliaryTask =
  | "LEGAL_REFERENCE_PREFLIGHT";

export type AuxiliaryRoutingSummary = {
  enabled: boolean;
  provider: ProviderId;
  model: string;
  status:
    | "DISABLED"
    | "SKIPPED_NO_ELIGIBLE_TASK"
    | "SKIPPED_SAME_AS_PRIMARY"
    | "PASS"
    | "FAILED";
  tasks: AuxiliaryTask[];
  extractedCandidates: number;
  deterministicVerifications: number;
  cachedVerifierReuses: number;
  latencyMs: number;
  error?: string;
};

export type AuxiliaryPreflightResult = {
  summary: AuxiliaryRoutingSummary;
  appendix: string;
  cachedVerificationResults: Map<
    string,
    NormalizedToolResult
  >;
};

type Candidate =
  | {
      kind: "statute" | "journal";
      claim: string;
      act: string;
      asOf?: string;
    }
  | {
      kind: "case";
      claim: string;
      signature: string;
      courtFamily: "SN";
    };

const MAX_AUX_TEXT = 12_000;
const MAX_CANDIDATES = 8;
const MAX_RESULT_TEXT = 24_000;
const LEGAL_HINT =
  /(?:\bart\.?\s*\d+[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*|\bdz\.?\s*u\.?\b|\bsygn\.?\b|\b[IVXLCDM]{1,5}\s+[A-ZĄĆĘŁŃÓŚŹŻ]{1,12}\s+\d+\/\d{2,4}\b)/iu;
const SAFE_DATE =
  /^\d{4}-\d{2}-\d{2}$/;

function normalized(
  value: string
): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}

function bounded(
  value: unknown,
  max: number
): string {
  return typeof value === "string"
    ? normalized(value).slice(0, max)
    : "";
}

function parseJsonObject(
  text: string
): unknown {
  const trimmed =
    text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start =
      trimmed.indexOf("{");
    const end =
      trimmed.lastIndexOf("}");
    if (
      start >= 0 &&
      end > start
    ) {
      try {
        return JSON.parse(
          trimmed.slice(
            start,
            end + 1
          )
        );
      } catch {
        return null;
      }
    }
    return null;
  }
}

function parseCandidates(
  text: string,
  sourceText: string
): Candidate[] {
  const value =
    parseJsonObject(text);
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return [];
  }

  const raw =
    (value as {
      references?: unknown;
    }).references;
  if (!Array.isArray(raw)) {
    return [];
  }

  const result:
    Candidate[] = [];
  const seen =
    new Set<string>();
  const sourceNormalized =
    normalized(sourceText)
      .toLocaleLowerCase(
        "pl"
      );
  const requestedAsOf =
    detectHistoricalAsOf(
      sourceText
    );

  for (
    const item
    of raw.slice(
      0,
      MAX_CANDIDATES
    )
  ) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      continue;
    }
    const record =
      item as Record<
        string,
        unknown
      >;
    const kind =
      record.kind;
    const claim =
      bounded(
        record.claim,
        300
      );
    if (
      !claim ||
      !sourceNormalized
        .includes(
          claim.toLocaleLowerCase(
            "pl"
          )
        )
    ) {
      continue;
    }

    if (
      kind === "statute" ||
      kind === "journal"
    ) {
      const act =
        bounded(
          record.act,
          240
        );
      if (!act) {
        continue;
      }
      const modelAsOf =
        bounded(
          record.asOf,
          10
        );
      if (
        modelAsOf &&
        (
          !SAFE_DATE.test(
            modelAsOf
          ) ||
          !sourceNormalized
            .includes(
              modelAsOf
                .toLocaleLowerCase(
                  "pl"
                )
            )
        )
      ) {
        continue;
      }
      if (
        requestedAsOf &&
        modelAsOf &&
        modelAsOf !==
          requestedAsOf
      ) {
        continue;
      }
      const asOf =
        requestedAsOf ??
        modelAsOf;
      const key =
        [
          kind,
          claim.toLocaleLowerCase(
            "pl"
          ),
          act.toLocaleLowerCase(
            "pl"
          ),
          asOf
        ].join("|");
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      result.push({
        kind,
        claim,
        act,
        ...(asOf
          ? { asOf }
          : {})
      });
      continue;
    }

    if (kind === "case") {
      const signature =
        bounded(
          record.signature,
          120
        );
      const courtFamily =
        record.courtFamily;
      if (
        !signature ||
        courtFamily !== "SN" ||
        !sourceNormalized
          .includes(
            signature
              .toLocaleLowerCase(
                "pl"
              )
          )
      ) {
        continue;
      }
      const key =
        [
          "case",
          claim.toLocaleLowerCase(
            "pl"
          ),
          signature.toLocaleLowerCase(
            "pl"
          )
        ].join("|");
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      result.push({
        kind: "case",
        claim,
        signature,
        courtFamily: "SN"
      });
    }
  }

  return result;
}

function callForCandidate(
  candidate: Candidate,
  index: number
): NormalizedToolCall {
  if (
    candidate.kind ===
      "case"
  ) {
    return {
      id:
        `aux-case-${index}`,
      name:
        "verify_case_reference",
      input: {
        claim:
          candidate.claim,
        signature:
          candidate.signature,
        courtFamily:
          candidate.courtFamily
      }
    };
  }

  return {
    id:
      `aux-legal-${index}`,
    name:
      "verify_legal_reference",
    input: {
      claim:
        candidate.claim,
      kind:
        candidate.kind,
      act:
        candidate.act,
      ...(candidate.asOf
        ? {
            asOf:
              candidate.asOf
          }
        : {})
    }
  };
}

function stableValue(
  value: unknown
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      stableValue
    );
  }
  if (
    value &&
    typeof value ===
      "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value as Record<
          string,
          unknown
        >
      )
        .filter(
          ([key]) =>
            key !==
            "toolCallId"
        )
        .sort(
          ([left], [right]) =>
            left.localeCompare(
              right,
              "en"
            )
        )
        .map(
          ([key, item]) => [
            key,
            stableValue(item)
          ]
        )
    );
  }
  return value;
}

export function auxiliaryVerificationCallKey(
  call: Pick<
    NormalizedToolCall,
    "name" | "input"
  >
): string {
  return [
    call.name,
    JSON.stringify(
      stableValue(
        call.input
      )
    )
  ].join("|");
}

function defaultSummary(
  config: AuxiliaryRoutingConfig,
  status:
    AuxiliaryRoutingSummary["status"]
): AuxiliaryRoutingSummary {
  return {
    enabled:
      config.enabled,
    provider:
      config.provider,
    model:
      config.model,
    status,
    tasks: [],
    extractedCandidates: 0,
    deterministicVerifications: 0,
    cachedVerifierReuses: 0,
    latencyMs: 0
  };
}

const SYSTEM_PROMPT = [
  "You are a bounded parser used inside a deterministic legal workflow.",
  "Do NOT answer the legal question, interpret law, recommend strategy, summarize facts, or draft prose.",
  "Extract only explicit Polish legal references present in the user's current message.",
  "Return one JSON object and nothing else: {\"references\":[...]}",
  "Allowed items:",
  "{\"kind\":\"statute\",\"claim\":\"exact reference text\",\"act\":\"act alias/title\",\"asOf\":\"YYYY-MM-DD optional\"}",
  "{\"kind\":\"journal\",\"claim\":\"exact Dz.U. reference\",\"act\":\"act alias/title\",\"asOf\":\"YYYY-MM-DD optional\"}",
  "{\"kind\":\"case\",\"claim\":\"exact case citation\",\"signature\":\"raw signature\",\"courtFamily\":\"SN\"}",
  "Do not invent missing article numbers, act names, dates, signatures or courts.",
  "Only courtFamily=SN is currently accepted for direct case verification.",
  "Maximum 8 references."
].join("\n");

export class AuxiliaryModelScheduler {
  constructor(
    private readonly providers:
      ProviderGateway
  ) {}

  async preflight(args: {
    config:
      AuxiliaryRoutingConfig;
    primary: {
      provider: ProviderId;
      model: string;
    };
    currentUserText: string;
    runVerificationTools?: (
      calls:
        NormalizedToolCall[]
    ) => Promise<
      NormalizedToolResult[]
    >;
  }): Promise<AuxiliaryPreflightResult> {
    const startedAt =
      Date.now();
    const timed = (
      summary:
        AuxiliaryRoutingSummary
    ): AuxiliaryRoutingSummary => ({
      ...summary,
      latencyMs:
        Math.max(
          0,
          Date.now() -
            startedAt
        )
    });

    const empty =
      new Map<
        string,
        NormalizedToolResult
      >();

    if (!args.config.enabled) {
      return {
        summary:
          timed(defaultSummary(
            args.config,
            "DISABLED"
          )),
        appendix: "",
        cachedVerificationResults:
          empty
      };
    }

    if (
      args.config.provider ===
        args.primary.provider &&
      args.config.model ===
        args.primary.model
    ) {
      return {
        summary:
          timed(defaultSummary(
            args.config,
            "SKIPPED_SAME_AS_PRIMARY"
          )),
        appendix: "",
        cachedVerificationResults:
          empty
      };
    }

    const currentText =
      normalized(
        args.currentUserText
      ).slice(
        0,
        MAX_AUX_TEXT
      );
    if (
      !currentText ||
      !LEGAL_HINT.test(
        currentText
      ) ||
      !args.runVerificationTools
    ) {
      return {
        summary:
          timed(defaultSummary(
            args.config,
            "SKIPPED_NO_ELIGIBLE_TASK"
          )),
        appendix: "",
        cachedVerificationResults:
          empty
      };
    }

    try {
      const response =
        await this.providers.stream(
          args.config.provider,
          {
            model:
              args.config.model,
            systemPrompt:
              SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content:
                  currentText
              }
            ],
            maxIterations: 1,
            reasoning: "none"
          }
        );

      const candidates =
        parseCandidates(
          response.fullText.slice(
            0,
            MAX_RESULT_TEXT
          ),
          currentText
        );
      if (
        candidates.length === 0
      ) {
        return {
          summary: timed({
            ...defaultSummary(
              args.config,
              "PASS"
            ),
            tasks: [
              "LEGAL_REFERENCE_PREFLIGHT"
            ],
            extractedCandidates: 0
          }),
          appendix: "",
          cachedVerificationResults:
            empty
        };
      }

      const calls =
        candidates.map(
          callForCandidate
        );
      const results =
        await args
          .runVerificationTools(
            calls
          );

      const cache =
        new Map<
          string,
          NormalizedToolResult
        >();
      calls.forEach(
        (call, index) => {
          const result =
            results[index];
          if (result) {
            cache.set(
              auxiliaryVerificationCallKey(
                call
              ),
              {
                ...result,
                tool_use_id:
                  call.id
              }
            );
          }
        }
      );

      const appendix =
        results.length > 0
          ? [
              "PROGRAM-CONTROLLED AUXILIARY PREFLIGHT:",
              "The auxiliary model only extracted candidate references from the current user message. Its raw output is not evidence.",
              "The following JSON lines are outputs of deterministic runtime verification. Reuse them for the same exact reference and do not repeat an identical verification call.",
              ...results.map(
                (result) =>
                  result.content
              )
            ].join("\n")
          : "";

      return {
        summary: timed({
          ...defaultSummary(
            args.config,
            "PASS"
          ),
          tasks: [
            "LEGAL_REFERENCE_PREFLIGHT"
          ],
          extractedCandidates:
            candidates.length,
          deterministicVerifications:
            results.length
        }),
        appendix,
        cachedVerificationResults:
          cache
      };
    } catch (error) {
      return {
        summary: timed({
          ...defaultSummary(
            args.config,
            "FAILED"
          ),
          tasks: [
            "LEGAL_REFERENCE_PREFLIGHT"
          ],
          error:
            error instanceof Error
              ? error.message.slice(
                  0,
                  240
                )
              : "AUXILIARY_PREFLIGHT_FAILED"
        }),
        appendix: "",
        cachedVerificationResults:
          empty
      };
    }
  }
}
