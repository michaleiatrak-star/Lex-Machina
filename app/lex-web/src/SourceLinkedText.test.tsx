import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SourceLinkedText } from "./SourceLinkedText.js";

describe("SourceLinkedText", () => {
  it("renders normal HTTPS markdown sources as active links", () => {
    const html = renderToStaticMarkup(
      <SourceLinkedText content={"[Akt prawny](https://api.sejm.gov.pl/eli/acts/DU/1997/553/text.html)"} />
    );
    expect(html).toContain('href="https://api.sejm.gov.pl/eli/acts/DU/1997/553/text.html"');
    expect(html).toContain(">Akt prawny</a>");
  });

  it("repairs the escaped nested link form emitted by an account model", () => {
    const html = renderToStaticMarkup(
      <SourceLinkedText
        content={"[Orzeczenie]\\([https://sn.pl/case](https://sn.pl/case))"}
      />
    );
    expect(html).toContain('href="https://sn.pl/case"');
    expect(html).toContain(">Orzeczenie</a>");
  });

  it("does not activate non-HTTPS text", () => {
    const html = renderToStaticMarkup(
      <SourceLinkedText content={"http://example.com/source"} />
    );
    expect(html).not.toContain("<a");
    expect(html).toContain("http://example.com/source");
  });
});
