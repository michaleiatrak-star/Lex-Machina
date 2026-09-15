import { afterEach, describe, expect, it, vi } from "vitest";
import {
  executeSession,
  getHealth,
  getModels,
  validateRoute
} from "./api.js";

afterEach(() => {
  vi.restoreAllMocks();

  it("posts a safe session execution request", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        sessionId: "session-1",
        status: "DRAFT_PRESENTABLE",
        provider: "openai",
        model: "gpt-test",
        primarySkill: "dr-02-test",
        answer: "draft",
        finalization: "PASS",
        blockedReferences: [],
        audit: {
          result: "PASS",
          eventCount: 10,
          closed: true
        }
      }), { status: 200 })
    );

    await executeSession({
      query: "Pytanie",
      provider: "openai",
      model: "gpt-test",
      primarySkill: "dr-02-test"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/api/sessions/execute",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          query: "Pytanie",
          provider: "openai",
          model: "gpt-test",
          primarySkill: "dr-02-test",
          mode: "PRAWNIK"
        })
      })
    );
  });
});

describe("local API client", () => {
  it("uses the localhost runtime by default", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        status: "ok",
        service: "lex-machina-runtime",
        localOnly: true
      }), { status: 200 })
    );

    await getHealth();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/health",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json"
        })
      })
    );
  });

  it("posts only a route identifier for route validation", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        valid: true,
        primarySkill: "dr-02-test"
      }), { status: 200 })
    );

    await validateRoute("dr-02-test");

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(
      JSON.stringify({ primarySkill: "dr-02-test" })
    );
  });

  it("posts the selected runtime configuration and user query for execution", async () => {
    const payload = {
      sessionId: "session-1",
      status: "DRAFT_PRESENTABLE",
      provider: "openai",
      model: "gpt-test",
      primarySkill: "dr-02-test",
      answer: "Wynik.",
      finalization: "PASS",
      blockedReferences: [],
      audit: {
        result: "PASS",
        eventCount: 9,
        closed: true
      }
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 })
    );

    const request = {
      query: "Przeanalizuj umowę.",
      provider: "openai" as const,
      model: "gpt-test",
      primarySkill: "dr-02-test",
      mode: "PRAWNIK" as const
    };

    await expect(executeSession(request)).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4317/api/sessions/execute",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(request),
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    );
  });

  it("surfaces sanitized model discovery failures", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        error: "PROVIDER_NOT_CONFIGURED",
        provider: "openai"
      }), { status: 503 })
    );

    await expect(getModels("openai")).rejects.toThrow(
      "PROVIDER_NOT_CONFIGURED"
    );
  });

  it("surfaces sanitized execution failures without provider secrets", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        error: "PROVIDER_EXECUTION_FAILED",
        provider: "anthropic"
      }), { status: 502 })
    );

    await expect(executeSession({
      query: "Test",
      provider: "anthropic",
      model: "claude-test",
      primarySkill: "dr-02-test",
      mode: "LAIK"
    })).rejects.toThrow("PROVIDER_EXECUTION_FAILED");
  });
});
