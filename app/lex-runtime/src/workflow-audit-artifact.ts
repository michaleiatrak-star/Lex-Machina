import {
  SESSION_EXECUTION_INTERNAL,
  type SessionExecutionResponse
} from "./session-executor.js";

export type StatefulWorkflowAuditId =
  | "COURT_ANALYSIS_V1"
  | "CHRONOLOGY_V1"
  | "CONTRACT_ANALYSIS_V1";

export type WorkflowAuditCitationAnchor = {
  caseId?: string;
  documentId: string;
  chunkIndex: number;
  pageStart: number;
  pageEnd: number;
  highlightStart?: number;
  highlightEnd?: number;
};

export type WorkflowAuditArtifact = {
  schemaVersion: 1;
  kind:
    "LEX_MACHINA_WORKFLOW_AUDIT";
  caseId: string;
  workflowId:
    StatefulWorkflowAuditId;
  checkpoint: string;
  sessionId: string;
  createdAt: string;
  execution: {
    status:
      "DRAFT_PRESENTABLE";
    provider: string;
    model: string;
    primarySkill: string;
    finalization: "PASS";
  };
  workflow: {
    result: "PASS";
    requiredResources: string[];
    missingResources: [];
  };
  audit: {
    result: "PASS";
    eventCount: number;
    closed: true;
  };
  verification: {
    records: number;
    verified: number;
    supported: number;
    unverified: number;
  };
  citationFreshness?: {
    result: "PASS";
    checked: number;
  };
  citations:
    WorkflowAuditCitationAnchor[];
  events: Array<{
    sequence: number;
    timestamp: string;
    type: string;
    target: string;
    status:
      | "OK"
      | "DEGRADED"
      | "BLOCKED";
  }>;
};

const CASE_ID =
  /^case_[a-f0-9]{32}$/;
const SAFE_CHECKPOINT =
  /^[A-Za-z0-9._:-]{1,120}$/;
const SAFE_TARGET_MAX = 500;
const MAX_EVENTS = 2_000;

function validIso(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 64 &&
    !Number.isNaN(
      Date.parse(value)
    )
  );
}

function cleanTarget(
  value: string
): string {
  return value
    .normalize("NFKC")
    .replace(
      /[\x00-\x1f\x7f]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim()
    .slice(
      0,
      SAFE_TARGET_MAX
    );
}

function validWorkflowId(
  value: unknown
): value is
  StatefulWorkflowAuditId {
  return [
    "COURT_ANALYSIS_V1",
    "CHRONOLOGY_V1",
    "CONTRACT_ANALYSIS_V1"
  ].includes(
    String(value)
  );
}

export function buildWorkflowAuditArtifact(
  args: {
    caseId: string;
    workflowId:
      StatefulWorkflowAuditId;
    checkpoint: string;
    result:
      SessionExecutionResponse;
    createdAt?: string;
  }
): Buffer {
  if (
    !CASE_ID.test(args.caseId) ||
    !SAFE_CHECKPOINT.test(
      args.checkpoint
    )
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_ID_INVALID"
    );
  }

  const result =
    args.result;
  if (
    result.status !==
      "DRAFT_PRESENTABLE" ||
    result.finalization !==
      "PASS" ||
    result.audit.result !==
      "PASS" ||
    result.audit.closed !==
      true ||
    result.workflow?.id !==
      args.workflowId ||
    result.workflow.result !==
      "PASS" ||
    result.workflow
      .missingResources.length !== 0
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_RESULT_NOT_PASS"
    );
  }

  const internal =
    result[
      SESSION_EXECUTION_INTERNAL
    ];
  if (
    !internal ||
    !Array.isArray(
      internal.auditEvents
    ) ||
    internal.auditEvents.length < 1 ||
    internal.auditEvents.length >
      MAX_EVENTS
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_EVENTS_MISSING"
    );
  }

  if (
    internal.auditEvents.length !==
      result.audit.eventCount ||
    internal.auditEvents.at(-1)
      ?.type !==
      "session_closed" ||
    internal.auditEvents.some(
      (event) =>
        event.status ===
          "BLOCKED"
    )
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_EVENTS_INCONSISTENT"
    );
  }

  const events =
    internal.auditEvents.map(
      (event, index) => {
        if (
          event.sequence !==
            index + 1 ||
          !validIso(
            event.timestamp
          )
        ) {
          throw new Error(
            "WORKFLOW_AUDIT_EVENTS_INVALID"
          );
        }
        const target =
          cleanTarget(
            event.target
          );
        if (!target) {
          throw new Error(
            "WORKFLOW_AUDIT_EVENTS_INVALID"
          );
        }
        return {
          sequence:
            event.sequence,
          timestamp:
            event.timestamp,
          type:
            event.type,
          target,
          status:
            event.status
        };
      }
    );

  const createdAt =
    args.createdAt ??
    new Date().toISOString();
  if (!validIso(createdAt)) {
    throw new Error(
      "WORKFLOW_AUDIT_TIMESTAMP_INVALID"
    );
  }

  const payload:
    WorkflowAuditArtifact = {
      schemaVersion: 1,
      kind:
        "LEX_MACHINA_WORKFLOW_AUDIT",
      caseId:
        args.caseId,
      workflowId:
        args.workflowId,
      checkpoint:
        args.checkpoint,
      sessionId:
        result.sessionId,
      createdAt,
      execution: {
        status:
          "DRAFT_PRESENTABLE",
        provider:
          String(result.provider),
        model:
          result.model,
        primarySkill:
          result.primarySkill,
        finalization:
          "PASS"
      },
      workflow: {
        result: "PASS",
        requiredResources: [
          ...result.workflow
            .requiredResources
        ],
        missingResources: []
      },
      audit: {
        result: "PASS",
        eventCount:
          result.audit
            .eventCount,
        closed: true
      },
      verification: {
        ...result.verification
      },
      ...(result
        .documentCitationFreshness
        ? {
            citationFreshness: {
              ...result
                .documentCitationFreshness
            }
          }
        : {}),
      citations:
        (
          result
            .documentCitations ??
          []
        ).map(
          (citation) => ({
            ...(citation.caseId
              ? {
                  caseId:
                    citation.caseId
                }
              : {}),
            documentId:
              citation.documentId,
            chunkIndex:
              citation.chunkIndex,
            pageStart:
              citation.pageStart,
            pageEnd:
              citation.pageEnd,
            ...(citation
              .highlightStart !==
                undefined
              ? {
                  highlightStart:
                    citation
                      .highlightStart
                }
              : {}),
            ...(citation
              .highlightEnd !==
                undefined
              ? {
                  highlightEnd:
                    citation
                      .highlightEnd
                }
              : {})
          })
        ),
      events
    };

  return Buffer.from(
    JSON.stringify(
      payload,
      null,
      2
    ) + "\n",
    "utf8"
  );
}

