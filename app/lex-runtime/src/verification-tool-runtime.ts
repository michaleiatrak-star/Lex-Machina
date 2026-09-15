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
      "Verify one Polish statutory or Journal of Laws reference against a fresh official ELI/ISAP/Sejm source. " +
      "Call this before emitting every art. or Dz.U. citation. " +
      "The tool checks the official host, the expected act title and the requested reference. " +
      "Only status VERIFIED permits copying the returned marker onto the same line as the exact citation. " +
      "Case-law signatures are not verified by this tool.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["claim", "kind", "url", "expectedTitle"],
      properties: {
        claim: {
          type: "string",
          description:
            "Exact legal reference that will appear in the answer, e.g. art. 5 KC or Dz.U. 2024 poz. 1061."
        },
        kind: {
          type: "string",
          enum: ["statute", "journal"]
        },
        url: {
          type: "string",
          description:
            "Fresh credential-free HTTPS source URL on official ELI/ISAP/Sejm."
        },
        expectedTitle: {
          type: "string",
          description:
            "Official title of the act expected at the supplied source URL. Used to reject a wrong act that happens to contain the same article number."
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

function publicToolResult(record: {
  claim: string;
  status: "VERIFIED" | "UNVERIFIED";
  sourceUrl?: string;
  fetchedAt: string;
}): string {
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
  "- A citation is verified only when the tool returns status=VERIFIED.",
  "- For VERIFIED results, copy the returned marker verbatim onto the SAME LINE as the exact citation.",
  "- Never invent a verification marker, source URL, or tool result.",
  "- For UNVERIFIED/DENIED results, do not represent the citation as verified.",
  "- Case-law signatures are outside this G16 tool and remain unverified unless a separate runtime tool verifies them."
].join("\n");

export class LegalVerificationToolRuntime {
  private readonly broker: ToolBroker;

  constructor(
    private readonly ledger: VerificationLedger,
    verifier = new OfficialLegalSourceVerifier()
  ) {
    this.broker = new ToolBroker(
      new ToolPolicy({
        allowNetwork: true,
        allowedNetworkHosts: [...OFFICIAL_LEGAL_SOURCE_HOSTS]
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

        if (
          !claim ||
          !verificationKind ||
          !url ||
          !expectedTitle ||
          !toolCallId
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
        return publicToolResult(result.record);
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
    return this.broker.audit.map((event) => ({ ...event }));
  }

  async runTools(
    calls: NormalizedToolCall[]
  ): Promise<NormalizedToolResult[]> {
    const results: NormalizedToolResult[] = [];

    for (const call of calls) {
      const result = await this.broker.execute({
        name: call.name,
        input: {
          ...call.input,
          toolCallId: call.id
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
