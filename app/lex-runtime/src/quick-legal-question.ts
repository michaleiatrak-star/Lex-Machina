import fs from "node:fs";
import path from "node:path";

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

const MAX_QUICK_CHARS = 320;
const MAX_QUICK_SENTENCES = 3;

const QUESTION_START =
  /^(?:czy|jak[a-ząćęłńóśźż]*|ile|kiedy|kto|komu|kogo|co|gdzie|dlaczego|czemu|jaki[a-ząćęłńóśźż]*|kt[oó]r[a-ząćęłńóśźż]*|w jakim|na jakiej|od kiedy|do kiedy|po ilu|ile lat|czym|z jakiego)\b/u;

// Tasks that need a workflow, documents or a long work product never take
// the quick lane, even when phrased as a question.
const WORK_PRODUCT =
  /\b(?:napisz|sporz[aą]d[zź]|przygotuj|zredaguj|popraw|przeanalizuj|oce[nń] (?:umow|pism|dokument|akt)|sprawd[zź] (?:umow|pism|dokument|akt)|raport|chronologi|dokument|za[lł][aą]cznik|akt[ay] sprawy|strategi|przes[lł]uchani|[sś]wiadk|sygnatur|\.docx)/iu;

export function normalizedQuestion(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A single short legal question without documents, drafting or analysis:
 * answerable from a few provisions.
 */
export function isQuickLegalQuestion(text: string): boolean {
  const question = normalizedQuestion(text);
  if (question.length < 12 || question.length > MAX_QUICK_CHARS) {
    return false;
  }
  if (/\n\s*\n/.test(text.trim())) return false;
  const sentences = question
    .split(/(?<=[.!?])\s+/)
    .filter((part) => part.trim());
  if (sentences.length > MAX_QUICK_SENTENCES) return false;
  if (WORK_PRODUCT.test(question)) return false;
  const lower = question.toLowerCase();
  return question.includes("?") || QUESTION_START.test(lower);
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
  "5. Forma: najpierw odpowiedź wprost (1-2 zdania), potem podstawa prawna, potem krótko: od czego zależy wynik i co zmieniłoby ocenę. Bez wstępów, maksymalnie ok. 250 słów.",
  "Odpowiadaj po polsku."
].join("\n");

export const QUICK_LOCAL_MAX_OUTPUT_TOKENS = 900;
export const QUICK_LOCAL_MAX_TOOL_ROUNDS = 3;
export const QUICK_LOCAL_TOOLS = new Set([
  "search_core_law",
  "read_core_law_article",
  "list_core_law_acts",
  "verify_legal_reference"
]);
