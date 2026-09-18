import {
  createHash
} from "node:crypto";

export type LegalQualitySource = {
  id: string;
  text: string;
};

export type LegalQualityExpectedIssue = {
  id: string;
  verdict: string;
  requiredSources: string[];
};

export type LegalQualityCase = {
  id: string;
  title: string;
  instruction: string;
  candidateIssueIds: string[];
  allowedDecisions: string[];
  sources: LegalQualitySource[];
  expected: {
    decision: string;
    issues: LegalQualityExpectedIssue[];
  };
};

export type LegalQualityCorpus = {
  schemaVersion: 1;
  kind:
    "LEX_MACHINA_LEGAL_QUALITY_BENCHMARK";
  corpusId: string;
  corpusVersion: string;
  confidentiality:
    | "SYNTHETIC"
    | "EXPERT_PRIVATE";
  contextLoad: number;
  acceptance: {
    minimumCasePassRate: number;
    minimumIssueRecall: number;
    minimumCitationRecall: number;
    minimumCitationPrecision: number;
    requireDecisionAccuracy:
      boolean;
  };
  cases: LegalQualityCase[];
};

export type LegalQualityModelIssue = {
  id: string;
  verdict: string;
  sources: string[];
};

export type LegalQualityModelAnswer = {
  decision: string;
  issues: LegalQualityModelIssue[];
};

export type LegalQualityCaseScore = {
  caseId: string;
  passed: boolean;
  decisionCorrect: boolean;
  issueRecall: number;
  citationRecall: number;
  citationPrecision: number;
  unknownSourceCount: number;
  missingIssueIds: string[];
  unexpectedIssueIds: string[];
  responseSha256: string;
  parseError?: string;
};

const SAFE_ID =
  /^[A-Za-z0-9._:-]{2,120}$/;
const SAFE_TEXT =
  /^[^\x00-\x08\x0b\x0c\x0e-\x1f\x7f]{1,20000}$/;

