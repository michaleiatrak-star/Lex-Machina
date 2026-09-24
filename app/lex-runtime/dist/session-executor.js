import { AuditTrail } from "./audit-trail.js";
import { AuditedFinalizer } from "./audited-finalizer.js";
import { LexExecutionEngine } from "./execution-engine.js";
import { VerificationLedger } from "./verification-ledger.js";
import { CoreLawToolRuntime } from "./core-law-tool-runtime.js";
import { LegalCorpusToolRuntime } from "./legal-corpus-tool-runtime.js";
import { ReportBlueprintToolRuntime } from "./report-blueprint-tool-runtime.js";
import { evaluateDeterministicWorkflowOutput, evaluateDeterministicWorkflowReads } from "./deterministic-workflow.js";
import { documentCitationSystemPrompt, processDocumentCitationMarkers } from "./document-citations.js";
import { orchestrateDocumentContext } from "./context-orchestrator.js";
import { evaluateGuideOutput } from "./guide-session-state.js";
import { evaluateGateIInvariants } from "./gate-i-invariants.js";
import { blockGateITurn, createGateITurnState, passGateITurnPhase } from "./gate-i-turn-state.js";
import { AuxiliaryModelScheduler, auxiliaryVerificationCallKey } from "./auxiliary-model-scheduler.js";
import { evaluateModelTaskOwnershipGate } from "./model-task-ownership.js";
import { applyAutomaticVerificationMarkers, detectHistoricalAsOf, planAutomaticLegalVerification } from "./gate-i-auto-verification.js";
import { runGateIRuntimePrelude } from "./gate-i-runtime-prelude.js";
import { evaluateGateIInputCompleteness, evaluateGateIWorkflowContract, gateIWorkflowContract } from "./gate-i-contracts.js";
import { LocalPolishPseudonymizer, PII_TOKEN_WITH_CASE, PseudonymizationVault } from "./privacy/pseudonymizer.js";
import { ModelAutoRouter } from "./model-auto-routing.js";
import { privacyRecognizerFor } from "./privacy/local-llm-ner.js";
import { parseSkillSelectionEnvelope } from "./skill-selection.js";
export function publicAuxiliarySourceFromToolResult(result) {
    let payload;
    try {
        payload =
            JSON.parse(result.content);
    }
    catch {
        return null;
    }
    if (!payload ||
        typeof payload !==
            "object") {
        return null;
    }
    const value = payload;
    const candidate = value.candidate;
    const assessment = value.assessment;
    const tier = candidate?.tier;
    if (value.status !== "OK" ||
        assessment
            ?.auxiliaryOnly !==
            true ||
        typeof candidate
            ?.url !== "string" ||
        (tier !== "R2B" &&
            tier !== "R3") ||
        (value.classification !==
            "KNOWN_DOMAIN" &&
            value.classification !==
                "CONSERVATIVE_R3") ||
        typeof candidate
            .provenance
            ?.classificationBasis !==
            "string" ||
        typeof candidate
            .crossCheckStatus !==
            "string" ||
        typeof assessment
            .staleOrUndatedWarning !==
            "boolean" ||
        typeof assessment
            .higherTierCrossCheckSatisfied !==
            "boolean" ||
        typeof assessment
            .conflict !==
            "boolean" ||
        typeof assessment
            .instruction !==
            "string") {
        return null;
    }
    const crossCheckStatus = candidate
        .crossCheckStatus;
    if (crossCheckStatus !==
        "NOT_REQUIRED" &&
        crossCheckStatus !==
            "PENDING" &&
        crossCheckStatus !==
            "CONFIRMED_R1_R2A" &&
        crossCheckStatus !==
            "CONFLICT" &&
        crossCheckStatus !==
            "UNAVAILABLE") {
        return null;
    }
    return {
        ...(typeof candidate
            .claim === "string" &&
            candidate.claim.trim()
            ? {
                claim: candidate.claim
                    .trim()
            }
            : {}),
        sourceUrl: candidate.url,
        sourceTier: tier,
        classification: value
            .classification,
        classificationBasis: candidate
            .provenance
            .classificationBasis,
        crossCheckStatus,
        ...(typeof candidate
            .crossCheckUrl ===
            "string"
            ? {
                crossCheckUrl: candidate
                    .crossCheckUrl
            }
            : {}),
        ...(candidate
            .crossCheckTier ===
            "R1" ||
            candidate
                .crossCheckTier ===
                "R2A"
            ? {
                crossCheckTier: candidate
                    .crossCheckTier
            }
            : {}),
        ...(typeof candidate
            .provenance
            .publishedAt ===
            "string"
            ? {
                publishedAt: candidate
                    .provenance
                    .publishedAt
            }
            : {}),
        ...(typeof candidate
            .provenance
            .updatedAt ===
            "string"
            ? {
                updatedAt: candidate
                    .provenance
                    .updatedAt
            }
            : {}),
        staleOrUndatedWarning: assessment
            .staleOrUndatedWarning,
        higherTierCrossCheckSatisfied: assessment
            .higherTierCrossCheckSatisfied,
        conflict: assessment.conflict,
        instruction: assessment.instruction
    };
}
function normalizedAuxiliaryClaim(value) {
    return value
        .normalize("NFKC")
        .toLocaleLowerCase("pl")
        .replace(/\s+/gu, " ")
        .trim();
}
export function reconcileAuxiliarySourcesWithVerification(sources, records) {
    return sources.map((source) => {
        if (!source.claim ||
            source.conflict) {
            return {
                ...source
            };
        }
        const claim = normalizedAuxiliaryClaim(source.claim);
        const verified = [...records]
            .reverse()
            .find((record) => normalizedAuxiliaryClaim(record.claim) === claim &&
            (record.status ===
                "VERIFIED" ||
                record.status ===
                    "SUPPORTED") &&
            (record.sourceTier ===
                "R1" ||
                record.sourceTier ===
                    "R2A") &&
            Boolean(record.sourceUrl
                ?.trim()));
        if (!verified ||
            !verified.sourceUrl ||
            (verified.sourceTier !==
                "R1" &&
                verified.sourceTier !==
                    "R2A")) {
            return {
                ...source,
                crossCheckStatus: source.crossCheckStatus ===
                    "NOT_REQUIRED"
                    ? "NOT_REQUIRED"
                    : "PENDING",
                higherTierCrossCheckSatisfied: false
            };
        }
        return {
            ...source,
            crossCheckStatus: "CONFIRMED_R1_R2A",
            crossCheckUrl: verified.sourceUrl,
            crossCheckTier: verified.sourceTier,
            higherTierCrossCheckSatisfied: true
        };
    });
}
export function publicEvidenceBundle(records) {
    return records.map((record) => ({
        claim: record.claim,
        kind: record.kind,
        status: record.status,
        ...(record.sourceUrl ? { sourceUrl: record.sourceUrl } : {}),
        ...(record.sourceTier ? { sourceTier: record.sourceTier } : {}),
        fetchedAt: record.fetchedAt,
        ...(record.verificationMethod
            ? { verificationMethod: record.verificationMethod }
            : {}),
        ...(record.temporalMode ? { temporalMode: record.temporalMode } : {}),
        ...(record.asOf ? { asOf: record.asOf } : {}),
        ...(record.sourceFormat ? { sourceFormat: record.sourceFormat } : {}),
        ...(record.caseScope ? { caseScope: record.caseScope } : {}),
        ...(record.caseSignature ? { caseSignature: record.caseSignature } : {}),
        ...(record.evidenceHash ? { evidenceHash: record.evidenceHash } : {}),
        ...(record.supportQuoteHash
            ? { supportQuoteHash: record.supportQuoteHash }
            : {})
    }));
}
export const SESSION_EXECUTION_INTERNAL = Symbol("LEX_SESSION_EXECUTION_INTERNAL");
export function namespaceDocumentAttachmentTokens(attachments) {
    const prefixes = new Map();
    const prefixFor = (documentId) => {
        const existing = prefixes.get(documentId);
        if (existing) {
            return existing;
        }
        const prefix = "D" +
            String(prefixes.size + 1).padStart(2, "0");
        prefixes.set(documentId, prefix);
        return prefix;
    };
    return attachments.map((attachment) => {
        const prefix = prefixFor(attachment.documentId);
        return {
            ...attachment,
            chunks: attachment.chunks.map((chunk) => ({
                ...chunk,
                text: chunk.text.replace(/\[PII:([A-Z_]+):(\d{4})\]/g, (_token, kind, sequence) => `[LMPII:${prefix}:${kind}:${sequence}]`)
            }))
        };
    });
}
function buildDocumentContext(attachments) {
    const sections = attachments.map((attachment) => {
        const chunks = attachment.chunks.map((chunk) => {
            const sourceLabel = attachment.sourceScope === "FIRM_KNOWLEDGE"
                ? "FIRM KNOWLEDGE"
                : attachment.sourceScope === "CASE_KNOWLEDGE"
                    ? "CASE KNOWLEDGE"
                    : "DOCUMENT";
            const representation = chunk.representation ===
                "EXTRACTIVE_DIGEST"
                ? " · EXTRACTIVE DIGEST · BACKLINK=ORIGINAL_CHUNK"
                : "";
            return [
                `[${sourceLabel} ${attachment.documentId} · CHUNK ${chunk.index} · PAGES ${chunk.pageStart}-${chunk.pageEnd}${representation}]`,
                chunk.text
            ].join("\n");
        });
        return chunks.join("\n\n");
    });
    return sections.join("\n\n---\n\n");
}
function transferExecutionEvents(events, audit) {
    for (const event of events) {
        if (event.type === "skill_read" ||
            event.type === "resource_read" ||
            event.type === "route" ||
            event.type === "provider_start" ||
            event.type === "provider_end" ||
            event.type === "gate") {
            audit.record(event.type, event.target, event.status === "BLOCKED" ? "BLOCKED" : "OK", event.detail ? { detail: event.detail } : undefined);
        }
    }
}
const DRAFT_PII_TOKEN = /\[PII:([A-Z_]+):(\d{4})(?:\|([A-Z]{2,4}))?\]/g;
// An incomplete token at the end of the stream is held back until complete.
const DRAFT_PARTIAL_TOKEN_TAIL = /\[(?:P(?:I(?:I(?::[A-Z_]*(?::\d{0,4}(?:\|[A-Z]{0,4})?)?)?)?)?)?$/;
export function createDraftCallbacks(vault, onDraft) {
    let raw = "";
    const publish = () => {
        const visible = raw.replace(DRAFT_PARTIAL_TOKEN_TAIL, "");
        onDraft(visible.replace(DRAFT_PII_TOKEN, (token, kind, sequence, requestedCase) => {
            const base = `[PII:${kind}:${sequence}]`;
            return vault.hasToken(base)
                ? vault.restore(base, requestedCase ?? null).text
                : token;
        }));
    };
    return {
        onContentDelta: (text) => {
            raw += text;
            publish();
        },
        // A tool round starts a new model turn; the previous partial text was
        // only a preamble to the tool call.
        onToolCallStart: () => {
            raw = "";
            publish();
        }
    };
}
export class SafeSessionExecutor {
    registry;
    providers;
    finalizer;
    verificationToolFactory;
    chatNamedEntityRecognizer;
    legalFederationTools;
    coreLawIndex;
    personMorphology;
    engine;
    autoRouter;
    auxiliaryScheduler;
    constructor(registry, providers, finalizer = new AuditedFinalizer(), verificationToolFactory, chatNamedEntityRecognizer, legalFederationTools, coreLawIndex, personMorphology) {
        this.registry = registry;
        this.providers = providers;
        this.finalizer = finalizer;
        this.verificationToolFactory = verificationToolFactory;
        this.chatNamedEntityRecognizer = chatNamedEntityRecognizer;
        this.legalFederationTools = legalFederationTools;
        this.coreLawIndex = coreLawIndex;
        this.personMorphology = personMorphology;
        this.engine = new LexExecutionEngine(registry, providers);
        this.autoRouter =
            new ModelAutoRouter(registry, providers);
        this.auxiliaryScheduler =
            new AuxiliaryModelScheduler(providers);
    }
    // A local primary model keeps the text on this machine, so the chat does
    // not also wait for local-model PII detection before answering.
    chatRecognizerFor(model) {
        return this.chatNamedEntityRecognizer
            ? privacyRecognizerFor(this.chatNamedEntityRecognizer, !model.startsWith("local/"))
            : undefined;
    }
    async resolveAutoRouting(request) {
        const vault = new PseudonymizationVault();
        const pseudonymizer = new LocalPolishPseudonymizer(vault, this.chatRecognizerFor(request.model), this.personMorphology);
        let protectedQuery;
        try {
            protectedQuery =
                (await pseudonymizer
                    .pseudonymize(request.query)).text;
        }
        catch {
            throw new Error("CHAT_PRIVACY_GATE_FAILED");
        }
        const routed = await this.autoRouter
            .resolve({
            query: protectedQuery,
            provider: request.provider,
            model: request.model
        });
        // Keep the user's original text for the actual execution. Only the
        // model-selected routing envelope is copied from the protected prepass.
        const originalEnvelope = parseSkillSelectionEnvelope(request.query);
        const firstBreak = routed.query.indexOf("\n");
        const routingHeader = firstBreak >= 0
            ? routed.query.slice(0, firstBreak)
            : routed.query;
        return {
            decision: routed.decision,
            query: routingHeader +
                "\n" +
                originalEnvelope.query
        };
    }
    async execute(request) {
        const audit = new AuditTrail();
        audit.start({
            provider: request.provider,
            model: request.model,
            mode: request.mode
        });
        const chatPrivacyVault = new PseudonymizationVault();
        const chatPseudonymizer = new LocalPolishPseudonymizer(chatPrivacyVault, this.chatRecognizerFor(request.model), this.personMorphology);
        let protectedQuery;
        let protectedAuxiliaryText;
        try {
            const protectedPrimary = await chatPseudonymizer
                .pseudonymize(request.query);
            protectedQuery =
                protectedPrimary.text;
            if (request.auxiliaryText !==
                undefined &&
                request.auxiliaryText !==
                    request.query) {
                protectedAuxiliaryText =
                    (await chatPseudonymizer
                        .pseudonymize(request.auxiliaryText)).text;
            }
            else if (request.auxiliaryText !==
                undefined) {
                protectedAuxiliaryText =
                    protectedQuery;
            }
            audit.record("gate", "G39I_CHAT_PRIVACY", "OK", {
                pseudonymized: protectedPrimary
                    .findings.length,
                kinds: Object.keys(protectedPrimary
                    .counts).sort(),
                vaultTokens: chatPrivacyVault
                    .size
            });
        }
        catch (error) {
            audit.record("gate", "G39I_CHAT_PRIVACY", "BLOCKED", {
                error: error instanceof Error
                    ? error.message
                    : String(error)
            });
            audit.close("BLOCKED", {
                finalization: "PRIVACY_GATE"
            });
            throw new Error("CHAT_PRIVACY_GATE_FAILED");
        }
        const requestedHistoricalAsOf = detectHistoricalAsOf(protectedQuery);
        const ledger = new VerificationLedger();
        const verificationTools = this.verificationToolFactory?.(ledger);
        const corpusTools = new LegalCorpusToolRuntime(this.registry, {
            modelSelectsSkills: request.modelSelectsSkills === true
        });
        const reportTools = new ReportBlueprintToolRuntime();
        const federationTools = this.legalFederationTools;
        const auxiliarySources = [];
        const auxiliary = await this.auxiliaryScheduler
            .preflight({
            config: request.auxiliaryRouting ?? {
                enabled: false,
                provider: "openai",
                model: "local/bielik-11b-v3-q4km"
            },
            primary: {
                provider: request.provider,
                model: request.model
            },
            currentUserText: protectedAuxiliaryText ??
                protectedQuery,
            ...(verificationTools
                ? {
                    runVerificationTools: (calls) => verificationTools
                        .runTools(calls)
                }
                : {})
        });
        audit.record("gate", "G39K_AUXILIARY_MODEL_ROUTING", auxiliary.summary.status ===
            "FAILED"
            ? "DEGRADED"
            : "OK", {
            ...auxiliary.summary
        });
        const modelTaskOwnership = evaluateModelTaskOwnershipGate(auxiliary.summary.ownership);
        audit.record("gate", modelTaskOwnership.gate, modelTaskOwnership.result ===
            "PASS"
            ? "OK"
            : "BLOCKED", {
            registry: modelTaskOwnership.registry,
            resolution: modelTaskOwnership.resolution,
            errors: modelTaskOwnership.errors
        });
        if (modelTaskOwnership.result !==
            "PASS") {
            audit.close("BLOCKED", {
                finalization: "MODEL_TASK_OWNERSHIP"
            });
            throw new Error("MODEL_TASK_OWNERSHIP_GATE_FAILED");
        }
        const gateIInput = evaluateGateIInputCompleteness(request.query, request.documentAttachments
            ?.length ?? 0);
        audit.record("gate", "G39I_INPUT_COMPLETENESS", gateIInput.result ===
            "PASS"
            ? "OK"
            : "BLOCKED", {
            attachmentAssertion: gateIInput.attachmentAssertion,
            attachmentCount: gateIInput.attachmentCount,
            reason: gateIInput.reason
        });
        const contextSelection = orchestrateDocumentContext({
            attachments: request.documentAttachments ?? [],
            query: request.query,
            ...(request.modelContextTokens
                ? {
                    modelContextTokens: request.modelContextTokens
                }
                : {}),
            ...(request.tokenCharsPerToken
                ? {
                    tokenCharsPerToken: request.tokenCharsPerToken
                }
                : {})
        });
        const attachments = namespaceDocumentAttachmentTokens(contextSelection.attachments);
        const citationSources = contextSelection.citationSources;
        const documentContext = attachments.length > 0
            ? buildDocumentContext(attachments)
            : undefined;
        audit.record("gate", "G39C_CONTEXT_BUDGET", "OK", {
            ...contextSelection.report
        });
        for (const attachment of attachments) {
            audit.record("resource_read", `local-document:${attachment.documentId}`, "OK", {
                chunks: attachment.chunks.map((chunk) => chunk.index),
                representations: attachment.chunks.map((chunk) => chunk.representation ??
                    "FULL"),
                protectedOnly: true,
                ...(attachment.caseId ? { caseId: attachment.caseId } : {}),
                ...(attachment.sourceScope ? { sourceScope: attachment.sourceScope } : {})
            });
        }
        const coreLawTools = this.coreLawIndex
            ? new CoreLawToolRuntime(this.coreLawIndex)
            : undefined;
        const toolSchemas = [
            ...corpusTools.schemas(),
            ...(coreLawTools
                ? coreLawTools.schemas()
                : []),
            ...reportTools.schemas(),
            ...(federationTools
                ? federationTools.schemas()
                : []),
            ...(verificationTools ? verificationTools.schemas() : [])
        ];
        const toolPrompt = [
            corpusTools.systemPromptAppendix(),
            ...(coreLawTools
                ? [coreLawTools.systemPromptAppendix()]
                : []),
            reportTools.systemPromptAppendix(),
            ...(federationTools
                ? [federationTools.systemPromptAppendix()]
                : []),
            ...(verificationTools
                ? [verificationTools.systemPromptAppendix()]
                : []),
            ...(auxiliary.appendix
                ? [auxiliary.appendix]
                : []),
            ...(attachments.length > 0
                ? [documentCitationSystemPrompt(attachments)]
                : [])
        ].join("\n\n");
        const draftCallbacks = request.onDraft
            ? createDraftCallbacks(chatPrivacyVault, request.onDraft)
            : undefined;
        const execution = await this.engine.executePolishLegalQuery({
            query: protectedQuery,
            ...(draftCallbacks
                ? {
                    draftCallbacks
                }
                : {}),
            ...(documentContext ? { documentContext } : {}),
            ...(request.conversationalOnly
                ? {
                    conversationalOnly: true
                }
                : {}),
            ...(request.modelSelectsSkills
                ? {
                    modelSelectsSkills: true
                }
                : {}),
            provider: request.provider,
            model: request.model,
            ...(request.accountSessionKey
                ? {
                    continuityKey: request.accountSessionKey
                }
                : {}),
            route: {
                jurisdiction: "PL",
                primarySkill: request.primarySkill,
                mode: request.mode
            },
            ...(request.guideContext
                ? {
                    guideContext: request.guideContext
                }
                : {}),
            ...(request.processWorkflowContext
                ? {
                    processWorkflowContext: request.processWorkflowContext
                }
                : {}),
            ...(request.courtWorkflowContext
                ? {
                    courtWorkflowContext: request.courtWorkflowContext
                }
                : {}),
            ...(request.chronologyWorkflowContext
                ? {
                    chronologyWorkflowContext: request.chronologyWorkflowContext
                }
                : {}),
            ...(request.contractWorkflowContext
                ? {
                    contractWorkflowContext: request.contractWorkflowContext
                }
                : {}),
            ...(request.orderedCaseWorkflowContext
                ? {
                    orderedCaseWorkflowContext: request.orderedCaseWorkflowContext
                }
                : {}),
            tools: toolSchemas,
            toolSystemPromptAppendix: toolPrompt,
            runGateIRuntimePrelude: (workflowPlan) => runGateIRuntimePrelude({
                workflow: workflowPlan.id,
                query: protectedQuery,
                ledger,
                ...(verificationTools
                    ? {
                        runTools: (calls) => verificationTools
                            .runTools(calls)
                    }
                    : {})
            }),
            runTools: async (calls) => {
                const corpusCalls = calls.filter((call) => corpusTools.handles(call.name));
                const reportCalls = calls.filter((call) => reportTools.handles(call.name));
                const federationCalls = calls.filter((call) => federationTools?.handles(call.name) ?? false);
                const coreLawCalls = calls.filter((call) => coreLawTools?.handles(call.name) ?? false);
                const verificationCalls = calls.filter((call) => !(coreLawTools?.handles(call.name) ?? false) &&
                    !corpusTools.handles(call.name) &&
                    !reportTools.handles(call.name) &&
                    !(federationTools?.handles(call.name) ?? false));
                const corpusResults = corpusCalls.length > 0
                    ? await corpusTools.runTools(corpusCalls)
                    : [];
                const coreLawResults = coreLawTools &&
                    coreLawCalls.length > 0
                    ? await coreLawTools.runTools(coreLawCalls)
                    : [];
                const reportResults = reportCalls.length > 0
                    ? await reportTools.runTools(reportCalls)
                    : [];
                const federationResults = federationTools &&
                    federationCalls.length > 0
                    ? await federationTools
                        .runTools(federationCalls)
                    : [];
                for (const result of federationResults) {
                    const source = publicAuxiliarySourceFromToolResult(result);
                    if (!source) {
                        continue;
                    }
                    const key = [
                        source.sourceUrl,
                        source.claim ?? "",
                        source.crossCheckStatus
                    ].join("|");
                    const exists = auxiliarySources.some((item) => [
                        item.sourceUrl,
                        item.claim ?? "",
                        item.crossCheckStatus
                    ].join("|") ===
                        key);
                    if (!exists) {
                        auxiliarySources.push(source);
                    }
                }
                const cachedVerificationResults = [];
                const uncachedVerificationCalls = [];
                for (const call of verificationCalls) {
                    const cached = auxiliary
                        .cachedVerificationResults
                        .get(auxiliaryVerificationCallKey(call));
                    if (cached) {
                        auxiliary.summary
                            .cachedVerifierReuses +=
                            1;
                        cachedVerificationResults.push({
                            ...cached,
                            tool_use_id: call.id
                        });
                    }
                    else {
                        uncachedVerificationCalls.push(call);
                    }
                }
                const verificationResults = uncachedVerificationCalls.length > 0 &&
                    verificationTools
                    ? await verificationTools
                        .runTools(uncachedVerificationCalls)
                    : [];
                const byId = new Map([
                    ...corpusResults,
                    ...coreLawResults,
                    ...reportResults,
                    ...federationResults,
                    ...cachedVerificationResults,
                    ...verificationResults
                ].map((result) => [
                    result.tool_use_id,
                    result
                ]));
                return calls.map((call) => byId.get(call.id) ?? {
                    tool_use_id: call.id,
                    content: JSON.stringify({
                        status: "BLOCKED",
                        error: "UNKNOWN_RUNTIME_TOOL"
                    })
                });
            }
        });
        transferExecutionEvents(execution.events, audit);
        const modelSelectedSkills = execution.events.some((event) => event.target ===
            "MODEL_SKILL_SELECTION" &&
            event.status === "OK");
        if (modelSelectedSkills) {
            // Report what the model actually loaded (audited corpus reads).
            const selection = corpusTools.modelSkillSelection();
            execution.loadedSkills =
                selection.loadedSkills;
            execution.domainSkills =
                selection.domainSkills;
            execution.executionSkills =
                selection.executionSkills;
            if (selection.primarySkill) {
                execution.primarySkill =
                    selection.primarySkill;
            }
        }
        for (const event of coreLawTools?.auditEvents() ?? []) {
            audit.record(event.tool === "read_core_law_article"
                ? "resource_read"
                : "tool_decision", `core-law:${event.target}`, event.decision === "ALLOW" ? "OK" : "BLOCKED", {
                tool: event.tool,
                ...(event.detail ? event.detail : {})
            });
        }
        const corpusAudit = corpusTools.auditEvents();
        for (const event of corpusAudit) {
            audit.record(event.tool === "read_legal_resource"
                ? "resource_read"
                : "tool_decision", event.target, event.decision === "ALLOW" ? "OK" : "BLOCKED", {
                tool: event.tool,
                ...(event.detail ? event.detail : {})
            });
        }
        // When the model picks skills itself, a refused read it can correct
        // (router-v3 not read yet, a guessed file name) is guidance, not a failed
        // turn. Path escapes and other refusals still block.
        const correctableCorpusRefusal = /^(ROUTER_V3_REQUIRED_FIRST|LEGAL_RESOURCE_NOT_FOUND|LEGAL_SKILL_NOT_FOUND|LEGAL_RESOURCE_NOT_FILE|INVALID_RESOURCE_OFFSET)/;
        const corpusBlocked = corpusAudit.some((event) => event.decision === "BLOCK" &&
            !(modelSelectedSkills &&
                correctableCorpusRefusal.test(String(event.detail?.error ?? ""))));
        audit.record("gate", "G36_LEGAL_CORPUS_RUNTIME", corpusBlocked ? "BLOCKED" : "OK", { toolEvents: corpusAudit.length });
        const reportAudit = reportTools.auditEvents();
        for (const event of reportAudit) {
            audit.record("tool_decision", event.target, event.decision === "ALLOW"
                ? "OK"
                : "BLOCKED", {
                tool: event.tool,
                ...(event.detail
                    ? event.detail
                    : {})
            });
        }
        if (federationTools) {
            const federationAudit = federationTools.auditEvents();
            for (const event of federationAudit) {
                audit.record("tool_decision", event.source
                    ? "federated-legal:" +
                        event.source
                    : "federated-legal", event.decision ===
                    "ALLOW"
                    ? "OK"
                    : "BLOCKED", {
                    tool: event.tool,
                    ...(event.detail
                        ? event.detail
                        : {})
                });
            }
            audit.record("gate", "G40_FEDERATED_LEGAL_RESEARCH", federationAudit.some((event) => event.decision ===
                "BLOCK")
                ? "DEGRADED"
                : "OK", {
                toolEvents: federationAudit.length,
                verificationAuthority: "LEX_NATIVE_ONLY"
            });
        }
        const workflowReads = evaluateDeterministicWorkflowReads(execution.workflowPlan, corpusAudit, execution.events);
        const workflowResourcesBlocked = workflowReads.result === "BLOCKED";
        audit.record("gate", "G39H_WORKFLOW_RESOURCE_READS", workflowResourcesBlocked ? "BLOCKED" : "OK", {
            workflow: workflowReads.workflow,
            required: workflowReads.required,
            observed: workflowReads.observed,
            missing: workflowReads.missing
        });
        const automaticVerificationPlan = planAutomaticLegalVerification(execution.output, ledger, requestedHistoricalAsOf);
        let automaticVerificationExecuted = 0;
        if (automaticVerificationPlan.calls.length > 0 &&
            verificationTools) {
            const results = await verificationTools.runTools(automaticVerificationPlan.calls);
            automaticVerificationExecuted =
                results.length;
        }
        const automaticVerification = applyAutomaticVerificationMarkers(execution.output, ledger, requestedHistoricalAsOf);
        audit.record("gate", "G39I_AUTO_POST_DRAFT_VERIFICATION", automaticVerificationPlan.calls.length > 0 &&
            !verificationTools
            ? "BLOCKED"
            : "OK", {
            planned: automaticVerificationPlan.calls.length,
            executed: automaticVerificationExecuted,
            insertedMarkers: automaticVerification.inserted,
            skipped: automaticVerificationPlan.skipped
        });
        if (verificationTools) {
            for (const toolEvent of verificationTools.auditEvents()) {
                audit.record("tool_decision", toolEvent.tool, toolEvent.decision === "ALLOW" ? "OK" : "BLOCKED", {
                    decision: toolEvent.decision,
                    capability: toolEvent.capability ?? null,
                    reason: toolEvent.reason ?? null
                });
            }
        }
        const processedDocumentCitations = processDocumentCitationMarkers(automaticVerification.text, citationSources);
        audit.record("gate", "LOCAL_DOCUMENT_DEEP_LINKS", "OK", {
            accepted: processedDocumentCitations.citations.length,
            rejected: processedDocumentCitations.rejectedMarkers,
            exactHighlights: processedDocumentCitations.citations.filter((item) => item.highlightStart !== undefined && item.highlightEnd !== undefined).length
        });
        const workflowOutput = evaluateDeterministicWorkflowOutput(execution.workflowPlan, processedDocumentCitations.text, request.processWorkflowContext ||
            request.courtWorkflowContext ||
            request.orderedCaseWorkflowContext
            ? {
                ...(request.processWorkflowContext
                    ? {
                        processCheckpoint: request
                            .processWorkflowContext
                            .checkpoint
                    }
                    : {}),
                ...(request.courtWorkflowContext
                    ? {
                        courtCheckpoint: request
                            .courtWorkflowContext
                            .checkpoint
                    }
                    : {}),
                ...(request.orderedCaseWorkflowContext
                    ? {
                        orderedCheckpoint: request
                            .orderedCaseWorkflowContext
                            .checkpoint
                    }
                    : {})
            }
            : undefined);
        const workflowOutputBlocked = workflowOutput.result ===
            "BLOCKED";
        audit.record("gate", "G39H_WORKFLOW_OUTPUT", workflowOutputBlocked
            ? "BLOCKED"
            : "OK", {
            workflow: workflowOutput.workflow,
            mode: workflowOutput.mode,
            required: workflowOutput.required,
            observed: workflowOutput.observed,
            missing: workflowOutput.missing,
            orderValid: workflowOutput.orderValid
        });
        const guideOutput = request.guideContext
            ? evaluateGuideOutput(request.guideContext, processedDocumentCitations.text)
            : null;
        const guideOutputBlocked = guideOutput?.result ===
            "BLOCKED";
        audit.record("gate", "G39I_GUIDE_OUTPUT", guideOutputBlocked
            ? "BLOCKED"
            : "OK", guideOutput
            ? {
                questionCount: guideOutput.questionCount,
                oneQuestionRuleActive: guideOutput
                    .oneQuestionRuleActive,
                irreversibleWarningRequired: guideOutput
                    .irreversibleWarningRequired,
                irreversibleWarningPresent: guideOutput
                    .irreversibleWarningPresent,
                violations: guideOutput.violations
            }
            : {
                active: false
            });
        const requiredReportKind = execution.workflowPlan.id ===
            "CLIENT_REPORT_V1"
            ? "CLIENT_REPORT_V1"
            : execution.workflowPlan.id ===
                "SITUATION_REPORT_V1"
                ? "SITUATION_REPORT_V1"
                : null;
        const reportBlueprint = requiredReportKind
            ? reportTools.acceptedFor(requiredReportKind)
            : null;
        const reportBlueprintBlocked = requiredReportKind !== null &&
            reportBlueprint === null;
        audit.record("gate", "G39I_REPORT_BLUEPRINT", reportBlueprintBlocked
            ? "BLOCKED"
            : "OK", {
            required: requiredReportKind,
            accepted: reportBlueprint?.kind ??
                null,
            toolEvents: reportAudit.length
        });
        const finalizationText = reportBlueprint
            ? [
                processedDocumentCitations.text,
                "[STRUCTURED_REPORT_BLUEPRINT_DATA]",
                JSON.stringify(reportBlueprint.blueprint),
                "[/STRUCTURED_REPORT_BLUEPRINT_DATA]"
            ].join("\n")
            : processedDocumentCitations.text;
        const finalization = this.finalizer.finalize({
            text: finalizationText,
            ledger,
            audit,
            closeSession: false
        });
        const verificationRecords = ledger.all();
        const publicAuxiliarySources = reconcileAuxiliarySourcesWithVerification(auxiliarySources, verificationRecords);
        const gateI = evaluateGateIInvariants({
            events: execution.events,
            workflowReads,
            verificationRecords,
            finalization,
            outputValidation: {
                result: workflowOutputBlocked ||
                    guideOutputBlocked ||
                    reportBlueprintBlocked
                    ? "BLOCKED"
                    : "PASS",
                detail: [
                    `workflow=${workflowOutput.result}`,
                    `guide=${guideOutput?.result ?? "N/A"}`,
                    `reportBlueprint=${reportBlueprintBlocked ? "BLOCKED" : "PASS"}`
                ].join(";")
            },
            documentCitations: {
                accepted: processedDocumentCitations
                    .citations.length,
                rejected: processedDocumentCitations
                    .rejectedMarkers,
                quotedWithoutExactHighlight: processedDocumentCitations
                    .citations
                    .filter((citation) => Boolean(citation.quote) &&
                    (citation
                        .highlightStart ===
                        undefined ||
                        citation
                            .highlightEnd ===
                            undefined))
                    .length
            }
        });
        const gateIBlocked = gateI.result ===
            "BLOCKED";
        const gateIContract = gateIWorkflowContract(execution.workflowPlan.id, execution.workflowPlan
            .executionSkill);
        const stateTransition = gateIContract.stateModel ===
            "DURABLE_CASE"
            ? ((execution.workflowPlan.id ===
                "PROCESS_PLEADING_V1" &&
                request
                    .processWorkflowContext) ||
                (execution.workflowPlan.id ===
                    "COURT_ANALYSIS_V1" &&
                    request
                        .courtWorkflowContext) ||
                (execution.workflowPlan.id ===
                    "CHRONOLOGY_V1" &&
                    request
                        .chronologyWorkflowContext) ||
                (execution.workflowPlan.id ===
                    "CONTRACT_ANALYSIS_V1" &&
                    request
                        .contractWorkflowContext) ||
                ((execution.workflowPlan.id ===
                    "EVIDENCE_ANALYSIS_V1" ||
                    execution.workflowPlan.id ===
                        "WITNESS_QUESTIONING_V1") &&
                    request
                        .orderedCaseWorkflowContext))
                ? "PASS"
                : "BLOCKED"
            : gateIContract.stateModel ===
                "DURABLE_SESSION"
                ? (execution.workflowPlan.id ===
                    "LEGAL_GUIDE_V1" &&
                    request.guideContext)
                    ? "PASS"
                    : "BLOCKED"
                : "NOT_APPLICABLE";
        const gateIWorkflowContractReport = evaluateGateIWorkflowContract({
            contract: gateIContract,
            invariants: gateI,
            input: gateIInput,
            stateTransition
        });
        const gateIWorkflowContractBlocked = gateIWorkflowContractReport.result ===
            "BLOCKED";
        audit.record("gate", gateIWorkflowContractReport.gate, gateIWorkflowContractBlocked
            ? "BLOCKED"
            : "OK", {
            workflow: gateIWorkflowContractReport.workflow,
            stateModel: gateIWorkflowContractReport.stateModel,
            commonInvariants: gateIWorkflowContractReport.commonInvariants,
            checks: gateIWorkflowContractReport.checks
        });
        let gateITurn = createGateITurnState(execution.workflowPlan.id);
        const check = (id) => gateI.checks.find((item) => item.id === id);
        if (check("ROUTER_FIRST")
            ?.result !== "PASS") {
            gateITurn =
                blockGateITurn(gateITurn, "ROUTER_FIRST");
        }
        else {
            gateITurn =
                passGateITurnPhase(gateITurn, "ROUTER_PREFLIGHT", "prawny-router-v3 first");
            const workflowPreflight = execution.events.find((event) => event.type ===
                "gate" &&
                event.target ===
                    "G39H_WORKFLOW_PREFLIGHT");
            if (workflowPreflight
                ?.status !== "OK") {
                gateITurn =
                    blockGateITurn(gateITurn, "SKILL_PREFLIGHT");
            }
            else {
                gateITurn =
                    passGateITurnPhase(gateITurn, "SKILL_PREFLIGHT", execution.workflowPlan.id);
                if (corpusBlocked ||
                    check("CORE_RESOURCES")
                        ?.result !==
                        "PASS" ||
                    check("WORKFLOW_RESOURCES")
                        ?.result !==
                        "PASS") {
                    gateITurn =
                        blockGateITurn(gateITurn, "RESOURCE_READS");
                }
                else {
                    gateITurn =
                        passGateITurnPhase(gateITurn, "RESOURCE_READS", `workflowReads=${workflowReads.observed.length}`);
                    const providerComplete = execution.events.find((event) => event.type ===
                        "gate" &&
                        event.target ===
                            "G39H_WORKFLOW_PROVIDER_COMPLETE");
                    if (providerComplete
                        ?.status !== "OK") {
                        gateITurn =
                            blockGateITurn(gateITurn, "SEMANTIC_EXECUTION");
                    }
                    else {
                        gateITurn =
                            passGateITurnPhase(gateITurn, "SEMANTIC_EXECUTION");
                        if (check("SOURCE_PROVENANCE")
                            ?.result !==
                            "PASS" ||
                            check("SOURCE_HIERARCHY")
                                ?.result !==
                                "PASS" ||
                            check("TEMPORAL_FRESHNESS")
                                ?.result !==
                                "PASS") {
                            gateITurn =
                                blockGateITurn(gateITurn, "SOURCE_VERIFICATION");
                        }
                        else {
                            gateITurn =
                                passGateITurnPhase(gateITurn, "SOURCE_VERIFICATION", `records=${gateI.verifiedOrSupportedRecords}`);
                            if (check("CITATION_LEDGER")
                                ?.result !==
                                "PASS" ||
                                check("LEGAL_CITATIONS")
                                    ?.result !==
                                    "PASS" ||
                                check("CASE_SIGNATURES")
                                    ?.result !==
                                    "PASS" ||
                                check("DOCUMENT_CITATIONS")
                                    ?.result !==
                                    "PASS") {
                                gateITurn =
                                    blockGateITurn(gateITurn, "CITATION_VALIDATION");
                            }
                            else {
                                gateITurn =
                                    passGateITurnPhase(gateITurn, "CITATION_VALIDATION", `references=${gateI.legalReferences};cases=${gateI.caseReferences}`);
                                if (workflowOutputBlocked ||
                                    guideOutputBlocked ||
                                    reportBlueprintBlocked) {
                                    gateITurn =
                                        blockGateITurn(gateITurn, "OUTPUT_VALIDATION");
                                }
                                else {
                                    gateITurn =
                                        passGateITurnPhase(gateITurn, "OUTPUT_VALIDATION");
                                    if (check("FINALIZATION")
                                        ?.result !==
                                        "PASS") {
                                        gateITurn =
                                            blockGateITurn(gateITurn, "FINALIZATION");
                                    }
                                    else {
                                        gateITurn =
                                            passGateITurnPhase(gateITurn, "FINALIZATION");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        audit.record("gate", "G39I_TURN_STATE", gateITurn.result ===
            "PASS"
            ? "OK"
            : "BLOCKED", {
            workflow: gateITurn.workflowId,
            phase: gateITurn.phase,
            result: gateITurn.result,
            events: gateITurn.events.length
        });
        audit.record("gate", gateI.gate, gateIBlocked
            ? "BLOCKED"
            : "OK", {
            checks: gateI.checks,
            verifiedOrSupportedRecords: gateI.verifiedOrSupportedRecords,
            legalReferences: gateI.legalReferences,
            caseReferences: gateI.caseReferences
        });
        const workflowFinalizationBlocked = finalization.result !== "PASS" ||
            corpusBlocked ||
            workflowResourcesBlocked ||
            workflowOutputBlocked ||
            guideOutputBlocked ||
            reportBlueprintBlocked ||
            gateIBlocked ||
            gateIWorkflowContractBlocked;
        const presentationCriticalGateIds = new Set([
            "ROUTER_FIRST",
            "CORE_RESOURCES",
            "ROUTER_REQUIRED_MODULES",
            "WORKFLOW_RESOURCES",
            "OUTPUT_CONTRACT"
        ]);
        const criticalGateIBlocked = gateI.checks.some((item) => presentationCriticalGateIds.has(item.id) &&
            item.result === "BLOCKED");
        const workflowContractExtensionBlocked = gateIWorkflowContractReport
            .checks
            .some((item) => item.result ===
            "BLOCKED");
        const verificationDegraded = finalization.result !==
            "PASS" ||
            gateIBlocked ||
            gateITurn.result !==
                "PASS";
        const presentationBlocked = corpusBlocked ||
            workflowResourcesBlocked ||
            workflowOutputBlocked ||
            guideOutputBlocked ||
            reportBlueprintBlocked ||
            workflowContractExtensionBlocked;
        audit.record("gate", "G39H_WORKFLOW_FINALIZATION", workflowFinalizationBlocked ? "BLOCKED" : "OK", {
            workflow: execution.workflowPlan.id,
            finalization: finalization.result,
            corpusBlocked,
            workflowResourcesBlocked,
            workflowOutputBlocked,
            guideOutputBlocked,
            reportBlueprintBlocked
        });
        const safeToPresent = !presentationBlocked;
        audit.record("gate", "G15_SAFE_SESSION_EXECUTION", presentationBlocked
            ? "BLOCKED"
            : verificationDegraded
                ? "DEGRADED"
                : "OK", {
            finalization: finalization.result,
            verificationDegraded,
            criticalGateIBlocked,
            workflowContractExtensionBlocked
        });
        audit.close(presentationBlocked
            ? "BLOCKED"
            : verificationDegraded
                ? "DEGRADED"
                : "OK", {
            finalization: finalization.result,
            verificationDegraded
        });
        const completeness = audit.validateCompletion({
            requireVerification: finalization.references.length > 0,
            requireToolActivity: finalization.references.length > 0 && Boolean(verificationTools),
            requireDeterministicWorkflow: true
        });
        const blockedReferences = finalization.findings
            .filter((finding) => finding.status !== "VERIFIED")
            .map((finding) => ({
            claim: finding.reference.claim,
            kind: finding.reference.kind,
            line: finding.reference.line,
            status: finding.status
        }));
        const response = {
            sessionId: audit.sessionId,
            status: safeToPresent ? "DRAFT_PRESENTABLE" : "BLOCKED",
            provider: request.provider,
            model: request.model,
            modelRouting: {
                primary: {
                    provider: request.provider,
                    model: request.model
                },
                ...(request.auxiliaryRouting
                    ? {
                        auxiliary: auxiliary.summary
                    }
                    : {})
            },
            primarySkill: execution.primarySkill,
            loadedSkills: execution.loadedSkills,
            executionSkills: execution.executionSkills,
            domainSkills: execution.domainSkills,
            ...(safeToPresent
                ? {
                    answer: processedDocumentCitations
                        .text.replace(PII_TOKEN_WITH_CASE, (token, kind, sequence, requestedCase) => {
                        const base = `[PII:${kind}:${sequence}]`;
                        return chatPrivacyVault.hasToken(base)
                            ? chatPrivacyVault.restore(base, requestedCase ?? null).text
                            : token;
                    }),
                    documentCitations: processedDocumentCitations.citations,
                    ...(reportBlueprint
                        ? {
                            reportBlueprint
                        }
                        : {})
                }
                : {}),
            finalization: finalization.result,
            blockedReferences,
            verification: {
                records: verificationRecords.length,
                verified: verificationRecords.filter((record) => record.status === "VERIFIED").length,
                supported: verificationRecords.filter((record) => record.status === "SUPPORTED").length,
                unverified: verificationRecords.filter((record) => record.status === "UNVERIFIED").length
            },
            evidence: publicEvidenceBundle(verificationRecords),
            ...(publicAuxiliarySources.length > 0
                ? {
                    auxiliarySources: publicAuxiliarySources
                }
                : {}),
            context: {
                ...contextSelection.report
            },
            audit: {
                result: completeness.result,
                eventCount: completeness.eventCount,
                closed: audit.isClosed,
                missing: [...completeness.missing],
                violations: [...completeness.violations]
            },
            workflow: {
                id: execution.workflowPlan.id,
                result: workflowResourcesBlocked ||
                    workflowOutputBlocked ||
                    guideOutputBlocked ||
                    reportBlueprintBlocked ||
                    finalization.result !== "PASS" ||
                    gateIBlocked
                    ? "BLOCKED"
                    : "PASS",
                requiredResources: workflowReads.required,
                missingResources: workflowReads.missing
            },
            gateI,
            gateIWorkflowContract: gateIWorkflowContractReport,
            gateITurn
        };
        Object.defineProperty(response, SESSION_EXECUTION_INTERNAL, {
            value: {
                verificationRecords: verificationRecords.map((record) => ({ ...record })),
                auditEvents: audit.events.map((event) => ({
                    ...event,
                    ...(event.detail ? { detail: { ...event.detail } } : {})
                })),
                documentAliasDocumentIds: [
                    ...new Set(attachments.map((attachment) => attachment.documentId))
                ]
            },
            enumerable: false,
            configurable: false,
            writable: false
        });
        return response;
    }
}
