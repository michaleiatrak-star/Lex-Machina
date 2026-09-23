import { describe, expect, it } from "vitest";
import { localDraftForwarder } from "../src/providers/ai-sdk-adapter.js";
import { createDraftCallbacks } from "../src/session-executor.js";
import { PseudonymizationVault } from "../src/privacy/pseudonymizer.js";

describe("live answer draft", () => {
  it("forwards plain local text as it streams", () => {
    const seen: string[] = [];
    const forwarder = localDraftForwarder((text) => seen.push(text));
    forwarder.push("Dzień ");
    forwarder.push("dobry");
    forwarder.finish("Dzień dobry");
    expect(seen.join("")).toBe("Dzień dobry");
  });

  it("never shows the local text tool protocol", () => {
    const seen: string[] = [];
    const forwarder = localDraftForwarder((text) => seen.push(text));
    forwarder.push("LEX_TOOL");
    forwarder.push("_CALLS_JSON:{\"calls\":[]}");
    expect(seen).toEqual([]);
  });

  it("restores chat pseudonyms and hides an incomplete token", async () => {
    const vault = new PseudonymizationVault();
    const { LocalPolishPseudonymizer } = await import("../src/privacy/pseudonymizer.js");
    const protectedText = (
      await new LocalPolishPseudonymizer(vault).pseudonymize("Pani Anna Nowak, PESEL 44051401458")
    ).text;
    const token = /\[PII:[A-Z_]+:\d{4}\]/.exec(protectedText)?.[0];
    expect(token).toBeTruthy();

    const drafts: string[] = [];
    const callbacks = createDraftCallbacks(vault, (text) => drafts.push(text));
    callbacks.onContentDelta?.(`Numer: ${token!.slice(0, 6)}`);
    expect(drafts.at(-1)).toBe("Numer: ");
    callbacks.onContentDelta?.(token!.slice(6));
    expect(drafts.at(-1)).not.toContain("[PII:");
    callbacks.onToolCallStart?.({ id: "t", name: "x", input: {} });
    expect(drafts.at(-1)).toBe("");
  });
});
