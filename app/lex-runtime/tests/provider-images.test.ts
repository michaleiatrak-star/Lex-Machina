import { describe, expect, it } from "vitest";
import { AiSdkProviderAdapter } from "../src/providers/ai-sdk-adapter.js";
import { claudeInput, messageImages } from "../src/providers/account-session.js";

const credentials = { resolve: async () => null } as never;
const image = { mediaType: "image/jpeg" as const, data: "QUJD" };

describe("images for models", () => {
  it("API models and the Claude account take images; local models and other CLIs do not", () => {
    expect(new AiSdkProviderAdapter("openai", credentials).supportsImages("gpt-test")).toBe(true);
    expect(new AiSdkProviderAdapter("openai", credentials).supportsImages("local/bielik")).toBe(false);
    expect(new AiSdkProviderAdapter("anthropic", credentials).supportsImages("account/anthropic/default")).toBe(true);
    expect(new AiSdkProviderAdapter("openai", credentials).supportsImages("account/openai/default")).toBe(false);
  });

  it("sends the Claude CLI one stream-json message with text and image blocks", () => {
    expect(claudeInput("pytanie")).toEqual({ stdin: "pytanie", args: [] });
    const input = claudeInput("pytanie", [image]);
    expect(input.args).toEqual(["--input-format", "stream-json"]);
    const message = JSON.parse(input.stdin);
    expect(message.type).toBe("user");
    expect(message.message.content).toEqual([
      { type: "text", text: "pytanie" },
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: "QUJD" } }
    ]);
  });

  it("collects images from the conversation", () => {
    expect(
      messageImages({
        model: "m",
        systemPrompt: "",
        messages: [
          { role: "user", content: "kontekst", images: [image] },
          { role: "user", content: "pytanie" }
        ]
      })
    ).toEqual([image]);
  });
});
