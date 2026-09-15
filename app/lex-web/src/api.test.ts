import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getHealth,
  getModels,
  validateRoute
} from "./api.js";

afterEach(() => {
  vi.restoreAllMocks();
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
});
