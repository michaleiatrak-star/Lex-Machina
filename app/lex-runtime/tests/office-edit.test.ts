import { describe, expect, it } from "vitest";
import { LocalOfficeEditor, editableMediaType, type EditableDocument, type EditableSheets } from "../src/office-edit.js";

const editor = new LocalOfficeEditor();

const document: EditableDocument = {
  kind: "document",
  blocks: [
    { type: "heading", level: 1, runs: [{ text: "POZEW O ZAPŁATĘ", b: false, i: false, u: false }] },
    {
      type: "paragraph",
      runs: [
        { text: "Powód ", b: false, i: false, u: false },
        { text: "wnosi", b: true, i: false, u: false },
        { text: " o zasądzenie", b: false, i: true, u: true }
      ]
    },
    { type: "list", ordered: true, items: [[{ text: "pierwszy", b: false, i: false, u: false }]] },
    { type: "list", ordered: false, items: [[{ text: "punkt", b: false, i: false, u: false }]] },
    { type: "table", rows: [["Kwota", "1000,00 zł"], ["Odsetki", "ustawowe"]] }
  ]
};

describe("office editor worker", () => {
  it.each(["docx", "odt"] as const)("round-trips a document through %s", async (format) => {
    const bytes = await editor.write(format, document);
    const mediaType = editableMediaType("", `pismo.${format}`)!;
    expect(await editor.read(bytes, mediaType)).toEqual(document);
  });

  it("round-trips sheets through xlsx keeping formulas and identifiers as text", async () => {
    const model: EditableSheets = {
      kind: "sheet",
      truncated: false,
      sheets: [
        { name: "Roszczenia", rows: [["Pozycja", "Kwota"], ["Czynsz", "1200.5"], ["Suma", "=SUM(B2:B2)"]] },
        { name: "Strony", rows: [["PESEL", "00000000000"], ["NIP", "0123456789"]] }
      ]
    };
    const bytes = await editor.write("xlsx", model);
    const read = await editor.read(bytes, editableMediaType("application/octet-stream", "a.xlsx")!);
    expect(read).toMatchObject({ kind: "sheet", truncated: false, sheets: model.sheets });
  });

  it("writes CSV with the requested delimiter and reads it back", async () => {
    const model: EditableSheets = {
      kind: "sheet",
      truncated: false,
      sheets: [{ name: "Arkusz1", rows: [["Imię", "Kwota"], ["Zażółć; gęślą", "10"]] }]
    };
    const bytes = await editor.write("csv", model, ";");
    const read = (await editor.read(bytes, "text/csv")) as EditableSheets;
    expect(read.sheets[0]!.rows).toEqual(model.sheets[0]!.rows);
  });

  it("rejects files that are not what they claim", async () => {
    await expect(editor.read(Buffer.from("not a zip"), editableMediaType("", "a.docx")!)).rejects.toThrow(
      /OFFICE_EDIT_|SPREADSHEET_/
    );
    await expect(editor.read(Buffer.from("x"), "application/msword")).rejects.toThrow(
      "OFFICE_EDIT_MEDIA_TYPE_UNSUPPORTED"
    );
  });

  it("resolves editable media types from type or extension", () => {
    expect(editableMediaType("text/csv; charset=utf-8", "a.txt")).toBe("text/csv");
    expect(editableMediaType("application/octet-stream", "Umowa.ODT")).toBe("application/vnd.oasis.opendocument.text");
    expect(editableMediaType("application/pdf", "a.pdf")).toBeNull();
  });
});
