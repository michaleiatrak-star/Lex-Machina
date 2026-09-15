import {
  SupremeCourtCaseVerifier,
  propositionEvidenceHash,
  supremeCourtSearchUrl
} from "./case-law-verifier.js";
import {
  DeterministicLegalActResolver,
  LegalActResolutionError,
  type LegalActDescriptor
} from "./legal-act-resolver.js";
import {
  ToolBroker,
  ToolPolicy,
  type ToolAuditEvent
} from "./tool-broker.js";
import {
  OFFICIAL_LEGAL_SOURCE_HOSTS,
  OfficialLegalSourceVerifier
} from "./legal-source-verifier.js";
import type {
  NormalizedToolCall,
  NormalizedToolResult,
  NormalizedToolSchema
} from "./providers/types.js";
import {
  TemporalSourceFreshnessChecker,
  type TemporalFreshnessResult
} from "./temporal-source-freshness.js";
import {
  VerificationLedger,
  type VerificationKind,
  type VerificationRecord
} from "./verification-ledger.js";

const TOOL_NAME = "verify_legal_reference";
const CASE_TOOL_NAME = "verify_case_reference";
const CASE_QUOTE_TOOL_NAME =
  "verify_case_quote";
const CASE_PROPOSITION_TOOL_NAME =
  "verify_case_proposition";

const TOOL_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: TOOL_NAME,
    description:
      "Verify one Polish statutory or Journal of Laws reference. " +
      "Provide the exact citation and the legal act identity/alias only. " +
      "The runtime resolves and freshness-checks the official source; never supply or invent transport URLs. " +
      "Only status VERIFIED permits copying the returned marker onto the same line as the exact citation. " +
      "Case-law signatures are not verified by this tool.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["claim", "kind", "act"],
      properties: {
        claim: {
          type: "string",
          description:
            "Exact legal reference that will appear in the answer, e.g. art. 5 KC."
        },
        kind: {
          type: "string",
          enum: ["statute", "journal"]
        },
        act: {
          type: "string",
          description:
            "Legal act identity or alias known to the runtime, e.g. KC, KPC, KPK or the full act title."
        },
        asOf: {
          type: "string",
          description:
            "Optional historical legal-state date in YYYY-MM-DD. Use only when the user asks for a past legal state. Omit for current law."
        }
      }
    }
  }
};


const CASE_TOOL_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: CASE_TOOL_NAME,
    description:
      "Verify a Sąd Najwyższy case signature against the official sn.pl database. " +
      "Provide the exact output claim, raw signature and courtFamily=SN. " +
      "Never supply a source URL. VERIFIED confirms official existence and full-text identity, not an arbitrary paraphrased thesis.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [
        "claim",
        "signature",
        "courtFamily"
      ],
      properties: {
        claim: {
          type: "string",
          description:
            "Exact case citation as it will appear in the answer, e.g. sygn. III CZP 25/11."
        },
        signature: {
          type: "string",
          description:
            "Raw Sąd Najwyższy signature, e.g. III CZP 25/11."
        },
        courtFamily: {
          type: "string",
          enum: ["SN"]
        }
      }
    }
  }
};

const CASE_QUOTE_TOOL_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: CASE_QUOTE_TOOL_NAME,
    description:
      "Verify an exact quotation against the official full text of a Sąd Najwyższy judgment. " +
      "Use only for verbatim quotations. Provide the exact case citation, signature, quote and courtFamily=SN. " +
      "Never supply a source URL. Paraphrases are not VERIFIED by this tool.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [
        "caseClaim",
        "signature",
        "quote",
        "courtFamily"
      ],
      properties: {
        caseClaim: {
          type: "string",
          description:
            "Exact case citation as it will appear in the answer, e.g. sygn. II CSK 101/20."
        },
        signature: {
          type: "string",
          description:
            "Raw Sąd Najwyższy signature."
        },
        quote: {
          type: "string",
          description:
            "Exact verbatim quotation that will appear in the answer. Do not paraphrase."
        },
        courtFamily: {
          type: "string",
          enum: ["SN"]
        }
      }
    }
  }
};

