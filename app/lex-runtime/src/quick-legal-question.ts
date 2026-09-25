import fs from "node:fs";
import path from "node:path";
import { assessMatterComplexity } from "./matter-complexity.js";

/**
 * Quick legal questions on local models.
 *
 * A local 11-12B model reads its prompt on the user's CPU. A short question
 * ("czy kradzież 600 zł to przestępstwo czy wykroczenie?") used to pay for the
 * full legal profile: ~25k characters of skill digests, knowledge map, tool
 * schemas and the whole criminal-qualifier index, then tool rounds reading
 * an 18k-character qualifier part - about ten minutes on CPU.
 *
 * The quick lane keeps every rule that decides the answer and drops what a
 * one-question answer does not use:
 * - routing: domains only (no execution skills), short descriptions
 * - provisions: the core-law retrieval (official ELI texts) in the prompt
 * - criminal matters: the runtime walks the qualifier index and passes the
 *   matching decision-tree nodes ("Karne: +kwalifikator")
 * - core-law tools only, at most two tool rounds, bounded answer length
 */

/**
 * A short single legal question: the SIMPLE level of the entry gate
 * (matter-complexity.ts) for a message without documents or workflow.
 */
export function isQuickLegalQuestion(text: string): boolean {
  return assessMatterComplexity({ query: text }).level === "SIMPLE";
}

const STOPWORDS = new Set([
  "czy", "jest", "jako", "albo", "oraz", "przez", "ktory", "która", "które",
  "który", "jaka", "jaki", "jakie", "tego", "temu", "tylko", "mnie", "moje",
  "moja", "mój", "jeśli", "jezeli", "jeżeli", "kiedy", "gdzie", "sprawa",
  "sprawy", "złotych", "zlotych", "prawo", "prawa", "polsce", "można", "mozna"
]);

function stems(text: string): Set<string> {
  const words =
    text
      .toLowerCase()
      .normalize("NFKC")
      .match(/[a-ząćęłńóśźż]{4,}/gu) ?? [];
  return new Set(
    words
      .filter((word) => !STOPWORDS.has(word))
      .map((word) => word.slice(0, 5))
  );
}

function articleRefs(text: string): Set<string> {
  return new Set(
    [...text.matchAll(/\bart\.?\s*(\d{1,3}[a-z]?)/giu)].map((match) =>
      match[1]!.toLowerCase()
    )
  );
}

type QualifierSection = {
  file: string;
  heading: string;
  text: string;
  order: number;
};

