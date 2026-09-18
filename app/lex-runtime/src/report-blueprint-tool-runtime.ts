import type {
  NormalizedToolCall,
  NormalizedToolResult,
  NormalizedToolSchema
} from "./providers/types.js";
import {
  validateClientReportBlueprint,
  validateSituationReportBlueprint,
  type ClientReportBlueprintPolicy,
  type SituationReportBlueprintPolicy
} from "./report-blueprint-policy.js";

export type ReportBlueprintKind =
  | "CLIENT_REPORT_V1"
  | "SITUATION_REPORT_V1";

export type ReportBlueprintAuditEvent = {
  tool: "submit_report_blueprint";
  target: ReportBlueprintKind | "INVALID";
  decision: "ALLOW" | "BLOCK";
  detail?: Record<string, unknown>;
};

export type AcceptedReportBlueprint = {
  kind: ReportBlueprintKind;
  blueprint: Record<string, unknown>;
  policy:
    | ClientReportBlueprintPolicy
    | SituationReportBlueprintPolicy;
};

const SUBMIT_REPORT_BLUEPRINT =
  "submit_report_blueprint";

const REPORT_BLUEPRINT_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name:
        SUBMIT_REPORT_BLUEPRINT,
      description:
        "Submit the structured report blueprint to the deterministic runtime before presenting a client or situation report. " +
        "Use CLIENT_REPORT_V1 only for raport-klienta-v1 and SITUATION_REPORT_V1 only for raport-sytuacyjny-v2. " +
        "The runtime validates schema/profile/mode consistency and report completeness; invalid blueprints are blocked.",
      parameters: {
        type: "object",
        additionalProperties:
          false,
        required: [
          "reportType",
          "blueprint"
        ],
        properties: {
          reportType: {
            type: "string",
            enum: [
              "CLIENT_REPORT_V1",
              "SITUATION_REPORT_V1"
            ]
          },
          blueprint: {
            type: "object",
            additionalProperties:
              true
          }
        }
      }
    }
  };

function deepCloneRecord(
  value: Record<string, unknown>
): Record<string, unknown> {
  return JSON.parse(
    JSON.stringify(value)
  ) as Record<string, unknown>;
}

export class ReportBlueprintToolRuntime {
  private readonly events:
    ReportBlueprintAuditEvent[] = [];

  private readonly accepted =
    new Map<
      ReportBlueprintKind,
      AcceptedReportBlueprint
    >();

  schemas():
    NormalizedToolSchema[] {
    return [
      REPORT_BLUEPRINT_SCHEMA
    ];
  }

  handles(
    name: string
  ): boolean {
    return (
      name ===
      SUBMIT_REPORT_BLUEPRINT
    );
  }

  systemPromptAppendix():
    string {
    return [
      "# STRUCTURED REPORT BLUEPRINT GATE",
      "If the active deterministic workflow is CLIENT_REPORT_V1 or SITUATION_REPORT_V1, call submit_report_blueprint before the final response.",
      "The blueprint must contain only facts supported by the current case material. Unknown values remain null; never fill them by guessing.",
      "For CLIENT_REPORT_V1 follow raport-klienta-v1/references/BLUEPRINT-SCHEMA.md exactly, including IND/BIZ and special-mode constraints.",
      "For SITUATION_REPORT_V1 follow the BLUEPRINT JSON and completeness rules in raport-sytuacyjny-v2/SKILL.md.",
      "A successful tool result means only that the data contract passed. It does not replace legal-source verification, privacy gates, citation checks or finalization.",
      "Do not call this tool for unrelated workflows."
    ].join("\n");
  }

  auditEvents():
    ReportBlueprintAuditEvent[] {
    return this.events.map(
      (event) => ({
        ...event,
        ...(event.detail
          ? {
              detail: {
                ...event.detail
              }
            }
          : {})
      })
    );
  }

  acceptedFor(
    kind: ReportBlueprintKind
  ): AcceptedReportBlueprint | null {
    const value =
      this.accepted.get(kind);
    return value
      ? {
          kind: value.kind,
          blueprint:
            deepCloneRecord(
              value.blueprint
            ),
          policy:
            JSON.parse(
              JSON.stringify(
                value.policy
              )
            )
        }
      : null;
  }

  async runTools(
    calls: NormalizedToolCall[]
  ): Promise<
    NormalizedToolResult[]
  > {
    return calls.map(
      (call) => {
        try {
          return {
            tool_use_id:
              call.id,
            content:
              this.execute(call)
          };
        } catch (error) {
          const reportType =
            call.input
              .reportType;
          const target:
            ReportBlueprintAuditEvent["target"] =
              reportType ===
                "CLIENT_REPORT_V1" ||
              reportType ===
                "SITUATION_REPORT_V1"
                ? reportType
                : "INVALID";
          const message =
            error instanceof Error
              ? error.message
              : String(error);
          this.events.push({
            tool:
              SUBMIT_REPORT_BLUEPRINT,
            target,
            decision:
              "BLOCK",
            detail: {
              error: message
            }
          });
          return {
            tool_use_id:
              call.id,
            content:
              JSON.stringify({
                status:
                  "BLOCKED",
                error:
                  message
              })
          };
        }
      }
    );
  }

  private execute(
    call: NormalizedToolCall
  ): string {
    if (
      call.name !==
        SUBMIT_REPORT_BLUEPRINT
    ) {
      throw new Error(
        "UNKNOWN_REPORT_BLUEPRINT_TOOL"
      );
    }

    const reportType =
      call.input
        .reportType;
    const blueprint =
      call.input
        .blueprint;

    if (
      reportType !==
        "CLIENT_REPORT_V1" &&
      reportType !==
        "SITUATION_REPORT_V1"
    ) {
      throw new Error(
        "REPORT_BLUEPRINT_TYPE_INVALID"
      );
    }
    if (
      !blueprint ||
      typeof blueprint !==
        "object" ||
      Array.isArray(
        blueprint
      )
    ) {
      throw new Error(
        "REPORT_BLUEPRINT_INVALID"
      );
    }

    const record =
      deepCloneRecord(
        blueprint as
          Record<string, unknown>
      );

    const policy =
      reportType ===
        "CLIENT_REPORT_V1"
        ? validateClientReportBlueprint(
            record
          )
        : validateSituationReportBlueprint(
            record
          );

    if (
      policy.result ===
        "BLOCKED"
    ) {
      const detail =
        reportType ===
          "CLIENT_REPORT_V1"
          ? policy.errors
          : policy
              .hardGateErrors;
      throw new Error(
        [
          "REPORT_BLUEPRINT_POLICY_BLOCKED",
          ...detail
        ].join(":")
      );
    }

    this.accepted.set(
      reportType,
      {
        kind:
          reportType,
        blueprint:
          record,
        policy
      }
    );
    this.events.push({
      tool:
        SUBMIT_REPORT_BLUEPRINT,
      target:
        reportType,
      decision:
        "ALLOW",
      detail:
        reportType ===
          "CLIENT_REPORT_V1"
          ? {
              profile:
                policy.profile ??
                null,
              mode:
                policy.mode ??
                null,
              warnings:
                policy
                  .warnings
            }
          : {
              completeness:
                policy
                  .completeness,
              missingRequired:
                policy
                  .missingRequired,
              warnings:
                policy
                  .warnings
            }
    });

    return JSON.stringify({
      status: "OK",
      reportType,
      policy
    });
  }
}

export const REPORT_BLUEPRINT_TOOL_NAME =
  SUBMIT_REPORT_BLUEPRINT;
