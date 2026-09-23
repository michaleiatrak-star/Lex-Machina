import { CORE_LEGAL_RESOURCES } from "./legal-session.js";
function routerFirst(events) {
    const firstSkill = events.find((event) => event.type ===
        "skill_read");
    const pass = firstSkill?.target ===
        "prawny-router-v3" &&
        firstSkill.status === "OK";
    return {
        id: "ROUTER_FIRST",
        subgate: "I-A_ROUTER",
        result: pass ? "PASS" : "BLOCKED",
        detail: firstSkill
            ? `firstSkill=${firstSkill.target};status=${firstSkill.status}`
            : "firstSkill=missing"
    };
}
function coreResources(events) {
    const observed = new Set(events
        .filter((event) => event.type ===
        "resource_read" &&
        event.status === "OK")
        .map((event) => event.target));
    const missing = CORE_LEGAL_RESOURCES
        .filter((resource) => !observed.has(resource));
    return {
        id: "CORE_RESOURCES",
        subgate: "I-B_CORE_RESOURCES",
        result: missing.length === 0
            ? "PASS"
            : "BLOCKED",
        detail: missing.length === 0
            ? `loaded=${CORE_LEGAL_RESOURCES.length}`
            : `missing=${missing.join(",")}`
    };
}
function routerRequiredModules(events) {
    const gate = events.find((event) => event.type ===
        "gate" &&
        event.target ===
            "G39L_ROUTER_REQUIRED_MODULES");
    return {
        id: "ROUTER_REQUIRED_MODULES",
        subgate: "I-B1_ROUTER_REQUIRED_MODULES",
        result: gate?.status === "OK"
            ? "PASS"
            : "BLOCKED",
        detail: gate
            ? `status=${gate.status}`
            : "gate=missing"
    };
}
function workflowResources(report) {
    return {
        id: "WORKFLOW_RESOURCES",
        subgate: "I-C_WORKFLOW_RESOURCES",
        result: report.result,
        detail: report.result === "PASS"
            ? `required=${report.required.length};observed=${report.observed.length}`
            : `missing=${report.missing.join(",")}`
    };
}
function provenance(records) {
    const verified = records.filter((record) => record.status ===
        "VERIFIED" ||
        record.status ===
            "SUPPORTED");
    const invalid = verified.filter((record) => {
        if (!record.sourceUrl?.trim() ||
            !record.fetchedAt?.trim() ||
            !record.verificationMethod) {
            return true;
        }
        if ((record.kind ===
            "statute" ||
            record.kind ===
                "journal") &&
            !record.sourceTier) {
            return true;
        }
        if (record.kind ===
            "case" &&
            !record
                .caseSignature
                ?.trim()) {
            return true;
        }
        if (record.status ===
            "SUPPORTED" &&
            (record.kind !==
                "case" ||
                record.caseScope !==
                    "PROPOSITION_SUPPORT" ||
                !record
                    .evidenceHash
                    ?.trim() ||
                !record
                    .supportQuoteHash
                    ?.trim() ||
                !record
                    .supportQuote
                    ?.trim())) {
            return true;
        }
        return false;
    });
    return {
        id: "SOURCE_PROVENANCE",
        subgate: "I-D_SOURCE_PROVENANCE",
        result: invalid.length === 0
            ? "PASS"
            : "BLOCKED",
        detail: invalid.length === 0
            ? `records=${verified.length}`
            : `invalid=${invalid.length}`
    };
}
function sourceHierarchy(records) {
    const statutory = records.filter((record) => record.status ===
        "VERIFIED" &&
        (record.kind ===
            "statute" ||
            record.kind ===
                "journal"));
    const invalid = statutory.filter((record) => record.sourceTier !==
        "R1" &&
        record.sourceTier !==
            "R2A");
    return {
        id: "SOURCE_HIERARCHY",
        subgate: "I-D1_SOURCE_HIERARCHY",
        result: invalid.length === 0
            ? "PASS"
            : "BLOCKED",
        detail: invalid.length === 0
            ? `verifiedStatutory=${statutory.length}`
            : `invalidTier=${invalid.length}`
    };
}
function temporalFreshness(records) {
    const statutory = records.filter((record) => record.status ===
        "VERIFIED" &&
        (record.kind ===
            "statute" ||
            record.kind ===
                "journal"));
    const invalid = statutory.filter((record) => {
        const expected = record.temporalMode ??
            "CURRENT";
        const checkedAt = record.freshnessCheckedAt;
        return (record
            .temporalFreshnessStatus !==
            expected ||
            !checkedAt ||
            Number.isNaN(Date.parse(checkedAt)));
    });
    return {
        id: "TEMPORAL_FRESHNESS",
        subgate: "I-D2_TEMPORAL_FRESHNESS",
        result: invalid.length === 0
            ? "PASS"
            : "BLOCKED",
        detail: invalid.length === 0
            ? `verifiedStatutory=${statutory.length}`
            : `missingOrStale=${invalid.length}`
    };
}
function citationLedger(finalization) {
    const invalid = finalization.findings
        .filter((finding) => finding.status !==
        "VERIFIED");
    return {
        id: "CITATION_LEDGER",
        subgate: "I-E_CITATION_LEDGER",
        result: invalid.length === 0
            ? "PASS"
            : "BLOCKED",
        detail: invalid.length === 0
            ? `references=${finalization.references.length}`
            : `invalid=${invalid.length}`
    };
}
function documentCitations(report) {
    const invalid = report.rejected +
        report
            .quotedWithoutExactHighlight;
    return {
        id: "DOCUMENT_CITATIONS",
        subgate: "I-F1_DOCUMENT_CITATIONS",
        result: invalid === 0
            ? "PASS"
            : "BLOCKED",
        detail: invalid === 0
            ? `accepted=${report.accepted}`
            : `rejected=${report.rejected};unanchoredQuotes=${report.quotedWithoutExactHighlight}`
    };
}
function citations(finalization) {
    const invalid = finalization.findings
        .filter((finding) => finding.status !==
        "VERIFIED");
    return {
        id: "LEGAL_CITATIONS",
        subgate: "I-E1_LEGAL_CITATIONS",
        result: invalid.length === 0
            ? "PASS"
            : "BLOCKED",
        detail: invalid.length === 0
            ? `references=${finalization.references.length}`
            : `invalid=${invalid.length}`
    };
}
function caseSignatures(finalization) {
    const cases = finalization.references
        .filter((reference) => reference.kind ===
        "case");
    const invalidRefs = finalization.findings
        .filter((finding) => finding.reference
        .kind ===
        "case" &&
        finding.status !==
            "VERIFIED");
    const invalidQuotes = finalization
        .caseQuoteFindings
        .filter((finding) => finding.status !==
        "VERIFIED");
    const invalidSupport = finalization
        .caseSupportFindings
        .filter((finding) => finding.status !==
        "SUPPORTED");
    const invalid = invalidRefs.length +
        invalidQuotes.length +
        invalidSupport.length;
    return {
        id: "CASE_SIGNATURES",
        subgate: "I-F_CASE_SIGNATURES",
        result: invalid === 0
            ? "PASS"
            : "BLOCKED",
        detail: invalid === 0
            ? `references=${cases.length};quotes=${finalization.caseQuoteFindings.length};support=${finalization.caseSupportFindings.length}`
            : `invalid=${invalid}`
    };
}
export function evaluateGateIInvariants(args) {
    const checks = [
        routerFirst(args.events),
        coreResources(args.events),
        routerRequiredModules(args.events),
        workflowResources(args.workflowReads),
        provenance(args.verificationRecords),
        sourceHierarchy(args.verificationRecords),
        temporalFreshness(args.verificationRecords),
        citationLedger(args.finalization),
        citations(args.finalization),
        caseSignatures(args.finalization),
        documentCitations(args.documentCitations),
        {
            id: "OUTPUT_CONTRACT",
            subgate: "I-G_OUTPUT_CONTRACT",
            result: args.outputValidation
                .result,
            detail: args.outputValidation
                .detail
        },
        {
            id: "FINALIZATION",
            subgate: "I-H_FINALIZATION",
            result: args.finalization
                .result === "PASS"
                ? "PASS"
                : "BLOCKED",
            detail: `result=${args.finalization.result}`
        }
    ];
    return {
        gate: "G39I_COMMON_LEGAL_INVARIANTS",
        result: checks.every((check) => check.result ===
            "PASS")
            ? "PASS"
            : "BLOCKED",
        checks,
        verifiedOrSupportedRecords: args.verificationRecords
            .filter((record) => record.status ===
            "VERIFIED" ||
            record.status ===
                "SUPPORTED").length,
        legalReferences: args.finalization
            .references.length,
        caseReferences: args.finalization
            .references
            .filter((reference) => reference.kind ===
            "case").length
    };
}
