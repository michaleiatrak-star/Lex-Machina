import fs from "node:fs";
import path from "node:path";
import type {
  NormalizedToolCall,
  NormalizedToolResult,
  NormalizedToolSchema
} from "./providers/types.js";
import {
  LexSkillRegistry
} from "./registry.js";

const LIST_SKILLS =
  "list_legal_skills";
const LIST_RESOURCES =
  "list_legal_resources";
const READ_RESOURCE =
  "read_legal_resource";

const MAX_READ_CHARS = 40_000;
const MAX_TEXT_FILE_BYTES =
  16 * 1024 * 1024;
const RESOURCE_PAGE_SIZE = 200;

export type LegalCorpusAuditEvent = {
  tool: string;
  target: string;
  decision:
    "ALLOW" | "BLOCK";
  detail?:
    Record<string, unknown>;
};

const SKILL_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: LIST_SKILLS,
      description:
        "List legal skills available in the local Lex Machina corpus. " +
        "Use this when a SKILL.md tells you to activate another skill and you need the exact canonical name.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {}
      }
    }
  };

const RESOURCE_LIST_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: LIST_RESOURCES,
      description:
        "List text resources available under one local legal skill. " +
        "Use this when the skill references modules/, references/, shared/ or another resource but the exact filename is unknown.",
      parameters: {
        type: "object",
        additionalProperties: false,
        required: ["skill"],
        properties: {
          skill: {
            type: "string",
            description:
              "Exact legal skill name, e.g. dr-02-prawo-cywilne-rodzinne-gospodarcze or shared."
          },
          prefix: {
            type: "string",
            description:
              "Optional relative path prefix, e.g. modules/ or references/."
          },
          cursor: {
            type: "integer",
            minimum: 0,
            description:
              "Optional pagination cursor returned by a prior call."
          }
        }
      }
    }
  };

const RESOURCE_READ_SCHEMA:
  NormalizedToolSchema = {
    type: "function",
    function: {
      name: READ_RESOURCE,
      description:
        "Read a local legal corpus resource. " +
        "Use this whenever a loaded SKILL.md says view <path>. " +
        "The path is resolved only inside the Lex legal corpus; arbitrary filesystem paths are forbidden. " +
        "Large resources are paginated by character offset.",
      parameters: {
        type: "object",
        additionalProperties: false,
        required: [
          "skill",
          "path"
        ],
        properties: {
          skill: {
            type: "string",
            description:
              "Skill providing the relative context for the resource."
          },
          path: {
            type: "string",
            description:
              "Semantic path, e.g. modules/mod-KC.md, references/CHECKLIST.md, shared/PRAWO-HARDGATE.md or another-skill/SKILL.md."
          },
          offset: {
            type: "integer",
            minimum: 0,
            description:
              "Character offset for paginating a large text resource."
          },
          maxChars: {
            type: "integer",
            minimum: 1,
            maximum:
              MAX_READ_CHARS,
            description:
              "Maximum characters returned in this call."
          }
        }
      }
    }
  };

function normalizePrefix(
  value: unknown
): string {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }
  if (
    typeof value !== "string"
  ) {
    throw new Error(
      "INVALID_RESOURCE_PREFIX"
    );
  }
  const normalized =
    value
      .replaceAll("\\", "/")
      .replace(/^\.\//, "")
      .trim();
  if (
    normalized.startsWith("/") ||
    normalized
      .split("/")
      .some(
        (segment) =>
          segment === ".."
      )
  ) {
    throw new Error(
      "INVALID_RESOURCE_PREFIX"
    );
  }
  return normalized;
}

function textFile(
  filePath: string
): string {
  const stat =
    fs.statSync(filePath);
  if (
    !stat.isFile() ||
    stat.size >
      MAX_TEXT_FILE_BYTES
  ) {
    throw new Error(
      "LEGAL_RESOURCE_NOT_TEXT"
    );
  }
  const data =
    fs.readFileSync(filePath);
  if (
    data.includes(0)
  ) {
    throw new Error(
      "LEGAL_RESOURCE_NOT_TEXT"
    );
  }
  return data.toString(
    "utf8"
  );
}

