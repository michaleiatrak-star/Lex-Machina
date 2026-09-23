import { assertVerificationTierPolicy } from "./legal-source-policy.js";
function normalizeClaim(value) {
    return value
        .normalize("NFKC")
        .toLocaleLowerCase("pl")
        .replace(/[.,;:()[\]{}]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
export class VerificationLedger {
    records = new Map();
    add(record) {
        if (!record.claim.trim()) {
            throw new Error("Verification claim cannot be empty.");
        }
        assertVerificationTierPolicy({
            status: record.status,
            ...(record.sourceTier
                ? {
                    sourceTier: record.sourceTier
                }
                : {})
        });
        if (record.crossCheckStatus ===
            "CONFIRMED_R1_R2A" &&
            (!record.crossCheckUrl?.trim() ||
                (record.crossCheckTier !==
                    "R1" &&
                    record.crossCheckTier !==
                        "R2A"))) {
            throw new Error("Confirmed higher-tier cross-check requires R1/R2A tier and source URL.");
        }
        if ((record.status === "VERIFIED" ||
            record.status === "SUPPORTED") &&
            !record.sourceUrl?.trim()) {
            throw new Error("Verified/supported claims require a source URL.");
        }
        if (record.status === "SUPPORTED" &&
            (record.caseScope !==
                "PROPOSITION_SUPPORT" ||
                !record.caseSignature?.trim() ||
                !record.evidenceHash?.trim() ||
                !record.supportQuoteHash?.trim() ||
                !record.supportQuote?.trim())) {
            throw new Error("Supported propositions require case signature, support quote and evidence hashes.");
        }
        const key = normalizeClaim(record.claim);
        const current = this.records.get(key) ?? [];
        current.push({ ...record });
        this.records.set(key, current);
    }
    find(claim) {
        return [...(this.records.get(normalizeClaim(claim)) ?? [])];
    }
    latest(claim) {
        const records = this.find(claim);
        return records.at(-1);
    }
    all() {
        return [...this.records.values()].flatMap((records) => records);
    }
}