export function parseWorkflowAuditArtifact(
  data: Uint8Array
): WorkflowAuditArtifact {
  if (
    data.byteLength < 2 ||
    data.byteLength >
      2 * 1024 * 1024
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_ARTIFACT_SIZE_INVALID"
    );
  }

  let value: unknown;
  try {
    value = JSON.parse(
      Buffer.from(data)
        .toString("utf8")
    );
  } catch {
    throw new Error(
      "WORKFLOW_AUDIT_ARTIFACT_INVALID"
    );
  }

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_ARTIFACT_INVALID"
    );
  }

  const payload =
    value as
      Partial<
        WorkflowAuditArtifact
      >;

  if (
    payload.schemaVersion !== 1 ||
    payload.kind !==
      "LEX_MACHINA_WORKFLOW_AUDIT" ||
    typeof payload.caseId !==
      "string" ||
    !CASE_ID.test(
      payload.caseId
    ) ||
    !validWorkflowId(
      payload.workflowId
    ) ||
    typeof payload.checkpoint !==
      "string" ||
    !SAFE_CHECKPOINT.test(
      payload.checkpoint
    ) ||
    typeof payload.sessionId !==
      "string" ||
    payload.sessionId.length <
      1 ||
    payload.sessionId.length >
      160 ||
    !validIso(
      payload.createdAt
    ) ||
    payload.execution
      ?.status !==
      "DRAFT_PRESENTABLE" ||
    payload.execution
      .finalization !==
      "PASS" ||
    payload.workflow
      ?.result !==
      "PASS" ||
    !Array.isArray(
      payload.workflow
        .requiredResources
    ) ||
    !Array.isArray(
      payload.workflow
        .missingResources
    ) ||
    payload.workflow
      .missingResources
      .length !== 0 ||
    payload.audit
      ?.result !== "PASS" ||
    payload.audit
      .closed !== true ||
    typeof payload.audit
      .eventCount !==
      "number" ||
    !Number.isSafeInteger(
      payload.audit
        .eventCount
    ) ||
    payload.audit
      .eventCount < 1 ||
    !Array.isArray(
      payload.events
    ) ||
    payload.events.length < 1 ||
    payload.events.length >
      MAX_EVENTS ||
    !Array.isArray(
      payload.citations
    )
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_ARTIFACT_INVALID"
    );
  }

  if (
    payload.events.length !==
      payload.audit.eventCount ||
    payload.events.at(-1)
      ?.type !==
      "session_closed" ||
    payload.events.some(
      (event) =>
        event.status ===
          "BLOCKED"
    )
  ) {
    throw new Error(
      "WORKFLOW_AUDIT_ARTIFACT_INVALID"
    );
  }

  for (
    let index = 0;
    index <
      payload.events.length;
    index += 1
  ) {
    const event =
      payload.events[index]!;
    if (
      event.sequence !==
        index + 1 ||
      !validIso(
        event.timestamp
      ) ||
      typeof event.type !==
        "string" ||
      event.type.length < 1 ||
      event.type.length > 80 ||
      typeof event.target !==
        "string" ||
      event.target.length < 1 ||
      event.target.length >
        SAFE_TARGET_MAX ||
      ![
        "OK",
        "DEGRADED",
        "BLOCKED"
      ].includes(
        event.status
      )
    ) {
      throw new Error(
        "WORKFLOW_AUDIT_ARTIFACT_INVALID"
      );
    }
  }

  return payload as
    WorkflowAuditArtifact;
}