function collectFiles(
  root: string,
  prefix: string
): string[] {
  const result:
    string[] = [];

  function walk(
    directory: string
  ): void {
    for (
      const entry
      of fs.readdirSync(
        directory,
        {
          withFileTypes: true
        }
      )
    ) {
      if (
        entry.name ===
          ".git" ||
        entry.name ===
          "node_modules"
      ) {
        continue;
      }
      const target =
        path.join(
          directory,
          entry.name
        );
      if (
        entry.isDirectory()
      ) {
        walk(target);
      } else if (
        entry.isFile()
      ) {
        const relative =
          path.relative(
            root,
            target
          )
          .replaceAll(
            path.sep,
            "/"
          );
        if (
          !prefix ||
          relative.startsWith(
            prefix
          )
        ) {
          result.push(
            relative
          );
        }
      }
    }
  }

  walk(root);
  return result.sort(
    (a, b) =>
      a.localeCompare(
        b,
        "pl"
      )
  );
}

export class LegalCorpusToolRuntime {
  private readonly events:
    LegalCorpusAuditEvent[] = [];

  constructor(
    private readonly registry:
      LexSkillRegistry
  ) {}

  schemas():
    NormalizedToolSchema[] {
    return [
      SKILL_SCHEMA,
      RESOURCE_LIST_SCHEMA,
      RESOURCE_READ_SCHEMA
    ];
  }

  handles(
    name: string
  ): boolean {
    return [
      LIST_SKILLS,
      LIST_RESOURCES,
      READ_RESOURCE
    ].includes(name);
  }

  systemPromptAppendix():
    string {
    const available =
      [...this.registry.skills
        .keys()]
        .sort()
        .join(", ");

    return [
      "# LOCAL LEGAL CORPUS ACCESS",
      "The complete Lex Machina legal corpus is available locally through list_legal_skills, list_legal_resources and read_legal_resource.",
      "When any loaded SKILL.md says 'view <path>', perform a fresh read_legal_resource call before relying on that resource. Do not pretend a resource was read merely because its filename appeared in a skill.",
      "Use list_legal_resources when the exact module/reference filename is unknown.",
      "A read result is local procedural/domain corpus context, not proof that a statute or judgment is currently valid. Current legal citations must still pass the separate legal verification tools.",
      "Never request or infer arbitrary operating-system paths. Only semantic corpus paths are permitted.",
      "If a resource is truncated, continue with nextOffset until the portion required by the task has been read.",
      "Available top-level skills: " +
        available
    ].join("\n");
  }

  auditEvents():
    LegalCorpusAuditEvent[] {
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

  async runTools(
    calls:
      NormalizedToolCall[]
  ): Promise<
    NormalizedToolResult[]
  > {
    return calls.map(
      (call) => {
        try {
          const content =
            this.execute(
              call
            );
          return {
            tool_use_id:
              call.id,
            content
          };
        } catch (error) {
          this.events.push({
            tool: call.name,
            target:
              this.targetFor(
                call
              ),
            decision: "BLOCK",
            detail: {
              error:
                error instanceof Error
                  ? error.message
                  : String(
                      error
                    )
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
                  error instanceof Error
                    ? error.message
                    : String(
                        error
                      )
              })
          };
        }
      }
    );
  }

  private execute(
    call:
      NormalizedToolCall
  ): string {
    if (
      call.name ===
        LIST_SKILLS
    ) {
      const skills =
        [...this.registry.skills
          .values()]
          .sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
                "pl"
              )
          )
          .map(
            (skill) => ({
              name:
                skill.name,
              version:
                typeof skill
                  .frontmatter
                  .version ===
                  "string"
                  ? skill
                      .frontmatter
                      .version
                  : null,
              type:
                typeof skill
                  .frontmatter
                  .type ===
                  "string"
                  ? skill
                      .frontmatter
                      .type
                  : null,
              status:
                typeof skill
                  .frontmatter
                  .status ===
                  "string"
                  ? skill
                      .frontmatter
                      .status
                  : null
            })
          );
      this.events.push({
        tool: call.name,
        target:
          "legal-corpus",
        decision:
          "ALLOW",
        detail: {
          count:
            skills.length
        }
      });
      return JSON.stringify({
        status: "OK",
        skills
      });
    }

