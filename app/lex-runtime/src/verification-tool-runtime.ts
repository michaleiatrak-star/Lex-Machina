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
  VerificationLedger,
  type VerificationKind
} from "./verification-ledger.js";

const TOOL_NAME = "verify_legal_reference";

const TOOL_SCHEMA: NormalizedToolSchema = {
  type: "function",
  function: {
    name: TOOL_NAME,
    description:
      "Verify one Polish statutory or Journal of Laws reference. " +
      "Provide the exact citation and the legal act identity/alias only. " +
      "The runtime resolves the official source URL and expected title; never supply or invent transport URLs. " +
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
        }
      }
    }
  }
};

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
  },
  act: LegalActDescriptor
): string {
  const marker =
    record.status === "VERIFIED"
      ? "✅ [VER: " +
        (record.sourceUrl ?? "official-source") +
        ", " +
        record.fetchedAt.slice(0, 10) +
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
    sourceUrl: record.sourceUrl ?? null,
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
  "- Pass only claim + kind + legal act identity/alias. Never invent or supply an official-source URL.",
  "- The runtime resolves the canonical official source and expected act title.",
  "- A citation is verified only when the tool returns status=VERIFIED.",
  "- For VERIFIED results, copy the returned marker verbatim onto the SAME LINE as the exact citation.",
  "- Never invent a verification marker, source URL, or tool result.",
  "- For UNVERIFIED/DENIED results, do not represent the citation as verified.",
  "- Case-law signatures are outside this tool and remain unverified unless a separate runtime tool verifies them."
].join("\n");

export class LegalVerificationToolRuntime {
  private readonly broker: ToolBroker;
  private readonly resolverAudit: ToolAuditEvent[] = [];

  constructor(
    private readonly ledger: VerificationLedger,
    verifier = new OfficialLegalSourceVerifier(),
    private readonly resolver =
      new DeterministicLegalActResolver()
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

        const result = await verifier.verify({
          claim,
          kind: verificationKind,
          url,
          expectedTitle,
          toolCallId
        });
        this.ledger.add(result.record);
        return publicToolResult(result.record, act);
      }
    });
  }

  schemas(): NormalizedToolSchema[] {
    return [TOOL_SCHEMA];
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
      const actInput =
        typeof call.input.act === "string"
          ? call.input.act.trim()
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

      const result = await this.broker.execute({
        name: call.name,
        input: {
          claim: call.input.claim,
          kind: call.input.kind,
          toolCallId: call.id,
          url: resolvedAct.sourceUrl,
          expectedTitle: resolvedAct.title,
          resolvedAct
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
