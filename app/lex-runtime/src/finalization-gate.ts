import {
  VerificationLedger,
  type VerificationRecord
} from "./verification-ledger.js";

export type DetectedLegalReference = {
  claim: string;
  kind: "statute" | "journal" | "case";
  line: number;
  lineText: string;
};

export type FinalizationFinding = {
  reference: DetectedLegalReference;
  status:
    | "VERIFIED"
    | "UNVERIFIED_MARKED"
    | "MISSING_LEDGER_RECORD"
    | "MISSING_VERIFICATION_MARKER"
    | "VERIFICATION_MARKER_MISMATCH"
    | "UNVERIFIED_NOT_MARKED";
  record?: VerificationRecord;
};

export type CaseQuoteFinding = {
  evidenceHash: string;
  line: number;
  lineText: string;
  status:
    | "VERIFIED"
    | "MISSING_CASE_QUOTE_LEDGER"
    | "QUOTE_TEXT_MISMATCH"
    | "CASE_SIGNATURE_MISSING";
  record?: VerificationRecord;
};

export type CaseSupportFinding = {
  evidenceHash: string;
  line: number;
  lineText: string;
  status:
    | "SUPPORTED"
    | "MISSING_CASE_SUPPORT_LEDGER"
    | "PROPOSITION_TEXT_MISMATCH"
    | "SUPPORT_QUOTE_MISSING"
    | "CASE_SIGNATURE_MISSING";
  record?: VerificationRecord;
};

export type FinalizationReport = {
  gate: "G8_HARD_GATE_FINALIZATION";
  result: "PASS" | "DEGRADED" | "BLOCKED";
  references: DetectedLegalReference[];
  findings: FinalizationFinding[];
  caseQuoteFindings: CaseQuoteFinding[];
  caseSupportFindings: CaseSupportFinding[];
};

const VERIFIED_MARKER = /✅\s*\[VER:/iu;
const VERIFIED_MARKER_TOKEN =
  /✅\s*\[VER:[^\]\r\n]+\]/giu;
const UNVERIFIED_MARKER = /⚠️?\s*\[NIEWERYFIKOWANE\]/iu;
const CASE_QUOTE_MARKER =
  /✅\s*\[CASE-QUOTE:([a-f0-9]{20})\]/giu;
const CASE_SUPPORT_MARKER =
  /🔗\s*\[CASE-SUPPORT:([a-f0-9]{20})\]/giu;

function expectedVerificationMarker(
  record: VerificationRecord
): string | null {
  if (
    record.status !== "VERIFIED" ||
    !record.sourceUrl?.trim() ||
    !record.fetchedAt?.trim()
  ) {
    return null;
  }

  return [
    "✅ [VER: ",
    record.sourceUrl,
    ", ",
    record.fetchedAt.slice(0, 10),
    record.asOf
      ? `, STAN NA ${record.asOf}`
      : "",
    "]"
  ].join("");
}

const ARTICLE_PATTERN =
  /\bart\.?\s+\d+[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*(?:\s*§\s*\d+[a-zA-Z]*)?(?:\s+(?:KC|KPC|KK|KPK|KPA|KP|KRO|KSH|KW|KPW|PZP))?/giu;

const DZU_PATTERN =
  /\bDz\.?\s*U\.?\s*(?:(?:z\s+)?\d{4}\s*r?\.?\s*)?poz\.?\s*\d+/giu;

const CASE_PATTERN =
  /\bsygn\.?\s*(?:akt\s*)?[A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,8}(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,12}){0,3}\s+\d+\/\d{2,4}\b/gu;