const CASE_PROPOSITION_TOOL_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: CASE_PROPOSITION_TOOL_NAME,
    description:
      "Link one paraphrased proposition to one exact quotation from the official full text of a Sąd Najwyższy judgment. " +
      "This returns status SUPPORTED, not VERIFIED: the runtime verifies the case and support quote, but does not independently decide semantic entailment. " +
      "Provide the exact output proposition, exact supportQuote, case citation, signature and courtFamily=SN. Never supply a source URL.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [
        "caseClaim",
        "signature",
        "proposition",
        "supportQuote",
        "courtFamily"
      ],
      properties: {
        caseClaim: {
          type: "string",
          description:
            "Exact case citation as it will appear in the answer."
        },
        signature: {
          type: "string",
          description:
            "Raw Sąd Najwyższy signature."
        },
        proposition: {
          type: "string",
          description:
            "Exact paraphrased proposition that will appear in the answer. It will be evidence-linked, not semantically VERIFIED."
        },
        supportQuote: {
          type: "string",
          description:
            "Exact verbatim passage from the judgment that will be shown with the proposition."
        },
        courtFamily: {
          type: "string",
          enum: ["SN"]
        }
      }
    }
  }
};


function publicCasePropositionToolResult(
  caseRecord: VerificationRecord,
  quoteRecord: VerificationRecord,
  supportRecord: VerificationRecord
): string {
  if (
    caseRecord.status !== "VERIFIED" ||
    quoteRecord.status !== "VERIFIED" ||
    quoteRecord.caseScope !== "EXACT_QUOTE" ||
    supportRecord.status !== "SUPPORTED" ||
    supportRecord.caseScope !== "PROPOSITION_SUPPORT" ||
    !supportRecord.evidenceHash ||
    !supportRecord.supportQuoteHash
  ) {
    throw new Error(
      "CASE_PROPOSITION_SUPPORT_INVALID"
    );
  }

  const source =
    supportRecord.sourceUrl ??
    quoteRecord.sourceUrl ??
    caseRecord.sourceUrl ??
    "sn.pl";
  const date =
    supportRecord.fetchedAt.slice(0, 10);

  return JSON.stringify({
    status: "SUPPORTED",
    semanticVerification: false,
    courtFamily: "SN",
    caseClaim: caseRecord.claim,
    signature:
      supportRecord.caseSignature ?? null,
    proposition:
      supportRecord.claim,
    supportQuote:
      supportRecord.supportQuote ?? null,
    sourceUrl: source,
    fetchedAt:
      supportRecord.fetchedAt,
    caseMarker:
      "✅ [VER: " +
      source +
      ", " +
      date +
      "]",
    quoteMarker:
      "✅ [CASE-QUOTE:" +
      supportRecord.supportQuoteHash +
      "]",
    supportMarker:
      "🔗 [CASE-SUPPORT:" +
      supportRecord.evidenceHash +
      "]",
    evidenceHash:
      supportRecord.evidenceHash,
    supportQuoteHash:
      supportRecord.supportQuoteHash,
    instruction:
      "This proposition is evidence-linked, not semantically VERIFIED. Keep the proposition text unchanged. " +
      "Show the exact supportQuote, exact case citation, caseMarker, quoteMarker and supportMarker on the SAME LINE. " +
      "Do not replace SUPPORTED with VERIFIED and do not omit the supporting quotation."
  });
}