function finiteRatio(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

function uniqueStrings(
  value: unknown,
  maxItems: number
): string[] | null {
  if (
    !Array.isArray(value) ||
    value.length < 1 ||
    value.length > maxItems
  ) {
    return null;
  }
  const items: string[] = [];
  const seen =
    new Set<string>();
  for (const item of value) {
    if (
      typeof item !== "string" ||
      !SAFE_ID.test(item) ||
      seen.has(item)
    ) {
      return null;
    }
    seen.add(item);
    items.push(item);
  }
  return items;
}

export function validateLegalQualityCorpus(
  value: unknown
): LegalQualityCorpus {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      "LEGAL_QUALITY_CORPUS_INVALID"
    );
  }
  const corpus =
    value as Record<string, unknown>;
  const acceptance =
    corpus.acceptance &&
    typeof corpus.acceptance ===
      "object" &&
    !Array.isArray(
      corpus.acceptance
    )
      ? corpus.acceptance as
          Record<string, unknown>
      : null;
  const cases =
    Array.isArray(corpus.cases)
      ? corpus.cases
      : null;

  if (
    corpus.schemaVersion !== 1 ||
    corpus.kind !==
      "LEX_MACHINA_LEGAL_QUALITY_BENCHMARK" ||
    typeof corpus.corpusId !==
      "string" ||
    !SAFE_ID.test(
      corpus.corpusId
    ) ||
    typeof corpus.corpusVersion !==
      "string" ||
    !SAFE_ID.test(
      corpus.corpusVersion
    ) ||
    ![
      "SYNTHETIC",
      "EXPERT_PRIVATE"
    ].includes(
      String(
        corpus.confidentiality
      )
    ) ||
    typeof corpus.contextLoad !==
      "number" ||
    corpus.contextLoad < 0.25 ||
    corpus.contextLoad > 0.8 ||
    !acceptance ||
    !finiteRatio(
      acceptance
        .minimumCasePassRate
    ) ||
    !finiteRatio(
      acceptance
        .minimumIssueRecall
    ) ||
    !finiteRatio(
      acceptance
        .minimumCitationRecall
    ) ||
    !finiteRatio(
      acceptance
        .minimumCitationPrecision
    ) ||
    typeof acceptance
      .requireDecisionAccuracy !==
      "boolean" ||
    !cases ||
    cases.length < 1 ||
    cases.length > 64
  ) {
    throw new Error(
      "LEGAL_QUALITY_CORPUS_INVALID"
    );
  }

  const parsedCases:
    LegalQualityCase[] = [];
  const caseIds =
    new Set<string>();

  for (const item of cases) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(
        "LEGAL_QUALITY_CASE_INVALID"
      );
    }
    const record =
      item as Record<
        string,
        unknown
      >;
    const caseId =
      typeof record.id === "string"
        ? record.id
        : "";
    const candidates =
      uniqueStrings(
        record.candidateIssueIds,
        32
      );
    const decisions =
      uniqueStrings(
        record.allowedDecisions,
        16
      );
    const sources =
      Array.isArray(record.sources)
        ? record.sources
        : null;
    const expected =
      record.expected &&
      typeof record.expected ===
        "object" &&
      !Array.isArray(
        record.expected
      )
        ? record.expected as
            Record<string, unknown>
        : null;
    const expectedIssues =
      expected &&
      Array.isArray(
        expected.issues
      )
        ? expected.issues
        : null;

    if (
      !SAFE_ID.test(caseId) ||
      caseIds.has(caseId) ||
      typeof record.title !==
        "string" ||
      !SAFE_TEXT.test(
        record.title
      ) ||
      typeof record.instruction !==
        "string" ||
      !SAFE_TEXT.test(
        record.instruction
      ) ||
      !candidates ||
      !decisions ||
      !sources ||
      sources.length < 1 ||
      sources.length > 64 ||
      !expected ||
      typeof expected.decision !==
        "string" ||
      !decisions.includes(
        expected.decision
      ) ||
      !expectedIssues ||
      expectedIssues.length < 1 ||
      expectedIssues.length > 32
    ) {
      throw new Error(
        "LEGAL_QUALITY_CASE_INVALID"
      );
    }

    const parsedSources:
      LegalQualitySource[] = [];
    const sourceIds =
      new Set<string>();
    for (const source of sources) {
      if (
        !source ||
        typeof source !==
          "object" ||
        Array.isArray(source)
      ) {
        throw new Error(
          "LEGAL_QUALITY_SOURCE_INVALID"
        );
      }
      const s =
        source as Record<
          string,
          unknown
        >;
      if (
        typeof s.id !==
          "string" ||
        !SAFE_ID.test(s.id) ||
        sourceIds.has(s.id) ||
        typeof s.text !==
          "string" ||
        !SAFE_TEXT.test(s.text)
      ) {
        throw new Error(
          "LEGAL_QUALITY_SOURCE_INVALID"
        );
      }
      sourceIds.add(s.id);
      parsedSources.push({
        id: s.id,
        text: s.text
      });
    }

    const parsedExpected:
      LegalQualityExpectedIssue[] =
        [];
    const expectedIds =
      new Set<string>();
    for (
      const expectedIssue
      of expectedIssues
    ) {
      if (
        !expectedIssue ||
        typeof expectedIssue !==
          "object" ||
        Array.isArray(
          expectedIssue
        )
      ) {
        throw new Error(
          "LEGAL_QUALITY_EXPECTED_INVALID"
        );
      }
      const e =
        expectedIssue as Record<
          string,
          unknown
        >;
      const requiredSources =
        uniqueStrings(
          e.requiredSources,
          32
        );
      if (
        typeof e.id !==
          "string" ||
        !candidates.includes(e.id) ||
        expectedIds.has(e.id) ||
        typeof e.verdict !==
          "string" ||
        !SAFE_ID.test(
          e.verdict
        ) ||
        !requiredSources ||
        requiredSources.some(
          (sourceId) =>
            !sourceIds.has(
              sourceId
            )
        )
      ) {
        throw new Error(
          "LEGAL_QUALITY_EXPECTED_INVALID"
        );
      }
      expectedIds.add(e.id);
      parsedExpected.push({
        id: e.id,
        verdict: e.verdict,
        requiredSources
      });
    }

    caseIds.add(caseId);
    parsedCases.push({
      id: caseId,
      title: record.title,
      instruction:
        record.instruction,
      candidateIssueIds:
        candidates,
      allowedDecisions:
        decisions,
      sources: parsedSources,
      expected: {
        decision:
          expected.decision,
        issues:
          parsedExpected
      }
    });
  }

  return {
    schemaVersion: 1,
    kind:
      "LEX_MACHINA_LEGAL_QUALITY_BENCHMARK",
    corpusId:
      corpus.corpusId as string,
    corpusVersion:
      corpus.corpusVersion as string,
    confidentiality:
      corpus.confidentiality as
        LegalQualityCorpus["confidentiality"],
    contextLoad:
      corpus.contextLoad as number,
    acceptance: {
      minimumCasePassRate:
        acceptance.minimumCasePassRate as number,
      minimumIssueRecall:
        acceptance.minimumIssueRecall as number,
      minimumCitationRecall:
        acceptance.minimumCitationRecall as number,
      minimumCitationPrecision:
        acceptance.minimumCitationPrecision as number,
      requireDecisionAccuracy:
        acceptance.requireDecisionAccuracy as boolean
    },
    cases: parsedCases
  };
}

