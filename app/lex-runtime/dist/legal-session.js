import fs from "node:fs";
export class LegalSessionBootstrapError extends Error {
    target;
    events;
    constructor(message, target, events) {
        super(message);
        this.target = target;
        this.events = events;
        this.name = "LegalSessionBootstrapError";
    }
}
export const CORE_LEGAL_RESOURCES = [
    "shared/PRAWO-HARDGATE.md",
    "references/KROK0A-anonimizer.md",
    "references/KROK1-detekcja.md"
];
export class LegalSession {
    registry;
    routerSkill;
    state = "SESSION_CREATED";
    events = [];
    loadedResources = new Map();
    runtimeRequiredResources = new Map();
    constructor(registry, routerSkill = "prawny-router-v3") {
        this.registry = registry;
        this.routerSkill = routerSkill;
    }
    emit(type, target, status) {
        this.events.push({
            sequence: this.events.length + 1,
            type,
            target,
            status
        });
    }
    initializeLegalQuery() {
        this.emit("session", "legal-query", "OK");
        const router = this.registry.get(this.routerSkill);
        if (!router) {
            this.state = "BLOCKED";
            this.emit("skill_read", this.routerSkill, "BLOCKED");
            throw new LegalSessionBootstrapError("Mandatory legal router is unavailable.", this.routerSkill, [...this.events]);
        }
        // The router is the first skill read for every legal execution.
        this.emit("skill_read", this.routerSkill, "OK");
        this.state = "ROUTER_LOADED";
        for (const resource of CORE_LEGAL_RESOURCES) {
            let resolved = null;
            try {
                resolved = this.registry.resolveResource(this.routerSkill, resource);
            }
            catch {
                resolved = null;
            }
            if (!resolved) {
                this.state = "BLOCKED";
                this.emit("resource_read", resource, "BLOCKED");
                throw new LegalSessionBootstrapError("Mandatory core legal resource is unavailable; fail-closed.", resource, [...this.events]);
            }
            try {
                const content = fs.readFileSync(resolved, "utf8");
                if (!content.trim()) {
                    throw new Error("EMPTY_CORE_LEGAL_RESOURCE");
                }
                this.loadedResources.set(resource, content);
            }
            catch {
                this.state = "BLOCKED";
                this.emit("resource_read", resource, "BLOCKED");
                throw new LegalSessionBootstrapError("Mandatory core legal resource cannot be read; fail-closed.", resource, [...this.events]);
            }
            this.emit("resource_read", resource, "OK");
        }
        this.state = "CORE_GATES_LOADED";
        const hasRequiredModuleContract = Array.isArray(router.frontmatter
            .required_modules);
        const routerRequired = router.frontmatter
            .required_modules ?? [];
        const seenRequired = new Set();
        for (const rawResource of routerRequired) {
            const resource = String(rawResource)
                .split("#", 1)
                .at(0)
                ?.trim() ?? "";
            if (!resource ||
                seenRequired.has(resource)) {
                continue;
            }
            seenRequired.add(resource);
            if (this.loadedResources
                .has(resource)) {
                this.runtimeRequiredResources
                    .set(resource, this.loadedResources
                    .get(resource));
                continue;
            }
            let resolved = null;
            try {
                resolved =
                    this.registry
                        .resolveResource(this.routerSkill, resource);
            }
            catch {
                resolved = null;
            }
            if (!resolved) {
                this.state =
                    "BLOCKED";
                this.emit("resource_read", resource, "BLOCKED");
                throw new LegalSessionBootstrapError("A router-declared required module is unavailable; fail-closed.", resource, [...this.events]);
            }
            try {
                const content = fs.readFileSync(resolved, "utf8");
                if (!content.trim()) {
                    throw new Error("EMPTY_ROUTER_REQUIRED_RESOURCE");
                }
                this.runtimeRequiredResources
                    .set(resource, content);
            }
            catch {
                this.state =
                    "BLOCKED";
                this.emit("resource_read", resource, "BLOCKED");
                throw new LegalSessionBootstrapError("A router-declared required module cannot be read; fail-closed.", resource, [...this.events]);
            }
            this.emit("resource_read", resource, "OK");
        }
        if (hasRequiredModuleContract &&
            (seenRequired.size === 0 ||
                this.runtimeRequiredResources
                    .size !==
                    seenRequired.size)) {
            this.state =
                "BLOCKED";
            this.emit("gate", "G39L_ROUTER_REQUIRED_MODULES", "BLOCKED");
            throw new LegalSessionBootstrapError("Router required-module coverage is incomplete.", "G39L_ROUTER_REQUIRED_MODULES", [...this.events]);
        }
        this.emit("gate", "G39L_ROUTER_REQUIRED_MODULES", "OK");
        this.emit("gate", "G3_ROUTER_FIRST_BOOTSTRAP", "OK");
        this.state = "EXECUTION_READY";
        return [...this.events];
    }
}