function publicCaseQuoteToolResult(
  caseRecord: VerificationRecord,
  quoteRecord: VerificationRecord,
  evidenceHash: string
): string {
  if (
    caseRecord.status !== "VERIFIED" ||
    quoteRecord.status !== "VERIFIED" ||
    quoteRecord.caseScope !== "EXACT_QUOTE"
  ) {
    throw new Error(
      "CASE_QUOTE_RECORD_NOT_VERIFIED"
    );
  }

  const source =
    quoteRecord.sourceUrl ??
    caseRecord.sourceUrl ??
    "sn.pl";
  const date =
    quoteRecord.fetchedAt
      .slice(0, 10);
  const caseMarker =
    "✅ [VER: " +
    source +
    ", " +
    date +
    "]";
  const quoteMarker =
    "✅ [CASE-QUOTE:" +
    evidenceHash +
    "]";

  return JSON.stringify({
    status: "VERIFIED",
    courtFamily: "SN",
    caseClaim:
      caseRecord.claim,
    signature:
      quoteRecord.caseSignature ??
      null,
    quote:
      quoteRecord.claim,
    sourceUrl:
      source,
    fetchedAt:
      quoteRecord.fetchedAt,
    caseMarker,
    quoteMarker,
    evidenceHash,
    instruction:
      "Use the quotation verbatim. Put the exact quotation, exact case citation, caseMarker and quoteMarker on the SAME LINE. " +
      "Do not edit the quotation and do not use this result to verify a paraphrase."
  });
}

function publicCaseToolResult(
  record: VerificationRecord,
  judgment: {
    signature: string;
    date?: string;
    form?: string;
    contentScope: "FULL_TEXT";
  }
): string {
  if (record.status !== "VERIFIED") {
    throw new Error(
      "CASE_VERIFICATION_RECORD_NOT_VERIFIED"
    );
  }

  const marker =
    "✅ [VER: " +
    (record.sourceUrl ?? "sn.pl") +
    ", " +
    record.fetchedAt.slice(0, 10) +
    "]";

  return JSON.stringify({
    claim: record.claim,
    status: record.status,
    courtFamily: "SN",
    signature: judgment.signature,
    date: judgment.date ?? null,
    form: judgment.form ?? null,
    contentScope:
      judgment.contentScope,
    sourceUrl:
      record.sourceUrl ?? null,
    fetchedAt: record.fetchedAt,
    marker,
    instruction:
      "The signature/metadata and official full-text identity are verified. " +
      "Copy the marker onto the same line as the exact signature. " +
      "Do not attribute a legal thesis or quote unless that proposition is separately verified against the fetched judgment text."
  });
}

function isVerifiedRecord(
  record: VerificationRecord | undefined
): record is VerificationRecord & {
  status: "VERIFIED";
} {
  return record?.status === "VERIFIED";
}

function kind(value: unknown): VerificationKind | null {
  return value === "statute" || value === "journal"
    ? value
    : null;
}

function publicToolResult(
  record: {
    claim: string;
    status: "VERIFIED" | "UNVERIFIED";
    sourceUrl?: string;
    fetchedAt: string;
    temporalMode?: "CURRENT" | "HISTORICAL";
    asOf?: string;
    sourceFormat?: "TEXT" | "PDF";
  },
  act: LegalActDescriptor,
  freshness?: TemporalFreshnessResult
): string {
  const marker =
    record.status === "VERIFIED"
      ? "✅ [VER: " +
        (record.sourceUrl ?? "official-source") +
        ", " +
        record.fetchedAt.slice(0, 10) +
        (record.asOf
          ? ", STAN NA " + record.asOf
          : "") +
        "]"
      : "⚠️ [NIEWERYFIKOWANE]";

  return JSON.stringify({
    claim: record.claim,
    status: record.status,
    act: {
      id: act.id,
      title: act.title,
      eli: act.eli,
      baseEli: act.baseEli,
      sourceKind: act.sourceKind,
      registryAsOf: act.registryAsOf
    },
    freshness: freshness
      ? {
          status: freshness.status,
          mode: freshness.mode,
          checkedAt: freshness.checkedAt,
          requestedAsOf: freshness.requestedAsOf ?? null,
          currentEli: freshness.currentEli ?? null,
          amendmentsAfter: freshness.amendmentsAfter.length
        }
      : null,
    sourceUrl: record.sourceUrl ?? null,
    sourceFormat: record.sourceFormat ?? null,
    fetchedAt: record.fetchedAt,
    marker,
    instruction:
      record.status === "VERIFIED"
        ? "Copy the marker verbatim onto the same line as this exact legal reference."
        : "Do not present this reference as verified; if it must be mentioned, use the unverified marker."
  });
}

