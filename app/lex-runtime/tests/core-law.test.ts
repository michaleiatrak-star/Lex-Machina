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
import { CoreLawToolRuntime } from "../src/core-law-tool-runtime.js";

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

function fakeEli(options: { deny?: boolean } = {}) {
  const requested: string[] = [];
  const fetcher = async (url: string) => {
    requested.push(url);
    if (options.deny) return new Response("", { status: 403 });
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
    expect(JSON.parse(search!.content).hits.map((hit: { article: string }) => hit.article)).toEqual(["148", "148a"]);
    expect(JSON.parse(missing!.content)).toEqual({ status: "BLOCKED", error: "CORE_LAW_ARTICLE_NOT_FOUND" });
  });

  it("keeps the last good text and pauses when ELI refuses access", async () => {
    const store = tempDir("lex-core-store-");
    let now = Date.parse("2026-09-23T12:00:00Z");
    const good = fakeEli();
    const first = new CoreLawIndex(store, good.fetcher as never, good.pdf as never, () => now, 0);
    first.load(corpus());
    await first.refresh();

    now += 25 * 60 * 60 * 1000;
    const denied = fakeEli({ deny: true });
    const second = new CoreLawIndex(store, denied.fetcher as never, denied.pdf as never, () => now, 0);
    second.load(corpus());
    await second.refresh();
    // Five consecutive refusals stop the run instead of hammering the API.
    expect(denied.requested).toHaveLength(5);
    const kk = second.summaries().find((act) => act.eli === "DU/2025/383")!;
    expect(kk).toMatchObject({ articleCount: 3, lastError: "ELI_HTTP_403" });
    expect(second.record("DU/2025/383")!.articles["148"]).toContain("Kto zabija");

    await second.refresh();
    expect(denied.requested).toHaveLength(5);
  });
});
