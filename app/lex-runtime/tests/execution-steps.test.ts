import { describe, expect, it } from "vitest";
import { ExecutionSteps } from "../src/execution-steps.js";

describe("chat turn stages", () => {
  it("shows done, running and pending stages with what was done in each", () => {
    const steps = new ExecutionSteps();
    steps.report("PREPARE", "anonimizacja wiadomości");
    steps.report("ROUTING", "prawny-router-v3: wybór dziedziny");
    steps.report("MODEL", "model claude");
    // A skill the model reads while writing is listed under skills; the model stage stays current.
    steps.report("SKILLS", "dr-02-prawo-cywilne/SKILL.md");
    steps.report("SKILLS", "dr-02-prawo-cywilne/SKILL.md");
    const snapshot = steps.snapshot();
    expect(snapshot.current).toBe(4);
    expect(snapshot.total).toBe(6);
    expect(snapshot.phases.map((phase) => phase.status)).toEqual(["done", "done", "done", "active", "pending", "pending"]);
    expect(snapshot.phases[2]!.details).toEqual(["dr-02-prawo-cywilne/SKILL.md"]);
  });
});