    if (
      call.name ===
        LIST_RESOURCES
    ) {
      const skillName =
        typeof call.input
          .skill === "string"
          ? call.input.skill
          : "";
      const skill =
        this.registry.get(
          skillName
        );
      if (!skill) {
        throw new Error(
          "LEGAL_SKILL_NOT_FOUND"
        );
      }
      const prefix =
        normalizePrefix(
          call.input.prefix
        );
      const cursor =
        Number.isInteger(
          call.input.cursor
        )
          ? Number(
              call.input.cursor
            )
          : 0;
      if (cursor < 0) {
        throw new Error(
          "INVALID_RESOURCE_CURSOR"
        );
      }
      const resources =
        collectFiles(
          skill.directory,
          prefix
        );
      const page =
        resources.slice(
          cursor,
          cursor +
            RESOURCE_PAGE_SIZE
        );
      const nextCursor =
        cursor +
          page.length <
        resources.length
          ? cursor +
            page.length
          : null;

      this.events.push({
        tool: call.name,
        target:
          skillName,
        decision:
          "ALLOW",
        detail: {
          prefix,
          returned:
            page.length,
          total:
            resources.length
        }
      });

      return JSON.stringify({
        status: "OK",
        skill:
          skillName,
        prefix,
        resources: page,
        nextCursor
      });
    }

    if (
      call.name ===
        READ_RESOURCE
    ) {
      const skillName =
        typeof call.input
          .skill === "string"
          ? call.input.skill
          : "";
      const semanticPath =
        typeof call.input
          .path === "string"
          ? call.input.path
              .trim()
          : "";
      if (
        !skillName ||
        !semanticPath
      ) {
        throw new Error(
          "LEGAL_RESOURCE_REQUEST_INVALID"
        );
      }
      if (
        !this.registry.get(
          skillName
        )
      ) {
        throw new Error(
          "LEGAL_SKILL_NOT_FOUND"
        );
      }

      const resolved =
        this.registry
          .resolveResource(
            skillName,
            semanticPath
          );
      if (!resolved) {
        throw new Error(
          "LEGAL_RESOURCE_NOT_FOUND"
        );
      }
      if (
        !fs.statSync(
          resolved
        ).isFile()
      ) {
        throw new Error(
          "LEGAL_RESOURCE_NOT_FILE"
        );
      }

      const text =
        textFile(
          resolved
        );
      const offset =
        Number.isInteger(
          call.input.offset
        )
          ? Number(
              call.input.offset
            )
          : 0;
      const maxChars =
        Number.isInteger(
          call.input
            .maxChars
        )
          ? Math.min(
              MAX_READ_CHARS,
              Math.max(
                1,
                Number(
                  call.input
                    .maxChars
                )
              )
            )
          : MAX_READ_CHARS;
      if (
        offset < 0 ||
        offset >
          text.length
      ) {
        throw new Error(
          "INVALID_RESOURCE_OFFSET"
        );
      }

      const content =
        text.slice(
          offset,
          offset +
            maxChars
        );
      const nextOffset =
        offset +
          content.length <
        text.length
          ? offset +
            content.length
          : null;
      const canonicalPath =
        path.relative(
          this.registry.root,
          resolved
        )
        .replaceAll(
          path.sep,
          "/"
        );

      this.events.push({
        tool: call.name,
        target:
          canonicalPath,
        decision:
          "ALLOW",
        detail: {
          offset,
          returnedChars:
            content.length,
          totalChars:
            text.length,
          truncated:
            nextOffset !== null
        }
      });

      return JSON.stringify({
        status: "OK",
        path:
          canonicalPath,
        offset,
        returnedChars:
          content.length,
        totalChars:
          text.length,
        nextOffset,
        content
      });
    }

    throw new Error(
      "UNKNOWN_LEGAL_CORPUS_TOOL"
    );
  }

  private targetFor(
    call:
      NormalizedToolCall
  ): string {
    const skill =
      typeof call.input
        .skill === "string"
        ? call.input.skill
        : "legal-corpus";
    const resource =
      typeof call.input
        .path === "string"
        ? call.input.path
        : "";
    return resource
      ? `${skill}:${resource}`
      : skill;
  }
}

export const LEGAL_CORPUS_TOOL_NAMES =
  new Set([
    LIST_SKILLS,
    LIST_RESOURCES,
    READ_RESOURCE
  ]);
