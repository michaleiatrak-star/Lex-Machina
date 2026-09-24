import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  CoreLawIndex,
  extractCoreActs,
  htmlToText,
  splitArticles
} from "../src/core-law-index.js";
import { CoreLawToolRuntime, coreLawRetrievalPrompt } from "../src/core-law-tool-runtime.js";

const roots: string[] = [];

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

function corpus(): string {
  const root = tempDir("lex-core-corpus-");
  fs.mkdirSync(path.join(root, "dr-03-karne"));
  fs.writeFileSync(
    path.join(root, "dr-03-karne", "MAPA-AKTOW.md"),
    [
      "**Baza KK:** Dz.U. 2025 poz. 383 t.j. ✅",
      "⛔ KROK 2C: nowelizacje po tekście jednolitym — Dz.U. 2026 poz. 421, 638, 2026 poz. 901.",
      "| Kodeks wykroczeń | Dz.U. 2025 poz. 734 t.j. ze zm. | `mod-KW` | ✅ |",
      "| Stary akt | poprzedni t.j. 2016.283 NIEAKTUALNY | x | x |"
    ].join("\n")
  );
  fs.mkdirSync(path.join(root, "prawo-polskie-v2"));
  fs.writeFileSync(
    path.join(root, "prawo-polskie-v2", "ROUTING-MAP.md"),
    "| Konstytucja RP | Dz.U. 1997 nr 78 poz. 483 | x | x |\n"
  );
  return root;
}

const KK_HTML =
  "<html><head><style>x{}</style></head><body><p>Art. 1. § 1. Odpowiedzialności karnej podlega ten tylko, kto popełnia czyn zabroniony.</p>" +
  "<p>Art. 148. § 1. Kto zabija człowieka,</p><p>podlega karze pozbawienia wolności&nbsp;na czas nie krótszy od lat 10.</p>" +
  "<p>Art. 148a. § 1. Kto zabija człowieka ze szczególnym okrucieństwem</p></body></html>";

function fakeEli(options: { deny?: boolean; references?: Record<string, unknown> } = {}) {
  const requested: string[] = [];
  const fetcher = async (url: string) => {
    requested.push(url);
    if (options.deny) return new Response("", { status: 403 });
    const references = /\/acts\/(DU\/\d+\/\d+)\/references$/.exec(url);
    if (references) return Response.json(options.references?.[references[1]!] ?? {});
    if (url.endsWith("/DU/2026/1500")) {
      return Response.json({ title: "Obwieszczenie — Kodeks karny (nowszy t.j.)", textHTML: true });
    }
    if (url.endsWith("/DU/2026/1500/text.html")) {
      return new Response("<p>Art. 148. § 1. Kto zabija człowieka, podlega karze w nowym brzmieniu.</p>");
    }
    if (url.endsWith("/DU/2025/383")) {
      return Response.json({ title: "Obwieszczenie — Kodeks karny", status: "akt jednorazowy", textHTML: true, textPDF: true });
    }
    if (url.endsWith("/DU/2025/383/text.html")) return new Response(KK_HTML);
    if (url.endsWith("/DU/2025/734")) {
      return Response.json({ title: "Kodeks wykroczeń", status: "obowiązujący", textHTML: false, textPDF: true });
    }
    if (url.endsWith("/DU/2025/734/text.pdf")) return new Response(new Uint8Array([1, 2, 3]));
    return Response.json({ title: "Inny akt", textHTML: false, textPDF: false });
  };
  const pdf = {
    extract: async () => ({
      text: "Art. 51. § 1. Kto krzykiem, hałasem zakłóca spokój,\npodlega karze aresztu.",
      pages: 1,
      truncated: false
    })
  };
  return { fetcher, pdf, requested };
}

