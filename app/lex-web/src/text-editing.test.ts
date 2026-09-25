import { describe, expect, it } from "vitest";
import {
  applyFormat,
  countOccurrences,
  decodeTextFile,
  editedFilename,
  findNext,
  parseMarkdown,
  replaceAll
} from "./text-editing.js";
import { previewKind } from "./WorkspaceManager.js";

describe("text file editing", () => {
  it("wraps and unwraps inline formatting around the selection", () => {
    const bold = applyFormat({ text: "Sąd Rejonowy", start: 0, end: 3 }, "bold");
    expect(bold).toEqual({ text: "**Sąd** Rejonowy", start: 2, end: 5 });
    expect(applyFormat(bold, "bold")).toEqual({ text: "Sąd Rejonowy", start: 0, end: 3 });
  });

  it("toggles line formats over every selected line", () => {
    const text = "pierwszy\ndrugi\ntrzeci";
    const numbered = applyFormat({ text, start: 2, end: 12 }, "numbered");
    expect(numbered.text).toBe("1. pierwszy\n2. drugi\ntrzeci");
    expect(applyFormat(numbered, "numbered").text).toBe(text);
    expect(applyFormat({ text: "- punkt", start: 0, end: 0 }, "h2").text).toBe("## punkt");
  });

  it("finds and replaces case-insensitively in Polish", () => {
    const text = "Pozwany ŻĄDA zapłaty. Powód żąda odsetek.";
    expect(countOccurrences(text, "żąda", false)).toBe(2);
    expect(countOccurrences(text, "żąda", true)).toBe(1);
    expect(findNext(text, "żąda", 20, false)).toEqual({ start: 28, end: 32 });
    expect(findNext(text, "żąda", 35, false)).toEqual({ start: 8, end: 12 });
    expect(replaceAll(text, "żąda", "wnosi o", false)).toEqual({
      text: "Pozwany wnosi o zapłaty. Powód wnosi o odsetek.",
      count: 2
    });
    expect(replaceAll("a.b", ".", "-", true).text).toBe("a-b");
  });

  it("reads legacy Windows-1250 files", () => {
    // "Łódź" in Windows-1250
    expect(decodeTextFile(new Uint8Array([0xa3, 0xf3, 0x64, 0x9f]))).toEqual({
      text: "Łódź",
      encoding: "windows-1250"
    });
    expect(decodeTextFile(new TextEncoder().encode("﻿Łódź")).text).toBe("Łódź");
  });

  it("never overwrites the original: edits get a new name", () => {
    expect(editedFilename("pozew.txt")).toBe("pozew (edycja).txt");
    expect(editedFilename("pozew (edycja).txt")).toBe("pozew (edycja 2).txt");
    expect(editedFilename("pozew (edycja 2).md")).toBe("pozew (edycja 3).md");
  });

  it("parses the Markdown subset into blocks", () => {
    expect(parseMarkdown("# Pozew\n\nWnoszę o **zapłatę** kwoty _1000 zł_.\n\n1. odsetki\n2. koszty\n\n> cytat\n\n---")).toEqual([
      { kind: "heading", level: 1, content: [{ kind: "text", text: "Pozew" }] },
      {
        kind: "paragraph",
        content: [
          { kind: "text", text: "Wnoszę o " },
          { kind: "bold", children: [{ kind: "text", text: "zapłatę" }] },
          { kind: "text", text: " kwoty " },
          { kind: "italic", children: [{ kind: "text", text: "1000 zł" }] },
          { kind: "text", text: "." }
        ]
      },
      {
        kind: "list",
        ordered: true,
        items: [[{ kind: "text", text: "odsetki" }], [{ kind: "text", text: "koszty" }]]
      },
      { kind: "quote", content: [{ kind: "text", text: "cytat" }] },
      { kind: "rule" }
    ]);
    expect(parseMarkdown("plik_nazwa_v2")).toEqual([
      { kind: "paragraph", content: [{ kind: "text", text: "plik_nazwa_v2" }] }
    ]);
  });

  it("chooses a preview for PDF, text and images", () => {
    expect(previewKind("application/pdf", "a.pdf")).toBe("pdf");
    expect(previewKind("application/octet-stream", "wyrok.PDF")).toBe("pdf");
    expect(previewKind("text/plain; charset=utf-8", "a.txt")).toBe("text");
    expect(previewKind("application/octet-stream", "notatka.md")).toBe("text");
    expect(previewKind("image/png", "skan.png")).toBe("image");
    expect(previewKind("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "a.docx")).toBe("document");
    expect(previewKind("application/octet-stream", "umowa.odt")).toBe("document");
    expect(previewKind("text/csv", "lista.csv")).toBe("sheet");
    expect(previewKind("application/vnd.ms-excel.sheet.macroenabled.12", "a.xlsm")).toBe("sheet");
    expect(previewKind("application/msword", "stary.doc")).toBe("none");
  });
});