export const LEGAL_VERIFICATION_SYSTEM_APPENDIX = [
  "RUNTIME LEGAL-SOURCE VERIFICATION:",
  "- Before emitting any statutory citation (art. or Dz.U.), call verify_legal_reference.",
  "- Pass only claim + kind + legal act identity/alias. Never invent or supply an official-source URL.",  "- The runtime resolves the canonical official source and checks temporal freshness before reading the citation.",
  "- For current law omit asOf. A citation is verified only when the freshness check is CURRENT and the verification tool returns status=VERIFIED.",
  "- If the user explicitly asks for a past legal state, pass asOf=YYYY-MM-DD. Historical verification is allowed only when ELI proves the act was in force on that date and the selected historical consolidated text covers that date without intervening amendments.",
  "- For VERIFIED results, copy the returned marker verbatim onto the SAME LINE as the exact citation.",
  "- Never invent a verification marker, source URL, or tool result.",
  "- For UNVERIFIED/DENIED results, do not represent the citation as verified.",
  "- Before emitting a case signature (sygn.), call verify_case_reference.",
  "- The first supported courtFamily is SN. Pass only claim + signature + courtFamily; never invent or supply the sn.pl URL.",
  "- VERIFIED case output confirms exact official signature/metadata and full-text identity. It does not authorize an invented thesis or quote.",
  "- For a verbatim quotation attributed to SN, call verify_case_quote. Copy the exact quote plus both returned markers onto the SAME LINE as the exact case citation.",
  "- For a paraphrased proposition attributed to SN, call verify_case_proposition with the exact proposition plus an exact supporting quotation.",
  "- verify_case_proposition returns SUPPORTED, never VERIFIED. SUPPORTED means the proposition is transparently linked to official evidence; semantic entailment is not independently decided by the runtime.",
  "- For SUPPORTED propositions, keep the exact proposition and supportQuote unchanged and put them with the case citation, case marker, CASE-QUOTE marker and CASE-SUPPORT marker on the SAME LINE."
].join("\n");

export class LegalVerificationToolRuntime {
  private readonly broker: ToolBroker;
  private readonly resolverAudit: ToolAuditEvent[] = [];