describe("core law index", () => {
  it("collects every Dz.U. act from the domain maps and the routing map", () => {
    const acts = extractCoreActs(corpus());
    expect(acts.map((act) => act.eli)).toEqual([
      "DU/2025/383",
      "DU/2025/734",
      "DU/1997/483",
      "DU/2026/421",
      "DU/2026/638",
      "DU/2026/901"
    ]);
    const kk = acts[0]!;
    expect(kk.consolidated).toBe(true);
    expect(kk.labels).toEqual(["KK"]);
    // Shorthand references to superseded texts are not treated as core acts.
    expect(acts.some((act) => act.eli === "DU/2016/283")).toBe(false);
  });

  it("turns ELI HTML into text and splits articles", () => {
    const { order, articles } = splitArticles(htmlToText(KK_HTML));
    expect(order).toEqual(["1", "148", "148a"]);
    expect(articles["148"]).toBe(
      "Art. 148. § 1. Kto zabija człowieka,\npodlega karze pozbawienia wolności na czas nie krótszy od lat 10."
    );
  });

  it("downloads HTML and PDF texts, then serves articles to every model", async () => {
    const eli = fakeEli();
    const index = new CoreLawIndex(tempDir("lex-core-store-"), eli.fetcher as never, eli.pdf as never, () => Date.parse("2026-09-23T12:00:00Z"), 0);
    index.load(corpus());
    await index.refresh();

    const tools = new CoreLawToolRuntime(index);
    const [kk, kw, search, missing] = await tools.runTools([
      { id: "1", name: "read_core_law_article", input: { act: "KK", article: "148" } },
      { id: "2", name: "read_core_law_article", input: { act: "Dz.U. 2025 poz. 734", article: "art. 51" } },
      { id: "3", name: "search_core_law", input: { query: "zabija czlowieka" } },
      { id: "4", name: "read_core_law_article", input: { act: "KK", article: "999" } }
    ]);
    expect(JSON.parse(kk!.content)).toMatchObject({
      status: "OK",
      eli: "DU/2025/383",
      consolidatedText: true,
      text: expect.stringContaining("Kto zabija człowieka"),
      mapNotes: [expect.stringContaining("Baza KK")]
    });
    expect(JSON.parse(kw!.content)).toMatchObject({
      status: "OK",
      title: "Kodeks wykroczeń",
      text: expect.stringContaining("zakłóca spokój")
    });
    expect(JSON.parse(search!.content).hits.map((hit: { article: string }) => hit.article).sort()).toEqual(["148", "148a"]);
    // Ranked, and inflected question words still find the article.
    expect(index.search("zabił człowieka ze szczególnym okrucieństwem")[0]).toMatchObject({ article: "148a" });
    expect(index.search("kara za zakłócanie spokoju krzykiem")[0]).toMatchObject({ eli: "DU/2025/734", article: "51" });
    // Local models get the best articles in the prompt; small talk gets none.
    const rag = coreLawRetrievalPrompt(index, "Czy [PII:PERSON:0001|NOM] zakłócał spokój krzykiem i hałasem?");
    expect(rag).toContain("[DU/2025/734] Kodeks wykroczeń — art. 51");
    expect(rag).not.toContain("PII:");
    expect(coreLawRetrievalPrompt(index, "Napisz ok")).toBeNull();
    expect(JSON.parse(missing!.content)).toEqual({ status: "BLOCKED", error: "CORE_LAW_ARTICLE_NOT_FOUND" });
  });

  const DAY = 25 * 60 * 60 * 1000;

  async function downloadedIndex(store: string, start: number) {
    const eli = fakeEli();
    const index = new CoreLawIndex(store, eli.fetcher as never, eli.pdf as never, () => start, 0);
    index.load(corpus());
    await index.refresh();
    return eli;
  }

  function later(store: string, now: number, options: Parameters<typeof fakeEli>[0]) {
    const eli = fakeEli(options);
    const index = new CoreLawIndex(store, eli.fetcher as never, eli.pdf as never, () => now, 0);
    index.load(corpus());
    return { eli, index };
  }

  it("downloads each text once and afterwards only checks ELI relations", async () => {
    const store = tempDir("lex-core-store-");
    const start = Date.parse("2026-09-23T12:00:00Z");
    const first = await downloadedIndex(store, start);
    expect(first.requested.filter((url) => url.endsWith("/references"))).toEqual([]);

    const { eli, index } = later(store, start + DAY, {});
    await index.refresh();
    // Only the consolidated texts are checked, and only their relations.
    expect(eli.requested).toEqual([
      "https://api.sejm.gov.pl/eli/acts/DU/2025/383/references",
      "https://api.sejm.gov.pl/eli/acts/DU/2025/734/references"
    ]);

    await index.refresh();
    expect(eli.requested).toHaveLength(2);
  });

  it("downloads a new amendment on its own and flags it on the article", async () => {
    const store = tempDir("lex-core-store-");
    const start = Date.parse("2026-09-23T12:00:00Z");
    await downloadedIndex(store, start);

    const { eli, index } = later(store, start + DAY, {
      references: {
        "DU/2025/383": {
          "Nowelizacje po tekście jednolitym": [
            { act: { ELI: "DU/2026/999", title: "Ustawa o zmianie ustawy — Kodeks karny", promulgation: "2026-09-20" } }
          ]
        }
      }
    });
    await index.refresh();
    expect(eli.requested).toContain("https://api.sejm.gov.pl/eli/acts/DU/2026/999");
    expect(eli.requested).not.toContain("https://api.sejm.gov.pl/eli/acts/DU/2025/383/text.html");

    const [read] = await new CoreLawToolRuntime(index).runTools([
      { id: "1", name: "read_core_law_article", input: { act: "KK", article: "148" } }
    ]);
    expect(JSON.parse(read!.content)).toMatchObject({
      eli: "DU/2025/383",
      amendmentsAfter: [{ eli: "DU/2026/999", title: "Ustawa o zmianie ustawy — Kodeks karny" }],
      warning: expect.stringContaining("nowelizac")
    });
  });

  it("replaces the copy when ELI publishes a newer consolidated text", async () => {
    const store = tempDir("lex-core-store-");
    const start = Date.parse("2026-09-23T12:00:00Z");
    await downloadedIndex(store, start);

    const { index } = later(store, start + DAY, {
      references: {
        "DU/2025/383": {
          "Tekst jednolity dla aktu": [{ act: { ELI: "DU/1997/553" } }]
        },
        "DU/1997/553": {
          "Inf. o tekście jednolitym": [
            { act: { ELI: "DU/2025/383", status: "akt objęty tekstem jednolitym" } },
            { act: { ELI: "DU/2026/1500", status: "obowiązujący" } }
          ]
        }
      }
    });
    await index.refresh();

    const [read] = await new CoreLawToolRuntime(index).runTools([
      { id: "1", name: "read_core_law_article", input: { act: "KK", article: "148" } }
    ]);
    expect(JSON.parse(read!.content)).toMatchObject({
      eli: "DU/2026/1500",
      mapEli: "DU/2025/383",
      text: expect.stringContaining("w nowym brzmieniu"),
      amendmentsAfter: []
    });
  });

  it("keeps the texts it has when ELI refuses access", async () => {
    const store = tempDir("lex-core-store-");
    const start = Date.parse("2026-09-23T12:00:00Z");
    await downloadedIndex(store, start);

    const { eli, index } = later(store, start + DAY, { deny: true });
    await index.refresh();
    expect(eli.requested).toHaveLength(2);
    expect(index.summary("DU/2025/383")).toMatchObject({ articleCount: 3, lastError: "ELI_HTTP_403" });
    expect(index.currentRecord("DU/2025/383")!.articles["148"]).toContain("Kto zabija");
  });

  it("pauses after five refusals in a row instead of hammering ELI", async () => {
    const store = tempDir("lex-core-store-");
    const { eli, index } = later(store, Date.parse("2026-09-23T12:00:00Z"), { deny: true });
    await index.refresh();
    expect(eli.requested).toHaveLength(5);
    await index.refresh();
    expect(eli.requested).toHaveLength(5);
  });
});
