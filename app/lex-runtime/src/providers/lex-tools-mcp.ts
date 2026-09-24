/**
 * MCP server (stdio) that a model CLI starts for one Lex run. It lists the
 * Lex runtime tools of that run (legal verification, case law, federated
 * sources such as SAOS or EUR-Lex) and forwards each call over the run's
 * private pipe to the Lex runtime, which executes and audits it. It holds no
 * data and no credentials besides the per-run token.
 */
import fs from "node:fs";
import net from "node:net";
import readline from "node:readline";

type Schema = { name: string; description: string; parameters?: Record<string, unknown> };

const pipe = process.env.LEX_TOOL_PIPE ?? "";
const token = process.env.LEX_TOOL_TOKEN ?? "";
const schemaFile = process.env.LEX_TOOL_SCHEMAS ?? "";

function loadSchemas(): Schema[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(schemaFile, "utf8")) as unknown;
    return Array.isArray(parsed) ? (parsed as Schema[]) : [];
  } catch {
    return [];
  }
}

const schemas = loadSchemas();

function send(message: unknown): void {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function callLex(name: string, input: unknown): Promise<{ content: string; isError: boolean }> {
  return new Promise((resolve) => {
    const socket = net.createConnection(pipe);
    let buffer = "";
    socket.setEncoding("utf8");
    socket.on("connect", () => socket.write(JSON.stringify({ token, name, input }) + "\n"));
    socket.on("data", (chunk: string) => {
      buffer += chunk;
    });
    socket.on("end", () => {
      try {
        const reply = JSON.parse(buffer.trim()) as { content?: unknown; isError?: unknown };
        resolve({ content: String(reply.content ?? ""), isError: reply.isError === true });
      } catch {
        resolve({ content: "LEX_TOOL_BRIDGE_INVALID_REPLY", isError: true });
      }
    });
    socket.on("error", (error) => resolve({ content: `LEX_TOOL_BRIDGE_UNAVAILABLE:${error.message}`, isError: true }));
  });
}

async function handle(message: { id?: unknown; method?: unknown; params?: Record<string, unknown> }): Promise<void> {
  const id = message.id;
  const method = typeof message.method === "string" ? message.method : "";
  if (id === undefined || id === null) return; // notifications
  if (method === "initialize") {
    send({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: typeof message.params?.protocolVersion === "string" ? message.params.protocolVersion : "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "lex", version: "1.0.0" }
      }
    });
    return;
  }
  if (method === "ping") {
    send({ jsonrpc: "2.0", id, result: {} });
    return;
  }
  if (method === "tools/list") {
    send({
      jsonrpc: "2.0",
      id,
      result: {
        tools: schemas.map((schema) => ({
          name: schema.name,
          description: schema.description,
          inputSchema: schema.parameters ?? { type: "object", properties: {} }
        }))
      }
    });
    return;
  }
  if (method === "tools/call") {
    const name = typeof message.params?.name === "string" ? message.params.name : "";
    if (!schemas.some((schema) => schema.name === name)) {
      send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: `UNKNOWN_TOOL:${name}` }], isError: true } });
      return;
    }
    const reply = await callLex(name, message.params?.arguments ?? {});
    send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: reply.content }], isError: reply.isError } });
    return;
  }
  send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
}

readline.createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  try {
    void handle(JSON.parse(line) as { id?: unknown; method?: unknown; params?: Record<string, unknown> });
  } catch {
    send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
});
