import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { ToolBroker, ToolPolicy } from "../src/tool-broker.js";

describe("ToolBroker", () => {
  it("denies unknown tools by default", async () => {
    const broker = new ToolBroker(new ToolPolicy());
    await expect(broker.execute({ name: "mystery", input: {} })).resolves.toEqual({
      ok: false,
      error: "UNKNOWN_TOOL"
    });
    expect(broker.audit.at(-1)).toMatchObject({
      decision: "DENY",
      reason: "UNKNOWN_TOOL"
    });
  });

  it("allows file reads only inside configured roots", async () => {
    const root = path.resolve("/tmp/lex-root");
    const execute = vi.fn(async () => "ok");
    const broker = new ToolBroker(new ToolPolicy({ readableRoots: [root] }));
    broker.register({ name: "file_read", capability: "read", execute });

    await expect(
      broker.execute({
        name: "file_read",
        input: { path: path.join(root, "shared", "PRAWO-HARDGATE.md") }
      })
    ).resolves.toEqual({ ok: true, output: "ok" });

    await expect(
      broker.execute({
        name: "file_read",
        input: { path: path.resolve(root, "../../etc/passwd") }
      })
    ).resolves.toEqual({ ok: false, error: "READ_PATH_OUTSIDE_ROOT" });

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("blocks unsafe network schemes and local/private targets", async () => {
    const execute = vi.fn(async () => "network");
    const broker = new ToolBroker(new ToolPolicy({ allowNetwork: true }));
    broker.register({ name: "web_fetch", capability: "network", execute });

    for (const [url, error] of [
      ["file:///etc/passwd", "UNSAFE_URL_SCHEME"],
      ["http://localhost:3000/admin", "PRIVATE_NETWORK_DENIED"],
      ["http://127.0.0.1/", "PRIVATE_NETWORK_DENIED"],
      ["http://10.1.2.3/", "PRIVATE_NETWORK_DENIED"],
      ["http://169.254.169.254/latest/meta-data", "PRIVATE_NETWORK_DENIED"],
      ["http://192.168.1.10/", "PRIVATE_NETWORK_DENIED"]
    ] as const) {
      await expect(
        broker.execute({ name: "web_fetch", input: { url } })
      ).resolves.toEqual({ ok: false, error });
    }

    await expect(
      broker.execute({
        name: "web_fetch",
        input: { url: "https://eli.gov.pl/" }
      })
    ).resolves.toEqual({ ok: true, output: "network" });

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("enforces a network host allowlist before tool execution", async () => {
    const execute = vi.fn(async () => "official");
    const broker = new ToolBroker(
      new ToolPolicy({
        allowNetwork: true,
        allowedNetworkHosts: ["eli.gov.pl"]
      })
    );
    broker.register({
      name: "verify_source",
      capability: "network",
      execute
    });

    await expect(
      broker.execute({
        name: "verify_source",
        input: { url: "https://eli.gov.pl/acts/test" }
      })
    ).resolves.toEqual({ ok: true, output: "official" });

    await expect(
      broker.execute({
        name: "verify_source",
        input: { url: "https://example.com/not-official" }
      })
    ).resolves.toEqual({
      ok: false,
      error: "NETWORK_HOST_DENIED"
    });

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("keeps write/code/MCP disabled until explicitly enabled", async () => {
    const broker = new ToolBroker(
      new ToolPolicy({
        writableRoots: [path.resolve("/tmp/exports")]
      })
    );

    broker.register({
      name: "create_file",
      capability: "write",
      execute: async () => "created"
    });
    broker.register({
      name: "python",
      capability: "code",
      execute: async () => "ran"
    });
    broker.register({
      name: "mcp_call",
      capability: "mcp",
      execute: async () => "called"
    });

    await expect(
      broker.execute({
        name: "create_file",
        input: { path: "/tmp/exports/out.docx" }
      })
    ).resolves.toEqual({ ok: false, error: "WRITE_DISABLED" });

    await expect(
      broker.execute({ name: "python", input: { code: "print(1)" } })
    ).resolves.toEqual({ ok: false, error: "CODE_DISABLED" });

    await expect(
      broker.execute({ name: "mcp_call", input: { server: "test" } })
    ).resolves.toEqual({ ok: false, error: "MCP_DISABLED" });
  });
});