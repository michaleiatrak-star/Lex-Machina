import fs from "node:fs";
import path from "node:path";
const TEXT_FILE = /\.(md|txt|json|ya?ml|csv)$/i;
// Packaging and history files: no legal content for the model.
const NOISE = /(^|\/)(agents\/|CHANGELOG\.md$|PORTABILITY-MANIFEST\.md$)/i;
const fileCache = new Map();
/** Every text file of a skill, relative to its folder (SKILL.md first), cached. */
export function skillFiles(directory) {
    const cached = fileCache.get(directory);
    if (cached)
        return cached;
    const files = [];
    const walk = (dir, depth) => {
        if (depth > 6)
            return;
        let entries = [];
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        }
        catch {
            return;
        }
        for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
            if (entry.name.startsWith("."))
                continue;
            const full = path.join(dir, entry.name);
            if (entry.isDirectory())
                walk(full, depth + 1);
            else if (TEXT_FILE.test(entry.name)) {
                const relative = path.relative(directory, full).split(path.sep).join("/");
                if (!NOISE.test(relative))
                    files.push(relative);
            }
        }
    };
    walk(directory, 0);
    files.sort((a, b) => (a === "SKILL.md" ? -1 : b === "SKILL.md" ? 1 : a.localeCompare(b)));
    fileCache.set(directory, files);
    return files;
}
function oneLine(value, max) {
    const text = String(value ?? "").replace(/\s+/g, " ").trim();
    return text.length > max ? `${text.slice(0, max)}…` : text;
}
/**
 * What the model can use in this turn and where it is: the files of every
 * active skill (modules, references, shared parts), the other skills, the
 * official texts in the local core-law index and the tools. Local models get
 * a short version (simplified mode); hosted models get the full file lists.
 */
export function knowledgeMapPrompt(args) {
    const fileLimit = args.local ? 12 : 150;
    const readHow = args.nativeFiles
        ? "Read <folder>/<plik> (katalog roboczy to korpus skilli)"
        : args.toolNames.has("read_legal_resource")
            ? 'read_legal_resource skill=<nazwa> path=<plik>'
            : null;
    const active = [...new Set(args.activeSkills)].filter((name) => args.registry.get(name));
    const lines = [
        args.local ? "# MAPA WIEDZY (tryb uproszczony)" : "# MAPA WIEDZY - co masz dostępne w tej sesji",
        "Korzystaj z tych zasobów w całości: gdy skill odsyła do modułu, referencji lub pliku shared, przeczytaj go, zamiast odpowiadać z pamięci."
    ];
    if (active.length)
        lines.push("", "## Skille aktywne w tej turze (pełne foldery)");
    for (const name of active) {
        const skill = args.registry.get(name);
        const folder = path.basename(skill.directory);
        const files = skillFiles(skill.directory).filter((file) => file !== "SKILL.md");
        const shown = files.slice(0, fileLimit);
        lines.push(`- ${name} (${folder}/): ${files.length} ${files.length === 1 ? "plik" : "plików"} poza SKILL.md` +
            (shown.length ? `: ${shown.join(", ")}${files.length > shown.length ? `, … (+${files.length - shown.length})` : ""}` : ""));
    }
    if (readHow)
        lines.push(`Odczyt plików skilli: ${readHow}.`);
    const others = args.catalog === false ? [] : [...args.registry.skills.values()]
        .filter((skill) => !active.includes(skill.name))
        .sort((a, b) => a.name.localeCompare(b.name));
    if (others.length) {
        lines.push("", "## Pozostałe skille w korpusie");
        if (args.local) {
            lines.push(others.map((skill) => skill.name).join(", "));
        }
        else {
            for (const skill of others) {
                lines.push(`- ${skill.name} (${skillFiles(skill.directory).length} plików) :: ${oneLine(skill.frontmatter.description, 140)}`);
            }
        }
    }
    const acts = (args.coreLaw ?? []).filter((act) => act.articleCount > 0);
    if (acts.length) {
        const domains = new Set(active.filter((name) => name.startsWith("dr-")).map((name) => name.slice(0, 5)));
        const relevant = args.local
            ? acts.filter((act) => act.domains.some((domain) => domains.has(domain.slice(0, 5)))).slice(0, 15)
            : acts;
        lines.push("", `## Rdzeń aktów prawnych (lokalnie, teksty z ELI): ${acts.length} aktów`, ...relevant.map((act) => `- ${act.labels[0] ?? oneLine(act.title, 80)} (${act.eli}, ${act.articleCount} art.)`), ...(args.local && relevant.length < acts.length ? [`… oraz ${acts.length - relevant.length} innych aktów.`] : []), args.toolNames.has("read_core_law_article")
            ? "Brzmienie przepisu: read_core_law_article / search_core_law; aktualność: verify_legal_reference."
            : "Brzmienie przepisu bierz z tych tekstów lub weryfikacji ELI, nigdy z pamięci.");
    }
    const groups = [
        ["weryfikacja przepisów i orzeczeń", ["verify_legal_reference", "verify_case_reference", "verify_case_quote", "verify_case_proposition"]],
        ["orzecznictwo (SAOS, CBOSA, SN)", ["search_case_law"]],
        ["źródła federacyjne MCP (ISAP, EUR-Lex, KRS i inne)", ["list_federated_legal_sources", "search_federated_legal_sources", "get_federated_legal_document", "call_federated_legal_source"]],
        ["wyszukiwanie w internecie", ["web_search"]]
    ];
    const available = groups.filter(([, names]) => names.some((name) => args.toolNames.has(name)));
    if (available.length) {
        lines.push("", "## Narzędzia", ...available.map(([label, names]) => `- ${label}: ${names.filter((name) => args.toolNames.has(name)).join(", ")}`));
    }
    return lines.join("\n");
}