  constructor(
    private readonly ledger: VerificationLedger,
    private readonly verifier =
      new OfficialLegalSourceVerifier(),
    private readonly resolver =
      new DeterministicLegalActResolver(),
    private readonly freshnessChecker:
      TemporalSourceFreshnessChecker | null = null,
    private readonly caseVerifier =
      new SupremeCourtCaseVerifier()
  ) {
    this.broker = new ToolBroker(
      new ToolPolicy({
        allowNetwork: true,
        allowedNetworkHosts: [
          ...OFFICIAL_LEGAL_SOURCE_HOSTS
        ]
      })
    );

    this.broker.register({
      name: CASE_PROPOSITION_TOOL_NAME,
      capability: "network",
      execute: async (input) => {
        const caseClaim =
          typeof input.caseClaim === "string"
            ? input.caseClaim.trim()
            : "";
        const signature =
          typeof input.signature === "string"
            ? input.signature.trim()
            : "";
        const proposition =
          typeof input.proposition === "string"
            ? input.proposition.trim()
            : "";
        const supportQuote =
          typeof input.supportQuote === "string"
            ? input.supportQuote.trim()
            : "";
        const toolCallId =
          typeof input.toolCallId === "string"
            ? input.toolCallId
            : "";

        if (
          !caseClaim ||
          !signature ||
          !proposition ||
          !supportQuote ||
          !toolCallId
        ) {
          throw new Error(
            "INVALID_CASE_PROPOSITION_INPUT"
          );
        }

        const quoteResult =
          await this.caseVerifier
            .verifyExactQuote({
              caseClaim,
              signature,
              quote:
                supportQuote,
              toolCallId
            });

        const caseRecord =
          quoteResult.caseResult.record;
        const quoteRecord =
          quoteResult.quoteRecord;

        if (
          quoteResult.status !== "VERIFIED" ||
          !quoteResult.evidenceHash ||
          !isVerifiedRecord(caseRecord) ||
          !isVerifiedRecord(quoteRecord)
        ) {
          return JSON.stringify({
            status:
              "UNVERIFIED",
            error:
              quoteResult.reason ?? null,
            normalizedSignature:
              quoteResult.normalizedSignature
          });
        }

        const evidenceHash =
          propositionEvidenceHash(
            quoteResult.normalizedSignature,
            proposition,
            supportQuote
          );

        const supportSource =
          quoteRecord.sourceUrl ??
          caseRecord.sourceUrl;

        if (!supportSource) {
          throw new Error(
            "CASE_PROPOSITION_SOURCE_MISSING"
          );
        }

        const supportRecord:
          VerificationRecord = {
            claim: proposition,
            kind: "case",
            status: "SUPPORTED",
            sourceUrl:
              supportSource,
            ...(quoteRecord.sourceTier
              ? {
                  sourceTier:
                    quoteRecord.sourceTier
                }
              : {}),
            fetchedAt:
              quoteRecord.fetchedAt,
            toolCallId,
            verificationMethod:
              "web_fetch",
            sourceFormat: "TEXT",
            caseScope:
              "PROPOSITION_SUPPORT",
            caseSignature:
              quoteResult.normalizedSignature,
            evidenceHash,
            supportQuoteHash:
              quoteResult.evidenceHash,
            supportQuote,
            evidence:
              "Evidence-linked proposition; semantic entailment not independently verified."
          };

        this.ledger.add(
          caseRecord
        );
        this.ledger.add(
          quoteRecord
        );
        this.ledger.add(
          supportRecord
        );

        return publicCasePropositionToolResult(
          caseRecord,
          quoteRecord,
          supportRecord
        );
      }
    });

    this.broker.register({
      name: CASE_QUOTE_TOOL_NAME,
      capability: "network",
      execute: async (input) => {
        const caseClaim =
          typeof input.caseClaim === "string"
            ? input.caseClaim.trim()
            : "";
        const signature =
          typeof input.signature === "string"
            ? input.signature.trim()
            : "";
        const quote =
          typeof input.quote === "string"
            ? input.quote.trim()
            : "";
        const toolCallId =
          typeof input.toolCallId === "string"
            ? input.toolCallId
            : "";

        if (
          !caseClaim ||
          !signature ||
          !quote ||
          !toolCallId
        ) {
          throw new Error(
            "INVALID_CASE_QUOTE_INPUT"
          );
        }

        const result =
          await this.caseVerifier
            .verifyExactQuote({
              caseClaim,
              signature,
              quote,
              toolCallId
            });

        const caseRecord =
          result.caseResult.record;
        const quoteRecord =
          result.quoteRecord;

        if (
          result.status !== "VERIFIED" ||
          !result.evidenceHash ||
          !isVerifiedRecord(caseRecord) ||
          !isVerifiedRecord(quoteRecord)
        ) {
          return JSON.stringify({
            status: result.status,
            error:
              result.reason ?? null,
            normalizedSignature:
              result.normalizedSignature
          });
        }

        this.ledger.add(
          caseRecord
        );
        this.ledger.add(
          quoteRecord
        );

        return publicCaseQuoteToolResult(
          caseRecord,
          quoteRecord,
          result.evidenceHash
        );
      }
    });

    this.broker.register({
      name: CASE_TOOL_NAME,
      capability: "network",
      execute: async (input) => {
        const claim =
          typeof input.claim === "string"
            ? input.claim.trim()
            : "";
        const signature =
          typeof input.signature === "string"
            ? input.signature.trim()
            : "";
        const toolCallId =
          typeof input.toolCallId === "string"
            ? input.toolCallId
            : "";

        if (!claim || !signature || !toolCallId) {
          throw new Error(
            "INVALID_CASE_VERIFICATION_INPUT"
          );
        }

        const result =
          await this.caseVerifier.verify({
            claim,
            signature,
            toolCallId
          });

        if (
          result.status !== "FOUND" ||
          !isVerifiedRecord(result.record) ||
          !result.judgment
        ) {
          return JSON.stringify({
            status: result.status,
            error:
              result.reason ?? null,
            normalizedSignature:
              result.normalizedSignature,
            rejectedNearMatches:
              result.rejectedNearMatches
          });
        }

        this.ledger.add(
          result.record
        );

        return publicCaseToolResult(
          result.record,
          result.judgment
        );
      }
    });

    this.broker.register({
      name: TOOL_NAME,
      capability: "network",
      execute: async (input) => {
        const claim =
          typeof input.claim === "string"
            ? input.claim.trim()
            : "";
        const verificationKind = kind(input.kind);
        const url =
          typeof input.url === "string"
            ? input.url.trim()
            : "";
        const expectedTitle =
          typeof input.expectedTitle === "string"
            ? input.expectedTitle.trim()
            : "";
        const toolCallId =
          typeof input.toolCallId === "string"
            ? input.toolCallId
            : "";
        const act = input.resolvedAct as
          | LegalActDescriptor
          | undefined;
        const freshness = input.freshness as
          | TemporalFreshnessResult
          | undefined;
        const temporalMode =
          input.temporalMode === "HISTORICAL"
            ? "HISTORICAL"
            : "CURRENT";
        const asOf =
          typeof input.asOf === "string"
            ? input.asOf
            : undefined;

        if (
          !claim ||
          !verificationKind ||
          !url ||
          !expectedTitle ||
          !toolCallId ||
          !act
        ) {
          throw new Error("INVALID_VERIFICATION_INPUT");
        }

        const result = await this.verifier.verify({
          claim,
          kind: verificationKind,
          url,
          expectedTitle,
          toolCallId
        });
        this.ledger.add({
          ...result.record,
          temporalMode,
          ...(asOf ? { asOf } : {})
        });
        return publicToolResult(
          {
            ...result.record,
            temporalMode,
            ...(asOf ? { asOf } : {})
          },
          act,
          freshness
        );
      }
    });
  }

