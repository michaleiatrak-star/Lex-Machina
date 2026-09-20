import { describe, expect, it, vi } from "vitest";
import {
  DynamicModelCatalog,
  type FetchLike
} from "../src/providers/model-catalog.js";
import {
  MissingProviderCredentialError,
  StaticCredentialResolver
} from "../src/providers/credentials.js";
import type {
  LocalModelRuntime
} from "../src/local-model-runtime.js";

function response(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" }
  });
}

describe("DynamicModelCatalog", () => {
  it("lists OpenAI models and marks non-chat families non-selectable", async () => {
    const seen: Array<{ url: string; auth: string | null }> = [];
    const fetcher: FetchLike = vi.fn(async (input, init) => {
      const headers = new Headers(init?.headers);
      seen.push({
        url: String(input),
        auth: headers.get("authorization")
      });
      return response({
        data: [
          { id: "gpt-test", created: 1, owned_by: "openai" },
          { id: "gpt-image-test", created: 2, owned_by: "openai" }
        ]
      });
    });

    const catalog = new DynamicModelCatalog(
      new StaticCredentialResolver({ openai: "secret-openai" }),
      fetcher
    );
    const models = await catalog.list("openai");

    expect(seen).toEqual([{
      url: "https://api.openai.com/v1/models",
      auth: "Bearer secret-openai"
    }]);
    expect(models[0]).toMatchObject({
      id: "gpt-test",
      selectable: true
    });
    expect(models[1]).toMatchObject({
      id: "gpt-image-test",
      selectable: false
    });
    expect(JSON.stringify(models)).not.toContain("secret-openai");
  });

  it("paginates Anthropic model discovery using last_id", async () => {
    const urls: string[] = [];
    const fetcher: FetchLike = vi.fn(async (input, init) => {
      const url = String(input);
      urls.push(url);
      const headers = new Headers(init?.headers);
      expect(headers.get("x-api-key")).toBe("secret-anthropic");
      expect(headers.get("anthropic-version")).toBe("2023-06-01");

      if (!url.includes("after_id=")) {
        return response({
          data: [{
            id: "claude-a",
            display_name: "Claude A",
            capabilities: {
              effort: { supported: true }
            }
          }],
          has_more: true,
          last_id: "claude-a"
        });
      }

      return response({
        data: [{ id: "claude-b", display_name: "Claude B" }],
        has_more: false,
        last_id: "claude-b"
      });
    });

    const catalog = new DynamicModelCatalog(
      new StaticCredentialResolver({ anthropic: "secret-anthropic" }),
      fetcher
    );
    const models = await catalog.list("anthropic");

    expect(models.map((model) => model.id)).toEqual([
      "claude-a",
      "claude-b"
    ]);
    expect(models[0]?.capabilities).toContain("effort");
    expect(urls).toHaveLength(2);
    expect(urls[1]).toContain("after_id=claude-a");
  });

  it("uses xAI language-model discovery and keeps modality metadata", async () => {
    const fetcher: FetchLike = vi.fn(async (input, init) => {
      expect(String(input)).toBe(
        "https://api.x.ai/v1/language-models"
      );
      const headers = new Headers(init?.headers);
      expect(headers.get("authorization")).toBe("Bearer secret-xai");
      return response({
        models: [{
          id: "grok-test",
          owned_by: "xai",
          max_prompt_length: 131072,
          input_modalities: ["text", "image"],
          output_modalities: ["text"]
        }]
      });
    });

    const catalog = new DynamicModelCatalog(
      new StaticCredentialResolver({ xai: "secret-xai" }),
      fetcher
    );
    const models = await catalog.list("xai");

    expect(models).toEqual([
      expect.objectContaining({
        id: "grok-test",
        selectable: true,
        contextWindow: 131072,
        inputModalities: ["text", "image"],
        outputModalities: ["text"]
      })
    ]);
  });

  it("exposes tokenizer calibration only for the configured qualified local model", () => {
    const localRuntime = {
      status: () => ({
        configured: true,
        selectedModelId:
          "local/mistral-nemo",
        qualification: {
          schemaVersion: 1,
          result: "PASS",
          modelId:
            "local/mistral-nemo",
          contextTokens:
            128_000,
          contextMode:
            "NATIVE_OR_REDUCED",
          engine:
            "llama.cpp",
          startupMs: 1234,
          tokenizerCalibration: {
            endpoint:
              "/tokenize",
            sampleCount: 3,
            observedMinCharsPerToken:
              2.71,
            conservativeCharsPerToken:
              2.439,
            calibratedAt:
              "2026-09-18T10:00:00.000Z"
          },
          validatedAt:
            "2026-09-18T10:00:01.000Z"
        }
      }),
      qualificationForModel: (
        modelId: string
      ) =>
        modelId ===
          "local/mistral-nemo"
          ? {
              schemaVersion: 1 as const,
              result: "PASS" as const,
              modelId:
                "local/mistral-nemo",
              contextTokens:
                128_000,
              contextMode:
                "NATIVE_OR_REDUCED" as const,
              engine:
                "llama.cpp" as const,
              startupMs: 1234,
              tokenizerCalibration: {
                endpoint:
                  "/tokenize" as const,
                sampleCount: 3,
                observedMinCharsPerToken:
                  2.71,
                conservativeCharsPerToken:
                  2.439,
                calibratedAt:
                  "2026-09-18T10:00:00.000Z"
              },
              validatedAt:
                "2026-09-18T10:00:01.000Z"
            }
          : null,
      listModels: () => []
    } as unknown as
      LocalModelRuntime;

    const catalog =
      new DynamicModelCatalog(
        new StaticCredentialResolver(
          {}
        ),
        vi.fn(),
        localRuntime
      );

    expect(
      catalog
        .localTokenCharsPerToken(
          "local/mistral-nemo"
        )
    ).toBe(2.439);
    expect(
      catalog
        .localTokenCharsPerToken(
          "local/bielik"
        )
    ).toBeUndefined();
  });

  it("keeps an installed local model selectable even when its saved profile is missing", async () => {
    const localRuntime = {
      listModels: () => [
        {
          provider: "local" as const,
          id: "local/mistral-nemo-12b-q4km",
          displayName: "Mistral NeMo 12B",
          selectable: true as const,
          contextWindow: 131_072,
          nativeContextWindow: 131_072,
          minimumContextWindow: 64_000,
          maximumContextWindow: 200_000,
          contextMode: "NATIVE_OR_REDUCED" as const,
          quantization: "Q4_K_M",
          license: "Apache-2.0",
          source: "mistralai/Mistral-Nemo-Instruct-2407",
          localOnly: true as const,
          installed: true
        }
      ],
      qualificationForModel: () => null
    } as unknown as LocalModelRuntime;
    const fetcher: FetchLike = vi.fn();
    const catalog = new DynamicModelCatalog(
      new StaticCredentialResolver({}),
      fetcher,
      localRuntime
    );

    const models = await catalog.list("openai");

    expect(models).toEqual([
      expect.objectContaining({
        id: "local/mistral-nemo-12b-q4km",
        selectable: true,
        contextWindow: 131_072
      })
    ]);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("fails before any network request when a provider key is missing", async () => {
    const fetcher: FetchLike = vi.fn();
    const catalog = new DynamicModelCatalog(
      new StaticCredentialResolver({}),
      fetcher
    );

    await expect(catalog.list("openai")).rejects.toBeInstanceOf(
      MissingProviderCredentialError
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("does not include server-side credentials in HTTP error messages", async () => {
    const fetcher: FetchLike = vi.fn(async () =>
      response({ error: "sensitive upstream body" }, 401)
    );
    const catalog = new DynamicModelCatalog(
      new StaticCredentialResolver({ xai: "super-secret-xai" }),
      fetcher
    );

    let message = "";
    try {
      await catalog.list("xai");
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }

    expect(message).toContain("HTTP 401");
    expect(message).not.toContain("super-secret-xai");
    expect(message).not.toContain("sensitive upstream body");
  });
});
