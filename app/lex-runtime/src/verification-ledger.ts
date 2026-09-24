import {
  assertVerificationTierPolicy,
  type LegalSourceCrossCheckStatus,
  type LegalSourceProvenance,
  type LegalSourceTier
} from "./legal-source-policy.js";

export type VerificationKind =
  | "statute"
  | "journal"
  | "case"
  | "deadline"
  | "amount";

export type VerificationStatus =
  | "VERIFIED"
  | "SUPPORTED"
  | "UNVERIFIED";

export type VerificationMethod =
  | "web_fetch"
  | "web_fetch_pdf"
  | "web_search"
  | "mcp_call"
  | "provider_tool"
  | "file_read";

export type VerificationRecord = {
  claim: string;
  kind: VerificationKind;
  status: VerificationStatus;
  sourceUrl?: string;
  sourceTier?: LegalSourceTier;
  sourceProvenance?: LegalSourceProvenance;
  crossCheckStatus?: LegalSourceCrossCheckStatus;
  crossCheckUrl?: string;
  crossCheckTier?: "R1" | "R2A";
  fetchedAt: string;
  toolCallId?: string;
  verificationMethod?: VerificationMethod;
  temporalMode?: "CURRENT" | "HISTORICAL";
  temporalFreshnessStatus?: "CURRENT" | "HISTORICAL";
  freshnessCheckedAt?: string;
  currentEli?: string;
  asOf?: string;
  sourceFormat?: "TEXT" | "PDF";
  caseScope?:
    | "FULL_TEXT"
    | "EXACT_QUOTE"
    | "PROPOSITION_SUPPORT";
  caseSignature?: string;
  evidenceHash?: string;
  supportQuoteHash?: string;
  supportQuote?: string;
  evidence?: string;
  // NSA/WSA (CBOSA) material is kept as a dated snapshot and never promoted
  // to VERIFIED/SUPPORTED.
  verificationCeiling?: "SNAPSHOT_NO_PROMOTION";
};

function normalizeClaim(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("pl")
    .replace(/[.,;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export class VerificationLedger {
  private readonly records = new Map<string, VerificationRecord[]>();

  add(record: VerificationRecord): void {
    if (!record.claim.trim()) {
      throw new Error("Verification claim cannot be empty.");
    }

    assertVerificationTierPolicy({
      status:
        record.status,
      ...(record.sourceTier
        ? {
            sourceTier:
              record.sourceTier
          }
        : {})
    });

    if (
      record.crossCheckStatus ===
        "CONFIRMED_R1_R2A" &&
      (
        !record.crossCheckUrl?.trim() ||
        (
          record.crossCheckTier !==
            "R1" &&
          record.crossCheckTier !==
            "R2A"
        )
      )
    ) {
      throw new Error(
        "Confirmed higher-tier cross-check requires R1/R2A tier and source URL."
      );
    }
    if (
      (record.status === "VERIFIED" ||
        record.status === "SUPPORTED") &&
      !record.sourceUrl?.trim()
    ) {
      throw new Error(
        "Verified/supported claims require a source URL."
      );
    }

    if (
      record.status === "SUPPORTED" &&
      (
        record.caseScope !==
          "PROPOSITION_SUPPORT" ||
        !record.caseSignature?.trim() ||
        !record.evidenceHash?.trim() ||
        !record.supportQuoteHash?.trim() ||
        !record.supportQuote?.trim()
      )
    ) {
      throw new Error(
        "Supported propositions require case signature, support quote and evidence hashes."
      );
    }

    const key = normalizeClaim(record.claim);
    const current = this.records.get(key) ?? [];
    current.push({ ...record });
    this.records.set(key, current);
  }

  find(claim: string): VerificationRecord[] {
    return [...(this.records.get(normalizeClaim(claim)) ?? [])];
  }

  latest(claim: string): VerificationRecord | undefined {
    const records = this.find(claim);
    return records.at(-1);
  }

  all(): VerificationRecord[] {
    return [...this.records.values()].flatMap((records) => records);
  }
}