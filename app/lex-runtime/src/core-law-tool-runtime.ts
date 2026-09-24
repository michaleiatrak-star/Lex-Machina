import type {
  NormalizedToolCall,
  NormalizedToolResult,
  NormalizedToolSchema
} from "./providers/types.js";
import {
  normalizeForSearch,
  type CoreLawIndex
} from "./core-law-index.js";

const LIST_TOOL = "list_core_law_acts";
const SEARCH_TOOL = "search_core_law";
const READ_TOOL = "read_core_law_article";

const MAX_ARTICLE_CHARS = 20_000;
const MAX_SEARCH_HITS = 12;
const SNIPPET_CHARS = 320;

export type CoreLawAuditEvent = {
  tool: string;
  target: string;
  decision: "ALLOW" | "BLOCK";
  detail?: Record<string, unknown>;
};

const SCHEMAS: NormalizedToolSchema[] = [
  {
    type: "function",
    function: {
      name: LIST_TOOL,
      description:
        "List the core Polish acts (all acts named in the Lex domain act maps) held locally from the official ELI text, with ELI, title, status and article count.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          query: {
            type: "string",
            description: "Optional title/abbreviation filter, e.g. KSH, VAT, zamówień publicznych."
          },
          domain: {
            type: "string",
            description: "Optional DR skill name filter, e.g. dr-03-prawo-karne-wykroczenia-egzekucja."
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: SEARCH_TOOL,
      description:
        "Search the wording of the locally held core acts. Returns act ELI, article number and a snippet.",
      parameters: {
        type: "object",
        additionalProperties: false,
        required: ["query"],
        properties: {
          query: {
            type: "string",
            description: "Words that must occur in the article, e.g. 'zachowek uprawniony'."
          },
          act: {
            type: "string",
            description: "Optional act: ELI (DU/2025/383), 'Dz.U. 2025 poz. 383' or abbreviation (KK, KC, KSH)."
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: READ_TOOL,
      description:
        "Read the exact wording of one article of a core act from the locally held official ELI text.",
      parameters: {
        type: "object",
        additionalProperties: false,
        required: ["act", "article"],
        properties: {
          act: {
            type: "string",
            description: "ELI (DU/2025/383), 'Dz.U. 2025 poz. 383' or abbreviation/title (KK, KC, KSH, Kodeks spółek handlowych)."
          },
          article: {
            type: "string",
            description: "Article number, e.g. 148, 991, 17a."
          }
        }
      }
    }
  }
];

export class CoreLawToolRuntime {
  private readonly events: CoreLawAuditEvent[] = [];

  constructor(private readonly index: CoreLawIndex) {}

  schemas(): NormalizedToolSchema[] {
    return SCHEMAS;
  }

  handles(name: string): boolean {
    return name === LIST_TOOL || name === SEARCH_TOOL || name === READ_TOOL;
  }

  systemPromptAppendix(): string {
    const available = this.index
      .summaries()
      .filter((act) => act.articleCount > 0).length;
    return [
      "# RDZEŃ PRAWA (TEKSTY Z ELI)",
      `Lokalnie dostępne są oficjalne teksty aktów wskazanych w mapach dziedzinowych DR i prawo-polskie (${available} aktów z tekstem).`,
      "Dosłowne brzmienie przepisu bierz z read_core_law_article (albo search_core_law, gdy nie znasz numeru artykułu); nigdy nie cytuj przepisu z pamięci.",
      "Wynik podaje ELI, status aktu i datę pobrania. Jeśli mapa lub status wskazuje nowelizacje po tekście jednolitym, potwierdź aktualne brzmienie verify_legal_reference przed przedstawieniem go jako obowiązującego."
    ].join("\n");
  }

  auditEvents(): CoreLawAuditEvent[] {
    return this.events.map((event) => ({ ...event }));
  }

  async runTools(calls: NormalizedToolCall[]): Promise<NormalizedToolResult[]> {
    return calls.map((call) => {
      try {
        return { tool_use_id: call.id, content: this.execute(call) };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.events.push({
          tool: call.name,
          target: String(call.input.act ?? call.input.query ?? "core-law"),
          decision: "BLOCK",
          detail: { error: message }
        });
        return {
          tool_use_id: call.id,
          content: JSON.stringify({ status: "BLOCKED", error: message })
        };
      }
    });
  }

  private resolveAct(value: unknown) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("CORE_LAW_ACT_REQUIRED");
    }
    const ref = this.index.resolve(value);
    if (!ref) throw new Error("CORE_LAW_ACT_NOT_IN_MAPS");
    return ref;
  }

  private execute(call: NormalizedToolCall): string {
    if (call.name === LIST_TOOL) {
      const query =
        typeof call.input.query === "string"
          ? normalizeForSearch(call.input.query.trim())
          : "";
      const domain =
        typeof call.input.domain === "string" ? call.input.domain.trim() : "";
      const acts = this.index
        .summaries()
        .filter((act) => !domain || act.domains.includes(domain))
        .filter(
          (act) =>
            !query ||
            [act.eli, act.title ?? "", ...act.labels].some((name) =>
              normalizeForSearch(name).includes(query)
            )
        )
        .slice(0, 80)
        .map((act) => ({
          eli: act.eli,
          title: act.title,
          labels: act.labels.slice(0, 3),
          status: act.status,
          consolidatedText: act.consolidated,
          articles: act.articleCount,
          fetchedAt: act.fetchedAt,
          available: act.articleCount > 0 || act.textSource !== null
        }));
      this.events.push({
        tool: call.name,
        target: "core-law",
        decision: "ALLOW",
        detail: { returned: acts.length }
      });
      return JSON.stringify({ status: "OK", acts });
    }

    if (call.name === READ_TOOL) {
      const ref = this.resolveAct(call.input.act);
      const article = String(call.input.article ?? "")
        .replace(/^art\.?\s*/i, "")
        .trim()
        .toLowerCase();
      if (!article) throw new Error("CORE_LAW_ARTICLE_REQUIRED");
      const record = this.index.currentRecord(ref.eli);
      if (!record) throw new Error("CORE_LAW_TEXT_NOT_YET_DOWNLOADED");
      const text = record.articles[article];
      if (text === undefined) throw new Error("CORE_LAW_ARTICLE_NOT_FOUND");
      const amendmentsAfter =
        this.index.summary(ref.eli)?.amendmentsAfter ?? [];
      this.events.push({
        tool: call.name,
        target: `${ref.eli}:art.${article}`,
        decision: "ALLOW"
      });
      return JSON.stringify({
        status: "OK",
        eli: record.eli,
        title: record.title,
        actStatus: record.status,
        promulgation: record.promulgation,
        fetchedAt: record.fetchedAt,
        sourceUrl: record.sourceUrl,
        consolidatedText: ref.consolidated,
        ...(record.eli !== ref.eli
          ? {
              mapEli: ref.eli,
              newerConsolidatedText:
                `Mapa wskazuje ${ref.eli}; ELI ma nowszy tekst jednolity ${record.eli} i to jego brzmienie jest podane.`
            }
          : {}),
        amendmentsAfter,
        article,
        text: text.slice(0, MAX_ARTICLE_CHARS),
        truncated: text.length > MAX_ARTICLE_CHARS,
        mapNotes: ref.notes,
        warning:
          amendmentsAfter.length > 0
            ? `Po tym tekście jednolitym ogłoszono ${amendmentsAfter.length} nowelizację/nowelizacje (amendmentsAfter). Sprawdź, czy zmieniają ten artykuł (read_core_law_article z ELI nowelizacji albo verify_legal_reference), zanim przedstawisz brzmienie jako obowiązujące.`
            : "Brzmienie z najnowszego pobranego tekstu jednolitego. Jeśli mapNotes lub actStatus wskazują zmiany, potwierdź brzmienie verify_legal_reference przed przedstawieniem go jako obowiązującego."
      });
    }

    if (call.name === SEARCH_TOOL) {
      const terms = normalizeForSearch(String(call.input.query ?? ""))
        .split(/\s+/)
        .filter((term) => term.length > 1);
      if (terms.length === 0) throw new Error("CORE_LAW_QUERY_REQUIRED");
      const acts =
        call.input.act !== undefined && call.input.act !== ""
          ? [this.resolveAct(call.input.act)]
          : this.index.summaries().filter((act) => act.articleCount > 0);
      const hits: Array<{ eli: string; title: string; article: string; score: number; snippet: string }> = [];
      for (const act of acts) {
        const record = this.index.currentRecord(act.eli);
        if (!record) continue;
        for (const id of record.articleOrder) {
          const body = record.articles[id]!;
          const normalized = normalizeForSearch(body);
          if (!terms.every((term) => normalized.includes(term))) continue;
          const at = Math.max(0, normalized.indexOf(terms[0]!) - 80);
          hits.push({
            eli: record.eli,
            title: record.title,
            article: id,
            score: terms.reduce((sum, term) => sum + normalized.split(term).length - 1, 0),
            snippet: body.slice(at, at + SNIPPET_CHARS).replace(/\s+/g, " ")
          });
        }
      }
      hits.sort((a, b) => b.score - a.score);
      this.events.push({
        tool: call.name,
        target: "core-law",
        decision: "ALLOW",
        detail: { hits: hits.length }
      });
      return JSON.stringify({
        status: hits.length > 0 ? "OK" : "NO_HITS",
        hits: hits.slice(0, MAX_SEARCH_HITS).map(({ score: _score, ...hit }) => hit)
      });
    }

    throw new Error("UNKNOWN_CORE_LAW_TOOL");
  }
}
