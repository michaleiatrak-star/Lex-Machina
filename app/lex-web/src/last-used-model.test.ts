import { describe, expect, it } from "vitest";
import { parseLastUsedModel, shouldAutoStartLocalModel } from "./last-used-model.js";

describe("last used model", () => {
  it("accepts only a known source with a model id", () => {
    expect(parseLastUsedModel('{"provider":"local","model":"local/bielik"}')).toEqual({
      provider: "local",
      model: "local/bielik"
    });
    expect(parseLastUsedModel('{"provider":"evil","model":"x"}')).toBeNull();
    expect(parseLastUsedModel('{"provider":"local","model":""}')).toBeNull();
    expect(parseLastUsedModel("{")).toBeNull();
    expect(parseLastUsedModel(null)).toBeNull();
  });

  it("starts the local model only when it was the last one used and is not running", () => {
    const remembered = { provider: "local" as const, model: "local/bielik" };
    const base = {
      remembered,
      provider: "local" as const,
      model: "local/bielik",
      runtimeState: "STOPPED",
      activeModelId: null
    };
    expect(shouldAutoStartLocalModel(base)).toBe(true);
    expect(shouldAutoStartLocalModel({ ...base, runtimeState: "READY", activeModelId: "local/bielik" })).toBe(false);
    expect(shouldAutoStartLocalModel({ ...base, runtimeState: "STARTING" })).toBe(false);
    expect(shouldAutoStartLocalModel({ ...base, runtimeState: undefined })).toBe(false);
    expect(shouldAutoStartLocalModel({ ...base, remembered: { provider: "anthropic", model: "claude" } })).toBe(false);
    expect(shouldAutoStartLocalModel({ ...base, model: "local/other" })).toBe(false);
  });
});
