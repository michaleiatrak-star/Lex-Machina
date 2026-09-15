import {
  DynamicModelCatalog,
  type FetchLike
} from "./providers/model-catalog.js";
import { StaticCredentialResolver } from "./providers/credentials.js";

const requests: Array<{
  url: string;
  authorization: string | null;
  anthropicKey: string | null;
}> = [];

const fetcher: FetchLike = async (input, init) => {
  const url = String(input);
  const headers = new Headers(init?.headers);
  requests.push({
    url,
    authorization: headers.get("authorization"),
    anthropicKey: headers.get("x-api-key")
  });

  if (url.startsWith("https://api.openai.com/")) {
    return new Response(JSON.stringify({
      data: [
        { id: "gpt-g12", created: 1, owned_by: "openai" },
        { id: "gpt-image-g12", created: 2, owned_by: "openai" }
      ]
    }), { status: 200 });
  }

  if (url.startsWith("https://api.anthropic.com/")) {
    return new Response(JSON.stringify({
      data: [{
        id: "claude-g12",
        display_name: "Claude G12",
        capabilities: { effort: { supported: true } }
      }],
      has_more: false,
      last_id: "claude-g12"
    }), { status: 200 });
  }

  if (url === "https://api.x.ai/v1/language-models") {
    return new Response(JSON.stringify({
      models: [{
        id: "grok-g12",
        owned_by: "xai",
        max_prompt_length: 131072,
        input_modalities: ["text"],
        output_modalities: ["text"]
      }]
    }), { status: 200 });
  }

  return new Response("{}", { status: 404 });
};

const credentials = new StaticCredentialResolver({
  openai: "g12-openai-secret",
  anthropic: "g12-anthropic-secret",
  xai: "g12-xai-secret"
});
const catalog = new DynamicModelCatalog(credentials, fetcher);

const openai = await catalog.list("openai");
const anthropic = await catalog.list("anthropic");
const xai = await catalog.list("xai");

const serialized = JSON.stringify({ openai, anthropic, xai });
const pass =
  openai.some((model) => model.id === "gpt-g12" && model.selectable) &&
  openai.some((model) => model.id === "gpt-image-g12" && !model.selectable) &&
  anthropic.some((model) => model.id === "claude-g12") &&
  xai.some((model) => model.id === "grok-g12") &&
  requests.some((request) =>
    request.url === "https://api.openai.com/v1/models"
  ) &&
  requests.some((request) =>
    request.url.startsWith("https://api.anthropic.com/v1/models")
  ) &&
  requests.some((request) =>
    request.url === "https://api.x.ai/v1/language-models"
  ) &&
  !serialized.includes("g12-openai-secret") &&
  !serialized.includes("g12-anthropic-secret") &&
  !serialized.includes("g12-xai-secret");

process.stdout.write(
  JSON.stringify(
    {
      gate: "G12_DYNAMIC_MODEL_CATALOG",
      result: pass ? "PASS" : "BLOCKED",
      modelCounts: {
        openai: openai.length,
        anthropic: anthropic.length,
        xai: xai.length
      },
      endpoints: requests.map((request) => request.url),
      credentialsExposedInResult: false,
      liveApiCallsExecuted: false,
      liveValidationStatus: "PENDING_CREDENTIALLED_TESTS"
    },
    null,
    2
  ) + "\n"
);

if (!pass) process.exitCode = 1;