  schemas(): NormalizedToolSchema[] {
    return [
      TOOL_SCHEMA,
      CASE_TOOL_SCHEMA,
      CASE_QUOTE_TOOL_SCHEMA,
      CASE_PROPOSITION_TOOL_SCHEMA
    ];
  }

  systemPromptAppendix(): string {
    return LEGAL_VERIFICATION_SYSTEM_APPENDIX;
  }

  auditEvents(): readonly ToolAuditEvent[] {
    return [
      ...this.resolverAudit.map((event) => ({ ...event })),
      ...this.broker.audit.map((event) => ({ ...event }))
    ].map((event, index) => ({
      ...event,
      sequence: index + 1
    }));
  }

  async runTools(
    calls: NormalizedToolCall[]
  ): Promise<NormalizedToolResult[]> {
    const results: NormalizedToolResult[] = [];

    for (const call of calls) {
      if (
        call.name ===
        CASE_PROPOSITION_TOOL_NAME
      ) {
        const signature =
          typeof call.input.signature === "string"
            ? call.input.signature.trim()
            : "";
        const courtFamily =
          typeof call.input.courtFamily === "string"
            ? call.input.courtFamily.trim()
            : "";

        if (courtFamily !== "SN") {
          this.resolverAudit.push({
            sequence:
              this.resolverAudit.length + 1,
            tool:
              CASE_PROPOSITION_TOOL_NAME,
            capability: "network",
            decision: "DENY",
            reason:
              "UNSUPPORTED_COURT_FAMILY"
          });
          results.push({
            tool_use_id: call.id,
            content:
              JSON.stringify({
                status: "OUT_OF_SCOPE",
                error:
                  "UNSUPPORTED_COURT_FAMILY"
              })
          });
          continue;
        }

        const result =
          await this.broker.execute({
            name:
              CASE_PROPOSITION_TOOL_NAME,
            input: {
              caseClaim:
                call.input.caseClaim,
              signature,
              proposition:
                call.input.proposition,
              supportQuote:
                call.input.supportQuote,
              toolCallId:
                call.id,
              url:
                supremeCourtSearchUrl(
                  signature
                )
            }
          });

        results.push({
          tool_use_id: call.id,
          content: result.ok
            ? String(
                result.output ?? ""
              )
            : JSON.stringify({
                status:
                  "OUT_OF_SCOPE",
                error:
                  result.error ??
                  "CASE_PROPOSITION_TOOL_FAILED"
              })
        });
        continue;
      }

      if (
        call.name ===
        CASE_QUOTE_TOOL_NAME
      ) {
        const signature =
          typeof call.input.signature === "string"
            ? call.input.signature.trim()
            : "";
        const courtFamily =
          typeof call.input.courtFamily === "string"
            ? call.input.courtFamily.trim()
            : "";

        if (courtFamily !== "SN") {
          this.resolverAudit.push({
            sequence:
              this.resolverAudit.length + 1,
            tool: CASE_QUOTE_TOOL_NAME,
            capability: "network",
            decision: "DENY",
            reason:
              "UNSUPPORTED_COURT_FAMILY"
          });
          results.push({
            tool_use_id: call.id,
            content: JSON.stringify({
              status: "OUT_OF_SCOPE",
              error:
                "UNSUPPORTED_COURT_FAMILY"
            })
          });
          continue;
        }

        const result =
          await this.broker.execute({
            name:
              CASE_QUOTE_TOOL_NAME,
            input: {
              caseClaim:
                call.input.caseClaim,
              signature,
              quote:
                call.input.quote,
              toolCallId:
                call.id,
              url:
                supremeCourtSearchUrl(
                  signature
                )
            }
          });

        results.push({
          tool_use_id: call.id,
          content: result.ok
            ? String(
                result.output ?? ""
              )
            : JSON.stringify({
                status: "OUT_OF_SCOPE",
                error:
                  result.error ??
                  "CASE_QUOTE_TOOL_FAILED"
              })
        });
        continue;
      }

      if (call.name === CASE_TOOL_NAME) {
        const signature =
          typeof call.input.signature === "string"
            ? call.input.signature.trim()
            : "";
        const courtFamily =
          typeof call.input.courtFamily === "string"
            ? call.input.courtFamily.trim()
            : "";

        if (courtFamily !== "SN") {
          this.resolverAudit.push({
            sequence:
              this.resolverAudit.length + 1,
            tool: CASE_TOOL_NAME,
            capability: "network",
            decision: "DENY",
            reason:
              "UNSUPPORTED_COURT_FAMILY"
          });
          results.push({
            tool_use_id: call.id,
            content: JSON.stringify({
              status: "OUT_OF_SCOPE",
              error:
                "UNSUPPORTED_COURT_FAMILY"
            })
          });
          continue;
        }

        const result =
          await this.broker.execute({
            name: CASE_TOOL_NAME,
            input: {
              claim: call.input.claim,
              signature,
              toolCallId: call.id,
              url:
                supremeCourtSearchUrl(
                  signature
                )
            }
          });

        results.push({
          tool_use_id: call.id,
          content: result.ok
            ? String(
                result.output ?? ""
              )
            : JSON.stringify({
                status: "OUT_OF_SCOPE",
                error:
                  result.error ??
                  "CASE_TOOL_FAILED"
              })
        });
        continue;
      }

      const actInput =
        typeof call.input.act === "string"
          ? call.input.act.trim()
          : "";
      const asOf =
        typeof call.input.asOf === "string"
          ? call.input.asOf.trim()
          : "";

      let resolvedAct: LegalActDescriptor;
      try {
        resolvedAct = this.resolver.resolve(actInput);
      } catch (error) {
        const reason =
          error instanceof LegalActResolutionError
            ? error.code
            : "LEGAL_ACT_RESOLUTION_FAILED";

        this.resolverAudit.push({
          sequence: this.resolverAudit.length + 1,
          tool: TOOL_NAME,
          capability: "network",
          decision: "DENY",
          reason
        });
        results.push({
          tool_use_id: call.id,
          content: JSON.stringify({
            status: "DENIED",
            error: reason
          })
        });
        continue;
      }

      let freshness:
        | TemporalFreshnessResult
        | undefined;

      if (this.freshnessChecker) {
        freshness =
          await this.freshnessChecker.check(
            resolvedAct,
            asOf ? { asOf } : {}
          );

        const directTextStatus =
          freshness.status === "CURRENT" ||
          freshness.status === "HISTORICAL";
        const pdfTextStatus =
          freshness.status ===
            "CURRENT_TEXT_REQUIRES_PDF" ||
          freshness.status ===
            "HISTORICAL_TEXT_REQUIRES_PDF";
        const temporalStatusPermitsVerification =
          directTextStatus ||
          (
            pdfTextStatus &&
            this.verifier.supportsPdf()
          );

        if (!temporalStatusPermitsVerification) {
          const reason =
            "TEMPORAL_" + freshness.status;

          this.resolverAudit.push({
            sequence:
              this.resolverAudit.length + 1,
            tool: TOOL_NAME,
            capability: "network",
            decision: "DENY",
            reason
          });
          results.push({
            tool_use_id: call.id,
            content: JSON.stringify({
              status: "DENIED",
              error: reason,
              freshness: {
                status: freshness.status,
                checkedAt:
                  freshness.checkedAt,
                currentEli:
                  freshness.currentEli ??
                  null,
                amendmentsAfter:
                  freshness.amendmentsAfter
                    .length,
                reason:
                  freshness.reason ?? null
              }
            })
          });
          continue;
        }
      }

      const sourceUrl =
        freshness?.sourceUrl ??
        resolvedAct.sourceUrl;

      const result = await this.broker.execute({
        name: call.name,
        input: {
          claim: call.input.claim,
          kind: call.input.kind,
          toolCallId: call.id,
          url: sourceUrl,
          expectedTitle: resolvedAct.title,
          resolvedAct,
          ...(freshness
            ? { freshness }
            : {}),
          ...(freshness?.mode === "HISTORICAL"
            ? {
                temporalMode: "HISTORICAL",
                ...(freshness.requestedAsOf
                  ? {
                      asOf:
                        freshness.requestedAsOf
                    }
                  : {})
              }
            : {
                temporalMode: "CURRENT"
              })
        }
      });

      results.push({
        tool_use_id: call.id,
        content: result.ok
          ? String(result.output ?? "")
          : JSON.stringify({
              status: "DENIED",
              error: result.error ?? "TOOL_FAILED"
            })
      });
    }

    return results;
  }
}

export type LegalVerificationToolFactory = (
  ledger: VerificationLedger
) => LegalVerificationToolRuntime;