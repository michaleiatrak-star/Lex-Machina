import crypto from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import type {
  NormalizedToolCall,
  NormalizedToolResult
} from "./types.js";

export type ToolBridge = {
  pipe: string;
  token: string;
  close(): Promise<void>;
};

const MAX_REQUEST_BYTES = 1024 * 1024;

export function bridgePipePath(
  id: string,
  platform: NodeJS.Platform = process.platform
): string {
  return platform === "win32"
    ? `\\\\.\\pipe\\lex-tools-${id}`
    : path.join(os.tmpdir(), `lex-tools-${id}.sock`);
}

function sameToken(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Lex runtime tools for a model CLI running as a separate process: the Lex
 * MCP server started by the CLI (lex-tools-mcp.js) sends each tool call over
 * a private local pipe with a per-run token, and the call runs through the
 * same audited Lex tool runtime as every other model turn.
 */
export async function startToolBridge(
  runTools: (calls: NormalizedToolCall[]) => Promise<NormalizedToolResult[]>,
  onCall?: (call: NormalizedToolCall) => void
): Promise<ToolBridge> {
  const id = crypto.randomBytes(12).toString("hex");
  const token = crypto.randomBytes(32).toString("hex");
  const pipe = bridgePipePath(id);

  const server = net.createServer((socket) => {
    let buffer = "";
    socket.setEncoding("utf8");
    socket.on("error", () => socket.destroy());
    socket.on("data", (chunk: string) => {
      buffer += chunk;
      if (buffer.length > MAX_REQUEST_BYTES) {
        socket.destroy();
        return;
      }
      const end = buffer.indexOf("\n");
      if (end < 0) return;
      const line = buffer.slice(0, end);
      buffer = "";
      void (async () => {
        let reply: { content: string; isError: boolean };
        try {
          const request = JSON.parse(line) as { token?: unknown; name?: unknown; input?: unknown };
          if (typeof request.token !== "string" || !sameToken(request.token, token)) {
            socket.destroy();
            return;
          }
          if (typeof request.name !== "string" || !request.name) throw new Error("TOOL_NAME_REQUIRED");
          const call: NormalizedToolCall = {
            id: `mcp_${crypto.randomBytes(6).toString("hex")}`,
            name: request.name,
            input:
              request.input && typeof request.input === "object" && !Array.isArray(request.input)
                ? (request.input as Record<string, unknown>)
                : {}
          };
          onCall?.(call);
          const [result] = await runTools([call]);
          reply = { content: result?.content ?? "", isError: !result };
        } catch (error) {
          reply = { content: error instanceof Error ? error.message : String(error), isError: true };
        }
        socket.end(JSON.stringify(reply) + "\n");
      })();
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(pipe, () => {
      server.off("error", reject);
      resolve();
    });
  });
  if (process.platform !== "win32") {
    try {
      fs.chmodSync(pipe, 0o600);
    } catch {
      // The token still guards the socket.
    }
  }

  return {
    pipe,
    token,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
        if (process.platform !== "win32") {
          fs.rmSync(pipe, { force: true });
        }
      })
  };
}
