import { validateClientReportBlueprint, validateSituationReportBlueprint } from "./report-blueprint-policy.js";
const SUBMIT_REPORT_BLUEPRINT = "submit_report_blueprint";
const REPORT_BLUEPRINT_SCHEMA = {
    type: "function",
    function: {
        name: SUBMIT_REPORT_BLUEPRINT,
        description: "Submit the structured report blueprint to the deterministic runtime before presenting a client or situation report. " +
            "Use CLIENT_REPORT_V1 only for raport-klienta-v1 and SITUATION_REPORT_V1 only for raport-sytuacyjny-v2. " +
            "The runtime validates schema/profile/mode consistency and report completeness; invalid blueprints are blocked.",
        parameters: {
            type: "object",
            additionalProperties: false,
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
                    additionalProperties: true
                }
            }
        }
    }
};
function deepCloneRecord(value) {
    return JSON.parse(JSON.stringify(value));
}
export class ReportBlueprintToolRuntime {
    events = [];
    accepted = new Map();
    schemas() {
        return [
            REPORT_BLUEPRINT_SCHEMA
        ];
    }
    handles(name) {
        return (name ===
            SUBMIT_REPORT_BLUEPRINT);
    }
    systemPromptAppendix() {
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
    auditEvents() {
        return this.events.map((event) => ({
            ...event,
            ...(event.detail
                ? {
                    detail: {
                        ...event.detail
                    }
                }
                : {})
        }));
    }
    acceptedFor(kind) {
        const value = this.accepted.get(kind);
        return value
            ? {
                kind: value.kind,
                blueprint: deepCloneRecord(value.blueprint),
                policy: JSON.parse(JSON.stringify(value.policy))
            }
            : null;
    }
    async runTools(calls) {
        return calls.map((call) => {
            try {
                return {
                    tool_use_id: call.id,
                    content: this.execute(call)
                };
            }
            catch (error) {
                const reportType = call.input
                    .reportType;
                const target = reportType ===
                    "CLIENT_REPORT_V1" ||
                    reportType ===
                        "SITUATION_REPORT_V1"
                    ? reportType
                    : "INVALID";
                const message = error instanceof Error
                    ? error.message
                    : String(error);
                this.events.push({
                    tool: SUBMIT_REPORT_BLUEPRINT,
                    target,
                    decision: "BLOCK",
                    detail: {
                        error: message
                    }
                });
                return {
                    tool_use_id: call.id,
                    content: JSON.stringify({
                        status: "BLOCKED",
                        error: message
                    })
                };
            }
        });
    }
    execute(call) {
        if (call.name !==
            SUBMIT_REPORT_BLUEPRINT) {
            throw new Error("UNKNOWN_REPORT_BLUEPRINT_TOOL");
        }
        const reportType = call.input
            .reportType;
        const blueprint = call.input
            .blueprint;
        if (reportType !==
            "CLIENT_REPORT_V1" &&
            reportType !==
                "SITUATION_REPORT_V1") {
            throw new Error("REPORT_BLUEPRINT_TYPE_INVALID");
        }
        if (!blueprint ||
            typeof blueprint !==
                "object" ||
            Array.isArray(blueprint)) {
            throw new Error("REPORT_BLUEPRINT_INVALID");
        }
        const record = deepCloneRecord(blueprint);
        if (reportType ===
            "CLIENT_REPORT_V1") {
            const policy = validateClientReportBlueprint(record);
            if (policy.result ===
                "BLOCKED") {
                throw new Error([
                    "REPORT_BLUEPRINT_POLICY_BLOCKED",
                    ...policy.errors
                ].join(":"));
            }
            this.accepted.set(reportType, {
                kind: reportType,
                blueprint: record,
                policy
            });
            this.events.push({
                tool: SUBMIT_REPORT_BLUEPRINT,
                target: reportType,
                decision: "ALLOW",
                detail: {
                    profile: policy.profile ??
                        null,
                    mode: policy.mode ??
                        null,
                    warnings: policy.warnings
                }
            });
            return JSON.stringify({
                status: "OK",
                reportType,
                policy
            });
        }
        const policy = validateSituationReportBlueprint(record);
        if (policy.result ===
            "BLOCKED") {
            throw new Error([
                "REPORT_BLUEPRINT_POLICY_BLOCKED",
                ...policy
                    .hardGateErrors
            ].join(":"));
        }
        this.accepted.set(reportType, {
            kind: reportType,
            blueprint: record,
            policy
        });
        this.events.push({
            tool: SUBMIT_REPORT_BLUEPRINT,
            target: reportType,
            decision: "ALLOW",
            detail: {
                completeness: policy.completeness,
                missingRequired: policy.missingRequired,
                warnings: policy.warnings
            }
        });
        return JSON.stringify({
            status: "OK",
            reportType,
            policy
        });
    }
}
export const REPORT_BLUEPRINT_TOOL_NAME = SUBMIT_REPORT_BLUEPRINT;
