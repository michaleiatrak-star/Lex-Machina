import path from "node:path";
import { ToolBroker, ToolPolicy } from "./tool-broker.js";

const root = path.resolve("/tmp/lex-runtime-policy-root");
const broker = new ToolBroker(
  new ToolPolicy({
    readableRoots: [root],
    writableRoots: [path.join(root, "exports")],
    allowNetwork: true
  })
);

broker.register({
  name: "file_read",
  capability: "read",
  execute: async () => "READ_OK"
});
broker.register({
  name: "web_fetch",
  capability: "network",
  execute: async () => "FETCH_OK"
});
broker.register({
  name: "create_file",
  capability: "write",
  execute: async () => "WRITE_OK"
});
broker.register({
  name: "python",
  capability: "code",
  execute: async () => "CODE_OK"
});

const cases = [
  {
    id: "unknown-tool",
    expected: "UNKNOWN_TOOL",
    request: { name: "unknown", input: {} }
  },
  {
    id: "file-traversal",
    expected: "READ_PATH_OUTSIDE_ROOT",
    request: { name: "file_read", input: { path: "/etc/passwd" } }
  },
  {
    id: "unsafe-scheme",
    expected: "UNSAFE_URL_SCHEME",
    request: { name: "web_fetch", input: { url: "file:///etc/passwd" } }
  },
  {
    id: "localhost",
    expected: "PRIVATE_NETWORK_DENIED",
    request: { name: "web_fetch", input: { url: "http://127.0.0.1/" } }
  },
  {
    id: "metadata-service",
    expected: "PRIVATE_NETWORK_DENIED",
    request: {
      name: "web_fetch",
      input: { url: "http://169.254.169.254/latest/meta-data" }
    }
  },
  {
    id: "write-disabled",
    expected: "WRITE_DISABLED",
    request: {
      name: "create_file",
      input: { path: path.join(root, "exports", "test.txt") }
    }
  },
  {
    id: "code-disabled",
    expected: "CODE_DISABLED",
    request: { name: "python", input: { code: "print(1)" } }
  }
] as const;

const results = [];
for (const testCase of cases) {
  const result = await broker.execute(testCase.request);
  results.push({
    id: testCase.id,
    expected: testCase.expected,
    actual: result.error ?? null,
    pass: result.ok === false && result.error === testCase.expected
  });
}

const pass = results.every((result) => result.pass);
process.stdout.write(
  JSON.stringify(
    {
      gate: "G4_TOOL_SAFETY",
      result: pass ? "PASS" : "BLOCKED",
      cases: results,
      audit: broker.audit
    },
    null,
    2
  ) + "\n"
);

if (!pass) process.exitCode = 1;
