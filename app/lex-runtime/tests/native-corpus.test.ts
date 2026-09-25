import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  claudeCorpusArgs,
  claudeToolUses,
  corpusRelativePath
} from "../src/providers/account-session.js";
import { startToolBridge } from "../src/providers/lex-tool-bridge.js";
import { LegalCorpusToolRuntime } from "../src/legal-corpus-tool-runtime.js";
import { LexExecutionEngine } from "../src/execution-engine.js";
import { LexSkillRegistry } from "../src/registry.js";
import { ProviderGateway, ProviderRegistry } from "../src/providers/gateway.js";
import type { ProviderAdapter, ProviderStreamParams } from "../src/providers/types.js";

const roots: string[] = [];
afterEach(() => {
  while (roots.length) fs.rmSync(roots.pop()!, { recursive: true, force: true });
});

const DR02 = "dr-02-prawo-cywilne-rodzinne-gospodarcze";
const DR03 = "dr-03-prawo-karne";

function corpus(): LexSkillRegistry {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "lex-native-corpus-"));
  roots.push(root);
  const skill = (name: string, body: string) => {
    fs.mkdirSync(path.join(root, name), { recursive: true });
    fs.writeFileSync(path.join(root, name, "SKILL.md"), `---\nname: ${name}\ndescription: ${name}\n---\n${body}`);
  };
  skill("shared", "# shared\n");
  skill("prawny-router-v3", "# ROUTER V3 HARD GATE\n");
  skill("prawo-polskie-v2", "# prawo\n");
  skill(DR02, "# cywilne\n");
  skill(DR03, "# karne\n");
  fs.writeFileSync(path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"), `${DR02}\n${DR03}\n`);
  fs.writeFileSync(path.join(root, "shared", "PRAWO-HARDGATE.md"), "# hard gate\n");
  fs.mkdirSync(path.join(root, "prawny-router-v3", "references"), { recursive: true });
  fs.writeFileSync(path.join(root, "prawny-router-v3", "references", "KROK0A-anonimizer.md"), "# anon\n");
  fs.writeFileSync(path.join(root, "prawny-router-v3", "references", "KROK1-detekcja.md"), "# detect\n");
  fs.mkdirSync(path.join(root, DR03, "modules"), { recursive: true });
  fs.writeFileSync(path.join(root, DR03, "modules", "mod-KK-kwalifikator-karnomaterialny.md"), "# kwalifikator\n");
  const registry = new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

describe("Claude with the skill corpus as its working directory", () => {
  it("gets read-only file tools confined to the corpus and the Lex tools over MCP only", () => {
    const args = claudeCorpusArgs("system", "/tmp/mcp.json");
    const value = (flag: string) => args[args.indexOf(flag) + 1];
    expect(args).toContain("--restricted");
    expect(args).toContain("--strict-mcp-config");
    expect(value("--mcp-config")).toBe("/tmp/mcp.json");
    expect(value("--tools")).toBe("Read,Glob,Grep");
    expect(value("--allowedTools")).toBe("Read,Glob,Grep,mcp__lex");
    expect(value("--permission-mode")).toBe("dontAsk");
    expect(value("--disallowedTools")).toContain("Bash");
    expect(value("--disallowedTools")).toContain("WebFetch");
  });

  it("audits the files the model read, only inside the corpus", () => {
    const stdout = [
      JSON.stringify({ type: "system", subtype: "init" }),
      JSON.stringify({
        type: "assistant",
        message: {
          content: [
            { type: "text", text: "czytam" },
            { type: "tool_use", name: "Read", input: { file_path: "/corpus/dr-02/SKILL.md" } },
            { type: "tool_use", name: "mcp__lex__verify_legal_reference", input: { eli: "DU/1964/93" } }
          ]
        }
      }),
      JSON.stringify({ type: "result", result: "ok" })
    ].join("\n");
    expect(claudeToolUses(stdout).map((use) => use.name)).toEqual(["Read", "mcp__lex__verify_legal_reference"]);
    expect(corpusRelativePath("/corpus", "/corpus/dr-02/modules/a.md")).toBe("dr-02/modules/a.md");
    expect(corpusRelativePath("/corpus", "dr-02/SKILL.md")).toBe("dr-02/SKILL.md");
    expect(corpusRelativePath("/corpus", "/etc/passwd")).toBeNull();
    expect(corpusRelativePath("/corpus", "../outside.md")).toBeNull();
  });
});

describe("Lex tools over MCP", () => {
  it("lists the run's tools and runs a call through the Lex runtime", async () => {
    const runTools = vi.fn(async (calls: Array<{ id: string; name: string; input: Record<string, unknown> }>) =>
      calls.map((call) => ({ tool_use_id: call.id, content: `wynik ${call.name} ${JSON.stringify(call.input)}` }))
    );
    const bridge = await startToolBridge(runTools);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lex-mcp-"));
    roots.push(dir);
    const schemas = path.join(dir, "tools.json");
    fs.writeFileSync(
      schemas,
      JSON.stringify([{ name: "search_case_law", description: "SAOS", parameters: { type: "object", properties: { q: { type: "string" } } } }])
    );
    const child = spawn(process.execPath, [path.resolve("src/providers/lex-tools-mcp.ts")], {
      env: { ...process.env, LEX_TOOL_PIPE: bridge.pipe, LEX_TOOL_TOKEN: bridge.token, LEX_TOOL_SCHEMAS: schemas },
      stdio: ["pipe", "pipe", "inherit"]
    });
    const replies = new Map<number, (value: Record<string, unknown>) => void>();
    readline.createInterface({ input: child.stdout }).on("line", (line) => {
      const message = JSON.parse(line) as { id: number };
      replies.get(message.id)?.(message as unknown as Record<string, unknown>);
    });
    const ask = (id: number, method: string, params: unknown = {}) =>
      new Promise<Record<string, unknown>>((resolve) => {
        replies.set(id, resolve);
        child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
      });
    try {
      const init = await ask(1, "initialize", { protocolVersion: "2025-06-18" });
      expect((init.result as { serverInfo: { name: string } }).serverInfo.name).toBe("lex");
      const list = await ask(2, "tools/list");
      expect((list.result as { tools: Array<{ name: string }> }).tools.map((tool) => tool.name)).toEqual(["search_case_law"]);
      const call = await ask(3, "tools/call", { name: "search_case_law", arguments: { q: "najem" } });
      expect(call.result).toEqual({ content: [{ type: "text", text: 'wynik search_case_law {"q":"najem"}' }], isError: false });
      const unknown = await ask(4, "tools/call", { name: "Bash", arguments: {} });
      expect((unknown.result as { isError: boolean }).isError).toBe(true);
      expect(runTools).toHaveBeenCalledTimes(1);
    } finally {
      child.kill();
      await bridge.close();
    }
  });

  it("refuses a caller without the run token", async () => {
    const runTools = vi.fn(async () => []);
    const bridge = await startToolBridge(runTools);
    const net = await import("node:net");
    const closed = await new Promise<string>((resolve) => {
      const socket = net.createConnection(bridge.pipe, () =>
        socket.write(JSON.stringify({ token: "zly", name: "search_case_law", input: {} }) + "\n")
      );
      let data = "";
      socket.on("data", (chunk) => (data += chunk));
      socket.on("close", () => resolve(data));
      socket.on("error", () => resolve(data));
    });
    expect(closed).toBe("");
    expect(runTools).not.toHaveBeenCalled();
    await bridge.close();
  });
});

describe("AUTO with native corpus access", () => {
  it("records native reads as loaded skills and asks for the criminal qualifier", () => {
    const runtime = new LegalCorpusToolRuntime(corpus(), { modelSelectsSkills: true });
    runtime.recordNativeRead("prawny-router-v3/SKILL.md");
    runtime.recordNativeRead(`${DR03}/SKILL.md`);
    runtime.recordNativeRead(`${DR03}/modules/inny.md`);
    expect(runtime.modelSkillSelection().domainSkills).toEqual([DR03]);
    expect(runtime.missingCriminalQualifier()).toBe(`${DR03}/modules/mod-KK-kwalifikator-karnomaterialny.md`);
    runtime.recordNativeRead(`${DR03}/modules/mod-KK-kwalifikator-karnomaterialny.md`);
    expect(runtime.missingCriminalQualifier()).toBeNull();
    expect(runtime.auditEvents().every((event) => event.tool === "Read" && event.decision === "ALLOW")).toBe(true);
  });

  it("gives the router up front, passes the corpus and adds the qualifier round", async () => {
    const registry = corpus();
    const runtime = new LegalCorpusToolRuntime(registry, { modelSelectsSkills: true });
    const seen: ProviderStreamParams[] = [];
    const adapter: ProviderAdapter = {
      id: "anthropic",
      label: "test",
      capabilities: { streaming: true, tools: true, reasoning: false, modelDiscovery: false },
      nativeCorpusAccess: () => true,
      stream: async (params) => {
        seen.push(params);
        if (seen.length === 1) {
          params.nativeCorpus!.onRead!(`${DR03}/SKILL.md`);
          return { fullText: "kwalifikacja bez kwalifikatora" };
        }
        params.nativeCorpus!.onRead!(`${DR03}/modules/mod-KK-kwalifikator-karnomaterialny.md`);
        return { fullText: "poprawiona kwalifikacja" };
      }
    };
    const providers = new ProviderRegistry();
    providers.register(adapter);
    const engine = new LexExecutionEngine(registry, new ProviderGateway(providers));
    const result = await engine.executePolishLegalQuery({
      query: "Kradzież roweru.",
      provider: "anthropic",
      model: "account",
      modelSelectsSkills: true,
      nativeCorpus: {
        root: registry.root,
        onRead: (relativePath) => runtime.recordNativeRead(relativePath),
        missingQualifier: () => runtime.missingCriminalQualifier()
      },
      tools: [{ type: "function", function: { name: "search_core_law", description: "rdzeń", parameters: {} } }],
      runTools: async () => [],
      route: { jurisdiction: "PL", primarySkill: DR02, mode: "PRAWNIK" }
    });
    expect(seen).toHaveLength(2);
    expect(seen[0]!.nativeCorpus!.root).toBe(registry.root);
    expect(seen[0]!.systemPrompt).toContain("# ROUTER V3 HARD GATE");
    expect(seen[0]!.systemPrompt).toContain("Read, Glob i Grep");
    expect(seen[0]!.systemPrompt).toContain("mcp__lex__");
    expect(seen[1]!.messages.at(-1)!.content).toContain("mod-KK-kwalifikator-karnomaterialny.md");
    expect(result.output).toBe("poprawiona kwalifikacja");
    expect(runtime.modelSkillSelection().loadedSkills).toEqual(["prawny-router-v3", DR03]);
  });
});
