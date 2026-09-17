import fs from "node:fs";
import { LexSkillRegistry } from "./registry.js";

export type LegalSessionState =
  | "SESSION_CREATED"
  | "ROUTER_LOADED"
  | "CORE_GATES_LOADED"
  | "EXECUTION_READY"
  | "BLOCKED";

export type LegalSessionEvent = {
  sequence: number;
  type: "session" | "skill_read" | "resource_read" | "gate";
  target: string;
  status: "OK" | "BLOCKED";
};

export class LegalSessionBootstrapError extends Error {
  constructor(
    message: string,
    readonly target: string,
    readonly events: LegalSessionEvent[]
  ) {
    super(message);
    this.name = "LegalSessionBootstrapError";
  }
}

export const CORE_LEGAL_RESOURCES = [
  "shared/PRAWO-HARDGATE.md",
  "references/KROK0A-anonimizer.md",
  "references/KROK1-detekcja.md"
] as const;

export class LegalSession {
  state: LegalSessionState = "SESSION_CREATED";
  readonly events: LegalSessionEvent[] = [];
  readonly loadedResources =
    new Map<string, string>();

  constructor(
    private readonly registry: LexSkillRegistry,
    private readonly routerSkill = "prawny-router-v3",
    private readonly sharedSkill = "shared"
  ) {}

  private emit(
    type: LegalSessionEvent["type"],
    target: string,
    status: LegalSessionEvent["status"]
  ): void {
    this.events.push({
      sequence: this.events.length + 1,
      type,
      target,
      status
    });
  }

  initializeLegalQuery(): LegalSessionEvent[] {
    this.emit("session", "legal-query", "OK");

    const router = this.registry.get(this.routerSkill);
    if (!router) {
      this.state = "BLOCKED";
      this.emit("skill_read", this.routerSkill, "BLOCKED");
      throw new LegalSessionBootstrapError(
        "Mandatory legal router is unavailable.",
        this.routerSkill,
        [...this.events]
      );
    }

    // The legal router is always the first skill read.
    this.emit("skill_read", this.routerSkill, "OK");
    this.state = "ROUTER_LOADED";

    // shared is the mandatory base library for all legal skills. We do not
    // inject its entire body into the provider prompt; instead we require the
    // library to be present and then load the canonical shared resources below.
    const shared = this.registry.get(this.sharedSkill);
    if (!shared) {
      this.state = "BLOCKED";
      this.emit("skill_read", this.sharedSkill, "BLOCKED");
      throw new LegalSessionBootstrapError(
        "Mandatory shared legal library is unavailable.",
        this.sharedSkill,
        [...this.events]
      );
    }
    this.emit("skill_read", this.sharedSkill, "OK");

    for (const resource of CORE_LEGAL_RESOURCES) {
      let resolved: string | null = null;
      try {
        resolved = this.registry.resolveResource(this.routerSkill, resource);
      } catch {
        resolved = null;
      }

      if (!resolved) {
        this.state = "BLOCKED";
        this.emit("resource_read", resource, "BLOCKED");
        throw new LegalSessionBootstrapError(
          "Mandatory core legal resource is unavailable; fail-closed.",
          resource,
          [...this.events]
        );
      }

      try {
        const content =
          fs.readFileSync(
            resolved,
            "utf8"
          );
        if (!content.trim()) {
          throw new Error(
            "EMPTY_CORE_LEGAL_RESOURCE"
          );
        }
        this.loadedResources.set(
          resource,
          content
        );
      } catch {
        this.state = "BLOCKED";
        this.emit(
          "resource_read",
          resource,
          "BLOCKED"
        );
        throw new LegalSessionBootstrapError(
          "Mandatory core legal resource cannot be read; fail-closed.",
          resource,
          [...this.events]
        );
      }
      this.emit("resource_read", resource, "OK");
    }

    this.state = "CORE_GATES_LOADED";
    this.emit("gate", "G3_ROUTER_FIRST_BOOTSTRAP", "OK");
    this.state = "EXECUTION_READY";

    return [...this.events];
  }
}
