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
  "/workspace/thread",
  "/workspace/folders",
  "/preview",
  "/open",
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
  "1 wątek = 1 sprawa",
  "Wątki / sprawy",
  "Nazwa sprawy",
  "Sygnatura nie jest wymagana",
  "ID katalogu:",
  "Automatyczny — dobierz skille wykonawcze",
  "priorytetowych skilli wykonawczych",
  "współpracować np. z chronologią",
  "kilka dziedzin prawa",
  "prawny-router-v3",
  "shared",
  "Dodatkowe skille i dziedziny",
  "Archiwizuj sprawę",
  "Przywróć z archiwum",
  "Trwałe usunięcie sprawy",
  "Wpisz USUŃ",
  "Usuń sprawę trwale",
  "ARCHIWALNA (tylko odczyt)",
  "Kliknij lub przeciągnij pliki",
  "Otwórz eksplorator",
  "Struktura katalogów",
  "Główny katalog",
  "+ Folder",
  "Podgląd",
  "Otwórz w systemie",
  "Usuń",
  "Foldery są logiczną, szyfrowaną strukturą workspace",
  "Know-how i wzory kancelarii",
  "Know-how kancelarii",
  "Dodaj wiedzę / dokument",
  "OCR automatyczny i anonimizacja per plik",
  "Zdjęcia są od razu kierowane do lokalnego OCR",
  "Decyzja prywatności dla",
  "Anonimizuj / pseudonimizuj automatycznie",
  "Przejrzyj ręcznie",
  "Pozostaw ten plik bez anonimizacji",
  "Ta decyzja jest na razie wersją roboczą dla tego pliku",
  "Zbiorczy podgląd anonimizacji",
  "Wykryte automatycznie",
  "Moje ręczne zaznaczenia",
  "Końcowa decyzja dla pliku",
  "Zatwierdź decyzje dla",
  "Mapy reidentyfikacji pozostają odrębne dla każdego documentId",
  "Chunki do analizy AI",
  "Cytowany fragment dokumentu",
  "Przejdź do cytowanego fragmentu",
  "Dokładny cytat zaznaczony w źródle",
  "źródłowego chunka",
  "DRAFT_PRESENTABLE",
  "HARD GATE",
  "Źródła i weryfikacja",
  "VERIFIED",
  "SUPPORTED",
  "Otwórz źródło w przeglądarce",
  "Model i klucz API",
  "otwórz w przeglądarce",
  "Konfiguracja lokalna"
];

const exposed = forbidden.filter((token) => content.includes(token));
const missing = required.filter((token) => !content.includes(token));
const pass = exposed.length === 0 && missing.length === 0;

process.stdout.write(JSON.stringify({
  gate: "G14_MATTER_CHAT_WORKSPACE_DOCUMENT_DEEP_LINK_UI",
  result: pass ? "PASS" : "BLOCKED",
  bundleFiles: files.length,
  forbiddenTokensFound: exposed,
  requiredExecutionMarkersMissing: missing,
  localApiReferencePresent: content.includes("127.0.0.1:4317"),
  sessionExecutionEndpointPresent: content.includes("/api/sessions/execute"),
  oneThreadOneCasePresent:
    content.includes("1 wątek = 1 sprawa") &&
    content.includes("/workspace/thread"),
  multiSkillRoutingPresent:
    content.includes("współpracować np. z chronologią") &&
    content.includes("kilka dziedzin prawa"),
  workspaceLifecyclePresent:
    content.includes("Struktura katalogów") &&
    content.includes("Otwórz w systemie") &&
    content.includes("+ Folder"),
  automaticOcrPerFilePrivacyPresent:
    content.includes("OCR automatyczny i anonimizacja per plik") &&
    content.includes("Ta decyzja jest na razie wersją roboczą dla tego pliku") &&
    content.includes("Anonimizuj / pseudonimizuj automatycznie") &&
    content.includes("Mapy reidentyfikacji pozostają odrębne dla każdego documentId"),
  multiFilePrivacyBatchPreviewPresent:
    content.includes("Zbiorczy podgląd anonimizacji") &&
    content.includes("Wykryte automatycznie") &&
    content.includes("Moje ręczne zaznaczenia") &&
    content.includes("Końcowa decyzja dla pliku") &&
    content.includes("Zatwierdź decyzje dla"),
  documentDeepLinksPresent:
    content.includes("Cytowany fragment dokumentu") &&
    content.includes("Dokładny cytat zaznaczony w źródle"),
  browserLinksPresent:
    content.includes("Otwórz źródło w przeglądarce") &&
    content.includes("otwórz w przeglądarce"),
  caseLifecyclePresent:
    content.includes("Archiwizuj sprawę") &&
    content.includes("Usuń sprawę trwale"),
  verificationUiPresent:
    content.includes("Źródła i weryfikacja") &&
    content.includes("VERIFIED") &&
    content.includes("SUPPORTED")
}, null, 2) + "\n");

if (!pass) process.exitCode = 1;