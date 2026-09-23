import { createHash } from "node:crypto";
import { buildGenerationAliases, resolveGenerationAliases } from "./generation-aliases.js";
import { legalDocumentPlainText, validateLegalDocumentAst } from "./legal-document-ast.js";
import { LocalLegalDocumentRenderer } from "./legal-document-renderer.js";
import { privacyVaultDeanonymizationKeyBinding } from "./privacy/vault-store.js";
import { rebuildGenerationExportState, validateLocalHybridDocument } from "./document-generation-validation.js";
import { ExportGate } from "./export-gate.js";
export class LocalDocumentAuthoringService {
    vaults;
    artifacts;
    states;
    renderer;
    constructor(vaults, artifacts, states, renderer = new LocalLegalDocumentRenderer()) {
        this.vaults = vaults;
        this.artifacts = artifacts;
        this.states = states;
        this.renderer = renderer;
    }
    async aliasManifest(args) {
        const unique = [
            ...new Set(args
                .sourceDocumentIds)
        ];
        if (unique.length > 99 ||
            unique.some((documentId) => !/^doc_[a-f0-9]{24}$/
                .test(documentId))) {
            throw new Error("GENERATION_SOURCE_DOCUMENTS_INVALID");
        }
        const documents = [];
        for (const documentId of unique) {
            documents.push({
                documentId,
                vault: await this.vaults
                    .loadDocumentVault({
                    caseId: args.caseId,
                    documentId,
                    caseDataKey: args.caseDataKey,
                    keyVersion: args.keyVersion
                })
            });
        }
        return buildGenerationAliases(documents);
    }
    async createTokenized(args) {
        const aliases = await this.aliasManifest({
            caseId: args.caseId,
            sourceDocumentIds: args
                .sourceDocumentIds,
            caseDataKey: args.caseDataKey,
            keyVersion: args.keyVersion
        });
        const validated = validateLegalDocumentAst(args.ast, aliases.entries);
        const rendered = await this.renderer
            .render(args.format, validated.ast);
        try {
            const validation = await this.renderer
                .validate(args.format, rendered.data);
            const astText = legalDocumentPlainText(validated.ast);
            if (validation.text
                .replace(/\s+/g, " ")
                .trim() !==
                rendered.text
                    .replace(/\s+/g, " ")
                    .trim() ||
                !validated
                    .aliasesUsed
                    .every((alias) => validation.text
                    .includes(alias)) ||
                !astText) {
                throw new Error("TOKENIZED_DOCUMENT_VALIDATION_FAILED");
            }
            const tokenizedSha256 = createHash("sha256")
                .update(rendered.data)
                .digest("hex");
            const vaultGeneration = await this.vaults
                .getGeneration({
                caseId: args.caseId,
                caseDataKey: args.caseDataKey,
                keyVersion: args.keyVersion
            });
            if (vaultGeneration < 1) {
                throw new Error("GENERATION_VAULT_EMPTY");
            }
            const ext = args.format;
            const artifact = await this.artifacts
                .saveArtifact({
                caseId: args.caseId,
                filename: args.filename ??
                    `document-tokenized.${ext}`,
                mediaType: args.format ===
                    "docx"
                    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    : "application/vnd.oasis.opendocument.text",
                data: rendered.data,
                caseDataKey: args.caseDataKey,
                keyVersion: args.keyVersion,
                sensitivity: "PROTECTED",
                createdByUserId: args
                    .createdByUserId
            });
            await this.states
                .saveTokenized({
                state: {
                    schemaVersion: 1,
                    caseId: args.caseId,
                    artifactId: artifact
                        .artifactId,
                    format: args.format,
                    state: "TOKENIZED_VALIDATED",
                    tokenizedSha256,
                    vaultGeneration,
                    caseKeyVersion: args.keyVersion,
                    deanonymizationKeyBinding: privacyVaultDeanonymizationKeyBinding({
                        caseId: args.caseId,
                        caseDataKey: args.caseDataKey,
                        keyVersion: args.keyVersion
                    }),
                    ...(validated.ast.documentType ===
                        "pleading"
                        ? {
                            workflowRequirement: "PROCESS_PLEADING_FINAL"
                        }
                        : {}),
                    createdAt: new Date()
                        .toISOString()
                },
                aliases,
                validation: args.validationContext,
                caseDataKey: args.caseDataKey
            });
            return {
                artifact,
                format: args.format,
                tokenizedSha256,
                vaultGeneration,
                aliases,
                aliasesUsed: validated
                    .aliasesUsed,
                text: rendered.text,
                deanonymizationKeyBound: true
            };
        }
        finally {
            rendered.data.fill(0);
        }
    }
    async createReady(args) {
        const validated = validateLegalDocumentAst(args.ast, []);
        if (validated
            .aliasesUsed
            .length > 0) {
            throw new Error("READY_DOCUMENT_PII_ALIAS_FORBIDDEN");
        }
        const rendered = await this.renderer
            .render(args.format, validated.ast);
        try {
            const validation = await this.renderer
                .validate(args.format, rendered.data);
            const astText = legalDocumentPlainText(validated.ast);
            if (validation.aliases !==
                0 ||
                validation.text
                    .replace(/\s+/g, " ")
                    .trim() !==
                    rendered.text
                        .replace(/\s+/g, " ")
                        .trim() ||
                !astText) {
                throw new Error("READY_DOCUMENT_VALIDATION_FAILED");
            }
            const hybrid = validateLocalHybridDocument(validation.text, args.validationContext);
            if (hybrid.result !==
                "PASS") {
                throw new Error("READY_DOCUMENT_HYBRID_BLOCKED:" +
                    hybrid.reasons
                        .join(","));
            }
            const exportState = rebuildGenerationExportState(args.validationContext);
            const exportReport = new ExportGate()
                .evaluate({
                documentContent: rendered.data,
                documentText: validation.text,
                documentKind: args.format,
                documentSkill: args.validationContext
                    .primarySkill,
                ledger: exportState.ledger,
                audit: exportState.audit,
                hybridValidation: "PASS"
            });
            if (exportReport.result !==
                "PASS" ||
                !exportReport
                    .documentHash) {
                throw new Error("READY_DOCUMENT_EXPORT_GATE_BLOCKED:" +
                    exportReport.reasons
                        .join(","));
            }
            const sha256 = createHash("sha256")
                .update(rendered.data)
                .digest("hex");
            if (sha256 !==
                exportReport
                    .documentHash) {
                throw new Error("READY_DOCUMENT_EXPORT_HASH_MISMATCH");
            }
            const artifact = await this.artifacts
                .saveArtifact({
                caseId: args.caseId,
                filename: args.filename ??
                    `LexMachina-document.${args.format}`,
                mediaType: args.format ===
                    "docx"
                    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    : "application/vnd.oasis.opendocument.text",
                data: rendered.data,
                caseDataKey: args.caseDataKey,
                keyVersion: args.keyVersion,
                sensitivity: "PROTECTED",
                createdByUserId: args
                    .createdByUserId
            });
            return {
                artifact,
                format: args.format,
                sha256,
                text: validation.text
            };
        }
        finally {
            rendered.data.fill(0);
        }
    }
    async deanonymizeConsumed(args) {
        if (args.target
            .caseKeyVersion !==
            args.keyVersion) {
            throw new Error("GENERATION_CASE_KEY_CHANGED");
        }
        if (!args.target
            .deanonymizationKeyBinding) {
            throw new Error("GENERATION_DEANONYMIZATION_KEY_BINDING_MISSING");
        }
        const currentKeyBinding = privacyVaultDeanonymizationKeyBinding({
            caseId: args.target
                .caseId,
            caseDataKey: args.caseDataKey,
            keyVersion: args.keyVersion
        });
        const keyBindingVerified = currentKeyBinding ===
            args.target
                .deanonymizationKeyBinding;
        if (!keyBindingVerified) {
            throw new Error("GENERATION_DEANONYMIZATION_KEY_CHANGED");
        }
        const currentGeneration = await this.vaults
            .getGeneration({
            caseId: args.target
                .caseId,
            caseDataKey: args.caseDataKey,
            keyVersion: args.keyVersion
        });
        if (currentGeneration !==
            args.target
                .vaultGeneration) {
            throw new Error("GENERATION_VAULT_CHANGED");
        }
        const validationContext = await this.states
            .loadValidationContext({
            caseId: args.target
                .caseId,
            artifactId: args.target
                .artifactId,
            caseDataKey: args.caseDataKey,
            keyVersion: args.keyVersion
        });
        const aliases = await this.states
            .loadAliases({
            caseId: args.target
                .caseId,
            artifactId: args.target
                .artifactId,
            caseDataKey: args.caseDataKey,
            keyVersion: args.keyVersion
        });
        const vaults = new Map();
        for (const documentId of [
            ...new Set(aliases.entries
                .map((entry) => entry.documentId))
        ]) {
            vaults.set(documentId, await this.vaults
                .loadDocumentVault({
                caseId: args.target
                    .caseId,
                documentId,
                caseDataKey: args.caseDataKey,
                keyVersion: args.keyVersion
            }));
        }
        const replacements = resolveGenerationAliases(aliases, vaults);
        const tokenized = await this.artifacts
            .readArtifact({
            caseId: args.target
                .caseId,
            artifactId: args.target
                .artifactId,
            caseDataKey: args.caseDataKey,
            keyVersion: args.keyVersion,
            maxBytes: 64 * 1024 *
                1024
        });
        try {
            const hash = createHash("sha256")
                .update(tokenized)
                .digest("hex");
            if (hash !==
                args.target
                    .tokenizedSha256) {
                throw new Error("GENERATION_TOKENIZED_HASH_CHANGED");
            }
            const finalPackage = await this.renderer
                .deanonymize(args.target
                .artifactFormat, tokenized, replacements);
            try {
                const validation = await this.renderer
                    .validate(args.target
                    .artifactFormat, finalPackage
                    .data);
                if (validation.aliases !==
                    0 ||
                    /\[(?:LMPII|PII):[^\]]+\]/
                        .test(validation.text)) {
                    throw new Error("FINAL_DOCUMENT_TOKEN_RESIDUE");
                }
                const hybrid = validateLocalHybridDocument(validation.text, validationContext);
                if (hybrid.result !==
                    "PASS") {
                    throw new Error("FINAL_DOCUMENT_HYBRID_BLOCKED:" +
                        hybrid.reasons
                            .join(","));
                }
                const exportState = rebuildGenerationExportState(validationContext);
                const exportReport = new ExportGate()
                    .evaluate({
                    documentContent: finalPackage
                        .data,
                    documentText: validation.text,
                    documentKind: args.target
                        .artifactFormat,
                    documentSkill: validationContext
                        .primarySkill,
                    ledger: exportState
                        .ledger,
                    audit: exportState
                        .audit,
                    hybridValidation: "PASS"
                });
                if (exportReport.result !==
                    "PASS" ||
                    !exportReport
                        .documentHash) {
                    throw new Error("FINAL_DOCUMENT_EXPORT_GATE_BLOCKED:" +
                        exportReport.reasons
                            .join(","));
                }
                const sha256 = createHash("sha256")
                    .update(finalPackage
                    .data)
                    .digest("hex");
                if (sha256 !==
                    exportReport
                        .documentHash) {
                    throw new Error("FINAL_DOCUMENT_EXPORT_HASH_MISMATCH");
                }
                const format = args.target
                    .artifactFormat;
                const artifact = await this.artifacts
                    .saveArtifact({
                    caseId: args.target
                        .caseId,
                    filename: args.filename ??
                        `document-final.${format}`,
                    mediaType: format ===
                        "docx"
                        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        : "application/vnd.oasis.opendocument.text",
                    data: finalPackage
                        .data,
                    caseDataKey: args.caseDataKey,
                    keyVersion: args.keyVersion,
                    sensitivity: "CLEAR_PII",
                    createdByUserId: args
                        .createdByUserId
                });
                await this.states
                    .markFinalized({
                    caseId: args.target
                        .caseId,
                    artifactId: args.target
                        .artifactId,
                    finalArtifactId: artifact
                        .artifactId,
                    finalSha256: sha256
                });
                return {
                    artifact,
                    format,
                    sha256,
                    text: validation.text,
                    replacements: finalPackage
                        .replaced ?? 0,
                    deanonymizationBasis: "PRIVACY_VAULT_KEY",
                    keyBindingVerified
                };
            }
            finally {
                finalPackage
                    .data.fill(0);
            }
        }
        finally {
            tokenized.fill(0);
        }
    }
}
