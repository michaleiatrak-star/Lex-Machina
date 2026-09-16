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
  "BEGIN PRIVATE KEY",
  "localStorage",
  "sessionStorage",
  "indexedDB"
];

const required = [
  "127.0.0.1:4317",
  "/api/sessions/execute",
  "/api/providers",
  "/api/documents/review",
  "/api/documents/",
  "/api/cases",
  "/api/auth/status",
  "/api/auth/login",
  "/api/auth/bootstrap",
  "/api/auth/lock",
  "/api/auth/logout",
  "Utwórz konto właściciela",
  "Zaloguj się",
  "Zablokuj",
  "Wyloguj",
  "Wybierz sprawę",
  "Aplikacja nie tworzy już spraw automatycznie",
  "reidentyfikacja:",
  "Utwórz sprawę",
  "Archiwum zapisane i rozpakowane lokalnie",
  "Akta sprawy, OCR i ręczna anonimizacja",
  "Konfiguracja API",
  "Anonimizuj / pseudonimizuj",
  "Pozostaw bez anonimizacji",
  "Oznacz, co ten fragment znaczy",
  "Chunki do analizy AI",
  "Domyślnie nic nie jest wysyłane do providera",
  "DRAFT_PRESENTABLE",
  "BLOCKED",
  "Uruchom analizę",
  "Evidence bundle",
  "VERIFIED",
  "SUPPORTED",
  "Stan prawny",
  "Otwórz urzędowe źródło"
];

const exposed = forbidden.filter((token) => content.includes(token));
const missing = required.filter((token) => !content.includes(token));
const pass = exposed.length === 0 && missing.length === 0;

process.stdout.write(JSON.stringify({
  gate: "G14_G31AB_G32_G34AD_LOCAL_WEB_UI",
  result: pass ? "PASS" : "BLOCKED",
  bundleFiles: files.length,
  forbiddenTokensFound: exposed,
  requiredExecutionMarkersMissing: missing,
  localApiReferencePresent: content.includes("127.0.0.1:4317"),
  sessionExecutionEndpointPresent: content.includes("/api/sessions/execute"),
  evidenceBundlePresent: content.includes("Evidence bundle"),
  verifiedStatusPresent: content.includes("VERIFIED"),
  supportedStatusPresent: content.includes("SUPPORTED"),
  historicalStatePresent: content.includes("Stan prawny")
}, null, 2) + "\n");

if (!pass) process.exitCode = 1;
