import path from "node:path";
export class ToolPolicyError extends Error {
    tool;
    reason;
    constructor(message, tool, reason) {
        super(message);
        this.tool = tool;
        this.reason = reason;
        this.name = "ToolPolicyError";
    }
}
function isInsideAnyRoot(candidate, roots) {
    const absoluteCandidate = path.resolve(candidate);
    return roots.some((root) => {
        const absoluteRoot = path.resolve(root);
        const relative = path.relative(absoluteRoot, absoluteCandidate);
        return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
    });
}
function isBlockedHostname(hostname) {
    const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
        return true;
    }
    if (host === "::1" || host === "0:0:0:0:0:0:0:1")
        return true;
    const parts = host.split(".").map(Number);
    if (parts.length === 4 &&
        parts.every((part) => Number.isInteger(part) &&
            part >= 0 &&
            part <= 255)) {
        const a = parts[0];
        const b = parts[1];
        if (a === undefined || b === undefined)
            return true;
        if (a === 10 || a === 127 || a === 0)
            return true;
        if (a === 169 && b === 254)
            return true;
        if (a === 172 && b >= 16 && b <= 31)
            return true;
        if (a === 192 && b === 168)
            return true;
        if (a === 100 && b >= 64 && b <= 127)
            return true;
        if (a >= 224)
            return true;
    }
    const lower = host.toLowerCase();
    if (lower.startsWith("fc") ||
        lower.startsWith("fd") ||
        lower.startsWith("fe80:")) {
        return true;
    }
    return false;
}
export class ToolPolicy {
    readableRoots;
    writableRoots;
    allowNetwork;
    allowedNetworkHosts;
    allowWrite;
    allowCode;
    allowMcp;
    constructor(options = {}) {
        this.readableRoots = (options.readableRoots ?? []).map((root) => path.resolve(root));
        this.writableRoots = (options.writableRoots ?? []).map((root) => path.resolve(root));
        this.allowNetwork = options.allowNetwork ?? false;
        this.allowedNetworkHosts = new Set((options.allowedNetworkHosts ?? []).map((host) => host.toLowerCase()));
        this.allowWrite = options.allowWrite ?? false;
        this.allowCode = options.allowCode ?? false;
        this.allowMcp = options.allowMcp ?? false;
    }
    assertAllowed(definition, input) {
        switch (definition.capability) {
            case "read": {
                const requested = typeof input.path === "string" ? input.path : "";
                if (!requested) {
                    throw new ToolPolicyError("Read tool requires a path.", definition.name, "MISSING_PATH");
                }
                if (!isInsideAnyRoot(requested, this.readableRoots)) {
                    throw new ToolPolicyError("Read path is outside configured roots.", definition.name, "READ_PATH_OUTSIDE_ROOT");
                }
                return;
            }
            case "write": {
                if (!this.allowWrite) {
                    throw new ToolPolicyError("Write capability is disabled.", definition.name, "WRITE_DISABLED");
                }
                const requested = typeof input.path === "string" ? input.path : "";
                if (!requested || !isInsideAnyRoot(requested, this.writableRoots)) {
                    throw new ToolPolicyError("Write path is outside configured roots.", definition.name, "WRITE_PATH_OUTSIDE_ROOT");
                }
                return;
            }
            case "network": {
                if (!this.allowNetwork) {
                    throw new ToolPolicyError("Network capability is disabled.", definition.name, "NETWORK_DISABLED");
                }
                const raw = typeof input.url === "string" ? input.url : "";
                let url;
                try {
                    url = new URL(raw);
                }
                catch {
                    throw new ToolPolicyError("Invalid network URL.", definition.name, "INVALID_URL");
                }
                if (!["http:", "https:"].includes(url.protocol)) {
                    throw new ToolPolicyError("Only HTTP(S) network targets are permitted.", definition.name, "UNSAFE_URL_SCHEME");
                }
                if (url.username || url.password) {
                    throw new ToolPolicyError("Credentials embedded in URLs are not permitted.", definition.name, "URL_CREDENTIALS_DENIED");
                }
                if (isBlockedHostname(url.hostname)) {
                    throw new ToolPolicyError("Local/private network targets are blocked.", definition.name, "PRIVATE_NETWORK_DENIED");
                }
                if (this.allowedNetworkHosts.size > 0 &&
                    !this.allowedNetworkHosts.has(url.hostname.toLowerCase())) {
                    throw new ToolPolicyError("Network target is outside the configured host allowlist.", definition.name, "NETWORK_HOST_DENIED");
                }
                return;
            }
            case "code":
                if (!this.allowCode) {
                    throw new ToolPolicyError("Code execution is disabled.", definition.name, "CODE_DISABLED");
                }
                return;
            case "mcp":
                if (!this.allowMcp) {
                    throw new ToolPolicyError("MCP execution is disabled.", definition.name, "MCP_DISABLED");
                }
                return;
        }
    }
}
export class ToolBroker {
    policy;
    tools = new Map();
    audit = [];
    constructor(policy) {
        this.policy = policy;
    }
    register(definition) {
        if (this.tools.has(definition.name)) {
            throw new Error(`Tool already registered: ${definition.name}`);
        }
        this.tools.set(definition.name, definition);
    }
    async execute(request) {
        const definition = this.tools.get(request.name);
        if (!definition) {
            this.audit.push({
                sequence: this.audit.length + 1,
                tool: request.name,
                decision: "DENY",
                reason: "UNKNOWN_TOOL"
            });
            return { ok: false, error: "UNKNOWN_TOOL" };
        }
        try {
            this.policy.assertAllowed(definition, request.input);
        }
        catch (error) {
            const reason = error instanceof ToolPolicyError ? error.reason : "POLICY_DENIED";
            this.audit.push({
                sequence: this.audit.length + 1,
                tool: request.name,
                capability: definition.capability,
                decision: "DENY",
                reason
            });
            return { ok: false, error: reason };
        }
        this.audit.push({
            sequence: this.audit.length + 1,
            tool: request.name,
            capability: definition.capability,
            decision: "ALLOW"
        });
        try {
            return { ok: true, output: await definition.execute(request.input) };
        }
        catch (error) {
            return {
                ok: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
}
