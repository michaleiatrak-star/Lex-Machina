import {
  ToolBroker,
  ToolPolicy,
  type ToolAuditEvent
} from "./tool-broker.js";
import {
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
      "Verify one legal reference against a fresh official Polish legal source. Use only official source URLs. The returned marker must be copied onto the same output line as the verified reference.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["claim", "kind", "url"],
      properties: {
        claim: {
          type: "string",
          description:
            "Exact legal reference that will appear in the answer, e.g. art. 5 KC, Dz.U. 2024 poz. 1061, or sygn. III CZP 1/26."
        },
        kind: {
          type: "string",
          enum: ["statute", "journal", "case", "deadline", "amount"]
        },
        url: {
          type: "string",
          description:
            "Fresh official HTTPS source URL from ELI/ISAP/Sejm or an official Polish court source."
        }
      }
    }
  }
};

function kind(value: unknown): VerificationKind | null {
  return [
    "statute",
    "journal",
    "case",
    "deadline",
    "amount"
  ].includes(String(value))
    ? value as VerificationKind
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
      ? `✅ [VER: ${record.sourceUrl ?? "official-source"}, ${record.fetchedAt}]`
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

export class LegalVerificationToolRuntime {
  private readonly broker: ToolBroker;

  constructor(
    private readonly ledger: VerificationLedger,
    verifier = new OfficialLegalSourceVerifier()
  ) {
    this.broker = new ToolBroker(
      new ToolPolicy({ allowNetwork: true })
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
        const toolCallId =
          typeof input.toolCallId === "string"
            ? input.toolCallId
            : "";

        if (
          !claim ||
          !verificationKind ||
          !url ||
          !toolCallId
        ) {
          throw new Error("INVALID_VERIFICATION_INPUT");
        }

        const result = await verifier.verify({
          claim,
          kind: verificationKind,
          url,
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
