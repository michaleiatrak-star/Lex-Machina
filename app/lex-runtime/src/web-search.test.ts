import {
  describe,
  expect,
  it
} from "vitest";
import {
  LegalFederationToolRuntime
} from "./legal-federation-tool-runtime.js";
import {
  PublicWebSearch,
  assertPublicWebSearchQuery,
  classifyWebSearchHits,
  parseDuckDuckGoHtml,
  type WebSearchProvider
} from "./web-search.js";

const DDG_HTML = `
<div class="result">
  <a rel="nofollow" class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fisap.sejm.gov.pl%2Fisap.nsf%2Fdocument.xsp&amp;rut=x">Kodeks <b>cywilny</b></a>
  <a class="result__snippet" href="//duckduckgo.com/l/?uddg=x">Ustawa z dnia 23 kwietnia 1964 r. &amp; zmiany</a>
</div>
<div class="result">
  <a rel="nofollow" class="result__a" href="https://example.com/artykul">Komentarz</a>
  <a class="result__snippet" href="https://example.com/artykul">Opis</a>
</div>`;

describe("web_search", () => {
  it("parses DuckDuckGo HTML results and decodes redirect URLs", () => {
    expect(
      parseDuckDuckGoHtml(DDG_HTML, 5)
    ).toEqual([
      {
        title: "Kodeks cywilny",
        url: "https://isap.sejm.gov.pl/isap.nsf/document.xsp",
        snippet: "Ustawa z dnia 23 kwietnia 1964 r. & zmiany"
      },
      {
        title: "Komentarz",
        url: "https://example.com/artykul",
        snippet: "Opis"
      }
    ]);
  });

  it("classifies hits into source tiers and never treats unknown hosts above R3", () => {
    const [official, unknown] =
      classifyWebSearchHits(
        parseDuckDuckGoHtml(DDG_HTML, 5)
      );
    expect(official?.sourceTier).toBe("R1");
    expect(official?.nextStep).toContain("verify_legal_reference");
    expect(unknown?.sourceTier).toBe("R3");
    expect(unknown?.nextStep).toContain("fetch_auxiliary_legal_source");
  });

  it("blocks queries carrying pseudonymized case data", () => {
    expect(() =>
      assertPublicWebSearchQuery(
        "wyrok [PII:PERSON:0001] alimenty"
      )
    ).toThrow("WEB_SEARCH_CASE_DATA_FORBIDDEN");
    expect(() =>
      assertPublicWebSearchQuery("x".repeat(301))
    ).toThrow("WEB_SEARCH_QUERY_INVALID");
    expect(
      assertPublicWebSearchQuery("  termin  apelacji  ")
    ).toBe("termin apelacji");
  });

  it("uses Brave when a key is configured and falls back to DuckDuckGo", async () => {
    const requested: string[] = [];
    const fetchImpl = (async (input: URL | RequestInfo) => {
      const url = String(input);
      requested.push(new URL(url).hostname);
      if (url.includes("brave.com")) {
        return new Response("", { status: 500 });
      }
      return new Response(DDG_HTML, { status: 200 });
    }) as typeof fetch;
    const search =
      new PublicWebSearch(
        { BRAVE_SEARCH_API_KEY: "key" },
        fetchImpl
      );
    const response =
      await search.search("kodeks cywilny", 1);
    expect(requested).toEqual([
      "api.search.brave.com",
      "html.duckduckgo.com"
    ]);
    expect(response.provider).toBe("duckduckgo");
    expect(response.hits).toHaveLength(1);
  });

  it("can be disabled by configuration", async () => {
    await expect(
      new PublicWebSearch(
        { LEX_WEB_SEARCH_PROVIDER: "off" }
      ).search("x", 1)
    ).rejects.toThrow("WEB_SEARCH_DISABLED");
  });

  it("is exposed through the provider-agnostic Lex tool runtime", async () => {
    const provider: WebSearchProvider = {
      search: async () => ({
        provider: "duckduckgo",
        hits: parseDuckDuckGoHtml(DDG_HTML, 5)
      })
    };
    const runtime =
      new LegalFederationToolRuntime(
        undefined,
        provider
      );
    expect(runtime.handles("web_search")).toBe(true);
    expect(
      runtime.systemPromptAppendix()
    ).toContain("web_search");

    const [ok, blocked] =
      await runtime.runTools([
        {
          id: "s1",
          name: "web_search",
          input: { query: "kodeks cywilny" }
        },
        {
          id: "s2",
          name: "web_search",
          input: { query: "[PII:PERSON:0001] rozwód" }
        }
      ]);
    const payload =
      JSON.parse(ok!.content) as {
        status: string;
        results: Array<{ sourceTier: string }>;
      };
    expect(payload.status).toBe("OK");
    expect(
      payload.results.map((item) => item.sourceTier)
    ).toEqual(["R1", "R3"]);
    expect(
      JSON.parse(blocked!.content).status
    ).toBe("POLICY_BLOCKED");
  });
});