export function parseLegalQualityAnswer(
  raw: string
): LegalQualityModelAnswer {
  let value: unknown;
  try {
    value = JSON.parse(
      raw.trim()
    );
  } catch {
    throw new Error(
      "LEGAL_QUALITY_RESPONSE_JSON_INVALID"
    );
  }
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      "LEGAL_QUALITY_RESPONSE_SCHEMA_INVALID"
    );
  }
  const record =
    value as Record<
      string,
      unknown
    >;
  if (
    typeof record.decision !==
      "string" ||
    !Array.isArray(
      record.issues
    ) ||
    record.issues.length > 32
  ) {
    throw new Error(
      "LEGAL_QUALITY_RESPONSE_SCHEMA_INVALID"
    );
  }

  const issues:
    LegalQualityModelIssue[] = [];
  const seen =
    new Set<string>();
  for (
    const item
    of record.issues
  ) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(
        "LEGAL_QUALITY_RESPONSE_SCHEMA_INVALID"
      );
    }
    const issue =
      item as Record<
        string,
        unknown
      >;
    const sources =
      uniqueStrings(
        issue.sources,
        32
      );
    if (
      typeof issue.id !==
        "string" ||
      !SAFE_ID.test(
        issue.id
      ) ||
      seen.has(issue.id) ||
      typeof issue.verdict !==
        "string" ||
      !SAFE_ID.test(
        issue.verdict
      ) ||
      !sources
    ) {
      throw new Error(
        "LEGAL_QUALITY_RESPONSE_SCHEMA_INVALID"
      );
    }
    seen.add(issue.id);
    issues.push({
      id: issue.id,
      verdict:
        issue.verdict,
      sources
    });
  }

  return {
    decision:
      record.decision,
    issues
  };
}

export function scoreLegalQualityCase(
  benchmarkCase:
    LegalQualityCase,
  rawResponse: string
): LegalQualityCaseScore {
  const responseSha256 =
    createHash("sha256")
      .update(
        rawResponse,
        "utf8"
      )
      .digest("hex");

  let answer:
    LegalQualityModelAnswer;
  try {
    answer =
      parseLegalQualityAnswer(
        rawResponse
      );
  } catch (error) {
    return {
      caseId:
        benchmarkCase.id,
      passed: false,
      decisionCorrect: false,
      issueRecall: 0,
      citationRecall: 0,
      citationPrecision: 0,
      unknownSourceCount: 0,
      missingIssueIds:
        benchmarkCase.expected
          .issues.map(
            (issue) =>
              issue.id
          ),
      unexpectedIssueIds: [],
      responseSha256,
      parseError:
        error instanceof Error
          ? error.message
          : String(error)
    };
  }

  const expectedById =
    new Map(
      benchmarkCase.expected
        .issues.map(
          (issue) => [
            issue.id,
            issue
          ]
        )
    );
  const actualById =
    new Map(
      answer.issues.map(
        (issue) => [
          issue.id,
          issue
        ]
      )
    );
  const missingIssueIds =
    [...expectedById.keys()]
      .filter(
        (id) =>
          !actualById.has(id)
      );
  const unexpectedIssueIds =
    [...actualById.keys()]
      .filter(
        (id) =>
          !benchmarkCase
            .candidateIssueIds
            .includes(id) ||
          !expectedById.has(id)
      );

  let issueMatches = 0;
  let requiredCitations = 0;
  let matchedRequiredCitations = 0;
  let actualCitations = 0;
  let validActualCitations = 0;
  let unknownSourceCount = 0;
  const knownSources =
    new Set(
      benchmarkCase.sources.map(
        (source) =>
          source.id
      )
    );

  for (
    const [id, expected]
    of expectedById
  ) {
    const actual =
      actualById.get(id);
    if (
      actual &&
      actual.verdict ===
        expected.verdict
    ) {
      issueMatches += 1;
    }
    const actualSources =
      new Set(
        actual?.sources ?? []
      );
    requiredCitations +=
      expected
        .requiredSources.length;
    for (
      const sourceId
      of expected.requiredSources
    ) {
      if (
        actualSources.has(
          sourceId
        )
      ) {
        matchedRequiredCitations +=
          1;
      }
    }
  }

  for (
    const issue
    of answer.issues
  ) {
    const expectedIssue =
      expectedById.get(
        issue.id
      );
    const allowedForIssue =
      new Set(
        expectedIssue
          ?.requiredSources ??
          []
      );
    for (
      const sourceId
      of issue.sources
    ) {
      actualCitations += 1;
      if (
        !knownSources.has(
          sourceId
        )
      ) {
        unknownSourceCount +=
          1;
      }
      if (
        allowedForIssue.has(
          sourceId
        )
      ) {
        validActualCitations +=
          1;
      }
    }
  }

  const issueRecall =
    expectedById.size === 0
      ? 1
      : issueMatches /
        expectedById.size;
  const citationRecall =
    requiredCitations === 0
      ? 1
      : matchedRequiredCitations /
        requiredCitations;
  const citationPrecision =
    actualCitations === 0
      ? 0
      : validActualCitations /
        actualCitations;
  const decisionCorrect =
    answer.decision ===
      benchmarkCase.expected
        .decision;

  const passed =
    decisionCorrect &&
    issueRecall === 1 &&
    citationRecall === 1 &&
    citationPrecision === 1 &&
    unknownSourceCount === 0 &&
    missingIssueIds.length === 0 &&
    unexpectedIssueIds.length === 0;

  return {
    caseId:
      benchmarkCase.id,
    passed,
    decisionCorrect,
    issueRecall,
    citationRecall,
    citationPrecision,
    unknownSourceCount,
    missingIssueIds,
    unexpectedIssueIds,
    responseSha256
  };
}