function normalizeEvidenceText(
  value: string
): string {
  return value
    .normalize("NFKC")
    .toLocaleUpperCase("pl")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function collectMatches(
  lineText: string,
  line: number,
  kind: DetectedLegalReference["kind"],
  pattern: RegExp
): DetectedLegalReference[] {
  const references: DetectedLegalReference[] = [];
  pattern.lastIndex = 0;
  for (const match of lineText.matchAll(pattern)) {
    const claim = match[0]?.trim();
    if (!claim) continue;
    references.push({ claim, kind, line, lineText });
  }
  return references;
}

export function detectLegalReferences(text: string): DetectedLegalReference[] {
  const references: DetectedLegalReference[] = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((lineText, index) => {
    const line = index + 1;
    references.push(
      ...collectMatches(lineText, line, "statute", ARTICLE_PATTERN),
      ...collectMatches(lineText, line, "journal", DZU_PATTERN),
      ...collectMatches(lineText, line, "case", CASE_PATTERN)
    );
  });

  return references;
}

export class FinalizationGate {
  evaluate(text: string, ledger: VerificationLedger): FinalizationReport {
    const references = detectLegalReferences(text);
    const findings: FinalizationFinding[] = [];
    const caseQuoteFindings: CaseQuoteFinding[] = [];
    const caseSupportFindings: CaseSupportFinding[] = [];

    for (const reference of references) {
      const lineMarkers =
        reference.lineText.match(
          VERIFIED_MARKER_TOKEN
        ) ?? [];
      const allowedLineMarkers =
        new Set(
          references
            .filter(
              (candidate) =>
                candidate.line ===
                  reference.line
            )
            .map(
              (candidate) =>
                ledger.latest(
                  candidate.claim
                )
            )
            .filter(
              (
                candidate
              ): candidate is VerificationRecord =>
                candidate?.status ===
                  "VERIFIED"
            )
            .map(
              expectedVerificationMarker
            )
            .filter(
              (
                marker
              ): marker is string =>
                Boolean(marker)
            )
        );
      const unexpectedLineMarker =
        lineMarkers.some(
          (marker) =>
            !allowedLineMarkers.has(
              marker
            )
        );

      const record = ledger.latest(reference.claim);
      if (!record) {
        findings.push({
          reference,
          status: "MISSING_LEDGER_RECORD"
        });
        continue;
      }

      if (record.status === "VERIFIED") {
        const expectedMarker =
          expectedVerificationMarker(
            record
          );

        if (!VERIFIED_MARKER.test(reference.lineText)) {
          findings.push({
            reference,
            status: "MISSING_VERIFICATION_MARKER",
            record
          });
        } else if (
          !expectedMarker ||
          !lineMarkers.includes(
            expectedMarker
          ) ||
          unexpectedLineMarker
        ) {
          findings.push({
            reference,
            status:
              "VERIFICATION_MARKER_MISMATCH",
            record
          });
        } else {
          findings.push({
            reference,
            status: "VERIFIED",
            record
          });
        }
        continue;
      }

      if (UNVERIFIED_MARKER.test(reference.lineText)) {
        findings.push({
          reference,
          status: "UNVERIFIED_MARKED",
          record
        });
      } else {
        findings.push({
          reference,
          status: "UNVERIFIED_NOT_MARKED",
          record
        });
      }
    }

    const lines = text.split(/\r?\n/u);

    lines.forEach((lineText, index) => {
      CASE_QUOTE_MARKER.lastIndex = 0;

      for (
        const match of lineText.matchAll(
          CASE_QUOTE_MARKER
        )
      ) {
        const evidenceHash =
          match[1] ?? "";
        if (!evidenceHash) {
          continue;
        }

        const record =
          ledger.all().find(
            (candidate) =>
              candidate.status ===
                "VERIFIED" &&
              candidate.kind === "case" &&
              candidate.caseScope ===
                "EXACT_QUOTE" &&
              candidate.evidenceHash ===
                evidenceHash
          );

        if (!record) {
          caseQuoteFindings.push({
            evidenceHash,
            line: index + 1,
            lineText,
            status:
              "MISSING_CASE_QUOTE_LEDGER"
          });
          continue;
        }

        if (
          !record.claim ||
          !lineText.includes(
            record.claim
          )
        ) {
          caseQuoteFindings.push({
            evidenceHash,
            line: index + 1,
            lineText,
            status:
              "QUOTE_TEXT_MISMATCH",
            record
          });
          continue;
        }

        const normalizedLine =
          normalizeEvidenceText(lineText);
        const normalizedSignature =
          normalizeEvidenceText(
            record.caseSignature ?? ""
          );

        if (
          !normalizedSignature ||
          !normalizedLine.includes(
            normalizedSignature
          )
        ) {
          caseQuoteFindings.push({
            evidenceHash,
            line: index + 1,
            lineText,
            status:
              "CASE_SIGNATURE_MISSING",
            record
          });
          continue;
        }

        caseQuoteFindings.push({
          evidenceHash,
          line: index + 1,
          lineText,
          status: "VERIFIED",
          record
        });
      }

      CASE_SUPPORT_MARKER.lastIndex = 0;

      for (
        const match of lineText.matchAll(
          CASE_SUPPORT_MARKER
        )
      ) {
        const evidenceHash =
          match[1] ?? "";
        if (!evidenceHash) {
          continue;
        }

        const record =
          ledger.all().find(
            (candidate) =>
              candidate.status ===
                "SUPPORTED" &&
              candidate.kind === "case" &&
              candidate.caseScope ===
                "PROPOSITION_SUPPORT" &&
              candidate.evidenceHash ===
                evidenceHash
          );

        if (!record) {
          caseSupportFindings.push({
            evidenceHash,
            line: index + 1,
            lineText,
            status:
              "MISSING_CASE_SUPPORT_LEDGER"
          });
          continue;
        }

        if (
          !record.claim ||
          !lineText.includes(
            record.claim
          )
        ) {
          caseSupportFindings.push({
            evidenceHash,
            line: index + 1,
            lineText,
            status:
              "PROPOSITION_TEXT_MISMATCH",
            record
          });
          continue;
        }

        if (
          !record.supportQuote ||
          !lineText.includes(
            record.supportQuote
          )
        ) {
          caseSupportFindings.push({
            evidenceHash,
            line: index + 1,
            lineText,
            status:
              "SUPPORT_QUOTE_MISSING",
            record
          });
          continue;
        }

        const normalizedLine =
          normalizeEvidenceText(lineText);
        const normalizedSignature =
          normalizeEvidenceText(
            record.caseSignature ?? ""
          );

        if (
          !normalizedSignature ||
          !normalizedLine.includes(
            normalizedSignature
          )
        ) {
          caseSupportFindings.push({
            evidenceHash,
            line: index + 1,
            lineText,
            status:
              "CASE_SIGNATURE_MISSING",
            record
          });
          continue;
        }

        caseSupportFindings.push({
          evidenceHash,
          line: index + 1,
          lineText,
          status: "SUPPORTED",
          record
        });
      }
    });

    const blocked = findings.some((finding) =>
      [
        "MISSING_LEDGER_RECORD",
        "MISSING_VERIFICATION_MARKER",
        "VERIFICATION_MARKER_MISMATCH",
        "UNVERIFIED_NOT_MARKED"
      ].includes(finding.status)
    ) ||
    caseQuoteFindings.some(
      (finding) =>
        finding.status !== "VERIFIED"
    ) ||
    caseSupportFindings.some(
      (finding) =>
        finding.status !== "SUPPORTED"
    );

    const degraded =
      !blocked &&
      findings.some((finding) => finding.status === "UNVERIFIED_MARKED");

    return {
      gate: "G8_HARD_GATE_FINALIZATION",
      result: blocked ? "BLOCKED" : degraded ? "DEGRADED" : "PASS",
      references,
      findings,
      caseQuoteFindings,
      caseSupportFindings
    };
  }
}
