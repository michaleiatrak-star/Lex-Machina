import fs from "node:fs";
import path from "node:path";
import { CRIMINAL_DOMAIN_PREFIX, CRIMINAL_QUALIFIER_INDEX } from "./execution-engine.js";
const ROUTER_SKILL = "prawny-router-v3";
// Loaded by the router itself; they are not a legal domain or workflow.
const INFRASTRUCTURE_SKILLS = new Set([
    ROUTER_SKILL,
    "shared",
    "prawo-polskie-v2"
]);
const LIST_SKILLS = "list_legal_skills";
const LIST_RESOURCES = "list_legal_resources";
const READ_RESOURCE = "read_legal_resource";
const MAX_READ_CHARS = 40_000;
const MAX_TEXT_FILE_BYTES = 16 * 1024 * 1024;
const RESOURCE_PAGE_SIZE = 200;
const SKILL_SCHEMA = {
    type: "function",
    function: {
        name: LIST_SKILLS,
        description: "List legal skills available in the local Lex Machina corpus. " +
            "Use this when a SKILL.md tells you to activate another skill and you need the exact canonical name.",
        parameters: {
            type: "object",
            additionalProperties: false,
            properties: {}
        }
    }
};
const RESOURCE_LIST_SCHEMA = {
    type: "function",
    function: {
        name: LIST_RESOURCES,
        description: "List text resources available under one local legal skill. " +
            "Use this when the skill references modules/, references/, shared/ or another resource but the exact filename is unknown.",
        parameters: {
            type: "object",
            additionalProperties: false,
            required: ["skill"],
            properties: {
                skill: {
                    type: "string",
                    description: "Exact legal skill name, e.g. dr-02-prawo-cywilne-rodzinne-gospodarcze or shared."
                },
                prefix: {
                    type: "string",
                    description: "Optional relative path prefix, e.g. modules/ or references/."
                },
                cursor: {
                    type: "integer",
                    minimum: 0,
                    description: "Optional pagination cursor returned by a prior call."
                }
            }
        }
    }
};
const RESOURCE_READ_SCHEMA = {
    type: "function",
    function: {
        name: READ_RESOURCE,
        description: "Read a local legal corpus resource. " +
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
                    description: "Skill providing the relative context for the resource."
                },
                path: {
                    type: "string",
                    description: "Semantic path, e.g. modules/mod-KC.md, references/CHECKLIST.md, shared/PRAWO-HARDGATE.md or another-skill/SKILL.md."
                },
                offset: {
                    type: "integer",
                    minimum: 0,
                    description: "Character offset for paginating a large text resource."
                },
                maxChars: {
                    type: "integer",
                    minimum: 1,
                    maximum: MAX_READ_CHARS,
                    description: "Maximum characters returned in this call."
                }
            }
        }
    }
};
function normalizePrefix(value) {
    if (value === undefined ||
        value === null ||
        value === "") {
        return "";
    }
    if (typeof value !== "string") {
        throw new Error("INVALID_RESOURCE_PREFIX");
    }
    const normalized = value
        .replaceAll("\\", "/")
        .replace(/^\.\//, "")
        .trim();
    if (normalized.startsWith("/") ||
        normalized
            .split("/")
            .some((segment) => segment === "..")) {
        throw new Error("INVALID_RESOURCE_PREFIX");
    }
    return normalized;
}
function textFile(filePath) {
    const stat = fs.statSync(filePath);
    if (!stat.isFile() ||
        stat.size >
            MAX_TEXT_FILE_BYTES) {
        throw new Error("LEGAL_RESOURCE_NOT_TEXT");
    }
    const data = fs.readFileSync(filePath);
    if (data.includes(0)) {
        throw new Error("LEGAL_RESOURCE_NOT_TEXT");
    }
    return data.toString("utf8");
}
function collectFiles(root, prefix) {
    const result = [];
    function walk(directory) {
        for (const entry of fs.readdirSync(directory, {
            withFileTypes: true
        })) {
            if (entry.name ===
                ".git" ||
                entry.name ===
                    "node_modules") {
                continue;
            }
            const target = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                walk(target);
            }
            else if (entry.isFile()) {
                const relative = path.relative(root, target)
                    .replaceAll(path.sep, "/");
                if (!prefix ||
                    relative.startsWith(prefix)) {
                    result.push(relative);
                }
            }
        }
    }
    walk(root);
    return result.sort((a, b) => a.localeCompare(b, "pl"));
}
export class LegalCorpusToolRuntime {
    registry;
    options;
    events = [];
    // Skills whose SKILL.md the model read, in order.
    readSkills = [];
    qualifierDelivered = false;
    constructor(registry, 
    // AUTO for account/API models: the model picks skills itself; the runtime
    // still enforces router-v3 first and the criminal qualifier.
    options = {}) {
        this.registry = registry;
        this.options = options;
    }
    modelSkillSelection() {
        const domainSkills = this.readSkills.filter((name) => name.startsWith("dr-"));
        const executionSkills = this.readSkills.filter((name) => !name.startsWith("dr-") &&
            !INFRASTRUCTURE_SKILLS.has(name));
        return {
            primarySkill: domainSkills[0] ??
                (this.readSkills.length > 0 ? ROUTER_SKILL : null),
            loadedSkills: [...this.readSkills],
            domainSkills,
            executionSkills
        };
    }
    schemas() {
        return [
            SKILL_SCHEMA,
            RESOURCE_LIST_SCHEMA,
            RESOURCE_READ_SCHEMA
        ];
    }
    handles(name) {
        return [
            LIST_SKILLS,
            LIST_RESOURCES,
            READ_RESOURCE
        ].includes(name);
    }
    systemPromptAppendix() {
        const available = [...this.registry.skills
                .keys()]
            .sort()
            .join(", ");
        return [
            "# LOCAL LEGAL CORPUS ACCESS",
            "The complete Lex Machina legal corpus is available locally through list_legal_skills, list_legal_resources and read_legal_resource.",
            "Mandatory deterministic workflow resources are preloaded and audited by the runtime before semantic execution; do not repeat those reads merely to satisfy a checklist.",
            "Use read_legal_resource only for additional semantic/domain material that the current reasoning step actually needs. Do not pretend a resource was read merely because its filename appeared in a skill.",
            "Use list_legal_resources when the exact module/reference filename is unknown.",
            "A read result is local procedural/domain corpus context, not proof that a statute or judgment is currently valid. Current legal citations must still pass the separate legal verification tools.",
            "Never request or infer arbitrary operating-system paths. Only semantic corpus paths are permitted.",
            "If a resource is truncated, continue with nextOffset until the portion required by the task has been read.",
            "Available top-level skills: " +
                available
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
    async runTools(calls) {
        return calls.map((call) => {
            try {
                const content = this.execute(call);
                return {
                    tool_use_id: call.id,
                    content
                };
            }
            catch (error) {
                this.events.push({
                    tool: call.name,
                    target: this.targetFor(call),
                    decision: "BLOCK",
                    detail: {
                        error: error instanceof Error
                            ? error.message
                            : String(error)
                    }
                });
                return {
                    tool_use_id: call.id,
                    content: JSON.stringify({
                        status: "BLOCKED",
                        error: error instanceof Error
                            ? error.message
                            : String(error)
                    })
                };
            }
        });
    }
    execute(call) {
        if (call.name ===
            LIST_SKILLS) {
            const skills = [...this.registry.skills
                    .values()]
                .sort((a, b) => a.name.localeCompare(b.name, "pl"))
                .map((skill) => ({
                name: skill.name,
                version: typeof skill
                    .frontmatter
                    .version ===
                    "string"
                    ? skill
                        .frontmatter
                        .version
                    : null,
                type: typeof skill
                    .frontmatter
                    .type ===
                    "string"
                    ? skill
                        .frontmatter
                        .type
                    : null,
                status: typeof skill
                    .frontmatter
                    .status ===
                    "string"
                    ? skill
                        .frontmatter
                        .status
                    : null
            }));
            this.events.push({
                tool: call.name,
                target: "legal-corpus",
                decision: "ALLOW",
                detail: {
                    count: skills.length
                }
            });
            return JSON.stringify({
                status: "OK",
                skills
            });
        }
        if (call.name ===
            LIST_RESOURCES) {
            const skillName = typeof call.input
                .skill === "string"
                ? call.input.skill
                : "";
            const skill = this.registry.get(skillName);
            if (!skill) {
                throw new Error("LEGAL_SKILL_NOT_FOUND");
            }
            const prefix = normalizePrefix(call.input.prefix);
            const cursor = Number.isInteger(call.input.cursor)
                ? Number(call.input.cursor)
                : 0;
            if (cursor < 0) {
                throw new Error("INVALID_RESOURCE_CURSOR");
            }
            const resources = collectFiles(skill.directory, prefix);
            const page = resources.slice(cursor, cursor +
                RESOURCE_PAGE_SIZE);
            const nextCursor = cursor +
                page.length <
                resources.length
                ? cursor +
                    page.length
                : null;
            this.events.push({
                tool: call.name,
                target: skillName,
                decision: "ALLOW",
                detail: {
                    prefix,
                    returned: page.length,
                    total: resources.length
                }
            });
            return JSON.stringify({
                status: "OK",
                skill: skillName,
                prefix,
                resources: page,
                nextCursor
            });
        }
        if (call.name ===
            READ_RESOURCE) {
            const skillName = typeof call.input
                .skill === "string"
                ? call.input.skill
                : "";
            const semanticPath = typeof call.input
                .path === "string"
                ? call.input.path
                    .trim()
                : "";
            if (!skillName ||
                !semanticPath) {
                throw new Error("LEGAL_RESOURCE_REQUEST_INVALID");
            }
            if (!this.registry.get(skillName)) {
                throw new Error("LEGAL_SKILL_NOT_FOUND");
            }
            const resolved = this.registry
                .resolveResource(skillName, semanticPath);
            if (!resolved) {
                throw new Error("LEGAL_RESOURCE_NOT_FOUND");
            }
            if (!fs.statSync(resolved).isFile()) {
                throw new Error("LEGAL_RESOURCE_NOT_FILE");
            }
            const resolvedPath = path.relative(this.registry.root, resolved)
                .replaceAll(path.sep, "/");
            const targetSkill = this.skillForPath(resolvedPath);
            if (this.options.modelSelectsSkills &&
                targetSkill !== ROUTER_SKILL &&
                !this.readSkills.includes(ROUTER_SKILL)) {
                throw new Error("ROUTER_V3_REQUIRED_FIRST: read skill=prawny-router-v3 path=SKILL.md before any other legal resource");
            }
            const text = textFile(resolved);
            const offset = Number.isInteger(call.input.offset)
                ? Number(call.input.offset)
                : 0;
            const maxChars = Number.isInteger(call.input
                .maxChars)
                ? Math.min(MAX_READ_CHARS, Math.max(1, Number(call.input
                    .maxChars)))
                : MAX_READ_CHARS;
            if (offset < 0 ||
                offset >
                    text.length) {
                throw new Error("INVALID_RESOURCE_OFFSET");
            }
            const content = text.slice(offset, offset +
                maxChars);
            const nextOffset = offset +
                content.length <
                text.length
                ? offset +
                    content.length
                : null;
            const canonicalPath = path.relative(this.registry.root, resolved)
                .replaceAll(path.sep, "/");
            const isSkillEntry = targetSkill !== null &&
                resolvedPath.split("/").length === 2 &&
                resolvedPath.endsWith("/SKILL.md");
            if (isSkillEntry &&
                !this.readSkills.includes(targetSkill)) {
                this.readSkills.push(targetSkill);
            }
            // A criminal-law matter always goes through the qualifier: it is
            // delivered with the first DR-03 skill entry, not left to the model.
            let requiredModule;
            if (this.options.modelSelectsSkills &&
                isSkillEntry &&
                targetSkill.startsWith(CRIMINAL_DOMAIN_PREFIX) &&
                !this.qualifierDelivered) {
                const qualifier = this.registry.resolveResource(targetSkill, CRIMINAL_QUALIFIER_INDEX);
                if (!qualifier) {
                    throw new Error("CRIMINAL_QUALIFIER_MISSING");
                }
                requiredModule = {
                    path: `${targetSkill}/${CRIMINAL_QUALIFIER_INDEX}`,
                    content: textFile(qualifier).slice(0, MAX_READ_CHARS)
                };
                this.qualifierDelivered = true;
                this.events.push({
                    tool: call.name,
                    target: requiredModule.path,
                    decision: "ALLOW",
                    detail: {
                        deliveredWith: resolvedPath
                    }
                });
            }
            this.events.push({
                tool: call.name,
                target: canonicalPath,
                decision: "ALLOW",
                detail: {
                    offset,
                    returnedChars: content.length,
                    totalChars: text.length,
                    truncated: nextOffset !== null
                }
            });
            return JSON.stringify({
                status: "OK",
                path: canonicalPath,
                offset,
                returnedChars: content.length,
                totalChars: text.length,
                nextOffset,
                content,
                ...(requiredModule
                    ? {
                        requiredModule: {
                            ...requiredModule,
                            instruction: "Mandatory criminal-law qualifier. Apply it before any criminal-law qualification."
                        }
                    }
                    : {})
            });
        }
        throw new Error("UNKNOWN_LEGAL_CORPUS_TOOL");
    }
    skillForPath(relativePath) {
        const directory = relativePath.split("/", 1)[0];
        for (const skill of this.registry.skills.values()) {
            if (path.basename(skill.directory) === directory) {
                return skill.name;
            }
        }
        return null;
    }
    targetFor(call) {
        const skill = typeof call.input
            .skill === "string"
            ? call.input.skill
            : "legal-corpus";
        const resource = typeof call.input
            .path === "string"
            ? call.input.path
            : "";
        return resource
            ? `${skill}:${resource}`
            : skill;
    }
}
export const LEGAL_CORPUS_TOOL_NAMES = new Set([
    LIST_SKILLS,
    LIST_RESOURCES,
    READ_RESOURCE
]);
