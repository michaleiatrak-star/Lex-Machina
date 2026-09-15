import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "dist");

function collect(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? collect(target) : [target];
  });
}

if (!fs.existsSync(root)) {
  throw new Error("dist/ does not exist; run npm run build first.");
}

const files = collect(root).filter((file) =>
  /\.(?:js|css|html|json|map)$/.test(file)
);
const content = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");

const forbidden = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "XAI_API_KEY",
  "PRAWO-HARDGATE.md",
  "# SKILL:",
  "BEGIN PRIVATE KEY"
];

const exposed = forbidden.filter((token) => content.includes(token));
const hasLocalApi = content.includes("127.0.0.1:4317");
const pass = exposed.length === 0 && hasLocalApi;

process.stdout.write(JSON.stringify({
  gate: "G14_LOCAL_WEB_UI",
  result: pass ? "PASS" : "BLOCKED",
  bundleFiles: files.length,
  forbiddenTokensFound: exposed,
  localApiReferencePresent: hasLocalApi
}, null, 2) + "\n");

if (!pass) process.exitCode = 1;
