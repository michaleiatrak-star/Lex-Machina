import { describe, expect, it } from "vitest";
import {
  blocksFromDom,
  columnLabel,
  normalizeRows,
  sheetFormatFor,
  trimRows,
  withExtension,
  type NodeLike
} from "./office-editing.js";

const text = (value: string): NodeLike => ({ nodeType: 3, nodeName: "#text", textContent: value, childNodes: [] });
const el = (name: string, ...children: NodeLike[]): NodeLike => ({
  nodeType: 1,
  nodeName: name.toUpperCase(),
  textContent: null,
  childNodes: children
});

describe("document editor DOM to blocks", () => {
  it("reads headings, formatted runs, lists and tables", () => {
    const root = el(
      "div",
      el("h1", text("POZEW")),
      el("p", text("Powód "), el("b", text("Jan "), el("i", text("Kowalski"))), text(" wnosi")),
      el("ol", el("li", text("pierwszy")), el("li", el("u", text("drugi")))),
      el("table", el("tbody", el("tr", el("td", text("Kwota")), el("td", text("1000 zł")))))
    );
    expect(blocksFromDom(root)).toEqual([
      { type: "heading", level: 1, runs: [{ text: "POZEW", b: false, i: false, u: false }] },
      {
        type: "paragraph",
        runs: [
          { text: "Powód ", b: false, i: false, u: false },
          { text: "Jan ", b: true, i: false, u: false },
          { text: "Kowalski", b: true, i: true, u: false },
          { text: " wnosi", b: false, i: false, u: false }
        ]
      },
      {
        type: "list",
        ordered: true,
        items: [
          [{ text: "pierwszy", b: false, i: false, u: false }],
          [{ text: "drugi", b: false, i: false, u: true }]
        ]
      },
      { type: "table", rows: [["Kwota", "1000 zł"]] }
    ]);
  });

  it("splits lines at <br>, keeps empty paragraphs and unwraps browser divs", () => {
    const root = el(
      "div",
      el("p", el("br")),
      el("div", el("p", text("a"), el("br"), text("b"))),
      text("luźny tekst"),
      el("h5", el("strong", text("sekcja")))
    );
    expect(blocksFromDom(root)).toEqual([
      { type: "paragraph", runs: [] },
      { type: "paragraph", runs: [{ text: "a", b: false, i: false, u: false }] },
      { type: "paragraph", runs: [{ text: "b", b: false, i: false, u: false }] },
      { type: "paragraph", runs: [{ text: "luźny tekst", b: false, i: false, u: false }] },
      { type: "heading", level: 3, runs: [{ text: "sekcja", b: true, i: false, u: false }] }
    ]);
  });

  it("reads list items whose node fields are prototype getters, as in the DOM", () => {
    class DomNode {
      constructor(private readonly type: number, private readonly name: string, private readonly value: string | null, private readonly children: NodeLike[]) {}
      get nodeType() { return this.type; }
      get nodeName() { return this.name; }
      get textContent() { return this.value; }
      get childNodes() { return this.children; }
    }
    const li = new DomNode(1, "LI", null, [new DomNode(3, "#text", "wniosek", [])]);
    const root = new DomNode(1, "DIV", null, [new DomNode(1, "OL", null, [li])]);
    expect(blocksFromDom(root)).toEqual([
      { type: "list", ordered: true, items: [[{ text: "wniosek", b: false, i: false, u: false }]] }
    ]);
  });

  it("reads CSS bold from spans", () => {
    const span: NodeLike = { ...el("span", text("x")), style: { fontWeight: "700" } };
    expect(blocksFromDom(el("div", el("p", span)))).toEqual([
      { type: "paragraph", runs: [{ text: "x", b: true, i: false, u: false }] }
    ]);
  });
});

describe("sheet helpers", () => {
  it("labels columns like a spreadsheet", () => {
    expect([0, 25, 26, 51, 52, 701, 702].map(columnLabel)).toEqual(["A", "Z", "AA", "AZ", "BA", "ZZ", "AAA"]);
  });

  it("pads for editing and trims for saving", () => {
    expect(normalizeRows([["a"], ["b", "c", "d"]])).toEqual([["a", "", ""], ["b", "c", "d"]]);
    expect(trimRows([["a", "", ""], ["", "", ""], ["", "", ""]])).toEqual([["a"]]);
    expect(trimRows([["", "x"], ["", ""]])).toEqual([["", "x"]]);
  });

  it("picks save names and formats", () => {
    expect(withExtension("zestawienie (edycja).xlsm", "xlsx")).toBe("zestawienie (edycja).xlsx");
    expect(sheetFormatFor("text/csv", "a.csv")).toBe("csv");
    expect(sheetFormatFor("application/vnd.ms-excel.sheet.macroenabled.12", "a.xlsm")).toBe("xlsx");
  });
});
