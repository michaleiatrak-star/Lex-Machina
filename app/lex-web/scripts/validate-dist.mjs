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

// G14 validates the current user-facing product contract. The September 2026
// chat-first redesign intentionally replaced the old configuration dashboard,
// so the gate now requires equivalent safety/case/document/provider functions
// plus the new chat, card, file-drop and skill-routing affordances.
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
  "/api/auth/recover",
  "/api/auth/recovery-code",
  "/api/auth/password",
  "Utwórz konto właściciela",
  "Zaloguj się",
  "Zablokuj",
  "Wyloguj",
  "Hasło i recovery",
  "Odzyskaj konto kodem recovery",
  "Zapisz nowy kod recovery",
  "Wygeneruj nowy kod recovery",
  "Zmień hasło",

  // Explicit matter selection/creation; no silent automatic case creation.
  "— wybierz sprawę —",
  "Utwórz sprawę",
  "Sprawa jest zarchiwizowana",
  "Akta wybranej sprawy",
  "Dokumenty sprawy",
  "Katalog wspólny",
  "Wzory kancelarii",
  "Jeden wzór jest przechowywany raz",
  "integracja z generatorem w G35C",
  "Archiwum zapisane i rozpakowane lokalnie",
  "Akta sprawy, OCR i ręczna anonimizacja",

  // Provider configuration remains local and explicit.
  "Klucz API",
  "Zapisz w magazynie systemowym",

  // Existing privacy review pipeline remains reachable from the Files tab.
  "Anonimizuj / pseudonimizuj",
  "Pozostaw bez anonimizacji",
  "Oznacz, co ten fragment znaczy",
  "Chunki do analizy AI",
  "Domyślnie nic nie jest wysyłane do providera",

  // Chat-first product contract.
  "Czat",
  "Pliki",
  "Skille",
  "Ustawienia",
  "Napisz pytanie lub opisz zadanie prawne",
  "Dobieram skille, sprawdzam źródła",
  "DRAFT_PRESENTABLE",
  "BLOCKED",
  "Evidence:",

  // File picker + multi-file drag/drop.
  "+ Dodaj pliki",
  "Wybierz pliki z dysku",
  "Upuść tutaj pliki",
  "lub przeciągnij pliki w dowolne miejsce okna",
  "Przetwarzanie",
  "Przetworzono",

  // Mandatory and user-selectable skill routing.
  "Prawny router v3",
  "Shared",
  "Prawo polskie v2",
  "Automatyczny dobór",
  "Dodatkowe skille",
  "automatycznie sugerowany"
];

const exposed = forbidden.filter((token) => content.includes(token));
const missing = required.filter((token) => !content.includes(token));
const pass = exposed.length === 0 && missing.length === 0;

process.stdout.write(JSON.stringify({
  gate: "G14_G31AB_G32_G34AE_G35AB_P4B_LOCAL_WEB_UI",
  result: pass ? "PASS" : "BLOCKED",
  bundleFiles: files.length,
  forbiddenTokensFound: exposed,
  requiredExecutionMarkersMissing: missing,
  localApiReferencePresent: content.includes("127.0.0.1:4317"),
  sessionExecutionEndpointPresent: content.includes("/api/sessions/execute"),
  chatWorkspacePresent: content.includes("Dobieram skille, sprawdzam źródła"),
  fileDropPresent: content.includes("Upuść tutaj pliki"),
  mandatoryRouterPresent: content.includes("Prawny router v3"),
  mandatorySharedPresent: content.includes("Shared"),
  selectableSkillsPresent: content.includes("Dodatkowe skille")
}, null, 2) + "\n");

if (!pass) process.exitCode = 1;
