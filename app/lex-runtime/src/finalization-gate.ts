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
    | "UNVERIFIED_NOT_MARKED";
  record?: VerificationRecord;
};

export type FinalizationReport = {
  gate: "G8_HARD_GATE_FINALIZATION";
  result: "PASS" | "DEGRADED" | "BLOCKED";
  references: DetectedLegalReference[];
  findings: FinalizationFinding[];
};

const VERIFIED_MARKER = /✅\s*\[VER:/iu;
const UNVERIFIED_MARKER = /⚠️?\s*\[NIEWERYFIKOWANE\]/iu;

const ARTICLE_PATTERN =
  /\bart\.?\s+\d+[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*(?:\s*§\s*\d+[a-zA-Z]*)?(?:\s+(?:KC|KPC|KK|KPK|KPA|KP|KRO|KSH|KW|KPW|PZP))?/giu;

const DZU_PATTERN =
  /\bDz\.?\s*U\.?\s*(?:(?:z\s+)?\d{4}\s*r?\.?\s*)?poz\.?\s*\d+/giu;

const CASE_PATTERN =
  /\bsygn\.?\s*(?:akt\s*)?[A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,8}(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,12}){0,3}\s+\d+\/\d{2,4}\b/gu;

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

    for (const reference of references) {
      const record = ledger.latest(reference.claim);
      if (!record) {
        findings.push({
          reference,
          status: "MISSING_LEDGER_RECORD"
        });
        continue;
      }

      if (record.status === "VERIFIED") {
        if (!VERIFIED_MARKER.test(reference.lineText)) {
          findings.push({
            reference,
            status: "MISSING_VERIFICATION_MARKER",
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

    const blocked = findings.some((finding) =>
      [
        "MISSING_LEDGER_RECORD",
        "MISSING_VERIFICATION_MARKER",
        "UNVERIFIED_NOT_MARKED"
      ].includes(finding.status)
    );

    const degraded =
      !blocked &&
      findings.some((finding) => finding.status === "UNVERIFIED_MARKED");

    return {
      gate: "G8_HARD_GATE_FINALIZATION",
      result: blocked ? "BLOCKED" : degraded ? "DEGRADED" : "PASS",
      references,
      findings
    };
  }
}