function qualifierSections(partsDirectory: string): QualifierSection[] {
  let files: string[];
  try {
    files = fs
      .readdirSync(partsDirectory)
      .filter((name) => /^part-\d+.*\.md$/i.test(name))
      .sort();
  } catch {
    return [];
  }
  const sections: QualifierSection[] = [];
  for (const file of files) {
    const body = fs.readFileSync(path.join(partsDirectory, file), "utf8");
    // Decision-tree nodes are "###" sections; a "##" block heading starts a
    // new block and is kept with its first node.
    const parts = body.split(/\r?\n(?=#{2,3}\s)/);
    for (const text of parts) {
      const heading = text.split(/\r?\n/, 1)[0]!.replace(/^#+\s*/, "").trim();
      const body = text.replace(/^[^\n]*\n?/, "").replace(/[-\s]/g, "");
      if (body.length < 80) continue;
      sections.push({ file, heading, text: text.trim(), order: sections.length });
    }
  }
  return sections;
}

export type QualifierExcerpt = {
  files: string[];
  nodes: string[];
  text: string;
};

/**
 * Walks the criminal-qualifier parts the way its index instructs (read only
 * the matching part) and returns the decision-tree nodes that match the
 * question, in document order, within a character budget.
 */
export function criminalQualifierExcerpt(
  partsDirectory: string,
  question: string,
  maxChars = 4_200
): QualifierExcerpt | null {
  const queryStems = stems(question);
  const queryArticles = articleRefs(question);
  if (queryStems.size === 0 && queryArticles.size === 0) return null;

  const scored = qualifierSections(partsDirectory)
    .map((section) => {
      const sectionStems = stems(section.text);
      const headingStems = stems(section.heading);
      let score = 0;
      for (const stem of queryStems) {
        if (headingStems.has(stem)) score += 3;
        else if (sectionStems.has(stem)) score += 1;
      }
      for (const article of articleRefs(section.text)) {
        if (queryArticles.has(article)) score += 3;
      }
      // Tree nodes answer qualification questions; long reference tables
      // and audit notes do not.
      if (/DRZEWO|WĘZEŁ|WEZEL|TABELA POR/iu.test(section.heading)) score += 1;
      return { section, score };
    })
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score || a.section.order - b.section.order);

  const chosen: QualifierSection[] = [];
  let used = 0;
  for (const { section } of scored) {
    const text =
      section.text.length > 2_600
        ? section.text.slice(0, 2_600) + "\n[…]"
        : section.text;
    if (used + text.length > maxChars) continue;
    chosen.push({ ...section, text });
    used += text.length;
    if (chosen.length >= 3) break;
  }
  if (chosen.length === 0) return null;
  chosen.sort((a, b) => a.order - b.order);
  return {
    files: [...new Set(chosen.map((section) => section.file))],
    nodes: chosen.map((section) => section.heading),
    text: chosen
      .map((section) => `## ${section.file} — ${section.heading}\n\n${section.text.replace(/^#{2,3}[^\n]*\n?/, "")}`)
      .join("\n\n")
  };
}

/** The qualifier's own binding rules, without its navigation table. */
export function qualifierPrinciples(indexText: string): string {
  const principle =
    /## ZASADA NACZELNA([\s\S]*?)\n---/u.exec(indexText)?.[1]?.trim() ?? "";
  return [
    principle,
    "> Wartość liczbowa (próg kwotowy, granica kary, termin) z kwalifikatora nie jest źródłem: podaj ją tylko wtedy, gdy potwierdza ją tekst aktu z ELI w tej odpowiedzi (KROK 0-CROSS)."
  ]
    .filter(Boolean)
    .join("\n");
}

export const QUICK_LEGAL_RULES = [
  "# LEX MACHINA — SZYBKA ODPOWIEDŹ PRAWNA (model lokalny)",
  "Router v3 zakwalifikował wiadomość jako jedno krótkie pytanie prawne bez dokumentów i bez pisma. Odpowiedz zwięźle i konkretnie.",
  "Zasady (HARD GATE):",
  "1. Brzmienie przepisów, progi kwotowe i zagrożenia karą bierz wyłącznie z tekstów aktów z ELI podanych niżej albo z read_core_law_article / search_core_law. Nigdy z pamięci. Jeśli teksty nie wystarczają, wywołaj narzędzie; jeśli nadal brak podstawy, powiedz to wprost.",
  "2. Przy każdym przepisie podaj akt, artykuł i ELI.",
  "3. Sprawa karna lub wykroczeniowa: przejdź przez podane węzły kwalifikatora karnomaterialnego, pytanie po pytaniu, zanim wskażesz kwalifikację. Wskaż okoliczności, które zmieniłyby kwalifikację (np. włamanie, przemoc, czyn ciągły).",
  "4. Orzeczenia NSA/WSA z CBOSA pozostają snapshotem bez awansu; brak trafień = OUT_OF_SCOPE. W tej odpowiedzi nie powołuj orzeczeń, których nie zweryfikowano.",
  "5. Nie podawaj pozycji Dz.U., adresów URL ani dat nowelizacji, których nie ma w tekstach lub wynikach narzędzi z tej rozmowy. Nie pisz, że coś zweryfikowałeś narzędziem, jeśli go nie wywołałeś.",
  "6. Gdy rdzeń aktów nie wystarcza, użyj źródeł MCP (search_federated_legal_sources, get_federated_legal_document: ISAP/ELI, EUR-Lex i inne); to materiał do odczytu, weryfikację brzmienia robi verify_legal_reference.",
  "7. Forma: najpierw odpowiedź wprost (1-2 zdania), potem podstawa prawna, potem krótko: od czego zależy wynik i co zmieniłoby ocenę. Bez wstępów, maksymalnie ok. 250 słów.",
  "Odpowiadaj wyłącznie po polsku. Nie pokazuj swojego rozumowania ani planu - tylko odpowiedź."
].join("\n");

export const QUICK_LOCAL_MAX_OUTPUT_TOKENS = 900;
export const QUICK_LOCAL_MAX_TOOL_ROUNDS = 3;
export const QUICK_LOCAL_TOOLS = new Set([
  "search_core_law",
  "read_core_law_article",
  "list_core_law_acts",
  "verify_legal_reference",
  "list_federated_legal_sources",
  "search_federated_legal_sources",
  "get_federated_legal_document",
  "call_federated_legal_source"
]);

/**
 * "Przepisy przez ELI, nigdy z pamięci" enforced for the quick lane: every
 * article the answer cites must have been given to the model in this turn -
 * in the retrieved ELI texts or by a core-law read / legal-reference
 * verification. Matching is by article number (acts are not resolved from
 * free text), so this catches provisions the model had no text for.
 */
export function citedArticles(text: string): string[] {
  return [
    ...new Set(
      [...text.matchAll(/\bart(?:yku[lł]\w*|\.)?\s*(\d{1,4}[a-z]?)\b/giu)].map((match) =>
        match[1]!.toLowerCase()
      )
    )
  ];
}

export function sourcedArticlesFromPrompt(prompt: string): string[] {
  return [
    ...prompt.matchAll(/^\[[^\]]+\][^\n]*— art\. (\S+)$/gmu)
  ].map((match) => match[1]!.toLowerCase());
}

export function sourcedArticlesFromToolResult(
  name: string,
  content: string
): string[] {
  let value: Record<string, unknown>;
  try {
    value = JSON.parse(content) as Record<string, unknown>;
  } catch {
    return [];
  }
  if (name === "read_core_law_article" && value.status === "OK" && typeof value.article === "string") {
    return [value.article.toLowerCase()];
  }
  if (
    name === "verify_legal_reference" &&
    (value.status === "VERIFIED" || value.status === "SUPPORTED") &&
    typeof value.claim === "string"
  ) {
    return citedArticles(value.claim);
  }
  return [];
}

export function unsourcedArticles(
  answer: string,
  sourced: ReadonlySet<string>
): string[] {
  return citedArticles(answer).filter((article) => !sourced.has(article));
}

const QUICK_TOOL_NAMES = [
  "read_core_law_article",
  "search_core_law",
  "list_core_law_acts",
  "verify_legal_reference",
  "list_federated_legal_sources",
  "search_federated_legal_sources",
  "get_federated_legal_document",
  "call_federated_legal_source"
];

function journalKey(year: string, position: string): string {
  return `${year}/${Number(position)}`;
}

/** "Dz.U. 2022 poz. 2151", "Dz. U. z 2025 r. poz. 734" -> "2022/2151". */
export function citedJournals(text: string): string[] {
  return [
    ...new Set(
      [...text.matchAll(/Dz\.?\s*U\.?\s*(?:z\s+)?(\d{4})\s*(?:r\.?)?\s*(?:nr\s*\d+\s*)?,?\s*poz\.?\s*(\d+)/giu)].map(
        (match) => journalKey(match[1]!, match[2]!)
      )
    )
  ];
}

function elisIn(text: string): string[] {
  return [...text.matchAll(/\bDU\/(\d{4})\/(\d+)\b/gi)].map((match) =>
    journalKey(match[1]!, match[2]!)
  );
}

function urlsIn(text: string): string[] {
  return [...text.matchAll(/https?:\/\/[^\s)\]>"'<,]+/gi)].map((match) =>
    match[0].replace(/[.;:!?]+$/, "")
  );
}

/**
 * What the local model received in this turn (retrieved ELI texts and tool
 * results). An answer may cite an article, a Dz.U. position, a URL or a tool
 * only when it is backed here; the finalization gate then still requires
 * VERIFIED ELI records for every citation.
 */
export class QuickLaneSources {
  private readonly articles = new Set<string>();
  private readonly journals = new Set<string>();
  private readonly urls = new Set<string>();
  private readonly toolsCalled = new Set<string>();

  addPrompt(prompt: string): void {
    for (const article of sourcedArticlesFromPrompt(prompt)) this.articles.add(article);
    for (const journal of elisIn(prompt)) this.journals.add(journal);
    for (const url of urlsIn(prompt)) this.urls.add(url);
  }

  addToolResult(name: string, content: string): void {
    this.toolsCalled.add(name);
    let ok = true;
    try {
      const value = JSON.parse(content) as Record<string, unknown>;
      ok = value.status !== "BLOCKED" && value.error === undefined;
    } catch {
      // Federated documents may be plain text.
    }
    if (!ok) return;
    for (const article of sourcedArticlesFromToolResult(name, content)) this.articles.add(article);
    if (name === "get_federated_legal_document" || name === "call_federated_legal_source") {
      for (const match of content.matchAll(/\bArt\.\s*(\d{1,4}[a-z]?)\./g)) {
        this.articles.add(match[1]!.toLowerCase());
      }
    }
    for (const journal of elisIn(content)) this.journals.add(journal);
    for (const url of urlsIn(content)) this.urls.add(url);
  }

  get articleCount(): number {
    return this.articles.size;
  }

  /** Human-readable references in the answer that nothing in this turn backs. */
  unsourced(answer: string): string[] {
    const missing: string[] = [];
    for (const article of citedArticles(answer)) {
      if (!this.articles.has(article)) missing.push(`art. ${article}`);
    }
    for (const journal of citedJournals(answer)) {
      if (!this.journals.has(journal)) {
        const [year, position] = journal.split("/");
        missing.push(`Dz.U. ${year} poz. ${position}`);
      }
    }
    for (const url of urlsIn(answer)) {
      const backed =
        [...this.urls].some((known) => url.startsWith(known) || known.startsWith(url)) ||
        (/^https:\/\/(?:api|isap)\.sejm\.gov\.pl\//i.test(url) &&
          elisIn(url.replace(/%2F/gi, "/")).some((journal) => this.journals.has(journal)));
      if (!backed) missing.push(url);
    }
    for (const tool of QUICK_TOOL_NAMES) {
      if (answer.includes(tool) && !this.toolsCalled.has(tool)) {
        missing.push(`narzędzie ${tool} (nie zostało użyte w tej odpowiedzi)`);
      }
    }
    return missing;
  }
}
