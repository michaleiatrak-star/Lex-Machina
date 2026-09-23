#!/usr/bin/env node

const endpoint = (process.env.LEX_LOCAL_LLM_ENDPOINT || "http://127.0.0.1:4318/v1").replace(/\/$/, "");
const requestedModel = process.env.LEX_LOCAL_MODEL_ID || "";
const timeoutMs = Number(process.env.LEX_LOCAL_LLM_TIMEOUT_MS || 90000);

function fail(message, detail) {
  console.error(`FAIL ${message}`);
  if (detail) console.error(detail);
  process.exitCode = 1;
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  console.log(`Lex Machina local provider smoke test`);
  console.log(`Endpoint: ${endpoint}`);

  let modelsResponse;
  try {
    modelsResponse = await fetchWithTimeout(`${endpoint}/models`, {
      headers: { Accept: "application/json" }
    });
  } catch (error) {
    fail("/models network error", error instanceof Error ? error.stack : String(error));
    return;
  }

  const modelsText = await modelsResponse.text();
  if (!modelsResponse.ok) {
    fail(`/models HTTP ${modelsResponse.status}`, modelsText.slice(-4000));
    return;
  }

  let modelsPayload;
  try {
    modelsPayload = JSON.parse(modelsText);
  } catch {
    fail("/models returned invalid JSON", modelsText.slice(-4000));
    return;
  }

  const ids = Array.isArray(modelsPayload?.data)
    ? modelsPayload.data.map((item) => item?.id).filter((id) => typeof id === "string")
    : [];

  console.log(`Models: ${ids.length ? ids.join(", ") : "<none>"}`);

  const model = requestedModel || ids[0];
  if (!model) {
    fail("No model is exposed by localhost. Start/select Bielik or Mistral in Lex Machina first.");
    return;
  }

  if (requestedModel && !ids.includes(requestedModel)) {
    fail(`Requested model is not exposed: ${requestedModel}`, `Available: ${ids.join(", ") || "<none>"}`);
    return;
  }

  console.log(`Testing model: ${model}`);

  let chatResponse;
  try {
    chatResponse = await fetchWithTimeout(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Odpowiedz wyłącznie: OK" }],
        max_tokens: 16,
        temperature: 0,
        stream: false
      })
    });
  } catch (error) {
    fail("/chat/completions network or timeout error", error instanceof Error ? error.stack : String(error));
    return;
  }

  const chatText = await chatResponse.text();
  if (!chatResponse.ok) {
    fail(`/chat/completions HTTP ${chatResponse.status}`, chatText.slice(-8000));
    return;
  }

  let chatPayload;
  try {
    chatPayload = JSON.parse(chatText);
  } catch {
    fail("/chat/completions returned invalid JSON", chatText.slice(-8000));
    return;
  }

  const content = chatPayload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    fail("Model returned an empty assistant message", JSON.stringify(chatPayload, null, 2).slice(-8000));
    return;
  }

  console.log(`PASS response: ${JSON.stringify(content.trim())}`);
  console.log("PASS local provider is healthy independently of Lex Machina UI/router.");
}

main().catch((error) => {
  fail("Unexpected smoke-test failure", error instanceof Error ? error.stack : String(error));
});
